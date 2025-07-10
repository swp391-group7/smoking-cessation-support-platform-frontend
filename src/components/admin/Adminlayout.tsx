// AdminLayout.tsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import {
  Award,
  Bell,
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
        path: "/admin/dashboard",
        icon: LayoutDashboard,
        description: "System overview",
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        name: "Users",
        path: "/admin/users",
        icon: Users,
        description: "Manage members",
      },
      {
        name: "Quit Profiles",
        path: "/admin/quit-profiles",
        icon: Heart,
        description: "Track quitting progress",
      },
    ],
  },
  {
    title: "Content & Plans",
    items: [
      {
        name: "Membership Plans",
        path: "/admin/plans",
        icon: CreditCard,
        description: "Subscription plans",
      },
      {
        name: "Quit Plan Templates",
        path: "/admin/quit-plans",
        icon: Target,
        description: "Quit plan templates",
      },
      {
        name: "Blog & Articles",
        path: "/admin/blog",
        icon: FileText,
        description: "Blog content",
      },
      {
        name: "Survey Management", 
        path: "/admin/survey-management",
        icon: FileText,
        description: "Manage surveys",
      },
    ],
  },
  {
    title: "Engagement & Motivation",
    items: [
      {
        name: "Badges",
        path: "/admin/badges",
        icon: Award,
        description: "Achievements",
      },
      {
        name: "Notifications",
        path: "/admin/notifications",
        icon: Bell,
        description: "Motivational messages",
      },
      {
        name: "Community",
        path: "/admin/community",
        icon: MessageCircle,
        description: "Forum & interactions",
      },
    ],
  },
  {
    title: "Feedback",
    items: [
      {
        name: "Feedback",
        path: "/admin/feedback",
        icon: Star,
        description: "User reviews & ratings",
      },
    ],
  },
];

const AdminLayout: React.FC = () => {
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
            className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6"
            style={{
              overflow: "auto",
              height: "calc(100vh - 80px)",
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

export default AdminLayout;