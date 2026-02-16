<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\LaporanStatus;


class LaporanBulanan extends Model
{
    use HasFactory,  HasUuids, SoftDeletes;
    protected $guarded = ['id'];

    protected $casts = [
        'total_simpanan_pokok' => 'decimal:2', 
        'total_simpanan_wajib' => 'decimal:2', 
        'status' => LaporanStatus::class
    ];

    public function koperasi() {
        return $this->belongsTo(Koperasi::class);
    }

    public function scopeFilter($query, array $filters){
        $query->when($filters['bulan'] ?? null, function($query, $bulan){
            $query->where('bulan', $bulan);
        });

        $query->when($filters['tahun'] ?? null, function($query, $tahun){
            $query->where('tahun', $tahun);
        });

        $query->when($filters['kecamatan'] ?? null, function($query, $kecamatan){
            $query->whereHas('koperasi', function($query) use ($kecamatan){
                $query->where('kecamatan', $kecamatan);
            });
        });

        $query->when($filters['status'] ?? null, function($query, $status){
            $query->whereIn('status', $status);
        });

    }
}
