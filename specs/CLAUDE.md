# Porest Design System — 컴포넌트 상세 스펙 워크플로

## WHY (왜 이 가이드가 필요한가)

이번 Button 작업(2026-05-10) 중 spec / 코드 / 예제 / preview 4 source 사이 모순으로 같은 변경을 5번 이상 반복한 사례에서 도출. 토큰은 `npm run sync`로 자동 동기되지만 컴포넌트 spec은 수동 동기 영역이 많아 손이 많이 가는 데다, 어느 source가 진실인지 매번 모호해 작업이 빙빙 돈다.

이 파일은 컴포넌트 spec(`specs/components/<name>.md`)을 추가/수정할 때 따라야 할 절대 규칙·작업 순서·금지 사항을 정의한다. 토큰 워크플로(`/CLAUDE.md`)와 동등한 위계로 운영.

## WHAT (산출물 4 source)

컴포넌트 하나당 4개 파일이 동기되어야 한다 — **하나만 고치면 깨짐**.

```
specs/components/<name>.md                    ← SoT (단일 source of truth)
specs/components/<name>.yaml                  ← 수치 SoT (있을 때만 — 아래 절)
recipes/shadcn/components/ui/<name>.tsx       ← 코드 (cva variants/sizes가 spec 표와 1:1)
recipes/shadcn/examples/<name>-examples.mjs   ← 예제 (BASE/VARIANT/SIZE 상수 + render 함수)
scripts/build-preview-html.mjs `.<name>` CSS  ← preview.html 시각 (spec 시각과 동일)
```

### 수치 원본 `<name>.yaml` (2026-09-29, Button 부터)

`specs/components/<name>.yaml` 이 있는 컴포넌트는 **수치의 원본이 YAML** 이다. md 의 수치 표 자리에는
`[표: 제목](<name>.yaml#<구역>)` 한 줄만 두고, 문서 사이트(`site/`)가 빌드 때 그 파일로 표를 그린다.

- 수치를 바꿀 땐 YAML 을 고친다. md 에는 이유·규칙만 쓴다 — md 에 숫자를 다시 적으면 두 벌이 된다.
- 구역: `base[.<상태>]`(공통 — 상태를 적으면 그 상태만, 부위별 목록 표) · `slots` · `<축>`(variant · size …) · `grid.<축>[.<축>.<값>…]` · `states.<축>[.<축>…]` · `matrix[.<축>.<값>…]` · `compound`(두 축 이상) · `motion`.
  뒤에 `@<부위>` 를 붙이면 그 부위만 그린다(`matrix@option`, `base.default@palette`) — 부품마다 상태가 다른 컴포넌트(searchable-list 의 검색칸 · 결과 줄)는 부품마다 따로 그린다. 여러 부위를 한 표로 묶으려면 `+` 로 잇는다(`size@trigger+value+chevron` — 칸이 너무 많은 표를 부품별로 나눌 때).
- 없는 토큰·변형·상태·구역을 가리키면 사이트 빌드(CI `site` 잡)가 파일·줄과 함께 멈춘다.
- 형식은 `button.yaml` 머리 주석. 아직 YAML 이 없는 컴포넌트는 지금처럼 md 표가 원본이다.
- 값: `$토큰` · `$토큰 / 12%` · 단위를 붙인 값 · `{ value, dark, note }`(다크 값이 따로 있거나 비고를 붙일 때).
- 글자: 같은 부위에 `typography` 와 `lineHeight` · `fontWeight` 가 같이 있으면 따로 적은 값이 `typography` 의 그 값을 덮는다(표 14 / 20 · 줄 밀기 라벨 1.3). 스펙 JSON(`export:spec`)은 같은 규칙 · 같은 상태 · 같은 부위의 둘을 `typography` 객체에 접어 싣고, 따로 적은 값도 그대로 둔다 — 배수 줄 높이(1.3)는 글자 크기를 곱한 px 로 접는다(2026-10-15 — 구현 세션 질문 Q-011-2 · Q-012-1 정리).
- 축·상태: 목록 또는 `{ 값: 설명 }` 맵 — 설명은 표의 '설명' 칸에 나온다.
- 상태 매트릭스의 한 줄이면 `states` 에 둔다(Input 의 `error` · `readonly` 처럼 오래 가는 것도). 다른 상태와 **곱해지는** 것 — 탭 active × hover, 체크 checked × disabled — 은 **축**으로 둔다.
- 기본 상태는 `states` 의 첫째다(보통 `enabled`, Input 처럼 `default` 도 된다). 다른 상태에는 기본에서 바뀌는 값만 적는다.

#### md 표를 YAML 로 옮길 때

1. **옮길 표**: 수치의 원본인 표(크기 · 색 · 상태 · 모션 · 부위별 값). **남길 표**: Anatomy 범례, 의미·사용처만 있는 표, 동작·키보드, 접근성 검증, 다른 컴포넌트와의 비교.
2. **값을 하나도 잃지 않는다.** 토큰은 `$이름` 으로, 구현 표기(Tailwind 클래스 · CSS 식)나 단서(`≈`, `(동일)`, `(변화 없음)`)는 `note` 로 옮긴다. 옮기다 스펙과 코드가 어긋난 걸 봐도 **값을 고치지 않는다** — 목록으로 모아 사용자에게 묻는다.
3. 변경 전 md 를 `<name>.history/v-pre-yaml-numbers.md` 로 백업한다.
4. 대조: `cd site && npm run gen && node scripts/check-spec-migration.mjs <name>` — **빠짐 0** 이어야 한다. `참고` 는 값을 되풀이하는 구현 표기인지 눈으로 확인한다(정보가 있으면 note 로).

추가 동기 영역(영향이 있을 때만):
- DESIGN.md / DESIGN.hr.md / DESIGN.desk.md prose의 컴포넌트 토큰 mention
- DESIGN.md prose 내 v{N} 변경 이력 line (예: Touch targets section의 height 인용)

## HOW (작업 규칙)

### 1. 절대 규칙 (5가지)

| # | 규칙 | 이유 |
|---|---|---|
| 1 | **`specs/components/<name>.md`가 단일 SoT** (수치는 `<name>.yaml` 이 있으면 그쪽) | 모순 발생 시 spec이 진실. 코드/예제/preview는 spec을 따라가는 dependent. |
| 2 | **4 source 동시 동기** 필수 | 한 곳만 고치면 시각 모순 누적 → 사용자가 직접 발견할 때까지 노출. |
| 3 | **WCAG 기준 정확히 분리** — 2.5.5 = AAA(44×44), 2.5.8 = AA(24×24) | 한 줄에 묶으면 충족/미달 판단 혼동. |
| 4 | **변경 전 spec 백업** | 모순 발견 후 되돌리기 어려움. |
| 5 | **한 PR = 한 컴포넌트** | 여러 컴포넌트 동시 변경 시 동기 지옥. |

### 2. 작업 순서 (7단계)

```
1. 백업          cp specs/components/<name>.md \
                    specs/components/<name>.history/v{N}-{이유}.md
                 (history 디렉토리 없으면 mkdir 먼저)

2. 토픽 브랜치    git checkout -b components/<name>
                 (예: components/button, components/input)

3. SoT 정의       specs/components/<name>.md 먼저 작성/수정
                 - Anatomy / Variants / Sizes / States / Layout / Behavior
                 - Accessibility / Do-Don't / Migration notes
                 - 모든 표는 토큰 변수명 사용 (`--color-X`, `--spacing-Y`, `--radius-Z`)
                 - WCAG는 2.5.5 / 2.5.8 등 별도 행으로 분리

4. 코드 동기      .tsx cva variants/sizes      ← spec Sizes·Color tokens 표와 1:1
                 examples mjs BASE/VARIANT/SIZE ← spec 표와 1:1
                 preview-html.mjs .btn CSS    ← spec 시각과 1:1

5. 빌드           npm run build:site
                 (50/50 컴포넌트 페이지 + preview*.html 산출)

6. 시각 검증      브라우저에서 3 페이지 비교 — 동일 시각인지 직접 눈으로 확인
                 - exports/preview.html / preview.hr.html / preview.desk.html
                 - exports/site/components/<name>.html
                 - 모순 발견 시 spec(SoT)을 기준으로 코드 다시 동기

7. 게이트         npm run verify
                 (sync:check + lint:all + lint:dark + lint:prose)
```

### 3. 금지 사항 (4가지)

- **spec.md 없이 코드부터 변경 금지** — SoT가 먼저, 그 다음 dependent.
- **4 source 중 일부만 동기하고 빌드 금지** — 모순 누적.
- **WCAG 기준 한 줄에 묶기 금지** — 2.5.5와 2.5.8 분리 필수.
- **preview.html 라벨과 실제 시각 불일치 상태로 commit 금지** — 자기 모순.

### 4. spec 표 작성 규칙

#### Sizes 표 필수 컬럼
```
| Size | Height | Padding (Y · X) | Font (token) | Font (px) | Icon | Radius | Touch (AA · AAA) |
```
- `Padding (Y · X)`는 spacing 토큰명 + 픽셀 동시 표기 (예: `spacing-sm` (8))
- `Touch` 컬럼은 AA · AAA 둘 다 ✅/⚠ 표기

#### State matrix 필수 컬럼 (default variant 기준)
```
| State | Background | Brightness | Shadow | Transform | Ring | Cursor |
```
- `enabled` / `hovered` / `focused (visible)` / `pressed (active)` / `disabled` 5개 행 고정

#### 다른 variant의 state 차이 — 표 형식
```
| Variant | hover | pressed (active) |
```
- 산문(prose) 형식 금지 — 한눈에 비교 불가.

### 5. Git 컨벤션

- 토픽 브랜치: `components/<name>` (예: `components/button`, `components/input`)
- Conventional Commits:
  - `feat(spec): add <name> component spec` — 신규 spec
  - `fix(spec): correct <name> sizing/state matrix` — 수치/상태 정정
  - `docs(spec): clarify <name> WCAG criteria` — prose만 정정
- main 직접 commit 금지, `--no-ff` 머지

## 참고

- 토큰 워크플로: `/CLAUDE.md` (이 가이드와 동등 위계)
- Git 규칙: `/GIT_CONVENTION.md`
- spec 작성 첫 사례 (Button): `specs/components/button.md`
