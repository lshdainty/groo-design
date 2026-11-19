# Icon Picker

> 카테고리 · 저축 목표에 붙일 아이콘을 고르는 칸입니다. [Input Button](input-button.md) 이 고른 세트(148개 · 13 묶음)의 격자를 시트(1280 미만) · 팝오버(1280 이상)로 열고, 한국어 이름 · 찾는 말로 찾습니다. 고른 아이콘은 [List](list.md) 의 카테고리 타일(40 · 아이콘 20)에 그립니다.

lucide 전체를 열지 않고 카테고리에 쓸 아이콘만 묶음으로 둡니다. 칸 · 고른 표시 · 키보드 · 한국어 찾기는 아래에 적습니다.

수치 원본은 [`icon-picker.yaml`](icon-picker.yaml)이고, 아이콘 세트는 [`category-icons.yaml`](category-icons.yaml)(148개 · 13 묶음 — 이름 · 찾는 말)입니다. 트리거 · 시트 · 팝오버 · 찾기 칸의 나머지 값은 각 스펙이 원본입니다.

[그림: 카테고리 추가 — 아이콘 칸을 누르면 시트(폰) · 팝오버(데스크톱), 라이트 · 다크](../../site/components/specs/icon-picker.tsx#hero)

### 직접 골라 보기

찾는 말("커피" · "월세" · "고양이") · 여는 자리(시트 · 팝오버) · 지금 아이콘을 고르면 스펙대로 그린 격자와 그 코드가 바뀝니다. 격자에 초점을 두고 ← → ↑ ↓ 로 묶음을 넘어 옮기고 `Enter` 로 고를 수 있습니다 — 화면 읽기 프로그램이 읽는 말("커피, 선택됨")과 결과 수 알림이 함께 바뀝니다.

[그림: 플레이그라운드](../../site/components/specs/icon-picker.tsx#playground)

## Anatomy

[그림: 트리거(라벨 · 지금 아이콘 · 이름) · 시트 · 찾기 칸 · 묶음 머리 · 칸 48 · 고른 칸](../../site/components/specs/icon-picker.tsx#anatomy)

| ⓐ Trigger | 트리거 — Input Button(줄 칸 폼에서는 줄 — 아래 "트리거")입니다. 라벨 "아이콘", 앞에 지금 아이콘, 값은 그 이름("커피")입니다. |
| ⓑ Surface | 여는 자리 — 1280 미만 Bottom Sheet("아이콘") · 이상 Popover. |
| ⓒ Search | 찾기 칸 — Input 밑줄형 · 앞 돋보기 · 지우기, 위에 붙습니다. |
| ⓓ Group Header | 묶음 머리 — "식비" · "카페" … 찾는 동안은 없습니다. |
| ⓔ Cell | 칸 — 48 · 아이콘 24. 이름은 한국어 이름입니다. |
| ⓕ Selected | 고른 칸 — 안쪽 2px 짙은 테두리 + 선 2.5. |

[표: 부위](icon-picker.yaml#slots)

## Properties

### 트리거 — Input Button

트리거는 [Input Button](input-button.md) 입니다 — 라벨 "아이콘"([Field](field.md)), 앞 붙이개에 지금 아이콘(large 20 · medium 16), 값에 그 아이콘의 한국어 이름("커피"), 뒤에 아래 화살표를 둡니다. 이름은 "아이콘, 커피" 로 읽힙니다. 아이콘이 없는 항목은 태그 + "태그", 세트 밖 아이콘이 저장된 항목은 그 아이콘 + "지금 아이콘" 입니다. 크기는 반응형(1280 미만 large 52 · 이상 medium 40)이고 앱은 large 입니다.

폼이 줄 칸 문법(치는 값은 칸 · 고르는 값은 줄)이면 트리거는 Input Button 이 아니라 줄입니다 — 줄 제목 "아이콘", 값 자리에 지금 아이콘 + 한국어 이름(세트 밖은 "지금 아이콘")을 두고, 누르면 아래 "여는 자리" 가 그대로 열립니다(색 줄과 같은 방식).

[그림: 트리거 — "아이콘" · 커피 아이콘 + "커피" · 아래 화살표, large · medium](../../site/components/specs/icon-picker.tsx#trigger)

[표: 트리거](icon-picker.yaml#base.enabled@trigger)

### 여는 자리

1280 미만 · 앱은 [Bottom Sheet](bottom-sheet.md)(제목 "아이콘" · 닫기), 1280 이상은 [Popover](popover.md)(머리 없이 · 이름 "아이콘" · 폭 408)입니다(Input Button 의 경계). 고르면 바로 닫힙니다 — "완료" 를 두지 않습니다(Input Button 의 "목록은 누르면 바로").

[그림: 폰 시트 6열 · 데스크톱 팝오버 7열](../../site/components/specs/icon-picker.tsx#surface)

[표: 여는 자리](icon-picker.yaml#surface)

### 세트 — 148개 · 13 묶음

고를 수 있는 것은 [`category-icons.yaml`](category-icons.yaml) 의 세트뿐입니다 — 카테고리에 쓸 만한 lucide 아이콘 148개를 13 묶음으로 나누고 아이콘마다 한국어 이름과 찾는 말을 둡니다. 서버가 심는 기본 카테고리 11개의 아이콘과 기본값(태그 · 저축 목표의 돼지저금통)을 모두 담습니다. 아이콘 이름은 웹(lucide-react 1.28.0)과 앱(lucide_icons_flutter 3.1.15)에 모두 있는 것만 씁니다.

| 묶음 | 수 | 예 |
|---|---|---|
| 식비 | 23 | 식사 · 외식 · 요리 · 치킨 · 빵 · 과일 · 장보기 |
| 카페 | 7 | 커피 · 음료 · 맥주 · 원두 |
| 교통 | 12 | 버스 · 지하철 · 택시 · 주유 · 주차 · 비행기 |
| 주거 | 14 | 집 · 아파트 · 전기 · 수도 · 가스 · 인터넷 · 휴대폰 |
| 생활 | 15 | 생활용품 · 세탁 · 미용 · 택배 · 육아 · 강아지 · 고양이 |
| 쇼핑 | 12 | 쇼핑 · 옷 · 선물 · 전자기기 · 책 |
| 건강 | 10 | 병원 · 약 · 운동 · 건강 · 치과 |
| 금융 | 16 | 지갑 · 현금 · 저금 · 카드 · 은행 · 투자 · 대출 · 보험 · 이체 · 구독 |
| 여가 | 15 | 영화 · 음악 · 게임 · 공연 · 캠핑 · 수영 |
| 여행 | 6 | 여행 · 숙소 · 관광 · 해외 |
| 교육 | 6 | 교육 · 학교 · 공부 · 어학 |
| 경조사 | 6 | 생일 · 경조사 · 기부 · 모임 · 종교 |
| 기타 | 6 | 태그 · 별 · 책갈피 · 상자 · 폴더 · 그 밖 |

[그림: 세트 전체 — 13 묶음 148개, 이름과 함께](../../site/components/specs/icon-picker.tsx#set)

### 격자 · 칸

칸은 48 · 모서리 12 · 아이콘 24(`fg-neutral` · 선 2)이고, 놓인 폭에 들어가는 만큼 열을 둡니다 — 칸 사이 최소 4, 남는 폭은 칸 사이에 고르게(폰 시트 6열 · 팝오버 7열), 줄 사이 4. 묶음마다 머리(14 · 500 · `fg-neutral-subtle` — List Header `mediumWeak`)를 위 12 · 아래 8 에 둡니다. 칸 48 이 곧 누르는 영역입니다 — 24 아이콘에는 44 이상의 누르는 영역을 두기 때문입니다.

[그림: 칸 48 · 아이콘 24 · 사이 · 묶음 머리 — 폰 342 · 팝오버 360](../../site/components/specs/icon-picker.tsx#grid)

[표: 격자](icon-picker.yaml#base.enabled@grid)

[표: 칸](icon-picker.yaml#base.enabled@cell)

[표: 칸 아이콘](icon-picker.yaml#base.enabled@icon)

[표: 묶음 머리](icon-picker.yaml#base.enabled@groupHeader)

### 고른 표시

지금 값의 칸은 안쪽에 2px 짙은 테두리(`stroke-neutral-contrast`)를 덧그리고 아이콘을 선 2.5 로 둡니다 — [Select Box](select-box.md) 의 고른 상자와 같은 표시입니다. 바탕은 칠하지 않아 아이콘의 모양 · 색이 그대로 보입니다. 열면 고른 칸이 보이게 스크롤합니다.

[그림: 고른 칸 — 안쪽 2px 짙은 테두리 · 선 2.5, 라이트 · 다크](../../site/components/specs/icon-picker.tsx#selected)

[표: 고름](icon-picker.yaml#selected)

### 찾기

찾기 칸은 [Input](input.md) 밑줄형입니다 — 시트 large 40 · 팝오버 medium 34, 앞 돋보기 · 지우기, placeholder "아이콘 이름 검색", 이름 "아이콘 검색". 치는 대로 세트를 거릅니다 — 찾는 말과 이름 · 찾는 말 · lucide 이름을 소문자로 바꾸고 공백을 뺀 뒤 부분 일치입니다("커피" → 커피 · 원두, "월세" → 집, "coffee" → 커피). 결과는 세트 차례 그대로 묶음 머리 없이 늘어놓고, 개수는 화면 밖으로 알립니다("검색 결과 2개"). 0건이면 격자 자리에 [Result Section](result-section.md) `medium` — "'{검색어}'에 대한 아이콘이 없어요" 를 둡니다.

[그림: "커피" → 커피 · 원두 · "월세" → 집 · "유니콘" → 결과 없음](../../site/components/specs/icon-picker.tsx#search)

[표: 찾기 칸](icon-picker.yaml#base.enabled@search)

[표: 결과 수](icon-picker.yaml#base.enabled@count)

[표: 결과 없음](icon-picker.yaml#base.enabled@empty)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 칸 바탕 없음 |
| `hovered` | 웹 — 누름과 같은 바탕 `bg-layer-floating-pressed` |
| `focused` | 키보드 포커스 — 칸 바깥 링 2px · 띄움 2px. 격자에 Tab 하나(고른 칸, 없으면 첫 칸) |
| `pressed` | 같은 바탕 + 칸 2px 거리 축소. 손을 떼면 고르고 닫힙니다 |

트리거의 상태(누름 · 오류 · 막힘 · 읽기 전용)는 [Input Button](input-button.md) 그대로입니다.

[그림: 상태 — 기본 · 호버 · 포커스 · 누름 × 안 고름 · 고름](../../site/components/specs/icon-picker.tsx#states)

[표: 상태 — 안 고름](icon-picker.yaml#matrix)

[표: 상태 — 고름](icon-picker.yaml#matrix.selected.selected)

[표: 모션](icon-picker.yaml#motion)

## Guidelines

### 고른 세트만 엽니다

lucide 전체를 열지 않습니다 — 첫 화면이 "a-arrow-down …" 이 되고, 2,000개는 사실상 찾기로만 고르기 때문입니다. 세트에 없는 아이콘이 필요하면 [`category-icons.yaml`](category-icons.yaml) 에 묶음 · 이름 · 찾는 말과 함께 더합니다 — 웹 · 앱 둘 다에 있는 lucide 이름이어야 합니다.

[그림: 세트 첫 화면(식비 · 카페 …) · 전체 첫 화면(a-arrow-down …)](../../site/components/specs/icon-picker.tsx#scope-guide)

### 한국어로 찾습니다

이름은 한국어 하나("커피"), 찾는 말은 사람들이 그 아이콘을 부를 말("카페 · 아메리카노 · 라떼")입니다. 이름은 칸의 이름(보조 기술 · 툴팁)과 트리거의 값 글로 씁니다 — 영어 lucide 이름("coffee")을 화면에 내지 않습니다. 이름 · 찾는 말은 번역 문구에 둡니다.

[그림: 칸 이름 — "커피" · 영어 이름 "a-arrow-down"](../../site/components/specs/icon-picker.tsx#name-guide)

### 기본은 태그 — "없음" 은 두지 않습니다

"없음" 을 고르는 칸을 두지 않습니다 — 아이콘이 없는 카테고리는 어차피 태그 아이콘 하나로 그리기 때문입니다(List 와 같습니다). 새 항목은 기본 아이콘을 골라 둔 채 엽니다 — 카테고리는 태그(`tag`), 저축 목표처럼 쓰는 자리에 맞는 기본이 있으면(저축 목표는 돼지저금통) 그것입니다. 이미 `""` · `null` 로 저장된 항목은 태그로 그리고, 트리거에도 태그 + "태그" 로 보입니다.

### 세트 밖 아이콘은 그대로

세트 밖 아이콘으로 저장된 항목은 지우지도 바꾸지도 않습니다 — 그대로 그립니다(웹 `DynamicIcon` · 앱 `lucideByName`). 트리거는 그 아이콘 + "지금 아이콘" 이고 격자에는 고른 칸이 없습니다. 격자에서 고르면 그 아이콘으로 바뀌고, 고르지 않고 닫으면 그대로입니다. 같은 아이콘의 다른 lucide 이름은 `lucideAliases` 로 세트 아이콘에 잇습니다 — 서버가 심은 `home` 은 세트의 `house`(집), `waves` 는 `waves-horizontal`(수영)로 보입니다.

### 키보드 — 2차원

격자는 칸마다 Tab 이 서지 않습니다 — 격자에 Tab 하나(고른 칸, 없으면 첫 칸)로 들어와 화살표로 옮깁니다. ← → 는 차례대로(줄 끝에서 다음 줄 · 다음 묶음으로), ↑ ↓ 는 보이는 위아래 줄의 가장 가까운 칸(묶음 머리를 넘습니다), Home · End 는 그 줄의 처음 · 끝, `Enter` · `Space` 로 고릅니다. 찾기 칸에서 ↓ 는 격자의 첫 칸으로 갑니다. 열면 초점은 고른 칸(없으면 첫 칸)입니다 — 폰에서 키보드가 올라와 격자를 가리지 않게, 찾기 칸은 눌러야 칩니다.

[그림: 직접 눌러 보기 — 커피에서 ↓ → 교통 묶음의 같은 열](../../site/components/specs/icon-picker.tsx#keyboard)

### 언제 쓰나

| 이런 자리 | 쓰는 것 |
|---|---|
| 카테고리 · 저축 목표에 아이콘을 붙인다 | **Icon Picker** |
| 아이콘을 보이기만 한다 | [List](list.md) 의 카테고리 타일 |
| 색을 붙인다 | [Color Swatch](color-swatch.md) |

### 글

라벨 "아이콘", 시트 제목 "아이콘", 찾기 칸 placeholder "아이콘 이름 검색"(마침표 없이), 결과 없음 제목 "'{검색어}'에 대한 아이콘이 없어요" · 설명 "다른 말로 찾거나 묶음에서 골라주세요." 를 씁니다. 결과 수는 "검색 결과 2개" 로 읽힙니다.

## 코드

레시피 `recipes/shadcn/components/ui/icon-picker.tsx` 를 [Field](field.md) 안에 둡니다 — 트리거는 레시피 `input-button.tsx`(InputButton · `useInputButtonSurface`), 시트 · 팝오버는 `bottom-sheet.tsx` · `popover.tsx`, 찾기 칸은 `input.tsx` 입니다. 세트는 `recipes/shadcn/lib/category-icons.ts` — `category-icons.yaml` 에서 `scripts/gen-category-icons.mjs` 가 만든 표(`npm run gen:category-icons` — `institution-colors` 와 같은 틀, `npm run verify` 의 `check:category-icons` 가 어긋나면 멈춥니다)와 찾기 함수입니다. 세트 밖에 저장된 아이콘은 lucide 의 `DynamicIcon` 으로 그리고, lucide 에도 없는 이름이면 기본 태그로 그립니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `IconPicker` — 트리거 + 여는 자리 + 찾기 + 격자. `value`(저장된 lucide 이름 — `null` · `""` 이면 태그) · `onValueChange(id)`(고르면 — 닫는 것은 스스로 한다) · `size`(트리거 — `"responsive"` 기본 · `"large"` · `"medium"`) · `disabled` · `id`. Field 안이면 라벨이 이름이 되고 오류 · 막힘을 받습니다(Input Button). 2차원 화살표 · 결과 수 알림 · 결과 없음 · 고른 칸 스크롤을 스스로 합니다.
- `category-icons.ts` — `CATEGORY_ICONS`(세트 — `{ id, group, name, aliases, lucideAliases? }`) · `CATEGORY_ICON_GROUPS`(묶음 차례) · `DEFAULT_CATEGORY_ICON`(`"tag"`) · `findCategoryIcon(id)`(id 또는 `lucideAliases` 로 찾습니다 — 세트 밖이면 `null`) · `searchCategoryIcons(query)`(이름 · 찾는 말 · id 부분 일치, 세트 차례).

### 카테고리 — 아이콘

[그림: 카테고리 추가 — 아이콘 칸 · 시트의 격자](../../site/components/specs/icon-picker.tsx#ex-basic)

```tsx
import { useState } from "react"
import { Field } from "@/components/ui/field"
import { IconPicker } from "@/components/ui/icon-picker"
import { DEFAULT_CATEGORY_ICON } from "@/lib/category-icons"

const [icon, setIcon] = useState<string>(category?.icon || DEFAULT_CATEGORY_ICON) // 새 카테고리는 태그로 시작

<Field label="아이콘">
  <IconPicker value={icon} onValueChange={setIcon} />
</Field>
```

### 이름 찾기 · 세트 밖 아이콘

[그림: 트리거 값 — 세트 안 "커피" · 세트 밖 "지금 아이콘"](../../site/components/specs/icon-picker.tsx#ex-name)

```tsx
import { findCategoryIcon, searchCategoryIcons } from "@/lib/category-icons"

findCategoryIcon("coffee")?.name // "커피"
findCategoryIcon("home")?.id // "house" — 서버 시드의 옛 이름
findCategoryIcon("a-arrow-down") // null — 세트 밖, 트리거는 "지금 아이콘"
searchCategoryIcons("월세").map((it) => it.name) // ["집"]
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 트리거 누르기 · `Enter` · `Space` | 1280 미만 시트 · 이상 팝오버를 엽니다. 초점은 고른 칸(없으면 첫 칸), 고른 칸이 보이게 스크롤 |
| 칸 누르기 · `Enter` · `Space` | 그 아이콘을 고르고(`onValueChange`) 닫습니다 — 초점은 트리거로 |
| `←` `→` · `↑` `↓` · `Home` · `End` | 격자 안에서 옮깁니다(고르지 않습니다) — 2차원, 묶음을 넘습니다 |
| `Tab` | 격자에 한 번 — 찾기 칸 ↔ 격자 ↔ (시트) 닫기 |
| 찾기 칸에 치기 | 치는 대로 거릅니다 — 결과 수를 한 번 알리고, 0건은 Result Section |
| 찾기 칸에서 `↓` | 격자의 첫 칸으로 |
| `Esc` | 찾는 말이 있으면 지우고, 비었으면 닫습니다(값은 그대로) — 초점은 트리거로 |
| 글자 크기 설정 | 묶음 머리 · 찾기 칸 글은 글자 크기 설정을 따라 커지고, 찾기 칸은 높이가 따라 늘어납니다. 칸 · 칸 아이콘은 px 로 그대로라 격자의 열 수가 바뀌지 않습니다. |
| 바깥 누르기 · 끌어내리기 | 닫습니다 — 값은 그대로 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 묶음 머리 `fg-neutral-subtle` 시트 · 팝오버 위 5.50 · 다크 5.27 ✓. 트리거 · 찾기 칸은 Input Button · Input 의 검증 |
| **WCAG 1.4.4** Resize text | 묶음 머리 · 찾기 칸 글이 글자 크기 설정을 따라 커집니다 ✓. 칸 아이콘은 글이 아니라 크기를 그대로 두고, 아이콘 이름은 칸 이름으로 읽습니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 칸 아이콘 `fg-neutral` 16.41 · 다크 11.62, 고른 테두리 `stroke-neutral-contrast` 16.41 · 11.62 ✓. 호버 · 누름 바탕은 장식(고름은 테두리 · 굵기로) |
| **WCAG 1.4.1** Use of color | 고른 칸은 테두리 · 선 굵기로 알립니다 — 색만이 아닙니다 ✓ |
| **WCAG 2.1.1** Keyboard | 격자 2차원 화살표 · `Enter` · `Space` · `Esc` ✓ — 칸마다 `Tab` 이 서지 않습니다 |
| **WCAG 4.1.3** Status messages | 결과 수 · 결과 없음을 `aria-live="polite"` · `role="status"` 로 한 번 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 칸 48 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 칸 48 ✓ · 트리거 large 52 ✓(medium 40 은 1280 이상 데스크톱 웹만) |
| **ARIA** | 트리거 `<button>` · `aria-haspopup="dialog"` · `aria-expanded` · 이름 "아이콘, 커피"(Field 라벨 + 값). 시트 · 팝오버 `role="dialog"` · 이름 "아이콘". 격자 `role="listbox"` · 이름 "아이콘", 묶음 `role="group"` · `aria-labelledby`(머리), 칸 `role="option"` · `aria-selected` · 이름 = 한국어 이름 · roving `tabindex`. 칸 아이콘은 `aria-hidden`. 앱은 칸마다 `Semantics(selected: …, label: "커피", button: true)` + 키보드 포커스 |

## Do / Don't

### ✅ Do

- 고른 세트(category-icons.yaml)만 묶음으로 엽니다.
- 한국어 이름 · 찾는 말로 찾고, 칸 이름도 한국어로.
- 칸 48 · 아이콘 24, 고른 칸은 안쪽 2px 짙은 테두리.
- 트리거는 Input Button — 지금 아이콘 + 그 이름.
- 1280 미만은 시트, 이상은 팝오버 — 고르면 바로 닫습니다.
- 격자는 2차원 화살표, 결과 수를 알립니다.

### ❌ Don't

- lucide 전체를 열기 · 영어 이름으로만 찾기.
- "없음" 칸 · 빈 아이콘 저장.
- 칸 32 · 아이콘 16 · 고른 칸을 반전 · 브랜드 색으로.
- 칸마다 `Tab` · 폰에서 팝오버.
- 세트 밖으로 저장된 아이콘을 몰래 바꾸기.
- 트리거에 아이콘만 두고 이름을 빼기.

## Specification

`icon-picker.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Icon Picker 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적었습니다. 세트는 `category-icons.yaml`, 트리거 · 시트 · 팝오버 · 찾기 칸의 나머지 값은 각 스펙의 YAML 입니다.

[그림: Specification — icon-picker.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#icon-picker)
