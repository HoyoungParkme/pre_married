/**
 * 모듈: AppLayout.tsx
 * 경로: src/components/layout/AppLayout.tsx
 * 목적: 모든 페이지 공통 레이아웃.
 */
import { Outlet } from "react-router-dom";
import { TopNav } from "./TopNav";
import { Footer } from "./Footer";
import { useApplyTheme } from "@/hooks/useApplyTheme";
import { useFirebaseSync } from "@/hooks/useFirebaseSync";

export function AppLayout() {
  useApplyTheme();
  useFirebaseSync();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      <TopNav />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
