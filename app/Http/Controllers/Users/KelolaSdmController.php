<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Http\Requests\StoreSdmRequest;
use App\Http\Requests\UpdateSdmRequest;
use App\Models\Koperasi;
use App\Models\SdmKoperasi;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class KelolaSdmController extends Controller
{
    public function index(){
        $koperasi = Auth::user()->koperasi;
        $sdmKoperasi = $koperasi->sdmKoperasis()->latest()->get();
        return Inertia::render('Koperasi/Sdm/Index', [
            'koperasi' => $koperasi,
            'sdmKoperasi' => $sdmKoperasi,
            'jabatanOpt' => ['Ketua', 'Sekretaris', 'Bendahara', 'Pengawas', 'Manager'],
            'statusOpt' => ['Aktif', 'Non Aktif']
        ]);
    }

    public function edit(SdmKoperasi $sdm) {
    // Pastikan hak akses aman
        if ($sdm->koperasi_id != Auth::user()->koperasi_id) { abort(403); }

        return Inertia::render('Koperasi/Sdm/Edit', [
            'sdmData' => $sdm,
            'jabatanOpt' => ['Ketua', 'Sekretaris', 'Bendahara', 'Pengawas', 'Manager'],
            'statusOpt' => ['Aktif', 'Non Aktif']
        ]);
    }

    public function show(SdmKoperasi $sdm){
        if ($sdm->koperasi_id !== Auth::user()->koperasi->id) {
            abort(403);
        }

        return Inertia::render('Koperasi/Sdm/Show', [
            'sdmData' => $sdm
        ]);
    }

    public function store(StoreSdmRequest $request){
        $koperasi = Auth::user()->koperasi;
        $validatedData = $request->validated();
        $koperasi->sdmKoperasis()->create($validatedData);

        return back()->with('success', 'Data SDM berhasil ditambahkan');
    }

    public function update(UpdateSdmRequest $request, SdmKoperasi $sdm){
        if ($sdm->koperasi_id != Auth::user()->koperasi_id) {
            abort(403);
        }
        $validatedData = $request->validated();

        // 1. Cek apakah user meng-upload file foto baru?
        if ($request->hasFile('foto')) {
            // a. Hapus foto lama dari penyimpanan jika ada
            if ($sdm->foto) {
                Storage::delete($sdm->foto);
            }
            // b. Simpan foto baru ke folder 'foto-sdm' di disk 'public'
            // dan masukkan path-nya ke variabel $validatedData
            $validatedData['foto'] = $request->file('foto')->store('foto-sdm', 'public');
        } else {
            // 2. PENTING: Jika tidak ada foto baru, HAPUS key 'foto' dari array.
            // Ini mencegah kolom 'foto' di database tertimpa menjadi NULL.
            unset($validatedData['foto']);
        }


        $sdm->update($validatedData);

        return redirect()->route('users.sdm.index')->with('success', 'Data SDM berhasil diperbarui!');
    }

    public function destroy(SdmKoperasi $sdm){
        if ($sdm->koperasi_id != Auth::user()->koperasi_id) {
        abort(403, 'Anda tidak berhak mengakses data ini.');
    }
        $sdm->delete();
        return back()->with('success', 'Data SDM berhasil dihapus!');
    }

}
