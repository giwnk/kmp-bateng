<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use App\Models\Koperasi;
use App\Models\SdmKoperasi;
use App\Models\AnggotaKoperasi;
use App\Models\JenisUsaha;
use App\Models\Desa;
use App\Models\Kecamatan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Halaman Utama (Landing Page)
     */
    public function index()
    {
        // ==========================================================
        // 1. CARD POTENSI (Unit, Wilayah, & Tren Pertahun)
        // ==========================================================
        $totalKoperasi = Koperasi::where('status_operasional', true)->count();

        // Menghitung berapa Desa/Kelurahan yang memiliki koperasi
        // Asumsi: Kamu punya model Desa. Jika tidak, bisa pakai distinct('desa_id')
        $koperasiDesa = Koperasi::where('status_operasional', true)->whereHas('desa', function($query) {
                                $query->where('jenis', 'Desa');
                            })->count();
        $koperasiKelurahan = Koperasi::where('status_operasional', true)->whereHas('desa', function($query) {
                    $query->where('jenis', 'Kelurahan');
                })->count();

        // B. Hitung TOTAL Desa (Untuk perbandingan)
        $totalDesa = Desa::count();

        // Statistik Pembentukan per Tahun (untuk Grafik Bar di Card 1)
        $pembentukanPerTahun = Koperasi::select(
                DB::raw('tahun_pembentukan as tahun'),
                DB::raw('count(*) as jumlah')
            )
            ->whereNotNull('tahun_pembentukan')
            ->groupBy('tahun_pembentukan')
            ->orderBy('tahun_pembentukan', 'desc')
            ->limit(5) // Ambil 5 tahun terakhir saja
            ->get();

        $statsPotensi = [
            'total_unit' => $totalKoperasi,
            'total_unit_desa' => $koperasiDesa,
            'total_unit_kelurahan' => $koperasiKelurahan,
            'tren_pembentukan' => $pembentukanPerTahun
        ];

        // ==========================================================
        // 2. CARD JENIS USAHA (List & Persentase)
        // ==========================================================
        // Ambil Jenis Usaha beserta jumlah koperasi yang menjalankannya
        $query = JenisUsaha::withCount('koperasis')->orderByDesc('koperasis_count');
        $dataJenisUsaha = $query->paginate(5);

        // Hitung total populasi untuk penyebut (denominator) persentase
        $totalUsaha = $dataJenisUsaha->sum('koperasis_count');

        // Map data agar siap tampil (hitung % di sini biar frontend enteng)
        $statsJenisUsaha = $dataJenisUsaha->through(function($item) use ($totalUsaha) {
            return [
                'nama' => $item->nama,
                'jumlah' => $item->koperasis_count,
                'persen' => $totalUsaha > 0
                    ? round(($item->koperasis_count / $totalUsaha) * 100, 2)
                    : 0
            ];
        });// Urutkan dari yg terbanyak


        // ==========================================================
        // 3. CARD SDM KOPERASI (Tabel Rincian)
        // ==========================================================
        // Berdasarkan gambar tabel SDM & Anggota

        // A. Pengurus (Ambil dari SdmKoperasi where kategori = Pengurus)
        $jmlPengurus = SdmKoperasi::where('kategori', 'Pengurus Koperasi')
                        ->where('status', 'Aktif')->count();

        // B. Pengawas (Ambil dari SdmKoperasi where kategori = Pengawas)
        $jmlPengawas = SdmKoperasi::where('kategori', 'Pengawas Koperasi')
                        ->where('status', 'Aktif')->count();

        // C. Anggota (Ambil dari tabel AnggotaKoperasi)
        $jmlAnggota = AnggotaKoperasi::where('status', 'Aktif')->count();

        $totalSdm = $jmlPengurus + $jmlPengawas + $jmlAnggota;

        $statsSdm = [
            'total' => $totalSdm,
            'rincian' => [
                [
                    'kategori' => 'Pengurus Koperasi',
                    'jumlah' => $jmlPengurus,
                    'persen' => $totalSdm > 0 ? round(($jmlPengurus/$totalSdm)*100, 2) : 0
                ],
                [
                    'kategori' => 'Pengawas Koperasi',
                    'jumlah' => $jmlPengawas,
                    'persen' => $totalSdm > 0 ? round(($jmlPengawas/$totalSdm)*100, 2) : 0
                ],
                [
                    'kategori' => 'Anggota Koperasi',
                    'jumlah' => $jmlAnggota,
                    'persen' => $totalSdm > 0 ? round(($jmlAnggota/$totalSdm)*100, 2) : 0
                ],
            ]
        ];

        // ==========================================================
        // DATA PENDUKUNG LAIN (Peta & Sidebar)
        // ==========================================================
        $mapMarkers = Koperasi::select('id', 'nama', 'latitude', 'longitude', 'alamat', 'status_operasional')
            ->whereNotNull('latitude')->whereNotNull('longitude')
            ->get();

        $listKecamatan = Kecamatan::withCount(['koperasis' => function($q){
            $q->where('status_operasional', true);
        }])->orderBy('nama')->get();

        return Inertia::render('Home', [
            'statsPotensi' => $statsPotensi,
            'statsJenisUsaha' => $statsJenisUsaha,
            'statsSdm' => $statsSdm,
            'mapMarkers' => $mapMarkers,
            'listKecamatan' => $listKecamatan
        ]);
    }

    /**
     * API: Ambil List Koperasi berdasarkan Kecamatan (Saat Kecamatan di-klik)
     * Return: JSON
     */
    public function getKoperasiByKecamatan($kecamatanId)
    {
        $koperasis = Koperasi::where('kecamatan_id', $kecamatanId)
            ->select('id', 'nama', 'alamat', 'status_operasional', 'logo') // Ambil yg perlu aja
            ->with(['jenisUsaha:id,nama']) // Eager load jenis usaha
            ->get();

        return response()->json($koperasis);
    }

    /**
     * Halaman Detail Koperasi (Saat Koperasi di-klik)
     */
    public function show(Koperasi $koperasi)
    {
        // Load semua relasi yang dibutuhkan untuk halaman detail
        $koperasi->load(['kecamatan', 'desa', 'jenisUsaha']);

        return Inertia::render('Home/DetailKoperasi', [
            'koperasi' => $koperasi
        ]);
    }
}
