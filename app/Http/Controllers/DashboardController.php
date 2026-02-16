<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Koperasi;
use App\Models\User;
use App\Models\AnggotaKoperasi;
use App\Models\Transaksi;
use App\Models\LaporanBulanan; // Pastikan Model Laporan sudah ada/sesuaikan namanya
use Carbon\Carbon; // Wajib buat urusan tanggal
use Inertia\Inertia;
use App\Enums\LaporanStatus;

class DashboardController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // 1. Cek Role: Admin Dinas
        if ($user->isAdminDinas()) {
            return $this->dashboardDinas();
        }

        // 2. Cek Role: User Koperasi
        if ($user->isUserKoperasi()) {
            return $this->dashboardKoperasi($user);
        }

        abort(403, 'Akses ditolak.');
    }

    // --- LOGIC DINAS (Executive View) ---
    private function dashboardDinas()
    {
        // Fitur sesuai gambar: Total, Grafik Aktif/Mati, Total User, Monitoring
        $data = [
            // 1. Kartu Statistik Utama
            'total_koperasi'    => Koperasi::count(),
            'koperasi_aktif'    => Koperasi::where('status_operasional', true)->count(), // Asumsi ada kolom status
            'koperasi_nonaktif' => Koperasi::where('status_operasional', false)->count(),
            'total_user'        => User::where('role', 'user_koperasi')->count(),

            // 2. Monitoring (Tabel Koperasi Baru)
            'koperasi_baru'     => Koperasi::latest()->take(5)->get(),

            // 3. Peta Sebaran (Ambil data lokasi saja biar ringan)
            // Pastikan tabel koperasi punya kolom 'latitude' dan 'longitude'
            'peta_sebaran'      => Koperasi::select('id', 'nama', 'latitude', 'longitude', 'alamat')
                                    ->whereNotNull('latitude')
                                    ->get(),

            'laporan_terbaru'   => LaporanBulanan::with('koperasi')
                                ->where('status', LaporanStatus::SUBMITTED) // Ambil yang statusnya baru dikirim
                                ->latest()
                                ->take(5)
                                ->get(),
        ];

        return Inertia::render('Admin/Dashboard/Index', [
            'data' => $data
        ]);
    }

    // --- LOGIC KOPERASI (Local View) ---
    private function dashboardKoperasi($user)
    {
        // 1. Validasi Koperasi (Security First!)
        if (!$user->koperasi_id) {
            return redirect()->route('profile.edit')->with('warning', 'Lengkapi data koperasi Anda.');
        }

        $koperasiId = $user->koperasi_id;
        $now = Carbon::now();

        // 2. Cek Status Laporan Bulan Ini
        $laporan = LaporanBulanan::where('koperasi_id', $koperasiId)
            ->where('bulan', $now->month)
            ->where('tahun', $now->year)
            ->first();

        $statusLapor = LaporanStatus::DRAFT->label();
        if ($laporan) {
            if ($laporan->status === LaporanStatus::APPROVED) {
                $statusLapor = LaporanStatus::APPROVED->label();
            } elseif ($laporan->status === LaporanStatus::SUBMITTED) {
                $statusLapor = LaporanStatus::SUBMITTED->label();
            }
        }

        // 3. Logika Grafik: Tren Simpanan 6 Bulan Terakhir (Line Chart)
        $chartTrend = Transaksi::select(
            DB::raw("DATE_FORMAT(tanggal_transaksi, '%M') as bulan"), // Nama bulan untuk label chart
            DB::raw("SUM(jumlah) as total")
        )
            ->where('koperasi_id', $koperasiId)
            ->where('jenis_transaksi', '!=', 'Penarikan')
            ->where('tanggal_transaksi', '>=', Carbon::now()->subMonths(6))
            // 1. Tambahkan format Tahun-Bulan di Group By agar Januari 2025 & 2026 tidak tercampur
            ->groupBy(DB::raw("DATE_FORMAT(tanggal_transaksi, '%Y-%m')"), 'bulan')
            // 2. Urutkan berdasarkan format Tahun-Bulan agar urutan chart-nya kronologis (bukan alfabet)
            ->orderBy(DB::raw("DATE_FORMAT(tanggal_transaksi, '%Y-%m')"), 'asc')
            ->get();

        // 4. Logika Grafik: Komposisi Simpanan (Doughnut Chart)
        $komposisiSimpanan = Transaksi::select('jenis_transaksi', DB::raw('SUM(jumlah) as total'))
            ->where('koperasi_id', $koperasiId)
            ->whereIn('jenis_transaksi', ['Simpanan Pokok', 'Simpanan Wajib', 'Simpanan Sukarela'])
            ->groupBy('jenis_transaksi')
            ->get();

        

        // 5. Build Data Final
        $data = [
            'stats' => [
                'total_anggota' => AnggotaKoperasi::where('koperasi_id', $koperasiId)->count(),
                'total_saldo'   => Transaksi::where('koperasi_id', $koperasiId)
                                    ->where('jenis_transaksi', '!=', 'Penarikan')
                                    ->sum('jumlah'),
                'status_lapor'   => $statusLapor,
            ],
            'charts' => [
                'trend'     => $chartTrend,
                'komposisi' => $komposisiSimpanan,
            ],
            'recent_transaksi' => Transaksi::with('anggotaKoperasi')
                ->where('koperasi_id', $koperasiId)
                ->latest()
                ->take(5)
                ->get(),
            'recent_anggota' => AnggotaKoperasi::where('koperasi_id', $koperasiId)
            ->latest()
            ->take(5)
            ->get(),
        ];

        return Inertia::render('Koperasi/Dashboard/Index', [
            'data' => $data
        ]);
    }
}
