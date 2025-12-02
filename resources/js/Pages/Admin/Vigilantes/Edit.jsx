import { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, User, Mail, Phone, Shield, MapPin, Clock } from 'lucide-react';
import SidebarLayout from '../../../Layouts/SidebarLayout';
import TextInput from '../../../Components/TextInput';
import InputLabel from '../../../Components/InputLabel';
import InputError from '../../../Components/InputError';
import PrimaryButton from '../../../Components/PrimaryButton';
import SecondaryButton from '../../../Components/SecondaryButton';

export default function Edit({ auth, vigilante, errors }) {
    const { data, setData, put, processing } = useForm({
        name: vigilante.name || '',
        email: vigilante.email || '',
        telefono: vigilante.telefono || '',
        cedula: vigilante.cedula || '',
        ubicacion_asignada: vigilante.ubicacion_asignada || '',
        hora_inicio_turno: vigilante.hora_inicio_turno || '',
        hora_fin_turno: vigilante.hora_fin_turno || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.vigilantes.update', vigilante.id));
    };

    const ubicacionesDisponibles = [
        'Entrada Principal',
        'Entrada Secundaria',
        'Parking',
        'Edificio A',
        'Edificio B',
        'Laboratorios',
        'Biblioteca',
        'Cafetería',
        'Auditorio',
        'Oficinas Administrativas'
    ];

    return (
        <SidebarLayout
            title="Editar Vigilante"
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Editar Vigilante: {vigilante.name}
                </h2>
            }
        >
            <Head title={`Editar: ${vigilante.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Información Personal */}
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Información Personal
                                        </h3>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="name" value="Nombre Completo *" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            placeholder="Ingresa el nombre completo"
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="email" value="Correo Electrónico *" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <TextInput
                                                id="email"
                                                type="email"
                                                className="mt-1 block w-full pl-10"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                                placeholder="ejemplo@correo.com"
                                            />
                                        </div>
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="telefono" value="Teléfono *" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <TextInput
                                                id="telefono"
                                                type="tel"
                                                className="mt-1 block w-full pl-10"
                                                value={data.telefono}
                                                onChange={(e) => setData('telefono', e.target.value)}
                                                required
                                                placeholder="Número de teléfono"
                                            />
                                        </div>
                                        <InputError message={errors.telefono} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="cedula" value="Código de Vigilante *" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Shield className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <TextInput
                                                id="cedula"
                                                type="text"
                                                className="mt-1 block w-full pl-10"
                                                value={data.cedula}
                                                onChange={(e) => setData('cedula', e.target.value)}
                                                required
                                                placeholder="Código único del vigilante"
                                            />
                                        </div>
                                        <InputError message={errors.cedula} className="mt-2" />
                                    </div>
                                </div>

                                {/* Información Laboral */}
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <MapPin className="w-5 h-5 text-gray-400" />
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Información Laboral
                                        </h3>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="ubicacion_asignada" value="Ubicación Asignada *" />
                                        <select
                                            id="ubicacion_asignada"
                                            value={data.ubicacion_asignada}
                                            onChange={(e) => setData('ubicacion_asignada', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="">Selecciona una ubicación</option>
                                            {ubicacionesDisponibles.map((ubicacion) => (
                                                <option key={ubicacion} value={ubicacion}>
                                                    {ubicacion}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.ubicacion_asignada} className="mt-2" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="hora_inicio_turno" value="Hora de Inicio *" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Clock className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="hora_inicio_turno"
                                                    type="time"
                                                    className="mt-1 block w-full pl-10"
                                                    value={data.hora_inicio_turno}
                                                    onChange={(e) => setData('hora_inicio_turno', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.hora_inicio_turno} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="hora_fin_turno" value="Hora de Fin *" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Clock className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="hora_fin_turno"
                                                    type="time"
                                                    className="mt-1 block w-full pl-10"
                                                    value={data.hora_fin_turno}
                                                    onChange={(e) => setData('hora_fin_turno', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.hora_fin_turno} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-blue-900 mb-2">
                                            💡 Información sobre turnos
                                        </h4>
                                        <div className="text-sm text-blue-700 space-y-1">
                                            <p>• <strong>Mañana:</strong> 06:00 - 12:00</p>
                                            <p>• <strong>Tarde:</strong> 12:00 - 18:00</p>
                                            <p>• <strong>Noche:</strong> 18:00 - 06:00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Información adicional */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                    <h4 className="text-sm font-medium text-yellow-900 mb-2">
                                        ⚠️ Información importante
                                    </h4>
                                    <div className="text-sm text-yellow-700">
                                        <p>• Los campos marcados con (*) son obligatorios</p>
                                        <p>• El código de vigilante debe ser único en el sistema</p>
                                        <p>• Los cambios en horarios afectarán los próximos turnos asignados</p>
                                    </div>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                                <SecondaryButton type="button">
                                    <Link href={route('admin.vigilantes.index')}>
                                        Cancelar
                                    </Link>
                                </SecondaryButton>
                                <PrimaryButton type="submit" disabled={processing}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Guardando...' : 'Guardar Cambios'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}