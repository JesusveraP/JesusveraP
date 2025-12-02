import { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { FileText, Download, Calendar, Clock, Users, TrendingUp, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function Reportes({ instructores = [], reportesData = [], estadisticas = {}, filtros = {}, areas = [], pagination = {} }) {
    const { systemSettings } = usePage().props;

    // Estado para filtros locales, inicializados con los del servidor
    const [filtrosLocal, setFiltrosLocal] = useState({
        fechaInicio: filtros.fechaInicio || '',
        fechaFin: filtros.fechaFin || '',
        instructor: filtros.instructor || '',
        area: filtros.area || ''
    });

    // Usar estadísticas reales del backend
    const estadisticasReales = {
        totalInstructores: estadisticas.totalInstructores || 0,
        presentesHoy: estadisticas.presentesHoy || 0,
        ausentesHoy: estadisticas.ausentesHoy || 0,
        tardesHoy: estadisticas.tardesHoy || 0,
        promedioAsistencia: estadisticas.promedioAsistencia || '0%'
    };

    const exportarReporte = () => {
        // Construir parámetros para la exportación
        const parametros = Object.keys(filtrosLocal).reduce((acc, key) => {
            if (filtrosLocal[key] !== '') {
                acc[key] = filtrosLocal[key];
            }
            return acc;
        }, {});

        // Crear URL para exportar
        const url = route('admin.reportes.exportar') + '?' + new URLSearchParams(parametros).toString();
        
        // Abrir en nueva ventana para descargar
        window.open(url, '_blank');
    };

    const aplicarFiltros = () => {
        // Validar fechas
        if (filtrosLocal.fechaInicio && filtrosLocal.fechaFin) {
            const fechaInicio = new Date(filtrosLocal.fechaInicio);
            const fechaFin = new Date(filtrosLocal.fechaFin);
            
            if (fechaInicio > fechaFin) {
                alert('La fecha de inicio no puede ser mayor que la fecha de fin');
                return;
            }
        }

        // Construir parámetros solo con valores no vacíos
        const parametros = {};
        
        if (filtrosLocal.fechaInicio && filtrosLocal.fechaInicio.trim() !== '') {
            parametros.fechaInicio = filtrosLocal.fechaInicio;
        }
        
        if (filtrosLocal.fechaFin && filtrosLocal.fechaFin.trim() !== '') {
            parametros.fechaFin = filtrosLocal.fechaFin;
        }
        
        if (filtrosLocal.instructor && filtrosLocal.instructor.toString().trim() !== '') {
            parametros.instructor = filtrosLocal.instructor;
        }
        
        if (filtrosLocal.area && filtrosLocal.area.trim() !== '') {
            parametros.area = filtrosLocal.area;
        }

        // Realizar la petición
        router.get(route('admin.reportes'), parametros, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const limpiarFiltros = () => {
        const filtrosVacios = {
            fechaInicio: '',
            fechaFin: '',
            instructor: '',
            area: ''
        };
        
        setFiltrosLocal(filtrosVacios);
        
        router.get(route('admin.reportes'), {}, {
            preserveState: false,
            preserveScroll: true,
        });
    };

    useEffect(() => {
        setFiltrosLocal({
            fechaInicio: filtros.fechaInicio || '',
            fechaFin: filtros.fechaFin || '',
            instructor: filtros.instructor || '',
            area: filtros.area || ''
        });
    }, [filtros]);

    const goToPage = (page) => {
        const parametros = Object.keys(filtrosLocal).reduce((acc, key) => {
            if (filtrosLocal[key] !== '') {
                acc[key] = filtrosLocal[key];
            }
            return acc;
        }, {});
        
        parametros.page = page;
        
        router.get(route('admin.reportes'), parametros, {
            preserveState: true,
            preserveScroll: false,
        });
    };

    const goToPreviousPage = () => {
        if (pagination.current_page > 1) {
            goToPage(pagination.current_page - 1);
        }
    };

    const goToNextPage = () => {
        if (pagination.current_page < pagination.last_page) {
            goToPage(pagination.current_page + 1);
        }
    };

    return (
        <SidebarLayout
            title="Reportes - SENA"
            header={
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Reportes de Asistencia</h2>
                    <p className="text-gray-600">Genere y visualice reportes detallados de asistencia de instructores</p>
                </div>
            }
        >
            <div className="p-8">
                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-5 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Instructores</p>
                                <p className="text-2xl font-bold text-green-600">{estadisticasReales.totalInstructores}</p>
                            </div>
                            <Users className="text-green-500" size={24} />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Presentes</p>
                                <p className="text-2xl font-bold text-blue-600">{estadisticasReales.presentesHoy}</p>
                            </div>
                            <Clock className="text-blue-500" size={24} />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Ausentes</p>
                                <p className="text-2xl font-bold text-red-600">{estadisticasReales.ausentesHoy}</p>
                            </div>
                            <Calendar className="text-red-500" size={24} />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Llegadas Tarde</p>
                                <p className="text-2xl font-bold text-yellow-600">{estadisticasReales.tardesHoy}</p>
                            </div>
                            <Clock className="text-yellow-500" size={24} />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Promedio Asistencia</p>
                                <p className="text-2xl font-bold text-purple-600">{estadisticasReales.promedioAsistencia}</p>
                            </div>
                            <TrendingUp className="text-purple-500" size={24} />
                        </div>
                    </div>
                </div>

                {/* Panel de filtros */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtros de Reporte</h3>
                    
                    <div className="grid grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha Inicio
                            </label>
                            <input
                                type="date"
                                value={filtrosLocal.fechaInicio}
                                onChange={(e) => setFiltrosLocal({...filtrosLocal, fechaInicio: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha Fin
                            </label>
                            <input
                                type="date"
                                value={filtrosLocal.fechaFin}
                                onChange={(e) => setFiltrosLocal({...filtrosLocal, fechaFin: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Instructor
                            </label>
                            <select
                                value={filtrosLocal.instructor}
                                onChange={(e) => setFiltrosLocal({...filtrosLocal, instructor: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">Todos los instructores</option>
                                {instructores.map((instructor) => (
                                    <option key={instructor.id} value={instructor.id}>
                                        {instructor.nombres} {instructor.apellidos}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Área
                            </label>
                            <select
                                value={filtrosLocal.area}
                                onChange={(e) => setFiltrosLocal({...filtrosLocal, area: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">Todas las áreas</option>
                                {areas.map((area, index) => (
                                    <option key={index} value={area}>
                                        {area}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                onClick={aplicarFiltros}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                <Filter size={16} />
                                Filtrar
                            </button>
                            <button
                                onClick={limpiarFiltros}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                Limpiar
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                            onClick={exportarReporte}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Download size={16} />
                            Exportar Reporte
                        </button>
                    </div>
                </div>

                {/* Tabla de reportes */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Reporte de Asistencia
                                {estadisticas.periodo && (
                                    <span className="text-sm text-gray-600 ml-2">
                                        ({estadisticas.periodo.inicio} - {estadisticas.periodo.fin})
                                    </span>
                                )}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FileText size={16} />
                                <span>{pagination.total || 0} registros encontrados</span>
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
                                        Área/Materia
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
                                        Horas Trabajadas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reportesData.length > 0 ? reportesData.map((reporte, index) => (
                                    <tr key={reporte.id || index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {reporte.instructor}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {reporte.area}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {reporte.fecha}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {reporte.horaEntrada}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {reporte.horaSalida}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {reporte.horasTrabajadas}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                reporte.estado === 'Completo' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : reporte.estado === 'Tarde' || reporte.estado.includes('Tarde')
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : reporte.estado.includes('Sin salida')
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {reporte.estado}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            No hay datos de reportes disponibles para los filtros seleccionados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginador */}
                    {pagination.last_page > 1 && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Mostrando <span className="font-medium">{pagination.from || 1}</span> - <span className="font-medium">{pagination.to || 0}</span> de{' '}
                                    <span className="font-medium">{pagination.total || 0}</span> registros
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={goToPreviousPage}
                                        disabled={pagination.current_page === 1}
                                        className={`flex items-center px-3 py-2 text-sm border rounded-md transition-colors ${
                                            pagination.current_page === 1
                                                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Anterior
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((pageNumber) => {
                                            if (
                                                pageNumber === 1 ||
                                                pageNumber === pagination.last_page ||
                                                (pageNumber >= pagination.current_page - 1 && pageNumber <= pagination.current_page + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        onClick={() => goToPage(pageNumber)}
                                                        className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                                                            pagination.current_page === pageNumber
                                                                ? 'bg-green-600 text-white border-green-600'
                                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            } else if (
                                                pageNumber === pagination.current_page - 2 ||
                                                pageNumber === pagination.current_page + 2
                                            ) {
                                                return (
                                                    <span key={pageNumber} className="px-2 py-2 text-sm text-gray-500">
                                                        ...
                                                    </span>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button
                                        onClick={goToNextPage}
                                        disabled={pagination.current_page === pagination.last_page}
                                        className={`flex items-center px-3 py-2 text-sm border rounded-md transition-colors ${
                                            pagination.current_page === pagination.last_page
                                                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        Siguiente
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}