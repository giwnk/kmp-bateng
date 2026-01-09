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
        Schema::create('pembentukan_koperasis', function (Blueprint $table) {
            $table->id();
            $table->year('tahun');
            $table->integer('jumlah_koperasi')->default(0);
            $table->text('keterangan')->nullable();
            $table->timestamps();
            
            $table->unique('tahun');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembentukan_koperasis');
    }
};