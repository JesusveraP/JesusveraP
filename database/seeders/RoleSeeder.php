<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Roles del sistema (no se pueden eliminar)
        $systemRoles = [
            [
                'name' => 'admin',
                'display_name' => 'Superadministrador(Coordinador)',
                'description' => 'Administrador principal del sistema con acceso total',
                'is_system_role' => true,
                'permissions' => [
                    'manage_users',
                    'manage_instructors',
                    'manage_roles',
                    'view_reports',
                    'manage_system_config'
                ]
            ],
            [
                'name' => 'instructor',
                'display_name' => 'Instructores',
                'description' => 'Instructores del SENA',
                'is_system_role' => true,
                'permissions' => [
                    'view_own_profile',
                    'view_schedule'
                ]
            ],
            [
                'name' => 'guardia',
                'display_name' => 'Vigilante',
                'description' => 'Personal de seguridad encargado del registro de asistencias',
                'is_system_role' => true,
                'permissions' => [
                    'register_attendance',
                    'view_instructor_list',
                    'manage_doors'
                ]
            ]
        ];

        foreach ($systemRoles as $roleData) {
            Role::firstOrCreate(
                ['name' => $roleData['name']],
                $roleData
            );
        }
    }
}
