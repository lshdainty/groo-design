/*
 * shadcn Wheel Picker 예제 — docs site components/wheel-picker.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 하나(달만 고르기)는 차례 · 제목 · 코드가 specs/components/wheel-picker.md 의 "코드" 절과 같다.
 * groo 에 처음 두는 컴포넌트다(Time Picker 의 바탕 · Date Picker 머리의 연 · 월 휠 · 달만 고르는 자리).
 *
 * ROOT · ROOT_SIZE · ROOT_COUNT · INDICATOR · COLUMNS · FOG · FOG_TOP · FOG_BOTTOM · COLUMN · ITEM · ITEM_ALIGN · ITEM_LABEL · ITEM_LABEL_SIZE 는
 * recipes/shadcn/components/ui/wheel-picker.tsx 의 상수와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다(time-picker-examples.mjs 의 것과도 같다).
 * 둘레의 부품은 그 레시피의 값을 옮겨 썼다 — BUTTON_* 는 button.tsx(button-examples.mjs), SHEET_* 는 bottom-sheet.tsx(bottom-sheet-examples.mjs),
 * POP_* 는 popover.tsx(popover-examples.mjs), IB_* 는 input-button.tsx · FIELD_* 는 field.tsx(input-button-examples.mjs)의 것과 같다 — 이 파일이 쓰는
 * 변형 · 크기와 그에 걸리는 compound 만 옮겼다. 규칙은 specs/components/wheel-picker.md, 수치 원본은 specs/components/wheel-picker.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 휠 <div role="group" data-slot="wheel-picker"> > 띠 <div data-slot="wheel-picker-indicator"> · 칼럼 묶음
 * <div data-slot="wheel-picker-columns"> > 칼럼 <div role="spinbutton" data-slot="wheel-picker-column">(스크롤 칸) > 항목 <div data-slot="wheel-picker-item">
 * > 글 <span data-slot="wheel-picker-item-label">, 그리고 위아래 안개 <div data-slot="wheel-picker-fog">. 띠에 걸친 항목은 data-overlap 과 겹친 자리
 * (--wheel-overlap-start · --wheel-overlap-end)로 글자를 세로 그라데이션으로 칠한다(background-clip: text) — 멈춘 그림이라 가운데 항목만 0% ~ 100% 다.
 * 레시피는 칼럼을 스크롤해 가운데 항목을 띠에 두고, 반복 칼럼(월)은 항목을 앞뒤로 여러 벌 잇는다 — 정적 그림은 스크롤을 정할 수 없어 보이는 항목과 그
 * 앞뒤만 그리고 첫 항목의 위 여백을 당겨 흉내 냈다(미리보기용 덧칠). 시트 · 팝오버는 화면에 뜬다 — 미리보기 틀(STAGE)에 transform 을 줘 fixed 의 기준을
 * 틀로 바꾸고 isolation 으로 z-index 를 틀 안에 가둔다. 시트 높이 상한(90dvh)은 틀 높이의 90% 를 style 로 한 번 더 적는다(SHEET_FIT). 뒤 화면은 미리보기 그림이다.
 * 레시피의 스크립트(끌기 · 휠 · 누르기 · 키 · 멈춘 뒤 값 정하기 · 반복 칼럼 가운데로 옮기기)는 정적 HTML 에 없다 — 휠은 굴러가지 않는다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── wheel-picker.tsx 의 상수와 같은 값 ─────────────────────────────────────

// 휠 — 항목 높이 × 보이는 수, 바탕 bg-layer-floating. 글자 색 둘(띠 밖 · 띠 위)을 변수로 두고 막히면 띠 위도 흐리게
const ROOT = [
  "relative w-full select-none overflow-hidden bg-bg-layer-floating font-sans",
  "h-[calc(var(--wheel-item)*var(--wheel-count))]",
  "[--wheel-item-color:var(--color-fg-disabled)] [--wheel-selected-color:var(--color-fg-neutral)]",
  "data-[disabled]:[--wheel-selected-color:var(--color-fg-disabled)]",
].join(" ");

const ROOT_SIZE = { small: "[--wheel-item:36px]", medium: "[--wheel-item:44px]" };

const ROOT_COUNT = { 5: "[--wheel-count:5]", 7: "[--wheel-count:7]" };

// 띠 — 휠 좌우 끝에서 16 들인 가운데 줄(항목 높이 · 모서리 8 · bg-neutral-weak). 칼럼 뒤에 깔린다
const INDICATOR =
  "pointer-events-none absolute inset-x-x4 top-1/2 h-[var(--wheel-item)] -translate-y-1/2 rounded-r2 bg-bg-neutral-weak";

// 칼럼 묶음 — 휠 가운데
const COLUMNS = "relative flex h-full w-full justify-center";

// 안개 — min(휠 높이 × 40%, 항목 3칸). 휠 바탕색 판을 gradient-fade-mask(위 → 아래로 불투명)로 가린다 — 위 판은 뒤집는다
const FOG = "pointer-events-none absolute inset-x-0 h-[min(40%,calc(var(--wheel-item)*3))] bg-bg-layer-floating [mask-image:var(--gradient-fade-mask)]";

const FOG_TOP = `${FOG} top-0 -scale-y-100`;

const FOG_BOTTOM = `${FOG} bottom-0`;

// 칼럼 — 스크롤 칸. 위아래 (보이는 수 − 1) ÷ 2 칸을 비워 첫 · 끝 항목도 가운데에 온다. 스크롤바는 숨긴다.
// 끄는 동안 · 맞추는 동안(휠 · 놓기)은 스냅을 끈다. 키보드 링은 가운데 항목(data-selected)에 — 손으로 만진 동안은 숨긴다
const COLUMN = [
  "h-full w-max shrink-0 cursor-grab touch-pan-y snap-y snap-mandatory overflow-y-auto overflow-x-hidden overscroll-contain outline-none",
  "py-[calc(var(--wheel-item)*(var(--wheel-count)-1)/2)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  "data-[dragging]:cursor-grabbing data-[dragging]:snap-none data-[free]:snap-none",
  "data-[disabled]:cursor-default data-[disabled]:overflow-hidden",
  "[&:focus-visible:not([data-pointer-focus])_[data-selected]]:outline-2 [&:focus-visible:not([data-pointer-focus])_[data-selected]]:-outline-offset-2 [&:focus-visible:not([data-pointer-focus])_[data-selected]]:outline-stroke-focus-ring",
].join(" ");

// 항목 — 항목 높이 · 스냅은 가운데. 띠와 겹치면 글자를 투명하게 하고 세로 그라데이션(띠 밖 색 → 띠 위 색 → 띠 밖 색)을 글자로 자른다
const ITEM = [
  "flex h-[var(--wheel-item)] shrink-0 snap-center items-center rounded-r2 text-[color:var(--wheel-item-color)]",
  "data-[overlap]:bg-clip-text data-[overlap]:text-transparent",
  "data-[overlap]:[background-image:linear-gradient(to_bottom,var(--wheel-item-color)_0,var(--wheel-item-color)_var(--wheel-overlap-start),var(--wheel-selected-color)_var(--wheel-overlap-start),var(--wheel-selected-color)_var(--wheel-overlap-end),var(--wheel-item-color)_var(--wheel-overlap-end),var(--wheel-item-color)_100%)]",
].join(" ");

const ITEM_ALIGN = { left: "justify-start", center: "justify-center", right: "justify-end" };

// 항목 글 — 좌우 16 · 500 · 숫자 폭 같게 · 한 줄. 글자 크기 설정을 따르지 않는 px(t10-static · t7-static)
const ITEM_LABEL = "flex h-full items-center whitespace-nowrap px-x4 font-medium tabular-nums";

const ITEM_LABEL_SIZE = { small: "text-t7-static", medium: "text-t10-static" };

// ── button.tsx 의 cva 와 같은 값 — 바닥 "완료"(시트 large · 팝오버 small) ─────────

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
  },
  size: {
    small: "h-9 rounded-r2 [--press-basis:36] [--progress-size:14px]",
    large: "h-12 rounded-r3 [--press-basis:48] [--progress-size:18px]",
  },
  layout: { withText: "", iconOnly: "" },
  ghostColor: { neutral: "", neutralSubtle: "", brand: "", critical: "" },
  flush: { left: "", right: "" },
};

const BUTTON_COMPOUND = [
  { size: "small", layout: "withText", className: "px-x3_5 py-x2 gap-x1 text-t4 [&_svg]:size-3.5" },
  { size: "large", layout: "withText", className: "px-x5 py-x3 gap-x2 text-t6 [&_svg]:size-[22px]" },
];

const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

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

// 머리 · 제목(닫기 버튼이 있으면 오른쪽 64) · 본문 · 바닥(버튼 large 48 — 하나면 폭 전체)
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

// 상자의 크기(inputButtonVariants) — 팝오버를 연 칸은 medium(1280 이상 데스크톱 웹), Field 없는 칸은 기본 responsive
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

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다.
// 참 · 거짓 축(invalid)은 cva 처럼 "true" · "false" 글자 키로 찾는다
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

const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });
const inputButtonVariants = cvaOf(IB_SIZE_BASE, { variants: IB_SIZE_VARIANTS, defaultVariants: IB_SIZE_DEFAULTS });
const inputButtonSurfaceVariants = cvaOf(IB_SURFACE_BASE, {
  variants: IB_SURFACE_VARIANTS,
  compoundVariants: IB_SURFACE_COMPOUND,
  defaultVariants: IB_SURFACE_DEFAULTS,
});

// 휠의 cn()(twMerge) 은 지워지는 클래스가 없다 — 칼럼 · 항목 · 글의 클래스는 같은 속성을 다시 쓰지 않는다. 그래서 그대로 잇는다
const cn = (...parts) => parts.filter(Boolean).join(" ");
// 칼럼의 cn(COLUMN, className) 만은 지운다 — twMerge 처럼 뒤에 온 className 이 같은 속성(폭 · 최소 폭 · 최대 폭 · flex · basis · grow · shrink)의
// 앞 클래스를 지운다. 연 · 월 휠의 w-[120px] · w-[96px] 는 COLUMN 의 w-max 를 지운다
const MERGE_GROUPS = [/^w-/, /^min-w-/, /^max-w-/, /^flex-(\d+|auto|initial|none)$/, /^basis-/, /^grow(-|$)/, /^shrink(-|$)/];
const mergeGroup = (c) => MERGE_GROUPS.findIndex((re) => re.test(c));
const cnMerge = (...parts) =>
  parts
    .filter(Boolean)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean)
    .reduce((out, c) => {
      const g = mergeGroup(c);
      return [...(g < 0 ? out : out.filter((o) => mergeGroup(o) !== g)), c];
    }, [])
    .join(" ");
const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기는 감싼 자리의 [&>svg]:size-* 가 정한다
const svg = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const ICONS = {
  x: svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  clock: svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
  chevronDown: svg('<path d="m6 9 6 6 6-6"/>'),
  calendarDays: svg(
    '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/>',
  ),
};

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

// <WheelPickerColumn> — wheel-picker.tsx 그대로(spinbutton · 항목은 보조 기술에 숨긴다). 정적 그림이라 스크롤 자리(scrollTop = 가운데 항목 × 항목 높이)를
// 정할 수 없다 — 보이는 항목과 그 앞뒤만 그리고, 첫 항목의 위 여백을 그만큼 당겨 가운데 항목이 띠에 오게 한다(미리보기용 덧칠). 레시피가 멈춘 뒤
// 가운데 항목에 다는 data-selected · data-overlap(띠와 겹친 자리 0% ~ 100%)도 단다. extra 는 칼럼에 넘긴 그 밖의 속성(data-column 등)
function wheelColumn({ options, value, loop = false, align = "center", ariaLabel, size = "medium", visibleItems = 5, className = "", extra = [] }) {
  const count = options.length;
  const index = Math.max(options.findIndex((o) => o.value === value), 0);
  const half = (visibleItems - 1) / 2;
  const from = loop ? index - half : Math.max(0, index - half);
  const to = loop ? index + half : Math.min(count - 1, index + half);
  const items = [];
  for (let p = from; p <= to; p++) {
    const o = options[((p % count) + count) % count];
    const center = p === index;
    const style = [p === from && p < index && `margin-top:calc(var(--wheel-item) * -${index - from});`, center && "--wheel-overlap-start:0%; --wheel-overlap-end:100%;"].filter(Boolean).join(" ");
    items.push(
      `<div ${attrs([
        'aria-hidden="true"',
        'data-slot="wheel-picker-item"',
        `data-value="${esc(o.value)}"`,
        `class="${cn(ITEM, ITEM_ALIGN[align])}"`,
        center && 'data-selected=""',
        center && 'data-overlap=""',
        style && `style="${style}"`,
      ])}><span data-slot="wheel-picker-item-label" class="${cn(ITEM_LABEL, ITEM_LABEL_SIZE[size])}">${esc(o.label)}</span></div>`,
    );
  }
  const column = attrs([
    'role="spinbutton"',
    'tabindex="0"',
    'aria-valuemin="0"',
    `aria-valuemax="${count - 1}"`,
    `aria-valuenow="${index}"`,
    `aria-valuetext="${esc(options[index].label)}"`,
    'data-slot="wheel-picker-column"',
    `data-align="${align}"`,
    `class="${cnMerge(COLUMN, className)}"`,
    `aria-label="${esc(ariaLabel)}"`,
    ...extra,
  ]);
  return `<div ${column}>${items.join("")}</div>`;
}

// <WheelPicker> — wheel-picker.tsx 그대로. 띠 · 칼럼 묶음 · 위아래 안개. extra 는 휠에 넘긴 그 밖의 속성(data-picker 등 — aria-label 앞)
function wheelPicker({ size = "medium", visibleItems = 5, ariaLabel, extra = [], columns }) {
  return `<div ${attrs([
    'role="group"',
    'data-slot="wheel-picker"',
    `data-size="${size}"`,
    `class="${cn(ROOT, ROOT_SIZE[size], ROOT_COUNT[visibleItems])}"`,
    ...extra,
    `aria-label="${esc(ariaLabel)}"`,
  ])}><div aria-hidden="true" data-slot="wheel-picker-indicator" class="${INDICATOR}"></div><div data-slot="wheel-picker-columns" class="${COLUMNS}">${columns
    .map((c) => wheelColumn({ size, visibleItems, ...c }))
    .join("")}</div><div aria-hidden="true" data-slot="wheel-picker-fog" data-side="top" class="${FOG_TOP}"></div><div aria-hidden="true" data-slot="wheel-picker-fog" data-side="bottom" class="${FOG_BOTTOM}"></div></div>`;
}

// <Button> — button.tsx 그대로. 바닥이 크기를 넣는다(시트 large · 팝오버 small). type 은 코드가 넘길 때만 붙는다
const button = ({ size, label }) => `<button class="${buttonVariants({ variant: "neutralSolid", size })}">${esc(label)}</button>`;

// 미리보기 틀 — 레시피의 딤 · 시트 · 팝오버는 화면(fixed)에 뜬다. transform 이 fixed 의 기준을 틀로 바꾸고 isolation 이 z-index 를 틀 안에 가둔다.
// phone 은 휴대폰(360 — 시트는 1280 미만), 아니면 데스크톱 화면(팝오버는 1280 이상)이다
const STAGE = ({ height, phone = false }) =>
  `position:relative; isolation:isolate; transform:translateZ(0); overflow:hidden; width:100%;${phone ? " max-width:360px; margin:0 auto;" : ""} height:${height}px; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:${phone ? "var(--color-bg-layer-default)" : "var(--color-bg-layer-basement)"}; font-family:var(--font-sans);`;
// 시트 높이 상한(90dvh)을 틀 높이로 — 레시피에는 없는 미리보기용 덧칠
const SHEET_FIT = (height) => `max-height:${Math.round(height * 0.9)}px;`;
const PAGE_TITLE = "font-size:var(--text-t7); line-height:var(--text-t7--line-height); font-weight:700; color:var(--color-fg-neutral);";
// 뒤 화면 — 제목과 줄(미리보기 그림). 시트가 열린 동안 보조 기술에는 숨는다
const PAGE_ROW =
  "display:flex; justify-content:space-between; gap:var(--spacing-x3); padding:var(--spacing-x3) 0; font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const page = (title, rows) =>
  `<div aria-hidden="true" style="padding:var(--spacing-x6);"><div style="${PAGE_TITLE} margin-bottom:var(--spacing-x2);">${esc(title)}</div>${rows
    .map(([a, b]) => `<div style="${PAGE_ROW}"><span>${esc(a)}</span><span style="color:var(--color-fg-neutral-subtle);">${esc(b)}</span></div>`)
    .join("")}</div>`;

// <BottomSheet open> + <BottomSheetContent title>(닫기 버튼 있음) — 본문 · 바닥은 HTML
function bottomSheet({ uid, title, body, footer, height, pageHtml }) {
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
    `class="${SHEET_CONTENT}"`,
    `style="${SHEET_FIT(height)}"`,
  ]);
  const header = `<div data-slot="bottom-sheet-header" class="${SHEET_HEADER}"><h2 id="${titleId}" data-slot="bottom-sheet-title" class="${SHEET_TITLE} ${SHEET_TITLE_WITH_CLOSE}">${esc(title)}</h2></div>`;
  const close = `<button type="button" aria-label="닫기" data-slot="bottom-sheet-close" class="${SHEET_CLOSE}">${ICONS.x}</button>`;
  const overlay = `<div data-vaul-overlay="" data-vaul-snap-points="false" data-state="open" data-slot="bottom-sheet-overlay" class="${SHEET_OVERLAY}"></div>`;
  return `<div style="${STAGE({ height, phone: true })}">${pageHtml}${overlay}<div ${content}>${header}${close}<div data-slot="bottom-sheet-body" class="${SHEET_BODY} ${SHEET_BODY_PLAIN}">${body}</div><div data-slot="bottom-sheet-footer" class="${SHEET_FOOTER}">${footer.join("")}</div></div></div>`;
}

// <InputButton> 상자 — 상자(div) > 배경 층 버튼 + 콘텐츠 층(값 · 뒤 아이콘). trigger 는 버튼에 얹을 속성(이름 · 여는 자리), valueId 는 값 자리의 id
const inputButtonBox = ({ size, value, icon, trigger, valueId }) =>
  `<div data-slot="input-button" data-size="${size}" class="${IB_ROOT} ${inputButtonVariants({ size })}"><button ${trigger}></button><span data-slot="input-button-content" class="${IB_CONTENT} ${IB_CONTENT_PRESS}"><span id="${valueId}" aria-hidden="true" data-slot="input-button-value" class="${IB_VALUE} ${IB_VALUE_COLOR}">${esc(value)}</span><span aria-hidden="true" data-slot="input-button-suffix-icon" class="${IB_ICON} ${IB_ICON_COLOR}">${ICONS[icon]}</span></span></div>`;

// <Field label> + <InputButton size="medium"> — 팝오버를 연 칸. PopoverTrigger asChild 가 버튼에 Radix 의 속성과 data-slot 을 얹는다
function pickField({ uid, label, value, icon, contentId }) {
  const labelId = `${uid}-label`;
  const controlId = `${uid}-control`;
  const trigger = attrs([
    'type="button"',
    `class="${IB_BUTTON} ${inputButtonSurfaceVariants({ state: "enabled", hover: "group", invalid: false })}"`,
    'aria-haspopup="dialog"',
    'aria-expanded="true"',
    `aria-controls="${contentId}"`,
    'data-state="open"',
    'data-slot="popover-trigger"',
    `id="${controlId}"`,
    `aria-labelledby="${labelId} ${uid}value"`,
  ]);
  return `<div data-slot="field" class="${FIELD_ROOT}"><div data-slot="field-header" class="${FIELD_HEADER}"><label id="${labelId}" for="${controlId}" class="${FIELD_LABEL} ${FIELD_LABEL_WEIGHT.medium}">${esc(label)}</label></div>${inputButtonBox({ size: "medium", value, icon, trigger, valueId: `${uid}value` })}<span class="sr-only" aria-live="polite"></span></div>`;
}

// <PopoverContent align="start" aria-label>(머리 없음) + 감싼 div(Radix 의 popper 감싸개 — 칸 아래 8 · 왼쪽 맞춤)
function popoverStage({ uid, title, label, value, icon, body, footer, height }) {
  const content = attrs([
    'data-side="bottom"',
    'data-align="start"',
    'role="dialog"',
    `id="${uid}"`,
    'data-state="open"',
    'tabindex="-1"',
    'data-slot="popover-content"',
    `aria-label="${esc(label)}"`,
    `class="${POP_CONTENT}"`,
    // Radix 가 재는 가용 폭 · 높이 — 미리보기는 넉넉히 적었다
    'style="--radix-popover-content-available-width:560px; --radix-popover-content-available-height:600px;"',
  ]);
  const popover = `<div data-radix-popper-content-wrapper="" style="position:absolute; left:0; top:calc(100% + var(--spacing-x2)); min-width:max-content; z-index:var(--z-floating);"><div ${content}><div data-slot="popover-body" class="${POP_BODY} ${POP_BODY_PLAIN}">${body}</div><div data-slot="popover-footer" class="${POP_FOOTER}">${footer.join("")}</div></div></div>`;
  const field = pickField({ uid: `${uid}-field`, label: title.field, value, icon, contentId: uid });
  return `<div style="${STAGE({ height })}"><div style="padding:var(--spacing-x6) var(--spacing-x8);"><div aria-hidden="true" style="${PAGE_TITLE} margin-bottom:var(--spacing-x4);">${esc(title.page)}</div><div style="padding:var(--spacing-x4) var(--spacing-x6) var(--spacing-x6); border-radius:var(--radius-r4); background:var(--color-bg-layer-default);"><div style="position:relative; display:flex; flex-direction:column; align-items:flex-start; max-width:400px;">${field}${popover}</div></div></div></div>`;
}

// 이름표 아래 견본 — 시트 · 팝오버를 세로로 쌓는다
const CAPTION =
  "font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2); min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;
const stack = (items) => `<div style="display:flex; flex-direction:column; gap:var(--spacing-x6);">${items.join("")}</div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

// 연 · 월 — 예산은 2021 ~ 2031 년(연의 범위는 자리마다 정한다). 항목은 날짜 표기 그대로 "2026년" · "10월", 칼럼은 연 120 오른쪽 · 월 96 왼쪽 정렬(달력의 연 · 월 휠과 같은 모양)
const YEARS = Array.from({ length: 11 }, (_, i) => ({ value: String(2021 + i), label: `${2021 + i}년` }));
const MONTHS = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}월` }));
const monthWheel = () =>
  wheelPicker({
    ariaLabel: "월 선택",
    columns: [
      { ariaLabel: "연도", options: YEARS, value: "2026", align: "right", className: "w-[120px]" },
      { ariaLabel: "월", options: MONTHS, value: "10", align: "left", className: "w-[96px]", loop: true },
    ],
  });

export const wheelPickerExamples = [
  {
    title: "달만 고르기 — \"완료\" 로 넣는다",
    description:
      "예산 · 홈 · 카드 실적처럼 달만 고르는 자리는 연 | 월 두 칼럼 휠을 1280 미만 시트 · 이상 팝오버로 열고 \"완료\" 로 넣는다 — 달력 머리의 연 · 월 휠과 같은 모양이고, 4 × 3 월 격자는 두지 않는다. 휠은 role=\"group\" 에 이름(aria-label — 필수), 칼럼은 spinbutton 에 이름(\"연도\" · \"월\")이다. 칼럼 폭은 달력 머리의 연 · 월 휠과 같이 연 120 · 월 96 으로 고정하고(className=\"w-[120px]\" · \"w-[96px]\" — 칼럼의 w-max 를 바꾼다), 연은 오른쪽(align=\"right\") · 월은 왼쪽(align=\"left\")에 맞춰 가운데에 모은다. 항목은 날짜 표기 그대로 \"2026년\" · \"10월\" 이다. 연은 처음 · 끝에서 멈추고, 월은 반복(loop)이라 12월 다음에 1월이 이어진다. 휠은 medium(항목 44 · 글자 26 / 35 · 500 — 글자 크기 설정을 따르지 않는 px) 5칸(220)이 기본이고, 칼럼 묶음은 휠 가운데다(폭을 정하지 않은 칼럼은 항목 글 폭 + 좌우 16). 가운데 띠(bg-neutral-weak · 모서리 8 · 휠 좌우 끝에서 16 들임)에 걸친 글자만 fg-neutral, 둘레는 fg-disabled 이고 위아래 끝은 안개(min(높이 × 40%, 항목 3칸) — 5칸 88)로 바탕색까지 흐린다. 값은 휠이 멈춘 뒤에 한 번 정해지고(onValueChange), \"완료\" 가 칸에 넣는다.",
    jsx: `import { WheelPicker, WheelPickerColumn } from "@/components/ui/wheel-picker"

<WheelPicker aria-label="월 선택">
  <WheelPickerColumn aria-label="연도" options={years} align="right" className="w-[120px]" value={draft.year} onValueChange={(year) => setDraft({ ...draft, year })} />
  <WheelPickerColumn aria-label="월" options={months} align="left" className="w-[96px]" loop value={draft.month} onValueChange={(month) => setDraft({ ...draft, month })} />
</WheelPicker>
<Button onClick={() => { setMonth(draft); setOpen(false) }}>완료</Button>`,
    render: () =>
      stack([
        labeled(
          bottomSheet({
            uid: "wheel-picker-ex-sheet",
            title: "월 선택",
            height: 500,
            pageHtml: page("예산", [["월", "2026년 10월"], ["식비", "450,000원"]]),
            body: monthWheel(),
            footer: [button({ size: "large", label: "완료" })],
          }),
          "1280 미만 — BottomSheet · 연 | 월 휠 220",
        ),
        labeled(
          popoverStage({
            uid: "wheel-picker-ex-pop",
            title: { page: "예산", field: "월" },
            label: "월 선택",
            value: "2026년 10월",
            icon: "chevronDown",
            height: 520,
            body: monthWheel(),
            footer: [button({ size: "small", label: "완료" })],
          }),
          "1280 이상 — Popover",
        ),
      ]),
  },
];
