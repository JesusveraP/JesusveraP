import React, { createContext, useContext, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        return { colorScheme: 'green-600' }; // Fallback seguro
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const { systemSettings } = usePage().props || {};
    const colorScheme = systemSettings?.color_scheme || 'green-600';

    useEffect(() => {
        try {
            // Remover estilos previos
            const existingStyle = document.getElementById('global-theme-override');
            if (existingStyle) {
                existingStyle.remove();
            }

            // Mapeo simplificado de colores
            const colorMap = {
                'green-500': '34, 197, 94',
                'green-600': '22, 163, 74',
                'green-700': '21, 128, 61',
                'green-800': '22, 101, 52',
                'blue-500': '59, 130, 246',
                'blue-600': '37, 99, 235',
                'blue-700': '29, 78, 216',
                'blue-800': '30, 64, 175',
                'cyan-400': '34, 211, 238',
                'cyan-500': '6, 182, 212',
                'cyan-600': '8, 145, 178',
                'slate-600': '71, 85, 105',
                'slate-700': '51, 65, 85',
                'gray-600': '75, 85, 99',
                'teal-600': '13, 148, 136',
                'emerald-600': '5, 150, 105',
                'indigo-600': '79, 70, 229',
                'purple-600': '147, 51, 234'
            };

            const primaryRgb = colorMap[colorScheme] || colorMap['green-600'];
            
            // Crear estilo global más simple
            const style = document.createElement('style');
            style.id = 'global-theme-override';
            
            style.innerHTML = `
                :root {
                    --theme-primary-rgb: ${primaryRgb};
                }
                
                .bg-green-600 { background-color: rgb(var(--theme-primary-rgb)) !important; }
                .bg-green-700 { background-color: rgb(var(--theme-primary-rgb)) !important; }
                .hover\\:bg-green-700:hover { background-color: rgba(var(--theme-primary-rgb), 0.9) !important; }
                .text-green-600 { color: rgb(var(--theme-primary-rgb)) !important; }
                .border-green-500, .border-green-600 { border-color: rgb(var(--theme-primary-rgb)) !important; }
                .focus\\:ring-green-500:focus, .focus\\:ring-green-600:focus { 
                    --tw-ring-color: rgb(var(--theme-primary-rgb)) !important; 
                }
            `;
            
            document.head.appendChild(style);
        } catch (error) {
            console.error('Error aplicando tema:', error);
        }
    }, [colorScheme]);

    const themeValue = {
        colorScheme,
        primaryColor: colorScheme
    };

    return (
        <ThemeContext.Provider value={themeValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;