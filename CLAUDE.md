# Groo Design System

> 워크스페이스 공통 규칙(Git 작업 격리 · 스테이징 범위 · 태그 · 릴리스)은 상위 워크스페이스의 `CLAUDE.md` 에 있습니다.
> Claude Code 가 디렉토리를 거슬러 올라가며 함께 읽으므로 여기에 복사하지 않습니다.

## 목적

그루 이음(B2B, 조직 HR 관리, 브랜드 `#075B3C`)과 그루 담다(B2C, 개인 메모 · 할 일 · 가계부, 브랜드 `#0147AD`)가 함께 쓰는 디자인 시스템입니다. 톤은 심플하고 신뢰감 있게, 전 연령이 읽기 쉽게 둡니다.

## 산출물

- `DESIGN.md` — 공유 원본(글자 · 간격 · 모서리 · 공용 색 · 기초 문서)
- `DESIGN.hr.md` · `DESIGN.desk.md` — 브랜드 파일. 공유 영역 복사본 + 브랜드 색 · 브랜드 컴포넌트
- `specs/components/<이름>.md` · `<이름>.yaml` — 컴포넌트 스펙(규칙 · 수치)
- `site/` — 문서 사이트. **사이트가 최종 스펙입니다** — 웹 · 앱은 사이트에 적힌 그대로 만듭니다.
- 제품용 내보내기 — `npm run export:tailwind:desk`(웹 CSS + 다크 블록) · `export:dart:desk`(앱 Flutter 토큰) · `export:spec`(컴포넌트 YAML 을 라이트 · 다크 값으로 푼 JSON). 제품은 받은 파일을 손으로 고치지 않습니다 — 값을 바꾸려면 여기 원본을 고칩니다.

### 파일 분리

- **공유** — 글자 · 간격 · 모서리 · 팔레트 · 공용 역할 색. `DESIGN.md` 에 정의하고 `npm run sync` 가 브랜드 파일로 복사합니다(design.md 형식이 파일 사이 참조를 지원하지 않아 복사합니다).
- 복사 영역은 `typography` · `rounded` · `spacing` 블록과 `colors` 의 `# @sync:shared-start (colors-N)` ~ `# @sync:shared-end (colors-N)` 사이입니다. `colors-0` 팔레트 · `colors-1` 공용 바탕 · 글자 · 선 · `colors-2` 상태 · 차트 · `colors-3` 역할 색.
- **브랜드** — 브랜드 팔레트(`brand-100` ~ `brand-1000`)와 브랜드 역할 색(`fg-brand` · `bg-brand-solid` …)은 `@sync:brand-*` 영역에만 둡니다. sync 가 건드리지 않습니다.
- 역할 색은 팔레트를 `"{colors.x}"` 로 가리킵니다. hex 는 팔레트에만 씁니다.
- `npm run lint:all` 로 세 파일을 검사합니다. `DESIGN.md` 는 브랜드 색이 없어 missing-primary 경고 1건을 그대로 둡니다. 브랜드 파일은 경고 0건입니다.

## 토큰 규칙

1. 색은 WCAG AA 대비를 지킵니다(본문 4.5:1, UI 3:1). `npm run lint:all` · `lint:dark:strict` 로 검사합니다.
2. 공용 · 상태 토큰은 두 브랜드가 같이 쓰고, 브랜드 색만 나눕니다.
3. 한국어 본문 가독성을 우선합니다 — Pretendard, 영문 대체는 Inter.
4. 화면 · 컴포넌트는 역할 이름(`fg-neutral` · `bg-brand-solid` …)만 부릅니다. 팔레트 단계(`gray-500`)는 역할 색이 가리키는 자리로만 씁니다.
5. 토큰은 `DESIGN*.md` 에만 정의합니다(CSS · JS 에 따로 두지 않습니다).
6. 제품 개발에 필요한 토큰만 둡니다. 홈페이지 · 광고 같은 소개용 화면의 값은 그 화면이 스스로 정합니다.
7. 사용자가 요청하지 않은 토큰은 추가하지 않습니다. 한 번에 5개를 넘게 추가하지 않습니다(사용자가 정한 묶음은 예외).
8. 색 이름에 감정 표현("warm green")을 쓰지 않습니다.

### 옛것 정리

- 바뀐 이름 · 걷은 도구는 별칭이나 호환 층으로 남기지 않습니다. 쓰는 곳(제품 코드 포함)을 모두 새 것으로 옮긴 뒤 옛 것을 지우고, 지운 것을 가리키는 스크립트 · 문서 · 규칙 문구까지 걷습니다 — 옛 이름 검색 결과가 0 이어야 끝입니다.
- 브랜드 파일의 `primary` 는 design.md 형식이 요구하는 대표 색 키입니다. 내보내기는 싣지 않습니다.

### 작업 흐름

- 바꾼 뒤 `npm run verify` 를 통과해야 커밋할 수 있습니다(pre-commit hook).
- 색 값을 바꾸면 `npm run diff` · `diff:tailwind` 로 `origin/main` 과의 차이를 확인합니다.
- 공유 토큰을 바꾸면 `npm run sync` 로 브랜드 파일을 맞춥니다.

## 공식 문서 작성 규칙

`DESIGN*.md` · `specs/` · `site/content` · 사이트 그림의 글은 사이트에 그대로 실리는 공식 문서입니다. 지금 규칙만 적습니다.

- 문체는 "~합니다" 입니다.
- 적지 않는 것 — 날짜, 버전 번호, "사용자 결정", 비교 페이지 · 아티팩트 링크, 검수 · 조사 번호, 바뀌기 전 값과 이관 기록("Migration notes"), "지금 쓰는 곳은 없다" 같은 작업 상태, 다른 디자인 시스템과의 비교.
- 바꾼 이유 · 고르지 않은 안 · 검토 기록은 커밋 메시지와 PR 본문에 적습니다. git 기록이 이력입니다 — 백업 파일을 따로 두지 않습니다.
- 규칙의 이유가 쓰는 사람에게 필요하면 한 문장으로 적습니다("요일과 오늘과의 거리가 함께 보이기 때문입니다").
- 다른 문서에서 구조 · 수치를 참고했다면 출처는 `README.md` 와 사이트 '시작하기' 에 한 번 밝힙니다. 문장 · 그림을 옮기지 않습니다.
- `npm run check:docs` 가 이 규칙의 일부(날짜 · 아티팩트 링크 · 결정 문구 · 이관 절)를 검사합니다.

## 컴포넌트 스펙

- 작업 규칙은 `specs/CLAUDE.md` 에 있습니다 — 스펙을 추가 · 수정하기 전에 읽습니다.
- `specs/components/<이름>.md` 가 원본이고, 수치는 `<이름>.yaml` 이 있으면 그쪽이 원본입니다. 레시피(`recipes/shadcn`)와 사이트 그림(`site/components/specs`)은 스펙을 따라 함께 고칩니다.

## 문서 사이트(`site/`)

- 목표는 seed-design.io 수준의 문서입니다 — 기초와 컴포넌트의 세부 수치를 빠짐없이 적어 웹 · 앱이 같은 값을 따르게 합니다.
- SEED 문서는 seed-docs MCP 로 읽습니다. Foundations · 컴포넌트 문서는 `get_doc(section: "docs", path: "../foundations/<이름>")` · `"../components/<이름>"` 으로 열립니다. 목록은 `https://seed-design.io/foundations/llms.txt` · `/components/llms.txt`. SEED 는 Apache-2.0 입니다 — 구조 · 수치는 참고하되 문장 · 그림 · 당근 브랜드 리소스는 옮기지 않습니다.
- 페이지 대부분은 `site/scripts/gen-content.mjs` 가 빌드 때 원본(`DESIGN*.md` · `specs/`)에서 만듭니다. 만든 파일은 git 밖입니다 — **고치려면 원본을 고칩니다.** 원본 대신 사이트용으로 새로 쓴 페이지는 같은 자리에 `.mdx` 로 두면 생성을 건너뜁니다.
- `DESIGN.md` 의 `##` 절을 추가 · 개명하면 `gen-content.mjs` 의 `FOUNDATION_SECTIONS` 도 고칩니다(안 고치면 CI `site` 잡이 멈춥니다).
- 기초 페이지는 손으로 쓴 `.mdx` 입니다(`site/content/docs/foundations`). **숫자는 `.mdx` 에 적지 않습니다** — 표 · 그림의 값은 `site/components/foundations` 가 빌드 때 `site/lib/design-tokens.ts` 로 `DESIGN*.md` 를 읽어 채웁니다. 이 코드는 `DESIGN.md` 의 절 · 표 제목, 절 안 문장의 수치(`sectionNumber`), 컴포넌트 YAML 의 크기 규칙으로 값을 찾으므로, 제목 · 문장 · 규칙을 바꾸면 빌드가 멈춥니다 — 같이 고칩니다.
- 컴포넌트 페이지는 손으로 쓰지 않습니다 — 스펙 md 가 원본입니다. 그림은 `[그림: 캡션](../../site/components/specs/<이름>.tsx#<id>)` 한 줄로 넣고, 사이트가 그 자리에 `site/components/specs/<이름>.tsx` 의 그림을 그립니다. 그림의 값은 `site/lib/component-spec.ts` 가 YAML 을 풀어 채웁니다 — 그림에 수치를 따로 적지 않습니다. Specification 은 `[그림: …](../../site/components/specs/spec-sheet.tsx#<컴포넌트>)` 입니다.
- 컴포넌트 페이지에는 렌더링된 모습 · 언제 무엇을 쓰는지(화면 예시 · Do/Don't) · 코드 · Specification 을 둡니다.
- 컴포넌트마다 개요 카드 그림(`thumb`)을 둡니다 — 라이트 모습 하나를 카드(4:3)에 들어가게 그립니다. 개요 페이지(`components/overview`)가 모든 컴포넌트를 이 카드로 모읍니다.
- 그림은 groo 화면으로 그립니다.

## Git

- 브랜치 · 커밋 · 머지 전 점검은 `GIT_CONVENTION.md` 를 따릅니다.
- 토픽 브랜치(`tokens/<카테고리>` · `components/<이름>` · `docs/<주제>`)를 거치고, Conventional Commits(`feat(tokens):` · `fix(spec):` · `docs(spec):`)를 씁니다.

## 참고

- design.md 형식: https://github.com/google-labs-code/design.md
- Git 규칙: `GIT_CONVENTION.md`
- 컴포넌트 스펙 작업: `specs/CLAUDE.md`
