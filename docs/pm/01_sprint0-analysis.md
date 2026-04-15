# PM-01: Sprint 0 분석 + 기술 결정

- 스프린트: 0
- 날짜: 2026-04-15

## 작업 로그

| 시점 | 행동 | 내용 |
|:--|:--|:--|
| 2026-04-15 | [분석 시작] | 유저 요청: sample.html을 백엔드 없는 React 웹사이트로 고도화 + GitHub Pages 배포 |
| 2026-04-15 | [PM 직접] | sample.html 읽고 구조 파악 (단일 JSX, 275줄) |
| 2026-04-15 | [질문] | 빌드 도구/범위/라우팅 3개 질문 |
| 2026-04-15 | [결정] | Vite+TS, 확장 범위, HashRouter |
| 2026-04-15 | [결정] | 상태=zustand, 차트=Recharts, 내보내기=html-to-image |
| 2026-04-15 | [판단] | plan 승인 완료, Sprint 1 구현 착수 |

## 판단 기록

### 빌드 도구: Vite + React + TypeScript
- 결정: Vite + TS
- 이유: 정적 빌드 최적, TS 타입 안전성, GitHub Pages 호환
- 대안: Next.js(정적 export) — 과설계, CRA — deprecated

### 상태 관리: zustand + persist
- 결정: zustand + persist
- 이유: 페이지 간 공유 + localStorage 자동, 설정 최소
- 대안: Redux(과설계), Context(persist 수동 필요)

### 라우팅: HashRouter
- 결정: HashRouter
- 이유: GitHub Pages는 서버 리라이트 불가, HashRouter는 404 회피
- 대안: BrowserRouter + 404.html 트릭 — 복잡도 증가
