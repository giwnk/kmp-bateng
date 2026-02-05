import Dropdown from "@/Components/SelfMade/Dropdown";
import ModalDialog from "@/Components/SelfMade/ModalDialog";
import Table from "@/Components/SelfMade/Table";
import TextInput from "@/Components/SelfMade/TextInput";
import UsersLayout from "@/Layouts/UsersLayout";
import { Link, useForm } from "@inertiajs/react";
import { Edit2, Eye, Plus, Save, Trash2, UserCog, X } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Index({ auth, koperasi, anggotaKoperasi, statusOpt }) {
    const [openModal, setOpenModal] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors, isDirty } =
        useForm({
            id: null,
            nama: "",
            nomor_anggota: "",
            nik: "",
            tanggal_bergabung: "",
            status: "Aktif",
            nomor_telepon: "",
            alamat: "",
        });

    const handleAdd = () => {
        reset();
        setSelectedData(null);
        setOpenModal(true);
    };

    const handleEdit = (anggotaData) => {
        setSelectedData(anggotaData);
        setData({
            id: anggotaData.id,
            nama: anggotaData.nama || "",
            nomor_anggota: anggotaData.nomor_anggota || "",
            nik: anggotaData.nik || "",
            tanggal_bergabung: anggotaData.tanggal_bergabung || "",
            status: anggotaData.status || "",
            nomor_telepon: anggotaData.nomor_telepon || "",
            alamat: anggotaData.alamat || "",
        });
        setOpenModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedData) {
            put(route("users.anggota.update", data.id), {
                onSuccess: () => {
                    setOpenModal(false); // 👈 Ini yang bikin modal tutup
                    reset(); // Bersihkan form
                },
            });
        } else {
            post(route("users.anggota.store"), {
                onSuccess: () => {
                    setOpenModal(false); // 👈 Ini yang bikin modal tutup
                    reset(); // Bersihkan form
                },
            });
        }
    };

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
                    destroy(route("users.anggota.destroy", id));
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
            header: "NIK",
            render: (item) => (
                <span className="font-bold text-gray-800 text-xs uppercase tracking-tight">
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
                        href={route("users.anggota.show", item.id)}
                        className="p-1.5 bg-blue-50 text-blue-900 rounded-lg"
                    >
                        <Eye size={14} />
                    </Link>
                    <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"
                    >
                        <Edit2 size={14} />
                    </button>
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
            <div className="p-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tighter">
                            Manajemen Anggota
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">
                            Kelola Seluruh Anggota Koperasi.
                        </p>
                    </div>
                    <button
                        onClick={handleAdd}
                        type="button"
                        className="flex items-center gap-2 bg-blue-950 text-white px-5 py-3 rounded-2xl font-medium text-sm tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-gray-200"
                    >
                        <Plus size={16} /> Tambah Anggota
                    </button>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                    <div className="p-6 border-b border-gray-50"></div>
                    <div className="flex-1 overflow-auto">
                        <Table columns={columns} items={anggotaKoperasi} />
                    </div>
                </div>
            </div>

            <ModalDialog show={openModal} onClose={() => setOpenModal(false)}>
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="flex justify-end items-center">
                        <button
                            className="text-slate-600 rounded-full p-3 hover:bg-slate-200 transition-all "
                            onClick={() => setOpenModal(false)}
                        >
                            <X size={28} />
                        </button>
                    </div>
                    <h2 className="text-xl font-bold text-slate-950 mb-6">
                        {data.id ? "Update Pengurus" : "Daftarkan Pengurus"}
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Form Input Kamu di Sini */}
                        <TextInput
                            label={"Nama"}
                            type={"text"}
                            value={data.nama}
                            error={errors.nama}
                            onChange={(e) => setData("nama", e.target.value)}
                        />
                        <TextInput
                            label={"Nomor Anggota"}
                            type={"text"}
                            value={data.nomor_anggota}
                            error={errors.nomor_anggota}
                            onChange={(e) =>
                                setData("nomor_anggota", e.target.value)
                            }
                        />
                        <TextInput
                            label={"NIK (16 Digit)"}
                            type={"text"}
                            value={data.nik}
                            error={errors.nik}
                            onChange={(e) => setData("nik", e.target.value)}
                        />
                        <TextInput
                            label={"Tanggal Bergabung"}
                            type={"date"}
                            value={data.tanggal_bergabung}
                            error={errors.tanggal_bergabung}
                            onChange={(e) =>
                                setData("tanggal_bergabung", e.target.value)
                            }
                        />
                        <Dropdown
                            label={"Pilih Status"}
                            type={"date"}
                            value={data.status}
                            error={errors.status}
                            options={statusOpt}
                            onChange={(e) => setData("status", e.target.value)}
                        />
                        <TextInput
                            label={"Nomor Telepon"}
                            type={"text"}
                            value={data.nomor_telepon}
                            error={errors.nomor_telepon}
                            onChange={(e) =>
                                setData("nomor_telepon", e.target.value)
                            }
                        />
                        <TextInput
                            className={"grid col-span-2"}
                            label={"Alamat"}
                            type={"text"}
                            value={data.alamat}
                            error={errors.alamat}
                            onChange={(e) => setData("alamat", e.target.value)}
                        />
                    </div>

                    <div className="mt-8 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => setOpenModal(false)}
                            className="..."
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing || !isDirty}
                            className={`py-2 px-3 rounded-lg flex justify-center items-center gap-3 font-semibold text-xs uppercase tracking-[0.2em] transition-all
                                    ${
                                        !isDirty || processing
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-blue-950 text-white hover:bg-blue-900 shadow-xl"
                                    }`}
                        >
                            <Save size={20} /> Simpan Perubahan
                        </button>
                    </div>
                </form>
            </ModalDialog>
        </UsersLayout>
    );
}
