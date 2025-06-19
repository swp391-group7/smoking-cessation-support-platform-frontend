import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface ChartData {
  date: string;
  smoked: number;
  saved: number;
}

interface ProgressChartProps {
  chartData: ChartData[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ chartData }) => {
  const [activeTab, setActiveTab] = useState<'cigarettes' | 'money'>('cigarettes');

  return (
    <div className="bg-white rounded-md p-6 shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Progress Chart</h3>
        <div className="space-x-2">
          <button 
            onClick={() => setActiveTab('cigarettes')} 
            className={`${
              activeTab === 'cigarettes' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            } px-4 py-1 rounded-md transition-colors`}
          >
            Cigarettes
          </button>
          <button 
            onClick={() => setActiveTab('money')} 
            className={`${
              activeTab === 'money' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            } px-4 py-1 rounded-md transition-colors`}
          >
            Money Saved
          </button>
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
  );
};

export default ProgressChart;