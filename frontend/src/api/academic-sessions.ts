import { apiClient } from "./client";
import { AcademicSession } from "../types";

export interface AcademicSessionRequest {
    sessionName: string;
    startDate: string;
}

/*
 * Get all academic sessions
 */
export const getAcademicSessions = async (): Promise<
    AcademicSession[]
> => {
    const { data } = await apiClient.get<AcademicSession[]>(
        "/api/admin/academic-sessions"
    );

    return data;
};

/*
 * Get currently active academic session
 */
export const getActiveAcademicSession =
    async (): Promise<AcademicSession> => {
        const { data } =
            await apiClient.get<AcademicSession>(
                "/api/admin/academic-sessions/active"
            );

        return data;
    };

/*
 * Create academic session
 */
export const createAcademicSession = async (
    request: AcademicSessionRequest
): Promise<AcademicSession> => {
    const { data } =
        await apiClient.post<AcademicSession>(
            "/api/admin/academic-sessions",
            request
        );

    return data;
};

/*
 * Activate academic session
 */
export const activateAcademicSession = async (
    id: number
): Promise<AcademicSession> => {
    const { data } =
        await apiClient.put<AcademicSession>(
            `/api/admin/academic-sessions/${id}/activate`
        );

    return data;
};