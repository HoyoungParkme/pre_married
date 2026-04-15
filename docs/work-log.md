# 작업 로그

## Sprint 0 — 분석/설계

| 시점 | 행동 | 내용 |
|:--|:--|:--|
| 2026-04-15 | [분석 시작] | sample.html 전환 요청 접수 |
| 2026-04-15 | [PM 직접] | Plan 작성 및 승인 완료 |
| 2026-04-15 | [PM 직접] | docs 구조 생성 (requirements, sprint, pm) |

## Sprint 1~5 — 부트스트랩 + 기능 이전 + 고도화 + 배포 세팅

| 시점 | 행동 | 내용 |
|:--|:--|:--|
| 2026-04-15 | [PM 직접] | Vite+TS 프로젝트 세팅, Tailwind/zustand/recharts 설치 |
| 2026-04-15 | [PM 직접] | utils/store/hooks/components/pages 전체 구현 |
| 2026-04-15 | [PM 직접] | HashRouter, 5개 페이지, 다크모드 |
| 2026-04-15 | [PM 직접] | Recharts 차트, html-to-image PNG 내보내기 |
| 2026-04-15 | [PM 직접] | GitHub Actions `.github/workflows/deploy.yml` 작성 |
| 2026-04-15 | [검증] | `npm run build` 성공, `npm test` 3/3 통과 |

## Sprint 6 — 검증 (Agent 위임)

| 시점 | 행동 | 내용 |
|:--|:--|:--|
| 2026-04-15 | [위임→reviewer] | Sprint 1~5 전체 코드 리뷰 |
| 2026-04-15 | [완료←reviewer] | 치명적 0 / 주의 5 / 개선 9 |
| 2026-04-15 | [위임→test-writer] | format/store 테스트 확충 |
| 2026-04-15 | [완료←test-writer] | 테스트 파일 5개, 총 63개 테스트 전부 통과 |
| 2026-04-15 | [위임→doc-writer] | README.md 작성 |
| 2026-04-15 | [완료←doc-writer] | README 작성. LICENSE 파일 필요 지적 |
| 2026-04-15 | [PM 직접] | LICENSE(MIT) 추가, W-4/W-5/S-8 및 ExportButton aria-label 반영 |
| 2026-04-15 | [검증] | 최종 `npm test` 63/63 통과, `npm run build` 성공 |
| 2026-04-15 | [Sprint 6 완료] | 나머지 리뷰 지적은 파킹랏으로 이동 (sprint.md) |
