import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Building2, Users, CheckCircle2, XCircle, Map as MapIcon, ArrowUpRight, Activity, FileText } from 'lucide-react';
import Table from '@/Components/SelfMade/Table';

// --- IMPORT CHART.JS ---
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Registrasi komponen Chart.js yang dibutuhkan
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard({ auth, data }) {

    // Konfigurasi Data Chart.js
    const chartData = {
        labels: ['Aktif', 'Non-Aktif'],
        datasets: [
            {
                label: 'Jumlah Koperasi',
                data: [data.koperasi_aktif, data.koperasi_nonaktif],
                backgroundColor: ['#10b981', '#ef4444'], // Hijau & Merah
                hoverBackgroundColor: ['#059669', '#dc2626'],
                borderWidth: 0,
                borderRadius: 0, // Membuat potongan doughnut agak rounded
                cutout: '70%', // Membuat lubang tengah lebih besar (kesan modern)
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: { size: 10, weight: "bold" },
                },
            },
            // --- FIX BUG OVERLAP TOOLTIP ---
            tooltip: {
                backgroundColor: "rgba(17, 24, 39, 0.9)", // Warna gelap modern
                padding: 12,
                cornerRadius: 10,
                displayColors: false, // Hilangkan kotak warna kecil agar lebih clean
                bodyFont: { size: 12, weight: "bold" },
                // Memindahkan tooltip agar tidak menempel di tengah
                position: "nearest",
                yAlign: "bottom",
            },
        },
        // Agar mouse tetap bisa menembus teks tengah ke arah chart
        interaction: {
            mode: "nearest",
            intersect: true,
        },
    };

    const columnsKoperasiBaru = [
        {
            header: "Koperasi",
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-xs">{item.nama}</span>
                    <span className="text-[10px] text-gray-400 uppercase leading-none">{item.nomor_induk || 'Tanpa NIK'}</span>
                </div>
            )
        },
        {
            header: "Status",
            className: "text-right",
            render: (item) => (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${item.status_operasional ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {item.status_operasional ? 'Aktif' : 'Mati'}
                </span>
            )
        }
    ];

    const columnsLaporanTerbaru = [
        {
            header: "Koperasi",
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-xs">
                        {item.koperasi?.nama}
                    </span>
                    <span className="text-[9px] text-gray-400 uppercase tracking-tighter">
                        Periode: {item.bulan} {item.tahun}
                    </span>
                </div>
            ),
        },
        {
            header: "Tgl Kirim",
            render: (item) => (
                <span className="text-[10px] font-medium text-gray-500">
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                </span>
            ),
        },
        {
            header: "Aksi",
            className: "text-right",
            render: (item) => (
                <Link
                    href={route("admin.laporan-bulanan.index")} // Arahkan ke halaman validasi utama
                    className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all inline-flex"
                >
                    <ArrowUpRight size={14} />
                </Link>
            ),
        },
    ];

    return (
        <AdminLayout user={auth.user}>
            <Head title="Dashboard Admin" />

            <div className="mt-2">
                {/* Header Section */}
                <div className="">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Dashboard Admin Koperasi Merah Putih
                    </h1>
                </div>

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="Total"
                        value={data.total_koperasi}
                        icon={<Building2 />}
                        color="blue"
                    />
                    <StatCard
                        title="Aktif"
                        value={data.koperasi_aktif}
                        icon={<CheckCircle2 />}
                        color="emerald"
                    />
                    <StatCard
                        title="Non-Aktif"
                        value={data.koperasi_nonaktif}
                        icon={<XCircle />}
                        color="red"
                    />
                    <StatCard
                        title="Users"
                        value={data.total_user}
                        icon={<Users />}
                        color="amber"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols- lg:grid-cols-12 gap-8">
                    {/* AREA CHART.JS (Doughnut) */}
                    <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col h-[400px]">
                        <h3 className="font-black text-gray-900 uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
                            <Activity size={14} className="text-red-600" />{" "}
                            Rasio Operasional
                        </h3>
                        <div className="flex-1 relative">
                            {/* Komponen Doughnut Chart.js */}
                            <Doughnut data={chartData} options={chartOptions} />

                            {/* Angka Persentase di Tengah Lubang (Variasi Desain) */}
                            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                <span className="text-2xl font-black text-gray-800">
                                    {Math.round(
                                        (data.koperasi_aktif /
                                            data.total_koperasi) *
                                            100,
                                    )}
                                    %
                                </span>
                                <span className="text-[8px] font-bold text-gray-400 uppercase">
                                    Aktif
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Monitoring Tabel */}
                    <div className="grid grid-cols-2 lg:col-span-8 lg:grid-cols-2 gap-8 mt-4">
                        {/* Tabel Koperasi Baru (Sudah ada) */}
                        <div className="bg-white rounded-[2.5rem] gap-2 border lg:col-span-3 p-6 border-gray-100 shadow-sm overflow-hidden flex flex-col h-fit">
                            <div className=" border-b border-gray-50 flex justify-between items-center">
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-[10px] flex items-center gap-2">
                                    <Building2
                                        size={14}
                                        className="text-blue-900"
                                    />{" "}
                                    Koperasi Baru
                                </h3>
                            </div>
                            <div className="flex-1 overflow-auto">
                                <Table
                                    columns={columnsKoperasiBaru}
                                    items={{ data: data.koperasi_baru }}
                                />
                            </div>
                        </div>

                        {/* TABEL LAPORAN TERBARU (BARU DITAMBAHKAN) */}
                        <div className="bg-white rounded-[2.5rem] gap-2 border p-6 lg:col-span-3 border-gray-100 shadow-sm overflow-hidden flex flex-col h-fit">
                            <div className=" border-b border-gray-50 flex justify-between items-center">
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-[10px] flex items-center gap-2">
                                    <FileText
                                        size={14}
                                        className="text-red-600"
                                    />{" "}
                                    Laporan Masuk
                                </h3>
                                <div className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[9px] font-black">
                                    {data.laporan_terbaru.length} PERLU VALIDASI
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto">
                                {/* Menggunakan data.laporan_terbaru dari BE */}
                                <Table
                                    columns={columnsLaporanTerbaru}
                                    items={{ data: data.laporan_terbaru }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function StatCard({ title, value, icon, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
        red: "bg-red-50 text-red-600",
        amber: "bg-amber-50 text-amber-600",
    };
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className={`p-3 rounded-2xl w-fit mb-4 ${colors[color]}`}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
            <p className="text-3xl font-black text-gray-900 tracking-tighter">{value.toLocaleString()}</p>
        </div>
    );
}
