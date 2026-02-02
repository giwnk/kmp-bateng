import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout"; // Sesuaikan dengan nama layout admin kamu
import { Head, router, usePage } from "@inertiajs/react";
import Table from "@/Components/SelfMade/Table";
import {
    CheckCircle,
    XCircle,
    Search,
    Filter,
    Calendar,
    MapPin,
    FileText,
    AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2"; // Opsional: Untuk alert yang lebih cantik

export default function Index({
    auth,
    laporanBulanan,
    filters,
    listKecamatan,
}) {
    // State untuk filter
    const [filterData, setFilterData] = useState({
        bulan: filters.bulan || "",
        tahun: filters.tahun || "",
        kecamatan: filters.kecamatan || "",
        status: filters.status || "",
    });

    // Fungsi untuk menjalankan filter
    const handleFilter = () => {
        router.get(route("admin.laporan.index"), filterData, {
            preserveState: true,
            replace: true,
        });
    };

    // Fungsi untuk update status (Validasi)
    const handleUpdateStatus = (id, newStatus) => {
        Swal.fire({
            title: `Konfirmasi ${newStatus}?`,
            text: `Apakah Anda yakin ingin mengubah status laporan ini menjadi ${newStatus}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor:
                newStatus === "Approved" ? "#10b981" : "#ef4444",
            confirmButtonText: "Ya, Proses!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.patch(
                    route("admin.laporan-bulanan.updateStatus", id),
                    {
                        status: newStatus,
                    },
                    {
                        onSuccess: () => {
                            Swal.fire(
                                "Berhasil!",
                                "Status laporan telah diperbarui.",
                                "success",
                            );
                        },
                    },
                );
            }
        });
    };

    const columns = [
        {
            header: "Koperasi",
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800 leading-none">
                        {item.koperasi?.nama}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">
                        NIK: {item.koperasi?.nomor_induk || "-"}
                    </span>
                </div>
            ),
        },
        {
            header: "Wilayah",
            render: (item) => (
                <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                    <MapPin size={12} className="text-red-500" />
                    {item.koperasi?.kecamatan?.nama || "-"}
                </div>
            ),
        },
        {
            header: "Periode",
            className: "text-center",
            render: (item) => (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase text-slate-600">
                    <Calendar size={12} />
                    {item.bulan} - {item.tahun}
                </div>
            ),
        },
        {
            header: "Status",
            className: "text-center",
            render: (item) => {
                const statusStyles = {
                    Approved:
                        "bg-emerald-100 text-emerald-700 border-emerald-200",
                    Rejected: "bg-red-100 text-red-700 border-red-200",
                    Submitted: "bg-amber-100 text-amber-700 border-amber-200",
                };
                return (
                    <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusStyles[item.status] || "bg-gray-100"}`}
                    >
                        {item.status?.toUpperCase()}
                    </span>
                );
            },
        },
        {
            header: "Aksi Validasi",
            className: "text-right",
            render: (item) => (
                <div className="flex justify-end gap-2">
                    {item.status !== "Approved" && (
                        <button
                            onClick={() =>
                                handleUpdateStatus(item.id, "Approved")
                            }
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                            title="Setujui Laporan"
                        >
                            <CheckCircle size={18} />
                        </button>
                    )}
                    {item.status !== "Rejected" && (
                        <button
                            onClick={() =>
                                handleUpdateStatus(item.id, "Rejected")
                            }
                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            title="Tolak Laporan"
                        >
                            <XCircle size={18} />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <AdminLayout user={auth.user}>
            <Head title="Validasi Laporan Bulanan" />

            <div className="">
                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Validasi Laporan Bulanan
                    </h1>
                    <p className="text-sm text-gray-500">
                        Kelola dan validasi laporan rutin bulanan dari seluruh
                        koperasi.
                    </p>
                </div>

                {/* Filter Section (Floating Card) */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-600 uppercase ml-2">
                            Bulan
                        </label>
                        <select
                            value={filterData.bulan}
                            onChange={(e) =>
                                setFilterData({
                                    ...filterData,
                                    bulan: e.target.value,
                                })
                            }
                            className="w-full bg-gray-50 border-none rounded-2xl text-xs font-semibold focus:ring-blue-900"
                        >
                            <option value="">Semua Bulan</option>
                            {[
                                "Januari",
                                "Februari",
                                "Maret",
                                "April",
                                "Mei",
                                "Juni",
                                "Juli",
                                "Agustus",
                                "September",
                                "Oktober",
                                "November",
                                "Desember",
                            ].map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-600 uppercase ml-2">
                            Tahun
                        </label>
                        <input
                            type="number"
                            placeholder="Contoh: 2024"
                            value={filterData.tahun}
                            onChange={(e) =>
                                setFilterData({
                                    ...filterData,
                                    tahun: e.target.value,
                                })
                            }
                            className="w-full bg-gray-50 border-none rounded-2xl text-xs font-semibold focus:ring-blue-900"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-600 uppercase ml-2">
                            Kecamatan
                        </label>
                        <select
                            value={filterData.kecamatan}
                            onChange={(e) =>
                                setFilterData({
                                    ...filterData,
                                    kecamatan: e.target.value,
                                })
                            }
                            className="w-full bg-gray-50 border-none rounded-2xl text-xs font-semibold focus:ring-blue-900"
                        >
                            <option value="">Semua Wilayah</option>
                            {listKecamatan.map((kec) => (
                                <option key={kec.id} value={kec.id}>
                                    {kec.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-600 uppercase ml-2">
                            Status
                        </label>
                        <select
                            value={filterData.status}
                            onChange={(e) =>
                                setFilterData({
                                    ...filterData,
                                    status: e.target.value,
                                })
                            }
                            className="w-full bg-gray-50 border-none rounded-2xl text-xs font-semibold focus:ring-blue-900"
                        >
                            <option value="">Semua Status</option>
                            <option value="Submitted">
                                Menunggu (Submitted)
                            </option>
                            <option value="Approved">
                                Disetujui (Approved)
                            </option>
                            <option value="Rejected">Ditolak (Rejected)</option>
                        </select>
                    </div>

                    <button
                        onClick={handleFilter}
                        className="bg-blue-950 text-white h-[45px] rounded-2xl font-semibold text-xs tracking-widest hover:bg-blue-900 transition-all flex items-center justify-center gap-2"
                    >
                        <Filter size={14} /> Terapkan Filter
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
                    <Table columns={columns} items={laporanBulanan} />
                </div>
            </div>
        </AdminLayout>
    );
}
