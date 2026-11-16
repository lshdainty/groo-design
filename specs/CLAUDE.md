# Groo Design System — 컴포넌트 스펙 작업 규칙

컴포넌트 스펙(`specs/components/<이름>.md` · `<이름>.yaml`)을 추가 · 수정할 때 따르는 규칙입니다. 토큰 규칙(`/CLAUDE.md`)과 같은 위계입니다. 문체와 적지 않는 것은 `/CLAUDE.md` 의 "공식 문서 작성 규칙" 을 따릅니다.

## 함께 맞추는 파일

컴포넌트 하나는 아래 파일이 서로 맞아야 합니다. 하나만 고치면 어긋납니다.

```
specs/components/<이름>.md                    ← 원본(규칙 · 가이드)
specs/components/<이름>.yaml                  ← 수치 원본(있을 때)
site/components/specs/<이름>.tsx              ← 사이트 그림(thumb · hero · 예시)
recipes/shadcn/components/ui/<이름>.tsx       ← 웹 레시피(cva variants · sizes 가 스펙과 1:1)
recipes/shadcn/examples/<이름>-examples.mjs   ← 예제
scripts/build-preview-html.mjs `.<이름>` CSS  ← 미리보기
```

## 수치 원본 `<이름>.yaml`

`<이름>.yaml` 이 있는 컴포넌트는 **수치의 원본이 YAML** 입니다. md 의 수치 표 자리에는 `[표: 제목](<이름>.yaml#<구역>)` 한 줄만 두고, 문서 사이트가 빌드 때 그 파일로 표를 그립니다.

- 수치를 바꿀 땐 YAML 을 고칩니다. md 에는 규칙 · 이유만 씁니다 — md 에 숫자를 다시 적으면 두 벌이 됩니다.
- 구역: `base[.<상태>]`(공통 — 상태를 적으면 그 상태만) · `slots` · `<축>`(variant · size …) · `grid.<축>[.<축>.<값>…]` · `states.<축>[.<축>…]` · `matrix[.<축>.<값>…]` · `compound`(두 축 이상) · `motion`. 뒤에 `@<부위>` 를 붙이면 그 부위만 그리고(`matrix@option`), `+` 로 여러 부위를 한 표로 묶습니다(`size@trigger+value+chevron`).
- 없는 토큰 · 변형 · 상태 · 구역을 가리키면 사이트 빌드(CI `site` 잡)가 파일 · 줄과 함께 멈춥니다.
- 형식은 `button.yaml` 머리 주석을 따릅니다. YAML 이 아직 없는 컴포넌트는 md 표가 원본입니다.
- 값: `$토큰` · `$토큰 / 12%` · 단위를 붙인 값 · `{ value, dark, note }`(다크 값이 따로 있거나 비고를 붙일 때). `note` 는 사이트 표에 그대로 실리는 글입니다 — 공식 문서 규칙을 따릅니다.
- 글자: 같은 부위에 `typography` 와 `lineHeight` · `fontWeight` 가 함께 있으면 따로 적은 값이 `typography` 의 값을 덮습니다. 스펙 JSON(`export:spec`)은 둘을 `typography` 객체에 접어 싣고, 배수 줄 높이(1.3)는 글자 크기를 곱한 px 로 접습니다.
- 축 · 상태: 목록 또는 `{ 값: 설명 }` 맵 — 설명은 표의 '설명' 칸에 나옵니다.
- 상태 매트릭스의 한 줄이면 `states` 에 둡니다. 다른 상태와 **곱해지는** 것(탭 active × hover, 체크 checked × disabled)은 **축**으로 둡니다.
- 기본 상태는 `states` 의 첫째입니다(보통 `enabled`). 다른 상태에는 기본에서 바뀌는 값만 적습니다.

### md 표를 YAML 로 옮길 때

1. **옮길 표** — 수치의 원본인 표(크기 · 색 · 상태 · 모션 · 부위별 값). **남길 표** — Anatomy 범례, 의미 · 쓰는 곳만 있는 표, 동작 · 키보드, 접근성 검증, 다른 컴포넌트와의 비교.
2. **값을 하나도 잃지 않습니다.** 토큰은 `$이름` 으로, 구현 표기(Tailwind 클래스 · CSS 식)는 `note` 로 옮깁니다. 옮기다 스펙과 코드가 어긋난 걸 보면 값을 고치지 말고 목록으로 모아 사용자에게 묻습니다.
3. 대조: `cd site && npm run gen && node scripts/check-spec-migration.mjs <이름>` — **빠짐 0** 이어야 합니다.

## 규칙

| # | 규칙 | 이유 |
|---|---|---|
| 1 | **`<이름>.md` 가 원본**(수치는 `<이름>.yaml` 이 있으면 그쪽) | 어긋나면 스펙이 맞고, 코드 · 예제 · 미리보기가 따라갑니다. |
| 2 | **함께 맞추는 파일을 같이 고칩니다** | 한 곳만 고치면 어긋남이 쌓입니다. |
| 3 | **WCAG 기준을 나눠 적습니다** — 2.5.5 = AAA(44×44), 2.5.8 = AA(24×24) | 한 줄에 묶으면 충족 · 미달 판단이 섞입니다. |
| 4 | **한 PR = 한 컴포넌트** | 여러 컴포넌트를 함께 바꾸면 맞추기 어렵습니다(문서 문체만 고치는 일은 예외). |

## 스펙 md 의 모양

```
# <이름>
> 한두 문장 요약 — 무엇이고 언제 쓰는지(사이트 설명 · 개요에 쓰입니다)

[그림: …](…tsx#hero)
### 직접 골라 보기            (플레이그라운드가 있을 때)
## Anatomy
## Properties                 (변형 · 크기 · 상태 — 표는 YAML 자리)
## Guidelines                 (언제 무엇을 쓰는지 · 예외)
## 코드
## Behavior                   (인터랙션 · 키보드)
## Accessibility              (WCAG 기준별 검증 표)
## Do / Don't
## Specification              ([그림: …](…spec-sheet.tsx#<이름>))
```

- 모든 색 · 간격 · 모서리는 토큰 이름으로 적습니다(`fg-neutral` · `spacing-x4` · `radius-r2`).
- 사이트 그림(`site/components/specs/<이름>.tsx`)의 캡션 · 그림 안 설명 글도 같은 문체로 씁니다.

## 작업 순서

```
1. 브랜치      git worktree 로 components/<이름> (워크스페이스 규칙)
2. 원본        specs/components/<이름>.md · .yaml
3. 따라 맞추기  사이트 그림 · 레시피 · 예제 · 미리보기
4. 검사        npm run verify
               npm run build:preview
               (cd site && npm run types:check && npm run build)
5. 눈으로 확인  사이트의 컴포넌트 페이지 · 개요 카드를 라이트 · 다크로 봅니다
```

## 금지

- 스펙 없이 코드부터 바꾸지 않습니다.
- 함께 맞추는 파일 중 일부만 고친 채 머지하지 않습니다.
- WCAG 기준을 한 줄에 묶지 않습니다.
- 미리보기 라벨과 실제 모습이 다른 채 커밋하지 않습니다.

## 참고

- 토큰 규칙 · 공식 문서 작성 규칙: `/CLAUDE.md`
- Git 규칙: `/GIT_CONVENTION.md`
- 스펙 예: `specs/components/date-picker.md`
