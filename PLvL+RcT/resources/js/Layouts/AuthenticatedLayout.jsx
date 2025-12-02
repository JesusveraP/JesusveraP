import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import LogoDisplay from '@/Components/LogoDisplay';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, systemSettings } = usePage().props;
    const user = auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // Mapear colores a clases de Tailwind
    const colorClassMap = {
        green: 'bg-green-600',
        blue: 'bg-blue-600',
        indigo: 'bg-indigo-600',
        purple: 'bg-purple-600',
        red: 'bg-red-600',
        orange: 'bg-orange-600',
        yellow: 'bg-yellow-600',
        teal: 'bg-teal-600',
        cyan: 'bg-cyan-600',
        gray: 'bg-gray-600',
        slate: 'bg-slate-600',
        stone: 'bg-stone-600',
    };

    const navBarColor = colorClassMap[systemSettings?.primary_color] || 'bg-green-600';

    // Aplicar color dinámicamente cuando cambie
    useEffect(() => {
        const colorMap = {
            green: { 50: '240, 253, 244', 100: '220, 252, 231', 200: '187, 247, 208', 300: '134, 239, 172', 400: '74, 222, 128', 500: '34, 197, 94', 600: '22, 163, 74', 700: '16, 185, 74', 800: '20, 83, 45', 900: '20, 83, 45' },
            blue: { 50: '239, 246, 255', 100: '219, 234, 254', 200: '191, 219, 254', 300: '147, 197, 253', 400: '96, 165, 250', 500: '59, 130, 246', 600: '37, 99, 235', 700: '29, 78, 216', 800: '30, 58, 138', 900: '30, 58, 138' },
            indigo: { 50: '238, 242, 255', 100: '224, 231, 255', 200: '199, 210, 254', 300: '165, 180, 252', 400: '129, 140, 248', 500: '99, 102, 241', 600: '79, 70, 229', 700: '67, 56, 202', 800: '55, 48, 163', 900: '55, 48, 163' },
            purple: { 50: '250, 245, 255', 100: '243, 232, 255', 200: '232, 204, 255', 300: '216, 180, 254', 400: '192, 132, 250', 500: '168, 85, 247', 600: '147, 51, 234', 700: '126, 34, 206', 800: '88, 28, 135', 900: '88, 28, 135' },
            red: { 50: '254, 242, 242', 100: '254, 226, 226', 200: '254, 202, 202', 300: '252, 165, 165', 400: '248, 113, 113', 500: '239, 68, 68', 600: '220, 38, 38', 700: '185, 28, 28', 800: '127, 29, 29', 900: '127, 29, 29' },
            orange: { 50: '255, 247, 237', 100: '255, 237, 213', 200: '254, 215, 170', 300: '253, 186, 116', 400: '251, 146, 60', 500: '249, 115, 22', 600: '234, 88, 12', 700: '194, 65, 12', 800: '124, 45, 18', 900: '124, 45, 18' },
            yellow: { 50: '254, 252, 232', 100: '254, 248, 204', 200: '254, 240, 138', 300: '253, 224, 71', 400: '250, 204, 21', 500: '234, 179, 8', 600: '202, 138, 4', 700: '161, 98, 7', 800: '113, 63, 18', 900: '113, 63, 18' },
            teal: { 50: '240, 253, 250', 100: '204, 251, 241', 200: '153, 246, 228', 300: '94, 234, 212', 400: '45, 212, 191', 500: '20, 184, 166', 600: '13, 148, 136', 700: '15, 118, 110', 800: '20, 83, 80', 900: '20, 83, 80' },
            cyan: { 50: '240, 249, 250', 100: '207, 250, 254', 200: '165, 243, 252', 300: '103, 232, 249', 400: '34, 211, 238', 500: '34, 211, 238', 600: '8, 145, 178', 700: '14, 116, 144', 800: '21, 94, 117', 900: '21, 94, 117' },
            gray: { 50: '249, 250, 251', 100: '243, 244, 246', 200: '229, 231, 235', 300: '209, 213, 219', 400: '156, 163, 175', 500: '107, 114, 128', 600: '75, 85, 99', 700: '55, 65, 81', 800: '31, 41, 55', 900: '17, 24, 39' },
            slate: { 50: '248, 250, 252', 100: '241, 245, 249', 200: '226, 232, 240', 300: '203, 213, 225', 400: '148, 163, 184', 500: '100, 116, 139', 600: '71, 85, 105', 700: '51, 65, 85', 800: '30, 41, 59', 900: '15, 23, 42' },
            stone: { 50: '250, 250, 249', 100: '245, 245, 244', 200: '231, 229, 228', 300: '214, 211, 209', 400: '168, 162, 158', 500: '120, 113, 108', 600: '87, 83, 82', 700: '68, 64, 60', 800: '41, 37, 36', 900: '28, 25, 23' }
        };

        const colorName = systemSettings?.primary_color || 'green';
        const color = colorMap[colorName] || colorMap.green;
        const root = document.documentElement;
        
        Object.entries(color).forEach(([shade, rgb]) => {
            root.style.setProperty(`--primary-${shade}`, rgb);
        });
    }, [systemSettings?.primary_color]);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className={`${navBarColor} border-b border-gray-100`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <LogoDisplay 
                                        size="header"
                                        variant="default"
                                        alt="Logo del Sistema"
                                    />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="text-white hover:text-gray-200"
                                >
                                    Dashboard
                                </NavLink>
                                
                                {/* Enlaces para administradores */}
                                {user.role === 'admin' && (
                                    <>
                                        <NavLink
                                            href={route('admin.dashboard')}
                                            active={route().current('admin.*')}
                                            className="text-white hover:text-gray-200"
                                        >
                                            Administración
                                        </NavLink>
                                        <NavLink
                                            href={route('instructores.index')}
                                            active={route().current('instructores.*')}
                                            className="text-white hover:text-gray-200"
                                        >
                                            Instructores
                                        </NavLink>
                                    </>
                                )}

                                {/* Enlaces para guardias */}
                                {user.role === 'guardia' && (
                                    <>
                                        <NavLink
                                            href={route('guardia.dashboard')}
                                            active={route().current('guardia.dashboard')}
                                            className="text-white hover:text-gray-200"
                                        >
                                            Control de Asistencia
                                        </NavLink>
                                        <NavLink
                                            href={route('guardia.historial')}
                                            active={route().current('guardia.historial')}
                                            className="text-white hover:text-gray-200"
                                        >
                                            Historial
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white bg-opacity-20 px-3 py-2 text-sm font-medium leading-4 text-white transition duration-150 ease-in-out hover:bg-opacity-30 focus:outline-none"
                                            >
                                                {user.name}
                                                {user.role === 'admin' && (
                                                    <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                        Admin
                                                    </span>
                                                )}
                                                {user.role === 'guardia' && (
                                                    <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                        Guardia
                                                    </span>
                                                )}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        {user.role === 'admin' && (
                                            <>
                                                <Dropdown.Link href={route('admin.dashboard')}>
                                                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                    </svg>
                                                    Panel de Administración
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('instructores.index')}>
                                                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    Gestionar Instructores
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('admin.users.index')}>
                                                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                    </svg>
                                                    Gestionar Usuarios
                                                </Dropdown.Link>
                                                <hr className="border-gray-200" />
                                            </>
                                        )}

                                        {user.role === 'guardia' && (
                                            <>
                                                <Dropdown.Link href={route('guardia.dashboard')}>
                                                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Registro de Asistencia
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('guardia.historial')}>
                                                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    Historial de Registros
                                                </Dropdown.Link>
                                                <hr className="border-gray-200" />
                                            </>
                                        )}

                                        <Dropdown.Link href={route('profile.edit')}>
                                            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Mi Perfil
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Cerrar Sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-white transition duration-150 ease-in-out hover:bg-white hover:bg-opacity-20 focus:bg-white focus:bg-opacity-20 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden`}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        
                        {/* Enlaces móviles para administradores */}
                        {user.role === 'admin' && (
                            <>
                                <ResponsiveNavLink
                                    href={route('admin.dashboard')}
                                    active={route().current('admin.*')}
                                >
                                    Administración
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('instructores.index')}
                                    active={route().current('instructores.*')}
                                >
                                    Instructores
                                </ResponsiveNavLink>
                            </>
                        )}

                        {/* Enlaces móviles para guardias */}
                        {user.role === 'guardia' && (
                            <>
                                <ResponsiveNavLink
                                    href={route('guardia.dashboard')}
                                    active={route().current('guardia.dashboard')}
                                >
                                    Control de Asistencia
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('guardia.historial')}
                                    active={route().current('guardia.historial')}
                                >
                                    Historial
                                </ResponsiveNavLink>
                            </>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-white">
                                {user.name}
                                {user.role === 'admin' && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                        Admin
                                    </span>
                                )}
                                {user.role === 'guardia' && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        Guardia
                                    </span>
                                )}
                            </div>
                            <div className="text-sm font-medium text-gray-200">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Mi Perfil
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Cerrar Sesión
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
