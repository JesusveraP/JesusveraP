import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export const useSystemColors = () => {
    const { systemSettings } = usePage().props;
    const [currentColorScheme, setCurrentColorScheme] = useState(systemSettings?.color_scheme || 'green-600');

    // Escuchar eventos de cambio de color del sistema
    useEffect(() => {
        const handleColorChange = (event) => {
            if (event.detail && event.detail.color_scheme) {
                setCurrentColorScheme(event.detail.color_scheme);
            }
        };

        window.addEventListener('systemColorsChanged', handleColorChange);
        
        return () => {
            window.removeEventListener('systemColorsChanged', handleColorChange);
        };
    }, []);

    // Actualizar cuando systemSettings cambie
    useEffect(() => {
        if (systemSettings?.color_scheme && systemSettings.color_scheme !== currentColorScheme) {
            setCurrentColorScheme(systemSettings.color_scheme);
        }
    }, [systemSettings?.color_scheme]);

    const colorScheme = currentColorScheme;

    // Mapeo de colores incluyendo los colores SENA específicos
    const tailwindColors = {
        // Colores SENA específicos con valores RGB exactos
        'green-500': '34 197 94',    // Verde SENA Claro #22C55E
        'green-600': '22 163 74',    // Verde SENA Oficial #16A34A  
        'green-700': '21 128 61',    // Verde SENA Oscuro #15803D
        'green-800': '22 101 52',    // Verde SENA Intenso #166534
        'emerald-500': '16 185 129', // Esmeralda Claro #10B981
        'emerald-600': '5 150 105',  // Esmeralda Medio #059669
        
        'red-50': '254 242 242',
        'red-100': '254 226 226',
        'red-200': '254 202 202',
        'red-300': '252 165 165',
        'red-400': '248 113 113',
        'red-500': '239 68 68',
        'red-600': '220 38 38',
        'red-700': '185 28 28',
        'red-800': '153 27 27',
        'red-900': '127 29 29',
        'blue-50': '239 246 255',
        'blue-100': '219 234 254',
        'blue-200': '191 219 254',
        'blue-300': '147 197 253',
        'blue-400': '96 165 250',
        'blue-500': '59 130 246',
        'blue-600': '37 99 235',
        'blue-700': '29 78 216',
        'blue-800': '30 64 175',
        'blue-900': '30 58 138',
        'green-50': '240 253 244',
        'green-100': '220 252 231',
        'green-200': '187 247 208',
        'green-300': '134 239 172',
        'green-400': '74 222 128',
        'green-900': '20 83 45',
        'purple-50': '250 245 255',
        'purple-100': '243 232 255',
        'purple-200': '233 213 255',
        'purple-300': '196 181 253',
        'purple-400': '167 139 250',
        'purple-500': '139 92 246',
        'purple-600': '124 58 237',
        'purple-700': '109 40 217',
        'purple-800': '91 33 182',
        'purple-900': '76 29 149',
        'yellow-50': '254 252 232',
        'yellow-100': '254 249 195',
        'yellow-200': '254 240 138',
        'yellow-300': '253 224 71',
        'yellow-400': '250 204 21',
        'yellow-500': '234 179 8',
        'yellow-600': '202 138 4',
        'yellow-700': '161 98 7',
        'yellow-800': '133 77 14',
        'yellow-900': '113 63 18',
        'indigo-50': '238 242 255',
        'indigo-100': '224 231 255',
        'indigo-200': '199 210 254',
        'indigo-300': '165 180 252',
        'indigo-400': '129 140 248',
        'indigo-500': '99 102 241',
        'indigo-600': '79 70 229',
        'indigo-700': '67 56 202',
        'indigo-800': '55 48 163',
        'indigo-900': '49 46 129',
        'pink-50': '253 242 248',
        'pink-100': '252 231 243',
        'pink-200': '251 207 232',
        'pink-300': '249 168 212',
        'pink-400': '244 114 182',
        'pink-500': '236 72 153',
        'pink-600': '219 39 119',
        'pink-700': '190 24 93',
        'pink-800': '157 23 77',
        'pink-900': '131 24 67',
        'orange-50': '255 247 237',
        'orange-100': '255 237 213',
        'orange-200': '254 215 170',
        'orange-300': '253 186 116',
        'orange-400': '251 146 60',
        'orange-500': '249 115 22',
        'orange-600': '234 88 12',
        'orange-700': '194 65 12',
        'orange-800': '154 52 18',
        'orange-900': '124 45 18',
        'teal-500': '20 184 166',
        'teal-600': '13 148 136',
        'cyan-400': '34 211 238',
        'cyan-500': '6 182 212',
        'cyan-600': '8 145 178',
        'sky-500': '14 165 233',
        'sky-600': '2 132 199',
        'slate-600': '71 85 105',
        'slate-700': '51 65 85',
        'gray-600': '75 85 99',
        'gray-700': '55 65 81',
        'zinc-600': '82 82 91',
        'stone-600': '87 83 78',
        'amber-500': '245 158 11',
    };

    // Obtener el color RGB del esquema seleccionado
    const getCurrentColorRGB = () => {
        return tailwindColors[colorScheme] || tailwindColors['green-600'];
    };

    // Generar variantes del color
    const getColorVariants = (baseColor) => {
        const [color, intensity] = baseColor.split('-');
        const baseIntensity = parseInt(intensity);
        
        const lighterIntensity = Math.max(baseIntensity - 100, 50);
        const darkerIntensity = Math.min(baseIntensity + 100, 900);
        
        return {
            primary: `bg-${baseColor}`,
            primaryHover: `hover:bg-${color}-${darkerIntensity}`,
            primaryText: `text-${baseColor}`,
            primaryBorder: `border-${baseColor}`,
            primaryRing: `ring-${baseColor}`,
            lighter: `bg-${color}-${lighterIntensity}`,
            darker: `bg-${color}-${darkerIntensity}`,
        };
    };

    const colors = getColorVariants(colorScheme);

    // Aplicar CSS dinámico mejorado para colores SENA
    useEffect(() => {
        const [color, intensity] = colorScheme.split('-');
        const currentColorRGB = getCurrentColorRGB();
        
        // Remover estilos previos
        const existingStyle = document.getElementById('dynamic-theme-colors');
        if (existingStyle) {
            existingStyle.remove();
        }

        // Crear nuevo estilo global
        const style = document.createElement('style');
        style.id = 'dynamic-theme-colors';
        
        // Calcular colores hover (más oscuros)
        const baseIntensity = parseInt(intensity);
        const hoverIntensity = Math.min(baseIntensity + 100, 900);
        const hoverColorRGB = tailwindColors[`${color}-${hoverIntensity}`] || currentColorRGB;
        
        style.innerHTML = `
            /* Variables CSS para colores dinámicos */
            :root {
                --color-primary: rgb(${currentColorRGB});
                --color-primary-hover: rgb(${hoverColorRGB});
            }
            
            /* Aplicar colores SENA específicos */
            .bg-${colorScheme}, 
            .bg-primary, 
            .btn-primary,
            button[class*="bg-${color}"],
            [data-color-primary] {
                background-color: rgb(${currentColorRGB}) !important;
            }
            
            /* Estados hover para botones SENA */
            .bg-${colorScheme}:hover,
            .bg-primary:hover,
            .btn-primary:hover,
            button[class*="bg-${color}"]:hover,
            [data-color-primary]:hover {
                background-color: rgb(${hoverColorRGB}) !important;
                opacity: 0.9;
            }
            
            /* Texto con colores SENA */
            .text-${colorScheme},
            .text-primary,
            a[class*="text-${color}"],
            [data-text-primary] {
                color: rgb(${currentColorRGB}) !important;
            }
            
            /* Bordes con colores SENA */
            .border-${colorScheme},
            .border-primary,
            [class*="border-${color}"],
            [data-border-primary] {
                border-color: rgb(${currentColorRGB}) !important;
            }
            
            /* Rings y focus states para colores SENA */
            .ring-${colorScheme},
            .focus\\:ring-${colorScheme}:focus,
            .focus\\:ring-primary:focus {
                --tw-ring-color: rgb(${currentColorRGB}) !important;
                box-shadow: 0 0 0 3px rgba(${currentColorRGB}, 0.3) !important;
            }
            
            /* Focus states para inputs */
            .focus\\:border-${colorScheme}:focus,
            .focus\\:border-primary:focus {
                border-color: rgb(${currentColorRGB}) !important;
            }
            
            /* Aplicar a todos los elementos con clases verdes existentes */
            .bg-green-500, .bg-green-600, .bg-green-700, .bg-green-800,
            .bg-emerald-500, .bg-emerald-600 {
                background-color: rgb(${currentColorRGB}) !important;
            }
            
            .text-green-500, .text-green-600, .text-green-700, .text-green-800,
            .text-emerald-500, .text-emerald-600 {
                color: rgb(${currentColorRGB}) !important;
            }
            
            .border-green-500, .border-green-600, .border-green-700, .border-green-800,
            .border-emerald-500, .border-emerald-600 {
                border-color: rgb(${currentColorRGB}) !important;
            }
            
            /* Sidebar y navegación */
            .sidebar-bg,
            nav[class*="bg-green"],
            header[class*="bg-green"] {
                background-color: rgb(${currentColorRGB}) !important;
            }
            
            /* Enlaces específicos */
            a.text-green-600,
            .link-primary {
                color: rgb(${currentColorRGB}) !important;
            }
            
            /* Badges y elementos de estado */
            .badge-success,
            .status-active {
                background-color: rgb(${currentColorRGB}) !important;
                color: white !important;
            }
            
            /* Elementos específicos del panel de administración */
            .admin-header,
            .dashboard-card[data-primary],
            .stats-card[data-color="green"] {
                border-color: rgb(${currentColorRGB}) !important;
            }
            
            /* Personalización avanzada para componentes React */
            [class*="bg-green"][class*="500"],
            [class*="bg-green"][class*="600"],
            [class*="bg-green"][class*="700"],
            [class*="bg-green"][class*="800"],
            [class*="bg-emerald"] {
                background-color: rgb(${currentColorRGB}) !important;
            }
            
            [class*="text-green"][class*="500"],
            [class*="text-green"][class*="600"],
            [class*="text-green"][class*="700"],
            [class*="text-green"][class*="800"],
            [class*="text-emerald"] {
                color: rgb(${currentColorRGB}) !important;
            }
        `;
        
        document.head.appendChild(style);
        
        // Forzar un repintado para asegurar que los cambios se apliquen
        setTimeout(() => {
            document.body.classList.add('color-scheme-updated');
            setTimeout(() => {
                document.body.classList.remove('color-scheme-updated');
            }, 10);
        }, 50);
        
    }, [colorScheme]);

    return { colors, colorScheme, getCurrentColorRGB };
};

export default useSystemColors;