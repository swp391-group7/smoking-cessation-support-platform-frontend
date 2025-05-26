// src/components/ui/SignUpForm.tsx

import { FaFacebookF, FaGoogle } from "react-icons/fa";

export const SignUpForm: React.FC = () => {
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
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

          <form className="space-y-4">
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
              />
             
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col relative">
              <label htmlFor="confirmPassword" className="mb-1 text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type= "password"
                placeholder="•••••••••••"
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
            </div>

            {/* Agree Terms */}
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
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
              className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Create account
            </button>
          </form>

          {/* Already have an account */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Login
            </a>
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
