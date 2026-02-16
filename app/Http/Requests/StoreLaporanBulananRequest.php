<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\LaporanStatus;

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
            'tahun' => 'required|integer|min:2000|max:' . (intval(date('Y')) + 1),

            'total_simpanan_pokok' => 'nullable|numeric|min:0',
            'total_pinjaman_wajib' => 'nullable|numeric|min:0',
            'catatan' => 'nullable|string|max:225',
            'status' => ['nullable', new \Illuminate\Validation\Rules\Enum(LaporanStatus::class)],
            'jumlah_anggota_aktif' => 'nullable|integer|min:0',
        ];
    }

    public function messages(): array{
        return [
            'required' => 'Form wajib diisi dan tidak boleh kosong. coba lagi!',
        ];
    }
}
