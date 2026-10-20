/*
 * shadcn Button 예제 — docs site components/button.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }.
 *
 * BASE · VARIANT · SIZE · LAYOUT · GHOST_COLOR · FLUSH · COMPOUND · DEFAULTS 는
 * recipes/shadcn/components/ui/button.tsx 의 cva 정의와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다.
 * 로딩 원은 Progress Circle 이다 — PC_* 는 progress-circle.tsx 의 상수(SIZE · TONE 의 inherit · ROOT · SPIN · CIRCLE · TRACK · RANGE ·
 * RANGE_INDETERMINATE · KEYFRAMES)와 같고(progress-circle-examples.mjs 와 같은 사본), 크기 · 두께 · 색은 버튼이 정한 --progress-* 를 따른다.
 * 규칙은 specs/components/button.md, 수치 원본은 specs/components/button.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 아이콘은 JSX 에서 lucide-react 를 import 하고, render 에서는 inline SVG 로 그린다.
 */

// ── button.tsx 의 cva 와 같은 값 ─────────────────────────────────────────

const BASE = [
  "relative inline-flex items-center justify-center whitespace-nowrap font-sans font-bold",
  // 누르는 영역 44 — 보이는 상자보다 작으면 ::before 가 넓힌다
  "before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  // 색은 color-transition, 축소는 pressed-scale
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed disabled:[scale:1] disabled:bg-bg-disabled disabled:text-fg-disabled",
  // 로딩 — 라벨은 투명하게(폭 유지), 누름 축소 없음. 누르기는 onClick 에서 삼킨다
  "aria-busy:cursor-progress aria-busy:text-transparent aria-busy:[&>svg:not([data-slot=progress-circle])]:invisible aria-busy:active:[scale:1]",
  "[--progress-thickness:2px]",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
].join(" ");

const VARIANT = {
  brandSolid:
    "bg-bg-brand-solid text-static-white hover:bg-bg-brand-solid-pressed active:bg-bg-brand-solid-pressed aria-busy:bg-bg-brand-solid-pressed [--progress-track:color-mix(in_srgb,var(--color-static-white)_30%,transparent)] [--progress-range:var(--color-static-white)]",
  neutralSolid:
    "bg-bg-neutral-inverted text-fg-neutral-inverted hover:bg-bg-neutral-inverted-pressed active:bg-bg-neutral-inverted-pressed aria-busy:bg-bg-neutral-inverted-pressed [--progress-track:color-mix(in_srgb,var(--color-fg-neutral-inverted)_30%,transparent)] [--progress-range:var(--color-fg-neutral-inverted)]",
  neutralWeak:
    "bg-bg-neutral-weak text-fg-neutral hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed aria-busy:bg-bg-neutral-weak-pressed [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
  criticalSolid:
    "bg-bg-critical-solid text-static-white hover:bg-bg-critical-solid-pressed active:bg-bg-critical-solid-pressed aria-busy:bg-bg-critical-solid-pressed [--progress-track:color-mix(in_srgb,var(--color-static-white)_30%,transparent)] [--progress-range:var(--color-static-white)]",
  brandOutline:
    "border border-stroke-neutral-weak bg-transparent text-fg-brand hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed aria-busy:bg-transparent disabled:bg-transparent [--progress-track:var(--color-bg-brand-weak-pressed)] [--progress-range:var(--color-stroke-brand-solid)]",
  neutralOutline:
    "border border-stroke-neutral-weak bg-transparent text-fg-neutral hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed aria-busy:bg-transparent disabled:bg-transparent [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
  ghost:
    "bg-transparent text-fg-neutral hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed aria-busy:bg-bg-layer-default-pressed disabled:bg-transparent [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
};

const SIZE = {
  xsmall: "h-8 rounded-full [--press-basis:32] [--progress-size:14px]",
  small: "h-9 rounded-r2 [--press-basis:36] [--progress-size:14px]",
  medium: "h-10 rounded-r2 [--press-basis:40] [--progress-size:16px]",
  // SEED large 는 52 — groo 는 48(button.md "SEED 와 다른 점")
  large: "h-12 rounded-r3 [--press-basis:48] [--progress-size:18px]",
};

const LAYOUT = {
  withText: "",
  iconOnly: "",
};

// ghost 의 글자색(SEED ghost 의 color)
const GHOST_COLOR = {
  neutral: "",
  neutralSubtle: "",
  brand: "",
  critical: "",
};

// 가장자리 맞춤(SEED bleed) — 그 방향 가로 여백만 0. 여백은 크기 × 배치 조합 뒤에서 뺀다(아래)
const FLUSH = {
  left: "",
  right: "",
};

const COMPOUND = [
  // 크기 × 배치 — 여백 · 간격 · 글자 · 아이콘(button.yaml)
  { size: "xsmall", layout: "withText", className: "px-x3_5 py-x1_5 gap-x1 text-t3 [&_svg]:size-3.5" },
  { size: "small", layout: "withText", className: "px-x3_5 py-x2 gap-x1 text-t4 [&_svg]:size-3.5" },
  { size: "medium", layout: "withText", className: "px-x4 py-x2_5 gap-x1_5 text-t4 [&_svg]:size-4" },
  { size: "large", layout: "withText", className: "px-x5 py-x3 gap-x2 text-t6 [&_svg]:size-[22px]" },
  { size: "xsmall", layout: "iconOnly", className: "w-8 p-x1_5 [&_svg]:size-3.5" },
  { size: "small", layout: "iconOnly", className: "w-9 p-x2 [&_svg]:size-4" },
  { size: "medium", layout: "iconOnly", className: "w-10 p-x2_5 [&_svg]:size-[18px]" },
  { size: "large", layout: "iconOnly", className: "w-12 p-x3 [&_svg]:size-[22px]" },
  // 가장자리 맞춤 — 크기 × 배치의 px 보다 뒤에 둬야 tailwind-merge 가 pl-0 · pr-0 을 남긴다
  { flush: "left", className: "pl-0" },
  { flush: "right", className: "pr-0" },
  // ghost 글자색
  { variant: "ghost", ghostColor: "neutralSubtle", className: "text-fg-neutral-subtle" },
  { variant: "ghost", ghostColor: "brand", className: "text-fg-brand" },
  { variant: "ghost", ghostColor: "critical", className: "text-fg-critical" },
  // flush ghost 는 텍스트 버튼 — 배경 없이 글자색으로만 반응한다(button.md "groo 에만 있는 것")
  {
    variant: "ghost",
    flush: ["left", "right"],
    className:
      "text-fg-neutral-subtle hover:bg-transparent hover:text-fg-neutral active:bg-transparent active:text-fg-neutral focus-visible:text-fg-neutral",
  },
];

const DEFAULTS = {
  variant: "neutralSolid",
  size: "medium",
  layout: "withText",
  ghostColor: "neutral",
};

// ── cva 풀이 ──────────────────────────────────────────────────────────────

// cva 의 variants 선언 순서
const AXES = { variant: VARIANT, size: SIZE, layout: LAYOUT, ghostColor: GHOST_COLOR, flush: FLUSH };

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순) → className.
function cvaClass(props, className = "") {
  const p = { ...DEFAULTS };
  for (const [k, v] of Object.entries(props)) if (v !== undefined) p[k] = v;
  const parts = [BASE];
  for (const [axis, map] of Object.entries(AXES)) if (p[axis] !== undefined) parts.push(map[p[axis]]);
  for (const { className: cls, ...when } of COMPOUND) {
    const hit = Object.entries(when).every(([k, v]) => (Array.isArray(v) ? v.includes(p[k]) : p[k] === v));
    if (hit) parts.push(cls);
  }
  parts.push(className);
  return parts.filter(Boolean).join(" ");
}

// "aria-busy:[&>svg:not([data-slot=progress-circle])]:invisible" → ["aria-busy", "[&>svg:not([data-slot=progress-circle])]", "invisible"]
// — 괄호 안의 ":" 는 가르지 않는다.
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

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다. 합치지 않고 둘 다 두면 Tailwind 가
// 같은 속성의 utility 를 이름 순으로 찍어 뒤에 붙인 쪽이 지기도 한다(text-fg-critical 이 text-fg-neutral 에 진다).
// 겹칠 수 있는 무리만 본다 — 배경 · 글자색 · 모서리 · 폭 · 높이 · 임의 속성([prop:…]).
// text-t* 는 글자 크기라 글자색과 겹치지 않는다. 여백은 보지 않는다 — flush 의 pl-0 · pr-0 은 compound 순서로도,
// Tailwind 가 찍는 순서(padding-inline 뒤 padding-left)로도 px-* 뒤라 이긴다.
const GROUPS = [
  [/^bg-/, "bg"],
  [/^text-(?:fg-|static-|transparent$)/, "color"],
  [/^rounded-(?:none|full|r\d+)$/, "rounded"],
  [/^w-/, "w"],
  [/^h-/, "h"],
];

function conflictKey(cls) {
  const segs = splitVariants(cls);
  const utility = segs.pop();
  const prop = /^\[([\w-]+):/.exec(utility);
  const group = prop ? `[${prop[1]}]` : GROUPS.find(([re]) => re.test(utility))?.[1];
  return group ? `${segs.join(":")}|${group}` : null;
}

function merge(classList) {
  const seen = new Set();
  const kept = [];
  for (const cls of classList.split(/\s+/).filter(Boolean).reverse()) {
    const key = conflictKey(cls);
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);
    kept.push(cls);
  }
  return kept.reverse().join(" ");
}

// 정적 미리보기에서 호버 · 포커스 · 누름을 보이려고 — 그 상태의 클래스(hover: · focus-visible: · active:)에서
// 접두어만 뗀 사본을 뒤에 붙인다. 값은 cva 그대로라 button.tsx 가 바뀌면 같이 따라간다.
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

// ── progress-circle.tsx 의 상수와 같은 값 — 버튼 안의 로딩 원(size · tone inherit) ─────────

// 크기 · 두께 — 버튼이 정한 --progress-size(14 · 14 · 16 · 18) · --progress-thickness(2)
const PC_SIZE = {
  inherit: "[--pc-size:var(--progress-size,1em)] [--pc-thickness:var(--progress-thickness,2px)]",
};
// 원 · 트랙 색 — 변형이 정한 --progress-range · --progress-track
const PC_TONE = {
  inherit:
    "[--pc-track:var(--progress-track,color-mix(in_srgb,currentColor_30%,transparent))] [--pc-range:var(--progress-range,currentColor)]",
};
const PC_ROOT = "inline-block shrink-0 overflow-visible align-middle";
const PC_SPIN = "animate-[groo-progress-circle-rotate_1200ms_cubic-bezier(0.35,0.25,0.65,0.75)_infinite] motion-reduce:animate-none";
const PC_CIRCLE =
  "fill-none [cx:calc(var(--pc-size)/2)] [cy:calc(var(--pc-size)/2)] [r:calc(var(--pc-size)/2_-_var(--pc-thickness)/2)] [stroke-width:var(--pc-thickness)]";
const PC_TRACK = `${PC_CIRCLE} [stroke:var(--pc-track)]`;
const PC_RANGE = `${PC_CIRCLE} [stroke:var(--pc-range)] [stroke-linecap:round] [transform-box:fill-box] [transform-origin:center] [transform:rotate(-90deg)]`;
const PC_RANGE_INDETERMINATE = [
  "animate-[groo-progress-circle-head_1200ms_cubic-bezier(0.35,0,0.65,1)_infinite,groo-progress-circle-tail_1200ms_cubic-bezier(0.35,0,0.65,0.6)_infinite]",
  "motion-reduce:animate-none motion-reduce:[stroke-dasharray:75_200]",
].join(" ");
const PC_KEYFRAMES = [
  "@keyframes groo-progress-circle-rotate { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }",
  "@keyframes groo-progress-circle-head { 0% { stroke-dasharray: 0 200 } 75%, 100% { stroke-dasharray: 100 200 } }",
  "@keyframes groo-progress-circle-tail { 0%, 33.33% { stroke-dashoffset: 0 } 100% { stroke-dashoffset: -100 } }",
].join("\n");

// 레시피는 키프레임을 <style href precedence>(React 19 — 문서 머리에 한 번)로 싣는다 — 정적 HTML 은 로딩 버튼이 있는 예제마다 한 번 둔다
const PC_STYLE = `<style data-href="groo-progress-circle" data-precedence="groo">${PC_KEYFRAMES}</style>`;

// button.tsx 의 로딩 원 — <ProgressCircle size="inherit" tone="inherit" aria-hidden className="absolute left-1/2 top-1/2 …" />.
// 겹치는 클래스가 없어 cn() 은 이어 붙이기와 같다. 상자 크기는 레시피처럼 style 로 — [&_svg]:size-* 가 원을 덮지 않는다
const PROGRESS_CIRCLE = `<svg role="progressbar" aria-label="불러오는 중" aria-hidden="true" data-slot="progress-circle" data-size="inherit" data-tone="inherit" data-mode="indeterminate" class="${[
  PC_ROOT,
  PC_SIZE.inherit,
  PC_TONE.inherit,
  PC_SPIN,
  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
].join(" ")}" style="width:var(--pc-size); height:var(--pc-size);"><circle data-slot="progress-circle-track" class="${PC_TRACK}"></circle><circle data-slot="progress-circle-range" pathLength="100" class="${PC_RANGE} ${PC_RANGE_INDETERMINATE}"></circle></svg>`;

// <Button> 한 개. label = aria-label(아이콘만일 때), force = 미리보기용 강제 상태("hover" · "focus-visible" · "active").
// 로딩이면 button.tsx 처럼 자식을 감싸지 않고 그대로 둔 채 로딩 원을 덧붙이고 aria-busy 를 단다.
function btn({
  variant = "neutralSolid",
  size = "medium",
  layout = "withText",
  ghostColor = "neutral",
  flush,
  disabled = false,
  loading = false,
  label = "",
  children = "",
  extra = "",
  force = "",
} = {}) {
  let cls = merge(cvaClass({ variant, size, layout, ghostColor, flush }, extra));
  if (force) cls = merge(`${cls} ${forceState(cls, force)}`);
  const attrs = [
    `class="${cls}"`,
    label && `aria-label="${label}"`,
    loading && 'aria-busy="true"',
    disabled && "disabled",
  ]
    .filter(Boolean)
    .join(" ");
  return `<button ${attrs}>${children}${loading ? PROGRESS_CIRCLE : ""}</button>`;
}

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const svg = (body) =>
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const ICONS = {
  plus: svg('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'),
  download: svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>'),
  chevronRight: svg('<path d="m9 18 6-6-6-6"/>'),
  ellipsis: svg('<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>'),
  scissors: svg('<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>'),
};

// 인접한 버튼 사이는 8(spacing-x2) — button.md "버튼 배치"
const ROW = "display:flex; flex-wrap:wrap; align-items:center; gap:var(--spacing-x2);";
const GALLERY = "display:flex; flex-wrap:wrap; align-items:flex-end; gap:var(--spacing-x4);";
const CAPTION =
  "font-size:var(--text-t2); line-height:var(--text-t2--line-height); font-weight:400; color:var(--color-fg-neutral-subtle);";
// 변형 · 크기 · 상태 이름처럼 코드로 쓰는 이름표
const CODE = `${CAPTION} font-family:ui-monospace, SFMono-Regular, Menlo, monospace;`;

// 버튼은 보통 기본 레이어(흰 면) 위에 놓인다. 사이트 미리보기 칸의 바탕(bg-page = bg-layer-basement)은
// neutralWeak · disabled 의 채움(gray-200)과 같은 색이라, 그 위에 바로 그리면 채움이 보이지 않는다.
const SURFACE =
  "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-x6);";
const surface = (html) => `<div style="${SURFACE}">${html}</div>`;

// 모바일 화면 아래쪽 — 하단 고정 바
const MOBILE_FRAME =
  "max-width:360px; margin:0 auto; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-weak); border-radius:var(--radius-r4); overflow:hidden;";
const MOBILE_BAR =
  "display:flex; gap:var(--spacing-x2); padding:var(--spacing-x3) var(--spacing-x4) var(--spacing-x4); border-top:1px solid var(--color-stroke-neutral-weak);";
const mobile = (bar) =>
  `<div style="${MOBILE_FRAME}">
  <div style="padding:var(--spacing-x4) var(--spacing-x4) var(--spacing-x6); ${CAPTION}">모바일 화면 · 폭 360 · 하단 고정 바</div>
  <div style="${MOBILE_BAR}">${bar}</div>
</div>`;

// 버튼 아래 이름표
function labeled(html, caption, style = CODE) {
  return `<div style="display:flex; flex-direction:column; align-items:center; gap:var(--spacing-x2);">${html}<span style="${style}">${caption}</span></div>`;
}

// ── 예제 ──────────────────────────────────────────────────────────────────

export const buttonExamples = [
  {
    title: "변형 7가지",
    description:
      "강조하려는 정도로 고른다. 강 — brandSolid · neutralSolid · criticalSolid(한 화면에 하나), 중 — neutralWeak(대부분의 액션), 약 — brandOutline · neutralOutline · ghost. 대부분의 CTA 는 neutralSolid 다.",
    jsx: `<div className="flex flex-wrap items-center gap-x2">
  <Button variant="brandSolid">거래 추가</Button>
  <Button variant="neutralSolid">저장</Button>
  <Button variant="neutralWeak">취소</Button>
  <Button variant="criticalSolid">삭제</Button>
  <Button variant="brandOutline">예산 설정</Button>
  <Button variant="neutralOutline">기록 보기</Button>
  <Button variant="ghost">편집</Button>
</div>`,
    render: () =>
      surface(`<div style="${GALLERY}">
  ${labeled(btn({ variant: "brandSolid", children: "거래 추가" }), "brandSolid")}
  ${labeled(btn({ variant: "neutralSolid", children: "저장" }), "neutralSolid")}
  ${labeled(btn({ variant: "neutralWeak", children: "취소" }), "neutralWeak")}
  ${labeled(btn({ variant: "criticalSolid", children: "삭제" }), "criticalSolid")}
  ${labeled(btn({ variant: "brandOutline", children: "예산 설정" }), "brandOutline")}
  ${labeled(btn({ variant: "neutralOutline", children: "기록 보기" }), "neutralOutline")}
  ${labeled(btn({ variant: "ghost", children: "편집" }), "ghost")}
</div>`),
  },

  {
    title: "brandSolid — 핵심 액션 하나",
    description:
      "브랜드 색은 서비스의 중심 동작 하나에만 쓴다 — Desk \"거래 추가\", HR \"휴가 신청\". 한 화면에 하나이고, 저장 · 확인 · 다음 같은 일반 CTA 는 neutralSolid 다.",
    jsx: `import { Plus } from "lucide-react"

// 서비스의 중심 동작 — 한 화면에 하나
<Button variant="brandSolid" onClick={openNewTransaction}>
  <Plus />
  거래 추가
</Button>`,
    render: () =>
      surface(`<div style="${ROW}">
  ${btn({ variant: "brandSolid", children: `${ICONS.plus}거래 추가` })}
</div>`),
  },

  {
    title: "크기 4가지",
    description:
      "크기는 이름이 아니라 높이로 고른다. xsmall 32(좁은 자리, 알약) · small 36(화면 안 범용, 모달 footer) · medium 40(기본) · large 48(CTA — 모바일 하단 · 모바일 모달 footer). 여백 · 글자 · 아이콘은 크기마다 다르고, 누르는 영역은 보이는 크기와 따로 44×44 까지 넓힌다.",
    jsx: `<div className="flex items-end gap-x4">
  <Button size="xsmall">저장</Button>
  <Button size="small">저장</Button>
  <Button size="medium">저장</Button>
  <Button size="large">저장</Button>
</div>`,
    render: () =>
      surface(`<div style="${GALLERY}">
  ${labeled(btn({ size: "xsmall", children: "저장" }), "xsmall · 32")}
  ${labeled(btn({ size: "small", children: "저장" }), "small · 36")}
  ${labeled(btn({ size: "medium", children: "저장" }), "medium · 40")}
  ${labeled(btn({ size: "large", children: "저장" }), "large · 48")}
</div>`),
  },

  {
    title: "배치 — 글자 · 앞 아이콘 · 뒤 아이콘 · 아이콘만",
    description:
      "앞 아이콘은 동작의 뜻을 돕고(추가의 +), 뒤 아이콘은 동작을 돕는다(다음의 chevron) — 둘을 함께 쓰지 않는다. 아이콘만은 정사각이고 이름(aria-label)을 반드시 단다. 옛 icon · iconLg 는 medium · iconOnly 다.",
    jsx: `import { Plus, ChevronRight, Ellipsis } from "lucide-react"

<div className="flex items-center gap-x2">
  {/* 글자만 */}
  <Button variant="neutralWeak">저장</Button>
  {/* 앞 아이콘 — 동작의 뜻을 돕는다 */}
  <Button variant="neutralWeak">
    <Plus />
    추가
  </Button>
  {/* 뒤 아이콘 — 동작을 돕는다 */}
  <Button variant="neutralWeak">
    다음
    <ChevronRight />
  </Button>
  {/* 아이콘만 — 정사각, 이름 필수 */}
  <Button variant="neutralWeak" layout="iconOnly" aria-label="더보기">
    <Ellipsis />
  </Button>
</div>`,
    render: () =>
      surface(`<div style="${GALLERY}">
  ${labeled(btn({ variant: "neutralWeak", children: "저장" }), "글자만", CAPTION)}
  ${labeled(btn({ variant: "neutralWeak", children: `${ICONS.plus}추가` }), "앞 아이콘", CAPTION)}
  ${labeled(btn({ variant: "neutralWeak", children: `다음${ICONS.chevronRight}` }), "뒤 아이콘", CAPTION)}
  ${labeled(btn({ variant: "neutralWeak", layout: "iconOnly", label: "더보기", children: ICONS.ellipsis }), "아이콘만", CAPTION)}
</div>`),
  },

  {
    title: "상태 — 비활성 · 로딩",
    description:
      "비활성은 전용 색(bg-disabled · fg-disabled)이다 — 불투명도로 흐리게 하지 않는다. 로딩은 누름 색 위에 로딩 원을 얹고, 라벨은 글자 · 아이콘 색만 투명하게 해 폭이 그대로다. 로딩 중에는 누르기(포인터 · Enter · Space)를 자동으로 막고 aria-busy=\"true\" 를 단다. 로딩이 아니어도 onClick 이 Promise 를 돌려주면(mutateAsync) 끝날 때까지 다음 누름을 버린다 — 시간 창은 없다.",
    jsx: `import { Download } from "lucide-react"

// 비활성 — 전용 색. 흐리게 하지 않는다
<Button disabled>변경 내용 저장</Button>

// 로딩 — 라벨 자리에 로딩 원, 폭은 그대로. 누르기를 막고 aria-busy="true" 를 단다.
// save 가 Promise 를 돌려주면(mutateAsync) 끝날 때까지 다음 누름을 버린다
<Button loading={isSaving} onClick={save}>변경 내용 저장</Button>
<Button variant="neutralWeak" loading={isExporting} onClick={exportCsv}>
  <Download />
  내보내기
</Button>`,
    render: () =>
      surface(`${PC_STYLE}<div style="display:grid; grid-template-columns:repeat(3, max-content); align-items:end; gap:var(--spacing-x4) var(--spacing-x5);">
  ${labeled(btn({ children: "변경 내용 저장" }), "enabled")}
  ${labeled(btn({ loading: true, children: "변경 내용 저장" }), "loading")}
  ${labeled(btn({ disabled: true, children: "변경 내용 저장" }), "disabled")}
  ${labeled(btn({ variant: "neutralWeak", children: `${ICONS.download}내보내기` }), "enabled")}
  ${labeled(btn({ variant: "neutralWeak", loading: true, children: `${ICONS.download}내보내기` }), "loading")}
  ${labeled(btn({ variant: "neutralWeak", disabled: true, children: `${ICONS.download}내보내기` }), "disabled")}
</div>`),
  },

  {
    title: "상태 매트릭스",
    description:
      "변형 × 상태. 정적 미리보기라 hovered · focused · pressed 는 cva 의 hover: · focus-visible: · active: 클래스에서 접두어만 떼어 붙여 모양을 보인다. hovered 는 누름 색과 같고 축소가 없다. focused 는 링 2px · 띄움 2px, pressed 는 누름 색 + 세로 2px 축소, loading 은 누름 색 위 로딩 원(Outline 은 바탕 그대로), disabled 는 전용 색이다.",
    jsx: `// 상태는 button.tsx 의 cva 가 가상 클래스로 처리한다 — 따로 선언하지 않는다.
<Button>저장</Button>
// :hover          누름 색(bg-neutral-inverted-pressed), 축소 없음
// :focus-visible  outline 2px stroke-focus-ring · offset 2px
// :active         누름 색 + 세로 2px 축소(scale = 1 − 2 ÷ --press-basis)
// :disabled       bg-disabled · fg-disabled

<Button loading>저장</Button>
// aria-busy="true" — 누름 색 위 로딩 원, 라벨은 투명(폭 유지), 누르기는 onClick 에서 삼킨다`,
    render: () => {
      const states = ["enabled", "hovered", "focused", "pressed", "loading", "disabled"];
      const force = { hovered: "hover", focused: "focus-visible", pressed: "active" };
      const th = `style="padding:var(--spacing-x2); text-align:center; ${CODE}"`;
      const rowTh = `style="padding:var(--spacing-x2) var(--spacing-x3) var(--spacing-x2) 0; text-align:left; ${CODE}"`;
      const td = `style="padding:var(--spacing-x2); text-align:center;"`;
      const cell = (variant, state) =>
        btn({
          variant,
          size: "small",
          force: force[state],
          loading: state === "loading",
          disabled: state === "disabled",
          children: "저장",
        });
      return surface(`${PC_STYLE}<div style="overflow-x:auto;">
  <table style="border-collapse:collapse;">
    <thead>
      <tr><th ${th}></th>${states.map((s) => `<th scope="col" ${th}>${s}</th>`).join("")}</tr>
    </thead>
    <tbody>
      ${Object.keys(VARIANT)
        .map((v) => `<tr><th scope="row" ${rowTh}>${v}</th>${states.map((s) => `<td ${td}>${cell(v, s)}</td>`).join("")}</tr>`)
        .join("\n      ")}
    </tbody>
  </table>
</div>`);
    },
  },

  {
    title: "ghost 글자색",
    description:
      "ghost 는 ghostColor 로 글자색만 바꾼다 — 배경 · 누름은 그대로다. neutral(기본) · neutralSubtle(목록 행 · 툴바의 보조 액션) · brand(본문 속 \"자세히 보기\" — 옛 accent · link) · critical(확인 창을 여는 삭제 — 옛 dangerSoft).",
    jsx: `<div className="flex flex-wrap items-center gap-x2">
  <Button variant="ghost">편집</Button>
  <Button variant="ghost" ghostColor="neutralSubtle">더보기</Button>
  <Button variant="ghost" ghostColor="brand">자세히 보기</Button>
  <Button variant="ghost" ghostColor="critical">삭제</Button>
</div>`,
    render: () =>
      surface(`<div style="${GALLERY}">
  ${labeled(btn({ variant: "ghost", children: "편집" }), "neutral")}
  ${labeled(btn({ variant: "ghost", ghostColor: "neutralSubtle", children: "더보기" }), "neutralSubtle")}
  ${labeled(btn({ variant: "ghost", ghostColor: "brand", children: "자세히 보기" }), "brand")}
  ${labeled(btn({ variant: "ghost", ghostColor: "critical", children: "삭제" }), "critical")}
</div>`),
  },

  {
    title: "너비 채움",
    description:
      "기본은 내용 맞춤이다. 모바일 하단 고정 CTA · 폼의 마지막 제출은 컨테이너 폭을 채운다(w-full) — 모바일 하단 CTA 는 large + 채움 + 안전 영역이다. 최소 너비는 두지 않는다.",
    jsx: `// 모바일 하단 고정 CTA — large + 채움 + 안전 영역
<div className="fixed inset-x-0 bottom-0 border-t border-stroke-neutral-weak bg-bg-layer-default px-x4 pt-x3 pb-safe">
  <Button size="large" className="w-full">저장</Button>
</div>`,
    render: () => mobile(btn({ size: "large", extra: "w-full", children: "저장" })),
  },

  {
    title: "모달 footer",
    description:
      "오른쪽에 [취소 neutralWeak] [저장 neutralSolid] 를 small(36)로 둔다. 확인 창을 여는 삭제는 왼쪽에 ghost + critical 글자로 두고, 삭제의 확정은 Alert Dialog 의 criticalSolid 가 맡는다. 삭제는 flush 없이 mr-auto 로 왼쪽에 붙인다 — flush 는 빨간 글자를 neutralSubtle 로 덮는다. footer 버튼은 라벨만 쓰고 아이콘을 붙이지 않는다. neutralOutline 둘로 두지 않는다.",
    jsx: `// 대화상자 footer — 라벨만. 삭제는 확인 창을 연다(확정은 Alert Dialog 의 criticalSolid)
<div className="flex items-center gap-x2">
  <Button variant="ghost" ghostColor="critical" size="small" className="mr-auto" onClick={openDeleteConfirm}>
    삭제
  </Button>
  <Button variant="neutralWeak" size="small">취소</Button>
  <Button size="small">저장</Button>
</div>`,
    render: () =>
      surface(`<div style="display:flex; align-items:center; gap:var(--spacing-x2); padding-top:var(--spacing-x4); border-top:1px solid var(--color-stroke-neutral-weak);">
  ${btn({ variant: "ghost", ghostColor: "critical", size: "small", extra: "mr-auto", children: "삭제" })}
  ${btn({ variant: "neutralWeak", size: "small", children: "취소" })}
  ${btn({ size: "small", children: "저장" })}
</div>`),
  },

  {
    title: "화면 하단 CTA 3:7",
    description:
      "닫기 · 초기화 같은 neutralWeak 와 CTA 를 나란히 채울 때 3:7 로 나눈다 — 위계가 분명해진다. 화면 하단 고정 바라 large(48)이고, 셋 이상 나란히 두지 않는다. 모달 footer 는 이 비율이 아니라 Dialog · Bottom Sheet 의 나눔을 따른다.",
    jsx: `// 화면 하단 고정 CTA 둘 — large, neutralWeak : CTA = 3 : 7
<div className="fixed inset-x-0 bottom-0 flex gap-x2 border-t border-stroke-neutral-weak bg-bg-layer-default px-x4 pt-x3 pb-safe">
  <Button variant="neutralWeak" size="large" className="flex-[3]">닫기</Button>
  <Button size="large" className="flex-[7]">저장</Button>
</div>`,
    render: () =>
      mobile(`${btn({ variant: "neutralWeak", size: "large", extra: "flex-[3]", children: "닫기" })}
    ${btn({ size: "large", extra: "flex-[7]", children: "저장" })}`),
  },

  {
    title: "Outline 조합",
    description:
      "강조가 낮은 보조 액션을 한 화면에 여러 번 둘 때 neutralOutline + brandOutline 으로 짝짓는다. Outline 은 Solid 와 함께 쓰지 않는다.",
    jsx: `<div className="flex items-center gap-x2">
  <Button variant="neutralOutline">기록 보기</Button>
  <Button variant="brandOutline">예산 설정</Button>
</div>`,
    render: () =>
      surface(`<div style="${ROW}">
  ${btn({ variant: "neutralOutline", children: "기록 보기" })}
  ${btn({ variant: "brandOutline", children: "예산 설정" })}
</div>`),
  },

  {
    title: "가장자리 맞춤(flush)",
    description:
      "SEED 의 bleed 와 같다. ghost + 앞 아이콘이 컨테이너 가장자리의 첫 · 끝 요소일 때 flush=\"left\" | \"right\" 로 그 방향 가로 여백을 0 으로 해 아이콘을 본문 열에 맞춘다. flush ghost 는 텍스트 버튼이라 누름 · 호버에 배경을 깔지 않고 글자색(neutralSubtle → fg-neutral)으로만 반응한다. 글자만 있는 ghost 와 삭제(ghost + critical)에는 쓰지 않는다 — flush 는 글자색을 neutralSubtle 로 덮는다.",
    jsx: `import { Plus } from "lucide-react"

// 목록 아래 첫 요소 — flush 가 없으면 아이콘이 여백만큼 안쪽으로 들어가 목록 글자 열과 어긋난다
<ul className="…">{rows}</ul>
<Button variant="ghost" size="small" flush="left" onClick={addRow}>
  <Plus />
  항목 추가
</Button>`,
    render: () => {
      const box =
        "padding:var(--spacing-x3) var(--spacing-x5); border:1px dashed var(--color-stroke-neutral-weak); border-radius:var(--radius-r3);";
      const row = (name, amount) =>
        `<div style="display:flex; justify-content:space-between; padding:var(--spacing-x2) 0; font-size:var(--text-t4); line-height:var(--text-t4--line-height); color:var(--color-fg-neutral);"><span>${name}</span><span>${amount}</span></div>`;
      // 비교는 맞춤 하나만 — flush 가 없는 쪽도 flush ghost 와 같은 글자색(neutralSubtle)으로 둔다
      const list = (flush) =>
        `<div style="${box}">${row("식비", "12,000원")}${row("교통비", "3,500원")}${btn({ variant: "ghost", size: "small", flush, ghostColor: flush ? "neutral" : "neutralSubtle", children: `${ICONS.plus}항목 추가` })}</div>`;
      return surface(`<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:var(--spacing-x4);">
  <div style="display:flex; flex-direction:column; gap:var(--spacing-x2);">
    <span style="${CAPTION}">flush 없음 — 아이콘이 여백만큼 들어간다</span>
    ${list(undefined)}
  </div>
  <div style="display:flex; flex-direction:column; gap:var(--spacing-x2);">
    <span style="${CAPTION}">flush="left" — 아이콘이 목록 글자 열에 맞는다</span>
    ${list("left")}
  </div>
</div>`);
    },
  },

  {
    title: "반반 바(split bar)",
    description:
      "무게가 같은 액션 둘을 한 묶음으로 — 본문 폭을 채운 네모 바를 반으로 갈라 각 칸에 ghost 버튼을 하나씩 둔다. 높이는 xsmall(32)이고 모서리는 네모(radius-r2)다 — 알약은 segmented 와 헷갈린다. 트랙은 bg-layer-basement(segmented 와 같은 톤), 칸 사이는 Divider 세로(1px stroke-neutral-subtle — 장식)를 글자 높이만큼만 긋는다. 선택이 아니라 실행이라 눌린 상태가 없고, 셋 이상으로 나누지 않는다.",
    jsx: `import { Plus, Scissors } from "lucide-react"

<SplitActions>
  <Button variant="ghost" size="xsmall" onClick={addRow}>
    <Plus />
    항목 추가
  </Button>
  <Button variant="ghost" size="xsmall" onClick={splitEvenly}>
    <Scissors />
    균등 분할
  </Button>
</SplitActions>

// SplitActions 껍데기 — 칸은 flex-1 · 모서리 없음(컨테이너가 깎는다)
<div className="flex w-full items-center overflow-hidden rounded-r2
                border border-stroke-neutral-weak bg-bg-layer-basement
                [&>button]:flex-1 [&>button]:rounded-none">
  {left}
  <Divider orientation="vertical" className="h-[var(--text-t3)]" />
  {right}
</div>`,
    render: () => {
      // 칸 사이 선 — Divider 세로(divider.tsx 의 dividerVariants({ orientation: "vertical" }) + className). 선 색은 stroke-neutral-subtle 하나다(divider.md)
      const SPLIT_DIVIDER = "shrink-0 bg-stroke-neutral-subtle w-px self-stretch h-[var(--text-t3)]";
      const bar =
        "display:flex; align-items:center; width:100%; background:var(--color-bg-layer-basement); border:1px solid var(--color-stroke-neutral-weak); border-radius:var(--radius-r2); overflow:hidden;";
      const cell = (children) => btn({ variant: "ghost", size: "xsmall", extra: "flex-1 rounded-none", children });
      return surface(`<div style="${bar}">
  ${cell(`${ICONS.plus}항목 추가`)}
  <div data-slot="divider" data-orientation="vertical" aria-hidden="true" class="${SPLIT_DIVIDER}"></div>
  ${cell(`${ICONS.scissors}균등 분할`)}
</div>`);
    },
  },
];
