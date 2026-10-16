# Toggle

> 단추 하나가 한 상태를 켜고 끄는 아이콘 단추 — 관심 등록 · 메모 고정 · 금액 가리기 · 비밀값 보기. 이름은 그대로 두고 켬은 `aria-pressed` 가 알린다. 여럿 가운데 고르거나 거르는 것은 [Chip](chip.md), 누르는 순간 적용되는 설정 줄은 [Switch](switch.md), 저장해야 적용되는 켜고 끄기는 [Checkbox](checkbox.md) 다.

SEED 에는 이 단추의 디자인 문서가 없다 — 글이 있는 알약 Toggle Button(32 · 36, `aria-pressed`)이 코드에만 있고, 아이콘 켜고 끄기는 Iconography 의 규칙("OFF, ON 개념이 있는 버튼의 상태 전환을 표현할 때는 Default(Line), On(Fill), Off(Line+Slash)을 사용합니다")과 하트 단추(Reaction Button · Image Frame Reaction Button)뿐이다(당근 SEED, Apache-2.0). porest 는 켜고 끄는 단추를 아이콘 단추 하나로 두고(2026-10-09 사용자 결정) 켬 · 끔을 아이콘의 모양 · 굵기 · 색으로만 가른다 — 바탕은 칠하지 않는다. 글 토글(옛 Toggle 의 `default` · `outline` 28 · 32 · 40)과 Toggle Group 은 걷었다. 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다.

수치 원본은 [`toggle.yaml`](toggle.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 증권 상세 머리의 관심 등록 · 메모 카드의 고정 · 상단 바의 금액 가리기 — 라이트 · 다크](../../site/components/specs/toggle.tsx#hero)

### 직접 골라 보기

단추(관심 등록 · 메모 고정 · 금액 가리기 · App Key 보기) · 켬 · 끔 · 표면(흰 표면 · 순자산 카드) · 막힘을 고르면 스펙대로 그린 단추와 그 코드가 바뀐다. 실제로 눌러 보면 아이콘과 보조 기술이 읽는 말("관심 등록, 눌림")이 함께 바뀐다.

[그림: 플레이그라운드](../../site/components/specs/toggle.tsx#playground)

## Anatomy

[그림: 단추는 보이는 상자 40 · 누르는 영역 44 · 아이콘 20 으로 이뤄진다 — 바탕은 누를 때만](../../site/components/specs/toggle.tsx#anatomy)

| ⓐ Container | 단추 — 보이는 40 · 누르는 44. 바탕은 켬 · 끔에 따라 바뀌지 않고 누를 때 · 마우스를 올릴 때만 칠한다. |
| ⓑ Icon | 아이콘 20 — 지금 상태를 그린다. 켬은 진한 색 + 선 2.5, 끔은 흐린 색 + 선 2. |
| ⓒ Focus ring | 키보드 포커스에만 2px 링 · 2px 띄움. 브랜드 채움 위(`inverted`)는 흰 링 — 브랜드 링이 채움에 묻힌다. |

[표: 부위](toggle.yaml#slots)

## Properties

### 켬 · 끔 — 아이콘만 바뀐다

켬 · 끔은 아이콘이 말한다 — 켬은 진한 색(`fg-neutral`) + 선 2.5, 끔은 흐린 색(`fg-neutral-muted`) + 선 2 다(기초 Iconography v106 — lucide 에 채움 모양이 없어 SEED 의 "켬 = 채움" 을 굵기와 색으로 대신한다). 바탕은 켬 · 끔 모두 투명하다 — 상단 바 · 카드 위에서 조용하고, 켬이 "고른 칸" 처럼 무거워지지 않는다(사용자 결정 5A — 켜면 옅은 바탕 · 반전은 고르지 않았다). 상단 바 안에서만 끔도 진한 색이다(아래 Size).

[그림: 켬 · 끔 — 관심 등록 · 메모 고정 · 금액 가리기 · App Key 보기, 라이트 · 다크](../../site/components/specs/toggle.tsx#toggled)

[표: 끔 · 켬](toggle.yaml#toggled)

### 아이콘 — 지금 상태를 그린다

아이콘은 누르면 할 일이 아니라 **지금 상태**를 그린다(사용자 결정 7A). 단추는 둘로 나뉜다.

- **기능 단추** — 무언가를 보이거나 숨기고, 켜거나 끈다(눈 · 종). 아이콘은 lucide 의 짝이고 지금 상태 쪽을 보인다 — 금액이 가려져 있으면 `eye-off`, 보이면 `eye`. 꺼진 기능은 사선(`-off`)이다.
- **모으기 단추** — 항목을 모아 둔다(관심 · 고정). 끔에도 사선을 두지 않는다 — 같은 아이콘이 흐린 선 2 · 진한 선 2.5 로만 갈린다(사용자 결정 6B — SEED 하트처럼). 관심에 넣지 않은 종목마다 사선 별이 깔리지 않는다. 채우지 않는다 — 앱의 lucide 글꼴은 채울 수 없다.

| 단추 | 이름(고정) | 눌림의 뜻 | 끔 | 켬 |
|---|---|---|---|---|
| 관심 등록 | "관심 등록" | 관심에 넣었다 | `star` 흐린 선 2 | `star` 진한 선 2.5 |
| 메모 고정 | "{메모 제목} 고정" | 고정했다 | `pin` 흐린 선 2 | `pin` 진한 선 2.5 |
| 금액 가리기 | "금액 가리기" | 금액을 가렸다 | `eye`(보임) | `eye-off`(가림) |
| App Key 보기 | "App Key 보기" | 키를 보였다 | `eye-off`(가림) | `eye`(보임) |

[그림: 기능 단추는 -off 짝 · 모으기 단추는 사선 없이 — 종목 머리 · 메모 카드](../../site/components/specs/toggle.tsx#icon-guide)

### Size

크기는 하나다 — 보이는 40 · 누르는 44 · 아이콘 20 · 모서리 8(Button medium 의 아이콘만 있는 단추와 같은 상자). 상단 바 안에서는 [Top Navigation](top-navigation.md) 의 아이콘 버튼(상자 44 · 아이콘 24)을 쓴다. 이름 고정 · `aria-pressed` · 지금 상태의 아이콘 · 굵기(끔 2 · 켬 2.5)는 같고 색만 다르다 — 끔도 이웃 버튼과 같은 진한 색(`fg-neutral`)이다. 알림 · 설정 사이에서 눈만 흐리면 막힌 단추처럼 보이기 때문이다(사용자 결정 2026-10-09 19B — 상단 바에서도 흐린 끔은 고르지 않았다).

[그림: 보이는 40 · 누르는 44 · 아이콘 20 · 상단 바의 44 · 24](../../site/components/specs/toggle.tsx#size)

[표: 공통](toggle.yaml#base.enabled)

### Tone

흰 표면 · 카드 · 시트 위가 기본(`default`)이다. 브랜드 채움 위(`inverted` — 순자산 카드의 금액 가리기)에서는 아이콘이 켬 · 끔 모두 흰색이고 모양(`eye` · `eye-off`)과 굵기(2 · 2.5)로만 갈린다. 브랜드 채움에는 누름 색 짝이 없어 누르면 축소만 한다([Card](card.md) 의 순자산 카드와 같다). 단추 둘레에 원 · 바탕을 두지 않는다 — 흰 아이콘만이다(사용자 결정 2026-10-09 21A — 늘 흰 12% 원은 고르지 않았다).

[그림: 순자산 카드 위 금액 가리기 — 끔 · 켬, 라이트 · 다크](../../site/components/specs/toggle.tsx#tone)

[표: 표면](toggle.yaml#tone)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 바탕 없음 · 아이콘만 켬 · 끔 |
| `hovered` | 웹 — 누름과 같은 바탕 `bg-layer-default-pressed`(축소 없음, v106) |
| `focused` | 키보드 포커스에만 링 2px · 띄움 2px |
| `pressed` | 누름 바탕 + 단추 전체 2px 거리 축소(v104). 켬 · 끔은 손을 뗄 때 바뀐다 |
| `disabled` | 아이콘 `fg-disabled` — 켬은 선 2.5 를 그대로 둬 켜져 있던 것이 보인다. 흐리게 하지 않는다(v106). Tab 순서에서 빠진다 |

[그림: 상태 — 기본 · 호버 · 포커스 · 누름 · 막힘 × 끔 · 켬](../../site/components/specs/toggle.tsx#states)

[표: 상태 — 끔](toggle.yaml#matrix)

[표: 상태 — 켬](toggle.yaml#matrix.toggled.on)

[표: 상태 — 브랜드 채움 위](toggle.yaml#matrix.tone.inverted)

[표: 모션](toggle.yaml#motion)

## Guidelines

### 이름은 고정, 켬은 aria-pressed

이름은 단추가 켜고 끄는 것 하나로 두고 상태마다 바꾸지 않는다 — "관심 등록" 이 켜지면 "관심 등록, 눌림" 이다("관심 해제" 로 바꾸면 "관심 해제, 눌림" 처럼 이름과 상태가 겹쳐 읽힌다 — APG Button). 지금 상태를 이름에 넣지 않는다. 이름은 짧은 명사 · 동사구("금액 가리기")이고, 같은 줄에 단추가 여럿이면 줄 이름을 앞에 붙인다("장보기 목록 고정").

[그림: 읽기 — "관심 등록, 눌림" · 이름이 바뀌는 "관심 해제, 눌림"](../../site/components/specs/toggle.tsx#name-guide)

### 눈은 지금 상태

금액 가리기는 이름이 늘 "금액 가리기" 이고, 가렸으면 눌림 · `eye-off` 다 — 상단 바 · 홈 · 자산 · 설정 어디서나 같다. 누르면 할 일(가렸으면 `eye` · "금액 표시")을 그리지 않는다(사용자 결정 7A — 같은 화면에서 두 단추가 반대 아이콘을 보이던 것을 걷는다). App Key 보기도 같은 규칙이라 키가 가려져 있으면 끔 · `eye-off` 다.

[그림: 상단 바 · 순자산 카드 · 자산 상세 바닥 — 보임 · 가림이 같은 아이콘](../../site/components/specs/toggle.tsx#eye-guide)

### 글 토글은 두지 않는다

글이 있는 켜고 끄기 단추(SEED Toggle Button · 옛 porest Toggle)는 두지 않는다(사용자 결정 8A). 켜고 끄기는 뜻에 따라 셋으로 나뉜다.

| 이런 자리 | 쓰는 것 |
|---|---|
| 단추 하나가 한 상태를 켜고 끈다(관심 · 고정 · 가리기) | **Toggle**(`aria-pressed`) |
| 여럿 가운데 거르거나 고른다(계좌 거르기 · 알림 시각) | [Chip](chip.md) — 체크박스 · 라디오 의미 |
| 누르는 순간 적용되는 설정 줄 | [Switch](switch.md) · List 의 스위치 줄 |
| 저장해야 적용되는 켜고 끄기 · 할 일 완료 | [Checkbox](checkbox.md) |
| 같은 내용을 2 ~ 4가지로 바로 다르게 본다 | [Segmented Control](segmented-control.md) |

[그림: 단추 하나는 아이콘 토글 · 거르기는 칩 · 설정은 스위치](../../site/components/specs/toggle.tsx#role-guide)

### 요청 중에도 막지 않는다

누르면 아이콘이 바로 바뀌고 요청은 뒤에서 나간다 — 응답을 기다리며 단추를 막지 않는다(막으면 키보드 초점이 본문으로 빠진다). 실패하면 되돌리고 [Snackbar](snackbar.md) `critical` 로 알린다 — "고정하지 못했어요. 다시 시도해주세요." + 액션 "다시 시도"(같은 요청을 다시 보낸다 · 액션이 있어 6초). 단추는 이미 옛 모습으로 돌아가 있어 카드에 오류 줄을 붙이지 않는다(사용자 결정 2026-10-09 20A — 카드 안 빨간 줄은 고르지 않았다). 빠르게 여러 번 누르면 마지막 상태만 남긴다.

### 바탕을 칠하지 않는다

켜졌다고 옅은 바탕 · 반전 상자를 깔지 않는다 — 흰 표면 위 옅은 바탕(1.08)은 보이지 않고, 반전은 상단 바에 짙은 네모를 만든다. 켬은 아이콘이 말한다.

## 코드

레시피 `recipes/shadcn/components/ui/toggle.tsx` 를 쓴다(`<button type="button" aria-pressed>` — Radix Toggle 로 짜도 된다). 아래 미리보기는 스펙 값으로 그린 모습이다.

- `Toggle` — `aria-label`(필수 — 고정 이름) · `pressed` · `defaultPressed` · `onPressedChange(pressed)` · `icon`(끔일 때의 아이콘 — 필수) · `pressedIcon`(켬일 때의 아이콘 — 없으면 `icon` 그대로: 모으기 단추) · `tone`(`"default"` 기본 · `"inverted"` — 브랜드 채움 위) · `disabled`, 나머지 `<button>` 속성(`className` · `id` …)은 단추에 간다. 아이콘의 크기(20) · 선 굵기(끔 2 · 켬 2.5) · 색은 단추가 건다 — 넘기는 아이콘에 `size` · `strokeWidth` 를 주지 않는다. `onPressedChange` 는 바로 부른다 — 요청을 기다리지 않는다. 감싼 쪽이 준 `onClick`(Tooltip · Help Bubble 의 `asChild`)을 먼저 부르고, 거기서 `preventDefault()` 하면 켜고 끄지 않는다 — ref 와 나머지 속성은 단추에 간다.

### 관심 등록 — 모으기 단추

[그림: 종목 머리 — 관심 등록 끔 · 켬](../../site/components/specs/toggle.tsx#ex-watch)

```tsx
import { Star } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

<Toggle aria-label="관심 등록" pressed={watched} onPressedChange={setWatched} icon={<Star />} />
```

### 금액 가리기 — 기능 단추

[그림: 금액 가리기 — 보임(eye) · 가림(eye-off)](../../site/components/specs/toggle.tsx#ex-eye)

```tsx
import { Eye, EyeOff } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

<Toggle aria-label="금액 가리기" pressed={hidden} onPressedChange={setHidden} icon={<Eye />} pressedIcon={<EyeOff />} />
<Toggle aria-label="App Key 보기" pressed={shown} onPressedChange={setShown} icon={<EyeOff />} pressedIcon={<Eye />} />
```

### 메모 고정 — 바로 바꾸고 보낸다

[그림: 메모 카드 — 위 하나만 고정, 실패하면 되돌리고 알림](../../site/components/specs/toggle.tsx#ex-pin)

```tsx
import { Pin } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

<Toggle
  aria-label={`${memo.title} 고정`}
  pressed={memo.pinned}
  onPressedChange={(pinned) => setPinned(memo.id, pinned)} // 화면을 바로 바꾸고 보낸다 — 실패하면 되돌리고 스낵바
  icon={<Pin />}
/>
```

### 순자산 카드 위

[그림: 순자산 카드 — 흰 아이콘, 가림 · 보임](../../site/components/specs/toggle.tsx#ex-inverted)

```tsx
import { Eye, EyeOff } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

<Toggle tone="inverted" aria-label="금액 가리기" pressed={hidden} onPressedChange={setHidden} icon={<Eye />} pressedIcon={<EyeOff />} />
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Click / Tap | 켬 ↔ 끔 — 손을 뗄 때 아이콘이 바로 바뀌고 `onPressedChange` 를 부른다 |
| Keyboard `Space` · `Enter` | 누르기와 같다 |
| Keyboard `Tab` | 다음 포커스로 |
| 마우스 호버 | 누름과 같은 바탕(축소 없음) |
| 요청 중 | 막지 않는다 — 다시 누를 수 있다. 실패하면 되돌리고 알린다 |
| Disabled | 누르기 · 키보드 불가, Tab 순서에서 빠진다. 켬 · 끔 모양은 그대로(색만 `fg-disabled`) |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 끔 아이콘 `fg-neutral-muted` 흰 표면 7.11 · 다크 7.70(시트 6.67), 켬 `fg-neutral` 16.41 · 13.42, 누름 바탕 위 끔 6.70 · 5.93 · 켬 15.48 · 10.32 ✓. 순자산 카드 위 흰 아이콘 Desk 8.38 ~ 14.78 · 다크 8.36 ~ 11.25(장식 빛 위 4.88) ✓. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 5.06 · 6.23 ✓ |
| **WCAG 1.4.1** Use of color | 켬 · 끔은 색과 함께 선 굵기(2 · 2.5)와 — 기능 단추는 — 아이콘 모양(사선)으로 갈린다. 보조 기술에는 `aria-pressed` 가 알린다 ✓ |
| **WCAG 4.1.2** Name, Role, Value | `<button>` + 고정 이름 + `aria-pressed` ✓ — 이름을 상태마다 바꾸지 않는다 |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에 링 2px · 띄움 2px |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 보이는 40 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 누르는 영역 44 × 44 ✓ — 보이는 40 둘레로 넓힌다 |
| **ARIA** | `<button type="button" aria-pressed="true · false">` + `aria-label`(고정). 아이콘은 `aria-hidden`. 앱은 `Semantics(button: true, toggled: …, label: …)` — 라벨에 상태를 넣지 않는다 |
| **Reduced motion** | 누름 축소를 뺀다 — 아이콘은 원래 바로 바뀐다 |

## Do / Don't

### ✅ Do

- 단추 하나가 한 상태를 켜고 끌 때 쓴다 — 관심 · 고정 · 가리기 · 보기.
- 이름은 고정하고 켬은 `aria-pressed` 로.
- 아이콘은 지금 상태를 그린다 — 가렸으면 `eye-off`.
- 모으기 단추(관심 · 고정)의 끔은 사선 없이, 기능 단추(눈 · 종)의 끔은 `-off`.
- 누르면 바로 바꾸고, 실패하면 되돌려 알린다.

### ❌ Don't

- 켬에 옅은 바탕 · 반전 상자를 깔기.
- 상태마다 이름 바꾸기("관심 등록 ↔ 관심 해제") · 누르면 할 일을 아이콘으로 그리기.
- 관심 · 고정의 끔을 사선(`star-off` · `pin-off`)으로 · 별을 채우기.
- 글이 있는 켜고 끄기 단추 · 거르기에 Toggle 쓰기(Chip).
- 요청 중에 단추를 막기.
- 보이는 크기를 40 보다 작게(지금 18 · 21 · 26 · 28 · 32 · 36).

## Specification

`toggle.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Toggle 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — toggle.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#toggle)

## SEED 와 다른 점

- **아이콘만 있는 단추다** — SEED Toggle Button 은 글이 있는 알약(xsmall 32 · small 36 · 14 / 700)이고 디자인 문서가 없다(코드만). porest 는 글 토글을 두지 않는다 — 거르기는 Chip, 설정은 Switch 다.
- **켬을 바탕으로 칠하지 않는다** — SEED `brandSolid` 는 끔이 주황 채움 · 켬이 회색 알약이고 `neutralWeak` 는 켬 · 끔 색이 같다(라벨 · 아이콘만 바뀐다). SEED Iconography 의 켬 = 채움(Fill)은 lucide 에 채움 모양이 없어 진한 색 + 선 2.5 로 대신한다(v106).
- **모으기 단추의 끔은 사선 없이** — SEED Iconography 는 끔을 Line + Slash 로 적었지만 하트 단추(Reaction · Image Frame Reaction Button)는 끔을 사선 없는 선으로 둔다. porest 는 모으기(관심 · 고정)는 사선 없이, 기능(눈 · 종)은 `-off` 로 나눴다.
- **이름은 고정** — SEED 예제는 켜면 라벨도 바꾼다("미선택" ↔ "선택됨"). porest 는 APG 대로 이름을 두고 `aria-pressed` 만 바꾼다.
- **누르는 영역 44** — SEED 32 · 36 · 하트 40.
- **막힘은 진짜 `disabled`**(Tab 에서 빠진다 — Button 과 같다). SEED 는 `aria-disabled`(포커스가 남는다)다. 불러오는 중(loading)은 두지 않는다 — 누르면 바로 바뀐다.

## Migration notes

### 2026-10-09 — 켜고 끄는 아이콘 단추로 다시 쓴다

사용자가 [입력 비교 페이지](https://claude.ai/artifact/CwVJDATSmLtwQoH67wh1zj)에서 정했다 — 아이콘만 바뀐다(5A — 바탕 그대로, 켬 = 진한 색 + 선 2.5, 보이는 40 · 누르는 44 · 이름 고정 + `aria-pressed`), 모으기 단추(관심 · 고정)의 끔은 사선 없이(6B — 기초 Iconography 에 한 줄을 더했다), 눈은 지금 상태(7A — 가렸으면 `eye-off`, 이름 "금액 가리기" 고정), 글 토글은 두지 않는다(8A — Toggle 스펙은 아이콘 토글 단추가 되고 `default` · `outline` 28 · 32 · 40 은 걷는다). 그리고 "따라오는 것" — 할 일 완료 원은 Checkbox, 앱 `PToggle` 3곳은 칩 · Select 로, HR 테마 단추 이름 한국어, 요청 중에도 막지 않는다. 켜면 옅은 바탕(5B) · 반전(5C) · 모으기 단추도 사선(6A) · 누르면 할 일을 그리는 눈(7B) · SEED Toggle Button(8B) · 지금 porest Toggle(8C)은 고르지 않았다. 스펙을 쓰다 나온 것(같은 비교 페이지 19 ~ 22) — 상단 바에서는 끔도 진한 색(19B — 굵기 · 아이콘으로만 가른다), 실패는 되돌린 뒤 스낵바 + "다시 시도"(20A), 순자산 카드 위는 흰 아이콘만(21A), 일정 알림 다섯은 여럿 고르는 Select(22A). Toggle 규칙 그대로의 흐린 끔(19A) · 카드 안 빨간 줄(20B) · 늘 흰 12% 원(21B) · 칩 다섯(22B)은 고르지 않았다. 옛 스펙은 `toggle.history/v-pre-seed-input.*` 에 남겼다.

| 옛 Toggle | 새 Toggle |
|---|---|
| 글 · 아이콘 단추 — `default` · `outline` × 28 · 32 · 40, 12 / 600 · 모서리 8 | 아이콘만 — 보이는 40 · 누르는 44 · 아이콘 20 |
| 켬 = `surface-input` 바탕 + `text-primary`(끔 + 호버와 같은 모양, 흰 위 1.08) · outline 은 `border-strong` | 바탕은 그대로 — 켬 = 아이콘 `fg-neutral` + 선 2.5, 끔 = `fg-neutral-muted` + 선 2 |
| 막힘 불투명도 0.5 | 아이콘 `fg-disabled` |
| 쓰임 — 툴바 · 필터 칩 · 보기 | 단추 하나 켜고 끄기(관심 · 고정 · 가리기 · 보기) — 거르기는 Chip, 설정은 Switch, 보기는 Segmented Control |

제품은 앱 적용 단계에서 옮긴다(2026-10-09 조사 — Desk 웹은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트 · 코드로 봤다). 켜고 끄는 단추가 웹 10여 곳 · 앱 5곳에 저마다 다른 크기 · 이름 규칙으로 있다.

- **관심 별** — 웹 종목 머리 38(`features/stock/ui/stock-row.tsx:307-345`)은 이름이 "관심 등록 ↔ 관심 해제" 로 바뀌면서 `aria-pressed` 도 달아 "관심 해제, 눌림" 으로 겹쳐 읽히고(D12), 켜면 노랑 바탕 + 채운 별이다. 앱(`features/stocks/presentation/toss_stocks_view.dart:1413-1436`)은 `InkWell` 이라 이름 · 상태가 없다(D14). "관심 등록" 고정 + `aria-pressed` · `star` 선 2 · 2.5 로.
- **금액 가리기 눈** — 웹 상단 바 36(`widgets/layout/ui/PorestTopBar.tsx:44-52` — 동작 이름) · 홈 히어로 28 · 모바일 26(`pages/dashboard/ui/DashboardPage.tsx:1167-1186 · 2168-2187` — `title` 만) · 자산 18(`pages/asset/ui/AssetPage.tsx:1666-1679 · 1971-1974`) · 자산 상세 바닥(`widgets/asset-full/ui/AssetDetailDialog.tsx:2352-2361` — 글 "보기 · 숨기기", 동작 아이콘) · 설정(`pages/settings/ui/SettingsPage.tsx:1007-1016`) — 상태 알림이 0이고 아이콘 뜻이 둘이다(상단 · 홈 · 자산은 상태, 자산 상세 · 비밀값은 동작 — D12). 앱은 홈 26 + 동작 이름 툴팁 · 자산 18 이름 0(`features/dashboard/presentation/dashboard_screen.dart:544-567` · `features/asset/presentation/asset_screen.dart:643-656`, D14). 모두 "금액 가리기" + `aria-pressed` + 지금 상태 아이콘으로, 크기는 40(상단 바 44 · 24, 순자산 카드 `tone="inverted"`).
- **비밀값 보기** — 웹 32 "App Key 보기" 고정 + `aria-pressed` 는 모범이지만 아이콘이 누르면 할 일이다(`features/subscription/ui/SecretField.tsx:47-66`). 앱 32 는 켬 상태가 없다(`features/subscription/presentation/broker_connect_card.dart:341-357`). 40 · 지금 상태 아이콘으로.
- **메모 고정 해제** — 웹 고정 메모 카드에만 아이콘 13 + 여백 4 ≈ 21(`pages/memo/ui/MemoPage.tsx:473-503`)이고 고정은 편집기 스위치 · 스와이프로만 한다. 카드의 고정 토글 40 으로 — 고정 · 해제를 같은 단추로([Card](card.md) 의 고정 버튼).
- **할 일 완료 원** — 웹 22 · 이름 "완료 ↔ 완료 취소" + `aria-pressed` · 요청 중 막힘(`pages/todo/ui/TodoPage.tsx:388-397` · `TodoMobileLedger.tsx:558-566`, D12)은 켜고 끄는 단추가 아니라 할 일의 값이다 — [Checkbox](checkbox.md)(이름에 할 일 제목)로.
- **글 토글** — 웹 `Toggle` 1곳은 가계부 계좌 거르기 3상태(고름 → 빼고 → 해제, `features/expense/ui/FilterDialog.tsx:326-355`)이고 "빼고" 가 `aria-pressed=false` 라 해제와 같게 읽힌다 · outline 켬 테두리 클래스(`toggle-variants.ts:23` 의 `border-border-default-strong`)는 정의되지 않아 그려지지 않는다(D10). 앱 `PToggle` 3곳 — 일정 반복 5 · 알림 5(`features/calendar/presentation/calendar_event_dialog.dart:580-616`)와 계좌 거르기(`features/expense/presentation/filter_dialog.dart:518-560` — "빼고" 는 `GestureDetector`)는 라벨을 두 번 읽고 단추가 아니라 켬 · 끔 컨트롤로 읽힌다(`shared/widgets/p_toggle.dart:60-64`, D13). 계좌 거르기는 [Chip](chip.md)(고른 것만 · 고른 것 빼고 — 2026-10-02), 반복은 [Select](select.md)(10-01), 알림 다섯은 여럿 고르는 Select(Chip 은 2 ~ 4)로.
- **할 일 미리보기 ↔ 편집** — 앱 `GestureDetector`(아이콘 12 + 글 ≈ 26, `features/todo/presentation/todo_edit_dialog.dart:257-282`)는 이름 · 상태가 없다(D14) — 같은 내용을 두 가지로 보는 자리라 [Segmented Control](segmented-control.md)("편집 · 미리보기")로.
- **HR 테마 단추** — "Toggle theme"(영어) · 상태 0(`shared/ui/mode-toggle/ModeToggle.tsx:25-42`, D21). 머리는 걷고 테마는 설정으로 간다(2026-10-04 화면 틀) — 남는 동안 이름을 한국어로.
- **`aria-pressed` 를 다른 뜻으로 쓰는 곳** — 웹 검색 목록 줄(`shared/ui/searchable-list.tsx:140` — 고르기는 `option` · `aria-selected`, Searchable List)과 Chip(`shared/ui/chip.tsx:73` — 칩은 라디오 · 체크박스, Chip)은 그 스펙대로 걷는다.

### 2026-10-09 — Toggle Group 을 걷는다

사용자가 같은 비교 페이지에서 정했다(9A) — 하나 고르기는 [Segmented Control](segmented-control.md)(같은 내용을 2 ~ 4가지로 바로 다르게 보기) · [Chip](chip.md)(2 ~ 4개 짧은 폼 값), 여럿 고르기는 Chip, 5개 이상은 [Select](select.md) 다. 아이콘 묶음 전용으로 남기기(9B)는 고르지 않았다. 서식 툴바(굵게 · 기울임)는 네 제품 어디에도 없어 Toggle Group 이 맡을 자리가 남지 않았다. 옛 스펙은 `toggle-group.history/v-pre-seed-input.*` 에 남겼다.

지금 묶음은 Desk 웹 `ToggleGroup` 9곳 · 앱 `PToggle` 나열 1곳 · HR 붙은 단추 1곳이다(2026-10-09 조사). 웹 묶음은 끔 칸의 경계가 없고(1.0) 켬이 흰 위 1.08 · 다크 1.3 이며, 묶음 이름이 0/9 이고, 라디오로 읽히는데 화살표가 고르지 않는다(`shared/ui/toggle-variants.ts:20-21`, D11).

| 자리 | 지금 | 가는 곳 |
|---|---|---|
| 카테고리 예산 금액 제안(`widgets/budget-manage/ui/BudgetEditDialog.tsx:234-247`) · 월 예산 150 · 200 · 250 · 300만원(`:313-326`) | 하나 고르기 알약 — 프리셋과 다른 값이면 아무것도 안 골라진다 | Chip 제안 — 누르면 금액을 넣는 버튼, 고른 표시 없음 |
| 일정 반복(`widgets/calendar/ui/EventForm.tsx:592-610`) | 하나 고르기 — 반복 없음 · 매일 · 매주 · 매월 · 매년 | Select — 5개(2026-10-01) |
| 일정 알림(`EventForm.tsx:623-641`) | 여럿 고르기 — 5분 전 · 15분 전 · 30분 전 · 1시간 전 · 1일 전, 고르면 체크 12 | 여럿 고르는 Select — 5개(Chip 은 2 ~ 4). 칸에는 "15분 전, 1일 전", 넘치면 "15분 전 외 2개"(사용자 결정 2026-10-09 22A — 칩 다섯은 고르지 않았다) |
| 구독 결제 주기(`features/subscription/ui/SubscriptionDialog.tsx:255-268`) | 월 · 연 `segmented` 28 | Segmented Control — 같은 가격을 다르게 본다 |
| 반복 거래 요일(`features/recurring-transaction/ui/RecurringAddDialog.tsx:656-670` · `RecurringFromTxDialog.tsx:185-199`) | 하나 고르기 7열 알약 | Select — 7개(2026-10-01) |
| 은행 · 증권사 고르기(`widgets/asset-full/ui/AssetEditDialog.tsx:1159-1196 · 1206-1239`) | 기관 색으로 채우는 알약 | [Searchable List](searchable-list.md) — 분류 머리 + Logo Tile 줄(2026-10-08) |
| 앱 일정 반복 · 알림(`features/calendar/presentation/calendar_event_dialog.dart:580-616`) | `PToggle` 을 늘어놓았다 — 묶음 의미 0, 라벨을 두 번 읽는다 | 웹과 같다 — Select · 여럿 고르는 Select |
| HR 캘린더 보기(`features/calendar/ui/header/calendar-header.tsx:36-87`) | 일 · 주 · 월 · 년 · 일정 다섯이 붙은 아이콘 단추 — 이름 "View by day …" 영어 · 고른 상태 0(D21) | HR 적용 때 넷으로 줄여 Segmented Control, 다섯이면 Select — 이름은 한국어. 보기를 메뉴로 두지 않는다(Menu 는 실행만) |
| 앱 `PToggleGroupSingle` · `PToggleGroupMultiple`(`shared/widgets/p_toggle.dart:130-260`) | 쓰는 곳 0(D28) | 걷는다 |

### 이전 기록

- **2026-05 — preview 에 맞춤.** shadcn `toggle.tsx` 의 `text-sm` · `h-9 px-3` · 호버 `muted` 를 preview `.tg`(12 / 600 · 토큰 여백 · `surface-input` 켬 · outline 켬 `border-strong`)에 맞췄다. 이번에 글 토글째 걷었다.
