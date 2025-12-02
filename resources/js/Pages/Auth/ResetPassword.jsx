import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Lock, ArrowLeft } from 'lucide-react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Restablecer Contraseña - Sistema SENA" />

            <div className="mb-8 text-center">
                <div className="flex items-center justify-center mb-4">
                    <Lock className="text-green-600 mr-3" size={32} />
                    <h1 className="text-2xl font-bold text-gray-900">Restablecer Contraseña</h1>
                </div>
                <p className="text-sm text-gray-600">
                    Ingresa tu nueva contraseña para acceder a tu cuenta.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Correo Electrónico" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full bg-gray-100"
                        disabled
                        autoComplete="username"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Nueva Contraseña" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2 block w-full"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Ingresa una contraseña fuerte"
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Contraseña"
                    />
                    <TextInput
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-2 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        placeholder="Confirma tu nueva contraseña"
                        required
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Requisitos de Contraseña</h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                        <li>• Mínimo 8 caracteres</li>
                        <li>• Combina mayúsculas, minúsculas, números y símbolos</li>
                        <li>• No uses información personal fácil de adivinar</li>
                        <li>• Asegúrate de que las contraseñas coincidan</li>
                    </ul>
                </div>

                <div className="flex flex-col space-y-4">
                    <PrimaryButton 
                        disabled={processing}
                        className="w-full justify-center py-3"
                    >
                        {processing ? 'Restableciendo...' : '🔒 Restablecer Contraseña'}
                    </PrimaryButton>

                    <Link
                        href={route('login')}
                        className="flex items-center justify-center text-sm text-gray-600 hover:text-green-600 transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Volver al inicio de sesión
                    </Link>
                </div>
            </form>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">🛡️ Consejos de Seguridad</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Nunca compartas tu contraseña con otros</li>
                    <li>• Usa contraseñas diferentes para cada servicio</li>
                    <li>• Cambia tu contraseña regularmente</li>
                    <li>• Si no solicitaste esto, contacta al administrador inmediatamente</li>
                </ul>
            </div>
        </GuestLayout>
    );
}
