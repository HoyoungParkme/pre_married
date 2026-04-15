/**
 * 모듈: TimelineChart.tsx
 * 경로: src/components/dashboard/TimelineChart.tsx
 * 목적: 잔액(라인) + 수입/지출(막대) 복합 차트. 일/주/월/년 기간 전환.
 */
import { useMemo, useState } from "react";
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
import type { MonthlyBalance } from "@/types/budget";

type Period = "daily" | "weekly" | "monthly" | "yearly";

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "daily", label: "일별" },
  { value: "weekly", label: "주별" },
  { value: "monthly", label: "월별" },
  { value: "yearly", label: "년도별" },
];

/** 월별 데이터를 일별로 확장 (각 월 → 30일, 잔액은 일 단위로 선형 보간) */
function toDaily(data: MonthlyBalance[]): MonthlyBalance[] {
  if (data.length < 2) return data;
  const result: MonthlyBalance[] = [];

  for (let i = 0; i < data.length; i++) {
    const cur = data[i];
    const [y, m] = cur.month.split("-").map(Number);
    const daysInMonth = new Date(y, m, 0).getDate();
    const prevBalance = i > 0 ? data[i - 1].balance : cur.balance;
    const dailyIncome = cur.income / daysInMonth;
    const dailyExpense = cur.expense / daysInMonth;

    for (let d = 1; d <= daysInMonth; d++) {
      const ratio = d / daysInMonth;
      result.push({
        month: `${cur.month}-${String(d).padStart(2, "0")}`,
        balance: Math.round(prevBalance + (cur.balance - prevBalance) * ratio),
        income: Math.round(dailyIncome),
        expense: Math.round(dailyExpense),
        label: `${m}/${d}`,
      });
    }
  }
  return result;
}

/** 월별 데이터를 주별로 그룹핑 (4주/월) */
function toWeekly(data: MonthlyBalance[]): MonthlyBalance[] {
  const result: MonthlyBalance[] = [];
  let weekNum = 1;

  for (const cur of data) {
    for (let w = 0; w < 4; w++) {
      const prevBalance = result.length > 0 ? result[result.length - 1].balance : cur.balance - cur.income + cur.expense;
      const weekIncome = Math.round(cur.income / 4);
      const weekExpense = Math.round(cur.expense / 4);

      result.push({
        month: `${cur.month}-W${w + 1}`,
        balance: w === 3 ? cur.balance : Math.round(prevBalance + weekIncome - weekExpense),
        income: weekIncome,
        expense: weekExpense,
        label: `${weekNum}주`,
      });
      weekNum++;
    }
  }
  return result;
}

/** 월별 데이터를 년도별로 집계 */
function toYearly(data: MonthlyBalance[]): MonthlyBalance[] {
  const yearMap = new Map<string, { income: number; expense: number; lastBalance: number }>();

  for (const cur of data) {
    const year = cur.month.slice(0, 4);
    const entry = yearMap.get(year) ?? { income: 0, expense: 0, lastBalance: 0 };
    entry.income += cur.income;
    entry.expense += cur.expense;
    entry.lastBalance = cur.balance;
    yearMap.set(year, entry);
  }

  return Array.from(yearMap.entries()).map(([year, v]) => ({
    month: year,
    balance: v.lastBalance,
    income: v.income,
    expense: v.expense,
    label: `${year}년`,
  }));
}

export function TimelineChart() {
  const { timeline } = useBudgetSummary();
  const [period, setPeriod] = useState<Period>("monthly");

  const chartData = useMemo(() => {
    switch (period) {
      case "daily": return toDaily(timeline);
      case "weekly": return toWeekly(timeline);
      case "yearly": return toYearly(timeline);
      default: return timeline;
    }
  }, [timeline, period]);

  if (timeline.length === 0) return null;

  const periodLabel = PERIOD_OPTIONS.find((o) => o.value === period)?.label ?? "월별";

  return (
    <Card as="section" className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {periodLabel} 자금 흐름
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            잔액 추이와 수입/지출을 한눈에 확인하세요.
          </p>
        </div>

        {/* 기간 토글 */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-0.5">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                period === opt.value
                  ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              interval={period === "daily" ? Math.floor(chartData.length / 10) : "preserveStartEnd"}
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

            <Bar yAxisId="flow" dataKey="income" fill="#10b981" opacity={0.7} radius={[4, 4, 0, 0]} barSize={period === "daily" ? 4 : 12} />
            <Bar yAxisId="flow" dataKey="expense" fill="#ef4444" opacity={0.7} radius={[4, 4, 0, 0]} barSize={period === "daily" ? 4 : 12} />
            <Line
              yAxisId="balance"
              type="monotone"
              dataKey="balance"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={period === "daily" ? false : { r: 3, fill: "#3b82f6" }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
