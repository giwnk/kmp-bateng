export default function KetuaCard({koperasi}){
    return(
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Ketua+Kop" alt="Ketua" />
            </div>
            <h4 className="font-bold text-gray-800">
                {koperasi.ketua?.name || "Belum Diisi"}
            </h4>
            <p className="text-sm text-blue-600 font-medium">Ketua</p>
        </div>
    )
}
