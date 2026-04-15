/**
 * 모듈: TimelineChart.tsx
 * 경로: src/components/dashboard/TimelineChart.tsx
 * 목적: 월별 잔액 추이를 Recharts 라인 차트로 시각화.
 */
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { formatNumber } from "@/utils/format";

export function TimelineChart() {
  const { timeline } = useBudgetSummary();

  if (timeline.length === 0) return null;

  return (
    <Card as="section" className="p-6 sm:p-8">
      <SectionHeader
        title="월별 잔액 추이"
        description="매월 저축과 지출이 반영된 잔액 변화입니다."
      />
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeline} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={(v: number) => `${Math.round(v / 10_000)}만`}
              tick={{ fontSize: 11 }}
              width={55}
            />
            <Tooltip
              formatter={(value: number) => [`${formatNumber(value)}원`, "잔액"]}
              labelFormatter={(label: string) => label}
            />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
