# Searchable List

> 위 검색칸에 치는 대로 아래 목록이 걸러지고, 그 목록에서 하나를 고르는 묶음입니다. 은행 · 증권사 · 카드 상품 · 종목 · 결재자처럼 스크롤만으로 찾기 어려운 긴 목록에 씁니다. 대개 [Input Button](input-button.md) 이 여는 검색 시트 · 팝오버의 내용이고, 고르는 것이 그 단계의 일이면 화면 · 단계 안에 둡니다. 짧은 선택지는 [Select](select.md), 줄 몇 개에서 하나는 [List](list.md) 의 라디오 줄을 씁니다.

수치 원본은 [`searchable-list.yaml`](searchable-list.yaml)이고, 줄 · 검색칸의 수치는 [`list.yaml`](list.yaml) · [`input.yaml`](input.yaml)이 원본입니다.

[그림: 은행 고르기(시트) · 카드 상품 고르기(데스크톱 팝오버) — 라이트 · 다크](../../site/components/specs/searchable-list.tsx#hero)

### 직접 골라 보기

목록(은행 · 카드 상품 · 사람) · 놓인 자리(시트 · 단계 안) · 상태(결과 · 0건 · 실패 · 불러오는 중)를 고르면 스펙대로 그린 묶음과 그 코드가 바뀝니다. 검색칸에 쳐서 거르고, ↓ · ↑ 로 강조를 옮기고 `Enter` 로 고를 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/searchable-list.tsx#playground)

## Anatomy

[그림: 위 검색칸 · 분류 머리 · 결과 줄(앞 로고 타일 · 제목 · 설명 · 오른쪽 라디오) · 강조 바탕](../../site/components/specs/searchable-list.tsx#anatomy)

| ⓐ Field | 검색칸 — [Input](input.md) 밑줄형, 앞 돋보기 · 지우기, 이름 "검색"입니다. 위에 붙습니다. |
| ⓑ Group Header | 분류 머리 — [List](list.md) 의 목록 제목("시중은행" · "증권사")입니다. |
| ⓒ Option | 결과 줄 — List 의 누르는 줄(16 / 22 · 13 / 18)입니다. |
| ⓓ Prefix | 앞 붙이개 — [Logo Tile](logo-tile.md) 40 · 카드 그림 56 · [Avatar](avatar.md) 입니다. |
| ⓔ Radio | 오른쪽 라디오 — 지금 고른 값입니다. 누르면 바로 더하는 목록(`selectionMark={false}`)에는 없습니다. |
| ⓕ Highlight | 강조 바탕 — 화살표 · 마우스로 짚은 줄입니다. 초점은 검색칸에 그대로입니다. |

[표: 부위](searchable-list.yaml#slots)

## Properties

### 검색칸

[Input](input.md) 의 밑줄형입니다 — 시트 · 화면에 입력이 하나뿐인 목록 위 검색이라 Input 의 "화면에 입력이 하나뿐이면 밑줄" 규칙을 따릅니다. 1280 미만 · 앱은 large 40(글 18 / 24 · 돋보기 24), 1280 이상 웹은 medium 34(글 16 / 22 · 돋보기 20)입니다. 아래 1px `stroke-neutral-weak` 이 치는 동안 2px `stroke-neutral-contrast` 가 되고, 모서리 · 좌우 여백이 없습니다. 값이 있으면 지우기 버튼(22 · 18, 누르는 영역 44)을 두고, 이름은 "검색"(라벨이 없으니 `aria-label`), placeholder 는 "{무엇} 검색"("은행 이름 검색")입니다. 좌우는 줄과 같은 24 안에 두어 돋보기와 줄의 앞 붙이개가 한 줄에 섭니다. 목록이 스크롤해도 검색칸은 위에 붙어 있습니다.

[그림: 검색칸 — 밑줄형 large 40 · medium 34, 돋보기 24 · 20 · 지우기, 돋보기가 줄의 앞 붙이개와 한 줄](../../site/components/specs/searchable-list.tsx#field)

[표: 크기](searchable-list.yaml#size)

[표: 검색칸](searchable-list.yaml#base.enabled@field)

### 결과 줄

결과는 [List](list.md) 의 누르는 줄입니다 — 제목 16 / 22 · 400, 설명 13 / 18 · `fg-neutral-subtle`, 위아래 12 · 좌우 24. 앞 붙이개는 물건이면 [Logo Tile](logo-tile.md) 40(은행 · 증권 · 카드사), 카드 상품이면 카드 그림 56([Image Frame](image-frame.md) 카드 비율), 사람이면 [Avatar](avatar.md) 36 · 42 입니다. 단종 카드처럼 고를 수는 있지만 알릴 것이 있으면 흐리게 두지 않고 [Badge](badge.md)("단종" — `weak` `neutral`)를 답니다.

[그림: 결과 줄 — 로고 타일 40 · 카드 그림 56 · 아바타, 단종 배지](../../site/components/specs/searchable-list.tsx#rows)

[표: 앞 붙이개](searchable-list.yaml#prefix)

[표: 결과 줄](searchable-list.yaml#base.enabled@option)

[표: 제목](searchable-list.yaml#base.enabled@title)

[표: 설명](searchable-list.yaml#base.enabled@detail)

### 지금 값 — 오른쪽 라디오

하나 고르기라 줄 오른쪽에 라디오(24)를 두고 지금 고른 값만 켭니다 — 고른 것과 안 고른 것이 모두 보입니다([List](list.md) 의 "하나 고르기"). 고른 줄의 바탕을 칠하지 않습니다. 라디오는 보는 표시이고, 고름은 줄의 `aria-selected` 가 알립니다.

[그림: 지금 값 — 신한 라디오 켬 · 나머지 꺼짐](../../site/components/specs/searchable-list.tsx#selected)

[표: 고름](searchable-list.yaml#selected)

[표: 라디오](searchable-list.yaml#base.enabled@radio)

### 누르면 바로 더하는 목록 — 라디오 없음

줄을 누르는 것이 "고르기" 가 아니라 "더하기" 인 목록 — 투자 폼의 "종목 추가" 처럼 누른 줄이 바로 더해지고 시트 · 팝오버가 닫히는 목록 — 에는 라디오를 두지 않습니다(`selectionMark={false}`). 지금 값이 없으니 동그라미가 채워질 일이 없고, 빈 동그라미는 "골라 두고 확인을 누르는" 목록으로 읽히기 때문입니다. 라디오만 빼고 나머지는 그대로입니다 — 검색칸 · 키보드(↓ · ↑ · `Enter`) · 강조 바탕 · 결과 없음 · 줄 좌우 24 · 제목 오른쪽 10. 줄 높이는 라디오가 없어도 최소 48 입니다(한 줄 46 으로 줄지 않습니다). 하나를 골라 칸에 넣는 목록(은행 · 증권 · 카드 상품 · 결재자)은 지금 값이 보여야 하므로 라디오를 그대로 둡니다.

| 목록 | 줄을 누르면 | 오른쪽 |
|---|---|---|
| 칸에 넣는 고르기(은행 · 카드 상품 · 결재자) | 그 값을 고릅니다 — 시트는 닫히고 칸에 들어가며, 단계 안은 라디오만 바뀝니다 | 라디오(지금 값) |
| 누르면 바로 더하는 목록(종목 추가 · 맨 아래 "직접 추가" 줄도) | 그 줄을 더하고 닫습니다 — 지금 값을 들지 않습니다 | 없음 |

[그림: 종목 추가 — 라디오 없는 줄 · 은행 고르기 — 라디오](../../site/components/specs/searchable-list.tsx#action-guide)

[표: 지금 값 표시](searchable-list.yaml#selectionMark)

### 분류 머리

분류가 있는 목록(은행 · 증권사)은 [List](list.md) 의 목록 제목(`mediumWeak` — 14 · 500 · `fg-neutral-subtle`)으로 묶습니다 — 분류 차례는 은행이 시중은행 · 인터넷은행 · 지방은행 · 특수은행 · 저축기관 · 외국계 · 기타, 투자가 증권사 · 상품거래소 · 가상자산거래소입니다. 거르면 줄이 남지 않은 분류는 머리째 숨깁니다. 분류를 칩으로 고르게 하지 않습니다(기관 34곳은 칩 묶음이 아니라 검색 + List 줄입니다).

[그림: 은행 고르기 — 시중은행 · 인터넷은행 머리 + 로고 타일 줄](../../site/components/specs/searchable-list.tsx#groups)

[표: 분류 머리](searchable-list.yaml#base.enabled@groupHeader)

### 놓이는 자리 — 고르면 닫힐까

| 자리 | 고르면 | 근거 |
|---|---|---|
| 검색 시트 · 팝오버(`sheet` — 기본) | 고르고 닫힙니다 — "완료" 를 두지 않습니다. 열면 검색칸에 초점이 갑니다 — 시트 · 팝오버의 첫 초점으로 받습니다(`onOpenAutoFocus`, 열린 뒤 다시 옮기지 않습니다). 지금 값이 보이게 스크롤합니다 | [Input Button](input-button.md) 의 "긴 목록은 검색 시트" · "목록은 누르면 바로" |
| 화면 · 단계 안(`inline`) | 라디오만 바뀝니다 — 닫거나 넘기지 않고, 단계의 버튼("다음" · "저장")이 반영합니다 | [Select Box](select-box.md) 의 "반영은 버튼" |

시트는 1280 미만, 팝오버는 1280 이상입니다(Input Button). 여럿을 고르는 검색 목록은 이 컴포넌트가 아닙니다.

**끝 흐림은 결과에만** — 시트 · 팝오버처럼 높이가 정해진 자리에서는 결과 목록만 스크롤하고 그 위 · 아래에 [Scroll Fog](scroll-fog.md) `overlayBody`(시트 본문과 같은 끝 흐림)를 겁니다. 검색칸과 검색칸 바로 아래 고정 줄(카드 상품의 "단종 카드 포함" 스위치)은 흐림 밖에 붙어 있습니다. 걸지 말지는 내용의 종류로 정합니다 — 긴 결과 목록이라 늘 겁니다(Bottom Sheet 의 "본문 끝 흐림"). 화면 · 단계 안(`inline`)처럼 높이가 정해지지 않은 자리는 화면이 스크롤하므로 걸지 않습니다. 웹 · 레시피는 결과를 `ScrollFog use="overlayBody"` 로 감싸고(담다 `PickResults`), 앱은 `PSearchableListResults(scrollFog: true)` 를 씁니다 — 거는 쪽은 부르는 자리입니다.

[그림: 시트 — 누르면 닫히고 칸에 들어감 · 단계 안 — 라디오가 바뀌고 "다음"](../../site/components/specs/searchable-list.tsx#placement)

[표: 놓인 자리](searchable-list.yaml#placement)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 줄 바탕 없음 |
| `highlighted` | ↓ · ↑ 로 짚은 줄 · 마우스를 올린 줄 — 좌우 6 들어온 `bg-layer-default-pressed` · 모서리 10. 한 번에 한 줄, 초점은 검색칸에 그대로입니다. 마우스로 짚은 강조는 포인터가 목록을 떠나면 지웁니다(키보드로 짚은 강조는 남습니다) |
| `pressed` | 같은 바탕 + 콘텐츠만 2px 거리 축소(List) |

마우스로 짚거나 누르면 바탕이 좌우 0 → 6 들어오며 모서리 0 → 10 으로 둥글어집니다(150ms) — [Menu](menu.md) 알약 · [List](list.md) 의 누름 바탕과 같은 움직임입니다. 화살표로 옮길 때는 전환 없이 바로 바뀝니다. 마우스가 목록(`listbox`)을 떠나면 마우스로 짚은 강조를 지웁니다 — Menu · Select · List 의 호버와 같습니다. 그래서 마우스로 짚고 `Enter` 를 누르려면 마우스가 목록 위에 있어야 하고, 지운 뒤의 `↓` 는 첫 줄부터입니다.

[그림: 상태 — 강조(키보드) · 강조(마우스) · 누름](../../site/components/specs/searchable-list.tsx#states)

[표: 상태 — 강조 바탕](searchable-list.yaml#matrix@highlight)

[표: 상태 — 결과 줄](searchable-list.yaml#matrix@option)

[표: 모션](searchable-list.yaml#motion)

## Guidelines

### 키보드 — 초점은 검색칸에

치면서 바로 고릅니다 — 초점은 늘 검색칸에 있고, 화살표는 결과 사이의 강조만 옮깁니다(콤보박스). 줄은 `Tab` 으로 들어가지 않습니다.

| 키 | 동작 |
|---|---|
| 글자 | 거릅니다 — 강조는 지웁니다 |
| `↓` · `↑` | 강조를 한 줄씩 옮깁니다(강조가 없으면 `↓` 는 첫 줄 · `↑` 는 마지막 줄, 끝에서 멈춥니다). 분류 머리는 건너뜁니다. 강조한 줄은 보이게 스크롤합니다 |
| `Enter` | 강조한 줄을 고릅니다 — 시트는 닫히고, 단계 안은 라디오가 바뀝니다. 강조가 없으면 아무것도 하지 않습니다(폼을 제출하지 않습니다) |
| `Esc` | 검색어가 있으면 지웁니다. 비었으면 시트 · 팝오버를 닫습니다(값은 그대로) |
| `Tab` | 검색칸을 떠나 다음 자리(시트의 닫기 · 단계의 버튼)로 갑니다 |

[그림: 직접 눌러 보기 — 검색칸에서 ↓ ↓ Enter](../../site/components/specs/searchable-list.tsx#keyboard)

### 거르는 규칙

검색어와 줄의 이름 · 별칭을 NFC 로 맞추고, 대소문자와 공백을 무시해 이름이나 별칭 하나에 검색어가 들어 있으면 남깁니다 — "kx 은행" 은 KX은행을, "모아 카드" 는 모아카드를 찾습니다. 들고 있는 목록(은행 · 증권사)과 서버 검색(카드 상품 · 종목)이 같은 규칙입니다. 화면마다 규칙을 따로 두지 않습니다.

[표: 결과 목록](searchable-list.yaml#base.enabled@results)

### 서버 검색은 300ms 기다립니다

서버에서 찾는 목록(카드 상품 · 종목)은 마지막 입력 뒤 300ms 에 한 번 보냅니다 — 글자마다 보내지 않습니다. 들고 있는 목록(은행 · 증권사)은 치는 대로 바로 거릅니다. 받는 동안은 이전 결과를 남기고(강조만 지웁니다), 1초가 넘으면 줄 스켈레톤으로 바꿉니다.

[그림: "신한체크카드" 여섯 글자 — 요청 한 번](../../site/components/specs/searchable-list.tsx#debounce-guide)

### 결과 없음 · 실패 · 불러오는 동안

결과가 없으면 목록 자리에 [Result Section](result-section.md) `medium` — "'{검색어}'에 대한 검색 결과가 없어요" — 을 두고 보조 기술에 한 번 알립니다(`role="status"`). 결과가 있을 때는 개수를 알리지 않습니다(`↓` 로 들어가면 알 수 있습니다). 못 불러왔으면 0건과 다르게 `failure` — "검색 결과를 불러오지 못했어요" + "다시 시도" 를 둡니다 — 실패를 "결과가 없어요" 로 보이지 않습니다. 처음 불러오는 동안은 줄 모양 [Skeleton](skeleton.md) 다섯을 둡니다(앞 자리 · 제목 · 설명, 줄 높이 그대로).

[그림: 0건 · 실패 + 다시 시도 · 줄 스켈레톤](../../site/components/specs/searchable-list.tsx#status-guide)

[표: 결과 없음 · 실패](searchable-list.yaml#base.enabled@status)

[표: 불러오는 줄](searchable-list.yaml#base.enabled@skeleton)

### 은행 · 증권 고르기는 List + 로고 타일

기관 고르기는 검색칸 + 분류 머리 + 로고 타일 40 줄 + 오른쪽 라디오입니다 — 다른 고르기 화면과 같은 줄입니다. 기관 색 칩 34개를 분류로 묶어 두지 않습니다. 칩으로 고르는 폼 값은 2 ~ 4개(Select 의 판단 순서)이고, 목록을 거르는 칩은 [Chip](chip.md) 필터 바입니다 — 두 쓰임을 나눠 읽습니다.

[그림: List + 로고 타일 · 분류별 칩 묶음](../../site/components/specs/searchable-list.tsx#chips-guide)

### 언제 쓰나

선택지가 적으면 Searchable List 를 쓰지 않습니다 — 개수 · 글 길이로 고르는 표는 Select 의 ["고르는 컴포넌트 고르기"](select.md#고르는-컴포넌트-고르기) 한 곳에 있습니다.

| 선택지 | 쓰는 것 |
|---|---|
| 스크롤로 찾기 어려움(기관 · 상품 · 종목 · 사람 — 자산 추가 · 수정의 기관 · 카드 상품도) | Searchable List — [Input Button](input-button.md) 의 검색 시트 |
| 고르는 것이 그 단계의 일 | Searchable List `inline` |

### 글

placeholder 는 "{무엇} 검색"("은행 이름 검색" · "카드 이름 검색")이고 마침표를 찍지 않습니다. 0건 제목은 "'{검색어}'에 대한 검색 결과가 없어요", 설명은 할 수 있는 일("카드사 이름으로도 찾아보세요.")입니다. 분류 머리는 짧은 명사("시중은행")입니다.

## 코드

레시피 `recipes/shadcn/components/ui/searchable-list.tsx` 를 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `SearchableList` — 묶음입니다. `value` · `defaultValue` · `onValueChange(value)`(고르면 — 시트는 여기서 닫습니다) · `query` · `defaultQuery` · `onQueryChange(query)`(치는 대로) · `onSearch(query)`(서버 검색 — 마지막 입력 뒤 `searchDelay` 기본 300ms 에 한 번) · `placement`(`"sheet"` 기본 · `"inline"`) · `size`(`"responsive"` 기본 — 1280 미만 large · 이상 medium, 앱은 large) · `selectionMark`(기본 `true` — 줄 오른쪽 라디오. 누르면 바로 더하고 닫는 목록은 `false`, 그때는 `value` 를 주지 않습니다).
- `SearchableListInput` — 검색칸(Input 밑줄형 · 앞 돋보기 · 지우기 — `variant="underline"` 을 스스로 겁니다). `placeholder` · `aria-label`(기본 "검색"). `role="combobox"` · `aria-controls` · `aria-activedescendant` · 화살표 · `Enter` · `Esc` 를 맡습니다. 스스로 초점을 옮기지 않습니다 — 시트 · 팝오버가 열릴 때 `focusSearchableList` 로 넘겨받습니다.
- `focusSearchableList(event)` — 시트 · 팝오버의 `onOpenAutoFocus` 에 겁니다. 첫 초점을 표면 대신 검색칸에 주고, 지금 값이 보이게 가운데로 스크롤합니다(열린 뒤 다시 옮기지 않습니다).
- `matchesSearch(query, ...names)` — 거르는 규칙(NFC · 대소문자 · 공백 무시 · 포함). 들고 있는 목록은 이름 · 별칭을 넘겨 거릅니다. 서버 검색도 같은 규칙입니다.
- `SearchableListResults` — 결과 목록(`role="listbox"`). `aria-label`(대상 — "은행").
- `SearchableListGroup` — 분류. `label`(List Header `mediumWeak`, `role="group"` 의 이름).
- `SearchableListItem` — 결과 줄(`role="option"`). `value` · `title` · `detail` · `prefix`(LogoTile · 카드 그림 · Avatar). 라디오는 스스로 그립니다(묶음의 `selectionMark` 가 `false` 면 그리지 않습니다 — 줄 높이는 최소 48 그대로).
- `SearchableListEmpty` — 0건(Result Section `medium` — 제목은 검색어로 만들고 알립니다). `description` · `title`(검색어 제목 대신).
- `SearchableListError` — 실패(Result Section `failure` + "다시 시도"). `onRetry` · `retrying`(다시 시도 중 — 버튼 로딩) · `title` · `description`.
- `SearchableListSkeleton` — 불러오는 줄. `rows`(기본 5) · `prefix`(`"logo"` · `"cardArt"` · `"avatar"` · `"none"`).

### 은행 고르기 — 검색 시트

[그림: 계좌 추가 — "은행 선택" 을 누르면 시트, 분류 머리 + 로고 타일](../../site/components/specs/searchable-list.tsx#ex-institution)

```tsx
import { ChevronDown } from "lucide-react"
import { BottomSheet, BottomSheetBody, BottomSheetContent } from "@/components/ui/bottom-sheet"
import { Field } from "@/components/ui/field"
import { InputButton } from "@/components/ui/input-button"
import { LogoTile } from "@/components/ui/logo-tile"
import {
  SearchableList, SearchableListEmpty, SearchableListGroup, SearchableListInput, SearchableListItem, SearchableListResults, focusSearchableList, matchesSearch,
} from "@/components/ui/searchable-list"

// 이름 · 별칭에 검색어가 들어 있으면 남긴다(NFC · 대소문자 · 공백 무시 — 거르는 규칙)
const found = INSTITUTIONS.filter((it) => matchesSearch(query, it.name, ...it.aliases))
const groups = groupInstitutions(found) // 시중은행 · 인터넷은행 · 지방은행 · 특수은행 · 저축기관 · 외국계 · 기타

<Field label="은행">
  <BottomSheet open={open} onOpenChange={setOpen}>
    <InputButton placeholder="은행 선택" value={bank?.name} suffixIcon={<ChevronDown />} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)} />
    {/* 첫 초점은 시트 대신 검색칸 — 시트가 넘겨준다 */}
    <BottomSheetContent title="은행 선택" onOpenAutoFocus={focusSearchableList}>
      {/* 본문 좌우 여백을 뺀다 — 검색칸 · 줄이 제 24 를 가진다(bottom-sheet.md) */}
      <BottomSheetBody className="px-0">
        {/* 고르면 닫는다 — "완료" 없음 */}
        <SearchableList value={bank?.id} onValueChange={(id) => { setBank(byId(id)); setOpen(false) }} query={query} onQueryChange={setQuery}>
          <SearchableListInput placeholder="은행 이름 검색" />
          {groups.length === 0 ? (
            <SearchableListEmpty />
          ) : (
            <SearchableListResults aria-label="은행">
              {groups.map((g) => (
                <SearchableListGroup key={g.label} label={g.label}>
                  {g.items.map((it) => (
                    <SearchableListItem key={it.id} value={it.id} title={it.name} prefix={<LogoTile name={it.name} />} />
                  ))}
                </SearchableListGroup>
              ))}
            </SearchableListResults>
          )}
        </SearchableList>
      </BottomSheetBody>
    </BottomSheetContent>
  </BottomSheet>
</Field>
```

### 카드 상품 — 서버 검색 · 단계 안

[그림: 카드 추가 — 카드 그림 56 줄 · 단종 배지 · "다음"](../../site/components/specs/searchable-list.tsx#ex-card)

```tsx
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CardArt } from "@/components/ui/image-frame"
import {
  SearchableList, SearchableListEmpty, SearchableListError, SearchableListInput, SearchableListItem, SearchableListResults, SearchableListSkeleton,
} from "@/components/ui/searchable-list"

<SearchableList placement="inline" value={cardId} onValueChange={setCardId} query={query} onQueryChange={setQuery} onSearch={setSearch}>
  <SearchableListInput placeholder="카드 이름 검색" />
  {catalog.isPending ? (
    <SearchableListSkeleton prefix="cardArt" />
  ) : catalog.isError ? (
    <SearchableListError onRetry={() => catalog.refetch()} />
  ) : catalog.data.length === 0 ? (
    <SearchableListEmpty description="카드사 이름으로도 찾아보세요." />
  ) : (
    <SearchableListResults aria-label="카드 상품">
      {catalog.data.map((c) => (
        <SearchableListItem
          key={c.id}
          value={c.id}
          prefix={<CardArt name={c.name} issuer={c.issuer} src={c.imageUrl} width={56} />}
          title={c.name}
          detail={<span className="flex items-center gap-x1_5">{c.issuer} · {c.kindLabel}{c.discontinued && <Badge className="shrink-0">단종</Badge>}</span>}
        />
      ))}
    </SearchableListResults>
  )}
</SearchableList>
<Button size="large" disabled={!cardId} onClick={next}>다음</Button>
```

### 종목 추가 — 누르면 바로 더합니다

[그림: 종목 추가 — 라디오 없는 결과 줄](../../site/components/specs/searchable-list.tsx#ex-stock)

```tsx
import { BottomSheet, BottomSheetBody, BottomSheetContent } from "@/components/ui/bottom-sheet"
import {
  SearchableList, SearchableListEmpty, SearchableListInput, SearchableListItem, SearchableListResults, focusSearchableList,
} from "@/components/ui/searchable-list"

<BottomSheetContent title="종목 추가" onOpenAutoFocus={focusSearchableList}>
  <BottomSheetBody className="px-0">
    {/* 지금 값이 없다 — value 를 주지 않고 라디오를 끈다. 누르면 더하고 닫는다 */}
    <SearchableList selectionMark={false} onValueChange={(code) => { addStock(byCode(code)); setOpen(false) }} query={query} onQueryChange={setQuery} onSearch={setSearch}>
      <SearchableListInput placeholder="종목 이름 검색" />
      {stocks.length === 0 ? (
        <SearchableListEmpty />
      ) : (
        <SearchableListResults aria-label="종목">
          {stocks.map((s) => (
            <SearchableListItem key={s.code} value={s.code} title={s.name} detail={s.market} />
          ))}
        </SearchableListResults>
      )}
    </SearchableList>
  </BottomSheetBody>
</BottomSheetContent>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 열기(시트 · 팝오버) | 검색칸에 초점이 갑니다(시트 · 팝오버의 `onOpenAutoFocus` 로 받습니다) · 지금 값이 보이게 스크롤합니다. 강조는 없습니다 |
| 치기 | 들고 있는 목록은 바로 거르고, 서버 검색은 마지막 입력 뒤 300ms 에 한 번 보냅니다 — 강조를 지웁니다. 거르는 규칙은 둘이 같습니다(NFC · 대소문자 · 공백 무시) |
| `↓` · `↑` | 강조를 옮깁니다(초점은 검색칸) |
| `Enter` | 강조한 줄을 고릅니다 — 시트 · 팝오버는 닫히고, 단계 안은 라디오만 바뀝니다 |
| 줄 누르기 · 클릭 | 그 줄을 고릅니다 — 마우스를 올린 줄은 강조와 같은 바탕입니다. 누르면 바로 더하는 목록(`selectionMark={false}`)은 그 줄을 더하고 닫습니다 |
| 마우스가 목록을 떠남 | 마우스로 짚은 강조를 지웁니다 — 키보드로 짚은 강조는 남습니다 |
| 지우기 버튼 | 검색어를 비우고 검색칸에 초점을 둡니다 — 전체 목록으로 돌아갑니다 |
| `Esc` | 검색어를 지웁니다 → 비었으면 닫습니다 |
| 0건 · 실패 | 목록 자리에 Result Section 을 둡니다 — 바뀌면 한 번 알립니다 |
| 글자 크기 설정 | 검색칸 글 · 결과 줄 제목 · 설명 · 분류 머리가 커집니다. 검색칸은 최소 높이라 글을 따라 높아지고 한 줄을 지킵니다(넘치면 칸 안에서 가로로 스크롤). 결과 줄은 줄을 바꿔 받고 높이가 늘어납니다. 오른쪽 라디오 · 앞 로고 타일 · 카드 그림 · 아바타 · 배지는 그대로입니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 `fg-neutral` 시트 위 16.41 · 다크 11.62, 강조 바탕 위 15.48 · 10.32 ✓. 설명 · 분류 머리 `fg-neutral-subtle` 5.50 · 다크 5.27, 강조 바탕 위 5.18 · 4.68 ✓. placeholder `fg-placeholder` 같은 값 ✓ |
| **WCAG 1.4.4** Resize text | 검색칸 · 결과 줄 · 분류 머리 글이 글자 크기 설정을 따르고, 칸 · 줄이 글을 따라 높아져 잘리지 않습니다 ✓. 배지 글은 예외입니다 — 고정된 표식이라 커지지 않습니다([Badge](badge.md) 의 WCAG 1.4.4). 라디오는 컨트롤 모양이라 px 그대로입니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 돋보기 `fg-neutral-muted` 7.11 · 6.67 ✓. 라디오 · 검색칸 테두리는 Radio · Input 의 검증. 강조 바탕(1.06 · 다크 1.13)은 장식입니다 — 강조는 `aria-activedescendant` 로 읽힙니다 |
| **WCAG 2.1.1** Keyboard | 치기 · ↓ · ↑ · `Enter` · `Esc` 로 모두 됩니다 ✓ — 줄마다 `Tab` 이 걸리지 않습니다 |
| **WCAG 4.1.3** Status messages | 0건 · 실패를 `role="status"` 로 한 번 알립니다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 결과 줄 48 이상 · 지우기 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 결과 줄 전체 ✓ |
| **ARIA** | 검색칸 `role="combobox"` · `aria-expanded="true"` · `aria-controls`(목록) · `aria-autocomplete="list"` · `aria-activedescendant`(강조한 줄의 id, 없으면 비움) · 이름 "검색". 목록 `role="listbox"` + 이름, 분류 `role="group"` + `aria-labelledby`(머리), 줄 `role="option"` · `aria-selected`(지금 값). 라디오 · 로고 타일은 `aria-hidden` 입니다 |

## Do / Don't

### ✅ Do

- 검색칸은 Input 밑줄형 + 돋보기 · 지우기 · 이름 "검색" 으로 두고, 위에 붙입니다.
- 결과는 List 줄로 둡니다 — 물건은 로고 타일 40, 카드는 카드 그림 56, 지금 값은 오른쪽 라디오.
- 누르면 바로 더하고 닫는 목록(종목 추가)은 라디오를 끕니다(`selectionMark={false}`) — 줄 높이 48 · 좌우 24 는 그대로입니다.
- 초점은 검색칸에 두고, 화살표는 강조만 옮기고, `Enter` 로 고릅니다.
- 서버 검색은 300ms 뒤 한 번 보냅니다.
- 0건은 "'{검색어}'에 대한 검색 결과가 없어요" + 알림, 실패는 따로 + 다시 시도로 보입니다.
- 분류가 있으면 List Header 로 묶습니다.

### ❌ Don't

- 줄마다 `Tab` · 라디오 묶음처럼 목록에 들어가야 고르는 키보드.
- 목록 위 검색칸을 상자형(52)으로.
- 고른 줄을 브랜드 바탕으로 칠하기 · 단종을 흐리게.
- 글자마다 서버 요청.
- 실패를 "검색 결과가 없어요" 로.
- 기관을 칩 묶음으로 고르기.
- 시트에서 하나를 고르는데 "완료" 를 한 번 더 누르게 하기.
- 누르면 바로 더하는 목록에 늘 빈 라디오를 두기 · 라디오를 빼며 줄 높이를 46 으로 줄이기 · 칸에 넣는 고르기(은행 · 카드 상품)에서 라디오를 빼기.

## Specification

`searchable-list.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Searchable List 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다. 줄 · 검색칸의 나머지 값은 `list.yaml` · `input.yaml` 에 있습니다.

[그림: Specification — searchable-list.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#searchable-list)
