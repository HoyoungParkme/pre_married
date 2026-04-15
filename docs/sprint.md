# 스프린트 상태

## 현재: Sprint 11 — 체크리스트 달력 전환 + 상단바 스크롤 제거

### 목표
체크리스트를 달력 UI로 전환, 상단바 모바일 스크롤 제거

### 완료 기준
- [ ] ChecklistItem.stage → date로 변경
- [ ] 달력 그리드 UI + 날짜 클릭 시 항목 표시/추가
- [ ] 진행률 바 제거
- [ ] TopNav 가로 스크롤 제거

### 단계
- [x] 분석
- [x] 설계
- [ ] 구현
- [ ] 검증

### 작업
1. [ ] ChecklistItem 타입 변경 (stage→date)
2. [ ] 기본 체크리스트 날짜 기반으로 변환
3. [ ] ChecklistPage 달력 UI 재작성
4. [ ] TopNav 스크롤 제거

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
