// Ví dụ minh họa component structure (React + TSX)
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";

type DailyFormValues = {
  numCigarettes: number;
  frequency: string;
  pricePerUnit: number;
  healthStatus: string[];
  note: string;
};

export default function Quit_Plan() {
  const { register, handleSubmit, control, reset } = useForm<DailyFormValues>();

  const onSubmit = (data: DailyFormValues) => {
    // Gửi data lên API, sau đó reset form
    console.log("Submitted:", data);
    reset();
  };

  // Dữ liệu mẫu cho chart
  const chartData = [
    { date: "05/26", smoked: 5 },
    { date: "05/27", smoked: 4 },
    { date: "05/28", smoked: 2 },
    { date: "05/29", smoked: 0 },
    { date: "05/30", smoked: 0 },
    { date: "05/31", smoked: 0 },
    { date: "06/01", smoked: 0 },
  ];

  const savingsData = [
    { date: "05/26", saved: 100 },
    { date: "05/27", saved: 200 },
    { date: "05/28", saved: 350 },
    { date: "05/29", saved: 500 },
    { date: "05/30", saved: 650 },
    { date: "05/31", saved: 800 },
    { date: "06/01", saved: 950 },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h3 className="text-gray-500 text-sm">Ngày không hút</h3>
          <p className="text-3xl font-bold">15</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h3 className="text-gray-500 text-sm">Tiền tiết kiệm</h3>
          <p className="text-3xl font-bold">1,200,000 VND</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h3 className="text-gray-500 text-sm">Tình trạng sức khỏe</h3>
          <p className="text-3xl font-bold">Tốt</p>
        </div>
      </div>

      {/* Form Ghi Nhận */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Nhập Thông Tin Hôm Nay</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Số điếu thuốc</label>
              <input
                type="number"
                {...register("numCigarettes", { valueAsNumber: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="VD: 5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tần suất</label>
              <select
                {...register("frequency")}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="daily">Mỗi ngày</option>
                <option value="alternate">Cách ngày</option>
                <option value="weekly">1-2 lần/tuần</option>
                <option value="occasional">Thỉnh thoảng</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Giá tiền (/điếu hoặc/bao)</label>
              <input
                type="number"
                {...register("pricePerUnit", { valueAsNumber: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="VD: 25,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tình trạng sức khỏe</label>
              <Controller
                control={control}
                name="healthStatus"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {["Đau đầu", "Khó ngủ", "Tinh thần kém"].map((label) => (
                      <label key={label} className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          value={label}
                          checked={field.value?.includes(label)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...(field.value || []), label]);
                            } else {
                              field.onChange(field.value?.filter((v) => v !== label));
                            }
                          }}
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
            <textarea
              {...register("note")}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Một vài ghi chú (nếu cần)..."
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Lưu lại
          </button>
        </form>
      </motion.div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h3 className="text-lg font-medium mb-2">Số điếu hút từng ngày</h3>
          <BarChart width={400} height={220} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: "Điếu", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Bar dataKey="smoked" fill="#8884d8" />
          </BarChart>
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h3 className="text-lg font-medium mb-2">Tiền tiết kiệm theo ngày</h3>
          <LineChart width={400} height={220} data={savingsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: "VND", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Line type="monotone" dataKey="saved" stroke="#82ca9d" />
          </LineChart>
        </div>
      </div>

      {/* Bảng liệt kê dữ liệu gần nhất */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-medium mb-2">Lịch sử 5 ngày gần nhất</h3>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Ngày</th>
              <th className="px-4 py-2 text-left">Số điếu</th>
              <th className="px-4 py-2 text-left">Chi phí (VND)</th>
              <th className="px-4 py-2 text-left">Ghi chú</th>
              <th className="px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: "05/28", num: 2, cost: 50_000, note: "Bị stress" },
              { date: "05/29", num: 0, cost: 0, note: "Đúng kế hoạch" },
              { date: "05/30", num: 0, cost: 0, note: "-" },
              { date: "05/31", num: 0, cost: 0, note: "-" },
              { date: "06/01", num: 0, cost: 0, note: "-" },
            ].map((row, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-4 py-2">{row.date}</td>
                <td className="px-4 py-2">{row.num}</td>
                <td className="px-4 py-2">{row.cost.toLocaleString()}</td>
                <td className="px-4 py-2">{row.note}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-blue-500 hover:underline mr-2">Sửa</button>
                  <button className="text-red-500 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
