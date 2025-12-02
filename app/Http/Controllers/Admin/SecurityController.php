<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SecurityController extends Controller
{
    /**
     * Mostrar configuraciones de seguridad
     */
    public function index()
    {
        $settings = [
            // Políticas de contraseña
            'password_min_length' => SystemSetting::getSetting('password_min_length', 8),
            'password_require_uppercase' => SystemSetting::getSetting('password_require_uppercase', true),
            'password_require_numbers' => SystemSetting::getSetting('password_require_numbers', true),
            'password_require_symbols' => SystemSetting::getSetting('password_require_symbols', false),
            'password_expiration_days' => SystemSetting::getSetting('password_expiration_days', 90),
            
            // Autenticación en dos pasos
            'two_factor_enabled' => SystemSetting::getSetting('two_factor_enabled', false),
            'two_factor_method' => SystemSetting::getSetting('two_factor_method', 'email'),
            
            // Bloqueo automático
            'auto_lock_attempts' => SystemSetting::getSetting('auto_lock_attempts', 5),
            'auto_lock_duration' => SystemSetting::getSetting('auto_lock_duration', 15),
        ];

        $stats = $this->getSecurityStats();

        return Inertia::render('Admin/Configuraciones/Seguridad', [
            'settings' => $settings,
            'stats' => $stats
        ]);
    }

    /**
     * Actualizar todas las configuraciones de seguridad
     */
    public function updateAll(Request $request)
    {
        $validated = $request->validate([
            'password_min_length' => 'required|integer|min:6|max:32',
            'password_require_uppercase' => 'boolean',
            'password_require_numbers' => 'boolean',
            'password_require_symbols' => 'boolean',
            'password_expiration_days' => 'required|integer|min:0|max:365',
            'two_factor_enabled' => 'boolean',
            'two_factor_method' => 'required|in:email,sms,app',
            'auto_lock_attempts' => 'required|integer|min:3|max:20',
            'auto_lock_duration' => 'required|integer|min:1|max:120',
        ]);

        try {
            foreach ($validated as $key => $value) {
                SystemSetting::setSetting(
                    $key, 
                    $value, 
                    is_bool($value) ? 'boolean' : 'integer',
                    'Configuración de seguridad: ' . $key
                );
            }

            return redirect()->back()->with('success', 'Configuraciones de seguridad actualizadas exitosamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al actualizar configuraciones: ' . $e->getMessage());
        }
    }

    /**
     * Actualizar políticas de contraseña específicamente
     */
    public function updatePasswordPolicies(Request $request)
    {
        $validated = $request->validate([
            'password_min_length' => 'required|integer|min:6|max:32',
            'password_require_uppercase' => 'boolean',
            'password_require_numbers' => 'boolean',
            'password_require_symbols' => 'boolean',
            'password_expiration_days' => 'required|integer|min:0|max:365',
        ]);

        try {
            foreach ($validated as $key => $value) {
                SystemSetting::setSetting(
                    $key, 
                    $value, 
                    is_bool($value) ? 'boolean' : 'integer',
                    'Política de contraseñas: ' . $key
                );
            }

            return redirect()->back()->with('success', 'Políticas de contraseña actualizadas exitosamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al actualizar políticas: ' . $e->getMessage());
        }
    }

    /**
     * Actualizar configuraciones de autenticación en dos pasos
     */
    public function updateTwoFactor(Request $request)
    {
        $validated = $request->validate([
            'two_factor_enabled' => 'boolean',
            'two_factor_method' => 'required|in:email,sms,app',
        ]);

        try {
            SystemSetting::setSetting('two_factor_enabled', $validated['two_factor_enabled'], 'boolean', 'Autenticación 2FA habilitada');
            SystemSetting::setSetting('two_factor_method', $validated['two_factor_method'], 'string', 'Método de autenticación 2FA');

            return redirect()->back()->with('success', 'Configuración de autenticación en dos pasos actualizada');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al actualizar 2FA: ' . $e->getMessage());
        }
    }

    /**
     * Actualizar configuraciones de bloqueo automático
     */
    public function updateAutoLock(Request $request)
    {
        $validated = $request->validate([
            'auto_lock_attempts' => 'required|integer|min:3|max:20',
            'auto_lock_duration' => 'required|integer|min:1|max:120',
        ]);

        try {
            SystemSetting::setSetting('auto_lock_attempts', $validated['auto_lock_attempts'], 'integer', 'Intentos antes del bloqueo');
            SystemSetting::setSetting('auto_lock_duration', $validated['auto_lock_duration'], 'integer', 'Duración del bloqueo en minutos');

            return redirect()->back()->with('success', 'Configuración de bloqueo automático actualizada');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al actualizar bloqueo automático: ' . $e->getMessage());
        }
    }

    /**
     * Restablecer configuraciones por defecto
     */
    public function resetToDefaults()
    {
        $defaults = [
            'password_min_length' => 8,
            'password_require_uppercase' => true,
            'password_require_numbers' => true,
            'password_require_symbols' => false,
            'password_expiration_days' => 90,
            'two_factor_enabled' => false,
            'two_factor_method' => 'email',
            'auto_lock_attempts' => 5,
            'auto_lock_duration' => 15,
        ];

        try {
            foreach ($defaults as $key => $value) {
                SystemSetting::setSetting(
                    $key, 
                    $value, 
                    is_bool($value) ? 'boolean' : 'integer',
                    'Configuración de seguridad por defecto: ' . $key
                );
            }

            return redirect()->back()->with('success', 'Configuraciones de seguridad restablecidas por defecto');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al restablecer configuraciones: ' . $e->getMessage());
        }
    }

    /**
     * Obtener estadísticas de seguridad
     */
    public function getSecurityStats()
    {
        return [
            'password_secure' => SystemSetting::getSetting('password_require_uppercase', true) && 
                               SystemSetting::getSetting('password_require_numbers', true) &&
                               SystemSetting::getSetting('password_min_length', 8) >= 8,
            'two_factor_status' => SystemSetting::getSetting('two_factor_enabled', false) ? 'enabled' : 'disabled',
            'auto_lock_status' => SystemSetting::getSetting('auto_lock_attempts', 5) <= 5 ? 'enabled' : 'disabled',
        ];
    }
}