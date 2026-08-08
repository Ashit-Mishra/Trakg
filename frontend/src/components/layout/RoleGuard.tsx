import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../context/useAuthStore";
import { Role } from "../../types";

interface RoleGuardProps {
    allowedRoles: Role[];
    children: React.ReactNode;
}

export function RoleGuard({
    allowedRoles,
    children,
}: RoleGuardProps) {

    const { user, isAuthenticated } = useAuthStore();

    // User is not logged in
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // User doesn't have permission
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    // User is authenticated and has the correct role
    return <>{children}</>;
}