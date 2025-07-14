// src/pages/admin/Users.tsx
import { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "@/api/userApi";
import type { UserInfo } from "@/api/userApi";
import UserProfile from "./UserProfiles";


export default function UserManagement() {
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUserIdForDetail, setSelectedUserIdForDetail] = useState<string | null>(null);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

    // Function to fetch all users from the API
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllUsers();
            const augmentedUsers = data.map(user => ({
                ...user,
                username: user.email.split('@')[0] 
            }));
            setUsers(augmentedUsers);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Failed to load users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Toggle user selection for deletion
    const toggleUserSelection = (userId: string) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    // Handle opening the detail modal for a user
    const handleViewDetail = (user: UserInfo) => {
        setSelectedUserIdForDetail(user.id);
    };

    // Function to close the UserProfile modal
    const handleCloseDetailModal = () => {
        setSelectedUserIdForDetail(null);
    };

    // Handle deleting selected users
    const handleDeleteSelected = async () => {
        if (selectedUserIds.length === 0) return;

        setShowDeleteConfirm(false); // Close confirmation modal

        setLoading(true);
        setError(null);
        try {
            for (const userId of selectedUserIds) {
                await deleteUser(parseInt(userId));
            }
            setSelectedUserIds([]); // Clear selections
            await fetchUsers(); // Re-fetch users to update the list
        } catch (err) {
            console.error("Failed to delete users:", err);
            setError("Failed to delete selected users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6 min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">User Management</h2>
                    <p className="text-sm text-gray-500">User account and activity management</p>
                </div>
                <p className="text-sm text-gray-400">/ Users</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mb-6">
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={selectedUserIds.length === 0 || loading}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200
                                ${selectedUserIds.length === 0 || loading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg'}`}
                >
                    Delete selected user ({selectedUserIds.length})
                </button>
            </div>

            {/* Loading and Error States */}
            {loading && (
                <div className="text-center py-8 text-gray-600">Loading user data...</div>
            )}
            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center shadow-sm">
                    {error}
                </div>
            )}

            {/* User Table */}
            {!loading && !error && users.length > 0 && (
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
                                                setSelectedUserIds(users.map(user => user.id));
                                            } else {
                                                setSelectedUserIds([]);
                                            }
                                        }}
                                        checked={selectedUserIds.length === users.length && users.length > 0}
                                        disabled={users.length === 0}
                                    />
                                </th>
                                <th scope="col" className="px-6 py-3">UID</th>
                                <th scope="col" className="px-6 py-3">Full name</th>
                                <th scope="col" className="px-6 py-3">Username</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3 rounded-tr-lg">Detail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="w-4 p-4">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-green-600 rounded focus:ring-green-500"
                                            checked={selectedUserIds.includes(user.id)}
                                            onChange={() => toggleUserSelection(user.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {user.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.fullName}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleViewDetail(user)}
                                            className="font-medium text-green-600 hover:text-green-800 transition-colors duration-200"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && !error && users.length === 0 && (
                <div className="text-center py-8 text-gray-600">There are no users to display.</div>
            )}

            {/* User Detail Modal */}
            {selectedUserIdForDetail && (
                <UserProfile userId={selectedUserIdForDetail} onClose={handleCloseDetailModal} />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm relative transform transition-all duration-300 scale-100 opacity-100">
                        <h3 className="text-xl font-bold text-red-700 mb-4">Confirm deletion</h3>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete? <br /> This action can't be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteSelected}
                                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md transition-colors duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
