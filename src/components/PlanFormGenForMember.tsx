// src/pages/platform/PlanFormGenForMember.tsx
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  deleteDraftPlan,
  deleteDraftSteps,
  createDefaultStep,
  deleteStepByNumber,
  updateStepByNumber,
  updateLatestDraftPlan,
} from "@/api/userPlanApi";
import type { GeneratedPlan, GeneratedStep, UpdateStepData } from "@/api/userPlanApi";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { StageItem } from "./StageItem";
import { toast } from "sonner";

interface PlanFormType {
  overallStart: Date;
  overallEnd: Date | null;
}

export const PlanFormGenForMember: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const samplePlan = state?.samplePlan as GeneratedPlan;
  const planId = samplePlan?.id;

  // khởi ngày today = ngày kế tiếp
  const today = new Date();
  today.setDate(today.getDate() + 1);
  today.setHours(0, 0, 0, 0);

  const { handleSubmit, control, watch, reset } = useForm<PlanFormType>({
    defaultValues: {
      overallStart: new Date(samplePlan.startDate),
      overallEnd: new Date(samplePlan.targetDate),
    },
  });

  const [stages, setStages] = useState<GeneratedStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const overallStart = watch("overallStart");
  const overallEnd = watch("overallEnd");

  // Lấy list steps từ samplePlan
  useEffect(() => {
    if (samplePlan?.steps) {
      setStages(samplePlan.steps);
    }
  }, [samplePlan]);

  const showError = (msg: string) => toast.error(msg);
  const showSuccess = (msg: string) => toast.success(msg);

  const onSubmit = async (data: PlanFormType) => {
    if (!data.overallEnd) return showError("Please select a target quit date.");
    if (!stages.length) return showError("No steps to save.");
    if (!planId) return showError("Plan ID missing.");

    setIsLoading(true);
    try {
      // 1) Cập nhật từng step
      for (let i = 0; i < stages.length; i++) {
        const s = stages[i];
        const stepData: UpdateStepData = {
          stepStartDate: s.stepStartDate,
          stepEndDate: s.stepEndDate,
          targetCigarettesPerDay: s.targetCigarettesPerDay,
          stepDescription: s.stepDescription,
          status: "draft",
        };
        await updateStepByNumber(planId, i + 1, stepData);
      }

      // 2) Cập nhật targetDate + backend chuyển draft→active nếu cần
      await updateLatestDraftPlan({ targetDate: data.overallEnd.toISOString().slice(0, 10) });

      showSuccess("Plan saved successfully!");
      navigate("/quit_progress");
    } catch (err) {
      console.error(err);
      showError("Error saving plan.");
    } finally {
      setIsLoading(false);
    }
  };

  const addStage = async () => {
    if (!planId) return showError("Plan ID missing.");
    await createDefaultStep(planId);
    // reload từ backend hoặc append giả lập
    const newStep: GeneratedStep = {
      ...stages[stages.length - 1],
      stepNumber: stages.length + 1,
      id: `temp-${Date.now()}`,
      stepStartDate: stages[stages.length - 1].stepEndDate,
      stepEndDate: overallEnd?.toISOString().slice(0, 10) || stages[0].stepEndDate,
      targetCigarettesPerDay: Math.max(0, stages[stages.length - 1].targetCigarettesPerDay - 2),
      stepDescription: `Step ${stages.length + 1}/${stages.length + 1}`,
      status: "draft",
      createAt: new Date().toISOString(),
      quitPlanId: planId,
    };
    setStages(prev => [...prev, newStep]);
  };

  const removeStage = async (stepNum: number) => {
    if (!planId) return;
    await deleteStepByNumber(planId, stepNum);
    setStages(prev => prev.filter(s => s.stepNumber !== stepNum));
  };

  if (!samplePlan) {
    return <div className="text-center text-red-500 mt-10">No sample plan provided.</div>;
  }

  return (
    <motion.div className="p-6 max-w-4xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ChevronLeft /> Back
        </Button>
        <h2 className="text-2xl font-bold">Edit Your Sample Plan</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Overall dates */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Controller
            name="overallStart"
            control={control}
            render={({ field }) => (
              <DatePicker {...field} disabled className="w-full" />
            )}
          />
          <Controller
            name="overallEnd"
            control={control}
            render={({ field }) => <DatePicker {...field} className="w-full" />}
          />
        </div>

        {/* Steps list */}
        <div className="space-y-4 mb-6">
          {stages.map((step, idx) => (
            <StageItem
              key={step.id}
              stage={{
                ...step,
                start: new Date(step.stepStartDate),
                end: new Date(step.stepEndDate),
                targetCigarettes: step.targetCigarettesPerDay,
                description: step.stepDescription,
              }}
              index={idx}
              planType={samplePlan.method === "GRADUAL" ? "Gradual Reduction" : "Immediate"}
              onUpdate={(id, field, val) => {
                setStages(prev =>
                  prev.map(s =>
                    s.id === step.id
                      ? {
                          ...s,
                          ...(field === "start"
                            ? { stepStartDate: (val as Date).toISOString().slice(0, 10) }
                            : field === "end"
                            ? { stepEndDate: (val as Date).toISOString().slice(0, 10) }
                            : { targetCigarettesPerDay: val as number }),
                        }
                      : s
                  )
                );
              }}
              onRemove={() => removeStage(step.stepNumber)}
              overallStartDate={overallStart!}
              overallEndDate={overallEnd!}
              prevStageEnd={idx > 0 ? new Date(stages[idx - 1].stepEndDate) : null}
            />
          ))}
        </div>

        <div className="flex justify-between">
          <Button onClick={addStage}>+ Add Step</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Plan"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
export default PlanFormGenForMember;