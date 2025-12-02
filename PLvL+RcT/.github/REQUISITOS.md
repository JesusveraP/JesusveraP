# 📋 Requisitos Funcionales y No Funcionales

## Sistema de Gestión de Asistencia de Instructores SENA

**Versión**: 1.0  
**Fecha**: 2 de Diciembre de 2025  
**Estado**: ✅ Proyecto Completado  

---

## 📌 REQUISITOS FUNCIONALES (1-38)

### 1. Login de Usuarios
- Usuarios pueden iniciar sesión con email y contraseña
- Sistema valida credenciales contra BD
- Redirige al dashboard según rol (admin, guardia, user)
- Manejo de errores con mensajes claros

### 2. Registro de Nuevos Usuarios
- Nuevos usuarios pueden registrarse en el sistema
- Validación: Email único, contraseña mínimo 8 caracteres
- Usuario creado con rol "user" por defecto
- Confirmación de contraseña requerida

### 3. Recuperación de Contraseña
- Usuarios olvidan contraseña: click en "Olvidé mi contraseña"
- Ingresa email registrado
- Recibe enlace de recuperación
- Establece nueva contraseña

### 4. Cerrar Sesión
- Usuarios pueden cerrar su sesión
- Sesión finalizada, redirige a login
- Limpieza de datos de sesión

### 5. Crear Instructor
- Administrador crea nuevo instructor en el sistema
- Campos Requeridos: Código único, código de barras, nombres, apellidos, documento de identidad, fecha ingreso, horarios, área asignada, estado
- Validaciones: Código único, documento único, código de barras único, email válido, horas válidas
- Resultado: Instructor creado en BD

### 6. Editar Instructor
- Modificar datos de instructor existente
- Cambios Permitidos: Todos los campos excepto código barras y documento
- Validaciones: Email válido, teléfono con formato, horas válidas
- Resultado: Datos actualizados en BD

### 7. Listar Instructores
- Ver listado de todos los instructores
- Filtros: Por nombre, área, estado, fecha ingreso, cargo
- Paginación: 20 registros por página
- Columnas: Código, Nombres, Área, Cargo, Estado, Acciones

### 8. Ver Detalles de Instructor
- Visualizar información completa del instructor
- Mostrar: Datos personales, código de barras, horarios, historial
- Opción de descargar código de barras

### 9. Cambiar Estado de Instructor
- Activar, inactivar o suspender instructor
- Estados: Activo (registra asistencia), Inactivo (no aparece), Suspendido
- Instructores inactivos no aceptan registros

### 10. Eliminar Instructor
- Eliminar instructor del sistema
- Precondiciones: Sin registros o confirmación
- Resultado: Instructor y registros eliminados

### 11. Registro de Asistencia por Código de Barras
- Guardia escanea código de barras del carné
- Sistema busca instructor en BD
- Determina automáticamente: Entrada o Salida
- Valida: Código válido, instructor activo, sin duplicados
- Detección automática: Entrada, Salida, Tardanza, Salida Anticipada
- Resultado: Registro con timestamp exacto

### 12. Historial de Registros de Asistencia
- Listado completo de asistencias registradas
- Información: Instructor, Área, Fecha, Hora entrada, Hora salida, Estado
- Filtros: Por fechas, instructor, hora, estado, tipo movimiento
- Ordenamiento: Por fecha y hora descendente
- Paginación: 20 registros por página

### 13. Iniciar Turno de Guardia
- Guardia marca inicio de jornada
- Registra fecha, hora y guardia responsable
- Solo un turno activo por guardia
- Resultado: Turno activo en BD

### 14. Finalizar Turno de Guardia
- Registra fin de jornada
- Calcula duración total
- Guarda resumen de registros del turno
- Resultado: Turno cerrado en BD

### 15. Ver Estado del Turno
- Mostrar si hay turno activo
- Tiempo transcurrido
- Registros hechos en turno actual
- Opción de finalizar

### 16. Notificaciones en Tiempo Real
- Alertas: Entrada puntual, Llegada tarde, Salida anticipada, Ausencia registrada
- Duración: Visible 30 segundos
- Acción: Cerrar con botón X

### 17. Control de Puertas
- Seleccionar punto de entrada/salida (Puerta superior/inferior)
- Horarios: Mañana (06:00-12:00), Tarde (12:00-18:00), Noche (18:00-23:00)
- Registra ubicación del control

### 18. Registrar Entrada de Equipos
- Registrar entrada de portátiles/tablets con instructores
- Información Requerida: Instructor (dropdown), Tipo (Profesor/Aprendiz/Estructura), Equipo (Portátil/Tablet/Otro), Serial, Fecha, Hora
- Visualización: Nombre, Área, Email del instructor
- Resultado: Registro de equipo en entrada

### 19. Registrar Salida de Equipos
- Registrar salida de equipos
- Proceso: Similar a entrada con Estado: Salida
- Resultado: Marca equipo como sacado de institución

### 20. Historial de Equipos
- Registro completo de entrada/salida de equipos
- Columnas: Nombre, Tipo, Equipo, Serial, Fecha, Hora, Estado
- Acciones: Eliminar registro
- Tabla con búsqueda y filtrado

### 21. Resumen de Equipos en Institución
- Estadísticas en tiempo real: Total registros, entradas, salidas
- **Equipos actualmente en institución** (Entradas - Salidas)
- Actualización automática

### 22. Estadísticas del Dashboard Administrativo
- Total instructores, tardanzas, ausencias, presentes
- Gráficos: Asistencias por hora, puntualidad, últimos 7 días

### 23. Historial de Asistencias en Dashboard Admin
- Listado de últimas asistencias con paginación
- Filtros por fecha, instructor, estado

### 24. Gestión CRUD de Usuarios
- Crear, editar, listar, filtrar usuarios
- Cambiar rol, activar/desactivar, resetear contraseña

### 25. Gestión de Vigilantes en Admin
- Listar vigilantes registrados
- Ver detalles de vigilante
- Ver historial de turnos
- Ver registros hechos por vigilante

### 26. Vista General del Dashboard de Vigilante
- Nombre del vigilante activo
- Estado del turno actual
- Botón iniciar/finalizar turno
- Acceso a control de puertas

### 27. Historial de Instructores en Dashboard de Vigilante
- Tabla: Instructor, Área, Fecha, Hora entrada, Hora salida, Estado
- Filtros: Búsqueda, hora, instructor, estado
- Estadísticas: Total, puntualidades, tardanzas, ausencias

### 28. Control de Equipos Integrado en Dashboard de Vigilante
- Sección completa para registro de portátiles
- Funcionalidad como se describe en requisitos 18-21

### 29. Configurar Horarios y Asistencias
- Hora entrada/salida programada general
- Margen de tolerancia para tardanzas
- Horario máximo de salida anticipada

### 30. Configurar Notificaciones del Sistema
- Habilitar/deshabilitar notificaciones
- Tipo de notificaciones activas
- Duración y sonido de alertas

### 31. Personalización del Sistema
- Logo personalizado: Subir, vista previa, resetear
- Nombre del sistema personalizable
- Colores del tema configurables

### 32. Respaldo y Restauración de BD
- Generar respaldo: Crear backup, descargar .sql, historial
- Restaurar respaldo: Subir archivo, confirmación, validación

### 33. Seguridad y Políticas de Contraseñas
- Políticas de contraseña: Longitud mínima, caracteres especiales
- Reseteo masivo de contraseñas

### 34. Limpiar Cache y Optimizar Sistema
- Limpiar cache del sistema
- Limpiar logs
- Optimizar base de datos

### 35. Reportes de Asistencia
- Reporte diario: Instructores presentes, tardanzas, ausencias
- Reporte por período: Rango de fechas, instructor específico o todos
- Formato: PDF, Excel, Imprimir
- Reporte de novedades: Tardanzas, salidas anticipadas, ausencias
- Reporte de turnos: Turnos realizados, duración, cantidad de registros, desempeño

### 36. Acerca de en Barra de Navegación
- Botón "Acerca de" en sidebar
- Modal con información del sistema
- Instructora Líder: Jessica Paola Quintero Carrascal
- Equipo de Desarrollo con datos completos
- Tecnología: Laravel 12, React + Inertia.js, SQLite, Tailwind CSS

### 37. Información del Equipo de Desarrollo
- Diego Digo Armando Quintero Contreras (Cédula: 1091091655034)
- Kevin Duwan Coronel Caballero (Cédula: 1091681160)
- Jorge Jesús Vera Pallares (Cédula: 3257664)
- Datos de contacto (correo, teléfono)

### 38. Información Disponible para Todos los Usuarios
- Acceso: Desde cualquier página mediante sidebar
- Disponible para: Todos los usuarios autenticados
- Información accesible sin restricciones de rol

---

## 🏗️ REQUISITOS NO FUNCIONALES

### RNF-1: Rendimiento

#### RNF-1.1 Tiempo de Respuesta
- Carga de páginas: ≤ 2 segundos
- Escaneo de código de barras: ≤ 500ms
- Consultas de BD: ≤ 1 segundo
- Búsquedas: ≤ 1.5 segundos
- Generación de reportes: ≤ 5 segundos

#### RNF-1.2 Escalabilidad
- Usuarios concurrentes: 100+ usuarios simultáneos
- Registros de asistencia: 1000+ registros/hora
- Capacidad almacenamiento: 10,000+ instructores

#### RNF-1.3 Optimización
- Caching en controladores y vistas
- Paginación: 20-50 registros por página
- Lazy loading de imágenes y componentes
- Assets minificados en producción

---

### RNF-2: Seguridad

#### RNF-2.1 Autenticación
- Laravel Breeze con roles
- Contraseñas: Hash bcrypt con salt
- CSRF protection en formularios

#### RNF-2.2 Autorización
- Middleware: Validación por rol en cada ruta
- Política de acceso: Admins (completo), Guardias (control), Users (dashboard)
- Validación de permisos: Backend y frontend

#### RNF-2.3 Protección de Datos
- Encriptación de datos sensibles en BD
- SQL Injection: Protected statements
- XSS: Escaping automático
- CSRF: Tokens en formularios
- HTTPS: Recomendado en producción

#### RNF-2.4 Auditoría
- Logs: Registros de acciones importantes
- Trazabilidad: Cada cambio vinculado a usuario
- Historial: Conservación de datos históricos

---

### RNF-3: Disponibilidad y Confiabilidad

#### RNF-3.1 Disponibilidad
- Uptime: 99% (mínimo)
- Backup automático: Diario
- Recuperación ante fallos: ≤ 1 hora

#### RNF-3.2 Confiabilidad
- Validación de datos: Frontend y backend
- Manejo de errores: Mensajes claros
- Transacciones: ACID en BD
- Recuperación de errores: Reintentos automáticos

#### RNF-3.3 Respaldo y Recuperación
- Backup automático: Una vez por día
- Almacenamiento: Mínimo 7 días de respaldos
- Restauración: Pruebas periódicas
- Documentación: Procedimientos de recuperación

---

### RNF-4: Usabilidad

#### RNF-4.1 Interfaz de Usuario
- Diseño responsive: Desktop, tablet, móvil
- Resoluciones: Móvil (320px-768px), Tablet (768px-1024px), Desktop (1024px+)
- Colores accesibles: Contraste WCAG AA
- Fuentes legibles: Tamaño mínimo 14px

#### RNF-4.2 Experiencia de Usuario
- Navegación intuitiva: Menú claro y consistente
- Feedback visual: Confirmación de acciones
- Errores claros: Mensajes explicativos
- Ayuda contextual: Tooltips y etiquetas descriptivas
- Consistencia: Mismo diseño en todas las páginas

#### RNF-4.3 Accesibilidad
- Navegación por teclado: Tab, Enter, Esc funcionales
- Lectores de pantalla: Compatibilidad ARIA
- Contraste de colores: Mínimo 4.5:1
- Alternativas de texto: Descripciones en imágenes

#### RNF-4.4 Localización
- Idioma: Español (Colombia)
- Formato de fechas: DD/MM/YYYY
- Formato de hora: HH:MM (24 horas)
- Zona horaria: Colombia (UTC-5)

---

### RNF-5: Compatibilidad

#### RNF-5.1 Navegadores
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile: Chrome Mobile, Safari Mobile, Firefox Mobile

#### RNF-5.2 Dispositivos
- Desktop: Windows, Mac, Linux
- Tablet: iPad, Android tablets
- Móvil: iOS 14+, Android 8+

#### RNF-5.3 Resoluciones
- Mínimo: 320px (móvil)
- Máximo: 4K (4096px)

---

### RNF-6: Mantenibilidad

#### RNF-6.1 Código
- Lenguajes: PHP 8.2+ (Backend), JavaScript/React (Frontend), SQL (BD)
- Estándares: PSR-12 (PHP), ESLint (JavaScript), Prettier
- Documentación: Comentarios en código
- Testing: Unit tests y Feature tests

#### RNF-6.2 Arquitectura
- Patrón MVC: Usado en Laravel
- Separación de responsabilidades: Controllers, Models, Views
- Reutilización de código: Componentes React modulares
- Configuración externa: .env para valores sensibles

#### RNF-6.3 Versionamiento
- Git: Control de versiones
- Commits: Mensajes descriptivos
- Branches: Feature branches para desarrollo
- Releases: Tags para versiones

---

### RNF-7: Compatibilidad de Base de Datos

#### RNF-7.1 Soportadas
- SQLite: Por defecto en desarrollo
- MySQL: 5.7+
- PostgreSQL: 10+

#### RNF-7.2 Migraciones
- Versionadas: Historial completo
- Reversibles: Rollback disponible
- Documentadas: Cambios claros en código

---

### RNF-8: Documentación

#### RNF-8.1 Tipos de Documentación
- README.md: Guía general del proyecto
- REQUISITOS.md: Requisitos funcionales y no funcionales
- Código comentado: Explicación de lógica compleja
- API documentation: Endpoints y modelos
- User manual: Guía de uso por rol

#### RNF-8.2 Actualización
- Frecuencia: Con cada cambio importante
- Formato: Markdown
- Versionamiento: Vinculado a releases

---

### RNF-9: Estándares y Cumplimiento

#### RNF-9.1 Normas Aplicables
- GDPR: Protección de datos (si aplica)
- Accesibilidad: WCAG 2.1 Level AA

#### RNF-9.2 Validación
- Pruebas de funcionalidad: 100% requisitos
- Pruebas de seguridad: Penetration testing
- Pruebas de rendimiento: Load testing

---

## 📊 Matriz de Trazabilidad de Requisitos (1-38)

| # | Requisito | Prioridad | Estado | Módulo | Descripción |
|---|-----------|-----------|--------|--------|-------------|
| 1-4 | Autenticación | Alta | ✅ Completado | Auth | Sistema de autenticación |
| 5-10 | Gestión de Instructores | Alta | ✅ Completado | Admin | CRUD de instructores |
| 11-17 | Control de Asistencia | Alta | ✅ Completado | Guardia | Registro y turnos |
| 18-21 | Control de Equipos | Media | ✅ Completado | Guardia | Portátiles y tablets |
| 22-25 | Dashboard Admin | Alta | ✅ Completado | Admin | Estadísticas y gestión |
| 26-28 | Dashboard Vigilante | Alta | ✅ Completado | Guardia | Vistas y control |
| 29-34 | Configuraciones | Media | ✅ Completado | Admin | Sistema y seguridad |
| 35 | Reportes | Media | ✅ Completado | Reportes | Reportes y estadísticas |
| 36-38 | Información | Baja | ✅ Completado | General | Sistema de información |

---

## 🎯 Resumen Ejecutivo

**Total de Requisitos Funcionales**: 38 (Todos completados ✅)
**Total de Requisitos No Funcionales**: 9 categorías (Todos implementados ✅)

**Desglose por Categoría**:
- Requisitos 1-4: Autenticación (4)
- Requisitos 5-10: Gestión de Instructores (6)
- Requisitos 11-17: Control de Asistencia (7)
- Requisitos 18-21: Control de Equipos (4)
- Requisitos 22-25: Dashboard Administrativo (4)
- Requisitos 26-28: Dashboard de Vigilante (3)
- Requisitos 29-34: Configuraciones del Sistema (6)
- Requisitos 35: Reportes (1)
- Requisitos 36-38: Sistema de Información (3)

**Módulos Principales**:
1. ✅ Autenticación y Control de Acceso
2. ✅ Gestión de Instructores
3. ✅ Control de Asistencia
4. ✅ Control de Equipos/Portátiles
5. ✅ Dashboards Administrativo y de Guardia
6. ✅ Configuraciones del Sistema
7. ✅ Reportes y Estadísticas
8. ✅ Sistema de Información

---

## 👥 Equipo de Desarrollo

- **Diego Digo Armando Quintero Contreras** - Cédula: 1091091655034
- **Kevin Duwan Coronel Caballero** - Cédula: 1091681160
- **Jorge Jesús Vera Pallares** - Cédula: 3257664

**Instructora Líder**: Jessica Paola Quintero Carrascal

**Formación**: ADSO (Análisis y Desarrollo de Software Orientado a Objetos)

---

## 📅 Información de Entrega

**Fecha de Completación**: 2 de Diciembre de 2025  
**Estado**: ✅ PRODUCTIVO  
**Versión del Sistema**: 1.0  

---

*Documento generado automáticamente - Última actualización: 2025-12-02*
