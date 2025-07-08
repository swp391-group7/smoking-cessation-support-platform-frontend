// src/components/ui/SignUpForm.tsx

import React, { useState, useEffect } from "react";
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
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters"),
    fullName: z
      .string()
      .min(2, "Full Name must be at least 2 characters")
      .max(50, "Full Name must be at most 50 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be at most 100 characters"),
    confirmPassword: z.string(),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to Terms & Privacy" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  // Hiển thị lỗi bằng toast khi có error
  useEffect(() => {
    Object.values(errors).forEach((fieldError) => {
      if (fieldError?.message) {
        toast.error(fieldError.message.toString());
      }
    });
  }, [errors]);

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
      toast.success("Sign up successful");
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (err: unknown) {
      console.error("Register failed:", err);
      let msg = "Sign up failed. Please try again.";
      if (err instanceof Error && err.message) {
        msg = err.message;
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-2">
      <Toaster position="bottom-right" />

      <div className="max-w-sm w-full bg-white rounded-lg shadow-md px-4 py-6">
        {/* Tiêu đề “Sign up” nhỏ và căn giữa */}
        <h1 className="text-2xl font-semibold text-center text-emerald-800 mb-4">
          Sign up
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div className="flex justify-center">
            <input
              id="username"
              type="text"
              placeholder="Username"
              className={`w-11/12 border border-gray-300 rounded-2xl px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.username ? "ring-red-500 ring-1" : ""
              }`}
              {...register("username")}
            />
          </div>

          {/* Full Name */}
          <div className="flex justify-center">
            <input
              id="fullName"
              type="text"
              placeholder="Full Name"
              className={`w-11/12 border border-gray-300 rounded-2xl px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.fullName ? "ring-red-500 ring-1" : ""
              }`}
              {...register("fullName")}
            />
          </div>

          {/* Email */}
          <div className="flex justify-center">
            <input
              id="email"
              type="email"
              placeholder="Email"
              className={`w-11/12 border border-gray-300 rounded-2xl px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.email ? "ring-red-500 ring-1" : ""
              }`}
              {...register("email")}
            />
          </div>

          {/* Password */}
          <div className="flex justify-center">
            <input
              id="password"
              type="password"
              placeholder="Password"
              className={`w-11/12 border border-gray-300 rounded-2xl px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.password ? "ring-red-500 ring-1" : ""
              }`}
              {...register("password")}
            />
          </div>

          {/* Confirm Password */}
          <div className="flex justify-center">
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className={`w-11/12 border border-gray-300 rounded-2xl px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.confirmPassword ? "ring-red-500 ring-1" : ""
              }`}
              {...register("confirmPassword")}
            />
          </div>

          {/* Agree to Terms and Privacy */}
          <div className="flex items-start text-xs px-3">
            <input
              id="agreeTerms"
              type="checkbox"
              className="mt-1 mr-2"
              {...register("agreeTerms")}
            />
            <label htmlFor="agreeTerms" className="text-gray-600">
              I agree to the{" "}
              <a href="/terms" target="_blank" className="text-emerald-600 hover:underline">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" className="text-emerald-600 hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Create account button, nhỏ gọn và căn giữa */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-48 text-white py-1.5 rounded-full text-sm font-medium transition ${
                loading
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {loading ? "Processing..." : "Create account"}
            </button>
          </div>
        </form>

        {/* “Already have an account?” */}
        <p className="text-center text-xs text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            className="text-emerald-600 hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>

        {/* Divider “Or sign up with” */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="px-2 text-gray-500 text-xs">Or sign up with</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>

        {/* Social buttons, nhỏ và căn giữa */}
        <div className="flex justify-center space-x-6">
          <button className="w-28 flex items-center justify-center border border-gray-300 py-1 rounded-2xl hover:bg-gray-50 transition text-sm">
            <FaFacebookF className="text-blue-600 mr-1" />
            Facebook
          </button>
          <button className="w-28 flex items-center justify-center border border-gray-300 py-1 rounded-2xl hover:bg-gray-50 transition text-sm">
            <FaGoogle className="text-red-500 mr-1" />
            Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;