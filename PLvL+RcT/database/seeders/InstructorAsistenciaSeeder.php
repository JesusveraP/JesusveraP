<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Instructor;
use App\Models\Asistencia;
use App\Models\User;
use Carbon\Carbon;

class InstructorAsistenciaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear instructores de ejemplo con la estructura correcta
        $instructores = [
            [
                'codigo_instructor' => 'INST001',
                'codigo_barras' => '1234567890123',
                'nombres' => 'María Elena',
                'apellidos' => 'Rodríguez García',
                'documento_identidad' => '12345678',
                'tipo_documento' => 'CC',
                'telefono' => '3001234567',
                'email' => 'maria.rodriguez@sena.edu.co',
                'direccion' => 'Calle 123 #45-67',
                'fecha_ingreso' => now()->subMonths(6),
                'hora_entrada_programada' => '07:00:00',
                'hora_salida_programada' => '15:00:00',
                'estado' => 'activo',
                'area_asignada' => 'Sistemas y Computación',
                'cargo' => 'Instructor Programación'
            ],
            [
                'codigo_instructor' => 'INST002',
                'codigo_barras' => '2345678901234',
                'nombres' => 'Carlos Alberto',
                'apellidos' => 'López Martínez',
                'documento_identidad' => '23456789',
                'tipo_documento' => 'CC',
                'telefono' => '3002345678',
                'email' => 'carlos.lopez@sena.edu.co',
                'direccion' => 'Carrera 89 #12-34',
                'fecha_ingreso' => now()->subMonths(12),
                'hora_entrada_programada' => '07:00:00',
                'hora_salida_programada' => '15:00:00',
                'estado' => 'activo',
                'area_asignada' => 'Administración',
                'cargo' => 'Instructor Gestión Empresarial'
            ],
            [
                'codigo_instructor' => 'INST003',
                'codigo_barras' => '3456789012345',
                'nombres' => 'Ana Patricia',
                'apellidos' => 'Vargas Sánchez',
                'documento_identidad' => '34567890',
                'tipo_documento' => 'CC',
                'telefono' => '3003456789',
                'email' => 'ana.vargas@sena.edu.co',
                'direccion' => 'Avenida 56 #78-90',
                'fecha_ingreso' => now()->subMonths(8),
                'hora_entrada_programada' => '07:00:00',
                'hora_salida_programada' => '15:00:00',
                'estado' => 'activo',
                'area_asignada' => 'Salud',
                'cargo' => 'Instructor Enfermería'
            ],
            [
                'codigo_instructor' => 'INST004',
                'codigo_barras' => '4567890123456',
                'nombres' => 'Jorge Enrique',
                'apellidos' => 'Morales Pérez',
                'documento_identidad' => '45678901',
                'tipo_documento' => 'CC',
                'telefono' => '3004567890',
                'email' => 'jorge.morales@sena.edu.co',
                'direccion' => 'Calle 34 #56-78',
                'fecha_ingreso' => now()->subMonths(10),
                'hora_entrada_programada' => '07:00:00',
                'hora_salida_programada' => '15:00:00',
                'estado' => 'activo',
                'area_asignada' => 'Mecánica Industrial',
                'cargo' => 'Instructor Soldadura'
            ],
            [
                'codigo_instructor' => 'INST005',
                'codigo_barras' => '5678901234567',
                'nombres' => 'Sandra Milena',
                'apellidos' => 'Torres Hernández',
                'documento_identidad' => '56789012',
                'tipo_documento' => 'CC',
                'telefono' => '3005678901',
                'email' => 'sandra.torres@sena.edu.co',
                'direccion' => 'Transversal 12 #34-56',
                'fecha_ingreso' => now()->subMonths(4),
                'hora_entrada_programada' => '07:00:00',
                'hora_salida_programada' => '15:00:00',
                'estado' => 'activo',
                'area_asignada' => 'Gastronomía',
                'cargo' => 'Instructor Cocina Internacional'
            ],
            [
                'codigo_instructor' => 'INST006',
                'codigo_barras' => '6789012345678',
                'nombres' => 'Roberto Carlos',
                'apellidos' => 'Jiménez Ruiz',
                'documento_identidad' => '67890123',
                'tipo_documento' => 'CC',
                'telefono' => '3006789012',
                'email' => 'roberto.jimenez@sena.edu.co',
                'direccion' => 'Diagonal 78 #90-12',
                'fecha_ingreso' => now()->subMonths(15),
                'hora_entrada_programada' => '07:00:00',
                'hora_salida_programada' => '15:00:00',
                'estado' => 'activo',
                'area_asignada' => 'Electricidad',
                'cargo' => 'Instructor Instalaciones Eléctricas'
            ]
        ];

        // Crear o actualizar instructores
        foreach ($instructores as $instructorData) {
            $instructor = Instructor::updateOrCreate(
                ['documento_identidad' => $instructorData['documento_identidad']],
                $instructorData
            );
        }

        // Obtener el guardia (usuario con rol guardia)
        $guardia = User::where('role', 'guardia')->first();
        if (!$guardia) {
            // Crear un guardia si no existe
            $guardia = User::create([
                'name' => 'Carlos Ortiz',
                'email' => 'guardia@sena.edu.co',
                'password' => bcrypt('password'),
                'role' => 'guardia',
                'cedula' => '87654321',
                'telefono' => '3001112233',
                'fecha_inicio' => now()->subMonths(2),
                'activo' => true,
                'ubicacion_asignada' => 'Puerta Principal',
                'hora_inicio_turno' => '06:00:00',
                'hora_fin_turno' => '14:00:00'
            ]);
        }

        // Generar registros de asistencia para los últimos 7 días
        $instructoresCreados = Instructor::all();
        
        for ($i = 6; $i >= 0; $i--) {
            $fecha = Carbon::now()->subDays($i);
            
            foreach ($instructoresCreados as $instructor) {
                // Probabilidad del 85% de que el instructor venga
                if (rand(1, 100) <= 85) {
                    
                    // Hora de entrada (entre 6:30 y 8:00 AM)
                    $horaEntradaBase = rand(6 * 60 + 30, 8 * 60); // minutos desde medianoche
                    $horaEntrada = $fecha->copy()->startOfDay()->addMinutes($horaEntradaBase);
                    
                    // Determinar si es tardanza (después de 7:15)
                    $esTarganza = $horaEntradaBase > (7 * 60 + 15);
                    
                    // Crear registro de entrada
                    $asistenciaEntrada = Asistencia::create([
                        'instructor_id' => $instructor->id,
                        'guardia_id' => $guardia->id,
                        'tipo_movimiento' => 'entrada',
                        'fecha_hora_registro' => $horaEntrada,
                        'codigo_barras_leido' => $instructor->codigo_barras,
                        'ubicacion' => 'Puerta Principal',
                        'es_tardanza' => $esTarganza,
                        'observaciones' => $esTarganza ? 'Llegada tardía registrada' : null,
                        'estado_registro' => $esTarganza ? 'novedad' : 'normal'
                    ]);

                    // Probabilidad del 90% de que registre salida si entró
                    if (rand(1, 100) <= 90) {
                        // Hora de salida (entre 3:00 y 6:00 PM)
                        $horaSalidaBase = rand(15 * 60, 18 * 60); // 3:00 PM a 6:00 PM en minutos
                        $horaSalida = $fecha->copy()->startOfDay()->addMinutes($horaSalidaBase);
                        
                        // Crear registro de salida
                        Asistencia::create([
                            'instructor_id' => $instructor->id,
                            'guardia_id' => $guardia->id,
                            'tipo_movimiento' => 'salida',
                            'fecha_hora_registro' => $horaSalida,
                            'codigo_barras_leido' => $instructor->codigo_barras,
                            'ubicacion' => 'Puerta Principal',
                            'es_tardanza' => false,
                            'observaciones' => null,
                            'estado_registro' => 'normal'
                        ]);
                    }
                }
            }
        }

        // Generar algunos registros para hoy con horarios específicos
        $hoy = Carbon::now();
        
        // Registros de la mañana temprana (solo si no existen ya para hoy)
        foreach ($instructoresCreados->take(3) as $instructor) {
            $existeHoy = Asistencia::where('instructor_id', $instructor->id)
                ->whereDate('fecha_hora_registro', $hoy->toDateString())
                ->exists();
                
            if (!$existeHoy) {
                $horaEntrada = $hoy->copy()->setTime(7, rand(0, 10)); // Entre 7:00 y 7:10
                
                Asistencia::create([
                    'instructor_id' => $instructor->id,
                    'guardia_id' => $guardia->id,
                    'tipo_movimiento' => 'entrada',
                    'fecha_hora_registro' => $horaEntrada,
                    'codigo_barras_leido' => $instructor->codigo_barras,
                    'ubicacion' => 'Puerta Principal',
                    'es_tardanza' => false,
                    'observaciones' => 'Entrada puntual',
                    'estado_registro' => 'normal'
                ]);
            }
        }

        // Registros de llegadas tarde (solo si no existen ya para hoy)
        foreach ($instructoresCreados->skip(3)->take(2) as $instructor) {
            $existeHoy = Asistencia::where('instructor_id', $instructor->id)
                ->whereDate('fecha_hora_registro', $hoy->toDateString())
                ->exists();
                
            if (!$existeHoy) {
                $horaEntrada = $hoy->copy()->setTime(7, rand(20, 45)); // Entre 7:20 y 7:45
                
                Asistencia::create([
                    'instructor_id' => $instructor->id,
                    'guardia_id' => $guardia->id,
                    'tipo_movimiento' => 'entrada',
                    'fecha_hora_registro' => $horaEntrada,
                    'codigo_barras_leido' => $instructor->codigo_barras,
                    'ubicacion' => 'Puerta Principal',
                    'es_tardanza' => true,
                    'observaciones' => 'Llegada tardía - Tráfico en la vía',
                    'estado_registro' => 'novedad'
                ]);
            }
        }

        $this->command->info('✅ Se han creado ' . $instructoresCreados->count() . ' instructores y registros de asistencia de ejemplo.');
        $this->command->info('📊 Se generaron registros para los últimos 7 días incluyendo hoy.');
        $this->command->info('👤 Usuario guardia: ' . $guardia->email);
    }
}
