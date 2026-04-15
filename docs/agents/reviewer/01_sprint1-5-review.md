# REVIEWER-01: Sprint 1~5 전체 코드 리뷰

- 스프린트: 6
- 요청자: PM
- 범위: `src/` 전체 + 설정 파일 + CI
- 리뷰 일시: 2026-04-15

## 결과 요약
- 치명적: 0건
- 주의: 5건
- 개선 권장: 9건

전체 평가: 아키텍처·타입 설계가 탄탄하고 과설계 없이 명확함. 접근성 누락이 가장 두드러진 주의 사항.

## 잘 작성된 부분
1. **HashRouter + Vite base 전략**: GitHub Pages 새로고침 404 회피, `VITE_BASE` 주입 일관성
2. **Store 패턴 일관성**: zustand + persist + typed interface, 불필요 래퍼 없음
3. **순수 함수 분리**: `computeSummary`, `buildMonthlyBalanceSeries` 사이드이펙트 없음
4. **strict TS + any 없음**
5. **모듈 docstring 전 파일 작성**
6. **NumberInput: `type="text" + inputMode="numeric"`** — 좋은 선택

## 상세 (파일:라인 기준)

### [주의]
- **W-1 아이콘 버튼 접근성**: `PresetsPage.tsx:117-134`, `ChecklistPage.tsx:142-147`, `WishlistPage.tsx:187-192`, `ExportButton.tsx:42` — `aria-label` 누락. `title`만으로는 스크린 리더/키보드 접근성 보장 불가
- **W-2 체크박스 레이블 연결 누락**: `ChecklistPage.tsx:127-131` — `<label htmlFor>` 또는 감싸기 필요
- **W-3 persist `version`만 있고 `migrate` 없음**: 5개 store 모두 — 스키마 변경 시 localStorage가 조용히 초기화됨. version 제거 또는 migrate 추가 필요성 명시
- **W-4 `ExportButton`의 React 네임스페이스 import 누락**: `ExportButton.tsx:12` — `React.RefObject` 사용하는데 `import React` 없음. `import type { RefObject } from "react"`로 통일 권장. `FundFlow.tsx:85`도 유사
- **W-5 favicon 경로 `./favicon.svg`**: `index.html:5` — 루트 절대 경로 `/favicon.svg`로 통일 권장

### [개선 권장]
- **S-1 `window.confirm/alert` 남용**: 6곳 — 토스트/인라인 확인 UI 대체 고려
- **S-2 PresetsPage 매 렌더 재계산**: `PresetsPage.tsx:88` — `useMemo` 또는 저장 시 캐싱
- **S-3 변수 shadowing 위험**: `ChecklistPage.tsx:29-33` — `s` → `stageKey`
- **S-4 Wishlist 입력 label 누락**: `WishlistPage.tsx:121-127` — `aria-label` 또는 `<label>`
- **S-5 `SectionHeader.index` prop 이름 모호**: `badge` 또는 `step` 제안
- **S-6 Recharts formatter 타입**: `FundChart.tsx:50-53` — `(v: number)` 대신 `unknown` + narrowing
- **S-7 Wishlist 시드 `SEED` 위치·이름**: `useWishlistStore.ts:21-28` — `constants/defaults.ts`로 이동, `DEFAULT_WISHLIST`로 개명
- **S-8 CI에서 테스트 미실행**: `deploy.yml` — build 전 `npm run test` 추가
- **S-9 `formatKoreanMoney` dead null 체크**: `format.ts:29` — 시그니처 통일 또는 체크 제거

## 체크리스트 결과 요약

| 항목 | 결과 |
|:--|:--|
| 네이밍 | 3건 (S-3, S-5, S-7) |
| 함수 설계 | 이상 없음 |
| 에러 처리 | 이상 없음 |
| 보안 | 이상 없음 (dangerouslySetInnerHTML 없음, 비밀정보 없음) |
| 구조/아키텍처 | 1건 (S-7) |
| 타입 | 2건 (W-4, S-9) |
| 성능 | 1건 (S-2) |
| 접근성 | 3건 (W-1, W-2, S-4) |
| GitHub Pages 배포 | 1건 (W-5), 라우팅 OK |
| CI/CD | 1건 (S-8) |
