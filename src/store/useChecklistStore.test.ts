/**
 * 모듈: useChecklistStore.test.ts
 * 경로: src/store/useChecklistStore.test.ts
 * 목적: 체크리스트 store의 toggle, add, remove, resetToDefault 동작 검증.
 */
import { describe, expect, it, beforeEach } from "vitest";
import { useChecklistStore } from "./useChecklistStore";
import { DEFAULT_CHECKLIST } from "@/constants/defaults";

beforeEach(() => {
  localStorage.clear();
  useChecklistStore.setState({ items: DEFAULT_CHECKLIST });
});

describe("useChecklistStore 초기값", () => {
  it("초기 items가 DEFAULT_CHECKLIST와 일치한다", () => {
    const { items } = useChecklistStore.getState();
    expect(items).toEqual(DEFAULT_CHECKLIST);
  });
});

describe("toggle", () => {
  it("done이 false인 항목을 toggle하면 true가 된다", () => {
    const targetId = DEFAULT_CHECKLIST[0].id; // c1, done: false
    useChecklistStore.getState().toggle(targetId);
    const item = useChecklistStore.getState().items.find((i) => i.id === targetId);
    expect(item?.done).toBe(true);
  });

  it("done이 true인 항목을 toggle하면 false가 된다", () => {
    const targetId = DEFAULT_CHECKLIST[0].id;
    // 먼저 true로 만든다
    useChecklistStore.getState().toggle(targetId);
    // 다시 toggle
    useChecklistStore.getState().toggle(targetId);
    const item = useChecklistStore.getState().items.find((i) => i.id === targetId);
    expect(item?.done).toBe(false);
  });

  it("toggle 시 다른 항목의 done 상태는 변경되지 않는다", () => {
    const [first, second] = DEFAULT_CHECKLIST;
    useChecklistStore.getState().toggle(first.id);
    const secondItem = useChecklistStore.getState().items.find((i) => i.id === second.id);
    expect(secondItem?.done).toBe(false);
  });
});

describe("add", () => {
  it("새 항목을 추가하면 items 길이가 1 증가한다", () => {
    const before = useChecklistStore.getState().items.length;
    useChecklistStore.getState().add("D-30", "새 할 일");
    const after = useChecklistStore.getState().items.length;
    expect(after).toBe(before + 1);
  });

  it("추가된 항목의 text, stage, done이 올바르다", () => {
    useChecklistStore.getState().add("D-7", "마지막 점검");
    const items = useChecklistStore.getState().items;
    const added = items[items.length - 1];
    expect(added.text).toBe("마지막 점검");
    expect(added.stage).toBe("D-7");
    expect(added.done).toBe(false);
  });

  it("추가된 항목에 고유 id가 부여된다", () => {
    useChecklistStore.getState().add("D-90", "A 항목");
    useChecklistStore.getState().add("D-90", "B 항목");
    const items = useChecklistStore.getState().items;
    const ids = items.map((i) => i.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe("remove", () => {
  it("id로 항목을 삭제하면 해당 항목이 없어진다", () => {
    const targetId = DEFAULT_CHECKLIST[0].id;
    useChecklistStore.getState().remove(targetId);
    const found = useChecklistStore.getState().items.find((i) => i.id === targetId);
    expect(found).toBeUndefined();
  });

  it("삭제 후 나머지 항목 수는 1 감소한다", () => {
    const before = useChecklistStore.getState().items.length;
    useChecklistStore.getState().remove(DEFAULT_CHECKLIST[0].id);
    const after = useChecklistStore.getState().items.length;
    expect(after).toBe(before - 1);
  });

  it("존재하지 않는 id를 삭제해도 items가 변경되지 않는다", () => {
    const before = useChecklistStore.getState().items.length;
    useChecklistStore.getState().remove("nonexistent-id");
    const after = useChecklistStore.getState().items.length;
    expect(after).toBe(before);
  });
});

describe("resetToDefault", () => {
  it("항목을 추가하고 삭제한 뒤 resetToDefault하면 DEFAULT_CHECKLIST로 복원된다", () => {
    useChecklistStore.getState().add("D-30", "임시 항목");
    useChecklistStore.getState().remove(DEFAULT_CHECKLIST[0].id);
    useChecklistStore.getState().resetToDefault();
    const { items } = useChecklistStore.getState();
    expect(items).toEqual(DEFAULT_CHECKLIST);
  });
});
