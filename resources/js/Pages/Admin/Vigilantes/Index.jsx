import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Calendar, User, MapPin, Clock, ArrowLeft, RotateCcw, Trash2, LogOut } from 'lucide-react';
import LogoDisplay from '../../../Components/LogoDisplay';

export default function Index() {
    const { registros = [], filtros = {}, systemSettings, ziggy } = usePage().props;
    
    // Obtener la ruta actual para destacar la navegación activa
    const currentRoute = ziggy?.location || window.location.pathname || '/admin/vigilantes';
    
    // Función para determinar si una ruta está activa
    const isActiveRoute = (routeName) => {
        if (routeName === 'admin.dashboard') {
            return currentRoute.endsWith('/admin/dashboard');
        }
        return currentRoute.includes(routeName.replace('admin.', '/'));
    };

    const [search, setSearch] = useState(filtros?.search || '');
    const [fechaFilter, setFechaFilter] = useState(filtros?.fecha || '');
    const [numeroFilter, setNumeroFilter] = useState(filtros?.numero || '');

    const applyFilters = () => {
        router.get(route('admin.vigilantes.index'), {
            preserveState: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setFechaFilter('');
        setNumeroFilter('');
        router.get(route('admin.vigilantes.index'));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    return (
        <div className="flex min-h-screen">
            <Head title="Registro de Vigilancia - SENA" />
            
            {/* Sidebar */}
            <aside className="bg-green-700 text-white w-64 flex flex-col p-6">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3">
                        <LogoDisplay 
                            size="sidebar"
                            alt="Logo SENA"
                        />
                    </div>
                    <h1 className="text-xl font-semibold text-center">{systemSettings?.system_name || 'Gestión Instructores SENA'}</h1>
                </div>
                <nav className="flex flex-col gap-3 text-base">
                    <Link 
                        href={route('admin.dashboard')} 
                        className={`rounded-lg px-3 py-2 transition-colors ${
                            isActiveRoute('admin.dashboard') 
                                ? 'bg-green-600 font-semibold' 
                                : 'hover:bg-green-600'
                        }`}
                    >
                        📊 P. Principal
                    </Link>
                    <Link 
                        href={route('admin.instructores.index')} 
                        className={`rounded-lg px-3 py-2 transition-colors ${
                            isActiveRoute('admin.instructores.index') 
                                ? 'bg-green-600 font-semibold' 
                                : 'hover:bg-green-600'
                        }`}
                    >
                        👥 Instructores
                    </Link>
                    <Link 
                        href={route('admin.historial')} 
                        className={`rounded-lg px-3 py-2 transition-colors ${
                            isActiveRoute('admin.historial') 
                                ? 'bg-green-600 font-semibold' 
                                : 'hover:bg-green-600'
                        }`}
                    >
                        📋 Historial Entrada/Salida
                    </Link>
                    <Link 
                        href={route('admin.reportes')} 
                        className={`rounded-lg px-3 py-2 transition-colors ${
                            isActiveRoute('admin.reportes') 
                                ? 'bg-green-600 font-semibold' 
                                : 'hover:bg-green-600'
                        }`}
                    >
                        📈 Reportes
                    </Link>
                    <Link 
                        href={route('admin.configuraciones')} 
                        className={`rounded-lg px-3 py-2 transition-colors ${
                            isActiveRoute('admin.configuraciones') 
                                ? 'bg-green-600 font-semibold' 
                                : 'hover:bg-green-600'
                        }`}
                    >
                        ⚙️ Configuraciones
                    </Link>
                    <Link 
                        href={route('admin.vigilantes.index')} 
                        className={`rounded-lg px-3 py-2 transition-colors ${
                            isActiveRoute('admin.vigilantes.index') 
                                ? 'bg-green-600 font-semibold' 
                                : 'hover:bg-green-600'
                        }`}
                    >
                        🔐 Registro de vigilantes
                    </Link>
                </nav>

                {/* Botón de cerrar sesión */}
                <div className="mt-auto pt-6">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <LogOut size={16} />
                        Cerrar Sesión
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm px-8 py-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Registro de Vigilancia</h1>
                            <p className="text-gray-600 mt-1">Consulte el registro completo de entradas y salidas de vigilancia</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('admin.vigilantes.create')}
                                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                Nuevo Vigilante
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="p-8">
                    {/* Panel de búsqueda y filtros */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Search className="text-green-600" size={20} />
                                <h3 className="text-lg font-semibold text-gray-800">Filtros de Búsqueda</h3>
                            </div>
                            {(search || fechaFilter || numeroFilter) && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors"
                                >
                                    <RotateCcw size={14} />
                                    Limpiar Filtros
                                </button>
                            )}
                        </div>
                        
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    🔍 Búsqueda General
                                </label>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o numero"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-1">Buscar por nombre de vigilante o número</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    📅 Filtrar por Fecha
                                </label>
                                <select
                                    value={fechaFilter}
                                    onChange={(e) => setFechaFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                >
                                    <option value="">Todas las fechas</option>
                                    <option value="hoy">Hoy</option>
                                    <option value="ayer">Ayer</option>
                                    <option value="esta_semana">Esta semana</option>
                                    <option value="este_mes">Este mes</option>
                                    <option value="mes_pasado">Mes pasado</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Filtrar registros por período</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    🔢 Número de Vigilante
                                </label>
                                <input
                                    type="text"
                                    placeholder="Número de vigilante"
                                    value={numeroFilter}
                                    onChange={(e) => setNumeroFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-1">Filtrar por número específico</p>
                            </div>

                            <div className="flex items-end gap-2">
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex-1 transition-colors"
                                >
                                    Buscar
                                </button>
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Limpiar
                                </button>
                            </div>
                        </form>

                        {/* Indicadores de filtros activos */}
                        {(search || fechaFilter || numeroFilter) && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-sm font-medium text-gray-600">Filtros activos:</span>
                                    {search && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            🔍 {search}
                                        </span>
                                    )}
                                    {fechaFilter && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            📅 {fechaFilter}
                                        </span>
                                    )}
                                    {numeroFilter && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            🔢 {numeroFilter}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tabla de registros */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Registro de Vigilancia
                                    {fechaFilter && ` - ${fechaFilter}`}
                                </h3>
                                <div className="text-sm text-gray-500">
                                    {registros.length > 0 ? registros.length : 5} registros
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-green-600 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Vigilante
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Hora Entrada
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Hora Salida
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Número
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Puerta
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Valeria Peña
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            01/04/2024
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            06:00
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            12:00
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            1
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            Puerta superior
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Carlos Mendez
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            01/04/2024
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            14:00
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            22:00
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            2
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            Puerta principal
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Ana Rodriguez
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            02/04/2024
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            22:00
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            06:00
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            3
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            Puerta lateral
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Miguel Torres
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            02/04/2024
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            06:30
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            14:30
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            4
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            Puerta secundaria
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Sofia López
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            03/04/2024
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            15:00
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            23:00
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            5
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            Entrada cafetería
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}