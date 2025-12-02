<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Configuraciones iniciales del sistema
        SystemSetting::setSetting('logo_path', '/images/sena-logo.svg', 'string', 'Ruta del logo institucional');
        SystemSetting::setSetting('language', 'es', 'string', 'Idioma del sistema');
        SystemSetting::setSetting('color_scheme', 'green-600', 'string', 'Esquema de colores del sistema');
        SystemSetting::setSetting('system_name', 'Gestión Instructores SENA', 'string', 'Nombre del sistema');
    }
}
