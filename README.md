
<p align="center">
  <a href="https://fe-7-project-3-team-2.vercel.app/posts/all" target="_blank">
    <img width="360" height="103" alt="image" src="https://github.com/user-attachments/assets/03abb4ff-0769-47a4-868e-fccf8999672a" />
  </a>
</p>

# 🗣 훈수톡 (HUNSOO TALK)

> 가볍게 던지는 훈수, 빠른 소통을 추구하는 대시보드 형식의 웹 커뮤니티 서비스

---

## 1️⃣ 프로젝트 개요

### 📖 소개

바둑·장기에서 옆에서 던지는 한마디, "훈수". 잔소리처럼 들려도 모아 보면 재미있고, 때로는 앞날의 지침이 되는 조언이 됩니다.
훈수톡은 '훈수를 둔다'는 행위를 중심으로 가볍고 빠르게 소통하는 커뮤니티입니다.
글을 올려 훈수러를 모으고, 훈수를 달아 레벨업하고 뱃지를 수집하는 게임 요소를 더했습니다.

- **개발 기간**: 2025.10.27 ~ 11.20 (약 4주)
- **서비스 링크**: [훈수톡 바로가기](https://fe-7-project-3-team-2.vercel.app/posts/all)
- **레포지토리**: [Frontend](https://github.com/varYeon/IADIC_FE) | Backend: Supabase 사용

> _현재 서비스 중단 상태입니다._

### ✅ 주요 기능
- **훈수 게시판** : 훈수 받고 싶은 주제로 글 작성, 대시보드형 UI, 실시간 훈수, 무한 스크롤
- **훈수 검색** : 게시물 검색과 사용자 검색, 추천 검색어, 실시간 검색
- **마이페이지** : 프로필 수정, 활동 아카이브, 팔로우, 칭호·뱃지 조회와 대표 뱃지 설정
- **훈수 차트** : 전체·분야별·내 랭킹, 훈수 데이터와 활동 시각화
- **게임 요소** : 좋아요·싫어요·채택 기반 경험치, 레벨과 뱃지(업적) 시스템
- **인증** : 이메일 로그인, 소셜 로그인

### 🔎 팀원 소개
| 이름 | 역할 | 담당 업무 |
| --- | --- | --- |
| 김세현 | 팀장 | 디자인, 로그인 페이지 |
| 변수연 ([@varYeon](https://github.com/varYeon)) | 팀원 | 검색 페이지 |
| 송영주 | 팀원 | 게시글 페이지 |
| 이현준 | 팀원 | DB 관리, 차트 페이지 |
| 정민경 | 팀원 | 마이페이지 |

---

## 2️⃣ 기술 스택

### 🖥 프론트엔드
| 분류 | 기술 |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4, tailwind-merge, class-variance-authority, tailwind-scrollbar-hide, tw-animate-css, next-themes |
| 서버 상태 관리 | TanStack Query v5 |
| BaaS | Supabase (Auth, Database, Realtime) |
| 유효성 검사 | Zod v4 |
| 차트 | Recharts v3 |
| UI / 애니메이션 | Motion, lucide-react, react-toastify |

### 🛠 개발 환경 & 협업 도구
| 분류 | 기술 |
| --- | --- |
| 코드 품질 | ESLint v9, Prettier v3 |
| Git 훅 | Husky v9, lint-staged |
| 협업 | GitHub, Notion |
| CI/CD | Vercel |

---

## 3️⃣ 개발 환경 설정

### 📋 요구 사항

- **Node.js**: `>= 18.0.0`
- **패키지 매니저**: `npm`
- **추천 IDE 플러그인**: ESLint, Prettier, Tailwind CSS IntelliSense

### 🚀 설치 및 실행
```bash
# 1. 저장소 클론
git clone [https://github.com/varYeon/IADIC_FE.git](https://github.com/varYeon/IADIC_FE.git)
cd IADIC_FE

# 2. 패키지 설치
npm install

# 3. 환경변수 설정
# .env 파일에 Supabase URL / Key 등을 입력합니다.
cp .env.example .env
# 각 키 값은 팀 노션/슬랙 등의 내부 문서를 참고해 입력합니다.

# 4. 개발 서버 실행
npm run dev
```

### 📜 주요 스크립트
| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |

---

## 4️⃣ 프로젝트 구조

```
src/
├── app/ # Next.js App Router
│ ├── (auth)/ # 로그인 등 인증 페이지
│ ├── (protect)/ # 로그인 필요 페이지 (마이페이지)
│ └── (public)/ # 공개 페이지 (posts, search, chart)
├── components/ # UI 컴포넌트 (auth, chart, comment, common, layout, post, search, user)
├── hooks/ # 커스텀 React Hook
├── routes/ # 네비게이션 데이터 및 타입
├── services/ # API 호출 로직 (auth, comment, post, profile, user)
├── stores/ # 전역 상태 스토어
├── types/ # TypeScript 공용 타입
├── utils/ # 유틸리티 함수
├── assets/ # 이미지, 아이콘 등 정적 파일
├── fonts/ # 폰트
├── css/ # 전역 스타일
└── proxy.ts # Next.js 프록시 설정
```

---

## 5️⃣ 핵심 구현 포인트

### 💬 실시간 훈수
- 실시간 댓글(CRUD)로 게시물이 화제성을 얻도록 되도록 설계

### 📜 게시물 무한 스크롤
- 끊김 없는 열람을 위해 무한 스크롤 적용

### 🔍 검색
- 게시물·사용자 검색 분리, 추천 검색어와 실시간 검색 제공
- 검색 결과에서 프로필·게시글로 바로 연결
- TanStack Query로 재검색 페이지 탐색 대기 시간 축소

### 🏆 게임 요소 (뱃지·랭킹)
- 좋아요·싫어요·채택을 기반으로 활동 데이터를 쌓고, 업적 트리거 함수로 뱃지 지급
- 전체·분야별·내 랭킹 페이지와 차트로 시각화

### 🎨 테마 시스템 (라이트/다크)
- Tailwind v4 `@theme` 변수와 `@custom-variant dark`로 색상을 중앙 관리
- `.dark` 클래스 적용 시 CSS 변수가 다크 값으로 자동 전환

### 🔐 인증 및 접근 제어
- Route Group `(auth)` / `(protect)` / `(public)`으로 접근 권한 분리
- 이메일 로그인과 소셜 로그인 지원

## 6️⃣ 개발 과정

### 📆 타임라인
| 주차 | 내용 |
| --- | --- |
| 1주차 | 아이디어 기획, 디자인 시스템, 전체 UI |
| 2주차 | 공통 컴포넌트 개발, 개별 기능 개발 시작 |
| 3주차 | 개별 기능 개발, 반응형·로딩 처리, QA |

### 🧩 문제 & 해결
| 문제 | 해결 |
| --- | --- |
| 훈수는 거부감이 느껴질 수 있는 주제 | 실시간 댓글과 게임 요소 중심으로 설계 |
| 게임 요소를 어떻게 연결할까 | 좋아요·싫어요·채택 기반으로 재미 요소 제공 |
| 활발한 활동을 어떻게 표현할까 | 뱃지·레벨 시스템으로 성취감 제공, 실시간 댓글로 열기 표현 |

### 📝 자체 평가
- 달성도 90%: 최종 기획 중 댓글 고정 기능을 제외한 모든 기능을 개발했고, 1·2차 QA로 완성도를 높였습니다.
- 완성도 80%

| 영역 | 아쉬운 점 | 보완 계획 |
| --- | --- | --- |
| 성능 | 동시 접속자 증가 시 실시간 기능 성능 저하, 렌더링 딜레이 | 구독 관리, WebSocket 최적화, 스켈레톤 뷰 |
| 보안 | 부적절한 콘텐츠 등록 가능 | 신고 시스템, 관리자 검수 |
| 세부 사항 | 게시물이 많아지면 과거 글 찾기 어려움, 구체적인 유저 확인 불가 | 페이지네이션, 팔로우/팔로워 화면 추가 |
