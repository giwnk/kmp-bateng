<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Koperasi extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = ['id'];

    // Biar data angka & boolean otomatis rapi
    protected $casts = [
        'tanggal_ahu' => 'date',
        'tahun_pembentukan' => 'date',
        'tanggal_berdiri' => 'date',
        'latitude' => 'double',
        'longitude' => 'double',
        'status_operasional' => 'boolean',
        'status_sertifikat' => 'boolean',
        'status_pelatihan' => 'boolean',
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

    public function laporanBulanan() {
        return $this->hasMany(LaporanBulanan::class);
    }

    public function jenisUsaha(){
        return $this->belongsToMany(JenisUsaha::class, 'pilihan_jenis_usaha');
    }

    // --- FITUR TAMBAHAN (ACCESSOR) ---
    // Panggil di view: $koperasi->formatted_total_aset
    public function getFormattedTotalAsetAttribute() {
        return 'Rp ' . number_format($this->total_aset, 0, ',', '.');
    }

    public function ketua()
    {
        return $this->hasOne(SdmKoperasi::class, 'koperasi_id')
                    ->where('jabatan', 'Ketua')
                    ->where('status', 'Aktif')
                    ->latestOfMany();
    }

    public function sekretaris()
    {
        return $this->hasOne(SdmKoperasi::class, 'koperasi_id')
                    ->where('jabatan', 'Sekretaris')
                    ->where('status', 'Aktif')
                    ->latestOfMany();
    }

    public function bendahara()
    {
        return $this->hasOne(SdmKoperasi::class, 'koperasi_id')
                    ->where('jabatan', 'Bendahara')
                    ->where('status', 'Aktif')
                    ->latestOfMany();
    }
}
