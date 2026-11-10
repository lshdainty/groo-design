/*
 * shadcn Select 예제 — docs site components/select.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 넷(기본 · 묶음 · 아이콘 · "없음" · 여럿 고르기 · 상태)은 차례 · 제목 · 코드가
 * specs/components/select.md 의 "코드" 절과 같고, 뒤의 다섯(크기 · 트리거 상태 · 선택지 상태 · 앞 아이콘 · 여럿 고른 값)은 md 의
 * Properties · Guidelines 를 코드로 더 보인다.
 *
 * SIZES · TRIGGER_CONTENT · TRIGGER_CONTENT_PRESS · CHEVRON_OPEN · CHEVRON_CLOSED · CONTENT · SCROLL · GROUP · ITEM · PILL · PILL_OFF · PILL_ON ·
 * PILL_PRESS · ITEM_CONTENT · ITEM_CONTENT_PRESS 는 recipes/shadcn/components/ui/select.tsx 의 상수와, TRIGGER_BASE · PREFIX_ICON · VALUE_BASE ·
 * MEASURE · CHEVRON_BASE · GROUP_LABEL · ITEM_DISABLED · ITEM_ICON · ITEM_BODY · ITEM_LABEL · INDICATOR · *_COLOR 는 그 파일의 JSX 에 적힌
 * 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 트리거의 상자 IB_SIZE_* · IB_SURFACE_* 는 input-button.tsx 의
 * cva(inputButtonVariants · inputButtonSurfaceVariants)와 같다 — input-button-examples.mjs 의 것과도 같다(input-button.tsx 를 고치면 셋을 함께).
 * 둘레의 FIELD_* · field() 는 field.tsx 의 것이다 — input-examples.mjs 의 것과 같다.
 * 규칙은 specs/components/select.md, 수치 원본은 specs/components/select.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 트리거 <button role="combobox" data-slot="select-trigger"> > 콘텐츠 <span data-slot="select-trigger-content">
 * (앞 아이콘 · 값 <span data-slot="select-value"> · 셰브론 <svg data-slot="select-chevron">), 목록 <div role="listbox" data-slot="select-content"> >
 * 스크롤 자리 <div data-slot="select-scroll"> > 묶음 <div role="group" data-select-group> > 제목 · 선택지 <div role="option" data-slot="select-item">
 * > 알약 <span> + 콘텐츠 <span>(아이콘 · 글 · 설명 · 체크). 묶음 사이 선은 둘째 묶음부터의 ::before 다.
 * 레시피가 cn() 으로 합치는 자리는 merge() 로 똑같이 합친다 — 같은 속성을 다시 쓴 클래스는 뒤의 것만 남는다.
 * 레시피는 목록을 Radix Popover 로 body 에 띄워 트리거 아래 8 에 붙인다. 정적 미리보기는 목록을 트리거 바로 뒤 흐름 안(Field 의 사이 8)에 그린다 —
 * 실제로는 떠서 아래 내용(설명 · 다음 칸)을 덮는다. Radix 가 실행 중에 붙이는 것 중 열린 트리거의 aria-controls · 목록의 id ·
 * data-state="open"(목록 클래스가 읽는다) · 폭 변수(--radix-popover-trigger-width)만 그리고, 트리거의 data-state · 목록의 data-side ·
 * data-align · 자리 변수 · 자리를 잡는 감싼 div 는 그리지 않는다. 목록의 z-(--z-floating) 이 사이트 머리 막대(z 100) 위로 올라오지 않게 미리보기 틀에 isolation 을 둔다.
 * id 는 레시피의 useId 자리다 — 예제마다 앞말을 달리해 한 페이지에서 겹치지 않게 한다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 * 레시피의 스크립트(열고 닫기 · 짚기 · 고르기 · 글자로 찾기 · 여럿 고른 글의 폭 재기 · 누르는 순간 --press-basis 재기)는 정적 HTML 에 없다 —
 * 트리거에 마우스를 올리면 바탕은 레시피 그대로 바뀌지만 목록은 열리지 않고, 알약은 미리보기에 적은 선택지에만 있다.
 */

// ── select.tsx 의 상수와 같은 값 ─────────────────────────────────────────

// 크기 — 트리거는 Input Button 의 크기를 그대로 쓰고, 목록 안은 여기서
const SIZES = {
  large: {
    item: "py-x3",
    itemContent: "gap-x3",
    itemIcon: "[&>svg]:size-[22px]",
    itemLabel: "text-t5",
    itemDescription: "text-t3",
    indicator: "size-[14px]",
    groupLabel: "py-x2_5 text-t4 font-medium",
  },
  medium: {
    item: "py-x2_5",
    itemContent: "gap-x2",
    itemIcon: "[&>svg]:size-[18px]",
    itemLabel: "text-t4",
    itemDescription: "text-t2",
    indicator: "size-[12px]",
    groupLabel: "py-x2 text-t3 font-normal",
  },
  responsive: {
    item: "py-x3 lg:py-x2_5",
    itemContent: "gap-x3 lg:gap-x2",
    itemIcon: "[&>svg]:size-[22px] lg:[&>svg]:size-[18px]",
    itemLabel: "text-t5 lg:text-t4",
    itemDescription: "text-t3 lg:text-t2",
    indicator: "size-[14px] lg:size-[12px]",
    groupLabel: "py-x2_5 text-t4 font-medium lg:py-x2 lg:text-t3 lg:font-normal",
  },
};

// 트리거의 콘텐츠 층 — 앞 아이콘 · 값 · 셰브론. 트리거를 누르는 동안만 준다(테두리 · 바탕은 그대로)
const TRIGGER_CONTENT =
  "relative flex min-w-0 flex-1 items-center gap-[inherit] [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const TRIGGER_CONTENT_PRESS =
  "group-active/select-trigger:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/select-trigger:[scale:1]";

// 셰브론 — 열 때 150ms · 닫을 때 100ms 로 돈다
const CHEVRON_OPEN = "rotate-180 [transition:rotate_var(--motion-duration-d3)_var(--motion-ease-easing)]";
const CHEVRON_CLOSED = "rotate-0 [transition:rotate_var(--motion-duration-d2)_var(--motion-ease-easing)]";

// 목록 — 트리거 폭 · 모서리 20 · 떠 있는 바탕 + s3. 열고 닫는 모션은 Radix 의 data-state 를 읽는다
const CONTENT = [
  "z-(--z-floating) w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-r5 bg-bg-layer-floating font-sans shadow-[var(--shadow-s3)] outline-none",
  "origin-[var(--radix-popover-content-transform-origin)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-[var(--motion-duration-d3)] data-[state=open]:ease-[var(--motion-ease-enter)] motion-safe:data-[state=open]:zoom-in-95",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-[var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)] motion-safe:data-[state=closed]:zoom-out-95",
].join(" ");

// 스크롤 자리 — 위아래 8 · 묶음 사이 8. 높이는 min(480, max(200, 남은 화면)) — 자리를 재기 전에는 480. 480 은 listMaxHeight 가 바꾼다
const SCROLL =
  "relative flex max-h-[min(var(--select-list-max-height,480px),max(200px,var(--radix-popover-content-available-height,480px)))] flex-col gap-x2 overflow-y-auto py-x2";

// 묶음 — 둘째 묶음부터 위에 1px 선(좌우 16 들임 · 아래 8). 위쪽 8 은 스크롤 자리의 gap — 묶음 사이 8 + 1 + 8 = 17
const GROUP =
  "flex flex-col [[data-select-group]+&]:before:mx-x4 [[data-select-group]+&]:before:mb-x2 [[data-select-group]+&]:before:h-px [[data-select-group]+&]:before:bg-stroke-neutral-subtle [[data-select-group]+&]:before:content-['']";

// 선택지 — 줄은 그대로, 알약(바탕 층)이 좌우 8 들어오며 칠해지고 콘텐츠 층만 누르는 동안 준다
const ITEM = "group/select-item relative flex cursor-pointer select-none items-center px-x4 scroll-my-x2";
const PILL =
  "pointer-events-none absolute inset-y-0 rounded-r3 [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),inset_var(--motion-duration-color-transition)_var(--motion-ease-easing)]";
const PILL_OFF = "inset-x-0 bg-transparent";
const PILL_ON = "inset-x-x2 bg-bg-layer-floating-pressed";
const PILL_PRESS = "group-active/select-item:inset-x-x2 group-active/select-item:bg-bg-layer-floating-pressed";
const ITEM_CONTENT =
  "relative flex min-w-0 flex-1 items-center [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const ITEM_CONTENT_PRESS =
  "group-active/select-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/select-item:[scale:1]";

// ── select.tsx 의 JSX 에 적힌 클래스 ──────────────────────────────────────

// 트리거 — cn(TRIGGER_BASE, inputButtonVariants({ size }), inputButtonSurfaceVariants({ state, hover: "self", invalid }), className)
const TRIGGER_BASE = "group/select-trigger relative flex w-full min-w-0 items-center text-left";
// 앞 아이콘 — cn(PREFIX_ICON, 아이콘 색)
const PREFIX_ICON = "flex shrink-0 [&>svg]:size-[var(--input-button-icon)]";
// 값 — cn(VALUE_BASE, 값 색). 여럿 고른 글이 칸에 들어가는지 재는 숨긴 한 줄 글(MEASURE)이 그 안에 있다
const VALUE_BASE = "relative min-w-0 flex-1 truncate";
const MEASURE = "invisible absolute left-0 top-0 whitespace-nowrap";
// 셰브론 — cn(CHEVRON_BASE, 아이콘 색, 열림 ? CHEVRON_OPEN : CHEVRON_CLOSED)
const CHEVRON_BASE = "size-[var(--input-button-icon)] shrink-0";
const ICON_COLOR = { enabled: "text-fg-neutral-muted", disabled: "text-fg-disabled" };
const VALUE_COLOR = { value: "text-fg-neutral", placeholder: "text-fg-placeholder", disabled: "text-fg-disabled" };

// 묶음 제목 — cn(GROUP_LABEL, sizes.groupLabel)
const GROUP_LABEL = "px-x4 text-fg-neutral-subtle";
// 선택지 — cn(ITEM, sizes.item, 막힘 && ITEM_DISABLED). 막히면 ITEM 의 cursor-pointer 가 빠진다
const ITEM_DISABLED = "cursor-not-allowed";
// 선택지 아이콘 — cn(ITEM_ICON, sizes.itemIcon, 색) · 본문(cn 없음) · 글 — cn(ITEM_LABEL, sizes.itemLabel, 색) · 설명 — cn(sizes.itemDescription, 색) ·
// 체크 — cn(INDICATOR, sizes.indicator, 색)(lucide check · 선 2.5)
const ITEM_ICON = "flex shrink-0";
const ITEM_BODY = "flex min-w-0 flex-1 flex-col items-start gap-x0_5 text-left";
const ITEM_LABEL = "font-normal";
const INDICATOR = "shrink-0";
const ITEM_COLOR = { label: "text-fg-neutral", description: "text-fg-neutral-subtle", disabled: "text-fg-disabled" };

// ── input-button.tsx 의 cva 와 같은 값 — 트리거의 상자 ─────────────────────

// 상자의 크기(inputButtonVariants) — 높이 · 모서리 · 좌우 여백 · 사이 · 글자, --input-button-icon(앞 · 뒤 아이콘) · --input-button-clear(지우기)
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

// 상자의 겉모습(inputButtonSurfaceVariants) — 테두리는 안쪽 1px(inset shadow), 오류 2px 는 ::after 로 덧그린다
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

// ── field.tsx 의 클래스 — 칸을 감싸는 둘레 ─────────────────────────────

const FIELD_ROOT = "flex w-full min-w-0 flex-col gap-x2";
const FIELD_HEADER = "flex flex-wrap items-center justify-between gap-x2_5 px-x0_5 [&>:first-child:not(:last-child)]:min-w-[50%] [&>:first-child:not(:last-child)]:flex-1";
// 라벨 — cn("min-w-0 font-sans text-t5 text-fg-neutral", 굵기)
const FIELD_LABEL = "min-w-0 font-sans text-t5 text-fg-neutral";
const FIELD_LABEL_WEIGHT = { medium: "font-medium", bold: "font-bold" };
const FIELD_REQUIRED = "ml-[0.125rem] mt-[0.25rem] inline-block size-[0.375rem] rounded-full bg-fg-critical align-top";
const FIELD_INDICATOR = "pl-[0.25rem] align-bottom text-t4 font-normal leading-[var(--text-t5--line-height)] text-fg-neutral-subtle";
const FIELD_ACTION = "-my-[5px] ml-auto flex shrink-0 items-center";
const FIELD_FOOTER = "flex items-start gap-x2 px-x0_5 font-sans";
const FIELD_ERROR = "m-0 flex min-w-0 text-t4 text-fg-critical";
const FIELD_ERROR_ICON = "mr-x1_5 mt-[calc((var(--text-t4--line-height)_-_1rem)/2)] size-4 shrink-0";
const FIELD_DESCRIPTION = "m-0 flex min-w-0 text-t4 text-fg-neutral-subtle";
const FIELD_DESCRIPTION_ICON = "mr-x1_5 mt-[calc((var(--text-t4--line-height)_-_1rem)/2)] flex shrink-0 [&>svg]:size-4";
const FIELD_TEXT = "min-w-0";
const FIELD_COUNT = "m-0 ml-auto shrink-0 text-t4 tabular-nums";

// 사이트의 `.content p { margin: 12px 0; color: text-primary }` 는 층(@layer) 밖 규칙이라 Tailwind utility(@layer utilities)를
// 늘 이긴다 — 꼬리의 <p> 에는 클래스가 정한 바깥 여백 · 글자색을 style 로 한 번 더 적는다(레시피에는 없는 미리보기용 덧칠)
const P_FIX = {
  error: "margin:0; color:var(--color-fg-critical);",
  description: "margin:0; color:var(--color-fg-neutral-subtle);",
  count: "margin:0 0 0 auto;",
};

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다.
// 참 · 거짓 축(invalid)은 cva 처럼 "true" · "false" 글자 키로 찾고, compound 는 값 그대로 견준다
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

const inputButtonVariants = cvaOf(IB_SIZE_BASE, { variants: IB_SIZE_VARIANTS, defaultVariants: IB_SIZE_DEFAULTS });
const inputButtonSurfaceVariants = cvaOf(IB_SURFACE_BASE, {
  variants: IB_SURFACE_VARIANTS,
  compoundVariants: IB_SURFACE_COMPOUND,
  defaultVariants: IB_SURFACE_DEFAULTS,
});

// "group-active/select-item:[scale:1]" → ["group-active/select-item", "[scale:1]"] — 괄호 안의 ":" 는 가르지 않는다
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
// 배경 · 글자색 · 커서 · 좌우 자리(inset-x) · 테두리 색 · 임의 속성([prop:…]). text-t* 는 글자 크기라 글자색과 겹치지 않는다
// (recipes/shadcn/lib/utils.ts). 그래서 막힌 · 읽기 전용 트리거의 bg-bg-disabled 가 bg-transparent 를, 오류의 after:border-stroke-critical-solid 가
// after:border-transparent 를, 막힌 선택지의 cursor-not-allowed 가 cursor-pointer 를 지운다
const GROUPS = [
  [/^bg-/, "bg"],
  [/^text-(?:fg-|static-)/, "color"],
  [/^cursor-/, "cursor"],
  [/^inset-x-/, "inset-x"],
  [/^border-(?:transparent|stroke-)/, "border-color"],
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

// 정적 미리보기에서 누름 · 포커스를 보이려고 — 그 상태의 클래스(active: · group-active/… · focus-visible:)에서 접두어만 뗀 사본을
// 뒤에 붙인다(merge 가 겹치는 기본값을 지운다). 값은 레시피 그대로라 select.tsx · input-button.tsx 가 바뀌면 같이 따라간다
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

const pressed = (classList, state) => merge(`${classList} ${forceState(classList, state)}`);

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const join = (...ids) => ids.filter(Boolean).join(" ") || undefined;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// 글자 수 — field.tsx 처럼 자소(grapheme) 단위로 센다
const segmenter = new Intl.Segmenter("ko", { granularity: "grapheme" });
const countGraphemes = (value) => Array.from(segmenter.segment(value)).length;

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기는 감싼 자리의 [&>svg]:size-* 나 class 가 정한다
const svg = (paths, { strokeWidth = 2, cls = "", slot = "" } = {}) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ""} aria-hidden="true"${slot ? ` data-slot="${slot}"` : ""}>${paths}</svg>`;

const PATHS = {
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  circleAlert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
};

const ICONS = {
  circleSlash: svg('<circle cx="12" cy="12" r="10"/><line x1="9" x2="15" y1="15" y2="9"/>'),
  creditCard: svg('<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>'),
  landmark: svg(
    '<path d="M10 18v-7"/><path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/><path d="M6 18v-7"/>',
  ),
  banknote: svg('<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>'),
  wallet: svg(
    '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  ),
  tag: svg(
    '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
  ),
  utensils: svg('<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>'),
  bus: svg(
    '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>',
  ),
  shoppingBag: svg(
    '<path d="M16 10a4 4 0 0 1-8 0"/><path d="M3.103 6.034h17.794"/><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/>',
  ),
  film: svg(
    '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>',
  ),
  stethoscope: svg(
    '<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
  ),
};

// <Field> — field.tsx 그대로(input-examples.mjs 의 것과 같다). id 는 레시피의 useId 자리, value 는 입력의 값(글자 수)이다.
// control(f) 는 칸의 HTML 을 돌려준다 — f 는 Field 의 문맥(useFieldControl 이 읽는 값). group 이면 라벨이 <label for> 대신 <span id> 가 된다.
function field({
  id,
  label,
  labelWeight = "medium",
  required = false,
  showRequiredIndicator = false,
  indicator,
  headerAction,
  description,
  descriptionIcon,
  errorMessage,
  invalid = false,
  disabled = false,
  readOnly = false,
  maxGraphemeCount,
  value = "",
  group = false,
  control,
}) {
  const controlId = `${id}-control`;
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const countId = `${id}-count`;
  const showError = invalid && errorMessage != null && errorMessage !== "";
  const showDescription = !showError && description != null && description !== "";
  const showCount = maxGraphemeCount != null;
  const describedBy = join(showError && errorId, showDescription && descriptionId, showCount && countId);
  const count = countGraphemes(value);

  const labelClass = `${FIELD_LABEL} ${FIELD_LABEL_WEIGHT[labelWeight]}`;
  const labelContent = [
    label != null ? esc(label) : "",
    showRequiredIndicator ? `<span aria-hidden="true" class="${FIELD_REQUIRED}"></span>` : "",
    !showRequiredIndicator && indicator != null ? `<span class="${FIELD_INDICATOR}">${esc(indicator)}</span>` : "",
  ].join("");
  const labelHtml =
    label == null
      ? ""
      : group
        ? `<span id="${labelId}" class="${labelClass}">${labelContent}</span>`
        : `<label id="${labelId}" for="${controlId}" class="${labelClass}">${labelContent}</label>`;
  const actionHtml = headerAction != null ? `<div data-slot="field-header-action" class="${FIELD_ACTION}">${headerAction}</div>` : "";
  const header = label != null || headerAction != null ? `<div data-slot="field-header" class="${FIELD_HEADER}">${labelHtml}${actionHtml}</div>` : "";

  const errorHtml = showError
    ? `<p id="${errorId}" aria-hidden="true" class="${FIELD_ERROR}" style="${P_FIX.error}">${svg(PATHS.circleAlert, { cls: FIELD_ERROR_ICON })}<span class="${FIELD_TEXT}">${esc(errorMessage)}</span></p>`
    : "";
  const descriptionHtml = showDescription
    ? `<p id="${descriptionId}" class="${FIELD_DESCRIPTION}" style="${P_FIX.description}">${
        descriptionIcon != null ? `<span aria-hidden="true" class="${FIELD_DESCRIPTION_ICON}">${descriptionIcon}</span>` : ""
      }<span class="${FIELD_TEXT}">${esc(description)}</span></p>`
    : "";
  const countColor = invalid ? "text-fg-critical" : count === 0 ? "text-fg-neutral-subtle" : "text-fg-neutral";
  const maxColor = invalid ? "text-fg-critical" : "text-fg-neutral-subtle";
  const countHtml = showCount
    ? `<p id="${countId}" class="${FIELD_COUNT}" style="${P_FIX.count}"><span class="${countColor}">${count}</span><span class="${maxColor}">/${maxGraphemeCount}</span></p>`
    : "";
  const footer =
    showError || showDescription || showCount ? `<div data-slot="field-footer" class="${FIELD_FOOTER}">${errorHtml}${descriptionHtml}${countHtml}</div>` : "";

  const f = { controlId, labelId, describedBy, invalid, required: required || showRequiredIndicator, disabled, readOnly, value };
  const root = attrs(['data-slot="field"', invalid && 'data-invalid="true"', disabled && 'data-disabled="true"', `class="${FIELD_ROOT}"`]);
  // 오류 글이 바뀌면 화면 밖 polite 자리가 한 번 읽는다 — 보이는 오류 글은 aria-hidden(설명으로는 그대로 읽힌다)
  return `<div ${root}>${header}${control(f)}${footer}<span class="sr-only" aria-live="polite">${showError ? esc(errorMessage) : ""}</span></div>`;
}

// useFieldControl — 칸이 Field 안에 있으면 Field 의 id · 막힘 · 오류 · 필수 · 설명을 받는다. 칸에 직접 준 값이 이긴다
function fieldControl(props, f) {
  if (!f) return props;
  return {
    id: props.id ?? f.controlId,
    disabled: props.disabled ?? (f.disabled || undefined),
    readOnly: props.readOnly ?? (f.readOnly || undefined),
    "aria-invalid": props["aria-invalid"] ?? (f.invalid || undefined),
    "aria-required": props["aria-required"] ?? (f.required || undefined),
    "aria-describedby": join(f.describedBy, props["aria-describedby"]),
  };
}

// <Select> — select.tsx 그대로. 트리거 + (열렸으면) 목록을 잇달아 돌려준다 — Field 안이면 Field 의 사이 8 이 트리거와 목록 사이가 된다
// (Field 밖이면 anchor() 로 감싼다). groups = [{ label?, items: [{ value, label, description?, icon?, disabled? }] }] — 레시피가 자식
// (SelectGroup · SelectItem)을 읽어 만드는 묶음 목록이다. value 는 고른 순서대로. uid 는 레시피의 useId 자리(목록 · 선택지 · 묶음 제목 id 의 앞말).
// overflow — 여럿 고른 글이 칸을 넘는가. 레시피는 숨긴 한 줄 글의 폭을 칸 폭과 견줘 정한다 — 정적 미리보기는 넉넉히 갈리는 폭에서 적어 준다.
// highlight = { value, keyboard } — 짚은 선택지(마우스 호버는 keyboard: false). list = false 면 열린 트리거만(목록은 그리지 않는다).
// force = "pressed" · "focused" · pressedItem — 미리보기용 강제 상태. pressBasis · itemPressBasis 는 레시피가 누르는 순간 재서 다는 --press-basis
function select({
  f,
  uid,
  id,
  size = "responsive",
  placeholder,
  prefixIcon,
  multiple = false,
  groups,
  value = [],
  formatValue,
  overflow = false,
  open = false,
  list = open,
  highlight,
  ariaLabel,
  disabled,
  readOnly,
  invalid,
  force,
  pressBasis,
  pressedItem,
  itemPressBasis,
}) {
  const sizes = SIZES[size];
  const control = fieldControl({ id, disabled, readOnly, "aria-invalid": invalid }, f);
  const isDisabled = !!control.disabled;
  const isReadOnly = !!control.readOnly;
  const isInvalid = control["aria-invalid"] === true || control["aria-invalid"] === "true";
  const interactive = !isDisabled && !isReadOnly;
  const items = groups.flatMap((g) => g.items);
  const indexOf = new Map(items.map((item, i) => [item.value, i]));
  const optionId = (v) => `${uid}-option${indexOf.get(v)}`;
  const contentId = `${uid}-content`;
  const showList = open && list;

  // 트리거 글 · 아이콘 — 하나면 그 글, 여럿이면 고른 순서대로 ", " 로 잇고 넘치면 "첫 값 외 N개"(formatValue 를 주면 그 글)
  const selectedItems = value.flatMap((v) => (indexOf.has(v) ? [items[indexOf.get(v)]] : []));
  const joined = selectedItems.map((i) => i.label).join(", ");
  const measure = multiple && !formatValue && selectedItems.length > 1;
  let text;
  if (selectedItems.length > 0) {
    if (formatValue) text = formatValue(selectedItems.map(({ value: v, label }) => ({ value: v, label })));
    else if (selectedItems.length === 1) text = selectedItems[0].label;
    else text = overflow ? `${selectedItems[0].label} 외 ${selectedItems.length - 1}개` : joined;
  }
  const hasValue = text !== undefined;
  const icon = selectedItems.length === 1 && selectedItems[0].icon != null ? selectedItems[0].icon : prefixIcon;
  const iconColor = isDisabled ? ICON_COLOR.disabled : ICON_COLOR.enabled;
  const valueColor = isDisabled ? VALUE_COLOR.disabled : hasValue ? VALUE_COLOR.value : VALUE_COLOR.placeholder;

  const state = isDisabled ? "disabled" : isReadOnly ? "readonly" : "enabled";
  let triggerClass = merge(
    `${TRIGGER_BASE} ${inputButtonVariants({ size })} ${inputButtonSurfaceVariants({ state, hover: "self", invalid: isInvalid })}`,
  );
  let contentClass = merge(interactive ? `${TRIGGER_CONTENT} ${TRIGGER_CONTENT_PRESS}` : TRIGGER_CONTENT);
  if (force === "pressed") {
    triggerClass = pressed(triggerClass, "active");
    contentClass = pressed(contentClass, "group-active/select-trigger");
  }
  if (force === "focused") triggerClass = pressed(triggerClass, "focus-visible");

  // 속성 차례는 Radix Slot 이 합친 차례(Popover.Trigger 의 것 → 트리거의 것)다
  const trigger = attrs([
    'type="button"',
    'aria-haspopup="listbox"',
    `aria-expanded="${open}"`,
    showList && `aria-controls="${contentId}"`,
    'role="combobox"',
    control.id && `id="${control.id}"`,
    isInvalid && 'aria-invalid="true"',
    control["aria-required"] && 'aria-required="true"',
    isReadOnly && 'aria-readonly="true"',
    control["aria-describedby"] && `aria-describedby="${control["aria-describedby"]}"`,
    ariaLabel && `aria-label="${esc(ariaLabel)}"`,
    isDisabled && "disabled",
    'data-slot="select-trigger"',
    `data-size="${size}"`,
    isInvalid && 'data-invalid="true"',
    isReadOnly && 'data-readonly="true"',
    !hasValue && 'data-placeholder=""',
    `class="${triggerClass}"`,
    pressBasis != null && `style="--press-basis:${pressBasis}"`,
  ]);
  const iconHtml =
    icon != null ? `<span aria-hidden="true" data-slot="select-prefix-icon" class="${merge(`${PREFIX_ICON} ${iconColor}`)}">${icon}</span>` : "";
  const measureHtml = measure ? `<span aria-hidden="true" class="${MEASURE}">${esc(joined)}</span>` : "";
  const valueHtml = `<span data-slot="select-value" class="${merge(`${VALUE_BASE} ${valueColor}`)}">${esc(hasValue ? text : (placeholder ?? ""))}${measureHtml}</span>`;
  const chevron = svg(PATHS.chevronDown, {
    cls: merge(`${CHEVRON_BASE} ${iconColor} ${open ? CHEVRON_OPEN : CHEVRON_CLOSED}`),
    slot: "select-chevron",
  });
  const triggerHtml = `<button ${trigger}><span data-slot="select-trigger-content" class="${contentClass}">${iconHtml}${valueHtml}${chevron}</span></button>`;
  if (!showList) return triggerHtml;

  // 목록 — 이름은 Field 의 라벨(aria-labelledby), Field 밖이면 aria-label
  const itemHtml = (item) => {
    const selected = value.includes(item.value);
    const itemDisabled = !!item.disabled;
    const on = !itemDisabled && highlight?.value === item.value;
    const press = !itemDisabled && pressedItem === item.value;
    let pill = merge([PILL, on ? PILL_ON : PILL_OFF, !itemDisabled && PILL_PRESS].filter(Boolean).join(" "));
    let content = merge([ITEM_CONTENT, sizes.itemContent, !itemDisabled && ITEM_CONTENT_PRESS].filter(Boolean).join(" "));
    if (press) {
      pill = pressed(pill, "group-active/select-item");
      content = pressed(content, "group-active/select-item");
    }
    const labelColor = itemDisabled ? ITEM_COLOR.disabled : ITEM_COLOR.label;
    const option = attrs([
      'role="option"',
      `id="${optionId(item.value)}"`,
      `aria-selected="${selected}"`,
      itemDisabled && 'aria-disabled="true"',
      'data-slot="select-item"',
      on && 'data-highlighted="true"',
      on && highlight.keyboard && 'data-keyboard="true"',
      selected && 'data-selected="true"',
      itemDisabled && 'data-disabled="true"',
      `class="${merge([ITEM, sizes.item, itemDisabled && ITEM_DISABLED].filter(Boolean).join(" "))}"`,
      press && itemPressBasis != null && `style="--press-basis:${itemPressBasis}"`,
    ]);
    const itemIcon =
      item.icon != null ? `<span aria-hidden="true" class="${merge(`${ITEM_ICON} ${sizes.itemIcon} ${labelColor}`)}">${item.icon}</span>` : "";
    const description = item.description
      ? `<span class="${merge(`${sizes.itemDescription} ${itemDisabled ? ITEM_COLOR.disabled : ITEM_COLOR.description}`)}">${esc(item.description)}</span>`
      : "";
    const body = `<span class="${ITEM_BODY}"><span class="${merge(`${ITEM_LABEL} ${sizes.itemLabel} ${labelColor}`)}">${esc(item.label)}</span>${description}</span>`;
    const check = selected ? svg(PATHS.check, { strokeWidth: 2.5, cls: merge(`${INDICATOR} ${sizes.indicator} ${labelColor}`) }) : "";
    return `<div ${option}><span aria-hidden="true" class="${pill}"></span><span class="${content}">${itemIcon}${body}${check}</span></div>`;
  };
  const groupsHtml = groups
    .filter((g) => g.items.length > 0)
    .map((g, i) => {
      const labelId = `${uid}-group${i}`;
      const label = g.label
        ? `<div role="presentation" id="${labelId}" data-slot="select-group-label" class="${merge(`${GROUP_LABEL} ${sizes.groupLabel}`)}">${esc(g.label)}</div>`
        : "";
      const group = attrs(['role="group"', 'data-select-group=""', 'data-slot="select-group"', g.label && `aria-labelledby="${labelId}"`, `class="${GROUP}"`]);
      return `<div ${group}>${label}${g.items.map(itemHtml).join("")}</div>`;
    })
    .join("");
  const labelledBy = ariaLabel ? undefined : f?.labelId;
  const listbox = attrs([
    'role="listbox"',
    `id="${contentId}"`,
    'tabindex="-1"',
    multiple && 'aria-multiselectable="true"',
    highlight && indexOf.has(highlight.value) && `aria-activedescendant="${optionId(highlight.value)}"`,
    ariaLabel && `aria-label="${esc(ariaLabel)}"`,
    labelledBy && `aria-labelledby="${labelledBy}"`,
    'data-slot="select-content"',
    `data-size="${size}"`,
    'data-state="open"',
    `class="${CONTENT}"`,
    'style="--radix-popover-trigger-width:100%;"',
  ]);
  return `${triggerHtml}<div ${listbox}><div data-slot="select-scroll" class="${SCROLL}">${groupsHtml}</div></div>`;
}

// Field 밖의 Select — 트리거와 목록 사이 8(레시피의 sideOffset)을 세로 틀로 잡는다
const anchor = (html) => `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2); min-width:0;">${html}</div>`;

// 칸은 보통 기본 레이어(흰 면) 위에 놓인다. 사이트 미리보기 칸의 바탕(bg-page = bg-layer-basement)은 비활성 · 읽기 전용의 바탕(bg-disabled)과
// 같은 색이라 그 위에 바로 그리면 막힌 칸이 보이지 않는다. isolation 은 목록의 z-(--z-floating) 을 이 틀 안에 가둔다
const SURFACE =
  "isolation:isolate; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-x6);";
const surface = (html) => `<div style="${SURFACE}">${html}</div>`;
// 폰 화면처럼 — 폭 360 · 좌우 24(global-gutter). 열린 목록을 폰 폭으로 보인다(반응형이라 1280 이상 창에서는 medium 으로 그린다)
const SCREEN =
  "isolation:isolate; max-width:360px; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-global-gutter);";
const screen = (html) => `<div style="${SCREEN}">${html}</div>`;
// 폼 — Field 사이 24(field.yaml form)
const stack = (items) => `<div style="display:flex; flex-direction:column; gap:var(--spacing-x6);">${items.join("")}</div>`;
// 나란히 — 칸 사이 16 · 줄 사이 24, 좁으면 한 줄에 하나
const grid = (items, min = 220) =>
  `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(${min}px, 1fr)); gap:var(--spacing-x6) var(--spacing-x4); align-items:start;">${items.join("")}</div>`;
const CAPTION =
  "font-size:var(--text-t2); line-height:var(--text-t2--line-height); font-weight:400; color:var(--color-fg-neutral-subtle);";
// 크기 · 상태 이름처럼 코드로 쓰는 이름표
const CODE = `${CAPTION} font-family:ui-monospace, SFMono-Regular, Menlo, monospace;`;
// 아래 이름표
const labeled = (html, caption, style = CODE) =>
  `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2); min-width:0;">${html}<span style="${style}">${caption}</span></div>`;

// ── 선택지 ────────────────────────────────────────────────────────────────

const CURRENCIES = [
  { value: "KRW", label: "원", description: "KRW" },
  { value: "USD", label: "미국 달러", description: "USD" },
  { value: "JPY", label: "일본 엔", description: "JPY" },
  { value: "EUR", label: "유로", description: "EUR" },
  { value: "CNY", label: "중국 위안", description: "CNY" },
];

// 결제 수단 — "없음" 은 맨 앞 따로 묶음. 카드 · 계좌는 묶음 제목으로 가른다
const PAY_GROUPS = [
  { items: [{ value: "none", label: "결제 수단 없음", icon: ICONS.circleSlash }] },
  {
    label: "카드",
    items: [
      { value: "hyundai-m", label: "현대카드 신용카드", icon: ICONS.creditCard },
      { value: "shinhan-deep", label: "신한카드 체크카드", icon: ICONS.creditCard },
    ],
  },
  {
    label: "계좌 · 현금",
    items: [
      { value: "kb", label: "국민 주계좌", description: "123-45-6789", icon: ICONS.landmark },
      { value: "cash", label: "현금", icon: ICONS.banknote },
    ],
  },
];

// 아이콘을 뺀 묶음 — 크기 비교는 글 · 체크 · 알약만 본다
const plain = (groups) => groups.map((g) => ({ ...g, items: g.items.map(({ icon, ...item }) => item) }));

// 결제 수단 한 묶음 — 선택지 상태 · 앞 아이콘
const PAY_FLAT = [
  { value: "cash", label: "현금", icon: ICONS.banknote },
  { value: "kb-check", label: "국민 체크카드", icon: ICONS.creditCard },
  { value: "hyundai-m", label: "현대카드 신용카드", icon: ICONS.creditCard },
  { value: "toss", label: "토스뱅크 통장", icon: ICONS.landmark },
  { value: "kakao", label: "카카오뱅크 통장", icon: ICONS.landmark },
];

const DAYS = ["월", "화", "수", "목", "금", "토", "일"].map((d) => ({ value: d, label: `${d}요일` }));

const POLICIES = [
  { value: "annual", label: "연차", description: "남은 연차 11일" },
  { value: "half-am", label: "반차(오전)" },
  { value: "half-pm", label: "반차(오후)" },
  { value: "family", label: "경조 휴가" },
  { value: "sick", label: "병가" },
];

const DEPARTMENTS = [
  { value: "design", label: "디자인팀" },
  { value: "dev", label: "개발팀" },
  { value: "hr", label: "인사팀" },
  { value: "finance", label: "재무팀" },
  { value: "sales", label: "영업팀" },
];

// 카테고리 — 여럿 고르기
const CATEGORIES = [
  { value: "food", label: "식비", icon: ICONS.utensils },
  { value: "transport", label: "교통", icon: ICONS.bus },
  { value: "shopping", label: "쇼핑", icon: ICONS.shoppingBag },
  { value: "culture", label: "문화", icon: ICONS.film },
  { value: "health", label: "의료", icon: ICONS.stethoscope },
];

// ── 예제 ──────────────────────────────────────────────────────────────────

export const selectExamples = [
  {
    title: "기본",
    description:
      "레시피(Select · SelectGroup · SelectItem)를 Field 안에 둔다 — 라벨(<label for>)이 트리거(<button role=\"combobox\">)의 이름이 되고, 고른 글은 트리거의 값으로 읽힌다. 선택지는 글(label)을 속성으로 받는다 — 목록이 닫혀 있어도 트리거 · 글자로 찾기(typeahead)가 그 글을 쓴다. 한 줄 설명(description)은 목록에만 보인다. 트리거는 Input Button 과 같은 상자다 — 투명 바탕에 안쪽 1px stroke-neutral-weak, 기본 크기가 responsive 라 1280 미만은 52 · 이상은 40. 목록은 트리거 폭 그대로 8 아래에 붙는다(모서리 20 · bg-layer-floating · shadow-s3 · 위아래 8). 고른 선택지는 오른쪽 체크만이고 바탕 · 굵기는 그대로다. 미리보기는 \"원\" 을 고른 채 열고 마우스를 \"미국 달러\" 에 올린 모습이다 — 짚은 선택지는 좌우 8 들어온 알약(모서리 12 · bg-layer-floating-pressed)이다. 실제 목록은 떠서 아래를 덮는다.",
    jsx: `import { Field } from "@/components/ui/field"
import { Select, SelectItem } from "@/components/ui/select"

<Field label="통화">
  <Select placeholder="통화 선택" value={currency} onValueChange={setCurrency}>
    <SelectItem value="KRW" label="원" description="KRW" />
    <SelectItem value="USD" label="미국 달러" description="USD" />
    <SelectItem value="JPY" label="일본 엔" description="JPY" />
    <SelectItem value="EUR" label="유로" description="EUR" />
    <SelectItem value="CNY" label="중국 위안" description="CNY" />
  </Select>
</Field>`,
    render: () =>
      screen(
        field({
          id: "select-ex-basic",
          label: "통화",
          control: (f) =>
            select({
              f,
              uid: "select-ex-basic",
              placeholder: "통화 선택",
              groups: [{ items: CURRENCIES }],
              value: ["KRW"],
              open: true,
              highlight: { value: "USD", keyboard: false },
            }),
        }),
      ),
  },

  {
    title: "묶음 · 아이콘 · \"없음\"",
    description:
      "성격이 다른 선택지는 묶음(SelectGroup)으로 나눈다 — 제목(label)은 없어도 되고(large 14 · 500 · medium 13 · 400, fg-neutral-subtle), 묶음이 둘 이상이면 사이에 1px stroke-neutral-subtle 선(좌우 16 들임)을 저절로 그린다(묶음 사이 8 + 1 + 8). 선택지 사이에는 선이 없다. \"없음\" 이 답이 될 수 있는 칸은 \"{칸 이름} 없음\" 선택지를 맨 앞 따로 묶음에 둔다 — 고르면 값을 고른 것으로 친다(Select 에는 지우기 버튼이 없다). 선택지 앞 아이콘(22 · 18, fg-neutral)은 묶음 안에서 모두 두거나 모두 빼고, 하나를 고르면 그 아이콘이 트리거의 앞 아이콘이 된다. 미리보기는 \"현대카드 신용카드\" 을 고른 채 키(↓)로 연 모습이다 — 키로 열면 고른 선택지를 짚는다(마우스 호버와 같은 알약, 링은 없다).",
    jsx: `import { Banknote, CircleSlash, CreditCard, Landmark } from "lucide-react"
import { Select, SelectGroup, SelectItem } from "@/components/ui/select"

<Field label="결제 수단">
  <Select placeholder="결제 수단 선택" value={asset} onValueChange={setAsset}>
    <SelectGroup>
      <SelectItem value="none" label="결제 수단 없음" prefixIcon={<CircleSlash />} />
    </SelectGroup>
    <SelectGroup label="카드">
      <SelectItem value="hyundai-m" label="현대카드 신용카드" prefixIcon={<CreditCard />} />
      <SelectItem value="shinhan-deep" label="신한카드 체크카드" prefixIcon={<CreditCard />} />
    </SelectGroup>
    <SelectGroup label="계좌 · 현금">
      <SelectItem value="kb" label="국민 주계좌" description="123-45-6789" prefixIcon={<Landmark />} />
      <SelectItem value="cash" label="현금" prefixIcon={<Banknote />} />
    </SelectGroup>
  </Select>
</Field>`,
    render: () =>
      screen(
        field({
          id: "select-ex-group",
          label: "결제 수단",
          control: (f) =>
            select({
              f,
              uid: "select-ex-group",
              placeholder: "결제 수단 선택",
              groups: PAY_GROUPS,
              value: ["hyundai-m"],
              open: true,
              highlight: { value: "hyundai-m", keyboard: true },
            }),
        }),
      ),
  },

  {
    title: "여럿 고르기",
    description:
      "multiple 을 주면 목록(aria-multiselectable)이 열린 채로 남아 이어서 고르고, 고른 선택지를 다시 누르면 풀린다 — 고른 것을 되돌리는 선택지가 따로 필요 없다. value 는 고른 순서대로 쌓인다. 트리거 글은 formatValue 로 바꾼다 — 기본은 \"월요일, 수요일\" · 넘치면 \"월요일 외 2개\". 몇 개까지 고를 수 있는지 같은 제약은 Field 설명에 쓴다. 미리보기는 월 · 수를 고른 모습이다 — 실제 목록은 설명 글을 덮고 뜬다.",
    jsx: `<Field label="반복 요일" description="고른 요일마다 거래를 만들어요.">
  <Select multiple placeholder="요일 선택" value={days} onValueChange={setDays}>
    {["월", "화", "수", "목", "금", "토", "일"].map((d) => (
      <SelectItem key={d} value={d} label={\`\${d}요일\`} />
    ))}
  </Select>
</Field>`,
    render: () =>
      screen(
        field({
          id: "select-ex-multiple",
          label: "반복 요일",
          description: "고른 요일마다 거래를 만들어요.",
          control: (f) =>
            select({
              f,
              uid: "select-ex-multiple",
              multiple: true,
              placeholder: "요일 선택",
              groups: [{ items: DAYS }],
              value: ["월", "수"],
              open: true,
            }),
        }),
      ),
  },

  {
    title: "상태",
    description:
      "상태는 Field 에 주면 트리거가 받는다. 오류(invalid)는 안쪽 2px stroke-critical-solid(눌러도 그대로)와 칸 아래 오류 글로 알린다. 비활성(disabled)은 바탕 bg-disabled · 글자 · 아이콘 fg-disabled 이고 포커스 · 열기가 안 된다. 읽기 전용(readOnly)은 바탕 bg-disabled 에 값은 진한 글자 그대로다 — 포커스는 되고(aria-readonly) 눌러도 · 키로도 열리지 않고 글자 키로 값이 바뀌지도 않는다. 흐리게(불투명도) 그리지 않는다.",
    jsx: `<Field label="휴가 정책" invalid errorMessage="휴가 정책을 골라주세요.">
  <Select placeholder="휴가 정책 선택">…</Select>
</Field>
<Field label="통화" disabled>
  <Select defaultValue="KRW">…</Select>
</Field>
<Field label="부서" readOnly>
  <Select defaultValue="design">…</Select>
</Field>`,
    render: () =>
      screen(
        stack([
          field({
            id: "select-ex-state-invalid",
            label: "휴가 정책",
            invalid: true,
            errorMessage: "휴가 정책을 골라주세요.",
            control: (f) => select({ f, uid: "select-ex-state-invalid", placeholder: "휴가 정책 선택", groups: [{ items: POLICIES }] }),
          }),
          field({
            id: "select-ex-state-disabled",
            label: "통화",
            disabled: true,
            control: (f) => select({ f, uid: "select-ex-state-disabled", groups: [{ items: CURRENCIES }], value: ["KRW"] }),
          }),
          field({
            id: "select-ex-state-readonly",
            label: "부서",
            readOnly: true,
            control: (f) => select({ f, uid: "select-ex-state-readonly", groups: [{ items: DEPARTMENTS }], value: ["design"] }),
          }),
        ]),
      ),
  },

  {
    title: "크기 — large · medium · responsive",
    description:
      "large(트리거 52 · 선택지 46)는 폰 · 앱에서, medium(트리거 40 · 선택지 39)은 1280 이상 데스크톱 웹(마우스)에서만 쓴다. 웹의 기본은 responsive 다 — 1280 미만은 large, 이상은 medium(SEED lg). 트리거와 목록은 같은 크기를 쓴다 — 트리거는 모서리 12 · 8 · 좌우 여백 16 · 14 · 셰브론 20 · 16, 글자는 둘 다 16 · 14, 목록은 선택지 아이콘 22 · 18 · 체크 14 · 12 · 묶음 제목 14 · 500 · 13 · 400 · 한 줄 설명이 붙은 선택지 66 · 57. 목록의 모서리(20) · 위아래(8) · 선택지 좌우 여백(16) · 알약의 들임(8)과 모서리(12)는 크기와 관계없다. 앱은 늘 large 이고, 한 폼 안에서 크기를 섞지 않는다. 미리보기는 \"현대카드 신용카드\" 을 고른 채 마우스를 \"신한카드 체크카드\" 에 올린 모습이다. 창 폭을 1280 앞뒤로 바꾸면 responsive 칸이 바뀐다.",
    jsx: `<Field label="결제 수단">
  <Select size="large" defaultValue="hyundai-m">…</Select>   {/* 트리거 52 · 선택지 46 — 폰 · 앱 */}
</Field>
<Field label="결제 수단">
  <Select size="medium" defaultValue="hyundai-m">…</Select>  {/* 트리거 40 · 선택지 39 — 1280 이상 데스크톱 웹 */}
</Field>
<Field label="결제 수단">
  <Select defaultValue="hyundai-m">…</Select>                {/* responsive — 웹 기본, 1280 에서 바뀐다 */}
</Field>`,
    render: () => {
      const col = (size, caption) =>
        labeled(
          field({
            id: `select-ex-size-${size}`,
            label: "결제 수단",
            control: (f) =>
              select({
                f,
                uid: `select-ex-size-${size}`,
                size,
                groups: plain(PAY_GROUPS),
                value: ["hyundai-m"],
                open: size !== "responsive",
                highlight: { value: "shinhan-deep", keyboard: false },
              }),
          }),
          caption,
        );
      return surface(
        grid([
          col("large", "large — 트리거 52 · 선택지 46 · 체크 14"),
          col("medium", "medium — 트리거 40 · 선택지 39 · 체크 12"),
          col("responsive", "responsive — 기본, 1280 에서 바뀐다"),
        ]),
      );
    },
  },

  {
    title: "트리거 상태",
    description:
      "트리거의 상태는 Input Button 과 같다. pressed 는 바탕 bg-layer-default-pressed 에 값 · 아이콘만 2px 거리로 준다 — 테두리 · 바탕은 그대로이고, 마우스 호버는 같은 바탕에 축소가 없다. focused 는 키보드 포커스에만 바깥 링 2px · 띄움 2px stroke-focus-ring 이다 — 트리거는 버튼이라 마우스 · 터치로 눌러서는 링이 없다. open 은 셰브론이 180° 돈다(열 때 150ms · 닫을 때 100ms — open 칸은 목록을 빼고 트리거만 그렸다). invalid 는 안쪽 2px stroke-critical-solid, disabled · readonly 는 바탕 bg-disabled 다(disabled 는 글자 · 아이콘도 fg-disabled). 정적 미리보기라 pressed · focused 는 active: · group-active: · focus-visible: 클래스에서 접두어만 뗀 사본을 덧붙여 그렸다 — 축소 기준(--press-basis)은 레시피가 누르는 순간 max(높이, 폭 ÷ 4, 24) 로 재고, 여기서는 높이 52 로 적었다.",
    jsx: `// 누름 · 포커스 · 열림은 고르는 prop 이 없다 — 누르는 동안 · 키보드 포커스 · 목록이 열린 동안 그렇게 그린다
<Select size="large" aria-label="결제 수단" placeholder="결제 수단 선택">…</Select>               // enabled
<Select size="large" aria-label="결제 수단" defaultValue="hyundai-m">…</Select>                  // pressed · focused · open
<Select size="large" aria-label="결제 수단" placeholder="결제 수단 선택" aria-invalid>…</Select>  // invalid — Field 안이면 Field 의 invalid
<Select size="large" aria-label="결제 수단" defaultValue="hyundai-m" disabled>…</Select>         // disabled
<Select size="large" aria-label="결제 수단" defaultValue="hyundai-m" readOnly>…</Select>         // readonly — 포커스는 되고 열리지 않는다`,
    render: () => {
      const groups = plain([{ items: PAY_FLAT }]);
      const states = [
        { name: "enabled" },
        { name: "pressed", value: ["hyundai-m"], force: "pressed", pressBasis: 52 },
        { name: "focused", value: ["hyundai-m"], force: "focused" },
        { name: "open", value: ["hyundai-m"], open: true, list: false },
        { name: "invalid", invalid: true },
        { name: "disabled", value: ["hyundai-m"], disabled: true },
        { name: "readonly", value: ["hyundai-m"], readOnly: true },
      ];
      return surface(
        grid(
          states.map(({ name, ...state }) =>
            labeled(
              select({
                uid: `select-ex-trigger-${name}`,
                size: "large",
                ariaLabel: "결제 수단",
                placeholder: "결제 수단 선택",
                groups,
                ...state,
              }),
              name,
            ),
          ),
          160,
        ),
      );
    },
  },

  {
    title: "선택지 상태",
    description:
      "선택지는 enabled(바탕 없음) · pressed · selected · disabled 다. 누르면 좌우 8 들어온 알약(모서리 12 · bg-layer-floating-pressed)에 콘텐츠가 2px 거리로 준다. 마우스 호버 · 키보드로 옮긴 선택지(highlighted — data-highlighted · 목록의 aria-activedescendant)는 같은 알약이고 축소가 없다 — 링은 더하지 않는다(SEED, 알약과 목록 바탕의 대비는 1.06 · 1.13). 터치는 짚지 않는다. 고른 선택지는 오른쪽 체크(large 14 · medium 12 · 선 2.5 · fg-neutral)만 그리고, 막힌 선택지는 글 · 설명 · 아이콘 · 체크가 fg-disabled 이고 알약이 생기지 않는다(키보드로도 건너뛴다). 미리보기는 상태마다 한 줄씩 그렸다 — 실제로 짚은 선택지는 하나다. pressed 는 group-active 클래스에서 접두어를 뗀 사본이고, 축소 기준은 줄 높이 46 으로 적었다.",
    jsx: `<Select size="large" aria-label="결제 수단" defaultValue="hyundai-m">
  <SelectItem value="cash" label="현금" />                    {/* enabled */}
  <SelectItem value="kb-check" label="국민 체크카드" />         {/* pressed — 누르는 동안 알약 + 콘텐츠 2px 축소 */}
  <SelectItem value="hyundai-m" label="현대카드 신용카드" />           {/* selected — 오른쪽 체크 */}
  <SelectItem value="toss" label="토스뱅크 통장" />             {/* highlighted — 키보드 위치 · 마우스 호버, 같은 알약 · 축소 없음 */}
  <SelectItem value="kakao" label="카카오뱅크 통장" disabled /> {/* disabled */}
</Select>`,
    render: () => {
      const names = ["enabled", "pressed", "selected", "highlighted", "disabled"];
      const items = PAY_FLAT.map(({ icon, ...item }) => ({ ...item, disabled: item.value === "kakao" || undefined }));
      // 이름표 줄 — 트리거 52 + 사이 8 + 목록 위 8 아래에서 선택지 높이(large 46)마다
      const captions = `<div aria-hidden="true" style="display:flex; flex-direction:column; flex-shrink:0; padding-top:68px;">${names
        .map((n) => `<span style="${CODE} display:flex; align-items:center; height:46px; white-space:nowrap;">${n}</span>`)
        .join("")}</div>`;
      const sel = select({
        uid: "select-ex-item",
        size: "large",
        ariaLabel: "결제 수단",
        groups: [{ items }],
        value: ["hyundai-m"],
        open: true,
        highlight: { value: "toss", keyboard: true },
        pressedItem: "kb-check",
        itemPressBasis: 46,
      });
      return screen(
        `<div style="display:flex; align-items:flex-start; gap:var(--spacing-x3);"><div style="flex:1; min-width:0;">${anchor(sel)}</div>${captions}</div>`,
      );
    },
  },

  {
    title: "앞 아이콘",
    description:
      "트리거의 앞 아이콘(prefixIcon — 20 · 16 · fg-neutral-muted)은 어떤 값을 고르는 자리인지 함께 알린다. 그리는 아이콘은 고른 개수로 정한다(SEED) — 하나를 골랐고 그 선택지에 아이콘이 있으면 그 아이콘이 트리거의 아이콘을 덮고, 고르기 전이거나 둘 이상 골랐으면(여럿 고르기) 트리거의 아이콘이다. 그릴 아이콘이 없으면 아이콘 없이 그린다. 아이콘만으로 뜻을 알리지 않는다 — 라벨이 함께 알린다.",
    jsx: `import { Banknote, Bus, CreditCard, Landmark, Tag, Utensils, Wallet } from "lucide-react"

// 고르기 전 — 트리거의 아이콘
<Field label="결제 수단">
  <Select prefixIcon={<Wallet />} placeholder="결제 수단 선택">
    <SelectItem value="cash" label="현금" prefixIcon={<Banknote />} />
    <SelectItem value="hyundai-m" label="현대카드 신용카드" prefixIcon={<CreditCard />} />
    <SelectItem value="toss" label="토스뱅크 통장" prefixIcon={<Landmark />} />
  </Select>
</Field>

// 하나를 골랐다 — 그 선택지의 아이콘이 덮는다
<Select prefixIcon={<Wallet />} defaultValue="hyundai-m">…</Select>

// 둘 이상 골랐다 — 트리거의 아이콘
<Field label="카테고리">
  <Select multiple prefixIcon={<Tag />} defaultValue={["food", "transport"]}>
    <SelectItem value="food" label="식비" prefixIcon={<Utensils />} />
    <SelectItem value="transport" label="교통" prefixIcon={<Bus />} />
    …
  </Select>
</Field>`,
    render: () => {
      const pay = [{ items: PAY_FLAT }];
      return surface(
        grid(
          [
            labeled(
              field({
                id: "select-ex-icon-none",
                label: "결제 수단",
                control: (f) =>
                  select({ f, uid: "select-ex-icon-none", prefixIcon: ICONS.wallet, placeholder: "결제 수단 선택", groups: pay }),
              }),
              "고르기 전 — 트리거의 아이콘(wallet)",
              CAPTION,
            ),
            labeled(
              field({
                id: "select-ex-icon-one",
                label: "결제 수단",
                control: (f) =>
                  select({ f, uid: "select-ex-icon-one", prefixIcon: ICONS.wallet, placeholder: "결제 수단 선택", groups: pay, value: ["hyundai-m"] }),
              }),
              "하나를 골랐다 — 그 선택지의 아이콘(credit-card)",
              CAPTION,
            ),
            labeled(
              field({
                id: "select-ex-icon-many",
                label: "카테고리",
                control: (f) =>
                  select({
                    f,
                    uid: "select-ex-icon-many",
                    multiple: true,
                    prefixIcon: ICONS.tag,
                    placeholder: "카테고리 선택",
                    groups: [{ items: CATEGORIES }],
                    value: ["food", "transport"],
                  }),
              }),
              "둘 이상 골랐다 — 트리거의 아이콘(tag)",
              CAPTION,
            ),
          ],
          240,
        ),
      );
    },
  },

  {
    title: "여럿 고른 값 — 쉼표 · \"외 N개\"",
    description:
      "트리거는 한 줄이다. 다 보이면 고른 순서대로 쉼표로 잇고, 칸 폭을 넘으면 가장 먼저 고른 값을 남기고 나머지 개수를 붙인다(\"식비 외 2개\") — \"외\" 는 앞의 값을 뺀 개수라 \"식비 등 2개\" 라고 쓰면 틀린다. 레시피는 값 안에 숨긴 한 줄 글(aria-hidden)의 폭을 칸 폭과 견줘 고른다 — 정적 미리보기는 폭 160 · large 칸에서 넉넉히 갈리는 값으로 적었다. 값이 서로 동등해 하나를 보여 주는 것이 도움이 안 되면 formatValue 로 전체 개수를 쓴다(\"3개 고름\"). 고른 값이 조건으로 묶이는 자리(필터)는 쉼표 대신 접속사로 관계를 드러낸다(\"식비 또는 교통\").",
    jsx: `<Field label="카테고리">
  <Select multiple size="large" placeholder="카테고리 선택" value={categories} onValueChange={setCategories}>
    <SelectItem value="food" label="식비" />
    <SelectItem value="transport" label="교통" />
    <SelectItem value="shopping" label="쇼핑" />
    <SelectItem value="culture" label="문화" />
    <SelectItem value="health" label="의료" />
  </Select>
</Field>
// ["food", "transport"]             → "식비, 교통"
// ["food", "transport", "shopping"] → 칸 폭을 넘으면 "식비 외 2개"

// 값이 서로 동등하면 전체 개수로
<Select multiple formatValue={(selected) => \`\${selected.length}개 고름\`} …>…</Select>`,
    render: () => {
      const items = CATEGORIES.map(({ icon, ...item }) => item);
      const cell = (key, caption, opts) =>
        labeled(
          `<div style="width:160px; max-width:100%;">${field({
            id: `select-ex-summary-${key}`,
            label: "카테고리",
            control: (f) =>
              select({ f, uid: `select-ex-summary-${key}`, multiple: true, size: "large", placeholder: "카테고리 선택", groups: [{ items }], ...opts }),
          })}</div>`,
          caption,
          CAPTION,
        );
      return surface(
        grid(
          [
            cell("two", "둘 — 다 보이면 쉼표", { value: ["food", "transport"] }),
            cell("three", "셋 — 넘치면 \"첫 값 외 N개\"", { value: ["food", "transport", "shopping"], overflow: true }),
            cell("count", "formatValue — 전체 개수", {
              value: ["food", "transport", "shopping"],
              formatValue: (selected) => `${selected.length}개 고름`,
            }),
          ],
          170,
        ),
      );
    },
  },
];
