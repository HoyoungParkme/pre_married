/**
 * 모듈: useBudgetStore.test.ts
 * 경로: src/store/useBudgetStore.test.ts
 * 목적: 예산 store의 초기값, setField, replaceAll, reset 동작 검증.
 */
import { describe, expect, it, beforeEach } from "vitest";
import { useBudgetStore } from "./useBudgetStore";
import { DEFAULT_BUDGET } from "@/constants/defaults";

beforeEach(() => {
  // 각 테스트 전 store를 기본값으로 리셋하고 localStorage도 초기화한다
  localStorage.clear();
  useBudgetStore.setState({ input: DEFAULT_BUDGET });
});

describe("useBudgetStore 초기값", () => {
  it("초기 input이 DEFAULT_BUDGET과 일치한다", () => {
    const { input } = useBudgetStore.getState();
    expect(input).toEqual(DEFAULT_BUDGET);
  });
});

describe("setField", () => {
  it("baseFunds를 변경하면 해당 필드만 업데이트된다", () => {
    useBudgetStore.getState().setField("baseFunds", 123);
    const { input } = useBudgetStore.getState();
    expect(input.baseFunds).toBe(123);
    // 다른 필드는 그대로다
    expect(input.extraFunds).toBe(DEFAULT_BUDGET.extraFunds);
  });

  it("monthlySavings를 변경하면 해당 필드만 업데이트된다", () => {
    useBudgetStore.getState().setField("monthlySavings", 2_000_000);
    const { input } = useBudgetStore.getState();
    expect(input.monthlySavings).toBe(2_000_000);
    expect(input.baseFunds).toBe(DEFAULT_BUDGET.baseFunds);
  });
});

describe("replaceAll", () => {
  it("새로운 BudgetInput 전체를 교체한다", () => {
    const next = { ...DEFAULT_BUDGET, baseFunds: 9_999_999, savingMonths: 24 };
    useBudgetStore.getState().replaceAll(next);
    const { input } = useBudgetStore.getState();
    expect(input.baseFunds).toBe(9_999_999);
    expect(input.savingMonths).toBe(24);
  });
});

describe("reset", () => {
  it("필드를 변경한 뒤 reset하면 DEFAULT_BUDGET으로 복원된다", () => {
    useBudgetStore.getState().setField("baseFunds", 1);
    useBudgetStore.getState().reset();
    const { input } = useBudgetStore.getState();
    expect(input).toEqual(DEFAULT_BUDGET);
  });
});
