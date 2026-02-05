import React from "react";
import { Link } from "@inertiajs/react";
import {
    Mail,
    Phone,
    MapPin,
    Instagram,
    Facebook,
    Globe,
    Send,
} from "lucide-react";

export default function ContactFooter() {
    return (
        <footer id="kontak" className="scroll-mt-10 mt-10 mb-10 px-4">
            <div className="max-w-7xl mx-auto bg-gray-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                {/* Dekorasi Aksen */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                    {/* --- KOLOM 1: BRANDING --- */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-black text-xs">
                                KMP
                            </div>
                            <span className="font-bold text-xl tracking-tighter uppercase">
                                KMP<span className="text-red-500"> Bangka Tengah</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed font-medium pr-4">
                            Sistem Dashboard Koperasi Merah Putih Kabupaten
                            Bangka Tengah. Mewujudkan data koperasi yang akurat
                            dan transparan.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <a
                                href="#"
                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 transition-all"
                            >
                                <Instagram size={14} />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 transition-all"
                            >
                                <Facebook size={14} />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 transition-all"
                            >
                                <Globe size={14} />
                            </a>
                        </div>
                    </div>

                    {/* --- KOLOM 2: QUICK CONTACT --- */}
                    <div className="grid grid-cols-1 gap-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-2">
                            Informasi Kontak
                        </h4>

                        <div className="flex items-center gap-4 group">
                            <div className="p-2 bg-white/5 rounded-xl group-hover:bg-red-600/20 transition-all">
                                <MapPin size={16} className="text-red-500" />
                            </div>
                            <span className="text-xs text-gray-300 font-medium">
                                Koba, Bangka Tengah, Prov. Bangka Belitung
                            </span>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="p-2 bg-white/5 rounded-xl group-hover:bg-red-600/20 transition-all">
                                <Phone size={16} className="text-red-500" />
                            </div>
                            <span className="text-xs text-gray-300 font-medium">
                                +62 812-3456-7890
                            </span>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="p-2 bg-white/5 rounded-xl group-hover:bg-red-600/20 transition-all">
                                <Mail size={16} className="text-red-500" />
                            </div>
                            <span className="text-xs text-gray-300 font-medium">
                                email@bangkatengahkab.go.id
                            </span>
                        </div>
                    </div>

                    {/* --- KOLOM 3: MINI FORM / NEWSLETTER --- */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
                            Pesan Cepat
                        </h4>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Tulis pesan singkat..."
                                className="w-full bg-white/5 border-none rounded-2xl py-4 pl-6 pr-14 text-xs font-semibold focus:ring-2 focus:ring-red-600/50 transition-all"
                            />
                            <button className="absolute right-2 top-2 bottom-2 px-3 bg-red-600 rounded-xl hover:bg-red-700 transition-all flex items-center justify-center">
                                <Send size={14} />
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-500 italic px-2">
                            *Pesan akan langsung terkirim ke admin sistem.
                        </p>
                    </div>
                </div>

                {/* --- BOTTOM BAR --- */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                        © 2024 Dinas Komunikasi, Informatika dan Statistika Kabupaten Bangka Tengah
                    </p>
                    <div className="flex gap-6">
                        <a
                            href="#"
                            className="text-[10px] font-bold text-gray-600 hover:text-white uppercase tracking-widest"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            className="text-[10px] font-bold text-gray-600 hover:text-white uppercase tracking-widest"
                        >
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
