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
        Schema::create('notification_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // Clave de configuración (ej: color, duration, position)
            $table->text('value'); // Valor de la configuración (JSON para datos complejos)
            $table->string('type')->default('string'); // Tipo de dato: string, integer, boolean, json
            $table->text('description')->nullable(); // Descripción de la configuración
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_settings');
    }
};
