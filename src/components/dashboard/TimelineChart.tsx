/**
 * 모듈: TimelineChart.tsx
 * 경로: src/components/dashboard/TimelineChart.tsx
 * 목적: 월별 잔액(라인) + 수입/지출(막대) 복합 차트.
 */
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { formatNumber } from "@/utils/format";

export function TimelineChart() {
  const { timeline } = useBudgetSummary();

  if (timeline.length === 0) return null;

  return (
    <Card as="section" className="p-6 sm:p-8">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
        월별 자금 흐름
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        잔액 추이와 월별 수입/지출을 한눈에 확인하세요.
      </p>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={timeline}
            margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="balance"
              tickFormatter={(v: number) => `${Math.round(v / 10_000)}만`}
              tick={{ fontSize: 11 }}
              width={55}
            />
            <YAxis
              yAxisId="flow"
              orientation="right"
              tickFormatter={(v: number) => `${Math.round(v / 10_000)}만`}
              tick={{ fontSize: 11 }}
              width={55}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  balance: "잔액",
                  income: "수입",
                  expense: "지출",
                };
                return [`${formatNumber(value)}원`, labels[name] ?? name];
              }}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
            />
            <Legend
              formatter={(value: string) => {
                const labels: Record<string, string> = {
                  balance: "총 잔액",
                  income: "수입",
                  expense: "지출",
                };
                return labels[value] ?? value;
              }}
              wrapperStyle={{ fontSize: "13px" }}
            />
            <ReferenceLine yAxisId="balance" y={0} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} />

            {/* 수입 막대 (초록) */}
            <Bar
              yAxisId="flow"
              dataKey="income"
              fill="#10b981"
              opacity={0.7}
              radius={[4, 4, 0, 0]}
              barSize={12}
            />

            {/* 지출 막대 (빨강) */}
            <Bar
              yAxisId="flow"
              dataKey="expense"
              fill="#ef4444"
              opacity={0.7}
              radius={[4, 4, 0, 0]}
              barSize={12}
            />

            {/* 잔액 라인 (파랑) */}
            <Line
              yAxisId="balance"
              type="monotone"
              dataKey="balance"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#3b82f6" }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
