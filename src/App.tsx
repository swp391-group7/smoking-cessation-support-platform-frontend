// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout";
import Home from "./pages/home";
import LoginForm from './components/login-form.tsx'
import SignUpForm from './components/sign-in-form.tsx'
import Quit_Plan from "./pages/platform/quit_plan.tsx";
import Quit_Survey from "./pages/platform/quit_survey.tsx";
import UserSurvey from "./pages/platform/user_survey.tsx";




export const App = () => (
 
  <Router>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Trang chính */}
        <Route index element={<Home />} />
        {/* Public routes */}       
        <Route path="login" element={<LoginForm/>} />
        <Route path="register" element={<SignUpForm />} />
        
        <Route path="quit_plan" element={<Quit_Plan/>} />
        <Route path="quit_survey" element={<Quit_Survey/>} />
        {/* 404: tự redirect về home */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="user_survey" element={<UserSurvey />} />
      </Route>
    </Routes>
  </Router> 
)
export default App ;
