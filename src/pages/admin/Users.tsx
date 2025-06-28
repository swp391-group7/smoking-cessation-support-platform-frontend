import { useState } from "react";
import { Search, Filter, Eye } from "lucide-react";

const mockUsers = [
    {
        id: "1",
        fullname: "Nguyen Van A",
        username: "nguyenvana",
        email: "a@example.com",
    },
    {
        id: "2",
        fullname: "Tran Thi B",
        username: "tranthib",
        email: "b@example.com",
    },
];

// const levels = ["Mild", "Moderate", "Severe"];
// const plans = ["Cold Turkey", "Gradual Reduction"];

export default function UserManagement() {
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    {/* [filter, setFilter] = useState({ level: "", plan: "", coach: "" });*/}
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    {/*const filteredUsers = mockUsers.filter((u) => {
        return (
            (!filter.level || u.addictionLevel === filter.level) &&
            (!filter.plan || u.plan === filter.plan) &&
            (!filter.coach || (filter.coach === "Membership" ? u.coach : !u.coach))
        );
    });*/}

    const toggleUser = (email: string) => {
        setSelectedUsers((prev) =>
            prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
        );
    };

    return (
        <div className="p-6 space-y-6 min-h-screen">
            <h2 className="text-2xl font-bold">User Management</h2>

            {/* Filter Bar 
            <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Dependency:</label>
                    <select className="border rounded px-2 py-1 text-sm" value={filter.level} onChange={(e) => setFilter({ ...filter, level: e.target.value })}>
                        <option value="">All</option>
                        {levels.map((l) => <option key={l}>{l}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Progress:</label>
                    <select className="border rounded px-2 py-1 text-sm" value={filter.plan} onChange={(e) => setFilter({ ...filter, plan: e.target.value })}>
                        <option value="">All</option>
                        {plans.map((p) => <option key={p}>{p}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Coach:</label>
                    <select className="border rounded px-2 py-1 text-sm" value={filter.coach} onChange={(e) => setFilter({ ...filter, coach: e.target.value })}>
                        <option value="">All</option>
                        <option value="Membership">Have coach</option>
                        <option value="Chưa gán">None</option>
                    </select>
                </div>
            </div>*/}

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
                <div className="bg-white p-3 rounded shadow border border-green-300 text-sm flex justify-between items-center">
                    <span>{selectedUsers.length} member is selected</span>
                    <div className="flex gap-3">
                        <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Send noti</button>
                        <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">Delete</button>
                    </div>
                </div>
            )}

            {/* User Table */}
            <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-green-700">
                        <tr>
                            <th></th>
                            <th>ID User</th>
                            <th>Full Name</th>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Detail</th>
                        </tr>
                    </thead>
                    {/* <tbody>
                        {filteredUsers.map((u) => (
                            <tr key={u.email} className="border-t">
                                <td>
                                    <input type="checkbox" checked={selectedUsers.includes(u.email)} onChange={() => toggleUser(u.email)} />
                                </td>
                                <td>{u.id}</td>
                                <td>{u.fullname}</td>
                                <td>{u.username}</td>
                                <td>{u.email}</td>
                                <td className="text-green-800 font-medium">{u.addictionLevel}</td>
                                <td>{u.plan}</td>
                                <td>{u.coach || <span className="text-red-500 italic">None</span>}</td>
                                <td>{u.badges.map((b) => <span key={b} className="inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded mr-1">{b}</span>)}</td>
                                <td>
                                    <button onClick={() => setSelectedUser(u)} className="text-green-600 hover:underline flex items-center gap-1">
                                        <Eye size={14} /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody> */}
                </table>
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl relative">
                        <button onClick={() => setSelectedUser(null)} className="absolute top-2 right-3 text-gray-400 hover:text-black">×</button>
                        <h3 className="text-lg font-bold text-green-700 mb-4">Detail of member</h3>
                        <p><strong>Full Name:</strong> {selectedUser.name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Dependency:</strong> {selectedUser.addictionLevel}</p>
                        <p><strong>Progress:</strong> {selectedUser.plan}</p>
                        <p><strong>Coach:</strong> {selectedUser.coach || "None"}</p>
                        <div className="mt-3">
                            <strong>Badge:</strong>
                            <div className="mt-1">
                                {selectedUser.badges.map((b: string) => (
                                    <span key={b} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded mr-2">{b}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

