import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import LogoDisplay from '@/Components/LogoDisplay';
import DynamicColorStyles from '@/Components/DynamicColorStyles';
import { 
    Users, Shield, Clock, TrendingUp, Activity, UserCheck, 
    Settings, BarChart3, History, UserCircle, LogOut, 
    Menu, X, Home, FileText, Bell, ChevronDown, ChevronUp, Info
} from 'lucide-react';

export default function SidebarLayout({ title, children, header }) {
    const { auth, systemSettings, ziggy } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);
    const [mostrarAcercaDe, setMostrarAcercaDe] = useState(false);

    // Datos de desarrolladores
    const desarrolladores = [
        {
            nombre: 'Diego Digo Armando Quintero Contreras',
            cedula: '1091091655034',
            rol: 'Desarrollador 1',
            formacion: 'ADSO - Análisis y Desarrollo de Software',
            correo: 'diegoarmandoquintero57@gmail.com',
            celular: '3227773379'
        },
        {
            nombre: 'Kevin Duwan Coronel Caballero',
            cedula: '1091681160',
            rol: 'Desarrollador 2',
            formacion: 'ADSO - Análisis y Desarrollo de Software',
            correo: 'kevincaballer400@gmail.com',
            celular: '3049074779'
        },
        {
            nombre: 'Jorge Jesús Vera Pallares',
            cedula: '3257664',
            rol: 'Desarrollador 3',
            formacion: 'ADSO - Análisis y Desarrollo de Software',
            correo: 'jesusverap01@gmail.com',
            celular: '3223320275'
        }
    ];

    const liderEstructura = {
        nombre: 'Jessica Paola Quintero Carrascal',
        cargo: 'Instructora Líder',
        descripcion: 'Sistema de Gestión de Asistencia SENA - Plataforma integral para el control y monitoreo de asistencia de instructores'
    };

    // Función para determinar si una ruta está activa
    const isActiveRoute = (routeName) => {
        const currentPath = ziggy?.location || window.location.pathname;
        
        if (routeName === 'dashboard') {
            return currentPath === '/dashboard';
        }
        if (routeName === 'admin.dashboard') {
            return currentPath.includes('/admin/dashboard') || currentPath.endsWith('/admin');
        }
        if (routeName === 'guardia.dashboard') {
            return currentPath.includes('/guardia');
        }
        
        return currentPath.includes(routeName.replace('.', '/'));
    };

    // Configuración de navegación basada en el rol
    const getNavigationItems = () => {
        const commonItems = [
            {
                name: 'Dashboard Principal',
                href: route('dashboard'),
                icon: Home,
                active: isActiveRoute('dashboard'),
                show: true
            }
        ];

        const adminItems = user.role === 'admin' ? [
            {
                name: 'Panel Administrativo',
                href: route('admin.dashboard'),
                icon: BarChart3,
                active: isActiveRoute('admin.dashboard'),
                show: true
            },
            {
                name: 'Instructores',
                href: route('admin.instructores.index'),
                icon: Users,
                active: isActiveRoute('admin.instructores'),
                show: true
            },
            {
                name: 'Historial',
                href: route('admin.historial'),
                icon: History,
                active: isActiveRoute('admin.historial'),
                show: true
            },
            {
                name: 'Reportes',
                href: route('admin.reportes'),
                icon: FileText,
                active: isActiveRoute('admin.reportes'),
                show: true
            },
            {
                name: 'Configuraciones',
                href: route('admin.configuraciones'),
                icon: Settings,
                active: isActiveRoute('admin.configuraciones'),
                show: true
            },
            {
                name: 'Vigilantes',
                href: route('admin.vigilantes.index'),
                icon: Shield,
                active: isActiveRoute('admin.vigilantes'),
                show: true
            },
            {
                name: 'Usuarios',
                href: route('admin.users.index'),
                icon: UserCheck,
                active: isActiveRoute('admin.users'),
                show: true
            }
        ] : [];

        const guardiaItems = user.role === 'guardia' ? [
            {
                name: 'Control de Asistencia',
                href: route('guardia.dashboard'),
                icon: Clock,
                active: isActiveRoute('guardia.dashboard'),
                show: true
            }
        ] : [];

        return [...commonItems, ...adminItems, ...guardiaItems];
    };

    const navigationItems = getNavigationItems();

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <Head title={title} />
            <DynamicColorStyles />
            
            {/* Overlay para móvil */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 h-screen bg-green-700 text-white w-64 flex flex-col shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
                {/* Header del sidebar */}
                <div className="flex flex-col items-center p-6 border-b border-green-600">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-md overflow-hidden">
                        <LogoDisplay 
                            size="sidebar"
                            alt="Logo SENA"
                            className="w-14 h-14"
                        />
                    </div>
                    <h1 className="text-xl font-semibold text-center leading-tight">
                        {systemSettings?.system_name || 'Gestión Instructores SENA'}
                    </h1>
                    <div className="mt-2 text-center">
                        <p className="text-sm text-green-100">{user.name}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            user.role === 'admin' 
                                ? 'bg-red-100 text-red-800' 
                                : user.role === 'guardia'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                            {user.role === 'admin' ? 'Administrador' : user.role === 'guardia' ? 'Guardia' : 'Usuario'}
                        </span>
                    </div>
                </div>
                
                {/* Navegación principal */}
                <nav className="flex flex-col gap-2 flex-1 p-6 overflow-y-auto">
                    {navigationItems.map((item) => {
                        if (!item.show) return null;
                        
                        const Icon = item.icon;
                        return (
                            <Link 
                                key={item.name}
                                href={item.href} 
                                className={`rounded-lg px-4 py-3 transition-all duration-200 hover:shadow-md flex items-center gap-3 text-sm font-medium ${
                                    item.active 
                                        ? 'bg-green-600 font-semibold shadow-md border-l-4 border-white' 
                                        : 'hover:bg-green-600'
                                }`}
                                onClick={() => setSidebarOpen(false)} // Cerrar sidebar en móvil
                            >
                                <Icon size={18} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}

                    {/* Botón Acerca de */}
                    <button
                        onClick={() => {
                            setMostrarAcercaDe(true);
                            setSidebarOpen(false);
                        }}
                        className="rounded-lg px-4 py-3 transition-all duration-200 hover:shadow-md hover:bg-green-600 flex items-center gap-3 text-sm font-medium text-left w-full"
                    >
                        <Info size={18} />
                        <span>Acerca de</span>
                    </button>
                </nav>

                {/* Botón de cerrar sesión */}
                <div className="p-6 border-t border-green-600">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md"
                    >
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col lg:ml-64">
                {/* Header móvil */}
                <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden">
                            <LogoDisplay 
                                size="header"
                                alt="Logo SENA"
                                className="w-7 h-7"
                            />
                        </div>
                        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
                    </div>
                    <div className="w-8 h-8"></div> {/* Spacer */}
                </div>

                {/* Header desktop */}
                <div className="hidden lg:flex bg-white shadow-sm border-b border-gray-200 px-6 py-4 items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden border border-gray-200">
                        <LogoDisplay 
                            size="header"
                            alt="Logo SENA"
                            className="w-9 h-9"
                        />
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-gray-600">{systemSettings?.system_name || 'Gestión Instructores SENA'}</h2>
                        <p className="text-xl font-semibold text-gray-900">{title}</p>
                    </div>
                </div>

                {/* Header de página */}
                {header && (
                    <header className="bg-white shadow-sm border-b border-gray-200">
                        <div className="px-6 py-4">
                            {header}
                        </div>
                    </header>
                )}

                {/* Contenido */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    {children}
                </main>
            </div>

            {/* Modal Acerca de */}
            {mostrarAcercaDe && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header del modal */}
                        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex items-center justify-between sticky top-0">
                            <div className="flex items-center gap-3">
                                <Info size={28} />
                                <h2 className="text-2xl font-bold">Acerca de</h2>
                            </div>
                            <button
                                onClick={() => setMostrarAcercaDe(false)}
                                className="p-2 hover:bg-green-600 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Contenido del modal */}
                        <div className="p-8 space-y-8">
                            {/* Información del Sistema */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-green-600 rounded"></div>
                                    Sistema
                                </h3>
                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                                    <p className="font-semibold text-gray-900 mb-2">{liderEstructura.descripcion}</p>
                                </div>
                            </div>

                            {/* Instructora Líder */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-purple-600 rounded"></div>
                                    Instructora Líder
                                </h3>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-2 border-purple-300 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                            <Users size={32} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">{liderEstructura.nombre}</p>
                                            <p className="text-sm text-purple-700 font-semibold mt-1">{liderEstructura.cargo}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Equipo de Desarrollo */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-blue-600 rounded"></div>
                                    Equipo de Desarrollo
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {desarrolladores.map((dev, index) => (
                                        <div 
                                            key={index}
                                            className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-300 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 text-sm">{dev.nombre}</p>
                                                    <p className="text-xs text-blue-700 font-medium">{dev.rol}</p>
                                                    <div className="mt-2 space-y-1 text-xs">
                                                        <p className="text-gray-700">
                                                            <span className="font-semibold">Cédula:</span> {dev.cedula}
                                                        </p>
                                                        <p className="text-gray-700">
                                                            <span className="font-semibold">Correo:</span> <br />
                                                            <span className="text-blue-600 break-all">{dev.correo}</span>
                                                        </p>
                                                        <p className="text-gray-700">
                                                            <span className="font-semibold">Celular:</span> {dev.celular}
                                                        </p>
                                                        <p className="text-gray-700">
                                                            <span className="font-semibold">Formación:</span> {dev.formacion}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Información técnica */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-orange-600 rounded"></div>
                                    Tecnología
                                </h3>
                                <div className="bg-orange-50 p-5 rounded-lg border border-orange-200">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-3 rounded border border-orange-200">
                                            <p className="font-semibold text-gray-800 text-sm mb-1">Backend</p>
                                            <p className="text-gray-700 text-sm">Laravel 12</p>
                                        </div>
                                        <div className="bg-white p-3 rounded border border-orange-200">
                                            <p className="font-semibold text-gray-800 text-sm mb-1">Frontend</p>
                                            <p className="text-gray-700 text-sm">React + Inertia.js</p>
                                        </div>
                                        <div className="bg-white p-3 rounded border border-orange-200">
                                            <p className="font-semibold text-gray-800 text-sm mb-1">Base de Datos</p>
                                            <p className="text-gray-700 text-sm">SQLite</p>
                                        </div>
                                        <div className="bg-white p-3 rounded border border-orange-200">
                                            <p className="font-semibold text-gray-800 text-sm mb-1">Estilos</p>
                                            <p className="text-gray-700 text-sm">Tailwind CSS</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer del modal */}
                            <div className="border-t border-gray-200 pt-4 text-center">
                                <p className="text-xs text-gray-600">
                                    © 2025 Sistema de Gestión de Asistencia SENA | Versión 1.0
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}