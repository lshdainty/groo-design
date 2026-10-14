/*
 * shadcn Side Panel 예제 — docs site components/side-panel.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(주 메뉴 서랍 — HR 폰 · 오른쪽 패널 — 1280 이상)은 차례 · 제목 · 코드가
 * specs/components/side-panel.md 의 "코드" 절과 같고, 뒤의 하나(조회 패널 — 설명 · 닫기 버튼)는 md 의 Properties 를 코드로 더 보인다.
 * 옛 Sheet(shadcn — 네 방향 · 75% · 384 · 그림자 · 선)를 대신한다 — 아래에서 올라오는 것은 Bottom Sheet 다.
 *
 * OVERLAY · CONTENT · SIDE · SIZE · HEADER · CLOSE · CLOSE_SIDE · BODY · BODY_SIDE · BODY_PLAIN · BODY_FOG 는
 * recipes/shadcn/components/ui/side-panel.tsx 의 상수와, TITLE · DESCRIPTION · FOOTER · HEADER_CLOSE 는 그 파일의 JSX 에 적힌 클래스와
 * 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 서랍 안의 SN_* · tone() 은 side-navigation.tsx(side-navigation-examples.mjs)의 것,
 * 바닥 버튼 BUTTON_* 는 button.tsx 의 cva 와 같다 — 이 파일이 쓰는 변형 · 크기(neutralWeak · neutralSolid · small)와 그에 걸리는 compound 만 옮겼다.
 * 끝 흐림은 scroll-fog.tsx 의 useScrollFog(overlayBody — 위 20 · 아래 80)와 같은 셈이다 — 레시피는 그릴 때 토큰 --gradient-fade-mask 를 읽어
 * 본문의 style(mask-*)로 넣고, 정적 HTML 은 같은 일을 빌드 때 DESIGN.md 의 토큰 값으로 했다.
 * 규칙은 specs/components/side-panel.md, 수치 원본은 specs/components/side-panel.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 딤 <div data-slot="side-panel-overlay"> · 패널 <div role="dialog" aria-modal="true" data-slot="side-panel-content"
 * data-side (data-size · data-form)> > 머리 <div data-slot="side-panel-header">(제목 <h2> · 설명 <p>) · 닫기 <button data-slot="side-panel-close"> ·
 * 본문 <div data-slot="side-panel-body"> · 바닥 <div data-slot="side-panel-footer">. 서랍의 본문에는 Side Navigation 의 내용이 스스로
 * <nav aria-label="주 메뉴"> 로 들어간다. 레시피가 cn() 으로 합치는 서랍 본문의 px-x4(BODY_SIDE.left 와 className 이 같다)는 하나만 남기고,
 * 항목 클래스는 merge() 로 똑같이 합친다 — 같은 속성을 다시 쓴 클래스는 뒤의 것만 남는다. 설명 <p> 의 style 은 사이트의 `.content p` 를 누르는 덧칠이다.
 * 미리보기의 링크 주소는 # 이다 — 눌러도 문서를 떠나지 않게(레시피는 href 그대로 — "/vacation/history").
 * 레시피는 딤 · 패널을 화면(fixed · 높이 h-dvh)에 띄운다 — 미리보기 틀(STAGE)에 transform 을 줘 fixed 의 기준을 틀로 바꾸고, 패널의 높이를
 * style 로 틀 높이(100%)에 맞췄다(미리보기용 덧칠). 틀에는 안전 영역이 없다. 열고 닫는 미끄러짐(data-state 애니메이션)은 미리보기에 없다.
 * 레시피의 스크립트(열고 닫기 · Esc · 딤 누르기 · 손가락 끌기 · 묻기 · 초점 가두기 · 뒤로 가기 · 본문 스크롤의 머리 아래 선)는 정적 HTML 에 없다.
 * 뒤 화면 · 폼 칸 · 혜택 줄은 미리보기 그림(레시피가 아니다)이다. 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

import { readFileSync } from "node:fs";

// ── side-panel.tsx 의 상수와 같은 값 ─────────────────────────────────────

// 딤 — 300ms enter 로 나타나고 300ms exit 로 사라진다(모션 줄이기면 150ms)
const OVERLAY = [
  "fixed inset-0 z-(--z-modal) bg-[var(--overlay-dim-light)] dark:bg-[var(--overlay-dim-dark)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:[--tw-animation-duration:var(--motion-duration-d6)] data-[state=open]:ease-[var(--motion-ease-enter)]",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:[--tw-animation-duration:var(--motion-duration-d6)] data-[state=closed]:ease-[var(--motion-ease-exit)]",
  "motion-reduce:data-[state]:[--tw-animation-duration:var(--motion-duration-d3)]",
].join(" ");

// 패널 — 높이 전체, 모서리 · 그림자 · 선 없음, 아래 안전 영역. 가로 손가락 끌기를 받도록 세로 스크롤 · 확대만 브라우저에 맡긴다
const CONTENT = [
  "fixed inset-y-0 z-(--z-modal-content) flex h-dvh max-h-dvh flex-col bg-bg-layer-floating pb-[env(safe-area-inset-bottom)] font-sans text-fg-neutral outline-none",
  "[touch-action:pan-y_pinch-zoom]",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=open]:[--tw-animation-duration:var(--motion-duration-d6)] data-[state=open]:ease-[var(--motion-ease-enter-expressive)]",
  "data-[state=closed]:[--tw-animation-duration:var(--motion-duration-d6)] data-[state=closed]:ease-[var(--motion-ease-exit-expressive)]",
  "motion-reduce:data-[state=open]:fade-in-0 motion-reduce:data-[state=closed]:fade-out-0 motion-reduce:data-[state]:[--tw-animation-duration:var(--motion-duration-d3)] motion-reduce:data-[state]:ease-[var(--motion-ease-enter)]",
].join(" ");

// 붙은 쪽 — 폭에 그쪽 안전 영역을 더하고 그만큼 안쪽 여백을 둔다. 왼쪽은 화면 폭의 80%
const SIDE = {
  left: [
    "left-0 w-[calc(80%+env(safe-area-inset-left))] pl-[env(safe-area-inset-left)]",
    "motion-safe:data-[state=open]:slide-in-from-left motion-safe:data-[state=closed]:slide-out-to-left",
  ].join(" "),
  right: [
    "right-0 max-w-[calc(80%+env(safe-area-inset-right))] pr-[env(safe-area-inset-right)] max-md:w-[calc(80%+env(safe-area-inset-right))]",
    "motion-safe:data-[state=open]:slide-in-from-right motion-safe:data-[state=closed]:slide-out-to-right",
  ].join(" "),
};

// 오른쪽 패널의 폭 — 1280 이상의 보조 작업. 화면의 80% 를 넘지 않는다
const SIZE = {
  small: "w-[calc(480px+env(safe-area-inset-right))]",
  medium: "w-[calc(720px+env(safe-area-inset-right))]",
  large: "w-[calc(960px+env(safe-area-inset-right))]",
};

// 머리 — 위 24(+ 위 안전 영역) · 좌우 24 · 아래 16 · 최소 70 · 사이 6. 본문이 위로 스크롤되면 안쪽 아래 1px stroke-neutral-subtle(150ms)
const HEADER = [
  "flex min-h-[calc(70px+env(safe-area-inset-top))] shrink-0 flex-col gap-x1_5 px-x6 pb-x4 pt-[calc(var(--spacing-x6)+env(safe-area-inset-top))]",
  "[transition:box-shadow_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[&:has(~[data-slot=side-panel-body][data-scrolled])]:shadow-[inset_0_-1px_0_0_var(--color-stroke-neutral-subtle)]",
].join(" ");

// 닫기 — 52 투명 상자 · 아이콘 22 fg-neutral-subtle. 아이콘이 위 28 · 오른쪽 24 에 오도록 상자를 15 만큼 당긴다. 누르면 bg-layer-floating-pressed + 2px 거리 축소
const CLOSE = [
  "absolute top-[calc(var(--spacing-x7)-15px+env(safe-area-inset-top))] flex size-13 cursor-pointer items-center justify-center",
  "rounded-r3 border-0 bg-transparent p-0 text-fg-neutral-subtle [&>svg]:size-[22px]",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "hover:bg-bg-layer-floating-pressed active:bg-bg-layer-floating-pressed active:[scale:calc(1-2/52)] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
const CLOSE_SIDE = {
  left: "right-[calc(var(--spacing-x6)-15px)]",
  right: "right-[calc(var(--spacing-x6)-15px+env(safe-area-inset-right))]",
};

// 본문 — 좌우 24(왼쪽 패널 16), 이 안에서만 스크롤. 맨 끝 자식(바닥이 없으면)이면 아래 24
const BODY = [
  "min-h-0 flex-1 overflow-y-auto overscroll-contain [touch-action:pan-y_pinch-zoom]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
const BODY_SIDE = { left: "px-x4", right: "px-x6" };
const BODY_PLAIN = "last:pb-x6";
// 끝 흐림(scrollFog) — 본문 안 여백 위 20 · 아래 80(바닥이 있어도), 스크롤 여유도 위 20 · 아래 80
const BODY_FOG = "pt-[20px] pb-[80px] scroll-pt-[20px] scroll-pb-[80px]";

// ── side-panel.tsx 의 JSX 에 적힌 클래스 ───────────────────────────────────

// 제목 <h2> — t8 22 / 30 · 700 · 설명 <p> — t5 · fg-neutral-muted
const TITLE = "m-0 text-t8 font-bold text-fg-neutral";
const DESCRIPTION = "m-0 text-t5 font-normal text-fg-neutral-muted";
// 바닥 — 위 16 · 좌우 24 · 아래 24, 오른쪽 정렬, 사이 8
const FOOTER = "flex shrink-0 items-center justify-end gap-x2 px-x6 pb-x6 pt-x4";
// 닫기 버튼이 있으면 머리 오른쪽 52 를 비운다
const HEADER_CLOSE = "pr-x13";

// 사이트의 `.content p { margin: 12px 0; color: text-primary }` 는 층(@layer) 밖 규칙이라 Tailwind utility 를 늘 이긴다 — 설명 <p> 에는
// 클래스가 정한 바깥 여백 · 글자색을 style 로 한 번 더 적는다(레시피에는 없는 미리보기용 덧칠)
const P_FIX = "margin:0; color:var(--color-fg-neutral-muted);";

// ── side-navigation.tsx 의 상수 · JSX 클래스와 같은 값 — 서랍 안의 주 메뉴(펼친 모양) ──

// 서랍(Side Panel)에서는 SideNavigationContent 가 스스로 <nav aria-label="주 메뉴"> 가 된다 — 스크롤 · 흐림은 본문이 맡는다
const SN_STANDALONE = "flex flex-col gap-x2 font-sans";
const SN_GROUP = "flex flex-col";
const SN_GROUP_LABEL = "p-x1_5 text-t4 font-bold text-fg-neutral-muted break-keep [overflow-wrap:break-word]";
const SN_LIST = "m-0 flex list-none flex-col p-0";
const SN_ITEM = [
  "group/side-navigation-item relative flex min-h-11 w-full items-center rounded-r2_5 border-0 bg-transparent px-x2 text-left font-sans no-underline",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),padding_var(--motion-duration-d4)_var(--motion-ease-easing)]",
  "motion-reduce:[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
const SN_ITEM_HOVER = "cursor-pointer hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed";
const SN_ITEM_CURRENT = "cursor-pointer bg-bg-neutral-weak-pressed";
const SN_ITEM_CONTENT = "relative flex min-w-0 flex-1 items-center gap-x3 [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const SN_ITEM_CONTENT_PRESS = "group-active/side-navigation-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/side-navigation-item:[scale:1]";
const SN_ITEM_ICON = "flex shrink-0 [&>svg]:size-5";
const SN_ITEM_LABEL = "min-w-0 flex-1 py-x1_5 text-t4 font-medium break-keep [overflow-wrap:break-word]";
const SN_CHEVRON = "size-4 shrink-0 text-fg-neutral-subtle [transition:rotate_var(--motion-duration-d6)_var(--motion-ease-easing)] motion-reduce:transition-none";
const SN_SUB_LIST = "grid";
const SN_SUB_LIST_OPEN = [
  "visible grid-rows-[1fr] opacity-100",
  "[transition:grid-template-rows_var(--motion-duration-d6)_var(--motion-ease-easing),opacity_var(--motion-duration-d6)_var(--motion-ease-easing),visibility_0s]",
  "motion-reduce:[transition:opacity_var(--motion-duration-d3)_var(--motion-ease-easing),visibility_0s]",
].join(" ");
const SN_SUB_LIST_CLOSED = [
  "invisible grid-rows-[0fr] opacity-0",
  "[transition:grid-template-rows_var(--motion-duration-d6)_var(--motion-ease-easing),opacity_var(--motion-duration-d6)_var(--motion-ease-easing),visibility_0s_linear_var(--motion-duration-d6)]",
  "motion-reduce:[transition:grid-template-rows_0s_linear_var(--motion-duration-d3),opacity_var(--motion-duration-d3)_var(--motion-ease-easing),visibility_0s_linear_var(--motion-duration-d3)]",
].join(" ");
const SN_SUB_UL = "m-0 flex min-h-0 list-none flex-col overflow-hidden p-0";
const SN_LEAF_LI = "flex";
const SN_PARENT_LI = "flex flex-col";
const SN_SUB_ITEM = "pl-[40px] pr-x2";

// 아이콘 · 이름의 색 — 막힘 fg-disabled · 지금 fg-neutral · 다른 항목 아이콘 fg-neutral-subtle + 이름 fg-neutral-muted
function tone(current, disabled) {
  return disabled
    ? { icon: "text-fg-disabled", label: "text-fg-disabled" }
    : current
      ? { icon: "text-fg-neutral", label: "text-fg-neutral" }
      : { icon: "text-fg-neutral-subtle", label: "text-fg-neutral-muted" };
}

// ── button.tsx 의 cva 와 같은 값 — 바닥 버튼(neutralWeak · neutralSolid · small · 글) ──

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
    neutralWeak:
      "bg-bg-neutral-weak text-fg-neutral hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed aria-busy:bg-bg-neutral-weak-pressed [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
  },
  size: {
    small: "h-9 rounded-r2 [--press-basis:36] [--progress-size:14px]",
  },
  layout: { withText: "" },
  ghostColor: { neutral: "" },
};
const BUTTON_COMPOUND = [{ size: "small", layout: "withText", className: "px-x3_5 py-x2 gap-x1 text-t4 [&_svg]:size-3.5" }];
const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다
function cvaOf(base, { variants = {}, compoundVariants = [], defaultVariants = {} } = {}) {
  return (props = {}) => {
    const p = { ...defaultVariants };
    for (const [k, v] of Object.entries(props)) if (v !== undefined) p[k] = v;
    const parts = [base];
    for (const [axis, map] of Object.entries(variants)) parts.push(map[p[axis]]);
    for (const { class: cls, className, ...when } of compoundVariants) {
      if (Object.entries(when).every(([k, v]) => p[k] === v)) parts.push(cls, className);
    }
    return parts.filter(Boolean).join(" ");
  };
}
const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });

// ── 끝 흐림 — scroll-fog.tsx 의 useScrollFog 와 같은 셈(overlayBody · 세로) ─────────

// 토큰 값 — 레시피는 그릴 때 getComputedStyle 로 읽는다. 정적 HTML 은 DESIGN.md 의 v104 표에서 읽는다
const FADE_MASK = /`gradient-fade-mask` \| `(linear-gradient\([^`]+\))`/.exec(readFileSync(new URL("../../../DESIGN.md", import.meta.url), "utf8"))[1];
const SOLID = "linear-gradient(#000, #000)";
const withDirection = (token, direction) => token.replace(/^linear-gradient\(/, `linear-gradient(${direction}, `);
// 겹친 층을 곱한다 — scroll-fog.tsx 의 COMPOSITE 와 같은 값(-webkit- 쪽은 옛 이름 source-in)
const COMPOSITE = { "mask-composite": "intersect", "-webkit-mask-composite": "source-in" };
// 위 20 · 아래 80 — 흐린 쪽마다 본문 전체 크기의 층 하나(단계는 그 쪽 깊이의 몫 — 깊이 안에서 불투명에 닿는다), 두 층을 곱한다.
// 본문의 style 에 mask-* 와 -webkit-mask-* 를 같이 넣는다
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

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다 — 이 파일이 합치는 클래스에 나오는 무리(배경)만 안다.
// 지금 항목의 bg-bg-neutral-weak-pressed 가 SN_ITEM 의 bg-transparent 를 지운다
// (둘 다 남기면 Tailwind 는 같은 속성의 클래스를 이름 차례로 늘어놓아 bg-transparent 가 이긴다). 변형이 붙은 클래스는 같은 변형끼리만 겹친다
const GROUPS = [[/^bg-/, "bg"]];
// "group-active/side-navigation-item:[scale:1]" → ["group-active/side-navigation-item", "[scale:1]"] — 괄호 안의 ":" 는 가르지 않는다
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
function merge(classList) {
  const seen = new Set();
  const kept = [];
  for (const cls of classList.split(/\s+/).filter(Boolean).reverse()) {
    const segs = splitVariants(cls);
    const utility = segs.pop();
    const group = GROUPS.find(([re]) => re.test(utility))?.[1];
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

// lucide-react 와 같은 모양(24 격자) — 크기는 놓인 자리가 정한다(항목 20 · 꺾쇠 16 · 닫기 22)
const svg = (paths, extra = "") =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${paths}</svg>`;
const PATHS = {
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  layoutGrid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  calendarDays: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
  megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
};

// HR 주 메뉴 — 사이드바와 같은 묶음 · 항목(지금 화면 "휴가 현황" — 휴가 묶음이 펼쳐진 채)
const HR_GROUPS = [
  { label: "근무", items: [
    { icon: "layoutGrid", label: "홈" },
    { icon: "calendarDays", label: "캘린더" },
    { icon: "megaphone", label: "공지사항" },
    { icon: "plane", label: "휴가", sub: [{ label: "휴가 현황" }, { label: "휴가 신청" }] },
    { icon: "briefcase", label: "업무" },
    { icon: "heart", label: "조직문화" },
  ] },
  { label: "관리", items: [
    { icon: "users", label: "사용자" },
    { icon: "shield", label: "권한" },
  ] },
];

// <SideNavigationContent>(서랍 — 펼친 모양) > <SideNavigationGroup> > <SideNavigationItem> · <SideNavigationSubItem>
function drawerNavigation({ uid, groups, current }) {
  const body = groups
    .map((g, gi) => {
      const labelId = `${uid}g${gi}`;
      const lis = g.items
        .map((it, ii) => {
          if (!it.sub) {
            const isCurrent = it.label === current;
            const c = tone(isCurrent, false);
            return `<li class="${SN_LEAF_LI}"><a href="#"${isCurrent ? ' aria-current="page"' : ""} data-slot="side-navigation-item"${isCurrent ? ' data-current="true"' : ""} class="${merge(`${SN_ITEM} ${isCurrent ? SN_ITEM_CURRENT : SN_ITEM_HOVER}`)}"><span data-slot="side-navigation-item-content" class="${SN_ITEM_CONTENT} ${SN_ITEM_CONTENT_PRESS}"><span aria-hidden="true" data-slot="side-navigation-item-icon" class="${SN_ITEM_ICON} ${c.icon}">${svg(PATHS[it.icon])}</span><span data-slot="side-navigation-item-label" class="${SN_ITEM_LABEL} ${c.label}">${esc(it.label)}</span></span></a></li>`;
          }
          // 부모 — 하위가 지금이면 저절로 펼친다(꺾쇠 위로)
          const open = it.sub.some((s) => s.label === current);
          const c = tone(false, false);
          const buttonId = `${uid}i${gi}${ii}button`;
          const listId = `${uid}i${gi}${ii}list`;
          const subs = it.sub
            .map((s) => {
              const sc = s.label === current;
              return `<li class="${SN_LEAF_LI}"><a href="#"${sc ? ' aria-current="page" data-current="true"' : ""} data-slot="side-navigation-sub-item" class="${merge(`${SN_ITEM} ${SN_SUB_ITEM} ${sc ? SN_ITEM_CURRENT : SN_ITEM_HOVER}`)}"><span class="${SN_ITEM_CONTENT} ${SN_ITEM_CONTENT_PRESS}"><span class="${SN_ITEM_LABEL} ${tone(sc, false).label}">${esc(s.label)}</span></span></a></li>`;
            })
            .join("");
          return `<li class="${SN_PARENT_LI}"><button type="button" id="${buttonId}" aria-expanded="${open}" aria-controls="${listId}" data-slot="side-navigation-item" data-parent="" data-state="${open ? "open" : "closed"}" class="${SN_ITEM} ${SN_ITEM_HOVER}"><span data-slot="side-navigation-item-content" class="${SN_ITEM_CONTENT} ${SN_ITEM_CONTENT_PRESS}"><span aria-hidden="true" data-slot="side-navigation-item-icon" class="${SN_ITEM_ICON} ${c.icon}">${svg(PATHS[it.icon])}</span><span data-slot="side-navigation-item-label" class="${SN_ITEM_LABEL} ${c.label}">${esc(it.label)}</span>${svg(PATHS.chevronDown, ` data-slot="side-navigation-chevron" class="${SN_CHEVRON}${open ? " rotate-180" : ""}"`)}</span></button><div data-slot="side-navigation-sub-list" data-state="${open ? "open" : "closed"}" class="${SN_SUB_LIST} ${open ? SN_SUB_LIST_OPEN : SN_SUB_LIST_CLOSED}"><ul id="${listId}" aria-labelledby="${buttonId}" class="${SN_SUB_UL}">${subs}</ul></div></li>`;
        })
        .join("");
      return `<div data-slot="side-navigation-group" class="${SN_GROUP}"><div id="${labelId}" data-slot="side-navigation-group-label" class="${SN_GROUP_LABEL}">${esc(g.label)}</div><ul aria-labelledby="${labelId}" class="${SN_LIST}">${lis}</ul></div>`;
    })
    .join("");
  return `<nav aria-label="주 메뉴" data-slot="side-navigation-content" data-standalone="" class="${SN_STANDALONE}">${body}</nav>`;
}

// <SidePanel> > <SidePanelContent> — 딤 + 패널(머리 · 닫기 · 자식). form 이면 닫기 버튼이 없다(바닥 [취소])
function sidePanel({ uid, side = "right", size = "medium", title, description, form = false, showCloseButton = true, children }) {
  const showClose = showCloseButton && !form;
  const titleId = `${uid}-title`;
  const descriptionId = description != null ? `${uid}-description` : null;
  const content = attrs([
    'role="dialog"',
    `id="${uid}"`,
    descriptionId && `aria-describedby="${descriptionId}"`,
    `aria-labelledby="${titleId}"`,
    'data-state="open"',
    'data-slot="side-panel-content"',
    `data-side="${side}"`,
    side === "right" && `data-size="${size}"`,
    form && 'data-form="true"',
    'aria-modal="true"',
    `class="${CONTENT} ${SIDE[side]}${side === "right" ? ` ${SIZE[size]}` : ""}"`,
    'tabindex="-1"',
    // 미리보기용 덧칠 — 레시피의 h-dvh 를 틀 높이로
    'style="height:100%; max-height:100%;"',
  ]);
  const header = `<div data-slot="side-panel-header" class="${HEADER}${showClose ? ` ${HEADER_CLOSE}` : ""}"><h2 id="${titleId}" data-slot="side-panel-title" class="${TITLE}">${esc(title)}</h2>${
    descriptionId ? `<p id="${descriptionId}" data-slot="side-panel-description" class="${DESCRIPTION}" style="${P_FIX}">${esc(description)}</p>` : ""
  }</div>`;
  const close = showClose
    ? `<button type="button" aria-label="닫기" data-slot="side-panel-close" class="${CLOSE} ${CLOSE_SIDE[side]}">${svg(PATHS.x)}</button>`
    : "";
  return `<div data-state="open" data-slot="side-panel-overlay" class="${OVERLAY}"></div><div ${content}>${header}${close}${children}</div>`;
}
// <SidePanelBody> — scrollFog 면 끝 흐림(위 20 · 아래 80), className 은 cn() 처럼 같은 클래스를 하나만 남긴다
const body = ({ side, scrollFog = false, className = "", html }) => {
  const parts = [BODY, className === BODY_SIDE[side] ? "" : BODY_SIDE[side], scrollFog ? BODY_FOG : BODY_PLAIN, className].filter(Boolean).join(" ");
  return `<div data-slot="side-panel-body"${scrollFog ? ' data-scroll-fog="overlayBody"' : ""} class="${parts}"${scrollFog ? ` style="${fogStyle()}"` : ""}>${html}</div>`;
};
// <SidePanelFooter> — 오른쪽 정렬 [취소] [저장], Button small
const footer = (buttons) => `<div data-slot="side-panel-footer" class="${FOOTER}">${buttons.join("")}</div>`;
const button = (label, variant) => `<button class="${buttonVariants({ variant, size: "small" })}">${esc(label)}</button>`;

// 미리보기 틀 — transform 이 fixed 의 기준을 틀로 바꾸고 isolation 이 z-index 를 가둔다
const STAGE = (width, height) =>
  `position:relative; isolation:isolate; transform:translateZ(0); overflow:hidden; width:100%; max-width:${width}; height:${height}px; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-basement); font-family:var(--font-sans);`;
// 뒤 화면(미리보기 그림) — 폰: ☰ + 제목 · 줄, 데스크톱: 사이드바 띠 + 제목 · 카드
const PHONE_BAR =
  "display:flex; align-items:center; gap:var(--spacing-x1_5); height:56px; padding:0 var(--spacing-x1_5); background:var(--color-bg-layer-default); color:var(--color-fg-neutral); font-size:var(--text-t6); line-height:var(--text-t6--line-height); font-weight:700;";
const PHONE_ICON = "display:flex; align-items:center; justify-content:center; width:44px; height:44px;";
const ROW = "display:flex; justify-content:space-between; padding:var(--spacing-x3) var(--spacing-x6); background:var(--color-bg-layer-default); border-top:1px solid var(--color-stroke-neutral-subtle); font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const phoneBehind = (title, rows) =>
  `<div style="${PHONE_BAR}"><span style="${PHONE_ICON}">${svg(PATHS.menu)}</span>${esc(title)}</div>${rows.map(([a, b]) => `<div style="${ROW}"><span>${esc(a)}</span><b>${esc(b)}</b></div>`).join("")}`;
const DESK_SIDE = "position:absolute; inset:0 auto 0 0; width:56px; background:var(--color-bg-layer-default); box-shadow:inset -1px 0 0 0 var(--color-stroke-neutral-subtle);";
const DESK_MAIN = "position:absolute; inset:0 0 0 56px; padding:var(--spacing-x5) var(--layout-margin);";
const DESK_TITLE = "margin:0 0 var(--spacing-x4); font-size:var(--text-screen-title); line-height:var(--text-screen-title--line-height); font-weight:700; color:var(--color-fg-neutral);";
const DESK_CARD = "height:96px; margin-bottom:var(--spacing-x3); border-radius:var(--radius-r4); background:var(--color-bg-layer-default);";
const deskBehind = (title) => `<div style="${DESK_SIDE}"></div><div style="${DESK_MAIN}"><h1 style="${DESK_TITLE}">${esc(title)}</h1><div style="${DESK_CARD}"></div><div style="${DESK_CARD}"></div></div>`;
// 폼 칸 · 혜택 줄 — 미리보기 그림
const FIELD_LABEL = "display:block; margin-bottom:var(--spacing-x2); font-size:var(--text-t5); line-height:var(--text-t5--line-height); font-weight:500; color:var(--color-fg-neutral);";
const FIELD_BOX =
  "display:flex; align-items:center; min-height:40px; padding:0 var(--spacing-x3_5); border-radius:var(--radius-r2); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-weak); font-size:var(--text-t4); line-height:var(--text-t4--line-height); color:var(--color-fg-neutral);";
const formFields = (fields) =>
  `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:var(--spacing-x5) var(--spacing-x4);">${fields
    .map(([label, value]) => `<div><span style="${FIELD_LABEL}">${esc(label)}</span><div style="${FIELD_BOX}">${esc(value)}</div></div>`)
    .join("")}</div>`;
const LINE = "display:flex; justify-content:space-between; gap:var(--spacing-x3); padding:var(--spacing-x3) 0; font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const LINE_DETAIL = "display:block; font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle);";
const lines = (list) =>
  list.map(([t, d, v]) => `<div style="${LINE}"><span>${esc(t)}<span style="${LINE_DETAIL}">${esc(d)}</span></span><b style="white-space:nowrap;">${esc(v)}</b></div>`).join("");
const BENEFITS = [
  ["커피 전문점", "스타벅스 · 투썸 · 이디야", "10% 할인"],
  ["대중교통", "버스 · 지하철", "10% 할인"],
  ["통신 요금", "자동이체 시", "5,000원 할인"],
  ["온라인 쇼핑", "쿠팡 · 11번가", "5% 적립"],
  ["영화", "CGV · 메가박스", "4,000원 할인"],
  ["주유", "SK · GS", "리터당 60원"],
  ["편의점", "GS25 · CU", "5% 할인"],
  ["해외 결제", "수수료", "면제"],
];
const CAPTION = "display:block; margin-top:var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const sidePanelExamples = [
  {
    title: "주 메뉴 서랍 — HR 폰",
    description:
      "HR 웹 768 미만의 주 메뉴다 — 상단 바(Top Navigation)의 ☰ 를 누르면 왼쪽에서 화면 폭의 80% 패널이 미끄러져 나온다(300ms enter-expressive · 딤 overlay-dim 라이트 0.50 · 다크 0.65). 패널은 높이 전체에 붙고 모서리 · 그림자 · 선이 없다 — 딤과 면 색(bg-layer-floating)으로 뜬다. 제목은 서비스 이름(\"Porest HR\" — t8 22/30 · 700, 위 24 · 좌우 24 · 아래 16 · 최소 70)이고 닫기 버튼(52 투명 상자 · 아이콘 22 — 위 28 · 오른쪽 24)이 있다. 본문은 Side Navigation 의 묶음 · 항목을 펼친 모양 그대로 담는다 — 본문 좌우 16 에 항목(좌우 8)이 들어와 아이콘이 제목과 같은 24 에 선다. 지금 화면의 묶음(휴가)은 펼쳐진 채 열리고 지금 항목(휴가 현황)이 bg-neutral-weak-pressed 다. 넘칠 수 있어 scrollFog 를 건다(위 20 · 아래 80 늘 흐림). 항목을 누르면 이동하고 닫힌다(onNavigate). 딤 누르기 · Esc · 왼쪽으로 끌기 · 뒤로 가기로도 닫히고, 창이 768 이상으로 넓어지면 닫힌다 — 사이드바가 그 자리를 맡는다.",
    jsx: `import { SidePanel, SidePanelBody, SidePanelContent } from "@/components/ui/side-panel"
import { SideNavigationContent, SideNavigationGroup, SideNavigationItem, SideNavigationSubItem } from "@/components/ui/side-navigation"

<SidePanel open={menuOpen} onOpenChange={setMenuOpen}>
  <SidePanelContent side="left" title="Porest HR" id="main-menu">
    <SidePanelBody scrollFog className="px-x4">
      {/* 사이드바와 같은 항목 — 지금 묶음은 저절로 펼쳐지고, 항목을 누르면 이동하고 닫힌다 */}
      <SideNavigationContent onNavigate={() => setMenuOpen(false)}>
        <SideNavigationGroup label="근무">
          <SideNavigationItem href="/calendar" icon={<CalendarDays />} label="캘린더" current={path === "/calendar"} />
          <SideNavigationItem icon={<Plane />} label="휴가">
            <SideNavigationSubItem href="/vacation/history" label="휴가 현황" current={path === "/vacation/history"} />
            <SideNavigationSubItem href="/vacation/application" label="휴가 신청" current={path === "/vacation/application"} />
          </SideNavigationItem>
        </SideNavigationGroup>
      </SideNavigationContent>
    </SidePanelBody>
  </SidePanelContent>
</SidePanel>`,
    render: () =>
      `<div style="${STAGE("360px", 640)}">${phoneBehind("휴가 현황", [["연차", "11일 남음"], ["반차", "2회 남음"], ["병가", "3일 사용"], ["경조 휴가", "없음"]])}${sidePanel({
        uid: "side-panel-ex-drawer",
        side: "left",
        title: "Porest HR",
        children: body({ side: "left", scrollFog: true, className: "px-x4", html: drawerNavigation({ uid: "side-panel-ex-drawer-nav", groups: HR_GROUPS, current: "휴가 현황" }) }),
      })}</div>`,
  },

  {
    title: "오른쪽 패널 — 1280 이상(쓰는 곳 없음)",
    description:
      "1280 이상의 보조 작업 — 본문을 보면서 함께 다룰 때만 오른쪽에 둔다(그렇지 않으면 Dialog, 1280 미만은 같은 내용을 Bottom Sheet 로). 폭은 size — small 480 · medium 720(기본) · large 960 이고 어느 크기든 화면의 80% 를 넘지 않는다 — 딤이 늘 20% 남는다(미리보기 틀이 좁으면 80% 에서 멈춘 모습이다). 입력 폼(form)은 Dialog 와 같다 — 딤을 눌러도 · 끌어도 닫히지 않고, 머리 닫기 버튼 없이 바닥 [취소] · Esc 로 닫으며, 바뀐 값이 있으면(dirty) 닫기 전에 \"작성한 내용이 사라져요\" 를 묻는다. 바닥은 위 16 · 좌우 24 · 아래 24 에 Button small 36 을 오른쪽으로 모은다(사이 8) — 버튼 글은 동작 이름(\"저장\")이다. 지금은 오른쪽 패널을 쓰는 곳이 없다.",
    jsx: `<SidePanel open={open} onOpenChange={setOpen} form dirty={isDirty}>
  <SidePanelContent side="right" size="medium" title="알림 설정">
    <SidePanelBody>…</SidePanelBody>
    <SidePanelFooter>
      <Button variant="neutralWeak" size="small" onClick={() => setOpen(false)}>취소</Button>
      <Button size="small" onClick={save}>저장</Button>
    </SidePanelFooter>
  </SidePanelContent>
</SidePanel>`,
    render: () =>
      `<div style="${STAGE("100%", 480)}">${deskBehind("가계부")}${sidePanel({
        uid: "side-panel-ex-form",
        side: "right",
        size: "medium",
        title: "알림 설정",
        form: true,
        children: `${body({ side: "right", html: formFields([["알림 받을 시각", "오전 9:00"], ["반복", "매일"], ["카드 결제일 알림", "하루 전"], ["예산 경고", "80% 넘으면"]]) })}${footer([button("취소", "neutralWeak"), button("저장")])}`,
      })}</div>`,
  },

  {
    title: "조회 패널 — 설명 · 닫기 버튼 · small 480",
    description:
      "조회 · 주 메뉴는 머리 닫기 버튼 · 딤 누르기 · Esc · 붙은 쪽으로 끌기로 닫힌다. 닫기 버튼이 있으면 머리 오른쪽 52 를 비운다. 설명은 덧붙일 말이 있을 때만 한 문장(t5 16/22 · fg-neutral-muted, 제목과 6)이고 aria-describedby 로 잇는다 — 없으면 잇지 않는다. 본문은 좌우 24 이고 넘치면 본문만 스크롤된다 — 위로 스크롤하면 머리 아래 1px stroke-neutral-subtle 이 생긴다(150ms). 넘칠 수 있는 목록이라 scrollFog(위 20 · 아래 80)를 걸었다. 패널 위에 또 패널을 겹치지 않는다 — 그 안에서는 Popover · Select 목록 · 확인창만 뜬다(딤 z-modal 100 · 패널 z-modal-content 101).",
    jsx: `<SidePanel open={open} onOpenChange={setOpen}>
  <SidePanelContent side="right" size="small" title="카드 혜택" description="이번 달 실적에 따라 받는 혜택이에요.">
    <SidePanelBody scrollFog>{benefits.map((b) => <BenefitRow key={b.id} benefit={b} />)}</SidePanelBody>
  </SidePanelContent>
</SidePanel>`,
    render: () =>
      labeled(
        `<div style="${STAGE("100%", 480)}">${deskBehind("카드 혜택")}${sidePanel({
          uid: "side-panel-ex-detail",
          side: "right",
          size: "small",
          title: "카드 혜택",
          description: "이번 달 실적에 따라 받는 혜택이에요.",
          children: body({ side: "right", scrollFog: true, html: lines(BENEFITS) }),
        })}</div>`,
        "small 480 — 화면의 80% 까지",
      ),
  },
];
