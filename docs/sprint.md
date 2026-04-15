# 스프린트 상태

## 현재: Sprint 14 — 차트 기간 토글 (일/주/월/년)

### 목표
체크리스트 항목에 메모/입금/지출 분류 추가, 대시보드 자금 계산 연동

### 완료 기준
- [ ] ChecklistItem에 type(memo/income/expense) + amount 추가
- [ ] 체크리스트 UI에서 분류 선택 + 금액 입력
- [ ] 대시보드 잔액 계산에 체크리스트 금융 항목 자동 반영
- [ ] 자금 0원 시 "최소 필요 금액" 표시

### 단계
- [x] 분석
- [x] 설계
- [ ] 구현
- [ ] 검증

### 작업
1. [ ] ChecklistItem 타입 확장 (type, amount)
2. [ ] 스토어 + 기본 데이터 수정
3. [ ] ChecklistPage UI 업데이트
4. [ ] calculate.ts + BalanceSummary 연동
5. [ ] 테스트 수정 (agent 위임)

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
