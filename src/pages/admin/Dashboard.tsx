// src/pages/admin/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { 
  getMonthlyUserStatistics, 
  getGenderStatistics, 
  getAgeGroupStatistics,
  getPaymentSummary,
  getMonthlyPaymentStats,
  getQuitPlanCounts
} from '../../api/dashboardApi'; 
import type { 
  MonthlyUserStatistic, 
  GenderStatistic, 
  AgeGroupStatistic,
  PaymentSummary,
  MonthlyPaymentStat,
  QuitPlanCounts
} from '../../api/dashboardApi';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart
} from 'recharts';

// Color schemes with green and white theme
const COLORS_GENDER = ['#10B981', '#34D399', '#6EE7B7']; // Green variations
const COLORS_AGE_GROUP = [
  '#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5', '#ECFDF5', '#F0FDF4'
];
const COLORS_QUIT_PLANS = ['#10B981', '#EF4444', '#3B82F6']; // Green, Red, Blue

const Dashboard: React.FC = () => {
  // Existing states
  const [monthlyStats, setMonthlyStats] = useState<MonthlyUserStatistic[]>([]);
  const [genderStats, setGenderStats] = useState<GenderStatistic[]>([]);
  const [ageGroupStats, setAgeGroupStats] = useState<AgeGroupStatistic[]>([]);
  
  // New states for payment and quit plans
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
  const [monthlyPaymentStats, setMonthlyPaymentStats] = useState<MonthlyPaymentStat[]>([]);
  const [quitPlanCounts, setQuitPlanCounts] = useState<QuitPlanCounts | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Separate year selectors for different charts
  const [userGrowthYear, setUserGrowthYear] = useState<number>(new Date().getFullYear());
  const [paymentYear, setPaymentYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          monthlyDataUserGrowth,
          monthlyDataPayment,
          genderData, 
          ageGroupData,
          paymentSummaryData,
          quitPlanData
        ] = await Promise.all([
          getMonthlyUserStatistics(userGrowthYear),
          getMonthlyPaymentStats(paymentYear),
          getGenderStatistics(),
          getAgeGroupStatistics(),
          getPaymentSummary(),
          getQuitPlanCounts()
        ]);
        
        setMonthlyStats(monthlyDataUserGrowth);
        setMonthlyPaymentStats(monthlyDataPayment);
        setGenderStats(genderData);
        setAgeGroupStats(ageGroupData);
        setPaymentSummary(paymentSummaryData);
        setQuitPlanCounts(quitPlanData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userGrowthYear, paymentYear]);

  // Handle year change for user growth
  const handleUserGrowthYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(event.target.value);
    if (!isNaN(year) && year > 1900 && year <= new Date().getFullYear() + 1) {
      setUserGrowthYear(year);
    }
  };

  // Handle year change for payment
  const handlePaymentYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(event.target.value);
    if (!isNaN(year) && year > 1900 && year <= new Date().getFullYear() + 1) {
      setPaymentYear(year);
    }
  };

  // Format monthly user stats (ensure 12 months)
  const formattedMonthlyStats = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const stat = monthlyStats.find(s => s.month === month);
    return { 
      month: `Month ${month}`, 
      count: stat ? stat.count : 0,
      monthName: new Date(2000, i).toLocaleString('en', { month: 'short' })
    };
  });

  // Format monthly payment stats
  const formattedMonthlyPaymentStats = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const stat = monthlyPaymentStats.find(s => s.month === month);
    return { 
      month: `Month ${month}`,
      monthName: new Date(2000, i).toLocaleString('en', { month: 'short' }),
      revenue: stat ? (stat.totalAmount || 0) : 0,
      subscriptions: stat ? stat.count : 0
    };
  });

  // Format quit plan data for pie chart
  const formattedQuitPlanData = quitPlanCounts ? [
    { name: 'Active', value: quitPlanCounts.active, count: quitPlanCounts.active },
    { name: 'Cancelled', value: quitPlanCounts.cancelled, count: quitPlanCounts.cancelled },
    { name: 'Completed', value: quitPlanCounts.completed, count: quitPlanCounts.completed }
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="text-center text-gray-600 p-8 bg-white rounded-xl shadow-lg border border-green-100">
          <svg className="animate-spin h-10 w-10 text-green-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-semibold">Loading Dashboard Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="text-center text-red-600 p-8 bg-white rounded-xl shadow-lg border border-red-200">
          <p className="font-bold text-xl mb-3">Error Loading Data!</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
      </div>

      {/* Payment Summary Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Payment Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentSummary && (
            <>
              <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600">${paymentSummary.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Subscriptions</p>
                    <p className="text-3xl font-bold text-green-600">{paymentSummary.totalCount.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quit Plans Summary Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Quit Plans Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quitPlanCounts && (
            <>
              <div className="bg-white p-4 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Plans</p>
                    <p className="text-2xl font-bold text-green-600">{quitPlanCounts.active}</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-full">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Completed Plans</p>
                    <p className="text-2xl font-bold text-blue-600">{quitPlanCounts.completed}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cancelled Plans</p>
                    <p className="text-2xl font-bold text-red-600">{quitPlanCounts.cancelled}</p>
                  </div>
                  <div className="p-2 bg-red-100 rounded-full">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Plans</p>
                    <p className="text-2xl font-bold text-gray-700">{quitPlanCounts.active + quitPlanCounts.completed + quitPlanCounts.cancelled}</p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-full">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Charts Grid - Compact Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Monthly User Growth Chart */}
        <section className="p-6 bg-white rounded-lg shadow-md border border-green-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Monthly User Growth</h2>
            <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
              <label htmlFor="user-growth-year" className="text-sm text-gray-600 font-medium">Year:</label>
              <input
                id="user-growth-year"
                type="number"
                value={userGrowthYear}
                onChange={handleUserGrowthYearChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                className="p-1 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500 w-20 text-center text-sm font-semibold text-green-700"
              />
            </div>
          </div>
          {formattedMonthlyStats.some(stat => stat.count > 0) ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={formattedMonthlyStats} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7e7" />
                <XAxis dataKey="monthName" tick={{ fill: '#374151', fontSize: 12 }} />
                <YAxis tick={{ fill: '#374151', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #10B981', 
                    borderRadius: '8px', 
                    padding: '10px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`${value} users`, 'New Users']}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#10B981"
                  activeDot={{ r: 6, fill: '#10B981' }}
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-16 text-sm">No user growth data for {userGrowthYear}</p>
          )}
        </section>

        {/* Monthly Payment Stats Chart */}
        <section className="p-6 bg-white rounded-lg shadow-md border border-green-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Monthly Revenue & Subscriptions</h2>
            <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
              <label htmlFor="payment-year" className="text-sm text-gray-600 font-medium">Year:</label>
              <input
                id="payment-year"
                type="number"
                value={paymentYear}
                onChange={handlePaymentYearChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                className="p-1 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500 w-20 text-center text-sm font-semibold text-green-700"
              />
            </div>
          </div>
          {formattedMonthlyPaymentStats.some(stat => stat.revenue > 0 || stat.subscriptions > 0) ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={formattedMonthlyPaymentStats} margin={{ top: 5, right: 20, left: 5, bottom: 40 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="subscriptionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7e7" />
                <XAxis dataKey="monthName" tick={{ fill: '#374151', fontSize: 12 }} />
                <YAxis yAxisId="revenue" orientation="left" tick={{ fill: '#374151', fontSize: 12 }} />
                <YAxis yAxisId="subscriptions" orientation="right" tick={{ fill: '#374151', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #10B981', 
                    borderRadius: '8px', 
                    padding: '10px'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'Revenue') return [`$${value.toLocaleString()}`, name];
                    return [`${value}`, name];
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Area
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                  name="Revenue ($)"
                  strokeWidth={2}
                />
                <Area
                  yAxisId="subscriptions"
                  type="monotone"
                  dataKey="subscriptions"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#subscriptionsGradient)"
                  name="Subscriptions (Count)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-16 text-sm">No payment data for {paymentYear}</p>
          )}
        </section>
      </div>

      {/* Bottom Charts Grid - Three Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gender Distribution Chart */}
        <section className="p-6 bg-white rounded-lg shadow-md border border-green-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">Gender Distribution</h2>
          {genderStats.length > 0 && genderStats.some(stat => stat.count > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={genderStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#10B981"
                  dataKey="count"
                  nameKey="gender"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {genderStats.map((_, index) => (
                    <Cell key={`cell-gender-${index}`} fill={COLORS_GENDER[index % COLORS_GENDER.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #10B981', borderRadius: '6px', padding: '8px' }}
                  formatter={(value: number, name: string) => [`${value} users`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12 text-sm">No gender data</p>
          )}
        </section>

        {/* Age Group Distribution Chart */}
        <section className="p-6 bg-white rounded-lg shadow-md border border-green-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">Age Group Distribution</h2>
          {ageGroupStats.length > 0 && ageGroupStats.some(stat => stat.count > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={ageGroupStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#34D399"
                  dataKey="count"
                  nameKey="ageGroup"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {ageGroupStats.map((_, index) => (
                    <Cell key={`cell-age-${index}`} fill={COLORS_AGE_GROUP[index % COLORS_AGE_GROUP.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #10B981', borderRadius: '6px', padding: '8px' }}
                  formatter={(value: number, name: string) => [`${value} users`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12 text-sm">No age group data</p>
          )}
        </section>

        {/* Quit Plan Status Chart */}
        <section className="p-6 bg-white rounded-lg shadow-md border border-green-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">Quit Plan Status</h2>
          {formattedQuitPlanData.length > 0 && formattedQuitPlanData.some(stat => stat.value > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={formattedQuitPlanData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#10B981"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {formattedQuitPlanData.map((_, index) => (
                    <Cell key={`cell-quit-${index}`} fill={COLORS_QUIT_PLANS[index % COLORS_QUIT_PLANS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #10B981', borderRadius: '6px', padding: '8px' }}
                  formatter={(value: number, name: string) => [`${value} plans`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12 text-sm">No quit plan data</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;