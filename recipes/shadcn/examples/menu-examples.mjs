/*
 * shadcn Menu 예제 — docs site components/menu.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(들어간 화면 머리 ⋮ · 설명과 막힌 줄)은 차례 · 제목 · 코드가 specs/components/menu.md 의
 * "코드" 절과 같고, 뒤의 둘(묶음 이름 · 뒤 아이콘 · 상태)은 md 의 Properties · Guidelines 를 코드로 더 보인다.
 *
 * CONTENT · SCROLL · GROUP · ITEM · PILL · PILL_ON · ITEM_CONTENT · ITEM_CONTENT_PRESS 는 recipes/shadcn/components/ui/menu.tsx 의 상수와,
 * GROUP_LABEL · ITEM_ICON · ITEM_BODY · ITEM_LABEL · ITEM_DESCRIPTION · ITEM_SUFFIX · FG · DESCRIPTION_COLOR 는 그 파일의 JSX 에 적힌 클래스와
 * 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 트리거 BUTTON_* 는 button.tsx 의 cva 와 같다(button-examples.mjs 의 것과 같다 —
 * 이 파일이 쓰는 변형 · 크기 · 배치와 그에 걸리는 compound 만 옮겼다).
 * 규칙은 specs/components/menu.md, 수치 원본은 specs/components/menu.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 트리거 <button data-slot="menu-trigger">(aria-haspopup="menu" · aria-expanded · 열린 동안 aria-controls ·
 * data-state), 메뉴 <div role="menu" data-slot="menu-content"> > 스크롤 자리 <div data-slot="menu-scroll"> > 묶음 <div role="group" data-slot="menu-group">
 * (묶음 이름 <div data-slot="menu-group-label"> — 묶음의 aria-labelledby) > 줄 <div role="menuitem" data-slot="menu-item"> > 알약
 * <span data-slot="menu-item-pill"> + 콘텐츠 <span data-slot="menu-item-content">(앞 아이콘 · 이름 · 설명 · 뒤 아이콘). 묶음 사이 선은 둘째 묶음부터의
 * ::before 다. 1280 이상에서 ResponsiveMenu 는 Menu 를 그린다 — 1280 미만의 Menu Sheet 는 menu-sheet-examples.mjs 에 있다.
 * Radix 가 실행 중에 붙이는 것 중 열림(data-state) · 자리(data-side · data-align) · id · 이름 잇기(aria-labelledby · aria-controls) · tabindex ·
 * data-orientation · 막힌 줄의 aria-disabled · data-disabled · 키보드로 옮긴 줄의 data-highlighted 와 높이 계산이 읽는 자리 변수
 * (--radix-dropdown-menu-content-available-height — 미리보기는 틀 안의 남은 높이로 적었다)를 그린다.
 * 레시피는 메뉴를 body 끝(portal)에 띄우고 Radix 가 감싼 div(position: fixed)로 트리거 아래 8 에 놓는다 — 미리보기는 감싼 div 를 틀 안의
 * position: absolute 로 흉내 낸다. 메뉴는 트리거의 오른쪽 끝에 맞춘다(align 기본 end — 머리 ⋮ · 표 줄 끝 ⋮). 목록 줄에는 ⋮ 를 두지 않는다(menu.md "줄의 동작", 2026-10-25). 화면 가장자리 8 을 넘으면
 * 안으로 미는 계산(collisionPadding)은 하지 않는다 — 그림의 트리거는 틀 가장자리에서 24 이상 떨어져 있다. 틀의 isolation 이 z-(--z-floating) 을 틀 안에 가둔다.
 * 레시피가 cn() 으로 합치는 자리는 merge() 로 똑같이 합친다 — 같은 속성을 다시 쓴 클래스는 뒤의 것만 남는다.
 * 모션 클래스(animate-in · zoom-in-95 …)는 tw-animate-css 의 것이라 사이트에서는 아무 일도 하지 않는다 — 열린 순간을 멈춘 그림이다.
 * 레시피의 스크립트(열고 닫기 · 화살표 · 글자로 찾기 · 호버가 초점을 옮기지 않게 하기 · 누르는 순간 --press-basis 재기 · 닫힌 뒤 onSelect)는
 * 정적 HTML 에 없다 — 줄에 마우스를 올리거나 누르면 알약 · 축소는 레시피 그대로 바뀌지만 메뉴는 열린 채 그대로다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── menu.tsx 의 상수와 같은 값 ─────────────────────────────────────────────

// 메뉴 — 폭 200 · 모서리 20 · 떠 있는 바탕 + s3 · z 200. 열 때 150ms enter · 닫을 때 100ms exit 로 0.95 ↔ 1 · 투명도
const CONTENT = [
  "z-(--z-floating) w-[200px] overflow-hidden rounded-r5 bg-bg-layer-floating font-sans text-fg-neutral shadow-[var(--shadow-s3)] outline-none",
  "origin-[var(--radix-dropdown-menu-content-transform-origin)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:[--tw-animation-duration:var(--motion-duration-d3)] data-[state=open]:ease-[var(--motion-ease-enter)] motion-safe:data-[state=open]:zoom-in-95",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:[--tw-animation-duration:var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)] motion-safe:data-[state=closed]:zoom-out-95",
].join(" ");

// 스크롤 자리 — 위아래 8 · 묶음 사이 8. 높이는 min(480, max(200, 남은 화면))
const SCROLL =
  "relative flex max-h-[min(480px,max(200px,var(--radix-dropdown-menu-content-available-height,200px)))] flex-col gap-x2 overflow-y-auto py-x2";

// 묶음 — 둘째 묶음부터 위에 1px 선(좌우 16 들임 · 아래 8). 위쪽 8 은 스크롤 자리의 gap — 묶음 사이 8 + 1 + 8 = 17
const GROUP =
  "flex flex-col [[data-slot=menu-group]+&]:before:mx-x4 [[data-slot=menu-group]+&]:before:mb-x2 [[data-slot=menu-group]+&]:before:h-px [[data-slot=menu-group]+&]:before:shrink-0 [[data-slot=menu-group]+&]:before:bg-stroke-neutral-subtle [[data-slot=menu-group]+&]:before:content-['']";

// 줄 — 위아래 10 · 좌우 16. 키보드 위치는 ::after 의 링(알약 자리 · 안쪽 2px, 바탕 없음)
const ITEM = [
  "group/menu-item relative flex cursor-pointer select-none items-center px-x4 py-x2_5 outline-none scroll-my-x2",
  "after:pointer-events-none after:absolute after:inset-y-0 after:inset-x-x2 after:rounded-r3 after:content-['']",
  "focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-stroke-focus-ring",
  "data-[disabled]:cursor-not-allowed",
].join(" ");

// 알약 — 줄은 그대로, 마우스를 올리거나 누르면 좌우 8 들어오며 칠해진다. 막힌 줄에는 없다
const PILL =
  "pointer-events-none absolute inset-y-0 inset-x-0 rounded-none bg-transparent [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),inset_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-radius_var(--motion-duration-color-transition)_var(--motion-ease-easing)]";
const PILL_ON =
  "group-hover/menu-item:inset-x-x2 group-hover/menu-item:rounded-r3 group-hover/menu-item:bg-bg-layer-floating-pressed group-active/menu-item:inset-x-x2 group-active/menu-item:rounded-r3 group-active/menu-item:bg-bg-layer-floating-pressed";

// 콘텐츠 층 — 아이콘 18 ↔ 글 8. 누르는 동안만 준다(알약은 그대로)
const ITEM_CONTENT =
  "relative flex min-w-0 flex-1 items-center gap-x2 [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const ITEM_CONTENT_PRESS =
  "group-active/menu-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/menu-item:[scale:1]";

// ── menu.tsx 의 JSX 에 적힌 클래스 ─────────────────────────────────────────

// 묶음 이름 — t3 · fg-neutral-subtle · 위아래 8 · 좌우 16. 레시피는 cn(GROUP_LABEL, className)
const GROUP_LABEL = "select-none px-x4 py-x2 text-t3 font-normal text-fg-neutral-subtle break-keep [overflow-wrap:break-word]";
// 줄의 조각 — 앞 아이콘 18 · 글(이름 t4 · 설명 t2, 사이 2) · 뒤 아이콘 16. 레시피는 cn(조각, 글자색)
const ITEM_ICON = "flex shrink-0 [&>svg]:size-[18px]";
const ITEM_BODY = "flex min-w-0 flex-1 flex-col items-start gap-x0_5 text-left break-keep [overflow-wrap:break-word]";
const ITEM_LABEL = "text-t4 font-normal";
const ITEM_DESCRIPTION = "text-t2 font-normal";
const ITEM_SUFFIX = "flex shrink-0 [&>svg]:size-4";
// 글자색 — 아이콘 · 이름 · 뒤 아이콘은 하나(막힘 → critical → neutral 차례로 고른다), 설명은 막히면 fg-disabled
const FG = { neutral: "text-fg-neutral", critical: "text-fg-critical", disabled: "text-fg-disabled" };
const DESCRIPTION_COLOR = { enabled: "text-fg-neutral-subtle", disabled: "text-fg-disabled" };

// ── button.tsx 의 cva 와 같은 값 — ⋮ 트리거(ghost · medium · 아이콘만) ───────

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

const BUTTON_COMPOUND = [{ size: "medium", layout: "iconOnly", className: "w-10 p-x2_5 [&_svg]:size-[18px]" }];

const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다
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

// "group-active/menu-item:[scale:1]" → ["group-active/menu-item", "[scale:1]"] — 괄호 안의 ":" 는 가르지 않는다
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
// 배경 · 좌우 들임(inset-x) · 임의 속성([prop:…]). 그래서 강제 상태의 알약 바탕 · 들임이 쉴 때의 bg-transparent · inset-x-0 을, ghost 버튼의
// disabled:bg-transparent 가 바탕의 disabled:bg-bg-disabled 를 지운다(Button 은 cn(buttonVariants(…)) 이다)
const GROUPS = [
  [/^bg-/, "bg"],
  [/^inset-x-/, "inset-x"],
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

// 정적 미리보기에서 호버 · 누름 · 키보드 위치를 보이려고 — 그 상태의 클래스(group-hover/menu-item: · group-active/menu-item: · focus-visible:)에서
// 접두어만 뗀 사본을 뒤에 붙인다(merge 가 겹치는 기본값을 지운다). 값은 레시피 그대로라 menu.tsx 가 바뀌면 같이 따라간다
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
  ellipsisVertical: svg('<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>'),
  pin: svg(
    '<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
  ),
  pencil: svg(
    '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  ),
  copy: svg('<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>'),
  trash2: svg(
    '<path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  ),
  externalLink: svg('<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'),
};

// 미리보기 틀 — 데스크톱 화면(1280 이상) 위에 메뉴. isolation 이 z-(--z-floating) 을 틀 안에 가둔다
const STAGE = (height) =>
  `position:relative; isolation:isolate; overflow:hidden; width:100%; height:${height}px; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-basement); font-family:var(--font-sans);`;
const PAGE = "padding:var(--spacing-x6);";
const PAGE_HEAD = "display:flex; align-items:center; justify-content:space-between; gap:var(--spacing-x3); margin-bottom:var(--spacing-x4);";
const PAGE_TITLE = "font-size:var(--text-t7); line-height:var(--text-t7--line-height); font-weight:700; color:var(--color-fg-neutral);";
// 뒤 화면의 흰 카드 · 줄(미리보기 그림) — 줄은 좌우 24, 끝에 ⋮
const CARD = "padding:var(--spacing-x2) 0; border-radius:var(--radius-r4); background:var(--color-bg-layer-default);";
const ROW = "display:flex; align-items:center; gap:var(--spacing-x3); padding:var(--spacing-x2) var(--spacing-x6);";
const ROW_BODY = "display:flex; flex:1; flex-direction:column; gap:var(--spacing-x0_5); min-width:0;";
const ROW_TITLE = "font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const ROW_DETAIL = "font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle);";
// 트리거와 메뉴 — 트리거 아래 8(sideOffset) · 오른쪽 끝 맞춤(align end). 감싼 div 는 Radix 의 popper 감싸개 자리다
const ANCHOR = "position:relative; display:inline-flex; flex-shrink:0;";
const WRAPPER = "position:absolute; right:0; top:calc(100% + var(--spacing-x2)); min-width:max-content; z-index:var(--z-floating);";
const CAPTION =
  "font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";

// <MenuItem> — 앞 아이콘 · 이름 · 설명 · 뒤 아이콘 · tone · disabled. force = "hovered" · "pressed" · "focused" 는 미리보기용 강제 상태
// (focused 는 키보드로 옮긴 줄 — data-highlighted). pressBasis 는 레시피가 누르는 순간 재는 기준 길이(폭 200 ÷ 4 = 50)다
function menuItem({ label, description, icon, suffixIcon, tone = "neutral", disabled = false, force, pressBasis = 50 }) {
  const fg = disabled ? FG.disabled : FG[tone];
  let item = ITEM;
  let pill = merge([PILL, !disabled && PILL_ON].filter(Boolean).join(" "));
  let content = merge([ITEM_CONTENT, !disabled && ITEM_CONTENT_PRESS].filter(Boolean).join(" "));
  if (force === "hovered") pill = forced(pill, "group-hover/menu-item");
  if (force === "pressed") {
    pill = forced(pill, "group-active/menu-item");
    content = forced(content, "group-active/menu-item");
  }
  if (force === "focused") item = forced(item, "focus-visible");
  const row = attrs([
    'role="menuitem"',
    'data-slot="menu-item"',
    `data-tone="${tone}"`,
    disabled && 'aria-disabled="true"',
    disabled && 'data-disabled=""',
    force === "focused" && 'data-highlighted=""',
    `class="${item}"`,
    'tabindex="-1"',
    'data-orientation="vertical"',
    'data-radix-collection-item=""',
    force === "pressed" && `style="--press-basis:${pressBasis}"`,
  ]);
  const iconHtml = icon != null ? `<span aria-hidden="true" data-slot="menu-item-icon" class="${ITEM_ICON} ${fg}">${icon}</span>` : "";
  const descriptionHtml =
    description != null
      ? `<span data-slot="menu-item-description" class="${ITEM_DESCRIPTION} ${disabled ? DESCRIPTION_COLOR.disabled : DESCRIPTION_COLOR.enabled}">${esc(description)}</span>`
      : "";
  const suffixHtml = suffixIcon != null ? `<span aria-hidden="true" data-slot="menu-item-suffix-icon" class="${ITEM_SUFFIX} ${fg}">${suffixIcon}</span>` : "";
  return `<div ${row}><span aria-hidden="true" data-slot="menu-item-pill" class="${pill}"></span><span data-slot="menu-item-content" class="${content}">${iconHtml}<span class="${ITEM_BODY}"><span data-slot="menu-item-label" class="${ITEM_LABEL} ${fg}">${esc(label)}</span>${descriptionHtml}</span>${suffixHtml}</span></div>`;
}

// <MenuGroup> — 묶음 이름(label)이 있으면 그 id 로 aria-labelledby
function menuGroup({ uid, label, items }) {
  const labelId = `${uid}-label`;
  const head = label != null ? `<div id="${labelId}" data-slot="menu-group-label" class="${GROUP_LABEL}">${esc(label)}</div>` : "";
  return `<div role="group" data-slot="menu-group"${label != null ? ` aria-labelledby="${labelId}"` : ""} class="${GROUP}">${head}${items.map(menuItem).join("")}</div>`;
}

// <MenuContent> + 감싼 div. uid 는 Radix · useId 의 앞말(예제마다 달리한다). availableHeight 는 Radix 가 재는 트리거 아래 남은 높이
function menuContent({ uid, triggerId, groups, availableHeight }) {
  const content = attrs([
    'role="menu"',
    'aria-orientation="vertical"',
    'data-state="open"',
    'data-side="bottom"',
    'data-align="end"',
    'data-radix-menu-content=""',
    'dir="ltr"',
    `id="${uid}"`,
    `aria-labelledby="${triggerId}"`,
    'tabindex="-1"',
    'data-orientation="vertical"',
    'data-slot="menu-content"',
    `class="${CONTENT}"`,
    `style="outline:none; --radix-dropdown-menu-content-available-height:${availableHeight}px;"`,
  ]);
  const body = groups.map((g, i) => menuGroup({ uid: `${uid}-group${i}`, ...g })).join("");
  return `<div data-radix-popper-content-wrapper="" style="${WRAPPER}"><div ${content}><div data-slot="menu-scroll" class="${SCROLL}">${body}</div></div></div>`;
}

// <Button variant="ghost" layout="iconOnly"> ⋮ — MenuTrigger asChild 가 Radix 의 속성(type · id · aria-haspopup · aria-expanded · 열린 동안
// aria-controls · data-state)과 data-slot 을 얹는다
function moreButton({ id, name, open = false, controls }) {
  return `<button ${attrs([
    'type="button"',
    `id="${id}"`,
    'aria-haspopup="menu"',
    `aria-expanded="${open}"`,
    open && `aria-controls="${controls}"`,
    `data-state="${open ? "open" : "closed"}"`,
    'data-slot="menu-trigger"',
    `class="${merge(buttonVariants({ variant: "ghost", layout: "iconOnly" }))}"`,
    `aria-label="${esc(name)}"`,
  ])}>${ICONS.ellipsisVertical}</button>`;
}

// 줄 끝 ⋮ 를 둔 목록 — open 번째 줄의 ⋮ 에 메뉴를 붙인다(트리거 오른쪽 끝 맞춤)
function rowsStage({ uid, title, rows, open = 0, groups, height, availableHeight }) {
  const row = (r, i) => {
    const triggerId = `${uid}-trigger${i}`;
    const isOpen = i === open;
    const trigger = moreButton({ id: triggerId, name: `${r.title} 더보기`, open: isOpen, controls: uid });
    const anchor = isOpen ? `<div style="${ANCHOR}">${trigger}${menuContent({ uid, triggerId, groups, availableHeight })}</div>` : trigger;
    return `<div style="${ROW}"><div aria-hidden="true" style="${ROW_BODY}"><span style="${ROW_TITLE}">${esc(r.title)}</span><span style="${ROW_DETAIL}">${esc(r.detail)}</span></div>${anchor}</div>`;
  };
  return `<div style="${STAGE(height)}"><div style="${PAGE}"><div style="${PAGE_HEAD}"><div aria-hidden="true" style="${PAGE_TITLE}">${esc(title)}</div></div><div style="${CARD}">${rows.map(row).join("")}</div></div></div>`;
}

// 들어간 화면(목록 줄을 눌러 연 상세) — 머리 제목 + 오른쪽 ⋮ 하나에 메뉴를 붙이고, 아래 흰 카드에 본문 몇 줄
function headStage({ uid, title, detail, lines, groups, height, availableHeight }) {
  const triggerId = `${uid}-trigger`;
  const head = `<div style="${ANCHOR}">${moreButton({ id: triggerId, name: `${title} 더보기`, open: true, controls: uid })}${menuContent({ uid, triggerId, groups, availableHeight })}</div>`;
  const body = [`<span style="${ROW_DETAIL}">${esc(detail)}</span>`, ...lines.map((l) => `<span style="${ROW_TITLE}">${esc(l)}</span>`)].join("");
  return `<div style="${STAGE(height)}"><div style="${PAGE}"><div style="${PAGE_HEAD}"><div aria-hidden="true" style="${PAGE_TITLE}">${esc(title)}</div>${head}</div><div aria-hidden="true" style="${CARD}"><div style="${ROW} flex-direction:column; align-items:flex-start;">${body}</div></div></div></div>`;
}

// 이름표 아래 견본 — 상태 예제
const labeled = (html, caption) =>
  `<div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--spacing-x2); min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

const MEMOS = [
  { title: "주간 회의 메모", detail: "10월 1일 (목) · 회의" },
  { title: "장보기 목록", detail: "9월 30일 (수)" },
  { title: "여행 준비", detail: "9월 28일 (월)" },
];
const STAFF = [
  { title: "김하늘", detail: "디자인 본부 · 매니저" },
  { title: "박서준", detail: "프로덕트 본부 · 팀장" },
  { title: "이도윤", detail: "운영 본부 · 팀원" },
];

export const menuExamples = [
  {
    title: "들어간 화면 머리 ⋮ — 1280 에서 Menu Sheet 로 바뀐다",
    description:
      "목록 줄에는 ⋮ 를 두지 않는다 — 줄을 누르면 한 단계 들어가고, 들어간 화면의 동작이 여럿이면 머리 오른쪽 ⋮ 하나로 연다(하나뿐인 삭제는 바닥 왼쪽 [삭제]). 버튼 이름은 \"{항목 이름} 더보기\"(Button ghost · iconOnly)다. 폭마다 바뀌는 자리는 ResponsiveMenu 로 짠다 — 1280 이상은 이 메뉴, 미만은 같은 줄 · 같은 순서의 Menu Sheet 다(title 은 시트의 제목 — 메뉴에는 머리가 없다). 메뉴는 트리거 아래 8 · 오른쪽 끝에 맞춰 붙는 폭 200 의 떠 있는 표면(모서리 20 · s3 · 위아래 8)이다 — align 기본이 end 라 머리 오른쪽 ⋮ 의 메뉴가 화면 밖으로 나가지 않고(SEED 기본은 가운데), 모자라면 화면 가장자리 8 안으로 민다. 왼쪽에 놓인 트리거는 align=\"start\" 다. 비모달이라 뒤 화면을 숨기지 않는다. 줄은 위아래 10 · 좌우 16 · 이름 14/19 · 아이콘 18(사이 8) — 한 줄 39. 되돌릴 수 없는 동작은 맨 아래 묶음에 critical(이름 · 아이콘만 fg-critical)로 두고, 묶음 사이에만 선(8 + 1 + 8)을 긋는다. 고르면 메뉴가 닫히고 초점이 ⋮ 로 돌아온 뒤 onSelect 가 불린다 — 삭제 확인은 그 안에서 Alert Dialog 를 연다.",
    jsx: `import {
  ResponsiveMenu, ResponsiveMenuContent, ResponsiveMenuGroup, ResponsiveMenuItem, ResponsiveMenuTrigger,
} from "@/components/ui/menu"

// 들어간 화면(메모)의 머리 오른쪽 — 목록 줄에는 ⋮ 를 두지 않는다
<ResponsiveMenu>
  <ResponsiveMenuTrigger asChild>
    <Button variant="ghost" layout="iconOnly" aria-label="주간 회의 메모 더보기">
      <EllipsisVertical />
    </Button>
  </ResponsiveMenuTrigger>
  {/* title — Menu Sheet 의 제목(1280 이상 메뉴에는 머리가 없다) */}
  <ResponsiveMenuContent title="주간 회의 메모">
    <ResponsiveMenuGroup>
      <ResponsiveMenuItem icon={<Pin />} label="고정" onSelect={pin} />
      <ResponsiveMenuItem icon={<Pencil />} label="수정" onSelect={edit} />
      <ResponsiveMenuItem icon={<Copy />} label="복사해 새로 쓰기" onSelect={duplicate} />
    </ResponsiveMenuGroup>
    <ResponsiveMenuGroup>
      {/* 확인이 필요한 동작 — 메뉴가 닫힌 뒤 Alert Dialog 를 연다 */}
      <ResponsiveMenuItem icon={<Trash2 />} label="삭제" tone="critical" onSelect={askDelete} />
    </ResponsiveMenuGroup>
  </ResponsiveMenuContent>
</ResponsiveMenu>`,
    render: () =>
      headStage({
        uid: "menu-ex-header",
        title: MEMOS[0].title,
        detail: MEMOS[0].detail,
        lines: ["다음 분기 목표를 정리했다.", "· 신규 기능 두 가지 출시", "· 응답 속도 20% 줄이기"],
        height: 340,
        availableHeight: 220,
        groups: [
          {
            items: [
              { icon: ICONS.pin, label: "고정" },
              { icon: ICONS.pencil, label: "수정" },
              { icon: ICONS.copy, label: "복사해 새로 쓰기" },
            ],
          },
          { items: [{ icon: ICONS.trash2, label: "삭제", tone: "critical" }] },
        ],
      }),
  },

  {
    title: "설명 · 막힌 줄 — 데스크톱 표",
    description:
      "늘 1280 이상인 자리(데스크톱 표)는 Menu 를 바로 쓴다. 설명은 이름만으로 무엇을 하는지 모를 줄에만 한 줄로 둔다 — 12/16 · fg-neutral-subtle(이름과 2)이라 그 줄은 57 이다. 막힌 줄(disabled)은 아이콘 · 이름 · 설명이 fg-disabled 이고 알약이 생기지 않는다 — 눌러도 실행하지 않고 닫히지 않으며, 화살표 키가 건너뛴다(aria-disabled). 아이콘은 모든 줄에 두거나 모두 뺀다 — 이 메뉴는 모두 뺐다.",
    jsx: `import { Menu, MenuContent, MenuGroup, MenuItem, MenuTrigger } from "@/components/ui/menu"

<Menu>
  <MenuTrigger asChild>
    <Button variant="ghost" layout="iconOnly" aria-label="김하늘 더보기">
      <EllipsisVertical />
    </Button>
  </MenuTrigger>
  <MenuContent>
    <MenuGroup>
      <MenuItem label="수정" onSelect={edit} />
      {/* 설명 — 이름만으로 무엇을 하는지 모를 줄에만 */}
      <MenuItem label="비밀번호 초기화" description="새 비밀번호를 메일로 보내요." onSelect={reset} />
      <MenuItem label="휴가 내역 내보내기" disabled={!hasVacations} onSelect={exportVacations} />
    </MenuGroup>
    <MenuGroup>
      <MenuItem label="삭제" tone="critical" onSelect={askDelete} />
    </MenuGroup>
  </MenuContent>
</Menu>`,
    render: () =>
      rowsStage({
        uid: "menu-ex-description",
        title: "직원",
        rows: STAFF,
        height: 360,
        availableHeight: 240,
        groups: [
          {
            items: [
              { label: "수정" },
              { label: "비밀번호 초기화", description: "새 비밀번호를 메일로 보내요." },
              { label: "휴가 내역 내보내기", disabled: true },
            ],
          },
          { items: [{ label: "삭제", tone: "critical" }] },
        ],
      }),
  },

  {
    title: "묶음 이름 · 뒤 아이콘 — 표의 머리",
    description:
      "줄이 7개를 넘거나 같은 동작이 범위마다 있을 때 묶음으로 나누고, 묶음이 무엇인지 말해야 할 때만 묶음 이름(MenuGroupLabel — 13/18 · fg-neutral-subtle · 위아래 8)을 둔다. 묶음 이름은 누를 수 없고 묶음의 이름(aria-labelledby)이 된다. 뒤 아이콘(16)은 바깥 링크처럼 방향을 알릴 때만 두고, 앞 아이콘과 한 줄에 함께 두지 않는다. 화면 머리의 더보기도 줄의 ⋮ 와 같은 메뉴다.",
    jsx: `import { Menu, MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuTrigger } from "@/components/ui/menu"

<Menu>
  <MenuTrigger asChild>
    <Button variant="ghost" layout="iconOnly" aria-label="가계부 더보기">
      <EllipsisVertical />
    </Button>
  </MenuTrigger>
  <MenuContent>
    <MenuGroup>
      <MenuGroupLabel>10월 거래</MenuGroupLabel>
      <MenuItem label="엑셀로 저장" onSelect={() => exportMonth("xlsx")} />
      <MenuItem label="인쇄" onSelect={printMonth} />
    </MenuGroup>
    <MenuGroup>
      <MenuGroupLabel>모든 거래</MenuGroupLabel>
      <MenuItem label="엑셀로 저장" onSelect={() => exportAll("xlsx")} />
      <MenuItem label="백업 만들기" onSelect={backup} />
    </MenuGroup>
    <MenuGroup>
      {/* 뒤 아이콘 — 바깥 링크처럼 방향을 알릴 때만 */}
      <MenuItem label="도움말" suffixIcon={<ExternalLink />} onSelect={openHelp} />
    </MenuGroup>
  </MenuContent>
</Menu>`,
    render: () => {
      const uid = "menu-ex-labels";
      const triggerId = `${uid}-trigger`;
      // 머리의 ⋮ — 메뉴는 트리거 오른쪽 끝에 맞춘다
      const head = `<div style="${ANCHOR}">${moreButton({ id: triggerId, name: "가계부 더보기", open: true, controls: uid })}${menuContent({
        uid,
        triggerId,
        availableHeight: 360,
        groups: [
          { label: "10월 거래", items: [{ label: "엑셀로 저장" }, { label: "인쇄" }] },
          { label: "모든 거래", items: [{ label: "엑셀로 저장" }, { label: "백업 만들기" }] },
          { items: [{ label: "도움말", suffixIcon: ICONS.externalLink }] },
        ],
      })}</div>`;
      const rows = [
        ["김밥천국 · 식비", "8,000원"],
        ["버스 · 교통", "1,500원"],
        ["다이소 · 쇼핑", "12,300원"],
        ["월급 · 수입", "3,200,000원"],
      ]
        .map(
          ([a, b]) =>
            `<div style="${ROW} padding-block:var(--spacing-x3);"><span style="${ROW_TITLE} flex:1;">${a}</span><span style="${ROW_TITLE} font-weight:700;">${b}</span></div>`,
        )
        .join("");
      return `<div style="${STAGE(420)}"><div style="${PAGE}"><div style="${PAGE_HEAD}"><div aria-hidden="true" style="${PAGE_TITLE}">가계부</div>${head}</div><div aria-hidden="true" style="${CARD}">${rows}</div></div></div>`;
    },
  },

  {
    title: "상태 — 호버 · 누름 · 키보드 · 막힌 줄",
    description:
      "마우스를 올린 줄은 좌우 8 들어오며 칠해지는 알약(모서리 12 · bg-layer-floating-pressed)이고, 누르면 같은 알약에 아이콘 · 글만 2px 거리로 준다(알약은 그대로 — 기준 max(높이, 폭 ÷ 4, 24) 를 누르는 순간 잰다, 모션 줄이기면 줄지 않는다). 키보드로 옮긴 줄은 바탕 없이 알약 자리 안쪽에 2px 링(stroke-focus-ring)이다 — 호버는 초점을 옮기지 않아 마우스와 키보드 위치가 다르면 둘 다 보인다. 마우스로 연 메뉴에는 링이 없다. 막힌 줄은 fg-disabled 이고 알약 · 축소가 없다. 정적 미리보기라 상태는 group-hover/menu-item: · group-active/menu-item: · focus-visible: 클래스에서 접두어만 뗀 사본을 덧붙여 그렸다.",
    jsx: `// 상태는 고르는 prop 이 없다 — 마우스를 올리면 알약, 누르면 알약 + 축소, 키보드로 옮기면 링(Radix 의 data-highlighted · focus-visible)
<MenuItem icon={<Pencil />} label="수정" onSelect={edit} />
<MenuItem icon={<Trash2 />} label="삭제" tone="critical" onSelect={askDelete} />
<MenuItem icon={<Copy />} label="복사해 새로 쓰기" disabled onSelect={duplicate} />`,
    render: () => {
      const one = (key, items, caption) =>
        labeled(
          `<div style="position:relative; isolation:isolate;"><div role="menu" aria-orientation="vertical" aria-label="${esc(caption)}" data-state="open" data-slot="menu-content" class="${CONTENT}"><div data-slot="menu-scroll" class="${SCROLL}">${menuGroup({ uid: `menu-ex-state-${key}`, items })}</div></div></div>`,
          caption,
        );
      return `<div style="display:flex; flex-wrap:wrap; gap:var(--spacing-x6) var(--spacing-x4);">${[
        one("hover", [{ icon: ICONS.pencil, label: "수정", force: "hovered" }, { icon: ICONS.trash2, label: "삭제", tone: "critical" }], "hovered"),
        one("pressed", [{ icon: ICONS.pencil, label: "수정", force: "pressed" }, { icon: ICONS.trash2, label: "삭제", tone: "critical" }], "pressed"),
        one("focus", [{ icon: ICONS.pencil, label: "수정", force: "hovered" }, { icon: ICONS.trash2, label: "삭제", tone: "critical", force: "focused" }], "hovered + keyboard"),
        one("disabled", [{ icon: ICONS.pencil, label: "수정" }, { icon: ICONS.copy, label: "복사해 새로 쓰기", disabled: true }], "disabled"),
      ].join("")}</div>`;
    },
  },
];
