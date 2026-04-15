/**
 * 모듈: useWishlistStore.ts
 * 경로: src/store/useWishlistStore.ts
 * 목적: 혼수 위시리스트 CRUD 및 localStorage 저장.
 *       필수/선택 + 새제품/중고 계층 구조로 관리.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistItem } from "@/types/budget";

interface WishlistState {
  items: WishlistItem[];
  add: (item: Omit<WishlistItem, "id">) => void;
  update: (id: string, patch: Partial<Omit<WishlistItem, "id">>) => void;
  remove: (id: string) => void;
  togglePurchased: (id: string) => void;
  clear: () => void;
  resetToDefault: () => void;
}

const genId = () =>
  `w-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/** 신혼집 가성비 기본 품목 (위생/안전 중요 → 새제품, 외형만 중요 → 중고) */
const DEFAULT_WISHLIST: WishlistItem[] = [
  // === 필수 — 가전 ===
  { id: "w01", name: "냉장고", category: "가전", priority: "필수", condition: "새제품", purchased: false, price: 800_000 },
  { id: "w02", name: "세탁기", category: "가전", priority: "필수", condition: "새제품", purchased: false, price: 700_000 },
  { id: "w03", name: "에어컨", category: "가전", priority: "필수", condition: "새제품", purchased: false, price: 800_000 },
  { id: "w04", name: "전자레인지", category: "가전", priority: "필수", condition: "새제품", purchased: false, price: 100_000 },
  { id: "w05", name: "밥솥", category: "가전", priority: "필수", condition: "새제품", purchased: false, price: 200_000 },
  { id: "w06", name: "청소기", category: "가전", priority: "필수", condition: "새제품", purchased: false, price: 300_000 },
  // === 필수 — 가구 ===
  { id: "w07", name: "매트리스", category: "가구", priority: "필수", condition: "새제품", purchased: false, price: 800_000 },
  { id: "w08", name: "침대 프레임", category: "가구", priority: "필수", condition: "중고", purchased: false, price: 200_000 },
  { id: "w09", name: "소파", category: "가구", priority: "필수", condition: "중고", purchased: false, price: 300_000 },
  { id: "w10", name: "식탁 세트", category: "가구", priority: "필수", condition: "중고", purchased: false, price: 300_000 },
  { id: "w11", name: "옷장", category: "가구", priority: "필수", condition: "중고", purchased: false, price: 200_000 },
  // === 필수 — 주방 ===
  { id: "w12", name: "냄비/프라이팬 세트", category: "주방", priority: "필수", condition: "새제품", purchased: false, price: 100_000 },
  { id: "w13", name: "식기 세트", category: "주방", priority: "필수", condition: "새제품", purchased: false, price: 80_000 },
  { id: "w14", name: "수저/칼 세트", category: "주방", priority: "필수", condition: "새제품", purchased: false, price: 50_000 },
  // === 필수 — 생활 ===
  { id: "w15", name: "이불/베개 세트", category: "생활", priority: "필수", condition: "새제품", purchased: false, price: 200_000 },
  { id: "w16", name: "수건 세트", category: "생활", priority: "필수", condition: "새제품", purchased: false, price: 50_000 },
  { id: "w17", name: "커튼/블라인드", category: "생활", priority: "필수", condition: "새제품", purchased: false, price: 150_000 },
  // === 선택 — 가전 ===
  { id: "w18", name: "건조기", category: "가전", priority: "선택", condition: "새제품", purchased: false, price: 600_000 },
  { id: "w19", name: "식기세척기", category: "가전", priority: "선택", condition: "새제품", purchased: false, price: 500_000 },
  { id: "w20", name: "TV", category: "가전", priority: "선택", condition: "중고", purchased: false, price: 300_000 },
  { id: "w21", name: "공기청정기", category: "가전", priority: "선택", condition: "새제품", purchased: false, price: 300_000 },
  // === 선택 — 가구/생활 ===
  { id: "w22", name: "책상", category: "가구", priority: "선택", condition: "중고", purchased: false, price: 100_000 },
  { id: "w23", name: "전신거울", category: "생활", priority: "선택", condition: "새제품", purchased: false, price: 50_000 },
  { id: "w24", name: "신발장", category: "가구", priority: "선택", condition: "중고", purchased: false, price: 100_000 },
];

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: DEFAULT_WISHLIST,
      add: (item) =>
        set((state) => ({ items: [...state.items, { id: genId(), ...item }] })),
      update: (id, patch) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      togglePurchased: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, purchased: !i.purchased } : i,
          ),
        })),
      clear: () => set({ items: [] }),
      resetToDefault: () => set({ items: DEFAULT_WISHLIST }),
    }),
    {
      name: "pre-married:wishlist",
      version: 2,
      migrate: (persisted, version) => {
        if (version < 2) {
          // v1 → v2: status 필드를 purchased + priority + condition으로 변환
          const old = persisted as { items?: Array<Record<string, unknown>> };
          if (old.items) {
            return {
              items: old.items.map((item) => ({
                id: item.id ?? genId(),
                name: item.name ?? "",
                category: item.category ?? "기타",
                priority: "필수" as const,
                condition: "새제품" as const,
                purchased: item.status === "구매완료",
                price: item.price ?? 0,
              })),
            };
          }
          return { items: DEFAULT_WISHLIST };
        }
        return persisted as WishlistState;
      },
    },
  ),
);
