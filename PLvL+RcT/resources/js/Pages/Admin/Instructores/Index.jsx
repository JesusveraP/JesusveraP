import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function InstructoresIndex({ instructores = { data: [] } }) {
    const { systemSettings, ziggy } = usePage().props;

    const [busqueda, setBusqueda] = useState('');
    const [eliminando, setEliminando] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalEliminacion, setModalEliminacion] = useState({ visible: false, id: null });

    // Usar los datos reales de la base de datos en lugar de datos estáticos
    const instructoresFiltrados = instructores.data.filter(instructor =>
        instructor.nombres?.toLowerCase().includes(busqueda.toLowerCase()) ||
        instructor.apellidos?.toLowerCase().includes(busqueda.toLowerCase()) ||
        instructor.documento_identidad?.includes(busqueda) ||
        instructor.area_asignada?.toLowerCase().includes(busqueda.toLowerCase()) ||
        instructor.email?.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Calcular paginación
    const totalItems = instructoresFiltrados.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = instructoresFiltrados.slice(startIndex, endIndex);

    // Funciones de paginación
    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Resetear página cuando cambie la búsqueda
    useEffect(() => {
        setCurrentPage(1);
    }, [busqueda]);

    // Función para formatear fecha
    const formatearFecha = (fecha) => {
        if (!fecha) return 'N/A';
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Función para eliminar instructor - CON MODAL PERSONALIZADO
    const confirmarEliminacion = (id) => {
        setModalEliminacion({ visible: true, id });
    };

    const procederEliminacion = () => {
        const id = modalEliminacion.id;
        setModalEliminacion({ visible: false, id: null });
        setEliminando(id);
        
        console.log('🔴 Iniciando eliminación del instructor ID:', id);
        
        // Obtener el token CSRF del meta tag
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        console.log('🔐 Token CSRF obtenido:', token ? 'Sí' : 'No');
        
        // Usar fetch con el token CSRF en el header
        fetch(`/admin/instructores/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token || '',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin'
        })
        .then(response => {
            console.log('✅ Response status:', response.status);
            if (response.ok || response.status === 204 || response.status === 200) {
                console.log('✅ Eliminación exitosa');
                setTimeout(() => {
                    console.log('🔄 Recargando la página...');
                    location.reload();
                }, 300);
            } else {
                return response.text().then(text => {
                    throw new Error(`Error ${response.status}: ${text}`);
                });
            }
        })
        .catch(error => {
            console.error('❌ Error en eliminación:', error);
            setEliminando(null);
            alert('Error al eliminar el instructor: ' + error.message);
        });
    };

    const cancelarEliminacion = () => {
        setModalEliminacion({ visible: false, id: null });
    };

    const handleItemsPerPageChange = (newValue) => {
        setItemsPerPage(parseInt(newValue));
        setCurrentPage(1);
    };

    return (
        <SidebarLayout
            title="Instructores - SENA"
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Instructores</h1>
                        <p className="text-gray-600 mt-1">Gestiona el registro de instructores del sistema</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {/* Campo de búsqueda */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o numero"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-80 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        {/* Botón Agregar Instructor */}
                        <Link
                            href="/admin/instructores/create"
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus size={20} />
                            Agregar Instructor
                        </Link>
                    </div>
                </div>
            }
        >
            {/* Contenido principal */}
            <div className="p-8">
                {/* Tabla de instructores */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Encabezados de la tabla */}
                    <div className="hidden lg:block bg-gray-50 border-b border-gray-200">
                        <div className="grid grid-cols-5 gap-4 px-6 py-4 font-medium text-gray-700 text-sm">
                            <div>Nombre Completo</div>
                            <div>Documento</div>
                            <div>Correo</div>
                            <div>Teléfono</div>
                            <div className="text-center">Acciones</div>
                        </div>
                    </div>

                    {/* Filas de datos */}
                    <div className="divide-y divide-gray-200">
                        {currentItems.length > 0 ? (
                            currentItems.map((instructor, index) => (
                                <div key={instructor.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    {/* Vista Móvil */}
                                    <div className="lg:hidden space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {instructor.nombres} {instructor.apellidos}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">Doc: {instructor.documento_identidad}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/admin/instructores/${instructor.id}`}
                                                    className="inline-flex items-center justify-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Ver detalles"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <Link
                                                    href={`/admin/instructores/${instructor.id}/edit`}
                                                    className="inline-flex items-center justify-center p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Editar instructor"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => confirmarEliminacion(instructor.id)}
                                                    disabled={eliminando === instructor.id}
                                                    className="inline-flex items-center justify-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Eliminar instructor"
                                                >
                                                    {eliminando === instructor.id ? (
                                                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Trash2 size={18} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <p className="text-gray-500">Correo:</p>
                                                <p className="text-gray-700 break-all">{instructor.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Teléfono:</p>
                                                <p className="text-gray-700">{instructor.telefono || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vista Desktop */}
                                    <div className="hidden lg:grid grid-cols-5 gap-4 items-center">
                                        <div className="font-medium text-gray-900 text-sm">
                                            {instructor.nombres} {instructor.apellidos}
                                        </div>
                                        <div className="text-gray-700 text-sm">{instructor.documento_identidad}</div>
                                        <div className="text-gray-700 text-xs truncate" title={instructor.email}>
                                            {instructor.email}
                                        </div>
                                        <div className="text-gray-700 text-sm">{instructor.telefono || 'N/A'}</div>
                                        
                                        {/* Columna de acciones */}
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Botón Ver */}
                                            <Link
                                                href={`/admin/instructores/${instructor.id}`}
                                                className="inline-flex items-center justify-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Ver detalles"
                                            >
                                                <Eye size={18} />
                                            </Link>

                                            {/* Botón Editar */}
                                            <Link
                                                href={`/admin/instructores/${instructor.id}/edit`}
                                                className="inline-flex items-center justify-center p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Editar instructor"
                                            >
                                                <Edit size={18} />
                                            </Link>

                                            {/* Botón Eliminar */}
                                            <button
                                                onClick={() => confirmarEliminacion(instructor.id)}
                                                disabled={eliminando === instructor.id}
                                                className="inline-flex items-center justify-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Eliminar instructor"
                                            >
                                                {eliminando === instructor.id ? (
                                                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <Trash2 size={18} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No se encontraron instructores</p>
                                <p className="text-gray-400 text-sm mt-2">
                                    {instructores.data.length === 0 
                                        ? 'Aún no hay instructores registrados. ¡Agrega el primero!' 
                                        : 'Intenta con otros términos de búsqueda'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Paginador */}
                {totalItems > 0 && totalPages > 1 && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-sm text-gray-700">
                                Mostrando <span className="font-medium">{startIndex + 1}</span> - <span className="font-medium">{Math.min(endIndex, totalItems)}</span> de{' '}
                                <span className="font-medium">{totalItems}</span> instructores
                                {busqueda && (
                                    <span className="text-gray-500"> (filtrados de {instructores.data.length} total)</span>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {/* Botón anterior */}
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className={`flex items-center px-3 py-2 text-sm border rounded-md transition-colors ${
                                        currentPage === 1
                                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Anterior
                                </button>

                                {/* Números de página */}
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                                        // Mostrar solo algunas páginas alrededor de la actual
                                        if (
                                            pageNumber === 1 ||
                                            pageNumber === totalPages ||
                                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => goToPage(pageNumber)}
                                                    className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                                                        currentPage === pageNumber
                                                            ? 'bg-green-600 text-white border-green-600'
                                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            );
                                        } else if (
                                            pageNumber === currentPage - 2 ||
                                            pageNumber === currentPage + 2
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

                                {/* Botón siguiente */}
                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center px-3 py-2 text-sm border rounded-md transition-colors ${
                                        currentPage === totalPages
                                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    Siguiente
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        </div>

                        {/* Selector de elementos por página */}
                        <div className="flex items-center justify-center pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Mostrar:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => handleItemsPerPageChange(e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer"
                                >
                                    <option value={5}>5 por página</option>
                                    <option value={8}>8 por página</option>
                                    <option value={15}>15 por página</option>
                                    <option value={25}>25 por página</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Información adicional cuando no hay paginación */}
                {totalItems > 0 && totalPages <= 1 && (
                    <div className="mt-6 text-sm text-gray-600 text-center">
                        <p>
                            Mostrando {totalItems} instructor{totalItems !== 1 ? 'es' : ''}
                            {busqueda && (
                                <span className="text-gray-500"> (filtrados de {instructores.data.length} total)</span>
                            )}
                        </p>
                    </div>
                )}
            </div>

            {/* Modal de confirmación */}
            {modalEliminacion.visible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Confirmar Eliminación</h2>
                        <p className="text-gray-600 mb-6 text-base leading-relaxed">
                            ¿Estás seguro de que deseas eliminar este instructor? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex items-center justify-end gap-4">
                            <button
                                onClick={cancelarEliminacion}
                                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={procederEliminacion}
                                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SidebarLayout>
    );
}