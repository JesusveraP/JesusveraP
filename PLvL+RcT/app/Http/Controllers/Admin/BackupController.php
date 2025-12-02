<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Models\User;
use App\Models\Instructor;
use App\Models\Asistencia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Carbon\Carbon;

class BackupController extends Controller
{
    /**
     * Mostrar página de respaldo y restauración
     */
    public function index()
    {
        $stats = [
            'asistencias_count' => Asistencia::count(),
            'instructores_count' => Instructor::count(),
            'usuarios_count' => User::count(),
            'configuraciones_count' => SystemSetting::count(),
        ];

        $backups = $this->getBackupHistory();

        return Inertia::render('Admin/Configuraciones/Respaldo', [
            'stats' => $stats,
            'backups' => $backups
        ]);
    }

    /**
     * Generar respaldo completo
     */
    public function generateBackup(Request $request)
    {
        try {
            // Asegurar que la carpeta existe
            if (!Storage::exists('backups')) {
                Storage::makeDirectory('backups');
            }

            $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
            $filename = "backup_completo_{$timestamp}.sql";
            
            $backupContent = $this->generateSQLBackup([
                'include_asistencias' => true,
                'include_instructores' => true,
                'include_usuarios' => true,
                'include_configuraciones' => true,
            ]);
            
            // Guardar en storage/app/backups
            $backupPath = "backups/{$filename}";
            Storage::put($backupPath, $backupContent);
            
            // Verificar que se guardó correctamente
            if (!Storage::exists($backupPath)) {
                throw new \Exception('No se pudo guardar el archivo de respaldo');
            }
            
            // Registrar en la base de datos
            $this->recordBackup($filename, $backupPath, []);
            
            return response()->json([
                'success' => true,
                'message' => '✅ Respaldo generado exitosamente',
                'filename' => $filename,
                'size' => $this->formatBytes(Storage::size($backupPath)),
                'path' => $backupPath,
                'download_url' => route('admin.backup.download', ['backup' => $filename])
            ]);
                
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ Error al generar respaldo: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Descargar respaldo específico
     */
    public function downloadBackup($backup)
    {
        try {
            $backupPath = "backups/{$backup}";
            
            // Validar que el archivo existe
            if (!Storage::exists($backupPath)) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ Archivo de respaldo no encontrado: ' . $backupPath
                ], 404);
            }
            
            $fullPath = storage_path("app/{$backupPath}");
            
            // Verificar que el archivo existe en el sistema de archivos
            if (!file_exists($fullPath)) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ No se puede acceder al archivo: ' . $fullPath
                ], 404);
            }
            
            return response()->download($fullPath, $backup);
                
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ Error al descargar respaldo: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Subir archivo de restauración
     */
    public function uploadRestore(Request $request)
    {
        $validated = $request->validate([
            'backup_file' => 'required|file|mimes:sql,backup,zip|max:102400', // 100MB max
        ]);

        try {
            $file = $request->file('backup_file');
            $filename = 'restore_' . Carbon::now()->format('Y-m-d_H-i-s') . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('backups/uploads', $filename);
            
            // Validar contenido del archivo si es SQL
            if ($file->getClientOriginalExtension() === 'sql') {
                $content = Storage::get($path);
                if (!$this->validateSQLBackup($content)) {
                    Storage::delete($path);
                    return response()->json([
                        'success' => false,
                        'message' => '❌ El archivo SQL no es válido o no es compatible'
                    ], 400);
                }
            }
            
            return response()->json([
                'success' => true,
                'message' => '✅ Archivo subido correctamente',
                'path' => $path,
                'filename' => $filename
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ Error al subir archivo: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Confirmar y ejecutar restauración
     */
    public function confirmRestore(Request $request)
    {
        $validated = $request->validate([
            'backup_path' => 'required|string',
        ]);

        try {
            // Crear respaldo de seguridad antes de restaurar
            $this->createSafetyBackup();
            
            // Ejecutar restauración
            $this->executeRestore($validated['backup_path']);
            
            return response()->json([
                'success' => true,
                'message' => '✅ Restauración completada exitosamente'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ Error durante la restauración: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Eliminar respaldo
     */
    public function deleteBackup($backup)
    {
        try {
            if (Storage::exists("backups/{$backup}")) {
                Storage::delete("backups/{$backup}");
            }
            
            return response()->json([
                'success' => true,
                'message' => '✅ Respaldo eliminado exitosamente'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ Error al eliminar respaldo: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Generar contenido SQL del respaldo
     */
    private function generateSQLBackup($options)
    {
        $sql = "-- Respaldo generado el " . Carbon::now()->format('Y-m-d H:i:s') . "\n";
        $sql .= "-- Sistema de Gestión de Instructores SENA\n\n";
        
        $sql .= "SET FOREIGN_KEY_CHECKS = 0;\n\n";
        
        if ($options['include_usuarios']) {
            $sql .= $this->exportTable('users');
        }
        
        if ($options['include_instructores']) {
            $sql .= $this->exportTable('instructors');
        }
        
        if ($options['include_asistencias']) {
            $sql .= $this->exportTable('asistencias');
        }
        
        if ($options['include_configuraciones']) {
            $sql .= $this->exportTable('system_settings');
        }
        
        $sql .= "SET FOREIGN_KEY_CHECKS = 1;\n";
        
        return $sql;
    }

    /**
     * Exportar tabla específica
     */
    private function exportTable($tableName)
    {
        $sql = "-- Respaldo de tabla: {$tableName}\n";
        $sql .= "DROP TABLE IF EXISTS `{$tableName}`;\n";
        
        // Obtener estructura de la tabla
        $createTable = DB::select("SHOW CREATE TABLE `{$tableName}`");
        $sql .= $createTable[0]->{'Create Table'} . ";\n\n";
        
        // Obtener datos
        $rows = DB::table($tableName)->get();
        
        if ($rows->count() > 0) {
            $sql .= "LOCK TABLES `{$tableName}` WRITE;\n";
            $sql .= "INSERT INTO `{$tableName}` VALUES ";
            
            $values = [];
            foreach ($rows as $row) {
                $rowArray = (array) $row;
                $escapedValues = array_map(function($value) {
                    return $value === null ? 'NULL' : "'" . addslashes($value) . "'";
                }, $rowArray);
                $values[] = '(' . implode(',', $escapedValues) . ')';
            }
            
            $sql .= implode(",\n", $values) . ";\n";
            $sql .= "UNLOCK TABLES;\n\n";
        }
        
        return $sql;
    }

    /**
     * Obtener historial de respaldos
     */
    private function getBackupHistory()
    {
        $backups = [];
        $files = Storage::files('backups');
        
        foreach ($files as $file) {
            if (str_ends_with($file, '.sql')) {
                $backups[] = [
                    'id' => md5($file),
                    'filename' => basename($file),
                    'path' => $file,
                    'size' => $this->formatBytes(Storage::size($file)),
                    'date' => Carbon::createFromTimestamp(Storage::lastModified($file))->format('Y-m-d H:i'),
                    'type' => str_contains($file, 'completo') ? 'Completo' : 'Parcial',
                    'status' => 'Exitoso'
                ];
            }
        }
        
        // Ordenar por fecha descendente
        usort($backups, function($a, $b) {
            return strcmp($b['date'], $a['date']);
        });
        
        return array_slice($backups, 0, 10); // Últimos 10 respaldos
    }

    /**
     * Obtener respaldo por ID
     */
    private function getBackupById($id)
    {
        $backups = $this->getBackupHistory();
        return collect($backups)->firstWhere('id', $id);
    }

    /**
     * Registrar respaldo en base de datos
     */
    private function recordBackup($filename, $path, $options)
    {
        SystemSetting::setSetting(
            'last_backup_date',
            Carbon::now()->toDateTimeString(),
            'datetime',
            'Fecha del último respaldo'
        );
        
        SystemSetting::setSetting(
            'last_backup_size',
            Storage::size($path),
            'integer',
            'Tamaño del último respaldo en bytes'
        );
    }

    /**
     * Validar archivo SQL de respaldo
     */
    private function validateSQLBackup($content)
    {
        // Verificaciones básicas
        return str_contains($content, 'CREATE TABLE') || 
               str_contains($content, 'INSERT INTO') ||
               str_contains($content, 'DROP TABLE');
    }

    /**
     * Crear respaldo de seguridad antes de restaurar
     */
    private function createSafetyBackup()
    {
        $options = [
            'include_asistencias' => true,
            'include_instructores' => true,
            'include_usuarios' => true,
            'include_configuraciones' => true,
        ];
        
        $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
        $filename = "safety_backup_before_restore_{$timestamp}.sql";
        $backupContent = $this->generateSQLBackup($options);
        $backupPath = "backups/safety/{$filename}";
        
        Storage::put($backupPath, $backupContent);
    }

    /**
     * Ejecutar restauración desde archivo
     */
    private function executeRestore($backupPath)
    {
        if (!Storage::exists($backupPath)) {
            throw new \Exception('Archivo de respaldo no encontrado');
        }
        
        $content = Storage::get($backupPath);
        
        // Dividir en comandos SQL individuales
        $commands = explode(';', $content);
        
        DB::beginTransaction();
        
        try {
            foreach ($commands as $command) {
                $command = trim($command);
                if (!empty($command)) {
                    DB::unprepared($command);
                }
            }
            
            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Remover registro de respaldo
     */
    private function removeBackupRecord($backupId)
    {
        // En una implementación más completa, aquí se eliminaría de una tabla de respaldos
        // Por ahora solo actualizamos la fecha del último respaldo eliminado
        SystemSetting::setSetting(
            'last_backup_deleted',
            Carbon::now()->toDateTimeString(),
            'datetime',
            'Fecha del último respaldo eliminado'
        );
    }

    /**
     * Formatear bytes en tamaño legible
     */
    private function formatBytes($size, $precision = 2)
    {
        $base = log($size, 1024);
        $suffixes = ['B', 'KB', 'MB', 'GB'];
        return round(pow(1024, $base - floor($base)), $precision) . ' ' . $suffixes[floor($base)];
    }
}