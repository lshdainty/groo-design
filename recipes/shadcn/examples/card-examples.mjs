/*
 * shadcn Card 예제 — docs site components/card.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 넷(목록 카드 — 오늘 쓴 돈 · 지표 카드 — 폰은 한 줄에 하나 · 누르는 카드 · 순자산 카드)은
 * 차례 · 제목 · 코드가 specs/components/card.md 의 "코드" 절과 같고, 뒤의 셋(증감 셋 · 데스크톱 격자 — 넷씩 · 아코디언 카드 — 유의사항)은 md 의 증감 표기 ·
 * 지표 · 카드 안 아코디언(body="accordion", 2026-10-10)을 코드로 더 보인다.
 * 면은 SEED Elevation · stroke.neutral-weak · Feedback 이다 — SEED 에는 카드 컴포넌트가 없어 바닥 위 흰 면 + 1px 테두리 · 그림자 없음 ·
 * 누름은 SEED 를, 머리 · 여백 · 지표 · 순자산 · 증감은 groo 가 정했다(2026-10-08). 옛 예제(그림자 · bordered · muted · brand 넷 · 모서리 12 ·
 * 여백 16 / 24 · 머리 설명 · 아래 버튼 줄)를 대신한다.
 *
 * ROOT · VARIANT · BODY · PRESS_WHOLE · PRESS_WHOLE_SURFACE · PRESS_PEERS · HERO_GLOW · CARD_ACTION · CARD_LINK · DELTA_TONE · ARROW 는
 * recipes/shadcn/components/ui/card.tsx 의 상수와, HEADER · HEADER_BODY · TITLE · CONTENT · DELTA* · STAT* · HERO_* 는 그 파일의 JSX 에 적힌
 * 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 둘레의 부품은 그 레시피의 값을 옮겨 썼다 — LIST_* 는 list.tsx(list-examples.mjs),
 * TOGGLE_* 는 toggle.tsx(toggle-examples.mjs)의 것과 같다 — 메모 카드의 고정 단추(켜고 끄는 아이콘 단추 · tone default)만 옮겼다(2026-10-09).
 * ACC_* 는 accordion.tsx(accordion-examples.mjs)의 값이다 — 아코디언 카드의 inline 아코디언(접힌 항목 · 그냥 줄 · 모두 펼치기)만 옮겼다.
 * 규칙은 specs/components/card.md, 수치 원본은 specs/components/card.yaml. 증감은 DESIGN.md Colors 의 "증감 — 방향 색 (2026-10-08)" 이다.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 카드 <div data-slot="card" data-variant data-body data-press>(press "whole" 은 <a href>) > 머리
 * <div data-slot="card-header">(제목 <h2 data-slot="card-title"> · 동작 <a data-slot="card-action" aria-labelledby="제목 글">) · 본문
 * <div data-slot="card-content"> 또는 목록(List). 증감은 <span data-slot="delta" data-direction> 안에 보이는 화살표 · 값 · 기준(aria-hidden)과
 * 숨긴 문장(sr-only)이다. 순자산 카드는 장식 빛 <span data-slot="card-hero-glow" aria-hidden> 을 먼저 그린다.
 * 카드는 바닥(bg-layer-basement) 위에만 둔다 — 미리보기는 회색 바닥 상자(여백 24)에 카드를 놓는다. 사이트 미리보기 칸의 바탕이 바닥과 같은 색이다.
 * 레시피의 스크립트(누르는 순간 --press-basis 재기 · 제목 id 를 머리 동작의 이름에 잇기)는 정적 HTML 에 없다 — 이름은 미리 이어 두었고,
 * 카드를 누르면 바탕은 레시피 그대로 바뀌지만 줄어드는 정도는 기준 길이가 없어 그리지 않는다. 링크는 # 이다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── card.tsx 의 상수와 같은 값 ──────────────────────────────────────

const ROOT = "relative isolate block overflow-hidden rounded-r4 text-start font-sans text-fg-neutral no-underline";
const VARIANT = {
  default: "border border-solid border-stroke-neutral-weak bg-bg-layer-default",
  // 그라디언트 끝은 모드마다 다른 단계 — 다크에서 brand-900 은 밝은 #7AA9F6 이라 쓰지 않는다
  hero: [
    "border-0 text-static-white",
    "bg-[linear-gradient(135deg,var(--color-bg-brand-solid),var(--color-brand-900))]",
    "dark:bg-[linear-gradient(135deg,var(--color-bg-brand-solid),var(--color-brand-300-dark))]",
  ].join(" "),
};
const BODY = {
  content: "p-x6",
  // 좌우 · 위 0 — 머리가 위 24 · 좌우 24 를 갖고, 줄이 제 좌우 24 · 위아래 12 를 가진다. 아래 12 + 마지막 줄 12 = 보이는 24.
  // 머리가 없으면 위도 12 — 첫 줄 12 와 합쳐 보이는 24(위 · 아래 같게)
  list: "pb-x3 [&:not(:has(>[data-slot=card-header]))]:pt-x3",
  // 좌우 · 위 0 — 머리가 위 24 · 좌우 24 를 갖고, 트리거가 제 좌우 24 · 위아래 16 을 가진다. 아래 8 + 마지막 트리거 16 = 보이는 24.
  // 머리가 없으면 위도 8 — 첫 트리거 16 과 합쳐 보이는 24(위 · 아래 같게, 목록 카드와 같은 셈)
  accordion: "pb-x2 [&:not(:has(>[data-slot=card-header]))]:pt-x2",
};
const PRESS_WHOLE = [
  "w-full cursor-pointer",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
const PRESS_WHOLE_SURFACE = "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed";
const PRESS_PEERS = [
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[@media(hover:hover)]:has-[[data-slot=card-link]:hover]:bg-bg-layer-default-pressed has-[[data-slot=card-link]:active]:bg-bg-layer-default-pressed",
  "has-[[data-slot=card-link]:focus-visible]:outline-2 has-[[data-slot=card-link]:focus-visible]:outline-offset-2 has-[[data-slot=card-link]:focus-visible]:outline-stroke-focus-ring",
  "[&_button:not([data-slot=card-link])]:relative [&_button:not([data-slot=card-link])]:z-[1] [&_a:not([data-slot=card-link])]:relative [&_a:not([data-slot=card-link])]:z-[1]",
].join(" ");
const HERO_GLOW = "pointer-events-none absolute -right-[40px] -top-[80px] -z-10 size-[240px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-static-white)_22%,transparent),transparent_70%)]";
const CARD_ACTION = [
  "relative -mr-x3_5 inline-flex h-9 shrink-0 cursor-pointer items-center rounded-r2 border-0 bg-transparent px-x3_5",
  "font-sans text-t4 font-bold text-fg-neutral-muted no-underline",
  "before:absolute before:left-1/2 before:top-1/2 before:h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
const CARD_LINK = [
  "cursor-pointer border-0 bg-transparent p-0 text-start font-sans text-t5 font-bold text-fg-neutral no-underline",
  "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none",
].join(" ");
const DELTA_TONE = {
  up: "text-fg-critical",
  down: "text-fg-informative",
  flat: "text-fg-neutral-subtle",
};
const ARROW = { up: "▲", down: "▼", flat: null };

// ── card.tsx 의 JSX 에 적힌 클래스 ──────────────────────────────────

const HEADER = "flex items-center justify-between gap-x2";
const HEADER_BODY = { list: "px-x6 pb-x1 pt-x6", accordion: "px-x6 pb-x1 pt-x6", content: "pb-x2" };
const TITLE = "min-w-0 font-sans text-t5 font-bold text-fg-neutral";
const CONTENT = "flex flex-col gap-x3";
const DELTA = "inline-flex flex-wrap items-baseline gap-x1 font-sans text-t3";
const DELTA_VALUE = "font-medium tabular-nums";
const DELTA_TEXT = "font-normal";
const DELTA_TEXT_COLOR = "text-fg-neutral-subtle";
const ON_HERO = "text-static-white";
const STAT = "flex flex-col items-start";
const STAT_LABEL = "font-sans text-t3 font-medium text-fg-neutral-subtle";
const STAT_VALUE = "mt-x1 font-sans font-bold tabular-nums text-fg-neutral";
const STAT_SIZE = { large: "text-t9", small: "text-t7" };
const STAT_DELTA = "mt-x1";
const HERO_LABEL = "font-sans text-t3 font-medium text-static-white";
const HERO_AMOUNT = "mt-x1_5 font-sans text-t12 font-bold tabular-nums text-static-white";
const HERO_DETAIL = "mt-x1 font-sans text-t3 font-normal text-static-white";
const HERO_PADDING = "p-x6";

// ── list.tsx 의 cva 와 같은 값 — 목록 카드의 줄(ListButtonItem · 카테고리 타일) ──

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

// ── toggle.tsx 의 cva 와 같은 값 — 메모 카드의 고정 단추(tone default) ──

const TOGGLE_BASE = [
  "relative inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-r2 border-0 bg-transparent p-0",
  // 누르는 영역 44 — 보이는 40 둘레로 2 씩
  "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  // 아이콘 20 · 끔 선 2 · 켬 선 2.5(막혀도 그대로)
  "[&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:[stroke-width:2] aria-pressed:[&_svg]:[stroke-width:2.5]",
  // 바탕은 color-transition, 축소는 pressed-scale
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "[--press-basis:40] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  // 키보드 포커스 링 2px · 띄움 2px — 색은 톤마다
  "focus-visible:outline-2 focus-visible:outline-offset-2",
  "disabled:cursor-not-allowed disabled:bg-transparent disabled:text-fg-disabled disabled:[scale:1]",
].join(" ");
const TOGGLE_VARIANTS = {
  tone: {
    default:
      "text-fg-neutral-muted enabled:aria-pressed:text-fg-neutral hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed focus-visible:outline-stroke-focus-ring",
  },
};
const TOGGLE_DEFAULTS = { tone: "default" };
// 아이콘 자리 — toggle.tsx 의 JSX
const TOGGLE_ICON = "pointer-events-none flex";

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
  [/^shrink(?:-|$)/, "shrink"],
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

const toggleVariants = cvaOf(TOGGLE_BASE, { variants: TOGGLE_VARIANTS, defaultVariants: TOGGLE_DEFAULTS });

// ── accordion.tsx 의 값 — 아코디언 카드의 inline 아코디언(accordion-examples.mjs 의 것과 같다) ──

const ACC_ROOT_INLINE = [
  "flex flex-col",
  "[&>[data-accordion-row]+[data-accordion-row]]:before:block [&>[data-accordion-row]+[data-accordion-row]]:before:h-px [&>[data-accordion-row]+[data-accordion-row]]:before:mx-x6",
  "[&>[data-accordion-row]+[data-accordion-row]]:before:bg-stroke-neutral-subtle [&>[data-accordion-row]+[data-accordion-row]]:before:content-['']",
].join(" ");
const ACC_ITEM_INLINE = "relative";
const ACC_TRIGGER = [
  "group/accordion-trigger relative flex min-h-[54px] w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-left font-sans",
  "[--trigger-pressed:var(--color-bg-layer-default-pressed)]",
  "before:pointer-events-none before:absolute before:inset-y-0 before:inset-x-0 before:rounded-none before:bg-transparent before:content-['']",
  "before:[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),inset_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-radius_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[@media(hover:hover)]:enabled:hover:before:inset-x-x1_5 [@media(hover:hover)]:enabled:hover:before:rounded-r2_5 [@media(hover:hover)]:enabled:hover:before:bg-(--trigger-pressed)",
  "enabled:active:before:inset-x-x1_5 enabled:active:before:rounded-r2_5 enabled:active:before:bg-(--trigger-pressed)",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed",
  "rounded-none",
].join(" ");
const ACC_CONTENT = [
  "relative flex w-full min-w-0 items-center gap-x3 py-x4",
  "px-global-gutter",
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
].join(" ");
const ACC_CONTENT_PRESS = "group-active/accordion-trigger:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/accordion-trigger:[scale:1]";
const ACC_BODY = "flex min-w-0 flex-1 flex-col items-start gap-x0_5";
const ACC_TITLE = "font-sans text-t5 font-medium break-keep [overflow-wrap:break-word] text-fg-neutral";
const ACC_CHEVRON = "size-5 shrink-0 [transition:rotate_var(--motion-duration-d6)_var(--motion-ease-easing)] motion-reduce:transition-none text-fg-neutral-subtle";
const ACC_PANEL_TEXT = "px-global-gutter pb-x4 pt-0 font-sans text-article-note font-normal text-fg-neutral-muted whitespace-pre-line break-keep [overflow-wrap:break-word]";
const ACC_PLAIN_MIN = "min-h-[54px]";
const ACC_EXPAND_ALL = [
  "relative -mr-x3_5 inline-flex h-9 shrink-0 cursor-pointer items-center rounded-r2 border-0 bg-transparent px-x3_5",
  "font-sans text-t4 font-bold text-fg-neutral-muted",
  "before:absolute before:left-1/2 before:top-1/2 before:h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "[@media(hover:hover)]:hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

// 유의사항 다섯 — 첫 제목이 84자, 셋째는 상세가 없다(그냥 줄). 지어낸 카드 약관이다
const CAUTIONS = [
  { id: "c1", title: "전월 이용실적에서 제외되는 이용금액: 상품권 · 선불카드 구매 및 충전, 국세 · 지방세 · 공과금, 아파트 관리비, 대학 등록금, 무이자 할부 이용분", detail: "■ 위 이용금액은 전월 실적 산정에서 빠져요." },
  { id: "c2", title: "연회비 · 카드 발급 후 첫 달 실적 기준", detail: "■ 발급 후 첫 달은 실적 조건 없이 혜택을 받을 수 있어요." },
  { id: "c3", title: "할인 한도는 서비스별로 따로 적용돼요", detail: null },
  { id: "c4", title: "혜택 변경 안내", detail: "■ 카드사 사정에 따라 혜택이 바뀔 수 있어요. 바뀌면 6개월 전에 알려요." },
  { id: "c5", title: "해외 원화결제(DCC) 이용 시 별도 수수료가 붙어요", detail: "■ 해외에서 원화로 결제하면 3 ~ 8% 수수료가 더해져요." },
];

// <AccordionItem> + <AccordionTrigger title> + <AccordionContent> · <AccordionPlainItem title> — 접힌 채(내용은 hidden)
const accItem = (uid, title, detail) =>
  detail
    ? `<div data-slot="accordion-item" data-accordion-row="" data-state="closed" class="${ACC_ITEM_INLINE}"><h3 data-slot="accordion-heading" class="m-0 flex"><button type="button" id="${uid}-trigger" aria-expanded="false" aria-controls="${uid}-content" data-slot="accordion-trigger" data-state="closed" class="${ACC_TRIGGER}"><span data-slot="accordion-trigger-content" class="${ACC_CONTENT} ${ACC_CONTENT_PRESS}"><span data-slot="accordion-trigger-body" class="${ACC_BODY}"><span data-slot="accordion-title" class="${ACC_TITLE}">${esc(title)}</span></span>${svg(PATHS.chevronDown, { cls: ACC_CHEVRON })}</span></button></h3><div id="${uid}-content" data-slot="accordion-content" data-state="closed" hidden=""><div data-slot="accordion-content-text" class="${ACC_PANEL_TEXT}">${esc(detail)}</div></div></div>`
    : `<div data-slot="accordion-plain-item" data-accordion-row="" class="${ACC_ITEM_INLINE}"><div data-slot="accordion-plain-item-content" class="${ACC_CONTENT} ${ACC_PLAIN_MIN}"><span data-slot="accordion-trigger-body" class="${ACC_BODY}"><span data-slot="accordion-title" class="${ACC_TITLE}">${esc(title)}</span></span></div></div>`;
// <AccordionExpandAll controls> — 하나라도 접혀 있어 "모두 펼치기"
const accExpandAll = (controls) =>
  `<button type="button" aria-controls="${controls}" data-slot="accordion-expand-all" data-state="collapsed" class="${ACC_EXPAND_ALL}"><span>모두 펼치기</span></button>`;

// ── <Card> 조각 — card.tsx 가 그리는 DOM ─────────────────────────────────

// <Card variant body press href> — 면 · 여백 · 누름. press "whole"(href)는 <a>, 나머지는 <div>. 순자산(hero)은 여백 24 · 장식 빛을 먼저
function card({ variant = "default", body = "content", press = "none", href = "#", attrs: extra = "", children }) {
  const hero = variant === "hero";
  const cls = merge(
    [ROOT, VARIANT[variant], hero ? HERO_PADDING : BODY[body], press === "whole" && PRESS_WHOLE, press === "whole" && !hero && PRESS_WHOLE_SURFACE, press === "peers" && !hero && PRESS_PEERS]
      .filter(Boolean)
      .join(" "),
  );
  const inner = `${hero ? `<span aria-hidden="true" data-slot="card-hero-glow" class="${HERO_GLOW}"></span>` : ""}${children}`;
  const shared = attrs(['data-slot="card"', `data-variant="${variant}"`, `data-body="${hero ? "content" : body}"`, `data-press="${press}"`, `class="${cls}"`, extra]);
  return press === "whole" ? `<a href="${href}" ${shared}>${inner}</a>` : `<div ${shared}>${inner}</div>`;
}

// <CardHeader><CardTitle /><CardAction /></CardHeader> — 머리 동작의 이름은 "{제목} {글}"(aria-labelledby — 제목 id · 글 id)
function cardHeader({ id, title, action, body = "content" }) {
  const actionHtml = action
    ? `<a href="#" data-slot="card-action" aria-labelledby="${id}-title ${id}-action" class="${CARD_ACTION}"><span id="${id}-action">${esc(action)}</span></a>`
    : "";
  return `<div data-slot="card-header" class="${HEADER} ${HEADER_BODY[body]}"><h2 id="${id}-title" data-slot="card-title" class="${TITLE}">${esc(title)}</h2>${actionHtml}</div>`;
}
const cardContent = (html) => `<div data-slot="card-content" class="${CONTENT}">${html}</div>`;
const cardLink = (text) => `<a href="#" data-slot="card-link" class="${CARD_LINK}">${esc(text)}</a>`;

// <Delta> — 보이는 화살표 · 값 · 기준(aria-hidden)과 숨긴 문장. 부호는 화살표가 말한다. 순자산 카드 안이면 모두 흰 글자.
// 변화 없음은 "변화 없음" 만 보이고 기준 글은 숨긴 문장에만 둔다(card.tsx — direction !== "flat" && text)
const DELTA_SAID = { up: "늘었어요", down: "줄었어요" };
function delta({ direction, value = "", text = "", srText, hero = false, className = "" }) {
  const arrow = ARROW[direction];
  const said = srText ?? (direction === "flat" ? [text, "변화가 없어요"] : [text, value, DELTA_SAID[direction]]).filter(Boolean).join(" ");
  const shown = arrow != null ? `${arrow} ${esc(value)}` : "변화 없음";
  return `<span data-slot="delta" data-direction="${direction}" class="${[DELTA, className].filter(Boolean).join(" ")}"><span aria-hidden="true" data-slot="delta-value" class="${DELTA_VALUE} ${hero ? ON_HERO : DELTA_TONE[direction]}">${shown}</span>${
    text && direction !== "flat" ? `<span aria-hidden="true" data-slot="delta-text" class="${DELTA_TEXT} ${hero ? ON_HERO : DELTA_TEXT_COLOR}">${esc(text)}</span>` : ""
  }<span class="sr-only">${esc(said)}</span></span>`;
}

// <CardStat> — 라벨 13 · 500, 숫자 700 · 고정폭(large 24 / 32 · small 20 / 27), 증감 줄(위 4)
const cardStat = ({ label, value, size = "large", delta: d }) =>
  `<div data-slot="card-stat" data-size="${size}" class="${STAT}"><span data-slot="card-stat-label" class="${STAT_LABEL}">${esc(label)}</span><span data-slot="card-stat-value" class="${STAT_VALUE} ${STAT_SIZE[size]}">${esc(value)}</span>${d ? delta({ ...d, className: STAT_DELTA }) : ""}</div>`;

// 오늘 쓴 돈 — 카테고리 타일(차트 색 옅은 바탕 + 그 색 아이콘) · 제목 · 설명 · 금액(가계부 금액 16 · 700 — 그 화면의 자리)
const TODAY = [
  { title: "스타벅스 강남점", detail: "식비 · 국민카드", amount: "−6,500원", icon: "coffee", tile: "bg-chart-orange-weak text-chart-orange" },
  { title: "지하철", detail: "교통 · 국민카드", amount: "−1,450원", icon: "bus", tile: "bg-chart-blue-weak text-chart-blue" },
  { title: "이마트 성수점", detail: "생활 · 신한카드", amount: "−42,300원", icon: "shoppingBag", tile: "bg-chart-green-weak text-chart-green" },
];
const AMOUNT = "font-bold text-fg-neutral tabular-nums";
const todayList = () =>
  listOf(
    TODAY.map((r) => listButtonItem({ prefix: listTile(r.icon, r.tile), title: esc(r.title), detail: esc(r.detail), suffix: `<span class="${AMOUNT}">${r.amount}</span>` })),
    { ariaLabel: "오늘 쓴 돈" },
  );

const SPEND = { label: "이번 달 지출", value: "1,240,000원", delta: { direction: "up", value: "12%", text: "지난달보다", srText: "지난달보다 12% 더 썼어요" } };
const INCOME = { label: "이번 달 수입", value: "4,200,000원", delta: { direction: "down", value: "3%", text: "지난달보다" } };

// 바닥 — 카드는 회색 바닥(bg-layer-basement) 위에만 둔다. 미리보기 상자의 여백 24 는 화면 끝 여백과 같다
const floor = (html, maxWidth = "") =>
  `<div style="padding:var(--spacing-x6); border-radius:var(--radius-r4); background:var(--color-bg-layer-basement); font-family:var(--font-sans);${maxWidth ? ` max-width:${maxWidth};` : ""}">${html}</div>`;
// 쌓은 카드 사이 8 — 폰은 한 줄에 하나
const stack = (items) => `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2);">${items.join("")}</div>`;
// 데스크톱 격자 — 칸 사이 24(layout-gutter). 좁은 미리보기에서는 가로로 민다
const grid = (items, columns) =>
  `<div style="overflow-x:auto;"><div style="display:grid; grid-template-columns:repeat(${columns}, minmax(200px, 1fr)); gap:var(--layout-gutter); min-width:${columns * 200 + (columns - 1) * 24}px;">${items.join("")}</div></div>`;
const CAPTION = "display:block; margin-top:var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;
const row = (items) => `<div style="display:flex; flex-wrap:wrap; gap:var(--spacing-x6); align-items:flex-start;">${items.map((it) => `<div style="flex:1 1 280px; max-width:408px;">${it}</div>`).join("")}</div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const cardExamples = [
  {
    title: "목록 카드 — 오늘 쓴 돈",
    description:
      "목록을 담은 카드(body=\"list\")는 좌우 여백을 두지 않는다 — List 줄이 제 좌우 24 · 위아래 12 를 가지므로 줄이 카드 가장자리까지 가고, 누름 바탕(좌우 6 들어온 모서리 10)이 카드 모서리 16 과 동심이다. 머리는 위 24 · 좌우 24 · 아래 4, 카드 아래 여백은 12 라 마지막 줄의 12 와 합쳐 보이는 24 로 위와 같다. 머리는 제목 16 / 22 · 700 · fg-neutral 하나에 오른쪽 동작 하나 — \"전체 보기\" 14 · 500 · fg-neutral-subtle + chevron-right 16(사이 2), 보이는 상자 32(왼쪽 8 · 오른쪽 4 · 누를 때 바탕 · 모서리 8)에 누르는 영역 44 이고 이름은 \"오늘 쓴 돈 전체 보기\" 다. 면은 바닥(bg-layer-basement) 위 흰 면 + 1px stroke-neutral-weak · 모서리 16 · 그림자 없음 — 폰 · 데스크톱 · 라이트 · 다크가 같다.",
    jsx: `import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card"
import { List } from "@/components/ui/list"

<Card body="list">
  <CardHeader>
    <CardTitle>오늘 쓴 돈</CardTitle>
    <CardAction href="/desk/ledger">전체 보기</CardAction>
  </CardHeader>
  {/* 줄은 List 그대로 — 누름 바탕 모서리 10(동심 모서리)은 List 의 기본값 */}
  <List aria-label="오늘 쓴 돈">{today.map(renderExpenseRow)}</List>
</Card>`,
    render: () => floor(card({ body: "list", children: `${cardHeader({ id: "card-ex-today", title: "오늘 쓴 돈", action: "전체 보기", body: "list" })}${todayList()}` }), "408px"),
  },

  {
    title: "지표 카드 — 폰은 한 줄에 하나",
    description:
      "숫자 하나를 보이는 카드다 — 라벨 13 · 500 · fg-neutral-subtle, 아래 4 에 큰 숫자 700 · 고정폭 숫자, 아래 4 에 증감 줄. 카드 하나에 숫자 하나면 24 / 32(large)다. 폰에서는 지표 카드를 한 줄에 하나 둔다(쌓은 사이 8) — 둘씩이면 360 폭에서 칸 안쪽이 101 인데 \"1,240,000원\" 24 / 700 은 들어가지 않는다. 돈은 줄이지 않고 원까지, 숫자가 굴러가는 애니메이션은 없다. 증감은 방향으로 칠한다 — 오르면 ▲ fg-critical, 내리면 ▼ fg-informative(증권과 같은 관례), 늘 화살표와 값을 함께 쓰고 뒤에 기준을 옅은 글(13 · 400 · fg-neutral-subtle · 사이 4)로 둔다. 좋은지 나쁜지는 색이 아니라 글이 말한다 — 보조 기술에는 \"지난달보다 12% 더 썼어요\" 로 읽힌다(화살표는 숨긴다). 미리보기는 폰 폭(360)이다.",
    jsx: `import { Card, CardStat } from "@/components/ui/card"

{/* 폰은 한 줄에 하나(쌓은 카드 사이 8), 768 이상은 둘씩(격자 24) — 숫자 24. 1280 이상에서 넷씩 두면 size="small"(20) */}
<div className="grid gap-2 md:grid-cols-2 md:gap-6">
  <Card>
    <CardStat label="이번 달 지출" value="1,240,000원"
      delta={{ direction: "up", value: "12%", text: "지난달보다", srText: "지난달보다 12% 더 썼어요" }} />
  </Card>
  <Card>
    <CardStat label="이번 달 수입" value="4,200,000원"
      delta={{ direction: "down", value: "3%", text: "지난달보다" }} />
  </Card>
</div>`,
    render: () => floor(stack([card({ children: cardStat(SPEND) }), card({ children: cardStat(INCOME) })]), "408px"),
  },

  {
    title: "누르는 카드",
    description:
      "카드 전체가 한 곳으로 가면(href · onClick — press \"whole\") 카드가 링크 · 버튼이다 — 마우스를 올리면 · 누르는 동안 면이 bg-layer-default-pressed 로 바뀌고, 누르는 동안 카드 전체가 2px 거리만큼 준다(배율 (기준 − 2) ÷ 기준, 기준 max(높이, 폭 ÷ 4, 24) 를 누르는 순간 잰다 — 모션 줄이기면 색만). 카드를 누르면 열리는데 안에 대등한 동작(고정 · ⋮)이 더 있으면 press=\"peers\" — 카드를 덮는 CardLink 가 누르는 자리이고 안의 버튼은 그 위에 놓여 따로 눌린다. 버튼을 눌러도 카드가 열리지 않고, 카드는 면 색만 바뀌고 줄지 않는다(\"전체가 줄어들면 무엇이 눌린 것인지 모호해집니다\"). 테두리 · 글자색은 그대로이고 그림자 · 위로 뜨기는 없다. 키보드 포커스에만 카드 바깥 2px 링(띄움 2)이다. 고정 단추는 제목 줄 오른쪽의 켜고 끄는 아이콘 단추(Toggle — 끔 fg-neutral-muted · 선 2, 켬 fg-neutral · 선 2.5)다 — 상자 40 이 줄 높이를 밀지 않게 위 · 오른쪽 8 을 당긴다.",
    jsx: `import { Pin } from "lucide-react"
import { Card, CardContent, CardLink } from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"

{/* 한 곳으로 — 색 + 2px 축소 */}
<Card href={\`/desk/budget/\${budget.id}\`}>
  <CardContent>…</CardContent>
</Card>

{/* 카드를 누르면 열리고 고정 버튼이 따로 — 색만, 축소 없음 */}
<Card press="peers">
  {/* 고정 버튼은 제목 줄 오른쪽 — 켜고 끄는 아이콘 단추(Toggle). 상자 40 이 줄 높이를 밀지 않게 위 · 오른쪽 8 을 당긴다 */}
  <div className="flex items-start justify-between gap-x2">
    <CardLink href={\`/desk/memo/\${memo.id}\`}>{memo.title}</CardLink>
    <Toggle className="-mr-x2 -mt-x2 shrink-0" aria-label={\`\${memo.title} 고정\`} pressed={memo.pinned} onPressedChange={(pinned) => setPinned(memo.id, pinned)} icon={<Pin />} />
  </div>
  <CardContent>…</CardContent>
</Card>`,
    render: () =>
      row([
        labeled(
          floor(card({ press: "whole", children: cardContent(cardStat({ label: "10월 식비 예산", value: "115,600원 남음" }) + `<p class="m-0 font-sans text-t3 text-fg-neutral-subtle">500,000원 중 384,400원 썼어요.</p>`) })),
          "press \"whole\" — 카드 전체가 링크(색 + 2px)",
        ),
        labeled(
          floor(
            card({
              press: "peers",
              children: `<div class="flex items-start justify-between gap-x2">${cardLink("회의록 — 10월 8일")}<button type="button" data-slot="toggle" data-tone="default" class="${merge(`${toggleVariants()} -mr-x2 -mt-x2 shrink-0`)}" aria-label="회의록 — 10월 8일 고정" aria-pressed="false"><span aria-hidden="true" data-slot="toggle-icon" class="${TOGGLE_ICON}">${svg(PATHS.pin)}</span></button></div>${cardContent(`<p class="m-0 font-sans text-t4 text-fg-neutral-muted">표 컴포넌트 정리 · 다음 주 화요일까지</p>`)}`,
            }),
          ),
          "press \"peers\" — CardLink + 고정 단추 Toggle(색만)",
        ),
      ]),
  },

  {
    title: "순자산 카드",
    description:
      "Desk 홈 맨 위의 순자산은 브랜드 색으로 채운 카드다(variant=\"hero\" — 한 화면에 하나) — 135° 그라디언트 bg-brand-solid → 라이트 brand-900 · 다크 brand-300-dark. 다크도 짙은 채움이라 흰 글자가 두 모드 모두 어디서나 4.5 이상이다(라이트 8.38 ~ 14.78 · 다크 8.36 ~ 11.25). 라벨 13 · 500, 금액 32 / 42 · 700(위 6), 아래 글 13(위 4) — 모두 흰 글자이고 불투명도로 흐리지 않는다. 증감도 흰 ▲ · ▼ + 글이다 — 브랜드 채움 위 빨강 · 파랑은 1.66 · 1.65 라 읽히지 않는다(증감 방향 색의 하나뿐인 예외). 오른쪽 위 장식 빛(지름 240 · 오른쪽 −40 · 위 −80, 흰 22% → 지름의 70% 에서 투명)은 글자 뒤에 깔리고 보조 기술에 숨긴다. 모서리 16 · 여백 24 · 테두리 없음. HR 에는 이 카드가 없다.",
    jsx: `import { Card, CardHeroAmount, CardHeroDetail, CardHeroLabel, Delta } from "@/components/ui/card"

<Card variant="hero">
  <CardHeroLabel>순자산</CardHeroLabel>
  <CardHeroAmount>42,898,100원</CardHeroAmount>
  {/* 히어로 위 증감은 흰 글자 — Delta 가 hero 안에서 색을 흰색으로 바꾼다 */}
  <CardHeroDetail><Delta direction="up" value="1.8%" text="지난달보다" /></CardHeroDetail>
</Card>`,
    render: () =>
      floor(
        card({
          variant: "hero",
          children: `<div data-slot="card-hero-label" class="${HERO_LABEL}">순자산</div><div data-slot="card-hero-amount" class="${HERO_AMOUNT}">42,898,100원</div><div data-slot="card-hero-detail" class="${HERO_DETAIL}">${delta({ direction: "up", value: "1.8%", text: "지난달보다", hero: true })}</div>`,
        }),
        "408px",
      ),
  },

  {
    title: "증감 — ▲ · ▼ · 변화 없음",
    description:
      "어디서나(지출 · 수입 · 순자산 · 주식 · 표 · 차트) 오르면 ▲ fg-critical, 내리면 ▼ fg-informative 다 — 좋고 나쁨이 아니라 방향이다. 부호는 화살표가 말한다 — \"+12%\" · \"−12%\" 를 화살표와 같이 쓰지 않는다(value 앞의 + · − 는 떼어 낸다). 변화가 없으면 화살표 없이 \"변화 없음\"(fg-neutral-subtle)이다. 보조 기술에는 문장으로 읽힌다 — 기본은 \"{기준} {값} 늘었어요 · 줄었어요\" · 없음은 \"{기준} 변화가 없어요\", 좋고 나쁨을 말하려면 srText 를 준다(\"지난달보다 12% 더 썼어요\").",
    jsx: `<Delta direction="up" value="12%" text="지난달보다" srText="지난달보다 12% 더 썼어요" />
<Delta direction="down" value="3%" text="지난달보다" />
<Delta direction="flat" srText="지난달과 같아요" />`,
    render: () =>
      floor(
        card({
          children: cardContent(
            [
              delta({ direction: "up", value: "12%", text: "지난달보다", srText: "지난달보다 12% 더 썼어요" }),
              delta({ direction: "down", value: "3%", text: "지난달보다" }),
              delta({ direction: "flat", srText: "지난달과 같아요" }),
            ].join(""),
          ),
        }),
        "408px",
      ),
  },

  {
    title: "데스크톱 격자 — 넷씩",
    description:
      "데스크톱 격자에 셋 · 넷씩 나란히 놓을 때만 숫자를 20 / 27(size=\"small\")로 줄인다 — 여백은 그대로 24 다. 칸 사이는 layout-gutter 24 이고 격자는 감싸는 쪽이 정한다(카드는 폭을 정하지 않는다). 폰에서는 한 줄에 하나로 돌아간다 — 둘씩 두지 않는다. 미리보기가 좁으면 격자를 가로로 민다.",
    jsx: `<div className="grid grid-cols-4 gap-6">
  <Card><CardStat size="small" label="이번 달 지출" value="1,240,000원" delta={{ direction: "up", value: "12%", text: "지난달보다" }} /></Card>
  <Card><CardStat size="small" label="이번 달 수입" value="4,200,000원" delta={{ direction: "down", value: "3%", text: "지난달보다" }} /></Card>
  <Card><CardStat size="small" label="남은 예산" value="360,000원" delta={{ direction: "flat", srText: "지난달과 같아요" }} /></Card>
  <Card><CardStat size="small" label="카드 결제 예정" value="184,000원" delta={{ direction: "down", value: "8%", text: "지난달보다" }} /></Card>
</div>`,
    render: () =>
      floor(
        grid(
          [
            { label: "이번 달 지출", value: "1,240,000원", delta: { direction: "up", value: "12%", text: "지난달보다" } },
            { label: "이번 달 수입", value: "4,200,000원", delta: { direction: "down", value: "3%", text: "지난달보다" } },
            { label: "남은 예산", value: "360,000원", delta: { direction: "flat", srText: "지난달과 같아요" } },
            { label: "카드 결제 예정", value: "184,000원", delta: { direction: "down", value: "8%", text: "지난달보다" } },
          ].map((s) => card({ children: cardStat({ ...s, size: "small" }) })),
          4,
        ),
      ),
  },

  {
    title: "아코디언 카드 — 유의사항",
    description:
      "상세를 접어 둔 목록(카드 상세의 혜택 · 유의사항)은 Accordion inline 을 카드에 바로 넣는다 — body=\"accordion\" 은 좌우 여백 0 이라 트리거가 제 좌우 24 · 위아래 16 을 가지고 카드 가장자리까지 간다(2026-10-10 사용자 결정 6A, 웹 · 앱 같다). 머리는 목록 카드와 같은 위 24 · 좌우 24 · 아래 4, 카드 아래 여백은 8 — 마지막 트리거의 아래 16 과 합쳐 보이는 24 다. 머리 오른쪽 동작 자리에는 Accordion 의 \"모두 펼치기\"(14 · 500 · fg-neutral-subtle + chevrons-up-down 16 — 보이는 32 · 누르는 44, CardAction 과 같은 모양)를 두고 건수는 제목에 붙인다. 항목 사이 선은 List 의 들인 선(좌우 24)이고, 누름 바탕은 목록 카드와 같은 동심 모서리 10 이다. 84자 첫 제목도 줄을 바꿔 다 보인다.",
    jsx: `import { Accordion, AccordionContent, AccordionExpandAll, AccordionItem, AccordionPlainItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

<Card body="accordion">
  <CardHeader>
    <CardTitle>유의사항 · {cautions.length}건</CardTitle>
    <AccordionExpandAll controls="card-cautions" values={open} expandable={expandable} onValuesChange={setOpen} />
  </CardHeader>
  <Accordion id="card-cautions" values={open} onValuesChange={setOpen}>
    {cautions.map((c) =>
      c.detail ? (
        <AccordionItem key={c.id} value={c.id}>
          <AccordionTrigger title={c.title} />
          <AccordionContent>{c.detail}</AccordionContent>
        </AccordionItem>
      ) : (
        <AccordionPlainItem key={c.id} title={c.title} />
      ),
    )}
  </Accordion>
</Card>`,
    render: () =>
      floor(
        card({
          body: "accordion",
          children: `<div data-slot="card-header" class="${HEADER} ${HEADER_BODY.accordion}"><h2 id="card-ex-caution-title" data-slot="card-title" class="${TITLE}">유의사항 · ${CAUTIONS.length}건</h2>${accExpandAll("card-ex-cautions")}</div><div data-slot="accordion" data-variant="inline" class="${ACC_ROOT_INLINE}" id="card-ex-cautions">${CAUTIONS.map((c) => accItem(`card-ex-caution-${c.id}`, c.title, c.detail)).join("")}</div>`,
        }),
        "408px",
      ),
  },
];
