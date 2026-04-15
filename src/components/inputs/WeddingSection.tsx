/**
 * 모듈: WeddingSection.tsx
 * 경로: src/components/inputs/WeddingSection.tsx
 * 목적: 혼수 / 결혼식 / 신혼여행 예산 입력 섹션.
 */
import { Heart, Plane, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NumberInput } from "@/components/ui/NumberInput";
import { useBudgetStore } from "@/store/useBudgetStore";

export function WeddingSection() {
  const input = useBudgetStore((s) => s.input);
  const setField = useBudgetStore((s) => s.setField);

  return (
    <Card as="section" className="p-6 sm:p-8 md:col-span-2">
      <SectionHeader index={3} title="혼수 및 결혼 준비 예산" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center mb-4">
            <ShoppingCart className="w-5 h-5 mr-2 text-indigo-500" /> 혼수 예산
          </h3>
          <NumberInput
            label="총 혼수 비용"
            value={input.weddingItems}
            onChange={(v) => setField("weddingItems", v)}
          />
          <div className="mt-4 text-sm text-slate-500 dark:text-slate-400 space-y-2">
            <p>
              <span className="font-semibold text-slate-700 dark:text-slate-200">새제품:</span>{" "}
              세탁기, 매트리스 등
            </p>
            <p>
              <span className="font-semibold text-slate-700 dark:text-slate-200">중고:</span>{" "}
              냉장고, TV, 소파 등
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center mb-4">
            <Heart className="w-5 h-5 mr-2 text-rose-500" /> 결혼식 예산
          </h3>
          <NumberInput
            label="결혼 총 비용"
            value={input.weddingCost}
            onChange={(v) => setField("weddingCost", v)}
          />
          <div className="mt-4 text-sm text-slate-500 dark:text-slate-400 space-y-2">
            <p>
              <span className="font-semibold text-slate-700 dark:text-slate-200">스드메:</span>{" "}
              250~400만
            </p>
            <p>
              <span className="font-semibold text-slate-700 dark:text-slate-200">예식장/기타:</span>{" "}
              800~2,500만
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center mb-4">
            <Plane className="w-5 h-5 mr-2 text-sky-500" /> 신혼여행
          </h3>
          <NumberInput
            label="신행 총 비용"
            value={input.honeymoon}
            onChange={(v) => setField("honeymoon", v)}
          />
        </div>
      </div>
    </Card>
  );
}
