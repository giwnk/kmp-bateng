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
        // ==========================================
        // 1. DATA WILAYAH (Bangka Tengah) 🗺️
        // ==========================================
        $kecamatans = [
            'KOBA' => ['Guntung', 'Kurau', 'Kurau Barat', 'Nibung', 'Penyak', 'Terentang III', 'Arung Dalam', 'Berok', 'Koba', 'Padang Mulia', 'Simpang Perlang'],
            'LUBUK BESAR' => ['Batu Beriga', 'Belimbing', 'Kulur', 'Kulur Ilir', 'Lubuk Besar', 'Lubuk Lingkuk', 'Lubuk Pabrik', 'Perlang', 'Trubus'],
            'NAMANG' => ['Belilik', 'Bhaskara Bhakti', 'Bukit Kijang', 'Cambai', 'Cambai Selatan', 'Jelutung', 'Kayu Besi', 'Namang'],
            'PANGKALAN BARU' => ['Air Mesu', 'Air Mesu Timur', 'Batu Belubang', 'Beluluk', 'Benteng', 'Jeruk', 'Kebintik', 'Mangkol', 'Padang Baru', 'Pedindang', 'Tanjung Gunung', 'Dul'],
            'SIMPANG KATIS' => ['Beruas', 'Celuak', 'Katis', 'Pasir Garam', 'Pinang Sebatang', 'Puput', 'Simpang Katis', 'Sungkap', 'Terak', 'Teru'],
            'SUNGAI SELAN' => ['Kemingking', 'Kerakas', 'Kerantai', 'Keretak', 'Keretak Atas', 'Lampur', 'Melabun', 'Munggu', 'Romadhon', 'Sarang Mandi', 'Sungai Selan Atas', 'Tanjung Pura', 'Sungai Selan'],
        ];

        $listDesaIds = [];

        foreach ($kecamatans as $namaKec => $desaList) {
            $kec = Kecamatan::create(['nama' => strtoupper($namaKec)]);
            foreach ($desaList as $namaDesa) {
                $desa = Desa::create(['kecamatan_id' => $kec->id, 'nama' => strtoupper($namaDesa)]);
                $listDesaIds[] = $desa;
            }
        }

        // ==========================================
        // 2. AKUN ADMIN DINAS 🤴
        // ==========================================
        User::create([
            'name' => 'Admin Dinas Koperasi',
            'email' => 'admin@bogorkab.go.id',
            'password' => Hash::make('password'),
            'role' => 'admin_dinas',
        ]);

        // ==========================================
        // 3. GENERATE 15 KOPERASI DUMMY 🏢
        // ==========================================

        // List Usaha Master (Nama & Kode)
        $masterUsaha = [
            ['nama' => 'GERAI SEMBAKO', 'kode' => 'SEMBAKO'],
            ['nama' => 'GERAI APOTEK DESA', 'kode' => 'APOTEK'],
            ['nama' => 'GERAI KANTOR KOPERASI', 'kode' => 'KANTOR'],
            ['nama' => 'GERAI UNIT USAHA SIMPAN PINJAM', 'kode' => 'USP'],
            ['nama' => 'GERAI KLINIK DESA', 'kode' => 'KLINIK'],
            ['nama' => 'GERAI COLD STORAGE', 'kode' => 'COLD'],
            ['nama' => 'GERAI LOGISTIK', 'kode' => 'LOGISTIK'],
            ['nama' => 'GERAI KIOS PUPUK', 'kode' => 'PUPUK'],
            ['nama' => 'GERAI PANGKALAN LPG', 'kode' => 'LPG'],
            ['nama' => 'GERAI AGEN POS', 'kode' => 'POS'],
            ['nama' => 'GERAI AGEN LAKU PANDAI', 'kode' => 'LAKU'],
            ['nama' => 'AKUN MICROSITE', 'kode' => 'MICRO'],
        ];

        $kondisiLahanList = ['Sudah Verifikasi', 'Memenuhi Syarat', 'Tahap Pembangunan', 'Belum Verifikasi'];

        for ($i = 1; $i <= 15; $i++) {
            $randomDesa = $listDesaIds[array_rand($listDesaIds)];
            $isOperasional = rand(1, 10) > 3;

            // Generate Nama Pengurus
            $namaKetua = fake()->name('id_ID');
            $namaSekretaris = fake()->name('id_ID');
            $namaBendahara = fake()->name('id_ID');

            // A. Create Koperasi
            $koperasi = Koperasi::create([
                'kecamatan_id' => $randomDesa->kecamatan_id,
                'desa_id' => $randomDesa->id,
                'nama' => 'Koperasi ' . fake()->company() . ' ' . $randomDesa->nama,
                'nomor_badan_hukum' => 'BH-' . rand(1000, 9999) . '/AHU/' . rand(2020, 2025),
                'alamat' => fake()->address(),
                'latitude' => fake()->latitude(-2.6, -2.1),
                'longitude' => fake()->longitude(106.0, 106.7),
                'luas_lahan' => rand(50, 500),
                'jumlah_anggota' => rand(20, 500),
                'total_aset' => rand(50000000, 5000000000),
                'total_modal' => rand(10000000, 1000000000),
                'status_operasional' => $isOperasional,
                'status_sertifikat' => (bool)rand(0, 1),
                'status_pelatihan' => (bool)rand(0, 1),
                'kondisi_lahan' => $kondisiLahanList[array_rand($kondisiLahanList)],
                'sumber' => fake()->randomElement(['BPKAD', 'DPMD', 'TNI']),
                'tahun_pembentukan' => rand(2018, 2025),
                'tanggal_berdiri' => Carbon::now()->subYears(rand(1, 8)),
                'nomor_telepon' => fake()->phoneNumber(),
                'email' => fake()->unique()->companyEmail(),
                'nama_ketua' => $namaKetua,
                'nama_sekretaris' => $namaSekretaris,
                'nama_bendahara' => $namaBendahara,
                'progress_pembangunan' => rand(0, 100),
                'keterangan' => fake()->sentence(),
                'link_instagram' => 'https://instagram.com/koperasi.' . $i,
            ]);

            // B. Create Jenis Usaha (Sesuai Migration Baru)
            // Ambil 1-3 jenis usaha random dari master
            $jumlahUsaha = rand(1, 3);
            $randomKeys = array_rand($masterUsaha, $jumlahUsaha);
            if (!is_array($randomKeys)) $randomKeys = [$randomKeys];

            foreach ($randomKeys as $key) {
                $usaha = $masterUsaha[$key];

                JenisUsaha::create([
                    'koperasi_id' => $koperasi->id, // <--- INI PENTING!
                    'nama' => $usaha['nama'],       // Sesuai migration: 'nama'
                    'kode' => $usaha['kode'],       // Sesuai migration: 'kode'
                    'status_aktif' => rand(0, 1) ? 'Ya' : 'Tidak', // Sesuai migration: enum
                    'keterangan' => 'Unit usaha berjalan lancar',
                ]);
            }

            // C. Create SDM (Sinkron dengan data pengurus)
            $pengurusInti = [
                'Ketua' => $namaKetua,
                'Sekretaris' => $namaSekretaris,
                'Bendahara' => $namaBendahara,
                'Pengawas' => fake()->name('id_ID')
            ];

            foreach ($pengurusInti as $jabatan => $namaOrang) {
                SdmKoperasi::create([
                    'koperasi_id' => $koperasi->id,
                    'nama' => $namaOrang,
                    'nik' => rand(1901000000000000, 1901999999999999),
                    'kategori' => $jabatan == 'Pengawas' ? 'Pengawas Koperasi' : 'Pengurus Koperasi',
                    'jabatan' => $jabatan,
                    'foto' => null,
                    'status' => 'Aktif',
                    'tanggal_bergabung' => Carbon::now()->subMonths(rand(1, 50)),
                ]);
            }

            // D. Galeri
            GaleriKoperasi::create([
                'koperasi_id' => $koperasi->id,
                'foto_path' => 'https://picsum.photos/400/300?random=' . $i,
                'keterangan' => 'Kegiatan Tahunan'
            ]);
        }

        // 4. CHART DATA
        $years = [2022, 2023, 2024, 2025];
        foreach ($years as $year) {
            PembentukanKoperasi::create([
                'tahun' => $year,
                'jumlah_koperasi' => rand(10, 50),
                'keterangan' => 'Data Tahunan'
            ]);
        }
    }
}
