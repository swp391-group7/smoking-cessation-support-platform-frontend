// src/pages/admin/Users.tsx
import { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "@/api/userApi";
import type { UserInfo } from "@/api/userApi";
import UserProfile from "./UserProfiles";


export default function UserManagement() {
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUserIdForDetail, setSelectedUserIdForDetail] = useState<string | null>(null);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");

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
            setFilteredUsers(augmentedUsers); // Initialize filtered users
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Failed to load users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Filter users based on search term
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user =>
                user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.username.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
        // Reset selections when search changes
        setSelectedUserIds([]);
    }, [searchTerm, users]);

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

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Clear search
    const clearSearch = () => {
        setSearchTerm("");
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

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-lg">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by full name, email, or username..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                    {searchTerm && (
                        <button
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <p className="mt-2 text-sm text-gray-600">
                        Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} matching "{searchTerm}"
                    </p>
                )}
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
            {!loading && !error && filteredUsers.length > 0 && (
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
                                                setSelectedUserIds(filteredUsers.map(user => user.id));
                                            } else {
                                                setSelectedUserIds([]);
                                            }
                                        }}
                                        checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                                        disabled={filteredUsers.length === 0}
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
                            {filteredUsers.map((user) => (
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

            {!loading && !error && filteredUsers.length === 0 && users.length > 0 && (
                <div className="text-center py-8 text-gray-600">
                    No users found matching "{searchTerm}". 
                    <button 
                        onClick={clearSearch}
                        className="ml-2 text-green-600 hover:text-green-800 underline"
                    >
                        Clear search
                    </button>
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