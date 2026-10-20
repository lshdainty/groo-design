# Icon Picker

> 카테고리 · 저축 목표에 붙일 아이콘을 고르는 칸 — [Input Button](input-button.md) 이 고른 세트(148개 · 13 묶음)의 격자를 시트(1280 미만) · 팝오버(1280 이상)로 열고, 한국어 이름 · 찾는 말로 찾는다. 고른 아이콘은 [List](list.md) 의 카테고리 타일(40 · 아이콘 20)에 그린다.

SEED 에는 아이콘을 고르는 부품이 없다 — SEED 팀이 만든 아이콘 격자는 문서 사이트의 Icon Library(칸 ≈ 60 · 사이 16 · 아이콘 24, 칸마다 Tab)뿐이고 제품 부품이 아니다. 원칙은 Iconography 의 "당근의 모노크롬, 멀티컬러 아이콘은 총 300여개 … 가능한 현재 제작된 범위 내에서 사용하는 것을 권장" 과 "24px 크기에서는 44px 이상의 여백을 권장" 이다(당근 SEED, Apache-2.0). groo 는 lucide 전체(2,007)를 열지 않고 카테고리용 세트를 묶음으로 두고, 칸 · 고른 표시 · 키보드 · 한국어 찾기를 정했다(2026-10-09 사용자 결정). 옛 Icon Picker 스펙(40 정사각 트리거 · 팝오버 320 · 8열 × 32 · 영어 이름 찾기 · 고른 칸 브랜드 채움)을 대신한다.

수치 원본은 [`icon-picker.yaml`](icon-picker.yaml)이고, 아이콘 세트는 [`category-icons.yaml`](category-icons.yaml)(148개 · 13 묶음 — 이름 · 찾는 말)이다. 트리거 · 시트 · 팝오버 · 찾기 칸의 나머지 값은 각 스펙이 원본이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 카테고리 추가 — 아이콘 칸을 누르면 시트(폰) · 팝오버(데스크톱), 라이트 · 다크](../../site/components/specs/icon-picker.tsx#hero)

### 직접 골라 보기

찾는 말("커피" · "월세" · "고양이") · 여는 자리(시트 · 팝오버) · 지금 아이콘을 고르면 스펙대로 그린 격자와 그 코드가 바뀐다. 격자에 초점을 두고 ← → ↑ ↓ 로 묶음을 넘어 옮기고 `Enter` 로 고를 수 있다 — 화면 읽기 프로그램이 읽는 말("커피, 선택됨")과 결과 수 알림이 함께 바뀐다.

[그림: 플레이그라운드](../../site/components/specs/icon-picker.tsx#playground)

## Anatomy

[그림: 트리거(라벨 · 지금 아이콘 · 이름) · 시트 · 찾기 칸 · 묶음 머리 · 칸 48 · 고른 칸](../../site/components/specs/icon-picker.tsx#anatomy)

| ⓐ Trigger | 트리거 — Input Button. 라벨 "아이콘", 앞에 지금 아이콘, 값은 그 이름("커피"). |
| ⓑ Surface | 여는 자리 — 1280 미만 Bottom Sheet("아이콘") · 이상 Popover. |
| ⓒ Search | 찾기 칸 — Input 밑줄형 · 앞 돋보기 · 지우기, 위에 붙는다. |
| ⓓ Group Header | 묶음 머리 — "식비" · "카페" … 찾는 동안은 없다. |
| ⓔ Cell | 칸 — 48 · 아이콘 24. 이름은 한국어 이름. |
| ⓕ Selected | 고른 칸 — 안쪽 2px 짙은 테두리 + 선 2.5. |

[표: 부위](icon-picker.yaml#slots)

## Properties

### 트리거 — Input Button

트리거는 [Input Button](input-button.md) 이다 — 라벨 "아이콘"([Field](field.md)), 앞 붙이개에 지금 아이콘(large 20 · medium 16), 값에 그 아이콘의 한국어 이름("커피"), 뒤에 아래 화살표(사용자 결정 — 2026-10-01 Input Button). 이름은 "아이콘, 커피" 로 읽힌다. 아이콘이 없는 항목은 태그 + "태그", 세트 밖 아이콘이 저장된 항목은 그 아이콘 + "지금 아이콘" 이다. 크기는 반응형(1280 미만 large 52 · 이상 medium 40)이고 앱은 large 다.

[그림: 트리거 — "아이콘" · 커피 아이콘 + "커피" · 아래 화살표, large · medium](../../site/components/specs/icon-picker.tsx#trigger)

[표: 트리거](icon-picker.yaml#base.enabled@trigger)

### 여는 자리

1280 미만 · 앱은 [Bottom Sheet](bottom-sheet.md)(제목 "아이콘" · 닫기), 1280 이상은 [Popover](popover.md)(머리 없이 · 이름 "아이콘" · 폭 408)다(Input Button 의 경계). 고르면 바로 닫힌다 — "완료" 를 두지 않는다(Input Button 의 "목록은 누르면 바로").

[그림: 폰 시트 6열 · 데스크톱 팝오버 7열](../../site/components/specs/icon-picker.tsx#surface)

[표: 여는 자리](icon-picker.yaml#surface)

### 세트 — 148개 · 13 묶음

고를 수 있는 것은 [`category-icons.yaml`](category-icons.yaml) 의 세트뿐이다 — 카테고리에 쓸 만한 lucide 아이콘 148개를 13 묶음으로 나누고 아이콘마다 한국어 이름과 찾는 말을 두었다(사용자 결정 15A — 비교 페이지의 초안을 다듬었다). 서버가 심는 기본 카테고리 11개의 아이콘과 기본값(태그 · 저축 목표의 돼지저금통)을 모두 담는다. 아이콘 이름은 웹(lucide-react 1.28.0)과 앱(lucide_icons_flutter 3.1.15)에 모두 있는 것만 썼다.

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

칸은 48 · 모서리 12 · 아이콘 24(`fg-neutral` · 선 2)이고, 놓인 폭에 들어가는 만큼 열을 둔다 — 칸 사이 최소 4, 남는 폭은 칸 사이에 고르게(폰 시트 6열 · 팝오버 7열), 줄 사이 4(사용자 결정 17A). 묶음마다 머리(14 · 500 · `fg-neutral-subtle` — List Header `mediumWeak`)를 위 12 · 아래 8 에 둔다. 칸 48 이 곧 누르는 영역이다(SEED Iconography 의 "24px 크기에서는 44px 이상").

[그림: 칸 48 · 아이콘 24 · 사이 · 묶음 머리 — 폰 342 · 팝오버 360](../../site/components/specs/icon-picker.tsx#grid)

[표: 격자](icon-picker.yaml#base.enabled@grid)

[표: 칸](icon-picker.yaml#base.enabled@cell)

[표: 칸 아이콘](icon-picker.yaml#base.enabled@icon)

[표: 묶음 머리](icon-picker.yaml#base.enabled@groupHeader)

### 고른 표시

지금 값의 칸은 안쪽에 2px 짙은 테두리(`stroke-neutral-contrast`)를 덧그리고 아이콘을 선 2.5 로 둔다 — [Select Box](select-box.md) 의 고른 상자(v113)와 같은 말이다(사용자 결정 17A). 바탕은 칠하지 않아 아이콘의 모양 · 색이 그대로 보인다(반전 · 브랜드 채움은 고르지 않았다). 열면 고른 칸이 보이게 스크롤한다.

[그림: 고른 칸 — 안쪽 2px 짙은 테두리 · 선 2.5, 라이트 · 다크](../../site/components/specs/icon-picker.tsx#selected)

[표: 고름](icon-picker.yaml#selected)

### 찾기

찾기 칸은 [Input](input.md) 밑줄형이다 — 시트 large 40 · 팝오버 medium 34, 앞 돋보기 · 지우기, placeholder "아이콘 이름 검색", 이름 "아이콘 검색". 치는 대로 세트를 거른다 — 찾는 말과 이름 · 찾는 말 · lucide 이름을 소문자로 바꾸고 공백을 뺀 뒤 부분 일치다("커피" → 커피 · 원두, "월세" → 집, "coffee" → 커피). 결과는 세트 차례 그대로 묶음 머리 없이 늘어놓고, 개수는 화면 밖으로 알린다("검색 결과 2개"). 0건이면 격자 자리에 [Result Section](result-section.md) `medium` — "'{검색어}'에 대한 아이콘이 없어요" 다(사용자 결정 16A).

[그림: "커피" → 커피 · 원두 · "월세" → 집 · "유니콘" → 결과 없음](../../site/components/specs/icon-picker.tsx#search)

[표: 찾기 칸](icon-picker.yaml#base.enabled@search)

[표: 결과 수](icon-picker.yaml#base.enabled@count)

[표: 결과 없음](icon-picker.yaml#base.enabled@empty)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 칸 바탕 없음 |
| `hovered` | 웹 — 누름과 같은 바탕 `bg-layer-floating-pressed`(v106) |
| `focused` | 키보드 포커스 — 칸 바깥 링 2px · 띄움 2px. 격자에 Tab 하나(고른 칸, 없으면 첫 칸) |
| `pressed` | 같은 바탕 + 칸 2px 거리 축소(v104). 손을 떼면 고르고 닫힌다 |

트리거의 상태(누름 · 오류 · 막힘 · 읽기 전용)는 [Input Button](input-button.md) 그대로다.

[그림: 상태 — 기본 · 호버 · 포커스 · 누름 × 안 고름 · 고름](../../site/components/specs/icon-picker.tsx#states)

[표: 상태 — 안 고름](icon-picker.yaml#matrix)

[표: 상태 — 고름](icon-picker.yaml#matrix.selected.selected)

[표: 모션](icon-picker.yaml#motion)

## Guidelines

### 고른 세트만 연다

lucide 전체를 열지 않는다 — 첫 화면이 "a-arrow-down …" 이 되고, 2,000개는 사실상 찾기로만 고른다(사용자 결정 15A — 전체 + 추천 묶음 · 지금 전체는 고르지 않았다). 세트에 없는 아이콘이 필요하면 [`category-icons.yaml`](category-icons.yaml) 에 묶음 · 이름 · 찾는 말과 함께 더한다 — 웹 · 앱 둘 다에 있는 lucide 이름이어야 한다.

[그림: 세트 첫 화면(식비 · 카페 …) · 전체 첫 화면(a-arrow-down …)](../../site/components/specs/icon-picker.tsx#scope-guide)

### 한국어로 찾는다

이름은 한국어 하나("커피"), 찾는 말은 사람들이 그 아이콘을 부를 말("카페 · 아메리카노 · 라떼")이다. 이름은 칸의 이름(보조 기술 · 툴팁)과 트리거의 값 글로 쓴다 — 영어 lucide 이름("coffee")을 화면에 내지 않는다. 이름 · 찾는 말은 번역 문구에 둔다.

[그림: 칸 이름 — "커피" · 지금의 "a-arrow-down"](../../site/components/specs/icon-picker.tsx#name-guide)

### 기본은 태그 — "없음" 은 두지 않는다

"없음" 을 고르는 칸을 두지 않는다 — 아이콘이 없는 카테고리는 어차피 태그 아이콘 하나로 그린다(2026-10-04 List 결정). 새 항목은 기본 아이콘을 골라 둔 채 연다 — 카테고리는 태그(`tag`), 저축 목표처럼 쓰는 자리에 맞는 기본이 있으면(지금 돼지저금통) 그것. 이미 `""` · `null` 로 저장된 항목은 태그로 그리고, 트리거에도 태그 + "태그" 로 보인다.

### 세트 밖 아이콘은 그대로

세트를 두기 전에 저장된 세트 밖 아이콘은 지우지도 바꾸지도 않는다 — 그대로 그린다(웹 `DynamicIcon` · 앱 `lucideByName`). 트리거는 그 아이콘 + "지금 아이콘" 이고 격자에는 고른 칸이 없다. 격자에서 고르면 그 아이콘으로 바뀌고, 고르지 않고 닫으면 그대로다. 서버가 심은 `home` 은 세트의 `house`(집)와 같은 아이콘이라 집을 고른 것으로 보인다(`lucideAliases`).

### 키보드 — 2차원

격자는 칸마다 Tab 이 서지 않는다 — 격자에 Tab 하나(고른 칸, 없으면 첫 칸)로 들어와 화살표로 옮긴다. ← → 는 차례대로(줄 끝에서 다음 줄 · 다음 묶음으로), ↑ ↓ 는 보이는 위아래 줄의 가장 가까운 칸(묶음 머리를 넘는다), Home · End 는 그 줄의 처음 · 끝, `Enter` · `Space` 로 고른다. 찾기 칸에서 ↓ 는 격자의 첫 칸으로 간다. 열면 초점은 고른 칸(없으면 첫 칸)이다 — 폰에서 키보드가 올라와 격자를 가리지 않게, 찾기 칸은 눌러야 친다.

[그림: 직접 눌러 보기 — 커피에서 ↓ → 교통 묶음의 같은 열](../../site/components/specs/icon-picker.tsx#keyboard)

### 언제 쓰나

| 이런 자리 | 쓰는 것 |
|---|---|
| 카테고리 · 저축 목표에 아이콘을 붙인다 | **Icon Picker** |
| 아이콘을 보이기만 한다 | [List](list.md) 의 카테고리 타일 |
| 색을 붙인다 | [Color Swatch](color-swatch.md) |

### 글

라벨 "아이콘", 시트 제목 "아이콘", 찾기 칸 placeholder "아이콘 이름 검색"(마침표 없이), 결과 없음 제목 "'{검색어}'에 대한 아이콘이 없어요" · 설명 "다른 말로 찾거나 묶음에서 골라주세요.". 결과 수는 "검색 결과 2개" 로 읽힌다.

## 코드

레시피 `recipes/shadcn/components/ui/icon-picker.tsx` 를 [Field](field.md) 안에 둔다 — 트리거는 레시피 `input-button.tsx`(InputButton · `useInputButtonSurface`), 시트 · 팝오버는 `bottom-sheet.tsx` · `popover.tsx`, 찾기 칸은 `input.tsx` 다. 세트는 `recipes/shadcn/lib/category-icons.ts` — `category-icons.yaml` 에서 `scripts/gen-category-icons.mjs` 가 만든 표(`npm run gen:category-icons` — `institution-colors` 와 같은 틀, `npm run verify` 의 `check:category-icons` 가 어긋나면 멈춘다)와 찾기 함수다. 세트 밖에 저장된 아이콘은 lucide 의 `DynamicIcon` 으로 그리고, lucide 에도 없는 이름이면 기본 태그로 그린다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `IconPicker` — 트리거 + 여는 자리 + 찾기 + 격자. `value`(저장된 lucide 이름 — `null` · `""` 이면 태그) · `onValueChange(id)`(고르면 — 닫는 것은 스스로 한다) · `size`(트리거 — `"responsive"` 기본 · `"large"` · `"medium"`) · `disabled` · `id`. Field 안이면 라벨이 이름이 되고 오류 · 막힘을 받는다(Input Button). 2차원 화살표 · 결과 수 알림 · 결과 없음 · 고른 칸 스크롤을 스스로 한다.
- `category-icons.ts` — `CATEGORY_ICONS`(세트 — `{ id, group, name, aliases, lucideAliases? }`) · `CATEGORY_ICON_GROUPS`(묶음 차례) · `DEFAULT_CATEGORY_ICON`(`"tag"`) · `findCategoryIcon(id)`(id 또는 `lucideAliases` 로 찾는다 — 세트 밖이면 `null`) · `searchCategoryIcons(query)`(이름 · 찾는 말 · id 부분 일치, 세트 차례).

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
| 트리거 누르기 · `Enter` · `Space` | 1280 미만 시트 · 이상 팝오버를 연다. 초점은 고른 칸(없으면 첫 칸), 고른 칸이 보이게 스크롤 |
| 칸 누르기 · `Enter` · `Space` | 그 아이콘을 고르고(`onValueChange`) 닫는다 — 초점은 트리거로 |
| `←` `→` · `↑` `↓` · `Home` · `End` | 격자 안에서 옮긴다(고르지 않는다) — 2차원, 묶음을 넘는다 |
| `Tab` | 격자에 한 번 — 찾기 칸 ↔ 격자 ↔ (시트) 닫기 |
| 찾기 칸에 치기 | 치는 대로 거른다 — 결과 수를 한 번 알린다, 0건은 Result Section |
| 찾기 칸에서 `↓` | 격자의 첫 칸으로 |
| `Esc` | 찾는 말이 있으면 지운다 · 비었으면 닫는다(값은 그대로) — 초점은 트리거로 |
| 바깥 누르기 · 끌어내리기 | 닫는다 — 값은 그대로 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 묶음 머리 `fg-neutral-subtle` 시트 · 팝오버 위 5.50 · 다크 5.27 ✓. 트리거 · 찾기 칸은 Input Button · Input 의 검증 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 칸 아이콘 `fg-neutral` 16.41 · 다크 11.62, 고른 테두리 `stroke-neutral-contrast` 16.41 · 11.62 ✓. 호버 · 누름 바탕은 장식(고름은 테두리 · 굵기로) |
| **WCAG 1.4.1** Use of color | 고른 칸은 테두리 · 선 굵기로 알린다 — 색만이 아니다 ✓ |
| **WCAG 2.1.1** Keyboard | 격자 2차원 화살표 · `Enter` · `Space` · `Esc` ✓ — 칸마다 `Tab` 이 서지 않는다 |
| **WCAG 4.1.3** Status messages | 결과 수 · 결과 없음을 `aria-live="polite"` · `role="status"` 로 한 번 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 칸 48 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 칸 48 ✓ · 트리거 large 52 ✓(medium 40 은 1280 이상 데스크톱 웹만) |
| **ARIA** | 트리거 `<button>` · `aria-haspopup="dialog"` · `aria-expanded` · 이름 "아이콘, 커피"(Field 라벨 + 값). 시트 · 팝오버 `role="dialog"` · 이름 "아이콘". 격자 `role="listbox"` · 이름 "아이콘", 묶음 `role="group"` · `aria-labelledby`(머리), 칸 `role="option"` · `aria-selected` · 이름 = 한국어 이름 · roving `tabindex`. 칸 아이콘은 `aria-hidden`. 앱은 칸마다 `Semantics(selected: …, label: "커피", button: true)` + 키보드 포커스 |

## Do / Don't

### ✅ Do

- 고른 세트(category-icons.yaml)만 묶음으로 연다.
- 한국어 이름 · 찾는 말로 찾고, 칸 이름도 한국어로.
- 칸 48 · 아이콘 24, 고른 칸은 안쪽 2px 짙은 테두리.
- 트리거는 Input Button — 지금 아이콘 + 그 이름.
- 1280 미만은 시트, 이상은 팝오버 — 고르면 바로 닫는다.
- 격자는 2차원 화살표, 결과 수를 알린다.

### ❌ Don't

- lucide 전체를 열기 · 영어 이름으로만 찾기.
- "없음" 칸 · 빈 아이콘 저장.
- 칸 32 · 아이콘 16 · 고른 칸을 반전 · 브랜드 색으로.
- 칸마다 `Tab` · 폰에서 팝오버.
- 세트 밖으로 저장된 아이콘을 몰래 바꾸기.
- 트리거에 아이콘만 두고 이름을 빼기.

## Specification

`icon-picker.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Icon Picker 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다. 세트는 `category-icons.yaml`, 트리거 · 시트 · 팝오버 · 찾기 칸의 나머지 값은 각 스펙의 YAML 이다.

[그림: Specification — icon-picker.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#icon-picker)

## SEED 와 다른 점

- **groo 가 정한 컴포넌트다** — SEED 에는 아이콘 고르기 부품 · 화면이 없다(카테고리를 고르는 SEED 예는 글자를 치는 시트다). 세트를 두는 것은 SEED Iconography 의 "현재 제작된 범위 내에서" 를 따랐다.
- **칸 48 · 고른 칸 안쪽 2px 짙은 테두리** — SEED 문서 사이트의 Icon Library 는 칸 ≈ 60 · 사이 16 · 1px 테두리이고 고른 칸을 `bg.brand-weak` 틴트(흰 바탕과 1.10:1)로만 보인다. 아이콘 24 는 같다.
- **2차원 화살표 · 격자에 Tab 하나** — SEED 문서 사이트 격자는 칸마다 Tab(652개)이고 화살표가 없다.
- **한국어 이름 · 찾는 말** — SEED Icon Library 도 이름 · 키워드(한글 포함)로 찾는다. groo 는 칸의 이름까지 한국어다(SEED 는 `icon_a_uppercase_outline_fill` 같은 이름).
- **결과 수를 알린다** — SEED Icon Library 는 설명 글("`{검색어}`로 검색한 결과입니다.")만 바꾼다.

## Migration notes

### 2026-10-09 — 고른 세트 · 한국어 찾기 · Input Button 으로 다시 쓴다

사용자가 [입력 비교 페이지](https://claude.ai/artifact/CwVJDATSmLtwQoH67wh1zj)에서 정했다 — 고른 세트(15A — 카테고리용 150개 안팎을 묶음으로, 비교 페이지의 148개 · 13 묶음이 초안), 한국어 이름 + 찾는 말 · 없으면 "'{검색어}'에 대한 아이콘이 없어요"(16A), 칸 48 · 아이콘 24 · 고른 칸 안쪽 2px 짙은 테두리 · 트리거는 Input Button(17A). 그리고 "따라오는 것" — "없음" 을 걷고 기본은 태그(2026-10-04) · 2차원 roving · 결과 수 알림 · 칸 이름 한국어 · 빈 결과 해요체 · 트리거 이름 "아이콘, 커피". 전체 + 추천(15B) · 지금 전체(15C) · 묶음만(16B) · 영어(16C) · 반전(17B) · 지금 모양(17C)은 고르지 않았다. 초안에서 다듬은 것 — 하트의 이름을 기본 카테고리 "건강" 에 맞추고(옛 "마음" · 맥박은 "활동"), 서류 가방을 "회사"(옛 "일"), 수영의 lucide 이름을 `waves-horizontal`(옛 `waves` 는 `lucideAliases`), 집에 서버 시드의 `home` 을 `lucideAliases` 로 더했다. 옛 스펙은 `icon-picker.history/v-pre-seed-input.*` 에 남겼다.

| 옛 Icon Picker | 새 Icon Picker |
|---|---|
| 트리거 40 정사각(sm 32 · lg 48) · 아이콘 18 · 없으면 "—" | Input Button — 라벨 "아이콘" · 지금 아이콘 · 이름 글, large 52 · medium 40 |
| 늘 팝오버 320(sm 288 · lg 384) | 1280 미만 Bottom Sheet · 이상 Popover 408 |
| lucide 2,000+ · 영어 이름 부분 일치 · 100개까지 + "총 N개 중 100개 표시" | 세트 148개 · 13 묶음 · 한국어 이름 · 찾는 말 · 결과 수 알림 · 0건 Result Section |
| 8열 · 칸 32 · 사이 4 · 최대 높이 240 · 고른 칸 `primary` 채움 | 칸 48 · 아이콘 24 · 들어가는 만큼(6 · 7열) · 고른 칸 안쪽 2px `stroke-neutral-contrast` |
| 칸마다 Tab · 이름 = 영어 id | 격자에 Tab 하나 · 2차원 화살표 · 이름 = 한국어 |
| "없음" 줄 | 걷음 — 기본 태그 |

제품은 앱 적용 단계에서 옮긴다(2026-10-09 조사 — Desk 웹은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트로 쟀다). 아이콘 고르기는 웹 2곳(`shared/ui/icon-picker.tsx`) · 앱 2곳(`shared/widgets/p_icon_picker.dart`) — 카테고리 · 저축 목표다. HR · SSO 에는 없다.

- **자리** — 웹 카테고리(`widgets/category-manage/ui/CategoryEditDialog.tsx:318-321` — "없음" 이면 `""` 저장, 새 카테고리 기본 "tag" `:73`) · 저축 목표(`widgets/asset-full/ui/SavingGoalAddDialog.tsx:423-428` — "없음" 이면 "piggy-bank"). 앱 카테고리(`features/category/presentation/category_edit_dialog.dart:481` — `""` 저장 · 표시는 태그) · 저축 목표(`features/saving_goal/presentation/saving_goal_edit_dialog.dart:297-301` — "piggy-bank").
- **영어로만 찾는다** — `name.includes(query)`(`icon-picker.tsx:49-59`)라 "커피" 0건 · "coffee" 1건이다. 칸 이름은 `title` 의 영어 id("a-arrow-down"), 트리거 이름은 0(낭독 "button"), 2,007칸이 모두 Tab 정지점이라 200번 눌러도 팝오버를 못 나간다(`:113-128 · 168-185`, D8). 앱도 "커피" 0건이고 칸 · 트리거 이름 · 고른 상태가 0 이다(`p_icon_picker.dart:34-50 · 166-190`, D7).
- **폰에서도 팝오버** — 웹은 390 에서도 팝오버 320 이라 서랍 안에서 위로 열려 폼을 덮는다(`icon-picker.tsx:130`, D16). 앱은 시트 "아이콘 선택"(8열 × 41.3 · 아이콘 16)이다.
- **트리거** — 웹은 Field 의 `[&>*]:w-full`(`shared/ui/field.tsx:60`) 때문에 폭 전체 × 40 에 아이콘 18 만 있고 바탕이 `bg-page`(대화상자와 1.08)다. 앱은 40 정사각 · `isButton` 0. Input Button 으로.
- **격자 · 고른 칸** — 웹 8열 · 칸 32 · 아이콘 16 · 처음 120개, 스크롤마다 +120(2,007) · 고른 칸 회색 + 파란 고리, 바닥 10px "전체 2007개 · 스크롤해서 더 보기". 앱 8열 × 41.3 · 1,977개 · 고른 칸 브랜드 옅은 바탕 + 1.5px 테두리. 빈 결과 "검색 결과가 없습니다"(합니다체 — D26).
- **웹 · 앱이 다른 아이콘 수** — 웹 lucide-react 1.28.0 은 2,007 · 앱은 1,977 이라 웹에만 있는 13개(circle-euro … user-shield)는 앱에서 태그로 떨어지고, 앱 주석은 "1,100+" 다(`p_icon_picker.dart:14`, S7). 세트는 둘 다에 있는 이름만 쓴다.
- **아이콘이 없을 때 그리기가 다섯** — 빈 칸(`widgets/category-manage/ui/CategoryManager.tsx:781` → `shared/ui/groo/primitives.tsx:76-82` — `?? "tag"` 가 `""` 를 못 잡는다) · 첫 글자(`shared/ui/category-tile.tsx:78`) · 태그 · "?" · "—", 크기 11 ~ 20(D22). List 의 결정(태그 하나 · 20)대로 — `findCategoryIcon` 이 `null` 이고 저장 값이 비었으면 태그다.

### 이전 기록

- **2026-10-01 — 검색칸을 Input 의 앞 아이콘으로.** 아이콘을 절대 위치로 겹쳐 그리던 검색칸을 Input `prefixIcon` · `clearable` · `aria-label="아이콘 검색"` 으로 바꿨다(제품은 그대로였다). 트리거를 Input Button 으로 옮기는 일은 이번에 했다.
- **2026-05 — 처음 둠.** desk-front `shared/ui/icon-picker.tsx` 를 그대로 끌어올렸다(`lucide-react/dynamic` 의 `iconNames` · `DynamicIcon` · 100개 제한).
