# TEST-WRITER-01: 핵심 로직 및 store 테스트 확충

- 스프린트: 6
- 기존 테스트: `src/utils/calculate.test.ts` (3 케이스)

## 요청 내용
- `src/utils/format.ts` 테스트 (formatNumber, parseNumber, formatKoreanMoney 엣지 케이스)
- `src/store/useBudgetStore.ts` 테스트 (setField, replaceAll, reset)
- `src/store/useChecklistStore.ts` 테스트 (toggle, add, remove, resetToDefault)
- `src/store/useWishlistStore.ts` 테스트 (add/update/remove/clear)
- `src/store/usePresetStore.ts` 테스트 (save, remove, rename)
- Vitest + jsdom + @testing-library 이미 셋업됨
- `npm test`로 실행 확인

## 결과 (Agent 작성)

### 작성한 파일
- `src/utils/format.test.ts` — formatNumber(8), parseNumber(7), formatKoreanMoney(7) = 22개
- `src/store/useBudgetStore.test.ts` — 초기값(1), setField(2), replaceAll(1), reset(1) = 5개
- `src/store/useChecklistStore.test.ts` — 초기값(1), toggle(3), add(3), remove(3), resetToDefault(1) = 11개
- `src/store/useWishlistStore.test.ts` — 초기값(1), add(3), update(4), remove(3), clear(1) = 12개
- `src/store/usePresetStore.test.ts` — 초기값(1), save(3), remove(3), rename(3) = 10개

### 테스트 실행 결과
- 전체: 63개 (기존 3개 포함)
- 통과: 63개
- 실패: 0개
- 스킵: 0개

### 발견한 이슈
없음. 모든 테스트 첫 실행에서 통과.

### 테스트 실행 명령어
`npm test`
