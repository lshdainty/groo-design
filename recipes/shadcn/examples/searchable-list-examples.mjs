/*
 * shadcn Searchable List 예제 — docs site components/searchable-list.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(은행 고르기 — 검색 시트 · 카드 상품 — 서버 검색 · 단계 안)은 차례 · 제목 · 코드가
 * specs/components/searchable-list.md 의 "코드" 절과 같고, 뒤의 둘(강조 · 누름 · 0건 · 실패 · 불러오는 줄)은 md 의 상태 · 키보드를 코드로 더 보인다.
 * SEED 에는 이 컴포넌트가 없다(Combobox 를 아직 두지 않았다) — 부품마다 SEED 를 따른다: 검색칸은 Text Input 밑줄형(사용자 결정 17A),
 * 결과는 List 줄 + 오른쪽 Radiomark, 결과 없음은 Result Section, 키보드는 SEED 문서 사이트 검색 창(초점은 입력칸, 화살표는 강조만 옮긴다 — 12A).
 * 옛 예제(상자 안 결과 · 제목 13 · 썸네일 44 × 28 · 고른 줄 브랜드 바탕 · 상자형 검색칸)를 대신한다.
 *
 * OPTION · OPTION_CONTENT 는 recipes/shadcn/components/ui/searchable-list.tsx 의 상수와, SL_* · FIELD* · RESULTS · GROUP · ITEM_* · SKELETON_* 는
 * 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 둘레의 부품은 그 레시피의 값을 옮겨 썼다 — INPUT_* · AFFIX_EDGE 는
 * input.tsx, LIST_HEADER_* 는 list.tsx, RADIOMARK_* · DOT_* 는 radio-group.tsx, LOGO_* 는 logo-tile.tsx, FRAME_* · RATIO_* · CARD_FACE* 는 image-frame.tsx ·
 * aspect-ratio.tsx, BADGE_* 는 badge.tsx, BUTTON_* 는 button.tsx, RESULT_* 는 result-section.tsx, SK_* 는 skeleton.tsx, SHEET_* 는 bottom-sheet.tsx 의 것과
 * 같다 — 이 파일이 쓰는 변형 · 크기와 그에 걸리는 compound 만 옮겼다. 기관 색은 recipes/shadcn/lib/institution-colors.ts 의 표를 그대로 읽는다.
 * 규칙은 specs/components/searchable-list.md, 수치 원본은 specs/components/searchable-list.yaml(줄 · 검색칸은 list.yaml · input.yaml).
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 묶음 <div data-slot="searchable-list" data-placement> > 검색칸 <div data-slot="searchable-list-field">(위에 붙는다)
 * > Input 밑줄형(<input role="combobox" aria-controls aria-activedescendant>) · 결과 <div role="listbox" data-slot="searchable-list-results"> > 분류
 * <div role="group" data-slot="searchable-list-group">(머리 List Header mediumWeak) > 줄 <div role="option" aria-selected data-slot="searchable-list-item"
 * data-highlighted>(바탕 층 ::before · 콘텐츠 층 > 앞 붙이개 · 제목 · 설명 · 오른쪽 라디오 — 보는 표시라 aria-hidden).
 * 시트의 틀(머리 · 닫기 · 손잡이 · 떠 있는 면)은 bottom-sheet.tsx 의 클래스로 그린 미리보기 그림이다 — 화면 아래 고정 · 딤 · 열고 닫는 움직임은 없다.
 * 레시피의 스크립트(거르기 · 서버 검색 300ms · ↓ ↑ 강조 · Enter 고름 · Esc 지움)는 정적 HTML 에 없다 — 그림은 그 순간을 멈춘 것이다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── searchable-list.tsx 의 상수와 같은 값 ─────────────────────────────

const OPTION = [
  "group/sl-option relative flex w-full cursor-pointer select-none outline-none",
  "before:pointer-events-none before:absolute before:inset-y-0 before:inset-x-x1_5 before:rounded-r2_5 before:bg-transparent before:content-['']",
  "data-[highlighted]:before:bg-bg-layer-default-pressed active:before:bg-bg-layer-default-pressed",
  "data-[highlighted=pointer]:before:[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
].join(" ");
const OPTION_CONTENT = [
  "relative flex w-full items-center px-global-gutter py-x3",
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "group-active/sl-option:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/sl-option:[scale:1]",
].join(" ");

// ── searchable-list.tsx 의 JSX 에 적힌 클래스 ───────────────────────────

const SL_ROOT = "flex flex-col gap-x2 font-sans";
const FIELD = "sticky top-0 z-[1] px-x6";
const FIELD_BG = { sheet: "bg-bg-layer-floating", inline: "bg-bg-layer-default" };
const RESULTS = "flex flex-col";
const GROUP = "flex flex-col";
const ITEM_PREFIX = "flex shrink-0 items-center pr-x3";
const ITEM_BODY = "flex min-w-0 flex-1 flex-col items-start gap-x0_5 pr-x2_5 text-left";
const ITEM_TITLE = "text-t5 font-normal text-fg-neutral";
const ITEM_DETAIL = "text-t3 text-fg-neutral-subtle";
const ITEM_RADIO = "pointer-events-none";
const SKELETON_LIST = "flex flex-col";
const SKELETON_ROW = "flex w-full items-center px-global-gutter py-x3";
const SKELETON_PREFIX = "flex shrink-0 items-center pr-x3";
const SKELETON_BODY = "flex min-w-0 flex-1 flex-col gap-x0_5";
const SKELETON_SIZE = { logo: "size-10", cardArt: "aspect-[1.586] w-14", avatar: "size-[42px]", title: "w-[40%]", detail: "w-[60%]" };

// ── input.tsx 의 cva · 상수 · JSX 클래스와 같은 값 — 밑줄형 검색칸(앞 돋보기 · 지우기) ──

const INPUT_BASE = "relative flex w-full min-w-0 items-center overflow-hidden bg-transparent font-sans cursor-text data-[disabled]:cursor-not-allowed after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-solid after:border-transparent after:content-[''] after:[transition:border-color_var(--motion-duration-d2)_var(--motion-ease-easing)] [&:has(input:focus):not([data-invalid]):not([data-readonly])]:after:border-stroke-neutral-contrast data-[invalid]:after:border-stroke-critical-solid";
const INPUT_VARIANTS = {
  variant: { underline: "rounded-none shadow-[inset_0_-1px_0_0_var(--color-stroke-neutral-weak)] after:border-b-2" },
  size: { large: "", medium: "", responsive: "" },
};
const INPUT_COMPOUND = [
  {
    variant: "underline",
    size: "large",
    className: "min-h-10 gap-x2_5 py-x2 text-t6 [--text-input-px:0px] [--text-input-icon:24px] [--text-input-clear:22px]",
  },
  {
    variant: "underline",
    size: "medium",
    className: "min-h-[2.125rem] gap-x2 py-x1_5 text-t5 [--text-input-px:0px] [--text-input-icon:20px] [--text-input-clear:18px]",
  },
  {
    variant: "underline",
    size: "responsive",
    className: "min-h-10 gap-x2_5 py-x2 text-t6 [--text-input-px:0px] [--text-input-icon:24px] [--text-input-clear:22px] lg:min-h-[2.125rem] lg:gap-x2 lg:py-x1_5 lg:text-t5 lg:[--text-input-icon:20px] lg:[--text-input-clear:18px]",
  },
];
const INPUT_DEFAULTS = { variant: "outline", size: "responsive" };
const AFFIX_EDGE = "first:ml-[var(--text-input-px)] last:mr-[var(--text-input-px)]";
const INPUT_ICON = "flex shrink-0 [&>svg]:size-[var(--text-input-icon)]";
const INPUT_ICON_COLOR = "text-fg-neutral-muted";
const INPUT_VALUE = ["min-w-0 flex-1 self-stretch border-0 bg-transparent p-0 caret-fg-neutral outline-none [font:inherit]", "first:pl-[var(--text-input-px)] last:pr-[var(--text-input-px)] disabled:cursor-not-allowed", "[&:-webkit-autofill]:bg-clip-text [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-fg-neutral)] [&:-webkit-autofill]:[transition:background-color_9999s_9999s]"];
const INPUT_VALUE_COLOR = "text-fg-neutral placeholder:text-fg-placeholder";
const INPUT_CLEAR = ["relative flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-fg-neutral-subtle", "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']", "[&>svg]:size-[var(--text-input-clear)]"];

// ── list.tsx 의 cva 와 같은 값 — 분류 머리(List Header mediumWeak) ─────────

const LIST_HEADER_BASE = "flex w-full items-center justify-between gap-x2_5 px-global-gutter py-x2 font-sans text-t4";
const LIST_HEADER_VARIANTS = { variant: { mediumWeak: "font-medium text-fg-neutral-subtle" } };
const LIST_HEADER_DEFAULTS = { variant: "mediumWeak" };

// ── radio-group.tsx 의 cva 와 같은 값 — 오른쪽 라디오(large · neutral) ──────

const RADIOMARK_BASE = "peer relative inline-grid shrink-0 cursor-pointer place-items-center rounded-full [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] active:[scale:calc(1-2/var(--press-basis))] group-active/radio:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1] motion-reduce:group-active/radio:[scale:1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring disabled:cursor-not-allowed disabled:[scale:1] border border-stroke-neutral-solid bg-transparent hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed group-hover/radio:bg-bg-layer-default-pressed group-active/radio:bg-bg-layer-default-pressed disabled:border-stroke-neutral-weak disabled:bg-bg-disabled data-[state=checked]:border-0 data-[state=checked]:disabled:bg-bg-disabled";
const RADIOMARK_VARIANTS = {
  size: { large: "size-6 [--press-basis:24]" },
  tone: {
    neutral: "data-[state=checked]:bg-bg-neutral-inverted data-[state=checked]:hover:bg-bg-neutral-inverted-pressed data-[state=checked]:active:bg-bg-neutral-inverted-pressed data-[state=checked]:group-hover/radio:bg-bg-neutral-inverted-pressed data-[state=checked]:group-active/radio:bg-bg-neutral-inverted-pressed",
  },
};
const RADIOMARK_DEFAULTS = { size: "medium", tone: "neutral" };
const DOT_BASE = "pointer-events-none block rounded-full bg-transparent [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)] data-[disabled]:data-[state=checked]:bg-fg-disabled";
const DOT_VARIANTS = { size: { large: "size-2.5" }, tone: { neutral: "data-[state=checked]:bg-fg-neutral-inverted" } };
const DOT_DEFAULTS = { size: "medium", tone: "neutral" };

// ── logo-tile.tsx 의 상수와 같은 값 — 기관 줄의 앞(Logo Tile 40) ───────────

const LOGO_SIZES = { 40: { box: "size-[40px] rounded-r3", initial: "text-[16px]", card: 32 } };
const LOGO_INSTITUTION_TEXT = {
  white: "text-static-white",
  dark: "text-fg-neutral dark:text-fg-neutral-inverted",
};
const LOGO_ROOT = [
  "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden align-middle",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-overlay)] after:content-['']",
].join(" ");
const LOGO_INITIAL = "absolute inset-0 flex items-center justify-center font-sans font-bold uppercase";
const LOGO_LINE_HEIGHT_1 = "leading-none";

// ── image-frame.tsx · aspect-ratio.tsx 의 cva · 상수와 같은 값 — 카드 상품 줄의 앞(카드 그림 56) ──

const FRAME_BASE = "relative isolate block max-w-full overflow-hidden [container-name:image-frame] [container-type:size] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-overlay)] after:content-['']";
const FRAME_VARIANTS = { radius: { "8": "rounded-r2" } };
const FRAME_DEFAULTS = { radius: "8" };
const CARD_FACE_TEXT = {
  white: "text-static-white",
  dark: "text-fg-neutral dark:text-fg-neutral-inverted",
};
const CARD_FACE = "relative size-full overflow-hidden font-sans";
const CARD_FACE_INITIAL = "absolute inset-0 flex items-center justify-center font-bold uppercase @min-[96px]/image-frame:hidden text-[length:max(10px,round(40cqh,1px))] leading-none";
const CARD_FACE_LABEL = "absolute inset-x-0 bottom-0 hidden flex-col px-x2_5 pb-x2 @min-[96px]/image-frame:flex @min-[240px]/image-frame:px-x4 @min-[240px]/image-frame:pb-x3_5";
const CARD_FACE_ISSUER = "truncate text-t2 font-medium @min-[240px]/image-frame:text-t3";
const CARD_FACE_NAME = "line-clamp-1 break-keep text-t4 font-bold [overflow-wrap:break-word] @min-[240px]/image-frame:line-clamp-2 @min-[240px]/image-frame:text-t5";
const FIXED_WIDTH = "shrink-0";
const FALLBACK = "absolute inset-0 flex";

// ── aspect-ratio.tsx 의 cva 와 같은 값 — 카드 비율 ─────────────────────

const RATIO_BASE = "";
const RATIO_VARIANTS = { ratio: { card: "aspect-[1.586]" } };
const RATIO_DEFAULTS = { ratio: "4:3" };

// ── badge.tsx 의 cva 와 같은 값 — 단종(weak · neutral · medium) ──────────────

const BADGE_BASE = "inline-flex min-w-0 cursor-default items-center gap-x0_5 overflow-hidden whitespace-nowrap font-sans";
const BADGE_VARIANTS = {
  variant: { weak: "font-medium" },
  tone: { neutral: "" },
  size: { medium: "min-h-x5 rounded-r1 px-x1_5 py-x0_5 text-t1" },
};
const BADGE_COMPOUND = [
  { variant: "weak", tone: "neutral", className: "bg-bg-neutral-weak text-fg-neutral-muted" },
];
const BADGE_DEFAULTS = { variant: "weak", tone: "neutral", size: "medium" };
const BADGE_LABEL = "min-w-0 truncate";

// ── button.tsx 의 cva 와 같은 값 — 다음 · 다시 시도 ─────────────────────

const BUTTON_BASE = "relative inline-flex items-center justify-center whitespace-nowrap font-sans font-bold before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring disabled:cursor-not-allowed disabled:[scale:1] disabled:bg-bg-disabled disabled:text-fg-disabled aria-busy:cursor-progress aria-busy:text-transparent aria-busy:[&>svg:not([data-slot=progress-circle])]:invisible aria-busy:active:[scale:1] [--progress-thickness:2px] [&_svg]:pointer-events-none [&_svg]:shrink-0";
const BUTTON_VARIANTS = {
  variant: {
    neutralSolid: "bg-bg-neutral-inverted text-fg-neutral-inverted hover:bg-bg-neutral-inverted-pressed active:bg-bg-neutral-inverted-pressed aria-busy:bg-bg-neutral-inverted-pressed [--progress-track:color-mix(in_srgb,var(--color-fg-neutral-inverted)_30%,transparent)] [--progress-range:var(--color-fg-neutral-inverted)]",
    neutralWeak: "bg-bg-neutral-weak text-fg-neutral hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed aria-busy:bg-bg-neutral-weak-pressed [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
  },
  size: {
    medium: "h-10 rounded-r2 [--press-basis:40] [--progress-size:16px]",
    large: "h-12 rounded-r3 [--press-basis:48] [--progress-size:18px]",
  },
  layout: { withText: "" },
  ghostColor: { neutral: "" },
};
const BUTTON_COMPOUND = [
  { size: "medium", layout: "withText", className: "px-x4 py-x2_5 gap-x1_5 text-t4 [&_svg]:size-4" },
  { size: "large", layout: "withText", className: "px-x5 py-x3 gap-x2 text-t6 [&_svg]:size-[22px]" },
];
const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// ── result-section.tsx 의 cva · 상수와 같은 값 — 0건 · 실패 ───────────────

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

// ── skeleton.tsx 의 상수와 같은 값 — 불러오는 줄 ───────────────────────

const SK_ROOT = "relative block overflow-hidden bg-bg-neutral-weak";
const SK_RADIUS = { "8": "rounded-r2", "12": "rounded-r3" };
const SK_TEXT_HEIGHT = { t3: "h-(--text-t3--line-height)", t5: "h-(--text-t5--line-height)" };
const SK_SHIMMER = [
  "pointer-events-none absolute inset-0 [transform:translateX(-100%)]",
  "bg-[image:var(--gradient-shimmer-neutral)] dark:bg-[image:var(--gradient-shimmer-neutral-dark)]",
  "animate-[shimmer_var(--motion-duration-loop)_var(--motion-ease-easing)_infinite]",
  "motion-reduce:animate-none motion-reduce:opacity-0",
].join(" ");

// ── bottom-sheet.tsx 의 상수 · JSX 클래스와 같은 값 — 시트의 틀(미리보기 그림) ─────

const SHEET_CLOSE = [
  "absolute right-global-gutter top-x6 flex size-7 cursor-pointer items-center justify-center rounded-full border-0 bg-bg-neutral-weak p-0 text-fg-neutral [&>svg]:size-3.5",
  "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed [--press-basis:28] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
const SHEET_HANDLE = [
  "absolute left-1/2 top-x1_5 h-1 w-9 -translate-x-1/2 cursor-pointer rounded-full bg-stroke-neutral-weak",
  "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
].join(" ");
const SHEET_BODY = "min-h-0 flex-1 overflow-y-auto overscroll-contain px-global-gutter";
const SHEET_BODY_PLAIN = "last:pb-x4";
const SHEET_HEADER = "flex shrink-0 flex-col gap-x2 px-global-gutter pb-x4 pt-x6";
const SHEET_TITLE = "m-0 text-t8 font-bold text-fg-neutral";

import { readFileSync } from "node:fs";

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
// 기관 색 표 — lib/institution-colors.ts 의 INSTITUTION_COLORS 를 그대로 읽는다(정적 미리보기는 TS 를 불러오지 못해 표의 글자를 푼다)
const INSTITUTION_COLORS = new Function(
  `return ${/export const INSTITUTION_COLORS[^=]*=\s*(\[[\s\S]*?\n\]);/.exec(readFileSync(new URL("../lib/institution-colors.ts", import.meta.url), "utf8"))[1]};`,
)();
const squash = (value) => value.replace(/\s+/g, "");
const KEYS = INSTITUTION_COLORS.map((entry) => ({ entry, keys: [entry.name, ...entry.aliases].map(squash).filter((key) => key !== "") }));
/** 기관 이름 → 기관 색 표의 한 줄(color · text …). 같은 이름 · 별칭, 아니면 든 가장 긴 이름, 없으면 null */
function institutionColor(name) {
  const query = squash(name ?? "");
  if (query === "") return null;
  for (const { entry, keys } of KEYS) if (keys.includes(query)) return entry;
  let found = null;
  let longest = 0;
  for (const { entry, keys } of KEYS) {
    for (const key of keys) {
      if (key.length > longest && query.includes(key)) {
        found = entry;
        longest = key.length;
      }
    }
  }
  return found;
}
const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });
/** 이니셜 — 표시 이름의 첫 글자 하나, 로마자는 대문자(avatar.tsx 의 avatarInitial 과 같은 답) */
const avatarInitial = (name) => {
  const shown = String(name).trim();
  return shown === "" ? "" : (graphemes.segment(shown)[Symbol.iterator]().next().value?.segment ?? "").toUpperCase();
};
// <LogoTile name> — logo-tile.tsx 그대로(크기 40 · 그림 없음 — 기관 색 면 + 첫 글자). 옆에 이름이 있어 장식(aria-hidden)
function logoTile(name) {
  const institution = institutionColor(name);
  const box = LOGO_SIZES[40];
  return `<span data-slot="logo-tile" data-face="institution" data-image="none" data-status="none" aria-hidden="true" class="${LOGO_ROOT} ${box.box}"><span aria-hidden="true" data-slot="logo-tile-initial" class="${[LOGO_INITIAL, LOGO_INSTITUTION_TEXT[institution.text], box.initial, LOGO_LINE_HEIGHT_1].join(" ")}" style="background-color:${institution.color}">${avatarInitial(name)}</span></span>`;
}
const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });
// <Button> — 글 버튼 · 아이콘 버튼(이름은 aria-label). 고른 변형 · 크기만 옮겼다
const button = ({ text = "", icon = "", label = "", variant, size, layout, ghostColor, className = "", extra = "" }) =>
  `<button ${attrs(['type="button"', label && `aria-label="${esc(label)}"`, extra, `class="${merge(`${buttonVariants({ variant, size, layout, ghostColor })} ${className}`)}"`])}>${icon ? svg(PATHS[icon]) : ""}${esc(text)}</button>`;
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

const textInputVariants = cvaOf(INPUT_BASE, { variants: INPUT_VARIANTS, compoundVariants: INPUT_COMPOUND, defaultVariants: INPUT_DEFAULTS });
const listHeaderVariants = cvaOf(LIST_HEADER_BASE, { variants: LIST_HEADER_VARIANTS, defaultVariants: LIST_HEADER_DEFAULTS });
const radiomarkVariants = cvaOf(RADIOMARK_BASE, { variants: RADIOMARK_VARIANTS, defaultVariants: RADIOMARK_DEFAULTS });
const radiomarkDotVariants = cvaOf(DOT_BASE, { variants: DOT_VARIANTS, defaultVariants: DOT_DEFAULTS });
const imageFrameVariants = cvaOf(FRAME_BASE, { variants: FRAME_VARIANTS, defaultVariants: FRAME_DEFAULTS });
const aspectRatioVariants = cvaOf(RATIO_BASE, { variants: RATIO_VARIANTS, defaultVariants: RATIO_DEFAULTS });
const badgeVariants = cvaOf(BADGE_BASE, { variants: BADGE_VARIANTS, compoundVariants: BADGE_COMPOUND, defaultVariants: BADGE_DEFAULTS });

/** 폭 → 모서리(SEED) — 24 이하 "4" · 48 이하 "6" · 그 위 "8"(image-frame.tsx 의 imageFrameRadius 와 같은 답) */
function imageFrameRadius(width) {
  if (width == null || Number.isNaN(width)) return "8";
  return width <= 24 ? "4" : width <= 48 ? "6" : "8";
}

// <CardArt width={56}> — 그림 없는 카드(아는 카드사의 카드 면 — 폭 96 미만이라 회사 첫 글자만). 카드 비율 · 고정 폭 56 → 모서리 8 · 장식
function cardArt56({ issuer, name }) {
  const institution = institutionColor(issuer);
  const radius = imageFrameRadius(56);
  return `<div ${attrs([
    'data-slot="card-art"',
    'data-state="fallback"',
    'data-ratio="card"',
    `data-radius="${radius}"`,
    'data-fit="cover"',
    `data-issuer="${institution ? "known" : "unknown"}"`,
    `class="${imageFrameVariants({ radius })} ${aspectRatioVariants({ ratio: "card" })} ${FIXED_WIDTH}"`,
    'style="width:56px"',
  ])}><div data-slot="image-frame-fallback" class="${FALLBACK}" aria-hidden="true"><div data-slot="card-art-face" data-text="${institution.text}" class="${CARD_FACE} ${CARD_FACE_TEXT[institution.text]}" style="background-color:${institution.color}"><span data-slot="card-art-initial" class="${CARD_FACE_INITIAL}">${avatarInitial(issuer)}</span><span data-slot="card-art-label" class="${CARD_FACE_LABEL}"><span data-slot="card-art-issuer" class="${CARD_FACE_ISSUER}">${esc(issuer)}</span><span data-slot="card-art-name" class="${CARD_FACE_NAME}">${esc(name)}</span></span></div></div></div>`;
}

// <Badge className> — weak · neutral · medium. 이름 옆에서는 줄지 않는다(shrink-0 — badge.md 의 이름 + 배지)
const badge = (text, className = "") =>
  `<span data-slot="badge" class="${merge(`${badgeVariants({ variant: "weak", tone: "neutral", size: "medium" })} ${className}`)}"><span data-slot="badge-label" class="${BADGE_LABEL}">${esc(text)}</span></span>`;

// ── <SearchableList> 조각 — searchable-list.tsx 가 그리는 DOM ───────────────────

// <SearchableListInput> — Input 밑줄형(앞 돋보기 · 값이 있으면 지우기), role="combobox". 강조한 줄이 있으면 aria-activedescendant
function searchInput({ id, placeholder, query = "", activeId = "", placement = "sheet" }) {
  const clear = query
    ? `<button type="button" aria-label="지우기" tabindex="-1" data-slot="text-input-clear" class="${merge(`${INPUT_CLEAR.join(" ")} ${AFFIX_EDGE}`)}">${svg(PATHS.circleX)}</button>`
    : "";
  const input = attrs([
    'type="text"',
    'data-slot="text-input-value"',
    `class="${merge(`${INPUT_VALUE.join(" ")} ${INPUT_VALUE_COLOR}`)}"`,
    'role="combobox"',
    'aria-expanded="true"',
    `aria-controls="${id}-listbox"`,
    'aria-autocomplete="list"',
    activeId && `aria-activedescendant="${activeId}"`,
    'aria-label="검색"',
    'autocomplete="off"',
    'spellcheck="false"',
    `placeholder="${esc(placeholder)}"`,
    `value="${esc(query)}"`,
  ]);
  return `<div data-slot="searchable-list-field" class="${FIELD} ${FIELD_BG[placement]}"><div data-slot="text-input" data-variant="underline" data-size="responsive" class="${textInputVariants({ variant: "underline", size: "responsive" })}"><span data-slot="text-input-prefix-icon" aria-hidden="true" class="${merge(`${INPUT_ICON} ${AFFIX_EDGE} ${INPUT_ICON_COLOR}`)}">${svg(PATHS.search)}</span><input ${input}>${clear}</div></div>`;
}

// <SearchableListItem> — 줄(role="option"). 오른쪽 라디오는 보는 표시(aria-hidden), 고름은 aria-selected 가 알린다.
// highlighted 는 ↓ ↑("keyboard") · 마우스("pointer")로 짚은 줄 — 좌우 6 들어온 bg-layer-default-pressed · 모서리 10
function option({ id, value, title, detail, prefix, selected = false, highlighted = "" }) {
  const state = selected ? "checked" : "unchecked";
  return `<div ${attrs([
    `id="${id}"`,
    'role="option"',
    `aria-selected="${selected}"`,
    `data-value="${esc(value)}"`,
    'data-slot="searchable-list-item"',
    highlighted && `data-highlighted="${highlighted}"`,
    `class="${OPTION}"`,
  ])}><div data-slot="searchable-list-item-content" class="${OPTION_CONTENT}">${
    prefix ? `<span aria-hidden="true" data-slot="searchable-list-item-prefix" class="${ITEM_PREFIX}">${prefix}</span>` : ""
  }<span class="${ITEM_BODY}"><span data-slot="searchable-list-item-title" class="${ITEM_TITLE}">${esc(title)}</span>${
    detail ? `<span data-slot="searchable-list-item-detail" class="${ITEM_DETAIL}">${detail}</span>` : ""
  }</span><span aria-hidden="true" data-slot="searchable-list-item-radio" data-state="${state}" class="${merge(`${radiomarkVariants({ size: "large" })} ${ITEM_RADIO}`)}"><span data-state="${state}" class="${radiomarkDotVariants({ size: "large" })}"></span></span></div></div>`;
}

// <SearchableListGroup label> — 분류 머리(List Header mediumWeak)가 묶음(role="group")의 이름
const group = (id, label, options) =>
  `<div role="group" aria-labelledby="${id}" data-slot="searchable-list-group" class="${GROUP}"><div id="${id}" role="presentation" data-slot="searchable-list-group-label" class="${listHeaderVariants({ variant: "mediumWeak" })}">${esc(label)}</div>${options.join("")}</div>`;
// <SearchableListResults aria-label> — role="listbox"
const results = (id, label, html) => `<div id="${id}-listbox" role="listbox" aria-label="${esc(label)}" data-slot="searchable-list-results" class="${RESULTS}">${html}</div>`;
// <SearchableList placement>
const searchableList = (placement, html) => `<div data-slot="searchable-list" data-placement="${placement}" class="${SL_ROOT}">${html}</div>`;
// <SearchableListSkeleton prefix rows> — 줄 높이 그대로(위아래 12 · 좌우 24), 제목 t5 40% + 설명 t3 60%
const skeletonRows = (prefix, rows = 5) =>
  `<div aria-hidden="true" data-slot="searchable-list-skeleton" class="${SKELETON_LIST}">${Array.from(
    { length: rows },
    () =>
      `<div data-slot="searchable-list-skeleton-row" class="${SKELETON_ROW}"><span class="${SKELETON_PREFIX}">${
        prefix === "logo" ? skeleton({ radius: "12", className: SKELETON_SIZE.logo }) : skeleton({ radius: imageFrameRadius(56), className: SKELETON_SIZE.cardArt })
      }</span><span class="${SKELETON_BODY}">${skeleton({ text: "t5", className: SKELETON_SIZE.title })}${skeleton({ text: "t3", className: SKELETON_SIZE.detail })}</span></div>`,
  ).join("")}</div>`;

// ── 시트의 틀 — bottom-sheet.tsx 의 클래스로 그린 미리보기 그림(화면 아래 고정 · 딤 · 움직임 없이) ─────────

const SHEET_SURFACE = "relative flex w-full max-w-[360px] flex-col overflow-hidden rounded-t-r6 bg-bg-layer-floating font-sans text-fg-neutral";
const sheet = (title, body, height = 560) =>
  `<div role="dialog" aria-label="${esc(title)}" data-slot="bottom-sheet-content" class="${SHEET_SURFACE}" style="height:${height}px; box-shadow:var(--shadow-s3);"><button type="button" aria-label="닫기" data-slot="bottom-sheet-handle" class="${SHEET_HANDLE}"></button><div data-slot="bottom-sheet-header" class="${SHEET_HEADER}"><h2 data-slot="bottom-sheet-title" class="${SHEET_TITLE} pr-x10">${esc(title)}</h2></div><button type="button" aria-label="닫기" data-slot="bottom-sheet-close" class="${SHEET_CLOSE}">${svg(PATHS.x)}</button><div data-slot="bottom-sheet-body" class="${merge(`${SHEET_BODY} ${SHEET_BODY_PLAIN} px-0`)}">${body}</div></div>`;
// 단계 안(inline) — 화면의 기본 면 위. 폭 360 의 휴대폰 화면처럼
const SCREEN = "max-width:360px; overflow:hidden; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-weak); border-radius:var(--radius-r4); padding:var(--spacing-x4) 0 var(--spacing-x6);";
const screen = (html) => `<div style="${SCREEN}">${html}</div>`;
const CAPTION = "display:block; margin-top:var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="flex:1 1 300px; max-width:360px; min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;
const row = (items) => `<div style="display:flex; flex-wrap:wrap; gap:var(--spacing-x6); align-items:flex-start;">${items.join("")}</div>`;

// ── 데이터 ────────────────────────────────────────────────────────────────

// 은행 — 기관 색 표의 분류 차례(시중은행 · 인터넷은행 …). 지금 값 신한
const BANKS = [
  { label: "시중은행", items: ["신한", "KB국민", "우리", "하나", "NH농협", "IBK기업"] },
  { label: "인터넷은행", items: ["카카오뱅크", "토스뱅크", "케이뱅크"] },
];
const bankList = ({ id, value = "신한", highlight = "", filter = null }) =>
  results(
    id,
    "은행",
    BANKS.map((g, gi) => ({ ...g, items: filter ? g.items.filter(filter) : g.items }))
      .filter((g) => g.items.length)
      .map((g, gi) => group(`${id}-g${gi}`, g.label, g.items.map((name, i) => option({ id: `${id}-o${gi}-${i}`, value: name, title: name, prefix: logoTile(name), selected: name === value, highlighted: name === highlight ? "keyboard" : "" }))))
      .join(""),
  );

// 카드 상품 — 카드 그림 56 · 카드사 · 종류 · 단종은 흐리지 않고 Badge. 지금 값 M EDITION3
const CARDS = [
  { id: "id-select-all", name: "iD SELECT ALL", issuer: "삼성카드", kind: "신용" },
  { id: "m-edition3", name: "M EDITION3", issuer: "현대카드", kind: "신용" },
  { id: "sol-travel", name: "SOL트래블 체크", issuer: "신한카드", kind: "체크" },
  { id: "loca-365", name: "LOCA 365", issuer: "롯데카드", kind: "신용", discontinued: true },
];
// 설명 — 카드사 · 종류 + 단종 배지(사이 6 · 가운데 맞춤 — searchable-list.md 의 코드)
const cardDetail = (c) => `<span class="flex items-center gap-x1_5">${esc(c.issuer)} · ${esc(c.kind)}${c.discontinued ? badge("단종", "shrink-0") : ""}</span>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const searchableListExamples = [
  {
    title: "은행 고르기 — 검색 시트",
    description:
      "스크롤만으로 찾기 어려운 긴 목록(은행 · 증권사 · 카드 상품 · 종목 · 결재자)에서 하나를 고른다 — 대개 Input Button 이 여는 검색 시트(1280 미만) · 팝오버(이상)의 내용이다. 검색칸은 Input 의 밑줄형이다(화면에 입력이 하나뿐인 목록 위 검색 — 상자형 52 는 두지 않는다): large 40(글 18 / 24 · 돋보기 24 · 지우기 22, 누르는 영역 44) · 데스크톱 medium 34(글 16 / 22 · 돋보기 20 · 지우기 18), 아래 1px stroke-neutral-weak 가 치는 동안 2px stroke-neutral-contrast, 모서리 · 좌우 여백 없음. 좌우 24 안이라 돋보기와 줄의 로고 타일이 한 줄에 서고, 목록이 스크롤해도 위에 붙어 있다. 칸 ↔ 목록 8. 결과는 분류(List Header mediumWeak — 14 · 500 · fg-neutral-subtle, 줄이 남지 않은 분류는 머리째 숨긴다) 아래 List 의 줄(위아래 12 · 좌우 24 · 제목 16 / 22) + 앞 Logo Tile 40 + 오른쪽 라디오 24(지금 값만 켬 — 고른 줄의 바탕은 칠하지 않는다, 고름은 aria-selected)다. 고르면 시트가 닫히고 칸에 값이 들어간다(\"완료\" 없음). 시트 본문은 좌우 여백을 뺀다(className=\"px-0\") — 검색칸 · 줄이 제 24 를 가진다. 열면 검색칸에 초점이 간다.",
    jsx: `import { ChevronDown } from "lucide-react"
import { BottomSheet, BottomSheetBody, BottomSheetContent } from "@/components/ui/bottom-sheet"
import { Field } from "@/components/ui/field"
import { InputButton } from "@/components/ui/input-button"
import { LogoTile } from "@/components/ui/logo-tile"
import {
  SearchableList, SearchableListEmpty, SearchableListGroup, SearchableListInput, SearchableListItem, SearchableListResults,
} from "@/components/ui/searchable-list"

const groups = groupInstitutions(filterByName(INSTITUTIONS, query)) // 시중은행 · 인터넷은행 · 지방은행 · 특수은행 · 저축기관 · 외국계 · 기타

<Field label="은행">
  <BottomSheet open={open} onOpenChange={setOpen}>
    <InputButton placeholder="은행 선택" value={bank?.name} suffixIcon={<ChevronDown />} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)} />
    <BottomSheetContent title="은행 선택">
      {/* 본문 좌우 여백을 뺀다 — 검색칸 · 줄이 제 24 를 가진다(bottom-sheet.md) */}
      <BottomSheetBody className="px-0">
        {/* 고르면 닫는다 — "완료" 없음 */}
        <SearchableList value={bank?.id} onValueChange={(id) => { setBank(byId(id)); setOpen(false) }} query={query} onQueryChange={setQuery}>
          <SearchableListInput placeholder="은행 이름 검색" />
          {groups.length === 0 ? (
            <SearchableListEmpty />
          ) : (
            <SearchableListResults aria-label="은행">
              {groups.map((g) => (
                <SearchableListGroup key={g.label} label={g.label}>
                  {g.items.map((it) => (
                    <SearchableListItem key={it.id} value={it.id} title={it.name} prefix={<LogoTile name={it.name} />} />
                  ))}
                </SearchableListGroup>
              ))}
            </SearchableListResults>
          )}
        </SearchableList>
      </BottomSheetBody>
    </BottomSheetContent>
  </BottomSheet>
</Field>`,
    render: () => sheet("은행 선택", searchableList("sheet", `${searchInput({ id: "sl-ex-bank", placeholder: "은행 이름 검색" })}${bankList({ id: "sl-ex-bank" })}`)),
  },

  {
    title: "카드 상품 — 서버 검색 · 단계 안",
    description:
      "서버에서 찾는 목록(카드 상품 · 종목)은 마지막 입력 뒤 300ms 에 한 번 보낸다(onSearch — 글자마다 보내지 않는다) — 받는 동안은 옛 결과를 그대로 두고 1초가 넘으면 줄 스켈레톤이다. 고르는 것이 그 단계의 일이면(카드 추가의 카드 상품) 시트가 아니라 화면 · 단계 안에 둔다(placement=\"inline\") — 고르면 라디오만 바뀌고 단계의 버튼(\"다음\")이 반영한다. 카드 상품의 앞은 카드 그림 56(카드 비율 · 모서리 8 — 그림이 없으면 카드사 색 면 + 첫 글자), 단종처럼 알릴 것은 흐리지 않고 Badge(\"단종\" — weak neutral)를 단다. 검색칸의 바탕은 놓인 자리의 면(단계 안 bg-layer-default)이다.",
    jsx: `import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CardArt } from "@/components/ui/image-frame"
import {
  SearchableList, SearchableListEmpty, SearchableListError, SearchableListInput, SearchableListItem, SearchableListResults, SearchableListSkeleton,
} from "@/components/ui/searchable-list"

<SearchableList placement="inline" value={cardId} onValueChange={setCardId} query={query} onQueryChange={setQuery} onSearch={setSearch}>
  <SearchableListInput placeholder="카드 이름 검색" />
  {catalog.isPending ? (
    <SearchableListSkeleton prefix="cardArt" />
  ) : catalog.isError ? (
    <SearchableListError onRetry={() => catalog.refetch()} />
  ) : catalog.data.length === 0 ? (
    <SearchableListEmpty description="카드사 이름으로도 찾아보세요." />
  ) : (
    <SearchableListResults aria-label="카드 상품">
      {catalog.data.map((c) => (
        <SearchableListItem
          key={c.id}
          value={c.id}
          prefix={<CardArt name={c.name} issuer={c.issuer} src={c.imageUrl} width={56} />}
          title={c.name}
          detail={<span className="flex items-center gap-x1_5">{c.issuer} · {c.kindLabel}{c.discontinued && <Badge className="shrink-0">단종</Badge>}</span>}
        />
      ))}
    </SearchableListResults>
  )}
</SearchableList>
<Button size="large" disabled={!cardId} onClick={next}>다음</Button>`,
    render: () =>
      screen(
        `${searchableList(
          "inline",
          `${searchInput({ id: "sl-ex-card", placeholder: "카드 이름 검색", placement: "inline" })}${results(
            "sl-ex-card",
            "카드 상품",
            CARDS.map((c, i) => option({ id: `sl-ex-card-o${i}`, value: c.id, title: c.name, detail: cardDetail(c), prefix: cardArt56(c), selected: c.id === "m-edition3" })).join(""),
          )}`,
        )}<div style="padding:var(--spacing-x4) var(--spacing-x6) 0;">${button({ text: "다음", variant: "neutralSolid", size: "large", className: "w-full" })}</div>`,
      ),
  },

  {
    title: "강조 · 누름 — 키보드는 콤보박스",
    description:
      "초점은 늘 검색칸에 있고 ↓ ↑ 는 결과 사이의 강조만 옮긴다 — 강조한 줄은 좌우 6 들어온 bg-layer-default-pressed · 모서리 10(List 의 누름 바탕)이고 검색칸이 aria-activedescendant 로 그 줄을 가리킨다. 분류 머리는 건너뛰고 끝에서 멈춘다. Enter 는 강조한 줄을 고른다(강조가 없으면 아무것도 하지 않는다 — 폼을 제출하지 않는다). Esc 는 검색어가 있으면 지우고, 비었으면 시트 · 팝오버를 닫는다. 글자를 치면 거르고 강조를 지운다. 줄은 Tab 으로 들어가지 않는다 — 라디오 목록처럼 화살표로 고르지 않는다(콤보박스, 사용자 결정 12A). 마우스로 올린 줄도 같은 바탕이고(한 번에 한 줄), 누르면 같은 바탕에 콘텐츠만 2px 거리 축소다. 그림은 \"우\" 를 치고 ↓ 로 우리를 짚은 순간이다.",
    jsx: `<SearchableList value={bank?.id} onValueChange={choose} query={query} onQueryChange={setQuery}>
  {/* ↓ ↑ 강조 · Enter 고름 · Esc 지움 — 초점은 검색칸에 그대로(aria-activedescendant) */}
  <SearchableListInput placeholder="은행 이름 검색" />
  <SearchableListResults aria-label="은행">…</SearchableListResults>
</SearchableList>`,
    render: () =>
      sheet(
        "은행 선택",
        searchableList("sheet", `${searchInput({ id: "sl-ex-key", placeholder: "은행 이름 검색", query: "우", activeId: "sl-ex-key-o0-0" })}${bankList({ id: "sl-ex-key", highlight: "우리", filter: (n) => n.includes("우") })}`),
        300,
      ),
  },

  {
    title: "0건 · 실패 · 불러오는 줄",
    description:
      "결과가 없으면 목록 자리에 Result Section medium — 제목은 검색어로 만든다(\"'카카오'에 대한 검색 결과가 없어요\" — 기본) · 설명은 할 수 있는 일, 아이콘 search-x 이고 role=\"status\" 로 한 번 알린다. 결과 개수는 알리지 않는다. 못 불러왔으면 0건과 따로 failure \"검색 결과를 불러오지 못했어요\" + 다시 시도(retrying 이면 버튼 로딩) — 실패를 \"결과가 없어요\" 로 보이지 않는다. 처음 불러오는 동안은 줄 모양 스켈레톤 다섯(앞 자리 · 제목 40% · 설명 60%, 줄 높이 그대로)이다.",
    jsx: `<SearchableListEmpty description="은행 이름의 일부로도 찾아보세요." />
<SearchableListError onRetry={() => banks.refetch()} retrying={banks.isFetching} />
<SearchableListSkeleton prefix="logo" />`,
    render: () =>
      row([
        labeled(screen(searchableList("inline", `${searchInput({ id: "sl-ex-empty", placeholder: "은행 이름 검색", query: "카카오", placement: "inline" })}${resultSection({ kind: "empty", icon: "searchX", title: "'카카오'에 대한 검색 결과가 없어요", description: "은행 이름의 일부로도 찾아보세요." })}`)), "0건 — 한 번 알린다"),
        labeled(screen(searchableList("inline", `${searchInput({ id: "sl-ex-error", placeholder: "은행 이름 검색", query: "토스", placement: "inline" })}${resultSection({ kind: "failure", title: "검색 결과를 불러오지 못했어요", primary: "다시 시도" })}`)), "실패 — 다시 시도"),
        labeled(screen(searchableList("inline", `${searchInput({ id: "sl-ex-loading", placeholder: "은행 이름 검색", placement: "inline" })}${skeletonRows("logo")}`)), "불러오는 동안 — 줄 다섯"),
      ]),
  },
];
