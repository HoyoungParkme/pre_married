/**
 * 모듈: useBudgetStore.ts
 * 경로: src/store/useBudgetStore.ts
 * 목적: 자금 + 월 고정비 입력값을 전역에서 관리하고 localStorage에 자동 저장.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BudgetInput } from "@/types/budget";
import { DEFAULT_BUDGET } from "@/constants/defaults";

interface BudgetState {
  input: BudgetInput;
  setField: <K extends keyof BudgetInput>(key: K, value: BudgetInput[K]) => void;
  replaceAll: (next: BudgetInput) => void;
  reset: () => void;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set) => ({
      input: DEFAULT_BUDGET,
      setField: (key, value) =>
        set((state) => ({ input: { ...state.input, [key]: value } })),
      replaceAll: (next) => set({ input: next }),
      reset: () => set({ input: DEFAULT_BUDGET }),
    }),
    {
      name: "pre-married:budget",
      version: 2,
      migrate: (persisted, version) => {
        if (version < 2) {
          // v1 → v2: 기존 13필드를 7필드로 변환
          const old = persisted as { input?: Record<string, number> };
          if (old.input) {
            return {
              input: {
                savingsAccount: old.input.baseFunds ?? DEFAULT_BUDGET.savingsAccount,
                extraFunds: old.input.extraFunds ?? DEFAULT_BUDGET.extraFunds,
                monthlySavings: old.input.monthlySavings ?? DEFAULT_BUDGET.monthlySavings,
                monthlyRent: old.input.livingRent ?? DEFAULT_BUDGET.monthlyRent,
                monthlyMaint: old.input.livingMaint ?? DEFAULT_BUDGET.monthlyMaint,
                monthlyUtil: old.input.livingUtil ?? DEFAULT_BUDGET.monthlyUtil,
                monthlyFood: old.input.livingFood ?? DEFAULT_BUDGET.monthlyFood,
              },
            };
          }
          return { input: DEFAULT_BUDGET };
        }
        return persisted as BudgetState;
      },
    },
  ),
);
