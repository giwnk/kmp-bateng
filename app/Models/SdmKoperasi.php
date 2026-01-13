<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SdmKoperasi extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function koperasi() {
        return $this->belongsTo(Koperasi::class);
    }

    // Scope buat filter Pengurus vs Pengawas
    public function scopePengurus($query) {
        return $query->where('kategori', 'Pengurus Koperasi');
    }
}
