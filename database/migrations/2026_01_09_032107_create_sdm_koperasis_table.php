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
        Schema::create('sdm_koperasis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('koperasi_id')->constrained('koperasis')->onDelete('cascade');

            $table->string('nama');
            $table->string('nik', 16)->unique();
            $table->enum('kategori', ['Pengurus Koperasi', 'Pengawas Koperasi']);
            $table->date('tanggal_bergabung');
            $table->enum('jabatan', [
                'Ketua',
                'Sekretaris',
                'Bendahara',
                'Pengawas Utama',
                'Pengawas',
                'Anggota',
                'Manajer',
                'Staff',
            ])->nullable();

            $table->text('alamat')->nullable();
            $table->string('nomor_telepon')->nullable();
            $table->string('email')->nullable();
            $table->enum('status', ['Aktif', 'Non Aktif'])->default('Aktif');
            $table->string('foto')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sdm_koperasis');
    }
};
