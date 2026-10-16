# Chip

> 고르거나 넣은 값을 보이는 작은 알약. 2 ~ 4개 짧은 폼 값 고르기 · 누르면 값을 채워 주는 제안 · 목록 위 필터 바 · 넣은 값(지우기 버튼으로 뺀다)을 맡는다. 5개 이상은 [Select](select.md), 글이 긴 2 ~ 4개는 [Radio](radio-group.md) · [Checkbox](checkbox.md), 다른 구역으로 옮기는 탭 · 같은 내용을 바로 거르는 2 ~ 4개는 Tabs · Segmented Control(그 차례에), 누를 수 없는 표시는 [Badge](badge.md) · [Tag Group](tag-group.md) 이다.

구조는 당근 [SEED Chip](https://seed-design.io/components/chip)(Apache-2.0)을 따른다 — 알약(Container) · 글(Label) · 앞 아이콘 · 뒤 아이콘. 하나 고르기는 라디오(Chip.RadioItem), 여럿 고르기는 체크박스(Chip.Toggle), 제안 · 여는 칩은 버튼(Chip.Button)이다. 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-01 · 02 사용자 결정).

수치 원본은 [`chip.yaml`](chip.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 가계부 · 거래 추가 · 공지 작성 — 라이트 · 다크](../../site/components/specs/chip.tsx#hero)

### 직접 골라 보기

변형 · 크기 · 고르기 방식 · 아이콘 · 상태를 고르면 스펙대로 그린 칩 묶음과 그 코드가 바뀐다. 실제로 누를 수 있다.

[그림: 플레이그라운드](../../site/components/specs/chip.tsx#playground)

## Anatomy

[그림: 칩은 알약 · 앞 아이콘 · 글 · 뒤 아이콘으로, 입력값 칩은 뒤에 지우기 버튼을 둔다](../../site/components/specs/chip.tsx#anatomy)

| ⓐ Container | 알약 — 모서리 full. 글만큼 넓어지고 줄바꿈 · 말줄임하지 않는다. |
| ⓑ Prefix Icon | 앞 아이콘 — 묶음 안에서 모두 두거나 모두 뺀다. 없어도 된다. |
| ⓒ Label | 글 — 명사로 짧게, 한 줄. |
| ⓓ Suffix Icon | 뒤 아이콘 — 누르면 고르는 자리를 여는 칩의 아래 화살표(필터 바). |
| ⓔ Remove Button | 입력값 칩의 지우기 — 칩 안에서 따로 눌린다. |

[표: 부위](chip.yaml#slots)

## Properties

### Variant

세 가지다. 안 고른 Outline Strong 과 Outline Weak 는 똑같고, 고르면 갈린다.

| 변형 | 안 고름 | 고름 | 쓰는 자리 |
|---|---|---|---|
| `solid` | 옅은 회색 채움(`bg-neutral-weak`) | 짙은 채움(`bg-neutral-inverted` · `fg-neutral-inverted`) | 제안 · 필터 바 — 흰 표면(`bg-layer-default`) 위에서만 |
| `outlineStrong` | 투명 + 안쪽 1px `stroke-neutral-weak` | 짙은 채움(테두리 없음) | 하나 고르기를 분명하게 — 거래 종류처럼 고른 값이 곧 화면의 갈래일 때. 필터 바 맨 앞 지우기(↺, 고르지 않는 칩)도 이 모양 — Solid 조건 칩과 갈린다 |
| `outlineWeak` *(기본)* | 투명 + 안쪽 1px `stroke-neutral-weak` | 옅은 바탕 `bg-neutral-weak` + 짙은 1px `stroke-neutral-contrast`(글자 그대로) | 고르기의 기본 — 고른 칩이 여럿 보일 때(여럿 고르기 · 시트 안 고르기 · 입력값) |

고른 칩은 브랜드 색이 아니라 중립색으로 칠한다 — 고른 칩이 여럿 보여도 브랜드 버튼(주요 동작)과 다투지 않고, Desk · HR 이 같다. Solid 의 옅은 바탕(`bg-neutral-weak`)은 회색 바탕(`bg-layer-basement`)과 같은 색이라 거기서는 사라진다 — 회색 바탕 위 줄은 Outline 을 쓴다.

[그림: 변형 — Solid · Outline Strong · Outline Weak 의 안 고름 · 고름](../../site/components/specs/chip.tsx#variant)

[표: 변형 · 고름 · 크기 × 모양 — 바뀌는 값](chip.yaml#compound)

### Size

`small` 32 · `medium` 36 *(기본)* · `large` 40. 글은 세 크기 모두 14 · 500(`t4`)이고, 글과 가장자리 사이는 12 · 14 · 16, 앞 아이콘 14 · 16 · 16 과 글 사이 6, 칩 사이 8(`spacing-between-chips`)이다. 기본은 폰 폼에서도 36 이고, small 은 촘촘한 줄(1280 이상 데스크톱의 필터 · 표 위), large 는 화면의 주인공 고르기에만 쓴다. 누르는 영역은 Button 처럼 가로 · 세로 44 까지 넓힌다(보이는 칩은 그대로 — 글이 있는 칩은 최소 폭이 이미 44 이상이고, 아이콘만 있는 칩은 가로도 44).

[그림: 크기 — small 32 · medium 36 · large 40, 아이콘만 있는 칩](../../site/components/specs/chip.tsx#size)

[표: 크기](chip.yaml#size)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 변형 · 고름의 바탕 |
| `hovered` | 웹 — 누름과 같은 바탕(축소 없음) |
| `pressed` | 누름 바탕(`bg-neutral-weak-pressed` · `bg-layer-default-pressed` · `bg-neutral-inverted-pressed`) + 칩 전체 2px 거리 축소(v104) |
| `focused` | 키보드 포커스에만 바깥 링 2px · 띄움 2px `stroke-focus-ring` |
| `disabled` | 바탕 `bg-disabled` · 글자 `fg-disabled` — 흐리게 하지 않는다(v106). 고른 채 막히면 짙은 1px `stroke-neutral-solid` 를 남겨 무엇을 골랐는지 보인다 |

[그림: 상태 — 기본 · 호버 · 누름 · 포커스 · 비활성 × 안 고름 · 고름](../../site/components/specs/chip.tsx#states)

[표: 상태 — Outline Weak](chip.yaml#matrix@root+focusRing)

[표: 상태 — Outline Weak 고름](chip.yaml#matrix.selected.selected@root+focusRing)

[표: 상태 — Solid 고름](chip.yaml#matrix.variant.solid.selected.selected@root+focusRing)

[표: 상태 — Outline Strong 고름](chip.yaml#matrix.variant.outlineStrong.selected.selected@root+focusRing)

[표: 상태 — 입력값 칩의 지우기 · 묶음](chip.yaml#matrix@removeButton+group)

[표: 묶음](chip.yaml#base.enabled@group)

[표: 가로 스크롤 줄](chip.yaml#base.enabled@scrollRow)

[표: 모션](chip.yaml#motion)

### 쓰임 넷

| 쓰임 | 칩 | 의미 | 고름 |
|---|---|---|---|
| 고르기 — 하나 | `ChipRadio` 묶음 | 라디오(radiogroup) — 화살표로 옮기면 고른다 | 다시 눌러도 풀리지 않는다 |
| 고르기 — 여럿 | `ChipToggle` | 체크박스 | 다시 누르면 풀린다 |
| 제안 · 필터 바의 여는 칩 | `Chip` | 버튼 — 여는 칩은 `aria-haspopup="dialog"` | 제안은 고른 모습이 없다. 걸린 조건의 여는 칩은 고른 모습(짙은 채움) |
| 입력값 | `InputChip` | 글 + "{글} 지우기" 버튼 | Outline Weak 고른 모습 + 뒤 지우기 |

`aria-pressed` 는 쓰지 않는다(SEED) — 켜고 끄는 단추 하나는 [Toggle](toggle.md)(아이콘 단추 — 2026-10-09)이다.

[그림: 쓰임 — 고르기 · 제안 · 필터 바 · 입력값](../../site/components/specs/chip.tsx#uses)

## Guidelines

### 하나 고르기 — "전체" · "없음" 은 선택지로

하나 고르기 칩은 라디오다 — 고른 칩을 다시 눌러도 풀리지 않고, 늘 하나가 골라져 있다. 거르기의 "전체" 는 맨 앞 선택지로 둔다(글은 "전체" 하나 — "혜택 전체" 처럼 바꾸지 않는다). 칩으로 거르는 축은 태그처럼 개수가 바뀌거나 5개 이상인 축이다 — 개수가 정해진 2 ~ 4가지 보기(할 일 오늘 · 이번 주 · 전체 · 완료)는 Segmented Control(그 차례에)이다. 폼은 기본값을 골라 두거나, "없음" 이 답이면 "{칸 이름} 없음" 을 맨 앞에 둔다([Select](select.md) 와 같은 규칙).

[그림: 하나 고르기 — 맨 앞 "전체" · 세 번째 "전체"](../../site/components/specs/chip.tsx#single-guide)

### 여럿 고르기 — 다른 칩을 바꾸는 칩을 두지 않는다

여럿 고르기 칩은 체크박스다 — 다시 누르면 풀린다. "전체 선택" 처럼 다른 칩을 바꾸는 칩은 두지 않는다. 거르기에서 하나도 안 고르면 "조건 없음"(전부 보인다)이고, 폼에서 꼭 골라야 하면 Field 의 오류로 알린다. 몇 개까지 고를 수 있는지는 Field 설명에 적는다.

[그림: 여럿 고르기 — 다시 누르면 풀린다 · "전체 선택" 칩](../../site/components/specs/chip.tsx#multi-guide)

### 필터 바 — 조건마다 칩

목록 위 한 줄(가로 스크롤 · 끝 흐림)에 조건마다 칩을 하나씩 둔다. 칩은 뒤에 아래 화살표를 달고, 누르면 그 조건만 시트(1280 미만) · 팝오버(1280 이상)로 연다. 걸린 조건의 칩은 고른 모습(짙은 채움)에 값을 요약하고("식비 외 2개" — Select 의 여럿 고른 값과 같은 꼴), 하나라도 걸리면 맨 앞에 지우기 칩(↺, 아이콘만 — 이름 "필터 지우기")을 둔다. 걸린 조건 칩의 글이 곧 지금 조건이라 따로 "필터 2" 같은 개수를 두지 않는다.

[그림: 필터 바 — 조건마다 칩 · 칩을 누르면 그 조건만 연다](../../site/components/specs/chip.tsx#filter-bar)

### 빼기 — 칩은 두 상태만

칩은 고름 · 안 고름 둘뿐이다 — 누를 때마다 고름 → 빼고 → 해제를 도는 3상태 칩을 두지 않는다. 빼는 조건이 필요하면 조건마다 "고른 것만 · 고른 것 빼고" 를 먼저 고르고(하나 고르기 칩 둘), 아래에서 여럿 고른다 — 한 조건 안에서 넣기 · 빼기를 섞지 않는다.

[그림: 빼기 — "고른 것만 · 고른 것 빼고" 를 먼저 · 3상태 칩](../../site/components/specs/chip.tsx#exclude-guide)

### 제안 — 고른 표시가 없다

제안 칩(빠른 금액 · 빠른 기간 · 프리셋)은 누르면 칸에 값을 넣는 버튼이다 — 고른 모습이 없고, 지금 값은 칸이 보인다. 다시 누르면 같은 값을 다시 넣는다(고친 값을 덮어쓰지 않게, 프리셋처럼 여러 칸을 채우는 제안은 칸을 비웠을 때만 채우거나 덮어쓰기 전에 묻는다). 프리셋을 넣은 뒤 "적용됨" 은 칩이 아니라 칸 · 배지가 알린다.

[그림: 제안 — 칸이 값을 보인다 · 칸 값과 같은 칩이 골라져 보인다](../../site/components/specs/chip.tsx#suggestion-guide)

### Solid 는 흰 표면 위에서

Solid 의 옅은 바탕은 흰 표면 위에서만 보인다 — 회색 바탕(`bg-layer-basement`) 위에서는 바탕과 같은 색이라 칩이 사라진다. 회색 바탕 위 줄은 Outline Strong · Outline Weak 를 쓴다.

[그림: 표면 — 흰 표면 위 Solid · 회색 바탕 위 Solid](../../site/components/specs/chip.tsx#surface-guide)

### 글

- 명사로 짧게, 한 줄 — 칩은 줄바꿈 · 말줄임하지 않고 글만큼 넓어진다. 한 묶음의 글 길이 · 말투를 맞춘다.
- 여럿을 한 칩에 줄이면 "식비 외 2개"(첫 값 + 나머지 수 — "외" 는 앞의 값을 뺀 수). 개수만 쓰면 "3개 고름".
- 코드값(`Y` · `N` · `ADMIN`)을 글로 내지 않는다(Writing).

[그림: 글 — 명사로 짧게 · 문장 · 코드값](../../site/components/specs/chip.tsx#label-guide)

### 묶음 배치

칩 사이는 8(`spacing-between-chips`)이다. 폼 · 시트 안의 고르기 묶음은 줄바꿈하고(줄 사이 8), 목록 위 필터 바 · 제안 줄은 한 줄 가로 스크롤로 둔다 — 줄을 화면 끝까지 내고 안쪽 여백을 화면 여백(`spacing-global-gutter`)만큼 둬 스크롤해도 첫 칩이 여백에서 시작한다(이미 화면 여백 안에 두는 코드는 `bleed` 로 줄을 화면 끝까지 낸다). 줄의 양 끝은 [Scroll Fog](scroll-fog.md) 로 늘 흐린다 — 좌우 20, 스크롤 위치와 상관없이 켜져 있고, 안쪽 여백(화면 여백 24)이 흐림보다 넓어 처음 · 끝의 칩은 흐리지 않는다.

[그림: 묶음 — 폼 안 줄바꿈 · 목록 위 가로 스크롤](../../site/components/specs/chip.tsx#layout-guide)

### 탭 · Segmented 와 나누기

칩은 값을 고르거나 거르는 자리다. 다른 구역으로 옮기는 2차 탭은 Tabs 의 칩 모양(Chip Tabs), 같은 내용을 2 ~ 4가지로 바로 거르거나 다르게 보는 자리는 Segmented Control 이다(그 차례에). 한 화면에 칩 모양 탭과 필터 칩이 같이 있으면 탭을 Line 으로 둔다 — 같은 모양이 둘이면 무엇이 탭인지 알 수 없다.

| 이런 자리 | 컴포넌트 |
|---|---|
| 2 ~ 4개 짧은 폼 값 | **Chip**(하나 · 여럿) |
| 누르면 값을 채운다 | **Chip**(제안) |
| 목록 조건을 걸고 푼다 | **Chip**(필터 바) |
| 넣은 값을 보이고 하나씩 뺀다 | **Chip**(입력값) |
| 5개 이상 · 글이 긴 2 ~ 4개 | Select · Radio · Checkbox |
| 다른 구역으로 옮긴다(2차) | Tabs 의 Chip Tabs(그 차례에) |
| 같은 내용 2 ~ 4가지 보기 · 정렬 | Segmented Control(그 차례에) |
| 누를 수 없는 상태 · 분류 · 메타 | [Badge](badge.md) · [Tag Group](tag-group.md) |

## 코드

레시피 `recipes/shadcn/components/ui/chip.tsx` 를 쓴다. 고르기 묶음은 [Field](field.md) 안에 둔다(라벨이 묶음의 이름). 아래 미리보기는 스펙 값으로 그린 모습이다.

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
| 하나 고르기 Click · Tap | 그 칩을 고른다. 고른 칩을 다시 눌러도 그대로다. |
| 하나 고르기 `←` `→` `↑` `↓` | 묶음 안에서 옮기며 고른다(라디오). Tab 은 고른 칩 하나에만 선다. |
| 여럿 고르기 Click · `Space` | 고르거나 푼다. 칩마다 Tab 이 선다. |
| 제안 · 여는 칩 Click · `Enter` · `Space` | 값을 넣거나(제안) 그 조건의 시트 · 팝오버를 연다. |
| 입력값 지우기 | 그 값만 뺀다. 포커스는 다음 칩의 지우기(없으면 앞 칩의 지우기, 그것도 없으면 묶음 — 묶음도 키보드 링을 그린다)로 간다. 지우기에 키보드 포커스가 있으면 링은 칩 둘레에 그린다. |
| 마우스 호버 | 누름과 같은 바탕(축소 없음). |
| Disabled | 누를 수 없다 · 커서 not-allowed · Tab 이 서지 않는다. 고른 채 막히면 짙은 1px 테두리가 남는다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 안 고른 글 `fg-neutral` 흰 표면 위 16.41 · 13.42, Solid 바탕 위 15.20 · 10.32, 고른 짙은 채움 위 `fg-neutral-inverted` 16.41 · 13.42 ✓. 비활성 `fg-disabled` 는 기준 밖(비활성 UI) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 고름은 짙은 채움(바탕과 16.41 · 13.42) 또는 짙은 1px(16.41 · 13.42)로 안 고름과 가른다 ✓. 고른 채 막힘 `stroke-neutral-solid` 은 `bg-disabled` 위 3.87 · 3.18 ✓(비활성이라 기준 밖이지만 3:1 을 넘긴다). 안 고른 칩의 경계(Solid 바탕 1.08 · Outline 1px 1.23)는 칩을 알리는 유일한 표시가 아니다 — 글이 알린다(SEED 와 같다). 키보드 포커스 링 Desk 8.38 · 6.10 · HR 5.06 · 6.23 ✓ |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에 바깥 링 2px · 띄움 2px |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 모든 크기 ✓(가장 작은 small 32 · 최소 폭 44). 입력값 칩의 지우기는 누르는 영역 24 × 24 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 누르는 영역을 가로 · 세로 44 까지 넓힌다 ✓(보이는 칩 32 · 36 · 40, 아이콘만 있는 칩도) — 줄바꿈 묶음에서 small 만 위아래 줄의 영역이 4 겹친다. 입력값 칩의 지우기는 24 × 24 라 AAA 밖이다 |
| **ARIA** | 하나 고르기 `role="radiogroup"` + 라디오(묶음 이름은 Field 라벨 · `aria-label`), 여럿 고르기 체크박스, 제안 · 여는 칩 `<button>`(여는 칩 `aria-haspopup="dialog"`), 입력값 지우기 "{글} 지우기". `aria-pressed` 는 쓰지 않는다. 아이콘만 있는 칩은 `aria-label` 필수 |

## Do / Don't

### ✅ Do

- 2 ~ 4개 짧은 폼 값은 칩으로 — 고르기 묶음은 Field 로 감싸 이름을 단다.
- 하나 고르기의 "전체" 는 맨 앞 선택지로, 폼은 기본값을 골라 둔다.
- 필터 바는 조건마다 칩 하나, 걸린 조건은 고른 모습 + 값 요약.
- 고른 칩은 중립색으로.
- 회색 바탕 위 줄은 Outline 으로.

### ❌ Don't

- 고른 칩을 브랜드 색으로 칠하기.
- "전체 선택" 처럼 다른 칩을 바꾸는 칩.
- 누를 때마다 고름 → 빼고 → 해제를 도는 3상태 칩.
- 제안 칩을 고른 모습으로 남기기.
- 칩 모양 탭과 필터 칩을 한 화면에 같은 모양으로.
- 누를 수 없는 표시를 칩 모양으로(Badge).

## Specification

`chip.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Chip 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — chip.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#chip)

## SEED 와 다른 점

- **반투명 색을 불투명 짝으로**(v102) — Solid 바탕 `bg-neutral-weak`, Outline 테두리 `stroke-neutral-weak`, 누름 `bg-layer-default-pressed`. 그래서 Solid 는 흰 표면 위에서만 쓴다(SEED 의 반투명 바탕은 어느 표면에서나 조금 짙어진다).
- **Outline Strong 을 고르면 테두리를 지운다** — SEED 는 짙은 채움 위에 옅은 테두리가 남는다(SEED Chip Tabs 는 지운다).
- **비활성은 흐리게 하지 않는다**(v106) — SEED 는 불투명도 0.5. 고른 채 막힌 칩은 짙은 1px `stroke-neutral-solid` 로 고른 것을 남긴다(사용자 결정 2026-10-02).
- **웹의 호버**는 누름과 같은 바탕(v106 — SEED 도 마우스에서는 같다), **누르는 영역**은 가로 · 세로 44 까지 넓힌다(SEED 에 규정 없음 — Button 과 같다).
- **입력값 칩 · 지우기 버튼 · 필터 바의 걸린 조건 모습**을 정했다 — SEED 는 "Suffix 에 Remove 버튼", "Filter Bar 템플릿" 이라고만 하고 치수 · 모양이 없다.
- **아이콘은 lucide 선 아이콘**(v106) — 여는 칩 `chevron-down`, 지우기 `x`, 필터 지우기 `rotate-ccw`.

## Migration notes

### 2026-10-02 — 새로 둔다(SEED Chip)

사용자가 [비교 페이지](https://claude.ai/artifact/6JQw2JSSfVoasaa4ib518x)에서 여덟 가지를 모두 SEED 로 정했다 — 칩이 맡는 일 넷(고르기 · 제안 · 필터 바 · 입력값) · 32 · 36 · 40 기본 36 · 고른 색 중립 · 변형 셋 · 하나 고르기는 라디오("전체" 맨 앞) · 필터 바(조건마다 칩, 걸린 조건은 짙은 채움 + 값 요약, 맨 앞 지우기) · 3상태를 걷고 "고른 것만 · 고른 것 빼고" · 제안 칩은 고른 표시 없음. 고른 채 막힌 칩은 짙은 1px 를 남긴다. 옛 DESIGN.md 의 Tag / Chip(v73)을 대신한다.

제품은 앱 적용 단계에서 옮긴다(2026-10-01 조사 — 세 제품 코드를 읽고 Desk 웹 · HR 은 크로미움에 띄워 쟀다).

- **Desk 웹** — 공용 Chip 2곳 · 칩 모양 탭 12 · 폼 값 탭 트랙 15 · ToggleGroup 9 · 손으로 만든 칩 18종. 높이 11가지(28 ~ 46) · 모서리 4 · 8 · 16 · full · 글자 12 ~ 14, 고른 표시 8가지. 다크에서 브랜드 채움이 바탕과 1.73 ~ 1.96:1, ToggleGroup 고름 1.12:1. 폼 값 · 필터 27곳이 탭으로 읽힌다(화살표마다 언어가 바뀌고 이메일 주기가 저장된다). 친구 추가 칩이 토글로 읽히고, 지우기 × 이름이 모두 "초기화"(14 · 17). 가계부 "전체 · 지출 · 수입" 칩은 필터 대화상자를 걸면 효과가 없어지는데 고른 표시는 남는다.
- **Desk 앱** — PChip 10 · PTypeChip 2 · PToggle 3 · PCategoryTile 4 · 화면 전용 칩 13종 · PTabs 37. 높이 28 ~ 43.5 · 글자 13.5(토큰 밖) · 고른 표시 11가지. PChip 은 누르거나 포커스해도 표시가 없고, 켜지면 크기가 변하는 칩이 둘이다. 거래 종류 둘 다 끄면 엉뚱한 "수입" 칩이 뜬다(D1). 기관 칩 글자 70곳 중 12곳이 4.5:1 미만(최저 2.42). 요일 켬 · 끔 1.02:1. 3상태 필터의 "빼고" 4.00:1. 키보드로 못 닿는 칩 9종.
- **HR 웹** — 칩이 없다. 2 ~ 4개 폼 값 16칸이 모두 Select(→ Chip), 예 / 아니오 3칸(→ Checkbox), 칩처럼 생긴 Badge 49 + 알약 4 는 누를 수 없다. 업무 보고 필터 개수가 늘 2(초기화가 비활성이 안 됨), 캘린더 필터는 전체에서 하나를 누르면 그것만 남는다.
