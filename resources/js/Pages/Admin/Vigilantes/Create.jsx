import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { User, MapPin, Lock, Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import LogoDisplay from '@/Components/LogoDisplay';

export default function CreateVigilante({ flash }) {
    const { systemSettings } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        nombre_completo: '',
        correo_electronico: '',
        telefono: '',
        cedula: '',
        codigo_vigilante: '',
        ubicacion_asignada: '',
        hora_inicio_turno: '',
        hora_fin_turno: '',
        password: '',
        password_confirmation: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.vigilantes.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Registro de Vigilante - SENA" />
            
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link
                                href={route('admin.dashboard')}
                                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Volver al Dashboard
                            </Link>
                        </div>
                        <div className="flex items-center space-x-3">
                            <LogoDisplay 
                                systemSettings={systemSettings} 
                                className="w-10 h-10 object-contain"
                                alt="Logo SENA"
                            />
                            <span className="text-lg font-semibold text-gray-900">
                                {systemSettings?.system_name || 'SENA'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mr-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Registro de Vigilante
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Sistema de Gestión de Vigilancia SENA
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notificaciones */}
                {flash?.success && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 text-green-700 rounded-md">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm font-medium">
                                    ✅ {flash.success}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {flash?.error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-md">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm font-medium">
                                    ❌ {flash.error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Formulario */}
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <form onSubmit={submit} className="divide-y divide-gray-200">
                        {/* Información Personal */}
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100">
                            <div className="flex items-center mb-6">
                                <User className="w-6 h-6 text-blue-600 mr-3" />
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Información Personal
                                </h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <InputLabel htmlFor="nombre_completo" value="Nombre Completo" className="text-sm font-medium text-gray-700" />
                                    <TextInput
                                        id="nombre_completo"
                                        name="nombre_completo"
                                        value={data.nombre_completo}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => setData('nombre_completo', e.target.value)}
                                        placeholder="Ingrese el nombre completo"
                                        required
                                    />
                                    <InputError message={errors.nombre_completo} className="mt-1" />
                                </div>

                                <div className="space-y-1">
                                    <InputLabel htmlFor="cedula" value="Número de Cédula" className="text-sm font-medium text-gray-700" />
                                    <TextInput
                                        id="cedula"
                                        name="cedula"
                                        value={data.cedula}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => setData('cedula', e.target.value)}
                                        placeholder="Número de identificación"
                                        required
                                    />
                                    <InputError message={errors.cedula} className="mt-1" />
                                </div>

                                <div className="space-y-1">
                                    <InputLabel htmlFor="correo_electronico" value="Correo Electrónico" className="text-sm font-medium text-gray-700" />
                                    <TextInput
                                        id="correo_electronico"
                                        type="email"
                                        name="correo_electronico"
                                        value={data.correo_electronico}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => setData('correo_electronico', e.target.value)}
                                        placeholder="correo@sena.edu.co"
                                        required
                                    />
                                    <InputError message={errors.correo_electronico} className="mt-1" />
                                </div>

                                <div className="space-y-1">
                                    <InputLabel htmlFor="telefono" value="Número de Teléfono" className="text-sm font-medium text-gray-700" />
                                    <TextInput
                                        id="telefono"
                                        type="tel"
                                        name="telefono"
                                        value={data.telefono}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => setData('telefono', e.target.value)}
                                        placeholder="300 123 4567"
                                        required
                                    />
                                    <InputError message={errors.telefono} className="mt-1" />
                                </div>
                            </div>
                        </div>

                        {/* Información Laboral */}
                        <div className="p-6 bg-gradient-to-r from-orange-50 to-orange-100">
                            <div className="flex items-center mb-6">
                                <MapPin className="w-6 h-6 text-orange-600 mr-3" />
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Información Laboral
                                </h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <InputLabel htmlFor="codigo_vigilante" value="Código de Vigilante" className="text-sm font-medium text-gray-700" />
                                    <TextInput
                                        id="codigo_vigilante"
                                        name="codigo_vigilante"
                                        value={data.codigo_vigilante}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                        onChange={(e) => setData('codigo_vigilante', e.target.value)}
                                        placeholder="VIG001"
                                        required
                                    />
                                    <InputError message={errors.codigo_vigilante} className="mt-1" />
                                </div>

                                <div className="space-y-1">
                                    <InputLabel htmlFor="ubicacion_asignada" value="Ubicación Asignada" className="text-sm font-medium text-gray-700" />
                                    <select
                                        id="ubicacion_asignada"
                                        name="ubicacion_asignada"
                                        value={data.ubicacion_asignada}
                                        onChange={(e) => setData('ubicacion_asignada', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                        required
                                    >
                                        <option value="">Seleccionar ubicación</option>
                                        <option value="Puerta Principal">🚪 Puerta Principal</option>
                                        <option value="Entrada Lateral">🚪 Entrada Lateral</option>
                                        <option value="Zona de Parqueadero">🚗 Zona de Parqueadero</option>
                                        <option value="Entrada Secundaria">🚪 Entrada Secundaria</option>
                                        <option value="Cafetería">☕ Cafetería</option>
                                        <option value="Laboratorios">🔬 Laboratorios</option>
                                        <option value="Biblioteca">📚 Biblioteca</option>
                                        <option value="Edificio Administrativo">🏢 Edificio Administrativo</option>
                                        <option value="Talleres">🔧 Talleres</option>
                                        <option value="Auditorio">🎭 Auditorio</option>
                                    </select>
                                    <InputError message={errors.ubicacion_asignada} className="mt-1" />
                                </div>

                                <div className="space-y-1">
                                    <InputLabel htmlFor="hora_inicio_turno" value="Hora de Inicio" className="text-sm font-medium text-gray-700" />
                                    <TextInput
                                        id="hora_inicio_turno"
                                        type="time"
                                        name="hora_inicio_turno"
                                        value={data.hora_inicio_turno}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                        onChange={(e) => setData('hora_inicio_turno', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.hora_inicio_turno} className="mt-1" />
                                </div>

                                <div className="space-y-1 md:col-span-2 lg:col-span-1">
                                    <InputLabel htmlFor="hora_fin_turno" value="Hora de Finalización" className="text-sm font-medium text-gray-700" />
                                    <TextInput
                                        id="hora_fin_turno"
                                        type="time"
                                        name="hora_fin_turno"
                                        value={data.hora_fin_turno}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                        onChange={(e) => setData('hora_fin_turno', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.hora_fin_turno} className="mt-1" />
                                </div>
                            </div>
                        </div>

                        {/* Credenciales de Acceso */}
                        <div className="p-6 bg-gradient-to-r from-red-50 to-red-100">
                            <div className="flex items-center mb-6">
                                <Lock className="w-6 h-6 text-red-600 mr-3" />
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Credenciales de Acceso al Sistema
                                </h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <InputLabel htmlFor="password" value="Contraseña" className="text-sm font-medium text-gray-700" />
                                    <div className="relative">
                                        <TextInput
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={data.password}
                                            className="mt-1 block w-full pr-10 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Mínimo 8 caracteres"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-1" />
                                </div>

                                <div className="space-y-1">
                                    <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" className="text-sm font-medium text-gray-700" />
                                    <div className="relative">
                                        <TextInput
                                            id="password_confirmation"
                                            type={showPasswordConfirmation ? "text" : "password"}
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="mt-1 block w-full pr-10 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Confirme la contraseña"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                        >
                                            {showPasswordConfirmation ? (
                                                <EyeOff className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password_confirmation} className="mt-1" />
                                </div>
                            </div>
                        </div>

                        {/* Footer del formulario */}
                        <div className="px-6 py-4 bg-gray-50 text-right">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    Todos los campos marcados son obligatorios
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('admin.dashboard')}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                    >
                                        Cancelar
                                    </Link>
                                    <PrimaryButton 
                                        className="px-6 py-2 bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-800 text-white rounded-md font-medium transition-colors" 
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Registrando...
                                            </span>
                                        ) : (
                                            'Registrar Vigilante'
                                        )}
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}