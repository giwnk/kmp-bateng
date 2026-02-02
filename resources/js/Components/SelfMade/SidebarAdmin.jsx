import { Link, router } from "@inertiajs/react";
// Import Icon dari Lucide
import {
    LayoutDashboard,
    Users,
    FileCheck,
    Settings,
    LogOut,
    Map,
    Handshake,
    Banknote,
    ChartColumnStacked,
    FileChartColumn,
} from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export default function SidebarUsers({ className, auth, menuItems }) {
    const MotionLink = motion(Link);
    const handleLogout = (e) => {
        e.preventDefault();

        Swal.fire({
            title: "Keluar Sistem?",
            text: "Anda harus login kembali untuk mengakses data.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444", // Warna merah
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, Logout!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                // Mengirimkan request POST ke route logout
                router.post(route("logout"));
            }
        });
    };
    return (
        <aside
            className={`w-64 h-screen bg-gray-100 border-r-2 border-slate-400 border-solid flex flex-col flex-shrink-0 fixed left-0 top-0 overflow-y-auto ${className}`}
        >
            {/* 1. Header Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <div className="flex items-center gap-2 text-red-700">
                    <span className="text-lg font-bold tracking-tight">
                        KMP BANGKA TENGAH
                    </span>
                </div>
            </div>

            {/* 2. Menu Items */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
                {menuItems.map((item, index) => (
                    <MotionLink
                        key={index}
                        href={item.route}
                        whileTap={{ scale: 0.85 }}
                        className={`w-full flex items-center px-4 py-3 text-sm font-semibold cursor-pointer rounded-lg transition-all duration-200 group
                            ${route().current(item.active) ? "bg-blue-900 text-gray-200 shadow-md shadow-blue-200" : "text-gray-600 hover:bg-slate-200 hover:text-blue-900"}`}
                    >
                        {item.icon}
                        <span className=" ml-2 font-semibold text-sm">{item.label}</span>
                    </MotionLink>
                ))}
            </nav>

            {/* 3. Footer Logout */}
            <div className="p-4 border-t border-gray-200">
                <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-semibold text-red-700 border-2 border-red-700 hover:bg-red-700 hover:text-white rounded-lg transition-colors" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Keluar Aplikasi</span>
                </button>
            </div>
        </aside>
    );
}
