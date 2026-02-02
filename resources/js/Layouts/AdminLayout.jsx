import React from "react";
import Sidebar from "@/Components/SelfMade/SidebarAdmin"; // Sesuaikan path sidebar kamu
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    Handshake,
    FileCheck,
    Map,
} from "lucide-react"; // Icon contoh

export default function AdminLayout({ user, header, children }) {
    // 📋 DAFTAR MENU KHUSUS ADMIN
    const adminMenu = [
        {
            label: "Dashboard",
            route: route("admin.dashboard"),
            active: "admin.dashboard",
            icon: <LayoutDashboard size={20} />,
        },
        {
            label: "Manajemen Wilayah",
            route: route("admin.wilayah.index"),
            active: "admin.wilayah.*",
            icon: <Map size={20} />,
        },
        {
            label: "Manajemen Koperasi",
            route: route("admin.koperasi.index"), // Ganti route('admin.koperasi.index') nanti
            active: "admin.koperasi.*",
            icon: <Handshake size={20} />,
        },
        {
            label: "Manajemen User",
            route: route("admin.users.index"),
            active: "admin.users.*",
            icon: <Users size={20} />,
        },
        {
            label: "Validasi Laporan",
            route: route("admin.laporan.index"),
            active: "admin.laporan.*",
            icon: <FileCheck size={20} />,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Panggil Sidebar, kasih menu Admin */}
            <Sidebar auth={user} menuItems={adminMenu} />

            {/* Konten Utama (Disebelah kanan Sidebar) */}
            <main className="ml-64 p-8 transition-all duration-300">
                {/* Header Kecil (Opsional) */}
                {header && (
                    <header className="mb-8">
                        <div className="max-w-7xl mx-auto">{header}</div>
                    </header>
                )}

                {/* Isi Halaman (Children) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
