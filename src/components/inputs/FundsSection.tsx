/**
 * 모듈: FundsSection.tsx
 * 경로: src/components/inputs/FundsSection.tsx
 * 목적: 자금 3개 입력 (적금통장, 추가 자금, 월 저축액).
 */
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NumberInput } from "@/components/ui/NumberInput";
import { useBudgetStore } from "@/store/useBudgetStore";

export function FundsSection() {
  const input = useBudgetStore((s) => s.input);
  const setField = useBudgetStore((s) => s.setField);

  return (
    <Card as="section" className="p-6">
      <SectionHeader title="자금" />
      <NumberInput
        label="적금통장 잔액"
        value={input.savingsAccount}
        onChange={(v) => setField("savingsAccount", v)}
      />
      <NumberInput
        label="추가 자금"
        value={input.extraFunds}
        onChange={(v) => setField("extraFunds", v)}
      />
      <NumberInput
        label="월 저축액"
        value={input.monthlySavings}
        onChange={(v) => setField("monthlySavings", v)}
        highlight
      />
    </Card>
  );
}
