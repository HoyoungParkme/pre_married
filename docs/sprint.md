# 스프린트 상태

## 현재: Sprint 9 — 시뮬레이터 간소화 + 날짜 기반 대시보드

### 목표
시뮬레이터 입력을 간소화하고 날짜 기반 지출/수입 대시보드로 전환

### 완료 기준
- [ ] 자금 3개(적금, 추가, 월저축) + 고정비 4개로 입력 간소화
- [ ] 일회성 지출/수입을 날짜와 함께 등록
- [ ] 월별 잔액 추이 차트 + 거래 타임라인
- [ ] Firebase 동기화 유지

### 단계
- [x] 분석
- [x] 설계
- [ ] 구현
- [ ] 검증

### 작업
1. [ ] 타입 변경 (BudgetInput 축소, Transaction 추가)
2. [ ] 스토어 변경 (useBudgetStore, useTransactionStore)
3. [ ] 계산 로직 재작성 (타임라인 기반)
4. [ ] 대시보드 UI (BalanceSummary, TimelineChart, TransactionList)
5. [ ] 입력 UI (FundsSection, MonthlyExpenseSection)
6. [ ] Firebase 동기화 업데이트

## 히스토리

- **Sprint 0** (2026-04-15) — 분석/설계/plan 승인
- **Sprint 1~5** (2026-04-15) — Vite+TS 부트스트랩, 컴포넌트 분리, 라우팅, 다크모드, 차트, PNG 내보내기, 프리셋/체크리스트/위시리스트/팁, GitHub Actions
- **Sprint 6** (2026-04-15) — reviewer/test-writer/doc-writer 위임, 리뷰 지적 일부 반영 (W-4, W-5, S-8 + ExportButton aria-label), LICENSE 추가

## 파킹랏 (다음 세션에서 검토)

| # | 요청 내용 | 출처 | 긴급도 |
|:--|:--|:--|:--|
| P-1 | 접근성 개선: 아이콘 버튼 `aria-label` 전역 추가, 체크박스 `<label>` 연결 | reviewer W-1/W-2/S-4 | 보통 |
| P-2 | zustand persist `migrate` 함수 추가 또는 version 제거 결정 | reviewer W-3 | 낮음 |
| P-3 | `confirm/alert` → 토스트 UI 교체 | reviewer S-1 | 낮음 |
| P-4 | `PresetsPage` 계산 `useMemo` 최적화 | reviewer S-2 | 낮음 |
| P-5 | `SectionHeader.index` → `badge`/`step` 개명, `SEED` → `DEFAULT_WISHLIST` 이동 | reviewer S-5/S-7 | 낮음 |
| P-6 | 번들 크기 최적화 (recharts 동적 import) | vite 경고 | 낮음 |
| P-7 | 실제 스크린샷 추가 (README TODO) | doc-writer | 낮음 |
