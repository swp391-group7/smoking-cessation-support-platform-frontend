// src/components/admin/survey/AdminSurveyForm.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Save, X } from 'lucide-react';
import { 
  createSurvey, 
  updateSurvey, 
  getSurveyDetail, 
  type CreateSurveyRequest, 
  type UpdateSurveyRequest,
  type CreateQuestionRequest,
  type UpdateQuestionRequest,
  type CreateAnswerRequest,
  type UpdateAnswerRequest,
} from '@/api/adminapi/adminSurveyApi';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface AdminSurveyFormProps {
  mode: 'create' | 'edit';
  surveyId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormQuestion {
  id?: string;
  content: string;
  answers: FormAnswer[];
  isNew?: boolean;
}

interface FormAnswer {
  id?: string;
  answerText: string;
  point: number;
  isNew?: boolean;
}

const AdminSurveyForm: React.FC<AdminSurveyFormProps> = ({
  mode,
  surveyId,
  onSuccess,
  onCancel
}) => {
  const [typeSurvey, setTypeSurvey] = useState('');
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && surveyId) {
      loadSurveyForEdit();
    } else {
      // Initialize with one empty question for create mode
      setQuestions([createEmptyQuestion()]);
    }
  }, [mode, surveyId]);

  const loadSurveyForEdit = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      const survey = await getSurveyDetail(surveyId!);
      setTypeSurvey(survey.typeSurvey);
      setQuestions(survey.questions.map(q => ({
        id: q.id,
        content: q.content,
        answers: q.answers.map(a => ({
          id: a.id,
          answerText: a.answerText,
          point: a.point
        }))
      })));
    } catch (err) {
      setError('Failed to load survey data. Please try again.');
      console.error('Error loading survey:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const createEmptyQuestion = (): FormQuestion => ({
    content: '',
    answers: [
      { answerText: '', point: 0, isNew: true },
      { answerText: '', point: 1, isNew: true }
    ],
    isNew: true
  });

  const createEmptyAnswer = (): FormAnswer => ({
    answerText: '',
    point: 0,
    isNew: true
  });

  const addQuestion = () => {
    setQuestions(prev => [...prev, createEmptyQuestion()]);
  };

  const removeQuestion = (questionIndex: number) => {
    setQuestions(prev => prev.filter((_, index) => index !== questionIndex));
  };

  const updateQuestion = (questionIndex: number, content: string) => {
    setQuestions(prev => prev.map((q, index) => 
      index === questionIndex ? { ...q, content } : q
    ));
  };

  const addAnswer = (questionIndex: number) => {
    setQuestions(prev => prev.map((q, index) => 
      index === questionIndex 
        ? { ...q, answers: [...q.answers, createEmptyAnswer()] }
        : q
    ));
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    setQuestions(prev => prev.map((q, index) => 
      index === questionIndex 
        ? { ...q, answers: q.answers.filter((_, aIndex) => aIndex !== answerIndex) }
        : q
    ));
  };

  const updateAnswer = (questionIndex: number, answerIndex: number, field: 'answerText' | 'point', value: string | number) => {
    setQuestions(prev => prev.map((q, index) => 
      index === questionIndex 
        ? {
            ...q,
            answers: q.answers.map((a, aIndex) => 
              aIndex === answerIndex ? { ...a, [field]: value } : a
            )
          }
        : q
    ));
  };

  const validateForm = (): string | null => {
    if (!typeSurvey.trim()) {
      return 'Survey type is required';
    }

    if (questions.length === 0) {
      return 'At least one question is required';
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.content.trim()) {
        return `Question ${i + 1} content is required`;
      }

      if (question.answers.length < 2) {
        return `Question ${i + 1} must have at least 2 answers`;
      }

      for (let j = 0; j < question.answers.length; j++) {
        const answer = question.answers[j];
        if (!answer.answerText.trim()) {
          return `Question ${i + 1}, Answer ${j + 1} text is required`;
        }
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      if (mode === 'create') {
        const createData: CreateSurveyRequest = {
          typeSurvey,
          questions: questions.map(q => ({
            content: q.content,
            answers: q.answers.map(a => ({
              answerText: a.answerText,
              point: a.point
            }))
          }))
        };
        await createSurvey(createData);
      } else {
        const updateData: UpdateSurveyRequest = {
          id: surveyId!,
          typeSurvey,
          questions: questions.map(q => {
            if (q.id && !q.isNew) {
              // Existing question
              return {
                id: q.id,
                content: q.content,
                answers: q.answers.map(a => {
                  if (a.id && !a.isNew) {
                    // Existing answer
                    return {
                      id: a.id,
                      answerText: a.answerText,
                      point: a.point
                    } as UpdateAnswerRequest;
                  } else {
                    // New answer
                    return {
                      answerText: a.answerText,
                      point: a.point
                    } as CreateAnswerRequest;
                  }
                })
              } as UpdateQuestionRequest;
            } else {
              // New question
              return {
                content: q.content,
                answers: q.answers.map(a => ({
                  answerText: a.answerText,
                  point: a.point
                }))
              } as CreateQuestionRequest;
            }
          })
        };
        await updateSurvey(updateData);
      }
      onSuccess();
    } catch (err) {
      setError(`Failed to ${mode === 'create' ? 'create' : 'update'} survey. Please try again.`);
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} survey:`, err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading survey data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onCancel}
                className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {mode === 'create' ? 'Create New Survey' : 'Edit Survey'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {mode === 'create' 
                    ? 'Create a new survey with custom questions and answers'
                    : 'Modify the existing survey questions and answers'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Survey Type */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Survey Information</h2>
            <div>
              <label htmlFor="typeSurvey" className="block text-sm font-medium text-gray-700 mb-2">
                Survey Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="typeSurvey"
                value={typeSurvey}
                onChange={(e) => setTypeSurvey(e.target.value)}
                placeholder="Enter survey type (e.g., Smoking Assessment, Health Survey)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Add Question
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((question, questionIndex) => (
                <div key={questionIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      Question {questionIndex + 1}
                    </h3>
                    {questions.length > 1 && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Question</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this question? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeQuestion(questionIndex)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>

                  {/* Question Content */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={question.content}
                      onChange={(e) => updateQuestion(questionIndex, e.target.value)}
                      placeholder="Enter your question here..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Answers */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Answer Options <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => addAnswer(questionIndex)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors"
                      >
                        <Plus size={14} className="mr-1" />
                        Add Answer
                      </button>
                    </div>

                    <div className="space-y-3">
                      {question.answers.map((answer, answerIndex) => (
                        <div key={answerIndex} className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={answer.answerText}
                              onChange={(e) => updateAnswer(questionIndex, answerIndex, 'answerText', e.target.value)}
                              placeholder={`Answer option ${answerIndex + 1}`}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                          <div className="w-20">
                            <input
                              type="number"
                              value={answer.point}
                              onChange={(e) => updateAnswer(questionIndex, answerIndex, 'point', parseInt(e.target.value) || 0)}
                              placeholder="Points"
                              className="w-full px-2 py-2 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="0"
                            />
                          </div>
                          {question.answers.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeAnswer(questionIndex, answerIndex)}
                              className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} className="mr-2" />
                {loading 
                  ? (mode === 'create' ? 'Creating...' : 'Updating...') 
                  : (mode === 'create' ? 'Create Survey' : 'Update Survey')
                }
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSurveyForm;