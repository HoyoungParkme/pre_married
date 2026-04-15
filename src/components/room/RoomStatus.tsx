/**
 * 모듈: RoomStatus.tsx
 * 경로: src/components/room/RoomStatus.tsx
 * 목적: TopNav에 표시하는 Firebase 연결 상태 인디케이터.
 *
 * 주요 의존성: useRoomStore
 */
import { useRoomStore, type RoomStatus as Status } from "@/store/useRoomStore";

const STATUS_CONFIG: Record<Status, { color: string; title: string }> = {
  connected: { color: "bg-green-500", title: "동기화 연결됨" },
  connecting: { color: "bg-yellow-500 animate-pulse", title: "연결 중..." },
  disconnected: { color: "bg-yellow-500", title: "오프라인" },
  error: { color: "bg-red-500", title: "연결 오류" },
};

export function RoomStatusIndicator() {
  const status = useRoomStore((s) => s.status);
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`w-2 h-2 rounded-full ${config.color}`}
      title={config.title}
    />
  );
}
