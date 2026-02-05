import Dropdown from "@/Components/SelfMade/Dropdown";
import ModalDialog from "@/Components/SelfMade/ModalDialog";
import Table from "@/Components/SelfMade/Table";
import TextInput from "@/Components/SelfMade/TextInput";
import UsersLayout from "@/Layouts/UsersLayout";
import { useForm } from "@inertiajs/react";
import { Plus, Save, X } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Index({ auth, transaksi, anggotaOpt, jenisTransaksiOpt, filters }) {
    const [openModal, setOpenModal] = useState(false);

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

    const {
        data,
        setData,
        post,
        delete: destroy,
        isDirty,
        processing,
        errors,
        reset,
    } = useForm({
        id: null,
        anggota_koperasi_id: "",
        nomor_transaksi: "",
        jenis_transaksi: "",
        jumlah: "",
        tanggal_transaksi: "",
        keterangan: "",
    });

    const columns = [
        {
            header: "Nomor Transaksi",
            render: (item) => (
                <span className="font-bold text-gray-800 text-xs uppercase tracking-tight">
                    {item.nomor_transaksi}
                </span>
            ),
        },
        {
            header: "Jenis Transaksi",
            render: (item) => (
                <span className="font-bold text-gray-800 text-xs uppercase tracking-tight">
                    {item.jenis_transaksi}
                </span>
            ),
        },
        {
            header: "Jumlah",
            render: (item) => (
                <span className="font-bold text-gray-800 text-xs uppercase tracking-tight">
                    {item.jumlah}
                </span>
            ),
        },
        {
            header: "Tanggal Transaksi",
            render: (item) => (
                <span className="font-bold text-gray-800 text-xs uppercase tracking-tight">
                    {formatTanggal(item.tanggal_transaksi)}
                </span>
            ),
        },
    ];

    const handleAdd = () => {
        reset();
        setOpenModal(true);
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
                destroy(route("users.transaksi.destroy", id));
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        post(route('users.transaksi.store'), {
            onSuccess: () => {
                setOpenModal(false)
                reset()
            }
        })
    }

    return (
        <UsersLayout auth={auth}>
            <div className="p-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tighter">
                            Manajemen Transaksi
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">
                            Kelola Seluruh Transaksi Koperasi.
                        </p>
                    </div>
                    <button
                        onClick={handleAdd}
                        type="button"
                        className="flex items-center gap-2 bg-blue-950 text-white px-5 py-3 rounded-2xl font-medium text-sm tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-gray-200"
                    >
                        <Plus size={16} /> Tambah Transaksi
                    </button>
                </div>

                <Table columns={columns} items={transaksi}></Table>
            </div>

            <ModalDialog
                show={openModal}
                onClose={() => setOpenModal(false)}
            >
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
                        Tambah Transaksi
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Form Input Kamu di Sini */}
                        <Dropdown
                            label={"Anggota Koperasi"}
                            type={"text"}
                            value={data.anggota_koperasi_id}
                            error={errors.anggota_koperasi_id}
                            onChange={(e) => setData("anggota_koperasi_id", e.target.value)}
                            options={anggotaOpt}
                        />
                        <Dropdown
                            label={"Jenis Transaksi"}
                            type={"text"}
                            value={data.jenis_transaksi}
                            error={errors.jenis_transaksi}
                            onChange={(e) =>
                                setData("jenis_transaksi", e.target.value)
                            }
                            options={jenisTransaksiOpt}
                        />
                        <TextInput
                            label={"Nominal Transaksi"}
                            type={"number"}
                            value={data.jumlah}
                            error={errors.jumlah}
                            onChange={(e) => setData("jumlah", e.target.value)}
                        />
                        <TextInput
                            label={"Tanggal Transaksi"}
                            type={"date"}
                            value={data.tanggal_transaksi}
                            error={errors.tanggal_transaksi}
                            onChange={(e) =>
                                setData("tanggal_transaksi", e.target.value)
                            }
                        />
                        <TextInput
                            label={"Keterangan"}
                            type={"text"}
                            value={data.keterangan}
                            error={errors.keterangan}
                            onChange={(e) =>
                                setData("keterangan", e.target.value)
                            }
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
