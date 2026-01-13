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
        // UPDATE: Ganti skema dari "jenis_koperasis" ke "jenis_usahas"
        Schema::create('jenis_usahas', function (Blueprint $table) {
            $table->id();
            $table->string('nama'); // Gerai Sembako, Gerai Apotek Desa, dll
            $table->string('kode', 20); // SEMBAKO, APOTEK, KANTOR, dll
            // UPDATE: tambah kolom status_aktif
            $table->enum('status_aktif', ['Ya', 'Tidak'])->default('Ya'); // Buat badge 'Tidak' di screenshot
            $table->text('keterangan')->nullable();
            $table->foreignId('koperasi_id')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jenis_usahas');
    }
};
