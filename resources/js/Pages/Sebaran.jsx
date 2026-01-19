import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import MapSebaran from "@/Components/MapSebaran";

export default function Sebaran({ locations }) {
    return (
        <AppLayout>
            <Head title="Peta Sebaran Koperasi" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Peta Sebaran
                        </h1>
                        <p className="text-gray-500">
                            Lokasi Geografis Koperasi di Bangka Tengah
                        </p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border text-sm">
                        Total Titik:{" "}
                        <span className="font-bold text-blue-600">
                            {locations.length} Lokasi
                        </span>
                    </div>
                </div>

                {/* Area Peta */}
                <div className="bg-white p-2 rounded-xl shadow-sm">
                    <MapSebaran data={locations} />
                </div>

                {/* List Text di Bawah Peta (Opsional) */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {locations.slice(0, 6).map((loc, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition"
                        >
                            <h3 className="font-bold text-gray-800 text-sm truncate">
                                {loc.nama}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                                {loc.alamat}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
