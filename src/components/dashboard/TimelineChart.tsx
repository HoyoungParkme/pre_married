/**
 * 모듈: TimelineChart.tsx
 * 경로: src/components/dashboard/TimelineChart.tsx
 * 목적: 잔액(라인) + 수입/지출(막대) 복합 차트.
 *       일별(기본 1주)/주별(기본 1개월)/월별(기본 1년)/년도별 + from-to 필터.
 */
import { useMemo, useState, useEffect } from "react";
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

/** 현재 월 (YYYY-MM) */
function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/** YYYY-MM에 N개월 더하기 */
function addMonths(ym: string, n: number): string {
  const [y, m] = ym.split("-").map(Number);
  const total = y * 12 + (m - 1) + n;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`;
}

/** 기간별 기본 from-to 계산 */
function getDefaultRange(period: Period): { from: string; to: string } {
  const now = getCurrentMonth();
  switch (period) {
    case "daily":
      return { from: now, to: now }; // 1개월 (일별로 보면 ~30일)
    case "weekly":
      return { from: now, to: addMonths(now, 2) }; // 3개월
    case "monthly":
      return { from: now, to: addMonths(now, 11) }; // 1년
    case "yearly":
      return { from: now, to: addMonths(now, 35) }; // 3년
  }
}

/** 월별 → 일별 확장 */
function toDaily(data: MonthlyBalance[]): MonthlyBalance[] {
  if (data.length < 1) return data;
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

/** 월별 → 주별 */
function toWeekly(data: MonthlyBalance[]): MonthlyBalance[] {
  const result: MonthlyBalance[] = [];

  for (const cur of data) {
    const [, m] = cur.month.split("-").map(Number);
    for (let w = 0; w < 4; w++) {
      const prev = result.length > 0 ? result[result.length - 1].balance : cur.balance - cur.income + cur.expense;
      const wi = Math.round(cur.income / 4);
      const we = Math.round(cur.expense / 4);

      result.push({
        month: `${cur.month}-W${w + 1}`,
        balance: w === 3 ? cur.balance : Math.round(prev + wi - we),
        income: wi,
        expense: we,
        label: `${m}월 ${w + 1}주`,
      });
    }
  }
  return result;
}

/** 월별 → 년도별 */
function toYearly(data: MonthlyBalance[]): MonthlyBalance[] {
  const map = new Map<string, { income: number; expense: number; lastBalance: number }>();

  for (const cur of data) {
    const year = cur.month.slice(0, 4);
    const entry = map.get(year) ?? { income: 0, expense: 0, lastBalance: 0 };
    entry.income += cur.income;
    entry.expense += cur.expense;
    entry.lastBalance = cur.balance;
    map.set(year, entry);
  }

  return Array.from(map.entries()).map(([year, v]) => ({
    month: year,
    balance: v.lastBalance,
    income: v.income,
    expense: v.expense,
    label: `${year}년`,
  }));
}

/** 월별 데이터를 from-to로 필터 (YYYY-MM 기준) */
function filterByRange(data: MonthlyBalance[], from: string, to: string): MonthlyBalance[] {
  return data.filter((d) => d.month >= from && d.month <= to);
}

export function TimelineChart() {
  const { timeline } = useBudgetSummary();
  const [period, setPeriod] = useState<Period>("monthly");

  const defaultRange = useMemo(() => getDefaultRange(period), [period]);
  const [from, setFrom] = useState(defaultRange.from);
  const [to, setTo] = useState(defaultRange.to);

  // 기간 변경 시 기본 범위로 리셋
  useEffect(() => {
    const range = getDefaultRange(period);
    setFrom(range.from);
    setTo(range.to);
  }, [period]);

  const chartData = useMemo(() => {
    // 먼저 월별 데이터를 from-to로 필터
    const filtered = filterByRange(timeline, from, to);

    switch (period) {
      case "daily": return toDaily(filtered);
      case "weekly": return toWeekly(filtered);
      case "yearly": return toYearly(filtered);
      default: return filtered;
    }
  }, [timeline, period, from, to]);

  if (timeline.length === 0) return null;

  const periodLabel = PERIOD_OPTIONS.find((o) => o.value === period)?.label ?? "월별";
  const isDense = period === "daily" || (period === "weekly" && chartData.length > 20);

  return (
    <Card as="section" className="p-6 sm:p-8">
      {/* 헤더 + 기간 토글 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {periodLabel} 자금 흐름
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            잔액 추이와 수입/지출을 한눈에 확인하세요.
          </p>
        </div>

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

      {/* 날짜 범위 필터 */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <input
          type="month"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs outline-none focus:border-brand-500"
        />
        <span className="text-slate-400">~</span>
        <input
          type="month"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs outline-none focus:border-brand-500"
        />
        <span className="text-xs text-slate-400">
          ({chartData.length}건)
        </span>
      </div>

      {/* 차트 */}
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
              interval={isDense ? Math.max(1, Math.floor(chartData.length / 8)) : "preserveStartEnd"}
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
                const labels: Record<string, string> = { balance: "잔액", income: "수입", expense: "지출" };
                return [`${formatNumber(value)}원`, labels[name] ?? name];
              }}
              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: "13px" }}
            />
            <Legend
              formatter={(v: string) => ({ balance: "총 잔액", income: "수입", expense: "지출" })[v] ?? v}
              wrapperStyle={{ fontSize: "13px" }}
            />
            <ReferenceLine yAxisId="balance" y={0} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} />

            <Bar yAxisId="flow" dataKey="income" fill="#10b981" opacity={0.7} radius={[4, 4, 0, 0]} barSize={isDense ? 4 : 12} />
            <Bar yAxisId="flow" dataKey="expense" fill="#ef4444" opacity={0.7} radius={[4, 4, 0, 0]} barSize={isDense ? 4 : 12} />
            <Line
              yAxisId="balance"
              type="monotone"
              dataKey="balance"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={isDense ? false : { r: 3, fill: "#3b82f6" }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
