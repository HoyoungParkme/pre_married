/**
 * 모듈: WishlistPage.tsx
 * 경로: src/pages/WishlistPage.tsx
 * 목적: 혼수 위시리스트. 필수/선택 분류 + 새제품/중고 뱃지 + 구매 토글 + 가격 입력.
 */
import { useMemo, useState } from "react";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useBudgetStore } from "@/store/useBudgetStore";
import { formatNumber, parseNumber } from "@/utils/format";
import type { WishlistItem } from "@/types/budget";

const CATEGORIES: WishlistItem["category"][] = ["가전", "가구", "주방", "생활", "기타"];

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const add = useWishlistStore((s) => s.add);
  const update = useWishlistStore((s) => s.update);
  const remove = useWishlistStore((s) => s.remove);
  const togglePurchased = useWishlistStore((s) => s.togglePurchased);
  const resetToDefault = useWishlistStore((s) => s.resetToDefault);
  const weddingItemsBudget = useBudgetStore((s) => s.input.weddingItems);

  // 항목 추가 폼
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<WishlistItem["category"]>("가전");
  const [newPriority, setNewPriority] = useState<WishlistItem["priority"]>("필수");
  const [newCondition, setNewCondition] = useState<WishlistItem["condition"]>("새제품");
  const [newPrice, setNewPrice] = useState(0);

  // 그룹 분류
  const essential = useMemo(() => items.filter((i) => i.priority === "필수"), [items]);
  const optional = useMemo(() => items.filter((i) => i.priority === "선택"), [items]);

  // 통계
  const total = useMemo(() => items.reduce((sum, i) => sum + i.price, 0), [items]);
  const purchasedTotal = useMemo(
    () => items.filter((i) => i.purchased).reduce((sum, i) => sum + i.price, 0),
    [items],
  );
  const diff = weddingItemsBudget - total;

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    add({
      name: trimmed,
      category: newCategory,
      priority: newPriority,
      condition: newCondition,
      purchased: false,
      price: newPrice,
    });
    setNewName("");
    setNewPrice(0);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            혼수 위시리스트
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            필수/선택으로 분류하고, 새제품/중고를 선택해 가성비 있게 준비하세요.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm("기본 품목으로 초기화할까요?")) resetToDefault();
          }}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          title="기본값으로 초기화"
        >
          <RotateCcw className="w-4 h-4" /> 초기화
        </button>
      </header>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">혼수 예산</div>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {formatNumber(weddingItemsBudget)}원
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">위시리스트 총합</div>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {formatNumber(total)}원
            <span className="text-sm text-slate-500 ml-2">
              (구매 {formatNumber(purchasedTotal)}원)
            </span>
          </div>
        </Card>
        <Card className={`p-6 ${diff >= 0 ? "border-emerald-200" : "border-rose-200"}`}>
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">예산 대비</div>
          <div
            className={`text-xl font-bold ${
              diff >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
            }`}
          >
            {diff >= 0 ? "+" : ""}
            {formatNumber(diff)}원
          </div>
        </Card>
      </div>

      {/* 필수 품목 */}
      <ItemGroup
        title="필수 품목"
        emoji="📌"
        items={essential}
        onToggle={togglePurchased}
        onUpdate={update}
        onRemove={remove}
      />

      {/* 선택 품목 */}
      <ItemGroup
        title="선택 품목"
        emoji="💡"
        items={optional}
        onToggle={togglePurchased}
        onUpdate={update}
        onRemove={remove}
      />

      {/* 항목 추가 */}
      <Card as="section" className="p-6">
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-brand-600"
          >
            <Plus className="w-4 h-4" /> 항목 추가
          </button>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="품목 이름"
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-brand-500"
                autoFocus
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as WishlistItem["category"])}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as WishlistItem["priority"])}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              >
                <option value="필수">필수</option>
                <option value="선택">선택</option>
              </select>
              <select
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value as WishlistItem["condition"])}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              >
                <option value="새제품">새제품</option>
                <option value="중고">중고</option>
              </select>
              <input
                type="text"
                inputMode="numeric"
                value={newPrice ? formatNumber(newPrice) : ""}
                onChange={(e) => setNewPrice(parseNumber(e.target.value))}
                placeholder="가격"
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-right outline-none focus:border-brand-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm"
              >
                추가
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

/** 품목 그룹 (필수/선택) */
function ItemGroup({
  title,
  emoji,
  items,
  onToggle,
  onUpdate,
  onRemove,
}: {
  title: string;
  emoji: string;
  items: WishlistItem[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Omit<WishlistItem, "id">>) => void;
  onRemove: (id: string) => void;
}) {
  const purchasedCount = items.filter((i) => i.purchased).length;

  return (
    <Card as="section" className="p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{emoji}</span>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {title}
        </h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          ({items.length}개 중 {purchasedCount}개 구매)
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400 text-sm">항목이 없습니다.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 pr-3 font-semibold w-10">구매</th>
                <th className="py-3 pr-3 font-semibold">이름</th>
                <th className="py-3 pr-3 font-semibold">분류</th>
                <th className="py-3 pr-3 font-semibold">상태</th>
                <th className="py-3 pr-3 font-semibold text-right">가격</th>
                <th className="py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-slate-100 dark:border-slate-800 last:border-0 ${
                    item.purchased ? "opacity-60" : ""
                  }`}
                >
                  {/* 구매 토글 */}
                  <td className="py-3 pr-3">
                    <input
                      type="checkbox"
                      checked={item.purchased}
                      onChange={() => onToggle(item.id)}
                      className="w-4 h-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500 cursor-pointer"
                    />
                  </td>
                  {/* 이름 */}
                  <td
                    className={`py-3 pr-3 font-semibold ${
                      item.purchased
                        ? "line-through text-slate-400 dark:text-slate-500"
                        : "text-slate-800 dark:text-slate-100"
                    }`}
                  >
                    {item.name}
                  </td>
                  {/* 분류 */}
                  <td className="py-3 pr-3 text-slate-600 dark:text-slate-300">
                    {item.category}
                  </td>
                  {/* 새제품/중고 뱃지 */}
                  <td className="py-3 pr-3">
                    <select
                      value={item.condition}
                      onChange={(e) =>
                        onUpdate(item.id, {
                          condition: e.target.value as WishlistItem["condition"],
                        })
                      }
                      className={`px-2 py-1 rounded-md text-xs font-semibold border cursor-pointer ${
                        item.condition === "새제품"
                          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-900"
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-900"
                      }`}
                    >
                      <option value="새제품">새제품</option>
                      <option value="중고">중고</option>
                    </select>
                  </td>
                  {/* 가격 (인라인 편집) */}
                  <td className="py-3 pr-3 text-right">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formatNumber(item.price)}
                      onChange={(e) =>
                        onUpdate(item.id, { price: parseNumber(e.target.value) })
                      }
                      className="w-28 text-right px-2 py-1 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-brand-500 bg-transparent text-slate-700 dark:text-slate-200 outline-none text-sm font-mono"
                    />
                    <span className="text-slate-400 text-xs ml-0.5">원</span>
                  </td>
                  {/* 삭제 */}
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onRemove(item.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
