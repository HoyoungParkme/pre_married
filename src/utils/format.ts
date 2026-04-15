/**
 * 모듈: format.ts
 * 경로: src/utils/format.ts
 * 목적: 숫자 포맷팅/파싱 유틸리티.
 */

/**
 * 숫자를 천 단위 콤마 문자열로 변환한다.
 * null, undefined, NaN은 "0"으로 처리한다.
 */
export function formatNumber(num: number | null | undefined): string {
  if (num == null || Number.isNaN(num)) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * 콤마가 포함된 문자열을 정수로 파싱한다. 실패 시 0.
 */
export function parseNumber(str: string): number {
  const parsed = parseInt(str.replace(/,/g, ""), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * 원 단위 금액을 "1억 2,345만원" 형태의 한글 축약 문자열로 변환한다.
 * 대시보드 요약 표시용.
 */
export function formatKoreanMoney(num: number): string {
  if (num == null || Number.isNaN(num)) return "0원";
  const eok = Math.floor(num / 100_000_000);
  const man = Math.floor((num % 100_000_000) / 10_000);
  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok}억`);
  if (man > 0) parts.push(`${formatNumber(man)}만`);
  if (parts.length === 0) return `${formatNumber(num)}원`;
  return `${parts.join(" ")}원`;
}
