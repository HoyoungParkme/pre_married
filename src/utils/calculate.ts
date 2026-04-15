/**
 * 모듈: calculate.ts
 * 경로: src/utils/calculate.ts
 * 목적: 타임라인 기반 월별 잔액을 계산한다.
 *
 * 주요 의존성: types/budget
 */
import type { BudgetInput, RecurringItem, Transaction, ChecklistItem, MonthlyBalance } from "@/types/budget";

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function addMonths(ym: string, n: number): string {
  const [y, m] = ym.split("-").map(Number);
  const total = y * 12 + (m - 1) + n;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`;
}

function monthDiff(start: string, end: string): number {
  const [sy, sm] = start.split("-").map(Number);
  const [ey, em] = end.split("-").map(Number);
  return (ey - sy) * 12 + (em - sm);
}

function formatMonthLabel(ym: string): string {
  const [y, m] = ym.split("-");
  return `${y}.${m}`;
}

/**
 * 타임라인 기반 월별 잔액 시계열을 생성한다.
 */
export function buildTimeline(
  input: BudgetInput,
  recurring: RecurringItem[],
  transactions: Transaction[],
  checklistItems: ChecklistItem[] = [],
): MonthlyBalance[] {
  const startMonth = getCurrentMonth();
  const startBalance = input.savingsAccount + input.extraFunds;

  // 반복 항목에서 월 순수입 계산
  const monthlyIncome = recurring
    .filter((r) => r.type === "income")
    .reduce((sum, r) => sum + r.amount, 0);
  const monthlyExpenseTotal = recurring
    .filter((r) => r.type === "expense")
    .reduce((sum, r) => sum + r.amount, 0);

  // 체크리스트 금융 항목
  const checklistFinancial = checklistItems
    .filter((c) => c.type !== "memo" && c.amount > 0)
    .map((c) => ({
      date: c.date.slice(0, 7),
      amount: c.type === "expense" ? -c.amount : c.amount,
    }));

  // 종료월 결정
  let endMonth = addMonths(startMonth, 11);
  for (const t of transactions) {
    if (t.date > endMonth) endMonth = t.date;
  }
  for (const c of checklistFinancial) {
    if (c.date > endMonth) endMonth = c.date;
  }
  endMonth = addMonths(endMonth, 3);

  const totalMonths = monthDiff(startMonth, endMonth);

  // 월별 일회성 수입/지출 그룹핑
  const incomeByMonth: Record<string, number> = {};
  const expenseByMonth: Record<string, number> = {};

  for (const t of transactions) {
    if (t.amount >= 0) incomeByMonth[t.date] = (incomeByMonth[t.date] ?? 0) + t.amount;
    else expenseByMonth[t.date] = (expenseByMonth[t.date] ?? 0) + Math.abs(t.amount);
  }
  for (const c of checklistFinancial) {
    if (c.amount >= 0) incomeByMonth[c.date] = (incomeByMonth[c.date] ?? 0) + c.amount;
    else expenseByMonth[c.date] = (expenseByMonth[c.date] ?? 0) + Math.abs(c.amount);
  }

  const series: MonthlyBalance[] = [];
  let balance = startBalance;

  for (let i = 0; i <= totalMonths; i++) {
    const month = addMonths(startMonth, i);
    let mIncome = 0;
    let mExpense = 0;

    if (i > 0) {
      mIncome += monthlyIncome;
      mExpense += monthlyExpenseTotal;
    }

    mIncome += incomeByMonth[month] ?? 0;
    mExpense += expenseByMonth[month] ?? 0;
    balance += mIncome - mExpense;

    series.push({
      month,
      balance,
      income: mIncome,
      expense: mExpense,
      label: formatMonthLabel(month),
    });
  }

  return series;
}

/** 월 순수입 계산 (반복 수입 - 반복 지출) */
export function calcMonthlyNet(recurring: RecurringItem[]): number {
  return recurring.reduce((sum, r) => sum + (r.type === "income" ? r.amount : -r.amount), 0);
}

/** 최소 필요 금액 (모든 지출 합산) */
export function calcMinimumRequired(
  transactions: Transaction[],
  checklistItems: ChecklistItem[],
): number {
  let total = 0;
  for (const t of transactions) {
    if (t.amount < 0) total += Math.abs(t.amount);
  }
  for (const c of checklistItems) {
    if (c.type === "expense" && c.amount > 0) total += c.amount;
  }
  return total;
}
