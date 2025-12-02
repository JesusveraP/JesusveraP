import { useLogoContext } from '@/Context/LogoContext';
import { router } from '@inertiajs/react';

/**
 * Hook para manejar la subida y cambio de logos
 */
export const useLogoUploader = () => {
    const { logoData, updateLogo } = useLogoContext();

    const uploadLogo = async (file, onSuccess = null, onError = null) => {
        if (!file) {
            onError?.('No se ha seleccionado ningún archivo');
            return;
        }

        // Validar tipo de archivo
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            onError?.('Tipo de archivo no válido. Use JPG, PNG, SVG o WebP');
            return;
        }

        // Validar tamaño (máximo 2MB)
        if (file.size > 2 * 1024 * 1024) {
            onError?.('El archivo es muy grande. Máximo 2MB');
            return;
        }

        const formData = new FormData();
        formData.append('logo', file);

        try {
            // Subir archivo al servidor
            router.post('/admin/system/logo', formData, {
                forceFormData: true,
                onSuccess: (response) => {
                    const newLogoPath = response.props?.systemSettings?.logo_path || response.props?.flash?.logoPath;
                    
                    if (newLogoPath) {
                        // Actualizar el contexto inmediatamente
                        updateLogo(newLogoPath);
                        onSuccess?.(newLogoPath);
                    }
                },
                onError: (errors) => {
                    onError?.(errors.logo || 'Error al subir el logo');
                }
            });
        } catch (error) {
            onError?.('Error de conexión al subir el logo');
        }
    };

    const resetToDefault = async (onSuccess = null, onError = null) => {
        try {
            router.post('/admin/system/logo/reset', {}, {
                onSuccess: (response) => {
                    const defaultLogo = '/images/logo-sena.png';
                    updateLogo(defaultLogo);
                    onSuccess?.(defaultLogo);
                },
                onError: (errors) => {
                    onError?.('Error al restablecer el logo');
                }
            });
        } catch (error) {
            onError?.('Error de conexión al restablecer el logo');
        }
    };

    return {
        currentLogo: logoData,
        uploadLogo,
        resetToDefault,
        updateLogo
    };
};

export default useLogoUploader;