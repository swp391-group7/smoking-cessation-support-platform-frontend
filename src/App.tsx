import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import MainLayout from './layout';
import Home from './pages/home';
import LoginForm from './components/login-form.tsx';
import SignUpForm from './components/sign-in-form.tsx';
import Quit_Progress from './pages/platform/quit_progress.tsx';
import Quit_Plan from './pages/platform/quit_plan.tsx';
import UserSurvey from './pages/platform/user_survey.tsx';
import BlogPost from './pages/platform/blog.tsx';
import UserInfo from './pages/platform/user_info.tsx';

// Admin pages
import AdminLayout from './components/admin/Adminlayout.tsx';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import Dashboard from './pages/admin/Dashboard.tsx';
import Users from './pages/admin/Users.tsx';
import Plans from './pages/admin/Plans.tsx';
import QuitProfiles from './pages/admin/QuitProfiles.tsx';
import QuitPlans from './pages/admin/QuitPlans.tsx';
import BlogAdminPage from './pages/admin/Blog.tsx';
import BlogFormPage from './pages/admin/BlogFormPage.tsx';
import Notifications from './pages/admin/Notifications.tsx';
import Community from './pages/admin/Community.tsx';
import Consultations from './pages/admin/Consultations.tsx';
import Reports from './pages/admin/Reports.tsx';
import UserProfiles from './pages/admin/UserProfiles.tsx';
import Settings from './pages/admin/Settings.tsx';
import Badges from './pages/admin/Badges.tsx';
import AdminProfile from './pages/admin/Profile.tsx';
import { PlanForm } from './components/PlanForm.tsx';
import AdminSurveyManagement from './pages/admin/AdminSurveyManagement.tsx';

export const App = () => (
  <>
    <Toaster />
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<SignUpForm />} />
          <Route path="quit_progress" element={<Quit_Progress />} />
          <Route path="quit_plan" element={<Quit_Plan />} />
          <Route path="blog" element={<BlogPost />} />
          <Route path="user_survey" element={<UserSurvey />} />
          <Route path="/user_info" element={<UserInfo />} />
          <Route path="quit_form" element={<PlanForm />} />
        </Route>

        {/* Admin Route + Bảo vệ bằng role admin */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="plans" element={<Plans />} />
          <Route path="quit-profiles" element={<QuitProfiles />} />
          <Route path="quit-plans" element={<QuitPlans />} />
          <Route path="blog" element={<BlogAdminPage />} />
          <Route path="blog/create" element={<BlogFormPage />} />
          <Route path="blog/edit/:id" element={<BlogFormPage />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="community" element={<Community />} />
          <Route path="consultations" element={<Consultations />} />
          <Route path="reports" element={<Reports />} />
          <Route path="user-profiles" element={<UserProfiles />} />
          <Route path="badges" element={<Badges />} />
          <Route path="settings" element={<Settings />} />
          <Route path="survey-management" element={<AdminSurveyManagement />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  </>
);

export default App;
