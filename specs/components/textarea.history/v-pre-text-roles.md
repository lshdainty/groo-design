# Textarea

> 여러 줄 글을 받는 입력칸. 메모 본문 · 휴가 사유 · 설명 · 탈퇴 사유처럼 길게 쓰는 값을 받고, 쓴 만큼 높이가 자란다. 한 줄 값은 [Input](input.md)이다.

구조는 당근 [SEED Textarea](https://seed-design.io/components/text-input#textarea)(Apache-2.0)를 따른다 — 상자(Container)와 입력. 상자 · 테두리 · 상태는 Input 의 상자형(outline)과 같고, 다른 것은 높이 · 위아래 여백 · 자라는 방식이다. 라벨 · 설명 · 오류 · 글자 수는 [Field](field.md)가 둘레에서 그린다. SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-01 사용자 결정).

수치 원본은 [`textarea.yaml`](textarea.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 메모 · 휴가 사유 — 라이트 · 다크](../../site/components/specs/textarea.tsx#hero)

### 직접 골라 보기

크기 · 자동 높이 · 최대 높이 · 상태 · 글자 수를 고르면 스펙대로 그린 칸과 그 코드가 바뀐다. 실제로 써서 자라는 모습을 볼 수 있다.

[그림: 플레이그라운드](../../site/components/specs/textarea.tsx#playground)

## Anatomy

[그림: 칸은 상자와 입력으로 이뤄진다](../../site/components/specs/textarea.tsx#anatomy)

| ⓐ Container | 상자 — 테두리 · 바탕 · 모서리. 넘치는 글은 상자 안에서 스크롤한다. |
| ⓑ Value · Placeholder | 입력 — 쓴 글, 비었으면 예시 글(placeholder). 위아래 · 좌우 여백은 입력이 가진다. |

[표: 부위](textarea.yaml#slots)

## Properties

### Auto Size

자동 높이가 기본이다 — 3줄(large 94 · medium 82)에서 시작해 쓴 만큼 자란다. 최대 높이는 기본으로 없고, 자리마다 정할 수 있다(정하면 그 높이부터 칸 안에서 스크롤). 손잡이(resize)는 두지 않는다.

자동 높이를 끄면(`autoSize={false}`) 높이를 자리마다 정한다 — 2줄(large 72 · medium 62)보다 낮게 두지 않고, 넘치는 글은 칸 안에서 스크롤한다. 높이는 반드시 정한다(SEED). 켜 둔 채 자란 칸에서 끄면 자랄 때 넣은 높이를 걷어 고정 높이로 돌아가고, 넘치는 글은 스크롤된다.

[그림: 자동 높이 — 3줄에서 자란다 · 최대 높이에서 멈추고 스크롤 · 고정 높이](../../site/components/specs/textarea.tsx#autosize)

[표: 높이](textarea.yaml#compound)

[표: 자동 높이](textarea.yaml#autoSize)

### Size

Input 과 같다 — `large`(글자 16 · 모서리 12 · 여백 위아래 14 · 좌우 16)는 폰 · 앱, `medium`(14 · 8 · 12 · 14)은 1280 이상 데스크톱 웹에서만. 웹의 기본은 `responsive`(1280 미만 large · 이상 medium), 앱은 늘 large 다.

[표: 크기](textarea.yaml#size)

### State

Input 의 상자형과 같다 — 포커스는 안쪽 2px `stroke-neutral-contrast`(마우스 · 터치도), 오류는 안쪽 2px `stroke-critical-solid`(포커스해도 그대로), 비활성 · 읽기 전용은 `bg-disabled` 바탕(흐리게 하지 않는다), 비활성 글자는 `fg-disabled`. 읽기 전용은 포커스 표시가 없고(사용자 결정 2026-10-08 — 까닭과 2.4.7 은 [Input](input.md)), 캐럿은 글자색 · 고른 글은 기기 기본 하이라이트다.

[그림: 상태 — 기본 · 포커스 · 오류 · 비활성 · 읽기 전용](../../site/components/specs/textarea.tsx#states)

[표: 상태](textarea.yaml#matrix)

[표: 모션](textarea.yaml#motion)

## Guidelines

### 긴 글은 Textarea 로

한 줄을 넘을 수 있는 글(사유 · 설명 · 메모)은 Textarea 로 받는다 — 한 줄 칸에 200자를 받으면 쓴 글을 한눈에 볼 수 없다. 최대 길이가 있으면 Field 의 글자 수를 붙인다.

[그림: 긴 글 — 자라는 Textarea 와 글자 수 · 한 줄 칸에 받은 탈퇴 사유](../../site/components/specs/textarea.tsx#long-guide)

### 시트 · 대화상자 안에서는 최대 높이

시트나 대화상자처럼 높이가 정해진 곳에서는 최대 높이를 정한다 — 끝없이 자라면 저장 버튼이 화면 밖으로 밀린다.

[그림: 최대 높이 — 시트 안에서 칸이 멈추고 스크롤 · 칸이 자라 저장 버튼을 밀어낸 시트](../../site/components/specs/textarea.tsx#max-guide)

## 코드

레시피 `recipes/shadcn/components/ui/textarea.tsx`(Textarea)를 [Field](field.md) 안에 둔다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 기본

[그림: 기본 — 자동 높이와 글자 수](../../site/components/specs/textarea.tsx#ex-basic)

```tsx
import { Field } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

<Field label="휴가 사유" maxGraphemeCount={1000}>
  <Textarea placeholder="예: 가족 행사 참석" />
</Field>
```

### 최대 높이

[그림: 최대 높이 — 240 에서 멈추고 스크롤](../../site/components/specs/textarea.tsx#ex-max)

```tsx
<Field label="메모">
  <Textarea className="max-h-60" />
</Field>
```

### 고정 높이

[그림: 고정 높이 — 넘치면 칸 안에서 스크롤](../../site/components/specs/textarea.tsx#ex-fixed)

```tsx
<Field label="공지 본문">
  <Textarea autoSize={false} className="h-60" />
</Field>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Click / Tap | 포커스 — 테두리가 2px 짙어진다. |
| 쓰기 · 붙여넣기 | 자동 높이면 글에 맞춰 바로 자란다(움직임 없이). 최대 높이에 닿으면 멈추고 스크롤이 생긴다. |
| 자동 높이를 끌 때 | 자랄 때 넣은 높이 · 넘침을 걷어 고정 높이(2줄 이상)로 돌아간다 — 넘치는 글은 칸 안에서 스크롤된다. |
| 폭이 바뀔 때 | 줄이 다시 감겨 높이를 다시 맞춘다. |
| 쓰기(최대 글자 수) | 최대에 닿으면 더 들어가지 않는다 — 한글은 조합이 끝난 뒤 자른다. |
| `Enter` | 줄바꿈. 폼을 제출하지 않는다. |
| Disabled | 포커스 · 입력 불가. 커서 not-allowed. |
| Readonly | 포커스 · 복사 · 스크롤은 되고 입력은 안 된다. 포커스 표시가 없다(Input 과 같다). |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 값 `fg-neutral` 16.41 · 13.42, placeholder `fg-placeholder` 5.50 · 6.09(시트 다크 5.27), 읽기 전용 바탕 위 값 15.20 · 10.32 ✓. 비활성 `fg-disabled` 는 기준 밖(비활성 UI) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 포커스 테두리 16.41 · 13.42, 오류 5.06 · 6.08 ✓. 기본 1px 테두리(1.23 · 1.56)는 라벨 · placeholder 와 함께 칸을 알린다 |
| **WCAG 1.4.10** Reflow | 자동 높이라 가로 스크롤 없이 글이 감긴다 |
| **WCAG 2.4.7** Focus visible | 편집 칸은 포커스하면 테두리가 2px 짙어진다 ✓. 읽기 전용은 포커스 표시가 없다 ⚠ — 사용자 결정(2026-10-08), 까닭은 [Input](input.md) 의 같은 줄 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 최소 높이 62 이상 ✓ |
| **ARIA** | 이름은 Field 의 라벨. 오류면 `aria-invalid`, 설명 · 오류 · 글자 수는 `aria-describedby`(Field 가 잇는다) |

## Do / Don't

### ✅ Do

- 긴 글은 Textarea 로, 최대 길이가 있으면 글자 수를 붙인다.
- 시트 · 대화상자 안에서는 최대 높이를 정한다.
- 자동 높이를 끄면 높이를 정한다(2줄 이상).

### ❌ Don't

- 긴 글을 한 줄 칸으로 받기.
- 손잡이로 높이를 바꾸게 하기.
- 2줄보다 낮은 고정 높이.
- 비활성 칸을 흐리게(불투명도) 그리기.

## Specification

`textarea.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Textarea 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — textarea.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#textarea)

## SEED 와 다른 점

- **모양은 상자(outline) 하나** — SEED 디자인 문서의 Textarea 에는 밑줄형이 없다(코드에만 있다).
- **자동 높이를 끈 2줄 최소 높이를 줄 높이로 계산해 적었다**(large 72 · medium 62) — SEED 문서는 70 하나다.

## Migration notes

### 2026-10-08 — 앱 적용이 남긴 것

사용자가 [비교 페이지](https://claude.ai/artifact/9qbK3fj8SL3RmTeiujoJZ6)에서 정했다(Input 과 같은 결정).

- **자동 높이를 끄면 자란 높이를 걷는다** — 레시피가 켜 둔 동안 넣은 인라인 높이 · `overflow-y: hidden` 을 그대로 두어, 끄고 나서도 큰 칸이 남고 더 쓴 글이 잘린 채 스크롤되지 않았다(desk-front #429). 레시피와 사이트의 칸을 고쳤다.
- **읽기 전용의 포커스는 표시 없음 · 캐럿은 글자색 · 고른 글은 기기 기본** — [Input](input.md) 의 2026-10-08 과 같다.

### 2026-10-01 — SEED Textarea 로

Input 과 같은 결정(SEED Text Input)을 따른다 — 투명 바탕 + 1px `stroke-neutral-weak`, 포커스 · 오류는 안쪽 2px, 비활성 · 읽기 전용은 `bg-disabled`, 크기 large · medium · 반응형. 높이는 SEED 대로 자동 높이 3줄(94 · 82)에서 시작하고, 끄면 2줄 이상 고정 높이. 옛 스펙은 `textarea.history/v-pre-seed-textarea.*` 에 남겼다.

| 옛 Textarea | 새 Textarea |
|---|---|
| 최소 80 · rows 가 높이를 정함 · 손잡이로 세로 크기 조절 | 자동 높이 3줄(94 · 82)에서 자란다, 최대 높이는 자리마다 · 손잡이 없음 |
| 회색 채운 바탕 · 모서리 4 · 여백 8 / 12 | 투명 바탕 · 모서리 12 · 8 · 여백 14 / 16 · 12 / 14 |
| 글자 `body-md` 15 / 1.6 | large `t5` 16 / 22 · medium `t4` 14 / 19 |
| 포커스 브랜드 링 · 오류 빨간 링 · 비활성 흐림 50% | Input 과 같다(안쪽 2px · `bg-disabled`) |

레시피는 `<textarea>` 하나에서 상자(div) + 입력으로 바뀌었다 — `className` 은 입력에(최대 · 고정 높이 `max-h-*` · `h-*` 도 여기), 상자에는 `rootClassName`.

제품은 앱 적용 단계에서 옮긴다(2026-10-01 조사).

- **Desk 웹** — Textarea 9곳, 자동 높이 · 최대 높이 · 글자 수 0곳. 거래 메모 3곳은 인라인으로 66(최소 80보다 작다). 긴 글을 한 줄 칸으로 받는 곳 3.
- **Desk 앱** — 여러 줄 8곳 — 고정 2줄 67 · 3줄 93 · 6줄 170 · 자동 8 → 12줄 · 5 → 8줄로 제각각, 같은 "설명" 이 화면마다 2줄 · 1줄. 탈퇴 사유(200자) · 메모류를 한 줄 칸으로 받는다.
- **HR 웹** — Textarea 12곳, 최소 64(2곳만 80), `field-sizing-content` 라 rows 가 무시된다, 최대 높이 0곳, 손잡이 제각각. 공지 수정 대화상자는 본문을 빈칸으로 연다.
