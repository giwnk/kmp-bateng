<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule; // Jangan lupa import ini!

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
{
    $user = $this->user();
    $targetUser = $this->route('user'); // ID user yang diedit

    // 1. Dinas boleh edit siapa aja
    if ($user->isAdminDinas()) return true;

    // 2. User Koperasi cuma boleh edit dirinya sendiri
    // (Biar dia gak bisa edit user koperasi tetangga)
    if ($user->isUserKoperasi()) {
        return $user->id == $targetUser;
    }

    return false;
}

public function rules(): array
{
    $userId = $this->route('user');

    // 1. Rules Dasar (Semua orang kena ini)
    $rules = [
        'name' => 'required|string|max:255',
        'email' => ['required', 'email', \Illuminate\Validation\Rule::unique('users')->ignore($userId)],
        'password' => 'nullable|string|min:8|confirmed',
    ];

    // 2. Rules KHUSUS ADMIN DINAS (The God Mode)
    // Cuma Dinas yang boleh utak-atik Role & Koperasi ID
    if ($this->user()->isAdminDinas()) {
        $rules['role'] = 'required|in:admin_dinas,user_koperasi';
        $rules['koperasi_id'] = 'required_if:role,user_koperasi|nullable|exists:koperasis,id';
    }

    // PENTING:
    // Kalau yang login User Koperasi, kita GAK MASUKIN 'role' & 'koperasi_id' ke rules.
    // Jadi walaupun dia kirim input "role: admin_dinas" lewat inspect element,
    // Laravel bakal CUEK (Ignore) inputan itu karena gak ada di rules.
    // Dan pastikan di Controller kamu pakai $request->validated().

    return $rules;
}

    public function messages(): array
    {
        return [
            'email.unique' => 'Email ini sudah digunakan user lain.',
            'koperasi_id.required_if' => 'User Koperasi wajib terikat dengan salah satu koperasi.',
        ];
    }
}
