// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout";
import Home from "./pages/home";
import About from "./pages/platform/about";
import Contact from "./pages/platform/contact";
import LoginForm from './components/login-form.tsx'
import SignUpForm from './components/sign-in-form.tsx'

export const App = () => (
 
  <Router>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Trang chính */}
        <Route index element={<Home />} />
        {/* Public routes */}       
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<SignUpForm />} />
        {/* 404: tự redirect về home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </Router> 
)
export default App ;
