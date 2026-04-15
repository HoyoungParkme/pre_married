/**
 * 모듈: RoomSetup.tsx
 * 경로: src/components/room/RoomSetup.tsx
 * 목적: 방 생성/참여 UI. 첫 방문 시 또는 방에 연결되지 않았을 때 표시.
 *
 * 주요 기능:
 *  - "새 방 만들기": 6자리 코드 생성 → 클립보드 복사
 *  - "방 참여하기": 코드 입력 → 유효성 검증 → 연결
 *
 * 주요 의존성: useRoomStore
 */
import { useState } from "react";
import { HeartHandshake, Copy, Check, LogIn, Plus } from "lucide-react";
import { useRoomStore } from "@/store/useRoomStore";
import { isFirebaseConfigured } from "@/firebase/config";

type Mode = "select" | "create" | "join";

export function RoomSetup() {
  const { createRoom, joinRoom, status, error } = useRoomStore();
  const [mode, setMode] = useState<Mode>("select");
  const [joinCode, setJoinCode] = useState("");
  const [createdCode, setCreatedCode] = useState("");
  const [copied, setCopied] = useState(false);

  const isLoading = status === "connecting";

  /** Firebase 미설정 시 안내 */
  if (!isFirebaseConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-card p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Firebase 설정 필요
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            .env 파일에 Firebase 설정값을 입력해주세요.
            <br />
            .env.example 파일을 참고하세요.
          </p>
        </div>
      </div>
    );
  }

  /** 방 만들기 처리 */
  async function handleCreate() {
    try {
      const code = await createRoom();
      setCreatedCode(code);
      setMode("create");
    } catch {
      // 에러는 useRoomStore.error로 표시됨
    }
  }

  /** 방 참여 처리 */
  async function handleJoin() {
    if (joinCode.trim().length !== 6) return;
    try {
      await joinRoom(joinCode);
    } catch {
      // 에러는 useRoomStore.error로 표시됨
    }
  }

  /** 코드 복사 */
  async function handleCopy() {
    await navigator.clipboard.writeText(createdCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-card p-8 space-y-6">
        {/* 헤더 */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            신혼 마스터 플랜
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            두 사람이 같은 공간에서 함께 준비해요
          </p>
        </div>

        {/* 에러 표시 */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg p-3 text-center">
            {error}
          </div>
        )}

        {/* 선택 모드 */}
        {mode === "select" && (
          <div className="space-y-3">
            <button
              onClick={handleCreate}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              새 방 만들기
            </button>
            <button
              onClick={() => setMode("join")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              <LogIn className="w-5 h-5" />
              방 코드로 참여하기
            </button>
          </div>
        )}

        {/* 방 생성 완료 */}
        {mode === "create" && createdCode && (
          <div className="space-y-4 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              방이 만들어졌어요! 이 코드를 상대방에게 공유하세요.
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-mono font-bold tracking-[0.3em] text-brand-600 dark:text-brand-400">
                {createdCode}
              </span>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="코드 복사"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-slate-500" />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              코드는 자동 저장됩니다. 다음에 접속하면 바로 연결돼요.
            </p>
          </div>
        )}

        {/* 방 참여 입력 */}
        {mode === "join" && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="room-code"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                방 코드 입력
              </label>
              <input
                id="room-code"
                type="text"
                maxLength={6}
                placeholder="XXXXXX"
                value={joinCode}
                onChange={(e) =>
                  setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))
                }
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                className="w-full text-center text-2xl font-mono tracking-[0.3em] py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                autoFocus
              />
            </div>
            <button
              onClick={handleJoin}
              disabled={isLoading || joinCode.length !== 6}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {isLoading ? "연결 중..." : "참여하기"}
            </button>
            <button
              onClick={() => {
                setMode("select");
                setJoinCode("");
              }}
              className="w-full text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              뒤로 가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
