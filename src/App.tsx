// src/App.tsx
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
import PremiumBlogPage from './pages/platform/PremiumBlogPage.tsx';

// Admin pages
import AdminLayout from './components/admin/Adminlayout.tsx';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import Dashboard from './pages/admin/Dashboard.tsx';
import Users from './pages/admin/Users.tsx';
import Membership from './pages/admin/MembershipPlans.tsx';
import BlogAdminPage from './pages/admin/Blog.tsx';
import BlogFormPage from './pages/admin/BlogFormPage.tsx';
import Notifications from './pages/admin/Notifications.tsx';
import Community from './pages/admin/Community.tsx';
import Feedback from './pages/admin/Feedback.tsx';
// import UserProfiles from './pages/admin/UserProfiles.tsx';
import Settings from './pages/admin/Settings.tsx';
import Badges from './pages/admin/Badges.tsx';
import AdminProfile from './pages/admin/Profile.tsx';
import { PlanForm } from './components/PlanForm.tsx';

import AdminSurveyManagement from './pages/admin/AdminSurveyManagement.tsx';

// Coach pages
import CoachLayout from './components/coach/CoachLayout.tsx';
import CoachProtectedRoute from './components/coach/CoachProtectedRoute';
import CoachDashboard from './pages/coach/CoachDashboard.tsx';
import CoachProfile from './pages/coach/Profile.tsx';
import CoachUserList from './pages/coach/CoachUserList.tsx';
import MembershipPage from './pages/platform/membership.tsx';
import ScrollToTop from './components/ScrollToTop.tsx';


export const App = () => (
  <>
    <Toaster />
    <Router>
       <ScrollToTop/>
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
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/PremiumBlogPage" element={<PremiumBlogPage />} />
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
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="membership" element={<Membership />} />
          <Route path="blog" element={<BlogAdminPage />} />
          <Route path="blog/create" element={<BlogFormPage />} />
          <Route path="blog/edit/:id" element={<BlogFormPage />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="community" element={<Community />} />
          <Route path="feedback" element={<Feedback />} />
          {/* <Route path="user-profiles" element={<UserProfiles />} /> */}
          <Route path="badges" element={<Badges />} />
          <Route path="settings" element={<Settings />} />
          <Route path="survey-management" element={<AdminSurveyManagement />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* Coach Route + Bảo vệ bằng role coach */}
            <Route path="/coach" element={
            <CoachProtectedRoute>
            <CoachLayout />
            </CoachProtectedRoute>
          }
        >
          <Route path="dashboard" element={<CoachDashboard />} />
          <Route path="profile" element={<CoachProfile />} />  
          <Route path="*" element={<Navigate to="/coach/dashboard" replace />} />
          <Route path="clients" element={<CoachUserList />} />
        </Route>
      </Routes>
    </Router>
  </>
);

export default App;