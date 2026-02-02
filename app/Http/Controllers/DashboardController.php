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
                                ->where('status', 'Submitted') // Ambil yang statusnya baru dikirim
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
        // Pastikan user sudah terhubung ke koperasi
        if (!$user->koperasi_id) {
            return ; // Buat view error kalau user belum di-set koperasinya
        }

        $koperasiId = $user->koperasi_id;
        $bulanIni = Carbon::now()->month;
        $tahunIni = Carbon::now()->year;


        // Cek apakah laporan bulan ini sudah ada?
        $laporanBulanIni = LaporanBulanan::where('koperasi_id', $koperasiId)
                            ->whereMonth('created_at', $bulanIni)
                            ->whereYear('created_at', $tahunIni)
                            ->where('status', 'Submitted')
                            ->exists();

        // Fitur sesuai gambar: Anggota, Saldo, Status Laporan, Shortcut
        $data = [
            // 1. Statistik Mikro
            'total_anggota'    => AnggotaKoperasi::where('koperasi_id', $koperasiId)->count(),

            // PENTING: Pakai sum() bukan count() untuk uang
            'total_saldo'      => Transaksi::where('koperasi_id', $koperasiId)
                                    ->where('jenis', ['Simpanan Pokok', 'Simpanan Wajib', 'Simpanan Sukarela']) // Asumsi: hitung uang masuk saja
                                    ->sum('jumlah'),

            // 2. Status Laporan (Boolean: true/false)
            'sudah_lapor'      => $laporanBulanIni,

            // 3. Audit Trail (5 Transaksi Terakhir)
            'recent_transaksi' => Transaksi::with('anggota') // Eager load biar nama anggota muncul
                                    ->where('koperasi_id', $koperasiId)
                                    ->latest()
                                    ->take(5)
                                    ->get(),
        ];

        return Inertia::render('Koperasi/Dashboard/Index', [
            'data' => $data
        ]);
    }
}
