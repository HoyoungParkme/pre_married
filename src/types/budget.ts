/**
 * 모듈: budget.ts
 * 경로: src/types/budget.ts
 * 목적: 예산/자금 시뮬레이션 관련 타입 정의.
 */

/** 사용자가 입력하는 예산 변수 전체 */
export interface BudgetInput {
  /** 기존 보유 자금 (원) */
  baseFunds: number;
  /** 추가 여유 자금 (원) */
  extraFunds: number;
  /** 총 전세금 (원) */
  jeonseTotal: number;
  /** LH 지원금 (원) */
  lhSupportAmount: number;
  /** 월세 + LH 이자 (원) */
  livingRent: number;
  /** 관리비 (원) */
  livingMaint: number;
  /** 공과금 (원) */
  livingUtil: number;
  /** 식비 (원) */
  livingFood: number;
  /** 월 예상 저축액 (원) */
  monthlySavings: number;
  /** 저축 기간 (개월) */
  savingMonths: number;
  /** 혼수 총 비용 (원) */
  weddingItems: number;
  /** 신혼여행 총 비용 (원) */
  honeymoon: number;
  /** 결혼식 총 비용 (원) */
  weddingCost: number;
}

/** 계산에서 파생되는 요약 값 */
export interface BudgetSummary {
  totalFunds: number;
  selfPayAmount: number;
  initialRemain: number;
  totalLivingCost: number;
  totalSavings: number;
  midRemain: number;
  finalRemain: number;
}

/** 저장된 시나리오 프리셋 */
export interface Preset {
  id: string;
  name: string;
  createdAt: number;
  input: BudgetInput;
}

/** 체크리스트 항목 */
export interface ChecklistItem {
  id: string;
  stage: "D-180" | "D-90" | "D-30" | "D-7";
  text: string;
  done: boolean;
}

/** 위시리스트 항목 */
export interface WishlistItem {
  id: string;
  name: string;
  category: "가전" | "가구" | "주방" | "생활" | "기타";
  /** 1차 분류: 필수(당장 필요) / 선택(없어도 됨) */
  priority: "필수" | "선택";
  /** 2차 분류: 새제품 / 중고 */
  condition: "새제품" | "중고";
  /** 구매 여부 */
  purchased: boolean;
  price: number;
}
