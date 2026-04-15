/**
 * 모듈: SectionHeader.tsx
 * 경로: src/components/ui/SectionHeader.tsx
 * 목적: 섹션 상단의 번호/아이콘/제목 블록.
 */
import type { ReactNode } from "react";

interface Props {
  index?: ReactNode;
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function SectionHeader({ index, icon, title, description }: Props) {
  return (
    <header className="mb-6 flex items-start gap-3">
      {index !== undefined && (
        <span className="mt-0.5 w-8 h-8 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold text-sm">
          {index}
        </span>
      )}
      {icon && <span className="mt-1 text-brand-500">{icon}</span>}
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
