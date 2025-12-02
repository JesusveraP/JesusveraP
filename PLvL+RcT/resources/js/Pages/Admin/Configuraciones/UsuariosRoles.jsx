import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Users, Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';

export default function UsuariosRoles({ roles = [] }) {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [rolEditando, setRolEditando] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        display_name: '',
        description: '',
        permissions: []
    });

    const crearRol = (e) => {
        e.preventDefault();
        post(route('admin.roles.store'), {
            onSuccess: () => {
                reset();
                setMostrarFormulario(false);
            }
        });
    };

    const editarRol = (rol) => {
        setRolEditando(rol);
        setData({
            name: rol.name,
            display_name: rol.display_name,
            description: rol.description || '',
            permissions: rol.permissions || []
        });
        setMostrarFormulario(true);
    };

    const actualizarRol = (e) => {
        e.preventDefault();
        put(route('admin.roles.update', rolEditando.id), {
            onSuccess: () => {
                reset();
                setMostrarFormulario(false);
                setRolEditando(null);
            }
        });
    };

    const eliminarRol = (rol) => {
        if (confirm(`¿Estás seguro de que deseas eliminar el rol "${rol.display_name}"?`)) {
            router.delete(route('admin.roles.destroy', rol.id), {
                onSuccess: () => {
                    // Opcional: mostrar mensaje de éxito
                },
                onError: (errors) => {
                    // Manejar errores si es necesario
                    if (errors.message) {
                        alert(errors.message);
                    }
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Usuarios y Roles - SENA" />
            
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <Link 
                                href={route('admin.configuraciones')}
                                className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900">Usuarios y Roles</h1>
                        </div>
                        <Link
                            href={route('admin.configuraciones')}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Volver
                        </Link>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabla de roles existentes */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Roles existentes</h2>
                    
                    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                        Rol
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                        Usuarios
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {roles.map((rol) => (
                                    <tr key={rol.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-lg font-medium text-gray-900">
                                                    {rol.display_name}
                                                </div>
                                                {rol.description && (
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {rol.description}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <Users className="mr-2 text-gray-400" size={16} />
                                                <span className="text-2xl font-bold text-gray-900">
                                                    {rol.users_count}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {!rol.is_system_role && (
                                                <>
                                                    <button
                                                        onClick={() => editarRol(rol)}
                                                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Edit size={14} className="mr-1" />
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => eliminarRol(rol)}
                                                        className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash2 size={14} className="mr-1" />
                                                        Eliminar
                                                    </button>
                                                </>
                                            )}
                                            {rol.is_system_role && (
                                                <span className="text-sm text-gray-500 italic">
                                                    Rol del sistema
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sección para crear nuevo rol */}
                <div className="bg-white shadow-lg rounded-xl p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Crear rol</h2>
                    
                    {!mostrarFormulario ? (
                        <div className="flex flex-col items-center py-8">
                            <input
                                type="text"
                                placeholder="Nombre del rol"
                                className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-4"
                                onFocus={() => setMostrarFormulario(true)}
                            />
                            <button
                                onClick={() => setMostrarFormulario(true)}
                                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                            >
                                <Plus size={18} className="mr-2" />
                                Agregar rol
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={rolEditando ? actualizarRol : crearRol} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del rol (interno)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="ej: coordinador"
                                        disabled={rolEditando}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre para mostrar
                                    </label>
                                    <input
                                        type="text"
                                        value={data.display_name}
                                        onChange={(e) => setData('display_name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="ej: Coordinador Académico"
                                        required
                                    />
                                    {errors.display_name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.display_name}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Descripción del rol y sus responsabilidades"
                                    rows="3"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMostrarFormulario(false);
                                        setRolEditando(null);
                                        reset();
                                    }}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Guardando...' : (rolEditando ? 'Actualizar rol' : 'Agregar rol')}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}