import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { useForm } from "react-hook-form";

type DailyFormValues = {
  numCigarettes: number;
};

export default function Quit_Plan() {
  const { register, handleSubmit, setValue, reset } = useForm<DailyFormValues>();
  const [smokedToday, setSmokedToday] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'cigarettes' | 'money'>("cigarettes");

  const onSubmit = (data: DailyFormValues) => {
    console.log("Submitted:", data);
    reset();
    setSmokedToday(null);
    setSubmitted(true);
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

  return (
    <div className="flex p-6 gap-6 bg-gray-50 min-h-screen">

      {/* Left Main Content */}
      <div className="flex-1 space-y-6">

        {/* Progress Overview */}
        <div className="flex gap-6">
          <div className="flex-1 bg-white rounded-md p-4 shadow">
            <h3 className="font-semibold mb-2">Days Smoke-Free</h3>
            <p className="text-4xl font-bold text-center text-blue-600">17</p>
            <p className="text-center text-sm text-gray-500">You have been smoke-free for 17 days</p>
          </div>

          <div className="flex-1 bg-white rounded-md p-4 shadow">
            <h3 className="font-semibold mb-2">Money Saved</h3>
            <p className="text-4xl font-bold text-center text-green-600">$85</p>
            <p className="text-center text-sm text-gray-500">By not smoking 340 cigarettes</p>
          </div>
        </div>

        {/* Daily Check-In */}
        <div className="bg-white rounded-md p-6 shadow relative overflow-hidden">
          <h2 className="font-semibold text-lg mb-4">Daily Check-In</h2>
          
          {!submitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 transition-all duration-500">
              <div>
                <label className="font-medium">Did you smoke today?</label>
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={smokedToday === false} 
                      onChange={() => { setSmokedToday(false); setValue("numCigarettes", 0); }}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-green-600 font-medium">No</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={smokedToday === true} 
                      onChange={() => { setSmokedToday(true); setValue("numCigarettes", 1); }}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-red-500 font-medium">Yes</span>
                  </label>
                </div>
              </div>

              {smokedToday === true && (
                <div className="animate-fade-in">
                  <label className="font-medium text-gray-700">How many cigarettes?</label>
                  <input 
                    type="number" 
                    min={1} 
                    {...register("numCigarettes", { valueAsNumber: true })} 
                    className="border-2 border-gray-300 p-3 rounded-lg w-40 mt-2 focus:border-blue-500 focus:outline-none transition-colors" 
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={smokedToday === null} 
                className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 transform ${
                  smokedToday !== null 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 shadow-lg hover:shadow-xl' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Submit Daily Check-In
              </button>
            </form>
          ) : (
            <div className="text-center py-12 animate-fade-in-scale">
              <div className="mb-6">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600 text-lg font-medium">
                  Your daily check-in has been recorded successfully
                </p>
              </div>
              
              <div className="flex justify-center space-x-4 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              
              <button 
                onClick={() => {setSubmitted(false); setSmokedToday(null);}} 
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
              >
                New Check-In
              </button>
            </div>
          )}
          
          <style>{`
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes fade-in-scale {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }
            
            .animate-fade-in {
              animation: fade-in 0.5s ease-out;
            }
            
            .animate-fade-in-scale {
              animation: fade-in-scale 0.6s ease-out;
            }
          `}</style>
        </div>

        {/* Progress Chart */}
        <div className="bg-white rounded-md p-6 shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Progress Chart</h3>
            <div className="space-x-2">
              <button onClick={() => setActiveTab('cigarettes')} className={`${activeTab === 'cigarettes' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} px-4 py-1 rounded-md`}>Cigarettes</button>
              <button onClick={() => setActiveTab('money')} className={`${activeTab === 'money' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} px-4 py-1 rounded-md`}>Money Saved</button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={activeTab === 'cigarettes' ? 'smoked' : 'saved'}
                stroke={activeTab === 'cigarettes' ? '#EF4444' : '#10B981'}
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Sidebar */}
      <div className="w-80 space-y-6">

        <div className="bg-white rounded-md p-4 shadow h-fit">
          <h3 className="font-semibold mb-3 text-gray-800">History</h3>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {history.map((h, idx) => (
              <div key={idx} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${h.success ? 'bg-green-500' : 'bg-red-500'}`}>
                  {h.success ? '✓' : '✗'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{h.date}</p>
                  <p className={`text-sm ${h.success ? 'text-green-600' : 'text-red-600'}`}>{h.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-md p-4 shadow h-fit">
          <h3 className="font-semibold mb-3 text-gray-800">Reminders</h3>
          <div className="space-y-3">
            {reminders.map((r, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <span className="text-lg">{r.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{r.text}</p>
                  <p className="text-xs text-blue-600 mt-1">{r.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-md p-4 shadow h-fit">
          <h3 className="font-semibold mb-3 text-gray-800">Badges</h3>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge, idx) => (
              <div key={idx} className={`p-3 rounded-lg border-2 text-center transition-all ${badge.earned ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                <div className="text-2xl mb-1">{badge.icon}</div>
                <p className={`text-xs font-semibold ${badge.earned ? 'text-blue-700' : 'text-gray-500'}`}>{badge.name}</p>
                <p className={`text-xs mt-1 ${badge.earned ? 'text-blue-600' : 'text-gray-400'}`}>{badge.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}