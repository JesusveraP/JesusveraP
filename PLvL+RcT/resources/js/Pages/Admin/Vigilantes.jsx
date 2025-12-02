import { useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { Users, Clock, MapPin, Plus, Search, Filter, Eye, Edit, Trash2, Shield, CheckCircle } from 'lucide-react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import ThemeButton from '@/Components/ThemeButton';

export default function Vigilantes({ vigilantes = [], estadisticas = {} }) {
    const [filtros, setFiltros] = useState({
        buscar: '',
        ubicacion: '',
        turno: ''
    });

    const [selectedVigilante, setSelectedVigilante] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Manejo defensivo de estadísticas
    const stats = {
        total_vigilantes: estadisticas?.total_vigilantes || 0,
        vigilantes_activos: estadisticas?.vigilantes_activos || 0,
        turnos_cubiertos: estadisticas?.turnos_cubiertos || 0,
        ubicaciones_asignadas: estadisticas?.ubicaciones_asignadas || 0
    };

    // Filtrar vigilantes - manejo defensivo
    const vigilantesFiltrados = (vigilantes || []).filter(vigilante => {
        if (!vigilante) return false;
        
        const cumpleBusqueda = !filtros.buscar || 
            (vigilante.nombre || '').toLowerCase().includes(filtros.buscar.toLowerCase()) ||
            (vigilante.email || '').toLowerCase().includes(filtros.buscar.toLowerCase()) ||
            (vigilante.cedula || '').toLowerCase().includes(filtros.buscar.toLowerCase());

        const cumpleUbicacion = !filtros.ubicacion || 
            (vigilante.ubicacion_asignada || '').toLowerCase().includes(filtros.ubicacion.toLowerCase());

        return cumpleBusqueda && cumpleUbicacion;
    });

    // Función para ver detalles
    const handleVer = (vigilante) => {
        setSelectedVigilante(vigilante);
        setShowModal(true);
    };

    // Función para editar
    const handleEditar = (vigilante) => {
        router.get(route('admin.vigilantes.edit', vigilante.id));
    };

    // Función para eliminar
    const handleEliminar = (vigilante) => {
        setDeleteConfirm(vigilante);
    };

    // Confirmar eliminación
    const confirmDelete = () => {
        if (deleteConfirm) {
            router.delete(route('admin.vigilantes.destroy', deleteConfirm.id), {
                onSuccess: () => {
                    setDeleteConfirm(null);
                },
            });
        }
    };

    return (
        <SidebarLayout
            title="Gestión de Vigilantes - SENA"
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Gestión de Vigilantes</h1>
                        <p className="text-gray-600 mt-1">Administra el personal de vigilancia y seguridad</p>
                    </div>
                    <ThemeButton variant="primary" size="base" className="flex items-center gap-2">
                        <Link href={route('admin.vigilantes.create')} className="flex items-center gap-2">
                            <Plus size={20} />
                            Nuevo Vigilante
                        </Link>
                    </ThemeButton>
                </div>
            }
        >
            <div className="p-8">
                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Vigilantes</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_vigilantes}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Vigilantes Activos</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.vigilantes_activos}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Turnos Cubiertos</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.turnos_cubiertos}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Ubicaciones Asignadas</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.ubicaciones_asignadas}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, email o cédula..."
                                value={filtros.buscar}
                                onChange={(e) => setFiltros({...filtros, buscar: e.target.value})}
                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={filtros.ubicacion}
                                onChange={(e) => setFiltros({...filtros, ubicacion: e.target.value})}
                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">Todas las ubicaciones</option>
                                <option value="puerta principal">Puerta Principal</option>
                                <option value="puerta secundaria">Puerta Secundaria</option>
                                <option value="cafetería">Cafetería</option>
                                <option value="parqueadero">Parqueadero</option>
                            </select>
                        </div>
                        
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={filtros.turno}
                                onChange={(e) => setFiltros({...filtros, turno: e.target.value})}
                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">Todos los turnos</option>
                                <option value="mañana">Mañana (06:00 - 14:00)</option>
                                <option value="tarde">Tarde (14:00 - 22:00)</option>
                                <option value="noche">Noche (22:00 - 06:00)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tabla de vigilantes */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Lista de Vigilantes ({vigilantesFiltrados.length})
                        </h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        {vigilantesFiltrados.length > 0 ? (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Vigilante
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contacto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cédula
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ubicación Asignada
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Turno
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {vigilantesFiltrados.map((vigilante) => (
                                        <tr key={vigilante.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                        <Shield className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {vigilante.nombre}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Desde: {vigilante.fecha_creacion}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{vigilante.email}</div>
                                                <div className="text-sm text-gray-500">{vigilante.telefono}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {vigilante.cedula}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-900">
                                                        {vigilante.ubicacion_asignada}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-900">
                                                        {vigilante.hora_inicio_turno} - {vigilante.hora_fin_turno}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    {vigilante.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleVer(vigilante)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditar(vigilante)}
                                                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded-md hover:bg-yellow-50"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(vigilante)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-12">
                                <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-sm font-medium text-gray-900 mb-2">
                                    {filtros.buscar || filtros.ubicacion || filtros.turno 
                                        ? 'No se encontraron vigilantes con los filtros aplicados' 
                                        : 'No hay vigilantes registrados'
                                    }
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    {filtros.buscar || filtros.ubicacion || filtros.turno 
                                        ? 'Intenta ajustar los filtros de búsqueda'
                                        : 'Comienza agregando el primer vigilante al sistema'
                                    }
                                </p>
                                {(!filtros.buscar && !filtros.ubicacion && !filtros.turno) && (
                                    <ThemeButton variant="primary">
                                        <Link href={route('admin.vigilantes.create')} className="flex items-center gap-2">
                                            <Plus className="w-4 h-4" />
                                            Agregar Vigilante
                                        </Link>
                                    </ThemeButton>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal para ver detalles */}
            {showModal && selectedVigilante && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Detalles del Vigilante</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="px-6 py-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedVigilante.nombre}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cédula</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedVigilante.cedula}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedVigilante.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedVigilante.telefono}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ubicación Asignada</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedVigilante.ubicacion_asignada}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Turno</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedVigilante.hora_inicio_turno} - {selectedVigilante.hora_fin_turno}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                                    <p className="mt-1">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            {selectedVigilante.estado}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Desde</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedVigilante.fecha_creacion}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <ThemeButton variant="secondary" onClick={() => setShowModal(false)}>
                                Cerrar
                            </ThemeButton>
                            <ThemeButton
                                variant="warning"
                                onClick={() => {
                                    setShowModal(false);
                                    handleEditar(selectedVigilante);
                                }}
                            >
                                Editar
                            </ThemeButton>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación de eliminación */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Confirmar Eliminación</h2>
                        </div>
                        
                        <div className="px-6 py-4">
                            <p className="text-sm text-gray-700">
                                ¿Estás seguro de que deseas eliminar a <strong>{deleteConfirm.nombre}</strong>?
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Esta acción no se puede deshacer.
                            </p>
                        </div>
                        
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <ThemeButton variant="secondary" onClick={() => setDeleteConfirm(null)}>
                                Cancelar
                            </ThemeButton>
                            <ThemeButton variant="danger" onClick={confirmDelete}>
                                Eliminar
                            </ThemeButton>
                        </div>
                    </div>
                </div>
            )}
        </SidebarLayout>
    );
}