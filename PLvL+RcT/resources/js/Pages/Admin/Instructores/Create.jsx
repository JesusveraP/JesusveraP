import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, User, Mail, Phone, BookOpen, Hash, BarChart3, Calendar, Clock, MapPin, FileText } from 'lucide-react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function CreateInstructor() {
    const { data, setData, post, processing, errors } = useForm({
        nombres: '',
        apellidos: '',
        documento_identidad: '',
        tipo_documento: 'CC',
        email: '',
        telefono: '',
        area_asignada: '',
        cargo: '',
        codigo_barras: '',
        fecha_ingreso: '',
        hora_entrada_programada: '08:00',
        hora_salida_programada: '17:00',
        direccion: '',
        observaciones: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.instructores.store'));
    };

    return (
        <SidebarLayout
            title="Agregar Instructor - SENA"
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('admin.instructores.index')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft size={20} />
                        Volver a Instructores
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">Agregar Nuevo Instructor</h1>
                </div>
            }
        >
            {/* Formulario */}
            <div className="p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        {/* Logo SENA */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-green-600">Registro de Instructor</h2>
                            <p className="text-gray-600">Complete la información del nuevo instructor</p>
                        </div>

                        <form onSubmit={submit} className="space-y-8">
                            {/* Información Personal */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
                                
                                {/* Fila 1: Nombres y Apellidos */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombres <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                value={data.nombres}
                                                onChange={(e) => setData('nombres', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                                placeholder="Ingrese los nombres"
                                                required
                                            />
                                        </div>
                                        {errors.nombres && <div className="text-red-500 text-sm mt-1">{errors.nombres}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Apellidos <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                value={data.apellidos}
                                                onChange={(e) => setData('apellidos', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                                placeholder="Ingrese los apellidos"
                                                required
                                            />
                                        </div>
                                        {errors.apellidos && <div className="text-red-500 text-sm mt-1">{errors.apellidos}</div>}
                                    </div>
                                </div>

                                {/* Fila 2: Documento */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tipo de Documento <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.tipo_documento}
                                            onChange={(e) => setData('tipo_documento', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none bg-white"
                                            required
                                        >
                                            <option value="CC">Cédula de Ciudadanía</option>
                                            <option value="CE">Cédula de Extranjería</option>
                                            <option value="PA">Pasaporte</option>
                                            <option value="TI">Tarjeta de Identidad</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Número de Documento <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-3 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                value={data.documento_identidad}
                                                onChange={(e) => setData('documento_identidad', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                                placeholder="Número de documento"
                                                required
                                            />
                                        </div>
                                        {errors.documento_identidad && <div className="text-red-500 text-sm mt-1">{errors.documento_identidad}</div>}
                                    </div>
                                </div>

                                {/* Fila 3: Contacto */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Correo Electrónico <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                                placeholder="ejemplo@sena.edu.co"
                                                required
                                            />
                                        </div>
                                        {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Teléfono
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                value={data.telefono}
                                                onChange={(e) => setData('telefono', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                                placeholder="300 123 4567"
                                            />
                                        </div>
                                        {errors.telefono && <div className="text-red-500 text-sm mt-1">{errors.telefono}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Información Laboral */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Laboral</h3>
                                
                                {/* Fila 1: Área y Cargo */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Área Asignada <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <BookOpen className="absolute left-3 top-3 text-gray-400" size={20} />
                                            <select
                                                value={data.area_asignada}
                                                onChange={(e) => setData('area_asignada', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none bg-white"
                                                required
                                            >
                                                <option value="">Seleccione un área</option>
                                                <option value="Ciencias Duras">Ciencias Duras</option>
                                                <option value="Matemáticas">Matemáticas</option>
                                                <option value="Sistemas">Sistemas</option>
                                                <option value="Inglés">Inglés</option>
                                                <option value="Biología">Biología</option>
                                                <option value="Química">Química</option>
                                                <option value="Física">Física</option>
                                                <option value="Administración">Administración</option>
                                                <option value="Contabilidad">Contabilidad</option>
                                                <option value="Electrónica">Electrónica</option>
                                                <option value="Mecánica">Mecánica</option>
                                                <option value="Soldadura">Soldadura</option>
                                                <option value="Construcción">Construcción</option>
                                            </select>
                                        </div>
                                        {errors.area_asignada && <div className="text-red-500 text-sm mt-1">{errors.area_asignada}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cargo
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                value={data.cargo}
                                                onChange={(e) => setData('cargo', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                                placeholder="Instructor (por defecto)"
                                            />
                                        </div>
                                        {errors.cargo && <div className="text-red-500 text-sm mt-1">{errors.cargo}</div>}
                                    </div>
                                </div>

                                {/* Fila 2: Fecha de ingreso y horarios */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fecha de Ingreso <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                                            <input
                                                type="date"
                                                value={data.fecha_ingreso}
                                                onChange={(e) => setData('fecha_ingreso', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                                required
                                            />
                                        </div>
                                        {errors.fecha_ingreso && <div className="text-red-500 text-sm mt-1">{errors.fecha_ingreso}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hora de Entrada <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                                            <input
                                                type="time"
                                                value={data.hora_entrada_programada}
                                                onChange={(e) => setData('hora_entrada_programada', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                                required
                                            />
                                        </div>
                                        {errors.hora_entrada_programada && <div className="text-red-500 text-sm mt-1">{errors.hora_entrada_programada}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hora de Salida <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                                            <input
                                                type="time"
                                                value={data.hora_salida_programada}
                                                onChange={(e) => setData('hora_salida_programada', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                                required
                                            />
                                        </div>
                                        {errors.hora_salida_programada && <div className="text-red-500 text-sm mt-1">{errors.hora_salida_programada}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Información Adicional */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Adicional</h3>
                                
                                {/* Código de barras */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Código de Barras (Opcional)
                                    </label>
                                    <div className="relative">
                                        <BarChart3 className="absolute left-3 top-3 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            value={data.codigo_barras}
                                            onChange={(e) => setData('codigo_barras', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                            placeholder="Código de barras del instructor (se genera automáticamente si se deja vacío)"
                                        />
                                    </div>
                                    {errors.codigo_barras && <div className="text-red-500 text-sm mt-1">{errors.codigo_barras}</div>}
                                </div>

                                {/* Dirección */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Dirección
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            value={data.direccion}
                                            onChange={(e) => setData('direccion', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                            placeholder="Dirección de residencia"
                                        />
                                    </div>
                                    {errors.direccion && <div className="text-red-500 text-sm mt-1">{errors.direccion}</div>}
                                </div>

                                {/* Observaciones */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Observaciones
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                                        <textarea
                                            value={data.observaciones}
                                            onChange={(e) => setData('observaciones', e.target.value)}
                                            rows={4}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                                            placeholder="Observaciones adicionales sobre el instructor"
                                        ></textarea>
                                    </div>
                                    {errors.observaciones && <div className="text-red-500 text-sm mt-1">{errors.observaciones}</div>}
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <Link
                                    href={route('admin.instructores.index')}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition-colors"
                                >
                                    {processing ? 'Guardando...' : 'Guardar Instructor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}