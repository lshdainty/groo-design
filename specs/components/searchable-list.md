# Searchable List

> 위 검색칸에 치는 대로 아래 목록이 걸러지고, 그 목록에서 하나를 고르는 묶음 — 은행 · 증권사 · 카드 상품 · 종목 · 결재자처럼 스크롤만으로 찾기 어려운 긴 목록에 쓴다. 대개 [Input Button](input-button.md) 이 여는 검색 시트 · 팝오버의 내용이고, 고르는 것이 그 단계의 일이면 화면 · 단계 안에 둔다. 짧은 선택지는 [Select](select.md), 줄 몇 개에서 하나는 [List](list.md) 의 라디오 줄이다.

SEED 에는 이 컴포넌트가 없다 — Select 문서가 "옵션이 매우 많아 스크롤만으로 탐색하기 어렵다면 검색형 선택(Combobox) 패턴을 고려합니다. SEED는 아직 Combobox를 제공하지 않습니다." 라고 적었고, Search Bar 는 Figma 에만 있다(코드는 아직 없다). 그래서 부품마다 SEED 를 따른다 — 검색칸은 Text Input 의 밑줄형("화면에 하나의 Input만 있는 경우 Underline 사용을 권장" — 앞 돋보기), 결과는 List Item 줄 + 오른쪽 Radiomark(하나 고르기), 결과 없음은 Result Section("'나루로리롱'에 대한 검색 결과가 없어요" 예), 키보드는 SEED 팀이 만든 유일한 검색 + 결과인 문서 사이트 검색 창이다 — "the arrow keys move a highlight through the results rather than the focus, which is what lets someone keep typing"(당근 SEED, Apache-2.0). 놓이는 자리 · 서버 검색 지연 · 분류 머리 · 실패는 groo 가 정했다(2026-10-08 사용자 결정). 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다. 옛 Searchable List 스펙(상자 안 결과 · 제목 13 · 썸네일 44 × 28 · 고른 줄 브랜드 바탕)을 대신한다.

수치 원본은 [`searchable-list.yaml`](searchable-list.yaml)이고, 줄 · 검색칸의 수치는 [`list.yaml`](list.yaml) · [`input.yaml`](input.yaml)이 원본이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 은행 고르기(시트) · 카드 상품 고르기(데스크톱 팝오버) — 라이트 · 다크](../../site/components/specs/searchable-list.tsx#hero)

### 직접 골라 보기

목록(은행 · 카드 상품 · 사람) · 놓인 자리(시트 · 단계 안) · 상태(결과 · 0건 · 실패 · 불러오는 중)를 고르면 스펙대로 그린 묶음과 그 코드가 바뀐다. 검색칸에 쳐서 거르고, ↓ · ↑ 로 강조를 옮기고 `Enter` 로 고를 수 있다.

[그림: 플레이그라운드](../../site/components/specs/searchable-list.tsx#playground)

## Anatomy

[그림: 위 검색칸 · 분류 머리 · 결과 줄(앞 로고 타일 · 제목 · 설명 · 오른쪽 라디오) · 강조 바탕](../../site/components/specs/searchable-list.tsx#anatomy)

| ⓐ Field | 검색칸 — [Input](input.md) 밑줄형, 앞 돋보기 · 지우기, 이름 "검색". 위에 붙는다. |
| ⓑ Group Header | 분류 머리 — [List](list.md) 의 목록 제목("시중은행" · "증권사"). |
| ⓒ Option | 결과 줄 — List 의 누르는 줄(16 / 22 · 13 / 18). |
| ⓓ Prefix | 앞 붙이개 — [Logo Tile](logo-tile.md) 40 · 카드 그림 56 · [Avatar](avatar.md). |
| ⓔ Radio | 오른쪽 라디오 — 지금 고른 값. 누르면 바로 더하는 목록(`selectionMark={false}`)에는 없다. |
| ⓕ Highlight | 강조 바탕 — 화살표 · 마우스로 짚은 줄. 초점은 검색칸에 그대로다. |

[표: 부위](searchable-list.yaml#slots)

## Properties

### 검색칸

[Input](input.md) 의 밑줄형이다 — 시트 · 화면에 입력이 하나뿐인 목록 위 검색이라 Input 의 "화면에 입력이 하나뿐이면 밑줄" 규칙(SEED)을 따른다(사용자 결정 — 상자형 52 는 고르지 않았다). 1280 미만 · 앱은 large 40(글 18 / 24 · 돋보기 24), 1280 이상 웹은 medium 34(글 16 / 22 · 돋보기 20)다. 아래 1px `stroke-neutral-weak` 이 치는 동안 2px `stroke-neutral-contrast` 가 되고, 모서리 · 좌우 여백이 없다. 값이 있으면 지우기 버튼(22 · 18, 누르는 영역 44), 이름은 "검색"(라벨이 없으니 `aria-label`)이고 placeholder 는 "{무엇} 검색"("은행 이름 검색")이다. 좌우는 줄과 같은 24 안에 두어 돋보기와 줄의 앞 붙이개가 한 줄에 선다. 목록이 스크롤해도 검색칸은 위에 붙어 있다.

[그림: 검색칸 — 밑줄형 large 40 · medium 34, 돋보기 24 · 20 · 지우기, 돋보기가 줄의 앞 붙이개와 한 줄](../../site/components/specs/searchable-list.tsx#field)

[표: 크기](searchable-list.yaml#size)

[표: 검색칸](searchable-list.yaml#base.enabled@field)

### 결과 줄

결과는 [List](list.md) 의 누르는 줄이다 — 제목 16 / 22 · 400, 설명 13 / 18 · `fg-neutral-subtle`, 위아래 12 · 좌우 24. 앞 붙이개는 물건이면 [Logo Tile](logo-tile.md) 40(은행 · 증권 · 카드사), 카드 상품이면 카드 그림 56([Image Frame](image-frame.md) 카드 비율), 사람이면 [Avatar](avatar.md) 36 · 42 다. 단종 카드처럼 고를 수는 있지만 알릴 것이 있으면 흐리게 두지 않고 [Badge](badge.md)("단종" — `weak` `neutral`)를 단다.

[그림: 결과 줄 — 로고 타일 40 · 카드 그림 56 · 아바타, 단종 배지](../../site/components/specs/searchable-list.tsx#rows)

[표: 앞 붙이개](searchable-list.yaml#prefix)

[표: 결과 줄](searchable-list.yaml#base.enabled@option)

[표: 제목](searchable-list.yaml#base.enabled@title)

[표: 설명](searchable-list.yaml#base.enabled@detail)

### 지금 값 — 오른쪽 라디오

하나 고르기라 줄 오른쪽에 라디오(24)를 두고 지금 고른 값만 켠다 — 고른 것과 안 고른 것이 모두 보인다([List](list.md) 의 "하나 고르기"). 고른 줄의 바탕을 칠하지 않는다. 라디오는 보는 표시이고, 고름은 줄의 `aria-selected` 가 알린다.

[그림: 지금 값 — 신한 라디오 켬 · 나머지 꺼짐](../../site/components/specs/searchable-list.tsx#selected)

[표: 고름](searchable-list.yaml#selected)

[표: 라디오](searchable-list.yaml#base.enabled@radio)

### 누르면 바로 더하는 목록 — 라디오 없음

줄을 누르는 것이 "고르기" 가 아니라 "더하기" 인 목록 — 투자 폼의 "종목 추가" 처럼 누른 줄이 바로 더해지고 시트 · 팝오버가 닫히는 목록 — 에는 라디오를 두지 않는다(`selectionMark={false}`). 지금 값이 없으니 동그라미가 채워질 일이 없고, 빈 동그라미는 "골라 두고 확인을 누르는" 목록으로 읽힌다. 라디오만 빼고 나머지는 그대로다 — 검색칸 · 키보드(↓ · ↑ · `Enter`) · 강조 바탕 · 결과 없음 · 줄 좌우 24 · 제목 오른쪽 10. 줄 높이는 라디오가 없어도 최소 48 이다(한 줄 46 으로 줄지 않는다). 하나를 골라 칸에 넣는 목록(은행 · 증권 · 카드 상품 · 결재자)은 지금 값이 보여야 하므로 라디오 그대로다(2026-10-29 사용자 결정 17-1 Q4 = B).

| 목록 | 줄을 누르면 | 오른쪽 |
|---|---|---|
| 칸에 넣는 고르기(은행 · 카드 상품 · 결재자) | 그 값을 고른다 — 시트는 닫히고 칸에 들어간다, 단계 안은 라디오만 바뀐다 | 라디오(지금 값) |
| 누르면 바로 더하는 목록(종목 추가 · 맨 아래 "직접 추가" 줄도) | 그 줄을 더하고 닫는다 — 지금 값을 들지 않는다 | 없음 |

[그림: 종목 추가 — 라디오 없는 줄 · 은행 고르기 — 라디오](../../site/components/specs/searchable-list.tsx#action-guide)

[표: 지금 값 표시](searchable-list.yaml#selectionMark)

### 분류 머리

분류가 있는 목록(은행 · 증권사)은 [List](list.md) 의 목록 제목(`mediumWeak` — 14 · 500 · `fg-neutral-subtle`)으로 묶는다 — 지금 제품의 분류 차례 그대로(은행은 시중은행 · 인터넷은행 · 지방은행 · 특수은행 · 저축기관 · 외국계 · 기타, 투자는 증권사 · 상품거래소 · 가상자산거래소). 거르면 줄이 남지 않은 분류는 머리째 숨긴다. 분류를 칩으로 고르게 하지 않는다(사용자 결정 13A — 기관 34곳은 칩 묶음이 아니라 검색 + List 줄이다).

[그림: 은행 고르기 — 시중은행 · 인터넷은행 머리 + 로고 타일 줄](../../site/components/specs/searchable-list.tsx#groups)

[표: 분류 머리](searchable-list.yaml#base.enabled@groupHeader)

### 놓이는 자리 — 고르면 닫힐까

| 자리 | 고르면 | 근거 |
|---|---|---|
| 검색 시트 · 팝오버(`sheet` — 기본) | 고르고 닫힌다 — "완료" 를 두지 않는다. 열면 검색칸에 초점 — 시트 · 팝오버의 첫 초점으로 받는다(`onOpenAutoFocus`, 열린 뒤 다시 옮기지 않는다). 지금 값이 보이게 스크롤 | [Input Button](input-button.md) 의 "긴 목록은 검색 시트" · "목록은 누르면 바로" |
| 화면 · 단계 안(`inline`) | 라디오만 바뀐다 — 닫거나 넘기지 않고, 단계의 버튼("다음" · "저장")이 반영한다 | [Select Box](select-box.md) 의 "반영은 버튼" |

시트는 1280 미만, 팝오버는 1280 이상이다(Input Button). 여럿을 고르는 검색 목록은 이 컴포넌트가 아니다 — 다음 차례에 정한다.

[그림: 시트 — 누르면 닫히고 칸에 들어간다 · 단계 안 — 라디오가 바뀌고 "다음"](../../site/components/specs/searchable-list.tsx#placement)

[표: 놓인 자리](searchable-list.yaml#placement)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 줄 바탕 없음 |
| `highlighted` | ↓ · ↑ 로 짚은 줄 · 마우스를 올린 줄 — 좌우 6 들어온 `bg-layer-default-pressed` · 모서리 10. 한 번에 한 줄, 초점은 검색칸에 그대로. 마우스로 짚은 강조는 포인터가 목록을 떠나면 지운다(키보드로 짚은 강조는 남는다) |
| `pressed` | 같은 바탕 + 콘텐츠만 2px 거리 축소(List) |

마우스로 짚거나 누르면 바탕이 좌우 0 → 6 들어오며 모서리 0 → 10 으로 둥글어진다(150ms) — [Menu](menu.md) 알약 · [List](list.md) 의 누름 바탕과 같은 움직임이다(2026-10-15 사용자 결정 — 구현 세션 질문 Q-009-3, 안 B. Searchable List 강조도 따라간다). 화살표로 옮길 때는 전환 없이 바로 바뀐다. 마우스가 목록(`listbox`)을 떠나면 마우스로 짚은 강조를 지운다 — Menu · Select · List 의 호버와 같다(2026-10-15 사용자 결정 — 구현 세션 질문 Q-007-2, 안 B). 그래서 마우스로 짚고 `Enter` 를 누르려면 마우스가 목록 위에 있어야 하고, 지운 뒤의 `↓` 는 첫 줄부터다.

[그림: 상태 — 강조(키보드) · 강조(마우스) · 누름](../../site/components/specs/searchable-list.tsx#states)

[표: 상태 — 강조 바탕](searchable-list.yaml#matrix@highlight)

[표: 상태 — 결과 줄](searchable-list.yaml#matrix@option)

[표: 모션](searchable-list.yaml#motion)

## Guidelines

### 키보드 — 초점은 검색칸에

치면서 바로 고른다 — 초점은 늘 검색칸에 있고, 화살표는 결과 사이의 강조만 옮긴다(사용자 결정 — 콤보박스, SEED 문서 사이트 검색과 같다). 줄은 `Tab` 으로 들어가지 않는다.

| 키 | 동작 |
|---|---|
| 글자 | 거른다 — 강조는 지운다 |
| `↓` · `↑` | 강조를 한 줄씩 옮긴다(강조가 없으면 `↓` 는 첫 줄 · `↑` 는 마지막 줄, 끝에서 멈춘다). 분류 머리는 건너뛴다. 강조한 줄은 보이게 스크롤 |
| `Enter` | 강조한 줄을 고른다 — 시트는 닫히고, 단계 안은 라디오가 바뀐다. 강조가 없으면 아무것도 하지 않는다(폼을 제출하지 않는다) |
| `Esc` | 검색어가 있으면 지운다. 비었으면 시트 · 팝오버를 닫는다(값은 그대로) |
| `Tab` | 검색칸을 떠나 다음 자리(시트의 닫기 · 단계의 버튼)로 |

[그림: 직접 눌러 보기 — 검색칸에서 ↓ ↓ Enter](../../site/components/specs/searchable-list.tsx#keyboard)

### 거르는 규칙

검색어와 줄의 이름 · 별칭을 NFC 로 맞추고, 대소문자와 공백을 무시해 이름이나 별칭 하나에 검색어가 들어 있으면 남긴다 — "kx 은행" 은 KX은행을, "모아 카드" 는 모아카드를 찾는다. 들고 있는 목록(은행 · 증권사)과 서버 검색(카드 상품 · 종목)이 같은 규칙이다. 화면마다 규칙을 따로 두지 않는다 — 지금 제품의 규칙을 공용으로 적은 것이다(2026-10-15 사용자 결정 — 구현 세션 질문 Q-007-1, 안 C). 초성 검색은 아직 정하지 않았다(따로 정한다).

[표: 결과 목록](searchable-list.yaml#base.enabled@results)

### 서버 검색은 300ms 기다렸다

서버에서 찾는 목록(카드 상품 · 종목)은 마지막 입력 뒤 300ms 에 한 번 보낸다 — 글자마다 보내지 않는다. 들고 있는 목록(은행 · 증권사)은 치는 대로 바로 거른다. 받는 동안은 옛 결과를 남기고(강조만 지운다), 1초가 넘으면 줄 스켈레톤으로 바꾼다.

[그림: "taptap" 여섯 글자 — 요청 한 번](../../site/components/specs/searchable-list.tsx#debounce-guide)

### 결과 없음 · 실패 · 불러오는 동안

결과가 없으면 목록 자리에 [Result Section](result-section.md) `medium` — "'{검색어}'에 대한 검색 결과가 없어요" — 을 두고 보조 기술에 한 번 알린다(`role="status"`). 결과가 있을 때는 개수를 알리지 않는다(SEED 문서 검색과 같다 — `↓` 로 들어가면 안다). 못 불러왔으면 0건과 다르게 `failure` — "검색 결과를 불러오지 못했어요" + "다시 시도" 다 — 실패를 "결과가 없어요" 로 보이지 않는다. 처음 불러오는 동안은 줄 모양 [Skeleton](skeleton.md) 다섯이다(앞 자리 · 제목 · 설명, 줄 높이 그대로).

[그림: 0건 · 실패 + 다시 시도 · 줄 스켈레톤](../../site/components/specs/searchable-list.tsx#status-guide)

[표: 결과 없음 · 실패](searchable-list.yaml#base.enabled@status)

[표: 불러오는 줄](searchable-list.yaml#base.enabled@skeleton)

### 은행 · 증권 고르기는 List + 로고 타일

기관 고르기는 검색칸 + 분류 머리 + 로고 타일 40 줄 + 오른쪽 라디오다 — 다른 고르기 화면과 같은 줄이다(사용자 결정). 기관 색 칩 34개를 분류로 묶어 두지 않는다(13A — 13B 분류별 칩은 고르지 않았다). 칩으로 고르는 폼 값은 2 ~ 4개(Select 의 판단 순서)이고, 목록을 거르는 칩은 [Chip](chip.md) 필터 바다 — 두 쓰임을 나눠 읽는다(2026-10-22 사용자 결정 3B — https://claude.ai/artifact/SmHD31RQxTjWbfK83nbcym).

[그림: List + 로고 타일 · 분류별 칩 묶음](../../site/components/specs/searchable-list.tsx#chips-guide)

### 언제 쓰나

선택지가 적으면 Searchable List 가 아니다 — 개수 · 글 길이로 고르는 표는 Select 의 ["고르는 컴포넌트 고르기"](select.md#고르는-컴포넌트-고르기) 한 곳이다(2026-10-22 사용자 결정 1B).

| 선택지 | 쓰는 것 |
|---|---|
| 스크롤로 찾기 어렵다(기관 · 상품 · 종목 · 사람) | Searchable List — [Input Button](input-button.md) 의 검색 시트 |
| 고르는 것이 그 단계의 일(자산 추가의 "기관 고르기") | Searchable List `inline` |

### 다음 차례

일치하는 글자 강조 · 최근 검색 · 여럿 고르는 검색 목록은 이번에 정하지 않았다 — 기능이 생기는 차례에 정한다. 초성 검색("ㅎㄴ" → 하늘은행)도 아직 정하지 않았다(따로 정한다).

### 글

placeholder 는 "{무엇} 검색"("은행 이름 검색" · "카드 이름 검색") — 마침표 없이. 0건 제목은 "'{검색어}'에 대한 검색 결과가 없어요", 설명은 할 수 있는 일("카드사 이름으로도 찾아보세요."). 분류 머리는 짧은 명사("시중은행").

## 코드

레시피 `recipes/shadcn/components/ui/searchable-list.tsx` 를 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `SearchableList` — 묶음. `value` · `defaultValue` · `onValueChange(value)`(고르면 — 시트는 여기서 닫는다) · `query` · `defaultQuery` · `onQueryChange(query)`(치는 대로) · `onSearch(query)`(서버 검색 — 마지막 입력 뒤 `searchDelay` 기본 300ms 에 한 번) · `placement`(`"sheet"` 기본 · `"inline"`) · `size`(`"responsive"` 기본 — 1280 미만 large · 이상 medium, 앱은 large) · `selectionMark`(기본 `true` — 줄 오른쪽 라디오. 누르면 바로 더하고 닫는 목록은 `false`, 그때는 `value` 를 주지 않는다).
- `SearchableListInput` — 검색칸(Input 밑줄형 · 앞 돋보기 · 지우기 — `variant="underline"` 을 스스로 건다). `placeholder` · `aria-label`(기본 "검색"). `role="combobox"` · `aria-controls` · `aria-activedescendant` · 화살표 · `Enter` · `Esc` 를 맡는다. 스스로 초점을 옮기지 않는다 — 시트 · 팝오버가 열릴 때 `focusSearchableList` 로 넘겨받는다.
- `focusSearchableList(event)` — 시트 · 팝오버의 `onOpenAutoFocus` 에 건다. 첫 초점을 표면 대신 검색칸에 주고, 지금 값이 보이게 가운데로 스크롤한다(열린 뒤 다시 옮기지 않는다).
- `matchesSearch(query, ...names)` — 거르는 규칙(NFC · 대소문자 · 공백 무시 · 포함). 들고 있는 목록은 이름 · 별칭을 넘겨 거른다. 서버 검색도 같은 규칙이다.
- `SearchableListResults` — 결과 목록(`role="listbox"`). `aria-label`(대상 — "은행").
- `SearchableListGroup` — 분류. `label`(List Header `mediumWeak`, `role="group"` 의 이름).
- `SearchableListItem` — 결과 줄(`role="option"`). `value` · `title` · `detail` · `prefix`(LogoTile · 카드 그림 · Avatar). 라디오는 스스로 그린다(묶음의 `selectionMark` 가 `false` 면 그리지 않는다 — 줄 높이는 최소 48 그대로).
- `SearchableListEmpty` — 0건(Result Section `medium` — 제목은 검색어로 만든다 · 알린다). `description` · `title`(검색어 제목 대신).
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

### 종목 추가 — 누르면 바로 더한다

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
| 열기(시트 · 팝오버) | 검색칸에 초점(시트 · 팝오버의 `onOpenAutoFocus` 로 받는다) · 지금 값이 보이게 스크롤. 강조는 없다 |
| 치기 | 들고 있는 목록은 바로 거르고, 서버 검색은 마지막 입력 뒤 300ms 에 한 번 — 강조를 지운다. 거르는 규칙은 둘이 같다(NFC · 대소문자 · 공백 무시) |
| `↓` · `↑` | 강조를 옮긴다(초점은 검색칸) |
| `Enter` | 강조한 줄을 고른다 — 시트 · 팝오버는 닫힌다, 단계 안은 라디오만 |
| 줄 누르기 · 클릭 | 그 줄을 고른다 — 마우스를 올린 줄은 강조와 같은 바탕. 누르면 바로 더하는 목록(`selectionMark={false}`)은 그 줄을 더하고 닫는다 |
| 마우스가 목록을 떠남 | 마우스로 짚은 강조를 지운다 — 키보드로 짚은 강조는 남는다 |
| 지우기 버튼 | 검색어를 비우고 검색칸에 초점 — 전체 목록으로 |
| `Esc` | 검색어를 지운다 → 비었으면 닫는다 |
| 0건 · 실패 | 목록 자리에 Result Section — 바뀌면 한 번 알린다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 `fg-neutral` 시트 위 16.41 · 다크 11.62, 강조 바탕 위 15.48 · 10.32 ✓. 설명 · 분류 머리 `fg-neutral-subtle` 5.50 · 다크 5.27, 강조 바탕 위 5.18 · 4.68 ✓. placeholder `fg-placeholder` 같은 값 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 돋보기 `fg-neutral-muted` 7.11 · 6.67 ✓. 라디오 · 검색칸 테두리는 Radio · Input 의 검증. 강조 바탕(1.06 · 다크 1.13)은 장식 — 강조는 `aria-activedescendant` 로 읽힌다 |
| **WCAG 2.1.1** Keyboard | 치기 · ↓ · ↑ · `Enter` · `Esc` 로 모두 된다 ✓ — 줄마다 `Tab` 이 걸리지 않는다 |
| **WCAG 4.1.3** Status messages | 0건 · 실패를 `role="status"` 로 한 번 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 결과 줄 48 이상 · 지우기 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 결과 줄 전체 ✓ |
| **ARIA** | 검색칸 `role="combobox"` · `aria-expanded="true"` · `aria-controls`(목록) · `aria-autocomplete="list"` · `aria-activedescendant`(강조한 줄의 id, 없으면 비움) · 이름 "검색". 목록 `role="listbox"` + 이름, 분류 `role="group"` + `aria-labelledby`(머리), 줄 `role="option"` · `aria-selected`(지금 값). 라디오 · 로고 타일은 `aria-hidden` |

## Do / Don't

### ✅ Do

- 검색칸은 Input 밑줄형 + 돋보기 · 지우기 · 이름 "검색", 위에 붙인다.
- 결과는 List 줄 — 물건은 로고 타일 40, 카드는 카드 그림 56, 지금 값은 오른쪽 라디오.
- 누르면 바로 더하고 닫는 목록(종목 추가)은 라디오를 끈다(`selectionMark={false}`) — 줄 높이 48 · 좌우 24 는 그대로.
- 초점은 검색칸 · 화살표는 강조만 · `Enter` 로 고른다.
- 서버 검색은 300ms 뒤 한 번.
- 0건은 "'{검색어}'에 대한 검색 결과가 없어요" + 알림, 실패는 따로 + 다시 시도.
- 분류가 있으면 List Header 로 묶는다.

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

`searchable-list.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Searchable List 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다. 줄 · 검색칸의 나머지 값은 `list.yaml` · `input.yaml` 이다.

[그림: Specification — searchable-list.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#searchable-list)

## SEED 와 다른 점

- **groo 가 둔 컴포넌트다** — SEED 는 Combobox 를 아직 두지 않았고 Search Bar 는 Figma 에만 있다. 검색칸 · 결과 줄 · 라디오 · 결과 없음은 SEED 부품, 키보드는 SEED 문서 사이트의 검색 창을 따랐다.
- **강조 바탕은 불투명한 `bg-layer-default-pressed`** — SEED 문서 검색은 `bg.transparent-pressed`(투명도 있음)다(v102). 모양(좌우 6 · 모서리 10)은 List 의 누름 바탕이다.
- **지우기 버튼** — SEED Text Input 은 문서 · Figma 에만 Clear Button 이 있고 코드에 없다.
- **목록은 listbox · option** — SEED 문서 검색은 한 줄에 카드 셋이라 grid 다. groo 결과는 한 줄에 하나라 listbox 다.
- **서버 검색 300ms · 분류 머리 · 실패 · 놓이는 자리** — SEED 에 규칙이 없다.
- **결과 개수를 알리지 않는다** — SEED 문서 검색과 같다(0건만 알린다).

## Migration notes

### 2026-10-29 — 누르면 바로 더하는 목록은 라디오 없음

사용자 결정 17-1 Q4 = B — 투자 폼 "종목 추가" 의 결과 줄은 누르면 고르는 게 아니라 그 종목이 바로 더해지고 시트가 닫혀서, 오른쪽 동그라미가 한 번도 채워지지 않았다(맨 아래 "직접 추가" 줄에도 붙어 있었다). 그런 목록은 라디오를 뺀다 — 묶음에 `selectionMark={false}`(yaml 축 `selectionMark` "on" · "off"). 나머지(검색칸 · 키보드 · 강조 · 결과 없음 · 줄 좌우 24 · 제목 오른쪽 10)는 그대로이고, 줄 높이는 라디오가 없어도 최소 48 이다 — yaml `option.minHeight` 48 을 더하고 `paddingY` 비고의 "한 줄 48(라디오 24)" 를 고쳤다. 은행 · 카드 상품 고르기는 라디오 그대로. 고르지 않은 안: A(지금 그대로 — 줄마다 빈 라디오) · C(검색칸 + 누르는 List 줄 — B 와 겉모습이 같고 키보드 · 빈 결과 화면을 다시 만들어야 한다). 설명 https://claude.ai/artifact/2wHgeNPdst2q6LQzdD1AvS. 레시피 `SearchableList` 에 `selectionMark` 를 더하고 결과 줄에 최소 높이 48(`min-h-12`)을 걸었다. 새 토큰 없음.

### 2026-10-22 — 폼 값 칩과 거르기 칩을 나눠 읽는다

결정 13A(기관은 칩 묶음이 아니라 검색 + List 줄)의 까닭 글 "칩은 2 ~ 4개 짧은 폼 값에만" 이 일반 규칙으로 읽혀 Chip 의 거르기 칩 결정(5개 이상 · 개수가 바뀌는 축)과 부딪쳤다. 결정 문장은 그대로 두고, 폼 값 칩(2 ~ 4)과 거르기 칩(필터 바)을 나눠 적었다(3B). "언제 쓰나" 표의 개수 줄은 Select 의 판단 순서로 링크한다(1B) — 사용자 결정 https://claude.ai/artifact/SmHD31RQxTjWbfK83nbcym.

### 2026-10-15 — 구현 세션 질문(Q-007 · Q-009-3)

구현 세션이 만들며 찾은 빈칸을 정했다.

- **거르는 규칙**(Q-007-1, 사용자 결정 안 C) — 지금 제품 규칙(이름 · 별칭, NFC · 대소문자 · 공백 무시)을 공용으로 적었다. 웹 · 앱 견본은 별칭을 넣고(앱은 NFC 도), 서버 카드 검색(가운데 공백을 그대로 본다)도 공백을 무시하게 고친다(백엔드). 초성 검색은 아직 정하지 않았다(따로 정한다).
- **마우스 강조는 목록을 떠나면 지운다**(Q-007-2, 사용자 결정 안 B) — 웹은 목록에 `pointerleave`, 앱은 `MouseRegion.onExit` 를 단다. 키보드로 짚은 강조는 남긴다.
- **첫 초점은 시트가 넘겨준다**(Q-007-3, 정리 — 두 스펙이 어긋나 있었다) — 검색칸이 스스로 초점을 잡고 한 프레임 뒤 다시 잡지 않는다. 시트 · 팝오버의 `onOpenAutoFocus` 가 검색칸에 준다(앱은 `PBottomSheet` 가 첫 초점 노드를 받는다).
- **줄 높이 48**(Q-007-4, 정리) — 비고의 46 은 숫자 오류였다. 결과 줄은 늘 라디오(24)가 있어 48 이다(웹 · 앱 그대로). — 2026-10-29 라디오 없는 줄이 생겨 "최소 높이 48" 로 고쳐 적었다(아래 같은 날 notes).
- **강조 바탕이 들어오며 둥글어진다**(Q-009-3 안 B 를 따른다) — 좌우 6 · 모서리 10 고정에서 0 → 6 · 0 → 10(150ms). 웹 · 앱 모두 마우스 · 누름일 때 들임 · 모서리도 전환한다(화살표는 바로).

### 2026-10-08 — List 줄 · 콤보박스 키보드로 다시 쓴다

사용자가 [데이터 표시 비교 페이지](https://claude.ai/artifact/85zjM3PRBiEGnqjXXRrPRj)에서 정했다 — 키보드는 콤보박스(12A — 초점은 입력칸, ↓ · ↑ 로 강조, 강조 바탕 `bg-layer-default-pressed`, `Enter` 로 고름. 모양은 List 줄 + 오른쪽 라디오 + 로고 타일 40), 은행 · 증권 고르기는 List + 로고 타일 40 + 오른쪽 라디오 + 위 검색 + 분류 머리는 List Header(13A). 그리고 "따라오는 것" — 서버 검색 300ms · 0건 Result Section "'{검색어}'에 대한 검색 결과가 없어요" + 알림 · 실패는 따로 · 결과 줄 16 / 22 · 13 / 18 · 카드 그림 56, 일치 강조 · 최근 검색은 다음 차례. 라디오 목록 키보드(12B) · 분류별 칩(13B)은 고르지 않았다. 스펙을 쓰다 나온 것 — 목록 위 검색칸은 밑줄형(17A — Input 의 "화면에 입력이 하나뿐이면 밑줄", 상자형 52(17B)는 고르지 않았다). 옛 스펙은 `searchable-list.history/v-pre-seed-data.*` 에 남겼다.

| 옛 Searchable List | 새 Searchable List |
|---|---|
| 결과 상자 — 1px 테두리 · 모서리 6 · 줄 사이 선 · 최대 200 · 260 · 320 | 상자 없음 — List 줄, 놓인 자리를 채우고 스크롤 |
| 크기 셋(sm · md · lg) — 줄 위아래 8 · 10 · 14, 썸네일 32 × 20 · 44 × 28 · 56 × 36 | List 줄 하나 — 위아래 12 · 좌우 24, 로고 타일 40 · 카드 그림 56 · 아바타 |
| 제목 13 · 500, 부제 11.5 | 16 / 22 · 400, 13 / 18 |
| 고른 줄 `bg-brand-subtle` + 제목 브랜드 600 | 오른쪽 라디오 — 줄 바탕은 그대로 |
| 검색칸 왼쪽 36 · 아이콘 14 `text-tertiary`(옛 겹쳐 그리기 값) | Input 밑줄형 large 40 · medium 34, 앞 아이콘 24 · 20 |
| 0건 — 12 글 한 줄 | Result Section `medium` + 알림, 실패는 따로 |
| `↑↓` 는 RadioGroup 일 때만 · `Enter` 첫 줄 | 콤보박스 — 초점은 검색칸, 화살표는 강조, `Enter` 는 강조한 줄 |
| 단종 — 불투명도 0.7 | "단종" 배지 |

제품은 앱 적용 단계에서 옮긴다(2026-10-08 조사 — Desk 웹 · HR 은 크로미움에 띄워 쟀고, Desk 앱은 코드로 봤다).

- **Desk 웹 카드 상품(`widgets/asset-full/ui/AssetEditDialog.tsx:998-1111` · 공용 `shared/ui/searchable-list.tsx`)** — 검색칸 36 · 13 · 돋보기 14 를 겹쳐 그렸고(`aria-hidden`) 이름 · 지우기 · `aria-controls` 가 0 이다. 줄은 `<button aria-pressed>` 59.8 · 썸네일 44 × 28 · 제목 13 / 500 · 부제 11.5, 목록 역할 · 결과 알림 0(`searchable-list.tsx:71-100 · 128-175`, D20). 입력에서 ↓ · `Enter` 가 아무 일도 안 하고 `Tab` 이 11줄을 하나씩 지난다. 실패하면 "검색 결과가 없어요" 로 보인다(`:84-100`, D2).
- **글자마다 서버 요청** — 카드 목록이 키워드마다 `useCardCatalogs` 를 바로 불러 6자에 6번 요청한다(`AssetEditDialog.tsx:443-450` · 앱 `features/asset/presentation/card_add_dialog.dart:479-488` — Timer 0, D10). 300ms 로. 종목 검색(`:358` · `features/stock/ui/stock-dialogs.tsx:50-130`)은 이미 300ms 다.
- **은행 · 증권사 칩 묶음** — 검색 + 분류별 칩 34개(32 알약 · 12.5 / 500, 고르면 기관 색 채움, 분류 머리 10.5 / 600 대문자 변환, Radix ToggleGroup — `AssetEditDialog.tsx:1119-1245`). 묶음 이름이 없다. 분류 머리 + 로고 타일 줄로.
- **Desk 앱** — 카드 상품은 손으로 짠 `_CatalogList`(`card_add_dialog.dart:595-600 · 929-1060` — 최대 260 · 썸네일 44 × 28 · 고름 `bgBrandSubtle`), 검색칸 `PSearchField` 36 · 13 · 앞 아이콘 16. 로딩은 진행 원(웹은 스켈레톤), 실패 글은 따로 있다(`assetCatalogLoadError`). 은행 · 종목 · 카드 혜택 검색(`account_add_dialog.dart` · `investment_add_dialog.dart` · `card/presentation/card_catalog_picker.dart` · `card_benefits_screen.dart` · `stocks/presentation/toss_stocks_view.dart`)도 같은 묶음으로. 스펙을 옮겨 둔 `shared/widgets/p_searchable_list.dart` 는 쓰는 곳이 0 이다(D29).
- **HR 사용자 고르기** — 권한 화면 사용자 줄이 `div` onClick 60 · `tabindex −1` · 역할 0 이라 키보드로 고를 수 없다(`features/admin-authority/ui/UserList.tsx:15-70 · 45-58`, D9). 고른 줄 #E9EFFD + 이름 #2563EB(4.49) · 이메일 3.83, 0건 "사용자를 찾을 수 없습니다."(합쇼체 · 알림 0). 아바타 줄 + 콤보박스로.
- **걷은 것** — 웹 `features/card-catalog/ui/CardCatalogCombobox.tsx`(cmdk — 쓰는 곳 0, D29)는 2026-10-15 Command 와 함께 지웠다.
- **전역 검색** — 웹은 "준비 중"(`pages/search/ui/SearchPage.tsx`), 앱은 진짜 검색(350ms · 거르기 시트 — `features/search/presentation/search_screen.dart:72`)인데 실패하면 서버 글을 그대로 보인다(`:360-369`, D23). 거래를 찾는 화면이라 이 컴포넌트가 아니다 — 결과는 거래 줄(List)이고, 실패는 Result Section 이다.
- **여럿 고르는 목록** — HR 역할 고르기(`features/admin-authority/ui/UserRoleAssignment.tsx:98-130` cmdk + 체크 · `MobileRoleSelector.tsx:80-140` 시트 + 체크)는 검색 목록이 아니라 [Select Box](select-box.md) 여럿 고르기(이름 + 설명) + "저장" 한 번으로 정했다(2026-10-15 마무리 10A — 폰 · 데스크톱 같은 모양, 검색 시트 · 팝오버 + 완료(10D)는 고르지 않았다). 여럿 고르는 검색 목록은 아직 없다 — 두 칸 옮기기(`shared/ui/shadcn/transfer.tsx`)는 그 차례에 정한다.
