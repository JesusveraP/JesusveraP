<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UpdateAdminPassword extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:update-password';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Actualizar contraseña del administrador a 123456';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔍 Buscando el usuario administrador...');
        
        // Buscar el usuario administrador específico de la base de datos
        $admin = User::where('email', 'caballerokevin418@gmail.com')->first();
        
        if (!$admin) {
            $this->error('❌ No se encontró el usuario caballerokevin418@gmail.com');
            
            // Mostrar todos los usuarios existentes
            $this->info('📋 Usuarios existentes en la base de datos:');
            $users = User::all();
            
            foreach ($users as $user) {
                $this->line("ID: {$user->id} - Email: {$user->email} - Name: {$user->name} - Role: {$user->role}");
            }
            
            return 1;
        }
        
        // Actualizar contraseña del administrador específico
        $admin->update([
            'password' => Hash::make('123456')
        ]);
        
        $this->info("✅ Contraseña actualizada para: {$admin->email}");
        $this->info("👤 Usuario: {$admin->name}");
        $this->info("🔑 Nueva contraseña: 123456");
        $this->info('🎉 Proceso completado exitosamente');
        
        return 0;
    }
}
