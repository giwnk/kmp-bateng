import { CheckCircleIcon } from "lucide-react";

export default function StatusKepatuhanSection({koperasi}){
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-700 mb-4">Status Kepatuhan</h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                        Sertifikat NIK
                    </span>
                    {koperasi.status_sertifikat ? (
                        <CheckCircleIcon className="text-emerald-500" />
                    ) : (
                        <span className="text-xs text-red-500 font-bold">
                            BELUM
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                        Pelatihan Pengurus
                    </span>
                    {koperasi.status_pelatihan ? (
                        <CheckCircleIcon className="text-emerald-500" />
                    ) : (
                        <span className="text-xs text-red-500 font-bold">
                            BELUM
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
