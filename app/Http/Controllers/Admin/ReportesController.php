<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Asistencia;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportesController extends Controller
{
    /**
     * Mostrar página de reportes con datos de la base de datos
     */
    public function index(Request $request): Response
    {
        // Obtener todos los instructores para los filtros
        $instructores = Instructor::orderBy('nombres', 'asc')->get();

        // Construir la consulta base para reportes
        $query = $this->buildReportQuery($request);

        // Paginar los resultados
        $reportesData = $query->paginate(20);

        // Transformar datos para la vista
        $reportesData->through(function ($asistencia) {
            return $this->transformAsistenciaForReport($asistencia);
        });

        // Obtener estadísticas para la página
        $estadisticas = $this->getEstadisticasReportes($request);

        // Obtener áreas únicas de instructores
        $areas = Instructor::whereNotNull('area_asignada')
            ->distinct()
            ->pluck('area_asignada')
            ->filter()
            ->sort()
            ->values();

        return Inertia::render('Admin/Reportes', [
            'instructores' => $instructores->map(function($instructor) {
                return [
                    'id' => $instructor->id,
                    'nombres' => $instructor->nombres,
                    'apellidos' => $instructor->apellidos,
                    'area_asignada' => $instructor->area_asignada
                ];
            }),
            'reportesData' => $reportesData->items(),
            'estadisticas' => $estadisticas,
            'filtros' => $request->only(['fechaInicio', 'fechaFin', 'instructor', 'area']),
            'areas' => $areas,
            'pagination' => [
                'current_page' => $reportesData->currentPage(),
                'last_page' => $reportesData->lastPage(),
                'per_page' => $reportesData->perPage(),
                'total' => $reportesData->total(),
                'from' => $reportesData->firstItem(),
                'to' => $reportesData->lastItem(),
            ]
        ]);
    }

    /**
     * Exportar reporte a Excel (XLSX)
     */
    public function exportar(Request $request)
    {
        $query = $this->buildReportQuery($request);
        
        // Obtener TODOS los datos sin paginar
        $asistencias = $query->get();

        // Agrupar asistencias por instructor y fecha
        $asistenciasAgrupadas = $asistencias->groupBy(function($asistencia) {
            return $asistencia->instructor_id . '_' . Carbon::parse($asistencia->fecha_hora_registro)->format('Y-m-d');
        });

        // Preparar datos para exportar
        $datos = [];
        foreach ($asistenciasAgrupadas as $grupo) {
            $entrada = $grupo->where('tipo_movimiento', 'entrada')->first();
            $salida = $grupo->where('tipo_movimiento', 'salida')->first();
            
            if (!$entrada) continue;
            
            $instructor = $entrada->instructor;
            $fecha = Carbon::parse($entrada->fecha_hora_registro);
            
            $horaEntrada = $fecha->format('H:i');
            $horaSalida = $salida ? Carbon::parse($salida->fecha_hora_registro)->format('H:i') : '-';
            
            // Calcular horas trabajadas
            $horasTrabajadas = $this->calcularHorasTrabajadas(
                $entrada->fecha_hora_registro, 
                $salida ? $salida->fecha_hora_registro : null
            );
            
            // Determinar estado
            $estado = 'Incompleto';
            if ($salida) {
                $estado = $entrada->es_tardanza ? 'Tarde' : 'Completo';
            } else {
                $estado = $entrada->es_tardanza ? 'Tarde (Sin salida)' : 'Sin salida';
            }
            
            $datos[] = [
                'instructor' => $instructor ? $instructor->nombres . ' ' . $instructor->apellidos : 'Sin instructor',
                'area' => $instructor ? ($instructor->area_asignada ?? 'No asignada') : 'No disponible',
                'fecha' => $fecha->format('d/m/Y'),
                'horaEntrada' => $horaEntrada,
                'horaSalida' => $horaSalida,
                'horasTrabajadas' => $horasTrabajadas,
                'estado' => $estado,
                'observaciones' => $entrada->observaciones ?? ''
            ];
        }

        // Usar Laravel Excel para exportar
        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\AsistenciasExport($datos),
            'reporte_asistencias_' . now()->format('Y-m-d_H-i-s') . '.xlsx'
        );
    }

    /**
     * Construir consulta base para reportes
     */
    private function buildReportQuery(Request $request)
    {
        $query = Asistencia::with(['instructor'])
            ->orderBy('fecha_hora_registro', 'desc');

        // Filtro por rango de fechas
        if ($request->filled('fechaInicio') && $request->filled('fechaFin')) {
            $fechaInicio = Carbon::parse($request->fechaInicio)->startOfDay();
            $fechaFin = Carbon::parse($request->fechaFin)->endOfDay();
            $query->whereBetween('fecha_hora_registro', [$fechaInicio, $fechaFin]);
        } elseif ($request->filled('fechaInicio')) {
            $fechaInicio = Carbon::parse($request->fechaInicio)->startOfDay();
            $query->whereDate('fecha_hora_registro', '>=', $fechaInicio);
        } elseif ($request->filled('fechaFin')) {
            $fechaFin = Carbon::parse($request->fechaFin)->endOfDay();
            $query->whereDate('fecha_hora_registro', '<=', $fechaFin);
        } else {
            // Si no hay filtros de fecha, mostrar los últimos 30 días por defecto
            $query->where('fecha_hora_registro', '>=', now()->subDays(30));
        }

        // Filtro por instructor
        if ($request->filled('instructor')) {
            $query->where('instructor_id', $request->instructor);
        }

        // Filtro por área
        if ($request->filled('area')) {
            $query->whereHas('instructor', function($q) use ($request) {
                $q->where('area_asignada', $request->area);
            });
        }

        return $query;
    }

    /**
     * Transformar asistencia para mostrar en reporte
     */
    private function transformAsistenciaForReport($asistencia)
    {
        $instructor = $asistencia->instructor;
        $fecha = Carbon::parse($asistencia->fecha_hora_registro);
        
        // Buscar la salida correspondiente del mismo día
        $salidaDelDia = null;
        if ($asistencia->tipo_movimiento === 'entrada') {
            $salidaDelDia = Asistencia::where('instructor_id', $asistencia->instructor_id)
                ->where('tipo_movimiento', 'salida')
                ->whereDate('fecha_hora_registro', $fecha->format('Y-m-d'))
                ->first();
        }
        
        // Buscar la entrada correspondiente si este es un registro de salida
        $entradaDelDia = null;
        if ($asistencia->tipo_movimiento === 'salida') {
            $entradaDelDia = Asistencia::where('instructor_id', $asistencia->instructor_id)
                ->where('tipo_movimiento', 'entrada')
                ->whereDate('fecha_hora_registro', $fecha->format('Y-m-d'))
                ->first();
        }
        
        // Calcular horas trabajadas
        $horasTrabajadas = '-';
        if ($asistencia->tipo_movimiento === 'entrada' && $salidaDelDia) {
            $horasTrabajadas = $this->calcularHorasTrabajadas($asistencia->fecha_hora_registro, $salidaDelDia->fecha_hora_registro);
        } elseif ($asistencia->tipo_movimiento === 'salida' && $entradaDelDia) {
            $horasTrabajadas = $this->calcularHorasTrabajadas($entradaDelDia->fecha_hora_registro, $asistencia->fecha_hora_registro);
        }
        
        // Formatear las horas con consistencia - SIEMPRE mostrar horas completas
        $horaEntrada = '-';
        $horaSalida = '-';
        
        if ($asistencia->tipo_movimiento === 'entrada') {
            $horaEntrada = $fecha->format('H:i:s'); // Incluir segundos para mayor precisión
        } elseif ($entradaDelDia) {
            $horaEntrada = Carbon::parse($entradaDelDia->fecha_hora_registro)->format('H:i:s');
        }
        
        if ($asistencia->tipo_movimiento === 'salida') {
            $horaSalida = $fecha->format('H:i:s'); // Incluir segundos para mayor precisión
        } elseif ($salidaDelDia) {
            $horaSalida = Carbon::parse($salidaDelDia->fecha_hora_registro)->format('H:i:s');
        }
        
        // Determinar estado
        $estado = 'Incompleto';
        if ($asistencia->tipo_movimiento === 'entrada') {
            if ($salidaDelDia) {
                $estado = $asistencia->es_tardanza ? 'Tarde' : 'Completo';
            } else {
                $estado = $asistencia->es_tardanza ? 'Tarde (Sin salida)' : 'Sin salida';
            }
        } else { // salida
            if ($entradaDelDia) {
                $estado = $entradaDelDia->es_tardanza ? 'Tarde' : 'Completo';
            } else {
                $estado = 'Salida sin entrada';
            }
        }
        
        return [
            'id' => $asistencia->id,
            'instructor' => $instructor ? $instructor->nombres . ' ' . $instructor->apellidos : 'Sin instructor',
            'area' => $instructor ? ($instructor->area_asignada ?? 'No asignada') : 'No disponible',
            'fecha' => $fecha->format('d/m/Y'),
            'horaEntrada' => $horaEntrada,
            'horaSalida' => $horaSalida,
            'horasTrabajadas' => $horasTrabajadas,
            'estado' => $estado,
            'tipo_movimiento' => $asistencia->tipo_movimiento,
            'es_tardanza' => $asistencia->es_tardanza,
            'observaciones' => $asistencia->observaciones,
            // Agregar información adicional para debugging
            'fecha_hora_completa' => $fecha->format('d/m/Y H:i:s'),
        ];
    }

    /**
     * Calcular horas trabajadas de manera precisa
     */
    private function calcularHorasTrabajadas($fechaHoraEntrada, $fechaHoraSalida)
    {
        if (!$fechaHoraEntrada || !$fechaHoraSalida) {
            return '-';
        }

        try {
            $inicio = Carbon::parse($fechaHoraEntrada);
            $fin = Carbon::parse($fechaHoraSalida);
            
            // Verificar que la salida sea después de la entrada
            if ($fin->lessThan($inicio)) {
                return 'Error';
            }
            
            // Calcular la diferencia en minutos totales
            $totalMinutos = $inicio->diffInMinutes($fin);
            
            // Convertir a horas y minutos
            $horas = intval($totalMinutos / 60);
            $minutos = $totalMinutos % 60;
            
            // Formatear como HH:MM
            return sprintf('%02d:%02d', $horas, $minutos);
            
        } catch (Exception $e) {
            return 'Error';
        }
    }

    /**
     * Obtener estadísticas para la página de reportes
     */
    private function getEstadisticasReportes(Request $request)
    {
        // Establecer rango de fechas para las estadísticas
        if ($request->filled('fechaInicio') && $request->filled('fechaFin')) {
            $fechaInicio = Carbon::parse($request->fechaInicio)->startOfDay();
            $fechaFin = Carbon::parse($request->fechaFin)->endOfDay();
        } elseif ($request->filled('fechaInicio')) {
            $fechaInicio = Carbon::parse($request->fechaInicio)->startOfDay();
            $fechaFin = now()->endOfDay();
        } elseif ($request->filled('fechaFin')) {
            $fechaInicio = now()->startOfMonth();
            $fechaFin = Carbon::parse($request->fechaFin)->endOfDay();
        } else {
            // Estadísticas del día actual
            $fechaInicio = today()->startOfDay();
            $fechaFin = today()->endOfDay();
        }

        $queryBase = Asistencia::whereBetween('fecha_hora_registro', [$fechaInicio, $fechaFin]);

        // Aplicar filtros adicionales
        if ($request->filled('instructor')) {
            $queryBase = $queryBase->where('instructor_id', $request->instructor);
        }

        if ($request->filled('area')) {
            $queryBase = $queryBase->whereHas('instructor', function($q) use ($request) {
                $q->where('area_asignada', $request->area);
            });
        }

        $totalInstructores = Instructor::count();
        
        // Contar presencias únicas (instructores que registraron entrada)
        $presentesHoy = (clone $queryBase)
            ->where('tipo_movimiento', 'entrada')
            ->distinct('instructor_id')
            ->count();

        // Contar llegadas tarde
        $tardesHoy = (clone $queryBase)
            ->where('tipo_movimiento', 'entrada')
            ->where('es_tardanza', true)
            ->count();

        // Calcular ausentes (total de instructores menos los que estuvieron presentes)
        $ausentesHoy = max(0, $totalInstructores - $presentesHoy);

        // Calcular promedio de asistencia
        $promedioAsistencia = $totalInstructores > 0 ? 
            round(($presentesHoy / $totalInstructores) * 100, 1) . '%' : '0%';

        return [
            'totalInstructores' => $totalInstructores,
            'presentesHoy' => $presentesHoy,
            'ausentesHoy' => $ausentesHoy,
            'tardesHoy' => $tardesHoy,
            'promedioAsistencia' => $promedioAsistencia,
            'periodo' => [
                'inicio' => $fechaInicio->format('d/m/Y'),
                'fin' => $fechaFin->format('d/m/Y')
            ]
        ];
    }
}