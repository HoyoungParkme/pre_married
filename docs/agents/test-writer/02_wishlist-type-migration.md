# 테스트 작성 보고서

## 작성 대상
- 테스트 대상 파일: `src/store/useWishlistStore.ts`
- 테스트 파일: `src/store/useWishlistStore.test.ts`
- 테스트 프레임워크: vitest

## 변경 요약

WishlistItem 타입이 v1 → v2로 변경됨에 따라 기존 테스트를 수정하고 신규 액션 테스트를 추가했다.

| 변경 항목 | 내용 |
|:--|:--|
| SEED_ITEMS 수정 | `status` 제거, `priority` / `condition` / `purchased` 추가 |
| add 테스트 수정 | `status: "예정"` → `priority`, `condition`, `purchased` 필드로 교체 |
| update 테스트 수정 | `status` 업데이트 테스트 제거, `priority`/`condition` 업데이트 테스트 추가 |
| note 관련 테스트 제거 | `note` 필드 삭제에 따라 "note 필드를 추가할 수 있다" 테스트 제거 |
| togglePurchased 테스트 추가 | NEW 액션 — 4개 케이스 작성 |
| resetToDefault 테스트 추가 | NEW 액션 — 3개 케이스 작성 |

## 작성한 테스트 요약

| 테스트 대상 | 정상 | 에러/경계값 | 합계 |
|:--|:--|:--|:--|
| 초기값 | 1 | 0 | 1 |
| add | 3 | 0 | 3 |
| update | 4 | 0 | 4 |
| remove | 2 | 1 | 3 |
| togglePurchased | 3 | 1 | 4 |
| clear | 1 | 0 | 1 |
| resetToDefault | 3 | 0 | 3 |
| 합계 | 17 | 2 | 19 |

## 테스트 실행 결과
- 전체: 19개
- 통과: 19개
- 실패: 0개
- 스킵: 0개

### mutation check 결과
- togglePurchased의 `toBe(true)` → `toBe(false)` 변경 시 1개 실패 확인
- 테스트가 실제 동작을 검증하고 있음이 확인됨

## 주요 변경 내역

### 1. SEED_ITEMS 타입 교체
```
before: { id, name, category, price, status: "예정" }
after:  { id, name, category, priority, condition, purchased: false, price }
```

### 2. add 테스트 — 필드 교체
기존 `status: "예정"` 인자를 새 타입에 맞게 `priority`, `condition`, `purchased` 3개 필드로 교체.
검증 항목도 동일하게 확장.

### 3. update 테스트 — note 제거, priority/condition 추가
- 제거: "note 필드를 추가할 수 있다" (note 필드 자체가 타입에서 제거됨)
- 변경: "id로 status 필드를 업데이트한다" → "id로 price 필드를 업데이트한다"
- 추가: "priority를 필수 → 선택으로 변경할 수 있다"

### 4. togglePurchased 테스트 신규 추가 (4개)
- false → true 토글 정상 동작
- true → false 토글 정상 동작 (Arrange에서 setState로 직접 세팅)
- 토글 시 다른 필드 불변성 검증
- 존재하지 않는 id 토글 시 items 불변 검증

### 5. resetToDefault 테스트 신규 추가 (3개)
- clear 후 resetToDefault 시 items 24개 복원 검증
- resetToDefault 후 모든 purchased가 false인지 검증
- 모든 아이템에 priority / condition 필드 존재 검증

## 커버하지 못한 부분
- 없음. 요청된 5가지 항목 (SEED 수정, status→purchased, note 제거, togglePurchased 추가, 패턴 유지) 모두 반영.

## 테스트 실행 명령어
```
npx vitest run src/store/useWishlistStore.test.ts
```
