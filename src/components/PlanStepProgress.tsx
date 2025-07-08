import React from 'react';
import { CheckCircle, Target } from 'lucide-react';

type PlanStep = {
  name: string;
  completed: boolean;
};

type PlanStepProgressProps = {
  steps: PlanStep[];
  currentStepIndex: number;
};

const PlanStepProgress: React.FC<PlanStepProgressProps> = ({ 
  steps = [
    { name: 'Xác định lý do bỏ thuốc', completed: true },
    { name: 'Chuẩn bị tinh thần và thể chất', completed: true },
    { name: 'Chọn ngày bỏ thuốc', completed: true },
    { name: 'Tìm hiểu các phương pháp hỗ trợ', completed: false },
    { name: 'Thực hiện kế hoạch bỏ thuốc', completed: false },
    { name: 'Duy trì thói quen tích cực', completed: false }
  ], 
  currentStepIndex = 3
}) => {
  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="bg-gradient-to-br from-white to-green-50 rounded-lg p-6 shadow-lg border border-green-100">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-green-500 rounded">
          <Target className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-green-800">Tiến trình Kế hoạch</h2>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-green-700">Tiến độ</span>
          <span className="text-sm font-semibold text-green-600">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-green-100 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-green-500 h-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="relative flex items-center mb-4">
        {/* Connector Base Line */}
        <div className="absolute top-1/2 left-5 right-5 h-0.5 bg-gray-300 transform -translate-y-1/2 z-0" />

        {steps.map((step, index) => {
          const isCurrent = index === currentStepIndex;
          const stepColor = step.completed || isCurrent ? 'bg-green-500' : 'bg-gray-300';
          return (
            <div key={index} className="relative flex-1 flex flex-col items-center z-10">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${stepColor} text-white`}
              >
                {step.completed ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              <span className={`mt-2 text-xs text-center w-20 truncate ${step.completed || isCurrent ? 'text-green-800 font-medium' : 'text-gray-600'}`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current Step Label */}
      <div className="text-center mt-4">
        <p className="text-sm text-green-700">
          <span className="font-semibold">Bước {currentStepIndex + 1}:</span> {steps[currentStepIndex]?.name}
        </p>
      </div>
    </div>
  );
};

export default PlanStepProgress;
