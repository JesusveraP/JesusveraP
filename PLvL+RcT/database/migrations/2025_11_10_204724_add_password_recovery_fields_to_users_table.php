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
            $table->string('recovery_code', 6)->nullable();
            $table->timestamp('recovery_code_expires_at')->nullable();
            $table->string('recovery_token')->nullable();
            $table->integer('recovery_attempts')->default(0);
            $table->date('recovery_attempts_date')->nullable();
            $table->string('phone')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'recovery_code',
                'recovery_code_expires_at',
                'recovery_token',
                'recovery_attempts',
                'recovery_attempts_date',
                'phone'
            ]);
        });
    }
};
