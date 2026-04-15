/**
 * 모듈: defaults.ts
 * 경로: src/constants/defaults.ts
 * 목적: 예산 초기값, 기본 거래, 체크리스트, 프리셋, 절약 팁 데이터.
 */
import type { BudgetInput, RecurringItem, Transaction, ChecklistItem } from "@/types/budget";

/** 초기 자금 기본값 */
export const DEFAULT_BUDGET: BudgetInput = {
  savingsAccount: 40_000_000,
  extraFunds: 50_000_000,
};

/** 매월 반복 항목 기본값 */
export const DEFAULT_RECURRING: RecurringItem[] = [
  { id: "r1", label: "월 저축", amount: 1_500_000, day: 25, type: "income" },
  { id: "r2", label: "월세", amount: 500_000, day: 5, type: "expense" },
  { id: "r3", label: "관리비", amount: 65_000, day: 25, type: "expense" },
  { id: "r4", label: "공과금", amount: 140_000, day: 15, type: "expense" },
  { id: "r5", label: "식비", amount: 500_000, day: 1, type: "expense" },
];

/** 기본 일회성 거래 항목 */
export const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: "t1", date: "2026-06-01", label: "전세 자기부담", amount: -32_250_000, category: "주거" },
  { id: "t2", date: "2026-08-15", label: "혼수", amount: -5_000_000, category: "혼수" },
  { id: "t3", date: "2026-09-20", label: "신혼여행", amount: -5_500_000, category: "결혼" },
  { id: "t4", date: "2026-11-08", label: "결혼식", amount: -15_000_000, category: "결혼" },
];

/** 오늘 기준 N일 뒤 날짜 (YYYY-MM-DD) */
function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 결혼 준비 체크리스트 초기 시드 (오늘 기준 날짜 자동 계산) */
export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  // 지금 당장
  { id: "c1", date: daysFromNow(0), text: "예식장 후보 3곳 방문 및 견적 요청", done: false, type: "memo", amount: 0 },
  { id: "c2", date: daysFromNow(7), text: "상견례 일정 잡기", done: false, type: "memo", amount: 0 },
  { id: "c3", date: daysFromNow(14), text: "전세 대출(LH 등) 사전 심사 신청", done: false, type: "memo", amount: 0 },
  // 3개월 뒤
  { id: "c4", date: daysFromNow(90), text: "스드메 계약", done: false, type: "expense", amount: 3_000_000 },
  { id: "c5", date: daysFromNow(97), text: "신혼여행 항공·숙소 예약", done: false, type: "expense", amount: 5_500_000 },
  { id: "c6", date: daysFromNow(104), text: "혼수 가전·가구 리스트 확정", done: false, type: "memo", amount: 0 },
  // 5개월 뒤
  { id: "c7", date: daysFromNow(150), text: "청첩장 발송", done: false, type: "expense", amount: 500_000 },
  { id: "c8", date: daysFromNow(157), text: "예단·예물 결정", done: false, type: "expense", amount: 2_000_000 },
  { id: "c9", date: daysFromNow(164), text: "신혼집 입주 청소 예약", done: false, type: "expense", amount: 200_000 },
  // 6개월 뒤
  { id: "c10", date: daysFromNow(173), text: "본식 리허설 & 최종 하객 확인", done: false, type: "memo", amount: 0 },
  { id: "c11", date: daysFromNow(176), text: "신혼여행 짐 싸기 & 환전", done: false, type: "memo", amount: 0 },
  { id: "c12", date: daysFromNow(179), text: "혼인신고서 작성 준비", done: false, type: "memo", amount: 0 },
];

/** 절약 팁 정적 콘텐츠 */
export const TIPS: Array<{ title: string; body: string; tag: string }> = [
  {
    tag: "주거",
    title: "LH 전세대출 금리 우대 조건 확인",
    body: "청년·신혼부부 대상 금리 우대가 많다. 소득·자녀 유무·최초 주택 여부에 따라 0.2~0.7%p 내려갈 수 있으니 신청 전 반드시 체크.",
  },
  {
    tag: "예식",
    title: "평일·오전·저녁 예식은 보통 20~40% 저렴",
    body: "피크 타임(토/일 오후)을 피하면 식대·대관료가 크게 줄어든다. 가족 위주 하객이라면 적극 고려.",
  },
  {
    tag: "스드메",
    title: "스드메는 비교견적이 답",
    body: "웨딩플래너 없이 직접 스튜디오/드레스/메이크업을 패키지로 묶을 때 200~400만원까지 차이난다.",
  },
  {
    tag: "혼수",
    title: "가전은 '등급'보다 '용량'이 먼저",
    body: "2인 가구 기준 250L급 냉장고, 10kg급 세탁기로도 충분. 무조건 대용량 1등급을 고집하면 초기 비용이 크게 늘어난다.",
  },
  {
    tag: "혼수",
    title: "중고거래 적극 활용",
    body: "소파·식탁·TV 같은 품목은 당근·번개장터 반값 매물이 흔하다. 예산을 300~500만원 단위로 줄일 수 있다.",
  },
  {
    tag: "신혼여행",
    title: "성수기 한 주만 피해도 1~200만원 절감",
    body: "항공권은 출발일 기준 ±3일, 환승/경유 옵션을 열어 두면 같은 목적지라도 큰 차이가 난다.",
  },
  {
    tag: "저축",
    title: "신혼부부 청약·적금 상품 우선 개설",
    body: "청년·신혼 우대 적금, ISA 등 비과세 혜택이 있는 상품부터 채워두면 결혼 후 자금 운용이 훨씬 편해진다.",
  },
  {
    tag: "생활비",
    title: "공과금은 자동이체 + 고정비 통장 분리",
    body: "공과금·관리비·통신비를 전용 계좌로 분리해 두면 월 지출 변동성이 낮아지고, 저축액을 일정하게 유지할 수 있다.",
  },
  {
    tag: "세금",
    title: "혼인 증여공제 1.5억 활용",
    body: "혼인 신고일 전후 2년 이내 부모로부터 받은 증여는 1.5억까지 공제. 전세금 마련 시 꼭 확인.",
  },
  {
    tag: "예산",
    title: "'예비비' 10% 따로 잡기",
    body: "결혼 준비 중 예상 못 한 비용(답례품, 추가 미팅, 수선비 등)이 평균 7~12% 발생한다. 처음부터 예비비로 빼두면 멘붕을 피한다.",
  },
];
