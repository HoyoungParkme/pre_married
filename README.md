# 신혼 준비 마스터 플랜

예비 신혼부부를 위한 자금 흐름 시뮬레이터. 데모: `https://<github-username>.github.io/pre_married/`

<!-- TODO: 스크린샷 추가 -->

## 이 프로젝트는 뭔가요?

결혼 준비를 하다 보면 "우리 돈이 얼마나 부족하지?", "시나리오를 바꾸면 얼마나 달라지지?" 같은 질문이 생깁니다.

이 앱은 주거·결혼식·혼수·저축 금액을 입력하면 최종 잔액을 실시간으로 계산해 줍니다. 모든 데이터는 브라우저에만 저장되므로 서버나 회원가입이 필요 없습니다.

## 주요 기능

| 페이지 | 설명 |
|:--|:--|
| 시뮬레이터 | 주거·결혼식·저축 금액을 입력하면 자금 흐름과 최종 잔액을 즉시 계산한다 |
| 시나리오 비교 | 현재 입력값을 이름 붙여 저장하고 여러 시나리오의 최종 잔액을 한 번에 비교한다 |
| 체크리스트 | 결혼 준비 단계별 할 일 목록을 관리한다 |
| 위시리스트 | 혼수 품목과 예상 금액을 기록하고 구매 상태를 추적한다 |
| 팁 | 주거·예식·혼수·저축 관련 절약 요령 모음 |

## 기술 스택

| 분류 | 기술 | 버전 | 역할 |
|:--|:--|:--|:--|
| 언어 | TypeScript | 5 | 타입 안전성 |
| UI 라이브러리 | React | 18 | 컴포넌트 기반 UI |
| 빌드 도구 | Vite | 5 | 개발 서버 + 번들링 |
| 스타일 | Tailwind CSS | 3 | 유틸리티 기반 스타일 |
| 상태 관리 | zustand | 4 | 전역 상태 + localStorage 저장 |
| 차트 | recharts | 2 | 자금 흐름 시각화 |
| 라우터 | react-router-dom | 6 | Hash 기반 SPA 라우팅 |
| 아이콘 | lucide-react | - | UI 아이콘 |
| 이미지 내보내기 | html-to-image | - | 대시보드 PNG 다운로드 |

## 폴더 구조

```
pre_married/
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages 자동 배포 워크플로우
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── dashboard/      # 대시보드 카드·차트·자금 흐름 컴포넌트
│   │   ├── inputs/         # 주거·결혼식·저축 입력 섹션
│   │   ├── layout/         # 상단 네비게이션·푸터·앱 레이아웃
│   │   └── ui/             # 재사용 가능한 기본 UI 컴포넌트
│   ├── constants/
│   │   └── defaults.ts     # 기본값, 샘플 프리셋, 체크리스트, 팁 데이터
│   ├── hooks/              # useBudgetSummary 등 커스텀 훅
│   ├── pages/              # 각 라우트에 대응하는 페이지 컴포넌트
│   ├── store/              # zustand 스토어 (상태 + localStorage 연동)
│   ├── styles/
│   │   └── index.css       # Tailwind 기본 스타일
│   ├── types/
│   │   └── budget.ts       # 공유 타입 정의
│   ├── utils/              # 계산 함수, 숫자 포맷 함수
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx          # HashRouter 기반 라우트 정의
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 로컬 실행

### 필요한 것

- Node.js 20 이상
- npm 10 이상 (Node.js에 포함)

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (기본 http://localhost:5173)
npm run dev
```

### 빌드 및 미리보기

```bash
# 프로덕션 빌드 (dist/ 폴더 생성)
npm run build

# 빌드 결과물을 로컬에서 미리보기
npm run preview
```

### 테스트

```bash
# 테스트 1회 실행
npm test

# 파일 변경 감지 후 자동 재실행
npm run test:watch
```

## GitHub Pages 배포

### 1단계: 리포지토리 준비

이 리포지토리를 본인 GitHub 계정으로 포크(fork)하거나, 새 리포지토리로 푸시합니다.

```bash
git remote set-url origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

### 2단계: GitHub Pages 설정

1. GitHub 리포지토리 페이지에서 **Settings** 탭을 클릭합니다
2. 왼쪽 메뉴에서 **Pages**를 선택합니다
3. **Source** 항목을 **GitHub Actions**로 변경합니다

### 3단계: 자동 배포 확인

`main` 브랜치에 푸시하면 `.github/workflows/deploy.yml`이 자동 실행됩니다.

워크플로우는 다음 순서로 동작합니다.

1. 리포지토리 체크아웃
2. `npm ci`로 의존성 설치
3. `npm run build`로 빌드 (이 때 `VITE_BASE` 환경변수에 리포지토리 이름이 자동 주입됨)
4. `dist/` 폴더를 GitHub Pages에 배포

### VITE_BASE 환경변수

Vite는 정적 파일의 기준 경로(base path)를 알아야 자산 URL을 올바르게 생성합니다. 워크플로우에서 `VITE_BASE` 값을 `/<리포지토리-이름>/`으로 자동 설정하므로 별도 수정 없이 동작합니다.

리포지토리 이름이 `pre_married`가 아니라면 `vite.config.ts`의 기본값만 바꾸면 됩니다.

```ts
// vite.config.ts
const base = process.env.VITE_BASE ?? "/<your-repo-name>/";
```

### 커스텀 도메인 사용 시

`public/CNAME` 파일에 도메인을 한 줄 추가합니다.

```
example.com
```

커스텀 도메인을 사용하면 `vite.config.ts`의 base를 `"/"`로 변경해야 합니다.

## 데이터 저장 방식

이 앱은 서버가 없습니다. 모든 데이터는 브라우저의 localStorage에 저장되므로 같은 브라우저에서만 데이터가 유지됩니다.

| localStorage 키 | 저장 내용 |
|:--|:--|
| `pre-married:budget` | 시뮬레이터 입력값 (주거·결혼식·저축 금액) |
| `pre-married:theme` | 라이트/다크 테마 설정 |
| `pre-married:presets` | 저장된 시나리오 목록 |
| `pre-married:checklist` | 체크리스트 항목과 완료 여부 |
| `pre-married:wishlist` | 위시리스트 품목과 구매 상태 |

브라우저 개발자 도구(F12) → Application → Local Storage에서 직접 확인하거나 삭제할 수 있습니다.

## 기여

버그 제보나 개선 제안은 GitHub Issues를 이용해 주세요. Pull Request도 환영합니다.

## 라이선스

[MIT](LICENSE)
