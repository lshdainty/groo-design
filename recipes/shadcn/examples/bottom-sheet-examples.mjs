/*
 * shadcn Bottom Sheet 예제 — docs site components/bottom-sheet.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(고르기 — 기간 · 입력 폼)은 차례 · 제목 · 코드가 specs/components/bottom-sheet.md 의
 * "코드" 절과 같고(목록을 담은 본문에 className="px-0" 만 더했다 — 줄이 제 좌우 24 를 가진다), 뒤의 셋(본문 끝 흐림 · 손잡이 · 닫기 버튼)은
 * md 의 Properties 를 코드로 더 보인다.
 *
 * OVERLAY · CONTENT · CLOSE · HANDLE · BODY · BODY_PLAIN · BODY_FOG 는 recipes/shadcn/components/ui/bottom-sheet.tsx 의 상수와, HEADER · TITLE ·
 * TITLE_WITH_CLOSE · DESCRIPTION · SNAP_HEIGHT · FOOTER 는 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다.
 * 끝 흐림의 SOLID · fogStyle 은 scroll-fog.tsx 의 useScrollFog 와 같은 셈이다 — 레시피는 그릴 때 토큰 --gradient-fade-mask 에 방향을 붙여 본문의
 * style(mask-*) · data-fog-axis 로 넣고, 정적 HTML 은 같은 일을 빌드 때 DESIGN.md 의 토큰 값으로 해 style 에 적었다.
 * 둘레의 부품은 그 레시피의 값을 옮겨 썼다 — BUTTON_* 는 button.tsx(button-examples.mjs), LIST_* · RADIOMARK_* · DOT_* 는 list.tsx ·
 * radio-group.tsx(list-examples.mjs), INPUT_* 는 input.tsx(input-examples.mjs), IB_* 는 input-button.tsx(input-button-examples.mjs),
 * FIELD_* 는 field.tsx 의 것과 같다 — 이 파일이 쓰는 변형 · 크기와 그에 걸리는 compound 만 옮겼다.
 * 규칙은 specs/components/bottom-sheet.md, 수치 원본은 specs/components/bottom-sheet.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 딤 <div data-slot="bottom-sheet-overlay"> 와 시트 <div role="dialog" data-slot="bottom-sheet-content">
 * > (손잡이 <div data-slot="bottom-sheet-handle">) · 머리 <div data-slot="bottom-sheet-header">(제목 <h2> · 설명 <p>) · 닫기
 * <button data-slot="bottom-sheet-close"> · 본문 <div data-slot="bottom-sheet-body"> · 바닥 <div data-slot="bottom-sheet-footer">.
 * vaul · Radix 가 실행 중에 붙이는 것 중 열림(data-state="open")과 vaul 의 표식(data-vaul-drawer · data-vaul-overlay · data-vaul-snap-points —
 * 클래스가 읽는다) · 이름 잇기(id · aria-labelledby · aria-describedby) · tabindex="-1" 을 그리고, 스냅 높이로 내려 둔 자리(vaul 의 인라인
 * transform)도 그린다. 바닥 버튼의 크기(large 48)는 레시피의 Footer 가 크기를 주지 않은 버튼에 넣는다 — md 코드는 size="large" 를 적었다.
 * 시트는 화면(fixed)에 뜬다 — 미리보기 틀(STAGE)에 transform 을 줘 fixed 의 기준을 틀로 바꾸고, isolation 으로 z-index(딤 z-modal 100 · 시트 z-modal-content 101)를
 * 틀 안에 가둔다(사이트 머리 막대 위로 올라오지 않게). 높이 상한 max-h-[90dvh] · 스냅 높이 h-[90dvh] 는 창 높이를 따르므로 미리보기는
 * 틀 높이의 90% 를 style 로 한 번 더 적는다(SHEET_FIT — 미리보기용 덧칠). 틀 안의 뒤 화면(가계부 줄)은 미리보기 그림이다.
 * 사이트의 `.content p { margin: 12px 0; color: text-primary }` 는 층(@layer) 밖 규칙이라 Tailwind utility 를 늘 이긴다 — <p> 에는
 * 클래스가 정한 바깥 여백 · 글자색을 style 로 한 번 더 적는다(P_FIX). 모션 클래스는 vaul 의 키프레임을 읽는데 사이트에는 vaul 의 CSS 가 없다 —
 * 열린 순간을 멈춘 그림이다. 레시피의 스크립트(끌기 · 바깥 누르기 · Esc · 뒤로 가기 · 바뀐 값 묻기 · 초점)는 정적 HTML 에 없다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

import { readFileSync } from "node:fs";

// ── bottom-sheet.tsx 의 상수와 같은 값 ─────────────────────────────────────

// 딤 — 300ms enter 로 나타나고 200ms exit 로 사라진다(모션 줄이기면 150ms). 끄는 동안은 손가락을 바로 따른다
const OVERLAY = [
  "fixed inset-0 z-(--z-modal) bg-[var(--overlay-dim-light)] dark:bg-[var(--overlay-dim-dark)]",
  "[animation-duration:var(--sheet-anim-duration)]! [animation-timing-function:var(--sheet-anim-ease)]!",
  "data-[state=open]:[--sheet-anim-duration:var(--motion-duration-d6)] data-[state=open]:[--sheet-anim-ease:var(--motion-ease-enter)]",
  "data-[state=closed]:[--sheet-anim-duration:var(--motion-duration-d4)] data-[state=closed]:[--sheet-anim-ease:var(--motion-ease-exit)]",
  "motion-reduce:data-[state]:data-[vaul-overlay]:[--sheet-anim-duration:var(--motion-duration-d3)]",
  "[&:not(:has(+.vaul-dragging))]:[transition:opacity_var(--motion-duration-d4)_var(--motion-ease-exit)]!",
].join(" ");

// 시트 — 최대 480 가운데, 위 모서리 r6, 내용만큼(최대 90%), 바닥 아래 안전 영역
const CONTENT = [
  "fixed inset-x-0 bottom-0 z-(--z-modal-content) mx-auto flex max-h-[90dvh] w-full max-w-[480px] flex-col",
  "rounded-t-r6 bg-bg-layer-floating pb-[env(safe-area-inset-bottom)] font-sans text-fg-neutral outline-none",
  "[animation-duration:var(--sheet-anim-duration)]! [animation-timing-function:var(--sheet-anim-ease)]!",
  "data-[state=open]:[--sheet-anim-duration:var(--motion-duration-d6)] data-[state=open]:[--sheet-anim-ease:var(--motion-ease-enter-expressive)]",
  "data-[state=closed]:[--sheet-anim-duration:var(--motion-duration-d4)] data-[state=closed]:[--sheet-anim-ease:var(--motion-ease-exit)]",
  "[&:not(.vaul-dragging)]:[transition:transform_var(--sheet-move-duration)_var(--sheet-move-ease)]!",
  "[--sheet-move-duration:var(--motion-duration-d4)] [--sheet-move-ease:var(--motion-ease-exit)]",
  "data-[vaul-snap-points=true]:[--sheet-move-duration:var(--motion-duration-d6)] data-[vaul-snap-points=true]:[--sheet-move-ease:var(--motion-ease-enter-expressive)]",
  "motion-reduce:data-[state=open]:[animation-name:fadeIn]! motion-reduce:data-[state=closed]:[animation-name:fadeOut]!",
  "motion-reduce:data-[state]:data-[vaul-drawer]:[--sheet-anim-duration:var(--motion-duration-d3)]",
  "motion-reduce:data-[vaul-drawer]:data-[vaul-snap-points]:[--sheet-move-duration:0s]",
].join(" ");

// 닫기 — 28 원 · 아이콘 14, 누르는 영역 44(::before). 누르면 bg-neutral-weak-pressed + 2px 거리 축소(기준 28 → 0.929)
const CLOSE = [
  "absolute right-global-gutter top-x6 flex size-7 cursor-pointer items-center justify-center rounded-full border-0 bg-bg-neutral-weak p-0 text-fg-neutral [&>svg]:size-3.5",
  "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed [--press-basis:28] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

// 손잡이 — 36 × 4 · 위 6 가운데, 누르는 영역 44. 누름 색은 두지 않는다
const HANDLE = [
  "absolute left-1/2 top-x1_5 h-1 w-9 -translate-x-1/2 cursor-pointer rounded-full bg-stroke-neutral-weak",
  "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
].join(" ");

// ── bottom-sheet.tsx 의 JSX 에 적힌 클래스 ─────────────────────────────────

// 머리 — 위 24 · 아래 16 · 좌우 화면 여백 24 · 사이 8
const HEADER = "flex shrink-0 flex-col gap-x2 px-global-gutter pb-x4 pt-x6";
// 제목 t8 22 / 30 · 700 — 닫기 버튼이 있으면 cn(TITLE, TITLE_WITH_CLOSE)(오른쪽 64 = 24 + 원 28 + 12)
const TITLE = "m-0 text-t8 font-bold text-fg-neutral";
const TITLE_WITH_CLOSE = "pr-x10";
// 설명 t5 · fg-neutral-muted
const DESCRIPTION = "m-0 text-t5 font-normal text-fg-neutral-muted";
// 스냅 높이를 두면 시트를 화면의 90% 높이로 둔다 — cn(CONTENT, SNAP_HEIGHT)
const SNAP_HEIGHT = "h-[90dvh]";
// 본문 — 좌우 24, 넘치면 이 안에서 스크롤. 바닥이 없어 맨 끝이면 아래 16(BODY_PLAIN). 레시피는 cn(BODY, scrollFog ? BODY_FOG : BODY_PLAIN, className)
const BODY = "min-h-0 flex-1 overflow-y-auto overscroll-contain px-global-gutter";
const BODY_PLAIN = "last:pb-x4";
// 끝 흐림(scrollFog) — 본문 안 여백 위 20 · 아래 80(바닥이 있어도), 스크롤 여유도 위 20 · 아래 80
const BODY_FOG = "pt-[20px] pb-[80px] scroll-pt-[20px] scroll-pb-[80px]";
// 바닥 — 위 12 · 아래 16(그 아래 안전 영역은 시트가 둔다), 버튼 하나면 폭 전체 · 둘이면 반씩(사이 8)
const FOOTER = "flex shrink-0 gap-x2 px-global-gutter pb-x4 pt-x3 [&>*]:min-w-0 [&>*]:flex-1";

// ── button.tsx 의 cva 와 같은 값 — 바닥 버튼(large 48) ─────────────────────

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
  },
  size: {
    large: "h-12 rounded-r3 [--press-basis:48] [--progress-size:18px]",
  },
  layout: { withText: "", iconOnly: "" },
  ghostColor: { neutral: "", neutralSubtle: "", brand: "", critical: "" },
  flush: { left: "", right: "" },
};

const BUTTON_COMPOUND = [{ size: "large", layout: "withText", className: "px-x5 py-x3 gap-x2 text-t6 [&_svg]:size-[22px]" }];

const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// ── list.tsx · radio-group.tsx 의 cva 와 같은 값 — 고르는 목록 · 보기만 하는 줄 ──

const LIST_BASE = "flex w-full flex-col";

const LIST_ITEM_BASE = [
  "group/list-item relative flex w-full",
  "before:pointer-events-none before:absolute before:inset-y-0 before:inset-x-0 before:rounded-none before:bg-transparent before:content-['']",
  "before:[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),inset_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-radius_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:inset-x-x1_5 [@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:rounded-[var(--list-item-radius,var(--radius-r2_5))] [@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:bg-bg-layer-default-pressed",
  "has-[[data-list-action]:not([data-disabled]):active]:before:inset-x-x1_5 has-[[data-list-action]:not([data-disabled]):active]:before:rounded-[var(--list-item-radius,var(--radius-r2_5))] has-[[data-list-action]:not([data-disabled]):active]:before:bg-bg-layer-default-pressed",
].join(" ");
const LIST_ITEM_VARIANTS = {
  highlight: {
    none: "",
    highlighted:
      "before:bg-bg-brand-weak [@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:bg-bg-brand-weak-pressed has-[[data-list-action]:not([data-disabled]):active]:before:bg-bg-brand-weak-pressed",
  },
};
const LIST_ITEM_DEFAULTS = { highlight: "none" };

const LIST_CONTENT_BASE = [
  "relative flex w-full py-x3",
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "group-has-[[data-list-action]:not([data-disabled]):active]/list-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-has-[[data-list-action]:not([data-disabled]):active]/list-item:[scale:1]",
].join(" ");
const LIST_CONTENT_VARIANTS = { align: { center: "items-center", top: "items-start" }, nest: { none: "px-global-gutter", parent: "pl-x1 pr-global-gutter", child: "pl-[104px] pr-global-gutter" } };
const LIST_CONTENT_DEFAULTS = { align: "center", nest: "none" };

const LIST_BODY_BASE = "flex min-w-[calc(var(--text-t5)+var(--spacing-x2_5))] flex-1 flex-col items-start gap-x0_5 pr-x2_5 text-left";

const LIST_TITLE_BASE = "font-sans text-t5 font-normal text-fg-neutral [overflow-wrap:anywhere]";
const LIST_TITLE_VARIANTS = { disabled: { true: "text-fg-disabled", false: "" } };
const LIST_TITLE_DEFAULTS = { disabled: false };

const LIST_HIGHLIGHT_MUTED =
  "[@media(hover:hover)]:group-has-[[data-list-action]:not([data-disabled]):hover]/list-item:text-fg-neutral-muted group-has-[[data-list-action]:not([data-disabled]):active]/list-item:text-fg-neutral-muted";

const LIST_SUFFIX_BASE =
  "flex items-center gap-x1 font-sans text-t5 text-fg-neutral-subtle [&>svg]:size-[18px] [&_a]:relative [&_a]:z-[1] [&_button]:relative [&_button]:z-[1]";
const LIST_SUFFIX_VARIANTS = {
  value: { node: "shrink-0", text: "min-w-0 shrink [overflow-wrap:anywhere]" },
  disabled: { true: "text-fg-disabled", false: "" },
  highlighted: { true: LIST_HIGHLIGHT_MUTED, false: "" },
};
const LIST_SUFFIX_COMPOUND = [{ disabled: false, highlighted: true, class: "[&>svg]:text-fg-neutral-subtle" }];
const LIST_SUFFIX_DEFAULTS = { value: "node", disabled: false, highlighted: false };

const LIST_CONTROL_BASE = "cursor-pointer select-none data-[disabled]:cursor-not-allowed";

// 끼운 컨트롤은 따로 줄지 않는다 — 레시피는 cn(radiomarkVariants, MARK_NO_SCALE)
const MARK_NO_SCALE = "active:[scale:1]";

const RADIOMARK_BASE = [
  "peer relative inline-grid shrink-0 cursor-pointer place-items-center rounded-full",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "active:[scale:calc(1-2/var(--press-basis))] group-active/radio:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1] motion-reduce:group-active/radio:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed disabled:[scale:1]",
  "border border-stroke-neutral-solid bg-transparent hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed group-hover/radio:bg-bg-layer-default-pressed group-active/radio:bg-bg-layer-default-pressed",
  "disabled:border-stroke-neutral-weak disabled:bg-bg-disabled",
  "data-[state=checked]:border-0 data-[state=checked]:disabled:bg-bg-disabled",
].join(" ");
const RADIOMARK_VARIANTS = {
  size: {
    medium: "size-5 [--press-basis:24]",
    large: "size-6 [--press-basis:24]",
  },
  tone: {
    neutral:
      "data-[state=checked]:bg-bg-neutral-inverted data-[state=checked]:hover:bg-bg-neutral-inverted-pressed data-[state=checked]:active:bg-bg-neutral-inverted-pressed data-[state=checked]:group-hover/radio:bg-bg-neutral-inverted-pressed data-[state=checked]:group-active/radio:bg-bg-neutral-inverted-pressed",
  },
};
const RADIOMARK_DEFAULTS = { size: "medium", tone: "neutral" };

const DOT_BASE =
  "pointer-events-none block rounded-full bg-transparent [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)] data-[disabled]:data-[state=checked]:bg-fg-disabled";
const DOT_VARIANTS = {
  size: { medium: "size-2", large: "size-2.5" },
  tone: { neutral: "data-[state=checked]:bg-fg-neutral-inverted" },
};
const DOT_DEFAULTS = { size: "medium", tone: "neutral" };

// ── input.tsx 의 cva 와 같은 값 — 금액 칸(상자형 large · 뒤 글자) ─────────────

const INPUT_ROOT_BASE = [
  "relative flex w-full min-w-0 items-center overflow-hidden bg-transparent font-sans",
  "cursor-text data-[disabled]:cursor-not-allowed",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-solid after:border-transparent after:content-['']",
  "after:[transition:border-color_var(--motion-duration-d2)_var(--motion-ease-easing)]",
  "[&:has(input:focus):not([data-invalid]):not([data-readonly])]:after:border-stroke-neutral-contrast",
  "data-[invalid]:after:border-stroke-critical-solid",
].join(" ");
const INPUT_ROOT_VARIANTS = {
  variant: {
    outline: "shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] after:border-2 data-[disabled]:bg-bg-disabled data-[readonly]:bg-bg-disabled",
    underline: "rounded-none shadow-[inset_0_-1px_0_0_var(--color-stroke-neutral-weak)] after:border-b-2",
  },
  size: { large: "", medium: "", responsive: "" },
};
const INPUT_ROOT_COMPOUND = [
  {
    variant: "outline",
    size: "large",
    className: "min-h-13 gap-x2_5 rounded-r3 text-t5 [--text-input-px:var(--spacing-x4)] [--text-input-icon:20px] [--text-input-clear:22px]",
  },
];
const INPUT_ROOT_DEFAULTS = { variant: "outline", size: "responsive" };
// 뒤 글자 — 레시피는 cn(INPUT_AFFIX_TEXT, INPUT_AFFIX_EDGE, 색)
const INPUT_AFFIX_EDGE = "first:ml-[var(--text-input-px)] last:mr-[var(--text-input-px)]";
const INPUT_AFFIX_TEXT = "shrink-0";
const INPUT_AFFIX_COLOR = "text-fg-neutral-subtle";
// 입력(<input>) — 레시피는 cn(INPUT_VALUE_BASE, 값 색)
const INPUT_VALUE_BASE = [
  "min-w-0 flex-1 self-stretch border-0 bg-transparent p-0 outline-none [font:inherit]",
  "first:pl-[var(--text-input-px)] last:pr-[var(--text-input-px)] disabled:cursor-not-allowed",
  "[&:-webkit-autofill]:bg-clip-text [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-fg-neutral)] [&:-webkit-autofill]:[transition:background-color_9999s_9999s]",
].join(" ");
const INPUT_VALUE_COLOR = "text-fg-neutral placeholder:text-fg-placeholder";

// ── input-button.tsx 의 cva · 클래스와 같은 값 — 날짜 칸(large) ───────────────

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
const IB_ROOT = "group/input-button relative isolate flex w-full min-w-0 items-center";
const IB_BUTTON = "peer/input-button absolute inset-0 m-0 appearance-none rounded-[inherit] border-0 p-0";
const IB_CONTENT =
  "relative flex min-w-0 flex-1 select-none items-center gap-[inherit] pointer-events-none [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const IB_CONTENT_PRESS = "peer-active/input-button:[scale:calc(1-2/var(--press-basis))] motion-reduce:peer-active/input-button:[scale:1]";
const IB_ICON = "flex shrink-0 [&>svg]:size-[var(--input-button-icon)]";
const IB_VALUE = "min-w-0 flex-1 truncate text-left";
const IB_ICON_COLOR = "text-fg-neutral-muted";
const IB_VALUE_COLOR = "text-fg-neutral";

// ── field.tsx 의 클래스 — 칸을 감싸는 둘레(라벨만) ──────────────────────────

const FIELD_ROOT = "flex w-full min-w-0 flex-col gap-x2";
const FIELD_HEADER = "flex items-center justify-between gap-x2_5 px-x0_5";
const FIELD_LABEL = "min-w-0 font-sans text-t5 text-fg-neutral";
const FIELD_LABEL_WEIGHT = { medium: "font-medium", bold: "font-bold" };

// 사이트의 `.content p` 를 덮는 미리보기용 덧칠 — 설명의 바깥 여백 0 · 글자색
const P_FIX = { description: "margin:0; color:var(--color-fg-neutral-muted);" };

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다.
// 참 · 거짓 축(disabled · highlighted · invalid)은 cva 처럼 "true" · "false" 글자 키로 찾고, compound 는 값 그대로 견준다
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
const listVariants = cvaOf(LIST_BASE);
const listItemVariants = cvaOf(LIST_ITEM_BASE, { variants: LIST_ITEM_VARIANTS, defaultVariants: LIST_ITEM_DEFAULTS });
const listContentVariants = cvaOf(LIST_CONTENT_BASE, { variants: LIST_CONTENT_VARIANTS, defaultVariants: LIST_CONTENT_DEFAULTS });
const listBodyVariants = cvaOf(LIST_BODY_BASE);
const listTitleVariants = cvaOf(LIST_TITLE_BASE, { variants: LIST_TITLE_VARIANTS, defaultVariants: LIST_TITLE_DEFAULTS });
const listSuffixVariants = cvaOf(LIST_SUFFIX_BASE, {
  variants: LIST_SUFFIX_VARIANTS,
  compoundVariants: LIST_SUFFIX_COMPOUND,
  defaultVariants: LIST_SUFFIX_DEFAULTS,
});
const listControlVariants = cvaOf(LIST_CONTROL_BASE);
const radiomarkVariants = cvaOf(RADIOMARK_BASE, { variants: RADIOMARK_VARIANTS, defaultVariants: RADIOMARK_DEFAULTS });
const radiomarkDotVariants = cvaOf(DOT_BASE, { variants: DOT_VARIANTS, defaultVariants: DOT_DEFAULTS });
const textInputVariants = cvaOf(INPUT_ROOT_BASE, {
  variants: INPUT_ROOT_VARIANTS,
  compoundVariants: INPUT_ROOT_COMPOUND,
  defaultVariants: INPUT_ROOT_DEFAULTS,
});
const inputButtonVariants = cvaOf(IB_SIZE_BASE, { variants: IB_SIZE_VARIANTS, defaultVariants: IB_SIZE_DEFAULTS });
const inputButtonSurfaceVariants = cvaOf(IB_SURFACE_BASE, {
  variants: IB_SURFACE_VARIANTS,
  compoundVariants: IB_SURFACE_COMPOUND,
  defaultVariants: IB_SURFACE_DEFAULTS,
});

// "motion-reduce:active:[scale:1]" → ["motion-reduce", "active", "[scale:1]"] — 괄호 안의 ":" 는 가르지 않는다
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
// 배경 · 좌우 여백 · 임의 속성([prop:…]). 그래서 라디오의 active:[scale:1](MARK_NO_SCALE)이 active:[scale:calc(…)] 를, 목록을 담은
// 본문의 px-0 이 px-global-gutter 를, 누른 닫기의 bg-bg-neutral-weak-pressed 가 bg-bg-neutral-weak 를 지운다
const GROUPS = [
  [/^bg-/, "bg"],
  [/^px-/, "px"],
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

// 정적 미리보기에서 누름 · 포커스를 보이려고 — 그 상태의 클래스(active: · focus-visible:)에서 접두어만 뗀 사본을 뒤에 붙인다
// (merge 가 겹치는 기본값을 지운다). 값은 레시피 그대로라 bottom-sheet.tsx 가 바뀌면 같이 따라간다
function forceState(classList, state) {
  return classList
    .split(" ")
    .flatMap((cls) => {
      const segs = splitVariants(cls);
      const i = segs.indexOf(state);
      return i === -1 || i === segs.length - 1 ? [] : [segs.filter((_, j) => j !== i).join(":")];
    })
    .join(" ");
}

const forced = (classList, state) => merge(`${classList} ${forceState(classList, state)}`);

// ── 끝 흐림 — scroll-fog.tsx 의 useScrollFog 와 같은 셈(overlayBody · 세로) ─────────

// 토큰 값 — 레시피는 그릴 때 getComputedStyle 로 읽는다. 정적 HTML 은 DESIGN.md 의 v104 표에서 읽는다
const FADE_MASK = /`gradient-fade-mask` \| `(linear-gradient\([^`]+\))`/.exec(readFileSync(new URL("../../../DESIGN.md", import.meta.url), "utf8"))[1];
const SOLID = "linear-gradient(#000, #000)";
const withDirection = (token, direction) => token.replace(/^linear-gradient\(/, `linear-gradient(${direction}, `);
// 겹친 층을 곱한다 — scroll-fog.tsx 의 COMPOSITE 와 같은 값(-webkit- 쪽은 옛 이름 source-in)
const COMPOSITE = { "mask-composite": "intersect", "-webkit-mask-composite": "source-in" };
// 위 20 · 아래 80 — 흐린 쪽마다 상자 전체 크기의 층 하나(단계는 그 쪽 깊이의 몫 — 깊이 안에서 불투명에 닿는다), 두 층을 곱한다.
// 상자의 style 에 mask-* 와 -webkit-mask-* 를 같이 넣는다
function fogStyle(start = "20px", end = "80px") {
  const layer = (depth, direction) =>
    parseFloat(depth) > 0 ? withDirection(FADE_MASK.replace(/(\d+(?:\.\d+)?)%/g, (_m, p) => `calc(${depth} * ${Number(p) / 100})`), direction) : SOLID;
  const mask = {
    image: `${layer(start, "to bottom")}, ${layer(end, "to top")}`,
    size: "100% 100%, 100% 100%",
    position: "0 0, 0 0",
    repeat: "no-repeat",
  };
  return [
    ...["image", "size", "position", "repeat"].map((p) => `mask-${p}:${mask[p]}; -webkit-mask-${p}:${mask[p]};`),
    ...Object.entries(COMPOSITE).map(([p, v]) => `${p}:${v};`),
  ].join(" ");
}

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기는 감싼 자리의 [&>svg]:size-* 가 정한다
const svg = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const ICONS = {
  x: svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  calendarDays: svg(
    '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/>',
  ),
};

// 미리보기 틀 — 레시피의 딤 · 시트는 화면(fixed)에 뜬다. transform 이 fixed 의 기준을 틀로 바꾸고 isolation 이 z-index 를 틀 안에 가둔다.
// 폭은 휴대폰(360)이다 — 시트는 1280 미만에서 쓴다
const STAGE = (height) =>
  `position:relative; isolation:isolate; transform:translateZ(0); overflow:hidden; width:100%; max-width:360px; height:${height}px; margin:0 auto; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-default);`;
// 높이 상한(90dvh)을 틀 높이로 — 레시피에는 없는 미리보기용 덧칠
const SHEET_FIT = (height) => `max-height:${Math.round(height * 0.9)}px;`;
// 뒤 화면 — 가계부 줄(미리보기 그림). 시트가 열린 동안 보조 기술에는 숨는다
const PAGE_ROW =
  "display:flex; justify-content:space-between; gap:var(--spacing-x3); padding:var(--spacing-x3) 0; font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const page = () =>
  `<div aria-hidden="true" style="padding:var(--spacing-x6); font-family:var(--font-sans);"><div style="margin-bottom:var(--spacing-x2); font-size:var(--text-t7); line-height:var(--text-t7--line-height); font-weight:700; color:var(--color-fg-neutral);">가계부</div>${[
    ["김밥천국", "8,000원"],
    ["버스", "1,500원"],
    ["다이소", "12,300원"],
    ["월급", "3,200,000원"],
  ]
    .map(([title, amount]) => `<div style="${PAGE_ROW}"><span>${title}</span><span style="font-weight:700;">${amount}</span></div>`)
    .join("")}</div>`;

// <Button> — button.tsx 그대로(cn(buttonVariants({ variant, size }))). 바닥은 크기를 주지 않은 버튼에 large 를 넣는다.
// type 은 코드가 넘길 때만 붙는다 — <Button> 은 type 을 정하지 않는다
const button = ({ variant, label, type }) =>
  `<button ${attrs([`class="${buttonVariants({ variant, size: "large" })}"`, type && `type="${type}"`])}>${esc(label)}</button>`;

// 닫기 버튼 — force = "pressed" · "focused" 는 미리보기용 강제 상태
function closeButton(force) {
  const cls = force === "pressed" ? forced(CLOSE, "active") : force === "focused" ? forced(CLOSE, "focus-visible") : CLOSE;
  return `<button type="button" aria-label="닫기" data-slot="bottom-sheet-close" class="${cls}">${ICONS.x}</button>`;
}

// <BottomSheet open> + <BottomSheetContent>. uid 는 Radix 가 만드는 id 의 앞말(예제마다 달리한다).
// body = { html, className, scrollFog } · footer = 버튼 HTML 배열 · snap = 스냅 높이(0 ~ 1 — 손잡이를 달고 시트를 90% 높이로 둔 뒤 그 높이까지 내린다).
// scrollFog 는 끝 흐림(늘 켜짐 — 위 20 · 아래 80), 넘친 본문의 Tab 자리(tabindex 0)는 레시피가 재서 단다 — 그 순간을 멈춰 적는다(overflow)
function bottomSheet({ uid, title, description, body, footer = [], snap, form = false, close = true, height = 600 }) {
  const titleId = `${uid}-title`;
  const descriptionId = `${uid}-description`;
  const snaps = snap != null;
  const translate = snaps ? Math.round(height * (0.9 - snap)) : 0;
  const content = attrs([
    'role="dialog"',
    `id="${uid}"`,
    description != null && `aria-describedby="${descriptionId}"`,
    `aria-labelledby="${titleId}"`,
    'data-state="open"',
    'tabindex="-1"',
    'data-vaul-drawer=""',
    'data-vaul-drawer-direction="bottom"',
    `data-vaul-snap-points="${snaps}"`,
    'data-slot="bottom-sheet-content"',
    form && 'data-form="true"',
    'aria-modal="true"',
    `class="${snaps ? `${CONTENT} ${SNAP_HEIGHT}` : CONTENT}"`,
    // 미리보기용 — 높이 상한 · 스냅 높이를 틀 높이로, 스냅 높이로 내려 둔 자리(vaul 의 transform)
    `style="${SHEET_FIT(height)}${snaps ? ` height:${Math.round(height * 0.9)}px; transform:translate3d(0, ${translate}px, 0);` : ""}"`,
  ]);
  const handle = snaps ? `<div aria-hidden="true" data-slot="bottom-sheet-handle" class="${HANDLE}"></div>` : "";
  const header = `<div data-slot="bottom-sheet-header" class="${HEADER}"><h2 id="${titleId}" data-slot="bottom-sheet-title" class="${close ? `${TITLE} ${TITLE_WITH_CLOSE}` : TITLE}">${esc(title)}</h2>${
    description != null ? `<p id="${descriptionId}" data-slot="bottom-sheet-description" class="${DESCRIPTION}" style="${P_FIX.description}">${esc(description)}</p>` : ""
  }</div>`;
  const bodyClass = merge([BODY, body.scrollFog ? BODY_FOG : BODY_PLAIN, body.className].filter(Boolean).join(" "));
  const bodyHtml = `<div ${attrs([
    'data-slot="bottom-sheet-body"',
    body.scrollFog && 'data-scroll-fog="overlayBody"',
    `class="${bodyClass}"`,
    body.overflow && 'tabindex="0"',
    body.scrollFog && 'data-fog-axis="y"',
    body.scrollFog && `style="${fogStyle()}"`,
  ])}>${body.html}</div>`;
  const footerHtml = footer.length ? `<div data-slot="bottom-sheet-footer" class="${FOOTER}">${footer.join("")}</div>` : "";
  const overlay = `<div data-vaul-overlay="" data-vaul-snap-points="${snaps}" data-state="open" data-slot="bottom-sheet-overlay" class="${OVERLAY}"></div>`;
  return `<div style="${STAGE(height)}">${page()}${overlay}<div ${content}>${handle}${header}${close ? closeButton() : ""}${bodyHtml}${footerHtml}</div></div>`;
}

// <ListRadioGroup> + <ListRadioItem> — 하나 고르기 목록. 줄은 div > label(콘텐츠 층) > 본문 + 라디오 24(Radix RadioGroup.Item · Indicator)
function radioList({ uid, label, options, value }) {
  const rows = options.map((title, i) => {
    const id = `${uid}-radio${i}`;
    const checked = title === value;
    const state = `data-state="${checked ? "checked" : "unchecked"}"`;
    const mark = `<button ${attrs([
      'type="button"',
      'role="radio"',
      `aria-checked="${checked}"`,
      state,
      `value="${esc(title)}"`,
      `class="${merge(`${radiomarkVariants({ size: "large", tone: "neutral" })} ${MARK_NO_SCALE}`)}"`,
      `id="${id}"`,
      'data-list-action=""',
    ])}><span ${state} class="${radiomarkDotVariants({ size: "large", tone: "neutral" })}"></span></button>`;
    const content = `<span class="${listBodyVariants()}"><span class="${listTitleVariants({ disabled: false })}">${esc(title)}</span></span><span class="${listSuffixVariants({ disabled: false, highlighted: false })}">${mark}</span>`;
    return `<div class="${listItemVariants({ highlight: "none" })}"><label for="${id}" data-list-action="" class="${listContentVariants({ align: "center" })} ${listControlVariants()}">${content}</label></div>`;
  });
  return `<div role="radiogroup" class="${listVariants()}" aria-label="${esc(label)}">${rows.join("")}</div>`;
}

// <List> + <ListItem> — 보기만 하는 줄(제목 + 뒤 값 글자 — 글을 그대로 넘겨 레시피처럼 value text)
const valueList = (rows) =>
  `<ul class="${listVariants()}">${rows
    .map(
      ([title, value]) =>
        `<li class="${listItemVariants({ highlight: "none" })}"><div class="${listContentVariants({ align: "center" })}"><span class="${listBodyVariants()}"><span class="${listTitleVariants({ disabled: false })}">${esc(title)}</span></span><span class="${listSuffixVariants({ value: "text", disabled: false, highlighted: false })}">${esc(value)}</span></div></li>`,
    )
    .join("")}</ul>`;

// <Field label> — 머리(라벨) + 칸. control(controlId, labelId) 는 칸의 HTML 을 돌려준다
const field = (uid, label, control) =>
  `<div data-slot="field" class="${FIELD_ROOT}"><div data-slot="field-header" class="${FIELD_HEADER}"><label id="${uid}-label" for="${uid}-control" class="${FIELD_LABEL} ${FIELD_LABEL_WEIGHT.medium}">${esc(label)}</label></div>${control(`${uid}-control`, `${uid}-label`)}<span class="sr-only" aria-live="polite"></span></div>`;

// <Input size="large" suffix="원"> — 상자(div) > 입력 + 뒤 글자(설명으로 잇는다)
const amountInput = (id, value) =>
  `<div data-slot="text-input" data-variant="outline" data-size="large" class="${textInputVariants({ variant: "outline", size: "large" })}"><input type="text" data-slot="text-input-value" class="${INPUT_VALUE_BASE} ${INPUT_VALUE_COLOR}" inputmode="numeric" value="${esc(value)}" id="${id}" aria-describedby="${id}-suffix"><span id="${id}-suffix" data-slot="text-input-suffix" class="${INPUT_AFFIX_TEXT} ${INPUT_AFFIX_EDGE} ${INPUT_AFFIX_COLOR}">원</span></div>`;

// <InputButton size="large" suffixIcon={<CalendarDays />}> — 상자(div) > 배경 층 버튼 + 콘텐츠 층(값 · 뒤 아이콘). 이름은 라벨 + 값
function dateButton(id, labelId, value) {
  const valueId = `${id}value`;
  const button = attrs([
    'type="button"',
    'data-slot="input-button-trigger"',
    `class="${IB_BUTTON} ${inputButtonSurfaceVariants({ state: "enabled", hover: "group", invalid: false })}"`,
    'aria-haspopup="dialog"',
    'aria-expanded="false"',
    `id="${id}"`,
    `aria-labelledby="${labelId} ${valueId}"`,
  ]);
  return `<div data-slot="input-button" data-size="large" class="${IB_ROOT} ${inputButtonVariants({ size: "large" })}"><button ${button}></button><span data-slot="input-button-content" class="${IB_CONTENT} ${IB_CONTENT_PRESS}"><span id="${valueId}" aria-hidden="true" data-slot="input-button-value" class="${IB_VALUE} ${IB_VALUE_COLOR}">${esc(value)}</span><span aria-hidden="true" data-slot="input-button-suffix-icon" class="${IB_ICON} ${IB_ICON_COLOR}">${ICONS.calendarDays}</span></span></div>`;
}

// 떠 있는 표면 위의 버튼 하나 — 닫기 버튼 상태를 나란히 보인다(미리보기 그림)
const SWATCH =
  "position:relative; display:inline-grid; place-items:center; width:84px; height:76px; border-radius:var(--radius-r3); background:var(--color-bg-layer-floating); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle);";
// 버튼의 자리(absolute · 위 24 · 오른쪽 24)를 견본 칸 가운데로 — 미리보기용 덧칠
const SWATCH_PLACE = "position:relative; top:auto; right:auto;";
const CAPTION =
  "font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";

// ── 예제 ──────────────────────────────────────────────────────────────────

export const bottomSheetExamples = [
  {
    title: "고르기 — 기간",
    description:
      "1280 미만에서 고르기를 띄운다 — 늘 시트인 자리(Input Button 의 고르기 · 거르기)는 BottomSheet 를 바로 쓴다. 머리는 위 24 · 아래 16 · 좌우 화면 여백 24 에 제목 22 / 30 · 700, 설명 16 / 22 · fg-neutral-muted(사이 8)이다. 오른쪽 위 닫기(28 원 · 누르는 영역 44)는 조회 · 고르기 · 입력 폼 모두에 둔다. 바닥 버튼은 고른 것을 넣을 때만 두고, 둘이면 반씩 — 보조(초기화)를 왼쪽, 주 버튼을 오른쪽에 Button large 48 로 둔다. 조회 · 고르기 시트는 바깥(딤)을 누르거나 아래로 끌면 닫힌다. 목록은 줄이 제 좌우 24 를 가지므로 본문 여백을 0 으로 둔다(className=\"px-0\").",
    jsx: `import { BottomSheet, BottomSheetBody, BottomSheetContent, BottomSheetFooter } from "@/components/ui/bottom-sheet"

<BottomSheet open={open} onOpenChange={setOpen}>
  <BottomSheetContent title="기간" description="고른 기간의 거래만 보여요.">
    <BottomSheetBody className="px-0">
      <List>…</List>
    </BottomSheetBody>
    <BottomSheetFooter>
      <Button variant="neutralWeak" size="large" onClick={reset}>초기화</Button>
      <Button size="large" onClick={apply}>적용</Button>
    </BottomSheetFooter>
  </BottomSheetContent>
</BottomSheet>`,
    render: () =>
      bottomSheet({
        uid: "bottom-sheet-ex-pick",
        title: "기간",
        description: "고른 기간의 거래만 보여요.",
        body: { className: "px-0", html: radioList({ uid: "bottom-sheet-ex-pick-list", label: "기간", options: ["이번 달", "지난달", "최근 3개월"], value: "이번 달" }) },
        footer: [button({ variant: "neutralWeak", label: "초기화" }), button({ variant: "neutralSolid", label: "적용" })],
      }),
  },

  {
    title: "입력 폼 — 바깥 · 끌기로 닫지 않는다",
    description:
      "form 이면 바깥(딤)을 눌러도 · 아래로 끌어도 닫히지 않는다 — 손잡이도 없다. 위 닫기 버튼 · Esc · 뒤로 가기로 닫고, dirty(바뀐 값이 있음)면 닫기 전에 \"작성한 내용이 사라져요\" 를 묻는다. 시트의 입력 폼은 위 닫기 + 바닥 저장 하나다 — 바닥에 취소를 따로 두지 않는다(닫기 버튼과 취소를 함께 두지 않는다). 버튼 하나는 폭 전체 large 48 이고, 그 아래에 안전 영역(홈 표시줄)을 더한다. 폼 · 상세는 1280 에서 Dialog 와 바뀌는 ResponsiveDialog(dialog 페이지)로 짜는 것이 기본이다.",
    jsx: `{/* form — 바깥 누르기 · 끌어내리기로 닫지 않는다(손잡이 없음). dirty — 닫기 전에 "작성한 내용이 사라져요" 를 묻는다 */}
<BottomSheet open={open} onOpenChange={setOpen} form dirty={isDirty}>
  <BottomSheetContent title="거래 추가">
    <BottomSheetBody>
      <Field label="금액">…</Field>
      <Field label="날짜">…</Field>
    </BottomSheetBody>
    <BottomSheetFooter>
      <Button size="large" type="submit">저장</Button>
    </BottomSheetFooter>
  </BottomSheetContent>
</BottomSheet>`,
    render: () =>
      bottomSheet({
        uid: "bottom-sheet-ex-form",
        title: "거래 추가",
        form: true,
        body: {
          html: `<div style="display:flex; flex-direction:column; gap:var(--spacing-x6);">${field("bottom-sheet-ex-form-amount", "금액", (id) => amountInput(id, "8,000"))}${field(
            "bottom-sheet-ex-form-date",
            "날짜",
            (id, labelId) => dateButton(id, labelId, "10월 1일 (목)"),
          )}</div>`,
        },
        footer: [button({ variant: "neutralSolid", label: "저장", type: "submit" })],
      }),
  },

  {
    title: "넘칠 수 있는 본문 — 끝 흐림",
    description:
      "목록 · 긴 폼처럼 넘칠 수 있는 본문은 scrollFog 를 준다(Scroll Fog overlayBody) — 위 20 · 아래 80 이 마스크(gradient-fade-mask)로 늘 흐리고, 본문 안에 그만큼 여백(위 20 — 머리 아래 16 은 그대로 · 아래 80 — 바닥이 있어도)과 스크롤 여유를 둬 끝까지 내리면 흐림이 빈 여백 위에 놓인다(SEED Bottom Sheet 의 권장). 넘쳤는지 재서 켜고 끄지 않는다 — 걸 본문인지는 내용의 종류로 정하고, 칸 두셋처럼 늘 들어맞는 본문에는 걸지 않는다. 1280 이상의 Dialog 와 같다. 미리보기 본문은 실제로 스크롤된다.",
    jsx: `<BottomSheet open={open} onOpenChange={setOpen}>
  <BottomSheetContent title="카테고리 고르기">
    {/* 길이가 데이터에 따라 늘어나는 목록 — 위 20 · 아래 80 흐림과 같은 여백 */}
    <BottomSheetBody scrollFog className="px-0">
      <ListRadioGroup value={category} onValueChange={setCategory} aria-label="카테고리">…</ListRadioGroup>
    </BottomSheetBody>
    <BottomSheetFooter>
      <Button size="large" onClick={apply}>완료</Button>
    </BottomSheetFooter>
  </BottomSheetContent>
</BottomSheet>`,
    render: () =>
      bottomSheet({
        uid: "bottom-sheet-ex-fog",
        title: "카테고리 고르기",
        height: 560,
        body: {
          className: "px-0",
          scrollFog: true,
          overflow: true,
          html: radioList({ uid: "bottom-sheet-ex-fog-list", label: "카테고리", options: ["식비", "교통", "쇼핑", "카페", "구독", "의료", "여행", "주거", "통신", "교육"], value: "식비" }),
        },
        footer: [button({ variant: "neutralSolid", label: "완료" })],
      }),
  },

  {
    title: "손잡이 — 스냅 높이를 둘 때만",
    description:
      "snapPoints(화면 높이 비율 · 낮은 것부터)를 주면 시트를 화면의 90% 높이로 두고 그 높이만큼 내려 둔 채 열며, 위에 손잡이(36 × 4 · stroke-neutral-weak · 위 6 · 누르는 영역 44 · 보조 기술에는 숨김)를 단다. 손잡이를 누르면 한 단 낮은 높이로, 가장 낮은 높이에서 누르면 닫는다. 스냅 높이가 없으면 손잡이를 장식으로 달지 않는다 — 손잡이가 없어도 조회 · 고르기 시트는 끌어 닫힌다. form 이면 스냅 높이를 쓰지 않는다. 바닥이 없는 본문은 아래 16 을 가진다. 그림은 절반 높이에 멈춘 모습이다.",
    jsx: `<BottomSheet open={open} onOpenChange={setOpen} snapPoints={[0.5, 0.9]}>
  <BottomSheetContent title="거래 상세">
    <BottomSheetBody className="px-0">
      <List>
        <ListItem title="금액" suffix="8,000원" />
        <ListItem title="카테고리" suffix="식비" />
        <ListItem title="결제 수단" suffix="현대카드 M" />
        <ListItem title="날짜" suffix="10월 1일 (목)" />
        <ListItem title="메모" suffix="친구와 점심" />
      </List>
    </BottomSheetBody>
  </BottomSheetContent>
</BottomSheet>`,
    render: () =>
      bottomSheet({
        uid: "bottom-sheet-ex-snap",
        title: "거래 상세",
        snap: 0.5,
        body: {
          className: "px-0",
          html: valueList([
            ["금액", "8,000원"],
            ["카테고리", "식비"],
            ["결제 수단", "현대카드 M"],
            ["날짜", "10월 1일 (목)"],
            ["메모", "친구와 점심"],
          ]),
        },
      }),
  },

  {
    title: "닫기 버튼 — 누름 · 포커스",
    description:
      "닫기는 이름이 \"닫기\" 인 28 원(bg-neutral-weak · 아이콘 lucide x 14 fg-neutral)이다 — 위 24 · 오른쪽 24 에 서고 누르는 영역은 사방 8 넓혀 44 × 44 다. 마우스를 올리거나 누르면 원 바탕이 bg-neutral-weak-pressed 로 바뀌고, 누르면 2px 거리로 준다(기준 28 — 모션 줄이기면 줄지 않는다). 포커스는 키보드로 왔을 때만 바깥 링 2px · 띄움 2px stroke-focus-ring 이다. 정적 미리보기라 누름 · 포커스는 active: · focus-visible: 클래스에서 접두어만 뗀 사본을 덧붙여 그렸다. showCloseButton={false} 로 끌 수 있지만 조회 · 고르기 · 입력 폼 모두 두는 것이 기본이다.",
    jsx: `// 닫기 버튼은 BottomSheetContent 가 그린다(showCloseButton, 기본 켬) — 누름 · 포커스는 고르는 prop 이 없다
<BottomSheetContent title="거래 추가">…</BottomSheetContent>`,
    render: () =>
      `<div style="display:flex; flex-wrap:wrap; gap:var(--spacing-x4);">${[
        [undefined, "enabled"],
        ["pressed", "pressed"],
        ["focused", "focused"],
      ]
        .map(
          ([force, caption]) =>
            `<div style="display:flex; flex-direction:column; align-items:center; gap:var(--spacing-x2);"><span style="${SWATCH}">${closeButton(force).replace(
              'data-slot="bottom-sheet-close"',
              `data-slot="bottom-sheet-close" style="${SWATCH_PLACE}"`,
            )}</span><span style="${CAPTION}">${caption}</span></div>`,
        )
        .join("")}</div>`,
  },
];
