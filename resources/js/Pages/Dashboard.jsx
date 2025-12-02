import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head } from '@inertiajs/react';
import { Users, Shield, Clock, TrendingUp, Activity, UserCheck, AlertTriangle, Calendar } from 'lucide-react';

export default function Dashboard({ auth, stats, recentUsers, recentAsistencias, rolesDistribution, weeklyAsistencias, systemStatus }) {
    const StatCard = ({ icon: Icon, title, value, change, color, bgColor }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {change && (
                        <p className={`text-sm mt-2 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {change > 0 ? '+' : ''}{change}%
                        </p>
                    )}
                </div>
                <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </div>
        </div>
    );

    const ActivityItem = ({ activity }) => (
        <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.name}</p>
                <p className="text-sm text-gray-500">{activity.role} • {activity.created_at}</p>
            </div>
        </div>
    );

    const AsistenciaItem = ({ asistencia }) => (
        <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-green-600" />
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{asistencia.user_name}</p>
                <p className="text-sm text-gray-500">{asistencia.fecha} • {asistencia.hora_entrada}</p>
            </div>
        </div>
    );

    return (
        <SidebarLayout
            title="Dashboard"
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date().toLocaleDateString('es-ES')}</span>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Saludo personalizado */}
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm p-6 text-white">
                            <h1 className="text-2xl font-bold mb-2">
                                ¡Bienvenido de vuelta, {auth.user.name}!
                            </h1>
                            <p className="text-blue-100">
                                Aquí tienes un resumen de la actividad del sistema.
                            </p>
                        </div>
                    </div>

                    {/* Tarjetas de estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={Users}
                            title="Total Usuarios"
                            value={stats?.totalUsers || 0}
                            change={stats?.weekAsistencias > stats?.todayAsistencias ? 
                                Math.round(((stats.weekAsistencias - stats.todayAsistencias) / stats.todayAsistencias) * 100) : null}
                            color="text-blue-600"
                            bgColor="bg-blue-100"
                        />
                        <StatCard
                            icon={Shield}
                            title="Guardias Activos"
                            value={stats?.totalGuardias || 0}
                            color="text-yellow-600"
                            bgColor="bg-yellow-100"
                        />
                        <StatCard
                            icon={UserCheck}
                            title="Asistencias Hoy"
                            value={stats?.todayAsistencias || 0}
                            change={stats?.weekAsistencias > 0 ? 
                                Math.round(((stats.todayAsistencias / stats.weekAsistencias) * 100) - 100) : null}
                            color="text-green-600"
                            bgColor="bg-green-100"
                        />
                        <StatCard
                            icon={Activity}
                            title="Usuarios Activos"
                            value={stats?.activeUsers || 0}
                            color="text-purple-600"
                            bgColor="bg-purple-100"
                        />
                    </div>

                    {/* Contenido principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Gráfico de asistencias semanales */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Asistencias de la Semana</h3>
                                    <div className="flex space-x-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {systemStatus?.server_status === 'online' ? 'Sistema Activo' : 'Sistema Inactivo'}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Gráfico de barras */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-7 gap-2">
                                        {weeklyAsistencias && weeklyAsistencias.map((day, index) => (
                                            <div key={index} className="text-center">
                                                <div className="text-xs text-gray-500 mb-2">{day.day}</div>
                                                <div className="bg-gray-100 rounded-lg h-24 flex items-end justify-center relative">
                                                    <div 
                                                        className="bg-blue-600 rounded-t w-full transition-all duration-300" 
                                                        style={{ 
                                                            height: `${Math.max((day.count / Math.max(...weeklyAsistencias.map(d => d.count))) * 100, 10)}%` 
                                                        }}
                                                    ></div>
                                                    <span className="absolute bottom-1 text-xs text-white font-medium">
                                                        {day.count}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">{day.date}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Distribución de roles */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-4">Distribución de Roles</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Administradores</span>
                                            <span className="text-sm font-medium">{rolesDistribution?.admin || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Guardias</span>
                                            <span className="text-sm font-medium">{rolesDistribution?.guardia || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Usuarios</span>
                                            <span className="text-sm font-medium">{rolesDistribution?.user || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actividad reciente */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Usuarios Recientes</h3>
                                <div className="space-y-1">
                                    {recentUsers && recentUsers.length > 0 ? (
                                        recentUsers.map((user) => (
                                            <ActivityItem key={user.id} activity={user} />
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center py-4">No hay usuarios recientes</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Asistencias Recientes</h3>
                                <div className="space-y-1">
                                    {recentAsistencias && recentAsistencias.length > 0 ? (
                                        recentAsistencias.map((asistencia) => (
                                            <AsistenciaItem key={asistencia.id} asistencia={asistencia} />
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center py-4">No hay asistencias recientes</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Accesos rápidos */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Accesos Rápidos</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <a 
                                href={route('admin.users.index')} 
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                                <Users className="w-8 h-8 text-blue-600 group-hover:text-blue-700" />
                                <div className="ml-3">
                                    <p className="font-medium text-gray-900">Gestionar Usuarios</p>
                                    <p className="text-sm text-gray-500">{stats?.totalUsers || 0} usuarios totales</p>
                                </div>
                            </a>
                            <a 
                                href={route('admin.configuraciones')} 
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                                <Activity className="w-8 h-8 text-purple-600 group-hover:text-purple-700" />
                                <div className="ml-3">
                                    <p className="font-medium text-gray-900">Configuraciones</p>
                                    <p className="text-sm text-gray-500">Ajustes del sistema</p>
                                </div>
                            </a>
                            <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                                <Clock className="w-8 h-8 text-green-600 group-hover:text-green-700" />
                                <div className="ml-3">
                                    <p className="font-medium text-gray-900">Asistencias</p>
                                    <p className="text-sm text-gray-500">{stats?.todayAsistencias || 0} hoy</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                                <TrendingUp className="w-8 h-8 text-yellow-600 group-hover:text-yellow-700" />
                                <div className="ml-3">
                                    <p className="font-medium text-gray-900">Reportes</p>
                                    <p className="text-sm text-gray-500">Análisis y estadísticas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}