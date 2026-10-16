# Attachment Input

> 사진 · 파일을 골라 붙이는 칸 — 거래 영수증 · 메모 첨부처럼 여럿을 붙이는 자리는 첨부 타일 + 항목 줄, CSV · Excel 가져오기처럼 파일 하나를 골라 바로 넘기는 자리는 드롭존이다. 사람의 프로필 사진은 [Avatar](avatar.md) 의 "사진 바꾸기" 이고, 붙은 사진을 보이기만 하는 자리는 [Image Frame](image-frame.md) 이다.

구조는 당근 [SEED Attachment Input](https://seed-design.io/components/attachment-input)(rootage `attachment-input` · `-trigger` · `-item` · `-item-action-button` · `-item-remove-button` · `-dropzone`, qvism-preset recipe, React `AttachmentField` — Apache-2.0)을 따른다 — 첨부 타일(80, "3/10") · 사진 80 썸네일(Media) · 파일 160 × 80 카드(File) · 오른쪽 위 × 20 · 올리는 중 · 실패 · 다시 시도 · 대표 배지 · 순서 바꾸기 · 드롭존. 드롭존의 색 · 파일 이름 줄 · 항목 메뉴(끌지 않고 옮기는 길) · 포커스 링은 porest 가 정했다(2026-10-15 사용자 결정 — 마무리 3A · 4A · 5A, 이어서 11D · 12A · 13B · 14A). 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다. 옛 DESIGN.md 의 File Upload 절(v73 — 2px 점선 · 📁 · 막힘 불투명도 0.5)을 대신한다.

수치 원본은 [`attachment-input.yaml`](attachment-input.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: Desk 거래 상세 — 영수증 PDF 하나 + 사진 아홉(올리는 중 · 실패 하나씩) = 10/10, 폰 시트 · 데스크톱 대화상자 480, 라이트 · 다크](../../site/components/specs/attachment-input.tsx#hero)

### 직접 골라 보기

모양(타일 · 드롭존) · 받는 형식 · 최대 개수 · 대표 배지 · 순서 바꾸기 · 막힘 · 읽기 전용을 고르면 스펙대로 그린 칸과 그 코드가 바뀐다. 실제로 파일을 고르고 끌어 놓을 수 있다 — 올리는 중 · 실패 · 다시 시도와 거절 안내가 함께 보인다.

[그림: 플레이그라운드](../../site/components/specs/attachment-input.tsx#playground)

## Anatomy

[그림: 첨부 타일 · 사진 항목 · 파일 카드 · × · 대표 띠, 드롭존 · 파일 선택 버튼](../../site/components/specs/attachment-input.tsx#anatomy)

| ⓐ Trigger | 첨부 타일 — 80 × 80, 아이콘 24 + 개수("3/10"). 누르면 고르기 창(앱은 메뉴 시트). |
| ⓑ Image Item | 사진 항목 — 80 × 80 썸네일 + 투명 윤곽. 올리는 중 · 실패는 사진 위 덮개. |
| ⓒ File Item | 파일 카드 — 160 × 80, 썸네일 칸 48 + 이름(네 줄까지) + 크기. |
| ⓓ Remove Button | 지우기 × — 20 원, 항목 오른쪽 위에 걸친다. 누르는 자리 44. |
| ⓔ Badge | 대표 띠 — 첫 사진 아래 24, 쓰는 자리만. |
| ⓕ Dropzone | 드롭존 — 높이 120, 안내 + 파일 선택 버튼. 1280 이상 웹만. |
| ⓖ Item Menu | 항목 메뉴 — 항목을 누르면 열린다. 크게 보기 · 대표로 정하기 · 앞으로 옮기기 · 뒤로 옮기기 \| 지우기. |

항목의 모양은 **파일 종류**가 정한다 — 사진(`image/*`)은 썸네일, 그 밖(PDF · 표)은 파일 카드이고 한 줄에 섞인다(SEED React 는 `accept="image/*"` 면 썸네일, 아니면 카드 — 비교 페이지가 섞인 줄을 그렸다). × 둘레는 항목 모서리를 × 보다 2 크게 파내 사진 · 덮개 · 윤곽이 × 에 닿지 않는다(SEED 의 구멍).

[표: 부위](attachment-input.yaml#slots)

## Properties

### Layout

- **`tile`**(기본, 사용자 결정 4A) — 첨부 타일 + 항목 줄. 영수증 · 메모 첨부처럼 여럿을 붙이고 사진이 섞이는 자리. 항목 줄은 화면(시트 · 대화상자 본문) 가장자리까지 넓히고 넘치면 가로로 스크롤한다 — 첫 항목은 다른 칸과 같은 자리(24)에서 시작하고, 좌우 끝은 늘 20 흐린다([Scroll Fog](scroll-fog.md) `row` — 스크롤바는 숨긴다). 앱은 칸이 제 상자 밖을 받지 못하므로 놓는 화면이 칸을 화면 폭에 두고 안쪽 여백 24 를 준다(SEED `--seed-attachment-input-extend-x` · [Chip](chip.md) 스크롤 줄과 같은 방법) — [Field](field.md) 안이면 Field 의 머리 · 꼬리를 24 들여 라벨이 다른 칸과 같은 자리에 선다. 칸을 화면 여백 안에 둔 채 쓰지 않는다 — 늘 켜진 흐림 20 이 첨부 타일을 깎는다(구현 세션 질문 Q-016-2 — 사용자 결정 4A 의 앱 풀이).
- **`dropzone`**(사용자 결정 5A) — 파일 하나를 골라 바로 서버로 넘기는 자리(CSV · Excel 가져오기). 1280 이상 웹은 드롭존(높이 120 · 1px 실선 · 안내 "파일을 여기로 끌어다 놓으세요" + "파일 선택" 버튼), 1280 미만 웹 · 앱은 끌어 놓기가 없으니 드롭존 없이 "파일 선택" 버튼(large · 칸 폭 · 앞 아이콘 `upload`)만이다. 고른 파일은 아래 파일 카드로 보인다. 썸네일 · 여럿 · 순서 · 개수가 필요 없는 자리라 SEED 의 드롭존만 가져온다.

List 줄로 첨부를 늘어놓는 안(4C)과 지금 앱 위젯(4B), 지금 웹의 점선 상자 전체(5B) · 앱의 실선 상자(5C) · 옛 File Upload(5D)는 고르지 않았다.

[그림: tile — 영수증 10/10 한 줄(끝까지 민 모습 · 처음) · dropzone — 1280 드롭존 · 390 파일 선택 버튼](../../site/components/specs/attachment-input.tsx#layout)

[표: 모양](attachment-input.yaml#layout)

### Trigger

첨부 타일은 80 × 80 · 모서리 12 · 1px `stroke-neutral-weak` · 투명 바탕이다. 아이콘 24 `fg-neutral-subtle`(사진을 받으면 `image`, 파일만 받으면 `paperclip`) 아래 개수 — 지금 개수 `fg-neutral` + "/최대" `fg-neutral-subtle`(12 / 16 · 400). 최대가 없으면 개수를 두지 않는다 — "n/최대" 를 쓰려면 서버의 개수 한도부터 정한다(지금 desk-back 에 없다). 다 차면 타일이 막힌다 — 아이콘 · 개수가 `fg-disabled` 이고, `aria-disabled` 라 초점은 남아 "10/10, 사용할 수 없음" 을 읽는다. 누르면 바탕 + 타일만 2px 거리로 준다.

[그림: 0/10 · 3/10 · 10/10 막힘 · 개수 없음(최대 없음)](../../site/components/specs/attachment-input.tsx#trigger)

[표: 첨부 타일](attachment-input.yaml#base.enabled@trigger)

[표: 다 찼을 때](attachment-input.yaml#matrix.capacity.full@trigger+triggerIcon+count+countMax)

### Item

[표: 사진 · 파일](attachment-input.yaml#kind)

[표: 항목 공통](attachment-input.yaml#base.enabled@item)

[표: 파일 카드 — 썸네일](attachment-input.yaml#base.enabled@thumbnail)

[표: 파일 카드 — 이름](attachment-input.yaml#base.enabled@name)

[표: 파일 카드 — 크기](attachment-input.yaml#base.enabled@size)

사진은 투명 윤곽 1px `stroke-neutral-overlay`(v118 — Image Frame · Avatar 와 같다)를 그림 위에 겹쳐 그린다. 파일 카드는 썸네일 칸 48(`bg-neutral-weak` · 모서리 8 · 아이콘 24) + 이름(12 / 16 · 500) + 크기(11 / 15 · `fg-neutral-subtle` · "9.8MB")다.

[그림: 사진 80 · 파일 카드 160 × 80 — 한 줄에 섞인다, 윤곽 · 썸네일 칸 · 이름 폭 70](../../site/components/specs/attachment-input.tsx#items)

#### 파일 이름 — 네 줄 · 확장자는 남긴다

이름은 폭 70 에 **글자 단위**로 줄을 바꾸고(`word-break: break-all` — SEED 레시피와 같다) **네 줄까지** 보인다 — 네 줄(64) + 크기(15) 가 80 상자에 든다(따라오는 것). 파일 이름은 문장이 아니라 이름표다 — 띄어쓰기 없이 밑줄 · 붙임표로 이어져 단어 단위의 이득이 없고, 글자 단위로 채워야 같은 칸에 이름이 가장 많이 든다. 그래서 이 칸은 Typography v114(단어 단위 — keep-all · break-word)의 **예외**다(사용자 결정 2026-10-15 마무리 11D). 네 줄을 넘으면 셋째 줄 끝을 "…" 로 줄이고 넷째 줄에 확장자(".xlsx")를 남긴다 — 끝을 자르면 확장자가 사라져 무슨 파일인지 모른다. 전체 이름은 항목의 이름(보조 기술)에 늘 있다. SEED 레시피는 줄을 자르지 않아 다섯 줄부터 상자를 넘는다. 단어 단위 + 확장자 남김(11A) · 네 줄째에서 자름(11B) · SEED 그대로 넘침(11C)은 고르지 않았다.

첫 줄만 오른쪽 4 를 비운다 — 네 줄이면 이름이 카드 위에 바짝 붙어 × 둘레 구멍(24)이 첫 줄 끝 글자를 파먹는다. 둘째 줄부터는 폭 70 그대로다.

[그림: 네 줄에 드는 이름(짧은 PDF)은 그대로 · 가장 나쁜 두 이름(PDF 9.8MB · xlsx 4.2MB)은 넘쳐 셋째 줄 "…" + 넷째 줄 확장자 — 글자 단위, 첫 줄은 × 구멍을 비켜 오른쪽 4, 라이트 · 다크](../../site/components/specs/attachment-input.tsx#name)

### Remove Button

× 는 20 원(`bg-layer-default` · 1px `stroke-neutral-weak` · 아이콘 10 `fg-neutral`)이 항목 모서리 밖으로 위 4 · 오른쪽 4 걸친다. 누르는 자리는 44 다 — 보이는 원 둘레로 12 씩 넓힌다(기초 Inclusive Design). 이웃 항목과 겹친 8 도 × 가 먼저 받고, 칸 위에 라벨이 없어도 위 16 이 잘리지 않는다. 앱은 보이는 자리는 그대로 두고 누르는 44 를 받는 방법을 고른다(부모 상자 밖도 받는다 — 구현 세션 질문 Q-016-3, 사용자 결정 4A 의 44 · 방법은 카드 머리 동작 Q-011-8 과 같다). 이름은 "{파일 이름} 지우기" 이고, 누르면 묻지 않고 지운다 — 되돌리기는 다시 고르기다. 누르면 바탕 + × 만 2px 준다.

[그림: × 20 · 둘레 구멍 24 · 누르는 자리 44(분홍)](../../site/components/specs/attachment-input.tsx#remove)

[표: 지우기 ×](attachment-input.yaml#base.enabled@removeButton)

[표: 구멍](attachment-input.yaml#base.enabled@removeMask)

### Status

항목은 고른 직후(`pending`) · 올리는 중(`uploading`) · 올림(`success`) · 실패(`error`)다(SEED). 고른 직후와 올림은 같은 모습이다.

- **올리는 중** — 이미 정한 값 있는 Progress Circle 24(두께 3 — [Progress Circle](progress-circle.md) "올리기 · 받기", 2026-10-03)다. 사진은 사진 위 딤(라이트 50% · 다크 65%) 가운데 `staticWhite` 원, 파일 카드는 썸네일 칸에서 아이콘 대신 `neutral` 원. 진행이 10초 동안 멈추면 실패다. 막대([Progress](progress.md))는 쓰지 않는다.
- **실패** — SEED 대로 덮개 + "다시 시도"(아이콘 `rotate-cw` 24 + 12 / 16 · 500). 사진은 검정 65% 덮개 위 흰 글, 파일 카드는 썸네일 · 이름 자리를 다시 시도 하나가 채운다(`fg-neutral-subtle`). 실패 덮개는 두 모드 모두 65% 다 — 50% 면 흰 사진 위 흰 글이 3.95 로 모자란다.

[그림: 상태 — 파일 올리는 중 · 실패 · 사진 올리는 중 · 실패, 라이트 · 다크](../../site/components/specs/attachment-input.tsx#status)

[표: 사진 올리는 중](attachment-input.yaml#matrix.kind.image.status.uploading@backdrop+progressCircle)

[표: 파일 올리는 중](attachment-input.yaml#matrix.kind.file.status.uploading@thumbnailIcon+progressCircle)

[표: 사진 실패](attachment-input.yaml#matrix.kind.image.status.error@backdrop+actionButton)

[표: 파일 실패](attachment-input.yaml#matrix.kind.file.status.error@thumbnail+meta+actionButton)

[표: 다시 시도](attachment-input.yaml#base.enabled@actionButton)

### 대표 배지 · 순서 바꾸기

SEED 의 두 능력을 그대로 둔다(사용자 결정 3A) — 지금 세 제품에 쓰는 자리는 없다. 생길 법한 자리는 영수증 여러 장의 대표 사진 · 순서다.

- **대표 배지** — 첫 사진 아래 24 띠(검정 65% · 좌우 4 · 아래 두 모서리 12) 위 흰 글 "대표"(12 / 16 · 500 · 한 줄, `badgeLabel` 로 바꾼다). 띠는 두 모드 모두 65% 다(Image Frame 의 Indicator 와 같은 까닭).
- **순서 바꾸기** — 항목을 끌어 옮긴다(SEED — dnd-kit). 끄는 항목은 2px 줄어든 채 따라가고 × 와 구멍이 사라지며, **사진은 불투명도 0.5**, 파일 카드는 글 · 아이콘이 `fg-disabled` 다 — SEED 그대로다(사용자 결정 13B). 사진의 0.5 는 기초 v106 "불투명도로 흐리지 않는다" 의 예외로, 이 칸의 끄는 중 · 읽기 전용 사진에만 쓴다. 마우스는 누른 채 8px 넘게 움직이면, 터치는 250ms 누른 채 움직이면 끌기다 — 그 전에 움직이면 줄이 가로로 스크롤하고, 그냥 떼면 누르기(메뉴)다. 앱도 같다 — 250ms 길게 눌러 움직이면 끈다(SEED Lynx `attachment-field-reorderable` 의 가로 long-press, 구현 세션 질문 Q-016-1 — 사용자 결정 3A "SEED 와 1:1"). 순서를 바꾸면 대표 띠는 새 첫 사진으로 옮겨 간다.
- **끌지 않고 옮기기** — 항목을 누르면 메뉴가 열린다(사용자 결정 14A — 아래 "항목 메뉴"). 키보드는 항목에 초점을 두고 `Space` 로 들고 `←` `→` 로 옮긴 뒤 `Space` 로 놓는다(`Esc` 는 그만두기 — 아래 Behavior). 키보드 들기는 웹이다 — 앱은 들기 대신 접근성 동작(앞으로 옮기기 · 뒤로 옮기기)과 메뉴가 같은 일을 한다(SEED Lynx 도 그렇다). 끌기 + 키보드만(14B) · 순서 바꾸기를 두지 않기(14C)는 고르지 않았다.

[그림: 대표 띠 · 끄는 사진(2px 줄어듦 · 불투명도 0.5 · × 없음) · 키보드로 3번째 사진을 1번째로 — 읽기 글](../../site/components/specs/attachment-input.tsx#badge-reorder)

[표: 대표 띠](attachment-input.yaml#base.enabled@badge)

[표: 끄는 중](attachment-input.yaml#base.dragging)

[표: 사진 — 읽기 전용 · 끄는 중의 흐림](attachment-input.yaml#matrix.kind.image@item)

[표: 파일 카드 — 읽기 전용 · 끄는 중의 글 · 아이콘](attachment-input.yaml#matrix.kind.file@thumbnailIcon+name+size)

### 항목 메뉴

항목(사진 · 파일 카드)을 누르면 메뉴가 열린다 — 1280 미만 · 앱은 [Menu Sheet](menu-sheet.md)(머리에 전체 파일 이름), 1280 이상은 [Menu](menu.md). 끌기가 어려운 사람 · 화면 읽기 · 스위치 사용자도 한 번 누르고 골라 순서를 바꾼다(WCAG 2.5.7). 순서 바꾸기(`onReorder`)나 크게 보기(`onPreview`)를 줄 때만 열린다.

- 위 묶음 — **크게 보기**(사진을 누르면 바로 크게 보던 자리는 이 첫 줄로 옮긴다 — 한 번 더 누른다. 파일 카드는 "열기") · **대표로 정하기**(대표 띠를 쓰는 칸의 사진만 — 맨 앞으로 옮긴다. 띠를 안 쓰면 이 줄을 빼고 넷) · **앞으로 옮기기** · **뒤로 옮기기**(한 칸씩).
- 아래 위험 묶음 — **지우기**(`critical`, 묻지 않고 지운다). × 는 지름길로 남고 메뉴에 동작을 다 둔다 — 스와이프와 ⋮ 메뉴의 원칙과 같다([Menu Sheet](menu-sheet.md) "스와이프의 대신 길").
- 끝에 닿으면 그 방향이 막힌다 — 맨 앞(대표) 항목은 "앞으로 옮기기" · "대표로 정하기", 맨 끝 항목은 "뒤로 옮기기". 줄은 보이고 누를 수 없다(메뉴의 막힌 줄).
- 옮긴 뒤 초점은 옮긴 항목(새 자리)에, 지운 뒤에는 × 와 같은 규칙이다. 읽기 전용이면 메뉴 대신 누르면 바로 크게 보기, 막힘이면 누르지 않는다.

[그림: 390 — 둘째 사진을 누름 · 메뉴 시트(머리 파일 이름 · 크게 보기 · 대표로 정하기 · 앞으로 옮기기 · 뒤로 옮기기 | 지우기) / 1280 — 대화상자 · 메뉴 / 맨 앞 · 맨 끝의 막힌 줄](../../site/components/specs/attachment-input.tsx#item-menu)

[표: 항목 메뉴](attachment-input.yaml#base.enabled@itemMenu)

[표: 항목 자리 — 막히는 줄](attachment-input.yaml#position)

### Dropzone

드롭존(1280 이상 웹)은 높이 120 · 모서리 12 · 1px 실선이다. 테두리는 `stroke-neutral-solid` 다 — 놓인 면 위 흰 면 4.18 · 다크 4.13(시트 · 대화상자 4.18 · 3.58)으로 3:1 이 넘는다. 파일을 끌고 들어오면 테두리가 `stroke-neutral-contrast`(16.41 · 13.42)로, 바탕이 `bg-layer-default-pressed` 로 함께 바뀐다 — 기본 테두리와 3.93 · 3.25 로 또렷이 갈린다. SEED 의 값(테두리 palette.gray-500 — 다크 2.71, 끌기 stroke.neutral-solid — 차이 1.32 · 1.53)은 다크에서 테두리가 3:1 에 못 미치고 끌기가 거의 보이지 않아 역할 색으로 맞췄다(질문에서 약속한 고침). 막히면 테두리도 `stroke-neutral-weak` 로 옅어진다.

안내 글은 14 / 19 · 500 `fg-neutral-subtle` "파일을 여기로 끌어다 놓으세요", 그 아래 8 에 [Button](button.md) `neutralWeak` small "파일 선택" — CTA 가 아닌 보조 동작이고, 높이 120 안에 안내와 함께 든다. 상자 전체를 누르는 자리로 두지 않는다 — 키보드는 이 버튼으로 닿는다(지금 웹은 상자 `div onClick` 이라 키보드로 못 닿는다). 고른 파일은 드롭존 아래 8 에 파일 카드로 보이고(분석 중이면 썸네일 칸에 원), 하나를 고르면 드롭존이 막힌다(최대 1). 바꾸려면 × 로 지우고 다시 고른다.

테두리는 늘 1px 실선이다(사용자 결정 5A · 12A) — SEED rootage 설명은 평소 점선 · 끄는 동안 실선이지만, 평소 점선(12B)은 고르지 않았다. 끄는 동안 "파일 선택" 버튼 면(`bg-neutral-weak`)은 끌기 바탕(`bg-layer-default-pressed`)과 1.02 · 1.00:1 로 섞여 글만 남는다 — 끄는 중엔 누를 일이 없어 그대로 둔다.

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
| (SEED) `gray-500` ↔ 놓인 면 · `stroke-neutral-solid` ↔ `gray-500` | 3.16 · 1.32 | 2.71 · 1.53 |

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 타일 · × 투명 · 흰 바탕, 드롭존 테두리 `stroke-neutral-solid` |
| `hovered` | 웹 — 타일 · × 에 누름과 같은 바탕 `bg-layer-default-pressed`(v106), 축소 없음 |
| `focused` | 키보드 포커스에만 부품 **안쪽** 링 2px — 가로 스크롤 줄이 바깥 링을 자른다 |
| `pressed` | 누른 부품(타일 · × · 다시 시도)만 바탕 + 2px 거리 축소(v104) |
| `dragOver` | 드롭존 — 테두리 `stroke-neutral-contrast` + 바탕 `bg-layer-default-pressed` |
| `dragging` | 끄는 항목 — 2px 줄어듦 · × 와 구멍 없음. 사진은 불투명도 0.5, 파일 카드는 글 · 아이콘 `fg-disabled`(SEED — 사용자 결정 13B) |
| `readonly` | 타일 · × 가 막힌 모습, 순서를 못 바꾸고 메뉴 대신 누르면 바로 크게 보기. 사진은 불투명도 0.5, 파일 카드는 글 · 아이콘 `fg-disabled`(SEED — 13B). 값은 제출된다 |
| `disabled` | 타일 · × · 드롭존 · 파일 선택이 막힌 모습(`fg-disabled` · 드롭존 테두리 `stroke-neutral-weak`) — 새로 고르지 못하고 값도 제출되지 않는다. 흐리게 하지 않는다(v106) |

[그림: 상태 — 타일 · × · 드롭존의 기본 · 호버 · 포커스 · 누름 · 끌어 들어옴 · 읽기 전용 · 막힘](../../site/components/specs/attachment-input.tsx#states)

[표: 상태 — 타일 · 개수](attachment-input.yaml#matrix@trigger+triggerIcon+count+countMax)

[표: 상태 — 항목 · × · 포커스 링](attachment-input.yaml#matrix@item+removeButton+removeMask+focusRing)

[표: 항목 줄](attachment-input.yaml#base.enabled@items)

[표: 모션](attachment-input.yaml#motion)

## Guidelines

### 언제 쓰나

| 이런 자리 | 쓰는 것 |
|---|---|
| 여럿을 붙이고 사진이 섞인다(거래 영수증 · 메모 첨부 · 휴가 증빙) | **Attachment Input** `tile` |
| 파일 하나를 골라 바로 넘긴다(CSV · Excel 가져오기) | **Attachment Input** `dropzone` |
| 사람의 프로필 사진 한 장을 바꾼다 | [Avatar](avatar.md) + "사진 바꾸기" · "사진 지우기" 버튼 |
| 붙은 사진을 보이기만 한다(목록 · 상세) | [Image Frame](image-frame.md) |

[그림: 영수증은 타일 · 가져오기는 드롭존 · 프로필 사진은 Avatar + 버튼](../../site/components/specs/attachment-input.tsx#when-guide)

### 한 줄로 — 넘치면 옆으로

항목은 줄을 바꾸지 않고 한 줄(80)로 놓는다 — 열 장이어도 시트가 길어지지 않는다. 대신 대부분이 옆으로 숨는다 — 올리는 중 · 실패가 끝에 있으면 밀어야 보인다. 그래서 실패는 항목 덮개와 함께 칸의 이름에도 들린다(보조 기술 — "1개는 올리지 못했어요"). 줄은 화면 가장자리까지 넓혀 끝 흐림 20 이 더 있다는 것을 알린다.

[그림: 10/10 — 처음 모습(끝 흐림) · 끝까지 민 모습(올리는 중 · 실패)](../../site/components/specs/attachment-input.tsx#row-guide)

### 다시 검사한다 — 거절은 그 자리에

`accept` 는 고르기 창의 편의일 뿐이다 — 사용자는 "모든 파일" 로 다른 형식을 고를 수 있다(SEED). 그래서 형식 · 크기 · 개수를 다시 검사하고, 거절한 파일은 붙이지 않고 [Field](field.md) 의 오류 글로 한 번 알린다 — 토스트로 알리지 않는다. 이유마다 한 문장이다.

| 이유 | 글 |
|---|---|
| 크기(`FILE_TOO_LARGE`) | "10MB 넘는 파일은 올릴 수 없어요." |
| 형식(`INVALID_TYPE`) | "사진 · PDF 만 올릴 수 있어요." |
| 개수(`TOO_MANY_FILES`) | "10개까지 올릴 수 있어요." — 남은 자리만큼은 붙이고 나머지만 거절한다 |

칸의 설명에 받는 형식 · 크기 · 개수를 미리 적는다("사진 · PDF 를 10MB 까지 올려요. 10개까지."). 서버도 같은 한도로 검사한다 — 화면의 검사는 먼저 알리는 것일 뿐이다.

[그림: 12MB 사진 하나와 PDF 둘을 고름 — PDF 는 붙고 사진은 거절, 칸 아래 오류 글](../../site/components/specs/attachment-input.tsx#validation-guide)

### 앱은 메뉴 시트로 연다

앱의 첨부 타일 · 파일 선택은 [Menu Sheet](menu-sheet.md) 를 연다 — "사진 찍기" · "앨범에서 고르기" · "파일 고르기"(받는 형식에 없는 줄은 빼고, 남는 줄이 하나면 바로 그 창). 웹은 브라우저의 고르기 창이다 — 폰 브라우저가 카메라 · 앨범을 스스로 묻는다.

[그림: 앱 — 첨부 타일을 누르면 메뉴 시트(사진 찍기 · 앨범에서 고르기 · 파일 고르기)](../../site/components/specs/attachment-input.tsx#app-guide)

### 글

칸 이름은 무엇을 붙이는지 명사로("영수증"), 설명은 형식 · 크기 · 개수("사진 · PDF 를 10MB 까지 올려요. 10개까지."). 타일 이름은 "{칸 이름} 첨부, 3/10", × 는 "{파일 이름} 지우기", 다시 시도는 "{파일 이름} 다시 시도". 드롭존 안내는 "파일을 여기로 끌어다 놓으세요", 버튼은 "파일 선택". 거절 글은 위 표대로.

## 코드

레시피 `recipes/shadcn/components/ui/attachment-input.tsx` 를 [Field](field.md) 안에 둔다. 항목 목록은 쓰는 쪽이 쥔다(제어 컴포넌트) — 올리기 요청과 상태는 쓰는 쪽이 바꾼다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `AttachmentInput` — `entries`(필수 — `AttachmentEntry[]`) · `onFilesAccept(added)`(필수 — 검사를 통과한 새 항목, 상태 `"pending"`) · `onRemove(id)`(필수) · `onRetry(id)` · `onFilesReject(rejections)`(한 번 고른 것 가운데 거절된 것 모두 — `AttachmentRejection[]`) · `onReorder(next)`(주면 항목을 끌어 · 키보드 · 항목 메뉴(대표로 정하기 · 앞으로 옮기기 · 뒤로 옮기기)로 순서를 바꾼다 — 바뀐 `AttachmentEntry[]`) · `onPreview(id)`(주면 메뉴 첫 줄 "크게 보기" · 파일 카드는 "열기" — 크게 보는 화면은 쓰는 쪽이 연다) · `layout`(`"tile"` 기본 · `"dropzone"`) · `accept`(고르기 창 · 다시 검사) · `maxFiles`(기본 `1` — SEED. `Infinity` 면 개수를 그리지 않는다) · `maxFileSize`(바이트) · `badgeLabel`(주면 첫 사진에 띠) · `disabled` · `readOnly` · `name`(고른 파일을 숨은 `<input type="file">` 에 맞춰 폼에 낸다) · `triggerLabel`(타일 이름의 앞 — 기본은 Field 라벨). 1280 이상 웹에서만 드롭존을 그린다. 항목 메뉴는 레시피가 그린다 — `onReorder` · `onPreview` 가운데 하나라도 주면 항목을 누를 때 1280 미만 Menu Sheet(머리 = 파일 이름) · 이상 Menu 로 크게 보기 · 대표로 정하기(`badgeLabel` 이 있는 칸의 사진만) · 앞으로 옮기기 · 뒤로 옮기기 | 지우기(`onRemove`)를 열고, 맨 앞 · 맨 끝의 막히는 줄도 레시피가 가린다. 읽기 전용이면 누를 때 바로 `onPreview`. Field 안이면 Field 의 라벨 · 설명 · 오류를 잇고 `disabled` · `readOnly` · `invalid` 를 받는다.
- `AttachmentEntry` — `{ id: string; name: string; size: number; type: string; file?: File; previewUrl?: string; status: "pending" | "uploading" | "success" | "error"; progress?: number }` — `progress` 는 0 ~ 1(올리는 중 원). 사진 · 파일 카드는 `type` 으로 가른다.
- `AttachmentRejection` — `{ file: File; codes: ("FILE_TOO_LARGE" | "INVALID_TYPE" | "TOO_MANY_FILES")[] }`.
- `formatFileSize(bytes)` — "9.8MB" 꼴.
- 한 번 고른 것에 통과한 것과 거절된 것이 섞이면 `onFilesAccept` 를 먼저, `onFilesReject` 를 뒤에 부른다 — 아래 예시처럼 accept 에서 지난 오류 글을 지우고 reject 에서 새 오류 글을 쓰는 쪽이 그 순서에 기댄다.

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
| 고르기 · 끌어 놓기 | 형식 · 크기 · 개수를 다시 검사 — 통과한 파일은 줄 끝에 붙고(`pending`), 거절은 Field 오류 글로 한 번(이유마다 한 문장). 남은 자리보다 많이 고르면 앞에서부터 남은 만큼 붙인다 |
| 파일을 드롭존 위로 끌기(1280 이상 웹) | 테두리 · 바탕이 바뀐다(`dragOver`). 놓으면 고른 것과 같다. 드롭존 밖에 놓으면 브라우저가 파일을 열지 않게 막는다 |
| 올리는 중 | 그 항목에 값 있는 원 24 — 진행이 10초 동안 멈추면 실패로 바꾼다 |
| 다시 시도 | `onRetry(id)` — 다시 올리는 중으로 |
| 실패한 항목 누르기 | 덮개 전체가 "다시 시도" 다 — 누르면 `onRetry`. 메뉴 · 끌기는 다시 올린 뒤에 열린다(포인터). 키보드는 항목에 초점을 두고 `Enter` 로 메뉴, × 로 지우기가 그대로 된다 — 실패한 것은 먼저 다시 올리거나 지우는 일이라 옮기는 길을 막아도 잃는 것이 없다 |
| × 누르기 | 묻지 않고 지운다(`onRemove`). 초점은 다음 항목의 × → 없으면 앞 항목의 × → 없으면 첨부 타일 |
| 다 참 | 타일 `aria-disabled`(초점은 남는다) · 드롭존 · 파일 선택 막힘 |
| 항목 누르기 · `Enter`(`onReorder` · `onPreview`) | 항목 메뉴 — 1280 미만 Menu Sheet · 이상 Menu. 크게 보기 · 대표로 정하기 · 앞으로 옮기기 · 뒤로 옮기기 \| 지우기, 맨 앞 · 맨 끝은 그 방향이 막힌다. 옮긴 뒤 초점은 옮긴 항목, 지운 뒤는 × 와 같다 |
| 항목 끌기(`onReorder`) | 마우스는 8px 넘게 · 터치는 250ms 누른 채 움직이면 끌기(앱도 250ms 길게 누름) — 2px 줄어든 채 따라가고(사진은 불투명도 0.5 · 파일 카드는 글 `fg-disabled`) × 와 구멍이 사라진다. 놓은 자리로 옮긴다. 그 전에 움직이면 줄이 스크롤한다 |
| 항목에서 `Space` → `←` `→` → `Space` · `Enter` · `Esc`(`onReorder`) | 웹 — 들기 → 한 칸씩 옮기기 → 놓기 · 그만두기(처음 자리로). 앱은 들기 대신 접근성 동작 앞으로 · 뒤로 옮기기와 메뉴. 하나하나 읽는다(아래 Accessibility). `Enter` 는 들지 않고 메뉴를 연다 |
| 읽기 전용 | 타일 · × · 순서 바꾸기 · 메뉴 막힘 — 누르면 바로 크게 보기(`onPreview`). 사진은 불투명도 0.5 · 파일 카드 글 `fg-disabled`. 값은 제출된다 |
| Disabled | 새로 고르지 못하고 × 도 막힌다 — 숨은 입력도 막혀 제출되지 않는다 |
| 모션 줄이기 | 누름 축소 · 끄는 동안 축소를 뺀다 · 흐림 · 원의 채움은 바로 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 파일 이름 `fg-neutral` 흰 면 16.41 · 다크 13.42, 크기 · 개수 최대 · 드롭존 안내 · 파일 카드 다시 시도 `fg-neutral-subtle` 5.50 · 6.09(드롭존 끌기 바탕 위 5.18 · 4.68), 사진 위 흰 글(다시 시도 · 대표) 검정 65% 덮개 위 흰 사진에서도 7.00 ✓. 막힘 `fg-disabled` 는 기준 밖(비활성 UI). 읽기 전용 사진의 대표 띠 글은 불투명도 0.5 라 흰 사진 위 라이트 2.27 · 다크 3.38 ⚠ — SEED 그대로 둔 사용자 결정(13B — 비교 페이지가 "읽기 전용인데 읽기 어렵다" 를 알리고 정했다). 읽기 전용 파일 카드의 글 `fg-disabled`(3.16 · 4.13)도 SEED 그대로다 |
| **WCAG 1.4.4** Resize text | 글과 함께 상자 · 아이콘 · × 도 글자 배율만큼 커진다 ✓ — 웹은 rem, 앱은 크기에 글자 배율(textScaler)을 곱한다. 200% 에서 사진 160 · 파일 카드 320 × 160 이라 이름 네 줄 + 크기가 다 보이고 "다시 시도" 가 잘리지 않는다(2026-10-17 사용자 결정 — 03-B 결정 3 A) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 드롭존 테두리 `stroke-neutral-solid` 4.18 · 4.13(떠 있는 면 4.18 · 3.58), 끌기 테두리 16.41 · 13.42 ✓. 타일 아이콘 `fg-neutral-subtle` 5.50 · 6.09 · × 아이콘 `fg-neutral` 16.41 · 13.42 ✓. 올리는 중 원 — 사진 위 흰 호 3.95 · 19.27, 파일 카드 썸네일 칸 위 `stroke-neutral-solid` 3.87 · 3.18 ✓. 타일 · 카드 테두리 `stroke-neutral-weak`(1.23 · 1.56) · 사진 윤곽은 틀이다 — 아이콘 · 개수 · 사진이 부품을 알린다. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 5.06 · 6.23 ✓ |
| **WCAG 1.4.1** Use of color | 끌기는 테두리와 바탕이 함께, 다 참은 색과 함께 "10/10" 으로, 실패는 덮개 · 아이콘 · 글로 알린다 ✓ |
| **WCAG 2.1.1** Keyboard | 타일 · 파일 선택 · × · 다시 시도는 버튼(`Enter` · `Space`). 드롭존은 끌기만 받는 자리라 그 안의 "파일 선택" 버튼이 키보드 길이다. 순서 바꾸기는 `Space` · `←` `→` · `Esc` ✓ |
| **WCAG 2.5.7** Dragging movements | 드롭존 끌어 놓기 — "파일 선택" 버튼 한 번으로 같은 일 ✓. 항목 순서 바꾸기 — 항목을 누르면 메뉴(대표로 정하기 · 앞으로 옮기기 · 뒤로 옮기기)로 끌지 않고 옮긴다 ✓(사용자 결정 14A). 키보드 길(`Space` · `←` `→` · `Space`)도 있다 |
| **WCAG 2.4.3** Focus order | × 로 지우면 초점이 다음 · 앞 항목의 × · 타일로 간다 — 본문으로 떨어지지 않는다. 다 차도 타일에 초점이 남는다(`aria-disabled`) ✓ |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에 부품 안쪽 링 2px — 가로 스크롤 줄에 잘리지 않는다 ✓ |
| **WCAG 3.3.1** Error identification | 거절은 Field 오류 글(아이콘 + 글, `aria-describedby`)로, 올리기 실패는 항목 덮개 + "다시 시도" + 항목 이름("…, 올리지 못했어요")으로 ✓ |
| **WCAG 4.1.3** Status messages | 붙음 · 거절 · 올림 · 실패를 한 번씩 읽는다(polite — "사진 2장을 붙였어요." · "1개는 올리지 못했어요.") ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 타일 80 · × 44(보이는 20) · 다시 시도(사진 80 · 카드 160 × 80) · 파일 선택 36 · 48 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 타일 80 ✓ · × 44 ✓(보이지 않는 여백 12 씩) · 파일 선택 ✓ — small 36(드롭존 안 · 1280 이상 웹) · large 48 모두 Button 의 누르는 영역 44 |
| **WCAG 4.1.2** Name, Role, Value | 타일 "{칸 이름} 첨부, 3/10"(다 차면 `aria-disabled`), 항목 이름은 **전체** 파일 이름 + 크기 + 상태(줄인 글이 아니다), × "{파일 이름} 지우기", 다시 시도 "{파일 이름} 다시 시도", 올리는 중 원은 값 글("40%"). 순서를 바꿀 수 있으면 항목이 `role="button"` + `aria-roledescription="순서를 바꿀 수 있는 항목"` + 설명("Space 로 들고 ← → 로 옮긴 뒤 Space 로 놓아요. Esc 는 그만두기예요.") — × 는 항목의 형제다(단추 안 단추를 두지 않는다) |
| **ARIA** | 순서 바꾸기 읽기 글(dnd-kit `announcements` — 한국어): 들기 "{n}번째 항목을 들었어요." · 옮김 "{n}번째 자리예요." · 놓기 "{n}번째 자리에 놓았어요." · 그만두기 "옮기기를 그만뒀어요. 처음 자리예요." 항목 메뉴는 Menu Sheet(`role="dialog"` · 머리 = 파일 이름) · Menu(`role="menu"` · `aria-label` = 파일 이름)의 규칙 그대로 — 항목은 `aria-haspopup` · `aria-expanded`, 막힌 줄은 `disabled`, 지우기는 위험 묶음. 앱은 메뉴 시트와 함께 항목에 `Semantics(customSemanticsActions: 앞으로 옮기기 · 뒤로 옮기기)` 를 둔다 |
| **Reduced motion** | 누름 · 끄는 동안 축소를 뺀다 · 원의 채움은 바로 |

## Do / Don't

### ✅ Do

- 여럿 · 사진이 섞이는 첨부는 타일 + 한 줄, 파일 하나를 넘기는 자리는 드롭존.
- 형식 · 크기 · 개수를 설명에 적고, 고른 뒤 다시 검사해 그 자리(Field 오류)에서 알린다.
- 올리는 중은 값 있는 원 24, 실패는 덮개 + "다시 시도".
- 항목 이름은 전체 파일 이름 — 보이는 이름은 네 줄까지, 확장자를 남긴다.
- 드롭존의 키보드 길은 "파일 선택" 버튼으로.

### ❌ Don't

- 상자 전체를 `div onClick` 으로 눌리게 하기 · 점선 상자 · 📁 아이콘.
- 올리기 진행을 막대로 · 실패를 토스트로만 알리기.
- 막힘을 불투명도로 흐리기 — 불투명도 0.5 는 사진의 읽기 전용 · 끄는 중에만 둔 SEED 그대로의 예외다(13B).
- 순서를 끌기로만 바꾸게 하기 — 누르면 메뉴로도 옮긴다(14A).
- 파일 이름을 끝에서 잘라 확장자를 지우기 · 다섯 줄로 상자를 넘기기.
- 서버 한도 없이 "n/최대" 를 그리기 · `accept` 만 믿고 다시 검사하지 않기.
- 프로필 사진(한 장 · 원)을 이 칸으로 받기 — Avatar + 버튼.

## Specification

`attachment-input.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Attachment Input 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — attachment-input.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#attachment-input)

## SEED 와 다른 점

- **드롭존 색** — 테두리 `stroke-neutral-solid`(SEED palette.gray-500 — 다크 표면 위 2.71), 끌어 들어오면 `stroke-neutral-contrast` + `bg-layer-default-pressed`(SEED 는 테두리만 stroke.neutral-solid — gray-500 과 1.32 · 1.53). 막히면 테두리도 `stroke-neutral-weak`. 대비 표는 위 Dropzone.
- **드롭존은 늘 실선** — SEED rootage 는 기본이 점선이고 끄는 동안 실선이라고 적었다. 사용자가 1px 실선을 골랐다(5A — 점선은 지금 웹의 모양 5B 로 고르지 않았다). 끌기는 색 · 바탕으로 알린다.
- **덮개 · 띠** — SEED bg.overlay 대신 porest `overlay-dim` — 올리는 중은 Progress Circle 의 사진 위 딤(라이트 50% · 다크 65%), 글이 얹히는 실패 덮개 · 대표 띠는 두 모드 모두 65%(Image Frame Indicator 와 같은 까닭 — 50% 면 흰 사진 위 흰 글 3.95).
- **사진 윤곽은 `stroke-neutral-overlay`**(v118) — SEED stroke.neutral-subtle 의 투명한 값과 같다(porest 의 `stroke-neutral-subtle` 은 불투명한 구분선이라 이름을 나눴다).
- **항목 메뉴** — 항목을 누르면 크게 보기 · 대표로 정하기 · 앞으로 옮기기 · 뒤로 옮기기 \| 지우기(1280 미만 Menu Sheet · 이상 Menu) — SEED 는 끌기만 있다. 끌지 않는 포인터 길(WCAG 2.5.7)이다(사용자 결정 14A). 그래서 누르기와 끌기를 가르는 문턱(마우스 8px · 터치 250ms)을 porest 가 정했다.
- **파일 이름 네 줄 · 확장자 남김** — SEED 레시피는 줄을 자르지 않는다(`word-break: break-all` · `overflow: hidden`) — 다섯 줄부터 상자를 넘는다. 줄바꿈은 SEED 와 같은 글자 단위다 — porest Typography v114(단어 단위)의 예외로 사용자가 정했다(11D).
- 사진의 읽기 전용 · 끄는 중 불투명도 0.5 · 파일 카드의 `fg-disabled` 는 **SEED 와 같다** — porest v106(불투명도로 흐리지 않는다)의 예외로 사용자가 정했다(13B — 이 두 상태에만).
- **포커스 링은 모두 안쪽** — SEED 는 항목만 바깥이라 가로 스크롤 줄 아래쪽에서 잘린다.
- **× 의 누르는 자리 44** · **항목 줄은 화면 여백까지 + 끝 흐림 20**(Scroll Fog `row`) — SEED 는 × 20 그대로 · 넓히는 폭은 쓰는 쪽이 정한다.
- **누름 바탕은 불투명한 `bg-layer-default-pressed`**(SEED bg.transparent-pressed 의 짝).
- **거절은 Field 오류 글 · 이유마다 한 문장 · 한 번에 모아** — SEED 는 파일마다 `onFileReject` 를 부르고 글은 쓰는 쪽이 정한다. porest 는 한 번 고른 것의 거절을 모아 넘긴다(`onFilesReject`).
- **항목은 쓰는 쪽이 쥔다**(`entries` 제어) — SEED React 는 안에서 쥐고 `onAcceptedFileEntriesChange` 로 알린다.
- **앱의 고르기 창은 Menu Sheet** — SEED Lynx 는 호스트의 고르기 어댑터(`onSelectFiles`)만 둔다. 메뉴 시트는 porest 다.

## Migration notes

### 2026-10-17 — 앱 상자도 글자 배율을 따른다(03-B 결정 3 A)

앱 상자가 80 · 160 고정(`p_attachment_input_parts.dart:4` `_tile = 80` · :5 `_fileWidth = 160`)이라 글자 200% 에서 파일 카드의 이름 · 크기가 46px 넘쳐(RenderFlex overflowed) 아래를 덮거나 잘리고, 실패한 사진의 "다시 시도" 가 "다시 시ㄷ" 로 잘렸다(조사 03B-005 · 008). 웹은 rem(`size-20` · `h-20`)이라 200% 에서 이미 160 이다. 사용자가 [비교 페이지](https://claude.ai/artifact/SZwwW7UK1FxtZynvYBFLLx)에서 "상자도 글자 배율을 따른다"(A — 웹과 같다)를 골랐다. 앱은 타일 · 사진 80 · 파일 카드 160 · 썸네일 48 · 아이콘 24 · × 20 · × 아이콘 10 · × 의 누르는 44 · 위 여백 16 에 `MediaQuery.textScalerOf` 를 곱한다(이름 줄 계산은 이미 배율을 받는다). 80 고정 + 줄 줄이기(B)는 고르지 않았다. 옛 스펙은 `attachment-input.history/v-pre-03e-03b.*`.

### 2026-10-15 — 앱의 끌기 · 줄 넓히기 · × 의 누르는 44

구현 세션 질문 세 가지를 있는 결정(3A · 4A)으로 정리했다. 그동안 "SEED 는 웹 문서만 있다" 고 적었는데 틀렸다 — SEED Lynx(앱 쪽)에 `attachment-field` 문서가 있다.

- **앱도 길게 눌러 끈다**(Q-016-1) — 끌기는 3A("SEED 와 1:1")로 들였고, SEED Lynx 가 "네이티브 가로 long-press" 로 끈다. 앱만 끌기를 빼는 것은 어느 비교에도 없던 갈래다. 문턱은 웹 터치와 같은 250ms(Flutter 기본 길게 누름 500ms 가 아니다). 키보드 들기만 앱에서 빼고 접근성 동작 · 메뉴가 맡는다.
- **항목 줄은 앱에서도 화면 끝까지**(Q-016-2) — 4A 의 모습(줄은 화면 끝까지 · 첫 항목 24 · 흐림은 여백 안)을 지킨다. 방법은 놓는 화면이 칸을 화면 폭에 두고 안쪽 여백 24 — Field 안이면 Field 가 머리 · 꼬리를 24 들인다. 여백 안에 둔 채로는 쓰지 않는다(흐림 20 이 첨부 타일을 깎는다).
- **× 의 누르는 44 는 앱에서도 다 받는다**(Q-016-3) — 44 는 4A, 방법은 앱이 고른다(× 를 항목 안으로 들이는 것은 4A 의 모양을 바꿔 안 된다). 이웃과 겹친 8 은 × 가 먼저(웹은 이미 z 1), 라벨 없는 칸 · 맨 위 칸에서도 위 16 이 잘리지 않는다.

### 2026-10-15 — SEED Attachment Input 으로 새로 둔다

사용자가 [마무리 비교 페이지](https://claude.ai/artifact/KVyg5Kr95cYUkMT3vsxz1z)에서 정했다 — SEED 타일 · 카드(4A — 트리거 80 "n/10" · 사진 80 · 파일 160 × 80 · × 20 누르는 44 · 올리는 중 원 24 · 실패 다시 시도), SEED 드롭존(5A — 1280 이상 웹 높이 120 · 1px 실선 · 안내 + "파일 선택" 버튼, 1280 미만 · 앱은 버튼 + 파일 카드, 다크 테두리 2.71 · 끌기 색 차이는 대비 3 이상 역할 색으로 맞춘다), SEED 능력 넷(3A — 대표 배지 · 순서 바꾸기). 그리고 "따라오는 것" — 항목 상태 넷 + 다시 시도 · 다 차면 타일 막힘 · 넘친 파일은 거절 안내(해요체) · `accept` 를 다시 검사 · Field 라벨 · 설명 · 오류 · × 누르는 44 · 사진 덮개 `overlay-dim` · 앱 트리거는 Menu Sheet · 파일 이름은 네 줄에서 자른다 · "n/최대" 는 서버 한도가 먼저 · 순서 바꾸기의 불투명도는 그 차례에 정한다(아래 13B). 지금 앱 위젯(4B) · List 줄(4C) · 지금 웹 점선(5B) · 지금 앱(5C) · 옛 File Upload(5D)는 고르지 않았다. 프로필 사진은 이 칸이 아니라 Avatar + 버튼이다(6A — 6B "Attachment Input 한 장" 은 고르지 않았다).

이어서 같은 날 남은 넷을 정했다([비교 페이지 v2](https://claude.ai/artifact/KVyg5Kr95cYUkMT3vsxz1z) 11 ~ 14) — 파일 이름은 네 줄 · 글자 단위(break-all) · 넘치면 셋째 줄 "…" + 넷째 줄 확장자 · 보조 기술에는 전체 이름(11D — v114 의 예외), 드롭존은 늘 1px 실선(12A — 끄는 동안 "파일 선택" 면이 끌기 바탕과 섞이는 것은 그대로), 사진의 읽기 전용 · 끄는 중은 SEED 그대로 불투명도 0.5 · 파일 카드는 `fg-disabled`(13B — v106 의 예외), 항목을 누르면 메뉴(14A — 크게 보기 · 대표로 정하기 · 앞으로 옮기기 · 뒤로 옮기기 | 지우기, 끝에서 그 방향 막힘, × 는 지름길, 키보드 길은 그대로). 단어 단위 + 확장자(11A) · 네 줄째에서 자름(11B) · SEED 넘침(11C) · 평소 점선(12B) · 흐리지 않는 모습(13A) · 끌기 + 키보드만(14B) · 순서 바꾸기 없음(14C)은 고르지 않았다.

옛 DESIGN.md 의 `### File Upload (v73 추가)`(2px 점선 `border-default` · `surface-input` 바탕 · 📁 · 끌기 `border-focus` 2px + `primary` 8% · 막힘 불투명도 0.5 · 성공 ✓ "업로드 완료")와 브랜드 파일의 "File Upload — HR · Desk" 각주(평가 · 결재 첨부, 영수증 3장 · 메모 5장 — 코드에 없는 자리)는 이 스펙을 가리키는 한 줄로 바꿨다.

제품은 앱 적용 단계에서 옮긴다(2026-10-15 조사 — 각 레포 origin/main 을 코드로 읽었다).

- **Desk 거래 영수증 · 메모 첨부 — 새로 여는 기능** — 서버에는 있다: `POST /api/v1/files/upload`(file · referenceType · referenceRowId) · `GET /files/{id}` · `GET /files` · `DELETE /files/{id}`(desk-back `file/controller/FileApiController.java:38-81`), `ReferenceType` 은 `EXPENSE_RECEIPT` · `MEMO_ATTACHMENT` 둘(`file/type/ReferenceType.java:3-5`), 한 파일 10MB · 확장자 jpg · jpeg · png · gif · webp · bmp · svg · pdf · doc · docx · xls · xlsx · ppt · pptx · txt · csv(`FileStorageService.java:25-37`), 개수 한도 없음. 웹은 `/files` 를 부르는 곳이 없고, 앱 `FileAttachmentSection`(`lib/features/file/presentation/file_attachment_section.dart:23-246`)은 어디에도 붙어 있지 않다 — 게다가 주석의 `referenceType` "EXPENSE/TODO/MEMO/CALENDAR_EVENT" 가 서버 enum 과 맞지 않아 붙이면 400 이 난다. 그 위젯은 아이콘 버튼 32(누르는 자리 44 미만 · 이름은 툴팁뿐) · 썸네일 없음 · 올리는 중 개별 진행 없음(`_busy` 로 버튼만 막음) · 실패는 보이지 않음(`on ApiException` 빈 블록) · 지우기 전 확인 대화상자다. 거래 상세 · 메모 편집에 `tile` 로 새로 연다 — 웹 · 앱 함께, referenceType 을 서버와 맞추고, "n/최대" 를 쓰려면 서버 개수 한도부터 정한다.
- **Desk 데이터 가져오기(CSV · Excel) — 웹(A1)** — 1.5px 점선 상자 + 원 48 아이콘 · "파일을 끌어다 놓거나 클릭해서 선택"(`widgets/data-transfer/ui/DataImportSection.tsx:237-310` — 입력 `:239-240` · 놓기 `:254-258`). 상자가 `div onClick` 하나라 `role` · `tabIndex` 가 없어 **키보드로 못 닿는다**. 크기를 미리 검사하지 않고(서버 10MB — `desk-back application.yml:17`) 오류는 전역 토스트다(`:142`). 고르면 바로 `POST /v1/import/analyze` 로 보내고(`features/import/api/importApi.ts:82-91`), 다음 단계 "가져올 파일" 카드(`:394-420` — 이름 + "{n}개 행 · 유효 {m}건" + "× 변경")로 간다. `dropzone` 으로 — 1280 이상 드롭존 + "파일 선택" 버튼 · 고른 파일 카드 + 분석 중 원 · 거절은 칸 아래 오류 글. 행 수는 다음 단계 화면에 남는다.
- **Desk 데이터 가져오기 — 앱(A2)** — 풀폭 InkWell **실선** 상자 + 원 48 · "파일 선택"(`lib/features/import/presentation/import_view.dart:254-311`), 고른 뒤 카드(`:389-437` — 아이콘 36 · 이름 한 줄). 웹과 테두리 · 문구가 다르고, 끌어 놓기가 없는데 놓는 상자처럼 생겼다. 1280 미만 · 앱 모양(파일 선택 버튼 large + 파일 카드)으로.
- **HR 휴가 증빙 — 나중** — 휴가 정책에 `documentSubmission`(before · after · none) · `documentDescription` 타입만 있고(`src/entities/vacation/model/types.ts:17 · 39-40`) 올리는 화면 · API 가 없다(hr-back 업로드는 프로필 사진뿐). 생기면 `tile` 의 가장 자연스러운 자리다.
- **이 칸이 아닌 것** — HR 프로필 사진(`features/user-profile/ui/UserEditDialog.tsx`)은 [Avatar](avatar.md) 의 "사진 바꾸기"(6A). HR 엑셀 데이터 가져오기(`features/work-report/ui/ExcelImportDialog.tsx:300-330`)는 파일이 아니라 붙여 넣은 글이다 — 파일로 받게 되면 `dropzone`. 대시보드 위젯 · 부서 나무의 끌어 옮기기는 파일이 아니다.
