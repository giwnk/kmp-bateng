<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGaleriRequest extends FormRequest
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
            'foto' => 'required|image|mimes:jpeg,png,jpg|max:5120',
            'keterangan' => 'nullable|string|max:225',
        ];
    }

    public function messages(): array {
        $errorMsgImg = 'Galeri foto wajib diisi dengan format file JPEG, PNG, dan JPG dengan ukuran maksimal 5MB';
        return[
            'required' => $errorMsgImg,
            'image' => $errorMsgImg,
            'mimes' => $errorMsgImg,
            'foto.max' => $errorMsgImg,
        ];
    }
}
