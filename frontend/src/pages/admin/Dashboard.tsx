import React from "react";
import {
    Users,
    GraduationCap,
    BookOpen,
    Layers,
    School,
    ClipboardList,
    Plus,
    Clock,
    UserPlus,
    Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { StatTile } from "../../components/ui/StatTile";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { getDashboardStats } from "../../api/dashboard";

export function AdminDashboard() {
    const navigate = useNavigate();

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["admin-dashboard"],
        queryFn: getDashboardStats,
    });

    const totalStudents = Array.isArray(data?.students)
        ? data.students.length
        : 0;

    const totalTeachers = Array.isArray(data?.teachers)
        ? data.teachers.length
        : 0;

    const totalDepartments = Array.isArray(data?.departments)
        ? data.departments.length
        : 0;

    const totalSubjects = Array.isArray(data?.subjects)
        ? data.subjects.length
        : 0;

    const totalSemesters = Array.isArray(data?.semesters)
        ? data.semesters.length
        : 0;

    const totalClassSections = Array.isArray(data?.classSections)
        ? data.classSections.length
        : 0;

    const totalAssignments = Array.isArray(data?.assignments)
        ? data.assignments.length
        : 0;

    if (isError) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-text">
                        Dashboard
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Welcome back. Here's what's happening today.
                    </p>
                </div>

                <Card>
                    <CardContent className="py-12">
                        <div className="text-center">
                            <p className="text-red-600 font-medium">
                                Failed to load dashboard data.
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                                Please check your backend connection and try
                                again.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-text">
                    Dashboard
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Welcome back. Here's what's happening today.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <StatTile
                    title="Total Teachers"
                    value={isLoading ? "..." : totalTeachers}
                    icon={Users}
                    iconClassName="bg-blue-100 text-blue-700"
                />

                <StatTile
                    title="Total Students"
                    value={isLoading ? "..." : totalStudents}
                    icon={GraduationCap}
                    iconClassName="bg-green-100 text-green-700"
                />

                <StatTile
                    title="Departments"
                    value={isLoading ? "..." : totalDepartments}
                    icon={Building2}
                    iconClassName="bg-purple-100 text-purple-700"
                />

                <StatTile
                    title="Subjects"
                    value={isLoading ? "..." : totalSubjects}
                    icon={BookOpen}
                    iconClassName="bg-orange-100 text-orange-700"
                />

                <StatTile
                    title="Semesters"
                    value={isLoading ? "..." : totalSemesters}
                    icon={Layers}
                    iconClassName="bg-indigo-100 text-indigo-700"
                />

                <StatTile
                    title="Class Sections"
                    value={isLoading ? "..." : totalClassSections}
                    icon={School}
                    iconClassName="bg-teal-100 text-teal-700"
                />

                <StatTile
                    title="Teacher Assignments"
                    value={isLoading ? "..." : totalAssignments}
                    icon={ClipboardList}
                    iconClassName="bg-pink-100 text-pink-700"
                />

            </div>

            {/* Recent Activity + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Activity */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>
                            Recent Activity
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-12 text-center">

                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <Clock
                                    size={22}
                                    className="text-gray-500"
                                />
                            </div>

                            <p className="text-sm font-medium text-text">
                                No recent activity
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                Recent administrative activity will appear
                                here.
                            </p>

                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Quick Actions
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-3">

                            <button
                                onClick={() =>
                                    navigate("/admin/students")
                                }
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                                    <GraduationCap
                                        size={18}
                                        className="text-green-700"
                                    />
                                </div>

                                <div className="flex-1">
                                    <p className="text-sm font-medium text-text">
                                        Add Student
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Create a new student
                                    </p>
                                </div>

                                <Plus
                                    size={16}
                                    className="text-gray-400"
                                />
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/admin/teachers")
                                }
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <UserPlus
                                        size={18}
                                        className="text-blue-700"
                                    />
                                </div>

                                <div className="flex-1">
                                    <p className="text-sm font-medium text-text">
                                        Add Teacher
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Create a new teacher
                                    </p>
                                </div>

                                <Plus
                                    size={16}
                                    className="text-gray-400"
                                />
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/admin/departments")
                                }
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <Building2
                                        size={18}
                                        className="text-purple-700"
                                    />
                                </div>

                                <div className="flex-1">
                                    <p className="text-sm font-medium text-text">
                                        Add Department
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Create a department
                                    </p>
                                </div>

                                <Plus
                                    size={16}
                                    className="text-gray-400"
                                />
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/admin/subjects")
                                }
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <BookOpen
                                        size={18}
                                        className="text-orange-700"
                                    />
                                </div>

                                <div className="flex-1">
                                    <p className="text-sm font-medium text-text">
                                        Add Subject
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Create a new subject
                                    </p>
                                </div>

                                <Plus
                                    size={16}
                                    className="text-gray-400"
                                />
                            </button>

                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}