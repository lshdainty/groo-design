/*
 * shadcn Scroll Fog 예제 — docs site components/scroll-fog.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(시트 · 대화상자 본문 — 긴 목록 · 칩 줄 · 상자)은 차례 · 제목 · 코드가
 * specs/components/scroll-fog.md 의 "코드" 절과 같고, 뒤의 둘(자리마다 · 가로 상자)은 md 의 Properties 를 코드로 더 보인다.
 * 시트 · 대화상자 본문은 ResponsiveDialog 로 짠다 — 미리보기는 1280 이상의 모습(Dialog)이고, 1280 미만의 시트는 bottom-sheet 페이지에 있다.
 *
 * DEPTH · SOLID · COMPOSITE · ROOT · CONTENT 는 recipes/shadcn/components/ui/scroll-fog.tsx 의 상수와 글자 하나까지 같아야 한다 — 두 파일을
 * 함께 고친다. 마스크(fogMask · withDirection)는 그 파일의 useScrollFog 와 같은 셈이다 — 레시피는 그릴 때 토큰 --gradient-fade-mask(방향 없이
 * 위 → 아래)를 읽어 흐린 쪽마다 방향을 붙인 상자 전체 크기의 층을 만들고(단계는 그 쪽 깊이의 몫), 상자의 style(mask-image · -size · -position ·
 * -repeat 와 -webkit- 짝, 두 층을 곱하는 mask-composite: intersect · -webkit-mask-composite: source-in)과 data-fog-axis 로 넣는다. 정적 HTML 은
 * 같은 일을 빌드 때 DESIGN.md 의 토큰 값으로 해 style 에 적었다.
 * 둘레의 부품은 그 레시피의 값을 옮겨 썼다 — DIALOG_* 는 dialog.tsx(dialog-examples.mjs), LIST_* 는 list.tsx · RADIOMARK_* · DOT_* 는
 * radio-group.tsx(list-examples.mjs), CHIP_* · GROUP_* · SCROLL_ROW 는 chip.tsx(chip-examples.mjs)의 것과 같다 — 이 파일이 쓰는 변형 ·
 * 크기와 그에 걸리는 compound 만 옮겼다. 규칙은 specs/components/scroll-fog.md, 수치 원본은 specs/components/scroll-fog.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다. 상자는 실제로 스크롤된다 — 처음 · 가운데 · 끝
 * 어디서나 흐림은 그대로다(늘 켜짐).
 * 짜임은 레시피가 그리는 DOM 그대로다 — ScrollFog 는 스크롤 상자 <div data-slot="scroll-fog" data-use data-fog-axis> > 안쪽 감싸개
 * <div data-slot="scroll-fog-content">(흐린 쪽 여백 — 내용과 함께 스크롤된다). 대화상자 본문의 scrollFog 는 본문 <div data-slot="dialog-body"
 * data-scroll-fog="overlayBody" data-fog-axis="y">(여백은 본문 자신 — 위 20 · 아래 80), 칩 줄은 스크롤 칸 <div data-slot="chip-scroll-row"
 * data-scroll-fog="row" data-fog-axis="x"> 에 마스크가 걸린다. 대화상자는 화면(fixed)에 뜬다 — 미리보기 틀(STAGE)에 transform 을 줘 fixed 의
 * 기준을 틀로 바꾸고 isolation 으로 z-index 를 가둔다. 높이 상한 80dvh 는 틀 높이의 80% 로 style 에 한 번 더 적었다(DIALOG_FIT — 미리보기용 덧칠).
 * 대화상자의 넘친 본문에 Tab 이 서는 것(tabindex 0)은 레시피가 재서 단다 — 미리보기는 그 순간을 멈춰 적었다. Radix 가 실행 중에 붙이는 것 중
 * 열림(data-state) · 이름 잇기 · 라디오의 data-state 를 그리고 라디오 묶음의 tabindex · dir · style 은 그리지 않는다. 뒤 화면 · 약관 글 · 거래 줄 ·
 * 바닥 버튼 · 카드 그림은 미리보기 그림이고, 약관 <p> 의 margin:0 은 사이트의 `.content p` 여백을 지우는 미리보기용 덧칠이다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

import { readFileSync } from "node:fs";

// ── scroll-fog.tsx 의 상수와 같은 값 ───────────────────────────────────────

// 흐림 깊이(scroll-fog.yaml) — 시작 쪽(위 · 왼쪽) · 끝 쪽(아래 · 오른쪽)
const DEPTH = {
  box: { start: "20px", end: "20px" },
  row: { start: "20px", end: "20px" },
  overlayBody: { start: "20px", end: "80px" },
  page: { start: "20px", end: "80px" },
};

// 꽉 찬 층 — 흐리지 않는 쪽(깊이 0). 곱해도 아무것도 가리지 않는다
const SOLID = "linear-gradient(#000, #000)";
// 겹친 층을 곱한다 — 두 층을 모두 지나야 보인다. -webkit-mask-composite 는 옛 이름만 받는다(source-in 이 intersect 와 같은 셈)
const COMPOSITE = { "mask-composite": "intersect", "-webkit-mask-composite": "source-in" };

// 스크롤 상자 — 자리마다 넘침 · 스크롤 여유. box 는 축(data-fog-axis)을 따른다
const ROOT = {
  box: "overflow-y-auto scroll-py-[20px] data-[fog-axis=x]:scroll-py-0 data-[fog-axis=x]:scroll-px-[20px]",
  row: "overflow-x-auto overflow-y-hidden scroll-px-global-gutter [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  overlayBody: "overflow-y-auto scroll-pt-[20px] scroll-pb-[80px]",
  page: "overflow-y-auto scroll-pt-[20px] scroll-pb-[80px]",
};

// 안쪽 감싸개 — 흐린 쪽에 깊이 이상의 여백(내용과 함께 스크롤된다). 가로면 내용 폭만큼 넓어져 끝 여백이 내용 끝에 붙는다
const CONTENT = {
  box: "py-[20px] group-data-[fog-axis=x]/scroll-fog:w-max group-data-[fog-axis=x]/scroll-fog:min-w-full group-data-[fog-axis=x]/scroll-fog:px-[20px] group-data-[fog-axis=x]/scroll-fog:py-0",
  row: "w-max min-w-full px-global-gutter",
  overlayBody: "pb-[80px] pt-[20px]",
  page: "pb-[80px] pt-[20px]",
};

// ── scroll-fog.tsx 의 셈(useScrollFog) — 토큰에 방향을 붙인 마스크 ──────────

// 토큰 값 — 레시피는 그릴 때 getComputedStyle 로 읽는다. 정적 HTML 은 DESIGN.md 의 v104 표에서 읽는다
const FADE_MASK = /`gradient-fade-mask` \| `(linear-gradient\([^`]+\))`/.exec(readFileSync(new URL("../../../DESIGN.md", import.meta.url), "utf8"))[1];

// 방향 없이 적힌(위 → 아래) 그라디언트 토큰에 방향을 붙인다
const withDirection = (token, direction) => token.replace(/^linear-gradient\(/, `linear-gradient(${direction}, `);

// 한 축의 마스크 — 흐린 쪽마다 상자 전체 크기의 층 하나(시작 쪽은 투명 → 불투명, 끝 쪽은 반대 방향). 단계는 그 쪽 깊이의 몫이라
// 깊이 안에서 불투명에 닿는다. 두 층은 COMPOSITE 로 곱한다
function fogMask(token, axis, start, end) {
  const from = axis === "y" ? "to bottom" : "to right";
  const to = axis === "y" ? "to top" : "to left";
  const layers = [start, end].map((depth, i) =>
    parseFloat(depth) > 0 ? withDirection(token.replace(/(\d+(?:\.\d+)?)%/g, (_m, p) => `calc(${depth} * ${Number(p) / 100})`), i === 0 ? from : to) : SOLID,
  );
  return { image: layers.join(", "), size: "100% 100%, 100% 100%", position: "0 0, 0 0" };
}

// useScrollFog 가 상자의 style 에 넣는 값 — mask-* 와 -webkit-mask-* 를 같이, 그리고 COMPOSITE
function fogStyle(use, axis) {
  const { start, end } = DEPTH[use];
  const mask = { ...fogMask(FADE_MASK, axis, start, end), repeat: "no-repeat" };
  return [
    ...["image", "size", "position", "repeat"].map((p) => `mask-${p}:${mask[p]}; -webkit-mask-${p}:${mask[p]};`),
    ...Object.entries(COMPOSITE).map(([p, v]) => `${p}:${v};`),
  ].join(" ");
}

// ── dialog.tsx 의 상수 · JSX 클래스와 같은 값 ─────────────────────────────

const DIALOG_OVERLAY = [
  "fixed inset-0 z-(--z-modal) bg-[var(--overlay-dim-light)] dark:bg-[var(--overlay-dim-dark)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-[var(--motion-duration-d2)] data-[state=open]:ease-[var(--motion-ease-enter)]",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-[var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)]",
].join(" ");
const DIALOG_CONTENT = [
  "fixed left-1/2 top-1/2 z-(--z-modal-content) flex max-h-[80dvh] max-w-[calc(100%-var(--spacing-x5)*2)] -translate-x-1/2 -translate-y-1/2 flex-col",
  "overflow-hidden rounded-r5 bg-bg-layer-floating font-sans text-fg-neutral outline-none",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0",
  "motion-safe:data-[state=open]:zoom-in-130 motion-safe:data-[state=open]:duration-[var(--motion-duration-d4)] motion-safe:data-[state=open]:ease-[var(--motion-ease-enter-expressive)]",
  "motion-reduce:data-[state=open]:duration-[var(--motion-duration-d3)] motion-reduce:data-[state=open]:ease-[var(--motion-ease-enter)]",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-[var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)]",
].join(" ");
const DIALOG_SIZE = { medium: "w-[480px]", large: "w-[800px]" };
const DIALOG_HEADER = [
  "flex shrink-0 flex-col gap-x1_5 px-x6 pb-x4 pt-x6",
  "[transition:box-shadow_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[&:has(~[data-slot=dialog-body][data-scrolled])]:shadow-[inset_0_-1px_0_0_var(--color-stroke-neutral-subtle)]",
].join(" ");
const DIALOG_HEADER_WITH_CLOSE = "pr-x13";
const DIALOG_TITLE = "m-0 text-t8 font-bold text-fg-neutral";
const DIALOG_CLOSE = [
  "absolute right-[calc(var(--spacing-x6)-15px)] top-[calc(var(--spacing-x7)-15px)] flex size-13 cursor-pointer items-center justify-center",
  "rounded-r3 border-0 bg-transparent p-0 text-fg-neutral-subtle [&>svg]:size-[22px]",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "hover:bg-bg-layer-floating-pressed active:bg-bg-layer-floating-pressed [--press-basis:52] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
const DIALOG_BODY = [
  "min-h-0 flex-1 overflow-y-auto overscroll-contain px-x6 first:pt-x6",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
// 끝 흐림(scrollFog) — 본문 안 여백 위 20(머리가 없으면 24 그대로) · 아래 80(바닥이 있어도), 스크롤 여유도 위 20 · 아래 80
const DIALOG_BODY_FOG = "pt-[20px] pb-[80px] scroll-pt-[20px] scroll-pb-[80px]";

// ── list.tsx · radio-group.tsx 의 cva 와 같은 값 — 라디오 줄(ListRadioGroup · ListRadioItem) ──

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
const LIST_CONTROL_BASE = "cursor-pointer select-none data-[disabled]:cursor-not-allowed";
const LIST_BODY_BASE = "flex min-w-[calc(1em+var(--spacing-x2_5))] flex-1 flex-col items-start gap-x0_5 pr-x2_5 text-left";
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
// 끼운 컨트롤은 따로 줄지 않는다 — 줄의 콘텐츠가 함께 준다
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
    brand:
      "data-[state=checked]:bg-bg-brand-solid data-[state=checked]:hover:bg-bg-brand-solid-pressed data-[state=checked]:active:bg-bg-brand-solid-pressed data-[state=checked]:group-hover/radio:bg-bg-brand-solid-pressed data-[state=checked]:group-active/radio:bg-bg-brand-solid-pressed",
  },
};
const RADIOMARK_DEFAULTS = { size: "medium", tone: "neutral" };
const DOT_BASE =
  "pointer-events-none block rounded-full bg-transparent [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)] data-[disabled]:data-[state=checked]:bg-fg-disabled";
const DOT_VARIANTS = {
  size: { medium: "size-2", large: "size-2.5" },
  tone: { neutral: "data-[state=checked]:bg-fg-neutral-inverted", brand: "data-[state=checked]:bg-static-white" },
};
const DOT_DEFAULTS = { size: "medium", tone: "neutral" };

// ── chip.tsx 의 cva · 상수와 같은 값 — 필터 칩 줄(outlineStrong · medium · scroll) ──

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
  size: { medium: "h-9 [--press-basis:36]" },
  layout: { withText: "", iconOnly: "" },
};
const CHIP_COMPOUND = [{ size: "medium", layout: "withText", className: "min-w-12 px-x3_5" }];
const CHIP_DEFAULTS = { variant: "outlineWeak", size: "medium", layout: "withText" };
const GROUP_BASE = "relative";
const GROUP_VARIANTS = {
  layout: {
    wrap: "flex flex-wrap gap-between-chips empty:min-h-9",
    scroll: "has-[>[data-slot=chip-scroll-row]:empty]:min-h-9",
  },
  bleed: { true: "", false: "" },
};
const GROUP_COMPOUND = [{ layout: "scroll", bleed: true, className: "-mx-global-gutter" }];
const GROUP_DEFAULTS = { layout: "wrap", bleed: false };
// 안쪽 스크롤 칸(chip.yaml scrollRow) — 양 끝은 늘 흐린다(Scroll Fog row — useScrollFog)
const SCROLL_ROW =
  "relative -my-x1_5 flex flex-nowrap gap-between-chips overflow-x-auto px-global-gutter py-x1_5 scroll-px-global-gutter [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
const GROUP_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring";

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

const variantKey = (v) => (typeof v === "boolean" ? String(v) : v);

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다
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

const listVariants = cvaOf(LIST_BASE);
const listItemVariants = cvaOf(LIST_ITEM_BASE, { variants: LIST_ITEM_VARIANTS, defaultVariants: LIST_ITEM_DEFAULTS });
const listContentVariants = cvaOf(LIST_CONTENT_BASE, { variants: LIST_CONTENT_VARIANTS, defaultVariants: LIST_CONTENT_DEFAULTS });
const listControlVariants = cvaOf(LIST_CONTROL_BASE);
const listBodyVariants = cvaOf(LIST_BODY_BASE);
const listTitleVariants = cvaOf(LIST_TITLE_BASE, { variants: LIST_TITLE_VARIANTS, defaultVariants: LIST_TITLE_DEFAULTS });
const listSuffixVariants = cvaOf(LIST_SUFFIX_BASE, {
  variants: LIST_SUFFIX_VARIANTS,
  compoundVariants: LIST_SUFFIX_COMPOUND,
  defaultVariants: LIST_SUFFIX_DEFAULTS,
});
const radiomarkVariants = cvaOf(RADIOMARK_BASE, { variants: RADIOMARK_VARIANTS, defaultVariants: RADIOMARK_DEFAULTS });
const radiomarkDotVariants = cvaOf(DOT_BASE, { variants: DOT_VARIANTS, defaultVariants: DOT_DEFAULTS });
const chipVariants = cvaOf(CHIP_BASE, { variants: CHIP_VARIANTS, compoundVariants: CHIP_COMPOUND, defaultVariants: CHIP_DEFAULTS });
const chipGroupVariants = cvaOf(GROUP_BASE, { variants: GROUP_VARIANTS, compoundVariants: GROUP_COMPOUND, defaultVariants: GROUP_DEFAULTS });

// "px-x6" · "px-0" 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다(cn — twMerge). 이 파일이 합치는 무리만 안다(좌우 여백)
function merge(classList) {
  const seen = new Set();
  const kept = [];
  for (const cls of classList.split(/\s+/).filter(Boolean).reverse()) {
    const m = /^(?:([\w-]+):)?(px)-/.exec(cls);
    if (m) {
      const key = `${m[1] ?? ""}|${m[2]}`;
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

// lucide-react 의 x(닫기)와 같은 모양(24 격자)
const X_ICON =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

// <ScrollFog use className> — 스크롤 상자 + 안쪽 감싸개. extra 는 상자의 다른 속성(tabindex · aria-label)
function scrollFog({ use = "box", axis, className = "", extra = [], html }) {
  const a = axis ?? (use === "row" ? "x" : "y");
  const root = attrs([
    'data-slot="scroll-fog"',
    `data-use="${use}"`,
    `class="${["group/scroll-fog relative", ROOT[use], className].filter(Boolean).join(" ")}"`,
    ...extra,
    `data-fog-axis="${a}"`,
    `style="${fogStyle(use, a)}"`,
  ]);
  return `<div ${root}><div data-slot="scroll-fog-content" class="${CONTENT[use]}">${html}</div></div>`;
}

// 미리보기 틀 — 레시피의 딤 · 대화상자는 화면(fixed)에 뜬다. transform 이 fixed 의 기준을 틀로 바꾸고 isolation 이 z-index 를 가둔다
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
  ]
    .map(([title, amount]) => `<div style="${PAGE_ROW}"><span>${title}</span><span style="font-weight:700;">${amount}</span></div>`)
    .join("")}</div></div>`;

// <ListRadioGroup> > <ListRadioItem>(라디오 24 를 뒤에) — 묶음 안의 줄은 <div>, 줄 전체가 <label for>
function radioRows({ uid, label, options, value }) {
  const rows = options.map((title, i) => {
    const id = `${uid}-radio${i}`;
    const checked = title === value;
    const state = `data-state="${checked ? "checked" : "unchecked"}"`;
    const mark = `<button type="button" role="radio" aria-checked="${checked}" ${state} value="${esc(title)}" class="${radiomarkVariants({ size: "large" })} ${MARK_NO_SCALE}" id="${id}" data-list-action=""><span ${state} class="${radiomarkDotVariants({ size: "large" })}"></span></button>`;
    return `<div class="${listItemVariants()}"><label for="${id}" data-list-action="" class="${listContentVariants()} ${listControlVariants()}"><span class="${listBodyVariants()}"><span class="${listTitleVariants()}">${esc(title)}</span></span><span class="${listSuffixVariants()}">${mark}</span></label></div>`;
  });
  return `<div role="radiogroup" class="${listVariants()}" aria-label="${esc(label)}">${rows.join("")}</div>`;
}

// <Dialog open> + <DialogContent title>(조회 · 고르기 — 머리 닫기) + <DialogBody scrollFog className="px-0">
function fogDialog({ uid, title, bodyHtml, height = 520 }) {
  const titleId = `${uid}-title`;
  const content = attrs([
    'role="dialog"',
    `id="${uid}"`,
    `aria-labelledby="${titleId}"`,
    'data-state="open"',
    'tabindex="-1"',
    'data-slot="dialog-content"',
    'data-size="medium"',
    'aria-modal="true"',
    `class="${DIALOG_CONTENT} ${DIALOG_SIZE.medium}"`,
    `style="${DIALOG_FIT(height)}"`,
  ]);
  const header = `<div data-slot="dialog-header" class="${DIALOG_HEADER} ${DIALOG_HEADER_WITH_CLOSE}"><h2 id="${titleId}" data-slot="dialog-title" class="${DIALOG_TITLE}">${esc(title)}</h2><button type="button" aria-label="닫기" data-slot="dialog-close" class="${DIALOG_CLOSE}">${X_ICON}</button></div>`;
  const body = attrs([
    'data-slot="dialog-body"',
    'data-scroll-fog="overlayBody"',
    `class="${merge(`${DIALOG_BODY} ${DIALOG_BODY_FOG} px-0`)}"`,
    'tabindex="0"',
    'data-fog-axis="y"',
    `style="${fogStyle("overlayBody", "y")}"`,
  ]);
  return `<div style="${STAGE(height)}">${page()}<div data-state="open" data-slot="dialog-overlay" class="${DIALOG_OVERLAY}"></div><div ${content}>${header}<div ${body}>${bodyHtml}</div></div></div>`;
}

// <ChipGroup layout="scroll" aria-label> > 스크롤 칸(row 흐림) > <Chip variant="outlineStrong"> — 첫 칩을 고른 필터(data-selected)
function chipRow({ label, chips, selected }) {
  const row = attrs([
    'data-slot="chip-scroll-row"',
    'data-scroll-fog="row"',
    `class="${SCROLL_ROW}"`,
    'data-fog-axis="x"',
    `style="${fogStyle("row", "x")}"`,
  ]);
  const items = chips
    .map((t) => `<button ${attrs([t === selected && 'data-selected=""', 'data-slot="chip"', `class="${chipVariants({ variant: "outlineStrong" })}"`, 'type="button"'])}>${esc(t)}</button>`)
    .join("");
  return `<div role="group" tabindex="-1" data-slot="chip-group" class="${chipGroupVariants({ layout: "scroll" })} ${GROUP_RING}" aria-label="${esc(label)}"><div ${row}>${items}</div></div>`;
}

const CATEGORIES = ["식비", "교통", "쇼핑", "카페", "구독", "의료", "여행", "주거", "통신", "교육"];
const CHIPS = ["전체", "식비", "교통", "쇼핑", "카페", "구독", "의료", "여행"];
const TERMS =
  "제1조(목적) 이 약관은 Porest Desk 가 제공하는 가계부 · 메모 · 할 일 서비스의 이용 조건과 절차를 정한다. 제2조(계정) 이용자는 하나의 계정만 만들 수 있고, 계정 정보는 본인만 쓴다. 제3조(데이터) 이용자가 넣은 거래 · 메모는 이용자의 것이며, 서비스는 보관과 백업에만 쓴다. 제4조(해지) 이용자는 언제든 설정에서 이용을 해지할 수 있고, 해지하면 아이디와 이메일은 다시 쓸 수 없다. 제5조(변경) 약관이 바뀌면 시행 7일 전에 앱 안에서 알린다.";
const P_FIX = "margin:0; font-family:var(--font-sans); font-size:var(--text-t4); line-height:1.7; color:var(--color-fg-neutral-muted);";

// 흰 카드(미리보기 그림)와 이름표
const CARD = "width:100%; max-width:360px; overflow:hidden; border-radius:var(--radius-r4); background:var(--color-bg-layer-default); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle);";
const CAPTION =
  "font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) =>
  `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2); min-width:0; width:100%; max-width:360px;">${html}<span style="${CAPTION}">${caption}</span></div>`;
const GRID = "display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap:var(--spacing-x6) var(--spacing-x4); align-items:start;";
const ROW_TEXT = "display:flex; justify-content:space-between; padding:var(--spacing-x3) var(--spacing-x6); font-family:var(--font-sans); font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const rows = (n) =>
  Array.from({ length: n }, (_, i) => `<div style="${ROW_TEXT}"><span>${["김밥천국", "버스", "다이소", "스타벅스", "GS25", "교보문고", "올리브영", "택시", "넷플릭스", "쿠팡"][i % 10]}</span><b>${["8,000원", "1,500원", "12,300원", "6,500원", "3,200원", "15,000원", "21,900원", "9,800원", "13,500원", "32,000원"][i % 10]}</b></div>`).join("");

// ── 예제 ──────────────────────────────────────────────────────────────────

export const scrollFogExamples = [
  {
    title: "시트 · 대화상자 본문 — 긴 목록",
    description:
      "길이가 데이터에 따라 늘어나는 본문(목록 · 긴 폼)은 scrollFog 를 준다 — DialogBody · BottomSheetBody · ResponsiveDialogBody · PopoverBody 가 같고, use=\"overlayBody\" 와 같다. 위 20 · 아래 80 이 늘 흐리고(SEED Bottom Sheet 의 권장 — 아래가 깊어 더 있다는 것이 잘 보인다), 본문 안에 그만큼 여백(위 20 — 머리 아래 16 은 그대로, 아래 80 — 바닥이 있어도)과 스크롤 여유를 둬 끝까지 내리면 흐림이 빈 여백 위에 놓인다. 넘쳤는지 재서 켜고 끄지 않는다 — 칸 두셋처럼 늘 들어맞는 본문에는 걸지 않는다. 옛 \"본문이 넘칠 때만 아래 48 흐림\" 을 대신한다. 머리 아래 선(위로 스크롤됨)은 머리에 그려 흐림에 지워지지 않는다. 미리보기 본문은 실제로 스크롤된다.",
    jsx: `import { ResponsiveDialogBody } from "@/components/ui/dialog"
import { ListRadioGroup, ListRadioItem } from "@/components/ui/list"

{/* 길이가 데이터에 따라 늘어나는 목록 — 위 20 · 아래 80 흐림과 같은 여백 */}
<ResponsiveDialogBody scrollFog className="px-0">
  <ListRadioGroup value={categoryId} onValueChange={setCategoryId} aria-label="카테고리">
    {categories.map((c) => <ListRadioItem key={c.id} value={c.id} title={c.name} />)}
  </ListRadioGroup>
</ResponsiveDialogBody>`,
    render: () =>
      fogDialog({
        uid: "scroll-fog-ex-sheet",
        title: "카테고리 고르기",
        bodyHtml: radioRows({ uid: "scroll-fog-ex-sheet-list", label: "카테고리", options: CATEGORIES, value: "식비" }),
      }),
  },

  {
    title: "칩 줄 · 상자",
    description:
      "가로로 넘기는 칩 줄(ChipGroup layout=\"scroll\")과 ChipTabsList 는 늘 row 흐림이다 — 따로 켜지 않는다. 좌우 20 이 흐리고, 안쪽 여백이 화면 여백 24 라 처음 · 끝의 칩은 흐리지 않는다. 카드 · 상자 안의 높이를 정한 스크롤은 ScrollFog(use=\"box\" — 기본)로 감싼다 — 넘치는 방향의 양 끝 20, 안쪽 여백 · 스크롤 여유 20. 마스크라 바탕색과 상관없고(흰 면 · 회색 바탕 · 다크 어디서나 같다) 흐린 자리의 칩 · 글도 그대로 눌린다. 안에 초점 가는 요소가 없는 상자는 키보드로 스크롤하도록 tabIndex={0} · role=\"region\" 과 이름(aria-label)을 준다 — 역할 없는 div 에는 이름을 달 수 없다(Scroll Area). 스크롤바는 전역 한 벌이고, 숨기는 것은 가로 줄(row)뿐이다.",
    jsx: `import { ScrollFog } from "@/components/ui/scroll-fog"

{/* 칩 줄은 따로 켜지 않는다 — layout="scroll" 이면 늘 좌우 20 */}
<ChipGroup layout="scroll" aria-label="필터">…</ChipGroup>

{/* 카드 안 높이를 정한 스크롤 — 넘치는 방향 양 끝 20 */}
<ScrollFog className="max-h-60" tabIndex={0} role="region" aria-label="이용 약관">
  <p>{terms}</p>
</ScrollFog>`,
    render: () =>
      `<div style="${GRID}">${labeled(`<div style="${CARD} padding:var(--spacing-x4) 0;">${chipRow({ label: "필터", chips: CHIPS, selected: "전체" })}</div>`, "row — 좌우 20 · 여백 24")}${labeled(
        `<div style="${CARD}">${scrollFog({ use: "box", className: "max-h-60", extra: ['tabindex="0"', 'role="region"', 'aria-label="이용 약관"'], html: `<p style="${P_FIX} padding:0 var(--spacing-x5);">${esc(TERMS)}</p>` })}</div>`,
        "box — max-h-60 · 위아래 20",
      )}</div>`,
  },

  {
    title: "자리마다 — use",
    description:
      "자리마다 방향 · 깊이를 정해 둔다 — box(기본 — 카드 · 상자 안의 높이를 정한 스크롤, 양 끝 20), row(칩 필터 바 · 제안 칩 줄 · 가로 카드 줄 — 좌우 20, 여백 · 스크롤 여유는 화면 여백 24, 스크롤바 숨김), overlayBody(시트 · 대화상자 · 팝오버의 넘칠 수 있는 본문 — 위 20 · 아래 80), page(바닥 고정 버튼이 있는 화면 전체 스크롤 — 위 20 · 아래 80, 바닥 버튼 위에서 끝난다). 깊이를 정하면 그것이 그쪽의 최소 여백이다 — 안쪽 감싸개(data-slot=\"scroll-fog-content\")가 그만큼 여백을 둔다. 탭 바 위의 목록 화면 · 일반 페이지 스크롤과, 부품이 제 안개를 가진 자리(Wheel Picker · Date Picker 이어지는 달)에는 걸지 않는다.",
    jsx: `<ScrollFog className="max-h-60">…</ScrollFog>                       {/* box — 양 끝 20 */}
<ScrollFog use="overlayBody" className="max-h-72">…</ScrollFog>     {/* 위 20 · 아래 80 */}
<div className="flex h-full flex-col">
  <ScrollFog use="page" className="min-h-0 flex-1">…</ScrollFog>   {/* 바닥 버튼 위에서 끝난다 */}
  <div className="px-global-gutter pb-x4 pt-x3"><Button size="large" className="w-full">가계부에 넣기</Button></div>
</div>`,
    render: () =>
      `<div style="${GRID}">${labeled(`<div style="${CARD}">${scrollFog({ use: "box", className: "max-h-60", extra: ['tabindex="0"', 'role="region"', 'aria-label="거래"'], html: rows(8) })}</div>`, "box — 양 끝 20 · 여백 20")}${labeled(
        `<div style="${CARD}">${scrollFog({ use: "overlayBody", className: "max-h-72", extra: ['tabindex="0"', 'role="region"', 'aria-label="거래"'], html: rows(10) })}</div>`,
        "overlayBody — 위 20 · 아래 80",
      )}${labeled(
        `<div style="${CARD} display:flex; flex-direction:column; height:320px;">${scrollFog({ use: "page", className: "min-h-0 flex-1", extra: ['tabindex="0"', 'role="region"', 'aria-label="가져온 거래"'], html: rows(10) })}<div style="padding:var(--spacing-x3) var(--spacing-global-gutter) var(--spacing-x4);"><div aria-hidden="true" style="display:grid; place-items:center; height:48px; border-radius:var(--radius-r3); background:var(--color-bg-neutral-inverted); font-family:var(--font-sans); font-size:var(--text-t6); font-weight:700; color:var(--color-fg-neutral-inverted);">가계부에 넣기</div></div></div>`,
        "page — 바닥 버튼 위에서 끝난다",
      )}</div>`,
  },

  {
    title: "가로 상자 — box 는 넘치는 방향으로",
    description:
      "box 는 상자의 넘침으로 축을 정한다 — 가로로만 스크롤하는 상자(overflow-x-auto overflow-y-hidden)면 흐림 · 여백 · 스크롤 여유가 좌우 20 으로 간다(data-fog-axis=\"x\"). 넘쳤는지는 재지 않는다. 가로 카드 줄처럼 화면 끝까지 내는 줄은 row 를 쓴다(여백 24).",
    jsx: `<ScrollFog className="overflow-x-auto overflow-y-hidden" tabIndex={0} role="region" aria-label="카드">
  <div className="flex gap-x3">{cards.map((c) => <CardThumb key={c.id} card={c} />)}</div>
</ScrollFog>`,
    render: () =>
      labeled(
        `<div style="${CARD} padding:var(--spacing-x4) 0;">${scrollFog({
          use: "box",
          axis: "x",
          className: "overflow-x-auto overflow-y-hidden",
          extra: ['tabindex="0"', 'role="region"', 'aria-label="카드"'],
          html: `<div class="flex gap-x3">${["현대카드 M", "신한 SOL", "국민 노리", "삼성 taptap", "롯데 라이킷"]
            .map((n) => `<span aria-hidden="true" style="display:flex; align-items:flex-end; width:112px; height:70px; flex-shrink:0; padding:var(--spacing-x2); border-radius:var(--radius-r2); background:linear-gradient(135deg, var(--color-gray-1000), var(--color-gray-800)); font-family:var(--font-sans); font-size:11px; font-weight:700; color:var(--color-static-white);">${n}</span>`)
            .join("")}</div>`,
        })}</div>`,
        "box · 가로 — 좌우 20",
      ),
  },
];
