import { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { Clock, Users, MessageSquare, Image, Shield, Database, CheckCircle, Settings } from 'lucide-react';
import LogoDisplay from '@/Components/LogoDisplay';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function Configuraciones() {
    const { rolesStats, asistenciasStats, asistenciasRecientes, systemSettings } = usePage().props;

    const [activeSection, setActiveSection] = useState('horarios');
    const [activeSubSection, setActiveSubSection] = useState('configuracion');

    // Estado para mensajes flash - INICIALIZAR CON VALORES DEL BACKEND
    const [notificacionesConfig, setNotificacionesConfig] = useState({
        color_success: systemSettings?.notification_color_success || 'green',
        color_error: systemSettings?.notification_color_error || 'red',
        color_warning: systemSettings?.notification_color_warning || 'yellow',
        color_info: systemSettings?.notification_color_info || 'blue',
        duration: String(systemSettings?.notification_duration || '5'),
        position: systemSettings?.notification_position || 'top-right',
        sound: systemSettings?.notification_sound || false,
        animation: systemSettings?.notification_animation || 'slide'
    });

    const [notificacionesStatus, setNotificacionesStatus] = useState({ loading: false, message: '' });

    // Sincronizar estado cuando cambian los systemSettings
    useEffect(() => {
        if (systemSettings) {
            setNotificacionesConfig({
                color_success: systemSettings.notification_color_success || 'green',
                color_error: systemSettings.notification_color_error || 'red',
                color_warning: systemSettings.notification_color_warning || 'yellow',
                color_info: systemSettings.notification_color_info || 'blue',
                duration: String(systemSettings.notification_duration || '5'),
                position: systemSettings.notification_position || 'top-right',
                sound: systemSettings.notification_sound || false,
                animation: systemSettings.notification_animation || 'slide'
            });
        }
    }, [systemSettings]);

    // Estado para el upload de logo (simplificado)
    const [uploadStatus, setUploadStatus] = useState({ loading: false, message: '' });
    const [logoTimestamp, setLogoTimestamp] = useState(Date.now());
    const [currentLogoPath, setCurrentLogoPath] = useState(systemSettings?.logo_path || '/images/sena-logo.svg');

    // Estado para el esquema de colores
    const [selectedColor, setSelectedColor] = useState(systemSettings?.primary_color || 'green');
    const [colorSaveStatus, setColorSaveStatus] = useState({ loading: false, message: '' });
    const [previewColor, setPreviewColor] = useState(systemSettings?.primary_color || 'green');

    // Estado para políticas de seguridad
    const [securityConfig, setSecurityConfig] = useState({
        min_length: systemSettings?.password_min_length || '8',
        require_uppercase: systemSettings?.password_require_uppercase !== false,
        require_numbers: systemSettings?.password_require_numbers !== false,
        require_special: systemSettings?.password_require_special || false,
        expiration_days: systemSettings?.password_expiration_days || '90'
    });
    const [securityStatus, setSecurityStatus] = useState({ loading: false, message: '' });

    // Estado para respaldo y restauración
    const [backupStatus, setBackupStatus] = useState({ loading: false, message: '' });

    // Mapa de colores
    const colorMap = {
        green: { 50: '240, 253, 244', 100: '220, 252, 231', 200: '187, 247, 208', 300: '134, 239, 172', 400: '74, 222, 128', 500: '34, 197, 94', 600: '22, 163, 74', 700: '16, 185, 74', 800: '20, 83, 45', 900: '20, 83, 45' },
        blue: { 50: '239, 246, 255', 100: '219, 234, 254', 200: '191, 219, 254', 300: '147, 197, 253', 400: '96, 165, 250', 500: '59, 130, 246', 600: '37, 99, 235', 700: '29, 78, 216', 800: '30, 58, 138', 900: '30, 58, 138' },
        indigo: { 50: '238, 242, 255', 100: '224, 231, 255', 200: '199, 210, 254', 300: '165, 180, 252', 400: '129, 140, 248', 500: '99, 102, 241', 600: '79, 70, 229', 700: '67, 56, 202', 800: '55, 48, 163', 900: '55, 48, 163' },
        purple: { 50: '250, 245, 255', 100: '243, 232, 255', 200: '232, 204, 255', 300: '216, 180, 254', 400: '192, 132, 250', 500: '168, 85, 247', 600: '147, 51, 234', 700: '126, 34, 206', 800: '88, 28, 135', 900: '88, 28, 135' },
        red: { 50: '254, 242, 242', 100: '254, 226, 226', 200: '254, 202, 202', 300: '252, 165, 165', 400: '248, 113, 113', 500: '239, 68, 68', 600: '220, 38, 38', 700: '185, 28, 28', 800: '127, 29, 29', 900: '127, 29, 29' },
        orange: { 50: '255, 247, 237', 100: '255, 237, 213', 200: '254, 215, 170', 300: '253, 186, 116', 400: '251, 146, 60', 500: '249, 115, 22', 600: '234, 88, 12', 700: '194, 65, 12', 800: '124, 45, 18', 900: '124, 45, 18' },
        yellow: { 50: '254, 252, 232', 100: '254, 248, 204', 200: '254, 240, 138', 300: '253, 224, 71', 400: '250, 204, 21', 500: '234, 179, 8', 600: '202, 138, 4', 700: '161, 98, 7', 800: '113, 63, 18', 900: '113, 63, 18' },
        teal: { 50: '240, 253, 250', 100: '204, 251, 241', 200: '153, 246, 228', 300: '94, 234, 212', 400: '45, 212, 191', 500: '20, 184, 166', 600: '13, 148, 136', 700: '15, 118, 110', 800: '20, 83, 80', 900: '20, 83, 80' },
        cyan: { 50: '240, 249, 250', 100: '207, 250, 254', 200: '165, 243, 252', 300: '103, 232, 249', 400: '34, 211, 238', 500: '34, 211, 238', 600: '8, 145, 178', 700: '14, 116, 144', 800: '21, 94, 117', 900: '21, 94, 117' },
        gray: { 50: '249, 250, 251', 100: '243, 244, 246', 200: '229, 231, 235', 300: '209, 213, 219', 400: '156, 163, 175', 500: '107, 114, 128', 600: '75, 85, 99', 700: '55, 65, 81', 800: '31, 41, 55', 900: '17, 24, 39' },
        slate: { 50: '248, 250, 252', 100: '241, 245, 249', 200: '226, 232, 240', 300: '203, 213, 225', 400: '148, 163, 184', 500: '100, 116, 139', 600: '71, 85, 105', 700: '51, 65, 85', 800: '30, 41, 59', 900: '15, 23, 42' },
        stone: { 50: '250, 250, 249', 100: '245, 245, 244', 200: '231, 229, 228', 300: '214, 211, 209', 400: '168, 162, 158', 500: '120, 113, 108', 600: '87, 83, 82', 700: '68, 64, 60', 800: '41, 37, 36', 900: '28, 25, 23' }
    };

    // Datos de configuración de horarios
    const { data: horarios, setData: setHorarios, post: postHorarios, processing: processingHorarios } = useForm({
        manana_inicio: '06:00',
        manana_fin: '11:45',
        tarde_inicio: '12:00',
        tarde_fin: '17:45',
        noche_inicio: '18:00',
        noche_fin: '21:45',
        desde: '',
        hasta: ''
    });

    const guardarAsistencia = () => {
        alert('Horario actualizado con éxito.');
    };

    const cancelar = () => {
        window.location.reload();
    };

    // Función para aplicar color a la vista previa
    const applyColorPreview = (colorName) => {
        const color = colorMap[colorName] || colorMap.green;
        const previewElement = document.getElementById('color-preview-bar');
        if (previewElement) {
            previewElement.style.backgroundColor = `rgb(${color[600]})`;
        }
    };

    const handleColorPreview = (colorValue) => {
        setPreviewColor(colorValue);
        applyColorPreview(colorValue);
    };

    const handleColorChange = async (colorValue) => {
        setSelectedColor(colorValue);
        setColorSaveStatus({ loading: true, message: '⏳ Guardando color...' });

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(route('admin.customization.update-color'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ primary_color: colorValue })
            });

            const result = await response.json();
            if (response.ok && result.success) {
                setColorSaveStatus({ loading: false, message: '✅ Color guardado exitosamente' });
                setTimeout(() => setColorSaveStatus({ loading: false, message: '' }), 2000);
            } else {
                setColorSaveStatus({ loading: false, message: `❌ ${result.message || 'Error al guardar'}` });
            }
        } catch (error) {
            console.error('Error:', error);
            setColorSaveStatus({ loading: false, message: '❌ Error al guardar el color: ' + error.message });
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadStatus({ loading: true, message: '⏳ Subiendo logo...' });

        const formData = new FormData();
        formData.append('logo', file);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(route('admin.customization.upload-logo'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: formData
            });

            const result = await response.json();
            if (response.ok && result.success) {
                setCurrentLogoPath(result.logo_path || `/images/logo.png`);
                setLogoTimestamp(Date.now());
                setUploadStatus({ loading: false, message: '✅ Logo subido exitosamente' });
                setTimeout(() => setUploadStatus({ loading: false, message: '' }), 2000);
            } else {
                setUploadStatus({ loading: false, message: `❌ ${result.message || 'Error al subir'}` });
            }
        } catch (error) {
            console.error('Error:', error);
            setUploadStatus({ loading: false, message: '❌ Error: ' + error.message });
        }
    };

    const handleLogoReset = async () => {
        if (!confirm('¿Desea restablecer el logo predeterminado?')) return;
        setUploadStatus({ loading: true, message: '⏳ Restableciendo logo...' });

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(route('admin.customization.reset'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
            });

            const result = await response.json();
            if (response.ok && result.success) {
                setCurrentLogoPath('/images/sena-logo.png');
                setLogoTimestamp(Date.now());
                setUploadStatus({ loading: false, message: '✅ Logo restablecido' });
                setTimeout(() => setUploadStatus({ loading: false, message: '' }), 2000);
            } else {
                setUploadStatus({ loading: false, message: `❌ ${result.message || 'Error al restablecer'}` });
            }
        } catch (error) {
            console.error('Error:', error);
            setUploadStatus({ loading: false, message: '❌ Error: ' + error.message });
        }
    };

    useEffect(() => {
        applyColorPreview(previewColor);
    }, [previewColor]);

    // Handlers para Mensajes Flash
    const handleGuardarNotificaciones = async () => {
        setNotificacionesStatus({ loading: true, message: '⏳ Guardando configuración...' });
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(route('admin.configuraciones.notificaciones'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    color_success: notificacionesConfig.color_success,
                    color_error: notificacionesConfig.color_error,
                    color_warning: notificacionesConfig.color_warning,
                    color_info: notificacionesConfig.color_info,
                    duration: parseInt(notificacionesConfig.duration),
                    position: notificacionesConfig.position,
                    sound: notificacionesConfig.sound || false,
                    animation: notificacionesConfig.animation
                })
            });

            const result = await response.json();
            if (response.ok && result.success) {
                setNotificacionesStatus({ loading: false, message: '✅ Configuración guardada exitosamente' });
                setTimeout(() => window.location.reload(), 1500);
            } else {
                setNotificacionesStatus({ loading: false, message: `❌ ${result.message || 'Error al guardar'}` });
            }
        } catch (error) {
            console.error('Error:', error);
            setNotificacionesStatus({ loading: false, message: '❌ Error: ' + error.message });
        }
    };

    const handleRestablecerNotificaciones = async () => {
        if (!confirm('¿Está seguro de que desea restablecer la configuración de notificaciones a los valores por defecto?')) {
            return;
        }
        setNotificacionesStatus({ loading: true, message: '⏳ Restableciendo configuración...' });
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(route('admin.configuraciones.notificaciones'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    color_success: 'green',
                    color_error: 'red',
                    color_warning: 'yellow',
                    color_info: 'blue',
                    duration: 5,
                    position: 'top-right',
                    sound: false,
                    animation: 'slide'
                })
            });

            const result = await response.json();
            if (response.ok && result.success) {
                setNotificacionesStatus({ loading: false, message: '✅ Configuración restablecida a valores predeterminados' });
                setTimeout(() => window.location.reload(), 1500);
            } else {
                setNotificacionesStatus({ loading: false, message: `❌ ${result.message || 'Error al restablecer'}` });
            }
        } catch (error) {
            console.error('Error:', error);
            setNotificacionesStatus({ loading: false, message: '❌ Error: ' + error.message });
        }
    };

    // Handlers para otras secciones
    const handleGuardarRoles = () => {
        alert('✅ Cambios en roles guardados correctamente');
    };

    const handleCancelarRoles = () => {
        window.location.reload();
    };

    const handleGuardarPersonalizacion = () => {
        alert('✅ Personalización guardada correctamente');
    };

    const handleVistaPrevia = () => {
        alert('📋 Vista previa de personalización');
    };

    const handleGuardarSeguridad = async () => {
        setSecurityStatus({ loading: true, message: '⏳ Guardando políticas de seguridad...' });
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(route('admin.configuraciones.seguridad'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    min_length: securityConfig.min_length,
                    require_uppercase: securityConfig.require_uppercase,
                    require_numbers: securityConfig.require_numbers,
                    require_special: securityConfig.require_special,
                    expiration_days: securityConfig.expiration_days
                })
            });

            const result = await response.json();
            if (response.ok && result.success) {
                setSecurityStatus({ loading: false, message: '✅ Políticas de seguridad guardadas exitosamente' });
                setTimeout(() => window.location.reload(), 1500);
            } else {
                setSecurityStatus({ loading: false, message: `❌ ${result.message || 'Error al guardar'}` });
            }
        } catch (error) {
            console.error('Error:', error);
            setSecurityStatus({ loading: false, message: '❌ Error: ' + error.message });
        }
    };

    const handleCrearRespaldo = async () => {
        if (!confirm('¿Crear un respaldo de la base de datos ahora?')) return;
        
        setBackupStatus({ loading: true, message: '⏳ Creando respaldo...' });
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(route('admin.backup.generate'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
            });

            const result = await response.json();
            if (response.ok && result.success) {
                setBackupStatus({ loading: false, message: '✅ Respaldo creado exitosamente' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                setBackupStatus({ loading: false, message: `❌ Error: ${result.message || 'Error al crear respaldo'}` });
            }
        } catch (error) {
            console.error('Error:', error);
            setBackupStatus({ loading: false, message: '❌ Error: ' + error.message });
        }
    };

    const handleDescargarRespaldo = (filename) => {
        // Descargar pasando el nombre completo del archivo
        window.location.href = route('admin.backup.download', { backup: filename });
    };

    const handleGuardarAvanzada = async () => {
        const debug = document.querySelector('input[data-field="debug"]')?.checked || false;
        const audit = document.querySelector('input[data-field="audit"]')?.checked || true;
        const cache = document.querySelector('input[data-field="cache"]')?.checked || true;
        const maintenance = document.querySelector('input[data-field="maintenance"]')?.checked || false;

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(route('admin.configuraciones.avanzada'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    debug_mode: debug,
                    audit_log: audit,
                    cache_enabled: cache,
                    maintenance_mode: maintenance
                })
            });

            const result = await response.json();
            if (response.ok && result.success) {
                alert('✅ Configuración avanzada guardada correctamente');
            } else {
                alert(`❌ Error: ${result.message || 'Error al guardar'}`);
            }
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    };

    const handleLimpiarCache = async () => {
        if (!confirm('¿Está seguro de que desea limpiar el caché del sistema?')) return;

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(route('admin.configuraciones.limpiar-cache'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
            });

            const result = await response.json();
            if (response.ok && result.success) {
                alert('✅ Caché limpiado exitosamente');
            } else {
                alert(`❌ Error: ${result.message || 'Error al limpiar caché'}`);
            }
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    };

    const handleRestablecerConfig = async () => {
        if (!confirm('¿Está COMPLETAMENTE seguro de restablecer todos los valores a predeterminados? Esta acción no se puede deshacer.')) return;

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(route('admin.configuraciones.resetear-valores'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
            });

            const result = await response.json();
            if (response.ok && result.success) {
                alert('✅ Configuración restablecida a valores predeterminados');
                setTimeout(() => window.location.reload(), 1000);
            } else {
                alert(`❌ Error: ${result.message || 'Error al restablecer'}`);
            }
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    };

    const handleEliminarDatos = async () => {
        if (!confirm('⚠️ ADVERTENCIA: Esto eliminará TODOS los datos del sistema. ¿Continuar?')) return;
        if (!confirm('⚠️ SEGUNDA CONFIRMACIÓN: Esta acción es IRREVERSIBLE. ¿Realmente desea continuar?')) return;

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(route('admin.configuraciones.eliminar-datos'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
            });

            const result = await response.json();
            if (response.ok && result.success) {
                alert('✅ Todos los datos han sido eliminados');
                setTimeout(() => window.location.href = route('login'), 1000);
            } else {
                alert(`❌ Error: ${result.message || 'Error al eliminar datos'}`);
            }
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    };

    return (
        <SidebarLayout
            title="Configuraciones del Sistema - SENA"
            header={
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Configuraciones del Sistema</h1>
                    <p className="text-gray-600 mt-1">Administra parámetros generales, roles y opciones avanzadas</p>
                </div>
            }
        >
            <div className="flex">
                {/* Sidebar de opciones */}
                <aside className="w-96 bg-white border-r border-gray-200 p-6">
                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveSection('horarios')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                activeSection === 'horarios' 
                                    ? 'bg-gray-100 border-2 border-gray-300' 
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            <Clock className="text-gray-600" size={20} />
                            <span className="text-gray-800 font-medium">Horarios y Asistencias</span>
                        </button>

                        <button
                            onClick={() => setActiveSection('usuarios')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                activeSection === 'usuarios' 
                                    ? 'bg-gray-100 border-2 border-gray-300' 
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            <Users className="text-gray-600" size={20} />
                            <span className="text-gray-800 font-medium">Usuarios y Roles</span>
                        </button>

                        <button
                            onClick={() => setActiveSection('mensajes')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                activeSection === 'mensajes' 
                                    ? 'bg-gray-100 border-2 border-gray-300' 
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            <MessageSquare className="text-gray-600" size={20} />
                            <span className="text-gray-800 font-medium">Mensajes flash / Notificaciones</span>
                        </button>

                        <button
                            onClick={() => setActiveSection('personalizacion')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                activeSection === 'personalizacion' 
                                    ? 'bg-gray-100 border-2 border-gray-300' 
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            <Image className="text-gray-600" size={20} />
                            <span className="text-gray-800 font-medium">Personalización del Sistema</span>
                        </button>

                        <button
                            onClick={() => setActiveSection('seguridad')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                activeSection === 'seguridad' 
                                    ? 'bg-gray-100 border-2 border-gray-300' 
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            <Shield className="text-gray-600" size={20} />
                            <span className="text-gray-800 font-medium">Seguridad y Contraseñas</span>
                        </button>

                        <button
                            onClick={() => setActiveSection('respaldo')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                activeSection === 'respaldo' 
                                    ? 'bg-gray-100 border-2 border-gray-300' 
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            <Database className="text-gray-600" size={20} />
                            <span className="text-gray-800 font-medium">Respaldo y Restauración</span>
                        </button>

                        <button
                            onClick={() => setActiveSection('avanzada')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                activeSection === 'avanzada' 
                                    ? 'bg-gray-100 border-2 border-gray-300' 
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            <Settings className="text-gray-600" size={20} />
                            <span className="text-gray-800 font-medium">Configuración Avanzada</span>
                        </button>
                    </nav>
                </aside>

                {/* Contenido principal */}
                <main className="flex-1 p-8">
                    {/* Sección Horarios y Asistencias */}
                    {activeSection === 'horarios' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Horarios y Asistencias</h2>
                            <p className="text-gray-600 mb-8">Configuración de intervalos de trabajo y historial de asistencias</p>

                            {/* Pestañas internas para Horarios y Historial */}
                            <div className="mb-8">
                                <div className="border-b border-gray-200">
                                    <nav className="-mb-px flex space-x-8">
                                        <button
                                            onClick={() => setActiveSubSection('configuracion')}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                                activeSubSection === 'configuracion' || !activeSubSection
                                                    ? 'border-green-500 text-green-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            Configuración de Horarios
                                        </button>
                                        <button
                                            onClick={() => setActiveSubSection('historial')}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                                activeSubSection === 'historial'
                                                    ? 'border-green-500 text-green-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            Historial de Asistencias
                                        </button>
                                    </nav>
                                </div>
                            </div>

                            {/* Contenido de Configuración de Horarios */}
                            {(!activeSubSection || activeSubSection === 'configuracion') && (
                                <div className="space-y-6">
                                    {/* Horario Mañana */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-48">
                                            <span className="text-lg font-medium text-gray-800">06:00AM-11:45AM</span>
                                            <span className="text-gray-600 ml-2">(mañana)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                value={horarios.manana_fin}
                                                onChange={(e) => setHorarios('manana_fin', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-400"
                                            />
                                            <span className="text-gray-600">PM</span>
                                        </div>
                                    </div>

                                    {/* Horario Tarde */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-48">
                                            <span className="text-lg font-medium text-gray-800">12:00PM-05:45PM</span>
                                            <span className="text-gray-600 ml-2">(tarde)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                value={horarios.tarde_fin}
                                                onChange={(e) => setHorarios('tarde_fin', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-400"
                                            />
                                            <span className="text-gray-600">PM</span>
                                        </div>
                                    </div>

                                    {/* Horario Noche */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-48">
                                            <span className="text-lg font-medium text-gray-800">06:00PM-09:45PM</span>
                                            <span className="text-gray-600 ml-2">(noche)</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="text"
                                                placeholder="Desde"
                                                value={horarios.desde}
                                                onChange={(e) => setHorarios('desde', e.target.value)}
                                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-400"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Hasta"
                                                value={horarios.hasta}
                                                onChange={(e) => setHorarios('hasta', e.target.value)}
                                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Botón Agregar asistencia */}
                                    <div className="mt-8">
                                        <button
                                            onClick={guardarAsistencia}
                                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg"
                                        >
                                            Agregar asistencia
                                        </button>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex gap-4 mt-8">
                                        <button
                                            onClick={guardarAsistencia}
                                            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg"
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            onClick={cancelar}
                                            className="bg-white border border-red-300 text-red-600 hover:bg-red-50 font-medium py-3 px-6 rounded-lg"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Contenido del Historial de Asistencias */}
                            {activeSubSection === 'historial' && (
                                <div>
                                    {/* Estadísticas rápidas */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Total Asistencias Hoy</p>
                                                    <p className="text-2xl font-bold text-gray-900">{asistenciasStats?.total_hoy || 0}</p>
                                                </div>
                                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Llegadas Puntuales</p>
                                                    <p className="text-2xl font-bold text-gray-900">{asistenciasStats?.puntuales || 0}</p>
                                                </div>
                                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Clock className="w-6 h-6 text-blue-600" />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Llegadas Tarde</p>
                                                    <p className="text-2xl font-bold text-gray-900">{asistenciasStats?.tarde || 0}</p>
                                                </div>
                                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                                    <Clock className="w-6 h-6 text-yellow-600" />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Ausencias</p>
                                                    <p className="text-2xl font-bold text-gray-900">{asistenciasStats?.ausencias || 0}</p>
                                                </div>
                                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                                    <Users className="w-6 h-6 text-red-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tabla de asistencias recientes */}
                                    <div className="bg-white rounded-lg border border-gray-200">
                                        <div className="px-6 py-4 border-b border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-gray-900">Asistencias Recientes</h3>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="date"
                                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                                        defaultValue={new Date().toISOString().split('T')[0]}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="overflow-x-auto">
                                            {asistenciasRecientes && asistenciasRecientes.length > 0 ? (
                                                <table className="w-full">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Instructor
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Área
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Fecha
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Hora Entrada
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Hora Salida
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Estado
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {asistenciasRecientes.map((asistencia, index) => (
                                                            <tr key={index} className="hover:bg-gray-50">
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {asistencia.instructor}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                        {asistencia.area}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {asistencia.fecha}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {asistencia.entrada}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {asistencia.salida}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                        asistencia.estado === 'Puntual' ? 'bg-green-100 text-green-800' :
                                                                        asistencia.estado === 'Tarde' ? 'bg-yellow-100 text-yellow-800' :
                                                                        asistencia.estado === 'Presente' ? 'bg-blue-100 text-blue-800' :
                                                                        'bg-red-100 text-red-800'
                                                                    }`}>
                                                                        {asistencia.estado}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                                    <h3 className="text-sm font-medium text-gray-900 mb-2">No hay registros de asistencias hoy</h3>
                                                    <p className="text-sm text-gray-500">
                                                        Las asistencias de hoy aparecerán aquí cuando los instructores registren su entrada.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sección Usuarios y Roles */}
                    {activeSection === 'usuarios' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Usuarios y Roles</h2>
                            <p className="text-gray-600 mb-8">Gestiona los usuarios del sistema y sus roles asignados</p>
                            
                            {/* Estadísticas de usuarios */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white rounded-lg p-6 border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Total Usuarios</p>
                                            <p className="text-2xl font-bold text-gray-900">{rolesStats?.total || 0}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Users className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-lg p-6 border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Administradores</p>
                                            <p className="text-2xl font-bold text-gray-900">{rolesStats?.admin || 0}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-lg p-6 border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Guardias</p>
                                            <p className="text-2xl font-bold text-gray-900">{rolesStats?.guardia || 0}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-yellow-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Gestión de roles */}
                            <div className="bg-white rounded-lg p-6 border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Roles del Sistema</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                                <Shield className="w-5 h-5 text-red-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Administrador</h4>
                                                <p className="text-sm text-gray-600">Acceso completo al sistema</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                                {rolesStats?.admin || 0} usuarios
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                                <Shield className="w-5 h-5 text-yellow-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Guardia</h4>
                                                <p className="text-sm text-gray-600">Registro de asistencias y seguridad</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                                {rolesStats?.guardia || 0} usuarios
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sección Mensajes y Notificaciones */}
                    {activeSection === 'mensajes' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Mensajes flash / Notificaciones</h2>
                            <p className="text-gray-600 mb-8">Configura el comportamiento de las notificaciones del sistema</p>
                            
                            {/* Colores de notificación */}
                            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Colores de Notificaciones</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Notificaciones de Éxito
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-500 rounded border border-gray-300"></div>
                                            <select
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                value={notificacionesConfig.color_success}
                                                onChange={(e) => setNotificacionesConfig({ ...notificacionesConfig, color_success: e.target.value })}
                                            >
                                                <option value="green">Verde (por defecto)</option>
                                                <option value="blue">Azul</option>
                                                <option value="purple">Púrpura</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Notificaciones de Error
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-red-500 rounded border border-gray-300"></div>
                                            <select
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                value={notificacionesConfig.color_error}
                                                onChange={(e) => setNotificacionesConfig({ ...notificacionesConfig, color_error: e.target.value })}
                                            >
                                                <option value="red">Rojo (por defecto)</option>
                                                <option value="orange">Naranja</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Notificaciones de Advertencia
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-yellow-500 rounded border border-gray-300"></div>
                                            <select
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                value={notificacionesConfig.color_warning}
                                                onChange={(e) => setNotificacionesConfig({ ...notificacionesConfig, color_warning: e.target.value })}
                                            >
                                                <option value="yellow">Amarillo (por defecto)</option>
                                                <option value="orange">Naranja</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Notificaciones de Información
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-500 rounded border border-gray-300"></div>
                                            <select
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                value={notificacionesConfig.color_info}
                                                onChange={(e) => setNotificacionesConfig({ ...notificacionesConfig, color_info: e.target.value })}
                                            >
                                                <option value="blue">Azul (por defecto)</option>
                                                <option value="gray">Gris</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Configuración de comportamiento */}
                            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuración de Comportamiento</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Duración de las notificaciones</label>
                                            <p className="text-xs text-gray-500">Tiempo en segundos antes de que desaparezca automáticamente</p>
                                        </div>
                                        <select
                                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            value={notificacionesConfig.duration}
                                            onChange={(e) => setNotificacionesConfig({ ...notificacionesConfig, duration: e.target.value })}
                                        >
                                            <option value="3">3 segundos</option>
                                            <option value="5">5 segundos</option>
                                            <option value="8">8 segundos</option>
                                            <option value="0">Manual</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Posición en pantalla</label>
                                            <p className="text-xs text-gray-500">Ubicación donde aparecen las notificaciones</p>
                                        </div>
                                        <select
                                            className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            value={notificacionesConfig.position}
                                            onChange={(e) => setNotificacionesConfig({ ...notificacionesConfig, position: e.target.value })}
                                        >
                                            <option value="top-right">Arriba Derecha</option>
                                            <option value="top-left">Arriba Izquierda</option>
                                            <option value="bottom-right">Abajo Derecha</option>
                                            <option value="bottom-left">Abajo Izquierda</option>
                                            <option value="top-center">Arriba Centro</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Sonido de notificación</label>
                                            <p className="text-xs text-gray-500">Reproducir sonido cuando aparece una notificación</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={notificacionesConfig.sound}
                                                onChange={(e) => setNotificacionesConfig({ ...notificacionesConfig, sound: e.target.checked })}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Animación de entrada</label>
                                            <p className="text-xs text-gray-500">Efecto visual al mostrar notificaciones</p>
                                        </div>
                                        <select
                                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            value={notificacionesConfig.animation}
                                            onChange={(e) => setNotificacionesConfig({ ...notificacionesConfig, animation: e.target.value })}
                                        >
                                            <option value="slide">Deslizar</option>
                                            <option value="fade">Desvanecer</option>
                                            <option value="bounce">Rebote</option>
                                            <option value="scale">Escalar</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Vista previa */}
                            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Vista Previa</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button className="p-3 bg-green-50 border-2 border-green-200 rounded-lg text-left hover:bg-green-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <div>
                                                <p className="font-medium text-green-800">Operación exitosa</p>
                                                <p className="text-sm text-green-600">Los datos se guardaron correctamente</p>
                                            </div>
                                        </div>
                                    </button>

                                    <button className="p-3 bg-red-50 border-2 border-red-200 rounded-lg text-left hover:bg-red-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <div>
                                                <p className="font-medium text-red-800">Error en la operación</p>
                                                <p className="text-sm text-red-600">No se pudo completar la acción</p>
                                            </div>
                                        </div>
                                    </button>

                                    <button className="p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg text-left hover:bg-yellow-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <div>
                                                <p className="font-medium text-yellow-800">Advertencia</p>
                                                <p className="text-sm text-yellow-600">Revisa los datos ingresados</p>
                                            </div>
                                        </div>
                                    </button>

                                    <button className="p-3 bg-blue-50 border-2 border-blue-200 rounded-lg text-left hover:bg-blue-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <div>
                                                <p className="font-medium text-blue-800">Información</p>
                                                <p className="text-sm text-blue-600">Nueva actualización disponible</p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleGuardarNotificaciones}
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                >
                                    Guardar Configuración
                                </button>
                                <button
                                    onClick={handleRestablecerNotificaciones}
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                >
                                    Restablecer por Defecto
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Sección Personalización */}
                    {activeSection === 'personalizacion' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Personalización del Sistema</h2>
                            <p className="text-gray-600 mb-8">Personaliza la apariencia y configuración visual del sistema</p>
                            
                            {/* Logo Institucional */}
                            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Logo Institucional</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Subir Nuevo Logo
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors cursor-pointer">
                                            <input 
                                                type="file" 
                                                id="logoUpload"
                                                className="hidden" 
                                                accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp" 
                                                onChange={handleLogoUpload}
                                                disabled={uploadStatus.loading}
                                            />
                                            <label htmlFor="logoUpload" className="cursor-pointer">
                                                <div className="space-y-2">
                                                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        {uploadStatus.loading ? (
                                                            <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Image className="w-6 h-6 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {uploadStatus.loading ? 'Subiendo...' : 'Haz clic para subir'}
                                                        </p>
                                                        <p className="text-xs text-gray-500">PNG, JPG, SVG hasta 2MB</p>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>

                                        {uploadStatus.message && (
                                            <div className={`mt-3 p-3 rounded-lg text-sm ${
                                                uploadStatus.message.includes('Error') 
                                                    ? 'bg-red-50 text-red-700 border border-red-200' 
                                                    : 'bg-green-50 text-green-700 border border-green-200'
                                            }`}>
                                                {uploadStatus.message}
                                            </div>
                                        )}

                                        <button
                                            onClick={handleLogoReset}
                                            disabled={uploadStatus.loading}
                                            className="mt-4 w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                        >
                                            Restablecer Logo Predeterminado
                                        </button>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Vista Previa
                                        </label>
                                        <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center border border-gray-200" style={{ height: '128px', maxHeight: '128px', maxWidth: '100%', overflow: 'hidden' }}>
                                            <LogoDisplay 
                                                size="small"
                                                alt="Vista previa del logo"
                                                logoPath={currentLogoPath}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Paleta de colores */}
                            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Esquema de Colores</h3>
                                
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-600">Selecciona el color principal del sistema y ve los cambios en tiempo real</p>
                                    
                                    {/* Vista previa dinámica */}
                                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-xs text-gray-600 mb-3 font-medium">VISTA PREVIA DE LA BARRA DE NAVEGACIÓN</p>
                                        <div 
                                            id="color-preview-bar"
                                            className="h-12 rounded-lg shadow-md flex items-center px-4 text-white font-semibold transition-all duration-300"
                                            style={{ backgroundColor: `rgb(${colorMap[previewColor]?.[600]})` }}
                                        >
                                            Sistema SENA - Gestión de Asistencia
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-6 md:grid-cols-12 gap-3">
                                        {[
                                            { color: 'bg-green-600', name: 'Verde SENA', value: 'green' },
                                            { color: 'bg-blue-600', name: 'Azul Corporativo', value: 'blue' },
                                            { color: 'bg-indigo-600', name: 'Índigo', value: 'indigo' },
                                            { color: 'bg-purple-600', name: 'Púrpura', value: 'purple' },
                                            { color: 'bg-red-600', name: 'Rojo', value: 'red' },
                                            { color: 'bg-orange-600', name: 'Naranja', value: 'orange' },
                                            { color: 'bg-yellow-500', name: 'Amarillo', value: 'yellow' },
                                            { color: 'bg-teal-600', name: 'Teal', value: 'teal' },
                                            { color: 'bg-cyan-600', name: 'Cian', value: 'cyan' },
                                            { color: 'bg-gray-600', name: 'Gris', value: 'gray' },
                                            { color: 'bg-slate-600', name: 'Pizarra', value: 'slate' },
                                            { color: 'bg-stone-600', name: 'Piedra', value: 'stone' }
                                        ].map((colorOption, index) => (
                                            <div key={index} className="flex flex-col items-center">
                                                <button
                                                    className={`w-10 h-10 ${colorOption.color} rounded-lg border-2 transition-all hover:scale-110 ${
                                                        selectedColor === colorOption.value ? 'border-gray-800 ring-2 ring-gray-300 shadow-lg' : 'border-gray-200 hover:border-gray-400'
                                                    }`}
                                                    title={colorOption.name}
                                                    onClick={() => {
                                                        handleColorPreview(colorOption.value);
                                                        handleColorChange(colorOption.value);
                                                    }}
                                                />
                                                <span className="text-xs text-gray-600 mt-1 text-center">{colorOption.name.split(' ')[0]}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {colorSaveStatus.message && (
                                        <div className={`mt-4 p-3 rounded-lg text-sm ${
                                            colorSaveStatus.message.includes('Error') 
                                                ? 'bg-red-50 text-red-700 border border-red-200' 
                                                : 'bg-green-50 text-green-700 border border-green-200'
                                        }`}>
                                            {colorSaveStatus.message}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Idioma */}
                            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Idioma del Sistema</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { code: 'es', name: 'Español', flag: '🇪🇪', active: true },
                                        { code: 'en', name: 'English', flag: '🇺🇸' },
                                        { code: 'fr', name: 'Français', flag: '🇫🇷' },
                                        { code: 'pt', name: 'Português', flag: '🇵🇹' }
                                    ].map((lang) => (
                                        <button
                                            key={lang.code}
                                            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                                                lang.active 
                                                    ? 'border-green-500 bg-green-50 text-green-800' 
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="text-2xl">{lang.flag}</span>
                                            <span className="font-medium">{lang.name}</span>
                                            {lang.active && <span className="ml-auto text-green-600">✓</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleGuardarPersonalizacion}
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                >
                                    Aplicar Cambios
                                </button>
                                <button
                                    onClick={handleVistaPrevia}
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                >
                                    Vista Previa
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Sección Seguridad */}
                    {activeSection === 'seguridad' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Seguridad y Contraseñas</h2>
                            <p className="text-gray-600 mb-8">Configura las políticas de seguridad del sistema</p>
                            
                            {/* Estado de seguridad */}
                            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado de Seguridad</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-green-800">Contraseñas Seguras</p>
                                            <p className="text-xs text-green-600">Activo</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-yellow-800">Autenticación 2FA</p>
                                            <p className="text-xs text-yellow-600">Opcional</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-red-800">Bloqueo Automático</p>
                                            <p className="text-xs text-red-600">Inactivo</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Políticas de contraseña */}
                            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Políticas de Contraseña</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Longitud mínima</label>
                                            <p className="text-xs text-gray-500">Número mínimo de caracteres</p>
                                        </div>
                                        <select
                                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            value={securityConfig.min_length}
                                            onChange={(e) => setSecurityConfig({ ...securityConfig, min_length: e.target.value })}
                                        >
                                            <option value="6">6</option>
                                            <option value="8">8</option>
                                            <option value="10">10</option>
                                            <option value="12">12</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Incluir mayúsculas</label>
                                            <p className="text-xs text-gray-500">Al menos una letra mayúscula</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={securityConfig.require_uppercase}
                                                onChange={(e) => setSecurityConfig({ ...securityConfig, require_uppercase: e.target.checked })}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Incluir números</label>
                                            <p className="text-xs text-gray-500">Al menos un dígito</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={securityConfig.require_numbers}
                                                onChange={(e) => setSecurityConfig({ ...securityConfig, require_numbers: e.target.checked })}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Caracteres especiales</label>
                                            <p className="text-xs text-gray-500">Al menos un símbolo (!@#$%^&*)</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={securityConfig.require_special}
                                                onChange={(e) => setSecurityConfig({ ...securityConfig, require_special: e.target.checked })}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Expiración de contraseña</label>
                                            <p className="text-xs text-gray-500">Días antes de cambio obligatorio</p>
                                        </div>
                                        <select
                                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            value={securityConfig.expiration_days}
                                            onChange={(e) => setSecurityConfig({ ...securityConfig, expiration_days: e.target.value })}
                                        >
                                            <option value="30">30 días</option>
                                            <option value="60">60 días</option>
                                            <option value="90">90 días</option>
                                            <option value="0">Nunca</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex gap-4 mt-8">
                                    <button
                                        onClick={handleGuardarSeguridad}
                                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg"
                                    >
                                        Guardar Políticas
                                    </button>
                                    <button
                                        onClick={cancelar}
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sección Respaldo y Restauración */}
                    {activeSection === 'respaldo' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Respaldo y Restauración</h2>
                            <p className="text-gray-600 mb-8">Gestiona las copias de seguridad de la base de datos</p>
                            
                            {/* Estado de respaldos */}
                            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Respaldar Base de Datos</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <div>
                                            <p className="font-medium text-blue-900">Último respaldo</p>
                                            <p className="text-sm text-blue-700">26 de noviembre de 2025 - 10:30 AM</p>
                                        </div>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            Ver Detalles
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Respaldo automático</label>
                                            <p className="text-xs text-gray-500">Crear respaldos automáticamente</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Frecuencia</label>
                                            <p className="text-xs text-gray-500">Cada cuánto tiempo realizar respaldos</p>
                                        </div>
                                        <select className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                            <option value="daily">Diariamente</option>
                                            <option value="weekly" defaultValue>Semanalmente</option>
                                            <option value="monthly">Mensualmente</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button
                                        onClick={handleCrearRespaldo}
                                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg"
                                    >
                                        Crear Respaldo Ahora
                                    </button>
                                    <button
                                        onClick={() => handleDescargarRespaldo('ultimo-respaldo')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg"
                                    >
                                        Descargar Último Respaldo
                                    </button>
                                </div>
                            </div>

                            {/* Historial de respaldos */}
                            <div className="bg-white rounded-lg p-6 border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Historial de Respaldos</h3>
                                
                                <div className="space-y-2">
                                    {[
                                        { date: '26/11/2025 10:30 AM', size: '45.2 MB', status: 'Completado' },
                                        { date: '25/11/2025 10:30 AM', size: '44.8 MB', status: 'Completado' },
                                        { date: '24/11/2025 10:30 AM', size: '44.5 MB', status: 'Completado' },
                                        { date: '23/11/2025 10:30 AM', size: '43.9 MB', status: 'Completado' },
                                    ].map((backup, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div>
                                                <p className="font-medium text-gray-900">{backup.date}</p>
                                                <p className="text-sm text-gray-600">Tamaño: {backup.size}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                    {backup.status}
                                                </span>
                                                <button
                                                    onClick={() => handleDescargarRespaldo(backup.date)}
                                                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                >
                                                    Descargar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sección Configuración Avanzada */}
                    {activeSection === 'avanzada' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Configuración Avanzada</h2>
                            <p className="text-gray-600 mb-8">Opciones avanzadas para administradores experimentados</p>
                            
                            {/* Opciones avanzadas */}
                            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Opciones del Sistema</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Modo de depuración</label>
                                            <p className="text-xs text-gray-500">Mostrar detalles técnicos y errores</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Registro de auditoría</label>
                                            <p className="text-xs text-gray-500">Registrar todas las acciones de administrador</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Caché del sistema</label>
                                            <p className="text-xs text-gray-500">Activar almacenamiento en caché para mejorar rendimiento</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Modo mantenimiento</label>
                                            <p className="text-xs text-gray-500">Desactivar acceso de usuarios mientras se realiza mantenimiento</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Acciones peligrosas */}
                            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                                <h3 className="text-lg font-semibold text-red-800 mb-4">Acciones Peligrosas</h3>
                                <p className="text-sm text-red-700 mb-4">Estas acciones no se pueden deshacer. Úsalas con cuidado.</p>
                                
                                <div className="space-y-3">
                                    <button
                                        onClick={handleLimpiarCache}
                                        className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                                    >
                                        Limpiar Caché del Sistema
                                    </button>
                                    <button
                                        onClick={handleRestablecerConfig}
                                        className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                                    >
                                        Restablecer Configuración a Valores Predeterminados
                                    </button>
                                    <button
                                        onClick={handleEliminarDatos}
                                        className="w-full px-4 py-3 bg-red-800 hover:bg-red-900 text-white font-medium rounded-lg transition-colors"
                                    >
                                        Eliminar Todos los Datos (Irreversible)
                                    </button>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={handleGuardarAvanzada}
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                >
                                    Guardar Configuración Avanzada
                                </button>
                                <button
                                    onClick={cancelar}
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </SidebarLayout>
    );
}