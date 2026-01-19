<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreKoperasiRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->isAdminDinas(); // Pastikan logic otorisasi user ada di sini atau middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            // --- 1. IDENTITAS UTAMA (Wajib & Unik) ---
            'nama' => 'required|string|max:255',
            'nomor_induk' => 'required|string|max:255|unique:koperasis,nomor_induk',
            'nomor_ahu' => 'required|string|max:255|unique:koperasis,nomor_ahu',
            'tanggal_ahu' => 'required|date',

            // --- 2. KONTAK & LOKASI ---
            'email' => 'required|email|max:255|unique:koperasis,email',
            'alamat' => 'required|string',

            // Catatan: Di DB tipe kamu 'int', tapi sebaiknya validasi string angka biar aman
            'no_telepon' => 'required|numeric|digits_between:10,15',

            'website' => 'nullable|url|max:255',

            // --- 3. WILAYAH (Foreign Keys) ---
            'kecamatan_id' => 'required|exists:kecamatans,id',
            'desa_id' => 'required|exists:desas,id',

            // --- 4. DATA PENDUKUNG (Status & Tanggal) ---
            'status_operasional' => 'required|boolean', // 0 atau 1
            'status_sertifikat' => 'required|boolean',
            'status_pelatihan' => 'required|boolean',

            'tahun_pembentukan' => 'nullable|integer|digits:4|max:' . date('Y'),
            'tanggal_berdiri' => 'nullable|date',

            // --- 5. KOORDINAT MAPS ---
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],

            // --- 6. MEDIA SOSIAL (Nullable) ---
            'link_facebook' => 'nullable|url|max:255',
            'link_instagram' => 'nullable|url|max:255',
            'link_youtube' => 'nullable|url|max:255',
            'link_tiktok' => 'nullable|url|max:255',

            // --- 7. PIVOT TABLE: JENIS USAHA (Wajib Pilih Minimal 1) ---
            'jenis_usaha_ids' => 'required|array|min:1',
            'jenis_usaha_ids.*' => 'exists:jenis_usahas,id',
        ];
    }

    /**
     * Custom pesan error biar lebih manusiawi.
     */
    public function messages(): array
    {
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
