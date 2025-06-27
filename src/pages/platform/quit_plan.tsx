// src/pages/QuitPlanPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { PlanType } from "@/api/plantype";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  createImmediatePlan,
  createDraftPlan,
  createDefaultStep,
  getUserPlans,
} from "@/api/userPlanApi";
import { AxiosError } from "axios";

export default function QuitPlanPage() {
  const [confirmType, setConfirmType] = useState<PlanType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasActivePlan, setHasActivePlan] = useState<boolean>(false);
  const [isCheckingPlans, setIsCheckingPlans] = useState(true);
  const [showActivePlanDialog, setShowActivePlanDialog] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra plan active khi component mount
  useEffect(() => {
    checkActivePlans();
  }, []);

  const checkActivePlans = async () => {
    setIsCheckingPlans(true);
    setError(null);
    try {
      const plans = await getUserPlans();
      console.log('Active plans found:', plans);
      console.log('Plans length:', plans.length);
      
      if (plans && plans.length > 0) {
        console.log('Setting hasActivePlan to true');
        setHasActivePlan(true);
        setShowActivePlanDialog(true);
      } else {
        console.log('No active plans found');
        setHasActivePlan(false);
        setShowActivePlanDialog(false);
      }
    } catch (err) {
      console.error('Error checking active plans:', err);
      setHasActivePlan(false);
      setShowActivePlanDialog(false);
      setError('Không thể kiểm tra kế hoạch hiện tại');
    } finally {
      setIsCheckingPlans(false);
    }
  };

  const handleColdTurkeySelect = () => {
    setError(null);
    setConfirmType("Cold Turkey");
  };
  
  const handleGradualSelect = () => {
    setError(null);
    setConfirmType("Gradual Reduction");
  };

  const handleConfirm = async () => {
    if (!confirmType) return;
    setIsLoading(true);
    setError(null);

    try {
      if (confirmType === "Cold Turkey") {
        await createImmediatePlan();
        navigate("/quit_progress");
      } else {
        // Tạo draft plan trước
        const draftPlan = await createDraftPlan();
        
        // Lưu planId vào sessionStorage để sử dụng trong PlanForm
        sessionStorage.setItem('currentDraftPlanId', draftPlan.id);
        
        // Tạo step đầu tiên
        await createDefaultStep(draftPlan.id);
        
        navigate("/quit_form", { 
          state: { 
            planType: confirmType,
            planId: draftPlan.id 
          } 
        });
      }
    } catch (err: unknown) {
      console.error(err);
      // Narrowing err về AxiosError để lấy message nếu có
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra, vui lòng thử lại sau."
        );
      } else {
        setError("Có lỗi không xác định, vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
      setConfirmType(null);
    }
  };

  const handleGoToProgress = () => {
    navigate("/quit_progress");
  };

  const handleRestartPlan = () => {
    // TODO: Xử lý logic làm lại plan
    setShowActivePlanDialog(false);
    setHasActivePlan(false);
    console.log("Restart plan logic will be implemented later");
  };

  // Loading state khi đang check plans
  if (isCheckingPlans) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra kế hoạch hiện tại...</p>
        </div>
      </div>
    );
  }

  // Nếu có active plan, chỉ hiển thị thông báo đang loading hoặc dialog
  if (hasActivePlan) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        {error && (
          <div className="text-center mb-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        {/* Active Plan Alert Dialog sẽ hiển thị */}
        <AlertDialog
          open={showActivePlanDialog}
          onOpenChange={() => setShowActivePlanDialog(false)}
        >
          <AlertDialogContent className="bg-white rounded-xl shadow-2xl p-8 border border-yellow-100">
            <AlertDialogHeader className="text-center mb-5">
              <AlertDialogTitle className="text-3xl font-extrabold text-yellow-800">
                Bạn đã có kế hoạch đang hoạt động
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-700 text-lg leading-relaxed">
                Hệ thống phát hiện bạn đang có một kế hoạch cai thuốc đang hoạt động. 
                Bạn có muốn tiếp tục với kế hoạch hiện tại hay tạo kế hoạch mới?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex justify-center space-x-4 mt-8">
              <AlertDialogAction
                onClick={handleGoToProgress}
                className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-75"
              >
                Tiếp tục kế hoạch hiện tại
              </AlertDialogAction>
              <AlertDialogAction
                onClick={handleRestartPlan}
                className="bg-yellow-600 text-white px-6 py-3 rounded-full hover:bg-yellow-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-75"
              >
                Tạo kế hoạch mới
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
      {/* Plan Selector */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Cold Turkey Card */}
        <motion.div
          whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)" }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Card
            onClick={handleColdTurkeySelect}
            className="cursor-pointer bg-blue-50 rounded-2xl shadow-lg border-2 border-gray-200 transition-all duration-300 ease-in-out"
          >
            <div className="p-8 space-y-6">
              <h3 className="text-2xl font-extrabold text-blue-700 border-b border-gray-200 pb-4 mb-4">
                Cold Turkey
              </h3>
              <ul className="list-disc list-outside text-gray-700 space-y-2">
                <li>Plan designed by experts & doctors</li>
                <li>Automatically tailored schedule</li>
                <li>Structured progress tracking</li>
                <li>Evidence-based techniques</li>
                <li>Access to professional resources</li>
              </ul>
            </div>
          </Card>
        </motion.div>

        {/* Gradual Reduction Card */}
        <motion.div
          whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)" }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Card
            onClick={handleGradualSelect}
            className="cursor-pointer bg-green-50 rounded-2xl shadow-lg border-2 border-gray-200 transition-all duration-300 ease-in-out"
          >
            <div className="p-8 space-y-6">
              <h3 className="text-2xl font-extrabold text-green-700 border-b border-gray-200 pb-4 mb-4">
                Gradual Reduction
              </h3>
              <ul className="list-disc list-outside text-gray-700 space-y-2">
                <li>Flexible health-based schedule</li>
                <li>Adapts to your mood & preferences</li>
                <li>Self-paced milestones</li>
                <li>Customizable personal goals</li>
                <li>Independent progress tracking</li>
              </ul>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmType !== null}
        onOpenChange={() => setConfirmType(null)}
      >
        <AlertDialogContent className="bg-white rounded-xl shadow-2xl p-8 border border-green-100">
          <AlertDialogHeader className="text-center mb-5">
            <AlertDialogTitle className="text-3xl font-extrabold text-green-800">
              Confirm Your Choice
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700 text-lg leading-relaxed">
              {confirmType === "Cold Turkey"
                ? "Bạn đã chọn Cold Turkey. Kế hoạch sẽ bắt đầu ngay lập tức."
                : "Bạn đã chọn Gradual Reduction. Bạn sẽ điền thêm thông tin để tạo bản nháp."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {error && (
            <p className="text-red-600 text-center mb-4">{error}</p>
          )}

          <AlertDialogFooter className="flex justify-end space-x-4 mt-8">
            <AlertDialogCancel className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-75 disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}