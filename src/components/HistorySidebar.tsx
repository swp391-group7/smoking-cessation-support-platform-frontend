import  { useEffect, useState } from 'react';
import {  getActiveQuitPlan } from '../api/progressOverViewApi';
import { type DailyCheckinDto, getDailyCheckinsByPlanId } from '../api/historyApi';
import { type QuitPlanStepDto, getPlanSteps } from '../api/planStepProgressApi';

// Format helpers
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  });
const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: false
  });

export default function HistoryPage() {
  const [steps, setSteps] = useState<QuitPlanStepDto[]>([]);
  const [groupedByDate, setGroupedByDate] = useState<Record<string, DailyCheckinDto[]>>({});
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadAll() {
      try {
        const plan = await getActiveQuitPlan();
        const [planSteps, checks] = await Promise.all([
          getPlanSteps(plan.id),
          getDailyCheckinsByPlanId(plan.id),
        ]);

        const g: Record<string, DailyCheckinDto[]> = {};
        checks.forEach(c => {
          const d = c.logDate.slice(0, 10);
          if (!g[d]) g[d] = [];
          g[d].push(c);
        });

        setSteps(planSteps);
        setGroupedByDate(g);
      } catch (err) {
        console.error(err);
      }
    }
    loadAll();
  }, []);

  const toggle = (key: string) => {
    setExpandedDates(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex-1 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          Your Progress by Steps
        </h1>

        {steps.map(step => {
          const datesInStep = Object.keys(groupedByDate)
            .filter(dateKey => dateKey >= step.stepStartDate && dateKey <= step.stepEndDate)
            // Sắp xếp từ ngày nhỏ đến ngày lớn
            .sort((a, b) => (a > b ? 1 : -1));

          return (
            <div key={step.id} className="border border-green-200 rounded-lg mb-6 overflow-hidden">
              <div className="px-6 py-4 bg-green-100">
                <h2 className="text-xl font-semibold text-green-800">
                  Step {step.stepNumber}: {step.stepDescription}
                </h2>
                <p className="text-sm text-green-700">
                  {step.stepStartDate} – {step.stepEndDate}
                </p>
              </div>

              {datesInStep.length > 0 ? (
                datesInStep.map(dateKey => {
                  const key = `${step.id}_${dateKey}`;
                  const items = groupedByDate[dateKey];
                  return (
                    <div key={key} className="border-t">
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex justify-between items-center px-6 py-3 hover:bg-green-50"
                      >
                        <span className="text-green-800 font-medium">{formatDate(dateKey)}</span>
                        <span className="flex items-center text-green-600">
                          {items.length} {items.length > 1 ? 'entries' : 'entry'}
                          <span className="ml-2 text-lg">{expandedDates[key] ? '▼' : '►'}</span>
                        </span>
                      </button>
                      {expandedDates[key] && (
                        <div className="px-6 py-4">
                          {items.map(item => (
                            <div key={item.id} className="flex items-center gap-4 mb-4">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                  item.status === 'COMPLETED' ? 'bg-green-500' : 'bg-red-500'
                                }`}
                              >
                                {item.status === 'COMPLETED' ? '✓' : '✗'}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-800">{formatTime(item.logDate)}</p>
                                <p className="text-sm">Mood: <span className="font-medium">{item.mood}</span></p>
                                <p className="text-sm">
                                  Cigarettes: <span className="font-medium">{item.cigarettesSmoked}</span>
                                </p>
                                {item.note && (
                                  <p className="text-sm italic text-gray-500 mt-1">“{item.note}”</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-6 py-4 text-gray-500 italic">
                  No progress yet in this step.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
