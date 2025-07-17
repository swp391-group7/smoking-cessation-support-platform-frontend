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
import { hasActiveMembership } from '@/api/membershipApi';
// Fixed survey ID
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
  // Store point values for each internal survey answer
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
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const [submissionError, setSubmissionError] = useState<string | null>(null); // New error state
  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]>([]);

  // Add new state to check if survey already exists
  const [hasExistingSurvey, setHasExistingSurvey] = useState<boolean>(false);
  const [existingSurveyData, setExistingSurveyData] = useState<GetSurveyRequest | null>(null);
  const [isCheckingExistingSurvey, setIsCheckingExistingSurvey] = useState<boolean>(true);
  const [checkSurveyError, setCheckSurveyError] = useState<string | null>(null);

  // Add new state to control whether to allow re-survey form display
  const [allowResurvey, setAllowResurvey] = useState<boolean>(false);

  // Check for existing survey on component mount
  // Add state to check if there is an active plan
  const [showActivePlanDialog, setShowActivePlanDialog] = useState(false);
  const [showConfirmRestart, setShowConfirmRestart] = useState(false);
  const [showGenerateDraftPlanDialog, setShowGenerateDraftPlanDialog] = useState(false); // New state for draft plan dialog

  const [showMembershipDialog, setShowMembershipDialog] = useState(false);

  useEffect(() => {
    const checkExistingSurvey = async () => {
      try {
        setIsCheckingExistingSurvey(true);
        const existingData = await getSurveyByUserId();
        setHasExistingSurvey(true);
        setExistingSurveyData(existingData);
      } catch (error) {
        if (error instanceof AxiosError) {
          // If 404 error, it means no survey exists yet
          if (error.response?.status === 404) {
            setHasExistingSurvey(false);
          } else {
            console.error("Error checking existing survey:", error);
            setCheckSurveyError("Could not check survey status. Please try again later.");
          }
        } else {
          console.error("Unexpected error checking survey:", error);
          setCheckSurveyError("An error occurred. Please try again later.");
        }
      } finally {
        setIsCheckingExistingSurvey(false);
      }
    };

    checkExistingSurvey();
  }, []);

  // Fetch first 8 questions from API
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
        console.error("Error fetching survey questions:", error);
        setSubmissionError("Could not load survey questions. Please try again later.");
      });
  }, []);

  // Handle input changes (text, number, checkbox, select)
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
    setSubmissionError(null); // Clear submission error on input change
  };

  // Handle question answer selection + calculate dependency_level
  const handleQuestionChange = (key: SurveyKey, selectedPoint: number) => {
    setFormData(prev => {
      // 1) Update the new answer (store points instead of text)
      const updated = { ...prev, [key]: selectedPoint };

      // 2) Calculate total points of 8 questions
      const total = surveyQuestions.reduce((sum, { key: k }) => {
        const choicePoint = updated[k];
        return sum + (choicePoint || 0);
      }, 0);

      // 3) Convert total points to level (1–5)
      let lvl = 1;
      if (total > 4) lvl = 2;
      if (total > 8) lvl = 3;
      if (total > 13) lvl = 4;
      if (total > 17) lvl = 5;

      // 4) Return new state including dependency_level
      return { ...updated, dependency_level: lvl };
    });
    setErrors(prev => ({ ...prev, [key]: "" }));
    setSubmissionError(null); // Clear submission error on input change
  };

  // Validate form before submission
  const validateForm = () => {
    const newErr: Partial<Record<keyof FullSurvey, string>> = {};
    if (!formData.smoke_duration) newErr.smoke_duration = "Please enter smoking duration.";
    if (formData.cigarettes_per_day <= 0) newErr.cigarettes_per_day = "Cigarettes per day must be greater than 0.";
    if (formData.price_each <= 0) newErr.price_each = "Price per pack must be greater than 0.";
    if (!formData.health_status) newErr.health_status = "Please select health status.";

    let allQuestionsAnswered = true;
    surveyQuestions.forEach(({ key }, i) => {
      if (formData[key] === null) {
        newErr[key] = `Please answer question ${i + 1}.`;
        allQuestionsAnswered = false;
      }
    });

    // Only set dependency_level error if questions are not fully answered
    if (formData.dependency_level === 0 && allQuestionsAnswered) {
      // This case ideally won't happen if all questions have points and are answered
      // But it's a good fallback
      newErr.dependency_level = "Could not calculate dependency level. Please ensure all questions are answered.";
    } else if (!allQuestionsAnswered) {
      newErr.dependency_level = "Please answer all 8 questions."; // Primary error when questions are missing
    }

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

// Updated handleSubmit with active membership check
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmissionError(null);

  if (!validateForm()) {
    return;
  }

  setIsLoading(true);

  try {
    // 1) Map formData to payload
    const payload: CreateSurveyRequest = {
      smokeDuration: formData.smoke_duration,
      cigarettesPerDay: formData.cigarettes_per_day,
      priceEach: formData.price_each,
      triedToQuit: formData.tried_to_quit,
      healthStatus: formData.health_status,
      dependencyLevel: formData.dependency_level,
      note: formData.note,
      a1: surveyQuestions.find(q => q.key === "a1")?.options.find(o => o.point === formData.a1)?.text || "",
      a2: surveyQuestions.find(q => q.key === "a2")?.options.find(o => o.point === formData.a2)?.text || "",
      a3: surveyQuestions.find(q => q.key === "a3")?.options.find(o => o.point === formData.a3)?.text || "",
      a4: surveyQuestions.find(q => q.key === "a4")?.options.find(o => o.point === formData.a4)?.text || "",
      a5: surveyQuestions.find(q => q.key === "a5")?.options.find(o => o.point === formData.a5)?.text || "",
      a6: surveyQuestions.find(q => q.key === "a6")?.options.find(o => o.point === formData.a6)?.text || "",
      a7: surveyQuestions.find(q => q.key === "a7")?.options.find(o => o.point === formData.a7)?.text || "",
      a8: surveyQuestions.find(q => q.key === "a8")?.options.find(o => o.point === formData.a8)?.text || "",
    };

    // 2) Submit survey
    await createSurvey(payload);

    // 3) Show temporary thank-you state
    setIsSubmitted(true);

    // 4) After thank-you, set existing survey state
    setTimeout(() => {
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
      setAllowResurvey(false);
      setIsSubmitted(false);
    }, 1500);

    // 5) Check active membership and show dialog or navigate
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      throw new Error('User ID not found in localStorage');
    }

    const hasMembership = await hasActiveMembership(storedUserId);
    if (hasMembership) {
      setShowMembershipDialog(true);
    } else {
      navigate('/plan-gen');
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error submitting survey:", error);
      setSubmissionError(error.response?.data?.message || "Failed to submit survey. Please try again.");
    } else {
      console.error("Unexpected error:", error);
      setSubmissionError("An unexpected error occurred. Please try again.");
    }
  } finally {
    setIsLoading(false);
  }
};
  // Function to retry survey check
  const handleRetryCheck = () => {
    setCheckSurveyError(null);
    setIsCheckingExistingSurvey(true);
    // Trigger useEffect to re-check
    window.location.reload(); // Or you can create a separate function to re-check
  };
  // Function to handle user confirming re-survey
  const handleConfirmResurvey = () => {
    setAllowResurvey(true);
    // Reset form data to initial state
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

  // handleNextStep is now for "Generate draft plan"
  const handleGenerateDraftPlan = async () => {
    try {
      const resp = await getUserPlans();
      const plansArray: UserPlan[] = Array.isArray(resp) ? resp : [resp];
      const hasActivePlan = plansArray.some((p) => p.status.toLowerCase() === "active");

      if (hasActivePlan) {
        setShowGenerateDraftPlanDialog(true); // Show the new dialog for draft plan
      } else {
        navigate('/plan-gen'); // No active plan, navigate directly
      }
    } catch (err) {
      console.error("Error checking plans for draft generation:", err);
      navigate('/plan-gen'); // Fallback navigation on error
    }
  };

  // handleNextStep1 is for "Continue to Planning"
  const handleNextStep1 = async () => {
    try {
      const resp = await getUserPlans();
      const plansArray: UserPlan[] = Array.isArray(resp) ? resp : [resp];
      const hasActivePlan = plansArray.some((p) => p.status.toLowerCase() === "active");

      if (hasActivePlan) {
        setShowActivePlanDialog(true); // Show the existing active plan dialog
      } else {
        navigate('/plan-gen'); // Navigate to plan-gen if no existing plan
      }
    } catch (err) {
      console.error("Error checking plans", err);
      navigate('/plan-gen'); // Navigate to plan-gen if no existing plan
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

const handleConfirmGenerateDraftPlan = () => {
  setShowGenerateDraftPlanDialog(false); // Close the dialog
  navigate('/plan-gen'); // Navigate to plan-gen
};

const dialogs = (
  <>
    {/* Active plan dialog (for "Continue to Planning" button) */}
    <AlertDialog
      open={showActivePlanDialog}
      onOpenChange={() => setShowActivePlanDialog(false)}
    >
      <AlertDialogContent className="bg-white text-green-800 border border-green-300 shadow-xl rounded-lg max-w-md mx-auto p-6">
        <AlertDialogHeader className="relative text-center">
          {/* Keep the close button for the first dialog */}
          <button
            onClick={() => setShowActivePlanDialog(false)}
            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <AlertDialogTitle className="text-green-800 text-2xl font-bold mb-2 pt-6 flex items-center justify-center">
            <svg className="w-8 h-8 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Active Plan Detected!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700 text-base leading-relaxed">
            Our system detected that you already have an active quit smoking
            plan. Do you want to continue with your current plan or create a new
            one?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="pt-4 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <AlertDialogAction
            onClick={() => navigate("/quit_progress")}
            className="bg-green-700 text-white hover:bg-green-800 transition rounded-lg px-5 py-2 font-medium"
          >
            Continue Current Plan
          </AlertDialogAction>
          <AlertDialogAction
            onClick={confirmRestart}
            className="bg-white text-green-700 border border-green-600 hover:bg-green-50 transition rounded-lg px-5 py-2 font-medium"
          >
            Create New Plan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Confirm restart dialog (triggered by "Create New Plan" from Active Plan dialog) */}
    <AlertDialog
      open={showConfirmRestart}
      onOpenChange={() => setShowConfirmRestart(false)}
    >
      <AlertDialogContent className="bg-white text-green-800 border border-green-300 shadow-xl rounded-lg max-w-md mx-auto p-6">
        <AlertDialogHeader className="relative text-center">
          <AlertDialogTitle className="text-green-800 text-2xl font-bold mb-2 flex items-center justify-center">
            <svg className="w-8 h-8 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Confirm New Plan?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700 text-base leading-relaxed">
            Creating a new plan will end your current active plan. Are you sure you want
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

    {/* New: Draft Plan Generation Confirmation Dialog */}
    <AlertDialog
      open={showGenerateDraftPlanDialog}
      onOpenChange={() => setShowGenerateDraftPlanDialog(false)}
    >
      <AlertDialogContent className="bg-white text-green-800 border border-green-300 shadow-xl rounded-lg max-w-md mx-auto p-6">
        <AlertDialogHeader className="relative text-center">
          <button
            onClick={() => setShowGenerateDraftPlanDialog(false)}
            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <AlertDialogTitle className="text-green-800 text-2xl font-bold mb-2 pt-6 flex items-center justify-center">
            <svg className="w-8 h-8 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Confirm Draft Plan Generation
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700 text-base leading-relaxed">
            You currently have an active quit plan. Generating a new draft plan will not affect your active plan, but you will be working on a separate draft. Do you wish to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-4 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <AlertDialogCancel
            onClick={() => setShowGenerateDraftPlanDialog(false)}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300 transition rounded-lg px-5 py-2 font-medium"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmGenerateDraftPlan}
            className="bg-green-700 text-white hover:bg-green-800 transition rounded-lg px-5 py-2 font-medium"
          >
            Proceed to Generator
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <AlertDialog open={showMembershipDialog} onOpenChange={setShowMembershipDialog}>
      <AlertDialogContent className="bg-white text-gray-800 rounded-lg shadow-xl p-6 max-w-sm mx-auto">
        <AlertDialogHeader className="mb-6">
          <AlertDialogTitle className="text-2xl font-extrabold text-green-700">
            You have a draft quit plan!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 mt-2 text-base">
            Based on the survey you just completed, we detected you already have a draft quit plan. Would you like to go to the Quit Plan Generator now?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row-reverse justify-end gap-3 mt-4">
          <AlertDialogAction
            onClick={() => navigate('/plan-gen')}
            className="w-full sm:w-auto bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition ease-in-out duration-150"
          >
            Go to Quit Generator
          </AlertDialogAction>
          <AlertDialogCancel
            onClick={() => setShowMembershipDialog(false)}
            className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50 transition ease-in-out duration-150"
          >
            Stay Here
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>


  </>
);
  // Display loading when checking survey
  if (isCheckingExistingSurvey) {
    return (
      <div className="max-w-3xl mx-auto mt-8 bg-white shadow-lg rounded-xl p-8 border border-blue-100 text-center">
        <div className="flex items-center justify-center mb-4">
          <svg className="animate-spin h-8 w-8 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg font-medium text-gray-700">Checking survey status...</span>
        </div>
      </div>
    );
  }

  // Display error when checking survey
  if (checkSurveyError) {
    return (
      <div className="max-w-3xl mx-auto mt-8 bg-white shadow-lg rounded-xl p-8 border border-red-100 text-center">
        <h1 className="text-2xl font-semibold text-red-700 mb-4">An Error Occurred</h1>
        <p className="text-lg text-gray-800 mb-6">{checkSurveyError}</p>
        <button
          onClick={handleRetryCheck}
          className="bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-800 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // Display survey completed message (with re-survey option)
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
              onClick={handleNextStep1}
              className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Continue to Planning &rarr;
            </button>
            <button
              onClick={handleGenerateDraftPlan} 
              className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Generate draft plan &rarr;
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
        <svg className="animate-spin h-5 w-5 mr-3 text-green-600" fill="none" viewBox="0 0 24 24">
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
            Understanding Your Dependency
          </h2>
          {surveyQuestions.map((q) => (
            <div key={q.key} className="mb-6 p-4 border border-gray-200 rounded-md bg-white">
              <p className="text-lg font-medium text-gray-800 mb-3">{q.question} <span className="text-red-500">*</span></p>
              <div className="flex flex-wrap gap-3">
                {q.options.map((option) => (
                  <label key={option.text} className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full cursor-pointer hover:bg-green-100 transition-colors duration-200">
                    <input
                      type="radio"
                      name={q.key}
                      value={option.point}
                      checked={formData[q.key] === option.point}
                      onChange={() => handleQuestionChange(q.key, option.point)}
                      className="accent-green-600 w-4 h-4"
                    />
                    <span className="text-gray-700">{option.text}</span>
                  </label>
                ))}
              </div>
              {errors[q.key] && <p className="text-red-500 text-sm mt-2">{errors[q.key]}</p>}
            </div>
          ))}
          {errors.dependency_level && <p className="text-red-500 text-sm mt-2">{errors.dependency_level}</p>}
        </div>

        {/* --- Additional Notes --- */}
        <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Additional Notes (Optional)
          </h2>
          <textarea
            id="note"
            name="note"
            placeholder="Any other information you'd like to share..."
            value={formData.note}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          ></textarea>
        </div>

        {submissionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {submissionError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-semibold text-white text-lg transition-all duration-300 ease-in-out
            ${isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-800 shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Survey"
          )}
        </button>
      </form>
    </div>
    </>
  );
};

export default UserSurveyForm;
