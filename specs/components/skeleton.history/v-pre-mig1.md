# Skeleton

> 불러오는 동안 곧 나타날 내용의 자리를 미리 그리는 회색 면. 목록 · 카드 · 상세처럼 구조가 정해진 자리에 쓴다 — 화면의 틀(머리 · 탭 · 제목 · 버튼 · 카드 면)은 실제로 그리고, 서버에서 올 데이터 자리만 스켈레톤이다. 저장 · 새로 고침처럼 행동 하나를 기다리는 자리는 [Progress Circle](progress-circle.md), 이미지가 없거나 못 불러온 자리는 [Content Placeholder](content-placeholder.md) 다.

구조는 당근 [SEED Skeleton](https://seed-design.io/components/skeleton)(Apache-2.0)을 따른다 — 면 하나 위로 흰 띠가 자기 폭만큼 지나가는 반짝임, 모서리 넷(0 · 8 · 16 · full), 글자 자리는 글줄 높이. 깜빡임(펄스)은 두지 않는다. 기다리는 동안의 시간표(1초 · 5초 · 10초)도 이 문서의 "기다리는 동안" 에 둔다 — SEED [Loading 패턴](https://seed-design.io/patterns/loading)의 시나리오를 규칙으로 옮겼다. 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-03 사용자 결정). 옛 Skeleton 스펙(깜빡임 · 모서리 4 · 글줄보다 낮은 막대)을 대신한다.

수치 원본은 [`skeleton.yaml`](skeleton.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 가계부 · 카드 혜택 · 거래 상세를 불러오는 동안 — 라이트 · 다크](../../site/components/specs/skeleton.tsx#hero)

### 직접 골라 보기

모양(글 · 카드 · 아바타 · 사진) · 글자 크기 · 모션 줄이기 · 기다린 시간을 고르면 스펙대로 그린 스켈레톤과 그 코드가 바뀐다. 기다린 시간을 옮기면 1초 · 5초 · 10초에 화면이 어떻게 바뀌는지 볼 수 있다.

[그림: 플레이그라운드](../../site/components/specs/skeleton.tsx#playground)

## Anatomy

[그림: 기다리는 영역 안에 면과 그 위를 지나는 반짝임 띠, 5초부터 오래 걸림 글](../../site/components/specs/skeleton.tsx#anatomy)

| ⓐ Region | 기다리는 영역 — 데이터 자리 하나(쿼리 하나). 시간표 · 요청 제한 · 낭독을 맡는다. |
| ⓑ Root | 면 — 곧 나타날 내용 하나의 자리. |
| ⓒ Shimmer | 반짝임 띠 — 면 위를 자기 폭만큼 지나간다. |
| ⓓ Slow Text | 오래 걸림 글 — 5초부터 한 줄. |

[표: 부위](skeleton.yaml#slots)

## Properties

### 모서리

곧 올 내용의 모양을 따른다 — 글 · 숫자 8 *(기본)*, 그림 자리(썸네일 · 카드 그림)는 [Image Frame](image-frame.md) 의 모서리(폭 24 이하 4 · 48 이하 6 · 그 위 8 — 다 받은 그림과 같은 모서리), 목록 앞 타일 12(List 타일 · Logo Tile 40 — 거래 · 카테고리 · 자산 줄), 카드 면 16(Card 모양 자리 전체), 아바타 · 원 아이콘 · 칩 full, 화면 끝에 붙는 사진 0. 카드 그림(신용카드 그림)은 카드 면이 아니라 그림이라 4 · 6 · 8 이다.

[그림: 모서리 — 글 8 · 그림 4 · 6 · 8(폭으로) · 타일 12 · 카드 면 16 · 아바타 full · 화면 폭 사진 0](../../site/components/specs/skeleton.tsx#radius)

[표: 모서리](skeleton.yaml#radius)

### 크기 — 글은 글줄 높이

크기는 그 자리에 올 내용의 크기다. 글 · 숫자 자리는 그 글자의 줄 높이만큼 높다 — 14 글자(`t4`)면 19, 16 글자(`t5`)면 22. 글자보다 낮은 막대로 그리면 글이 오는 순간 줄이 밀린다. 글 줄의 폭은 실제 글 길이와 비슷하게 두고, 여러 줄이면 마지막 줄을 짧게 둔다.

[그림: 글자 자리 = 글줄 높이 — 12 · 14 · 16 · 20 글자 옆에 같은 높이의 스켈레톤](../../site/components/specs/skeleton.tsx#text-height)

[표: 면](skeleton.yaml#base.enabled@root)

### 반짝임

면 위로 흰 띠가 자기 폭만큼 왼쪽 밖에서 오른쪽 밖으로 1.5초에 지나가고, 쉬지 않고 되풀이한다. 다크에서는 띠가 훨씬 옅다(흰 10%). 깜빡임(투명도 1 ↔ 0.5)은 두지 않는다. 모션 줄이기면 띠가 멈추고 면만 남는다(v104).

[그림: 반짝임 — 1.5초 · 모션 줄이기면 면만](../../site/components/specs/skeleton.tsx#shimmer)

[표: 반짝임 띠](skeleton.yaml#base.enabled@shimmer)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 기다리는 중 — 띠가 지나간다 |
| `reducedMotion` | 모션 줄이기 — 띠가 멈추고 면만 남는다 |

[표: 상태](skeleton.yaml#matrix)

[표: 모션](skeleton.yaml#motion)

## Guidelines

### 틀은 먼저, 데이터 자리만 스켈레톤

머리 · 탭 · 섹션 제목 · 버튼 · 필터 · 카드 면처럼 로컬 상태와 정해진 글로 그릴 수 있는 틀은 처음부터 실제로 그린다. 스켈레톤은 서버에서 올 데이터 자리에만 둔다 — 틀까지 덮으면 바로 보일 정보를 가리고, 데이터가 오는 순간 틀이 진짜로 바뀌며 화면이 튄다.

- 내용과 스켈레톤은 한 묶음이다 — 같은 부모 안에서 갈라 껍데기(카드 · 섹션 · 여백)를 함께 쓴다. 로딩 분기가 껍데기를 따로 그리면 두 벌이 되어 한쪽만 고쳐진다.
- 껍데기는 실제로 쓰는 컴포넌트(Card · List · 섹션)를 그대로 쓴다 — 자체 상자로 흉내 내지 않는다. 컴포넌트에 값이 하나 늘면 흉내 낸 쪽만 옛 모양으로 남는다.
- 자기 쿼리를 가진 컴포넌트는 자기 스켈레톤을 갖는다 — 부모 페이지가 다시 흉내 내지 않는다.
- 데이터에 따라 있고 없고가 갈리는 섹션은 스켈레톤에 넣지 않는다 — 불러오는 동안은 뜰지 알 수 없다. 빼 두면 데이터가 와서 아래에 나타나는 쪽이 덜 튄다.
- 화면 전체가 쿼리 하나를 기다려도 앱 틀(상단 바 · 탭 바 · 사이드바)은 그린다 — 틀이 있는데 틀 없이 화면 가운데 원 하나, 덮을 콘텐츠가 없는 자리의 회색 막 "Loading" 은 두지 않는다. 예외는 틀이 생기기 전(스플래시) — 아래 "무엇으로 기다리나".

[그림: 틀은 실제로 · 데이터 자리만 스켈레톤 — 탭 · 제목 · 버튼까지 덮은 화면](../../site/components/specs/skeleton.tsx#frame-guide)

### 흰 면 위에만

스켈레톤 면(`bg-neutral-weak`)은 흰 면(카드 · 시트 · 대화상자 — `bg-layer-default` · `bg-layer-floating`) 위에서 1.08:1 로 보이고 띠가 지나가며 모양이 드러난다. 회색 페이지 바탕(`bg-layer-basement`) 위에서는 같은 색이라 사라진다(1.00:1) — 바탕 위의 자리는 카드 면을 먼저 그리고 그 안에 스켈레톤을 둔다.

[그림: 흰 카드 위 · 회색 바탕 위 — 바탕 위에서는 사라진다](../../site/components/specs/skeleton.tsx#surface-guide)

### 모양은 내용대로

곧 올 내용의 줄 수 · 길이 · 모서리를 따른다 — 목록이면 실제 줄 높이로 몇 줄, 메모 본문이면 여러 줄에 마지막 줄을 짧게, 아바타는 원, 사진은 그 비율. 실제 줄과 높이가 1px 만 달라도 데이터가 올 때 목록 전체가 밀린다. 글자 모양까지 흉내 내지는 않는다 — 자리만 그린다.

[그림: 모양 — 실제 줄과 같은 높이 · 글자보다 낮은 막대](../../site/components/specs/skeleton.tsx#shape-guide)

### Progress Circle 과 한 자리에는 되도록 하나

한 자리에는 되도록 하나만 — 구조가 보이는 넓은 자리(목록 · 카드 · 상세)는 스켈레톤, 행동 하나를 기다리는 작은 자리(저장 · 새로 고침 · 목록 끝 더 불러오기)는 [Progress Circle](progress-circle.md) 이다. 스켈레톤 위에 원을 얹지 않는다(SEED "Progress Circle과 같이 사용하는 것은 최대한 지양해요").

| | Skeleton | Progress Circle(값 없는 원) |
|---|---|---|
| 보여 주는 것 | 곧 올 내용의 구조(줄 · 카드 모양) | 지금 작동 중이라는 사실만 |
| 자리 | 내용이 실제로 놓일 자리 | 기다리는 범위의 가운데 · 제목 옆 · 목록 끝 |
| 어울리는 일 | 넓은 자리를 한 번에 받기 · 반복되는 줄 | 행동 하나(새로 고침 · 더 불러오기 · 저장) |
| 어울리는 시간(SEED) | 1 ~ 10초 | 1 ~ 4초 |
| groo 시간표 | 둘이 같다 — 1초부터 보임 · 5초 안내 글 · 10초 실패(아래 "기다리는 동안") | 같다 |

[그림: 한 자리에 하나 — 스켈레톤 위에 원을 얹은 화면](../../site/components/specs/skeleton.tsx#mix-guide)

## 기다리는 동안

불러오는 모든 자리(첫 진입 · 화면 안 조회 · 달 · 기간 · 필터 바꾸기)는 이 시간표를 따른다 — 스켈레톤이든 [Progress Circle](progress-circle.md) 이든 같다. 결과(비어 있음 · 실패)는 [Result Section](result-section.md) 이 그린다. 수치는 `skeleton.yaml` 의 `region` 이다.

### 시간표 — 1초 · 5초 · 10초

| 지난 시간 | 화면 | 보조 기술 |
|---|---|---|
| 0 ~ 1초 | 틀만 — 데이터 자리는 비워 두고 높이는 지킨다. 1초 안에 오면 아무것도 깜빡이지 않는다 | 영역에 `aria-busy="true"` — 아직 아무것도 읽지 않는다 |
| 1초 ~ | 스켈레톤 또는 Progress Circle | "불러오는 중…"(숨은 상태 글) |
| 5초 ~ | 그대로 + 글 한 줄 "평소보다 오래 걸리고 있어요." | 그 글을 한 번 읽는다 |
| 10초 | 실패 — Result Section `failure` + "다시 시도" | Result Section 이 알린다(`role="status"`) |
| 다 옴 | 내용(투명도 150ms) · 비어 있으면 Result Section `empty` | `aria-busy` 를 풀고 상태 글을 비운다 |

[그림: 시간표 — 0 ~ 1초 틀만 · 1초 스켈레톤 · 5초 안내 글 · 10초 실패 + 다시 시도](../../site/components/specs/skeleton.tsx#timeline)

[표: 기다리는 영역](skeleton.yaml#base.enabled@region)

### 오래 걸림 글

5초가 지나도 안 오면 기다리는 자리에 글 한 줄을 더한다 — "평소보다 오래 걸리고 있어요." 스켈레톤 · 원은 그대로 둔다. 스켈레톤 영역이면 첫 스켈레톤 위에 왼쪽 맞춤으로, 가운데 원이면 원 아래에 가운데 맞춤으로 16 띄워 둔다. 목록 카드(`body="list"`) 안의 영역이면 이 글과 실패 Result Section 이 좌우 24 를 갖는다 — 목록 카드는 줄마다 24 를 갖고 카드 여백이 없어, 카드 안 글이 늘 24 에 서게 한다(Card 23B). 내용 카드 안이면 카드의 24 가 맡는다. 영역 하나에 한 줄이고, 화면이 통째로 기다리면 콘텐츠 영역 맨 위 한 줄이다. 보조 기술에는 한 번 정중하게 읽힌다(아래 "알리기").

[그림: 5초 — 스켈레톤 위 · 원 아래의 안내 글](../../site/components/specs/skeleton.tsx#slow-guide)

[표: 오래 걸림 글](skeleton.yaml#base.enabled@slowText)

### 요청 제한 10초 · 다시 시도는 그 안에서

불러오기는 10초 안에 끝낸다 — 처음 요청부터 다시 시도까지 합쳐 10초가 지나면 끊고 실패로 그린다. 저절로 다시 시도하는 것은 그 10초 안에서만이다.

- 다시 시도는 읽기(불러오기)만 2번까지, 1초 · 2초 뒤에 한다. 10초를 넘기게 되면 하지 않는다.
- 다시 해도 같은 오류(권한 없음 · 없는 데이터 · 잘못된 요청 — 4xx)는 다시 하지 않고 바로 실패를 그린다.
- 저장 · 삭제 같은 쓰기는 저절로 다시 보내지 않는다 — 두 번 들어간다. 쓰기의 실패는 그 자리에서 알린다(폼 맨 위 [Callout](callout.md)).
- 올리기 · 받기처럼 진행을 아는 긴 일은 다 끝나는 시간이 아니라 진행이 10초 동안 멈추면 실패다 — 그동안은 값 있는 [Progress Circle](progress-circle.md) 로 진행을 보인다.
- 실패 화면의 "다시 시도" 를 누르면 시간표를 처음부터 다시 센다 — 그동안 버튼에 로딩을 건다([Result Section](result-section.md)).

### 무엇으로 기다리나

기다리는 동안의 틀 규칙은 이 표 한 곳이다 — [Progress Circle](progress-circle.md) 은 이 표를 가리킨다(2026-10-22 사용자 결정 5B — https://claude.ai/artifact/NuEPiLRH2fJidXdKzcDsCX). 덮개 칸은 뒤 화면을 덮는지다. 다 온 뒤 · 그림 자리에 무엇을 보일지(비어 있음 · 실패 · 대체 그림 · 이니셜)는 [Content Placeholder 의 "대신 보이는 것 고르기"](content-placeholder.md#대신-보이는-것-고르기) 다.

| 이런 때 | 보이는 것 | 덮개 |
|---|---|---|
| 화면 · 섹션의 첫 진입(목록 · 카드 · 상세 — 구조를 앎) | 스켈레톤 — 틀은 그리고 데이터 자리만 | 없음 |
| 구조를 미리 그릴 수 없는 자리(검색 결과 · 결과 화면 전체) | Progress Circle 40 — 틀은 그리고 콘텐츠 영역 가운데(SEED "콘텐츠가 없는 첫 로딩은 원만 화면 중앙" 과 같은 뜻) | 없음 |
| 앱 틀이 생기기 전(스플래시) | 화면 가운데 원만 — `brand` 톤 | 없음 |
| 달 · 기간 · 필터를 바꿈(다른 내용) | 바뀔 숫자 · 목록 자리만 스켈레톤 — 아래 "다른 내용을 받을 때" | 없음 |
| 같은 내용을 다시 받음(화면으로 돌아옴 · 당겨서 새로 고침) | 보던 내용을 그대로 둔다 — 실패는 Snackbar, 아래 "같은 내용을 다시 받을 때" | 없음 |
| 섹션 하나를 새로 고침 — 뒤를 계속 써도 됨 | 섹션 제목 옆 Progress Circle 24, 내용은 그대로 — 자리가 범위를 말한다 | 없음 |
| 목록 끝 더 불러오기 | 목록 아래 가운데 Progress Circle 24 | 없음 |
| 저장 · 제출 | 누른 버튼의 로딩([Button](button.md)) | 없음 |
| 올리기 · 받기(진행을 안다) | 값 있는 Progress Circle 24 — 사진이면 딤 위 흰 원 | 그 사진 위 딤만 |
| 뒤를 만지면 안 되는 처리(가져오기 확정 · 이용 해지 처리) | 화면 가운데 흰 원 40 — 안내 글 없음([Progress Circle](progress-circle.md) 의 "뒤를 만지면 안 되는 처리") | 화면 전체 딤 |
| 이미지 | [Image Frame](image-frame.md) 이 그린다 — 같은 모서리의 스켈레톤을 **처음부터**(위 시간표의 0 ~ 1초 틀만을 기다리지 않는다 — 빈 칸이 없다), 받아 둔 그림은 스켈레톤 없이 바로. 시간표에서 따르는 것은 10초 실패다 — 없거나 실패하면 [Content Placeholder](content-placeholder.md)(2026-10-22 사용자 결정 4B). 물건 타일([Logo Tile](logo-tile.md))은 이름을 아니까 첫 글자부터 | 없음 |

[그림: 자리마다 — 첫 진입 스켈레톤 · 섹션 새로 고침 원 24 · 목록 끝 원 · 저장 버튼 로딩](../../site/components/specs/skeleton.tsx#which-guide)

### 다른 내용을 받을 때 — 달 · 기간 · 필터

달 · 기간 · 필터를 바꾸면 머리(고른 달 이름 · 기간 칩)와 고정 틀은 바로 바뀌고, 바뀔 숫자 · 목록 자리만 기다린다. 옛 달의 숫자는 그 순간 지운다 — 새 달 이름 아래 옛 숫자를 남기지 않는다(돈 숫자라 잘못 읽힌다). 지운 자리는 시간표를 따른다 — 1초까지는 비워 두고(높이는 지킨다) 그 뒤 스켈레톤이다. 이미 받아 둔 달이면 바로 보인다.

[그림: 9월로 넘김 — 머리는 바로 9월, 숫자 · 목록 자리만 스켈레톤 · 9월 머리 아래 10월 숫자](../../site/components/specs/skeleton.tsx#period-guide)

### 같은 내용을 다시 받을 때

화면으로 돌아오거나 당겨서 새로 고칠 때는 보던 내용을 지우지 않는다 — 새 값이 오면 바뀌고, 실패하면 내용을 둔 채 [Snackbar](snackbar.md) 로 가볍게 알린다([Result Section](result-section.md) 의 결정, 2026-10-02). 스켈레톤으로 돌아가지 않는다. 당겨서 새로 고침은 [Progress Circle](progress-circle.md) 의 원이 새로 고침이 끝날 때까지 돈다.

[그림: 다시 받기 — 보던 내용 그대로 · 실패는 스낵바 · 스켈레톤으로 돌아간 화면](../../site/components/specs/skeleton.tsx#refresh-guide)

### 알리기 — 보조 기술

- 기다리는 영역에 `aria-busy="true"` 를 단다 — 다 오거나 실패하면 푼다.
- 상태 글은 화면에 하나다(`role="status"` · `aria-live="polite"`, 보이지 않게) — 1초에 "불러오는 중…", 5초에 "평소보다 오래 걸리고 있어요." 를 한 번씩 읽는다. 함께 기다리는 영역이 여럿이어도 한 번만 읽는다. 다 오면 비운다. 실패 · 비어 있음은 Result Section 이 알린다.
- 상태 글은 영역보다 먼저 있어야 읽힌다 — 빈 채로 두었다가 1초에 글을 넣는다.
- 스켈레톤 자체는 보조 기술에 숨긴다(`aria-hidden`) — 회색 면에는 읽을 것이 없다.
- 앱(Flutter)은 같은 일을 `Semantics(liveRegion: true)` 로 한다 — 스켈레톤은 `ExcludeSemantics`.

## 코드

레시피 `recipes/shadcn/components/ui/skeleton.tsx` 를 쓴다. 조각은 `Skeleton`, 기다리는 영역은 `LoadingRegion`(시간표 · `aria-busy` · 오래 걸림 글 · 실패로 바꿈)이고, 앱 맨 위에 `LoadingAnnouncer` 를 한 번 둔다(화면의 상태 글 하나). 아래 미리보기는 스펙 값으로 그린 모습이다.

- `Skeleton` — `radius`(`"0"` · `"4"` · `"6"` · `"8"` 기본 · `"12"` · `"16"` · `"full"` — 그림 자리는 Image Frame 의 `imageFrameRadius(폭)` 으로 고른다), `text`(`"t1"` ~ `"t14"` — 그 글자의 줄 높이를 높이로, 모서리 8), 크기 · 폭은 `className`. 늘 `aria-hidden` 이고, 글 자리(`span` · `p`) 안에도 둘 수 있게 `span`(블록)으로 그린다.
- `LoadingRegion` — `pending`(처음 받는 중 · 내용 없음) · `failed`(내용 없이 실패) · `fallback`(스켈레톤, 또는 `"circle"` — 영역 가운데 Progress Circle 40) · `failure`(실패 때 — Result Section) · `children`(내용). 1초까지 `fallback` 을 보이지 않게 그려 높이를 지키고, 5초에 오래 걸림 글을 더하고, `pending` 동안 `aria-busy` 를 단다. 내용이 이미 있으면(같은 내용을 다시 받는 중) `pending` 이 아니다 — 내용을 그대로 둔다.
- `LoadingAnnouncer` — 화면의 상태 글 하나. `LoadingRegion` 들이 여기에 알리고, 같은 글은 한 번만 읽는다.
- `useWaitPhase(pending)` — `"quiet"`(0 ~ 1초) · `"waiting"`(1초 ~) · `"slow"`(5초 ~). 영역을 직접 짤 때 쓴다.
- `LOADING_TIMING` — `{ showAfter: 1000, slowAfter: 5000, timeout: 10000, retryDelays: [1000, 2000] }`(`skeleton.yaml` 의 `region`).

### 목록 — 틀은 그리고 데이터 자리만

[그림: 최근 거래 카드 — 제목은 그리고 줄만 스켈레톤](../../site/components/specs/skeleton.tsx#ex-list)

```tsx
import { LoadingRegion, Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { List, ListItem } from "@/components/ui/list"
import { ResultSection } from "@/components/ui/result-section"

// 줄 껍데기는 실제 List 그대로 — 글 자리는 text 로 그 글자의 줄 높이(t5 22 · t3 18)
function TransactionRowsSkeleton({ rows }: { rows: number }) {
  return (
    <List>
      {Array.from({ length: rows }, (_, i) => (
        <ListItem
          key={i}
          prefix={<Skeleton radius="12" className="size-10" />}
          title={<Skeleton text="t5" className="w-32" />}
          detail={<Skeleton text="t3" className="w-20" />}
          suffix={<Skeleton text="t5" className="w-16" />}
        />
      ))}
    </List>
  )
}

<Card body="list">
  <CardHeader><CardTitle>최근 거래</CardTitle></CardHeader>{/* 틀 — 처음부터 그린다. 목록 카드는 줄이 가장자리까지(card.md) */}
  <LoadingRegion
    pending={query.isPending}
    failed={query.isError && !query.data}
    fallback={<TransactionRowsSkeleton rows={4} />}
    failure={
      <ResultSection
        kind="failure"
        size="medium"
        title="거래를 불러오지 못했어요"
        description="잠시 후 다시 시도해주세요."
        primaryAction={{ label: "다시 시도", onClick: () => query.refetch() }}
      />
    }
  >
    <TransactionList items={query.data} />
  </LoadingRegion>
</Card>
```

### 모양 다섯

[그림: 글 · 썸네일 · 카드 면 · 아바타 · 화면 폭 사진](../../site/components/specs/skeleton.tsx#ex-shapes)

```tsx
<Skeleton text="t4" className="w-40" />                  {/* 글 — 높이 19, 모서리 8(기본) */}
<Skeleton radius="6" className="size-10" />               {/* 썸네일 40 — Image Frame 모서리(폭 48 이하 6) */}
<Skeleton radius="16" className="h-28 w-full" />          {/* 카드 면 */}
<Skeleton radius="full" className="size-10" />            {/* 아바타 */}
<Skeleton radius="0" className="aspect-[4/3] w-full" />  {/* 화면 폭 사진 */}
```

### 다른 달 — 머리는 바로, 숫자 자리만

[그림: 통계의 달 넘기기](../../site/components/specs/skeleton.tsx#ex-period)

```tsx
// 달 이름(틀)은 고른 달을 바로 보이고, 숫자는 그 달의 쿼리를 기다린다.
// 옛 달 값을 이어서 보이지 않는다 — placeholderData 를 쓰지 않는다
const stats = useQuery({ queryKey: ["stats", month], queryFn: () => getStats(month) })

<MonthNav value={month} onValueChange={setMonth} />
<LoadingRegion
  pending={stats.isPending}
  failed={stats.isError && !stats.data}
  fallback={<Skeleton text="t9" className="w-36" />}
  failure={<ResultSection kind="failure" size="medium" title="통계를 불러오지 못했어요" primaryAction={{ label: "다시 시도", onClick: () => stats.refetch() }} />}
>
  <Amount value={stats.data?.total} />
</LoadingRegion>
```

### 앱 맨 위 · 요청 설정

```tsx
import { LOADING_TIMING, LoadingAnnouncer } from "@/components/ui/skeleton"

// 화면의 상태 글 하나 — LoadingRegion 들이 여기에 알린다(같은 글은 한 번만 읽는다)
<LoadingAnnouncer>
  <App />
</LoadingAnnouncer>

// 요청은 제품 코드다(레시피 밖) — 읽기는 2번까지 1초 · 2초 뒤, 4xx 와 쓰기는 다시 보내지 않는다.
// 한 번의 불러오기는 다시 시도까지 합쳐 LOADING_TIMING.timeout(10초) 안에 끝낸다
new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, error) => count < LOADING_TIMING.retryDelays.length && isRetryable(error),
      retryDelay: (count) => LOADING_TIMING.retryDelays[count] ?? LOADING_TIMING.retryDelays[LOADING_TIMING.retryDelays.length - 1] ?? 0,
    },
    mutations: { retry: false },
  },
})
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 불러오기 시작 | 영역에 `aria-busy` — 1초까지 틀만(데이터 자리는 보이지 않게 그려 높이를 지킨다) |
| 1초 | 스켈레톤이 보이고 띠가 지나간다 — 상태 글 "불러오는 중…" |
| 5초 | 오래 걸림 글이 더해진다 — 한 번 읽힌다 |
| 10초 | 실패 — Result Section `failure` + "다시 시도" 로 바뀐다(투명도 150ms) |
| 다 옴 | 스켈레톤을 걷고 내용이 투명도로 나타난다(150ms) — 자리 크기는 그대로 |
| 모션 줄이기 | 띠가 멈추고 면만 남는다 — 시간표 · 상태 글은 그대로 |
| 누르기 · 키보드 | 없다 — 스켈레톤은 초점을 받지 않는다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 스켈레톤은 장식(`aria-hidden`)이라 기준 밖 — 흰 면 위 1.08 · 다크 1.30(떠 있는 면 1.13), 띠가 지나가며 모양이 드러난다. 기다리는 상태는 상태 글이 알린다 |
| **WCAG 2.2.2** Pause, Stop, Hide | 진행을 알리는 반복이라 기준의 예외지만, 10초면 실패로 바뀌어 멈추고 모션 줄이기면 처음부터 멈춘다 ✓ |
| **WCAG 2.3.3** Animation from Interactions | 모션 줄이기면 띠를 멈춘다(v104) ✓ |
| **WCAG 4.1.3** Status messages | 영역 `aria-busy`, 화면의 상태 글 하나(`role="status"`) — 1초 "불러오는 중…" · 5초 "평소보다 오래 걸리고 있어요." 를 한 번씩, 결과는 Result Section ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 누르는 것이 없다 — 해당 없음 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 누르는 것이 없다 — 해당 없음 |
| **ARIA** | 스켈레톤 `aria-hidden="true"`, 영역 `aria-busy="true"`(다 오면 뺀다), 상태 글 `role="status"` + `aria-live="polite"`. 영어("Loading") · 세 점("...")을 쓰지 않는다 — "불러오는 중…"(Writing v106) |

## Do / Don't

### ✅ Do

- 틀(머리 · 탭 · 제목 · 버튼 · 카드 면)은 그리고 데이터 자리만 스켈레톤.
- 글 자리는 그 글자의 줄 높이, 모서리는 내용대로(글 8 · 그림 4 · 6 · 8 · 타일 12 · 카드 면 16 · 아바타 full · 화면 폭 사진 0).
- 흰 면(카드 · 시트 · 대화상자) 위에.
- 1초까지 기다렸다 보이고, 5초에 한 줄, 10초에 실패 + 다시 시도.
- 달을 바꾸면 머리는 바로, 바뀔 숫자 · 목록 자리만 기다린다.

### ❌ Don't

- 깜빡임(펄스) · 브랜드 색 띠.
- 회색 페이지 바탕 위에 바로 — 사라진다.
- 탭 · 제목 · 버튼까지 회색으로 덮기.
- 스켈레톤 위에 원을 얹기 · 한 자리에 둘 다(되도록 하나만).
- 새 달 이름 아래 옛 달 숫자.
- 불러오는 중인 금액 자리를 "—" 로 — 값이 없는 것과 같아 보인다.
- 실패하는 조회를 스켈레톤으로 오래 붙잡기(재시도 10번에 41초).

## Specification

`skeleton.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Skeleton 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — skeleton.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#skeleton)

## SEED 와 다른 점

- **면은 groo `bg-neutral-weak`**(gray-200 #F5F6FA · 다크 #353B4D) — SEED gray-200(#f3f4f5 · #1d2025)의 역할 짝이다. 흰 면 위 1.08:1 로 SEED(1.10)와 거의 같다.
- **흰 면 위에만 둔다** — groo gray-200 은 페이지 바탕과 같은 색이라 바탕 위에서는 사라진다(SEED 는 정하지 않았다).
- **모션 줄이기면 띠가 멈춘다**(v104) — SEED 는 계속 돈다.
- **보조 기술에 알린다** — 영역 `aria-busy` + 화면의 상태 글 하나. SEED 웹은 아무것도 남기지 않는다.
- **모서리 기본값 8** — SEED 코드와 같다(rootage 는 0 을 기본이라 적었다).
- **썸네일 자리는 Image Frame 의 모서리(4 · 6 · 8)** — SEED Skeleton 표는 "카드 및 썸네일 16" 이지만, 같은 문서 그림의 상품 썸네일은 약 8 이고 SEED Image Frame 은 폭으로 4 · 6 · 8 이다. 다 받은 그림과 같은 모서리로 둔다 — 16 은 카드 면만.
- **magic(AI) 톤은 두지 않는다** — 그 띠(gradient)도 들이지 않았다(v104).
- **기다리는 동안의 시간표 · 요청 제한 · 다시 시도를 수치로 둔다** — SEED 는 Loading 패턴의 시나리오(5초 안내 · 10초 실패)로만 적었고 구현에는 장치가 없다.

## Migration notes

### 2026-10-22 — 그림 자리는 처음부터 · 대신 보이는 것은 한 곳

"무엇으로 기다리나" 의 이미지 줄을 코드대로 맞췄다 — 그림 자리의 스켈레톤은 처음부터(시간표의 0 ~ 1초 틀만을 기다리지 않는다), 받아 둔 그림은 바로, 시간표에서 따르는 것은 10초 실패다(content-placeholder.md 의 "시간표를 따른다" 와 image-frame.yaml 의 "처음부터 깐다" 가 어긋나 있었다). 다 온 뒤 무엇을 보일지는 [Content Placeholder 의 "대신 보이는 것 고르기"](content-placeholder.md#대신-보이는-것-고르기) 한 곳을 가리킨다. 사용자 결정 4B · 1B — https://claude.ai/artifact/KPp9Lpd3v5KMgNrDn7pZmt. 값 변경 없음.

### 2026-10-22 — 기다림 틀 규칙은 이 표 한 곳

"무엇으로 기다리나" 를 덮개 칸이 있는 상황 표로 바꾸고 Progress Circle 이 이 표를 가리키게 했다. 스플래시(틀이 생기기 전 — 가운데 원만) 예외와 뒤를 만지면 안 되는 처리(화면 전체 딤 + 흰 원 40) 줄을 더했다. Skeleton · Progress Circle 견주기 표를 두고, "같이 쓰지 않는다" 를 SEED 말투대로 "되도록 하나만" 으로 바꿨다 — progress-circle.md 의 두 문장이 서로 부딪치던 것(Tone 의 스플래시 ↔ 틀 없는 원 금지)을 푼다(사용자 결정 5B · 4B — https://claude.ai/artifact/NuEPiLRH2fJidXdKzcDsCX). 값 변경 없음.

### 2026-10-03 — SEED Skeleton 으로 새로 둔다

사용자가 [비교 페이지](https://claude.ai/artifact/4ySVacsdnG4fgraR1HRK3G)에서 정했다 — SEED 반짝임 그대로(면 `bg-neutral-weak` · 흰 띠 · 1.5초 · 곡선 (0.35, 0, 0.35, 1) · 모서리 글 8 · 카드 16 · 원 full · 사진 0 · 글자 자리 = 글줄 높이), 시간표는 SEED Loading(1초 안 틀만 · 5초 안내 글 · 10초 실패 + 다시 시도 · 요청 제한 10초), 다른 달 · 기간은 머리를 바로 바꾸고 숫자 자리만 스켈레톤. 한 단계 진한 면(gray-300)은 고르지 않았다. 옛 Skeleton(깜빡임 기본 · `surface-input` · 모서리 4 · 글줄보다 낮은 막대 · 브랜드 25% 띠)은 걷었다 — 옛 스펙은 `skeleton.history/v-pre-seed-loading.*`.

제품은 앱 적용 단계에서 옮긴다(2026-10-03 조사 — Desk 웹 · HR 은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트로 쟀다).

- **Desk 웹** — 공용 `Skeleton`(`shared/ui/skeleton.tsx:11-21`, 508개 · 41파일)은 깜빡임 2초 · #f0f2f7 · 모서리 4 로 페이지 바탕 위 1.04:1 · 카드 위 1.12:1 이고 모션 줄이기에도 계속 깜빡인다(`skeleton.tsx:17`). 반짝임(`skeleton.tsx:27-42`, 브랜드 25% 띠)은 쓰는 곳이 0. 캘린더 손 스켈레톤 31개(`widgets/calendar/ui/{agenda-view,week-and-day-view,year-view}/*-skeleton.tsx`). 가계부 줄 스켈레톤 64 ↔ 실제 65(`ExpensePage.tsx:254-286`). 불러오는 중인 금액 자리 "—" 9곳(`DashboardPage.tsx:1189 · 1288 · 1321 · 1355 · 2190`, `ExpensePage.tsx:540 · 568 · 598`, `AssetPage.tsx:1691`). 첫 진입은 앱 틀 없이 가운데 원 하나(`app/router/routes.tsx:102-111`), 지연 로딩 페이지 이동은 표시가 없다. 증권 구독 확인 중 빈 화면(`features/subscription/ui/SecuritiesGate.tsx:19-22`), 증권 스켈레톤의 `aria-busy` + 이름이 이름 금지 요소에(`TossStocksPage.tsx:409 · 425 · 767 · 771`, `daily-quote-table.tsx:117-118`). 요청 제한이 없고(`shared/api/base.ts`) 5xx · 네트워크만 1번 다시 시도(`shared/api/retry.ts:14-21`).
- **Desk 앱** — `PSkeleton`(`shared/widgets/p_skeleton.dart:16-119`, 308개 · 38파일 · 화면 스켈레톤 46)은 깜빡임 2초 · #f0f2f7 · 모서리 4, 스켈레톤마다 컨트롤러가 따로라 엇갈려 깜빡인다(`p_skeleton.dart:53-58`). 의미 트리가 비어 있다(증권 4곳만 이름 — `stocks/toss_stocks_view.dart:2352 · 2450 · 2471 · 2774`). riverpod 기본 재시도 10번이 전역에 켜져(`app/session_scope.dart:74-80`) 0.3초 만에 실패하는 조회가 41초 동안 스켈레톤이다. `.when` 38파일(예: `expense/expense_screen.dart:271-279`)은 달을 바꾸면 화면 통째 스켈레톤으로 돌아가고, 새로 고침이 실패하면 보던 내용을 지운다. `PDayGroupSkeleton` 64 ↔ 65(`shared/widgets/p_day_group.dart:136-162`).
- **HR 웹** — shadcn `Skeleton`(`shared/ui/shadcn/skeleton.tsx:3-11`, 398개 · 53파일)은 `bg-accent` #f8f8f8 로 흰 바탕 위 1.06:1, 모서리 6, 모션 줄이기에도 깜빡인다. 재시도 3번 약 7초 · 요청 제한 없음(`app/providers/QueryProvider.tsx:14-20`), 연도 · 필터를 바꿀 때마다 새 키로 다시 스켈레톤. 세션 확인 동안 화면을 덮는 회색 막 "Loading"(`shared/ui/loading/Loading.tsx:3-7` · `app/router/Router.tsx:78-81`). 사진 올리는 중 자리는 다크에서도 밝은 그라디언트이고 전역 `@keyframes shimmer` 를 덮어쓴다(`features/user-profile/ui/UserEditDialog.tsx:236-255`).
- 앱 적용 때 화면마다 정할 자리 — 어느 쿼리가 화면을 통째로 기다리는지(웹 페이지 스켈레톤 · 첫 번만 3화면), 지연 로딩 페이지 이동 중 표시, 홈 히어로의 흰 정지 막대(앱 `dashboard/dashboard_screen.dart:713-726`).

### 2026-10-04 — 그림 자리의 모서리를 Image Frame 대로

사용자가 [이미지 비교 페이지](https://claude.ai/artifact/G351nuKcYX2xhorvA5UD6X) 2A 에서 정했다 — 그림 모서리는 SEED 폭 기준(24 이하 4 · 48 이하 6 · 그 위 8 · 화면 폭 0)이고, 불러오는 동안의 스켈레톤도 다 받은 그림과 같은 모서리다. 그래서 "카드 · 썸네일 16" 을 둘로 나눴다 — 썸네일 · 카드 그림 같은 그림 자리는 [Image Frame](image-frame.md) 의 모서리(`radius` 에 `"4"` · `"6"` 을 더하고 `"8"` 이 49 이상의 그림도 맡는다), `"16"` 은 카드 면(Card 모양 자리 전체)만이다. 그림 자리의 모서리는 레시피의 `imageFrameRadius(폭)` 이 고른다 — 손으로 고르지 않는다. 레시피 `Skeleton` 의 `radius` 에 `"4"` · `"6"` 이 더해진다. Image Frame 은 제 스켈레톤을 그 틀 안에 그리므로, 이 값을 쓰는 것은 줄이 통째로 기다릴 때처럼 틀 밖에서 그림 자리를 그릴 때다. 물건 타일([Logo Tile](logo-tile.md))은 이름을 알면 스켈레톤 없이 첫 글자부터 그린다(이미지 비교 6B).
