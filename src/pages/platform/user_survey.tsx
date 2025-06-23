import React, { useState } from "react";
import type { UserSurvey } from "@/api/usersurvey";

// Define the 8 survey answer keys
type SurveyKey = 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6' | 'a7' | 'a8';

const surveyQuestions: { key: SurveyKey; question: string; options: string[] }[] = [
  { key: 'a1', question: 'How often do you think about smoking?', options: ['Never', 'Rarely', 'Sometimes', 'Often'] },
  { key: 'a2', question: 'Do you smoke more in the morning than any other time of day?', options: ['Yes', 'No'] },
  { key: 'a3', question: 'How soon after waking do you smoke your first cigarette?', options: ['Within 5 minutes', '6-30 minutes', '31-60 minutes', 'After 60 minutes'] },
  { key: 'a4', question: 'Do you find it difficult to refrain from smoking in places where it is forbidden (e.g., in church, at the library, in a movie theater)?', options: ['Yes', 'No'] },
  { key: 'a5', question: 'How many cigarettes do you smoke per day?', options: ['10 or less', '11-20', '21-30', '31 or more'] },
  { key: 'a6', question: 'Do you smoke when you are ill in bed most of the day?', options: ['Yes', 'No'] },
  { key: 'a7', question: 'Do you get nervous or anxious when you cannot smoke?', options: ['Not at all', 'Slightly', 'Moderately', 'Very Much'] },
  { key: 'a8', question: 'Do you find yourself lighting up automatically without thinking about it?', options: ['Often', 'Sometimes', 'Rarely', 'Never'] },
];

// Extend UserSurvey to include those a1..a8 fields
type FullSurvey = UserSurvey & Record<SurveyKey, string>;

const UserSurveyForm: React.FC = () => {
  const [formData, setFormData] = useState<FullSurvey>({
    user_id: "", // Consider generating this or getting it from context if user is logged in
    smoke_duration: "",
    cigarettes_per_day: 0,
    price_each: 0,
    tried_to_quit: false,
    health_status: "",
    reasons_cant_quit: "", // This field isn't in your form, but is in UserSurvey type. Consider adding it or removing from type if not needed.
    dependency_level: 0,
    note: "",
    a1: '', a2: '', a3: '', a4: '', a5: '', a6: '', a7: '', a8: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FullSurvey, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // For multi-step form

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, type, value } = target;
    let newValue: string | number | boolean = value;

    if (type === 'checkbox' && target instanceof HTMLInputElement) {
      newValue = target.checked;
    } else if (type === 'number') {
      newValue = Number(value);
    }
    setFormData(prev => ({ ...prev, [name]: newValue }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const handleQuestionChange = (key: SurveyKey, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' })); // Clear error on change
  };

  const handleDependencyClick = (level: number) => {
    setFormData(prev => ({ ...prev, dependency_level: level }));
    setErrors(prev => ({ ...prev, dependency_level: '' })); // Clear error on change
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FullSurvey, string>> = {};
    if (!formData.smoke_duration) newErrors.smoke_duration = 'Please enter your smoking duration.';
    if (formData.cigarettes_per_day <= 0) newErrors.cigarettes_per_day = 'Packs per day must be a positive number.';
    if (formData.price_each <= 0) newErrors.price_each = 'Price per pack must be a positive number.';
    if (!formData.health_status) newErrors.health_status = 'Please select your health status.';
    if (formData.dependency_level === 0) newErrors.dependency_level = 'Please select your dependency level.';

    surveyQuestions.forEach(({ key }) => {
      if (!formData[key]) newErrors[key] = `Please answer question ${key.slice(1)}.`;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form Submitted Successfully:', formData);
      setIsSubmitted(true);
      // Here you would typically send formData to an API
      // For example: await sendSurveyData(formData);
    } else {
      console.log('Form has errors. Please correct them.');
      // Scroll to the first error or highlight them
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.getElementsByName(firstErrorField)?.[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Optional: Multi-step form logic (uncomment and adjust as needed)
  /*
  const totalQuestions = surveyQuestions.length;
  const handleNext = () => {
    // Add validation for current step before moving
    setCurrentQuestionIndex(prev => Math.min(prev + 1, totalQuestions));
  };
  const handlePrev = () => {
    setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
  };
  */

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto mt-8 bg-white shadow-lg rounded-xl p-8 border border-green-100 text-center text-black">
        <h1 className="text-3xl font-semibold text-green-700 mb-4">Thank You!</h1>
        <p className="text-lg text-gray-800 mb-6">Your survey has been successfully submitted.</p>
        <p className="text-md text-gray-600">Your feedback is invaluable and helps us improve!</p>
        {/* Optional: A button to go back to home or start a new survey */}
        {/* <button className="bg-emerald-600 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 mt-6">
          Go to Home
        </button> */}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white shadow-lg rounded-xl p-6 border border-green-100">
      <form onSubmit={handleSubmit} className="px-4 py-8 text-black">
        <h1 className="text-3xl font-semibold text-center text-green-800 mb-8">
          Survey on Smoking Habits
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Please fill out this survey to help us understand smoking patterns better. All information is confidential.
        </p>

        {/* Form Sections with Clear Headings */}
        <div className="space-y-6">
          {/* --- Basic Information --- */}
          <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
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
              className={`w-full p-2 text-base border rounded-md focus:ring-green-500 focus:border-green-500 ${errors.smoke_duration ? 'border-red-500' : 'border-gray-300'} mb-1`}
              aria-describedby="smoke-duration-error"
            />
            {errors.smoke_duration && <p id="smoke-duration-error" className="text-red-500 text-sm mt-1">{errors.smoke_duration}</p>}
            <p className="text-sm text-gray-500 mb-4">e.g., "10 years", "2 years and 6 months"</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 mb-4">
              <div className="flex flex-col text-base gap-2">
                <label htmlFor="cigarettes_per_day" className="min-w-[140px] md:min-w-[120px] text-lg font-medium text-gray-700">Packs per day <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-2">
                  <input
                    id="cigarettes_per_day"
                    name="cigarettes_per_day"
                    type="number"
                    min="0" // Prevent negative input
                    value={formData.cigarettes_per_day}
                    onChange={handleChange}
                    className={`w-24 p-1 border rounded-md text-center text-base ${errors.cigarettes_per_day ? 'border-red-500' : 'border-gray-300'}`}
                    aria-describedby="cigarettes-per-day-error"
                  />
                  <span>packs/day</span>
                </div>
                {errors.cigarettes_per_day && <p id="cigarettes-per-day-error" className="text-red-500 text-sm mt-1">{errors.cigarettes_per_day}</p>}
              </div>

              <div className="flex flex-col text-base gap-2">
                <label htmlFor="price_each" className="min-w-[50px] md:min-w-[40px] text-lg font-medium text-gray-700">Price per pack <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-2">
                  <input
                    id="price_each"
                    name="price_each"
                    type="number"
                    min="0" // Prevent negative input
                    value={formData.price_each}
                    onChange={handleChange}
                    className={`w-24 p-1 border rounded-md text-center text-base ${errors.price_each ? 'border-red-500' : 'border-gray-300'}`}
                    aria-describedby="price-each-error"
                  />
                  <span>(currency, e.g., VND)</span>
                </div>
                {errors.price_each && <p id="price-each-error" className="text-red-500 text-sm mt-1">{errors.price_each}</p>}
              </div>
            </div>

            <label htmlFor="tried_to_quit" className="flex items-center text-base gap-2 mb-4 cursor-pointer">
              <input
                id="tried_to_quit"
                type="checkbox"
                name="tried_to_quit"
                checked={formData.tried_to_quit}
                onChange={handleChange}
                className="accent-green-500 w-4 h-4"
              />
              <span className="text-lg font-medium text-gray-700">Have you ever tried to quit smoking?</span>
            </label>
          </div>

          {/* --- Health and Self-Assessment --- */}
          <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.002 12.002 0 003 12c0 2.651 1.03 5.147 2.81 7.076L12 22l6.19-2.924C20.97 17.147 22 14.651 22 12c0-3.091-.706-6.046-2.19-8.616z"></path></svg>
              Your Health and Intentions
            </h2>

            <label htmlFor="health_status" className="block text-lg font-medium text-gray-700 mb-2">
              What is your current health status? <span className="text-red-500">*</span>
            </label>
            <select
              id="health_status"
              name="health_status"
              value={formData.health_status}
              onChange={handleChange}
              className={`w-full p-2 text-base border rounded-md focus:ring-green-500 focus:border-green-500 ${errors.health_status ? 'border-red-500' : 'border-gray-300'} mb-2`}
              aria-describedby="health-status-error"
            >
              <option value="">-- Select your health status --</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
            {errors.health_status && <p id="health-status-error" className="text-red-500 text-sm mt-1">{errors.health_status}</p>}
          </div>

          {/* --- Detailed Survey Questions --- */}
          <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9.207a1 1 0 011.414 0l.006.006a.998.998 0 01-.006 1.414l-2.071 2.071a.999.999 0 01-1.414-1.414l.006-.006A.998.998 0 018.228 9.207zM15 15l1.414-1.414a1 1 0 011.414 0l.006.006a.998.998 0 01-.006 1.414l-2.071 2.071a.999.999 0 01-1.414-1.414l.006-.006A.998.998 0 0115 15z"></path></svg>
              Understanding Your Relationship with Smoking
            </h2>
            {surveyQuestions.map(({ key, question, options }, index) => (
              <div key={key} className={`mb-6 p-4 border rounded-md ${errors[key] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}>
                <p className="font-medium mb-3 text-gray-800">
                  <span className="font-semibold text-green-700 text-lg mr-2">{index + 1}.</span> {question} <span className="text-red-500">*</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {options.map(opt => (
                    <label key={opt} className="flex items-center text-base space-x-2 cursor-pointer p-2 rounded-md hover:bg-green-50 transition-colors duration-200">
                      <input
                        type="radio"
                        name={key}
                        value={opt}
                        checked={formData[key] === opt}
                        onChange={() => handleQuestionChange(key, opt)}
                        className="accent-green-600 w-4 h-4 cursor-pointer"
                        aria-label={`Option ${opt} for question ${index + 1}`}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                {errors[key] && <p className="text-red-500 text-sm mt-2">{errors[key]}</p>}
              </div>
            ))}
          </div>

          {/* --- Dependency Level --- */}
          <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.11C6.233 14.9 8.95 14 12 14c4.97 0 9-3.582 9-8s-4.03-8-9-8-9 3.582-9 8c0 1.48.51 2.906 1.396 4.192l-.128.283a.5.5 0 00-.094.137l-2.732 6.136a.5.5 0 00.672.672l6.136-2.732a.5.5 0 00.137-.094l.283-.128A10.014 10.014 0 0012 21c4.97 0 9-3.582 9-8z"></path></svg>
              Overall Dependency Level <span className="text-red-500">*</span>
            </h2>
            <div className={`flex items-center text-base gap-4 mb-6 px-4 py-6 bg-white rounded-xl shadow-md ${errors.dependency_level ? 'border-2 border-red-500' : ''}`}>
              <span className="text-base font-medium text-gray-700">Low</span>
              {[1, 2, 3, 4, 5].map(level => {
                const colors = ["#A8E6CF", "#DCE775", "#FFF59D", "#FFAB91", "#EF9A9A"]; // Adjusted colors for better contrast
                const isSel = formData.dependency_level === level;
                return (
                  <div key={level} className="flex flex-col items-center group">
                    <div
                      onClick={() => handleDependencyClick(level)}
                      title={`Level ${level}`}
                      className={`w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300 transition-all duration-300 flex items-center justify-center text-white text-lg font-bold
                                  ${isSel ? 'ring-4 ring-offset-2 ring-green-700 scale-110' : 'group-hover:scale-105 group-hover:ring-2 group-hover:ring-green-400'}`}
                      style={{ backgroundColor: colors[level - 1] }}
                      aria-label={`Dependency level ${level}`}
                      role="radio"
                      aria-checked={isSel}
                      tabIndex={0} // Make div focusable
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleDependencyClick(level);
                        }
                      }}
                    >
                      {isSel && (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
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

          {/* --- Optional Notes --- */}
          <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
            <label htmlFor="note" className="block text-lg font-medium text-gray-700 mb-2">Notes (optional)</label>
            <textarea
              id="note"
              name="note"
              placeholder="Any additional thoughts or comments you'd like to share?"
              value={formData.note}
              onChange={handleChange}
              rows={4} // Increased rows for better usability
              className="w-full p-2 text-base border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 mb-6"
            />
          </div>

          {/* --- Summary (Optional, can be hidden) --- */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h2 className="text-xl font-semibold text-green-800 mb-3">Summary of Your Entries</h2>
            <p className="text-gray-700"><strong>Duration:</strong> {formData.smoke_duration || 'Not entered'}</p>
            <p className="text-gray-700"><strong>Packs/day:</strong> {formData.cigarettes_per_day > 0 ? formData.cigarettes_per_day : 'Not entered'}</p>
            <p className="text-gray-700"><strong>Price/pack:</strong> {formData.price_each > 0 ? formData.price_each : 'Not entered'}</p>
            <p className="text-gray-700"><strong>Tried to quit:</strong> {formData.tried_to_quit ? 'Yes' : 'No'}</p>
            <p className="text-gray-700"><strong>Health status:</strong> {formData.health_status || 'Not selected'}</p>
            <p className="text-gray-700"><strong>Dependency level:</strong> {formData.dependency_level > 0 ? formData.dependency_level : 'Not selected'}</p>
            {/* Display selected answers for survey questions in summary */}
            {surveyQuestions.map(({ key, question }) => (
              <p key={key} className="text-gray-700">
                <strong>Q{key.slice(1)}:</strong> {formData[key] || 'Not answered'}
              </p>
            ))}
          </div>
        </div>

        {/* --- Submission Area --- */}
        <div className="text-center mt-8">
          <p className="text-base text-gray-700 mb-4">
            Thank you for taking the time to complete this survey. Your feedback is highly appreciated!
          </p>
          <button
            type="submit"
            className="bg-emerald-600 text-base text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            Submit Survey
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserSurveyForm;