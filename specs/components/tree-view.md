# Tree View

> 여러 단계로 된 항목 가운데 하나를 고르는 나무입니다(HR 관리 > 회사 · 부서 사용자의 부서 나무). 고른 항목의 내용은 옆 패널(조직도 · 사용자)에 보이며, 부모 · 하위 두 단계에서 줄이 편집을 여는 목록은 [List](list.md) 의 하위 줄, 상세를 접어 두는 목록은 [Accordion](accordion.md) 을 씁니다.

키보드와 역할은 [WAI-ARIA APG Treeview](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/) 를 따릅니다. 나무 전체가 `Tab` 정지점 하나이고, `↑` `↓` 로 보이는 항목 사이를, `→` `←` 로 펼치고 접으며 하위 · 부모로, `Home` · `End` 로 처음 · 끝으로 옮깁니다. 누르는 자리는 줄 전체입니다 — 잎은 누르면 고르고, 부모 줄은 누르면 고르면서 펴고 접으며(펼친 부모를 고르면 하위가 접힙니다), 꺾쇠는 표시만 합니다. `Enter` · `Space` 는 누르기와 같고, `→` `←` 는 고르지 않고 펴고 접기만 합니다. 노드의 동작은 나무 밖 ⋮ 하나가 고른 항목에 겁니다.

줄의 값은 [Side Navigation](side-navigation.md) 항목(44 · 패널 가장자리 8 · 모서리 10 · 14 / 19 · 지금 항목 바탕)과 [List](list.md) 의 누름을 씁니다. 나무는 250 남짓한 패널(1280 에서 본문 992 의 25% = 248 — Resizable) 안의 탐색 목록이라, 같은 자리의 사이드바 줄과 크기가 같습니다.

수치 원본은 [`tree-view.yaml`](tree-view.yaml)입니다.

[그림: HR 관리 > 회사 — 부서 나무 248(본문 992 의 25% · 부서 20 · 가장 긴 뿌리 이름) | 조직도, 경영지원팀을 고른 모습 — 라이트 · 다크](../../site/components/specs/tree-view.tsx#hero)

### 직접 골라 보기

나무를 눌러 초점을 두고 `↑` `↓` `→` `←` `Home` `End` `Enter` 를 누르거나 "키보드 재생" 을 누르면, 옆 글이 초점 · 읽기(이름 · 단계 · 위치 · 펼침 · 고름) · 고른 부서 · `Tab` 정지점 수를 따라 바뀝니다. 부모 줄을 누르면 고르면서 펴고 접고, 잎을 누르면 고릅니다 — `→` `←` 는 펴고 접기만 합니다.

[그림: 플레이그라운드](../../site/components/specs/tree-view.tsx#playground)

## Anatomy

[그림: 나무는 항목 줄(꺾쇠 · 아이콘 · 이름)과 하위 묶음으로 이뤄지고, 노드 동작 ⋮ 는 패널 머리에 하나 둡니다](../../site/components/specs/tree-view.tsx#anatomy)

| ⓐ Tree | 나무 — `role="tree"` 이고 이름이 필수입니다. `Tab` 정지점은 하나입니다. |
| ⓑ Item | 항목 — `role="treeitem"` 이고 줄과 하위 묶음으로 이뤄집니다. |
| ⓒ Chevron | 꺾쇠 — 16 이고 하위가 있는 항목에만 둡니다. 표시만 하고, 누르는 자리는 줄 전체입니다. |
| ⓓ Icon | 앞 아이콘 — 16 이고 있을 때만 둡니다(부서는 `building-2`). |
| ⓔ Label | 이름 — 14 / 19 입니다. 긴 이름은 줄을 바꿉니다. |
| ⓕ Group | 하위 묶음 — `role="group"` 이고 단계마다 20 들입니다. |
| ⓖ More Button | 고른 항목의 동작 ⋮ — 나무 밖(패널 머리)에 하나 두고, 이름은 "{고른 항목} 더보기" 입니다. |

[표: 부위](tree-view.yaml#slots)

## Properties

### 줄

줄은 Side Navigation 항목과 같습니다 — 높이 44(이름이 줄을 바꾸면 늘어납니다), 위아래 12 · 좌우 8, 모서리 10, 이름 14 / 19 · 400 `fg-neutral` 입니다. 나무는 패널 가장자리에서 8 들어옵니다. 단계마다 20 을 들여 하위 꺾쇠가 부모의 꺾쇠와 아이콘 사이에 섭니다 — 줄 왼쪽 여백 = 8 + (단계 − 1) × 20. 꺾쇠 칸 20 · 아이콘 16 · 이름 사이는 6 이고, 이름이 여러 줄이면 꺾쇠 · 아이콘은 첫 줄에 맞춥니다. List 줄(16 / 22 · 좌우 24)보다 작은 것은 나무가 사이드바처럼 좁은 패널 안의 탐색 목록이기 때문입니다.

[그림: 줄 44 · 들임 20 · 꺾쇠 20 · 아이콘 16 · 사이 6 — 가장 긴 뿌리 이름이 줄을 바꿉니다](../../site/components/specs/tree-view.tsx#row)

[표: 나무](tree-view.yaml#base.enabled@root)

[표: 줄](tree-view.yaml#base.enabled@row)

[표: 콘텐츠 층](tree-view.yaml#base.enabled@content)

[표: 아이콘](tree-view.yaml#base.enabled@icon)

[표: 이름](tree-view.yaml#base.enabled@label)

### 꺾쇠 · 펼침

하위가 있는 항목에만 꺾쇠(lucide `chevron-right` 16 · `fg-neutral-subtle`)를 둡니다. 접혀 있으면 오른쪽을 가리키고, 펼치면 아래로 90° 돕니다. 하위 묶음은 높이로 펼치고 접히며, 둘 다 300ms `motion-ease-easing` 입니다(Accordion 과 같습니다). 모션 줄이기에서는 150ms 동안 서서히 나타나고 사라집니다. 하위가 없는 항목은 꺾쇠 칸을 같은 폭으로 비워, 같은 단계의 이름이 같은 자리에 섭니다. 꺾쇠는 표시만 합니다 — 따로 누르는 자리를 두지 않고, 부모 줄 전체가 누르는 자리입니다(아래 "누르기"). 처음 펼침은 화면이 정합니다 — 부서 나무는 모두 펼친 채 엽니다.

[그림: 접힘 · 펼침 · 하위 없음 — 꺾쇠 칸 20(표시만) · 누르는 자리는 줄 전체(점선)](../../site/components/specs/tree-view.tsx#expand)

[표: 펼침](tree-view.yaml#expand)

[표: 꺾쇠](tree-view.yaml#base.enabled@chevron)

### 누르기 — 줄 전체

누르는 자리는 줄 전체(줄 폭 × 44 이상)입니다. 꺾쇠만 누르는 작은 자리를 두지 않습니다. 잎을 누르면 고릅니다. 부모 줄을 누르면 그 항목을 고르면서 접힌 하위는 펴고 펼친 하위는 접습니다 — 꺾쇠를 눌러도 같습니다. `Enter` · `Space` 는 누르기와 같고, `→` `←` 는 고르지 않고 펴고 접기만 합니다.

[표: 누르기](tree-view.yaml#expand@row)

### 늘 펼친 나무(`fixed`)

접지 않는 화면(부서 사용자 — 부서를 고르고 사용자를 옮기는 자리)은 꺾쇠를 그리지 않고 꺾쇠 칸도 빼며 `aria-expanded` 를 두지 않습니다 — 들임만으로 단계를 보입니다. `→` 는 첫 하위로, `←` 는 부모로 옮기기만 합니다. 줄을 누르면(`Enter` · `Space` 도) 고르기만 하고 접히지 않습니다. 접히지 않는데 꺾쇠 · "펼쳐짐" 이 남으면 누를 수 있는 것처럼 보이기 때문입니다. 줄 · 들임 · 고른 바탕은 접고 펴는 나무와 같습니다.

[표: 늘 펼친 나무](tree-view.yaml#mode)

### 고름

고른 항목은 Side Navigation 의 지금 항목과 같은 바탕 `bg-neutral-weak-pressed` 입니다(면 위 1.15 · 다크 1.56). 한 번에 하나만 고르고, 고른 항목은 마우스를 올리거나 눌러도 바탕이 그대로입니다(더 짙은 불투명 역할이 없습니다). 보조 기술에는 `aria-selected` 로 알립니다.

[그림: 경영지원팀을 고른 나무 — 호버 · 누름 · 고름 · 키보드 포커스](../../site/components/specs/tree-view.tsx#selected)

[표: 고름](tree-view.yaml#selected)

[표: 고름 — 올리거나 누를 때](tree-view.yaml#states.selected)

### 노드 동작 — ⋮ 하나

노드마다 단추를 두지 않습니다 — 항목 안에 단추를 넣으면 단추 안 단추가 되고 `Tab` 정지점이 늘어납니다. 추가 · 수정 · 삭제는 나무 밖 패널 머리의 ⋮ 하나([Button](button.md) `ghost` · `iconOnly` · `medium` — 보이는 40 · 누르는 44 · 아이콘 18)가 고른 항목에 겁니다. 이름은 "{고른 부서} 더보기" 이고, 고른 부서가 바뀌면 이름도 바뀝니다. 1280 이상은 [Menu](menu.md), 미만은 [Menu Sheet](menu-sheet.md) 로 엽니다. 패널 머리는 나무의 이름(제목 16 / 22 · 700 — 구역 제목과 한 벌)과 ⋮ 한 줄이고, 제목은 나무 줄의 글과 같은 16 에서 시작합니다.

[그림: 패널 머리 "부서" + ⋮ — "경영지원팀 더보기" → 하위 부서 추가 · 수정 · 삭제](../../site/components/specs/tree-view.tsx#actions)

[표: 패널 머리](tree-view.yaml#base.enabled@header)

[표: 패널 머리 제목](tree-view.yaml#base.enabled@title)

[표: 동작 단추](tree-view.yaml#base.enabled@moreButton)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 바탕 없음 |
| `hovered` | 웹 — 누름과 같은 바탕 `bg-layer-default-pressed`. 고른 항목은 그대로 |
| `focused` | 웹 — 키보드 포커스에만 줄 안쪽 링 2px · 모서리 10 |
| `pressed` | 호버와 같은 바탕 + 꺾쇠 · 아이콘 · 이름만 2px 거리 축소 |

[표: 상태](tree-view.yaml#matrix@row+content+focusRing)

[표: 모션](tree-view.yaml#motion)

## Guidelines

### 언제 쓰나

| 이런 자리 | 쓰는 것 |
|---|---|
| 여러 단계에서 하나를 골라 옆에 그 내용을 봄(부서) | **Tree View** |
| 부모 · 하위 두 단계에서 줄은 편집, 하위만 접음(카테고리) | [List](list.md) 하위 줄 — 줄 앞 꺾쇠 단추 |
| 상세를 접어 둔 항목 여럿(혜택) | [Accordion](accordion.md) |
| 화면을 옮기는 주 메뉴(HR 사이드바) | [Side Navigation](side-navigation.md) |

[그림: 부서는 Tree View · 카테고리는 List 하위 줄 · 사이드바는 Side Navigation](../../site/components/specs/tree-view.tsx#when-guide)

### 부모 줄은 고르면서 펴고 접습니다

부모 줄은 [Accordion](accordion.md) 트리거처럼 줄 전체가 누르는 자리입니다 — 누르면 그 부서를 고르면서 하위를 펴고 접습니다. 꺾쇠만 눌러야 펴지는 나무는 누르는 자리가 31 남짓이라 손가락 · 마우스로 맞히기 어렵습니다. 그 대신 펼친 부모를 고르면 하위가 접힙니다. 하위를 편 채 부모를 고르려면 한 번 더 누르거나 `→` 로 폅니다. 키보드로 고르지 않고 펴고 접으려면 `→` `←` 를 씁니다. 꺾쇠에 줄과 다른 일을 맡기지 않습니다 — 꺾쇠를 눌러도 줄을 누른 것과 같습니다.

[그림: 펼친 클라우드 인프라팀을 누르면 골라지며 접히고 한 번 더 누르면 펴집니다 · → 는 고르지 않고 펴기만 · 꺾쇠만 누르는 31 × 44 는 두지 않습니다](../../site/components/specs/tree-view.tsx#press-guide)

### 키보드 — Tab 한 번, 화살표로

나무 전체가 `Tab` 정지점 하나입니다 — 들어오면 고른 항목(없으면 첫 항목)에 초점이 오고, 다시 `Tab` 하면 나무를 나갑니다. 부서 20개도 화살표로 모두 다닐 수 있습니다. 화살표를 처음 쓰는 사람을 위해 나무의 이름(패널 제목)을 분명히 두고, 낭독이 단계 · 위치 · 펼침을 알립니다(트리 관례).

| 키 | 동작 |
|---|---|
| `↓` · `↑` | 다음 · 앞 보이는 항목으로 — 끝에서 멈춥니다 |
| `→` | 접힌 부모는 펼칩니다(초점 그대로) · 펼친 부모는 첫 하위로 · 하위 없는 항목은 그대로 — 고르지 않습니다 |
| `←` | 펼친 부모는 접습니다 · 그 밖에는 부모로 · 맨 위 단계는 그대로 — 고르지 않습니다 |
| `Home` · `End` | 첫 항목 · 마지막 보이는 항목으로 |
| `Enter` · `Space` | 누르기와 같습니다 — 잎은 고르고, 부모는 고르면서 펴고 접습니다 |

[그림: 키보드 재생 — Tab · ↓ · →(펴기) · ↓ · Enter(잎 — 고름) · ←(부모로) · Enter(부모 — 고르며 접힘) · End · Home 차례로 초점 · 읽기 · 고름 · 펼침](../../site/components/specs/tree-view.tsx#keyboard-guide)

### 이름은 줄을 바꿉니다

긴 이름은 말줄임 없이 줄을 바꿔 다 보입니다 — 가장 긴 뿌리 이름 "가람누리 디지털혁신본부 클라우드 플랫폼 운영 그룹" 도 248 패널에서 줄을 바꿔 다 읽힙니다. 앞부분이 같은 부서가 말줄임 때문에 구별되지 않는 일을 막습니다. `title` 말풍선으로 대신하지 않습니다.

[그림: 248 패널 — 가장 긴 뿌리 이름 줄바꿈 · 말줄임](../../site/components/specs/tree-view.tsx#wrap-guide)

### 머리말을 두지 않습니다

항목마다 머리말(`h3`)을 두지 않습니다 — 부서 이름은 문서의 절이 아닙니다. 단계 · 위치는 `aria-level` · `aria-setsize` · `aria-posinset` 으로 알립니다.

### 글

나무의 이름은 무엇의 나무인지("부서"), 동작 단추는 "{고른 부서} 더보기", 메뉴 줄은 동사로("하위 부서 추가" · "수정" · "삭제") 씁니다.

## 코드

레시피 `recipes/shadcn/components/ui/tree-view.tsx` 를 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `TreeView` — 나무. `nodes`(`TreeNode[]` — `{ id, label, children? }`) · `aria-label` 또는 `aria-labelledby`(필수) · `selectedId` · `onSelectedChange(id)` · `expandedIds` · `defaultExpandedIds` · `onExpandedChange(ids)` · `icon`(모든 항목의 앞 아이콘 — 부서는 `Building2`) · `collapsible`(기본 `true` — `false` 면 늘 펼친 나무: 꺾쇠 · `aria-expanded` 없음). `role="tree"` · `treeitem`(`aria-level` · `aria-setsize` · `aria-posinset` · `aria-expanded` · `aria-selected`) · `group`, roving tabindex 와 키보드(`↑` `↓` `→` `←` `Home` `End` `Enter` `Space`)를 나무가 맡습니다. 줄 전체가 누르는 자리입니다 — 잎은 고르고, 부모는 고르면서 펴고 접습니다(`onSelectedChange` · `onExpandedChange` 가 함께 불리며, `Enter` · `Space` 도 같습니다). `→` `←` 는 펴고 접기만 합니다. 꺾쇠는 표시만 하므로 따로 누르는 자리 · 이벤트가 없습니다. `collapsible={false}` 면 누르기는 고르기만 합니다.
- 노드 동작은 나무 밖에 둡니다 — [Button](button.md) `ghost` · `iconOnly` + [Menu](menu.md) 의 `ResponsiveMenu`(1280 이상 Menu · 미만 Menu Sheet).

### 부서 나무 — 패널 머리의 ⋮ 하나

[그림: 부서 패널 248 — 머리 "부서" + ⋮, 경영지원팀 고름](../../site/components/specs/tree-view.tsx#ex-department)

```tsx
import { Building2, EllipsisVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ResponsiveMenu,
  ResponsiveMenuContent,
  ResponsiveMenuGroup,
  ResponsiveMenuItem,
  ResponsiveMenuTrigger,
} from "@/components/ui/menu"
import { TreeView } from "@/components/ui/tree-view"

<div className="flex items-center justify-between">
  <h2 id="department-title">부서</h2>
  {/* 노드마다 단추를 두지 않는다 — 고른 부서에 거는 ⋮ 하나 */}
  <ResponsiveMenu>
    <ResponsiveMenuTrigger asChild>
      <Button variant="ghost" layout="iconOnly" aria-label={`${selected.label} 더보기`}>
        <EllipsisVertical />
      </Button>
    </ResponsiveMenuTrigger>
    <ResponsiveMenuContent title={selected.label}>
      <ResponsiveMenuGroup>
        <ResponsiveMenuItem label="하위 부서 추가" onSelect={addChild} />
        <ResponsiveMenuItem label="수정" onSelect={edit} />
      </ResponsiveMenuGroup>
      <ResponsiveMenuGroup>
        <ResponsiveMenuItem label="삭제" tone="critical" onSelect={askDelete} />
      </ResponsiveMenuGroup>
    </ResponsiveMenuContent>
  </ResponsiveMenu>
</div>
<TreeView
  aria-labelledby="department-title"
  nodes={departments}
  icon={<Building2 />}
  selectedId={selected.id}
  onSelectedChange={setSelectedId}
  defaultExpandedIds={parentIds}
/>
```

### 늘 펼친 나무 — 부서 사용자

[그림: 부서 사용자 — 꺾쇠 없이 들임만, 고르기는 그대로](../../site/components/specs/tree-view.tsx#ex-fixed)

```tsx
import { Building2 } from "lucide-react"
import { TreeView } from "@/components/ui/tree-view"

{/* 접지 않는다 — 꺾쇠 · aria-expanded 없이 들임만 */}
<TreeView aria-label="부서" nodes={departments} icon={<Building2 />} collapsible={false} selectedId={selectedId} onSelectedChange={setSelectedId} />
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 잎 누르기 · `Enter` · `Space` | 그 항목을 고릅니다 — 초점도 그 항목에 둡니다 |
| 부모 줄 누르기 · `Enter` · `Space` | 그 항목을 고르면서 접힌 하위는 펴고 펼친 하위는 접습니다 — 초점도 그 항목에 둡니다. 꺾쇠를 눌러도 같습니다(표시만) |
| 늘 펼친 나무(`fixed`)의 줄 누르기 | 고르기만 합니다 — 접히지 않습니다 |
| `Tab` | 나무에 들어오면 고른 항목(없으면 첫 항목)에 초점을 두고, 다시 `Tab` 이면 나갑니다 |
| `↓` · `↑` · `→` · `←` · `Home` · `End` | APG Treeview — 위 키보드 표를 따릅니다 |
| `←` 로 접어 고른 항목이 부모 안으로 숨으면 | 고름은 그대로이고, 초점은 접은 부모에 둡니다 |
| 모션 줄이기 | 하위 묶음이 높이 움직임 없이 150ms 동안 서서히 · 꺾쇠는 바로 · 누름 축소 없음 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 이름 `fg-neutral` 면 위 16.41 · 다크 13.42 · 고른 바탕 위 14.26 · 8.62 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 꺾쇠 · 아이콘 `fg-neutral-subtle` 5.50 · 6.09(누름 바탕 5.18 · 4.68 · 고른 바탕 4.77 · 3.91) ✓. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓ |
| **WCAG 1.4.1** Use of color | 고른 항목은 바탕(1.15 · 다크 1.56)으로만 보입니다 — Side Navigation 지금 항목과 같습니다 ⚠. 보조 기술에는 `aria-selected` 로 알립니다 |
| **WCAG 2.1.1** Keyboard | 나무에 `Tab` 하나 + 화살표 · `Home` · `End` · `Enter` · `Space` 로 모든 항목을 고르고 펼칩니다 ✓ |
| **WCAG 2.4.3** Focus order | 나무는 정지점 하나 — 들어오면 고른 항목에 초점이 옵니다 ✓ |
| **WCAG 2.4.7** Focus visible | 줄 안쪽 링 2px ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 줄 전체 44 이상 — 부모 줄도 줄 전체가 누르는 자리(꺾쇠는 표시만) · ⋮ 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 줄 44 ✓ · ⋮ 44 ✓ — 꺾쇠만 누르는 작은 자리를 두지 않습니다 |
| **WCAG 4.1.2** Name, Role, Value | `tree`(이름 필수) · `treeitem`(`aria-level` · `aria-setsize` · `aria-posinset` · 부모만 `aria-expanded` · `aria-selected`) · `group` — 낭독 "경영지원팀, 트리 항목, 2단계, 3 / 15, 선택됨" ✓ |
| **ARIA** | APG Treeview — 하나만 고르고(`aria-multiselectable` 없음), 고름은 초점을 따르지 않습니다. 누르기 · `Enter` · `Space` 로 고르고, 부모는 함께 펴고 접습니다(APG — "부모 노드의 기본 동작은 열고 닫기일 수 있다"). `→` `←` 는 펴고 접기만 합니다. 머리말 · 항목 안 단추는 두지 않습니다. 늘 펼친 나무는 `aria-expanded` 를 두지 않습니다. 아이콘은 `aria-hidden` 입니다 |
| **Reduced motion** | 하위 묶음은 150ms 동안 서서히 · 꺾쇠는 바로 · 누름 축소 없음 |

## Do / Don't

### ✅ Do

- 여러 단계에서 하나를 고르는 자리에 쓰고, 고른 내용은 옆 패널에 보입니다.
- 나무는 `Tab` 하나 + 화살표로 다니게 합니다. 줄 전체를 누르는 자리로 두고(부모는 고르면서 펴고 접기), `→` `←` 는 펴고 접기만 합니다.
- 노드 동작은 나무 밖 ⋮ 하나로 두고, 이름은 "{고른 항목} 더보기" 로 씁니다.
- 긴 이름은 줄을 바꿔 다 보이게 합니다.

### ❌ Don't

- 꺾쇠만 누르는 작은 자리(31 × 44)를 두거나 꺾쇠와 줄에 다른 일을 맡기지 않습니다.
- 잎을 `div` 로 두어 키보드로 닿지 않게 하거나, 노드마다 루트를 따로 두어 화살표가 다음 노드로 가지 않게 하지 않습니다.
- 항목마다 머리말을 두거나 항목 안에 단추(단추 안 단추)를 넣지 않습니다.
- 이름을 말줄임하거나 `title` 로 대신하지 않습니다.
- 접지 않는 나무에 꺾쇠 · `aria-expanded` 를 남기지 않습니다.

## Specification

[그림: Tree View — YAML 규칙 전부](../../site/components/specs/spec-sheet.tsx#tree-view)
