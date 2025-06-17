import React from 'react';

interface Badge {
  name: string;
  description: string;
  earned: boolean;
  icon: string;
}

interface BadgesSidebarProps {
  badges: Badge[];
}

const BadgesSidebar: React.FC<BadgesSidebarProps> = ({ badges }) => {
  return (
    <div className="bg-white rounded-md p-4 shadow h-fit">
      <h3 className="font-semibold mb-3 text-gray-800">Badges</h3>
      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge, idx) => (
          <div 
            key={idx} 
            className={`p-3 rounded-lg border-2 text-center transition-all ${
              badge.earned 
                ? 'border-blue-300 bg-blue-50' 
                : 'border-gray-200 bg-gray-50 opacity-60'
            }`}
          >
            <div className="text-2xl mb-1">{badge.icon}</div>
            <p className={`text-xs font-semibold ${
              badge.earned ? 'text-blue-700' : 'text-gray-500'
            }`}>
              {badge.name}
            </p>
            <p className={`text-xs mt-1 ${
              badge.earned ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {badge.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesSidebar;