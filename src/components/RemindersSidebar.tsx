import React from 'react';

interface Reminder {
  time: string;
  text: string;
  icon: string;
}

interface RemindersSidebarProps {
  reminders: Reminder[];
}

const RemindersSidebar: React.FC<RemindersSidebarProps> = ({ reminders }) => {
  return (
    <div className="bg-white rounded-md p-4 shadow h-fit">
      <h3 className="font-semibold mb-3 text-gray-800">Reminders</h3>
      <div className="space-y-3">
        {reminders.map((r, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400"
          >
            <span className="text-lg">{r.icon}</span>
            <div className="flex-1">
              <p className="font-medium text-gray-800 text-sm">{r.text}</p>
              <p className="text-xs text-blue-600 mt-1">{r.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RemindersSidebar;