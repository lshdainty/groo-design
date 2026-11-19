# Page Banner

> 페이지 맨 위(머리 바로 아래)에 화면 폭 전체로 놓이는 띠입니다 — 그 페이지 전체의 상태를 알립니다(증권 연결 끊김 · Pro 만료 예정 · 새 버전). 한 화면에 하나만 둡니다. 그 기능 가까이의 안내는 [Callout](callout.md), 잠깐 알릴 결과는 [Snackbar](snackbar.md) 입니다.

화면 폭 띠에 아이콘 · 제목 · 본문 · 버튼을 두고, 바탕은 옅은(weak) · 짙은(solid) 둘, 상호작용은 셋입니다.

수치 원본은 [`page-banner.yaml`](page-banner.yaml)입니다.

[그림: 증권 연결 끊김 · 새 버전 · Pro 만료 예정 — 라이트 · 다크](../../site/components/specs/page-banner.tsx#hero)

### 직접 골라 보기

톤 · 바탕 · 상호작용 · 제목 · 버튼을 고르면 스펙대로 그린 띠와 그 코드가 바뀝니다.

[그림: 플레이그라운드](../../site/components/specs/page-banner.tsx#playground)

## Anatomy

[그림: 띠는 아이콘 · 제목 · 본문 · 버튼, 뒤 화살표나 닫기](../../site/components/specs/page-banner.tsx#anatomy)

| ⓐ Container | 띠 — 화면 폭 전체, 모서리 없음. |
| ⓑ Icon | 앞 아이콘 — 첫 줄 가운데. |
| ⓒ Title | 제목 — 상태를 나타내는 짧은 말(연결 끊김 · 곧 만료). 꼭 필요할 때만 둡니다. |
| ⓓ Description | 본문 — 제목 뒤에 이어집니다. |
| ⓔ Button | 버튼 — 글 버튼 하나. 자리가 모자라면 다음 줄로 내려갑니다. |
| ⓕ Chevron · Close | 띠 전체를 누르면 뒤 화살표, 닫을 수 있으면 닫기. |

[표: 부위](page-banner.yaml#slots)

## Properties

### 띠

좌우 화면 여백 24 · 위아래 10 · 최소 40 · 모서리 없음입니다. 좌우 여백을 화면 여백과 같게 두어 띠 안 글이 페이지 글과 같은 선에서 시작합니다. 아이콘은 lucide 선 아이콘 16(첫 줄 가운데), 제목 14 / 19 · 700, 본문 14 / 19 · 500(사이 띄어쓰기 두 칸), 버튼 13 / 18 · 700(누르는 높이 40)입니다. 본문과 버튼이 한 줄에 안 들어가면 버튼이 다음 줄 본문 시작선으로 내려갑니다.

[그림: 띠의 여백 · 버튼이 다음 줄로](../../site/components/specs/page-banner.tsx#layout)

[표: 공통](page-banner.yaml#base.enabled)

### Tone · Variant

톤 다섯(`neutral` · `informative` · `positive` · `warning` · `critical`) × 바탕 둘입니다. 옅은 바탕(`weak`, 기본)은 Callout 과 같은 짝(`bg-*-weak` + `fg-*-contrast`)이고, 짙은 바탕(`solid`)은 `bg-*-solid` + 흰 글입니다 — 더 강하게 알려야 할 때(연결 끊김 · 거절 · 편집 불가) 씁니다. 짙은 바탕의 글은 warning 을 포함해 모두 흰색입니다(`bg-*-solid` 위 5.06 이상).

[그림: 톤 다섯 × 옅음 · 짙음 — 라이트 · 다크](../../site/components/specs/page-banner.tsx#tones)

[표: 바탕 · 톤](page-banner.yaml#compound)

### Interaction

`display`(보이기만 — 버튼 하나를 둘 수 있습니다) · `actionable`(띠 전체가 버튼 — 뒤 화살표) · `dismissible`(닫기 — 한 번 보면 되는 안내에만).

[표: 상호작용](page-banner.yaml#interaction)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 기본 |
| `hovered` | 웹 — Actionable 은 누름 바탕 |
| `pressed` | Actionable 은 누름 바탕 + 안의 내용만 2px 거리 축소(바탕은 그대로), 버튼 · 닫기는 각자 축소 |
| `focused` | 웹 — 키보드 포커스에만 안쪽 링(화면 끝까지 차는 띠라 바깥 링이 잘립니다). 짙은 바탕에서는 링을 띠 글자색으로 — 브랜드 링은 짙은 띠 위에서 1.61 ~ 2.44 라 보이지 않습니다 |

[표: 상태](page-banner.yaml#matrix)

[표: 모션](page-banner.yaml#motion)

## Guidelines

### 페이지 맨 위에 하나

페이지 머리 바로 아래(위에 사진이 있으면 그 아래)에 하나만 둡니다. 그 페이지 전체에 걸린 상태에만 씁니다 — 증권 연결이 끊긴 증권 페이지, Pro 만료가 다가온 설정, 새 버전이 나온 웹. 그 기능 가까이의 안내는 [Callout](callout.md) 입니다. 스크롤해도 맨 위에 붙여 둘 수 있습니다(붙일지는 화면마다 정합니다).

증권 연결이 끊겼을 때는 페이지를 연결 안내 화면으로 바꾸지 않고 Page Banner 와 지난 값을 보입니다 — 연결이 아예 없을 때만 Result Section 을 둡니다. 환경 표시(DEVELOPMENT 워터마크 · DEV 배지)는 배너가 아니며 보조 기술에 숨깁니다(`aria-hidden`).

자리가 머리 바로 아래 화면 폭이라 Desk 폰 · 데스크톱 모두 회색 바닥(`bg-layer-basement`) 위에 놓입니다. 옅은 neutral(`weak` · `neutral`)은 `bg-neutral-weak` 그대로 둡니다 — 라이트에서는 바닥과 같은 색이라 띠 모양이 보이지 않고 아이콘 · 글 · 버튼만 보입니다(다크는 1.47:1 로 갈립니다). 띠가 보여야 하는 안내라면 neutral 이 아닌 톤(informative · warning …)을 씁니다.

| | Page Banner | Callout |
|---|---|---|
| 자리 | 페이지 맨 위 | 본문 안, 그 내용 바로 위 |
| 폭 | 화면 폭 전체 | 콘텐츠 폭 |
| 용도 | 페이지 상태 · 제재 · 기능 켜짐 안내(연결 끊김 · 만료 예정 · 새 버전) | 팁 · 기능 설명 · 위험 주의 |
| 범위 | 페이지 전체 | 그 기능 · 내용 |
| 수 | 한 화면에 하나 | 필요한 만큼(쌓지 않습니다) |
| 스크롤(Sticky) | 맨 위에 붙일 수 있습니다(화면마다 정합니다) | 없습니다 — 내용과 함께 움직입니다 |

다른 알림과 고르는 표는 [Snackbar 의 "무엇으로 알리나"](snackbar.md) 한 벌입니다.

[그림: 자리 — 머리 바로 아래 · 한 화면 하나](../../site/components/specs/page-banner.tsx#placement-guide)

### 짙은 바탕은 더 강하게 알릴 때

기본은 옅은 바탕입니다. 짙은 바탕은 더 강하게 알려야 할 때 씁니다 — 예: 연결 끊김 · 거절 · 편집 불가처럼 지금 그 페이지를 제대로 쓸 수 없는 상태.

### 닫기는 한 번 보면 되는 안내에만

새 기능 · 새 버전처럼 한 번 보면 되는 안내만 닫을 수 있게 합니다 — 닫은 것을 기억해 다시 띄우지 않습니다. 경고 · 오류 배너는 닫지 못합니다.

### 글

제목은 상태를 나타내는 짧은 말입니다 — "연결 끊김" · "곧 만료". 본문은 제목을 되풀이하지 않는 해요체 문장으로 쓰고 마침표를 찍습니다. 버튼은 동작 이름입니다 — "다시 연결" · "업데이트" · "구독 보기".

## 코드

레시피 `recipes/shadcn/components/ui/page-banner.tsx` 를 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 연결 끊김 — 버튼 하나

[그림: 증권 연결 끊김](../../site/components/specs/page-banner.tsx#ex-display)

```tsx
import { PageBanner } from "@/components/ui/page-banner"

<PageBanner tone="critical" title="연결 끊김" button={{ label: "다시 연결", onClick: reconnect }}>
  증권 연결 키가 만료돼 시세를 받지 못해요.
</PageBanner>
```

### 새 기능 · 곧 만료

[그림: 닫을 수 있는 새 기능 안내 · 닫지 못하는 만료 예정(짙은 바탕)](../../site/components/specs/page-banner.tsx#ex-dismissible)

```tsx
{/* 한 번 보면 되는 안내 — 닫으면 다시 띄우지 않는다 */}
<PageBanner tone="informative" title="새 기능" interaction="dismissible" open={!seen} onDismiss={markSeen}>
  반복 거래를 자동으로 기록할 수 있어요.
</PageBanner>

<PageBanner tone="warning" variant="solid" title="곧 만료" button={{ label: "구독 보기", onClick: openSubscription }}>
  Pro 이용이 10월 31일에 끝나요.
</PageBanner>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 버튼 · Actionable 누르기 | 그 동작을 합니다 |
| 닫기 | 바로 사라집니다 — 닫은 것을 기억해 다시 띄우지 않습니다. 초점은 다음 요소로 옮깁니다 |
| 스크롤 | 기본은 같이 올라갑니다. 맨 위에 붙일 때는 머리 아래에 붙습니다 |
| 나중에 나타남(연결이 끊김) | 경고 · 위험이면 보조 기술에 알립니다(`role="alert"`) |
| 글자 크기 설정 | 제목 · 본문 · 버튼 글이 커지고 줄을 바꿔 받습니다 — 띠는 최소 높이라 글을 따라 늘어납니다. 앞 아이콘 · 뒤 화살표 · 닫기 상자는 px 그대로이고, 앞 아이콘은 글 첫 줄 가운데에 섭니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 옅은 바탕 `fg-*-contrast` 5.65 ~ 5.72 · 7.78 ~ 7.84, 짙은 바탕 흰 글 5.06 ~ 5.09 · 5.77 ~ 5.79, neutral 짙음 16.41 · 13.42 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 포커스 링(안쪽) — 옅은 바탕은 `stroke-focus-ring` 3.91 이상 ✓, 짙은 바탕은 띠 글자색 4.93 이상 ✓(누름 바탕 포함). 띠 면은 장식입니다 |
| **WCAG 1.4.4** Resize text | 제목 · 본문 · 버튼 글이 글자 크기 설정을 따르고, 띠가 글을 따라 늘어나 잘리지 않습니다 ✓. 아이콘 · 닫기 상자는 크기를 그대로 둡니다(아이콘은 1.4.4 의 대상이 아닙니다) |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 버튼 높이 40 · 닫기 40 ✓ |
| **ARIA** | 띠는 문단(`role` 없음), Actionable 은 `<button type="button">`, 버튼은 모두 `type="button"`. 나중에 나타나는 경고 · 위험은 `role="alert"`. 닫기 이름 "닫기" |

## Do / Don't

### ✅ Do

- 페이지 맨 위에 하나만, 그 페이지 전체의 상태에만 씁니다.
- 기본은 옅은 바탕으로, 짙은 바탕은 더 강하게 알릴 때 씁니다.
- 버튼은 동작 이름 하나로 둡니다.

### ❌ Don't

- 한 화면에 배너를 둘 이상 두지 않습니다.
- 그 기능의 팁을 배너로 알리지 않습니다 — Callout 입니다.
- 경고 · 오류 배너를 닫을 수 있게 하지 않습니다.

## Specification

`page-banner.yaml` 의 규칙을 조건마다 빠짐없이 그립니다 — 웹 · 앱이 Page Banner 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — page-banner.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#page-banner)
