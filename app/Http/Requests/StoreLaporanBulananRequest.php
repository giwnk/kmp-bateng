<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLaporanBulananRequest extends FormRequest
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
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer|min:2000|max:'.(date('Y'+1)),

            'total_simpanan_pokok' => 'required|numeric|min:0',
            'total_pinjaman_wajib' => 'required|numeric|min:0',
            'total_shu' => 'required|numeric',
            'catatan' => 'nullable|string|max:225',
            'status' => ['required', Rule::in(['Draft', 'Submitted', 'Approved'])],
            'jumlah_anggota_aktif' => 'nullable|integer|min:0',
        ];
    }

    public function messages(): array{
        return [
            'required' => 'Form wajib diisi dan tidak boleh kosong. coba lagi!',
        ];
    }
}
