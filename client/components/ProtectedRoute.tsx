import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("employee" | "authority" | "admin")[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles = ["employee", "authority", "admin"],
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authenticated but role not allowed, redirect to appropriate dashboard
  if (!allowedRoles.includes(user.role)) {
    const roleRedirects = {
      employee: "/portal",
      authority: "/authority/dashboard",
      admin: "/admin/dashboard",
    };
    return <Navigate to={roleRedirects[user.role]} replace />;
  }

  return <>{children}</>;
}
