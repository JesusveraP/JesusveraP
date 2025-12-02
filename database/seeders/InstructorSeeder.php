<?php

namespace Database\Seeders;

use App\Models\Instructor;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class InstructorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */     
    public function run(): void
    {
        // Crear instructores reales del SENA con diferentes especialidades
        $instructores = [
            [
                'codigo_instructor' => 'INS013',
                'codigo_barras' => '013',
                'nombres' => 'Ana María',
                'apellidos' => 'López Fernández',
                'documento_identidad' => '12345678',
                'tipo_documento' => 'CC',
                'telefono' => '3001234567',
                'email' => 'ana.lopez@sena.edu.co',
                'direccion' => 'Calle 123 #45-67',
                'fecha_ingreso' => '2024-01-15',
                'hora_entrada_programada' => '07:00',
                'hora_salida_programada' => '15:00',
                'estado' => 'activo',
                'area_asignada' => 'Sistemas',
                'cargo' => 'Instructor Senior',
                'observaciones' => 'Instructora especializada en desarrollo de software'
            ],
            [
                'codigo_instructor' => 'INS014',
                'codigo_barras' => '014',
                'nombres' => 'Carlos Alberto',
                'apellidos' => 'Rodríguez García',
                'documento_identidad' => '87654321',
                'tipo_documento' => 'CC',
                'telefono' => '3009876543',
                'email' => 'carlos.rodriguez@sena.edu.co',
                'direccion' => 'Carrera 50 #20-30',
                'fecha_ingreso' => '2024-02-01',
                'hora_entrada_programada' => '07:30',
                'hora_salida_programada' => '15:30',
                'estado' => 'activo',
                'area_asignada' => 'Electrónica',
                'cargo' => 'Instructor Técnico',
                'observaciones' => 'Especialista en instalaciones eléctricas industriales'
            ],
            [
                'codigo_instructor' => 'INS015',
                'codigo_barras' => '015',
                'nombres' => 'José Luis',
                'apellidos' => 'Martínez Sánchez',
                'documento_identidad' => '11223344',
                'tipo_documento' => 'CC',
                'telefono' => '3005556789',
                'email' => 'jose.martinez@sena.edu.co',
                'direccion' => 'Avenida 80 #15-25',
                'fecha_ingreso' => '2023-09-15',
                'hora_entrada_programada' => '08:00',
                'hora_salida_programada' => '16:00',
                'estado' => 'activo',
                'area_asignada' => 'Mecánica',
                'cargo' => 'Instructor',
                'observaciones' => 'Experto en mantenimiento industrial'
            ],
            [
                'codigo_instructor' => 'INS016',
                'codigo_barras' => '016',
                'nombres' => 'Lucía Patricia',
                'apellidos' => 'González Ruiz',
                'documento_identidad' => '55667788',
                'tipo_documento' => 'CC',
                'telefono' => '3002345678',
                'email' => 'lucia.gonzalez@sena.edu.co',
                'direccion' => 'Calle 60 #35-40',
                'fecha_ingreso' => '2024-03-01',
                'hora_entrada_programada' => '07:00',
                'hora_salida_programada' => '15:00',
                'estado' => 'activo',
                'area_asignada' => 'Contabilidad',
                'cargo' => 'Instructora',
                'observaciones' => 'Especialista en contabilidad y finanzas'
            ],
            // Nuevos instructores con más especialidades del SENA
            [
                'codigo_instructor' => 'INS017',
                'codigo_barras' => '017',
                'nombres' => 'María Elena',
                'apellidos' => 'Vargas Castro',
                'documento_identidad' => '98765432',
                'tipo_documento' => 'CC',
                'telefono' => '3007654321',
                'email' => 'maria.vargas@sena.edu.co',
                'direccion' => 'Transversal 30 #80-15',
                'fecha_ingreso' => '2023-08-10',
                'hora_entrada_programada' => '06:30',
                'hora_salida_programada' => '14:30',
                'estado' => 'activo',
                'area_asignada' => 'Inglés',
                'cargo' => 'Instructora de Idiomas',
                'observaciones' => 'Certificada en inglés técnico e inglés empresarial'
            ],
            [
                'codigo_instructor' => 'INS018',
                'codigo_barras' => '018',
                'nombres' => 'Roberto Carlos',
                'apellidos' => 'Jiménez Torres',
                'documento_identidad' => '33445566',
                'tipo_documento' => 'CC',
                'telefono' => '3008888999',
                'email' => 'roberto.jimenez@sena.edu.co',
                'direccion' => 'Diagonal 45 #22-88',
                'fecha_ingreso' => '2022-11-20',
                'hora_entrada_programada' => '07:15',
                'hora_salida_programada' => '15:15',
                'estado' => 'activo',
                'area_asignada' => 'Soldadura',
                'cargo' => 'Instructor Técnico Senior',
                'observaciones' => 'Especialista en soldadura SMAW, GMAW y TIG'
            ],
            [
                'codigo_instructor' => 'INS019',
                'codigo_barras' => '019',
                'nombres' => 'Sandra Milena',
                'apellidos' => 'Restrepo Agudelo',
                'documento_identidad' => '77889900',
                'tipo_documento' => 'CC',
                'telefono' => '3001111222',
                'email' => 'sandra.restrepo@sena.edu.co',
                'direccion' => 'Calle 70 #45-12',
                'fecha_ingreso' => '2024-04-05',
                'hora_entrada_programada' => '08:30',
                'hora_salida_programada' => '16:30',
                'estado' => 'activo',
                'area_asignada' => 'Administración',
                'cargo' => 'Instructora',
                'observaciones' => 'Magíster en Administración de Empresas'
            ],
            [
                'codigo_instructor' => 'INS020',
                'codigo_barras' => '020',
                'nombres' => 'Miguel Ángel',
                'apellidos' => 'Herrera Morales',
                'documento_identidad' => '44556677',
                'tipo_documento' => 'CC',
                'telefono' => '3006666777',
                'email' => 'miguel.herrera@sena.edu.co',
                'direccion' => 'Carrera 25 #18-33',
                'fecha_ingreso' => '2023-06-12',
                'hora_entrada_programada' => '07:00',
                'hora_salida_programada' => '15:00',
                'estado' => 'activo',
                'area_asignada' => 'Construcción',
                'cargo' => 'Instructor de Construcción',
                'observaciones' => 'Ingeniero civil con 15 años de experiencia'
            ],
            [
                'codigo_instructor' => 'INS021',
                'codigo_barras' => '021',
                'nombres' => 'Patricia Alejandra',
                'apellidos' => 'Mendoza Silva',
                'documento_identidad' => '66778899',
                'tipo_documento' => 'CC',
                'telefono' => '3004444555',
                'email' => 'patricia.mendoza@sena.edu.co',
                'direccion' => 'Avenida 68 #25-40',
                'fecha_ingreso' => '2024-01-08',
                'hora_entrada_programada' => '06:45',
                'hora_salida_programada' => '14:45',
                'estado' => 'activo',
                'area_asignada' => 'Química',
                'cargo' => 'Instructora de Ciencias',
                'observaciones' => 'Química farmacéutica especializada en análisis'
            ],
            [
                'codigo_instructor' => 'INS022',
                'codigo_barras' => '022',
                'nombres' => 'Andrés Felipe',
                'apellidos' => 'Ramírez Peña',
                'documento_identidad' => '22334455',
                'tipo_documento' => 'CC',
                'telefono' => '3003333444',
                'email' => 'andres.ramirez@sena.edu.co',
                'direccion' => 'Calle 85 #30-50',
                'fecha_ingreso' => '2023-10-15',
                'hora_entrada_programada' => '07:45',
                'hora_salida_programada' => '15:45',
                'estado' => 'activo',
                'area_asignada' => 'Matemáticas',
                'cargo' => 'Instructor de Matemáticas',
                'observaciones' => 'Licenciado en Matemáticas y Física'
            ],
            [
                'codigo_instructor' => 'INS023',
                'codigo_barras' => '023',
                'nombres' => 'Carmen Rosa',
                'apellidos' => 'Ospina Cardona',
                'documento_identidad' => '88990011',
                'tipo_documento' => 'CC',
                'telefono' => '3002222333',
                'email' => 'carmen.ospina@sena.edu.co',
                'direccion' => 'Transversal 40 #55-20',
                'fecha_ingreso' => '2022-07-30',
                'hora_entrada_programada' => '08:00',
                'hora_salida_programada' => '16:00',
                'estado' => 'activo',
                'area_asignada' => 'Biología',
                'cargo' => 'Instructora de Ciencias Naturales',
                'observaciones' => 'Bióloga con especialización en biotecnología'
            ],
            [
                'codigo_instructor' => 'INS024',
                'codigo_barras' => '024',
                'nombres' => 'Fernando José',
                'apellidos' => 'Quintero Mejía',
                'documento_identidad' => '55443322',
                'tipo_documento' => 'CC',
                'telefono' => '3009999000',
                'email' => 'fernando.quintero@sena.edu.co',
                'direccion' => 'Diagonal 60 #40-80',
                'fecha_ingreso' => '2024-02-20',
                'hora_entrada_programada' => '07:30',
                'hora_salida_programada' => '15:30',
                'estado' => 'activo',
                'area_asignada' => 'Física',
                'cargo' => 'Instructor de Física',
                'observaciones' => 'Físico con maestría en física aplicada'
            ]
        ];

        $this->command->info('Creando ' . count($instructores) . ' instructores...');

        foreach ($instructores as $instructorData) {
            $instructor = Instructor::firstOrCreate(
                ['codigo_instructor' => $instructorData['codigo_instructor']],
                $instructorData
            );
            
            if ($instructor->wasRecentlyCreated) {
                $this->command->info("✅ Creado: {$instructor->nombres} {$instructor->apellidos} - {$instructor->area_asignada}");
            } else {
                $this->command->info("⚠️  Ya existe: {$instructor->nombres} {$instructor->apellidos}");
            }
        }

        $this->command->info('🎉 Total de instructores en la base de datos: ' . Instructor::count());
    }
}
