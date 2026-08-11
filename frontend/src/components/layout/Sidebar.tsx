import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Calendar,
    Clock,
    Settings,
    GraduationCap,
    ClipboardList,
    Layers,
} from "lucide-react";

import { cn } from "../../lib/utils";
import { useAuthStore } from "../../context/useAuthStore";

const adminLinks = [
    {
        to: "/admin/dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
    },
    {
        to: "/admin/teachers",
        icon: Users,
        label: "Teachers",
    },
    {
        to: "/admin/students",
        icon: GraduationCap,
        label: "Students",
    },
    {
        to: "/admin/departments",
        icon: BookOpen,
        label: "Departments",
    },
    {
        to: "/admin/subjects",
        icon: BookOpen,
        label: "Subjects",
    },
    {
        to: "/admin/semesters",
        icon: Layers,
        label: "Semesters",
    },
    {
        to: "/admin/class-sections",
        icon: Users,
        label: "Class Sections",
    },
    {
        to: "/admin/academic-sessions",
        icon: Calendar,
        label: "Academic Sessions",
    },
    {
        to: "/admin/assignments",
        icon: ClipboardList,
        label: "Assignments",
    },
    {
        to: "/admin/users",
        icon: Settings,
        label: "Users",
    },
];

const teacherLinks = [
    {
        to: "/teacher/dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
    },
    {
        to: "/teacher/assignments",
        icon: ClipboardList,
        label: "My Assignments",
    },
    {
        to: "/teacher/history",
        icon: Calendar,
        label: "Attendance History",
    },
    {
        to: "/teacher/profile",
        icon: Settings,
        label: "Profile",
    },
];

const studentLinks = [
    {
        to: "/student/dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
    },
    {
        to: "/student/attendance",
        icon: Clock,
        label: "Attendance Details",
    },
    {
        to: "/student/profile",
        icon: Settings,
        label: "Profile",
    },
];

export function Sidebar() {
    const { user } = useAuthStore();
    const location = useLocation();

    let links = adminLinks;

    if (user?.role === "TEACHER") {
        links = teacherLinks;
    }

    if (user?.role === "STUDENT") {
        links = studentLinks;
    }

    return (
        <aside className="w-64 h-full bg-[#111827] flex flex-col">

            {/* Logo */}
            <div className="h-20 flex items-center px-6 border-b border-white/10">

                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                        A
                    </span>
                </div>

                <div className="ml-3">
                    <p className="text-white font-semibold">
                        Tracker
                    </p>

                    <p className="text-xs text-gray-400">
                        Attendance ERP
                    </p>
                </div>

            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 no-scrollbar">

                {links.map((link) => {

                    const Icon = link.icon;

                    const isActive =
                        location.pathname.startsWith(link.to);

                    return (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",

                                isActive
                                    ? "bg-white/10 text-white shadow-sm backdrop-blur-md"
                                    : "text-gray-400 hover:text-gray-100 hover:bg-white/5"
                            )}
                        >

                            <Icon
                                size={20}
                                className={cn(
                                    "transition-colors",
                                    isActive
                                        ? "text-primary"
                                        : "text-gray-400"
                                )}
                            />

                            {link.label}

                        </NavLink>
                    );
                })}

            </nav>

            {/* User section */}
            <div className="p-4 border-t border-white/10">

                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">

                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-medium text-white">
                        {user?.role?.charAt(0) ?? "U"}
                    </div>

                    <div className="flex-1 min-w-0">

                        <p className="text-sm font-medium text-white truncate">
                            {user?.role ?? "User"}
                        </p>

                        <p className="text-xs text-gray-400 truncate">
                            {user?.userId ?? ""}
                        </p>

                    </div>

                </div>

            </div>

        </aside>
    );
}