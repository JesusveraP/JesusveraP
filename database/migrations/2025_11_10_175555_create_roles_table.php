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
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Nombre del rol (ej: admin, instructor, vigilante)
            $table->string('display_name'); // Nombre para mostrar (ej: Superadministrador, Instructores)
            $table->text('description')->nullable(); // Descripción del rol
            $table->boolean('is_system_role')->default(false); // Si es un rol del sistema (no se puede eliminar)
            $table->json('permissions')->nullable(); // Permisos específicos del rol
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
