import { AlertCircle } from "lucide-react";

export default function TextInput({
    type,
    label,
    name,
    error,
    value,
    className,
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

            <input
                type={type}
                key={name}
                id={name}
                name={name}
                value={value}
                className={`border-2 border-gray-300 rounded-3xl w-full text-base text-blue-950 font-normal px-6 ${error ? "focus:border-red-800" : "focus:ring-blue-900 focus:border-blue-900"}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-red-800 font-medium flex items-center gap-1">
                    <AlertCircle/> {error}
                </p>
            )}
        </div>
    );
}
