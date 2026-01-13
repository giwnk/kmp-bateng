<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kecamatan extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    // Relasi ke Desa
    public function desas() {
        return $this->hasMany(Desa::class);
    }

    // Relasi ke Koperasi (Biar bisa ambil semua koperasi satu kecamatan)
    public function koperasis() {
        return $this->hasMany(Koperasi::class);
    }
}
