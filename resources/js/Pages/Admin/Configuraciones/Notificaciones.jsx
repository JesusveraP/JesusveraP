import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, RotateCcw } from 'lucide-react';

export default function Notificaciones({ settings = {} }) {
    const { data, setData, put, processing, errors } = useForm({
        color: settings.color || 'green',
        duration: settings.duration || 5,
        position: settings.position || 'top',
        automatic_notifications: settings.automatic_notifications ?? true
    });

    const [previewNotification, setPreviewNotification] = useState(false);

    // Colores disponibles
    const colorOptions = [
        { value: 'green', label: 'Verde', class: 'bg-green-500' },
        { value: 'blue', label: 'Azul', class: 'bg-blue-600' },
        { value: 'cyan', label: 'Cian', class: 'bg-cyan-400' }
    ];

    // Posiciones disponibles
    const positionOptions = [
        { value: 'top', label: 'Arriba' },
        { value: 'center', label: 'Centro' },
        { value: 'bottom', label: 'Abajo' }
    ];

    // Opciones de duración
    const durationOptions = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30];

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.notifications.update'));
    };

    const resetToDefaults = () => {
        if (confirm('¿Estás seguro de restablecer todas las configuraciones a los valores por defecto?')) {
            put(route('admin.notifications.reset'));
        }
    };

    const showPreview = () => {
        setPreviewNotification(true);
        setTimeout(() => {
            setPreviewNotification(false);
        }, data.duration * 1000);
    };

    const getNotificationStyle = () => {
        const colorClass = colorOptions.find(c => c.value === data.color)?.class || 'bg-green-500';
        
        const positionClasses = {
            top: 'top-4',
            center: 'top-1/2 transform -translate-y-1/2',
            bottom: 'bottom-4'
        };

        return `${colorClass} ${positionClasses[data.position] || positionClasses.top}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Mensajes flash / Notificaciones - SENA" />
            
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <Link 
                                href={route('admin.configuraciones')}
                                className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900">Mensajes flash / Notificaciones</h1>
                        </div>
                        <Link
                            href={route('admin.configuraciones')}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Volver
                        </Link>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Sección Colores */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Colores</h2>
                        
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Color:</label>
                            <div className="flex space-x-3">
                                {colorOptions.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => setData('color', color.value)}
                                        className={`w-16 h-16 rounded-lg ${color.class} border-4 transition-all ${
                                            data.color === color.value 
                                                ? 'border-gray-800 scale-110' 
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                        title={color.label}
                                    />
                                ))}
                            </div>
                            {errors.color && (
                                <p className="text-red-500 text-sm mt-1">{errors.color}</p>
                            )}
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Duración en pantalla:
                            </label>
                            <select
                                value={data.duration}
                                onChange={(e) => setData('duration', parseInt(e.target.value))}
                                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                {durationOptions.map((seconds) => (
                                    <option key={seconds} value={seconds}>
                                        {seconds}
                                    </option>
                                ))}
                            </select>
                            <span className="ml-2 text-sm text-gray-600">segundos</span>
                            {errors.duration && (
                                <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                            )}
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Posición:
                            </label>
                            <select
                                value={data.position}
                                onChange={(e) => setData('position', e.target.value)}
                                className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                {positionOptions.map((position) => (
                                    <option key={position.value} value={position.value}>
                                        {position.label}
                                    </option>
                                ))}
                            </select>
                            {errors.position && (
                                <p className="text-red-500 text-sm mt-1">{errors.position}</p>
                            )}
                        </div>
                    </div>

                    {/* Sección Notificaciones */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Notificaciones</h2>
                        
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="automatic_notifications"
                                checked={data.automatic_notifications}
                                onChange={(e) => setData('automatic_notifications', e.target.checked)}
                                className="w-5 h-5 text-cyan-400 bg-gray-100 border-gray-300 rounded focus:ring-cyan-400 focus:ring-2"
                            />
                            <label htmlFor="automatic_notifications" className="text-lg font-medium text-gray-900">
                                Notificaciones automáticas
                            </label>
                        </div>
                        
                        <p className="mt-2 text-sm text-gray-600">
                            Permite que el sistema envíe notificaciones automáticas cuando ocurran eventos importantes
                        </p>
                        {errors.automatic_notifications && (
                            <p className="text-red-500 text-sm mt-1">{errors.automatic_notifications}</p>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={showPreview}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                            Vista previa
                        </button>

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={resetToDefaults}
                                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <RotateCcw size={16} className="mr-2" />
                                Restablecer
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <CheckCircle size={16} className="mr-2" />
                                {processing ? 'Guardando...' : 'Guardar configuración'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Notificación de vista previa */}
            {previewNotification && (
                <div className={`fixed left-1/2 transform -translate-x-1/2 z-50 ${getNotificationStyle()}`}>
                    <div className="text-white px-6 py-3 rounded-lg shadow-lg max-w-md">
                        <p className="font-medium">Vista previa de notificación</p>
                        <p className="text-sm opacity-90">
                            Esta es una muestra de cómo se verán las notificaciones con la configuración actual
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}