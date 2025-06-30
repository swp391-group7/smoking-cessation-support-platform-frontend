import React from 'react';

export const Topbar: React.FC = () => {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-4">
      <h1 className="text-lg font-semibold">Coach Dashboard</h1>
      <div className="flex items-center gap-3">
        {/* Thêm icon hoặc notification nếu cần */}
      </div>
    </header>
  );
};
