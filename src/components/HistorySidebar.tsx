import React from 'react';

interface HistoryItem {
  date: string;
  text: string;
  success: boolean;
}

interface HistorySidebarProps {
  history: HistoryItem[];
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history }) => {
  return (
    <div className="bg-white rounded-md p-4 shadow h-fit">
      <h3 className="font-semibold mb-3 text-gray-800">History</h3>
      <div className="max-h-80 overflow-y-auto space-y-2">
        {history.map((h, idx) => (
          <div key={idx} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
              h.success ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {h.success ? '✓' : '✗'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{h.date}</p>
              <p className={`text-sm ${h.success ? 'text-green-600' : 'text-red-600'}`}>
                {h.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySidebar;