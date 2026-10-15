# Slider

> 정해진 범위에서 값을 끌어 고르는 컨트롤 — 예산 알림 임계값처럼 정확한 숫자보다 범위 안의 자리가 중요한 값, 그리고 별점처럼 2 ~ 5단계 가운데 하나를 고른다. 정확한 숫자 · 금액은 [Input](input.md), 이름이 붙은 2 ~ 4개는 [Chip](chip.md), 5개 이상은 [Select](select.md) 다.

구조는 당근 [SEED Slider](https://seed-design.io/components/slider)(Apache-2.0)를 따른다 — 트랙(Track) · 채움(Active Track) · 손잡이(Handle) · 눈금(Tick Mark) · 표식(Marker) · 말풍선(Value Indicator). 모양은 SEED 의 무채색 그대로이고, 손잡이 줄 높이 · 머리 값 · 저장 시점 · 키보드는 porest 가 정했다(2026-10-09 사용자 결정). 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다. 옛 Slider 스펙(브랜드 채움 · 흰 손잡이 16 + 2px 브랜드 테두리 + 그림자 · 아래 meta 줄)을 대신한다.

수치 원본은 [`slider.yaml`](slider.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 설정 > 알림 > 예산 알림 임계값 — 데스크톱 · 폰, 라이트 · 다크](../../site/components/specs/slider.tsx#hero)

### 직접 골라 보기

값 하나 · 둘, 단계(5 단위 10 구간 · 별점 4 구간), 막힘을 고르면 스펙대로 그린 슬라이더와 그 코드가 바뀐다. 실제로 끌고, 손잡이에 초점을 두고 화살표 · Home · End · PageUp 을 눌러 볼 수 있다 — 손을 뗄 때 저장 요청이 한 번 나가는 것이 함께 보인다.

[그림: 플레이그라운드](../../site/components/specs/slider.tsx#playground)

## Anatomy

[그림: 슬라이더는 트랙 · 채움 · 손잡이 · 말풍선 · 표식으로 이뤄지고, 지금 값은 Field 머리 오른쪽에 있다](../../site/components/specs/slider.tsx#anatomy)

| ⓐ Track | 트랙 — 4, 고를 수 있는 범위. 손잡이 줄(44) 가운데에 놓인다. |
| ⓑ Fill | 채움 — 최솟값에서 손잡이까지(범위는 두 손잡이 사이). |
| ⓒ Thumb | 손잡이 — 원 20, 누르는 동안 24. |
| ⓓ Value Indicator | 말풍선 — 손잡이 위 지금 값. 끄는 동안 · 마우스를 올렸을 때 · 키보드 포커스일 때만. |
| ⓔ Tick | 눈금 — 구간이 2 ~ 5개일 때만, 트랙을 끊는 틈. |
| ⓕ Markers | 표식 — 아래 양 끝 값(2 ~ 5 구간이면 단계마다). |
| ⓖ Header Value | 머리 값 — [Field](field.md) 머리 오른쪽의 지금 값. 늘 보인다. |

[표: 부위](slider.yaml#slots)

## Properties

### Mode

값 하나(`single` — 기본)는 최솟값에서 손잡이까지, 값 둘(`range`)은 두 손잡이 사이를 채운다. 두 손잡이는 서로를 넘지 않는다. 범위는 손잡이마다 이름이 다르다 — "{라벨} 최소" · "{라벨} 최대"(SEED — "각 thumb이 범위에서 어떤 역할을 하는지(최소-최대, 시작-종료 등)" 설명해야 한다, Apache-2.0). 지금 제품에 범위 슬라이더는 없다.

[그림: 값 하나 · 값 둘(두 손잡이 사이를 채운다)](../../site/components/specs/slider.tsx#mode)

[표: 값 하나 · 둘](slider.yaml#mode)

### 모양

SEED 의 무채색 그대로다 — 트랙 4 `stroke-neutral-weak`(SEED gray-400 과 같은 단계), 채움 `fg-neutral`, 손잡이 20 `bg-neutral-inverted`, 테두리 · 그림자 없음. 누르거나 끄는 동안 손잡이가 24 로 커진다. 라이트 · 다크 모두 채움과 손잡이가 같은 색이라 손잡이는 크기(20 · 4)로 갈린다. 체크박스 · 라디오 · 스위치의 켬과 같은 짙은 회색이고, 브랜드 색으로 칠하지 않는다(사용자 결정 — 브랜드 채움은 고르지 않았다).

손잡이 줄(`control`)은 높이 44 이고 줄 전체가 누르는 자리다 — 손잡이 위아래 12 · 트랙 위아래 20 을 눌러도 잡힌다(기초 Inclusive Design — 누르는 영역 44. SEED 는 26). 손잡이는 트랙 양 끝에서 반지름(10)만큼 들어온 자리까지만 간다.

[그림: 트랙 4 · 채움 · 손잡이 20 · 누르는 동안 24 · 손잡이 줄 44 — 라이트 · 다크](../../site/components/specs/slider.tsx#look)

[표: 손잡이 줄](slider.yaml#base.enabled@control)

[표: 트랙](slider.yaml#base.enabled@track)

[표: 채움](slider.yaml#base.enabled@fill)

[표: 손잡이](slider.yaml#base.enabled@thumb)

### 값 보이기

값은 세 자리에 보인다(사용자 결정 2C).

- **머리 값** — [Field](field.md) 머리 오른쪽에 지금 값을 단위와 함께 늘 둔다("80%" — 16 / 22 · 700 · 고정폭 숫자). 손을 떼도 남는다.
- **말풍선** — 끄는 동안 · 마우스를 손잡이에 올렸을 때 · 키보드 포커스일 때 손잡이 위 12 에 뜬다(SEED — 13 / 18 · 500, 바탕 `bg-neutral-inverted`, 위아래 4 · 좌우 8 · 모서리 6, 아래 8 × 6 화살표). 트랙 끝에서는 상자만 안으로 밀리고 화살표는 손잡이를 가리킨다. 트랙을 눌러 건너뛰기만 하면 뜨지 않는다.
- **표식** — 아래 2 에 양 끝 값(13 / 18 · `fg-neutral-muted`). 단계마다 숫자를 늘어놓지 않는다 — 구간이 2 ~ 5개일 때만 단계마다 둔다(아래 단계 · 눈금).

머리 값 · 말풍선 · 표식은 같은 글(`formatValue` — "80%")이고 보조 기술에는 숨긴다 — 값은 손잡이의 `aria-valuetext` 가 한 번 읽는다(SEED — "스크린 리더는 marker를 읽지 않습니다").

[그림: 머리 값 80% · 끄는 동안 말풍선 · 끝에서 안으로 밀린 말풍선 · 양 끝 표식](../../site/components/specs/slider.tsx#value)

[표: 말풍선](slider.yaml#base.enabled@valueIndicator)

[표: 표식](slider.yaml#base.enabled@markers)

[표: 머리 값](slider.yaml#base.enabled@headerValue)

### 단계 · 눈금

구간(단계 사이)이 2 ~ 5개면 단계 자리마다 트랙 · 채움을 끊는 굵은 틈(4)을 두고 표식도 단계마다 둔다(`discrete` — 별점 1 ~ 5 는 구간 4 · 틈 3 · 표식 5). 손잡이는 단계 자리에만 선다. 구간이 6개 이상이면(예산 알림 임계값 50 ~ 100 · 5 단위는 10 구간) 눈금 없이 양 끝 표식만 둔다(`none`) — 단계는 끄는 동안 말풍선으로 안다(SEED — "Tick Mark는 총 2~5개의 스텝을 표현할 수 있습니다"). 레시피가 `min` · `max` · `step` 으로 스스로 가른다.

[그림: 10 구간 — 눈금 없이 양 끝 표식 · 별점 4 구간 — 굵은 틈 3 · 표식 5](../../site/components/specs/slider.tsx#ticks)

[표: 눈금](slider.yaml#ticks)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 손잡이 20 · 말풍선 없음 |
| `hovered` | 웹 — 손잡이에 마우스를 올리면 말풍선. 손잡이의 색 · 크기는 그대로 |
| `focused` | 키보드 포커스 — 손잡이 둘레 링 2px · 띄움 2px + 말풍선 |
| `pressed` | 끄는 동안 — 손잡이 24 + 말풍선. 손잡이 밖을 짧게 누르면(150ms · 3px 안) 건너뛰기만 하고 말풍선은 뜨지 않는다(SEED dragStartDelay) |
| `disabled` | 트랙 `bg-disabled` · 채움 · 손잡이 · 표식 · 머리 값 `fg-disabled` — 흐리게 하지 않는다(v106). Tab 순서에서 빠진다 |

오류(`invalid`)는 슬라이더 모양을 바꾸지 않는다 — Field 꼬리의 오류 글이 알린다(SEED 와 같다).

[그림: 상태 — 기본 · 호버 · 포커스 · 누름 · 막힘](../../site/components/specs/slider.tsx#states)

[표: 상태 — 손잡이 · 말풍선](slider.yaml#matrix@thumb+valueIndicator+focusRing)

[표: 상태 — 트랙 · 채움 · 표식 · 머리 값](slider.yaml#matrix@control+track+fill+markers+headerValue)

[표: 공통 — 저장 시점](slider.yaml#base.enabled@root)

[표: 모션](slider.yaml#motion)

## Guidelines

### 손을 뗄 때 한 번 저장한다

누르는 순간 적용되는 슬라이더(설정)는 끄는 동안 화면만 따라가고 손을 뗄 때 한 번 저장한다 — SEED `onValuesCommit`("사용자가 슬라이더 조작을 마치고 손을 뗄 때 값을 확정", Apache-2.0) · 앱 `onChangeEnd`. 키보드는 키마다 한 번이다. 요청하는 동안에도 슬라이더를 막지 않는다 — 막으면 손잡이가 Tab 순서에서 빠져 키보드 초점이 본문으로 떨어진다. 한 요청이 화면의 다른 컨트롤(스위치)도 막지 않는다. 실패하면 값을 되돌리고 그 자리(Field 꼬리)에 알린다 — 페이지 맨 아래가 아니다. 요청이 겹치면 마지막 요청의 결과만 반영한다(앞 요청의 늦은 응답으로 되돌리지 않는다). 단계마다 저장 · 멈추고 400ms 뒤 저장 · 저장 버튼은 쓰지 않는다(사용자 결정 4B).

폼 안의 슬라이더(별점)는 폼의 값이다 — 손을 떼도 보내지 않고 저장 버튼이 반영한다.

[그림: 80 → 50 끌기 — 손을 뗄 때 요청 한 번 · 단계마다 여섯 번 + 막혀 초점이 빠짐](../../site/components/specs/slider.tsx#commit-guide)

### 언제 쓰나

| 이런 값 | 쓰는 것 |
|---|---|
| 범위 안의 자리가 중요한 값(임계값 · 비율) · 2 ~ 5단계 가운데 하나(별점) | **Slider** |
| 정확한 숫자 · 금액(더치페이 비율 · 할부 개월 · 금액 범위 필터) | [Input](input.md) — 숫자 키보드 · 뒤 단위 글자 |
| 한 단계씩 세는 작은 정수(승인 필요 횟수 0 ~ 3 · 부여 시간 0 ~ 7시간) | [Quantity Picker](quantity-picker.md) |
| 이름이 붙은 2 ~ 4개 | [Chip](chip.md) 하나 고르기 — 같은 내용을 바로 다르게 보면 [Segmented Control](segmented-control.md) |
| 이름이 붙은 5개 이상 | [Select](select.md) |

옛 스펙의 Don't "옵션이 3개 이하면 Slider 를 쓰지 않는다" 는 걷었다 — SEED 는 별점(1 ~ 5) · 수량(10 · 20 · 30) · 할인율(5% 단위)처럼 2 ~ 5단계 고르기도 Slider 로 한다(사용자 결정 3B). 단계가 자리를 뜻하지 않고 하나씩 세는 수(횟수 · 시간 · 개수)면 [Quantity Picker](quantity-picker.md) 다 — 지금 값이 버튼 사이에 늘 보이고 한 번에 하나씩 오르내린다.

[그림: 별점은 Slider · 금액은 Input](../../site/components/specs/slider.tsx#when-guide)

### 값은 단위와 함께 읽힌다

`aria-valuetext` 에 단위를 붙인다("80%" · "4점") — 숫자만 읽으면 무엇의 80 인지 모른다. 이름은 칸 이름(Field 라벨)이고, 이름 자리에 값을 넣지 않는다. 범위는 손잡이마다 "{라벨} 최소" · "{라벨} 최대" 다.

[그림: 읽기 — "예산 알림 임계값, 80%, 슬라이더" · 지금 앱의 "80%, 60%"](../../site/components/specs/slider.tsx#name-guide)

### 글

칸 이름은 무엇을 정하는지 명사로("예산 알림 임계값"), 설명은 값이 하는 일을 한 문장으로("예산 사용률이 이 값을 넘으면 알려줘요."). 머리 값 · 말풍선 · 표식은 같은 글이다 — 단위를 붙이고 마침표는 찍지 않는다. 저장 실패는 무엇이 안 됐는지와 할 일을 쓴다("저장하지 못했어요. 값을 되돌렸어요 — 다시 해주세요.").

## 코드

레시피 `recipes/shadcn/components/ui/slider.tsx` 를 [Field](field.md) 안에 둔다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `Slider` — 값 하나. `min` · `max` · `step`(기본 1) · `value` · `defaultValue`(수) · `onValueChange(value)`(움직일 때마다 — 화면만) · `onValueCommit(value)`(손을 뗄 때 · 키마다 한 번 — 바로 적용하는 저장은 여기서) · `formatValue(value)`(단위를 붙인 글 — `aria-valuetext` · 말풍선 · 표식, 기본은 숫자 그대로) · `disabled` · `name` · `dir`. 구간이 2 ~ 5개면 눈금 · 단계 표식을 스스로 그린다. Field 안이면 Field 의 라벨이 이름, 설명 · 오류가 설명이 되고(`aria-labelledby` · `aria-describedby` — Field 의 `useFieldGroup`), Field 의 `disabled` · `invalid` 를 받는다. 요청 중이라고 스스로 막지 않는다.
- `RangeSlider` — 값 둘. `value` · `defaultValue` 가 `[최소, 최대]` 이고 `onValueChange` · `onValueCommit` 도 두 값을 넘긴다. `thumbLabels`(기본 `["최소", "최대"]` — 손잡이 이름은 "{라벨} {thumbLabels}")를 더 받는다. 나머지는 `Slider` 와 같다.
- `SliderValue` — 머리 값. Field 의 `headerAction` 자리에 둔다 — 16 / 22 · 700 · 고정폭 숫자, 보조 기술에는 숨긴다(`aria-hidden`). `disabled` 를 주면 막힘 색(기본은 Field 의 막힘을 따른다 — headerAction 자리에서는 슬라이더 자신의 막힘을 볼 수 없다).

### 설정 — 예산 알림 임계값

[그림: 예산 알림 임계값 — 머리 값 · 끄는 동안 말풍선 · 저장 실패 오류](../../site/components/specs/slider.tsx#ex-basic)

```tsx
import { useState } from "react"
import { Field } from "@/components/ui/field"
import { Slider, SliderValue } from "@/components/ui/slider"

const [threshold, setThreshold] = useState(80) // 화면 값 — 끄는 동안 바로 따라간다
const [saved, setSaved] = useState(80) // 마지막으로 저장된 값
const [failed, setFailed] = useState(false)

// 손을 뗄 때 한 번 — 요청 중에도 막지 않는다. 실패하면 되돌리고 그 자리에 오류
const commit = (value: number) => {
  setFailed(false)
  updatePreferences({ budgetAlertThreshold: value }).then(
    () => setSaved(value),
    () => {
      setThreshold(saved)
      setFailed(true)
    },
  )
}

<Field
  label="예산 알림 임계값"
  headerAction={<SliderValue>{threshold}%</SliderValue>}
  description="예산 사용률이 이 값을 넘으면 알려줘요."
  invalid={failed}
  errorMessage="저장하지 못했어요. 값을 되돌렸어요 — 다시 해주세요."
>
  <Slider min={50} max={100} step={5} value={threshold} onValueChange={setThreshold} onValueCommit={commit} formatValue={(v) => `${v}%`} />
</Field>
```

### 2 ~ 5단계 — 별점

[그림: 만족도 1 ~ 5점 — 굵은 틈 3 · 표식 5](../../site/components/specs/slider.tsx#ex-steps)

```tsx
import { Field } from "@/components/ui/field"
import { Slider, SliderValue } from "@/components/ui/slider"

<Field label="만족도" headerAction={<SliderValue>{score}점</SliderValue>}>
  {/* 폼의 값 — 손을 떼도 보내지 않는다(onValueCommit 없음). 폼의 저장 버튼이 반영한다 */}
  <Slider min={1} max={5} value={score} onValueChange={setScore} formatValue={(v) => `${v}점`} />
</Field>
```

### 범위

[그림: 예산 사용률 30% ~ 70% — 두 손잡이 사이를 채운다](../../site/components/specs/slider.tsx#ex-range)

```tsx
import { Field } from "@/components/ui/field"
import { RangeSlider, SliderValue } from "@/components/ui/slider"

<Field label="예산 사용률" headerAction={<SliderValue>{usage[0]}% ~ {usage[1]}%</SliderValue>}>
  {/* 손잡이 이름 — "예산 사용률 최소" · "예산 사용률 최대" */}
  <RangeSlider min={0} max={100} step={10} value={usage} onValueChange={setUsage} formatValue={(v) => `${v}%`} />
</Field>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 손잡이 끌기 | 값이 손가락을 따라 바뀌고(단계에 맞춘다) 손잡이 24 · 말풍선. 놓으면 한 번 `onValueCommit` |
| 트랙 누르기 | 가장 가까운 손잡이가 그 자리(가장 가까운 단계)로 150ms 에 건너뛴다. 놓으면 한 번 `onValueCommit`. 누르기만 하면 말풍선은 뜨지 않는다 |
| 마우스를 손잡이에 올리기 | 말풍선 |
| `←` `↓` · `→` `↑` | 한 단계 줄이기 · 늘리기 — 키마다 한 번 `onValueCommit`. RTL 은 `←` `→` 가 반대이고 `↑` 는 늘 늘린다 |
| `Shift` + 화살표 · `PageDown` · `PageUp` | 10단계 줄이기 · 늘리기 — 끝에서 멈춘다 |
| `Home` · `End` | 포커스한 손잡이를 최솟값 · 최댓값으로 — 범위면 다른 손잡이 값까지 |
| `Tab` | 손잡이마다 한 번(범위는 둘) |
| 요청 중 | 막지 않는다 — 계속 끌고 키를 누를 수 있다. 마지막 요청의 결과만 반영한다 |
| 저장 실패 | 값을 되돌리고 Field 꼬리에 오류 글 — 화면 읽기 프로그램에 한 번 알린다 |
| Disabled | 끌기 · 누르기 · 키보드 불가, Tab 순서에서 빠진다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 머리 값 `fg-neutral` 흰 표면 16.41 · 다크 13.42, 표식 `fg-neutral-muted` 7.11 · 7.70(시트 6.67), 말풍선 글 `fg-neutral-inverted` 16.41 · 13.42 ✓. 막힘 `fg-disabled` 는 기준 밖(비활성 UI) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 손잡이 `bg-neutral-inverted` 표면 위 16.41 · 다크 13.42(시트 11.62), 채움 `fg-neutral` 트랙 위 13.38 · 다크 8.62 ✓. 트랙 `stroke-neutral-weak`(표면 위 1.23 · 다크 1.56)는 범위의 바탕이다 — 값은 채움 · 손잡이 · 머리 값이 알린다(SEED 트랙도 1.35). 키보드 포커스 링 Desk 8.38 · 6.10 · HR 5.06 · 6.23 ✓ |
| **WCAG 1.4.1** Use of color | 값은 손잡이의 자리와 머리 값 글로도 보인다 ✓ |
| **WCAG 2.1.1** Keyboard | 화살표 · `Shift` + 화살표 · `PageUp` · `PageDown` · `Home` · `End` ✓ |
| **WCAG 2.5.7** Dragging movements | 끌지 않고 트랙을 한 번 눌러 고를 수 있다 · 키보드로도 ✓ |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에 손잡이 둘레 링 2px · 띄움 2px + 말풍선 ✓ |
| **WCAG 4.1.3** Status messages | 저장 실패를 Field 의 알림 자리(polite)가 한 번 읽는다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 손잡이 줄 44 × 폭 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 손잡이 줄 44 ✓ — 손잡이 20 위아래 12 가 함께 눌린다(SEED 26 은 ✗) |
| **ARIA** | 손잡이 `role="slider"` · `aria-valuemin` · `aria-valuemax` · `aria-valuenow` · `aria-valuetext`(단위 — "80%"). 이름은 Field 라벨(`aria-labelledby`) — 범위면 손잡이마다 "{라벨} 최소" · "{라벨} 최대". 설명 · 오류는 `aria-describedby`. 머리 값 · 말풍선 · 표식은 `aria-hidden`. 앱은 `Slider.label` 에 값을 넣지 않고 `semanticFormatterCallback` 으로 단위 글을 준다 |
| **Reduced motion** | 건너뛰기는 바로 옮기고, 말풍선은 확대 · 이동 없이 투명도만 바뀐다(v104 — 큰 움직임만 뺀다) — 끌기 따라가기는 모션이 아니라 그대로 |

## Do / Don't

### ✅ Do

- 범위 안의 자리가 중요한 값과 2 ~ 5단계 고르기에 쓴다.
- 지금 값을 머리에 늘 두고, 끄는 동안 말풍선을 띄운다.
- 바로 적용되는 슬라이더는 손을 뗄 때 한 번 저장하고, 요청 중에도 막지 않는다.
- 실패하면 값을 되돌리고 그 자리에서 알린다.
- `aria-valuetext` 에 단위를 붙이고, 이름은 칸 이름으로. 범위는 손잡이마다 이름을 단다.

### ❌ Don't

- 정확한 숫자 · 금액을 슬라이더로 받기 — Input.
- 브랜드 색 채움 · 흰 손잡이 + 테두리 + 그림자.
- 끄는 동안 단계마다 저장하기 · 요청 중에 슬라이더(와 다른 컨트롤)를 막기 · 저장 실패를 페이지 맨 아래에 알리기.
- 아래에 숫자를 단계마다 늘어놓기 · 6 구간 이상에 눈금 점.
- 불투명도로 흐린 막힘.
- 이름 자리에 값을 넣기("80%, 60%").

## Specification

`slider.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Slider 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — slider.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#slider)

## SEED 와 다른 점

- **손잡이 줄 44** — SEED 26(표식이 있으면 46)은 기초 Inclusive Design 의 44 에 못 미친다. 줄 전체가 누르는 자리다.
- **역할 색 이름** — 트랙은 SEED palette.gray-400 과 같은 단계의 역할 `stroke-neutral-weak`(흰 표면 1.23, SEED 1.35), 손잡이 · 말풍선은 SEED bg.neutral-solid(2026-10-01 전 이름 bg.neutral-inverted)의 짝 `bg-neutral-inverted` 다. 라이트에서 채움과 손잡이가 같은 색이다(SEED 는 #1a1c20 · #2a3038, 1.28:1).
- **머리 값** — SEED 는 가만히 있을 때 값을 보이지 않는다(말풍선 · 표식은 SEED 그대로).
- **키보드는 APG** — SEED 는 `Home` 이 첫 손잡이 · `End` 가 끝 손잡이를 움직이고(포커스와 무관 — Radix 원본과 같다), RTL 에서 `↑` 가 줄인다(Radix 와도 다르다). porest 는 포커스한 손잡이를 움직이고 `↑` 는 늘 늘린다.
- **저장 시점 · 요청 중 막지 않기 · 실패 처리** — SEED 는 `onValuesCommit` 만 두고 규칙은 없다.
- **눈금은 구간 수로 레시피가 가른다** — SEED 는 쓰는 쪽이 `ticks` 를 넘긴다(문서는 "2~5개의 스텝", 예제는 9개도 있다). 가는 눈금(thin 1)은 두지 않는다 — 구간이 6개 이상이면 눈금 없이 양 끝 표식이다.

## Migration notes

### 2026-10-09 — SEED Slider 로 다시 쓴다

사용자가 [입력 비교 페이지](https://claude.ai/artifact/CwVJDATSmLtwQoH67wh1zj)에서 정했다 — 모양은 SEED 무채색(1B — 트랙 gray-400 · 채움 `fg-neutral` · 손잡이 20 · 누르면 24 · 테두리 · 그림자 없음 · 다크는 채움 = 손잡이 · 손잡이 줄 44), 값은 머리 값 + 끄는 동안 · 호버 · 키보드 포커스 때 말풍선 + 아래 양 끝 표식(2C), 눈금은 2 ~ 5 구간만 굵은 틈이고 2 ~ 5단계도 Slider(3B), 저장은 손을 뗄 때 한 번 · 요청 중에도 막지 않고 · 실패하면 되돌리고 그 자리에서(4B). 그리고 "따라오는 것" — 이름은 칸 라벨 · `aria-valuetext` 단위 · APG 키보드 · 막힘 전용 색 · 쓰지 않는 앱 `PRangeSlider` 걷음. 지금 porest 모양(1A) · SEED 모양 + 브랜드 채움(1C) · 숫자 여섯(2A) · 가만히 있을 때 값 없음(2B) · 점 눈금 11 + 숫자 6(3A) · 단계마다 저장 + 막힘(4A) · 400ms 지연(4C) · 저장 버튼(4D)은 고르지 않았다. 옛 스펙은 `slider.history/v-pre-seed-input.*` 에 남겼다.

| 옛 Slider | 새 Slider |
|---|---|
| 트랙 4 `surface-input`(흰 위 1.08) · 채움 `primary`(다크 #1049A4 — 트랙과 1.33) | 트랙 4 `stroke-neutral-weak`(1.23 · 1.56) · 채움 `fg-neutral`(트랙 위 13.38 · 8.62) |
| 손잡이 16 흰 + 2px `primary` + `shadow-sm` | 20 `bg-neutral-inverted` · 테두리 · 그림자 없음 · 누르면 24 |
| 누르는 자리 — 위아래 8 을 더한 32 | 손잡이 줄 44 |
| 아래 meta 줄(캡션 12 · "현재 값: 65%") | Field 머리 값 + 말풍선 + 양 끝 표식(13) |
| 눈금 없음 · Don't "옵션 3개 이하" | 2 ~ 5 구간만 굵은 틈 · 2 ~ 5단계도 Slider |
| 막힘 불투명도 0.5 | 전용 색 — 트랙 `bg-disabled` · 채움 · 손잡이 `fg-disabled` |
| `PageUp` 10 step(DESIGN v69 는 ±10%) | 10단계 · `Shift` + 화살표 10단계 · `Home` · `End` 는 포커스한 손잡이 |

제품은 앱 적용 단계에서 옮긴다(2026-10-09 조사 — Desk 웹은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트로 쟀다). 슬라이더는 두 곳 — 설정 > 알림 > 예산 알림 임계값(50 ~ 100 · 5 단위) 웹 · 앱 하나씩이다. HR · SSO 에는 없다.

- **요청 중 막힘 · 초점 잃음** — 웹이 `onValueChange` 마다 PATCH 하고 같은 슬라이더를 `updateMut.isPending` 으로 막는다(`widgets/notification-manage/ui/NotificationsManager.tsx:347 · 518-528`) — 키보드 → 한 번에 손잡이가 Tab 순서에서 빠져 초점이 `<body>` 로 가고 두 번째 → 가 먹지 않는다. 300ms 응답이면 80 → 50 끌기에 75 · 70 · 60 · 55 네 번 나가고 50 에 놓아도 55 로 남는다(D1). 낙관적 갱신은 없다(`useUserPreferences.ts:17-26`). 스위치 하나를 켜도 스위치 11 + 슬라이더가 모두 막힌다(D9). `onValueCommit` 으로 · 막지 않기로.
- **단계마다 저장** — 웹 · 앱 모두 80 → 50 에 요청 6번(앱 `features/notification/presentation/notification_settings_screen.dart:221-224 · 566-575` — `onChangeEnd` 0, D2).
- **읽기** — 웹은 이름 · `aria-valuetext` 가 없어 "slider 80" 만 읽는다(`shared/ui/slider.tsx:67` — 부품에 이름을 넘길 길이 없다, D4). 앱은 `semanticLabel` 을 `Slider.label` 로 넘겨 "80%, 60%" 로 읽고, 올리면 "70%"(실제 85)다(`shared/widgets/p_slider.dart:43-50`, D3).
- **모양** — 다크 채움 #1049A4 ↔ 트랙 1.33, 손잡이 16, 웹 누르는 루트 높이 4(손잡이 밖은 트랙 위아래 2px 만), 다크 손잡이 테두리 웹 #7AA9F6 · 앱 #1049A4(D19). 웹 눈금 점 2px 11개가 손잡이 끝 자리와 6px 어긋나고, 숫자는 6개, 막힘은 불투명도다(`shared/ui/slider.tsx:41-67`, D23).
- **저장 실패 자리** — 웹은 페이지 맨 아래 빨간 글(`NotificationsManager.tsx:775-784`). 앱은 알림 설정을 못 불러오면 예외 글을 그대로 보인다(`notification_settings_screen.dart:52-58`, D20) — Result Section 으로.
- **쓰지 않는 것** — 앱 `PRangeSlider`(`p_slider.dart:117-157`)는 쓰는 곳이 0 이다(D28) — 걷는다.

### 이전 기록

- **2026-05 — preview 에 맞춤.** shadcn `slider.tsx` 를 preview `.sld-*` 에 맞췄다 — 손잡이를 다크에서도 흰색(`text-on-accent`)으로 고정 · 16 · 트랙 4 · `transition-[box-shadow,border-color]`. 이번에 모두 바뀌었다.
