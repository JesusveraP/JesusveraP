<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\AsistenciaController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\AdminUserController;
// Ruta de diagnóstico simple (sin React)
Route::get('/test', function () {
    return response('<h1>✅ Laravel está funcionando correctamente</h1><p>Si ves este mensaje, el servidor Laravel funciona.</p><a href="/login">Ir al Login</a>');
});

// Ruta de diagnóstico con React/Inertia
Route::get('/test-react', function () {
    return Inertia::render('Test');
});

// Redirigir la página principal directamente al login
Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    $user = auth()->user();
    
    // Redirigir según el rol del usuario
    if ($user && $user->role === 'admin') {
        return redirect()->route('admin.dashboard');
    } elseif ($user && $user->role === 'guardia') {
        return redirect()->route('guardia.dashboard');
    }
    
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::post('/admin/users/{user}/reset-password', [AdminUserController::class, 'resetPassword'])
        ->name('admin.users.reset-password');
});

// Admin Routes - Panel de administración
Route::prefix('admin')->middleware(['auth', 'admin'])->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::resource('users', UserController::class);
    
    // Rutas consolidadas para gestión de instructores
    Route::resource('instructores', InstructorController::class);
    
    // Rutas para historial de asistencias
    Route::get('/historial', [AdminController::class, 'historial'])->name('historial');
    
    // Rutas para reportes
    Route::get('/reportes', [\App\Http\Controllers\Admin\ReportesController::class, 'index'])->name('reportes');
    Route::get('/reportes/exportar', [\App\Http\Controllers\Admin\ReportesController::class, 'exportar'])->name('reportes.exportar');
    
    // ===== RUTAS DE CONFIGURACIONES (Nuevas) =====
    Route::get('/configuraciones', [\App\Http\Controllers\ConfigurationController::class, 'index'])->name('configuraciones');
    
    // Horarios y Asistencias
    Route::post('/configuraciones/horarios', [\App\Http\Controllers\ConfigurationController::class, 'updateSchedules'])->name('configuraciones.horarios');
    
    // Notificaciones
    Route::post('/configuraciones/notificaciones', [\App\Http\Controllers\ConfigurationController::class, 'updateNotifications'])->name('configuraciones.notificaciones');
    
    // Personalización
    Route::post('/configuraciones/personalizacion', [\App\Http\Controllers\ConfigurationController::class, 'updateCustomization'])->name('configuraciones.personalizacion');
    Route::post('/configuraciones/upload-logo', [\App\Http\Controllers\ConfigurationController::class, 'uploadLogo'])->name('customization.upload-logo');
    Route::post('/configuraciones/reset-logo', [\App\Http\Controllers\ConfigurationController::class, 'resetLogo'])->name('customization.reset');
    Route::post('/configuraciones/logo', [\App\Http\Controllers\ConfigurationController::class, 'uploadLogo'])->name('configuraciones.logo');
    Route::post('/configuraciones/logo/reset', [\App\Http\Controllers\ConfigurationController::class, 'resetLogo'])->name('configuraciones.logo.reset');
    
    // Seguridad y Contraseñas
    Route::post('/configuraciones/seguridad', [\App\Http\Controllers\ConfigurationController::class, 'updateSecuritySettings'])->name('configuraciones.seguridad');
    Route::post('/configuraciones/resetear-contraseñas', [\App\Http\Controllers\ConfigurationController::class, 'resetPasswords'])->name('configuraciones.resetear-contraseñas');
    
    // Respaldo y Restauración
    Route::post('/configuraciones/respaldo', [\App\Http\Controllers\ConfigurationController::class, 'createBackup'])->name('configuraciones.respaldo');
    Route::get('/configuraciones/respaldos/lista', [\App\Http\Controllers\ConfigurationController::class, 'listBackups'])->name('configuraciones.respaldos.lista');
    Route::get('/configuraciones/respaldos/{filename}', [\App\Http\Controllers\ConfigurationController::class, 'downloadBackup'])->name('configuraciones.respaldos.descargar');
    Route::delete('/configuraciones/respaldos/{filename}', [\App\Http\Controllers\ConfigurationController::class, 'deleteBackup'])->name('configuraciones.respaldos.eliminar');
    
    // Configuración Avanzada
    Route::post('/configuraciones/avanzada', [\App\Http\Controllers\ConfigurationController::class, 'updateAdvancedSettings'])->name('configuraciones.avanzada');
    Route::post('/configuraciones/limpiar-cache', [\App\Http\Controllers\ConfigurationController::class, 'clearCache'])->name('configuraciones.limpiar-cache');
    Route::post('/configuraciones/resetear-valores', [\App\Http\Controllers\ConfigurationController::class, 'resetToDefaults'])->name('configuraciones.resetear-valores');
    Route::post('/configuraciones/eliminar-datos', [\App\Http\Controllers\ConfigurationController::class, 'deleteAllData'])->name('configuraciones.eliminar-datos');
    
    // Usuarios y Roles
    Route::post('/configuraciones/usuarios', [\App\Http\Controllers\ConfigurationController::class, 'storeUser'])->name('configuraciones.usuarios.store');
    Route::put('/configuraciones/usuarios/{user}', [\App\Http\Controllers\ConfigurationController::class, 'updateUser'])->name('configuraciones.usuarios.update');
    Route::delete('/configuraciones/usuarios/{user}', [\App\Http\Controllers\ConfigurationController::class, 'destroyUser'])->name('configuraciones.usuarios.destroy');
    Route::post('/configuraciones/usuarios/{user}/toggle-status', [\App\Http\Controllers\ConfigurationController::class, 'toggleUserStatus'])->name('configuraciones.usuarios.toggle');
    
    // ===== FIN RUTAS DE CONFIGURACIONES =====
    
    // Rutas para gestión de roles (antiguas - mantener compatibilidad)
    Route::get('/roles', [\App\Http\Controllers\Admin\RoleController::class, 'index'])->name('roles.index');
    Route::post('/roles', [\App\Http\Controllers\Admin\RoleController::class, 'store'])->name('roles.store');
    Route::put('/roles/{role}', [\App\Http\Controllers\Admin\RoleController::class, 'update'])->name('roles.update');
    Route::delete('/roles/{role}', [\App\Http\Controllers\Admin\RoleController::class, 'destroy'])->name('roles.destroy');
    Route::get('/roles/stats', [\App\Http\Controllers\Admin\RoleController::class, 'getUserStats'])->name('roles.stats');
    
    // Rutas para el sistema de logos
    Route::post('/system/logo', [\App\Http\Controllers\Admin\LogoController::class, 'upload'])->name('system.logo.upload');
    Route::post('/system/logo/reset', [\App\Http\Controllers\Admin\LogoController::class, 'reset'])->name('system.logo.reset');
    Route::delete('/system/logo', [\App\Http\Controllers\Admin\LogoController::class, 'delete'])->name('system.logo.delete');
    
    // Rutas para personalización y otras configuraciones
    Route::get('/personalizacion', [\App\Http\Controllers\Admin\CustomizationController::class, 'index'])->name('customization.index');
    Route::post('/personalizacion', [\App\Http\Controllers\Admin\CustomizationController::class, 'update'])->name('customization.update');
    Route::post('/personalizacion/logo', [\App\Http\Controllers\Admin\CustomizationController::class, 'uploadLogo'])->name('customization.upload-logo');
    Route::post('/personalizacion/reset', [\App\Http\Controllers\Admin\CustomizationController::class, 'reset'])->name('customization.reset');
    Route::post('/customization/update-color', [\App\Http\Controllers\ConfigurationController::class, 'updateColor'])->name('customization.update-color');
    
    // Rutas para notificaciones
    Route::get('/notificaciones', [\App\Http\Controllers\Admin\NotificationController::class, 'index'])->name('notifications.index');
    Route::put('/notificaciones', [\App\Http\Controllers\Admin\NotificationController::class, 'update'])->name('notifications.update');
    Route::put('/notificaciones/reset', [\App\Http\Controllers\Admin\NotificationController::class, 'reset'])->name('notifications.reset');
    
    // Rutas para respaldo y restauración
    Route::get('/respaldo-restauracion', [\App\Http\Controllers\Admin\BackupController::class, 'index'])->name('backup.index');
    Route::post('/respaldo/generar', [\App\Http\Controllers\Admin\BackupController::class, 'generateBackup'])->name('backup.generate');
    Route::get('/respaldo/{backup}/descargar', [\App\Http\Controllers\Admin\BackupController::class, 'downloadBackup'])->name('backup.download');
    Route::post('/respaldo/subir', [\App\Http\Controllers\Admin\BackupController::class, 'uploadRestore'])->name('backup.upload');
    Route::post('/respaldo/confirmar-restauracion', [\App\Http\Controllers\Admin\BackupController::class, 'confirmRestore'])->name('backup.confirm-restore');
    Route::delete('/respaldo/{backup}', [\App\Http\Controllers\Admin\BackupController::class, 'deleteBackup'])->name('backup.delete');
    
    // Rutas para seguridad
    Route::get('/seguridad-contraseñas', [\App\Http\Controllers\Admin\SecurityController::class, 'index'])->name('security.index');
    Route::post('/seguridad/actualizar', [\App\Http\Controllers\Admin\SecurityController::class, 'updateAll'])->name('security.update');
    Route::post('/seguridad/politicas-contraseñas', [\App\Http\Controllers\Admin\SecurityController::class, 'updatePasswordPolicies'])->name('security.password-policies');
    Route::post('/seguridad/dos-factores', [\App\Http\Controllers\Admin\SecurityController::class, 'updateTwoFactor'])->name('security.two-factor');
    Route::post('/seguridad/bloqueo-automatico', [\App\Http\Controllers\Admin\SecurityController::class, 'updateAutoLock'])->name('security.auto-lock');
    Route::post('/seguridad/restablecer', [\App\Http\Controllers\Admin\SecurityController::class, 'resetToDefaults'])->name('security.reset');
    Route::get('/seguridad/estadisticas', [\App\Http\Controllers\Admin\SecurityController::class, 'getSecurityStats'])->name('security.stats');
    
    // Rutas para vigilantes
    Route::get('/vigilantes', [AdminController::class, 'vigilantes'])->name('vigilantes.index');
    Route::get('/vigilantes/create', [AdminController::class, 'createVigilante'])->name('vigilantes.create');
    Route::post('/vigilantes', [AdminController::class, 'storeVigilante'])->name('vigilantes.store');
    Route::get('/vigilantes/{vigilante}', [AdminController::class, 'showVigilante'])->name('vigilantes.show');
    Route::get('/vigilantes/{vigilante}/edit', [AdminController::class, 'editVigilante'])->name('vigilantes.edit');
    Route::put('/vigilantes/{vigilante}', [AdminController::class, 'updateVigilante'])->name('vigilantes.update');
    Route::delete('/vigilantes/{vigilante}', [AdminController::class, 'destroyVigilante'])->name('vigilantes.destroy');
    
    // Ruta para página Acerca De
    Route::get('/acerca-de', function () {
        return Inertia::render('Admin/AcercaDe');
    })->name('acerca-de');
});

// Guardia Routes - Sistema de registro de asistencias
Route::prefix('guardia')->middleware(['auth', 'guardia'])->name('guardia.')->group(function () {
    Route::get('/dashboard', [AsistenciaController::class, 'dashboard'])->name('dashboard');
    Route::post('/registrar-asistencia', [AsistenciaController::class, 'registrarAsistencia'])->name('registrar-asistencia');
    Route::get('/historial', [AsistenciaController::class, 'historial'])->name('historial');
    Route::post('/iniciar-turno', [AsistenciaController::class, 'iniciarTurno'])->name('iniciar-turno');
    Route::post('/finalizar-turno', [AsistenciaController::class, 'finalizarTurno'])->name('finalizar-turno');
});

// Rutas de autenticación
require __DIR__.'/auth.php';
