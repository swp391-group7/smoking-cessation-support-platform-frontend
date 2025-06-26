// src/pages/admin/Dashboard.tsx
import { Eye, Target, Hand } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, BarChart, Bar } from "recharts";

const dealsData = [
  { date: "Oct 23", value: 60 },
  { date: "Oct 27", value: 75 },
  { date: "Oct 31", value: 70 },
  { date: "Nov 8", value: 85 },
  { date: "Nov 12", value: 90 },
  { date: "Nov 16", value: 87 },
];

const salesData = [
  { name: "1", value: 200 },
  { name: "2", value: 400 },
  { name: "3", value: 350 },
  { name: "4", value: 500 },
  { name: "5", value: 300 },
  { name: "6", value: 450 },
];

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-50 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-sm text-gray-500">System improvements delivered to better assist tobacco-free lives</p>
        </div>
        <p className="text-sm text-gray-400">/ Dashboard</p>
      </div>

      {/* Member Growth + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Member Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dealsData}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUv)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          {[{
            title: "Impressions", value: "1,563", icon: Eye, color: "bg-blue-500"
          }, {
            title: "Goal", value: "30,564", icon: Target, color: "bg-green-500"
          }, {
            title: "Impact", value: "42.6%", icon: Hand, color: "bg-yellow-500"
          }].map(({ title, value, icon: Icon, color }, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
              <div>
                <h4 className="text-sm text-gray-500">{title}</h4>
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs text-gray-400">May 23 - June 01 (2017)</p>
              </div>
              <div className={`p-2 rounded-md text-white ${color}`}>
                <Icon size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Published Project", value: 532, change: "+1.69%", color: "text-green-500" },
          { label: "Completed Task", value: 4569, change: "-0.5%", color: "text-red-500" },
          { label: "Successful Task", value: "89%", change: "+0.99%", color: "text-green-500" },
          { label: "Ongoing Project", value: 365, change: "+0.35%", color: "text-green-500" },
        ].map(({ label, value, change, color }, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow">
            <h4 className="text-sm text-gray-600">{label}</h4>
            <div className="flex justify-between items-center">
              <p className="text-xl font-semibold">{value}</p>
              <span className={`text-sm font-medium ${color}`}>{change}</span>
            </div>
            <div className="h-2 mt-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full ${color} bg-opacity-30`} style={{ width: "60%" }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Overview + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales */}
        <div className="bg-blue-500 text-white rounded-xl p-4 shadow">
          <h4 className="text-lg">Sales In July</h4>
          <p className="text-2xl font-bold">$2665.00</p>
          <div className="flex justify-between text-sm mt-2">
            <span>Direct Sale: $1768</span>
            <span>Referral: $897</span>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={salesData}>
              <Line type="monotone" dataKey="value" stroke="#fff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* What's New */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h4 className="font-semibold mb-4">What’s New</h4>
          <ul className="space-y-4 text-sm">
            <li><strong>Your Manager Posted.</strong> – Jonny michel</li>
            <li><strong>You have 3 pending Task.</strong> – Hemilton</li>
            <li><strong>New Order Received.</strong> – Hemilton</li>
          </ul>
        </div>

        {/* Latest Activity */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h4 className="font-semibold mb-4">Latest Activity</h4>
          <ul className="space-y-3 text-sm">
            <li><strong>Development & Update:</strong> Lorem ipsum dolor sit amet</li>
            <li><strong>Showcases:</strong> Lorem dolor sit amet</li>
            <li><strong>Miscellaneous:</strong> Lorem sit amet</li>
            <li><strong>Your Manager Posted.</strong> – More</li>
          </ul>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h4 className="font-semibold mb-4">New Products</h4>
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500">
            <tr>
              <th>Name</th>
              <th>Product Code</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Sofa", "#PHD001", "abc@gmail.com", "Out Stock", 3],
              ["Computer", "#PHD002", "cdc@gmail.com", "In Stock", 2],
              ["Mobile", "#PHD003", "pqr@gmail.com", "Out Stock", 4],
              ["Coat", "#PHD004", "bcs@gmail.com", "In Stock", 3],
              ["Watch", "#PHD005", "cdc@gmail.com", "In Stock", 2],
              ["Shoes", "#PHD006", "pqr@gmail.com", "Out Stock", 4],
            ].map(([name, code, email, status, rating], i) => (
              <tr key={i} className="border-t">
                <td className="py-2">{name}</td>
                <td>{code}</td>
                <td>{email}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${status === "In Stock" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{status}</span>
                </td>
                <td>{"★".repeat(rating as number) + "☆".repeat(5 - (rating as number))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
