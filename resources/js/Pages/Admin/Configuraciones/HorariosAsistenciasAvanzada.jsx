import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Clock, Plus, Edit, Trash2, ArrowLeft, Save, X } from 'lucide-react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function HorariosAsistenciasAvanzada({ horarios = [] }) {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [horarioEditando, setHorarioEditando] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: '',
        hora_inicio: '',
        hora_fin: '',
        tolerancia_minutos: 5,
        descripcion: ''
    });

    const crearHorario = (e) => {
        e.preventDefault();
        post(route('admin.horarios.store'), {
            onSuccess: () => {
                reset();
                setMostrarFormulario(false);
            }
        });
    };

    const editarHorario = (horario) => {
        setHorarioEditando(horario);
        setData({
            nombre: horario.nombre,
            hora_inicio: horario.hora_inicio,
            hora_fin: horario.hora_fin,
            tolerancia_minutos: horario.tolerancia_minutos,
            descripcion: horario.descripcion || ''
        });
        setMostrarFormulario(true);
    };

    const actualizarHorario = (e) => {
        e.preventDefault();
        put(route('admin.horarios.update', horarioEditando.id), {
            onSuccess: () => {
                reset();
                setMostrarFormulario(false);
                setHorarioEditando(null);
            }
        });
    };

    const eliminarHorario = (horario) => {
        if (confirm(`¿Estás seguro de que deseas eliminar el horario "${horario.nombre}"?`)) {
            // Implementar eliminación
            console.log('Eliminar horario:', horario.id);
        }
    };

    const cancelarFormulario = () => {
        reset();
        setMostrarFormulario(false);
        setHorarioEditando(null);
    };

    return (
        <SidebarLayout
            title="Configuración Avanzada - Horarios y Asistencias"
            header={
                <div className="flex items-center gap-4">
                    <Link 
                        href={route('admin.configuraciones')}
                        className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Configuración Avanzada de Horarios</h1>
                        <p className="text-gray-600 mt-1">Gestiona los horarios de trabajo y tolerancias</p>
                    </div>
                </div>
            }
        >
            <div className="max-w-7xl mx-auto">
                {/* Botón para agregar nuevo horario */}
                {!mostrarFormulario && (
                    <button
                        onClick={() => setMostrarFormulario(true)}
                        className="mb-6 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        <Plus size={20} />
                        Agregar Nuevo Horario
                    </button>
                )}

                {/* Formulario de crear/editar horario */}
                {mostrarFormulario && (
                    <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            {horarioEditando ? 'Editar Horario' : 'Crear Nuevo Horario'}
                        </h2>

                        <form onSubmit={horarioEditando ? actualizarHorario : crearHorario} className="space-y-4">
                            {/* Nombre del horario */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del Horario
                                </label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder="Ej: Turno Mañana"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                                {errors.nombre && <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>}
                            </div>

                            {/* Hora de inicio */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hora de Inicio
                                    </label>
                                    <input
                                        type="time"
                                        value={data.hora_inicio}
                                        onChange={(e) => setData('hora_inicio', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                    {errors.hora_inicio && <p className="text-red-600 text-sm mt-1">{errors.hora_inicio}</p>}
                                </div>

                                {/* Hora de fin */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hora de Fin
                                    </label>
                                    <input
                                        type="time"
                                        value={data.hora_fin}
                                        onChange={(e) => setData('hora_fin', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                    {errors.hora_fin && <p className="text-red-600 text-sm mt-1">{errors.hora_fin}</p>}
                                </div>
                            </div>

                            {/* Tolerancia en minutos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tolerancia de Retraso (minutos)
                                </label>
                                <input
                                    type="number"
                                    value={data.tolerancia_minutos}
                                    onChange={(e) => setData('tolerancia_minutos', parseInt(e.target.value))}
                                    min="0"
                                    max="60"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Minutos permitidos de retraso sin registrar como tarde
                                </p>
                                {errors.tolerancia_minutos && <p className="text-red-600 text-sm mt-1">{errors.tolerancia_minutos}</p>}
                            </div>

                            {/* Descripción */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción (Opcional)
                                </label>
                                <textarea
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    placeholder="Descripción del horario..."
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            {/* Botones de acción */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    {horarioEditando ? 'Actualizar' : 'Crear'} Horario
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelarFormulario}
                                    className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
                                >
                                    <X size={18} />
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Lista de horarios */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Horarios Configurados</h2>
                    </div>

                    {horarios && horarios.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {horarios.map((horario) => (
                                <div key={horario.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Clock className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{horario.nombre}</h3>
                                                <p className="text-gray-600 mt-1">
                                                    ⏰ {horario.hora_inicio} - {horario.hora_fin}
                                                </p>
                                                {horario.descripcion && (
                                                    <p className="text-gray-500 text-sm mt-1">{horario.descripcion}</p>
                                                )}
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="inline-flex px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                                        Tolerancia: {horario.tolerancia_minutos} min
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => editarHorario(horario)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => eliminarHorario(horario)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-6 py-12 text-center">
                            <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-sm font-medium text-gray-900 mb-2">No hay horarios configurados</h3>
                            <p className="text-sm text-gray-500">
                                Crea el primer horario haciendo clic en el botón "Agregar Nuevo Horario"
                            </p>
                        </div>
                    )}
                </div>

                {/* Información útil */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Información Útil</h3>
                    <ul className="list-disc list-inside space-y-2 text-blue-800 text-sm">
                        <li>Los horarios definen los períodos de trabajo para los instructores</li>
                        <li>La tolerancia permite llegar unos minutos tarde sin registrar como retraso</li>
                        <li>Puedes crear múltiples horarios para diferentes turnos</li>
                        <li>Cada instructor puede ser asignado a un horario específico</li>
                    </ul>
                </div>
            </div>
        </SidebarLayout>
    );
}
