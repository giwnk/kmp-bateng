export default function JenisUsahaSection({koperasi}){
    return (
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
            <div className="px-6 py-4 border-b bg-blue-50">
                <h3 className="font-bold text-blue-800">🏷️ Jenis Usaha</h3>
            </div>
            <div className="p-6">
                <div className="flex flex-wrap gap-2">
                    {koperasi.jenis_usahas &&
                    koperasi.jenis_usahas.length > 0 ? (
                        koperasi.jenis_usahas.map((ju) => (
                            <span
                                key={ju.id}
                                className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-sm font-medium rounded-lg shadow-sm"
                            >
                                {ju.nama}
                            </span>
                        ))
                    ) : (
                        <p className="text-gray-400 italic text-sm">
                            Belum ada jenis usaha.
                        </p>
                    )}
                </div>
                <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                    Koperasi ini menjalankan unit usaha sesuai dengan KBLI yang
                    terdaftar pada sistem OSS.
                </p>
            </div>
        </div>
    );
}
