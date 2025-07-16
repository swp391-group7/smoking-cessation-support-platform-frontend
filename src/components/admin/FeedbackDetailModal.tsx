// src/components/admin/FeedbackDetailModal.tsx
import React, { useState, useEffect } from 'react';
import { fetchFeedbackWithDetails, fetchUserById, type FeedbackWithDetails } from '@/api/feedbackApi';

interface FeedbackDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedbackId: string;
  onViewOtherFeedback?: (coachId: string) => void;
}

const FeedbackDetailModal: React.FC<FeedbackDetailModalProps> = ({
  isOpen,
  onClose,
  feedbackId,
  onViewOtherFeedback
}) => {
  const [feedback, setFeedback] = useState<FeedbackWithDetails | null>(null);
  interface CoachUserInfo {
    id: string;
    fullName: string;
    username: string;
    email: string;
    phoneNumber?: string;
    dob?: string;
    createdAt: string;
    // add other fields if needed
  }

  const [coachUserInfo, setCoachUserInfo] = useState<CoachUserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && feedbackId) {
      loadFeedbackDetails();
    }
  }, [isOpen, feedbackId]);

  const loadFeedbackDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFeedbackWithDetails(feedbackId);
      setFeedback(data);

      // Nếu là coach feedback và có thông tin coach, lấy thông tin user của coach
      if (data.targetType === 'COACH' && data.coachInfo) {
        try {
          const coachUser = await fetchUserById(data.coachInfo.userId);
          setCoachUserInfo(coachUser);
        } catch (error) {
          console.error('Error fetching coach user info:', error);
        }
      }
    } catch (err) {
      setError('Unable to load feedback details');
      console.error('Error loading feedback details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTypeColor = (type: string) => {
    return type === 'SYSTEM' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-2xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const handleViewOtherFeedback = () => {
    if (feedback && feedback.targetType === 'COACH' && onViewOtherFeedback) {
      onViewOtherFeedback(feedback.membershipPkgId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Feedback Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={loadFeedbackDetails}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Content */}
          {feedback && !loading && !error && (
            <div className="space-y-6">
              {/* Feedback Type and Rating */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTypeColor(feedback.targetType)}`}>
                  {feedback.targetType} FEEDBACK
                </span>
                <div className="flex items-center space-x-2">
                  {renderStars(feedback.rating)}
                  <span className={`text-lg font-bold ${getRatingColor(feedback.rating)}`}>
                    {feedback.rating}/5
                  </span>
                </div>
              </div>

              {/* User Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">User Information</h3>
                {feedback.userInfo ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Full Name</label>
                      <p className="text-gray-900">{feedback.userInfo.fullName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Username</label>
                      <p className="text-gray-900">{feedback.userInfo.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{feedback.userInfo.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-900">{feedback.userInfo.phoneNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">User ID</label>
                      <p className="text-gray-900 text-sm font-mono break-all">{feedback.userInfo.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Role</label>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {feedback.userInfo.roleName}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">User information not available</p>
                )}
              </div>

              {/* Coach Information (only for coach feedback) */}
              {feedback.targetType === 'COACH' && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Coach Information</h3>
                    <button
                      onClick={handleViewOtherFeedback}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      View Other Feedback
                    </button>
                  </div>
                  
                  {feedback.coachInfo && coachUserInfo ? (
                    <div className="space-y-4">
                      {/* Coach Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Coach Name</label>
                          <p className="text-gray-900 font-semibold">{coachUserInfo.fullName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Username</label>
                          <p className="text-gray-900">{coachUserInfo.username}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Email</label>
                          <p className="text-gray-900">{coachUserInfo.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Phone</label>
                          <p className="text-gray-900">{coachUserInfo.phoneNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                          <p className="text-gray-900">{coachUserInfo.dob || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Coach ID</label>
                          <p className="text-gray-900 text-sm font-mono break-all">{feedback.coachInfo.userId}</p>
                        </div>
                      </div>

                      {/* Coach Professional Info */}
                      <div className="border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600">Average Rating</label>
                            <div className="flex items-center space-x-2">
                              <span className={`text-lg font-bold ${getRatingColor(feedback.coachInfo.avgRating)}`}>
                                {feedback.coachInfo.avgRating}/5
                              </span>
                              <div className="flex">
                                {renderStars(Math.round(feedback.coachInfo.avgRating))}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">Member Since</label>
                            <p className="text-gray-900">{formatDate(coachUserInfo.createdAt)}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-600 mb-2">Qualification</label>
                          <div className="bg-white p-3 rounded border">
                            <p className="text-gray-900 whitespace-pre-wrap">
                              {feedback.coachInfo.qualification || 'No qualification provided'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-600 mb-2">Biography</label>
                          <div className="bg-white p-3 rounded border max-h-24 overflow-y-auto">
                            <p className="text-gray-900 whitespace-pre-wrap">
                              {feedback.coachInfo.bio || 'No biography provided'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Membership Package Info */}
                      {feedback.membershipPackage && (
                        <div className="border-t pt-4">
                          <label className="block text-sm font-medium text-gray-600 mb-2">Membership Package</label>
                          <div className="bg-white p-3 rounded border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Package:</span> {feedback.membershipPackage.packageTypeName}
                              </div>
                              <div>
                                <span className="font-medium">Status:</span> 
                                <span className={`ml-1 px-2 py-1 rounded text-xs ${
                                  feedback.membershipPackage.active 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {feedback.membershipPackage.active ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">Start Date:</span> {formatDate(feedback.membershipPackage.startDate)}
                              </div>
                              <div>
                                <span className="font-medium">End Date:</span> {formatDate(feedback.membershipPackage.endDate)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">Coach information not available</p>
                  )}
                </div>
              )}

              {/* Feedback Content */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Feedback Content</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Comment</label>
                    <div className="bg-white p-3 rounded border max-h-32 overflow-y-auto">
                      <p className="text-gray-900 whitespace-pre-wrap break-words">
                        {feedback.comment || 'No comment provided'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Membership Package ID</label>
                    <p className="text-gray-900 text-sm font-mono break-all">{feedback.membershipPkgId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Created At</label>
                    <p className="text-gray-900">{formatDate(feedback.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Feedback ID</label>
                    <p className="text-gray-900 text-sm font-mono break-all">{feedback.id}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetailModal;