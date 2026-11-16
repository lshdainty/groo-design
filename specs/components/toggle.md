# Toggle

> 단추 하나가 한 상태를 그 자리에서 켜고 끄는 아이콘 단추입니다(관심 등록 · 비밀값 보기). 여럿 가운데 고르거나 거르는 것은 [Chip](chip.md), 누르는 순간 적용되는 설정 줄은 [Switch](switch.md), 저장해야 적용되는 켜고 끄기는 [Checkbox](checkbox.md) 를 씁니다.

이름은 그대로 두고 켬은 `aria-pressed` 로 알립니다. 켬 · 끔은 아이콘의 모양 · 굵기 · 색으로만 구분하고 바탕은 칠하지 않습니다. 금액 가리기 눈은 설정으로 가는 버튼이라 Toggle 이 아닙니다(아래 "금액 가리기 눈은 Toggle 이 아닙니다").

수치 원본은 [`toggle.yaml`](toggle.yaml)입니다.

[그림: 종목 머리의 관심 등록 · 증권 연결의 App Key 보기 — 라이트 · 다크](../../site/components/specs/toggle.tsx#hero)

### 직접 골라 보기

단추(관심 등록 · App Key 보기)와 켬 · 끔 · 막힘을 바꾸면 단추와 코드가 함께 바뀝니다. 눌러 보면 아이콘과 보조 기술이 읽는 말("관심 등록, 눌림")이 함께 바뀝니다.

[그림: 플레이그라운드](../../site/components/specs/toggle.tsx#playground)

## Anatomy

[그림: 단추는 보이는 상자 40 · 누르는 영역 44 · 아이콘 20 으로 이뤄집니다 — 바탕은 누를 때만 칠합니다](../../site/components/specs/toggle.tsx#anatomy)

| ⓐ Container | 단추 — 보이는 40 · 누르는 44 입니다. 바탕은 켬 · 끔에 따라 바뀌지 않고, 누를 때와 마우스를 올릴 때만 칠합니다. |
| ⓑ Icon | 아이콘 20 — 지금 상태를 그립니다. 켬은 진한 색 + 선 2.5, 끔은 흐린 색 + 선 2 입니다. |
| ⓒ Focus ring | 키보드 포커스에만 2px 링을 2px 띄워 그립니다. 브랜드 채움 위(`inverted`)에서는 브랜드 링이 채움에 묻히므로 흰 링을 씁니다. |

[표: 부위](toggle.yaml#slots)

## Properties

### 켬 · 끔 — 아이콘만 바뀝니다

켬 · 끔은 아이콘으로 구분합니다. 켬은 진한 색(`fg-neutral`) + 선 2.5, 끔은 흐린 색(`fg-neutral-muted`) + 선 2 입니다. lucide 아이콘에는 채움 모양이 없어 켬을 굵기와 색으로 나타냅니다. 바탕은 켬 · 끔 모두 투명합니다 — 상단 바 · 카드 위에서 조용하고, 켬이 "고른 칸" 처럼 무거워지지 않습니다. 상단 바 안에서만 끔도 진한 색입니다(아래 Size).

[그림: 켬 · 끔 — 관심 등록 · App Key 보기, 라이트 · 다크](../../site/components/specs/toggle.tsx#toggled)

[표: 끔 · 켬](toggle.yaml#toggled)

### 아이콘 — 지금 상태를 그립니다

아이콘은 누르면 할 일이 아니라 **지금 상태**를 그립니다. 단추는 둘로 나뉩니다.

- **기능 단추** — 무언가를 보이거나 숨기고, 켜거나 끕니다(눈 · 종). 아이콘은 lucide 의 짝이고 지금 상태 쪽을 보입니다 — 키가 가려져 있으면 `eye-off`, 보이면 `eye` 입니다. 꺼진 기능은 사선(`-off`)으로 그립니다.
- **모으기 단추** — 항목을 모아 둡니다(관심). 끔에도 사선을 두지 않습니다 — 같은 아이콘이 흐린 선 2 · 진한 선 2.5 로만 구분됩니다. 관심에 넣지 않은 종목마다 사선 별이 깔리지 않게 하기 위해서입니다. 채우지도 않습니다 — 앱의 lucide 글꼴은 채울 수 없습니다.

| 단추 | 이름(고정) | 눌림의 뜻 | 끔 | 켬 |
|---|---|---|---|---|
| 관심 등록 | "관심 등록" | 관심에 넣음 | `star` 흐린 선 2 | `star` 진한 선 2.5 |
| App Key 보기 | "App Key 보기" | 키를 보임 | `eye-off`(가림) | `eye`(보임) |

[그림: 기능 단추는 -off 짝 · 모으기 단추는 사선 없이 — 종목 머리 · 증권 연결](../../site/components/specs/toggle.tsx#icon-guide)

### Size

크기는 하나입니다 — 보이는 40 · 누르는 44 · 아이콘 20 · 모서리 8 로, Button medium 의 아이콘만 있는 단추와 같은 상자입니다. 상자와 아이콘은 px 라 글자 크기를 키워도 커지지 않습니다(DESIGN.md 의 "상자 · 아이콘 · 원은 px").

상단 바 안에 켜고 끄는 단추를 둘 때는 [Top Navigation](top-navigation.md) 의 아이콘 버튼(상자 44 · 아이콘 24)을 씁니다. 이름 고정 · `aria-pressed` · 지금 상태의 아이콘 · 굵기(끔 2 · 켬 2.5)는 같고 색만 다릅니다 — 끔도 이웃 버튼과 같은 진한 색(`fg-neutral`)입니다. 아이콘 줄에서 하나만 흐리면 막힌 단추처럼 보이기 때문입니다.

[그림: 보이는 40 · 누르는 44 · 아이콘 20 · 상단 바 안이라면 44 · 24](../../site/components/specs/toggle.tsx#size)

[표: 공통](toggle.yaml#base.enabled)

### Tone

흰 표면 · 카드 · 시트 위가 기본(`default`)입니다. 브랜드 채움 위(`inverted`)에서는 아이콘이 켬 · 끔 모두 흰색이고 모양과 굵기(2 · 2.5)로만 구분됩니다. 브랜드 채움에는 누름 색 짝이 없어 누르면 축소만 합니다([Card](card.md) 의 순자산 카드와 같습니다). 단추 둘레에 원 · 바탕을 두지 않고 흰 아이콘만 둡니다. 순자산 카드의 금액 가리기 눈은 Toggle 이 아니라, 이 상자와 색만 빌린 설정으로 가는 버튼입니다(아래 "금액 가리기 눈은 Toggle 이 아닙니다").

[그림: 순자산 카드 위 금액 가리기 눈 — 보임 · 가림, 라이트 · 다크](../../site/components/specs/toggle.tsx#tone)

[표: 표면](toggle.yaml#tone)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 바탕 없음, 아이콘만 켬 · 끔 |
| `hovered` | 웹 — 누름과 같은 바탕 `bg-layer-default-pressed`(축소 없음) |
| `focused` | 키보드 포커스에만 링 2px · 띄움 2px |
| `pressed` | 누름 바탕 + 단추 전체 2px 거리 축소. 켬 · 끔은 손을 뗄 때 바뀝니다 |
| `disabled` | 아이콘 `fg-disabled` — 켬은 선 2.5 를 그대로 둬 켜져 있던 것이 보입니다. 불투명도로 흐리게 하지 않습니다. Tab 순서에서 빠집니다 |

[그림: 상태 — 기본 · 호버 · 포커스 · 누름 · 막힘 × 끔 · 켬](../../site/components/specs/toggle.tsx#states)

예외 — 입력칸 안의 뒤 단추(비밀 보기 눈)로 쓰면 호버 · 누름 바탕 상자를 그리지 않습니다. 켬 · 끔은 아이콘으로만 구분하며, 칸 안 지우기 버튼과 같은 모양입니다([Text Field](input.md) 의 "뒤 단추").

[표: 상태 — 끔](toggle.yaml#matrix)

[표: 상태 — 켬](toggle.yaml#matrix.toggled.on)

[표: 상태 — 브랜드 채움 위](toggle.yaml#matrix.tone.inverted)

[표: 모션](toggle.yaml#motion)

## Guidelines

### 이름은 고정하고, 켬은 aria-pressed 로 알립니다

이름은 단추가 켜고 끄는 것 하나로 두고 상태마다 바꾸지 않습니다. "관심 등록" 이 켜지면 "관심 등록, 눌림" 으로 읽힙니다. 이름을 "관심 해제" 로 바꾸면 "관심 해제, 눌림" 처럼 이름과 상태가 겹쳐 읽힙니다(APG Button). 지금 상태를 이름에 넣지 않습니다. 이름은 짧은 명사 · 동사구("관심 등록" · "App Key 보기")로 쓰고, 같은 줄에 단추가 여럿이면 줄 이름을 앞에 붙입니다("장보기 목록 고정").

[그림: 읽기 — "관심 등록, 눌림" · 이름이 바뀌는 "관심 해제, 눌림"](../../site/components/specs/toggle.tsx#name-guide)

### 눈은 지금 상태를 그립니다

눈 아이콘은 늘 지금 상태를 그립니다 — 가려져 있으면 `eye-off`, 보이면 `eye` 입니다. 누르면 할 일(가렸으면 `eye` · "금액 표시")을 그리지 않습니다. App Key 보기는 키가 가려져 있으면 끔 · `eye-off` 입니다.

### 금액 가리기 눈은 Toggle 이 아닙니다

홈 · 자산 순자산 카드의 눈은 켜고 끄지 않습니다 — 누르면 금액 가리기 설정의 그 화면 묶음(홈 · 자산)으로 갑니다. 가리기는 화면 · 카드 단위라 단추 하나로는 무엇을 가릴지 정할 수 없기 때문입니다. 그래서 `aria-pressed` 를 달지 않고 이름은 "금액 가리기 설정" 입니다 — "금액 가리기 설정, 버튼" 으로 읽히고, 누르면 설정 화면이 열립니다.

모양은 Toggle 의 상자(보이는 40 · 누르는 44 · 아이콘 20)와 표면 색(`toggleVariants` 의 `tone`)을 빌리고, 아이콘은 그 카드가 가려졌는지를 그립니다(가렸으면 `eye-off`, 선은 2 그대로). 순자산 카드 위에서는 흰 아이콘만 둡니다. 폰 탭 첫 화면과 데스크톱 머리에는 두지 않습니다.

[그림: 눈 — 홈 · 자산 순자산 카드, 아이콘은 그 카드의 지금 상태 · 누르면 설정](../../site/components/specs/toggle.tsx#eye-guide)

### 글 토글은 두지 않습니다

글이 있는 켜고 끄기 단추는 두지 않습니다. 켜고 끄기는 뜻에 따라 아래처럼 나눠 씁니다.

| 이런 자리 | 쓰는 것 |
|---|---|
| 단추 하나가 한 상태를 그 자리에서 켜고 끔(관심 · 키 보기) | **Toggle**(`aria-pressed`) |
| 지금 상태를 그리되 누르면 다른 화면으로 감(순자산 카드의 금액 가리기 눈 → 설정) | Toggle 의 상자를 빌린 버튼 — `aria-pressed` 없음 |
| 여럿 가운데 거르거나 고름(계좌 거르기 · 알림 시각) | [Chip](chip.md) — 체크박스 · 라디오 의미 |
| 누르는 순간 적용되는 설정 줄 | [Switch](switch.md) · List 의 스위치 줄 |
| 저장해야 적용되는 켜고 끄기 · 할 일 완료 | [Checkbox](checkbox.md) |
| 같은 내용을 2 ~ 4가지로 바로 다르게 봄 | [Segmented Control](segmented-control.md) |

[그림: 단추 하나는 아이콘 토글 · 거르기는 칩 · 설정은 스위치](../../site/components/specs/toggle.tsx#role-guide)

### 요청 중에도 막지 않습니다

누르면 아이콘이 바로 바뀌고 요청은 뒤에서 나갑니다. 응답을 기다리며 단추를 막지 않습니다 — 막으면 키보드 초점이 본문으로 빠집니다. 불러오는 중(loading) 상태는 두지 않습니다. 실패하면 되돌리고 [Snackbar](snackbar.md) `critical` 로 알립니다 — "고정하지 못했어요. 다시 시도해주세요." + 액션 "다시 시도"(같은 요청을 다시 보냅니다. 액션이 있어 6초 동안 보입니다). 단추는 이미 이전 모습으로 돌아가 있으므로 카드에 오류 줄을 붙이지 않습니다. 빠르게 여러 번 누르면 마지막 상태만 남깁니다.

### 바탕을 칠하지 않습니다

켜졌다고 옅은 바탕 · 반전 상자를 깔지 않습니다 — 흰 표면 위 옅은 바탕(1.08)은 보이지 않고, 반전은 상단 바에 짙은 네모를 만듭니다. 켬은 아이콘으로 알립니다.

## 코드

레시피 `recipes/shadcn/components/ui/toggle.tsx` 를 씁니다(`<button type="button" aria-pressed>` — Radix Toggle 로 짜도 됩니다). 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `Toggle` — `aria-label`(필수 — 고정 이름) · `pressed` · `defaultPressed` · `onPressedChange(pressed)` · `icon`(끔일 때의 아이콘 — 필수) · `pressedIcon`(켬일 때의 아이콘 — 없으면 `icon` 그대로: 모으기 단추) · `tone`(`"default"` 기본 · `"inverted"` — 브랜드 채움 위) · `disabled`. 나머지 `<button>` 속성(`className` · `id` …)은 단추에 갑니다. 아이콘의 크기(20) · 선 굵기(끔 2 · 켬 2.5) · 색은 단추가 정하므로, 넘기는 아이콘에 `size` · `strokeWidth` 를 주지 않습니다. `onPressedChange` 는 요청을 기다리지 않고 바로 부릅니다. 감싼 쪽이 준 `onClick`(Tooltip · Help Bubble 의 `asChild`)을 먼저 부르고, 거기서 `preventDefault()` 하면 켜고 끄지 않습니다. ref 와 나머지 속성은 단추에 갑니다.

### 관심 등록 — 모으기 단추

[그림: 종목 머리 — 관심 등록 끔 · 켬](../../site/components/specs/toggle.tsx#ex-watch)

```tsx
import { Star } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

<Toggle aria-label="관심 등록" pressed={watched} onPressedChange={setWatched} icon={<Star />} />
```

### App Key 보기 — 기능 단추

[그림: App Key 보기 — 가림(eye-off) · 보임(eye)](../../site/components/specs/toggle.tsx#ex-eye)

```tsx
import { Eye, EyeOff } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

<Toggle aria-label="App Key 보기" pressed={shown} onPressedChange={setShown} icon={<EyeOff />} pressedIcon={<Eye />} />
```

### 관심 등록 — 바로 바꾸고 보냅니다

[그림: 종목 머리 — 누르면 별이 바로 바뀌고, 실패하면 되돌리고 알립니다](../../site/components/specs/toggle.tsx#ex-send)

```tsx
import { Star } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

<Toggle
  aria-label="관심 등록"
  pressed={watched}
  onPressedChange={(next) => setWatched(stock.code, next)} // 화면을 바로 바꾸고 보낸다 — 실패하면 되돌리고 스낵바("관심 종목에 넣지 못했어요." + 다시 시도)
  icon={<Star />}
/>
```

### 순자산 카드의 눈 — Toggle 이 아닙니다

[그림: 순자산 카드 — 흰 아이콘, 누르면 금액 가리기 설정](../../site/components/specs/toggle.tsx#ex-inverted)

```tsx
import { Eye, EyeOff } from "lucide-react"
import { toggleVariants } from "@/components/ui/toggle"

{/* 켜고 끄지 않는다 — 금액 가리기 설정의 이 화면 묶음으로 간다. aria-pressed 없음, 아이콘은 이 카드가 가려졌는지 */}
<button type="button" aria-label="금액 가리기 설정" className={toggleVariants({ tone: "inverted" })} onClick={() => openHideAmountsSettings("home")}>
  {hidden ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
</button>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Click / Tap | 켬 ↔ 끔 — 손을 뗄 때 아이콘이 바로 바뀌고 `onPressedChange` 를 부릅니다 |
| Keyboard `Space` · `Enter` | 누르기와 같습니다 |
| Keyboard `Tab` | 다음 포커스로 옮깁니다 |
| 마우스 호버 | 누름과 같은 바탕(축소 없음) |
| 요청 중 | 막지 않습니다 — 다시 누를 수 있습니다. 실패하면 되돌리고 알립니다 |
| Disabled | 누르기 · 키보드 불가, Tab 순서에서 빠집니다. 켬 · 끔 모양은 그대로이고 색만 `fg-disabled` 입니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 끔 아이콘 `fg-neutral-muted` 흰 표면 7.11 · 다크 7.70(시트 6.67), 켬 `fg-neutral` 16.41 · 13.42, 누름 바탕 위 끔 6.70 · 5.93 · 켬 15.48 · 10.32 ✓. 순자산 카드 위 흰 아이콘 Desk 8.38 ~ 14.78 · 다크 8.36 ~ 11.25(장식 빛 위 4.88) ✓. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓ |
| **WCAG 1.4.1** Use of color | 켬 · 끔은 색과 함께 선 굵기(2 · 2.5)로, 기능 단추는 아이콘 모양(사선)으로도 구분됩니다. 보조 기술에는 `aria-pressed` 로 알립니다 ✓ |
| **WCAG 4.1.2** Name, Role, Value | `<button>` + 고정 이름 + `aria-pressed` ✓ — 이름을 상태마다 바꾸지 않습니다 |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에 링 2px · 띄움 2px |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 보이는 40 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 누르는 영역 44 × 44 ✓ — 보이는 40 둘레로 넓힙니다 |
| **ARIA** | `<button type="button" aria-pressed="true · false">` + `aria-label`(고정). 아이콘은 `aria-hidden`. 앱은 `Semantics(button: true, toggled: …, label: …)` 이고, 라벨에 상태를 넣지 않습니다 |
| **Reduced motion** | 누름 축소를 뺍니다 — 아이콘은 원래 바로 바뀝니다 |

## Do / Don't

### ✅ Do

- 단추 하나가 한 상태를 그 자리에서 켜고 끌 때 씁니다 — 관심 · 키 보기.
- 이름은 고정하고 켬은 `aria-pressed` 로 알립니다.
- 아이콘은 지금 상태를 그립니다 — 가렸으면 `eye-off` 입니다.
- 다른 화면으로 가는 눈(금액 가리기 설정)은 `aria-pressed` 없는 버튼으로 둡니다.
- 모으기 단추(관심)의 끔은 사선 없이, 기능 단추(눈 · 종)의 끔은 `-off` 로 그립니다.
- 누르면 바로 바꾸고, 실패하면 되돌려 알립니다.

### ❌ Don't

- 켬에 옅은 바탕 · 반전 상자를 깔지 않습니다.
- 상태마다 이름을 바꾸거나("관심 등록 ↔ 관심 해제") 누르면 할 일을 아이콘으로 그리지 않습니다.
- 관심의 끔을 사선(`star-off`)으로 그리거나 별을 채우지 않습니다.
- 글이 있는 켜고 끄기 단추를 만들거나 거르기에 Toggle 을 쓰지 않습니다(Chip 을 씁니다).
- 요청 중에 단추를 막지 않습니다.
- 설정으로 가는 버튼에 Toggle · `aria-pressed` 를 쓰지 않습니다 — "눌림" 이라 읽히는데 화면이 바뀝니다.
- 보이는 크기를 40 보다 작게 두지 않습니다.

## Specification

[그림: Toggle — YAML 규칙 전부](../../site/components/specs/spec-sheet.tsx#toggle)
