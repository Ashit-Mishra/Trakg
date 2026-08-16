import { apiClient } from "./client";

export const getDashboardStats = async () => {
    const [
        students,
        teachers,
        departments,
        subjects,
        semesters,
        classSections,
        assignments,
    ] = await Promise.all([
        apiClient.get("/api/admin/students"),
        apiClient.get("/api/admin/teachers"),
        apiClient.get("/api/admin/departments"),
        apiClient.get("/api/admin/subjects"),
        apiClient.get("/api/admin/semesters"),
        apiClient.get("/api/admin/class-sections"),
        apiClient.get("/api/admin/teacher-subject-assignments"),
    ]);

    return {
        students: students.data,
        teachers: teachers.data,
        departments: departments.data,
        subjects: subjects.data,
        semesters: semesters.data,
        classSections: classSections.data,
        assignments: assignments.data,
    };
};