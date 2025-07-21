import React, { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (hasShownToast.current) return;

    if (!token || role !== "admin") {
      if (role === "coach") {
        toast.error("Access Denied", {
          description: "Content not found or unauthorized access.",
          position: "top-center",
        });
        setRedirectPath("/coach/dashboard");
      } else {
        toast.error("Access Denied", {
          description: "Content not found !",
          position: "top-center",
        });
        setRedirectPath("/#hero");
      }

      hasShownToast.current = true;
      setShouldRedirect(true);
    }
  }, [token, role]);

  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
//logic gốc
// import { Navigate } from "react-router-dom";

// const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   if (!token || role === "coach") {
//   return <Navigate to="/coach/dashboard" replace />;
//   }

//   if (!token || role !== "admin") {
//     return <Navigate to="/#hero" replace />;
//   }

//   return <>{children}</>;
// };

// export default AdminProtectedRoute;
