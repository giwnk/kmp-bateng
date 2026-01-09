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
            $table->id();
            $table->foreignId('koperasi_id')->constrained('koperasis')->onDelete('cascade');
            $table->foreignId('sdm_koperasi_id')->nullable()->constrained('sdm_koperasis')->onDelete('set null');
            
            $table->string('nomor_anggota')->unique();
            $table->string('nama');
            $table->string('nik', 16);
            $table->text('alamat');
            $table->string('nomor_telepon')->nullable();
            
            $table->date('tanggal_bergabung');
            $table->enum('status', ['Aktif', 'Non Aktif'])->default('Aktif');
            
            // Simpanan
            $table->decimal('simpanan_pokok', 12, 2)->default(0);
            $table->decimal('simpanan_wajib', 12, 2)->default(0);
            $table->decimal('simpanan_sukarela', 12, 2)->default(0);
            $table->decimal('total_simpanan', 12, 2)->default(0);
            
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