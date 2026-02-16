<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreLaporanBulananRequest;
use App\Http\Requests\UpdateLaporanBulananRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\LaporanBulanan;
use App\Models\Transaksi;
use Inertia\Inertia;
use App\Enums\LaporanStatus;
use App\Services\LaporanService;

class LaporanBulananController extends Controller
{
    protected $laporanService;

    public function __construct(LaporanService $laporanService)
    {
        $this->laporanService = $laporanService;
    }

    public function index(Request $request){
        $koperasi = Auth::user()->koperasi;
        $filters = $request->only(['bulan', 'tahun', 'status']);

        $bulanInput = $request->bulan ?? date('m');
        $tahunInput = $request->tahun ?? date('Y');

        $statusOptions = [
            ['value' => LaporanStatus::DRAFT->value, 'label' => LaporanStatus::DRAFT->label()],
            ['value' => LaporanStatus::SUBMITTED->value, 'label' => LaporanStatus::SUBMITTED->label()],
            ['value' => LaporanStatus::APPROVED->value, 'label' => LaporanStatus::APPROVED->label()],
        ];

        $stats = $this->laporanService->getMonthlyStats($koperasi->id, $bulanInput, $tahunInput);

        return Inertia::render('Koperasi/LaporanBulanan/Index', [
            'laporanBulanan' => $koperasi->laporanBulanan()->filter($filters)->latest()->paginate(10)->withQueryString(),
            'filters' => $filters,
            'jumlahAnggotaAktif' => $stats['jumlah_anggota_aktif'],
            'statusOpt' => $statusOptions,
            'totalSimpananPokok' => $stats['total_simpanan_pokok'],
            'totalSimpananWajib' => $stats['total_simpanan_wajib'],
        ]);
    }

    public function store(StoreLaporanBulananRequest $request)
    {
        $koperasi = Auth::user()->koperasi;
        $validatedData = $request->validated();

        $bulan = $validatedData['bulan'];
        $tahun = $validatedData['tahun'];

        // 1. CEK DUPLIKASI: 
        $existingLaporan = $koperasi->laporanBulanan()
            ->withTrashed()
            ->where('bulan', $bulan)
            ->where('tahun', $tahun)
            ->first();

        if ($existingLaporan) {
            if ($existingLaporan->trashed()) {
                // Jika sudah dihapus, kita hapus permanen agar bisa buat baru (menghindari duplicate entry di DB)
                $existingLaporan->forceDelete();
            } else {
                // Jika masih aktif, baru tampilkan error
                return back()->withErrors(['bulan' => "Laporan untuk periode $bulan/$tahun sudah pernah dibuat!"]);
            }
        }

        // Di dalam function store:
        return DB::transaction(function () use ($koperasi, $validatedData, $bulan, $tahun) {
            $stats = $this->laporanService->getMonthlyStats($koperasi->id, $bulan, $tahun);
            
            $dataLaporan = [
                'koperasi_id'          => $koperasi->id,
                'bulan'                => $bulan,
                'tahun'                => $tahun,
                'jumlah_anggota_aktif' => $stats['jumlah_anggota_aktif'],
                'total_simpanan_pokok' => $stats['total_simpanan_pokok'],
                'total_simpanan_wajib' => $stats['total_simpanan_wajib'],
                'catatan' => $validatedData['catatan'] ?? null,
                'status'  => LaporanStatus::SUBMITTED,
            ];

            $koperasi->laporanBulanan()->create($dataLaporan);

            return back()->with('success', 'Laporan bulanan berhasil dibuat! 🚀');
        });
    }

    public function update(UpdateLaporanBulananRequest $request, LaporanBulanan $laporan){
        $koperasi = Auth::user()->koperasi;
        if ($laporan->koperasi_id !== $koperasi->id) {
            abort(403);
        }
        if (in_array($laporan->status, [LaporanStatus::SUBMITTED, LaporanStatus::APPROVED])) {
            return back()->withErrors([
                'message' => 'Laporan yang sudah terkirim atau disetujui tidak dapat dihapus!'
            ]);
        }
        $validatedData = $request->validated();
        $bulan = $validatedData['bulan'];
        $tahun = $validatedData['tahun'];
        $stats = $this->laporanService->getMonthlyStats($koperasi->id, $bulan, $tahun);
        
        $validatedData['jumlah_anggota_aktif'] = $stats['jumlah_anggota_aktif'];
        $validatedData['total_simpanan_pokok'] = $stats['total_simpanan_pokok'];
        $validatedData['total_simpanan_wajib'] = $stats['total_simpanan_wajib'];

        $laporan->update($validatedData);
        return back()->with('success', 'Laporan berhasil diperbarui');
    }

    public function destroy(LaporanBulanan $laporan){
        $koperasi = Auth::user()->koperasi;
        if ($laporan->koperasi_id !== $koperasi->id) {
            abort(403);
        }

        if (in_array($laporan->status, [LaporanStatus::SUBMITTED, LaporanStatus::APPROVED])) {
            return back()->withErrors([
                'message' => 'Laporan yang sudah terkirim atau disetujui tidak dapat dihapus!'
            ]);
        }

        $laporan->delete();
        return back()->with('success', 'Laporan berhasil dihapus');
    }


}
