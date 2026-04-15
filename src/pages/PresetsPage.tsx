/**
 * 모듈: PresetsPage.tsx
 * 경로: src/pages/PresetsPage.tsx
 * 목적: 여러 시나리오(프리셋) 저장/불러오기/비교.
 */
import { useState } from "react";
import { Plus, Save, Trash2, Upload } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useBudgetStore } from "@/store/useBudgetStore";
import { usePresetStore } from "@/store/usePresetStore";
import { calcMonthlyNet } from "@/utils/calculate";
import { formatNumber } from "@/utils/format";

export default function PresetsPage() {
  const input = useBudgetStore((s) => s.input);
  const replaceAll = useBudgetStore((s) => s.replaceAll);
  const presets = usePresetStore((s) => s.presets);
  const save = usePresetStore((s) => s.save);
  const remove = usePresetStore((s) => s.remove);
  const [name, setName] = useState("");

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      alert("시나리오 이름을 입력해 주세요.");
      return;
    }
    save(trimmed, input);
    setName("");
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          시나리오 비교
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          현재 입력값을 이름 붙여 저장하고, 여러 시나리오를 비교하세요.
        </p>
      </header>

      <Card as="section" className="p-6 sm:p-8">
        <SectionHeader
          index={<Save className="w-4 h-4" />}
          title="현재 입력값 저장"
          description="시뮬레이터에서 조정한 값을 스냅샷으로 남깁니다."
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 알뜰 결혼식, 여유 플랜..."
            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-brand-500"
          />
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> 저장
          </button>
        </div>
      </Card>

      <Card as="section" className="p-6 sm:p-8 overflow-x-auto">
        <SectionHeader title="저장된 시나리오" />
        {presets.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            저장된 시나리오가 없습니다.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 pr-4 font-semibold">이름</th>
                <th className="py-3 pr-4 font-semibold">초기 자금</th>
                <th className="py-3 pr-4 font-semibold">월 저축</th>
                <th className="py-3 pr-4 font-semibold">월 순수입</th>
                <th className="py-3 pr-4 font-semibold text-right">동작</th>
              </tr>
            </thead>
            <tbody>
              {presets.map((p) => {
                const total = p.input.savingsAccount + p.input.extraFunds;
                const net = calcMonthlyNet(p.input);
                return (
                  <tr
                    key={p.id}
                    className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                  >
                    <td className="py-3 pr-4 font-semibold text-slate-800 dark:text-slate-100">
                      {p.name}
                    </td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                      {formatNumber(total)}원
                    </td>
                    <td className="py-3 pr-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                      +{formatNumber(p.input.monthlySavings)}원
                    </td>
                    <td
                      className={`py-3 pr-4 font-bold ${
                        net >= 0
                          ? "text-brand-600 dark:text-brand-400"
                          : "text-rose-500"
                      }`}
                    >
                      {net >= 0 ? "+" : ""}
                      {formatNumber(net)}원
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          title="이 시나리오 불러오기"
                          onClick={() => {
                            replaceAll(p.input);
                            alert(`"${p.name}" 시나리오를 불러왔습니다.`);
                          }}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="삭제"
                          onClick={() => {
                            if (confirm(`"${p.name}"을 삭제할까요?`)) remove(p.id);
                          }}
                          className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
