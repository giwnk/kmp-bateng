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
        // UPDATE: tambah skema galeri koperasi
        Schema::create('galeri_koperasis', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('koperasi_id')->constrained('koperasis')->onDelete('cascade');
            $table->string('foto_path'); // Path file gambar
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('galeri_koperasis');
    }
};
