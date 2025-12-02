<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario administrador por defecto si no existe
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrador',
                'email' => 'admin@example.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Crear usuario regular de ejemplo si no existe
        User::firstOrCreate(
            ['email' => 'usuario@example.com'],
            [
                'name' => 'Usuario de Prueba',
                'email' => 'usuario@example.com',
                'password' => Hash::make('usuario123'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );
    }
}
