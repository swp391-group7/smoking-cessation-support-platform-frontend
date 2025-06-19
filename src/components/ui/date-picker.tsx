import React from "react";
import { cn } from "@/lib/utils"; // Đảm bảo utils đã có cn()

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  preventKeyboardInput?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  minDate,
  maxDate,
  className,
  placeholder,
  disabled = false,
  readOnly = false,
  preventKeyboardInput = false,
}) => {
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value ? new Date(value) : null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (preventKeyboardInput && e.key !== "Tab") {
      e.preventDefault();
    }
  };

  return (
    <input
      type="date"
      data-slot="date-picker"
      value={formatDate(selected)}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      min={minDate ? formatDate(minDate) : undefined}
      max={maxDate ? formatDate(maxDate) : undefined}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
    />
  );
};