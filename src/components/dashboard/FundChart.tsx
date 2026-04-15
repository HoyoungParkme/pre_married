/**
 * 모듈: FundChart.tsx
 * 경로: src/components/dashboard/FundChart.tsx
 * 목적: 월별 누적 잔액 추이 라인 차트 (Recharts).
 */
import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LineChart as LineIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useBudgetStore } from "@/store/useBudgetStore";
import { buildMonthlyBalanceSeries } from "@/utils/calculate";
import { formatNumber } from "@/utils/format";

export function FundChart() {
  const input = useBudgetStore((s) => s.input);
  const data = useMemo(() => buildMonthlyBalanceSeries(input), [input]);

  return (
    <Card as="section" className="p-6 sm:p-8">
      <header className="mb-4 flex items-center">
        <LineIcon className="w-5 h-5 mr-2 text-brand-500" />
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
          월별 잔액 추이
        </h2>
      </header>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        혼수·신혼여행 지출 후 잔액에서 매월 저축이 누적되고, 마지막으로 결혼식 비용이 차감됩니다.
      </p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              width={70}
              tick={{ fontSize: 11 }}
              tickFormatter={(v: number) => `${Math.round(v / 10_000).toLocaleString()}만`}
            />
            <Tooltip
              formatter={(v: number) => [`${formatNumber(v)}원`, "잔액"]}
              labelFormatter={(l) => `시점: ${l}`}
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
            />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
