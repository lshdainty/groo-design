# Z-Index Layers

> Groo 의 floating layer stacking 정책. 시스템 wide 가이드. 각 컴포넌트의 z-index 는 이 표의 층을 따르고, 층마다 값은 DESIGN.md 의 z-index 토큰(v116)이 원본이다.

Groo 는 Bootstrap 식 **명시적 z-index 계층 분기** 정책을 채택. shadcn 공식은 모든 layer 가 `z-50` + portal order 로 stacking 하지만, 디버깅 / 의도 명시 / 예측 가능성을 위해 layer 별로 z-index 를 분기한다. Portal 순서에 의존하면 깨질 때 추적이 어렵다.

## Layer matrix

| Layer | 토큰 | z-index | 컴포넌트 | 의미 |
|---|---|---|---|---|
| **L0 — base** | `z-base` | `auto` | 일반 콘텐츠 | document 기본 flow — 쌓임 맥락을 만들지 않는다 |
| **L1 — page sticky/fixed** | `z-sticky` | `50` | `top-navigation`(상단 바 · 데스크톱 머리), `bottom-navigation`(하단 탭 바), `floating-action-button`, 스피드 다이얼 | 페이지 위 고정 UI |
| **L2 — modal** | `z-modal` · `z-modal-content` | `100` · `101` | `dialog` / `bottom-sheet` / `menu-sheet` / `side-panel` | modal layer — overlay + content 분리 |
| **L3 — modal-aware floating** | `z-floating` | `200` | `popover` / `select` / `menu` / `color-picker` (popover 패턴) / `side-navigation` 의 펼침 메뉴 | page 와 modal 안 어디서든 사용. modal(L2) 위에 떠야 하므로 200. page 에서도 동일 값 — sticky/FAB(L1=50) 위 자연스러움 |
| **L4 — modal-aware tooltip** | `z-tooltip` | `210` | `help-bubble` · `tooltip` | popover 위에 살짝 떠야 함 (hover 잠깐 뜨고 사라지는 참고 정보) |
| **L5 — alert-dialog** | `z-alert` · `z-alert-content` | `300` · `301` | `alert-dialog` | overlay + content 분리. 비가역 결정 강제. dialog(L2) 위로 명시 — dialog 안에서 삭제 확인 같은 alert 띄우는 케이스 보존 |
| **L6 — snackbar** | `z-snackbar` | `400` | `snackbar` | 모든 시트 · 대화상자 · 확인창 위의 잠깐 알림(2026-10-02 — 옛 sonner 라이브러리 기본 99999+ 를 명시 값으로) |
| **L9 — dev** | `z-dev` | `9999` | `env-watermark` | dev only 시각 표시 (production 비활성) |

- z-index 칸의 숫자는 토큰 칸의 값을 옮겨 적은 것이다 — 사이트 빌드(`site/scripts/gen-content.mjs`)가 DESIGN.md 의 토큰 값과 같은지, 토큰이 빠짐없이 있는지 확인한다.
- 웹은 토큰 변수로 부른다 — CSS `z-index: var(--z-floating)`, Tailwind v4 `z-(--z-floating)`. 숫자 클래스(`z-[200]` · `z-50`)로 층을 적지 않는다.
- 앱(Flutter)은 숫자 없이 같은 순서를 따른다 — 라우트 · 오버레이가 연 순서로 쌓이므로 위 차례가 되게 띄운다.
- 한 컴포넌트 안에서 겹침을 정리하는 작은 값(`z-[1]` · `z-10`)은 층이 아니다 — 이 표 밖이다.
- `side-navigation`(사이드바)은 층이 아니다 — 화면 틀의 한 칸이라 L0 이다. 접혔을 때 뜨는 펼침 메뉴 · 이름 말풍선만 L3 · L4 다.

## 의도된 stacking 시나리오

| 시나리오 | 결과 |
|---|---|
| page sticky(L1=50) 위 dropdown 열림 | dropdown(L3=200) 가 sticky 위 ✓ |
| page 에서 dialog 열림 | dialog(L2=100) 가 page 위 ✓ |
| dialog 안 select / popover 열림 | floating(L3=200) 가 dialog content(L2=101) 위 ✓ |
| 폼 시트 안에서 고르기 시트 열림(겹친 시트 — bottom-sheet.md 가 허용하는 자리) | 위 시트의 딤 · 표면이 아래 시트 표면(L2=101) 바로 위 · Popover(L3=200) 아래 — 웹은 `calc(var(--z-modal-content) + 1)` · `+ 2` 로 세운다(층 표에 새 층 · 이름 토큰은 두지 않았다 — 둘지는 정하지 않았다). 같은 100 · 101 이면 위 시트의 딤이 아래 시트 뒤에 가려진다(2026-10-25 I-19-1 — desk-front 9463b038). 앱은 라우트를 연 순서로 쌓아 저절로 맞다 ✓ |
| dialog 안 tooltip hover | tooltip(L4=210) 가 popover(L3=200) 위 ✓ |
| dialog 안 alert-dialog 열림 (삭제 확인 등) | alert(L5=300) 가 dialog(L2=101) 위 ✓ |
| 모든 layer 위 snackbar | snackbar(L6=400) 가 alert(L5=301) 위 ✓ |
| dev watermark | L9 가 모든 것 위 (배경처럼 보임은 opacity 처리) |

## L3 의 "modal-aware" 의미

L3 컴포넌트(popover/select/menu) 는 **page 와 modal 안 두 컨텍스트에서 같은 값(`z-floating` 200) 사용**. 호출처별 변경 없이 한 컴포넌트 = 한 z-index — `inModal` prop 같은 분기 불필요. 호출처는 modal 안 사용 시 추가 className override 안 해도 정상.

근거 — page 에는 L2(modal=100) layer 자체가 페이지 표면엔 없으므로 L3(200) 가 page sticky(L1=50) 위로 자연스럽게 떠도 어색하지 않다.

## L5 안 floating 의 edge case

alert-dialog(L5=300/301) 안에서 popover/select 띄우는 케이스는 매우 드물지만 만약 필요하면 호출처에서 `className="z-[310]"` 처럼 확인창 표면(`z-alert-content` 301) 바로 위로 override 한다 — 스낵바(`z-snackbar` 400)보다는 아래. 시스템 분기 · 토큰 추가 보류 — drift 우려.

## Known issues (Radix portal + 다중 modal)

### Issue 1 — `pointer-events: none` 잠금 풀림 안 됨

> 2026-10-02 — Menu 는 비모달(`modal={false}`)이라 이 잠금을 걸지 않는다. 메뉴 줄이 확인창 · 대화상자를 열 때는 메뉴가 닫힌 뒤 연다(menu.md Behavior). 아래는 모달 메뉴 시절의 기록이다.

Radix DropdownMenu / Dialog 가 열릴 때 `body { pointer-events: none }` 박는다. **dropdown-menu 안 item 클릭 → 그 onSelect 콜백에서 dialog open** 같은 빠른 연쇄 transition 시 풀림 순서가 꼬여 dialog 내부 클릭이 안 먹는 버그가 Radix 의 잘 알려진 이슈.

**해결**:
- `<DropdownMenuItem onSelect={(e) => e.preventDefault()}>` 로 자동 close 막고 별도 시점(setTimeout(fn, 0) 등 한 프레임 후)에 dialog open
- 또는 dropdown 외부 trigger 로 dialog 열고 dropdown 은 단순 navigation 만 담당

### Issue 2 — focus trap 충돌

dropdown(modal pattern) 과 dialog 가 동시에 focus trap active 면 Tab 흐름 깨짐. dropdown close 가 먼저 완료된 후 dialog trap 활성화되어야 정상. Issue 1 의 해결책 따라가면 자연 해결.

### Issue 3 — aria-hidden 누수

dropdown 닫힐 때 `aria-hidden="true"` 가 body 에 남아 screen reader 가 dialog 인식 못 함. Radix 최신 버전에서 대부분 해결됐으나 발생 시 dropdown close → 한 프레임 후 dialog open 패턴이 안전.

→ **위 3 이슈는 z-index 정책과 무관 — Radix 동작 자체의 한계**. 컴포넌트 spec (menu.md / dialog.md / alert-dialog.md) 의 Behavior 섹션에 해당 가이드 표시.

## 컴포넌트 spec 의 z-index 명시 규칙

각 컴포넌트 spec 의 Sizes 또는 States 표에 z-index 행 필수 — 이 가이드의 layer 명 · 토큰 · 값 동시 표기. YAML(`specs/components/<이름>.yaml`)이 있으면 값은 숫자로 두고 토큰 이름은 비고에 쓴다 — 사이트 그림이 YAML 의 수를 그대로 쓰기 때문이다. 예:

```
| z-index | `z-floating` 200 (L3 modal-aware floating) | — |
```

```yaml
zIndex: { value: 200, note: "z-floating — specs/z-index.md L3" }
```

## Migration notes

- **v1: 최초 명시 (2026-05-15)** — 그동안 각 컴포넌트 spec 에 z-index 가 분산 명시되거나 누락된 상태였음. desk-front 가 모두 다른 값으로 분기(50/100/101/200/9999) 두고 있었는데 정합 기준이 없었음. Bootstrap 식 명시 계층 채택. shadcn 표준(모두 z-50 + portal order) 은 디버깅 어렵다고 판단 — 우리는 명시 분기.
- **v2: 토큰이 원본 (2026-10-03, DESIGN.md v116)** — 층마다 토큰을 두고 이름을 층으로 붙였다(`z-sticky` · `z-modal` · `z-modal-content` · `z-floating` · `z-tooltip` · `z-alert` · `z-alert-content` · `z-snackbar` · `z-dev`, L0 은 `z-base` `auto`). 값은 이 표 그대로다. 그동안 DESIGN.md 의 v65 토큰(z-dropdown 1000 · z-drawer 1200 · z-toast 1400 …)은 이 표와 값이 달랐다(레시피는 이 표의 숫자를 따로 적었다) — 걷었다. 레시피의 `z-[100]` 같은 숫자 클래스는 `z-(--z-modal)` 로 바꿨다. 사용자 결정(2026-10-03 — 이 층 표를 정본으로, 새 토큰은 층 이름으로).
- **v3: 화면 틀 · 이동 (2026-10-04)** — 옛 `sheet` 자리를 `side-panel`(Side Panel — 왼쪽 주 메뉴 · 오른쪽 패널)이 잇는다. L1 의 고정 UI 를 컴포넌트 이름으로 적었다 — `top-navigation` · `bottom-navigation` · `floating-action-button`(지금 제품의 웹 탭 바 40 · Fab 20 · 하위 머리 10 · 설정 하위 100 · HR SpeedDial 50 은 앱 적용 때 `z-sticky` 로). 값 · 토큰은 그대로다.
