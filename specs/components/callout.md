# Callout

> 화면 안, 그 기능 · 내용 가까이에 늘 보이는 안내 상자입니다 — 팁 · 제약 · 주의, 그리고 그 자리에서 난 오류(저장 실패)를 알립니다. 페이지 전체의 상태는 [Page Banner](page-banner.md), 잠깐 알릴 결과는 [Snackbar](snackbar.md), 눌러서 여는 도움말은 [Help Bubble](help-bubble.md) 입니다.

옅은 톤 바탕 위에 아이콘 · 제목 · 본문 · 링크가 한 문단으로 놓이고, 상호작용은 셋(보이기 · 전체 누르기 · 닫기)입니다. "Alert" 라는 이름은 모달([Alert Dialog](alert-dialog.md))에만 씁니다.

수치 원본은 [`callout.yaml`](callout.yaml)입니다.

[그림: 가져오기 안내 · 분할 합계 주의 · 저장 실패 — 라이트 · 다크](../../site/components/specs/callout.tsx#hero)

### 직접 골라 보기

톤 · 상호작용 · 제목 · 링크를 고르면 스펙대로 그린 상자와 그 코드가 바뀝니다. 실제로 누르고 닫을 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/callout.tsx#playground)

## Anatomy

[그림: 상자는 아이콘 · 제목 · 본문 · 링크, 뒤 화살표나 닫기](../../site/components/specs/callout.tsx#anatomy)

| ⓐ Container | 상자 — 콘텐츠 폭 전체, 옅은 톤 바탕 · 모서리 10 입니다. |
| ⓑ Icon | 앞 아이콘 — 톤 색, 16 입니다. |
| ⓒ Title | 제목 — 성격을 나타내는 짧은 말(안내 · 주의 · 새 기능)입니다. 없어도 됩니다. |
| ⓓ Description | 본문 — 제목 뒤에 한 문단으로 이어집니다. |
| ⓔ Link | 링크 — 보조 내용으로 갈 때만 둡니다. |
| ⓕ Chevron · Close | 상자 전체를 누르면 뒤 화살표, 닫을 수 있으면 닫기를 둡니다. |

[표: 부위](callout.yaml#slots)

## Properties

### 상자

안쪽 14 · 최소 50 · 모서리 10 · 아이콘 16 · 사이 12 입니다. 제목 · 본문 · 링크는 모두 14 / 19 이고 한 문단으로 흐릅니다 — 제목은 700, 사이는 띄어쓰기 두 칸, 링크는 밑줄입니다. 여러 줄이면 아이콘 · 화살표 · 닫기는 상자 가운데에 섭니다.

[그림: 상자의 여백 · 한 문단](../../site/components/specs/callout.tsx#layout)

[표: 공통](callout.yaml#base.enabled)

### Tone

톤은 다섯 가지입니다 — `neutral`(일반) · `informative`(정보 · 가이드 · 팁) · `positive`(성공 · 혜택) · `warning`(주의 · 미리 알릴 문제) · `critical`(오류 · 바로 조치할 일). 바탕은 옅은 톤(`bg-*-weak`), 글 · 아이콘 · 링크 · 화살표 · 닫기는 모두 같은 `fg-*-contrast` 색입니다.

[그림: 톤 다섯 — 라이트 · 다크](../../site/components/specs/callout.tsx#tones)

[표: 톤](callout.yaml#tone)

### Interaction

`display`(보이기만 — 링크를 둘 수 있습니다) · `actionable`(상자 전체가 버튼 — 뒤 화살표, 링크는 두지 않습니다) · `dismissible`(닫기 버튼 — 한 번 보면 되는 안내에만) 세 가지입니다.

[그림: 보이기 · 전체 누르기 · 닫기](../../site/components/specs/callout.tsx#interactions)

[표: 상호작용](callout.yaml#interaction)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 옅은 톤 바탕 |
| `hovered` | 웹 — Actionable 은 톤의 누름 바탕, 닫기 버튼도 |
| `pressed` | Actionable 은 누름 바탕 + 상자 전체 2px 거리 축소, 닫기는 축소 |
| `focused` | 웹 — 키보드 포커스에만 링(상자 · 링크 · 닫기 둘레) |

[표: 상태](callout.yaml#matrix)

[표: 모션](callout.yaml#motion)

## Guidelines

### 어디에 두나

| 이런 안내 | 쓰는 것 |
|---|---|
| 그 기능 · 내용 가까이의 팁 · 제약 · 주의 | **Callout** — 본문 안, 그 내용 바로 위 |
| 그 자리에서 난 오류(저장 · 제출 실패) | **Callout** `critical` — 폼 맨 위, 폼은 연 채로 |
| 시트 · 대화상자가 열린 채 봐야 할 결과(저장 실패 · 계산 결과) | **Callout** — 그 안 폼 맨 위. 창을 닫으며 끝나는 일은 닫힌 뒤 [Snackbar](snackbar.md) |

다른 알림(Snackbar · Page Banner · Result Section · Alert Dialog)과 고르는 표 · 다섯 부품 견주기는 [Snackbar 의 "무엇으로 알리나"](snackbar.md) 한 곳에 둡니다. 몰라도 일은 할 수 있는 긴 설명은 [Help Bubble](help-bubble.md)(ⓘ), 입력값 하나가 틀리면 [Field](field.md) 의 오류 문구(칸 아래)입니다. 저절로 되풀이하는 조회(시세 폴링)가 실패할 때의 Callout 은 [Skeleton](skeleton.md) 의 "같은 내용을 다시 받을 때" 를 따릅니다.

[그림: Callout 은 그 자리 · Page Banner 는 페이지 맨 위 · Snackbar 는 잠깐](../../site/components/specs/callout.tsx#role-guide)

### 닫기는 한 번 보면 되는 안내에만

새 기능 소개처럼 한 번 읽으면 되는 안내만 닫을 수 있게 합니다 — 닫은 뒤 같은 안내를 다시 띄우지 않습니다(닫음을 기억합니다). 경고 · 오류는 닫지 못합니다 — 문제가 남아 있는 동안 보여야 하기 때문입니다.

[그림: 닫기 — 새 기능 안내만 · 경고는 닫지 못합니다](../../site/components/specs/callout.tsx#dismiss-guide)

### 링크와 전체 누르기

링크는 보조 내용(자세히 · 약관)으로 갈 때만 씁니다 — 행동을 이끌려고 링크를 두지 않습니다. 눌러서 어딘가로 가는 게 상자의 목적이면 상자 전체를 누르게(`actionable`) 하고 링크는 두지 않습니다.

### 본문 아래 버튼

되돌릴 수 있는 할 일이 있는 안내(환불 취소 · 다시 받기)는 본문 아래에 버튼 줄을 둡니다(`interaction: display` 그대로). 본문 ↔ 버튼 8 · 버튼 사이 8 · `neutralOutline` small 입니다. 본문이 여러 줄이면 앞 아이콘은 가운데에 맞춥니다. 폼 저장 실패 Callout 은 본문 맨 위에 두고 아래 20 을 띄우며, 끝 흐림을 켠 시트에서는 흐림 아래로 오게 스크롤합니다.

### 쓰기를 확인하지 못했을 때

요청은 나갔는데 결과를 모르는 쓰기는 "못했어요" 로 알리지 않습니다 — 실패라고 믿고 다시 누르면 두 번 들어가기 때문입니다(결제 · 이체). 웹 · 앱이 같습니다.

| 이런 때 | 뜻 | 알리는 것 |
|---|---|---|
| 응답(2xx)을 받았지만 읽지 못함(형식 오류) · 보낸 뒤 응답이 없음(받기 제한 시간 · 보낸 뒤 끊김) · 502 · 504(게이트웨이 뒤에서 처리됐을 수 있음) | 확인 못 함 | 아래 글 + 목록을 저절로 다시 받습니다 |
| 연결 자체가 안 됨 · 오프라인(웹 `navigator.onLine` 이 false) | 그냥 실패 | 위 "저장 실패" 그대로 |

- **폼이 열린 채** — 폼 맨 위 `critical` 두 문장 "저장됐는지 확인하지 못했어요. 목록에서 확인해주세요."(결제면 "결제됐는지 …", 뒤 문장은 확인할 자리 이름으로). 폼은 연 채로 둡니다.
- **폼 밖(확인창 · 줄 동작)** — [Snackbar](snackbar.md) 한 문장, 동작마다 "저장됐는지 · 삭제됐는지 · 처리됐는지 · 바뀌었는지 확인하지 못했어요." [다시 시도] 는 달지 않습니다.
- **켜고 끄는 단추** — 확인을 못 하면 [다시 시도] 를 달지 않습니다(다시 누르면 또 뒤집힙니다). 응답이 없으면 화면 값을 서버 값으로 맞춥니다. 그냥 실패의 되돌리기 + [다시 시도]([Toggle](toggle.md))는 그대로입니다.

### 글

제목은 성격을 나타내는 짧은 말입니다 — "안내" · "주의" · "새 기능". 본문은 제목을 되풀이하지 않고 해요체 문장에 마침표를 찍습니다. 오류는 무엇이 안 됐는지와 할 수 있는 일까지 씁니다 — "저장하지 못했어요. 입력한 내용은 그대로 있어요. 잠시 뒤 다시 저장해 주세요." 서버가 보낸 글 · 영어 · 코드를 그대로 쓰지 않습니다.

## 코드

레시피 `recipes/shadcn/components/ui/callout.tsx` 를 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 보이기 — 안내 · 링크

[그림: 가져오기 안내](../../site/components/specs/callout.tsx#ex-display)

```tsx
import { Callout } from "@/components/ui/callout"

<Callout tone="informative" title="안내" link={{ label: "자세히", href: "/guide/import" }}>
  가져온 데이터는 기존 거래에 더해지고 덮어쓰지 않아요.
</Callout>
```

### 저장 실패 — 폼 맨 위

[그림: 거래 저장 실패](../../site/components/specs/callout.tsx#ex-error)

```tsx
{/* 나중에 나타나는 경고 · 위험은 보조 기술에 알린다(role="alert") */}
{saveError && (
  <Callout tone="critical" role="alert">
    저장하지 못했어요. 입력한 내용은 그대로 있어요. 잠시 뒤 다시 저장해 주세요.
  </Callout>
)}
```

### 전체 누르기 · 닫기

[그림: 증권 연결 · 새 기능 안내](../../site/components/specs/callout.tsx#ex-interactive)

```tsx
<Callout tone="neutral" interaction="actionable" onClick={openBrokerConnect}>
  토스증권을 연결하면 보유 주식이 자산에 더해져요.
</Callout>

{/* 한 번 보면 되는 안내 — 닫으면 다시 띄우지 않는다 */}
<Callout tone="informative" title="새 기능" interaction="dismissible" open={!seen} onDismiss={markSeen}>
  반복 거래를 자동으로 기록할 수 있어요.
</Callout>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Actionable 누르기 · `Enter` · `Space` | 상자의 동작을 합니다 |
| 링크 누르기 | 그 곳으로 갑니다 |
| 닫기 | 바로 사라집니다. 초점은 다음 요소로 가고, 닫은 것을 기억해 다시 띄우지 않습니다 |
| 글자 크기 설정 | 제목 · 본문 · 링크가 커지고 줄을 바꿔 받습니다 — 상자 높이(최소 높이)가 글을 따라 늘어납니다. 아이콘 · 뒤 화살표 · 닫기는 크기를 그대로 두고 상자 가운데에 섭니다 |
| 나중에 나타남(저장 실패) | `role="alert"` 로 보조 기술에 알립니다 — 처음부터 있던 안내는 알리지 않습니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | `fg-*-contrast` 옅은 톤 바탕 위 5.65 ~ 5.72 · 다크 7.78 ~ 7.84, neutral 15.20 · 10.32 ✓ — 누름 바탕 위에서도 4.5 이상 |
| **WCAG 1.4.4** Resize text | 제목 · 본문 · 링크가 글자 크기 설정을 따라 커지고, 상자가 줄을 바꿔 받습니다 ✓. 아이콘 · 화살표 · 닫기는 글이 아니라 크기를 그대로 둡니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 상자 면은 장식입니다 — 뜻은 아이콘 · 글이 전합니다. 포커스 링 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 닫기 40 ✓ · 링크는 글 높이 19 ⚠(본문 속 링크는 예외) |
| **WCAG 4.1.3** Status messages | 나중에 나타나는 경고 · 위험은 `role="alert"` |
| **ARIA** | Display · Dismissible 은 문단. Actionable 은 `<button type="button">`(이름은 글 전체). 닫기 이름 "닫기", 버튼은 모두 `type="button"`(폼 안에서 제출되지 않게). 아이콘 · 화살표는 장식 |

## Do / Don't

### ✅ Do

- 그 내용 바로 위에, 그 기능의 안내만.
- 저장 실패는 폼 맨 위 `critical` — 폼은 연 채로.
- 눌러서 가는 안내는 상자 전체를 누르게.

### ❌ Don't

- 경고 · 오류를 닫을 수 있게.
- 링크로 행동을 이끌기.
- 페이지 전체의 상태를 Callout 으로 — Page Banner.
- 한 화면에 Callout 여럿을 쌓기 — 되도록 가장 중요한 하나를 두고, 나머지는 그 내용 옆(칸 설명 · 줄 설명)으로.

## Specification

`callout.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Callout 을 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적었습니다.

[그림: Specification — callout.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#callout)
