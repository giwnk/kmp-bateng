import React from "react";
export default function StatCard({title, headerColor, children}) {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col h-full">
            <div className={`${headerColor} p-4 border-b border-gray-100`}>
                <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
            </div>
            <div className="p-6 flex-1">{children}</div>
        </div>
    );
}
