<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Instructor extends Model
{
    protected $table = 'instructors';

    protected $fillable = [
        'codigo_instructor',
        'codigo_barras',
        'nombres',
        'apellidos',
        'documento_identidad',
        'tipo_documento',
        'telefono',
        'email',
        'direccion',
        'fecha_ingreso',
        'hora_entrada_programada',
        'hora_salida_programada',
        'estado',
        'observaciones',
        'area_asignada',
        'cargo',
    ];

    protected $casts = [
        'fecha_ingreso' => 'date',
        'hora_entrada_programada' => 'string',
        'hora_salida_programada' => 'string',
    ];

    /**
     * Relación con las asistencias del instructor
     */
    public function asistencias(): HasMany
    {
        return $this->hasMany(Asistencia::class);
    }

    /**
     * Obtener el nombre completo del instructor
     */
    public function getNombreCompletoAttribute(): string
    {
        return $this->nombres . ' ' . $this->apellidos;
    }

    /**
     * Verificar si el instructor está activo
     */
    public function isActivo(): bool
    {
        return $this->estado === 'activo';
    }

    /**
     * Obtener la última asistencia del instructor
     */
    public function ultimaAsistencia()
    {
        return $this->asistencias()->latest('fecha_hora_registro')->first();
    }

    /**
     * Verificar si el instructor está actualmente en la institución
     */
    public function estaEnInstitucion(): bool
    {
        $ultimaAsistencia = $this->ultimaAsistencia();
        return $ultimaAsistencia && $ultimaAsistencia->tipo_movimiento === 'entrada';
    }

    /**
     * Calcular si está en horario para entrada
     */
    public function estaEnHorarioEntrada(Carbon $horaActual): bool
    {
        $horaEntrada = Carbon::createFromFormat('H:i', $this->hora_entrada_programada);
        $tolerancia = 15; // 15 minutos de tolerancia
        
        return $horaActual->between(
            $horaEntrada->copy()->subMinutes($tolerancia),
            $horaEntrada->copy()->addMinutes($tolerancia)
        );
    }

    /**
     * Calcular si llegó tarde
     */
    public function esEntradaTardia(Carbon $horaRegistro): bool
    {
        $horaEntrada = Carbon::createFromTimeString($this->hora_entrada_programada);
        $horaRegistroSolo = $horaRegistro->format('H:i:s');
        return $horaRegistroSolo > $horaEntrada->format('H:i:s');
    }

    /**
     * Calcular si es salida anticipada
     */
    public function esSalidaAnticipada(Carbon $horaRegistro): bool
    {
        $horaSalida = Carbon::createFromTimeString($this->hora_salida_programada);
        $horaRegistroSolo = $horaRegistro->format('H:i:s');
        return $horaRegistroSolo < $horaSalida->format('H:i:s');
    }

    /**
     * Obtener la última entrada del día de hoy
     */
    public function ultimaEntradaHoy()
    {
        return $this->asistencias()
            ->where('tipo_movimiento', 'entrada')
            ->whereDate('fecha_hora_registro', today())
            ->latest('fecha_hora_registro')
            ->first()?->fecha_hora_registro;
    }

    /**
     * Obtener la última salida del día de hoy
     */
    public function ultimaSalidaHoy()
    {
        return $this->asistencias()
            ->where('tipo_movimiento', 'salida')
            ->whereDate('fecha_hora_registro', today())
            ->latest('fecha_hora_registro')
            ->first()?->fecha_hora_registro;
    }

    /**
     * Verificar si ya registró entrada hoy
     */
    public function yaRegistroEntradaHoy(): bool
    {
        return $this->asistencias()
            ->where('tipo_movimiento', 'entrada')
            ->whereDate('fecha_hora_registro', today())
            ->exists();
    }

    /**
     * Verificar si ya registró salida hoy
     */
    public function yaRegistroSalidaHoy(): bool
    {
        return $this->asistencias()
            ->where('tipo_movimiento', 'salida')
            ->whereDate('fecha_hora_registro', today())
            ->exists();
    }

    /**
     * Obtener todas las asistencias del día de hoy
     */
    public function asistenciasHoy()
    {
        return $this->asistencias()
            ->whereDate('fecha_hora_registro', today())
            ->orderBy('fecha_hora_registro')
            ->get();
    }

    /**
     * Scope para instructores activos
     */
    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }

    /**
     * Scope para buscar por código de barras
     */
    public function scopePorCodigoBarras($query, $codigo)
    {
        return $query->where('codigo_barras', $codigo);
    }
}
