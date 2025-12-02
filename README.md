# Sistema de Registro de Instructores - Laravel + React

Un sistema completo de registro y control de asistencia de instructores diseñado para guardias de seguridad, construido con **Laravel 12** como backend y **React** con **Inertia.js** como frontend.

## 🚀 Características Principales

### ✅ Sistema de Autenticación por Roles
- **Administradores**: Gestión completa del sistema
- **Guardias de Seguridad**: Control de asistencia de instructores
- **Usuarios Regulares**: Acceso básico al dashboard

### ✅ Gestión de Instructores (Administradores)
- CRUD completo de instructores
- Registro con códigos de barras únicos
- Horarios programados de entrada y salida
- Gestión de estados (activo/inactivo/suspendido)
- Organización por áreas y cargos

### ✅ Control de Asistencia (Guardias)
- Registro automático mediante códigos de barras
- Detección automática de tardanzas y salidas anticipadas
- Control de turnos de guardias
- Historial completo de registros
- Notificaciones de novedades en tiempo real

### ✅ Panel de Administración Avanzado
- Dashboard con estadísticas en tiempo real
- Gestión de usuarios y roles
- Reportes de asistencia
- Control de turnos de guardias

## 🛠️ Tecnologías Utilizadas

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 18 + Inertia.js
- **Estilos**: Tailwind CSS
- **Base de Datos**: SQLite (configurable a MySQL/PostgreSQL)
- **Autenticación**: Laravel Breeze
- **Build Tool**: Vite

## 📦 Instalación

### Prerrequisitos
- PHP 8.2 o superior
- Composer
- Node.js 18+ y npm
- Extensiones PHP: sqlite, pdo_sqlite

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd PLvL+RcT
```

2. **Instalar dependencias de PHP**
```bash
composer install
```

3. **Instalar dependencias de Node.js**
```bash
npm install
```

4. **Configurar el archivo de entorno**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Ejecutar migraciones y seeders**
```bash
php artisan migrate:fresh --seed
```

6. **Compilar assets**
```bash
npm run build
# Para desarrollo: npm run dev
```

7. **Iniciar el servidor**
```bash
php artisan serve
```

## 👥 Usuarios de Prueba

### Administrador
- **Email**: admin@example.com
- **Contraseña**: admin123
- **Permisos**: Gestión completa del sistema

### Guardias de Seguridad
- **Guardia 1**: guardia1@seguridad.com / guardia123
- **Guardia 2**: guardia2@seguridad.com / guardia123
- **Permisos**: Registro de asistencia de instructores

### Instructores de Prueba
- **Carlos Rodríguez** - Código: 1234567890123 (Matemáticas)
- **Ana López** - Código: 2345678901234 (Ciencias)
- **José Martínez** - Código: 3456789012345 (Tecnología)
- **Lucía González** - Código: 4567890123456 (Idiomas)

## 🎯 Funcionalidades por Rol

### Para Administradores

#### Panel de Administración
- Estadísticas de usuarios totales por rol
- Usuarios registrados por período
- Gestión completa de usuarios y guardias
- Configuración del sistema

#### Gestión de Instructores
- **Crear instructores**: Formulario completo con validación
- **Códigos de barras**: Generación automática de códigos únicos
- **Horarios**: Configuración de entrada y salida programada
- **Estados**: Control de activo/inactivo/suspendido
- **Organización**: Por áreas (Matemáticas, Ciencias, Tecnología, etc.)

### Para Guardias de Seguridad

#### Control de Turnos
- **Iniciar turno**: Marcar inicio de jornada laboral
- **Finalizar turno**: Registrar fin de turno con tiempo total
- **Control de ubicación**: Asignación de punto de control

#### Registro de Asistencia
- **Lectura de códigos**: Escaneo rápido de carnés de instructores
- **Detección automática**: Entrada vs. Salida según último registro
- **Validación de horarios**: Identificación automática de tardanzas
- **Alertas**: Notificaciones de salidas anticipadas
- **Ubicación**: Registro del punto donde se hizo el control

#### Dashboard de Guardia
- Instructores actualmente presentes
- Registros del día actual
- Novedades pendientes de revisión
- Estado del turno actual

### Para Instructores (Registro Pasivo)
- **Carné con código de barras**: Identificación única
- **Horarios programados**: Entrada y salida establecida
- **Historial personal**: Registro completo de asistencias

## 🗂️ Estructura del Sistema

```
├── app/
│   ├── Http/Controllers/
│   │   ├── Admin/
│   │   │   ├── AdminController.php      # Dashboard administrativo
│   │   │   └── UserController.php       # Gestión de usuarios
│   │   ├── InstructorController.php     # CRUD de instructores
│   │   └── AsistenciaController.php     # Control de asistencia
│   ├── Http/Middleware/
│   │   ├── EnsureUserIsAdmin.php        # Middleware admin
│   │   └── EnsureUserIsGuardia.php      # Middleware guardia
│   └── Models/
│       ├── User.php                     # Usuarios con roles
│       ├── Instructor.php               # Datos de instructores
│       └── Asistencia.php               # Registros de entrada/salida
├── database/
│   ├── migrations/
│   │   ├── *_create_instructors_table.php
│   │   ├── *_create_asistencias_table.php
│   │   └── *_update_users_table_add_guardia_role.php
│   └── seeders/
│       ├── AdminUserSeeder.php          # Usuarios admin
│       └── InstructorSeeder.php         # Instructores y guardias
└── resources/js/
    ├── Layouts/
    │   └── AuthenticatedLayout.jsx      # Navegación por roles
    └── Pages/
        ├── Admin/                       # Vistas administrativas
        ├── Instructores/                # Gestión de instructores
        └── Guardia/                     # Control de asistencia
```

## 🔐 Sistema de Roles y Permisos

### Administrador (`admin`)
- Acceso completo al sistema
- Gestión de instructores y usuarios
- Creación de guardias de seguridad
- Visualización de reportes completos
- Configuración del sistema

### Guardia de Seguridad (`guardia`)
- Control de asistencia mediante códigos de barras
- Gestión de turnos propios
- Registro de entradas y salidas
- Visualización de historial de registros
- Reporte de novedades

### Usuario Regular (`user`)
- Acceso básico al dashboard
- Gestión de perfil personal

## 🚀 Rutas del Sistema

### Públicas
- `/` - Redirección automática al login
- `/login` - Iniciar sesión
- `/register` - Registro de usuarios

### Administradores
- `/admin/dashboard` - Panel de administración
- `/admin/users/*` - Gestión de usuarios
- `/instructores/*` - CRUD de instructores

### Guardias de Seguridad
- `/guardia/dashboard` - Panel de control de asistencia
- `/guardia/registrar-asistencia` - API registro por código de barras
- `/guardia/historial` - Historial de registros
- `/guardia/iniciar-turno` - Iniciar turno
- `/guardia/finalizar-turno` - Finalizar turno

## 📱 Características Técnicas

### Registro Automático por Códigos de Barras
- **Lectura instantánea**: Procesamiento inmediato del código
- **Validación**: Verificación de instructor activo en sistema
- **Lógica inteligente**: Determinación automática entrada/salida
- **Cálculo de novedades**: Detección de tardanzas y salidas anticipadas

### Control de Turnos de Guardias
- **Seguimiento temporal**: Registro de inicio y fin de turno
- **Validación de permisos**: Solo guardias en turno pueden registrar
- **Trazabilidad**: Cada registro queda asociado al guardia responsable

### Detección de Anomalías
- **Tardanzas**: Comparación automática con horario programado
- **Salidas anticipadas**: Alertas de salidas antes de tiempo
- **Estados de alerta**: Clasificación de registros normales vs. novedades

## 🔧 Comandos de Desarrollo

```bash
# Desarrollo con hot reload
npm run dev

# Compilar para producción
npm run build

# Resetear base de datos con datos de prueba
php artisan migrate:fresh --seed

# Ver rutas disponibles
php artisan route:list

# Verificar estado de migraciones
php artisan migrate:status
```

## 📊 Base de Datos

### Tabla `instructors`
- Información personal y laboral completa
- Códigos únicos y códigos de barras
- Horarios programados de trabajo
- Estados y observaciones

### Tabla `asistencias`
- Registros de entrada y salida
- Timestamps exactos
- Códigos de barras leídos
- Detección de novedades automática
- Trazabilidad del guardia responsable

### Tabla `users` (actualizada)
- Roles: admin, guardia, user
- Campos específicos para guardias
- Control de turnos activos

## 🚀 Flujo de Trabajo

### Flujo para Guardias
1. **Login** con credenciales de guardia
2. **Iniciar turno** desde el dashboard
3. **Registrar asistencias** escaneando códigos de barras
4. **Monitorear** instructores presentes y novedades
5. **Finalizar turno** al terminar jornada

### Flujo para Administradores
1. **Gestionar instructores** (crear, editar, activar/desactivar)
2. **Configurar horarios** de entrada y salida
3. **Revisar reportes** de asistencia y novedades
4. **Gestionar usuarios** del sistema (crear guardias)

### Registro de Asistencia
1. **Instructor presenta carné** al guardia
2. **Guardia escanea código** de barras
3. **Sistema determina** automáticamente entrada/salida
4. **Validación** de horarios y detección de novedades
5. **Registro** con timestamp exacto y ubicación

## 📈 Características de Seguridad

- **Autenticación robusta** con middleware por roles
- **Validación de turnos** para registros de asistencia
- **Trazabilidad completa** de todas las acciones
- **Códigos únicos** para prevenir duplicados
- **Validación de datos** en frontend y backend

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 🎯 Usuarios de Prueba para Testing

**Para probar como Administrador:**
- Email: admin@example.com / Contraseña: admin123
- Acceso a gestión de instructores y usuarios

**Para probar como Guardia:**
- Email: guardia1@seguridad.com / Contraseña: guardia123
- Simular registro con códigos: 1234567890123, 2345678901234, etc.

**¡El sistema está completamente funcional y listo para usar! 🎉**
