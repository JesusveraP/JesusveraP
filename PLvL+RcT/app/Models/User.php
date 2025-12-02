<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Auth\Passwords\CanResetPassword;
use App\Notifications\ResetPasswordNotification;

class User extends Authenticatable
{
    use HasFactory, Notifiable, CanResetPassword;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'codigo_guardia',
        'ubicacion_asignada',
        'hora_inicio_turno',
        'hora_fin_turno',
        'ultimo_inicio_turno',
        'ultimo_fin_turno',
        'turno_activo',
        'phone',
        'recovery_code',
        'recovery_code_expires_at',
        'recovery_token',
        'recovery_attempts',
        'recovery_attempts_date',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'hora_inicio_turno' => 'datetime:H:i',
            'hora_fin_turno' => 'datetime:H:i',
            'ultimo_inicio_turno' => 'datetime',
            'ultimo_fin_turno' => 'datetime',
            'turno_activo' => 'boolean',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    public function isGuardia(): bool
    {
        return $this->role === 'guardia';
    }

    public function asistenciasRegistradas(): HasMany
    {
        return $this->hasMany(Asistencia::class, 'guardia_id');
    }

    public function iniciarTurno(): void
    {
        $this->update([
            'ultimo_inicio_turno' => now(),
            'turno_activo' => true,
        ]);
    }

    public function finalizarTurno(): void
    {
        $this->update([
            'ultimo_fin_turno' => now(),
            'turno_activo' => false,
        ]);
    }

    public function estaEnTurno(): bool
    {
        return $this->turno_activo;
    }

    public function tiempoUltimoTurno(): ?int
    {
        if ($this->ultimo_inicio_turno && $this->ultimo_fin_turno) {
            return $this->ultimo_inicio_turno->diffInMinutes($this->ultimo_fin_turno);
        }
        return null;
    }

    public function scopeGuardias($query)
    {
        return $query->where('role', 'guardia');
    }

    public function scopeEnTurno($query)
    {
        return $query->where('turno_activo', true);
    }

    /**
     * ✅ Protege cualquier notificación mail si no hay email
     */
    public function routeNotificationForMail($notification)
    {
        return !empty($this->email) ? $this->email : null;
    }

    /**
     * ✅ Reset self-service: envía solo si existe email
     */
    public function sendPasswordResetNotification($token)
    {
        if (empty($this->email)) {
            return;
        }

        $this->notify(new ResetPasswordNotification($token));
    }
}
