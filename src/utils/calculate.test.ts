/**
 * 모듈: calculate.test.ts
 * 경로: src/utils/calculate.test.ts
 * 목적: computeSummary / buildMonthlyBalanceSeries 기본 회귀 테스트.
 */
import { describe, expect, it } from "vitest";
import { buildMonthlyBalanceSeries, computeSummary } from "./calculate";
import { DEFAULT_BUDGET } from "@/constants/defaults";

describe("computeSummary", () => {
  it("기본 입력값으로 sample.html과 동일한 값을 계산한다", () => {
    const s = computeSummary(DEFAULT_BUDGET);
    expect(s.totalFunds).toBe(90_000_000);
    expect(s.selfPayAmount).toBe(32_250_000);
    expect(s.initialRemain).toBe(57_750_000);
    expect(s.totalLivingCost).toBe(1_205_000);
    expect(s.totalSavings).toBe(16_500_000);
    // midRemain = 57,750,000 - 5,000,000 - 5,500,000 = 47,250,000
    expect(s.midRemain).toBe(47_250_000);
    // finalRemain = 47,250,000 - 15,000,000 + 16,500,000 = 48,750,000
    expect(s.finalRemain).toBe(48_750_000);
  });

  it("결혼식 비용이 저축+초기잔액을 넘으면 음수가 된다", () => {
    const s = computeSummary({ ...DEFAULT_BUDGET, weddingCost: 100_000_000 });
    expect(s.finalRemain).toBeLessThan(0);
  });
});

describe("buildMonthlyBalanceSeries", () => {
  it("0개월차 시작값은 midRemain이고 마지막은 finalRemain이다", () => {
    const series = buildMonthlyBalanceSeries(DEFAULT_BUDGET);
    const summary = computeSummary(DEFAULT_BUDGET);
    expect(series[0].balance).toBe(summary.midRemain);
    expect(series[series.length - 1].balance).toBe(summary.finalRemain);
    // 길이: 0 + 저축기간 + 마지막
    expect(series).toHaveLength(DEFAULT_BUDGET.savingMonths + 2);
  });
});
