import React, { useEffect, useState } from 'react';
import { CheckCircle, Target } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  type QuitPlanDto,
  getActiveQuitPlan,
} from '../api/progressOverViewApi';
import {
  type QuitPlanStepDto,
  getPlanSteps,
} from '../api/planStepProgressApi';

const PlanStepProgress: React.FC = () => {
  const [steps, setSteps] = useState<QuitPlanStepDto[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedStep, setSelectedStep] = useState<QuitPlanStepDto | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const plan: QuitPlanDto = await getActiveQuitPlan();
        const data = await getPlanSteps(plan.id);
        setSteps(data);

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt về đầu ngày để so sánh chính xác

        let activeStepIndex = 0;
        let foundActiveStep = false;

        for (let i = 0; i < data.length; i++) {
          const step = data[i];
          const start = new Date(step.stepStartDate);
          start.setHours(0, 0, 0, 0);
          const endDate = new Date(step.stepEndDate);
          endDate.setHours(23, 59, 59, 999);

          // Nếu ngày hiện tại nằm trong khoảng của bước này
          if (today >= start && today <= endDate) {
            activeStepIndex = i;
            foundActiveStep = true;
            break;
          }
        }

        // Nếu không tìm thấy bước nào đang active (tức là tất cả các bước đã qua hoặc chưa tới)
        if (!foundActiveStep && data.length > 0) {
            const firstStepStartDate = new Date(data[0].stepStartDate);
            firstStepStartDate.setHours(0,0,0,0);
            const lastStepEndDate = new Date(data[data.length - 1].stepEndDate);
            lastStepEndDate.setHours(23,59,59,999);

            if (today < firstStepStartDate) {
                // Nếu ngày hiện tại trước ngày bắt đầu của bước đầu tiên, vẫn coi là ở bước 0
                activeStepIndex = 0;
            } else if (today > lastStepEndDate) {
                // Nếu ngày hiện tại sau ngày kết thúc của bước cuối cùng, coi là ở bước cuối cùng
                activeStepIndex = data.length - 1;
            }
        } else if (data.length === 0) {
            activeStepIndex = 0; // Xử lý trường hợp không có bước nào
        }

        setCurrentStepIndex(activeStepIndex);

      } catch (err) {
        console.error("Failed to fetch quit plan or steps:", err);
      }
    })();
  }, []);

  const now = new Date().getTime(); // Thời gian hiện tại theo milliseconds

  let progressPercentage = 0;

  if (steps.length > 0) {
    const current = steps[currentStepIndex];
    if (current) {
      const planStartDate = new Date(steps[0].stepStartDate);
      planStartDate.setHours(0,0,0,0);
      const planEndDate = new Date(steps[steps.length - 1].stepEndDate);
      planEndDate.setHours(23,59,59,999);

      // Tính tổng thời lượng của toàn bộ kế hoạch (từ bắt đầu bước 1 đến kết thúc bước cuối cùng)
      const totalPlanDuration = planEndDate.getTime() - planStartDate.getTime();

      if (totalPlanDuration > 0) {
        // Tính thời gian đã trôi qua kể từ khi kế hoạch bắt đầu
        let elapsedTime = now - planStartDate.getTime();
        // Đảm bảo elapsedTime không âm (nếu chưa đến ngày bắt đầu) và không vượt quá totalPlanDuration
        elapsedTime = Math.max(0, Math.min(elapsedTime, totalPlanDuration));

        progressPercentage = Math.round((elapsedTime / totalPlanDuration) * 100);
      } else if (steps.length === 1 && now >= new Date(steps[0].stepStartDate).getTime()) {
        // Xử lý trường hợp chỉ có 1 bước và đã đến/qua ngày bắt đầu
        progressPercentage = 100; // Hoặc một giá trị tùy thuộc vào bạn muốn thể hiện
      }

    } else {
      progressPercentage = 0;
    }
  }

  const arrowVariants: Variants = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: {
      opacity: 1,
      pathLength: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    },
    completed: {
      opacity: 1,
      pathLength: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative">
      {/* Dialog for step details (unchanged) */}
      <Dialog open={!!selectedStep} onOpenChange={open => !open && setSelectedStep(null)}>
        <DialogContent className="max-w-md bg-white rounded-lg shadow-xl border border-green-200">
          <DialogHeader className="p-4 border-b border-green-100">
            <DialogTitle className="text-2xl font-bold text-green-700 flex items-center gap-2">
              <Target className="w-6 h-6 text-green-600" />
              Step Details {selectedStep?.stepNumber}
            </DialogTitle>
            <DialogDescription className="space-y-3 text-gray-700 mt-2">
              <p className="text-base leading-relaxed">{selectedStep?.stepDescription}</p>
              <p>
                <strong className="text-green-600">Time:</strong>{' '}
                {selectedStep?.stepStartDate} – {selectedStep?.stepEndDate}
              </p>
              <p>
                <strong className="text-green-600">Target:</strong>{' '}
                <span className="font-semibold text-green-800">{selectedStep?.targetCigarettesPerDay} cigarettes/day</span>
              </p>
              <p>
                <strong className="text-green-600">Status:</strong>{' '}
                <span className="capitalize font-semibold">{selectedStep?.status}</span>
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="p-4 flex justify-end">
            <Button
              onClick={() => setSelectedStep(null)}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-gradient-to-br from-white to-green-50 rounded-lg p-6 shadow-lg border border-green-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-green-500 rounded">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-green-800">Plan Progress</h2>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-green-700">Progress</span>
            <span className="text-sm font-semibold text-green-600">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-green-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Steps Timeline with Animated Arrows */}
        <div className="relative flex items-center justify-between mb-4 px-6">
          {steps.map((step, index) => {
            const stepEndDate = new Date(step.stepEndDate);
            stepEndDate.setHours(23, 59, 59, 999);

            const isCurrent = index === currentStepIndex;
            // Bước đã hoàn thành: ngày hiện tại đã qua ngày kết thúc của bước đó
            const isCompletedStep = now > stepEndDate.getTime();

            // Màu nền và biểu tượng
            let bgClass = 'bg-gray-300'; // Mặc định là xám (chưa tới)
            let iconContent: React.ReactNode = index + 1; // Mặc định là số bước

            if (isCompletedStep) {
              bgClass = 'bg-green-500'; // Bước đã hoàn thành
              iconContent = <CheckCircle className="w-5 h-5" />;
            } else if (isCurrent) {
              bgClass = 'bg-green-400'; // Bước hiện tại (sáng lên)
              iconContent = index + 1; // Vẫn hiển thị số, không tick
            }


            return (
              <React.Fragment key={step.id}>
                <div
                  className="relative flex-1 flex flex-col items-center z-10 cursor-pointer"
                  onClick={() => setSelectedStep(step)}
                >
                  <div
                    className={`${bgClass} w-8 h-8 rounded-full flex items-center justify-center text-white`}
                  >
                    {iconContent}
                  </div>
                  <span
                    className={`mt-2 text-xs text-center w-24 truncate ${
                      isCompletedStep
                        ? 'text-green-800 font-medium'
                        : (isCurrent ? 'text-green-700 font-medium' : 'text-gray-600')
                    }`}
                  >
                    {step.stepDescription}
                  </span>
                </div>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="relative flex-1 flex justify-center items-center h-full mx-2">
                    <AnimatePresence mode='wait'>
                      <motion.svg
                        className="w-full h-auto absolute top-1/2 left-0 right-0 transform -translate-y-1/2"
                        viewBox="0 0 100 10"
                        preserveAspectRatio="none"
                        initial="hidden"
                        // Mũi tên được animate nếu bước TRƯỚC NÓ đã hoàn thành hoặc là bước hiện tại
                        animate={(isCompletedStep || isCurrent) ? "completed" : "hidden"}
                        key={`arrow-${index}-${currentStepIndex}`}
                      >
                        <motion.path
                          d="M 0 5 L 90 5 M 85 2 L 90 5 L 85 8"
                          stroke={(isCompletedStep || isCurrent) ? "#10B981" : "#D1D5DB"}
                          strokeWidth="2"
                          fill="none"
                          variants={arrowVariants}
                        />
                      </motion.svg>
                    </AnimatePresence>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Current Step Label */}
        <div className="text-center mt-4">
          <p className="text-sm text-green-700">
            <span className="font-semibold">Step {currentStepIndex + 1}:</span>{' '}
            {steps[currentStepIndex]?.stepDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanStepProgress;