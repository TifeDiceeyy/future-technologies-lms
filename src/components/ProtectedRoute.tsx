import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

interface ProtectedRouteProps {
  role: "student" | "admin";
}

// Full-screen loading spinner shown while Amplify restores the session
function AuthLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#0a0c10" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin border-[#7c3aed]" />
        <p className="text-sm" style={{ color: "#5a6175" }}>
          Loading…
        </p>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Still checking Cognito session — show spinner, don't redirect yet
  if (isLoading) return <AuthLoading />;

  // Not logged in → send to role-appropriate login page
  if (!isAuthenticated) {
    return (
      <Navigate to={role === "admin" ? "/admin-signup" : "/login"} replace />
    );
  }

  // Student trying to reach an admin route → bounce to student home
  if (role === "admin" && !isAdmin) return <Navigate to="/home" replace />;

  // Admins are allowed to browse student routes (Student View feature)

  // Correct role — render the nested routes
  return <Outlet />;
}
