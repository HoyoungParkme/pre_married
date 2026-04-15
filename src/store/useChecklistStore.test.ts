/**
 * 모듈: useChecklistStore.test.ts
 * 경로: src/store/useChecklistStore.test.ts
 * 목적: 체크리스트 store의 toggle, add, update, remove, resetToDefault 동작 검증.
 *       ChecklistItem v3 타입 (type, amount 포함) 기준.
 */
import { describe, expect, it, beforeEach } from "vitest";
import { useChecklistStore } from "./useChecklistStore";
import { DEFAULT_CHECKLIST } from "@/constants/defaults";

// 테스트용 최소 SEED 데이터 — type, amount 필드 포함
const SEED_ITEMS = [
  { id: "c1", date: "2026-04-15", text: "예식장 후보 3곳 방문 및 견적 요청", done: false, type: "memo" as const, amount: 0 },
  { id: "c2", date: "2026-04-22", text: "상견례 일정 잡기", done: false, type: "memo" as const, amount: 0 },
  { id: "c3", date: "2026-07-14", text: "스드메 계약", done: false, type: "expense" as const, amount: 3_000_000 },
  { id: "c4", date: "2026-07-21", text: "신혼여행 항공·숙소 예약", done: false, type: "expense" as const, amount: 5_500_000 },
  { id: "c5", date: "2026-10-13", text: "부모님 축의금 입금", done: false, type: "income" as const, amount: 10_000_000 },
];

beforeEach(() => {
  localStorage.clear();
  useChecklistStore.setState({ items: SEED_ITEMS });
});

describe("useChecklistStore 초기값", () => {
  it("초기 items가 DEFAULT_CHECKLIST와 일치한다", () => {
    // Arrange: DEFAULT_CHECKLIST로 상태를 재설정
    useChecklistStore.setState({ items: DEFAULT_CHECKLIST });

    // Assert
    const { items } = useChecklistStore.getState();
    expect(items).toEqual(DEFAULT_CHECKLIST);
  });

  it("DEFAULT_CHECKLIST의 모든 항목에 type과 amount 필드가 있다", () => {
    // Arrange
    useChecklistStore.setState({ items: DEFAULT_CHECKLIST });

    // Assert
    const { items } = useChecklistStore.getState();
    items.forEach((item) => {
      expect(["memo", "income", "expense"]).toContain(item.type);
      expect(typeof item.amount).toBe("number");
      expect(item.amount).toBeGreaterThanOrEqual(0);
    });
  });

  it("memo 타입 항목의 amount는 0이다", () => {
    // Arrange
    useChecklistStore.setState({ items: DEFAULT_CHECKLIST });

    // Assert
    const { items } = useChecklistStore.getState();
    const memoItems = items.filter((i) => i.type === "memo");
    memoItems.forEach((item) => {
      expect(item.amount).toBe(0);
    });
  });
});

describe("toggle", () => {
  it("done이 false인 항목을 toggle하면 true가 된다", () => {
    // Arrange
    const targetId = SEED_ITEMS[0].id; // c1, done: false

    // Act
    useChecklistStore.getState().toggle(targetId);

    // Assert
    const item = useChecklistStore.getState().items.find((i) => i.id === targetId);
    expect(item?.done).toBe(true);
  });

  it("done이 true인 항목을 toggle하면 false가 된다", () => {
    // Arrange
    const targetId = SEED_ITEMS[0].id;
    useChecklistStore.getState().toggle(targetId); // 먼저 true로 만든다

    // Act
    useChecklistStore.getState().toggle(targetId); // 다시 toggle

    // Assert
    const item = useChecklistStore.getState().items.find((i) => i.id === targetId);
    expect(item?.done).toBe(false);
  });

  it("toggle 시 다른 항목의 done 상태는 변경되지 않는다", () => {
    // Arrange
    const [first, second] = SEED_ITEMS;

    // Act
    useChecklistStore.getState().toggle(first.id);

    // Assert
    const secondItem = useChecklistStore.getState().items.find((i) => i.id === second.id);
    expect(secondItem?.done).toBe(false);
  });

  it("toggle 시 type, amount 등 다른 필드는 변경되지 않는다", () => {
    // Arrange
    const target = SEED_ITEMS[2]; // c3, expense, 3_000_000

    // Act
    useChecklistStore.getState().toggle(target.id);

    // Assert
    const item = useChecklistStore.getState().items.find((i) => i.id === target.id);
    expect(item?.type).toBe("expense");
    expect(item?.amount).toBe(3_000_000);
    expect(item?.text).toBe("스드메 계약");
    expect(item?.done).toBe(true);
  });
});

describe("add", () => {
  it("memo 항목을 추가하면 items 길이가 1 증가한다", () => {
    // Arrange
    const before = useChecklistStore.getState().items.length;

    // Act
    useChecklistStore.getState().add({ date: "2026-06-01", text: "새 할 일", done: false, type: "memo", amount: 0 });

    // Assert
    const after = useChecklistStore.getState().items.length;
    expect(after).toBe(before + 1);
  });

  it("추가된 memo 항목의 모든 필드가 올바르다", () => {
    // Act
    useChecklistStore.getState().add({ date: "2026-11-24", text: "마지막 점검", done: false, type: "memo", amount: 0 });

    // Assert
    const items = useChecklistStore.getState().items;
    const added = items[items.length - 1];
    expect(added.text).toBe("마지막 점검");
    expect(added.date).toBe("2026-11-24");
    expect(added.done).toBe(false);
    expect(added.type).toBe("memo");
    expect(added.amount).toBe(0);
  });

  it("expense 항목을 추가하면 type과 amount가 올바르게 저장된다", () => {
    // Act
    useChecklistStore.getState().add({ date: "2026-09-01", text: "청첩장 제작비", done: false, type: "expense", amount: 500_000 });

    // Assert
    const items = useChecklistStore.getState().items;
    const added = items[items.length - 1];
    expect(added.type).toBe("expense");
    expect(added.amount).toBe(500_000);
    expect(added.text).toBe("청첩장 제작비");
  });

  it("income 항목을 추가하면 type과 amount가 올바르게 저장된다", () => {
    // Act
    useChecklistStore.getState().add({ date: "2026-10-01", text: "친척 축의금", done: false, type: "income", amount: 2_000_000 });

    // Assert
    const items = useChecklistStore.getState().items;
    const added = items[items.length - 1];
    expect(added.type).toBe("income");
    expect(added.amount).toBe(2_000_000);
    expect(added.text).toBe("친척 축의금");
  });

  it("추가된 항목에 고유 id가 자동으로 부여된다", () => {
    // Act
    useChecklistStore.getState().add({ date: "2026-08-15", text: "A 항목", done: false, type: "memo", amount: 0 });
    useChecklistStore.getState().add({ date: "2026-08-15", text: "B 항목", done: false, type: "memo", amount: 0 });

    // Assert
    const items = useChecklistStore.getState().items;
    const ids = items.map((i) => i.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe("update", () => {
  it("id로 text 필드를 업데이트한다", () => {
    // Act
    useChecklistStore.getState().update("c1", { text: "예식장 최종 계약" });

    // Assert
    const item = useChecklistStore.getState().items.find((i) => i.id === "c1");
    expect(item?.text).toBe("예식장 최종 계약");
  });

  it("id로 type을 memo → expense로 변경하고 amount를 설정한다", () => {
    // Arrange: c1은 memo, amount 0
    const before = useChecklistStore.getState().items.find((i) => i.id === "c1");
    expect(before?.type).toBe("memo");
    expect(before?.amount).toBe(0);

    // Act
    useChecklistStore.getState().update("c1", { type: "expense", amount: 1_500_000 });

    // Assert
    const item = useChecklistStore.getState().items.find((i) => i.id === "c1");
    expect(item?.type).toBe("expense");
    expect(item?.amount).toBe(1_500_000);
  });

  it("update 시 변경하지 않은 필드는 그대로 유지된다", () => {
    // Act
    useChecklistStore.getState().update("c3", { amount: 3_500_000 });

    // Assert
    const item = useChecklistStore.getState().items.find((i) => i.id === "c3");
    expect(item?.text).toBe("스드메 계약");
    expect(item?.date).toBe("2026-07-14");
    expect(item?.done).toBe(false);
    expect(item?.type).toBe("expense");
    expect(item?.amount).toBe(3_500_000);
  });

  it("여러 필드를 한 번에 업데이트할 수 있다", () => {
    // Act
    useChecklistStore.getState().update("c2", { text: "상견례 장소 예약", type: "expense", amount: 200_000 });

    // Assert
    const item = useChecklistStore.getState().items.find((i) => i.id === "c2");
    expect(item?.text).toBe("상견례 장소 예약");
    expect(item?.type).toBe("expense");
    expect(item?.amount).toBe(200_000);
  });

  it("income 항목의 amount를 업데이트한다", () => {
    // Arrange: c5는 income, 10_000_000
    // Act
    useChecklistStore.getState().update("c5", { amount: 15_000_000 });

    // Assert
    const item = useChecklistStore.getState().items.find((i) => i.id === "c5");
    expect(item?.type).toBe("income");
    expect(item?.amount).toBe(15_000_000);
  });

  it("존재하지 않는 id를 update해도 items가 변경되지 않는다", () => {
    // Arrange
    const before = useChecklistStore.getState().items;

    // Act
    useChecklistStore.getState().update("nonexistent", { text: "없는 항목" });

    // Assert
    const after = useChecklistStore.getState().items;
    expect(after).toEqual(before);
  });
});

describe("remove", () => {
  it("id로 항목을 삭제하면 해당 항목이 없어진다", () => {
    // Act
    useChecklistStore.getState().remove("c1");

    // Assert
    const found = useChecklistStore.getState().items.find((i) => i.id === "c1");
    expect(found).toBeUndefined();
  });

  it("삭제 후 나머지 항목 수는 1 감소한다", () => {
    // Arrange
    const before = useChecklistStore.getState().items.length;

    // Act
    useChecklistStore.getState().remove("c1");

    // Assert
    const after = useChecklistStore.getState().items.length;
    expect(after).toBe(before - 1);
  });

  it("존재하지 않는 id를 삭제해도 items가 변경되지 않는다", () => {
    // Arrange
    const before = useChecklistStore.getState().items.length;

    // Act
    useChecklistStore.getState().remove("nonexistent-id");

    // Assert
    const after = useChecklistStore.getState().items.length;
    expect(after).toBe(before);
  });

  it("expense 항목을 삭제해도 다른 type 항목은 남아 있다", () => {
    // Arrange: c3, c4가 expense / c5가 income
    // Act
    useChecklistStore.getState().remove("c3");

    // Assert
    const items = useChecklistStore.getState().items;
    expect(items.find((i) => i.id === "c3")).toBeUndefined();
    expect(items.find((i) => i.id === "c5")?.type).toBe("income");
  });
});

describe("resetToDefault", () => {
  it("항목을 추가하고 삭제한 뒤 resetToDefault하면 DEFAULT_CHECKLIST로 복원된다", () => {
    // Arrange
    useChecklistStore.getState().add({ date: "2026-06-01", text: "임시 항목", done: false, type: "memo", amount: 0 });
    useChecklistStore.getState().remove("c1");

    // Act
    useChecklistStore.getState().resetToDefault();

    // Assert
    const { items } = useChecklistStore.getState();
    expect(items).toEqual(DEFAULT_CHECKLIST);
  });

  it("resetToDefault 후 모든 항목에 type과 amount 필드가 있다", () => {
    // Act
    useChecklistStore.getState().resetToDefault();

    // Assert
    const { items } = useChecklistStore.getState();
    items.forEach((item) => {
      expect(["memo", "income", "expense"]).toContain(item.type);
      expect(typeof item.amount).toBe("number");
    });
  });

  it("resetToDefault 후 DEFAULT_CHECKLIST의 항목 수와 일치한다", () => {
    // Arrange: 전부 비운다
    useChecklistStore.setState({ items: [] });

    // Act
    useChecklistStore.getState().resetToDefault();

    // Assert
    const { items } = useChecklistStore.getState();
    expect(items).toHaveLength(DEFAULT_CHECKLIST.length);
  });
});
