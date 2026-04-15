/**
 * 모듈: SettingsPage.tsx
 * 경로: src/pages/SettingsPage.tsx
 * 목적: 초기 자금 + 매월 반복 항목 설정 페이지.
 */
import { useState } from "react";
import { RotateCcw, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { NumberInput } from "@/components/ui/NumberInput";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useBudgetStore } from "@/store/useBudgetStore";
import { useRecurringStore } from "@/store/useRecurringStore";
import { formatNumber, parseNumber } from "@/utils/format";
import type { RecurringItem } from "@/types/budget";

export default function SettingsPage() {
  const input = useBudgetStore((s) => s.input);
  const setField = useBudgetStore((s) => s.setField);
  const resetBudget = useBudgetStore((s) => s.reset);

  const recurring = useRecurringStore((s) => s.items);
  const addRecurring = useRecurringStore((s) => s.add);
  const updateRecurring = useRecurringStore((s) => s.update);
  const removeRecurring = useRecurringStore((s) => s.remove);
  const resetRecurring = useRecurringStore((s) => s.resetToDefault);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newAmount, setNewAmount] = useState(0);
  const [newDay, setNewDay] = useState(1);
  const [newType, setNewType] = useState<RecurringItem["type"]>("expense");

  const handleAdd = () => {
    if (!newLabel.trim() || newAmount <= 0) return;
    addRecurring({ label: newLabel.trim(), amount: newAmount, day: newDay, type: newType });
    setNewLabel("");
    setNewAmount(0);
    setNewDay(1);
    setShowAddForm(false);
  };

  const handleReset = () => {
    if (confirm("모든 설정을 기본값으로 되돌릴까요?")) {
      resetBudget();
      resetRecurring();
    }
  };

  const incomeItems = recurring.filter((r) => r.type === "income");
  const expenseItems = recurring.filter((r) => r.type === "expense");

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            자금 설정
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            초기 자금과 매월 반복되는 수입/지출을 설정하세요.
          </p>
        </div>
        <button onClick={handleReset} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
          <RotateCcw className="w-4 h-4" /> 초기화
        </button>
      </header>

      {/* 초기 자금 */}
      <Card className="p-6">
        <SectionHeader title="초기 자금" />
        <NumberInput label="적금통장 잔액" value={input.savingsAccount} onChange={(v) => setField("savingsAccount", v)} />
        <NumberInput label="추가 자금" value={input.extraFunds} onChange={(v) => setField("extraFunds", v)} />
      </Card>

      {/* 매월 반복 수입 */}
      <Card className="p-6">
        <SectionHeader title="매월 수입" description="매월 들어오는 금액 (저축, 급여 등)" />
        <RecurringList items={incomeItems} onUpdate={updateRecurring} onRemove={removeRecurring} colorClass="text-emerald-600 dark:text-emerald-400" />
      </Card>

      {/* 매월 반복 지출 */}
      <Card className="p-6">
        <SectionHeader title="매월 지출" description="매월 나가는 고정비 (월세, 관리비, 식비 등)" />
        <RecurringList items={expenseItems} onUpdate={updateRecurring} onRemove={removeRecurring} colorClass="text-rose-500" />
      </Card>

      {/* 항목 추가 */}
      <Card className="p-6">
        {!showAddForm ? (
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-brand-600">
            <Plus className="w-4 h-4" /> 반복 항목 추가
          </button>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="이름 (예: 통신비)"
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm outline-none focus:border-brand-500"
                autoFocus
              />
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as RecurringItem["type"])}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm"
              >
                <option value="expense">지출</option>
                <option value="income">수입</option>
              </select>
              <input
                type="text"
                inputMode="numeric"
                value={newAmount ? formatNumber(newAmount) : ""}
                onChange={(e) => setNewAmount(parseNumber(e.target.value))}
                placeholder="금액"
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm text-right outline-none focus:border-brand-500"
              />
              <div className="flex items-center gap-1">
                <span className="text-sm text-slate-500">매월</span>
                <input
                  type="number"
                  min={1}
                  max={28}
                  value={newDay}
                  onChange={(e) => setNewDay(Number(e.target.value))}
                  className="w-14 px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm text-center outline-none focus:border-brand-500"
                />
                <span className="text-sm text-slate-500">일</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAdd} className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm">추가</button>
              <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">취소</button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

/** 반복 항목 리스트 */
function RecurringList({
  items,
  onUpdate,
  onRemove,
  colorClass,
}: {
  items: RecurringItem[];
  onUpdate: (id: string, patch: Partial<Omit<RecurringItem, "id">>) => void;
  onRemove: (id: string) => void;
  colorClass: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-400">항목이 없습니다.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3 py-2">
          <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">{item.label}</span>
          <span className="text-xs text-slate-400 w-14 text-center">매월 {item.day}일</span>
          <input
            type="text"
            inputMode="numeric"
            value={formatNumber(item.amount)}
            onChange={(e) => onUpdate(item.id, { amount: parseNumber(e.target.value) })}
            className={`w-28 text-right px-2 py-1 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-brand-500 bg-transparent text-sm font-bold outline-none ${colorClass}`}
          />
          <span className="text-xs text-slate-400">원</span>
          <button
            onClick={() => onRemove(item.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/30"
            aria-label={`${item.label} 삭제`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
