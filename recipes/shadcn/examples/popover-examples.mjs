/*
 * shadcn Popover 예제 — docs site components/popover.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 첫째(안내)는 차례 · 제목 · 코드가 specs/components/popover.md 의 "코드" 절과 같고,
 * 뒤의 둘(본문 스크롤 · 머리 없는 고르는 패널)은 md 의 Properties · Guidelines 를 코드로 더 보인다.
 *
 * CONTENT · HEADER · CLOSE · BODY · BODY_PLAIN · BODY_FOG 는 recipes/shadcn/components/ui/popover.tsx 의 상수와, TITLE · DESCRIPTION · FOOTER 는
 * 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 끝 흐림의 SOLID · fogStyle 은 scroll-fog.tsx 의 useScrollFog 와 같은 셈이다. 트리거 · 바닥 버튼 BUTTON_* 는 button.tsx 의 cva 와 같다
 * (button-examples.mjs 의 것과 같다 — 이 파일이 쓰는 변형 · 크기 · 배치와 그에 걸리는 compound 만 옮겼다). 고르는 패널을 여는 칸
 * IB_* 는 input-button.tsx 의 cva · 클래스와, 둘레 FIELD_* 는 field.tsx 의 클래스와 같다(input-button-examples.mjs 의 것과 같다).
 * 규칙은 specs/components/popover.md, 수치 원본은 specs/components/popover.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 트리거 <button data-slot="popover-trigger">(aria-haspopup="dialog" · aria-expanded · 열린 동안 aria-controls),
 * 표면 <div role="dialog" data-slot="popover-content"> > 머리 <div data-slot="popover-header">(제목 <h2 data-slot="popover-title"> · 설명 <p>) ·
 * 닫기 <button data-slot="popover-close">(머리가 있을 때) · 본문 <div data-slot="popover-body"> · 바닥 <div data-slot="popover-footer">.
 * 머리가 없는 고르는 패널은 표면에 aria-label 로 이름을 단다. 팝오버는 비모달이라 딤이 없고 뒤 화면을 숨기지 않는다.
 * Radix 가 실행 중에 붙이는 것 중 열림(data-state="open") · 자리(data-side · data-align) · id · tabindex="-1" 과, 폭 · 높이 계산이 읽는
 * 자리 변수(--radix-popover-content-available-width · -height)를 그린다 — 미리보기는 틀(STAGE)의 폭 · 높이로 적었다(100cqw · 100cqh).
 * 레시피는 표면을 body 끝(portal)에 띄우고 Radix 가 감싼 div(position: fixed)로 트리거 아래 8 에 놓는다 — 미리보기는 감싼 div 를 틀 안의
 * position: absolute 로 흉내 내 트리거 아래 8 에 둔다(옆으로 넘치면 화면 안으로 미는 계산은 하지 않는다). 틀의 isolation 이 z-(--z-floating) 을 틀 안에 가둔다.
 * 넘친 본문의 Tab 자리(tabindex 0) · 위로 스크롤됨(data-scrolled — 머리의 안쪽 아래 선)은 레시피가 재서 단다 — 미리보기는 그 순간을 멈춰
 * 속성을 적었다. 끝 흐림(scrollFog — 늘 켜진 위 20 · 아래 80)은 레시피(useScrollFog)가 그릴 때 토큰 --gradient-fade-mask 에 방향을 붙여 본문의
 * style(mask-*) · data-fog-axis 로 넣는다 — 정적 HTML 은 같은 일을 빌드 때 DESIGN.md 의 토큰 값으로 해 style 에 적었다. 사이트의 `.content p { margin: 12px 0; color: text-primary }` 는 층(@layer) 밖 규칙이라
 * Tailwind utility 를 늘 이긴다 — <p> 에는 클래스가 정한 바깥 여백 · 글자색을 style 로 한 번 더 적는다(P_FIX — 미리보기용 덧칠).
 * 모션 클래스(animate-in · zoom-in-95 …)는 tw-animate-css 의 것이라 사이트에서는 아무 일도 하지 않는다.
 * 레시피의 스크립트(처음 초점 · Tab 으로 나가면 닫기 · 바깥 · Esc · 초점 되돌리기 · 본문 재기)는 정적 HTML 에 없다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 * 고르는 패널의 달력은 date-picker-examples.mjs 의 그림(datePickerHtml — date-picker.tsx 의 DOM · 클래스)을 그대로 쓴다.
 */

import { readFileSync } from "node:fs";
import { datePickerHtml } from "./date-picker-examples.mjs";

// ── popover.tsx 의 상수와 같은 값 ──────────────────────────────────────────

// 표면 — 폭 320 ~ 480(가용 폭까지) · 높이 600(가용 높이까지), 모서리 20 · 그림자 s3 · z 200
const CONTENT = [
  "relative z-(--z-floating) flex flex-col overflow-hidden rounded-r5 bg-bg-layer-floating font-sans text-fg-neutral shadow-[var(--shadow-s3)] outline-none",
  // 가용 폭 · 높이는 Radix 가 자리를 잰 뒤에 들어온다 — 그 전에는 320 · 480 · 600 으로 둔다
  "min-w-[min(320px,var(--radix-popover-content-available-width,320px))] max-w-[min(480px,var(--radix-popover-content-available-width,480px))]",
  "max-h-[min(600px,var(--radix-popover-content-available-height,600px))]",
  "origin-[var(--radix-popover-content-transform-origin)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-[var(--motion-duration-d3)] data-[state=open]:ease-[var(--motion-ease-enter)] motion-safe:data-[state=open]:zoom-in-95",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-[var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)] motion-safe:data-[state=closed]:zoom-out-95",
].join(" ");

// 닫기 — 52 투명 상자 · 아이콘 22. 아이콘이 위 27 · 오른쪽 24 에 오도록 상자를 15 당긴다. 누르면 bg-layer-floating-pressed + 2px 거리 축소(기준 52)
const CLOSE = [
  "absolute right-[calc(var(--spacing-x6)-15px)] top-[12px] flex size-13 cursor-pointer items-center justify-center",
  "rounded-r3 border-0 bg-transparent p-0 text-fg-neutral-subtle [&>svg]:size-[22px]",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "hover:bg-bg-layer-floating-pressed active:bg-bg-layer-floating-pressed [--press-basis:52] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

// 머리 — 위 24 · 좌우 24 · 아래 16 · 사이 6, 오른쪽 52(닫기). 본문이 위로 스크롤되면 안쪽 아래 1px stroke-neutral-subtle(150ms) —
// 본문이 흐림 마스크를 걸어도 선이 흐려지지 않게 머리에 그린다(Dialog 와 같다)
const HEADER = [
  "flex shrink-0 flex-col gap-x1_5 px-x6 pb-x4 pr-x13 pt-x6",
  "[transition:box-shadow_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[&:has(~[data-slot=popover-body][data-scrolled])]:shadow-[inset_0_-1px_0_0_var(--color-stroke-neutral-subtle)]",
].join(" ");

// 본문 — Dialog 의 본문과 같다(좌우 24, 맨 앞이면 위 24 · 맨 끝이면 아래 24)
const BODY = [
  "min-h-0 flex-1 overflow-y-auto overscroll-contain px-x6 first:pt-x6",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

const BODY_PLAIN = "last:pb-x6";

// 끝 흐림(scrollFog) — 본문 안 여백 위 20(머리가 없으면 24 그대로) · 아래 80(바닥이 있어도), 스크롤 여유도 위 20 · 아래 80
const BODY_FOG = "pt-[20px] pb-[80px] scroll-pt-[20px] scroll-pb-[80px]";

// ── popover.tsx 의 JSX 에 적힌 클래스 ──────────────────────────────────────
// 제목 t7 20 / 27 · 700 · 설명 t4 · fg-neutral-muted
const TITLE = "m-0 text-t7 font-bold text-fg-neutral";
const DESCRIPTION = "m-0 text-t4 font-normal text-fg-neutral-muted";
// 바닥 — 위 16 · 좌우 24 · 아래 24, 오른쪽 정렬, 사이 8. 버튼은 small 36
const FOOTER = "flex shrink-0 items-center justify-end gap-x2 px-x6 pb-x6 pt-x4";

// ── button.tsx 의 cva 와 같은 값 — 안내 트리거(ghost · xsmall · 아이콘만) · 바닥 버튼(small) ──

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
    ghost:
      "bg-transparent text-fg-neutral hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed aria-busy:bg-bg-layer-default-pressed disabled:bg-transparent [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
  },
  size: {
    xsmall: "h-8 rounded-full [--press-basis:32] [--progress-size:14px]",
    small: "h-9 rounded-r2 [--press-basis:36] [--progress-size:14px]",
  },
  layout: { withText: "", iconOnly: "" },
  ghostColor: { neutral: "", neutralSubtle: "", brand: "", critical: "" },
  flush: { left: "", right: "" },
};

const BUTTON_COMPOUND = [
  { size: "small", layout: "withText", className: "px-x3_5 py-x2 gap-x1 text-t4 [&_svg]:size-3.5" },
  { size: "xsmall", layout: "iconOnly", className: "w-8 p-x1_5 [&_svg]:size-3.5" },
];

const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// ── input-button.tsx 의 cva · 클래스와 같은 값 — 고르는 패널을 여는 칸 ────────

// 상자의 크기(inputButtonVariants) — 이 파일은 medium(1280 이상 데스크톱 웹 — 팝오버가 열리는 폭)만 쓴다
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

// 상자의 겉모습(inputButtonSurfaceVariants) — 버튼에 단다
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

// 상자(div) — cn(IB_ROOT, inputButtonVariants({ size })) · 배경 층 버튼 — cn(IB_BUTTON, inputButtonSurfaceVariants({ state, hover: "group", invalid }))
const IB_ROOT = "group/input-button relative isolate flex w-full min-w-0 items-center";
const IB_BUTTON = "peer/input-button absolute inset-0 m-0 appearance-none rounded-[inherit] border-0 p-0";
// 콘텐츠 층 — 누름을 지나 보내고, 버튼(peer)을 누르는 동안만 준다. 레시피는 cn(IB_CONTENT, 누를 수 있으면 IB_CONTENT_PRESS)
const IB_CONTENT =
  "relative flex min-w-0 flex-1 select-none items-center gap-[inherit] pointer-events-none [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const IB_CONTENT_PRESS = "peer-active/input-button:[scale:calc(1-2/var(--press-basis))] motion-reduce:peer-active/input-button:[scale:1]";
// 뒤 아이콘 — cn(IB_ICON, 아이콘 색) · 값 — cn(IB_VALUE, 값 색)
const IB_ICON = "flex shrink-0 [&>svg]:size-[var(--input-button-icon)]";
const IB_VALUE = "min-w-0 flex-1 truncate text-left";
const IB_ICON_COLOR = "text-fg-neutral-muted";
const IB_VALUE_COLOR = "text-fg-neutral";

// ── field.tsx 의 클래스 — 칸을 감싸는 둘레(라벨만) ──────────────────────────

const FIELD_ROOT = "flex w-full min-w-0 flex-col gap-x2";
const FIELD_HEADER = "flex items-center justify-between gap-x2_5 px-x0_5";
// 라벨 — cn("min-w-0 font-sans text-t5 text-fg-neutral", 굵기)
const FIELD_LABEL = "min-w-0 font-sans text-t5 text-fg-neutral";
const FIELD_LABEL_WEIGHT = { medium: "font-medium", bold: "font-bold" };

// 사이트의 `.content p` 를 덮는 미리보기용 덧칠 — 바깥 여백 0 · 글자색
const P_FIX = {
  description: "margin:0; color:var(--color-fg-neutral-muted);",
  body: "margin:0; color:var(--color-fg-neutral);",
};

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

// ── cva · cn 풀이 · 미리보기 조각 ──────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다.
// 참 · 거짓 축(invalid)은 cva 처럼 "true" · "false" 글자 키로 찾는다
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

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다. 이 파일이 합치는 클래스에 나오는 무리만 안다 — 배경 · 임의 속성([prop:…]).
// 그래서 ghost 버튼의 disabled:bg-transparent 가 바탕의 disabled:bg-bg-disabled 를 지운다(Button 은 cn(buttonVariants(…)) 이다)
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

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기는 감싼 자리의 [&>svg]:size-* · [&_svg]:size-* 가 정한다
const svg = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const ICONS = {
  x: svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  info: svg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
  calendarDays: svg(
    '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/>',
  ),
};

// 미리보기 틀 — 뒤 화면 위에 팝오버. container-type 이 자리 변수(가용 폭 · 높이)를 틀 크기로 재게 하고, isolation 이 z-(--z-floating) 을 틀 안에 가둔다
const STAGE = (height) =>
  `position:relative; isolation:isolate; container-type:size; overflow:hidden; width:100%; height:${height}px; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-basement); font-family:var(--font-sans);`;
const PAGE = "padding:var(--spacing-x6);";
const PAGE_TITLE =
  "margin-bottom:var(--spacing-x4); font-size:var(--text-t7); line-height:var(--text-t7--line-height); font-weight:700; color:var(--color-fg-neutral);";
// 뒤 화면의 흰 카드 · 줄(미리보기 그림)
const CARD = "margin-top:var(--spacing-x4); padding:var(--spacing-x2) var(--spacing-x6); border-radius:var(--radius-r4); background:var(--color-bg-layer-default);";
const ROW =
  "display:flex; justify-content:space-between; gap:var(--spacing-x3); padding:var(--spacing-x3) 0; font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const card = (rows) => `<div aria-hidden="true" style="${CARD}">${rows.map(([a, b]) => `<div style="${ROW}"><span>${a}</span><span style="color:var(--color-fg-neutral-subtle);">${b}</span></div>`).join("")}</div>`;
// 트리거와 팝오버 — 트리거 아래 8(sideOffset). 감싼 div 는 Radix 의 popper 감싸개 자리다
const ANCHOR = "position:relative; display:flex; flex-direction:column; align-items:flex-start;";
const WRAPPER = "position:absolute; left:0; top:calc(100% + var(--spacing-x2)); min-width:max-content; z-index:var(--z-floating);";
// 레시피가 정하지 않은 본문 글 — 표면의 fg-neutral 을 물려받는다(크기는 본문 글 t5 로 적었다)
const BODY_TEXT = "font-size:var(--text-t5); line-height:var(--text-t5--line-height);";

// <Button> — button.tsx 그대로(cn(buttonVariants({ variant, size, layout }))). 트리거는 PopoverTrigger asChild 가 Radix 의 속성
// (type="button" · aria-haspopup · aria-expanded · aria-controls · data-state)과 data-slot 을 얹는다 — <Button> 은 type 을 정하지 않는다
const button = ({ variant, size, layout, ariaLabel, slot, extra = [], children }) =>
  `<button ${attrs([
    slot && 'type="button"',
    ...extra,
    `class="${merge(buttonVariants({ variant, size, layout }))}"`,
    ariaLabel && `aria-label="${esc(ariaLabel)}"`,
    slot && `data-slot="${slot}"`,
  ])}>${children}</button>`;

// 위로 스크롤된 순간 — 정적 HTML 은 scrollTop 을 정할 수 없어 본문 글을 SCROLLED_BY 만큼 올려 그린다(미리보기용 덧칠)
const SCROLLED_BY = 32;
const scrolledBy = (html) => `<div style="margin-top:-${SCROLLED_BY}px;">${html}</div>`;

// <PopoverContent> + 감싼 div. uid 는 Radix · useId 의 앞말(예제마다 달리한다). title 이 없으면 ariaLabel 로 이름을 단다.
// body = { html, scrollFog, overflow, scrolled } — scrollFog 는 끝 흐림(늘 켜짐), 넘침(Tab 자리) · 스크롤됨(머리 아래 선)은 그 순간을 멈춰 적는다.
// footer 는 버튼 HTML 배열(크기 small 은 Footer 가 넣는다).
// availableHeight 는 Radix 가 재는 남은 높이 — 미리보기 틀 높이에서 트리거 아래까지를 뺀 값이다
function popoverContent({ uid, title, description, ariaLabel, align = "center", body, footer = [], availableHeight = "calc(100cqh - 2 * var(--spacing-x4))" }) {
  const titleId = `${uid}-title`;
  const descriptionId = `${uid}-description`;
  const hasHeader = title != null;
  const content = attrs([
    'data-side="bottom"',
    `data-align="${align}"`,
    'role="dialog"',
    `id="${uid}"`,
    'data-state="open"',
    'tabindex="-1"',
    'data-slot="popover-content"',
    ariaLabel && `aria-label="${esc(ariaLabel)}"`,
    hasHeader && `aria-labelledby="${titleId}"`,
    hasHeader && description != null && `aria-describedby="${descriptionId}"`,
    `class="${CONTENT}"`,
    `style="--radix-popover-content-available-width:calc(100cqw - 2 * var(--spacing-x4)); --radix-popover-content-available-height:${availableHeight};"`,
  ]);
  const header = hasHeader
    ? `<div data-slot="popover-header" class="${HEADER}"><h2 id="${titleId}" data-slot="popover-title" class="${TITLE}">${esc(title)}</h2>${
        description != null ? `<p id="${descriptionId}" data-slot="popover-description" class="${DESCRIPTION}" style="${P_FIX.description}">${esc(description)}</p>` : ""
      }</div><button type="button" aria-label="닫기" data-slot="popover-close" class="${CLOSE}">${ICONS.x}</button>`
    : "";
  const bodyHtml = `<div ${attrs([
    'data-slot="popover-body"',
    body.scrollFog && 'data-scroll-fog="overlayBody"',
    `class="${BODY} ${body.scrollFog ? BODY_FOG : BODY_PLAIN}"`,
    body.scrolled && 'data-scrolled=""',
    body.overflow && 'tabindex="0"',
    body.scrollFog && 'data-fog-axis="y"',
    body.scrollFog && `style="${fogStyle()}"`,
  ])}>${body.scrolled ? scrolledBy(body.html) : body.html}</div>`;
  const footerHtml = footer.length ? `<div data-slot="popover-footer" class="${FOOTER}">${footer.join("")}</div>` : "";
  return `<div data-radix-popper-content-wrapper="" style="${WRAPPER}"><div ${content}>${header}${bodyHtml}${footerHtml}</div></div>`;
}

// 안내 팝오버를 연 화면 — 칸 옆 i 버튼(트리거) 아래 8 에 표면. 휴가 화면 · 연차 줄은 미리보기 그림이다
function infoStage({ uid, label, triggerLabel, title, description, text, height = 360, scrollFog = false, overflow = false, scrolled = false, availableHeight }) {
  const trigger = button({
    variant: "ghost",
    size: "xsmall",
    layout: "iconOnly",
    ariaLabel: triggerLabel,
    slot: "popover-trigger",
    extra: ['aria-haspopup="dialog"', 'aria-expanded="true"', `aria-controls="${uid}"`, 'data-state="open"'],
    children: ICONS.info,
  });
  const lead = `<div style="display:flex; align-items:center; gap:var(--spacing-x1); font-size:var(--text-t5); line-height:var(--text-t5--line-height); font-weight:500; color:var(--color-fg-neutral);">${esc(label)}${trigger}</div>`;
  const body = { html: text.map((t) => `<p style="${P_FIX.body} ${BODY_TEXT}">${esc(t)}</p>`).join(`<div style="height:var(--spacing-x3);"></div>`), scrollFog, overflow, scrolled };
  return `<div style="${STAGE(height)}"><div style="${PAGE}"><div aria-hidden="true" style="${PAGE_TITLE}">휴가</div><div style="${ANCHOR}">${lead}${popoverContent({ uid, title, description, body, availableHeight })}</div>${card([
    ["연차 · 10월 12일 (월)~14일 (수)", "승인 대기"],
    ["반차(오전) · 9월 30일 (수)", "승인"],
    ["병가 · 9월 8일 (화)", "승인"],
  ])}</div></div>`;
}

// <Field label> + <InputButton size="medium"> — Field 문맥이 라벨 id 를 잇는다. PopoverTrigger asChild 가 InputButton 의 버튼에 Radix 의
// 속성과 data-slot 을 얹는다 — InputButton 은 data-slot 뒤에 받은 속성을 펼쳐 버튼의 data-slot 이 "popover-trigger" 가 된다
function pickField({ uid, label, value, contentId }) {
  const labelId = `${uid}-label`;
  const controlId = `${uid}-control`;
  const valueId = `${uid}value`;
  const buttonClass = `${IB_BUTTON} ${inputButtonSurfaceVariants({ state: "enabled", hover: "group", invalid: false })}`;
  const trigger = attrs([
    'type="button"',
    `class="${buttonClass}"`,
    'aria-haspopup="dialog"',
    'aria-expanded="true"',
    `aria-controls="${contentId}"`,
    'data-state="open"',
    'data-slot="popover-trigger"',
    `id="${controlId}"`,
    `aria-labelledby="${labelId} ${valueId}"`,
  ]);
  const box = `<div data-slot="input-button" data-size="medium" class="${IB_ROOT} ${inputButtonVariants({ size: "medium" })}"><button ${trigger}></button><span data-slot="input-button-content" class="${IB_CONTENT} ${IB_CONTENT_PRESS}"><span id="${valueId}" aria-hidden="true" data-slot="input-button-value" class="${IB_VALUE} ${IB_VALUE_COLOR}">${esc(value)}</span><span aria-hidden="true" data-slot="input-button-suffix-icon" class="${IB_ICON} ${IB_ICON_COLOR}">${ICONS.calendarDays}</span></span></div>`;
  return `<div data-slot="field" class="${FIELD_ROOT}"><div data-slot="field-header" class="${FIELD_HEADER}"><label id="${labelId}" for="${controlId}" class="${FIELD_LABEL} ${FIELD_LABEL_WEIGHT.medium}">${esc(label)}</label></div>${box}<span class="sr-only" aria-live="polite"></span></div>`;
}

// ── 예제 ──────────────────────────────────────────────────────────────────

const RULES = [
  "입사 1년 미만은 한 달에 1일씩 생기고, 1년이 지나면 15일이 생겨요.",
  "쓰지 않은 연차는 다음 해 3월에 정산해요. 정산할 때 반차는 0.5일로 셈해요.",
  "공휴일 · 회사 휴무일에 겹친 날은 연차에서 빼지 않아요.",
  "팀장 승인 뒤 본부장 승인까지 받아야 쓸 수 있어요.",
];

export const popoverExamples = [
  {
    title: "안내",
    description:
      "칸 옆 i 버튼(Button ghost · xsmall · 아이콘만 — 이름은 aria-label)이 연다. 안내 팝오버는 머리에 제목(20 / 27 · 700)과 닫기(52 상자 · 아이콘 22 fg-neutral-subtle — 아이콘이 위 27 · 오른쪽 24)를 둔다. 표면은 폭 320 ~ 480(화면 가장자리 16 을 남긴다) · 모서리 20 · 그림자 s3 이고 트리거 아래 8 에 뜬다 — 딤이 없고 뒤 화면을 막지 않는다(비모달). 열면 초점이 안으로(닫기 버튼이 아니라 내용) 가지만 가두지 않는다 — 마지막에서 Tab 으로 나가면 닫히고, 바깥 · Esc 로 닫으면 트리거로 돌아간다. 1280 미만에서는 같은 내용을 Bottom Sheet 로 띄운다.",
    jsx: `import { Popover, PopoverBody, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

{/* 1280 이상 — 1280 미만에서는 같은 내용을 Bottom Sheet 로 띄운다(useInputButtonSurface() 로 고른다) */}
<Popover>
  <PopoverTrigger asChild>
    <Button variant="ghost" size="xsmall" layout="iconOnly" aria-label="연차 사용 규정"><Info /></Button>
  </PopoverTrigger>
  <PopoverContent title="연차 사용 규정">
    <PopoverBody>입사 1년 미만은 한 달에 1일씩 생기고, 1년이 지나면 15일이 생겨요.</PopoverBody>
  </PopoverContent>
</Popover>`,
    render: () =>
      infoStage({
        uid: "popover-ex-info",
        label: "남은 연차 8.5일",
        triggerLabel: "연차 사용 규정",
        title: "연차 사용 규정",
        text: [RULES[0]],
      }),
  },

  {
    title: "넘칠 수 있는 본문 — 끝 흐림 · 머리 아래 선",
    description:
      "높이는 600 과 남은 공간 중 작은 쪽까지다 — 넘치면 본문(PopoverBody)만 스크롤하고 머리는 그대로다. 넘칠 수 있는 본문은 scrollFog 를 준다 — 위 20 · 아래 80 이 마스크로 늘 흐리고 본문 안에 그만큼 여백(위 20 · 아래 80)을 둬 끝까지 내리면 흐림이 빈 여백 위에 놓인다(Scroll Fog — 옛 \"넘칠 때만 아래 48\" 을 대신한다). 넘친 본문은 키보드로도 스크롤하도록 Tab 이 선다. 위로 스크롤하면 머리의 안쪽 아래 1px stroke-neutral-subtle 선이 150ms 로 나타난다 — Dialog 의 본문과 같다. 위는 맨 위, 아래는 조금 스크롤한 순간을 멈춘 그림이다(정적 미리보기라 본문 글을 32 올려 그렸다). 긴 안내 · 단계가 있는 설명은 팝오버가 아니라 페이지 · 도움말로 옮긴다.",
    jsx: `<PopoverContent title="연차 사용 규정" description="2026년 기준">
  {/* 넘칠 수 있는 본문 — scrollFog 는 늘 켜진 끝 흐림. 위로 스크롤되면 data-scrolled(머리 아래 선) — 레시피가 재서 단다 */}
  <PopoverBody scrollFog>
    <p>입사 1년 미만은 한 달에 1일씩 생기고, 1년이 지나면 15일이 생겨요.</p>
    <p>쓰지 않은 연차는 다음 해 3월에 정산해요. 정산할 때 반차는 0.5일로 셈해요.</p>
    <p>공휴일 · 회사 휴무일에 겹친 날은 연차에서 빼지 않아요.</p>
    <p>팀장 승인 뒤 본부장 승인까지 받아야 쓸 수 있어요.</p>
  </PopoverBody>
</PopoverContent>`,
    render: () =>
      [
        infoStage({
          uid: "popover-ex-overflow",
          label: "남은 연차 8.5일",
          triggerLabel: "연차 사용 규정",
          title: "연차 사용 규정",
          description: "2026년 기준",
          text: RULES,
          height: 380,
          scrollFog: true,
          overflow: true,
          availableHeight: "240px",
        }),
        infoStage({
          uid: "popover-ex-scrolled",
          label: "남은 연차 8.5일",
          triggerLabel: "연차 사용 규정",
          title: "연차 사용 규정",
          description: "2026년 기준",
          text: RULES,
          height: 380,
          scrollFog: true,
          overflow: true,
          scrolled: true,
          availableHeight: "240px",
        }),
      ].join(`<div style="height:var(--spacing-x4);"></div>`),
  },

  {
    title: "고르는 패널 — 머리 없이 · 바닥 완료",
    description:
      "Input Button 의 고르는 패널(달력 · 시각 · 목록)은 1280 이상에서 팝오버로 연다 — 머리 없이 본문만이고(무엇을 고르는지는 트리거가 말한다) 표면에 aria-label 로 고를 값의 종류(\"날짜 선택\")를 이름으로 단다. 칸 아래 8 · 왼쪽 맞춤(align=\"start\")이다. 확정이 필요한 달력 · 시각만 바닥(PopoverFooter — Button small 36, 오른쪽)에 \"완료\" 를 두고, 누르는 순간 고르는 목록 · 격자는 바닥이 없다. 머리가 없으면 본문이 위 24 를 가진다. 달력은 Date Picker 다 — 팝오버 안에서 336(칸 48 × 7) · 늘 6주이고, 오늘(2일)은 옅은 원 + 굵은 숫자, 고른 날은 짙은 원, 고를 수 없는 날(할 일 마감은 오늘부터 — min)은 흐린 숫자 + 취소선이다. 하루를 고르기 전에는 \"완료\" 가 막힌다. 기간을 고르는 팝오버는 두 달 나란히(744 — date-picker 페이지)다.",
    jsx: `import { DatePicker, formatDateValue } from "@/components/ui/date-picker"
import { InputButton, useInputButtonSurface } from "@/components/ui/input-button"
import { Popover, PopoverBody, PopoverContent, PopoverFooter, PopoverTrigger } from "@/components/ui/popover"

{/* 1280 이상 — useInputButtonSurface() === "popover" */}
<Field label="마감일">
  <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <InputButton size="medium" value={formatDateValue(due)} suffixIcon={<CalendarDays />} aria-haspopup="dialog" aria-expanded={open} />
    </PopoverTrigger>
    <PopoverContent align="start" aria-label="날짜 선택">
      <PopoverBody>
        <DatePicker selection="single" min={today} value={draft} onValueChange={setDraft} />
      </PopoverBody>
      <PopoverFooter>
        <Button onClick={() => { setDue(draft); setOpen(false) }} disabled={!draft}>완료</Button>
      </PopoverFooter>
    </PopoverContent>
  </Popover>
</Field>`,
    render: () => {
      const uid = "popover-ex-pick";
      const field = pickField({ uid: `${uid}-field`, label: "마감일", value: "10월 9일 (금)", contentId: uid });
      const panel = popoverContent({
        uid,
        ariaLabel: "날짜 선택",
        align: "start",
        body: { html: datePickerHtml({ uid: `${uid}-dp`, value: new Date(2026, 9, 9), min: new Date(2026, 9, 2) }) },
        footer: [button({ variant: "neutralSolid", size: "small", children: "완료" })],
      });
      return `<div style="${STAGE(680)}"><div style="${PAGE}"><div aria-hidden="true" style="${PAGE_TITLE}">할 일</div><div style="padding:var(--spacing-x4) var(--spacing-x6) var(--spacing-x6); border-radius:var(--radius-r4); background:var(--color-bg-layer-default);"><div style="${ANCHOR}">${field}${panel}</div></div></div></div>`;
    },
  },
];
