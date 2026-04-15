/**
 * 모듈: BalanceSummary.tsx
 * 경로: src/components/dashboard/BalanceSummary.tsx
 * 목적: 초기 자금, 월 순수입, 최종 잔액(또는 최소 필요 금액) 요약 카드.
 */
import { Wallet, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { formatNumber } from "@/utils/format";

export function BalanceSummary() {
  const { initialBalance, monthlyNet, finalBalance, minimumRequired, showMinimum } =
    useBudgetSummary();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 초기 자금 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
        <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
        <div className="flex items-center gap-2 text-blue-100 text-sm mb-2">
          <Wallet className="w-4 h-4" />
          초기 자금
        </div>
        <div className="text-2xl font-bold">
          {formatNumber(initialBalance)}
          <span className="text-lg font-normal ml-0.5">원</span>
        </div>
      </div>

      {/* 월 순수입 */}
      <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${
        monthlyNet >= 0
          ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
          : "bg-gradient-to-br from-rose-500 to-rose-600"
      }`}>
        <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
        <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
          {monthlyNet >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          월 순수입
        </div>
        <div className="text-2xl font-bold">
          {monthlyNet >= 0 ? "+" : ""}
          {formatNumber(monthlyNet)}
          <span className="text-lg font-normal ml-0.5">원</span>
        </div>
      </div>

      {/* 최종 잔액 또는 최소 필요 금액 */}
      {showMinimum ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-6 text-white shadow-lg">
          <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
          <div className="flex items-center gap-2 text-amber-100 text-sm mb-2">
            <AlertTriangle className="w-4 h-4" />
            최소 필요 금액
          </div>
          <div className="text-2xl font-bold">
            {formatNumber(minimumRequired)}
            <span className="text-lg font-normal ml-0.5">원</span>
          </div>
          <p className="text-xs text-amber-100 mt-1">
            달력 + 거래 전체 지출 합계
          </p>
        </div>
      ) : (
        <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${
          finalBalance >= 0
            ? "bg-gradient-to-br from-violet-500 to-violet-600"
            : "bg-gradient-to-br from-rose-500 to-rose-600"
        }`}>
          <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            {finalBalance >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            최종 잔액
          </div>
          <div className="text-2xl font-bold">
            {formatNumber(finalBalance)}
            <span className="text-lg font-normal ml-0.5">원</span>
          </div>
        </div>
      )}
    </div>
  );
}
