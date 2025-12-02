<?php

namespace App\Http\Controllers;

use App\Models\Instructor;
use App\Models\Asistencia;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class AsistenciaController extends Controller
{
    /**
     * Dashboard principal para guardias - Vista de historial de instructores
     */
    public function dashboard(): Response
    {
        $guardia = auth()->user();
        
        // Obtener notificaciones recientes (últimos 30 minutos)
        $notificacionesRecientes = Asistencia::with(['instructor'])
            ->where('fecha_hora_registro', '>=', now()->subMinutes(30))
            ->where('guardia_id', $guardia->id)
            ->orderBy('fecha_hora_registro', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($asistencia) {
                return [
                    'id' => $asistencia->id,
                    'mensaje' => $this->generarMensajeNotificacion($asistencia),
                    'tipo' => $this->determinarTipoNotificacion($asistencia),
                    'timestamp' => $asistencia->fecha_hora_registro->format('H:i')
                ];
            });

        // Obtener registros de asistencia del día actual
        $todasAsistencias = Asistencia::with(['instructor'])
            ->whereDate('fecha_hora_registro', today())
            ->orderBy('fecha_hora_registro', 'desc')
            ->get();

        // Agrupar asistencias por instructor y fecha
        $registrosAgrupados = $todasAsistencias->groupBy(function($asistencia) {
            return $asistencia->instructor_id . '_' . Carbon::parse($asistencia->fecha_hora_registro)->format('Y-m-d');
        })->map(function($grupo) {
            // Separar entrada y salida
            $entrada = $grupo->where('tipo_movimiento', 'entrada')->first();
            $salida = $grupo->where('tipo_movimiento', 'salida')->first();
            
            // Usar la primera asistencia para datos base
            $asistenciaBase = $grupo->first();
            $instructor = $asistenciaBase->instructor;
            
            if (!$instructor) {
                return null;
            }
            
            $nombreCompleto = trim($instructor->nombres . ' ' . $instructor->apellidos);
            
            return [
                'id' => $asistenciaBase->id,
                'instructor' => $nombreCompleto,
                'area' => $instructor->area_asignada ?? 'N/A',
                'fecha' => Carbon::parse($asistenciaBase->fecha_hora_registro)->format('d/m/Y'),
                'horaEntrada' => $entrada ? $entrada->fecha_hora_registro->format('H:i') : '--',
                'horaSalida' => $salida ? $salida->fecha_hora_registro->format('H:i') : '--',
                'asistencia' => $this->determinarEstadoAsistenciaAgrupada($entrada, $salida),
                'color' => $this->obtenerColorEstadoAgrupado($entrada, $salida)
            ];
        })->filter()->values(); // Filtrar nulls y reindexar

        // Obtener notificaciones recientes
        $notificaciones = [];

        // Obtener instructores activos con información completa
        $instructores = Instructor::activos()
            ->select('id', 'nombres', 'apellidos', 'area_asignada', 'documento_identidad', 'email')
            ->orderBy('nombres')
            ->get()
            ->map(function ($instructor) {
                return [
                    'id' => $instructor->id,
                    'name' => trim($instructor->nombres . ' ' . $instructor->apellidos),
                    'nombres' => $instructor->nombres,
                    'apellidos' => $instructor->apellidos,
                    'area' => $instructor->area_asignada,
                    'cedula' => $instructor->documento_identidad,
                    'email' => $instructor->email
                ];
            });

        return Inertia::render('Guardia/Dashboard', [
            'registros' => $registrosAgrupados,
            'instructores' => $instructores,
            'notificaciones' => $notificacionesRecientes,
            'guardia' => $guardia
        ]);
    }

    /**
     * Registrar asistencia mediante código de barras
     */
    public function registrarAsistencia(Request $request): JsonResponse
    {
        $request->validate([
            'cedula' => 'required|string',
            'tipo_registro' => 'required|in:entrada,salida',
        ]);

        $guardia = auth()->user();
        
        // Buscar instructor por cédula
        $instructor = Instructor::where('cedula', $request->cedula)->first();
        
        if (!$instructor) {
            return response()->json([
                'success' => false,
                'message' => 'Instructor no encontrado con esa cédula'
            ], 404);
        }

        // Crear registro de asistencia
        $ahora = now();
        $esLlegadaTardia = false;
        $estadoRegistro = 'normal';
        $observaciones = '';

        // Verificar si es llegada tardía (después de las 7:15 AM)
        if ($request->tipo_registro === 'entrada' && $ahora->format('H:i') > '07:15') {
            $esLlegadaTardia = true;
            $estadoRegistro = 'novedad';
            $observaciones = 'Llegada tardía registrada';
        }

        $asistencia = Asistencia::create([
            'instructor_id' => $instructor->id,
            'guardia_id' => $guardia->id,
            'tipo_movimiento' => $request->tipo_registro,
            'fecha_hora_registro' => $ahora,
            'es_tardanza' => $esLlegadaTardia,
            'observaciones' => $observaciones,
            'estado_registro' => $estadoRegistro,
        ]);

        // Generar notificación para el frontend
        $notificacion = [
            'id' => $asistencia->id,
            'mensaje' => $this->generarMensajeNotificacion($asistencia),
            'tipo' => $this->determinarTipoNotificacion($asistencia),
            'timestamp' => $ahora->format('H:i')
        ];

        return response()->json([
            'success' => true,
            'message' => $this->getMensajeExito($request->tipo_registro, $instructor),
            'asistencia' => $asistencia->load(['instructor']),
            'notificacion' => $notificacion
        ]);
    }

    /**
     * Mostrar historial de asistencias con datos reales de la base de datos
     */
    public function historial(Request $request): Response
    {
        // Construir consulta base con relaciones
        $query = Asistencia::with(['instructor'])
            ->orderBy('fecha_hora_registro', 'desc');

        // Aplicar filtros si existen
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->whereHas('instructor', function($q) use ($search) {
                $q->where('nombres', 'like', "%{$search}%")
                  ->orWhere('apellidos', 'like', "%{$search}%")
                  ->orWhere('documento_identidad', 'like', "%{$search}%");
            });
        }

        // Aplicar filtros simultáneamente
        if ($request->filled('filter_hora')) {
            $filterHora = $request->get('filter_hora');
            switch($filterHora) {
                case 'manana':
                    $query->whereTime('fecha_hora_registro', '>=', '06:00:00')
                          ->whereTime('fecha_hora_registro', '<=', '12:00:00');
                    break;
                case 'tarde':
                    $query->whereTime('fecha_hora_registro', '>=', '12:01:00')
                          ->whereTime('fecha_hora_registro', '<=', '18:00:00');
                    break;
                case 'noche':
                    $query->whereTime('fecha_hora_registro', '>=', '18:01:00')
                          ->whereTime('fecha_hora_registro', '<=', '23:59:59');
                    break;
            }
        }

        if ($request->filled('filter_instructor')) {
            $filterInstructor = $request->get('filter_instructor');
            // Si el filtro es un ID numérico, buscar por ID
            if (is_numeric($filterInstructor)) {
                $query->where('instructor_id', $filterInstructor);
            } else {
                // Si no es numérico, buscar por nombre/apellido
                $query->whereHas('instructor', function($q) use ($filterInstructor) {
                    $q->where('nombres', 'like', "%{$filterInstructor}%")
                      ->orWhere('apellidos', 'like', "%{$filterInstructor}%");
                });
            }
        }

        if ($request->filled('filter_asistencia')) {
            $filterAsistencia = $request->get('filter_asistencia');
            switch($filterAsistencia) {
                case 'puntual':
                    $query->where('tipo_movimiento', 'entrada')
                          ->where('es_tardanza', false);
                    break;
                case 'tarde':
                    $query->where('tipo_movimiento', 'entrada')
                          ->where('es_tardanza', true);
                    break;
                case 'salida':
                    $query->where('tipo_movimiento', 'salida');
                    break;
            }
        }

        // Obtener todas las asistencias y agrupar por instructor y fecha
        $todasAsistencias = $query->get();
        
        // Agrupar asistencias por instructor y fecha
        $registrosAgrupados = $todasAsistencias->groupBy(function($asistencia) {
            return $asistencia->instructor_id . '_' . Carbon::parse($asistencia->fecha_hora_registro)->format('Y-m-d');
        })->map(function($grupo) {
            // Obtener entrada y salida del día
            $entrada = $grupo->where('tipo_movimiento', 'entrada')->first();
            $salida = $grupo->where('tipo_movimiento', 'salida')->first();
            
            // Usar la primera asistencia para datos base
            $asistenciaBase = $grupo->first();
            $instructor = $asistenciaBase->instructor;
            
            if (!$instructor) {
                return null;
            }
            
            // Determinar el estado de asistencia
            $estado = 'Completo';
            if ($entrada && $entrada->es_tardanza) {
                $estado = 'Tarde';
            } elseif ($entrada && !$salida) {
                $estado = 'Sin salida';
            } elseif (!$entrada && $salida) {
                $estado = 'Sin entrada';
            } elseif ($entrada && !$entrada->es_tardanza) {
                $estado = 'Puntual';
            }
            
            return [
                'id' => $asistenciaBase->id,
                'instructor' => $instructor->nombres . ' ' . $instructor->apellidos,
                'area' => $instructor->area_asignada ?? 'No asignada',
                'fecha' => Carbon::parse($asistenciaBase->fecha_hora_registro)->format('d/m/Y'),
                'horaEntrada' => $entrada ? Carbon::parse($entrada->fecha_hora_registro)->format('H:i') : '-',
                'horaSalida' => $salida ? Carbon::parse($salida->fecha_hora_registro)->format('H:i') : '-',
                'estado' => $estado,
                'es_tardanza' => $entrada ? $entrada->es_tardanza : false,
                'observaciones' => $entrada ? $entrada->observaciones : ($salida ? $salida->observaciones : null),
                'fecha_hora_para_orden' => $asistenciaBase->fecha_hora_registro
            ];
        })->filter()->values(); // Filtrar nulls y reindexar

        // Ordenar por fecha más reciente
        $registrosOrdenados = $registrosAgrupados->sortByDesc('fecha_hora_para_orden')->values();
        
        // Implementar paginación manual
        $page = $request->get('page', 1);
        $perPage = 20;
        $offset = ($page - 1) * $perPage;
        
        $registrosPaginados = $registrosOrdenados->slice($offset, $perPage);
        $total = $registrosOrdenados->count();
        
        // Crear objeto de paginación manual
        $paginacionData = [
            'current_page' => (int)$page,
            'data' => $registrosPaginados->values(),
            'first_page_url' => $request->url() . '?page=1',
            'from' => $offset + 1,
            'last_page' => ceil($total / $perPage),
            'last_page_url' => $request->url() . '?page=' . ceil($total / $perPage),
            'next_page_url' => $page < ceil($total / $perPage) ? $request->url() . '?page=' . ($page + 1) : null,
            'path' => $request->url(),
            'per_page' => $perPage,
            'prev_page_url' => $page > 1 ? $request->url() . '?page=' . ($page - 1) : null,
            'to' => min($offset + $perPage, $total),
            'total' => $total,
        ];

        // Obtener todos los instructores activos para los filtros
        $instructores = Instructor::activos()
            ->select('id', 'nombres', 'apellidos')
            ->orderBy('nombres')
            ->get();

        // Agregar un registro temporal para depuración
        \Log::info('Instructores enviados al frontend:', $instructores->toArray());

        // Estadísticas del día actual
        $estadisticasHoy = [
            'total_registros' => Asistencia::whereDate('fecha_hora_registro', today())->count(),
            'total_entradas' => Asistencia::whereDate('fecha_hora_registro', today())
                ->where('tipo_movimiento', 'entrada')->count(),
            'total_salidas' => Asistencia::whereDate('fecha_hora_registro', today())
                ->where('tipo_movimiento', 'salida')->count(),
            'llegadas_tarde' => Asistencia::whereDate('fecha_hora_registro', today())
                ->where('tipo_movimiento', 'entrada')
                ->where('es_tardanza', true)->count(),
            'llegadas_puntuales' => Asistencia::whereDate('fecha_hora_registro', today())
                ->where('tipo_movimiento', 'entrada')
                ->where('es_tardanza', false)->count()
        ];

        return Inertia::render('Guardia/Historial', [
            'asistencias' => $paginacionData,
            'instructores' => $instructores,
            'estadisticas' => $estadisticasHoy,
            'filtros' => $request->only(['search', 'filter_hora', 'filter_instructor', 'filter_asistencia']),
            'guardia' => auth()->user()
        ]);
    }

    /**
     * Iniciar turno del guardia
     */
    public function iniciarTurno(): JsonResponse
    {
        $guardia = auth()->user();
        
        if ($guardia->estaEnTurno()) {
            return response()->json([
                'success' => false,
                'message' => 'Ya tiene un turno activo'
            ], 400);
        }

        $guardia->iniciarTurno();

        return response()->json([
            'success' => true,
            'message' => 'Turno iniciado exitosamente',
            'turno_inicio' => $guardia->ultimo_inicio_turno
        ]);
    }

    /**
     * Finalizar turno del guardia
     */
    public function finalizarTurno(): JsonResponse
    {
        $guardia = auth()->user();
        
        if (!$guardia->estaEnTurno()) {
            return response()->json([
                'success' => false,
                'message' => 'No tiene un turno activo'
            ], 400);
        }

        $guardia->finalizarTurno();

        return response()->json([
            'success' => true,
            'message' => 'Turno finalizado exitosamente',
            'turno_fin' => $guardia->ultimo_fin_turno,
            'duracion_minutos' => $guardia->tiempoUltimoTurno()
        ]);
    }

    // Métodos auxiliares privados

    private function determinarTipoMovimiento($ultimaAsistencia): string
    {
        if (!$ultimaAsistencia) {
            return 'entrada';
        }

        return $ultimaAsistencia->tipo_movimiento === 'entrada' ? 'salida' : 'entrada';
    }

    private function getMensajeExito(string $tipoMovimiento, Instructor $instructor): string
    {
        $accion = $tipoMovimiento === 'entrada' ? 'Entrada' : 'Salida';
        return "{$accion} registrada para {$instructor->nombre_completo}";
    }

    private function getInstructoresPresentes(): int
    {
        return Instructor::whereHas('asistencias', function($query) {
            $query->whereDate('fecha_hora_registro', today())
                  ->where('tipo_movimiento', 'entrada')
                  ->whereNotExists(function($subQuery) {
                      $subQuery->select('id')
                               ->from('asistencias as salidas')
                               ->whereColumn('salidas.instructor_id', 'asistencias.instructor_id')
                               ->where('salidas.tipo_movimiento', 'salida')
                               ->whereDate('salidas.fecha_hora_registro', today())
                               ->whereRaw('salidas.fecha_hora_registro > asistencias.fecha_hora_registro');
                  });
        })->count();
    }

    private function getRegistrosHoy(): int
    {
        return Asistencia::whereDate('fecha_hora_registro', today())->count();
    }

    private function getNovedadesPendientes(): int
    {
        return Asistencia::conNovedades()
                        ->whereDate('fecha_hora_registro', today())
                        ->count();
    }

    private function getUltimoRegistro()
    {
        return Asistencia::with(['instructor', 'guardia'])
                        ->latest('fecha_hora_registro')
                        ->first();
    }

    /**
     * Determinar estado de asistencia basado en el registro
     */
    private function determinarEstadoAsistencia($asistencia): string
    {
        if ($asistencia->es_tardanza) {
            return 'Tarde';
        }
        
        if (isset($asistencia->es_salida_anticipada) && $asistencia->es_salida_anticipada) {
            return 'Salida Anticipada';
        }
        
        if ($asistencia->estado_registro === 'normal') {
            return 'Puntualidad';
        }
        
        return 'Ausente';
    }

    /**
     * Obtener color CSS para el estado
     */
    private function obtenerColorEstado($asistencia): string
    {
        if ($asistencia->es_tardanza) {
            return 'bg-blue-900';
        }
        
        if ($asistencia->es_salida_anticipada) {
            return 'bg-yellow-600';
        }
        
        if ($asistencia->estado_registro === 'normal') {
            return 'bg-green-600';
        }
        
        return 'bg-cyan-300';
    }

    /**
     * Generar mensaje de notificación basado en el registro
     */
    private function generarMensajeNotificacion($asistencia): string
    {
        $instructor = $asistencia->instructor;
        $hora = $asistencia->fecha_hora_registro->format('H:i');
        
        if ($asistencia->es_tardanza) {
            return "El docente {$instructor->nombres} {$instructor->apellidos} llegó tarde ({$hora})";
        }
        
        if ($asistencia->tipo_movimiento === 'entrada') {
            return "El docente {$instructor->nombres} {$instructor->apellidos} registró entrada puntual ({$hora})";
        }
        
        return "El docente {$instructor->nombres} {$instructor->apellidos} registró salida ({$hora})";
    }

    /**
     * Determinar tipo de notificación para el frontend
     */
    private function determinarTipoNotificacion($asistencia): string
    {
        if ($asistencia->es_tardanza) {
            return 'tarde';
        }
        
        if ($asistencia->tipo_movimiento === 'entrada') {
            return 'entrada';
        }
        
        return 'salida';
    }

    /**
     * Determinar estado de asistencia basado en entrada y salida agrupadas
     */
    private function determinarEstadoAsistenciaAgrupada($entrada, $salida): string
    {
        if ($entrada && $entrada->es_tardanza) {
            return 'Tarde';
        }
        
        if ($entrada && !$salida) {
            return 'Sin salida';
        }
        
        if (!$entrada && $salida) {
            return 'Sin entrada';
        }
        
        if ($entrada && !$entrada->es_tardanza) {
            return 'Puntualidad';
        }
        
        return 'Ausente';
    }

    /**
     * Obtener color CSS para el estado agrupado
     */
    private function obtenerColorEstadoAgrupado($entrada, $salida): string
    {
        if ($entrada && $entrada->es_tardanza) {
            return 'bg-yellow-600';
        }
        
        if ($entrada && $entrada->es_salida_anticipada) {
            return 'bg-orange-600';
        }
        
        if ($entrada && !$salida) {
            return 'bg-blue-600';
        }
        
        if (!$entrada && $salida) {
            return 'bg-purple-600';
        }
        
        if ($entrada && !$entrada->es_tardanza) {
            return 'bg-green-600';
        }
        
        return 'bg-red-600';
    }
}
