<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Mostrar configuraciones de notificaciones
     */
    public function index()
    {
        $settings = [
            'success_color' => SystemSetting::getSetting('notification_success_color', 'green'),
            'error_color' => SystemSetting::getSetting('notification_error_color', 'red'),
            'warning_color' => SystemSetting::getSetting('notification_warning_color', 'yellow'),
            'info_color' => SystemSetting::getSetting('notification_info_color', 'blue'),
            'duration' => SystemSetting::getSetting('notification_duration', 5),
            'position' => SystemSetting::getSetting('notification_position', 'top-right'),
            'sound_enabled' => SystemSetting::getSetting('notification_sound_enabled', false),
            'animation' => SystemSetting::getSetting('notification_animation', 'slide'),
        ];

        return Inertia::render('Admin/Configuraciones/Notificaciones', [
            'settings' => $settings
        ]);
    }

    /**
     * Actualizar configuraciones de notificaciones
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'success_color' => 'required|in:green,blue,purple',
            'error_color' => 'required|in:red,orange',
            'warning_color' => 'required|in:yellow,orange',
            'info_color' => 'required|in:blue,gray',
            'duration' => 'required|integer|min:0|max:30',
            'position' => 'required|in:top-right,top-left,bottom-right,bottom-left,top-center',
            'sound_enabled' => 'boolean',
            'animation' => 'required|in:slide,fade,bounce,scale',
        ]);

        try {
            foreach ($validated as $key => $value) {
                SystemSetting::setSetting(
                    'notification_' . $key, 
                    $value, 
                    is_bool($value) ? 'boolean' : (is_numeric($value) ? 'integer' : 'string'),
                    'Configuración de notificaciones: ' . $key
                );
            }

            return redirect()->back()->with('success', 'Configuración de notificaciones actualizada exitosamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al actualizar configuraciones: ' . $e->getMessage());
        }
    }

    /**
     * Restablecer configuraciones por defecto
     */
    public function reset()
    {
        $defaults = [
            'notification_success_color' => 'green',
            'notification_error_color' => 'red',
            'notification_warning_color' => 'yellow',
            'notification_info_color' => 'blue',
            'notification_duration' => 5,
            'notification_position' => 'top-right',
            'notification_sound_enabled' => false,
            'notification_animation' => 'slide',
        ];

        foreach ($defaults as $key => $value) {
            SystemSetting::setSetting(
                $key, 
                $value, 
                is_bool($value) ? 'boolean' : (is_numeric($value) ? 'integer' : 'string'),
                'Configuración de notificaciones: ' . str_replace('notification_', '', $key)
            );
        }

        return redirect()->back()->with('success', 'Configuraciones de notificaciones restablecidas por defecto');
    }
}
