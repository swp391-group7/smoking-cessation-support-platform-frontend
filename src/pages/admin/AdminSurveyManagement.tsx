// src/pages/admin/AdminSurveyManagement.tsx
import React, { useState } from 'react';
import AdminSurveyList from '@/components/admin/AdminSurveyList';
import AdminSurveyForm from '@/components/admin/AdminSurveyForm';
import AdminSurveyView from '@/components/admin/AdminSurveyView';

type ViewMode = 'list' | 'create' | 'edit' | 'view';

const AdminSurveyManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);

  const handleCreateSurvey = () => {
    setCurrentView('create');
    setSelectedSurveyId(null);
  };

  const handleEditSurvey = (surveyId: string) => {
    setCurrentView('edit');
    setSelectedSurveyId(surveyId);
  };

  const handleViewSurvey = (surveyId: string) => {
    setCurrentView('view');
    setSelectedSurveyId(surveyId);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedSurveyId(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return (
          <AdminSurveyForm
            mode="create"
            onSuccess={handleBackToList}
            onCancel={handleBackToList}
          />
        );
      case 'edit':
        return (
          <AdminSurveyForm
            mode="edit"
            surveyId={selectedSurveyId!}
            onSuccess={handleBackToList}
            onCancel={handleBackToList}
          />
        );
      case 'view':
        return (
          <AdminSurveyView
            surveyId={selectedSurveyId!}
            onEdit={() => handleEditSurvey(selectedSurveyId!)}
            onBack={handleBackToList}
          />
        );
      default:
        return (
          <AdminSurveyList
            onCreateSurvey={handleCreateSurvey}
            onEditSurvey={handleEditSurvey}
            onViewSurvey={handleViewSurvey}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentView()}
    </div>
  );
};

export default AdminSurveyManagement;