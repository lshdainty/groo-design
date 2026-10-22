# Page Banner

> 페이지 맨 위(머리 바로 아래)에 화면 폭 전체로 놓이는 띠 — 그 페이지 전체의 상태를 알린다(증권 연결 끊김 · Pro 만료 예정 · 새 버전). 한 화면에 하나. 그 기능 가까이의 안내는 [Callout](callout.md), 잠깐 알릴 결과는 [Snackbar](snackbar.md) 다.

구조는 당근 [SEED Page Banner](https://seed-design.io/react/components/page-banner)(Apache-2.0)를 따른다 — 화면 폭 띠 · 아이콘 · 제목 · 본문 · 버튼, 옅은(weak) · 짙은(solid) 바탕, 상호작용 셋. 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-02 사용자 결정). groo 에 처음 두는 컴포넌트다.

수치 원본은 [`page-banner.yaml`](page-banner.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 증권 연결 끊김 · 새 버전 · Pro 만료 예정 — 라이트 · 다크](../../site/components/specs/page-banner.tsx#hero)

### 직접 골라 보기

톤 · 바탕 · 상호작용 · 제목 · 버튼을 고르면 스펙대로 그린 띠와 그 코드가 바뀐다.

[그림: 플레이그라운드](../../site/components/specs/page-banner.tsx#playground)

## Anatomy

[그림: 띠는 아이콘 · 제목 · 본문 · 버튼, 뒤 화살표나 닫기](../../site/components/specs/page-banner.tsx#anatomy)

| ⓐ Container | 띠 — 화면 폭 전체, 모서리 없음. |
| ⓑ Icon | 앞 아이콘 — 첫 줄 가운데. |
| ⓒ Title | 제목 — 상태를 나타내는 짧은 말(연결 끊김 · 곧 만료). 꼭 필요할 때만. |
| ⓓ Description | 본문 — 제목 뒤에 이어진다. |
| ⓔ Button | 버튼 — 하나, 글 버튼. 자리가 모자라면 다음 줄로. |
| ⓕ Chevron · Close | 띠 전체를 누르면 뒤 화살표, 닫을 수 있으면 닫기. |

[표: 부위](page-banner.yaml#slots)

## Properties

### 띠

좌우 화면 여백 24 · 위아래 10 · 최소 40 · 모서리 없음. 아이콘 16(첫 줄 가운데), 제목 14 / 19 · 700, 본문 14 / 19 · 500(사이 띄어쓰기 두 칸), 버튼 13 / 18 · 700(누르는 높이 40). 본문과 버튼이 한 줄에 안 들어가면 버튼이 다음 줄 본문 시작선으로 내려간다.

[그림: 띠의 여백 · 버튼이 다음 줄로](../../site/components/specs/page-banner.tsx#layout)

[표: 공통](page-banner.yaml#base.enabled)

### Tone · Variant

톤 다섯(`neutral` · `informative` · `positive` · `warning` · `critical`) × 바탕 둘. 옅은 바탕(`weak`, 기본)은 Callout 과 같은 짝(`bg-*-weak` + `fg-*-contrast`)이고, 짙은 바탕(`solid`)은 `bg-*-solid` + 흰 글이다 — 연결 끊김 · 거절 · 편집 불가처럼 무거운 상태에만.

[그림: 톤 다섯 × 옅음 · 짙음 — 라이트 · 다크](../../site/components/specs/page-banner.tsx#tones)

[표: 바탕 · 톤](page-banner.yaml#compound)

### Interaction

`display`(보이기만 — 버튼 하나를 둘 수 있다) · `actionable`(띠 전체가 버튼 — 뒤 화살표) · `dismissible`(닫기 — 한 번 보면 되는 안내에만).

[표: 상호작용](page-banner.yaml#interaction)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 기본 |
| `hovered` | 웹 — Actionable 은 누름 바탕 |
| `pressed` | Actionable 은 누름 바탕 + 안의 내용만 2px 거리 축소(바탕은 그대로), 버튼 · 닫기는 각자 축소 |
| `focused` | 웹 — 키보드 포커스에만 안쪽 링(화면 끝까지 차는 띠라 바깥 링이 잘린다). 짙은 바탕에서는 링을 띠 글자색으로 — 브랜드 링은 짙은 띠 위에서 1.61 ~ 2.44 라 보이지 않는다 |

[표: 상태](page-banner.yaml#matrix)

[표: 모션](page-banner.yaml#motion)

## Guidelines

### 페이지 맨 위에 하나

페이지 머리 바로 아래(위에 사진이 있으면 그 아래)에 하나만 둔다. 그 페이지 전체에 걸린 상태만 — 증권 연결이 끊긴 증권 페이지, Pro 만료가 다가온 설정, 새 버전이 나온 웹. 그 기능 가까이의 안내는 [Callout](callout.md) 이다. 스크롤해도 맨 위에 붙여 둘 수 있다(붙일 때는 화면마다 정한다).

자리가 머리 바로 아래 화면 폭이라 Desk 폰 · 데스크톱 모두 회색 바닥(`bg-layer-basement`) 위에 놓인다. 옅은 neutral(`weak` · `neutral`)은 `bg-neutral-weak` 그대로 둔다 — 라이트에서 바닥과 같은 gray-200 이라 띠 모양이 보이지 않고 아이콘 · 글 · 버튼만 보인다(다크는 1.47:1 로 갈린다). 이것을 받아들인다(2026-10-17 사용자 결정 — 03-F 결정 3 — "지금 구현 그대로", https://claude.ai/artifact/F5SKUbGEWDG82F7B5RRjQB). 투명 짝 · 흰 띠 · 아래 선은 고르지 않았다. 띠가 보여야 하는 안내라면 neutral 이 아닌 톤(informative · warning …)을 쓴다.

| | Page Banner | Callout |
|---|---|---|
| 자리 | 페이지 맨 위 | 본문 안, 그 내용 바로 위 |
| 폭 | 화면 폭 전체 | 콘텐츠 폭 |
| 범위 | 페이지 전체 | 그 기능 · 내용 |
| 수 | 한 화면에 하나 | 필요한 만큼(쌓지 않는다) |

[그림: 자리 — 머리 바로 아래 · 한 화면 하나](../../site/components/specs/page-banner.tsx#placement-guide)

### 짙은 바탕은 무거운 상태에만

기본은 옅은 바탕이다. 짙은 바탕은 연결 끊김 · 거절 · 편집 불가처럼 지금 그 페이지를 제대로 쓸 수 없는 상태에만 쓴다.

### 닫기는 한 번 보면 되는 안내에만

새 기능 · 새 버전처럼 한 번 보면 되는 안내만 닫을 수 있게 한다 — 닫은 것을 기억해 다시 띄우지 않는다. 경고 · 오류 배너는 닫지 못한다.

### 글

제목은 상태를 나타내는 짧은 말 — "연결 끊김" · "곧 만료". 본문은 제목을 되풀이하지 않고 해요체 문장에 마침표. 버튼은 동작 이름 — "다시 연결" · "업데이트" · "구독 보기".

## 코드

레시피 `recipes/shadcn/components/ui/page-banner.tsx` 를 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 연결 끊김 — 버튼 하나

[그림: 증권 연결 끊김](../../site/components/specs/page-banner.tsx#ex-display)

```tsx
import { PageBanner } from "@/components/ui/page-banner"

<PageBanner tone="critical" title="연결 끊김" button={{ label: "다시 연결", onClick: reconnect }}>
  토스증권 키가 만료돼 시세를 받지 못해요.
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
| 버튼 · Actionable 누르기 | 그 동작을 한다 |
| 닫기 | 바로 사라진다 — 닫은 것을 기억해 다시 띄우지 않는다. 초점은 다음 요소로 |
| 스크롤 | 기본은 같이 올라간다. 맨 위에 붙일 때는 머리 아래에 붙는다 |
| 나중에 나타남(연결이 끊김) | 경고 · 위험이면 보조 기술에 알린다(`role="alert"`) |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 옅은 바탕 `fg-*-contrast` 5.65 ~ 5.72 · 7.78 ~ 7.84, 짙은 바탕 흰 글 5.06 ~ 5.09 · 5.77 ~ 5.79, neutral 짙음 16.41 · 13.42 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 포커스 링(안쪽) — 옅은 바탕은 `stroke-focus-ring` 3.91 이상 ✓, 짙은 바탕은 띠 글자색 4.93 이상 ✓(누름 바탕 포함). 띠 면은 장식 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 버튼 높이 40 · 닫기 40 ✓ |
| **ARIA** | 띠는 문단(`role` 없음), Actionable 은 `<button type="button">`. 나중에 나타나는 경고 · 위험은 `role="alert"`. 닫기 이름 "닫기" |

## Do / Don't

### ✅ Do

- 페이지 맨 위에 하나, 그 페이지 전체의 상태만.
- 무거운 상태에만 짙은 바탕.
- 버튼은 동작 이름 하나.

### ❌ Don't

- 한 화면에 배너 둘 이상.
- 그 기능의 팁을 배너로 — Callout.
- 경고 · 오류 배너를 닫을 수 있게.

## Specification

`page-banner.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Page Banner 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — page-banner.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#page-banner)

## SEED 와 다른 점

- **좌우 여백은 화면 여백 24** — SEED 16. 띠 안 글이 페이지 글과 같은 선에서 시작한다.
- **톤은 다섯** — magic(AI)은 두지 않는다.
- **짙은 바탕의 글은 흰색** — groo `bg-*-solid` 위 5.06 이상(SEED warning 은 노랑 위 검정 글).
- **아이콘은 lucide 선 아이콘**(v106).
- **나중에 나타나는 경고 · 위험은 `role="alert"`**, 버튼은 모두 `type="button"`.

## Migration notes

### 2026-10-02 — 새로 둔다(SEED Page Banner)

사용자가 [비교 페이지](https://claude.ai/artifact/8t85WkZ3HLhMu8KibW3Vk1)에서 Page Banner 를 두기로 정했다. 세 제품에는 지금 페이지 배너가 없다 — 앱 적용 때 화면마다 정할 자리:

- **Desk 웹 · 앱 증권** — 불러오기에 실패해도 "증권 계정을 연결해 주세요" 화면이 페이지를 대신한다(연결돼 있는데도). 연결 끊김은 Page Banner + 지난 값, 연결이 없을 때만 Result Section.
- **Desk 앱 업데이트** — 업데이트는 화면 전체, 결제 문자 안내는 홈 맨 위 PAlert(iOS 만).
- **HR 공지** — 로그인할 때마다 공지 대화상자가 차례로 뜬다("오늘 하루 보지 않기" 는 모든 공지를 하루 숨긴다).
- **환경 표시**(DEVELOPMENT 워터마크 · DEV 배지) — 배너가 아니다. 보조 기술에 숨긴다(`aria-hidden`).
