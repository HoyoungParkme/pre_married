/**
 * 모듈: NotFoundPage.tsx
 * 경로: src/pages/NotFoundPage.tsx
 * 목적: 404 페이지.
 */
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-5xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">
        404
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        페이지를 찾을 수 없어요.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
