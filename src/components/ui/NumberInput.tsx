/**
 * 모듈: NumberInput.tsx
 * 경로: src/components/ui/NumberInput.tsx
 * 목적: 천 단위 콤마가 적용된 숫자 입력 컴포넌트.
 */
import type { ChangeEvent } from "react";
import { formatNumber, parseNumber } from "@/utils/format";

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  highlight?: boolean;
}

export function NumberInput({
  label,
  value,
  onChange,
  unit = "원",
  highlight = false,
}: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(parseNumber(e.target.value));
  };

  return (
    <div
      className={`flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 ${
        highlight
          ? "bg-brand-50/60 dark:bg-brand-900/20 rounded-xl px-3 -mx-3"
          : ""
      }`}
    >
      <label className="text-slate-600 dark:text-slate-300 font-medium mb-2 sm:mb-0">
        {label}
      </label>
      <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all">
        <input
          type="text"
          inputMode="numeric"
          className="w-32 sm:w-36 text-right outline-none bg-transparent font-bold text-slate-800 dark:text-slate-100"
          value={formatNumber(value)}
          onChange={handleChange}
        />
        <span className="ml-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
          {unit}
        </span>
      </div>
    </div>
  );
}
