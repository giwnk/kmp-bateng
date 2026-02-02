import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    Plus,
    Pencil,
    Key,
    Building2,
    User,
    Shield,
    Mail,
    X,
} from "lucide-react";
import Swal from "sweetalert2";

// 👇 Import Komponen Universal Kita
import Table from "@/Components/SelfMade/Table";
import ModalDialog from "@/Components/SelfMade/ModalDialog";
import TextInput from "@/Components/SelfMade/TextInput";
import Dropdown from "@/Components/SelfMade/Dropdown";

export default function Index({ auth, users, koperasiList }) {
    // Opsi untuk Role
    const roleOptions = [
        { id: "user_koperasi", nama: "User Koperasi" },
        { id: "admin_dinas", nama: "Admin Dinas" },
    ];

    // --- 1. STATE MANAGEMENT (Single State Object) ---
    const [modalState, setModalState] = useState({
        type: null, // 'create', 'edit', 'reset', atau null
        user: null,
    });

    // --- 2. FORM DATA (Inertia useForm) ---
    // Form untuk Create & Edit User
    const userForm = useForm({
        name: "",
        email: "",
        koperasi_id: "",
        role: "user_koperasi", // Default role sesuai DB
    });

    // Form khusus Reset Password
    const passForm = useForm({
        password: "",
        password_confirmation: "",
    });

    // --- 3. DEFINISI KOLOM TABEL (Sesuai DB Kamu) ---
    const columns = [
        {
            header: "Nama & Role",
            render: (user) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-bold text-gray-900">
                            {user.name}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <Shield size={10} />
                            {/* Format Role: user_koperasi -> User Koperasi */}
                            <span className="capitalize">
                                {user.role?.replace("_", " ")}
                            </span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: "Email",
            render: (user) => (
                <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={14} className="text-gray-400" />
                    {user.email}
                </div>
            ),
        },
        {
            header: "Unit Koperasi",
            render: (user) =>
                user.koperasi ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <Building2 size={12} /> {user.koperasi.nama}
                    </span>
                ) : (
                    <span className="text-gray-400 italic text-xs">
                        - Tidak ada unit -
                    </span>
                ),
        },
        {
            header: "Aksi",
            className: "text-center",
            render: (user) => (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => openModal("edit", user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg transition"
                        title="Edit Data"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => openModal("reset", user)}
                        className="p-2 text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-100 rounded-lg transition"
                        title="Reset Password"
                    >
                        <Key size={16} />
                    </button>
                </div>
            ),
        },
    ];

    // --- 4. HANDLERS (LOGIC) ---
    const openModal = (type, user = null) => {
        setModalState({ type, user });

        if (type === "create") {
            userForm.reset();
            userForm.setData("role", "user_koperasi"); // Reset default role
        } else if (type === "edit" && user) {
            userForm.setData({
                name: user.name,
                email: user.email,
                role: user.role,
                koperasi_id: user.koperasi_id || "",
            });
        } else if (type === "reset") {
            passForm.reset();
        }
    };

    const closeModal = () => {
        setModalState({ type: null, user: null });
        userForm.clearErrors();
        passForm.clearErrors();
    };

    const submitUser = (e) => {
        e.preventDefault();
        const isCreate = modalState.type === "create";
        const routeName = isCreate ? "admin.users.store" : "admin.users.update";
        const routeParam = isCreate ? {} : modalState.user.id;
        const method = isCreate ? userForm.post : userForm.put;

        method(route(routeName, routeParam), {
            onSuccess: () => {
                closeModal();
                Swal.fire(
                    "Berhasil!",
                    `Data user berhasil ${isCreate ? "dibuat" : "diupdate"}`,
                    "success",
                );
            },
        });
    };

    const submitReset = (e) => {
        e.preventDefault();
        passForm.put(route("admin.users.reset-password", modalState.user.id), {
            onSuccess: () => {
                closeModal();
                Swal.fire("Aman!", "Password berhasil direset.", "success");
            },
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Manajemen User" />

            {/* --- HEADER PAGE --- */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Manajemen User
                    </h1>
                    <p className="text-sm text-gray-500">
                        Kelola akun akses untuk admin dinas & user koperasi
                    </p>
                </div>

                <button
                    onClick={() => openModal("create")}
                    className="bg-blue-950 font-semibold text-white px-4 py-2 h-[45px] flex justify-center items-center rounded-xl hover:bg-blue-900 transition"
                >
                    + Tambah User
                </button>
            </div>

            {/* --- TABEL UNIVERSAL (Data User) --- */}
            {/* Cukup panggil ini, Pagination sudah otomatis muncul di bawahnya! */}
            <Table columns={columns} items={users} />

            {/* ============================================================
                MODAL 1: USER FORM (CREATE & EDIT)
            ============================================================ */}
            <ModalDialog
                show={
                    modalState.type === "create" || modalState.type === "edit"
                }
                onClose={closeModal}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            {modalState.type === "create" ? (
                                <Plus size={20} />
                            ) : (
                                <Pencil size={20} />
                            )}
                            {modalState.type === "create"
                                ? "Tambah User Baru"
                                : "Edit Data User"}
                        </h2>
                        <button onClick={closeModal}>
                            <X
                                className="text-gray-400 hover:text-red-500 transition"
                                size={20}
                            />
                        </button>
                    </div>

                    <form onSubmit={submitUser} className="space-y-5">
                        {/* Nama */}
                        <TextInput
                            label={"Nama Lengkap"}
                            name={"name"}
                            type={"text"}
                            value={userForm.data.name}
                            onChange={(e) =>
                                userForm.setData("name", e.target.value)
                            }
                            error={userForm.errors.name}
                            placeholder="Contoh: Admin Koperasi Maju"
                        />

                        {/* Email */}
                        <TextInput
                            label={"Email"}
                            name={"email"}
                            type={"email"}
                            value={userForm.data.email}
                            onChange={(e) =>
                                userForm.setData("email", e.target.value)
                            }
                            error={userForm.errors.email}
                            placeholder="Contoh: mail@koperasi.com"
                        />

                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            <Dropdown
                                label={"Role Akun"}
                                name={"role"}
                                value={userForm.data.role}
                                error={userForm.errors.role}
                                onChange={(e) =>
                                    userForm.setData("role", e.target.value)
                                }
                                options={roleOptions}
                            ></Dropdown>

                            {/* Koperasi Selection (Hanya aktif jika role = user_koperasi) */}
                            <Dropdown
                                label={"Asal Koperasi"}
                                name={"koperasi_id"}
                                value={userForm.data.koperasi_id}
                                error={userForm.errors.koperasi_id}
                                onChange={(e) =>
                                    userForm.setData(
                                        "koperasi_id",
                                        e.target.value,
                                    )
                                }
                                options={koperasiList}
                                disabled={
                                    userForm.data.role !== "user_koperasi"
                                }
                            ></Dropdown>
                        </div>

                        {/* Info Password Default (Hanya saat Create) */}
                        {modalState.type === "create" && (
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3 items-start text-sm text-blue-800">
                                <Key className="shrink-0 mt-0.5" size={18} />
                                <div>
                                    <span className="font-bold">
                                        Password Default:
                                    </span>
                                    <p className="text-blue-600 mt-0.5">
                                        User baru akan otomatis menggunakan
                                        password <b>password123</b>.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-4 border-t border-gray-50 mt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={userForm.processing}
                                className="px-6 py-2 bg-blue-900 text-white rounded-lg text-sm font-bold shadow hover:bg-blue-950 transition flex items-center gap-2"
                            >
                                {userForm.processing
                                    ? "Menyimpan..."
                                    : "Simpan Data"}
                            </button>
                        </div>
                    </form>
                </div>
            </ModalDialog>

            {/* ============================================================
                MODAL 2: RESET PASSWORD FORM
            ============================================================ */}
            <ModalDialog
                show={modalState.type === "reset"}
                onClose={closeModal}
                maxWidth="md"
            >
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Key size={24} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">
                            Reset Password
                        </h2>
                        <p className="text-sm text-gray-500">
                            Masukkan password baru untuk user <br />
                            <span className="font-bold text-gray-800">
                                {modalState.user?.name}
                            </span>
                        </p>
                    </div>

                    <form onSubmit={submitReset} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password Baru
                            </label>
                            <input
                                type="password"
                                className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500 transition"
                                placeholder="Minimal 8 karakter"
                                value={passForm.data.password}
                                onChange={(e) =>
                                    passForm.setData("password", e.target.value)
                                }
                            />
                            {passForm.errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {passForm.errors.password}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Konfirmasi Password
                            </label>
                            <input
                                type="password"
                                className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500 transition"
                                placeholder="Ulangi password baru"
                                value={passForm.data.password_confirmation}
                                onChange={(e) =>
                                    passForm.setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={passForm.processing}
                                className="px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold shadow hover:bg-amber-700 transition"
                            >
                                {passForm.processing
                                    ? "Menyimpan..."
                                    : "Reset Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </ModalDialog>
        </AdminLayout>
    );
}
