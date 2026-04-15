/**
 * 모듈: useBudgetStore.ts
 * 경로: src/store/useBudgetStore.ts
 * 목적: 예산 입력값을 전역에서 관리하고 localStorage에 자동 저장한다.
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
      version: 1,
    },
  ),
);
