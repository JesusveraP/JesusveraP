<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ejecutar los seeders del sistema de registro de instructores
        $this->call([
            AdminUserSeeder::class,
            InstructorSeeder::class,
            AsistenciasSeeder::class,
        ]);
        
        // Crear usuarios adicionales de prueba
        User::factory(3)->create();
    }
}
