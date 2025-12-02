import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function LogoDisplay({ size = "default", alt = "Logo SENA", className = "", logoPath = null }) {
    const { systemSettings } = usePage().props;
    const [logoUrl, setLogoUrl] = useState('/images/logo-sena.png');
    const [isLoading, setIsLoading] = useState(true);
    
    // Tamaños predefinidos con clases Tailwind responsive
    const sizeClasses = {
        small: "w-28 h-28",
        sidebar: "w-14 h-14",
        header: "w-10 h-10", 
        large: "w-24 h-24",
        md: "w-12 h-12",
        auth: "w-16 h-16",
        default: "w-12 h-12"
    };

    const currentSize = sizeClasses[size] || sizeClasses.default;

    // Efecto para actualizar el logo cuando cambian systemSettings o logoPath
    useEffect(() => {
        // Usar logoPath si se proporciona (toma prioridad para actualizaciones en tiempo real)
        if (logoPath) {
            console.log('Actualizando logo con logoPath:', logoPath);
            setLogoUrl(logoPath);
        } else if (systemSettings?.logo_path) {
            let url = systemSettings.logo_path;
            
            // Agregar timestamp para forzar la recarga del navegador
            if (url.includes('/storage/')) {
                url = `${url}?t=${Date.now()}`;
            }
            
            console.log('Actualizando logo a:', url);
            setLogoUrl(url);
        } else {
            // Usar el logo del SENA por defecto
            setLogoUrl('/images/logo-sena.png');
        }
        setIsLoading(false);
    }, [logoPath, systemSettings?.logo_path]);

    const handleImageError = (e) => {
        console.error('Error al cargar el logo:', e.target.src);
        // Si falla, intentar con el logo SVG por defecto
        e.target.src = '/images/sena-logo.svg';
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <img
                src={logoUrl}
                alt={alt}
                className={`${currentSize} object-contain`}
                onError={handleImageError}
                loading="lazy"
            />
        </div>
    );
}