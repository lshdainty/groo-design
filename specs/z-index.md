# Z-Index Layers

> 떠 있는 표면이 쌓이는 차례를 층으로 정합니다. 각 컴포넌트의 z-index 는 이 표의 층을 따르고, 층마다 값은 DESIGN.md 의 z-index 토큰이 원본입니다.

층마다 z-index 를 따로 둡니다. 모든 표면을 같은 값에 두고 열린 차례에만 맡기면, 겹침이 깨졌을 때 원인을 찾기 어렵고 의도가 코드에 남지 않기 때문입니다.

## Layer matrix

| Layer | 토큰 | z-index | 컴포넌트 | 의미 |
|---|---|---|---|---|
| **L0 — base** | `z-base` | `auto` | 일반 콘텐츠 | 문서의 기본 흐름 — 쌓임 맥락을 만들지 않습니다 |
| **L1 — page sticky/fixed** | `z-sticky` | `50` | `top-navigation`(상단 바 · 데스크톱 머리), `bottom-navigation`(하단 탭 바), `floating-action-button`, 스피드 다이얼, `side-navigation`(사이드바) | 페이지 위에 붙은 고정 UI |
| **L2 — modal** | `z-modal` · `z-modal-content` | `100` · `101` | `dialog` / `bottom-sheet` / `menu-sheet` / `side-panel` | 모달 — 딤과 표면을 나눕니다 |
| **L3 — modal-aware floating** | `z-floating` | `200` | `popover` / `select` / `menu` / `color-picker`(popover 꼴) / `side-navigation` 의 펼침 메뉴 | 페이지와 모달 안 어디서나 씁니다. 모달(L2) 위에 떠야 하므로 200 이고, 페이지에서도 같은 값이라 고정 UI(L1) 위에 뜹니다 |
| **L4 — modal-aware tooltip** | `z-tooltip` | `210` | `help-bubble` · `tooltip` | 팝오버 위에 살짝 뜨는 참고 정보 |
| **L5 — alert-dialog** | `z-alert` · `z-alert-content` | `300` · `301` | `alert-dialog` | 딤과 표면을 나눕니다. 되돌릴 수 없는 결정을 받으므로 대화상자(L2) 위에 둡니다 — 대화상자 안에서 삭제 확인을 띄울 수 있습니다 |
| **L6 — snackbar** | `z-snackbar` | `400` | `snackbar` | 모든 시트 · 대화상자 · 확인창 위의 잠깐 알림 |
| **L9 — dev** | `z-dev` | `9999` | `env-watermark` | 개발 환경 표시 — 운영에서는 그리지 않습니다 |

- z-index 칸의 숫자는 토큰 칸의 값을 옮겨 적은 것입니다 — 사이트 빌드(`site/scripts/gen-content.mjs`)가 DESIGN.md 의 토큰 값과 같은지, 토큰이 빠짐없이 있는지 확인합니다.
- 웹은 토큰 변수로 부릅니다 — CSS `z-index: var(--z-floating)`, Tailwind v4 `z-(--z-floating)`. 숫자 클래스(`z-[200]` · `z-50`)로 층을 적지 않습니다.
- 앱(Flutter)은 숫자 없이 같은 순서를 따릅니다 — 라우트 · 오버레이가 연 순서로 쌓이므로 위 차례가 되게 띄웁니다.
- 한 컴포넌트 안에서 겹침을 정리하는 작은 값(`z-[1]` · `z-10`)은 층이 아닙니다 — 이 표 밖입니다.
- `side-navigation`(사이드바)은 L1 입니다 — 화면 틀의 한 칸이지만 sticky 로 붙어 스스로 쌓임 맥락을 만들고, 접혔을 때 뜨는 펼침 메뉴(L3) · 이름 말풍선(L4)을 그 안에 그립니다. 사이드바가 L0 이면 그 맥락이 뒤따르는 본문 카드 아래에 깔려 펼침 메뉴가 카드 뒤로 가리기 때문입니다.

## 의도한 쌓임

| 상황 | 결과 |
|---|---|
| 페이지 고정 UI(L1=50) 위에서 드롭다운을 엶 | 드롭다운(L3=200)이 고정 UI 위 ✓ |
| 페이지에서 대화상자를 엶 | 대화상자(L2=100)가 페이지 위 ✓ |
| 대화상자 안에서 select · popover 를 엶 | floating(L3=200)이 대화상자 표면(L2=101) 위 ✓ |
| 폼 시트 안에서 고르기 시트를 엶(겹친 시트 — bottom-sheet.md 가 허용하는 자리) | 위 시트의 딤 · 표면이 아래 시트 표면(L2=101) 바로 위, Popover(L3=200) 아래 — 웹은 `calc(var(--z-modal-content) + 1)` · `+ 2` 로 세웁니다. 겹친 시트는 새 층이 아니라 L2 안의 차례라 층 표 · 이름 토큰을 두지 않고, 값은 늘 아래 시트 표면에서 센 상대값입니다. 같은 100 · 101 이면 위 시트의 딤이 아래 시트 뒤에 가려지기 때문입니다. 겹침은 한 겹입니다 — 폼 시트 위에는 고르기 시트 · 머리 ⋮ 의 Menu Sheet · 확인창만 뜨고 그 위에 또 시트를 쌓지 않습니다(bottom-sheet.md Don't). 앱은 라우트를 연 순서로 쌓아 저절로 맞습니다 ✓ |
| 대화상자 안에서 tooltip 을 띄움 | tooltip(L4=210)이 popover(L3=200) 위 ✓ |
| 대화상자 안에서 확인창을 엶(삭제 확인 등) | 확인창(L5=300)이 대화상자(L2=101) 위 ✓ |
| 모든 층 위의 스낵바 | 스낵바(L6=400)가 확인창(L5=301) 위 ✓ |
| 개발 환경 표시 | L9 가 모든 것 위(배경처럼 보이게 불투명도를 낮춥니다) |

## L3 의 "modal-aware"

L3 컴포넌트(popover · select · menu)는 **페이지와 모달 안 두 자리에서 같은 값(`z-floating` 200)을 씁니다**. 한 컴포넌트에 z-index 가 하나라, 호출처마다 값을 바꾸거나 `inModal` 같은 분기를 두지 않습니다. 모달 안에서 쓸 때도 className 을 덧붙이지 않습니다.

페이지에는 L2(모달) 표면이 없으므로, L3(200)가 페이지 고정 UI(L1=50) 위로 떠도 어색하지 않습니다.

## 확인창 안의 floating

확인창(L5=300/301) 안에서 popover · select 를 띄우는 드문 자리는 호출처에서 `className="z-[310]"` 처럼 확인창 표면(`z-alert-content` 301) 바로 위로 올립니다 — 스낵바(`z-snackbar` 400)보다는 아래입니다. 이 자리를 위한 층 · 토큰은 두지 않습니다.

## 구현할 때 주의할 점(Radix portal + 겹친 모달)

아래 셋은 z-index 와 무관한 Radix 동작의 한계입니다. 컴포넌트 스펙(menu.md · dialog.md · alert-dialog.md)의 Behavior 절에도 같은 가이드가 있습니다.

### `pointer-events: none` 잠금이 풀리지 않음

Radix DropdownMenu · Dialog 는 열릴 때 `body { pointer-events: none }` 을 겁니다. 드롭다운 항목의 onSelect 에서 바로 대화상자를 열면 풀림 순서가 꼬여 대화상자 안 클릭이 먹지 않을 수 있습니다. Menu 는 비모달(`modal={false}`)이라 이 잠금을 걸지 않고, 메뉴 줄이 확인창 · 대화상자를 열 때는 메뉴가 닫힌 뒤 엽니다(menu.md Behavior).

- `<DropdownMenuItem onSelect={(e) => e.preventDefault()}>` 로 자동 닫힘을 막고, 한 프레임 뒤(`setTimeout(fn, 0)` 등)에 대화상자를 엽니다.
- 또는 드롭다운 밖의 트리거로 대화상자를 열고, 드롭다운은 이동만 맡깁니다.

### focus trap 충돌

모달 꼴 드롭다운과 대화상자의 focus trap 이 함께 켜지면 Tab 흐름이 깨집니다. 드롭다운이 다 닫힌 뒤 대화상자 trap 이 켜져야 합니다 — 위의 해결법을 따르면 함께 풀립니다.

### aria-hidden 누수

드롭다운이 닫힐 때 `aria-hidden="true"` 가 body 에 남으면 화면 읽기 프로그램이 대화상자를 읽지 못합니다. 드롭다운을 닫고 한 프레임 뒤 대화상자를 여는 꼴이 안전합니다.

## 컴포넌트 스펙의 z-index 적는 법

각 컴포넌트 스펙의 Sizes 또는 States 표에 z-index 행을 둡니다 — 이 가이드의 층 이름 · 토큰 · 값을 함께 적습니다. YAML(`specs/components/<이름>.yaml`)이 있으면 값은 숫자로 두고 토큰 이름은 비고에 씁니다 — 사이트 그림이 YAML 의 수를 그대로 쓰기 때문입니다. 예:

```
| z-index | `z-floating` 200 (L3 modal-aware floating) | — |
```

```yaml
zIndex: { value: 200, note: "z-floating — specs/z-index.md L3" }
```
