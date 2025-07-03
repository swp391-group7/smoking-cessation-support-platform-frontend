import React from 'react';
import { Clock, Bell } from 'lucide-react';

interface Reminder {
  time: string;
  text: string;
  icon: string;
}

interface RemindersSidebarProps {
  reminders: Reminder[];
}

const RemindersSidebar: React.FC<RemindersSidebarProps> = ({ reminders }) => {
  const defaultReminders: Reminder[] = [
    { time: '09:00 AM', text: 'Morning standup meeting with development team', icon: '👥' },
    { time: '11:30 AM', text: 'Review project requirements document', icon: '📋' },
   
  ];

  const displayReminders = reminders.length > 0 ? reminders : defaultReminders;

  return (
    <div className="bg-gradient-to-br from-white to-green-50 rounded-lg p-4 shadow-lg border border-green-100 h-fit">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-green-500 rounded-lg">
          <Bell className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold text-green-800">Reminders</h3>
      </div>

      {/* Reminders List */}
      <div className="space-y-2">
        {displayReminders.map((reminder, idx) => (
          <div
            key={idx}
            className="group bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 border border-green-100 hover:border-green-200 cursor-pointer"
          >
            {/* Content */}
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm">{reminder.icon}</span>
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-green-800 text-sm leading-tight mb-1">
                  {reminder.text}
                </p>
                
                {/* Time */}
                <div className="flex items-center gap-1 text-green-600">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">{reminder.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-green-100">
        <div className="flex items-center justify-between text-xs text-green-600">
          <span>{displayReminders.length} items</span>
          <button className="hover:text-green-700 transition-colors">
            View all →
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemindersSidebar;