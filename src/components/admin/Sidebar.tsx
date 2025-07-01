// components_admin/Sidebar.tsx
import React from "react";
import { LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutAndRedirect } from "@/api/adminapi/logout";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface SidebarProps {
  open: boolean;
  menuItems: MenuSection[];
}

const Sidebar: React.FC<SidebarProps> = ({ open, menuItems }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logoutAndRedirect(navigate);
  };

  return (
    <div className={`${open ? "w-80" : "w-20"} transition-all duration-300 bg-white/90 backdrop-blur-lg shadow-xl border-r border-white/30 flex flex-col relative overflow-hidden`}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-blue-50/30 to-indigo-50/50"></div>
      
      {/* Logo */}
      <div className="relative p-6 border-b border-white/30">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              A
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
          </div>
          {open && (
            <div className="ml-4 transition-all duration-300">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                AirBloom
              </h1>
              <p className="text-sm text-slate-500 font-medium">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="relative flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {menuItems.map((section, index) => (
          <div key={index} className="mb-8">
            {open && (
              <h3 className="px-6 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <nav className="space-y-2 px-4">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`group relative flex items-center w-full px-4 py-4 text-sm font-medium rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                      active 
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25" 
                        : "text-slate-600 hover:bg-white/60 hover:text-slate-800 hover:shadow-md"
                    }`}
                  >
                    {active && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 opacity-20 animate-pulse"></div>
                    )}
                    <Icon className={`relative w-5 h-5 ${
                      active ? "text-white" : "text-slate-400 group-hover:text-emerald-500"
                    } transition-colors duration-200`} />
                    {open && (
                      <div className="relative ml-4 flex-1 text-left">
                        <div className={`font-semibold ${active ? "text-white" : ""}`}>
                          {item.name}
                        </div>
                        <div className={`text-xs mt-0.5 ${
                          active ? "text-emerald-100" : "text-slate-400"
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    )}
                    {!open && active && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="relative border-t border-white/30 p-4">
        <button
          onClick={handleLogout}
          className="group flex items-center w-full px-4 py-4 text-sm font-medium rounded-2xl text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 transform hover:scale-[1.02]"
        >
          <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          {open && <span className="ml-4 font-semibold">Đăng xuất</span>}
          {!open && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
              Đăng xuất
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;