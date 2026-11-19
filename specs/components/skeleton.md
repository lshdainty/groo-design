# Skeleton

> 불러오는 동안 곧 나타날 내용의 자리를 미리 그리는 회색 면입니다. 목록 · 카드 · 상세처럼 구조가 정해진 자리에 씁니다 — 화면의 틀(머리 · 탭 · 제목 · 버튼 · 카드 면)은 실제로 그리고, 서버에서 올 데이터 자리만 스켈레톤으로 둡니다. 저장 · 새로 고침처럼 행동 하나를 기다리는 자리는 [Progress Circle](progress-circle.md), 이미지가 없거나 못 불러온 자리는 [Content Placeholder](content-placeholder.md) 를 씁니다.

면 하나 위로 흰 띠가 자기 폭만큼 지나가는 반짝임이고, 글자 자리는 글줄 높이입니다. 깜빡임(펄스)은 두지 않습니다. 기다리는 동안의 시간표(1초 · 5초 · 10초)도 이 문서의 "기다리는 동안" 에 둡니다.

수치 원본은 [`skeleton.yaml`](skeleton.yaml)입니다.

[그림: 홈 · 카드 혜택 · 거래 상세를 불러오는 동안 — 라이트 · 다크](../../site/components/specs/skeleton.tsx#hero)

### 직접 골라 보기

모양(글 · 카드 · 아바타 · 사진) · 글자 크기 · 모션 줄이기 · 기다린 시간을 고르면 스펙대로 그린 스켈레톤과 그 코드가 바뀝니다. 기다린 시간을 옮기면 1초 · 5초 · 10초에 화면이 어떻게 바뀌는지 볼 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/skeleton.tsx#playground)

## Anatomy

[그림: 기다리는 영역 안에 면과 그 위를 지나는 반짝임 띠, 5초부터 오래 걸림 글](../../site/components/specs/skeleton.tsx#anatomy)

| ⓐ Region | 기다리는 영역 — 데이터 자리 하나(쿼리 하나)입니다. 시간표 · 요청 제한 · 낭독을 맡습니다. |
| ⓑ Root | 면 — 곧 나타날 내용 하나의 자리입니다. |
| ⓒ Shimmer | 반짝임 띠 — 면 위를 자기 폭만큼 지나갑니다. |
| ⓓ Slow Text | 오래 걸림 글 — 5초부터 한 줄 보입니다. |

[표: 부위](skeleton.yaml#slots)

## Properties

### 모서리

곧 올 내용의 모양을 따릅니다 — 글 · 숫자 8 *(기본)*, 그림 자리(썸네일 · 카드 그림)는 [Image Frame](image-frame.md) 의 모서리(폭 24 이하 4 · 48 이하 6 · 그 위 8 — 다 받은 그림과 같은 모서리), 목록 앞 타일 12(List 타일 · Logo Tile 40 — 거래 · 카테고리 · 자산 줄), 카드 면 16(Card 모양 자리 전체), 아바타 · 원 아이콘 · 칩 full, 화면 끝에 붙는 사진 0 입니다. 카드 그림(신용카드 그림)은 카드 면이 아니라 그림이라 4 · 6 · 8 입니다.

[그림: 모서리 — 글 8 · 그림 4 · 6 · 8(폭으로) · 타일 12 · 카드 면 16 · 아바타 full · 화면 폭 사진 0](../../site/components/specs/skeleton.tsx#radius)

[표: 모서리](skeleton.yaml#radius)

### 크기 — 글은 글줄 높이

크기는 그 자리에 올 내용의 크기입니다. 글 · 숫자 자리는 그 글자의 줄 높이만큼 높습니다 — 14 글자(`t4`)면 19, 16 글자(`t5`)면 22 입니다. 글자보다 낮은 막대로 그리면 글이 오는 순간 줄이 밀립니다. 글 줄의 폭은 실제 글 길이와 비슷하게 두고, 여러 줄이면 마지막 줄을 짧게 둡니다.

줄 높이는 올 글을 따릅니다. 글자 크기 설정을 따라 커지는 글의 자리는 스켈레톤도 같이 커지고, 글자 크기를 따르지 않는 자리(`-static` 글 — 달력 칸 · 차트 그림 · 배지 등)는 `-static` 줄 높이(`text="t3-static"`)로 그립니다.

[그림: 글자 자리 = 글줄 높이 — 12 · 14 · 16 · 20 글자 옆에 같은 높이의 스켈레톤](../../site/components/specs/skeleton.tsx#text-height)

[표: 면](skeleton.yaml#base.enabled@root)

### 반짝임

면 위로 흰 띠가 자기 폭만큼 왼쪽 밖에서 오른쪽 밖으로 1.5초에 지나가고, 쉬지 않고 되풀이합니다. 다크에서는 띠가 훨씬 옅습니다(흰 10%). 깜빡임(투명도 1 ↔ 0.5)은 두지 않습니다. 모션 줄이기면 띠가 멈추고 면만 남습니다.

[그림: 반짝임 — 1.5초 · 모션 줄이기면 면만](../../site/components/specs/skeleton.tsx#shimmer)

[표: 반짝임 띠](skeleton.yaml#base.enabled@shimmer)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 기다리는 중 — 띠가 지나갑니다 |
| `reducedMotion` | 모션 줄이기 — 띠가 멈추고 면만 남습니다 |

[표: 상태](skeleton.yaml#matrix)

[표: 모션](skeleton.yaml#motion)

## Guidelines

### 틀은 먼저, 데이터 자리만 스켈레톤

머리 · 탭 · 섹션 제목 · 버튼 · 필터 · 카드 면처럼 로컬 상태와 정해진 글로 그릴 수 있는 틀은 처음부터 실제로 그립니다. 스켈레톤은 서버에서 올 데이터 자리에만 둡니다 — 틀까지 덮으면 바로 보일 정보를 가리고, 데이터가 오는 순간 틀이 진짜로 바뀌며 화면이 튑니다.

- **예외 — 달력 보기는 칸을 비워 두지 않습니다.** 캘린더의 월 · 주 · 년 보기와 홈 · 가계부 · 할 일의 달력은 기다리는 동안 칸마다 데이터 자리를 스켈레톤으로 채웁니다 — 틀만 그리고 칸을 비우면 "일정 없음" 으로 읽히기 때문입니다. 가계부 · 할 일 달력은 요일 · 날짜를 그리고 칸 아래 표시(금액 · 점) 자리를, 캘린더 월 보기는 요일 머리를 그리고 날짜 자리를 원 스켈레톤으로, 년 보기는 달마다 상자 하나로 덮습니다. 격자 안 스켈레톤은 `-static` 크기이고, 달력 위 머리(달 이름 단추 · 이전 · 다음 · 보기 고르기)는 그대로 그립니다.
- 내용과 스켈레톤은 한 묶음입니다 — 같은 부모 안에서 갈라 껍데기(카드 · 섹션 · 여백)를 함께 씁니다. 로딩 분기가 껍데기를 따로 그리면 두 벌이 되어 한쪽만 고쳐집니다.
- 껍데기는 실제로 쓰는 컴포넌트(Card · List · 섹션)를 그대로 씁니다 — 자체 상자로 흉내 내지 않습니다. 컴포넌트에 값이 하나 늘면 흉내 낸 쪽만 옛 모양으로 남습니다.
- 자기 쿼리를 가진 컴포넌트는 자기 스켈레톤을 갖습니다 — 부모 페이지가 다시 흉내 내지 않습니다.
- 데이터에 따라 있고 없고가 갈리는 섹션은 스켈레톤에 넣지 않습니다 — 불러오는 동안은 뜰지 알 수 없습니다. 빼 두면 데이터가 와서 아래에 나타나는 쪽이 덜 튑니다.
- 화면 전체가 쿼리 하나를 기다려도 앱 틀(상단 바 · 탭 바 · 사이드바)은 그립니다 — 틀이 있는데 틀 없이 화면 가운데 원 하나, 덮을 콘텐츠가 없는 자리의 회색 막 "Loading" 은 두지 않습니다. 예외는 틀이 생기기 전(스플래시)입니다 — 아래 "무엇으로 기다리나" 를 봅니다.

[그림: 틀은 실제로 · 데이터 자리만 스켈레톤 — 탭 · 제목 · 버튼까지 덮은 화면](../../site/components/specs/skeleton.tsx#frame-guide)

### 흰 면 위에만

스켈레톤 면(`bg-neutral-weak`)은 흰 면(카드 · 시트 · 대화상자 — `bg-layer-default` · `bg-layer-floating`) 위에서 1.08:1 로 보이고 띠가 지나가며 모양이 드러납니다. 회색 페이지 바탕(`bg-layer-basement`) 위에서는 같은 색이라 사라집니다(1.00:1) — 바탕 위의 자리는 카드 면을 먼저 그리고 그 안에 스켈레톤을 둡니다.

[그림: 흰 카드 위 · 회색 바탕 위 — 바탕 위에서는 사라집니다](../../site/components/specs/skeleton.tsx#surface-guide)

### 모양은 내용대로

곧 올 내용의 줄 수 · 길이 · 모서리를 따릅니다 — 목록이면 실제 줄 높이로 몇 줄, 메모 본문이면 여러 줄에 마지막 줄을 짧게, 아바타는 원, 사진은 그 비율로 그립니다. 실제 줄과 높이가 1px 만 달라도 데이터가 올 때 목록 전체가 밀립니다. 글자 모양까지 흉내 내지는 않습니다 — 자리만 그립니다.

[그림: 모양 — 실제 줄과 같은 높이 · 글자보다 낮은 막대](../../site/components/specs/skeleton.tsx#shape-guide)

### Progress Circle 과 한 자리에는 되도록 하나

한 자리에는 되도록 하나만 둡니다 — 구조가 보이는 넓은 자리(목록 · 카드 · 상세)는 스켈레톤, 행동 하나를 기다리는 작은 자리(저장 · 새로 고침 · 목록 끝 더 불러오기)는 [Progress Circle](progress-circle.md) 입니다. 스켈레톤 위에 원을 얹지 않습니다.

| | Skeleton | Progress Circle(값 없는 원) |
|---|---|---|
| 보여 주는 것 | 곧 올 내용의 구조(줄 · 카드 모양) | 지금 작동 중이라는 사실만 |
| 자리 | 내용이 실제로 놓일 자리 | 기다리는 범위의 가운데 · 제목 옆 · 목록 끝 |
| 어울리는 일 | 넓은 자리를 한 번에 받기 · 반복되는 줄 | 행동 하나(새로 고침 · 더 불러오기 · 저장) |
| 어울리는 시간 | 1 ~ 10초 | 1 ~ 4초 |
| 시간표 | 둘이 같습니다 — 1초부터 보임 · 5초 안내 글 · 10초 실패(아래 "기다리는 동안") | 같습니다 |

[그림: 한 자리에 하나 — 스켈레톤 위에 원을 얹은 화면](../../site/components/specs/skeleton.tsx#mix-guide)

## 기다리는 동안

불러오는 모든 자리(첫 진입 · 화면 안 조회 · 달 · 기간 · 필터 바꾸기)는 이 시간표를 따릅니다 — 스켈레톤이든 [Progress Circle](progress-circle.md) 이든 같습니다. 결과(비어 있음 · 실패)는 [Result Section](result-section.md) 이 그립니다. 수치는 `skeleton.yaml` 의 `region` 입니다.

### 시간표 — 1초 · 5초 · 10초

| 지난 시간 | 화면 | 보조 기술 |
|---|---|---|
| 0 ~ 1초 | 틀만 — 데이터 자리는 비워 두고 높이는 지킵니다. 1초 안에 오면 아무것도 깜빡이지 않습니다 | 영역에 `aria-busy="true"` — 아직 아무것도 읽지 않습니다 |
| 1초 ~ | 스켈레톤 또는 Progress Circle | "불러오는 중…"(숨은 상태 글) |
| 5초 ~ | 그대로 + 글 한 줄 "평소보다 오래 걸리고 있어요." | 그 글을 한 번 읽습니다 |
| 10초 | 실패 — Result Section `failure` + "다시 시도" | Result Section 이 알립니다(`role="status"`) |
| 다 옴 | 내용(웹 투명도 150ms · 앱 바로) · 비어 있으면 Result Section `empty` | `aria-busy` 를 풀고 상태 글을 비웁니다 |

[그림: 시간표 — 0 ~ 1초 틀만 · 1초 스켈레톤 · 5초 안내 글 · 10초 실패 + 다시 시도](../../site/components/specs/skeleton.tsx#timeline)

[표: 기다리는 영역](skeleton.yaml#base.enabled@region)

### 오래 걸림 글

5초가 지나도 안 오면 기다리는 자리에 글 한 줄을 더합니다 — "평소보다 오래 걸리고 있어요." 스켈레톤 · 원은 그대로 둡니다. 스켈레톤 영역이면 첫 스켈레톤 위에 왼쪽 맞춤으로, 가운데 원이면 원 아래에 가운데 맞춤으로 16 띄워 둡니다. 목록 카드(`body="list"`) 안의 영역이면 이 글과 실패 Result Section 이 좌우 24 를 갖습니다 — 목록 카드는 줄마다 24 를 갖고 카드 여백이 없어, 카드 안 글이 늘 24 에 서게 합니다. 내용 카드 안이면 카드의 24 가 맡습니다. 스켈레톤이 화면 끝까지 그려지는 자리(캘린더 달 격자처럼 화면 여백 없이 그리는 영역)면 글은 첫 스켈레톤이 아니라 화면 여백(`spacing-global-gutter`)에 왼쪽을 맞춥니다 — 글은 읽는 내용이라 다른 화면의 글과 같은 세로선에 섭니다. 한 화면에 한 번입니다 — 화면의 첫 영역이 화면 전체를 대신해 기다릴 때(화면이 통째로 기다림) 그 영역에 한 줄을 둡니다. 함께 기다리는 부속 영역(카드 하나 · 섹션 하나)에는 보이는 글을 두지 않고 보조 기술 알림(아래 "알리기")만 합니다. 보조 기술에는 한 번 정중하게 읽힙니다(아래 "알리기").

[그림: 5초 — 스켈레톤 위 · 원 아래의 안내 글](../../site/components/specs/skeleton.tsx#slow-guide)

[표: 오래 걸림 글](skeleton.yaml#base.enabled@slowText)

### 요청 제한 10초 · 다시 시도는 그 안에서

불러오기는 10초 안에 끝냅니다 — 처음 요청부터 다시 시도까지 합쳐 10초가 지나면 끊고 실패로 그립니다. 저절로 다시 시도하는 것은 그 10초 안에서만입니다.

- 다시 시도는 읽기(불러오기)만 2번까지, 1초 · 2초 뒤에 합니다. 10초를 넘기게 되면 하지 않습니다.
- 다시 해도 같은 오류(권한 없음 · 없는 데이터 · 잘못된 요청 — 4xx)는 다시 하지 않고 바로 실패를 그립니다.
- 저장 · 삭제 같은 쓰기는 저절로 다시 보내지 않습니다 — 두 번 들어갑니다. 쓰기의 실패는 그 자리에서 알립니다(폼 맨 위 [Callout](callout.md)).
- 올리기 · 받기처럼 진행을 아는 긴 일은 다 끝나는 시간이 아니라 진행이 10초 동안 멈추면 실패입니다 — 그동안은 값 있는 [Progress Circle](progress-circle.md) 로 진행을 보입니다.
- 실패 화면의 "다시 시도" 를 누르면 시간표를 처음부터 다시 셉니다 — 그동안 버튼에 로딩을 겁니다([Result Section](result-section.md)).

### 무엇으로 기다리나

기다리는 동안의 틀 규칙은 이 표 한 곳에 둡니다 — [Progress Circle](progress-circle.md) 은 이 표를 가리킵니다. 덮개 칸은 뒤 화면을 덮는지입니다. 다 온 뒤 · 그림 자리에 무엇을 보일지(비어 있음 · 실패 · 대체 그림 · 이니셜)는 [Content Placeholder 의 "대신 보이는 것 고르기"](content-placeholder.md#대신-보이는-것-고르기) 를 따릅니다.

| 이런 때 | 보이는 것 | 덮개 |
|---|---|---|
| 화면 · 섹션의 첫 진입(목록 · 카드 · 상세 — 구조를 앎) | 스켈레톤 — 틀은 그리고 데이터 자리만 | 없음 |
| 값 조각 — 줄 끝 값 · 칸 안 값 하나(건수 · 잔액 한 자리) | 그 값 자리 크기의 스켈레톤 — 시간표의 0 ~ 1초 틀만을 따릅니다(그 동안은 투명, 자리 크기 유지). 1초부터는 영역 스켈레톤과 똑같이 보이고 띠가 지나갑니다 — 값 조각만의 다른 모양 · 다른 시각은 없습니다. 5초 글은 두지 않고, 알림은 앱 맨 위 상태 글 한 곳(아래 "알리기")이 맡습니다 — 조각도 그 상태 글에 기다림을 알립니다(따로 읽히지 않고 한 번만). 조각만 기다리는 화면에서도 1초 "불러오는 중…" 이 읽혀야 합니다 | 없음 |
| 구조를 미리 그릴 수 없는 자리(검색 결과 · 결과 화면 전체) | Progress Circle 40 — 틀은 그리고 콘텐츠 영역 가운데 | 없음 |
| 앱 틀이 생기기 전(스플래시) | 로고 묶음(나무 + 서비스 이름) 아래 원 — `brand` 톤(DESIGN.md "그룹 색 · 로고 칠") | 없음 |
| 달 · 기간 · 필터를 바꿈(다른 내용) | 바뀔 숫자 · 목록 자리만 스켈레톤 — 아래 "다른 내용을 받을 때" | 없음 |
| 같은 내용을 다시 받음(화면으로 돌아옴 · 당겨서 새로 고침) | 보던 내용을 그대로 둡니다 — 실패는 Snackbar, 아래 "같은 내용을 다시 받을 때". 저절로 되풀이하는 조회(시세 폴링)의 실패만 그 섹션 머리 아래 Callout | 없음 |
| 섹션 하나를 새로 고침 — 뒤를 계속 써도 됨 | 섹션 제목 옆 Progress Circle 24, 내용은 그대로 — 자리가 범위를 말합니다 | 없음 |
| 목록 끝 더 불러오기 | 목록 아래 가운데 Progress Circle 24 | 없음 |
| 저장 · 제출 | 누른 버튼의 로딩([Button](button.md)) | 없음 |
| 올리기 · 받기(진행을 알 때) | 값 있는 Progress Circle 24 — 사진이면 딤 위 흰 원 | 그 사진 위 딤만 |
| 뒤를 만지면 안 되는 처리(가져오기 확정 · 이용 해지 처리) | 화면 가운데 흰 원 40 — 안내 글 없음([Progress Circle](progress-circle.md) 의 "뒤를 만지면 안 되는 처리") | 화면 전체 딤 |
| 이미지 | [Image Frame](image-frame.md) 이 그립니다 — 같은 모서리의 스켈레톤을 **처음부터**(위 시간표의 0 ~ 1초 틀만을 기다리지 않습니다 — 빈 칸이 없습니다), 받아 둔 그림은 스켈레톤 없이 바로 그립니다. 시간표에서 따르는 것은 10초 실패입니다 — 없거나 실패하면 [Content Placeholder](content-placeholder.md). 물건 타일([Logo Tile](logo-tile.md))은 이름을 아니까 첫 글자부터 그립니다 | 없음 |

[그림: 자리마다 — 첫 진입 스켈레톤 · 섹션 새로 고침 원 24 · 목록 끝 원 · 저장 버튼 로딩](../../site/components/specs/skeleton.tsx#which-guide)

### 다른 내용을 받을 때 — 달 · 기간 · 필터

달 · 기간 · 필터를 바꾸면 머리(고른 달 이름 · 기간 칩)와 고정 틀은 바로 바뀌고, 바뀔 숫자 · 목록 자리만 기다립니다. 옛 달의 숫자는 그 순간 지웁니다 — 새 달 이름 아래 옛 숫자를 남기지 않습니다(돈 숫자라 잘못 읽힙니다). 지운 자리는 시간표를 따릅니다 — 1초까지는 비워 두고(높이는 지킵니다) 그 뒤 스켈레톤입니다. 이미 받아 둔 달이면 바로 보입니다.

[그림: 9월로 넘김 — 머리는 바로 9월, 숫자 · 목록 자리만 스켈레톤 · 9월 머리 아래 10월 숫자](../../site/components/specs/skeleton.tsx#period-guide)

### 같은 내용을 다시 받을 때

화면으로 돌아오거나 당겨서 새로 고칠 때는 보던 내용을 지우지 않습니다 — 새 값이 오면 바뀌고, 실패하면 내용을 둔 채 [Snackbar](snackbar.md) 로 가볍게 알립니다([Result Section](result-section.md) 과 같습니다). 스켈레톤으로 돌아가지 않습니다. 당겨서 새로 고침은 [Progress Circle](progress-circle.md) 의 원이 새로 고침이 끝날 때까지 돕니다.

- **글은 "새로 고치지 못했어요." 한 문장입니다** — [다시 시도] 를 달지 않습니다. 당겨서 새로 고침도 같은 글입니다 — 다시 당기는 것이 다시 시도입니다. 보던 내용이 있을 때만 띄우고, 이미 떠 있으면 다시 띄우지 않습니다.
- **연달아 실패하면 첫 실패만 알립니다** — 같은 조회가 이어서 실패하면 첫 실패에만 스낵바를 띄우고, 한 번 성공하면 다시 셉니다. 저절로 되풀이하는 조회(홈 60초 다시 받기)가 망이 끊긴 동안 1분마다 띠를 띄우지 않게 합니다.
- **폴링 시세는 그 자리에서 알립니다** — 시세처럼 저절로 되풀이해 받는 값이 보이는 채 실패하면 숫자는 두고, 그 섹션 머리 아래 [Callout](callout.md) `critical` 한 줄 "시세를 불러오지 못했어요" · 설명 "보이는 값은 마지막으로 받은 시세예요." 를 둡니다 — 상자 전체를 누르면 다시 받습니다(`actionable`). 다음 받기가 성공하면 저절로 걷습니다. 스낵바는 쓰지 않습니다 — 폴링마다 띠가 쏟아집니다. 같은 시세 실패가 여러 섹션에 걸리면 Callout 은 화면 가장 위 섹션에 하나입니다. 값이 하나도 없으면 [Result Section](result-section.md) 실패입니다(그 문서의 "실패를 비어 있음으로 보이지 않는다").

[그림: 다시 받기 — 보던 내용 그대로 · 실패는 스낵바 · 스켈레톤으로 돌아간 화면](../../site/components/specs/skeleton.tsx#refresh-guide)

### 알리기 — 보조 기술

- 기다리는 영역에 `aria-busy="true"` 를 답니다 — 다 오거나 실패하면 풉니다.
- 상태 글은 화면에 하나입니다(`role="status"` · `aria-live="polite"`, 보이지 않게) — 1초에 "불러오는 중…", 5초에 "평소보다 오래 걸리고 있어요." 를 한 번씩 읽습니다. 함께 기다리는 영역이 여럿이어도 한 번만 읽습니다. 다 오면 비웁니다. 실패 · 비어 있음은 Result Section 이 알립니다.
- 상태 글은 영역보다 먼저 있어야 읽힙니다 — 빈 채로 두었다가 1초에 글을 넣습니다.
- 스켈레톤 자체는 보조 기술에 숨깁니다(`aria-hidden`) — 회색 면에는 읽을 것이 없습니다.
- 앱(Flutter)은 같은 일을 `Semantics(liveRegion: true)` 로 합니다 — 스켈레톤은 `ExcludeSemantics` 입니다.

## 코드

레시피 `recipes/shadcn/components/ui/skeleton.tsx` 를 씁니다. 조각은 `Skeleton`, 기다리는 영역은 `LoadingRegion`(시간표 · `aria-busy` · 오래 걸림 글 · 실패로 바꿈)이고, 앱 맨 위에 `LoadingAnnouncer` 를 한 번 둡니다(화면의 상태 글 하나). 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `Skeleton` — `radius`(`"0"` · `"4"` · `"6"` · `"8"` 기본 · `"12"` · `"16"` · `"full"` — 그림 자리는 Image Frame 의 `imageFrameRadius(폭)` 으로 고른다), `text`(`"t1"` ~ `"t14"` — 그 글자의 줄 높이를 높이로, 모서리 8. 글자 크기를 따르지 않는 자리는 `"t1-static"` ~ `"t14-static"`), 크기 · 폭은 `className` 으로 줍니다. 늘 `aria-hidden` 이고, 글 자리(`span` · `p`) 안에도 둘 수 있게 `span`(블록)으로 그립니다.
- `LoadingRegion` — `pending`(처음 받는 중 · 내용 없음) · `failed`(내용 없이 실패) · `fallback`(스켈레톤, 또는 `"circle"` — 영역 가운데 Progress Circle 40) · `failure`(실패 때 — Result Section) · `children`(내용). 1초까지 `fallback` 을 보이지 않게 그려 높이를 지키고, 5초에 오래 걸림 글을 더하고, `pending` 동안 `aria-busy` 를 답니다. 내용이 이미 있으면(같은 내용을 다시 받는 중) `pending` 이 아닙니다 — 내용을 그대로 둡니다.
- `LoadingAnnouncer` — 화면의 상태 글 하나입니다. `LoadingRegion` 들이 여기에 알리고, 같은 글은 한 번만 읽습니다.
- `useWaitPhase(pending)` — `"quiet"`(0 ~ 1초) · `"waiting"`(1초 ~) · `"slow"`(5초 ~). 영역을 직접 짤 때 씁니다.
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
        description="잠시 뒤 다시 시도해주세요."
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
| 불러오기 시작 | 영역에 `aria-busy` — 1초까지 틀만(데이터 자리는 보이지 않게 그려 높이를 지킵니다) |
| 1초 | 스켈레톤이 보이고 띠가 지나갑니다 — 상태 글 "불러오는 중…" |
| 5초 | 오래 걸림 글이 더해집니다 — 한 번 읽힙니다 |
| 10초 | 실패 — Result Section `failure` + "다시 시도" 로 바뀝니다(투명도 150ms) |
| 다 옴 | 스켈레톤을 걷고 내용이 투명도로 나타납니다(150ms, 웹) — 자리 크기는 그대로입니다. 앱은 전환 없이 바로 바꿉니다 |
| 모션 줄이기 | 띠가 멈추고 면만 남습니다 — 시간표 · 상태 글은 그대로입니다 |
| 누르기 · 키보드 | 없습니다 — 스켈레톤은 초점을 받지 않습니다 |
| 글자 크기 설정 | 글 자리의 높이가 올 글의 줄 높이를 따라 커집니다(`-static` 자리는 그대로). 오래 걸림 글도 커지고 줄을 바꿔 받습니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.4** Resize text | 오래 걸림 글은 글자 크기 설정을 따라 커집니다 ✓. 스켈레톤 면은 글이 아니라 대상이 아니고, 높이는 올 글과 같이 커져 글이 와도 줄이 밀리지 않습니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 스켈레톤은 장식(`aria-hidden`)이라 기준 밖입니다 — 흰 면 위 1.08 · 다크 1.30(떠 있는 면 1.13), 띠가 지나가며 모양이 드러납니다. 기다리는 상태는 상태 글이 알립니다 |
| **WCAG 2.2.2** Pause, Stop, Hide | 진행을 알리는 반복이라 기준의 예외지만, 10초면 실패로 바뀌어 멈추고 모션 줄이기면 처음부터 멈춥니다 ✓ |
| **WCAG 2.3.3** Animation from Interactions | 모션 줄이기면 띠를 멈춥니다 ✓ |
| **WCAG 4.1.3** Status messages | 영역 `aria-busy`, 화면의 상태 글 하나(`role="status"`) — 1초 "불러오는 중…" · 5초 "평소보다 오래 걸리고 있어요." 를 한 번씩, 결과는 Result Section ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 누르는 것이 없습니다 — 해당 없음 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 누르는 것이 없습니다 — 해당 없음 |
| **ARIA** | 스켈레톤 `aria-hidden="true"`, 영역 `aria-busy="true"`(다 오면 뺍니다), 상태 글 `role="status"` + `aria-live="polite"`. 영어("Loading") · 세 점("...")을 쓰지 않습니다 — "불러오는 중…"(Writing) |

## Do / Don't

### ✅ Do

- 틀(머리 · 탭 · 제목 · 버튼 · 카드 면)은 그리고 데이터 자리만 스켈레톤.
- 글 자리는 그 글자의 줄 높이, 모서리는 내용대로(글 8 · 그림 4 · 6 · 8 · 타일 12 · 카드 면 16 · 아바타 full · 화면 폭 사진 0).
- 흰 면(카드 · 시트 · 대화상자) 위에.
- 1초까지 기다렸다 보이고, 5초에 한 줄, 10초에 실패 + 다시 시도.
- 달을 바꾸면 머리는 바로, 바뀔 숫자 · 목록 자리만 기다리기.

### ❌ Don't

- 깜빡임(펄스) · 브랜드 색 띠 · magic(AI) 톤 띠.
- 회색 페이지 바탕 위에 바로 — 사라집니다.
- 탭 · 제목 · 버튼까지 회색으로 덮기.
- 스켈레톤 위에 원을 얹기 · 한 자리에 둘 다(되도록 하나만).
- 새 달 이름 아래 옛 달 숫자.
- 불러오는 중인 금액 자리를 "—" 로 — 값이 없는 것과 같아 보입니다.
- 실패하는 조회를 스켈레톤으로 오래 붙잡기(재시도 10번에 41초).

## Specification

`skeleton.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Skeleton 을 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적었습니다.

[그림: Specification — skeleton.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#skeleton)
