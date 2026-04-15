/**
 * 모듈: usePresetStore.test.ts
 * 경로: src/store/usePresetStore.test.ts
 * 목적: 프리셋 store의 save, remove, rename 동작 검증.
 */
import { describe, expect, it, beforeEach } from "vitest";
import { usePresetStore } from "./usePresetStore";
import { SAMPLE_PRESETS, DEFAULT_BUDGET } from "@/constants/defaults";

beforeEach(() => {
  localStorage.clear();
  usePresetStore.setState({ presets: SAMPLE_PRESETS });
});

describe("usePresetStore 초기값", () => {
  it("초기 presets는 SAMPLE_PRESETS와 일치한다", () => {
    const { presets } = usePresetStore.getState();
    expect(presets).toEqual(SAMPLE_PRESETS);
  });
});

describe("save", () => {
  it("새 프리셋을 저장하면 presets 길이가 1 증가한다", () => {
    const before = usePresetStore.getState().presets.length;
    usePresetStore.getState().save("테스트 시나리오", DEFAULT_BUDGET);
    const after = usePresetStore.getState().presets.length;
    expect(after).toBe(before + 1);
  });

  it("저장된 프리셋의 name과 input이 올바르다", () => {
    const customInput = { ...DEFAULT_BUDGET, baseFunds: 99_000_000 };
    usePresetStore.getState().save("특별 시나리오", customInput);
    const presets = usePresetStore.getState().presets;
    const saved = presets[presets.length - 1];
    expect(saved.name).toBe("특별 시나리오");
    expect(saved.input).toEqual(customInput);
  });

  it("저장된 프리셋에 고유 id와 createdAt이 부여된다", () => {
    usePresetStore.getState().save("A", DEFAULT_BUDGET);
    usePresetStore.getState().save("B", DEFAULT_BUDGET);
    const presets = usePresetStore.getState().presets;
    // 마지막 두 개
    const [a, b] = presets.slice(-2);
    expect(a.id).not.toBe(b.id);
    expect(a.createdAt).toBeGreaterThan(0);
    expect(b.createdAt).toBeGreaterThan(0);
  });
});

describe("remove", () => {
  it("id로 프리셋을 삭제하면 해당 프리셋이 없어진다", () => {
    const targetId = SAMPLE_PRESETS[0].id;
    usePresetStore.getState().remove(targetId);
    const found = usePresetStore.getState().presets.find((p) => p.id === targetId);
    expect(found).toBeUndefined();
  });

  it("삭제 후 presets 길이가 1 감소한다", () => {
    const before = usePresetStore.getState().presets.length;
    usePresetStore.getState().remove(SAMPLE_PRESETS[0].id);
    const after = usePresetStore.getState().presets.length;
    expect(after).toBe(before - 1);
  });

  it("존재하지 않는 id를 삭제해도 presets가 변경되지 않는다", () => {
    const before = usePresetStore.getState().presets.length;
    usePresetStore.getState().remove("nonexistent-preset");
    const after = usePresetStore.getState().presets.length;
    expect(after).toBe(before);
  });
});

describe("rename", () => {
  it("id로 프리셋 이름을 변경한다", () => {
    const targetId = SAMPLE_PRESETS[0].id;
    usePresetStore.getState().rename(targetId, "수정된 이름");
    const preset = usePresetStore.getState().presets.find((p) => p.id === targetId);
    expect(preset?.name).toBe("수정된 이름");
  });

  it("rename 시 input 등 다른 필드는 변경되지 않는다", () => {
    const targetId = SAMPLE_PRESETS[0].id;
    const originalInput = SAMPLE_PRESETS[0].input;
    usePresetStore.getState().rename(targetId, "새 이름");
    const preset = usePresetStore.getState().presets.find((p) => p.id === targetId);
    expect(preset?.input).toEqual(originalInput);
  });

  it("존재하지 않는 id를 rename해도 다른 프리셋이 변경되지 않는다", () => {
    const before = usePresetStore.getState().presets.map((p) => p.name);
    usePresetStore.getState().rename("nonexistent-preset", "변경 시도");
    const after = usePresetStore.getState().presets.map((p) => p.name);
    expect(after).toEqual(before);
  });
});
