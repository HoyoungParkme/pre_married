/**
 * 모듈: ThemeToggle.tsx
 * 경로: src/components/ui/ThemeToggle.tsx
 * 목적: 라이트/다크 테마 전환 버튼.
 */
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";

export function ThemeToggle() {
  const mode = useThemeStore((s) => s.mode);
  const toggle = useThemeStore((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
      className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
    >
      {mode === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
