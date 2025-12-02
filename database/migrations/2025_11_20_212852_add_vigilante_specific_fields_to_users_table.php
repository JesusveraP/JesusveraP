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
            // Solo agregar las columnas que no existen aún
            if (!Schema::hasColumn('users', 'ubicacion_asignada')) {
                $table->string('ubicacion_asignada')->nullable()->after('telefono');
            }
            if (!Schema::hasColumn('users', 'hora_inicio_turno')) {
                $table->time('hora_inicio_turno')->nullable()->after('ubicacion_asignada');
            }
            if (!Schema::hasColumn('users', 'hora_fin_turno')) {
                $table->time('hora_fin_turno')->nullable()->after('hora_inicio_turno');
            }
            if (!Schema::hasColumn('users', 'activo')) {
                $table->boolean('activo')->default(true)->after('fecha_inicio');
            }
            if (!Schema::hasColumn('users', 'observaciones')) {
                $table->text('observaciones')->nullable()->after('activo');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'ubicacion_asignada',
                'hora_inicio_turno', 
                'hora_fin_turno',
                'fecha_inicio',
                'activo',
                'observaciones'
            ]);
        });
    }
};
