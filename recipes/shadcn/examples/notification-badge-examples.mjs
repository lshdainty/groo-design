/*
 * shadcn Notification Badge 예제 — docs site components/notification-badge.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(상단 바 알림 — 점 · 숫자 — 몇 개인지 보여야 할 때)은 차례 · 제목 · 코드가
 * specs/components/notification-badge.md 의 "코드" 절과 같고, 뒤의 둘(크기와 자리 · 글에 붙을 때)은 md 의 Properties 를 코드로 더 보인다.
 * groo 에 처음 두는 컴포넌트다. 상단 바는 Top Navigation 의 아이콘 버튼(44 · 아이콘 24)이고 점만 둔다(2026-10-04) — 숫자는 본문의 아이콘 버튼에서 보인다.
 *
 * TARGET · NB_BASE · NB_VARIANTS · NB_COMPOUND · NB_DEFAULTS 는 recipes/shadcn/components/ui/notification-badge.tsx 의 상수 · cva(notificationBadgeVariants)와,
 * formatNotificationCount 는 그 파일의 함수와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 버튼 BUTTON_* 는 button.tsx 의 cva 와 같다
 * (button-examples.mjs 의 것과 같다 — 이 파일이 쓰는 ghost · medium · 아이콘만과 그에 걸리는 compound 만 옮겼다). 상단 바 TN_* 는
 * top-navigation.tsx 의 상수(ROOT · ROOT_LEFT · TEXT_T8 · TITLE · TITLE_TYPE · PRESS_TRANSITION · FOCUS_INSIDE · ICON_BUTTON)와 JSX 클래스(ROW · ACTIONS)와
 * 같다(top-navigation-examples.mjs 의 것과 같은 사본 — 이 파일이 쓰는 root 만 옮겼다).
 * 규칙은 specs/components/notification-badge.md, 수치 원본은 specs/components/notification-badge.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 붙을 대상을 감싼 <span data-slot="notification-badge-target"> > 대상(아이콘 · 글) + 점 · 숫자
 * <span aria-hidden data-slot="notification-badge" data-size>. 점 · 숫자는 보조 기술에 숨기고 이름은 붙은 버튼의 aria-label 에 넣는다.
 * 버튼 안의 아이콘 크기는 버튼이 정하고(상단 바 아이콘 버튼 24 · 본문의 Button medium 아이콘만 18), 자리는 그 아이콘 상자에서 잰다.
 * 버튼 밖의 아이콘은 lucide 기본 24 다. 상단 바 제목 <h1> 의 style 은 사이트의 `.content h1` 을 누르는 미리보기용 덧칠이다(H1_FIX — 클래스와 같은 값).
 * 레시피의 스크립트(누르는 순간 --press-basis 재기 · 알림 목록 열기)는 정적 HTML 에 없다 — 버튼을 눌러도 점 · 숫자가 그대로다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── notification-badge.tsx 의 상수 · cva 와 같은 값 ────────────────────────

// 붙을 대상 — 상자가 곧 아이콘 · 글의 상자다
const TARGET = "relative inline-flex";

// 점 · 숫자(notificationBadgeVariants) — 대상의 상자 위에 겹친다
const NB_BASE = "absolute";

const NB_VARIANTS = {
  size: {
    small: "size-x1_5 rounded-full bg-fg-brand",
    large: [
      "inline-flex min-h-x4_5 min-w-x4_5 items-center justify-center rounded-full bg-bg-brand-solid px-x1",
      "whitespace-nowrap font-sans text-t1-static font-bold text-static-white tabular-nums",
    ].join(" "),
  },
  attach: {
    icon: "",
    text: "left-[calc(100%+2px)] top-0",
  },
};

// 아이콘의 자리 — 점은 오른쪽 위 꼭짓점이 (아이콘 폭 − 1, 1), 숫자는 왼쪽 아래 꼭짓점이 (아이콘 폭 − 8, 14)
const NB_COMPOUND = [
  { size: "small", attach: "icon", className: "right-px top-px" },
  { size: "large", attach: "icon", className: "bottom-[calc(100%-14px)] left-[calc(100%-8px)]" },
];

const NB_DEFAULTS = { size: "small", attach: "icon" };

/** 숫자 표기 — 0 이하(소수는 버림)면 null(배지 없음), 100 이상이면 "99+". 앱과 같은 규칙 */
function formatNotificationCount(count) {
  const n = Math.floor(count);
  if (!(n > 0)) return null;
  return n >= 100 ? "99+" : String(n);
}

// ── button.tsx 의 cva 와 같은 값(ghost · medium · 아이콘만) ────────────────

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

// ── top-navigation.tsx 의 상수 · JSX 클래스와 같은 값 — 상단 바(root)와 아이콘 버튼(44 · 24) ──

const TN_ROOT = [
  "sticky top-0 z-(--z-sticky) w-full shrink-0 bg-bg-layer-default pt-[env(safe-area-inset-top)] font-sans text-fg-neutral",
  "pr-[calc(var(--spacing-x1_5)+env(safe-area-inset-right))]",
].join(" ");
const TN_ROOT_LEFT = { root: "pl-[calc(var(--spacing-x1_5)+env(safe-area-inset-left))]" };
const TN_TEXT_T8 =
  "text-[length:clamp(var(--text-t8-static),var(--text-t8),calc(var(--text-t8-static)*1.2))] leading-[clamp(var(--text-t8-static--line-height),var(--text-t8--line-height),calc(var(--text-t8-static--line-height)*1.2))]";
const TN_TITLE = [
  "m-0 min-w-0 flex-1 truncate font-bold text-fg-neutral",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
const TN_TITLE_TYPE = { root: `ml-[10px] ${TN_TEXT_T8}` };
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
const TN_ROW = "flex h-[56px] items-center";
const TN_ACTIONS = "ml-auto flex shrink-0 items-center pl-x2";

// ── cva 풀이 ──────────────────────────────────────────────────────────────

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

const notificationBadgeVariants = cvaOf(NB_BASE, { variants: NB_VARIANTS, compoundVariants: NB_COMPOUND, defaultVariants: NB_DEFAULTS });
const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 의 bell · search(24 격자) — 버튼 안이면 버튼이 18 로, 밖이면 lucide 기본 24 다
const svg = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const BELL = svg('<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>');
const SEARCH = svg('<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>');

// <NotificationBadge> — notification-badge.tsx 그대로. size small(visible) · large(count — 0 이하면 없음, 100 이상 "99+")
// hidden 은 감싼 대상까지 보조 기술에 숨길 때(aria-hidden — Top Navigation 의 아이콘 버튼이 그렇게 부른다)
function notificationBadge({ target, size = "small", attach = "icon", visible = true, count = 0, hidden = false }) {
  const label = size === "large" ? formatNotificationCount(count) : null;
  const shown = size === "large" ? label !== null : visible;
  const mark = shown
    ? `<span aria-hidden="true" data-slot="notification-badge" data-size="${size}" class="${notificationBadgeVariants({ size, attach })}">${label === null ? "" : esc(label)}</span>`
    : "";
  return `<span${hidden ? ' aria-hidden="true"' : ""} data-slot="notification-badge-target" class="${TARGET}">${target}${mark}</span>`;
}

// 알림 버튼 — Button ghost · 아이콘만(40 · 아이콘 18 · 누르는 영역 44). 이름에 알림을 넣는다(줄이지 않은 수)
function bellButton({ size = "small", visible = true, count = 0 }) {
  const name = size === "large" ? (count > 0 ? `알림, 새 알림 ${count}개` : "알림") : visible ? "알림, 새 알림 있음" : "알림";
  return `<button type="button" class="${buttonVariants({ variant: "ghost", layout: "iconOnly" })}" aria-label="${esc(name)}">${notificationBadge({ target: BELL, size, visible, count })}</button>`;
}

// <TopNavigation type="root"> + <TopNavigationIconButton notification> — top-navigation.tsx 그대로. 아이콘은 NotificationBadge(aria-hidden)로 감싼다
const H1_FIX =
  "margin:0 0 0 10px; letter-spacing:normal; font-size:clamp(var(--text-t8-static), var(--text-t8), calc(var(--text-t8-static) * 1.2)); line-height:clamp(var(--text-t8-static--line-height), var(--text-t8--line-height), calc(var(--text-t8-static--line-height) * 1.2));";
const topBarIconButton = ({ icon, name, notification = false }) =>
  `<button type="button" data-slot="top-navigation-icon-button" class="${TN_ICON_BUTTON}" aria-label="${esc(name)}">${notificationBadge({ target: icon, visible: notification, hidden: true })}</button>`;
const topBar = (title, buttons) =>
  `<header data-slot="top-navigation" data-type="root" class="${TN_ROOT} ${TN_ROOT_LEFT.root}"><div data-slot="top-navigation-row" class="${TN_ROW}"><h1 tabindex="-1" data-screen-title="" data-slot="top-navigation-title" class="${TN_TITLE} ${TN_TITLE_TYPE.root}" style="${H1_FIX}">${esc(title)}</h1><div data-slot="top-navigation-actions" class="${TN_ACTIONS}">${buttons.join("")}</div></div></header>`;
// 폰 화면 · 흰 표면 · 줄 · 이름표 — 미리보기 틀(레시피가 아니다)
const PHONE =
  "position:relative; isolation:isolate; overflow:hidden; width:100%; max-width:360px; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-default); font-family:var(--font-sans);";
const phone = (bar) => `<div style="${PHONE}">${bar}</div>`;
// 본문의 줄 — 이름 + 끝의 아이콘 버튼(Button ghost · 아이콘만 40 · 18)
const LINE =
  "display:flex; align-items:center; justify-content:space-between; gap:var(--spacing-x2); width:100%; max-width:360px; padding:var(--spacing-x2) var(--spacing-x2) var(--spacing-x2) var(--spacing-x5); box-sizing:border-box; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); font-family:var(--font-sans);";
const LINE_TITLE = "font-size:var(--text-t5); line-height:var(--text-t5--line-height); font-weight:700; color:var(--color-fg-neutral);";
const line = (title, buttons) => `<div style="${LINE}"><span style="${LINE_TITLE}">${esc(title)}</span><span style="display:flex; align-items:center; gap:var(--spacing-x1);">${buttons.join("")}</span></div>`;
const SURFACE =
  "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-x6); color:var(--color-fg-neutral); font-family:var(--font-sans);";
const surface = (html) => `<div style="${SURFACE}">${html}</div>`;
const stack = (items, gap = "var(--spacing-x5)") => `<div style="display:flex; flex-direction:column; gap:${gap};">${items.join("")}</div>`;
const row = (items, gap = "var(--spacing-x6)") => `<div style="display:flex; flex-wrap:wrap; align-items:flex-end; gap:var(--spacing-x5) ${gap};">${items.join("")}</div>`;
const CAPTION = "font-size:var(--text-t2); line-height:var(--text-t2--line-height); font-weight:400; color:var(--color-fg-neutral-subtle);";
const CODE = `${CAPTION} font-family:ui-monospace, SFMono-Regular, Menlo, monospace;`;
const labeled = (html, caption, style = CAPTION) =>
  `<div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--spacing-x2); min-width:0;">${html}<span style="${style}">${caption}</span></div>`;
// 24 아이콘 칸 — 아이콘 상자를 점선으로 보인다(자리를 재는 기준 — 미리보기 덧칠)
const icon24 = (html) => `<span style="display:inline-flex; padding-top:var(--spacing-x1); color:var(--color-fg-neutral);"><span style="display:inline-flex; outline:1px dashed var(--color-fg-disabled);">${html}</span></span>`;
const TEXT = "font-size:var(--text-t5); line-height:var(--text-t5--line-height); font-weight:500; color:var(--color-fg-neutral);";

// ── 예제 ──────────────────────────────────────────────────────────────────

export const notificationBadgeExamples = [
  {
    title: "상단 바 알림 — 점",
    description:
      "안 읽은 알림이 있다는 신호다 — 상단 바(Top Navigation)에는 점(size=\"small\")만 둔다. TopNavigationIconButton 의 notification 이 이 점을 붙인다. 점은 6 · 브랜드 글자색(fg-brand — 다크에서 밝은 짝)이고, 아이콘 상자의 오른쪽 위 안쪽 1 에 놓인다 — 자리는 버튼 상자(44)가 아니라 아이콘 상자(24)에서 잰다(x 17 ~ 23 · y 1 ~ 7). 점은 자리를 차지하지 않아 아이콘 · 버튼 크기가 그대로다. 점은 보조 기술에 숨기고(aria-hidden) 붙은 버튼의 이름에 넣는다 — \"알림, 새 알림 있음\". 사용자가 알림 목록을 열면 바로 지운다(notification={false}). 숫자 알약은 상단 바에 두지 않는다 — 아이콘 오른쪽으로 자라 맨 오른쪽 버튼에서 \"99+\" 가 화면 밖으로 나간다. 알림은 오류가 아니라 빨강을 쓰지 않는다.",
    jsx: `import { Bell } from "lucide-react"
import { TopNavigationIconButton } from "@/components/ui/top-navigation"

{/* 상단 바는 Top Navigation 의 아이콘 버튼(44 · 24) — notification 이 이 점(small)을 붙인다 */}
<TopNavigationIconButton notification={hasUnread} aria-label={hasUnread ? "알림, 새 알림 있음" : "알림"} onClick={openNotifications}>
  <Bell />
</TopNavigationIconButton>`,
    render: () =>
      stack([
        labeled(phone(topBar("홈", [topBarIconButton({ icon: SEARCH, name: "검색" }), topBarIconButton({ icon: BELL, name: "알림, 새 알림 있음", notification: true })])), "hasUnread — 이름 \"알림, 새 알림 있음\""),
        labeled(phone(topBar("홈", [topBarIconButton({ icon: SEARCH, name: "검색" }), topBarIconButton({ icon: BELL, name: "알림" })])), "목록을 열어 봤다 — 점이 사라지고 이름 \"알림\""),
      ]),
  },

  {
    title: "숫자 — 몇 개인지 보여야 할 때",
    description:
      "몇 개인지가 판단에 필요할 때만 숫자(size=\"large\")를 쓴다 — 상단 바가 아닌 자리(본문의 아이콘 버튼 · 하단 탭 바의 칸, 2칸까지)에서만이다. 알약 18 · 최소 폭 18 · 좌우 4, 브랜드 채움(bg-brand-solid) + 흰 숫자 11/15 · 700 · 숫자 폭 같게(tabular-nums). 숫자는 글자 크기 설정을 따르지 않는다(text-t1-static — 커지면 아이콘을 덮는다). 알약의 왼쪽 아래 꼭짓점이 (아이콘 폭 − 8, 14) 라 위로 4, 오른쪽으로 튀어나오고 숫자가 길수록 오른쪽으로 자란다 — 본문의 아이콘 버튼(Button ghost · 아이콘만 40 · 아이콘 18)이면 (10, 14)이고, 한 자리는 버튼 안, 두 자리 · \"99+\" 는 버튼 오른쪽 밖으로 나간다. 0 이면 배지가 없고 100 이상은 \"99+\" 지만, 버튼 이름에는 줄이지 않은 수를 넣는다(\"알림, 새 알림 128개\"). 수가 바뀌어도 소리로 알리지 않는다 — 버튼에 초점이 오면 새 이름을 읽는다.",
    jsx: `import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationBadge } from "@/components/ui/notification-badge"

<Button variant="ghost" layout="iconOnly" aria-label={unread > 0 ? \`알림, 새 알림 \${unread}개\` : "알림"} onClick={openNotifications}>
  <NotificationBadge size="large" count={unread}>
    <Bell />
  </NotificationBadge>
</Button>`,
    render: () =>
      stack([
        labeled(line("받은 결재", [bellButton({ size: "large", count: 3 })]), "unread = 3 — 이름 \"알림, 새 알림 3개\""),
        labeled(line("받은 결재", [bellButton({ size: "large", count: 128 })]), "unread = 128 — 알약은 \"99+\", 이름은 \"알림, 새 알림 128개\""),
        labeled(line("받은 결재", [bellButton({ size: "large", count: 0 })]), "unread = 0 — 배지 없음 · 이름 \"알림\""),
      ]),
  },

  {
    title: "크기와 자리 — 24 아이콘의 점 · 숫자",
    description:
      "자리는 붙는 대상의 상자에서 잰다 — 점선이 아이콘 상자다(24). 점은 위 1 · 오른쪽 1(x 17 ~ 23 · y 1 ~ 7), 숫자는 알약의 왼쪽 아래 꼭짓점이 (16, 14) — left 16 · top −4 다. 한 자리 숫자는 18 × 18, 두 자리 약 22, \"99+\" 약 32 로 폭만 숫자를 따른다. 크기 · 자리는 고정이다 — 화면마다 옮기지 않는다. 나타나고 사라질 때 모션이 없다. 숫자 표기는 formatNotificationCount(count) 로 앱과 맞춘다 — 0 이하 null(배지 없음) · 1 ~ 99 그대로 · 100 이상 \"99+\".",
    jsx: `import { Bell } from "lucide-react"
import { NotificationBadge, formatNotificationCount } from "@/components/ui/notification-badge"

<NotificationBadge><Bell /></NotificationBadge>                     {/* 점 */}
<NotificationBadge size="large" count={1}><Bell /></NotificationBadge>
<NotificationBadge size="large" count={12}><Bell /></NotificationBadge>
<NotificationBadge size="large" count={128}><Bell /></NotificationBadge>  {/* "99+" */}

formatNotificationCount(0)   // null — 배지 없음
formatNotificationCount(99)  // "99"
formatNotificationCount(100) // "99+"`,
    render: () =>
      surface(
        row([
          labeled(icon24(notificationBadge({ target: BELL, size: "large", count: 0 })), "0 — 없음", CODE),
          labeled(icon24(notificationBadge({ target: BELL })), "점 6", CODE),
          labeled(icon24(notificationBadge({ target: BELL, size: "large", count: 1 })), "1", CODE),
          labeled(icon24(notificationBadge({ target: BELL, size: "large", count: 12 })), "12", CODE),
          labeled(icon24(notificationBadge({ target: BELL, size: "large", count: 128 })), "128 → 99+", CODE),
        ]),
      ),
  },

  {
    title: "글에 붙을 때 — attach=\"text\"",
    description:
      "글에 붙으면 마지막 글자 뒤 2 · 글 줄 상자의 위 끝에 놓인다 — 점 · 알약 모두. 감싼 상자가 곧 글 줄 상자라 탭 · 칸의 폭과 줄 높이를 바꾸지 않는다. 탭 · Chip Tabs · Segmented Control 의 새 소식 점이 이것이다(값과 이름 \"새 소식\" 은 Tabs · Segmented Control 스펙) — 여러 탭에 동시에 달지 않는다. 늘 있는 개수(걸린 필터 2개 · 거래 3건)는 알림 배지가 아니다.",
    jsx: `<NotificationBadge attach="text">공지</NotificationBadge>
<NotificationBadge attach="text" size="large" count={2}>받은 결재</NotificationBadge>`,
    render: () =>
      surface(
        row([
          `<span style="${TEXT}">${notificationBadge({ target: "공지", attach: "text" })}</span>`,
          `<span style="${TEXT}">${notificationBadge({ target: "받은 결재", attach: "text", size: "large", count: 2 })}</span>`,
        ], "var(--spacing-x8)"),
      ),
  },
];
