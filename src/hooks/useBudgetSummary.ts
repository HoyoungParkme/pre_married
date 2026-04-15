/**
 * 모듈: useBudgetSummary.ts
 * 경로: src/hooks/useBudgetSummary.ts
 * 목적: 자금/반복/거래/체크리스트로부터 타임라인과 요약값을 메모이즈.
 */
import { useMemo } from "react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { useRecurringStore } from "@/store/useRecurringStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useChecklistStore } from "@/store/useChecklistStore";
import { buildTimeline, calcMonthlyNet, calcMinimumRequired } from "@/utils/calculate";

export function useBudgetSummary() {
  const input = useBudgetStore((s) => s.input);
  const recurring = useRecurringStore((s) => s.items);
  const transactions = useTransactionStore((s) => s.items);
  const checklistItems = useChecklistStore((s) => s.items);

  const timeline = useMemo(
    () => buildTimeline(input, recurring, transactions, checklistItems),
    [input, recurring, transactions, checklistItems],
  );

  const monthlyNet = useMemo(() => calcMonthlyNet(recurring), [recurring]);
  const minimumRequired = useMemo(
    () => calcMinimumRequired(transactions, checklistItems),
    [transactions, checklistItems],
  );

  const initialBalance = input.savingsAccount + input.extraFunds;
  const finalBalance = timeline.length > 0 ? timeline[timeline.length - 1].balance : initialBalance;
  const showMinimum = initialBalance === 0;

  return { input, timeline, monthlyNet, initialBalance, finalBalance, minimumRequired, showMinimum };
}
