<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Instructor;
use App\Models\Asistencia;
use Carbon\Carbon;

class AsistenciasSeeder extends Seeder
{
    public function run()
    {
        // Verificar si hay instructores, si no los hay, crearlos
        if (Instructor::count() == 0) {
            $instructores = [
                [
                    'nombres' => 'Juan Carlos',
                    'apellidos' => 'García López',
                    'numero_identificacion' => '12345678',
                    'tipo_identificacion' => 'CC',
                    'telefono' => '3001234567',
                    'email' => 'juan.garcia@sena.edu.co',
                    'area_asignada' => 'Sistemas e Informática',
                    'estado' => 'activo'
                ],
                [
                    'nombres' => 'María Elena',
                    'apellidos' => 'Rodríguez Pérez',
                    'numero_identificacion' => '87654321',
                    'tipo_identificacion' => 'CC',
                    'telefono' => '3009876543',
                    'email' => 'maria.rodriguez@sena.edu.co',
                    'area_asignada' => 'Administración y Finanzas',
                    'estado' => 'activo'
                ],
                [
                    'nombres' => 'Pedro Antonio',
                    'apellidos' => 'Martínez Silva',
                    'numero_identificacion' => '11223344',
                    'tipo_identificacion' => 'CC',
                    'telefono' => '3005556677',
                    'email' => 'pedro.martinez@sena.edu.co',
                    'area_asignada' => 'Mecánica Industrial',
                    'estado' => 'activo'
                ],
                [
                    'nombres' => 'Ana Isabel',
                    'apellidos' => 'Hernández Torres',
                    'numero_identificacion' => '55667788',
                    'tipo_identificacion' => 'CC',
                    'telefono' => '3002233445',
                    'email' => 'ana.hernandez@sena.edu.co',
                    'area_asignada' => 'Diseño Gráfico',
                    'estado' => 'activo'
                ],
                [
                    'nombres' => 'Carlos Eduardo',
                    'apellidos' => 'Vargas Ruiz',
                    'numero_identificacion' => '99887766',
                    'tipo_identificacion' => 'CC',
                    'telefono' => '3007788990',
                    'email' => 'carlos.vargas@sena.edu.co',
                    'area_asignada' => 'Electrónica',
                    'estado' => 'activo'
                ]
            ];

            foreach ($instructores as $instructorData) {
                Instructor::create($instructorData);
            }
        }

        // Obtener un guardia (usuario con rol guardia) o crear uno
        $guardia = \App\Models\User::where('role', 'guardia')->first();
        if (!$guardia) {
            // Si no existe un guardia, crear uno
            $guardia = \App\Models\User::create([
                'name' => 'Guardia Principal',
                'email' => 'guardia@sena.edu.co',
                'password' => bcrypt('password'),
                'role' => 'guardia',
                'email_verified_at' => now(),
            ]);
        }

        // Crear asistencias de prueba para los últimos 15 días
        $instructores = Instructor::all();
        $fechas = [];
        
        // Generar fechas de los últimos 15 días (excluyendo fines de semana)
        for ($i = 15; $i >= 0; $i--) {
            $fecha = Carbon::now()->subDays($i);
            if ($fecha->isWeekday()) {
                $fechas[] = $fecha->format('Y-m-d');
            }
        }

        foreach ($instructores as $instructor) {
            foreach ($fechas as $fecha) {
                // 85% de probabilidad de que el instructor asista
                if (rand(1, 100) <= 85) {
                    // Crear entrada
                    $horaEntrada = $this->generarHoraEntrada();
                    $esTardanza = $horaEntrada > '07:15:00';
                    
                    Asistencia::create([
                        'instructor_id' => $instructor->id,
                        'guardia_id' => $guardia->id,
                        'fecha_hora_registro' => $fecha . ' ' . $horaEntrada,
                        'tipo_movimiento' => 'entrada',
                        'es_tardanza' => $esTardanza,
                        'codigo_barras_leido' => 'BAR-' . uniqid(),
                        'observaciones' => $esTardanza ? 'Llegada tarde registrada' : null,
                        'estado_registro' => $esTardanza ? 'novedad' : 'normal'
                    ]);
                    
                    // 90% de probabilidad de que registre salida
                    if (rand(1, 100) <= 90) {
                        $horaSalida = $this->generarHoraSalida();
                        Asistencia::create([
                            'instructor_id' => $instructor->id,
                            'guardia_id' => $guardia->id,
                            'fecha_hora_registro' => $fecha . ' ' . $horaSalida,
                            'tipo_movimiento' => 'salida',
                            'es_tardanza' => false,
                            'codigo_barras_leido' => 'BAR-' . uniqid(),
                            'estado_registro' => 'normal'
                        ]);
                    }
                }
            }
        }

        echo "✓ Se han insertado " . Asistencia::count() . " registros de asistencia exitosamente.\n";
    }

    private function generarHoraEntrada()
    {
        // 70% llegan puntuales (06:30 - 07:15)
        // 30% llegan tarde (07:16 - 08:30)
        if (rand(1, 100) <= 70) {
            // Puntuales
            $hora = rand(6, 7);
            if ($hora == 6) {
                $minuto = rand(30, 59);
            } else {
                $minuto = rand(0, 15);
            }
        } else {
            // Tarde
            $hora = rand(7, 8);
            if ($hora == 7) {
                $minuto = rand(16, 59);
            } else {
                $minuto = rand(0, 30);
            }
        }
        
        return sprintf('%02d:%02d:00', $hora, $minuto);
    }

    private function generarHoraSalida()
    {
        // Horario de salida entre 16:00 y 18:30
        $hora = rand(16, 18);
        if ($hora == 18) {
            $minuto = rand(0, 30);
        } else {
            $minuto = rand(0, 59);
        }
        
        return sprintf('%02d:%02d:00', $hora, $minuto);
    }
}