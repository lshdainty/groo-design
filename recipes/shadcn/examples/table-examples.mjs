/*
 * shadcn Table 예제 — docs site components/table.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 넷(HR 사용자 표 · 고르기 · 일괄 작업 · 768 미만 — List 줄 · 불러오는 동안 · 비었음 · 실패)은
 * 차례 · 제목 · 코드가 specs/components/table.md 의 "코드" 절과 같고, 뒤의 둘(숫자 열 · 증감 · 두 줄 칸 — 72)은 md 의 숫자 열 · 줄 높이를 코드로 더 보인다.
 * 구조는 SEED 문서 사이트의 표(TableRoot)와 디자인 그림의 데이터 표다(2026-10-08) — 옛 Table(작은 대문자 회색 머리 · 머리 바탕 · 칸 8 ·
 * 금액 고정폭 글꼴)과 DESIGN.md 의 Data Table(v71)을 대신한다. Data Table 예제는 걷었다 — 정렬 · 고르기 · 일괄 작업은 Table 의 부품이다.
 *
 * CELL · HEAD_CELL · HEAD_STICKY · BODY_CELL · BODY_RICH · ALIGN · SORT_BUTTON · ROW · ROW_PRESSABLE · ROW_HEADER_ACTION · HIT_44 는
 * recipes/shadcn/components/ui/table.tsx 의 상수와, TABLE_* · SORT_* · CONTENT_* · SELECT_* · MORE_* · BULK_* · STATUS_CELL · SKELETON_* 는 그 파일의
 * JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 둘레의 부품은 그 레시피의 값을 옮겨 썼다 — CARD_* · DELTA* 는 card.tsx,
 * LIST_* 는 list.tsx, BADGE_* 는 badge.tsx, BUTTON_* 는 button.tsx, CHECKMARK_* · INDICATOR* · CHECK_ICON · MINUS_ICON 은 checkbox.tsx,
 * RESULT_* 는 result-section.tsx, SK_* 는 skeleton.tsx, AVATAR_* 는 avatar.tsx 의 것과 같다 — 이 파일이 쓰는 변형 · 크기와 그에 걸리는 compound 만 옮겼다.
 * 규칙은 specs/components/table.md, 수치 원본은 specs/components/table.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 표 상자 <div data-slot="table" data-row-height>(가로 스크롤) > <div data-slot="table-frame"> > <table>
 * (숨긴 <caption>) · 숨긴 상태 글 <span role="status" data-slot="table-status">. 머리 칸 <th scope="col" data-slot="table-head" data-align aria-sort>
 * (정렬할 수 있는 열은 칸 전체가 <button data-slot="table-sort-button"> — 글 + ↑↓ <svg data-slot="table-sort-icon"> 의 두 화살표를 따로 칠한다),
 * 첫 열 <th scope="row" data-slot="table-row-header">(이름 링크 <a data-slot="table-row-link">), 칸 <td data-slot="table-cell">.
 * 레시피가 cn() 으로 합치는 자리는 merge() 로 똑같이 합친다 — 같은 속성을 다시 쓴 클래스는 뒤의 것만 남는다(정렬 머리의 p-0 이 칸 여백을 지운다).
 * 표는 카드 안에 가장자리까지 붙는다 — 미리보기는 회색 바닥 위 목록 카드(머리 "사용자" · 줄이 가장자리까지)에 표를 놓는다.
 * ⋮ 의 메뉴(ResponsiveMenuContent — 1280 이상 Menu · 미만 Menu Sheet)는 menu.tsx 가 그리고 그 모습은 Menu 예제에 있어 닫힌 ⋮ 만 그린다.
 * 레시피의 스크립트(정렬 · 알림 · 줄 누르기 · 고르기 · 선택 해제 뒤 초점)는 정적 HTML 에 없다 — 그림은 그 순간을 멈춘 것이다. 링크는 # 이다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── table.tsx 의 상수와 같은 값 ─────────────────────────────────────

const CELL = [
  "border-b border-solid border-stroke-neutral-subtle px-x4 align-middle font-sans text-t4 leading-[1.25rem] text-fg-neutral",
  "first:pl-x6 last:pr-x6",
].join(" ");
const HEAD_CELL = "py-x2_5 font-medium whitespace-nowrap";
const HEAD_STICKY = "sticky top-0 z-[1] bg-bg-layer-default";
const BODY_CELL = "py-x3 font-normal [&>*]:align-top";
const BODY_RICH = "h-[72px] py-0";
const ALIGN = {
  start: "text-start",
  end: "text-end tabular-nums",
};
const SORT_BUTTON = [
  "relative flex w-full cursor-pointer items-center gap-x1_5 border-0 bg-transparent px-x4 py-x2_5 font-[inherit] text-[length:inherit] leading-[inherit] text-fg-neutral",
  "[th:first-child>&]:pl-x6 [th:last-child>&]:pr-x6",
  "before:absolute before:inset-x-0 before:-inset-y-0.5 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
const ROW = "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]";
const ROW_PRESSABLE = "cursor-pointer hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed";
const ROW_HEADER_ACTION = [
  "-mx-x1 -my-x0_5 inline-block cursor-pointer rounded-r1 align-top border-0 bg-transparent px-x1 py-x0_5 text-start font-[inherit] text-[length:inherit] leading-[inherit] text-fg-neutral no-underline",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
const HIT_44 = "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']";

// ── table.tsx 의 JSX 에 적힌 클래스 ─────────────────────────────────

const TABLE_BOX = "relative w-full overflow-x-auto";
const TABLE_FRAME = "w-fit min-w-full";
const TABLE_EL = "w-full border-separate border-spacing-0 font-sans text-t4 text-fg-neutral";
const SR_ONLY = "sr-only";
const SORT_ALIGN = { end: "justify-end text-end", start: "justify-start text-start" };
const SORTABLE_HEAD = "p-0 first:pl-0 last:pr-0";
const SORT_ICON = "size-4 shrink-0";
const SORT_ARROW = { on: "stroke-fg-neutral", off: "stroke-fg-neutral-muted" };
const CONTENT_ROOT = "flex items-center gap-x3";
const CONTENT_MEDIA = "flex shrink-0";
const CONTENT_TEXT = "flex min-w-0 flex-col gap-x0_5";
const CONTENT_DETAIL = "text-t3 text-fg-neutral-subtle";
const SELECT_HEAD = "w-16 py-x2";
const SELECT_CELL = "w-16 py-x2_5";
const CELL_WRAP = "flex items-center";
const MORE_HEAD = "w-20";
const MORE_CELL = "w-20 py-x0_5";
const MORE_BUTTON = "focus-visible:-outline-offset-2";
const BULK_BAR = "mb-x2 flex min-h-12 items-center gap-x2 rounded-r3 bg-bg-brand-weak pl-x4 pr-x2 font-sans";
const BULK_COUNT = "text-t4 font-medium text-fg-neutral";
const BULK_ACTIONS = "ml-auto flex items-center gap-x2";
const STATUS_CELL = "border-b border-solid border-stroke-neutral-subtle px-x6 py-0";
const SKELETON_ROW = "h-[45px]";
const SKELETON_END = "ml-auto";

// ── card.tsx 의 상수 · JSX 클래스와 같은 값 — 표를 담는 목록 카드 · 증감 ─────────

const CARD_ROOT = "relative isolate block overflow-hidden rounded-r4 text-start font-sans text-fg-neutral no-underline";
const CARD_VARIANT = {
  default: "border border-solid border-stroke-neutral-weak bg-bg-layer-default",
  // 그라디언트 끝은 모드마다 다른 단계 — 다크에서 brand-900 은 밝은 #7AA9F6 이라 쓰지 않는다
  hero: [
    "border-0 text-static-white",
    "bg-[linear-gradient(135deg,var(--color-bg-brand-solid),var(--color-brand-900))]",
    "dark:bg-[linear-gradient(135deg,var(--color-bg-brand-solid),var(--color-brand-300-dark))]",
  ].join(" "),
};
const CARD_BODY = {
  content: "p-x6",
  // 좌우 · 위 0 — 머리가 위 24 · 좌우 24 를 갖고, 줄이 제 좌우 24 · 위아래 12 를 가진다. 아래 12 + 마지막 줄 12 = 보이는 24.
  // 머리가 없으면 위도 12 — 첫 줄 12 와 합쳐 보이는 24(위 · 아래 같게)
  list: "pb-x3 [&:not(:has(>[data-slot=card-header]))]:pt-x3",
};
const DELTA_TONE = {
  up: "text-fg-critical",
  down: "text-fg-informative",
  flat: "text-fg-neutral-subtle",
};
const ARROW = { up: "▲", down: "▼", flat: null };
const CARD_HEADER = "flex items-center justify-between gap-x2";
const CARD_HEADER_LIST = "px-x6 pb-x1 pt-x6";
const CARD_TITLE = "min-w-0 font-sans text-t5 font-bold text-fg-neutral";
const DELTA = "inline-flex flex-wrap items-baseline gap-x1 font-sans text-t3";
const DELTA_VALUE = "font-medium tabular-nums";

// ── list.tsx 의 cva 와 같은 값 — 768 미만의 List 줄 ───────────────────

const LIST_BASE = "flex w-full flex-col";
const LIST_ITEM_BASE = "group/list-item relative flex w-full before:pointer-events-none before:absolute before:inset-y-0 before:inset-x-0 before:rounded-none before:bg-transparent before:content-[''] before:[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),inset_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-radius_var(--motion-duration-color-transition)_var(--motion-ease-easing)] [@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:inset-x-x1_5 [@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:rounded-[var(--list-item-radius,var(--radius-r2_5))] [@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:bg-bg-layer-default-pressed has-[[data-list-action]:not([data-disabled]):active]:before:inset-x-x1_5 has-[[data-list-action]:not([data-disabled]):active]:before:rounded-[var(--list-item-radius,var(--radius-r2_5))] has-[[data-list-action]:not([data-disabled]):active]:before:bg-bg-layer-default-pressed";
const LIST_ITEM_VARIANTS = {
  highlight: {
    none: "",
    highlighted: "before:bg-bg-brand-weak [@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:bg-bg-brand-weak-pressed has-[[data-list-action]:not([data-disabled]):active]:before:bg-bg-brand-weak-pressed",
  },
};
const LIST_ITEM_DEFAULTS = { highlight: "none" };
const LIST_CONTENT_BASE = "relative flex w-full py-x3 [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] group-has-[[data-list-action]:not([data-disabled]):active]/list-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-has-[[data-list-action]:not([data-disabled]):active]/list-item:[scale:1]";
const LIST_CONTENT_VARIANTS = { align: { center: "items-center", top: "items-start" }, nest: { none: "px-global-gutter", parent: "pl-x1 pr-global-gutter", child: "pl-[104px] pr-global-gutter" } };
const LIST_CONTENT_DEFAULTS = { align: "center", nest: "none" };
const LIST_PREFIX_BASE = "flex shrink-0 items-center pr-x3 text-fg-neutral [&>svg]:size-[22px]";
const LIST_PREFIX_VARIANTS = {
  disabled: {
    true: "text-fg-disabled [&_[data-list-tile]]:bg-bg-disabled [&_[data-list-tile]]:text-fg-disabled",
    false: "",
  },
};
const LIST_PREFIX_DEFAULTS = { disabled: false };
const LIST_BODY_BASE = "flex min-w-[calc(var(--text-t5)+var(--spacing-x2_5))] flex-1 flex-col items-start gap-x0_5 pr-x2_5 text-left";
const LIST_TITLE_BASE = "font-sans text-t5 font-normal text-fg-neutral [overflow-wrap:anywhere]";
const LIST_TITLE_VARIANTS = { disabled: { true: "text-fg-disabled", false: "" } };
const LIST_TITLE_DEFAULTS = { disabled: false };
const LIST_DETAIL_BASE = "font-sans text-t3 text-fg-neutral-subtle [overflow-wrap:anywhere]";
const LIST_DETAIL_VARIANTS = {
  disabled: { true: "text-fg-disabled", false: "" },
  highlighted: {
    true: "[@media(hover:hover)]:group-has-[[data-list-action]:not([data-disabled]):hover]/list-item:text-fg-neutral-muted group-has-[[data-list-action]:not([data-disabled]):active]/list-item:text-fg-neutral-muted",
    false: "",
  },
};
const LIST_DETAIL_DEFAULTS = { disabled: false, highlighted: false };
const LIST_SUFFIX_BASE = "flex items-center gap-x1 font-sans text-t5 text-fg-neutral-subtle [&>svg]:size-[18px] [&_a]:relative [&_a]:z-[1] [&_button]:relative [&_button]:z-[1]";
const LIST_SUFFIX_VARIANTS = {
  value: { node: "shrink-0", text: "min-w-0 shrink [overflow-wrap:anywhere]" },
  disabled: { true: "text-fg-disabled", false: "" },
  highlighted: {
    true: "[@media(hover:hover)]:group-has-[[data-list-action]:not([data-disabled]):hover]/list-item:text-fg-neutral-muted group-has-[[data-list-action]:not([data-disabled]):active]/list-item:text-fg-neutral-muted",
    false: "",
  },
};
const LIST_SUFFIX_COMPOUND = [
  { disabled: false, highlighted: true, class: "[&>svg]:text-fg-neutral-subtle" },
];
const LIST_SUFFIX_DEFAULTS = { value: "node", disabled: false, highlighted: false };
const LIST_ACTION_BASE = "cursor-pointer appearance-none border-0 bg-transparent p-0 font-[inherit] text-[inherit] no-underline outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-stroke-focus-ring data-[disabled]:cursor-not-allowed";
const LIST_TILE_BASE = "inline-grid size-10 shrink-0 place-items-center rounded-r3 [&>svg]:size-5";

// ── badge.tsx 의 cva 와 같은 값 — 상태 칸(weak · medium) ─────────────

const BADGE_BASE = "inline-flex min-w-0 cursor-default items-center gap-x0_5 overflow-hidden whitespace-nowrap font-sans";
const BADGE_VARIANTS = {
  variant: { weak: "font-medium" },
  tone: { neutral: "", informative: "", positive: "", warning: "", critical: "" },
  size: { medium: "min-h-x5 rounded-r1 px-x1_5 py-x0_5 text-t1" },
};
const BADGE_COMPOUND = [
  { variant: "weak", tone: "neutral", className: "bg-bg-neutral-weak text-fg-neutral-muted" },
  { variant: "weak", tone: "informative", className: "bg-bg-informative-weak text-fg-informative-contrast" },
  { variant: "weak", tone: "positive", className: "bg-bg-positive-weak text-fg-positive-contrast" },
  { variant: "weak", tone: "warning", className: "bg-bg-warning-weak text-fg-warning-contrast" },
  { variant: "weak", tone: "critical", className: "bg-bg-critical-weak text-fg-critical-contrast" },
];
const BADGE_DEFAULTS = { variant: "weak", tone: "neutral", size: "medium" };
const BADGE_LABEL = "min-w-0 truncate";

// ── button.tsx 의 cva 와 같은 값 — ⋮ · 일괄 작업 · 결과의 버튼 ─────────────

const BUTTON_BASE = "relative inline-flex items-center justify-center whitespace-nowrap font-sans font-bold before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring disabled:cursor-not-allowed disabled:[scale:1] disabled:bg-bg-disabled disabled:text-fg-disabled aria-busy:cursor-progress aria-busy:text-transparent aria-busy:[&>svg:not([data-slot=progress-circle])]:invisible aria-busy:active:[scale:1] [--progress-thickness:2px] [&_svg]:pointer-events-none [&_svg]:shrink-0";
const BUTTON_VARIANTS = {
  variant: {
    neutralWeak: "bg-bg-neutral-weak text-fg-neutral hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed aria-busy:bg-bg-neutral-weak-pressed [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
    ghost: "bg-transparent text-fg-neutral hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed aria-busy:bg-bg-layer-default-pressed disabled:bg-transparent [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
  },
  size: {
    small: "h-9 rounded-r2 [--press-basis:36] [--progress-size:14px]",
    medium: "h-10 rounded-r2 [--press-basis:40] [--progress-size:16px]",
  },
  layout: { withText: "", iconOnly: "" },
  ghostColor: { neutral: "", critical: "" },
};
const BUTTON_COMPOUND = [
  { size: "small", layout: "withText", className: "px-x3_5 py-x2 gap-x1 text-t4 [&_svg]:size-3.5" },
  { size: "medium", layout: "withText", className: "px-x4 py-x2_5 gap-x1_5 text-t4 [&_svg]:size-4" },
  { size: "small", layout: "iconOnly", className: "w-9 p-x2 [&_svg]:size-4" },
  { size: "medium", layout: "iconOnly", className: "w-10 p-x2_5 [&_svg]:size-[18px]" },
  { variant: "ghost", ghostColor: "critical", className: "text-fg-critical" },
];
const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// ── checkbox.tsx 의 cva · JSX 클래스와 같은 값 — 선택 칸(large · square · neutral) ──

const CHECKMARK_BASE = "peer group/checkmark relative inline-grid shrink-0 cursor-pointer place-items-center rounded-r1 [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] active:[scale:calc(1-2/var(--press-basis))] group-active/checkbox:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1] motion-reduce:group-active/checkbox:[scale:1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring disabled:cursor-not-allowed disabled:[scale:1] [&_svg]:pointer-events-none";
const CHECKMARK_VARIANTS = {
  size: { large: "size-6 [--press-basis:24]" },
  shape: {
    square: "border border-stroke-neutral-solid bg-transparent hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed group-hover/checkbox:bg-bg-layer-default-pressed group-active/checkbox:bg-bg-layer-default-pressed data-[state=checked]:border-0 data-[state=indeterminate]:border-0 disabled:border-stroke-neutral-weak disabled:bg-bg-disabled data-[state=checked]:disabled:bg-bg-disabled data-[state=checked]:disabled:text-fg-disabled data-[state=indeterminate]:disabled:bg-bg-disabled data-[state=indeterminate]:disabled:text-fg-disabled",
  },
  tone: { neutral: "" },
};
const CHECKMARK_COMPOUND = [
  { size: "large", shape: "square", className: "[&_svg]:size-3.5" },
  {
    shape: "square",
    tone: "neutral",
    className: "data-[state=checked]:bg-bg-neutral-inverted data-[state=checked]:text-fg-neutral-inverted data-[state=indeterminate]:bg-bg-neutral-inverted data-[state=indeterminate]:text-fg-neutral-inverted data-[state=checked]:hover:bg-bg-neutral-inverted-pressed data-[state=checked]:active:bg-bg-neutral-inverted-pressed data-[state=checked]:group-hover/checkbox:bg-bg-neutral-inverted-pressed data-[state=checked]:group-active/checkbox:bg-bg-neutral-inverted-pressed data-[state=indeterminate]:hover:bg-bg-neutral-inverted-pressed data-[state=indeterminate]:active:bg-bg-neutral-inverted-pressed data-[state=indeterminate]:group-hover/checkbox:bg-bg-neutral-inverted-pressed data-[state=indeterminate]:group-active/checkbox:bg-bg-neutral-inverted-pressed",
  },
];
const CHECKMARK_DEFAULTS = { size: "medium", shape: "square", tone: "neutral" };
const INDICATOR = "grid place-items-center";
const INDICATOR_HIDDEN = "data-[state=unchecked]:invisible";
const CHECK_ICON = "group-data-[state=indeterminate]/checkmark:hidden";
const MINUS_ICON = "hidden group-data-[state=indeterminate]/checkmark:block";

// ── result-section.tsx 의 상수와 같은 값 — 비었음 · 실패 ─────────────────

const RESULT_BASE = "flex grow flex-col items-center justify-center px-x12 py-x4 text-center font-sans transition-none [[data-slot=card]_&]:px-0 [[data-slot=card][data-body=list]>&]:px-x6 [[data-slot=card][data-body=list]>[data-slot=loading-region]>&]:px-x6 animate-in fade-in-0 duration-[var(--motion-duration-d3)] ease-[var(--motion-ease-enter)] motion-reduce:animate-none";
const RESULT_ASSET = "mb-x4 flex shrink-0 [&>svg]:size-10 [&>svg]:[stroke-width:1.5]";
const RESULT_KIND_COLOR = {
  empty: "text-fg-neutral-subtle",
  failure: "text-fg-critical",
  done: "text-fg-positive",
};
const RESULT_SIZES = {
  large: { title: "text-t8", description: "mt-x3 text-t5", actions: "mt-x7" },
  medium: { title: "text-t5", description: "mt-x2 text-t4", actions: "mt-x6" },
};
const RESULT_TITLE = "font-bold text-fg-neutral break-keep [overflow-wrap:break-word]";
const RESULT_DESCRIPTION = "font-normal text-fg-neutral-muted break-keep [overflow-wrap:break-word]";
const RESULT_ACTIONS = "flex flex-col items-center gap-x5";
const RESULT_SECONDARY = "-my-x2";

// ── skeleton.tsx 의 상수와 같은 값 — 불러오는 줄(글 자리 t4) ─────────────

const SK_ROOT = "relative block overflow-hidden bg-bg-neutral-weak";
const SK_RADIUS = { "8": "rounded-r2" };
const SK_TEXT_HEIGHT = { t4: "h-(--text-t4--line-height)" };
const SK_SHIMMER = [
  "pointer-events-none absolute inset-0 [transform:translateX(-100%)]",
  "bg-[image:var(--gradient-shimmer-neutral)] dark:bg-[image:var(--gradient-shimmer-neutral-dark)]",
  "animate-[shimmer_var(--motion-duration-loop)_var(--motion-ease-easing)_infinite]",
  "motion-reduce:animate-none motion-reduce:opacity-0",
].join(" ");

// ── avatar.tsx 의 상수와 같은 값 — 두 줄 칸의 Avatar 42 ─────────────────

const AVATAR_HUES = ["blue", "green", "orange", "violet", "pink", "indigo", "red", "yellow", "brown", "gray"];
const AVATAR_ROOT = [
  "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full align-middle",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-overlay)] after:content-['']",
].join(" ");
const AVATAR_INITIAL = "flex size-full items-center justify-center font-sans font-bold uppercase text-fg-neutral-inverted";
const AVATAR_LINE_HEIGHT_1 = "leading-none";
const AVATAR_HUE_BG = {
  blue: "bg-chart-blue",
  green: "bg-chart-green",
  orange: "bg-chart-orange",
  violet: "bg-chart-violet",
  pink: "bg-chart-pink",
  indigo: "bg-chart-indigo",
  red: "bg-chart-red",
  yellow: "bg-chart-yellow",
  brown: "bg-chart-brown",
  gray: "bg-chart-gray",
};
const AVATAR_SIZES = { 42: { box: "size-[42px]", initial: "text-[17px]" } };

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다.
// 참 · 거짓 축은 cva 처럼 "true" · "false" 글자 키로 찾고, compound 는 값 그대로 견준다(배열이면 그 안에 있는지)
const variantKey = (v) => (typeof v === "boolean" ? String(v) : v);
function cvaOf(base, { variants = {}, compoundVariants = [], defaultVariants = {} } = {}) {
  return (props = {}) => {
    const p = { ...defaultVariants };
    for (const [k, v] of Object.entries(props)) if (v !== undefined) p[k] = v;
    const parts = [base];
    for (const [axis, map] of Object.entries(variants)) parts.push(map[variantKey(p[axis])]);
    for (const { class: cls, className, ...when } of compoundVariants) {
      const hit = Object.entries(when).every(([k, v]) => (Array.isArray(v) ? v.includes(p[k]) : p[k] === v));
      if (hit) parts.push(cls, className);
    }
    return parts.filter(Boolean).join(" ");
  };
}

// "has-[[data-x]:hover]:before:bg-x" → ["has-[…]", "before", "bg-x"] — 괄호 안의 ":" 는 가르지 않는다
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
// 배경 · 글자색 · 글자 크기 · 폭 · 그림자 · 임의 속성([prop:…]). text-t* 는 글자 크기라 글자색과 겹치지 않는다(recipes/shadcn/lib/utils.ts)
const GROUPS = [
  [/^bg-/, "bg"],
  [/^text-(?:fg-|static-)/, "color"],
  [/^text-t\d+$/, "font-size"],
  [/^w-/, "width"],
  [/^shadow-/, "shadow"],
];
// 여백은 면(위 · 오른쪽 · 아래 · 왼쪽)으로 견준다 — 뒤의 p-0 은 앞의 px · py · pl 을 지우고, 뒤의 pl 은 앞의 px 를 지우지 않는다(twMerge 와 같다)
const PAD_SIDES = { p: "trbl", px: "lr", py: "tb", pt: "t", pr: "r", pb: "b", pl: "l", ps: "l", pe: "r" };
function merge(classList) {
  const seen = new Set();
  const padded = new Map();
  const kept = [];
  for (const cls of classList.split(/\s+/).filter(Boolean).reverse()) {
    const segs = splitVariants(cls);
    const utility = segs.pop();
    const pad = /^(p[xytrblse]?)-/.exec(utility);
    if (pad && PAD_SIDES[pad[1]]) {
      const key = segs.join(":");
      const covered = padded.get(key) ?? new Set();
      const sides = [...PAD_SIDES[pad[1]]];
      if (sides.every((s) => covered.has(s))) continue;
      for (const s of sides) covered.add(s);
      padded.set(key, covered);
    }
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

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 와 같은 모양(24 격자) — 크기는 놓인 자리의 [&>svg]:size-* · [&_svg]:size-* 가 정한다(24 는 lucide 기본값)
const svg = (paths, { strokeWidth = 2, cls = "" } = {}) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ""} aria-hidden="true">${paths}</svg>`;
const PATHS = {
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  ellipsisVertical: '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  minus: '<path d="M5 12h14"/>',
  pin: '<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
  pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  coffee: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>',
  utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  bus: '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>',
  shoppingBag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  searchX: '<path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  circleX: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
  circleAlert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  receiptText: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M14 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/>',
  chartPie: '<path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"/><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>',
  usersRound: '<path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>',
};
// ── <List> · <ListButtonItem> — list.tsx 그대로(이 파일이 쓰는 줄만) ─────────────────

const listVariants = cvaOf(LIST_BASE);
const listItemVariants = cvaOf(LIST_ITEM_BASE, { variants: LIST_ITEM_VARIANTS, defaultVariants: LIST_ITEM_DEFAULTS });
const listContentVariants = cvaOf(LIST_CONTENT_BASE, { variants: LIST_CONTENT_VARIANTS, defaultVariants: LIST_CONTENT_DEFAULTS });
const listPrefixVariants = cvaOf(LIST_PREFIX_BASE, { variants: LIST_PREFIX_VARIANTS, defaultVariants: LIST_PREFIX_DEFAULTS });
const listBodyVariants = cvaOf(LIST_BODY_BASE);
const listTitleVariants = cvaOf(LIST_TITLE_BASE, { variants: LIST_TITLE_VARIANTS, defaultVariants: LIST_TITLE_DEFAULTS });
const listDetailVariants = cvaOf(LIST_DETAIL_BASE, { variants: LIST_DETAIL_VARIANTS, defaultVariants: LIST_DETAIL_DEFAULTS });
const listSuffixVariants = cvaOf(LIST_SUFFIX_BASE, { variants: LIST_SUFFIX_VARIANTS, compoundVariants: LIST_SUFFIX_COMPOUND, defaultVariants: LIST_SUFFIX_DEFAULTS });
const listActionVariants = cvaOf(LIST_ACTION_BASE);
const listTileVariants = cvaOf(LIST_TILE_BASE);

// 제목 + 설명(레시피의 Body) — 설명이 없으면 그리지 않는다
const listBody = ({ title, detail }) =>
  `<span class="${merge(listTitleVariants())}">${title}</span>${detail ? `<span class="${merge(listDetailVariants())}">${detail}</span>` : ""}`;
const listPart = (html, cls) => (html ? `<span class="${cls}">${html}</span>` : "");

// <List> — 목록(<ul>). 이름은 aria-label
const listOf = (rows, { ariaLabel } = {}) => `<ul ${attrs([`class="${merge(listVariants())}"`, ariaLabel && `aria-label="${esc(ariaLabel)}"`])}>${rows.join("")}</ul>`;

// <ListButtonItem> — 줄 전체가 버튼(본문 버튼의 ::after 가 줄을 덮는다). 앞 · 뒤 붙이개는 그 옆에
function listButtonItem({ title, detail, prefix, suffix }) {
  const button = attrs(['type="button"', 'data-list-action=""', `class="${merge(`${listActionVariants()} ${listBodyVariants()}`)}"`]);
  const content = `${listPart(prefix, merge(listPrefixVariants()))}<button ${button}>${listBody({ title, detail })}</button>${listPart(suffix, merge(listSuffixVariants()))}`;
  return `<li class="${merge(listItemVariants())}"><div class="${listContentVariants()}">${content}</div></li>`;
}

// <ListTile> — 카테고리 타일 40(모서리 12 · 아이콘 20). 바탕 · 아이콘 색은 부르는 쪽(카테고리 색 — 차트 색의 옅은 바탕 + 그 색 아이콘)
const listTile = (icon, className) => `<span data-list-tile="" class="${merge(`${listTileVariants()} ${className}`)}">${svg(PATHS[icon])}</span>`;
const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });
// <Button> — 글 버튼 · 아이콘 버튼(이름은 aria-label). 고른 변형 · 크기만 옮겼다
const button = ({ text = "", icon = "", label = "", variant, size, layout, ghostColor, className = "", extra = "" }) =>
  `<button ${attrs(['type="button"', label && `aria-label="${esc(label)}"`, extra, `class="${merge(`${buttonVariants({ variant, size, layout, ghostColor })} ${className}`)}"`])}>${icon ? svg(PATHS[icon]) : ""}${esc(text)}</button>`;
const badgeVariants = cvaOf(BADGE_BASE, { variants: BADGE_VARIANTS, compoundVariants: BADGE_COMPOUND, defaultVariants: BADGE_DEFAULTS });
// <Badge> — weak · medium(이 파일이 쓰는 것). 뜻은 톤으로
const badge = (text, tone = "neutral") =>
  `<span data-slot="badge" class="${badgeVariants({ variant: "weak", tone, size: "medium" })}"><span data-slot="badge-label" class="${BADGE_LABEL}">${esc(text)}</span></span>`;
const checkmarkVariants = cvaOf(CHECKMARK_BASE, { variants: CHECKMARK_VARIANTS, compoundVariants: CHECKMARK_COMPOUND, defaultVariants: CHECKMARK_DEFAULTS });
// <Checkmark size="large"> — Radix Checkbox.Root · Indicator(forceMount)가 그리는 모양. state = "unchecked" · "checked" · "indeterminate".
// 표의 체크는 누르는 영역 44 를 className(HIT_44)으로 더한다
function checkmark({ label, state = "unchecked", className = "" }) {
  const radix = `data-state="${state}"`;
  const root = attrs([
    'type="button"',
    'role="checkbox"',
    `aria-checked="${state === "indeterminate" ? "mixed" : state === "checked"}"`,
    radix,
    `aria-label="${esc(label)}"`,
    `class="${merge(`${checkmarkVariants({ size: "large", shape: "square", tone: "neutral" })} ${className}`)}"`,
  ]);
  const icons = svg(PATHS.check, { strokeWidth: 3, cls: CHECK_ICON }) + svg(PATHS.minus, { strokeWidth: 3, cls: MINUS_ICON });
  return `<button ${root}><span ${radix} class="${INDICATOR} ${INDICATOR_HIDDEN}" style="pointer-events:none;">${icons}</span></button>`;
}
// <ResultSection size="medium"> — 아이콘 40(비었음은 쓰는 쪽이 준다 · 실패는 circle-alert) · 제목 · 설명 · 버튼(첫 neutralWeak medium · 둘째 ghost small).
// 보인 뒤의 모습이다(처음 한 프레임 감추기 · 나타남은 정적 HTML 에 없다)
function resultSection({ kind = "empty", size = "medium", icon, title, description, primary, secondary }) {
  const s = RESULT_SIZES[size];
  const shown = icon ?? (kind === "failure" ? "circleAlert" : null);
  const asset = shown ? `<span aria-hidden="true" data-slot="result-section-asset" class="${RESULT_ASSET} ${RESULT_KIND_COLOR[kind]}">${svg(PATHS[shown])}</span>` : "";
  const desc = description ? `<p data-slot="result-section-description" class="${RESULT_DESCRIPTION} ${s.description}">${esc(description)}</p>` : "";
  const actions =
    primary || secondary
      ? `<div data-slot="result-section-actions" class="${RESULT_ACTIONS} ${s.actions}">${primary ? button({ text: primary, variant: "neutralWeak", size: "medium" }) : ""}${secondary ? button({ text: secondary, variant: "ghost", size: "small", className: RESULT_SECONDARY }) : ""}</div>`
      : "";
  return `<div role="status" data-slot="result-section" data-kind="${kind}" data-size="${size}" class="${RESULT_BASE}">${asset}<h2 data-slot="result-section-title" class="${RESULT_TITLE} ${s.title}">${esc(title)}</h2>${desc}${actions}</div>`;
}
// <Skeleton radius text className /> — 늘 aria-hidden, 글 자리 안에도 둘 수 있게 span(블록). 겹치는 클래스가 없어 cn() 은 이어 붙이기와 같다
const skeleton = ({ radius = "8", text, className = "", style = "" } = {}) =>
  `<span data-slot="skeleton" data-radius="${radius}"${text ? ` data-text="${text}"` : ""} class="${[SK_ROOT, SK_RADIUS[radius], text && SK_TEXT_HEIGHT[text], className]
    .filter(Boolean)
    .join(" ")}"${style ? ` style="${style}"` : ""} aria-hidden="true"><span data-slot="skeleton-shimmer" class="${SK_SHIMMER}"></span></span>`;
// <Avatar size={42}> — 이니셜 + 이름 색(그림 없음). 옆에 이름이 있어 장식(aria-hidden). avatarInitial · avatarHue 는 avatar.tsx 의 규칙과 같은 답
const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });
const avatarInitial = (name) => {
  const shown = String(name).trim();
  return shown === "" ? "" : (graphemes.segment(shown)[Symbol.iterator]().next().value?.segment ?? "").toUpperCase();
};
function avatarHue(name) {
  const shown = String(name).trim();
  if (shown === "") return "gray";
  let sum = 0;
  for (const ch of shown) sum += ch.codePointAt(0) ?? 0;
  return AVATAR_HUES[sum % 10] ?? "gray";
}
const avatar = (name, size = 42) =>
  `<span data-slot="avatar" data-status="none" aria-hidden="true" class="${AVATAR_ROOT} ${AVATAR_SIZES[size].box}"><span aria-hidden="true" data-slot="avatar-initial" class="${AVATAR_INITIAL} ${AVATAR_HUE_BG[avatarHue(name)]} ${AVATAR_SIZES[size].initial} ${AVATAR_LINE_HEIGHT_1}">${avatarInitial(name)}</span></span>`;

// ── <Table> 조각 — table.tsx 가 그리는 DOM ────────────────────────────────

// <Table caption rowHeight> — 상자(가로 스크롤) > 틀 > <table>(숨긴 caption) + 숨긴 상태 글
const table = ({ caption, rowHeight = "text", head, body }) =>
  `<div data-slot="table" data-row-height="${rowHeight}" class="${TABLE_BOX}"><div data-slot="table-frame" class="${TABLE_FRAME}"><table class="${TABLE_EL}"><caption class="${SR_ONLY}">${esc(caption)}</caption><thead data-slot="table-header"><tr data-slot="table-row" class="${ROW}">${head.join("")}</tr></thead><tbody data-slot="table-body">${body.join("")}</tbody></table></div><span role="status" data-slot="table-status" class="${SR_ONLY}"></span></div>`;

// ↑↓ — 16 상자에 ↑(왼쪽) · ↓(오른쪽)를 나란히, 따로 칠한다(지금 방향만 짙게)
const sortIcon = (sort) =>
  `<svg aria-hidden="true" data-slot="table-sort-icon" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${SORT_ICON}"><g data-arrow="up" class="${sort === "ascending" ? SORT_ARROW.on : SORT_ARROW.off}"><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></g><g data-arrow="down" class="${sort === "descending" ? SORT_ARROW.on : SORT_ARROW.off}"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/></g></svg>`;

// <TableHead align sort> — sort 를 주면 칸 전체가 정렬 버튼(칸 여백을 버튼이 가진다), 정렬된 열에만 aria-sort
function head(label, { align = "start", sort } = {}) {
  const sortable = sort !== undefined;
  const cls = merge([CELL, HEAD_CELL, ALIGN[align], sortable && SORTABLE_HEAD].filter(Boolean).join(" "));
  const inner = sortable
    ? `<button type="button" data-slot="table-sort-button" class="${merge(`${SORT_BUTTON} ${SORT_ALIGN[align]}`)}"><span>${esc(label)}</span>${sortIcon(sort)}</button>`
    : esc(label);
  return `<th ${attrs(['scope="col"', 'data-slot="table-head"', `data-align="${align}"`, (sort === "ascending" || sort === "descending") && `aria-sort="${sort}"`, `class="${cls}"`])}>${inner}</th>`;
}

// 본문 칸의 공통 — 맞춤 · 줄 종류(rich 72)
const bodyCell = (align = "start", rich = false) => merge([CELL, BODY_CELL, ALIGN[align], rich && BODY_RICH].filter(Boolean).join(" "));
// <TableRowHeader href> — 첫 열(그 줄의 이름). 이름 링크는 줄을 누를 때와 같은 곳
const rowHeader = (html, { rich = false, href = "#" } = {}) =>
  `<th scope="row" data-slot="table-row-header" class="${bodyCell("start", rich)}">${href ? `<a href="${href}" data-slot="table-row-link" class="${ROW_HEADER_ACTION}">${html}</a>` : html}</th>`;
// <TableCell align>
const cell = (html, { align = "start", rich = false } = {}) => `<td data-slot="table-cell" class="${bodyCell(align, rich)}">${html}</td>`;
// <TableRow onClick> — 본문 줄에 onClick 을 주면 누르는 줄(호버 · 누름 바탕)
const row = (cells, { pressable = false } = {}) =>
  `<tr ${attrs(['data-slot="table-row"', pressable && 'data-pressable="true"', `class="${merge([ROW, pressable && ROW_PRESSABLE].filter(Boolean).join(" "))}"`])}>${cells.join("")}</tr>`;

// <TableCellContent media title detail> — 썸네일 · 두 줄 칸
const cellContent = ({ media, title, detail }) =>
  `<div data-slot="table-cell-content" class="${CONTENT_ROOT}">${media ? `<span data-slot="table-cell-media" class="${CONTENT_MEDIA}">${media}</span>` : ""}<span class="${CONTENT_TEXT}"><span data-slot="table-cell-title">${title}</span>${detail ? `<span data-slot="table-cell-detail" class="${CONTENT_DETAIL}">${detail}</span>` : ""}</span></div>`;

// <TableMoreHead> · <TableMoreCell label> — ⋮ 는 Button ghost · iconOnly · medium(보이는 40 · 누르는 44), 이름 "{label} 더보기"
const moreHead = (rich = false) => `<th scope="col" data-slot="table-more-head" class="${merge(`${CELL} ${HEAD_CELL} ${MORE_HEAD}`)}"><span class="${SR_ONLY}">동작</span></th>`;
const moreCell = (label, rich = false) =>
  `<td data-slot="table-more-cell" class="${merge([CELL, BODY_CELL, MORE_CELL, rich && BODY_RICH].filter(Boolean).join(" "))}"><div class="${CELL_WRAP}">${button({
    icon: "ellipsisVertical",
    label: `${label} 더보기`,
    variant: "ghost",
    layout: "iconOnly",
    size: "medium",
    className: MORE_BUTTON,
    extra: 'aria-haspopup="menu" aria-expanded="false" data-state="closed" data-slot="table-more-button"',
  })}</div></td>`;

// <TableSelectHead checked> · <TableSelectCell label checked> — Checkbox large 24 + 누르는 영역 44(HIT_44)
const selectHead = (state) =>
  `<th scope="col" data-slot="table-select-head" class="${merge(`${CELL} ${HEAD_CELL} ${SELECT_HEAD}`)}"><div class="${CELL_WRAP}">${checkmark({ label: "모두 선택", state, className: HIT_44 })}</div></th>`;
const selectCell = (label, checked) =>
  `<td data-slot="table-select-cell" class="${merge(`${CELL} ${BODY_CELL} ${SELECT_CELL}`)}"><div class="${CELL_WRAP}">${checkmark({ label: `${label} 선택`, state: checked ? "checked" : "unchecked", className: HIT_44 })}</div></td>`;

// <TableBulkBar count> — 고른 수(보이는 글은 aria-hidden · 읽는 글은 상태 글) + 동작(Button ghost small) + ✕ "선택 해제"
const bulkBar = (count, actions) =>
  `<span role="status" data-slot="table-bulk-status" class="${SR_ONLY}">${count}개 선택됨</span><div role="region" aria-label="선택한 항목" data-slot="table-bulk-bar" class="${BULK_BAR}"><span aria-hidden="true" data-slot="table-bulk-count" class="${BULK_COUNT}">${count}개 선택됨</span><div class="${BULK_ACTIONS}">${actions.join("")}${button({ icon: "x", label: "선택 해제", variant: "ghost", size: "small", layout: "iconOnly", extra: 'data-slot="table-bulk-clear"' })}</div></div>`;

// <TableStatusRow> — 본문 자리 한 칸(colSpan 은 머리 줄의 칸 수)
const statusRow = (colSpan, html) => `<tr data-slot="table-status-row"><td colspan="${colSpan}" class="${STATUS_CELL}">${html}</td></tr>`;
// <TableSkeletonRows rows columns> — 줄 높이 그대로(45), 글 자리 t4 19 · 폭은 열마다(기본 60%) · 숫자 열은 오른쪽
const skeletonRows = (rows, columns) =>
  Array.from(
    { length: rows },
    () =>
      `<tr aria-hidden="true" data-slot="table-skeleton-row">${columns
        .map((c) => `<td class="${merge(`${CELL} ${BODY_CELL} ${SKELETON_ROW}`)}">${skeleton({ text: "t4", className: c.align === "end" ? SKELETON_END : "", style: `width:${c.width ?? "60%"}` })}</td>`)
        .join("")}</tr>`,
  ).join("");

// <Delta> — 표의 증감 칸도 Card 의 Delta(▲ fg-critical · ▼ fg-informative · 없음 fg-neutral-subtle)
const DELTA_SAID = { up: "늘었어요", down: "줄었어요" };
const delta = ({ direction, value = "" }) =>
  `<span data-slot="delta" data-direction="${direction}" class="${DELTA}"><span aria-hidden="true" data-slot="delta-value" class="${DELTA_VALUE} ${DELTA_TONE[direction]}">${
    ARROW[direction] != null ? `${ARROW[direction]} ${esc(value)}` : "변화 없음"
  }</span><span class="${SR_ONLY}">${direction === "flat" ? "변화가 없어요" : `${esc(value)} ${DELTA_SAID[direction]}`}</span></span>`;

// ── 카드 · 바닥 — 표는 목록 카드 안에 가장자리까지(첫 칸 앞 · 끝 칸 뒤 24 가 카드 여백과 같다) ──

const tableCard = (title, html, id) =>
  `<div data-slot="card" data-variant="default" data-body="list" data-press="none" class="${merge(`${CARD_ROOT} ${CARD_VARIANT.default} ${CARD_BODY.list}`)}"><div data-slot="card-header" class="${CARD_HEADER} ${CARD_HEADER_LIST}"><h2 id="${id}" data-slot="card-title" class="${CARD_TITLE}">${esc(title)}</h2></div>${html}</div>`;
const floor = (html, maxWidth = "") =>
  `<div style="padding:var(--spacing-x6); border-radius:var(--radius-r4); background:var(--color-bg-layer-basement); font-family:var(--font-sans);${maxWidth ? ` max-width:${maxWidth};` : ""}">${html}</div>`;
const CAPTION = "display:block; margin-top:var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;
const stack = (items) => `<div style="display:flex; flex-direction:column; gap:var(--spacing-x6);">${items.join("")}</div>`;

// ── 데이터 ────────────────────────────────────────────────────────────────

// 사용자 — 남은 휴가 많은 순(내림). 상태는 Badge weak — 재직 positive · 휴직 warning
const USERS = [
  { name: "최민준", department: "영업팀", days: "15일", active: true },
  { name: "김하늘", department: "개발팀", days: "12.5일", active: true },
  { name: "정다은", department: "재무팀", days: "8일", active: true },
  { name: "이도윤", department: "디자인팀", days: "3일", active: false },
  { name: "박서연", department: "인사팀", days: "0.5일", active: true },
];
const statusLabel = (u) => (u.active ? "재직" : "휴직");
const userHead = [head("이름", { sort: "none" }), head("부서"), head("남은 휴가", { align: "end", sort: "descending" }), head("상태"), moreHead()];
const userRows = (users = USERS) =>
  users.map((u) => row([rowHeader(esc(u.name)), cell(esc(u.department)), cell(esc(u.days), { align: "end" }), cell(badge(statusLabel(u), u.active ? "positive" : "warning")), moreCell(u.name)], { pressable: true }));

// 업무 보고 — 두 줄 고름(바탕 없이 체크로만). 제출일은 처음 누르면 내림(최근 것 먼저)
const REPORTS = [
  { title: "3분기 영업 실적", author: "최민준", date: "10월 7일 (수)", status: ["검토 중", "informative"], on: true },
  { title: "하반기 채용 일정", author: "박서연", date: "10월 6일 (화)", status: ["반려", "critical"], on: false },
  { title: "표 컴포넌트 정리", author: "이도윤", date: "10월 5일 (월)", status: ["검토 중", "informative"], on: true },
  { title: "10월 1주 업무 보고", author: "김하늘", date: "10월 2일 (금)", status: ["승인", "positive"], on: false },
];

// 일별 시세 — 숫자 오른쪽 · 고정폭 숫자, 등락률은 증감(방향 색 + 값 · 변화 없음)
const PRICES = [
  { date: "10월 8일 (목)", close: "71,200원", delta: { direction: "up", value: "1.2%" }, volume: "12,345,678주" },
  { date: "10월 7일 (수)", close: "70,350원", delta: { direction: "down", value: "0.8%" }, volume: "9,876,543주" },
  { date: "10월 6일 (화)", close: "70,900원", delta: { direction: "flat" }, volume: "8,123,450주" },
  { date: "10월 5일 (월)", close: "70,900원", delta: { direction: "up", value: "2.1%" }, volume: "15,234,000주" },
];

// 사람 — Avatar 42 + 이름 · 이메일(두 줄 칸이 하나라도 있으면 모든 줄이 72)
const PEOPLE = [
  { name: "김하늘", email: "haneul.kim@groo.kr", department: "개발팀", days: "12.5일", active: true },
  { name: "박서연", email: "seoyeon.park@groo.kr", department: "인사팀", days: "0.5일", active: true },
  { name: "이도윤", email: "doyun.lee@groo.kr", department: "디자인팀", days: "3일", active: false },
];

// ── 예제 ──────────────────────────────────────────────────────────────────

export const tableExamples = [
  {
    title: "HR 사용자 표",
    description:
      "줄과 열로 된 데이터를 견주는 표다 — 카드 안에 가장자리까지 붙는다(바깥 테두리 · 모서리 · 세로 선 · 줄무늬 없음). 머리 줄은 41(위아래 10 + 글 20 + 선 1) · 머리 글자는 본문과 같은 14 / 20 · 짙은 fg-neutral 에 굵기만 500 이고 머리 바탕 · 작은 대문자 · 회색 머리를 두지 않는다. 본문 줄은 45(위아래 12 + 글 20 + 선 1) · 14 / 20 · 400 이다. 칸 좌우는 16 이고 첫 칸 앞 · 끝 칸 뒤만 카드 여백과 같은 24 라 카드 머리 제목과 첫 열 글자가 한 줄에 선다. 줄 선은 1px stroke-neutral-subtle 로 머리 아래 · 줄마다 · 마지막 줄 아래까지 긋는다. 숫자 열(남은 휴가)은 머리까지 오른쪽 · 고정폭 숫자, 상태는 Badge weak(뜻은 톤으로), 줄의 동작은 끝 ⋮ 하나(Button ghost · iconOnly · medium — 이름 \"{줄 이름} 더보기\")다. 정렬할 수 있는 열(이름 · 남은 휴가)에는 ↑↓ 를 늘 그린다 — 둘 다 흐린 fg-neutral-muted 에서 지금 방향 하나만 짙어진다(그림은 남은 휴가 내림). 줄을 누르면 상세가 열리고, 키보드로는 첫 열의 이름 링크로 같은 곳에 간다.",
    jsx: `import { Badge } from "@/components/ui/badge"
import { ResponsiveMenuContent, ResponsiveMenuItem } from "@/components/ui/menu"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableMoreCell, TableMoreHead, TableRow, TableRowHeader,
} from "@/components/ui/table"

<Table caption="사용자">
  <TableHeader>
    <TableRow>
      <TableHead sort={sortBy === "name" ? dir : "none"} onSortChange={(d) => sort("name", d)}>이름</TableHead>
      <TableHead>부서</TableHead>
      <TableHead align="end" sort={sortBy === "days" ? dir : "none"} onSortChange={(d) => sort("days", d)}>남은 휴가</TableHead>
      <TableHead>상태</TableHead>
      <TableMoreHead />
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((u) => (
      <TableRow key={u.id} onClick={() => openUser(u.id)}>
        <TableRowHeader href={\`/users/\${u.id}\`}>{u.name}</TableRowHeader>
        <TableCell>{u.department}</TableCell>
        <TableCell align="end">{formatDays(u.remainingDays)}</TableCell>
        <TableCell><Badge tone={u.active ? "positive" : "warning"}>{u.statusLabel}</Badge></TableCell>
        <TableMoreCell label={u.name}>
          <ResponsiveMenuContent title={u.name}>
            <ResponsiveMenuItem label="수정" onSelect={() => edit(u)} />
            <ResponsiveMenuItem label="삭제" tone="critical" onSelect={() => askDelete(u)} />
          </ResponsiveMenuContent>
        </TableMoreCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`,
    render: () => floor(tableCard("사용자", table({ caption: "사용자", head: userHead, body: userRows() }), "table-ex-basic-title")),
  },

  {
    title: "고르기 · 일괄 작업",
    description:
      "여럿을 골라 한 번에 다루는 표만 첫 열에 Checkbox large(24 · 누르는 44)를 둔다 — 열 폭 24 + 앞 24 · 뒤 16. 머리 칸의 체크는 지금 쪽의 줄 전부를 고르고 풀며, 일부만 골랐으면 일부(mixed)다(이름 \"모두 선택\" · 줄은 \"{줄 이름} 선택\"). 한 줄 이상 고르면 표 위(아래 8)에 일괄 작업 바가 뜬다 — 바탕 bg-brand-weak 한 값 · 높이 48 · 모서리 12 · 왼쪽 16 · 오른쪽 8, 왼쪽에 \"2개 선택됨\"(14 · 500 · role=\"status\" 로 알린다), 오른쪽에 동작(Button ghost small — 모두 neutral, \"삭제\" 도 회색 글이고 빨강은 누른 뒤의 확인창에서)과 ✕ \"선택 해제\". 고른 줄 자체에는 바탕을 칠하지 않는다 — 체크가 고른 것을 말한다(사용자 결정 21A). 브랜드 옅은 바탕은 일괄 작업 바에만 있다. 제출일은 처음 누르면 내림(defaultSortDirection=\"descending\")이다.",
    jsx: `import { Button } from "@/components/ui/button"
import { Table, TableBulkBar, TableSelectCell, TableSelectHead } from "@/components/ui/table"

<TableBulkBar count={selected.size} onClear={clearSelection}>
  <Button variant="ghost" size="small" onClick={exportSelected}>내보내기</Button>
  <Button variant="ghost" size="small" onClick={askDeleteSelected}>삭제</Button>
</TableBulkBar>
<Table caption="업무 보고">
  <TableHeader>
    <TableRow>
      <TableSelectHead checked={allChecked ? true : someChecked ? "indeterminate" : false} onCheckedChange={toggleAll} />
      …
    </TableRow>
  </TableHeader>
  <TableBody>
    {reports.map((r) => (
      <TableRow key={r.id}>
        <TableSelectCell label={r.title} checked={selected.has(r.id)} onCheckedChange={() => toggle(r.id)} />
        …
      </TableRow>
    ))}
  </TableBody>
</Table>`,
    render: () =>
      floor(
        tableCard(
          "업무 보고",
          `<div style="padding:0 var(--spacing-x6);">${bulkBar(2, [
            button({ text: "내보내기", variant: "ghost", size: "small" }),
            button({ text: "삭제", variant: "ghost", size: "small" }),
          ])}</div>${table({
            caption: "업무 보고",
            head: [selectHead("indeterminate"), head("제목"), head("작성자"), head("제출일", { sort: "none" }), head("상태")],
            body: REPORTS.map((r) => row([selectCell(r.title, r.on), rowHeader(esc(r.title)), cell(esc(r.author)), cell(esc(r.date)), cell(badge(r.status[0], r.status[1]))])),
          })}`,
          "table-ex-select-title",
        ),
      ),
  },

  {
    title: "768 미만 — List 줄",
    description:
      "768 미만에서는 표를 그리지 않고 줄마다 List 의 누르는 줄로 바꾼다 — 폰에서 옆으로 밀거나 열을 숨겨 보지 않는다. 첫 열(그 줄의 이름) → 제목(16 / 22), 다음으로 중요한 열 1 ~ 2개 → 설명(13 · fg-neutral-subtle · \" · \" 로 잇는다), 핵심 숫자 하나 또는 상태 → 오른쪽 값(숫자는 16 · 고정폭 숫자), 나머지 열은 줄을 눌러 여는 상세다. 썸네일 · 사람 · 기관은 앞 붙이개(Image Frame · Avatar · Logo Tile), 줄 끝 ⋮ 는 Menu Sheet(폰 스와이프는 지름길), 정렬은 목록 위 Select 하나다. 폰 화면은 바닥이 회색이고 목록은 카드에 담는다. useTableLayout() 은 768 이상 \"table\" · 미만 \"list\" 다. 미리보기는 폰 폭(360)이다.",
    jsx: `import { List, ListButtonItem } from "@/components/ui/list"
import { useTableLayout } from "@/components/ui/table"

const layout = useTableLayout()

{layout === "list" ? (
  <List aria-label="사용자">
    {users.map((u) => (
      <ListButtonItem
        key={u.id}
        title={u.name}
        detail={[u.department, u.statusLabel].join(" · ")}
        suffix={<span className="tabular-nums">{formatDays(u.remainingDays)}</span>}
        onClick={() => openUser(u.id)}
      />
    ))}
  </List>
) : (
  <UserTable users={users} />
)}`,
    render: () =>
      floor(
        tableCard(
          "사용자",
          listOf(
            USERS.map((u) => listButtonItem({ title: esc(u.name), detail: esc([u.department, statusLabel(u)].join(" · ")), suffix: `<span class="tabular-nums">${esc(u.days)}</span>` })),
            { ariaLabel: "사용자" },
          ),
          "table-ex-narrow-title",
        ),
        "408px",
      ),
  },

  {
    title: "불러오는 동안 · 비었음 · 실패",
    description:
      "처음 불러오는 동안은 머리 줄은 그리고 줄 자리만 Skeleton 이다 — 줄 높이 그대로(45 · 72), 글 자리 t4 19, 숫자 열은 오른쪽. 거르기 때문에 비었으면 본문 자리 한 칸에 Result Section medium(\"조건에 맞는 사용자가 없어요\" + 필터 초기화), 못 불러왔으면 failure + 다시 시도 — 실패를 빈 표로 보이지 않는다. 그 칸은 좌우 24 · 위아래 0 이고, 카드 안의 Result Section 은 제 좌우 48 을 두지 않는다(카드 · 칸의 24 가 가장자리를 가진다 — 사용자 결정 23B). 시간표(1 · 5 · 10초)는 Skeleton 의 LoadingRegion 이다.",
    jsx: `import { SearchX } from "lucide-react"
import { ResultSection } from "@/components/ui/result-section"
import { TableBody, TableSkeletonRows, TableStatusRow } from "@/components/ui/table"

<TableBody>
  {query.isPending ? (
    <TableSkeletonRows rows={pageSize} columns={[{ width: "40%" }, { width: "30%" }, { align: "end", width: "20%" }]} />
  ) : query.isError ? (
    <TableStatusRow>
      <ResultSection kind="failure" size="medium" title="사용자를 불러오지 못했어요" description="잠시 뒤 다시 시도해주세요."
        primaryAction={{ label: "다시 시도", onClick: () => query.refetch() }} />
    </TableStatusRow>
  ) : rows.length === 0 ? (
    <TableStatusRow>
      <ResultSection kind="empty" size="medium" icon={<SearchX />} title="조건에 맞는 사용자가 없어요" secondaryAction={{ label: "필터 초기화", onClick: resetFilters }} />
    </TableStatusRow>
  ) : (
    rows.map(renderRow)
  )}
</TableBody>`,
    render: () => {
      const statusHead = [head("이름", { sort: "none" }), head("부서"), head("남은 휴가", { align: "end", sort: "descending" })];
      return stack([
        labeled(floor(tableCard("사용자", table({ caption: "사용자", head: statusHead, body: [skeletonRows(5, [{ width: "40%" }, { width: "30%" }, { align: "end", width: "20%" }])] }), "table-ex-loading-title")), "불러오는 동안 — 줄 스켈레톤 다섯"),
        labeled(
          floor(tableCard("사용자", table({ caption: "사용자", head: statusHead, body: [statusRow(3, resultSection({ kind: "failure", title: "사용자를 불러오지 못했어요", description: "잠시 뒤 다시 시도해주세요.", primary: "다시 시도" }))] }), "table-ex-failure-title")),
          "실패 — 다시 시도",
        ),
        labeled(
          floor(tableCard("사용자", table({ caption: "사용자", head: statusHead, body: [statusRow(3, resultSection({ kind: "empty", icon: "searchX", title: "조건에 맞는 사용자가 없어요", secondary: "필터 초기화" }))] }), "table-ex-empty-title")),
          "비었음 — 거르기 때문",
        ),
      ]);
    },
  },

  {
    title: "숫자 열 · 증감",
    description:
      "금액 · 개수 · 비율은 머리까지 오른쪽 · 고정폭 숫자(tabular-nums — 고정폭 글꼴은 쓰지 않는다)다. 돈은 줄이지 않고 원까지, 빼기는 U+2212(−) 하나다. 날짜는 왼쪽이다 — 같은 형식이라 자리가 맞는다. 오르내림을 적는 칸은 Card 의 Delta 와 같은 방향 색이다 — ▲ fg-critical · ▼ fg-informative + 값, 그대로면 \"변화 없음\"(fg-neutral-subtle). 날짜 열은 처음 누르면 내림(최근 것 먼저)이다.",
    jsx: `<Table caption="일별 시세">
  <TableHeader>
    <TableRow>
      <TableHead sort="descending" defaultSortDirection="descending" onSortChange={onSort}>날짜</TableHead>
      <TableHead align="end">종가</TableHead>
      <TableHead align="end">등락률</TableHead>
      <TableHead align="end">거래량</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {prices.map((p) => (
      <TableRow key={p.date}>
        <TableRowHeader>{formatDay(p.date)}</TableRowHeader>
        <TableCell align="end">{formatWon(p.close)}</TableCell>
        <TableCell align="end"><Delta direction={p.direction} value={formatRate(p.rate)} /></TableCell>
        <TableCell align="end">{formatCount(p.volume)}주</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`,
    render: () =>
      floor(
        tableCard(
          "일별 시세",
          table({
            caption: "일별 시세",
            head: [head("날짜", { sort: "descending" }), head("종가", { align: "end" }), head("등락률", { align: "end" }), head("거래량", { align: "end" })],
            body: PRICES.map((p) =>
              row([
                `<th scope="row" data-slot="table-row-header" class="${bodyCell()}">${esc(p.date)}</th>`,
                cell(esc(p.close), { align: "end" }),
                cell(delta(p.delta), { align: "end" }),
                cell(esc(p.volume), { align: "end" }),
              ]),
            ),
          }),
          "table-ex-numbers-title",
        ),
      ),
  },

  {
    title: "두 줄 칸 — 72",
    description:
      "칸 하나라도 썸네일(Image Frame 1:1 48 · 사람은 Avatar 42 · 은행 · 카드 같은 물건은 Logo Tile 40)이나 두 줄 글(윗줄 14 · 둘째 줄 13 · fg-neutral-subtle, 사이 2)을 두면 그 표의 모든 줄이 72 다(rowHeight=\"rich\") — 그림 ↔ 글 12, 위아래 여백 없이 72 안에서 세로 가운데라 칸 여백보다 높이가 먼저다. 한 표 안에서 줄 높이를 섞지 않는다.",
    jsx: `<Table caption="사용자" rowHeight="rich">
  …
  <TableRow onClick={() => openUser(u.id)}>
    <TableRowHeader href={\`/users/\${u.id}\`}>
      <TableCellContent media={<Avatar name={u.name} size={42} />} title={u.name} detail={u.email} />
    </TableRowHeader>
    <TableCell>{u.department}</TableCell>
    <TableCell align="end">{formatDays(u.remainingDays)}</TableCell>
    …
  </TableRow>
</Table>`,
    render: () =>
      floor(
        tableCard(
          "사용자",
          table({
            caption: "사용자",
            rowHeight: "rich",
            head: [head("이름", { sort: "none" }), head("부서"), head("남은 휴가", { align: "end", sort: "descending" }), head("상태"), moreHead()],
            body: PEOPLE.map((u) =>
              row(
                [
                  rowHeader(cellContent({ media: avatar(u.name), title: esc(u.name), detail: esc(u.email) }), { rich: true }),
                  cell(esc(u.department), { rich: true }),
                  cell(esc(u.days), { align: "end", rich: true }),
                  cell(badge(statusLabel(u), u.active ? "positive" : "warning"), { rich: true }),
                  moreCell(u.name, true),
                ],
                { pressable: true },
              ),
            ),
          }),
          "table-ex-rich-title",
        ),
      ),
  },
];
