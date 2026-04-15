/**
 * 모듈: calculate.ts
 * 경로: src/utils/calculate.ts
 * 목적: 타임라인 기반 월별 잔액을 계산한다.
 *
 * 주요 기능:
 *  - buildTimeline: 자금/고정비/거래 목록으로 월별 잔액 시계열 생성
 *
 * 주요 의존성: types/budget
 */
import type { BudgetInput, Transaction, ChecklistItem, MonthlyBalance } from "@/types/budget";

/**
 * 현재 월 문자열 반환 (YYYY-MM)
 */
function getCurrentMonth(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * YYYY-MM 형식의 월을 N개월 뒤로 이동
 */
function addMonths(ym: string, n: number): string {
  const [y, m] = ym.split("-").map(Number);
  const total = y * 12 + (m - 1) + n;
  const newY = Math.floor(total / 12);
  const newM = (total % 12) + 1;
  return `${newY}-${String(newM).padStart(2, "0")}`;
}

/**
 * 두 YYYY-MM 사이의 월 수 (end - start)
 */
function monthDiff(start: string, end: string): number {
  const [sy, sm] = start.split("-").map(Number);
  const [ey, em] = end.split("-").map(Number);
  return (ey - sy) * 12 + (em - sm);
}

/**
 * YYYY-MM 형식의 월을 한국어 라벨로 변환
 */
function formatMonthLabel(ym: string): string {
  const [y, m] = ym.split("-");
  return `${y}.${m}`;
}

/**
 * 타임라인 기반 월별 잔액 시계열을 생성한다.
 *
 * Args:
 *   input: 자금 + 월 고정비
 *   transactions: 일회성 거래 목록
 *
 * Returns:
 *   월별 잔액 배열 (시작월 ~ 마지막 거래월 + 3개월, 최소 12개월)
 */
export function buildTimeline(
  input: BudgetInput,
  transactions: Transaction[],
  checklistItems: ChecklistItem[] = [],
): MonthlyBalance[] {
  const startMonth = getCurrentMonth();
  const startBalance = input.savingsAccount + input.extraFunds;
  const monthlyNet =
    input.monthlySavings -
    (input.monthlyRent + input.monthlyMaint + input.monthlyUtil + input.monthlyFood);

  // 체크리스트의 income/expense 항목을 거래로 변환 (YYYY-MM-DD → YYYY-MM)
  const checklistFinancial = checklistItems
    .filter((c) => c.type !== "memo" && c.amount > 0)
    .map((c) => ({
      date: c.date.slice(0, 7), // YYYY-MM-DD → YYYY-MM
      amount: c.type === "expense" ? -c.amount : c.amount,
    }));

  // 종료월 결정: 마지막 거래/체크리스트월 + 3개월, 최소 12개월
  let endMonth = addMonths(startMonth, 11);
  for (const t of transactions) {
    if (t.date > endMonth) endMonth = t.date;
  }
  for (const c of checklistFinancial) {
    if (c.date > endMonth) endMonth = c.date;
  }
  endMonth = addMonths(endMonth, 3);

  const totalMonths = monthDiff(startMonth, endMonth);

  // 거래 + 체크리스트 금융 항목을 월별로 그룹핑
  const txByMonth: Record<string, number> = {};
  for (const t of transactions) {
    txByMonth[t.date] = (txByMonth[t.date] ?? 0) + t.amount;
  }
  for (const c of checklistFinancial) {
    txByMonth[c.date] = (txByMonth[c.date] ?? 0) + c.amount;
  }

  const series: MonthlyBalance[] = [];
  let balance = startBalance;

  for (let i = 0; i <= totalMonths; i++) {
    const month = addMonths(startMonth, i);

    // 첫 달은 초기 잔액만, 이후부터 월 순수입 적용
    if (i > 0) {
      balance += monthlyNet;
    }

    // 해당 월 일회성 거래 적용
    if (txByMonth[month]) {
      balance += txByMonth[month];
    }

    series.push({
      month,
      balance,
      label: formatMonthLabel(month),
    });
  }

  return series;
}

/**
 * 월 순수입 계산 (저축 - 고정비)
 */
export function calcMonthlyNet(input: BudgetInput): number {
  return (
    input.monthlySavings -
    (input.monthlyRent + input.monthlyMaint + input.monthlyUtil + input.monthlyFood)
  );
}

/**
 * 최소 필요 금액 계산.
 * 모든 지출(거래 + 체크리스트 expense)의 합계를 반환한다.
 */
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
