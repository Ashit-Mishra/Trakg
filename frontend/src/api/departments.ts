import { apiClient } from "./client";
import { Department } from "../types";

export interface DepartmentRequest {
    departmentCode: string;
    departmentName: string;
    academicSessionId: number;
}

export interface ImportResponse {
    success?: boolean;
    message?: string;
    importedCount?: number;
    failedCount?: number;
}

/*
 * Get all departments
 */
export const getDepartments = async (): Promise<Department[]> => {
    const { data } = await apiClient.get<Department[]>(
        "/api/admin/departments"
    );

    return data;
};

/*
 * Get department by ID
 */
export const getDepartment = async (
    id: number
): Promise<Department> => {
    const { data } = await apiClient.get<Department>(
        `/api/admin/departments/${id}`
    );

    return data;
};

/*
 * Get departments by academic session
 */
export const getDepartmentsByAcademicSession = async (
    sessionId: number
): Promise<Department[]> => {
    const { data } = await apiClient.get<Department[]>(
        `/api/admin/departments/academic-session/${sessionId}`
    );

    return data;
};

/*
 * Create department
 */
export const createDepartment = async (
    request: DepartmentRequest
): Promise<Department> => {
    const { data } = await apiClient.post<Department>(
        "/api/admin/departments",
        request
    );

    return data;
};

/*
 * Import departments from Excel
 */
export const importDepartments = async (
    file: File
): Promise<ImportResponse> => {
    const formData = new FormData();

    formData.append("file", file);

    const { data } = await apiClient.post<ImportResponse>(
        "/api/admin/departments/import",
        formData
    );

    return data;
};

/*
 * Download department Excel template
 */
export const downloadDepartmentTemplate = async (): Promise<Blob> => {
    const { data } = await apiClient.get(
        "/api/admin/departments/template",
        {
            responseType: "blob",
        }
    );

    return data;
};

/*
 * Download template file
 */
export const downloadDepartmentTemplateFile =
    async (): Promise<void> => {
        const blob = await downloadDepartmentTemplate();

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "departments-template.xlsx";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);
    };
