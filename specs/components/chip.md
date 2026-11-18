# Chip

> 고르거나 넣은 값을 보이는 작은 알약입니다. 2 ~ 4개 짧은 폼 값 고르기 · 누르면 값을 채워 주는 제안 · 목록 위 필터 바 · 넣은 값(지우기 버튼으로 뺍니다)에 씁니다.

5개 이상은 [Select](select.md), 글이 긴 2 ~ 4개는 [Radio](radio-group.md) · [Checkbox](checkbox.md), 다른 구역으로 옮기는 탭 · 같은 내용을 바로 거르는 2 ~ 4개는 Tabs · Segmented Control, 누를 수 없는 표시는 [Badge](badge.md) · [Tag Group](tag-group.md) 을 씁니다.

칩은 알약(Container) · 글(Label) · 앞 아이콘 · 뒤 아이콘으로 이뤄집니다. 하나 고르기는 라디오, 여럿 고르기는 체크박스, 제안 · 여는 칩은 버튼입니다.

수치 원본은 [`chip.yaml`](chip.yaml)입니다.

[그림: 가계부 · 거래 추가 · 공지 작성 — 라이트 · 다크](../../site/components/specs/chip.tsx#hero)

### 직접 골라 보기

변형 · 크기 · 고르기 방식 · 아이콘 · 상태를 고르면 스펙대로 그린 칩 묶음과 그 코드가 바뀝니다. 실제로 누를 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/chip.tsx#playground)

## Anatomy

[그림: 칩은 알약 · 앞 아이콘 · 글 · 뒤 아이콘으로 이뤄지고, 입력값 칩은 뒤에 지우기 버튼을 둡니다](../../site/components/specs/chip.tsx#anatomy)

| ⓐ Container | 알약 — 모서리 full. 글만큼 넓어지고 줄바꿈하지 않습니다. 줄보다 길면 줄 폭에서 멈추고 글 끝을 말줄임합니다. |
| ⓑ Prefix Icon | 앞 아이콘 — 묶음 안에서 모두 두거나 모두 뺍니다. 없어도 됩니다. |
| ⓒ Label | 글 — 명사로 짧게, 한 줄. 칩이 줄 폭에 닿을 때만 끝을 "…" 로 줄입니다. |
| ⓓ Suffix Icon | 뒤 아이콘 — 누르면 고르는 자리를 여는 칩의 아래 화살표(필터 바). |
| ⓔ Remove Button | 입력값 칩의 지우기 — 칩 안에서 따로 눌립니다. |

아이콘은 lucide 선 아이콘입니다 — 여는 칩은 `chevron-down`, 지우기는 `x`, 필터 지우기는 `rotate-ccw` 입니다.

[표: 부위](chip.yaml#slots)

## Properties

### Variant

세 가지입니다. 안 고른 Outline Strong 과 Outline Weak 는 똑같고, 고르면 갈립니다.

| 변형 | 안 고름 | 고름 | 쓰는 자리 |
|---|---|---|---|
| `solid` | 옅은 투명 채움(`bg-neutral-weak-alpha`) | 짙은 채움(`bg-neutral-inverted` · `fg-neutral-inverted`) | 제안 · 필터 바 — 회색 바닥 · 흰 표면 어디서나 |
| `outlineStrong` | 투명 + 안쪽 1px `stroke-neutral-weak` | 짙은 채움(테두리 없음) | 하나 고르기를 분명하게 — 거래 종류처럼 고른 값이 곧 화면의 갈래일 때. 필터 바 맨 앞 지우기(↺, 고르지 않는 칩)도 이 모양 — Solid 조건 칩과 갈립니다 |
| `outlineWeak` *(기본)* | 투명 + 안쪽 1px `stroke-neutral-weak` | 옅은 바탕 `bg-neutral-weak` + 짙은 1px `stroke-neutral-contrast`(글자 그대로) | 고르기의 기본 — 고른 칩이 여럿 보일 때(여럿 고르기 · 시트 안 고르기 · 입력값) |

고른 칩은 브랜드 색이 아니라 중립색으로 칠합니다 — 고른 칩이 여럿 보여도 브랜드 버튼(주요 동작)과 다투지 않고, Desk · HR 이 같습니다. Solid 의 옅은 바탕은 투명한 `bg-neutral-weak-alpha`(검정 4.7% · 다크 흰 12.5%)라 놓인 바탕에 섞여 회색 바닥(`bg-layer-basement`) 위에서도 보입니다 — 회색 위 1.11:1 · 흰 위 1.11:1 · 다크 1.47:1.

[그림: 변형 — Solid · Outline Strong · Outline Weak 의 안 고름 · 고름](../../site/components/specs/chip.tsx#variant)

[표: 변형 · 고름 · 크기 × 모양 — 바뀌는 값](chip.yaml#compound)

### Size

`small` 32 · `medium` 36 *(기본)* · `large` 40. 글은 세 크기 모두 14 · 500(`t4`)이고, 글과 가장자리 사이는 12 · 14 · 16, 앞 아이콘 14 · 16 · 16 과 글 사이 6, 칩 사이 8(`spacing-between-chips`)입니다. 기본은 폰 폼에서도 36 이고, small 은 촘촘한 줄(1280 이상 데스크톱의 필터 · 표 위), large 는 화면의 주인공 고르기에만 씁니다. 누르는 영역은 Button 처럼 가로 · 세로 44 까지 넓힙니다(보이는 칩은 그대로 — 글이 있는 칩은 최소 폭이 이미 44 이상이고, 아이콘만 있는 칩은 가로도 44).

[그림: 크기 — small 32 · medium 36 · large 40, 아이콘만 있는 칩](../../site/components/specs/chip.tsx#size)

[표: 크기](chip.yaml#size)

#### 큰 글자

글은 글자 크기 설정을 따르고(글자 크기에 상한을 두지 않습니다), 글이 상자를 넘지 않습니다. 상자가 커지는 방법은 플랫폼마다 다릅니다.

- **웹** — 높이 · 여백 · 아이콘 · 지우기가 rem 이라 글자 크기 설정의 배율대로 커집니다. 200% 에서 medium 칩 72 · 지우기 28 입니다.
- **앱** — 높이가 최소 높이입니다. 글이 커지면 칩이 글 줄 높이 + 위아래 (높이 − 19) ÷ 2 로 늘어나고(medium 200% 에서 38 + 8.5 × 2 = 55), 좌우 여백 · 아이콘 · 지우기는 그대로입니다. 높이를 고정해 글이 상자를 넘게 두지 않습니다.

같은 설정에서 웹 칩이 앱보다 큽니다(72 대 55). 보통 글자(100%)에서는 두 플랫폼 모두 32 · 36 · 40 입니다.

[그림: 큰 글자 200% — 웹은 상자도 배율대로 · 앱은 최소 높이](../../site/components/specs/chip.tsx#big-text)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 변형 · 고름의 바탕 |
| `hovered` | 웹 — 누름과 같은 바탕(축소 없음) |
| `pressed` | 누름 바탕(Solid `bg-neutral-weak-alpha-pressed` · Outline `bg-layer-default-pressed` · 고른 Outline Weak `bg-neutral-weak-pressed` · 짙은 채움 `bg-neutral-inverted-pressed`) + 칩 전체 2px 거리 축소 |
| `focused` | 키보드 포커스에만 바깥 링 2px · 띄움 2px `stroke-focus-ring` |
| `disabled` | 바탕 `bg-disabled` · 글자 `fg-disabled` — 흐리게 하지 않습니다. Solid(안 고름)는 바탕 `bg-neutral-weak-alpha` 를 그대로 두고 글 · 아이콘만 `fg-disabled` 입니다 — `bg-disabled` 는 회색 바닥과 같은 색이라 알약이 사라집니다. 고른 채 막히면 짙은 1px `stroke-neutral-solid` 를 남겨 무엇을 골랐는지 보입니다 |

[그림: 상태 — 기본 · 호버 · 누름 · 포커스 · 비활성 × 안 고름 · 고름](../../site/components/specs/chip.tsx#states)

[표: 상태 — Outline Weak](chip.yaml#matrix@root+focusRing)

[표: 상태 — Outline Weak 고름](chip.yaml#matrix.selected.selected@root+focusRing)

[표: 상태 — Solid](chip.yaml#matrix.variant.solid@root+focusRing)

[표: 상태 — Solid 고름](chip.yaml#matrix.variant.solid.selected.selected@root+focusRing)

[표: 상태 — Outline Strong 고름](chip.yaml#matrix.variant.outlineStrong.selected.selected@root+focusRing)

[표: 상태 — 입력값 칩의 지우기 · 묶음](chip.yaml#matrix@removeButton+group)

[표: 묶음](chip.yaml#base.enabled@group)

[표: 가로 스크롤 줄](chip.yaml#base.enabled@scrollRow)

[표: 모션](chip.yaml#motion)

### 쓰임 넷

| 쓰임 | 칩 | 의미 | 고름 |
|---|---|---|---|
| 고르기 — 하나 | `ChipRadio` 묶음 | 라디오(radiogroup) — 화살표로 옮기면 고릅니다 | 다시 눌러도 풀리지 않습니다 |
| 고르기 — 여럿 | `ChipToggle` | 체크박스 | 다시 누르면 풀립니다 |
| 제안 · 필터 바의 여는 칩 | `Chip` | 버튼 — 여는 칩은 `aria-haspopup="dialog"` | 제안은 고른 모습이 없습니다. 걸린 조건의 여는 칩은 고른 모습(짙은 채움) |
| 입력값 | `InputChip` | 글 + "{글} 지우기" 버튼 | Outline Weak 고른 모습 + 뒤 지우기 |

`aria-pressed` 는 쓰지 않습니다 — 켜고 끄는 단추 하나는 [Toggle](toggle.md)(아이콘 단추)입니다.

[그림: 쓰임 — 고르기 · 제안 · 필터 바 · 입력값](../../site/components/specs/chip.tsx#uses)

## Guidelines

### 하나 고르기 — "전체" · "없음" 은 선택지로

하나 고르기 칩은 라디오입니다 — 고른 칩을 다시 눌러도 풀리지 않고, 늘 하나가 골라져 있습니다. 거르기의 "전체" 는 맨 앞 선택지로 둡니다(글은 "전체" 하나 — "혜택 전체" 처럼 바꾸지 않습니다). 칩으로 거르는 축은 태그처럼 개수가 바뀌거나 5개 이상인 축입니다 — 개수가 정해진 2 ~ 4가지 보기(프리셋 정렬 많이 쓴 순 · 최근 사용 · 이름순)는 Segmented Control 입니다. 폼은 기본값을 골라 두거나, "없음" 이 답이면 "{칸 이름} 없음" 을 맨 앞에 둡니다([Select](select.md) 와 같은 규칙).

[그림: 하나 고르기 — 맨 앞 "전체" · 세 번째 "전체"](../../site/components/specs/chip.tsx#single-guide)

### 여럿 고르기 — 다른 칩을 바꾸는 칩을 두지 않습니다

여럿 고르기 칩은 체크박스입니다 — 다시 누르면 풀립니다. "전체 선택" 처럼 다른 칩을 바꾸는 칩은 두지 않습니다. 거르기에서 하나도 안 고르면 "조건 없음"(전부 보입니다)이고, 폼에서 꼭 골라야 하면 Field 의 오류로 알립니다. 몇 개까지 고를 수 있는지는 Field 설명에 적습니다.

[그림: 여럿 고르기 — 다시 누르면 풀립니다 · "전체 선택" 칩](../../site/components/specs/chip.tsx#multi-guide)

### 필터 바 — 조건마다 칩

목록 위 한 줄(가로 스크롤 · 끝 흐림)에 조건마다 칩을 하나씩 둡니다. 칩은 뒤에 아래 화살표를 달고, 누르면 그 조건만 시트(1280 미만) · 팝오버(1280 이상)로 엽니다. 걸린 조건의 칩은 고른 모습(짙은 채움)에 값을 요약하고("식비 외 2개" — Select 의 여럿 고른 값과 같은 꼴), 하나라도 걸리면 맨 앞에 지우기 칩(↺, 아이콘만 — 이름 "필터 지우기")을 둡니다. 걸린 조건 칩의 글이 곧 지금 조건이라 따로 "필터 2" 같은 개수를 두지 않습니다.

[그림: 필터 바 — 조건마다 칩 · 칩을 누르면 그 조건만 엽니다](../../site/components/specs/chip.tsx#filter-bar)

### 빼기 — 칩은 두 상태만

칩은 고름 · 안 고름 둘뿐입니다 — 누를 때마다 고름 → 빼고 → 해제를 도는 3상태 칩을 두지 않습니다. 빼는 조건이 필요하면 조건마다 "고른 것만 · 고른 것 빼고" 를 먼저 고르고(하나 고르기 칩 둘), 아래에서 여럿 고릅니다 — 한 조건 안에서 넣기 · 빼기를 섞지 않습니다.

[그림: 빼기 — "고른 것만 · 고른 것 빼고" 를 먼저 · 3상태 칩](../../site/components/specs/chip.tsx#exclude-guide)

### 제안 — 고른 표시가 없습니다

제안 칩(빠른 금액 · 빠른 기간)은 누르면 칸에 값을 넣는 버튼입니다 — 고른 모습이 없고, 지금 값은 칸이 보입니다. 다시 누르면 같은 값을 다시 넣습니다(고친 값을 덮어쓰지 않게, 여러 칸을 채우는 제안은 칸을 비웠을 때만 채우거나 덮어쓰기 전에 묻습니다). **프리셋 칩은 제안이 아닙니다** — 다시 누르면 해제하는 토글이라 적용한 칩만 고른 모양이고, 목록 제목이 "{이름} 적용됨" 으로 함께 알립니다.

[그림: 제안 — 칸이 값을 보입니다 · 칸 값과 같은 칩이 골라져 보입니다](../../site/components/specs/chip.tsx#suggestion-guide)

### Solid 는 어느 바탕에서나

Solid 의 옅은 바탕은 투명한 `bg-neutral-weak-alpha` 라 흰 표면에서도, 회색 바닥(`bg-layer-basement`) 위에서도 보입니다(1.11:1 · 다크 1.47:1). 불투명 `bg-neutral-weak` 로 칠하면 회색 바닥과 같은 색이라 칩이 사라집니다 — 칩 바탕에 불투명 약한 배경을 쓰지 않습니다(DESIGN.md Elevation 의 "바닥 위의 채움"). 막힌 Solid 칩도 같습니다 — 바탕은 그대로 두고 글 · 아이콘만 `fg-disabled` 로 바꿉니다(`bg-disabled` 도 회색 바닥과 같은 색입니다). 막힌 칩과 안 고른 칩은 바탕이 아니라 글 색으로 갈립니다.

[그림: 표면 — 흰 표면 위 Solid · 회색 바닥 위 Solid](../../site/components/specs/chip.tsx#surface-guide)

### 글

- 명사로 짧게, 한 줄 — 칩은 줄바꿈하지 않고 글만큼 넓어집니다. 한 묶음의 글 길이 · 말투를 맞춥니다.
- 여럿을 한 칩에 줄이면 "식비 외 2개"(첫 값 + 나머지 수 — "외" 는 앞의 값을 뺀 수)로 씁니다. 개수만 쓰면 "3개 고름" 입니다.
- 코드값(`Y` · `N` · `ADMIN`)을 글로 내지 않습니다(Writing).

[그림: 글 — 명사로 짧게 · 문장 · 코드값](../../site/components/specs/chip.tsx#label-guide)

### 줄보다 긴 칩 — 줄 폭에서 말줄임

넣은 값 · 사람 이름처럼 사용자가 친 글은 길이를 고를 수 없고, 큰 글자에서는 짧은 글도 길어집니다. 칩이 놓인 줄보다 넓어지면 칩은 줄 폭에서 멈추고 글 끝을 "…" 로 줄입니다 — 앞 · 뒤 아이콘과 입력값 칩의 지우기 × 는 줄지 않고 남습니다. 가로 스크롤 줄(필터 바 · 제안 줄)과 [Chip Tabs](tabs.md) 도 같습니다 — 칩 하나는 보이는 줄 폭(화면 여백 안)을 넘지 않습니다. 여는 칩의 아래 화살표도 남습니다. 보조 기술 · 지우기 이름("{글} 지우기")은 글 전체를 읽고, 넣은 값은 입력칸에서 다시 볼 수 있습니다. 줄보다 짧은 칩은 그대로 글만큼 넓습니다. 칩 안에서 줄바꿈하지 않습니다 — 칩끼리 높이가 갈리기 때문입니다.

[그림: 줄보다 긴 칩 — 줄 폭에서 말줄임 · 지우기 × 는 남습니다](../../site/components/specs/chip.tsx#long-label)

### 묶음 배치

칩 사이는 8(`spacing-between-chips`)입니다. 폼 · 시트 안의 고르기 묶음은 줄바꿈하고(줄 사이 8), 목록 위 필터 바 · 제안 줄과 기간 달력 위 빠른 기간 줄([Date Picker](date-picker.md) — 시트 안이지만 달력 높이를 지키려고)은 한 줄 가로 스크롤로 둡니다 — 줄을 화면 끝까지 내고 안쪽 여백을 화면 여백(`spacing-global-gutter`)만큼 둬 스크롤해도 첫 칩이 여백에서 시작합니다(이미 화면 여백 안에 두는 코드는 `bleed` 로 줄을 화면 끝까지 냅니다). 줄의 양 끝은 [Scroll Fog](scroll-fog.md) 로 늘 흐립니다 — 좌우 20, 스크롤 위치와 상관없이 켜져 있고, 안쪽 여백(화면 여백 24)이 흐림보다 넓어 처음 · 끝의 칩은 흐리지 않습니다.

**칸 안의 칩 줄도 바깥으로 냅니다.** 넓은 화면에서 칩 줄이 화면이 아니라 한 칸(오른쪽 열 · 카드 위) 안에 있을 때도 같습니다 — 줄을 칸 바깥 24 까지 내고 안쪽 여백 24 를 둬, 첫 칩이 아래 카드의 바깥선과 맞습니다. 넘친 칩은 칸 사이 여백에서 흐려지며 사라집니다(`bleed` — 예: 담다 웹 거래 화면 1280 의 필터 바). 칸 안으로 24 들이면 첫 칩이 카드 선과 어긋나고, 칸 끝에 그대로 두면 늘 켜진 흐림(20)이 첫 칩 앞쪽을 덮습니다.

[그림: 묶음 — 폼 안 줄바꿈 · 목록 위 가로 스크롤](../../site/components/specs/chip.tsx#layout-guide)

### 탭 · Segmented 와 나누기

칩은 값을 고르거나 거르는 자리입니다. 다른 구역으로 옮기는 2차 탭은 Tabs 의 칩 모양(Chip Tabs), 같은 내용을 2 ~ 4가지로 바로 거르거나 다르게 보는 자리는 Segmented Control 입니다. 한 화면에 칩 모양 탭과 필터 칩이 같이 있으면 탭을 Line 으로 둡니다 — 같은 모양이 둘이면 무엇이 탭인지 알 수 없습니다.

| 이런 자리 | 컴포넌트 |
|---|---|
| 2 ~ 4개 짧은 폼 값 | **Chip**(하나 · 여럿) |
| 누르면 값을 채운다 | **Chip**(제안) |
| 목록 조건을 걸고 푼다 | **Chip**(필터 바) |
| 넣은 값을 보이고 하나씩 뺀다 | **Chip**(입력값) |
| 5개 이상 · 글이 긴 2 ~ 4개 | Select · Radio · Checkbox |
| 다른 구역으로 옮긴다(2차) | Tabs 의 Chip Tabs |
| 같은 내용 2 ~ 4가지 보기 · 정렬 | Segmented Control |
| 누를 수 없는 상태 · 분류 · 메타 | [Badge](badge.md) · [Tag Group](tag-group.md) |

### 건수 · 큰 글자

- **건수** — 하나 고르기 칩의 건수("업무 5")는 글자와 다른 색(`fg-neutral-subtle`, 고른 칩은 고른 글자 색)으로 뒤에 붙입니다.
- **큰 글자** — 글이 있는 칩의 높이는 글자 크기를 따릅니다. 위아래 여백 = (높이 − 줄 높이 19) ÷ 2 — 글자 100% 에서는 정한 높이 그대로이고, 200% 에서 글이 위아래에 붙지 않습니다.

## 코드

레시피 `recipes/shadcn/components/ui/chip.tsx` 를 씁니다. 고르기 묶음은 [Field](field.md) 안에 둡니다(라벨이 묶음의 이름). 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 하나 고르기

[그림: 하나 고르기 — 거래 종류](../../site/components/specs/chip.tsx#ex-single)

```tsx
import { Field } from "@/components/ui/field"
import { ChipRadio, ChipRadioGroup } from "@/components/ui/chip"

<Field label="거래 종류">
  <ChipRadioGroup value={type} onValueChange={setType}>
    <ChipRadio variant="outlineStrong" value="expense">지출</ChipRadio>
    <ChipRadio variant="outlineStrong" value="income">수입</ChipRadio>
    <ChipRadio variant="outlineStrong" value="transfer">이체</ChipRadio>
  </ChipRadioGroup>
</Field>
```

### 여럿 고르기

[그림: 여럿 고르기 — 일정 알림](../../site/components/specs/chip.tsx#ex-multiple)

```tsx
import { ChipGroup, ChipToggle } from "@/components/ui/chip"

<Field label="알림" description="고른 때마다 알려줘요.">
  <ChipGroup>
    {["당일", "1일 전", "3일 전", "1주 전"].map((t) => (
      <ChipToggle key={t} checked={alarms.includes(t)} onCheckedChange={(on) => toggle(t, on)}>
        {t}
      </ChipToggle>
    ))}
  </ChipGroup>
</Field>
```

### 필터 바

[그림: 필터 바 — 가계부](../../site/components/specs/chip.tsx#ex-filter)

```tsx
import { ChevronDown, RotateCcw } from "lucide-react"
import { Chip, ChipGroup } from "@/components/ui/chip"

<ChipGroup layout="scroll" bleed aria-label="거래 거르기">
  {active > 0 && <Chip variant="outlineStrong" layout="iconOnly" aria-label="필터 지우기" onClick={reset}><RotateCcw /></Chip>}
  <Chip variant="solid" selected={!!period} suffixIcon={<ChevronDown />} aria-haspopup="dialog" onClick={() => open("period")}>
    {period ? periodLabel : "기간"}
  </Chip>
  <Chip variant="solid" selected={cats.length > 0} suffixIcon={<ChevronDown />} aria-haspopup="dialog" onClick={() => open("category")}>
    {cats.length ? summarize(cats) : "카테고리"}
  </Chip>
</ChipGroup>
```

### 제안 · 입력값

[그림: 제안 · 입력값 — 예산 금액 · 더치페이 참여자](../../site/components/specs/chip.tsx#ex-suggestion)

```tsx
import { Chip, ChipGroup, InputChip } from "@/components/ui/chip"

<ChipGroup aria-label="빠른 금액">
  {[100000, 300000, 500000].map((v) => (
    <Chip key={v} variant="solid" onClick={() => setAmount(v)}>{formatMan(v)}</Chip>
  ))}
</ChipGroup>

<ChipGroup aria-label="참여자">
  {people.map((p) => <InputChip key={p.id} onRemove={() => removePerson(p.id)}>{p.name}</InputChip>)}
</ChipGroup>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 하나 고르기 Click · Tap | 그 칩을 고릅니다. 고른 칩을 다시 눌러도 그대로입니다. |
| 하나 고르기 `←` `→` `↑` `↓` | 묶음 안에서 옮기며 고릅니다(라디오). Tab 은 고른 칩 하나에만 섭니다. |
| 하나 고르기 `Home` · `End` | 받지 않습니다 — 초점도 고른 칩도 그대로, 화면도 스크롤되지 않습니다(`PageUp` · `PageDown` 도). 첫 · 끝 칩으로는 화살표로 갑니다(진짜 라디오 · WAI-ARIA APG Radio Group 과 같습니다). Tabs 는 Home · End 로 옮기며 고릅니다 — 키가 다릅니다. |
| 여럿 고르기 Click · `Space` | 고르거나 풉니다. 칩마다 Tab 이 섭니다. |
| 제안 · 여는 칩 Click · `Enter` · `Space` | 값을 넣거나(제안) 그 조건의 시트 · 팝오버를 엽니다. |
| 입력값 지우기 | 그 값만 뺍니다. 포커스는 다음 칩의 지우기(없으면 앞 칩의 지우기, 그것도 없으면 묶음 — 묶음도 키보드 링을 그립니다)로 갑니다. 지우기에 키보드 포커스가 있으면 링은 칩 둘레에 그립니다. |
| 마우스 호버 | 누름과 같은 바탕(축소 없음). |
| Disabled | 누를 수 없음 · 커서 not-allowed · Tab 이 서지 않습니다. Solid 는 바탕이 그대로이고 글 · 아이콘만 흐려집니다. 고른 채 막히면 짙은 1px 테두리가 남습니다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 안 고른 글 `fg-neutral` 흰 표면 위 16.41 · 13.42, Solid 투명 바탕 위 라이트 13.71 ~ 14.79 · 다크 7.84 ~ 10.33(놓인 바탕에 따라), 고른 짙은 채움 위 `fg-neutral-inverted` 16.41 · 13.42 ✓. 비활성 `fg-disabled` 는 기준 밖(비활성 UI) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 고름은 짙은 채움(바탕과 16.41 · 13.42) 또는 짙은 1px(16.41 · 13.42)로 안 고름과 가릅니다 ✓. 고른 채 막힘 `stroke-neutral-solid` 은 `bg-disabled` 위 3.87 · 3.18 ✓(비활성이라 기준 밖이지만 3:1 을 넘깁니다). 안 고른 칩의 경계(Solid 바탕 1.11 · 다크 1.47 — 회색 바닥 위에서도 · Outline 1px 1.23)는 칩을 알리는 유일한 표시가 아닙니다 — 글이 알립니다. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓ |
| **WCAG 1.4.4** Resize text | 글이 글자 크기 설정을 따르고 상자를 넘지 않습니다 ✓ — 웹은 상자도 배율대로(rem), 앱은 최소 높이가 글을 따라 늘어납니다. 줄보다 긴 칩은 줄 폭에서 말줄임(글 전체는 보조 기술이 읽습니다) |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에 바깥 링 2px · 띄움 2px |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 모든 크기 ✓(가장 작은 small 32 · 최소 폭 44). 입력값 칩의 지우기는 누르는 영역 24 × 24 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 누르는 영역을 가로 · 세로 44 까지 넓힙니다 ✓(보이는 칩 32 · 36 · 40, 아이콘만 있는 칩도) — 줄바꿈 묶음에서 small 만 위아래 줄의 영역이 4 겹칩니다. 입력값 칩의 지우기는 24 × 24 라 AAA 밖입니다 |
| **앱(Flutter) — 누르는 영역은 놓인 자리** | 앱은 부모 상자 밖으로 누르는 영역을 넓히지 못합니다 — 칩이 놓인 자리가 곧 누르는 영역입니다. 2.5.8(AA 24)은 늘 지키고, 44 는 줄 높이를 늘릴 수 있는 자리에서만 맞춥니다. 24 아래(글 버튼 20 · 22 같은 자리)는 두지 않습니다. 칩을 44 로 키우면 칩 높이 36 · 카드 머리 36 규칙과 부딪치기 때문입니다 |
| **ARIA** | 하나 고르기 `role="radiogroup"` + 라디오(묶음 이름은 Field 라벨 · `aria-label`), 여럿 고르기 체크박스, 제안 · 여는 칩 `<button>`(여는 칩 `aria-haspopup="dialog"`), 입력값 지우기 "{글} 지우기". `aria-pressed` 는 쓰지 않습니다. 아이콘만 있는 칩은 `aria-label` 필수 |

## Do / Don't

### ✅ Do

- 2 ~ 4개 짧은 폼 값은 칩으로 고르고, 고르기 묶음은 Field 로 감싸 이름을 답니다.
- 하나 고르기의 "전체" 는 맨 앞 선택지로 두고, 폼은 기본값을 골라 둡니다.
- 필터 바는 조건마다 칩 하나를 두고, 걸린 조건은 고른 모습 + 값 요약으로 보입니다.
- 고른 칩은 중립색으로 칠합니다.
- Solid 바탕은 투명한 `bg-neutral-weak-alpha` 로 둡니다 — 회색 바닥 위에서도 보입니다.

### ❌ Don't

- 고른 칩을 브랜드 색으로 칠하기.
- "전체 선택" 처럼 다른 칩을 바꾸는 칩.
- 누를 때마다 고름 → 빼고 → 해제를 도는 3상태 칩.
- 제안 칩을 고른 모습으로 남기기.
- 칩 모양 탭과 필터 칩을 한 화면에 같은 모양으로.
- 누를 수 없는 표시를 칩 모양으로(Badge).

## Specification

`chip.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Chip 을 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — chip.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#chip)
