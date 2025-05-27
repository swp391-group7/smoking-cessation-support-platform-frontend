// src/pages/auth/LoginPage.tsx

import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const LoginPage: React.FC = () => {

 const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header với logo */}
        <div className="py-8 px-6 flex items-center space-x-2">
          <img src="/logo192.png" alt="Your Logo" className="h-8 w-8" />
          <span className="text-2xl font-semibold">Your Logo</span>
        </div>

        {/* Body */}
        <div className="px-6 pb-8">
          <h1 className="text-3xl font-bold mb-1">Login</h1>
          <p className="text-gray-500 mb-6">
            Login to access your travelwise account
          </p>

          <form className="space-y-4">
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
              />
              
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-blue-600 hover:underline">
                Forgot Password?
              </button>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>

          {/* Sign up */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <button className="text-blue-600 hover:underline"
             onClick={() => navigate("/register")}>
              Sign up
            </button>
          </p>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="px-3 text-gray-500 text-sm">Or login with</span>
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
