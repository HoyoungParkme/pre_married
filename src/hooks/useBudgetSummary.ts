/**
 * 모듈: useBudgetSummary.ts
 * 경로: src/hooks/useBudgetSummary.ts
 * 목적: 자금/거래로부터 타임라인 시계열과 요약값을 메모이즈해 반환한다.
 */
import { useMemo } from "react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { buildTimeline, calcMonthlyNet } from "@/utils/calculate";

export function useBudgetSummary() {
  const input = useBudgetStore((s) => s.input);
  const transactions = useTransactionStore((s) => s.items);

  const timeline = useMemo(
    () => buildTimeline(input, transactions),
    [input, transactions],
  );

  const monthlyNet = useMemo(() => calcMonthlyNet(input), [input]);

  const initialBalance = input.savingsAccount + input.extraFunds;
  const finalBalance = timeline.length > 0 ? timeline[timeline.length - 1].balance : initialBalance;

  return { input, timeline, monthlyNet, initialBalance, finalBalance };
}
