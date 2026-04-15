/**
 * 모듈: TransactionList.tsx
 * 경로: src/components/dashboard/TransactionList.tsx
 * 목적: 일회성 지출/수입 거래 목록 + 추가 폼.
 */
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useTransactionStore } from "@/store/useTransactionStore";
import { formatNumber, parseNumber } from "@/utils/format";
import type { Transaction } from "@/types/budget";

const CATEGORIES: Transaction["category"][] = ["주거", "결혼", "혼수", "기타"];

const CATEGORY_COLORS: Record<Transaction["category"], string> = {
  주거: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  결혼: "bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  혼수: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  기타: "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function TransactionList() {
  const items = useTransactionStore((s) => s.items);
  const add = useTransactionStore((s) => s.add);
  const remove = useTransactionStore((s) => s.remove);

  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState("");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(0);
  const [isExpense, setIsExpense] = useState(true);
  const [category, setCategory] = useState<Transaction["category"]>("기타");

  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));

  const handleAdd = () => {
    if (!date || !label.trim()) return;
    add({
      date,
      label: label.trim(),
      amount: isExpense ? -Math.abs(amount) : Math.abs(amount),
      category,
    });
    setDate("");
    setLabel("");
    setAmount(0);
    setShowForm(false);
  };

  return (
    <Card as="section" className="p-6 sm:p-8">
      <SectionHeader
        title="일회성 지출 / 수입"
        description="전세, 결혼식, 혼수 등 큰 항목을 날짜와 함께 등록하세요."
      />

      {sorted.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          등록된 거래가 없습니다.
        </p>
      ) : (
        <div className="space-y-2 mb-4">
          {sorted.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <span className="text-sm font-mono text-slate-500 dark:text-slate-400 w-16 shrink-0">
                {t.date}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${CATEGORY_COLORS[t.category]}`}
              >
                {t.category}
              </span>
              <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                {t.label}
              </span>
              <span
                className={`text-sm font-bold tabular-nums ${
                  t.amount >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-500"
                }`}
              >
                {t.amount >= 0 ? "+" : ""}
                {formatNumber(t.amount)}원
              </span>
              <button
                onClick={() => remove(t.id)}
                className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-400 hover:text-rose-500"
                aria-label={`${t.label} 삭제`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-brand-600"
        >
          <Plus className="w-4 h-4" /> 항목 추가
        </button>
      ) : (
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <input
              type="month"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 text-sm"
            />
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="내용"
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 text-sm"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Transaction["category"])}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="flex items-center gap-1">
              <select
                value={isExpense ? "expense" : "income"}
                onChange={(e) => setIsExpense(e.target.value === "expense")}
                className="px-2 py-2 rounded-l-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm w-16"
              >
                <option value="expense">지출</option>
                <option value="income">수입</option>
              </select>
              <input
                type="text"
                inputMode="numeric"
                value={amount ? formatNumber(amount) : ""}
                onChange={(e) => setAmount(parseNumber(e.target.value))}
                placeholder="금액"
                className="flex-1 px-3 py-2 rounded-r-xl border border-l-0 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-right outline-none focus:border-brand-500 text-sm"
              />
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleAdd}
                className="flex-1 px-3 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm"
              >
                추가
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
