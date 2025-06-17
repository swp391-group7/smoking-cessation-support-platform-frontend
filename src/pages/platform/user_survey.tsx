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
          SURVEY OF FREQUENCY OF USE
        </h1>

        <label className="block text-3xl font-bold mb-3">Smoking duration</label>

        <input
          name="smoke_duration"
          placeholder="Ex: 5 years, 10 months"
          value={formData.smoke_duration}
          onChange={handleChange}
          className="w-full p-2 text-xl border border-green-400 rounded mb-3"
        />

        <div className="flex items-center text-xl gap-2 mb-3">
          <label className="min-w-[150px]">Number of packs</label>
          <input
            name="cigarettes_per_day"
            type="number"
            value={formData.cigarettes_per_day}
            onChange={handleChange}
            className="w-24 p-2 border border-green-400 rounded text-center"
          />
          <span>/day</span>
        </div>

        <div className="flex items-center text-xl gap-2 mb-3">
          <label className="min-w-[150px]">Price</label>
          <input
            name="price_each"
            type="number"
            value={formData.price_each}
            onChange={handleChange}
            className="w-24 p-2 border border-green-400 rounded text-center"
          />
          <span>/packs</span>
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
            <label className="block text-3xl font-bold mb-3">Reasons</label>
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
            <label className="block text-3xl font-bold mb-3">Health status</label>
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

        <label className="block text-3xl font-bold mb-3">Dependency level</label>
        <div className="flex items-center text-xl gap-4 mb-6">
          <span>Mild</span>
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
          <span>Severe</span>
        </div>

        <label className="block text-3xl font-bold mb-4">Notes (optional)</label>
        <textarea
          name="note"
          placeholder="You can add notes about your smoking habits or any other information you would like to share"
          value={formData.note}
          onChange={handleChange}
          className="w-full p-2 text-xl border border-green-500 rounded mb-6"
        />

        <div className="text-center">
          <p className="text-xl text-gray-700 mb-4">
            Thank you for taking the survey!<br />
            Your feedback is valuable for us.
          </p>
          <button
            className="bg-emerald-600 text-xl text-white px-6 py-2 rounded-full text-sm font-medium"
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
