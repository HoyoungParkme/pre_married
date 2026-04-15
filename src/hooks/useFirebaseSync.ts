/**
 * 모듈: useFirebaseSync.ts
 * 경로: src/hooks/useFirebaseSync.ts
 * 목적: Zustand 스토어 ↔ Firebase Realtime Database 양방향 동기화.
 *
 * 주요 기능:
 *  - Firebase → Zustand: onValue 리스너로 원격 변경 감지 → 로컬 스토어 업데이트
 *  - Zustand → Firebase: subscribe로 로컬 변경 감지 → Firebase 쓰기
 *  - isRemoteUpdate 플래그로 무한 루프 방지
 *
 * 주요 의존성: firebase/database, zustand stores
 */
import { useEffect, useRef } from "react";
import { onValue, set as fbSet, off } from "firebase/database";
import {
  budgetRef,
  checklistRef,
  wishlistRef,
  presetsRef,
  connectedRef,
} from "@/firebase/refs";
import { useBudgetStore } from "@/store/useBudgetStore";
import { useChecklistStore } from "@/store/useChecklistStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { usePresetStore } from "@/store/usePresetStore";
import { useRoomStore, SHARED_ROOM_ID } from "@/store/useRoomStore";
import { arrayToMap, mapToArray } from "@/firebase/sync";
import { isFirebaseConfigured } from "@/firebase/config";
import type {
  BudgetInput,
  ChecklistItem,
  WishlistItem,
  Preset,
} from "@/types/budget";

/**
 * AppLayout에서 한 번만 호출하여 Firebase 동기화를 시작한다.
 * Firebase 설정이 없으면 아무 동작도 하지 않는다 (localStorage만 사용).
 */
export function useFirebaseSync(): void {
  const setStatus = useRoomStore((s) => s.setStatus);
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const roomId = SHARED_ROOM_ID;
    const unsubscribers: (() => void)[] = [];

    // --- Firebase 연결 상태 감시 ---
    const connRef = connectedRef();
    onValue(connRef, (snap) => {
      setStatus(snap.val() === true ? "connected" : "disconnected");
    });
    unsubscribers.push(() => off(connRef));

    // --- Firebase → Zustand 리스너 ---

    // 1. Budget
    const bRef = budgetRef(roomId);
    onValue(bRef, (snap) => {
      if (!snap.exists()) return;
      const remote: BudgetInput = snap.val();
      const local = useBudgetStore.getState().input;

      if (JSON.stringify(remote) === JSON.stringify(local)) return;

      isRemoteUpdate.current = true;
      useBudgetStore.getState().replaceAll(remote);
      isRemoteUpdate.current = false;
    });
    unsubscribers.push(() => off(bRef));

    // 2. Checklist
    const cRef = checklistRef(roomId);
    onValue(cRef, (snap) => {
      const remote = mapToArray<Omit<ChecklistItem, "id">>(snap.val());
      const local = useChecklistStore.getState().items;

      if (JSON.stringify(remote) === JSON.stringify(local)) return;

      isRemoteUpdate.current = true;
      useChecklistStore.setState({ items: remote as ChecklistItem[] });
      isRemoteUpdate.current = false;
    });
    unsubscribers.push(() => off(cRef));

    // 3. Wishlist
    const wRef = wishlistRef(roomId);
    onValue(wRef, (snap) => {
      const remote = mapToArray<Omit<WishlistItem, "id">>(snap.val());
      const local = useWishlistStore.getState().items;

      if (JSON.stringify(remote) === JSON.stringify(local)) return;

      isRemoteUpdate.current = true;
      useWishlistStore.setState({ items: remote as WishlistItem[] });
      isRemoteUpdate.current = false;
    });
    unsubscribers.push(() => off(wRef));

    // 4. Presets
    const pRef = presetsRef(roomId);
    onValue(pRef, (snap) => {
      const remote = mapToArray<Omit<Preset, "id">>(snap.val());
      const local = usePresetStore.getState().presets;

      if (JSON.stringify(remote) === JSON.stringify(local)) return;

      isRemoteUpdate.current = true;
      usePresetStore.setState({ presets: remote as Preset[] });
      isRemoteUpdate.current = false;
    });
    unsubscribers.push(() => off(pRef));

    // --- Zustand → Firebase 구독 ---

    const unsubBudget = useBudgetStore.subscribe((state) => {
      if (isRemoteUpdate.current) return;
      fbSet(budgetRef(roomId), state.input).catch(console.error);
    });
    unsubscribers.push(unsubBudget);

    const unsubChecklist = useChecklistStore.subscribe((state) => {
      if (isRemoteUpdate.current) return;
      fbSet(checklistRef(roomId), arrayToMap(state.items)).catch(console.error);
    });
    unsubscribers.push(unsubChecklist);

    const unsubWishlist = useWishlistStore.subscribe((state) => {
      if (isRemoteUpdate.current) return;
      fbSet(wishlistRef(roomId), arrayToMap(state.items)).catch(console.error);
    });
    unsubscribers.push(unsubWishlist);

    const unsubPresets = usePresetStore.subscribe((state) => {
      if (isRemoteUpdate.current) return;
      fbSet(
        presetsRef(roomId),
        arrayToMap(
          state.presets.map((p) => ({
            id: p.id,
            name: p.name,
            createdAt: p.createdAt,
            input: p.input,
          })),
        ),
      ).catch(console.error);
    });
    unsubscribers.push(unsubPresets);

    return () => {
      unsubscribers.forEach((fn) => fn());
    };
  }, [setStatus]);
}
