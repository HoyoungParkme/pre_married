/**
 * 모듈: useFirebaseSync.ts
 * 경로: src/hooks/useFirebaseSync.ts
 * 목적: Zustand 스토어 ↔ Firebase Realtime Database 양방향 동기화.
 */
import { useEffect, useRef } from "react";
import { onValue, set as fbSet, off } from "firebase/database";
import {
  budgetRef,
  recurringRef,
  checklistRef,
  wishlistRef,
  transactionsRef,
  connectedRef,
} from "@/firebase/refs";
import { useBudgetStore } from "@/store/useBudgetStore";
import { useRecurringStore } from "@/store/useRecurringStore";
import { useChecklistStore } from "@/store/useChecklistStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useRoomStore, SHARED_ROOM_ID } from "@/store/useRoomStore";
import { arrayToMap, mapToArray } from "@/firebase/sync";
import { isFirebaseConfigured } from "@/firebase/config";
import type {
  BudgetInput,
  RecurringItem,
  ChecklistItem,
  WishlistItem,
  Transaction,
} from "@/types/budget";

export function useFirebaseSync(): void {
  const setStatus = useRoomStore((s) => s.setStatus);
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const roomId = SHARED_ROOM_ID;
    const unsubs: (() => void)[] = [];

    // 연결 상태
    const connRef = connectedRef();
    onValue(connRef, (snap) => setStatus(snap.val() === true ? "connected" : "disconnected"));
    unsubs.push(() => off(connRef));

    // --- Firebase → Zustand ---

    const bRef = budgetRef(roomId);
    onValue(bRef, (snap) => {
      if (!snap.exists()) return;
      const remote: BudgetInput = snap.val();
      if (JSON.stringify(remote) === JSON.stringify(useBudgetStore.getState().input)) return;
      isRemoteUpdate.current = true;
      useBudgetStore.getState().replaceAll(remote);
      isRemoteUpdate.current = false;
    });
    unsubs.push(() => off(bRef));

    const rRef = recurringRef(roomId);
    onValue(rRef, (snap) => {
      const remote = mapToArray<Omit<RecurringItem, "id">>(snap.val());
      if (JSON.stringify(remote) === JSON.stringify(useRecurringStore.getState().items)) return;
      isRemoteUpdate.current = true;
      useRecurringStore.setState({ items: remote as RecurringItem[] });
      isRemoteUpdate.current = false;
    });
    unsubs.push(() => off(rRef));

    const cRef = checklistRef(roomId);
    onValue(cRef, (snap) => {
      const remote = mapToArray<Omit<ChecklistItem, "id">>(snap.val());
      if (JSON.stringify(remote) === JSON.stringify(useChecklistStore.getState().items)) return;
      isRemoteUpdate.current = true;
      useChecklistStore.setState({ items: remote as ChecklistItem[] });
      isRemoteUpdate.current = false;
    });
    unsubs.push(() => off(cRef));

    const wRef = wishlistRef(roomId);
    onValue(wRef, (snap) => {
      const remote = mapToArray<Omit<WishlistItem, "id">>(snap.val());
      if (JSON.stringify(remote) === JSON.stringify(useWishlistStore.getState().items)) return;
      isRemoteUpdate.current = true;
      useWishlistStore.setState({ items: remote as WishlistItem[] });
      isRemoteUpdate.current = false;
    });
    unsubs.push(() => off(wRef));

    const tRef = transactionsRef(roomId);
    onValue(tRef, (snap) => {
      const remote = mapToArray<Omit<Transaction, "id">>(snap.val());
      if (JSON.stringify(remote) === JSON.stringify(useTransactionStore.getState().items)) return;
      isRemoteUpdate.current = true;
      useTransactionStore.setState({ items: remote as Transaction[] });
      isRemoteUpdate.current = false;
    });
    unsubs.push(() => off(tRef));

    // --- Zustand → Firebase ---

    unsubs.push(useBudgetStore.subscribe((s) => {
      if (!isRemoteUpdate.current) fbSet(budgetRef(roomId), s.input).catch(console.error);
    }));

    unsubs.push(useRecurringStore.subscribe((s) => {
      if (!isRemoteUpdate.current) fbSet(recurringRef(roomId), arrayToMap(s.items)).catch(console.error);
    }));

    unsubs.push(useChecklistStore.subscribe((s) => {
      if (!isRemoteUpdate.current) fbSet(checklistRef(roomId), arrayToMap(s.items)).catch(console.error);
    }));

    unsubs.push(useWishlistStore.subscribe((s) => {
      if (!isRemoteUpdate.current) fbSet(wishlistRef(roomId), arrayToMap(s.items)).catch(console.error);
    }));

    unsubs.push(useTransactionStore.subscribe((s) => {
      if (!isRemoteUpdate.current) fbSet(transactionsRef(roomId), arrayToMap(s.items)).catch(console.error);
    }));

    return () => unsubs.forEach((fn) => fn());
  }, [setStatus]);
}
