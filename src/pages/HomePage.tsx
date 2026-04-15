/**
 * 모듈: HomePage.tsx
 * 경로: src/pages/HomePage.tsx
 * 목적: 대시보드 메인 페이지 — 토스/뱅크샐러드 스타일.
 */
import { useRef } from "react";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { BalanceSummary } from "@/components/dashboard/BalanceSummary";
import { TimelineChart } from "@/components/dashboard/TimelineChart";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { ExportButton } from "@/components/dashboard/ExportButton";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useChecklistStore } from "@/store/useChecklistStore";
import { formatNumber } from "@/utils/format";

export default function HomePage() {
  const snapshotRef = useRef<HTMLDivElement>(null);
  const { initialBalance, monthlyNet } = useBudgetSummary();
  const transactions = useTransactionStore((s) => s.items);
  const checklist = useChecklistStore((s) => s.items);

  // 이번 달 지출/수입 요약
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const thisMonthTx = transactions.filter((t) => t.date === thisMonth);
  const thisMonthChecklist = checklist.filter(
    (c) => c.date.startsWith(thisMonth) && c.type !== "memo",
  );

  let monthExpense = 0;
  let monthIncome = 0;
  for (const t of thisMonthTx) {
    if (t.amount < 0) monthExpense += Math.abs(t.amount);
    else monthIncome += t.amount;
  }
  for (const c of thisMonthChecklist) {
    if (c.type === "expense") monthExpense += c.amount;
    else if (c.type === "income") monthIncome += c.amount;
  }

  const upcomingExpenses = transactions
    .filter((t) => t.date >= thisMonth && t.amount < 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  return (
    <div className="space-y-6" ref={snapshotRef}>
      {/* 인사 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">안녕하세요</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">
            우리의 자금 현황
          </h1>
        </div>
        <ExportButton targetRef={snapshotRef} />
      </div>

      {/* 메인 잔액 카드 */}
      <div className="bg-gradient-to-br from-brand-500 via-brand-600 to-rose-700 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute right-8 bottom-4 w-16 h-16 rounded-full bg-white/5" />

        <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
          <Wallet className="w-4 h-4" />
          총 보유 자금
        </div>
        <div className="text-3xl font-bold tracking-tight mb-4">
          {formatNumber(initialBalance)}<span className="text-lg ml-1">원</span>
        </div>

        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="text-white/60 text-xs block">월 수입</span>
              <span className="font-semibold">+{formatNumber(monthlyNet > 0 ? monthlyNet : 0)}원</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="text-white/60 text-xs block">월 지출</span>
              <span className="font-semibold">-{formatNumber(monthlyNet < 0 ? Math.abs(monthlyNet) : 0)}원</span>
            </div>
          </div>
        </div>
      </div>

      {/* 이번 달 요약 */}
      {(monthExpense > 0 || monthIncome > 0) && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/50">
            <p className="text-xs text-gray-400 mb-1">{now.getMonth() + 1}월 예정 수입</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              +{formatNumber(monthIncome)}원
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/50">
            <p className="text-xs text-gray-400 mb-1">{now.getMonth() + 1}월 예정 지출</p>
            <p className="text-lg font-bold text-rose-500">
              -{formatNumber(monthExpense)}원
            </p>
          </div>
        </div>
      )}

      {/* 요약 카드 3개 */}
      <BalanceSummary />

      {/* 차트 */}
      <TimelineChart />

      {/* 다가오는 지출 미리보기 */}
      {upcomingExpenses.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800/50">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
            다가오는 큰 지출
          </h3>
          <div className="space-y-3">
            {upcomingExpenses.map((t) => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center">
                    <ArrowDownRight className="w-4 h-4 text-rose-500" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.label}</p>
                    <p className="text-xs text-gray-400">{t.date}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-rose-500">
                  {formatNumber(t.amount)}원
                </span>
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
