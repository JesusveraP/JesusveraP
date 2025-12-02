import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Shield, ArrowLeft, Clock, Mail } from 'lucide-react';

export default function VerifyRecoveryCode({ email, status }) {
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutos en segundos
    
    const { data, setData, post, processing, errors } = useForm({
        email: email || '',
        code: '',
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('password.verify-code'));
    };

    const resendCode = () => {
        window.location.href = route('password.request');
    };

    return (
        <GuestLayout>
            <Head title="Verificar Código - Sistema SENA" />

            <div className="mb-8 text-center">
                <div className="flex items-center justify-center mb-4">
                    <Shield className="text-green-600 mr-3" size={32} />
                    <h1 className="text-2xl font-bold text-gray-900">Verificar Código</h1>
                </div>
                <p className="text-sm text-gray-600">
                    Ingresa el código de 6 dígitos que enviamos a tu correo electrónico
                </p>
            </div>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center mb-2">
                    <Mail className="text-blue-600 mr-2" size={16} />
                    <span className="text-sm font-medium text-blue-900">Código enviado a:</span>
                </div>
                <p className="text-sm text-blue-800 font-mono">{email}</p>
            </div>

            {status && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">{status}</p>
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="code" value="Código de Recuperación" />
                    <TextInput
                        id="code"
                        type="text"
                        name="code"
                        value={data.code}
                        className="mt-2 block w-full text-center text-2xl font-mono tracking-widest"
                        isFocused={true}
                        onChange={(e) => setData('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        maxLength="6"
                        required
                    />
                    <InputError message={errors.code} className="mt-2" />
                    <p className="mt-2 text-xs text-gray-500 text-center">
                        Ingresa el código de 6 dígitos que recibiste por correo
                    </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                        <Clock className="text-yellow-600 mr-2" size={16} />
                        <span className="text-sm font-medium text-yellow-900">
                            {timeLeft > 0 ? 'Tiempo restante:' : 'Código expirado'}
                        </span>
                    </div>
                    <p className="text-lg font-mono text-yellow-800">
                        {timeLeft > 0 ? formatTime(timeLeft) : '00:00'}
                    </p>
                    {timeLeft <= 0 && (
                        <p className="text-xs text-yellow-700 mt-2">
                            El código ha expirado. Solicita uno nuevo.
                        </p>
                    )}
                </div>

                <div className="flex flex-col space-y-4">
                    <PrimaryButton 
                        disabled={processing || timeLeft <= 0 || data.code.length !== 6}
                        className="w-full justify-center py-3"
                    >
                        {processing ? 'Verificando...' : '🔓 Verificar Código'}
                    </PrimaryButton>

                    <div className="flex flex-col items-center space-y-2">
                        <button
                            type="button"
                            onClick={resendCode}
                            className="text-sm text-green-600 hover:text-green-800 transition-colors"
                            disabled={timeLeft > 0}
                        >
                            📧 Enviar nuevo código
                        </button>
                        
                        <Link
                            href={route('login')}
                            className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </form>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">❓ ¿No recibiste el código?</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Revisa tu carpeta de spam o correo no deseado</li>
                    <li>• Verifica que el correo electrónico esté escrito correctamente</li>
                    <li>• El código puede tardar unos minutos en llegar</li>
                    <li>• Si sigues sin recibirlo, contacta al administrador</li>
                </ul>
            </div>
        </GuestLayout>
    );
}