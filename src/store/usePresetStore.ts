/**
 * 모듈: usePresetStore.ts
 * 경로: src/store/usePresetStore.ts
 * 목적: 여러 시나리오(프리셋)를 저장/불러오기/삭제한다.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BudgetInput, Preset } from "@/types/budget";
import { SAMPLE_PRESETS } from "@/constants/defaults";

interface PresetState {
  presets: Preset[];
  save: (name: string, input: BudgetInput) => void;
  remove: (id: string) => void;
  rename: (id: string, name: string) => void;
}

const genId = () =>
  `preset-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const usePresetStore = create<PresetState>()(
  persist(
    (set) => ({
      presets: SAMPLE_PRESETS,
      save: (name, input) =>
        set((state) => ({
          presets: [
            ...state.presets,
            { id: genId(), name, createdAt: Date.now(), input },
          ],
        })),
      remove: (id) =>
        set((state) => ({ presets: state.presets.filter((p) => p.id !== id) })),
      rename: (id, name) =>
        set((state) => ({
          presets: state.presets.map((p) => (p.id === id ? { ...p, name } : p)),
        })),
    }),
    { name: "pre-married:presets", version: 1 },
  ),
);
