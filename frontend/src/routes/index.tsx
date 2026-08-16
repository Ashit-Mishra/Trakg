import React from "react";

import { AppShell } from "../components/layout/AppShell";
import { RoleGuard } from "../components/layout/RoleGuard";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

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
import { AttendanceHistory } from "../pages/teacher/AttendanceHistory";
import { Profile } from "../pages/teacher/Profile";
import { TakeAttendance } from "../pages/teacher/TakeAttendance";

// Student
import { StudentDashboard } from "../pages/student/StudentDashboard";
import { AttendanceDetails } from "../pages/student/AttendanceDetails";


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


            {/* ======================== TEACHER ======================== */}

<Route
  path="/teacher"
  element={
    <RoleGuard allowedRoles={["TEACHER"]}>
      <AppShell>
        <Outlet />
      </AppShell>
    </RoleGuard>
  }
>
  <Route
    path="dashboard"
    element={<TeacherDashboard />}
  />

  <Route
    path="assignments"
    element={<MyAssignments />}
  />
  
  <Route
    path="attendance"
    element={<TakeAttendance />}
  />

  <Route
    path="history"
    element={<AttendanceHistory />}
  />

  <Route
    path="profile"
    element={<Profile />}
  />
</Route>

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


            {/* ==================== FALLBACK ==================== */}

            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    );
}
