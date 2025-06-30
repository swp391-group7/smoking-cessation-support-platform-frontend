// src/components/coach/Sidebar.tsx
import React from "react";
import { Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

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

  return (
    <div
      className={`${
        open ? "w-80" : "w-20"
      } transition-all duration-300 bg-white shadow-lg border-r flex flex-col`}
    >
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            C
          </div>
          {open && (
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-800">AirBloom</h1>
              <p className="text-sm text-gray-500">Coach Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-4">
        {menuItems.map((section, index) => (
          <div key={index} className="mb-6">
            {open && (
              <h3 className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase">
                {section.title}
              </h3>
            )}
            <nav className="space-y-1 px-3">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`group flex items-center w-full px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      active
                        ? "bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        active
                          ? "text-emerald-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    {open && (
                      <div className="ml-3 flex-1 text-left">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="border-t p-3">
        <button
          onClick={() => navigate("/coach/settings")}
          className="group flex items-center w-full px-3 py-3 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
          {open && <span className="ml-3">Cài đặt</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;