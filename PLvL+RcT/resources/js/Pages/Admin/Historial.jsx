import { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Calendar, Clock, Filter, Search, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import ThemeButton from '@/Components/ThemeButton';

export default function Historial({ instructores = [], historialData = [], estadisticas = {}, filtros = {} }) {
    const { systemSettings } = usePage().props;

    // Estado local para los filtros, inicializado con los filtros del servidor
    const [filtrosLocal, setFiltrosLocal] = useState({
        fecha: filtros.fecha || '',
        instructor: filtros.instructor || '',
        tipo: filtros.tipo || ''
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

        router.get(route('admin.historial'), parametros, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const limpiarFiltros = () => {
        setFiltrosLocal({
            fecha: '',
            instructor: '',
            tipo: ''
        });
        router.get(route('admin.historial'), {}, {
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
                        <ThemeButton
                            variant="primary"
                            size="base"
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                            className="flex items-center gap-2"
                        >
                            <Filter size={16} />
                            {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                        </ThemeButton>
                        <ThemeButton
                            variant="info"
                            size="base"
                            onClick={() => aplicarFiltrosConReset(filtrosLocal)}
                            className="flex items-center gap-2"
                        >
                            <Search size={16} />
                            Buscar
                        </ThemeButton>
                    </div>
                </div>
            }
        >
            <div className="p-8">
                {/* Panel de filtros - Mostrar/Ocultar */}
                {mostrarFiltros && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Search className="text-green-600" size={20} />
                                <h3 className="text-lg font-semibold text-gray-800">Filtros de Búsqueda</h3>
                            </div>
                            {(filtrosLocal.fecha || filtrosLocal.instructor || filtrosLocal.tipo) && (
                                <ThemeButton
                                    variant="danger"
                                    size="sm"
                                    onClick={limpiarFiltros}
                                    className="flex items-center gap-1"
                                >
                                    <X size={14} />
                                    Limpiar Filtros
                                </ThemeButton>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                    👨‍🏫 Instructor
                                </label>
                                <select
                                    value={filtrosLocal.instructor}
                                    onChange={(e) => setFiltrosLocal({...filtrosLocal, instructor: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                >
                                    <option value="">Todos los instructores</option>
                                    {instructores.map((instructor) => (
                                        <option key={instructor.id} value={instructor.nombre}>
                                            {instructor.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    📊 Tipo de Registro
                                </label>
                                <select
                                    value={filtrosLocal.tipo}
                                    onChange={(e) => setFiltrosLocal({...filtrosLocal, tipo: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                >
                                    <option value="">Todos los registros</option>
                                    <option value="completo">✅ Día Completo</option>
                                    <option value="tarde">⏰ Llegada Tarde</option>
                                    <option value="ausente">❌ Ausentes</option>
                                </select>
                            </div>
                        </div>

                        {/* Indicadores de filtros activos */}
                        {(filtrosLocal.fecha || filtrosLocal.instructor || filtrosLocal.tipo) && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-sm font-medium text-gray-600">Filtros activos:</span>
                                    {filtrosLocal.fecha && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            📅 {filtrosLocal.fecha}
                                        </span>
                                    )}
                                    {filtrosLocal.instructor && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            👨‍🏫 {filtrosLocal.instructor}
                                        </span>
                                    )}
                                    {filtrosLocal.tipo && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            📊 {
                                                filtrosLocal.tipo === 'completo' ? 'Día Completo' :
                                                filtrosLocal.tipo === 'tarde' ? 'Llegada Tarde' :
                                                filtrosLocal.tipo === 'ausente' ? 'Ausentes' : filtrosLocal.tipo
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
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <ThemeButton
                                variant="secondary"
                                size="sm"
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className="flex items-center"
                            >
                                <ChevronLeft size={16} />
                            </ThemeButton>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <ThemeButton
                                    key={index}
                                    onClick={() => goToPage(index + 1)}
                                    variant={currentPage === index + 1 ? "primary" : "secondary"}
                                    size="sm"
                                >
                                    {index + 1}
                                </ThemeButton>
                            ))}
                            <ThemeButton
                                variant="secondary"
                                size="sm"
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="flex items-center"
                            >
                                <ChevronRight size={16} />
                            </ThemeButton>
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