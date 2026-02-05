<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransaksiRequest;
use App\Models\Transaksi;
use App\Models\AnggotaKoperasi;
use App\Models\Koperasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransaksiController extends Controller
{
    public function index(Request $request){
        $koperasi = Auth::user()->koperasi;
        $filters = $request->only(['search', 'jenis']);

        $transaksi = $koperasi->transaksis() // Nah, di sini baru panggil relasi transaksinya
            ->with('anggotaKoperasi')
            ->filter($filters)
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Koperasi/Transaksi/Index', [
            'transaksi' => $transaksi,
            'anggotaOpt' => $koperasi->anggotaKoperasis()->get(['id', 'nama', 'nik']),
            'jenisTransaksiOpt' => ['Simpanan Pokok', 'Simpanan Wajib', 'Simpanan Sukarela', 'Penarikan'],
            'filters' => $filters
        ]);
    }

    public function store(StoreTransaksiRequest $request)
    {
        $validated = $request->validated();
        $koperasi = Auth::user()->koperasi;

        return DB::transaction(function () use ($validated, $koperasi) {
            $anggota = AnggotaKoperasi::findOrFail($validated['anggota_koperasi_id']);

            if ($validated['jenis_transaksi'] === 'Penarikan') {
                // Kita cuma izinkan narik dari saldo Sukarela
                $saldoSukarela = $anggota->transaksis()->where('kategori', 'Simpanan Sukarela')->sum('jumlah')
                            - $anggota->transaksis()->where('jenis_transaksi', 'penarikan')->sum('jumlah');

                if ($saldoSukarela < $validated['jumlah']) {
                    return back()->withErrors([
                        'jumlah' => "Saldo Sukarela nggak cukup! Sisa saldo: Rp " . number_format($saldoSukarela, 0, ',', '.')
                    ]);
                }
            }

            $koperasi->transaksis()->create($validated);

            return back()->with('success', 'Transaksi ' . $validated['jenis_transaksi'] . ' berhasil! 🚀');
        });
    }

    public function destroy(Transaksi $transaksi)
    {
        // Security Check: Pastikan ini transaksi milik koperasi si user
        if ($transaksi->koperasi_id !== Auth::user()->koperasi->id) {
            abort(403, 'Eits, gak boleh hapus transaksi koperasi lain! 🛑');
        }

        // Hapus data
        $transaksi->delete();

        return back()->with('success', 'Transaksi berhasil dihapus/dibatalkan.');
    }
}
