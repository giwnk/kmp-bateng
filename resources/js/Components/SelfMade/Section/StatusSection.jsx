import Dropdown from "../Dropdown";
import TextInput from "../TextInput";
import Checkbox from "../Checkbox";
import { Activity } from "lucide-react";

export default function ({
    data,
    setData,
    errors,
    kecamatanOpt,
    desaOptions,
}) {
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border w-full border-gray-100 h-full">
            <h2 className="text-lg font-bold text-blue-950 mb-4 border-b flex gap-2 pb-2">
                <Activity></Activity> Status
            </h2>

            <div className="flex justify-around ">
                <Checkbox
                    label={"Status Operasional (Aktif)"}
                    name={"status_operasional"}
                    key={"status_operasional"}
                    checked={data.status_operasional}
                    onChange={(e) =>
                        setData("status_operasional", e.target.checked)
                    }
                ></Checkbox>
                <Checkbox
                    label={"Status Pelatihan (Sudah)"}
                    name={"status_pelatihan"}
                    key={"status_pelatihan"}
                    checked={data.status_pelatihan}
                    onChange={(e) =>
                        setData("status_pelatihan", e.target.checked)
                    }
                ></Checkbox>
                <Checkbox
                    label={"Status Sertifikat (Punya)"}
                    name={"status_sertifikat"}
                    key={"status_sertifikat"}
                    checked={data.status_sertifikat}
                    onChange={(e) =>
                        setData("status_sertifikat", e.target.checked)
                    }
                ></Checkbox>
            </div>
        </div>
    );
}
