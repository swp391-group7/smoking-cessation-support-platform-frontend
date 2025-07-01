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
        description: "Tổng quan hoạt động",
        badge: null,
      },
      {
        name: "Analytics",
        path: "/coach/analytics",
        icon: TrendingUp,
        description: "Phân tích hiệu suất",
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
        description: "Quản lý khách hàng",
        badge: "12",
      },
      {
        name: "Progress Tracking",
        path: "/coach/client-progress",
        icon: Heart,
        description: "Theo dõi tiến độ",
        badge: null,
      },
      {
        name: "Achievements",
        path: "/coach/achievements",
        icon: Award,
        description: "Thành tích khách hàng",
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
        description: "Kế hoạch tập luyện",
        badge: null,
      },
      {
        name: "Knowledge Base",
        path: "/coach/blog",
        icon: BookOpen,
        description: "Kiến thức chuyên môn",
        badge: null,
      },
      {
        name: "Quick Actions",
        path: "/coach/quick-actions",
        icon: Zap,
        description: "Thao tác nhanh",
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
        description: "Tin nhắn với khách hàng",
        badge: "3",
      },
      {
        name: "Notifications",
        path: "/coach/notifications",
        icon: Bell,
        description: "Thông báo hệ thống",
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
        description: "Lịch tư vấn",
        badge: null,
      },
      {
        name: "Reports",
        path: "/coach/reports",
        icon: BarChart3,
        description: "Báo cáo chi tiết",
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
      className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
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