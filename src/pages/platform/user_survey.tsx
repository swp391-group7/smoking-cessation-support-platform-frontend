// src/components/UserSurveyForm.tsx
import React, { useState, useEffect } from "react";
import type {
  SurveyDetailDTO,
} from "@/api/usersurveyApi";
import { getSurveyDetailById } from "@/api/usersurveyApi";

// surveyId cố định
const FIXED_SURVEY_ID = "bff1b96e-74e9-46a3-b46e-1b625531c1ad";

// Define the 8 survey answer keys
type SurveyKey = "a1" | "a2" | "a3" | "a4" | "a5" | "a6" | "a7" | "a8";

// FullSurvey chỉ dùng để chứa formData, không import UserSurvey nữa
interface FullSurvey {
  smoke_duration: string;
  cigarettes_per_day: number;
  price_each: number;
  tried_to_quit: boolean;
  health_status: string;
  dependency_level: number;
  note: string;
  a1: string;
  a2: string;
  a3: string;
  a4: string;
  a5: string;
  a6: string;
  a7: string;
  a8: string;
}

const UserSurveyForm: React.FC = () => {
  const [formData, setFormData] = useState<FullSurvey>({
    smoke_duration: "",
    cigarettes_per_day: 0,
    price_each: 0,
    tried_to_quit: false,
    health_status: "",
    dependency_level: 0,
    note: "",
    a1: "",
    a2: "",
    a3: "",
    a4: "",
    a5: "",
    a6: "",
    a7: "",
    a8: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FullSurvey, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // chỉ phần 8 câu hỏi đây load từ API
  const [surveyQuestions, setSurveyQuestions] = useState<
    { key: SurveyKey; question: string; options: string[] }[]
  >([]);

  useEffect(() => {
    getSurveyDetailById(FIXED_SURVEY_ID)
      .then((data: SurveyDetailDTO) => {
        const first8 = data.questions.slice(0, 8).map((q, idx) => ({
          key: (`a${idx + 1}`) as SurveyKey,
          question: q.content,
          options: q.answers.map((ans) => ans.answerText),
        }));
        setSurveyQuestions(first8);
      })
      .catch(console.error);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    let newValue: string | number | boolean;
    if (type === "checkbox") newValue = checked;
    else if (type === "number") newValue = Number(value);
    else newValue = value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleQuestionChange = (key: SurveyKey, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleDependencyClick = (level: number) => {
    setFormData((prev) => ({ ...prev, dependency_level: level }));
    setErrors((prev) => ({ ...prev, dependency_level: "" }));
  };

  const validateForm = () => {
    const newErr: Partial<Record<keyof FullSurvey, string>> = {};
    if (!formData.smoke_duration) newErr.smoke_duration = "Please enter your smoking duration.";
    if (formData.cigarettes_per_day <= 0) newErr.cigarettes_per_day = "Packs per day must be a positive number.";
    if (formData.price_each <= 0) newErr.price_each = "Price per pack must be a positive number.";
    if (!formData.health_status) newErr.health_status = "Please select your health status.";
    if (formData.dependency_level === 0) newErr.dependency_level = "Please select your dependency level.";
    surveyQuestions.forEach(({ key }, i) => {
      if (!formData[key]) newErr[key] = `Please answer question ${i + 1}.`;
    });
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form data:", formData);
      setIsSubmitted(true);
      // TODO: gửi formData lên API nếu cần
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto mt-8 bg-white shadow-lg rounded-xl p-8 border border-green-100 text-center">
        <h1 className="text-3xl font-semibold text-green-700 mb-4">Thank You!</h1>
        <p className="text-lg text-gray-800 mb-6">Your survey has been successfully submitted.</p>
        <p className="text-md text-gray-600">Your feedback is invaluable and helps us improve!</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8 border border-green-100 ">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-6 py-12 text-black">
        <h1 className="text-4xl font-semibold text-center text-green-800 mb-10">
          SURVEY OF FREQUENCY OF USE
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Please fill out this survey to help us understand smoking patterns better. All information is confidential.
        </p>

        {/* --- Basic Information (cứng) --- */}
        <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About Your Habits
          </h2>
          <label htmlFor="smoke_duration" className="block text-lg font-medium text-gray-700 mb-2">
            How long have you been smoking? <span className="text-red-500">*</span>
          </label>
          <input
            id="smoke_duration"
            name="smoke_duration"
            placeholder="Ex: 5 years, 10 months"
            value={formData.smoke_duration}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
              errors.smoke_duration ? "border-red-500" : "border-gray-300"
            } mb-1`}
          />
          {errors.smoke_duration && <p className="text-red-500 text-sm">{errors.smoke_duration}</p>}
          <p className="text-sm text-gray-500 mb-4">e.g., "10 years", "2 years and 6 months"</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 mb-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="cigarettes_per_day" className="block text-lg font-medium text-gray-700">
                Packs per day <span className="text-red-500">*</span>
              </label>
              <input
                id="cigarettes_per_day"
                name="cigarettes_per_day"
                type="number"
                min="0"
                value={formData.cigarettes_per_day}
                onChange={handleChange}
                className={`w-24 p-1 border rounded-md text-center ${
                  errors.cigarettes_per_day ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.cigarettes_per_day && <p className="text-red-500 text-sm">{errors.cigarettes_per_day}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="price_each" className="block text-lg font-medium text-gray-700">
                Price per pack <span className="text-red-500">*</span>
              </label>
              <input
                id="price_each"
                name="price_each"
                type="number"
                min="0"
                value={formData.price_each}
                onChange={handleChange}
                className={`w-24 p-1 border rounded-md text-center ${
                  errors.price_each ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.price_each && <p className="text-red-500 text-sm">{errors.price_each}</p>}
            </div>
          </div>

          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              name="tried_to_quit"
              checked={formData.tried_to_quit}
              onChange={handleChange}
              className="accent-green-500 w-4 h-4"
            />
            Have you ever tried to quit smoking?
          </label>
        </div>

        {/* --- Health and Self-Assessment (cứng) --- */}
        <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.002 12.002 0 003 12c0 2.651 1.03 5.147 2.81 7.076L12 22l6.19-2.924C20.97 17.147 22 14.651 22 12c0-3.091-.706-6.046-2.19-8.616z" />
            </svg>
            Your Health and Intentions
          </h2>
          <select
            id="health_status"
            name="health_status"
            value={formData.health_status}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
              errors.health_status ? "border-red-500" : "border-gray-300"
            } mb-2`}
          >
            <option value="">-- Select your health status --</option>
            <option>Excellent</option>
            <option>Good</option>
            <option>Average</option>
            <option>Fair</option>
            <option>Poor</option>
          </select>
          {errors.health_status && <p className="text-red-500 text-sm">{errors.health_status}</p>}
        </div>

        {/* --- Detailed Survey Questions (động) --- */}
        <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9.207a1 1 0 011.414 0l.006.006a.998.998 0 01-.006 1.414l-2.071 2.071a.999.999 0 01-1.414-1.414l.006-.006A.998.998 0 018.228 9.207zM15 15l1.414-1.414a1 1 0 011.414 0l.006.006a.998.998 0 01-.006 1.414l-2.071 2.071a.999.999 0 01-1.414-1.414l.006-.006A.998.998 0 0115 15z" />
            </svg>
            Understanding Your Relationship with Smoking
          </h2>
          {surveyQuestions.map(({ key, question, options }, idx) => (
            <div key={key} className={`mb-6 p-4 border rounded-md ${errors[key]?'border-red-300 bg-red-50':'border-gray-200 bg-white'}`}>
              <p className="font-medium mb-3 text-gray-800">
                <span className="font-semibold text-green-700 text-lg mr-2">{idx+1}.</span> {question} <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {options.map(opt => (
                  <label key={opt} className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-green-50">
                    <input
                      type="radio"
                      name={key}
                      value={opt}
                      checked={formData[key]===opt}
                      onChange={()=>handleQuestionChange(key,opt)}
                      className="accent-green-600 w-4 h-4"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {errors[key] && <p className="text-red-500 text-sm mt-2">{errors[key]}</p>}
            </div>
          ))}
        </div>

        {/* --- Overall Dependency Level (giữ nguyên mẫu cũ) --- */}
        <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.11C6.233 14.9 8.95 14 12 14c4.97 0 9-3.582 9-8s-4.03-8-9-8-9 3.582-9 8c0 1.48.51 2.906 1.396 4.192l-.128.283a.5.5 0 00-.094.137l-2.732 6.136a.5.5 0 00.672.672l6.136-2.732a.5.5 0 00.137-.094l.283-.128A10.014 10.014 0 0012 21c4.97 0 9-3.582 9-8z" />
            </svg>
            Overall Dependency Level <span className="text-red-500">*</span>
          </h2>
          <div className={`flex items-center text-base gap-4 mb-6 px-4 py-6 bg-white rounded-xl shadow-md ${errors.dependency_level?'border-2 border-red-500':''}`}>
            <span className="text-base font-medium text-gray-700">Low</span>
            {[1,2,3,4,5].map(level=> {
              const colors = ["#A8E6CF","#DCE775","#FFF59D","#FFAB91","#EF9A9A"];
              const isSel = formData.dependency_level===level;
              return (
                <div key={level} className="flex flex-col items-center group">
                  <div
                    onClick={()=>handleDependencyClick(level)}
                    title={`Level ${level}`}
                    className={`w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300 flex items-center justify-center text-white text-lg font-bold transition-all duration-300 ${
                      isSel ? 'ring-4 ring-offset-2 ring-green-700 scale-110' : 'group-hover:scale-105 group-hover:ring-2 group-hover:ring-green-400'
                    }`}
                    style={{ backgroundColor: colors[level-1] }}
                    role="radio"
                    aria-checked={isSel}
                    tabIndex={0}
                    onKeyPress={e => { if(e.key==='Enter'||e.key===' ') handleDependencyClick(level); }}
                  >
                    {isSel && (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm mt-1 text-gray-600">{level}</span>
                </div>
              );
            })}
            <span className="text-base font-medium text-gray-700">High</span>
          </div>
          {errors.dependency_level && <p className="text-red-500 text-sm mt-1">{errors.dependency_level}</p>}
        </div>

        {/* --- Notes (cứng) --- */}
        <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
          <label htmlFor="note" className="block mb-2 text-lg font-medium text-gray-700">Notes (optional)</label>
          <textarea
            id="note"
            name="note"
            rows={4}
            value={formData.note}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* --- Summary of Your Entries (cứng) --- */}
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-3">Summary of Your Entries</h2>
          <p className="text-gray-700"><strong>Duration:</strong> {formData.smoke_duration || 'Not entered'}</p>
          <p className="text-gray-700"><strong>Packs/day:</strong> {formData.cigarettes_per_day > 0 ? formData.cigarettes_per_day : 'Not entered'}</p>
          <p className="text-gray-700"><strong>Price/pack:</strong> {formData.price_each > 0 ? formData.price_each : 'Not entered'}</p>
          <p className="text-gray-700"><strong>Tried to quit:</strong> {formData.tried_to_quit ? 'Yes' : 'No'}</p>
          <p className="text-gray-700"><strong>Health status:</strong> {formData.health_status || 'Not selected'}</p>
          <p className="text-gray-700"><strong>Dependency level:</strong> {formData.dependency_level > 0 ? formData.dependency_level : 'Not selected'}</p>
          {surveyQuestions.map((_, i) => (
            <p key={i} className="text-gray-700"><strong>Q{i+1}:</strong> {formData[`a${i+1}` as SurveyKey] || 'Not answered'}</p>
          ))}
        </div>

        {/* --- Submission --- */}
        <div className="text-center">
          <button type="submit" className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700">
            Submit Survey
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserSurveyForm;
