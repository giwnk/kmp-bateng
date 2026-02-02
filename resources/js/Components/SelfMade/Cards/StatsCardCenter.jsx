import React from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import { LayoutGrid, PieChart } from "lucide-react";
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import Pagination from "../Pagination";

// Register Chart.JS components
ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
);

export default function StatsCardCenter({ dataJenisUsaha }) {
    // DATA STATIS PLAYGROUND
    return (
        <div className="bg-blue-50 rounded-[1.5rem] border-2 border-slate-300 transition-all shadow-2xl overflow-hidden w-full max-w-[380px] flex flex-col hover:-translate-y-2">
            <div className="p-5 flex-1">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 border-blue-950 border-2 rounded-lg">
                        <LayoutGrid className="text-blue-950" size={18} />
                    </div>
                    <h3 className="text-base font-extrabold text-blue-950 uppercase tracking-wider">
                        Sektor Usaha Terbanyak
                    </h3>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                    Jenis Usaha Koperasi Merah Putih
                </p>

                <div className="space-y-4 text-xs">
                    {dataJenisUsaha.data.map((item, index) => (
                        <div key={index} className="flex flex-col">
                            <div className="flex justify-between mb-1 uppercase font-semibold text-gray-700">
                                <span>{item.nama}</span>
                                <span className="text-slate-600">
                                    {item.jumlah} KMP ({item.persen} %)
                                </span>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full bg-slate-300 rounded-full h-2.5">
                                <div
                                    className={`  bg-blue-900 h-2.5 rounded-full transition-all duration-500`}
                                    style={{
                                        width: `${item.persen * 1}%`,
                                    }} // Dikali 10 biar kelihatan panjang dikit buat demo
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                <Pagination links={dataJenisUsaha.links}></Pagination>
            </div>
        </div>
    );
}
