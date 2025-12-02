<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'description'
    ];

    /**
     * Obtener una configuración por clave
     */
    public static function getSetting($key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        
        if (!$setting) {
            return $default;
        }

        return static::castValue($setting->value, $setting->type);
    }

    /**
     * Establecer una configuración
     */
    public static function setSetting($key, $value, $type = 'string', $description = null)
    {
        return static::updateOrCreate(
            ['key' => $key],
            [
                'value' => is_array($value) || is_object($value) ? json_encode($value) : $value,
                'type' => $type,
                'description' => $description
            ]
        );
    }

    /**
     * Convertir el valor según su tipo
     */
    private static function castValue($value, $type)
    {
        return match ($type) {
            'boolean' => (bool) $value,
            'integer' => (int) $value,
            'float' => (float) $value,
            'json' => json_decode($value, true),
            default => $value
        };
    }

    /**
     * Obtener todas las configuraciones de notificaciones
     */
    public static function getNotificationConfig()
    {
        return [
            'color' => static::getSetting('notification_color', 'green'),
            'duration' => static::getSetting('notification_duration', 5),
            'position' => static::getSetting('notification_position', 'top'),
            'automatic_notifications' => static::getSetting('automatic_notifications', true)
        ];
    }
}
