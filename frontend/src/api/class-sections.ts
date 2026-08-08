import { apiClient } from "./client";
import { ClassSection } from "../types";

export interface ClassSectionRequest {
    sectionName: string;
    semesterId: number;
}

export interface ImportResponse {
    success?: boolean;
    message?: string;
    totalRows?: number;
    importedRows?: number;
    failedRows?: number;
    errors?: {
        row: number;
        message: string;
    }[];
}

/*
 * Get all class sections
 */
export const getClassSections = async (): Promise<
    ClassSection[]
> => {
    const { data } = await apiClient.get<ClassSection[]>(
        "/api/admin/class-sections"
    );

    return data;
};

/*
 * Get class section by ID
 */
export const getClassSection = async (
    id: number
): Promise<ClassSection> => {
    const { data } = await apiClient.get<ClassSection>(
        `/api/admin/class-sections/${id}`
    );

    return data;
};

/*
 * Get class sections by semester
 */
export const getClassSectionsBySemester = async (
    semesterId: number
): Promise<ClassSection[]> => {
    const { data } = await apiClient.get<ClassSection[]>(
        `/api/admin/class-sections/semester/${semesterId}`
    );

    return data;
};

/*
 * Create class section
 */
export const createClassSection = async (
    request: ClassSectionRequest
): Promise<ClassSection> => {
    const { data } = await apiClient.post<ClassSection>(
        "/api/admin/class-sections",
        request
    );

    return data;
};

/*
 * Import class sections
 */
export const importClassSections = async (
    file: File
): Promise<ImportResponse> => {
    const formData = new FormData();

    formData.append("file", file);

    const { data } = await apiClient.post<ImportResponse>(
        "/api/admin/class-sections/import",
        formData
    );

    return data;
};

/*
 * Download Excel template
 */
export const downloadClassSectionTemplate =
    async (): Promise<Blob> => {
        const { data } = await apiClient.get(
            "/api/admin/class-sections/template",
            {
                responseType: "blob",
            }
        );

        return data;
    };

/*
 * Download template file
 */
export const downloadClassSectionTemplateFile =
    async (): Promise<void> => {
        const blob =
            await downloadClassSectionTemplate();

        const url =
            window.URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download =
            "class-sections-template.xlsx";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);
    };