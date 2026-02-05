import UsersLayout from "@/Layouts/UsersLayout";
import { Link } from "@inertiajs/react";
import {
    Activity,
    ArrowLeft,
    Briefcase,
    Calendar,
    Edit,
    IdCardIcon,
    Layers,
    Phone,
    Route,
    User,
} from "lucide-react";
import React from "react";

export default function Show({ auth, anggotaData }) {
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
            <div className="flex flex-col justify-between items-start gap-4">
                <div className="flex items-center gap-6">
                    <Link
                        href={route("users.anggota.index")}
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

                <div className="flex justify-center items-center">
                    <div className="bg-white p-10 rounded-[3.5rem] flex justify-center items-center border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            <InfoItem
                                label="Nama"
                                value={anggotaData.nama}
                                icon={<User
                                 />}
                            />
                            <InfoItem
                                label="NIK"
                                value={anggotaData.nik}
                                icon={<IdCardIcon />}
                            />
                            <InfoItem
                                label="Nomor Anggota"
                                value={anggotaData.nomor_anggota}
                                icon={<IdCardIcon />}
                            />
                            <InfoItem
                                label="Status"
                                value={anggotaData.status}
                                icon={<Activity />}
                            />
                            <InfoItem
                                label="Mulai Bergabung"
                                value={formatTanggal(
                                    anggotaData.tanggal_bergabung,
                                )}
                                icon={<Calendar />}
                            />
                            <InfoItem
                                label="Nomor Telepon"
                                value={anggotaData.nomor_telepon}
                                icon={<Phone />}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </UsersLayout>
    );
}

function InfoItem({ label, value, icon }) {
    return (
        <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-50 rounded-2xl text-gray-500">
                {React.cloneElement(icon, { size: 18 })}
            </div>
            <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-1">
                    {label}
                </p>
                <p className="text-base font-bold text-gray-800">
                    {value || "Tidak Tersedia"}
                </p>
            </div>
        </div>
    );
}
