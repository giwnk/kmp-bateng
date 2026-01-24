<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Models\Koperasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    // 1. Tampilkan List User Koperasi
    public function index()
    {
        $users = User::with('koperasi') // Biar tau ini user punya siapa
            ->where('role', 'user_koperasi') // Filter cuma user koperasi
            ->latest()
            ->paginate(10);

        $listKoperasi = Koperasi::select('id', 'nama')->orderBy('nama')->get();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'koperasiList' => $listKoperasi,
        ]);
    }

    // 2. Simpan User Baru (Create User Koperasi)
    public function store(StoreUserRequest $request)
    {
        // Otomatis validasi. Kalau gagal, dia stop di sini & balik ke error.
        // Ambil data yang sudah lolos validasi
        $validatedData = $request->validated();

        // Tambah logic password default & role otomatis
        $validatedData['password'] = Hash::make('password123'); // Default password
        $validatedData['role'] = 'user_koperasi';

        User::create($validatedData);

        return back()->with('success', 'User Koperasi berhasil dibuat! Password default: password123');
    }

    // 👇 Ganti 'Request' jadi 'UpdateUserRequest'
    public function update(UpdateUserRequest $request, User $user)
    {
        // Ambil data valid (biasanya nama, email, koperasi_id)
        $validatedData = $request->validated();

        // Update data user
        $user->update($validatedData);

        return back()->with('success', 'Data user berhasil diperbarui! ✨');
    }

    public function resetPassword(Request $request, User $user)
    {
        $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Langsung timpa passwordnya
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Password user berhasil di-reset!');
    }

    // 4. Blokir User Nakal (Manage Role/Status)
    public function toggleStatus(User $user)
    {
        // Misal kamu punya kolom is_active di tabel users
        $user->update([
            'is_active' => !$user->is_active
        ]);

        $status = $user->is_active ? 'diaktifkan' : 'diblokir';
        return back()->with('success', "User berhasil $status!");
    }
}
