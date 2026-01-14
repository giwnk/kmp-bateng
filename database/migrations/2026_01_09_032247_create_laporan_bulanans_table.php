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
        Schema::create('laporan_bulanans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('koperasi_id')->constrained('koperasis')->onDelete('cascade');

            $table->integer('bulan');
            $table->integer('tahun');

            $table->decimal('total_simpanan_pokok', 15, 2)->default(0);
            $table->decimal('total_simpanan_wajib', 15, 2)->default(0);
            $table->decimal('total_shu', 15, 2)->default(0);
            $table->integer('jumlah_anggota_aktif')->default(0);

            $table->text('catatan')->nullable();
            $table->enum('status', ['Draft', 'Submitted', 'Approved'])->default('Draft');

            $table->timestamps();

            $table->unique(['koperasi_id', 'bulan', 'tahun']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_bulanans');
    }
};
