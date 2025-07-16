// src/pages/coach/CoachLayout.tsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/coach/Sidebar";
import Topbar from "@/components/coach/Topbar";
import {
  LayoutDashboard,
  Users,
  MessageCircle,
} from "lucide-react";

const menuItems = [
  {
    title: "Main",
    items: [
      {
        name: "Dashboard",
        path: "/coach/dashboard",
        icon: LayoutDashboard,
        description: "Activity overview",
        badge: null,
      },
      {
        name: "My Clients",
        path: "/coach/clients",
        icon: Users,
        description: "Manage your clients",
        badge: null,
      },
      {
        name: "Chat Room",
        path: "/coach/chat/1", // default userId
        icon: MessageCircle,
        description: "Chat with users",
        badge: null,
      },
    ],
  },
];

const CoachLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
      }}
    >
      <div className="flex h-full">
        <Sidebar open={sidebarOpen} menuItems={menuItems} />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar
            sidebarOpen={sidebarOpen}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
          <main
            className="flex-1 p-6"
            style={{
              overflow: "auto",
              height: "calc(100vh - 64px)",
            }}
          >
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CoachLayout;
