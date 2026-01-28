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
        Schema::table('desas', function (Blueprint $table) {
            // Kita pakai ENUM biar datanya konsisten cuma bisa 'Desa' atau 'Kelurahan'
            // Default kita set 'Desa' biar data lama nggak error
            $table->enum('jenis', ['Desa', 'Kelurahan'])->default('Desa')->after('nama');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('desas', function (Blueprint $table) {
            $table->dropColumn('jenis');
        });
    }
};
