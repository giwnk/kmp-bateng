<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule; // 👈 Jangan lupa import ini!

class UpdateKoperasiRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

    // 1. Kalau Dinas, loloskan semua (God Mode)
    if ($user->isAdminDinas()) {
        return true;
    }

    // 2. Kalau User Koperasi, CEK KTP DULU!
    if ($user->isUserKoperasi()) {
        // Ambil ID Koperasi yang mau diedit dari URL
        // Contoh URL: /koperasi/5/edit -> $koperasiId = 5
        $koperasiId = $this->route('koperasi');

        // Pastikan ID di URL == ID Koperasi milik user
        // (Biar dia gak iseng ganti ID di URL buat edit koperasi tetangga)
        return $user->koperasi_id == $koperasiId;
    }

    // 3. Selain itu, tolak!
    return false;
    }

    public function rules(): array
    {
        // 1. Ambil ID Koperasi dari URL
        // Cek 'php artisan route:list', pastikan nama parameternya 'koperasi'
        // Contoh URL: /koperasi/{koperasi}/update

        return [
            // --- 1. IDENTITAS UTAMA (Pake Ignore Rule) ---
            'nama' => 'required|string|max:255',

            'nomor_induk' => [
                'required',
                'string',
                'max:255',
                // Cek unik di tabel koperasis, kolom nomor_induk, KECUALI id yang sedang diedit
                Rule::unique('koperasis', 'nomor_induk')->ignore($koperasiId),
            ],

            'nomor_ahu' => [
                'required',
                'string',
                'max:255',
                Rule::unique('koperasis', 'nomor_ahu')->ignore($koperasiId),
            ],

            'tanggal_ahu' => 'required|date',

            // --- 2. KONTAK & LOKASI (Email juga unik) ---
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('koperasis', 'email')->ignore($koperasiId),
            ],

            'alamat' => 'required|string',
            'no_telepon' => 'required|numeric|digits_between:10,15',
            'website' => 'nullable|url|max:255',

            // --- 3. WILAYAH (Foreign Keys Tetap Sama) ---
            // Tetap pakai exists karena user bisa aja ganti lokasi
            'kecamatan_id' => 'required|exists:kecamatans,id',
            'desa_id' => 'required|exists:desas,id',

            // --- 4. DATA PENDUKUNG ---
            'status_operasional' => 'required|boolean',
            'status_sertifikat' => 'required|boolean',
            'status_pelatihan' => 'required|boolean',

            'tahun_pembentukan' => 'nullable|integer|digits:4|max:' . date('Y'),
            'tanggal_berdiri' => 'nullable|date',

            // --- 5. KOORDINAT MAPS ---
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],

            // --- 6. MEDIA SOSIAL ---
            'link_facebook' => 'nullable|url|max:255',
            'link_instagram' => 'nullable|url|max:255',
            'link_youtube' => 'nullable|url|max:255',
            'link_tiktok' => 'nullable|url|max:255',

            // --- 7. PIVOT TABLE: JENIS USAHA ---
            // Tetap required array, karena saat update kita melakukan sync()
            'jenis_usaha_ids' => 'required|array|min:1',
            'jenis_usaha_ids.*' => 'exists:jenis_usahas,id',
        ];
    }

    public function messages(): array
    {
        // Copy-paste aja dari Store, isinya sama persis
        return [
            'kecamatan_id.exists' => 'Kecamatan yang dipilih tidak valid.',
            'desa_id.exists' => 'Desa yang dipilih tidak valid.',
            'jenis_usaha_ids.required' => 'Wajib memilih minimal satu jenis usaha.',
            'jenis_usaha_ids.*.exists' => 'Salah satu jenis usaha yang dipilih tidak valid.',
            'nomor_induk.unique' => 'Nomor Induk Koperasi (NIK) ini sudah terdaftar.',
            'nomor_ahu.unique' => 'Nomor AHU ini sudah terdaftar.',
            'email.unique' => 'Email ini sudah digunakan oleh koperasi lain.',
            'latitude.between' => 'Latitude harus berada di antara -90 dan 90.',
            'longitude.between' => 'Longitude harus berada di antara -180 dan 180.',
        ];
    }
}
