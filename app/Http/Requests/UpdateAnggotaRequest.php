<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAnggotaRequest extends FormRequest
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
        $anggotaId = $this->route('anggota_koperasi');
        return [
            'nomor_anggota' => 'required|string|max:225',
            'nama' => 'required|string|max:225',
            'nik' => ['required', 'numeric', 'digits:16', Rule::unique('anggota_koperasis', 'nik')->ignore($anggotaId) ],
            'tanggal_bergabung' => 'required|date',
            'status' => ['required', Rule::in('Aktif', 'Non Aktif')],
            'alamat' => 'required|string',
            'no_telepon' => 'nullable|string',
        ];
    }

    public function messages(): array{
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
