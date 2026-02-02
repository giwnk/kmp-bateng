import React from "react";
import {
    Building2,
    Home,
    Users,
    UserCheck,
    ShieldCheck,
    UserPlus,
    Landmark,
} from "lucide-react";

export default function StatsCardLeft({dataPotensi, dataSdm}) {

    return (
        <div className="bg-blue-50 rounded-[1.5rem] border-2 border-slate-300 transition-all shadow-2xl overflow-hidden w-full hover:-translate-y-2 max-w-[380px]">
            {/* --- BAGIAN ATAS: UNIT (KELEMBAGAAN) --- */}
            <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 border-blue-950 border-2 rounded-lg">
                        <Landmark className="text-blue-950" size={18} />
                    </div>
                    <h3 className="text-base font-extrabold text-blue-950 uppercase tracking-wider">
                        Unit Koperasi
                    </h3>
                </div>

                <div className="space-y-4">
                    {/* Main Stat */}
                    <div>
                        <span className="text-sm font-semibold text-slate-600 uppercase">
                            Total Unit Aktif
                        </span>
                        <div className="text-3xl font-black text-slate-950 leading-none">
                            {dataPotensi.total_unit}
                        </div>
                    </div>

                    {/* Sub Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 bg-green-100 rounded-xl border border-cyan-800">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Home size={16} className="text-cyan-950" />
                                <span className="text-sm font-extrabold text-cyan-950 uppercase">
                                    Desa
                                </span>
                            </div>
                            <span className="text-xl font-bold text-slate-950">
                                {dataPotensi.total_unit_desa}
                            </span>
                        </div>
                        <div className="p-3 bg-violet-100 rounded-xl border border-indigo-950">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Building2
                                    size={16}
                                    className="text-purple-950"
                                />
                                <span className="text-sm font-extrabold text-purple-950 uppercase">
                                    Lurah
                                </span>
                            </div>
                            <span className="text-xl font-bold text-slate-950">
                                {dataPotensi.total_unit_kelurahan}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="px-5">
                <div className="border-t border-dashed border-blue-950"></div>
            </div>

            {/* --- BAGIAN BAWAH: SDM (ORANG) --- */}
            <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 border-blue-950 border-2 rounded-lg">
                        <Users className="text-blue-950" size={18} />
                    </div>
                    <h3 className="text-base font-extrabold text-blue-950 uppercase tracking-wider">
                        Sumber Daya Manusia
                    </h3>
                </div>

                <div className="mb-4">
                    <span className="text-sm font-semibold text-slate-600 uppercase">
                        Total SDM Terdaftar
                    </span>
                    <div className="text-3xl font-black text-slate-950 leading-none">
                        {dataSdm.total.toLocaleString()}
                    </div>
                </div>

                {/* SDM Details Grid (3 Kolom) */}
                <div className="grid grid-cols-3 gap-2">
                    {dataSdm.rincian.map((sdm, index) => (
                        <div
                            key={index}
                            className="text-center p-2 rounded-lg bg-blue-100 border border-blue-950"
                        >
                            <p className="text-xs font-extrabold text-blue-950 uppercase mb-1 text-center">
                                {sdm.kategori}
                            </p>
                            <p className="text-sm font-extrabold text-slate-950">
                                {sdm.jumlah}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
