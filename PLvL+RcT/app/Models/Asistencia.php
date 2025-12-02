<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Asistencia extends Model
{
    protected $fillable = [
        'instructor_id',
        'guardia_id',
        'tipo_movimiento',
        'fecha_hora_registro',
        'codigo_barras_leido',
        'ubicacion',
        'es_tardanza',
        'es_salida_anticipada',
        'observaciones',
        'estado_registro',
    ];

    protected $casts = [
        'fecha_hora_registro' => 'datetime',
        'es_tardanza' => 'boolean',
        'es_salida_anticipada' => 'boolean',
    ];

    /**
     * Relación con el instructor
     */
    public function instructor(): BelongsTo
    {
        return $this->belongsTo(Instructor::class);
    }

    /**
     * Relación con el guardia que registró
     */
    public function guardia(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guardia_id');
    }

    /**
     * Verificar si es una entrada
     */
    public function esEntrada(): bool
    {
        return $this->tipo_movimiento === 'entrada';
    }

    /**
     * Verificar si es una salida
     */
    public function esSalida(): bool
    {
        return $this->tipo_movimiento === 'salida';
    }

    /**
     * Verificar si tiene novedades
     */
    public function tieneNovedades(): bool
    {
        return $this->estado_registro !== 'normal';
    }

    /**
     * Obtener el mensaje de novedad
     */
    public function getMensajeNovedadAttribute(): string
    {
        $mensajes = [];
        
        if ($this->es_tardanza) {
            $mensajes[] = 'Llegada tardía';
        }
        
        if ($this->es_salida_anticipada) {
            $mensajes[] = 'Salida anticipada';
        }
        
        if ($this->observaciones) {
            $mensajes[] = $this->observaciones;
        }
        
        return implode(', ', $mensajes);
    }

    /**
     * Scope para entradas
     */
    public function scopeEntradas($query)
    {
        return $query->where('tipo_movimiento', 'entrada');
    }

    /**
     * Scope para salidas
     */
    public function scopeSalidas($query)
    {
        return $query->where('tipo_movimiento', 'salida');
    }

    /**
     * Scope para registros con novedades
     */
    public function scopeConNovedades($query)
    {
        return $query->where('estado_registro', '!=', 'normal');
    }

    /**
     * Scope para registros de hoy
     */
    public function scopeHoy($query)
    {
        return $query->whereDate('fecha_hora_registro', today());
    }

    /**
     * Scope para un rango de fechas
     */
    public function scopeEntreFechas($query, $fechaInicio, $fechaFin)
    {
        return $query->whereBetween('fecha_hora_registro', [$fechaInicio, $fechaFin]);
    }
}
