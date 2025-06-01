// src/pages/auth/LoginPage.tsx

import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { login as loginApi } from "../api/auth";
import { Toaster, toast } from "sonner";

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await loginApi({ username, password });
      // Lưu token và user vào localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Hiển thị toast thành công
      toast.success("Đăng nhập thành công");
      // Chuyển về trang chủ sau 500ms để toast kịp hiển thị
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err: unknown) {
      // Bắt lỗi và chỉ hiển thị thông báo chung, không show mã HTTP
      const msg = "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.";
      toast.error(msg);
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Toaster hiển thị ở đầu trang */}
      <Toaster position="top-center" />

      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Phần Header */}
        <div className="py-8 px-6 flex items-center space-x-2">
          <img src="/logo192.png" alt="Your Logo" className="h-8 w-8" />
          <span className="text-2xl font-semibold">Your Logo</span>
        </div>

        {/* Phần Body */}
        <div className="px-6 pb-8">
          <h1 className="text-3xl font-bold mb-1">Đăng nhập</h1>
          <p className="text-gray-500 mb-6">
            Đăng nhập để truy cập tài khoản Travelwise của bạn
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div className="flex flex-col">
              <label htmlFor="username" className="mb-1 text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="your-username"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="•••••••••••"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span className="text-gray-600">Nhớ đăng nhập</span>
              </label>
              <button type="button" className="text-emerald-600 hover:underline">
                Quên mật khẩu?
              </button>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded-md font-medium hover:bg-emerald-700 transition"
            >
              Đăng nhập
            </button>
          </form>

          {/* Sign up */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Chưa có tài khoản?{" "}
            <button
              className="text-emerald-600 hover:underline"
              onClick={() => navigate("/register")}
            >
              Đăng ký
            </button>
          </p>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="px-3 text-gray-500 text-sm">Hoặc đăng nhập bằng</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>

          {/* Social buttons */}
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
