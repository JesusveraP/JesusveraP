<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\SystemSetting;
use Inertia\Inertia;
use Carbon\Carbon;

class PasswordRecoveryController extends Controller
{
    /**
     * Mostrar formulario de recuperación de contraseña
     */
    public function showRecoveryForm()
    {
        $recoverySettings = $this->getRecoverySettings();
        
        return Inertia::render('Auth/ForgotPassword', [
            'recoverySettings' => $recoverySettings
        ]);
    }

    /**
     * Procesar solicitud de recuperación de contraseña
     */
    public function sendRecoveryCode(Request $request)
    {
        $recoverySettings = $this->getRecoverySettings();
        
        if (!$recoverySettings['enabled']) {
            return back()->withErrors([
                'email' => 'La recuperación de contraseña está deshabilitada.'
            ]);
        }

        $validated = $request->validate([
            'email' => 'required|email',
            'recovery_method' => 'required|in:email,phone'
        ]);

        $user = User::where('email', $validated['email'])->first();
        
        if (!$user) {
            return back()->withErrors([
                'email' => 'No encontramos un usuario con ese correo electrónico.'
            ]);
        }

        // Verificar límite de intentos
        if ($this->hasExceededAttempts($user)) {
            return back()->withErrors([
                'email' => 'Ha excedido el límite de intentos de recuperación por hoy. Intente mañana.'
            ]);
        }

        // Generar código de recuperación
        $code = $this->generateRecoveryCode();
        $expiresAt = Carbon::now()->addMinutes($recoverySettings['code_expiry']);

        // Guardar código en la base de datos
        $user->update([
            'recovery_code' => $code,
            'recovery_code_expires_at' => $expiresAt,
            'recovery_attempts' => ($user->recovery_attempts ?? 0) + 1,
            'recovery_attempts_date' => Carbon::now()->toDateString()
        ]);

        try {
            if ($validated['recovery_method'] === 'email') {
                $this->sendRecoveryEmail($user, $code);
                $message = 'Se ha enviado un código de recuperación a su correo electrónico.';
            } else {
                $this->sendRecoverySMS($user, $code);
                $message = 'Se ha enviado un código de recuperación a su teléfono.';
            }

            return redirect()->route('password.verify-code', ['email' => $user->email])
                ->with('success', $message);

        } catch (\Exception $e) {
            \Log::error('Error sending recovery code: ' . $e->getMessage());
            return back()->withErrors([
                'email' => 'Error al enviar el código de recuperación. Intente más tarde.'
            ]);
        }
    }

    /**
     * Mostrar formulario de verificación de código
     */
    public function showVerifyCodeForm(Request $request)
    {
        $email = $request->get('email');
        return Inertia::render('Auth/VerifyRecoveryCode', [
            'email' => $email
        ]);
    }

    /**
     * Verificar código de recuperación
     */
    public function verifyCode(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6'
        ]);

        $user = User::where('email', $validated['email'])->first();
        
        if (!$user || !$user->recovery_code) {
            return back()->withErrors([
                'code' => 'Código de recuperación inválido o expirado.'
            ]);
        }

        if (Carbon::now()->gt($user->recovery_code_expires_at)) {
            return back()->withErrors([
                'code' => 'El código de recuperación ha expirado.'
            ]);
        }

        if ($user->recovery_code !== $validated['code']) {
            return back()->withErrors([
                'code' => 'Código de recuperación incorrecto.'
            ]);
        }

        // Generar token para resetear contraseña
        $token = Str::random(64);
        $user->update([
            'recovery_token' => $token,
            'recovery_code' => null,
            'recovery_code_expires_at' => null
        ]);

        return redirect()->route('password.reset', ['token' => $token, 'email' => $user->email])
            ->with('success', 'Código verificado correctamente.');
    }

    /**
     * Mostrar formulario de nueva contraseña
     */
    public function showResetForm(Request $request, $token)
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->email
        ]);
    }

    /**
     * Restablecer contraseña
     */
    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed'
        ]);

        $user = User::where('email', $validated['email'])
                   ->where('recovery_token', $validated['token'])
                   ->first();

        if (!$user) {
            return back()->withErrors([
                'email' => 'Token de recuperación inválido.'
            ]);
        }

        $user->update([
            'password' => bcrypt($validated['password']),
            'recovery_token' => null,
            'recovery_attempts' => 0,
            'recovery_attempts_date' => null
        ]);

        return redirect()->route('login')
            ->with('success', 'Contraseña restablecida exitosamente. Puede iniciar sesión.');
    }

    /**
     * Obtener configuraciones de recuperación
     */
    private function getRecoverySettings()
    {
        return [
            'enabled' => SystemSetting::getSetting('password_recovery_enabled', true),
            'method' => SystemSetting::getSetting('password_recovery_method', 'email'),
            'code_expiry' => SystemSetting::getSetting('recovery_code_expiry', 15),
            'attempts_limit' => SystemSetting::getSetting('recovery_attempts_limit', 3)
        ];
    }

    /**
     * Verificar si ha excedido intentos
     */
    private function hasExceededAttempts($user)
    {
        $today = Carbon::now()->toDateString();
        $settings = $this->getRecoverySettings();
        
        return $user->recovery_attempts_date === $today && 
               $user->recovery_attempts >= $settings['attempts_limit'];
    }

    /**
     * Generar código de recuperación
     */
    private function generateRecoveryCode()
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Enviar código por email
     */
    private function sendRecoveryEmail($user, $code)
    {
        $systemName = SystemSetting::getSetting('system_name', 'Sistema SENA');
        $expiryMinutes = SystemSetting::getSetting('recovery_code_expiry', 15);

        Mail::send('emails.recovery-code', [
            'user' => $user,
            'code' => $code,
            'systemName' => $systemName,
            'expiryMinutes' => $expiryMinutes
        ], function ($message) use ($user) {
            $message->to($user->email, $user->name)
                   ->subject('Código de Recuperación de Contraseña - Sistema SENA');
        });
    }

    /**
     * Enviar código por SMS (placeholder)
     */
    private function sendRecoverySMS($user, $code)
    {
        // Implementar integración con servicio SMS (Twilio, etc.)
        // Por ahora, guardamos en log
        \Log::info("SMS Recovery Code for {$user->email}: {$code}");
        
        // TODO: Implementar envío real de SMS
        // Ejemplo con Twilio:
        // $twilio = new Client(env('TWILIO_SID'), env('TWILIO_TOKEN'));
        // $twilio->messages->create($user->phone, [
        //     'from' => env('TWILIO_PHONE'),
        //     'body' => "Su código de recuperación SENA: {$code}. Válido por 15 minutos."
        // ]);
    }
}