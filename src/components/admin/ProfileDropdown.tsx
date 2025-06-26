// components_admin/ProfileDropdown.tsx
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"; // đảm bảo bạn dùng đúng alias path
import { LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown: React.FC = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (!user) return null; // nếu chưa login thì không hiển thị gì

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
          <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user.full_name?.charAt(0).toUpperCase() || "A"}
            </span>
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-gray-700">
              {user.full_name || "Admin"}
            </div>
            <div className="text-xs text-gray-500">{role || "Admin"}</div>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user.full_name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/admin/profile")}> 
          <User className="mr-2 h-4 w-4" />
          <span>Thông tin cá nhân</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/admin/settings")}> 
          <Settings className="mr-2 h-4 w-4" />
          <span>Cài đặt</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;