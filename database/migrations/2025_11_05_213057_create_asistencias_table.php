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
        Schema::create('asistencias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('instructor_id')->constrained('instructors')->onDelete('cascade');
            $table->foreignId('guardia_id')->constrained('users')->onDelete('restrict'); // Guardia que registró
            $table->enum('tipo_movimiento', ['entrada', 'salida']);
            $table->datetime('fecha_hora_registro'); // Momento exacto del registro
            $table->string('codigo_barras_leido'); // Código que se leyó del carné
            $table->string('ubicacion')->nullable(); // Ubicación donde se hizo el registro
            $table->boolean('es_tardanza')->default(false); // Si llegó tarde
            $table->boolean('es_salida_anticipada')->default(false); // Si salió antes
            $table->text('observaciones')->nullable(); // Novedades o comentarios
            $table->enum('estado_registro', ['normal', 'novedad', 'alerta'])->default('normal');
            $table->timestamps();
            
            // Índices para optimizar consultas
            $table->index(['instructor_id', 'fecha_hora_registro']);
            $table->index(['guardia_id', 'created_at']);
            $table->index(['tipo_movimiento', 'fecha_hora_registro']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asistencias');
    }
};
