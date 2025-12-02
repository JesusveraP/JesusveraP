<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\SystemSetting;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'systemSettings' => $this->getSystemSettings(),
            ],
            'systemSettings' => $this->getSystemSettings(),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'logoPath' => fn () => $request->session()->get('logoPath'),
            ],
        ];
    }

    /**
     * Obtener configuraciones del sistema
     */
    private function getSystemSettings(): array
    {
        try {
            $settings = SystemSetting::whereIn('key', [
                'system_name',
                'logo_path',
                'color_scheme',
                'language'
            ])->pluck('value', 'key')->toArray();

            // Obtener el logo_path
            $logoPath = $settings['logo_path'] ?? '/images/sena-logo.png';

            return [
                'system_name' => $settings['system_name'] ?? 'Gestión Instructores SENA',
                'logo_path' => $logoPath,
                'color_scheme' => $settings['color_scheme'] ?? 'green-600',
                'language' => $settings['language'] ?? 'es',
            ];
        } catch (\Exception $e) {
            // Fallback en caso de error con la base de datos
            return [
                'system_name' => 'Gestión Instructores SENA',
                'logo_path' => '/images/sena-logo.png',
                'color_scheme' => 'green-600',
                'language' => 'es',
            ];
        }
    }
}
