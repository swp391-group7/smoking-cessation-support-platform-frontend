// src/pages/admin/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { getMonthlyUserStatistics, getGenderStatistics, getAgeGroupStatistics } from '../../api/dashboardApi'; 
import type { MonthlyUserStatistic, GenderStatistic, AgeGroupStatistic, }from '../../api/dashboardApi';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Màu sắc cho biểu đồ tròn (có thể tùy chỉnh)
const COLORS_GENDER = ['#0088FE', '#FFBB28', '#FF8042']; // Nam, Nữ, Khác/Không xác định
const COLORS_AGE_GROUP = [
  '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#8884d8', '#82ca9d', '#ffc658',
];

const Dashboard: React.FC = () => {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyUserStatistic[]>([]);
  const [genderStats, setGenderStats] = useState<GenderStatistic[]>([]);
  const [ageGroupStats, setAgeGroupStats] = useState<AgeGroupStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [monthlyData, genderData, ageGroupData] = await Promise.all([
        getMonthlyUserStatistics(selectedYear),
        getGenderStatistics(),
        getAgeGroupStatistics(),
      ]);
      setMonthlyStats(monthlyData);
      setGenderStats(genderData);
      setAgeGroupStats(ageGroupData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [selectedYear]);


  // Xử lý thay đổi năm từ input
  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(event.target.value);
    if (!isNaN(year) && year > 1900 && year <= new Date().getFullYear() + 1) { // Giới hạn năm hợp lệ
      setSelectedYear(year);
    }
  };

  // Chuẩn bị dữ liệu cho biểu đồ đường (đảm bảo đủ 12 tháng, nếu thiếu thì count = 0)
  const formattedMonthlyStats = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const stat = monthlyStats.find(s => s.month === month);
    return { month: `Tháng ${month}`, count: stat ? stat.count : 0 };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center text-gray-600 p-6 bg-white rounded-lg shadow-md">
          <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang tải dữ liệu Dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center text-red-600 p-6 bg-white rounded-lg shadow-md">
          <p className="font-bold text-lg mb-2">Lỗi tải dữ liệu!</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()} // Tải lại trang để thử lại
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container p-6 bg-gray-50 rounded-lg shadow-md min-h-screen font-inter">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Bảng điều khiển quản trị</h1>

      {/* Monthly User Growth Chart */}
      <section className="mb-10 p-6 border border-gray-200 rounded-xl bg-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Tăng trưởng người dùng hàng tháng</h2>
          <div className="flex items-center space-x-3">
            <label htmlFor="year-select" className="text-gray-700 font-medium">Chọn năm:</label>
            <input
              id="year-select"
              type="number"
              value={selectedYear}
              onChange={handleYearChange}
              min="1900"
              max={new Date().getFullYear() + 1}
              className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-28 text-center"
            />
          </div>
        </div>
        {formattedMonthlyStats.some(stat => stat.count > 0) ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={formattedMonthlyStats}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fill: '#555' }} />
              <YAxis tick={{ fill: '#555' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                labelStyle={{ color: '#333', fontWeight: 'bold' }}
                itemStyle={{ color: '#666' }}
                formatter={(value: number) => [`${value} người dùng`, 'Số lượng']}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Số lượng người dùng mới"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-10">Không có dữ liệu tăng trưởng người dùng cho năm {selectedYear}.</p>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gender Distribution Chart */}
        <section className="p-6 border border-gray-200 rounded-xl bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Phân bổ người dùng theo giới tính</h2>
          {genderStats.length > 0 && genderStats.some(stat => stat.count > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="gender"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {genderStats.map((_, index) => (
                    <Cell key={`cell-gender-${index}`} fill={COLORS_GENDER[index % COLORS_GENDER.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                  labelStyle={{ color: '#333', fontWeight: 'bold' }}
                  itemStyle={{ color: '#666' }}
                  formatter={(value: number, name: string) => [`${value} người dùng`, name]}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-10">Không có dữ liệu phân bổ giới tính.</p>
          )}
        </section>

        {/* Age Group Distribution Chart */}
        <section className="p-6 border border-gray-200 rounded-xl bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Phân bổ người dùng theo nhóm tuổi</h2>
          {ageGroupStats.length > 0 && ageGroupStats.some(stat => stat.count > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ageGroupStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#82ca9d"
                  dataKey="count"
                  nameKey="ageGroup"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {ageGroupStats.map((_, index) => (
                    <Cell key={`cell-age-${index}`} fill={COLORS_AGE_GROUP[index % COLORS_AGE_GROUP.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                  labelStyle={{ color: '#333', fontWeight: 'bold' }}
                  itemStyle={{ color: '#666' }}
                  formatter={(value: number, name: string) => [`${value} người dùng`, name]}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-10">Không có dữ liệu phân bổ nhóm tuổi.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
