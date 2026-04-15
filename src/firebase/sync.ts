/**
 * 모듈: sync.ts
 * 경로: src/firebase/sync.ts
 * 목적: Firebase ↔ Zustand 동기화를 위한 배열/객체 변환 유틸리티.
 *
 * 주요 기능:
 *  - arrayToMap: Zustand 배열 → Firebase 객체맵 변환 (쓰기용)
 *  - mapToArray: Firebase 객체맵 → Zustand 배열 변환 (읽기용)
 */

/** id를 키로 하는 객체맵으로 변환 (Firebase 쓰기용) */
export function arrayToMap<T extends { id: string }>(
  arr: T[],
): Record<string, Omit<T, "id">> {
  const map: Record<string, Omit<T, "id">> = {};
  for (const item of arr) {
    const { id, ...rest } = item;
    map[id] = rest;
  }
  return map;
}

/** Firebase 객체맵을 배열로 변환 (Zustand 읽기용) */
export function mapToArray<T>(
  map: Record<string, T> | null | undefined,
): (T & { id: string })[] {
  if (!map) return [];
  return Object.entries(map).map(([id, data]) => ({ id, ...data }));
}
