// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import MainLayout from "./layout";
import Home from "./pages/home";
import LoginForm from './components/login-form.tsx'
import SignUpForm from './components/sign-in-form.tsx'
import Quit_Progress from "./pages/platform/quit_progress.tsx";
import Quit_Plan from "./pages/platform/quit_plan.tsx";
import UserSurvey from "./pages/platform/user_survey.tsx";
import BlogPost from "./pages/platform/blog.tsx";
import UserInfo from "./pages/platform/user_info.tsx";

// import UserProfile from "./pages/platform/user_profile.tsx";



export const App = () => (
  <>
    <Toaster />
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Trang chính */}
          <Route index element={<Home />} />
          {/* Public routes */}
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<SignUpForm />} />
          {/* <Route path="user_profile" element={<UserProfile />} /> */}

          <Route path="quit_progress" element={<Quit_Progress />} />
          <Route path="quit_plan" element={<Quit_Plan />} />
          <Route path="blog" element={<BlogPost />} />
          {/* 404: tự redirect về home */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="user_survey" element={<UserSurvey />} />
          <Route path="/user_info" element={<UserInfo />} />
        </Route>
      </Routes>
    </Router>
  </>
)
export default App;
