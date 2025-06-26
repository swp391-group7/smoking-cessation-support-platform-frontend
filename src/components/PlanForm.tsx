import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Stage, PlanType } from "@/api/plantype";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { StageItem } from "./StageItem";
import { deleteDraftPlan } from "@/api/userPlanApi";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

interface PlanFormType {
  overallStart: Date;
  overallEnd: Date | null;
}

export const PlanForm: React.FC = () => {
  const { state } = useLocation();
  const planType = state?.planType as PlanType;
  const navigate = useNavigate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { handleSubmit, control, watch, reset } = useForm<PlanFormType>({
    defaultValues: { overallStart: today, overallEnd: null }
  });

  const [stages, setStages] = useState<Stage[]>([]);
  const overallStart = watch("overallStart");
  const overallEnd = watch("overallEnd");

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

  useEffect(() => {
    if (overallStart && stages[0]?.start?.getTime() !== overallStart.getTime()) {
      setStages(prev => prev.map((s, idx) => idx === 0 ? { ...s, start: overallStart } : s));
    }
  }, [overallStart, stages]);

  const showError = (msg: string) => toast.error(msg);
  const showSuccess = (msg: string) => toast.success(msg);

  const onSubmit = (data: PlanFormType) => {
    if (!data.overallEnd) return showError("Vui lòng chọn Ngày dự kiến cai cho kế hoạch tổng thể.");
    if (!stages.length) return showError("Vui lòng thêm ít nhất một giai đoạn cho kế hoạch của bạn.");

    const lastStage = stages[stages.length - 1];
    if (!lastStage.end || lastStage.end.getTime() !== data.overallEnd.getTime()) {
      return showError("Ngày kết thúc của giai đoạn cuối cùng phải trùng với 'Ngày dự kiến cai'.");
    }

    console.log("Plan Info:", data, "Stages:", stages);
    showSuccess("Kế hoạch đã được lưu thành công!");
    reset({ overallStart: today, overallEnd: null });
    setStages([]);
    // navigate('/quit_progress');
  };

  const addStage = () => {
    if (!overallStart || !overallEnd) {
      return showError("Vui lòng chọn Ngày bắt đầu và Ngày dự kiến cai trước khi thêm giai đoạn.");
    }

    const last = stages[stages.length - 1];
    let newStart: Date;
    if (last?.end) newStart = new Date(last.end);
    else if (!stages.length) newStart = overallStart;
    else return showError("Vui lòng đặt Ngày kết thúc cho giai đoạn trước đó trước khi thêm giai đoạn mới.");

    if (newStart >= overallEnd) {
      return showError("Không thể thêm giai đoạn mới. Ngày bắt đầu vượt quá Ngày dự kiến cai.");
    }

    setStages(prev => [...prev, {
      id: `stage-${Date.now()}`,
      title: `Giai đoạn ${prev.length + 1}`,
      description: "",
      start: newStart,
      end: null,
      targetCigarettes: Math.max(0, last.targetCigarettes - 5)
    }]);
  };

  const removeStage = (id: string) => {
    if (stages.length === 1 && stages[0].id === id) return showError("Không thể xóa giai đoạn đầu tiên.");
    setStages(prev => prev.filter(s => s.id !== id));
  };

  const updateStage = (id: string, field: keyof Stage, value: Date | null | number | string) => {
    setStages(prev => prev.map((s, idx) => {
      if (s.id !== id) return s;
      if (field === 'start') {
        const d = value as Date;
        if (idx === 0 && d.getTime() !== overallStart.getTime()) {
          showError("Ngày bắt đầu Giai đoạn 1 không thể thay đổi."); return { ...s, start: overallStart };
        }
        if (d < overallStart || (overallEnd && d > overallEnd)) {
          showError("Ngày bắt đầu giai đoạn không hợp lệ."); return s;
        }
      }
      if (field === 'end') {
        const d = value as Date;
        if (d < s.start!) { showError("Ngày kết thúc không được trước ngày bắt đầu."); return s; }
        if (overallEnd && d > overallEnd) { showError("Ngày kết thúc không được sau Ngày dự kiến cai."); return s; }
      }
      return { ...s, [field]: value };
    }));
  };

  const getMinOverallEndDate = () => {
    const m = new Date(overallStart); m.setDate(m.getDate() + 56); return m;
  };

  if (!planType) {
    return <div className="text-center text-red-500 mt-10">Thông tin kế hoạch không hợp lệ.</div>;
  }

  const handleDeleteAndBack = async () => {
    try {
      await deleteDraftPlan(); navigate(-1);
    } catch {
      showError("Đã xảy ra lỗi khi xóa kế hoạch nháp.");
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
          >
            <ChevronLeft size={18} />
            <span>Quay lại</span>
          </Button>
        </div>

        {/* Overall Dates Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-blue-100 rounded-lg bg-blue-50">
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-2">Ngày bắt đầu kế hoạch</label>
            <Controller
              control={control}
              name="overallStart"
              defaultValue={today} // Already set in defaultValues
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange} // Keep onChange to satisfy Controller, but input is disabled
                  minDate={today} // Can't select before today
                  className="w-full border border-blue-300 rounded-md p-2.5 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholderText="Chọn ngày"
                  disabled // Disable the date picker
                  preventKeyboardInput
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-800 mb-2">
              Ngày dự kiến cai (Tối thiểu 8 tuần)
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
                  placeholderText="Chọn ngày"
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
              disabled={!overallStart || !overallEnd}
              className="bg-green-600 hover:bg-green-700 text-white rounded-md px-5 py-2 transition-colors duration-200 shadow-md"
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
          <Button onClick={handleSubmit(onSubmit)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-2 shadow-md transition-colors duration-200">
            Lưu Kế Hoạch
          </Button>
        </div>
      </div>
    </motion.div>
  );
};