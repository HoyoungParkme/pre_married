/**
 * 모듈: useBudgetSummary.ts
 * 경로: src/hooks/useBudgetSummary.ts
 * 목적: budget store의 입력값으로부터 파생 요약값을 메모이즈해 반환한다.
 */
import { useMemo } from "react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { computeSummary } from "@/utils/calculate";

export function useBudgetSummary() {
  const input = useBudgetStore((s) => s.input);
  const summary = useMemo(() => computeSummary(input), [input]);
  return { input, summary };
}
