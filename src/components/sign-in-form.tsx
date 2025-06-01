// src/components/ui/SignUpForm.tsx

import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
// import hàm register từ auth.ts
import { register as registerApi } from "../api/auth";
// import toast và Toaster từ sonner
import { Toaster, toast } from "sonner";

export const SignUpForm: React.FC = () => {
  const navigate = useNavigate();

  // State cho các input
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State cho lỗi (còn giữ để hiển thị dưới form nếu cần)
  const [error, setError] = useState<string>("");

  // State cho loading khi chờ API
  const [loading, setLoading] = useState<boolean>(false);

  // Hàm xử lý khi submit form
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Kiểm tra các trường không được để trống
    if (!username.trim() || !fullName.trim() || !email.trim() || !password) {
      const msg = "Vui lòng điền đầy đủ tất cả các trường.";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    // 2. Kiểm tra định dạng email cơ bản (regex đơn giản)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const msg = "Email không hợp lệ.";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    // 3. Kiểm tra password và confirmPassword
    if (password !== confirmPassword) {
      const msg = "Mật khẩu và xác nhận mật khẩu không khớp.";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    try {
      // Gọi API register, giả sử backend nhận { username, full_name, email, password }
      const response = await registerApi({
        username: username.trim(),
        full_name: fullName.trim(),
        email: email.trim(),
        password: password,
      });

      // Nếu thành công, backend trả về { token, user }
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      toast.success("Đăng ký thành công");
      // Chờ 500ms để toast hiển thị trước khi chuyển trang
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err: unknown) {
      console.error("Register failed:", err);

      // Nếu là AxiosError, chúng ta có thể lấy message từ response
      let msg = "Đăng ký thất bại. Vui lòng thử lại.";
      if (err instanceof Error && err.message) {
        msg = err.message;
      }
      setError(msg);
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

          {/* Hiển thị lỗi text (nếu cần), nhưng thông báo chính sẽ qua toast */}
          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Username */}
            <div className="flex flex-col">
              <label htmlFor="username" className="mb-1 text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="yourusername"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
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
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
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
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Agree Terms */}
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                required
              />
              <span>
                I agree to all the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policies
                </a>
              </span>
            </label>

            {/* Create Account button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-blue-400" : "bg-blue-600"
              } text-white py-2 rounded-md font-medium hover:bg-blue-700 transition`}
            >
              {loading ? "Processing..." : "Create account"}
            </button>
          </form>

          {/* Already have an account */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <button
              className="text-blue-600 hover:underline"
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
