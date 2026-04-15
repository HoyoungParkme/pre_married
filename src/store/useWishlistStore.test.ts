/**
 * 모듈: useWishlistStore.test.ts
 * 경로: src/store/useWishlistStore.test.ts
 * 목적: 위시리스트 store의 add, update, remove, clear 동작 검증.
 */
import { describe, expect, it, beforeEach } from "vitest";
import { useWishlistStore } from "./useWishlistStore";

// SEED 데이터와 동일한 초기 상태로 리셋한다
const SEED_ITEMS = [
  { id: "w1", name: "세탁기", category: "가전" as const, price: 900_000, status: "예정" as const },
  { id: "w2", name: "냉장고 (중고)", category: "가전" as const, price: 600_000, status: "예정" as const },
  { id: "w3", name: "매트리스", category: "가구" as const, price: 1_200_000, status: "예정" as const },
  { id: "w4", name: "소파 (중고)", category: "가구" as const, price: 400_000, status: "예정" as const },
  { id: "w5", name: "식탁 세트", category: "가구" as const, price: 500_000, status: "예정" as const },
  { id: "w6", name: "주방 기본 용품", category: "주방" as const, price: 300_000, status: "예정" as const },
];

beforeEach(() => {
  localStorage.clear();
  useWishlistStore.setState({ items: SEED_ITEMS });
});

describe("useWishlistStore 초기값", () => {
  it("초기 items는 SEED 데이터 6개다", () => {
    const { items } = useWishlistStore.getState();
    expect(items).toHaveLength(6);
  });
});

describe("add", () => {
  it("새 아이템을 추가하면 items 길이가 1 증가한다", () => {
    const before = useWishlistStore.getState().items.length;
    useWishlistStore.getState().add({ name: "청소기", category: "가전", price: 350_000, status: "예정" });
    const after = useWishlistStore.getState().items.length;
    expect(after).toBe(before + 1);
  });

  it("추가된 아이템의 name, category, price, status가 올바르다", () => {
    useWishlistStore.getState().add({ name: "커튼", category: "생활", price: 150_000, status: "예정" });
    const items = useWishlistStore.getState().items;
    const added = items[items.length - 1];
    expect(added.name).toBe("커튼");
    expect(added.category).toBe("생활");
    expect(added.price).toBe(150_000);
    expect(added.status).toBe("예정");
  });

  it("추가된 아이템에 고유 id가 자동으로 부여된다", () => {
    useWishlistStore.getState().add({ name: "A", category: "기타", price: 1000, status: "예정" });
    useWishlistStore.getState().add({ name: "B", category: "기타", price: 2000, status: "예정" });
    const items = useWishlistStore.getState().items;
    const ids = items.map((i) => i.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe("update", () => {
  it("id로 아이템의 특정 필드를 업데이트한다", () => {
    useWishlistStore.getState().update("w1", { status: "구매완료" });
    const item = useWishlistStore.getState().items.find((i) => i.id === "w1");
    expect(item?.status).toBe("구매완료");
  });

  it("update 시 변경하지 않은 필드는 그대로 유지된다", () => {
    useWishlistStore.getState().update("w1", { price: 800_000 });
    const item = useWishlistStore.getState().items.find((i) => i.id === "w1");
    expect(item?.name).toBe("세탁기");
    expect(item?.price).toBe(800_000);
  });

  it("여러 필드를 한 번에 업데이트할 수 있다", () => {
    useWishlistStore.getState().update("w2", { name: "냉장고 (신품)", price: 1_200_000 });
    const item = useWishlistStore.getState().items.find((i) => i.id === "w2");
    expect(item?.name).toBe("냉장고 (신품)");
    expect(item?.price).toBe(1_200_000);
  });

  it("note 필드를 추가할 수 있다", () => {
    useWishlistStore.getState().update("w3", { note: "삼성 매트리스 추천" });
    const item = useWishlistStore.getState().items.find((i) => i.id === "w3");
    expect(item?.note).toBe("삼성 매트리스 추천");
  });
});

describe("remove", () => {
  it("id로 아이템을 삭제하면 해당 아이템이 없어진다", () => {
    useWishlistStore.getState().remove("w1");
    const found = useWishlistStore.getState().items.find((i) => i.id === "w1");
    expect(found).toBeUndefined();
  });

  it("삭제 후 items 길이가 1 감소한다", () => {
    const before = useWishlistStore.getState().items.length;
    useWishlistStore.getState().remove("w2");
    const after = useWishlistStore.getState().items.length;
    expect(after).toBe(before - 1);
  });

  it("존재하지 않는 id를 삭제해도 items가 변경되지 않는다", () => {
    const before = useWishlistStore.getState().items.length;
    useWishlistStore.getState().remove("nonexistent");
    const after = useWishlistStore.getState().items.length;
    expect(after).toBe(before);
  });
});

describe("clear", () => {
  it("clear하면 items가 빈 배열이 된다", () => {
    useWishlistStore.getState().clear();
    const { items } = useWishlistStore.getState();
    expect(items).toHaveLength(0);
    expect(items).toEqual([]);
  });
});
