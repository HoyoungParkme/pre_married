/**
 * 모듈: ChecklistPage.tsx
 * 경로: src/pages/ChecklistPage.tsx
 * 목적: 결혼 준비 체크리스트 (D-180/90/30/7 단계).
 */
import { useMemo, useState } from "react";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useChecklistStore } from "@/store/useChecklistStore";
import type { ChecklistItem } from "@/types/budget";

const STAGES: ChecklistItem["stage"][] = ["D-180", "D-90", "D-30", "D-7"];

export default function ChecklistPage() {
  const items = useChecklistStore((s) => s.items);
  const toggle = useChecklistStore((s) => s.toggle);
  const add = useChecklistStore((s) => s.add);
  const remove = useChecklistStore((s) => s.remove);
  const resetToDefault = useChecklistStore((s) => s.resetToDefault);
  const [stage, setStage] = useState<ChecklistItem["stage"]>("D-180");
  const [text, setText] = useState("");

  const progress = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.round((items.filter((i) => i.done).length / items.length) * 100);
  }, [items]);

  const grouped = useMemo(() => {
    return STAGES.map((s) => ({
      stage: s,
      items: items.filter((i) => i.stage === s),
    }));
  }, [items]);

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    add(stage, trimmed);
    setText("");
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          결혼 준비 체크리스트
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          단계별로 할 일을 점검하세요. 체크는 이 기기에 자동 저장됩니다.
        </p>
      </header>

      <Card className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            전체 진행률
          </span>
          <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
            {progress}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      <Card as="section" className="p-6 sm:p-8">
        <SectionHeader
          index={<Plus className="w-4 h-4" />}
          title="항목 추가"
          description="단계를 선택하고 내용을 입력하세요."
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value as ChecklistItem["stage"])}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-brand-500"
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="예: 예식장 최종 계약"
            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-brand-500"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold"
          >
            <Plus className="w-4 h-4" /> 추가
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {grouped.map((g) => (
          <Card as="section" key={g.stage} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {g.stage}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {g.items.filter((i) => i.done).length}/{g.items.length}
              </span>
            </div>
            {g.items.length === 0 ? (
              <p className="text-sm text-slate-400">이 단계에는 아직 항목이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {g.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggle(item.id)}
                      className="w-5 h-5 accent-brand-500"
                    />
                    <span
                      className={`flex-1 text-sm ${
                        item.done
                          ? "line-through text-slate-400"
                          : "text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {item.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            if (confirm("체크리스트를 기본 항목으로 되돌릴까요? (추가한 내용이 사라집니다)")) {
              resetToDefault();
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 text-sm font-semibold"
        >
          <RotateCcw className="w-4 h-4" /> 기본값으로 리셋
        </button>
      </div>
    </div>
  );
}
