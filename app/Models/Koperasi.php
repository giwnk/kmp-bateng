<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Koperasi extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // Biar data angka & boolean otomatis rapi
    protected $casts = [
        'status_operasional' => 'boolean',
        'status_sertifikat'  => 'boolean',
        'status_pelatihan'   => 'boolean',
        'total_aset'         => 'decimal:2',
        'total_modal'        => 'decimal:2',
    ];

    // --- RELASI ---
    public function kecamatan() {
        return $this->belongsTo(Kecamatan::class);
    }

    public function desa() {
        return $this->belongsTo(Desa::class);
    }

    public function jenisUsahas() {
        return $this->hasMany(JenisUsaha::class);
    }

    public function sdmKoperasis() {
        return $this->hasMany(SdmKoperasi::class);
    }

    public function anggotaKoperasis() {
        return $this->hasMany(AnggotaKoperasi::class);
    }

    public function galeriKoperasis() {
        return $this->hasMany(GaleriKoperasi::class);
    }

    // --- FITUR TAMBAHAN (ACCESSOR) ---
    // Panggil di view: $koperasi->formatted_total_aset
    public function getFormattedTotalAsetAttribute() {
        return 'Rp ' . number_format($this->total_aset, 0, ',', '.');
    }
}
