import React, { useState } from "react";
import type { UserSurvey } from "@/api/usersurvey";

const user_survey: React.FC = () => {
  const [formData, setFormData] = useState<UserSurvey>({
    user_id: "", // Add a default value or fetch the actual user id as needed
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
    <div className="bg-white border-green-400 shadow-md rounded-xl p-6 border">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-6 py-12 text-black">
        <h1 className="text-5xl font-extrabold text-center text-green-700 mb-10">
          KHẢO SÁT TẦN SUẤT SỬ DỤNG
        </h1>

        <label className="block text-3xl font-bold mb-3">Thời gian hút thuốc</label>

        <input
          name="smoke_duration"
          placeholder="Ví dụ: 3 năm"
          value={formData.smoke_duration}
          onChange={handleChange}
          className="w-full p-2 text-xl border border-green-400 rounded mb-3"
        />

        <div className="flex items-center text-xl gap-2 mb-3">
          <label className="min-w-[100px]">Số gói</label>
          <input
            name="cigarettes_per_day"
            type="number"
            value={formData.cigarettes_per_day}
            onChange={handleChange}
            className="w-24 p-2 border border-green-400 rounded text-center"
          />
          <span>/ngày</span>
        </div>

        <div className="flex items-center text-xl gap-2 mb-3">
          <label className="min-w-[100px]">Giá tiền</label>
          <input
            name="price_each"
            type="number"
            value={formData.price_each}
            onChange={handleChange}
            className="w-24 p-2 border border-green-400 rounded text-center"
          />
          <span>/gói</span>
        </div>

        <label className="flex items-center text-xl gap-2 mb-4">
          <input
            type="checkbox"
            name="tried_to_quit"
            checked={formData.tried_to_quit}
            onChange={handleChange}
            className="accent-green-500"
          />
          Bạn đã từng cố bỏ thuốc chưa?
        </label>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cột trái */}
          <div className="space-y-4">
            <label className="block text-3xl font-bold mb-3">Lí do chưa thể bỏ thuốc</label>
            <div className="space-y-2 mb-4">
              {['Stress', 'Thói quen', 'Thiếu sự hỗ trợ', 'Khác'].map((reason) => (
                <label key={reason} className="flex items-center text-xl space-x-2">
                  <input
                    type="checkbox"
                    name="reasons_cant_quit"
                    value={reason}
                    checked={formData.reasons_cant_quit === reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reasons_cant_quit: e.target.value })
                    }
                    className="accent-green-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

        {/* Cột phải */}

        <div className="space-y-4">
          <label className="block text-3xl font-bold mb-3">Tình trạng sức khỏe</label>
          <div className="space-y-2 mb-4">
            {['Tốt', 'Trung bình', 'Kém'].map((status) => (
              <label key={status} className="flex items-center text-xl space-x-2">
                <input
                  type="checkbox"
                  name="health_status"
                  value={status}
                  checked={formData.health_status === status}
                  onChange={(e) =>
                    setFormData({ ...formData, health_status: e.target.value })
                  }
                  className="accent-green-500"
                />
                <span>{status}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

        <label className="block text-3xl font-bold mb-3">Mức độ phụ thuộc</label>
        <div className="flex items-center text-xl gap-4 mb-6">
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

        <label className="block text-3xl font-bold mb-4">Ghi chú thêm (nếu có)</label>
        <textarea
          name="note"
          placeholder="Bạn có thể ghi chú thêm về thói quen hút thuốc hoặc bất kỳ thông tin nào khác bạn muốn chia sẻ"
          value={formData.note}
          onChange={handleChange}
          className="w-full p-2 text-xl border border-green-500 rounded mb-6"
        />

        <div className="text-center">
          <p className="text-xl text-gray-700 mb-4">
            Cảm ơn bạn đã tham gia khảo sát!<br />
            Chúng tôi sẽ sử dụng thông tin này để giúp đỡ bạn.
          </p>
          <button
            className="bg-emerald-600 text-xl text-white px-6 py-2 rounded-full text-sm font-medium"
            onClick={() => console.log(formData)}
          >
            Gửi khảo sát
          </button>
        </div>


      </form>

    </div>

  );
};

export default user_survey;
