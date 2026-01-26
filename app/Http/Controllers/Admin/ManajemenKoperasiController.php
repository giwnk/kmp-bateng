<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Koperasi;
use App\Models\Kecamatan;
use App\Models\Desa;
use App\Models\JenisUsaha;

use App\Http\Requests\StoreKoperasiRequest;
use App\Http\Requests\UpdateKoperasiRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ManajemenKoperasiController extends Controller
{
    public function index(){
        $kecamatans = Kecamatan::all();
        $desas = Desa::all();
        $koperasis = Koperasi::with(['kecamatan', 'desa', 'jenisUsahas'])->latest()->paginate(9);

        return Inertia::render('Admin/Koperasi/Index', [
            'koperasis' => $koperasis,
            'kecamatans' => $kecamatans,
            'desas' => $desas
        ]);
    }

    public function show(Koperasi $koperasi){
        $koperasi->load(['kecamatan', 'desa', 'ketua', 'sekretaris', 'bendahara', 'jenisUsahas']);

        return Inertia::render('Admin/Koperasi/Show', [
            'koperasi' => $koperasi
        ]);
    }

    public function create()
    {
        // Kirim data kecamatan (id & nama) ke frontend
        $kecamatans = \App\Models\Kecamatan::select('id', 'nama')->orderBy('nama')->get();
        $jenisUsahas = JenisUsaha::select('id', 'nama')->orderBy('nama')->get();

        return Inertia::render('Admin/Koperasi/Create', [
            'kecamatanOpt' => $kecamatans,
            'jenisUsahaOpt' => $jenisUsahas
        ]);
    }

    public function store(StoreKoperasiRequest $request){
        $data = $request->validated();
        $jenisUsahaIds = $data['jenis_usaha_ids'];
        unset($data['jenis_usaha_ids']);

        $koperasi =  Koperasi::create($data);
        $koperasi->jenisUsaha()->attach($jenisUsahaIds);

        return back()->with('success', 'Koperasi berhasil ditambahkan');
    }

    public function destroy(Koperasi $koperasi)
    {
        $koperasi->delete();
        return back()->with('success', 'Koperasi berhasil dihapus');
    }
}
