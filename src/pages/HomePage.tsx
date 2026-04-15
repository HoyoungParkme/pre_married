/**
 * 모듈: HomePage.tsx
 * 경로: src/pages/HomePage.tsx
 * 목적: 시뮬레이터 메인 페이지. 대시보드 + 입력 섹션 + 차트 + 결론.
 */
import { useRef } from "react";
import { RotateCcw } from "lucide-react";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { FundFlow } from "@/components/dashboard/FundFlow";
import { FundChart } from "@/components/dashboard/FundChart";
import { Conclusion } from "@/components/dashboard/Conclusion";
import { ExportButton } from "@/components/dashboard/ExportButton";
import { HousingSection } from "@/components/inputs/HousingSection";
import { SavingsLivingSection } from "@/components/inputs/SavingsLivingSection";
import { WeddingSection } from "@/components/inputs/WeddingSection";
import { useBudgetStore } from "@/store/useBudgetStore";

export default function HomePage() {
  const reset = useBudgetStore((s) => s.reset);
  const snapshotRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    if (confirm("입력한 값을 기본값으로 되돌릴까요?")) reset();
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            신혼 준비 마스터 플랜
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            자금 흐름과 일정을 실시간으로 시뮬레이션해 보세요.
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
        <SummaryCards />
        <FundFlow />
        <FundChart />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HousingSection />
          <SavingsLivingSection />
          <WeddingSection />
        </div>

        <Conclusion />
      </div>
    </div>
  );
}
