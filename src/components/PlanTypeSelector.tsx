import { motion } from "framer-motion"
import type { PlanType } from "@/api/plantype"
import { Card } from "@/components/ui/card"

interface PlanTypeSelectorProps {
  onSelectPlanType: (type: PlanType) => void
  onColdTurkeySelect: () => void
}

export function PlanTypeSelector({ onSelectPlanType, onColdTurkeySelect }: PlanTypeSelectorProps) {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          onClick={onColdTurkeySelect}
          className="cursor-pointer bg-blue-50 hover:shadow-md hover:scale-[1.01] transition-all border-2 border-blue-200"
        >
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-bold text-blue-600">Cold Turkey</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Plan by coaches and doctors</li>
              <li>Auto-tailored schedule</li>
              <li>Structured progress tracking</li>
              <li>Evidence-based techniques</li>
              <li>Professional resources</li>
            </ul>
          </div>
        </Card>

        <Card
          onClick={() => onSelectPlanType("Gradual Reduction")}
          className="cursor-pointer bg-green-50 hover:shadow-md hover:scale-[1.01] transition-all border-2 border-green-200"
        >
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-bold text-green-600">Gradual Reduction</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Flexible health-based schedule</li>
              <li>Adapts to mood/preferences</li>
              <li>Self-paced milestones</li>
              <li>Custom goals</li>
              <li>Independent tracking</li>
            </ul>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}