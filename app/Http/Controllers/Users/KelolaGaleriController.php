<?php

namespace App\Http\Controllers\Users;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreGaleriRequest;
use App\Http\Requests\UpdateGaleriRequest;
use App\Models\Koperasi;
use App\Models\GaleriKoperasi;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KelolaGaleriController extends Controller
{
    public function index(){
        $galeri = Auth::user()->koperasi()->galeriKoperasis();
        return Inertia::render('Koperasi/Galeri/Index', [
            'galeri' => $galeri->latest()->paginate(10)
        ]);
    }

    public function store(StoreGaleriRequest $request){
        $validatedData = $request->validated();

        DB::transaction(function () use ($request, $validatedData) {
            // Upload file ke storage
            $path = $request->file('foto')->store('galeri', 'public');

            // Simpan ke database melalui relasi koperasi
            Auth::user()->koperasi->galeriKoperasis()->create([
                'foto_path'  => $path,
                'keterangan' => $validatedData['keterangan'] ?? null,
            ]);
        });

        return back()->with('success', 'Foto berhasil diunggah');
    }

    public function destroy(GaleriKoperasi $galeri)
    {
        // Security Check: Pakai policy atau manual (ini cara manual)
        if ($galeri->koperasi_id !== Auth::user()->koperasi->id) {
            abort(403, 'Akses ditolak!');
        }

        // Hapus fisik dan data
        DB::transaction(function () use ($galeri) {
            if ($galeri->foto_path && Storage::disk('public')->exists($galeri->foto_path)) {
                Storage::disk('public')->delete($galeri->foto_path);
            }
            $galeri->delete();
        });

        return back()->with('success', 'Foto berhasil dihapus.');
    }
}
