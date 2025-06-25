import React from "react";

interface Props {
  notification: {
    id: number;
    title: string;
    content: string;
    time: string;
    type: "info" | "new" | "error";
  };
}

export default function NotificationItem({ notification }: Props) {
  const color =
    notification.type === "new"
      ? "border-red-500"
      : notification.type === "error"
      ? "border-yellow-500"
      : "border-blue-500";

  return (
    <div className={`border-l-4 pl-4 py-2 ${color} bg-white rounded shadow`}>
      <p className="font-medium">{notification.title}</p>
      <p className="text-sm text-gray-600">{notification.content}</p>
      <p className="text-xs text-gray-400">{notification.time}</p>
    </div>
  );
}
