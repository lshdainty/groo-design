/*
 * shadcn Resizable 예제 — docs site components/resizable.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(HR 관리 — 부서 나무 | 조직도 · HR 대시보드 — 위젯 ⋮ 의 크기)은 차례 · 제목 · 코드가
 * specs/components/resizable.md 의 "코드" 절과 같고, 뒤의 둘(목록 폭 20 · 40 · 손잡이 상태, 모서리 손잡이 · 자리표시)은 md 의 Properties 를 코드로 더 보인다.
 * SEED 에는 Resizable 이 없다(모바일 앱 중심) — 손잡이 · 범위 · 키보드 · 기억 · 위젯 크기는 porest 가 정했고(2026-10-10 사용자 결정 12B · 13A),
 * 키보드는 WAI-ARIA APG Window Splitter 다. 옛 예제(가로 · 세로 · 손잡이 상자 12 × 16 · 인라인 style)를 대신한다.
 *
 * LINE · SEPARATOR · GRIP 은 recipes/shadcn/components/ui/resizable.tsx 의 상수와, GROUP · PANEL_LIST · PANEL_FILL · WIDGET_HANDLE · WIDGET_MARK 는
 * 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 위젯 ⋮ 와 "크기" 메뉴는 menu.tsx · button.tsx 의 값을
 * 옮겨 썼다 — MENU_* · BUTTON_* 는 menu-examples.mjs 의 것과 같다(이 파일이 쓰는 변형 · 크기만). 끄는 동안의 자리표시 · 따라오는 위젯의 모양은
 * styles/porest-shadcn-bridge.css 가 react-grid-layout 의 클래스(.react-grid-placeholder · .resizing)에 건다 — 사이트는 그 CSS 를 함께 싣는다.
 * 규칙은 specs/components/resizable.md, 수치 원본은 specs/components/resizable.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 나눈 자리 <div data-slot="resizable-panel-group"> > 목록 패널 <div data-slot="resizable-panel" data-panel="list"
 * style="flex-basis"> · 손잡이 <div data-slot="resizable-handle">(선) > <div role="separator" data-slot="resizable-separator">(누르는 폭 16) >
 * <span data-slot="resizable-grip">(손잡이 표시) · 남는 폭 패널 <div data-panel="fill">. 위젯 모서리 손잡이는 <span data-slot="widget-resize-handle" aria-hidden>.
 * 레시피의 스크립트(끌기 · 한 번 누르기 25 ↔ 40 · ← → 5% · Home · End · Enter · 화면마다 폭 기억)와 react-grid-layout 의 끌기는 정적 HTML 에 없다 —
 * 손잡이에 마우스를 올리면 선이 짙어지는 것은 레시피 그대로지만 폭은 그대로다. 메뉴는 열린 순간을 멈춘 그림이다(Radix 가 붙이는 열림 · 자리 ·
 * 이름 잇기를 그렸다). 부서 나무 · 조직도 · 위젯 안의 내용은 화면의 내용(미리보기 그림)이다. 아이콘은 lucide-react 와 같은 모양의 inline SVG 다.
 */

// ── resizable.tsx 의 상수와 같은 값 ─────────────────────────────────────

// 선 1px — 올리거나(마우스) 키보드 초점 · 누르는 동안 손잡이 표시와 같은 색
const LINE = [
  "group/resizable-handle relative z-[1] w-px shrink-0 self-stretch bg-stroke-neutral-weak",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[@media(hover:hover)]:hover:bg-stroke-neutral-solid has-[:focus-visible]:bg-stroke-neutral-solid data-[active]:bg-stroke-neutral-solid",
].join(" ");
// 누르는 폭 16 — 선 가운데로 양쪽 8. 키보드 포커스에만 둘레 링 2px · 모서리 4
const SEPARATOR = [
  "absolute inset-y-0 left-1/2 w-4 -translate-x-1/2 cursor-col-resize touch-none rounded-r1",
  "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-stroke-focus-ring",
].join(" ");
// 손잡이 표시 4 × 24 — 선 가운데(패널 높이의 가운데)
const GRIP = "pointer-events-none absolute left-1/2 top-1/2 h-6 w-1 -translate-x-1/2 -translate-y-1/2 rounded-r0_5 bg-stroke-neutral-solid";

// ── resizable.tsx 의 JSX 에 적힌 클래스 ────────────────────────────────

const GROUP = "flex h-full w-full";
const PANEL_LIST = "min-w-0 shrink-0 grow-0 overflow-hidden";
const PANEL_FILL = "min-w-0 flex-1 overflow-hidden";
// 위젯 모서리 손잡이 — 오른쪽 아래 누르는 24 × 24 · 표식 9 × 9(오른쪽 · 아래 두 변, 2px stroke-neutral-solid, 끝에서 6)
const WIDGET_HANDLE = "absolute bottom-0 right-0 z-[1] size-6 cursor-se-resize touch-none";
const WIDGET_MARK = "pointer-events-none absolute bottom-[6px] right-[6px] size-[9px] border-0 border-b-2 border-r-2 border-solid border-stroke-neutral-solid";

// ── menu.tsx · button.tsx 의 값 — 위젯 ⋮ 와 "크기" 메뉴(menu-examples.mjs 와 같다) ──

const MENU_CONTENT = [
  "z-(--z-floating) w-[200px] overflow-hidden rounded-r5 bg-bg-layer-floating font-sans text-fg-neutral shadow-[var(--shadow-s3)] outline-none",
  "origin-[var(--radix-dropdown-menu-content-transform-origin)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:[--tw-animation-duration:var(--motion-duration-d3)] data-[state=open]:ease-[var(--motion-ease-enter)] motion-safe:data-[state=open]:zoom-in-95",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:[--tw-animation-duration:var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)] motion-safe:data-[state=closed]:zoom-out-95",
].join(" ");
const MENU_SCROLL =
  "relative flex max-h-[min(480px,max(200px,var(--radix-dropdown-menu-content-available-height,200px)))] flex-col gap-x2 overflow-y-auto py-x2";
const MENU_GROUP =
  "flex flex-col [[data-slot=menu-group]+&]:before:mx-x4 [[data-slot=menu-group]+&]:before:mb-x2 [[data-slot=menu-group]+&]:before:h-px [[data-slot=menu-group]+&]:before:shrink-0 [[data-slot=menu-group]+&]:before:bg-stroke-neutral-subtle [[data-slot=menu-group]+&]:before:content-['']";
const MENU_ITEM = [
  "group/menu-item relative flex cursor-pointer select-none items-center px-x4 py-x2_5 outline-none scroll-my-x2",
  "after:pointer-events-none after:absolute after:inset-y-0 after:inset-x-x2 after:rounded-r3 after:content-['']",
  "focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-stroke-focus-ring",
  "data-[disabled]:cursor-not-allowed",
].join(" ");
const MENU_PILL =
  "pointer-events-none absolute inset-y-0 inset-x-0 rounded-r3 bg-transparent [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),inset_var(--motion-duration-color-transition)_var(--motion-ease-easing)]";
const MENU_PILL_ON =
  "group-hover/menu-item:inset-x-x2 group-hover/menu-item:bg-bg-layer-floating-pressed group-active/menu-item:inset-x-x2 group-active/menu-item:bg-bg-layer-floating-pressed";
const MENU_ITEM_CONTENT =
  "relative flex min-w-0 flex-1 items-center gap-x2 [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const MENU_ITEM_CONTENT_PRESS =
  "group-active/menu-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/menu-item:[scale:1]";
const MENU_GROUP_LABEL = "select-none px-x4 py-x2 text-t3 font-normal text-fg-neutral-subtle break-keep [overflow-wrap:break-word]";
const MENU_ITEM_BODY = "flex min-w-0 flex-1 flex-col items-start gap-x0_5 text-left break-keep [overflow-wrap:break-word]";
const MENU_ITEM_LABEL = "text-t4 font-normal";
const MENU_ITEM_DESCRIPTION = "text-t2 font-normal";
const MENU_FG = { neutral: "text-fg-neutral" };
const MENU_DESCRIPTION_COLOR = { enabled: "text-fg-neutral-subtle" };

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
  size: { medium: "h-10 rounded-r2 [--press-basis:40] [--progress-size:16px]" },
  layout: { withText: "", iconOnly: "" },
  ghostColor: { neutral: "" },
};
const BUTTON_COMPOUND = [{ size: "medium", layout: "iconOnly", className: "w-10 p-x2_5 [&_svg]:size-[18px]" }];
const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

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

// "disabled:bg-bg-disabled" → ["disabled", "bg-bg-disabled"] — 괄호 안의 ":" 는 가르지 않는다
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
// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다 — ghost 버튼의 disabled:bg-transparent 가 disabled:bg-bg-disabled 를 지운다
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

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const svg = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const ELLIPSIS_VERTICAL = '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>';

// <ResizablePanelGroup> + <ResizablePanel id defaultSize minSize maxSize> + <ResizableHandle label toggleSize> + <ResizablePanel>. size 는 지금 목록 폭(%).
// active 는 끄는 동안(data-active — 선이 짙다)을 멈춘 그림
function split({ listId, size = 25, min = 20, max = 40, label = "목록 너비", active = false, left, right, className = "" }) {
  const separator = attrs([
    'role="separator"',
    'tabindex="0"',
    `aria-label="${esc(label)}"`,
    'aria-orientation="vertical"',
    `aria-valuenow="${Math.round(size)}"`,
    `aria-valuemin="${min}"`,
    `aria-valuemax="${max}"`,
    `aria-valuetext="${Math.round(size)}%"`,
    `aria-controls="${listId}"`,
    'data-slot="resizable-separator"',
    `class="${SEPARATOR}"`,
  ]);
  const handle = `<div ${attrs(['data-slot="resizable-handle"', active && 'data-active=""', `class="${LINE}"`])}><div ${separator}><span aria-hidden="true" data-slot="resizable-grip" class="${GRIP}"></span></div></div>`;
  return `<div data-slot="resizable-panel-group" class="${[GROUP, className].filter(Boolean).join(" ")}"><div id="${listId}" data-slot="resizable-panel" data-panel="list" class="${PANEL_LIST}" style="flex-basis:${size}%">${left}</div>${handle}<div data-slot="resizable-panel" data-panel="fill" class="${PANEL_FILL}">${right}</div></div>`;
}

// <WidgetResizeHandle /> — react-grid-layout 이 resizeHandle 로 붙인다(react-resizable-handle-se 클래스 · 끄는 이벤트는 라이브러리 것)
const widgetHandle = () =>
  `<span aria-hidden="true" data-slot="widget-resize-handle" class="${WIDGET_HANDLE} react-resizable-handle react-resizable-handle-se"><span data-slot="widget-resize-mark" class="${WIDGET_MARK}"></span></span>`;

// <MenuItem label description> · <MenuGroup> + <MenuGroupLabel> · <MenuContent> — 열린 순간(Radix 가 붙이는 열림 · 자리 · 이름 잇기)
function menuItem({ label, description }) {
  const fg = MENU_FG.neutral;
  const row = attrs([
    'role="menuitem"',
    'data-slot="menu-item"',
    'data-tone="neutral"',
    `class="${MENU_ITEM}"`,
    'tabindex="-1"',
    'data-orientation="vertical"',
    'data-radix-collection-item=""',
  ]);
  const desc = description != null ? `<span data-slot="menu-item-description" class="${MENU_ITEM_DESCRIPTION} ${MENU_DESCRIPTION_COLOR.enabled}">${esc(description)}</span>` : "";
  return `<div ${row}><span aria-hidden="true" data-slot="menu-item-pill" class="${MENU_PILL} ${MENU_PILL_ON}"></span><span data-slot="menu-item-content" class="${MENU_ITEM_CONTENT} ${MENU_ITEM_CONTENT_PRESS}"><span class="${MENU_ITEM_BODY}"><span data-slot="menu-item-label" class="${MENU_ITEM_LABEL} ${fg}">${esc(label)}</span>${desc}</span></span></div>`;
}
function sizeMenu({ uid, triggerId, columns }) {
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
    `class="${MENU_CONTENT}"`,
    'style="outline:none; --radix-dropdown-menu-content-available-height:360px;"',
  ]);
  const items = SIZES.map((s) => menuItem({ label: s.label, description: columns === s.columns ? "지금 크기" : undefined })).join("");
  const group = `<div role="group" data-slot="menu-group" aria-labelledby="${uid}-label" class="${MENU_GROUP}"><div id="${uid}-label" data-slot="menu-group-label" class="${MENU_GROUP_LABEL}">크기</div>${items}</div>`;
  return `<div data-radix-popper-content-wrapper="" style="position:absolute; right:0; top:calc(100% + var(--spacing-x2)); min-width:max-content; z-index:var(--z-floating);"><div ${content}><div data-slot="menu-scroll" class="${MENU_SCROLL}">${group}</div></div></div>`;
}
// <Button variant="ghost" layout="iconOnly"> ⋮ — MenuTrigger asChild 가 Radix 의 속성과 data-slot 을 얹는다
const moreButton = ({ id, name, open = false, controls }) =>
  `<button ${attrs([
    'type="button"',
    `id="${id}"`,
    'aria-haspopup="menu"',
    `aria-expanded="${open}"`,
    open && `aria-controls="${controls}"`,
    `data-state="${open ? "open" : "closed"}"`,
    'data-slot="menu-trigger"',
    `class="${merge(buttonVariants({ variant: "ghost", layout: "iconOnly" }))}"`,
    `aria-label="${esc(name)}"`,
  ])}>${svg(ELLIPSIS_VERTICAL)}</button>`;

const SIZES = [
  { label: "작게 — 4칸", columns: 4 },
  { label: "보통 — 6칸", columns: 6 },
  { label: "넓게 — 8칸", columns: 8 },
  { label: "가득 — 12칸", columns: 12 },
];

// 화면의 내용(미리보기 그림) — 부서 나무(이름만) · 조직도 자리
const TEXT = "font-family:var(--font-sans); color:var(--color-fg-neutral);";
const DEPTS = ["포레스트 디지털혁신본부 클라우드 플랫폼 운영 그룹", "클라우드 인프라팀", "데이터 플랫폼팀", "경영지원팀", "프로젝트 1팀", "프로젝트 2팀"];
const treePane = () =>
  `<div style="${TEXT} padding:var(--spacing-x3) var(--spacing-x2);"><div style="padding:0 var(--spacing-x2) var(--spacing-x2); font-size:var(--text-t6); line-height:var(--text-t6--line-height); font-weight:700;">부서</div>${DEPTS.map(
    (d, i) =>
      `<div style="padding:var(--spacing-x3) var(--spacing-x2) var(--spacing-x3) calc(var(--spacing-x2) + ${i === 0 ? 0 : 20}px); border-radius:var(--radius-r2_5); font-size:var(--text-t4); line-height:var(--text-t4--line-height);${d === "경영지원팀" ? " background:var(--color-bg-neutral-weak-pressed);" : ""}">${esc(d)}</div>`,
  ).join("")}</div>`;
const chartPane = () =>
  `<div style="${TEXT} display:flex; flex-direction:column; gap:var(--spacing-x3); height:100%; padding:var(--spacing-x4) var(--spacing-x6);"><div style="font-size:var(--text-t6); line-height:var(--text-t6--line-height); font-weight:700;">경영지원팀 · 조직도</div><div style="display:flex; flex-wrap:wrap; gap:var(--spacing-x3);">${["팀장 김하늘", "이도윤", "박서연", "최민준"]
    .map((p) => `<span style="padding:var(--spacing-x2) var(--spacing-x3); border-radius:var(--radius-r2); background:var(--color-bg-layer-basement); font-size:var(--text-t4); line-height:var(--text-t4--line-height);">${esc(p)}</span>`)
    .join("")}</div></div>`;
// 데스크톱 화면 틀 — 768 이상(그림은 760 폭 · 높이 360). 좁으면 가로로 민다
const desk = (html, height = 360) =>
  `<div style="overflow-x:auto;"><div style="width:760px; height:${height}px; overflow:hidden; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-default);">${html}</div></div>`;
const CAPTION = "display:block; margin-top:var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="min-width:0;">${html}<span style="${CAPTION}">${esc(caption)}</span></div>`;

// 대시보드 편집 모드 — 12칸 격자(줄 72 · 사이 16)의 위젯(Card 면). 위젯 머리는 제목 + ⋮, 오른쪽 아래 모서리 손잡이
const GRID = "position:relative; display:grid; grid-template-columns:repeat(12, minmax(0, 1fr)); grid-auto-rows:72px; gap:var(--spacing-x4); padding:var(--spacing-x4); border-radius:var(--radius-r4); background:var(--color-bg-layer-basement); font-family:var(--font-sans);";
const WIDGET = "position:relative; display:flex; flex-direction:column; min-width:0; padding:var(--spacing-x4) var(--spacing-x2) var(--spacing-x4) var(--spacing-x5); border:1px solid var(--color-stroke-neutral-weak); border-radius:var(--radius-r4); background:var(--color-bg-layer-default); color:var(--color-fg-neutral);";
function widget({ uid, title, columns, rows = 2, area = "", body = "", menu = false, placeholder = false, resizing = false }) {
  const place = area ? `grid-area:${area};` : `grid-column:span ${columns}; grid-row:span ${rows};`;
  const cls = ["react-grid-item", resizing && "resizing", placeholder && "react-grid-placeholder"].filter(Boolean).join(" ");
  // 자리표시 — 놓일 칸(모양은 bridge CSS). 끄는 위젯은 그 위에 뜬다
  if (placeholder) return `<div class="${cls}" style="${place}"></div>`;
  const triggerId = `${uid}-trigger`;
  const menuId = `${uid}-menu`;
  const trigger = moreButton({ id: triggerId, name: `${title} 더보기`, open: menu, controls: menuId });
  const head = `<div style="display:flex; align-items:center; justify-content:space-between; gap:var(--spacing-x2);"><span style="font-size:var(--text-t5); line-height:var(--text-t5--line-height); font-weight:700;">${esc(title)}</span>${
    menu ? `<div style="position:relative; display:inline-flex; flex-shrink:0;">${trigger}${sizeMenu({ uid: menuId, triggerId, columns })}</div>` : trigger
  }</div>`;
  return `<div class="${cls}" style="${WIDGET} ${place}${menu || resizing ? " z-index:1;" : ""}">${head}<div style="margin-top:var(--spacing-x2); font-size:var(--text-t4); line-height:var(--text-t4--line-height); color:var(--color-fg-neutral-subtle);">${esc(body)}</div>${widgetHandle()}</div>`;
}

// ── 예제 ──────────────────────────────────────────────────────────────────

export const resizableExamples = [
  {
    title: "HR 관리 — 부서 나무 | 조직도",
    description:
      "HR 관리 > 역할 · 사용자 · 회사 · 부서 사용자는 목록 | 상세로 나뉘고, 그 사이 손잡이로 목록 폭을 바꾼다 — 768 이상에서만이다(768 미만은 목록 → 상세 · 탭). 목록은 기본 25%(1280 에서 본문 992 의 248)이고 20 ~ 40% 사이에서만 바뀐다 — 오른쪽 상세는 60% 아래로 줄지 않는다. 선은 1px stroke-neutral-weak(경계일 뿐), 가운데 손잡이 표시 4 × 24 stroke-neutral-solid(4.18 — 3 이상)가 끌 수 있는 자리를 알린다. 누르는 폭은 선 가운데로 양쪽 8 — 16 이고(768 이상 마우스 경계), 마우스를 올리거나 키보드 초점 · 끄는 동안 선 전체가 손잡이 표시와 같은 색으로 짙어진다. 손잡이는 role=\"separator\" · 이름 \"목록 너비\" · aria-valuenow 25 · min 20 · max 40 · aria-controls(목록 패널)이고, 끌지 않고 한 번 누르면(3px 안) 25 ↔ 40, ← → 5% · Home 20 · End 40 · Enter 25 ↔ 40 이다. 끌거나 바꾼 폭은 화면마다 브라우저에 기억한다(storageKey).",
    jsx: `import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

{/* 768 이상만 — 목록 20 ~ 40%(오른쪽은 60% 아래로 줄지 않는다), 화면마다 폭을 기억 */}
<ResizablePanelGroup storageKey="hr-admin-company">
  <ResizablePanel id="company-tree" defaultSize={25} minSize={20} maxSize={40}>
    {departmentTree}
  </ResizablePanel>
  <ResizableHandle label="목록 너비" toggleSize={40} />
  <ResizablePanel>{orgChart}</ResizablePanel>
</ResizablePanelGroup>`,
    render: () => desk(split({ listId: "rsz-ex-company-tree", size: 25, left: treePane(), right: chartPane() })),
  },

  {
    title: "HR 대시보드 — 위젯 ⋮ 의 크기",
    description:
      "대시보드 편집 모드에서 위젯의 크기를 바꾼다 — 오른쪽 아래 모서리 손잡이(누르는 24 × 24 · 표식 9 × 9 꺾쇠 2px stroke-neutral-solid · 끝에서 6)를 끌거나, 끌지 못하는 사람은 위젯 머리의 ⋮(Button ghost · iconOnly · medium — 보이는 40 · 누르는 44 · 이름 \"{위젯} 더보기\") → \"크기\" 에서 고른다(WCAG 2.5.7). 크기 줄은 \"작게 — 4칸\" 처럼 크기와 칸 수를 함께 쓰고, 누르면 바로 그 폭이다(높이는 그대로). 메뉴는 실행만이라 체크 · 라디오를 두지 않고 지금 크기 줄에 설명 \"지금 크기\" 를 단다. 크기 · 위치는 편집 모드에서만 바꾸고 저장 단추로 서버에 저장한다. 그림은 \"내 휴가\" 위젯(6칸)의 메뉴를 연 순간이다.",
    jsx: `import { EllipsisVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Menu, MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuTrigger } from "@/components/ui/menu"

<Menu>
  <MenuTrigger asChild>
    <Button variant="ghost" layout="iconOnly" aria-label={\`\${widget.title} 더보기\`}>
      <EllipsisVertical />
    </Button>
  </MenuTrigger>
  <MenuContent>
    <MenuGroup>
      <MenuGroupLabel>크기</MenuGroupLabel>
      {/* 끌지 않는 대안 — 누르면 바로 그 폭, 높이는 그대로. 메뉴는 실행만이라 체크가 없다 */}
      {[
        { label: "작게 — 4칸", columns: 4 },
        { label: "보통 — 6칸", columns: 6 },
        { label: "넓게 — 8칸", columns: 8 },
        { label: "가득 — 12칸", columns: 12 },
      ].map((size) => (
        <MenuItem
          key={size.columns}
          label={size.label}
          description={widget.columns === size.columns ? "지금 크기" : undefined}
          onSelect={() => resizeWidget(widget.id, size.columns)}
        />
      ))}
    </MenuGroup>
  </MenuContent>
</Menu>`,
    render: () =>
      `<div style="overflow-x:auto;"><div class="react-grid-layout" style="${GRID} width:760px; min-height:420px;">${widget({ uid: "rsz-ex-leave", title: "내 휴가", columns: 6, rows: 2, body: "남은 연차 8.5일 · 다음 휴가 10월 12일", menu: true })}${widget({
        uid: "rsz-ex-team",
        title: "팀 일정",
        columns: 6,
        rows: 2,
        body: "오늘 휴가 2명 · 외근 1명",
      })}${widget({ uid: "rsz-ex-notice", title: "공지", columns: 12, rows: 1, body: "10월 정기 점검은 18일(토) 밤 11시예요." })}</div></div>`,
  },

  {
    title: "목록 폭 — 20 · 25 · 40 · 끄는 동안",
    description:
      "목록 폭은 기본 25 에서 20(최소)과 40(최대) 사이로만 바뀐다 — 오른쪽 상세가 60% 아래로 줄지 않아 조직도 · 사용자 칸이 0폭이 되지 않는다(지금 회사 · 부서 사용자는 End 한 번에 0폭). ← → 는 5% 씩이고 끝에서 멈춘다(라이브러리 기본 10% 가 아니다). 끄는 동안(data-active)에는 선이 짙고, 화면 전체가 col-resize 커서이며 글을 고르지 않는다 — 폭은 포인터를 1:1 로 따라가고 놓으면 그 폭을 기억한다. 폭이 바뀌는 모션은 없다(키보드 · 누르기는 바로).",
    jsx: `{/* minSize · maxSize — 목록 20 ~ 40%(기본값과 같다) */}
<ResizablePanelGroup storageKey="hr-admin-role">
  <ResizablePanel id="role-list" defaultSize={25} minSize={20} maxSize={40}>{roleList}</ResizablePanel>
  <ResizableHandle label="목록 너비" />
  <ResizablePanel>{roleDetail}</ResizablePanel>
</ResizablePanelGroup>`,
    render: () =>
      `<div style="display:flex; flex-direction:column; gap:var(--spacing-x5);">${[
        [20, false, "최소 20% — ← · Home 으로 더 줄지 않는다"],
        [40, false, "최대 40% — 오른쪽 60% 를 남긴다(→ · End)"],
        [32, true, "끄는 동안 — data-active · 선이 짙다 · 1:1"],
      ]
        .map(([size, active, cap], i) => labeled(desk(split({ listId: `rsz-ex-range-${i}`, size, active, left: treePane(), right: chartPane() }), 260), cap))
        .join("")}</div>`,
  },

  {
    title: "모서리 손잡이 · 끄는 동안 자리표시",
    description:
      "위젯 모서리 손잡이는 마우스 · 터치용이라 보조 기술에 숨긴다(aria-hidden) — 끌지 않는 대안은 ⋮ 의 \"크기\" 다. 끄는 동안에는 놓일 칸에 자리표시(옅은 브랜드 바탕 bg-brand-weak + 1px 브랜드 점선 stroke-brand-solid · 모서리 16 — react-grid-layout 의 빨강 20% 를 덮는다)를 보이고, 끄는 위젯은 그림자 shadow-s3 · 모서리 16 으로 포인터를 따라온다(투명도는 그대로). 자리표시 · 따라오는 위젯의 모양은 bridge CSS 가 라이브러리 클래스(.react-grid-placeholder · .resizing)에 건다. 그림은 내 휴가 위젯을 8칸으로 끄는 순간이다.",
    jsx: `import ReactGridLayout from "react-grid-layout"
import { WidgetResizeHandle } from "@/components/ui/resizable"

{/* 편집 모드에서만 끈다 — 모서리 손잡이는 오른쪽 아래(se) 하나 */}
<ReactGridLayout
  layout={layout}
  cols={12}
  rowHeight={72}
  margin={[16, 16]}
  isResizable={editing}
  resizeHandles={["se"]}
  resizeHandle={<WidgetResizeHandle />}
  onLayoutChange={setLayout}
>
  {widgets.map((w) => <div key={w.id}>{renderWidget(w)}</div>)}
</ReactGridLayout>`,
    render: () =>
      `<div style="overflow-x:auto;"><div class="react-grid-layout" style="${GRID} width:760px;">${widget({ columns: 8, area: "1 / 1 / span 2 / span 8", placeholder: true })}${widget({
        uid: "rsz-ex-drag",
        title: "내 휴가",
        area: "1 / 1 / span 2 / span 7",
        body: "남은 연차 8.5일 · 다음 휴가 10월 12일",
        resizing: true,
      })}${widget({ uid: "rsz-ex-drag-team", title: "팀 일정", area: "1 / 9 / span 2 / span 4", body: "오늘 휴가 2명" })}</div></div>`,
  },
];
