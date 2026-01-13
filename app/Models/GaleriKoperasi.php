<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GaleriKoperasi extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function koperasi() {
        return $this->belongsTo(Koperasi::class);
    }

    // Helper URL Gambar (PENTING BUAT VIEW)
    public function getFotoUrlAttribute() {
        // Asumsi foto disimpan di folder storage
        return asset('storage/' . $this->foto_path);
    }
}
