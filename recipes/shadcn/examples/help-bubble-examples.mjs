/*
 * shadcn Help Bubble 예제 — docs site components/help-bubble.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(ⓘ 규정 안내 · 처음부터 열어 두는 안내)은 차례 · 제목 · 코드가
 * specs/components/help-bubble.md 의 "코드" 절과 같고, 뒤의 하나(닫기 버튼 상태)는 md 의 Properties 를 코드로 더 보인다.
 *
 * BUBBLE · BUBBLE_TITLE · BUBBLE_DESCRIPTION · ARROW_PATH · ARROW · CLOSE · ROOT_RING 은 recipes/shadcn/components/ui/help-bubble.tsx 의 상수(BubbleArrow 의
 * 경로 · 클래스)와, TEXT · WITH_CLOSE 는 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. tooltip.tsx 도 같은
 * BUBBLE · BUBBLE_TITLE · BubbleArrow 를 쓴다(tooltip-examples.mjs 의 것과 같다 — help-bubble.tsx 를 고치면 셋을 함께).
 * 트리거 BUTTON_* 는 button.tsx 의 cva 와 같다(button-examples.mjs 의 것 — 이 파일이 쓰는 변형 · 크기 · 배치와 그에 걸리는 compound 만 옮겼다).
 * 기준(홈 상단 바의 검색)은 상단 바의 아이콘 버튼이다(TopNavigationIconButton — 상자 44 · 아이콘 24, 오른쪽 끝 알림과 붙는다) —
 * TN_* 는 top-navigation.tsx 의 상수(top-navigation-examples.mjs 의 것), NB_TARGET 은 notification-badge.tsx 의 것과 같다(2026-10-09).
 * 규칙은 specs/components/help-bubble.md, 수치 원본은 specs/components/help-bubble.yaml(Tooltip 과 한 파일).
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 트리거 <button data-slot="help-bubble-trigger">(aria-haspopup="dialog" · aria-expanded · 열린 동안
 * aria-controls · data-state) 또는 기준 <button data-slot="help-bubble-anchor">(팝업 ARIA 없음 — 누르면 원래 동작), 말풍선 <div role="dialog"
 * data-slot="help-bubble-content">(aria-labelledby 제목 · aria-describedby 설명) > 글 칸 <div>(제목 <div data-slot="help-bubble-title"> · 설명
 * <div data-slot="help-bubble-description">) · 닫기 <button data-slot="help-bubble-close">(있을 때) · 화살표 자리 <span> > <svg data-slot="help-bubble-arrow">,
 * 그리고 트리거 옆의 열림 알림 자리 <span role="status" data-slot="help-bubble-status">(STATUS — 열린 동안 제목 · 설명 글).
 * Radix 가 실행 중에 붙이는 것 중 열림(data-state="open") · 자리(data-side · data-align) · id · tabindex="-1" · 화살표 자리(span 의 left · 그 변
 * 0 · 뒤집기 transform)와 폭 계산이 읽는 자리 변수(--radix-popper-available-width — 미리보기는 틀 폭에서 가장자리 16 씩을 뺀 값)를 그린다.
 * 레시피는 말풍선을 body 끝(portal)에 띄우고 Radix 가 감싼 div(position: fixed)로 트리거 위 12(sideOffset 4 + 화살표 8)에 놓는다 — 미리보기는
 * 감싼 div 를 틀 안의 position: absolute 로 흉내 낸다. 트리거 가운데에 맞춘 말풍선은 그 자리 그대로, 화면 가장자리 16 을 넘는 말풍선은 Radix 가
 * 민 자리(오른쪽 16)에 두고 화살표는 트리거 가운데에 맞췄다(collisionPadding · arrowPadding). 틀의 isolation 이 z-(--z-tooltip) 을 틀 안에 가둔다.
 * 레시피가 cn() 으로 합치는 자리는 merge() 로 똑같이 합친다. 모션 클래스(animate-in · zoom-in-90 …)는 tw-animate-css 의 것이라 사이트에서는
 * 아무 일도 하지 않는다 — 열린 순간을 멈춘 그림이다. 레시피의 스크립트(열고 닫기 · Tab 으로 들어가고 나가기 · Esc · 바깥 누르기 · 초점 되돌리기)는
 * 정적 HTML 에 없다. 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── help-bubble.tsx 의 상수와 같은 값 — 말풍선의 모양(Tooltip 과 한 벌) ─────────

// 말풍선 — 최대 280(가용 폭까지) · 위아래 10 · 좌우 12 · 모서리 12 · 짙은 바탕 · 그림자 없음 · z 210. 화살표 끝을 기준점으로 커진다
const BUBBLE = [
  "relative z-(--z-tooltip) box-border w-max max-w-[min(280px,var(--radix-popper-available-width,280px))] rounded-r3 bg-bg-neutral-inverted px-x3 py-x2_5",
  "font-sans text-fg-neutral-inverted break-keep [overflow-wrap:break-word]",
  "origin-[var(--radix-popper-transform-origin)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:[--tw-animation-duration:var(--motion-duration-d4)] data-[state=open]:ease-[var(--motion-ease-enter)] motion-safe:data-[state=open]:zoom-in-90",
  "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:[--tw-animation-duration:var(--motion-duration-d4)] data-[state=delayed-open]:ease-[var(--motion-ease-enter)] motion-safe:data-[state=delayed-open]:zoom-in-90",
  "data-[state=instant-open]:animate-in data-[state=instant-open]:fade-in-0 data-[state=instant-open]:[--tw-animation-duration:var(--motion-duration-d4)] data-[state=instant-open]:ease-[var(--motion-ease-enter)] motion-safe:data-[state=instant-open]:zoom-in-90",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:[--tw-animation-duration:var(--motion-duration-d4)] data-[state=closed]:ease-[var(--motion-ease-easing)]",
  "data-[instant]:animate-none!",
].join(" ");

// 제목 — t3 13 / 18 · 700(툴팁의 글도 이 자리), 설명 — t3 · 400. 줄바꿈 문자는 그대로
const BUBBLE_TITLE = "m-0 block whitespace-pre-line text-t3 font-bold";
const BUBBLE_DESCRIPTION = "m-0 block whitespace-pre-line text-t3 font-normal";

// 화살표 — 12 × 8, 끝 모서리 2(SEED getHelpBubbleArrowTipPath). BubbleArrow 의 경로 · 클래스
const ARROW_PATH = "M0,0 H12 L8,6 Q6,8 4,6 Z";
const ARROW = "visible block fill-bg-neutral-inverted";

// 닫기 — 38 투명 상자를 오른쪽 위 모서리로 당긴다(위 10 · 오른쪽 12) · 아이콘 14 · 글과 4 · 누르는 영역 44. 누르면 2px 축소만, 링은 말풍선 글자색
const CLOSE = [
  "relative -my-x2_5 -mr-x3 ml-x1 flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-r3 border-0 bg-transparent p-0 text-fg-neutral-inverted",
  "[&>svg]:size-3.5 [&>svg]:pointer-events-none",
  "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[--press-basis:38] [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-fg-neutral-inverted",
].join(" ");

// 말풍선 자체의 초점 링 — 닫기 버튼이 없는 말풍선에 Tab 으로 들어오면 둘레 바깥 2(모서리 12 를 따라) · 2px stroke-focus-ring(키보드 초점에만)
const ROOT_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring";

// ── help-bubble.tsx 의 JSX 에 적힌 클래스 ──────────────────────────────────

// 글 칸 — 제목 ↔ 설명 2. 닫기 버튼이 있으면 말풍선을 cn(BUBBLE, WITH_CLOSE) 로 가로로 — 글 칸과 닫기가 나란하다
const TEXT = "flex min-w-0 flex-1 flex-col gap-x0_5";
// 열림 알림 자리 — HelpBubble 이 트리거 옆에 늘 둔다(화면 밖). 열린 동안 제목 · 설명 글이 들어간다
const STATUS = "sr-only";
const WITH_CLOSE = "flex items-start";

// ── button.tsx 의 cva 와 같은 값 — ⓘ(ghost · medium · 아이콘만) ─────

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
    ghost:
      "bg-transparent text-fg-neutral hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed aria-busy:bg-bg-layer-default-pressed disabled:bg-transparent [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
  },
  size: {
    medium: "h-10 rounded-r2 [--press-basis:40] [--progress-size:16px]",
  },
  layout: { withText: "", iconOnly: "" },
  ghostColor: { neutral: "", neutralSubtle: "", brand: "", critical: "" },
  flush: { left: "", right: "" },
};

const BUTTON_COMPOUND = [
  { size: "medium", layout: "iconOnly", className: "w-10 p-x2_5 [&_svg]:size-[18px]" },
  { variant: "ghost", ghostColor: "neutralSubtle", className: "text-fg-neutral-subtle" },
];

const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// ── top-navigation.tsx 의 상수와 같은 값 — 상단 바 아이콘 버튼(44 · 24) · notification-badge.tsx 의 TARGET ──

const TN_PRESS_TRANSITION =
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const TN_FOCUS_INSIDE = "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring";
// 아이콘 버튼 — 상자 44 = 누르는 영역 · 아이콘 24, 버튼끼리 붙는다
const TN_ICON_BUTTON = [
  "relative flex size-[44px] shrink-0 cursor-pointer items-center justify-center rounded-r2 border-0 bg-transparent p-0 text-fg-neutral",
  "[&_svg]:size-6 [&_svg]:shrink-0",
  // 켜고 끄는 단추(aria-pressed) — 끔 선 2 · 켬 선 2.5, 색은 그대로 fg-neutral(19B). aria-pressed 가 없는 버튼의 선은 건드리지 않는다
  "aria-[pressed=false]:[&_svg]:[stroke-width:2] aria-pressed:[&_svg]:[stroke-width:2.5]",
  TN_PRESS_TRANSITION,
  "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/44)] motion-reduce:active:[scale:1]",
  TN_FOCUS_INSIDE,
  "disabled:cursor-not-allowed disabled:bg-transparent disabled:text-fg-disabled disabled:[scale:1]",
].join(" ");
// 아이콘 · 점 자리(NotificationBadge 의 TARGET — 점이 없어도 감싼다)
const NB_TARGET = "relative inline-flex";

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

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다. 이 파일이 합치는 클래스에 나오는 무리만 안다 — 배경 · 글자색 ·
// 임의 속성([prop:…]). 그래서 ghost · neutralSubtle 버튼의 text-fg-neutral-subtle 이 text-fg-neutral 을, ghost 의 disabled:bg-transparent 가
// 바탕의 disabled:bg-bg-disabled 를 지운다(Button 은 cn(buttonVariants(…)) 이다)
const GROUPS = [
  [/^bg-/, "bg"],
  [/^text-(fg|static)-/, "text-color"],
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

const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });
const button = (props) => merge(buttonVariants(props));

// 정적 미리보기에서 누름 · 포커스를 보이려고 — 그 상태의 클래스(active: · focus-visible:)에서 접두어만 뗀 사본을 뒤에 붙인다
// (merge 가 겹치는 기본값을 지운다). 값은 레시피 그대로라 help-bubble.tsx 가 바뀌면 같이 따라간다
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

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기는 감싼 자리의 [&>svg]:size-* · [&_svg]:size-* 가 정한다
const svg = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const ICONS = {
  info: svg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
  x: svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  search: svg('<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>'),
  bell: svg('<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>'),
};

// 미리보기 틀 — 뒤 화면 위에 말풍선. isolation 이 z-(--z-tooltip) 을 틀 안에 가둔다
const STAGE = (height, extra = "") =>
  `position:relative; isolation:isolate; overflow:hidden; width:100%; height:${height}px; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-default); font-family:var(--font-sans); ${extra}`;
const PAGE_TITLE = "font-size:var(--text-t7); line-height:var(--text-t7--line-height); font-weight:700; color:var(--color-fg-neutral);";
const LEAD =
  "display:flex; align-items:center; justify-content:center; gap:var(--spacing-x1); font-size:var(--text-t5); line-height:var(--text-t5--line-height); font-weight:500; color:var(--color-fg-neutral);";
const ROW =
  "display:flex; justify-content:space-between; gap:var(--spacing-x3); padding:var(--spacing-x3) 0; font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const CAPTION =
  "font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
// 닫기의 당김 여백(-my · -mr · ml — 말풍선 모서리로 당긴다)을 견본 칸 가운데로 — 미리보기용 덧칠
const SWATCH_PLACE = "margin:0;";

// 화살표 자리 — Radix PopperArrow 의 span. 위(top)에 뜬 말풍선은 아래 변에 붙어 translateY(100%), 아래(bottom)에 뜬 말풍선은 위 변에서 뒤집는다.
// left 는 Radix 가 잰 화살표 자리(트리거 가운데) — x 를 글로 받는다
const arrow = (side, x) => {
  const place = side === "top" ? "bottom:0px; transform:translateY(100%);" : "top:0px; transform-origin:center 0px; transform:rotate(180deg);";
  return `<span style="position:absolute; ${x} ${place}"><svg aria-hidden="true" width="12" height="8" viewBox="0 0 12 8" preserveAspectRatio="none" data-slot="help-bubble-arrow" class="${ARROW}"><path d="${ARROW_PATH}"/></svg></span>`;
};

// <HelpBubbleContent> — uid 는 Radix · useId 의 앞말(예제마다 달리한다). side · arrowX 는 Radix 가 잡은 자리, availableWidth 는 가용 폭.
// focused 는 Tab 으로 들어온 말풍선(닫기 버튼이 없을 때 — 바깥 링, 미리보기용 강제 상태)
function bubbleContent({ uid, title, description, showCloseButton = false, side = "top", arrowX, availableWidth, closeForce, focused = false }) {
  const titleId = `${uid}-title`;
  const descriptionId = `${uid}-description`;
  const content = attrs([
    `data-side="${side}"`,
    'data-align="center"',
    'data-state="open"',
    'role="dialog"',
    `id="${uid}"`,
    'tabindex="-1"',
    'data-slot="help-bubble-content"',
    `aria-labelledby="${titleId}"`,
    description != null && `aria-describedby="${descriptionId}"`,
    `class="${bubbleClass(showCloseButton, focused)}"`,
    `style="--radix-popper-available-width:${availableWidth};"`,
  ]);
  const text = `<div class="${TEXT}"><div id="${titleId}" data-slot="help-bubble-title" class="${BUBBLE_TITLE}">${esc(title)}</div>${
    description != null ? `<div id="${descriptionId}" data-slot="help-bubble-description" class="${BUBBLE_DESCRIPTION}">${esc(description)}</div>` : ""
  }</div>`;
  const close = showCloseButton ? closeButton(closeForce) : "";
  return `<div ${content}>${text}${close}${arrow(side, arrowX)}</div>`;
}

// 말풍선 클래스 — 레시피의 cn(BUBBLE, ROOT_RING, 닫기가 있으면 WITH_CLOSE). focused 면 focus-visible: 을 뗀 사본을 덧붙인다
const bubbleClass = (withClose, focused) => {
  const cls = merge([BUBBLE, ROOT_RING, withClose && WITH_CLOSE].filter(Boolean).join(" "));
  return focused ? forced(cls, "focus-visible") : cls;
};

// <span role="status"> — 열린 말풍선의 제목 · 설명(레시피는 열린 뒤 한 프레임에 넣는다)
const status = (title, description) =>
  `<span role="status" aria-live="polite" aria-atomic="true" data-slot="help-bubble-status" class="${STATUS}">${esc([title, description].filter(Boolean).join(" "))}</span>`;

// 닫기 버튼 — force = "pressed" · "focused" 는 미리보기용 강제 상태
function closeButton(force) {
  const cls = force === "pressed" ? forced(CLOSE, "active") : force === "focused" ? forced(CLOSE, "focus-visible") : CLOSE;
  return `<button type="button" aria-label="닫기" data-slot="help-bubble-close" class="${cls}">${ICONS.x}</button>`;
}

// ── 예제 ──────────────────────────────────────────────────────────────────

export const helpBubbleExamples = [
  {
    title: "ⓘ 를 눌러 여는 규정 안내",
    description:
      "화면에 늘 두기에는 길고, 몰라도 일은 할 수 있는 설명(규정 · 계산 방법 · 기능 안내)은 ⓘ 를 눌러 여는 말풍선에 둔다 — 손가락으로도 열려 폰에서도 읽어야 하는 설명은 이것이다. 트리거는 ⓘ 아이콘 버튼(Button ghost · neutralSubtle · iconOnly)이고 이름은 \"{무엇} 안내\" 다. 말풍선은 짙은 바탕(bg-neutral-inverted — 다크에서는 밝은 바탕) · 모서리 12 · 위아래 10 · 좌우 12 · 그림자 없음, 폭은 내용만큼 최대 280 이다. 제목 13/18 · 700, 설명 13/18 · 400(사이 2). 기본은 트리거 위이고 화살표(12 × 8) 끝과 트리거 사이는 4 다 — 자리가 모자라면 반대편으로 뒤집고 옆으로 밀어 화면 가장자리와 16 을 남기며, 화살표는 늘 트리거 가운데를 가리킨다 — 화면 끝의 트리거면 화살표를 가운데 · 모서리 14 에 두느라 말풍선이 16 보다 가장자리에 붙는다(레시피가 그쪽 가장자리 여백을 줄인다). 열어도 초점은 트리거에 남고 제목 · 설명은 열림 알림(role=\"status\")으로 한 번 읽힌다. ⓘ 를 다시 누르거나 바깥 · Esc 로 닫힌다(비모달).",
    jsx: `import { HelpBubble, HelpBubbleContent, HelpBubbleTrigger } from "@/components/ui/help-bubble"

<HelpBubble>
  <HelpBubbleTrigger asChild>
    <Button variant="ghost" ghostColor="neutralSubtle" layout="iconOnly" aria-label="연차 사용 규정 안내">
      <Info />
    </Button>
  </HelpBubbleTrigger>
  <HelpBubbleContent
    title="연차 사용 규정"
    description="입사 1년 미만은 한 달에 1일씩 생기고, 1년이 지나면 15일이 생겨요."
  />
</HelpBubble>`,
    render: () => {
      const uid = "help-bubble-ex-info";
      const trigger = `<button ${attrs([
        'type="button"',
        'aria-haspopup="dialog"',
        'aria-expanded="true"',
        `aria-controls="${uid}"`,
        'data-state="open"',
        'data-slot="help-bubble-trigger"',
        `class="${button({ variant: "ghost", ghostColor: "neutralSubtle", layout: "iconOnly" })}"`,
        'aria-label="연차 사용 규정 안내"',
      ])}>${ICONS.info}</button>`;
      // 트리거 가운데에 맞춘 말풍선 — 위 12(sideOffset 4 + 화살표 8). 틀이 넓어 가장자리 16 안이라 밀지 않았다
      const wrapper = `<div data-radix-popper-content-wrapper="" style="position:absolute; left:50%; bottom:calc(100% + 12px); transform:translateX(-50%); min-width:max-content; z-index:var(--z-tooltip);">${bubbleContent({
        uid,
        title: "연차 사용 규정",
        description: "입사 1년 미만은 한 달에 1일씩 생기고, 1년이 지나면 15일이 생겨요.",
        arrowX: "left:calc(50% - 6px);",
        availableWidth: "calc(100cqw - 32px)",
      })}</div>`;
      const anchor = `<span style="position:relative; display:inline-flex;">${trigger}${wrapper}</span>${status("연차 사용 규정", "입사 1년 미만은 한 달에 1일씩 생기고, 1년이 지나면 15일이 생겨요.")}`;
      return `<div style="${STAGE(260, "container-type:inline-size;")}"><div style="padding:var(--spacing-x6);"><div aria-hidden="true" style="${PAGE_TITLE}">휴가</div><div style="margin-top:var(--spacing-x6); padding-top:120px;"><div style="${LEAD}"><span>남은 연차 8.5일</span>${anchor}</div></div></div></div>`;
    },
  },

  {
    title: "처음부터 열어 두는 안내 — 닫기 버튼",
    description:
      "처음 쓰는 기능의 설명처럼 닫기 전까지 남겨 둘 안내는 처음부터 열어 두고(defaultOpen) 닫기 버튼(showCloseButton)을 두고, 바깥 누르기 · 바깥으로 간 초점에 닫히지 않게 한다(closeOnInteractOutside={false}) — 한 번 닫으면 다시 열지 않는다. 다른 버튼에 붙일 때는 HelpBubbleAnchor 로 자리만 잡는다(팝업 ARIA 를 달지 않고 누르면 그 버튼의 원래 동작이다 — 여기서는 홈 상단 바의 검색 — 누르면 거래 검색 화면). 닫기는 오른쪽 위 모서리에 붙은 38 투명 상자 · 아이콘 14(위 12 · 오른쪽 12 자리) · 글과 4 이고 누르는 영역은 44 다. 머리 오른쪽(검색 — 오른쪽 끝 알림 옆)의 버튼 아래(side=\"bottom\")라 Radix 가 말풍선을 화면 안으로 밀어 오른쪽 16 을 남겼고, 화살표는 그대로 버튼 가운데를 가리킨다.",
    jsx: `mport { Search } from "lucide-react"
import { HelpBubble, HelpBubbleAnchor, HelpBubbleContent } from "@/components/ui/help-bubble"
import { TopNavigationIconButton } from "@/components/ui/top-navigation"

{/* 처음 쓰는 사람에게 한 번 — 닫으면 다시 열지 않는다. Anchor 는 자리만 잡는다(누르면 원래 동작 — 홈 상단 바의 검색).
    closeOnInteractOutside={false} — 바깥 누르기 · 바깥으로 간 초점(Tab)에 닫히지 않는다. 닫기 버튼 · Esc · 말풍선에서 Tab 으로 나가기로 닫는다 */}
<HelpBubble defaultOpen={!seen} onOpenChange={(open) => !open && markSeen()}>
  <HelpBubbleAnchor asChild>
    <TopNavigationIconButton aria-label="검색" onClick={openSearch}><Search /></TopNavigationIconButton>
  </HelpBubbleAnchor>
  <HelpBubbleContent title="거래를 찾아보세요" description="가맹점 이름 · 메모 · 금액으로 찾을 수 있어요." showCloseButton closeOnInteractOutside={false} side="bottom" />
</HelpBubble>`,
    render: () => {
      // 기준은 홈 상단 바의 검색(TopNavigationIconButton — asChild 라 기준의 data-slot 이 버튼에 간다). 오른쪽 끝은 알림 — 버튼끼리 붙는다
      const anchor = `<button ${attrs([
        'type="button"',
        'data-slot="help-bubble-anchor"',
        `class="${TN_ICON_BUTTON}"`,
        'aria-label="검색"',
      ])}><span aria-hidden="true" data-slot="notification-badge-target" class="${NB_TARGET}">${ICONS.search}</span></button>`;
      const bell = `<button type="button" data-slot="top-navigation-icon-button" class="${TN_ICON_BUTTON}" aria-label="알림"><span aria-hidden="true" data-slot="notification-badge-target" class="${NB_TARGET}">${ICONS.bell}</span></button>`;
      // 버튼(상자 44 · 오른쪽 끝에서 24 + 알림 44) 아래 12 — 가운데에 맞추면 오른쪽 가장자리 16 을 넘어 Radix 가 민 자리(오른쪽 16).
      // 화살표는 버튼 가운데(틀 오른쪽에서 24 + 44 + 22 = 90) — 말풍선 오른쪽에서 90 − 16 = 74 라 span(폭 12)은 오른쪽 68
      const wrapper = `<div data-radix-popper-content-wrapper="" style="position:absolute; right:16px; top:calc(var(--spacing-x6) + 44px + 12px); min-width:max-content; z-index:var(--z-tooltip);">${bubbleContent({
        uid: "help-bubble-ex-close",
        title: "거래를 찾아보세요",
        description: "가맹점 이름 · 메모 · 금액으로 찾을 수 있어요.",
        showCloseButton: true,
        side: "bottom",
        arrowX: "right:68px;",
        availableWidth: "calc(100cqw - 32px)",
      })}</div>`;
      const rows = [
        ["김밥천국", "8,000원"],
        ["버스", "1,500원"],
        ["다이소", "12,300원"],
      ]
        .map(([a, b]) => `<div style="${ROW}"><span>${a}</span><span style="font-weight:700;">${b}</span></div>`)
        .join("");
      return `<div style="${STAGE(300, "container-type:inline-size; max-width:360px; margin:0 auto;")}"><div style="padding:var(--spacing-x6);"><div style="display:flex; align-items:center; justify-content:space-between; gap:var(--spacing-x3);"><div aria-hidden="true" style="${PAGE_TITLE}">홈</div><div style="display:flex;">${anchor}${bell}</div>${status("거래를 찾아보세요", "가맹점 이름 · 메모 · 금액으로 찾을 수 있어요.")}</div><div aria-hidden="true" style="margin-top:var(--spacing-x4);">${rows}</div></div>${wrapper}</div>`;
    },
  },

  {
    title: "닫기 버튼 · 말풍선 — 누름 · 포커스",
    description:
      "닫기는 이름이 \"닫기\" 인 투명 38 상자(아이콘 lucide x 14 · fg-neutral-inverted)다 — 누르는 영역은 사방 3 넓혀 44 × 44 다. 누르면 바탕 없이 2px 거리로 준다(기준 38 — 모션 줄이기면 줄지 않는다). 포커스는 키보드로 왔을 때만 상자 안쪽 2px 링이고 색은 말풍선 글자색이다 — 브랜드 링(stroke-focus-ring)은 짙은 말풍선 위에서 Desk 1.96 · HR 3.24 로 3:1 에 못 미친다. 닫기 버튼이 없는 말풍선은 열린 동안 트리거에서 Tab 을 누르면 말풍선 자체로 들어간다 — 그때는 말풍선 둘레 바깥 2 에 2px stroke-focus-ring 이 모서리를 따라 선다(페이지 위에 그려져 브랜드 링이다). 정적 미리보기라 누름 · 포커스는 active: · focus-visible: 클래스에서 접두어만 뗀 사본을 덧붙여 그렸다.",
    jsx: `// 닫기 버튼은 HelpBubbleContent 가 그린다(showCloseButton) — 누름 · 포커스는 고르는 prop 이 없다
<HelpBubbleContent title="거래를 찾아보세요" description="가맹점 이름 · 메모 · 금액으로 찾을 수 있어요." showCloseButton />

// 닫기 버튼이 없는 말풍선 — 열린 동안 트리거에서 Tab 을 누르면 말풍선으로 들어가 둘레에 링(키보드 초점에만)
<HelpBubbleContent title="연차 사용 규정" description="입사 1년 미만은 한 달에 1일씩 생기고, 1년이 지나면 15일이 생겨요." />`,
    render: () => {
      const swatch = (force, caption) =>
        `<div style="display:flex; flex-direction:column; align-items:center; gap:var(--spacing-x2);"><span style="display:inline-grid; place-items:center; width:84px; height:76px; border-radius:var(--radius-r3); background:var(--color-bg-neutral-inverted);">${closeButton(
          force,
        ).replace('class="', `style="${SWATCH_PLACE}" class="`)}</span><span style="${CAPTION}">${caption}</span></div>`;
      // Tab 으로 들어온 말풍선 — 흐름 안에 두고 화살표 자리(8)만큼 아래를 비운다(미리보기 그림)
      const focusedBubble = `<div style="display:flex; flex-direction:column; align-items:center; gap:var(--spacing-x2);"><div style="padding:var(--spacing-x2) var(--spacing-x2) calc(var(--spacing-x2) + 8px);">${bubbleContent({
        uid: "help-bubble-ex-focus",
        title: "연차 사용 규정",
        arrowX: "left:calc(50% - 6px);",
        availableWidth: "280px",
        focused: true,
      })}</div><span style="${CAPTION}">bubble focused — Tab</span></div>`;
      return `<div style="display:flex; flex-wrap:wrap; align-items:flex-start; gap:var(--spacing-x4);">${[
        [undefined, "enabled"],
        ["pressed", "pressed"],
        ["focused", "focused"],
      ]
        .map(([force, caption]) => swatch(force, caption))
        .join("")}${focusedBubble}</div>`;
    },
  },
];
