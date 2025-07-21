// src/pages/platform/PlanFormGenForMember.tsx
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  deleteDraftPlan,
  deleteDraftSteps,
  updateStepByNumber,
  updateLatestDraftPlan,
  generateSamplePlan,
} from "@/api/userPlanApi"; // Make sure userPlanApi.ts is updated as below
import { hasActiveMembership } from "@/api/membershipApi";
import type { GeneratedPlan, GeneratedStep, UpdateStepData } from "@/api/userPlanApi";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker"; // Still needed for initial date setting, but not for display
import { ChevronLeft, Sparkles, Target, Calendar, Save } from "lucide-react";
import { toast } from "sonner";

// Interface for the form data
interface PlanFormType {
  targetDate: string;
}

// Interface for an editable step, extending GeneratedStep and adding UI state
interface EditableStep extends GeneratedStep {
  isEditing?: boolean; // Kept for type consistency, not functionally used here
  tempDescription?: string;
  tempTargetCigarettes?: number;
  tempStartDate?: string;
  tempEndDate?: string;
}

// Keys for localStorage
const LOCAL_STORAGE_PLAN_ID_KEY = 'draftPlanId';

export const PlanFormGenForMember: React.FC = () => {
  const navigate = useNavigate();

  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [editableSteps, setEditableSteps] = useState<EditableStep[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isCheckingMembership, setIsCheckingMembership] = useState(true);

  const { handleSubmit, control, setValue, watch } = useForm<PlanFormType>();

  const showError = (msg: string) => toast.error(msg);
  const showSuccess = (msg: string) => toast.success(msg);

  // Watch for target date changes to recalculate step dates
  const targetDate = watch("targetDate");

  // --- Utility functions ---

  // Function to recalculate step dates based on plan start and target dates
  const recalculateStepDates = (steps: EditableStep[], planStartDate: string, planTargetDate: string): EditableStep[] => {
    if (!planStartDate || !planTargetDate || steps.length === 0) return steps;

    const startDate = new Date(planStartDate);
    const endDate = new Date(planTargetDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysPerStep = Math.ceil(totalDays / steps.length);

    return steps.map((step, index) => {
      const stepStartDate = new Date(startDate);
      stepStartDate.setDate(startDate.getDate() + (index * daysPerStep));

      const stepEndDate = new Date(startDate);
      if (index === steps.length - 1) {
        // Last step ends on target date
        stepEndDate.setTime(endDate.getTime());
      } else {
        stepEndDate.setDate(startDate.getDate() + ((index + 1) * daysPerStep) - 1);
      }

      return {
        ...step,
        stepStartDate: stepStartDate.toISOString().split('T')[0],
        stepEndDate: stepEndDate.toISOString().split('T')[0],
        // temp values not used in view-only mode, but kept for type consistency
        tempStartDate: step.tempStartDate,
        tempEndDate: step.tempEndDate,
      };
    });
  };

  // Function to clean up any existing draft plan and steps
  const cleanupDraftPlan = async () => {
    const storedPlanId = localStorage.getItem(LOCAL_STORAGE_PLAN_ID_KEY);

    try {
      if (storedPlanId) {
        // Call deleteDraftSteps and deleteDraftPlan with the specific planId
        // This assumes your backend API requires the planId for deletion.
        await deleteDraftSteps(storedPlanId);
        await deleteDraftPlan(storedPlanId);
        console.log(`Successfully cleaned up draft plan (ID: ${storedPlanId}) and steps.`);
      } else {
        console.log('No specific draft plan ID found in localStorage. Nothing to delete by ID.');
        // If your backend has a generic "delete all drafts for current user" endpoint
        // that doesn't require a planId, you would call it here instead.
        // Example: await deleteGenericDraftsForCurrentUser();
      }
    } catch (error) {
      // Log errors but don't re-throw, as the goal is to clean up best effort.
      // This is where StaleObjectStateException might be caught if it occurs.
      console.error('Error during draft cleanup:', error);
    } finally {
      // Always remove the stored ID after attempting cleanup, regardless of success/failure,
      // to prevent trying to delete a non-existent ID on next load.
      localStorage.removeItem(LOCAL_STORAGE_PLAN_ID_KEY);
    }
  };


  // Helper function to format date strings for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Invalid date string:", dateString);
      return "Invalid Date";
    }
  };

  // --- Effects ---

  // Check membership and clean up on page load/reload
  useEffect(() => {
    const checkMembershipAndCleanupOnLoad = async () => {
      try {
        setIsCheckingMembership(true);

        const userId = localStorage.getItem('userId');
        if (!userId) {
          showError("User not authenticated");
          navigate('/login');
          return;
        }

        const hasActiveSub = await hasActiveMembership(userId);
        if (!hasActiveSub) {
          showError("You need an active membership to access this feature");
          navigate('/membership');
          return;
        }

        // IMPORTANT: Clean up any existing draft plan and steps upon component mount/reload
        await cleanupDraftPlan();

      } catch (error) {
        console.error('Error checking membership or cleaning up:', error);
        showError("Error checking membership. Please try again.");
        navigate('/membership'); // Redirect to membership if there's an issue
      } finally {
        setIsCheckingMembership(false);
      }
    };

    checkMembershipAndCleanupOnLoad();
  }, [navigate]); // navigate is a dependency if it's used inside the effect

  // Effect to recalculate step dates when target date changes
  useEffect(() => {
    if (targetDate && generatedPlan && editableSteps.length > 0) {
      const updatedSteps = recalculateStepDates(editableSteps, generatedPlan.startDate, targetDate);
      setEditableSteps(updatedSteps);
    }
  }, [targetDate, generatedPlan?.startDate]);

  // --- Handlers ---

  // Handle generating a sample plan
  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const plan = await generateSamplePlan();
      setGeneratedPlan(plan);
      setHasGenerated(true);

      // Store the plan ID in localStorage for future cleanup
      localStorage.setItem(LOCAL_STORAGE_PLAN_ID_KEY, plan.id);

      const stepsWithDates = recalculateStepDates(
        plan.steps.map(step => ({ ...step, isEditing: false })), // isEditing is always false now
        plan.startDate,
        plan.targetDate
      );

      setEditableSteps(stepsWithDates);
      setValue("targetDate", plan.targetDate); // Set form value, but UI will be read-only
      showSuccess("Sample plan generated successfully! 🎉");
    } catch (error) {
      console.error('Error generating plan:', error);
      showError("Error generating sample plan. Please try again. 😟");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle final submission of the plan
  const onSubmit = async (data: PlanFormType) => {
    if (!generatedPlan) {
      showError("No plan to save. Please generate a plan first. 🚫");
      return;
    }
    // targetDate is now read-only, so it should always be present from generatedPlan
    if (!data.targetDate) {
      showError("Target quit date is missing. Please regenerate the plan. 📅");
      return;
    }

    setIsLoading(true);
    try {
      // Update all steps with their current (read-only) values
      for (const step of editableSteps) {
        const updateData: UpdateStepData = {
          stepStartDate: step.stepStartDate,
          stepEndDate: step.stepEndDate,
          targetCigarettesPerDay: step.targetCigarettesPerDay,
          stepDescription: step.stepDescription,
          status: "active" // Assuming saving activates the plan/steps
        };
        await updateStepByNumber(generatedPlan.id, step.stepNumber, updateData);
      }

      // Update plan target date and activate it
      await updateLatestDraftPlan({
        targetDate: data.targetDate
      });

      showSuccess("Plan saved and activated successfully! 🎉");
      // Remove the draft plan ID from localStorage after successful save,
      // as it's no longer a draft.
      localStorage.removeItem(LOCAL_STORAGE_PLAN_ID_KEY);
      navigate('/quit_progress'); // Redirect after successful save

    } catch (error) {
      console.error('Error saving plan:', error);
      showError("Error saving plan. Please try again. 😟");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting the draft plan and navigating back
  // This is now always triggered by the "Back" button and on component mount/reload
  const handleDeleteAndBack = async () => {
    try {
      setIsLoading(true);
      await cleanupDraftPlan(); // Calls the updated cleanup function
      showSuccess("Draft plan deleted successfully and returned. 👍");
      navigate(-1); // Go back to the previous page
    } catch (error) {
      console.error('Error deleting draft:', error);
      showError("Error deleting draft plan. Please try again. 😟");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render logic ---

  // Show loading screen while checking membership and cleaning up
  if (isCheckingMembership) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking membership status and cleaning up old drafts...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-full">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Quit Plan
                </h1>
                <p className="text-gray-600 mt-1">Generated based on your survey</p>
              </div>
            </div>
            <Button
              onClick={handleDeleteAndBack} // "Back" button always deletes draft and navigates back
              variant="ghost"
              size="sm"
              disabled={isLoading}
              className="hover:bg-gray-100 rounded-full px-4 py-2 transition-all duration-200 text-gray-700"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        {/* Introductory Message */}
        {hasGenerated && (
          <motion.div
            className="bg-blue-50/80 backdrop-blur-sm rounded-2xl shadow-md p-6 mb-8 border border-blue-200 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-blue-800 mb-3">
              Your Personalized Quit Plan
            </h2>
            <p className="text-blue-700 text-lg">
              This is a sample quit plan generated just for you based on your survey responses.
              Review the steps below. If you are satisfied and agree with this plan, click "Save Plan" to start your journey.
              Otherwise, you can click "Back" to discard this draft and return to the previous page.
            </p>
          </motion.div>
        )}


        {/* Generate Plan Section */}
        {!hasGenerated && (
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-gray-200 text-center"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Target className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Create Your Quit Plan
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                The system will generate a personalized quit plan based on the information you provided.
              </p>
              <Button
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating plan...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Generate My Plan</span>
                  </div>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Generated Plan Display */}
        {hasGenerated && generatedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Plan Overview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Start Date</h3>
                  <p className="text-gray-600">{formatDate(generatedPlan.startDate)}</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Target Quit Date</h3>
                  {/* Target Quit Date is now read-only */}
                  <p className="text-gray-700 bg-gray-100 rounded-md p-2 min-h-[40px] flex items-center w-full max-w-[180px] mx-auto">
                    {formatDate(generatedPlan.targetDate)}
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Method</h3>
                  <p className="text-gray-600 capitalize">{generatedPlan.method}</p>
                </div>
              </div>
            </div>

            {/* Steps Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Action Steps</h2>
                {/* Removed "Add Step" button */}
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {editableSteps.map((step) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                            {step.stepNumber}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Step {step.stepNumber}
                          </h3>
                        </div>
                        {/* Removed Edit and Delete buttons */}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          {/* Display as text, not editable input */}
                          <p className="text-gray-700 bg-gray-100 rounded-md p-2 min-h-[40px] flex items-center">
                            {formatDate(step.stepStartDate)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                          </label>
                          {/* Display as text, not editable input */}
                          <p className="text-gray-700 bg-gray-100 rounded-md p-2 min-h-[40px] flex items-center">
                            {formatDate(step.stepEndDate)}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Target Cigarettes/Day
                        </label>
                        {/* Display as text, not editable input */}
                        <p className="text-gray-700 bg-gray-100 rounded-md p-2 min-h-[40px] flex items-center">
                          {step.targetCigarettesPerDay} cigarettes
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        {/* Display as text, not editable textarea */}
                        <p className="text-gray-700 bg-gray-100 rounded-md p-2 min-h-[80px]">
                          {step.stepDescription}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pb-8">
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="w-5 h-5" />
                    <span>Save Plan</span>
                  </div>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PlanFormGenForMember;
