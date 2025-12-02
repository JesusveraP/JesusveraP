<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Instructor;
use App\Models\Asistencia;
use App\Models\SystemSetting;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function historial(Request $request)
    {
        // Obtener filtros del request
        $filtros = [
            'fecha' => $request->get('fecha'),
            'instructor' => $request->get('instructor'),
            'tipo' => $request->get('tipo')
        ];

        // Query base para asistencias con información del instructor
        $query = Asistencia::with('instructor')
            ->join('instructors', 'asistencias.instructor_id', '=', 'instructors.id')
            ->select('asistencias.*', 'instructors.nombre as instructor_nombre', 'instructors.area');

        // Aplicar filtro por fecha si existe
        if (!empty($filtros['fecha'])) {
            $query->whereDate('asistencias.fecha', $filtros['fecha']);
        }

        // Aplicar filtro por instructor si existe (buscar por nombre)
        if (!empty($filtros['instructor'])) {
            $query->where('instructors.nombre', 'LIKE', '%' . $filtros['instructor'] . '%');
        }

        // Aplicar filtro por tipo si existe
        if (!empty($filtros['tipo'])) {
            switch ($filtros['tipo']) {
                case 'completo':
                    $query->whereNotNull('asistencias.hora_salida')
                          ->whereNotNull('asistencias.hora_entrada');
                    break;
                case 'tarde':
                    $query->whereTime('asistencias.hora_entrada', '>', '07:15:00')
                          ->whereNotNull('asistencias.hora_entrada');
                    break;
                case 'ausente':
                    $query->whereNull('asistencias.hora_entrada')
                          ->whereNull('asistencias.hora_salida');
                    break;
            }
        }

        // Obtener los datos ordenados por fecha y hora más recientes
        $historialData = $query->orderBy('asistencias.fecha', 'desc')
                              ->orderBy('asistencias.hora_entrada', 'desc')
                              ->get()
                              ->map(function ($asistencia) {
                                  // Determinar el estado basado en la hora de entrada
                                  $estado = 'Presente';
                                  if ($asistencia->hora_entrada) {
                                      $horaEntrada = \Carbon\Carbon::parse($asistencia->hora_entrada);
                                      $horaPuntual = \Carbon\Carbon::parse('07:15:00');
                                      
                                      if ($horaEntrada->greaterThan($horaPuntual)) {
                                          $estado = 'Tarde';
                                      } else {
                                          $estado = 'Puntual';
                                      }
                                  } elseif (!$asistencia->hora_entrada && !$asistencia->hora_salida) {
                                      $estado = 'Ausente';
                                  }

                                  return [
                                      'id' => $asistencia->id,
                                      'instructor' => $asistencia->instructor_nombre,
                                      'area' => $asistencia->area ?? 'Sin área',
                                      'fecha' => $asistencia->fecha ? \Carbon\Carbon::parse($asistencia->fecha)->format('d/m/Y') : 'Sin fecha',
                                      'horaEntrada' => $asistencia->hora_entrada ? \Carbon\Carbon::parse($asistencia->hora_entrada)->format('H:i') : '--',
                                      'horaSalida' => $asistencia->hora_salida ? \Carbon\Carbon::parse($asistencia->hora_salida)->format('H:i') : '--',
                                      'estado' => $estado
                                  ];
                              });

        // Calcular estadísticas
        $fechaHoy = now()->toDateString();
        $fechaFiltro = $filtros['fecha'] ?? $fechaHoy;

        $estadisticas = [
            'totalRegistrosHoy' => Asistencia::whereDate('fecha', $fechaFiltro)->count(),
            'llegadasPuntuales' => Asistencia::whereDate('fecha', $fechaFiltro)
                                          ->whereTime('hora_entrada', '<=', '07:15:00')
                                          ->whereNotNull('hora_entrada')
                                          ->count(),
            'llegadasTarde' => Asistencia::whereDate('fecha', $fechaFiltro)
                                       ->whereTime('hora_entrada', '>', '07:15:00')
                                       ->whereNotNull('hora_entrada')
                                       ->count(),
            'ausencias' => Asistencia::whereDate('fecha', $fechaFiltro)
                                    ->whereNull('hora_entrada')
                                    ->whereNull('hora_salida')
                                    ->count(),
        ];

        // Obtener lista de instructores para el filtro
        $instructores = Instructor::select('id', 'nombre', 'area')
                                  ->orderBy('nombre')
                                  ->get();

        return Inertia::render('Admin/Historial', [
            'historialData' => $historialData,
            'estadisticas' => $estadisticas,
            'instructores' => $instructores,
            'filtros' => $filtros
        ]);
    }

    /**
     * Método para mostrar la página de configuraciones del sistema con datos reales
     */
    public function configuraciones()
    {
        // Obtener datos reales de la base de datos de forma directa
        $totalUsuarios = \DB::table('users')->count();
        $administradores = \DB::table('users')->where('role', 'admin')->count();
        $guardias = \DB::table('users')->where('role', 'guardia')->count();  
        $usuariosRegulares = \DB::table('users')->where('role', 'user')->count();

        // Obtener estadísticas de asistencias
        $fechaHoy = now()->format('Y-m-d');
        $asistenciasHoy = \DB::table('asistencias')->whereDate('fecha_hora_registro', $fechaHoy)->count();
        
        // Total de instructores
        $totalInstructores = \DB::table('instructors')->count();
        
        // Asistencias puntuales y tarde de hoy
        $asistenciasPuntuales = \DB::table('asistencias')
            ->whereDate('fecha_hora_registro', $fechaHoy)
            ->where('tipo_movimiento', 'entrada')
            ->where('es_tardanza', false)
            ->count();
            
        $llegadasTarde = \DB::table('asistencias')
            ->whereDate('fecha_hora_registro', $fechaHoy)
            ->where('tipo_movimiento', 'entrada')
            ->where('es_tardanza', true)
            ->count();

        // Instructores que han registrado entrada hoy
        $instructoresConAsistenciaHoy = \DB::table('asistencias')
            ->whereDate('fecha_hora_registro', $fechaHoy)
            ->where('tipo_movimiento', 'entrada')
            ->distinct('instructor_id')
            ->count();
        
        $ausencias = max(0, $totalInstructores - $instructoresConAsistenciaHoy);

        // Obtener las últimas 10 asistencias con información del instructor
        $asistenciasRecientes = \DB::table('asistencias')
            ->join('instructors', 'asistencias.instructor_id', '=', 'instructors.id')
            ->select(
                'instructors.nombre as instructor_nombre',
                'instructors.area',
                'asistencias.fecha_hora_registro',
                'asistencias.tipo_movimiento',
                'asistencias.es_tardanza'
            )
            ->orderBy('asistencias.fecha_hora_registro', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($asistencia) {
                $estado = 'Presente';
                if ($asistencia->es_tardanza) {
                    $estado = 'Tarde';
                } elseif (!$asistencia->es_tardanza && $asistencia->tipo_movimiento === 'entrada') {
                    $estado = 'Puntual';
                }

                return [
                    'instructor' => $asistencia->instructor_nombre,
                    'area' => $asistencia->area ?? 'Sin área',
                    'fecha' => \Carbon\Carbon::parse($asistencia->fecha_hora_registro)->format('d/m/Y'),
                    'entrada' => $asistencia->tipo_movimiento === 'entrada' ? 
                        \Carbon\Carbon::parse($asistencia->fecha_hora_registro)->format('H:i') : '--',
                    'salida' => $asistencia->tipo_movimiento === 'salida' ? 
                        \Carbon\Carbon::parse($asistencia->fecha_hora_registro)->format('H:i') : '--',
                    'estado' => $estado
                ];
            })->toArray();

        // Configuraciones del sistema
        $systemSettings = [
            'system_name' => config('app.name', 'Gestión Instructores SENA'),
            'logo_path' => '/images/logo-sena.png',
            'primary_color' => '#16a34a',
            'language' => 'es'
        ];

        // Datos que se enviarán a la vista
        $data = [
            'rolesStats' => [
                'total' => $totalUsuarios,
                'admin' => $administradores,
                'guardia' => $guardias,
                'user' => $usuariosRegulares
            ],
            'asistenciasStats' => [
                'total_hoy' => $asistenciasHoy,
                'puntuales' => $asistenciasPuntuales,
                'tarde' => $llegadasTarde,
                'ausencias' => $ausencias
            ],
            'asistenciasRecientes' => $asistenciasRecientes,
            'systemSettings' => $systemSettings,
            'debug' => [
                'fecha_consulta' => $fechaHoy,
                'total_instructores' => $totalInstructores,
                'query_executed' => now()->format('Y-m-d H:i:s')
            ]
        ];

        return Inertia::render('Admin/Configuraciones', $data);
    }

    /**
     * Actualizar configuraciones del sistema
     */
    public function updateSistema(Request $request)
    {
        $request->validate([
            'system_name' => 'required|string|max:255',
            'primary_color' => 'required|string|max:7',
            'language' => 'required|string|in:es,en,fr,pt'
        ]);

        // Aquí puedes guardar en una tabla de configuraciones o en config
        // Por ahora usaremos el cache para demostración
        cache()->put('system_settings', $request->all(), 3600);

        return redirect()->back()->with('success', 'Configuración del sistema actualizada correctamente');
    }

    /**
     * Actualizar configuraciones de mensajes/notificaciones
     */
    public function updateMensajes(Request $request)
    {
        $request->validate([
            'notification_duration' => 'required|integer|min:1|max:10',
            'notification_position' => 'required|string|in:top-right,top-left,bottom-right,bottom-left,top-center',
            'notification_sound' => 'boolean'
        ]);

        cache()->put('notification_settings', $request->all(), 3600);

        return redirect()->back()->with('success', 'Configuración de notificaciones actualizada correctamente');
    }

    /**
     * Actualizar configuraciones de horarios
     */
    public function updateHorarios(Request $request)
    {
        $request->validate([
            'manana_inicio' => 'required|string',
            'manana_fin' => 'required|string',
            'tarde_inicio' => 'required|string',
            'tarde_fin' => 'required|string',
            'noche_inicio' => 'required|string',
            'noche_fin' => 'required|string'
        ]);

        cache()->put('schedule_settings', $request->all(), 3600);

        return redirect()->back()->with('success', 'Configuración de horarios actualizada correctamente');
    }

    /**
     * Dashboard principal del administrador
     */
    public function dashboard()
    {
        // Total de usuarios por rol
        $totalUsuarios = User::count();
        $administradores = User::where('role', 'admin')->count();
        $guardias = User::where('role', 'guardia')->count();
        $usuariosRegulares = User::where('role', 'user')->count();

        // Estadísticas de hoy
        $fechaHoy = now()->format('Y-m-d');
        $asistenciasHoy = Asistencia::whereDate('fecha_hora_registro', $fechaHoy)->count();
        $totalInstructores = Instructor::count();
        
        // Asistencias puntuales y tarde
        $asistenciasPuntuales = Asistencia::whereDate('fecha_hora_registro', $fechaHoy)
            ->where('tipo_movimiento', 'entrada')
            ->where('es_tardanza', false)
            ->count();
            
        $llegadasTarde = Asistencia::whereDate('fecha_hora_registro', $fechaHoy)
            ->where('tipo_movimiento', 'entrada')
            ->where('es_tardanza', true)
            ->count();

        // Instructores con asistencia hoy
        $instructoresConAsistenciaHoy = Asistencia::whereDate('fecha_hora_registro', $fechaHoy)
            ->where('tipo_movimiento', 'entrada')
            ->distinct('instructor_id')
            ->count();
        
        $ausencias = max(0, $totalInstructores - $instructoresConAsistenciaHoy);

        // Últimas asistencias
        $asistenciasRecientes = Asistencia::with('instructor')
            ->orderBy('fecha_hora_registro', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($asistencia) {
                return [
                    'instructor' => $asistencia->instructor ? 
                        $asistencia->instructor->nombres . ' ' . $asistencia->instructor->apellidos : 'Sin instructor',
                    'area' => $asistencia->instructor ? 
                        ($asistencia->instructor->area_asignada ?? 'No asignada') : 'No disponible',
                    'fecha' => Carbon::parse($asistencia->fecha_hora_registro)->format('d/m/Y'),
                    'hora' => Carbon::parse($asistencia->fecha_hora_registro)->format('H:i'),
                    'tipo' => $asistencia->tipo_movimiento,
                    'estado' => $asistencia->es_tardanza ? 'Tarde' : ($asistencia->tipo_movimiento === 'entrada' ? 'Puntual' : 'Salida')
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'rolesStats' => [
                'total' => $totalUsuarios,
                'admin' => $administradores,
                'guardia' => $guardias,
                'user' => $usuariosRegulares
            ],
            'asistenciasStats' => [
                'total_hoy' => $asistenciasHoy,
                'puntuales' => $asistenciasPuntuales,
                'tarde' => $llegadasTarde,
                'ausencias' => $ausencias,
                'total_instructores' => $totalInstructores
            ],
            'asistenciasRecientes' => $asistenciasRecientes
        ]);
    }

    /**
     * Mostrar lista de vigilantes
     */
    public function vigilantes()
    {
        $vigilantes = User::where('role', 'guardia')
            ->orderBy('name')
            ->paginate(15);

        return Inertia::render('Admin/Vigilantes/Index', [
            'vigilantes' => $vigilantes
        ]);
    }

    /**
     * Mostrar formulario para crear vigilante
     */
    public function createVigilante()
    {
        return Inertia::render('Admin/Vigilantes/Create');
    }

    /**
     * Guardar nuevo vigilante
     */
    public function storeVigilante(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:8|confirmed',
            'cedula' => 'nullable|string|max:20|unique:users,cedula',
            'telefono' => 'nullable|string|max:20',
        ]);

        $validated['password'] = bcrypt($validated['password']);
        $validated['role'] = 'guardia';
        $validated['email_verified_at'] = now();

        User::create($validated);

        return redirect()->route('admin.vigilantes.index')
                        ->with('success', 'Vigilante creado exitosamente.');
    }

    /**
     * Mostrar detalles de un vigilante
     */
    public function showVigilante(User $vigilante)
    {
        if ($vigilante->role !== 'guardia') {
            abort(404);
        }

        // Obtener últimas asistencias registradas por este vigilante
        $asistenciasRegistradas = Asistencia::where('guardia_id', $vigilante->id)
            ->orderBy('fecha_hora_registro', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($asistencia) {
                return [
                    'id' => $asistencia->id,
                    'instructor' => $asistencia->instructor ? 
                        $asistencia->instructor->nombres . ' ' . $asistencia->instructor->apellidos : 'Sin instructor',
                    'fecha' => Carbon::parse($asistencia->fecha_hora_registro)->format('d/m/Y'),
                    'hora' => Carbon::parse($asistencia->fecha_hora_registro)->format('H:i'),
                    'tipo' => $asistencia->tipo_movimiento,
                    'estado' => $asistencia->es_tardanza ? 'Tarde' : 'Normal'
                ];
            });

        return Inertia::render('Admin/Vigilantes/Show', [
            'vigilante' => [
                'id' => $vigilante->id,
                'name' => $vigilante->name,
                'email' => $vigilante->email,
                'cedula' => $vigilante->cedula,
                'telefono' => $vigilante->telefono,
                'estado' => $vigilante->email_verified_at ? 'Activo' : 'Inactivo',
                'fecha_creacion' => Carbon::parse($vigilante->created_at)->format('d/m/Y H:i'),
                'asistenciasRegistradas' => $asistenciasRegistradas
            ]
        ]);
    }

    /**
     * Mostrar formulario para editar vigilante
     */
    public function editVigilante(User $vigilante)
    {
        if ($vigilante->role !== 'guardia') {
            abort(404);
        }

        return Inertia::render('Admin/Vigilantes/Edit', [
            'vigilante' => $vigilante
        ]);
    }

    /**
     * Actualizar vigilante
     */
    public function updateVigilante(Request $request, User $vigilante)
    {
        if ($vigilante->role !== 'guardia') {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $vigilante->id,
            'cedula' => 'nullable|string|max:20|unique:users,cedula,' . $vigilante->id,
            'telefono' => 'nullable|string|max:20',
        ]);

        // Si hay nueva contraseña, validarla
        if ($request->filled('password')) {
            $validated['password'] = bcrypt($request->password);
        }

        $vigilante->update($validated);

        return redirect()->route('admin.vigilantes.index')
                        ->with('success', 'Vigilante actualizado exitosamente.');
    }

    /**
     * Eliminar vigilante
     */
    public function destroyVigilante(User $vigilante)
    {
        if ($vigilante->role !== 'guardia') {
            abort(404);
        }

        $vigilante->delete();

        return redirect()->route('admin.vigilantes.index')
                        ->with('success', 'Vigilante eliminado exitosamente.');
    }
}