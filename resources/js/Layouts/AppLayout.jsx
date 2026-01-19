import React from "react";
 // Pastikan file Navbar.jsx sudah ada di folder Components

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
          
            {/* 2. Konten Utama (Berubah-ubah sesuai halaman) */}
            <main className="flex-grow">{children}</main>

            {/* 3. Footer (Kaki Website) */}
            <footer className="bg-slate-900 text-slate-400 py-8 mt-auto border-t border-slate-800 text-center text-sm">
                <div className="container mx-auto px-6">
                    <p className="font-semibold text-slate-200">
                        &copy; {new Date().getFullYear()} Dinas Koperasi & UKM
                    </p>
                    <p className="mt-1 text-xs">Kabupaten Bangka Tengah</p>
                </div>
            </footer>
        </div>
    );
}
