import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Show({ auth, user }) {
    const handleDelete = () => {
        if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.name}?`)) {
            router.delete(route('admin.users.destroy', user.id));
        }
    };

    return (
        <SidebarLayout
            title="Detalles del Usuario"
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Detalles de {user.name}
                </h2>
            }
        >
            <Head title={`Usuario: ${user.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header con acciones */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                <div className="flex items-center mb-4 sm:mb-0">
                                    <div className="flex-shrink-0 h-16 w-16">
                                        <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                                            <span className="text-xl font-bold text-gray-700">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl leading-6 font-bold text-gray-900">
                                            {user.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                                            user.role === 'admin' 
                                                ? 'bg-red-100 text-red-800' 
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex space-x-3">
                                    <Link href={route('admin.users.index')}>
                                        <SecondaryButton>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                            </svg>
                                            Volver al Listado
                                        </SecondaryButton>
                                    </Link>
                                    <Link href={route('admin.users.edit', user.id)}>
                                        <PrimaryButton>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Editar
                                        </PrimaryButton>
                                    </Link>
                                    {user.id !== auth.user.id && (
                                        <DangerButton onClick={handleDelete}>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Eliminar
                                        </DangerButton>
                                    )}
                                </div>
                            </div>

                            {/* Información del usuario */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h4>
                                        <dl className="space-y-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Nombre Completo</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Correo Electrónico</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Rol del Usuario</dt>
                                                <dd className="mt-1">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        user.role === 'admin' 
                                                            ? 'bg-red-100 text-red-800' 
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {user.role === 'admin' ? 'Administrador' : 'Usuario Regular'}
                                                    </span>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Estado del Email</dt>
                                                <dd className="mt-1">
                                                    {user.email_verified_at ? (
                                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                            ✓ Verificado
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                            ⚠ No Verificado
                                                        </span>
                                                    )}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-lg font-medium text-gray-900 mb-4">Información del Sistema</h4>
                                        <dl className="space-y-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">ID de Usuario</dt>
                                                <dd className="mt-1 text-sm text-gray-900 font-mono">{user.id}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Fecha de Registro</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {new Date(user.created_at).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Última Actualización</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {new Date(user.updated_at).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </dd>
                                            </div>
                                            {user.email_verified_at && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Email Verificado el</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {new Date(user.email_verified_at).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            {/* Permisos y capacidades */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Permisos y Capacidades</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {user.role === 'admin' ? (
                                        <>
                                            <div className="flex items-center p-3 bg-green-50 rounded-lg">
                                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm text-green-800">Acceso al panel de administración</span>
                                            </div>
                                            <div className="flex items-center p-3 bg-green-50 rounded-lg">
                                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm text-green-800">Gestión completa de usuarios</span>
                                            </div>
                                            <div className="flex items-center p-3 bg-green-50 rounded-lg">
                                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm text-green-800">Acceso a estadísticas del sistema</span>
                                            </div>
                                            <div className="flex items-center p-3 bg-green-50 rounded-lg">
                                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm text-green-800">Configuración del sistema</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                                                <svg className="flex-shrink-0 w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm text-blue-800">Acceso al dashboard de usuario</span>
                                            </div>
                                            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                                                <svg className="flex-shrink-0 w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm text-blue-800">Gestión de perfil personal</span>
                                            </div>
                                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                <span className="text-sm text-gray-600">Sin acceso al panel de administración</span>
                                            </div>
                                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                <span className="text-sm text-gray-600">Sin permisos de administración</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}