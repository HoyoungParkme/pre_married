# 테스트 작성 보고서

## 작성 대상

- 테스트 대상 파일: `src/store/useBudgetStore.ts`, `src/utils/calculate.ts`
- 테스트 파일: `src/store/useBudgetStore.test.ts`, `src/utils/calculate.test.ts`
- 테스트 프레임워크: vitest

## 변경 배경

`BudgetInput`이 `savingsAccount` / `extraFunds` 2필드로 축소되고, 월 고정비는 `RecurringItem[]`으로 분리되었다.

- 제거된 필드: `monthlySavings`, `monthlyRent`, `monthlyMaint`, `monthlyUtil`, `monthlyFood`
- 새 타입: `RecurringItem` (`id`, `label`, `amount`, `day`, `type`)
- 시그니처 변경: `buildTimeline(input, recurring, transactions, checklistItems?)`
- 시그니처 변경: `calcMonthlyNet(recurring: RecurringItem[]) → number`

## 수정 내용

### useBudgetStore.test.ts

| 수정 항목 | 내용 |
|:--|:--|
| `monthlySavings` 테스트 제거 | 필드 자체가 삭제됨 |
| `monthlyRent` 테스트 제거 | 필드 자체가 삭제됨 |
| `replaceAll` 테스트 | `monthlySavings` 참조 제거, 2필드만 사용하도록 수정 |
| `reset` 테스트 | 두 필드 모두 변경 후 복원 확인으로 강화 |
| `extraFunds` setField 테스트 추가 | 기존에 없던 extraFunds 단독 변경 케이스 추가 |
| 두 필드 연속 변경 테스트 추가 | 독립성 검증 |

### calculate.test.ts

| 수정 항목 | 내용 |
|:--|:--|
| `DEFAULT_RECURRING` import 추가 | `@/constants/defaults`에서 import |
| `RecurringItem` 타입 import 추가 | `@/types/budget`에서 import |
| `makeRecurring` 헬퍼 추가 | 테스트용 RecurringItem 생성 |
| `calcMonthlyNet` 모든 케이스 | `BudgetInput` → `RecurringItem[]` 인자로 변경 |
| `buildTimeline` 모든 케이스 | 두 번째 인자로 `DEFAULT_RECURRING` 또는 커스텀 배열 전달 |
| `recurring=[]` 케이스 추가 | 반복 항목 없을 때 잔액 불변 검증 |
| 수입만/지출만 케이스 추가 | RecurringItem 타입별 동작 검증 |

## 작성한 테스트 요약

### useBudgetStore.test.ts

| 테스트 대상 | 정상 | 에러 | 경계값 | 엣지 | 합계 |
|:--|:--|:--|:--|:--|:--|
| 초기값 | 1 | 0 | 0 | 0 | 1 |
| setField | 3 | 0 | 0 | 0 | 3 |
| replaceAll | 1 | 0 | 0 | 0 | 1 |
| reset | 1 | 0 | 0 | 0 | 1 |
| 합계 | 6 | 0 | 0 | 0 | 6 |

### calculate.test.ts

| 테스트 대상 | 정상 | 에러 | 경계값 | 엣지 | 합계 |
|:--|:--|:--|:--|:--|:--|
| calcMonthlyNet | 3 | 1 | 1 | 0 | 5 |
| buildTimeline | 7 | 0 | 2 | 2 | 11 |
| 합계 | 10 | 1 | 3 | 2 | 16 |

## 테스트 실행 결과

- 전체: 22개
- 통과: 22개
- 실패: 0개
- 스킵: 0개

## 커버하지 못한 부분

- `buildTimeline`의 `checklistItems` 옵션 인자: 기존 테스트에서도 다루지 않았고, 이번 변경 범위에 해당하지 않아 제외

## 테스트 실행 명령어

```
npx vitest run src/store/useBudgetStore.test.ts src/utils/calculate.test.ts
```
