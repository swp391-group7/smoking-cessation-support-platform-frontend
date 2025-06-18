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
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8 border border-green-100 ">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-6 py-12 text-black">
        <h1 className="text-4xl font-semibold text-center text-green-800 mb-10">
          SURVEY OF FREQUENCY OF USE
        </h1>

        <label className="block text-2xl font-medium text-gray-700 mb-3">Smoking duration</label>

        <input
          name="smoke_duration"
          placeholder="Ex: 5 years, 10 months"
          value={formData.smoke_duration}
          onChange={handleChange}
          className="w-full p-2 text-xl border rounded-lg focus:ring-green-500 focus:border-green-50 mb-3"
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-xl gap-2 mb-3">
            <label className=" min-w-[170px]">Number of packs</label>
            <input
              name="cigarettes_per_day"
              type="number"
              value={formData.cigarettes_per_day}
              onChange={handleChange}
              className="w-24 p-2 border rounded-lg text-center"
            />
            <span>/day</span>
          </div>

          <div className="flex items-center text-xl gap-2 mb-3">
            <label className="min-w-[60px]">Price</label>
            <input
              name="price_each"
              type="number"
              value={formData.price_each}
              onChange={handleChange}
              className="w-24 p-2 border rounded-lg text-center"
            />
            <span>/packs</span>
          </div>
        </div>

        <label className="flex items-center text-xl gap-2 mb-4">
          <input
            type="checkbox"
            name="tried_to_quit"
            checked={formData.tried_to_quit}
            onChange={handleChange}
            className="accent-green-500"
          />
          Have you ever tried to quit smoking?
        </label>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cột trái */}
          <div className="space-y-4">
            <label className="block text-2xl font-medium text-gray-700 mb-3">Reasons</label>
            <div className="space-y-2 mb-4">
              {['Stress', 'Habits', 'Lack of support', 'Other'].map((reason) => (
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
            <label className="block text-2xl font-medium text-gray-700 mb-3">Health status</label>
            <div className="space-y-2 mb-4">
              {['Good', 'Average', 'Poor'].map((status) => (
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

        <label className="block text-2xl font-medium text-gray-700 mb-3">Dependency level</label>
        <div className="flex items-center text-xl gap-10 mb-6 max-w-6xl mx-auto px-8 py-12 bg-white rounded-2xl shadow-md">
          <span className="text-xl">Low</span>

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
                  className={`w-10 h-10 rounded-full cursor-pointer transition border-2 border-gray-300
            ${softColors[level - 1]} ${softHoverColors[level - 1]}
            ${isSelected ? "ring-4 ring-offset-2 ring-green-700 scale-110" : ""}
          `}
                  onClick={() => handleDependencyClick(level)}
                  title={levelNames[level - 1]} // ← Tooltip text here
                />
                <span className="text-lg">{level}</span>
              </div>
            );
          })}

          <span className="text-xl">High</span>
        </div>

        <label className="block text-2xl font-medium text-gray-700 mb-4">Notes (optional)</label>
        <textarea
          name="note"
          placeholder="You can add notes about your smoking habits or any other information you would like to share"
          value={formData.note}
          onChange={handleChange}
          className="w-full p-2 text-xl border rounded-lg focus:ring-green-500 focus:border-green-50 mb-6"
        />

        <div className="text-center mt-4">
          <p className="text-xl text-gray-700 mb-4">
            Thank you for taking the survey!<br />
            Your feedback is valuable for us.
          </p>
          <button
            className="bg-emerald-600 text-xl text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-green-700"
            onClick={() => console.log(formData)}
          >
            Submit
          </button>
        </div>


      </form>

    </div>

  );
};

export default user_survey;
