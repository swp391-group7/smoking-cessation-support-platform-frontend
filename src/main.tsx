import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './components/navbar.tsx'
import Footer from './components/footer.tsx'
import { Header } from './components/header.tsx'
import MainLayout from './layout.tsx'
import LoginForm from './components/login-form.tsx'
import SignUpForm from './components/sign-in-form.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoginForm />
  </StrictMode>,
)
