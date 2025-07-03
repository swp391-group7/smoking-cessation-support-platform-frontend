import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const CoachProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("token");
  const role: string | null = localStorage.getItem("role");

if (!token || (role !== "coach" && role !== "admin")) {
  return <Navigate to="/#hero" replace />;
}

  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <>{children}</>;
};

export default CoachProtectedRoute;