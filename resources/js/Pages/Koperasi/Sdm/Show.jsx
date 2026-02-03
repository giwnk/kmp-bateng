import React from "react";
import UsersLayout from "@/Layouts/UsersLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    User,
    CreditCard,
    Briefcase,
    Calendar,
    MapPin,
    Phone,
    Mail,
    ShieldCheck,
    Activity,
    Layers,
    Edit,
    LucideImageOff,
} from "lucide-react";

export default function Show({ auth, sdmData }) {
    // Helper untuk menampilkan foto dari storage
    const photoUrl = sdmData.foto ? `/storage/${sdmData.foto}` : null;

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

    return (
        <UsersLayout auth={auth}>
            <Head title={`Detail - ${sdmData.nama}`} />

            <div className="p-8 space-y-8 max-w-6xl mx-auto">
                {/* Header & Navigation */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-6">
                        <Link
                            href={route("users.sdm.index")}
                            className="p-4 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm hover:bg-gray-50 transition-all text-gray-400 hover:text-gray-900"
                        >
                            <ArrowLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 tracking-tighter leading-none">
                                Detail Profil
                            </h1>
                        </div>
                    </div>

                    <Link
                        href={route("users.sdm.edit", sdmData.id)}
                        className="flex items-center gap-3 bg-blue-950 text-white px-8 py-4 rounded-2xl font-semibold text-xs uppercase tracking-[0.2em] hover:bg-blue-900 transition-all shadow-xl shadow-gray-100"
                    >
                        <Edit size={16} /> Edit Profil
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sisi Kiri: Ringkasan Profil & Status */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm text-center relative overflow-hidden">
                            {/* Dekorasi Latar Belakang */}
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-gray-50 to-transparent -z-10" />

                            <div className="w-48 h-48 rounded-[3rem] overflow-hidden bg-gray-100 border-8 border-white shadow-2xl mx-auto mb-6">
                                {photoUrl ? (
                                    <img
                                        src={photoUrl}
                                        className="w-full h-full object-cover"
                                        alt={sdmData.nama}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <LucideImageOff size={64} />
                                    </div>
                                )}
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tighter leading-tight mb-1">
                                {sdmData.nama}
                            </h2>
                            <p className="text-blue-900 font-black text-sm mb-6">
                                {sdmData.jabatan}
                            </p>

                            <div
                                className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
                                    sdmData.status === "Aktif"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {sdmData.status}
                            </div>
                        </div>
                    </div>

                    {/* Sisi Kanan: Detail Informasi Lengkap */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Informasi Pekerjaan */}
                        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
                            <h3 className="text-xs font-black text-gray-900 uppercase mb-8 flex items-center gap-3">
                                Jabatan & Keanggotaan
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <InfoItem
                                    label="Kategori"
                                    value={sdmData.kategori}
                                    icon={<Layers />}
                                />
                                <InfoItem
                                    label="NIK"
                                    value={sdmData.nik}
                                    icon={<Layers />}
                                />
                                <InfoItem
                                    label="Mulai Bergabung"
                                    value={formatTanggal(sdmData.tanggal_bergabung)}
                                    icon={<Calendar />}
                                />
                                <InfoItem
                                    label="Jabatan Struktur"
                                    value={sdmData.jabatan}
                                    icon={<Briefcase />}
                                />
                            </div>
                        </div>

                        {/* Kontak & Alamat */}
                        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
                            <h3 className="text-xs font-black text-gray-900 uppercase mb-8 flex items-center gap-3">
                                Kontak
                            </h3>
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <InfoItem
                                        label="Nomor Telepon"
                                        value={sdmData.nomor_telepon}
                                        icon={<Phone />}
                                    />
                                    <InfoItem
                                        label="Alamat Email"
                                        value={sdmData.email || "-"}
                                        icon={<Mail />}
                                    />
                                </div>
                                <div className="pt-6 border-t border-gray-50">
                                    <InfoItem
                                        label="Alamat Lengkap"
                                        value={sdmData.alamat}
                                        icon={<MapPin />}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UsersLayout>
    );
}

// Komponen Kecil untuk Baris Informasi agar rapi
function InfoItem({ label, value, icon }) {
    return (
        <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-50 rounded-2xl text-gray-500">
                {React.cloneElement(icon, { size: 18 })}
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">
                    {label}
                </p>
                <p className="text-sm font-bold text-gray-800">
                    {value || "Tidak Tersedia"}
                </p>
            </div>
        </div>
    );
}
