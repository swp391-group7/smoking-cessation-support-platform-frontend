// components_admin/ProfileDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const admin = {
    full_name: "Admin User",
    role: "Super Admin"
  };

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
    alert("Đăng xuất thành công!");
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
        <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">{admin.full_name.charAt(0)}</span>
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-700">{admin.full_name}</div>
          <div className="text-xs text-gray-500">{admin.role}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-3 border-b">
            <p className="text-sm font-medium text-gray-700">{admin.full_name}</p>
            <p className="text-xs text-gray-500">{admin.role}</p>
          </div>
          <div className="py-1">
            <button onClick={() => { setOpen(false); navigate("/admin/profile"); }} className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50">
              <User className="w-4 h-4 mr-3" /> Thông tin cá nhân
            </button>
            <button onClick={() => { setOpen(false); navigate("/admin/settings"); }} className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50">
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

export default ProfileDropdown;