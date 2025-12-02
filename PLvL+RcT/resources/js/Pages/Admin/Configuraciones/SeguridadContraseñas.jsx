import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import useSystemColors from '@/hooks/useSystemColors';
import { 
    ArrowLeft, 
    Shield, 
    Lock, 
    Key, 
    AlertTriangle,
    CheckCircle,
    RotateCcw,
    Save,
    Settings
} from 'lucide-react';

export default function SeguridadContraseñas({ securitySettings }) {
    const { colors } = useSystemColors();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        // Políticas de contraseña
        password_min_length_enabled: securitySettings.password_min_length_enabled || true,
        password_min_length: securitySettings.password_min_length || 8,
        password_require_mixed_case: securitySettings.password_require_uppercase || false,
        password_require_numbers: securitySettings.password_require_numbers || false,
        password_require_symbols: securitySettings.password_require_symbols || false,
        password_mixed_case_enabled: securitySettings.password_mixed_case_enabled || true,

        // 2FA
        two_factor_enabled: securitySettings.two_factor_enabled || false,
        two_factor_method: securitySettings.two_factor_method || 'email',

        // Bloqueo automático
        auto_lock_enabled: securitySettings.auto_lock_enabled || true,
        auto_lock_attempts: securitySettings.auto_lock_attempts || 3,

        // Recuperación de contraseña
        password_recovery_enabled: securitySettings.password_recovery_enabled || true,
        password_recovery_method: securitySettings.password_recovery_method || 'email',
        recovery_code_expiry: securitySettings.recovery_code_expiry || 15,
        recovery_attempts_limit: securitySettings.recovery_attempts_limit || 3
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        post(route('configuraciones.seguridad'), {
            onSuccess: () => {
                alert('Configuraciones de seguridad actualizadas exitosamente');
            },
            onError: (errors) => {
                console.error('Errores:', errors);
                alert('Error al actualizar las configuraciones');
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    };

    const resetToDefaults = () => {
        if (confirm('¿Estás seguro de restablecer todas las configuraciones de seguridad a los valores por defecto?')) {
            post(route('configuraciones.resetear-contraseñas'), {
                onSuccess: () => {
                    alert('Configuraciones restablecidas a valores por defecto');
                    window.location.reload();
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Seguridad y Contraseñas - SENA" />
            
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
                            <div className="flex items-center">
                                <Shield className={`mr-3 ${colors.primaryText}`} size={24} />
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Seguridad y Contraseñas
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        Configura las políticas de seguridad del sistema
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={resetToDefaults}
                                className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
                            >
                                <RotateCcw size={16} className="mr-2" />
                                Restablecer
                            </button>
                            <Link
                                href={route('admin.configuraciones')}
                                className={`px-4 py-2 ${colors.primary} text-white rounded-md hover:opacity-90 transition-opacity`}
                            >
                                Volver
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Definir políticas de contraseña */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                            Definir políticas de contraseña
                        </h3>
                        
                        <div className="space-y-6">
                            {/* Mínimo 8 caracteres */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="password_min_length_enabled"
                                        checked={data.password_min_length_enabled}
                                        onChange={(e) => setData('password_min_length_enabled', e.target.checked)}
                                        className={`h-4 w-4 ${colors.primary} border-gray-300 rounded focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                    />
                                    <label htmlFor="password_min_length_enabled" className="ml-3 text-base font-medium text-gray-900">
                                        Mínimo {data.password_min_length} caracteres.
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        min="6"
                                        max="20"
                                        value={data.password_min_length}
                                        onChange={(e) => setData('password_min_length', parseInt(e.target.value))}
                                        className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center text-sm"
                                        disabled={!data.password_min_length_enabled}
                                    />
                                    <span className="text-sm text-gray-500">caracteres</span>
                                </div>
                            </div>

                            {/* Separador */}
                            <hr className="border-gray-200" />

                            {/* Uso de mayúsculas, números y caracteres especiales */}
                            <div>
                                <h4 className="text-base font-medium text-gray-900 mb-4">
                                    Uso de mayúsculas, números y caracteres especiales
                                </h4>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="password_mixed_case_enabled"
                                            checked={data.password_mixed_case_enabled}
                                            onChange={(e) => setData('password_mixed_case_enabled', e.target.checked)}
                                            className={`h-4 w-4 ${colors.primary} border-gray-300 rounded focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                        />
                                        <label htmlFor="password_mixed_case_enabled" className="ml-3 text-base font-medium text-gray-900">
                                            Activar / caulmenar
                                        </label>
                                    </div>
                                </div>

                                {data.password_mixed_case_enabled && (
                                    <div className="mt-4 ml-7 space-y-3">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="password_require_mixed_case"
                                                checked={data.password_require_mixed_case}
                                                onChange={(e) => setData('password_require_mixed_case', e.target.checked)}
                                                className={`h-4 w-4 ${colors.primary} border-gray-300 rounded focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                            />
                                            <label htmlFor="password_require_mixed_case" className="ml-3 text-sm text-gray-700">
                                                Requerir mayúsculas y minúsculas
                                            </label>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="password_require_numbers"
                                                checked={data.password_require_numbers}
                                                onChange={(e) => setData('password_require_numbers', e.target.checked)}
                                                className={`h-4 w-4 ${colors.primary} border-gray-300 rounded focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                            />
                                            <label htmlFor="password_require_numbers" className="ml-3 text-sm text-gray-700">
                                                Requerir números
                                            </label>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="password_require_symbols"
                                                checked={data.password_require_symbols}
                                                onChange={(e) => setData('password_require_symbols', e.target.checked)}
                                                className={`h-4 w-4 ${colors.primary} border-gray-300 rounded focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                            />
                                            <label htmlFor="password_require_symbols" className="ml-3 text-sm text-gray-700">
                                                Requerir caracteres especiales (!@#$%^&*)
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Activar/desactivar autenticación en dos pasos (2FA) */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                            Activar/desactivar autenticación en dos pasos (2FA)
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="two_factor_enabled"
                                        checked={data.two_factor_enabled}
                                        onChange={(e) => setData('two_factor_enabled', e.target.checked)}
                                        className={`h-4 w-4 ${colors.primary} border-gray-300 rounded focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                    />
                                    <label htmlFor="two_factor_enabled" className="ml-3 text-base font-medium text-gray-900">
                                        Activar autenticación en dos pasos
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="two_factor_auto_lock"
                                        checked={data.two_factor_auto_lock}
                                        onChange={(e) => setData('two_factor_auto_lock', e.target.checked)}
                                        className={`h-4 w-4 ${colors.primary} border-gray-300 rounded focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                        disabled={!data.two_factor_enabled}
                                    />
                                    <label htmlFor="two_factor_auto_lock" className="ml-3 text-base font-medium text-gray-900">
                                        Bloqueo automático
                                    </label>
                                </div>
                            </div>

                            {!data.two_factor_enabled && (
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <div className="flex items-center">
                                        <AlertTriangle className="text-yellow-600" size={16} />
                                        <p className="ml-2 text-sm text-yellow-800">
                                            La autenticación en dos pasos está desactivada. Se recomienda activarla para mayor seguridad.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bloqueo automático tras X intentos fallidos */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                            Bloqueo automático tras X intentos fallidos de inicio de sesión
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="auto_lock_enabled"
                                        checked={data.auto_lock_enabled}
                                        onChange={(e) => setData('auto_lock_enabled', e.target.checked)}
                                        className={`h-4 w-4 ${colors.primary} border-gray-300 rounded focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                    />
                                    <label htmlFor="auto_lock_enabled" className="ml-3 text-base font-medium text-gray-900">
                                        Bloqueo automático
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <label className="text-sm font-medium text-gray-700">
                                    Número máximo de intentos:
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={data.auto_lock_attempts}
                                    onChange={(e) => setData('auto_lock_attempts', parseInt(e.target.value))}
                                    className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center"
                                    disabled={!data.auto_lock_enabled}
                                />
                                <span className="text-sm text-gray-500">intentos</span>
                            </div>

                            {data.auto_lock_enabled && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                    <div className="flex items-center">
                                        <CheckCircle className="text-green-600" size={16} />
                                        <p className="ml-2 text-sm text-green-800">
                                            Los usuarios serán bloqueados automáticamente después de {data.auto_lock_attempts} intentos fallidos de inicio de sesión.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recuperación de contraseña por email o teléfono */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                            Recuperación de contraseña por email o teléfono
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="password_recovery_enabled"
                                        checked={data.password_recovery_enabled}
                                        onChange={(e) => setData('password_recovery_enabled', e.target.checked)}
                                        className={`h-4 w-4 ${colors.primary} border-gray-300 rounded focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                    />
                                    <label htmlFor="password_recovery_enabled" className="ml-3 text-base font-medium text-gray-900">
                                        Activar recuperación de contraseña
                                    </label>
                                </div>
                            </div>

                            {data.password_recovery_enabled && (
                                <div className="space-y-4 ml-7">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Método de recuperación:
                                        </label>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id="recovery_email"
                                                    name="recovery_method"
                                                    value="email"
                                                    checked={data.password_recovery_method === 'email'}
                                                    onChange={(e) => setData('password_recovery_method', e.target.value)}
                                                    className={`h-4 w-4 ${colors.primary} border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                                />
                                                <label htmlFor="recovery_email" className="ml-3 text-sm text-gray-700">
                                                    📧 Solo por correo electrónico
                                                </label>
                                            </div>
                                            
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id="recovery_phone"
                                                    name="recovery_method"
                                                    value="phone"
                                                    checked={data.password_recovery_method === 'phone'}
                                                    onChange={(e) => setData('password_recovery_method', e.target.value)}
                                                    className={`h-4 w-4 ${colors.primary} border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                                />
                                                <label htmlFor="recovery_phone" className="ml-3 text-sm text-gray-700">
                                                    📱 Solo por número telefónico (SMS)
                                                </label>
                                            </div>
                                            
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id="recovery_both"
                                                    name="recovery_method"
                                                    value="both"
                                                    checked={data.password_recovery_method === 'both'}
                                                    onChange={(e) => setData('password_recovery_method', e.target.value)}
                                                    className={`h-4 w-4 ${colors.primary} border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                                />
                                                <label htmlFor="recovery_both" className="ml-3 text-sm text-gray-700">
                                                    📧📱 Ambos métodos (usuario puede elegir)
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tiempo de expiración del código:
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="number"
                                                    min="5"
                                                    max="60"
                                                    value={data.recovery_code_expiry}
                                                    onChange={(e) => setData('recovery_code_expiry', parseInt(e.target.value))}
                                                    className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center text-sm"
                                                />
                                                <span className="text-sm text-gray-500">minutos</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Límite de intentos de recuperación:
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="5"
                                                    value={data.recovery_attempts_limit}
                                                    onChange={(e) => setData('recovery_attempts_limit', parseInt(e.target.value))}
                                                    className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center text-sm"
                                                />
                                                <span className="text-sm text-gray-500">intentos por día</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                                        <div className="flex items-start">
                                            <CheckCircle className="text-blue-600 mt-0.5" size={16} />
                                            <div className="ml-2">
                                                <p className="text-sm text-blue-800 font-medium">Configuración actual:</p>
                                                <ul className="text-xs text-blue-700 mt-1 space-y-1">
                                                    <li>• Método: {
                                                        data.password_recovery_method === 'email' ? 'Solo correo electrónico' :
                                                        data.password_recovery_method === 'phone' ? 'Solo SMS' : 
                                                        'Email y SMS (usuario elige)'
                                                    }</li>
                                                    <li>• Código expira en {data.recovery_code_expiry} minutos</li>
                                                    <li>• Máximo {data.recovery_attempts_limit} intentos por día</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!data.password_recovery_enabled && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                    <div className="flex items-center">
                                        <AlertTriangle className="text-red-600" size={16} />
                                        <p className="ml-2 text-sm text-red-800">
                                            <strong>Advertencia:</strong> La recuperación de contraseña está desactivada. Los usuarios no podrán recuperar sus contraseñas si las olvidan.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={processing || isSubmitting}
                                className={`flex items-center px-6 py-3 ${colors.primary} text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50`}
                            >
                                <Save size={16} className="mr-2" />
                                {processing || isSubmitting ? 'Guardando...' : 'Guardar Configuraciones'}
                            </button>
                            
                            <Link
                                href={route('admin.configuraciones')}
                                className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </Link>
                        </div>

                        <button
                            type="button"
                            onClick={resetToDefaults}
                            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                            <RotateCcw size={16} className="mr-2" />
                            Restablecer por Defecto
                        </button>
                    </div>

                    {/* Información adicional */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                            <Settings className="mr-2" size={20} />
                            💡 Recomendaciones de Seguridad
                        </h4>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li>• Se recomienda activar todas las políticas de contraseña para mayor seguridad</li>
                            <li>• La autenticación en dos pasos proporciona una capa adicional de protección</li>
                            <li>• Un límite de 3-5 intentos de login es recomendable para prevenir ataques de fuerza bruta</li>
                            <li>• Las contraseñas deben tener al menos 8 caracteres con combinación de mayúsculas, números y símbolos</li>
                            <li>• Revisa regularmente las configuraciones de seguridad para mantener el sistema protegido</li>
                        </ul>
                    </div>
                </form>
            </div>
        </div>
    );
}