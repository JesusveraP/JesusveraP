import { useState, createContext, useContext } from 'react';

// Contexto para el sistema de logos
const LogoContext = createContext();

/**
 * Provider que maneja el estado global del logo
 */
export const LogoProvider = ({ children }) => {
    const [logoData, setLogoData] = useState({
        path: '/images/logo-sena.png',
        timestamp: Date.now(),
        systemName: 'Sistema SENA'
    });

    // Función para actualizar el logo manualmente
    const updateLogo = (newPath, systemName = null) => {
        setLogoData(prev => ({
            path: newPath || prev.path,
            timestamp: Date.now(),
            systemName: systemName || prev.systemName
        }));
    };

    // Función para inicializar el logo con datos del servidor
    const initializeLogo = (serverData) => {
        if (serverData) {
            setLogoData({
                path: serverData.logo_path || '/images/logo-sena.png',
                timestamp: Date.now(),
                systemName: serverData.system_name || 'Sistema SENA'
            });
        }
    };

    return (
        <LogoContext.Provider value={{ logoData, updateLogo, initializeLogo }}>
            {children}
        </LogoContext.Provider>
    );
};

/**
 * Hook para usar el contexto del logo
 */
export const useLogoContext = () => {
    const context = useContext(LogoContext);
    if (!context) {
        throw new Error('useLogoContext debe ser usado dentro de LogoProvider');
    }
    return context;
};