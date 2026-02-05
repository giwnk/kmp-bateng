import React, { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Daftar 3 foto slide
    const slides = [
        {
            url: "/images/hero-1.jpg", // Ganti dengan path foto kamu
            title: "Pengembangan Ekonomi Rakyat",
            desc: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua.",
        },
        {
            url: "/images/hero-2.jpg",
            title: "Digitalisasi Koperasi Modern",
            desc: "lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua.",
        },
        {
            url: "/images/hero-3.jpg",
            title: "Sinergi Membangun Daerah",
            desc: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua.",
        },
    ];

    // Logic Slide Otomatis
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) =>
                prev === slides.length - 1 ? 0 : prev + 1,
            );
        }, 5000); // Ganti slide setiap 5 detik
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-4 md:p-8 rounded-[3rem] shadow-xl border border-gray-50">
                {/* --- KIRI: TEKS --- */}
                <div className="lg:col-span-5 space-y-6 px-4 py-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-950 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-900"></span>
                        </span>
                        Sistem Dashboard Koperasi Merah Putih
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tighter">
                        Selamat Datang di{" "}
                        <span className="text-blue-950">KMP-BATENG</span>
                    </h1>

                    <p className="text-gray-500 text-lg leading-relaxed font-medium">
                        {slides[currentSlide].desc}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <a href="#statistik" className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-900 transition-all shadow-lg flex items-center gap-2 group">
                            Lihat Statistik
                            <ArrowRight
                                size={16}
                                className="group-hover:translate-x-1 transition-transform"
                            />
                        </a>

                    </div>
                </div>

                {/* --- KANAN: AUTO SLIDER --- */}
                <div className="lg:col-span-7 relative group">
                    <div className="relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden rounded-[2.5rem] shadow-2xl">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                                    index === currentSlide
                                        ? "opacity-100 scale-100"
                                        : "opacity-0 scale-110"
                                }`}
                            >
                                <img
                                    src={slide.url}
                                    alt={slide.title}
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlay Gradasi Biar Mewah */}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>

                                {/* Label di dalam Gambar */}
                                <div className="absolute bottom-8 left-8 right-8">
                                    <h3 className="text-white font-bold text-xl drop-shadow-md">
                                        {slide.title}
                                    </h3>
                                </div>
                            </div>
                        ))}

                        {/* Indikator Dots */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    className={`h-1.5 rounded-full transition-all ${
                                        i === currentSlide
                                            ? "w-8 bg-blue-900"
                                            : "w-2 bg-white/50"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
