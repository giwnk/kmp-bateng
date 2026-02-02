import React from "react";
import { Head, Link } from "@inertiajs/react";
import Table from "@/Components/SelfMade/Table";
import { Building2, Users, CheckCircle, ArrowLeft } from "lucide-react";

// Pakai Layout Publik (Guest) atau buat komponen tanpa pembungkus auth
export default function Show({ kecamatan, koperasis, stats }) {
    const columns = [
        {
            header: "Nama Koperasi",
            render: (item) => (
                <div className="flex flex-col">
                    <Link href={route('koperasi.show', item.id)} className="font-bold text-gray-800">{item.nama}</Link>
                    <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
                        {item.nomor_induk || "Tanpa NIK"}
                    </span>
                </div>
            ),
        },
        {
            header: "Wilayah",
            render: (item) => (
                <span className="text-xs text-gray-600 font-medium">
                    {item.desa?.nama || "-"}
                </span>
            ),
        },
        {
            header: "Anggota",
            className: "text-center",
            render: (item) => (
                <span className="font-bold text-gray-700">
                    {/* Mengambil data dari relasi anggotaKoperasi */}
                    {item.anggota_koperasi?.total_anggota?.toLocaleString() ||
                        0}
                </span>
            ),
        },
        {
            header: "Status",
            render: (item) => (
                <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.status_operasional === true
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                    }`}
                >
                    {item.status_operasional === true ? "Aktif" : "Non-Aktif"}
                </span>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <Head title={`Data Koperasi - ${kecamatan.nama}`} />

            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Link
                            href={route('home')}
                            className="flex items-center gap-2 text-gray-400 hover:text-red-600 mb-2 transition-all"
                        >
                            <ArrowLeft size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">
                                Beranda Utama
                            </span>
                        </Link>
                        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
                            Kecamatan {kecamatan.nama}
                        </h1>
                    </div>
                </div>

                {/* Grid Statistik Publik */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl w-fit mb-4">
                            <Building2 size={20} />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                            Total Unit Koperasi
                        </p>
                        <p className="text-3xl font-black text-gray-900">
                            {stats.total_unit}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4">
                            <CheckCircle size={20} />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                            Unit Berstatus Aktif
                        </p>
                        <p className="text-3xl font-black text-gray-900">
                            {stats.aktif}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4">
                            <Users size={20} />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                            Total Anggota Terdaftar
                        </p>
                        <p className="text-3xl font-black text-gray-900">
                            {stats.total_anggota.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Tabel Publik */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                    <Table columns={columns} items={koperasis} />
                </div>
            </div>
        </div>
    );
}
