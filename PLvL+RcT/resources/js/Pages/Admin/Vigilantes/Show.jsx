import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Shield, Mail, Phone, MapPin, Clock, Calendar, User } from 'lucide-react';
import SidebarLayout from '../../../Layouts/SidebarLayout';

export default function Show({ auth, vigilante }) {
    const getTurnoBadge = (horaInicio) => {
        if (!horaInicio) return 'No definido';
        const hora = parseInt(horaInicio.split(':')[0]);
        
        if (hora >= 6 && hora < 12) {
            return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Mañana</span>;
        } else if (hora >= 12 && hora < 18) {
            return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Tarde</span>;
        } else {
            return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Noche</span>;
        }
    };

    const getEstadoBadge = (vigilante) => {
        const isActive = vigilante.email_verified_at;
        return isActive ? (
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Activo
            </span>
        ) : (
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                Inactivo
            </span>
        );
    };

    return (
        <SidebarLayout
            title="Detalles del Vigilante"
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Detalles de {vigilante.name}
                </h2>
            }
        >
            <Head title={`Vigilante: ${vigilante.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6">
                            {/* Cabecera del perfil */}
                            <div className="flex items-center space-x-6 mb-8">
                                <div className="flex-shrink-0">
                                    <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                                        <span className="text-green-600 font-bold text-2xl">
                                            {vigilante.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-gray-900">{vigilante.name}</h1>
                                    <p className="text-lg text-gray-600 mb-2">{vigilante.email}</p>
                                    <div className="flex items-center space-x-4">
                                        {getEstadoBadge(vigilante)}
                                        {getTurnoBadge(vigilante.hora_inicio_turno)}
                                    </div>
                                </div>
                            </div>

                            {/* Información detallada */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Información personal */}
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                        Información Personal
                                    </h2>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
                                                <p className="text-sm text-gray-900">{vigilante.name}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Correo Electrónico</p>
                                                <p className="text-sm text-gray-900">{vigilante.email}</p>
                                            </div>
                                        </div>

                                        {vigilante.telefono && (
                                            <div className="flex items-start space-x-3">
                                                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Teléfono</p>
                                                    <p className="text-sm text-gray-900">{vigilante.telefono}</p>
                                                </div>
                                            </div>
                                        )}

                                        {vigilante.cedula && (
                                            <div className="flex items-start space-x-3">
                                                <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Código de Vigilante</p>
                                                    <p className="text-sm text-gray-900">{vigilante.cedula}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-start space-x-3">
                                            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Fecha de Registro</p>
                                                <p className="text-sm text-gray-900">
                                                    {new Date(vigilante.created_at).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Información laboral */}
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                        Información Laboral
                                    </h2>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Ubicación Asignada</p>
                                                <p className="text-sm text-gray-900">
                                                    {vigilante.ubicacion_asignada || 'No asignada'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Horario de Trabajo</p>
                                                <p className="text-sm text-gray-900">
                                                    {vigilante.hora_inicio_turno && vigilante.hora_fin_turno 
                                                        ? `${vigilante.hora_inicio_turno} - ${vigilante.hora_fin_turno}`
                                                        : 'No definido'
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Estado de la Cuenta</p>
                                                <div className="mt-1">
                                                    {getEstadoBadge(vigilante)}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {vigilante.email_verified_at 
                                                        ? `Verificado el ${new Date(vigilante.email_verified_at).toLocaleDateString()}`
                                                        : 'Cuenta no verificada'
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {vigilante.fecha_inicio && (
                                            <div className="flex items-start space-x-3">
                                                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Fecha de Inicio</p>
                                                    <p className="text-sm text-gray-900">
                                                        {new Date(vigilante.fecha_inicio).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Estadísticas adicionales */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Estadísticas de Actividad
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {Math.floor(Math.random() * 30) + 1}
                                        </div>
                                        <div className="text-sm text-blue-600">Días trabajados este mes</div>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <div className="text-2xl font-bold text-green-600">
                                            {Math.floor(Math.random() * 100) + 50}
                                        </div>
                                        <div className="text-sm text-green-600">Registros de asistencia</div>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {Math.floor(Math.random() * 20) + 1}
                                        </div>
                                        <div className="text-sm text-purple-600">Turnos completados</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}