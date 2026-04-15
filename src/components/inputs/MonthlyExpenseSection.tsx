/**
 * 모듈: MonthlyExpenseSection.tsx
 * 경로: src/components/inputs/MonthlyExpenseSection.tsx
 * 목적: 월 고정비 4개 입력 (월세, 관리비, 공과금, 식비).
 */
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NumberInput } from "@/components/ui/NumberInput";
import { useBudgetStore } from "@/store/useBudgetStore";
import { formatNumber } from "@/utils/format";

export function MonthlyExpenseSection() {
  const input = useBudgetStore((s) => s.input);
  const setField = useBudgetStore((s) => s.setField);

  const totalMonthly =
    input.monthlyRent + input.monthlyMaint + input.monthlyUtil + input.monthlyFood;

  return (
    <Card as="section" className="p-6">
      <SectionHeader title="월 고정비" />
      <NumberInput
        label="월세"
        value={input.monthlyRent}
        onChange={(v) => setField("monthlyRent", v)}
      />
      <NumberInput
        label="관리비"
        value={input.monthlyMaint}
        onChange={(v) => setField("monthlyMaint", v)}
      />
      <NumberInput
        label="공과금"
        value={input.monthlyUtil}
        onChange={(v) => setField("monthlyUtil", v)}
      />
      <NumberInput
        label="식비"
        value={input.monthlyFood}
        onChange={(v) => setField("monthlyFood", v)}
      />
      <div className="pt-3 mt-1 border-t border-slate-200 dark:border-slate-700 flex justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          월 합계
        </span>
        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {formatNumber(totalMonthly)}원
        </span>
      </div>
    </Card>
  );
}
