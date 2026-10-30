# List

> 가로 줄로 된 내용을 세로로 잇는 컴포넌트. 설정 · 메뉴 · 선택 · 키-값 줄과 거래 · 할 일 · 알림 같은 내용 줄을 모두 이것으로 그린다.

구조는 당근 [SEED List](https://seed-design.io/components/list)(Apache-2.0)를 따른다 — 목록(List) · 한 줄(List Item) · 목록 제목(List Header) · 줄 사이 선(ListDivider). 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-01 사용자 결정).

수치 원본은 [`list.yaml`](list.yaml)(목록 · 한 줄)과 [`list-header.yaml`](list-header.yaml)(목록 제목)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 설정 · 선택 · 내용 줄 — 가운데는 다크](../../site/components/specs/list.tsx#hero)

### 직접 골라 보기

줄의 종류 · 앞 · 뒤 · 맞춤 · 강조 · 상태를 고르면 스펙대로 그린 줄과 그 코드가 바뀐다. 실제로 눌러 볼 수 있다.

[그림: 플레이그라운드](../../site/components/specs/list.tsx#playground)

## Anatomy

[그림: 한 줄은 앞 붙이개 · 본문(제목 · 설명) · 뒤 붙이개로 이뤄지고, 목록 위에 목록 제목을 둔다](../../site/components/specs/list.tsx#anatomy)

| ⓐ Prefix | 앞 붙이개 — 설정 · 메뉴 줄은 아이콘 22, 색이 뜻을 가진 내용 줄은 타일 40, 은행 · 카드 같은 물건 줄은 로고 타일 40. 아바타 · 카드 그림 · 체크 · 라디오도 둔다. |
| ⓑ Title | 제목 — 16 · 400. 무엇인지 한 줄로. |
| ⓒ Detail | 설명 — 13 · 옅은 색. 제목만으로 모자랄 때만. |
| ⓓ Suffix | 뒤 붙이개 — 값 글자 · 오른쪽 화살표 · 스위치 · 체크 · 라디오 · 작은 버튼. |
| ⓔ List Header | 목록 제목 — 목록 밖, 바로 위. |

한 줄은 두 층이다 — **바탕 층**(누름 · 호버 · 강조 바탕)과 **콘텐츠 층**(앞 · 본문 · 뒤). 누르면 바탕 층은 안쪽으로 들어와 둥글어지고, 콘텐츠 층만 2px 거리로 준다(기초 Feedback v104 — "목록 줄은 콘텐츠만").

[표: 부위](list.yaml#slots)

## Properties

### 줄의 종류

같은 모양이 하는 일에 따라 넷으로 나뉜다.

- **보기만 하는 줄**(`ListItem`) — 누르지 않는다. 키-값 · 안내 줄.
- **누르는 줄**(`ListButtonItem`) — 줄 전체가 버튼. 화면을 옮기면 오른쪽 화살표를 단다.
- **링크 줄**(`ListLinkItem`) — 줄 전체가 링크. 다른 페이지 · 바깥 주소로 간다.
- **컨트롤 줄**(`ListSwitchItem` · `ListCheckItem` · `ListRadioItem`) — 줄 전체가 라벨이라 줄 어디를 눌러도 끼운 스위치 · 체크 · 라디오가 바뀐다.

[그림: 줄의 종류 넷](../../site/components/specs/list.tsx#kinds)

모든 줄에 공통인 값(상태마다 바뀌는 값은 아래 State):

[표: 공통](list.yaml#base.enabled)

### Align

맞춤의 기본은 가운데(`center`)다 — 앞 · 뒤가 본문의 세로 가운데에 선다. 제목이 두 줄을 넘거나 설명이 길면 위(`top`)로 맞춘다. 한 목록 안에서는 줄마다 맞춤을 섞지 않는다.

[그림: 가운데 · 위 맞춤](../../site/components/specs/list.tsx#align)

[표: 맞춤](list.yaml#align)

### Highlight

새 알림처럼 주목이 필요한 줄은 바탕을 옅은 브랜드 색(`bg-brand-weak`)으로 바꾼다(`highlighted`). 바탕만 바뀐다 — 점 · 왼쪽 막대는 두지 않는다(사용자 결정, SEED 와 같다). 읽음 · 안 읽음처럼 상태를 알리는 자리는 제목 · 설명의 글로도 알 수 있게 쓴다.

강조 줄을 올리거나 누르면 바탕이 `bg-brand-weak-pressed` 로 짙어지고, 그동안만 설명 · 값 글자를 한 단계 짙은 `fg-neutral-muted` 로 바꾼다 — `fg-neutral-subtle` 은 짙은 강조 바탕 위에서 4.32:1 로 글자 기준(4.5:1)에 모자란다(사용자 결정). 제목 · 화살표는 그대로다.

[그림: 강조 — 안 읽은 알림 둘](../../site/components/specs/list.tsx#highlight)

[표: 강조](list.yaml#grid.highlight)

[표: 강조 — 올리거나 누를 때](list.yaml#states.highlight)

### State

누르는 줄 · 컨트롤 줄은 호버 · 포커스 · 누름 · 비활성을 가진다. 보기만 하는 줄은 상태가 없고(누를 것이 없다), 링크 줄은 막지 않는다 — 갈 수 없는 곳이면 줄을 빼거나 누르는 줄로 바꿔 막는다.

| 상태 | 모습 |
|---|---|
| `enabled` | 기본 — 바탕 없음 |
| `hovered` | 웹. 누름과 같은 바탕(v106) — 좌우 6 들어온 `bg-layer-default-pressed`, 모서리 10 |
| `focused` | 웹. 키보드 포커스에만 줄 안쪽 링 2px — 화면 폭 줄은 바깥 링이 잘린다 |
| `pressed` | 호버와 같은 바탕 + 콘텐츠 층만 2px 거리 축소(v104 — 기준 길이가 폭 ÷ 4 라 세로로는 1px 남짓). 강조 줄은 올리거나 누르는 동안 설명 · 값 글자가 `fg-neutral-muted` |
| `disabled` | 제목 · 설명 · 앞뒤 아이콘이 모두 `fg-disabled`, 타일은 `bg-disabled`. 불투명도로 흐리게 하지 않는다(v106) |

[그림: 상태 — 호버 · 포커스 · 누름은 그 순간을 멈춰 그렸다](../../site/components/specs/list.tsx#states)

상태마다 `enabled` 에서 바뀌는 값:

[표: 호버 hovered](list.yaml#base.hovered)

[표: 포커스 focused](list.yaml#base.focused)

[표: 누름 pressed](list.yaml#base.pressed)

[표: 비활성 disabled](list.yaml#base.disabled)

[그림: 직접 눌러 보기 — 누르는 줄 · 컨트롤 줄(Tab 으로 포커스, Space 로 바꾼다)](../../site/components/specs/list.tsx#live)

[표: 모션](list.yaml#motion)

### 합계에 안 드는 줄

예정(아직 빠지지 않은 돈) · 환불(취소된 돈) 거래처럼 화면의 합계에 들지 않는 줄은 **불투명도로 흐리지 않는다** — 줄 전체를 흐리면 그 줄을 가르는 단서인 배지까지 흐려진다. 대신 이렇게 둔다(사용자 결정 2026-10-03).

- 제목 · 금액만 `fg-neutral-subtle`(흰 바탕 5.50 · 다크 6.09) — 훑어볼 때 합계에 드는 줄과 갈린다.
- 환불된 금액은 취소선을 긋는다. 취소선은 보조 기술이 읽지 않으므로 뜻은 배지 글("환불됨")이 말한다.
- 상태 [Badge](badge.md)("예정" · "환불됨" · "기록만" — `weak` `neutral`)는 보통 대비 그대로다(6.58 · 5.93).
- 앞 타일 · 설명 줄은 보통 줄과 같다. 누름 · 호버 · 포커스도 보통 줄과 같다(막힌 줄이 아니다).

[그림: 합계에 안 드는 줄 — 예정 · 환불, 배지는 또렷하게](../../site/components/specs/list.tsx#excluded-rows)

### Prefix

앞 붙이개는 줄이 무엇인지 먼저 알린다.

- **아이콘 22**(`fg-neutral`) — 설정 · 메뉴 줄.
- **타일 40**(모서리 12) — 색이 뜻을 가진 내용 줄(거래 · 카테고리 · 알림 종류). 바탕은 카테고리 색의 옅은 바탕(`chart-{색}-weak`, v111), 아이콘 20 은 그 색이다. 아이콘이 없는 카테고리는 태그 아이콘(lucide `tag`) 하나로 그린다 — 빈 칸 · 첫 글자를 넣지 않는다. 이체 줄은 회색(`chart-gray-weak` + `chart-gray`)이다 — 카테고리가 아니라 돈의 이동이다. 크기를 바꾸면 모서리도 크기 × 0.3 으로.
- **로고 타일 40**([Logo Tile](logo-tile.md)) — 은행 · 증권 · 카드 · 코인 · 금 같은 물건 줄(자산 · 계좌 관리). 기관 색 + 첫 글자, 그림이 있으면 덮는다. 막힌 줄에서도 그대로다.
- **카드 그림 56**([Image Frame](image-frame.md) 의 카드 그림) — 카드 혜택 목록처럼 카드 자체가 줄인 자리. 폭 56 · 카드 비율.
- **아바타**([Avatar](avatar.md) — 한 줄이면 36, 이름 + 설명 두 줄이면 42) · **체크 · 라디오**(컨트롤 줄 — 24).

[그림: 앞 붙이개 — 아이콘 · 타일 · 로고 타일 · 카드 그림 · 아바타 · 체크](../../site/components/specs/list.tsx#prefix)

### Suffix

- **값 글자**(16 · `fg-neutral-subtle`) — 지금 고른 값(기본 통화 "대한민국 원").
- **오른쪽 화살표**(18 · `fg-neutral-subtle`) — 화면을 옮기는 줄에만.
- **스위치 32** · **체크 24** · **라디오 24** — 컨트롤 줄. 스위치는 제목 16 줄이라 32 다(Switch 스펙).
- **작은 버튼** · **금액** — 금액은 16 / 22 · 700 · 고정폭 숫자(DESIGN.md Typography 의 "글자 역할" R13). 색은 지출 · 이체 `fg-neutral`, 수입만 `fg-brand`("+" 와 함께) — 금액을 빨갛게 칠하지 않는다. 빨강은 증감(▲) 한 뜻이다(2026-10-16 사용자 결정 — 글자 역할 D1). 합계에 안 드는 줄(예정 · 환불)은 아래처럼 `fg-neutral-subtle`.

[그림: 뒤 붙이개 — 값 글자 · 화살표 · 스위치 · 체크 · 라디오 · 작은 버튼](../../site/components/specs/list.tsx#suffix)

#### 값이 길 때

뒤 붙이개는 줄지 않고 본문이 양보한다 — SEED List Item 과 같다(뒤 붙이개 `flexShrink 0` · 본문 `flexGrow 1`). 값이 길어 본문이 눌려도 겹치지 않게 세 가지만 둔다(2026-10-15 사용자 결정 — 구현 세션 질문 Q-001, 안 A).

- **본문은 한 글자(1em)까지 준다** — 그보다 좁아지지 않는다. 뒤 여백 10 은 따로다. 1em 은 제목 글자(t5 16) 크기다 — 누르는 줄의 버튼이 물려받은 글자(14)로 재면 24 가 되므로 레시피는 `calc(var(--text-t5) + 10px)` 로 적는다(보통 글자에서 26, 2026-10-17 고침).
- **제목 · 설명은 칸 끝에서 끊는다**(`overflow-wrap: anywhere`) — 평소에는 단어 단위(Typography v114)로 바꾸고, 본문이 낱말 하나보다 좁아질 때만 글자 사이에서 끊어 칸 밖으로 넘치지 않는다. 설명을 [Tag Group](tag-group.md) 으로 그리면 그 스펙대로 한 줄 말줄임이다.
- **글 값(이메일 · 계좌번호 · 긴 이름)은 줄 끝에서 끊는다** — 본문이 한 글자 폭이 된 뒤에도 남는 폭보다 길면 줄 끝에서 줄을 바꾼다. 본문 위로 넘쳐 덮지 않는다. 레시피는 `suffix` 에 글을 그대로 넘긴 값 글자만 이렇게 다룬다.

금액 · 화살표 · 스위치 · 작은 버튼은 그대로 한 덩어리다 — 금액은 한 줄로 서고, 본문이 그만큼 눌린다. 값을 줄여 적는 것(억 단위 등)은 그 화면이 정한다. 값을 아래 줄로 내리기(안 B) · 값 종류로 가르기(안 C) · 가운데를 잘라 줄이기(안 D)는 고르지 않았다 — 값 폭으로 가르는 규칙은 없다. 줄 자체가 좁을 때만 아래 "큰 글자에서 값을 본문 아래로" 가 값을 내린다.

[그림: 가장 나쁜 값 — 긴 제목 + 큰 금액(320) · 52자 이메일 키-값(360), 겹치지 않는다](../../site/components/specs/list.tsx#long-values)

[표: 본문 · 뒤 붙이개의 폭](list.yaml#base.enabled@body+title+detail+suffix+suffixText)

#### 큰 글자에서 값을 본문 아래로

**줄 안 폭이 제목 글자 16개(16em)보다 좁을 때만** 값(글 값 · 금액)을 본문 아래로 내린다(2026-10-17 사용자 결정 — [03-D 목록 · 카드 · 표 비교 페이지](https://claude.ai/artifact/7TVGy8o47HBg4R3SefDmf6) 결정 1 B). 글자를 130 · 200% 로 키우면 긴 값 옆 제목이 한 글자 폭 기둥이 되어 줄 하나가 화면 세 장 길이가 됐다(360 · 200% 웹 1,872 ~ 2,390 · 앱 1,872 ~ 2,318).

- **이것은 Q-001 A 의 예외이고, 기준이 다르다.** 내려가는 모양은 위에서 고르지 않은 Q-001 안 B · C(값 폭 · 값 종류로 가르기)와 같지만, 기준은 값의 길이가 아니라 **줄 안 폭**이다 — 글자 배율 · 화면 폭으로 줄이 좁아질 때만이다. 줄 안 폭이 16em 이상이면 값이 아무리 길어도 위 "값이 길 때"(Q-001 A) 그대로다.
- **줄 안 폭** = 줄 폭 − 좌우 여백(앞 붙이개 · 꺾쇠 단추 자리는 들어간다). em 은 제목 글자(t5) 크기라 글자 배율을 따라 커진다 — 보통 글자에서 256 이라 320 폰(줄 안 272)까지 지금과 같고, 360 폰(줄 안 312)은 글자 약 122% 부터(130% 면 15em) 내려간다. 화면이 고르지 않는다 — 줄이 스스로 잰다(웹 `16rem` 컨테이너 쿼리 · 앱 `LayoutBuilder` 로 16 × t5 × 글자 배율, 같은 값).
- **모양** — 제목 · 설명 · 값이 위아래로 쌓이고 제목이 줄 안 폭을 다 쓴다. 값은 설명 아래 4(본문 사이 2 + 2), 본문 칸 안 왼쪽 맞춤이다. 앞 붙이개는 위에 맞춘다. 금액은 쉼표 뒤에서만 줄을 바꾸고(결정 2 B — Typography v114 의 예외, 웹 `<wbr>` · 앱 U+200B), 글 값(이메일 · 계좌번호)은 Q-001 A 그대로 줄 끝에서 끊는다.
- **목록은 폭이 정해진 부모 안에 둔다(웹)** — 줄(`li`)이 폭을 재는 컨테이너(`container-type: inline-size`)라, 내용 폭으로 크기를 정하는 부모(`inline-block` · `w-max` · `w-fit` 팝오버 · 가로 flex 의 `auto` 항목) 안에서는 줄 폭이 0 이 된다. 블록 · 화면 폭 · 폭을 정한 팝오버(알림 380 처럼) · 시트 안에 둔다. 앱은 `LayoutBuilder` 라 해당 없다(2026-10-22 I-02 웹 검수).
- **조작 요소는 줄 끝 그대로** — 화살표 · 스위치 · 체크 · 라디오 · 작은 버튼은 내리지 않는다(2026-10-17 사용자 결정 — 누르는 자리를 옮기지 않는다). 글자 배율 상한(150% 에서 멈추기)은 두지 않는다 — 고르지 않았다.

[그림: 큰 글자 — 줄 안 폭이 16em 보다 좁으면 값이 본문 아래로(폭 360 · 글자 100 · 130 · 200%)](../../site/components/specs/list.tsx#narrow)

[표: 좁은 줄 — 값을 본문 아래로](list.yaml#width)

### Detail

설명은 제목 아래 2 떨어져 13 으로 쓴다. 제목만으로 무엇인지 알 수 있으면 두지 않는다. 길어지면 두 줄까지, 그 이상이면 맞춤을 위로 바꾼다. 분류 · 자산 · 시각처럼 여러 메타를 잇는 설명 줄은 [Tag Group](tag-group.md)(`t3` · 한 줄 말줄임)이다.

[그림: 설명 — 한 줄 · 두 줄](../../site/components/specs/list.tsx#detail)

### 목록 제목(List Header)

목록 밖, 바로 위에 두는 제목이다. 두 가지다.

- `mediumWeak`(기본) — 14 · 500 · `fg-neutral-subtle`. 줄보다 앞서지 않는다.
- `boldSolid` — 14 · 700 · `fg-neutral`. 화면을 크게 나누는 묶음에만.

오른쪽 작은 버튼은 큰 글자에서 오른쪽 동작이 머리 폭의 절반을 넘으면 제목 아래 줄 오른쪽 끝으로 내린다 — 제목은 한 줄 전체 폭으로 읽히고 머리가 버튼 한 줄(36)만큼 높아진다. 평소(100% · 130%)는 한 줄 그대로다. [Button](button.md) 짝의 반 폭 판정과 같고, 카드 머리 · 아코디언 목록 머리 · List Header 가 같은 규칙이다(2026-10-21 사용자 결정 — 03-G 결정 4 A, https://claude.ai/artifact/A3oCdxNvDwkNBPFPE36bmF). 판정 — 동작의 보이는 상자 폭(글 + 좌우 14 · 14)에서 끝 블리드 14(머리 여백으로 내어 걸리는 몫)를 빼고 사이 10 를 더한 값이 머리 안쪽 폭의 절반 이하면 한 줄, 넘으면 내린다. 레시피의 flex 줄바꿈(제목 최소 50%)이 그대로 이 셈이다 — 예: 머리 안쪽 300 이면 오른쪽 버튼 보이는 상자 154 까지 한 줄 · 155 부터 내려간다(카드 머리 · 아코디언 목록 머리 156 / 157 · List Header 는 사이가 10 이라 154 / 155). 결정 페이지(https://claude.ai/artifact/A3oCdxNvDwkNBPFPE36bmF) · 보류 둘 결정 페이지(https://claude.ai/artifact/7ENKeRYQMzFijZHnf5kaP7)의 그림은 상자 폭 ≤ 절반으로 그렸다 — 이 셈과 6 이하로 갈려 그림의 어느 경우도 달라지지 않는다(200% 에서 360 화면 "모두 펼치기" 154 는 한 줄, 320 화면 "전체 보기" 130 은 한 줄 · "모두 펼치기" 는 내려감). 웹 · 앱 모두 이 셈으로 판정한다.

오른쪽에 작은 버튼(도움말 · 전체 보기)을 둘 수 있다 — 글이면 글 버튼(SEED Text Button 14 · 700 · `fg-neutral-muted` · 보이는 36 · 위아래로 블리드해 줄 높이를 바꾸지 않는다, 2026-10-16 사용자 결정 — 글자 역할 D2). Card 머리 동작과 같은 값이다. 화면 맨 위 제목 · 카드 제목은 목록 제목이 아니다 — 카드 제목은 [Card](card.md) 의 머리(16 / 22 · 700, 2026-10-08)다.

**제목 태그** — 목록 제목은 머리말이다(웹 `h2` 기본 · 앱 `headingLevel: 2`) — 화면 제목(1) 아래 단계라 카드 제목과 같은 단계다. 카드 · 대화상자 · 시트처럼 자기 제목(2)을 가진 상자 안이면 한 단계 아래(웹 `as="h3"` · 앱 3)로 내린다. 오른쪽 작은 버튼이 있으면 **제목 태그는 제목 글에만** 걸고 버튼은 제목 밖(나란한 형제)에 둔다 — 제목을 줄 전체에 걸면 머리말 이름이 "카테고리별 예산 전체 보기" 처럼 버튼 글과 섞여 읽힌다. 앱 `PListHeader` 가 이미 이렇게 한다(제목 글만 `Semantics(header)`, 버튼은 밖). Card 의 `CardTitle` · `CardAction` 과 같은 방식이다(2026-10-22 — 03-D 조사 03D-007 · 02-004 의 웹 짝, I-02 웹 재검수).

[그림: 목록 제목 두 가지](../../site/components/specs/list.tsx#header)

[표: 목록 제목](list-header.yaml#variant)

[표: 목록 제목 — 공통](list-header.yaml#base)

### 줄 사이 선(ListDivider)

줄 사이 선은 기본으로 두지 않는다 — 줄의 위아래 여백이 줄을 가른다. 촘촘한 목록 · 설명 없는 긴 목록처럼 구분이 필요할 때만 `ListDivider`(1px · `stroke-neutral-subtle`)를 넣는다. 줄 폭 전체가 기본이고, 앞 붙이개가 있는 목록은 들일 수 있다(좌우 24). 목록 밖의 구분선은 [Divider](divider.md)(같은 색) 다.

[그림: 구분선 — 없음(기본) · 줄 폭 · 들임](../../site/components/specs/list.tsx#divider)

### 하위 줄 — 접는 부모 줄

카테고리처럼 부모 · 하위 두 단계로 된 목록에서 줄 자체는 편집을 열고 하위 줄만 접을 때는, 부모 줄 앞에 **꺾쇠 단추**를 둔다(`nest="parent"` — 2026-10-10 사용자 결정 7C). 단추는 보이는 상자가 곧 누르는 영역 44 이고, 줄 앞 4 · 단추 뒤 4 를 지나 앞 붙이개가 52 에서 시작한다. 꺾쇠는 lucide `chevron-right` 20 `fg-neutral-subtle` — 접혀 있으면 오른쪽, 펼치면 아래로 90° 돈다(300ms — Accordion 과 같다). 이름은 "{카테고리} 하위 카테고리" 로 고정하고 펼침은 `aria-expanded` 가 알린다 — "접기 · 펼치기" 로 바꾸지 않는다. 하위 줄(`nest="child"`)은 부모의 제목 자리 104(= 4 + 44 + 4 + 타일 40 + 12)에서 시작해 하위 타일이 부모 제목 아래에 선다 — 누름 바탕은 줄 폭 그대로다. 하위가 없는 부모 줄 · 늘 펼쳐 두는 화면(편집 모드)도 꺾쇠 자리를 같은 폭으로 비워 부모 타일이 모두 52 에 선다 — 타일이 두 세로줄(52 · 104)로 정리된다(사용자 결정 17B). 처음 펼침은 화면이 정한다 — 카테고리는 지금처럼 모두 펼친 채 연다(기본 지출 카테고리의 하위는 0 ~ 6개).

늘 펼쳐 두는 화면(편집 모드)은 이름 있는 스위치 `collapsible={false}` 로 켠다 — 꺾쇠 단추를 그리지 않고(자리는 같은 폭으로 비운다), 하위 줄은 늘 보이며 `aria-expanded` 를 두지 않는다. [Tree View](tree-view.md) 의 `collapsible` 과 같은 이름 · 같은 뜻이다. 접을 수 있는 부모 줄(`collapsible` 기본 `true`)은 꺾쇠 단추의 이름 `expandLabel` 이 필수다 — 하위가 없는 줄에도 같은 이름을 준다(하위가 생기면 바로 단추가 선다). 이름을 빠뜨리면 레시피 타입이 막는다 — 이름을 빼서 조용히 늘 펼침이 되던 옛 레시피는 걷었다(2026-10-15 사용자 결정 — 구현 세션 질문 Q-002, 안 B).

[그림: 같은 카테고리 — 보통 화면(접는 줄)과 편집 화면(collapsible={false} — 꺾쇠 자리는 비우고 하위 줄은 늘 보인다)](../../site/components/specs/list.tsx#nested-fixed)

이 줄은 편집 대화상자를 여는 줄이라 오른쪽 화살표를 달지 않는다(화살표는 화면을 옮기는 줄에만) — 지금 앱처럼 접힌 부모 줄에 › 가 둘(접힘 · 이동) 생기지 않는다. 여러 단계에서 하나를 고르는 나무는 [Tree View](tree-view.md) 다. 접기를 걷는 안(7B)과 부모 줄 전체를 펼치기로 · 편집은 ⋮(7D)는 고르지 않았다.

[그림: 카테고리 — 줄 앞 꺾쇠 단추 44 · 하위 줄 104 · 하위 없는 줄은 빈 자리(폰 · 데스크톱)](../../site/components/specs/list.tsx#nested)

[표: 단계](list.yaml#nest)

[표: 펼침](list.yaml#expanded)

[표: 꺾쇠 단추 — 상태](list.yaml#states.nest)

[표: 늘 펼침 — collapsible={false}](list.yaml#mode)

## Guidelines

### 모든 줄을 List 로

설정 · 메뉴 · 선택 · 키-값 줄과 거래 · 할 일 · 메모 · 알림 같은 내용 줄을 모두 List 줄로 그린다(사용자 결정). 줄의 여백 · 글자 · 누름 · 구분선은 List 가 정하고, 앞의 타일 · 뒤의 금액처럼 그 화면만의 자리만 화면이 채운다.

[그림: 같은 줄로 그린 설정 · 가계부](../../site/components/specs/list.tsx#all-rows)

### 목록 제목으로 묶기

줄이 많으면 목록 제목으로 묶는다. 같은 묶음은 어느 화면에서나 같은 모양이어야 한다 — "카테고리별 예산" 이 화면마다 다른 크기로 그려지지 않게.

[그림: 목록 제목으로 묶은 설정](../../site/components/specs/list.tsx#group-guide)

### 누르는 줄만 누르게

화면을 옮기는 줄에만 오른쪽 화살표를 단다. 화살표가 있는데 눌리지 않는 줄, 눌리는데 아무 표시가 없는 줄을 만들지 않는다. 보기만 하는 줄은 호버 · 누름 바탕이 생기지 않는다.

[그림: 화살표는 화면을 옮기는 줄에만](../../site/components/specs/list.tsx#chevron-guide)

### 줄 안의 누르는 것은 셋 이하

한 줄에 따로 누르는 것(줄 자체 · 작은 버튼)은 셋 이하로 둔다 — 넷 이상은 피한다(SEED List "4개 이상 지양"). 넷째가 필요하면 줄을 나누거나 상세 화면으로 옮기는 쪽을 먼저 본다. 스위치 · 체크 · 라디오를 끼운 줄에는 다른 버튼을 두지 않는다(아래 "스위치 · 체크 · 라디오 줄")(2026-10-22 사용자 결정 5B — https://claude.ai/artifact/SmHD31RQxTjWbfK83nbcym).

[그림: 누르는 자리 하나 · 둘 · 셋 — 그리고 넷](../../site/components/specs/list.tsx#targets-guide)

### 줄의 동작은 들어간 화면에

목록 줄 끝에는 ⋮(더보기)를 두지 않는다 — 가계부든 카테고리 설정이든 같다. 줄을 누르면 한 단계 들어가고(상세 · 수정), 그 항목의 동작은 들어간 화면에 둔다 — 하나(삭제)면 바닥 왼쪽 [삭제](Button `ghost` + `critical`), 여럿이면 머리 오른쪽 ⋮ → [Menu](menu.md)(1280 미만 [Menu Sheet](menu-sheet.md)). 폰의 [밀기](swipe-actions.md)는 지름길로 남는다. 줄에 ⋮ 를 둘 수 있는 건 콘텐츠가 높은 카드(사진 · 여러 줄 · 버튼이 든 카드)의 머리뿐이고, 데스크톱 데이터 표의 줄은 이 규칙 밖이다([Table](table.md)) — 규칙 전문은 [Menu](menu.md) 의 "줄의 동작"(2026-10-25 사용자 결정).


### 스위치 · 체크 · 라디오 줄

스위치 · 체크 · 라디오를 끼우면 줄 전체가 라벨이 된다 — 줄 어디를 눌러도 바뀐다. 이 줄에는 따로 누르는 버튼을 같이 넣지 않는다. 약관처럼 따로 볼 내용은 제목 안의 링크로 두고, 그 링크를 눌러도 줄의 값이 바뀌지 않게 한다. 줄을 누르면 줄의 콘텐츠가 함께 줄고, 끼운 스위치 · 체크 · 라디오는 따로 줄지 않는다(v104).

[그림: 컨트롤 줄 — 줄 어디를 눌러도 바뀐다](../../site/components/specs/list.tsx#control-guide)

### 하나 고르기 · 여럿 고르기

목록에서 하나를 고르면 라디오(24)를 뒤에, 여럿을 고르면 체크(24)를 앞이나 뒤에 둔다(사용자 결정, SEED). 고른 것과 안 고른 것이 모두 보인다. 한 묶음에서 라디오와 체크를 섞지 않고, 하나 고르기는 두 줄 이상이어야 한다.

[그림: 기본 통화 — 하나 고르기는 라디오](../../site/components/specs/list.tsx#select-guide)

### 끌 수 없는 켬 — 칸만 막는다

체크 줄 가운데 늘 켜져 있어야 하는 줄(숨길 수 없는 기본 캘린더)은 **칸만 막힌 켬**(Checkbox `disabled` + `checked` — 회색 칸 · 회색 체크)으로 두고, 제목 · 앞 붙이개(색 점 · 타일) · 배지는 보통 줄과 같은 색이다(`locked`). 줄 전체를 막는 `disabled` 를 쓰지 않는다 — 제목이 회색이면 "꺼진 것" 으로 읽히고, 그 줄의 색 점이 사라진다. 끌 수 없는 까닭은 배지(예: "기본")가 말한다. 줄은 누르지 못하고 포커스에서 빠지며(막힌 칸과 같다), 보조 기술은 "개인, 기본, 체크됨, 사용할 수 없음" 으로 읽는다(2026-10-29 사용자 결정 B — https://claude.ai/artifact/71eeYtuohccHruWQ4YcpQM).

```tsx
<ListCheckItem locked title={<>개인 <Badge>기본</Badge></>} />
```

### 여백을 바꿀 때

줄의 여백은 화면에 맞게 바꿀 수 있다 — 단 토큰으로만, 좌우는 24 보다 좁히지 않고, 한 목록 안에서는 줄마다 같게.

[그림: 한 목록 안에서 줄마다 여백이 다르면 맞춤이 어긋난다](../../site/components/specs/list.tsx#spacing-guide)

### 카드 안의 목록

카드 안에 목록을 넣으면 누름 바탕의 모서리를 카드 모서리에서 카드 가장자리 ~ 바탕 거리를 뺀 값으로 맞춘다(동심 모서리). 기본 10 은 모서리 16 인 카드에 줄을 바로 넣은 경우다 — 바탕이 좌우 6 들어오므로 16 − 6. 카드에 안쪽 여백을 더 두면 그만큼 더 뺀다. 그대로 두면 바탕의 둥근 정도가 카드와 어긋난다. 레시피에서는 목록(`List` · `ListRadioGroup` · `ListCheckGroup`)의 `itemRadius` 로 바꾼다(SEED 의 `itemBorderRadius`). 목록을 담은 카드의 머리 · 여백은 [Card](card.md) 의 목록 카드다 — 카드 안 여백은 줄과 같은 24(머리 위 · 좌우 24, 카드 아래 12 + 줄 12 — 2026-10-08).

[그림: 카드 안의 목록 — 동심 모서리](../../site/components/specs/list.tsx#concentric-guide)

### 목록을 두는 바탕

목록은 흰 바탕(`bg-layer-default`)이나 시트 · 대화상자(`bg-layer-floating`) 위에 둔다. 누름 · 호버 바탕(`bg-layer-default-pressed`)이 불투명한 색이라, 회색 바탕(`bg-layer-basement`) 위에서는 바탕과 거의 같아(라이트 1.02:1) 눌러도 보이지 않는다. 그래서 놓이는 바탕에 따라 고른다 — 흰 면(띠 · 카드 · 흰 화면 · 시트 · 대화상자) 위에서는 그대로 두고, 회색 바닥 위에서는 흰 면을 먼저 깐다. 어느 화면이 띠 · 흰 화면 · 카드인지는 DESIGN.md Layout 의 "화면 바탕" 한 곳에 적는다(폰 화면은 이관 때 화면마다 고른다 — 2026-10-22 사용자 결정 3B, https://claude.ai/artifact/KrXqAymDPz1JKL5AWqdwKS).

[그림: 흰 바탕 위의 목록 · 회색 바탕 위의 목록 — 둘 다 가운데 줄을 누른 순간](../../site/components/specs/list.tsx#surface-guide)

### 앞 붙이개 고르기

설정 · 메뉴 줄은 아이콘, 색이 뜻을 가진 내용 줄은 타일이다(사용자 결정). 물건(은행 · 카드 · 증권) 줄은 로고 타일이다. 한 묶음 안은 같은 종류로 둔다 — 자산 목록은 로고 타일, 거래 목록은 카테고리 타일. 앞 붙이개가 섞이면 왼쪽 시작선 · 크기가 갈린다(SEED "List 안에서 각 Item 의 정렬이 달라지지 않도록"). 다른 물건이 한 결과에 나오면(거래와 자산을 함께 찾는 검색) 목록 제목(거래 · 자산)으로 묶음을 나눈다(2026-10-22 사용자 결정 6B — https://claude.ai/artifact/SmHD31RQxTjWbfK83nbcym).

[그림: 설정은 아이콘, 가계부는 타일](../../site/components/specs/list.tsx#prefix-guide)

[그림: 섞이는 결과 — 목록 제목(거래 · 자산)으로 묶음을 나눈다 · 한 목록에 섞음](../../site/components/specs/list.tsx#mix-guide)

## 코드

레시피 `recipes/shadcn/components/ui/list.tsx` 를 쓴다 — `List` · `ListItem` · `ListButtonItem` · `ListLinkItem` · `ListSwitchItem` · `ListCheckItem` · `ListCheckGroup` · `ListRadioGroup` · `ListRadioItem` · `ListDivider` · `ListHeader` · `ListTile` · `ListParentItem`. 아래 미리보기는 스펙 값으로 그린 모습이다.

`ListParentItem` 은 하위 줄을 접는 부모 줄이다 — `ListButtonItem` 의 속성(`title` · `detail` · `prefix` · `suffix` · `onClick` …)에 `collapsible`(기본 `true`) · `expandLabel`(꺾쇠 단추의 고정 이름 — `collapsible` 이면 필수) · `open` · `defaultOpen` · `onOpenChange(open)` 을 더 받고, 자식(`ListButtonItem` …)이 하위 줄이 된다. 자식이 없으면 꺾쇠 자리를 비운다. `collapsible={false}` 는 늘 펼친 편집 화면이다 — 꺾쇠 자리를 비우고 하위 줄을 늘 보이며, `expandLabel` · `open` · `defaultOpen` · `onOpenChange` 를 받지 않는다. 두 갈래는 유니언 타입이라 `collapsible={false}` 없이 `expandLabel` 을 빠뜨리면 타입 오류다(`{ collapsible?: true; expandLabel: string; open?; defaultOpen?; onOpenChange? } | { collapsible: false }`). 꺾쇠 단추(`aria-expanded` · `aria-controls`)와 하위 줄 묶음(`ul` — 104 들임 · 높이 300ms)은 줄이 그린다. 한 목록에 `ListParentItem` 이 있으면 그 목록의 맨 위 단계 줄은 모두 `ListParentItem` 이다 — 타일 자리를 맞춘다.

라우터의 링크는 `ListLinkItem asChild` 의 자식으로 넣는다 — 제목 · 설명은 그 링크 안에 그려진다(`<ListLinkItem asChild title="도움말"><Link to="/help" /></ListLinkItem>`).

### 기본

[그림: 기본 — 보기만 하는 줄](../../site/components/specs/list.tsx#ex-basic)

```tsx
import { List, ListItem } from "@/components/ui/list"

<List>
  <ListItem title="가입일" suffix="2026년 3월 2일" />
  <ListItem title="이메일" suffix="groo@example.com" />
</List>
```

### 누르는 줄

[그림: 누르는 줄 — 화면을 옮긴다](../../site/components/specs/list.tsx#ex-button)

```tsx
import { ChevronRight, Globe, User } from "lucide-react"
import { List, ListButtonItem, ListHeader } from "@/components/ui/list"

<ListHeader id="settings-general">일반</ListHeader>
<List aria-labelledby="settings-general">
  <ListButtonItem prefix={<User />} title="계정" suffix={<ChevronRight />} onClick={openAccount} />
  <ListButtonItem prefix={<Globe />} title="기본 통화" suffix={<>대한민국 원<ChevronRight /></>} onClick={openCurrency} />
</List>
```

### 컨트롤 줄

[그림: 스위치 줄 — 줄 어디를 눌러도 바뀐다](../../site/components/specs/list.tsx#ex-switch)

```tsx
import { Bell } from "lucide-react"
import { List, ListSwitchItem } from "@/components/ui/list"

<List>
  <ListSwitchItem
    prefix={<Bell />}
    title="결제 알림"
    detail="결제 예정일 D-1, 결제일 당일 알림"
    checked={on}
    onCheckedChange={setOn}
  />
</List>
```

### 하나 고르기 · 여럿 고르기

[그림: 하나 고르기 · 여럿 고르기](../../site/components/specs/list.tsx#ex-select)

```tsx
import { ListCheckGroup, ListCheckItem, ListRadioGroup, ListRadioItem } from "@/components/ui/list"

<ListRadioGroup value={currency} onValueChange={setCurrency} aria-label="기본 통화">
  <ListRadioItem value="KRW" title="대한민국 원" detail="KRW" />
  <ListRadioItem value="USD" title="미국 달러" detail="USD" />
</ListRadioGroup>

<ListCheckGroup aria-label="내보낼 항목">
  <ListCheckItem title="거래 내역" defaultChecked />
  <ListCheckItem title="예산" />
</ListCheckGroup>
```

### 강조 · 비활성 · 맞춤

[그림: 강조 · 비활성 · 위 맞춤](../../site/components/specs/list.tsx#ex-states)

```tsx
import { Info } from "lucide-react"
import { List, ListButtonItem, ListItem } from "@/components/ui/list"

<List>
  <ListButtonItem highlighted title="예산 80% 도달" detail="식비 예산의 80%를 썼어요" />
  <ListButtonItem disabled title="주간 리포트" detail="푸시 알림이 꺼져 있어요" />
  <ListItem align="top" prefix={<Info />} title="긴 제목은 두 줄을 넘으면 앞 · 뒤를 위로 맞춘다" detail="설명이 길 때도 같다" />
</List>
```

### 하위 줄 — 카테고리

[그림: 지출 카테고리 — 식비 하위 6개 펼침 · 기타는 하위 없음](../../site/components/specs/list.tsx#ex-nested)

```tsx
import { Tag, Utensils } from "lucide-react"
import { List, ListButtonItem, ListParentItem, ListTile } from "@/components/ui/list"

<List aria-label="지출 카테고리">
  {/* 줄을 누르면 편집, 앞 꺾쇠 단추가 하위 줄을 접는다 — 이름은 고정 */}
  <ListParentItem
    prefix={<ListTile className="bg-chart-orange-weak text-chart-orange"><Utensils /></ListTile>}
    title="식비 · 외식 · 배달음식"
    detail="지출 · 하위 6개"
    onClick={() => editCategory(food.id)}
    expandLabel="식비 · 외식 · 배달음식 하위 카테고리"
    defaultOpen
  >
    {food.children.map((c) => (
      <ListButtonItem key={c.id} prefix={renderTile(c)} title={c.name} detail="지출" onClick={() => editCategory(c.id)} />
    ))}
  </ListParentItem>
  {/* 하위가 없으면 꺾쇠 자리만 비운다 — 타일 · 제목이 같은 자리. 이름은 같이 준다(하위가 생기면 단추가 선다) */}
  <ListParentItem
    prefix={<ListTile className="bg-chart-gray-weak text-chart-gray"><Tag /></ListTile>}
    title="기타"
    detail="지출 · 하위 없음"
    onClick={() => editCategory(etc.id)}
    expandLabel="기타 하위 카테고리"
  />
</List>
```

### 하위 줄 — 늘 펼친 편집 화면

[그림: 카테고리 편집 — collapsible={false}, 꺾쇠 자리는 비우고 하위 줄은 늘 보인다](../../site/components/specs/list.tsx#ex-nested-fixed)

```tsx
import { List, ListButtonItem, ListParentItem } from "@/components/ui/list"

<List aria-label="지출 카테고리 편집">
  {/* 늘 펼친 편집 화면 — 꺾쇠 단추 없이 하위 줄이 늘 보인다(Tree View 의 collapsible 과 같은 뜻) */}
  {categories.map((c) => (
    <ListParentItem
      key={c.id}
      collapsible={false}
      prefix={renderTile(c)}
      title={c.name}
      detail={c.children.length ? `지출 · 하위 ${c.children.length}개` : "지출 · 하위 없음"}
      onClick={() => editCategory(c.id)}
    >
      {c.children.map((k) => (
        <ListButtonItem key={k.id} prefix={renderTile(k)} title={k.name} detail="지출" onClick={() => editCategory(k.id)} />
      ))}
    </ListParentItem>
  ))}
</List>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Click / Tap(누르는 줄) | 줄 어디를 눌러도 그 줄의 동작 — 누르는 동안 콘텐츠가 줄어 가장자리를 누른 포인터가 영역 밖에 놓여도 그 줄이 눌린다. 뒤 붙이개의 작은 버튼은 따로 눌린다. `disabled` 면 무시. |
| Click / Tap(컨트롤 줄) | 줄 어디를 눌러도 끼운 스위치 · 체크 · 라디오가 바뀐다. 바로 적용(스위치) · 저장 때 적용(체크)은 그 컨트롤의 규칙대로. |
| Hover(웹) | 누르는 줄만 — 누름과 같은 바탕. |
| Keyboard `Tab` | 누르는 줄 · 컨트롤로 간다. 보기만 하는 줄은 건너뛴다. |
| Keyboard `Enter` · `Space` | 누르는 줄은 누르기와 같다. 컨트롤 줄은 그 컨트롤의 키(스위치 · 체크 Space, 라디오 화살표). 체크 · 라디오 줄의 `Enter` 는 폼을 제출한다 — 진짜 input 처럼 폼의 기본 버튼을 누른다(Checkbox · Radio 와 같다, 2026-10-08). 키를 누르고 있는 동안은 포인터로 누를 때와 같은 누름 모습(바탕 · 콘텐츠 축소)이다. |
| Keyboard `Home` · `End`(라디오 줄) | 하나 고르기 묶음(`ListRadioGroup`)은 받지 않는다 — 초점도 고른 줄도 그대로, 화면도 스크롤되지 않는다(`PageUp` · `PageDown` 도). 첫 · 끝 줄로는 화살표로 간다 — SEED · 진짜 라디오 · WAI-ARIA APG Radio Group 과 같다(2026-10-17 사용자 결정 — 03-E 결정 3 A). |
| Disabled | 누르기 · 키보드 불가, 포커스에서 빠진다. 값은 그대로 보인다. |
| 꺾쇠 단추(하위 줄) | 누르기 · `Enter` · `Space` 로 하위 줄을 펼치고 접는다 — 줄의 편집은 열리지 않는다. 초점은 단추에 그대로. `Tab` 은 꺾쇠 단추 → 그 줄 → 펼친 하위 줄 → 다음 부모의 꺾쇠 단추. 모션 줄이기면 높이 움직임 없이 150ms 서서히 · 꺾쇠는 바로. `collapsible={false}`(늘 펼친 편집 화면)면 단추가 없고 하위 줄이 늘 보인다 — `Tab` 은 줄 → 하위 줄 → 다음 부모 줄 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 `fg-neutral` 9.90:1 이상. 설명 · 값 글자 `fg-neutral-subtle` — 흰 바탕 5.50 · 6.09(라이트 · 다크), 누름 바탕 5.18 · 4.68, 강조 바탕 4.83 이상 ✓. 강조 줄을 올리거나 누르는 동안은 `fg-neutral-muted` 5.58 이상 ✓(`fg-neutral-subtle` 이면 4.32 로 미달). 막힌 줄의 `fg-disabled` 는 기준 밖(비활성 UI) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 앞 아이콘 `fg-neutral` · 화살표 `fg-neutral-subtle` 은 글자와 같은 값. 타일 아이콘 `chart-{색}` × `chart-{색}-weak` 3.63 이상(가장 낮은 yellow 라이트) ✓ |
| **WCAG 1.4.1** Use of color | 강조는 바탕 색만 바뀐다 — 안 읽음 같은 상태는 글로도 알 수 있게 쓴다 |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에만 줄 안쪽 링 2px(`stroke-focus-ring`). 컨트롤 줄은 끼운 컨트롤이 포커스를 받고 그 컨트롤의 링이 보인다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 줄 높이 46 이상 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 누르는 줄은 줄 전체 — 한 줄짜리도 46 ✓ |
| **ARIA** | `List` 는 `<ul>` · 줄은 `<li>`. 누르는 줄의 버튼 · 링크 이름은 제목 + 설명. 컨트롤 줄은 `<label>` 이 줄 전체라 제목 + 설명이 컨트롤의 이름이다. 목록 제목이 있으면 `List` 에 `aria-labelledby` 로 잇는다. **앱은 줄 하나가 한 노드다** — 누르는 줄은 제목 · 설명 · 값을 한 이름으로 묶어(`MergeSemantics`, "점심 · 숲길식당, 식비 · 12:10, −9,000원, 버튼") 한 번에 읽고, 차례는 보이는 차례대로 꺾쇠 단추 → 줄 → 하위 줄이다(하위 줄은 꺾쇠 단추 노드의 자식이 아니라 부모 줄과 나란한 목록). 앞 타일 · 로고 타일은 장식이라 이름에 넣지 않고, 값의 줄바꿈 자리(U+200B)도 넣지 않는다. 보기만 하는 줄(`ListItem`)도 같다 — 넓은 줄 · 좁은 줄 모두 한 번만 읽힌다. 줄 안의 작은 버튼(뒤 붙이개)만 따로 한 번 더 멈춘다. 웹 · SEED 는 값이 버튼 밖 글이라 줄마다 두 번 멈춘다 — 앱만 다르다(2026-10-17 사용자 결정 — 03-D 결정 4 A, 30줄 가계부를 30번 밀면 끝난다). 하나 고르기(`ListRadioGroup`)는 `role="radiogroup"`, 여럿 고르기(`ListCheckGroup`)는 `<fieldset>` 이고 둘 다 이름(`aria-label` · `aria-labelledby`) 필수 — 묶음 안의 줄 · 선은 `<div>` 다(SEED 와 같다). 줄 사이 선은 `aria-hidden` 이라 줄 수에 들지 않는다. 하위 줄을 접는 꺾쇠 단추는 이름 "{카테고리} 하위 카테고리"(고정 — `expandLabel`, 접는 줄이면 타입이 빠뜨림을 막는다) + `aria-expanded` · `aria-controls`(하위 줄 `ul`) — 누르는 영역 44 ✓ ✓. 늘 펼친 편집 화면(`collapsible={false}`)은 단추 · `aria-expanded` 를 두지 않는다 — 접히지 않는데 펼침 상태가 남으면 누를 수 있는 것처럼 읽힌다(Tree View 와 같다). 빈 꺾쇠 자리는 `aria-hidden`. 목록 제목은 머리말이다 — 웹 `h2`(상자 안이면 `h3`, 버튼이 있으면 제목 글에만), 앱은 `Semantics(header: true, headingLevel: 2)` 로 단다 — 안드로이드는 `headingLevel` 이 있어야 제목 이동에 걸린다(상단 바 제목이 1, 2026-10-16 사용자 결정 — 틀 앱 02-004) |
| **Reduced motion** | 모션 줄이기면 콘텐츠 축소를 뺀다 — 바탕 색 전환은 그대로(기초 Motion) |

## Do / Don't

### ✅ Do

- 설정 · 메뉴 · 선택 · 키-값 · 내용 줄을 모두 List 로 그린다.
- 화면을 옮기는 줄에만 오른쪽 화살표를 단다.
- 줄의 동작은 줄을 눌러 들어간 화면에 둔다 — 하나면 바닥 [삭제], 여럿이면 머리 ⋮.
- 컨트롤 줄은 줄 전체가 눌리게 한다.
- 막힌 줄은 제목 · 설명 · 아이콘을 모두 비활성 색으로.
- 끌 수 없는 켬(늘 켜진 체크 줄)은 칸만 막고(`locked`) 제목 · 앞 붙이개는 그대로 — 까닭은 배지로.
- 줄은 편집 · 하위만 접는 목록은 줄 앞 꺾쇠 단추(44 · 고정 이름 + 펼침 상태)로.
- 늘 펼쳐 두는 편집 화면은 `collapsible={false}` 로 — 이름 있는 스위치로 켠다.
- 긴 글 값(이메일 · 계좌번호)은 그대로 두고 줄 끝에서 끊기게 둔다 — 본문은 한 글자 폭까지 양보한다.

### ❌ Don't

- 화면마다 줄을 손으로 짜기 — 여백 · 글자 · 누름이 화면마다 갈린다.
- 화살표가 있는데 안 눌리는 줄 · 눌리는데 표시가 없는 줄.
- 컨트롤 줄에 따로 누르는 버튼을 같이 넣기.
- 한 줄에 누르는 것 넷 이상.
- 목록 줄 끝에 ⋮(더보기) — 줄에 ⋮ 를 둘 수 있는 건 콘텐츠가 높은 카드 머리뿐이다.
- 한 묶음에서 라디오 · 체크 섞기.
- 끌 수 없는 켬을 상자 없는 체크 · 줄 전체 막힘으로 그리기 — 못 바꾼다는 것이 안 보이거나, 켜진 것이 꺼진 것처럼 보인다.
- 줄 높이를 줄이려고 스위치 · 체크의 누르는 영역을 자르기.
- 하위를 접는 꺾쇠를 18 · 24 로 작게 · 이름을 "접기 · 펼치기" 로 바꾸기 · 접힌 부모 줄에 › 를 둘 달기.
- `expandLabel` 을 빼서 늘 펼침을 만들기 — 접는 줄은 이름이 필수다(타입 오류). 늘 펼침은 `collapsible={false}`.
- 값이 본문 위로 넘쳐 덮게 두기 · 뒤 붙이개에 최대 폭이나 말줄임을 따로 걸기.

## Specification

`list.yaml` · `list-header.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 List 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — list.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#list)

[그림: Specification — list-header.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#list-header)

## SEED 와 다른 점

- **좌우 여백은 24**(`spacing-global-gutter` — groo 2026-09-14 결정). SEED 는 16.
- **앞 타일(40, 모서리 12)을 둔다**(사용자 결정) — 색이 뜻을 가진 내용 줄(거래 · 카테고리 · 알림 종류)에. SEED 의 앞 자리는 아이콘 · 아바타 · 컨트롤뿐이다.
- **누름 · 호버 바탕은 불투명한 `bg-layer-default-pressed`** — SEED 의 transparent-pressed 는 투명도가 있어 검사기가 받지 않는다(v102).
- **막힌 줄은 값 글자 · 타일도 비활성 색** — SEED 는 제목 · 설명 · 아이콘만 바꾼다(groo 비활성은 전용 색, v106).
- 누르면 콘텐츠 층만 주는 건 SEED 와 같다(SEED `scaleScope: content`) — 배율은 기초 Feedback v104 의 2px 거리다.
- 목록 제목의 좌우도 24 다.
- **포커스 링(웹)은 groo 가 정했다** — 줄 안쪽 2px. SEED 는 목록 줄의 포커스 링을 적지 않았다.
- **하위 줄 · 줄 앞 꺾쇠 단추** — SEED List 에 없다(2026-10-10 사용자 결정 7C). 늘 펼친 편집 화면은 `collapsible={false}` — Tree View 와 같은 이름이다(2026-10-15 Q-002).
- **좁은 줄은 값을 본문 아래로** — 줄 안 폭이 16em(제목 글자) 미만일 때만(2026-10-17 03-D 결정 1 B). SEED List 에는 큰 글자 규칙이 없다 — iOS 설정 앱(값 셀)이 큰 글자에서 값을 아래 줄로 내리는 모양이다.
- **앱 줄은 한 노드**(제목 · 설명 · 값을 한 이름) — SEED · 웹은 값이 버튼 밖이라 두 번 멈춘다(2026-10-17 03-D 결정 4 A).
- **긴 값의 겹침만 막는다** — 본문 최소 1em · 제목 · 글 설명 `overflow-wrap: anywhere` · 글 값은 줄 끝에서 끊는다(2026-10-15 Q-001). SEED 는 뒤 붙이개 `flexShrink 0` · 본문 `flexGrow 1` 만 두고 최소 폭 · 줄바꿈 규칙을 두지 않는다 — 줄지 않는 값 · 양보하는 본문은 SEED 와 같다.

## Migration notes

### 2026-10-29 — 끌 수 없는 켬은 칸만 막는다

사용자 결정 B — 숨길 수 없는 기본 캘린더 줄이 체크 자리에 상자 없는 파란 체크(옛 웹 · I-09 지시서)를 두던 것을 칸만 막힌 켬으로. 고르지 않은 안: 줄 전체 막힘(A — 이름 · 색 점까지 `fg-disabled`) · 지금 그대로. 레시피 `ListCheckItem` 에 `locked` 를 더했다(칸 `disabled` + `checked`, 줄은 누르지 못함, 글 · 앞 붙이개 색은 그대로). 값 · 토큰 변경 없음.

### 2026-10-25 — 목록 줄 끝 ⋮ 를 두지 않는다

사용자 결정 — 좁은 목록 줄(한두 줄 글 + 타일 · 값)에는 ⋮ 를 두지 않고, 줄을 누르면 들어간 화면에서 동작을 고른다(Guidelines "줄의 동작은 들어간 화면에"). 규칙 전문 · 경계는 [Menu](menu.md) 의 같은 날 Migration notes. "줄 안의 누르는 것" 의 예에서 메뉴를 빼고, 그림 targets-guide 의 맞음 예(둘 — 줄 + ⋮ · 셋 — 줄 + 즐겨찾기 + ⋮)를 둘 — 줄 + 즐겨찾기 · 셋 — 줄 + 즐겨찾기 + 알림으로, suffix 그림의 작은 버튼(⋯)을 즐겨찾기로, 미리보기의 "월세" 줄 끝 ⋮ 를 [이체] 작은 버튼으로 바꿨다. 값 변경 없음.

### 2026-10-22 — 섞이는 결과 그림

"다른 물건이 한 결과에 나오면 목록 제목으로 묶음을 나눈다"(6B)에 그림 mix-guide 를 더했다 — 스펙 PR1 에서 남은 것. 값 변경 없음.

### 2026-10-22 — 누르는 자리는 셋 이하 · 섞이는 결과는 묶음을 나눈다

"줄 안의 누르는 것은 셋까지" 는 숫자를 그대로 두고 SEED 강도("4개 이상 지양")와 넷째가 필요할 때 먼저 볼 길을 적었다 — 그림 targets-guide 를 누르는 자리 1 · 2 · 3(맞음) · 4(피함)로(5B). "한 목록 안에서 섞지 않는다"(결정 기록 없음)는 "한 묶음 안은 같은 종류 — 다른 물건이 한 결과에 나오면 목록 제목으로 묶음을 나눈다" 로(6B) — 사용자 결정 https://claude.ai/artifact/SmHD31RQxTjWbfK83nbcym. 값 변경 없음.

### 2026-10-22 — 목록을 두는 바탕은 바탕에 따라

"목록을 두는 바탕" 의 Desk 폰 화면 이름(묶음 · 구역마다 띠 · 홈 · 자산 …)을 걷고 "흰 면 위는 그대로 · 회색 바닥 위는 흰 면을 깐다" 로 줄였다. 화면 이름은 DESIGN.md Layout "화면 바탕" 한 곳이다 — 폰 화면은 이관 때 화면마다 고른다(https://claude.ai/artifact/KrXqAymDPz1JKL5AWqdwKS 3B). 값 변경 없음.

### 2026-10-22 — 목록 제목은 제목 태그 · 목록은 폭이 정해진 부모 안에

웹 ds `ListHeader` 는 `div` 였다(제목 이동 · 머리말 목록에 안 나옴 — 03D-007). I-02 웹에서 기본 `h2` · `as` 로 바꿨다. 오른쪽 버튼이 있는 머리는 줄 전체가 아니라 제목 글에만 태그를 건다(앱 `PListHeader` 와 같게 — 웹은 I-03 에서). 레시피 `ListHeader` 도 `as`(기본 `h2`)를 받는다. 줄이 컨테이너가 된 뒤(결정 1 B) 내용 폭 부모 안에서는 목록 폭이 0 이 되므로 사용 규칙을 적었다. 값 · 토큰 변경 없음.

### 2026-10-21 — List Header 큰 글자(03-G 4A)

목록 제목의 오른쪽 버튼이 반 폭을 넘으면 제목 아래 줄 오른쪽 끝으로 — 레시피 `listHeaderVariants` 에 flex-wrap · 제목 최소 50%(제목을 요소로 감쌀 때). 비교 페이지 https://claude.ai/artifact/A3oCdxNvDwkNBPFPE36bmF.

### 2026-10-17 — 하나 고르기 묶음은 Home · End 를 받지 않는다(03-E 결정 3 A)

웹 공용 라디오 묶음(Chip 하나 고르기 · Radio Group · Segmented Control · Select Box 하나 고르기 · List 라디오)은 Radix RovingFocusGroup 이 Home · End(· PageUp · PageDown)로 초점만 첫 · 끝으로 옮겨 초점과 고른 것이 갈렸다. 사용자가 [비교 페이지](https://claude.ai/artifact/FKYaqu7zAR5T2HVwFnx5oD)에서 "받지 않는다"(A — 화살표만, SEED · 진짜 라디오 · APG)를 골랐다. 레시피는 묶음이 캡처 단계에서 라디오의 그 키를 막는다(`ignoreRadioJumpKeys` — radio-group.tsx, List 라디오 줄 도 쓴다). 웹 ds 의 같은 묶음도 같게, 앱은 바뀌는 것 없음. 옮기며 고르는 안(B — Tabs 처럼)은 고르지 않았다. 옛 스펙은 `list.history/v-pre-03e-03b.md`.

### 2026-10-17 — 큰 글자 · 앱 낭독 · 본문 최소 폭(03-D 결정 1 · 4 · 03D-005)

사용자가 [03-D 목록 · 카드 · 표 비교 페이지](https://claude.ai/artifact/7TVGy8o47HBg4R3SefDmf6)에서 정했다.

- **결정 1 B** — 줄 안 폭이 16em(제목 글자) 미만이면 값을 본문 아래로(축 `width`). Q-001 A 그대로(A) · 줄 글자 배율 상한 150%(C)는 고르지 않았다. 웹 ds 는 줄(`li`)에 컨테이너를 걸고 좁은 줄에서 값을 본문 칸 아래로 옮기고, 앱 `PList` 줄은 `LayoutBuilder` 로 같은 16 × t5 × 글자 배율을 잰다. 레시피(`list.tsx`)는 아직 이 모양을 그리지 않는다 — 사이트 그림이 기준이다.
- **결정 4 A** — 앱 줄은 한 노드. 지금 앱(`p_list_parent_item.dart:136 · 278` · 줄 위젯)은 바깥 노드 이름이 값("−9,000원")이고 안쪽 버튼이 제목 + 설명이라 값이 먼저 · 두 번 읽히고, 꺾쇠 단추가 줄 뒤에 오며 하위 줄이 그 단추 노드 안에 있다. `PListButtonItem` · `PListLinkItem` 이 `MergeSemantics` 로 값 글을 이름 끝에 붙이고, 꺾쇠 → 줄 → 하위 줄 차례로 옮긴다. 웹 · SEED 와 같게 두 번(B)은 고르지 않았다.
- **03D-005(고침)** — 본문 최소 폭 1em 을 제목 글자로 잰다. 웹 ds · 레시피의 `min-w-[calc(1em+…)]` 는 버튼이 물려받은 14px 로 잡혀 24 였다(26 이어야). 레시피 `list.tsx` · 예제 열 곳을 `calc(var(--text-t5) + var(--spacing-x2_5))` 로 고쳤다. 앱은 16 기준이라 그대로다.

옛 스펙은 `list.history/v-pre-app-type-03d.*`.

### 2026-10-16 — 금액 색 · 목록 제목 버튼(글자 역할 D1 · D2)

사용자가 [글자 역할 비교 페이지](https://claude.ai/artifact/X9n6tDZbKSP7GeLtodtz8N)에서 정했다. 금액 색은 수입만 `fg-brand`, 지출 · 이체는 `fg-neutral`(D1 B — 모두 neutral · 지금 Desk 별칭대로는 고르지 않았다). 대가 — 다크에서 수입 파랑(#7AA9F6)과 ▼ 내림 파랑(#69ABFF)이 1.00:1 로 같아 보인다. 지금 Desk 웹 · 앱은 지출을 빨강(`fg-expense` = `fg-critical`) · 이체를 파랑으로 칠한다 — 앱 적용 때 금액 글자를 `fg-neutral` 로 옮긴다. 목록 제목 오른쪽 글 버튼은 SEED Text Button 값(D2 A)으로 적었다 — 전에는 값이 없었다(사이트 그림은 Button ghost xsmall + 꺾쇠). 옛 스펙은 `list.history/v-pre-text-roles.md` · `list-header.history/v-pre-text-roles.yaml`.

### 2026-10-15 — 긴 값 · 늘 펼친 편집 화면(Q-001 · Q-002)

사용자가 [비교 페이지](https://claude.ai/artifact/62nMsW1yJCV4gDMt2SXtSR)에서 구현 세션 질문 둘을 정했다(2026-10-15 사용자 결정 — 구현 세션 질문 Q-001 · Q-002).

- **Q-001 → 안 A(지금대로 + 겹침만 고침)** — 값은 줄지 않고 본문이 양보한다(SEED 와 같다). 웹 List 견본의 가장 나쁜 값(폭 360 · "이메일" + 52자 이메일)에서 값이 본문 위로 넘쳐 겹치던 것만 고친다 — 본문 최소 1em · 제목 · 글 설명 `overflow-wrap: anywhere` · 글 값(`suffix` 에 글을 그대로 넘긴 것)은 줄 끝에서 끊는다. 금액은 한 줄 그대로다 — 줄여 적는 것은 화면의 몫이다. 본문 절반 + 값 아래 줄(B) · 값 종류로 가르기(C) · 화면이 가운데를 잘라 줄이기(D)는 고르지 않았다.
- **Q-002 → 안 B(`collapsible={false}`)** — 늘 펼친 편집 화면을 이름 있는 스위치로 켠다(Tree View 와 같은 이름 · 같은 뜻). 접는 줄(기본)은 `expandLabel` 이 필수다 — 유니언 타입이라 빠뜨리면 빌드에서 막힌다. `expandLabel` 이 없으면 조용히 늘 펼침이 되던 옛 레시피(안 A)는 걷었다. 하위가 없는 부모 줄도 같은 이름을 준다(꺾쇠 자리는 지금처럼 비운다 — 17B).

웹은 #435 에서 옛 레시피대로 만들었다 — 카테고리 편집 화면이 `expandLabel` 을 빼서 늘 펼침을 켰다면 `collapsible={false}` 로 바꾸고, 접는 화면의 하위 없는 줄에는 `expandLabel` 을 더한다(타입 검사가 자리를 알려 준다). 앱도 같은 둘을 옮긴다.


### 2026-10-10 — 하위 줄 · 줄 앞 꺾쇠 단추

사용자가 [펼치고 접기 · 나누기 비교 페이지](https://claude.ai/artifact/9uvjeFyjFXc7TaWnpnnQ6H)에서 카테고리 나무의 접기를 남기기로 정했다 — 줄 왼쪽 꺾쇠 단추 44 · 이름 "{카테고리} 하위 카테고리" 고정 + `aria-expanded`(7C — 추천이던 접기 걷기 7B 가 아니다). 펼침은 Accordion 과 같은 300ms 다(3A). 지금 그대로(7A) · 접기 걷기(7B) · 부모 줄 전체가 펼치기(7D)는 고르지 않았다. 하위 줄의 정렬은 스펙을 쓰다 나온 질문으로 따로 정했다(같은 비교 페이지 17번 — 17B 두 세로줄) — 하위 타일은 부모 제목 자리(104)에서 시작하고, 하위가 없는 부모도 꺾쇠 자리를 비워 타일이 52 에 선다. 7C 그림 그대로(17A — 하위 줄 100 · 하위 없는 부모 타일 24, 하위 타일이 부모 제목보다 4 왼쪽이고 부모 타일 줄이 들쭉날쭉하다)는 고르지 않았다.

제품은 앱 적용 단계에서 옮긴다(2026-10-09 조사).

- **웹 설정 > 카테고리** — 부모 줄 왼쪽 꺾쇠 단추가 18 × 18(아이콘 14)이고 이름은 "접기 / 펼치기" 뿐(카테고리 이름 없음) · `aria-expanded` 0 · 움직임 0 이며, 하위 줄 들임이 28 이다(`widgets/category-manage/ui/CategoryManager.tsx:592-660 · 735-772`, D4 · D13). 줄 자체는 데스크톱에서 반응하지 않는다.
- **앱 카테고리** — 꺾쇠가 `InkWell` 24 × 24 · 이름 "" 이고, 접힌 부모 줄에는 왼쪽 접힘 꺾쇠와 오른쪽 이동 꺾쇠가 같은 › 로 둘이다(`features/category/presentation/category_screen.dart:365-430 · 629-655 · 691`, D14). 줄은 편집을 열므로 오른쪽 › 를 걷는다.

### 2026-10-08 — 체크 · 라디오 줄의 Enter

Checkbox · Radio 의 Enter 가 폼을 제출하게 됐다(사용자 결정 — [비교 페이지](https://claude.ai/artifact/9qbK3fj8SL3RmTeiujoJZ6) B1, 진짜 input · SEED 와 같다). 체크 줄(`ListCheckItem`)은 `Checkmark` 를 써서 그대로 따라오고, 라디오 줄은 묶음(`ListRadioGroup`)이 Radio 와 같은 처리(`submitOnRadioEnter`)로 Enter 를 받는다 — Radix 의 선택지는 Enter 를 막기만 한다. 고르기는 그대로 Space · 화살표다.

### 2026-10-01 — SEED List 로

사용자가 [비교 페이지](https://claude.ai/artifact/NcSnfZY2LVGstqEd5UsgRS)에서 정했다 — 모든 줄을 List 로(내용 줄도) · 글자 · 여백은 SEED 그대로(제목 16 · 400, 설명 13, 위아래 12) · 앞 붙이개는 설정은 아이콘 22 · 내용 줄은 타일 40 · 누름은 안쪽 바탕(좌우 6 · 모서리 10) · 구분선은 필요할 때만 · 목록 제목은 SEED 두 가지 · 하나 고르기는 오른쪽 라디오 · 강조는 바탕만.

**RadioList 를 걷는다** — 기본 통화처럼 하나를 고르는 목록은 `ListRadioItem`(오른쪽 라디오 24)으로 그린다. 옛 스펙은 `radio-list.history/` 에 남겼다.

| 옛 RadioList | 새 List |
|---|---|
| 고른 줄에만 오른쪽 체크 16 · 브랜드 색 | 오른쪽 라디오 24 — 고른 것 · 안 고른 것이 모두 보인다. 켜짐 색은 neutral |
| 줄 사이 선 · 바깥 테두리 · 모서리 lg | 선 없음(필요할 때만) · 배경 없음 |
| 제목 14 · semi, 설명 11 | 제목 16 · 400, 설명 13 |
| 고른 줄은 다시 눌리지 않는다 | 라디오 묶음 — 고른 줄을 다시 눌러도 그대로(Radix) |

제품은 앱 적용 단계에서 옮긴다(2026-10-01 조사). 줄을 그리는 공용 부품이 사실상 없어 화면마다 손으로 짰다.

- **Desk 앱** — 줄 모양 126가지(손으로 짠 것 118) · 호출 약 190곳. 제목 크기 · 굵기 짝 24가지(14/600 33 · 13/600 21), 오른쪽 화살표 크기 여섯 가지(13 ~ 18), 타일 크기 28 ~ 40 · 모서리 4 · 8 · 11 · 12, 구분선 다섯 방법, 누를 때 물결 모서리 다섯 가지. 공용 줄 위젯 넷(`PSwitchTile` · `PRadioTile` · `PSearchableList` · `PAccordion`)은 쓰는 곳이 없다. 같은 설정 흐름에서 줄이 세 가지(설정 15/500 · 계정 14/600 · 프로필 17/700). 프리셋 목록의 줄은 상세를 여는 함수가 불리지 않아 눌리지 않는다. "로그인 기록" 은 화살표가 있는데 눌리지 않는다. 알림 설정 · 계정의 스위치 6곳은 줄 높이를 지키려고 누르는 영역을 24 로 잘랐다. 묶음 제목 79곳 중 65곳이 손으로 짠 것(글자 모양 15가지).
- **Desk 웹** — 줄 모양 95가지(모바일 · 데스크톱 변형 108) · 호출 194곳, 공용 줄 부품을 쓰는 변형은 36. 카테고리 예산 줄 네 벌 · 키-값 줄 일곱 벌 · 스위치 줄 다섯 벌 · 체크 모양 셋 · 하나 고르기 셋. 줄 전체를 누르는 59 가운데 18 은 키보드로 닿지 않는다(`div` 에 onClick). 호버를 일곱 가지로 만들었고 하나는 정의 없는 변수라 효과가 없다. 같은 `LedgerRow` 가 가계부에서는 선이 없고 할 일 · 메모에서는 들인 선이다. 묶음 제목 27가지(크기 여덟).
- **HR 웹** — 줄 모양 24가지 · 목록 33곳. 오른쪽 화살표 0, 줄 전체를 누르는 10 중 키보드로 닿는 것 3, 호버 바탕 토큰 여섯 가지, 키-값 줄 네 가지. 역할 목록의 삭제 버튼은 보이지 않는데 눌린다(`group` 조상이 없다).
- **알림의 안 읽음** — Desk 앱 알림은 옅은 브랜드 바탕 + 왼쪽 막대 3px + 점 6px 이다. 바탕만 남긴다.

### 2026-10-03 — 합계에 안 드는 줄

사용자가 [표시 비교 페이지](https://claude.ai/artifact/4ySVacsdnG4fgraR1HRK3G) 3A 로 정했다 — 불투명도를 걷고 제목 · 금액만 `fg-neutral-subtle`, 환불 금액은 취소선, 배지는 보통 대비. 지금 웹 · 앱은 예정 · 환불 줄 전체를 불투명도 0.6 으로 흐려 "예정" · "환불됨" 배지가 웹 2.30 · 다크 2.77, 앱 2.39 · 2.87:1 이다(웹 `shared/ui/groo/ledger.tsx:555` · `entities/expense/ui/expense-row.tsx:58 · 81-84` · `entities/asset/ui/transfer-row.tsx:75`, 앱 `features/expense/presentation/widgets/expense_row.dart:84-86` · `transfer_row.dart:130`). 코드 주석은 "흐림만으로는 아직 안 온 것과 구별이 안 돼 배지로 가른다" 고 적었는데 그 배지가 흐려진다. 메타 줄은 2.47 · 3.02 였다. 줄의 설명 줄은 [Tag Group](tag-group.md) 으로 그린다.

### 2026-10-04 — 카테고리 타일 세부 · 물건 줄

사용자가 [이미지 비교 페이지](https://claude.ai/artifact/G351nuKcYX2xhorvA5UD6X)의 "따라오는 것" 에서 정했다 — 카테고리 타일의 아이콘은 이 스펙의 20, 아이콘이 없는 카테고리는 태그 아이콘 하나, 이체 줄 타일은 회색. 은행 · 증권 · 카드 같은 물건 줄의 앞은 [Logo Tile](logo-tile.md)(같은 40 · 모서리 × 0.3), 카드 혜택 목록의 앞은 카드 그림 56([Image Frame](image-frame.md))이다.

제품은 앱 적용 단계에서 옮긴다(2026-10-03 조사).

- **아이콘 18** — 웹 `CategoryChip` md(`shared/ui/groo/category-chip.tsx:9-40` — 32 / 40 / 48 에 16 / 18 / 22)와 앱 줄 타일이 18 이다. 40 타일은 20 으로.
- **없는 아이콘의 대체가 셋** — 웹 줄 타일은 빈 칸(`shared/ui/groo/primitives.tsx:76-82`), 웹 고르는 칸 · 손 타일은 첫 글자(`shared/lib/icon-map.tsx:31` — `CategoryTile` 이 "구 구독" 으로 읽힌다), 앱은 태그 아이콘(`shared/icons/lucide_icon_map.dart:11-14`). 태그 아이콘 하나로.
- **이체 줄 타일이 브랜드 파랑** — 웹 `entities/asset/ui/transfer-row.tsx:60` 이 `color="var(--fg-tertiary)"` 로 회색을 뜻했는데, 색 이름이 아니라 `var(...)` 라 표에서 못 찾고 색 없음 분기(브랜드 18% + #0147ad · 다크 #5fa0e5 — `shared/lib/groo/chart-palette.ts:103-140`)로 간다. 앱은 회색이다(`features/expense/presentation/widgets/transfer_row.dart:82`). `chart-gray-weak` + `chart-gray` 로.
- **손으로 짠 타일** — 웹 약 20곳(18 ~ 48, 예산 36 · 12 처럼 × 0.3 이 아닌 모서리 — `pages/budget/ui/BudgetPage.tsx:1314`), 앱 `PRadius.tile(` 39곳 · 24파일. 앱 `PCategoryTile` 은 버튼으로 읽히지 않는다(`shared/widgets/p_category_tile.dart:37` — 라벨 + 누르기뿐). List 의 타일로 옮긴다.
- **자산 줄 · 계좌 관리 줄의 로고 타일**은 [Logo Tile](logo-tile.md) 의 Migration notes 에 있다. 대시보드 결제 예정(반복 = 구독) 줄의 "D-3" 글 타일(`pages/dashboard/ui/DashboardPage.tsx:1790-1812`)은 가맹점 · 구독 로고와 함께 다음 차례에 정한다.
