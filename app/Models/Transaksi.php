<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // 👈 Import UUID
use Illuminate\Support\Str;

class Transaksi extends Model
{
    use HasFactory, HasUuids;
    protected $guarded = ['id'];
    protected $casts = ['tanggal_transaksi' => 'date',
        'jenis_transaksi' => 'string',
        'jumlah' => 'decimal:2',
    ];

    public function koperasi() {
        return $this->belongsTo(Koperasi::class);
    }

    public function anggotaKoperasi() {
        return $this->belongsTo(AnggotaKoperasi::class, 'anggota_koperasi_id');
    }

    public function scopeFilter($query, array $filters) {
    // Cari berdasarkan No Transaksi atau Nama Anggota
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('nomor_transaksi', 'like', '%' . $search . '%')
                    ->orWhereHas('anggotaKoperasi', function ($query) use ($search) {
                        $query->where('nama', 'like', '%' . $search . '%');
                    });
            });
        });

        // Tambahan: Filter berdasarkan Jenis (Simpanan/Penarikan)
        $query->when($filters['jenis'] ?? null, function ($query, $jenis) {
            $query->where('jenis_transaksi', $jenis);
        });
    }

    protected static function booted()
    {
        static::creating(function ($transaksi) {
            // Logic Generate Nomor Otomatis
            $transaksi->nomor_transaksi = 'TRX-' . now()->format('YmdHis') . '-' . Str::upper(Str::random(3));
        });
    }
}
