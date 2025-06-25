import React, { useState } from "react";
import NotificationTabs from "@/components/admin/NotificationTabs";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("Messages");

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Notification Center</h1>
      <NotificationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}