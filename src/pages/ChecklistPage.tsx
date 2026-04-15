/**
 * 모듈: ChecklistPage.tsx
 * 경로: src/pages/ChecklistPage.tsx
 * 목적: 달력 기반 결혼 준비 체크리스트.
 *       월 달력에서 날짜를 클릭하면 해당 날짜의 항목을 보고 추가/토글/삭제.
 */
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useChecklistStore } from "@/store/useChecklistStore";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 해당 월의 달력 그리드 데이터 생성 */
function buildCalendarGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);
  while (grid.length % 7 !== 0) grid.push(null);

  return grid;
}

/** 날짜를 YYYY-MM-DD 문자열로 */
function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function ChecklistPage() {
  const items = useChecklistStore((s) => s.items);
  const toggle = useChecklistStore((s) => s.toggle);
  const add = useChecklistStore((s) => s.add);
  const remove = useChecklistStore((s) => s.remove);
  const resetToDefault = useChecklistStore((s) => s.resetToDefault);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10));
  const [newText, setNewText] = useState("");

  const grid = useMemo(() => buildCalendarGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  /** 날짜별 항목 수 맵 */
  const itemsByDate = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of items) {
      map[item.date] = (map[item.date] ?? 0) + 1;
    }
    return map;
  }, [items]);

  /** 선택한 날짜의 항목 */
  const selectedItems = useMemo(
    () => items.filter((i) => i.date === selectedDate),
    [items, selectedDate],
  );

  const todayStr = today.toISOString().slice(0, 10);

  const goPrev = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };

  const goNext = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const handleAdd = () => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    add(selectedDate, trimmed);
    setNewText("");
  };

  const selectedLabel = (() => {
    const [, m, d] = selectedDate.split("-");
    return `${parseInt(m)}월 ${parseInt(d)}일`;
  })();

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            결혼 준비 체크리스트
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            날짜를 눌러 할 일을 관리하세요.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm("기본 항목으로 초기화할까요?")) resetToDefault();
          }}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <RotateCcw className="w-4 h-4" /> 초기화
        </button>
      </header>

      {/* 달력 */}
      <Card className="p-6">
        {/* 월 네비게이션 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goPrev}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            aria-label="이전 달"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {viewYear}년 {viewMonth + 1}월
          </h2>
          <button
            onClick={goNext}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            aria-label="다음 달"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((w, i) => (
            <div
              key={w}
              className={`text-center text-xs font-semibold py-2 ${
                i === 0 ? "text-rose-400" : i === 6 ? "text-blue-400" : "text-slate-400"
              }`}
            >
              {w}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7">
          {grid.map((day, idx) => {
            if (day === null) return <div key={idx} />;
            const dateStr = toDateStr(viewYear, viewMonth, day);
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            const hasItems = (itemsByDate[dateStr] ?? 0) > 0;
            const dayOfWeek = idx % 7;

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(dateStr)}
                className={`relative py-2.5 text-sm font-medium rounded-lg transition-colors
                  ${isSelected
                    ? "bg-brand-500 text-white"
                    : isToday
                      ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
                      : dayOfWeek === 0
                        ? "text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                        : dayOfWeek === 6
                          ? "text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
              >
                {day}
                {hasItems && (
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                      isSelected ? "bg-white" : "bg-brand-500"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* 선택한 날짜의 항목 */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">
          {selectedLabel}
        </h3>

        {selectedItems.length === 0 && (
          <p className="text-sm text-slate-400 mb-4">이 날짜에 항목이 없습니다.</p>
        )}

        {selectedItems.length > 0 && (
          <ul className="space-y-2 mb-4">
            {selectedItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggle(item.id)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500 cursor-pointer"
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
                  onClick={() => remove(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/30"
                  aria-label={`${item.text} 삭제`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* 항목 추가 */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="할 일 추가..."
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm outline-none focus:border-brand-500"
          />
          <button
            onClick={handleAdd}
            className="px-3 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </Card>
    </div>
  );
}
