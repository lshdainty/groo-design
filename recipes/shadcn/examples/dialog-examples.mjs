/*
 * shadcn Dialog 예제 — docs site components/dialog.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(입력 폼 · 조회)은 차례 · 제목 · 코드가 specs/components/dialog.md 의 "코드" 절과 같고,
 * 뒤의 셋(크기 · 본문 스크롤과 끝 흐림 · 닫기 버튼)은 md 의 Properties 를 코드로 더 보인다. 폼 · 상세는 ResponsiveDialog 로 짠다 — 미리보기는 1280 이상의 모습(Dialog)이고, 1280 미만의
 * 모습은 bottom-sheet 페이지의 시트다.
 *
 * OVERLAY · CONTENT · SIZE · HEADER · CLOSE · BODY · BODY_PLAIN · BODY_FOG 는 recipes/shadcn/components/ui/dialog.tsx 의 상수와, HEADER_WITH_CLOSE ·
 * TITLE · DESCRIPTION · FOOTER 는 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 끝 흐림의 SOLID · fogMask 는
 * scroll-fog.tsx(scroll-fog-examples.mjs)의 것과 같은 셈이다.
 * 둘레의 부품은 그 레시피의 값을 옮겨 썼다 — BUTTON_* 는 button.tsx(button-examples.mjs), SELECT_* 는 select.tsx(select-examples.mjs),
 * IB_* 는 input-button.tsx(input-button-examples.mjs), INPUT_* 는 input.tsx(input-examples.mjs), LIST_* 는 list.tsx(list-examples.mjs),
 * FIELD_* 는 field.tsx 의 것과 같다 — 이 파일이 쓰는 변형 · 크기와 그에 걸리는 compound 만 옮겼다.
 * 규칙은 specs/components/dialog.md, 수치 원본은 specs/components/dialog.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 딤 <div data-slot="dialog-overlay"> 와 대화상자 <div role="dialog" data-slot="dialog-content"> >
 * 머리 <div data-slot="dialog-header">(제목 <h2> · 설명 <p> · 조회 · 안내면 닫기 <button data-slot="dialog-close">) · 본문
 * <div data-slot="dialog-body"> · 바닥 <div data-slot="dialog-footer">(입력 폼이면 [취소] <button data-slot="dialog-cancel"> [저장]).
 * Radix 가 실행 중에 붙이는 것 중 열림(data-state="open") · 이름 잇기(id · aria-labelledby · aria-describedby) · tabindex="-1" 을 그리고,
 * 딤 · 대화상자의 style(pointer-events)과 뒤 화면의 aria-hidden 은 그리지 않는다. 넘친 본문의 Tab 자리(tabindex 0) · 위로 스크롤됨
 * (data-scrolled — 머리의 안쪽 아래 선)은 레시피가 재서 단다 — 미리보기는 그 순간을 멈춰 속성을 적었다. 끝 흐림(scrollFog — 늘 켜진 위 20 ·
 * 아래 80)은 레시피(useScrollFog)가 그릴 때 토큰 --gradient-fade-mask 에 방향을 붙여 본문의 style(mask-*) · data-fog-axis 로 넣는다 —
 * 정적 HTML 은 같은 일을 빌드 때 DESIGN.md 의 토큰 값으로 해 style 에 적었다.
 * 대화상자는 화면(fixed)에 뜬다 — 미리보기 틀(STAGE)에 transform 을 줘 fixed 의 기준을 틀로 바꾸고, isolation 으로 z-index(딤 100 ·
 * 대화상자 101)를 틀 안에 가둔다(사이트 머리 막대 위로 올라오지 않게). 높이 상한 max-h-[80dvh] 는 창 높이를 따르므로 미리보기는 틀 높이의
 * 80% 를 style 로 한 번 더 적는다(DIALOG_FIT — 미리보기용 덧칠). 틀 안의 뒤 화면(가계부 줄)은 미리보기 그림이다.
 * 사이트의 `.content p { margin: 12px 0; color: text-primary }` 는 층(@layer) 밖 규칙이라 Tailwind utility 를 늘 이긴다 — 설명 <p> 에는
 * 클래스가 정한 바깥 여백 · 글자색을 style 로 한 번 더 적는다(P_FIX). 모션 클래스(animate-in · zoom-in-130 …)는 tw-animate-css 의 것이라
 * 사이트에서는 아무 일도 하지 않는다. 레시피의 스크립트(처음 초점 · 바깥 누르기 · Esc · 바뀐 값 묻기 · 초점 되돌리기 · 본문 재기)는
 * 정적 HTML 에 없다. 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

import { readFileSync } from "node:fs";

// ── dialog.tsx 의 상수와 같은 값 ───────────────────────────────────────────

// 딤 — 100ms 로 나타나고 사라진다
const OVERLAY = [
  "fixed inset-0 z-(--z-modal) bg-[var(--overlay-dim-light)] dark:bg-[var(--overlay-dim-dark)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-[var(--motion-duration-d2)] data-[state=open]:ease-[var(--motion-ease-enter)]",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-[var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)]",
].join(" ");

// 대화상자 — 정중앙, 좌우 20 은 남긴다, 높이는 화면의 80% 까지. 열림 200ms enter-expressive 로 1.3 배에서 줄며 나타난다
const CONTENT = [
  "fixed left-1/2 top-1/2 z-(--z-modal-content) flex max-h-[80dvh] max-w-[calc(100%-var(--spacing-x5)*2)] -translate-x-1/2 -translate-y-1/2 flex-col",
  "overflow-hidden rounded-r5 bg-bg-layer-floating font-sans text-fg-neutral outline-none",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0",
  "motion-safe:data-[state=open]:zoom-in-130 motion-safe:data-[state=open]:duration-[var(--motion-duration-d4)] motion-safe:data-[state=open]:ease-[var(--motion-ease-enter-expressive)]",
  "motion-reduce:data-[state=open]:duration-[var(--motion-duration-d3)] motion-reduce:data-[state=open]:ease-[var(--motion-ease-enter)]",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-[var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)]",
].join(" ");

// 크기 — medium 480(기본) · large 800. 레시피는 cn(CONTENT, SIZE[size])
const SIZE = { medium: "w-[480px]", large: "w-[800px]" };

// 닫기 — 52 투명 상자 · 아이콘 22 fg-neutral-subtle. 아이콘이 위 28 · 오른쪽 24 에 오도록 상자를 15 당긴다.
// 누르면 bg-layer-floating-pressed + 2px 거리 축소(기준 52 → 0.962)
const CLOSE = [
  "absolute right-[calc(var(--spacing-x6)-15px)] top-[calc(var(--spacing-x7)-15px)] flex size-13 cursor-pointer items-center justify-center",
  "rounded-r3 border-0 bg-transparent p-0 text-fg-neutral-subtle [&>svg]:size-[22px]",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "hover:bg-bg-layer-floating-pressed active:bg-bg-layer-floating-pressed [--press-basis:52] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

// 머리 — 위 24 · 좌우 24 · 아래 16 · 사이 6. 본문이 위로 스크롤되면 안쪽 아래 1px stroke-neutral-subtle(150ms) — 본문이 흐림 마스크를
// 걸어도 선이 흐려지지 않게 머리에 그린다
const HEADER = [
  "flex shrink-0 flex-col gap-x1_5 px-x6 pb-x4 pt-x6",
  "[transition:box-shadow_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[&:has(~[data-slot=dialog-body][data-scrolled])]:shadow-[inset_0_-1px_0_0_var(--color-stroke-neutral-subtle)]",
].join(" ");

// 본문 — 좌우 24, 이 안에서만 스크롤. 맨 앞 자식(머리가 없으면)이면 위 24, 맨 끝 자식(바닥이 없으면)이면 아래 24
const BODY = [
  "min-h-0 flex-1 overflow-y-auto overscroll-contain px-x6 first:pt-x6",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

const BODY_PLAIN = "last:pb-x6";

// 끝 흐림(scrollFog) — 본문 안 여백 위 20(머리가 없으면 24 그대로) · 아래 80(바닥이 있어도), 스크롤 여유도 위 20 · 아래 80
const BODY_FOG = "pt-[20px] pb-[80px] scroll-pt-[20px] scroll-pb-[80px]";

// ── dialog.tsx 의 JSX 에 적힌 클래스 ───────────────────────────────────────

// 닫기 버튼이 있으면 cn(HEADER, HEADER_WITH_CLOSE)(오른쪽 52 = 24 + 아이콘 22 + 6)
const HEADER_WITH_CLOSE = "pr-x13";
// 제목 t8 22 / 30 · 700 · 설명 t5 · fg-neutral-muted
const TITLE = "m-0 text-t8 font-bold text-fg-neutral";
const DESCRIPTION = "m-0 text-t5 font-normal text-fg-neutral-muted";
// 바닥 — 위 16 · 좌우 24 · 아래 24, 오른쪽 정렬 [취소] [저장], 사이 8. 버튼은 small 36
const FOOTER = "flex shrink-0 items-center justify-end gap-x2 px-x6 pb-x6 pt-x4";

// ── button.tsx 의 cva 와 같은 값 — 바닥 버튼(small 36) ─────────────────────

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
    small: "h-9 rounded-r2 [--press-basis:36] [--progress-size:14px]",
  },
  layout: { withText: "", iconOnly: "" },
  ghostColor: { neutral: "", neutralSubtle: "", brand: "", critical: "" },
  flush: { left: "", right: "" },
};

const BUTTON_COMPOUND = [{ size: "small", layout: "withText", className: "px-x3_5 py-x2 gap-x1 text-t4 [&_svg]:size-3.5" }];

const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// ── input-button.tsx 의 cva · 클래스와 같은 값 — 고르는 칸의 상자(Select 트리거 · Input Button) ──

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

// ── select.tsx 의 상수 · JSX 클래스와 같은 값 — 휴가 종류(닫힌 트리거) ─────────

// 트리거 — cn(SELECT_TRIGGER_BASE, inputButtonVariants({ size }), inputButtonSurfaceVariants({ state, hover: "self", invalid }))
const SELECT_TRIGGER_BASE = "group/select-trigger relative flex w-full min-w-0 items-center text-left";
const SELECT_TRIGGER_CONTENT =
  "relative flex min-w-0 flex-1 items-center gap-[inherit] [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const SELECT_TRIGGER_CONTENT_PRESS =
  "group-active/select-trigger:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/select-trigger:[scale:1]";
// 값 — cn(SELECT_VALUE_BASE, 값 색) · 셰브론 — cn(SELECT_CHEVRON_BASE, 아이콘 색, SELECT_CHEVRON_CLOSED)
const SELECT_VALUE_BASE = "relative min-w-0 flex-1 truncate";
const SELECT_CHEVRON_BASE = "size-[var(--input-button-icon)] shrink-0";
const SELECT_CHEVRON_CLOSED = "rotate-0 [transition:rotate_var(--motion-duration-d2)_var(--motion-ease-easing)]";

// ── input.tsx 의 cva 와 같은 값 — 비상 연락처 · 휴가지(상자형 medium) ─────────

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
    size: "medium",
    className: "min-h-10 gap-x2 rounded-r2 text-t4 [--text-input-px:var(--spacing-x3_5)] [--text-input-icon:16px] [--text-input-clear:18px]",
  },
];
const INPUT_ROOT_DEFAULTS = { variant: "outline", size: "responsive" };
// 입력(<input>) — 레시피는 cn(INPUT_VALUE_BASE, 값 색)
const INPUT_VALUE_BASE = [
  "min-w-0 flex-1 self-stretch border-0 bg-transparent p-0 outline-none [font:inherit]",
  "first:pl-[var(--text-input-px)] last:pr-[var(--text-input-px)] disabled:cursor-not-allowed",
  "[&:-webkit-autofill]:bg-clip-text [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-fg-neutral)] [&:-webkit-autofill]:[transition:background-color_9999s_9999s]",
].join(" ");
const INPUT_VALUE_COLOR = "text-fg-neutral placeholder:text-fg-placeholder";

// ── list.tsx 의 cva 와 같은 값 — 보기만 하는 줄(제목 + 뒤 값 글자) ──────────────

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
const LIST_BODY_BASE = "flex min-w-0 flex-1 flex-col items-start gap-x0_5 pr-x2_5 text-left";
const LIST_TITLE_BASE = "font-sans text-t5 font-normal text-fg-neutral";
const LIST_TITLE_VARIANTS = { disabled: { true: "text-fg-disabled", false: "" } };
const LIST_TITLE_DEFAULTS = { disabled: false };
const LIST_HIGHLIGHT_MUTED =
  "[@media(hover:hover)]:group-has-[[data-list-action]:not([data-disabled]):hover]/list-item:text-fg-neutral-muted group-has-[[data-list-action]:not([data-disabled]):active]/list-item:text-fg-neutral-muted";
const LIST_SUFFIX_BASE =
  "flex shrink-0 items-center gap-x1 font-sans text-t5 text-fg-neutral-subtle [&>svg]:size-[18px] [&_a]:relative [&_a]:z-[1] [&_button]:relative [&_button]:z-[1]";
const LIST_SUFFIX_VARIANTS = {
  disabled: { true: "text-fg-disabled", false: "" },
  highlighted: { true: LIST_HIGHLIGHT_MUTED, false: "" },
};
const LIST_SUFFIX_COMPOUND = [{ disabled: false, highlighted: true, class: "[&>svg]:text-fg-neutral-subtle" }];
const LIST_SUFFIX_DEFAULTS = { disabled: false, highlighted: false };

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
const inputButtonVariants = cvaOf(IB_SIZE_BASE, { variants: IB_SIZE_VARIANTS, defaultVariants: IB_SIZE_DEFAULTS });
const inputButtonSurfaceVariants = cvaOf(IB_SURFACE_BASE, {
  variants: IB_SURFACE_VARIANTS,
  compoundVariants: IB_SURFACE_COMPOUND,
  defaultVariants: IB_SURFACE_DEFAULTS,
});
const textInputVariants = cvaOf(INPUT_ROOT_BASE, {
  variants: INPUT_ROOT_VARIANTS,
  compoundVariants: INPUT_ROOT_COMPOUND,
  defaultVariants: INPUT_ROOT_DEFAULTS,
});
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
// 배경 · 좌우 여백 · 임의 속성([prop:…]). 그래서 목록을 담은 본문의 px-0 이 px-x6 을, 누른 닫기의 bg-bg-layer-floating-pressed 가
// bg-transparent 를, active:[scale:calc(…)] 의 사본이 [scale:…] 자리를 지운다
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
// (merge 가 겹치는 기본값을 지운다). 값은 레시피 그대로라 dialog.tsx 가 바뀌면 같이 따라간다
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

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기는 감싼 자리의 [&>svg]:size-* 나 class 가 정한다
const svg = (paths, { cls = "", slot = "" } = {}) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${slot ? ` data-slot="${slot}"` : ""}${cls ? ` class="${cls}"` : ""}>${paths}</svg>`;
const PATHS = {
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  calendarDays:
    '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/>',
};

// 미리보기 틀 — 레시피의 딤 · 대화상자는 화면(fixed)에 뜬다. transform 이 fixed 의 기준을 틀로 바꾸고 isolation 이 z-index 를 틀 안에 가둔다
const STAGE = (height) =>
  `position:relative; isolation:isolate; transform:translateZ(0); overflow:hidden; width:100%; height:${height}px; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-basement);`;
// 높이 상한(80dvh)을 틀 높이로 — 레시피에는 없는 미리보기용 덧칠
const DIALOG_FIT = (height) => `max-height:${Math.round(height * 0.8)}px;`;
// 뒤 화면 — 가계부(회색 바탕 위 흰 카드 · 줄, 미리보기 그림). 대화상자가 열린 동안 보조 기술에는 숨는다
const PAGE_ROW =
  "display:flex; justify-content:space-between; gap:var(--spacing-x3); padding:var(--spacing-x3) 0; font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const page = () =>
  `<div aria-hidden="true" style="padding:var(--spacing-x6) var(--spacing-x8); font-family:var(--font-sans);"><div style="margin-bottom:var(--spacing-x4); font-size:var(--text-t7); line-height:var(--text-t7--line-height); font-weight:700; color:var(--color-fg-neutral);">가계부</div><div style="padding:var(--spacing-x2) var(--spacing-x6); border-radius:var(--radius-r4); background:var(--color-bg-layer-default);">${[
    ["김밥천국", "8,000원"],
    ["버스", "1,500원"],
    ["다이소", "12,300원"],
    ["월급", "3,200,000원"],
  ]
    .map(([title, amount]) => `<div style="${PAGE_ROW}"><span>${title}</span><span style="font-weight:700;">${amount}</span></div>`)
    .join("")}</div></div>`;

// <Button> — button.tsx 그대로(cn(buttonVariants({ variant, size }))). 바닥은 크기를 주지 않은 버튼에 small 을 넣는다.
// [취소](DialogCancel)는 Radix 의 닫기(asChild — type="button" 을 얹는다)에 neutralWeak 버튼 + data-slot 이다. <Button> 은 type 을 정하지 않는다
const button = ({ variant, label, slot }) =>
  `<button ${attrs([`class="${buttonVariants({ variant, size: "small" })}"`, slot && 'type="button"', slot && `data-slot="${slot}"`])}>${esc(label)}</button>`;

// 닫기 버튼 — force = "pressed" · "focused" 는 미리보기용 강제 상태
function closeButton(force) {
  const cls = force === "pressed" ? forced(CLOSE, "active") : force === "focused" ? forced(CLOSE, "focus-visible") : CLOSE;
  return `<button type="button" aria-label="닫기" data-slot="dialog-close" class="${cls}">${svg(PATHS.x)}</button>`;
}

// 위로 스크롤된 순간 — 정적 HTML 은 scrollTop 을 정할 수 없어 본문 글을 SCROLLED_BY 만큼 올려 그린다(미리보기용 덧칠)
const SCROLLED_BY = 40;
const scrolledBy = (html) => `<div style="margin-top:-${SCROLLED_BY}px;">${html}</div>`;

// <Dialog open> + <DialogContent>. uid 는 Radix 가 만드는 id 의 앞말(예제마다 달리한다).
// form 이면 머리 닫기 버튼이 없다(바닥 [취소]). body = { html, className, scrollFog, overflow, scrolled } — scrollFog 는 끝 흐림(늘 켜짐),
// 넘침(Tab 자리) · 스크롤됨(머리 아래 선)은 그 순간을 멈춰 적는다
function dialog({ uid, title, description, size = "medium", form = false, body, footer = [], height = 520 }) {
  const titleId = `${uid}-title`;
  const descriptionId = `${uid}-description`;
  const showClose = !form;
  const content = attrs([
    'role="dialog"',
    `id="${uid}"`,
    description != null && `aria-describedby="${descriptionId}"`,
    `aria-labelledby="${titleId}"`,
    'data-state="open"',
    'tabindex="-1"',
    'data-slot="dialog-content"',
    `data-size="${size}"`,
    form && 'data-form="true"',
    'aria-modal="true"',
    `class="${CONTENT} ${SIZE[size]}"`,
    `style="${DIALOG_FIT(height)}"`,
  ]);
  const header = `<div data-slot="dialog-header" class="${showClose ? `${HEADER} ${HEADER_WITH_CLOSE}` : HEADER}"><h2 id="${titleId}" data-slot="dialog-title" class="${TITLE}">${esc(title)}</h2>${
    description != null ? `<p id="${descriptionId}" data-slot="dialog-description" class="${DESCRIPTION}" style="${P_FIX.description}">${esc(description)}</p>` : ""
  }${showClose ? closeButton() : ""}</div>`;
  const bodyClass = merge([BODY, body.scrollFog ? BODY_FOG : BODY_PLAIN, body.className].filter(Boolean).join(" "));
  const bodyHtml = `<div ${attrs([
    'data-slot="dialog-body"',
    body.scrollFog && 'data-scroll-fog="overlayBody"',
    `class="${bodyClass}"`,
    body.scrolled && 'data-scrolled=""',
    body.overflow && 'tabindex="0"',
    body.scrollFog && 'data-fog-axis="y"',
    body.scrollFog && `style="${fogStyle()}"`,
  ])}>${body.scrolled ? scrolledBy(body.html) : body.html}</div>`;
  const footerHtml = footer.length ? `<div data-slot="dialog-footer" class="${FOOTER}">${footer.join("")}</div>` : "";
  return `<div style="${STAGE(height)}">${page()}<div data-state="open" data-slot="dialog-overlay" class="${OVERLAY}"></div><div ${content}>${header}${bodyHtml}${footerHtml}</div></div>`;
}

// <Field label> — 머리(라벨) + 칸. control(controlId, labelId) 는 칸의 HTML 을 돌려준다
const field = (uid, label, control) =>
  `<div data-slot="field" class="${FIELD_ROOT}"><div data-slot="field-header" class="${FIELD_HEADER}"><label id="${uid}-label" for="${uid}-control" class="${FIELD_LABEL} ${FIELD_LABEL_WEIGHT.medium}">${esc(label)}</label></div>${control(`${uid}-control`, `${uid}-label`)}<span class="sr-only" aria-live="polite"></span></div>`;

// <Select size="medium"> 의 닫힌 트리거 — role=combobox 버튼 하나가 상자다. 이름은 Field 의 <label for>
const selectTrigger = (id, value) =>
  `<button ${attrs([
    'type="button"',
    'aria-haspopup="listbox"',
    'aria-expanded="false"',
    'role="combobox"',
    `id="${id}"`,
    'data-slot="select-trigger"',
    'data-size="medium"',
    `class="${SELECT_TRIGGER_BASE} ${inputButtonVariants({ size: "medium" })} ${inputButtonSurfaceVariants({ state: "enabled", hover: "self", invalid: false })}"`,
  ])}><span data-slot="select-trigger-content" class="${SELECT_TRIGGER_CONTENT} ${SELECT_TRIGGER_CONTENT_PRESS}"><span data-slot="select-value" class="${SELECT_VALUE_BASE} text-fg-neutral">${esc(value)}</span>${svg(PATHS.chevronDown, {
    slot: "select-chevron",
    cls: `${SELECT_CHEVRON_BASE} text-fg-neutral-muted ${SELECT_CHEVRON_CLOSED}`,
  })}</span></button>`;

// <InputButton size="medium" suffixIcon={<CalendarDays />}> — 상자(div) > 배경 층 버튼 + 콘텐츠 층(값 · 뒤 아이콘). 이름은 라벨 + 값
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
  return `<div data-slot="input-button" data-size="medium" class="${IB_ROOT} ${inputButtonVariants({ size: "medium" })}"><button ${button}></button><span data-slot="input-button-content" class="${IB_CONTENT} ${IB_CONTENT_PRESS}"><span id="${valueId}" aria-hidden="true" data-slot="input-button-value" class="${IB_VALUE} ${IB_VALUE_COLOR}">${esc(value)}</span><span aria-hidden="true" data-slot="input-button-suffix-icon" class="${IB_ICON} ${IB_ICON_COLOR}">${svg(PATHS.calendarDays)}</span></span></div>`;
}

// <Input size="medium"> — 상자(div) > 입력
const textInput = (id, value, inputMode) =>
  `<div data-slot="text-input" data-variant="outline" data-size="medium" class="${textInputVariants({ variant: "outline", size: "medium" })}"><input ${attrs([
    'type="text"',
    'data-slot="text-input-value"',
    `class="${INPUT_VALUE_BASE} ${INPUT_VALUE_COLOR}"`,
    inputMode && `inputmode="${inputMode}"`,
    `value="${esc(value)}"`,
    `id="${id}"`,
  ])}></div>`;

// <List> + <ListItem> — 보기만 하는 줄(제목 + 뒤 값 글자)
const valueList = (rows) =>
  `<ul class="${listVariants()}">${rows
    .map(
      ([title, value]) =>
        `<li class="${listItemVariants({ highlight: "none" })}"><div class="${listContentVariants({ align: "center" })}"><span class="${listBodyVariants()}"><span class="${listTitleVariants({ disabled: false })}">${esc(title)}</span></span><span class="${listSuffixVariants({ disabled: false, highlighted: false })}">${esc(value)}</span></div></li>`,
    )
    .join("")}</ul>`;

const DETAIL = [
  ["금액", "8,000원"],
  ["카테고리", "식비"],
  ["결제 수단", "현대카드 M"],
  ["날짜", "10월 1일 (목)"],
  ["메모", "친구와 점심"],
];
// 데이터에 따라 느는 상세 — 본문이 넘쳐 끝 흐림이 보인다
const DETAIL_LONG = [...DETAIL, ["가맹점", "김밥천국 강남점"], ["할부", "일시불"], ["더치페이", "2명 · 4,000원씩"]];

// 휴가 신청 폼 — Field 사이 24(field.yaml form). more 면 칸 넷(본문이 넘친다)
const leaveForm = (uid, more = false) =>
  `<div style="display:flex; flex-direction:column; gap:var(--spacing-x6);">${[
    field(`${uid}-kind`, "휴가 종류", (id) => selectTrigger(id, "연차")),
    field(`${uid}-period`, "기간", (id, labelId) => dateButton(id, labelId, "10월 12일~10월 14일")),
    more ? field(`${uid}-phone`, "비상 연락처", (id) => textInput(id, "010-1234-5678", "tel")) : "",
    more ? field(`${uid}-place`, "휴가지", (id) => textInput(id, "제주")) : "",
  ].join("")}</div>`;

// 떠 있는 표면 위의 버튼 하나 — 닫기 버튼 상태를 나란히 보인다(미리보기 그림)
const SWATCH =
  "position:relative; display:inline-grid; place-items:center; width:84px; height:76px; border-radius:var(--radius-r3); background:var(--color-bg-layer-floating); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle);";
// 버튼의 자리(absolute · 위 13 · 오른쪽 9)를 견본 칸 가운데로 — 미리보기용 덧칠
const SWATCH_PLACE = "position:relative; top:auto; right:auto;";
const CAPTION =
  "display:block; margin-bottom:var(--spacing-x2); font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";

// ── 예제 ──────────────────────────────────────────────────────────────────

export const dialogExamples = [
  {
    title: "입력 폼",
    description:
      "폼 · 상세는 ResponsiveDialog 로 짠다 — 1280 이상은 화면 정중앙의 Dialog, 미만은 Bottom Sheet 다(Input Button 과 같은 경계). form 이면 대화상자의 바닥에 [취소] [저장](Button small 36, 오른쪽)을 두고 머리 닫기 버튼이 없다 — 바깥(딤)을 눌러도 닫히지 않고, 취소 · Esc 로 닫는다. dirty(바뀐 값이 있음)면 닫기 전에 \"작성한 내용이 사라져요\" 를 묻는다. ResponsiveDialogCancel 은 1280 이상에서만 그려진다 — 시트에서는 위 닫기 버튼이 맡는다. medium 480 · 모서리 20 · 머리 위 24 · 좌우 24 · 아래 16 · 제목 22 / 30 · 설명 16 / 22(사이 6) · 바닥 위 16 · 아래 24 이고, 그림자 없이 딤(0.50 · 다크 0.65) 위에 뜬다. 미리보기는 1280 이상의 모습이다.",
    jsx: `import { Button } from "@/components/ui/button"
import { ResponsiveDialog, ResponsiveDialogBody, ResponsiveDialogCancel, ResponsiveDialogContent, ResponsiveDialogFooter } from "@/components/ui/dialog"

{/* form — 바깥 누르기 · 끌어내리기로 닫지 않는다. dirty — 닫기 전에 "작성한 내용이 사라져요" 를 묻는다 */}
<ResponsiveDialog open={open} onOpenChange={setOpen} form dirty={isDirty}>
  <ResponsiveDialogContent title="휴가 신청" description="승인되면 알려드려요.">
    <ResponsiveDialogBody>
      <Field label="휴가 종류">…</Field>
      <Field label="기간">…</Field>
    </ResponsiveDialogBody>
    <ResponsiveDialogFooter>
      {/* 1280 이상에서만 그린다 — 시트에서는 위 닫기 버튼이 맡는다 */}
      <ResponsiveDialogCancel>취소</ResponsiveDialogCancel>
      <Button onClick={submit}>신청</Button>
    </ResponsiveDialogFooter>
  </ResponsiveDialogContent>
</ResponsiveDialog>`,
    render: () =>
      dialog({
        uid: "dialog-ex-form",
        title: "휴가 신청",
        description: "승인되면 알려드려요.",
        form: true,
        body: { html: leaveForm("dialog-ex-form") },
        footer: [button({ variant: "neutralWeak", label: "취소", slot: "dialog-cancel" }), button({ variant: "neutralSolid", label: "신청" })],
      }),
  },

  {
    title: "조회",
    description:
      "조회 · 안내(form 이 아니면)는 머리 오른쪽에 닫기 버튼을 둔다 — 투명 52 상자 · 아이콘 22 fg-neutral-subtle 이고 아이콘이 위 28 · 오른쪽 24(제목 첫 줄 가운데)에 선다. 닫기 버튼이 있으면 머리 오른쪽을 52 비운다. 바깥(딤) 누르기 · Esc 로도 닫힌다. 바닥은 수정 · 삭제 같은 다른 동작이 있을 때만 둔다 — 바닥이 없으면 본문이 아래 24 를 가진다. 목록은 줄이 제 좌우 24 를 가지므로 본문 여백을 0 으로 둔다(className=\"px-0\"). 거래 상세처럼 길이가 데이터에 따라 느는 본문은 scrollFog 로 끝을 늘 흐린다(위 20 · 아래 80 + 본문 안 여백 — Scroll Fog). 1280 미만에서는 같은 내용이 시트로 뜨고 닫기는 오른쪽 위 원이 된다.",
    jsx: `{/* 조회 — 머리 닫기 버튼(시트에서는 오른쪽 위 원), 바깥 누르기로도 닫힌다. 길이가 데이터에 따라 느는 본문이라 scrollFog */}
<ResponsiveDialog open={open} onOpenChange={setOpen}>
  <ResponsiveDialogContent title="거래 상세">
    <ResponsiveDialogBody scrollFog className="px-0">
      <List>…</List>
    </ResponsiveDialogBody>
  </ResponsiveDialogContent>
</ResponsiveDialog>`,
    render: () =>
      dialog({
        uid: "dialog-ex-view",
        title: "거래 상세",
        body: { className: "px-0", scrollFog: true, overflow: true, html: valueList(DETAIL_LONG) },
      }),
  },

  {
    title: "크기 — medium 480 · large 800",
    description:
      "size 로 폭을 고른다 — medium 480(기본)은 일반 입력 폼 · 상세, large 800 은 복잡한 설정 · 많은 조회다. 높이는 내용만큼이고 화면 높이의 80% 를 넘지 않는다. 화면이 좁으면 좌우 20 을 남기고 줄어든다 — 미리보기 칸이 800 보다 좁아 아래 large 는 칸 폭 − 40 으로 줄었다. 1280 미만의 시트는 크기와 관계없이 최대 480 이다.",
    jsx: `<ResponsiveDialogContent size="large" title="거래 상세">
  <ResponsiveDialogBody scrollFog className="px-0">
    <List>…</List>
  </ResponsiveDialogBody>
</ResponsiveDialogContent>`,
    render: () =>
      dialog({
        uid: "dialog-ex-large",
        title: "거래 상세",
        size: "large",
        body: { className: "px-0", scrollFog: true, overflow: true, html: valueList(DETAIL_LONG) },
      }),
  },

  {
    title: "본문 스크롤 — 끝 흐림 · 머리 아래 선",
    description:
      "넘치는 만큼 본문(DialogBody)만 스크롤하고 머리 · 바닥은 늘 보인다. 넘칠 수 있는 본문(목록 · 긴 폼)은 scrollFog 를 준다 — 위 20 · 아래 80 을 마스크(gradient-fade-mask)로 늘 흐리고, 본문 안에 그만큼 여백(위 20 — 머리 아래 16 은 그대로 · 아래 80 — 바닥이 있어도)과 스크롤 여유를 둬 끝까지 내리면 흐림이 빈 여백 위에 놓인다. 넘쳤는지 재서 켜고 끄지 않는다(옛 \"넘칠 때만 아래 48\" 을 대신한다). 넘친 본문은 키보드로도 스크롤하도록 Tab 이 선다(안쪽 링). 위로 스크롤되면 data-scrolled 가 붙어 머리의 안쪽 아래 1px stroke-neutral-subtle 이 150ms 로 나타난다 — 본문의 흐림에 지워지지 않게 머리에 그리고, 머리가 없으면 그리지 않는다. 위는 맨 위, 아래는 조금 스크롤한 순간을 멈춘 그림이다(정적 미리보기라 본문 글을 40 올려 그렸다).",
    jsx: `<ResponsiveDialogContent title="휴가 신청" description="승인되면 알려드려요.">
  {/* 넘칠 수 있는 긴 폼 — scrollFog 는 늘 켜진 끝 흐림. 위로 스크롤되면 data-scrolled(머리 아래 선) — 레시피가 재서 단다 */}
  <ResponsiveDialogBody scrollFog>
    <Field label="휴가 종류">…</Field>
    <Field label="기간">…</Field>
    <Field label="비상 연락처">…</Field>
    <Field label="휴가지">…</Field>
  </ResponsiveDialogBody>
  <ResponsiveDialogFooter>
    <ResponsiveDialogCancel>취소</ResponsiveDialogCancel>
    <Button onClick={submit}>신청</Button>
  </ResponsiveDialogFooter>
</ResponsiveDialogContent>`,
    render: () =>
      [
        ["dialog-ex-overflow", "끝 흐림 — scrollFog(위 20 · 아래 80)", false],
        ["dialog-ex-scrolled", "위로 스크롤됨 — data-scrolled(머리 아래 선)", true],
      ]
        .map(
          ([uid, caption, scrolled]) =>
            `<div><span style="${CAPTION}">${caption}</span>${dialog({
              uid,
              title: "휴가 신청",
              description: "승인되면 알려드려요.",
              form: true,
              height: 440,
              body: { html: leaveForm(uid, true), scrollFog: true, overflow: true, scrolled },
              footer: [button({ variant: "neutralWeak", label: "취소", slot: "dialog-cancel" }), button({ variant: "neutralSolid", label: "신청" })],
            })}</div>`,
        )
        .join(`<div style="height:var(--spacing-x4);"></div>`),
  },

  {
    title: "닫기 버튼 — 누름 · 포커스",
    description:
      "머리 닫기는 이름이 \"닫기\" 인 투명 52 상자(모서리 12 · 아이콘 lucide x 22 fg-neutral-subtle)다. 마우스를 올리거나 누르면 바탕이 bg-layer-floating-pressed 로 칠해지고, 누르면 2px 거리로 준다(기준 52 — 모션 줄이기면 줄지 않는다). 포커스는 키보드로 왔을 때만 바깥 링 2px · 띄움 2px stroke-focus-ring 이다. 정적 미리보기라 누름 · 포커스는 active: · focus-visible: 클래스에서 접두어만 뗀 사본을 덧붙여 그렸다. 입력 폼(form)에는 닫기 버튼이 없다 — 바닥 [취소] 가 닫는다.",
    jsx: `// 머리 닫기 버튼은 DialogContent 가 그린다(form 이 아닐 때) — 누름 · 포커스는 고르는 prop 이 없다
<ResponsiveDialogContent title="거래 상세">…</ResponsiveDialogContent>`,
    render: () =>
      `<div style="display:flex; flex-wrap:wrap; gap:var(--spacing-x4);">${[
        [undefined, "enabled"],
        ["pressed", "pressed"],
        ["focused", "focused"],
      ]
        .map(
          ([force, caption]) =>
            `<div style="display:flex; flex-direction:column; align-items:center; gap:var(--spacing-x2);"><span style="${SWATCH}">${closeButton(force).replace(
              'data-slot="dialog-close"',
              `data-slot="dialog-close" style="${SWATCH_PLACE}"`,
            )}</span><span style="font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);">${caption}</span></div>`,
        )
        .join("")}</div>`,
  },
];
