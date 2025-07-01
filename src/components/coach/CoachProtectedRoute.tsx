import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const CoachProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "coach") {
    return <Navigate to="/#hero" replace />;
  }

  return <>{children}</>;
};

export default CoachProtectedRoute;