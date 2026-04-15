# DOC-WRITER-01: README.md 작성

- 스프린트: 6
- 파일: `/home/hypark/dev/personal/pre_married/README.md` (새로 작성)

## 요청 내용
중학생도 이해할 수 있도록 아래 내용 포함:

1. **프로젝트 소개** — "신혼 준비 마스터 플랜"이 무엇인지, 어떤 문제를 해결하는지
2. **주요 기능** — 시뮬레이터 / 시나리오 비교 / 체크리스트 / 위시리스트 / 팁 (5개 페이지)
3. **기술 스택** — React 18, TypeScript, Vite, Tailwind, zustand, recharts, react-router-dom, lucide-react, html-to-image
4. **로컬 실행 방법**
   - `npm install`
   - `npm run dev`
   - `npm run build` / `npm run preview`
   - `npm test`
5. **GitHub Pages 배포 방법**
   - 리포지토리를 GitHub에 푸시
   - Settings → Pages → Source = "GitHub Actions"
   - `.github/workflows/deploy.yml`이 자동 빌드/배포
   - `vite.config.ts`의 `base` 또는 워크플로우 `VITE_BASE` 환경변수로 리포 이름이 주입됨
6. **폴더 구조** — src 하위 디렉토리 설명
7. **데이터 저장** — 모든 값은 localStorage에 저장, 서버 없음
8. **라이선스** — MIT (옵션)

## 결과 (Agent 작성)

- 작성한 파일: `/home/hypark/dev/personal/pre_married/README.md`

### 섹션 목록

1. 한 줄 소개 + 데모 링크 플레이스홀더
2. 스크린샷 플레이스홀더 (`<!-- TODO: 스크린샷 추가 -->`)
3. "이 프로젝트는 뭔가요?" — 중학생 대상 쉬운 설명
4. 주요 기능 — 5개 페이지 표 형태로 설명
5. 기술 스택 — 버전 포함 표
6. 폴더 구조 — 트리 + 한 줄 설명
7. 로컬 실행 — install / dev / build / preview / test
8. GitHub Pages 배포 — 3단계 절차 + VITE_BASE 설명 + 커스텀 도메인 언급
9. 데이터 저장 방식 — localStorage 키 5개 목록
10. 기여
11. 라이선스 (MIT)

### 특이사항

- 데모 URL은 `https://<github-username>.github.io/pre_married/` 플레이스홀더로 작성
- 스크린샷 자리표시자는 HTML 주석으로 처리
- LICENSE 파일은 현재 없음 — 라이선스 섹션에 `[MIT](LICENSE)` 링크를 달았으나 파일 생성 필요 [확인 필요]
- `npm run test:watch` 명령어는 package.json에 `test:watch`로 확인됨
