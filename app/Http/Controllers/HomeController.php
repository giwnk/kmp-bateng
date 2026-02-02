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
        $totalKoperasi = Koperasi::count();

        // Menghitung berapa Desa/Kelurahan yang memiliki koperasi
        // Asumsi: Kamu punya model Desa. Jika tidak, bisa pakai distinct('desa_id')
        $koperasiDesa = Koperasi::whereHas('desa', function($query) {
                                $query->where('jenis', 'Desa');
                            })->count();
        $koperasiKelurahan = Koperasi::whereHas('desa', function($query) {
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

        $koperasiAktif = Koperasi::where('status_operasional', true)->count();
        $koperasiNonAktif = Koperasi::where('status_operasional', false)->count();

        $statsPotensi = [
            'total_unit' => $totalKoperasi,
            'total_unit_desa' => $koperasiDesa,
            'total_unit_kelurahan' => $koperasiKelurahan,
            'status_koperasi' => [
                'aktif' => $koperasiAktif,
                'non_aktif' => $koperasiNonAktif,
                'total' => $koperasiAktif + $koperasiNonAktif,],
            'tren_pembentukan' => [
                'labels' => $pembentukanPerTahun->pluck('tahun'),
                'values' => $pembentukanPerTahun->pluck('jumlah'),]
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

        $listKecamatan = Kecamatan::withCount([
            // Hitung koperasi yang berada di wilayah bertipe 'Desa'
            'koperasis as unit_desa_count' => function ($query) {
                $query->whereHas('desa', function ($q) {
                    $q->where('jenis', 'Desa'); // Sesuaikan string 'Desa' dengan DB kamu
                });
            },
            // Hitung koperasi yang berada di wilayah bertipe 'Kelurahan'
            'koperasis as unit_kelurahan_count' => function ($query) {
                $query->whereHas('desa', function ($q) {
                    $q->where('jenis', 'Kelurahan'); // Sesuaikan string 'Kelurahan' dengan DB kamu
                });
            },
            // Total keseluruhan per kecamatan
            'koperasis as total_unit_count'
        ])
        ->orderBy('nama')
        ->get()
        ->map(function ($kec, $index) {
            // Transformasi data agar sesuai dengan format tabel (items)
            return [
                'id' => $kec->id,
                'no' => $index + 1,
                'kecamatan' => $kec->nama,
                'desa' => $kec->unit_desa_count ?? 0,
                'kelurahan' => $kec->unit_kelurahan_count ?? 0,
                'jumlah' => $kec->total_unit_count ?? 0,
            ];
        });

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
    public function showKoperasi(Koperasi $koperasi)
    {
        // Load semua relasi yang dibutuhkan untuk halaman detail
        $koperasi->load(['kecamatan', 'desa', 'jenisUsahas']);
        $koperasi->loadCount([
            'anggotaKoperasis', // Menghitung baris di tabel anggota_koperasis

            // Menghitung pengurus (asumsi ada kolom 'kategori' di tabel sdm_koperasis)
            'sdmKoperasis as pengurus_count' => function ($query) {
                $query->where('kategori', 'Pengurus');
            },

            // Menghitung pengawas
            'sdmKoperasis as pengawas_count' => function ($query) {
                $query->where('kategori', 'Pengawas');
            },
        ]);

        return Inertia::render('KoperasiShow', [
            'koperasi' => $koperasi
        ]);
    }

    public function showKecamatan(Kecamatan $kecamatan)
    {
        // 1. Ambil data koperasi yang berelasi dengan kecamatan ini
        // Kita gunakan paginate agar sesuai dengan komponen Table kamu
        $koperasis = Koperasi::where('kecamatan_id', $kecamatan->id)
            ->with(['desa', 'jenisUsahas']) // Eager loading relasi
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // 2. Tambahkan statistik ringkas untuk header halaman
        $stats = [
            'total_unit' => Koperasi::where('kecamatan_id', $kecamatan->id)->count(),
            'aktif' => Koperasi::where('kecamatan_id', $kecamatan->id)->where('status_operasional', true)->count(),
            'total_anggota' => AnggotaKoperasi::whereHas('koperasi', function ($q) use ($kecamatan) {
                $q->where('kecamatan_id', $kecamatan->id);
            })->count(),
        ];

        return Inertia::render('KecamatanShow', [
            'kecamatan' => $kecamatan,
            'koperasis' => $koperasis,
            'stats' => $stats
        ]);
    }
}
