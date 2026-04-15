/**
 * 모듈: HousingSection.tsx
 * 경로: src/components/inputs/HousingSection.tsx
 * 목적: 기존 자금 + 주거(LH) 입력 섹션.
 */
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NumberInput } from "@/components/ui/NumberInput";
import { useBudgetStore } from "@/store/useBudgetStore";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { formatNumber } from "@/utils/format";

export function HousingSection() {
  const input = useBudgetStore((s) => s.input);
  const setField = useBudgetStore((s) => s.setField);
  const { summary } = useBudgetSummary();

  return (
    <Card as="section" className="p-6 sm:p-8">
      <SectionHeader index={1} title="기존 자금 및 주거 (LH)" />
      <div className="space-y-1">
        <NumberInput
          label="기존 보유 자금"
          value={input.baseFunds}
          onChange={(v) => setField("baseFunds", v)}
        />
        <NumberInput
          label="추가 여유 자금"
          value={input.extraFunds}
          onChange={(v) => setField("extraFunds", v)}
        />
        <div className="my-6 border-t border-dashed border-slate-200 dark:border-slate-700" />
        <NumberInput
          label="총 전세금"
          value={input.jeonseTotal}
          onChange={(v) => setField("jeonseTotal", v)}
        />
        <NumberInput
          label="LH 지원금"
          value={input.lhSupportAmount}
          onChange={(v) => setField("lhSupportAmount", v)}
        />
      </div>
      <div className="mt-6 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl text-right border border-slate-100 dark:border-slate-700">
        <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">
          실제 내 돈(본인 부담금):
        </span>
        <span className="ml-2 font-bold text-slate-800 dark:text-slate-100 text-lg">
          {formatNumber(summary.selfPayAmount)}원
        </span>
      </div>
    </Card>
  );
}
