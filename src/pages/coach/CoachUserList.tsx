import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserSummary {
  id: string;
  username: string;
  email: string;
  status: "active" | "inactive";
  membership: string;
}

const mockUsers: UserSummary[] = [
  {
    id: "1",
    username: "john_doe",
    email: "john@example.com",
    membership: "Premium",
    status: "active",
  },
  {
    id: "2",
    username: "jane_smith",
    email: "jane@example.com",
    membership: "Free",
    status: "inactive",
  },
];

export default function CoachUserList() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Giả lập fetch API
    setTimeout(() => setUsers(mockUsers), 300);
  }, []);

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(filter.toLowerCase()) ||
    u.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Danh sách người dùng</h2>
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Tên</th>
            <th className="p-2">Email</th>
            <th className="p-2">Gói</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.username}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.membership}</td>
              <td className="p-2">
                <span
                  className={
                    user.status === "active"
                      ? "text-green-600 font-medium"
                      : "text-gray-500"
                  }
                >
                  {user.status === "active" ? "Đang cai" : "Không hoạt động"}
                </span>
              </td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => navigate(`/coach/users/${user.id}`)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Xem
                </button>
                <button
                  onClick={() => navigate(`/coach/chat/${user.id}`)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Chat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
