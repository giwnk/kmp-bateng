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
        Schema::create('anggota_koperasis', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('koperasi_id')->constrained('koperasis')->onDelete('cascade');
            $table->string('nomor_anggota')->unique();
            $table->string('nama');
            $table->string('nik', 16);
            $table->date('tanggal_bergabung');
            $table->enum('status', ['Aktif', 'Non Aktif'])->default('Aktif');
            $table->text('alamat');
            $table->string('nomor_telepon')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anggota_koperasis');
    }
};
