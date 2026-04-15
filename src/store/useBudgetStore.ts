/**
 * 모듈: useBudgetStore.ts
 * 경로: src/store/useBudgetStore.ts
 * 목적: 초기 자금(적금통장 + 추가 자금) 관리 및 localStorage 저장.
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
      version: 3,
      migrate: (persisted, version) => {
        if (version < 3) {
          const old = persisted as { input?: Record<string, number> };
          if (old.input) {
            return {
              input: {
                savingsAccount: old.input.savingsAccount ?? old.input.baseFunds ?? DEFAULT_BUDGET.savingsAccount,
                extraFunds: old.input.extraFunds ?? DEFAULT_BUDGET.extraFunds,
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
