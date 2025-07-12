import React, { useEffect, useState } from 'react';
import { CheckCircle, Target } from 'lucide-react';
import { motion, AnimatePresence,type Variants } from 'framer-motion'; // Import Variants type
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
        const idx = data.findIndex(step => {
          const start = new Date(step.stepStartDate);
          const end = new Date(step.stepEndDate);
          return today >= start && today <= end;
        });
        setCurrentStepIndex(idx >= 0 ? idx : (data.length > 0 ? data.length - 1 : 0));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const now = new Date().getTime();
  let progressPercentage = 0;
  if (steps.length) {
    const completedCount = steps.slice(0, currentStepIndex).length;
    const current = steps[currentStepIndex];
    if (current) {
        const start = new Date(current.stepStartDate).getTime();
        const end = new Date(current.stepEndDate).getTime();
        const fraction = start < end ? Math.min(Math.max((now - start) / (end - start), 0), 1) : 0;
        progressPercentage = Math.round(((completedCount + fraction) / steps.length) * 100);
    } else if (currentStepIndex === steps.length - 1 && steps[currentStepIndex]) {
        progressPercentage = 100;
    } else {
        progressPercentage = 0;
    }
  }

  // Framer Motion variants for the arrows
  // Explicitly type arrowVariants as Variants
  const arrowVariants: Variants = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: {
      opacity: 1,
      pathLength: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut" // "string" is usually fine, but explicit typing helps
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
            const isCurrent = index === currentStepIndex;
            const completed = index < currentStepIndex || (isCurrent && progressPercentage === 100);
            const bg = completed || isCurrent ? 'bg-green-500' : 'bg-gray-300';

            return (
              <React.Fragment key={step.id}>
                <div
                  className="relative flex-1 flex flex-col items-center z-10 cursor-pointer"
                  onClick={() => setSelectedStep(step)}
                >
                  <div
                    className={`${bg} w-8 h-8 rounded-full flex items-center justify-center text-white`}
                  >
                    {completed ? <CheckCircle className="w-5 h-5" /> : index + 1}
                  </div>
                  <span
                    className={`mt-2 text-xs text-center w-24 truncate ${
                      completed || isCurrent
                        ? 'text-green-800 font-medium'
                        : 'text-gray-600'
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
                        // Ensure 'completed' state is distinct for the type checker, or just use 'visible' if functionally same
                        animate={index < currentStepIndex ? "completed" : (isCurrent ? "visible" : "hidden")}
                        key={`arrow-${index}-${currentStepIndex}`}
                      >
                        <motion.path
                          d="M 0 5 L 90 5 M 85 2 L 90 5 L 85 8"
                          stroke={index < currentStepIndex ? "#10B981" : (isCurrent ? "#34D399" : "#D1D5DB")}
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