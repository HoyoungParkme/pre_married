/**
 * 모듈: AppLayout.tsx
 * 경로: src/components/layout/AppLayout.tsx
 * 목적: 모든 페이지 공통 레이아웃. 테마 적용, 상단 네비, 푸터.
 */
import { Outlet } from "react-router-dom";
import { TopNav } from "./TopNav";
import { Footer } from "./Footer";
import { useApplyTheme } from "@/hooks/useApplyTheme";

export function AppLayout() {
  useApplyTheme();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <TopNav />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
