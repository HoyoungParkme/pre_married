/**
 * 모듈: RoomStatus.tsx
 * 경로: src/components/room/RoomStatus.tsx
 * 목적: TopNav에 표시하는 방 연결 상태 인디케이터.
 *
 * 주요 기능:
 *  - 초록 점: 연결됨 + 방 코드 표시
 *  - 노랑 점: 오프라인 (로컬 변경 가능, 재연결 시 자동 동기화)
 *  - 빨강 점: 에러
 *
 * 주요 의존성: useRoomStore
 */
import { useRoomStore, type RoomStatus as Status } from "@/store/useRoomStore";

const STATUS_CONFIG: Record<Status, { color: string; label: string }> = {
  connected: { color: "bg-green-500", label: "연결됨" },
  connecting: { color: "bg-yellow-500 animate-pulse", label: "연결 중" },
  disconnected: { color: "bg-yellow-500", label: "오프라인" },
  error: { color: "bg-red-500", label: "오류" },
};

export function RoomStatusIndicator() {
  const roomId = useRoomStore((s) => s.roomId);
  const status = useRoomStore((s) => s.status);
  const leaveRoom = useRoomStore((s) => s.leaveRoom);

  if (!roomId) return null;

  const config = STATUS_CONFIG[status];

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
      <span
        className={`w-2 h-2 rounded-full ${config.color}`}
        title={config.label}
      />
      <span className="font-mono tracking-wider hidden sm:inline">
        {roomId}
      </span>
      <button
        onClick={leaveRoom}
        className="ml-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        title="방 나가기"
        aria-label="방 나가기"
      >
        &times;
      </button>
    </div>
  );
}
