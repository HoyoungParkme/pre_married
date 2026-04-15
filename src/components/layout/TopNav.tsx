/**
 * 모듈: TopNav.tsx
 * 경로: src/components/layout/TopNav.tsx
 * 목적: 상단 고정 네비게이션 바.
 */
import { NavLink } from "react-router-dom";
import { Heart } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { RoomStatusIndicator } from "@/components/room/RoomStatus";

const MENU = [
  { to: "/", label: "대시보드", end: true },
  { to: "/settings", label: "설정" },
  { to: "/checklist", label: "체크리스트" },
  { to: "/wishlist", label: "혼수" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <NavLink to="/" className="flex items-center gap-2 font-bold text-gray-900 dark:text-gray-100">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center">
            <Heart className="w-3.5 h-3.5" />
          </span>
          <span className="hidden sm:block text-sm tracking-tight">꿀배야 밥먹자</span>
        </NavLink>

        <nav className="flex-1">
          <ul className="flex items-center gap-0.5 justify-center flex-wrap">
            {MENU.map((m) => (
              <li key={m.to}>
                <NavLink
                  to={m.to}
                  end={m.end}
                  className={({ isActive }) =>
                    `px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive
                        ? "bg-brand-500 text-white shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`
                  }
                >
                  {m.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <RoomStatusIndicator />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
