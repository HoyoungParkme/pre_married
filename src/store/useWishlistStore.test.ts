/**
 * 모듈: useWishlistStore.test.ts
 * 경로: src/store/useWishlistStore.test.ts
 * 목적: 위시리스트 store의 add, update, remove, togglePurchased, clear, resetToDefault 동작 검증.
 *       WishlistItem v2 타입 (priority, condition, purchased) 기준.
 */
import { describe, expect, it, beforeEach } from "vitest";
import { useWishlistStore } from "./useWishlistStore";

// 테스트용 최소 SEED 데이터 — 새 타입(priority, condition, purchased) 기준
const SEED_ITEMS = [
  { id: "w1", name: "세탁기",         category: "가전" as const, priority: "필수" as const, condition: "새제품" as const, purchased: false, price: 900_000 },
  { id: "w2", name: "냉장고 (중고)",  category: "가전" as const, priority: "필수" as const, condition: "중고"   as const, purchased: false, price: 600_000 },
  { id: "w3", name: "매트리스",       category: "가구" as const, priority: "필수" as const, condition: "새제품" as const, purchased: false, price: 1_200_000 },
  { id: "w4", name: "소파 (중고)",    category: "가구" as const, priority: "선택" as const, condition: "중고"   as const, purchased: false, price: 400_000 },
  { id: "w5", name: "식탁 세트",      category: "가구" as const, priority: "선택" as const, condition: "중고"   as const, purchased: false, price: 500_000 },
  { id: "w6", name: "주방 기본 용품", category: "주방" as const, priority: "필수" as const, condition: "새제품" as const, purchased: false, price: 300_000 },
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
    // Arrange
    const before = useWishlistStore.getState().items.length;

    // Act
    useWishlistStore.getState().add({
      name: "청소기",
      category: "가전",
      priority: "필수",
      condition: "새제품",
      purchased: false,
      price: 350_000,
    });

    // Assert
    const after = useWishlistStore.getState().items.length;
    expect(after).toBe(before + 1);
  });

  it("추가된 아이템의 모든 필드가 올바르다", () => {
    // Arrange & Act
    useWishlistStore.getState().add({
      name: "커튼",
      category: "생활",
      priority: "선택",
      condition: "새제품",
      purchased: false,
      price: 150_000,
    });

    // Assert
    const items = useWishlistStore.getState().items;
    const added = items[items.length - 1];
    expect(added.name).toBe("커튼");
    expect(added.category).toBe("생활");
    expect(added.priority).toBe("선택");
    expect(added.condition).toBe("새제품");
    expect(added.purchased).toBe(false);
    expect(added.price).toBe(150_000);
  });

  it("추가된 아이템에 고유 id가 자동으로 부여된다", () => {
    // Arrange & Act
    useWishlistStore.getState().add({ name: "A", category: "기타", priority: "선택", condition: "새제품", purchased: false, price: 1000 });
    useWishlistStore.getState().add({ name: "B", category: "기타", priority: "선택", condition: "중고",   purchased: false, price: 2000 });

    // Assert
    const items = useWishlistStore.getState().items;
    const ids = items.map((i) => i.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe("update", () => {
  it("id로 price 필드를 업데이트한다", () => {
    // Arrange & Act
    useWishlistStore.getState().update("w1", { price: 800_000 });

    // Assert
    const item = useWishlistStore.getState().items.find((i) => i.id === "w1");
    expect(item?.price).toBe(800_000);
  });

  it("update 시 변경하지 않은 필드는 그대로 유지된다", () => {
    // Arrange & Act
    useWishlistStore.getState().update("w1", { price: 800_000 });

    // Assert
    const item = useWishlistStore.getState().items.find((i) => i.id === "w1");
    expect(item?.name).toBe("세탁기");
    expect(item?.priority).toBe("필수");
    expect(item?.condition).toBe("새제품");
    expect(item?.purchased).toBe(false);
    expect(item?.price).toBe(800_000);
  });

  it("여러 필드를 한 번에 업데이트할 수 있다", () => {
    // Arrange & Act
    useWishlistStore.getState().update("w2", { name: "냉장고 (신품)", condition: "새제품", price: 1_200_000 });

    // Assert
    const item = useWishlistStore.getState().items.find((i) => i.id === "w2");
    expect(item?.name).toBe("냉장고 (신품)");
    expect(item?.condition).toBe("새제품");
    expect(item?.price).toBe(1_200_000);
  });

  it("priority를 필수 → 선택으로 변경할 수 있다", () => {
    // Arrange & Act
    useWishlistStore.getState().update("w3", { priority: "선택" });

    // Assert
    const item = useWishlistStore.getState().items.find((i) => i.id === "w3");
    expect(item?.priority).toBe("선택");
  });
});

describe("remove", () => {
  it("id로 아이템을 삭제하면 해당 아이템이 없어진다", () => {
    // Arrange & Act
    useWishlistStore.getState().remove("w1");

    // Assert
    const found = useWishlistStore.getState().items.find((i) => i.id === "w1");
    expect(found).toBeUndefined();
  });

  it("삭제 후 items 길이가 1 감소한다", () => {
    // Arrange
    const before = useWishlistStore.getState().items.length;

    // Act
    useWishlistStore.getState().remove("w2");

    // Assert
    const after = useWishlistStore.getState().items.length;
    expect(after).toBe(before - 1);
  });

  it("존재하지 않는 id를 삭제해도 items가 변경되지 않는다", () => {
    // Arrange
    const before = useWishlistStore.getState().items.length;

    // Act
    useWishlistStore.getState().remove("nonexistent");

    // Assert
    const after = useWishlistStore.getState().items.length;
    expect(after).toBe(before);
  });
});

describe("togglePurchased", () => {
  it("purchased가 false인 아이템을 토글하면 true가 된다", () => {
    // Arrange
    const before = useWishlistStore.getState().items.find((i) => i.id === "w1");
    expect(before?.purchased).toBe(false);

    // Act
    useWishlistStore.getState().togglePurchased("w1");

    // Assert
    const after = useWishlistStore.getState().items.find((i) => i.id === "w1");
    expect(after?.purchased).toBe(true);
  });

  it("purchased가 true인 아이템을 토글하면 false가 된다", () => {
    // Arrange: 먼저 purchased를 true로 세팅
    useWishlistStore.setState({
      items: SEED_ITEMS.map((i) =>
        i.id === "w2" ? { ...i, purchased: true } : i,
      ),
    });

    // Act
    useWishlistStore.getState().togglePurchased("w2");

    // Assert
    const after = useWishlistStore.getState().items.find((i) => i.id === "w2");
    expect(after?.purchased).toBe(false);
  });

  it("토글 시 purchased 외 다른 필드는 변경되지 않는다", () => {
    // Arrange & Act
    useWishlistStore.getState().togglePurchased("w3");

    // Assert
    const item = useWishlistStore.getState().items.find((i) => i.id === "w3");
    expect(item?.name).toBe("매트리스");
    expect(item?.category).toBe("가구");
    expect(item?.priority).toBe("필수");
    expect(item?.condition).toBe("새제품");
    expect(item?.price).toBe(1_200_000);
    expect(item?.purchased).toBe(true);
  });

  it("존재하지 않는 id를 토글해도 items가 변경되지 않는다", () => {
    // Arrange
    const before = useWishlistStore.getState().items;

    // Act
    useWishlistStore.getState().togglePurchased("nonexistent");

    // Assert
    const after = useWishlistStore.getState().items;
    expect(after).toEqual(before);
  });
});

describe("clear", () => {
  it("clear하면 items가 빈 배열이 된다", () => {
    // Arrange & Act
    useWishlistStore.getState().clear();

    // Assert
    const { items } = useWishlistStore.getState();
    expect(items).toHaveLength(0);
    expect(items).toEqual([]);
  });
});

describe("resetToDefault", () => {
  it("resetToDefault 후 items 길이가 24개다", () => {
    // Arrange: clear로 비운다
    useWishlistStore.getState().clear();
    expect(useWishlistStore.getState().items).toHaveLength(0);

    // Act
    useWishlistStore.getState().resetToDefault();

    // Assert
    const { items } = useWishlistStore.getState();
    expect(items).toHaveLength(24);
  });

  it("resetToDefault 후 모든 아이템의 purchased는 false다", () => {
    // Arrange: 일부 purchased를 true로 만든다
    useWishlistStore.getState().togglePurchased("w1");
    useWishlistStore.getState().togglePurchased("w2");

    // Act
    useWishlistStore.getState().resetToDefault();

    // Assert
    const { items } = useWishlistStore.getState();
    const allUnpurchased = items.every((i) => i.purchased === false);
    expect(allUnpurchased).toBe(true);
  });

  it("resetToDefault 후 각 아이템에 priority와 condition 필드가 있다", () => {
    // Arrange & Act
    useWishlistStore.getState().resetToDefault();

    // Assert
    const { items } = useWishlistStore.getState();
    items.forEach((item) => {
      expect(["필수", "선택"]).toContain(item.priority);
      expect(["새제품", "중고"]).toContain(item.condition);
    });
  });
});
