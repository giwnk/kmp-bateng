import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Wajib import CSS ini!
import L from "leaflet";

// --- FIX ICON MARKER YANG HILANG (Bug Klasik Leaflet di React) ---
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = new L.icon({
    iconUrl: "/images/home-marker-icon.svg",
    shadowUrl: iconShadow,
    iconSize: [38, 38],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;
// ------------------------------------------------------------------

export default function MapSebaran({ data }) {
    // Koordinat Tengah Bangka Belitung (Kira-kira di sini)
    const centerPosition = [-2.5, 106.3];

    return (
        <div className="rounded-[2.5rem] overflow-hidden shadow-lg border-2 border-slate-400 z-0">
            <MapContainer
                center={centerPosition}
                zoom={9}
                scrollWheelZoom={false}
                style={{ height: "500px", width: "100%", zIndex: 0 }}
            >
                {/* Skin Peta (Pake OpenStreetMap Gratisan) */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Looping Marker Koperasi */}
                {data.map((item, index) => (
                    <Marker
                        key={index}
                        position={[item.latitude, item.longitude]}
                    >
                        <Popup >
                            <div className="text-center">
                                <h3 className="font-bold text-sm text-blue-900">
                                    {item.nama}
                                </h3>
                                <p className="text-xs text-gray-600 mt-1">
                                    {item.alamat}
                                </p>
                                <span
                                    className={`text-[10px] px-2 py-0.5 rounded-full mt-2 inline-block text-white ${
                                        item.status_operasional
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                    }`}
                                >
                                    {item.status_operasional
                                        ? "Aktif"
                                        : "Non-Aktif"}
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
