import React, { useState } from "react";
import type { UserSurvey } from "@/api/usersurvey";

const UserSurveyForm: React.FC = () => { // Đổi tên component thành PascalCase cho chuẩn React
  const [formData, setFormData] = useState<UserSurvey>({
    user_id: "", // Add a default value or fetch the actual user id as needed
    smoke_duration: "",
    cigarettes_per_day: 0,
    price_each: 0,
    tried_to_quit: false,
    reasons_cant_quit: "", // Vẫn là string, cần thay đổi nếu muốn multi-select
    health_status: "", // Vẫn là string, cần thay đổi nếu muốn multi-select
    dependency_level: 0,
    note: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;
    let newValue: string | number | boolean = value;

    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    } else if (type === "number") {
      newValue = Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleDependencyClick = (level: number) => {
    setFormData((prev) => ({ ...prev, dependency_level: level }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit:", formData);
    // gửi dữ liệu lên server ở đây
  };

  // --- LƯU Ý QUAN TRỌNG VỀ 'reasons_cant_quit' và 'health_status' ---
  // Hiện tại, chúng đang là string và được gán giá trị mới mỗi khi checkbox được chọn.
  // Nếu bạn muốn người dùng chọn NHIỀU lý do/tình trạng sức khỏe, bạn cần thay đổi kiểu dữ liệu
  // của chúng trong UserSurvey thành string[] (mảng chuỗi) và điều chỉnh logic handleChange.
  // Ví dụ:
  // const [formData, setFormData] = useState<UserSurvey>({
  //   ...
  //   reasons_cant_quit: [], // Đổi thành mảng
  //   health_status: [],     // Đổi thành mảng
  //   ...
  // });
  // const handleCheckboxGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value, checked } = e.target;
  //   setFormData((prev) => {
  //     const currentValues = prev[name as keyof UserSurvey] as string[];
  //     if (checked) {
  //       return { ...prev, [name]: [...currentValues, value] };
  //     } else {
  //       return { ...prev, [name]: currentValues.filter((item) => item !== value) };
  //     }
  //   });
  // };
  // Và cập nhật onChange của checkbox group: onChange={handleCheckboxGroupChange}

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8 border border-green-100 ">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-6 py-12 text-black">
        <h1 className="text-4xl font-semibold text-center text-green-800 mb-10">
          SURVEY OF FREQUENCY OF USE
        </h1>

        <label className="block text-lg font-medium text-gray-700 mb-2">Smoking duration</label> {/* Giảm kích thước */}
        <input
          name="smoke_duration"
          placeholder="Ex: 5 years, 10 months"
          value={formData.smoke_duration}
          onChange={handleChange}
          className="w-full p-2 text-base border rounded-md focus:ring-green-500 focus:border-green-50 mb-4" // Giảm text-xl thành text-base, p-2
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mb-4"> {/* Điều chỉnh gap, thêm gap-y */}
          <div className="flex items-center text-base gap-2"> {/* Giảm text-xl thành text-base */}
            <label className="min-w-[140px] md:min-w-[120px]">Packs per day</label> {/* Giảm min-w */}
            <input
              name="cigarettes_per_day"
              type="number"
              value={formData.cigarettes_per_day}
              onChange={handleChange}
              className="w-20 p-1 border rounded-md text-center text-base" // Giảm w, p, text-xl
            />
            <span>/day</span>
          </div>

          <div className="flex items-center text-base gap-2"> {/* Giảm text-xl thành text-base */}
            <label className="min-w-[50px] md:min-w-[40px]">Price</label> {/* Giảm min-w */}
            <input
              name="price_each"
              type="number"
              value={formData.price_each}
              onChange={handleChange}
              className="w-20 p-1 border rounded-md text-center text-base" // Giảm w, p, text-xl
            />
            <span>/pack</span> {/* Đổi 'packs' thành 'pack' cho số ít */}
          </div>
        </div>

        <label className="flex items-center text-base gap-2 mb-4"> {/* Giảm text-xl thành text-base */}
          <input
            type="checkbox"
            name="tried_to_quit"
            checked={formData.tried_to_quit}
            onChange={handleChange}
            className="accent-green-500 w-4 h-4" // Làm nhỏ checkbox một chút
          />
          Have you ever tried to quit smoking?
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6"> {/* Giảm gap-x, gap-y, mb */}
          {/* Cột trái: Reasons */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Reasons you can't quit</label> {/* Giảm kích thước */}
            <div className="space-y-1"> {/* Giảm space-y */}
              {['Stress', 'Habits', 'Lack of support', 'Other'].map((reason) => (
                <label key={reason} className="flex items-center text-base space-x-2"> {/* Giảm text-xl thành text-base */}
                  <input
                    type="checkbox"
                    name="reasons_cant_quit"
                    value={reason}
                    // Current logic: only one reason can be selected because reasons_cant_quit is string
                    // For multi-select, change reasons_cant_quit to string[] and adjust onChange handler
                    checked={formData.reasons_cant_quit === reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reasons_cant_quit: e.target.value })
                    }
                    className="accent-green-500 w-4 h-4"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cột phải: Health status */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Health status</label> {/* Giảm kích thước */}
            <div className="space-y-1"> {/* Giảm space-y */}
              {['Good', 'Average', 'Poor'].map((status) => (
                <label key={status} className="flex items-center text-base space-x-2"> {/* Giảm text-xl thành text-base */}
                  <input
                    type="checkbox"
                    name="health_status"
                    value={status}
                    // Current logic: only one status can be selected because health_status is string
                    // For multi-select, change health_status to string[] and adjust onChange handler
                    checked={formData.health_status === status}
                    onChange={(e) =>
                      setFormData({ ...formData, health_status: e.target.value })
                    }
                    className="accent-green-500 w-4 h-4"
                  />
                  <span>{status}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <label className="block text-lg font-medium text-gray-700 mb-2">Dependency level</label> {/* Giảm kích thước */}
        {/* Giảm gap, padding và margin-bottom */}
        <div className="flex items-center text-base gap-4 mb-6 px-4 py-8 bg-white rounded-xl shadow-md">
          <span className="text-base">Low</span> {/* Giảm kích thước */}

          {[1, 2, 3, 4, 5].map((level) => {
            const softColors = [
              "bg-[#A8E6CF]", // pastel green
              "bg-[#DCE775]", // lime
              "bg-[#FFF59D]", // yellow
              "bg-[#FFAB91]", // peach
              "bg-[#EF9A9A]"  // pastel red
            ];

            const softHoverColors = [
              "hover:bg-[#81C784]",
              "hover:bg-[#D4E157]",
              "hover:bg-[#FFEE58]",
              "hover:bg-[#FF8A65]",
              "hover:bg-[#E57373]"
            ];

            const levelNames = [
              "Very Low",
              "Low",
              "Medium",
              "High",
              "Very High"
            ];

            const isSelected = formData.dependency_level === level;

            return (
              <div key={level} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full cursor-pointer transition border-2 border-gray-300
                    ${softColors[level - 1]} ${softHoverColors[level - 1]}
                    ${isSelected ? "ring-4 ring-offset-2 ring-green-700 scale-110" : ""}
                  `}
                  onClick={() => handleDependencyClick(level)}
                  title={levelNames[level - 1]} // Tooltip text here
                />
                <span className="text-sm">{level}</span> {/* Giảm kích thước */}
              </div>
            );
          })}

          <span className="text-base">High</span> {/* Giảm kích thước */}
        </div>

        <label className="block text-lg font-medium text-gray-700 mb-2">Notes (optional)</label> {/* Giảm kích thước */}
        <textarea
          name="note"
          placeholder="You can add notes about your smoking habits or any other information you would like to share"
          value={formData.note}
          onChange={handleChange}
          className="w-full p-2 text-base border rounded-md focus:ring-green-500 focus:border-green-50 mb-6" // Giảm text-xl thành text-base, p-2
        />

        <div className="text-center mt-4">
          <p className="text-base text-gray-700 mb-3"> {/* Giảm kích thước và margin-bottom */}
            Thank you for taking the survey!<br />
            Your feedback is valuable for us.
          </p>
          <button
            type="submit" // Luôn đặt type="submit" cho button trong form
            className="bg-emerald-600 text-base text-white px-5 py-2 rounded-full font-medium hover:bg-green-700" // Giảm kích thước text và padding
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserSurveyForm;