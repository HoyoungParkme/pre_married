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
      className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/50 rounded-2xl shadow-card transition-shadow ${className}`}
    >
      {children}
    </Tag>
  );
}
