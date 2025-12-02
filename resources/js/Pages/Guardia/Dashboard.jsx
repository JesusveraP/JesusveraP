import { useState } from 'react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Search, X, TrendingUp, Users, Clock, AlertCircle, Info, Shield, Zap, Globe, Laptop, Plus, Trash2 } from 'lucide-react';

export default function GuardiaDashboard({ auth, instructores = [], registros = [], notificaciones = [] }) {
    const [filtros, setFiltros] = useState({
        busqueda: '',
        filtroHora: '',
        filtroInstructor: '',
        filtroAsistencia: ''
    });

    const [mostrarModalPuertas, setMostrarModalPuertas] = useState(false);
    const [puertaSeleccionada, setPuertaSeleccionada] = useState('');
    const [horarioSeleccionado, setHorarioSeleccionado] = useState('mañana');
    const [registrosData] = useState(registros);
    const [notificacionesActivas, setNotificacionesActivas] = useState(notificaciones || []);
    const [mostrarAcercaDe, setMostrarAcercaDe] = useState(false);

    // Estado para control de portátiles
    const [registrosPortatiles, setRegistrosPortatiles] = useState([]);
    const [formPortatil, setFormPortatil] = useState({
        nombre: '',
        instructorId: '',
        tipo: 'profesor', // profesor, aprendiz, estructura
        tipoEquipo: 'portatil', // portatil, tablet, otro
        numeroEquipo: '',
        fechaEntrada: new Date().toISOString().split('T')[0],
        horaEntrada: new Date().toTimeString().slice(0, 5),
        estado: 'entrada' // entrada, salida
    });
    const [editandoId, setEditandoId] = useState(null);

    // Obtener información del instructor seleccionado
    const instructorSeleccionado = instructores.find(i => i.id == formPortatil.instructorId);

    // Calcular estadísticas en tiempo real
    const estadisticas = {
        totalRegistros: registrosData.length,
        puntualidades: registrosData.filter(r => r.asistencia === 'Puntualidad').length,
        tardanzas: registrosData.filter(r => r.asistencia === 'Tarde').length,
        ausencias: registrosData.filter(r => r.asistencia === 'Ausente').length,
        instructoresUnicos: new Set(registrosData.map(r => r.instructor)).size
    };

    // Obtener lista única de instructores que tienen registros
    const instructoresConRegistros = Array.from(new Set(registrosData.map(r => r.instructor)))
        .filter(nombre => nombre && nombre.trim() !== '')
        .sort();

    // Filtrar registros según criterios
    const registrosFiltrados = registrosData.filter(registro => {
        // Filtro de búsqueda por nombre o área
        const cumpleBusqueda = !filtros.busqueda || 
            registro.instructor.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            registro.area.toLowerCase().includes(filtros.busqueda.toLowerCase());
        
        // Filtro por instructor exacto
        const cumpleInstructor = !filtros.filtroInstructor || 
            registro.instructor === filtros.filtroInstructor;
        
        // Filtro por hora - compara la hora de entrada
        let cumpleHora = true;
        if (filtros.filtroHora) {
            try {
                const horaRegistro = registro.horaEntrada.substring(0, 2);
                const horaFiltro = filtros.filtroHora.substring(0, 2);
                cumpleHora = horaRegistro === horaFiltro;
            } catch (e) {
                cumpleHora = false;
            }
        }
        
        // Filtro por estado de asistencia
        const cumpleAsistencia = !filtros.filtroAsistencia || 
            registro.asistencia === filtros.filtroAsistencia;

        return cumpleBusqueda && cumpleInstructor && cumpleHora && cumpleAsistencia;
    });

    const abrirModalPuertas = () => {
        setMostrarModalPuertas(true);
    };

    const cerrarModalPuertas = () => {
        setMostrarModalPuertas(false);
        setPuertaSeleccionada('');
        setHorarioSeleccionado('mañana');
    };

    const guardarConfiguracionPuertas = () => {
        if (!puertaSeleccionada) {
            alert('Por favor selecciona una puerta');
            return;
        }

        console.log('Configuración guardada:', {
            puerta: puertaSeleccionada,
            horario: horarioSeleccionado
        });

        alert('Configuración de puerta guardada exitosamente');
        cerrarModalPuertas();
    };

    return (
        <SidebarLayout
            title="Historial de Instructores - SENA"
            header={
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800">Historial de instructores</h1>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={abrirModalPuertas}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Puertas
                        </button>

                        <div className="text-sm text-gray-600">
                            Vigilante activo: <span className="font-medium">{auth.user.name}</span>
                        </div>
                    </div>
                </div>
            }
        >
            {/* Notificaciones dinámicas */}
            {notificacionesActivas.length > 0 && (
                <div className="p-6 pb-0">
                    <div className="flex flex-col gap-2 max-w-md">
                        {notificacionesActivas.map((notificacion) => (
                            <div key={notificacion.id} className={`px-4 py-2 rounded-lg text-sm text-white flex items-center justify-between ${
                                notificacion.tipo === 'tarde' ? 'bg-yellow-600' :
                                notificacion.tipo === 'ausencia' ? 'bg-red-600' :
                                notificacion.tipo === 'entrada' ? 'bg-green-600' :
                                'bg-blue-900'
                            }`}>
                                <span>{notificacion.mensaje}</span>
                                <button 
                                    onClick={() => setNotificacionesActivas(prev => prev.filter(n => n.id !== notificacion.id))}
                                    className="ml-2 text-white hover:text-gray-200"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-8">
                {/* Tarjetas de estadísticas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Registros</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">{estadisticas.totalRegistros}</p>
                            </div>
                            <TrendingUp className="text-green-600" size={32} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Puntualidades</p>
                                <p className="text-3xl font-bold text-blue-600 mt-2">{estadisticas.puntualidades}</p>
                            </div>
                            <Users className="text-blue-600" size={32} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Tardanzas</p>
                                <p className="text-3xl font-bold text-yellow-600 mt-2">{estadisticas.tardanzas}</p>
                            </div>
                            <Clock className="text-yellow-600" size={32} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Ausencias</p>
                                <p className="text-3xl font-bold text-red-600 mt-2">{estadisticas.ausencias}</p>
                            </div>
                            <AlertCircle className="text-red-600" size={32} />
                        </div>
                    </div>
                </div>

                {/* Barra de búsqueda y filtros */}
                <div className="mb-6 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o área"
                            value={filtros.busqueda}
                            onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <select
                            value={filtros.filtroHora}
                            onChange={(e) => setFiltros({...filtros, filtroHora: e.target.value})}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="">Filtrar por hora</option>
                            <option value="06:00">🕐 06:00 AM</option>
                            <option value="07:00">🕐 07:00 AM</option>
                            <option value="08:00">🕐 08:00 AM</option>
                        </select>

                        <select
                            value={filtros.filtroInstructor}
                            onChange={(e) => setFiltros({...filtros, filtroInstructor: e.target.value})}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="">Filtrar por Instructor</option>
                            {instructoresConRegistros.map((nombreInstructor, idx) => (
                                <option key={idx} value={nombreInstructor}>
                                    👨‍🏫 {nombreInstructor}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filtros.filtroAsistencia}
                            onChange={(e) => setFiltros({...filtros, filtroAsistencia: e.target.value})}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="">Filtrar por Asistencia</option>
                            <option value="Puntualidad">✅ Puntualidad</option>
                            <option value="Tarde">⏰ Tarde</option>
                            <option value="Ausente">❌ Ausente</option>
                        </select>
                    </div>

                    {/* Mostrar filtros activos */}
                    {(filtros.busqueda || filtros.filtroHora || filtros.filtroInstructor || filtros.filtroAsistencia) && (
                        <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
                            <span className="text-sm text-blue-800">
                                Mostrando {registrosFiltrados.length} de {registrosData.length} registros
                            </span>
                            <button
                                onClick={() => setFiltros({
                                    busqueda: '',
                                    filtroHora: '',
                                    filtroInstructor: '',
                                    filtroAsistencia: ''
                                })}
                                className="text-sm text-blue-600 hover:text-blue-800 underline"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </div>

                {/* Tabla de historial */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-green-600 text-white">
                        <div className="grid grid-cols-6 gap-4 px-6 py-4 font-medium">
                            <div>Instructor</div>
                            <div>Área/Materia</div>
                            <div>Fecha</div>
                            <div>Hora Entrada</div>
                            <div>Hora Salida</div>
                            <div>Asistencia</div>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {registrosFiltrados.length > 0 ? (
                            registrosFiltrados.map((registro) => (
                                <div key={registro.id} className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="font-medium text-gray-900">{registro.instructor}</div>
                                    <div className="text-gray-700">{registro.area}</div>
                                    <div className="text-gray-700">{registro.fecha}</div>
                                    <div className="text-gray-700 font-mono">{registro.horaEntrada}</div>
                                    <div className="text-gray-700 font-mono">{registro.horaSalida}</div>
                                    <div>
                                        <span className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${
                                            registro.asistencia === 'Puntualidad' ? 'bg-green-600' :
                                            registro.asistencia === 'Tarde' ? 'bg-yellow-600' :
                                            'bg-red-600'
                                        }`}>
                                            {registro.asistencia}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-12 text-center text-gray-500">
                                <p className="text-lg">No hay registros que coincidan con los filtros</p>
                                <p className="text-sm mt-2">Intenta cambiar los criterios de búsqueda</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 text-sm text-gray-600">
                    <p>Total: <strong>{registrosFiltrados.length}</strong> de <strong>{registrosData.length}</strong> registros</p>
                </div>

                {/* ====== NUEVA SECCIÓN: CONTROL DE PORTÁTILES ====== */}
                <div className="mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 flex items-center gap-3">
                        <Laptop size={28} />
                        <h2 className="text-2xl font-bold">Control de Entrada/Salida de Equipos</h2>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Formulario de registro */}
                        <div className="bg-white p-6 rounded-lg border border-gray-300">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">📝 Registrar Equipo</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Seleccionar Instructor */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre Completo
                                    </label>
                                    <select
                                        value={formPortatil.instructorId}
                                        onChange={(e) => {
                                            const instructor = instructores.find(i => i.id == e.target.value);
                                            setFormPortatil({
                                                ...formPortatil,
                                                instructorId: e.target.value,
                                                nombre: instructor?.name || ''
                                            });
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                    >
                                        <option value="">-- Selecciona un instructor --</option>
                                        {instructores && instructores.length > 0 ? (
                                            instructores.map((instructor) => (
                                                <option key={instructor.id} value={instructor.id}>
                                                    {instructor.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>No hay instructores disponibles</option>
                                        )}
                                    </select>
                                </div>

                                {/* Información del instructor seleccionado */}
                                {instructorSeleccionado && (
                                    <div className="col-span-1 md:col-span-2 bg-white p-3 rounded-lg border-2 border-green-500">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold text-green-700">👤 Instructor:</span> {instructorSeleccionado.name}
                                        </p>
                                        {instructorSeleccionado.area && (
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold text-green-700">📚 Área:</span> {instructorSeleccionado.area}
                                            </p>
                                        )}
                                        {instructorSeleccionado.email && (
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold text-green-700">📧 Email:</span> {instructorSeleccionado.email}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Tipo de persona */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo
                                    </label>
                                    <select
                                        value={formPortatil.tipo}
                                        onChange={(e) => setFormPortatil({...formPortatil, tipo: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                    >
                                        <option value="profesor">👨‍🏫 Profesor</option>
                                        <option value="aprendiz">👨‍🎓 Aprendiz</option>
                                        <option value="estructura">🏢 Estructura</option>
                                    </select>
                                </div>

                                {/* Tipo de equipo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo de Equipo
                                    </label>
                                    <select
                                        value={formPortatil.tipoEquipo}
                                        onChange={(e) => setFormPortatil({...formPortatil, tipoEquipo: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                    >
                                        <option value="portatil">💻 Portátil</option>
                                        <option value="tablet">📱 Tablet</option>
                                        <option value="otro">⚙️ Otro</option>
                                    </select>
                                </div>

                                {/* Número de equipo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Número/Serial del Equipo
                                    </label>
                                    <input
                                        type="text"
                                        value={formPortatil.numeroEquipo}
                                        onChange={(e) => setFormPortatil({...formPortatil, numeroEquipo: e.target.value})}
                                        placeholder="Ej: LAP-001"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                    />
                                </div>

                                {/* Fecha */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha
                                    </label>
                                    <input
                                        type="date"
                                        value={formPortatil.fechaEntrada}
                                        onChange={(e) => setFormPortatil({...formPortatil, fechaEntrada: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                    />
                                </div>

                                {/* Hora */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Hora
                                    </label>
                                    <input
                                        type="time"
                                        value={formPortatil.horaEntrada}
                                        onChange={(e) => setFormPortatil({...formPortatil, horaEntrada: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                    />
                                </div>

                                {/* Estado */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Estado
                                    </label>
                                    <select
                                        value={formPortatil.estado}
                                        onChange={(e) => setFormPortatil({...formPortatil, estado: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                    >
                                        <option value="entrada">🔓 Entrada</option>
                                        <option value="salida">🔒 Salida</option>
                                    </select>
                                </div>

                                {/* Botón Agregar */}
                                <div className="flex items-end">
                                    <button
                                        onClick={() => {
                                            if (!formPortatil.nombre || !formPortatil.numeroEquipo) {
                                                alert('Por favor completa todos los campos');
                                                return;
                                            }
                                            const nuevoRegistro = {
                                                id: Date.now(),
                                                ...formPortatil
                                            };
                                            setRegistrosPortatiles([nuevoRegistro, ...registrosPortatiles]);
                                            setFormPortatil({
                                                nombre: '',
                                                instructorId: '',
                                                tipo: 'profesor',
                                                tipoEquipo: 'portatil',
                                                numeroEquipo: '',
                                                fechaEntrada: new Date().toISOString().split('T')[0],
                                                horaEntrada: new Date().toTimeString().slice(0, 5),
                                                estado: 'entrada'
                                            });
                                        }}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Plus size={18} />
                                        Registrar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tabla de registros */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-purple-100 border-b-2 border-purple-600">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Nombre</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Tipo</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Equipo</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Serial</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Fecha</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Hora</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Estado</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-purple-900">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {registrosPortatiles.length > 0 ? (
                                        registrosPortatiles.map((registro) => (
                                            <tr key={registro.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-gray-900">{registro.nombre}</td>
                                                <td className="px-4 py-3 text-gray-700">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        registro.tipo === 'profesor' ? 'bg-blue-100 text-blue-800' :
                                                        registro.tipo === 'aprendiz' ? 'bg-green-100 text-green-800' :
                                                        'bg-orange-100 text-orange-800'
                                                    }`}>
                                                        {registro.tipo === 'profesor' ? '👨‍🏫 Profesor' :
                                                         registro.tipo === 'aprendiz' ? '👨‍🎓 Aprendiz' :
                                                         '🏢 Estructura'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-700">
                                                    {registro.tipoEquipo === 'portatil' ? '💻 Portátil' :
                                                     registro.tipoEquipo === 'tablet' ? '📱 Tablet' :
                                                     '⚙️ Otro'}
                                                </td>
                                                <td className="px-4 py-3 font-mono text-gray-700 text-sm">{registro.numeroEquipo}</td>
                                                <td className="px-4 py-3 text-gray-700">{registro.fechaEntrada}</td>
                                                <td className="px-4 py-3 font-mono text-gray-700">{registro.horaEntrada}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                                                        registro.estado === 'entrada' ? 'bg-green-600' : 'bg-red-600'
                                                    }`}>
                                                        {registro.estado === 'entrada' ? '🔓 Entrada' : '🔒 Salida'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => setRegistrosPortatiles(registrosPortatiles.filter(r => r.id !== registro.id))}
                                                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                                                <Laptop size={32} className="mx-auto mb-2 text-gray-400" />
                                                <p className="font-medium">No hay registros de equipos</p>
                                                <p className="text-sm">Comienza a registrar equipos que entren o salgan</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Resumen */}
                        {registrosPortatiles.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">Total Registros</p>
                                    <p className="text-2xl font-bold text-purple-600">{registrosPortatiles.length}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">Entradas</p>
                                    <p className="text-2xl font-bold text-green-600">{registrosPortatiles.filter(r => r.estado === 'entrada').length}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">Salidas</p>
                                    <p className="text-2xl font-bold text-red-600">{registrosPortatiles.filter(r => r.estado === 'salida').length}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">Equipos en Institución</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {registrosPortatiles.filter(r => r.estado === 'entrada').length - registrosPortatiles.filter(r => r.estado === 'salida').length}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Modal de Selección de Puertas */}
            {mostrarModalPuertas && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-green-600 rounded-lg p-8 max-w-md w-full mx-4 relative">
                        <h2 className="text-white text-2xl font-bold text-center mb-8">
                            Seleccionar puerta
                        </h2>

                        <div className="space-y-4 mb-6">
                            <button
                                onClick={() => setPuertaSeleccionada('superior')}
                                className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-colors ${
                                    puertaSeleccionada === 'superior' 
                                        ? 'bg-blue-900' 
                                        : 'bg-blue-700 hover:bg-blue-800'
                                }`}
                            >
                                Puerta superior
                            </button>

                            <button
                                onClick={() => setPuertaSeleccionada('inferior')}
                                className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-colors ${
                                    puertaSeleccionada === 'inferior' 
                                        ? 'bg-blue-900' 
                                        : 'bg-blue-700 hover:bg-blue-800'
                                }`}
                            >
                                Puerta inferior
                            </button>
                        </div>

                        <div className="mb-6">
                            <select
                                value={horarioSeleccionado}
                                onChange={(e) => setHorarioSeleccionado(e.target.value)}
                                className="w-full py-3 px-4 rounded-lg border-0 text-gray-700 font-medium"
                            >
                                <option value="mañana">🌅 Mañana - 06:00 AM a 06:00 PM</option>
                                <option value="noche">🌙 Noche - 06:00 PM a 06:00 AM</option>
                            </select>
                        </div>

                        <button
                            onClick={guardarConfiguracionPuertas}
                            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                            Guardar
                        </button>

                        <button
                            onClick={cerrarModalPuertas}
                            className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Sección Acerca de */}
            <div className="mt-12 p-8 bg-gray-100 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Acerca de</h2>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <Info className="text-blue-600" size={24} />
                        <p className="ml-3 text-gray-700">Este sistema permite gestionar y monitorear el historial de asistencia de los instructores del SENA.</p>
                    </div>
                    <div className="flex items-center">
                        <Shield className="text-green-600" size={24} />
                        <p className="ml-3 text-gray-700">Características principales: registro de entradas y salidas, notificaciones en tiempo real, y estadísticas detalladas.</p>
                    </div>
                    <div className="flex items-center">
                        <Zap className="text-yellow-600" size={24} />
                        <p className="ml-3 text-gray-700">Desarrollado con las últimas tecnologías para garantizar un rendimiento óptimo y una experiencia de usuario fluida.</p>
                    </div>
                    <div className="flex items-center">
                        <Globe className="text-red-600" size={24} />
                        <p className="ml-3 text-gray-700">Para más información, visita nuestro sitio web o contáctanos a través de nuestras redes sociales.</p>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}