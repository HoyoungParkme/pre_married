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

  const handleReset = () => {
    if (confirm("모든 설정을 기본값으로 되돌릴까요?")) {
      resetBudget();
      resetRecurring();
    }
  };

  const incomeItems = recurring.filter((r) => r.type === "income");
  const expenseItems = recurring.filter((r) => r.type === "expense");

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">자금 설정</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            초기 자금과 매월 반복되는 수입/지출을 설정하세요.
          </p>
        </div>
        <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <RotateCcw className="w-3.5 h-3.5" /> 초기화
        </button>
      </header>

      {/* 초기 자금 */}
      <Card className="p-5">
        <SectionHeader title="초기 자금" />
        <NumberInput label="적금통장 잔액" value={input.savingsAccount} onChange={(v) => setField("savingsAccount", v)} />
        <NumberInput label="추가 자금" value={input.extraFunds} onChange={(v) => setField("extraFunds", v)} />
      </Card>

      {/* 매월 수입 + 추가 */}
      <RecurringCard
        title="매월 수입"
        description="매월 들어오는 금액 (저축, 급여 등)"
        items={incomeItems}
        type="income"
        colorClass="text-emerald-600 dark:text-emerald-400"
        onAdd={addRecurring}
        onUpdate={updateRecurring}
        onRemove={removeRecurring}
      />

      {/* 매월 지출 + 추가 */}
      <RecurringCard
        title="매월 지출"
        description="매월 나가는 고정비 (월세, 관리비, 식비 등)"
        items={expenseItems}
        type="expense"
        colorClass="text-rose-500"
        onAdd={addRecurring}
        onUpdate={updateRecurring}
        onRemove={removeRecurring}
      />
    </div>
  );
}

/** 반복 항목 카드 (리스트 + 추가 폼 포함) */
function RecurringCard({
  title,
  description,
  items,
  type,
  colorClass,
  onAdd,
  onUpdate,
  onRemove,
}: {
  title: string;
  description: string;
  items: RecurringItem[];
  type: RecurringItem["type"];
  colorClass: string;
  onAdd: (item: Omit<RecurringItem, "id">) => void;
  onUpdate: (id: string, patch: Partial<Omit<RecurringItem, "id">>) => void;
  onRemove: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(0);
  const [day, setDay] = useState(1);

  const handleAdd = () => {
    if (!label.trim() || amount <= 0) return;
    onAdd({ label: label.trim(), amount, day, type });
    setLabel("");
    setAmount(0);
    setDay(1);
    setShowForm(false);
  };

  return (
    <Card className="p-5">
      <SectionHeader title={title} description={description} />

      {/* 항목 리스트 */}
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 mb-3">항목이 없습니다.</p>
      ) : (
        <div className="space-y-1 mb-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-2">
              <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100">{item.label}</span>
              <span className="text-xs text-gray-400 w-14 text-center">매월 {item.day}일</span>
              <input
                type="text"
                inputMode="numeric"
                value={formatNumber(item.amount)}
                onChange={(e) => onUpdate(item.id, { amount: parseNumber(e.target.value) })}
                className={`w-28 text-right px-2 py-1 rounded-md border border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:border-brand-500 bg-transparent text-sm font-bold outline-none ${colorClass}`}
              />
              <span className="text-xs text-gray-400">원</span>
              <button
                onClick={() => onRemove(item.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/30"
                aria-label={`${item.label} 삭제`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 추가 폼 */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600 pt-2 border-t border-gray-100 dark:border-gray-800/50 w-full"
        >
          <Plus className="w-3.5 h-3.5" /> {type === "income" ? "수입" : "지출"} 항목 추가
        </button>
      ) : (
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800/50 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="이름"
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm outline-none focus:border-brand-500"
              autoFocus
            />
            <input
              type="text"
              inputMode="numeric"
              value={amount ? formatNumber(amount) : ""}
              onChange={(e) => setAmount(parseNumber(e.target.value))}
              placeholder="금액"
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm text-right outline-none focus:border-brand-500"
            />
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">매월</span>
              <input
                type="number"
                min={1}
                max={28}
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-12 px-2 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm text-center outline-none focus:border-brand-500"
              />
              <span className="text-xs text-gray-500">일</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs">추가</button>
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">취소</button>
          </div>
        </div>
      )}
    </Card>
  );
}
