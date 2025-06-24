// components_admin/AdminLayout.tsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { Award, BarChart3, Bell, Calendar, CreditCard, FileText, Heart, LayoutDashboard, MessageCircle, Star, Target, Users } from "lucide-react";

const menuItems = [
  {
    title: "Tổng quan",
    items: [{ name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, description: "Thống kê tổng quan" }]
  },
  {
    title: "Quản lý người dùng",
    items: [
      { name: "Người dùng", path: "/admin/users", icon: Users, description: "Quản lý thành viên" },
      { name: "Hồ sơ cai thuốc", path: "/admin/quit-profiles", icon: Heart, description: "Theo dõi tiến trình" }
    ]
  },
  {
    title: "Nội dung & Kế hoạch",
    items: [
      { name: "Gói thành viên", path: "/admin/plans", icon: CreditCard, description: "Subscription plans" },
      { name: "Kế hoạch cai thuốc", path: "/admin/quit-plans", icon: Target, description: "Template kế hoạch" },
      { name: "Blog & Bài viết", path: "/admin/blog", icon: FileText, description: "Nội dung blog" }
    ]
  },
  {
    title: "Tương tác & Động lực",
    items: [
      { name: "Huy hiệu", path: "/admin/badges", icon: Award, description: "Thành tích" },
      { name: "Thông báo", path: "/admin/notifications", icon: Bell, description: "Thông báo" },
      { name: "Cộng đồng", path: "/admin/community", icon: MessageCircle, description: "Diễn đàn" }
    ]
  },
  {
    title: "Phản hồi & Báo cáo",
    items: [
      { name: "Feedback", path: "/admin/feedback", icon: Star, description: "Đánh giá người dùng" },
      { name: "Báo cáo", path: "/admin/reports", icon: BarChart3, description: "Thống kê chi tiết" },
      { name: "Lịch tư vấn", path: "/admin/consultations", icon: Calendar, description: "Lịch hẹn tư vấn" }
    ]
  }
];
//co the sua them tuy y cac trang và nhớ cập nhật App.tsx là dc


const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} menuItems={menuItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;