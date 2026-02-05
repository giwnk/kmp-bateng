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
use App\Http\Controllers\Users\LaporanBulananController as LaporanUsers;
use App\Http\Controllers\Users\ProfilKoperasiController;
use App\Http\Controllers\Users\KelolaAnggotaController;
use App\Http\Controllers\Users\KelolaSdmController;
use App\Http\Controllers\Users\TransaksiController;
use App\Http\Controllers\Users\KelolaGaleriController;
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
    if ($user->role === 'user_koperasi') return redirect()->route('users.dashboard');
    return redirect('/');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'role:admin_dinas'])
    ->prefix('admin')       // URL tetap /admin/...
    ->name('admin.')        // Nama tetap admin....
    ->group(function () {

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

Route::middleware(['auth', 'role:user_koperasi'])->prefix('users')->name('users.')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard'); // Hasilnya jadi 'koperasi.dashboard'
    Route::resource('koperasi', ProfilKoperasiController::class)->only(['show', 'update', 'edit']);
    Route::resource('anggota', KelolaAnggotaController::class)->only(['index', 'show', 'update', 'store', 'destroy'])->parameters(['anggota' => 'anggota']);
    Route::resource('galeri', KelolaGaleriController::class)->only(['index', 'show', 'store', 'destroy']);
    Route::resource('sdm', KelolaSdmController::class)->only(['index', 'show', 'edit', 'create', 'update', 'store', 'destroy']);
    Route::resource('laporan', LaporanUsers::class)->only(['index', 'update', 'store', 'destroy']);
    Route::resource('transaksi', TransaksiController::class)->only(['index', 'store', 'destroy']);
    Route::get('/get-desa/{kecamatan_id}', [WilayahController::class, 'getDesaByKecamatan'])
        ->name('api.getDesa');

});



Route::get('/playground', function () {
    return Inertia::render('Playground');
});

Route::get('/home', [HomeController::class, 'index'])->name('home');
Route::get('home/kecamatan/{kecamatan}', [HomeController::class, 'showKecamatan'])->name('kecamatan.show');
Route::get('home/koperasi/{koperasi}', [HomeController::class, 'showKoperasi'])->name('koperasi.show');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
