import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, Calendar, FileText, User, Hash } from 'lucide-react';
import { getSurveyDetail, deleteSurvey, type SurveyDetailDTO } from '@/api/adminapi/adminSurveyApi';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface AdminSurveyViewProps {
  surveyId: string;
  onEdit: () => void;
  onBack: () => void;
}

const AdminSurveyView: React.FC<AdminSurveyViewProps> = ({
  surveyId,
  onEdit,
  onBack
}) => {
  const [survey, setSurvey] = useState<SurveyDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSurveyDetail();
  }, [surveyId]);

  const loadSurveyDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSurveyDetail(surveyId);
      setSurvey(data);
    } catch (err) {
      setError('Failed to load survey details. Please try again.');
      console.error('Error loading survey detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteSurvey(surveyId);
      onBack(); // Navigate back to list after successful deletion
    } catch (err) {
      setError('Failed to delete survey. Please try again.');
      console.error('Error deleting survey:', err);
    } finally {
      setDeleting(false);
    }
  };

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
          <p className="text-gray-600">Loading survey details...</p>
        </div>
      </div>
    );
  }

  if (error && !survey) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
            <div className="mt-4 space-x-4">
              <button
                onClick={loadSurveyDetail}
                className="text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
              <button
                onClick={onBack}
                className="text-red-600 hover:text-red-800 underline"
              >
                Back to list
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!survey) {
    return null;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FileText className="mr-3 text-blue-600" size={32} />
                  Survey Details
                </h1>
                <p className="text-gray-600 mt-1">View and manage survey information</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
              >
                <Edit size={16} className="mr-2" />
                Edit Survey
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={16} className="mr-2" />
                    {deleting ? 'Deleting...' : 'Delete Survey'}
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
                      onClick={handleDelete}
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Survey Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Survey Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Survey Type</label>
                <div className="flex items-center">
                  <FileText size={16} className="mr-2 text-gray-500" />
                  <span className="text-gray-900 font-medium">{survey.typeSurvey}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Survey ID</label>
                <div className="flex items-center">
                  <Hash size={16} className="mr-2 text-gray-500" />
                  <span className="text-gray-600 font-mono text-sm">{survey.id}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-500" />
                  <span className="text-gray-900">{formatDate(survey.createAt)}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <div className="flex items-center">
                  <User size={16} className="mr-2 text-gray-500" />
                  <span className="text-gray-600 font-mono text-sm">{survey.userId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-lg p-2 mr-3">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Questions</p>
                  <p className="text-2xl font-bold text-blue-900">{survey.questions.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-lg p-2 mr-3">
                  <Hash size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Total Answers</p>
                  <p className="text-2xl font-bold text-green-900">
                    {survey.questions.reduce((total, q) => total + q.answers.length, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-lg p-2 mr-3">
                  <Calendar size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Avg. Answers/Question</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {survey.questions.length > 0 
                      ? Math.round(survey.questions.reduce((total, q) => total + q.answers.length, 0) / survey.questions.length * 10) / 10
                      : 0
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions and Answers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Questions & Answers</h2>
          
          {survey.questions.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600">This survey doesn't have any questions yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {survey.questions.map((question, questionIndex) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-800">
                        Question {questionIndex + 1}
                      </h3>
                      <div className="text-sm text-gray-500">
                        ID: {question.id}
                      </div>
                    </div>
                    <p className="text-gray-900 mb-2">{question.content}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-1" />
                      Created: {formatDate(question.createAt)}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">
                      Answer Options ({question.answers.length})
                    </h4>
                    <div className="space-y-2">
                      {question.answers.map((answer, answerIndex) => (
                        <div 
                          key={answer.id} 
                          className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mr-3">
                                {answerIndex + 1}
                              </span>
                              <span className="text-gray-900">{answer.answerText}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">
                              Points: <span className="font-medium text-gray-900">{answer.point}</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              ID: {answer.id}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSurveyView;