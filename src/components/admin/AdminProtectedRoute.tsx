import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role === "coach") {
  return <Navigate to="/coach/dashboard" replace />;
  }

  if (!token || role !== "admin") {
    return <Navigate to="/#hero" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
