// src/pages/coach/CoachLayout.tsx

import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/coach/Sidebar";
import Topbar from "@/components/coach/Topbar";
import {
  Award,
  BarChart3,
  Bell,
  Calendar,
  CreditCard,
  FileText,
  Heart,
  LayoutDashboard,
  MessageCircle,
  Star,
  Target,
  Users,
} from "lucide-react";

const menuItems = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        path: "/coach/dashboard",
        icon: LayoutDashboard,
        description: "Coach overview",
      },
    ],
  },
  {
    title: "Clients",
    items: [
      {
        name: "My Clients",
        path: "/coach/clients",
        icon: Users,
        description: "Manage assigned clients",
      },
      {
        name: "Progress Tracking",
        path: "/coach/client-progress",
        icon: Heart,
        description: "Track client progress",
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        name: "Plans",
        path: "/coach/plans",
        icon: Target,
        description: "Assigned plans",
      },
      {
        name: "Articles",
        path: "/coach/blog",
        icon: FileText,
        description: "Health blog articles",
      },
    ],
  },
  {
    title: "Engagement",
    items: [
      {
        name: "Notifications",
        path: "/coach/notifications",
        icon: Bell,
        description: "Motivational messages",
      },
      {
        name: "Community",
        path: "/coach/community",
        icon: MessageCircle,
        description: "Forum & interactions",
      },
    ],
  },
  {
    title: "Reports",
    items: [
      {
        name: "Reports",
        path: "/coach/reports",
        icon: BarChart3,
        description: "Client analytics",
      },
      {
        name: "Sessions",
        path: "/coach/consultations",
        icon: Calendar,
        description: "Consultation schedules",
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
      className="bg-gray-50"
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
            className="flex-1 bg-gray-50 p-6"
            style={{
              overflow: "auto",
              height: "calc(100vh - 64px)",
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default CoachLayout;