<?php

namespace Database\Seeders;

use App\Models\NotificationSetting;
use Illuminate\Database\Seeder;

class NotificationSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Configuraciones iniciales para notificaciones
        NotificationSetting::setSetting('notification_color', 'green', 'string', 'Color de las notificaciones del sistema');
        NotificationSetting::setSetting('notification_duration', 5, 'integer', 'Duración en segundos de las notificaciones');
        NotificationSetting::setSetting('notification_position', 'top', 'string', 'Posición de las notificaciones en pantalla');
        NotificationSetting::setSetting('automatic_notifications', true, 'boolean', 'Habilitar notificaciones automáticas del sistema');
    }
}
