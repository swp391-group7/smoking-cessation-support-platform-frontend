// src/components/coach/Sidebar.tsx
import React from "react";
import { LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutAndRedirect } from "@/api/logout";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  badge?: string | null;
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
    <div
      className={`${
        open ? "w-80" : "w-20"
      } transition-all duration-300 bg-white/80 backdrop-blur-lg shadow-2xl border-r border-white/30 flex flex-col relative`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 via-emerald-600 to-lime-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            A
          </div>
          {open && (
            <div className="ml-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                AirBloom
              </h1>
              <p className="text-sm text-gray-600 font-medium">Coach Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        {menuItems.map((section, index) => (
          <div key={index} className="mb-8">
            {open && (
              <h3 className="px-4 mb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <nav className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`group relative flex items-center w-full px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg transform scale-[1.02]"
                        : "text-gray-700 hover:bg-white/60 hover:shadow-md hover:transform hover:scale-[1.01]"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        active
                          ? "text-white"
                          : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    />
                    {open && (
                      <div className="ml-4 flex-1 text-left">
                        <div className="font-semibold">{item.name}</div>
                        <div
                          className={`text-xs mt-0.5 ${
                            active ? "text-white/80" : "text-gray-500"
                          }`}
                        >
                          {item.description}
                        </div>
                      </div>
                    )}
                    {item.badge && open && (
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-bold rounded-full ${
                          item.badge === "New"
                            ? "bg-green-100 text-green-700"
                            : "bg-emerald-100 text-emerald-700"
                        } ${active ? "bg-white/20 text-white" : ""}`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.badge && !open && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="border-t border-gray-100 p-3">
        <button
          onClick={handleLogout}
          className="group flex items-center w-full px-4 py-3 text-sm font-medium rounded-2xl text-red-600 hover:bg-red-50 hover:shadow-md transition-all duration-200"
        >
          <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-700" />
          {open && (
            <span className="ml-4 font-semibold group-hover:text-red-700">
              Log out
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;