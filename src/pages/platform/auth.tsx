// src/pages/auth/AuthPage.tsx
import React, { useState } from "react";
import LoginForm from "../../components/login-form";
import SignUpForm from "../../components/sign-in-form";
import clsx from "clsx";

// -------------------------------------------------
// AuthPage chịu trách nhiệm chia 2 cột + overlay
// -------------------------------------------------
const AuthPage: React.FC = () => {
  // isSignUp = false  → đang hiển thị LoginForm (bên trái),
  //                    overlay nằm bên phải (che SignUpForm).
  // isSignUp = true   → đang hiển thị SignUpForm (bên phải),
  //                    overlay nằm bên trái (che LoginForm).
  const [isSignUp, setIsSignUp] = useState(false);

  // Khi form login/sign up thành công, mình có thể muốn
  // tự động chuyển panel hoặc redirect. Ta truyền callback này
  // xuống child để child gọi khi thành công.
  const handleAfterLoginSuccess = () => {
    // Ví dụ: sau khi login thành công, có thể redirect ra / hoặc tắt overlay...
    // Ở đây mình để mặc định redirect / trong LoginForm.
  };
  const handleAfterSignUpSuccess = () => {
    // Sau khi sign up thành công, mình muốn tự động trượt qua
    // phần Login (isSignUp=false), để user có thể login tiếp.
    setIsSignUp(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="relative w-full max-w-[700px] h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
        {/* =================================================
            2 cột (LoginForm & SignUpForm) đặt cạnh nhau,
            tổng width = 200% container, mỗi cột = 50%.
            Khi isSignUp = true → dịch translateX(-50%) để chuyển cột signup lên giữa viewport.
            Ngược lại, giữ translateX(0) để show login.
        ================================================= */}
        <div
          className={clsx(
            "flex w-[200%] h-full transition-transform duration-700 ease-in-out",
            {
              "-translate-x-1/2": isSignUp,
              "translate-x-0": !isSignUp,
            }
          )}
        >
          {/* === Cột 1: LoginForm (nằm bên trái) === */}
          <div className="w-1/2 flex items-center justify-center">
            {/* LoginForm đã được bỏ wrapper min-screen → chỉ là “card trắng” form */}
            <LoginForm onAfterSuccess={handleAfterLoginSuccess} />
          </div>

          {/* === Cột 2: SignUpForm (nằm bên phải) === */}
          <div className="w-1/2 flex items-center justify-center">
            <SignUpForm onAfterSuccess={handleAfterSignUpSuccess} />
          </div>
        </div>

        {/* =============================================
            Overlay Panel (nằm chính giữa container):
            - width = 50% container, height = 100% container.
            - Khi isSignUp = false: đặt left = 50% (translateX(-50%) để padding),
              tức overlay nằm bên phải, che SignUpForm.
            - Khi isSignUp = true: đặt left = 0, tức overlay sẽ che LoginForm.
            Overlay có background-color, có text & nút để toggle isSignUp.
        ============================================= */}
        <div
          className={clsx(
            "absolute top-0 h-full w-1/2 bg-emerald-600 text-white flex flex-col items-center justify-center px-8 py-10 transition-all duration-700 ease-in-out",
            {
              "left-1/2": !isSignUp, // che phần SignUpForm
              "left-0": isSignUp,    // che phần LoginForm
            }
          )}
        >
          {isSignUp ? (
            <>
              <h2 className="text-3xl font-semibold mb-2">Welcome Back!</h2>
              <p className="mb-6 text-center text-sm">
                To keep connected with us please login with your personal info
              </p>
              <button
                onClick={() => setIsSignUp(false)}
                className="border border-white rounded-full px-6 py-2 hover:bg-white hover:text-emerald-600 transition"
              >
                Login
              </button>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-semibold mb-2">Hello, Friend!</h2>
              <p className="mb-6 text-center text-sm">
                Enter your personal details and start your journey with us
              </p>
              <button
                onClick={() => setIsSignUp(true)}
                className="border border-white rounded-full px-6 py-2 hover:bg-white hover:text-emerald-600 transition"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
