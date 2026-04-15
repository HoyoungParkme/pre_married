/**
 * 모듈: HomePage.tsx
 * 경로: src/pages/HomePage.tsx
 * 목적: 시뮬레이터 메인 페이지. 잔액 요약 + 타임라인 차트 + 자금/고정비 입력 + 거래 목록.
 */
import { useRef } from "react";
import { RotateCcw } from "lucide-react";
import { BalanceSummary } from "@/components/dashboard/BalanceSummary";
import { TimelineChart } from "@/components/dashboard/TimelineChart";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { ExportButton } from "@/components/dashboard/ExportButton";
import { FundsSection } from "@/components/inputs/FundsSection";
import { MonthlyExpenseSection } from "@/components/inputs/MonthlyExpenseSection";
import { useBudgetStore } from "@/store/useBudgetStore";
import { useTransactionStore } from "@/store/useTransactionStore";

export default function HomePage() {
  const resetBudget = useBudgetStore((s) => s.reset);
  const resetTransactions = useTransactionStore((s) => s.resetToDefault);
  const snapshotRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    if (confirm("모든 입력을 기본값으로 되돌릴까요?")) {
      resetBudget();
      resetTransactions();
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            신혼 준비 마스터 플랜
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            자금과 지출을 등록하면 잔액 추이를 한눈에 볼 수 있어요.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 text-sm font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            기본값으로 리셋
          </button>
          <ExportButton targetRef={snapshotRef} />
        </div>
      </header>

      <div ref={snapshotRef} className="space-y-8">
        <BalanceSummary />
        <TimelineChart />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FundsSection />
          <MonthlyExpenseSection />
        </div>

        <TransactionList />
      </div>
    </div>
  );
}
