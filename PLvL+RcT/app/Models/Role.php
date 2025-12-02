<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'is_system_role',
        'permissions'
    ];

    protected $casts = [
        'permissions' => 'array',
        'is_system_role' => 'boolean'
    ];

    /**
     * Relación: Un rol puede tener muchos usuarios
     */
    public function users()
    {
        return $this->hasMany(User::class, 'role', 'name');
    }

    /**
     * Obtener el conteo de usuarios por rol
     */
    public function getUserCountAttribute()
    {
        return $this->users()->count();
    }

    /**
     * Scope para roles del sistema (no eliminables)
     */
    public function scopeSystemRoles($query)
    {
        return $query->where('is_system_role', true);
    }

    /**
     * Scope para roles personalizados (eliminables)
     */
    public function scopeCustomRoles($query)
    {
        return $query->where('is_system_role', false);
    }
}
