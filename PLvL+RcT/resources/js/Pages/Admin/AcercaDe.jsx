import { Head, Link, usePage } from '@inertiajs/react';
import { Users, Code, Globe, Heart, Mail, Github } from 'lucide-react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import ThemeButton from '@/Components/ThemeButton';

export default function AcercaDe({ auth }) {
  const teamMembers = [
    {
      nombre: 'Equipo de Desarrollo SENA',
      rol: 'Desarrollo y Arquitectura',
      descripcion: 'Responsables del diseño e implementación del sistema',
      icon: Code
    },
    {
      nombre: 'Juan Carlos Rodríguez',
      rol: 'Líder de Proyecto',
      descripcion: 'Coordinación general y gestión del proyecto',
      icon: Users
    },
    {
      nombre: 'María González López',
      rol: 'Desarrolladora Frontend',
      descripcion: 'Interfaz de usuario y experiencia',
      icon: Globe
    },
    {
      nombre: 'Carlos Andrés Martínez',
      rol: 'Desarrollador Backend',
      descripcion: 'Lógica de negocio y base de datos',
      icon: Code
    }
  ];

  const features = [
    {
      title: 'Gestión de Asistencias',
      description: 'Control automático y preciso de entrada y salida de instructores con registro en tiempo real'
    },
    {
      title: 'Panel de Administración',
      description: 'Interfaz intuitiva para gestionar usuarios, instructores y vigilantes del sistema'
    },
    {
      title: 'Reportes y Estadísticas',
      description: 'Análisis detallado de asistencias con gráficos y exportación de datos'
    },
    {
      title: 'Sistema Seguro',
      description: 'Autenticación robusta y control de acceso basado en roles'
    },
    {
      title: 'Interfaz Responsive',
      description: 'Diseño adaptable que funciona en dispositivos móviles y de escritorio'
    },
    {
      title: 'Personalización',
      description: 'Configuraciones personalizables del sistema según necesidades de la institución'
    }
  ];

  return (
    <SidebarLayout
      title="Acerca De - Sistema de Asistencias SENA"
      header={
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Acerca De</h2>
            <p className="text-gray-600 mt-1">Sistema de Control de Asistencias SENA</p>
          </div>
          <Heart className="text-red-500" size={32} />
        </div>
      }
    >
      <div className="p-8 max-w-6xl mx-auto">
        {/* Sección Descripción */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mb-12 border border-green-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Bienvenido al Sistema de Asistencias</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Este sistema fue desarrollado para facilitar la gestión integral de asistencias en el SENA. 
            Proporciona un control automatizado y eficiente de entrada y salida de instructores, junto con 
            herramientas de administración y reportes detallados.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Nuestro objetivo es proporcionar una solución moderna, segura y fácil de usar que mejore 
            la productividad y organización institucional.
          </p>
        </div>

        {/* Sección Características */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Características Principales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-lg font-semibold text-green-700 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sección Equipo */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Nuestro Equipo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => {
              const IconComponent = member.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <IconComponent className="text-green-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800">{member.nombre}</h4>
                      <p className="text-sm font-medium text-green-600 mb-2">{member.rol}</p>
                      <p className="text-sm text-gray-600">{member.descripcion}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sección Tecnologías */}
        <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Tecnologías Utilizadas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Laravel', desc: 'Backend Framework' },
              { name: 'React', desc: 'Frontend Framework' },
              { name: 'Inertia.js', desc: 'SPA Framework' },
              { name: 'Tailwind CSS', desc: 'CSS Framework' },
              { name: 'SQLite', desc: 'Database' },
              { name: 'PHP 8.1+', desc: 'Programming Language' },
              { name: 'JavaScript ES6+', desc: 'Programming Language' },
              { name: 'RESTful API', desc: 'API Architecture' }
            ].map((tech, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg text-center border border-green-100">
                <p className="font-semibold text-gray-800 text-sm">{tech.name}</p>
                <p className="text-xs text-gray-600">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sección Información */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <Globe className="text-blue-600 mb-4" size={32} />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Accesible</h4>
            <p className="text-sm text-gray-600">
              Interfaz amigable y accesible desde cualquier navegador web moderno
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <Users className="text-green-600 mb-4" size={32} />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Colaborativo</h4>
            <p className="text-sm text-gray-600">
              Diseñado para facilitar la colaboración entre administradores y usuarios
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <Heart className="text-purple-600 mb-4" size={32} />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Confiable</h4>
            <p className="text-sm text-gray-600">
              Sistema robusto con medidas de seguridad y respaldo de datos
            </p>
          </div>
        </div>

        {/* Sección Footer */}
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Contacto y Soporte</h3>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-6">
            <div className="flex items-center gap-2 text-gray-700">
              <Mail size={20} className="text-green-600" />
              <span>soporte@sena.edu.co</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Github size={20} className="text-green-600" />
              <span>Proyecto SENA 2024</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Versión 1.0 | © 2024 Sistema de Asistencias SENA. Todos los derechos reservados.
          </p>
          <ThemeButton variant="primary" size="base">
            <Link href={route('admin.dashboard')}>
              Volver al Panel
            </Link>
          </ThemeButton>
        </div>
      </div>
    </SidebarLayout>
  );
}
