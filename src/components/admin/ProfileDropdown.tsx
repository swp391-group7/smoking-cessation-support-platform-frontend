// components_admin/ProfileDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutAndRedirect } from "@/api/adminapi/logout";

interface AdminUser {
  id: string;
  full_name: string;
  role: string;
}

const ProfileDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAdmin({
          id: parsed.id,
          full_name: parsed.full_name,
          role: localStorage.getItem("role") || "Admin",
        });
      } catch {
        setAdmin(null);
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

  if (!admin) return null;

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setOpen(!open)} 
        className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-white/60 transition-all duration-200 shadow-sm hover:shadow-md group backdrop-blur-sm"
      >
        <div className="relative">
          <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <span className="text-white text-sm font-bold">
              {admin.full_name.charAt(0)}
            </span>
          </div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-semibold text-slate-700 group-hover:text-slate-800 transition-colors">
            {admin.full_name}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {admin.role}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-all duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-100/60 bg-gradient-to-r from-emerald-50/50 to-blue-50/50">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">
                  {admin.full_name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{admin.full_name}</p>
                <p className="text-xs text-slate-500 font-medium">{admin.role}</p>
                <p className="text-xs text-slate-400 mt-1">ID: {admin.id}</p>
              </div>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="py-2">
            <button 
              onClick={() => { 
                setOpen(false); 
                navigate("/admin/profile"); 
              }} 
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:text-slate-800 transition-all duration-200 group"
            >
              <User className="w-4 h-4 mr-3 text-slate-400 group-hover:text-emerald-500 transition-colors" /> 
              Personal Information
            </button>
            
            <div className="border-t border-slate-100/60 my-2"></div>
            
            <button 
              onClick={handleLogout} 
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-200 group"
            >
              <LogOut className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" /> 
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;