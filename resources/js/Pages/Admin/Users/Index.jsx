import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

export default function Index({ auth, users, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), {
            search: search,
            role: roleFilter
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (user) => {
        if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.name}?`)) {
            router.delete(route('admin.users.destroy', user.id));
        }
    };

    return (
        <SidebarLayout
            title="Gestión de Usuarios"
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Usuarios</h2>}
        >
            <Head title="Gestión de Usuarios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header con búsqueda y botón crear */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 sm:mb-0">
                                    Lista de Usuarios
                                </h3>
                                <Link href={route('admin.users.create')}>
                                    <PrimaryButton>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Crear Usuario
                                    </PrimaryButton>
                                </Link>
                            </div>

                            {/* Filtros de búsqueda */}
                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <TextInput
                                            type="text"
                                            placeholder="Buscar por nombre o email..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <select
                                            value={roleFilter}
                                            onChange={(e) => setRoleFilter(e.target.value)}
                                            className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        >
                                            <option value="">Todos los roles</option>
                                            <option value="user">Usuario</option>
                                            <option value="admin">Administrador</option>
                                        </select>
                                    </div>
                                    <div className="flex space-x-2">
                                        <PrimaryButton type="submit">
                                            Buscar
                                        </PrimaryButton>
                                        <SecondaryButton
                                            type="button"
                                            onClick={() => {
                                                setSearch('');
                                                setRoleFilter('');
                                                router.get(route('admin.users.index'));
                                            }}
                                        >
                                            Limpiar
                                        </SecondaryButton>
                                    </div>
                                </div>
                            </form>

                            {/* Tabla de usuarios */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Usuario
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rol
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha de Registro
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.data.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        user.role === 'admin' 
                                                            ? 'bg-red-100 text-red-800' 
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(user.created_at).toLocaleDateString('es-ES')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={route('admin.users.show', user.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Ver
                                                        </Link>
                                                        <Link
                                                            href={route('admin.users.edit', user.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Editar
                                                        </Link>
                                                        {user.id !== auth.user.id && (
                                                            <button
                                                                onClick={() => handleDelete(user)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            {users.links && (
                                <div className="mt-6 flex justify-between items-center">
                                    <div className="text-sm text-gray-700">
                                        Mostrando {users.from} a {users.to} de {users.total} usuarios
                                    </div>
                                    <div className="flex space-x-1">
                                        {users.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => router.get(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-2 text-sm ${
                                                    link.active
                                                        ? 'bg-indigo-500 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                                } border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}