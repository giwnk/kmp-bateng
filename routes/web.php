<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

use App\Models\Koperasi;
use App\Models\JenisUsaha;
use App\Models\SdmKoperasi;
use App\Models\PembentukanKoperasi;
use App\Models\Desa;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/home', function(){

    $totalKoperasi = Koperasi::count();
    $totalSdm = SdmKoperasi::count();
    $totalDesa = Desa::count();

    $historyData = PembentukanKoperasi::orderBy('tahun', 'desc')->take(5)->get();
    $totalHistory = $historyData->sum('jumlah_koperasi');
    $potensi = [
        'desa' => 56, // Masih hardcode utk data wilayah (bisa diganti query Desa::count() nanti)
        'kelurahan' => 7,
        'total' => $totalDesa,
        'history' => $historyData->map(function($item) use ($totalHistory) {
            return [
                'tahun' => $item->tahun,
                'jumlah' => $item->jumlah_koperasi,
                // Hitung persen kontribusi thd total
                'persen' => $totalHistory > 0 ? round(($item->jumlah_koperasi / $totalHistory) * 100, 1) : 0
            ];
        })
    ];

    $jenisUsaha = JenisUsaha::select('nama', DB::raw('count(*) as jumlah'))
        ->groupBy('nama')
        ->orderByDesc('jumlah')
        ->get()
        ->map(function($item) use ($totalKoperasi) {
            return [
                'nama' => $item->nama, // "GERAI SEMBAKO", dll
                'jumlah' => $item->jumlah,
                // Rumus: (Jumlah Usaha Tsb / Total Koperasi) * 100
                'persen' => $totalKoperasi > 0 ? round(($item->jumlah / $totalKoperasi) * 100, 2) : 0,
                'color' => 'bg-emerald-500' // Warna default hijau kayak screenshot
            ];
        });

    $sdmRaw = SdmKoperasi::select('kategori', DB::raw('count(*) as jumlah'))
        ->groupBy('kategori')
        ->get();

    $sdm = $sdmRaw->map(function($item) use ($totalSdm) {
        return [
            'kategori' => $item->kategori,
            'jumlah' => $item->jumlah,
            'persen' => $totalSdm > 0 ? round(($item->jumlah / $totalSdm) * 100, 2) : 0
        ];
    });

    // Tambahin baris "TOTAL" manual di paling bawah array
    $sdm->push([
        'kategori' => 'TOTAL',
        'jumlah' => $totalSdm,
        'persen' => 100
    ]);

    return Inertia::render('Home', [
        'dataPotensi' => $potensi,
        'dataJenisUsaha' => $jenisUsaha,
        'dataSdm' => $sdm,
    ]);
});

Route::get('/sebaran', function () {
    // Ambil Koperasi yang punya koordinat aja biar map gak error
    $lokasiKoperasi = Koperasi::select('id', 'nama', 'latitude', 'longitude', 'alamat', 'status_operasional')
        ->whereNotNull('latitude')
        ->whereNotNull('longitude')
        ->get();

    return Inertia::render('Sebaran', [
        'locations' => $lokasiKoperasi
    ]);
})->name('sebaran');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
