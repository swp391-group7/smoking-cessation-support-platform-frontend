import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import type { Stage, PlanType } from "@/api/plantype";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/text-area";
import { DatePicker } from "@/components/ui/date-picker";
import { StageItem } from "./StageItem";

interface PlanFormProps {
  planType: PlanType;
  onBack: () => void;
}

interface PlanFormType {
  reason: string;
  overallStart: Date | null;
  overallEnd: Date | null;
}

export const PlanForm: React.FC<PlanFormProps> = ({ planType, onBack }) => {
  const { register, handleSubmit, control, watch, setValue, reset } = useForm<PlanFormType>();
  const [stages, setStages] = useState<Stage[]>([]);

  const today = new Date();
  const overallStart = watch("overallStart");
  const overallEnd = watch("overallEnd");

  useEffect(() => {
    if (planType === "FAST" && overallStart) {
      const startDate = new Date(overallStart);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 56);
      setValue("overallEnd", endDate);

      const defaultStages: Stage[] = [
        {
          id: "stage-1",
          title: "Giảm Liều",
          description: "Cắt giảm 50% số liều",
          start: new Date(startDate),
          end: new Date(startDate.getTime() + 14 * 86400000),
        },
        {
          id: "stage-2",
          title: "Giảm Ngày",
          description: "Cắt giảm 50% số ngày hút",
          start: new Date(startDate.getTime() + 15 * 86400000),
          end: new Date(startDate.getTime() + 28 * 86400000),
        },
        {
          id: "stage-3",
          title: "Kiêng Ngắn Ngày",
          description: "Sau 1 tuần mới được sử dụng thuốc lá",
          start: new Date(startDate.getTime() + 29 * 86400000),
          end: new Date(startDate.getTime() + 42 * 86400000),
        },
        {
          id: "stage-4",
          title: "Kết Thúc",
          description: "Dừng hoàn toàn việc sử dụng thuốc",
          start: new Date(startDate.getTime() + 43 * 86400000),
          end: new Date(startDate.getTime() + 56 * 86400000),
        },
      ];

      setStages(defaultStages);
    }
  }, [planType, overallStart, setValue]);

  const onSubmit = (data: PlanFormType) => {
    console.log("Plan Info:", data, "Stages:", stages);
    alert("Kế hoạch đã được lưu thành công!");
    reset();
    setStages([]);
  };

  const addStage = () => {
    const lastStage = stages[stages.length - 1];
    const newStartDate = lastStage?.end ? new Date(lastStage.end.getTime() + 86400000) : overallStart;

    if (overallEnd && newStartDate && newStartDate >= overallEnd) {
      alert("Không thể thêm giai đoạn mới.");
      return;
    }

    setStages((prev) => [
      ...prev,
      {
        id: `stage-${Date.now()}`,
        title: "",
        description: "",
        start: newStartDate,
        end: null,
      },
    ]);
  };

  const removeStage = (id: string) => {
    if (planType === "FAST") return;
    setStages((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStage = (id: string, field: keyof Stage, value: any) => {
    if (planType === "FAST") return;

    setStages((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (field === "start" && overallEnd && value >= overallEnd) {
          alert("Ngày bắt đầu vượt quá kế hoạch!");
          return s;
        }
        if (field === "end") {
          if (overallEnd && value > overallEnd) {
            alert("Ngày kết thúc vượt quá kế hoạch!");
            return s;
          }
          if (s.start && value < s.start) {
            alert("Ngày kết thúc không được trước ngày bắt đầu!");
            return s;
          }
        }
        return { ...s, [field]: value };
      })
    );
  };

  const getMinEndDate = () => {
    const min = new Date(overallStart || today);
    min.setDate(min.getDate() + 56);
    return min;
  };

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            {planType === "FAST" ? "FAST Plan" : "OPTIONAL Plan"}
          </h2>
          <Button onClick={onBack} variant="default" size="sm">
            Quay lại
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lý do</label>
          <Textarea
            {...register("reason")}
            className="mt-2 w-full border-gray-300 rounded-md"
            placeholder="Lý do bạn muốn bỏ thuốc..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
            <Controller
              control={control}
              name="overallStart"
              defaultValue={null}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  minDate={today}
                  className="mt-2 w-full border border-gray-300 rounded-md p-2"
                  placeholder="Chọn ngày"
                  preventKeyboardInput
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày dự kiến cai {planType === "OPTIONAL" && "(tối thiểu 8 tuần)"}
            </label>
            <Controller
              control={control}
              name="overallEnd"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  minDate={planType === "OPTIONAL" ? getMinEndDate() : overallStart || today}
                  className="mt-2 w-full border border-gray-300 rounded-md p-2"
                  placeholder="Chọn ngày"
                  readOnly={planType === "FAST"}
                  disabled={planType === "FAST"}
                />
              )}
            />
          </div>
        </div>

        {planType === "FAST" && overallStart && (
          <motion.div className="bg-blue-50 p-4 rounded-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="font-medium text-blue-800">Kế hoạch FAST - 4 giai đoạn</h3>
            <p className="text-sm text-blue-600">8 tuần, không chỉnh sửa.</p>
          </motion.div>
        )}

        {planType === "OPTIONAL" && (
          <Button onClick={addStage} disabled={!overallStart || !overallEnd} className="bg-blue-500 hover:bg-blue-600">
            + Thêm giai đoạn
          </Button>
        )}

        <AnimatePresence>
          <div className="mt-4 space-y-4">
            {stages.map((stage, index) => (
              <StageItem
                key={stage.id}
                stage={stage}
                index={index}
                planType={planType}
                onUpdate={updateStage}
                onRemove={removeStage}
              />
            ))}
          </div>
        </AnimatePresence>

        <div className="flex space-x-4 mt-6">
          <Button onClick={() => alert("Preview timeline...")} className="bg-yellow-500 hover:bg-yellow-600">
            Xem trước
          </Button>
          <Button onClick={handleSubmit(onSubmit)} className="bg-green-500 hover:bg-green-600">
            Lưu kế hoạch
          </Button>
        </div>
      </div>
    </motion.div>
  );
};