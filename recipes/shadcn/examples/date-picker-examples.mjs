/*
 * shadcn Date Picker 예제 — docs site components/date-picker.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 셋(날짜 하나 · 기간 · 고를 수 있는 범위)은 차례 · 제목 · 코드가 specs/components/date-picker.md 의
 * "코드" 절과 같다. 옛 Calendar 예제(calendar-examples.mjs — react-day-picker · 원 40 · 고른 날 브랜드 채움 · 오늘 테두리)를 대신한다.
 *
 * ROOT · ROOT_SIZE · PRESETS · NAV_PX · HEADER · TITLE · TITLE_ICON · NAV · TWO_MONTHS · TWO_MONTHS_HEADER · MONTH_NAME · NAV_START · NAV_END · CONTINUOUS_* · FOG ·
 * GRID · WEEK · WEEKDAY_ROW · WEEKDAY · CELL · BAND · BAND_SIDE · DAY · DAY_PRESS · DAY_PRESS_ON_WEAK · DAY_STATE · DAY_TODAY_WEIGHT · DAY_STRIKE · OUTSIDE · LIVE ·
 * DATE_PICKER_TWO_MONTHS_POPOVER 는 recipes/shadcn/components/ui/date-picker.tsx 의 상수와, TITLE_TEXT · MONTH_COLUMN · HIDDEN_WEEKDAYS 는 그 파일의
 * JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다(연 · 월 휠 WHEEL · WHEEL_YEAR · WHEEL_MONTH 는 이 파일의 그림이 휠을 열지 않아 옮기지 않았다).
 * 둘레의 부품은 그 레시피의 값을 옮겨 썼다 — BUTTON_* 는 button.tsx(button-examples.mjs), CHIP_* · GROUP_* · SCROLL_ROW 는 chip.tsx(chip-examples.mjs — 스크롤
 * 칸의 양 끝 흐림 fogStyle 은 scroll-fog.tsx 의 useScrollFog 와 같은 셈),
 * SHEET_* 는 bottom-sheet.tsx(bottom-sheet-examples.mjs), POP_* 는 popover.tsx(popover-examples.mjs), IB_* 는 input-button.tsx · FIELD_* 는 field.tsx
 * (input-button-examples.mjs)의 것과 같다 — 이 파일이 쓰는 변형 · 크기와 그에 걸리는 compound 만 옮겼다.
 * 규칙은 specs/components/date-picker.md, 수치 원본은 specs/components/date-picker.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 달력 <div role="group" data-slot="date-picker"> > (빠른 기간 <div role="radiogroup" data-slot="date-picker-presets">) ·
 * 머리 <div data-slot="date-picker-header">(제목 <button data-slot="date-picker-title"> · 이전 · 다음 <button data-slot="date-picker-previous | date-picker-next">) ·
 * 달 <div role="grid"> > 요일 줄 · 주 <div role="row"> > 칸 <div role="gridcell">(기간 띠는 칸의 ::before — data-band) > 날짜 <button data-date>(원은 ::before ·
 * 초점 링은 ::after) > 숫자 <span data-slot="date-picker-day">, 끝에 알림 자리 <span aria-live data-slot="date-picker-live">. 앞뒤 달 칸은 숫자만(<span aria-hidden>) 둔다.
 * 두 달은 달마다 <div data-slot="date-picker-month"> 머리에 이름 · 이전(첫 달) · 다음(둘째 달)을 두고, 이어지는 달은 스크롤 칸 <div data-slot="date-picker-scroll"> 안에
 * 위에 붙는 요일 줄 · 달마다 이름 + 숨은 요일 줄 + 주 · 아래 안개다.
 * 레시피가 cn() 으로 합치는 자리는 merge() 로 똑같이 합친다 — 같은 속성을 다시 쓴 클래스는 뒤의 것만 남는다(오늘의 font-bold 가 font-medium 을, 고른 날 ·
 * 오늘 · 읽기 전용의 before:bg-* 가 before:bg-transparent 를, 두 달 팝오버의 max-w 가 표면의 max-w 를, 이전 · 다음의 absolute 가 Button 의 relative 를 지운다).
 * 이어지는 달은 레시피가 앞뒤 달을 빈 칸(높이)으로 두고 보이는 달로 스크롤해 그린다 — 정적 그림은 스크롤을 정할 수 없어 보이는 달부터 그렸다.
 * 시트 · 팝오버는 화면에 뜬다 — 미리보기 틀(STAGE)에 transform 을 줘 fixed 의 기준을 틀로 바꾸고 isolation 으로 z-index 를 틀 안에 가둔다. 시트 높이 상한 ·
 * 이어지는 달의 시트 높이(90dvh)는 창 높이를 따르므로 미리보기는 틀 높이의 90% 를 style 로 한 번 더 적는다(SHEET_FIT — 미리보기용 덧칠). 두 달 팝오버(744)는
 * 사이트의 미리보기 칸(600)보다 넓어 그 틀만 가로로 스크롤한다. 뒤 화면(일정 · 통계)은 미리보기 그림이고, 오늘은 2026년 10월 2일(금)이다.
 * 레시피의 스크립트(고르기 · 달 넘기기 · 연 · 월 휠 · 칩 · 키 · 초점 · 스크롤)는 정적 HTML 에 없다 — 날짜에 마우스를 올리거나 누르면 원은 레시피 그대로
 * 칠해지지만 고른 날은 그대로다. 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다 — 레시피가 className 을 준
 * 제목 셰브론만 class 를 단다).
 */

import { readFileSync } from "node:fs";

// ── date-picker.tsx 의 상수와 같은 값 ──────────────────────────────────────

// 달력 — bg-layer-floating. 폭은 부모(시트), 팝오버 안이면 336, 두 달은 696. 이어지는 달은 부모가 준 높이를 채운다
const ROOT = "relative flex min-w-0 flex-col bg-bg-layer-floating font-sans";

const ROOT_SIZE = {
  month: "w-full [[data-slot=popover-content]_&]:w-[336px]",
  twoMonths: "w-[696px]",
  continuous: "h-full min-h-0 w-full",
};

// 빠른 기간 칩 줄 — 머리와 12
const PRESETS = "shrink-0 pb-x3";

// 머리 48 — 왼쪽 제목, 오른쪽 이전 · 다음(사이 0)
// 이전 · 다음 — Button ghost iconOnly medium 을 px 40 으로 고정한다(글자 크기를 따르지 않는다 — 03-C 1B, SEED)
const NAV_PX = "h-[40px] w-[40px]";
const HEADER = "flex min-h-[48px] shrink-0 items-center justify-between";

// 제목 — 누르는 자리는 머리 높이 48 전체, 글자는 왼쪽에서 4 · 셰브론과 4. 바탕이 없어 모서리 8 은 초점 링에만 보인다
const TITLE = [
  "inline-flex min-h-[48px] min-w-0 cursor-pointer items-center gap-x1 rounded-r2 border-0 bg-transparent px-x1 font-sans text-t5 font-bold text-fg-neutral outline-none",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

// 셰브론 20 — 휠이 열리면 위로(150ms easing). 모션 줄이기면 바로
const TITLE_ICON = "size-[20px] shrink-0 text-fg-neutral [transition:rotate_var(--motion-duration-d3)_var(--motion-ease-easing)] motion-reduce:[transition:none]";

const NAV = "flex shrink-0 items-center";

// 두 달 — 사이 24, 달마다 가운데 이름 48 · 이전은 첫 달 왼쪽 끝 · 다음은 둘째 달 오른쪽 끝(위 4)
const TWO_MONTHS = "grid grid-cols-2 gap-x-x6";

const TWO_MONTHS_HEADER = "relative flex min-h-[48px] items-center justify-center";

const MONTH_NAME = "text-t5 font-bold text-fg-neutral whitespace-nowrap";

const NAV_START = "absolute left-0 top-x1";

const NAV_END = "absolute right-0 top-x1";

// 이어지는 달 — 스크롤 칸(스크롤바 숨김) · 위에 붙는 요일 줄 · 달마다 왼쪽 이름 48 + 아래 16 · 아래 안개 96
const CONTINUOUS_SCROLL = "relative min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const CONTINUOUS_WEEKDAYS = "sticky top-0 z-[2] grid min-h-[48px] grid-cols-7 bg-bg-layer-floating";

const CONTINUOUS_MONTH = "pb-x4";

const CONTINUOUS_MONTH_NAME = "flex min-h-[48px] items-center px-x1 text-t5 font-bold text-fg-neutral";

const FOG = "pointer-events-none sticky bottom-0 z-[3] -mt-24 h-24 [background:linear-gradient(to_bottom,transparent,var(--color-bg-layer-floating))]";

// 달 그리드 — 크기 컨테이너. --day = min(42, 칸 폭 − 2) 를 원 · 띠 · 링이 같이 쓴다
const GRID = "@container [--day:min(42px,calc(100cqw_/_7_-_2px))]";

const WEEK = "grid grid-cols-7";

const WEEKDAY_ROW = "grid min-h-[48px] grid-cols-7";

const WEEKDAY = "flex items-center justify-center text-t4 font-medium text-fg-neutral-subtle";

// 칸 — 높이 max(48, 숫자 줄 높이 + 6)(날짜 버튼 · 앞뒤 달 숫자의 위아래 3 이 키운다 — 100% 48 · 200% 50) · 폭 = 달력 폭 ÷ 7.
// 기간 띠는 칸의 ::before(원 높이, 칸 세로 가운데)
const CELL = "relative isolate min-h-[48px] min-w-0";

const BAND = "before:pointer-events-none before:absolute before:top-1/2 before:h-[var(--day)] before:-translate-y-1/2 before:bg-bg-neutral-weak before:content-['']";

const BAND_SIDE = {
  start: "before:left-1/2 before:right-0",
  middle: "before:inset-x-0",
  end: "before:left-0 before:right-1/2",
};

// 날짜 버튼 — 칸 전체 · 위아래 3(숫자 줄이 원 42 를 넘는 큰 글자에서 칸이 줄 높이 + 6 이 된다 — 03-C 1B).
// 원은 ::before(칸 가운데 --day · 바탕만 color-transition), 키보드 초점 링은 ::after(원 둘레 안쪽 2px)
const DAY = [
  "relative isolate flex h-full w-full items-center justify-center border-0 bg-transparent px-0 py-[3px] font-sans text-t5 font-medium tabular-nums outline-none select-none [-webkit-tap-highlight-color:transparent]",
  "before:absolute before:left-1/2 before:top-1/2 before:-z-10 before:size-[var(--day)] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-transparent before:content-[''] before:[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "after:pointer-events-none after:absolute after:left-1/2 after:top-1/2 after:size-[var(--day)] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:content-['']",
  "focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-stroke-focus-ring",
].join(" ");

// 호버(마우스 — 고운 포인터만) · 누름(터치) — 원 bg-neutral-weak-alpha-pressed(SEED 투명 색 — 2026-10-21 03-C 2B), 축소 없음
const DAY_PRESS = "[@media(hover:hover)_and_(pointer:fine)]:hover:before:bg-bg-neutral-weak-alpha-pressed active:before:bg-bg-neutral-weak-alpha-pressed";

// 오늘(옅은 원) · 기간 사이 날(띠) 위의 호버 · 누름 — 한 단계 짙은 bg-neutral-weak-pressed(옅은 원 · 띠와 같은 색이면 안 보인다)
const DAY_PRESS_ON_WEAK = "[@media(hover:hover)_and_(pointer:fine)]:hover:before:bg-bg-neutral-weak-pressed active:before:bg-bg-neutral-weak-pressed";

const DAY_STATE = {
  enabled: "cursor-pointer text-fg-neutral-muted",
  today: "cursor-pointer text-fg-neutral before:bg-bg-neutral-weak",
  selected: "cursor-pointer text-fg-neutral-inverted before:bg-bg-neutral-inverted",
  inRange: "cursor-pointer text-fg-neutral-muted",
  disabled: "cursor-not-allowed text-fg-disabled",
  readOnly: "cursor-default text-fg-neutral-inverted before:bg-stroke-neutral-solid",
};

const DAY_TODAY_WEIGHT = "font-bold";

const DAY_STRIKE = "line-through";

// 앞뒤 달 — 숫자만(버튼 아님), 흐리게 · 누르지 못한다. 위아래 3 은 날짜 버튼과 같다(칸 높이가 같게)
const OUTSIDE = "flex h-full w-full cursor-default select-none items-center justify-center py-[3px] text-t5 font-medium tabular-nums text-fg-disabled";

const LIVE = "sr-only";

const DATE_PICKER_TWO_MONTHS_POPOVER = "max-w-[min(744px,var(--radix-popover-content-available-width,744px))]";

// ── date-picker.tsx 의 JSX 에 적힌 클래스 ──────────────────────────────────

// 제목 글 — 좁으면 말줄임
const TITLE_TEXT = "truncate";
// 두 달의 달 하나
const MONTH_COLUMN = "min-w-0";
// 이어지는 달의 달마다 숨은 요일 줄(columnheader) — 붙은 요일 줄은 보조 기술에 숨긴다
const HIDDEN_WEEKDAYS = "sr-only";

// ── button.tsx 의 cva 와 같은 값 — 이전 · 다음(ghost · medium · 아이콘만) · 바닥 버튼(시트 large · 팝오버 small) ──

const BUTTON_BASE = [
  "relative inline-flex items-center justify-center whitespace-nowrap font-sans font-bold",
  "before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed disabled:[scale:1] disabled:bg-bg-disabled disabled:text-fg-disabled",
  "aria-busy:cursor-progress aria-busy:text-transparent aria-busy:[&>svg:not([data-slot=progress-circle])]:invisible aria-busy:active:[scale:1]",
  "[--progress-thickness:2px]",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
].join(" ");

const BUTTON_VARIANTS = {
  variant: {
    neutralSolid:
      "bg-bg-neutral-inverted text-fg-neutral-inverted hover:bg-bg-neutral-inverted-pressed active:bg-bg-neutral-inverted-pressed aria-busy:bg-bg-neutral-inverted-pressed [--progress-track:color-mix(in_srgb,var(--color-fg-neutral-inverted)_30%,transparent)] [--progress-range:var(--color-fg-neutral-inverted)]",
    neutralWeak:
      "bg-bg-neutral-weak text-fg-neutral hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed aria-busy:bg-bg-neutral-weak-pressed [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
    ghost:
      "bg-transparent text-fg-neutral hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed aria-busy:bg-bg-layer-default-pressed disabled:bg-transparent [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
  },
  size: {
    small: "h-9 rounded-r2 [--press-basis:36] [--progress-size:14px]",
    medium: "h-10 rounded-r2 [--press-basis:40] [--progress-size:16px]",
    large: "h-12 rounded-r3 [--press-basis:48] [--progress-size:18px]",
  },
  layout: { withText: "", iconOnly: "" },
  ghostColor: { neutral: "", neutralSubtle: "", brand: "", critical: "" },
  flush: { left: "", right: "" },
};

const BUTTON_COMPOUND = [
  { size: "small", layout: "withText", className: "px-x3_5 py-x2 gap-x1 text-t4 [&_svg]:size-3.5" },
  { size: "large", layout: "withText", className: "px-x5 py-x3 gap-x2 text-t6 [&_svg]:size-[22px]" },
  { size: "medium", layout: "iconOnly", className: "w-10 p-x2_5 [&_svg]:size-[18px]" },
];

const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// ── chip.tsx 의 cva · 상수와 같은 값 — 빠른 기간(ChipRadioGroup · ChipRadio outlineStrong · medium) ──

const CHIP_BASE = [
  "relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-x1_5 whitespace-nowrap rounded-full font-sans text-t4 font-medium no-underline",
  "before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),color_var(--motion-duration-color-transition)_var(--motion-ease-easing),box-shadow_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed disabled:[scale:1] disabled:bg-bg-disabled disabled:text-fg-disabled",
  "[&:is([data-state=checked],[data-selected])]:disabled:bg-bg-disabled [&:is([data-state=checked],[data-selected])]:disabled:text-fg-disabled [&:is([data-state=checked],[data-selected])]:disabled:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-solid)]",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
].join(" ");

const CHIP_VARIANTS = {
  variant: {
    outlineStrong: [
      "bg-transparent text-fg-neutral shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed",
      "[&:is([data-state=checked],[data-selected])]:bg-bg-neutral-inverted [&:is([data-state=checked],[data-selected])]:text-fg-neutral-inverted [&:is([data-state=checked],[data-selected])]:shadow-none [&:is([data-state=checked],[data-selected])]:hover:bg-bg-neutral-inverted-pressed [&:is([data-state=checked],[data-selected])]:active:bg-bg-neutral-inverted-pressed",
    ].join(" "),
  },
  size: {
    medium: "h-9 [--press-basis:36]",
  },
  layout: {
    withText: "",
    iconOnly: "",
  },
};

const CHIP_COMPOUND = [{ size: "medium", layout: "withText", className: "min-w-12 px-x3_5" }];

const CHIP_DEFAULTS = { variant: "outlineWeak", size: "medium", layout: "withText" };

// 바깥 묶음(chipGroupVariants) — wrap 은 칩을 바로 담아 줄바꿈, scroll 은 안쪽 스크롤 칸(SCROLL_ROW)을 담고 bleed 면 화면 끝까지
const GROUP_BASE = "relative";

const GROUP_VARIANTS = {
  layout: {
    wrap: "flex flex-wrap gap-between-chips empty:min-h-9",
    scroll: "has-[>[data-slot=chip-scroll-row]:empty]:min-h-9",
  },
  bleed: {
    true: "",
    false: "",
  },
};

const GROUP_COMPOUND = [{ layout: "scroll", bleed: true, className: "-mx-global-gutter" }];

const GROUP_DEFAULTS = { layout: "wrap", bleed: false };

// 안쪽 스크롤 칸(chip.yaml scrollRow) — 한 줄 · 칩 사이 8, 안쪽 좌우 화면 여백 · 위아래 6 을 두고 바깥 −6 으로 되돌린다
const SCROLL_ROW =
  "relative -my-x1_5 flex flex-nowrap gap-between-chips overflow-x-auto px-global-gutter py-x1_5 scroll-px-global-gutter [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

// ── bottom-sheet.tsx 의 상수 · JSX 에 적힌 클래스 — 1280 미만 시트 ─────────────

// 딤 — 300ms enter 로 나타나고 200ms exit 로 사라진다(모션 줄이기면 150ms). 끌다 놓아 제자리로 갈 때도 200ms exit 로 돌아오고,
// 끄는 동안(바로 뒤 시트에 .vaul-dragging)은 손가락을 바로 따른다
const SHEET_OVERLAY = [
  "fixed inset-0 z-(--z-modal) bg-[var(--overlay-dim-light)] dark:bg-[var(--overlay-dim-dark)]",
  "[animation-duration:var(--sheet-anim-duration)]! [animation-timing-function:var(--sheet-anim-ease)]!",
  "data-[state=open]:[--sheet-anim-duration:var(--motion-duration-d6)] data-[state=open]:[--sheet-anim-ease:var(--motion-ease-enter)]",
  "data-[state=closed]:[--sheet-anim-duration:var(--motion-duration-d4)] data-[state=closed]:[--sheet-anim-ease:var(--motion-ease-exit)]",
  "motion-reduce:data-[state]:data-[vaul-overlay]:[--sheet-anim-duration:var(--motion-duration-d3)]",
  "[&:not(:has(+.vaul-dragging))]:[transition:opacity_var(--motion-duration-d4)_var(--motion-ease-exit)]!",
].join(" ");

// 시트 — 최대 480 가운데, 위 모서리 r6, 내용만큼(최대 90%), 바닥 아래 안전 영역
const SHEET_CONTENT = [
  "fixed inset-x-0 bottom-0 z-(--z-modal-content) mx-auto flex max-h-[90dvh] w-full max-w-[480px] flex-col",
  "rounded-t-r6 bg-bg-layer-floating pb-[env(safe-area-inset-bottom)] font-sans text-fg-neutral outline-none",
  // 열림 300ms enter-expressive · 닫힘 200ms exit(vaul 의 slideFromBottom · slideToBottom 그대로, 시간 · 곡선만)
  "[animation-duration:var(--sheet-anim-duration)]! [animation-timing-function:var(--sheet-anim-ease)]!",
  "data-[state=open]:[--sheet-anim-duration:var(--motion-duration-d6)] data-[state=open]:[--sheet-anim-ease:var(--motion-ease-enter-expressive)]",
  "data-[state=closed]:[--sheet-anim-duration:var(--motion-duration-d4)] data-[state=closed]:[--sheet-anim-ease:var(--motion-ease-exit)]",
  // 끌다 놓아 제자리로 200ms exit · 스냅 높이 사이 300ms enter-expressive. 끄는 동안은 손가락을 바로 따른다
  "[&:not(.vaul-dragging)]:[transition:transform_var(--sheet-move-duration)_var(--sheet-move-ease)]!",
  "[--sheet-move-duration:var(--motion-duration-d4)] [--sheet-move-ease:var(--motion-ease-exit)]",
  "data-[vaul-snap-points=true]:[--sheet-move-duration:var(--motion-duration-d6)] data-[vaul-snap-points=true]:[--sheet-move-ease:var(--motion-ease-enter-expressive)]",
  // 모션 줄이기 — 미끄러지지 않고 150ms 서서히 나타나고 사라진다. 제자리 · 스냅 이동은 바로
  "motion-reduce:data-[state=open]:[animation-name:fadeIn]! motion-reduce:data-[state=closed]:[animation-name:fadeOut]!",
  "motion-reduce:data-[state]:data-[vaul-drawer]:[--sheet-anim-duration:var(--motion-duration-d3)]",
  "motion-reduce:data-[vaul-drawer]:data-[vaul-snap-points]:[--sheet-move-duration:0s]",
].join(" ");

// 닫기 — 28 원 · 아이콘 14, 누르는 영역 44(::before). 누르면 bg-neutral-weak-pressed + 2px 거리 축소(기준 28 → 0.929)
const SHEET_CLOSE = [
  "absolute right-global-gutter top-x6 flex size-7 cursor-pointer items-center justify-center rounded-full border-0 bg-bg-neutral-weak p-0 text-fg-neutral [&>svg]:size-3.5",
  "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed [--press-basis:28] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

// 머리 · 제목(닫기 버튼이 있으면 오른쪽 64) · 본문 · 바닥(버튼 large 48 — 하나면 폭 전체, 둘이면 반씩)
const SHEET_HEADER = "flex shrink-0 flex-col gap-x2 px-global-gutter pb-x4 pt-x6";
const SHEET_TITLE = "m-0 text-t8 font-bold text-fg-neutral";
const SHEET_TITLE_WITH_CLOSE = "pr-x10";
const SHEET_BODY = "min-h-0 flex-1 overflow-y-auto overscroll-contain px-global-gutter";
// 끝 흐림이 없는 본문(scrollFog 아님) — 끝이면 아래 16
const SHEET_BODY_PLAIN = "last:pb-x4";
const SHEET_FOOTER = "flex shrink-0 gap-x2 px-global-gutter pb-x4 pt-x3 [&>*]:min-w-0 [&>*]:flex-1";

// ── popover.tsx 의 상수 · JSX 에 적힌 클래스 — 1280 이상 팝오버 ───────────────

// 표면 — 폭 320 ~ 480(가용 폭까지) · 높이 600(가용 높이까지), 모서리 20 · 그림자 s3 · z 200.
// 열림 150ms enter 로 트리거 쪽 변에서 0.95 → 1 · 투명도, 닫힘 100ms exit 로 0.95 · 투명도(모션 줄이기면 투명도만)
const POP_CONTENT = [
  "relative z-(--z-floating) flex flex-col overflow-hidden rounded-r5 bg-bg-layer-floating font-sans text-fg-neutral shadow-[var(--shadow-s3)] outline-none",
  // 가용 폭 · 높이는 Radix 가 자리를 잰 뒤에 들어온다 — 그 전에는 320 · 480 · 600 으로 둔다
  "min-w-[min(320px,var(--radix-popover-content-available-width,320px))] max-w-[min(480px,var(--radix-popover-content-available-width,480px))]",
  "max-h-[min(600px,var(--radix-popover-content-available-height,600px))]",
  "origin-[var(--radix-popover-content-transform-origin)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-[var(--motion-duration-d3)] data-[state=open]:ease-[var(--motion-ease-enter)] motion-safe:data-[state=open]:zoom-in-95",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-[var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)] motion-safe:data-[state=closed]:zoom-out-95",
].join(" ");

// 본문 — Dialog 의 본문과 같다(좌우 24 · 머리가 없으면 위 24 · 끝이면 아래 24). 끝 흐림(scrollFog — BODY_FOG)은 이 파일의 패널이
// 쓰지 않아 BODY_PLAIN 만 옮겼다. 위로 스크롤되면 머리 아래 1px 선은 머리(HEADER)가 긋는다 — 이 패널에는 머리가 없다
const POP_BODY = [
  "min-h-0 flex-1 overflow-y-auto overscroll-contain px-x6 first:pt-x6",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
const POP_BODY_PLAIN = "last:pb-x6";

// 바닥 — 위 16 · 좌우 24 · 아래 24, 오른쪽 정렬, 사이 8. 버튼은 small 36
const POP_FOOTER = "flex shrink-0 items-center justify-end gap-x2 px-x6 pb-x6 pt-x4";

// ── input-button.tsx 의 cva · 클래스와 같은 값 — 고르는 패널을 여는 칸 ────────

// 상자의 크기(inputButtonVariants) — 이 파일은 medium(1280 이상 데스크톱 웹 — 팝오버가 열리는 폭)만 쓴다
const IB_SIZE_BASE = "font-sans";
const IB_SIZE_VARIANTS = {
  size: {
    large: "min-h-13 gap-x2_5 rounded-r3 px-x4 text-t5 [--input-button-icon:20px] [--input-button-clear:22px]",
    medium: "min-h-10 gap-x2 rounded-r2 px-x3_5 text-t4 [--input-button-icon:16px] [--input-button-clear:18px]",
    responsive: [
      "min-h-13 gap-x2_5 rounded-r3 px-x4 text-t5 [--input-button-icon:20px] [--input-button-clear:22px]",
      "lg:min-h-10 lg:gap-x2 lg:rounded-r2 lg:px-x3_5 lg:text-t4 lg:[--input-button-icon:16px] lg:[--input-button-clear:18px]",
    ].join(" "),
  },
};
const IB_SIZE_DEFAULTS = { size: "responsive" };

// 상자의 겉모습(inputButtonSurfaceVariants) — 버튼에 단다
const IB_SURFACE_BASE = [
  "bg-transparent shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)]",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-2 after:border-solid after:border-transparent after:content-['']",
  "after:[transition:border-color_var(--motion-duration-d2)_var(--motion-ease-easing)]",
].join(" ");
const IB_SURFACE_VARIANTS = {
  state: {
    enabled: "cursor-pointer active:bg-bg-layer-default-pressed",
    disabled: "cursor-not-allowed bg-bg-disabled",
    readonly: "cursor-default bg-bg-disabled",
  },
  hover: { self: "", group: "" },
  invalid: { true: "after:border-stroke-critical-solid", false: "" },
};
const IB_SURFACE_COMPOUND = [
  { state: "enabled", hover: "self", className: "hover:bg-bg-layer-default-pressed" },
  { state: "enabled", hover: "group", className: "group-hover/input-button:bg-bg-layer-default-pressed" },
];
const IB_SURFACE_DEFAULTS = { state: "enabled", hover: "self", invalid: false };

// 상자(div) — cn(IB_ROOT, inputButtonVariants({ size })) · 배경 층 버튼 — cn(IB_BUTTON, inputButtonSurfaceVariants({ state, hover: "group", invalid }))
const IB_ROOT = "group/input-button relative isolate flex w-full min-w-0 items-center";
const IB_BUTTON = "peer/input-button absolute inset-0 m-0 appearance-none rounded-[inherit] border-0 p-0";
// 콘텐츠 층 — 누름을 지나 보내고, 버튼(peer)을 누르는 동안만 준다. 레시피는 cn(IB_CONTENT, 누를 수 있으면 IB_CONTENT_PRESS)
const IB_CONTENT =
  "relative flex min-w-0 flex-1 select-none items-center gap-[inherit] pointer-events-none [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const IB_CONTENT_PRESS = "peer-active/input-button:[scale:calc(1-2/var(--press-basis))] motion-reduce:peer-active/input-button:[scale:1]";
// 뒤 아이콘 — cn(IB_ICON, 아이콘 색) · 값 — cn(IB_VALUE, 값 색)
const IB_ICON = "flex shrink-0 [&>svg]:size-[var(--input-button-icon)]";
const IB_VALUE = "min-w-0 flex-1 truncate text-left";
const IB_ICON_COLOR = "text-fg-neutral-muted";
const IB_VALUE_COLOR = "text-fg-neutral";

// ── field.tsx 의 클래스 — 칸을 감싸는 둘레(라벨만) ──────────────────────────

const FIELD_ROOT = "flex w-full min-w-0 flex-col gap-x2";
const FIELD_HEADER = "flex items-center justify-between gap-x2_5 px-x0_5";
// 라벨 — cn("min-w-0 font-sans text-t5 text-fg-neutral", 굵기)
const FIELD_LABEL = "min-w-0 font-sans text-t5 text-fg-neutral";
const FIELD_LABEL_WEIGHT = { medium: "font-medium", bold: "font-bold" };

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순) → className. 고르지 않은 축은 기본값을 쓴다.
// 참 · 거짓 축(bleed · invalid)은 cva 처럼 "true" · "false" 글자 키로 찾는다
const variantKey = (v) => (typeof v === "boolean" ? String(v) : v);

function cvaOf(base, { variants = {}, compoundVariants = [], defaultVariants = {} } = {}) {
  return (props = {}) => {
    const p = { ...defaultVariants };
    for (const [k, v] of Object.entries(props)) if (v !== undefined && k !== "className") p[k] = v;
    const parts = [base];
    for (const [axis, map] of Object.entries(variants)) parts.push(map[variantKey(p[axis])]);
    for (const { class: cls, className, ...when } of compoundVariants) {
      const hit = Object.entries(when).every(([k, v]) => (Array.isArray(v) ? v.includes(p[k]) : p[k] === v));
      if (hit) parts.push(cls, className);
    }
    parts.push(props.className);
    return parts.filter(Boolean).join(" ");
  };
}

const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });
const chipVariants = cvaOf(CHIP_BASE, { variants: CHIP_VARIANTS, compoundVariants: CHIP_COMPOUND, defaultVariants: CHIP_DEFAULTS });
const chipGroupVariants = cvaOf(GROUP_BASE, { variants: GROUP_VARIANTS, compoundVariants: GROUP_COMPOUND, defaultVariants: GROUP_DEFAULTS });
const inputButtonVariants = cvaOf(IB_SIZE_BASE, { variants: IB_SIZE_VARIANTS, defaultVariants: IB_SIZE_DEFAULTS });
const inputButtonSurfaceVariants = cvaOf(IB_SURFACE_BASE, {
  variants: IB_SURFACE_VARIANTS,
  compoundVariants: IB_SURFACE_COMPOUND,
  defaultVariants: IB_SURFACE_DEFAULTS,
});

// "before:bg-bg-neutral-weak" → ["before", "bg-bg-neutral-weak"] — 괄호 안의 ":" 는 가르지 않는다
function splitVariants(cls) {
  const segs = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < cls.length; i++) {
    const c = cls[i];
    if (c === "[" || c === "(") depth++;
    else if (c === "]" || c === ")") depth--;
    else if (c === ":" && depth === 0) {
      segs.push(cls.slice(start, i));
      start = i + 1;
    }
  }
  segs.push(cls.slice(start));
  return segs;
}

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다. 이 파일이 합치는 클래스에 나오는 무리만 안다 —
// 배경 · 글자 굵기 · 커서 · 자리(position) · 최대 폭 · 임의 속성([prop:…])
const GROUPS = [
  [/^bg-/, "bg"],
  [/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/, "font-weight"],
  [/^cursor-/, "cursor"],
  [/^(static|fixed|absolute|relative|sticky)$/, "position"],
  [/^max-w-/, "max-w"],
];

function merge(classList) {
  const seen = new Set();
  const kept = [];
  for (const cls of classList.split(/\s+/).filter(Boolean).reverse()) {
    const segs = splitVariants(cls);
    const utility = segs.pop();
    const prop = /^\[([\w-]+):/.exec(utility);
    const group = prop ? `[${prop[1]}]` : GROUPS.find(([re]) => re.test(utility))?.[1];
    if (group) {
      const key = `${segs.join(":")}|${group}`;
      if (seen.has(key)) continue;
      seen.add(key);
    }
    kept.push(cls);
  }
  return kept.reverse().join(" ");
}

const cn = (...parts) => merge(parts.filter(Boolean).join(" "));
const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기는 감싼 자리의 [&_svg]:size-* 가 정한다. cls 는 레시피가 아이콘에 준 className
const svg = (paths, cls = "") =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${cls ? ` class="${cls}"` : ""}>${paths}</svg>`;
const PATHS = {
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  calendarDays:
    '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/>',
};

// ── 날짜 — 레시피와 같다(그 날의 0시 Date) ─────────────────────────────────

const pad2 = (n) => String(n).padStart(2, "0");
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const compareDay = (a, b) => a.getFullYear() - b.getFullYear() || a.getMonth() - b.getMonth() || a.getDate() - b.getDate();
const sameDay = (a, b) => !!a && !!b && compareDay(a, b) === 0;
const dayKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const weekStart = (d) => addDays(d, -d.getDay());
const weeksInMonth = (y, m) => Math.ceil((new Date(y, m, 1).getDay() + daysInMonth(y, m)) / 7);
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const WEEKDAYS_LONG = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
const monthTitle = (d) => `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
const dayName = (d) => `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAYS_LONG[d.getDay()]}`;
const PRESET_NAMES = { thisWeek: "이번 주", thisMonth: "이번 달", lastMonth: "지난 달", last3Months: "최근 3개월", thisYear: "올해" };
// 오늘 — date-picker.md 빠른 기간 표의 오늘
const TODAY = new Date(2026, 9, 2);
const day = (m, d, y = 2026) => new Date(y, m - 1, d);

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

// <DatePicker> — date-picker.tsx 그대로. uid 는 useId 의 앞말(예제마다 달리한다). value 는 하루(Date) · 기간({ start, end })
//   visibleRange  month(늘 6주) · twoMonths(두 달 나란히) · continuous(이어지는 달 — months 는 보이는 달부터 그릴 달 수)
//   presets · activePreset  빠른 기간 칩 · 고른 칩(값이 그 범위일 때만)
function datePicker({ uid, selection = "single", visibleRange = "month", value, min, max, presets = [], activePreset = null, months = 2, view: viewProp }) {
  const twoMonths = visibleRange === "twoMonths";
  const continuous = visibleRange === "continuous";
  const single = selection === "single" ? value : undefined;
  const rangeStart = selection === "range" ? value?.start : undefined;
  const rangeEnd = selection === "range" && rangeStart ? value?.end : undefined;
  const anchor = selection === "single" ? single : rangeStart;
  const view = viewProp ?? new Date((anchor ?? TODAY).getFullYear(), (anchor ?? TODAY).getMonth(), 1);
  const visible = (d) => {
    const shown = twoMonths ? [view, new Date(view.getFullYear(), view.getMonth() + 1, 1)] : [view];
    return shown.some((m) => m.getFullYear() === d.getFullYear() && m.getMonth() === d.getMonth());
  };
  // Tab 자리 — 보이는 달의 고른 날 → 오늘 → 1일
  const picked = selection === "single" ? (single ? [single] : []) : [rangeStart, rangeEnd].filter(Boolean);
  const focused = picked.find(visible) ?? (visible(TODAY) ? TODAY : view);
  const isDisabled = (d) => (!!min && compareDay(d, min) < 0) || (!!max && compareDay(d, max) > 0);
  const titleId = `${uid}title`;
  const monthLabelId = (d) => `${uid}m${d.getFullYear() * 12 + d.getMonth()}`;
  const multiselectable = selection !== "single";

  const dayButton = (d) => {
    const today = sameDay(d, TODAY);
    const complete = !!rangeStart && !!rangeEnd;
    const isStart = sameDay(d, rangeStart);
    const isEnd = sameDay(d, rangeEnd);
    const inRange = complete && compareDay(d, rangeStart) > 0 && compareDay(d, rangeEnd) < 0;
    const selected = selection === "single" ? sameDay(d, single) : isStart || isEnd;
    const disabled = isDisabled(d);
    const band = complete && !sameDay(rangeStart, rangeEnd) ? (isStart ? "start" : isEnd ? "end" : inRange ? "middle" : null) : null;
    const tone = selected ? "selected" : disabled ? "disabled" : inRange ? "inRange" : today ? "today" : "enabled";
    // 호버 · 누름 — 보통 날은 bg-layer-floating-pressed, 오늘 · 기간 사이 날은 한 단계 짙게. 고른 날 · 막힌 날 · 읽기 전용에는 없다
    const press = tone === "enabled" ? DAY_PRESS : tone === "today" || tone === "inRange" ? DAY_PRESS_ON_WEAK : null;
    const strike = disabled && !(isStart && !complete);
    const cell = attrs([
      'role="gridcell"',
      (selected || inRange) && 'aria-selected="true"',
      band && `data-band="${band}"`,
      `class="${cn(CELL, band && BAND, band && BAND_SIDE[band])}"`,
    ]);
    const button = attrs([
      'type="button"',
      `tabindex="${sameDay(d, focused) ? 0 : -1}"`,
      `aria-label="${dayName(d)}"`,
      today && 'aria-current="date"',
      disabled && 'aria-disabled="true"',
      `data-date="${dayKey(d)}"`,
      today && 'data-today="true"',
      selected && 'data-selected="true"',
      inRange && 'data-in-range="true"',
      disabled && 'data-disabled="true"',
      `class="${cn(DAY, DAY_STATE[tone], press, today && DAY_TODAY_WEIGHT, selected && disabled && "cursor-not-allowed")}"`,
    ]);
    return `<div ${cell}><button ${button}><span data-slot="date-picker-day" class="${strike ? DAY_STRIKE : ""}">${d.getDate()}</span></button></div>`;
  };

  // 요일 줄 — 보이는 "일" 은 숨기고 columnheader 의 이름은 "일요일". 이어지는 달은 이 줄을 sr-only 로 숨긴다
  const weekdayHeader = (hidden) =>
    `<div role="row" class="${hidden ? HIDDEN_WEEKDAYS : WEEKDAY_ROW}">${WEEKDAYS.map((w, i) => `<div role="columnheader" aria-label="${WEEKDAYS_LONG[i]}" class="${WEEKDAY}"><span aria-hidden="true">${w}</span></div>`).join("")}</div>`;

  // 한 달 — fixed 는 늘 6주(앞뒤 달은 흐리게), natural 은 그 달의 주 수(앞뒤 달은 비운다)
  const grid = (month, mode, labelledBy) => {
    const y = month.getFullYear();
    const m = month.getMonth();
    const first = weekStart(new Date(y, m, 1));
    const weeks = mode === "fixed" ? 6 : weeksInMonth(y, m);
    const rows = Array.from({ length: weeks }, (_, w) =>
      `<div role="row" class="${WEEK}">${Array.from({ length: 7 }, (_, i) => {
        const d = addDays(first, w * 7 + i);
        if (d.getMonth() === m) return dayButton(d);
        return `<div role="gridcell" data-outside="" class="${CELL}">${mode === "fixed" ? `<span aria-hidden="true" data-slot="date-picker-outside" class="${OUTSIDE}">${d.getDate()}</span>` : ""}</div>`;
      }).join("")}</div>`,
    ).join("");
    return `<div ${attrs(['role="grid"', `aria-labelledby="${labelledBy}"`, multiselectable && 'aria-multiselectable="true"', `data-month="${y}-${pad2(m + 1)}"`, `class="${GRID}"`])}>${weekdayHeader(mode === "natural")}${rows}</div>`;
  };

  // 이전 · 다음 — Button ghost · medium · 아이콘만(cn(buttonVariants(…), className))
  const navButton = (label, slot, icon, extra) =>
    `<button class="${cn(buttonVariants({ variant: "ghost", size: "medium", layout: "iconOnly", className: cn(NAV_PX, extra) }))}" aria-label="${label}" data-slot="${slot}">${svg(PATHS[icon])}</button>`;
  const prev = (extra) => navButton("이전 달", "date-picker-previous", "chevronLeft", extra);
  const next = (extra) => navButton("다음 달", "date-picker-next", "chevronRight", extra);

  // 빠른 기간 — ChipRadioGroup(cn(chipGroupVariants({ layout, bleed }), PRESETS)) · ChipRadio outlineStrong medium. 고른 칩이 Tab 자리(없으면 첫 칩)
  const layout = continuous ? "scroll" : "wrap";
  const chips = presets
    .map((name, i) => {
      const checked = name === activePreset;
      const tabbable = activePreset ? checked : i === 0;
      return `<button ${attrs([
        'type="button"',
        'role="radio"',
        `aria-checked="${checked}"`,
        `data-state="${checked ? "checked" : "unchecked"}"`,
        `value="${name}"`,
        'data-slot="chip"',
        `class="${chipVariants({ variant: "outlineStrong", size: "medium", layout: "withText" })}"`,
        `tabindex="${tabbable ? 0 : -1}"`,
      ])}>${PRESET_NAMES[name]}</button>`;
    })
    .join("");
  const presetRow = presets.length
    ? `<div role="radiogroup" data-slot="date-picker-presets" class="${cn(chipGroupVariants({ layout, bleed: layout === "scroll" }), PRESETS)}" aria-label="빠른 기간">${
        layout === "scroll"
          ? `<div data-slot="chip-scroll-row" data-scroll-fog="row" class="${SCROLL_ROW}" data-fog-axis="x" style="${fogStyle()} ${SCROLL_FIX}">${chips}</div>`
          : chips
      }</div>`
    : "";

  let body;
  if (continuous) {
    const list = Array.from({ length: months }, (_, k) => {
      const month = new Date(view.getFullYear(), view.getMonth() + k, 1);
      const labelId = monthLabelId(month);
      return `<div data-slot="date-picker-month" class="${CONTINUOUS_MONTH}"><div id="${labelId}" class="${CONTINUOUS_MONTH_NAME}">${monthTitle(month)}</div>${grid(month, "natural", labelId)}</div>`;
    }).join("");
    body = `<div data-slot="date-picker-scroll" class="${CONTINUOUS_SCROLL}"><div aria-hidden="true" class="${CONTINUOUS_WEEKDAYS}">${WEEKDAYS.map((w) => `<div class="${WEEKDAY}">${w}</div>`).join("")}</div>${list}<div aria-hidden="true" data-slot="date-picker-fog" class="${FOG}"></div></div>`;
  } else if (twoMonths) {
    body = `<div class="${TWO_MONTHS}">${[view, new Date(view.getFullYear(), view.getMonth() + 1, 1)]
      .map((month, i) => {
        const labelId = monthLabelId(month);
        return `<div data-slot="date-picker-month" class="${MONTH_COLUMN}"><div class="${TWO_MONTHS_HEADER}"><span id="${labelId}" class="${MONTH_NAME}">${monthTitle(month)}</span>${i === 0 ? prev(NAV_START) : next(NAV_END)}</div>${grid(month, "fixed", labelId)}</div>`;
      })
      .join("")}</div>`;
  } else {
    const title = `<button type="button" id="${titleId}" aria-expanded="false" data-slot="date-picker-title" class="${TITLE}"><span class="${TITLE_TEXT}">${monthTitle(view)}</span>${svg(PATHS.chevronDown, TITLE_ICON)}</button>`;
    body = `<div data-slot="date-picker-header" class="${HEADER}">${title}<div class="${NAV}">${prev()}${next()}</div></div>${grid(view, "fixed", titleId)}`;
  }
  const second = new Date(view.getFullYear(), view.getMonth() + 1, 1);
  const live = twoMonths ? `${monthTitle(view)}~${monthTitle(second)}` : monthTitle(view);
  return `<div role="group" aria-label="날짜 선택" data-slot="date-picker" data-selection="${selection}" data-visible-range="${visibleRange}" class="${cn(ROOT, ROOT_SIZE[visibleRange])}">${presetRow}${body}<span aria-live="polite" aria-atomic="true" data-slot="date-picker-live" class="${LIVE}">${live}</span></div>`;
}

// 다른 예제(popover-examples.mjs 의 고르는 패널)도 이 달력 그림을 쓴다 — 레시피와 같은 DOM · 클래스를 한 곳에서 만든다
export const datePickerHtml = datePicker;

// <Button> — button.tsx 그대로. 바닥이 크기를 넣는다(시트 large · 팝오버 small). type 은 코드가 넘길 때만 붙는다
const button = ({ variant = "neutralSolid", size, label, disabled = false }) =>
  `<button ${attrs([`class="${cn(buttonVariants({ variant, size }))}"`, disabled && "disabled"])}>${esc(label)}</button>`;

// 사이트의 `* { scrollbar-width: thin }` 은 층 밖 규칙이라 스크롤 칸의 [scrollbar-width:none] 을 이긴다 — 스크롤 칸에 style 로 한 번 더 숨긴다(미리보기용 덧칠)
const SCROLL_FIX = "scrollbar-width:none;";

// 빠른 기간 줄의 끝 흐림 — chip.tsx 의 ChipScrollRow 가 거는 useScrollFog(scroll-fog.tsx · row 좌우 20)와 같은 셈. 레시피는 그릴 때
// 토큰 --gradient-fade-mask 를 읽어 방향을 붙인다 — 정적 HTML 은 빌드 때 DESIGN.md 의 토큰 값으로 style 에 적는다(chip-examples.mjs 와 같다)
const FADE_MASK = /`gradient-fade-mask` \| `(linear-gradient\([^`]+\))`/.exec(readFileSync(new URL("../../../DESIGN.md", import.meta.url), "utf8"))[1];
const SOLID = "linear-gradient(#000, #000)";
const withDirection = (token, direction) => token.replace(/^linear-gradient\(/, `linear-gradient(${direction}, `);
// 겹친 층을 곱한다 — scroll-fog.tsx 의 COMPOSITE 와 같은 값(-webkit- 쪽은 옛 이름 source-in)
const COMPOSITE = { "mask-composite": "intersect", "-webkit-mask-composite": "source-in" };
// 좌우 20 — 흐린 쪽마다 칸 전체 크기의 층 하나(단계는 그 쪽 깊이의 몫 — 깊이 안에서 불투명에 닿는다), 두 층을 곱한다.
// 칸의 style 에 mask-* 와 -webkit-mask-* 를 같이 넣는다
function fogStyle(start = "20px", end = "20px") {
  const layer = (depth, direction) =>
    parseFloat(depth) > 0 ? withDirection(FADE_MASK.replace(/(\d+(?:\.\d+)?)%/g, (_m, p) => `calc(${depth} * ${Number(p) / 100})`), direction) : SOLID;
  const mask = {
    image: `${layer(start, "to right")}, ${layer(end, "to left")}`,
    size: "100% 100%, 100% 100%",
    position: "0 0, 0 0",
    repeat: "no-repeat",
  };
  return [
    ...["image", "size", "position", "repeat"].map((p) => `mask-${p}:${mask[p]}; -webkit-mask-${p}:${mask[p]};`),
    ...Object.entries(COMPOSITE).map(([p, v]) => `${p}:${v};`),
  ].join(" ");
}

// 미리보기 틀 — 레시피의 딤 · 시트 · 팝오버는 화면(fixed)에 뜬다. transform 이 fixed 의 기준을 틀로 바꾸고 isolation 이 z-index 를 틀 안에 가둔다.
// phone 은 휴대폰(360 — 시트는 1280 미만), desktop 은 데스크톱 화면(팝오버는 1280 이상)이다. minWidth 는 두 달 팝오버(744)를 다 보이는 폭
const STAGE = ({ height, phone = false, minWidth = 0 }) =>
  `position:relative; isolation:isolate; transform:translateZ(0); overflow:hidden; width:100%;${phone ? " max-width:360px; margin:0 auto;" : ""}${minWidth ? ` min-width:${minWidth}px;` : ""} height:${height}px; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:${phone ? "var(--color-bg-layer-default)" : "var(--color-bg-layer-basement)"}; font-family:var(--font-sans);`;
// 시트 높이 상한(90dvh) · 이어지는 달의 시트 높이(h-[90dvh])를 틀 높이로 — 레시피에는 없는 미리보기용 덧칠
const SHEET_FIT = (height, full) => `max-height:${Math.round(height * 0.9)}px;${full ? ` height:${Math.round(height * 0.9)}px;` : ""}`;
const PAGE_TITLE = "font-size:var(--text-t7); line-height:var(--text-t7--line-height); font-weight:700; color:var(--color-fg-neutral);";
// 뒤 화면 — 제목과 줄(미리보기 그림). 시트가 열린 동안 보조 기술에는 숨는다
const PAGE_ROW =
  "display:flex; justify-content:space-between; gap:var(--spacing-x3); padding:var(--spacing-x3) 0; font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const page = (title, rows) =>
  `<div aria-hidden="true" style="padding:var(--spacing-x6);"><div style="${PAGE_TITLE} margin-bottom:var(--spacing-x2);">${esc(title)}</div>${rows
    .map(([a, b]) => `<div style="${PAGE_ROW}"><span>${esc(a)}</span><span style="color:var(--color-fg-neutral-subtle);">${esc(b)}</span></div>`)
    .join("")}</div>`;

// <BottomSheet open> + <BottomSheetContent title>(닫기 버튼 있음) — 본문 · 바닥은 HTML. full 은 이어지는 달처럼 시트를 90% 높이로 둔다(className="h-[90dvh]")
function bottomSheet({ uid, title, body, footer, height, full = false, pageHtml }) {
  const titleId = `${uid}-title`;
  const content = attrs([
    'role="dialog"',
    `id="${uid}"`,
    `aria-labelledby="${titleId}"`,
    'data-state="open"',
    'tabindex="-1"',
    'data-vaul-drawer=""',
    'data-vaul-drawer-direction="bottom"',
    'data-vaul-snap-points="false"',
    'data-slot="bottom-sheet-content"',
    'aria-modal="true"',
    `class="${full ? cn(SHEET_CONTENT, "h-[90dvh]") : SHEET_CONTENT}"`,
    `style="${SHEET_FIT(height, full)}"`,
  ]);
  const header = `<div data-slot="bottom-sheet-header" class="${SHEET_HEADER}"><h2 id="${titleId}" data-slot="bottom-sheet-title" class="${SHEET_TITLE} ${SHEET_TITLE_WITH_CLOSE}">${esc(title)}</h2></div>`;
  const close = `<button type="button" aria-label="닫기" data-slot="bottom-sheet-close" class="${SHEET_CLOSE}">${svg(PATHS.x)}</button>`;
  const overlay = `<div data-vaul-overlay="" data-vaul-snap-points="false" data-state="open" data-slot="bottom-sheet-overlay" class="${SHEET_OVERLAY}"></div>`;
  return `<div style="${STAGE({ height, phone: true })}">${pageHtml}${overlay}<div ${content}>${header}${close}<div data-slot="bottom-sheet-body" class="${SHEET_BODY} ${SHEET_BODY_PLAIN}">${body}</div><div data-slot="bottom-sheet-footer" class="${SHEET_FOOTER}">${footer.join("")}</div></div></div>`;
}

// <Field label> + <InputButton size="medium" suffixIcon={<CalendarDays />}> — 팝오버를 연 칸. PopoverTrigger asChild 가 버튼에 Radix 의 속성과
// data-slot 을 얹는다(InputButton 은 data-slot 뒤에 받은 속성을 펼쳐 버튼의 data-slot 이 "popover-trigger" 가 된다)
function pickField({ uid, label, value, contentId }) {
  const labelId = `${uid}-label`;
  const controlId = `${uid}-control`;
  const valueId = `${uid}value`;
  const trigger = attrs([
    'type="button"',
    `class="${IB_BUTTON} ${inputButtonSurfaceVariants({ state: "enabled", hover: "group", invalid: false })}"`,
    'aria-haspopup="dialog"',
    'aria-expanded="true"',
    `aria-controls="${contentId}"`,
    'data-state="open"',
    'data-slot="popover-trigger"',
    `id="${controlId}"`,
    `aria-labelledby="${labelId} ${valueId}"`,
  ]);
  const box = `<div data-slot="input-button" data-size="medium" class="${IB_ROOT} ${inputButtonVariants({ size: "medium" })}"><button ${trigger}></button><span data-slot="input-button-content" class="${IB_CONTENT} ${IB_CONTENT_PRESS}"><span id="${valueId}" aria-hidden="true" data-slot="input-button-value" class="${IB_VALUE} ${IB_VALUE_COLOR}">${esc(value)}</span><span aria-hidden="true" data-slot="input-button-suffix-icon" class="${IB_ICON} ${IB_ICON_COLOR}">${svg(PATHS.calendarDays)}</span></span></div>`;
  return `<div data-slot="field" class="${FIELD_ROOT}"><div data-slot="field-header" class="${FIELD_HEADER}"><label id="${labelId}" for="${controlId}" class="${FIELD_LABEL} ${FIELD_LABEL_WEIGHT.medium}">${esc(label)}</label></div>${box}<span class="sr-only" aria-live="polite"></span></div>`;
}

// <PopoverContent align="start" aria-label>(머리 없음) + 감싼 div(Radix 의 popper 감싸개 — 칸 아래 8 · 왼쪽 맞춤). className 은 두 달 팝오버의 폭
function popoverStage({ uid, title, label, value, body, footer, height, className, minWidth = 0 }) {
  const content = attrs([
    'data-side="bottom"',
    'data-align="start"',
    'role="dialog"',
    `id="${uid}"`,
    'data-state="open"',
    'tabindex="-1"',
    'data-slot="popover-content"',
    `aria-label="${esc(label)}"`,
    `class="${className ? cn(POP_CONTENT, className) : POP_CONTENT}"`,
    // Radix 가 재는 가용 폭 · 높이 — 미리보기는 넉넉히 적었다
    'style="--radix-popover-content-available-width:1000px; --radix-popover-content-available-height:800px;"',
  ]);
  const popover = `<div data-radix-popper-content-wrapper="" style="position:absolute; left:0; top:calc(100% + var(--spacing-x2)); min-width:max-content; z-index:var(--z-floating);"><div ${content}><div data-slot="popover-body" class="${POP_BODY} ${POP_BODY_PLAIN}">${body}</div><div data-slot="popover-footer" class="${POP_FOOTER}">${footer.join("")}</div></div></div>`;
  const field = pickField({ uid: `${uid}-field`, label: title.field, value, contentId: uid });
  const stage = `<div style="${STAGE({ height, minWidth })}"><div style="padding:var(--spacing-x6) var(--spacing-x8);"><div aria-hidden="true" style="${PAGE_TITLE} margin-bottom:var(--spacing-x4);">${esc(title.page)}</div><div style="padding:var(--spacing-x4) var(--spacing-x6) var(--spacing-x6); border-radius:var(--radius-r4); background:var(--color-bg-layer-default);"><div style="position:relative; display:flex; flex-direction:column; align-items:flex-start; max-width:400px;">${field}${popover}</div></div></div></div>`;
  return minWidth ? `<div style="overflow-x:auto; ${SCROLL_FIX}">${stage}</div>` : stage;
}

// 이름표 아래 견본 — 시트 · 팝오버를 세로로 쌓는다
const CAPTION =
  "font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2); min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;
const stack = (items) => `<div style="display:flex; flex-direction:column; gap:var(--spacing-x6);">${items.join("")}</div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

const RANGE_PRESETS = ["thisWeek", "thisMonth", "lastMonth", "last3Months", "thisYear"];

export const datePickerExamples = [
  {
    title: "날짜 하나 — \"완료\" 로 넣는다",
    description:
      "레시피(DatePicker)를 Input Button 이 연 시트 · 팝오버 안에 둔다 — 1280 미만은 아래 시트(제목 \"날짜 선택\" · 위 닫기 · 바닥 \"완료\" large 48), 이상은 칸 아래 8 · 왼쪽 맞춤 팝오버(머리 없이 aria-label · 바닥 \"완료\" small 36)다. 값은 쓰는 쪽이 가진다 — 달력은 고르던 값(draft)을 보이고 \"완료\" 가 칸에 넣는다. 열 때는 칸의 값에서 시작하고(비었으면 오늘이 든 달 — 고른 것처럼 칠하지 않는다) autoFocus 로 고른 날(없으면 오늘)에 초점을 옮긴다. 하루를 고르기 전에는 \"완료\" 가 막힌다. 그림은 15일에서 열어 22일을 고른 순간이라 칸은 아직 15일이다. 달력은 머리(제목 16 / 22 · 700 + 셰브론 20 · 이전 · 다음 Button ghost 40) · 요일 줄 48 · 늘 6주이고, 날짜 칸은 폭 ÷ 7 × 48 · 원 42 · 숫자 16 / 22 · 500 fg-neutral-muted 다. 팝오버 안에서는 336(칸 48 × 7), 시트는 시트 폭 − 좌우 24 다. 오늘은 옅은 원 bg-neutral-weak + 숫자 700, 고른 날은 짙은 원 bg-neutral-inverted, 앞뒤 달은 흐린 숫자(fg-disabled — 누르지 못한다)다.",
    jsx: `import { CalendarDays } from "lucide-react"
import { DatePicker, formatDateValue } from "@/components/ui/date-picker"
import { InputButton, useInputButtonSurface } from "@/components/ui/input-button"

const surface = useInputButtonSurface()
const [draft, setDraft] = React.useState(date)

<InputButton value={formatDateValue(date)} placeholder="날짜 선택" suffixIcon={<CalendarDays />} onClick={() => { setDraft(date); setOpen(true) }} />

// 열면 고른 날(없으면 오늘)로 초점을 옮긴다
<DatePicker selection="single" value={draft} onValueChange={setDraft} autoFocus />
<Button disabled={!draft} onClick={() => { setDate(draft); setOpen(false) }}>완료</Button>`,
    render: () =>
      stack([
        labeled(
          bottomSheet({
            uid: "date-picker-ex-single-sheet",
            title: "날짜 선택",
            height: 640,
            pageHtml: page("일정 추가", [["날짜", "10월 15일 (목)"], ["제목", "팀 회의"]]),
            body: datePicker({ uid: "date-picker-ex-single-sheet-dp", value: day(10, 22) }),
            footer: [button({ size: "large", label: "완료" })],
          }),
          "1280 미만 — BottomSheet · 시트 폭 − 48",
        ),
        labeled(
          popoverStage({
            uid: "date-picker-ex-single-pop",
            title: { page: "일정 추가", field: "날짜" },
            label: "날짜 선택",
            value: "10월 15일 (목)",
            height: 660,
            body: datePicker({ uid: "date-picker-ex-single-pop-dp", value: day(10, 22) }),
            footer: [button({ size: "small", label: "완료" })],
          }),
          "1280 이상 — Popover · 달력 336",
        ),
      ]),
  },

  {
    title: "기간 — 칩 줄 · 이어지는 달 · 두 달",
    description:
      "기간은 칸 하나(\"9월 28일~10월 6일\")를 누르면 한 달력에서 시작과 끝을 고른다 — 첫 탭이 시작, 시작 뒤의 날이 끝이고 사이가 띠(bg-neutral-weak · 원 높이 42)로 이어진다. 시작보다 앞을 누르면 그날이 새 시작, 같은 날을 두 번 누르면 하루짜리 기간, 다 고른 뒤 다시 누르면 새로 시작한다. 1280 미만 시트는 달이 위아래로 이어지고(visibleRange=\"continuous\" — 머리 없이 스크롤, 요일 줄이 위에 붙고, 앞뒤 달은 비우고, 아래 안개 96 · 시트는 BottomSheetContent 에 h-[90dvh]), 1280 이상 팝오버는 두 달을 나란히 둔다(\"twoMonths\" — 336 + 24 + 336, 팝오버는 PopoverContent 에 DATE_PICKER_TWO_MONTHS_POPOVER 를 줘 폭 744 — Popover 최대 480 의 예외). 위에는 빠른 기간 칩 한 줄(ChipRadio outlineStrong medium 36 · 사이 8 · 아래 12 — 시트는 한 줄 가로 스크롤, 팝오버는 줄바꿈)이 있다 — 누르면 그 기간을 칠하고 시작이 든 달로 옮기며, 달력에서 다른 날을 누르면 칩 고름이 풀린다. 이름과 범위는 한 벌이고 달력 단위다(이번 주 = 일 ~ 토 · 최근 3개월 = 이번 달을 넣은 석 달). 기간이 고를 수 있는 범위 · 막힌 날에 걸리는 칩은 막힌다(잘라서 넣지 않는다). 기간 안의 오늘은 원 없이 띠 위의 굵은 숫자이고, 오늘 · 기간 사이 날 위의 호버 원은 한 단계 짙은 bg-neutral-weak-pressed 다. 앞뒤 달 칸에는 띠를 그리지 않는다. 끝을 고르기 전에는 \"완료\" 가 막힌다. 그림의 시트는 \"이번 달\" 을 누른 순간이다.",
    jsx: `// 이어지는 달은 시트 높이를 채운다(시트 h-[90dvh]), 두 달은 팝오버 폭 744 — PopoverContent className={DATE_PICKER_TWO_MONTHS_POPOVER}
<DatePicker
  selection="range"
  visibleRange={surface === "sheet" ? "continuous" : "twoMonths"}
  autoFocus
  presets={["thisWeek", "thisMonth", "lastMonth", "last3Months", "thisYear"]}
  value={draft}
  onValueChange={setDraft}
/>
<Button variant="neutralWeak" onClick={() => setDraft(undefined)}>초기화</Button>
<Button disabled={!draft?.end} onClick={apply}>완료</Button>`,
    render: () =>
      stack([
        labeled(
          bottomSheet({
            uid: "date-picker-ex-range-sheet",
            title: "기간 선택",
            height: 680,
            full: true,
            pageHtml: page("통계", [["기간", "10월 1일~10월 31일"], ["지출", "905,200원"]]),
            body: datePicker({
              uid: "date-picker-ex-range-sheet-dp",
              selection: "range",
              visibleRange: "continuous",
              value: { start: day(10, 1), end: day(10, 31) },
              presets: RANGE_PRESETS,
              activePreset: "thisMonth",
            }),
            footer: [button({ variant: "neutralWeak", size: "large", label: "초기화" }), button({ size: "large", label: "완료" })],
          }),
          "1280 미만 — visibleRange=\"continuous\" · 칩 줄 가로 스크롤",
        ),
        labeled(
          popoverStage({
            uid: "date-picker-ex-range-pop",
            title: { page: "통계", field: "기간" },
            label: "기간 선택",
            value: "9월 28일~10월 6일",
            height: 700,
            minWidth: 880,
            className: DATE_PICKER_TWO_MONTHS_POPOVER,
            body: datePicker({ uid: "date-picker-ex-range-pop-dp", selection: "range", visibleRange: "twoMonths", value: { start: day(9, 28), end: day(10, 6) }, presets: RANGE_PRESETS }),
            footer: [button({ variant: "neutralWeak", size: "small", label: "초기화" }), button({ size: "small", label: "완료" })],
          }),
          "1280 이상 — visibleRange=\"twoMonths\" · 팝오버 744(미리보기 칸보다 넓어 가로로 스크롤한다)",
        ),
      ]),
  },

  {
    title: "고를 수 있는 범위 — 환불일",
    description:
      "자리마다 고를 수 있는 범위가 다르다 — 환불일은 거래일 ~ 오늘(min · max), 할 일 마감은 오늘부터다. 그 밖의 날은 막힌 날로 그린다 — 흐린 숫자(fg-disabled) + 취소선이고, 누르거나 Enter · Space 로 고르지 못하지만 aria-disabled 라 키보드 초점은 간다. 흐림(불투명도)만으로 그리지 않는다. 막힌 날이 기간 안이면 띠는 그대로 깔리고 숫자만 흐린 취소선이다. 그림은 거래일 9월 24일 · 오늘 10월 2일 — 10월 3일부터는 막힌 날이다(앞뒤 달 날짜는 막힌 날이 아니라 흐리게 보이기만 한다).",
    jsx: `<DatePicker selection="single" min={transactionDate} max={today} value={draft} onValueChange={setDraft} />`,
    render: () =>
      `<div style="display:inline-flex; padding:var(--spacing-x6); border-radius:var(--radius-r5); background:var(--color-bg-layer-floating); box-shadow:var(--shadow-s3);"><div style="width:336px;">${datePicker({
        uid: "date-picker-ex-constraints",
        value: day(10, 1),
        min: day(9, 24),
        max: TODAY,
      })}</div></div>`,
  },
];
