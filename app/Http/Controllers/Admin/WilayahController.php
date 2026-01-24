<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kecamatan;
use App\Models\Desa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WilayahController extends Controller
{
    // 1. TAMPILKAN HALAMAN UTAMA
    public function index()
    {
        // Ambil data Kecamatan beserta Desa-desanya
        $listWilayah = Kecamatan::with('desas')->orderBy('nama', 'asc')->paginate(2);
        $kecamatanOpt = Kecamatan::select('id', 'nama')->orderBy('nama', 'asc')->get();

        return Inertia::render('Admin/Wilayah/Index', [
            'wilayah' => $listWilayah,
            'kecamatanOpt' => $kecamatanOpt
        ]);
    }

    // ============================
    // LOGIC KECAMATAN
    // ============================

    public function storeKecamatan(Request $request)
    {
        $request->validate(['nama' => 'required|unique:kecamatans,nama']);

        Kecamatan::create(['nama' => $request->nama]);

        return back()->with('success', 'Kecamatan berhasil ditambah!');
    }

    public function updateKecamatan(Request $request, $id)
    {
        $request->validate(['nama' => 'required|unique:kecamatans,nama,'.$id]);

        $kecamatan = Kecamatan::findOrFail($id);
        $kecamatan->update(['nama' => $request->nama]);

        return back()->with('success', 'Nama Kecamatan diperbarui!');
    }

    public function destroyKecamatan($id)
    {
        $kecamatan = Kecamatan::findOrFail($id);
        $kecamatan->delete(); // Desa di dalamnya otomatis kehapus (cascade)

        return back()->with('success', 'Kecamatan dihapus!');
    }

    // ============================
    // LOGIC DESA
    // ============================

    public function storeDesa(Request $request)
    {
        $request->validate([
            'kecamatan_id' => 'required|exists:kecamatans,id',
            'nama' => 'required'
        ]);

        Desa::create([
            'kecamatan_id' => $request->kecamatan_id,
            'nama' => $request->nama
        ]);

        return back()->with('success', 'Desa berhasil ditambah!');
    }

    public function updateDesa(Request $request, $id)
    {
        $request->validate(['nama' => 'required']);

        $desa = Desa::findOrFail($id);
        $desa->update(['nama' => $request->nama]);

        return back()->with('success', 'Nama Desa diperbarui!');
    }

    public function destroyDesa($id)
    {
        Desa::findOrFail($id)->delete();
        return back()->with('success', 'Desa dihapus!');
    }

    public function getDesaByKecamatan($kecamatan_id)
    {
        // Ambil desa yang kecamatan_id nya cocok
        $desa = Desa::where('kecamatan_id', $kecamatan_id)
                    ->select('id', 'nama') // Ambil yg perlu aja biar ringan
                    ->orderBy('nama')
                    ->get();

        // Balikin JSON (Bukan Inertia::render)
        return response()->json($desa);
    }
}
