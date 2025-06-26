import { useState } from "react";
import { Search, Filter, Eye } from "lucide-react";

const mockUsers = [
    {
        name: "Nguyen Van A",
        email: "a@example.com",
        addictionLevel: "Nặng",
        plan: "Cai ngay",
        badges: ["7 ngày", "14 ngày"],
        coach: "Coach Huy",
        status: "Đang hoạt động",
    },
    {
        name: "Tran Thi B",
        email: "b@example.com",
        addictionLevel: "Vừa",
        plan: "Cai từ từ",
        badges: ["7 ngày"],
        coach: null,
        status: "Chưa gán coach",
    },
];

const levels = ["Nhẹ", "Vừa", "Nặng"];
const plans = ["Cai từ từ", "Cai ngay"];

export default function UserManagement() {
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [filter, setFilter] = useState({ level: "", plan: "", coach: "" });
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const filteredUsers = mockUsers.filter((u) => {
        return (
            (!filter.level || u.addictionLevel === filter.level) &&
            (!filter.plan || u.plan === filter.plan) &&
            (!filter.coach || (filter.coach === "Đã gán" ? u.coach : !u.coach))
        );
    });

    const toggleUser = (email: string) => {
        setSelectedUsers((prev) =>
            prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
        );
    };

    return (
        <div className="p-6 space-y-6 bg-green-50 min-h-screen">
            <h2 className="text-2xl font-bold text-green-700">User Management</h2>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Mức độ:</label>
                    <select className="border rounded px-2 py-1 text-sm" value={filter.level} onChange={(e) => setFilter({ ...filter, level: e.target.value })}>
                        <option value="">Tất cả</option>
                        {levels.map((l) => <option key={l}>{l}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Lộ trình:</label>
                    <select className="border rounded px-2 py-1 text-sm" value={filter.plan} onChange={(e) => setFilter({ ...filter, plan: e.target.value })}>
                        <option value="">Tất cả</option>
                        {plans.map((p) => <option key={p}>{p}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Coach:</label>
                    <select className="border rounded px-2 py-1 text-sm" value={filter.coach} onChange={(e) => setFilter({ ...filter, coach: e.target.value })}>
                        <option value="">Tất cả</option>
                        <option value="Đã gán">Đã gán</option>
                        <option value="Chưa gán">Chưa gán</option>
                    </select>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
                <div className="bg-white p-3 rounded shadow border border-green-300 text-sm flex justify-between items-center">
                    <span>{selectedUsers.length} người dùng được chọn</span>
                    <div className="flex gap-3">
                        <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Gán coach</button>
                        <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">Gửi thông báo</button>
                    </div>
                </div>
            )}

{/* User Table */}
      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-green-700">
            <tr>
              <th></th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Mức độ</th>
              <th>Lộ trình</th>
              <th>Coach</th>
              <th>Huy hiệu</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.email} className="border-t">
                <td>
                  <input type="checkbox" checked={selectedUsers.includes(u.email)} onChange={() => toggleUser(u.email)} />
                </td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td className="text-green-800 font-medium">{u.addictionLevel}</td>
                <td>{u.plan}</td>
                <td>{u.coach || <span className="text-red-500 italic">Chưa gán</span>}</td>
                <td>{u.badges.map((b) => <span key={b} className="inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded mr-1">{b}</span>)}</td>
                <td>
                  <button onClick={() => setSelectedUser(u)} className="text-green-600 hover:underline flex items-center gap-1">
                    <Eye size={14} /> Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
