<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\SystemSetting;
use Inertia\Inertia;

class LoadSystemSettings
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Cargar configuraciones del sistema
        $systemSettings = [
            'logo_path' => SystemSetting::getSetting('logo_path', '/images/sena-logo.svg'),
            'system_name' => SystemSetting::getSetting('system_name', 'Sistema SENA'),
            'color_scheme' => SystemSetting::getSetting('color_scheme', 'green-600'),
            'language' => SystemSetting::getSetting('language', 'es'),
        ];

        // Compartir con todas las vistas de Inertia
        Inertia::share([
            'systemSettings' => $systemSettings
        ]);

        return $next($request);
    }
}
