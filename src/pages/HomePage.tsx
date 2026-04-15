/**
 * 모듈: HomePage.tsx
 * 경로: src/pages/HomePage.tsx
 * 목적: 대시보드 — 토스 스타일 카드 중심 레이아웃.
 */
import { useRef } from "react";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { TimelineChart } from "@/components/dashboard/TimelineChart";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { ExportButton } from "@/components/dashboard/ExportButton";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useChecklistStore } from "@/store/useChecklistStore";
import { useRecurringStore } from "@/store/useRecurringStore";
import { formatNumber } from "@/utils/format";

export default function HomePage() {
  const snapshotRef = useRef<HTMLDivElement>(null);
  const { initialBalance, finalBalance, showMinimum, minimumRequired } = useBudgetSummary();
  const transactions = useTransactionStore((s) => s.items);
  const checklist = useChecklistStore((s) => s.items);
  const recurring = useRecurringStore((s) => s.items);

  // 월 수입/지출 합계 (반복 항목 기준)
  const monthlyIncome = recurring.filter((r) => r.type === "income").reduce((s, r) => s + r.amount, 0);
  const monthlyExpense = recurring.filter((r) => r.type === "expense").reduce((s, r) => s + r.amount, 0);

  // 이번 달 일회성 수입/지출
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  let oneTimeIncome = 0;
  let oneTimeExpense = 0;
  for (const t of transactions) {
    if (t.date.startsWith(thisMonth)) {
      if (t.amount >= 0) oneTimeIncome += t.amount;
      else oneTimeExpense += Math.abs(t.amount);
    }
  }
  for (const c of checklist) {
    if (c.date.startsWith(thisMonth) && c.type === "income") oneTimeIncome += c.amount;
    if (c.date.startsWith(thisMonth) && c.type === "expense") oneTimeExpense += c.amount;
  }

  // 다가오는 큰 지출 (오늘 이후, 최대 4개)
  const upcoming = transactions
    .filter((t) => t.date.slice(0, 7) >= thisMonth && t.amount < 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  return (
    <div className="space-y-5" ref={snapshotRef}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400 dark:text-gray-500">꿀배야 밥먹자</p>
        <ExportButton targetRef={snapshotRef} />
      </div>

      {/* 메인 잔액 카드 */}
      <div className="bg-gradient-to-br from-brand-500 via-brand-600 to-indigo-700 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute right-10 bottom-2 w-12 h-12 rounded-full bg-white/5" />

        <div className="flex items-center gap-1.5 text-white/70 text-xs mb-2">
          <Wallet className="w-3.5 h-3.5" />
          총 보유 자금
        </div>
        <div className="text-3xl font-bold tracking-tight mb-5">
          {formatNumber(initialBalance)}<span className="text-base font-normal ml-1">원</span>
        </div>

        <div className="flex gap-8 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowUpRight className="w-3 h-3" />
            </span>
            <div>
              <p className="text-white/50 text-[10px]">월 수입</p>
              <p className="font-semibold text-xs">+{formatNumber(monthlyIncome)}원</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowDownRight className="w-3 h-3" />
            </span>
            <div>
              <p className="text-white/50 text-[10px]">월 지출</p>
              <p className="font-semibold text-xs">-{formatNumber(monthlyExpense)}원</p>
            </div>
          </div>
        </div>
      </div>

      {/* 이번 달 + 최종잔액 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {(oneTimeIncome > 0 || oneTimeExpense > 0) && (
          <>
            <MiniCard label={`${now.getMonth() + 1}월 수입`} value={`+${formatNumber(oneTimeIncome + monthlyIncome)}`} color="text-emerald-600 dark:text-emerald-400" />
            <MiniCard label={`${now.getMonth() + 1}월 지출`} value={`-${formatNumber(oneTimeExpense + monthlyExpense)}`} color="text-rose-500" />
          </>
        )}
        {showMinimum ? (
          <MiniCard label="최소 필요 금액" value={formatNumber(minimumRequired)} color="text-amber-600 dark:text-amber-400" />
        ) : (
          <MiniCard label="최종 잔액" value={formatNumber(finalBalance)} color={finalBalance >= 0 ? "text-violet-600 dark:text-violet-400" : "text-rose-500"} />
        )}
      </div>

      {/* 차트 */}
      <TimelineChart />

      {/* 다가오는 큰 지출 */}
      {upcoming.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800/50">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">다가오는 큰 지출</h3>
          <div className="space-y-3">
            {upcoming.map((t) => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                    <ArrowDownRight className="w-4 h-4 text-rose-500" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.label}</p>
                    <p className="text-xs text-gray-400">{t.date}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-rose-500 tabular-nums">{formatNumber(t.amount)}원</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 거래 목록 */}
      <TransactionList />
    </div>
  );
}

function MiniCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/50">
      <p className="text-[11px] text-gray-400 mb-1">{label}</p>
      <p className={`text-base font-bold tabular-nums ${color}`}>{value}원</p>
    </div>
  );
}
