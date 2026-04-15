/**
 * 모듈: SavingsLivingSection.tsx
 * 경로: src/components/inputs/SavingsLivingSection.tsx
 * 목적: 월 저축 + 생활비 입력 섹션.
 */
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NumberInput } from "@/components/ui/NumberInput";
import { useBudgetStore } from "@/store/useBudgetStore";

export function SavingsLivingSection() {
  const input = useBudgetStore((s) => s.input);
  const setField = useBudgetStore((s) => s.setField);

  return (
    <Card as="section" className="p-6 sm:p-8">
      <SectionHeader index={2} title="월 생활비 및 추가 저축액" />
      <div className="space-y-1">
        <NumberInput
          label="월 예상 저축액"
          value={input.monthlySavings}
          onChange={(v) => setField("monthlySavings", v)}
          highlight
        />
        <NumberInput
          label="저축 기간"
          value={input.savingMonths}
          onChange={(v) => setField("savingMonths", v)}
          unit="개월"
          highlight
        />
        <div className="my-6 border-t border-dashed border-slate-200 dark:border-slate-700" />
        <NumberInput
          label="월세 + LH이자"
          value={input.livingRent}
          onChange={(v) => setField("livingRent", v)}
        />
        <NumberInput
          label="관리비"
          value={input.livingMaint}
          onChange={(v) => setField("livingMaint", v)}
        />
        <NumberInput
          label="공과금"
          value={input.livingUtil}
          onChange={(v) => setField("livingUtil", v)}
        />
        <NumberInput
          label="식비"
          value={input.livingFood}
          onChange={(v) => setField("livingFood", v)}
        />
      </div>
    </Card>
  );
}
