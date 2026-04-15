/**
 * 모듈: useRecurringStore.ts
 * 경로: src/store/useRecurringStore.ts
 * 목적: 매월 반복 수입/지출 항목 CRUD 및 localStorage 저장.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RecurringItem } from "@/types/budget";
import { DEFAULT_RECURRING } from "@/constants/defaults";

interface RecurringState {
  items: RecurringItem[];
  add: (item: Omit<RecurringItem, "id">) => void;
  update: (id: string, patch: Partial<Omit<RecurringItem, "id">>) => void;
  remove: (id: string) => void;
  resetToDefault: () => void;
}

const genId = () =>
  `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const useRecurringStore = create<RecurringState>()(
  persist(
    (set) => ({
      items: DEFAULT_RECURRING,
      add: (item) =>
        set((state) => ({ items: [...state.items, { id: genId(), ...item }] })),
      update: (id, patch) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      resetToDefault: () => set({ items: DEFAULT_RECURRING }),
    }),
    { name: "pre-married:recurring", version: 1 },
  ),
);
