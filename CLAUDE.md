# Groo Design System

> **워크스페이스 공통 규칙**(Git 작업 격리 · 스테이징 범위 · 태그·릴리스)은
> 상위 `/home/lshdainty/study/CLAUDE.md` 에 있다. Claude Code 가 디렉토리 워크업으로
> 자동 로드하므로 여기에 복사하지 않는다 — 복사본은 원문이 바뀌어도 따라오지 않는다.

## WHY (목적)
사람과 일상이 숲처럼 자라나는 두 서비스의 단일 디자인 시스템:
- **그루 이음** (B2B, 조직 HR 관리, accent: `#075B3C` — 그루 초록, v121)
- **그루 담다** (B2C, 개인 메모/할일/가계부, accent: `#0147AD`)

레퍼런스 톤: 토스 — 심플, 신뢰감, 전 연령 범용.

## WHAT (산출물)
- `DESIGN.md` — 공유 baseline (typography, spacing, rounded, neutral colors, neutral components)
- `DESIGN.hr.md` — HR 브랜드 단독 self-contained 시스템 (primary `#075B3C`, primary-light, border-focus, brand 컴포넌트)
- `DESIGN.desk.md` — Desk 브랜드 단독 self-contained 시스템 (primary `#0147AD`, primary-light, border-focus, brand 컴포넌트)
- 토큰: color, typography, spacing, radius, shadow, motion
- 컴포넌트 스펙: variant, state, accessibility 규칙
- 제품용 내보내기(2026-10-06): `npm run export:tailwind:desk`(웹 CSS + 다크 블록) · `export:dart:desk`(앱 Flutter 토큰 — 새 이름만) · `export:spec`(컴포넌트 YAML 을 라이트 · 다크 값으로 푼 JSON — 제품 테스트 · 카탈로그용). 제품은 받은 파일을 그대로 두고 손으로 고치지 않는다 — 값을 바꾸려면 여기 원본을 고친다.

### 파일 분리 규칙 (v17부터)
- **공유**: typography, spacing, rounded, neutral colors(bg-page, surface-*, text-*, border-*, semantic) — DESIGN.md 정의 후 brand 파일에 **복제**(spec이 cross-file reference 미지원)
- **brand-specific**: primary, primary-light, border-focus, border-focus-light, brand 역할 색(`fg-brand` · `bg-brand-solid` …), brand 팔레트(`brand-100` ~ `brand-1000`, v108), brand 컴포넌트 — brand 파일에서만 정의. brand 파일 내에선 `-hr`/`-desk` 접미사 없이 단순한 이름 사용(`primary`, `button-primary` 등 — context 암묵)
- **lint 운영**: `npm run lint:all`로 3파일 일괄 검증. DESIGN.md는 missingPrimary warning 1건 영구 수용(brand-agnostic 의도 신호), HR/Desk 파일은 0 warnings 유지
- **공유 토큰 변경 시 3파일 동기**: `npm run sync`로 `typography`/`rounded`/`spacing` 블록 + `colors` SHARED 영역(v50 마커 도입) 자동 갱신(DESIGN.md → HR/Desk). 마커 영역: `# @sync:shared-start (colors-N)` ... `# @sync:shared-end (colors-N)` 사이. `colors-0` = 팔레트(v108 — `gray` · `red` · `green` · `orange` · `blue` 단계, v110 차트용 `yellow` · `indigo` · `violet` · `pink` · `brown`, 브랜드 파일은 `@sync:brand-*` 의 `colors-0` 에 `brand` 단계), `colors-1` = Neutral(bg/surface/text/border), `colors-2` = Semantic + Chart(v110 부터 팔레트 단계를 가리킨다, 다크는 `chart-*-dark`), `colors-3` = 역할 색(v102). v108 부터 역할 색은 팔레트를, 옛 이름은 역할 색을 `"{colors.x}"` 로 가리킨다 — hex 는 팔레트에만 있다. brand 영역(`@sync:brand-*`)은 sync 비대상으로 보존. components 영역은 향후 마커 도입 후 확장. `npm run verify`로 sync 검사 + lint:all 통합 실행(머지 전 게이트로 권장).

## HOW (작업 규칙)

### 토큰 추가/수정 시 절대 규칙
1. 색상은 WCAG AA 대비비 충족 (본문 4.5:1, UI 3:1) — `npx @google/design.md lint`로 검증
2. HR / Desk 듀얼 브랜드를 깨지 않도록 — neutral / semantic 토큰은 공통, accent만 분기
3. 한국어 본문 가독성 우선 — Pretendard 기본, 영문 fallback은 Inter
4. 토큰 이름은 의미 기반 (`accent-primary`), 색상값 기반 금지 (`green-500` ❌) — 예외: v108 팔레트 층은 SEED 처럼 `gray-500` 꼴이다. 역할 색이 가리키는 자리로만 쓰고, 화면 · 컴포넌트는 역할 이름만 부른다(사용자 결정 2026-09-30)

### 작업 흐름
- 변경 전: 현재 `DESIGN.md`를 `DESIGN.history/v{N}-{이유}.md`로 복사
- 변경 후: `npm run lint` 실행, 통과해야 commit
- 색상값 수정 시: `npm run diff`로 변경사항 명시
- 한 번에 5개 토큰 이상 추가 금지 — 점진적으로 확장 (예외: 2026-09-29 SEED 간격 · 모서리 · 글자 스케일 · 레이아웃 · 역할 색 · 모션 · 고도 도입 — 사용자가 대가를 알고 정했다, v98~v104 · 2026-09-30 SEED 팔레트 층 — 팔레트 122 + 보기용 `palette-*` 컴포넌트, v108 · 차트용 가족 다섯 100 + `chart-*-dark` 10, v110 · 카테고리 옅은 바탕 `chart-*-weak` · `-subtle` · `-contrast` 60, v111 · 2026-10-03 z-index 층 토큰 10(`z-base` ~ `z-dev`) — 옛 v65 6개를 걷고 층 표 값을 이름으로, v116 · 2026-10-03 Badge outline 의 옅은 테두리 `stroke-*-weak` 넷(라이트 · 다크 8) — 비교 페이지 2A 가 "토큰 넷을 새로" 라고 적은 안을 사용자가 골랐다, v117)

### 금지 사항
- DESIGN.md 외부에 토큰을 정의하지 말 것 (CSS, JS 어디서도)
- 사용자가 명시적으로 요청하지 않은 토큰은 추가하지 말 것
- 색상에 감정적 이름 (예: "warm green") 금지 — 시맨틱 이름만

## 컴포넌트 상세 스펙 수정 규칙
- spec 작업 규칙(4 source 정합·작업 순서·금지 사항)은 `specs/CLAUDE.md` 참조 — `specs/components/*.md` 추가/수정 시 반드시 사전 확인.
- 요약: `specs/components/<name>.md`가 단일 SoT, **4 source**(spec / .tsx / examples.mjs / preview-html `.btn` CSS) 동시 동기 필수, WCAG 기준은 2.5.5(AAA) / 2.5.8(AA) 분리 표기, 토픽 브랜치 `components/<name>`.

## 문서 사이트 (`site/`)
- 목표는 seed-design.io(당근 SEED) 급 문서다 — 기초·컴포넌트의 세부 수치를 빠짐없이 적어 웹·앱이 같은 값을 따르게 한다. 페이지를 새로 쓸 땐 SEED 의 해당 문서를 먼저 읽고, groo 현재 값 · SEED 값 · 정할 값을 나란히 보여 준 뒤 사용자가 정한 값만 적는다.
- SEED 문서는 seed-docs MCP 로 읽는다. Foundations·컴포넌트 디자인 문서는 MCP 목록에 안 나오지만 `get_doc(section: "docs", path: "../foundations/<이름>")` · `"../components/<이름>"` 으로 열린다. 목록은 `https://seed-design.io/foundations/llms.txt` · `/components/llms.txt`.
- SEED 는 Apache-2.0 — 구조·수치는 참고하되, 문장·그림을 옮기면 출처를 밝히고, 로고·캐릭터 같은 당근 브랜드 리소스는 쓰지 않는다.
- 페이지 대부분은 `site/scripts/gen-content.mjs` 가 빌드 때 원본(`DESIGN*.md` · `specs/`)에서 만든다. 만든 `.md` 는 git 밖이다 — **고치려면 원본을 고친다.** 원본을 사이트용으로 새로 쓴 페이지는 같은 자리에 `.mdx` 로 두면 생성이 건너뛴다.
- `DESIGN.md` 의 `##` 절을 추가·개명하면 `gen-content.mjs` 의 `FOUNDATION_SECTIONS` 도 고친다 — 안 고치면 빌드가 멈춘다(CI `site` 잡).
- 기초 페이지(Design Token · Color · Gradient · Typography · Iconography · Spacing · Radius · Layout · Elevation · Motion · Feedback · State · Inclusive Design · International Design · Voice and Tone · Writing)는 SEED 문서 모양으로 손으로 쓴 `.mdx` 다(`site/content/docs/foundations`). Design Token 의 Reference 만 생성 페이지다(`gen-content.mjs` 의 `tokenReference` — 머리말 토큰과 표 토큰을 모두 싣는다). **숫자는 `.mdx` 에 적지 않는다** — 표 · 그림의 값은 `site/components/foundations` 가 빌드 때 `site/lib/design-tokens.ts` 로 DESIGN*.md 를 읽어 채운다. 그 컴포넌트는 DESIGN.md 의 절 · 표 제목(예: `v83 추가 — 컴포넌트 ↔ radius 매핑`, `콘텐츠 폭 — 밀도`, `눌림 피드백`), 절 안 문장의 수치(`sectionNumber` — 예: Iconography 의 "12px 은 넘지 말아야 할 바닥"), 컴포넌트 YAML 의 크기 규칙(버튼 · 스위치 · 체크박스)으로 찾으므로, 제목 · 문장 · 규칙을 바꾸면 빌드가 멈춘다 — 같이 고친다. 그림은 groo 화면으로 새로 그린다(SEED 그림은 당근 화면이라 쓰지 않는다).
- 컴포넌트 수치는 `specs/components/<이름>.yaml` 로 옮기는 중이다(Button 부터). YAML 이 있으면 수치의 원본은 YAML 이고, md 의 표 자리는 `[표: …](<이름>.yaml#구역)` 한 줄이다 — 규칙은 `specs/CLAUDE.md`.
- **사이트가 최종 스펙이다**(사용자 2026-09-30) — 웹 · 앱 컴포넌트는 사이트에 적힌 그대로 만든다. 그래서 컴포넌트 페이지는 SEED 처럼 렌더링된 모습 · 언제 무엇을 쓰는지(화면 예시 · Do/Don't) · 코드 · Specification(YAML 규칙 전부)까지 둔다. 표와 글만 있는 페이지로 끝내지 않는다.
- 컴포넌트 페이지는 손으로 쓰지 않는다 — 스펙 md 가 원본이다. 그림은 `[그림: 캡션](../../site/components/specs/<이름>.tsx#<id>)` 한 줄로 넣고(GitHub 에서는 그림 코드로 가는 링크), 사이트가 그 자리에 `site/components/specs/<이름>.tsx` 의 그림을 그린다(그림 자리가 있는 스펙은 `.mdx` 로 생성). 버튼 · 화면 예시의 값은 `site/lib/component-spec.ts` 가 YAML 을 풀어 채운다 — 그림에 수치를 따로 적지 않는다. Specification 은 `[그림: …](../../site/components/specs/spec-sheet.tsx#<컴포넌트>)`.

## Git 작업 규칙
- 브랜치·커밋 메시지·머지 전 점검 규칙은 `GIT_CONVENTION.md` 참조 — git 레이어 작업 시 반드시 사전 확인.
- 요약: 토픽 브랜치(`tokens/<카테고리>`, `components/<이름>`) 경유, Conventional Commits(`feat(tokens):`, `fix(tokens):`, `docs(rationale):`, `feat(spec):`, `fix(spec):`).

## 참고
- Google 공식 스펙: https://github.com/google-labs-code/design.md
- 사양 문서: https://stitch.withgoogle.com/docs/design-md/overview/
- Git 규칙: `GIT_CONVENTION.md`
- 컴포넌트 spec 워크플로: `specs/CLAUDE.md`
