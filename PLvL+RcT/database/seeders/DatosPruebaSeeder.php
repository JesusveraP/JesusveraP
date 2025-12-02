<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Instructor;
use App\Models\Asistencia;
use Carbon\Carbon;

class DatosPruebaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        echo "🔍 Verificando instructores existentes...\n";
        
        // Usar instructores existentes en lugar de crear nuevos
        $instructoresExistentes = Instructor::all();
        
        if ($instructoresExistentes->isEmpty()) {
            echo "❌ No hay instructores en la base de datos. Ejecuta primero: php artisan db:seed --class=InstructorSeeder\n";
            return;
        }
        
        echo "✅ Encontrados {$instructoresExistentes->count()} instructores existentes\n";

        // Obtener un usuario guardia existente o crear uno si no existe
        $guardia = \App\Models\User::where('role', 'guardia')->first();
        if (!$guardia) {
            $guardia = \App\Models\User::create([
                'name' => 'Guardia Sistema',
                'email' => 'guardia@sistema.com',
                'password' => bcrypt('password'),
                'role' => 'guardia',
                'cedula' => '000000000'
            ]);
            echo "✅ Creado usuario guardia para el sistema\n";
        } else {
            echo "✅ Usuario guardia encontrado: {$guardia->name}\n";
        }
        
        // Limpiar asistencias existentes para evitar duplicados
        Asistencia::truncate();
        echo "🧹 Limpiadas asistencias existentes\n";
        
        for ($i = 6; $i >= 0; $i--) {
            $fecha = Carbon::now()->subDays($i);
            $asistenciasDelDia = 0;
            
            foreach ($instructoresExistentes as $instructor) {
                // 80% de probabilidad de que el instructor asista
                if (rand(1, 100) <= 80) {
                    // Hora de entrada aleatoria entre 6:30 y 8:00
                    $horaEntrada = $fecha->copy()->setTime(6, 30)->addMinutes(rand(0, 90));
                    
                    // Determinar si llega tarde (después de las 7:15)
                    $esTardanza = $horaEntrada->format('H:i') > '07:15';
                    
                    // Crear registro de entrada
                    Asistencia::create([
                        'instructor_id' => $instructor->id,
                        'guardia_id' => $guardia->id,
                        'fecha_hora_registro' => $horaEntrada->format('Y-m-d H:i:s'),
                        'tipo_movimiento' => 'entrada',
                        'codigo_barras_leido' => $instructor->codigo_barras ?? '000000000000',
                        'ubicacion' => 'Entrada Principal',
                        'es_tardanza' => $esTardanza,
                        'observaciones' => $esTardanza ? 'Llegada tardía' : 'Llegada puntual',
                        'estado_registro' => 'normal'
                    ]);
                    $asistenciasDelDia++;
                    
                    // 90% de probabilidad de que también registre salida
                    if (rand(1, 100) <= 90) {
                        // Hora de salida aleatoria entre 14:30 y 16:00
                        $horaSalida = $horaEntrada->copy()->setTime(14, 30)->addMinutes(rand(0, 90));
                        
                        Asistencia::create([
                            'instructor_id' => $instructor->id,
                            'guardia_id' => $guardia->id,
                            'fecha_hora_registro' => $horaSalida->format('Y-m-d H:i:s'),
                            'tipo_movimiento' => 'salida',
                            'codigo_barras_leido' => $instructor->codigo_barras ?? '000000000000',
                            'ubicacion' => 'Salida Principal',
                            'es_tardanza' => false,
                            'observaciones' => 'Salida registrada',
                            'estado_registro' => 'normal'
                        ]);
                        $asistenciasDelDia++;
                    }
                }
            }
            
            echo "📅 {$fecha->format('Y-m-d')}: {$asistenciasDelDia} asistencias creadas\n";
        }

        $totalAsistencias = Asistencia::count();
        echo "✅ Total de asistencias creadas: {$totalAsistencias}\n";
        echo "🎯 Datos de prueba creados exitosamente!\n";
        echo "📊 Dashboard ahora mostrará datos reales de la base de datos\n";
    }
}
