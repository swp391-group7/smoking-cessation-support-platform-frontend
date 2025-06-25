import React, { useEffect, useState } from "react";
import NotificationItem from "./NotificationItem";

interface Notification {
  id: number;
  title: string;
  content: string;
  time: string;
  type: "info" | "new" | "error";
}

interface Props {
  category: string;
}

export default function NotificationList({ category }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fake API
    setTimeout(() => {
      const mock: Notification[] = [
        {
          id: 1,
          title: "System Maintenance",
          content: "Scheduled maintenance at 10 PM.",
          time: "Today 3:45 PM",
          type: "info",
        },
        {
          id: 2,
          title: "New Message",
          content: "You have a new reply in community forum.",
          time: "Today 2:00 PM",
          type: "new",
        },
        {
          id: 3,
          title: "Error Log Detected",
          content: "System error occurred in report generator.",
          time: "Today 1:00 PM",
          type: "error",
        },
      ];
      setNotifications(
        mock.filter(
          (n) => category === "Messages" || n.type === category.toLowerCase()
        )
      );
      setLoading(false);
    }, 500);
  }, [category]);

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-gray-400">No notifications.</p>
      ) : (
        notifications.map((n) => <NotificationItem key={n.id} notification={n} />)
      )}
    </div>
  );
}