/**
 * 모듈: SettingsPage.tsx
 * 경로: src/pages/SettingsPage.tsx
 * 목적: 자금 + 월 고정비 입력 설정 페이지.
 */
import { RotateCcw } from "lucide-react";
import { FundsSection } from "@/components/inputs/FundsSection";
import { MonthlyExpenseSection } from "@/components/inputs/MonthlyExpenseSection";
import { useBudgetStore } from "@/store/useBudgetStore";

export default function SettingsPage() {
  const reset = useBudgetStore((s) => s.reset);

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            자금 설정
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            보유 자금과 월 고정비를 입력하세요. 대시보드에 바로 반영됩니다.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm("기본값으로 되돌릴까요?")) reset();
          }}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <RotateCcw className="w-4 h-4" /> 초기화
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FundsSection />
        <MonthlyExpenseSection />
      </div>
    </div>
  );
}
