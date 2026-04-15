/**
 * 모듈: Conclusion.tsx
 * 경로: src/components/dashboard/Conclusion.tsx
 * 목적: 최종 시뮬레이션 결과 요약 배너.
 */
import { CheckCircle } from "lucide-react";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { formatNumber } from "@/utils/format";

export function Conclusion() {
  const { input, summary } = useBudgetSummary();
  const positive = summary.finalRemain >= 0;

  return (
    <section className="bg-slate-800 dark:bg-slate-900 text-white rounded-3xl p-8 text-center shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 opacity-20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 opacity-20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <CheckCircle
        className={`w-12 h-12 mx-auto mb-4 relative z-10 ${positive ? "text-emerald-400" : "text-rose-400"}`}
      />
      <h2 className="text-2xl font-bold mb-3 relative z-10">최종 시뮬레이션 결과</h2>
      <p className="text-slate-300 font-medium mb-2 relative z-10 text-lg">
        초기 자금을 방어하고,{" "}
        <span className="text-emerald-400 font-bold bg-emerald-900/50 px-2 py-1 rounded">
          {input.savingMonths}개월 간 {formatNumber(summary.totalSavings)}원을 추가 저축
        </span>
        하여<br />
        결혼식 후{" "}
        <span
          className={`font-bold px-2 py-1 rounded ${
            positive
              ? "text-brand-400 bg-brand-900/50"
              : "text-rose-400 bg-rose-900/50"
          }`}
        >
          {formatNumber(summary.finalRemain)}원
        </span>
        의 잔액이 예상됩니다.
      </p>
    </section>
  );
}
