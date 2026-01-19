<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdminDinas();
    }

    public function rules(): array
    {
        return [
            // 1. Identitas User
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',

            // 2. Password (Wajib Konfirmasi)
            // Pastikan di form ada input name="password_confirmation"
            'password' => 'required|string|min:8|confirmed',

            // 3. Role (Sesuai Enum di Database)
            'role' => 'required|in:admin_dinas,user_koperasi',

            // 4. Koperasi ID (Kondisional)
            // WAJIB diisi JIKA role-nya adalah 'user_koperasi'
            // BOLEH kosong JIKA role-nya 'admin_dinas'
            'koperasi_id' => [
                'required_if:role,user_koperasi',
                'nullable',
                'exists:koperasis,id'
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Email ini sudah terdaftar, gunakan email lain.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'koperasi_id.required_if' => 'Jika role adalah User Koperasi, maka wajib memilih koperasi.',
            'koperasi_id.exists' => 'Koperasi yang dipilih tidak valid.',
        ];
    }
}
