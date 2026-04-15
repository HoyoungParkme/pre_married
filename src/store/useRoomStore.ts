/**
 * 모듈: useRoomStore.ts
 * 경로: src/store/useRoomStore.ts
 * 목적: Firebase 연결 상태만 관리. 고정 공유 공간("shared")을 사용한다.
 *
 * 주요 의존성: zustand
 */
import { create } from "zustand";

export type RoomStatus = "disconnected" | "connecting" | "connected" | "error";

/** 고정 공유 공간 ID — 2명만 쓰는 프로젝트이므로 방 코드 불필요 */
export const SHARED_ROOM_ID = "shared";

interface RoomState {
  /** 연결 상태 */
  status: RoomStatus;
  /** 연결 상태 업데이트 (내부용) */
  setStatus: (status: RoomStatus) => void;
}

export const useRoomStore = create<RoomState>()((set) => ({
  status: "disconnected",
  setStatus: (status) => set({ status }),
}));
