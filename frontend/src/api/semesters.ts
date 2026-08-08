import { apiClient } from "./client";

export interface SemesterRequest {
    semesterNumber: number;
    departmentId: number;
}

export interface Semester {
    id: number;
    semesterNumber: number;
    department: {
        id: number;
        departmentCode: string;
        departmentName: string;
    };
}

export const getSemesters = async (): Promise<Semester[]> => {
    const { data } = await apiClient.get<Semester[]>(
        "/api/admin/semesters"
    );

    return data;
};

export const getSemester = async (
    id: string
): Promise<Semester> => {
    const { data } = await apiClient.get<Semester>(
        `/api/admin/semesters/${id}`
    );

    return data;
};

export const createSemester = async (
    request: SemesterRequest
): Promise<Semester> => {
    const { data } = await apiClient.post<Semester>(
        "/api/admin/semesters",
        request
    );

    return data;
};

export const getSemestersByDepartment = async (
    departmentId: string
): Promise<Semester[]> => {
    const { data } = await apiClient.get<Semester[]>(
        `/api/admin/semesters/department/${departmentId}`
    );

    return data;
};