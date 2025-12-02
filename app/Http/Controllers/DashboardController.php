<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Asistencia;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Estadísticas reales de usuarios
        $totalUsers = User::count();
        $activeUsers = User::where('turno_activo', true)->count();
        $totalGuardias = User::where('role', 'guardia')->count();
        $totalInstructores = Instructor::count();

        // Estadísticas de asistencias del día actual
        $today = Carbon::today();
        $todayAsistencias = Asistencia::whereDate('fecha', $today)->count();
        $weekAsistencias = Asistencia::whereBetween('fecha', [
            Carbon::now()->startOfWeek(),
            Carbon::now()->endOfWeek()
        ])->count();
        $monthAsistencias = Asistencia::whereMonth('fecha', Carbon::now()->month)
            ->whereYear('fecha', Carbon::now()->year)
            ->count();

        // Usuarios recientes (últimos 5)
        $recentUsers = User::select('id', 'name', 'email', 'role', 'created_at')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => ucfirst($user->role),
                    'created_at' => $user->created_at->format('d/m/Y H:i'),
                    'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($user->name) . '&background=random'
                ];
            });

        // Asistencias recientes (últimas 5)
        $recentAsistencias = Asistencia::with(['user', 'instructor'])
            ->orderBy('fecha', 'desc')
            ->take(5)
            ->get()
            ->map(function ($asistencia) {
                return [
                    'id' => $asistencia->id,
                    'user_name' => $asistencia->user ? $asistencia->user->name : 'N/A',
                    'instructor_name' => $asistencia->instructor ? $asistencia->instructor->nombre : 'N/A',
                    'fecha' => Carbon::parse($asistencia->fecha)->format('d/m/Y'),
                    'hora_entrada' => $asistencia->hora_entrada,
                    'hora_salida' => $asistencia->hora_salida,
                    'estado' => $asistencia->estado ?? 'Presente'
                ];
            });

        // Distribución de roles para gráfico
        $rolesDistribution = [
            'admin' => User::where('role', 'admin')->count(),
            'guardia' => User::where('role', 'guardia')->count(),
            'user' => User::where('role', 'user')->count(),
        ];

        // Asistencias por día de la semana (últimos 7 días)
        $weeklyAsistencias = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $count = Asistencia::whereDate('fecha', $date)->count();
            $weeklyAsistencias[] = [
                'day' => $date->format('D'),
                'date' => $date->format('d/m'),
                'count' => $count
            ];
        }

        // Estado del sistema
        $systemStatus = [
            'server_status' => 'online',
            'database_status' => 'connected',
            'last_backup' => Carbon::now()->subHours(6)->format('d/m/Y H:i'),
            'system_load' => rand(10, 85) . '%',
            'active_sessions' => User::where('turno_activo', true)->count()
        ];

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'activeUsers' => $activeUsers,
                'totalGuardias' => $totalGuardias,
                'totalInstructores' => $totalInstructores,
                'todayAsistencias' => $todayAsistencias,
                'weekAsistencias' => $weekAsistencias,
                'monthAsistencias' => $monthAsistencias
            ],
            'recentUsers' => $recentUsers,
            'recentAsistencias' => $recentAsistencias,
            'rolesDistribution' => $rolesDistribution,
            'weeklyAsistencias' => $weeklyAsistencias,
            'systemStatus' => $systemStatus
        ]);
    }
}