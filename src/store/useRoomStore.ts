/**
 * 모듈: useRoomStore.ts
 * 경로: src/store/useRoomStore.ts
 * 목적: 방(Room) 상태 관리. 방 코드를 localStorage에 저장하여 재방문 시 자동 연결.
 *
 * 주요 기능:
 *  - createRoom: 6자리 방 코드를 생성하고 Firebase에 초기 데이터 업로드
 *  - joinRoom: 기존 방에 참여하고 Firebase 데이터를 로컬에 적용
 *  - leaveRoom: 방에서 나가기 (로컬 데이터는 유지)
 *
 * 주요 의존성: zustand, firebase/database
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { get as fbGet, set as fbSet } from "firebase/database";
import { metaRef, budgetRef, checklistRef, wishlistRef, presetsRef } from "@/firebase/refs";
import { useBudgetStore } from "./useBudgetStore";
import { useChecklistStore } from "./useChecklistStore";
import { useWishlistStore } from "./useWishlistStore";
import { usePresetStore } from "./usePresetStore";
import { arrayToMap, mapToArray } from "@/firebase/sync";
import type { ChecklistItem, WishlistItem, Preset } from "@/types/budget";

export type RoomStatus = "disconnected" | "connecting" | "connected" | "error";

interface RoomState {
  /** 현재 연결된 방 코드 (null이면 미연결) */
  roomId: string | null;
  /** 연결 상태 */
  status: RoomStatus;
  /** 에러 메시지 */
  error: string | null;
  /** 방 생성 후 코드 반환 */
  createRoom: () => Promise<string>;
  /** 기존 방에 참여 */
  joinRoom: (code: string) => Promise<void>;
  /** 방에서 나가기 */
  leaveRoom: () => void;
  /** 연결 상태 업데이트 (내부용) */
  setStatus: (status: RoomStatus) => void;
}

/** 6자리 영문대문자+숫자 방 코드 생성 */
function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 혼동 문자 제외 (0/O, 1/I)
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/** 현재 로컬 스토어 데이터를 Firebase에 업로드 */
async function uploadLocalData(roomId: string): Promise<void> {
  const budget = useBudgetStore.getState().input;
  const checklist = useChecklistStore.getState().items;
  const wishlist = useWishlistStore.getState().items;
  const presets = usePresetStore.getState().presets;

  await Promise.all([
    fbSet(budgetRef(roomId), budget),
    fbSet(checklistRef(roomId), arrayToMap(checklist)),
    fbSet(wishlistRef(roomId), arrayToMap(wishlist)),
    fbSet(presetsRef(roomId), arrayToMap(presets.map((p) => ({
      id: p.id,
      name: p.name,
      createdAt: p.createdAt,
      input: p.input,
    })))),
  ]);
}

/** Firebase 데이터를 로컬 스토어에 적용 */
async function downloadRemoteData(roomId: string): Promise<void> {
  const [budgetSnap, checklistSnap, wishlistSnap, presetsSnap] =
    await Promise.all([
      fbGet(budgetRef(roomId)),
      fbGet(checklistRef(roomId)),
      fbGet(wishlistRef(roomId)),
      fbGet(presetsRef(roomId)),
    ]);

  if (budgetSnap.exists()) {
    useBudgetStore.getState().replaceAll(budgetSnap.val());
  }
  if (checklistSnap.exists()) {
    const items = mapToArray<Omit<ChecklistItem, "id">>(checklistSnap.val());
    useChecklistStore.setState({ items: items as ChecklistItem[] });
  }
  if (wishlistSnap.exists()) {
    const items = mapToArray<Omit<WishlistItem, "id">>(wishlistSnap.val());
    useWishlistStore.setState({ items: items as WishlistItem[] });
  }
  if (presetsSnap.exists()) {
    const raw = mapToArray<Omit<Preset, "id">>(presetsSnap.val());
    usePresetStore.setState({ presets: raw as Preset[] });
  }
}

export const useRoomStore = create<RoomState>()(
  persist(
    (set) => ({
      roomId: null,
      status: "disconnected",
      error: null,

      createRoom: async () => {
        set({ status: "connecting", error: null });
        try {
          const code = generateRoomCode();

          // Firebase에 방 메타데이터 생성
          await fbSet(metaRef(code), { createdAt: Date.now() });

          // 현재 로컬 데이터를 Firebase에 업로드
          await uploadLocalData(code);

          set({ roomId: code, status: "connected", error: null });
          return code;
        } catch (err) {
          const msg = err instanceof Error ? err.message : "방 생성 실패";
          set({ status: "error", error: msg });
          throw err;
        }
      },

      joinRoom: async (code: string) => {
        const normalized = code.toUpperCase().trim();
        if (normalized.length !== 6) {
          set({ status: "error", error: "방 코드는 6자리입니다" });
          throw new Error("방 코드는 6자리입니다");
        }

        set({ status: "connecting", error: null });
        try {
          // 방이 존재하는지 확인
          const snap = await fbGet(metaRef(normalized));
          if (!snap.exists()) {
            set({ status: "error", error: "존재하지 않는 방 코드입니다" });
            throw new Error("존재하지 않는 방 코드입니다");
          }

          // Firebase 데이터를 로컬에 적용
          await downloadRemoteData(normalized);

          set({ roomId: normalized, status: "connected", error: null });
        } catch (err) {
          if (err instanceof Error && err.message.includes("존재하지 않는")) {
            throw err;
          }
          const msg = err instanceof Error ? err.message : "방 참여 실패";
          set({ status: "error", error: msg });
          throw err;
        }
      },

      leaveRoom: () => {
        set({ roomId: null, status: "disconnected", error: null });
      },

      setStatus: (status) => set({ status }),
    }),
    {
      name: "pre-married:room",
      version: 1,
      // status, error는 persist하지 않는다 (일시적 상태)
      partialize: (state) => ({ roomId: state.roomId }),
    },
  ),
);
