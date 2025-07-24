import React, { useEffect, useState } from 'react';
import {
  createSystemFeedback,
  fetchSystemFeedbackByUser,
  updateSystemFeedbackById,
  type SystemFeedbackDto,
  type CreateSystemFeedbackRequest,
  type UpdateSystemFeedbackRequest
} from '@/api/createFeedback';

const FeedbackPlatform: React.FC = () => {
  const [feedback, setFeedback] = useState<SystemFeedbackDto | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const userId = localStorage.getItem('userId') || '';

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSystemFeedbackByUser(userId);
        setFeedback(data);
        setRating(data.rating);
        setComment(data.comment);
      } catch {
        // no existing feedback
      }
    }
    if (userId) load();
  }, [userId]);

  const handleSubmit = async () => {
    if (!rating || comment.trim() === '') return;
    if (feedback) {
      // update existing
      const payload: UpdateSystemFeedbackRequest = { rating, comment };
      const updated = await updateSystemFeedbackById(feedback.id, payload);
      setFeedback(updated);
      setIsEditing(false);
    } else {
      // create new
      const payload: CreateSystemFeedbackRequest = {
        userId,
        targetType: 'SYSTEM',
        membershipPkgId: '',
        rating,
        comment
      };
      await createSystemFeedback(payload);
      // After create, fetch newly created record
      const created = await fetchSystemFeedbackByUser(userId);
      setFeedback(created);
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-green-700 mb-4">
          System Feedback
        </h1>

        {feedback && !isEditing ? (
          <div>
            <p className="mb-2">
              <span className="font-medium">Your Rating:</span> {feedback.rating} ⭐
            </p>
            <p className="mb-4">
              <span className="font-medium">Comment:</span> {feedback.comment}
            </p>
            <button
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              onClick={() => setIsEditing(true)}
            >
              Edit Feedback
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-green-700 mb-1">
                Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl focus:outline-none ${
                      rating >= star ? 'text-green-600' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-green-700 mb-1">
                Comment
              </label>
              <textarea
                className="w-full border border-green-200 rounded p-2 focus:ring-2 focus:ring-green-300"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
              disabled={!rating || comment.trim() === ''}
            >
              {feedback ? 'Update Feedback' : 'Submit Feedback'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPlatform;
