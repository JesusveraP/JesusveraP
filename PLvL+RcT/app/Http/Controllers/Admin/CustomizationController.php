<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CustomizationController extends Controller
{
    /**
     * Mostrar la página de personalización del sistema
     */
    public function index()
    {
        $settings = SystemSetting::getCustomizationConfig();
        
        return Inertia::render('Admin/Configuraciones/Personalizacion', [
            'settings' => $settings
        ]);
    }

    /**
     * Actualizar configuraciones de personalización (nombre, idioma, color)
     */
    public function update(Request $request)
    {
        try {
            $validated = $request->validate([
                'language' => 'nullable|in:es,en,fr,pt',
                'color_scheme' => 'nullable|string',
                'system_name' => 'nullable|string|max:255'
            ]);

            // Actualizar solo los campos que se enviaron
            if (!empty($validated['language'])) {
                SystemSetting::setSetting('language', $validated['language'], 'string', 'Idioma del sistema');
            }

            if (!empty($validated['color_scheme'])) {
                SystemSetting::setSetting('color_scheme', $validated['color_scheme'], 'string', 'Esquema de colores del sistema');
            }

            if (!empty($validated['system_name'])) {
                SystemSetting::setSetting('system_name', $validated['system_name'], 'string', 'Nombre del sistema');
            }

            // Limpiar caché
            \Illuminate\Support\Facades\Cache::forget('system_settings');

            // Si es una solicitud AJAX/fetch, devolver JSON
            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => '✅ Configuración actualizada exitosamente'
                ], 200);
            }

            return redirect()->back()->with('success', '✅ Configuración actualizada exitosamente');
            
        } catch (\Exception $e) {
            \Log::error('Error en CustomizationController.update: ' . $e->getMessage());
            
            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ Error: ' . $e->getMessage()
                ], 500);
            }
            
            return redirect()->back()->with('error', '❌ Error: ' . $e->getMessage());
        }
    }

    /**
     * Subir nuevo logo institucional
     */
    public function uploadLogo(Request $request)
    {
        try {
            $validated = $request->validate([
                'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
            ]);

            // Obtener el logo anterior
            $oldLogoPath = SystemSetting::getSetting('logo_path');
            
            // Eliminar logo anterior si existe y no es el por defecto
            if ($oldLogoPath && !in_array($oldLogoPath, ['/images/sena-logo.svg', '/images/sena-logo.png'])) {
                $oldPath = str_replace('/storage/', '', $oldLogoPath);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Subir el nuevo logo
            $file = $request->file('logo');
            $filename = 'logo_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('logos', $filename, 'public');
            $logoUrl = '/storage/' . $path;
            
            // Guardar en la base de datos
            SystemSetting::setSetting('logo_path', $logoUrl, 'string', 'Ruta del logo institucional');

            // Limpiar caché si es necesario
            \Illuminate\Support\Facades\Cache::forget('system_settings');

            // Si es una solicitud AJAX/fetch, devolver JSON
            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => '✅ Logo actualizado exitosamente',
                    'logo_url' => $logoUrl
                ], 200);
            }

            // Si no, hacer redirect
            return redirect()->back()->with('success', '✅ Logo actualizado exitosamente');
            
        } catch (\Exception $e) {
            \Log::error('Error al subir logo: ' . $e->getMessage());
            
            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ Error al subir logo: ' . $e->getMessage()
                ], 500);
            }

            return redirect()->back()->with('error', '❌ Error: ' . $e->getMessage());
        }
    }

    /**
     * Restablecer configuraciones a valores por defecto
     */
    public function reset(Request $request)
    {
        try {
            // Obtener el logo actual para eliminarlo si no es el por defecto
            $currentLogo = SystemSetting::getSetting('logo_path');
            if ($currentLogo && !in_array($currentLogo, ['/images/sena-logo.svg', '/images/sena-logo.png'])) {
                $oldPath = str_replace('/storage/', '', $currentLogo);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Restablecer todas las configuraciones
            SystemSetting::setSetting('language', 'es', 'string', 'Idioma del sistema');
            SystemSetting::setSetting('color_scheme', 'green-600', 'string', 'Esquema de colores del sistema');
            SystemSetting::setSetting('system_name', 'Gestión Instructores SENA', 'string', 'Nombre del sistema');
            SystemSetting::setSetting('logo_path', '/images/sena-logo.png', 'string', 'Ruta del logo institucional');

            // Limpiar caché
            \Illuminate\Support\Facades\Cache::forget('system_settings');

            // Si es una solicitud AJAX/fetch, devolver JSON
            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => '✅ Configuración restablecida a valores por defecto'
                ], 200);
            }

            return redirect()->back()->with('success', '✅ Configuración restablecida a valores por defecto');
            
        } catch (\Exception $e) {
            \Log::error('Error al restablecer configuración: ' . $e->getMessage());
            
            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ Error: ' . $e->getMessage()
                ], 500);
            }

            return redirect()->back()->with('error', '❌ Error: ' . $e->getMessage());
        }
    }

    /**
     * Obtener la configuración actual (para solicitudes AJAX)
     */
    public function getSettings()
    {
        try {
            $settings = SystemSetting::getCustomizationConfig();
            return response()->json([
                'success' => true,
                'data' => $settings
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Prueba de carga de archivo (para debug)
     */
    public function testUpload(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Endpoint de prueba funciona',
            'method' => $request->method(),
            'has_file' => $request->hasFile('logo'),
            'headers' => $request->headers->all()
        ], 200);
    }
}
