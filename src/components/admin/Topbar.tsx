// components_admin/Topbar.tsx
import React from "react";
import { Bell, Menu, Search, X } from "lucide-react";
import ProfileDropdown from "@/components/admin/ProfileDropdown";

interface TopbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5"></div>
      <div className="relative flex items-center justify-between h-20">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-3 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-white/60 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex-1 max-w-2xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm trong hệ thống..."
                className="block w-full pl-12 pr-4 py-3 border border-slate-200/60 rounded-2xl leading-5 bg-white/60 backdrop-blur-sm placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="relative p-3 text-slate-600 hover:text-slate-800 hover:bg-white/60 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 ring-2 ring-white shadow-lg">
              <span className="block h-full w-full rounded-full bg-red-400 animate-ping opacity-75"></span>
              <span className="absolute inset-0 rounded-full bg-red-500"></span>
            </span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
          </button>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Topbar;