import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { register as registerApi } from "../api/auth";
import { Toaster, toast } from "sonner";
import GoogleLoginButton from "@/components/GoogleLoginButton";

// Import react-hook-form + zod + zodResolver
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Enhanced Zod schema with comprehensive validation
const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
      .refine(val => !/^[0-9]+$/.test(val), "Username cannot be only numbers"),
    fullName: z
      .string()
      .min(2, "Full Name must be at least 2 characters")
      .max(50, "Full Name must be at most 50 characters")
      // Accept any Unicode letters (including Vietnamese) and spaces
      .regex(/^[\p{L}\s]+$/u, "Full Name can only contain letters and spaces")
      .refine(val => val.trim().length > 1, "Full Name cannot be empty"),
    email: z
      .string()
      .email("Invalid email address")
      .min(5, "Email must be at least 5 characters")
      .max(100, "Email must be at most 100 characters")
      .refine(val => !val.includes(".."), "Email cannot contain consecutive dots")
      .refine(val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Invalid email format"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be at most 100 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number")
      .refine(val => !/\s/.test(val), "Password cannot contain spaces"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    dob: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of Birth must be in YYYY-MM-DD format")
      .refine(val => {
        const date = new Date(val);
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        return age >= 18 && age <= 120;
      }, "You must be between 18 and 120 years old")
      .refine(val => {
        const date = new Date(val);
        return date <= new Date();
      }, "Date of birth cannot be in the future"),
    sex: z.enum(["male", "female"], {
      errorMap: () => ({ message: "Please select a valid gender" }),
    }),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be at most 15 digits")
      .regex(/^[\d\s\-+()]+$/, "Phone number can only contain numbers, spaces, dashes, plus sign, and parentheses")
      .refine(val => {
        const cleanPhone = val.replace(/[\s\-+()]/g, '');
        return cleanPhone.length >= 10;
      }, "Phone number must contain at least 10 digits"),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to Terms & Privacy Policy" }),
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
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  const watchPassword = watch("password");
  useEffect(() => {
    if (watchPassword) trigger("confirmPassword");
  }, [watchPassword, trigger]);

  // Sử dụng useRef để tracking errors đã hiển thị - tránh vòng lặp vô hạn
  const shownErrorsRef = useRef<Set<string>>(new Set());

  // Effect để hiển thị toast errors - đã sửa lỗi Maximum update depth exceeded
  useEffect(() => {
    Object.entries(errors).forEach(([field, fieldError]) => {
      if (fieldError?.message && !shownErrorsRef.current.has(field)) {
        toast.error(fieldError.message.toString());
        shownErrorsRef.current.add(field);
      }
    });
    
    // Reset tracking khi form valid
    if (isValid) {
      shownErrorsRef.current.clear();
    }
  }, [errors, isValid]);

const onSubmit = async (data: SignUpFormData) => {
  setLoading(true);
  try {
    await registerApi({
      username: data.username.trim(),
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      dob: data.dob,
      sex: data.sex,
      phoneNumber: data.phoneNumber.trim(),
    });

    toast.success("Sign up successful! Redirecting to login...");
    setTimeout(() => {
      navigate("/login");
    }, 1500);

  } catch (err: unknown) {
    let msg = "Sign up failed. Please try again.";
    if (err instanceof Error && err.message) msg = err.message;
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-2">
      <Toaster position="bottom-right" richColors />
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg px-6 py-8">
        <h1 className="text-3xl font-bold text-center text-emerald-800 mb-6">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                id="username"
                type="text"
                placeholder="Username"
                className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${errors.username ? 'ring-red-500 border-red-300' : ''}`}
                {...register("username")}
              />
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
            </div>
            <div>
              <input
                id="fullName"
                type="text"
                placeholder="Full Name"
                className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${errors.fullName ? 'ring-red-500 border-red-300' : ''}`}
                {...register("fullName")}
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
            </div>
          </div>

          <div>
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${errors.email ? 'ring-red-500 border-red-300' : ''}`}
              {...register("email")}
            />
            {errors.email ? (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            ) : (
              <p className="mt-1 text-sm text-gray-500">Please enter a valid email address to enhance your experience.</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                id="dob"
                type="date"
                className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${errors.dob ? 'ring-red-500 border-red-300' : ''}`}
                {...register("dob")}
              />
              {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>}
            </div>
            <div>
              <select
                id="sex"
                className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${errors.sex ? 'ring-red-500 border-red-300' : ''}`}
                {...register("sex")}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.sex && <p className="mt-1 text-sm text-red-600">{errors.sex.message}</p>}
            </div>
          </div>

          <div>
            <input
              id="phoneNumber"
              type="tel"
              placeholder="Phone Number"
              className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${errors.phoneNumber ? 'ring-red-500 border-red-300' : ''}`}
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                id="password"
                type="password"
                placeholder="Password"
                className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${errors.password ? 'ring-red-500 border-red-300' : ''}`}
                {...register("password")}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
            <div>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${errors.confirmPassword ? 'ring-red-500 border-red-300' : ''}`}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="flex items-start space-x-3 px-2">
            <input
              id="agreeTerms"
              type="checkbox"
              className={`mt-1.5 h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 ${errors.agreeTerms ? 'border-red-500' : ''}`}
              {...register("agreeTerms")}
            />
            <label htmlFor="agreeTerms" className="text-sm text-gray-700 leading-5">
              I agree to the <a href="/terms" target="_blank" className="text-emerald-600 hover:underline font-medium">Terms of Use</a> and <a href="/privacy" target="_blank" className="text-emerald-600 hover:underline font-medium">Privacy Policy</a>
            </label>
          </div>
          {errors.agreeTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeTerms.message}</p>}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !isValid}
              className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${loading || !isValid ? 'bg-gray-400 cursor-not-allowed text-gray-600' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'}`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <button onClick={() => navigate("/login")} className="text-emerald-600 hover:underline font-semibold">Sign In</button>
        </p>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-4 text-gray-500 text-sm font-medium">Or continue with</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center border border-gray-300 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
            <FaFacebookF className="text-blue-600 mr-2" /> Facebook
          </button>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;