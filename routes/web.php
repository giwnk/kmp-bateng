<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\WilayahController;
use App\Http\Controllers\Admin\ManajemenKoperasiController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\LaporanBulananController;
use App\Http\Controllers\HomeController;
use App\Models\Koperasi;
use App\Models\JenisUsaha;
use App\Models\SdmKoperasi;
use App\Models\PembentukanKoperasi;
use App\Models\Desa;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = Auth::user();
    if ($user->role === 'admin_dinas') return redirect()->route('admin.dashboard');
    if ($user->role === 'user_koperasi') return redirect()->route('koperasi.dashboard');
    return redirect('/');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'role:admin_dinas'])
    ->prefix('admin')       // URL tetap /admin/...
    ->name('admin.')        // Nama tetap admin....
    ->group(function () {

        // Panggil Controller yang ada di folder utama tadi
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('/wilayah', [WilayahController::class, 'index'])->name('wilayah.index');
        Route::get('/get-desa/{kecamatan_id}', [WilayahController::class, 'getDesaByKecamatan'])
        ->name('api.getDesa');

    // Route Khusus Kecamatan
        Route::post('/kecamatan', [WilayahController::class, 'storeKecamatan'])->name('kecamatan.store');
        Route::put('/kecamatan/{id}', [WilayahController::class, 'updateKecamatan'])->name('kecamatan.update');
        Route::delete('/kecamatan/{id}', [WilayahController::class, 'destroyKecamatan'])->name('kecamatan.destroy');

    // Route Khusus Desa
        Route::post('/desa', [WilayahController::class, 'storeDesa'])->name('desa.store');
        Route::put('/desa/{id}', [WilayahController::class, 'updateDesa'])->name('desa.update');
        Route::delete('/desa/{id}', [WilayahController::class, 'destroyDesa'])->name('desa.destroy');

        Route::resource('koperasi', ManajemenKoperasiController::class);

        // 1. Route Standard (Index, Store, Update)
        // Kita pakai 'resource' tapi kita batasi cuma ambil method yang ada di controller aja
        // (index, store, update).
        Route::resource('users', UserController::class)
            ->only(['index', 'store', 'update']);

        // 2. Route Custom: Reset Password
        // Karena ini aksi spesifik, kita buat route manual dengan method PUT
        Route::put('/users/{user}/reset-password', [UserController::class, 'resetPassword'])
            ->name('users.reset-password');

        Route::get('/laporan', [LaporanBulananController::class, 'index'])->name('laporan.index');


});

Route::middleware(['auth', 'verified'])->prefix('koperasi')->name('koperasi.')->group(function () {

    // 👇 INI DIA ROUTE YANG DICARI-CARI LARAVEL
    Route::get('/dashboard', function () {
        return Inertia::render('Koperasi/Dashboard/Index'); // Pastikan file Page-nya ada
    })->name('dashboard'); // Hasilnya jadi 'koperasi.dashboard'

});



Route::get('/playground', function () {
    return Inertia::render('Playground');
});

Route::get('/home', [HomeController::class, 'index'])->name('home');
Route::get('home/kecamatan/{kecamatan}', [HomeController::class, 'showKecamatan'])->name('kecamatan.show');
Route::get('home/koperasi/{koperasi}', [HomeController::class, 'showKoperasi'])->name('koperasi.show');

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
