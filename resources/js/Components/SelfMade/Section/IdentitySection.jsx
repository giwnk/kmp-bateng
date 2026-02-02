import { FileSpreadsheet } from "lucide-react";
import TextInput from "../TextInput";
import MultiSelect from "../MultiSelect";

export default function IdentitySection({ data, setData, errors, jenisUsahaOpt }) {
    console.log('ISI data child', data)
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h2 className="text-lg font-bold text-blue-950 mb-4 border-b flex gap-2 pb-2">
                <FileSpreadsheet /> Identitas & Legalitas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-2">
                    <TextInput
                        name="nama"
                        label={"Nama Koperasi"}
                        value={data.nama}
                        onChange={(e) => setData("nama", e.target.value)}
                        error={errors.nama}
                    />
                </div>
                <TextInput
                    label="Nomor Induk (NIK)"
                    name="nomor_induk"
                    value={data.nomor_induk}
                    onChange={(e) => setData("nomor_induk", e.target.value)}
                    error={errors.nomor_induk}
                />

                <MultiSelect
                    label="Jenis Usaha (Boleh lebih dari satu)"
                    placeholder="-- Pilih Jenis Usaha --"
                    options={jenisUsahaOpt} // Data dari DB
                    value={data.jenis_usaha_ids} // Array ID
                    // Update State Array
                    onChange={(newArray) =>
                        setData("jenis_usaha_ids", newArray)
                    }
                    error={errors.jenis_usaha_ids}
                />

                <TextInput
                    label="Nomor AHU"
                    name="nomor_ahu"
                    value={data.nomor_ahu}
                    onChange={(e) => setData("nomor_ahu", e.target.value)}
                    error={errors.nomor_ahu}
                />

                <TextInput
                    type="date"
                    label="Tanggal AHU"
                    name="tanggal_ahu"
                    value={data.tanggal_ahu}
                    onChange={(e) => setData("tanggal_ahu", e.target.value)}
                    error={errors.tanggal_ahu}
                />

                <TextInput
                    type="date"
                    label="Tanggal Berdiri"
                    name="tanggal_berdiri"
                    value={data.tanggal_berdiri}
                    onChange={(e) => setData("tanggal_berdiri", e.target.value)}
                    error={errors.tanggal_berdiri}
                />

                <TextInput
                    type="number"
                    label="Tahun Pembentukan"
                    name="tahun_pembentukan"
                    value={data.tahun_pembentukan}
                    onChange={(e) => setData("tahun_pembentukan", e.target.value)}
                    error={errors.tahun_pembentukan}
                />
            </div>
        </div>
    );
}
