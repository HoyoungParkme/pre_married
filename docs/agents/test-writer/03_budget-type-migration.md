# 테스트 작성 보고서

## 작성 대상
- 테스트 대상 파일: `src/store/useBudgetStore.ts`, `src/utils/calculate.ts`
- 테스트 파일: `src/store/useBudgetStore.test.ts`, `src/utils/calculate.test.ts`
- 테스트 프레임워크: vitest

## 변경 내용 요약

### BudgetInput 필드명 변경 (13 → 7 필드)
| 구 필드 | 신 필드 |
|:--|:--|
| baseFunds | savingsAccount |
| livingRent | monthlyRent |
| livingMaint | monthlyMaint |
| livingUtil | monthlyUtil |
| livingFood | monthlyFood |
| savingMonths, jeonseTotal, lhSupportAmount 등 | 제거됨 |

### calculate.ts 함수 변경
| 제거된 함수 | 추가된 함수 |
|:--|:--|
| computeSummary | buildTimeline(input, transactions) |
| buildMonthlyBalanceSeries | calcMonthlyNet(input) |

## 작성한 테스트 요약

### useBudgetStore.test.ts

| 테스트 대상 | 정상 | 에러 | 경계값 | 엣지 | 합계 |
|:--|:--|:--|:--|:--|:--|
| 초기값 | 1 | 0 | 0 | 0 | 1 |
| setField | 3 | 0 | 0 | 0 | 3 |
| replaceAll | 1 | 0 | 0 | 0 | 1 |
| reset | 1 | 0 | 0 | 0 | 1 |
| 합계 | 6 | 0 | 0 | 0 | 6 |

주요 변경 사항:
- `baseFunds` → `savingsAccount`로 필드명 수정
- `livingRent` → `monthlyRent`로 필드명 수정
- `savingMonths: 24` 참조 제거 (해당 필드 삭제됨), `monthlySavings` 검증으로 대체
- `setField("monthlyRent", ...)` 테스트 케이스 추가

### calculate.test.ts

| 테스트 대상 | 정상 | 에러 | 경계값 | 엣지 | 합계 |
|:--|:--|:--|:--|:--|:--|
| calcMonthlyNet | 1 | 1 | 1 | 0 | 3 |
| buildTimeline | 6 | 1 | 1 | 1 | 9 |
| 합계 | 7 | 2 | 2 | 1 | 12 |

주요 설계 결정:
- `buildTimeline`은 내부에서 `getCurrentMonth()`(현재 날짜)를 사용하므로 `vi.useFakeTimers()`로 `2026-04-01`에 고정하여 결정론적 테스트를 구성했다
- 기대값(15개 포인트, 첫 balance 등)은 `addMonths`, `monthDiff` 로직을 직접 추적하여 계산했다

## 테스트 실행 결과
- 전체: 18개
- 통과: 18개
- 실패: 0개
- 스킵: 0개

## 커버하지 못한 부분
- `buildTimeline` 내부 유틸 함수(`addMonths`, `monthDiff`, `formatMonthLabel`)는 export되지 않아 직접 테스트 불가. `buildTimeline`의 결과를 통해 간접 검증함.
- 월 경계값(12월 → 1월 넘김) 케이스: `addMonths` 로직은 간접적으로 커버되나 명시적 경계값 테스트는 없음. [확인 필요]

## 테스트 실행 명령어
- `npx vitest run src/store/useBudgetStore.test.ts src/utils/calculate.test.ts`
- 전체 실행: `npx vitest run`
