/**
 * 모듈: useChecklistStore.ts
 * 경로: src/store/useChecklistStore.ts
 * 목적: 결혼 준비 체크리스트 상태 관리 및 localStorage 저장.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChecklistItem } from "@/types/budget";
import { DEFAULT_CHECKLIST } from "@/constants/defaults";

interface ChecklistState {
  items: ChecklistItem[];
  toggle: (id: string) => void;
  add: (stage: ChecklistItem["stage"], text: string) => void;
  remove: (id: string) => void;
  resetToDefault: () => void;
}

const genId = () =>
  `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const useChecklistStore = create<ChecklistState>()(
  persist(
    (set) => ({
      items: DEFAULT_CHECKLIST,
      toggle: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, done: !i.done } : i,
          ),
        })),
      add: (stage, text) =>
        set((state) => ({
          items: [...state.items, { id: genId(), stage, text, done: false }],
        })),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      resetToDefault: () => set({ items: DEFAULT_CHECKLIST }),
    }),
    { name: "pre-married:checklist", version: 1 },
  ),
);
