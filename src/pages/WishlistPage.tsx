/**
 * 모듈: WishlistPage.tsx
 * 경로: src/pages/WishlistPage.tsx
 * 목적: 혼수 위시리스트 CRUD. 총합은 혼수 예산과 비교할 수 있도록 표시.
 */
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useBudgetStore } from "@/store/useBudgetStore";
import { formatNumber, parseNumber } from "@/utils/format";
import type { WishlistItem } from "@/types/budget";

const CATEGORIES: WishlistItem["category"][] = [
  "가전",
  "가구",
  "주방",
  "생활",
  "기타",
];

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const add = useWishlistStore((s) => s.add);
  const update = useWishlistStore((s) => s.update);
  const remove = useWishlistStore((s) => s.remove);
  const weddingItemsBudget = useBudgetStore((s) => s.input.weddingItems);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<WishlistItem["category"]>("가전");
  const [price, setPrice] = useState(0);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price, 0),
    [items],
  );
  const purchased = useMemo(
    () =>
      items
        .filter((i) => i.status === "구매완료")
        .reduce((sum, i) => sum + i.price, 0),
    [items],
  );
  const diff = weddingItemsBudget - total;

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed || price <= 0) {
      alert("이름과 가격을 올바르게 입력해 주세요.");
      return;
    }
    add({ name: trimmed, category, price, status: "예정" });
    setName("");
    setPrice(0);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          혼수 위시리스트
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          구매할 혼수 품목을 등록하고 합계를 혼수 예산과 비교해 보세요.
        </p>
      </header>

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
            {formatNumber(total)}원{" "}
            <span className="text-sm text-slate-500">(구매 완료 {formatNumber(purchased)}원)</span>
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

      <Card as="section" className="p-6 sm:p-8">
        <SectionHeader
          index={<Plus className="w-4 h-4" />}
          title="항목 추가"
          description="이름/분류/가격을 입력하세요."
        />
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px_160px_auto] gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 드럼 세탁기"
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-brand-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as WishlistItem["category"])}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-brand-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="text"
            inputMode="numeric"
            value={formatNumber(price)}
            onChange={(e) => setPrice(parseNumber(e.target.value))}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-right outline-none focus:border-brand-500"
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

      <Card as="section" className="p-6 sm:p-8 overflow-x-auto">
        <SectionHeader title="품목 목록" />
        {items.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            아직 등록된 품목이 없습니다.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 pr-4 font-semibold">이름</th>
                <th className="py-3 pr-4 font-semibold">분류</th>
                <th className="py-3 pr-4 font-semibold text-right">가격</th>
                <th className="py-3 pr-4 font-semibold">상태</th>
                <th className="py-3 pr-2 text-right font-semibold">동작</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <td className="py-3 pr-4 font-semibold text-slate-800 dark:text-slate-100">
                    {item.name}
                  </td>
                  <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                    {item.category}
                  </td>
                  <td className="py-3 pr-4 text-right text-slate-700 dark:text-slate-200">
                    {formatNumber(item.price)}원
                  </td>
                  <td className="py-3 pr-4">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        update(item.id, { status: e.target.value as WishlistItem["status"] })
                      }
                      className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                        item.status === "구매완료"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-900"
                          : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                      }`}
                    >
                      <option value="예정">예정</option>
                      <option value="구매완료">구매완료</option>
                    </select>
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
