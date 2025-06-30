import React, { useState } from 'react';
import AdminBadgeList from '@/components/admin/AdminBadgeList';
import AdminBadgeForm from '@/components/admin/AdminBadgeForm';

type ViewMode = 'list' | 'create';

const AdminBadgeManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {viewMode === 'list' ? (
        <AdminBadgeList onCreate={() => setViewMode('create')} />
      ) : (
        <AdminBadgeForm
          onBack={() => setViewMode('list')}
          onSuccess={() => setViewMode('list')}
        />
      )}
    </div>
  );
};

export default AdminBadgeManagement;