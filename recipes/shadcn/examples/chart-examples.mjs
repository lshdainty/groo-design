/*
 * shadcn Chart 예제 — docs site components/chart.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 셋(수입 · 지출 추이 — 이중 축 · 카테고리 도넛 — 목록 범례 · 표로 보기 · 비었음 · 실패)은
 * 차례 · 제목 · 코드가 specs/components/chart.md 의 "코드" 절과 같고, 뒤의 둘(툴팁 — 오늘을 짚은 순간 · 열지도)은 md 의 툴팁 · 열지도를 코드로 더 보인다.
 * SEED 에는 차트 컴포넌트도 차트 색도 없다 — 이중 축 · 계열 색 눈금 · 가로 격자 · 세로 점선 가리킴 · "■ 라벨 값" 툴팁 · 위 지표 타일은 SEED Layout 의
 * 대시보드 그림을, 색 배정 · 범례 · 열지도 · 빈 · 실패 · 접근성은 porest 가 정했다(2026-10-08). 옛 예제(shadcn ChartContainer · 16:9 · 아래 점 범례 ·
 * 테두리 툴팁)를 대신한다.
 *
 * CHART_ORDER · DOT_BG · SUBTLE_BG · MINUS · chartGridProps · ACTIVE_DOT · DRAW · CHART_ROOT · TOOLTIP_SURFACE · LEGEND_TILE · LEGEND_TILE_HIDDEN · LEGEND_ROW ·
 * LEGEND_ROW_PRESSABLE · HOLE_INSET · HEAT_MIX · HEAT_STEP_BG · HEAT_STEP_SWATCH 는 recipes/shadcn/components/ui/chart.tsx 의 상수와, formatAxisWon · formatWon ·
 * assignChartColors · heatStep 은 그 파일의 함수(형 표기만 뗐다 — 같은 입력에 같은 답)와, TIP_* · TILES_* · TILE_* · DONUT_* · CENTER_* · HEAT_* 는 그 파일의
 * JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 둘레의 부품은 그 레시피의 값을 옮겨 썼다 — CELL · HEAD_CELL · BODY_CELL · ALIGN ·
 * TABLE_* 는 table.tsx(표로 보기 — ChartDataTable 이 Table 을 쓴다), CARD_* 는 card.tsx, BUTTON_* 는 button.tsx, RESULT_* 는 result-section.tsx 의 것과 같다.
 * 규칙은 specs/components/chart.md, 수치 원본은 specs/components/chart.yaml. 색은 DESIGN.md 의 v110(차트 10색) · v111(옅은 바탕)이다.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * recharts 는 정적 HTML 에서 돌지 않는다 — 차트 그림(격자 · 눈금 · 선 · 영역 · 조각 · 가리킴 선 · 점)은 레시피가 recharts 에 넘기는 값
 * (chartAxisProps · chartGridProps · ACTIVE_DOT · 선 2 · 영역 25% → 0% · 조각 사이 0 · 12시에서 시계 방향)으로 손으로 그린 SVG 다.
 * 차트 상자 <div data-slot="chart" role="img" aria-label aria-describedby> · 지표 타일(<div role="group" data-slot="chart-legend-tiles"> > <button aria-pressed>) ·
 * 툴팁(<div data-slot="chart-tooltip">) · 도넛 범례(<ul data-slot="chart-donut-legend">) · 가운데 합계 · 열지도(<div data-slot="chart-heatmap" role="img">) ·
 * 표로 보기는 레시피가 그리는 DOM 그대로다. 레시피의 스크립트(가리키기 · ← → · 타일 켜고 끄기 · 칸 폭 재기 · 단계마다 글자색 재기)는 정적 HTML 에 없다 —
 * 그림은 그 순간을 멈춘 것이고, 열지도 칸 글자색은 Desk 라이트의 답(75 · 100% 흰 글자)을 적었다. 아이콘은 lucide-react 와 같은 모양의 inline SVG 다.
 */

// ── chart.tsx 의 상수와 같은 값 ─────────────────────────────────────

const CHART_ORDER = ["blue", "green", "orange", "violet", "pink", "indigo", "red", "yellow", "brown"];
const DOT_BG = {
  blue: "bg-chart-blue",
  green: "bg-chart-green",
  orange: "bg-chart-orange",
  violet: "bg-chart-violet",
  pink: "bg-chart-pink",
  indigo: "bg-chart-indigo",
  red: "bg-chart-red",
  yellow: "bg-chart-yellow",
  brown: "bg-chart-brown",
  gray: "bg-chart-gray",
};
const SUBTLE_BG = {
  blue: "bg-chart-blue-subtle",
  green: "bg-chart-green-subtle",
  orange: "bg-chart-orange-subtle",
  violet: "bg-chart-violet-subtle",
  pink: "bg-chart-pink-subtle",
  indigo: "bg-chart-indigo-subtle",
  red: "bg-chart-red-subtle",
  yellow: "bg-chart-yellow-subtle",
  brown: "bg-chart-brown-subtle",
  gray: "bg-chart-gray-subtle",
};
const MINUS = "\u2212";
const chartGridProps = {
  vertical: false,
  strokeDasharray: "3 3",
  stroke: "var(--color-stroke-neutral-subtle)",
};
const ACTIVE_DOT = { r: 4, strokeWidth: 2, stroke: "var(--color-bg-layer-default)" };
const DRAW = { animationDuration: 300, animationEasing: "ease-out" };
const CHART_ROOT = [
  "relative w-full rounded-r2 font-sans",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "[&_.recharts-cartesian-axis-tick-value]:tabular-nums",
  // 가리킨 점의 테두리는 카드 면 색(라이브러리 기본 흰색을 덮는다) · 늘 찍는 점은 두지 않는다
  "[&_.recharts-active-dot_.recharts-dot]:stroke-bg-layer-default [&_.recharts-line-dots]:hidden [&_.recharts-area-dots]:hidden",
  "[&_.recharts-surface]:outline-none [&_.recharts-wrapper]:outline-none [&_.recharts-sector]:outline-none",
].join(" ");
const TOOLTIP_SURFACE = "flex min-w-[128px] flex-col gap-x1 rounded-r3 bg-bg-layer-floating px-x3 py-x2_5 font-sans text-fg-neutral shadow-[var(--shadow-s3)]";
const LEGEND_TILE = [
  "flex min-w-[100px] flex-[1_1_0] cursor-pointer flex-col items-start rounded-r3 border-0 px-x3 py-x2_5 text-start font-sans",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1] aria-disabled:cursor-not-allowed aria-disabled:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
const LEGEND_TILE_HIDDEN = "bg-bg-layer-default shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] hover:bg-bg-layer-default-pressed";
const LEGEND_ROW = "flex min-h-11 w-full items-center gap-x2 text-start font-sans text-t4";
const LEGEND_ROW_PRESSABLE = [
  "relative isolate -mx-x6 w-[calc(100%+var(--spacing-x6)*2)] cursor-pointer border-0 bg-transparent px-x6",
  "before:pointer-events-none before:absolute before:inset-y-0 before:inset-x-x1_5 before:-z-10 before:rounded-r2_5 before:bg-transparent before:content-['']",
  "before:[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "hover:before:bg-bg-layer-default-pressed active:before:bg-bg-layer-default-pressed",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
const HOLE_INSET = 4;
const HEAT_MIX = [0.18, 0.35, 0.55, 0.75, 1];
const HEAT_STEP_BG = [
  "bg-[color-mix(in_srgb,var(--color-bg-brand-solid)_18%,var(--color-bg-layer-default))]",
  "bg-[color-mix(in_srgb,var(--color-bg-brand-solid)_35%,var(--color-bg-layer-default))]",
  "bg-[color-mix(in_srgb,var(--color-bg-brand-solid)_55%,var(--color-bg-layer-default))]",
  "bg-[color-mix(in_srgb,var(--color-bg-brand-solid)_75%,var(--color-bg-layer-default))]",
  "bg-bg-brand-solid",
];
const HEAT_STEP_SWATCH = [
  "color-mix(in srgb, var(--color-bg-brand-solid) 18%, var(--color-bg-layer-default))",
  "color-mix(in srgb, var(--color-bg-brand-solid) 35%, var(--color-bg-layer-default))",
  "color-mix(in srgb, var(--color-bg-brand-solid) 55%, var(--color-bg-layer-default))",
  "color-mix(in srgb, var(--color-bg-brand-solid) 75%, var(--color-bg-layer-default))",
  "var(--color-bg-brand-solid)",
];

// ── chart.tsx 의 JSX 에 적힌 클래스 ─────────────────────────────────

const CROSSHAIR = "stroke-stroke-neutral-weak";
const TIP_ROW = "flex items-center text-t3";
const TIP_SWATCH = "mr-x1_5 size-2 shrink-0 rounded-[2px]";
const TIP_LABEL = "text-fg-neutral-muted";
const TIP_VALUE = "ml-auto pl-x3 font-bold tabular-nums text-fg-neutral";
const TIP_HEAD = "text-t2 text-fg-neutral-subtle";
const TILES_ROW = "mb-x2 flex flex-wrap gap-x2";
const TILE_NAME = "flex items-center gap-x1_5 text-t3 text-fg-neutral-muted";
const TILE_DOT = "size-2 shrink-0 rounded-full";
const TILE_TOTAL = "mt-x0_5 text-t5 font-bold tabular-nums text-fg-neutral";
const DONUT_LEGEND = "m-0 flex list-none flex-col p-0";
const DONUT_ITEM = "flex";
const DONUT_SWATCH = "size-2.5 shrink-0 rounded-[2px]";
const DONUT_LABEL = "min-w-0 flex-1 text-fg-neutral";
const DONUT_PERCENT = "tabular-nums text-fg-neutral-subtle";
const DONUT_AMOUNT = "font-bold tabular-nums text-fg-neutral";
const CENTER = "pointer-events-none absolute inset-0 flex items-center justify-center";
const CENTER_TEXT = "flex w-max flex-col items-center text-center font-sans";
const CENTER_LABEL = "text-t2 text-fg-neutral-subtle";
const CENTER_AMOUNT = "whitespace-nowrap text-t5 font-bold tabular-nums text-fg-neutral";
const HEAT_ROOT = ["relative grid w-full gap-x1_5 rounded-r2 font-sans", "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring"];
const HEAT_COLUMN = "text-center text-t2 text-fg-neutral-subtle";
const HEAT_ROW = "flex min-w-0 flex-col justify-center";
const HEAT_ROW_LABEL = "text-t3 font-bold text-fg-neutral";
const HEAT_ROW_SUB = "text-t1 text-fg-neutral-subtle";
const HEAT_CELL = "flex aspect-square min-w-0 items-center justify-center overflow-hidden rounded-r1 text-t1 font-bold tabular-nums whitespace-nowrap";
const HEAT_EMPTY = "bg-bg-neutral-weak text-fg-neutral-subtle";
const HEAT_TEXT = { white: "text-static-white", neutral: "text-fg-neutral" };
const HEAT_TIP = "pointer-events-none fixed z-(--z-floating)";

// ── table.tsx 의 상수 · JSX 클래스와 같은 값 — 표로 보기(ChartDataTable 이 Table 을 쓴다) ──

const CELL = [
  "border-b border-solid border-stroke-neutral-subtle px-x4 align-middle font-sans text-t4 leading-[1.25rem] text-fg-neutral",
  "first:pl-x6 last:pr-x6",
].join(" ");
const HEAD_CELL = "py-x2_5 font-medium whitespace-nowrap";
const BODY_CELL = "py-x3 font-normal [&>*]:align-top";
const ALIGN = {
  start: "text-start",
  end: "text-end tabular-nums",
};
const ROW = "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]";
const TABLE_BOX = "relative w-full overflow-x-auto";
const TABLE_FRAME = "w-fit min-w-full";
const TABLE_EL = "w-full border-separate border-spacing-0 font-sans text-t4 text-fg-neutral";
const SR_ONLY = "sr-only";

// ── card.tsx 의 상수 · JSX 클래스와 같은 값 — 차트를 담는 카드 ───────────────

const CARD_ROOT = "relative isolate block overflow-hidden rounded-r4 text-start font-sans text-fg-neutral no-underline";
const CARD_VARIANT = {
  default: "border border-solid border-stroke-neutral-weak bg-bg-layer-default",
  // 그라디언트 끝은 모드마다 다른 단계 — 다크에서 brand-900 은 밝은 #7AA9F6 이라 쓰지 않는다
  hero: [
    "border-0 text-static-white",
    "bg-[linear-gradient(135deg,var(--color-bg-brand-solid),var(--color-brand-900))]",
    "dark:bg-[linear-gradient(135deg,var(--color-bg-brand-solid),var(--color-brand-300-dark))]",
  ].join(" "),
};
const CARD_BODY = {
  content: "p-x6",
  // 좌우 · 위 0 — 머리가 위 24 · 좌우 24 를 갖고, 줄이 제 좌우 24 · 위아래 12 를 가진다. 아래 12 + 마지막 줄 12 = 보이는 24.
  // 머리가 없으면 위도 12 — 첫 줄 12 와 합쳐 보이는 24(위 · 아래 같게)
  list: "pb-x3 [&:not(:has(>[data-slot=card-header]))]:pt-x3",
};
const CARD_HEADER = "flex items-center justify-between gap-x2";
const CARD_HEADER_BODY = { list: "px-x6 pb-x1 pt-x6", content: "pb-x2" };
const CARD_TITLE = "min-w-0 font-sans text-t5 font-bold text-fg-neutral";

// ── button.tsx 의 cva 와 같은 값 — 다시 시도 ─────────────────────────

const BUTTON_BASE = "relative inline-flex items-center justify-center whitespace-nowrap font-sans font-bold before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring disabled:cursor-not-allowed disabled:[scale:1] disabled:bg-bg-disabled disabled:text-fg-disabled aria-busy:cursor-progress aria-busy:text-transparent aria-busy:[&>svg:not([data-slot=progress-circle])]:invisible aria-busy:active:[scale:1] [--progress-thickness:2px] [&_svg]:pointer-events-none [&_svg]:shrink-0";
const BUTTON_VARIANTS = {
  variant: {
    neutralWeak: "bg-bg-neutral-weak text-fg-neutral hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed aria-busy:bg-bg-neutral-weak-pressed [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
    ghost: "bg-transparent text-fg-neutral hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed aria-busy:bg-bg-layer-default-pressed disabled:bg-transparent [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
  },
  size: {
    small: "h-9 rounded-r2 [--press-basis:36] [--progress-size:14px]",
    medium: "h-10 rounded-r2 [--press-basis:40] [--progress-size:16px]",
  },
  layout: { withText: "" },
  ghostColor: { neutral: "" },
};
const BUTTON_COMPOUND = [
  { size: "small", layout: "withText", className: "px-x3_5 py-x2 gap-x1 text-t4 [&_svg]:size-3.5" },
  { size: "medium", layout: "withText", className: "px-x4 py-x2_5 gap-x1_5 text-t4 [&_svg]:size-4" },
];
const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// ── result-section.tsx 의 cva · 상수와 같은 값 — 비었음 · 실패 ───────────────

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

// ── chart.tsx 의 함수 — 형 표기만 뗐다 ───────────────────────────────────

const chartVar = (color) => `var(--color-chart-${color})`;
const round1 = (x) => Math.floor(x * 10 + 0.5) / 10;

/** 눈금 글자 — 1만 미만은 쉼표 정수, 그 위는 만 · 억 · 조에 소수 한 자리(.0 은 버린다). 빼기는 U+2212 */
function formatAxisWon(value) {
  if (!Number.isFinite(value)) return "";
  const sign = value < 0 ? MINUS : "";
  const n = Math.abs(value);
  if (n < 10000) return sign + Math.round(n).toLocaleString("ko-KR");
  let scaled = n / 10000;
  let unit = "만";
  for (const bigger of ["억", "조"]) {
    if (round1(scaled) < 10000) break;
    scaled /= 10000;
    unit = bigger;
  }
  return sign + round1(scaled).toLocaleString("ko-KR", { maximumFractionDigits: 1 }) + unit;
}

// 돈은 줄이지 않고 원까지(툴팁 · 열지도 칸의 기본)
const formatWon = (value) => (value < 0 ? MINUS : "") + Math.round(Math.abs(value)).toLocaleString("ko-KR") + "원";

/** 저장된 색 먼저, 나머지는 그 차트에서 아직 쓰지 않은 색부터 배정 순서로 — 10개를 넘으면 상위 9 + 회색 "기타"(groupOthers) */
function assignChartColors(items, { colorOf, groupOthers } = {}) {
  const over = items.length > 10;
  const head = over ? items.slice(0, 9) : [...items];
  const rest = over ? items.slice(9) : [];
  const saved = head.map((item) => colorOf?.(item) ?? null);
  const used = new Set(saved.filter((c) => c != null));
  const free = CHART_ORDER.filter((c) => !used.has(c));
  let next = 0;
  const out = head.map((item, i) => {
    let color = saved[i];
    if (color == null) {
      color = free[next] ?? CHART_ORDER[(next - free.length) % CHART_ORDER.length] ?? "blue";
      next++;
    }
    return { ...item, color, fill: chartVar(color) };
  });
  if (over) {
    if (groupOthers) out.push({ ...groupOthers(rest), color: "gray", fill: chartVar("gray") });
    else for (const item of rest) out.push({ ...item, color: "gray", fill: chartVar("gray") });
  }
  return out;
}

/** 세기 단계 — 가장 큰 값의 8 · 22 · 45 · 75% 에서 끊는다(0 ~ 4), 값이 없으면 −1 */
function heatStep(value, max) {
  if (value == null || !(value > 0) || !(max > 0)) return -1;
  const ratio = value / max;
  return ratio < 0.08 ? 0 : ratio < 0.22 ? 1 : ratio < 0.45 ? 2 : ratio < 0.75 ? 3 : 4;
}

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

// ── 데이터 — 10월(오늘 8일에서 끝난다) ─────────────────────────────────────

const DOW = ["일", "월", "화", "수", "목", "금", "토"];
const formatDay = (d) => `10월 ${d}일 (${DOW[new Date(Date.UTC(2026, 9, d)).getUTCDay()]})`;
// 날마다의 값 — 수입은 월급날(1일)이 크고, 지출은 하루 40만 아래. 합계 수입 4,200,000원 · 지출 1,240,000원
const TREND = [
  { day: 1, income: 3800000, expense: 152300 },
  { day: 2, income: 0, expense: 98400 },
  { day: 3, income: 0, expense: 286000 },
  { day: 4, income: 0, expense: 131500 },
  { day: 5, income: 280000, expense: 74200 },
  { day: 6, income: 0, expense: 352000 },
  { day: 7, income: 0, expense: 59200 },
  { day: 8, income: 120000, expense: 86400 },
];
const total = (key) => TREND.reduce((s, d) => s + d[key], 0);
// 계열 — 왼쪽 축 수입(blue · 0 ~ 400만) · 오른쪽 축 지출(red · 0 ~ 40만)
const SERIES = [
  { key: "income", label: "수입", color: "blue", max: 4000000, ticks: [0, 1000000, 2000000, 3000000, 4000000] },
  { key: "expense", label: "지출", color: "red", max: 400000, ticks: [0, 100000, 200000, 300000, 400000] },
];
const TREND_LABEL = `10월 수입 · 지출 추이, 수입 ${formatWon(total("income"))} · 지출 ${formatWon(total("expense"))}`;

// 카테고리 — 큰 순서. 저장된 색(식비 blue · 교통 green · 쇼핑 orange · 경조사 red · 주거 violet · 생활 pink)이 먼저, 색 없는 구독 · 의료 · 미용은
// 쓰지 않은 색부터(indigo · yellow · brown), 12개라 상위 9 + 회색 "기타"(반려동물 · 도서 · 선물). 합계 1,240,000원
const CATEGORIES = [
  { id: "food", name: "식비", amount: 384400, savedColor: "blue", hasChildren: true },
  { id: "transport", name: "교통", amount: 173600, savedColor: "green" },
  { id: "shopping", name: "쇼핑", amount: 148800, savedColor: "orange", hasChildren: true },
  { id: "events", name: "경조사", amount: 124000, savedColor: "red" },
  { id: "housing", name: "주거", amount: 111600, savedColor: "violet" },
  { id: "living", name: "생활", amount: 99200, savedColor: "pink", hasChildren: true },
  { id: "subscription", name: "구독", amount: 74400 },
  { id: "medical", name: "의료", amount: 49600 },
  { id: "beauty", name: "미용", amount: 34500 },
  { id: "pet", name: "반려동물", amount: 22200 },
  { id: "book", name: "도서", amount: 9800 },
  { id: "gift", name: "선물", amount: 7900 },
];
const CATEGORY_TOTAL = CATEGORIES.reduce((s, c) => s + c.amount, 0);
const slices = assignChartColors(CATEGORIES, {
  colorOf: (c) => c.savedColor,
  groupOthers: (rest) => ({ id: "others", name: "기타", amount: rest.reduce((s, c) => s + c.amount, 0) }),
});

// 열지도 — 요일 × 시간대 지출. 가장 큰 칸 토요일 저녁 240,000원 · 수요일 저녁 35,000원
const HEAT_COLUMNS = ["월", "화", "수", "목", "금", "토", "일"];
const HEAT_ROWS = [
  { key: "morning", label: "아침", sub: "06~10시", values: [4500, 0, 5200, 3800, 12000, 0, 8000] },
  { key: "lunch", label: "점심", sub: "10~14시", values: [9000, 21500, 8500, 11000, 64000, 23000, 0] },
  { key: "afternoon", label: "오후", sub: "14~18시", values: [0, 6800, 15000, 0, 32000, 128000, 54000] },
  { key: "evening", label: "저녁", sub: "18~22시", values: [54000, 12500, 35000, 96000, 187000, 240000, 61000] },
];

// ── 그림 조각 ─────────────────────────────────────────────────────────────

// 추이 — 레시피가 recharts 에 넘기는 값으로 그린 SVG(눈금 11 · 이중 축이면 계열 색 · 가로 점선 격자 · 선 2 · 영역 25% → 0% · 가리킨 점 r 4 + 테두리 2).
// width 는 실제 크기(글자 11 이 늘거나 줄지 않게), tip 은 그 순간을 멈춘 가리킴(날 번호)
function trendSvg({ id, width = 560, height = 200, dual = true, series = SERIES, tip = -1 }) {
  const padL = 44, padR = dual ? 44 : 12, padT = 10, padB = 26;
  const iw = width - padL - padR, ih = height - padT - padB;
  const x = (i) => padL + (iw * i) / (TREND.length - 1);
  const yOf = (s, v) => padT + ih * (1 - v / s.max);
  const left = series[0];
  const tick = (s, v, side) =>
    `<text x="${side === "left" ? padL - 8 : width - padR + 8}" y="${(yOf(s, v) + 4).toFixed(1)}" text-anchor="${side === "left" ? "end" : "start"}" font-size="11" style="fill:${dual ? chartVar(s.color) : "var(--color-fg-neutral-subtle)"}; font-variant-numeric:tabular-nums">${formatAxisWon(v)}</text>`;
  const grid = left.ticks.map((t) => `<line x1="${padL}" x2="${width - padR}" y1="${yOf(left, t).toFixed(1)}" y2="${yOf(left, t).toFixed(1)}" stroke="${chartGridProps.stroke}" stroke-dasharray="${chartGridProps.strokeDasharray}"/>`).join("");
  const ticks = left.ticks.map((t) => tick(left, t, "left")).join("") + (dual ? series[1].ticks.map((t) => tick(series[1], t, "right")).join("") : "");
  const days = TREND.map((d, i) => `<text x="${x(i).toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="11" style="fill:var(--color-fg-neutral-subtle)">${d.day}일</text>`).join("");
  const curve = (pts) => pts.reduce((d, [px, py], i) => (i === 0 ? `M${px.toFixed(1)},${py.toFixed(1)}` : `${d} C${(pts[i - 1][0] + (px - pts[i - 1][0]) / 3).toFixed(1)},${pts[i - 1][1].toFixed(1)} ${(px - (px - pts[i - 1][0]) / 3).toFixed(1)},${py.toFixed(1)} ${px.toFixed(1)},${py.toFixed(1)}`), "");
  const defs = series.map((s) => `<linearGradient id="${id}-${s.key}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${chartVar(s.color)}" stop-opacity="0.25"/><stop offset="1" stop-color="${chartVar(s.color)}" stop-opacity="0"/></linearGradient>`).join("");
  const areas = series
    .map((s) => {
      const d = curve(TREND.map((p, i) => [x(i), yOf(s, p[s.key])]));
      return `<path d="${d} L${x(TREND.length - 1).toFixed(1)},${padT + ih} L${x(0).toFixed(1)},${padT + ih} Z" fill="url(#${id}-${s.key})"/><path d="${d}" fill="none" stroke="${chartVar(s.color)}" stroke-width="2"/>`;
    })
    .join("");
  const pointer =
    tip >= 0
      ? `<line data-slot="chart-crosshair" x1="${x(tip).toFixed(1)}" y1="${padT}" x2="${x(tip).toFixed(1)}" y2="${padT + ih}" stroke-width="1" stroke-dasharray="3 3" class="${CROSSHAIR}"/>${series
          .map((s) => `<circle cx="${x(tip).toFixed(1)}" cy="${yOf(s, TREND[tip][s.key]).toFixed(1)}" r="${ACTIVE_DOT.r}" fill="${chartVar(s.color)}" stroke="${ACTIVE_DOT.stroke}" stroke-width="${ACTIVE_DOT.strokeWidth}"/>`)
          .join("")}`
      : "";
  return { svg: `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false"><defs>${defs}</defs>${grid}${areas}${ticks}${days}${pointer}</svg>`, x, padT };
}

// <Chart label legendId height> — 차트 상자(role="img" · 요약 이름 · 범례가 대체). 추이는 ← → 로 날짜를 옮기므로 Tab 한 칸
const chartBox = ({ label, legendId, height, navigable = true, style = "", inner }) =>
  `<div ${attrs(['role="img"', `aria-label="${esc(label)}"`, legendId && `aria-describedby="${legendId}"`, navigable && 'tabindex="0"', 'data-slot="chart"', `class="${CHART_ROOT}"`, `style="height:${height}px${style ? `; ${style}` : ""}"`])}>${inner}</div>`;

// <ChartTooltipContent> — 떠 있는 표면 · 머리 · "■ 라벨 값". 보조 기술에는 숨긴다(같은 값은 범례 · 표로 보기)
const tooltip = (head, rows, style = "") =>
  `<div aria-hidden="true" data-slot="chart-tooltip" class="${TOOLTIP_SURFACE}"${style ? ` style="${style}"` : ""}><div data-slot="chart-tooltip-head" class="${TIP_HEAD}">${esc(head)}</div>${rows
    .map((r) => `<div data-slot="chart-tooltip-row" class="${TIP_ROW}"><span aria-hidden="true" data-slot="chart-tooltip-swatch" class="${TIP_SWATCH}" style="background: ${r.swatch}"></span><span data-slot="chart-tooltip-label" class="${TIP_LABEL}">${esc(r.label)}</span><span data-slot="chart-tooltip-value" class="${TIP_VALUE}">${esc(r.value)}</span></div>`)
    .join("")}</div>`;

// <ChartLegendTiles> — 차트 위 지표 타일(켠 계열 chart-{색}-subtle · 끈 계열 흰 면 + 안쪽 1px). 마지막 하나는 끌 수 없다(aria-disabled)
function legendTiles({ id, items, hidden = [] }) {
  const shown = items.filter((it) => !hidden.includes(it.key)).length;
  return `<div role="group" aria-label="범례" data-slot="chart-legend-tiles"><div id="${id}" class="${TILES_ROW}">${items
    .map((it) => {
      const on = !hidden.includes(it.key);
      const locked = on && shown <= 1;
      return `<button ${attrs(['type="button"', `aria-pressed="${on}"`, locked && 'aria-disabled="true"', 'data-slot="chart-legend-tile"', `data-key="${it.key}"`, `class="${merge(`${LEGEND_TILE} ${on ? SUBTLE_BG[it.color] : LEGEND_TILE_HIDDEN}`)}"`])}><span class="${TILE_NAME}"><span aria-hidden="true" data-slot="chart-legend-dot" class="${TILE_DOT} ${DOT_BG[it.color]}"></span>${esc(it.label)}</span><span data-slot="chart-legend-total" class="${TILE_TOTAL}">${esc(it.total)}</span></button>`;
    })
    .join("")}</div></div>`;
}
const TILE_ITEMS = SERIES.map((s) => ({ key: s.key, label: s.label, color: s.color, total: formatWon(total(s.key)) }));

// 도넛 — 두께 = 지름 ÷ 10 + 6(정수로 — chartDonutThickness), 160 이면 22 = innerRadius 58 · outerRadius 80. 조각 사이 0, 12시에서 시계 방향
const donutThickness = (size) => Math.round(size / 10 + 6);
function donutSvg(size = 160, thickness = donutThickness(size)) {
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  let off = 0;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true" focusable="false">${slices
    .map((s) => {
      const len = (circ * s.amount) / CATEGORY_TOTAL;
      const seg = `<circle cx="${size / 2}" cy="${size / 2}" r="${r.toFixed(2)}" fill="none" stroke="${s.fill}" stroke-width="${thickness}" stroke-dasharray="${len.toFixed(2)} ${(circ - len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>`;
      off += len;
      return seg;
    })
    .join("")}</svg>`;
}
// <ChartDonutCenter label amount> — 구멍에 들어가면 가운데 합계(위 라벨 12 + 합계 16 / 22 · 700)
const donutCenter = (label, amount) =>
  `<div aria-hidden="true" data-slot="chart-donut-center" data-fits="true" class="${CENTER}"><div class="${CENTER_TEXT}"><span class="${CENTER_LABEL}">${esc(label)}</span><span class="${CENTER_AMOUNT}">${esc(amount)}</span></div></div>`;
// <ChartDonutLegend> — 카테고리 목록. onClick 이 있는 줄(하위가 있는 카테고리)만 누르는 줄 — 카드 끝까지, 바탕은 좌우 6 들어온 모서리 10
const percentOf = (amount) => `${Math.round((amount * 100) / CATEGORY_TOTAL)}%`;
const donutLegend = (id) =>
  `<ul id="${id}" role="list" data-slot="chart-donut-legend" class="${DONUT_LEGEND}">${slices
    .map((s) => {
      const body = `<span aria-hidden="true" data-slot="chart-donut-swatch" class="${DONUT_SWATCH} ${DOT_BG[s.color]}"></span><span data-slot="chart-donut-label" class="${DONUT_LABEL}">${esc(s.name)}</span><span data-slot="chart-donut-percent" class="${DONUT_PERCENT}">${percentOf(s.amount)}</span><span data-slot="chart-donut-amount" class="${DONUT_AMOUNT}">${formatWon(s.amount)}</span>`;
      return `<li data-slot="chart-donut-legend-item" class="${DONUT_ITEM}">${s.hasChildren ? `<button type="button" class="${merge(`${LEGEND_ROW} ${LEGEND_ROW_PRESSABLE}`)}">${body}</button>` : `<div class="${LEGEND_ROW}">${body}</div>`}</li>`;
    })
    .join("")}</ul>`;

// <ChartHeatmap> — 왼쪽 시간대 라벨 열 56 + 요일 일곱 칸(정사각형 · 모서리 4 · 사이 6). cell 은 칸 폭(그 화면에서 잰 값) — 112 이상만 원까지.
// 칸 글자색은 Desk 라이트의 답(75 · 100% 흰 글자 — 레시피는 단계마다 대비를 재서 정한다). keyboard 는 키보드로 옮겨 온 칸(바깥 2px 링)
function heatmap({ cell, label, keyboard = null }) {
  const max = Math.max(...HEAT_ROWS.flatMap((r) => r.values));
  const text = ["neutral", "neutral", "neutral", "white", "white"];
  const head = `<span aria-hidden="true"></span>${HEAT_COLUMNS.map((c) => `<span aria-hidden="true" data-slot="chart-heatmap-column" class="${HEAT_COLUMN}">${c}</span>`).join("")}`;
  const body = HEAT_ROWS.map(
    (row, r) =>
      `<span aria-hidden="true" data-slot="chart-heatmap-row" class="${HEAT_ROW}"><span class="${HEAT_ROW_LABEL}">${row.label}</span><span class="${HEAT_ROW_SUB}">${row.sub}</span></span>${row.values
        .map((v, c) => {
          const step = heatStep(v, max);
          const active = keyboard && keyboard.row === r && keyboard.col === c;
          const cls = [HEAT_CELL, step < 0 ? HEAT_EMPTY : HEAT_STEP_BG[step], step >= 0 && HEAT_TEXT[text[step]], active && "outline-2 outline-offset-2 outline-stroke-focus-ring"].filter(Boolean).join(" ");
          return `<span ${attrs(['aria-hidden="true"', 'data-slot="chart-heatmap-cell"', `data-row="${r}"`, `data-col="${c}"`, `data-step="${step}"`, active && 'data-active="keyboard"', `class="${merge(cls)}"`])}>${cell >= 112 ? (step < 0 ? "—" : formatWon(v)) : ""}</span>`;
        })
        .join("")}`,
  ).join("");
  const width = 56 + 7 * cell + 7 * 6;
  return `<div role="img" aria-label="${esc(label)}" tabindex="0" data-slot="chart-heatmap" class="${merge(HEAT_ROOT.join(" "))}" style="grid-template-columns: 56px repeat(7, minmax(0, 1fr)); width:${width}px; max-width:none;">${head}${body}</div>`;
}
// 열지도 툴팁 — 칸 위 8 · 가운데(화면 위 떠 있는 층). 네모는 그 칸의 세기 색
function heatTip(r, c) {
  const max = Math.max(...HEAT_ROWS.flatMap((row) => row.values));
  const row = HEAT_ROWS[r];
  const v = row.values[c];
  const step = heatStep(v, max);
  return tooltip(`${HEAT_COLUMNS[c]}요일 ${row.label} ${row.sub}`, [{ swatch: step < 0 ? "var(--color-bg-neutral-weak)" : HEAT_STEP_SWATCH[step], label: "지출", value: step < 0 ? "없음" : formatWon(v) }]);
}

// <ChartDataTable visuallyHidden={false}> — 표로 보기(Table — 첫 열은 그 줄의 이름, 나머지는 오른쪽)
function dataTable(caption, columns, rows) {
  const cell = (tag, align, html, extra = "") => `<${tag}${extra} class="${merge(`${CELL} ${tag === "th" && extra.includes("col") ? HEAD_CELL : BODY_CELL} ${ALIGN[align]}`)}">${html}</${tag}>`;
  const head = columns.map((c, i) => cell("th", i === 0 ? "start" : "end", esc(c), ' scope="col" data-slot="table-head"')).join("");
  const body = rows.map((r) => `<tr data-slot="table-row" class="${ROW}">${r.map((v, i) => (i === 0 ? cell("th", "start", esc(v), ' scope="row" data-slot="table-row-header"') : cell("td", "end", esc(v), ' data-slot="table-cell"'))).join("")}</tr>`).join("");
  return `<div data-slot="chart-data-table"><div data-slot="table" data-row-height="text" class="${TABLE_BOX}"><div data-slot="table-frame" class="${TABLE_FRAME}"><table class="${TABLE_EL}"><caption class="${SR_ONLY}">${esc(caption)}</caption><thead data-slot="table-header"><tr data-slot="table-row" class="${ROW}">${head}</tr></thead><tbody data-slot="table-body">${body}</tbody></table></div><span role="status" data-slot="table-status" class="${SR_ONLY}"></span></div></div>`;
}

// ── 카드 · 바닥 — 차트는 카드 본문 안에 둔다 ─────────────────────────────────

const card = (title, html, { body = "content" } = {}) =>
  `<div data-slot="card" data-variant="default" data-body="${body}" data-press="none" class="${merge(`${CARD_ROOT} ${CARD_VARIANT.default} ${CARD_BODY[body]}`)}"><div data-slot="card-header" class="${CARD_HEADER} ${CARD_HEADER_BODY[body]}"><h2 data-slot="card-title" class="${CARD_TITLE}">${esc(title)}</h2></div>${html}</div>`;
const floor = (html, maxWidth = "") =>
  `<div style="padding:var(--spacing-x6); border-radius:var(--radius-r4); background:var(--color-bg-layer-basement); font-family:var(--font-sans);${maxWidth ? ` max-width:${maxWidth};` : ""}">${html}</div>`;
const scroll = (html) => `<div style="overflow-x:auto;">${html}</div>`;
const CAPTION = "display:block; margin-top:var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;
const stack = (items) => `<div style="display:flex; flex-direction:column; gap:var(--spacing-x6);">${items.join("")}</div>`;
const row = (items) => `<div style="display:flex; flex-wrap:wrap; gap:var(--spacing-x6); align-items:flex-start;">${items.map((it) => `<div style="flex:1 1 300px; max-width:420px; min-width:0;">${it}</div>`).join("")}</div>`;

// 추이 카드 — 지표 타일 + 이중 축 차트(실제 폭 480 — 사이트 미리보기 칸 600 안의 바닥 · 카드 여백 안)
const TREND_WIDTH = 480;
function trendCard({ id, tip = -1, hidden = [] }) {
  const series = SERIES.filter((s) => !hidden.includes(s.key));
  const dual = series.length === 2;
  const { svg: chartSvg, x } = trendSvg({ id, width: TREND_WIDTH, height: 200, dual, series: dual ? SERIES : series.map((s) => ({ ...s })), tip });
  const tipHtml =
    tip >= 0
      ? tooltip(
          formatDay(TREND[tip].day),
          series.map((s) => ({ swatch: chartVar(s.color), label: s.label, value: formatWon(TREND[tip][s.key]) })),
          `position:absolute; top:8px; ${x(tip) > TREND_WIDTH / 2 ? `right:${(TREND_WIDTH - x(tip) + 12).toFixed(0)}px` : `left:${(x(tip) + 12).toFixed(0)}px`};`,
        )
      : "";
  return card(
    "수입 · 지출 추이",
    `<div style="width:${TREND_WIDTH}px;">${legendTiles({ id: `${id}-legend`, items: TILE_ITEMS, hidden })}${chartBox({ label: TREND_LABEL, legendId: `${id}-legend`, height: 200, inner: `${chartSvg}${tipHtml}` })}</div>`,
  );
}

// ── 예제 ──────────────────────────────────────────────────────────────────

export const chartExamples = [
  {
    title: "수입 · 지출 추이 — 이중 축",
    description:
      "차트는 카드 본문 안에 둔다. 수입 · 지출처럼 두 계열의 크기가 열 배 넘게 다르면 왼쪽 · 오른쪽 축을 따로 두고(이중 축) 눈금 글자를 그 축이 맡은 계열의 색으로 칠한다 — 왼쪽 수입 chart-blue · 오른쪽 지출 chart-red(라이트 700 · 다크 800-dark — 글자 기준 4.5 이상). 눈금 글자는 11 / 15 · 고정폭 숫자이고 돈 축은 \"만\" 으로 줄인다(formatAxisWon — 400만 · 빼기 U+2212, 줄임은 축만). 격자는 가로 점선(3 · 3) stroke-neutral-subtle 만 — 세로 격자 · 축 선 · 눈금 선은 없다. 선은 2 · 영역은 같은 색 25% → 0% 세로 그라디언트, 점은 가리킨 자리에만. 오늘(8일)까지만 그린다 — 남은 날을 0 으로 채우지 않는다. 범례는 차트 위의 지표 타일이다 — 점 8 + 이름 13 · fg-neutral-muted, 아래 2 에 합계 16 / 22 · 700(돈은 원까지), 켠 계열은 chart-{색}-subtle 바탕 · 끈 계열은 흰 면 + 안쪽 1px stroke-neutral-weak, 모서리 12 · 위아래 10 · 좌우 12 · 사이 8 · 높이 62. 누르면(Enter · Space) 계열을 켜고 끈다(aria-pressed) — 마지막 하나는 끌 수 없다. 차트 상자는 role=\"img\" + 요약 이름이고 타일이 글로 읽히는 대체다(aria-describedby).",
    jsx: `import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Chart, ChartLegendTiles, ChartTooltip, ChartTooltipContent, chartAxisProps, chartGridProps, formatAxisWon,
} from "@/components/ui/chart"

<ChartLegendTiles
  id="trend-legend"
  items={[
    { key: "income", label: "수입", color: "blue", total: "4,200,000원" },
    { key: "expense", label: "지출", color: "red", total: "1,240,000원" },
  ]}
  hidden={hidden}
  onHiddenChange={setHidden}
/>
<Chart label="10월 수입 · 지출 추이, 수입 4,200,000원 · 지출 1,240,000원" legendId="trend-legend" height={200}>
  {/* 오늘까지만 — 남은 날을 0 으로 채우지 않는다 */}
  <AreaChart data={daysUntilToday}>
    {/* 이중 축이면 격자도 축 하나에 건다 — 없으면 recharts 가 격자를 두 줄만 긋는다 */}
    <CartesianGrid {...chartGridProps} yAxisId="income" />
    <XAxis dataKey="day" {...chartAxisProps()} />
    <YAxis yAxisId="income" tickFormatter={formatAxisWon} {...chartAxisProps({ color: "blue" })} />
    <YAxis yAxisId="expense" orientation="right" tickFormatter={formatAxisWon} {...chartAxisProps({ color: "red" })} />
    <ChartTooltip content={<ChartTooltipContent headFormatter={formatDay} valueFormatter={formatWon} />} />
    {!hidden.has("income") && <Area yAxisId="income" dataKey="income" name="수입" stroke="var(--color-chart-blue)" />}
    {!hidden.has("expense") && <Area yAxisId="expense" dataKey="expense" name="지출" stroke="var(--color-chart-red)" />}
  </AreaChart>
</Chart>`,
    render: () => floor(scroll(trendCard({ id: "chart-ex-trend" }))),
  },

  {
    title: "카테고리 도넛 — 목록 범례",
    description:
      "도넛의 범례는 카테고리 목록이다 — 줄마다(44 이상) 색 네모 10 + 이름 14 · % 14 · fg-neutral-subtle + 금액 14 · 700 + \"원\". 하위 카테고리가 있는 줄(식비 · 쇼핑 · 생활)만 누르는 줄이다 — List 줄처럼 카드 끝까지 가고 호버 · 누름 바탕은 좌우 6 들어온 모서리 10(카드 16 − 6), 글자는 그대로 선다. 가운데는 합계 16 / 22 · 700 + 위 라벨 12 · fg-neutral-subtle — 돈은 가운데서도 줄이지 않는다(\"73.3만\" 이 아니라 원까지). 구멍에 들어가지 않으면(폰 120 · 18) 가운데 글을 그리지 않고 onFitChange(false) 로 알린다 — 쓰는 쪽이 목록 위에 합계를 둔다. 조각 사이는 0, 12시에서 시계 방향. 두께는 지름 ÷ 10 + 6 을 정수로(160 → 22 · 120 → 18 · 180 → 24) — chartDonutRadii(지름) 이 Pie 의 반지름을 준다. 색은 assignChartColors 가 정한다 — 저장된 색이 먼저, 색이 없는 항목은 그 차트에서 아직 쓰지 않은 색부터 배정 순서로(구독 indigo · 의료 yellow · 미용 brown), 10개를 넘으면 상위 9 + 회색 \"기타\"(groupOthers) — 회색은 \"기타\" 전용이다.",
    jsx: `import { Pie, PieChart } from "recharts"
import { Chart, ChartDonutCenter, ChartDonutLegend, assignChartColors, chartDonutRadii } from "@/components/ui/chart"

const slices = assignChartColors(categories, { colorOf: (c) => c.savedColor })

<Chart label="10월 카테고리별 지출, 합계 1,240,000원" legendId="cat-legend" height={160}>
  <PieChart>
    <Pie data={slices} dataKey="amount" {...chartDonutRadii(160)} paddingAngle={0} />
  </PieChart>
  <ChartDonutCenter label="10월 지출" amount="1,240,000원" />
</Chart>
<ChartDonutLegend
  id="cat-legend"
  items={slices.map((s) => ({ key: s.id, label: s.name, color: s.color, percent: s.percentText, amount: s.amountText, onClick: s.hasChildren ? () => openChildren(s.id) : undefined }))}
/>`,
    render: () =>
      floor(
        card(
          "카테고리별 지출",
          `<div style="display:flex; flex-wrap:wrap; align-items:center; gap:var(--spacing-x6);">${chartBox({
            label: `10월 카테고리별 지출, 합계 ${formatWon(CATEGORY_TOTAL)}`,
            legendId: "chart-ex-cat-legend",
            height: 160,
            navigable: false,
            style: "width:160px; flex:none",
            inner: `${donutSvg()}${donutCenter("10월 지출", formatWon(CATEGORY_TOTAL))}`,
          })}<div style="flex:1 1 260px; min-width:0;">${donutLegend("chart-ex-cat-legend")}</div></div>`,
        ),
        "640px",
      ),
  },

  {
    title: "표로 보기 · 비었음 · 실패",
    description:
      "날짜마다 값을 읽어야 하는 차트(추이 · 열지도)는 같은 값을 표로도 둔다(ChartDataTable — 기본은 숨긴 표, visuallyHidden={false} 면 차트 아래 펼친 표 · 돈은 원까지). 비었으면 차트 자리에 Result Section medium(\"이번 달 기록이 없어요\"), 못 불러왔으면 failure + 다시 시도 — 빈 축 · 회색 고리 · 0 으로 그린 막대로 대신하지 않는다. 처음 불러오는 동안은 카드 머리 · 지표 타일 이름 · 범례 틀은 그리고 차트 자리만 Skeleton(모서리 16)이다. 미리보기의 표는 펼친 모습이다.",
    jsx: `import { ReceiptText } from "lucide-react"
import { ResultSection } from "@/components/ui/result-section"
import { ChartDataTable } from "@/components/ui/chart"

{query.isError ? (
  <ResultSection kind="failure" size="medium" title="추이를 불러오지 못했어요" description="잠시 뒤 다시 시도해주세요."
    primaryAction={{ label: "다시 시도", onClick: () => query.refetch() }} />
) : rows.length === 0 ? (
  <ResultSection kind="empty" size="medium" icon={<ReceiptText />} title="이번 달 기록이 없어요" />
) : (
  <>
    <TrendChart rows={rows} />
    <ChartDataTable caption="10월 날짜별 수입 · 지출" columns={["날짜", "수입", "지출"]} rows={rows.map(toWonRow)} />
  </>
)}`,
    render: () =>
      stack([
        row([
          labeled(floor(card("수입 · 지출 추이", resultSection({ kind: "empty", icon: "receiptText", title: "이번 달 기록이 없어요" }))), "비었음 — Result Section medium"),
          labeled(floor(card("수입 · 지출 추이", resultSection({ kind: "failure", title: "추이를 불러오지 못했어요", description: "잠시 뒤 다시 시도해주세요.", primary: "다시 시도" }))), "실패 + 다시 시도"),
        ]),
        labeled(
          floor(
            card(
              "표로 보기",
              dataTable(
                "10월 날짜별 수입 · 지출",
                ["날짜", "수입", "지출"],
                TREND.map((d) => [formatDay(d.day), formatWon(d.income), formatWon(d.expense)]),
              ),
              { body: "list" },
            ),
            "560px",
          ),
          "ChartDataTable visuallyHidden={false} — 펼친 표",
        ),
      ]),
  },

  {
    title: "툴팁 — 오늘을 짚은 순간",
    description:
      "차트를 짚으면(마우스 · 터치 · 상자에 초점을 두고 ← →) 그 자리에 세로 점선(1px · 3 · 3 · stroke-neutral-weak)과 점(r 4 계열 색 + 카드 면 색 테두리 2 = 10)이 서고 툴팁이 뜬다 — 떠 있는 표면(bg-layer-floating · shadow-s3 · 모서리 12 · 위아래 10 · 좌우 12 · 최소 128 · 테두리 없음), 머리 12 · fg-neutral-subtle(\"10월 8일 (목)\"), 줄은 \"■ 라벨 값\"(색 네모 8 · 모서리 2 ↔ 라벨 6 · 라벨 13 fg-neutral-muted ↔ 값 12 이상 · 값 13 · 700 · 고정폭 숫자 · 오른쪽). 툴팁은 보조 기술에 숨긴다 — 같은 값은 범례 · 표로 보기가 준다. 처음 ← → 를 누르면 첫 날짜, Esc 로 닫는다. 오른쪽 끝에서는 툴팁이 점의 왼쪽에 선다.",
    jsx: `<ChartTooltip content={<ChartTooltipContent headFormatter={formatDay} valueFormatter={formatWon} />} />`,
    render: () => floor(scroll(`<div style="position:relative;">${trendCard({ id: "chart-ex-tip", tip: 7 })}</div>`)),
  },

  {
    title: "열지도 — 칸 112 이상만 원까지",
    description:
      "요일 × 시간처럼 두 축의 세기는 열지도다 — 왼쪽 시간대 라벨 열 56(이름 13 · 700 + 시간 11 · fg-neutral-subtle) + 요일 일곱 칸(머리 12 · fg-neutral-subtle), 칸은 정사각형 · 모서리 4 · 사이 6. 세기는 다섯 단계 — bg-brand-solid 를 카드 면에 18 · 35 · 55 · 75 · 100% 섞는다(가장 큰 값의 8 · 22 · 45 · 75% 에서 끊는다), 값이 없으면 bg-neutral-weak. 가장 큰 칸에 고리를 두르지 않는다(사용자 결정 22A — 포커스 링과 헷갈린다). 칸 폭이 112 이상일 때만 칸에 원까지(11 / 15 · 700 · 고정폭 숫자, 빈 칸 \"—\") — 좁으면 글 없이 세기 색만이고 돈을 줄여 쓰거나 글자를 줄이지 않는다. 칸 글자색은 단계마다 한 번 정한다(그 바탕 위 fg-neutral 이 4.5 를 넘으면 fg-neutral, 아니면 static-white). 칸을 가리키거나(마우스) 누르면(터치) · 상자에 초점을 두고 ← → ↑ ↓ 로 옮기면 툴팁이 뜬다 — 글이 보이는 넓은 칸에서도. 키보드로 온 칸에는 바깥 2px 링(띄움 2)이다. 위는 1280 의 칸 117(미리보기 칸보다 넓어 옆으로 민다), 아래는 칸 56(112 미만 — 색만) + 키보드로 수요일 저녁을 짚은 순간이다.",
    jsx: `<ChartHeatmap
  label="10월 요일 · 시간대별 지출, 가장 많은 때 토요일 저녁 240,000원"
  rows={timeSlots}   // { key, label: "저녁", sub: "18~22시" }
  columns={weekdays} // { key, label: "수" }
  values={values}    // 줄 × 칸 — 값이 없으면 0
  tooltipLabel={(row, column) => \`\${column.label}요일 \${row.label} \${row.sub}\`}
/>`,
    render: () =>
      stack([
        labeled(floor(card("요일 · 시간대별 지출", scroll(heatmap({ cell: 117, label: "10월 요일 · 시간대별 지출, 가장 많은 때 토요일 저녁 240,000원 — 칸 117" })))), "1280 — 칸 117 · 원까지(옆으로 밀어 본다)"),
        labeled(
          floor(
            card(
              "요일 · 시간대별 지출",
              scroll(`<div style="position:relative; width:max-content; padding:4px;">${heatmap({ cell: 56, label: "10월 요일 · 시간대별 지출 — 칸 56", keyboard: { row: 3, col: 2 } })}<div style="position:absolute; left:${4 + 56 + 2 * 62 + 28 - 70}px; top:${4 + 18 + 6 + 3 * 62 - 66}px;">${heatTip(3, 2)}</div></div>`),
            ),
          ),
          "좁은 칸(56 — 112 미만) · 색만 · 키보드로 짚은 칸",
        ),
      ]),
  },
];
