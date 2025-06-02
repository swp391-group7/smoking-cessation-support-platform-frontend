// src/pages/auth/LoginPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login as loginApi } from "../api/auth";
import { useMutation } from "@tanstack/react-query";
import { FaFacebookF, FaGoogle } from "react-icons/fa";


const loginSchema = z.object({
  username: z.string().min(1, "Username không được để trống"),
  password: z.string().min(6, "Password phải ít nhất 6 ký tự"),
});

type LoginData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      // Giả sử response.user có cấu trúc { id, username, name, avatarUrl? }
      // Chúng ta ép luôn object đó vào LocalStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      console.log("Response login:", response.token); // Kiểm tra trong console
      console.log("User data:", response.user); // Kiểm tra trong console
      toast.success("Đăng nhập thành công", {
        position: "top-center",
        description: "Chào mừng bạn trở lại!",
      });

      // Điều hướng về trang có Navbar ("/"), để Navbar mount lại và đọc localStorage
      setTimeout(() => navigate("/"), 700);
    },
    onError: () => {
      toast.error(
        "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.",
        { position: "bottom-right" }
      );
    },
  });

  const onSubmit = (data: LoginData) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Toaster />

      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="py-8 px-6 flex items-center space-x-2">
          <img src="/logo192.png" alt="Your Logo" className="h-8 w-8" />
          <span className="text-4xl font-medium text-emerald-900">AirBloom</span>
        </div>

        <div className="px-6 pb-8">
          <h1 className="text-3xl font-bold mb-1 text-emerald-800">Login</h1>
          <p className="text-gray-500 mb-6">
            Login to your account to continue using our services.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col">
              <label
                htmlFor="username"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="your-username"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("username")}
              />
              {errors.username && (
                <span className="text-sm text-red-500">
                  {errors.username.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="•••••••••••"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-sm text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-emerald-600 hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full text-white py-2 rounded-md font-medium transition ${
                isPending ? "bg-emerald-400" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isPending ? "Đang đăng nhập..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
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

          <div className="flex space-x-4">
            <button className="flex-1 flex items-center justify-center border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition">
              <FaFacebookF className="text-blue-600 mr-2" />
              Facebook
            </button>
            <button className="flex-1 flex items-center justify-center border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition">
              <FaGoogle className="text-red-500 mr-2" />
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
