import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/coach/Sidebar';
import { Topbar } from '@/components/coach/Topbar';

const CoachLayout: React.FC = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CoachLayout;
