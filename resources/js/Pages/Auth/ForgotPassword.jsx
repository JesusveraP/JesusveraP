import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Shield } from 'lucide-react';

export default function ForgotPassword({ status, recoverySettings }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    const isEnabled = recoverySettings?.enabled !== false;

    return (
        <GuestLayout>
            <Head title="Recuperar Contraseña - Sistema SENA" />

            <div className="mb-8 text-center">
                <div className="flex items-center justify-center mb-4">
                    <Shield className="text-green-600 mr-3" size={32} />
                    <h1 className="text-2xl font-bold text-gray-900">Recuperar Contraseña</h1>
                </div>
                <p className="text-sm text-gray-600">
                    ¿Olvidaste tu contraseña? Te enviaremos un enlace para que puedas restablecerla.
                </p>
            </div>

            {status && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                        ✓ {status}
                    </p>
                </div>
            )}

            {!isEnabled && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-800">
                        <strong>Funcionalidad deshabilitada:</strong> La recuperación de contraseña está desactivada temporalmente. 
                        Contacte al administrador del sistema.
                    </p>
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Correo Electrónico" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Ingresa tu correo electrónico registrado"
                        required
                        disabled={!isEnabled}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">ℹ️ Información Importante</h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                        <li>• Te enviaremos un enlace de restablecimiento a tu correo</li>
                        <li>• El enlace será válido por 1 hora</li>
                        <li>• Verifica tu bandeja de entrada y carpeta de spam</li>
                        <li>• Si no recibes el correo, verifica que el correo esté bien escrito</li>
                    </ul>
                </div>

                <div className="flex flex-col space-y-4">
                    <PrimaryButton 
                        disabled={processing || !isEnabled}
                        className="w-full justify-center py-3"
                    >
                        {processing ? 'Enviando enlace...' : '📧 Enviar Enlace de Recuperación'}
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
                    <li>• Nunca compartas el enlace de recuperación con otras personas</li>
                    <li>• SENA nunca te pedirá tu contraseña por correo</li>
                    <li>• Si no solicitaste este correo, contacta al administrador</li>
                    <li>• Usa una contraseña fuerte y única para tu cuenta</li>
                </ul>
            </div>
        </GuestLayout>
    );
}
