# 테스트 작성 보고서

## 작성 대상

- 테스트 대상 파일: `src/store/useChecklistStore.ts`
- 테스트 파일: `src/store/useChecklistStore.test.ts`
- 테스트 프레임워크: vitest v2.1.9

## 변경 배경

`ChecklistItem` 타입에 `type`(`"memo" | "income" | "expense"`)과 `amount`(number) 필드가 추가되고, `add` 시그니처가 `add(date, text)` → `add(item: Omit<ChecklistItem, "id">)` 형태로 변경되었다. 아울러 `update(id, patch)` 액션이 신규 추가되었다.

## 수정 내용

### 1. SEED_ITEMS 변경

기존 테스트는 `DEFAULT_CHECKLIST`를 `beforeEach`에서 직접 주입했다. `DEFAULT_CHECKLIST`는 `daysFromNow()`로 날짜를 계산하여 테스트 실행 시점마다 값이 달라지므로, 고정 날짜를 사용하는 `SEED_ITEMS`를 별도로 선언했다. `SEED_ITEMS`에는 `memo` 2개, `expense` 2개, `income` 1개가 포함되어 type별 검증이 가능하다.

### 2. add 호출 수정

| 구분 | 변경 전 | 변경 후 |
|:--|:--|:--|
| add 호출 | `add("2026-06-01", "새 할 일")` | `add({ date: "2026-06-01", text: "새 할 일", done: false, type: "memo", amount: 0 })` |

### 3. 신규 테스트 추가

- `toggle` — type, amount가 변경되지 않음을 검증하는 케이스 추가
- `add` — `expense` / `income` 항목 추가 및 필드 검증 케이스 추가
- `update` — `update` 액션 전체 테스트 추가 (6개)
- `초기값` — `type`, `amount` 필드 존재 및 `memo`의 amount=0 검증 추가

## 작성한 테스트 요약

| 테스트 대상 | 정상 | 에러/경계 | type/amount | 합계 |
|:--|:--|:--|:--|:--|
| 초기값 | 1 | 0 | 2 | 3 |
| toggle | 2 | 1 | 1 | 4 |
| add | 3 | 0 | 2 | 5 |
| update | 4 | 1 | 2 | 7 (신규) |
| remove | 2 | 1 | 1 | 4 |
| resetToDefault | 1 | 1 | 1 | 3 |
| 합계 | 13 | 4 | 9 | **25** |

## 테스트 실행 결과

```
 ✓ src/store/useChecklistStore.test.ts (25 tests) 29ms

 Test Files  1 passed (1)
       Tests  25 passed (25)
```

전체 테스트 스위트 (84개) 모두 통과 확인:

```
 Test Files  5 passed (5)
       Tests  84 passed (84)
```

## 테스트 실행 명령어

```bash
# 체크리스트 스토어만
npx vitest run src/store/useChecklistStore.test.ts

# 전체 테스트
npx vitest run
```
