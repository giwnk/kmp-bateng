<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSdmRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:225',
            'nik' => 'required|string|digits:16|unique:sdm_koperasis,nik',
            'kategori' => ['required', Rule::in(['Pengurus Koperasi', 'Pengawas Koperasi'])],
            'tanggal_bergabung' => 'required|date',
            'jabatan' => ['required', Rule::in(['Ketua', 'Sekretaris', 'Bendahara', 'Pengawas Utama', 'Pengawas', 'Anggota', 'Manajer', 'Staff'])],
            'alamat' => 'nullable|string',
            'nomor_telepon' => 'nullable|string',
            'email' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => ['required', Rule::in(['Aktif', 'Non Aktif'])],
        ];
    }

    public function messages(): array {
        $errorMsgNik = 'Format NIK harus 16 digit angka, coba lagi!';
        $errorMsgImg = 'Foto harus menggunakan format PNG, JPEG, dan JPG dengan maksimal ukuran 2MB.';
        return [
            'required' => 'Form harus diisi dan tidak boleh kosong, coba lagi!',
            'nik.digit' => $errorMsgNik,
            'nik.unique' => $errorMsgNik,
            'mimes' => $errorMsgImg,
            'max' => $errorMsgImg,
        ];
    }
}
