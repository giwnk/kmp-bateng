<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;

class SdmKoperasi extends Model
{
    use HasFactory, HasUuids, SoftDeletes;
    protected $guarded = ['id'];
    protected $casts = ['kategori' => 'string', 'jabatan' => 'string', 'status' => 'string', 'tanggal_bergabung' => 'date:Y-m-d'];
    protected $appends = ['foto_url'];

    public function koperasi() {
        return $this->belongsTo(Koperasi::class);
    }

    // Scope buat filter Pengurus vs Pengawas
    public function scopePengurus($query) {
        return $query->where('kategori', 'Pengurus Koperasi');
    }

    public function getFotoUrlAttribute()
    {
        // Jika ada data di kolom 'foto', buatkan URL publiknya.
        // Jika tidak, kembalikan null.
        return $this->foto ? Storage::url($this->foto) : null;
    }
}
