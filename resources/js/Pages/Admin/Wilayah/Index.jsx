import React, { useState } from "react"; // 👈 Import useState
import AdminLayout from "@/Layouts/AdminLayout";
import Modal from "@/Components/SelfMade/WilayahModal"; // 👈 Import Modal Sakti tadi
import { Head, useForm, router } from "@inertiajs/react";
import { Building2, Edit3, MapPin, Trash2, X } from "lucide-react";
import Pagination from "@/Components/SelfMade/Pagination";
import KecamatanCard from "@/Components/SelfMade/Cards/KecamatanCard";
import Dropdown from "@/Components/SelfMade/Dropdown";
import TextInput from "@/Components/SelfMade/TextInput";
import ModalDialog from "@/Components/SelfMade/ModalDialog";

// 👇 Props 'list_wilayah' otomatis dikirim dari Controller tadi
export default function Index({ auth, kecamatans, kecamatanOpt }) {
    // Cek di console biar yakin datanya masuk
    // console.log("Data dari BE:", wilayah);

    // 1. STATE MODAL
    const [activeTab, setActiveTab] = useState("desa"); // 'desa' atau 'kecamatan'
    const [modalState, setModalState] = useState({ type: null, data: null }); // type: 'create_desa', 'edit_desa', 'create_kec', 'edit_kec'

    // --- FORM INERTIA ---
    const kecForm = useForm({ nama: "" });

    const desaForm = useForm({
        kecamatan_id: "",
        nama: "",
        jenis: 'Desa'
    });


    // --- HANDLERS ---
    const openModal = (type, data = null) => {
        setModalState({ type, data });

        if (type === "create_desa") {
            desaForm.reset();
        } else if (type === "edit_desa" && data) {
            desaForm.setData({
                id: data.id,
                kecamatan_id: data.kecamatan_id,
                nama: data.nama,
                jenis: data.jenis || "Desa", // Load jenis
            });
        } else if (type === "create_kec") {
            kecForm.reset();
        } else if (type === "edit_kec" && data) {
            kecForm.setData({ id: data.id, nama: data.nama });
        }
    };

    const closeModal = () => {
        setModalState({ type: null, data: null });
        desaForm.clearErrors();
        kecForm.clearErrors();
    };

    const submitKecamatan = (e) => {
        e.preventDefault();
        const isCreate = modalState.type === "create_kec";
        const url = isCreate
            ? route("admin.wilayah.kecamatan.store")
            : route("admin.wilayah.kecamatan.update", kecForm.data.id);
        const method = isCreate ? kecForm.post : kecForm.put;

        method(url, {
            onSuccess: () => {
                closeModal();
                Swal.fire("Berhasil", "Data kecamatan disimpan", "success");
            },
        });
    };

    const submitDesa = (e) => {
        e.preventDefault();
        const isCreate = modalState.type === "create_desa";
        const url = isCreate
            ? route("admin.desa.store")
            : route("admin.desa.update", desaForm.data.id);
        const method = isCreate ? desaForm.post : desaForm.put;

        method(url, {
            onSuccess: () => {
                closeModal();
                Swal.fire("Berhasil", "Data wilayah disimpan", "success");
            },
        });
    };

    const handleDelete = (url) => {
        Swal.fire({
            title: "Hapus Data?",
            text: "Data yang dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(url, {
                    onSuccess: () =>
                        Swal.fire(
                            "Terhapus!",
                            "Data berhasil dihapus.",
                            "success",
                        ),
                });
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Manajemen Wilayah Bangka Tengah
                </h2>
            }
        >
            <Head title="Data Wilayah" />

            <div className="py-5">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Tombol Tambah */}
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="font-bold text-xl text-blue-950">
                            Wilayah
                        </h1>
                        <div className=" flex gap-4">
                            <button
                                onClick={() => openModal("create_desa")}
                                className="bg-white text-blue-950 px-4 py-2 rounded-lg hover:bg-blue-950 border-2 border-blue-950 hover:text-white transition"
                            >
                                + Tambah Kecamatan
                            </button>
                            <button
                                onClick={() => openModal("create_kec")}
                                className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-950 transition"
                            >
                                + Tambah Desa
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Cek apakah data ada */}
                        {kecamatans.length > 0 ? (
                            kecamatans.map((kec) => (
                                <KecamatanCard
                                    key={kec.id}
                                    item={kec}
                                    onEdit={(item) =>
                                        openModal("edit_kec", item)
                                    }
                                    onDelete={(id) =>
                                        handleDelete(
                                            route(
                                                "admin.wilayah.kecamatan.destroy",
                                                id,
                                            ),
                                        )
                                    }
                                    onEditDesa={(desa) =>
                                        openModal("edit_desa", desa)
                                    }
                                    onDeleteDesa={(id) =>
                                        handleDelete(
                                            route(
                                                "admin.wilayah.desa.destroy",
                                                id,
                                            ),
                                        )
                                    }
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                Belum ada data kecamatan.
                            </div>
                        )}
                    </div>

                    <div className="mt-8">
                        {/* Kita kirim props 'links' dari object pagination Laravel */}
                        {/* <Pagination links={kecamatans.links} /> */}
                    </div>
                </div>
            </div>

            <ModalDialog
                show={
                    modalState.type === "create_desa" ||
                    modalState.type === "edit_desa"
                }
                onClose={closeModal}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-lg font-bold text-gray-800">
                            {modalState.type === "create_desa"
                                ? "Tambah Wilayah Baru"
                                : "Edit Wilayah"}
                        </h2>
                        <button onClick={closeModal}>
                            <X
                                className="text-gray-400 hover:text-red-500"
                                size={20}
                            />
                        </button>
                    </div>

                    <form onSubmit={submitDesa} className="space-y-4">
                        {/* Pilih Kecamatan */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kecamatan Induk
                            </label>
                            <select
                                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 bg-white"
                                value={desaForm.data.kecamatan_id}
                                onChange={(e) =>
                                    desaForm.setData(
                                        "kecamatan_id",
                                        e.target.value,
                                    )
                                }
                            >
                                <option value="">-- Pilih Kecamatan --</option>
                                {/* Kita gunakan list 'kecamatans' untuk dropdown */}
                                {kecamatans.map((kec) => (
                                    <option key={kec.id} value={kec.id}>
                                        {kec.nama}
                                    </option>
                                ))}
                            </select>
                            {desaForm.errors.kecamatan_id && (
                                <p className="text-red-500 text-xs mt-1">
                                    {desaForm.errors.kecamatan_id}
                                </p>
                            )}
                        </div>

                        {/* Nama Desa */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Desa / Kelurahan
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border-gray-300 focus:ring-blue-500"
                                placeholder="Contoh: Koba"
                                value={desaForm.data.nama}
                                onChange={(e) =>
                                    desaForm.setData("nama", e.target.value)
                                }
                            />
                            {desaForm.errors.nama && (
                                <p className="text-red-500 text-xs mt-1">
                                    {desaForm.errors.nama}
                                </p>
                            )}
                        </div>

                        {/* Jenis Wilayah */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status Administrasi
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <label
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition relative ${desaForm.data.jenis === "Desa" ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500" : "bg-white border-gray-200 hover:bg-gray-50"}`}
                                >
                                    <input
                                        type="radio"
                                        name="jenis"
                                        value="Desa"
                                        checked={desaForm.data.jenis === "Desa"}
                                        onChange={(e) =>
                                            desaForm.setData(
                                                "jenis",
                                                e.target.value,
                                            )
                                        }
                                        className="text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                                    />
                                    <span
                                        className={`text-sm ${desaForm.data.jenis === "Desa" ? "font-bold text-emerald-800" : "text-gray-600"}`}
                                    >
                                        Desa
                                    </span>
                                </label>
                                <label
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition relative ${desaForm.data.jenis === "Kelurahan" ? "bg-purple-50 border-purple-500 ring-1 ring-purple-500" : "bg-white border-gray-200 hover:bg-gray-50"}`}
                                >
                                    <input
                                        type="radio"
                                        name="jenis"
                                        value="Kelurahan"
                                        checked={
                                            desaForm.data.jenis === "Kelurahan"
                                        }
                                        onChange={(e) =>
                                            desaForm.setData(
                                                "jenis",
                                                e.target.value,
                                            )
                                        }
                                        className="text-purple-600 focus:ring-purple-500 w-4 h-4"
                                    />
                                    <span
                                        className={`text-sm ${desaForm.data.jenis === "Kelurahan" ? "font-bold text-purple-800" : "text-gray-600"}`}
                                    >
                                        Kelurahan
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={desaForm.processing}
                                className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-bold shadow hover:bg-blue-800"
                            >
                                {desaForm.processing
                                    ? "Menyimpan..."
                                    : "Simpan"}
                            </button>
                        </div>
                    </form>
                </div>
            </ModalDialog>

            <ModalDialog
                show={
                    modalState.type === "create_kec" ||
                    modalState.type === "edit_kec"
                }
                onClose={closeModal}
                maxWidth="sm"
            >
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                        {modalState.type === "create_kec"
                            ? "Tambah Kecamatan"
                            : "Edit Kecamatan"}
                    </h2>
                    <form onSubmit={submitKecamatan} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Kecamatan
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border-gray-300 focus:ring-blue-500"
                                placeholder="Contoh: Koba"
                                value={kecForm.data.nama}
                                onChange={(e) =>
                                    kecForm.setData("nama", e.target.value)
                                }
                            />
                            {kecForm.errors.nama && (
                                <p className="text-red-500 text-xs mt-1">
                                    {kecForm.errors.nama}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={kecForm.processing}
                                className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-bold shadow hover:bg-blue-800"
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </ModalDialog>
        </AdminLayout>
    );
}
