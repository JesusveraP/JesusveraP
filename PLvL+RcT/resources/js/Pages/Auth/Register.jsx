import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo';
import useSystemColors from '@/hooks/useSystemColors';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { User, Shield, Mail, Lock, Phone, MapPin, Clock, ArrowLeft } from 'lucide-react';

export default function Register() {
    const { systemSettings } = usePage().props;
    const systemName = systemSettings?.system_name || 'Sistema SENA';
    const { colors } = useSystemColors();
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        codigo_guardia: '',
        ubicacion_asignada: '',
        hora_inicio_turno: '',
        hora_fin_turno: '',
        password: '',
        password_confirmation: '',
        role: 'guardia'
    });

    const submit = (e) => {
        e.preventDefault();
        
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const ubicaciones = [
        'Entrada Principal',
        'Entrada Secundaria',
        'Parqueadero',
        'Cafetería',
        'Laboratorios',
        'Biblioteca',
        'Edificio Administrativo',
        'Talleres',
        'Auditorio'
    ];

    return (
        <div className="min-h-screen bg-green-600 flex flex-col justify-center items-center px-4 py-8">
            <Head title="Registro de Vigilante - Sistema SENA" />

            {/* Contenedor principal del formulario */}
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
                        <ApplicationLogo className="w-20 h-20 object-contain" />
                    </div>
                    <div className="flex items-center justify-center mb-4">
                        <Shield className="text-green-600 mr-3" size={32} />
                        <h1 className="text-3xl font-bold text-gray-900">Registro de Vigilante</h1>
                    </div>
                    <p className="text-gray-600">Completa el formulario para registrarte como vigilante del sistema SENA</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Información Personal */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <User className="mr-2 text-green-600" size={20} />
                            Información Personal
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="name" value="Nombre Completo *" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-2 block w-full"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ej: Juan Carlos Pérez"
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Correo Electrónico *" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-2 block w-full"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="juan.perez@sena.edu.co"
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="phone" value="Teléfono *" />
                                <TextInput
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={data.phone}
                                    className="mt-2 block w-full"
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="300 123 4567"
                                    required
                                />
                                <InputError message={errors.phone} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="codigo_guardia" value="Código de Vigilante *" />
                                <TextInput
                                    id="codigo_guardia"
                                    name="codigo_guardia"
                                    value={data.codigo_guardia}
                                    className="mt-2 block w-full"
                                    onChange={(e) => setData('codigo_guardia', e.target.value)}
                                    placeholder="VIG001"
                                    required
                                />
                                <InputError message={errors.codigo_guardia} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* Asignación de Trabajo */}
                    <div className="bg-blue-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <MapPin className="mr-2 text-blue-600" size={20} />
                            Asignación de Trabajo
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <InputLabel htmlFor="ubicacion_asignada" value="Ubicación Asignada *" />
                                <select
                                    id="ubicacion_asignada"
                                    name="ubicacion_asignada"
                                    value={data.ubicacion_asignada}
                                    onChange={(e) => setData('ubicacion_asignada', e.target.value)}
                                    className="mt-2 block w-full border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">Seleccionar ubicación</option>
                                    {ubicaciones.map((ubicacion) => (
                                        <option key={ubicacion} value={ubicacion}>
                                            {ubicacion}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.ubicacion_asignada} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="hora_inicio_turno" value="Hora Inicio Turno *" />
                                <TextInput
                                    id="hora_inicio_turno"
                                    type="time"
                                    name="hora_inicio_turno"
                                    value={data.hora_inicio_turno}
                                    className="mt-2 block w-full"
                                    onChange={(e) => setData('hora_inicio_turno', e.target.value)}
                                    required
                                />
                                <InputError message={errors.hora_inicio_turno} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="hora_fin_turno" value="Hora Fin Turno *" />
                                <TextInput
                                    id="hora_fin_turno"
                                    type="time"
                                    name="hora_fin_turno"
                                    value={data.hora_fin_turno}
                                    className="mt-2 block w-full"
                                    onChange={(e) => setData('hora_fin_turno', e.target.value)}
                                    required
                                />
                                <InputError message={errors.hora_fin_turno} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* Credenciales de Acceso */}
                    <div className="bg-red-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Lock className="mr-2 text-red-600" size={20} />
                            Credenciales de Acceso
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="password" value="Contraseña *" />
                                <TextInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className="mt-2 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Mínimo 8 caracteres"
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña *" />
                                <TextInput
                                    id="password_confirmation"
                                    type={showPassword ? "text" : "password"}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-2 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Repite la contraseña"
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={showPassword}
                                    onChange={(e) => setShowPassword(e.target.checked)}
                                    className="rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Mostrar contraseñas</span>
                            </label>
                        </div>
                    </div>

                    {/* Información Importante */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-yellow-900 mb-2">⚠️ Información Importante</h4>
                        <ul className="text-xs text-yellow-800 space-y-1">
                            <li>• Tu registro debe ser aprobado por un administrador</li>
                            <li>• Recibirás un correo de confirmación una vez aprobado</li>
                            <li>• Todos los campos marcados con (*) son obligatorios</li>
                            <li>• El código de vigilante debe ser único en el sistema</li>
                        </ul>
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col space-y-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {processing ? 'Registrando...' : '✅ Registrar como Vigilante'}
                        </button>

                        <div className="flex justify-center">
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
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-white text-sm">
                <p className="font-medium">Sistema de Control de Asistencia de Instructores</p>
                <p className="mt-1 opacity-90">SENA - Servicio Nacional de Aprendizaje</p>
            </div>
        </div>
    );
}
