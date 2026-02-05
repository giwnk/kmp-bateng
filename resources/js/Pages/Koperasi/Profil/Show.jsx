import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Building2,
    Users,
    FileText,
    MapPin,
    BadgeCheck,
    Phone,
    Globe,
    Wallet,
    Banknote,
    ShieldCheck,
    Briefcase,
    CheckCircleIcon,
    ArrowLeft,
    EditIcon,
} from "lucide-react";
import JenisUsahaSection from "@/Components/SelfMade/Section/JenisUsahaSection";
import KoperasiCard from "@/Components/SelfMade/Cards/KoperasiCard";
import KetuaCard from "@/Components/SelfMade/Cards/KetuaCard";
import SekretarisCard from "@/Components/SelfMade/Cards/Sekretaris";
import BendaharaCard from "@/Components/SelfMade/Cards/BendaharaCard";
import StatusKepatuhanSection from "@/Components/SelfMade/Section/StatusKepatuhanSection";
import UsersLayout from "@/Layouts/UsersLayout";

export default function Show({ auth, koperasi }) {
    // Helper komponen kecil untuk baris data biar kodingan gak berantakan
    const InfoRow = ({ label, value }) => (
        <div className="flex border-b border-gray-100 py-3 last:border-0">
            <span className="w-1/3 text-gray-500 text-sm font-medium">
                {label}
            </span>
            <span className="w-2/3 text-gray-800 text-sm font-semibold text-right md:text-left">
                {value || "-"}
            </span>
        </div>
    );

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number || 0);
    };

    return (
        <UsersLayout auth={auth}>
            <Head title={`Detail ${koperasi.nama}`} />

            {/* --- SECTION 1: HEADER & STATS --- */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {koperasi.nama}
                            </h1>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${koperasi.status_operasional ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                            >
                                {koperasi.status_operasional
                                    ? "AKTIF"
                                    : "NON-AKTIF"}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                            NIK: {koperasi.nomor_induk} • Badan Hukum:{" "}
                            {koperasi.nomor_ahu}
                        </p>
                    </div>

                    <Link
                        href={route("users.koperasi.edit", koperasi.id)}
                        className="flex items-center gap-2 bg-blue-950 text-white px-5 py-3 rounded-2xl font-medium text-sm tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-gray-200"
                    >
                        <EditIcon size={16} /> Edit Koperasi
                    </Link>
                </div>

                {/* Kartu Statistik Cepat */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* 1. TOTAL PENGURUS */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Briefcase size={20} />
                            </div>
                            <span className="text-xs text-gray-500 uppercase font-bold">
                                Pengurus
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">
                            {koperasi.jumlah_pengurus || 0}{" "}
                            <span className="text-sm font-medium text-gray-400">
                                Org
                            </span>
                        </p>
                    </div>

                    {/* 2. TOTAL PENGAWAS */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <ShieldCheck size={20} />
                            </div>
                            <span className="text-xs text-gray-500 uppercase font-bold">
                                Pengawas
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">
                            {koperasi.jumlah_pengawas || 0}{" "}
                            <span className="text-sm font-medium text-gray-400">
                                Org
                            </span>
                        </p>
                    </div>

                    {/* 3. TOTAL ANGGOTA */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <Users size={20} />
                            </div>
                            <span className="text-xs text-gray-500 uppercase font-bold">
                                Anggota
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">
                            {koperasi.jumlah_anggota || 0}{" "}
                            <span className="text-sm font-medium text-gray-400">
                                Org
                            </span>
                        </p>
                    </div>

                    {/* 4. TOTAL SIMPANAN POKOK */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                <Wallet size={20} />
                            </div>
                            <span className="text-xs text-gray-500 uppercase font-bold">
                                Simpanan Pokok
                            </span>
                        </div>
                        <p className="text-lg font-bold text-gray-800 truncate">
                            {formatRupiah(koperasi.total_simpanan_pokok)}
                        </p>
                    </div>

                    {/* 5. TOTAL SIMPANAN WAJIB */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                                <Banknote size={20} />
                            </div>
                            <span className="text-xs text-gray-500 uppercase font-bold">
                                Simpanan Wajib
                            </span>
                        </div>
                        <p className="text-lg font-bold text-gray-800 truncate">
                            {formatRupiah(koperasi.total_simpanan_wajib)}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- SECTION 2: UTAMA (Split Layout) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* KOLOM KIRI (2/3): Tabel Data Lengkap */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2">
                            <FileText size={18} className="text-gray-500" />
                            <h3 className="font-bold text-gray-700">
                                Identitas & Legalitas
                            </h3>
                        </div>
                        <div className="p-6">
                            <InfoRow
                                label="Nama Lengkap"
                                value={koperasi.nama}
                            />
                            <InfoRow
                                label="Nomor Induk (NIK)"
                                value={koperasi.nomor_induk}
                            />
                            <InfoRow
                                label="Nomor AHU"
                                value={koperasi.nomor_ahu}
                            />
                            <InfoRow
                                label="Tanggal AHU"
                                value={koperasi.tanggal_ahu}
                            />
                            <InfoRow
                                label="Tanggal Berdiri"
                                value={koperasi.tanggal_berdiri}
                            />
                            <InfoRow
                                label="Alamat Kantor"
                                value={koperasi.alamat}
                            />
                            <InfoRow
                                label="Kecamatan / Desa"
                                value={`${koperasi.kecamatan?.nama} / ${koperasi.desa?.nama}`}
                            />
                        </div>
                    </div>

                    {/* Kontak Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2">
                            <Phone size={18} className="text-gray-500" />
                            <h3 className="font-bold text-gray-700">
                                Kontak & Digital
                            </h3>
                        </div>
                        <div className="p-6">
                            <InfoRow label="Email" value={koperasi.email} />
                            <InfoRow
                                label="Telepon / WA"
                                value={koperasi.no_telepon}
                            />
                            <InfoRow label="Website" value={koperasi.website} />
                            <InfoRow
                                label="Facebook"
                                value={koperasi.link_facebook}
                            />
                            {/* Dst... */}
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN (1/3): Sidebar Info */}
                <div className="space-y-6">
                    {/* PIVOT JENIS USAHA */}
                    <JenisUsahaSection koperasi={koperasi}></JenisUsahaSection>

                    {/* STATUS KEPATUHAN (Badge Besar) */}
                    <StatusKepatuhanSection
                        koperasi={koperasi}
                    ></StatusKepatuhanSection>
                </div>
            </div>

            {/* --- SECTION 3: SDM / PENGURUS --- */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex gap-3">
                    <Users></Users> Pengurus Koperasi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card Ketua */}
                    <KetuaCard koperasi={koperasi}></KetuaCard>

                    {/* Card Sekretaris */}
                    <SekretarisCard koperasi={koperasi}></SekretarisCard>

                    {/* Card Bendahara */}
                    <BendaharaCard koperasi={koperasi}></BendaharaCard>
                </div>
            </div>

            {/* --- SECTION 4: GALERI (Placeholder) --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                    📷 Galeri Kegiatan
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Placeholder Kotak Abu-abu kalau belum ada foto */}
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs"
                        >
                            Foto {i}
                        </div>
                    ))}
                </div>
            </div>
        </UsersLayout>
    );
}
