import React from "react";
import { Head, Link } from "@inertiajs/react";
import StatCard from "@/Components/StatCard";
import Navbar from "@/Components/SelfMade/Navbar";
import MapSebaran from "@/Components/MapSebaran";
import Pagination from "@/Components/SelfMade/Pagination";
import StatsCardLeft from "@/Components/SelfMade/Cards/StatsCardLeft";
import StatsCardRight from "@/Components/SelfMade/Cards/StatsCardRight";
import StatsCardCenter from "@/Components/SelfMade/Cards/StatsCardCenter";
import Table from "@/Components/SelfMade/Table";
import HeroSection from "@/Components/SelfMade/Section/HeroSection";
import ContactSectionHome from "@/Components/SelfMade/Section/ContactFooter";
export default function Home({
    statsPotensi,
    statsJenisUsaha,
    statsSdm,
    mapMarkers,
    listKecamatan = [],
}) {
    const col = [
        { label: "#", accessor: "no", className: "w-10 text-center" },
        { label: "Kecamatan", accessor: "kecamatan" },
        { label: "Desa", accessor: "desa", className: "text-center" },
        { label: "Lurah", accessor: "kelurahan", className: "text-center" },
        {
            label: "Jml",
            accessor: "jumlah",
            className: "text-center font-bold",
        },
    ];
    const columns = [
        {
            header: "Kecamatan",
            render: (kec) => (
                <div className="flex items-center gap-3 font-semibold hover:text-blue-900 hover:underline transition-all">
                    <Link href={route("kecamatan.show", kec.id)}>
                        {kec.kecamatan}
                    </Link>
                </div>
            ),
        },
        {
            header: "Koperasi Desa",
            render: (kec) => (
                <div className="flex items-center font-semibold gap-3">
                    {kec.desa}
                </div>
            ),
        },
        {
            header: "Koperasi Kelurahan",
            render: (kec) => (
                <div className="flex items-center font-semibold gap-3">
                    {kec.kelurahan}
                </div>
            ),
        },
        {
            header: "Total",
            render: (kec) => (
                <div className="flex items-center font-semibold gap-3">
                    {kec.jumlah}
                </div>
            ),
        },
    ];
    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <Head title="Dashboard Statistik" />

            <Navbar />
            <main className="pt-15 px-6 lg:px-12 max-w-7xl scroll-smooth mx-auto">
                {/* Section hero */}
                <section id="#" className="scroll-mt-32 mt-20 flex-col">
                    <HeroSection></HeroSection>
                </section>
                {/* Section Statistik */}
                <section
                    id="statistik"
                    className="scroll-mt-20 mt-10 flex flex-col gap-4 bg-white p-6 shadow-xl border border-gray-100 rounded-[3rem]"
                >
                    <div className="flex justify-center items-center flex-col">
                        <h1 className="text-lg font-semibold text-blue-950">
                            Statistik Unit Koperasi
                        </h1>
                        <h3 className="text-base font-medium text-blue-950">
                            Kabupaten Bangka Tengah
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* === KARTU 1: POTENSI (BIRU) === */}
                        <StatsCardLeft
                            dataPotensi={statsPotensi}
                            dataSdm={statsSdm}
                        ></StatsCardLeft>

                        {/* === KARTU 2: JENIS USAHA (HIJAU) === */}
                        <StatsCardCenter
                            dataJenisUsaha={statsJenisUsaha}
                        ></StatsCardCenter>

                        {/* === KARTU 3: SDM KOPERASI (KUNING) === */}
                        <StatsCardRight
                            dataTren={statsPotensi}
                        ></StatsCardRight>
                    </div>
                </section>

                {/* Section Sebaran */}
                <section
                    id="sebaran"
                    className="scroll-mt-20 mt-10 flex flex-col gap-3 bg-white p-6 shadow-xl border border-gray-100 rounded-[3rem] "
                >
                    <div className="flex justify-center items-center flex-col">
                        <h1 className="text-lg font-semibold text-blue-950">
                            Peta Sebaran dan Tabel Wilayah
                        </h1>
                        <h3 className="text-base font-medium text-blue-950">
                            Kabupaten Bangka Tengah
                        </h3>
                    </div>
                    <MapSebaran data={mapMarkers} />
                    <Table
                        columns={columns}
                        items={{ data: listKecamatan }}
                    ></Table>
                </section>

                {/* Contact Section */}
                <section
                    id="kontak"
                    className="scroll-mt-10"
                >
                    <ContactSectionHome></ContactSectionHome>
                </section>
            </main>
        </div>
    );
}
