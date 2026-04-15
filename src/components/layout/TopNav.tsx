/**
 * 모듈: TopNav.tsx
 * 경로: src/components/layout/TopNav.tsx
 * 목적: 상단 고정 네비게이션 바 (로고 + 테마 토글 + 주요 메뉴).
 */
import { NavLink } from "react-router-dom";
import { HeartHandshake } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { RoomStatusIndicator } from "@/components/room/RoomStatus";

const MENU = [
  { to: "/", label: "대시보드", end: true },
  { to: "/settings", label: "설정" },
  { to: "/checklist", label: "체크리스트" },
  { to: "/wishlist", label: "위시리스트" },
  { to: "/tips", label: "팁" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-2 font-extrabold text-slate-800 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center">
            <HeartHandshake className="w-4 h-4" />
          </span>
          <span className="hidden sm:block tracking-tight">신혼 마스터 플랜</span>
        </NavLink>

        <nav className="flex-1 overflow-x-auto">
          <ul className="flex items-center gap-1 sm:gap-2 justify-center sm:justify-start">
            {MENU.map((m) => (
              <li key={m.to}>
                <NavLink
                  to={m.to}
                  end={m.end}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-brand-500 text-white"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  {m.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <RoomStatusIndicator />
        <ThemeToggle />
      </div>
    </header>
  );
}
