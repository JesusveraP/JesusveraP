<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class LogoController extends Controller
{
    /**
     * Subir nuevo logo del sistema
     */
    public function upload(Request $request)
    {
        $validated = $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        try {
            // Crear directorio si no existe
            $logosDir = storage_path('app/public/logos');
            if (!File::exists($logosDir)) {
                File::makeDirectory($logosDir, 0755, true);
            }

            // Eliminar logo anterior si existe
            $oldLogoPath = SystemSetting::getSetting('logo_path');
            if ($oldLogoPath && $oldLogoPath !== '/images/sena-logo.svg' && $oldLogoPath !== '/images/sena-logo.png') {
                $oldPath = str_replace('/storage/', '', $oldLogoPath);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Subir nuevo logo
            $file = $request->file('logo');
            $filename = 'logo_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('logos', $filename, 'public');
            $logoUrl = '/storage/' . $path;
            
            // Guardar en la base de datos
            SystemSetting::setSetting('logo_path', $logoUrl, 'string', 'Ruta del logo institucional');

            return redirect()->back()->with('success', 'Logo actualizado exitosamente');
            
        } catch (\Exception $e) {
            \Log::error('Error al subir logo: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error al subir el logo: ' . $e->getMessage());
        }
    }

    /**
     * Restablecer logo por defecto
     */
    public function reset()
    {
        try {
            // Eliminar logo personalizado si existe
            $currentLogoPath = SystemSetting::getSetting('logo_path');
            if ($currentLogoPath && $currentLogoPath !== '/images/sena-logo.png') {
                $oldPath = str_replace('/storage/', '', $currentLogoPath);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Restablecer al logo por defecto
            SystemSetting::setSetting('logo_path', '/images/sena-logo.png', 'string', 'Ruta del logo institucional');

            return redirect()->back()->with('success', 'Logo restablecido al predeterminado');
        } catch (\Exception $e) {
            \Log::error('Error al restablecer logo: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error al restablecer logo: ' . $e->getMessage());
        }
    }

    /**
     * Eliminar logo personalizado
     */
    public function delete()
    {
        try {
            $currentLogoPath = SystemSetting::getSetting('logo_path');
            
            // Solo permitir eliminar logos personalizados
            if ($currentLogoPath && $currentLogoPath !== '/images/sena-logo.png') {
                $oldPath = str_replace('/storage/', '', $currentLogoPath);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
                
                // Restablecer al logo por defecto
                SystemSetting::setSetting('logo_path', '/images/sena-logo.png', 'string', 'Ruta del logo institucional');
                
                return redirect()->back()->with('success', 'Logo personalizado eliminado');
            }

            return redirect()->back()->with('info', 'No hay logo personalizado para eliminar');
        } catch (\Exception $e) {
            \Log::error('Error al eliminar logo: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error al eliminar logo: ' . $e->getMessage());
        }
    }
}