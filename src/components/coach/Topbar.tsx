// src/components/coach/Topbar.tsx
import React from "react";
import { Bell, Menu, Search, X, Filter, Plus } from "lucide-react";
import ProfileDropdown from "@/components/coach/ProfileDropdown";

interface TopbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center flex-1">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-white/60 focus:outline-none transition-all duration-200"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="ml-6 flex-1 max-w-2xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng, kế hoạch, báo cáo..."
                className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl leading-5 bg-white/60 backdrop-blur-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-white/60 rounded-xl transition-all duration-200 group">
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          
          <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-white/60 rounded-xl relative transition-all duration-200 group">
            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-gradient-to-r from-red-400 to-pink-500 ring-2 ring-white animate-pulse" />
          </button>
          
          <div className="h-8 w-px bg-gray-200"></div>
          
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Topbar;