import { motion } from "framer-motion"
import type { Stage, PlanType } from "@/api/plantype"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"

interface StageItemProps {
  stage: Stage
  index: number
  planType: PlanType
  onUpdate: (id: string, field: keyof Stage, value: any) => void
  onRemove: (id: string) => void
}

export function StageItem({
  stage,
  index,
  planType,
  onUpdate,
  onRemove
}: StageItemProps) {
  const isReadonly = planType === "Cold Turkey"

  return (
    <motion.div
      className="rounded-lg border bg-white p-4 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">
          Giai đoạn {index + 1}
        </h3>
        {!isReadonly && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onRemove(stage.id)}
          >
            Xóa
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Tên giai đoạn</label>
          <Input
            value={stage.title}
            onChange={(e) => onUpdate(stage.id, "title", e.target.value)}
            placeholder="Ví dụ: Giảm liều"
            disabled={isReadonly}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Mô tả</label>
          <Input
            value={stage.description}
            onChange={(e) => onUpdate(stage.id, "description", e.target.value)}
            placeholder="Mô tả ngắn..."
            disabled={isReadonly}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Ngày bắt đầu</label>
          <DatePicker
            selected={stage.start}
            onChange={(date) => onUpdate(stage.id, "start", date)}
            disabled={isReadonly}
            placeholder="Chọn ngày"
            className="w-full"
            preventKeyboardInput
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Ngày kết thúc</label>
          <DatePicker
            selected={stage.end}
            onChange={(date) => onUpdate(stage.id, "end", date)}
            disabled={isReadonly}
            placeholder="Chọn ngày"
            minDate={stage.start || new Date()}
            className="w-full"
          />
        </div>
      </div>
    </motion.div>
  )
}