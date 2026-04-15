/**
 * 모듈: WishlistPage.tsx
 * 경로: src/pages/WishlistPage.tsx
 * 목적: 혼수 관리. 전체/필수/선택 탭 + 카테고리 필터.
 */
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useBudgetStore } from "@/store/useBudgetStore";
import { formatNumber, parseNumber } from "@/utils/format";
import type { WishlistItem } from "@/types/budget";

const CATEGORIES: WishlistItem["category"][] = ["가전", "가구", "주방", "생활", "기타"];
type PriorityTab = "all" | "필수" | "선택";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const add = useWishlistStore((s) => s.add);
  const update = useWishlistStore((s) => s.update);
  const remove = useWishlistStore((s) => s.remove);
  const togglePurchased = useWishlistStore((s) => s.togglePurchased);

  const budgetInput = useBudgetStore((s) => s.input);
  const weddingItemsBudget = budgetInput.savingsAccount + budgetInput.extraFunds;

  const [tab, setTab] = useState<PriorityTab>("all");
  const [categoryFilter, setCategoryFilter] = useState<WishlistItem["category"] | "all">("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<WishlistItem["category"]>("가전");
  const [newPriority, setNewPriority] = useState<WishlistItem["priority"]>("필수");
  const [newCondition, setNewCondition] = useState<WishlistItem["condition"]>("새제품");
  const [newPrice, setNewPrice] = useState(0);

  const filtered = useMemo(() => {
    let list = items;
    if (tab !== "all") list = list.filter((i) => i.priority === tab);
    if (categoryFilter !== "all") list = list.filter((i) => i.category === categoryFilter);
    return list;
  }, [items, tab, categoryFilter]);

  const total = useMemo(() => items.reduce((s, i) => s + i.price, 0), [items]);
  const purchasedTotal = useMemo(() => items.filter((i) => i.purchased).reduce((s, i) => s + i.price, 0), [items]);
  const purchasedCount = filtered.filter((i) => i.purchased).length;

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    add({ name: trimmed, category: newCategory, priority: newPriority, condition: newCondition, purchased: false, price: newPrice });
    setNewName("");
    setNewPrice(0);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">혼수</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">구매할 품목을 관리하세요.</p>
        </div>
      </header>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/50">
          <p className="text-[11px] text-gray-400 mb-1">혼수 예산</p>
          <p className="text-base font-bold text-gray-900 dark:text-gray-100 tabular-nums">{formatNumber(weddingItemsBudget)}원</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/50">
          <p className="text-[11px] text-gray-400 mb-1">총합 (구매 {formatNumber(purchasedTotal)}원)</p>
          <p className="text-base font-bold text-gray-900 dark:text-gray-100 tabular-nums">{formatNumber(total)}원</p>
        </div>
        <div className={`bg-white dark:bg-gray-900 rounded-2xl p-4 border ${weddingItemsBudget - total >= 0 ? "border-emerald-200" : "border-rose-200"}`}>
          <p className="text-[11px] text-gray-400 mb-1">예산 대비</p>
          <p className={`text-base font-bold tabular-nums ${weddingItemsBudget - total >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
            {weddingItemsBudget - total >= 0 ? "+" : ""}{formatNumber(weddingItemsBudget - total)}원
          </p>
        </div>
      </div>

      {/* 탭 + 카테고리 필터 */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          {/* 전체/필수/선택 탭 */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-0.5">
            {([["all", "전체"], ["필수", "필수"], ["선택", "선택"]] as [PriorityTab, string][]).map(([v, l]) => (
              <button key={v} onClick={() => setTab(v)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${tab === v ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}>
                {l}
              </button>
            ))}
          </div>

          {/* 카테고리 필터 */}
          <div className="flex gap-1 flex-wrap">
            <button onClick={() => setCategoryFilter("all")}
              className={`px-2 py-1 text-[11px] font-semibold rounded-lg ${categoryFilter === "all" ? "bg-brand-500 text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
              전체
            </button>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategoryFilter(c)}
                className={`px-2 py-1 text-[11px] font-semibold rounded-lg ${categoryFilter === c ? "bg-brand-500 text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-3">{filtered.length}개 중 {purchasedCount}개 구매</p>

        {/* 품목 테이블 */}
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">항목이 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-fixed">
              <colgroup>
                <col className="w-10" />
                <col style={{ width: "40%" }} />
                <col className="w-16" />
                <col className="w-20" />
                <col style={{ width: "25%" }} />
                <col className="w-8" />
              </colgroup>
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="py-2 pr-2 font-medium">구매</th>
                  <th className="py-2 pr-2 font-medium">이름</th>
                  <th className="py-2 pr-2 font-medium">분류</th>
                  <th className="py-2 pr-2 font-medium">상태</th>
                  <th className="py-2 pr-2 font-medium text-right">가격</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className={`border-b border-gray-50 dark:border-gray-800/50 last:border-0 ${item.purchased ? "opacity-50" : ""}`}>
                    <td className="py-2.5 pr-2">
                      <input type="checkbox" checked={item.purchased} onChange={() => togglePurchased(item.id)}
                        className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 cursor-pointer" />
                    </td>
                    <td className={`py-2.5 pr-2 font-medium ${item.purchased ? "line-through text-gray-400" : "text-gray-900 dark:text-gray-100"}`}>
                      {item.name}
                    </td>
                    <td className="py-2.5 pr-2 text-gray-500 text-xs">{item.category}</td>
                    <td className="py-2.5 pr-2">
                      <select value={item.condition} onChange={(e) => update(item.id, { condition: e.target.value as WishlistItem["condition"] })}
                        className={`px-1.5 py-0.5 rounded text-[11px] font-semibold border cursor-pointer ${item.condition === "새제품" ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-900" : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-900"}`}>
                        <option value="새제품">새제품</option>
                        <option value="중고">중고</option>
                      </select>
                    </td>
                    <td className="py-2.5 pr-2 text-right">
                      <input type="text" inputMode="numeric" value={formatNumber(item.price)}
                        onChange={(e) => update(item.id, { price: parseNumber(e.target.value) })}
                        className="w-24 text-right px-1 py-0.5 rounded border border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:border-brand-500 bg-transparent text-gray-700 dark:text-gray-200 outline-none text-sm font-mono" />
                      <span className="text-gray-400 text-xs ml-0.5">원</span>
                    </td>
                    <td className="py-2.5">
                      <button onClick={() => remove(item.id)} className="p-1 rounded text-gray-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/30">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 추가 폼 */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800/50 mt-3">
          {!showAddForm ? (
            <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600">
              <Plus className="w-3.5 h-3.5" /> 항목 추가
            </button>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="품목 이름" autoFocus
                  className="px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-xs outline-none focus:border-brand-500" />
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as WishlistItem["category"])}
                  className="px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-xs">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as WishlistItem["priority"])}
                  className="px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-xs">
                  <option value="필수">필수</option><option value="선택">선택</option>
                </select>
                <select value={newCondition} onChange={(e) => setNewCondition(e.target.value as WishlistItem["condition"])}
                  className="px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-xs">
                  <option value="새제품">새제품</option><option value="중고">중고</option>
                </select>
                <input type="text" inputMode="numeric" value={newPrice ? formatNumber(newPrice) : ""} onChange={(e) => setNewPrice(parseNumber(e.target.value))} placeholder="가격"
                  className="px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-xs text-right outline-none focus:border-brand-500" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleAdd} className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs">추가</button>
                <button onClick={() => setShowAddForm(false)} className="px-3 py-1.5 rounded-lg text-xs text-gray-500">취소</button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
