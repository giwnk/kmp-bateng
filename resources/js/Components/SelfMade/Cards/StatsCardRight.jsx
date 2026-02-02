import React from "react";
import { Bar } from "react-chartjs-2";
import { BarChart3, Activity, CheckCircle2, AlertCircle } from "lucide-react";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

// Register Chart.JS components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function StatsCardRight({dataTren}) {
    // DATA STATIS PLAYGROUND
    // const trendData = {
    //     labels: ["2020", "2021", "2022", "2023", "2024"],
    //     values: [12, 18, 15, 25, 30],
    // };

    const statusData = {
        aktif: 380,
        non_aktif: 55,
        total: 435,
    };

    // Konfigurasi Bar Vertikal (Tren)
    const barChartData = {
        labels: dataTren.tren_pembentukan.labels,
        datasets: [
            {
                label: "Pembentukan",
                data: dataTren.tren_pembentukan.values,
                backgroundColor: "#1e40af", // Merah agar konsisten
                borderRadius: 6,
                barThickness: 20,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 }, color: "#172554" },
            },
            y: {
                beginAtZero: true,
                grid: {
                    drawBorder: false,
                    color: "#f1f5f9",
                },
                ticks: { font: { size: 9 }, color: "#172554", stepSize: 10 },
            },
        },
    };

    return (
        <div className="bg-blue-50 rounded-[1.5rem] border-2 border-slate-300 transition-all hover:-translate-y-2 shadow-2xl overflow-hidden w-full max-w-[380px] flex flex-col">
            <div className="p-5 flex-1">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 border-blue-950 border-2 rounded-lg">
                        <BarChart3 className="text-blue-950" size={18} />
                    </div>
                    <h3 className="text-base font-extrabold text-blue-950 uppercase tracking-wider">
                        Tren Pembentukan
                    </h3>
                </div>

                {/* --- BAGIAN ATAS: VERTICAL BAR (TREN) --- */}
                <div className="h-44 mb-6">
                    <Bar data={barChartData} options={barOptions} />
                </div>

                {/* --- BAGIAN BAWAH: STATUS OPERASIONAL --- */}
                <div className="pt-5 border-t border-gray-50">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity size={14} className="text-blue-950" />
                        <h4 className="text-xs font-bold text-blue-950 uppercase tracking-widest">
                            Status Operasional
                        </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Aktif */}
                        <div className="p-3 bg-emerald-50 rounded-2xl border border-green-900">
                            <div className="flex items-center gap-1.5 mb-1">
                                <CheckCircle2
                                    size={12}
                                    className="text-green-900"
                                />
                                <span className="text-[9px] font-bold text-green-700 uppercase">
                                    Aktif
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-gray-800">
                                    {dataTren.status_koperasi.aktif}
                                </span>
                                <span className="text-[8px] text-slate-600 font-medium">
                                    Unit
                                </span>
                            </div>
                        </div>

                        {/* Non-Aktif */}
                        <div className="p-3 bg-red-100 rounded-2xl border border-rose-900">
                            <div className="flex items-center gap-1.5 mb-1">
                                <AlertCircle
                                    size={12}
                                    className="text-rose-600"
                                />
                                <span className="text-[9px] font-bold text-rose-700 uppercase">
                                    Non-Aktif
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-gray-800">
                                    {dataTren.status_koperasi.non_aktif}
                                </span>
                                <span className="text-[8px] text-slate-600 font-medium">
                                    Unit
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar Gabungan (Visual tambahan) */}
                    <div className="mt-4">
                        <div className="flex justify-between text-[8px] font-bold text-gray-400 uppercase mb-1 px-1">
                            <span>Rasio Kesehatan</span>
                            <span className="text-green-900">
                                {Math.round(
                                    (dataTren.status_koperasi.aktif /
                                        dataTren.status_koperasi.total) *
                                        100,
                                )}
                                % Sehat
                            </span>
                        </div>
                        <div className="w-full bg-red-500 h-1.5 rounded-full overflow-hidden flex">
                            <div
                                className="bg-green-700 h-full transition-all duration-1000"
                                style={{
                                    width: `${(dataTren.status_koperasi.aktif / dataTren.status_koperasi.total) * 100}%`,
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-900 px-5 py-3 flex justify-between items-center">
                <span className="text-[9px] text-gray-400">
                    Update Terakhir: Jan 2024
                </span>
                <span className="text-[9px] text-white font-bold tracking-tighter">
                    KMP-DASHBOARD
                </span>
            </div>
        </div>
    );
}
