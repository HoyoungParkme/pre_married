/**
 * 모듈: calculate.ts
 * 경로: src/utils/calculate.ts
 * 목적: 예산 입력으로부터 요약 지표(자금 흐름 4단계)를 계산한다.
 */
import type { BudgetInput, BudgetSummary } from "@/types/budget";

/**
 * 예산 입력으로부터 요약값을 계산한다.
 *
 * 자금 흐름:
 *   Step 1: totalFunds = baseFunds + extraFunds
 *   Step 2: initialRemain = totalFunds - selfPayAmount(= jeonseTotal - lhSupportAmount)
 *           midRemain = initialRemain - weddingItems - honeymoon
 *   Step 3: totalSavings = monthlySavings * savingMonths
 *   Final: finalRemain = midRemain - weddingCost + totalSavings
 */
export function computeSummary(input: BudgetInput): BudgetSummary {
  const totalFunds = input.baseFunds + input.extraFunds;
  const selfPayAmount = input.jeonseTotal - input.lhSupportAmount;
  const initialRemain = totalFunds - selfPayAmount;
  const totalLivingCost =
    input.livingRent + input.livingMaint + input.livingUtil + input.livingFood;
  const totalSavings = input.monthlySavings * input.savingMonths;
  const midRemain = initialRemain - input.weddingItems - input.honeymoon;
  const finalRemain = midRemain - input.weddingCost + totalSavings;

  return {
    totalFunds,
    selfPayAmount,
    initialRemain,
    totalLivingCost,
    totalSavings,
    midRemain,
    finalRemain,
  };
}

/**
 * 월별 누적 잔액 시계열을 생성한다 (Recharts용).
 *
 * 흐름:
 *   - 0개월차: 초기 잔액(midRemain, 이미 주거/혼수/신행 차감)
 *   - 1~savingMonths개월차: 월 저축 누적 증가
 *   - 마지막 달에 결혼식 비용 차감 → finalRemain
 */
export function buildMonthlyBalanceSeries(
  input: BudgetInput,
): Array<{ month: number; balance: number; label: string }> {
  const summary = computeSummary(input);
  const series: Array<{ month: number; balance: number; label: string }> = [];

  series.push({
    month: 0,
    balance: summary.midRemain,
    label: "혼수·신행 후",
  });

  for (let m = 1; m <= input.savingMonths; m += 1) {
    series.push({
      month: m,
      balance: summary.midRemain + input.monthlySavings * m,
      label: `${m}개월차`,
    });
  }

  series.push({
    month: input.savingMonths + 1,
    balance: summary.finalRemain,
    label: "결혼식 후",
  });

  return series;
}
