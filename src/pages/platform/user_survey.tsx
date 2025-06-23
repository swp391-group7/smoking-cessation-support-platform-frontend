// src/components/UserSurveyForm.tsx
import React, { useState, useEffect } from "react";
import type { SurveyDetailDTO } from "@/api/usersurveyApi";
import { getSurveyDetailById } from "@/api/usersurveyApi";

// Fixed survey ID
const FIXED_SURVEY_ID = "bff1b96e-74e9-46a3-b46e-1b625531c1ad";

type SurveyKey = "a1"|"a2"|"a3"|"a4"|"a5"|"a6"|"a7"|"a8";

interface FullSurvey {
  smoke_duration: string;
  cigarettes_per_day: number;
  price_each: number;
  tried_to_quit: boolean;
  health_status: string;
  dependency_level: number;
  note: string;
  // Store the point value for each survey answer, not the text
  a1: number | null; // Use null to indicate no answer selected yet
  a2: number | null;
  a3: number | null;
  a4: number | null;
  a5: number | null;
  a6: number | null;
  a7: number | null;
  a8: number | null;
}

type SurveyQuestion = {
  key: SurveyKey;
  question: string;
  options: { text: string; point: number }[];
};

const UserSurveyForm: React.FC = () => {
  const [formData, setFormData] = useState<FullSurvey>({
    smoke_duration: "",
    cigarettes_per_day: 0,
    price_each: 0,
    tried_to_quit: false,
    health_status: "",
    dependency_level: 0,
    note: "",
    a1:null, a2:null, a3:null, a4:null, a5:null, a6:null, a7:null, a8:null // Initialize with null
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FullSurvey,string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]>([]);

  // Fetch the first 8 questions from the API
  useEffect(() => {
    getSurveyDetailById(FIXED_SURVEY_ID)
      .then((data: SurveyDetailDTO) => {
        const first8 = data.questions.slice(0,8).map((q, idx) => ({
          key: (`a${idx+1}`) as SurveyKey,
          question: q.content,
          options: q.answers.map(ans => ({ text: ans.answerText, point: ans.point }))
        }));
        setSurveyQuestions(first8);
      })
      .catch(console.error);
  }, []);

  // Handle input changes (text, number, checkbox, select)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    const newValue = type === "checkbox"
      ? checked
      : type === "number"
        ? Number(value)
        : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Handle survey question answer selection + calculate dependency_level
  const handleQuestionChange = (key: SurveyKey, selectedPoint: number) => { // Now expects selectedPoint
    setFormData(prev => {
      // 1) Update the new answer (store point instead of text)
      const updated = { ...prev, [key]: selectedPoint };

      // 2) Calculate the total points for the 8 questions
      const total = surveyQuestions.reduce((sum, { key: k }) => {
        const choicePoint = updated[k]; // Retrieve the stored point
        return sum + (choicePoint || 0); // Use the point directly
      }, 0);

      // 3) Convert total points to a dependency level (1–5)
      let lvl = 1;
      if (total > 4)  lvl = 2;
      if (total > 8)  lvl = 3;
      if (total > 13) lvl = 4;
      if (total > 17) lvl = 5;

      // 4) Return new state including dependency_level
      return { ...updated, dependency_level: lvl };
    });
    setErrors(prev => ({ ...prev, [key]: "" }));
  };

  // Validate form before submission
  const validateForm = () => {
    const newErr: Partial<Record<keyof FullSurvey,string>> = {};
    if (!formData.smoke_duration) newErr.smoke_duration = "Please enter how long you've been smoking.";
    if (formData.cigarettes_per_day <= 0) newErr.cigarettes_per_day = "Cigarettes per day must be greater than 0.";
    if (formData.price_each <= 0)         newErr.price_each = "Price per pack must be greater than 0.";
    if (!formData.health_status)           newErr.health_status = "Please select your health status.";
    if (formData.dependency_level === 0)   newErr.dependency_level = "Please answer all 8 questions.";
    surveyQuestions.forEach(({ key }, i) => {
      if (formData[key] === null) newErr[key] = `Please answer question ${i+1}.`; // Check for null
    });
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form data:", formData);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto mt-8 bg-white shadow-lg rounded-xl p-8 border border-green-100 text-center">
        <h1 className="text-3xl font-semibold text-green-700 mb-4">Thank you!</h1>
        <p className="text-lg text-gray-800 mb-6">Your survey has been successfully submitted.</p>
        <p className="text-md text-gray-600">Your feedback is highly valuable!</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8 border border-green-100">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-6 py-12 text-black">
        {/* --- About Your Habits --- */}
        <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Your Habits
          </h2>
          <label htmlFor="smoke_duration" className="block text-lg font-medium text-gray-700 mb-2">
            How long have you been smoking? <span className="text-red-500">*</span>
          </label>
          <input
            id="smoke_duration"
            name="smoke_duration"
            placeholder="e.g., 5 years, 10 months"
            value={formData.smoke_duration}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
              errors.smoke_duration ? "border-red-500" : "border-gray-300"
            } mb-1`}
          />
          {errors.smoke_duration && <p className="text-red-500 text-sm">{errors.smoke_duration}</p>}
          <p className="text-sm text-gray-500 mb-4">Example: "10 years", "2 years 6 months"</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 mb-4">
            <div>
              <label htmlFor="cigarettes_per_day" className="block text-lg font-medium text-gray-700">
                Cigarettes per day <span className="text-red-500">*</span>
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
            <div>
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

          <label className="flex items-center gap-2">
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

        {/* --- Your Health and Intentions --- */}
        <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.002 12.002 0 003 12c0 2.651 1.03 5.147 2.81 7.076L12 22l6.19-2.924C20.97 17.147 22 14.651 22 12c0-3.091-.706-6.046-2.19-8.616z" />
            </svg>
            Health Status & Intentions
          </h2>
          <select
            id="health_status"
            name="health_status"
            value={formData.health_status}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
              errors.health_status ? "border-red-500" : "border-gray-300"
            } mb-1`}
          >
            <option value="">-- Select health status --</option>
            <option>Excellent</option>
            <option>Good</option>
            <option>Average</option>
            <option>Fair</option>
            <option>Poor</option>
          </select>
          {errors.health_status && <p className="text-red-500 text-sm">{errors.health_status}</p>}
        </div>

        {/* --- Detailed Survey Questions --- */}
        <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9.207a1 1 0 011.414 0l.006.006a.998.998 0 01-.006 1.414l-2.071 2.071a.999.999 0 01-1.414-1.414l.006-.006A.998.998 0 018.228 9.207zM15 15l1.414-1.414a1 1 0 011.414 0l.006.006a.998.998 0 01-.006 1.414l-2.071 2.071a.999.999 0 01-1.414-1.414l.006-.006A.998.998 0 0115 15z" />
            </svg>
            In-depth Smoking Habits
          </h2>
          {surveyQuestions.map(({ key, question, options }, idx) => (
            <div key={key} className={`mb-6 p-4 border rounded-md ${
                errors[key] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              }`}>
              <p className="font-medium mb-3">
                <span className="font-semibold text-green-700">{idx+1}.</span> {question} <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {options.map(({ text, point }) => (
                  <label key={text} className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-green-50">
                    <input
                      type="radio"
                      name={key}
                      value={point}
                      checked={formData[key] === point}
                      onChange={() => handleQuestionChange(key, point)}
                      className="accent-green-600"
                    />
                    <span>{text}</span>
                  </label>
                ))}
              </div>
              {errors[key] && <p className="text-red-500 mt-2">{errors[key]}</p>}
            </div>
          ))}
        </div>

        {/* --- Overall Dependency Level --- */}
        <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.11C6.233 14.9 8.95 14 12 14c4.97 0 9-3.582 9-8s-4.03-8-9-8-9 3.582-9 8c0 1.48.51 2.906 1.396 4.192l-.128.283a.5.5 0 00-.094.137l-2.732 6.136a.5.5 0 00.672.672l6.136-2.732a.5.5 0 00.137-.094l.283-.128A10.014 10.014 0 0012 21c4.97 0 9-3.582 9-8z" />
            </svg>
            Overall Dependency Level <span className="text-red-500">*</span>
          </h2>
          <div className={`flex items-center justify-between px-4 py-6 bg-white rounded-xl shadow-md ${
                errors.dependency_level ? 'border-2 border-red-500' : ''
              }`}>
            <span className="font-medium text-gray-700">Low</span>
            <div className="flex gap-4">
              {[1,2,3,4,5].map(lvl => {
                const colors = ["#A8E6CF","#DCE775","#FFF59D","#FFAB91","#EF9A9A"];
                const isSel = formData.dependency_level === lvl;
                return (
                  <div key={lvl} className="relative">
                    <div
                      title={`Level ${lvl}`}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition ${
                        isSel ? 'ring-4 ring-offset-2 ring-green-700 scale-110' : ''
                      }`}
                      style={{ backgroundColor: colors[lvl - 1] }}
                    >
                      {isSel && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="block text-center text-sm text-gray-600 mt-1">{lvl}</span>
                  </div>
                );
              })}
            </div>
            <span className="font-medium text-gray-700">High</span>
          </div>
          {errors.dependency_level && <p className="text-red-500 mt-2">{errors.dependency_level}</p>}
        </div>

        {/* --- Notes (optional) --- */}
        <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50 mb-8">
          <label htmlFor="note" className="block mb-2 text-lg font-medium text-gray-700">
            Notes (optional)
          </label>
          <textarea
            id="note"
            name="note"
            rows={4}
            value={formData.note}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* --- Summary of Your Entries --- */}
        <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Summary of Your Answers</h2>
          <p><strong>Smoking duration:</strong> {formData.smoke_duration || 'Not entered'}</p>
          <p><strong>Cigarettes per day:</strong> {formData.cigarettes_per_day > 0 ? formData.cigarettes_per_day : 'Not entered'}</p>
          <p><strong>Price per pack:</strong> {formData.price_each > 0 ? formData.price_each : 'Not entered'}</p>
          <p><strong>Tried to quit:</strong> {formData.tried_to_quit ? 'Yes' : 'No'}</p>
          <p><strong>Health status:</strong> {formData.health_status || 'Not selected'}</p>
          <p><strong>Dependency level:</strong> {formData.dependency_level > 0 ? formData.dependency_level : 'Not selected'}</p>
          {surveyQuestions.map((q, i) => (
            <p key={i}>
              <strong>Question {i+1}:</strong> {
                formData[`a${i+1}` as SurveyKey] !== null
                  ? q.options.find(opt => opt.point === formData[`a${i+1}` as SurveyKey])?.text || 'Invalid Answer'
                  : 'Not answered'
              }
            </p>
          ))}
        </div>

        {/* --- Submission --- */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition"
          >
            Submit Survey
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserSurveyForm;