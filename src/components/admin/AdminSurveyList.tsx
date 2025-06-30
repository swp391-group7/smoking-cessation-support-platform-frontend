
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Calendar, FileText } from 'lucide-react';
import { getAllSurveys, deleteSurvey, type SurveyListItem } from '@/api/adminapi/adminSurveyApi';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface AdminSurveyListProps {
  onCreateSurvey: () => void;
  onEditSurvey: (surveyId: string) => void;
  onViewSurvey: (surveyId: string) => void;
}

const AdminSurveyList: React.FC<AdminSurveyListProps> = ({
  onCreateSurvey,
  onEditSurvey,
  onViewSurvey
}) => {
  const [surveys, setSurveys] = useState<SurveyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllSurveys();
      setSurveys(data);
    } catch (err) {
      setError('Failed to load surveys. Please try again.');
      console.error('Error loading surveys:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (surveyId: string) => {
    try {
      setDeletingId(surveyId);
      await deleteSurvey(surveyId);
      setSurveys(prev => prev.filter(survey => survey.id !== surveyId));
    } catch (err) {
      setError('Failed to delete survey. Please try again.');
      console.error('Error deleting survey:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSurveys = surveys.filter(survey =>
    survey.typeSurvey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading surveys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FileText className="mr-3 text-blue-600" size={32} />
                Survey Management
              </h1>
              <p className="text-gray-600 mt-1">Create, edit, and manage surveys for your application</p>
            </div>
            <button
              onClick={onCreateSurvey}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Create New Survey
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search surveys by type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
            <button
              onClick={loadSurveys}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Survey List */}
        {filteredSurveys.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? 'No surveys found' : 'No surveys yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Get started by creating your first survey'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={onCreateSurvey}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Create Your First Survey
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSurveys.map((survey) => (
              <div
                key={survey.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {survey.typeSurvey}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Calendar size={16} className="mr-2" />
                        {formatDate(survey.createAt)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText size={16} className="mr-2" />
                        {survey.questionCount} questions
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewSurvey(survey.id)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors"
                    >
                      <Eye size={16} className="mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => onEditSurvey(survey.id)}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          disabled={deletingId === survey.id}
                          className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={16} className="mr-1" />
                          {deletingId === survey.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the survey "{survey.typeSurvey}"? 
                            This action cannot be undone and will permanently remove all questions and answers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(survey.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Survey
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSurveyList;