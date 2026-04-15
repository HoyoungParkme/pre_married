# 스프린트 상태

## 현재: Sprint 7 — Firebase 실시간 동기화

### 목표
두 사용자가 각자 기기에서 접속하여 같은 데이터를 실시간 공유

### 완료 기준
- [ ] 방 코드(6자리)로 두 사용자가 같은 데이터 공간에 연결
- [ ] 예산/체크리스트/위시리스트/프리셋 변경이 실시간 동기화
- [ ] 오프라인에서도 로컬 데이터로 정상 동작
- [ ] TopNav에 연결 상태 표시

### 단계
- [x] 분석
- [x] 설계
- [ ] 구현
- [ ] 검증

### 작업
1. [x] Firebase SDK 설치 + 초기화
2. [x] 방(Room) 시스템 (생성/참여/상태 관리)
3. [x] Zustand ↔ Firebase 동기화 hook
4. [x] 방 설정 UI (RoomSetup, RoomStatus)
5. [x] 레이아웃 수정 (AppLayout, TopNav)
6. [ ] GitHub Actions 환경 변수 추가 (사용자가 Firebase 프로젝트 생성 후)

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
