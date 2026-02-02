<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

// Panggil semua model
use App\Models\User;
use App\Models\Koperasi;
use App\Models\JenisUsaha;
use App\Models\SdmKoperasi;
use App\Models\Kecamatan;
use App\Models\Desa;
use App\Models\PembentukanKoperasi;
use App\Models\GaleriKoperasi;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 2. AKUN ADMIN DINAS 🤴
        User::create([
            'name' => 'Admin Dinas Koperasi',
            'email' => 'admin@batengkab.go.id',
            'password' => Hash::make('password'),
            'role' => 'admin_dinas',
        ]);

        $this->call([
        JenisUsahaSeeder::class, // 👈 Tambahkan ini
        ]);
    }


}
