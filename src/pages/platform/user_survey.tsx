// src/pages/platform/user_survey.tsx
import React, { useState, useEffect } from "react";
import type { SurveyDetailDTO, CreateSurveyRequest, GetSurveyRequest } from "@/api/usersurveyApi";
import { getSurveyDetailById, createSurvey, getSurveyByUserId } from "@/api/usersurveyApi";
import { AxiosError } from "axios"; // Import AxiosError
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useNavigate } from 'react-router-dom';
import { X } from "lucide-react";
import { getUserPlans } from "@/api/userPlanApi";
import type { UserPlan } from "@/api/userPlanApi";

// ID khảo sát cố định
const FIXED_SURVEY_ID = "bff1b96e-74e9-46a3-b46e-1b625531c1ad";

type SurveyKey = "a1" | "a2" | "a3" | "a4" | "a5" | "a6" | "a7" | "a8";




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
    a1: null, a2: null, a3: null, a4: null, a5: null, a6: null, a7: null, a8: null
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FullSurvey, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái tải mới
  const [submissionError, setSubmissionError] = useState<string | null>(null); // Trạng thái lỗi mới
  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]>([]);

  // Thêm state mới để kiểm tra survey đã tồn tại
  const [hasExistingSurvey, setHasExistingSurvey] = useState<boolean>(false);
  const [existingSurveyData, setExistingSurveyData] = useState<GetSurveyRequest | null>(null);
  const [isCheckingExistingSurvey, setIsCheckingExistingSurvey] = useState<boolean>(true);
  const [checkSurveyError, setCheckSurveyError] = useState<string | null>(null);

  // Thêm state mới để điều khiển việc hiển thị form khảo sát lại
  const [allowResurvey, setAllowResurvey] = useState<boolean>(false);

  // Kiểm tra survey đã tồn tại khi component mount
 // Thêm state để check xem có plan nào đang hoạt động không
  const [showActivePlanDialog, setShowActivePlanDialog] = useState(false);
  const [showConfirmRestart, setShowConfirmRestart] = useState(false);
  useEffect(() => {
    const checkExistingSurvey = async () => {
      try {
        setIsCheckingExistingSurvey(true);
        const existingData = await getSurveyByUserId();
        setHasExistingSurvey(true);
        setExistingSurveyData(existingData);
      } catch (error) {
        if (error instanceof AxiosError) {
          // Nếu lỗi 404 có nghĩa là chưa có survey
          if (error.response?.status === 404) {
            setHasExistingSurvey(false);
          } else {
            console.error("Lỗi khi kiểm tra survey đã tồn tại:", error);
            setCheckSurveyError("Không thể kiểm tra trạng thái survey. Vui lòng thử lại sau.");
          }
        } else {
          console.error("Lỗi không mong muốn khi kiểm tra survey:", error);
          setCheckSurveyError("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
        }
      } finally {
        setIsCheckingExistingSurvey(false);
      }
    };

    checkExistingSurvey();
  }, []);

  // Lấy 8 câu hỏi đầu từ API
  useEffect(() => {
    getSurveyDetailById(FIXED_SURVEY_ID)
      .then((data: SurveyDetailDTO) => {
        const first8 = data.questions.slice(0, 8).map((q, idx) => ({
          key: (`a${idx + 1}`) as SurveyKey,
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      if (total > 4) lvl = 2;
      if (total > 8) lvl = 3;
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
    const newErr: Partial<Record<keyof FullSurvey, string>> = {};
    if (!formData.smoke_duration) newErr.smoke_duration = "Vui lòng nhập thời gian hút thuốc.";
    if (formData.cigarettes_per_day <= 0) newErr.cigarettes_per_day = "Số điếu/ngày phải lớn hơn 0.";
    if (formData.price_each <= 0) newErr.price_each = "Giá mỗi bao phải lớn hơn 0.";
    if (!formData.health_status) newErr.health_status = "Vui lòng chọn tình trạng sức khỏe.";

    let allQuestionsAnswered = true;
    surveyQuestions.forEach(({ key }, i) => {
      if (formData[key] === null) {
        newErr[key] = `Vui lòng trả lời câu ${i + 1}.`;
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
  setSubmissionError(null);

  if (!validateForm()) {
    return;
  }

  setIsLoading(true);

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
    
    // Thay vì chỉ set isSubmitted = true, bạn cần:
    // 1. Hiển thị thông báo thành công tạm thời
    setIsSubmitted(true);
    
    // 2. Sau 3 giây, tự động chuyển sang trạng thái "existing survey"
    setTimeout(() => {
      // Cập nhật state để hiển thị như đã có existing survey
      setHasExistingSurvey(true);
      setExistingSurveyData({
        smokeDuration: payload.smokeDuration,
        cigarettesPerDay: payload.cigarettesPerDay,
        priceEach: payload.priceEach,
        triedToQuit: payload.triedToQuit,
        healthStatus: payload.healthStatus,
        dependencyLevel: payload.dependencyLevel,
        note: payload.note,
        a1: payload.a1,
        a2: payload.a2,
        a3: payload.a3,
        a4: payload.a4,
        a5: payload.a5,
        a6: payload.a6,
        a7: payload.a7,
        a8: payload.a8,
      });
      setIsSubmitted(false); // Tắt thông báo cảm ơn
    }, 1500);
    
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Lỗi khi gửi khảo sát:", error);
      setSubmissionError(error.response?.data?.message || "Không thể gửi khảo sát. Vui lòng thử lại.");
    } else {
      console.error("Một lỗi không mong muốn đã xảy ra:", error);
      setSubmissionError("Một lỗi không mong muốn đã xảy ra. Vui lòng thử lại.");
    }
  } finally {
    setIsLoading(false);
  }
};
  // Hàm để thử lại kiểm tra survey
  const handleRetryCheck = () => {
    setCheckSurveyError(null);
    setIsCheckingExistingSurvey(true);
    // Trigger useEffect để kiểm tra lại
    window.location.reload(); // Hoặc có thể tạo một function riêng để check lại
  };
  // Hàm xử lý khi người dùng xác nhận muốn khảo sát lại
  const handleConfirmResurvey = () => {
    setAllowResurvey(true);
    // Reset form data về trạng thái ban đầu
    setFormData({
      smoke_duration: "",
      cigarettes_per_day: 0,
      price_each: 0,
      tried_to_quit: false,
      health_status: "",
      dependency_level: 0,
      note: "",
      a1: null, a2: null, a3: null, a4: null, a5: null, a6: null, a7: null, a8: null
    });
    setErrors({});
    setSubmissionError(null);
    setIsSubmitted(false);
  };
  const navigate = useNavigate();
 const handleNextStep = async () => {
  try {
    const resp = await getUserPlans();
    const plansArray: UserPlan[] = Array.isArray(resp) ? resp : [resp];
    const hasActivePlan = plansArray.some((p) => p.status.toLowerCase() === "active");
    
    if (hasActivePlan) {
      setShowActivePlanDialog(true);
    } else {
      navigate('/quit_plan');
    }
  } catch (err) {
    console.error("Error checking plans", err);
    navigate('/quit_plan'); // Navigate to quit_plan if no existing plan
  }
};

const confirmRestart = () => {
  setShowActivePlanDialog(false);
  setShowConfirmRestart(true);
};

const handleRestart = () => {
  setShowConfirmRestart(false);
  navigate("/quit_plan");
};
const dialogs = (
  <>
    {/* Active plan dialog */}
    <AlertDialog
      open={showActivePlanDialog}
      onOpenChange={() => setShowActivePlanDialog(false)}
    >
      <AlertDialogContent className="bg-white text-emerald-700 border border-emerald-300 shadow-xl rounded-lg">
        <AlertDialogHeader className="relative">
          {/* Keep the close button for the first dialog */}
          <button
            onClick={() => setShowActivePlanDialog(false)}
            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <AlertDialogTitle className="text-emerald-800 text-2xl font-bold mb-2 pt-6 text-center">
            You already have an active plan!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-emerald-600 text-base leading-relaxed text-center">
            Our system detected that you already have an active quit smoking
            plan. Do you want to continue with the current plan or create a new
            one?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="pt-4 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <AlertDialogAction
            onClick={() => navigate("/quit_progress")}
            className="bg-emerald-700 text-white hover:bg-emerald-800 transition rounded-lg px-5 py-2 font-medium"
          >
            Continue Current Plan
          </AlertDialogAction>
          <AlertDialogAction
            onClick={confirmRestart}
            className="bg-white text-emerald-700 border border-emerald-600 hover:bg-emerald-50 transition rounded-lg px-5 py-2 font-medium"
          >
            Create New Plan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Confirm restart dialog */}
    <AlertDialog
      open={showConfirmRestart}
      onOpenChange={() => setShowConfirmRestart(false)}
    >
      <AlertDialogContent className="bg-white text-emerald-700 border border-emerald-300 shadow-xl rounded-lg">
        <AlertDialogHeader className="relative">
          <AlertDialogTitle className="text-emerald-800 text-2xl font-bold mb-2 text-center">
            Confirm New Plan?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-emerald-600 text-base leading-relaxed text-center">
            Creating a new plan will end the current one. Are you sure you want
            to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-4 flex justify-center space-x-3">
          <AlertDialogCancel
            onClick={() => setShowConfirmRestart(false)}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300 transition rounded-lg px-5 py-2 font-medium"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRestart}
            className="bg-red-600 text-white hover:bg-red-700 transition rounded-lg px-5 py-2 font-medium"
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
);
  // Hiển thị loading khi đang kiểm tra survey
  if (isCheckingExistingSurvey) {
    return (
      <div className="max-w-3xl mx-auto mt-8 bg-white shadow-lg rounded-xl p-8 border border-blue-100 text-center">
        <div className="flex items-center justify-center mb-4">
          <svg className="animate-spin h-8 w-8 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg font-medium text-gray-700">Đang kiểm tra trạng thái khảo sát...</span>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi khi kiểm tra survey
  if (checkSurveyError) {
    return (
      <div className="max-w-3xl mx-auto mt-8 bg-white shadow-lg rounded-xl p-8 border border-red-100 text-center">
        <h1 className="text-2xl font-semibold text-red-700 mb-4">Có lỗi xảy ra</h1>
        <p className="text-lg text-gray-800 mb-6">{checkSurveyError}</p>
        <button
          onClick={handleRetryCheck}
          className="bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-800 transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Hiển thị thông báo đã có survey (với tùy chọn khảo sát lại)
if (hasExistingSurvey && existingSurveyData && !allowResurvey) {
    return (
      <> {dialogs}
      <div className="max-w-4xl mx-auto my-12 bg-white shadow-2xl rounded-2xl p-10 border border-green-200 animate-fade-in-up">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-green-700 mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 mr-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Survey Completed!
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
            You've already completed this survey. Here's a summary of your responses:
          </p>
        </div>

        {/* Existing Survey Data Display */}
        <div className="bg-green-50 rounded-xl p-8 border border-green-300 shadow-inner">
          <h2 className="text-2xl font-bold text-green-800 mb-6 border-b-2 border-green-400 pb-3">Your Survey Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
            <div>
              <p className="mb-2"><strong className="text-green-700">Smoking Duration:</strong> {existingSurveyData.smokeDuration}</p>
              <p className="mb-2"><strong className="text-green-700">Cigarettes per Day:</strong> {existingSurveyData.cigarettesPerDay}</p>
              <p className="mb-2"><strong className="text-green-700">Price per Pack:</strong> {existingSurveyData.priceEach} VND</p>
              <p className="mb-2"><strong className="text-green-700">Tried to Quit Before:</strong> {existingSurveyData.triedToQuit ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="mb-2"><strong className="text-green-700">Health Status:</strong> {existingSurveyData.healthStatus}</p>
              <p className="mb-2"><strong className="text-green-700">Dependency Level:</strong> {existingSurveyData.dependencyLevel}/5</p>
            </div>
          </div>

          {/* Detailed Answers Display */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-green-800 mb-4 border-b border-green-300 pb-2">Detailed Answers:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-gray-700 text-base">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <p key={i} className="flex items-start">
                  <strong className="text-green-600 mr-2">Q{i}:</strong> {existingSurveyData[`a${i}` as keyof GetSurveyRequest]}
                </p>
              ))}
            </div>
          </div>

          {existingSurveyData.note && (
            <div className="mt-8 p-4 bg-green-100 rounded-lg border border-green-200">
              <p className="text-gray-800"><strong className="text-green-700">Note:</strong> {existingSurveyData.note}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-10">
          <p className="text-gray-600 text-sm mb-6 max-w-xl mx-auto">
            Thank you for participating in our survey. If you need to make any changes, please contact us or re-take the survey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleNextStep}
              className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Continue to Planning &rarr;
            </button>

            {/* Resurvey Button with AlertDialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                  Want to Retake the Survey?
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white text-green-700 border border-green-300 shadow-xl rounded-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-green-800 text-2xl font-bold mb-2">
                    Confirm Retake Survey
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-green-600 text-base leading-relaxed">
                    Are you sure you want to retake the survey? This action will create a new survey submission and may overwrite your current results.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="pt-4">
                  <AlertDialogCancel className="bg-gray-200 text-gray-700 hover:bg-gray-300 transition rounded-lg px-5 py-2 font-medium">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmResurvey}
                    className="bg-green-700 text-white hover:bg-green-800 transition rounded-lg px-5 py-2 font-medium"
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      </>
    );
  }




if (isSubmitted) {
  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white shadow-lg rounded-xl p-8 border border-green-100 text-center animate-fade-in-up">
      <div className="flex items-center justify-center mb-4">
        <svg className="w-12 h-12 text-green-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-3xl font-semibold text-green-700 mb-4">Thank you!</h1>
      <p className="text-lg text-gray-800 mb-6">Your survey has been submitted successfully.</p>
      <p className="text-md text-gray-600 mb-4">Your feedback is very valuable!</p>
      
      {/* Loading indicator */}
      <div className="flex items-center justify-center">
        <svg className="animate-spin h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm text-gray-600">Redirecting...</span>
      </div>
    </div>
  );
}

  return (
    <>  {dialogs}
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8 border border-green-100">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-6 py-12 text-black">
        {/* --- About Your Habits --- */}
        <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Your Smoking Habits
          </h2>
          <label htmlFor="smoke_duration" className="block text-lg font-medium text-gray-700 mb-2">
            How long have you been smoking? <span className="text-red-500">*</span>
          </label>
          <input
            id="smoke_duration"
            name="smoke_duration"
            placeholder="Example: 5 years, 10 months"
            value={formData.smoke_duration}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${errors.smoke_duration ? "border-red-500" : "border-gray-300"
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
                className={`w-24 p-1 border rounded-md text-center ${errors.cigarettes_per_day ? "border-red-500" : "border-gray-300"
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
                className={`w-24 p-1 border rounded-md text-center ${errors.price_each ? "border-red-500" : "border-gray-300"
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

        {/* --- Health Status & Intentions --- */}
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
            className={`w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${errors.health_status ? "border-red-500" : "border-gray-300"
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
            Understanding Your Smoking Habits
          </h2>
          {surveyQuestions.map(({ key, question, options }, idx) => (
            <div key={key} className={`mb-6 p-4 border rounded-md ${errors[key] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              }`}>
              <p className="font-medium mb-3">
                <span className="font-semibold text-green-700">{idx + 1}.</span> {question} <span className="text-red-500">*</span>
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

        {/* --- Overall Dependency Level --- */}
        <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.11C6.233 14.9 8.95 14 12 14c4.97 0 9-3.582 9-8s-4.03-8-9-8-9 3.582-9 8c0 1.48.51 2.906 1.396 4.192l-.128.283a.5.5 0 00-.094.137l-2.732 6.136a.5.5 0 00.672.672l6.136-2.732a.5.5 0 00.137-.094l.283-.128A10.014 10.014 0 0012 21c4.97 0 9-3.582 9-8z" />
            </svg>
            Overall Dependency Level <span className="text-red-500">*</span>
          </h2>
          <div className={`flex items-center justify-between px-4 py-6 bg-white rounded-xl shadow-md ${errors.dependency_level ? 'border-2 border-red-500' : ''
            }`}>
            <span className="font-medium text-gray-700">Low</span>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map(lvl => {
                const colors = ["#A8E6CF", "#DCE775", "#FFF59D", "#FFAB91", "#EF9A9A"];
                const isSel = formData.dependency_level === lvl;
                return (
                  <div key={lvl} className="relative">
                    <div
                      title={`Level ${lvl}`}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition ${isSel ? 'ring-4 ring-offset-2 ring-green-700 scale-110' : ''
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

        {/* --- Summary of your entries --- */}
        <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Summary of Your Responses</h2>
          <p><strong>Smoking duration:</strong> {formData.smoke_duration || 'Not entered'}</p>
          <p><strong>Cigarettes per day:</strong> {formData.cigarettes_per_day > 0 ? formData.cigarettes_per_day : 'Not entered'}</p>
          <p><strong>Price per pack:</strong> {formData.price_each > 0 ? formData.price_each : 'Not entered'}</p>
          <p><strong>Tried to quit:</strong> {formData.tried_to_quit ? 'Yes' : 'No'}</p>
          <p><strong>Health status:</strong> {formData.health_status || 'Not selected'}</p>
          <p><strong>Dependency level:</strong> {formData.dependency_level > 0 ? formData.dependency_level : 'Not selected'}</p>
          {surveyQuestions.map((q, i) => (
            <p key={`summary-${i}`}>
              <strong>Question {i + 1}:</strong> {
                formData[`a${i + 1}` as SurveyKey] !== null
                  ? q.options.find(opt => opt.point === formData[`a${i + 1}` as SurveyKey])?.text || 'Invalid answer'
                  : 'Not answered'
              }
            </p>
          ))}
        </div>

        {/* --- Submit --- */}
        <div className="text-center">
          {submissionError && (
            <p className="text-red-600 mb-4 text-lg font-medium">{submissionError}</p>
          )}
          <button
            type="submit"
            className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Survey'}
          </button>
        </div>
      </form>

      
    </div>
     
     </>

  );

};

export default UserSurveyForm;