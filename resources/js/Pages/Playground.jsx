import React, { useEffect, useState } from "react";
import SidebarAdmin from "@/Components/SelfMade/SidebarAdmin";
import SidebarUsers from "@/Components/SelfMade/SidebarUsers";
import {
    ChevronLeft,
    ChevronRight,
    Dot,
    IdCard,
    MapPin,
    User,
    Users,
} from "lucide-react";
import KoperasiCard from "@/Components/SelfMade/Cards/KoperasiCard";
import FormCreateKoperasi from "@/Components/SelfMade/FormCreateKoperasi";
import TextInput from "@/Components/SelfMade/TextInput";
import Dropdown from "@/Components/SelfMade/Dropdown";
import Checkbox from "@/Components/SelfMade/Checkbox";
import IdentityCard from "@/Components/SelfMade/Section/IdentitySection";
import { useForm } from "@inertiajs/react";
import MapSection from "@/Components/SelfMade/Section/MapSection";
import axios from "axios";
import StatsCardLeft from "@/Components/SelfMade/Cards/StatsCardLeft";
import StatsCardCenter from "@/Components/SelfMade/Cards/StatsCardCenter";
import StatsCardRight from "@/Components/SelfMade/Cards/StatsCardRight";

export default function Playground() {
    return (
        <div className="flex justify-center w-screen h-screen items-center">
            <div className="flex justify-center items-center">
                <div className="grid grid-cols-3 gap-10 w-full px-6">
                    <StatsCardLeft/>
                    <StatsCardCenter/>
                    <StatsCardRight/>
                </div>
            </div>
        </div>
    );
}
