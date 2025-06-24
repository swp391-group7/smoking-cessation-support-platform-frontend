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


// Admin layout + pages
import AdminLayout from "./components/admin/Adminlayout.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import Users from "./pages/admin/Users.tsx";
import Plans from "./pages/admin/Plans.tsx";
import QuitProfiles from "./pages/admin/QuitProfiles.tsx";
import QuitPlans from "./pages/admin/QuitPlans.tsx";
import Blog from "./pages/admin/Blog.tsx";
import Notifications from "./pages/admin/Notifications.tsx";
import Community from "./pages/admin/Community.tsx";
import Consultations from "./pages/admin/Consultations.tsx";
import Reports from "./pages/admin/Reports.tsx";
import UserProfiles from "./pages/admin/UserProfiles.tsx";
import Settings from "./pages/admin/Settings.tsx";
import Badges from "./pages/admin/Badges.tsx";

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


          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="plans" element={<Plans />} />
          <Route path="quit-profiles" element={<QuitProfiles />} />
          <Route path="quit-plans" element={<QuitPlans />} />
          <Route path="blog" element={<Blog />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="community" element={<Community />} />
          <Route path="consultations" element={<Consultations />} />
          <Route path="reports" element={<Reports />} />
          <Route path="user-profiles" element={<UserProfiles />} />
          <Route path="badges" element={<Badges />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  </>
)
export default App;
