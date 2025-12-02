import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, X } from 'lucide-react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function Edit({ instructor }) {
    const { data, setData, put, processing, errors } = useForm({
        nombres: instructor.nombres || '',
        apellidos: instructor.apellidos || '',
        documento_identidad: instructor.documento_identidad || '',
        tipo_documento: instructor.tipo_documento || 'CC',
        email: instructor.email || '',
        telefono: instructor.telefono || '',
        area_asignada: instructor.area_asignada || '',
        cargo: instructor.cargo || '',
        fecha_ingreso: instructor.fecha_ingreso || '',
        hora_entrada_programada: instructor.hora_entrada_programada || '',
        hora_salida_programada: instructor.hora_salida_programada || '',
        codigo_barras: instructor.codigo_barras || '',
        direccion: instructor.direccion || '',
        observaciones: instructor.observaciones || '',
        estado: instructor.estado || 'activo',
    });

    const tiposDocumento = [
        { value: 'CC', label: 'Cédula de Ciudadanía' },
        { value: 'CE', label: 'Cédula de Extranjería' },
        { value: 'PA', label: 'Pasaporte' },
        { value: 'TI', label: 'Tarjeta de Identidad' }
    ];

    const estadosInstructor = [
        { value: 'activo', label: 'Activo' },
        { value: 'inactivo', label: 'Inactivo' },
        { value: 'suspendido', label: 'Suspendido' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/instructores/${instructor.id}`);
    };

    return (
        <SidebarLayout
            title={`Editar ${instructor.nombres} ${instructor.apellidos} - SENA`}
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={`/admin/instructores/${instructor.id}`}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Editar Instructor
                    </h1>
                </div>
            }
        >
            {/* Formulario */}
            <div className="p-8">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Información Personal */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Información Personal</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombres <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nombres}
                                        onChange={(e) => setData('nombres', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                            errors.nombres ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Ingrese los nombres"
                                    />
                                    {errors.nombres && <p className="mt-1 text-sm text-red-600">{errors.nombres}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Apellidos <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.apellidos}
                                        onChange={(e) => setData('apellidos', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                            errors.apellidos ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Ingrese los apellidos"
                                    />
                                    {errors.apellidos && <p className="mt-1 text-sm text-red-600">{errors.apellidos}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipo de Documento <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.tipo_documento}
                                        onChange={(e) => setData('tipo_documento', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                            errors.tipo_documento ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    >
                                        {tiposDocumento.map((tipo) => (
                                            <option key={tipo.value} value={tipo.value}>
                                                {tipo.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.tipo_documento && <p className="mt-1 text-sm text-red-600">{errors.tipo_documento}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Número de Documento <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.documento_identidad}
                                        onChange={(e) => setData('documento_identidad', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                            errors.documento_identidad ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Ingrese el número de documento"
                                    />
                                    {errors.documento_identidad && <p className="mt-1 text-sm text-red-600">{errors.documento_identidad}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Correo Electrónico <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                            errors.email ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="instructor@sena.edu.co"
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.telefono}
                                        onChange={(e) => setData('telefono', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                            errors.telefono ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="300 123 4567"
                                    />
                                    {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Dirección
                                    </label>
                                    <input
                                        type="text"
                                        value={data.direccion}
                                        onChange={(e) => setData('direccion', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                            errors.direccion ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Dirección de residencia"
                                    />
                                    {errors.direccion && <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Información Laboral */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Información Laboral</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Área Asignada <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.area_asignada}
                                        onChange={(e) => setData('area_asignada', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                            errors.area_asignada ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Ej: Sistemas, Electrónica, etc."
                                    />
                                    {errors.area_asignada && <p className="mt-1 text-sm text-red-600">{errors.area_asignada}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cargo
                                    </label>
                                    <input
                                        type="text"
                                        value={data.cargo}
                                        onChange={(e) => setData('cargo', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                            errors.cargo ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Instructor"
                                    />
                                    {errors.cargo && <p className="mt-1 text-sm text-red-600">{errors.cargo}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha de Ingreso <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.fecha_ingreso}
                                        onChange={(e) => setData('fecha_ingreso', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                            errors.fecha_ingreso ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.fecha_ingreso && <p className="mt-1 text-sm text-red-600">{errors.fecha_ingreso}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Estado <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.estado}
                                        onChange={(e) => setData('estado', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                            errors.estado ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    >
                                        {estadosInstructor.map((estado) => (
                                            <option key={estado.value} value={estado.value}>
                                                {estado.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.estado && <p className="mt-1 text-sm text-red-600">{errors.estado}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hora de Entrada <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={data.hora_entrada_programada}
                                        onChange={(e) => setData('hora_entrada_programada', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                            errors.hora_entrada_programada ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.hora_entrada_programada && <p className="mt-1 text-sm text-red-600">{errors.hora_entrada_programada}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hora de Salida <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={data.hora_salida_programada}
                                        onChange={(e) => setData('hora_salida_programada', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                            errors.hora_salida_programada ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.hora_salida_programada && <p className="mt-1 text-sm text-red-600">{errors.hora_salida_programada}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Código de Barras
                                    </label>
                                    <input
                                        type="text"
                                        value={data.codigo_barras}
                                        onChange={(e) => setData('codigo_barras', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                            errors.codigo_barras ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Se generará automáticamente si se deja vacío"
                                    />
                                    {errors.codigo_barras && <p className="mt-1 text-sm text-red-600">{errors.codigo_barras}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Observaciones */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Observaciones</h2>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Observaciones Adicionales
                                </label>
                                <textarea
                                    value={data.observaciones}
                                    onChange={(e) => setData('observaciones', e.target.value)}
                                    rows={4}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none ${
                                        errors.observaciones ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Notas adicionales sobre el instructor..."
                                />
                                {errors.observaciones && <p className="mt-1 text-sm text-red-600">{errors.observaciones}</p>}
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex items-center justify-end gap-4 pt-6">
                            <Link
                                href={`/admin/instructores/${instructor.id}`}
                                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                <X size={18} />
                                Cancelar
                            </Link>
                            
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50"
                            >
                                <Save size={18} />
                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}