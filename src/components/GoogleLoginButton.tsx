import { useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";

type UserRole = "admin" | "coach" | "user";

interface GoogleLoginResponse {
  token: string;
  user: {
    id: string;
    full_name: string;
    avatar_path?: string;
    role: UserRole;
  };
}

const redirectMap: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  coach: "/coach/dashboard",
  user: "/quit_progress",
};

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse?.credential;

    if (!idToken) {
      toast.error("No Google ID token received.");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post<GoogleLoginResponse>(
        `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
        { idToken }
      );

      const { token, user } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      toast.success("Google login successful!", {
        description: `Welcome ${user.full_name}`,
        position: "top-center",
      });

      const redirectPath = redirectMap[user.role] ?? "/";
      setTimeout(() => navigate(redirectPath), 700);
    } catch (error: unknown) {
      let message = "Feature under development, please try again later !";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        message = error.response.data.error;
      }
      toast.error(message);
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    toast.error("Feature under development, please try again later !");
  };

  return (
    <div className="relative">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap={false}
        ux_mode="popup"  
        theme="outline"
        size="large"
        shape="pill"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-md z-10">
          <span className="text-sm text-gray-700 animate-pulse">Processing...</span>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;