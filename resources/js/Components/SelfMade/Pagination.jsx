import { Link } from "@inertiajs/react";
export default function Pagination({ links }) {
    return (
        <div className="flex flex-wrap justify-center gap-1 mt-8">
            {links?.map((link, index) => {
                // Kalau URL-nya null (biasanya tombol Prev/Next yg mentok), jadiin span aja
                if (link.url === null) {
                    return (
                        <div
                            key={index}
                            className="px-4 py-2 text-sm text-gray-400 border rounded-lg bg-gray-50"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                // Kalau Link Aktif (Halaman sekarang)
                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                            link.active
                                ? "bg-blue-900 text-white border-indigo-600" // Style Aktif
                                : "bg-white text-blue-900 font-medium hover:bg-blue-950 hover:text-white border-blue-900" // Style Biasa
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}
