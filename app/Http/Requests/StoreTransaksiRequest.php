<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransaksiRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->isUserKoperasi();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // 1. ANGGOTA (Foreign Key)
            // Di tabel namanya 'anggota_koperasi_id'
            // Pastikan nama tabel di database benar 'anggota_koperasis' atau 'anggotas'? Sesuaikan ya!
            'anggota_koperasi_id' => [
                'required',
                'string',
                'exists:anggota_koperasis,id' // Cek ID ini ada di tabel anggota
            ],

            // 2. JENIS TRANSAKSI (Enum)
            // Sesuaikan isi array ini dengan opsi Enum di database kamu
            'jenis_transaksi' => [
                'required',
                'string',
                'in:Simpanan Pokok,Simpanan Wajib,Simpanan Sukarela,Penarikan Tunai'
            ],

            // 3. JUMLAH DUIT (Decimal)
            'jumlah' => [
                'required',
                'numeric',
                'min:1000', // Minimal transaksi Rp 1.000 (Biar gak nyampah data 0 rupiah)
                'max:999999999999', // Maksimal sesuai limit decimal(15,2)
            ],

            // 4. TANGGAL
            'tanggal_transaksi' => 'required|date',

            // 5. KETERANGAN (Nullable Text)
            'keterangan' => 'nullable|string|max:500',
        ];
    }

    /**
     * Custom messages biar user gak bingung.
     */
    public function messages(): array
    {
        return [
            'anggota_koperasi_id.required' => 'Harap pilih nama anggota yang melakukan transaksi.',
            'anggota_koperasi_id.exists'   => 'Data anggota tidak ditemukan di sistem.',
            'jenis_transaksi.in'           => 'Jenis transaksi tidak valid.',
            'jumlah.min'                   => 'Nominal transaksi minimal Rp 1.000.',
            'jumlah.numeric'               => 'Format jumlah harus berupa angka.',
            'tanggal_transaksi.required'   => 'Tanggal transaksi wajib diisi.',
        ];
    }
}
