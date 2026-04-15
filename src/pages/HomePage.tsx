/**
 * 모듈: HomePage.tsx
 * 경로: src/pages/HomePage.tsx
 * 목적: 대시보드 메인 페이지. 잔액 요약 + 타임라인 차트 + 거래 목록.
 */
import { useRef } from "react";
import { BalanceSummary } from "@/components/dashboard/BalanceSummary";
import { TimelineChart } from "@/components/dashboard/TimelineChart";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { ExportButton } from "@/components/dashboard/ExportButton";

export default function HomePage() {
  const snapshotRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            신혼 준비 마스터 플랜
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            자금 흐름을 한눈에 확인하세요.
          </p>
        </div>
        <ExportButton targetRef={snapshotRef} />
      </header>

      <div ref={snapshotRef} className="space-y-8">
        <BalanceSummary />
        <TimelineChart />
        <TransactionList />
      </div>
    </div>
  );
}
