import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import useSystemColors from '@/hooks/useSystemColors';
import { 
    ArrowLeft, 
    Download, 
    Upload, 
    HardDrive, 
    Database, 
    Calendar,
    User,
    AlertTriangle,
    CheckCircle,
    Trash2,
    FileArchive
} from 'lucide-react';

export default function RespaldoRestauracion({ backups = [], diskSpace, databaseSize }) {
    const { colors } = useSystemColors();
    const [isGenerating, setIsGenerating] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showConfirmRestore, setShowConfirmRestore] = useState(false);
    const [restoreData, setRestoreData] = useState(null);

    const handleGenerateBackup = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch(route('admin.backup.generate'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                }
            });

            const data = await response.json();
            
            if (data.success) {
                alert('Respaldo generado exitosamente. La descarga comenzará automáticamente.');
                window.location.href = data.download_url;
                setTimeout(() => window.location.reload(), 2000);
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            alert('Error de conexión: ' + error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
                alert('Por favor selecciona un archivo ZIP válido');
                return;
            }
            if (file.size > 50 * 1024 * 1024) { // 50MB
                alert('El archivo es demasiado grande. Tamaño máximo: 50MB');
                return;
            }
            setUploadFile(file);
        }
    };

    const handleUploadRestore = async () => {
        if (!uploadFile) {
            alert('Por favor selecciona un archivo primero');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('backup_file', uploadFile);

        try {
            const response = await fetch(route('admin.backup.upload'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                if (data.requires_confirmation) {
                    setRestoreData(data);
                    setShowConfirmRestore(true);
                } else {
                    alert('Restauración completada: ' + data.message);
                    window.location.reload();
                }
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            alert('Error de conexión: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const confirmRestore = async () => {
        try {
            const response = await fetch(route('admin.backup.confirm-restore'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({
                    temp_path: restoreData.temp_path,
                    confirmation: 1
                })
            });

            const data = await response.json();
            
            if (data.success) {
                alert('Restauración completada exitosamente. La aplicación será recargada.');
                window.location.reload();
            } else {
                alert('Error durante la restauración: ' + data.message);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setShowConfirmRestore(false);
            setRestoreData(null);
        }
    };

    const deleteBackup = async (backupName) => {
        if (!confirm('¿Estás seguro de eliminar este respaldo? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            const response = await fetch(route('admin.backup.delete', { backup: backupName }), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                }
            });

            const data = await response.json();
            
            if (data.success) {
                alert('Respaldo eliminado exitosamente');
                window.location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatFileSize = (bytes) => {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Respaldo y Restauración - SENA" />
            
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
                                <FileArchive className={`mr-3 ${colors.primaryText}`} size={24} />
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Respaldo y Restauración
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        Configura el respaldo y la restauración de los datos
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Link
                            href={route('admin.configuraciones')}
                            className={`px-4 py-2 ${colors.primary} text-white rounded-md hover:opacity-90 transition-opacity`}
                        >
                            Volver
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Panel Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Sección de Respaldo */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Download className="mr-2 text-green-600" size={20} />
                                Respaldo
                            </h3>
                            
                            <div className="space-y-4">
                                <p className="text-gray-600">
                                    Genera un respaldo completo del sistema incluyendo base de datos, 
                                    configuraciones y archivos importantes.
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <Database className="mr-2 text-blue-600" size={16} />
                                            <span className="text-sm font-medium text-gray-700">Base de Datos</span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Tamaño: {databaseSize.size_formatted}
                                        </p>
                                    </div>
                                    
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <HardDrive className="mr-2 text-purple-600" size={16} />
                                            <span className="text-sm font-medium text-gray-700">Espacio Disponible</span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {diskSpace.free_formatted}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleGenerateBackup}
                                    disabled={isGenerating}
                                    className={`w-full flex items-center justify-center px-4 py-3 ${colors.primary} text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50`}
                                >
                                    <Download className="mr-2" size={16} />
                                    {isGenerating ? 'Generando Respaldo...' : 'Generar Respaldo'}
                                </button>
                            </div>
                        </div>

                        {/* Sección de Restauración */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Upload className="mr-2 text-orange-600" size={20} />
                                Restauración
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-start">
                                        <AlertTriangle className="mr-2 text-yellow-600 mt-0.5" size={16} />
                                        <div>
                                            <p className="text-sm font-medium text-yellow-800">
                                                Advertencia Importante
                                            </p>
                                            <p className="text-xs text-yellow-700 mt-1">
                                                La restauración sobrescribirá todos los datos actuales del sistema.
                                                Asegúrate de tener un respaldo antes de proceder.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Archivo de Respaldo (.zip)
                                    </label>
                                    <input
                                        type="file"
                                        accept=".zip"
                                        onChange={handleFileUpload}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {uploadFile && (
                                        <p className="text-xs text-gray-600">
                                            Archivo seleccionado: {uploadFile.name} ({formatFileSize(uploadFile.size)})
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={handleUploadRestore}
                                    disabled={!uploadFile || isUploading}
                                    className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
                                >
                                    <Upload className="mr-2" size={16} />
                                    {isUploading ? 'Subiendo Archivo...' : 'Subir Archivo'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Panel de Historial */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Calendar className="mr-2 text-blue-600" size={20} />
                                Últimos Respaldos
                            </h3>
                            
                            <div className="space-y-3">
                                {backups.length > 0 ? (
                                    backups.map((backup, index) => (
                                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatDate(backup.created_at)}
                                                    </p>
                                                    <div className="flex items-center mt-1 text-xs text-gray-500">
                                                        <User className="mr-1" size={12} />
                                                        {backup.created_by}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <a
                                                        href={backup.download_url}
                                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                                        title="Descargar"
                                                    >
                                                        <Download size={14} />
                                                    </a>
                                                    <button
                                                        onClick={() => deleteBackup(backup.name)}
                                                        className="text-red-600 hover:text-red-800 transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Tamaño: {formatFileSize(backup.size)}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        No hay respaldos disponibles
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Información del Sistema */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">
                                💡 Información Importante
                            </h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li>• Los respaldos incluyen toda la base de datos</li>
                                <li>• Se incluyen archivos de configuración</li>
                                <li>• Las imágenes y archivos subidos se respaldan</li>
                                <li>• Recomendado: respaldo diario o semanal</li>
                                <li>• Almacena respaldos en ubicación segura</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmación de Restauración */}
            {showConfirmRestore && restoreData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <AlertTriangle className="mr-3 text-red-600" size={24} />
                            <h3 className="text-lg font-bold text-gray-900">
                                Confirmar Restauración
                            </h3>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-3">
                                Estás a punto de restaurar el sistema con el siguiente respaldo:
                            </p>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-sm font-medium text-gray-900">
                                    {restoreData.backup_info.backup_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Creado por: {restoreData.backup_info.created_by}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Fecha: {formatDate(restoreData.backup_info.created_at)}
                                </p>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 p-3 rounded mb-4">
                            <p className="text-sm text-red-800">
                                <strong>¡ADVERTENCIA!</strong> Esta acción sobrescribirá todos los datos actuales 
                                del sistema y no se puede deshacer.
                            </p>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowConfirmRestore(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmRestore}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Confirmar Restauración
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}