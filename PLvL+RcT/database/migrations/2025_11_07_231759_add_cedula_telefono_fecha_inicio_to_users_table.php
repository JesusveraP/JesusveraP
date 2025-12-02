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
            $table->string('cedula')->nullable()->unique()->after('email');
            $table->string('telefono')->nullable()->after('cedula');
            $table->date('fecha_inicio')->nullable()->after('telefono');
            $table->string('turno')->nullable()->after('fecha_inicio'); // mañana, tarde, noche
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['cedula', 'telefono', 'fecha_inicio', 'turno']);
        });
    }
};
