import { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Calendar, Clock, Filter, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function Historial({ instructores = [], historialData = [], estadisticas = {}, filtros = {} }) {
    const { systemSettings } = usePage().props;

    // Estado local para los filtros, inicializado con los filtros del servidor
    const [filtrosLocal, setFiltrosLocal] = useState({
        fecha: filtros.fecha || '',
        filter_hora: filtros.filter_hora || '',
        filter_instructor: filtros.filter_instructor || '',
        filter_asistencia: filtros.filter_asistencia || ''
    });

    // Estado para controlar si se muestran los filtros
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    // Estado para paginación local
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const aplicarFiltros = (nuevosFiltros) => {
        const parametros = Object.keys(nuevosFiltros).reduce((acc, key) => {
            if (nuevosFiltros[key] !== '') {
                acc[key] = nuevosFiltros[key];
            }
            return acc;
        }, {});

        router.get(route('guardia.historial'), parametros, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const limpiarFiltros = () => {
        setFiltrosLocal({
            fecha: '',
            filter_hora: '',
            filter_instructor: '',
            filter_asistencia: ''
        });
        router.get(route('guardia.historial'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Usar estadísticas dinámicas o valores por defecto
    const estadisticasDefault = {
        totalRegistrosHoy: estadisticas.totalRegistrosHoy || 0,
        llegadasPuntuales: estadisticas.llegadasPuntuales || 0,
        llegadasTarde: estadisticas.llegadasTarde || 0,
        ausencias: estadisticas.ausencias || 0
    };

    // Datos de ejemplo para mostrar si no hay datos reales
    const datosEjemplo = [
        {
            id: 1,
            instructor: 'María García',
            area: 'Sistemas',
            fecha: '11/11/2024',
            horaEntrada: '07:00',
            horaSalida: '15:00',
            estado: 'Puntual'
        },
        {
            id: 2,
            instructor: 'Juan Pérez',
            area: 'Matemáticas',
            fecha: '11/11/2024',
            horaEntrada: '07:30',
            horaSalida: '15:30',
            estado: 'Tarde'
        },
        {
            id: 3,
            instructor: 'Ana López',
            area: 'Inglés',
            fecha: '11/11/2024',
            horaEntrada: '07:15',
            horaSalida: '15:15',
            estado: 'Puntual'
        }
    ];

    // Usar datos reales si están disponibles, sino usar datos de ejemplo
    const datosParaMostrar = (historialData.data && historialData.data.length > 0) 
        ? historialData.data 
        : (historialData.length > 0) 
            ? historialData 
            : datosEjemplo;

    // Lógica de paginación
    const totalItems = datosParaMostrar.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = datosParaMostrar.slice(startIndex, endIndex);

    const goToPage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const aplicarFiltrosConReset = (nuevosFiltros) => {
        setCurrentPage(1);
        aplicarFiltros(nuevosFiltros);
    };

    const limpiarFiltrosConReset = () => {
        setCurrentPage(1);
        limpiarFiltros();
    };

    return (
        <SidebarLayout
            title="Historial de Asistencias - SENA"
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Historial de Entrada y Salida</h2>
                        <p className="text-gray-600">Consulte el historial completo de asistencias de instructores</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Filter size={16} />
                            {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                        </button>
                        <button
                            onClick={() => aplicarFiltrosConReset(filtrosLocal)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Search size={16} />
                            Buscar
                        </button>
                    </div>
                </div>
            }
        >
            <div className="p-8">
                {/* Panel de filtros */}
                {mostrarFiltros && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Search className="text-green-600" size={20} />
                                <h3 className="text-lg font-semibold text-gray-800">Filtros de Búsqueda</h3>
                            </div>
                            {(filtrosLocal.fecha || filtrosLocal.filter_hora || filtrosLocal.filter_instructor || filtrosLocal.filter_asistencia) && (
                                <button
                                    onClick={limpiarFiltros}
                                    className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors"
                                >
                                    <X size={14} />
                                    Limpiar Filtros
                                </button>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    📅 Fecha
                                </label>
                                <input
                                    type="date"
                                    value={filtrosLocal.fecha}
                                    onChange={(e) => setFiltrosLocal({...filtrosLocal, fecha: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    🕐 Hora
                                </label>
                                <select
                                    value={filtrosLocal.filter_hora}
                                    onChange={(e) => setFiltrosLocal({...filtrosLocal, filter_hora: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                >
                                    <option value="">Todas las horas</option>
                                    <option value="manana">🌅 Mañana (06:00 - 12:00)</option>
                                    <option value="tarde">☀️ Tarde (12:01 - 18:00)</option>
                                    <option value="noche">🌙 Noche (18:01 - 23:59)</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    👨‍🏫 Instructor
                                </label>
                                <select
                                    value={filtrosLocal.filter_instructor}
                                    onChange={(e) => setFiltrosLocal({...filtrosLocal, filter_instructor: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                >
                                    <option value="">Todos los instructores</option>
                                    {instructores.map((instructor) => (
                                        <option key={instructor.id} value={instructor.id}>
                                            {`${instructor.nombres} ${instructor.apellidos}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    📊 Tipo de Registro
                                </label>
                                <select
                                    value={filtrosLocal.filter_asistencia}
                                    onChange={(e) => setFiltrosLocal({...filtrosLocal, filter_asistencia: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                >
                                    <option value="">Todos los registros</option>
                                    <option value="puntual">✅ Puntual</option>
                                    <option value="tarde">⏰ Llegada Tarde</option>
                                    <option value="salida">🚪 Salida</option>
                                </select>
                            </div>
                        </div>

                        {/* Indicadores de filtros activos */}
                        {(filtrosLocal.fecha || filtrosLocal.filter_hora || filtrosLocal.filter_instructor || filtrosLocal.filter_asistencia) && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-sm font-medium text-gray-600">Filtros activos:</span>
                                    {filtrosLocal.fecha && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            📅 {filtrosLocal.fecha}
                                        </span>
                                    )}
                                    {filtrosLocal.filter_hora && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            🕐 {filtrosLocal.filter_hora}
                                        </span>
                                    )}
                                    {filtrosLocal.filter_instructor && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            👨‍🏫 {filtrosLocal.filter_instructor}
                                        </span>
                                    )}
                                    {filtrosLocal.filter_asistencia && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            📊 {
                                                filtrosLocal.filter_asistencia === 'puntual' ? 'Puntual' :
                                                filtrosLocal.filter_asistencia === 'tarde' ? 'Llegada Tarde' :
                                                filtrosLocal.filter_asistencia === 'salida' ? 'Salida' : filtrosLocal.filter_asistencia
                                            }
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Registros</p>
                                <p className="text-2xl font-bold text-green-600">{estadisticasDefault.totalRegistrosHoy}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {filtrosLocal.fecha ? `Fecha: ${filtrosLocal.fecha}` : 'Hoy'}
                                </p>
                            </div>
                            <Calendar className="text-green-500" size={24} />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Llegadas Puntuales</p>
                                <p className="text-2xl font-bold text-blue-600">{estadisticasDefault.llegadasPuntuales}</p>
                                <p className="text-xs text-gray-500 mt-1">Antes de 07:15</p>
                            </div>
                            <Clock className="text-blue-500" size={24} />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Llegadas Tarde</p>
                                <p className="text-2xl font-bold text-yellow-600">{estadisticasDefault.llegadasTarde}</p>
                                <p className="text-xs text-gray-500 mt-1">Después de 07:15</p>
                            </div>
                            <Clock className="text-yellow-500" size={24} />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Ausencias</p>
                                <p className="text-2xl font-bold text-red-600">{estadisticasDefault.ausencias}</p>
                                <p className="text-xs text-gray-500 mt-1">Sin registro</p>
                            </div>
                            <Calendar className="text-red-500" size={24} />
                        </div>
                    </div>
                </div>

                {/* Tabla de historial */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Historial de Asistencias 
                                {filtrosLocal.fecha && ` - ${filtrosLocal.fecha}`}
                            </h3>
                            <div className="text-sm text-gray-500">
                                {currentItems.length} registros
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Instructor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Área
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hora Entrada
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hora Salida
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.map((registro, index) => (
                                    <tr key={registro.id || index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {registro.instructor}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {registro.area}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {registro.fecha}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {registro.horaEntrada}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {registro.horaSalida}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                registro.estado === 'Puntual' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : registro.estado === 'Tarde'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : registro.estado === 'Ausente'
                                                    ? 'bg-red-100 text-red-800'
                                                    : registro.estado === 'Salida'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {registro.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                    currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToPage(index + 1)}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                        currentPage === index + 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                    currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 mr-2">Registros por página:</label>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}