import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Cigarette, TrendingUp, Flame } from 'lucide-react';
import { 
  getActiveQuitPlan, 
  countUniqueProgressDays, 
  getAvoidedCigarettes, 
  getMoneySaved,
  getCurrentZeroStreak,
  type QuitPlanDto 
} from '../api/progressoverviewApi';

interface ProgressData {
  daysSmokesFree: number;
  currentStreak: number;
  moneySaved: number;
  cigarettesAvoided: number;
}

const ProgressOverview: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressData>({
    daysSmokesFree: 0,
    currentStreak: 0,
    moneySaved: 0,
    cigarettesAvoided: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Get active quit plan (API automatically fetches userId from token)
        const quitPlan: QuitPlanDto = await getActiveQuitPlan();
        
        // 2. Call remaining APIs in parallel with planId
        const [daysSmokesFree, cigarettesAvoided, moneySaved, currentStreak] = await Promise.all([
          countUniqueProgressDays(quitPlan.id),
          getAvoidedCigarettes(quitPlan.id),
          getMoneySaved(quitPlan.id),
          getCurrentZeroStreak()
        ]);

        setProgressData({
          daysSmokesFree,
          currentStreak,
          moneySaved,
          cigarettesAvoided
        });

      } catch (err) {
        console.error('Error fetching progress data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-md border animate-pulse">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-gray-200 rounded-lg w-8 h-8"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="text-center">
              <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Days Smoke-Free */}
      <div className="bg-white rounded-lg p-4 shadow-md border border-green-200 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-green-500 rounded-lg">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-green-800">Days Smoke-Free</h3>
        </div>
        
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600 mb-1">{progressData.daysSmokesFree}</p>
          <p className="text-sm text-green-700">
            days smoke-free
          </p>
        </div>
        
        <div className="mt-3 text-center">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Great progress!
          </span>
        </div>
      </div>

      {/* Current Streak */}
      <div className="bg-white rounded-lg p-4 shadow-md border border-lime-200 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-lime-500 rounded-lg">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-lime-800">Current Streak</h3>
        </div>
        
        <div className="text-center">
          <p className="text-3xl font-bold text-lime-600 mb-1">{progressData.currentStreak}</p>
          <p className="text-sm text-lime-700">
            consecutive days
          </p>
        </div>
        
        <div className="mt-3 flex items-center justify-center gap-1 text-xs text-lime-600">
          <TrendingUp className="w-3 h-3" />
          <span>Keep the streak going!</span>
        </div>
      </div>

      {/* Money Saved */}
      <div className="bg-white rounded-lg p-4 shadow-md border border-emerald-200 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <DollarSign className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-emerald-800">Money Saved</h3>
        </div>
        
        <div className="text-center">
          <p className="text-3xl font-bold text-emerald-600 mb-1">${progressData.moneySaved.toLocaleString()}</p>
          <p className="text-sm text-emerald-700">
            USD saved
          </p>
        </div>
        
        <div className="mt-3 flex items-center justify-center gap-1 text-xs text-emerald-600">
          <TrendingUp className="w-3 h-3" />
          <span>Savings increasing!</span>
        </div>
      </div>

      {/* Cigarettes Avoided */}
      <div className="bg-white rounded-lg p-4 shadow-md border border-teal-200 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-teal-500 rounded-lg">
            <Cigarette className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-teal-800">Cigarettes Avoided</h3>
        </div>
        
        <div className="text-center">
          <p className="text-3xl font-bold text-teal-600 mb-1">{progressData.cigarettesAvoided}</p>
          <p className="text-sm text-teal-700">
            cigarettes
          </p>
        </div>
        
        <div className="mt-3 text-center">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            Health improving
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressOverview;