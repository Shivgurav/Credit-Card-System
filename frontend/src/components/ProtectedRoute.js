import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false, userOnly = false }) {
  const isLoggedIn = localStorage.getItem("login") === "true";
  const role = localStorage.getItem("role") || "USER";

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (adminOnly && role !== "ADMIN") return <Navigate to="/dashboard" replace />;

  // ✅ Blocks ADMIN from USER-only pages like Apply Card
  if (userOnly && role === "ADMIN") return <Navigate to="/dashboard" replace />;

  return children;
}

export default ProtectedRoute;
