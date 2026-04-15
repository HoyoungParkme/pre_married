/**
 * 모듈: useChecklistStore.ts
 * 경로: src/store/useChecklistStore.ts
 * 목적: 결혼 준비 체크리스트 상태 관리 및 localStorage 저장.
 *       날짜 기반 항목 관리.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChecklistItem } from "@/types/budget";
import { DEFAULT_CHECKLIST } from "@/constants/defaults";

interface ChecklistState {
  items: ChecklistItem[];
  toggle: (id: string) => void;
  add: (date: string, text: string) => void;
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
      add: (date, text) =>
        set((state) => ({
          items: [...state.items, { id: genId(), date, text, done: false }],
        })),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      resetToDefault: () => set({ items: DEFAULT_CHECKLIST }),
    }),
    {
      name: "pre-married:checklist",
      version: 2,
      migrate: (persisted, version) => {
        if (version < 2) {
          // v1 → v2: stage → date 변환
          const old = persisted as { items?: Array<Record<string, unknown>> };
          if (old.items) {
            const stageToDay: Record<string, number> = {
              "D-180": 0, "D-90": 90, "D-30": 150, "D-7": 173,
            };
            const now = new Date();
            return {
              items: old.items.map((item) => {
                const days = stageToDay[item.stage as string] ?? 0;
                const d = new Date(now);
                d.setDate(d.getDate() + days);
                return {
                  id: item.id ?? genId(),
                  date: d.toISOString().slice(0, 10),
                  text: item.text ?? "",
                  done: !!item.done,
                };
              }),
            };
          }
          return { items: DEFAULT_CHECKLIST };
        }
        return persisted as ChecklistState;
      },
    },
  ),
);
