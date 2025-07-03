import React from 'react';

type PlanStep = {
  name: string;
  completed: boolean;
};

type PlanStepProgressProps = {
  steps: PlanStep[];
  currentStepIndex: number;
};

const PlanStepProgress: React.FC<PlanStepProgressProps> = ({ steps, currentStepIndex }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Tiến trình Kế hoạch của bạn</h2>
      <div className="flex flex-col space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            {step.completed ? (
              <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : index === currentStepIndex ? (
              <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : (
              <div className="w-6 h-6 border-2 border-gray-300 rounded-full mr-3 flex items-center justify-center text-gray-500 font-semibold text-sm">
                {index + 1}
              </div>
            )}
            <p className={`text-lg ${step.completed ? 'text-gray-500 line-through' : index === currentStepIndex ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
              {step.name}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Bạn đang ở **Bước {currentStepIndex + 1}: {steps[currentStepIndex].name}**.
      </div>
    </div>
  );
};

export default PlanStepProgress;