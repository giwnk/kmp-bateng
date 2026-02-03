import React, { useState } from "react";
import UsersLayout from "@/Layouts/UsersLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Save,
    User,
    CreditCard,
    Briefcase,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Image as ImageIcon,
    Layers,
    Activity,
    UploadCloud,
} from "lucide-react";
import InputError from "@/Components/InputError";
import Dropdown from "@/Components/SelfMade/Dropdown";
import TextInput from "@/Components/SelfMade/TextInput";

export default function Edit({ auth, sdmData, jabatanOpt, statusOpt }) {
    // Kategori disesuaikan dengan kebutuhan (biasanya: Pengurus, Pengawas, atau Karyawan)
    const kategoriOpt = ["Pengurus Koperasi", "Pengawas Koperasi"];

    const formatTanggal = (dateString) => {
        if (!dateString) return "Tanggal tidak tersedia";

        const date = new Date(dateString);
        // Kita pakai Intl.DateTimeFormat biar otomatis dapet nama bulan Indo
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date);
    };

    const { data, setData, post, processing, errors, isDirty } = useForm({
        _method: "PUT", // Digunakan agar bisa kirim file (foto) via POST namun dibaca PUT oleh Laravel
        nama: sdmData.nama || "",
        nik: sdmData.nik || "",
        kategori: sdmData.kategori || "",
        tanggal_bergabung: sdmData.tanggal_bergabung
            ? sdmData.tanggal_bergabung.substring(0, 10)
            : "",
        jabatan: sdmData.jabatan || "",
        alamat: sdmData.alamat || "",
        nomor_telepon: sdmData.nomor_telepon || "",
        email: sdmData.email || "",
        status: sdmData.status || "Aktif",
        foto: null,
    });

    const [preview, setPreview] = useState(
        sdmData.foto ? `/storage/${sdmData.foto}` : null,
    );

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Set data form dengan objek File baru
            setData("foto", file);
            // Buat preview lokal dari file yang baru dipilih
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        // Menggunakan post dengan _method PUT karena PHP/Laravel memiliki kendala
        // membaca data 'multipart/form-data' langsung via metode PUT asli.
        post(route("users.sdm.update", sdmData.id));
    };

    return (
        <UsersLayout auth={auth}>
            <Head title="Edit Profil Pengurus" />

            <div className="p-8 space-y-8 max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center gap-6">
                    <Link
                        href={route("users.sdm.index")}
                        className="p-4 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm hover:bg-gray-50 transition-all text-gray-400 hover:text-gray-900"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 tracking-tighter leading-none">
                            Edit SDM Profil
                        </h1>
                    </div>
                </div>

                <form
                    onSubmit={submit}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Sisi Kiri: Foto & Status */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm text-center">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">
                                Foto Profil
                            </label>
                            <div className="relative group mx-auto w-48 h-48 mb-6">
                                <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-gray-50 border-4 border-white shadow-inner flex items-center justify-center">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            className="w-full h-full object-cover"
                                            alt="Preview"
                                        />
                                    ) : (
                                        <ImageIcon
                                            size={48}
                                            className="text-gray-200"
                                        />
                                    )}
                                </div>
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-[2.5rem]">
                                    <UploadCloud
                                        className="text-white"
                                        size={32}
                                    />
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                </label>
                            </div>
                            <InputError message={errors.foto} />

                            <Dropdown
                                options={statusOpt}
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                label={"Pilih Status"}
                                className="font-medium flex items-start"
                            />
                        </div>
                    </div>

                    {/* Sisi Kanan: Detail Data */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                            {/* Baris 1: Nama & NIK */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TextInput
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) =>
                                        setData("nama", e.target.value)
                                    }
                                    label={"Nama Lengkap"}
                                />
                                <TextInput
                                    type="text"
                                    value={data.nik}
                                    onChange={(e) =>
                                        setData("nik", e.target.value)
                                    }
                                    label={"NIK (16 Digit)"}
                                />
                            </div>

                            {/* Baris 2: Kategori & Tanggal Bergabung */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Dropdown
                                    value={data.kategori}
                                    onChange={(e) =>
                                        setData("kategori", e.target.value)
                                    }
                                    label={"Pilih Kategori"}
                                    options={kategoriOpt}
                                />
                                <TextInput
                                    type={"date"}
                                    value={data.tanggal_bergabung}
                                    onChange={(e) =>
                                        setData(
                                            "tanggal_bergabung",
                                            e.target.value,
                                        )
                                    }
                                    label={"Tanggal Bergabung"}
                                ></TextInput>
                            </div>

                            {/* Baris 3: Jabatan & Telepon */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Dropdown
                                    value={data.jabatan}
                                    onChange={(e) =>
                                        setData("jabatan", e.target.value)
                                    }
                                    label={"Pilih Jabatan"}
                                    options={jabatanOpt}
                                />
                                <TextInput
                                    type={"text"}
                                    value={data.nomor_telepon}
                                    onChange={(e) =>
                                        setData("nomor_telepon", e.target.value)
                                    }
                                    label={"Nomor Telepon"}
                                ></TextInput>
                            </div>

                            {/* Baris 4: Email & Alamat */}
                            <div className="space-y-6">
                                <TextInput
                                    type={"email"}
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    label={"Email"}
                                ></TextInput>
                                <TextInput
                                    type={"text"}
                                    value={data.alamat}
                                    onChange={(e) =>
                                        setData("alamat", e.target.value)
                                    }
                                    label={"Alamat"}
                                ></TextInput>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={processing || !isDirty}
                                    className={`w-full py-4 rounded-2xl flex justify-center items-center gap-3 font-semibold text-xs uppercase tracking-[0.2em] transition-all
                                    ${
                                        !isDirty || processing
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-blue-950 text-white hover:bg-blue-900 shadow-xl"
                                    }`}
                                >
                                    <Save size={18} />
                                    {processing
                                        ? "Proses..."
                                        : "Simpan Perubahan"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <style>{`
                .form-input-command {
                    width: 100%;
                    background-color: #f9fafb;
                    border: none;
                    border-radius: 1.25rem;
                    padding: 1rem 1.25rem;
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: #1f2937;
                    transition: all 0.2s;
                }
                .form-input-command:focus {
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                }
            `}</style>
        </UsersLayout>
    );
}
