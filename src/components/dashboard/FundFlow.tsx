/**
 * 모듈: FundFlow.tsx
 * 경로: src/components/dashboard/FundFlow.tsx
 * 목적: 자금 운영 시나리오 4단계 흐름도.
 */
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { formatNumber } from "@/utils/format";

export function FundFlow() {
  const { input, summary } = useBudgetSummary();
  const step2Out =
    summary.selfPayAmount + input.weddingItems + input.honeymoon;

  return (
    <Card as="section" className="p-6 sm:p-8">
      <header className="mb-6 flex items-center">
        <ArrowRight className="w-5 h-5 mr-2 text-brand-500" />
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
          자금 운영 시나리오 흐름도
        </h2>
      </header>

      <div className="flex flex-col md:flex-row items-stretch justify-between gap-4">
        <Step title="초기 보유 자금" step="Step 1">
          <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {formatNumber(summary.totalFunds)}원
          </div>
        </Step>

        <Arrow />

        <Step title="- 주거 & 혼수" step="Step 2">
          <div className="text-rose-500 font-bold mb-3">
            -{formatNumber(step2Out)}원
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200">
            잔액: {formatNumber(summary.midRemain)}원
          </div>
        </Step>

        <Arrow />

        <Step title={`+ ${input.savingMonths}개월 저축`} step="Step 3" tone="emerald">
          <div className="text-emerald-600 dark:text-emerald-400 font-bold mb-3">
            +{formatNumber(summary.totalSavings)}원
          </div>
          <div className="pt-3 border-t border-emerald-200 dark:border-emerald-900 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            잔액: {formatNumber(summary.midRemain + summary.totalSavings)}원
          </div>
        </Step>

        <Arrow />

        <Step title="- 결혼식 비용" step="Final" tone="brand">
          <div className="text-rose-500 font-bold mb-3">
            -{formatNumber(input.weddingCost)}원
          </div>
          <div className="pt-3 border-t border-brand-200 dark:border-brand-900 text-lg font-extrabold text-brand-700 dark:text-brand-300">
            {formatNumber(summary.finalRemain)}원
          </div>
        </Step>
      </div>
    </Card>
  );
}

function Arrow() {
  return (
    <div className="hidden md:flex flex-col justify-center text-slate-300 dark:text-slate-600">
      <ArrowRight className="w-6 h-6" />
    </div>
  );
}

function Step({
  step,
  title,
  children,
  tone = "slate",
}: {
  step: string;
  title: string;
  children: React.ReactNode;
  tone?: "slate" | "emerald" | "brand";
}) {
  const toneCls = {
    slate: "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800",
    emerald:
      "bg-emerald-50/60 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900",
    brand: "bg-brand-50 dark:bg-brand-900/20 border-brand-100 dark:border-brand-900",
  }[tone];

  const stepColor = {
    slate: "text-slate-400",
    emerald: "text-emerald-500",
    brand: "text-brand-500",
  }[tone];

  return (
    <div className={`flex-1 rounded-2xl p-5 border ${toneCls}`}>
      <div className={`text-xs font-bold mb-2 uppercase tracking-wider ${stepColor}`}>
        {step}
      </div>
      <div className="text-slate-600 dark:text-slate-300 font-medium mb-1">
        {title}
      </div>
      {children}
    </div>
  );
}
