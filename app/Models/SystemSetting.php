<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class SystemSetting extends Model
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
     * Obtener todas las configuraciones de personalización
     */
    public static function getCustomizationConfig()
    {
        return [
            'logo_path' => static::getSetting('logo_path', '/images/sena-logo.png'),
            'language' => static::getSetting('language', 'es'),
            'color_scheme' => static::getSetting('color_scheme', 'green-600'),
            'system_name' => static::getSetting('system_name', 'Gestión Instructores SENA'),
        ];
    }

    /**
     * Subir y establecer nuevo logo
     */
    public static function uploadLogo($file)
    {
        $path = $file->store('logos', 'public');
        static::setSetting('logo_path', '/storage/' . $path, 'string', 'Ruta del logo institucional');
        return '/storage/' . $path;
    }
}
