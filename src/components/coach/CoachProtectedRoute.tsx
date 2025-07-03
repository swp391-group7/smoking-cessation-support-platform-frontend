import React, { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
}

const CoachProtectedRoute: React.FC<Props> = ({ children }) => {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const hasShownToast = useRef(false); 

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (hasShownToast.current) return;

    if (!token || (role !== "coach" && role !== "admin")) {
      toast.error("Failed", {
        description: "Nội dung không tồn tại",
        position: "top-center",
      });
      setRedirectPath("/#hero");
      setShouldRedirect(true);
      hasShownToast.current = true;
    } else if (role === "admin") {
      toast.error("Failed", {
        description: "Bạn không có quyền truy cập trang này",
        position: "top-center",
      });
      setRedirectPath("/admin/dashboard");
      setShouldRedirect(true);
      hasShownToast.current = true;
    }
  }, [token, role]);

  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default CoachProtectedRoute;


//logic gốc
// import React from "react";
// import { Navigate } from "react-router-dom";

// interface Props {
//   children: React.ReactNode;
// }

// const CoachProtectedRoute: React.FC<Props> = ({ children }) => {
//   const token = localStorage.getItem("token");
//   const role: string | null = localStorage.getItem("role");

// if (!token || (role !== "coach" && role !== "admin")) {
//   return <Navigate to="/#hero" replace />;
// }

//   if (role === "admin") {
//     return <Navigate to="/admin/dashboard" replace />;
//   }
//   return <>{children}</>;
// };

// export default CoachProtectedRoute; 