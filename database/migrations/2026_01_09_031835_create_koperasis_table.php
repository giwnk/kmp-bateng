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
            $table->id();
            $table->foreignId('kecamatan_id')->constrained('kecamatans')->onDelete('cascade');
            $table->foreignId('desa_id')->constrained('desas')->onDelete('cascade');
            $table->foreignId('jenis_koperasi_id')->constrained('jenis_koperasis')->onDelete('cascade');
            
            $table->string('nama');
            $table->string('nomor_badan_hukum')->unique()->nullable();
            $table->text('alamat');
            
            // Koordinat & Luas
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->integer('luas_lahan')->default(0)->comment('dalam m2');
            
            // Data Koperasi
            $table->integer('jumlah_anggota')->default(0);
            $table->decimal('total_aset', 15, 2)->default(0);
            $table->decimal('total_modal', 15, 2)->default(0);
            
            // Status & Kondisi
            $table->enum('status', ['Aktif', 'Non Aktif', 'Dalam Pembinaan'])->default('Aktif');
            $table->enum('kondisi_lahan', ['Sudah Verifikasi', 'Memenuhi Syarat', 'Tahap Pembangunan', 'Belum Verifikasi'])->default('Belum Verifikasi');
            $table->string('sumber')->nullable()->comment('BPKAD, DPMD, TNI, dll');
            
            // Tahun Pembentukan
            $table->year('tahun_pembentukan')->nullable();
            $table->date('tanggal_berdiri')->nullable();
            
            // Kontak
            $table->string('nomor_telepon')->nullable();
            $table->string('email')->nullable();
            
            // Pengurus
            $table->string('nama_ketua')->nullable();
            $table->string('nama_sekretaris')->nullable();
            $table->string('nama_bendahara')->nullable();
            
            // Progress Pembangunan
            $table->decimal('progress_pembangunan', 5, 2)->default(0)->comment('dalam persen');
            $table->text('keterangan')->nullable();
            
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