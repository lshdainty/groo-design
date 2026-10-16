/*
 * shadcn Skeleton 예제 — docs site components/skeleton.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 넷(목록 — 틀은 그리고 데이터 자리만 · 모양 다섯 · 다른 달 · 앱 맨 위 · 요청 설정)은 차례 · 제목 ·
 * 코드가 specs/components/skeleton.md 의 "코드" 절과 같고, 뒤의 둘(가운데 원 · 모션 줄이기)은 md 의 "기다리는 동안" · State 를 코드로 더 보인다.
 * 옛 예제(animate-pulse · surface-input · 모서리 4 · 글자보다 낮은 막대 · SkeletonShimmer 브랜드 25% 띠)를 대신한다.
 *
 * ROOT · RADIUS · TEXT_HEIGHT · SHIMMER · SLOW · ENTER · CIRCLE_REGION · WAITING_TEXT · SLOW_TEXT 는 recipes/shadcn/components/ui/skeleton.tsx 의
 * 상수와, QUIET · SLOW_ABOVE · SLOW_BELOW 는 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다.
 * 둘레의 부품은 그 레시피의 값을 옮겨 썼다 — LIST_* 는 list.tsx(list-examples.mjs), PC_* 는 progress-circle.tsx(progress-circle-examples.mjs),
 * RESULT_* 는 result-section.tsx(result-section-examples.mjs), BUTTON_* 는 button.tsx(button-examples.mjs)의 것과 같다 — 이 파일이 쓰는 변형 · 크기와
 * 그에 걸리는 compound 만 옮겼다. 규칙은 specs/components/skeleton.md, 수치 원본은 specs/components/skeleton.yaml(region 은 기다리는 동안의 시간표).
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 스켈레톤 <span data-slot="skeleton" data-radius (data-text) aria-hidden> > 띠 <span data-slot="skeleton-shimmer">,
 * 기다리는 영역 <div data-slot="loading-region" data-state(quiet · waiting · slow · failed · ready) aria-busy (data-fallback="circle")> — 0 ~ 1초는
 * 자식을 보이지 않게([&>*]:invisible) 그려 높이를 지키고, 5초부터 오래 걸림 글 <p>(스켈레톤이면 위 · 원이면 아래)을 더한다.
 * 레시피의 스크립트(1초 · 5초 · 10초 시간표 · 화면의 상태 글 LoadingAnnouncer · 띠를 문서 시계에 맞추기)는 정적 HTML 에 없다 — 그림은 그 순간을 멈춘 것이다.
 * 같은 페이지의 띠는 함께 그려져 거의 한 박자로 지난다. 모션 줄이기의 모습은 motion-reduce: 클래스에서 접두어만 뗀 사본을 덧붙여 그렸다.
 * 카드 · 카드 제목 · 달 넘기기 · 금액 · 거래 줄은 미리보기 그림이고, 결과(Result Section)는 보인 뒤의 모습이다(처음 한 프레임 감추기 · 나타남 없음).
 * 0 ~ 1초 그림의 점선(outline-dashed — 영역의 className)은 보이지 않게 지킨 높이를 보이려는 미리보기용 덧칠이다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── skeleton.tsx 의 상수와 같은 값 ───────────────────────────────────────

// 상태 글 · 오래 걸림 글(Writing v106 — 영어 "Loading" · 세 점 "..." 을 쓰지 않는다)
const WAITING_TEXT = "불러오는 중…";
const SLOW_TEXT = "평소보다 오래 걸리고 있어요.";

// 모서리 — 화면 폭 사진 0 · 그림 자리 4 · 6 · 8(Image Frame — 폭으로) · 글 8 · 타일 12 · 카드 면 16 · 원 full
const RADIUS = {
  "0": "rounded-none",
  "4": "rounded-r1",
  "6": "rounded-r1_5",
  "8": "rounded-r2",
  "12": "rounded-r3",
  "16": "rounded-r4",
  full: "rounded-full",
};

// 글 자리의 높이 = 그 글자의 줄 높이(--text-tN--line-height)
const TEXT_HEIGHT = {
  t1: "h-(--text-t1--line-height)",
  t2: "h-(--text-t2--line-height)",
  t3: "h-(--text-t3--line-height)",
  t4: "h-(--text-t4--line-height)",
  t5: "h-(--text-t5--line-height)",
  t6: "h-(--text-t6--line-height)",
  t7: "h-(--text-t7--line-height)",
  t8: "h-(--text-t8--line-height)",
  t9: "h-(--text-t9--line-height)",
  t10: "h-(--text-t10--line-height)",
  t11: "h-(--text-t11--line-height)",
  t12: "h-(--text-t12--line-height)",
  t13: "h-(--text-t13--line-height)",
  t14: "h-(--text-t14--line-height)",
};

// 면 — 블록 span, 띠를 면 모양으로 자른다
const ROOT = "relative block overflow-hidden bg-bg-neutral-weak";

// 띠 — 면과 같은 크기, 처음 자리는 왼쪽 밖. 토큰 키프레임 shimmer(translateX −100% → 100%) · 1.5초 · easing. 모션 줄이기면 멈추고 지운다
const SHIMMER = [
  "pointer-events-none absolute inset-0 [transform:translateX(-100%)]",
  "bg-[image:var(--gradient-shimmer-neutral)] dark:bg-[image:var(--gradient-shimmer-neutral-dark)]",
  "animate-[shimmer_var(--motion-duration-loop)_var(--motion-ease-easing)_infinite]",
  "motion-reduce:animate-none motion-reduce:opacity-0",
].join(" ");

// 오래 걸림 글 — t4 · 400 · fg-neutral-muted, 단어 단위 줄바꿈(v114). 영역이 목록 카드(body="list")의 바로 아래 자식이면 좌우 24 —
// 목록 카드는 줄마다 24 를 가져 카드 여백이 없다(23B). 내용 카드 안이면 카드의 24 가 맡는다
const SLOW =
  "m-0 text-t4 font-normal text-fg-neutral-muted break-keep [overflow-wrap:break-word] [[data-slot=card][data-body=list]>[data-slot=loading-region]>&]:px-x6";

// 기다린 뒤 내용으로 — 투명도 0 → 1, motion-duration-d3 · motion-ease-enter(모션 줄이기면 바로)
const ENTER = "animate-[fade-in_var(--motion-duration-d3)_var(--motion-ease-enter)] motion-reduce:animate-none";

// 원 모드 — 영역 가운데 세로 묶음. 부모가 세로 flex 면 남는 높이를 채운다
const CIRCLE_REGION = "flex grow flex-col items-center justify-center";

// ── skeleton.tsx 의 JSX 에 적힌 클래스 ────────────────────────────────────

// 0 ~ 1초 — 그려 두되 보이지 않게(높이는 지킨다)
const QUIET = "[&>*]:invisible";
// 오래 걸림 글의 자리 — 스켈레톤이면 첫 스켈레톤 위 16 · 원이면 원 아래 16 · 가운데 맞춤
const SLOW_ABOVE = "mb-x4";
const SLOW_BELOW = "mt-x4 text-center";

// ── list.tsx 의 cva 와 같은 값 — 보기만 하는 줄(ListItem) ─────────────────

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
const LIST_PREFIX_BASE = "flex shrink-0 items-center pr-x3 text-fg-neutral [&>svg]:size-[22px]";
const LIST_PREFIX_VARIANTS = {
  disabled: { true: "text-fg-disabled [&_[data-list-tile]]:bg-bg-disabled [&_[data-list-tile]]:text-fg-disabled", false: "" },
};
const LIST_PREFIX_DEFAULTS = { disabled: false };
const LIST_BODY_BASE = "flex min-w-[calc(var(--text-t5)+var(--spacing-x2_5))] flex-1 flex-col items-start gap-x0_5 pr-x2_5 text-left";
const LIST_TITLE_BASE = "font-sans text-t5 font-normal text-fg-neutral [overflow-wrap:anywhere]";
const LIST_TITLE_VARIANTS = { disabled: { true: "text-fg-disabled", false: "" } };
const LIST_TITLE_DEFAULTS = { disabled: false };
const LIST_HIGHLIGHT_MUTED =
  "[@media(hover:hover)]:group-has-[[data-list-action]:not([data-disabled]):hover]/list-item:text-fg-neutral-muted group-has-[[data-list-action]:not([data-disabled]):active]/list-item:text-fg-neutral-muted";
const LIST_DETAIL_BASE = "font-sans text-t3 text-fg-neutral-subtle [overflow-wrap:anywhere]";
const LIST_DETAIL_VARIANTS = {
  disabled: { true: "text-fg-disabled", false: "" },
  highlighted: { true: LIST_HIGHLIGHT_MUTED, false: "" },
};
const LIST_DETAIL_DEFAULTS = { disabled: false, highlighted: false };
const LIST_SUFFIX_BASE =
  "flex items-center gap-x1 font-sans text-t5 text-fg-neutral-subtle [&>svg]:size-[18px] [&_a]:relative [&_a]:z-[1] [&_button]:relative [&_button]:z-[1]";
const LIST_SUFFIX_VARIANTS = {
  value: { node: "shrink-0", text: "min-w-0 shrink [overflow-wrap:anywhere]" },
  disabled: { true: "text-fg-disabled", false: "" },
  highlighted: { true: LIST_HIGHLIGHT_MUTED, false: "" },
};
const LIST_SUFFIX_COMPOUND = [{ disabled: false, highlighted: true, class: "[&>svg]:text-fg-neutral-subtle" }];
const LIST_SUFFIX_DEFAULTS = { value: "node", disabled: false, highlighted: false };

// ── progress-circle.tsx 의 상수와 같은 값 — 원 모드의 원 40 ────────────────

const PC_SIZE = {
  "24": "[--pc-size:24px] [--pc-thickness:3px]",
  "40": "[--pc-size:40px] [--pc-thickness:5px]",
  inherit: "[--pc-size:var(--progress-size,1em)] [--pc-thickness:var(--progress-thickness,2px)]",
};
const PC_TONE = {
  neutral: "[--pc-track:var(--color-stroke-neutral-subtle)] [--pc-range:var(--color-stroke-neutral-solid)]",
};
const PC_ROOT = "inline-block shrink-0 overflow-visible align-middle";
const PC_SPIN = "animate-[porest-progress-circle-rotate_1200ms_cubic-bezier(0.35,0.25,0.65,0.75)_infinite] motion-reduce:animate-none";
const PC_CIRCLE =
  "fill-none [cx:calc(var(--pc-size)/2)] [cy:calc(var(--pc-size)/2)] [r:calc(var(--pc-size)/2_-_var(--pc-thickness)/2)] [stroke-width:var(--pc-thickness)]";
const PC_TRACK = `${PC_CIRCLE} [stroke:var(--pc-track)]`;
const PC_RANGE = `${PC_CIRCLE} [stroke:var(--pc-range)] [stroke-linecap:round] [transform-box:fill-box] [transform-origin:center] [transform:rotate(-90deg)]`;
const PC_RANGE_INDETERMINATE = [
  "animate-[porest-progress-circle-head_1200ms_cubic-bezier(0.35,0,0.65,1)_infinite,porest-progress-circle-tail_1200ms_cubic-bezier(0.35,0,0.65,0.6)_infinite]",
  "motion-reduce:animate-none motion-reduce:[stroke-dasharray:75_200]",
].join(" ");
const PC_KEYFRAMES = [
  "@keyframes porest-progress-circle-rotate { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }",
  "@keyframes porest-progress-circle-head { 0% { stroke-dasharray: 0 200 } 75%, 100% { stroke-dasharray: 100 200 } }",
  "@keyframes porest-progress-circle-tail { 0%, 33.33% { stroke-dashoffset: 0 } 100% { stroke-dashoffset: -100 } }",
].join("\n");

// ── result-section.tsx 의 cva · 상수와 같은 값 — 10초 실패(failure · medium) ────

const RESULT_BASE = [
  "flex grow flex-col items-center justify-center px-x12 py-x4 text-center font-sans transition-none",
  "[[data-slot=card]_&]:px-0 [[data-slot=card][data-body=list]>&]:px-x6 [[data-slot=card][data-body=list]>[data-slot=loading-region]>&]:px-x6",
  "animate-in fade-in-0 duration-[var(--motion-duration-d3)] ease-[var(--motion-ease-enter)] motion-reduce:animate-none",
].join(" ");
const RESULT_ASSET = "mb-x4 flex shrink-0 [&>svg]:size-10 [&>svg]:[stroke-width:1.5]";
const RESULT_KIND_COLOR = { failure: "text-fg-critical" };
const RESULT_SIZES = { medium: { title: "text-t5", description: "mt-x2 text-t4", actions: "mt-x6" } };
const RESULT_TITLE = "font-bold text-fg-neutral break-keep [overflow-wrap:break-word]";
const RESULT_DESCRIPTION = "font-normal text-fg-neutral-muted break-keep [overflow-wrap:break-word]";
const RESULT_ACTIONS = "flex flex-col items-center gap-x5";

// ── button.tsx 의 cva 와 같은 값 — 다시 시도(neutralWeak · medium) ─────────

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
    neutralWeak:
      "bg-bg-neutral-weak text-fg-neutral hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed aria-busy:bg-bg-neutral-weak-pressed [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
  },
  size: { medium: "h-10 rounded-r2 [--press-basis:40] [--progress-size:16px]" },
  layout: { withText: "", iconOnly: "" },
  ghostColor: { neutral: "", neutralSubtle: "", brand: "", critical: "" },
  flush: { left: "", right: "" },
};
const BUTTON_COMPOUND = [{ size: "medium", layout: "withText", className: "px-x4 py-x2_5 gap-x1_5 text-t4 [&_svg]:size-4" }];
const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

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
const listPrefixVariants = cvaOf(LIST_PREFIX_BASE, { variants: LIST_PREFIX_VARIANTS, defaultVariants: LIST_PREFIX_DEFAULTS });
const listBodyVariants = cvaOf(LIST_BODY_BASE);
const listTitleVariants = cvaOf(LIST_TITLE_BASE, { variants: LIST_TITLE_VARIANTS, defaultVariants: LIST_TITLE_DEFAULTS });
const listDetailVariants = cvaOf(LIST_DETAIL_BASE, { variants: LIST_DETAIL_VARIANTS, defaultVariants: LIST_DETAIL_DEFAULTS });
const listSuffixVariants = cvaOf(LIST_SUFFIX_BASE, {
  variants: LIST_SUFFIX_VARIANTS,
  compoundVariants: LIST_SUFFIX_COMPOUND,
  defaultVariants: LIST_SUFFIX_DEFAULTS,
});
const resultSectionVariants = cvaOf(RESULT_BASE);
const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });

// "motion-reduce:animate-none" → ["motion-reduce", "animate-none"] — 괄호 안의 ":" 는 가르지 않는다
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

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다 — 이 파일이 합치는 무리만 안다(애니메이션 · 불투명도 · 임의 속성)
const GROUPS = [
  [/^animate-/, "animate"],
  [/^opacity-/, "opacity"],
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

// 정적 미리보기에서 모션 줄이기의 모습을 보이려고 — motion-reduce: 클래스에서 접두어만 뗀 사본을 뒤에 붙인다(merge 가 겹치는 기본값을 지운다)
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

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 의 아이콘과 같은 모양(24 격자) — 결과의 circle-alert
const CIRCLE_ALERT =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>';

// <Skeleton> — radius · text · className(크기 · 폭). reduced 는 미리보기용 — 모션 줄이기의 모습
function skeleton({ radius = "8", text, className = "", reduced = false } = {}) {
  const root = [ROOT, RADIUS[radius], text && TEXT_HEIGHT[text], className].filter(Boolean).join(" ");
  const shimmer = reduced ? forced(SHIMMER, "motion-reduce") : SHIMMER;
  return `<span ${attrs([
    'data-slot="skeleton"',
    `data-radius="${radius}"`,
    text && `data-text="${text}"`,
    `class="${root}"`,
    'aria-hidden="true"',
  ])}><span data-slot="skeleton-shimmer" class="${shimmer}"></span></span>`;
}

// <ListItem> — 보기만 하는 줄(앞 · 제목 · 설명 · 뒤)
function listItem({ title, detail, prefix, suffix }) {
  const part = (html, cls) => (html ? `<span class="${cls}">${html}</span>` : "");
  const body = `<span class="${listTitleVariants()}">${title}</span>${detail ? `<span class="${listDetailVariants()}">${detail}</span>` : ""}`;
  return `<li class="${listItemVariants()}"><div class="${listContentVariants()}">${part(prefix, listPrefixVariants())}<span class="${listBodyVariants()}">${body}</span>${part(suffix, listSuffixVariants())}</div></li>`;
}

// TransactionRowsSkeleton(md 코드) — 줄 껍데기는 실제 List 그대로. 글 자리는 text 로 그 글자의 줄 높이(t5 22 · t3 18)
const transactionRowsSkeleton = (rows, reduced = false) =>
  `<ul class="${listVariants()}">${Array.from({ length: rows }, () =>
    listItem({
      prefix: skeleton({ radius: "12", className: "size-10", reduced }),
      title: skeleton({ text: "t5", className: "w-32", reduced }),
      detail: skeleton({ text: "t3", className: "w-20", reduced }),
      suffix: skeleton({ text: "t5", className: "w-16", reduced }),
    }),
  ).join("")}</ul>`;

// <ProgressCircle size="40" /> — 원 모드의 원(값 없는 원)
const PC_STYLE = `<style data-href="porest-progress-circle" data-precedence="porest">${PC_KEYFRAMES}</style>`;
const circle40 = () =>
  `<svg ${attrs([
    'role="progressbar"',
    'aria-label="불러오는 중"',
    'data-slot="progress-circle"',
    'data-size="40"',
    'data-tone="neutral"',
    'data-mode="indeterminate"',
    `class="${[PC_ROOT, PC_SIZE["40"], PC_TONE.neutral, PC_SPIN].join(" ")}"`,
    'style="width:var(--pc-size); height:var(--pc-size);"',
  ])}><circle data-slot="progress-circle-track" class="${PC_TRACK}"></circle><circle data-slot="progress-circle-range" pathLength="100" class="${PC_RANGE} ${PC_RANGE_INDETERMINATE}"></circle></svg>`;

// 사이트의 `.content p { margin: 12px 0; color: text-primary }` 는 층(@layer) 밖 규칙이라 Tailwind utility 를 늘 이긴다 — 결과의 설명 <p> 에는
// 클래스가 정한 위 여백(mt-x2) · 글자색(fg-neutral-muted)을 style 로 한 번 더 적는다(레시피에는 없는 미리보기용 덧칠 — result-section-examples.mjs 와 같다)
const P_FIX = "margin:var(--spacing-x2) 0 0; color:var(--color-fg-neutral-muted);";

// <ResultSection kind="failure" size="medium" … primaryAction> — 보인 뒤의 모습
function failure(title) {
  const s = RESULT_SIZES.medium;
  return `<div role="status" data-slot="result-section" data-kind="failure" data-size="medium" class="${resultSectionVariants()}"><span aria-hidden="true" data-slot="result-section-asset" class="${RESULT_ASSET} ${RESULT_KIND_COLOR.failure}">${CIRCLE_ALERT}</span><h2 data-slot="result-section-title" class="${RESULT_TITLE} ${s.title}">${esc(title)}</h2><p data-slot="result-section-description" class="${RESULT_DESCRIPTION} ${s.description}" style="${P_FIX}">잠시 후 다시 시도해주세요.</p><div data-slot="result-section-actions" class="${RESULT_ACTIONS} ${s.actions}"><button type="button" class="${buttonVariants({ variant: "neutralWeak", size: "medium" })}">다시 시도</button></div></div>`;
}

// <LoadingRegion> — state: quiet(0 ~ 1초) · waiting(1초 ~) · slow(5초 ~) · failed · ready. circle 이면 fallback="circle"(원 40)
function loadingRegion({ state = "waiting", fallback = "", failureHtml = "", content = "", circle = false, waited = true, className = "" }) {
  const waiting = state === "quiet" || state === "waiting" || state === "slow";
  const slow = state === "slow";
  let body;
  if (state === "failed") body = failureHtml;
  else if (!waiting) body = content;
  else if (circle) body = `${circle40()}${slow ? `<p class="${SLOW} ${SLOW_BELOW}">${SLOW_TEXT}</p>` : ""}`;
  else body = `${slow ? `<p class="${SLOW} ${SLOW_ABOVE}">${SLOW_TEXT}</p>` : ""}${fallback}`;
  const cls = [waiting && circle && CIRCLE_REGION, state === "quiet" && QUIET, state === "ready" && waited && ENTER, className].filter(Boolean).join(" ");
  return `<div ${attrs([
    'data-slot="loading-region"',
    `data-state="${state}"`,
    circle && waiting && 'data-fallback="circle"',
    waiting && 'aria-busy="true"',
    cls && `class="${cls}"`,
  ])}>${body}</div>`;
}

// 화면 그림 — 카드 · 카드 제목 · 달 넘기기 · 금액 · 거래 줄(미리보기 그림). 카드는 card.md(2026-10-08)의 목록 카드 — 흰 면 + 1px stroke-neutral-weak ·
// 모서리 16 · 그림자 없음, 머리 위 24 · 좌우 24 · 아래 4 · 제목 16 / 22 · 700, 카드 아래 12(마지막 줄의 12 와 합쳐 보이는 24)
const CARD =
  "display:flex; flex-direction:column; width:100%; max-width:360px; padding-bottom:var(--spacing-x3); border:1px solid var(--color-stroke-neutral-weak); border-radius:var(--radius-r4); background:var(--color-bg-layer-default); font-family:var(--font-sans);";
const CARD_TITLE =
  "margin:0; padding:var(--spacing-x6) var(--spacing-x6) var(--spacing-x1); font-size:var(--text-t5); line-height:var(--text-t5--line-height); font-weight:700; color:var(--color-fg-neutral);";
// data-slot · data-body 는 레시피 Card 의 자리 — 안의 Result Section 이 카드 안의 좌우(23B)를 따른다
const card = (title, body, extra = "") => `<div data-slot="card" data-variant="default" data-body="list" style="${CARD} ${extra}"><h3 style="${CARD_TITLE}">${esc(title)}</h3>${body}</div>`;
const CAPTION =
  "font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) =>
  `<div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--spacing-x2); min-width:0; width:100%; max-width:360px;">${html}<span style="${CAPTION}">${caption}</span></div>`;
const GRID = "display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 260px), 1fr)); gap:var(--spacing-x6) var(--spacing-x4); align-items:start;";
const MONTH =
  "display:flex; align-items:center; gap:var(--spacing-x2); padding:var(--spacing-x4) var(--spacing-x6) var(--spacing-x1); font-size:var(--text-t6); line-height:var(--text-t6--line-height); font-weight:700; color:var(--color-fg-neutral);";
const SUM_LABEL = "padding:var(--spacing-x2) var(--spacing-x6) var(--spacing-x1); font-size:var(--text-t4); line-height:var(--text-t4--line-height); color:var(--color-fg-neutral-subtle);";
const SUM_BOX = "padding:0 var(--spacing-x6) var(--spacing-x4);";
const CHEVRON = (d) =>
  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const skeletonExamples = [
  {
    title: "목록 — 틀은 그리고 데이터 자리만",
    description:
      "화면의 틀(카드 면 · 카드 제목 \"최근 거래\")은 처음부터 실제로 그리고, 서버에서 올 데이터 자리만 스켈레톤이다. 줄 껍데기는 실제 List 줄 그대로다 — 앞 타일 40(radius=\"12\" — List 타일 · Logo Tile 과 같은 모서리) · 제목 자리 text=\"t5\"(16 글자의 줄 높이 22) · 설명 자리 text=\"t3\"(18) · 금액 자리 t5 라 줄 높이가 내용과 같은 66 이다(데이터가 와도 목록이 밀리지 않는다). 면은 bg-neutral-weak(흰 면 위 1.08:1 — 흰 면 위에만 둔다)이고 흰 띠가 자기 폭만큼 1.5초(motion-duration-loop · motion-ease-easing)에 지난다. LoadingRegion 이 시간표를 맡는다 — 1초까지는 보이지 않게 그려 높이만 지키고, 1초부터 스켈레톤(그림은 이 순간), 5초에 오래 걸림 글, 10초에 failure. 영역에 aria-busy, 스켈레톤은 aria-hidden 이다.",
    jsx: `import { LoadingRegion, Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { List, ListItem } from "@/components/ui/list"
import { ResultSection } from "@/components/ui/result-section"

// 줄 껍데기는 실제 List 그대로 — 글 자리는 text 로 그 글자의 줄 높이(t5 22 · t3 18)
function TransactionRowsSkeleton({ rows }: { rows: number }) {
  return (
    <List>
      {Array.from({ length: rows }, (_, i) => (
        <ListItem
          key={i}
          prefix={<Skeleton radius="12" className="size-10" />}
          title={<Skeleton text="t5" className="w-32" />}
          detail={<Skeleton text="t3" className="w-20" />}
          suffix={<Skeleton text="t5" className="w-16" />}
        />
      ))}
    </List>
  )
}

<Card body="list">
  <CardHeader><CardTitle>최근 거래</CardTitle></CardHeader>{/* 틀 — 처음부터 그린다. 목록 카드는 줄이 가장자리까지(card.md) */}
  <LoadingRegion
    pending={query.isPending}
    failed={query.isError && !query.data}
    fallback={<TransactionRowsSkeleton rows={4} />}
    failure={
      <ResultSection
        kind="failure"
        size="medium"
        title="거래를 불러오지 못했어요"
        description="잠시 후 다시 시도해주세요."
        primaryAction={{ label: "다시 시도", onClick: () => query.refetch() }}
      />
    }
  >
    <TransactionList items={query.data} />
  </LoadingRegion>
</Card>`,
    render: () => card("최근 거래", loadingRegion({ state: "waiting", fallback: transactionRowsSkeleton(4) })),
  },

  {
    title: "모양 다섯",
    description:
      "모서리는 곧 올 내용의 모양을 따른다 — 글 · 숫자 8(기본 · rounded-r2), 그림 자리(썸네일 · 카드 그림)는 Image Frame 의 모서리 — 폭 24 이하 4(rounded-r1) · 48 이하 6(rounded-r1_5) · 그 위 8 — 로 다 받은 그림과 같다(손으로 고르지 않고 imageFrameRadius(폭) 으로 고른다), 카드 면(Card 모양 자리 전체)만 16(rounded-r4), 아바타 · 원 아이콘 · 칩 full, 화면 끝에 붙는 사진 0. 목록 앞 타일 · Logo Tile 40 은 12 다. 크기는 그 자리에 올 내용의 크기이고, 글 자리는 text 로 그 글자의 줄 높이를 높이로 준다(t4 14 → 19). 폭은 className 이다.",
    jsx: `<Skeleton text="t4" className="w-40" />                  {/* 글 — 높이 19, 모서리 8(기본) */}
<Skeleton radius="6" className="size-10" />               {/* 썸네일 40 — Image Frame 모서리(폭 48 이하 6) */}
<Skeleton radius="16" className="h-28 w-full" />          {/* 카드 면 */}
<Skeleton radius="full" className="size-10" />            {/* 아바타 */}
<Skeleton radius="0" className="aspect-[4/3] w-full" />  {/* 화면 폭 사진 */}`,
    render: () =>
      `<div style="${GRID}">${[
        [skeleton({ text: "t4", className: "w-40" }), "text=\"t4\" — 19 · 모서리 8"],
        [skeleton({ radius: "6", className: "size-10" }), "radius=\"6\" — 썸네일 40(Image Frame)"],
        [skeleton({ radius: "16", className: "h-28 w-full" }), "radius=\"16\" — 카드 면"],
        [skeleton({ radius: "full", className: "size-10" }), "radius=\"full\" — 아바타"],
        [skeleton({ radius: "0", className: "aspect-[4/3] w-full" }), "radius=\"0\" — 화면 폭 사진"],
      ]
        .map(([html, caption]) => labeled(`<div style="width:100%; padding:var(--spacing-x4); border-radius:var(--radius-r3); background:var(--color-bg-layer-default); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle);">${html}</div>`, caption))
        .join("")}</div>`,
  },

  {
    title: "다른 달 — 머리는 바로, 숫자 자리만",
    description:
      "달 · 기간 · 필터를 바꾸면 머리(고른 달 이름)와 고정 틀은 바로 바뀌고, 바뀔 숫자 · 목록 자리만 기다린다. 옛 달의 숫자는 그 순간 지운다 — 새 달 이름 아래 옛 숫자를 남기지 않는다(돈 숫자라 잘못 읽힌다). 그래서 placeholderData 로 옛 값을 이어 보이지 않는다. 지운 자리는 같은 시간표를 따른다 — 1초까지는 비워 두고(높이는 지킨다) 그 뒤 스켈레톤이다. 이미 받아 둔 달이면 바로 보인다. 그림은 9월로 넘긴 뒤 1초가 지난 순간이다(금액 자리 t9 — 24 글자의 줄 높이 32).",
    jsx: `// 달 이름(틀)은 고른 달을 바로 보이고, 숫자는 그 달의 쿼리를 기다린다.
// 옛 달 값을 이어서 보이지 않는다 — placeholderData 를 쓰지 않는다
const stats = useQuery({ queryKey: ["stats", month], queryFn: () => getStats(month) })

<MonthNav value={month} onValueChange={setMonth} />
<LoadingRegion
  pending={stats.isPending}
  failed={stats.isError && !stats.data}
  fallback={<Skeleton text="t9" className="w-36" />}
  failure={<ResultSection kind="failure" size="medium" title="통계를 불러오지 못했어요" primaryAction={{ label: "다시 시도", onClick: () => stats.refetch() }} />}
>
  <Amount value={stats.data?.total} />
</LoadingRegion>`,
    render: () =>
      `<div style="${CARD}"><div style="${MONTH}"><span aria-hidden="true" style="display:flex; color:var(--color-fg-neutral-subtle);">${CHEVRON("m15 18-6-6 6-6")}</span><span>2026년 9월</span><span aria-hidden="true" style="display:flex; color:var(--color-fg-neutral-subtle);">${CHEVRON("m9 18 6-6-6-6")}</span></div><div style="${SUM_LABEL}">지출</div><div style="${SUM_BOX}">${loadingRegion({ state: "waiting", fallback: skeleton({ text: "t9", className: "w-36" }) })}</div></div>`,
  },

  {
    title: "앱 맨 위 · 요청 설정",
    description:
      "화면의 상태 글은 하나다 — LoadingAnnouncer 를 앱 맨 위에 한 번 두면 body 끝에 보이지 않는 role=\"status\"(polite) 를 두고, 기다리는 영역 중 하나가 1초가 되면 \"불러오는 중…\", 5초가 되면 \"평소보다 오래 걸리고 있어요.\" 를 넣는다(같은 글은 한 번만, 다 오면 비운다). 요청은 제품 코드다 — LOADING_TIMING(showAfter 1000 · slowAfter 5000 · timeout 10000 · retryDelays [1000, 2000])으로 읽기만 1초 · 2초 뒤 2번 다시 시도하고, 다시 시도까지 합쳐 10초 안에 끝낸다. 4xx 와 쓰기(저장 · 삭제)는 다시 보내지 않는다. 그림은 한 영역의 0 ~ 1초 · 1초 · 5초 · 10초다(0 ~ 1초는 점선 자리 — 보이지 않게 그려 높이를 지킨다).",
    jsx: `import { LOADING_TIMING, LoadingAnnouncer } from "@/components/ui/skeleton"

// 화면의 상태 글 하나 — LoadingRegion 들이 여기에 알린다(같은 글은 한 번만 읽는다)
<LoadingAnnouncer>
  <App />
</LoadingAnnouncer>

// 요청은 제품 코드다(레시피 밖) — 읽기는 2번까지 1초 · 2초 뒤, 4xx 와 쓰기는 다시 보내지 않는다.
// 한 번의 불러오기는 다시 시도까지 합쳐 LOADING_TIMING.timeout(10초) 안에 끝낸다
new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, error) => count < LOADING_TIMING.retryDelays.length && isRetryable(error),
      retryDelay: (count) => LOADING_TIMING.retryDelays[count] ?? LOADING_TIMING.retryDelays[LOADING_TIMING.retryDelays.length - 1] ?? 0,
    },
    mutations: { retry: false },
  },
})`,
    render: () => {
      const phase = (state, caption, said, outline = false) =>
        labeled(
          card(
            "최근 거래",
            loadingRegion({
              state,
              fallback: transactionRowsSkeleton(3),
              failureHtml: failure("거래를 불러오지 못했어요"),
              className: outline ? "outline-1 -outline-offset-1 outline-dashed outline-stroke-neutral-weak" : "",
            }),
          ),
          `${caption} · 상태 글 ${said}`,
        );
      return `<div style="${GRID}">${[
        phase("quiet", "0 ~ 1초 — quiet · aria-busy", "(비어 있음)", true),
        phase("waiting", "1초 — waiting", `"${WAITING_TEXT}"`),
        phase("slow", "5초 — slow", `"${SLOW_TEXT}"`),
        phase("failed", "10초 — failed", "(Result Section 이 알린다)"),
      ].join("")}</div>`;
    },
  },

  {
    title: "가운데 원 — fallback=\"circle\"",
    description:
      "구조를 미리 그릴 수 없는 자리(검색 결과 · 결과 화면 전체)는 fallback=\"circle\" — 영역 가운데 Progress Circle 40 이다. 영역이 가운데 맞춤 세로 묶음이 되고, 부모가 세로 flex 면 남는 높이를 채운다. 5초가 지나면 원 아래 16 에 가운데 맞춤으로 \"평소보다 오래 걸리고 있어요.\" 한 줄을 더한다 — 원은 그대로다. 틀(머리 · 검색칸 · 카드 면)은 그린다. 그림은 5초가 지난 순간이다.",
    jsx: `<LoadingRegion
  pending={results.isPending}
  failed={results.isError && !results.data}
  fallback="circle"
  failure={<ResultSection kind="failure" size="medium" title="검색 결과를 불러오지 못했어요" primaryAction={{ label: "다시 시도", onClick: () => results.refetch() }} />}
>
  <SearchResults items={results.data} />
</LoadingRegion>`,
    render: () =>
      `${PC_STYLE}${card("검색 결과", loadingRegion({ state: "slow", circle: true, className: "" }), "height:280px;")}`,
  },

  {
    title: "모션 줄이기 — 띠가 멈춘다",
    description:
      "모션 줄이기(prefers-reduced-motion: reduce)면 띠를 멈추고 지운다(motion-reduce:animate-none · opacity-0) — 면만 남는다(v104). 흰 면 위 1.08:1 이라 자리는 옅게 보이고, 기다리는 상태는 영역의 aria-busy 와 화면의 상태 글이 알린다. 시간표 · 상태 글은 그대로다. 정적 미리보기라 motion-reduce: 클래스에서 접두어만 뗀 사본을 덧붙여 그 모습을 보였다.",
    jsx: `// 모션 줄이기는 고르는 prop 이 없다 — Skeleton 의 띠에 motion-reduce:animate-none motion-reduce:opacity-0 이 걸려 있다
<TransactionRowsSkeleton rows={3} />`,
    render: () => card("최근 거래", loadingRegion({ state: "waiting", fallback: transactionRowsSkeleton(3, true) })),
  },
];
