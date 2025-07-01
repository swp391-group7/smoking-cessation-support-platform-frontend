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
  Heart,
  LayoutDashboard,
  MessageCircle,
  Target,
  Users,
  TrendingUp,
  BookOpen,
  Zap,
} from "lucide-react";

const menuItems = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        path: "/coach/dashboard",
        icon: LayoutDashboard,
        description: "Activity overview",
        badge: null,
      },
      {
        name: "Analytics",
        path: "/coach/analytics",
        icon: TrendingUp,
        description: "Performance insights",
        badge: "New",
      },
    ],
  },
  {
    title: "Client Management",
    items: [
      {
        name: "My Clients",
        path: "/coach/clients",
        icon: Users,
        description: "Manage your clients",
        badge: "12",
      },
      {
        name: "Progress Tracking",
        path: "/coach/client-progress",
        icon: Heart,
        description: "Track client progress",
        badge: null,
      },
      {
        name: "Achievements",
        path: "/coach/achievements",
        icon: Award,
        description: "Client achievements",
        badge: null,
      },
    ],
  },
  {
    title: "Content & Resources",
    items: [
      {
        name: "Training Plans",
        path: "/coach/plans",
        icon: Target,
        description: "Workout programs",
        badge: null,
      },
      {
        name: "Knowledge Base",
        path: "/coach/blog",
        icon: BookOpen,
        description: "Professional knowledge",
        badge: null,
      },
      {
        name: "Quick Actions",
        path: "/coach/quick-actions",
        icon: Zap,
        description: "Fast operations",
        badge: null,
      },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        name: "Messages",
        path: "/coach/messages",
        icon: MessageCircle,
        description: "Chat with clients",
        badge: "3",
      },
      {
        name: "Notifications",
        path: "/coach/notifications",
        icon: Bell,
        description: "System notifications",
        badge: null,
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        name: "Sessions",
        path: "/coach/consultations",
        icon: Calendar,
        description: "Consultation schedule",
        badge: null,
      },
      {
        name: "Reports",
        path: "/coach/reports",
        icon: BarChart3,
        description: "Detailed reports",
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