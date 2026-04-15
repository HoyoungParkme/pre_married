/**
 * 모듈: useTransactionStore.ts
 * 경로: src/store/useTransactionStore.ts
 * 목적: 일회성 지출/수입 거래 CRUD 및 localStorage 저장.
 *
 * 주요 의존성: zustand
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Transaction } from "@/types/budget";
import { DEFAULT_TRANSACTIONS } from "@/constants/defaults";

interface TransactionState {
  items: Transaction[];
  add: (item: Omit<Transaction, "id">) => void;
  update: (id: string, patch: Partial<Omit<Transaction, "id">>) => void;
  remove: (id: string) => void;
  resetToDefault: () => void;
}

const genId = () =>
  `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      items: DEFAULT_TRANSACTIONS,
      add: (item) =>
        set((state) => ({ items: [...state.items, { id: genId(), ...item }] })),
      update: (id, patch) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      resetToDefault: () => set({ items: DEFAULT_TRANSACTIONS }),
    }),
    { name: "pre-married:transactions", version: 1 },
  ),
);
