import React from "react";
import Pagination from "./Pagination"; // 👈 1. Import Pagination Kamu
import { Grid2X2X } from "lucide-react";

export default function Table({ columns, items }) {
    return (
        <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-300 overflow-hidden">
            {/* --- BAGIAN TABEL (SCROLLABLE) --- */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    {/* Header */}
                    <thead className="bg-gray-50 border-b uppercase font-bold text-xs text-gray-600">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-4 ${col.className || ""}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="divide-y divide-gray-100">
                        {items.data.length > 0 ? (
                            items.data.map((item, rowIndex) => (
                                <tr
                                    key={item.id || rowIndex}
                                    className="hover:bg-gray-50 transition"
                                >
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`px-6 py-4 ${col.className || ""}`}
                                        >
                                            {/* Render Custom atau Text Biasa */}
                                            {col.render
                                                ? col.render(item)
                                                : col.accessor
                                                  ? item[col.accessor]
                                                  : "-"}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            /* Kalau Data Kosong */
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center py-10 text-gray-400"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <span><Grid2X2X size={40}/></span>
                                        <span>Data tidak ditemukan</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- BAGIAN FOOTER (PAGINATION) --- */}
            {/* Kita cek dulu, ada gak link-nya? (biar gak muncul kotak kosong kalau data cuma 1 page) */}
            {items.links && items.links.length > 3 && (
                <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                    {/* 👈 2. Panggil Component Pagination Disini */}
                    {/* Kita lempar props 'links' dari object items Laravel */}
                    <Pagination links={items.links} />
                </div>
            )}
        </div>
    );
}
