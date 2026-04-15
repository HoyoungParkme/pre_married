/**
 * 모듈: calculate.test.ts
 * 경로: src/utils/calculate.test.ts
 * 목적: buildTimeline / calcMonthlyNet 기본 회귀 테스트.
 */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { buildTimeline, calcMonthlyNet } from "./calculate";
import { DEFAULT_BUDGET } from "@/constants/defaults";
import type { Transaction } from "@/types/budget";

// buildTimeline은 getCurrentMonth()로 현재 월을 기준으로 동작하므로
// 날짜를 고정하여 결정론적 테스트를 만든다
const FIXED_NOW = new Date("2026-04-01T00:00:00Z");

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

// 테스트용 거래 헬퍼
function makeTx(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: "t-test",
    date: "2026-06",
    label: "테스트 지출",
    amount: -1_000_000,
    category: "기타",
    ...overrides,
  };
}

describe("calcMonthlyNet", () => {
  it("저축액에서 고정비 합계를 뺀 값을 반환한다", () => {
    // Arrange
    const input = DEFAULT_BUDGET;
    // monthlySavings=1,500,000 / rent=500,000 maint=65,000 util=140,000 food=500,000
    // Net = 1,500,000 - 1,205,000 = 295,000

    // Act
    const net = calcMonthlyNet(input);

    // Assert
    expect(net).toBe(295_000);
  });

  it("고정비가 저축액보다 크면 음수가 된다", () => {
    // Arrange
    const input = { ...DEFAULT_BUDGET, monthlySavings: 500_000 };
    // Net = 500,000 - 1,205,000 = -705,000

    // Act
    const net = calcMonthlyNet(input);

    // Assert
    expect(net).toBeLessThan(0);
    expect(net).toBe(-705_000);
  });

  it("고정비가 없으면 저축액 전체가 순수입이 된다", () => {
    // Arrange
    const input = {
      ...DEFAULT_BUDGET,
      monthlyRent: 0,
      monthlyMaint: 0,
      monthlyUtil: 0,
      monthlyFood: 0,
    };

    // Act
    const net = calcMonthlyNet(input);

    // Assert
    expect(net).toBe(DEFAULT_BUDGET.monthlySavings);
  });
});

describe("buildTimeline", () => {
  it("거래가 없으면 최소 15개 포인트(0~14개월)를 반환한다", () => {
    // Arrange: 고정 날짜 2026-04 기준, 거래 없음
    // 종료월: addMonths("2026-04", 11) = "2027-03", +3 = "2027-06"
    // totalMonths = monthDiff("2026-04", "2027-06") = 14
    // 루프 i=0..14 → 15개

    // Act
    const series = buildTimeline(DEFAULT_BUDGET, []);

    // Assert
    expect(series).toHaveLength(15);
  });

  it("시리즈의 첫 번째 balance는 savingsAccount + extraFunds와 같다", () => {
    // Arrange
    const startBalance = DEFAULT_BUDGET.savingsAccount + DEFAULT_BUDGET.extraFunds;
    // 40,000,000 + 50,000,000 = 90,000,000

    // Act
    const series = buildTimeline(DEFAULT_BUDGET, []);

    // Assert
    expect(series[0].balance).toBe(startBalance);
  });

  it("두 번째 달부터 월 순수입이 누적된다", () => {
    // Arrange
    const startBalance = DEFAULT_BUDGET.savingsAccount + DEFAULT_BUDGET.extraFunds;
    const monthlyNet = calcMonthlyNet(DEFAULT_BUDGET);

    // Act
    const series = buildTimeline(DEFAULT_BUDGET, []);

    // Assert
    expect(series[1].balance).toBe(startBalance + monthlyNet);
    expect(series[2].balance).toBe(startBalance + monthlyNet * 2);
  });

  it("첫 번째 포인트의 month는 현재 월(2026-04)이다", () => {
    // Act
    const series = buildTimeline(DEFAULT_BUDGET, []);

    // Assert
    expect(series[0].month).toBe("2026-04");
  });

  it("label은 'YYYY.MM' 형식이다", () => {
    // Act
    const series = buildTimeline(DEFAULT_BUDGET, []);

    // Assert
    expect(series[0].label).toBe("2026.04");
  });

  it("거래 금액이 해당 월 balance에 반영된다", () => {
    // Arrange: 2026-05에 -1,000,000 지출
    const tx = makeTx({ date: "2026-05", amount: -1_000_000 });
    const startBalance = DEFAULT_BUDGET.savingsAccount + DEFAULT_BUDGET.extraFunds;
    const monthlyNet = calcMonthlyNet(DEFAULT_BUDGET);
    // 2026-05 = i=1: balance = startBalance + monthlyNet + (-1,000,000)

    // Act
    const series = buildTimeline(DEFAULT_BUDGET, [tx]);

    // Assert
    const may = series.find((s) => s.month === "2026-05");
    expect(may).toBeDefined();
    expect(may!.balance).toBe(startBalance + monthlyNet - 1_000_000);
  });

  it("같은 달에 거래가 여러 개면 합산되어 반영된다", () => {
    // Arrange
    const tx1 = makeTx({ id: "t1", date: "2026-05", amount: -500_000 });
    const tx2 = makeTx({ id: "t2", date: "2026-05", amount: -300_000 });
    const startBalance = DEFAULT_BUDGET.savingsAccount + DEFAULT_BUDGET.extraFunds;
    const monthlyNet = calcMonthlyNet(DEFAULT_BUDGET);

    // Act
    const series = buildTimeline(DEFAULT_BUDGET, [tx1, tx2]);

    // Assert
    const may = series.find((s) => s.month === "2026-05");
    expect(may!.balance).toBe(startBalance + monthlyNet - 800_000);
  });

  it("마지막 거래월이 기본 종료월보다 늦으면 시리즈가 더 길어진다", () => {
    // Arrange: 거래 없을 때 종료 = 2027-06 (14개월 후), 15개 포인트
    // 2028-01에 거래 추가 → 종료 = 2028-04, totalMonths = monthDiff("2026-04","2028-04") = 24
    // 25개 포인트가 되어야 한다
    const lateTx = makeTx({ id: "t-late", date: "2028-01", amount: -1_000_000 });

    // Act
    const series = buildTimeline(DEFAULT_BUDGET, [lateTx]);

    // Assert: 2026-04 ~ 2028-04 = 24개월 → 25개 포인트
    expect(series.length).toBeGreaterThan(15);
    expect(series[series.length - 1].month).toBe("2028-04");
  });

  it("거래가 없어도 고정비가 크면 잔액이 음수가 될 수 있다", () => {
    // Arrange: 저축 없이 고정비만 있는 극단적 케이스
    const input = { ...DEFAULT_BUDGET, monthlySavings: 0 };

    // Act
    const series = buildTimeline(input, []);

    // Assert: 두 번째 달부터 잔액이 줄어든다
    expect(series[1].balance).toBeLessThan(series[0].balance);
  });
});
