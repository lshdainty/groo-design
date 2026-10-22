# Groo Design System

People + Forest. **그루 이음**(B2B 조직 관리)·**그루 담다**(B2C 개인 메모/할일/가계부) 듀얼 브랜드 단일 디자인 시스템. 한국어 우선·전 연령 접근성·Toss 톤(절제·신뢰감) 레퍼런스.

[Google design.md](https://github.com/google-labs-code/design.md) spec 기반, **Tailwind v4 `@theme` CSS** 산출물.

---

## Quick start

```bash
npm install                     # devDeps 설치 + pre-commit hook 활성화
npm run verify                  # sync 검사 + lint:all + lint:dark + lint:prose (머지 전 게이트)
npm run export:tailwind:all     # exports/tokens(.hr|.desk).css — 토큰 + 14 keyframe(@theme)
npm run build:preview           # exports/preview*.html — 토큰 카탈로그 + 컴포넌트 vignette + v73-v78 시각 데모
npm run build:examples          # exports/examples.html — copy-paste 컴포넌트 사용 예제
npm run build:site              # exports/site/ — 풀 docs site (Landing + Tokens × 8 + shadcn 컴포넌트 50, 사이드바 + 브랜드 스위처)
```

브라우저로 `exports/preview.html` 열어 토큰 + 컴포넌트 미리보기. `exports/examples.html`은 copy-paste 친화 사용 예제 페이지.

---

## 문서 사이트 (`site/`)

당근 SEED(seed-design.io) 수준의 문서 사이트를 목표로 새로 짓는 중이다 — 기초와 컴포넌트의 세부 수치를 빠짐없이 적어, 웹·앱이 같은 값을 따르게 한다. Next.js + Fumadocs 정적 사이트다.

```bash
cd site
npm install
npm run dev      # 원본에서 페이지를 만든 뒤 개발 서버
npm run build    # site/out — 정적 사이트 + 검색 색인 + llms.txt
```

페이지 대부분은 `site/scripts/gen-content.mjs` 가 빌드 때 원본에서 만든다 — `DESIGN.md` 의 `##` 절 → 기초, YAML 머리말 → Token reference, `specs/components/*.md` → 컴포넌트. 만든 페이지는 git 에 없으니 **원본을 고친다.** 원본을 사이트용으로 새로 쓴 페이지는 같은 자리에 `.mdx` 로 두면 생성이 건너뛴다.

미리보기·예제는 아직 옛 사이트(`npm run build:site` → `exports/site/`)에만 있다.

---

## 파일 구조

```
.
├── DESIGN.md             # shared baseline (typography/spacing/rounded/neutral colors/neutral components)
├── DESIGN.hr.md          # HR 브랜드 self-contained (primary #075B3C + brand 컴포넌트 + 공유 복제)
├── DESIGN.desk.md        # Desk 브랜드 self-contained (primary #0147AD + brand 컴포넌트 + 공유 복제)
├── DESIGN.history/       # 변경 백업 (v{N}-{이유}.md milestone + v{YYYYMMDD-HHMMSS}.md 자동 스냅샷)
├── EXAMPLES.md           # 컴포넌트 사용 예제 (24+ 카테고리, copy-paste HTML + Tailwind v4 utility)
├── exports/              # 빌드 산출물 (npm run export:* 매 빌드 — git tracked)
│   ├── tokens.css        # Tailwind v4 @theme (DESIGN.md) + 14 @keyframes(v74)
│   ├── tokens.hr.css     # Tailwind v4 @theme (HR)
│   ├── tokens.desk.css   # Tailwind v4 @theme (Desk) + 다크 블록
│   ├── tokens.desk.dart  # Flutter 토큰 (Desk) — 앱이 lib/app/theme 에 그대로 둔다
│   ├── spec/desk/*.json  # 컴포넌트 스펙 값(YAML 의 토큰을 라이트 · 다크 값으로) — 제품 테스트 · 카탈로그용
│   ├── tokens.dtcg.json  # W3C DTCG (shadow/motion 누락 — prose 직접 참조)
│   ├── preview*.html     # 토큰 카탈로그 + 20+ 컴포넌트 시각 vignette + v73-v78 인터랙티브 데모
│   ├── examples.html     # 컴포넌트 사용 예제 페이지 (Copy 버튼 + dark mode toggle)
│   └── site/             # 풀 docs site — Landing + Tokens × 8 + Components × 50 (shadcn 1:1 매핑)
├── recipes/              # 사용처에 그대로 복사 가능한 컴포넌트 레시피
│   └── shadcn/
│       ├── components/ui/   # 60개 .tsx 컴포넌트 (cva + Slot + forwardRef + Radix 표준)
│       ├── examples/        # 50개 *-examples.mjs (Preview HTML + JSX 코드 토글 데이터)
│       ├── styles/groo-shadcn-bridge.css  # Groo 토큰 → shadcn variables alias
│       └── lib/utils.ts     # cn() helper
├── scripts/              # native Node 도구 (외부 의존성 없음)
│   ├── sync-shared-tokens.mjs   # 공유 토큰 자동 동기 (typography/rounded/spacing + colors 마커 영역)
│   ├── build-tailwind-v4.mjs    # @theme CSS 빌드 (prose shadow/motion/overlay/breakpoint/touch-target/z-index/keyframes 자동 추출)
│   ├── test-tailwind-export.mjs # Tailwind export smoke test (namespace + keyframes 검증)
│   ├── build-preview-html.mjs   # HTML 토큰 카탈로그 + 컴포넌트 시각 데모
│   ├── build-examples-html.mjs  # EXAMPLES.md → 인터랙티브 HTML (Copy 버튼)
│   ├── build-site.mjs           # 풀 docs site 빌드 (Tokens 8 + Components 50 페이지, Preview/Code 토글)
│   ├── lint-prose.mjs           # prose 토큰 reference 정합성 + yaml/prose hex mismatch 검출
│   ├── lint-dark-contrast.mjs   # dark pair contrast 자동 검증 (4.5:1 / 3:1, spec lint 보완)
│   └── diff-tailwind.mjs        # Tailwind v4 CSS unified diff (이전 백업 대비)
├── .husky/pre-commit     # commit 전 npm run verify 자동 실행
├── .github/workflows/verify.yml  # CI: sync:check + lint:all + lint:dark + lint:prose + test:exports
├── CLAUDE.md             # 작업 규칙 (내부 — 토큰 추가 절대 규칙, sync 정책)
├── GIT_CONVENTION.md     # 브랜치/커밋 규칙
├── CHANGELOG.md          # v1 ~ v92 milestone 누적 변경
└── README.md             # (이 파일)
```

---

## 토큰 카테고리

| 카테고리 | 정의 위치 | 자동 sync | 비고 |
|---|---|---|---|
| `colors` (neutral) | DESIGN.md (source) → HR/Desk 복제 | ✓ (마커 영역) | bg-page, surface-*, text-*, border-*, semantic, chart palette |
| `colors` (brand) | DESIGN.hr.md / DESIGN.desk.md | — (보존) | primary, primary-light, border-focus, border-focus-light |
| `typography` | DESIGN.md → 복제 | ✓ (블록) | 15종 (Airbnb 네이밍 + Pretendard 한국어 우선): display-{xl,lg,md,sm} / title-{lg,md,sm} / body-{lg,md,sm} / label-{md,sm} / caption / badge / overline |
| `rounded` | DESIGN.md → 복제 | ✓ (블록) | 7종: xs(2px), sm(4px), md(8px), lg(12px), xl(16px), 2xl(24px), full(9999px) — **v83 Toss 톤 컴포넌트 매핑**(button/input/select/textarea→sm, dialog→md, drawer→lg, tooltip/checkbox→xs, badge/avatar/switch/radio/progress→full — card 는 2026-10-08 부터 r4 16, `card.yaml`) |
| `spacing` | DESIGN.md → 복제 | ✓ (블록) | 7종: xs, sm, md, lg, xl, 2xl, 3xl (4px 베이스) |
| `shadow` (prose-token) | 모든 파일 prose 표 | 수동 동기 | 8종: sm/md/lg/xl × {light, dark} (Material 3 / Big Sur 패턴) |
| `motion` (prose-token) | 모든 파일 prose 표 | 수동 동기 | 7종: duration {fast/base/slow/slower/loop} + ease-{out, linear} (v32 단발 전환 + v63 반복 애니메이션) |
| `overlay-dim` (prose-token) | 모든 파일 prose 표 | 수동 동기 | 2종: light/dark dim (alpha 채널 rgba) |
| `breakpoint` (prose-token) | 모든 파일 prose 표 | 수동 동기 | 5종: sm/md/lg/xl/2xl (640/736/834/1069/1441 — Apple Store reference, v54) |
| `touch-target` (prose-token) | 모든 파일 prose 표 | 수동 동기 | 5종: min/pill-w/circular/nav-h/nav-w (44/100/44/32/80 — WCAG 2.5.5 AAA, v59) |
| `z-index` (prose-token) | 모든 파일 prose 표 | 수동 동기 | 10종 — 층 이름(v116, `specs/z-index.md` L0 ~ L9): base/sticky/modal/modal-content/floating/tooltip/alert/alert-content/snackbar/dev (auto/50/100/101/200/210/300/301/400/9999). Tailwind `z-(--z-modal)` |
| `keyframes` (prose-CSS block) | DESIGN.md (baseline) | brand build fallback | 14종 단발/loop: fade-{in,out} / slide-in-{up,down,left,right} / scale-{in,out} / bounce-in / shake / spin / pulse / shimmer / ping (v74) |

추가 prose 가이드:
- **Form validation** (v75) — 8 rule + 한국어 message 템플릿 + 5 field state + form state machine + 3 error 위계 + ARIA live + async + multi-field
- **RTL support** (v76) — CSS logical property 18 매핑 + dir="rtl" + 9 컴포넌트 RTL 가이드

Lint 자동 검증: WCAG 1.4.3 (본문 4.5:1) + 1.4.11 (UI 3:1) — `npm run lint:all`.
prose-token은 lint 비대상 (spec이 shadow/motion/overlay/breakpoint/touch-target/z-index/keyframe 토큰 타입 미지원) — `scripts/build-tailwind-v4.mjs`가 표·코드 블록에서 추출해 v4 CSS로 export.

Coverage:
- **80+ 컴포넌트 prose spec** (shadcn/ui 카탈로그 ~100% + Banner/Tag/Popover/File Upload/Treeview 등 누락 보강)
- **shadcn 컴포넌트 페이지 50/50** (`exports/site/components/*.html`) — Form 17 / Display 12 / Overlay 9 / Navigation 9 / Disclosure 2 / Data 4 / Status 1, 각 페이지에 Preview(토큰 적용된 라이브 렌더) + Code(JSX) 토글
- **67개 `.tsx` 레시피** (`recipes/shadcn/components/ui/`, cva + Slot + forwardRef + Radix 표준) — 날짜 · 시각은 `date-picker` · `time-picker` · `wheel-picker`(2026-10-03 SEED, 옛 Calendar 조립을 대신), 표시는 `badge` · `notification-badge` · `tag-group` · `avatar` · `divider`(2026-10-03 SEED, `divider` 가 옛 `separator` 를 대신), 기다림은 `skeleton` · `progress-circle` · `progress` · `scroll-fog` · `content-placeholder`(2026-10-03 SEED, `progress-circle` 이 옛 `spinner` 를 대신), 이미지는 `image-frame` · `logo-tile` · `aspect-ratio`(2026-10-04 SEED, `carousel` 은 걷었다), 화면 틀 · 이동은 `top-navigation` · `bottom-navigation` · `side-navigation` · `side-panel` · `pagination` · `table-pagination` · `floating-action-button`(2026-10-04 SEED, `side-navigation` 이 옛 `sidebar` 를, `side-panel` 이 옛 `sheet` 를 대신하고 `breadcrumb` · `navigation-menu` 는 걷었다)
- 14 keyframes, 10 z-index layer, 5 breakpoint, 5 touch target.

---

## npm scripts

### Lint & verify
| Script | 동작 |
|---|---|
| `npm run lint` | DESIGN.md design.md spec lint (1 intentional warning: missingPrimary) |
| `npm run lint:hr` / `lint:desk` | HR / Desk 파일 lint (0 warnings) |
| `npm run lint:all` | 3 파일 일괄 |
| `npm run lint:prose` / `lint:prose:strict` | prose 토큰 reference 정합성 + yaml/prose hex mismatch 검사 (v66/v78 후속) |
| `npm run lint:dark` / `lint:dark:strict` | dark pair contrast (4.5:1 / 3:1) 자동 검증 — spec lint 보완 (165 페어) |
| `npm run sync:check` | dry-run sync 검사 (drift 시 exit 1) |
| `npm run verify` | sync:check + lint:all + lint:dark + lint:prose (pre-commit hook이 자동 실행) |

### Sync & build
| Script | 동작 |
|---|---|
| `npm run sync` | DESIGN.md SHARED 영역(typography/rounded/spacing 블록 + colors 마커 영역) → HR/Desk 자동 동기 |
| `npm run export:tailwind` | DESIGN.md → exports/tokens.css (Tailwind v4 @theme + 14 keyframes) |
| `npm run export:tailwind:hr` / `export:tailwind:desk` | HR / Desk 변형 (keyframes는 baseline에서 fallback) |
| `npm run export:tailwind:all` | 3 파일 일괄 |
| `npm run export:dart:desk` / `export:dart:hr` / `export:dart:all` | DESIGN.desk.md · DESIGN.hr.md → exports/tokens.<브랜드>.dart (Flutter — 새 이름만, 옛 별칭은 뺀다) |
| `npm run export:spec` | specs/components/*.yaml → exports/spec/<브랜드>/*.json (토큰을 라이트 · 다크 값으로 푼 스펙 값) |
| `npm run export:dtcg` | DESIGN.md → exports/tokens.dtcg.json (W3C DTCG, shadow/motion 누락) |
| `npm run test:exports` | export 빌드 + namespace + keyframe(≥14) + 다크 블록 · Dart 토큰 · 스펙 값 JSON 검증 |
| `npm run build:preview` | exports/preview*.html — 토큰 카탈로그 + v67 4종 batch + v68-v72 shadcn 25종 + v73-v78 시각 데모 |
| `npm run build:examples` | exports/examples.html — EXAMPLES.md → 인터랙티브 페이지 (Copy 버튼) |
| `npm run build:site` | exports/site/ — 풀 documentation site: 사이드바 + 브랜드 스위처 + Tokens 8 페이지 + **shadcn 컴포넌트 50/50 페이지** (Preview/Code 토글, Tailwind v4 browser CDN으로 라이브 렌더) |

### Diff & history
| Script | 동작 |
|---|---|
| `npm run diff` | design.md 기본 diff (frontmatter YAML) |
| `npm run diff:tailwind` | 가장 최근 milestone 백업 vs 현재 — Tailwind v4 CSS unified diff |
| `npm run snapshot` | 현재 DESIGN.md를 `DESIGN.history/v{YYYYMMDD-HHMMSS}.md`로 백업 |

---

## 토큰 변경 워크플로 (기여 가이드)

1. **사전 백업**: `cp DESIGN.md DESIGN.history/v{N}-{이유}.md` (milestone 식별자 v{N})
2. **토픽 브랜치**: `git checkout -b tokens/<카테고리>` (또는 `components/<이름>` / `tooling/<용도>` / `docs/<용도>`)
3. **변경 적용** (한 번에 ≤5 토큰):
   - DESIGN.md (source)에 토큰 추가/수정
   - 변경 사유 prose 작성 (대비비 실측, brand 분기 정책 등)
   - components 섹션에 sparse 매핑 추가 (lint contrastCheck 활성화)
4. **자동 동기**: `npm run sync` (typography/rounded/spacing 블록 + colors 마커 영역)
5. **검증**: `npm run verify` (sync:check + lint:all + lint:dark). 통과해야 commit 가능 (pre-commit hook이 자동 실행).
6. **Conventional commit**: `feat(tokens): add ...` / `fix(tokens): ...` / `docs(rationale): ...`
7. **머지**: `git merge --no-ff tokens/<...>`로 main에. main 직접 commit 금지.
8. **사후 스냅샷**: `npm run snapshot` (자동 timestamp 백업)

상세 규칙은 [`CLAUDE.md`](./CLAUDE.md) (내부 작업 규칙) + [`GIT_CONVENTION.md`](./GIT_CONVENTION.md) 참조.

---

## CI

`.github/workflows/verify.yml` — push to main / PR 시 자동 실행:
- `npm ci` → `npm run verify` (sync:check + lint:all + lint:dark)
- `npm run lint:prose` (prose token reference 검사)
- `npm run test:exports` (Tailwind v4 build + namespace 검증)
- `npm run export:dtcg` smoke test
- `site` 잡 — `site/` 에서 `npm ci` → `npm run build`. 원본(DESIGN·specs)이 사이트로 안 옮겨지면 여기서 깨진다

로컬 pre-commit hook이 같은 게이트 — push 전 통과 보장(`site` 빌드는 CI 에서만).

---

## 사용 예시 (Tailwind v4 import)

```css
/* app.css */
@import "tailwindcss";
@import "./node_modules/@groo/design/exports/tokens.hr.css";  /* HR 브랜드 */
@import "./node_modules/@groo/design/recipes/shadcn/styles/groo-shadcn-bridge.css";  /* shadcn variables alias */
```

shadcn/ui 컴포넌트 사용 시 — `recipes/shadcn/components/ui/`의 `.tsx` 파일을 프로젝트로 복사 + 위 bridge.css import. Groo 토큰이 자동으로 shadcn 변수(`--color-primary`, `--color-ring` 등)에 매핑되어 그대로 동작.

또는 직접 CSS variable 사용:

```css
.button-primary {
  background: var(--color-primary);
  color: var(--color-text-on-accent);
  font: var(--text-body-strong--font-weight) var(--text-body-strong) / var(--text-body-strong--line-height) var(--font-sans);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--motion-duration-fast) var(--motion-ease-out);
}
.button-primary:hover { box-shadow: var(--shadow-md); }
.button-primary:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 1px;
}
@media (prefers-color-scheme: dark) {
  .modal-overlay { background: var(--overlay-dim-dark); }
}

/* v74 keyframes 활용 — exports/tokens.css에 자동 포함 */
.modal { animation: scale-in var(--motion-duration-base) var(--motion-ease-out) both; }
.bottom-sheet { animation: slide-in-up var(--motion-duration-slow) var(--motion-ease-out) both; }
.skeleton { animation: shimmer var(--motion-duration-loop) linear infinite; }
.spinner { animation: spin var(--motion-duration-loop) linear infinite; }
.error-shake { animation: shake var(--motion-duration-slow) cubic-bezier(.36,.07,.19,.97); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

컴포넌트별 사용 예제:
- **shadcn React 컴포넌트**: [`exports/site/components/`](./exports/site/components/) (50 페이지, Preview/Code 토글) — 추천
- **HTML markup + Tailwind v4 utility**: [`EXAMPLES.md`](./EXAMPLES.md) 또는 [`exports/examples.html`](./exports/examples.html) (24+ 카테고리, Copy 버튼 + dark mode toggle)

---

## 참고

- 작업 규칙 (내부): [`CLAUDE.md`](./CLAUDE.md)
- 브랜치/커밋 규칙: [`GIT_CONVENTION.md`](./GIT_CONVENTION.md)
- 변경 이력: [`CHANGELOG.md`](./CHANGELOG.md) (v1 ~ v92)
- shadcn 컴포넌트 페이지: `exports/site/components/*.html` (50 페이지, build:site 산출)
- 컴포넌트 사용 예제: [`EXAMPLES.md`](./EXAMPLES.md) (markdown) / `exports/examples.html` (built)
- 시각 카탈로그: `exports/preview.html` / `preview.hr.html` / `preview.desk.html`
- design.md spec: https://github.com/google-labs-code/design.md
- Tailwind v4 docs: https://tailwindcss.com/docs/theme

---

**License**: 미정 (alpha 단계, public release 전).
