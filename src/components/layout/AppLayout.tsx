/**
 * 모듈: AppLayout.tsx
 * 경로: src/components/layout/AppLayout.tsx
 * 목적: 모든 페이지 공통 레이아웃. 테마 적용, 상단 네비, 푸터, 방 연결 가드.
 *
 * 주요 의존성: useRoomStore, useFirebaseSync
 */
import { Outlet } from "react-router-dom";
import { TopNav } from "./TopNav";
import { Footer } from "./Footer";
import { useApplyTheme } from "@/hooks/useApplyTheme";
import { useFirebaseSync } from "@/hooks/useFirebaseSync";
import { useRoomStore } from "@/store/useRoomStore";
import { RoomSetup } from "@/components/room/RoomSetup";

export function AppLayout() {
  useApplyTheme();
  useFirebaseSync();

  const roomId = useRoomStore((s) => s.roomId);

  // 방에 연결되지 않았으면 방 설정 화면 표시
  if (!roomId) {
    return <RoomSetup />;
  }

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
