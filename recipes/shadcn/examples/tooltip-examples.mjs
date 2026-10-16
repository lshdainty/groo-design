/*
 * shadcn Tooltip 예제 — docs site components/tooltip.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(아이콘 버튼의 이름 · 막힌 버튼)은 차례 · 제목 · 코드가 specs/components/tooltip.md 의
 * "코드" 절과 같고, 뒤의 하나(이어서 옮기기)는 md 의 Properties(여는 방식)를 코드로 더 보인다.
 *
 * 말풍선의 모양 BUBBLE · BUBBLE_TITLE · ARROW_PATH · ARROW 는 tooltip.tsx 가 가져다 쓰는 recipes/shadcn/components/ui/help-bubble.tsx 의 상수
 * (BubbleArrow 의 경로 · 클래스)와, CUT 은 tooltip.tsx 의 상수와 글자 하나까지 같아야 한다 — help-bubble-examples.mjs 의 것과도 같다(help-bubble.tsx 를
 * 고치면 셋을 함께).
 * 트리거 BUTTON_* 는 button.tsx 의 cva 와 같다(button-examples.mjs 의 것 — 이 파일이 쓰는 변형 · 크기 · 배치와 그에 걸리는 compound 만 옮겼다).
 * 알림 · 설정은 Desk 웹 데스크톱 머리의 아이콘 버튼(TopNavigationIconButton — 44 · 24)이다(금액 가리기 눈은 2026-10-16 머리에서 뺐다) —
 * TN_* 는 top-navigation.tsx 의 상수(top-navigation-examples.mjs 의 것),
 * NB_TARGET 은 notification-badge.tsx 의 것과 같다(2026-10-09).
 * 규칙은 specs/components/tooltip.md, 수치 원본은 specs/components/help-bubble.yaml 의 opens: hover.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 트리거 <button data-slot="tooltip-trigger">(이름은 aria-label · 열린 동안 aria-describedby · data-state),
 * 말풍선 <div data-slot="tooltip-content">(cn(BUBBLE, BUBBLE_TITLE) — 글 하나) > 글 · 화살표 자리 <span> > <svg data-slot="tooltip-arrow"> ·
 * 보조 기술용 사본 <span role="tooltip">(Radix 가 화면 밖에 그리는 숨은 글 — 트리거의 aria-describedby 가 가리킨다. 레시피에서는 화살표도
 * 들지만 보이지 않아 글만 적었다). 하나가 열린 뒤 옆 트리거로 옮겨 연 툴팁은 data-state="instant-open" 에 data-instant(모션 없음)다.
 * Radix 가 실행 중에 붙이는 것 중 열림(data-state="delayed-open" · "instant-open") · 자리(data-side · data-align) · 화살표 자리(span 의 left ·
 * 아래 변 0 · translateY(100%))와 폭 계산이 읽는 자리 변수(--radix-popper-available-width)를 그린다. 레시피는 말풍선을 body 끝(portal)에 띄우고
 * Radix 가 감싼 div(position: fixed)로 트리거 위 12(sideOffset 4 + 화살표 8)에 놓는다 — 미리보기는 감싼 div 를 틀 안의 position: absolute 로
 * 흉내 내 트리거 가운데에 맞췄다. 틀의 isolation 이 z-(--z-tooltip) 을 틀 안에 가둔다. 레시피가 cn() 으로 합치는 자리는 merge() 로 똑같이 합친다.
 * 모션 클래스(animate-in · zoom-in-90 …)는 tw-animate-css 의 것이라 사이트에서는 아무 일도 하지 않는다 — 열린 순간을 멈춘 그림이다.
 * 레시피의 스크립트(200ms 뒤 열기 · 100ms 뒤 닫기 · 이어 열기 · 키보드 초점에만 열기 · Esc)는 정적 HTML 에 없다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── help-bubble.tsx 의 상수와 같은 값 — 말풍선의 모양(Help Bubble 과 한 벌) ─────

// 말풍선 — 최대 280(가용 폭까지) · 위아래 10 · 좌우 12 · 모서리 12 · 짙은 바탕 · 그림자 없음 · z 210. 화살표 끝을 기준점으로 커진다.
// 툴팁의 열림 상태 이름은 delayed-open · instant-open 이다. data-instant(이어서 열림 · 바로 닫음)면 모션이 없다
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

// 글 — Help Bubble 의 제목 자리(t3 13 / 18 · 700). 레시피는 cn(BUBBLE, BUBBLE_TITLE, CUT, className)
const BUBBLE_TITLE = "m-0 block whitespace-pre-line text-t3 font-bold";

// ── tooltip.tsx 의 상수와 같은 값 ─────────────────────────────────────────

// 걷힌 툴팁 — 흐려지며 닫히던 중에 다른 툴팁이 열리면 남은 사라짐을 보이지 않게 둔다(data-cut — 한 번에 하나만 보인다)
const CUT = "data-[cut]:invisible";

// 화살표 — 12 × 8, 끝 모서리 2(SEED getHelpBubbleArrowTipPath). BubbleArrow 의 경로 · 클래스
const ARROW_PATH = "M0,0 H12 L8,6 Q6,8 4,6 Z";
const ARROW = "visible block fill-bg-neutral-inverted";

// ── button.tsx 의 cva 와 같은 값 — 막힌 버튼(neutralWeak · medium · 글) ──

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
  size: {
    medium: "h-10 rounded-r2 [--press-basis:40] [--progress-size:16px]",
  },
  layout: { withText: "" },
  ghostColor: { neutral: "", neutralSubtle: "", brand: "", critical: "" },
  flush: { left: "", right: "" },
};

const BUTTON_COMPOUND = [
  { size: "medium", layout: "withText", className: "px-x4 py-x2_5 gap-x1_5 text-t4 [&_svg]:size-4" },
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

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다. 이 파일이 합치는 클래스에 나오는 무리만 안다 — 배경 · 임의 속성([prop:…]).
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

const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });
const button = (props) => merge(buttonVariants(props));

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기는 감싼 자리의 [&_svg]:size-* 가 정한다
const svg = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const ICONS = {
  eye: svg('<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>'),
  bell: svg('<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>'),
  settings: svg('<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>'),
};

// 미리보기 틀 — 트리거 위에 툴팁. isolation 이 z-(--z-tooltip) 을 틀 안에 가두고, container-type 이 가용 폭(100cqw)을 틀 폭으로 잰다
const STAGE =
  "position:relative; isolation:isolate; container-type:inline-size; display:flex; align-items:flex-end; justify-content:center; width:100%; height:140px; padding-bottom:var(--spacing-x6); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-default); font-family:var(--font-sans); box-sizing:border-box;";
// Radix 의 숨은 글(VisuallyHidden) — 보조 기술만 읽는다
const VISUALLY_HIDDEN =
  "position:absolute; border:0px; width:1px; height:1px; padding:0px; margin:-1px; overflow:hidden; clip:rect(0px, 0px, 0px, 0px); white-space:nowrap; overflow-wrap:normal;";
// 사이트의 `.content p { margin: 12px 0; color: text-primary }` 를 덮는 미리보기용 덧칠 — 막힌 이유 글의 바깥 여백 0 · 글자색
const P_FIX = "margin:0; color:var(--color-fg-neutral-subtle);";

// <TooltipContent> + 감싼 div — 트리거 가운데 위 12. instant 면 이어서 연 툴팁(instant-open · data-instant)
function tooltipContent({ uid, text, instant = false }) {
  const content = attrs([
    'data-side="top"',
    'data-align="center"',
    `data-state="${instant ? "instant-open" : "delayed-open"}"`,
    'data-slot="tooltip-content"',
    instant && 'data-instant=""',
    `class="${BUBBLE} ${BUBBLE_TITLE} ${CUT}"`,
    'style="--radix-popper-available-width:calc(100cqw - 32px);"',
  ]);
  const arrow = `<span style="position:absolute; left:calc(50% - 6px); bottom:0px; transform:translateY(100%);"><svg aria-hidden="true" width="12" height="8" viewBox="0 0 12 8" preserveAspectRatio="none" data-slot="tooltip-arrow" class="${ARROW}"><path d="${ARROW_PATH}"/></svg></span>`;
  return `<div data-radix-popper-content-wrapper="" style="position:absolute; left:50%; bottom:calc(100% + 12px); transform:translateX(-50%); min-width:max-content; z-index:var(--z-tooltip);"><div ${content}>${esc(text)}${arrow}<span id="${uid}" role="tooltip" style="${VISUALLY_HIDDEN}">${esc(text)}</span></div></div>`;
}

// <TooltipTrigger asChild><TopNavigationIconButton aria-label> — 상자 44 · 아이콘 24(아이콘은 NotificationBadge 의 자리에 든다).
// open 이면 aria-describedby 로 툴팁을 잇는다. pressed 가 있으면 켜고 끄는 단추(aria-pressed)
function iconButton({ uid, icon, name, open = false, instant = false, pressed }) {
  const trigger = `<button ${attrs([
    'type="button"',
    'data-slot="tooltip-trigger"',
    `class="${TN_ICON_BUTTON}"`,
    `aria-label="${esc(name)}"`,
    pressed != null && `aria-pressed="${pressed ? "true" : "false"}"`,
    open && `aria-describedby="${uid}"`,
    `data-state="${open ? (instant ? "instant-open" : "delayed-open") : "closed"}"`,
  ])}><span aria-hidden="true" data-slot="notification-badge-target" class="${NB_TARGET}">${icon}</span></button>`;
  return `<span style="position:relative; display:inline-flex;">${trigger}${open ? tooltipContent({ uid, text: name, instant }) : ""}</span>`;
}

// ── 예제 ──────────────────────────────────────────────────────────────────

export const tooltipExamples = [
  {
    title: "아이콘 버튼의 이름",
    description:
      "툴팁은 마우스를 올리거나 키보드 초점이 오면 트리거 옆에 뜨는 짧은 설명 — 보조다. 아이콘 버튼의 이름은 늘 aria-label 에 두고, 툴팁은 그 이름을 마우스 · 키보드 사용자에게 보여 줄 뿐 대신하지 않는다(같은 글). 모양은 Help Bubble 과 한 벌이다 — 짙은 바탕(다크에서는 밝은 바탕) · 모서리 12 · 위아래 10 · 좌우 12 · 글 13/18 · 700, 화살표 12 × 8 · 트리거 위 4(몸통과는 12). 마우스를 올리면 200ms 뒤에 열고, 트리거와 말풍선을 모두 벗어나면 100ms 뒤에 닫는다 — 말풍선 위로 옮겨도 닫히지 않는다(WCAG 1.4.13). 키보드 초점이면 바로 열고, 손가락으로 누르면 열지 않는다. 네이티브 title 은 쓰지 않는다.",
    jsx: `mport { Settings } from "lucide-react"
import { TopNavigationIconButton } from "@/components/ui/top-navigation"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

{/* Desk 웹 데스크톱 머리의 아이콘 버튼(알림 · 설정) */}
<Tooltip>
  <TooltipTrigger asChild>
    {/* 이름은 aria-label — 툴팁은 그 이름을 마우스 · 키보드 사용자에게 보여 준다 */}
    <TopNavigationIconButton aria-label="설정" onClick={openSettings}><Settings /></TopNavigationIconButton>
  </TooltipTrigger>
  <TooltipContent>설정</TooltipContent>
</Tooltip>`,
    // 데스크톱 머리의 설정 — 이름(aria-label)과 같은 글의 툴팁
    render: () => `<div style="${STAGE}">${iconButton({ uid: "tooltip-ex-icon", icon: ICONS.settings, name: "설정", open: true })}</div>`,
  },

  {
    title: "막힌 버튼 — 이유는 툴팁이 아니라 가까운 글",
    description:
      "막힌 버튼은 초점을 받지 못해 키보드로 툴팁을 열 수 없고, 손가락으로는 툴팁이 아예 열리지 않는다. 그래서 왜 안 되는지는 툴팁에 두지 않고 버튼 가까이 글로 보인다 — 버튼의 aria-describedby 가 그 글을 잇는다. 이름 · 막힌 이유 · 꼭 알아야 하는 정보를 툴팁에만 두지 않는다. 폰에서도 읽어야 하는 설명은 ⓘ 를 눌러 여는 Help Bubble 이다.",
    jsx: `<div className="flex flex-col gap-1.5">
  <Button variant="neutralWeak" disabled={!hasLastMonth} aria-describedby="copy-reason">
    지난달 예산 복사
  </Button>
  {!hasLastMonth && (
    <p id="copy-reason" className="text-t3 text-fg-neutral-subtle">복사할 지난달 예산이 없어요.</p>
  )}
</div>`,
    render: () =>
      `<div class="flex flex-col gap-1.5"><button class="${button({ variant: "neutralWeak" })}" disabled aria-describedby="tooltip-ex-copy-reason">지난달 예산 복사</button><p id="tooltip-ex-copy-reason" class="text-t3 text-fg-neutral-subtle" style="${P_FIX}">복사할 지난달 예산이 없어요.</p></div>`,
  },

  {
    title: "이어서 옮기기 — TooltipProvider",
    description:
      "화면에 TooltipProvider 를 한 번 두면, 하나가 열려 있거나 닫힌 지 300ms 안에 옆 트리거로 옮긴 툴팁은 기다리지 않고 모션 없이 바로 연다(data-instant) — 앞의 툴팁은 그때 바로 닫히고 한 번에 하나만 열린다. 그림은 데스크톱 머리의 알림에서 옆으로 옮겨 설정의 툴팁이 바로 열린 순간이다. 지연 값(200 · 100 · 300ms)은 고정이라 바꾸지 않는다. 글자가 이미 보이는 버튼에는 같은 말의 툴팁을 두지 않는다.",
    jsx: `import { Bell, Settings } from "lucide-react"
import { TopNavigationIconButton } from "@/components/ui/top-navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

{/* 화면에 한 번 — 옆 트리거로 옮기면 기다리지 않는다. Desk 웹 데스크톱 머리의 아이콘 버튼(알림 · 설정) */}
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <TopNavigationIconButton aria-label="알림"><Bell /></TopNavigationIconButton>
    </TooltipTrigger>
    <TooltipContent>알림</TooltipContent>
  </Tooltip>
  <Tooltip>
    <TooltipTrigger asChild>
      <TopNavigationIconButton aria-label="설정"><Settings /></TopNavigationIconButton>
    </TooltipTrigger>
    <TooltipContent>설정</TooltipContent>
  </Tooltip>
</TooltipProvider>`,
    // 상단 바 아이콘 버튼은 서로 붙는다(사이 0) — 알림에서 옆으로 옮겨 설정의 툴팁이 바로 열린 순간
    render: () =>
      `<div style="${STAGE}"><div style="display:flex;">${[
        iconButton({ uid: "tooltip-ex-chain-bell", icon: ICONS.bell, name: "알림" }),
        iconButton({ uid: "tooltip-ex-chain-settings", icon: ICONS.settings, name: "설정", open: true, instant: true }),
      ].join("")}</div></div>`,
  },
];
