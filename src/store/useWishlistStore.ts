/**
 * 모듈: useWishlistStore.ts
 * 경로: src/store/useWishlistStore.ts
 * 목적: 혼수 위시리스트 CRUD 및 localStorage 저장.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistItem } from "@/types/budget";

interface WishlistState {
  items: WishlistItem[];
  add: (item: Omit<WishlistItem, "id">) => void;
  update: (id: string, patch: Partial<Omit<WishlistItem, "id">>) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const genId = () =>
  `w-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const SEED: WishlistItem[] = [
  { id: "w1", name: "세탁기", category: "가전", price: 900_000, status: "예정" },
  { id: "w2", name: "냉장고 (중고)", category: "가전", price: 600_000, status: "예정" },
  { id: "w3", name: "매트리스", category: "가구", price: 1_200_000, status: "예정" },
  { id: "w4", name: "소파 (중고)", category: "가구", price: 400_000, status: "예정" },
  { id: "w5", name: "식탁 세트", category: "가구", price: 500_000, status: "예정" },
  { id: "w6", name: "주방 기본 용품", category: "주방", price: 300_000, status: "예정" },
];

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: SEED,
      add: (item) =>
        set((state) => ({ items: [...state.items, { id: genId(), ...item }] })),
      update: (id, patch) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "pre-married:wishlist", version: 1 },
  ),
);
