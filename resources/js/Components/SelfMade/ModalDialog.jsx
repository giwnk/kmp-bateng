import React, { useEffect } from "react";

export default function ModalDialog({
    children,
    show = false,
    maxWidth = "2xl",
    closeable = true,
    onClose = () => {},
}) {
    // 1. Close on ESC Key
    useEffect(() => {
        const closeOnEscapeKey = (e) => {
            if (e.key === "Escape" && closeable) {
                onClose();
            }
        };

        document.addEventListener("keydown", closeOnEscapeKey);
        return () => document.removeEventListener("keydown", closeOnEscapeKey);
    }, [closeable, onClose]);

    // 2. Lock Body Scroll when Open
    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [show]);

    // 3. Define Width Classes
    const maxWidthClass = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
        "3xl": "sm:max-w-3xl",
        full: "sm:max-w-full m-4",
    }[maxWidth];

    if (!show) return null;

    return (
        // BACKDROP (Overlay Gelap)
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-0 transition-all">
            {/* Background Gelap (Klik sini bisa close) */}
            <div
                className="fixed inset-0 transform transition-all"
                onClick={closeable ? onClose : undefined}
            >
                <div className="absolute inset-0 bg-gray-900 opacity-75" />
            </div>

            {/* MODAL CARD (Konten Utama) */}
            <div
                className={`bg-white rounded-xl overflow-hidden shadow-xl transform transition-all sm:w-full ${maxWidthClass} relative z-10`}
            >
                {children}
            </div>
        </div>
    );
}
