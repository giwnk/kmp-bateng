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
        Schema::create('transaksis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('koperasi_id')->constrained('koperasis')->onDelete('cascade');
            $table->foreignId('anggota_koperasi_id')->nullable()->constrained('anggota_koperasis')->onDelete('set null');
            
            $table->string('nomor_transaksi')->unique();
            $table->enum('jenis_transaksi', ['Simpanan', 'Pinjaman', 'Angsuran', 'Penarikan', 'SHU']);
            $table->decimal('jumlah', 15, 2);
            $table->date('tanggal_transaksi');
            $table->text('keterangan')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksis');
    }
};