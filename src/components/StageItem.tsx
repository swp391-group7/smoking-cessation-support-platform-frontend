import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";
import { DatePicker } from "@/components/ui/date-picker";
import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";

interface Stage {
  id: string;
  title: string;
  description: string;
  start: Date | null;
  end: Date | null;
  targetCigarettes: number;
}

type PlanType = "Cold Turkey" | "Gradual Reduction"; // Ensure PlanType is defined here or imported

interface StageItemProps {
  stage: Stage;
  index: number;
  planType: PlanType;
  onUpdate: (id: string, field: keyof Stage, value: any) => void;
  onRemove: (id: string) => void;
  overallStartDate: Date | null;
  overallEndDate: Date | null;
  prevStageEnd: Date | null; // This will be the linking point
}

export const StageItem: React.FC<StageItemProps> = ({
  stage,
  index,
  planType,
  onUpdate,
  onRemove,
  overallStartDate,
  overallEndDate,
  prevStageEnd,
}) => {
  const isFirstStage = index === 0;

  // Calculate min start date for current stage
  const getMinStartDate = () => {
    if (isFirstStage) {
      return overallStartDate; // First stage start date is fixed to overall plan start
    }
    // For subsequent stages, start date must be >= previous stage's end date
    // Or today if previous end date is not set (shouldn't happen with proper flow)
    return prevStageEnd ? new Date(prevStageEnd.getTime()) : new Date();
  };

  // Calculate min end date for current stage
  const getMinEndDate = () => {
    // End date must be after or equal to current stage's start date
    // And not exceed overall end date
    const minFromStageStart = stage.start || new Date();
    if (overallEndDate && minFromStageStart > overallEndDate) {
      return overallEndDate;
    }
    return minFromStageStart;
  };

  // Determine if the start date picker should be disabled
  const isStartDateDisabled = isFirstStage || (index > 0 && prevStageEnd !== null);

  return (
    <Card className="p-6 rounded-lg shadow-md border border-gray-100 bg-white">
      <div className="flex justify-between items-center mb-4 border-b pb-3 border-gray-100">
        <h4 className="text-lg font-semibold text-gray-700">{stage.title || `Giai đoạn ${index + 1}`}</h4>
        {!isFirstStage && ( // Can remove if not the first stage
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(stage.id)}
            className="text-red-500 hover:text-red-700 p-0"
          >
            <XCircle size={20} />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Stage Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Ngày bắt đầu</label>
          <DatePicker
            selected={stage.start}
            onChange={(date) => onUpdate(stage.id, "start", date)}
            minDate={getMinStartDate() || undefined}
            maxDate={overallEndDate || undefined}
            className="w-full border border-gray-300 rounded-md p-2 bg-white"
            placeholderText="Chọn ngày"
            disabled={isStartDateDisabled} // Disable based on logic
          />
        </div>

        {/* Stage End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Ngày kết thúc</label>
          <DatePicker
            selected={stage.end}
            onChange={(date) => onUpdate(stage.id, "end", date)}
            minDate={getMinEndDate() || undefined}
            maxDate={overallEndDate || undefined}
            className="w-full border border-gray-300 rounded-md p-2 bg-white"
            placeholderText="Chọn ngày"
          />
        </div>
      </div>

      {/* Stage Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">Mô tả giai đoạn</label>
        <Textarea
          value={stage.description}
          onChange={(e) => onUpdate(stage.id, "description", e.target.value)}
          className="w-full border-gray-300 rounded-md min-h-[80px]"
          placeholder="Mô tả mục tiêu và hoạt động trong giai đoạn này..."
        />
      </div>

      {/* Target Cigarettes */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Số điếu thuốc mục tiêu</label>
        <Input
          type="number"
          value={stage.targetCigarettes}
          onChange={(e) => onUpdate(stage.id, "targetCigarettes", parseInt(e.target.value) || 0)}
          min={0}
          className="w-full border-gray-300 rounded-md"
          placeholder="Ví dụ: 10 điếu/ngày"
        />
      </div>
    </Card>
  );
};