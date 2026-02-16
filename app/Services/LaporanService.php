<?php

namespace App\Services;

use App\Models\Transaksi;
use App\Models\AnggotaKoperasi;

class LaporanService
{
    /**
     * Menghitung statistik bulanan untuk laporan koperasi.
     * 
     * @param string $koperasiId
     * @param int $bulan
     * @param int $tahun
     * @return array
     */
    public function getMonthlyStats(string $koperasiId, int $bulan, int $tahun): array
    {
        return [
            'total_simpanan_pokok' => $this->sumTransaksi($koperasiId, 'Simpanan Pokok', $bulan, $tahun),
            'total_simpanan_wajib' => $this->sumTransaksi($koperasiId, 'Simpanan Wajib', $bulan, $tahun),
            'jumlah_anggota_aktif' => AnggotaKoperasi::where('koperasi_id', $koperasiId)
                                        ->where('status', 'Aktif')
                                        ->count(),
        ];
    }

    /**
     * Helper untuk sum transaksi berdasarkan jenis, bulan, dan tahun.
     */
    private function sumTransaksi(string $koperasiId, string $jenis, int $bulan, int $tahun): float
    {
        return (float) Transaksi::whereHas('anggotaKoperasi', function ($query) use ($koperasiId) {
                $query->where('koperasi_id', $koperasiId);
            })
            ->where('jenis_transaksi', $jenis)
            ->whereMonth('tanggal_transaksi', $bulan)
            ->whereYear('tanggal_transaksi', $tahun)
            ->sum('jumlah');
    }
}
