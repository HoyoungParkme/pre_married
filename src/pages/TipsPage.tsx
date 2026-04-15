/**
 * 모듈: TipsPage.tsx
 * 경로: src/pages/TipsPage.tsx
 * 목적: 결혼 준비 절약/실무 팁 정적 콘텐츠.
 */
import { Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { TIPS } from "@/constants/defaults";

export default function TipsPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-500">
          <Lightbulb className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            실속 있는 신혼 준비 팁
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            주거·예식·혼수·저축까지, 실제로 돈이 되는 요령만 모았습니다.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TIPS.map((tip) => (
          <Card key={tip.title} className="p-6">
            <div className="inline-block px-2 py-1 text-xs font-bold rounded-md bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300 mb-3">
              {tip.tag}
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
              {tip.title}
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {tip.body}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
