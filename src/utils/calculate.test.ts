/**
 * 모듈: calculate.test.ts
 * 경로: src/utils/calculate.test.ts
 * 목적: buildTimeline / calcMonthlyNet 기본 회귀 테스트.
 *        RecurringItem[] 도입에 따라 시그니처 변경 반영.
 */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { buildTimeline, calcMonthlyNet } from "./calculate";
import { DEFAULT_BUDGET, DEFAULT_RECURRING } from "@/constants/defaults";
import type { RecurringItem, Transaction } from "@/types/budget";

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

// 테스트용 RecurringItem 헬퍼
function makeRecurring(overrides: Partial<RecurringItem> = {}): RecurringItem {
  return {
    id: "r-test",
    label: "테스트 항목",
    amount: 100_000,
    day: 1,
    type: "expense",
    ...overrides,
  };
}

describe("calcMonthlyNet", () => {
  it("DEFAULT_RECURRING으로 순수입을 반환한다", () => {
    // Arrange
    // income: 1,500,000 / expense: 500,000 + 65,000 + 140,000 + 500,000 = 1,205,000
    // Net = 1,500,000 - 1,205,000 = 295,000

    // Act
    const net = calcMonthlyNet(DEFAULT_RECURRING);

    // Assert
    expect(net).toBe(295_000);
  });

  it("지출 합계가 수입보다 크면 음수가 된다", () => {
    // Arrange: 수입 500,000 / 지출 1,205,000 → net = -705,000
    const recurring: RecurringItem[] = [
      makeRecurring({ id: "r-inc", label: "저축", amount: 500_000, type: "income" }),
      ...DEFAULT_RECURRING.filter((r) => r.type === "expense"),
    ];

    // Act
    const net = calcMonthlyNet(recurring);

    // Assert
    expect(net).toBeLessThan(0);
    expect(net).toBe(-705_000);
  });

  it("반복 항목이 없으면 0을 반환한다", () => {
    // Act
    const net = calcMonthlyNet([]);

    // Assert
    expect(net).toBe(0);
  });

  it("수입 항목만 있으면 수입 합계가 그대로 반환된다", () => {
    // Arrange
    const recurring: RecurringItem[] = [
      makeRecurring({ id: "r1", amount: 1_000_000, type: "income" }),
      makeRecurring({ id: "r2", amount: 500_000, type: "income" }),
    ];

    // Act
    const net = calcMonthlyNet(recurring);

    // Assert
    expect(net).toBe(1_500_000);
  });

  it("지출 항목만 있으면 음수가 된다", () => {
    // Arrange
    const recurring: RecurringItem[] = [
      makeRecurring({ id: "r1", amount: 300_000, type: "expense" }),
      makeRecurring({ id: "r2", amount: 200_000, type: "expense" }),
    ];

    // Act
    const net = calcMonthlyNet(recurring);

    // Assert
    expect(net).toBe(-500_000);
  });
});

describe("buildTimeline", () => {
  it("거래가 없으면 최소 15개 포인트(0~14개월)를 반환한다", () => {
    // Arrange: 고정 날짜 2026-04 기준, 거래 없음
    // 종료월: addMonths("2026-04", 11) = "2027-03", +3 = "2027-06"
    // totalMonths = monthDiff("2026-04", "2027-06") = 14
    // 루프 i=0..14 → 15개

    // Act
    const series = buildTimeline(DEFAULT_BUDGET, DEFAULT_RECURRING, []);

    // Assert
    expect(series).toHaveLength(15);
  });

  it("시리즈의 첫 번째 balance는 savingsAccount + extraFunds와 같다", () => {
    // Arrange
    const startBalance = DEFAULT_BUDGET.savingsAccount + DEFAULT_BUDGET.extraFunds;
    // 40,000,000 + 50,000,000 = 90,000,000

    // Act
    const series = buildTimeline(DEFAULT_BUDGET, DEFAULT_RECURRING, []);

    // Assert
    expect(series[0].balance).toBe(startBalance);
  });

  it("두 번째 달부터 월 순수입이 누적된다", () => {
    // Arrange
    const startBalance = DEFAULT_BUDGET.savingsAccount + DEFAULT_BUDGET.extraFunds;
    const monthlyNet = calcMonthlyNet(DEFAULT_RECURRING);

    // Act
    const series = buildTimeline(DEFAULT_BUDGET, DEFAULT_RECURRING, []);

    // Assert
    expect(series[1].balance).toBe(startBalance + monthlyNet);
    expect(series[2].balance).toBe(startBalance + monthlyNet * 2);
  });

  it("첫 번째 포인트의 month는 현재 월(2026-04)이다", () => {
    // Act
    const series = buildTimeline(DEFAULT_BUDGET, DEFAULT_RECURRING, []);

    // Assert
    expect(series[0].month).toBe("2026-04");
  });

  it("label은 'YYYY.MM' 형식이다", () => {
    // Act
    const series = buildTimeline(DEFAULT_BUDGET, DEFAULT_RECURRING, []);

    // Assert
    expect(series[0].label).toBe("2026.04");
  });

  it("거래 금액이 해당 월 balance에 반영된다", () => {
    // Arrange: 2026-05에 -1,000,000 지출
    const tx = makeTx({ date: "2026-05", amount: -1_000_000 });
    const startBalance = DEFAULT_BUDGET.savingsAccount + DEFAULT_BUDGET.extraFunds;
    const monthlyNet = calcMonthlyNet(DEFAULT_RECURRING);
    // 2026-05 = i=1: balance = startBalance + monthlyNet + (-1,000,000)

    // Act
    const series = buildTimeline(DEFAULT_BUDGET, DEFAULT_RECURRING, [tx]);

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
    const monthlyNet = calcMonthlyNet(DEFAULT_RECURRING);

    // Act
    const series = buildTimeline(DEFAULT_BUDGET, DEFAULT_RECURRING, [tx1, tx2]);

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
    const series = buildTimeline(DEFAULT_BUDGET, DEFAULT_RECURRING, [lateTx]);

    // Assert: 2026-04 ~ 2028-04 = 24개월 → 25개 포인트
    expect(series.length).toBeGreaterThan(15);
    expect(series[series.length - 1].month).toBe("2028-04");
  });

  it("반복 항목이 없으면 잔액이 변하지 않는다 (거래도 없을 때)", () => {
    // Arrange: recurring 없음
    const startBalance = DEFAULT_BUDGET.savingsAccount + DEFAULT_BUDGET.extraFunds;

    // Act
    const series = buildTimeline(DEFAULT_BUDGET, [], []);

    // Assert: 모든 달의 balance가 startBalance와 같다
    for (const point of series) {
      expect(point.balance).toBe(startBalance);
    }
  });

  it("수입 항목만 있으면 두 번째 달부터 잔액이 증가한다", () => {
    // Arrange
    const incomeOnly: RecurringItem[] = [
      makeRecurring({ id: "r-inc", amount: 2_000_000, type: "income" }),
    ];
    const startBalance = DEFAULT_BUDGET.savingsAccount + DEFAULT_BUDGET.extraFunds;

    // Act
    const series = buildTimeline(DEFAULT_BUDGET, incomeOnly, []);

    // Assert
    expect(series[1].balance).toBe(startBalance + 2_000_000);
    expect(series[2].balance).toBe(startBalance + 4_000_000);
  });

  it("지출 항목만 있으면 두 번째 달부터 잔액이 감소한다", () => {
    // Arrange
    const expenseOnly: RecurringItem[] = [
      makeRecurring({ id: "r-exp", amount: 1_000_000, type: "expense" }),
    ];
    const startBalance = DEFAULT_BUDGET.savingsAccount + DEFAULT_BUDGET.extraFunds;

    // Act
    const series = buildTimeline(DEFAULT_BUDGET, expenseOnly, []);

    // Assert
    expect(series[1].balance).toBe(startBalance - 1_000_000);
    expect(series[1].balance).toBeLessThan(series[0].balance);
  });
});
