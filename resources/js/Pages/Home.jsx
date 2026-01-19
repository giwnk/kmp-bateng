import React from "react";
import { Head } from "@inertiajs/react";
import StatCard from "@/Components/StatCard";
import Navbar from "@/Components/Navbar"
export default function Home({ dataPotensi, dataJenisUsaha, dataSdm }) {
    return (


        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <Head title="Dashboard Statistik" />

            {/* --- LAYOUT GRID 3 KOLOM --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* === KARTU 1: POTENSI (BIRU) === */}
                <StatCard title="Potensi" headerColor="bg-blue-100">
                    <p className="text-sm text-gray-500 mb-4">
                        Potensi Koperasi Merah Putih Kabupaten Bangka Tengah
                    </p>

                    {/* Tabel Potensi */}
                    <table className="w-full text-sm mb-6">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left py-2 px-2">Unit</th>
                                <th className="text-right py-2 px-2">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="py-2 px-2">Desa</td>
                                <td className="text-right px-2 font-bold">
                                    {dataPotensi.desa}
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 px-2">Kelurahan</td>
                                <td className="text-right px-2 font-bold">
                                    {dataPotensi.kelurahan}
                                </td>
                            </tr>
                            <tr className="bg-gray-50 font-bold">
                                <td className="py-2 px-2">Total</td>
                                <td className="text-right px-2">
                                    {dataPotensi.total}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Grafik Batang History */}
                    <p className="text-xs text-gray-500 mb-2 mt-6">
                        Pembentukan Koperasi Merah Putih Pertahun
                    </p>
                    <div className="space-y-3">
                        {dataPotensi.history.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center text-xs"
                            >
                                <span className="w-20 font-bold">
                                    Tahun {item.tahun}
                                </span>
                                <div className="flex-1 mx-2">
                                    <div
                                        className="h-4 bg-blue-800 rounded"
                                        style={{ width: `${item.persen}%` }}
                                    ></div>
                                </div>
                                <div className="text-right w-20">
                                    <div className="font-bold">
                                        {item.jumlah} Kop
                                    </div>
                                    <div className="text-gray-400">
                                        ({item.persen}%)
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </StatCard>

                {/* === KARTU 2: JENIS USAHA (HIJAU) === */}
                <StatCard title="Jenis Usaha" headerColor="bg-green-100">
                    <p className="text-sm text-gray-500 mb-4">
                        Jenis Usaha Koperasi Merah Putih
                    </p>

                    <div className="space-y-4 text-xs">
                        {dataJenisUsaha.map((item, index) => (
                            <div key={index} className="flex flex-col">
                                <div className="flex justify-between mb-1 uppercase font-semibold text-gray-700">
                                    <span>{item.nama}</span>
                                    <span className="text-gray-500">
                                        {item.jumlah} KMP ({item.persen} %)
                                    </span>
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className={`${item.color} h-2.5 rounded-full transition-all duration-500`}
                                        style={{
                                            width: `${item.persen * 2}%`,
                                        }} // Dikali 10 biar kelihatan panjang dikit buat demo
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </StatCard>

                {/* === KARTU 3: SDM KOPERASI (KUNING) === */}
                <StatCard
                    title="SDM Koperasi"
                    headerColor="bg-yellow-100 text-yellow-800"
                >
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left py-2 px-2 w-10">#</th>
                                <th className="text-left py-2 px-2">
                                    Kategori
                                </th>
                                <th className="text-right py-2 px-2">Jumlah</th>
                                <th className="text-right py-2 px-2">(%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataSdm.map((item, index) => (
                                <tr
                                    key={index}
                                    className={`border-b ${
                                        item.kategori === "TOTAL"
                                            ? "font-bold bg-gray-50"
                                            : ""
                                    }`}
                                >
                                    <td className="py-3 px-2 text-gray-500">
                                        {item.kategori !== "TOTAL"
                                            ? index + 1
                                            : ""}
                                    </td>
                                    <td className="py-3 px-2">
                                        {item.kategori}
                                    </td>
                                    <td className="py-3 px-2 text-right">
                                        {item.jumlah}
                                    </td>
                                    <td className="py-3 px-2 text-right">
                                        {item.persen}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </StatCard>
            </div>
        </div>
    );
}
