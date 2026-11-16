# Attachment Input

> 사진 · 파일을 골라 붙이는 칸입니다. 거래 영수증 · 메모 첨부처럼 여럿을 붙이는 자리는 첨부 타일 + 항목 줄, CSV · Excel 가져오기처럼 파일 하나를 골라 바로 넘기는 자리는 드롭존을 씁니다. 사람의 프로필 사진은 [Avatar](avatar.md) 의 "사진 바꾸기" 이고, 붙은 사진을 보이기만 하는 자리는 [Image Frame](image-frame.md) 입니다.

수치 원본은 [`attachment-input.yaml`](attachment-input.yaml)입니다.

[그림: Desk 거래 상세 — 영수증 PDF 하나 + 사진 아홉(올리는 중 · 실패 하나씩) = 10/10, 폰 시트 · 데스크톱 대화상자 480, 라이트 · 다크](../../site/components/specs/attachment-input.tsx#hero)

### 직접 골라 보기

모양(타일 · 드롭존) · 받는 형식 · 최대 개수 · 대표 배지 · 순서 바꾸기 · 막힘 · 읽기 전용을 고르면 스펙대로 그린 칸과 그 코드가 바뀝니다. 실제로 파일을 고르고 끌어 놓을 수 있습니다 — 올리는 중 · 실패 · 다시 시도와 거절 안내가 함께 보입니다.

[그림: 플레이그라운드](../../site/components/specs/attachment-input.tsx#playground)

## Anatomy

[그림: 첨부 타일 · 사진 항목 · 파일 카드 · × · 대표 띠, 드롭존 · 파일 선택 버튼](../../site/components/specs/attachment-input.tsx#anatomy)

| ⓐ Trigger | 첨부 타일 — 80 × 80, 아이콘 24 + 개수("3/10")입니다. 누르면 고르기 창(앱은 메뉴 시트)이 열립니다. |
| ⓑ Image Item | 사진 항목 — 80 × 80 썸네일 + 투명 윤곽입니다. 올리는 중 · 실패는 사진 위 덮개로 보입니다. |
| ⓒ File Item | 파일 카드 — 160 × 80, 썸네일 칸 48 + 이름(네 줄까지) + 크기입니다. |
| ⓓ Remove Button | 지우기 × — 20 원으로, 항목 오른쪽 위에 걸칩니다. 누르는 자리는 44 입니다. |
| ⓔ Badge | 대표 띠 — 첫 사진 아래 24, 쓰는 자리에만 둡니다. |
| ⓕ Dropzone | 드롭존 — 높이 120, 안내 + 파일 선택 버튼입니다. 1280 이상 웹에만 둡니다. |
| ⓖ Item Menu | 항목 메뉴 — 항목을 누르면 열립니다. 크게 보기 · 대표로 정하기 · 앞으로 옮기기 · 뒤로 옮기기 \| 지우기. |

항목의 모양은 **파일 종류**가 정합니다 — 사진(`image/*`)은 썸네일, 그 밖(PDF · 표)은 파일 카드이고 한 줄에 섞입니다. × 둘레는 항목 모서리를 × 보다 2 크게 파내 사진 · 덮개 · 윤곽이 × 에 닿지 않습니다.

[표: 부위](attachment-input.yaml#slots)

## Properties

### Layout

- **`tile`**(기본) — 첨부 타일 + 항목 줄입니다. 영수증 · 메모 첨부처럼 여럿을 붙이고 사진이 섞이는 자리에 씁니다. 항목 줄은 화면(시트 · 대화상자 본문) 가장자리까지 넓히고 넘치면 가로로 스크롤합니다 — 첫 항목은 다른 칸과 같은 자리(24)에서 시작하고, 좌우 끝은 늘 20 흐립니다([Scroll Fog](scroll-fog.md) `row` — 스크롤바는 숨깁니다). 앱은 칸이 제 상자 밖을 받지 못하므로 놓는 화면이 칸을 화면 폭에 두고 안쪽 여백 24 를 줍니다([Chip](chip.md) 스크롤 줄과 같은 방법) — [Field](field.md) 안이면 Field 의 머리 · 꼬리를 24 들여 라벨이 다른 칸과 같은 자리에 섭니다. 칸을 화면 여백 안에 둔 채 쓰지 않습니다 — 늘 켜진 흐림 20 이 첨부 타일을 깎기 때문입니다.
- **`dropzone`** — 파일 하나를 골라 바로 서버로 넘기는 자리(CSV · Excel 가져오기)에 씁니다. 1280 이상 웹은 드롭존(높이 120 · 1px 실선 · 안내 "파일을 여기로 끌어다 놓으세요" + "파일 선택" 버튼), 1280 미만 웹 · 앱은 끌어 놓기가 없으니 드롭존 없이 "파일 선택" 버튼(large · 칸 폭 · 앞 아이콘 `upload`)만 둡니다. 고른 파일은 아래 파일 카드로 보입니다. 썸네일 · 여럿 · 순서 · 개수가 필요 없는 자리입니다.

[그림: tile — 영수증 10/10 한 줄(끝까지 민 모습 · 처음) · dropzone — 1280 드롭존 · 390 파일 선택 버튼](../../site/components/specs/attachment-input.tsx#layout)

[표: 모양](attachment-input.yaml#layout)

### Trigger

첨부 타일은 80 × 80 · 모서리 12 · 1px `stroke-neutral-weak` · 투명 바탕입니다. 아이콘 24 `fg-neutral-subtle`(사진을 받으면 `image`, 파일만 받으면 `paperclip`) 아래에 개수를 둡니다 — 지금 개수 `fg-neutral` + "/최대" `fg-neutral-subtle`(12 / 16 · 400). 최대가 없으면 개수를 두지 않습니다 — "n/최대" 는 서버에 같은 개수 한도가 있을 때만 씁니다. 다 차면 타일이 막힙니다 — 아이콘 · 개수가 `fg-disabled` 이고, `aria-disabled` 라 초점은 남아 "10/10, 사용할 수 없음" 을 읽습니다. 누르면 바탕 + 타일만 2px 거리로 줄입니다.

[그림: 0/10 · 3/10 · 10/10 막힘 · 개수 없음(최대 없음)](../../site/components/specs/attachment-input.tsx#trigger)

[표: 첨부 타일](attachment-input.yaml#base.enabled@trigger)

[표: 다 찼을 때](attachment-input.yaml#matrix.capacity.full@trigger+triggerIcon+count+countMax)

### Item

[표: 사진 · 파일](attachment-input.yaml#kind)

[표: 항목 공통](attachment-input.yaml#base.enabled@item)

[표: 파일 카드 — 썸네일](attachment-input.yaml#base.enabled@thumbnail)

[표: 파일 카드 — 이름](attachment-input.yaml#base.enabled@name)

[표: 파일 카드 — 크기](attachment-input.yaml#base.enabled@size)

사진은 투명 윤곽 1px `stroke-neutral-overlay`(Image Frame · Avatar 와 같습니다)를 그림 위에 겹쳐 그립니다. 파일 카드는 썸네일 칸 48(`bg-neutral-weak` · 모서리 8 · 아이콘 24) + 이름(12 / 16 · 500) + 크기(11 / 15 · `fg-neutral-subtle` · "9.8MB")입니다.

[그림: 사진 80 · 파일 카드 160 × 80 — 한 줄에 섞인다, 윤곽 · 썸네일 칸 · 이름 폭 70](../../site/components/specs/attachment-input.tsx#items)

#### 파일 이름 — 네 줄 · 확장자는 남깁니다

이름은 폭 70 에 **글자 단위**로 줄을 바꾸고(`word-break: break-all`) **네 줄까지** 보입니다 — 네 줄(64) + 크기(15) 가 80 상자에 듭니다. 파일 이름은 문장이 아니라 이름표입니다 — 띄어쓰기 없이 밑줄 · 붙임표로 이어져 단어 단위의 이득이 없고, 글자 단위로 채워야 같은 칸에 이름이 가장 많이 듭니다. 그래서 이 칸은 Typography 의 단어 단위 줄바꿈(keep-all · break-word)의 **예외**입니다. 네 줄을 넘으면 셋째 줄 끝을 "…" 로 줄이고 넷째 줄에 확장자(".xlsx")를 남깁니다 — 끝을 자르면 확장자가 사라져 무슨 파일인지 모르기 때문입니다. 전체 이름은 항목의 이름(보조 기술)에 늘 있습니다.

첫 줄만 오른쪽 4 를 비웁니다 — 네 줄이면 이름이 카드 위에 바짝 붙어 × 둘레 구멍(24)이 첫 줄 끝 글자를 파먹기 때문입니다. 둘째 줄부터는 폭 70 그대로입니다.

[그림: 네 줄에 드는 이름(짧은 PDF)은 그대로 · 가장 나쁜 두 이름(PDF 9.8MB · xlsx 4.2MB)은 넘쳐 셋째 줄 "…" + 넷째 줄 확장자 — 글자 단위, 첫 줄은 × 구멍을 비켜 오른쪽 4, 라이트 · 다크](../../site/components/specs/attachment-input.tsx#name)

### Remove Button

× 는 20 원(`bg-layer-default` · 1px `stroke-neutral-weak` · 아이콘 10 `fg-neutral`)이 항목 모서리 밖으로 위 4 · 오른쪽 4 걸칩니다. 누르는 자리는 44 입니다 — 보이는 원 둘레로 12 씩 넓힙니다(기초 Inclusive Design). 이웃 항목과 겹친 8 도 × 가 먼저 받고, 칸 위에 라벨이 없어도 위 16 이 잘리지 않습니다. 앱은 보이는 자리는 그대로 두고 누르는 44 를 받는 방법을 고릅니다(부모 상자 밖도 받습니다). 이름은 "{파일 이름} 지우기" 이고, 누르면 묻지 않고 지웁니다 — 되돌리기는 다시 고르기입니다. 누르면 바탕 + × 만 2px 줄입니다.

[그림: × 20 · 둘레 구멍 24 · 누르는 자리 44(분홍)](../../site/components/specs/attachment-input.tsx#remove)

[표: 지우기 ×](attachment-input.yaml#base.enabled@removeButton)

[표: 구멍](attachment-input.yaml#base.enabled@removeMask)

### Status

항목은 고른 직후(`pending`) · 올리는 중(`uploading`) · 올림(`success`) · 실패(`error`)입니다. 고른 직후와 올림은 같은 모습입니다.

- **올리는 중** — 값 있는 Progress Circle 24(두께 3 — [Progress Circle](progress-circle.md) "올리기 · 받기")입니다. 사진은 사진 위 딤(라이트 50% · 다크 65%) 가운데 `staticWhite` 원, 파일 카드는 썸네일 칸에서 아이콘 대신 `neutral` 원을 둡니다. 진행이 10초 동안 멈추면 실패입니다. 막대([Progress](progress.md))는 쓰지 않습니다.
- **실패** — 덮개 + "다시 시도"(아이콘 `rotate-cw` 24 + 12 / 16 · 500)입니다. 사진은 검정 65% 덮개 위 흰 글, 파일 카드는 썸네일 · 이름 자리를 다시 시도 하나가 채웁니다(`fg-neutral-subtle`). 실패 덮개는 두 모드 모두 65% 입니다 — 50% 면 흰 사진 위 흰 글이 3.95 로 모자랍니다.

[그림: 상태 — 파일 올리는 중 · 실패 · 사진 올리는 중 · 실패, 라이트 · 다크](../../site/components/specs/attachment-input.tsx#status)

[표: 사진 올리는 중](attachment-input.yaml#matrix.kind.image.status.uploading@backdrop+progressCircle)

[표: 파일 올리는 중](attachment-input.yaml#matrix.kind.file.status.uploading@thumbnailIcon+progressCircle)

[표: 사진 실패](attachment-input.yaml#matrix.kind.image.status.error@backdrop+actionButton)

[표: 파일 실패](attachment-input.yaml#matrix.kind.file.status.error@thumbnail+meta+actionButton)

[표: 다시 시도](attachment-input.yaml#base.enabled@actionButton)

### 대표 배지 · 순서 바꾸기

대표 사진과 순서가 뜻을 갖는 자리(영수증 여러 장의 대표 사진 · 순서 같은 곳)에서 켭니다.

- **대표 배지** — 첫 사진 아래 24 띠(검정 65% · 좌우 4 · 아래 두 모서리 12) 위 흰 글 "대표"(12 / 16 · 500 · 한 줄, `badgeLabel` 로 바꿉니다)입니다. 띠는 두 모드 모두 65% 입니다(Image Frame 의 Indicator 와 같은 까닭).
- **순서 바꾸기** — 항목을 끌어 옮깁니다(dnd-kit). 끄는 항목은 2px 줄어든 채 따라가고 × 와 구멍이 사라지며, **사진은 불투명도 0.5**, 파일 카드는 글 · 아이콘이 `fg-disabled` 입니다. 사진의 0.5 는 기초 원칙 "불투명도로 흐리지 않는다" 의 예외로, 이 칸의 끄는 중 · 읽기 전용 사진에만 씁니다. 마우스는 누른 채 8px 넘게 움직이면, 터치는 250ms 누른 채 움직이면 끌기입니다 — 그 전에 움직이면 줄이 가로로 스크롤하고, 그냥 떼면 누르기(메뉴)입니다. 앱도 같습니다 — 250ms 길게 눌러 움직이면 끕니다. 순서를 바꾸면 대표 띠는 새 첫 사진으로 옮겨 갑니다.
- **끌지 않고 옮기기** — 항목을 누르면 메뉴가 열립니다(아래 "항목 메뉴"). 키보드는 항목에 초점을 두고 `Space` 로 들고 `←` `→` 로 옮긴 뒤 `Space` 로 놓습니다(`Esc` 는 그만두기 — 아래 Behavior). 키보드 들기는 웹입니다 — 앱은 들기 대신 접근성 동작(앞으로 옮기기 · 뒤로 옮기기)과 메뉴가 같은 일을 합니다.

[그림: 대표 띠 · 끄는 사진(2px 줄어듦 · 불투명도 0.5 · × 없음) · 키보드로 3번째 사진을 1번째로 — 읽기 글](../../site/components/specs/attachment-input.tsx#badge-reorder)

[표: 대표 띠](attachment-input.yaml#base.enabled@badge)

[표: 끄는 중](attachment-input.yaml#base.dragging)

[표: 사진 — 읽기 전용 · 끄는 중의 흐림](attachment-input.yaml#matrix.kind.image@item)

[표: 파일 카드 — 읽기 전용 · 끄는 중의 글 · 아이콘](attachment-input.yaml#matrix.kind.file@thumbnailIcon+name+size)

### 항목 메뉴

항목(사진 · 파일 카드)을 누르면 메뉴가 열립니다 — 1280 미만 · 앱은 [Menu Sheet](menu-sheet.md)(머리에 전체 파일 이름), 1280 이상은 [Menu](menu.md) 입니다. 끌기가 어려운 사람 · 화면 읽기 · 스위치 사용자도 한 번 누르고 골라 순서를 바꿉니다(WCAG 2.5.7). 순서 바꾸기(`onReorder`)나 크게 보기(`onPreview`)를 줄 때만 열립니다.

- 위 묶음 — **크게 보기**(사진을 누르면 바로 크게 보던 자리는 이 첫 줄로 옮깁니다 — 한 번 더 누릅니다. 파일 카드는 "열기") · **대표로 정하기**(대표 띠를 쓰는 칸의 사진만 — 맨 앞으로 옮깁니다. 띠를 안 쓰면 이 줄을 빼고 넷) · **앞으로 옮기기** · **뒤로 옮기기**(한 칸씩).
- 아래 위험 묶음 — **지우기**(`critical`, 묻지 않고 지웁니다). × 는 지름길로 남고 메뉴에 동작을 다 둡니다 — 스와이프는 지름길이고 같은 동작을 다른 길에 다 두는 원칙과 같습니다([Menu Sheet](menu-sheet.md) "스와이프의 대신 길").
- 끝에 닿으면 그 방향이 막힙니다 — 맨 앞(대표) 항목은 "앞으로 옮기기" · "대표로 정하기", 맨 끝 항목은 "뒤로 옮기기" 입니다. 줄은 보이고 누를 수 없습니다(메뉴의 막힌 줄).
- 옮긴 뒤 초점은 옮긴 항목(새 자리)에, 지운 뒤에는 × 와 같은 규칙입니다. 읽기 전용이면 메뉴 대신 누르면 바로 크게 보기, 막힘이면 누르지 않습니다.

[그림: 390 — 둘째 사진을 누름 · 메뉴 시트(머리 파일 이름 · 크게 보기 · 대표로 정하기 · 앞으로 옮기기 · 뒤로 옮기기 | 지우기) / 1280 — 대화상자 · 메뉴 / 맨 앞 · 맨 끝의 막힌 줄](../../site/components/specs/attachment-input.tsx#item-menu)

[표: 항목 메뉴](attachment-input.yaml#base.enabled@itemMenu)

[표: 항목 자리 — 막히는 줄](attachment-input.yaml#position)

### Dropzone

드롭존(1280 이상 웹)은 높이 120 · 모서리 12 · 1px 실선입니다. 테두리는 `stroke-neutral-solid` 입니다 — 놓인 면 위 흰 면 4.18 · 다크 4.13(시트 · 대화상자 4.18 · 3.58)으로 3:1 이 넘습니다. 파일을 끌고 들어오면 테두리가 `stroke-neutral-contrast`(16.41 · 13.42)로, 바탕이 `bg-layer-default-pressed` 로 함께 바뀝니다 — 기본 테두리와 3.93 · 3.25 로 또렷이 갈립니다. 막히면 테두리도 `stroke-neutral-weak` 로 옅어집니다.

안내 글은 14 / 19 · 500 `fg-neutral-subtle` "파일을 여기로 끌어다 놓으세요", 그 아래 8 에 [Button](button.md) `neutralWeak` small "파일 선택" 입니다 — CTA 가 아닌 보조 동작이고, 높이 120 안에 안내와 함께 듭니다. 상자 전체를 누르는 자리로 두지 않습니다 — 키보드는 이 버튼으로 닿습니다. 고른 파일은 드롭존 아래 8 에 파일 카드로 보이고(분석 중이면 썸네일 칸에 원), 하나를 고르면 드롭존이 막힙니다(최대 1). 바꾸려면 × 로 지우고 다시 고릅니다.

테두리는 늘 1px 실선입니다 — 끄는 동안은 색 · 바탕으로 알립니다. 끄는 동안 "파일 선택" 버튼 면(`bg-neutral-weak`)은 끌기 바탕(`bg-layer-default-pressed`)과 1.02 · 1.00:1 로 섞여 글만 남습니다 — 끄는 중엔 누를 일이 없어 그대로 둡니다.

[그림: 1280 — 드롭존 · 끌어 들어온 모습 · 고른 뒤 파일 카드 + 원 / 390 · 앱 — 파일 선택 버튼 + 파일 카드](../../site/components/specs/attachment-input.tsx#dropzone)

[표: 드롭존](attachment-input.yaml#matrix.layout.dropzone@dropzone+dropzoneLabel)

[표: 파일 선택 버튼](attachment-input.yaml#grid.screen.layout.dropzone@pickButton)

[표: 파일 선택 버튼 — 끄는 동안 · 막힘](attachment-input.yaml#matrix.layout.dropzone@pickButton)

| 짝 | 라이트 | 다크 |
|---|---|---|
| 기본 테두리 `stroke-neutral-solid` ↔ 놓인 면 `bg-layer-default` | 4.18 | 4.13 |
| 기본 테두리 ↔ 떠 있는 면 `bg-layer-floating`(시트 · 대화상자) | 4.18 | 3.58 |
| 끌기 테두리 `stroke-neutral-contrast` ↔ 끌기 바탕 `bg-layer-default-pressed` | 15.48 | 10.32 |
| 끌기 테두리 ↔ 기본 테두리(바뀐 것이 보이는가) | 3.93 | 3.25 |
| 안내 글 `fg-neutral-subtle` ↔ 끌기 바탕 | 5.18 | 4.68 |

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 타일 · × 투명 · 흰 바탕, 드롭존 테두리 `stroke-neutral-solid` |
| `hovered` | 웹 — 타일 · × 에 누름과 같은 바탕 `bg-layer-default-pressed`, 축소 없음 |
| `focused` | 키보드 포커스에만 부품 **안쪽** 링 2px — 가로 스크롤 줄이 바깥 링을 자르기 때문입니다 |
| `pressed` | 누른 부품(타일 · × · 다시 시도)만 바탕 + 2px 거리 축소 |
| `dragOver` | 드롭존 — 테두리 `stroke-neutral-contrast` + 바탕 `bg-layer-default-pressed` |
| `dragging` | 끄는 항목 — 2px 줄어듦 · × 와 구멍 없음. 사진은 불투명도 0.5, 파일 카드는 글 · 아이콘 `fg-disabled` |
| `readonly` | 타일 · × 가 막힌 모습, 순서를 못 바꾸고 메뉴 대신 누르면 바로 크게 보기. 사진은 불투명도 0.5, 파일 카드는 글 · 아이콘 `fg-disabled`. 값은 제출됩니다 |
| `disabled` | 타일 · × · 드롭존 · 파일 선택이 막힌 모습(`fg-disabled` · 드롭존 테두리 `stroke-neutral-weak`) — 새로 고르지 못하고 값도 제출되지 않습니다. 흐리게 하지 않습니다 |

[그림: 상태 — 타일 · × · 드롭존의 기본 · 호버 · 포커스 · 누름 · 끌어 들어옴 · 읽기 전용 · 막힘](../../site/components/specs/attachment-input.tsx#states)

[표: 상태 — 타일 · 개수](attachment-input.yaml#matrix@trigger+triggerIcon+count+countMax)

[표: 상태 — 항목 · × · 포커스 링](attachment-input.yaml#matrix@item+removeButton+removeMask+focusRing)

[표: 항목 줄](attachment-input.yaml#base.enabled@items)

[표: 모션](attachment-input.yaml#motion)

## Guidelines

### 언제 쓰나

| 이런 자리 | 쓰는 것 |
|---|---|
| 여럿을 붙이고 사진이 섞이는 자리(거래 영수증 · 메모 첨부 · 휴가 증빙) | **Attachment Input** `tile` |
| 파일 하나를 골라 바로 넘기는 자리(CSV · Excel 가져오기) | **Attachment Input** `dropzone` |
| 사람의 프로필 사진 한 장을 바꾸는 자리 | [Avatar](avatar.md) + "사진 바꾸기" · "사진 지우기" 버튼 |
| 붙은 사진을 보이기만 하는 자리(목록 · 상세) | [Image Frame](image-frame.md) |

[그림: 영수증은 타일 · 가져오기는 드롭존 · 프로필 사진은 Avatar + 버튼](../../site/components/specs/attachment-input.tsx#when-guide)

### 한 줄로 — 넘치면 옆으로

항목은 줄을 바꾸지 않고 한 줄(80)로 놓습니다 — 열 장이어도 시트가 길어지지 않습니다. 대신 대부분이 옆으로 숨습니다 — 올리는 중 · 실패가 끝에 있으면 밀어야 보입니다. 그래서 실패는 항목 덮개와 함께 칸의 이름에도 들립니다(보조 기술 — "1개는 올리지 못했어요"). 줄은 화면 가장자리까지 넓혀 끝 흐림 20 이 더 있다는 것을 알립니다.

[그림: 10/10 — 처음 모습(끝 흐림) · 끝까지 민 모습(올리는 중 · 실패)](../../site/components/specs/attachment-input.tsx#row-guide)

### 다시 검사합니다 — 거절은 그 자리에

`accept` 는 고르기 창의 편의일 뿐입니다 — 사용자는 "모든 파일" 로 다른 형식을 고를 수 있습니다. 그래서 형식 · 크기 · 개수를 다시 검사하고, 거절한 파일은 붙이지 않고 [Field](field.md) 의 오류 글로 한 번 알립니다 — 토스트로 알리지 않습니다. 이유마다 한 문장입니다.

| 이유 | 글 |
|---|---|
| 크기(`FILE_TOO_LARGE`) | "10MB 넘는 파일은 올릴 수 없어요." |
| 형식(`INVALID_TYPE`) | "사진 · PDF 만 올릴 수 있어요." |
| 개수(`TOO_MANY_FILES`) | "10개까지 올릴 수 있어요." — 남은 자리만큼은 붙이고 나머지만 거절합니다 |

칸의 설명에 받는 형식 · 크기 · 개수를 미리 적습니다("사진 · PDF 를 10MB 까지 올려요. 10개까지."). 서버도 같은 한도로 검사합니다 — 화면의 검사는 먼저 알리는 것일 뿐입니다.

[그림: 12MB 사진 하나와 PDF 둘을 고름 — PDF 는 붙고 사진은 거절, 칸 아래 오류 글](../../site/components/specs/attachment-input.tsx#validation-guide)

### 앱은 메뉴 시트로 엽니다

앱의 첨부 타일 · 파일 선택은 [Menu Sheet](menu-sheet.md) 를 엽니다 — "사진 찍기" · "앨범에서 고르기" · "파일 고르기"(받는 형식에 없는 줄은 빼고, 남는 줄이 하나면 바로 그 창). 웹은 브라우저의 고르기 창입니다 — 폰 브라우저가 카메라 · 앨범을 스스로 묻습니다.

[그림: 앱 — 첨부 타일을 누르면 메뉴 시트(사진 찍기 · 앨범에서 고르기 · 파일 고르기)](../../site/components/specs/attachment-input.tsx#app-guide)

### 글

칸 이름은 무엇을 붙이는지 명사로("영수증"), 설명은 형식 · 크기 · 개수("사진 · PDF 를 10MB 까지 올려요. 10개까지.")로 씁니다. 타일 이름은 "{칸 이름} 첨부, 3/10", × 는 "{파일 이름} 지우기", 다시 시도는 "{파일 이름} 다시 시도" 입니다. 드롭존 안내는 "파일을 여기로 끌어다 놓으세요", 버튼은 "파일 선택" 입니다. 거절 글은 위 표대로 씁니다.

## 코드

레시피 `recipes/shadcn/components/ui/attachment-input.tsx` 를 [Field](field.md) 안에 둡니다. 항목 목록은 쓰는 쪽이 쥡니다(제어 컴포넌트) — 올리기 요청과 상태는 쓰는 쪽이 바꿉니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `AttachmentInput` — `entries`(필수 — `AttachmentEntry[]`) · `onFilesAccept(added)`(필수 — 검사를 통과한 새 항목, 상태 `"pending"`) · `onRemove(id)`(필수) · `onRetry(id)` · `onFilesReject(rejections)`(한 번 고른 것 가운데 거절된 것 모두 — `AttachmentRejection[]`) · `onReorder(next)`(주면 항목을 끌어 · 키보드 · 항목 메뉴(대표로 정하기 · 앞으로 옮기기 · 뒤로 옮기기)로 순서를 바꿉니다 — 바뀐 `AttachmentEntry[]`) · `onPreview(id)`(주면 메뉴 첫 줄 "크게 보기" · 파일 카드는 "열기" — 크게 보는 화면은 쓰는 쪽이 엽니다) · `layout`(`"tile"` 기본 · `"dropzone"`) · `accept`(고르기 창 · 다시 검사) · `maxFiles`(기본 `1`. `Infinity` 면 개수를 그리지 않습니다) · `maxFileSize`(바이트) · `badgeLabel`(주면 첫 사진에 띠) · `disabled` · `readOnly` · `name`(고른 파일을 숨은 `<input type="file">` 에 맞춰 폼에 냅니다) · `triggerLabel`(타일 이름의 앞 — 기본은 Field 라벨). 1280 이상 웹에서만 드롭존을 그립니다. 항목 메뉴는 레시피가 그립니다 — `onReorder` · `onPreview` 가운데 하나라도 주면 항목을 누를 때 1280 미만 Menu Sheet(머리 = 파일 이름) · 이상 Menu 로 크게 보기 · 대표로 정하기(`badgeLabel` 이 있는 칸의 사진만) · 앞으로 옮기기 · 뒤로 옮기기 | 지우기(`onRemove`)를 열고, 맨 앞 · 맨 끝의 막히는 줄도 레시피가 가립니다. 읽기 전용이면 누를 때 바로 `onPreview` 를 부릅니다. Field 안이면 Field 의 라벨 · 설명 · 오류를 잇고 `disabled` · `readOnly` · `invalid` 를 받습니다.
- `AttachmentEntry` — `{ id: string; name: string; size: number; type: string; file?: File; previewUrl?: string; status: "pending" | "uploading" | "success" | "error"; progress?: number }` — `progress` 는 0 ~ 1(올리는 중 원)입니다. 사진 · 파일 카드는 `type` 으로 가릅니다.
- `AttachmentRejection` — `{ file: File; codes: ("FILE_TOO_LARGE" | "INVALID_TYPE" | "TOO_MANY_FILES")[] }`.
- `formatFileSize(bytes)` — "9.8MB" 꼴로 씁니다.
- 한 번 고른 것에 통과한 것과 거절된 것이 섞이면 `onFilesAccept` 를 먼저, `onFilesReject` 를 뒤에 부릅니다 — 아래 예시처럼 accept 에서 지난 오류 글을 지우고 reject 에서 새 오류 글을 쓰는 쪽이 그 순서에 기댑니다.

### 영수증 첨부 — 타일

[그림: 거래 상세의 영수증 — 사진 · PDF, 올리는 중 · 실패 · 다시 시도](../../site/components/specs/attachment-input.tsx#ex-receipt)

```tsx
import { useState } from "react"
import { AttachmentInput, type AttachmentEntry, type AttachmentRejection } from "@/components/ui/attachment-input"
import { Field } from "@/components/ui/field"

const MAX_SIZE = 10 * 1024 * 1024
const uploadReceipt = (file: File, onProgress: (ratio: number) => void) => {
  onProgress(1)
  return Promise.resolve(file.name) // POST /files/upload(EXPENSE_RECEIPT) — 진행을 알려 준다
}
const REJECT_TEXT = {
  FILE_TOO_LARGE: "10MB 넘는 파일은 올릴 수 없어요.",
  INVALID_TYPE: "사진 · PDF 만 올릴 수 있어요.",
  TOO_MANY_FILES: "10개까지 올릴 수 있어요.",
} as const

const [entries, setEntries] = useState<AttachmentEntry[]>([])
const [error, setError] = useState<string | null>(null)

const update = (id: string, patch: Partial<AttachmentEntry>) =>
  setEntries((list) => list.map((e) => (e.id === id ? { ...e, ...patch } : e)))

const start = (entry: AttachmentEntry) => {
  if (!entry.file) return
  update(entry.id, { status: "uploading", progress: 0 })
  uploadReceipt(entry.file, (progress) => update(entry.id, { progress })).then(
    () => update(entry.id, { status: "success" }),
    () => update(entry.id, { status: "error" }),
  )
}

// 이유마다 한 문장 — 토스트가 아니라 칸 아래 오류 글
const reject = (rejections: AttachmentRejection[]) => {
  const codes = [...new Set(rejections.flatMap((r) => r.codes))]
  setError(codes.map((c) => REJECT_TEXT[c]).join(" "))
}

<Field
  label="영수증"
  description="사진 · PDF 를 10MB 까지 올려요. 10개까지."
  invalid={error !== null}
  errorMessage={error}
>
  <AttachmentInput
    accept="image/*,application/pdf"
    maxFiles={10}
    maxFileSize={MAX_SIZE}
    entries={entries}
    onFilesAccept={(added) => {
      setError(null)
      setEntries((list) => [...list, ...added])
      added.forEach(start)
    }}
    onFilesReject={reject}
    onRemove={(id) => setEntries((list) => list.filter((e) => e.id !== id))}
    onRetry={(id) => {
      const entry = entries.find((e) => e.id === id)
      if (entry) start(entry)
    }}
  />
</Field>
```

### 파일 하나 가져오기 — 드롭존

[그림: 데이터 가져오기 — 1280 드롭존 · 고른 뒤 분석 중 파일 카드 · 390 파일 선택 버튼](../../site/components/specs/attachment-input.tsx#ex-import)

```tsx
import { useState } from "react"
import { AttachmentInput, type AttachmentEntry } from "@/components/ui/attachment-input"
import { Field } from "@/components/ui/field"

const analyze = (file: File) => Promise.resolve(file.size) // POST /import/analyze — 다음 단계로 넘긴다
const [entries, setEntries] = useState<AttachmentEntry[]>([])
const [error, setError] = useState<string | null>(null)

<Field
  label="파일 업로드"
  description="CSV(.csv) 또는 Excel(.xlsx, .xls) 파일을 올려주세요. 최대 10MB."
  invalid={error !== null}
  errorMessage={error}
>
  {/* 1280 이상 웹은 드롭존, 1280 미만 · 앱은 파일 선택 버튼 — 하나를 고르면 드롭존이 막힌다 */}
  <AttachmentInput
    layout="dropzone"
    accept=".csv,.xlsx,.xls"
    maxFiles={1}
    maxFileSize={10 * 1024 * 1024}
    entries={entries}
    onFilesAccept={(added) => {
      const entry = added[0] // 최대 1 — 하나만 온다
      if (!entry?.file) return
      setError(null)
      setEntries([{ ...entry, status: "uploading" }])
      analyze(entry.file).then(
        () => setEntries([{ ...entry, status: "success" }]),
        () => setEntries([{ ...entry, status: "error" }]),
      )
    }}
    onFilesReject={() => setError("CSV · Excel 파일을 10MB 까지 올릴 수 있어요.")}
    onRemove={() => setEntries([])}
  />
</Field>
```

### 대표 사진 · 순서 바꾸기

[그림: 사진 넷 — 첫 사진에 "대표" 띠, 누르면 메뉴 · 끌기 · 키보드로 순서 바꾸기](../../site/components/specs/attachment-input.tsx#ex-reorder)

```tsx
import { useState } from "react"
import { AttachmentInput, type AttachmentEntry } from "@/components/ui/attachment-input"
import { Field } from "@/components/ui/field"

const [photos, setPhotos] = useState<AttachmentEntry[]>([])
const openViewer = (id: string) => window.open(`/files/${id}`, "_blank", "noopener") // 크게 보기 — 쓰는 쪽이 정한다

<Field label="사진" description="사진을 10장까지 올려요. 첫 사진이 대표예요.">
  <AttachmentInput
    accept="image/*"
    maxFiles={10}
    badgeLabel="대표"
    entries={photos}
    onFilesAccept={(added) => setPhotos((list) => [...list, ...added])}
    onRemove={(id) => setPhotos((list) => list.filter((p) => p.id !== id))}
    onReorder={setPhotos}
    onPreview={openViewer}
  />
</Field>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 첨부 타일 · 파일 선택 누르기 · `Enter` · `Space` | 웹은 고르기 창(최대가 2 이상이면 여럿), 앱은 메뉴 시트(사진 찍기 · 앨범에서 고르기 · 파일 고르기) |
| 고르기 · 끌어 놓기 | 형식 · 크기 · 개수를 다시 검사합니다 — 통과한 파일은 줄 끝에 붙고(`pending`), 거절은 Field 오류 글로 한 번(이유마다 한 문장) 알립니다. 남은 자리보다 많이 고르면 앞에서부터 남은 만큼 붙입니다 |
| 파일을 드롭존 위로 끌기(1280 이상 웹) | 테두리 · 바탕이 바뀝니다(`dragOver`). 놓으면 고른 것과 같습니다. 드롭존 밖에 놓으면 브라우저가 파일을 열지 않게 막습니다 |
| 올리는 중 | 그 항목에 값 있는 원 24 — 진행이 10초 동안 멈추면 실패로 바꿉니다 |
| 다시 시도 | `onRetry(id)` — 다시 올리는 중으로 |
| 실패한 항목 누르기 | 덮개 전체가 "다시 시도" 입니다 — 누르면 `onRetry`. 메뉴 · 끌기는 다시 올린 뒤에 열립니다(포인터). 키보드는 항목에 초점을 두고 `Enter` 로 메뉴, × 로 지우기가 그대로 됩니다 — 실패한 것은 먼저 다시 올리거나 지우는 일이라 옮기는 길을 막아도 잃는 것이 없습니다 |
| × 누르기 | 묻지 않고 지웁니다(`onRemove`). 초점은 다음 항목의 × → 없으면 앞 항목의 × → 없으면 첨부 타일로 갑니다 |
| 다 참 | 타일 `aria-disabled`(초점은 남습니다) · 드롭존 · 파일 선택 막힘 |
| 항목 누르기 · `Enter`(`onReorder` · `onPreview`) | 항목 메뉴 — 1280 미만 Menu Sheet · 이상 Menu. 크게 보기 · 대표로 정하기 · 앞으로 옮기기 · 뒤로 옮기기 \| 지우기, 맨 앞 · 맨 끝은 그 방향이 막힙니다. 옮긴 뒤 초점은 옮긴 항목, 지운 뒤는 × 와 같습니다 |
| 항목 끌기(`onReorder`) | 마우스는 8px 넘게 · 터치는 250ms 누른 채 움직이면 끌기(앱도 250ms 길게 누름) — 2px 줄어든 채 따라가고(사진은 불투명도 0.5 · 파일 카드는 글 `fg-disabled`) × 와 구멍이 사라집니다. 놓은 자리로 옮깁니다. 그 전에 움직이면 줄이 스크롤합니다 |
| 항목에서 `Space` → `←` `→` → `Space` · `Enter` · `Esc`(`onReorder`) | 웹 — 들기 → 한 칸씩 옮기기 → 놓기 · 그만두기(처음 자리로). 앱은 들기 대신 접근성 동작 앞으로 · 뒤로 옮기기와 메뉴. 하나하나 읽습니다(아래 Accessibility). `Enter` 는 들지 않고 메뉴를 엽니다 |
| 읽기 전용 | 타일 · × · 순서 바꾸기 · 메뉴 막힘 — 누르면 바로 크게 보기(`onPreview`). 사진은 불투명도 0.5 · 파일 카드 글 `fg-disabled`. 값은 제출됩니다 |
| Disabled | 새로 고르지 못하고 × 도 막힙니다 — 숨은 입력도 막혀 제출되지 않습니다 |
| 모션 줄이기 | 누름 축소 · 끄는 동안 축소를 뺍니다 · 흐림 · 원의 채움은 바로 바뀝니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 파일 이름 `fg-neutral` 흰 면 16.41 · 다크 13.42, 크기 · 개수 최대 · 드롭존 안내 · 파일 카드 다시 시도 `fg-neutral-subtle` 5.50 · 6.09(드롭존 끌기 바탕 위 5.18 · 4.68), 사진 위 흰 글(다시 시도 · 대표) 검정 65% 덮개 위 흰 사진에서도 7.00 ✓. 막힘 `fg-disabled` 는 기준 밖(비활성 UI)입니다. 읽기 전용 사진의 대표 띠 글은 불투명도 0.5 라 흰 사진 위 라이트 2.27 · 다크 3.38 ⚠ — 읽기 전용 사진의 흐림을 지키는 예외입니다. 읽기 전용 파일 카드의 글 `fg-disabled`(3.16 · 4.13)도 같은 예외입니다 |
| **WCAG 1.4.4** Resize text | 글과 함께 상자 · 아이콘 · × 도 글자 배율만큼 커집니다 ✓ — 웹은 rem, 앱은 크기에 글자 배율(textScaler)을 곱합니다. 200% 에서 사진 160 · 파일 카드 320 × 160 이라 이름 네 줄 + 크기가 다 보이고 "다시 시도" 가 잘리지 않습니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 드롭존 테두리 `stroke-neutral-solid` 4.18 · 4.13(떠 있는 면 4.18 · 3.58), 끌기 테두리 16.41 · 13.42 ✓. 타일 아이콘 `fg-neutral-subtle` 5.50 · 6.09 · × 아이콘 `fg-neutral` 16.41 · 13.42 ✓. 올리는 중 원 — 사진 위 흰 호 3.95 · 19.27, 파일 카드 썸네일 칸 위 `stroke-neutral-solid` 3.87 · 3.18 ✓. 타일 · 카드 테두리 `stroke-neutral-weak`(1.23 · 1.56) · 사진 윤곽은 틀입니다 — 아이콘 · 개수 · 사진이 부품을 알립니다. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓ |
| **WCAG 1.4.1** Use of color | 끌기는 테두리와 바탕이 함께, 다 참은 색과 함께 "10/10" 으로, 실패는 덮개 · 아이콘 · 글로 알립니다 ✓ |
| **WCAG 2.1.1** Keyboard | 타일 · 파일 선택 · × · 다시 시도는 버튼(`Enter` · `Space`)입니다. 드롭존은 끌기만 받는 자리라 그 안의 "파일 선택" 버튼이 키보드 길입니다. 순서 바꾸기는 `Space` · `←` `→` · `Esc` ✓ |
| **WCAG 2.5.7** Dragging movements | 드롭존 끌어 놓기 — "파일 선택" 버튼 한 번으로 같은 일 ✓. 항목 순서 바꾸기 — 항목을 누르면 메뉴(대표로 정하기 · 앞으로 옮기기 · 뒤로 옮기기)로 끌지 않고 옮깁니다 ✓. 키보드 길(`Space` · `←` `→` · `Space`)도 있습니다 |
| **WCAG 2.4.3** Focus order | × 로 지우면 초점이 다음 · 앞 항목의 × · 타일로 갑니다 — 본문으로 떨어지지 않습니다. 다 차도 타일에 초점이 남습니다(`aria-disabled`) ✓ |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에 부품 안쪽 링 2px — 가로 스크롤 줄에 잘리지 않습니다 ✓ |
| **WCAG 3.3.1** Error identification | 거절은 Field 오류 글(아이콘 + 글, `aria-describedby`)로, 올리기 실패는 항목 덮개 + "다시 시도" + 항목 이름("…, 올리지 못했어요")으로 ✓ |
| **WCAG 4.1.3** Status messages | 붙음 · 거절 · 올림 · 실패를 한 번씩 읽습니다(polite — "사진 2장을 붙였어요." · "1개는 올리지 못했어요.") ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 타일 80 · × 44(보이는 20) · 다시 시도(사진 80 · 카드 160 × 80) · 파일 선택 36 · 48 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 타일 80 ✓ · × 44 ✓(보이지 않는 여백 12 씩) · 파일 선택 ✓ — small 36(드롭존 안 · 1280 이상 웹) · large 48 모두 Button 의 누르는 영역 44 |
| **WCAG 4.1.2** Name, Role, Value | 타일 "{칸 이름} 첨부, 3/10"(다 차면 `aria-disabled`), 항목 이름은 **전체** 파일 이름 + 크기 + 상태(줄인 글이 아닙니다), × "{파일 이름} 지우기", 다시 시도 "{파일 이름} 다시 시도", 올리는 중 원은 값 글("40%"). 순서를 바꿀 수 있으면 항목이 `role="button"` + `aria-roledescription="순서를 바꿀 수 있는 항목"` + 설명("Space 로 들고 ← → 로 옮긴 뒤 Space 로 놓아요. Esc 는 그만두기예요.")을 갖습니다 — × 는 항목의 형제입니다(단추 안 단추를 두지 않습니다) |
| **ARIA** | 순서 바꾸기 읽기 글(dnd-kit `announcements` — 한국어): 들기 "{n}번째 항목을 들었어요." · 옮김 "{n}번째 자리예요." · 놓기 "{n}번째 자리에 놓았어요." · 그만두기 "옮기기를 그만뒀어요. 처음 자리예요." 항목 메뉴는 Menu Sheet(`role="dialog"` · 머리 = 파일 이름) · Menu(`role="menu"` · `aria-label` = 파일 이름)의 규칙 그대로입니다 — 항목은 `aria-haspopup` · `aria-expanded`, 막힌 줄은 `disabled`, 지우기는 위험 묶음. 앱은 메뉴 시트와 함께 항목에 `Semantics(customSemanticsActions: 앞으로 옮기기 · 뒤로 옮기기)` 를 둡니다 |
| **Reduced motion** | 누름 · 끄는 동안 축소를 뺍니다 · 원의 채움은 바로 바뀝니다 |

## Do / Don't

### ✅ Do

- 여럿 · 사진이 섞이는 첨부는 타일 + 한 줄, 파일 하나를 넘기는 자리는 드롭존을 씁니다.
- 형식 · 크기 · 개수를 설명에 적고, 고른 뒤 다시 검사해 그 자리(Field 오류)에서 알립니다.
- 올리는 중은 값 있는 원 24, 실패는 덮개 + "다시 시도" 로 보입니다.
- 항목 이름은 전체 파일 이름으로 둡니다 — 보이는 이름은 네 줄까지, 확장자를 남깁니다.
- 드롭존의 키보드 길은 "파일 선택" 버튼으로 둡니다.

### ❌ Don't

- 상자 전체를 `div onClick` 으로 눌리게 하기 · 점선 상자 · 📁 아이콘.
- 올리기 진행을 막대로 · 실패를 토스트로만 알리기.
- 막힘을 불투명도로 흐리기 — 불투명도 0.5 는 사진의 읽기 전용 · 끄는 중에만 쓰는 예외입니다.
- 순서를 끌기로만 바꾸게 하기 — 누르면 메뉴로도 옮깁니다.
- 파일 이름을 끝에서 잘라 확장자를 지우기 · 다섯 줄로 상자를 넘기기.
- 서버 한도 없이 "n/최대" 를 그리기 · `accept` 만 믿고 다시 검사하지 않기.
- 프로필 사진(한 장 · 원)을 이 칸으로 받기 — Avatar + 버튼.

## Specification

`attachment-input.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Attachment Input 을 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적었습니다.

[그림: Specification — attachment-input.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#attachment-input)
