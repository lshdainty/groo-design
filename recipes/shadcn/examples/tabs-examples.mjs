/*
 * shadcn Tabs 예제 — docs site components/tabs.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 셋(Line — Fill · Line — Hug · 알림 점 · 두 단 — Chip Tabs)은 차례 · 제목 · 코드가
 * specs/components/tabs.md 의 "코드" 절과 같고, 뒤의 다섯(폭 · 크기 · 상태 · Chip Tabs 변형 × 크기 · 밀어 넘기기와 주소)은 md 의
 * Properties · Behavior 를 코드로 더 보인다.
 *
 * LIST_* · TRIGGER_* · CHIP_TABS_LIST 는 recipes/shadcn/components/ui/tabs.tsx 의 cva(tabsListVariants · tabsTriggerVariants · chipTabsListVariants)와,
 * INDICATOR · NOTIFICATION · CHIP_TABS_NOTIFICATION · CONTENT · SWIPE_AREA 는 그 파일의 상수(TABS_INDICATOR · TABS_NOTIFICATION · CHIP_TABS_NOTIFICATION ·
 * TABS_CONTENT · TABS_SWIPE_AREA)와, LABEL · SR_ONLY 는 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다.
 * Chip Tabs 의 칩 CHIP_* 는 chip.tsx 의 cva(chipVariants)와 같다 — chip-examples.mjs 의 것과도 같다(chip.tsx 를 고치면 셋을 함께).
 * 규칙은 specs/components/tabs.md, 수치 원본은 specs/components/tabs.yaml · chip-tabs.yaml(칩 하나는 chip.yaml).
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 묶음 <div data-slot="tabs">(Radix Tabs.Root) > 목록 <div role="tablist" data-slot="tabs-list"> >
 * 막대 <span data-slot="tabs-indicator">(첫 자식 — 탭이 그 위에 그려져 포커스 링이 가리지 않는다) + 탭 <button role="tab" data-slot="tabs-trigger"> >
 * 글 <span data-slot="tabs-label">(+ 알림 점 <span data-slot="tabs-notification">) + 화면 밖 "새 소식", 그리고 내용 칸 <div role="tabpanel" data-slot="tabs-content">.
 * Chip Tabs 는 목록 <div role="tablist" data-slot="chip-tabs-list"> > 탭 <button role="tab" data-slot="chip-tabs-trigger">(고른 탭에 data-selected —
 * Chip 의 고른 모습)다. 목록의 양 끝은 늘 흐린다(Scroll Fog row 좌우 20 — 레시피의 useScrollFog 가 그릴 때 토큰 --gradient-fade-mask 에
 * 방향을 붙여 목록의 style(mask-*) · data-fog-axis="x" 로 넣는다. 정적 HTML 은 같은 일을 빌드 때 DESIGN.md 의 토큰 값으로 해 style 에 적었다).
 * 내용 칸은 모두 그려 두고(forceMount) 고르지 않은 칸은 data-state="inactive" 로 숨긴다.
 * Radix 가 붙이는 것 중 목록의 aria-orientation · data-orientation, 탭의 id · aria-selected · aria-controls · data-state · data-disabled · tabindex(고른 탭만 0 —
 * 레시피가 정한다), 내용 칸의 id · aria-labelledby · data-state · tabindex 를 그리고, 목록의 tabindex · style(로빙 포커스)은 그리지 않는다.
 * id 는 Radix 의 useId 자리다 — 예제마다 앞말을 달리해 한 페이지에서 겹치지 않게 한다. 내용 칸을 그리지 않은 견본(폭 · 크기 · 상태 · 변형 표)은
 * aria-controls 를 뺐다 — 없는 칸을 가리키지 않게. 실제 코드는 탭마다 TabsContent 를 둔다(tabs.md 접근성).
 * 막대 자리(--tabs-indicator-left · --tabs-indicator-width)는 레시피가 고른 탭의 offsetLeft · offsetWidth 를 재서 막대의 style 에 넣는다 — 정적
 * 미리보기에는 재는 스크립트가 없어 고른 탭에 anchor-name 을 달고 같은 두 변수를 CSS anchor() · anchor-size() 로 넣는다(레시피에는 없는 미리보기용
 * 덧칠 — anchor positioning 이 없는 브라우저에서는 막대가 보이지 않는다). 막대를 탭에서 들이는 거리(--tabs-indicator-inset)는 레시피 그대로 목록의 클래스가 정한다.
 * 레시피의 스크립트(화살표로 옮기며 고르기 · 막대 미끄러짐 · 고른 탭 드러내기 · 누르는 순간 --press-basis 재기 · 밀어 넘기기)는 정적 HTML 에 없다 —
 * 탭을 누르면 축소는 레시피 그대로 보이지만 고른 탭은 그대로다.
 */

import { readFileSync } from "node:fs";

// ── tabs.tsx 의 cva · 상수와 같은 값 ─────────────────────────────────────

// Line 목록(tabsListVariants) — 놓인 폭을 채우고 바탕은 불투명하다. 바닥 구획 선은 안쪽 1px(inset)이라 목록 높이를 밀지 않는다.
// --tabs-indicator-inset 은 막대를 탭에서 들이는 거리(Fill 16 · Hug 0)
const LIST_BASE = "relative flex w-full bg-bg-layer-default font-sans shadow-[inset_0_-1px_0_0_var(--color-stroke-neutral-subtle)]";

const LIST_VARIANTS = {
  layout: {
    fill: "overflow-x-auto px-0 scroll-px-x4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [--tabs-indicator-inset:var(--spacing-x4)]",
    hug: "overflow-x-auto px-x4 scroll-px-x4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [--tabs-indicator-inset:0px]",
  },
  size: {
    small: "min-h-[40px]",
    medium: "min-h-[44px]",
  },
};

const LIST_DEFAULTS = { layout: "fill", size: "small" };

// Line 탭(tabsTriggerVariants) — 위아래 · 좌우 10, 글을 아래로 붙인다. 고르면 글자색만 바로 바뀐다(막히면 비활성 색이 이긴다).
// 호버 모양은 없고 누르면 탭만 2px 거리로 준다. 포커스 링은 탭 안쪽 2px(각진 모서리)
const TRIGGER_BASE = [
  "relative inline-flex cursor-pointer select-none items-end justify-center whitespace-nowrap p-x2_5 font-sans font-bold text-fg-neutral-subtle",
  "enabled:data-[state=active]:text-fg-neutral",
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed disabled:text-fg-disabled disabled:[scale:1]",
].join(" ");

const TRIGGER_VARIANTS = {
  layout: {
    fill: "flex-1",
    hug: "flex-none",
  },
  size: {
    small: "min-h-[40px] text-t4 [--press-basis:40]",
    medium: "min-h-[44px] text-t5 [--press-basis:44]",
  },
};

const TRIGGER_DEFAULTS = { layout: "fill", size: "small" };

// 막대(TABS_INDICATOR) — 고른 탭 아래 2px, 끝이 각지다. 자리는 --tabs-indicator-left · -width, 들임은 목록의 --tabs-indicator-inset.
// 고른 탭이 막히면(목록 전체를 막을 때) 막대도 fg-disabled
const INDICATOR = [
  "pointer-events-none absolute bottom-0 h-0.5 rounded-none bg-fg-neutral",
  "[[role=tablist]:has(>[role=tab][data-state=active]:disabled)>&]:bg-fg-disabled",
  "left-[calc(var(--tabs-indicator-left,0px)_+_var(--tabs-indicator-inset))] w-[max(0px,calc(var(--tabs-indicator-width,0px)_-_2_*_var(--tabs-indicator-inset)))]",
  "[transition:left_var(--motion-duration-d4)_var(--motion-ease-easing),width_var(--motion-duration-d4)_var(--motion-ease-easing)]",
].join(" ");

// 알림 점(TABS_NOTIFICATION) — 브랜드 글자색, 글 끝에서 2 · 글 위쪽. 띄워 두므로 탭 폭이 넓어지지 않는다. 고른 탭에는 그리지 않는다
const NOTIFICATION = "pointer-events-none absolute left-[calc(100%_+_2px)] top-0 size-[6px] rounded-full bg-fg-brand";

// Chip Tabs 목록(chipTabsListVariants) — 바탕 · 바닥 선 없이 한 줄 가로 스크롤. 좌우 화면 여백 24 · 위아래 8 · 칩 사이 8
const CHIP_TABS_LIST =
  "relative flex w-full flex-nowrap gap-between-chips overflow-x-auto px-global-gutter py-x2 scroll-px-global-gutter font-sans [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

// Chip Tabs 의 알림 점(CHIP_TABS_NOTIFICATION) — 브랜드 글자색, 글 뒤 6(칩의 사이)에 세로 가운데. 칩 폭이 그만큼 넓어진다. 고른 칩에는 그리지 않는다
const CHIP_TABS_NOTIFICATION = "pointer-events-none size-[6px] shrink-0 rounded-full bg-fg-brand";

// 내용 칸(TABS_CONTENT) — 키보드 포커스 링은 안쪽 2px, 고르지 않은 칸은 숨긴다. 밀어 넘기는 동안의 엿보기 칸은 띄운다
const CONTENT = [
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "data-[state=inactive]:hidden",
  "data-[swipe-peek]:absolute data-[swipe-peek]:inset-x-0 data-[swipe-peek]:top-0 data-[state=inactive]:data-[swipe-peek]:block",
].join(" ");

// 밀어 넘기기 묶음(TABS_SWIPE_AREA) — 이웃 칸이 들어올 자리, 미는 동안만 넘친 것을 자른다. 손가락일 때만 가로 끌기를 받는다
const SWIPE_AREA = "relative pointer-coarse:[touch-action:pan-y_pinch-zoom] data-[swiping]:overflow-clip";

// ── tabs.tsx 의 JSX 에 적힌 클래스 ───────────────────────────────────────

const LABEL = "relative";
const SR_ONLY = "sr-only";
// Chip Tabs 의 변형 → Chip 의 변형(chip-tabs.yaml)
const CHIP_VARIANT = { solid: "solid", outline: "outlineStrong" };

// ── chip.tsx 의 cva(chipVariants)와 같은 값 — Chip Tabs 의 칩 하나 ─────────

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
    solid: [
      "bg-bg-neutral-weak text-fg-neutral hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed",
      "[&:is([data-state=checked],[data-selected])]:bg-bg-neutral-inverted [&:is([data-state=checked],[data-selected])]:text-fg-neutral-inverted [&:is([data-state=checked],[data-selected])]:hover:bg-bg-neutral-inverted-pressed [&:is([data-state=checked],[data-selected])]:active:bg-bg-neutral-inverted-pressed",
    ].join(" "),
    outlineStrong: [
      "bg-transparent text-fg-neutral shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed",
      "[&:is([data-state=checked],[data-selected])]:bg-bg-neutral-inverted [&:is([data-state=checked],[data-selected])]:text-fg-neutral-inverted [&:is([data-state=checked],[data-selected])]:shadow-none [&:is([data-state=checked],[data-selected])]:hover:bg-bg-neutral-inverted-pressed [&:is([data-state=checked],[data-selected])]:active:bg-bg-neutral-inverted-pressed",
    ].join(" "),
    outlineWeak: [
      "bg-transparent text-fg-neutral shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed",
      "[&:is([data-state=checked],[data-selected])]:bg-bg-neutral-weak [&:is([data-state=checked],[data-selected])]:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-contrast)] [&:is([data-state=checked],[data-selected])]:hover:bg-bg-neutral-weak-pressed [&:is([data-state=checked],[data-selected])]:active:bg-bg-neutral-weak-pressed",
    ].join(" "),
  },
  size: {
    small: "h-8 [--press-basis:32]",
    medium: "h-9 [--press-basis:36]",
    large: "h-10 [--press-basis:40]",
  },
  layout: {
    withText: "",
    iconOnly: "",
  },
};

const CHIP_COMPOUND = [
  { size: "small", layout: "withText", className: "min-w-11 px-x3" },
  { size: "medium", layout: "withText", className: "min-w-12 px-x3_5" },
  { size: "large", layout: "withText", className: "min-w-13 px-x4" },
  { size: "small", layout: "iconOnly", className: "w-8 px-0 [&>svg]:size-3.5" },
  { size: "medium", layout: "iconOnly", className: "w-9 px-0 [&>svg]:size-4" },
  { size: "large", layout: "iconOnly", className: "w-10 px-0 [&>svg]:size-4" },
];

const CHIP_DEFAULTS = { variant: "outlineWeak", size: "medium", layout: "withText" };

// ── 끝 흐림 — scroll-fog.tsx 의 useScrollFog 와 같은 셈(row · 가로) ─────────────────

// 토큰 값 — 레시피는 그릴 때 getComputedStyle 로 읽는다. 정적 HTML 은 DESIGN.md 의 v104 표에서 읽는다
const FADE_MASK = /`gradient-fade-mask` \| `(linear-gradient\([^`]+\))`/.exec(readFileSync(new URL("../../../DESIGN.md", import.meta.url), "utf8"))[1];
const SOLID = "linear-gradient(#000, #000)";
const withDirection = (token, direction) => token.replace(/^linear-gradient\(/, `linear-gradient(${direction}, `);
// 겹친 층을 곱한다 — scroll-fog.tsx 의 COMPOSITE 와 같은 값(-webkit- 쪽은 옛 이름 source-in)
const COMPOSITE = { "mask-composite": "intersect", "-webkit-mask-composite": "source-in" };
// 좌우 20 — 흐린 쪽마다 목록 전체 크기의 층 하나(단계는 그 쪽 깊이의 몫 — 깊이 안에서 불투명에 닿는다), 두 층을 곱한다.
// 목록의 style 에 mask-* 와 -webkit-mask-* 를 같이 넣는다
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

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다
function cvaOf(base, { variants = {}, compoundVariants = [], defaultVariants = {} } = {}) {
  return (props = {}) => {
    const p = { ...defaultVariants };
    for (const [k, v] of Object.entries(props)) if (v !== undefined) p[k] = v;
    const parts = [base];
    for (const [axis, map] of Object.entries(variants)) parts.push(map[p[axis]]);
    for (const { class: cls, className, ...when } of compoundVariants) {
      if (Object.entries(when).every(([k, v]) => p[k] === v)) parts.push(cls, className);
    }
    return parts.filter(Boolean).join(" ");
  };
}

const tabsListVariants = cvaOf(LIST_BASE, { variants: LIST_VARIANTS, defaultVariants: LIST_DEFAULTS });
const tabsTriggerVariants = cvaOf(TRIGGER_BASE, { variants: TRIGGER_VARIANTS, defaultVariants: TRIGGER_DEFAULTS });
const chipVariants = cvaOf(CHIP_BASE, { variants: CHIP_VARIANTS, compoundVariants: CHIP_COMPOUND, defaultVariants: CHIP_DEFAULTS });

// "focus-visible:-outline-offset-2" → ["focus-visible", "-outline-offset-2"] — 괄호 안의 ":" 는 가르지 않는다
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

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다 — 이 파일이 덧붙이는 강제 상태에 나오는 무리(바탕 · 임의 속성)만 안다
const GROUPS = [[/^bg-/, "bg"]];

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

// 정적 미리보기에서 누름 · 포커스를 보이려고 — 그 상태의 클래스(active: · focus-visible:)에서 접두어만 뗀 사본을 뒤에 붙인다.
// 값은 레시피 그대로라 tabs.tsx · chip.tsx 가 바뀌면 같이 따라간다
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

const FORCE = { pressed: "active", focused: "focus-visible" };
const withState = (classList, force) => (force && FORCE[force] ? merge(`${classList} ${forceState(classList, FORCE[force])}`) : classList);

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// 사이트의 `* { scrollbar-width: thin }`(얇은 스크롤바)은 층(@layer) 밖 규칙이라 스크롤 칸의 [scrollbar-width:none] 을 이긴다 — 넘친 목록 아래에
// 스크롤바가 생긴다. 스크롤하는 목록(Hug · Chip Tabs)에는 style 로 한 번 더 숨긴다(레시피에는 없는 미리보기용 덧칠)
const SCROLL_FIX = "scrollbar-width:none;";

// 막대 자리 — 레시피는 고른 탭을 재서 px 로 넣는다. 미리보기는 고른 탭의 anchor 로 같은 두 변수를 채운다(미리보기용 덧칠)
const anchorOf = (uid) => `--${uid}-selected`;
const indicatorStyle = (uid) =>
  `position-anchor:${anchorOf(uid)}; --tabs-indicator-left:anchor(left); --tabs-indicator-width:anchor-size(width);`;

// <Tabs> — Radix Tabs.Root(가로 하나 · 화살표로 옮기면 바로 고른다)
const tabsRoot = (inner) => `<div dir="ltr" data-orientation="horizontal" data-slot="tabs">${inner}</div>`;

// <TabsTrigger> — tabs.tsx 그대로(Radix Tabs.Trigger). id · aria-controls 는 Radix 의 id 자리(`${uid}-trigger-${value}` · `${uid}-content-${value}`) —
// 내용 칸이 없는 견본(panels: false)은 aria-controls 를 뺀다. 알림 점 · "새 소식" 은 안 고른 탭에만 그린다(레시피 그대로).
// 고른 탭에는 막대가 잡을 anchor-name 을 단다(미리보기용 덧칠).
// force = "pressed" · "focused" — 미리보기용 강제 상태
function trigger({ uid, value, label, layout, size, selected = false, disabled = false, notification = false, panels = true, force }) {
  const root = attrs([
    'type="button"',
    'role="tab"',
    `aria-selected="${selected}"`,
    panels && `aria-controls="${uid}-content-${value}"`,
    `data-state="${selected ? "active" : "inactive"}"`,
    disabled && 'data-disabled=""',
    disabled && "disabled",
    `id="${uid}-trigger-${value}"`,
    'data-orientation="horizontal"',
    'data-slot="tabs-trigger"',
    `data-value="${esc(value)}"`,
    notification && 'data-notification=""',
    `tabindex="${selected ? 0 : -1}"`,
    `class="${withState(tabsTriggerVariants({ layout, size }), force)}"`,
    selected && `style="anchor-name:${anchorOf(uid)};"`,
  ]);
  const dot = notification && !selected ? `<span aria-hidden="true" data-slot="tabs-notification" class="${NOTIFICATION}"></span>` : "";
  const sr = notification && !selected ? `<span class="${SR_ONLY}">새 소식</span>` : "";
  return `<button ${root}><span data-slot="tabs-label" class="${LABEL}">${esc(label)}${dot}</span>${sr}</button>`;
}

// <TabsList> — tabs.tsx 그대로. 막대가 첫 자식이고 그 뒤에 탭. items = [{ value, label, disabled?, notification? }], value = 고른 탭.
// force = { [value]: "pressed" | "focused" }
function tabsList({ uid, layout = "fill", size = "small", ariaLabel, items, value, panels = true, force = {} }) {
  const root = attrs([
    'role="tablist"',
    'aria-orientation="horizontal"',
    'data-orientation="horizontal"',
    'data-slot="tabs-list"',
    `data-layout="${layout}"`,
    `data-size="${size}"`,
    'data-tabs-prevent-swipe=""',
    `class="${tabsListVariants({ layout, size })}"`,
    ariaLabel && `aria-label="${esc(ariaLabel)}"`,
    layout === "hug" && `style="${SCROLL_FIX}"`,
  ]);
  const bar = `<span aria-hidden="true" data-slot="tabs-indicator" class="${INDICATOR}" style="${indicatorStyle(uid)}"></span>`;
  const tabs = items.map((it) =>
    trigger({ uid, layout, size, panels, value: it.value, label: it.label, selected: it.value === value, disabled: !!it.disabled, notification: !!it.notification, force: force[it.value] }),
  );
  return `<div ${root}>${bar}${tabs.join("")}</div>`;
}

// <TabsContent> — tabs.tsx 그대로(forceMount). 고르지 않은 칸은 data-state="inactive" 로 숨는다
const tabsContent = ({ uid, value, selected, body }) =>
  `<div data-state="${selected ? "active" : "inactive"}" data-orientation="horizontal" role="tabpanel" aria-labelledby="${uid}-trigger-${value}" id="${uid}-content-${value}" tabindex="0" data-slot="tabs-content" class="${CONTENT}">${body}</div>`;

// <ChipTabsTrigger> — tabs.tsx 그대로. 칩은 chipVariants(withText), 고른 탭에 data-selected(Chip 의 고른 모습 — 짙은 채움)
function chipTrigger({ uid, value, label, variant = "solid", size = "medium", selected = false, disabled = false, notification = false, panels = true }) {
  const root = attrs([
    'type="button"',
    'role="tab"',
    `aria-selected="${selected}"`,
    panels && `aria-controls="${uid}-content-${value}"`,
    `data-state="${selected ? "active" : "inactive"}"`,
    disabled && 'data-disabled=""',
    disabled && "disabled",
    `id="${uid}-trigger-${value}"`,
    'data-orientation="horizontal"',
    'data-slot="chip-tabs-trigger"',
    `data-value="${esc(value)}"`,
    selected && 'data-selected=""',
    notification && 'data-notification=""',
    `tabindex="${selected ? 0 : -1}"`,
    `class="${chipVariants({ variant: CHIP_VARIANT[variant], size, layout: "withText" })}"`,
  ]);
  const dot = notification && !selected ? `<span aria-hidden="true" data-slot="chip-tabs-notification" class="${CHIP_TABS_NOTIFICATION}"></span><span class="${SR_ONLY}">새 소식</span>` : "";
  return `<button ${root}>${esc(label)}${dot}</button>`;
}

// <ChipTabsList> — tabs.tsx 그대로. variant solid(기본) · outline, size medium(기본) · large
function chipTabsList({ uid, variant = "solid", size = "medium", ariaLabel, items, value, panels = true }) {
  const root = attrs([
    'role="tablist"',
    'aria-orientation="horizontal"',
    'data-orientation="horizontal"',
    'data-slot="chip-tabs-list"',
    'data-scroll-fog="row"',
    `data-variant="${variant}"`,
    `data-size="${size}"`,
    'data-tabs-prevent-swipe=""',
    `class="${CHIP_TABS_LIST}"`,
    ariaLabel && `aria-label="${esc(ariaLabel)}"`,
    'data-fog-axis="x"',
    `style="${fogStyle()} ${SCROLL_FIX}"`,
  ]);
  const tabs = items.map((it) =>
    chipTrigger({ uid, variant, size, panels, value: it.value, label: it.label, selected: it.value === value, disabled: !!it.disabled, notification: !!it.notification }),
  );
  return `<div ${root}>${tabs.join("")}</div>`;
}

// 목록 + 내용 칸 — items = [{ value, label, body, notification? }]
const withPanels = ({ uid, value, items, list }) =>
  tabsRoot(`${list}${items.map((it) => tabsContent({ uid, value: it.value, selected: it.value === value, body: it.body })).join("")}`);

// 화면 틀 — 탭 목록은 화면 끝까지 가고(좌우 여백은 목록이 가진다), 제목 · 내용은 화면 여백 24 안에 둔다. 폰은 안쪽 360
const PHONE =
  "box-sizing:content-box; max-width:360px; overflow:hidden; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4);";
const phone = (html) => `<div style="${PHONE}">${html}</div>`;
// 데스크톱 웹의 넓은 카드
const CARD =
  "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); overflow:hidden;";
const card = (html) => `<div style="${CARD}">${html}</div>`;
const TITLE =
  "padding:var(--spacing-x6) var(--spacing-global-gutter) var(--spacing-x2); font-family:var(--font-sans); font-size:var(--text-t7); line-height:var(--text-t7--line-height); font-weight:700; color:var(--color-fg-neutral);";
const title = (text) => `<div style="${TITLE}">${esc(text)}</div>`;
// 내용 칸 안 — 줄(제목 · 설명 · 값). 레시피 밖의 화면 내용이라 클래스 없이 그린다
const ROW = "display:flex; align-items:center; gap:var(--spacing-x3); padding:var(--spacing-x3) var(--spacing-global-gutter);";
const ROW_TEXT = "display:flex; flex:1; flex-direction:column; gap:var(--spacing-x0_5); min-width:0;";
const ROW_TITLE = "font-family:var(--font-sans); font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const ROW_DETAIL = "font-family:var(--font-sans); font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle);";
const ROW_VALUE = "font-family:var(--font-sans); font-size:var(--text-t5); line-height:var(--text-t5--line-height); font-weight:700; color:var(--color-fg-neutral);";
const row = (name, detail, value = "") =>
  `<div style="${ROW}"><div style="${ROW_TEXT}"><span style="${ROW_TITLE}">${esc(name)}</span><span style="${ROW_DETAIL}">${esc(detail)}</span></div>${
    value ? `<span style="${ROW_VALUE}">${esc(value)}</span>` : ""
  }</div>`;
const LEAD = "padding:var(--spacing-x4) var(--spacing-global-gutter) var(--spacing-x1); font-family:var(--font-sans); font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const lead = (html) => `<div style="${LEAD}">${html}</div>`;
const rows = (list) => `<div style="padding-bottom:var(--spacing-x2);">${list.join("")}</div>`;
const CAPTION =
  "font-size:var(--text-t2); line-height:var(--text-t2--line-height); font-weight:400; color:var(--color-fg-neutral-subtle);";
// 크기 · 상태 · 변형 이름처럼 코드로 쓰는 이름표
const CODE = `${CAPTION} font-family:ui-monospace, SFMono-Regular, Menlo, monospace;`;
const code = (text) => `<span style="${CODE}">${text}</span>`;
// 이름표 + 그림 — 이름표는 위, 화면 여백 24 안
const labeled = (caption, html, style = CODE) =>
  `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2); min-width:0;"><span style="${style} padding:0 var(--spacing-global-gutter);">${caption}</span>${html}</div>`;
const stack = (items, gap = "var(--spacing-x5)") => `<div style="display:flex; flex-direction:column; gap:${gap}; padding:var(--spacing-x4) 0;">${items.join("")}</div>`;
// 견주는 표 — 맨 위에 칸 이름, 줄마다 이름표를 칸들 위 한 줄에 둔다(미리보기 폭 600 안에 네 칸이 들어가게). 좁으면 가로로 스크롤한다
const matrix = (columns, table) =>
  `<div style="overflow-x:auto; padding:var(--spacing-x1_5);"><div style="display:grid; grid-template-columns:repeat(${columns.length}, max-content); gap:var(--spacing-x2) var(--spacing-x4); align-items:center; justify-items:start;">${[
    ...columns.map(code),
    ...table.flatMap(([name, cells]) => [`<div style="grid-column:1 / -1; padding-top:var(--spacing-x3);">${code(name)}</div>`, ...cells]),
  ].join("")}</div></div>`;
// 흰 표면 — 사이트 미리보기 칸의 바탕(bg-page)은 회색이라 화면처럼 흰 바탕 위에 둔다
const SURFACE =
  "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-x6);";
const surface = (html) => `<div style="${SURFACE}">${html}</div>`;

// ── 화면 예시의 값 ────────────────────────────────────────────────────────

// 통계 — 카테고리 · 추이 · 비교(서로 다른 내용이라 탭이다). 9월 한 달 기준
const STATS = [
  {
    value: "category",
    label: "카테고리",
    body: `${lead("9월 지출 <strong>905,200원</strong>")}${rows([
      row("식비", "38%", "348,000원"),
      row("쇼핑", "26%", "236,200원"),
      row("기타", "25%", "223,000원"),
      row("교통", "11%", "98,000원"),
    ])}`,
  },
  {
    value: "trend",
    label: "추이",
    body: `${lead("한 달 지출 — 최근 4개월")}${rows([
      row("9월", "9월 1일~30일", "905,200원"),
      row("8월", "8월 1일~31일", "876,000원"),
      row("7월", "7월 1일~31일", "790,400원"),
      row("6월", "6월 1일~30일", "842,100원"),
    ])}`,
  },
  {
    value: "compare",
    label: "비교",
    body: `${lead("8월보다 <strong>29,200원</strong> 더 썼어요")}${rows([
      row("식비", "8월 336,000원", "+12,000원"),
      row("쇼핑", "8월 251,000원", "−14,800원"),
      row("기타", "8월 213,000원", "+10,000원"),
      row("교통", "8월 76,000원", "+22,000원"),
    ])}`,
  },
];

// 금액 가리기 — 화면 9개라 Hug. 값은 글이 아니라 바뀌지 않는 id 다(md 코드의 SCREENS 와 같다 — Radix 가 값으로 탭 · 내용 칸의 id 를 만든다)
const SCREENS = [
  { id: "all", label: "전체" },
  { id: "home", label: "홈" },
  { id: "asset", label: "자산" },
  { id: "ledger", label: "가계부" },
  { id: "stats", label: "통계" },
  { id: "budget", label: "예산" },
  { id: "stock", label: "증권" },
  { id: "dutch", label: "더치페이" },
  { id: "etc", label: "기타" },
];

// HR 휴가 신청 — 데스크톱 넓은 카드라 둘이어도 Hug medium, 승인 내역에 대기 중인 신청(알림 점)
const LEAVE = [
  {
    value: "mine",
    label: "신청 내역",
    body: rows([
      row("연차 3일", "10월 12일 (월)~14일 (수) · 승인 대기"),
      row("반차 · 오후", "9월 25일 (금) · 승인됨"),
      row("연차 1일", "9월 4일 (금) · 승인됨"),
    ]),
  },
  {
    value: "approval",
    label: "승인 내역",
    notification: true,
    body: rows([
      row("김지원 · 연차 3일", "디자인 본부 · 10월 20일 (화)~22일 (목) · 대기"),
      row("박서연 · 반차", "프로덕트 본부 · 10월 16일 (금) 오전 · 대기"),
    ]),
  },
];

// 증권 — 1차 증권사(Line Fill medium) · 2차 보기(Chip Tabs Solid)
const HOLD = {
  namu: [row("삼성전자", "12주 · 평균 71,200원", "+4.2%"), row("카카오", "5주 · 평균 48,900원", "−1.8%")],
  toss: [row("애플", "3주 · 평균 $189.40", "+12.4%")],
};
const VIEWS = [
  { value: "holding", label: "보유" },
  { value: "watch", label: "관심" },
  { value: "discover", label: "발견" },
];

// 폭 견본 — 360 폰에서 Fill 2 · 3 · 4 · 5개(막대 = 탭 폭 − 32), Hug 7개
const FILL_SETS = [
  { uid: "tabs-ex-width-2", label: "휴가 신청", note: "2개 — 탭 180 · 막대 148", tabs: ["신청 내역", "승인 내역"] },
  { uid: "tabs-ex-width-3", label: "통계", note: "3개 — 탭 120 · 막대 88", tabs: ["카테고리", "추이", "비교"] },
  { uid: "tabs-ex-width-4", label: "직원 상세", note: "4개 — 탭 90 · 막대 58", tabs: ["기본 정보", "근태", "평가", "급여"] },
  { uid: "tabs-ex-width-5", label: "팀", note: "5개 — 탭 72 · 막대 40", tabs: ["개요", "구성원", "일정", "문서", "설정"] },
];
const STAFF = ["기본 정보", "근태", "휴가", "평가", "급여", "교육", "문서"];
// 값이 따로 없는 견본은 차례로 값을 단다 — 글에는 빈칸이 있어("기본 정보") Radix 가 값으로 만드는 id 에 쓰면 id 가 깨진다
const itemsOf = (labels) => labels.map((label, i) => ({ value: `t${i + 1}`, label }));

// 상태 표 — [이름표, 고름, 알림 점]. 칸은 enabled · pressed · focused · disabled
const STATES = ["enabled", "pressed", "focused", "disabled"];
const STATE_ROWS = [
  ["unselected — 막대는 옆 탭", false, false],
  ["selected — fg-neutral + 막대", true, false],
  ["notification — 알림 점", false, true],
];

// ── 예제 ──────────────────────────────────────────────────────────────────

export const tabsExamples = [
  {
    title: "Line — Fill",
    description:
      "화면 · 구역 맨 위의 1차 탭이다 — 누르면 탭 아래 내용 전체가 다른 구역으로 바뀐다. 탭이 5개 이하이고 글이 짧으면 Fill(기본)로 칸을 똑같이 나눠 목록을 꽉 채우고, 막대는 칸에서 좌우 16 씩 들인다. small(기본)은 40 · 글 14 · 700 이고, 고르면 글자색만 fg-neutral-subtle 에서 fg-neutral 로 바뀌며 2px 중립색 막대가 200ms 로 미끄러진다. ← → 로 옮기면 바로 고르고(끝에서 처음으로 돈다) Home · End 는 첫 · 마지막 탭이다. Tab 은 고른 탭 하나에만 서고 다음 Tab 은 내용 칸이다. 내용 칸은 모두 그려 두고 고르지 않은 칸을 숨겨, 다른 탭을 다녀와도 스크롤 · 입력이 그대로다. 목록에 보이는 제목이 없으면 aria-label 로 이름을 단다. 미리보기는 카테고리를 고른 모습이다.",
    jsx: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs value={tab} onValueChange={setTab}>
  <TabsList aria-label="통계">
    <TabsTrigger value="category">카테고리</TabsTrigger>
    <TabsTrigger value="trend">추이</TabsTrigger>
    <TabsTrigger value="compare">비교</TabsTrigger>
  </TabsList>
  <TabsContent value="category">…</TabsContent>
  <TabsContent value="trend">…</TabsContent>
  <TabsContent value="compare">…</TabsContent>
</Tabs>`,
    render: () => {
      const uid = "tabs-ex-fill";
      return phone(
        `${title("통계")}${withPanels({ uid, value: "category", items: STATS, list: tabsList({ uid, ariaLabel: "통계", items: STATS, value: "category" }) })}`,
      );
    },
  },

  {
    title: "Line — Hug · 알림 점",
    description:
      "탭이 6개 이상이거나 글이 길면 Hug(layout=\"hug\")다 — 탭이 글 + 좌우 10 이고 목록 좌우 16, 넘치면 가로로 스크롤한다(스크롤바는 숨긴다). 막대는 탭 폭 그대로다. 고른 탭이 화면 밖이면 가장자리에서 16 띄워 목록만 스크롤한다 — 페이지는 움직이지 않는다. 데스크톱의 넓은 카드 · 페이지처럼 칸을 나누면 탭이 지나치게 넓어지는 자리는 개수가 적어도 Hug 로 둔다(휴가 신청 — medium 44 · 글 16). 새 소식이 있는 탭 하나에만 notification 을 준다 — 글 끝에서 2 · 글 위쪽에 6 · fg-brand(브랜드 글자색) 점을 띄우고(탭 폭은 그대로) 보조 기술에는 \"새 소식\" 을 덧붙인다. 고른 탭에는 그리지 않고(레시피가 뺀다), 내용을 보면 notification 을 끈다. 값은 글이 아니라 바뀌지 않는 id 다 — Radix 가 값으로 탭 · 내용 칸의 id 를 만들어, 글에 빈칸이 있으면 둘의 연결이 깨진다. 글에는 개수를 붙이지 않는다(\"승인 내역 3\" ✗).",
    jsx: `{/* value 는 글이 아니라 바뀌지 않는 id — 글에 빈칸이 있으면 탭 · 내용 칸의 id 연결이 깨진다 */}
<Tabs value={screen} onValueChange={setScreen}>
  <TabsList layout="hug" aria-label="금액 가리기">
    {SCREENS.map((s) => (
      <TabsTrigger key={s.id} value={s.id}>{s.label}</TabsTrigger>
    ))}
  </TabsList>
  …
</Tabs>

<Tabs value={tab} onValueChange={setTab}>
  <TabsList layout="hug" size="medium" aria-label="휴가 신청">
    <TabsTrigger value="mine">신청 내역</TabsTrigger>
    <TabsTrigger value="approval" notification={hasPending}>승인 내역</TabsTrigger>
  </TabsList>
  …
</Tabs>`,
    render: () => {
      const hide = "tabs-ex-hug-hide";
      const leave = "tabs-ex-hug-leave";
      const hideItems = SCREENS.map((sc) => ({ value: sc.id, label: sc.label, body: rows([row(`${sc.label} 화면`, "고른 화면의 금액을 가린다")]) }));
      return `<div style="display:flex; flex-direction:column; gap:var(--spacing-x6);">${phone(
        `${title("금액 가리기")}${withPanels({ uid: hide, value: "all", items: hideItems, list: tabsList({ uid: hide, layout: "hug", ariaLabel: "금액 가리기", items: hideItems, value: "all" }) })}`,
      )}${card(
        `${title("휴가 신청")}${withPanels({ uid: leave, value: "mine", items: LEAVE, list: tabsList({ uid: leave, layout: "hug", size: "medium", ariaLabel: "휴가 신청", items: LEAVE, value: "mine" }) })}`,
      )}</div>`;
    },
  },

  {
    title: "두 단 — Chip Tabs",
    description:
      "탭 안에서 다시 나누면 1차는 Line, 2차는 Chip Tabs(ChipTabsList · ChipTabsTrigger)다 — 두 단이 같은 모양이면 어느 줄이 큰 갈래인지 보이지 않는다. 칩 하나는 Chip 그대로다: variant=\"solid\"(기본 — 화면 전체 내용을 바꾸는 탭, Chip Solid) · \"outline\"(일부 내용, Chip Outline Strong), size medium 36(기본) · large 40, 고르면 짙은 채움(bg-neutral-inverted · fg-neutral-inverted)이다. Radix 탭은 data-state=\"active\" 를 달므로 레시피가 고른 탭에 data-selected 를 달아 Chip 의 고른 모습을 칠한다. 목록은 바탕 · 바닥 선 없이 한 줄 가로 스크롤이고 좌우 화면 여백 24 · 위아래 8 · 칩 사이 8 이다. 화면에 필터 바(거르는 칩)가 함께 있으면 2차도 Line 으로 둔다 — 같은 모양이면 무엇이 탭인지 알 수 없다.",
    jsx: `import { ChipTabsList, ChipTabsTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs value={broker} onValueChange={setBroker}>
  <TabsList size="medium" aria-label="증권사">
    <TabsTrigger value="namu">나무증권</TabsTrigger>
    <TabsTrigger value="toss">토스증권</TabsTrigger>
  </TabsList>
  <TabsContent value="namu">
    <Tabs value={view} onValueChange={setView}>
      <ChipTabsList variant="solid" aria-label="나무증권 보기">
        <ChipTabsTrigger value="holding">보유</ChipTabsTrigger>
        <ChipTabsTrigger value="watch">관심</ChipTabsTrigger>
        <ChipTabsTrigger value="discover">발견</ChipTabsTrigger>
      </ChipTabsList>
      <TabsContent value="holding">…</TabsContent>
      …
    </Tabs>
  </TabsContent>
  …
</Tabs>`,
    render: () => {
      const outer = "tabs-ex-two";
      const inner = (broker, name) => {
        const uid = `tabs-ex-two-${broker}`;
        const items = VIEWS.map((v) => ({ ...v, body: v.value === "holding" ? rows(HOLD[broker]) : rows([row(`${name} ${v.label}`, "내용 칸")]) }));
        return withPanels({ uid, value: "holding", items, list: chipTabsList({ uid, ariaLabel: `${name} 보기`, items, value: "holding" }) });
      };
      const brokers = [
        { value: "namu", label: "나무증권", body: inner("namu", "나무증권") },
        { value: "toss", label: "토스증권", body: inner("toss", "토스증권") },
      ];
      return phone(`${title("증권")}${withPanels({ uid: outer, value: "namu", items: brokers, list: tabsList({ uid: outer, size: "medium", ariaLabel: "증권사", items: brokers, value: "namu" }) })}`);
    },
  },

  {
    title: "폭 — fill · hug",
    description:
      "layout 은 둘이다. fill(기본)은 칸을 똑같이 나눠 목록을 꽉 채운다 — 막대는 칸에서 좌우 16 씩 들여 탭 폭 − 32 다(360 폰 2 · 3 · 4 · 5개면 148 · 88 · 58 · 40). 5개까지 · 짧은 글에 쓴다. hug 는 탭이 글 + 좌우 10 · 목록 좌우 16 이고 막대는 탭 폭 그대로다 — 6개 이상이거나 글이 길면 쓰고, 넘치면 가로로 스크롤한다. 탭이 제 좌우 10 을 더해 Hug 의 첫 글이 26 에서 시작한다(본문 글의 24 와 거의 맞는다). 글은 줄바꿈 · 말줄임하지 않는다 — Fill 에서 글이 칸을 넘으면(영어처럼 글이 길어지는 언어에서 자주) Hug 로 바꾼다. 레시피는 Fill 목록이 넘치면 개발 중에 경고한다.",
    jsx: `// 5개까지 · 짧은 글 — 칸을 똑같이 나눈다(layout="fill" 은 기본이라 빼도 된다)
<TabsList aria-label="직원 상세">
  <TabsTrigger value="profile">기본 정보</TabsTrigger>
  <TabsTrigger value="attendance">근태</TabsTrigger>
  <TabsTrigger value="review">평가</TabsTrigger>
  <TabsTrigger value="pay">급여</TabsTrigger>
</TabsList>

// 6개부터 · 긴 글 — 글만큼, 넘치면 가로 스크롤
<TabsList layout="hug" aria-label="직원 상세">
  {sections.map((s) => <TabsTrigger key={s.id} value={s.id}>{s.name}</TabsTrigger>)}
</TabsList>`,
    render: () =>
      phone(
        stack([
          ...FILL_SETS.map((s) => labeled(s.note, tabsList({ uid: s.uid, ariaLabel: s.label, items: itemsOf(s.tabs), value: "t1", panels: false }), CAPTION)),
          labeled("hug · 7개 — 글 + 좌우 10 · 넘치면 가로 스크롤", tabsList({ uid: "tabs-ex-width-hug", layout: "hug", ariaLabel: "직원 상세", items: itemsOf(STAFF), value: "t1", panels: false }), CAPTION),
        ]),
      ),
  },

  {
    title: "크기 — small · medium",
    description:
      "small 40 · 글 14(t4 — 기본) · medium 44 · 글 16(t5). 탭의 위아래 · 좌우는 둘 다 10 이고 글을 아래로 붙여(아래 10) 막대와 글 사이가 크기와 관계없이 같다 — 남는 높이는 위로 간다(small 위 11 · medium 위 12). 글은 고르든 안 고르든 700 이라 고를 때 폭이 흔들리지 않는다. 목록 높이가 곧 누르는 높이다 — medium 44 는 WCAG 2.5.5(AAA 44 × 44)를 넘고, small 40 은 2.5.8(AA 24 × 24)만 넘는다(SEED 와 같다). 어느 크기를 쓸지는 화면의 다른 글과의 조합 · 주목도로 고른다.",
    jsx: `<TabsList aria-label="통계">…</TabsList>                  {/* small — 기본 */}
<TabsList size="medium" aria-label="증권사">…</TabsList>`,
    render: () =>
      phone(
        stack([
          labeled("fill · small 40", tabsList({ uid: "tabs-ex-size-fs", ariaLabel: "통계", items: STATS, value: "category", panels: false })),
          labeled("fill · medium 44", tabsList({ uid: "tabs-ex-size-fm", size: "medium", ariaLabel: "통계", items: STATS, value: "category", panels: false })),
          labeled("hug · small 40", tabsList({ uid: "tabs-ex-size-hs", layout: "hug", ariaLabel: "휴가 신청", items: LEAVE, value: "mine", panels: false })),
          labeled("hug · medium 44", tabsList({ uid: "tabs-ex-size-hm", layout: "hug", size: "medium", ariaLabel: "휴가 신청", items: LEAVE, value: "mine", panels: false })),
        ]),
      ),
  },

  {
    title: "상태",
    description:
      "상태는 enabled · pressed · focused · disabled 다 — 호버 모양은 없다. 누르면 탭 전체가 2px 거리로 줄기만 한다 — 배율 (기준 − 2) ÷ 기준, 기준 max(높이, 폭 ÷ 4, 24) · 150ms 이고 모션 줄이기면 줄지 않는다. 색은 그대로다: 글자색이 이미 고름을 말하므로 누르는 동안 색이 바뀌면 손을 떼기 전에 고른 것처럼 보인다. 포커스는 키보드 포커스에만 탭 안쪽 링 2px(띄움 −2 · 각진 모서리) stroke-focus-ring 이다 — 이웃 탭 · 바닥 선에 걸리지 않고 막대 위에 그린다. 막힌 탭(disabled)은 fg-disabled · not-allowed · 축소 없음이고 화살표 이동에서 건너뛴다 — 고른 탭이 막히면(목록 전체를 막을 때) 막대도 fg-disabled 다. 알림 점은 안 고른 탭에만 있다. 정적 미리보기라 pressed · focused 는 active: · focus-visible: 클래스에서 접두어만 뗀 사본을 덧붙여 그렸다 — 축소 기준(--press-basis)은 레시피가 누르는 순간 재고, 여기서는 크기의 기본값(높이 40)이다. 첫 탭(통계)이 그 상태다.",
    jsx: `// 누름 · 포커스는 고르는 prop 이 없다 — 누르는 동안 · 키보드 포커스에 그렇게 그린다
<TabsList layout="hug" aria-label="가계부">
  <TabsTrigger value="stats">통계</TabsTrigger>
  <TabsTrigger value="budget">예산</TabsTrigger>
  <TabsTrigger value="stocks" disabled>증권</TabsTrigger>      {/* 막힌 탭 — 화살표가 건너뛴다 */}
  <TabsTrigger value="dutch" notification>더치페이</TabsTrigger> {/* 새 소식 — 한 목록에 하나 */}
</TabsList>`,
    render: () =>
      surface(
        matrix(
          STATES,
          STATE_ROWS.map(([name, selected, notification]) => [
            name,
            STATES.map((state) => {
              const uid = `tabs-ex-state-${selected ? "sel" : notification ? "dot" : "un"}-${state}`;
              return tabsList({
                uid,
                layout: "hug",
                ariaLabel: `${name} — ${state}`,
                panels: false,
                value: selected ? "stats" : "budget",
                items: [
                  { value: "stats", label: "통계", disabled: state === "disabled", notification },
                  { value: "budget", label: "예산" },
                ],
                force: { stats: state === "pressed" || state === "focused" ? state : undefined },
              });
            }),
          ]),
        ),
      ),
  },

  {
    title: "Chip Tabs — solid · outline × medium · large",
    description:
      "variant 는 둘이다 — solid(기본)는 Chip Solid(안 고름 bg-neutral-weak), outline 은 Chip Outline Strong(안 고름 투명 + 안쪽 1px stroke-neutral-weak)이고, 고르면 둘 다 짙은 채움이다(outline 은 테두리를 지운다). 화면 전체 내용을 바꾸면 solid, 일부 내용만 바꾸면 outline 이다(SEED). size 는 medium 36(기본 — 좁은 자리 · 스크롤 중간의 서브 내용) · large 40(화면 전체를 바꾸는 탭)이고 글은 둘 다 14 · 500 이다. 누름 · 호버 · 포커스 · 비활성 · 누르는 영역 44 는 Chip 과 같다. 알림 점(fg-brand)은 칩 안이라 글 뒤 6 · 세로 가운데에 두고 칩이 그만큼 넓어진다 — 고른 칩에는 그리지 않는다. 칩이 넘치면 한 줄로 가로 스크롤한다 — 미리보기의 outline 줄은 폭 360 화면을 넘는다.",
    jsx: `<ChipTabsList aria-label="나무증권 보기">                               {/* solid · medium — 기본 */}
  <ChipTabsTrigger value="holding">보유</ChipTabsTrigger>
  <ChipTabsTrigger value="watch">관심</ChipTabsTrigger>
  <ChipTabsTrigger value="discover" notification>발견</ChipTabsTrigger>
</ChipTabsList>

<ChipTabsList size="large" aria-label="나무증권 보기">…</ChipTabsList>
<ChipTabsList variant="outline" aria-label="자산 종류">…</ChipTabsList>
<ChipTabsList variant="outline" size="large" aria-label="자산 종류">…</ChipTabsList>`,
    render: () => {
      const assets = itemsOf(["계좌", "카드", "증권", "대출", "현금", "포인트"]);
      const views = VIEWS.map((v) => ({ ...v, notification: v.value === "discover" }));
      return phone(
        stack([
          labeled("solid · medium 36", chipTabsList({ uid: "tabs-ex-chip-sm", ariaLabel: "나무증권 보기", items: views, value: "holding", panels: false })),
          labeled("solid · large 40", chipTabsList({ uid: "tabs-ex-chip-sl", size: "large", ariaLabel: "나무증권 보기", items: VIEWS, value: "holding", panels: false })),
          labeled("outline · medium 36", chipTabsList({ uid: "tabs-ex-chip-om", variant: "outline", ariaLabel: "자산 종류", items: assets, value: "t1", panels: false })),
          labeled("outline · large 40", chipTabsList({ uid: "tabs-ex-chip-ol", variant: "outline", size: "large", ariaLabel: "자산 종류", items: assets, value: "t1", panels: false })),
        ], "var(--spacing-x3)"),
      );
    },
  },

  {
    title: "밀어 넘기기 · 주소",
    description:
      "폰에서 화면 전체를 바꾸는 1차 탭만 내용 칸을 TabsSwipeArea 로 감싼다 — 손가락으로 내용을 가로로 끌면 고른 칸이 손을 따라 움직이고, 칸 폭의 25% 를 넘거나 빠르게 튕기면 이웃 탭으로 넘어간다(막힌 탭은 건너뛴다). 2차 탭 · Segmented Control 에는 두지 않는다. 세로 스크롤은 그대로이고, 가로로 스크롤하는 칸 · 탭 목록 · 입력칸 · 슬라이더에서 시작한 끌기는 넘기지 않는다. 웹은 1차 탭을 주소에 남긴다 — 값은 라우터가 쥐고(replace — 탭을 오가도 방문 기록이 쌓이지 않는다) 뒤로 가기 · 링크 · 새로고침이 같은 탭을 연다. 정적 미리보기에는 스크립트가 없어 밀리지 않는다 — 짜임만 그렸다.",
    jsx: `import { useSearchParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsSwipeArea, TabsTrigger } from "@/components/ui/tabs"

const [params, setParams] = useSearchParams()
const tab = params.get("tab") ?? "category"

<Tabs value={tab} onValueChange={(v) => setParams((p) => { p.set("tab", v); return p }, { replace: true })}>
  <TabsList aria-label="통계">
    <TabsTrigger value="category">카테고리</TabsTrigger>
    <TabsTrigger value="trend">추이</TabsTrigger>
    <TabsTrigger value="compare">비교</TabsTrigger>
  </TabsList>
  <TabsSwipeArea>
    <TabsContent value="category">…</TabsContent>
    <TabsContent value="trend">…</TabsContent>
    <TabsContent value="compare">…</TabsContent>
  </TabsSwipeArea>
</Tabs>`,
    render: () => {
      const uid = "tabs-ex-swipe";
      const panels = STATS.map((it) => tabsContent({ uid, value: it.value, selected: it.value === "trend", body: it.body })).join("");
      return phone(
        `${title("통계")}${tabsRoot(`${tabsList({ uid, ariaLabel: "통계", items: STATS, value: "trend" })}<div data-slot="tabs-swipe-area" class="${SWIPE_AREA}">${panels}</div>`)}`,
      );
    },
  },
];
