import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
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
    title: "Feedback & Reports",
    items: [
      {
        name: "Feedback",
        path: "/admin/feedback",
        icon: Star,
        description: "User reviews & ratings",
      },
      {
        name: "Reports",
        path: "/admin/reports",
        icon: BarChart3,
        description: "Detailed analytics",
      },
      {
        name: "Consultations",
        path: "/admin/consultations",
        icon: Calendar,
        description: "Consultation schedules",
      },
    ],
  },
];
// You can freely modify these sections as you add more pages, just remember to update App.tsx

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} menuItems={menuItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;