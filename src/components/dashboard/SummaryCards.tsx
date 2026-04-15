/**
 * 모듈: SummaryCards.tsx
 * 경로: src/components/dashboard/SummaryCards.tsx
 * 목적: 대시보드 상단 4개 요약 카드 (초기 자금 / 예상 저축 / 월 생활비 / 최종 잔액).
 */
import { Home, PiggyBank, TrendingUp, Wallet } from "lucide-react";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { formatNumber } from "@/utils/format";
import { Card } from "@/components/ui/Card";

export function SummaryCards() {
  const { summary } = useBudgetSummary();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6">
        <div className="flex items-center text-slate-500 dark:text-slate-400 mb-3">
          <Wallet className="w-5 h-5 mr-2" />
          <span className="font-semibold text-sm">초기 총 자금</span>
        </div>
        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {formatNumber(summary.totalFunds)}
          <span className="text-base font-medium text-slate-500 ml-1">원</span>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center text-slate-500 dark:text-slate-400 mb-3">
          <PiggyBank className="w-5 h-5 mr-2 text-emerald-500" />
          <span className="font-semibold text-sm">결혼 전 예상 저축</span>
        </div>
        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          +{formatNumber(summary.totalSavings)}
          <span className="text-base font-medium text-emerald-500/70 ml-1">원</span>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center text-slate-500 dark:text-slate-400 mb-3">
          <Home className="w-5 h-5 mr-2" />
          <span className="font-semibold text-sm">월 고정 생활비</span>
        </div>
        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {formatNumber(summary.totalLivingCost)}
          <span className="text-base font-medium text-slate-500 ml-1">원</span>
        </div>
      </Card>

      <div className="p-6 rounded-3xl shadow-card border border-brand-200 bg-gradient-to-br from-brand-500 to-brand-600 text-white hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center text-brand-100 mb-3">
          <TrendingUp className="w-5 h-5 mr-2" />
          <span className="font-semibold text-sm">결혼 후 최종 잔액</span>
        </div>
        <div className="text-3xl font-extrabold">
          {formatNumber(summary.finalRemain)}
          <span className="text-lg font-medium text-brand-200 ml-1">원</span>
        </div>
      </div>
    </div>
  );
}
