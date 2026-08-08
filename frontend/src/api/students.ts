import { apiClient } from "./client";
import { Student } from "../types";

export interface StudentRequest {
    userId: string;
    name: string;
    email: string;
    rollNumber: string;
    classSectionId: number;
}

export interface ImportResponse {
    success?: boolean;
    message?: string;
    importedCount?: number;
    failedCount?: number;
}

/*
 * Get all students
 */
export const getStudents = async (): Promise<Student[]> => {
    const { data } = await apiClient.get<Student[]>(
        "/api/admin/students"
    );

    return data;
};

/*
 * Get student by ID
 */
export const getStudent = async (
    id: number
): Promise<Student> => {
    const { data } = await apiClient.get<Student>(
        `/api/admin/students/${id}`
    );

    return data;
};

/*
 * Get students by class section
 */
export const getStudentsByClassSection = async (
    classSectionId: number
): Promise<Student[]> => {
    const { data } = await apiClient.get<Student[]>(
        `/api/admin/students/class-section/${classSectionId}`
    );

    return data;
};

/*
 * Create student
 */
export const createStudent = async (
    request: StudentRequest
): Promise<Student> => {
    const { data } = await apiClient.post<Student>(
        "/api/admin/students",
        request
    );

    return data;
};

/*
 * Import students from Excel
 */
export const importStudents = async (
    file: File
): Promise<ImportResponse> => {
    const formData = new FormData();

    formData.append("file", file);

    const { data } = await apiClient.post<ImportResponse>(
        "/api/admin/students/import",
        formData
    );

    return data;
};

/*
 * Download Excel template
 */
export const downloadStudentTemplate = async (): Promise<Blob> => {
    const { data } = await apiClient.get(
        "/api/admin/students/template",
        {
            responseType: "blob",
        }
    );

    return data;
};

/*
 * Download template to user's computer
 */
export const downloadStudentTemplateFile = async (): Promise<void> => {
    const blob = await downloadStudentTemplate();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "students-template.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
};