# Groo Design

그루 이음(조직 관리)과 그루 담다(개인 기록)가 함께 쓰는 디자인 시스템입니다. 토큰 · 컴포넌트 스펙 · 문서 사이트 · 제품용 내보내기 파일을 이 저장소에서 관리합니다.

토큰 형식은 [Google design.md](https://github.com/google-labs-code/design.md) 를 따르고, 웹에는 Tailwind v4 `@theme` CSS, 앱에는 Flutter Dart 파일로 내보냅니다.

## 시작하기

```bash
npm install          # 의존성 설치 + pre-commit hook
npm run verify       # 동기 · lint · 다크 대비 · 문서 규칙 검사
```

문서 사이트는 `site/` 에 있습니다(Next.js + Fumadocs 정적 사이트).

```bash
cd site
npm install
npm run dev          # 원본에서 페이지를 만든 뒤 개발 서버
npm run build        # site/out — 정적 사이트 + 검색 색인 + llms.txt
```

## 파일 구조

```
.
├── DESIGN.md           # 공유 원본 — 글자 · 간격 · 모서리 · 공용 색 · 기초 문서
├── DESIGN.hr.md        # 그루 이음 — 공유 원본 + 브랜드 색
├── DESIGN.desk.md      # 그루 담다 — 공유 원본 + 브랜드 색
├── specs/
│   ├── components/     # 컴포넌트 스펙 — <이름>.md(규칙) · <이름>.yaml(수치)
│   └── z-index.md      # 층 표
├── site/               # 문서 사이트 — 페이지 대부분은 원본에서 빌드 때 만듭니다
├── recipes/shadcn/     # 웹 컴포넌트 레시피(cva + Radix)
├── exports/            # 제품용 내보내기 파일(토큰 CSS · Dart · 스펙 JSON)
└── scripts/            # 동기 · 검사 · 내보내기 도구
```

`DESIGN.hr.md` · `DESIGN.desk.md` 의 공유 영역은 `npm run sync` 가 `DESIGN.md` 에서 복사합니다. 직접 고치지 않습니다.

## 스크립트

| Script | 동작 |
|---|---|
| `npm run verify` | `sync:check` · `lint:all` · `lint:dark:strict` · `lint:prose:strict` · 문서 규칙 검사 — pre-commit hook 이 실행합니다 |
| `npm run sync` | 공유 영역을 브랜드 파일로 복사합니다 |
| `npm run export:tailwind:all` | `exports/tokens(.hr|.desk).css` — Tailwind v4 `@theme` |
| `npm run export:dart:all` | `exports/tokens.<브랜드>.dart` — Flutter 토큰 |
| `npm run export:spec` | `exports/spec/<브랜드>/*.json` — 컴포넌트 YAML 을 라이트 · 다크 값으로 푼 스펙 값 |
| `npm run test:exports` | 내보내기 파일 검사 |
| `npm run diff` · `npm run diff:tailwind` | `origin/main` 과 지금 원본의 토큰 · CSS 차이 |

## 제품에서 쓰기

제품은 내보낸 파일을 그대로 두고 손으로 고치지 않습니다. 값을 바꾸려면 이 저장소의 원본을 고칩니다.

```css
/* app.css */
@import "tailwindcss";
@import "./tokens.desk.css";
```

```css
.save-button {
  background: var(--color-bg-brand-solid);
  color: var(--color-fg-brand-contrast);
  padding: var(--spacing-x2) var(--spacing-x4);
  border-radius: var(--radius-r2);
  transition: background-color var(--motion-duration-color-transition) var(--motion-ease-easing);
}
.save-button:focus-visible {
  outline: 2px solid var(--color-stroke-focus-ring);
  outline-offset: 2px;
}
```

컴포넌트의 모양 · 동작 · 접근성 기준은 문서 사이트의 각 컴포넌트 페이지가 기준입니다.

## 참고

- 작업 규칙: [`CLAUDE.md`](./CLAUDE.md) · [`specs/CLAUDE.md`](./specs/CLAUDE.md)
- 브랜치 · 커밋 규칙: [`GIT_CONVENTION.md`](./GIT_CONVENTION.md)
- 구조와 수치의 일부는 [SEED Design](https://seed-design.io)(Apache-2.0)을 참고했습니다.
