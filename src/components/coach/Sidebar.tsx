import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, MessageCircle, Settings, LogOut } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { pathname } = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: <Home size={18} />, path: '/coach/dashboard' },
    { name: 'Statistics', icon: <BarChart2 size={18} />, path: '/coach/statistics' },
    { name: 'Messages', icon: <MessageCircle size={18} />, path: '/coach/messages' },
    { name: 'Settings', icon: <Settings size={18} />, path: '/coach/settings' },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg h-full p-4">
      <div className="text-center mb-6">
        <img
          src="https://via.placeholder.com/80"
          className="w-20 h-20 rounded-full mx-auto"
          alt="Coach avatar"
        />
        <h2 className="mt-2 text-lg font-semibold">Coach Name</h2>
        <p className="text-sm text-gray-500">Fitness Coach</p>
      </div>
      <nav className="space-y-2">
        {navItems.map(({ name, icon, path }) => (
          <Link
            key={name}
            to={path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-100 transition ${
              pathname === path ? 'bg-blue-200 text-blue-900' : 'text-gray-700'
            }`}
          >
            {icon} <span>{name}</span>
          </Link>
        ))}
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-100 w-full mt-6">
          <LogOut size={18} /> Logout
        </button>
      </nav>
    </aside>
  );
};

