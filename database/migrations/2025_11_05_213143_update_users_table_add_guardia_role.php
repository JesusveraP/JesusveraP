<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Actualizar la columna role para incluir 'guardia'
            $table->enum('role', ['user', 'admin', 'guardia'])->default('user')->change();
            
            // Campos específicos para guardias
            $table->string('codigo_guardia')->nullable()->unique();
            $table->string('ubicacion_asignada')->nullable(); // Ubicación donde trabaja el guardia
            $table->time('hora_inicio_turno')->nullable();
            $table->time('hora_fin_turno')->nullable();
            $table->datetime('ultimo_inicio_turno')->nullable(); // Último turno iniciado
            $table->datetime('ultimo_fin_turno')->nullable(); // Último turno finalizado
            $table->boolean('turno_activo')->default(false); // Si está en turno actualmente
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['user', 'admin'])->default('user')->change();
            $table->dropColumn([
                'codigo_guardia',
                'ubicacion_asignada',
                'hora_inicio_turno',
                'hora_fin_turno',
                'ultimo_inicio_turno',
                'ultimo_fin_turno',
                'turno_activo'
            ]);
        });
    }
};
