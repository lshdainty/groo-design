/*
 * shadcn Swipe Actions 예제 — docs site components/swipe-actions.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 하나(가계부 줄)는 차례 · 제목 · 코드가 specs/components/swipe-actions.md 의 "코드" 절과
 * 같고, 뒤의 둘(동작 셋 — 고정 · 수정 · 삭제 · 막힌 동작)은 md 의 동작 · 상태를 코드로 더 보인다. SEED 에는 줄 밀기가 없다 — groo 에만 있는
 * 지름길이고, SEED Inclusive Design 의 "복잡한 제스처는 단순한 터치 동작으로도" 를 따라 같은 동작을 줄을 눌러 들어간 화면에도 다 둔다
 * (2026-10-25 — 줄 끝 ⋮ · SwipeActionsMenu 를 걷었다, menu.md "줄의 동작").
 * 2026-10-08 — 다크 배지(fg-informative · fg-critical 채움 + fg-neutral-inverted 아이콘) · 중립 배지(bg-neutral-weak + 안쪽 1px) · 라벨 색 ·
 * 줄 높이 1.3 · Esc 뒤 초점을 고쳤다(데이터 표시 결정의 "줄 밀기"). 옛 예제(테두리 상자 · 옛 색 이름)를 대신한다.
 *
 * SWIPE_* · swipeSlotWidth · swipeTrayWidth 는 recipes/shadcn/components/ui/swipe-actions.tsx 의 상수 · 함수(형 표기만 뗐다 — 같은 입력에 같은 답)와,
 * ACTION_* · BADGE_* 는 그 파일의 cva(swipeActionVariants · swipeBadgeVariants)와, ROOT* · TRAY · ROW* 는 그 파일의 JSX 에 적힌 클래스와
 * 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 둘레의 부품은 그 레시피의 값을 옮겨 썼다 — LIST_* 는 list.tsx 의
 * 것과 같다 — 이 파일이 쓰는 줄 · 변형 · 크기와 그에 걸리는 compound 만 옮겼다.
 * 규칙은 specs/components/swipe-actions.md, 수치 원본은 specs/components/swipe-actions.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 감싼 상자 <div data-slot="swipe-actions" data-state(open · closed)>(--swipe-offset · --swipe-dir) >
 * 트레이 <div data-slot="swipe-actions-tray">(닫혀 있으면 aria-hidden · 버튼 tabindex -1) > 동작 칸 <button data-slot="swipe-action" data-kind>
 * (배지 <span data-slot="swipe-action-badge"> + 라벨) — 뜻의 차례를 뒤집어 그린다(삭제가 가장 안쪽) · 줄 <div data-slot="swipe-actions-row" tabindex="-1">
 * (translateX(--swipe-dir × --swipe-offset)). 레시피가 style 로 주는 칸 폭 · 앞 간격 · 최소 높이 · 배지 크기는 style 그대로 적었다.
 * 레시피의 스크립트(끌기 · 축 판정 · 40% 문턱 · 한 줄만 열기 · Esc 로 닫고 초점 옮기기)는 정적 HTML 에 없다 — 그림은 열린 순간을 멈춘 것이다.
 * 줄은 폭 360 의 휴대폰 화면처럼 그린다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── swipe-actions.tsx 의 상수와 같은 값 ─────────────────────────────

const SWIPE_BADGE_SIZE = 36;
const SWIPE_ICON_SIZE = 18;
const SWIPE_GAP_LEAD = 20;
const SWIPE_GAP_BETWEEN = 12;
const SWIPE_LABEL_GAP = 2;
const SWIPE_MIN_HEIGHT = 56;
const ACTION_BASE = "flex shrink-0 cursor-pointer flex-col items-center justify-center gap-x0_5 self-stretch border-0 bg-transparent min-h-14 font-sans text-t2 font-bold leading-[1.3] [transition:filter_var(--motion-duration-color-transition)_var(--motion-ease-easing)] hover:brightness-[0.88] active:brightness-[0.88] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring disabled:cursor-not-allowed disabled:text-fg-disabled disabled:hover:brightness-100 disabled:active:brightness-100";
const ACTION_VARIANTS = {
  kind: { neutral: "text-fg-neutral-muted", primary: "text-fg-neutral-muted", destructive: "text-fg-critical" },
};
const ACTION_DEFAULTS = { kind: "neutral" };
const BADGE_BASE = "flex items-center justify-center rounded-full [&>svg]:size-[18px]";
const BADGE_VARIANTS = {
  kind: {
    neutral: "bg-bg-neutral-weak text-fg-neutral shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)]",
    primary: "bg-fg-informative text-fg-neutral-inverted",
    destructive: "bg-fg-critical text-fg-neutral-inverted",
  },
  disabled: { true: "bg-bg-disabled text-fg-disabled", false: "" },
};
const BADGE_DEFAULTS = { kind: "neutral", disabled: false };

// ── swipe-actions.tsx 의 JSX 에 적힌 클래스 ─────────────────────────

const ROOT = "relative overflow-hidden touch-pan-y select-none";
const ROOT_VARS = "[--swipe-offset:0px] [--swipe-dir:-1] rtl:[--swipe-dir:1]";
const ROOT_CALLOUT = "[-webkit-touch-callout:none]";
const TRAY = "absolute inset-y-0 end-0 flex";
const ROW = "relative bg-bg-layer-default";
const ROW_FOCUS = "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring";
const ROW_SETTLE = "[transition:transform_var(--motion-duration-d3)_var(--motion-ease-enter)] motion-reduce:[transition:none]";

// ── list.tsx 의 cva 와 같은 값 — 감싼 가계부 줄(ListButtonItem · 카테고리 타일) ──

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

// ── swipe-actions.tsx 의 칸 폭 셈 — 형 표기만 뗐다 ──────────────────────────

// 동작 하나가 차지하는 폭 — 배지 + 그 앞 간격(첫 칸 20 · 다음 12). 간격을 앞에만 둬 마지막 배지가 화면 끝에 붙는다
const swipeSlotWidth = (index) => SWIPE_BADGE_SIZE + (index === 0 ? SWIPE_GAP_LEAD : SWIPE_GAP_BETWEEN);
// 트레이 전체 폭 — 1개 56 / 2개 104 / 3개 152
const swipeTrayWidth = (count) => Array.from({ length: count }, (_, i) => swipeSlotWidth(i)).reduce((a, b) => a + b, 0);

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

const swipeActionVariants = cvaOf(ACTION_BASE, { variants: ACTION_VARIANTS, defaultVariants: ACTION_DEFAULTS });
const swipeBadgeVariants = cvaOf(BADGE_BASE, { variants: BADGE_VARIANTS, defaultVariants: BADGE_DEFAULTS });

// <SwipeActions actions rowLabel> — 줄을 감싸고 뒤에 트레이. open 이면 줄이 트레이 폭만큼 밀려 있다(그 순간을 멈춘 그림)
function swipeActions({ actions, rowLabel, open = false, children }) {
  const width = swipeTrayWidth(actions.length);
  const slots = [...actions]
    .reverse()
    .map(
      (a, i) =>
        `<button ${attrs([
          'type="button"',
          a.disabled && "disabled",
          `tabindex="${open ? 0 : -1}"`,
          `aria-label="${esc(`${a.label}: ${rowLabel}`)}"`,
          'data-slot="swipe-action"',
          `data-kind="${a.kind ?? "neutral"}"`,
          `class="${swipeActionVariants({ kind: a.kind })}"`,
          `style="inline-size:${swipeSlotWidth(i)}px;padding-inline-start:${i === 0 ? SWIPE_GAP_LEAD : SWIPE_GAP_BETWEEN}px;min-block-size:${SWIPE_MIN_HEIGHT}px"`,
        ])}><span aria-hidden="true" data-slot="swipe-action-badge" class="${merge(swipeBadgeVariants({ kind: a.kind, disabled: !!a.disabled }))}" style="inline-size:${SWIPE_BADGE_SIZE}px;block-size:${SWIPE_BADGE_SIZE}px">${svg(
          PATHS[a.icon],
        )}</span><span data-slot="swipe-action-label">${esc(a.label)}</span></button>`,
    )
    .join("");
  return `<div data-slot="swipe-actions" data-state="${open ? "open" : "closed"}" class="${ROOT} ${ROOT_VARS} ${ROOT_CALLOUT}" style="--swipe-offset:${open ? width : 0}px"><div data-slot="swipe-actions-tray" class="${TRAY}" aria-hidden="${!open}">${slots}</div><div tabindex="-1" data-slot="swipe-actions-row" class="${ROW} ${ROW_FOCUS} ${ROW_SETTLE}" style="transform:translateX(calc(var(--swipe-dir) * var(--swipe-offset)))">${children}</div></div>`;
}

// 가계부 줄 — 카테고리 타일 · 제목 · 설명 · 금액(16 · 700). 줄 끝 ⋮ 는 두지 않는다 — 같은 동작은 줄을 눌러 들어간 상세에
const AMOUNT = "font-bold text-fg-neutral tabular-nums";
const ledgerRow = (tx) =>
  listButtonItem({ prefix: listTile(tx.icon, tx.tile), title: esc(tx.title), detail: esc(tx.meta), suffix: `<span class="${AMOUNT}">${tx.amount}</span>` });
const TX = [
  { title: "스타벅스 강남점", meta: "식비 · 국민카드", amount: "−6,500원", icon: "coffee", tile: "bg-chart-orange-weak text-chart-orange" },
  { title: "지하철", meta: "교통 · 국민카드", amount: "−1,450원", icon: "bus", tile: "bg-chart-blue-weak text-chart-blue" },
  { title: "이마트 성수점", meta: "생활 · 신한카드", amount: "−42,300원", icon: "shoppingBag", tile: "bg-chart-green-weak text-chart-green" },
];
// 뜻의 차례 — 그리는 쪽이 뒤집어 삭제를 가장 안쪽에 둔다
const EDIT_DELETE = [
  { kind: "primary", label: "수정", icon: "pencil" },
  { kind: "destructive", label: "삭제", icon: "trash" },
];

// 폭 360 의 휴대폰 화면 — 기본 면(bg-layer-default) 위 목록. 사이트 미리보기 칸의 바탕(bg-page)은 누름 바탕과 거의 같은 색이다
const SCREEN =
  "max-width:360px; overflow:hidden; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-weak); border-radius:var(--radius-r4); padding:var(--spacing-x1_5) 0;";
const screen = (rows) => `<div style="${SCREEN}"><ul class="${merge(listVariants())}" aria-label="오늘 거래">${rows.join("")}</ul></div>`;
const CAPTION = "display:block; margin-top:var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;
const stack = (items) => `<div style="display:flex; flex-direction:column; gap:var(--spacing-x6);">${items.join("")}</div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const swipeActionsExamples = [
  {
    title: "가계부 줄",
    description:
      "폰(768 미만) 목록 줄을 왼쪽으로 밀면 오른쪽에서 동작이 드러난다 — 기존 줄을 감싸기만 하고(모양 · 누르기는 그대로) 뒤에 트레이를 붙인다. 동작은 1 ~ 3개를 부르는 쪽이 뜻의 차례로 넘기고 그리는 쪽이 뒤집는다 — 되돌리기 어려운 삭제가 가장 안쪽(화면에서 가장 왼쪽)이다. 칸은 원형 배지 36(아이콘 18) + 그 아래 2 에 라벨 12 / 700 / 1.3, 간격은 배지 앞에만(첫 칸 앞 20 · 칸 사이 12)이라 마지막 칸이 화면 끝에 붙는다(칸 폭 56 · 48, 트레이 56 · 104 · 152). 트레이 바탕은 칠하지 않고 색은 배지만 갖는다 — primary 는 fg-informative · destructive 는 fg-critical 로 채우고 아이콘은 fg-neutral-inverted 다(라이트는 짙은 배지 + 흰 아이콘 · 다크는 밝은 배지 + 짙은 아이콘 — 두 모드 모두 줄 바탕과 3:1 이상). 라벨은 primary fg-neutral-muted · destructive 만 fg-critical. 이름은 \"라벨: 줄 제목\" 이다. 끝까지 밀어도 실행하지 않는다. 미는 법을 모르는 사람 · 키보드 · 스크린리더는 줄을 눌러 들어간 상세에서 같은 동작 · 같은 이름에 닿는다(줄 끝 ⋮ 는 두지 않는다). 위 줄은 밀어 연 순간, 아래 둘은 닫힌 줄(트레이는 aria-hidden)이다.",
    jsx: `import { Pencil, Trash2 } from "lucide-react"
import { ListButtonItem } from "@/components/ui/list"
import { SwipeActions, type SwipeAction } from "@/components/ui/swipe-actions"

const actions: SwipeAction[] = [
  { kind: "primary", label: "수정", icon: <Pencil />, onSelect: () => edit(tx) },
  // 확인 창은 상세에서 지울 때와 같은 문구 — 부르는 쪽이 넘긴다
  { kind: "destructive", label: "삭제", icon: <Trash2 />, onSelect: () => confirmDelete({ title: "거래 삭제", description: \`\${tx.title} 거래를 지울까요?\` }) },
]

<SwipeActions actions={actions} enabled={isPhone} rowLabel={tx.title}>
  <ListButtonItem
    prefix={<CategoryTile category={tx.category} />}
    title={tx.title}
    detail={tx.meta}
    suffix={<Amount value={tx.amount} />}
    /* 줄 끝 ⋮ 는 두지 않는다 — 같은 수정 · 삭제는 상세에 있다(키보드 · 스크린리더의 길) */
    onClick={() => openDetail(tx)}
  />
</SwipeActions>`,
    render: () =>
      screen([
        swipeActions({ actions: EDIT_DELETE, rowLabel: TX[0].title, open: true, children: ledgerRow(TX[0]) }),
        swipeActions({ actions: EDIT_DELETE, rowLabel: TX[1].title, children: ledgerRow(TX[1]) }),
        swipeActions({ actions: EDIT_DELETE, rowLabel: TX[2].title, children: ledgerRow(TX[2]) }),
      ]),
  },

  {
    title: "동작 셋 — 고정 · 수정 · 삭제",
    description:
      "동작은 셋까지다(트레이 152) — 넷 이상이면 나머지는 줄을 눌러 들어간 화면에만 둔다. 고정 같은 중립 동작은 neutral — 옅은 바탕 bg-neutral-weak + 안쪽 1px stroke-neutral-weak(바탕만으로는 줄과 1.08 · 다크 1.30 이라 선을 둔다) · 아이콘 fg-neutral · 라벨 fg-neutral-muted 다. 누름 · 호버는 배지 · 라벨 밝기 88%(움직이지 않는다 — 밀어 둔 트레이와 이중으로 움직이면 어지럽다), 키보드 포커스는 칸 안쪽 2px 링이다.",
    jsx: `const actions: SwipeAction[] = [
  { kind: "neutral", label: "고정", icon: <Pin />, onSelect: () => togglePin(memo) },
  { kind: "primary", label: "수정", icon: <Pencil />, onSelect: () => edit(memo) },
  { kind: "destructive", label: "삭제", icon: <Trash2 />, onSelect: () => confirmDelete(memo) },
]

<SwipeActions actions={actions} enabled={isPhone} rowLabel={memo.title}>…</SwipeActions>`,
    render: () =>
      screen([
        swipeActions({
          actions: [{ kind: "neutral", label: "고정", icon: "pin" }, ...EDIT_DELETE],
          rowLabel: TX[1].title,
          open: true,
          children: ledgerRow(TX[1]),
        }),
      ]),
  },

  {
    title: "막힌 동작",
    description:
      "지금 할 수 없는 동작은 빼지 않고 막는다(disabled) — 배지 bg-disabled · 아이콘 · 라벨 fg-disabled 이고 흐리게(불투명도) 그리지 않는다. 누르지 못하고 밝기도 바뀌지 않는다. 줄을 눌러 들어간 상세에서도 같은 동작이 막힌다.",
    jsx: `const actions: SwipeAction[] = [
  { kind: "primary", label: "수정", icon: <Pencil />, onSelect: () => edit(tx) },
  // 카드사에서 받은 거래는 지우지 못한다 — 빼지 않고 막는다
  { kind: "destructive", label: "삭제", icon: <Trash2 />, disabled: tx.imported, onSelect: () => confirmDelete(tx) },
]`,
    render: () =>
      screen([
        swipeActions({
          actions: [EDIT_DELETE[0], { ...EDIT_DELETE[1], disabled: true }],
          rowLabel: TX[2].title,
          open: true,
          children: ledgerRow(TX[2]),
        }),
      ]),
  },
];
