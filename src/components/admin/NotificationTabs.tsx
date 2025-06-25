import React from "react";
import NotificationList from "./NotificationList";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = ["Messages", "Events", "System Errors"];

export default function NotificationTabs({ activeTab, setActiveTab }: Props) {
  return (
    <div>
      <div className="flex gap-2 border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-black"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <NotificationList category={activeTab} />
    </div>
  );
}