import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";
import { RoleGuard } from "../components/layout/RoleGuard";

// Auth
import { Login } from "../pages/auth/Login";

// Admin
import { AdminDashboard } from "../pages/admin/Dashboard";
import { Teachers } from "../pages/admin/Teachers";
import { Students } from "../pages/admin/Students";
import { Departments } from "../pages/admin/Departments";
import { Subjects } from "../pages/admin/Subjects";
import { Semesters } from "../pages/admin/Semesters";
import { ClassSections } from "../pages/admin/ClassSections";
import { AcademicSessions } from "../pages/admin/AcademicSessions";
import { Assignments } from "../pages/admin/TeacherAssignments";
import { Users } from "../pages/admin/Users";

// Teacher
import { TeacherDashboard } from "../pages/teacher/Dashboard";
import { MyAssignments } from "../pages/teacher/MyAssignments";
import { TakeAttendance } from "../pages/teacher/TakeAttendance";
import { AttendanceHistory } from "../pages/teacher/AttendanceHistory";
import { TeacherProfile } from "../pages/teacher/Profile";

// Student
import { StudentDashboard } from "../pages/student/Dashboard";
import { AttendanceDetails } from "../pages/student/AttendanceDetails";
import { StudentProfile } from "../pages/student/Profile";

export function AppRoutes() {
    return (
        <Routes>

            {/* ==================== AUTH ==================== */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />


            {/* ==================== ADMIN ==================== */}

            <Route
                path="/admin"
                element={
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <AppShell>
                            <AdminDashboard />
                        </AppShell>
                    </RoleGuard>
                }
            />

            <Route
                path="/admin/dashboard"
                element={
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <AppShell>
                            <AdminDashboard />
                        </AppShell>
                    </RoleGuard>
                }
            />

            <Route
                path="/admin/teachers"
                element={
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <AppShell>
                            <Teachers />
                        </AppShell>
                    </RoleGuard>
                }
            />

            <Route
                path="/admin/students"
                element={
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <AppShell>
                            <Students />
                        </AppShell>
                    </RoleGuard>
                }
            />

            <Route
                path="/admin/departments"
                element={
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <AppShell>
                            <Departments />
                        </AppShell>
                    </RoleGuard>
                }
            />

            <Route
                path="/admin/subjects"
                element={
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <AppShell>
                            <Subjects />
                        </AppShell>
                    </RoleGuard>
                }
            />

            {/* NEW: Semesters */}
            <Route
                path="/admin/semesters"
                element={
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <AppShell>
                            <Semesters />
                        </AppShell>
                    </RoleGuard>
                }
            />

            <Route
                path="/admin/class-sections"
                element={
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <AppShell>
                            <ClassSections />
                        </AppShell>
                    </RoleGuard>
                }
            />

            <Route
                path="/admin/academic-sessions"
                element={
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <AppShell>
                            <AcademicSessions />
                        </AppShell>
                    </RoleGuard>
                }
            />

            <Route
                path="/admin/assignments"
                element={
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <AppShell>
                            <Assignments />
                        </AppShell>
                    </RoleGuard>
                }
            />

            <Route
                path="/admin/users"
                element={
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <AppShell>
                            <Users />
                        </AppShell>
                    </RoleGuard>
                }
            />


            {/* ==================== TEACHER ==================== */}

            <Route
                path="/teacher/dashboard"
                element={
                    <RoleGuard allowedRoles={["TEACHER"]}>
                        <AppShell>
                            <TeacherDashboard />
                        </AppShell>
                    </RoleGuard>
                }
            />

            <Route
                path="/teacher/assignments"
                element={
                    <RoleGuard allowedRoles={["TEACHER"]}>
                        <AppShell>
                            <MyAssignments />
                        </AppShell>
                    </RoleGuard>
                }
            />

            <Route
                path="/teacher/attendance"
                element={
                    <RoleGuard allowedRoles={["TEACHER"]}>
                        <AppShell>
                            <TakeAttendance />
                        </AppShell>
                    </RoleGuard>
                }
            />

            <Route
                path="/teacher/history"
                element={
                    <RoleGuard allowedRoles={["TEACHER"]}>
                        <AppShell>
                            <AttendanceHistory />
                        </AppShell>
                    </RoleGuard>
                }
            />

            <Route
                path="/teacher/profile"
                element={
                    <RoleGuard allowedRoles={["TEACHER"]}>
                        <AppShell>
                            <TeacherProfile />
                        </AppShell>
                    </RoleGuard>
                }
            />


            {/* ==================== STUDENT ==================== */}

            <Route
                path="/student/dashboard"
                element={
                    <RoleGuard allowedRoles={["STUDENT"]}>
                        <AppShell>
                            <StudentDashboard />
                        </AppShell>
                    </RoleGuard>
                }
            />

            <Route
                path="/student/attendance"
                element={
                    <RoleGuard allowedRoles={["STUDENT"]}>
                        <AppShell>
                            <AttendanceDetails />
                        </AppShell>
                    </RoleGuard>
                }
            />

            <Route
                path="/student/profile"
                element={
                    <RoleGuard allowedRoles={["STUDENT"]}>
                        <AppShell>
                            <StudentProfile />
                        </AppShell>
                    </RoleGuard>
                }
            />


            {/* ==================== FALLBACK ==================== */}

            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    );
}
