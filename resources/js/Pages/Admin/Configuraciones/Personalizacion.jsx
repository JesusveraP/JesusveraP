import { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import useSystemColors from '@/hooks/useSystemColors';
import { ArrowLeft, Upload, Palette, Globe, RotateCcw, CheckCircle, ChevronDown, Check, AlertCircle } from 'lucide-react';

export default function Personalizacion({ settings = {} }) {
    const { systemSettings } = usePage().props;
    const { colors } = useSystemColors();
    
    // Estados del componente
    const [logoPreview, setLogoPreview] = useState(settings.logo_path || '/images/sena-logo.png');
    const [dragOver, setDragOver] = useState(false);
    const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
    const [logoLoading, setLogoLoading] = useState(false);
    const [logoError, setLogoError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        language: settings.language || 'es',
        color_scheme: settings.color_scheme || 'green-600',
        system_name: settings.system_name || 'Gestión Instructores SENA',
    });

    // Lenguajes disponibles
    const languages = [
        { value: 'es', label: 'Español', flag: '🇪🇸' },
        { value: 'en', label: 'English', flag: '🇺🇸' },
        { value: 'fr', label: 'Français', flag: '🇫🇷' },
        { value: 'pt', label: 'Português', flag: '🇧🇷' }
    ];

    // Opciones de colores organizadas por categoría
    const colorOptions = [
        { value: 'green-500', class: 'bg-green-500', label: 'Verde SENA Claro', category: '🇨🇴 Verdes SENA', hex: '#22C55E' },
        { value: 'green-600', class: 'bg-green-600', label: 'Verde SENA Oficial', category: '🇨🇴 Verdes SENA', hex: '#16A34A' },
        { value: 'green-700', class: 'bg-green-700', label: 'Verde SENA Oscuro', category: '🇨🇴 Verdes SENA', hex: '#15803D' },
        { value: 'green-800', class: 'bg-green-800', label: 'Verde SENA Intenso', category: '🇨🇴 Verdes SENA', hex: '#166534' },
        { value: 'emerald-500', class: 'bg-emerald-500', label: 'Esmeralda Claro', category: '🇨🇴 Verdes SENA', hex: '#10B981' },
        { value: 'emerald-600', class: 'bg-emerald-600', label: 'Esmeralda Medio', category: '🇨🇴 Verdes SENA', hex: '#059669' },

        { value: 'blue-500', class: 'bg-blue-500', label: 'Azul Cielo', category: '💙 Azules Corporativos', hex: '#3B82F6' },
        { value: 'blue-600', class: 'bg-blue-600', label: 'Azul Corporativo', category: '💙 Azules Corporativos', hex: '#2563EB' },
        { value: 'blue-700', class: 'bg-blue-700', label: 'Azul Profesional', category: '💙 Azules Corporativos', hex: '#1D4ED8' },
        { value: 'blue-800', class: 'bg-blue-800', label: 'Azul Ejecutivo', category: '💙 Azules Corporativos', hex: '#1E40AF' },
        { value: 'sky-500', class: 'bg-sky-500', label: 'Azul Cielo Claro', category: '💙 Azules Corporativos', hex: '#0EA5E9' },
        { value: 'sky-600', class: 'bg-sky-600', label: 'Azul Cielo Medio', category: '💙 Azules Corporativos', hex: '#0284C7' },

        { value: 'indigo-500', class: 'bg-indigo-500', label: 'Índigo Claro', category: '💜 Púrpuras y Añiles', hex: '#6366F1' },
        { value: 'indigo-600', class: 'bg-indigo-600', label: 'Índigo Corporativo', category: '💜 Púrpuras y Añiles', hex: '#4F46E5' },
        { value: 'purple-500', class: 'bg-purple-500', label: 'Púrpura Innovación', category: '💜 Púrpuras y Añiles', hex: '#A855F7' },
        { value: 'purple-600', class: 'bg-purple-600', label: 'Púrpura Tecnología', category: '💜 Púrpuras y Añiles', hex: '#9333EA' },
        { value: 'violet-500', class: 'bg-violet-500', label: 'Violeta Moderno', category: '💜 Púrpuras y Añiles', hex: '#8B5CF6' },
        { value: 'violet-600', class: 'bg-violet-600', label: 'Violeta Profundo', category: '💜 Púrpuras y Añiles', hex: '#7C3AED' },

        { value: 'teal-500', class: 'bg-teal-500', label: 'Teal Fresco', category: '🌊 Aguamarinas y Cianes', hex: '#14B8A6' },
        { value: 'teal-600', class: 'bg-teal-600', label: 'Teal Equilibrado', category: '🌊 Aguamarinas y Cianes', hex: '#0D9488' },
        { value: 'cyan-400', class: 'bg-cyan-400', label: 'Cian Brillante', category: '🌊 Aguamarinas y Cianes', hex: '#22D3EE' },
        { value: 'cyan-500', class: 'bg-cyan-500', label: 'Cian Digital', category: '🌊 Aguamarinas y Cianes', hex: '#06B6D4' },
        { value: 'cyan-600', class: 'bg-cyan-600', label: 'Cian Profundo', category: '🌊 Aguamarinas y Cianes', hex: '#0891B2' },

        { value: 'red-500', class: 'bg-red-500', label: 'Rojo Alerta', category: '🔴 Rojos y Naranjas', hex: '#EF4444' },
        { value: 'red-600', class: 'bg-red-600', label: 'Rojo Corporativo', category: '🔴 Rojos y Naranjas', hex: '#DC2626' },
        { value: 'orange-500', class: 'bg-orange-500', label: 'Naranja Energía', category: '🔴 Rojos y Naranjas', hex: '#F97316' },
        { value: 'orange-600', class: 'bg-orange-600', label: 'Naranja Vibrante', category: '🔴 Rojos y Naranjas', hex: '#EA580C' },
        { value: 'amber-500', class: 'bg-amber-500', label: 'Ámbar Cálido', category: '🔴 Rojos y Naranjas', hex: '#F59E0B' },
        { value: 'yellow-500', class: 'bg-yellow-500', label: 'Amarillo Atención', category: '🔴 Rojos y Naranjas', hex: '#EAB308' },

        { value: 'slate-600', class: 'bg-slate-600', label: 'Gris Azulado', category: '⚫ Grises Profesionales', hex: '#475569' },
        { value: 'slate-700', class: 'bg-slate-700', label: 'Gris Azulado Oscuro', category: '⚫ Grises Profesionales', hex: '#334155' },
        { value: 'gray-600', class: 'bg-gray-600', label: 'Gris Neutro', category: '⚫ Grises Profesionales', hex: '#4B5563' },
        { value: 'gray-700', class: 'bg-gray-700', label: 'Gris Elegante', category: '⚫ Grises Profesionales', hex: '#374151' },
        { value: 'zinc-600', class: 'bg-zinc-600', label: 'Zinc Moderno', category: '⚫ Grises Profesionales', hex: '#52525B' },
        { value: 'stone-600', class: 'bg-stone-600', label: 'Piedra Natural', category: '⚫ Grises Profesionales', hex: '#57534E' },
    ];

    // Agrupar colores por categoría
    const colorCategories = colorOptions.reduce((acc, color) => {
        if (!acc[color.category]) {
            acc[color.category] = [];
        }
        acc[color.category].push(color);
        return acc;
    }, {});

    // Obtener color actual seleccionado
    const getCurrentColor = () => {
        return colorOptions.find(color => color.value === data.color_scheme) || colorOptions[1];
    };

    // Obtener idioma actual
    const getCurrentLanguage = () => {
        return languages.find(lang => lang.value === data.language) || languages[0];
    };

    // Manejar envío del formulario (nombre, idioma, color)
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.customization.update'), {
            onSuccess: (response) => {
                setSuccessMessage('✅ Configuración actualizada exitosamente');
                setTimeout(() => setSuccessMessage(''), 3000);
            },
            onError: (errors) => {
                console.error('Errores:', errors);
            }
        });
    };

    // Cambiar color del sistema
    const handleColorChange = (colorValue) => {
        setData('color_scheme', colorValue);
        setColorDropdownOpen(false);
        
        // Guardar el cambio de color inmediatamente
        post(route('admin.customization.update'), {
            data: {
                color_scheme: colorValue,
                system_name: data.system_name,
                language: data.language
            },
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('✅ Color actualizado exitosamente');
                setTimeout(() => setSuccessMessage(''), 3000);
            },
            onError: (errors) => {
                console.error('Error al cambiar color:', errors);
                alert('Error al guardar el color');
            }
        });
    };

    // Manejar carga de logo
    const handleLogoUpload = async (file) => {
        if (!file) {
            setLogoError('No se seleccionó archivo');
            return;
        }

        if (!file.type.startsWith('image/')) {
            setLogoError('Por favor selecciona un archivo de imagen válido (PNG, JPG, GIF, SVG).');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setLogoError('El archivo es demasiado grande. El tamaño máximo es 2MB.');
            return;
        }

        setLogoLoading(true);
        setLogoError(null);
        setUploadSuccess(false);

        try {
            // Mostrar vista previa inmediatamente con base64
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target.result);
            };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('logo', file);
            
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            if (!csrfToken) {
                throw new Error('Token CSRF no encontrado');
            }

            const response = await fetch(route('admin.customization.upload-logo'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                body: formData
            });

            const responseText = await response.text();
            
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Error al parsear JSON:', parseError);
                console.error('Respuesta del servidor:', responseText);
                setLogoError('Respuesta inválida del servidor');
                setLogoPreview(settings.logo_path || '/images/sena-logo.png');
                setLogoLoading(false);
                return;
            }

            if (response.ok && result.success) {
                setLogoError(null);
                setUploadSuccess(true);
                setLogoLoading(false);
                
                // Mostrar mensaje de éxito
                setSuccessMessage('✅ Logo actualizado exitosamente. Recargando...');
                
                // Recargar la página después de 1.5 segundos para que se propague el cambio
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                const errorMsg = result.message || 'No se pudo subir el logo';
                setLogoError(errorMsg);
                setLogoPreview(settings.logo_path || '/images/sena-logo.png');
                setLogoLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setLogoError(error.message || 'Error desconocido al subir el archivo');
            setLogoPreview(settings.logo_path || '/images/sena-logo.png');
            setLogoLoading(false);
        }
    };

    // Manejo de arrastrar archivo
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleLogoUpload(files[0]);
        }
    };

    // Restablecer configuración a valores por defecto
    const resetToDefaults = () => {
        if (confirm('¿Estás seguro de restablecer todas las configuraciones a los valores por defecto?')) {
            post(route('admin.customization.reset'), {
                onSuccess: () => {
                    setSuccessMessage('✅ Configuración restablecida a valores por defecto');
                    setTimeout(() => window.location.reload(), 2000);
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Personalización del Sistema - SENA" />
            
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <Link 
                                href={route('admin.configuraciones')}
                                className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <div className="flex items-center">
                                <Palette className="mr-3 text-green-600" size={28} />
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Personalización del Sistema
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Personaliza la apariencia y configuración visual del sistema
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={resetToDefaults}
                            disabled={processing}
                            className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg disabled:opacity-50"
                        >
                            <RotateCcw size={16} className="mr-2" />
                            Restablecer
                        </button>
                    </div>
                </div>
            </div>

            {/* Mensaje de éxito */}
            {successMessage && (
                <div className="bg-green-50 border-b border-green-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center">
                            <CheckCircle className="text-green-600 mr-3" size={20} />
                            <p className="text-green-700 font-medium">{successMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Contenido Principal */}
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Panel Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Información General */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Globe className="mr-2 text-blue-600" size={20} />
                                    Información General
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre del Sistema
                                        </label>
                                        <input
                                            type="text"
                                            value={data.system_name}
                                            onChange={(e) => setData('system_name', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            placeholder="Gestión Instructores SENA"
                                        />
                                        {errors.system_name && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle size={14} className="mr-1" /> {errors.system_name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Idioma del Sistema
                                        </label>
                                        <select
                                            value={data.language}
                                            onChange={(e) => setData('language', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        >
                                            {languages.map((lang) => (
                                                <option key={lang.value} value={lang.value}>
                                                    {lang.flag} {lang.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.language && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle size={14} className="mr-1" /> {errors.language}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Esquema de Colores */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Palette className="mr-2 text-purple-600" size={20} />
                                    Esquema de Colores
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Color Principal del Sistema
                                        </label>
                                        
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
                                                className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 focus:ring-2 focus:ring-green-500 transition-all"
                                            >
                                                <div className="flex items-center">
                                                    <div className={`w-6 h-6 rounded-full ${getCurrentColor().class} mr-3 border-2 border-white shadow-md`}></div>
                                                    <div className="text-left">
                                                        <span className="font-medium text-gray-900 block">{getCurrentColor().label}</span>
                                                        <span className="text-xs text-gray-500">{getCurrentColor().hex}</span>
                                                    </div>
                                                </div>
                                                <ChevronDown size={20} className={`text-gray-400 transition-transform ${colorDropdownOpen ? 'transform rotate-180' : ''}`} />
                                            </button>

                                            {colorDropdownOpen && (
                                                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                                                    {Object.entries(colorCategories).map(([category, categoryColors]) => (
                                                        <div key={category} className="p-4 border-b border-gray-100 last:border-b-0">
                                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">{category}</h4>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {categoryColors.map((color) => (
                                                                    <button
                                                                        key={color.value}
                                                                        type="button"
                                                                        onClick={() => handleColorChange(color.value)}
                                                                        className={`flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all ${
                                                                            data.color_scheme === color.value ? 'bg-gray-100 ring-2 ring-green-500' : 'border border-gray-200'
                                                                        }`}
                                                                    >
                                                                        <div className={`w-5 h-5 rounded-full ${color.class} mr-2 border border-gray-300 flex-shrink-0`}></div>
                                                                        <div className="text-left flex-1 min-w-0">
                                                                            <span className="text-sm font-medium text-gray-900 block truncate">{color.label}</span>
                                                                            <span className="text-xs text-gray-500">{color.hex}</span>
                                                                        </div>
                                                                        {data.color_scheme === color.value && (
                                                                            <Check size={16} className="text-green-600 ml-2 flex-shrink-0" />
                                                                        )}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Vista previa de color */}
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Vista Previa del Color</h4>
                                        <div className="flex flex-wrap gap-3">
                                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white ${getCurrentColor().class}`}>
                                                Etiqueta
                                            </span>
                                            <button type="button" className={`px-4 py-2 ${getCurrentColor().class} text-white rounded-lg hover:opacity-90 transition-opacity font-medium`}>
                                                Botón Principal
                                            </button>
                                            <div className={`w-12 h-12 ${getCurrentColor().class} rounded-lg shadow-md`}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Logotipo */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Upload className="mr-2 text-orange-600" size={20} />
                                    Logotipo del Sistema
                                </h3>
                                
                                {uploadSuccess && (
                                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                                        <CheckCircle className="text-green-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
                                        <div>
                                            <p className="text-sm font-medium text-green-900">Logo actualizado exitosamente</p>
                                            <p className="text-xs text-green-700 mt-1">Recargando página...</p>
                                        </div>
                                    </div>
                                )}
                                
                                {logoError && (
                                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                                        <AlertCircle className="text-red-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
                                        <p className="text-sm text-red-700">{logoError}</p>
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Área de carga */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Subir Nuevo Logotipo
                                        </label>
                                        <div
                                            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                                                dragOver 
                                                    ? 'border-green-400 bg-green-50' 
                                                    : 'border-gray-300 hover:border-green-400 bg-white'
                                            } ${logoLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            onClick={() => !logoLoading && document.getElementById('logoInput').click()}
                                        >
                                            <Upload className={`mx-auto h-12 w-12 mb-2 ${logoLoading ? 'text-gray-300 animate-pulse' : 'text-gray-400'}`} />
                                            <p className="text-sm font-medium text-gray-700">
                                                {logoLoading ? 'Cargando logo...' : 'Arrastra aquí o haz clic'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PNG, JPG, SVG • Máximo 2MB
                                            </p>
                                            <input
                                                id="logoInput"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                disabled={logoLoading}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) handleLogoUpload(file);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Preview actual */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Logotipo Actual
                                        </label>
                                        <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center h-40 border border-gray-200">
                                            <img
                                                key={logoPreview}
                                                src={logoPreview}
                                                alt="Logo del sistema"
                                                className="max-h-28 max-w-full object-contain"
                                                onError={(e) => {
                                                    e.target.src = '/images/sena-logo.png';
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 text-center">
                                            Logo actual: {logoPreview.split('/').pop()?.split('?')[0] || 'sena-logo.png'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex justify-end space-x-3">
                                <Link
                                    href={route('admin.configuraciones')}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`px-6 py-2 ${getCurrentColor().class} text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center`}
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Guardando...
                                        </>
                                    ) : (
                                        'Guardar Cambios'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Panel Lateral */}
                    <div className="space-y-6">
                        {/* Configuración Actual */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <CheckCircle className="mr-2 text-green-600" size={20} />
                                Configuración Actual
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="pb-4 border-b border-gray-100">
                                    <span className="text-xs font-semibold text-gray-500 uppercase">Nombre del Sistema</span>
                                    <p className="text-gray-900 font-medium mt-1">{data.system_name || 'No configurado'}</p>
                                </div>
                                
                                <div className="pb-4 border-b border-gray-100">
                                    <span className="text-xs font-semibold text-gray-500 uppercase">Idioma</span>
                                    <p className="text-gray-900 font-medium mt-1">{getCurrentLanguage().flag} {getCurrentLanguage().label}</p>
                                </div>
                                
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 uppercase">Color Principal</span>
                                    <div className="flex items-center mt-2">
                                        <div className={`w-5 h-5 rounded-full ${getCurrentColor().class} mr-2`}></div>
                                        <span className="text-gray-900 font-medium">{getCurrentColor().label}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                                💡 Consejos
                            </h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li className="flex items-start">
                                    <span className="mr-2">✓</span>
                                    <span>El verde SENA es el color oficial recomendado</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">✓</span>
                                    <span>El logo debe ser SVG o PNG de alta calidad</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">✓</span>
                                    <span>Los cambios se aplican inmediatamente</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">✓</span>
                                    <span>El logo aparece en toda la aplicación</span>
                                </li>
                            </ul>
                        </div>

                        {/* Información */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                            <h3 className="font-semibold text-gray-900 mb-3">ℹ️ Información</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div>
                                    <span className="font-medium">Versión:</span> 2.1.0
                                </div>
                                <div>
                                    <span className="font-medium">Última actualización:</span>
                                    <br />{new Date().toLocaleDateString('es-ES')}
                                </div>
                                <div>
                                    <span className="font-medium">Desarrollado por:</span> SENA
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}