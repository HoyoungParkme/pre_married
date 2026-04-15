/**
 * 모듈: BalanceSummary.tsx
 * 경로: src/components/dashboard/BalanceSummary.tsx
 * 목적: 초기 자금, 월 순수입, 최종 잔액 요약 카드.
 */
import { Wallet, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { formatNumber } from "@/utils/format";

export function BalanceSummary() {
  const { initialBalance, monthlyNet, finalBalance, minimumRequired, showMinimum } =
    useBudgetSummary();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <SummaryCard
        icon={<Wallet className="w-4 h-4" />}
        label="초기 자금"
        value={formatNumber(initialBalance)}
        gradient="from-blue-500 to-indigo-600"
      />

      <SummaryCard
        icon={monthlyNet >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        label="월 순수입"
        value={`${monthlyNet >= 0 ? "+" : ""}${formatNumber(monthlyNet)}`}
        gradient={monthlyNet >= 0 ? "from-emerald-500 to-teal-600" : "from-rose-500 to-red-600"}
      />

      {showMinimum ? (
        <SummaryCard
          icon={<AlertTriangle className="w-4 h-4" />}
          label="최소 필요 금액"
          value={formatNumber(minimumRequired)}
          gradient="from-amber-500 to-orange-600"
          sub="달력 + 거래 전체 지출 합계"
        />
      ) : (
        <SummaryCard
          icon={finalBalance >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          label="최종 잔액"
          value={formatNumber(finalBalance)}
          gradient={finalBalance >= 0 ? "from-violet-500 to-purple-600" : "from-rose-500 to-red-600"}
        />
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  gradient,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  gradient: string;
  sub?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white`}>
      <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full bg-white/10" />
      <div className="absolute -right-1 -bottom-4 w-10 h-10 rounded-full bg-white/5" />
      <div className="flex items-center gap-1.5 text-white/70 text-xs font-medium mb-2">
        {icon}
        {label}
      </div>
      <div className="text-xl font-bold tracking-tight">
        {value}<span className="text-sm font-normal ml-0.5">원</span>
      </div>
      {sub && <p className="text-[10px] text-white/60 mt-1">{sub}</p>}
    </div>
  );
}
