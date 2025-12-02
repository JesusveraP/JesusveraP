import { useState } from "react";
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { UserCircle, Clock, XCircle, LogOut, ChevronLeft, ChevronRight, Calendar, Info, Shield, Zap, Globe } from "lucide-react";
import ThemeButton from '@/Components/ThemeButton';

export default function Dashboard({ auth, asistenciasStats = {}, instructores = [], historialReciente = [], chartData = {} }) {
  const { systemSettings, ziggy } = usePage().props;
  
  // Estado para paginación del historial
  const [currentPage, setCurrentPage] = useState(1);
  const [mostrarAcercaDe, setMostrarAcercaDe] = useState(false);
  const itemsPerPage = 10;
  
  // Usar historial reciente real de la base de datos o mostrar mensaje informativo
  const historialData = historialReciente && historialReciente.length > 0 ? historialReciente : [];
  
  // Calcular paginación
  const totalItems = historialData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = historialData.slice(startIndex, endIndex);

  // Funciones de paginación
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Extraer datos reales de los gráficos del backend
  const { asistenciasPorHora = {}, puntualidadData = {}, asistenciasUltimos7Dias = {} } = chartData;

  // Datos de ejemplo como respaldo si no hay datos reales
  const dataBarDefault = [
    { hora: "6 AM", asistencias: 10 },
    { hora: "12 PM", asistencias: 25 },
    { hora: "1 PM", asistencias: 30 },
    { hora: "6 PM", asistencias: 45 },
  ];

  const dataLineDefault = [
    { dia: "Lun", asistencias: 15 },
    { dia: "Mar", asistencias: 12 },
    { dia: "Mié", asistencias: 20 },
    { dia: "Jue", asistencias: 18 },
    { dia: "Vie", asistencias: 22 },
    { dia: "Sáb", asistencias: 26 },
    { dia: "Dom", asistencias: 30 },
  ];

  // Preparar datos para gráfico de barras (Asistencias por Hora)
  const dataBar = asistenciasPorHora.labels ? 
    asistenciasPorHora.labels.map((label, index) => ({
      hora: label,
      asistencias: asistenciasPorHora.datasets?.[0]?.data?.[index] || 0
    })) : dataBarDefault;

  // Preparar datos para gráfico de líneas (Últimos 7 días)
  const dataLine = asistenciasUltimos7Dias.labels ?
    asistenciasUltimos7Dias.labels.map((label, index) => ({
      dia: label,
      asistencias: asistenciasUltimos7Dias.datasets?.[0]?.data?.[index] || 0
    })) : dataLineDefault;

  // Calcular datos del gráfico circular basado en estadísticas reales
  const totalInstructores = asistenciasStats.total_instructores || 0;
  const presentesHoy = asistenciasStats.presentes_hoy || 0;
  const tardesHoy = asistenciasStats.llegadas_tarde || 0;
  const ausentesHoy = asistenciasStats.ausentes_hoy || 0;

  // Usar datos reales del backend o calcular como respaldo
  const dataPie = puntualidadData.datasets ? [
    { 
      name: "Puntuales", 
      value: puntualidadData.totals?.puntual || (presentesHoy - tardesHoy), 
      color: "#15803d" 
    },
    { 
      name: "Tarde", 
      value: puntualidadData.totals?.tarde || tardesHoy, 
      color: "#dc2626" 
    }
  ] : [
    { name: "Puntuales", value: Math.max(0, presentesHoy - tardesHoy), color: "#15803d" },
    { name: "Tarde", value: tardesHoy, color: "#dc2626" },
  ];

  // Agregar ausentes si hay
  if (ausentesHoy > 0) {
    dataPie.push({
      name: "Ausentes", 
      value: ausentesHoy, 
      color: "#6b7280" 
    });
  }

  return (
    <SidebarLayout
      title="Panel de Administración - SENA"
      header={
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Panel de Administración</h2>
            <p className="text-gray-600">Bienvenido, {auth.user.name}</p>
          </div>
          <div className="bg-gray-200 p-3 rounded-full">
            <UserCircle className="text-gray-700" size={30} />
          </div>
        </div>
      }
    >
      {/* Main content */}
      <div className="p-8">
        {/* Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-green-700 text-white rounded-xl p-5 text-center shadow">
            <UserCircle className="mx-auto mb-2" />
            <h3 className="text-2xl font-bold">{totalInstructores}</h3>
            <p>Instructores Registrados</p>
          </div>
          <div className="bg-slate-800 text-white rounded-xl p-5 text-center shadow">
            <Clock className="mx-auto mb-2" />
            <h3 className="text-2xl font-bold">{tardesHoy}</h3>
            <p>Llegadas tarde hoy</p>
          </div>
          <div className="bg-sky-300 text-gray-800 rounded-xl p-5 text-center shadow">
            <XCircle className="mx-auto mb-2" />
            <h3 className="text-2xl font-bold">{ausentesHoy}</h3>
            <p>Ausencias</p>
          </div>
        </div>

        {/* Mensaje informativo si no hay instructores */}
        {totalInstructores === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <UserCircle className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">No hay instructores registrados</h3>
                <p className="text-blue-700">
                  Para comenzar a usar el sistema, necesitas agregar instructores desde la sección 
                  <Link 
                    href={route('admin.instructores.index')} 
                    className="font-medium underline ml-1 hover:text-blue-800"
                  >
                    Instructores
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded-xl shadow">
            <h4 className="font-semibold mb-2 text-center">Asistencias por Hora</h4>
            <BarChart width={250} height={150} data={dataBar}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="asistencias" fill="#15803d" />
            </BarChart>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h4 className="font-semibold mb-2 text-center">Porcentaje de puntualidad</h4>
            <PieChart width={250} height={150}>
              <Pie data={dataPie} dataKey="value" outerRadius={50} label>
                {dataPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h4 className="font-semibold mb-2 text-center">Asistencias últimos 7 días</h4>
            <LineChart width={250} height={150} data={dataLine}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="asistencias" stroke="#15803d" dot />
            </LineChart>
          </div>
        </div>

        {/* Historial de Asistencias */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Historial de Asistencias</h3>
              <div className="text-sm text-gray-500">
                {totalItems} registros
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    INSTRUCTOR
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ÁREA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    FECHA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HORA ENTRADA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HORA SALIDA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ESTADO
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? currentItems.map((registro, index) => (
                  <tr key={registro.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {registro.instructor}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-600 font-medium">
                        {registro.area}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {registro.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {registro.horaEntrada || registro.hora_entrada || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {registro.horaSalida || registro.hora_salida || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        registro.estado === 'Completo' 
                          ? 'bg-gray-100 text-gray-800' 
                          : registro.estado === 'Tarde'
                          ? 'bg-yellow-100 text-yellow-800'
                          : registro.estado === 'Puntual'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {registro.estado}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-400 mb-2">
                          No hay registros de historial
                        </p>
                        <p className="text-sm text-gray-400">
                          Los registros de asistencia aparecerán aquí cuando haya datos disponibles.
                        </p>
                        <ThemeButton variant="primary" size="base" className="mt-4">
                          <Link href={route('admin.instructores.index')}>
                            Gestionar Instructores
                          </Link>
                        </ThemeButton>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginador */}
          {totalItems > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{startIndex + 1}</span> - <span className="font-medium">{Math.min(endIndex, totalItems)}</span> de{' '}
                  <span className="font-medium">{totalItems}</span> registros
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Botón anterior */}
                  <ThemeButton
                    variant="secondary"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </ThemeButton>

                  {/* Números de página */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                      // Mostrar solo algunas páginas alrededor de la actual
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <ThemeButton
                            key={pageNumber}
                            onClick={() => goToPage(pageNumber)}
                            variant={currentPage === pageNumber ? "primary" : "secondary"}
                            size="sm"
                          >
                            {pageNumber}
                          </ThemeButton>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span key={pageNumber} className="px-2 py-2 text-sm text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* Botón siguiente */}
                  <ThemeButton
                    variant="secondary"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </ThemeButton>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sección Acerca de */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Acerca de</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <Info className="text-blue-600 mt-1 mr-4 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold text-gray-800 mb-1">Acerca del Sistema</p>
                <p className="text-gray-700 text-sm">Sistema integral de gestión y monitoreo de asistencia de instructores del SENA, diseñado para optimizar procesos administrativos y mejorar la puntualidad.</p>
              </div>
            </div>

            <div className="flex items-start">
              <Shield className="text-green-600 mt-1 mr-4 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold text-gray-800 mb-1">Características Principales</p>
                <p className="text-gray-700 text-sm">Registro automático de entradas/salidas, notificaciones en tiempo real, reportes detallados, gráficas estadísticas, y gestión de roles con diferentes niveles de acceso.</p>
              </div>
            </div>

            <div className="flex items-start">
              <Zap className="text-yellow-600 mt-1 mr-4 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold text-gray-800 mb-1">Tecnología Moderna</p>
                <p className="text-gray-700 text-sm">Desarrollado con Laravel, React e Inertia.js. Garantiza rendimiento óptimo, seguridad de datos y una experiencia de usuario fluida y responsiva.</p>
              </div>
            </div>

            <div className="flex items-start">
              <Globe className="text-red-600 mt-1 mr-4 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold text-gray-800 mb-1">Soporte y Contacto</p>
                <p className="text-gray-700 text-sm">Para consultas técnicas, sugerencias o reportar problemas, ponte en contacto con el equipo de soporte del SENA.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-300">
            <p className="text-xs text-gray-600 text-center">
              © 2025 Sistema de Gestión de Asistencia SENA. Todos los derechos reservados. | Versión 1.0
            </p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
