import axios from "axios";
import { useAuthStore } from "../context/useAuthStore";

export const apiClient = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL,

    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {

    const token = useAuthStore.getState().token;

    if (token && config.headers) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    // Let the browser/Axios set the correct
    // Content-Type for FormData requests.
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,

    (error) => {

        if (error.response?.status === 401) {
            useAuthStore.getState().logout();

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);