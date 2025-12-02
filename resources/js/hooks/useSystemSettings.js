import { usePage } from '@inertiajs/react';

/**
 * Hook personalizado para manejar logos y configuraciones del sistema
 * Proporciona acceso fácil a configuraciones de logo y sistema
 */
export const useSystemSettings = () => {
    const { props } = usePage();
    const systemSettings = props.systemSettings || props.auth?.systemSettings;
    
    return {
        // Configuraciones del sistema
        systemSettings,
        
        // Información del logo
        logoPath: systemSettings?.logo_path || systemSettings?.system_logo || '/images/logo-sena.png',
        systemName: systemSettings?.system_name || 'Sistema SENA',
        
        // Funciones de utilidad
        hasCustomLogo: () => !!(systemSettings?.logo_path || systemSettings?.system_logo),
        
        // Configuraciones adicionales
        primaryColor: systemSettings?.primary_color || 'green',
        theme: systemSettings?.theme || 'light',
        locale: systemSettings?.locale || 'es',
        
        // Métodos para actualizar configuraciones (para futuras implementaciones)
        updateLogo: (newLogoPath) => {
            // Esta función se puede implementar más tarde para actualizar el logo
            console.log('Updating logo to:', newLogoPath);
        }
    };
};

export default useSystemSettings;