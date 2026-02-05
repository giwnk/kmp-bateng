<?php

namespace App\Http\Controllers\Users;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreAnggotaRequest;
use App\Http\Requests\UpdateAnggotaRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Koperasi;
use App\Models\AnggotaKoperasi;
use Inertia\Inertia;

class KelolaAnggotaController extends Controller
{
    public function index(){
        $koperasi = Auth::user()->koperasi;
        $anggotaKoperasis = $koperasi->anggotaKoperasis()->latest()->paginate(10);

        return Inertia::render('Koperasi/Anggota/Index', [
            'koperasi' => $koperasi,
            'anggotaKoperasi' => $anggotaKoperasis,
            'statusOpt' => ['Aktif', 'Non Aktif']
        ]);
    }

    public function show(AnggotaKoperasi $anggota){
        if ($anggota->koperasi_id !== Auth::user()->koperasi->id) {
            abort(403);
        }

        return Inertia::render('Koperasi/Anggota/Show', [
            'anggotaData' => $anggota
        ]);
    }

    public function store(StoreAnggotaRequest $request){
        $koperasi = Auth::user()->koperasi;
        $validatedData = $request->validated();
        $koperasi->anggotaKoperasis()->create($validatedData);

        return back()->with('success', 'Anggota berhasil ditambah');
    }

    public function update(UpdateAnggotaRequest $request, AnggotaKoperasi $anggota){
        if ($anggota->koperasi_id !== Auth::user()->koperasi->id) {
            abort(403);
        }

        $validatedData = $request->validated();
        $anggota->update($validatedData);

        return back()->with('success', 'Anggota berhasil diperbarui');
    }

    public function destroy(AnggotaKoperasi $anggota){
        if ($anggota->koperasi_id !== Auth::user()->koperasi->id) {
            abort(403);
        }
        $anggota->delete();
        return back()->with('success', 'Data SDM berhasil dihapus!');
    }
}
