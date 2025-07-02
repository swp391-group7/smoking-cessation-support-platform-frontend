//src/pages/admin/QuitProfiles.tsx

import { useState, useEffect } from "react";
import { getAllProgressLogs, getProgressLogsByUser, getProgressLogByUserAndDate, deleteProgressLog } from "@/api/progressApi";
import type { QuitProgressLog } from '@/api/progressApi'; 
import { getAllUsers } from "@/api/userApi"; 
import type { UserInfo } from '@/api/userApi'; 


interface DetailedLogView extends QuitProgressLog {
    // Add any additional fields you want to display in the modal that might not be directly in QuitProgressLog
    // For example, if you want to show user's full name directly in the modal without re-accessing userInfo
}

export default function QuitProfiles() {
    const [logs, setLogs] = useState<QuitProgressLog[]>([]);
    const [allUsers, setAllUsers] = useState<UserInfo[]>([]); 
    const [selectedUserId, setSelectedUserId] = useState<string>(""); 
    const [selectedDate, setSelectedDate] = useState<string>(""); 
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLog, setSelectedLog] = useState<DetailedLogView | null>(null); 
    const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]); 
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

    // Function to fetch all users (for the filter dropdown)
    const fetchAllUsers = async () => {
        try {
            const usersData = await getAllUsers();
            setAllUsers(usersData);
        } catch (err) {
            console.error("Failed to fetch all users for filter:", err);
        }
    };

    // Function to fetch progress logs based on filters
    const fetchProgressLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            let fetchedLogs: QuitProgressLog[] = [];
            if (selectedUserId && selectedDate) {

                // Fetch specific log by user and date
                const log = await getProgressLogByUserAndDate(selectedUserId, selectedDate);
                fetchedLogs = log ? [log] : [];
            } else if (selectedUserId) {

                // Fetch all logs for a specific user
                fetchedLogs = await getProgressLogsByUser(selectedUserId);
            } else {

                // Fetch all logs
                fetchedLogs = await getAllProgressLogs();
            }
            setLogs(fetchedLogs);
        } catch (err) {
            console.error("Failed to fetch progress logs:", err);
            setError("Unable to load quit progress data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount and when filters change
    useEffect(() => {
        fetchAllUsers(); 
        fetchProgressLogs();
    }, [selectedUserId, selectedDate]); 

    // Handle opening the detail modal for a log
    const handleViewDetail = (log: QuitProgressLog) => {
        setSelectedLog(log);
    };

    // Handle closing the detail modal
    const handleCloseDetailModal = () => {
        setSelectedLog(null);
    };

    // Toggle log selection for deletion
    const toggleLogSelection = (logId: string) => {
        setSelectedLogIds((prev) =>
            prev.includes(logId) ? prev.filter((id) => id !== logId) : [...prev, logId]
        );
    };

    // Handle deleting selected logs
    const handleDeleteSelected = async () => {
        if (selectedLogIds.length === 0) return;

        setShowDeleteConfirm(false); // Close confirmation modal

        setLoading(true);
        setError(null);
        try {
            for (const logId of selectedLogIds) {
                await deleteProgressLog(logId);
            }
            setSelectedLogIds([]); 
            await fetchProgressLogs(); 
        } catch (err) {
            console.error("Failed to delete logs:", err);
            setError("Không thể xóa các log đã chọn. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6 min-h-screen bg-gray-50 font-sans">
            <h2 className="text-3xl font-extrabold text-gray-800 border-b-2 pb-2 mb-6">Quản lý Tiến trình Cai thuốc</h2>

            {/* Filter and Action Buttons */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
                    <select
                        className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                    >
                        <option value="">Tất cả người dùng</option>
                        {allUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.fullName} ({user.email})
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

                {/* Action Button */}
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={selectedLogIds.length === 0 || loading}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200
                                ${selectedLogIds.length === 0 || loading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg'}`}
                >
                    Xóa log đã chọn ({selectedLogIds.length})
                </button>
            </div>

            {/* Loading and Error States */}
            {loading && (
                <div className="text-center py-8 text-gray-600">Đang tải dữ liệu tiến trình...</div>
            )}
            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center shadow-sm">
                    {error}
                </div>
            )}

            {/* Progress Log Table */}
            {!loading && !error && logs.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="text-xs text-green-700 uppercase bg-green-50 rounded-t-lg">
                            <tr>
                                <th scope="col" className="p-4 rounded-tl-lg">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-green-600 rounded focus:ring-green-500"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedLogIds(logs.map(log => log.id));
                                            } else {
                                                setSelectedLogIds([]);
                                            }
                                        }}
                                        checked={selectedLogIds.length === logs.length && logs.length > 0}
                                        disabled={logs.length === 0}
                                    />
                                </th>
                                <th scope="col" className="px-6 py-3">ID Log</th>
                                <th scope="col" className="px-6 py-3">Người dùng</th>
                                <th scope="col" className="px-6 py-3">Ngày Log</th>
                                <th scope="col" className="px-6 py-3">Số điếu hút</th>
                                <th scope="col" className="px-6 py-3">Trạng thái</th>
                                <th scope="col" className="px-6 py-3 rounded-tr-lg">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="w-4 p-4">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-green-600 rounded focus:ring-green-500"
                                            checked={selectedLogIds.includes(log.id)}
                                            onChange={() => toggleLogSelection(log.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {log.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        {log.user?.fullName || log.user?.username || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {log.logDate}
                                    </td>
                                    <td className="px-6 py-4">
                                        {log.cigarettesSmoked}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                                            ${log.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                              log.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                                              'bg-gray-100 text-gray-800'}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleViewDetail(log)}
                                            className="font-medium text-green-600 hover:text-green-800 transition-colors duration-200"
                                        >
                                            Xem
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && !error && logs.length === 0 && (
                <div className="text-center py-8 text-gray-600">Không có log tiến trình nào để hiển thị.</div>
            )}

            {/* Log Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-xl relative transform transition-all duration-300 scale-100 opacity-100">
                        <button
                            onClick={handleCloseDetailModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl transition-colors duration-200"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h3 className="text-2xl font-bold text-green-700 mb-6 border-b pb-2">Chi tiết Log tiến trình</h3>
                        <div className="space-y-3 text-gray-800">
                            <p><strong>ID Log:</strong> {selectedLog.id}</p>
                            <p><strong>Người dùng:</strong> {selectedLog.user?.fullName || selectedLog.user?.username || 'N/A'}</p>
                            <p><strong>Email người dùng:</strong> {selectedLog.user?.email || 'N/A'}</p>
                            <p><strong>Ngày Log:</strong> {selectedLog.logDate}</p>
                            <p><strong>Số điếu hút:</strong> {selectedLog.cigarettesSmoked}</p>
                            <p><strong>Tâm trạng:</strong> {selectedLog.mood}</p>
                            <p><strong>Ghi chú:</strong> {selectedLog.note || 'Không có ghi chú'}</p>
                            <p><strong>Trạng thái:</strong> {selectedLog.status}</p>

                            {selectedLog.plan && (
                                <div className="mt-4 border-t pt-4">
                                    <h4 className="font-semibold text-lg text-gray-800 mb-2">Thông tin Kế hoạch liên quan</h4>
                                    <p><strong>ID Kế hoạch:</strong> {selectedLog.plan.id}</p>
                                    <p><strong>Phương pháp:</strong> {selectedLog.plan.method}</p>
                                    <p><strong>Ngày bắt đầu Kế hoạch:</strong> {selectedLog.plan.startDate}</p>
                                    <p><strong>Ngày mục tiêu Kế hoạch:</strong> {selectedLog.plan.targetDate}</p>
                                    <p><strong>Trạng thái Kế hoạch:</strong> {selectedLog.plan.status}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm relative transform transition-all duration-300 scale-100 opacity-100">
                        <h3 className="text-xl font-bold text-red-700 mb-4">Xác nhận xóa</h3>
                        <p className="text-gray-700 mb-6">
                            Bạn có chắc chắn muốn xóa {selectedLogIds.length} log đã chọn không? Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDeleteSelected}
                                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md transition-colors duration-200"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
