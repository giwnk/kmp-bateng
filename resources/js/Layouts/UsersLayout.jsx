import SidebarUsers from "@/Components/SelfMade/SidebarAdmin";
import { Banknote, FileBarChart2, Handshake, LayoutDashboard, Settings, Users, UserStarIcon } from "lucide-react";

export default function UsersLayout({ auth, user, header, children }) {
    const usersMenu = [
        {
            label: "Dashboard",
            route: route("users.dashboard"),
            active: "users.dashboard",
            icon: <LayoutDashboard size={20} />,
        },
        {
            label: "Profil Koperasi",
            route: route("users.koperasi.show", auth.user.koperasi_id),
            active: "users.koperasi.*",
            icon: <Handshake size={20} />,
        },
        {
            label: "Manajemen Anggota",
            route: route("users.anggota.index", auth.user.koperasi_id),
            active: "users.anggota.*",
            icon: <Users size={20} />,
        },
        {
            label: "Manajemen Pengurus",
            route: route("users.sdm.index", auth.user.koperasi_id),
            active: "users.sdm.*",
            icon: <UserStarIcon size={20} />,
        },
        {
            label: "Transaksi Keuangan",
            route: route("users.transaksi.index", auth.user.koperasi_id),
            active: "users.transaksi.*",
            icon: <Banknote size={20} />,
        },
        {
            label: "Laporan Bulanan",
            route: route("users.laporan.index", auth.user.koperasi_id),
            active: "users.laporan.*",
            icon: <FileBarChart2 size={20} />,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Panggil Sidebar, kasih menu Admin */}
            <SidebarUsers auth={user} menuItems={usersMenu} />

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
