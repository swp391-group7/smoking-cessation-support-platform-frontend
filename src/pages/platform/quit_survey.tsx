import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

export default function PlanPage() {
  const { register, handleSubmit, control } = useForm<PlanForm>();
  const [stages, setStages] = useState<Stage[]>([]);

  const onSubmit = (data: PlanForm) => {
    console.log("Plan Info:", data, "Stages:", stages);
    // TODO: gọi API hoặc xử lý tiếp ở đây
  };

  const addStage = () => {
    setStages((prev) => [
      ...prev,
      {
        id: `stage-${Date.now()}`,
        title: "",
        description: "",
        start: null,
        end: null,
      },
    ]);
  };

  const removeStage = (id: string) => {
    setStages((prev) => prev.filter((s) => s.id !== id));
  };

  // -------------------
  // Thiết lập dnd-kit:
  // -------------------
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = stages.findIndex((s) => s.id === active.id);
      const newIndex = stages.findIndex((s) => s.id === over.id);
      setStages((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  // -------------------
  // Component cho mỗi Stage có thể kéo thả
  // -------------------
  function SortableStageItem({
    stage,
    index,
  }: {
    stage: Stage;
    index: number;
  }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: stage.id });

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Giai đoạn {index + 1}</h3>
          <button
            type="button"
            onClick={() => removeStage(stage.id)}
            className="text-red-500 hover:underline"
          >
            Xóa
          </button>
        </div>

        {/* Drag handle */}
        <div
          {...listeners}
          className="cursor-grab mb-2 inline-block text-gray-400 hover:text-gray-600"
        >
          ⠿ Kéo để di chuyển
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Tên giai đoạn</label>
            <input
              type="text"
              value={stage.title}
              onChange={(e) => {
                const newTitle = e.target.value;
                setStages((prev) =>
                  prev.map((s) =>
                    s.id === stage.id ? { ...s, title: newTitle } : s
                  )
                );
              }}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              placeholder="Ví dụ: Giảm liều"
            />
          </div>
          <div>
            <label className="block text-sm">Mô tả</label>
            <input
              type="text"
              value={stage.description}
              onChange={(e) => {
                const newDesc = e.target.value;
                setStages((prev) =>
                  prev.map((s) =>
                    s.id === stage.id ? { ...s, description: newDesc } : s
                  )
                );
              }}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              placeholder="Mô tả ngắn giai đoạn..."
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm">Ngày bắt đầu</label>
            <DatePicker
              selected={stage.start}
              onChange={(date) =>
                setStages((prev) =>
                  prev.map((s) =>
                    s.id === stage.id ? { ...s, start: date } : s
                  )
                )
              }
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày"
            />
          </div>
          <div>
            <label className="block text-sm">Ngày kết thúc</label>
            <DatePicker
              selected={stage.end}
              onChange={(date) =>
                setStages((prev) =>
                  prev.map((s) =>
                    s.id === stage.id ? { ...s, end: date } : s
                  )
                )
              }
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Form chung */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 shadow-md rounded-lg space-y-4"
      >
        <h2 className="text-xl font-semibold">Thiết lập kế hoạch cai thuốc</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">Lý do</label>
          <textarea
            {...register("reason")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Lý do bạn muốn bỏ thuốc..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
            <Controller
              control={control}
              name="overallStart"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Chọn ngày"
                />
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày dự kiến cai</label>
            <Controller
              control={control}
              name="overallEnd"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Chọn ngày"
                />
              )}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={addStage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          + Thêm giai đoạn
        </button>

        {/* DndContext & Sortable List */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={stages.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="mt-4">
              {stages.map((stage, idx) => (
                <SortableStageItem key={stage.id} stage={stage} index={idx} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Nút xem trước và lưu */}
        <div className="flex space-x-4 mt-6">
          <button
            type="button"
            onClick={() => alert("Preview timeline...")}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
          >
            Xem trước kế hoạch
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Lưu kế hoạch
          </button>
        </div>
      </form>
    </div>
  );
}
