import React from 'react';
import ProgressOverview from '../../components/ProgressOverview';
import DailyCheckIn from '../../components/DailyCheckIn';
import ProgressChart from '../../components/ProgressChart';
import HistorySidebar from '../../components/HistorySidebar';
import RemindersSidebar from '../../components/RemindersSidebar';
import BadgesSidebar from '../../components/BadgesSidebar';
import AnimatedElements from '@/components/AnimatedElements';

type DailyFormValues = {
  numCigarettes: number;
  smokedToday: boolean;
};

export default function Quit_Progress() {
  // Mock data - replace these with API calls later
  const progressData = {
    daysSmokesFree: 17,
    moneySaved: 85,
    cigarettesAvoided: 340
  };

  const chartData = [
    { date: "Jun 5", smoked: 1, saved: 5 },
    { date: "Jun 6", smoked: 0, saved: 10 },
    { date: "Jun 7", smoked: 2, saved: 20 },
    { date: "Jun 8", smoked: 0, saved: 30 },
    { date: "Jun 9", smoked: 0, saved: 40 },
    { date: "Jun 10", smoked: 0, saved: 50 },
    { date: "Jun 16", smoked: 1, saved: 60 },
  ];

  const history = [
    { date: "Jun 16, 2025", text: "Smoked 1 cigarette", success: false },
    { date: "Jun 16, 2025", text: "Smoked 1 cigarette", success: false },
    { date: "Jun 16, 2025", text: "Smoked 3 cigarettes", success: false },
    { date: "Jun 16, 2025", text: "Smoked 1 cigarette", success: false },
    { date: "Jun 16, 2025", text: "Smoked 1 cigarette", success: false },
    { date: "Jun 16, 2025", text: "Smoked 1 cigarette", success: false },
    { date: "Jun 16, 2025", text: "Smoke-free day", success: true },
    { date: "Jun 16, 2025", text: "Smoke-free day", success: true },
    { date: "Jun 16, 2025", text: "Smoked 1 cigarette", success: false },
    { date: "Jun 10, 2025", text: "Smoke-free day", success: true },
    { date: "Jun 9, 2025", text: "Smoke-free day", success: true },
    { date: "Jun 8, 2025", text: "Smoked 2 cigarettes", success: false },
    { date: "Jun 7, 2025", text: "Smoke-free day", success: true },
    { date: "Jun 6, 2025", text: "Smoke-free day", success: true },
    { date: "Jun 5, 2025", text: "Smoked 1 cigarette", success: false },
  ];

  const reminders = [
    { time: "10:00 AM", text: "Stay strong! First week is the hardest", icon: "📘" },
    { time: "2:30 PM", text: "Remember to drink water when you have cravings", icon: "💧" },
    { time: "5:45 PM", text: "You've saved enough for a nice dinner!", icon: "🍽️" },
  ];

  const badges = [
    { name: "First Day", description: "Completed your first smoke-free day", earned: true, icon: "🥇" },
    { name: "One Week", description: "One week without smoking", earned: true, icon: "🎉" },
    { name: "Money Saver", description: "Saved your first $50", earned: true, icon: "💰" },
    { name: "Health Boost", description: "Your lungs are healing", earned: false, icon: "🫁" },
    { name: "Two Weeks", description: "Two weeks smoke-free", earned: false, icon: "⚠️" },
    { name: "Long Distance", description: "One month without smoking", earned: false, icon: "🏃" },
  ];

  const handleDailyCheckIn = (data: DailyFormValues) => {
    console.log("Daily check-in submitted:", data);
    // TODO: Replace with API call
    // Example: await submitDailyCheckIn(data);
  };

  return (
    <div className="flex p-6 gap-6 bg-gray-50 min-h-screen">
      <AnimatedElements />
      {/* Left Main Content */}
      <div className="flex-1 space-y-6">
        <ProgressOverview 
          daysSmokesFree={progressData.daysSmokesFree}
          moneySaved={progressData.moneySaved}
          cigarettesAvoided={progressData.cigarettesAvoided}
        />
        
        <DailyCheckIn onSubmit={handleDailyCheckIn} />
        
        <ProgressChart chartData={chartData} />
      </div>

      {/* Sidebar */}
      <div className="w-80 space-y-6">
        <HistorySidebar history={history} />
        <RemindersSidebar reminders={reminders} />
        <BadgesSidebar badges={badges} />
      </div>
    </div>
  );
}