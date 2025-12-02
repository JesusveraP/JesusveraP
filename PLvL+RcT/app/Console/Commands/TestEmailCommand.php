<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\SystemSetting;

class TestEmailCommand extends Command
{
    protected $signature = 'test:email {email}';
    protected $description = 'Prueba el envío de correos de recuperación';

    public function handle()
    {
        $email = $this->argument('email');
        
        try {
            $systemName = SystemSetting::getSetting('system_name', 'Sistema SENA');
            $code = '123456';
            $expiryMinutes = 15;

            // Crear usuario temporal para la prueba
            $user = (object) [
                'name' => 'Usuario de Prueba',
                'email' => $email
            ];

            Mail::send('emails.recovery-code', [
                'user' => $user,
                'code' => $code,
                'systemName' => $systemName,
                'expiryMinutes' => $expiryMinutes
            ], function ($message) use ($email) {
                $message->to($email, 'Usuario de Prueba')
                       ->subject('Código de Recuperación de Contraseña - Sistema SENA');
            });

            $this->info("✅ Correo de prueba enviado exitosamente a: {$email}");
            $this->info("📧 Código de prueba: {$code}");
            
        } catch (\Exception $e) {
            $this->error("❌ Error al enviar correo: " . $e->getMessage());
            $this->info("Verifica tu configuración de correo en el archivo .env");
        }
    }
}