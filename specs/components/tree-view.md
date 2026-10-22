# Tree View

> 여러 단계로 된 항목 가운데 하나를 고르는 나무 — HR 관리 > 회사 · 부서 사용자의 부서 나무. 고른 항목의 내용은 옆 패널(조직도 · 사용자)에 보인다. 부모 · 하위 두 단계에서 줄이 편집을 여는 목록은 [List](list.md) 의 하위 줄, 상세를 접어 두는 목록은 [Accordion](accordion.md) 이다.

SEED 에는 나무가 없다 — Accordion 은 중첩 · 고르기를 다루지 않는다. groo 는 [WAI-ARIA APG Treeview](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/) 를 따른다 — 나무 전체가 `Tab` 정지점 하나, `↑` `↓` 로 보이는 항목 사이, `→` `←` 로 펼치고 접으며 하위 · 부모로, `Home` · `End` 로 다닌다(2026-10-10 사용자 결정 8A). 누르는 자리는 줄 전체다 — 잎은 누르면 고르고, 부모 줄은 누르면 고르면서 펴고 접으며(펼친 부모를 고르면 하위가 접힌다), 꺾쇠는 표시만이다(16D — SEED Accordion "터치 영역은 Chevron 아이콘뿐만 아니라 Trigger 전체"). `Enter` · `Space` 는 누르기와 같고, `→` `←` 는 고르지 않고 펴고 접기만 한다. 노드의 동작은 나무 밖 ⋮ 하나가 고른 항목에 건다. 줄의 값은 [Side Navigation](side-navigation.md) 항목(44 · 패널 가장자리 8 · 모서리 10 · 14 / 19 · 지금 항목 바탕)과 [List](list.md) 의 누름이다 — 나무는 250 남짓한 패널(1280 에서 본문 992 의 25% = 248 — Resizable) 안의 탐색 목록이라 같은 자리의 사이드바 줄과 크기가 같다. groo 에 처음 두는 스펙이다 — DESIGN.md 의 옛 Treeview 절(v73)을 대신한다.

수치 원본은 [`tree-view.yaml`](tree-view.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: HR 관리 > 회사 — 부서 나무 248(본문 992 의 25% · 부서 20 · 가장 긴 뿌리 이름) | 조직도, 경영지원팀을 고른 모습 — 라이트 · 다크](../../site/components/specs/tree-view.tsx#hero)

### 직접 골라 보기

나무를 눌러 초점을 두고 `↑` `↓` `→` `←` `Home` `End` `Enter` 를 눌러 보거나 "키보드 재생" 을 누르면, 옆 글이 초점 · 읽기(이름 · 단계 · 위치 · 펼침 · 고름) · 고른 부서 · `Tab` 정지점 수를 따라간다. 부모 줄을 누르면 고르면서 펴고 접고, 잎을 누르면 고른다 — `→` `←` 는 펴고 접기만 한다.

[그림: 플레이그라운드](../../site/components/specs/tree-view.tsx#playground)

## Anatomy

[그림: 나무는 항목 줄(꺾쇠 · 아이콘 · 이름)과 하위 묶음으로 이뤄지고, 노드 동작 ⋮ 는 패널 머리에 하나](../../site/components/specs/tree-view.tsx#anatomy)

| ⓐ Tree | 나무 — `role="tree"`, 이름 필수. `Tab` 정지점 하나. |
| ⓑ Item | 항목 — `role="treeitem"`. 줄 + 하위 묶음. |
| ⓒ Chevron | 꺾쇠 — 16, 하위가 있는 항목만. 표시만 — 누르는 자리는 줄 전체다. |
| ⓓ Icon | 앞 아이콘 — 16, 있을 때만(부서는 `building-2`). |
| ⓔ Label | 이름 — 14 / 19. 긴 이름은 줄을 바꾼다. |
| ⓕ Group | 하위 묶음 — `role="group"`, 단계마다 20 들인다. |
| ⓖ More Button | 고른 항목의 동작 ⋮ — 나무 밖(패널 머리) 하나, 이름 "{고른 항목} 더보기". |

[표: 부위](tree-view.yaml#slots)

## Properties

### 줄

줄은 Side Navigation 항목과 같다 — 높이 44(이름이 줄을 바꾸면 늘어난다), 위아래 12 · 좌우 8, 모서리 10, 이름 14 / 19 · 400 `fg-neutral`. 나무는 패널 가장자리에서 8 들어온다. 단계마다 20 을 들여 하위 꺾쇠가 부모의 꺾쇠 · 아이콘 사이에 선다 — 줄 왼쪽 여백 = 8 + (단계 − 1) × 20. 꺾쇠 칸 20 · 아이콘 16 · 이름 사이는 6 이고, 이름이 여러 줄이면 꺾쇠 · 아이콘은 첫 줄에 맞춘다. List 줄(16 / 22 · 좌우 24)보다 작은 것은 나무가 사이드바처럼 좁은 패널 안의 탐색 목록이어서다.

[그림: 줄 44 · 들임 20 · 꺾쇠 20 · 아이콘 16 · 사이 6 — 가장 긴 뿌리 이름이 줄을 바꾼다](../../site/components/specs/tree-view.tsx#row)

[표: 나무](tree-view.yaml#base.enabled@root)

[표: 줄](tree-view.yaml#base.enabled@row)

[표: 콘텐츠 층](tree-view.yaml#base.enabled@content)

[표: 아이콘](tree-view.yaml#base.enabled@icon)

[표: 이름](tree-view.yaml#base.enabled@label)

### 꺾쇠 · 펼침

하위가 있는 항목만 꺾쇠(lucide `chevron-right` 16 · `fg-neutral-subtle`)를 둔다 — 접혀 있으면 오른쪽, 펼치면 아래로 90° 돈다. 하위 묶음은 높이로 펼치고 접힌다 — 둘 다 300ms `motion-ease-easing`(Accordion 과 같다, 사용자 결정 3A), 모션 줄이기면 150ms 서서히. 하위가 없는 항목은 꺾쇠 칸을 같은 폭으로 비워 같은 단계의 이름이 같은 자리에 선다. 꺾쇠는 표시만이다 — 따로 누르는 자리를 두지 않고, 부모 줄 전체가 누르는 자리다(아래 "누르기"). 처음 펼침은 화면이 정한다 — 부서 나무는 모두 펼친 채 연다(지금과 같다).

[그림: 접힘 · 펼침 · 하위 없음 — 꺾쇠 칸 20(표시만) · 누르는 자리는 줄 전체(점선)](../../site/components/specs/tree-view.tsx#expand)

[표: 펼침](tree-view.yaml#expand)

[표: 꺾쇠](tree-view.yaml#base.enabled@chevron)

### 누르기 — 줄 전체

누르는 자리는 줄 전체(줄 폭 × 44 이상)다 — 꺾쇠만 누르는 작은 자리를 두지 않는다(2026-10-10 사용자 결정 16D — SEED Accordion "터치 영역은 Chevron 아이콘뿐만 아니라 Trigger 전체", Apache-2.0). 잎을 누르면 고른다. 부모 줄을 누르면 그 항목을 고르면서 접힌 하위는 펴고 펼친 하위는 접는다 — 꺾쇠를 눌러도 같다. `Enter` · `Space` 는 누르기와 같고, `→` `←` 는 고르지 않고 펴고 접기만 한다.

[표: 누르기](tree-view.yaml#expand@row)

### 늘 펼친 나무(`fixed`)

접지 않는 화면(부서 사용자 — 부서를 고르고 사용자를 옮기는 자리)은 꺾쇠를 그리지 않고 꺾쇠 칸도 빼며 `aria-expanded` 를 두지 않는다 — 들임만으로 단계를 보인다. `→` 는 첫 하위로, `←` 는 부모로 옮기기만 한다. 줄을 누르면(`Enter` · `Space` 도) 고르기만 한다 — 접히지 않는다. 접히지 않는데 꺾쇠 · "펼쳐짐" 이 남으면 누를 수 있는 것처럼 보인다. 줄 · 들임 · 고른 바탕은 접고 펴는 나무와 같다.

[표: 늘 펼친 나무](tree-view.yaml#mode)

### 고름

고른 항목은 Side Navigation 의 지금 항목과 같은 바탕 `bg-neutral-weak-pressed` 다(사용자 결정 2026-10-08 — 면 위 1.15 · 다크 1.56). 한 번에 하나만 고르고, 고른 항목은 마우스를 올리거나 눌러도 바탕이 그대로다(더 짙은 불투명 역할이 없다). 보조 기술에는 `aria-selected` 로 알린다.

[그림: 경영지원팀을 고른 나무 — 호버 · 누름 · 고름 · 키보드 포커스](../../site/components/specs/tree-view.tsx#selected)

[표: 고름](tree-view.yaml#selected)

[표: 고름 — 올리거나 누를 때](tree-view.yaml#states.selected)

### 노드 동작 — ⋮ 하나

노드마다 단추를 두지 않는다 — 항목 안에 단추를 넣으면 단추 안 단추가 되고 `Tab` 정지점이 늘어난다. 추가 · 수정 · 삭제는 나무 밖 패널 머리의 ⋮ 하나([Button](button.md) `ghost` · `iconOnly` · `medium` — 보이는 40 · 누르는 44 · 아이콘 18)가 고른 항목에 건다. 이름은 "{고른 부서} 더보기" — 고른 부서가 바뀌면 이름도 바뀐다. 1280 이상은 [Menu](menu.md), 미만은 [Menu Sheet](menu-sheet.md) 다. 패널 머리는 나무의 이름(제목 16 / 22 · 700 — 구역 제목과 한 벌, 글자 역할 D3)과 ⋮ 한 줄이고, 제목은 나무 줄의 글과 같은 16 에서 시작한다.

[그림: 패널 머리 "부서" + ⋮ — "경영지원팀 더보기" → 하위 부서 추가 · 수정 · 삭제](../../site/components/specs/tree-view.tsx#actions)

[표: 패널 머리](tree-view.yaml#base.enabled@header)

[표: 패널 머리 제목](tree-view.yaml#base.enabled@title)

[표: 동작 단추](tree-view.yaml#base.enabled@moreButton)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 바탕 없음 |
| `hovered` | 웹 — 누름과 같은 바탕 `bg-layer-default-pressed`(v106). 고른 항목은 그대로 |
| `focused` | 웹 — 키보드 포커스에만 줄 안쪽 링 2px · 모서리 10 |
| `pressed` | 호버와 같은 바탕 + 꺾쇠 · 아이콘 · 이름만 2px 거리 축소(v104) |

[표: 상태](tree-view.yaml#matrix@row+content+focusRing)

[표: 모션](tree-view.yaml#motion)

## Guidelines

### 언제 쓰나

| 이런 자리 | 쓰는 것 |
|---|---|
| 여러 단계에서 하나를 골라 옆에 그 내용을 본다(부서) | **Tree View** |
| 부모 · 하위 두 단계에서 줄은 편집, 하위만 접는다(카테고리) | [List](list.md) 하위 줄 — 줄 앞 꺾쇠 단추 |
| 상세를 접어 둔 항목 여럿(혜택) | [Accordion](accordion.md) |
| 화면을 옮기는 주 메뉴(HR 사이드바 — 같은 옛 부품을 쓴다) | [Side Navigation](side-navigation.md) |

[그림: 부서는 Tree View · 카테고리는 List 하위 줄 · 사이드바는 Side Navigation](../../site/components/specs/tree-view.tsx#when-guide)

### 부모 줄은 고르면서 펴고 접는다

부모 줄은 [Accordion](accordion.md) 트리거처럼 줄 전체가 누르는 자리다 — 누르면 그 부서를 고르면서 하위를 펴고 접는다. 꺾쇠만 눌러야 펴지는 나무는 누르는 자리가 31 남짓이라 손가락 · 마우스로 맞히기 어렵다. 그 대가로 펼친 부모를 고르면 하위가 접힌다 — 사용자가 알고 골랐다(16D). 하위를 편 채 부모를 고르려면 한 번 더 누르거나 `→` 로 편다. 키보드로 고르지 않고 펴고 접으려면 `→` `←` 다. 꺾쇠에 줄과 다른 일을 맡기지 않는다 — 꺾쇠를 눌러도 줄을 누른 것과 같다.

[그림: 펼친 클라우드 인프라팀을 누르면 골라지며 접히고 한 번 더 누르면 펴진다 · → 는 고르지 않고 펴기만 · 꺾쇠만 누르는 31 × 44 는 두지 않는다](../../site/components/specs/tree-view.tsx#press-guide)

### 키보드 — Tab 한 번, 화살표로

나무 전체가 `Tab` 정지점 하나다 — 들어오면 고른 항목(없으면 첫 항목)에 초점이 오고, 다시 `Tab` 하면 나무를 나간다. 부서 20개를 화살표로 다 다닌다. 화살표를 처음 쓰는 사람을 위해 나무의 이름(패널 제목)을 분명히 두고, 낭독이 단계 · 위치 · 펼침을 알린다(트리 관례).

| 키 | 동작 |
|---|---|
| `↓` · `↑` | 다음 · 앞 보이는 항목 — 끝에서 멈춘다 |
| `→` | 접힌 부모는 펼친다(초점 그대로) · 펼친 부모는 첫 하위로 · 하위 없는 항목은 그대로 — 고르지 않는다 |
| `←` | 펼친 부모는 접는다 · 그 밖에는 부모로 · 맨 위 단계는 그대로 — 고르지 않는다 |
| `Home` · `End` | 첫 항목 · 마지막 보이는 항목 |
| `Enter` · `Space` | 누르기와 같다 — 잎은 고르고, 부모는 고르면서 펴고 접는다 |

[그림: 키보드 재생 — Tab · ↓ · →(펴기) · ↓ · Enter(잎 — 고름) · ←(부모로) · Enter(부모 — 고르며 접힘) · End · Home 차례로 초점 · 읽기 · 고름 · 펼침](../../site/components/specs/tree-view.tsx#keyboard-guide)

### 이름은 줄을 바꾼다

긴 이름은 말줄임 없이 줄을 바꿔 다 보인다(사용자 결정 8A · 10A) — 가장 긴 뿌리 이름 "가람누리 디지털혁신본부 클라우드 플랫폼 운영 그룹" 도 248 패널에서 줄을 바꿔 다 읽힌다. 앞부분이 같은 부서가 말줄임으로 구별되지 않는 일을 막는다. `title` 말풍선으로 대신하지 않는다.

[그림: 248 패널 — 가장 긴 뿌리 이름 줄바꿈 · 지금 말줄임](../../site/components/specs/tree-view.tsx#wrap-guide)

### 머리말을 두지 않는다

항목마다 머리말(`h3`)을 두지 않는다 — 부서 이름은 문서의 절이 아니다. 단계 · 위치는 `aria-level` · `aria-setsize` · `aria-posinset` 이 알린다.

### 글

나무의 이름은 무엇의 나무인지("부서"), 동작 단추는 "{고른 부서} 더보기", 메뉴 줄은 동사로("하위 부서 추가" · "수정" · "삭제") 쓴다.

## 코드

레시피 `recipes/shadcn/components/ui/tree-view.tsx` 를 쓴다(새 부품). 아래 미리보기는 스펙 값으로 그린 모습이다.

- `TreeView` — 나무. `nodes`(`TreeNode[]` — `{ id, label, children? }`) · `aria-label` 또는 `aria-labelledby`(필수) · `selectedId` · `onSelectedChange(id)` · `expandedIds` · `defaultExpandedIds` · `onExpandedChange(ids)` · `icon`(모든 항목의 앞 아이콘 — 부서는 `Building2`) · `collapsible`(기본 `true` — `false` 면 늘 펼친 나무: 꺾쇠 · `aria-expanded` 없음). `role="tree"` · `treeitem`(`aria-level` · `aria-setsize` · `aria-posinset` · `aria-expanded` · `aria-selected`) · `group`, roving tabindex 와 키보드(`↑` `↓` `→` `←` `Home` `End` `Enter` `Space`)를 나무가 맡는다. 줄 전체가 누르는 자리다 — 잎은 고르고, 부모는 고르면서 펴고 접는다(`onSelectedChange` · `onExpandedChange` 가 함께 불린다, `Enter` · `Space` 도 같다). `→` `←` 는 펴고 접기만 한다. 꺾쇠는 표시만이라 따로 누르는 자리 · 이벤트가 없다. `collapsible={false}` 면 누르기는 고르기만.
- 노드 동작은 나무 밖 — [Button](button.md) `ghost` · `iconOnly` + [Menu](menu.md) 의 `ResponsiveMenu`(1280 이상 Menu · 미만 Menu Sheet).

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
| 잎 누르기 · `Enter` · `Space` | 그 항목을 고른다 — 초점도 그 항목 |
| 부모 줄 누르기 · `Enter` · `Space` | 그 항목을 고르면서 접힌 하위는 펴고 펼친 하위는 접는다 — 초점도 그 항목. 꺾쇠를 눌러도 같다(표시만) |
| 늘 펼친 나무(`fixed`)의 줄 누르기 | 고르기만 — 접히지 않는다 |
| `Tab` | 나무에 들어오면 고른 항목(없으면 첫 항목) · 다시 `Tab` 이면 나간다 |
| `↓` · `↑` · `→` · `←` · `Home` · `End` | APG Treeview — 위 키보드 표 |
| `←` 로 접어 고른 항목이 부모 안으로 숨으면 | 고름은 그대로 — 초점은 접은 부모에 |
| 모션 줄이기 | 하위 묶음이 높이 움직임 없이 150ms 서서히 · 꺾쇠는 바로 · 누름 축소 없음 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 이름 `fg-neutral` 면 위 16.41 · 다크 13.42 · 고른 바탕 위 14.26 · 8.62 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 꺾쇠 · 아이콘 `fg-neutral-subtle` 5.50 · 6.09(누름 바탕 5.18 · 4.68 · 고른 바탕 4.77 · 3.91) ✓. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓ |
| **WCAG 1.4.1** Use of color | 고른 항목은 바탕(1.15 · 다크 1.56)으로만 보인다 — Side Navigation 지금 항목과 같은 결정(2026-10-08) ⚠. 보조 기술에는 `aria-selected` |
| **WCAG 2.1.1** Keyboard | 나무에 `Tab` 하나 + 화살표 · `Home` · `End` · `Enter` · `Space` 로 모든 항목을 고르고 펼친다 ✓ — 지금 HR 의 잎 17개는 키보드로 닿지 않는다 |
| **WCAG 2.4.3** Focus order | 나무는 정지점 하나 — 들어오면 고른 항목 ✓ |
| **WCAG 2.4.7** Focus visible | 줄 안쪽 링 2px ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 줄 전체 44 이상 — 부모 줄도 줄 전체가 누르는 자리(꺾쇠는 표시만) · ⋮ 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 줄 44 ✓ · ⋮ 44 ✓ — 꺾쇠만 누르는 작은 자리를 두지 않는다(사용자 결정 16D) |
| **WCAG 4.1.2** Name, Role, Value | `tree`(이름 필수) · `treeitem`(`aria-level` · `aria-setsize` · `aria-posinset` · 부모만 `aria-expanded` · `aria-selected`) · `group` — 낭독 "경영지원팀, 트리 항목, 2단계, 3 / 15, 선택됨" ✓ |
| **ARIA** | APG Treeview — 고르기 하나(`aria-multiselectable` 없음), 고르기는 초점을 따르지 않는다 — 누르기 · `Enter` · `Space` 로 고르고, 부모는 함께 펴고 접는다(APG — "부모 노드의 기본 동작은 열고 닫기일 수 있다"). `→` `←` 는 펴고 접기만. 머리말 · 항목 안 단추 없음. 늘 펼친 나무는 `aria-expanded` 를 두지 않는다. 아이콘은 `aria-hidden` |
| **Reduced motion** | 하위 묶음은 150ms 서서히(v104) · 꺾쇠는 바로 · 누름 축소 없음 |

## Do / Don't

### ✅ Do

- 여러 단계에서 하나를 고르는 자리에 — 고른 내용은 옆 패널에.
- 나무는 `Tab` 하나 + 화살표 — 줄 전체를 누르는 자리로(부모는 고르면서 펴고 접기), `→` `←` 는 펴고 접기만.
- 노드 동작은 나무 밖 ⋮ 하나 — 이름은 "{고른 항목} 더보기".
- 긴 이름은 줄을 바꿔 다 보인다.

### ❌ Don't

- 꺾쇠만 누르는 작은 자리(31 × 44) · 꺾쇠와 줄에 다른 일을 맡기기.
- 잎을 `div` 로 두어 키보드로 닿지 않게 · 노드마다 루트를 따로 두어 화살표가 다음 노드로 가지 않게.
- 항목마다 머리말 · 항목 안에 단추(단추 안 단추).
- 이름 말줄임 · `title` 로 대신하기.
- 접지 않는 나무에 꺾쇠 · `aria-expanded` 를 남기기.

## Specification

`tree-view.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹이 Tree View 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — tree-view.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#tree-view)

## SEED 와 다른 점

- **SEED 에는 나무가 없다** — Accordion 은 중첩 · 고르기를 다루지 않는다. 키보드 · 역할은 WAI-ARIA APG Treeview 이고, 줄의 값은 groo 의 Side Navigation 항목 · List 누름이다.
- **들임 20 · 꺾쇠 16 · 고른 바탕** — groo 가 정했다(비교 페이지 8A 그림 · Side Navigation 지금 항목).
- **줄 전체가 누르는 자리** — SEED Accordion 의 "터치 영역은 Chevron 아이콘뿐만 아니라 Trigger 전체" 를 나무 줄에 옮겼다(16D). Accordion 줄은 여닫기만 하지만 나무 줄은 고르기도 한다 — 부모 줄은 고르면서 펴고 접는다.

## Migration notes

### 2026-10-22 — 예시 부서 이름

가장 긴 뿌리 이름의 예가 옛 그룹 이름을 쓰고 있었다 — 지어낸 이름 "가람누리 디지털혁신본부 클라우드 플랫폼 운영 그룹" 으로 바꿨다(글자 수 같음 — 줄바꿈 그림은 그대로). 사이트 그림(`collapse-data.ts`) · 레시피 예제(tree-view · resizable) · 미리보기도 같이. 값 변경 없음.

### 2026-10-16 — 패널 머리 제목 16(글자 역할 D3)

사용자가 [글자 역할 비교 페이지](https://claude.ai/artifact/X9n6tDZbKSP7GeLtodtz8N)에서 카드 밖 구역 제목을 카드 머리와 같은 16 / 22 · 700 · `fg-neutral` 한 벌로 정했다(D3 B — List Header 14(A) · 18(C)은 고르지 않았다). 나무 패널 머리 제목도 그 한 벌이라 18 / 24 → 16 / 22 다(DESIGN.md Typography 의 "글자 역할" R4). 옛 스펙은 `tree-view.history/v-pre-text-roles.*`.

### 2026-10-10 — 새로 둔다(APG Treeview)

사용자가 [펼치고 접기 · 나누기 비교 페이지](https://claude.ai/artifact/9uvjeFyjFXc7TaWnpnnQ6H)에서 정했다 — HR 부서 나무는 APG 트리(8A — `Tab` 한 번 · `↑` `↓` · `→` `←` 펼치고 접기 · `Enter` 고르기 · 고르기와 펼치기 따로 · `tree` / `treeitem` / `aria-level` · 머리말 없음 · 노드 동작은 ⋮ 하나), 긴 이름은 줄바꿈(10A), 펼침은 300ms(3A). List 줄 + 꺾쇠 단추(8B — 부모 줄은 `Tab` 이 두 번, 단계가 낭독되지 않는다)와 지금 그대로(8C)는 고르지 않았다. 비교 페이지의 나무 그림은 하위 묶음을 바로 펼쳤는데, 이 스펙은 꺾쇠와 같은 300ms 로 펼친다(3A — 모든 펼침). DESIGN.md 의 옛 Treeview 절(v73 — 고름 = `surface-input` + 왼쪽 브랜드 2px · 여럿 고르기 · 끌어서 옮기기 · 가계부 카테고리 나무)은 이 스펙과 List 하위 줄로 바꿨다.

같은 날 스펙을 쓰다 나온 질문(같은 비교 페이지 16번)에서 부모 줄의 누르는 자리를 정했다 — 줄 전체 = 접고 펴기 + 고르기(16D). 사용자 질문 "아이콘만 클릭 자리로 만드는 게 아니라 한 줄 자체를 접고 펴는 자리로 만들어 버리면 44 문제가 해결되지 않니? SEED 디자인 시스템에서 이런 거에 대한 스펙 정해진 걸 본 거 같은데" 에서 나온 안이고, SEED Accordion 가이드 "터치 영역은 Chevron 아이콘뿐만 아니라 Trigger 전체를 포함합니다" 가 그 스펙이다. 펼친 부모를 고르면 하위가 접히는 것을 알고 골랐다 — 8A 의 "고르기와 펼치기 따로 · 부모를 골라도 접히지 않음" 을 이 자리만 바꾼다. 꺾쇠는 표시만이고, `→` `←` 펼치고 접기 · `↑` `↓` · `Home` `End` · 한 번 `Tab` · 잎 고르기 · 이름 줄바꿈 · 머리말 없음 · ⋮ 하나는 8A 그대로다. `Enter` · `Space` 는 누르기와 같게 했다(부모는 고르면서 펴고 접는다 — 누르기 · 화면 낭독기의 두 번 탭 · 키보드가 같은 일을 한다). 꺾쇠만 누르는 31 × 44(16A) · 꺾쇠 칸 44(16B) · 들임 빈 자리로 44(16C) · 줄은 고르고 접힌 부모만 펴기(16E — 추천)는 고르지 않았다.

제품은 앱 적용 단계에서 옮긴다(2026-10-09 조사 — HR 은 렌더로 쟀다). 부서 나무는 HR 관리 > 회사 · 부서 사용자 두 곳이고, 같은 `treeView.tsx` 를 쓰는 사이드바는 [Side Navigation](side-navigation.md) 이 다룬다.

- **잎 키보드 0 · 단추 안 단추** — 노드마다 Radix Accordion 루트가 하나라 `↓` 가 다음 노드로 가지 않고, 잎 17개는 `div` onClick 이라 `Tab` 이 닿지 않는다. 부모를 누르면 고르면서 하위를 접는 지금 동작은 남긴다(16D) — 줄 전체가 그 일을 하는 트리 항목이 된다. 부모가 모두 `<h3>` 이고 노드 동작(추가 · 수정 · 삭제 `div role=button` 24 × 24)이 트리거 단추 안에 있다(`shared/ui/shadcn/treeView.tsx:203 · 299-357 · 416-471` · `features/admin-company/ui/DepartmentTreePanel.tsx:120-150`, D3). `role=tree` 안에 `treeitem` 이 없고 하위마다 `tree` 가 중첩된다.
- **줄 32 · 꺾쇠 1.88** — 줄 32 · 안쪽 0 / 8 · 14 / 400, 꺾쇠 `sidebar-foreground/50` #B9B9B9 가 흰 바탕 1.88(다크 3.95), 하위 들임 24(`ml-3.5 pl-2.5`) + 안내 선 1px(1.23 · 1.34)이다(조사 §3.4 · §7.2 — 44 미만). 줄 44 · 꺾쇠 `fg-neutral-subtle` · 들임 20 · 안내 선 없음으로.
- **이름 말줄임** — 긴 뿌리 이름(조사 데이터 — 공백 빼고 22자)이 298px 중 207px 만 보이고 `title` 도 없다(`treeView.tsx:335`, D12). 줄바꿈으로.
- **늘 펼친 나무** — 부서 사용자 화면(`disableCollapse`)은 꺾쇠가 아래로 고정되고 `aria-expanded=true` 가 남는데 접히지 않는다(`treeView.tsx:270 · 327 · 462-471`, D23). 꺾쇠 · `aria-expanded` 를 걷고 들임만.
- **움직임** — 하위 펼침이 `accordion-down/up` 200ms 이고 모션 줄이기에서도 그대로 돈다(D9). 300ms · 줄이기면 150ms 서서히로.
