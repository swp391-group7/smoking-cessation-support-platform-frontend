import React from 'react';
import { Calendar, DollarSign, Cigarette, TrendingUp } from 'lucide-react';

interface ProgressOverviewProps {
  daysSmokesFree: number;
  moneySaved: number;
  cigarettesAvoided: number;
}

const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  daysSmokesFree = 45,
  moneySaved = 320,
  cigarettesAvoided = 450
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Days Smoke-Free */}
      <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 shadow-md border border-green-100 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-green-500 rounded-lg">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-green-800">Days Smoke-Free</h3>
        </div>
        
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600 mb-1">{daysSmokesFree}</p>
          <p className="text-sm text-green-700">
            Great progress! Keep going strong
          </p>
        </div>
        
        
      </div>

      {/* Money Saved */}
      <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 shadow-md border border-green-100 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-green-500 rounded-lg">
            <DollarSign className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-green-800">Money Saved</h3>
        </div>
        
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600 mb-1">${moneySaved}</p>
          <p className="text-sm text-green-700">
            Saved from {cigarettesAvoided} cigarettes
          </p>
        </div>
        
        <div className="mt-3 flex items-center justify-center gap-1 text-xs text-green-600">
          <TrendingUp className="w-3 h-3" />
          <span>Your savings are growing!</span>
        </div>
      </div>

      {/* Cigarettes Avoided */}
      <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 shadow-md border border-green-100 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-green-500 rounded-lg">
            <Cigarette className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-green-800">Cigarettes Avoided</h3>
        </div>
        
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600 mb-1">{cigarettesAvoided}</p>
          <p className="text-sm text-green-700">
            Your health is improving daily
          </p>
        </div>
        
        <div className="mt-3 text-center">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Health boost active
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressOverview;