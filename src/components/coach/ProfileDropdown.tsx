// src/components/coach/ProfileDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, Settings, User, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutAndRedirect } from "@/api/logout";

interface CoachUser {
  id: string;
  full_name: string;
  role: string;
}

const CoachProfileDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [coach, setCoach] = useState<CoachUser | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCoach({
          id: parsed.id,
          full_name: parsed.full_name,
          role: localStorage.getItem("role") || "Professional Coach",
        });
      } catch {
        setCoach(null);
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutAndRedirect(navigate);
  };

  if (!coach) return null;

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setOpen(!open)} 
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/80 backdrop-blur-sm transition-all duration-200 group"
      >
        <div className="relative">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">{coach.full_name.charAt(0)}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 border-2 border-white rounded-full"></div>
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-semibold text-gray-800">{coach.full_name}</div>
          <div className="text-xs text-blue-600 font-medium">{coach.role}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">{coach.full_name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-semibold">{coach.full_name}</p>
                <p className="text-xs opacity-90">{coach.role}</p>
                <p className="text-xs opacity-75 mt-1">ID: {coach.id}</p>
              </div>
            </div>
          </div>
          
          <div className="py-2">
            <button 
              onClick={() => { setOpen(false); navigate("/coach/profile"); }} 
              className="flex items-center w-full px-4 py-3 text-sm hover:bg-blue-50 transition-colors group"
            >
              <User className="w-4 h-4 mr-3 text-gray-500 group-hover:text-blue-600" /> 
              <span className="group-hover:text-blue-600">Thông tin cá nhân</span>
            </button>
            
            <button 
              onClick={() => { setOpen(false); navigate("/coach/settings"); }} 
              className="flex items-center w-full px-4 py-3 text-sm hover:bg-blue-50 transition-colors group"
            >
              <Settings className="w-4 h-4 mr-3 text-gray-500 group-hover:text-blue-600" /> 
              <span className="group-hover:text-blue-600">Cài đặt</span>
            </button>
            
            <button 
              onClick={() => { setOpen(false); navigate("/coach/help"); }} 
              className="flex items-center w-full px-4 py-3 text-sm hover:bg-blue-50 transition-colors group"
            >
              <HelpCircle className="w-4 h-4 mr-3 text-gray-500 group-hover:text-blue-600" /> 
              <span className="group-hover:text-blue-600">Trợ giúp</span>
            </button>
            
            <div className="h-px bg-gray-200 my-2 mx-4"></div>
            
            <button 
              onClick={handleLogout} 
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
            >
              <LogOut className="w-4 h-4 mr-3 group-hover:text-red-700" /> 
              <span className="group-hover:text-red-700">Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachProfileDropdown;