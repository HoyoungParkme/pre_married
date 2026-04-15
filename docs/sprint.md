# 스프린트 상태

## 현재: 완료 ✓

Sprint 1~6 모두 완료. `npm test` 63/63 통과, `npm run build` 성공.

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
