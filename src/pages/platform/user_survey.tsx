import React, { useState, useEffect } from "react";
import type { SurveyDetailDTO, CreateSurveyRequest } from "@/api/usersurveyApi";
import { getSurveyDetailById, createSurvey } from "@/api/usersurveyApi";
import { AxiosError } from "axios"; // Import AxiosError

// ID khảo sát cố định
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
  // Lưu giá trị điểm cho mỗi câu trả lời khảo sát nội bộ
  a1: number | null;
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
    a1:null, a2:null, a3:null, a4:null, a5:null, a6:null, a7:null, a8:null
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FullSurvey,string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái tải mới
  const [submissionError, setSubmissionError] = useState<string | null>(null); // Trạng thái lỗi mới
  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]>([]);

  // Lấy 8 câu hỏi đầu từ API
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
      .catch(error => {
        console.error("Lỗi khi lấy câu hỏi khảo sát:", error);
        setSubmissionError("Không thể tải câu hỏi khảo sát. Vui lòng thử lại sau.");
      });
  }, []);

  // Xử lý thay đổi input (text, số, checkbox, select)
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
    setSubmissionError(null); // Xóa lỗi gửi khi input thay đổi
  };

  // Xử lý chọn đáp án câu hỏi + tính dependency_level
  const handleQuestionChange = (key: SurveyKey, selectedPoint: number) => {
    setFormData(prev => {
      // 1) Cập nhật đáp án mới (lưu điểm thay vì text)
      const updated = { ...prev, [key]: selectedPoint };

      // 2) Tính tổng điểm của 8 câu
      const total = surveyQuestions.reduce((sum, { key: k }) => {
        const choicePoint = updated[k];
        return sum + (choicePoint || 0);
      }, 0);

      // 3) Quy tổng điểm thành level (1–5)
      let lvl = 1;
      if (total > 4)  lvl = 2;
      if (total > 8)  lvl = 3;
      if (total > 13) lvl = 4;
      if (total > 17) lvl = 5;

      // 4) Trả về state mới gộp cả dependency_level
      return { ...updated, dependency_level: lvl };
    });
    setErrors(prev => ({ ...prev, [key]: "" }));
    setSubmissionError(null); // Xóa lỗi gửi khi input thay đổi
  };

  // Kiểm tra hợp lệ form trước khi submit
  const validateForm = () => {
    const newErr: Partial<Record<keyof FullSurvey,string>> = {};
    if (!formData.smoke_duration) newErr.smoke_duration = "Vui lòng nhập thời gian hút thuốc.";
    if (formData.cigarettes_per_day <= 0) newErr.cigarettes_per_day = "Số điếu/ngày phải lớn hơn 0.";
    if (formData.price_each <= 0)         newErr.price_each = "Giá mỗi bao phải lớn hơn 0.";
    if (!formData.health_status)           newErr.health_status = "Vui lòng chọn tình trạng sức khỏe.";
    
    let allQuestionsAnswered = true;
    surveyQuestions.forEach(({ key }, i) => {
      if (formData[key] === null) {
        newErr[key] = `Vui lòng trả lời câu ${i+1}.`;
        allQuestionsAnswered = false;
      }
    });

    // Chỉ đặt lỗi dependency_level nếu các câu hỏi chưa được trả lời đầy đủ
    if (formData.dependency_level === 0 && allQuestionsAnswered) {
        // Trường hợp này lý tưởng sẽ không xảy ra nếu tất cả các câu hỏi đều có điểm và được trả lời
        // Nhưng nó là một phương án dự phòng tốt
        newErr.dependency_level = "Không thể tính mức độ phụ thuộc. Vui lòng đảm bảo tất cả các câu hỏi đã được trả lời.";
    } else if (!allQuestionsAnswered) {
        newErr.dependency_level = "Vui lòng trả lời đủ 8 câu."; // Lỗi chính khi thiếu câu hỏi
    }

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null); // Xóa lỗi gửi trước đó

    if (!validateForm()) {
      return;
    }

    setIsLoading(true); // Bắt đầu tải

    try {
      // Ánh xạ formData sang payload CreateSurveyRequest
      const payload: CreateSurveyRequest = {
        smokeDuration: formData.smoke_duration,
        cigarettesPerDay: formData.cigarettes_per_day,
        priceEach: formData.price_each,
        triedToQuit: formData.tried_to_quit,
        healthStatus: formData.health_status,
        dependencyLevel: formData.dependency_level,
        note: formData.note,
        // Chuyển đổi điểm đã lưu trở lại văn bản câu trả lời cho API
        a1: surveyQuestions.find(q => q.key === "a1")?.options.find(opt => opt.point === formData.a1)?.text || "",
        a2: surveyQuestions.find(q => q.key === "a2")?.options.find(opt => opt.point === formData.a2)?.text || "",
        a3: surveyQuestions.find(q => q.key === "a3")?.options.find(opt => opt.point === formData.a3)?.text || "",
        a4: surveyQuestions.find(q => q.key === "a4")?.options.find(opt => opt.point === formData.a4)?.text || "",
        a5: surveyQuestions.find(q => q.key === "a5")?.options.find(opt => opt.point === formData.a5)?.text || "",
        a6: surveyQuestions.find(q => q.key === "a6")?.options.find(opt => opt.point === formData.a6)?.text || "",
        a7: surveyQuestions.find(q => q.key === "a7")?.options.find(opt => opt.point === formData.a7)?.text || "",
        a8: surveyQuestions.find(q => q.key === "a8")?.options.find(opt => opt.point === formData.a8)?.text || "",
      };

      await createSurvey(payload);
      setIsSubmitted(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Lỗi khi gửi khảo sát:", error);
        setSubmissionError(error.response?.data?.message || "Không thể gửi khảo sát. Vui lòng thử lại.");
      } else {
        console.error("Một lỗi không mong muốn đã xảy ra:", error);
        setSubmissionError("Một lỗi không mong muốn đã xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false); // Kết thúc tải
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto mt-8 bg-white shadow-lg rounded-xl p-8 border border-green-100 text-center">
        <h1 className="text-3xl font-semibold text-green-700 mb-4">Cảm ơn bạn!</h1>
        <p className="text-lg text-gray-800 mb-6">Khảo sát của bạn đã được gửi thành công.</p>
        <p className="text-md text-gray-600">Phản hồi của bạn rất có giá trị!</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8 border border-green-100">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-6 py-12 text-black">
        {/* --- Về Thói Quen của Bạn --- */}
        <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Thói Quen của Bạn
          </h2>
          <label htmlFor="smoke_duration" className="block text-lg font-medium text-gray-700 mb-2">
            Bạn đã hút thuốc bao lâu? <span className="text-red-500">*</span>
          </label>
          <input
            id="smoke_duration"
            name="smoke_duration"
            placeholder="Ví dụ: 5 năm, 10 tháng"
            value={formData.smoke_duration}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
              errors.smoke_duration ? "border-red-500" : "border-gray-300"
            } mb-1`}
          />
          {errors.smoke_duration && <p className="text-red-500 text-sm">{errors.smoke_duration}</p>}
          <p className="text-sm text-gray-500 mb-4">Ví dụ: "10 năm", "2 năm 6 tháng"</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 mb-4">
            <div>
              <label htmlFor="cigarettes_per_day" className="block text-lg font-medium text-gray-700">
                Số điếu/ngày <span className="text-red-500">*</span>
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
                Giá mỗi bao <span className="text-red-500">*</span>
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
            Bạn đã từng cố gắng bỏ thuốc chưa?
          </label>
        </div>

        {/* --- Tình Trạng Sức Khỏe & Ý Định của Bạn --- */}
        <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.002 12.002 0 003 12c0 2.651 1.03 5.147 2.81 7.076L12 22l6.19-2.924C20.97 17.147 22 14.651 22 12c0-3.091-.706-6.046-2.19-8.616z" />
            </svg>
            Tình Trạng Sức Khỏe & Ý Định
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
            <option value="">-- Chọn tình trạng sức khỏe --</option>
            <option>Xuất sắc</option>
            <option>Tốt</option>
            <option>Trung bình</option>
            <option>Khá</option>
            <option>Kém</option>
          </select>
          {errors.health_status && <p className="text-red-500 text-sm">{errors.health_status}</p>}
        </div>

        {/* --- Câu Hỏi Khảo Sát Chi Tiết --- */}
        <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9.207a1 1 0 011.414 0l.006.006a.998.998 0 01-.006 1.414l-2.071 2.071a.999.999 0 01-1.414-1.414l.006-.006A.998.998 0 018.228 9.207zM15 15l1.414-1.414a1 1 0 011.414 0l.006.006a.998.998 0 01-.006 1.414l-2.071 2.071a.999.999 0 01-1.414-1.414l.006-.006A.998.998 0 0115 15z" />
            </svg>
            Hiểu sâu về thói quen hút thuốc
          </h2>
          {surveyQuestions.map(({ key, question, options }, idx) => (
            <div key={key} className={`mb-6 p-4 border rounded-md ${
                errors[key] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              }`}>
              <p className="font-medium mb-3">
                <span className="font-semibold text-green-700">{idx+1}.</span> {question} <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {options.map(({ text, point }, optionIndex) => (
                  <label key={`${key}-${point}-${optionIndex}`} className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-green-50">
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

        {/* --- Mức Độ Phụ Thuộc Chung --- */}
        <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.11C6.233 14.9 8.95 14 12 14c4.97 0 9-3.582 9-8s-4.03-8-9-8-9 3.582-9 8c0 1.48.51 2.906 1.396 4.192l-.128.283a.5.5 0 00-.094.137l-2.732 6.136a.5.5 0 00.672.672l6.136-2.732a.5.5 0 00.137-.094l.283-.128A10.014 10.014 0 0012 21c4.97 0 9-3.582 9-8z" />
            </svg>
            Mức Độ Phụ Thuộc Chung <span className="text-red-500">*</span>
          </h2>
          <div className={`flex items-center justify-between px-4 py-6 bg-white rounded-xl shadow-md ${
                errors.dependency_level ? 'border-2 border-red-500' : ''
              }`}>
            <span className="font-medium text-gray-700">Thấp</span>
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
            <span className="font-medium text-gray-700">Cao</span>
          </div>
          {errors.dependency_level && <p className="text-red-500 mt-2">{errors.dependency_level}</p>}
        </div>

        {/* --- Ghi chú (tùy chọn) --- */}
        <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50 mb-8">
          <label htmlFor="note" className="block mb-2 text-lg font-medium text-gray-700">
            Ghi chú (tùy chọn)
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

        {/* --- Tóm tắt các mục nhập của bạn --- */}
        <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Tóm tắt câu trả lời của bạn</h2>
          <p><strong>Thời gian hút:</strong> {formData.smoke_duration || 'Chưa nhập'}</p>
          <p><strong>Điếu/ngày:</strong> {formData.cigarettes_per_day > 0 ? formData.cigarettes_per_day : 'Chưa nhập'}</p>
          <p><strong>Giá/bao:</strong> {formData.price_each > 0 ? formData.price_each : 'Chưa nhập'}</p>
          <p><strong>Từng cố bỏ:</strong> {formData.tried_to_quit ? 'Có' : 'Không'}</p>
          <p><strong>Tình trạng sức khỏe:</strong> {formData.health_status || 'Chưa chọn'}</p>
          <p><strong>Mức độ phụ thuộc:</strong> {formData.dependency_level > 0 ? formData.dependency_level : 'Chưa chọn'}</p>
          {surveyQuestions.map((q, i) => (
            <p key={`summary-${i}`}>
              <strong>Câu {i+1}:</strong> {
                formData[`a${i+1}` as SurveyKey] !== null
                  ? q.options.find(opt => opt.point === formData[`a${i+1}` as SurveyKey])?.text || 'Câu trả lời không hợp lệ'
                  : 'Chưa trả lời'
              }
            </p>
          ))}
        </div>

        {/* --- Gửi --- */}
        <div className="text-center">
          {submissionError && (
            <p className="text-red-600 mb-4 text-lg font-medium">{submissionError}</p>
          )}
          <button
            type="submit"
            className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Đang gửi...' : 'Gửi khảo sát'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserSurveyForm;