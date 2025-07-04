// src/pages/auth/LoginPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login as loginApi } from "../api/auth";
import { useMutation } from "@tanstack/react-query";
import { FaFacebookF } from "react-icons/fa";
import GoogleLoginButton from "@/components/GoogleLoginButton";

// Định nghĩa Zod schema
const loginSchema = z.object({
  username: z.string().min(1, "Username cannot be empty"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

    // Khởi tạo useForm với zodResolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: ({ token, user }) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      toast.success("Login successful!", {
        position: "top-center",
        description: `Welcome ${user.full_name}`,
      });

      const redirectPath = {
        admin: "/admin/dashboard",
        coach: "/coach/dashboard",
        user: "/quit_progress",
      }[user.role] || "/";

      setTimeout(() => navigate(redirectPath), 700);
    },
    onError: () => {
      toast.error("Login failed. Please check your username or password.", {
        position: "bottom-right",
      });
    },
  });

  const onSubmit = (data: LoginData) => login(data);

  const onError = (formErrors: typeof errors) => {
    const firstError = formErrors.username?.message || formErrors.password?.message;
    if (firstError) {
      toast.error(firstError, { position: "bottom-right" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Toaster />

      <div className="max-w-md w-full bg-white rounded-lg shadow-lg px-6 py-8">
        <h1 className="text-3xl font-bold text-center text-emerald-800 mb-6">Login</h1>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
          <div className="flex justify-center">
            <input
              id="username"
              type="text"
              placeholder="Username"
              className={`w-11/12 border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } rounded-2xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                errors.username ? "focus:ring-red-500" : "focus:ring-emerald-500"
              }`}
              {...register("username")}
            />
          </div>

          <div className="flex justify-center">
            <input
              id="password"
              type="password"
              placeholder="Password"
              className={`w-11/12 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-2xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                errors.password ? "focus:ring-red-500" : "focus:ring-emerald-500"
              }`}
              {...register("password")}
            />
          </div>

          <div className="flex items-center justify-center space-x-28 text-sm">
            <label className="flex items-center space-x-1">
              <input type="checkbox" className="h-4 w-4 text-emerald-600" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <button type="button" className="text-emerald-600 hover:underline">
              Forgot password?
            </button>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={isPending}
              className={`w-60 text-white py-2 rounded-full font-medium transition ${
                isPending ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <button
            className="text-emerald-600 hover:underline"
            onClick={() => navigate("/register")}
          >
            Sign up
          </button>
        </p>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="px-3 text-gray-500 text-sm">Or Login With</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>

        <div className="flex justify-center space-x-8">
          <button className="w-36 flex items-center justify-center border border-gray-300 py-1.5 rounded-full hover:bg-gray-50 transition">
            <FaFacebookF className="text-blue-600 mr-2" />
            Facebook
          </button>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;