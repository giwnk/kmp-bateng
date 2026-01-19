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
        Schema::create('koperasis', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('kecamatan_id')->constrained('kecamatans')->onDelete('cascade');
            $table->foreignId('desa_id')->constrained('desas')->onDelete('cascade');

            $table->string('nama');
            $table->string('nomor_induk')->unique();
            $table->string('nomor_ahu')->unique();
            $table->date('tanggal_ahu');
            $table->text('alamat');
            $table->integer('no_telepon');
            $table->string('email');
            $table->string('website')->nullable();

            // Koordinat
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();


            // Status & Kondisi
            // UPDATE: tambah kolom status_operasional, status_sertifikat, status_pelatihan
            $table->boolean('status_operasional')->default(false)->comment('Sudah/Belum');
            $table->boolean('status_sertifikat')->default(false)->comment('Sudah/Belum');
            $table->boolean('status_pelatihan')->default(false)->comment('Sudah/Belum');

            // Tahun Pembentukan
            $table->year('tahun_pembentukan')->nullable();
            $table->date('tanggal_berdiri')->nullable();


            // UPDATE: Tambah kolom kolom untuk link sosial media sebgai opsi
            // Sosmed (optional)
            $table->string('link_facebook')->nullable();
            $table->string('link_instagram')->nullable();
            $table->string('link_youtube')->nullable();
            $table->string('link_tiktok')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('koperasis');
    }
};
