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
        Schema::create('instructors', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_instructor')->unique(); // Código único del instructor
            $table->string('codigo_barras')->unique(); // Código de barras para el carné
            $table->string('nombres');
            $table->string('apellidos');
            $table->string('documento_identidad')->unique();
            $table->enum('tipo_documento', ['CC', 'CE', 'PA', 'TI']);
            $table->string('telefono')->nullable();
            $table->string('email')->nullable();
            $table->string('direccion')->nullable();
            $table->date('fecha_ingreso');
            $table->time('hora_entrada_programada'); // Hora de entrada esperada
            $table->time('hora_salida_programada'); // Hora de salida esperada
            $table->enum('estado', ['activo', 'inactivo', 'suspendido'])->default('activo');
            $table->text('observaciones')->nullable();
            $table->string('area_asignada')->nullable(); // Área o departamento
            $table->string('cargo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instructors');
    }
};
