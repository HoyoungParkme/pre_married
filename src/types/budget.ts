/**
 * 모듈: budget.ts
 * 경로: src/types/budget.ts
 * 목적: 예산/자금 시뮬레이션 관련 타입 정의.
 */

/** 사용자가 입력하는 자금 + 월 고정비 */
export interface BudgetInput {
  /** 적금통장 잔액 (원) */
  savingsAccount: number;
  /** 추가 자금 (원) */
  extraFunds: number;
  /** 월 저축액 (원) */
  monthlySavings: number;
  /** 월세 (원) */
  monthlyRent: number;
  /** 관리비 (원) */
  monthlyMaint: number;
  /** 공과금 (원) */
  monthlyUtil: number;
  /** 식비 (원) */
  monthlyFood: number;
}

/** 일회성 지출/수입 항목 */
export interface Transaction {
  id: string;
  /** 날짜 (YYYY-MM 형식) */
  date: string;
  /** 내용 */
  label: string;
  /** 금액 (음수 = 지출, 양수 = 수입) */
  amount: number;
  /** 분류 */
  category: "주거" | "결혼" | "혼수" | "기타";
}

/** 월별 잔액 시계열 (차트용) */
export interface MonthlyBalance {
  month: string;
  balance: number;
  label: string;
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
