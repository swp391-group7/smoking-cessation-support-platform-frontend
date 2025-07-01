// src/pages/admin/Users.tsx
import { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "@/api/userApi";
import type { UserInfo } from "@/api/userApi";

interface UserExtended extends UserInfo {
    username: string; // Added username as it's in mockUsers and useful for display
    addictionLevel?: string;
    plan?: string;
    coach?: string | null; // Can be null
    badges?: string[];
}

const mockDetailedUsers: UserExtended[] = [
    {
        id: "1",
        fullName: "Nguyen Van A",
        username: "nguyenvana",
        email: "a@example.com",
        phoneNumber: "0123456789",
        dob: "2000-01-01",
        avatarPath: "https://placehold.co/40x40/aabbcc/ffffff?text=A",
        addictionLevel: "Mild",
        plan: "Cold Turkey",
        coach: "Coach X",
        badges: ["Beginner", "Achiever"],
        roleName: "USER"
    },
    {
        id: "2",
        fullName: "Tran Thi B",
        username: "tranthib",
        email: "b@example.com",
        phoneNumber: "0987654321",
        dob: "1995-05-10",
        avatarPath: "https://placehold.co/40x40/ccbbaa/ffffff?text=B",
        addictionLevel: "Moderate",
        plan: "Gradual Reduction",
        coach: null, // No coach
        badges: ["Intermediate"],
        roleName: "USER"
    },
    {
        id: "3",
        fullName: "Le Van C",
        username: "levanc",
        email: "c@example.com",
        phoneNumber: "0112233445",
        dob: "1998-11-20",
        avatarPath: "https://placehold.co/40x40/aaccbb/ffffff?text=C",
        addictionLevel: "Severe",
        plan: "Cold Turkey",
        coach: "Coach Y",
        badges: ["Pro", "Mentor"],
        roleName: "ADMIN"
    },
];

export default function UserManagement() {
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserExtended | null>(null);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

    // Function to fetch all users from the API
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllUsers();
            // Augment fetched users with mock username for display if not present in UserInfo
            const augmentedUsers = data.map(user => ({
                ...user,
                username: user.email.split('@')[0] // Simple mock for username
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
        // Find the detailed mock user or augment the UserInfo with mock details
        const detailedUser = mockDetailedUsers.find(u => u.id === user.id) || {
            ...user,
            username: user.email.split('@')[0], // Ensure username is present
            addictionLevel: "N/A",
            plan: "N/A",
            coach: null,
            badges: [],
        };
        setSelectedUser(detailedUser);
    };

    // Handle deleting selected users
    const handleDeleteSelected = async () => {
        if (selectedUserIds.length === 0) return;

        setShowDeleteConfirm(false); // Close confirmation modal

        setLoading(true);
        setError(null);
        try {
            for (const userId of selectedUserIds) {
                // Assuming deleteUser API expects number, convert string ID to number
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
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-xl relative transform transition-all duration-300 scale-100 opacity-100">
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl transition-colors duration-200"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h3 className="text-2xl font-bold text-green-700 mb-6 border-b pb-2">User details</h3>
                        <div className="space-y-3 text-gray-800">
                            <p><strong>Full name:</strong> {selectedUser.fullName}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Phone:</strong> {selectedUser.phoneNumber}</p>
                            <p><strong>D.O.B:</strong> {selectedUser.dob}</p>
                            <p><strong>Dependence:</strong> {selectedUser.addictionLevel || "N/A"}</p>
                            <p><strong>Plan:</strong> {selectedUser.plan || "N/A"}</p>
                            <p><strong>Coach:</strong> {selectedUser.coach || "N/A"}</p>
                            <div className="mt-4">
                                <strong>Badge:</strong>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {selectedUser.badges && selectedUser.badges.length > 0 ? (
                                        selectedUser.badges.map((b: string) => (
                                            <span key={b} className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                                                {b}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 text-sm">No badges yet.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
