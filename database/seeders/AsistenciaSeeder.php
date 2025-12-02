<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Instructor;
use App\Models\Asistencia;
use App\Models\User;
use Carbon\Carbon;

class AsistenciaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener todos los instructores existentes
        $instructores = Instructor::all();
        
        if ($instructores->isEmpty()) {
            $this->command->error('No hay instructores en la base de datos. Crear instructores primero.');
            return;
        }

        // Obtener un guardia para asociar las asistencias
        $guardia = User::where('role', 'guardia')->first();
        
        if (!$guardia) {
            // Crear un guardia si no existe
            $guardia = User::create([
                'name' => 'Carlos Ortiz',
                'email' => 'carlos.ortiz@sena.edu.co',
                'password' => bcrypt('password123'),
                'role' => 'guardia',
                'cedula' => '12345678',
                'telefono' => '3001234567',
                'ubicacion_asignada' => 'Entrada Principal',
                'hora_inicio_turno' => '06:00',
                'hora_fin_turno' => '14:00'
            ]);
        }

        $this->command->info("Creando asistencias para {$instructores->count()} instructores...");

        // Limpiar asistencias anteriores para regenerar datos frescos
        Asistencia::truncate();

        foreach ($instructores as $instructor) {
            $this->command->info("📝 Generando asistencias para: {$instructor->nombres} {$instructor->apellidos}");
            
            // Crear asistencias para los últimos 10 días laborales
            for ($i = 14; $i >= 0; $i--) {
                $fecha = Carbon::now()->subDays($i);
                
                // Solo crear asistencias para días laborales (lunes a viernes)
                if ($fecha->isWeekend()) {
                    continue;
                }
                
                // Probabilidad del 85% de que el instructor asista
                if (rand(1, 100) <= 85) {
                    // Entrada (mañana) - variar las horas según el instructor
                    $horaBaseEntrada = Carbon::createFromTimeString($instructor->hora_entrada_programada ?: '07:00');
                    $minutosVariacion = rand(-15, 30); // Entre 15 min antes y 30 min después
                    $horaEntrada = $fecha->copy()->setTimeFromTimeString($horaBaseEntrada->format('H:i'))->addMinutes($minutosVariacion);
                    
                    $esTardanza = $horaEntrada->format('H:i') > $horaBaseEntrada->addMinutes(15)->format('H:i');
                    
                    Asistencia::create([
                        'instructor_id' => $instructor->id,
                        'guardia_id' => $guardia->id,
                        'tipo_movimiento' => 'entrada',
                        'fecha_hora_registro' => $horaEntrada,
                        'codigo_barras_leido' => $instructor->codigo_barras ?? $instructor->codigo_instructor,
                        'ubicacion' => 'Entrada Principal',
                        'es_tardanza' => $esTardanza,
                        'es_salida_anticipada' => false,
                        'observaciones' => $esTardanza ? 'Llegada tardía' : null,
                        'estado_registro' => $esTardanza ? 'novedad' : 'normal'
                    ]);

                    // Salida (tarde) - 90% de probabilidad si registró entrada
                    if (rand(1, 100) <= 90) {
                        $horaBaseSalida = Carbon::createFromTimeString($instructor->hora_salida_programada ?: '17:00');
                        $minutosVariacion = rand(-30, 15); // Entre 30 min antes y 15 min después
                        $horaSalida = $fecha->copy()->setTimeFromTimeString($horaBaseSalida->format('H:i'))->addMinutes($minutosVariacion);
                        
                        $esSalidaAnticipada = $horaSalida->format('H:i') < $horaBaseSalida->subMinutes(30)->format('H:i');
                        
                        Asistencia::create([
                            'instructor_id' => $instructor->id,
                            'guardia_id' => $guardia->id,
                            'tipo_movimiento' => 'salida',
                            'fecha_hora_registro' => $horaSalida,
                            'codigo_barras_leido' => $instructor->codigo_barras ?? $instructor->codigo_instructor,
                            'ubicacion' => 'Entrada Principal',
                            'es_tardanza' => false,
                            'es_salida_anticipada' => $esSalidaAnticipada,
                            'observaciones' => $esSalidaAnticipada ? 'Salida anticipada' : null,
                            'estado_registro' => $esSalidaAnticipada ? 'novedad' : 'normal'
                        ]);
                    }
                }
            }
        }

        // Crear algunas asistencias específicas para hoy
        $hoy = Carbon::today();
        $instructoresHoy = $instructores->take(8); // Solo algunos instructores para hoy

        foreach ($instructoresHoy as $instructor) {
            // Entrada de hoy
            $horaBaseEntrada = Carbon::createFromTimeString($instructor->hora_entrada_programada ?: '07:00');
            $horaEntrada = $hoy->copy()->setTimeFromTimeString($horaBaseEntrada->format('H:i'))->addMinutes(rand(-10, 20));
            
            $esTardanza = $horaEntrada->format('H:i') > $horaBaseEntrada->addMinutes(15)->format('H:i');
            
            Asistencia::create([
                'instructor_id' => $instructor->id,
                'guardia_id' => $guardia->id,
                'tipo_movimiento' => 'entrada',
                'fecha_hora_registro' => $horaEntrada,
                'codigo_barras_leido' => $instructor->codigo_barras ?? $instructor->codigo_instructor,
                'ubicacion' => 'Entrada Principal',
                'es_tardanza' => $esTardanza,
                'es_salida_anticipada' => false,
                'observaciones' => $esTardanza ? 'Llegada tardía' : 'Entrada registrada',
                'estado_registro' => $esTardanza ? 'novedad' : 'normal'
            ]);
        }

        $totalAsistencias = Asistencia::count();
        $this->command->info("✅ Asistencias creadas exitosamente!");
        $this->command->info("📊 Total de asistencias en la base de datos: {$totalAsistencias}");
        $this->command->info("👥 Instructores con asistencias: {$instructores->count()}");
    }
}
