/**
 * 모듈: refs.ts
 * 경로: src/firebase/refs.ts
 * 목적: Firebase Realtime Database 경로 ref 헬퍼 함수 모음.
 */
import { ref } from "firebase/database";
import { db } from "./config";

/** 방 루트 경로 */
export const roomRef = (roomId: string) => ref(db, `rooms/${roomId}`);

/** 예산 데이터 경로 */
export const budgetRef = (roomId: string) => ref(db, `rooms/${roomId}/budget`);

/** 체크리스트 데이터 경로 */
export const checklistRef = (roomId: string) =>
  ref(db, `rooms/${roomId}/checklist`);

/** 위시리스트 데이터 경로 */
export const wishlistRef = (roomId: string) =>
  ref(db, `rooms/${roomId}/wishlist`);

/** 프리셋 데이터 경로 */
export const presetsRef = (roomId: string) =>
  ref(db, `rooms/${roomId}/presets`);

/** 반복 항목 데이터 경로 */
export const recurringRef = (roomId: string) =>
  ref(db, `rooms/${roomId}/recurring`);

/** 거래 데이터 경로 */
export const transactionsRef = (roomId: string) =>
  ref(db, `rooms/${roomId}/transactions`);

/** 방 메타데이터 경로 */
export const metaRef = (roomId: string) => ref(db, `rooms/${roomId}/meta`);

/** Firebase 연결 상태 경로 */
export const connectedRef = () => ref(db, ".info/connected");
