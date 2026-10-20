/*
 * shadcn Progress Circle 예제 — docs site components/progress-circle.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(섹션 새로 고침 · 화면 가운데 · 올리기)은 차례 · 제목 · 코드가
 * specs/components/progress-circle.md 의 "코드" 절과 같고(당겨서 새로 고침은 앱 코드(dart)라 옮기지 않았다), 뒤의 넷(크기 · 톤 · 값 · 모션 줄이기 ·
 * 버튼 안)은 md 의 Properties 를 코드로 더 보인다. 옛 Spinner 예제(spinner-examples.mjs — 16 · 24 · 32 · 48, 브랜드 4분의 1 호)를 대신한다.
 *
 * PC_SIZE · PC_TONE · PC_ROOT · PC_SPIN · PC_CIRCLE · PC_TRACK · PC_RANGE · PC_RANGE_INDETERMINATE · PC_RANGE_DETERMINATE · PC_KEYFRAMES 는
 * recipes/shadcn/components/ui/progress-circle.tsx 의 상수(SIZE · TONE · ROOT · SPIN · CIRCLE · TRACK · RANGE · RANGE_INDETERMINATE ·
 * RANGE_DETERMINATE · KEYFRAMES)와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 둘레의 부품은 그 레시피의 값을 옮겨 썼다 —
 * LR_* 는 skeleton.tsx(LoadingRegion — skeleton-examples.mjs), BUTTON_* 는 button.tsx(button-examples.mjs)의 것과 같다 — 이 파일이 쓰는
 * 변형 · 크기와 그에 걸리는 compound 만 옮겼다. 규칙은 specs/components/progress-circle.md, 수치 원본은 progress-circle.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — <svg role="progressbar" data-slot="progress-circle" data-size data-tone data-mode> > 트랙
 * <circle data-slot="progress-circle-track"> · 호 <circle data-slot="progress-circle-range" pathLength="100">. 상자 크기는 style 의
 * width · height(var(--pc-size))이고, 값 있는 원은 호의 style 이 stroke-dashoffset(100 − 백분율)이다(0 이면 opacity 0).
 * 값 없는 원의 회전 · 머리 · 꼬리 키프레임은 레시피가 <style href precedence>(React 19 — 문서 머리에 한 번)로 싣는다 — 정적 HTML 은 예제마다
 * 같은 <style> 을 그 자리에 한 번 둔다. 모션 줄이기의 모습은 motion-reduce: 클래스에서 접두어만 뗀 사본을 덧붙여 그렸다(merge 가 겹치는
 * 애니메이션 · 길이를 지운다). 사진 · 카드 머리 · 검색 결과 자리는 미리보기 그림이다.
 */

// ── progress-circle.tsx 의 상수와 같은 값 ─────────────────────────────────

// 크기 · 두께(progress-circle.yaml size). inherit 는 부품이 정한 값 — 없으면 글자 크기 · 2px
const PC_SIZE = {
  "24": "[--pc-size:24px] [--pc-thickness:3px]",
  "40": "[--pc-size:40px] [--pc-thickness:5px]",
  inherit: "[--pc-size:var(--progress-size,1em)] [--pc-thickness:var(--progress-thickness,2px)]",
};

// 원 · 트랙 색(progress-circle.yaml tone). 다크는 역할 색의 -dark 짝(brand 원은 밝은 짝)
const PC_TONE = {
  neutral: "[--pc-track:var(--color-stroke-neutral-subtle)] [--pc-range:var(--color-stroke-neutral-solid)]",
  brand: "[--pc-track:var(--color-bg-brand-weak-pressed)] [--pc-range:var(--color-stroke-brand-solid)]",
  staticWhite:
    "[--pc-track:color-mix(in_srgb,var(--color-static-white)_30%,transparent)] [--pc-range:var(--color-static-white)]",
  inherit:
    "[--pc-track:var(--progress-track,color-mix(in_srgb,currentColor_30%,transparent))] [--pc-range:var(--progress-range,currentColor)]",
};

// 상자 — 값 없는 원은 1.2초에 한 바퀴(모션 줄이기면 멈춘다)
const PC_ROOT = "inline-block shrink-0 overflow-visible align-middle";
const PC_SPIN = "animate-[groo-progress-circle-rotate_1200ms_cubic-bezier(0.35,0.25,0.65,0.75)_infinite] motion-reduce:animate-none";

// 원 — 상자 가운데, 선 가운데 반지름 (크기 − 두께) ÷ 2
const PC_CIRCLE =
  "fill-none [cx:calc(var(--pc-size)/2)] [cy:calc(var(--pc-size)/2)] [r:calc(var(--pc-size)/2_-_var(--pc-thickness)/2)] [stroke-width:var(--pc-thickness)]";
const PC_TRACK = `${PC_CIRCLE} [stroke:var(--pc-track)]`;
// 호 — 끝이 둥글고 12시에서 시작한다(제 중심으로 −90°)
const PC_RANGE = `${PC_CIRCLE} [stroke:var(--pc-range)] [stroke-linecap:round] [transform-box:fill-box] [transform-origin:center] [transform:rotate(-90deg)]`;
// 값 없는 원 — 머리(0 ~ 75%) · 꼬리(33.33 ~ 100%)가 1.2초 박자로. 모션 줄이기면 3/4 고정 호
const PC_RANGE_INDETERMINATE = [
  "animate-[groo-progress-circle-head_1200ms_cubic-bezier(0.35,0,0.65,1)_infinite,groo-progress-circle-tail_1200ms_cubic-bezier(0.35,0,0.65,0.6)_infinite]",
  "motion-reduce:animate-none motion-reduce:[stroke-dasharray:75_200]",
].join(" ");
// 값 있는 원 — 호 길이 100(원 전체) 을 dashoffset 으로 밀어 값만큼 보인다. 값이 바뀌면 300ms 로 따라 찬다
const PC_RANGE_DETERMINATE =
  "[stroke-dasharray:100_200] [transition:stroke-dashoffset_var(--motion-duration-d6)_var(--motion-ease-enter)] motion-reduce:transition-none";

// 회전 · 머리 · 꼬리 키프레임 — 머리 · 꼬리는 pathLength 100 기준(원둘레 = 100). 간격 200 은 원둘레보다 길어 대시가 하나만
// 보이게 한다. 시간 곡선은 CSS 처럼 키프레임 구간마다 걸린다(머리는 0 ~ 75%, 꼬리는 33.33 ~ 100% 에서만 움직인다)
const PC_KEYFRAMES = [
  "@keyframes groo-progress-circle-rotate { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }",
  "@keyframes groo-progress-circle-head { 0% { stroke-dasharray: 0 200 } 75%, 100% { stroke-dasharray: 100 200 } }",
  "@keyframes groo-progress-circle-tail { 0%, 33.33% { stroke-dashoffset: 0 } 100% { stroke-dashoffset: -100 } }",
].join("\n");

// ── skeleton.tsx 의 LoadingRegion — 원 모드 ───────────────────────────────

// 원 모드 — 영역 가운데 세로 묶음. 부모가 세로 flex 면 남는 높이를 채운다
const LR_CIRCLE_REGION = "flex grow flex-col items-center justify-center";

// ── button.tsx 의 cva 와 같은 값 — 로딩 버튼(neutralSolid · 크기 넷) ───────────

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
  },
  size: {
    xsmall: "h-8 rounded-full [--press-basis:32] [--progress-size:14px]",
    small: "h-9 rounded-r2 [--press-basis:36] [--progress-size:14px]",
    medium: "h-10 rounded-r2 [--press-basis:40] [--progress-size:16px]",
    large: "h-12 rounded-r3 [--press-basis:48] [--progress-size:18px]",
  },
  layout: { withText: "", iconOnly: "" },
  ghostColor: { neutral: "", neutralSubtle: "", brand: "", critical: "" },
  flush: { left: "", right: "" },
};

const BUTTON_COMPOUND = [
  { size: "xsmall", layout: "withText", className: "px-x3_5 py-x1_5 gap-x1 text-t3 [&_svg]:size-3.5" },
  { size: "small", layout: "withText", className: "px-x3_5 py-x2 gap-x1 text-t4 [&_svg]:size-3.5" },
  { size: "medium", layout: "withText", className: "px-x4 py-x2_5 gap-x1_5 text-t4 [&_svg]:size-4" },
  { size: "large", layout: "withText", className: "px-x5 py-x3 gap-x2 text-t6 [&_svg]:size-[22px]" },
];

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

const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });

// "motion-reduce:[stroke-dasharray:75_200]" → ["motion-reduce", "[stroke-dasharray:75_200]"] — 괄호 안의 ":" 는 가르지 않는다
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

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다 — 이 파일이 합치는 무리만 안다(애니메이션 · 임의 속성)
const GROUPS = [[/^animate-/, "animate"]];

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
const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);

// 값 없는 원의 키프레임 — 레시피는 <style href="groo-progress-circle" precedence="groo"> 로 문서 머리에 한 번 싣는다
const PC_STYLE = `<style data-href="groo-progress-circle" data-precedence="groo">${PC_KEYFRAMES}</style>`;

// <ProgressCircle> — size · tone · value(없으면 값 없는 원) · min · max · label(aria-label) · valueText · hidden(aria-hidden) · className.
// reduced 는 미리보기용 — 모션 줄이기의 모습(motion-reduce: 를 뗀 사본)
function progressCircle({ size = "40", tone = "neutral", value, min = 0, max = 100, label = "불러오는 중", valueText, hidden = false, className = "", reduced = false } = {}) {
  const determinate = typeof value === "number" && Number.isFinite(value);
  const percent = determinate && max > min ? clamp(((value - min) / (max - min)) * 100, 0, 100) : 0;
  const pick = (cls) => (reduced ? forced(cls, "motion-reduce") : cls);
  const root = pick([PC_ROOT, PC_SIZE[size], PC_TONE[tone], !determinate && PC_SPIN, className].filter(Boolean).join(" "));
  const svgAttrs = attrs([
    'role="progressbar"',
    `aria-label="${esc(label)}"`,
    determinate && `aria-valuemin="${min}"`,
    determinate && `aria-valuemax="${max}"`,
    determinate && `aria-valuenow="${clamp(value, min, max)}"`,
    determinate && `aria-valuetext="${esc(valueText ?? `${Math.round(percent)}%`)}"`,
    'data-slot="progress-circle"',
    `data-size="${size}"`,
    `data-tone="${tone}"`,
    `data-mode="${determinate ? "determinate" : "indeterminate"}"`,
    `class="${root}"`,
    'style="width:var(--pc-size); height:var(--pc-size);"',
    hidden && 'aria-hidden="true"',
  ]);
  const range = determinate
    ? `<circle data-slot="progress-circle-range" pathLength="100" class="${pick(`${PC_RANGE} ${PC_RANGE_DETERMINATE}`)}" style="stroke-dashoffset:${+(100 - percent).toFixed(2)};${percent > 0 ? "" : " opacity:0;"}"></circle>`
    : `<circle data-slot="progress-circle-range" pathLength="100" class="${pick(`${PC_RANGE} ${PC_RANGE_INDETERMINATE}`)}"></circle>`;
  return `<svg ${svgAttrs}><circle data-slot="progress-circle-track" class="${PC_TRACK}"></circle>${range}</svg>`;
}

// 견본 칸 — 흰 면(bg-layer-default) 위. dim 은 사진 위 딤(staticWhite 톤의 자리 — 미리보기 그림)
const SWATCH = (kind = "white") =>
  `display:inline-grid; place-items:center; width:72px; height:72px; border-radius:var(--radius-r3); color:var(--color-fg-neutral); ${
    kind === "dim"
      ? "background:linear-gradient(var(--overlay-dim-light), var(--overlay-dim-light)), linear-gradient(135deg, var(--color-chart-orange), var(--color-chart-violet));"
      : "background:var(--color-bg-layer-default); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle);"
  }`;
const ROW = "display:flex; flex-wrap:wrap; gap:var(--spacing-x4) var(--spacing-x3); align-items:flex-start;";
const CAPTION =
  "font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) =>
  `<div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--spacing-x2); min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;

// 화면 그림 — 흰 카드(미리보기 그림). 카드 머리 · 검색 결과는 그 레시피의 몫이라 글로만 그린다
const CARD = "display:flex; flex-direction:column; width:100%; max-width:360px; border-radius:var(--radius-r4); background:var(--color-bg-layer-default); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle); font-family:var(--font-sans);";
const CARD_HEAD = "display:flex; align-items:center; gap:8px; padding:var(--spacing-x4) var(--spacing-x6);";
const CARD_TITLE = "margin:0; font-size:var(--text-t6); line-height:var(--text-t6--line-height); font-weight:700; color:var(--color-fg-neutral);";
const ROW_TEXT = "display:flex; justify-content:space-between; padding:var(--spacing-x3) var(--spacing-x6); font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const SEARCH = "display:flex; align-items:center; gap:var(--spacing-x2); height:40px; margin:0 var(--spacing-x6); padding:0 var(--spacing-x3_5); border-radius:var(--radius-r2); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-weak); font-size:var(--text-t4); color:var(--color-fg-neutral);";
const PHOTO = "display:block; width:80px; height:80px; border-radius:var(--radius-r2); background:linear-gradient(135deg, var(--color-chart-orange), var(--color-chart-violet));";
const DIM = "position:absolute; inset:0; display:grid; place-items:center; border-radius:var(--radius-r2);";

// ── 예제 ──────────────────────────────────────────────────────────────────

const LEDGER = [
  ["김밥천국", "8,000원"],
  ["버스", "1,500원"],
  ["다이소", "12,300원"],
];

export const progressCircleExamples = [
  {
    title: "섹션 새로 고침 · 화면 가운데",
    description:
      "원이 놓인 자리가 무엇을 기다리는지 말한다. 섹션 하나를 새로 고칠 때는 섹션 제목 옆에 24(두께 3) — 보던 내용은 그대로 두고, 이름은 기다리는 일(\"최근 거래 새로 고치는 중\")이다. 구조를 미리 그릴 수 없는 자리(검색 결과 · 결과 화면 전체)는 콘텐츠 영역 가운데 40(두께 5)이다 — 틀(머리 · 검색칸 · 카드 면)은 그리고, 1초 · 5초 · 10초(1초 안에는 안 보임 · 5초 \"평소보다 오래 걸리고 있어요.\" · 10초 실패)는 LoadingRegion 의 fallback=\"circle\" 이 맡는다. 값을 모르면 호가 늘었다 줄며 1.2초에 돈다 — 원 전체가 cubic-bezier(0.35, 0.25, 0.65, 0.75) 로 한 바퀴, 머리가 0 ~ 75% 에 원둘레만큼 늘고 꼬리가 33.33 ~ 100% 에 따라와 줄인다. 원은 stroke-neutral-solid(흰 면 위 4.18:1) · 트랙 stroke-neutral-subtle 이다. 화면을 덮는 회색 막 \"Loading\" · 앱 틀 없는 가운데 원 하나는 두지 않는다.",
    jsx: `import { ProgressCircle } from "@/components/ui/progress-circle"
import { LoadingRegion, useWaitPhase } from "@/components/ui/skeleton"

{/* 섹션 제목 옆 24 — 보던 내용은 그대로, 1초 안에 끝나면 보이지 않는다(시간표) */}
const refreshPhase = useWaitPhase(isRefreshing)

<CardHeader className="flex-row items-center gap-2">
  <CardTitle>최근 거래</CardTitle>
  {refreshPhase !== "quiet" && <ProgressCircle size="24" aria-label="최근 거래 새로 고치는 중" />}
</CardHeader>

{/* 구조를 그릴 수 없는 자리 — 영역 가운데 40, 1초 · 5초 · 10초는 LoadingRegion 이 맡는다 */}
<LoadingRegion pending={results.isPending} failed={results.isError && !results.data} fallback="circle" failure={…}>
  <SearchResults items={results.data} />
</LoadingRegion>`,
    render: () => {
      const refresh = `<div style="${CARD}"><div style="${CARD_HEAD}"><h3 style="${CARD_TITLE}">최근 거래</h3>${progressCircle({ size: "24", label: "최근 거래 새로 고치는 중" })}</div><div aria-hidden="true" style="padding-bottom:var(--spacing-x2);">${LEDGER.map(([a, b]) => `<div style="${ROW_TEXT}"><span>${a}</span><b>${b}</b></div>`).join("")}</div></div>`;
      const region = `<div data-slot="loading-region" data-state="waiting" data-fallback="circle" aria-busy="true" class="${LR_CIRCLE_REGION}">${progressCircle({ size: "40" })}</div>`;
      const center = `<div style="${CARD} height:300px; padding-top:var(--spacing-x4);"><div aria-hidden="true" style="${SEARCH}">스타벅스</div>${region}</div>`;
      return `${PC_STYLE}<div style="display:flex; flex-wrap:wrap; gap:var(--spacing-x6);">${labeled(refresh, "size=\"24\" — 섹션 제목 옆 8")}${labeled(center, "fallback=\"circle\" — 영역 가운데 40")}</div>`;
    },
  },

  {
    title: "올리기 — 값 있는 원",
    description:
      "진행을 알면 값 있는 원이다 — 12시부터 (value − min) ÷ (max − min) 만큼 시계 방향으로 채우고(min · max 를 지킨다), 값이 바뀌면 300ms(motion-duration-d6 · enter)로 따라 찬다. 처음 그릴 때는 움직이지 않는다. 사진을 올리는 중이면 사진 위 딤(overlay-dim-light · 다크 overlay-dim-dark) 가운데 staticWhite(흰 원 · 흰 30% 트랙 — 딤 위 3.95:1), 파일 · 앱 업데이트면 이름 옆 neutral 24 다. 다 차면 원을 걷고 결과를 보인다. 이름 \"영수증 사진 올리는 중\" · 값 글 \"62%\"(aria-valuetext — 반올림한 정수, 영어 \"percent\" 를 쓰지 않는다). 막대(Progress)는 진행에 쓰지 않는다.",
    jsx: `<div className="relative">
  <img src={preview} alt="" className="size-20 rounded-r2 object-cover" />
  <div className="absolute inset-0 grid place-items-center rounded-r2 bg-[var(--overlay-dim-light)] dark:bg-[var(--overlay-dim-dark)]">
    <ProgressCircle size="24" tone="staticWhite" value={uploaded} max={fileSize} aria-label="영수증 사진 올리는 중" />
  </div>
</div>`,
    render: () => {
      const photo = `<div class="relative"><span aria-hidden="true" style="${PHOTO}"></span><div class="absolute inset-0 grid place-items-center rounded-r2 bg-[var(--overlay-dim-light)] dark:bg-[var(--overlay-dim-dark)]">${progressCircle({ size: "24", tone: "staticWhite", value: 1240, max: 2000, label: "영수증 사진 올리는 중" })}</div></div>`;
      const file = `<div style="display:flex; align-items:center; gap:var(--spacing-x3); width:280px; max-width:100%; font-family:var(--font-sans); font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);"><span style="flex:1; min-width:0;">10월 카드 명세서.pdf</span>${progressCircle({ size: "24", value: 35, label: "10월 카드 명세서.pdf 올리는 중" })}</div>`;
      return `<div style="${ROW} gap:var(--spacing-x6);">${labeled(photo, "staticWhite · 1,240 / 2,000 → 62%")}${labeled(file, "neutral 24 · 이름 옆 · 35%")}</div>`;
    },
  },

  {
    title: "크기 · 톤",
    description:
      "크기는 둘 — 24(두께 3 · 선 가운데 반지름 10.5 — 섹션 제목 옆 · 목록 끝 · 올리는 항목 위 · 당겨서 새로 고침)와 40(두께 5 · 17.5 — 콘텐츠 영역 가운데, 기본)이다. 16 · 32 · 48 같은 다른 크기는 두지 않는다. 톤 넷 — neutral(기본 · 원 stroke-neutral-solid · 트랙 stroke-neutral-subtle), brand(앱 첫 화면처럼 큰 전환점 하나 — 원 stroke-brand-solid(다크는 밝은 짝) · 트랙 bg-brand-weak-pressed), staticWhite(어두운 면 위 — 흰 원 · 흰 30% 트랙), inherit(놓인 부품의 --progress-range · --progress-track, 없으면 글자색과 그 30%). 크기 · 두께 · 색은 CSS 변수(--pc-size · --pc-thickness · --pc-track · --pc-range)로 정하고 원의 cx · cy · r 을 그 값으로 계산한다.",
    jsx: `<ProgressCircle size="24" />
<ProgressCircle size="40" />                       {/* 기본 — 콘텐츠 영역 가운데 */}
<ProgressCircle size="40" tone="brand" />          {/* 앱 첫 화면 */}
<ProgressCircle size="24" tone="staticWhite" />    {/* 사진 위 딤 · 짙은 채움 */}
<ProgressCircle size="24" tone="inherit" />        {/* 글자색과 그 30% */}`,
    render: () => {
      const tones = [
        ["neutral", "white"],
        ["brand", "white"],
        ["staticWhite", "dim"],
        ["inherit", "white"],
      ];
      return `${PC_STYLE}<div style="display:flex; flex-direction:column; gap:var(--spacing-x4);">${tones
        .map(
          ([tone, kind]) =>
            `<div style="${ROW}">${["24", "40"].map((size) => labeled(`<span style="${SWATCH(kind)}">${progressCircle({ size, tone })}</span>`, `${tone} · ${size}`)).join("")}</div>`,
        )
        .join("")}</div>`;
    },
  },

  {
    title: "값 — 0 · 40 · 100 · min · max",
    description:
      "값이 0 이면 호를 지운다(끝이 둥글어 점이 남지 않게 — 트랙만 보인다), 100(또는 max)이면 꽉 찬 원이다. min · max 를 지킨다 — 사진 5장 중 3장이면 value={3} max={5} 로 60% 를 채우고 값 글도 \"60%\" 다. 범위를 벗어난 값은 끝에서 멈춘다. 원의 길이는 pathLength 100 으로 재므로 호 길이가 곧 백분율이다(stroke-dashoffset = 100 − 백분율).",
    jsx: `<ProgressCircle size="40" value={0} aria-label="영수증 사진 올리는 중" />
<ProgressCircle size="40" value={40} aria-label="영수증 사진 올리는 중" />
<ProgressCircle size="40" value={100} aria-label="영수증 사진 올리는 중" />
<ProgressCircle size="40" value={3} max={5} aria-label="사진 5장 중 3장 올리는 중" />  {/* 60% */}`,
    render: () =>
      `<div style="${ROW}">${[
        [0, 0, 100, "영수증 사진 올리는 중", "0 — 호 없음"],
        [40, 0, 100, "영수증 사진 올리는 중", "40%"],
        [100, 0, 100, "영수증 사진 올리는 중", "100 — 꽉 참"],
        [3, 0, 5, "사진 5장 중 3장 올리는 중", "3 / 5 → 60%"],
      ]
        .map(([value, min, max, label, caption]) => labeled(`<span style="${SWATCH()}">${progressCircle({ size: "40", value, min, max, label })}</span>`, caption))
        .join("")}</div>`,
  },

  {
    title: "모션 줄이기 — 돌지 않는 3/4 호",
    description:
      "모션 줄이기(prefers-reduced-motion: reduce)면 돌지 않는다 — 값 없는 원은 12시부터 시계 방향 3/4 의 고정 호(stroke-dasharray 75 200)로 멈추고, 값 있는 원은 채움이 바로 바뀐다(v104). 기다리는 동안 · 결과는 영역의 상태 글과 Result Section 이 알린다. 정적 미리보기라 motion-reduce: 클래스에서 접두어만 뗀 사본을 덧붙여 그 모습을 보였다.",
    jsx: `// 모션 줄이기는 고르는 prop 이 없다 — motion-reduce: 가 회전 · 머리 · 꼬리를 멈추고 3/4 호로 둔다
<ProgressCircle size="24" />
<ProgressCircle size="40" />`,
    render: () =>
      `<div style="${ROW}">${[
        ["24", "neutral"],
        ["40", "neutral"],
        ["40", "brand"],
      ]
        .map(([size, tone]) => labeled(`<span style="${SWATCH()}">${progressCircle({ size, tone, reduced: true })}</span>`, `${size} · ${tone}`))
        .join("")}</div>`,
  },

  {
    title: "버튼 안 — size · tone inherit",
    description:
      "버튼의 로딩 원은 Button 이 정한다 — size=\"inherit\" · tone=\"inherit\" 로 버튼의 --progress-size(xsmall 14 · small 14 · medium 16 · large 18) · --progress-thickness(2) · --progress-track · --progress-range(변형마다)를 따른다. 라벨 자리 가운데에 얹고 라벨은 글자색만 투명하게 해 폭이 그대로다. 원은 장식이다(aria-hidden) — 버튼의 aria-busy 가 알리고, 누르기는 막힌다. 상자 크기는 style 로 주어 버튼의 [&_svg]:size-* 가 원을 덮지 않는다.",
    jsx: `<Button size="xsmall" loading>저장</Button>
<Button size="small" loading>저장</Button>
<Button loading>저장</Button>             {/* medium — 원 16 */}
<Button size="large" loading>저장</Button>
// button.tsx — <ProgressCircle size="inherit" tone="inherit" aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />`,
    render: () =>
      `${PC_STYLE}<div style="${ROW}">${[
        ["xsmall", "14"],
        ["small", "14"],
        ["medium", "16"],
        ["large", "18"],
      ]
        .map(([size, px]) =>
          labeled(
            `<button class="${buttonVariants({ size })}" aria-busy="true">저장${progressCircle({ size: "inherit", tone: "inherit", hidden: true, className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" })}</button>`,
            `${size} — 원 ${px}`,
          ),
        )
        .join("")}</div>`,
  },
];
