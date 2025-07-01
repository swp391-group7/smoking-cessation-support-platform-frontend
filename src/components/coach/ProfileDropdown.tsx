import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
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
          role: localStorage.getItem("role") || "Coach",
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
      <button onClick={() => setOpen(!open)} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
        <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">{coach.full_name.charAt(0)}</span>
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-700">{coach.full_name}</div>
          <div className="text-xs text-gray-500">{coach.role}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-3 border-b">
            <p className="text-sm font-medium text-gray-700">{coach.full_name}</p>
            <p className="text-xs text-gray-500">{coach.role}</p>
            <p className="text-xs text-gray-400 mt-1">ID: {coach.id}</p>
          </div>
          <div className="py-1">
            <button onClick={() => { setOpen(false); navigate("/coach/profile"); }} className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50">
              <User className="w-4 h-4 mr-3" /> Thông tin cá nhân
            </button>
            <button onClick={() => { setOpen(false); navigate("/coach/settings"); }} className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50">
              <Settings className="w-4 h-4 mr-3" /> Cài đặt
            </button>
            <hr className="my-1" />
            <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
              <LogOut className="w-4 h-4 mr-3" /> Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachProfileDropdown;