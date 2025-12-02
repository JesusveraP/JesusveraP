import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, User, Mail, Phone, Building, Calendar, Clock, BarChart3, MapPin, FileText } from 'lucide-react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function Show({ instructor }) {
    const formatearFecha = (fecha) => {
        if (!fecha) return 'N/A';
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatearHora = (hora) => {
        if (!hora) return 'N/A';
        return hora;
    };

    const estadoBadge = (estado) => {
        const colores = {
            activo: 'bg-green-100 text-green-800',
            inactivo: 'bg-gray-100 text-gray-800',
            suspendido: 'bg-red-100 text-red-800'
        };
        return colores[estado] || 'bg-gray-100 text-gray-800';
    };

    if (!instructor || !instructor.nombres || !instructor.apellidos) {
        return (
            <SidebarLayout title="Instructor - SENA">
                <div className="p-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h2 className="text-lg font-bold text-red-800 mb-2">Error: Datos Incompletos</h2>
                        <p className="text-red-700 mb-4">
                            No se pudieron cargar los datos completos del instructor. Por favor, intenta nuevamente.
                        </p>
                        <p className="text-red-600 text-sm mb-4">
                            Datos recibidos: {JSON.stringify(instructor, null, 2)}
                        </p>
                        <Link
                            href="/admin/instructores"
                            className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
                        >
                            Volver a la lista de instructores
                        </Link>
                    </div>
                </div>
            </SidebarLayout>
        );
    }

    return (
        <SidebarLayout
            title={`${instructor.nombres} ${instructor.apellidos} - SENA`}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/instructores"
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {instructor.nombres} {instructor.apellidos}
                        </h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${estadoBadge(instructor.estado)}`}>
                            {instructor.estado?.charAt(0).toUpperCase() + instructor.estado?.slice(1)}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/admin/instructores/${instructor.id}/edit`}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg"
                        >
                            Editar Instructor
                        </Link>
                    </div>
                </div>
            }
        >
            {/* Contenido principal */}
            <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Información Personal */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <User className="text-green-600" size={24} />
                            Información Personal
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1">Nombres</label>
                                <p className="text-gray-900 font-medium">{instructor.nombres}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1">Apellidos</label>
                                <p className="text-gray-900 font-medium">{instructor.apellidos}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1">Documento</label>
                                <p className="text-gray-900">{instructor.tipo_documento}: {instructor.documento_identidad}</p>
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                                    <Mail size={16} />
                                    Correo Electrónico
                                </label>
                                <p className="text-gray-900">{instructor.email}</p>
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                                    <Phone size={16} />
                                    Teléfono
                                </label>
                                <p className="text-gray-900">{instructor.telefono || 'No registrado'}</p>
                            </div>

                            {instructor.direccion && (
                                <div>
                                    <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                                        <MapPin size={16} />
                                        Dirección
                                    </label>
                                    <p className="text-gray-900">{instructor.direccion}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Información Laboral */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Building className="text-blue-600" size={24} />
                            Información Laboral
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1">Código de Instructor</label>
                                <p className="text-gray-900 font-mono font-medium">{instructor.codigo_instructor}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1">Área Asignada</label>
                                <p className="text-gray-900 font-medium">{instructor.area_asignada}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1">Cargo</label>
                                <p className="text-gray-900">{instructor.cargo || 'Instructor'}</p>
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                                    <Calendar size={16} />
                                    Fecha de Ingreso
                                </label>
                                <p className="text-gray-900">{formatearFecha(instructor.fecha_ingreso)}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                                        <Clock size={16} />
                                        Entrada
                                    </label>
                                    <p className="text-gray-900">{formatearHora(instructor.hora_entrada_programada)}</p>
                                </div>
                                <div>
                                    <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                                        <Clock size={16} />
                                        Salida
                                    </label>
                                    <p className="text-gray-900">{formatearHora(instructor.hora_salida_programada)}</p>
                                </div>
                            </div>

                            {instructor.codigo_barras && (
                                <div>
                                    <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                                        <BarChart3 size={16} />
                                        Código de Barras
                                    </label>
                                    <p className="text-gray-900 font-mono text-sm">{instructor.codigo_barras}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Información Adicional */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FileText className="text-purple-600" size={24} />
                            Información Adicional
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1">Estado</label>
                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${estadoBadge(instructor.estado)}`}>
                                    {instructor.estado?.charAt(0).toUpperCase() + instructor.estado?.slice(1)}
                                </span>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1">Fecha de Registro</label>
                                <p className="text-gray-900">{formatearFecha(instructor.created_at)}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1">Última Actualización</label>
                                <p className="text-gray-900">{formatearFecha(instructor.updated_at)}</p>
                            </div>

                            {instructor.observaciones && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600 mb-1">Observaciones</label>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-gray-900 text-sm leading-relaxed">{instructor.observaciones}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Historial de Asistencias Recientes */}
                {instructor.asistencias && instructor.asistencias.length > 0 && (
                    <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Asistencias Recientes</h2>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Hora</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Tipo</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {instructor.asistencias.map((asistencia) => (
                                        <tr key={asistencia.id} className="border-b border-gray-100">
                                            <td className="py-3 px-4">{formatearFecha(asistencia.fecha_hora_registro)}</td>
                                            <td className="py-3 px-4">{new Date(asistencia.fecha_hora_registro).toLocaleTimeString('es-ES')}</td>
                                            <td className="py-3 px-4">{asistencia.tipo_movimiento}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    asistencia.es_tardanza ? 'bg-yellow-100 text-yellow-800' : 
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {asistencia.es_tardanza ? 'Tarde' : 'Puntual'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}