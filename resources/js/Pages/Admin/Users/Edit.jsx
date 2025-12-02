import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

export default function Edit({ auth, user, roles }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    return (
        <SidebarLayout
            title="Editar Usuario"
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Editar Usuario: {user.name}
                </h2>
            }
        >
            <Head title="Editar Usuario" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Editar información de {user.name}
                                </h3>
                                <Link href={route('admin.users.index')}>
                                    <SecondaryButton>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Volver al Listado
                                    </SecondaryButton>
                                </Link>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Nombre Completo" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Correo Electrónico" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="role" value="Rol de Usuario" />
                                    <select
                                        id="role"
                                        name="role"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        required
                                        disabled={user.id === auth.user.id}
                                    >
                                        <option value="user">Usuario Regular</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                    <InputError message={errors.role} className="mt-2" />
                                    {user.id === auth.user.id && (
                                        <p className="mt-2 text-sm text-yellow-600">
                                            No puedes cambiar tu propio rol.
                                        </p>
                                    )}
                                </div>

                                <div className="border-t pt-6">
                                    <h4 className="text-md font-medium text-gray-900 mb-4">
                                        Cambiar Contraseña (Opcional)
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Deja estos campos vacíos si no deseas cambiar la contraseña.
                                    </p>

                                    <div className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="password" value="Nueva Contraseña" />
                                            <TextInput
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                className="mt-1 block w-full"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                            />
                                            <InputError message={errors.password} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="password_confirmation" value="Confirmar Nueva Contraseña" />
                                            <TextInput
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className="mt-1 block w-full"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                            />
                                            <InputError message={errors.password_confirmation} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6 space-x-3">
                                    <Link href={route('admin.users.index')}>
                                        <SecondaryButton type="button">
                                            Cancelar
                                        </SecondaryButton>
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Actualizando...' : 'Actualizar Usuario'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="bg-gray-50 overflow-hidden shadow-sm sm:rounded-lg mt-6">
                        <div className="p-6">
                            <h4 className="text-md font-medium text-gray-900 mb-4">
                                Información del Usuario
                            </h4>
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">ID de Usuario</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{user.id}</dd>
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
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Email Verificado</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {user.email_verified_at ? (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                Verificado
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                No Verificado
                                            </span>
                                        )}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}