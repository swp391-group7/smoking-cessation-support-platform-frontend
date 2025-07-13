import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Stage, PlanType } from "@/api/plantype";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { StageItem } from "./StageItem";
// sửa thành
import {
  deleteDraftPlan,
  deleteDraftSteps,
  createDefaultStep,
  deleteStepByNumber,
  updateStepByNumber,
  updateLatestDraftPlan
} from "@/api/userPlanApi";
import type { UpdateStepData } from "@/api/userPlanApi";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

interface PlanFormType {
  overallStart: Date;
  overallEnd: Date | null;
}

export const PlanForm: React.FC = () => {
  const { state } = useLocation();
  const planType = state?.planType as PlanType;
  const planId = state?.planId as string || sessionStorage.getItem('currentDraftPlanId');
  const navigate = useNavigate();

 const today = new Date();
today.setDate(today.getDate() + 1);
today.setHours(0, 0, 0, 0);

  const { handleSubmit, control, watch, reset } = useForm<PlanFormType>({
    defaultValues: { overallStart: today, overallEnd: null }
  });

  const [stages, setStages] = useState<Stage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const overallStart = watch("overallStart");
  const overallEnd = watch("overallEnd");

  // Khởi tạo stage đầu tiên
  useEffect(() => {
    if (overallStart && stages.length === 0) {
      setStages([{
        id: `stage-${Date.now()}`,
        title: "Giai đoạn 1: Bắt đầu hành trình",
        description: "Xác định mục tiêu chính và bước đầu tiên của bạn.",
        start: overallStart,
        end: null,
        targetCigarettes: 20
      }]);
    }
  }, [overallStart, stages.length]);

  // Đảm bảo ngày bắt đầu stage 1 = ngày bắt đầu plan
  useEffect(() => {
    if (overallStart && stages[0]?.start?.getTime() !== overallStart.getTime()) {
      setStages(prev => prev.map((s, idx) => idx === 0 ? { ...s, start: overallStart } : s));
    }
  }, [overallStart, stages]);

  const showError = (msg: string) => toast.error(msg);
  const showSuccess = (msg: string) => toast.success(msg);

  const onSubmit = async (data: PlanFormType) => {
    if (!data.overallEnd) return showError("Vui lòng chọn Ngày dự kiến cai cho kế hoạch tổng thể.");
    if (!stages.length) return showError("Vui lòng thêm ít nhất một giai đoạn cho kế hoạch của bạn.");
    if (!planId) return showError("Không tìm thấy ID kế hoạch.");

    const lastStage = stages[stages.length - 1];
    if (!lastStage.end || lastStage.end.getTime() !== data.overallEnd.getTime()) {
      return showError("Ngày kết thúc của giai đoạn cuối cùng phải trùng với 'Ngày dự kiến cai'.");
    }

    setIsLoading(true);
    try {
      // Cập nhật tất cả các step thông qua API
      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        const stepData: UpdateStepData = {
          stepStartDate: stage.start!.toISOString().split('T')[0],
          stepEndDate:   stage.end!.toISOString().split('T')[0],
          targetCigarettesPerDay: stage.targetCigarettes ?? 0,
          stepDescription: stage.description,
          status: "active"  // hoặc lấy từ state nếu bạn quản lý status động
        };
        await updateStepByNumber(planId, i + 1, stepData);
      }

      // Cập nhật targetDate và backend sẽ tự động chuyển status từ draft thành active
      const lastStageEndDate = lastStage.end!.toISOString().split('T')[0];
      await updateLatestDraftPlan({
        targetDate: lastStageEndDate
      });

      showSuccess("Kế hoạch đã được lưu thành công!");
      
      // Xóa planId khỏi sessionStorage
      sessionStorage.removeItem('currentDraftPlanId');
      
      // Reset form
      reset({ overallStart: today, overallEnd: null });
      setStages([]);
      
      // Chuyển đến trang progress
      navigate('/quit_progress');
      
    } catch (error) {
      console.error('Error saving plan:', error);
      showError("Có lỗi xảy ra khi lưu kế hoạch. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const addStage = async () => {
    if (!overallStart || !overallEnd) {
      return showError("Vui lòng chọn Ngày bắt đầu và Ngày dự kiến cai trước khi thêm giai đoạn.");
    }

    if (!planId) {
      return showError("Không tìm thấy ID kế hoạch.");
    }

    const last = stages[stages.length - 1];
    let newStart: Date;
    
    if (last?.end) {
      newStart = new Date(last.end);
    } else if (!stages.length) {
      newStart = overallStart;
    } else {
      return showError("Vui lòng đặt Ngày kết thúc cho giai đoạn trước đó trước khi thêm giai đoạn mới.");
    }

    if (newStart >= overallEnd) {
      return showError("Không thể thêm giai đoạn mới. Ngày bắt đầu vượt quá Ngày dự kiến cai.");
    }

    try {
      // Tạo step mới trên server
      await createDefaultStep(planId);
      
      // Thêm stage mới vào state
      setStages(prev => [...prev, {
        id: `stage-${Date.now()}`,
        title: `Giai đoạn ${prev.length + 1}`,
        description: "",
        start: newStart,
        end: null,
        targetCigarettes: Math.max(0, last.targetCigarettes! - 5)
      }]);
      
      showSuccess(`Đã thêm giai đoạn ${stages.length + 1}`);
    } catch (error) {
      console.error('Error creating step:', error);
      showError("Có lỗi xảy ra khi thêm giai đoạn. Vui lòng thử lại.");
    }
  };

  const removeStage = async (id: string) => {
    if (stages.length === 1 && stages[0].id === id) {
      return showError("Không thể xóa giai đoạn đầu tiên.");
    }

    if (!planId) {
      return showError("Không tìm thấy ID kế hoạch.");
    }

    // Tìm index của stage cần xóa
    const stageIndex = stages.findIndex(s => s.id === id);
    if (stageIndex === -1) return;

    const stepNumber = stageIndex + 1; // stepNumber bắt đầu từ 1

    try {
      // Xóa step trên server
      await deleteStepByNumber(planId, stepNumber);
      
      // Cập nhật lại state
      const newStages = stages.filter(s => s.id !== id);
      
      // Cập nhật lại ngày bắt đầu cho các stage sau
      const updatedStages = newStages.map((stage, index) => {
        if (index === 0) {
          // Stage đầu tiên luôn bắt đầu từ ngày bắt đầu plan
          return { ...stage, start: overallStart, title: `Giai đoạn 1: Bắt đầu hành trình` };
        } else {
          // Các stage sau bắt đầu từ ngày kết thúc stage trước
          const prevStage = newStages[index - 1];
          return { 
            ...stage, 
            start: prevStage.end || overallStart,
            title: `Giai đoạn ${index + 1}`
          };
        }
      });
      
      setStages(updatedStages);
      showSuccess(`Đã xóa giai đoạn ${stepNumber}`);
    } catch (error) {
      console.error('Error deleting step:', error);
      showError("Có lỗi xảy ra khi xóa giai đoạn. Vui lòng thử lại.");
    }
  };

  const updateStage = (id: string, field: keyof Stage, value: Date | null | number | string) => {
    setStages(prev => prev.map((s, idx) => {
      if (s.id !== id) return s;
      
      if (field === 'start') {
        const d = value as Date;
        if (idx === 0 && d.getTime() !== overallStart.getTime()) {
          showError("Ngày bắt đầu Giai đoạn 1 không thể thay đổi."); 
          return { ...s, start: overallStart };
        }
        if (d < overallStart || (overallEnd && d > overallEnd)) {
          showError("Ngày bắt đầu giai đoạn không hợp lệ."); 
          return s;
        }
      }
      
      if (field === 'end') {
        const d = value as Date;
        if (d < s.start!) { 
          showError("Ngày kết thúc không được trước ngày bắt đầu."); 
          return s; 
        }
        if (overallEnd && d > overallEnd) { 
          showError("Ngày kết thúc không được sau Ngày dự kiến cai."); 
          return s; 
        }
        
        // Cập nhật ngày bắt đầu cho stage tiếp theo
        if (idx < prev.length - 1) {
          const nextStageIndex = idx + 1;
          setTimeout(() => {
            setStages(current => current.map((stage, index) => 
              index === nextStageIndex ? { ...stage, start: d } : stage
            ));
          }, 0);
        }
      }
      
      return { ...s, [field]: value };
    }));
  };

  const getMinOverallEndDate = () => {
    const m = new Date(overallStart); 
    m.setDate(m.getDate() + 14); 
    return m;
  };

  if (!planType) {
    return <div className="text-center text-red-500 mt-10">Thông tin kế hoạch không hợp lệ.</div>;
  }

  if (!planId) {
    return <div className="text-center text-red-500 mt-10">Không tìm thấy ID kế hoạch.</div>;
  }

  const handleDeleteAndBack = async () => {
    if (!planId) {
      navigate(-1);
      return;
    }

    try {
      setIsLoading(true);
      // Xóa tất cả draft steps trước
      await deleteDraftSteps(planId);
      // Sau đó xóa draft plan
      await deleteDraftPlan();
      // Xóa planId khỏi sessionStorage
      sessionStorage.removeItem('currentDraftPlanId');
      navigate(-1);
    } catch (error) {
      console.error('Error deleting draft:', error);
      showError("Đã xảy ra lỗi khi xóa kế hoạch nháp.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto font-sans"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white p-8 rounded-xl shadow-2xl space-y-8 border border-gray-100">
        {/* Header Section */}
        <div className="flex justify-between items-center border-b pb-4 mb-4 border-gray-200">
          <h2 className="text-3xl font-bold text-green-700">
            {planType === "Gradual Reduction" ? "Kế Hoạch Giảm Dần" : "Kế Hoạch Cai Ngay Lập Tức"}
          </h2>
          <Button
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full px-4 py-2 transition-colors duration-200 flex items-center space-x-2"
            onClick={handleDeleteAndBack}
            variant="ghost"
            size="sm"
            disabled={isLoading}
          >
            <ChevronLeft size={18} />
            <span>{isLoading ? "Đang xử lý..." : "Quay lại"}</span>
          </Button>
        </div>

        {/* Overall Dates Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-blue-100 rounded-lg bg-blue-50">
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-2">Ngày bắt đầu kế hoạch</label>
            <Controller
              control={control}
              name="overallStart"
              defaultValue={today}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  minDate={today}
                  className="w-full border border-blue-300 rounded-md p-2.5 bg-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Chọn ngày"
                  disabled
                  preventKeyboardInput
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-800 mb-2">
              Ngày dự kiến cai (Tối thiểu 2 tuần)
            </label>
            <Controller
              control={control}
              name="overallEnd"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  minDate={getMinOverallEndDate()}
                  className="w-full border border-blue-300 rounded-md p-2.5 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Chọn ngày"
                />
              )}
            />
          </div>
        </div>

        {/* Stages Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Các giai đoạn cai</h3>
            <Button
              onClick={addStage}
              disabled={!overallStart || !overallEnd || isLoading}
              className="bg-green-600 hover:bg-green-700 text-white rounded-md px-5 py-2 transition-colors duration-200 shadow-md disabled:opacity-50"
            >
              + Thêm Giai đoạn
            </Button>
          </div>

          <AnimatePresence>
            <div className="space-y-4">
              {stages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <StageItem
                    stage={stage}
                    index={index}
                    planType={planType}
                    onUpdate={updateStage}
                    onRemove={removeStage}
                    overallStartDate={overallStart}
                    overallEndDate={overallEnd}
                    prevStageEnd={index > 0 ? stages[index - 1]?.end : null}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
          <Button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-2 shadow-md transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? "Đang lưu..." : "Lưu Kế Hoạch"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};