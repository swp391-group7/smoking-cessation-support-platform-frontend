// src/components/ui/SignUpForm.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { register as registerApi } from "../api/auth";
import { Toaster, toast } from "sonner";

// 1️ Import react-hook-form + zod + zodResolver
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// 2️ Định nghĩa Zod schema
const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username phải có ít nhất 3 ký tự")
      .max(30, "Username tối đa 30 ký tự"),
    fullName: z
      .string()
      .min(2, "Full Name phải có ít nhất 2 ký tự")
      .max(50, "Full Name tối đa 50 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(6, "Password phải có ít nhất 6 ký tự")
      .max(100, "Password tối đa 100 ký tự"),
    confirmPassword: z.string(),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "Bạn phải đồng ý với Terms & Privacy" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu và xác nhận mật khẩu không khớp",
  });

// 3️ Kế thừa type từ schema
type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpForm: React.FC = () => {
  const navigate = useNavigate();

  // 4️ state loading
  const [loading, setLoading] = useState<boolean>(false);

  // 5️ Khởi tạo useForm với zodResolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  // 6️ Hàm onSubmit
  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);

    try {
      const response = await registerApi({
        username: data.username.trim(),
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        password: data.password,
      });

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      toast.success("Đăng ký thành công");
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (err: unknown) {
      console.error("Register failed:", err);
      let msg = "Đăng ký thất bại. Vui lòng thử lại.";
      if (err instanceof Error && err.message) {
        msg = err.message;
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Toaster hiển thị thông báo ở đầu trang */}
      <Toaster position="top-center" />

      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header với logo */}
        <div className="py-8 px-6 flex items-center justify-center">
          <img src="/logo192.png" alt="Your Logo" className="h-8 w-8 mr-2" />
          <span className="text-2xl font-semibold">Your Logo</span>
        </div>

        {/* Body */}
        <div className="px-8 pb-8">
          <h1 className="text-3xl font-bold mb-1">Sign up</h1>
          <p className="text-gray-500 mb-6">
            Let’s get you all set up so you can access your personal account.
          </p>

          {/* 7️ Hiển thị lỗi validation từ react-hook-form */}
          {Object.keys(errors).length > 0 && (
            <div className="text-red-600 text-sm mb-4">
              {/* Hiển thị message đầu tiên tìm được */}
              {errors.username?.message ||
                errors.fullName?.message ||
                errors.email?.message ||
                errors.password?.message ||
                errors.confirmPassword?.message ||
                errors.agreeTerms?.message}
            </div>
          )}

          {/* 8️ Form sử dụng handleSubmit */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div className="flex flex-col">
              <label htmlFor="username" className="mb-1 text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="yourusername"
                className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.username ? "ring-red-500 ring-1" : ""
                }`}
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="flex flex-col">
              <label htmlFor="fullName" className="mb-1 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fullName ? "ring-red-500 ring-1" : ""
                }`}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "ring-red-500 ring-1" : ""
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col relative">
              <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="•••••••••••"
                className={`w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "ring-red-500 ring-1" : ""
                }`}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col relative">
              <label htmlFor="confirmPassword" className="mb-1 text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="•••••••••••"
                className={`w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? "ring-red-500 ring-1" : ""
                }`}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Agree Terms */}
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                {...register("agreeTerms")}
              />
              <span>
                I agree to all the{" "}
                <a href="#" className="text-emerald-700 hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-emerald-700 hover:underline">
                  Privacy Policies
                </a>
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-red-500 text-sm mt-1">{errors.agreeTerms.message}</p>
            )}

            {/* Create Account button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-emerald-600" : "bg-emerald-700"
              } text-white py-2 rounded-md font-medium hover:bg-emerald-800 transition disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? "Processing..." : "Create account"}
            </button>
          </form>

          {/* Already have an account */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <button
              className="text-emerald-700 hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="px-3 text-gray-500 text-sm">Or sign up with</span>
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

export default SignUpForm;
