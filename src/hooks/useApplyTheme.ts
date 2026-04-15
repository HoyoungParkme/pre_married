/**
 * 모듈: useApplyTheme.ts
 * 경로: src/hooks/useApplyTheme.ts
 * 목적: 테마 상태를 <html> 요소의 class로 반영한다.
 */
import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

export function useApplyTheme() {
  const mode = useThemeStore((s) => s.mode);
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [mode]);
}
