import React from 'react';

interface ProgressOverviewProps {
  daysSmokesFree: number;
  moneySaved: number;
  cigarettesAvoided: number;
}

const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  daysSmokesFree,
  moneySaved,
  cigarettesAvoided
}) => {
  return (
    <div className="flex gap-6">
      <div className="flex-1 bg-white rounded-md p-4 shadow">
        <h3 className="font-semibold mb-2">Days Smoke-Free</h3>
        <p className="text-4xl font-bold text-center text-blue-600">{daysSmokesFree}</p>
        <p className="text-center text-sm text-gray-500">
          You have been smoke-free for {daysSmokesFree} days
        </p>
      </div>

      <div className="flex-1 bg-white rounded-md p-4 shadow">
        <h3 className="font-semibold mb-2">Money Saved</h3>
        <p className="text-4xl font-bold text-center text-green-600">${moneySaved}</p>
        <p className="text-center text-sm text-gray-500">
          By not smoking {cigarettesAvoided} cigarettes
        </p>
      </div>
    </div>
  );
};

export default ProgressOverview;