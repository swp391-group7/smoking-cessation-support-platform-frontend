import React, { useState } from "react";
import type { UserSurvey } from "@/api/usersurvey";

const user_survey: React.FC = () => {
  const [formData, setFormData] = useState<UserSurvey>({
    user_id: "",
    smoke_duration: "",
    cigarettes_per_day: 0,
    price_each: 0,
    tried_to_quit: false,
    reasons_cant_quit: "",
    health_status: "",
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

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-extrabold text-center text-green-700 mb-2">
        KHẢO SÁT TẦN SUẤT SỬ DỤNG
      </h1>

      <label className="block text-xl font-bold mb-1">Thông tin cá nhân</label>
      <input
        name="user_id"
        type="text"
        value={formData.user_id}
        onChange={handleChange}
        placeholder="User ID"
        className="w-full border-2 border-green-300 rounded px-3 py-2 mb-4"
      />

      <input
        name="smoke_duration"
        placeholder="Thời gian hút thuốc (vd: 3 năm)"
        value={formData.smoke_duration}
        onChange={handleChange}
        className="w-full p-2 border border-green-400 rounded mb-3"
      />

      <div className="flex items-center gap-2 mb-3">
        <label className="min-w-[100px]">Số điếu</label>
        <input
          name="cigarettes_per_day"
          type="number"
          value={formData.cigarettes_per_day}
          onChange={handleChange}
          className="w-24 p-2 border border-green-400 rounded text-center"
        />
        <span>/ngày</span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <label className="min-w-[100px]">Giá tiền</label>
        <input
          name="price_each"
          type="number"
          value={formData.price_each}
          onChange={handleChange}
          className="w-24 p-2 border border-green-400 rounded text-center"
        />
        <span>/điếu</span>
      </div>

      <label className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          name="tried_to_quit"
          checked={formData.tried_to_quit}
          onChange={handleChange}
          className="accent-green-500"
        />
        Bạn đã từng cố bỏ thuốc chưa?
      </label>

      <textarea
        name="reasons_cant_quit"
        placeholder="Lí do chưa thể bỏ thuốc hoàn toàn"
        value={formData.reasons_cant_quit}
        onChange={handleChange}
        className="w-full p-2 border border-green-400 rounded mb-3"
      />

      <textarea
        name="health_status"
        placeholder="Tình trạng sức khỏe hiện tại"
        value={formData.health_status}
        onChange={handleChange}
        className="w-full p-2 border border-green-400 rounded mb-6"
      />

      <label className="block text-xl font-bold mb-2">Mức độ phụ thuộc</label>
      <div className="flex items-center gap-4 mb-6">
        <span>Nhẹ</span>
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`w-8 h-8 rounded-full cursor-pointer transition ${formData.dependency_level === level
                ? "bg-green-600"
                : "bg-green-200 hover:bg-green-400"
              }`}
            onClick={() => handleDependencyClick(level)}
          />
        ))}
        <span>Nặng</span>
      </div>

      <textarea
        name="note"
        placeholder="Ghi chú thêm (nếu có)"
        value={formData.note}
        onChange={handleChange}
        className="w-full p-2 border border-green-500 rounded mb-6"
      />

      <div className="text-center">
        <p className="text-lg text-gray-700 mb-4">
          Cảm ơn bạn đã tham gia khảo sát!<br />
          Chúng tôi sẽ sử dụng thông tin này để giúp đỡ bạn.
        </p>
        <button
          className="bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-medium"
          onClick={() => console.log(formData)}
        >
          Gửi khảo sát
        </button>
      </div>


    </form>
  );
};

export default user_survey;
