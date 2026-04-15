/**
 * 모듈: Footer.tsx
 * 경로: src/components/layout/Footer.tsx
 * 목적: 앱 하단 저작권/고지.
 */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 dark:border-gray-800/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-xs text-gray-400 dark:text-gray-500 text-center">
        <p>© {new Date().getFullYear()} 꿀배야 집사자</p>
      </div>
    </footer>
  );
}
