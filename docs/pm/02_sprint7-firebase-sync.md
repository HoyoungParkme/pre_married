# PM-02: Sprint 7 — Firebase 실시간 동기화

- 스프린트: 7
- 날짜: 2026-04-15

## 작업 로그

| 시점 | 행동 | 내용 |
|:--|:--|:--|
| 2026-04-15 | [분석 시작] | 유저 요청: "두명에서 쓰는거고 입력하면 변수가 자동으로 바뀌게" |
| 2026-04-15 | [판단] | Firebase Realtime DB 선택. 이유: 2명 개인 프로젝트, 무료 티어 충분, 실시간 동기화 내장 |
| 2026-04-15 | [결정] | 기존 Zustand 스토어 수정 없이 별도 sync hook으로 구현 |
| 2026-04-15 | [분석→설계] | Plan 작성 및 승인 완료 |
| 2026-04-15 | [설계→구현] | Sprint 7 구현 시작 |

## 판단 기록

### Firebase Realtime Database 선택
- 결정: Firestore가 아닌 Realtime Database 사용
- 이유: 2명 개인 프로젝트에 Firestore 쿼리/인덱싱 불필요, 단순 JSON 트리에 적합
- 대안: Firestore, Supabase, URL 공유
- 대안 미선택 이유: Firestore는 과설계, Supabase는 설정 복잡, URL 공유는 자동 동기화 안 됨

### 동기화 아키텍처
- 결정: 기존 Zustand 스토어 수정 없이 별도 useFirebaseSync hook
- 이유: 기존 63개 테스트 깨지지 않음, 코드 변경 최소화
- 대안: Zustand middleware로 구현
- 대안 미선택 이유: persist middleware는 동기식, Firebase는 비동기 → 충돌
