import { apiClient } from "./client";
import { AuthResponse, LoginRequest } from "../types";

export const login = async (
    credentials: LoginRequest
): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
        "/api/auth/login",
        credentials
    );

    return data;
};