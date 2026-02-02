<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JenisUsahaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Data diambil dari Screenshot User
        $data = [
            [
                'nama' => 'Gerai Sembako',
                'kode' => 'SEMBAKO',
                'keterangan' => 'Menyediakan kebutuhan pokok sehari-hari.'
            ],
            [
                'nama' => 'Gerai Apotek Desa',
                'kode' => 'APOTEK_DESA',
                'keterangan' => 'Obat-obatan dan alat kesehatan dasar.'
            ],
            [
                'nama' => 'Gerai Kantor Koperasi',
                'kode' => 'KANTOR_KOP',
                'keterangan' => 'Operasional administratif koperasi.'
            ],
            [
                'nama' => 'Gerai Unit Usaha Simpan Pinjam',
                'kode' => 'USP',
                'keterangan' => 'Layanan simpanan dan pinjaman anggota.'
            ],
            [
                'nama' => 'Gerai Klinik Desa',
                'kode' => 'KLINIK_DESA',
                'keterangan' => 'Layanan kesehatan tingkat pertama.'
            ],
            [
                'nama' => 'Gerai Cold Storage/Cold Chain',
                'kode' => 'COLD_STORAGE',
                'keterangan' => 'Penyimpanan beku untuk produk segar.'
            ],
            [
                'nama' => 'Gerai Logistik (Distribusi)',
                'kode' => 'LOGISTIK',
                'keterangan' => 'Jasa pengiriman dan distribusi barang.'
            ],
            [
                'nama' => 'Gerai Usaha Lainnya (KBLI 2020)',
                'kode' => 'LAINNYA',
                'keterangan' => 'Jenis usaha sesuai standar KBLI 2020.'
            ],
            [
                'nama' => 'Gerai Kios Pupuk',
                'kode' => 'KIOS_PUPUK',
                'keterangan' => 'Penyediaan pupuk dan sarana pertanian.'
            ],
            [
                'nama' => 'Gerai Pangkalan LPG',
                'kode' => 'LPG',
                'keterangan' => 'Distribusi gas LPG untuk masyarakat.'
            ],
            [
                'nama' => 'Gerai Agen Pos Indonesia',
                'kode' => 'AGEN_POS',
                'keterangan' => 'Layanan pos dan logistik surat menyurat.'
            ],
            [
                'nama' => 'Gerai Agen Laku Pandai',
                'kode' => 'LAKU_PANDAI',
                'keterangan' => 'Layanan keuangan tanpa kantor (banking).'
            ],
            [
                'nama' => 'Akun Microsite',
                'kode' => 'MICROSITE',
                'keterangan' => 'Website profil digital koperasi.'
            ],
        ];

        foreach ($data as $item) {
            // Pake updateOrInsert biar gak duplikat kalau di-seed ulang
            DB::table('jenis_usahas')->updateOrInsert(
                ['kode' => $item['kode']], // Cek berdasarkan Kode
                [
                    'nama' => $item['nama'],
                    'status_aktif' => 'Ya',
                    'keterangan' => $item['keterangan'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
