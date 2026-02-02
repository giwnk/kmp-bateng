import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Menu, X, LogIn } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Efek untuk mengubah opacity saat scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "#home" },
        { name: "Statistik", href: "#statistik" },
        { name: "Sebaran", href: "#sebaran" },
        { name: "Kontak", href: "#kontak" },
    ];

    return (
        <header
            className={`fixed top-4 w-full z-50 px-4 transition-all duration-300 ${
                scrolled ? "top-2" : "top-4"
            }`}
        >
            <nav
                className={`mx-auto max-w-6xl bg-blue/80 backdrop-blur-xl border border-blue/20 shadow-lg rounded-full px-6 py-5 transition-all ${
                    scrolled ? "shadow-xl border-gray-100" : ""
                }`}
            >
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-white font-black text-xs">
                                KMP
                            </span>
                        </div>
                        <span className="font-black text-gray-900 tracking-tighter text-xl uppercase hidden sm:block">
                            KMP-BATENG
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-base font-bold text-blue-900 hover:text-white hover:scale-105 hover:bg-blue-900 py-1 px-3 flex items-center justify-center rounded-full transition-all uppercase tracking-widest cursor-pointer"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Login Button & Mobile Toggle */}
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("login")}
                            className="hidden sm:flex items-center gap-2 hover:scale-105 transition-all bg-gray-900 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-900 shadow-md active:scale-95"
                        >
                            <LogIn size={14} />
                            Login
                        </Link>

                        <button
                            className="md:hidden p-2 text-gray-600"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 mt-4 p-4 bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="text-sm font-bold text-gray-500 p-2 hover:text-red-600"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href={route("login")}
                            className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-2xl text-xs font-black uppercase"
                        >
                            Login Ke Sistem
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
}
