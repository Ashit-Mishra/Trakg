import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthUser } from "../types";

interface User {
  id: number;
  userId: string;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  enabled: boolean;
}

interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;

    setAuth: (user: AuthUser, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setAuth: (user, token) =>
                set({
                    user,
                    token,
                    isAuthenticated: true,
                }),

            logout: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: "auth-storage",
        }
    )
);