/**
 * 모듈: BalanceSummary.tsx
 * 경로: src/components/dashboard/BalanceSummary.tsx
 * 목적: 초기 자금, 월 순수입, 최종 잔액(또는 최소 필요 금액) 요약 카드.
 */
import { Card } from "@/components/ui/Card";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { formatNumber } from "@/utils/format";

export function BalanceSummary() {
  const { initialBalance, monthlyNet, finalBalance, minimumRequired, showMinimum } =
    useBudgetSummary();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="p-6">
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
          초기 자금
        </div>
        <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
          {formatNumber(initialBalance)}원
        </div>
      </Card>

      <Card className="p-6">
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
          월 순수입
        </div>
        <div
          className={`text-xl font-bold ${
            monthlyNet >= 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-500"
          }`}
        >
          {monthlyNet >= 0 ? "+" : ""}
          {formatNumber(monthlyNet)}원
        </div>
      </Card>

      {showMinimum ? (
        <Card className="p-6 border-amber-200 dark:border-amber-800">
          <div className="text-sm text-amber-600 dark:text-amber-400 mb-1">
            최소 필요 금액
          </div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
            {formatNumber(minimumRequired)}원
          </div>
          <p className="text-xs text-slate-400 mt-1">
            달력 + 거래의 전체 지출 합계
          </p>
        </Card>
      ) : (
        <Card
          className={`p-6 ${
            finalBalance >= 0 ? "border-emerald-200" : "border-rose-200"
          }`}
        >
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            최종 잔액
          </div>
          <div
            className={`text-xl font-bold ${
              finalBalance >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-500"
            }`}
          >
            {formatNumber(finalBalance)}원
          </div>
        </Card>
      )}
    </div>
  );
}
