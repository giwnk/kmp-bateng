import React from "react";

export default function SelectInput({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder = "-- Pilih Salah Satu --",
    className = "",
    error,
    disabled,
    optionValue = "id",
    optionLabel = "nama",
    ...props
}) {
    return (
        <div className={`flex flex-col ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="mb-1 text-sm font-medium text-blue-950"
                >
                    {label}
                </label>
            )}

            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`
                    w-full border shadow-sm transition-all duration-200
                     focus:ring-blue-900 focus:border-blue-900 rounded-3xl outline-none
                    bg-white cursor-pointer
                    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
                    ${
                        error
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : "border-gray-300 border-2"
                    }
                `}
                {...props}
            >
                {/* Opsi Default (Placeholder) */}
                <option value="" disabled className="text-gray-300 text-sm">
                    {placeholder}
                </option>

                {/* Looping Data */}
                {options.map((option, index) =>
                    // Cek apakah opsi berupa string biasa atau object
                    typeof option === "object" ? (
                        <option key={index} value={option.id}>
                            {" "}
                            {/* Kirim 'id' ke Backend */}
                            {option.nama} {/* Tampilkan 'nama' ke User */}
                        </option>
                    ) : (
                        // Fallback kalau opsinya cuma string biasa
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ),
                )}
            </select>

            {error && (
                <p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1">
                    ⚠️ {error}
                </p>
            )}
        </div>
    );
}
