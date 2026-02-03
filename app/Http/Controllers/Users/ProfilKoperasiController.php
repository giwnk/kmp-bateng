<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateKoperasiRequest;
use App\Models\Koperasi;
use App\Models\Kecamatan;
use App\Models\JenisUsaha;
use App\Models\Desa;

use Inertia\Inertia;

class ProfilKoperasiController extends Controller
{
    public function show(){
        $koperasi = Auth::user()->koperasi;
        $koperasi->load(['kecamatan', 'desa', 'jenisUsahas'])
             ->loadCount([
                'sdmKoperasis as jumlah_pengurus' => function ($query) {
                    $query->where('kategori', 'Pengurus Koperasi');
                },
                'sdmKoperasis as jumlah_pengawas' => function ($query) {
                    $query->where('kategori', 'Pengawas Koperasi');
                }
             ]);
        $kecamatans = Kecamatan::all();
        $desas = Desa::where('kecamatan_id', $koperasi->kecamatan_id)->get();

        return Inertia::render('Koperasi/Profil/Show', [
            'koperasi' => $koperasi,
            'kecamatans' => $kecamatans,
            'desas' => $desas
        ]);
    }

    public function edit(Koperasi $koperasi)
    {
        // 1. Ambil opsi untuk dropdown (Sama kayak create)
        $kecamatans = Kecamatan::select('id', 'nama')->orderBy('nama')->get();
        $jenisUsahas = JenisUsaha::select('id', 'nama')->orderBy('nama')->get();
        $desas = Desa::where('kecamatan_id', $koperasi->kecamatan_id)
                 ->select('id', 'nama')
                 ->get();

        // 2. Load relasi jenis usaha yang sudah dipilih sebelumnya
        $koperasi->load('jenisUsahas');

        // 3. Transformasi data biar enak dimakan Frontend
        // Kita butuh Array ID saja buat default value checkbox (cth: [1, 3, 5])
        $koperasi->jenis_usaha_ids = $koperasi->jenisUsahas->pluck('id');

        return Inertia::render('Koperasi/Profil/Edit', [
            'koperasi' => $koperasi,
            'kecamatanOpt' => $kecamatans,
            'jenisUsahaOpt' => $jenisUsahas,
            'desaOpt' => $desas,
        ]);
    }

    public function update(UpdateKoperasiRequest $request){
        $koperasi = Auth::user()->koperasi;
        $validatedData = $request->validated();
        $koperasi->update($request->except('jenis_usaha_ids'));
        $koperasi->jenisUsahas()->sync($request->jenis_usaha_ids);

        return redirect()->route('users.koperasi.show', $koperasi)->with('success', 'Profil berhasil diperbarui');
    }
}
