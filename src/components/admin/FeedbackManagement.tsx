// src/components/admin/FeedbackManagement.tsx
import React, { useState, useEffect } from 'react';
import { 
  fetchAllFeedbacks, 
  fetchFeedbackStats,
  type Feedback, 
  type FeedbackStats, 
  TargetType  //'SYSTEM' hoặc 'COACH'
} from '../../api/feedbackApi';
import FeedbackDetailModal from './FeedbackDetailModal';

const FeedbackManagement: React.FC = () => {
  // Danh sách tất cả feedbacks
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  // Danh sách feedbacks đã lọc
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  // Thống kê feedbacks
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  // Trạng thái loading và lỗi
  const [loading, setLoading] = useState(true);
  // Trạng thái lỗi
  const [error, setError] = useState<string | null>(null);
  // Trạng thái lọc theo loại feedback và từ khóa tìm kiếm
  const [selectedType, setSelectedType] = useState<'ALL' | TargetType>('ALL');
  // Trạng thái tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(1);
  // Số lượng mục hiển thị mỗi trang
  const [itemsPerPage] = useState(10);
  // Trạng thái modal chi tiết feedback
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Trạng thái lọc theo coach ID
  const [coachFilter, setCoachFilter] = useState<string | null>(null);

  // Hàm gọi API để lấy feedbacks và thống kê khi component mount
  useEffect(() => {
    loadFeedbacks();
    loadStats();
  }, []);

  useEffect(() => {
    filterFeedbacks();
  }, [feedbacks, selectedType, searchTerm, coachFilter]);

  // Hàm tải feedbacks từ API
  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await fetchAllFeedbacks();
      setFeedbacks(data);
      setError(null);
    } catch (err) {
      setError('Unable to load feedback list');
      console.error('Error loading feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tải thống kê feedbacks từ API
  const loadStats = async () => {
    try {
      const statsData = await fetchFeedbackStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  // Hàm lọc feedbacks theo loại, từ khóa tìm kiếm và coach ID
  const filterFeedbacks = () => { 
    let filtered = feedbacks;

    // Lọc theo type
    if (selectedType !== 'ALL') {
      filtered = filtered.filter(f => f.targetType === selectedType);
    }

    // Lọc theo coach ID (nếu có)
    if (coachFilter) {
      filtered = filtered.filter(f => 
        f.targetType === 'COACH' && f.membershipPkgId === coachFilter
      );
    }

    // Lọc theo search term
    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFeedbacks(filtered);
    setCurrentPage(1);
  };

  // Hàm xử lý thay đổi loại feedback
  const handleTypeChange = (type: 'ALL' | TargetType) => {
    setSelectedType(type);
    // Reset coach filter when changing type
    if (type !== 'COACH') {
      setCoachFilter(null);
    }
  };

  // Hàm xử lý click vào row để hiển thị modal chi tiết
  const handleRowClick = (feedbackId: string) => {
    setSelectedFeedbackId(feedbackId);
    setIsModalOpen(true);
  };

  // Hàm đóng modal chi tiết
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeedbackId(null);
  };

  // Hàm xử lý xem feedback khác của coach
  const handleViewOtherFeedback = (coachId: string) => {
    setCoachFilter(coachId);
    setSelectedType('COACH');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Hàm reset bộ lọc
  const handleResetFilters = () => {
    setSelectedType('ALL');
    setSearchTerm('');
    setCoachFilter(null);
    setCurrentPage(1);
  };

  // Hàm định dạng ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Hàm lấy màu sắc cho điểm đánh giá
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Hàm lấy màu sắc cho loại feedback
  const getTypeColor = (type: string) => {
    return type === 'SYSTEM' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  // Pagination
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button 
            onClick={loadFeedbacks}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback Management</h1>
          <p className="text-gray-600">Manage and track user feedback</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Feedback Summary</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalFeedbacks}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Feedback System</div>
              <div className="text-2xl font-bold text-blue-600">{stats.systemFeedbacks}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Feedback Coach</div>
              <div className="text-2xl font-bold text-green-600">{stats.coachFeedbacks}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">AVG RATE System</div>
              <div className="text-2xl font-bold text-blue-600">{stats.systemAvgRating.toFixed(1)}/5</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">AVG RATE Coach</div>
              <div className="text-2xl font-bold text-green-600">{stats.coachAvgRating.toFixed(1)}/5</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEARCH
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by comment or user ID..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value as 'ALL' | TargetType)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">ALL</option>
                <option value="SYSTEM">System</option>
                <option value="COACH">Coach</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(coachFilter || selectedType !== 'ALL' || searchTerm) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Active filters:</span>
              
              {selectedType !== 'ALL' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Type: {selectedType}
                </span>
              )}
              
              {coachFilter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Coach: {coachFilter.substring(0, 8)}...
                </span>
              )}
              
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                  Search: "{searchTerm}"
                </span>
              )}
              
              <button
                onClick={handleResetFilters}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Feedback Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedback Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentFeedbacks.map((feedback) => (
                  <tr
                    key={feedback.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(feedback.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {feedback.userId.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(feedback.targetType)}`}
                      >
                        {feedback.targetType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-bold ${getRatingColor(feedback.rating)}`}>
                        {feedback.rating}/5
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis"
                      title={feedback.comment}
                    >
                      <div className="text-sm text-gray-900 truncate">
                        {feedback.comment || 'No comment provided'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(feedback.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(feedback.id);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Show <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(endIndex, filteredFeedbacks.length)}</span> of{' '}
                    <span className="font-medium">{filteredFeedbacks.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {filteredFeedbacks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">Cannot find any feedback</div>
          </div>
        )}
      </div>

      {/* Feedback Detail Modal */}
      {selectedFeedbackId && (
        <FeedbackDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          feedbackId={selectedFeedbackId}
          onViewOtherFeedback={handleViewOtherFeedback}
        />
      )}
    </div>
  );
};

export default FeedbackManagement;