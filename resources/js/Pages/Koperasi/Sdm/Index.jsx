import React, { useState } from "react";
import UsersLayout from "@/Layouts/UsersLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Plus, Edit2, Trash2, UserCog, X, Eye } from "lucide-react";
import Table from "@/Components/SelfMade/Table";
import Swal from "sweetalert2";

export default function Index({ auth, sdmKoperasi, jabatanOpt, statusOpt }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // Form handling menggunakan Inertia useForm
    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } =
        useForm({
            nama: "",
            nik: "", // Tambahkan ini
            kategori: "Pengurus Koperasi", // Tambahkan default
            tanggal_bergabung: "", // Tambahkan ini
            jabatan: "",
            status: "Aktif",
        });

    // Buka Modal (Tambah atau Edit)
    const openModal = (item = null) => {
        clearErrors();
        if (item) {
            setEditData(item);
            setData({
                nama: item.nama,
                nik: item.nik, // Tambahkan ini
                kategori: item.kategori, // Tambahkan ini
                tanggal_bergabung: item.tanggal_bergabung, // Tambahkan ini
                jabatan: item.jabatan,
                status: item.status,
            });
        } else {
            setEditData(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    // Submit Handler
    const submit = (e) => {
        e.preventDefault();
        if (editData) {
            put(route("users.sdm.update", editData.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route("users.sdm.store"), {
                onSuccess: () => closeModal(),
            });
        }
    };

    // Delete Handler
    const handleDelete = (id) => {
        Swal.fire({
            title: "Hapus Pengurus?",
            text: "Data ini tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Ya, Hapus!",
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route("users.sdm.destroy", id));
            }
        });
    };

    const columns = [
        {
            header: "Nama",
            render: (item) => (
                <span className="font-bold text-gray-800 text-xs uppercase tracking-tight">
                    {item.nama}
                </span>
            ),
        },
        {
            header: "Jabatan",
            render: (item) => (
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    {item.jabatan}
                </span>
            ),
        },
        {
            header: "NIK",
            render: (item) => (
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    {item.nik}
                </span>
            ),
        },
        {
            header: "Status",
            render: (item) => (
                <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${item.status === "Aktif" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                >
                    {item.status}
                </span>
            ),
        },
        {
            header: "Aksi",
            className: "text-right",
            render: (item) => (
                <div className="flex justify-end gap-2">
                    <Link
                        href={route("users.sdm.show", item.id)}
                        className="p-1.5 bg-blue-50 text-blue-900 rounded-lg"
                    >
                        <Eye size={14} />
                    </Link>
                    <Link
                        href={route("users.sdm.edit", item.id)}
                        className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"
                    >
                        <Edit2 size={14} />
                    </Link>
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <UsersLayout auth={auth}>
            <Head title="Kelola SDM Pengurus" />

            <div className="p-8 space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tighter">
                            Manajemen Pengurus
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">
                            Kelola SDM Pengurus dan Pengawas Koperasi.
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-blue-950 text-white px-5 py-3 rounded-2xl font-medium text-sm tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-gray-200"
                    >
                        <Plus size={16} /> Tambah SDM
                    </button>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                    <div className="p-6 border-b border-gray-50">
                        <h3 className="font-black text-gray-900 uppercase tracking-widest text-[10px] flex items-center gap-2">
                            <UserCog size={14} className="text-blue-950" />{" "}
                            Daftar Pengurus dan Pengawas Koperasi
                        </h3>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <Table
                            columns={columns}
                            items={{ data: sdmKoperasi }}
                        />
                    </div>
                </div>
            </div>
        </UsersLayout>
    );
}
