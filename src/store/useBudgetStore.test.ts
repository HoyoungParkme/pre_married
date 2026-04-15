/**
 * 모듈: useBudgetStore.test.ts
 * 경로: src/store/useBudgetStore.test.ts
 * 목적: 예산 store의 초기값, setField, replaceAll, reset 동작 검증.
 *        BudgetInput은 savingsAccount / extraFunds 2필드만 존재한다.
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
  it("savingsAccount를 변경하면 해당 필드만 업데이트된다", () => {
    // Arrange & Act
    useBudgetStore.getState().setField("savingsAccount", 123);
    const { input } = useBudgetStore.getState();

    // Assert
    expect(input.savingsAccount).toBe(123);
    // 나머지 필드는 그대로다
    expect(input.extraFunds).toBe(DEFAULT_BUDGET.extraFunds);
  });

  it("extraFunds를 변경하면 해당 필드만 업데이트된다", () => {
    // Arrange & Act
    useBudgetStore.getState().setField("extraFunds", 30_000_000);
    const { input } = useBudgetStore.getState();

    // Assert
    expect(input.extraFunds).toBe(30_000_000);
    // 나머지 필드는 그대로다
    expect(input.savingsAccount).toBe(DEFAULT_BUDGET.savingsAccount);
  });

  it("두 필드를 순서대로 변경하면 각각 최신값이 유지된다", () => {
    // Arrange & Act
    useBudgetStore.getState().setField("savingsAccount", 10_000_000);
    useBudgetStore.getState().setField("extraFunds", 20_000_000);
    const { input } = useBudgetStore.getState();

    // Assert
    expect(input.savingsAccount).toBe(10_000_000);
    expect(input.extraFunds).toBe(20_000_000);
  });
});

describe("replaceAll", () => {
  it("새로운 BudgetInput 전체를 교체한다", () => {
    // Arrange
    const next = { savingsAccount: 9_999_999, extraFunds: 1_000_000 };

    // Act
    useBudgetStore.getState().replaceAll(next);
    const { input } = useBudgetStore.getState();

    // Assert
    expect(input.savingsAccount).toBe(9_999_999);
    expect(input.extraFunds).toBe(1_000_000);
  });
});

describe("reset", () => {
  it("필드를 변경한 뒤 reset하면 DEFAULT_BUDGET으로 복원된다", () => {
    // Arrange: 두 필드 모두 변경
    useBudgetStore.getState().setField("savingsAccount", 1);
    useBudgetStore.getState().setField("extraFunds", 2);

    // Act
    useBudgetStore.getState().reset();
    const { input } = useBudgetStore.getState();

    // Assert
    expect(input).toEqual(DEFAULT_BUDGET);
  });
});
