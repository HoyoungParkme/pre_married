/**
 * 모듈: ExportButton.tsx
 * 경로: src/components/dashboard/ExportButton.tsx
 * 목적: 대시보드 DOM 영역을 PNG로 저장한다 (html-to-image).
 */
import { useState, type RefObject } from "react";
import { Download, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";

interface Props {
  /** 캡처할 영역의 ref */
  targetRef: RefObject<HTMLElement>;
  /** 파일명 (확장자 제외) */
  filename?: string;
}

export function ExportButton({ targetRef, filename = "pre-married-dashboard" }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!targetRef.current) return;
    setLoading(true);
    try {
      const dataUrl = await toPng(targetRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: getComputedStyle(document.body).backgroundColor,
      });
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("PNG 저장 실패:", err);
      alert("이미지 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label="대시보드를 이미지로 저장"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold text-sm transition-colors"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      이미지로 저장
    </button>
  );
}
