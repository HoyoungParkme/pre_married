/**
 * 모듈: useThemeStore.ts
 * 경로: src/store/useThemeStore.ts
 * 목적: 라이트/다크 테마 상태 관리 및 localStorage 저장.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "light",
      toggle: () => set((s) => ({ mode: s.mode === "light" ? "dark" : "light" })),
      setMode: (mode) => set({ mode }),
    }),
    { name: "pre-married:theme", version: 1 },
  ),
);
