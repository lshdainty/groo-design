/*
 * shadcn Chip 예제 — docs site components/chip.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 넷(하나 고르기 · 여럿 고르기 · 필터 바 · 제안 · 입력값)은 차례 · 제목 · 코드가
 * specs/components/chip.md 의 "코드" 절과 같고, 뒤의 다섯(변형 · 크기 · 상태 · 아이콘 · 묶음)은 md 의 Properties · Guidelines 를
 * 코드로 더 보인다.
 *
 * CHIP_* · GROUP_* · INPUT_CHIP_* 는 recipes/shadcn/components/ui/chip.tsx 의 cva(chipVariants · chipGroupVariants · inputChipVariants)와,
 * ICONS · ICON_SLOT · SCROLL_ROW · GROUP_RING · REMOVE 는 그 파일의 상수와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 둘레의 FIELD_* · field() 는 field.tsx 의 것이다 — input-examples.mjs 의 것과 같다.
 * 규칙은 specs/components/chip.md, 수치 원본은 specs/components/chip.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 버튼 칩 <button data-slot="chip">(Chip — 고르면 data-selected), 여럿 고르기 칩
 * <button role="checkbox" data-slot="chip">(ChipToggle — Radix Checkbox.Root), 하나 고르기 칩 <button role="radio" data-slot="chip">
 * (ChipRadio — Radix RadioGroup.Item)를 묶음 <div role="group" data-slot="chip-group">(ChipGroup) · <div role="radiogroup"
 * data-slot="chip-radio-group">(ChipRadioGroup)에 둔다. 가로 스크롤 묶음(layout="scroll")은 두 겹이다 — 바깥 묶음(이름 · 링 · bleed) 안의
 * 스크롤 칸 <div data-slot="chip-scroll-row" data-scroll-fog="row"> 에 칩이 든다 — 칸의 양 끝은 늘 흐린다(Scroll Fog row 좌우 20). 레시피(useScrollFog)는
 * 그릴 때 토큰 --gradient-fade-mask 에 방향을 붙여 칸의 style(mask-*) · data-fog-axis="x" 로 넣는다 — 정적 HTML 은 같은 일을 빌드 때 DESIGN.md 의
 * 토큰 값으로 해 style 에 적었다(SOLID · fogStyle 은 scroll-fog.tsx 와 같은 셈). 체크박스 · 라디오 칩의 고름은 data-state="checked" 다. 앞 · 뒤 아이콘은
 * <span data-slot="chip-prefix-icon | chip-suffix-icon">, 입력값 칩은 알약 <span data-slot="input-chip"> > 글 <span data-slot="input-chip-label">
 * + 지우기 <button data-slot="input-chip-remove"> 다.
 * chip.tsx 는 cva 결과를 cn() 에 한 번 더 넣지만 지워지는 클래스가 없다 — 같은 속성을 다시 쓰는 클래스는 hover: · active: · disabled: ·
 * [&:is([data-state=checked],[data-selected])]: 같은 접두어가 갈라 둔다. 그래서 그대로 잇고, 강제 상태를 덧붙일 때만 merge() 로 합친다.
 * Radix 가 실행 중에 붙이는 것 중 라디오 칩의 tabindex(로빙 포커스 — Tab 은 고른 칩 하나에만 선다)만 그리고, 라디오 묶음
 * (RadioGroup.Root)의 tabindex · dir · style 은 그리지 않는다. 이름은 Field 의 라벨(aria-labelledby — useFieldGroup) 또는 aria-label 이다.
 * id 는 레시피의 useId 자리다 — 예제마다 앞말을 달리해 한 페이지에서 겹치지 않게 한다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 * 레시피의 스크립트(Radix 의 고르기 · 화살표로 옮기기, 누르는 순간 --press-basis 재기, 지운 뒤 포커스 옮기기)는 정적 HTML 에 없다 —
 * 칩에 마우스를 올리거나 누르면 바탕 · 축소는 레시피 그대로 바뀌지만 고른 상태는 그대로이고, 지우기를 눌러도 칩이 그대로다.
 */

import { readFileSync } from "node:fs";

// ── chip.tsx 의 cva 와 같은 값 ───────────────────────────────────────────

// 칩(chipVariants) — 알약 · 글 14 · 500 · 아이콘 ↔ 글 6, 누르는 영역 44(::before), 바탕 · 글자 · 테두리 · 축소 모션, 누름 축소,
// 키보드 포커스 링, 비활성(고른 채 막히면 짙은 1px 를 남긴다)
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

// 변형 — 안 고름 · 고름의 바탕 · 글자 · 테두리, 호버 · 누름 바탕. 고름은 [&:is([data-state=checked],[data-selected])] 한 규칙이다
const CHIP_VARIANTS = {
  variant: {
    solid: [
      "bg-bg-neutral-weak-alpha text-fg-neutral hover:bg-bg-neutral-weak-alpha-pressed active:bg-bg-neutral-weak-alpha-pressed",
      // 막혀도 안 고른 Solid 는 바탕 그대로 — 글 · 아이콘만 fg-disabled(bg-disabled 는 회색 바닥과 같은 색, 사용자 결정 2026-10-17 — 03-B 결정 1 A)
      "[&:not([data-state=checked],[data-selected])]:disabled:bg-bg-neutral-weak-alpha",
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

// 크기 × 모양 — 최소 폭 · 좌우 여백, 아이콘만 있으면 원 + 아이콘 14 · 16 · 16
const CHIP_COMPOUND = [
  { size: "small", layout: "withText", className: "min-w-11 px-x3" },
  { size: "medium", layout: "withText", className: "min-w-12 px-x3_5" },
  { size: "large", layout: "withText", className: "min-w-13 px-x4" },
  { size: "small", layout: "iconOnly", className: "w-8 px-0 [&>svg]:size-3.5" },
  { size: "medium", layout: "iconOnly", className: "w-9 px-0 [&>svg]:size-4" },
  { size: "large", layout: "iconOnly", className: "w-10 px-0 [&>svg]:size-4" },
];

const CHIP_DEFAULTS = { variant: "outlineWeak", size: "medium", layout: "withText" };

// 바깥 묶음(chipGroupVariants) — wrap 은 칩을 바로 담아 줄바꿈한다(칩 사이 · 줄 사이 8). scroll 은 안쪽 스크롤 칸(SCROLL_ROW)을 담는다.
// 비었을 때만 칩 한 줄(medium 36) 높이를 남긴다 — 입력값을 다 지우면 묶음이 포커스를 받으므로 링이 납작한 선이 되지 않게
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

// bleed — scroll 줄을 부모의 화면 여백 밖(화면 끝)까지 낸다
const GROUP_COMPOUND = [{ layout: "scroll", bleed: true, className: "-mx-global-gutter" }];

const GROUP_DEFAULTS = { layout: "wrap", bleed: false };

// 입력값 칩(inputChipVariants) — 누르지 않는 알약. Outline Weak 의 고른 모습, 막히면 회색 바탕 + 짙은 1px stroke-neutral-solid,
// 지우기에 키보드 포커스가 있으면 칩 둘레에 링
const INPUT_CHIP_BASE = [
  "relative inline-flex shrink-0 items-center justify-center gap-x1_5 whitespace-nowrap rounded-full font-sans text-t4 font-medium",
  "bg-bg-neutral-weak text-fg-neutral shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-contrast)]",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),color_var(--motion-duration-color-transition)_var(--motion-ease-easing),box-shadow_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "data-[disabled]:bg-bg-disabled data-[disabled]:text-fg-disabled data-[disabled]:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-solid)]",
  "has-[[data-slot=input-chip-remove]:focus-visible]:outline-2 has-[[data-slot=input-chip-remove]:focus-visible]:outline-offset-2 has-[[data-slot=input-chip-remove]:focus-visible]:outline-stroke-focus-ring",
].join(" ");

const INPUT_CHIP_VARIANTS = {
  size: {
    small: "h-8 min-w-11 px-x3",
    medium: "h-9 min-w-12 px-x3_5",
    large: "h-10 min-w-13 px-x4",
  },
};

const INPUT_CHIP_DEFAULTS = { size: "medium" };

// ── chip.tsx 의 상수 · JSX 에 적힌 클래스 ─────────────────────────────────

// 아이콘 — 앞 14 · 16 · 16, 뒤 14 · 14 · 16(medium 만 앞 ≠ 뒤), 지우기 14 · 14 · 16. 앞 · 뒤는 cn(ICON_SLOT, ICONS[size].prefix | suffix)
const ICONS = {
  small: { prefix: "[&>svg]:size-3.5", suffix: "[&>svg]:size-3.5", remove: "size-3.5" },
  medium: { prefix: "[&>svg]:size-4", suffix: "[&>svg]:size-3.5", remove: "size-3.5" },
  large: { prefix: "[&>svg]:size-4", suffix: "[&>svg]:size-4", remove: "size-4" },
};
const ICON_SLOT = "flex shrink-0 items-center justify-center";

// 입력값 칩의 지우기 — cn(REMOVE, ICONS[size].remove). 보이는 아이콘 14 · 14 · 16(글자색 그대로), 누르는 영역은 ::before 로 24,
// 누르면 지우기만 준다(기준 24). 키보드 링은 칩(InputChip)이 그린다
const REMOVE = [
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-current outline-none",
  "[&>svg]:pointer-events-none [&>svg]:size-full",
  "before:absolute before:left-1/2 before:top-1/2 before:size-6 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[--press-basis:24] [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "disabled:cursor-not-allowed disabled:[scale:1]",
].join(" ");

// 안쪽 스크롤 칸(chip.yaml scrollRow) — 한 줄 · 칩 사이 8, 안쪽 좌우 화면 여백 · 위아래 6 을 두고 바깥 −6 으로 되돌린다(줄 높이 = 칩).
// −6 이 바깥 묶음의 margin 과 상쇄되는 두 겹이라 부모의 위아래 간격(space-y · gap)이 지워지지 않는다
const SCROLL_ROW =
  "relative -my-x1_5 flex flex-nowrap gap-between-chips overflow-x-auto px-global-gutter py-x1_5 scroll-px-global-gutter [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

// 묶음의 키보드 링 — ChipGroup 은 cn(chipGroupVariants({ layout, bleed }), GROUP_RING, className). 입력값 칩을 다 지우면 묶음이 포커스를 받는다
const GROUP_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring";

// ── field.tsx 의 클래스 — 묶음을 감싸는 둘레 ───────────────────────────

const FIELD_ROOT = "flex w-full min-w-0 flex-col gap-x2";
const FIELD_HEADER = "flex items-center justify-between gap-x2_5 px-x0_5";
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
// 사이트의 `* { scrollbar-width: thin }`(얇은 스크롤바)도 층 밖 규칙이라 스크롤 칸의 [scrollbar-width:none] 을 이긴다 —
// 넘친 줄 아래에 스크롤바가 생긴다. 스크롤 칸에는 style 로 한 번 더 숨긴다(레시피에는 없는 미리보기용 덧칠)
const SCROLL_FIX = "scrollbar-width:none;";

// ── 끝 흐림 — scroll-fog.tsx 의 useScrollFog 와 같은 셈(row · 가로) ─────────────────

// 토큰 값 — 레시피는 그릴 때 getComputedStyle 로 읽는다. 정적 HTML 은 DESIGN.md 의 v104 표에서 읽는다
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

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다.
// 참 · 거짓 축(bleed)은 cva 처럼 "true" · "false" 글자 키로 찾고, compound 는 값 그대로 견준다
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

const chipVariants = cvaOf(CHIP_BASE, { variants: CHIP_VARIANTS, compoundVariants: CHIP_COMPOUND, defaultVariants: CHIP_DEFAULTS });
const chipGroupVariants = cvaOf(GROUP_BASE, { variants: GROUP_VARIANTS, compoundVariants: GROUP_COMPOUND, defaultVariants: GROUP_DEFAULTS });
const inputChipVariants = cvaOf(INPUT_CHIP_BASE, { variants: INPUT_CHIP_VARIANTS, defaultVariants: INPUT_CHIP_DEFAULTS });

// "[&:is([data-state=checked],[data-selected])]:hover:bg-x" → ["[&:is([data-state=checked],[data-selected])]", "hover", "bg-x"] —
// 괄호 안의 ":" 는 가르지 않는다
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

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다. 이 파일이 덧붙이는 강제 상태에 나오는 무리만 안다 —
// 바탕 · 임의 속성([prop:…]). 그래서 호버 · 누름의 바탕이 같은 접두어(없음 · 고름)의 바탕을 지운다
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

// 정적 미리보기에서 호버 · 누름 · 포커스를 보이려고 — 그 상태의 클래스(hover: · active: · focus-visible: · has-[…]:)에서 접두어만 뗀
// 사본을 뒤에 붙인다(merge 가 겹치는 기본값을 지운다). 값은 레시피 그대로라 chip.tsx 가 바뀌면 같이 따라간다
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

// 칩의 강제 상태 — 호버(웹) · 누름 · 키보드 포커스
const FORCE = { hovered: "hover", pressed: "active", focused: "focus-visible" };
const withState = (classList, force) => (force && FORCE[force] ? pressed(classList, FORCE[force]) : classList);

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const join = (...ids) => ids.filter(Boolean).join(" ") || undefined;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// 글자 수 — field.tsx 처럼 자소(grapheme) 단위로 센다
const segmenter = new Intl.Segmenter("ko", { granularity: "grapheme" });
const countGraphemes = (value) => Array.from(segmenter.segment(value)).length;

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기는 감싼 자리의 [&>svg]:size-* 나 class 가 정한다
const svg = (paths, { cls = "" } = {}) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ""} aria-hidden="true">${paths}</svg>`;

const PATHS = {
  circleAlert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  rotateCcw: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  arrowUpRight: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  arrowDownLeft: '<path d="M17 7 7 17"/><path d="M17 17H7V7"/>',
  arrowLeftRight: '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
};

// 칩에 넣는 아이콘 — 여는 칩 chevron-down · 입력값 지우기 x · 필터 지우기 rotate-ccw(chip.md "SEED 와 다른 점")
const LUCIDE = Object.fromEntries(Object.entries(PATHS).map(([name, paths]) => [name, svg(paths)]));

// <Field> — field.tsx 그대로(input-examples.mjs 의 것과 같다). id 는 레시피의 useId 자리, value 는 입력의 값(글자 수)이다.
// control(f) 는 칸의 HTML 을 돌려준다 — f 는 Field 의 문맥(useFieldGroup 이 읽는 값). group 이면 라벨이 <label for> 대신 <span id> 가 된다.
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

// useFieldGroup — 묶음이 Field 안에 있으면 라벨을 이름으로, 설명 · 오류 · 글자 수를 설명으로 잇는다. 묶음에 직접 준 값이 이긴다
function fieldGroup(props, f) {
  if (!f) return props;
  return {
    ...props,
    "aria-labelledby": props["aria-labelledby"] ?? (props["aria-label"] ? undefined : f.labelId),
    "aria-describedby": join(f.describedBy, props["aria-describedby"]),
  };
}

// 묶음 안 — scroll 은 스크롤 칸 한 겹을 더 둔다(레시피의 rowOf · ChipScrollRow). 칸의 양 끝은 늘 흐린다(useScrollFog — row 좌우 20)
const rowOf = (layout, chips) =>
  layout === "scroll"
    ? `<div data-slot="chip-scroll-row" data-scroll-fog="row" class="${SCROLL_ROW}" data-fog-axis="x" style="${fogStyle()} ${SCROLL_FIX}">${chips}</div>`
    : chips;

// 묶음의 이름 · 설명 속성
const nameAttrs = (p) => [
  p["aria-label"] && `aria-label="${esc(p["aria-label"])}"`,
  p["aria-labelledby"] && `aria-labelledby="${p["aria-labelledby"]}"`,
  p["aria-describedby"] && `aria-describedby="${p["aria-describedby"]}"`,
];

// 앞 · 뒤 아이콘 — 화면 읽기 프로그램에는 숨긴다
const prefixSlot = (size, icon) =>
  icon != null ? `<span aria-hidden="true" data-slot="chip-prefix-icon" class="${ICON_SLOT} ${ICONS[size].prefix}">${icon}</span>` : "";
const suffixSlot = (size, icon) =>
  icon != null ? `<span aria-hidden="true" data-slot="chip-suffix-icon" class="${ICON_SLOT} ${ICONS[size].suffix}">${icon}</span>` : "";

// <Chip> — chip.tsx 그대로. 버튼(type="button") — 제안 · 필터 바의 여는 칩 · 아이콘만 있는 지우기.
// selected 는 data-selected 만 단다(보이기만 한다 — aria 상태 없음). layout="iconOnly" 면 아이콘(icon)이 children 이고 이름(ariaLabel)이 있어야 한다.
// popup = 코드가 넘긴 aria-haspopup="dialog". force = "hovered" · "pressed" · "focused" — 미리보기용 강제 상태
function chip({ label, icon, variant, size, layout, selected = false, prefixIcon, suffixIcon, ariaLabel, popup = false, disabled = false, force }) {
  const s = size ?? "medium";
  // 속성 차례는 레시피의 JSX 차례다 — type · data-slot · data-selected · class → 코드가 넘긴 것(aria-label · aria-haspopup · disabled)
  const root = attrs([
    'type="button"',
    'data-slot="chip"',
    selected && 'data-selected=""',
    `class="${withState(chipVariants({ variant, size, layout }), force)}"`,
    ariaLabel && `aria-label="${esc(ariaLabel)}"`,
    popup && 'aria-haspopup="dialog"',
    disabled && "disabled",
  ]);
  const body = layout === "iconOnly" ? icon : `${prefixSlot(s, prefixIcon)}${esc(label)}${suffixSlot(s, suffixIcon)}`;
  return `<button ${root}>${body}</button>`;
}

// <ChipToggle> — chip.tsx 그대로. 칩 자체가 Radix Checkbox.Root(<button role="checkbox">)이고 글은 그 안에 있다. 고름은 data-state="checked"
function chipToggle({ label, variant, size, checked = false, disabled = false, prefixIcon, force }) {
  const root = attrs([
    'type="button"',
    'role="checkbox"',
    `aria-checked="${checked}"`,
    `data-state="${checked ? "checked" : "unchecked"}"`,
    disabled && 'data-disabled=""',
    disabled && "disabled",
    'data-slot="chip"',
    `class="${withState(chipVariants({ variant, size, layout: "withText" }), force)}"`,
  ]);
  return `<button ${root}>${prefixSlot(size ?? "medium", prefixIcon)}${esc(label)}</button>`;
}

// <ChipRadio> — chip.tsx 그대로. 칩 자체가 Radix RadioGroup.Item(<button role="radio">)이다. 고름은 data-state="checked",
// tabindex 는 Radix 의 로빙 포커스(묶음에서 Tab 이 서는 칩 하나만 0)
function chipRadio({ value, label, variant, size, checked = false, disabled = false, prefixIcon, tabbable = false }) {
  const root = attrs([
    'type="button"',
    'role="radio"',
    `aria-checked="${checked}"`,
    `data-state="${checked ? "checked" : "unchecked"}"`,
    disabled && 'data-disabled=""',
    disabled && "disabled",
    `value="${esc(value)}"`,
    'data-slot="chip"',
    `class="${chipVariants({ variant, size, layout: "withText" })}"`,
    `tabindex="${tabbable ? 0 : -1}"`,
  ]);
  return `<button ${root}>${prefixSlot(size ?? "medium", prefixIcon)}${esc(label)}</button>`;
}

// <ChipRadioGroup> — Radix RadioGroup.Root(role="radiogroup"). 고른 값(value)과 같은 칩 하나만 고른 상태이고, 묶음을 막으면(disabled)
// 모든 칩이 막힌다. 배치는 ChipGroup 과 같은 cva(scroll 이면 radiogroup 안에 스크롤 칸). f 는 Field 의 문맥(useFieldGroup).
// items = [{ value, label, prefixIcon?, disabled? }]
function chipRadioGroup({ f, items, value, variant, size, layout, bleed, ariaLabel, disabled = false }) {
  const p = fieldGroup({ "aria-label": ariaLabel }, f);
  const open = items.filter((it) => !disabled && !it.disabled);
  const stop = open.find((it) => it.value === value) ?? open[0];
  const root = attrs([
    'role="radiogroup"',
    disabled && 'data-disabled=""',
    'data-slot="chip-radio-group"',
    `class="${chipGroupVariants({ layout, bleed })}"`,
    ...nameAttrs(p),
  ]);
  const chips = items.map((it) =>
    chipRadio({ ...it, variant, size, checked: it.value === value, disabled: disabled || !!it.disabled, tabbable: it === stop }),
  );
  return `<div ${root}>${rowOf(layout, chips.join(""))}</div>`;
}

// <ChipGroup> — chip.tsx 그대로. role="group" · tabindex="-1"(입력값 칩을 다 지우면 묶음이 포커스를 받는다).
// 이름은 Field 의 라벨(useFieldGroup) 또는 aria-label. children 은 칩 HTML 목록이다. force = "focused" — 미리보기용 키보드 포커스
function chipGroup({ f, layout, bleed, ariaLabel, children, force }) {
  const p = fieldGroup({ "aria-label": ariaLabel }, f);
  const root = attrs([
    'role="group"',
    'tabindex="-1"',
    'data-slot="chip-group"',
    `class="${withState(`${chipGroupVariants({ layout, bleed })} ${GROUP_RING}`, force)}"`,
    ...nameAttrs(p),
  ]);
  return `<div ${root}>${rowOf(layout, children.filter(Boolean).join(""))}</div>`;
}

// <InputChip> — chip.tsx 그대로. 누르지 않는 알약 <span> + 글 + 지우기 <button>. 지우기 이름은 "{글} 지우기".
// uid 는 레시피의 useId 자리(글 id 의 앞말). force = "pressed"(지우기만 준다) · "focused"(지우기에 키보드 포커스 — 링은 칩 둘레)
function inputChip({ uid, label, size, prefixIcon, disabled = false, force }) {
  const s = size ?? "medium";
  let rootClass = inputChipVariants({ size: s });
  let removeClass = `${REMOVE} ${ICONS[s].remove}`;
  if (force === "focused") rootClass = pressed(rootClass, "has-[[data-slot=input-chip-remove]:focus-visible]");
  if (force === "pressed") removeClass = pressed(removeClass, "active");
  const root = attrs(['data-slot="input-chip"', disabled && 'data-disabled=""', `class="${rootClass}"`]);
  const remove = attrs([
    'type="button"',
    'data-slot="input-chip-remove"',
    `aria-label="${esc(`${label} 지우기`)}"`,
    disabled && "disabled",
    `class="${removeClass}"`,
  ]);
  return `<span ${root}>${prefixSlot(s, prefixIcon)}<span id="${uid}-label" data-slot="input-chip-label">${esc(label)}</span><button ${remove}>${LUCIDE.x}</button></span>`;
}

// 미리보기는 흰 표면(bg-layer-default) 위에 그린다 — 폼 · 시트 안의 모습. Solid 의 바탕은 투명한 bg-neutral-weak-alpha(v120)라
// 회색 바닥(bg-layer-basement) 위에서도 보인다(chip.md "Solid 는 어느 바탕에서나")
const SURFACE =
  "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-x6);";
const surface = (html) => `<div style="${SURFACE}">${html}</div>`;
// 폰 화면처럼 — 폭 360 · 좌우 24(global-gutter)
const SCREEN =
  "max-width:360px; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-global-gutter);";
const screen = (html) => `<div style="${SCREEN}">${html}</div>`;
// 폼 · 묶음 사이 24(field.yaml form)
const stack = (items, gap = "var(--spacing-x6)") => `<div style="display:flex; flex-direction:column; gap:${gap};">${items.join("")}</div>`;
// 나란히 — 칸 사이 16 · 줄 사이 24, 좁으면 한 줄에 하나
const grid = (items, min = 220) =>
  `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(${min}px, 1fr)); gap:var(--spacing-x6) var(--spacing-x4); align-items:start;">${items.join("")}</div>`;
// 칩을 견주는 줄 — 칩 사이 8(between-chips). 레시피의 묶음이 아닌 미리보기 틀이다
const row = (items) => `<div style="display:flex; flex-wrap:wrap; align-items:center; gap:var(--spacing-between-chips);">${items.join("")}</div>`;
const CAPTION =
  "font-size:var(--text-t2); line-height:var(--text-t2--line-height); font-weight:400; color:var(--color-fg-neutral-subtle);";
// 크기 · 상태 · 변형 이름처럼 코드로 쓰는 이름표
const CODE = `${CAPTION} font-family:ui-monospace, SFMono-Regular, Menlo, monospace;`;
const code = (text) => `<span style="${CODE}">${text}</span>`;
// 아래 이름표
const labeled = (html, caption, style = CODE) =>
  `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2); min-width:0;">${html}<span style="${style}">${caption}</span></div>`;
// 견주는 표 — 맨 위에 칸 이름, 줄마다 이름표를 칸들 위 한 줄에 둔다(미리보기 폭 600 안에 다섯 칸이 들어가게).
// rows = [[이름표, 칸 HTML 목록]]. 좁으면 가로로 스크롤한다 — 안쪽 6 은 포커스 링이 잘리지 않게
const matrix = (columns, rows) =>
  `<div style="overflow-x:auto; padding:var(--spacing-x1_5);"><div style="display:grid; grid-template-columns:repeat(${columns.length}, max-content); gap:var(--spacing-x2) var(--spacing-x4); align-items:center; justify-items:start;">${[
    ...columns.map(code),
    ...rows.flatMap(([name, cells]) => [`<div style="grid-column:1 / -1; padding-top:var(--spacing-x3);">${code(name)}</div>`, ...cells]),
  ].join("")}</div></div>`;

// ── 화면 예시의 값 ────────────────────────────────────────────────────────

// 거래 종류 — 하나 고르기(고른 값이 곧 화면의 갈래라 Outline Strong)
const TX_TYPES = [
  { value: "expense", label: "지출", prefixIcon: LUCIDE.arrowUpRight },
  { value: "income", label: "수입", prefixIcon: LUCIDE.arrowDownLeft },
  { value: "transfer", label: "이체", prefixIcon: LUCIDE.arrowLeftRight },
];
const plain = (items) => items.map(({ prefixIcon, ...it }) => it);

// 일정 알림 — 여럿 고르기
const ALARMS = ["당일", "1일 전", "3일 전", "1주 전"];

// 가계부 거르기의 카테고리 — 시트 안 여럿 고르기 · 필터 바의 값 요약
const CATEGORIES = ["식비", "카페", "교통", "쇼핑", "문화", "의료", "주거", "통신"];
const PICKED = ["식비", "카페", "교통"];
// 여럿을 한 칩에 — "첫 값 외 N개"(외 = 앞의 값을 뺀 수)
const summarize = (labels) => (labels.length <= 1 ? (labels[0] ?? "") : `${labels[0]} 외 ${labels.length - 1}개`);

// 예산 빠른 금액 — 누르면 금액이 그 값으로 바뀐다(더하지 않는다)
const AMOUNTS = [100000, 300000, 500000];
const formatMan = (v) => `${v / 10000}만`;

// 더치페이 참여자 — 입력값
const PEOPLE = [
  { id: "minji", name: "김민지" },
  { id: "seojun", name: "박서준" },
  { id: "doyun", name: "이도윤" },
];

// 필터 바의 칩 — 조건마다 여는 칩(Solid · 뒤 chevron-down · aria-haspopup="dialog"). 걸린 조건이면 고른 모습 + 값 요약
const opener = (label, { selected = false, size } = {}) =>
  chip({ variant: "solid", size, selected, label, suffixIcon: LUCIDE.chevronDown, popup: true });
// 필터 지우기 — 아이콘만 있는 Outline Strong 칩(rotate-ccw · 이름 "필터 지우기"), 걸린 조건이 하나라도 있을 때만
const clearChip = (size) => chip({ variant: "outlineStrong", size, layout: "iconOnly", ariaLabel: "필터 지우기", icon: LUCIDE.rotateCcw });

// 변형 × 고름 · 상태의 줄 — [변형, 이름표, 글]
const VARIANT_ROWS = [
  ["solid", "solid", "이번 달"],
  ["outlineStrong", "outlineStrong", "지출"],
  ["outlineWeak", "outlineWeak — 기본", "식비"],
];
const STATES = ["enabled", "hovered", "pressed", "focused", "disabled"];

// ── 예제 ──────────────────────────────────────────────────────────────────

export const chipExamples = [
  {
    title: "하나 고르기",
    description:
      "하나 고르기는 라디오 묶음이다 — ChipRadioGroup(role=\"radiogroup\") 안에 ChipRadio(<button role=\"radio\">)를 둔다. 고른 칩을 다시 눌러도 풀리지 않아 늘 하나가 골라져 있다 — 폼은 기본값을 골라 두고, \"없음\" 이 답이면 \"{칸 이름} 없음\" 을 맨 앞 선택지로 둔다(거르기의 \"전체\" 도 맨 앞). ← → ↑ ↓ 로 옮기면 고르고, Tab 은 고른 칩 하나에만 선다. 묶음을 Field 안에 두면 라벨(<span>)이 묶음의 이름(aria-labelledby)이 된다. 고른 값이 곧 화면의 갈래인 거래 종류는 Outline Strong 이다 — 고르면 짙은 채움(bg-neutral-inverted · fg-neutral-inverted)에 테두리를 지운다. 고른 칩은 브랜드가 아니라 중립색이라 Desk · HR 이 같다.",
    jsx: `import { Field } from "@/components/ui/field"
import { ChipRadio, ChipRadioGroup } from "@/components/ui/chip"

<Field label="거래 종류">
  <ChipRadioGroup value={type} onValueChange={setType}>
    <ChipRadio variant="outlineStrong" value="expense">지출</ChipRadio>
    <ChipRadio variant="outlineStrong" value="income">수입</ChipRadio>
    <ChipRadio variant="outlineStrong" value="transfer">이체</ChipRadio>
  </ChipRadioGroup>
</Field>`,
    render: () =>
      screen(
        field({
          id: "chip-ex-single",
          label: "거래 종류",
          group: true,
          control: (f) => chipRadioGroup({ f, variant: "outlineStrong", items: plain(TX_TYPES), value: "expense" }),
        }),
      ),
  },

  {
    title: "여럿 고르기",
    description:
      "여럿 고르기는 체크박스다 — ChipToggle(<button role=\"checkbox\">)을 ChipGroup(role=\"group\") 안에 둔다. 다시 누르면 풀리고, 칩마다 Tab 이 선다. 기본 변형 Outline Weak 는 고르면 옅은 바탕 bg-neutral-weak 에 안쪽 1px stroke-neutral-contrast 가 들고 글자는 그대로다 — 고른 칩이 여럿 보여도 무겁지 않다. \"전체 선택\" 처럼 다른 칩을 바꾸는 칩은 두지 않는다. 몇 개까지 고를 수 있는지는 Field 설명에 적고, 꼭 골라야 하는데 비었으면 Field 의 오류로 알린다. 묶음을 Field 안에 두면 라벨이 이름, 설명이 묶음의 설명(aria-describedby)이 된다. 미리보기는 당일 · 1일 전을 고른 모습이다.",
    jsx: `import { ChipGroup, ChipToggle } from "@/components/ui/chip"

<Field label="알림" description="고른 때마다 알려줘요.">
  <ChipGroup>
    {["당일", "1일 전", "3일 전", "1주 전"].map((t) => (
      <ChipToggle key={t} checked={alarms.includes(t)} onCheckedChange={(on) => toggle(t, on)}>
        {t}
      </ChipToggle>
    ))}
  </ChipGroup>
</Field>`,
    render: () =>
      screen(
        field({
          id: "chip-ex-multiple",
          label: "알림",
          description: "고른 때마다 알려줘요.",
          group: true,
          control: (f) => chipGroup({ f, children: ALARMS.map((t) => chipToggle({ label: t, checked: t === "당일" || t === "1일 전" })) }),
        }),
      ),
  },

  {
    title: "필터 바",
    description:
      "목록 위 한 줄(ChipGroup layout=\"scroll\")에 조건마다 여는 칩을 하나씩 둔다 — Solid 에 뒤 아래 화살표(chevron-down) · aria-haspopup=\"dialog\" 를 달고, 누르면 그 조건만 시트(1280 미만) · 팝오버(1280 이상)로 연다. 걸린 조건의 칩은 selected 로 짙게 채우고 값을 요약한다(\"식비 외 2개\" — 첫 값 + 나머지 수, Select 의 여럿 고른 값과 같은 꼴). 하나라도 걸리면 맨 앞에 아이콘만 있는 지우기 칩(Outline Strong · rotate-ccw · 이름 \"필터 지우기\")을 둔다 — 걸린 조건 칩의 글이 곧 지금 조건이라 \"필터 2\" 같은 개수는 따로 두지 않는다. selected 는 보이기만 한다(aria-pressed 를 쓰지 않는다). 줄은 화면 끝까지 내고 안쪽 좌우 여백을 화면 여백(spacing-global-gutter)만큼 둬 스크롤해도 첫 칩이 여백에서 시작한다 — 이미 화면 여백 안에 두는 코드는 bleed 로 줄을 화면 끝까지 내고, 스크롤바는 숨긴다. 시트 · 팝오버는 그 차례의 레시피가 그린다 — 미리보기는 줄만 그렸다.",
    jsx: `import { ChevronDown, RotateCcw } from "lucide-react"
import { Chip, ChipGroup } from "@/components/ui/chip"

<ChipGroup layout="scroll" bleed aria-label="거래 거르기">
  {active > 0 && <Chip variant="outlineStrong" layout="iconOnly" aria-label="필터 지우기" onClick={reset}><RotateCcw /></Chip>}
  <Chip variant="solid" selected={!!period} suffixIcon={<ChevronDown />} aria-haspopup="dialog" onClick={() => open("period")}>
    {period ? periodLabel : "기간"}
  </Chip>
  <Chip variant="solid" selected={cats.length > 0} suffixIcon={<ChevronDown />} aria-haspopup="dialog" onClick={() => open("category")}>
    {cats.length ? summarize(cats) : "카테고리"}
  </Chip>
</ChipGroup>`,
    render: () => {
      const bar = (cats) =>
        chipGroup({
          layout: "scroll",
          bleed: true,
          ariaLabel: "거래 거르기",
          children: [
            cats.length > 0 && clearChip(),
            opener("기간"),
            opener(cats.length ? summarize(cats) : "카테고리", { selected: cats.length > 0 }),
          ],
        });
      return screen(
        stack([
          labeled(bar(PICKED), "카테고리가 걸렸다 — 맨 앞 지우기 칩 · 걸린 칩은 짙은 채움 + 값 요약", CAPTION),
          labeled(bar([]), "걸린 조건이 없다 — 지우기 칩 없음", CAPTION),
        ]),
      );
    },
  },

  {
    title: "제안 · 입력값",
    description:
      "제안 칩(빠른 금액 · 빠른 기간 · 프리셋)은 누르면 칸에 값을 넣는 Chip(Solid)이다 — 고른 모습이 없고 지금 값은 칸이 보인다. 다시 누르면 같은 값을 다시 넣는다. 입력값 칩(InputChip)은 넣은 값을 보이는 알약(버튼이 아니다 — Outline Weak 의 고른 모습)과 뒤 지우기 버튼이다. 지우기는 칩 안에서 따로 눌린다 — 이름 \"{글} 지우기\"(\"김민지 지우기\") · 아이콘 x 14(글자색 그대로) · 누르는 영역 24 × 24 이고, 누르면 지우기만 준다. 지우면 포커스가 다음 칩의 지우기(없으면 앞 칩의 지우기, 그것도 없으면 묶음)로 가므로 InputChip 은 ChipGroup 안에 둔다 — 다 지워 빈 묶음은 칩 한 줄(36) 높이를 남겨, 포커스를 받은 묶음의 링(모서리 없음)이 납작한 선이 되지 않는다(미리보기 셋째 — 키보드 포커스를 덧붙여 그렸다). Field 없이 쓰는 묶음은 aria-label 로 이름을 단다. 정적 미리보기에는 스크립트가 없어 지우기를 눌러도 칩이 그대로다.",
    jsx: `import { Chip, ChipGroup, InputChip } from "@/components/ui/chip"

<ChipGroup aria-label="빠른 금액">
  {[100000, 300000, 500000].map((v) => (
    <Chip key={v} variant="solid" onClick={() => setAmount(v)}>{formatMan(v)}</Chip>
  ))}
</ChipGroup>

<ChipGroup aria-label="참여자">
  {people.map((p) => <InputChip key={p.id} onRemove={() => removePerson(p.id)}>{p.name}</InputChip>)}
</ChipGroup>`,
    render: () =>
      screen(
        stack([
          labeled(
            chipGroup({ ariaLabel: "빠른 금액", children: AMOUNTS.map((v) => chip({ variant: "solid", label: formatMan(v) })) }),
            "빠른 금액 — 누르면 칸의 금액이 그 값으로 바뀐다 · 고른 모습 없음",
            CAPTION,
          ),
          labeled(
            chipGroup({ ariaLabel: "참여자", children: PEOPLE.map((p) => inputChip({ uid: `chip-ex-people-${p.id}`, label: p.name })) }),
            "더치페이 참여자 — 지우기로 한 명씩 뺀다",
            CAPTION,
          ),
          labeled(
            chipGroup({ ariaLabel: "참여자", children: [], force: "focused" }),
            "다 뺐다 — 포커스를 받은 빈 묶음은 칩 한 줄(36) 높이 · 링",
            CAPTION,
          ),
        ]),
      ),
  },

  {
    title: "변형 — solid · outlineStrong · outlineWeak",
    description:
      "변형은 셋이다. 안 고른 Outline Strong 과 Outline Weak 는 똑같고(투명 + 안쪽 1px stroke-neutral-weak), 고르면 갈린다 — Solid · Outline Strong 은 짙은 채움(bg-neutral-inverted · fg-neutral-inverted, Outline Strong 은 테두리를 지운다), Outline Weak 는 옅은 바탕 bg-neutral-weak + 짙은 1px stroke-neutral-contrast(글자 그대로)다. Solid 는 제안 · 필터 바, Outline Strong 은 하나 고르기를 분명하게 보일 때, Outline Weak(기본)는 고른 칩이 여럿 보이는 고르기 · 시트 안 고르기 · 입력값이다. Solid 의 옅은 바탕은 투명한 bg-neutral-weak-alpha(누름 bg-neutral-weak-alpha-pressed)라 흰 표면 · 회색 바닥(bg-layer-basement) 어디서나 보인다. 테두리는 안쪽 1px(inset shadow)이라 고르거나 풀어도 칩 크기가 변하지 않는다. 미리보기는 모습만 견주려고 Chip 의 selected(data-selected)로 그렸다 — 하나 고르기 · 여럿 고르기는 ChipRadio · ChipToggle 의 고름(data-state=\"checked\")이 같은 규칙으로 같은 모습을 단다.",
    jsx: `// 안 고름 · 고름 — 고름은 쓰임의 칩이 단다. ChipRadio · ChipToggle 은 checked(data-state="checked"),
// 필터 바의 Chip 은 selected(data-selected) — 두 표식을 한 규칙으로 칠해 모습이 같다
<Chip variant="solid">이번 달</Chip>
<Chip variant="solid" selected>이번 달</Chip>
<Chip variant="outlineStrong">지출</Chip>
<Chip variant="outlineStrong" selected>지출</Chip>
<Chip>식비</Chip>                    {/* outlineWeak — 기본 */}
<Chip selected>식비</Chip>`,
    render: () =>
      surface(
        matrix(
          ["unselected", "selected"],
          VARIANT_ROWS.map(([variant, name, label]) => [name, [chip({ variant, label }), chip({ variant, label, selected: true })]]),
        ),
      ),
  },

  {
    title: "크기 — small · medium · large",
    description:
      "small 32 · medium 36(기본) · large 40. 글은 세 크기 모두 14 · 500(t4)이고, 크기가 높이와 함께 좌우 여백(12 · 14 · 16) · 최소 폭(44 · 48 · 52) · 앞 아이콘(14 · 16 · 16) · 뒤 아이콘(14 · 14 · 16)을 정한다. 아이콘과 글 사이는 6. 아이콘만 있는 칩(layout=\"iconOnly\")은 원이다(32 · 36 · 40 정사각, 아이콘 14 · 16 · 16). 기본은 폰 폼에서도 36 이고, small 은 촘촘한 줄(1280 이상 데스크톱의 필터 · 표 위), large 는 화면의 주인공 고르기에만 쓴다. 누르는 영역은 보이는 칩과 따로 ::before 로 가로 · 세로 44 까지 넓힌다 — 글이 있는 칩은 최소 폭이 이미 44 이상이고, 아이콘만 있는 칩은 가로도 44 다.",
    jsx: `import { ChevronDown, RotateCcw, Utensils } from "lucide-react"

<ChipToggle size="small">식비</ChipToggle>
<ChipToggle size="small" prefixIcon={<Utensils />}>식비</ChipToggle>
<Chip size="small" variant="solid" suffixIcon={<ChevronDown />} aria-haspopup="dialog">카테고리</Chip>
<Chip size="small" variant="outlineStrong" layout="iconOnly" aria-label="필터 지우기"><RotateCcw /></Chip>

// medium — 기본(size 를 빼도 된다)
<ChipToggle>식비</ChipToggle>
<ChipToggle prefixIcon={<Utensils />}>식비</ChipToggle>
<Chip variant="solid" suffixIcon={<ChevronDown />} aria-haspopup="dialog">카테고리</Chip>
<Chip variant="outlineStrong" layout="iconOnly" aria-label="필터 지우기"><RotateCcw /></Chip>

<ChipToggle size="large">식비</ChipToggle>
<ChipToggle size="large" prefixIcon={<Utensils />}>식비</ChipToggle>
<Chip size="large" variant="solid" suffixIcon={<ChevronDown />} aria-haspopup="dialog">카테고리</Chip>
<Chip size="large" variant="outlineStrong" layout="iconOnly" aria-label="필터 지우기"><RotateCcw /></Chip>`,
    render: () =>
      surface(
        stack(
          [
            ["small", "small · 32"],
            ["medium", "medium · 36 — 기본"],
            ["large", "large · 40"],
          ].map(([size, caption]) =>
            labeled(
              row([
                chipToggle({ size, label: "식비" }),
                chipToggle({ size, label: "식비", prefixIcon: LUCIDE.utensils }),
                opener("카테고리", { size }),
                clearChip(size),
              ]),
              caption,
            ),
          ),
          "var(--spacing-x5)",
        ),
      ),
  },

  {
    title: "상태",
    description:
      "상태는 enabled · hovered · pressed · focused · disabled 다. 호버(웹 — 마우스 있는 기기에서만)는 누름과 같은 바탕이고 축소가 없다. 누르면 누름 바탕(Solid bg-neutral-weak-alpha-pressed · Outline bg-layer-default-pressed · 고른 Outline Weak bg-neutral-weak-pressed · 짙은 채움 bg-neutral-inverted-pressed)에 칩 전체가 2px 거리로 준다 — 배율은 (기준 − 2) ÷ 기준, 기준은 max(높이, 폭 ÷ 4, 24) 이고 모션 줄이기면 줄지 않는다. 포커스는 키보드 포커스에만 바깥 링 2px · 띄움 2px stroke-focus-ring 이다. 비활성은 바탕 bg-disabled · 글자 fg-disabled 이고 흐리게(불투명도) 그리지 않는다 — 안 고른 Solid 는 바탕 bg-neutral-weak-alpha 를 그대로 두고 글만 fg-disabled(회색 바닥 위에서도 알약이 보인다), 고른 채 막히면 안쪽 1px stroke-neutral-solid 를 남겨 무엇을 골랐는지 보인다. 하나 고르기는 ChipRadioGroup 에 disabled 를 주면 모든 칩이 막히고, 여럿 고르기 · 버튼 칩은 칩마다 준다. 입력값 칩은 누르지 않는다 — 호버 바탕이 없고 누름은 지우기만 준다(기준 24), 지우기에 키보드 포커스가 있으면 링은 칩 둘레에 그린다. 정적 미리보기라 hovered · pressed · focused 는 hover: · active: · focus-visible: · has-[…:focus-visible]: 클래스에서 접두어만 뗀 사본을 덧붙여 그렸다 — 축소 기준(--press-basis)은 레시피가 누르는 순간 재고, 여기서는 크기의 기본값(높이 36)이다.",
    jsx: `// 호버 · 누름 · 포커스는 고르는 prop 이 없다 — 마우스를 올린 동안 · 누르는 동안 · 키보드 포커스에 그렇게 그린다
<Chip variant="solid">식비</Chip>                     // enabled · hovered · pressed · focused
<Chip variant="solid" selected>식비</Chip>
<Chip variant="solid" disabled>식비</Chip>            // disabled
<Chip variant="solid" selected disabled>식비</Chip>   // 고른 채 막힘 — 안쪽 1px stroke-neutral-solid
// outlineStrong · outlineWeak 도 같다

// 하나 고르기는 묶음째, 여럿 고르기는 칩마다 막는다
<ChipRadioGroup value="expense" disabled aria-label="거래 종류">…</ChipRadioGroup>
<ChipToggle checked disabled>식비</ChipToggle>

// 입력값 — 누름은 지우기만, 키보드 링은 칩 둘레
<InputChip onRemove={() => removePerson("minji")}>김민지</InputChip>
<InputChip onRemove={() => removePerson("minji")} disabled>김민지</InputChip>`,
    render: () => {
      const chipCell = (variant, selected, state) =>
        chip({ variant, label: "식비", selected, disabled: state === "disabled", force: state });
      const rows = VARIANT_ROWS.flatMap(([variant, name]) =>
        [false, true].map((selected) => [
          selected ? `${variant} · selected` : name,
          STATES.map((state) => chipCell(variant, selected, state)),
        ]),
      );
      // 입력값 칩 — 호버는 바탕이 없어 enabled 와 같다
      const input = [
        "InputChip — 누름은 지우기만 · 링은 칩 둘레",
        STATES.map((state) =>
          inputChip({
            uid: `chip-ex-state-${state}`,
            label: "김민지",
            disabled: state === "disabled",
            force: state === "pressed" || state === "focused" ? state : undefined,
          }),
        ),
      ];
      return surface(matrix(STATES, [...rows, input]));
    },
  },

  {
    title: "아이콘 — 앞 · 뒤 · 아이콘만",
    description:
      "앞 아이콘(prefixIcon — 14 · 16 · 16)은 없어도 되고, 한 묶음 안에서 모두 두거나 모두 뺀다. 뒤 아이콘(suffixIcon — 14 · 14 · 16)은 누르면 고르는 자리를 여는 칩의 아래 화살표(chevron-down)에만 쓴다. 아이콘만 있는 칩(layout=\"iconOnly\" · 아이콘을 children 으로)은 원이고 이름(aria-label)이 꼭 있어야 한다 — 레시피는 이름이 없으면 개발 중에 경고한다. 아이콘은 lucide 선 아이콘이고 화면 읽기 프로그램에는 숨긴다(aria-hidden) — 뜻은 글 · 이름이 알린다.",
    jsx: `import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, ChevronDown, RotateCcw } from "lucide-react"

// 앞 아이콘 — 묶음 안에서 모두 두거나 모두 뺀다
<ChipRadioGroup value={type} onValueChange={setType} aria-label="거래 종류">
  <ChipRadio variant="outlineStrong" value="expense" prefixIcon={<ArrowUpRight />}>지출</ChipRadio>
  <ChipRadio variant="outlineStrong" value="income" prefixIcon={<ArrowDownLeft />}>수입</ChipRadio>
  <ChipRadio variant="outlineStrong" value="transfer" prefixIcon={<ArrowLeftRight />}>이체</ChipRadio>
</ChipRadioGroup>

// 뒤 아이콘 — 누르면 고르는 자리를 여는 칩에만
<Chip variant="solid" suffixIcon={<ChevronDown />} aria-haspopup="dialog" onClick={() => open("period")}>기간</Chip>

// 아이콘만 — 원, 이름(aria-label)이 꼭 있어야 한다
<Chip variant="outlineStrong" layout="iconOnly" aria-label="필터 지우기" onClick={reset}><RotateCcw /></Chip>`,
    render: () =>
      surface(
        grid(
          [
            labeled(
              chipRadioGroup({ ariaLabel: "거래 종류", variant: "outlineStrong", items: TX_TYPES, value: "expense" }),
              "prefixIcon — 묶음 안에서 모두 두거나 모두 뺀다",
              CAPTION,
            ),
            labeled(row([opener("기간")]), "suffixIcon — 여는 칩의 chevron-down", CAPTION),
            labeled(row([clearChip()]), "layout=\"iconOnly\" — 원 · aria-label 필수", CAPTION),
          ],
          150,
        ),
      ),
  },

  {
    title: "묶음 — 줄바꿈 · 가로 스크롤",
    description:
      "칩 사이는 8(spacing-between-chips)이다. 폼 · 시트 안의 고르기 묶음은 줄바꿈한다(layout=\"wrap\" — 기본, 줄 사이도 8). 목록 위 필터 바 · 제안 줄은 한 줄 가로 스크롤로 둔다(layout=\"scroll\") — 두 겹이다. 바깥 묶음(이름 · 키보드 링 · bleed) 안의 스크롤 칸(data-slot=\"chip-scroll-row\")이 칩을 한 줄로 담고 안쪽 좌우 여백을 화면 여백(spacing-global-gutter)만큼 둬, 스크롤해도 첫 칩이 여백에서 시작하고 키보드로 옮겨도 여백 안에 멈춘다(scroll-padding). 부모가 이미 화면 여백을 두었으면 bleed 로 줄을 화면 끝까지 낸다. 스크롤 칸은 넘친 것을 자르므로 위아래 안쪽 6 · 바깥 −6 을 둬 누르는 영역 · 포커스 링이 잘리지 않고 줄 높이는 칩 그대로다 — −6 이 바깥 묶음의 margin 과 상쇄되는 두 겹이라 부모의 위아래 간격(space-y · gap)도 그대로다. 칸의 양 끝은 늘 흐린다(Scroll Fog row — gradient-fade-mask 좌우 20, 스크롤 위치 · 넘침과 상관없이) — 안쪽 여백 24 가 흐림보다 넓어 처음 · 끝의 칩은 흐리지 않고, 흐린 자리의 칩도 그대로 눌린다. 미리보기의 아래 줄은 폭 360 화면을 넘어 가로로 스크롤된다.",
    jsx: `// 폼 · 시트 안 — 줄바꿈(기본). 칩 사이 · 줄 사이 8
<ChipGroup aria-label="카테고리">
  {categories.map((c) => (
    <ChipToggle key={c.id} checked={picked.includes(c.id)} onCheckedChange={(on) => toggle(c.id, on)}>
      {c.name}
    </ChipToggle>
  ))}
</ChipGroup>

// 목록 위 — 한 줄 가로 스크롤. 부모가 이미 화면 여백(24)을 두었으면 bleed 로 줄을 화면 끝까지 낸다
<ChipGroup layout="scroll" bleed aria-label="거래 거르기">
  <Chip variant="outlineStrong" layout="iconOnly" aria-label="필터 지우기" onClick={reset}><RotateCcw /></Chip>
  <Chip variant="solid" selected suffixIcon={<ChevronDown />} aria-haspopup="dialog" onClick={() => open("period")}>이번 달</Chip>
  <Chip variant="solid" selected suffixIcon={<ChevronDown />} aria-haspopup="dialog" onClick={() => open("category")}>식비 외 2개</Chip>
  <Chip variant="solid" suffixIcon={<ChevronDown />} aria-haspopup="dialog" onClick={() => open("pay")}>결제 수단</Chip>
</ChipGroup>`,
    render: () =>
      screen(
        stack([
          labeled(
            chipGroup({ ariaLabel: "카테고리", children: CATEGORIES.map((c) => chipToggle({ label: c, checked: PICKED.includes(c) })) }),
            "layout=\"wrap\" — 폼 · 시트 안, 칩 사이 · 줄 사이 8",
            CAPTION,
          ),
          labeled(
            chipGroup({
              layout: "scroll",
              bleed: true,
              ariaLabel: "거래 거르기",
              children: [clearChip(), opener("이번 달", { selected: true }), opener(summarize(PICKED), { selected: true }), opener("결제 수단")],
            }),
            "layout=\"scroll\" · bleed — 목록 위, 화면 끝까지 · 안쪽 여백 24",
            CAPTION,
          ),
        ]),
      ),
  },
];
