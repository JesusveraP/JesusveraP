<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Instructor;
use App\Models\Asistencia;
use App\Models\User;
use Carbon\Carbon;

class CreateTodayAttendances extends Command
{
    protected $signature = 'attendance:create-today';
    protected $description = 'Create attendance records for today';

    public function handle()
    {
        $hoy = Carbon::today();
        $instructores = Instructor::take(10)->get();
        $guardia = User::where('role', 'guardia')->first() ?? User::where('role', 'admin')->first();
        
        $this->info("Creando asistencias para el día: " . $hoy->format('Y-m-d'));
        
        foreach ($instructores as $instructor) {
            // Crear entrada para hoy
            $horaEntrada = $hoy->copy()->setTime(7, rand(0, 45), 0);
            
            // Verificar si ya existe una asistencia para hoy
            $existeHoy = Asistencia::where('instructor_id', $instructor->id)
                ->whereDate('fecha_hora_registro', $hoy)
                ->where('tipo_movimiento', 'entrada')
                ->exists();
            
            if (!$existeHoy) {
                $asistencia = Asistencia::create([
                    'instructor_id' => $instructor->id,
                    'guardia_id' => $guardia->id,
                    'tipo_movimiento' => 'entrada',
                    'fecha_hora_registro' => $horaEntrada,
                    'codigo_barras_leido' => $instructor->codigo_barras ?? $instructor->codigo_instructor,
                    'ubicacion' => 'Entrada Principal',
                    'es_tardanza' => $horaEntrada->format('H:i') > '07:15',
                    'es_salida_anticipada' => false,
                    'observaciones' => $horaEntrada->format('H:i') > '07:15' ? 'Llegada tardía' : 'Entrada puntual',
                    'estado_registro' => $horaEntrada->format('H:i') > '07:15' ? 'novedad' : 'normal'
                ]);
                
                $this->info("✅ Entrada creada para {$instructor->nombres} {$instructor->apellidos} a las {$horaEntrada->format('H:i')}");
                
                // 70% de probabilidad de crear también la salida
                if (rand(1, 100) <= 70) {
                    $horaSalida = $hoy->copy()->setTime(17, rand(0, 30), 0);
                    
                    Asistencia::create([
                        'instructor_id' => $instructor->id,
                        'guardia_id' => $guardia->id,
                        'tipo_movimiento' => 'salida',
                        'fecha_hora_registro' => $horaSalida,
                        'codigo_barras_leido' => $instructor->codigo_barras ?? $instructor->codigo_instructor,
                        'ubicacion' => 'Entrada Principal',
                        'es_tardanza' => false,
                        'es_salida_anticipada' => $horaSalida->format('H:i') < '17:00',
                        'observaciones' => 'Salida registrada',
                        'estado_registro' => 'normal'
                    ]);
                    
                    $this->info("✅ Salida creada para {$instructor->nombres} {$instructor->apellidos} a las {$horaSalida->format('H:i')}");
                }
            } else {
                $this->warn("⚠️  Ya existe asistencia para {$instructor->nombres} {$instructor->apellidos}");
            }
        }
        
        $totalHoy = Asistencia::whereDate('fecha_hora_registro', $hoy)->count();
        $this->info("🎉 Total de asistencias para hoy: {$totalHoy}");
        
        return 0;
    }
}
