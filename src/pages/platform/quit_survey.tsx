import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

type Stage = {
  id: string;
  title: string;
  description: string;
  start: Date | null;
  end: Date | null;
};

type PlanForm = {
  reason: string;
  overallStart: Date | null;
  overallEnd: Date | null;
};

// Simple DatePicker component since react-datepicker isn't available
const DatePicker = ({ 
  selected, 
  onChange, 
  minDate, 
  maxDate, 
  className, 
  placeholder, 
  disabled = false,
  readOnly = false,
  preventKeyboardInput = false
}: {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  preventKeyboardInput?: boolean;
}) => {
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      onChange(new Date(value));
    } else {
      onChange(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (preventKeyboardInput) {
      // Chặn tất cả phím bàn phím trừ Tab để có thể navigate
      if (e.key !== 'Tab') {
        e.preventDefault();
      }
    }
  };

  return (
    <input
      type="date"
      value={formatDate(selected)}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      min={minDate ? formatDate(minDate) : undefined}
      max={maxDate ? formatDate(maxDate) : undefined}
      className={className}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
    />
  );
};

// Simple Button component
const Button = ({ 
  children, 
  onClick, 
  type = "button", 
  variant = "default", 
  size = "default", 
  disabled = false,
  className = ""
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "default" | "destructive";
  size?: "default" | "sm";
  disabled?: boolean;
  className?: string;
}) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    default: "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500",
    destructive: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500"
  };
  const sizeClasses = {
    default: "px-4 py-2",
    sm: "px-3 py-1 text-sm"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// Simple Input component
const Input = ({ 
  value, 
  onChange, 
  placeholder, 
  disabled = false,
  className = ""
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
    />
  );
};

// Simple Textarea component
const Textarea = ({ 
  value, 
  onChange, 
  placeholder, 
  className = "",
  ...props
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      rows={3}
      {...props}
    />
  );
};

// Simplified sortable stage item without drag-and-drop
function StageItem({ stage, index, planType, onUpdate, onRemove }: { 
  stage: Stage; 
  index: number;
  planType: "FAST" | "OPTIONAL";
  onUpdate: (id: string, field: keyof Stage, value: any) => void;
  onRemove: (id: string) => void;
}) {
  const isReadonly = planType === "FAST";

  return (
    <motion.div
      className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-800">Giai đoạn {index + 1}</h3>
        {!isReadonly && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onRemove(stage.id)}
          >
            Xóa
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên giai đoạn</label>
          <Input
            value={stage.title}
            onChange={(e) => onUpdate(stage.id, 'title', e.target.value)}
            placeholder="Ví dụ: Giảm liều"
            disabled={isReadonly}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mô tả</label>
          <Input
            value={stage.description}
            onChange={(e) => onUpdate(stage.id, 'description', e.target.value)}
            placeholder="Mô tả ngắn..."
            disabled={isReadonly}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
          <DatePicker
            selected={stage.start}
            onChange={(date) => onUpdate(stage.id, 'start', date)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Chọn ngày"
            disabled={isReadonly}
            preventKeyboardInput={true}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
          <DatePicker
            selected={stage.end}
            onChange={(date) => onUpdate(stage.id, 'end', date)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Chọn ngày"
            minDate={stage.start || new Date()}
            disabled={isReadonly}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function PlanPage() {
  const { register, handleSubmit, control, watch, setValue } = useForm<PlanForm>();
  const [stages, setStages] = useState<Stage[]>([]);
  const [planType, setPlanType] = useState<"FAST" | "OPTIONAL" | null>(null);
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
          end: new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        },
        {
          id: "stage-2",
          title: "Giảm Ngày",
          description: "Cắt giảm 50% số ngày hút",
          start: new Date(startDate.getTime() + 15 * 24 * 60 * 60 * 1000),
          end: new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
        },
        {
          id: "stage-3",
          title: "Kiêng Ngắn Ngày",
          description: "Sau 1 tuần mới được sử dụng thuốc lá",
          start: new Date(startDate.getTime() + 29 * 24 * 60 * 60 * 1000),
          end: new Date(startDate.getTime() + 42 * 24 * 60 * 60 * 1000),
        },
        {
          id: "stage-4",
          title: "Kết Thúc",
          description: "Dừng hoàn toàn việc sử dụng thuốc",
          start: new Date(startDate.getTime() + 43 * 24 * 60 * 60 * 1000),
          end: new Date(startDate.getTime() + 56 * 24 * 60 * 60 * 1000),
        },
      ];

      setStages(defaultStages);
    }
  }, [planType, overallStart, setValue]);

  const onSubmit = (data: PlanForm) => {
    console.log("Plan Info:", data, "Stages:", stages);
    alert("Plan saved successfully!");
  };

  const addStage = () => {
    const lastStage = stages[stages.length - 1];
    const newStartDate = lastStage && lastStage.end ? 
      new Date(lastStage.end.getTime() + 24 * 60 * 60 * 1000) : 
      overallStart;
    
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
    
    if (field === 'start' && overallEnd && value && value >= overallEnd) {
      alert("Ngày bắt đầu vượt quá kế hoạch!");
      return;
    }
    
    if (field === 'end' && overallEnd && value && value > overallEnd) {
      alert("Ngày kết thúc vượt quá kế hoạch!");
      return;
    }
    
    setStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const getMinEndDate = () => {
    if (!overallStart) return today;
    const minDate = new Date(overallStart);
    minDate.setDate(minDate.getDate() + 56);
    return minDate;
  };

  if (!planType) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl space-y-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-800">Chọn kế hoạch cai thuốc</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="border-2 border-blue-200 rounded-lg p-6 hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer bg-blue-50"
              onClick={() => setPlanType("FAST")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3 className="font-bold text-blue-600 text-xl mb-4">FAST</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Plan by coaches and doctors</li>
                <li>Auto-tailored schedule</li>
                <li>Structured progress tracking</li>
                <li>Evidence-based techniques</li>
                <li>Professional resources</li>
              </ul>
            </motion.div>
            <motion.div
              className="border-2 border-green-200 rounded-lg p-6 hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer bg-green-50"
              onClick={() => setPlanType("OPTIONAL")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3 className="font-bold text-green-600 text-xl mb-4">OPTIONAL</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Flexible health-based schedule</li>
                <li>Adapts to mood/preferences</li>
                <li>Self-paced milestones</li>
                <li>Custom goals</li>
                <li>Independent tracking</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {planType === "FAST" ? "FAST Plan" : "OPTIONAL Plan"}
        </h2>

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
                  onChange={(date) => field.onChange(date)}
                  minDate={today}
                  className="mt-2 w-full border border-gray-300 rounded-md p-2"
                  placeholder="Chọn ngày"
                  preventKeyboardInput={true}
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
                  onChange={(date) => field.onChange(date)}
                  minDate={planType === "OPTIONAL" ? getMinEndDate() : (watch("overallStart") || today)}
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
          <motion.div
            className="bg-blue-50 p-4 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="font-medium text-blue-800">Kế hoạch FAST - 4 giai đoạn</h3>
            <p className="text-sm text-blue-600">8 tuần, không chỉnh sửa.</p>
          </motion.div>
        )}

        {planType === "OPTIONAL" && (
          <Button
            onClick={addStage}
            disabled={!overallEnd || !overallStart}
            className="bg-blue-500 hover:bg-blue-600"
          >
            + Thêm giai đoạn
          </Button>
        )}

        <AnimatePresence>
          <div className="mt-4 space-y-4">
            {stages.map((stage, idx) => (
              <StageItem 
                key={stage.id} 
                stage={stage} 
                index={idx} 
                planType={planType}
                onUpdate={updateStage}
                onRemove={removeStage}
              />
            ))}
          </div>
        </AnimatePresence>

        <div className="flex space-x-4 mt-6">
          <Button
            onClick={() => alert("Preview timeline...")}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            Xem trước
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit(onSubmit)}
            className="bg-green-500 hover:bg-green-600"
          >
            Lưu kế hoạch
          </Button>
        </div>
      </div>
    </motion.div>
  );
}