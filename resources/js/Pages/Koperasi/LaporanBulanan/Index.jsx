import React, { useState, useEffect } from "react";
import UsersLayout from "@/Layouts/UsersLayout";
import Header from "@/Components/SelfMade/Header";
import Button from "@/Components/SelfMade/Button";
import ModalDialog from "@/Components/SelfMade/ModalDialog";
import { router, useForm } from "@inertiajs/react";
import {
    Plus,
    Search,
    FileText,
    CheckCircle,
    Clock,
    UserCheck2,
    ChevronRightIcon,
    X,
    User,
    Banknote,
    Calendar,
    Activity,
    Users,
    StickyNote,
    Trash2,
} from "lucide-react";
import Table from "@/Components/SelfMade/Table";
import Swal from "sweetalert2";

export default function Index({
    auth,
    laporanBulanan,
    filters,
    jumlahAnggotaAktif,
    statusOpt,
    totalSimpananPokok,
    totalSimpananWajib,
}) {
    const [openModal, setOpenModal] = useState(false);
    const [openShowModal, setOpenShowModal] = useState(false);
    const [selectedLaporan, setSelectedLaporan] = useState(null);

    // State untuk Filter
    const [params, setParams] = useState({
        bulan: filters.bulan || new Date().getMonth() + 1,
        tahun: filters.tahun || new Date().getFullYear(),
        status: filters.status || "",
    });

    // Form untuk tambah laporan baru
    const {
        data,
        setData,
        post,
        delete: destroy,
        processing,
        reset,
    } = useForm({
        bulan: params.bulan,
        tahun: params.tahun,
        total_simpanan_pokok: totalSimpananPokok,
        total_simpanan_wajib: totalSimpananWajib,
        jumlah_anggota_aktif: jumlahAnggotaAktif,
        catatan: "",
    });

    const handleShow = (item) => {
        setOpenShowModal(true);
        setSelectedLaporan(item);
    };

    const columns = [
        {
            header: "Periode",
            render: (item) => (
                <span className="text-slate-950 font-bold text-sm">
                    {new Date(0, item.bulan - 1).toLocaleString("id-ID", {
                        month: "long",
                    })}{" "}
                    {item.tahun}
                </span>
            ),
        },
        {
            header: "Total Simpanan",
            render: (item) => {
                // 1. Jumlahkan kedua nilainya (pake parseFloat biar aman dari string)
                const total =
                    parseFloat(item.total_simpanan_pokok || 0) +
                    parseFloat(item.total_simpanan_wajib || 0);

                return (
                    <span className="text-slate-700 font-black text-sm">
                        {/* 2. Format jadi Rupiah pake Intl.NumberFormat biar pro */}
                        {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                        }).format(total)}
                    </span>
                );
            },
        },
        {
            header: "Status",
            render: (item) => {
                return (
                    <span className="text-slate-700 font-bold text-sm">
                        {item.status}
                    </span>
                );
            },
        },
        {
            header: "Aksi",
            render: (item) => {
                return (
                    <button
                        onClick={() => handleShow(item)}
                        className="text-blue-950 hover:text-blue-900 hover:bg-blue-100 py-1 px-2 transition-all rounded-md flex justify-center items-center font-bold text-sm"
                    >
                        Lihat Detail<ChevronRightIcon></ChevronRightIcon>
                    </button>
                );
            },
        },
    ];

    // Handler Filter
    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(route("users.laporan.index"), params, {
                preserveState: true,
                replace: true,
            });
        }, 300);
        return () => clearTimeout(delay);
    }, [params]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("users.laporan.store"), {
            onSuccess: () => {
                setOpenModal(false);
                reset();
                Swal.fire(
                    "Berhasil!",
                    "Laporan bulanan berhasil dibuat.",
                    "success"
                );
            },
            onError: (errors) => {
                // Tampilkan error dari backend (misal: duplikasi bulan)
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text:
                        errors.bulan ||
                        errors.message ||
                        "Terjadi kesalahan saat menyimpan laporan.",
                });
            },
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Hapus Laporan Bulanan?",
            text: "Data ini tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Ya, Hapus!",
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route("users.laporan.destroy", id), {
                    onSuccess: () => {
                        setOpenShowModal(false);
                        Swal.fire(
                            "Berhasil!",
                            "Laporan berhasil dihapus.",
                            "success"
                        );
                    },
                    onError: (errors) => {
                        setOpenShowModal(false);
                        Swal.fire(
                            "Gagal!",
                            errors.message || "Terjadi kesalahan.",
                            "error"
                        );
                    },
                });
            }
        });
    };

    return (
        <UsersLayout auth={auth}>
            <div className="p-6 space-y-6">
                <Header
                    title="Laporan Bulanan"
                    desc="Rekapitulasi aktivitas koperasi setiap bulan."
                >
                    <Button icon={Plus} onClick={() => setOpenModal(true)}>
                        Buat Laporan
                    </Button>
                </Header>

                {/* --- 1. FILTER BAR --- */}
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
                    <select
                        value={params.bulan}
                        onChange={(e) =>
                            setParams({ ...params, bulan: e.target.value })
                        }
                        className="rounded-xl border-slate-200 text-sm focus:ring-blue-500"
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString("id-ID", {
                                    month: "long",
                                })}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={params.tahun}
                        onChange={(e) =>
                            setParams({ ...params, tahun: e.target.value })
                        }
                        className="w-24 rounded-xl border-slate-200 text-sm"
                    />
                    <select
                        value={params.status}
                        onChange={(e) =>
                            setParams({ ...params, status: e.target.value })
                        }
                        className="rounded-xl border-slate-200 text-sm"
                    >
                        <option value="">Semua Status</option>
                        {statusOpt.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* --- 2. STATS CARDS (Data Real-time dari Filter) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Anggota Aktif"
                        value={jumlahAnggotaAktif}
                        unit="Orang"
                        icon={UserCheck2}
                        color="bg-emerald-50 text-emerald-600"
                    />
                    <StatCard
                        title="Est. Simpanan Pokok"
                        value={new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                        }).format(totalSimpananPokok)}
                        unit="Bulan ini"
                        icon={FileText}
                        color="bg-blue-50 text-blue-600"
                    />
                    <StatCard
                        title="Est. Simpanan Wajib"
                        value={new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                        }).format(totalSimpananWajib)}
                        unit="Bulan ini"
                        icon={FileText}
                        color="bg-indigo-50 text-indigo-600"
                    />
                </div>

                {/* --- 3. TABLE RIWAYAT --- */}
                <Table columns={columns} items={laporanBulanan}></Table>
            </div>

            {/* Modal Tambah Laporan */}
            <ModalDialog show={openModal} onClose={() => setOpenModal(false)}>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <h2 className="text-2xl font-bold tracking-tighter">
                        Konfirmasi Laporan Bulanan
                    </h2>
                    <p className="text-sm text-slate-500">
                        Pastikan data transaksi bulan ini sudah benar sebelum
                        dikirim.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                        <p className="text-xs font-bold uppercase text-slate-400">
                            Ringkasan Periode {params.bulan}/{params.tahun}:
                        </p>
                        <div className="flex justify-between text-sm">
                            <span>Total Simpanan:</span>{" "}
                            <span className="font-bold">
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                }).format(
                                    Number(totalSimpananPokok) +
                                        Number(totalSimpananWajib)
                                )}
                            </span>
                        </div>
                    </div>
                    <textarea
                        className="w-full rounded-2xl border-slate-200 text-sm focus:ring-blue-950"
                        placeholder="Tambahkan catatan jika ada..."
                        onChange={(e) => setData("keterangan", e.target.value)}
                    ></textarea>
                    <div className="flex gap-4">
                        <Button
                            className="flex-1"
                            variant="outline"
                            onClick={() => setOpenModal(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            className="flex-1"
                            type="submit"
                            disabled={processing}
                        >
                            Kirim Laporan
                        </Button>
                    </div>
                </form>
            </ModalDialog>

            <ModalDialog
                show={openShowModal}
                onClose={() => setOpenShowModal(false)}
            >
                <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-950 ">
                            Detail Laporan Bulanan
                        </h2>
                        <button
                            className="text-slate-600 rounded-full p-3 hover:bg-slate-200 transition-all "
                            onClick={() => setOpenShowModal(false)}
                        >
                            <X size={28} />
                        </button>
                    </div>

                    {selectedLaporan && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <InfoItem
                                    label="Periode"
                                    value={`${new Date(
                                        0,
                                        selectedLaporan.bulan - 1
                                    ).toLocaleString("id-ID", {
                                        month: "long",
                                    })} ${selectedLaporan.tahun}`}
                                    icon={<Calendar />}
                                />
                                <InfoItem
                                    label="Simpanan Pokok"
                                    value={selectedLaporan.total_simpanan_pokok}
                                    icon={<Banknote />}
                                />
                                <InfoItem
                                    label="Simpanan Wajib"
                                    value={selectedLaporan.total_simpanan_wajib}
                                    icon={<Banknote />}
                                />
                                <InfoItem
                                    label="Total Simpanan"
                                    value={`${new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                    }).format(
                                        Number(totalSimpananPokok) +
                                            Number(totalSimpananWajib)
                                    )}`}
                                    icon={<Banknote />}
                                />
                                <InfoItem
                                    label="Jumlah Anggota Aktif"
                                    value={selectedLaporan.jumlah_anggota_aktif}
                                    icon={<Users />}
                                />
                                <InfoItem
                                    label="Status Laporan"
                                    value={selectedLaporan.status}
                                    icon={<Activity />}
                                />
                                <InfoItem
                                    label="Catatan Tambahan"
                                    value={selectedLaporan.catatan}
                                    icon={<StickyNote />}
                                />
                                {selectedLaporan.status === "Rejected" && (
                                    <InfoItem
                                        label="Catatan Admin"
                                        value={selectedLaporan.catatan_admin}
                                        icon={<StickyNote />}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-start items-center mt-8">
                        <button
                            className="py-2 px-2 rounded-lg flex items-center justify-center gap-3 border-2 border-red-900 text-red-900 hover:bg-red-900 hover:text-white transition-all font-semibold bg-red-100"
                            onClick={() => handleDelete(selectedLaporan.id)}
                        >
                            <Trash2 size={20} /> Hapus Laporan Bulanan
                        </button>
                    </div>
                </div>
            </ModalDialog>
        </UsersLayout>
    );
}

// Sub-komponen Card Statis
function StatCard({ title, value, unit, icon: Icon, color }) {
    return (
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-300 shadow-sm flex flex-col items-start gap-5 hover:shadow-md transition-all">
            <div className={`p-4 rounded-2xl ${color}`}>
                <Icon size={16} />
            </div>
            <div>
                <p className="text-sm font-bold text-blue-950 uppercase tracking-widest mb-1">
                    {title}
                </p>
                <h3 className="text-lg font-black text-slate-950 leading-none">
                    {value}
                </h3>
                <p className="text-[14px] font-medium text-slate-400 mt-1 ">
                    {unit}
                </p>
            </div>
        </div>
    );
}

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
                    {value || "-"}
                </p>
            </div>
        </div>
    );
}
