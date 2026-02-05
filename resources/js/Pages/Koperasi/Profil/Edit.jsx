import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import axios from "axios";
import { Save, ArrowLeft } from "lucide-react";
import IdentityCard from "@/Components/SelfMade/Section/IdentitySection";
import MapSection from "@/Components/SelfMade/Section/MapSection";
import ContactSection from "@/Components/SelfMade/Section/ContactSection";
import StatusSection from "@/Components/SelfMade/Section/StatusSection";
import UsersLayout from "@/Layouts/UsersLayout";

export default function Edit({ auth, koperasi, kecamatanOpt, jenisUsahaOpt }) {
    // --- 1. STATE & FORM SETUP ---
    const [desaOptions, setDesaOptions] = useState([]);
    const isFirstRender = useRef(true);

    const { data, setData, put, processing, errors } = useForm({
        // A. Identitas
        // --- 1. IDENTITAS ---
        nama: koperasi.nama || "",
        nomor_induk: koperasi.nomor_induk || "",
        nomor_ahu: koperasi.nomor_ahu || "",
        tanggal_ahu: koperasi.tanggal_ahu
            ? koperasi.tanggal_ahu.split("T")[0]
            : "",
        tanggal_berdiri: koperasi.tanggal_berdiri
            ? koperasi.tanggal_berdiri.split("T")[0]
            : "",
        tahun_pembentukan: koperasi.tahun_pembentukan || "",

        kecamatan_id: koperasi.kecamatan_id || "",
        desa_id: koperasi.desa_id || "",
        alamat: koperasi.alamat || "",
        latitude: koperasi.latitude || "",
        longitude: koperasi.longitude || "",

        // Boolean values
        status_operasional: koperasi.status_operasional == 1,
        status_pelatihan: koperasi.status_pelatihan == 1,
        status_sertifikat: koperasi.status_sertifikat == 1,

        email: koperasi.email || "",
        no_telepon: koperasi.no_telepon || "",
        website: koperasi.website || "",

        link_facebook: koperasi.link_facebook || "",
        link_instagram: koperasi.link_instagram || "",
        link_youtube: koperasi.link_youtube || "",
        link_tiktok: koperasi.link_tiktok || "",

        // Array ID dari Controller (Pivot)
        jenis_usaha_ids: koperasi.jenis_usaha_ids || [],
    });

    // --- 2. LOGIC DROP DOWN BERANTAI (AXIOS) ---
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            // Tetap fetch opsi desa agar dropdown tidak kosong, tapi JANGAN reset value-nya
            if (data.kecamatan_id) {
                axios
                    .get(route("users.api.getDesa", data.kecamatan_id))
                    .then((res) => setDesaOptions(res.data));
            }
            return;
        }
        if (data.kecamatan_id) {
            setData("desa_id", ""); // Reset desa pas ganti kecamatan
            setDesaOptions([]); // Kosongin opsi

            // Panggil API Internal
            axios
                .get(route("admin.api.getDesa", data.kecamatan_id))
                .then((res) => setDesaOptions(res.data))
                .catch((err) => console.error(err));
        }
    }, [data.kecamatan_id]);

    // --- 3. SUBMIT ---
    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("users.koperasi.update", koperasi));
    };

    return (
        <UsersLayout auth={auth}>
            <Head title="Tambah Koperasi Baru" />

            {/* --- HEADER --- */}
            <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Link
                        href={route("admin.koperasi.index")}
                        className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-200 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-blue-950">
                        Edit Koperasi
                    </h1>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="max-w-7xl mx-auto space-y-6 pb-20"
            >
                {/* ==========================================
                    KARTU 1: IDENTITAS & LEGALITAS
                   ========================================== */}
                <IdentityCard
                    data={data}
                    setData={setData}
                    errors={errors}
                    jenisUsahaOpt={jenisUsahaOpt}
                ></IdentityCard>

                {/* ==========================================
                    KARTU 2: LOKASI (Dependent Dropdown)
                   ========================================== */}
                <MapSection
                    data={data}
                    setData={setData}
                    kecamatanOpt={kecamatanOpt}
                    desaOptions={desaOptions}
                    errors={errors}
                ></MapSection>

                {/* ==========================================
                    KARTU 3: STATUS OPERASIONAL (Checkbox)
                   ========================================== */}
                <StatusSection
                    data={data}
                    setData={setData}
                    errors={errors}
                ></StatusSection>

                {/* ==========================================
                    KARTU 4: KONTAK & JEJAK DIGITAL
                   ========================================== */}
                <ContactSection data={data} setData={setData} errors={errors} />

                {/* --- TOMBOL ACTION --- */}
                <div className="flex justify-end gap-3 pt-6">
                    <Link
                        href={route("admin.koperasi.index")}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        onSubmit={handleSubmit}
                        disabled={processing}
                        className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition font-bold shadow-lg flex items-center gap-2"
                    >
                        <Save size={20} />
                        {processing ? "Menyimpan..." : "Simpan Data Koperasi"}
                    </button>
                </div>
            </form>
        </UsersLayout>
    );
}
