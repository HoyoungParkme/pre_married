/**
 * 모듈: Footer.tsx
 * 경로: src/components/layout/Footer.tsx
 * 목적: 앱 하단 저작권/고지.
 */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-sm text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} 꿀배야 집사자. 모든 데이터는 이 기기에만 저장됩니다.</p>
        <p className="opacity-75">
          Built with React · Vite · Tailwind · Hosted on GitHub Pages
        </p>
      </div>
    </footer>
  );
}
