import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Lock, ArrowRight } from "lucide-react";

import { useAuthStore } from "../../context/useAuthStore";
import { login } from "../../api/auth";

import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Role } from "../../types";

const loginSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
    const navigate = useNavigate();

    const { setAuth } = useAuthStore();

    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        setServerError("");

        try {
            const response = await login(data);
            const role = response.role.replace("ROLE_", "") as Role;

            console.log("Login response:", response);

            const user = {
                userId: response.userId,
                role: role,
            };

            setAuth(user, response.token);

            switch (role) {
                case "ADMIN":
                    navigate("/admin/dashboard");
                    break;

                case "TEACHER":
                    navigate("/teacher/dashboard");
                    break;

                case "STUDENT":
                    navigate("/student/dashboard");
                    break;

                default:
                    setServerError("Invalid user role.");
            }
        } catch (error: any) {
            console.error("Login error:", error);

            if (error.response?.status === 401) {
                setServerError("Invalid User ID or password.");
            } else if (error.response?.status === 403) {
                setServerError(
                    "Your account is disabled or you do not have access."
                );
            } else {
                setServerError(
                    error.response?.data?.message ||
                    "Unable to login. Please try again."
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen">

            <div
                className="absolute top-40 right-10 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"
                style={{ animationDelay: "2s" }}
            />

            <div className="relative z-10">

                <div className="sm:mx-auto sm:w-full sm:max-w-md">

                    <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/20">
                            <span className="text-3xl font-bold text-white tracking-tighter">
                                T
                            </span>
                        </div>
                    </div>

                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-text">
                        Sign in to your account
                    </h2>

                    <p className="mt-2 text-center text-sm text-gray-500">
                        Enter your details to access the Attendance ERP
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[420px]">

                    <Card className="glass px-8 py-10 sm:rounded-[2rem]">

                        <form
                            className="space-y-6"
                            onSubmit={handleSubmit(onSubmit)}
                        >

                            <Input
                                label="User ID"
                                type="text"
                                icon={<User size={18} />}
                                placeholder="Enter your User ID"
                                error={errors.userId?.message}
                                {...register("userId")}
                            />

                            <Input
                                label="Password"
                                type="password"
                                icon={<Lock size={18} />}
                                placeholder="••••••••"
                                error={errors.password?.message}
                                {...register("password")}
                            />

                            {serverError && (
                                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {serverError}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full text-base group"
                                size="lg"
                                isLoading={isLoading}
                            >
                                Sign in

                                <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                            </Button>

                        </form>

                    </Card>

                </div>

            </div>
        </div>
    );
}