/**
 * 모듈: budget.ts
 * 경로: src/types/budget.ts
 * 목적: 예산/자금 시뮬레이션 관련 타입 정의.
 */

/** 사용자가 입력하는 초기 자금 */
export interface BudgetInput {
  /** 적금통장 잔액 (원) */
  savingsAccount: number;
  /** 추가 자금 (원) */
  extraFunds: number;
}

/** 매월 반복되는 수입/지출 항목 */
export interface RecurringItem {
  id: string;
  /** 이름 (월세, 관리비, 식비 등) */
  label: string;
  /** 금액 (양수) */
  amount: number;
  /** 매월 N일 (1~28) */
  day: number;
  /** 수입 또는 지출 */
  type: "income" | "expense";
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
  /** 누적 잔액 (라인 차트) */
  balance: number;
  /** 해당 월 수입 합계 (막대 차트) */
  income: number;
  /** 해당 월 지출 합계 (막대 차트, 양수) */
  expense: number;
  label: string;
}

/** 체크리스트 항목 */
export interface ChecklistItem {
  id: string;
  /** 날짜 (YYYY-MM-DD 형식) */
  date: string;
  text: string;
  done: boolean;
  /** 분류: 메모(기본) / 입금 / 지출 */
  type: "memo" | "income" | "expense";
  /** 금액 (memo는 0, income/expense는 양수) */
  amount: number;
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
