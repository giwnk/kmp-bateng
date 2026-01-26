<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LaporanBulanan;
use App\Models\Koperasi; // Penting untuk ambil list kecamatan/koperasi
use App\Models\Kecamatan;
use Inertia\Inertia;

class LaporanBulananController extends Controller
{
    public function index(Request $request)
    {
        // 1. Ambil semua input filter
        $filters = $request->only(['bulan', 'tahun', 'kecamatan', 'status' ]);

        // 2. Query Global: Mulai dari model LaporanBulanan langsung
        $laporanBulanan = LaporanBulanan::query()
            ->with('koperasi.kecamatan') // WAJIB: Biar tau ini laporan punya koperasi mana
            ->filter($filters) // Scope filter kita yang sakti tadi
            ->latest()
            ->paginate(15)
            ->withQueryString();

        // 3. Tambahan: Ambil daftar kecamatan unik dari tabel Koperasi buat dropdown di FE
        $listKecamatan = Kecamatan::orderBy('nama')->get;

        return Inertia::render('Admin/LaporanBulanan/Index', [
            'laporanBulanan' => $laporanBulanan,
            'filters' => $filters,
            'listKecamatan' => $listKecamatan, // Kirim list buat isi dropdown
        ]);
    }

    public function updateStatus(Request $request, LaporanBulanan $laporan){
        $validatedData = $request->validate([
            'status' => 'required|in:Approved,Rejected,Submitted'
        ]);

        $laporan->update([
            'status' => $validatedData['status']
        ]);

        return back()->with('success', 'Status laporan berhasil diperbarui!');
    }
}
