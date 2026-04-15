/**
 * 모듈: Card.tsx
 * 경로: src/components/ui/Card.tsx
 * 목적: 라이트/다크 대응 공통 카드 컨테이너.
 */
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
}

export function Card({ children, className = "", as = "div" }: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-card hover:shadow-card-hover transition-shadow ${className}`}
    >
      {children}
    </Tag>
  );
}
