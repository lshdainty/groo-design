/*
 * shadcn Top Navigation 예제 — docs site components/top-navigation.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 넷(탭 첫 화면 · 그 아래 화면 · 데스크톱 머리 · HR 폰)은 차례 · 제목 · 코드가
 * specs/components/top-navigation.md 의 "코드" 절과 같고, 뒤의 둘(✕ 독립 흐름 · 오른쪽 셋까지와 긴 제목)은 md 의 Properties · Guidelines 를
 * 코드로 더 보인다. porest 에 처음 두는 컴포넌트다.
 *
 * ROOT · ROOT_LEFT · TEXT_T8 · TEXT_T6 · TEXT_T5 · TITLE · TITLE_TYPE · PRESS_TRANSITION · FOCUS_INSIDE · ICON_BUTTON · TEXT_BUTTON · SEARCH ·
 * SCREEN_TITLE · SCREEN_TITLE_ROW · SCREEN_DESCRIPTION · SCREEN_ACTIONS 는 recipes/shadcn/components/ui/top-navigation.tsx 의 상수와, ROW · ACTIONS · PRIMARY 는
 * 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 검색칸 INPUT_* 는 input.tsx 의 cva(outline · medium 만)와
 * 같다 — input-examples.mjs 의 ROOT_* · AFFIX_* · VALUE_* · CLEAR 와 같은 글이다. 알림 점 NB_* 는 notification-badge.tsx(notification-badge-examples.mjs)의 것, 주 버튼
 * BUTTON_* 는 button.tsx 의 cva 와 같다 — 이 파일이 쓰는 변형 · 크기(brandSolid · neutralOutline · small)와 그에 걸리는 compound 만 옮겼다.
 * 규칙은 specs/components/top-navigation.md, 수치 원본은 specs/components/top-navigation.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 바 <header data-slot="top-navigation" data-type> > 줄 <div data-slot="top-navigation-row"> > 왼쪽 버튼 ·
 * 제목 <h1 tabindex="-1" data-screen-title data-slot="top-navigation-title"> · 오른쪽 자리 <div data-slot="top-navigation-actions"> >
 * 아이콘 버튼 <button data-slot="top-navigation-icon-button">(아이콘을 감싼 <span data-slot="notification-badge-target"> + 알림 점) · 글 버튼.
 * 데스크톱 머리는 제목 없이 왼쪽 검색칸 <div data-slot="top-navigation-search"> + 주 버튼 + 아이콘 버튼이고, 본문 맨 위 제목은 <h1 data-slot="screen-title"> —
 * 설명 · 버튼이 있으면 제목 줄 <div data-slot="screen-title-row"> 안이다. 검색 화면의 제목 자리는 검색칸 + 보이지 않는 <h1 class="sr-only"> 다.
 * 제목 <h1> 의 style 은 사이트의 `.content h1` 을 누르는 미리보기용 덧칠이다(H1_FIX — 클래스와 같은 값).
 * 레시피의 스크립트(← 의 들어온 화면 · 상위 화면 고르기 · ✕ 의 묻기 · 누르는 순간 --press-basis 재기 · 문서 제목)는 정적 HTML 에 없다 —
 * 버튼에 마우스를 올리면 바탕은 레시피 그대로 바뀌지만 아무 데로도 가지 않는다. 폰 화면 · 데스크톱 창 · 목록 줄은 미리보기 틀(레시피가 아니다)이고,
 * 바의 sticky 는 틀 안에서 스크롤해도 그 자리다. 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── top-navigation.tsx 의 상수와 같은 값 ─────────────────────────────────

// 바 — 위 안전 영역은 바탕만 채우고 내용은 그 아래 56 에. 좌우는 6(desktop 왼쪽은 32) + 그쪽 안전 영역
const ROOT = [
  "sticky top-0 z-(--z-sticky) w-full shrink-0 bg-bg-layer-default pt-[env(safe-area-inset-top)] font-sans text-fg-neutral",
  "pr-[calc(var(--spacing-x1_5)+env(safe-area-inset-right))]",
].join(" ");
const ROOT_LEFT = {
  root: "pl-[calc(var(--spacing-x1_5)+env(safe-area-inset-left))]",
  standard: "pl-[calc(var(--spacing-x1_5)+env(safe-area-inset-left))]",
  desktop: "pl-[calc(var(--layout-margin)+env(safe-area-inset-left))]",
};

// 글자 크기 설정은 1.2배까지 — clamp(고정 값, 설정을 따르는 값, 고정 값 × 1.2)
const TEXT_T8 =
  "text-[length:clamp(var(--text-t8-static),var(--text-t8),calc(var(--text-t8-static)*1.2))] leading-[clamp(var(--text-t8-static--line-height),var(--text-t8--line-height),calc(var(--text-t8-static--line-height)*1.2))]";
const TEXT_T6 =
  "text-[length:clamp(var(--text-t6-static),var(--text-t6),calc(var(--text-t6-static)*1.2))] leading-[clamp(var(--text-t6-static--line-height),var(--text-t6--line-height),calc(var(--text-t6-static--line-height)*1.2))]";
const TEXT_T5 =
  "text-[length:clamp(var(--text-t5-static),var(--text-t5),calc(var(--text-t5-static)*1.2))] leading-[clamp(var(--text-t5-static--line-height),var(--text-t5--line-height),calc(var(--text-t5-static--line-height)*1.2))]";

// 제목 — 한 줄 말줄임 · 700. root 는 화면 끝에서 16(바의 6 + 10), standard 는 ← 다음 6 = 화면 끝에서 56
const TITLE = [
  "m-0 min-w-0 flex-1 truncate font-bold text-fg-neutral",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
const TITLE_TYPE = {
  root: `ml-[10px] ${TEXT_T8}`,
  standard: `ml-x1_5 first:ml-[50px] ${TEXT_T6}`,
};

const PRESS_TRANSITION =
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const FOCUS_INSIDE = "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring";

// 아이콘 버튼 — 상자 44 = 누르는 영역 · 아이콘 24. 누르면 바탕 + 2px 거리 축소(44 → 0.955), 막히면 fg-disabled
const ICON_BUTTON = [
  "relative flex size-[44px] shrink-0 cursor-pointer items-center justify-center rounded-r2 border-0 bg-transparent p-0 text-fg-neutral",
  "[&_svg]:size-6 [&_svg]:shrink-0",
  // 켜고 끄는 단추(aria-pressed) — 끔 선 2 · 켬 선 2.5, 색은 그대로 fg-neutral(19B). aria-pressed 가 없는 버튼의 선은 건드리지 않는다
  "aria-[pressed=false]:[&_svg]:[stroke-width:2] aria-pressed:[&_svg]:[stroke-width:2.5]",
  PRESS_TRANSITION,
  "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/44)] motion-reduce:active:[scale:1]",
  FOCUS_INSIDE,
  "disabled:cursor-not-allowed disabled:bg-transparent disabled:text-fg-disabled disabled:[scale:1]",
].join(" ");

// 글 버튼 — 높이 44 · 좌우 10 · t5 · 500. 누르는 순간 기준 max(44, 폭 ÷ 4, 24) 를 잰다
const TEXT_BUTTON = [
  "relative flex h-[44px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-r2 border-0 bg-transparent px-x2_5 font-sans font-medium text-fg-neutral",
  TEXT_T5,
  PRESS_TRANSITION,
  "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/var(--press-basis,44))] motion-reduce:active:[scale:1]",
  FOCUS_INSIDE,
  "disabled:cursor-not-allowed disabled:bg-transparent disabled:text-fg-disabled disabled:[scale:1]",
].join(" ");

// ── top-navigation.tsx 의 JSX 에 적힌 클래스 ──────────────────────────────

// 줄 — 높이 56
const ROW = "flex h-[56px] items-center";
// 오른쪽 자리 — 제목 끝 ↔ 첫 버튼 상자 8(SEED titleMinGap), 버튼끼리 붙는다
const ACTIONS = "ml-auto flex shrink-0 items-center pl-x2";
// 데스크톱 머리의 주 버튼 — Button brandSolid small + 첫 아이콘 버튼 상자와 8
const PRIMARY = "mr-x2";

// ── top-navigation.tsx 의 상수와 같은 값 — 검색칸 자리 · 화면 제목 줄 ──────────

// 검색칸 자리 — standard 는 제목 자리(← 다음 6), desktop 은 머리 왼쪽 360
const SEARCH = {
  standard: "ml-x1_5 first:ml-[50px] flex min-w-0 flex-1 items-center",
  desktop: "flex w-[360px] min-w-0 shrink items-center",
};
// 본문 맨 위 제목(ScreenTitle) — 홀로 서면 cn(SCREEN_TITLE, "mt-nav-to-title", FOCUS_INSIDE), 제목 줄 안에서는 cn(SCREEN_TITLE, FOCUS_INSIDE)
const SCREEN_TITLE = "m-0 font-sans text-screen-title font-bold text-fg-neutral";
const SCREEN_TITLE_ROW = "mt-nav-to-title flex items-end gap-x4";
const SCREEN_DESCRIPTION = "m-0 mt-x0_5 text-t3 font-normal text-fg-neutral-subtle break-keep [overflow-wrap:break-word]";
const SCREEN_ACTIONS = "flex shrink-0 flex-wrap items-center justify-end gap-x2";

// ── input.tsx 의 cva 와 같은 값 — 검색칸(outline · medium)만 ──────────────────

const INPUT_ROOT_BASE = [
  "relative flex w-full min-w-0 items-center overflow-hidden bg-transparent font-sans",
  "cursor-text data-[disabled]:cursor-not-allowed",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-solid after:border-transparent after:content-['']",
  "after:[transition:border-color_var(--motion-duration-d2)_var(--motion-ease-easing)]",
  "[&:has(input:focus):not([data-invalid]):not([data-readonly])]:after:border-stroke-neutral-contrast",
  "data-[invalid]:after:border-stroke-critical-solid",
].join(" ");
const INPUT_ROOT_OUTLINE = "shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] after:border-2 data-[disabled]:bg-bg-disabled data-[readonly]:bg-bg-disabled";
const INPUT_ROOT_OUTLINE_MEDIUM = "min-h-10 gap-x2 rounded-r2 text-t4 [--text-input-px:var(--spacing-x3_5)] [--text-input-icon:16px] [--text-input-clear:18px]";
const INPUT_AFFIX_EDGE = "first:ml-[var(--text-input-px)] last:mr-[var(--text-input-px)]";
const INPUT_AFFIX_ICON = "flex shrink-0 [&>svg]:size-[var(--text-input-icon)]";
const INPUT_ICON_COLOR = "text-fg-neutral-muted";
const INPUT_VALUE_BASE = [
  "min-w-0 flex-1 self-stretch border-0 bg-transparent p-0 caret-fg-neutral outline-none [font:inherit]",
  "first:pl-[var(--text-input-px)] last:pr-[var(--text-input-px)] disabled:cursor-not-allowed",
  "[&:-webkit-autofill]:bg-clip-text [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-fg-neutral)] [&:-webkit-autofill]:[transition:background-color_9999s_9999s]",
].join(" ");
const INPUT_VALUE_COLOR = "text-fg-neutral placeholder:text-fg-placeholder";
const INPUT_CLEAR = [
  "relative flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-fg-neutral-subtle",
  "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[&>svg]:size-[var(--text-input-clear)]",
].join(" ");

// ── notification-badge.tsx 의 상수 · cva 와 같은 값 — 점(small · icon)만 ───────

const NB_TARGET = "relative inline-flex";
const NB_BASE = "absolute";
const NB_VARIANTS = {
  size: { small: "size-x1_5 rounded-full bg-fg-brand" },
  attach: { icon: "" },
};
const NB_COMPOUND = [{ size: "small", attach: "icon", className: "right-px top-px" }];
const NB_DEFAULTS = { size: "small", attach: "icon" };

// ── button.tsx 의 cva 와 같은 값 — 주 버튼(brandSolid · small · 글) ────────────

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
    brandSolid:
      "bg-bg-brand-solid text-static-white hover:bg-bg-brand-solid-pressed active:bg-bg-brand-solid-pressed aria-busy:bg-bg-brand-solid-pressed [--progress-track:color-mix(in_srgb,var(--color-static-white)_30%,transparent)] [--progress-range:var(--color-static-white)]",
    neutralOutline:
      "border border-stroke-neutral-weak bg-transparent text-fg-neutral hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed aria-busy:bg-transparent disabled:bg-transparent [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
  },
  size: {
    small: "h-9 rounded-r2 [--press-basis:36] [--progress-size:14px]",
  },
  layout: { withText: "" },
  ghostColor: { neutral: "" },
};
const BUTTON_COMPOUND = [{ size: "small", layout: "withText", className: "px-x3_5 py-x2 gap-x1 text-t4 [&_svg]:size-3.5" }];
const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// ── cva 풀이 ─────────────────────────────────────────────────────────────

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

const notificationBadgeVariants = cvaOf(NB_BASE, { variants: NB_VARIANTS, compoundVariants: NB_COMPOUND, defaultVariants: NB_DEFAULTS });
const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 와 같은 모양(24 격자) — 크기는 놓인 자리가 정한다(아이콘 버튼 24 · 주 버튼 14)
const svg = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const ICONS = {
  chevronLeft: svg('<path d="m15 18-6-6 6-6"/>'),
  x: svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  menu: svg('<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>'),
  search: svg('<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>'),
  bell: svg('<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>'),
  settings: svg('<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>'),
  plus: svg('<path d="M5 12h14"/><path d="M12 5v14"/>'),
  share: svg('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>'),
  ellipsis: svg('<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>'),
  sliders: svg('<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>'),
  filter: svg('<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>'),
  download: svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>'),
  circleX: svg('<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>'),
};

// <TopNavigation type> — 바 + 줄
const topNavigation = (type, inner) =>
  `<header data-slot="top-navigation" data-type="${type}" class="${ROOT} ${ROOT_LEFT[type]}"><div data-slot="top-navigation-row" class="${ROW}">${inner}</div></header>`;
// 사이트의 `.content h1`(크기 · 줄 높이 · 자간 · 바깥 여백)은 층(@layer) 밖 규칙이라 Tailwind utility(@layer utilities)를 늘 이긴다 —
// 제목 <h1> 에는 클래스가 정한 값을 style 로 한 번 더 적는다(레시피에는 없는 미리보기용 덧칠). standard 는 ← 다음 제목의 자리(6)다
const clampText = (t) =>
  `font-size:clamp(var(--text-${t}-static), var(--text-${t}), calc(var(--text-${t}-static) * 1.2)); line-height:clamp(var(--text-${t}-static--line-height), var(--text-${t}--line-height), calc(var(--text-${t}-static--line-height) * 1.2));`;
const H1_FIX = {
  root: `margin:0 0 0 10px; letter-spacing:normal; ${clampText("t8")}`,
  standard: `margin:0 0 0 var(--spacing-x1_5); letter-spacing:normal; ${clampText("t6")}`,
  screen: "margin:var(--spacing-nav-to-title) 0 0; letter-spacing:normal; font-size:var(--text-screen-title); line-height:var(--text-screen-title--line-height);",
  row: "margin:0; letter-spacing:normal; font-size:var(--text-screen-title); line-height:var(--text-screen-title--line-height);",
};
// <TopNavigationTitle> — root · standard
const title = (type, text) =>
  `<h1 tabindex="-1" data-screen-title="" data-slot="top-navigation-title" class="${TITLE} ${TITLE_TYPE[type]}" style="${H1_FIX[type]}">${esc(text)}</h1>`;
const actions = (inner) => `<div data-slot="top-navigation-actions" class="${ACTIONS}">${inner}</div>`;
// <TopNavigationIconButton> — 아이콘은 NotificationBadge(aria-hidden)로 감싸고 notification 이면 점을 붙인다. extra 는 왼쪽 버튼의 이름 · 속성
function iconButton({ icon, name, notification = false, extra = [], slot = "top-navigation-icon-button", disabled = false }) {
  const dot = notification ? `<span aria-hidden="true" data-slot="notification-badge" data-size="small" class="${notificationBadgeVariants()}"></span>` : "";
  return `<button ${attrs([
    'type="button"',
    `data-slot="${slot}"`,
    `class="${ICON_BUTTON}"`,
    `aria-label="${esc(name)}"`,
    ...extra,
    disabled && "disabled",
  ])}><span aria-hidden="true" data-slot="notification-badge-target" class="${NB_TARGET}">${ICONS[icon]}${dot}</span></button>`;
}
const textButton = (label, disabled = false) =>
  `<button ${attrs(['type="button"', 'data-slot="top-navigation-text-button"', `class="${TEXT_BUTTON}"`, disabled && "disabled"])}>${esc(label)}</button>`;
const primaryButton = (label) =>
  `<button class="${buttonVariants({ variant: "brandSolid", size: "small" })} ${PRIMARY}" data-slot="top-navigation-primary-button">${ICONS.plus}${esc(label)}</button>`;
// <Input size="medium" prefixIcon={<Search />} clearable> — 상자 · 앞 돋보기 · 입력 · (값이 있으면) 지우기
function searchInput({ value = "", placeholder = "거래 검색", ariaLabel = "거래 검색" } = {}) {
  const clear = value
    ? `<button type="button" aria-label="지우기" tabindex="-1" data-slot="text-input-clear" class="${INPUT_CLEAR} ${INPUT_AFFIX_EDGE}">${ICONS.circleX}</button>`
    : "";
  return `<div data-slot="text-input" data-variant="outline" data-size="medium" class="${INPUT_ROOT_BASE} ${INPUT_ROOT_OUTLINE} ${INPUT_ROOT_OUTLINE_MEDIUM}"><span data-slot="text-input-prefix-icon" aria-hidden="true" class="${INPUT_AFFIX_ICON} ${INPUT_AFFIX_EDGE} ${INPUT_ICON_COLOR}">${ICONS.search}</span><input type="text" data-slot="text-input-value" class="${INPUT_VALUE_BASE} ${INPUT_VALUE_COLOR}" placeholder="${esc(placeholder)}"${value ? ` value="${esc(value)}"` : ""} aria-label="${esc(ariaLabel)}">${clear}</div>`;
}
// <TopNavigationSearch> — standard 는 보이지 않는 h1 "검색" 을 앞에 둔다
const search = (type, inner) =>
  `<div data-slot="top-navigation-search" class="${SEARCH[type]}">${type === "standard" ? '<h1 tabindex="-1" data-screen-title="" data-slot="top-navigation-search-title" class="sr-only">검색</h1>' : ""}${inner}</div>`;
// Button neutralOutline small(아이콘 + 글) — 화면 제목 줄의 동작(neutralWeak 는 본문 바탕과 같은 gray-200 이라 묻힌다)
const smallButton = (icon, label) => `<button type="button" class="${buttonVariants({ variant: "neutralOutline", size: "small" })}">${ICONS[icon]}${esc(label)}</button>`;
// <ScreenTitle description actions> — 제목 줄
const screenTitleRow = (text, description, buttons) =>
  `<div data-slot="screen-title-row" class="${SCREEN_TITLE_ROW}"><div class="min-w-0 flex-1"><h1 tabindex="-1" data-screen-title="" data-slot="screen-title" class="${SCREEN_TITLE} ${FOCUS_INSIDE}" style="${H1_FIX.row}">${esc(text)}</h1><p data-slot="screen-title-description" class="${SCREEN_DESCRIPTION}">${esc(description)}</p></div><div data-slot="screen-title-actions" class="${SCREEN_ACTIONS}">${buttons}</div></div>`;

// 폰 화면 · 데스크톱 창 · 목록 줄 — 미리보기 틀(레시피가 아니다). 폰은 360 까지, 바 아래 몸만 스크롤된다
const PHONE =
  "position:relative; isolation:isolate; display:flex; flex-direction:column; width:100%; max-width:360px; overflow:hidden; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-default); font-family:var(--font-sans);";
const BODY = "flex:1 1 auto; min-height:0; overflow-y:auto;";
const ROW_TEXT =
  "display:flex; justify-content:space-between; gap:var(--spacing-x3); padding:var(--spacing-x3) var(--spacing-global-gutter); font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const ROW_DETAIL = "display:block; font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle);";
const rows = (list) =>
  list.map(([t, d, v]) => `<div style="${ROW_TEXT}"><span>${esc(t)}${d ? `<span style="${ROW_DETAIL}">${esc(d)}</span>` : ""}</span>${v ? `<b>${esc(v)}</b>` : ""}</div>`).join("");
const phone = (bar, list, height = 260) => `<div style="${PHONE} height:${height}px;">${bar}<div style="${BODY}">${rows(list)}</div></div>`;
const LEDGER = [
  ["김밥천국", "식비 · 현대카드 M", "8,000원"],
  ["버스", "교통 · 현대카드 M", "1,500원"],
  ["다이소", "쇼핑 · 현대카드 M", "12,300원"],
  ["월급", "수입 · 국민 주계좌", "3,200,000원"],
];
const ALERTS = [
  ["카드 결제 예정", "현대카드 M · 10월 15일", "184,000원"],
  ["예산 80% 사용", "식비 · 10월", ""],
  ["자동 이체 완료", "관리비 · 국민 주계좌", "184,000원"],
];
const LEAVE = [
  ["연차", "10월 12일 (월) ~ 14일 (수)", "승인 대기"],
  ["반차(오전)", "9월 30일 (수)", "승인"],
  ["병가", "9월 8일 (화)", "승인"],
];
const DESK =
  "position:relative; isolation:isolate; display:flex; flex-direction:column; width:100%; min-width:480px; height:300px; overflow:hidden; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-basement); font-family:var(--font-sans);";
const CARD = "margin-top:var(--spacing-x4); padding:var(--spacing-x2) 0; border-radius:var(--radius-r4); background:var(--color-bg-layer-default);";
const CAPTION = "display:block; margin-top:var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;
const grid = (items) =>
  `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap:var(--spacing-x6) var(--spacing-x4); align-items:start;">${items.join("")}</div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const topNavigationExamples = [
  {
    title: "탭 첫 화면 — Root",
    description:
      "하단 탭의 첫 화면(홈 · 가계부 · 캘린더 · 전체)은 type=\"root\" 다 — 왼쪽 큰 제목(t8 22/30 · 700, 화면 끝에서 16)이고 뒤로 버튼이 없다. 바는 높이 56 · 불투명 bg-layer-default 이고 맨 위에 붙어(sticky · z-sticky 50) 스크롤해도 그 자리에 있으며, 목록이 그 밑으로 지나가도 선 · 그림자를 긋지 않는다. 오른쪽 아이콘 버튼은 상자 44 가 곧 누르는 영역이고 아이콘은 24 다 — 맨 끝 상자가 화면 끝에서 6, 버튼끼리 붙는다. 벨의 알림 점은 Notification Badge small(점 6 · fg-brand — 24 아이콘 상자의 x 17 ~ 23 · y 1 ~ 7)이고, 상단 바에는 점만 둔다 — 새 알림이 있는지는 버튼 이름에도 넣는다(\"알림, 새 알림 있음\"). Desk 탭 첫 화면의 오른쪽은 홈 = 검색 · 알림, 가계부 · 캘린더 · 전체 = 검색이다 — 검색은 어느 탭에서나 같은 거래 검색 화면, 벨은 알림 화면으로 간다. 금액 가리기는 머리에 두지 않는다(순자산 카드의 눈). 미리보기의 목록은 실제로 스크롤된다.",
    jsx: `import { Bell, Search } from "lucide-react"
import { TopNavigation, TopNavigationActions, TopNavigationIconButton, TopNavigationTitle } from "@/components/ui/top-navigation"

<TopNavigation type="root">
  <TopNavigationTitle>홈</TopNavigationTitle>
  <TopNavigationActions>
    <TopNavigationIconButton aria-label="검색" onClick={openSearch}><Search /></TopNavigationIconButton>
    {/* 점은 이름에도 넣는다 — 소리로 알 수 있게 */}
    <TopNavigationIconButton notification={hasUnread} aria-label={hasUnread ? "알림, 새 알림 있음" : "알림"} onClick={openNotifications}>
      <Bell />
    </TopNavigationIconButton>
  </TopNavigationActions>
</TopNavigation>`,
    render: () =>
      phone(
        topNavigation("root", `${title("root", "홈")}${actions(`${iconButton({ icon: "search", name: "검색" })}${iconButton({ icon: "bell", name: "알림, 새 알림 있음", notification: true })}`)}`),
        [...LEDGER, ...LEDGER],
      ),
  },

  {
    title: "그 아래 화면 — ← · 제목 · 글 버튼",
    description:
      "탭 첫 화면에서 들어간 화면은 type=\"standard\"(기본)다 — 왼쪽 버튼(← 이름 \"뒤로\") 다음 제목(t6 18/24 · 700, 화면 끝에서 56 = 6 + 44 + 6)이다. 제목은 늘 왼쪽 · 한 줄이고 오른쪽 자리 앞 8 을 늘 비운다. ← 는 사용자가 실제로 지나온 화면으로 돌아가고(History — 웹 history.back() · 앱 pop), 주소로 바로 들어왔거나 앞 화면이 없으면 fallbackHref(그 화면의 상위 화면)로 지금 주소를 고쳐 간다(replace) — 늘 같은 화면으로 새로 이동하지 않는다. 오른쪽에는 글 버튼 하나(\"모두 읽음\" — 높이 44 · 좌우 10 · 16/22 · 500)를 둔다 — 아이콘 버튼과 섞지 않는다. 막힌 글 버튼은 fg-disabled 이고 흐리게 하지 않는다(오른쪽 — 안 읽은 알림이 없을 때).",
    jsx: `import { TopNavigation, TopNavigationActions, TopNavigationBackButton, TopNavigationTextButton, TopNavigationTitle } from "@/components/ui/top-navigation"

{/* 앞 화면이 없으면(주소로 바로 들어옴) 상위 화면 /desk 로 — 주소를 고쳐 쓴다 */}
<TopNavigation>
  <TopNavigationBackButton fallbackHref="/desk" />
  <TopNavigationTitle>알림</TopNavigationTitle>
  <TopNavigationActions>
    <TopNavigationTextButton onClick={markAllRead} disabled={!hasUnread}>모두 읽음</TopNavigationTextButton>
  </TopNavigationActions>
</TopNavigation>`,
    render: () =>
      grid([
        labeled(
          phone(topNavigation("standard", `${iconButton({ icon: "chevronLeft", name: "뒤로", slot: "top-navigation-back-button" })}${title("standard", "알림")}${actions(textButton("모두 읽음"))}`), ALERTS, 220),
          "hasUnread — 모두 읽음",
        ),
        labeled(
          phone(topNavigation("standard", `${iconButton({ icon: "chevronLeft", name: "뒤로", slot: "top-navigation-back-button" })}${title("standard", "알림")}${actions(textButton("모두 읽음", true))}`), ALERTS, 220),
          "다 읽음 — 글 버튼 막힘(fg-disabled)",
        ),
      ]),
  },

  {
    title: "거래 검색 화면 — 제목 자리 검색칸",
    description:
      "거래 검색 화면은 standard 다 — ← · 제목 자리의 검색칸(TopNavigationSearch) · 오른쪽 고급 필터 아이콘 버튼 하나. 검색칸은 Input outline medium 40(앞 돋보기 16 · 지우기 18)이고, 바 56 안이라 폰에서도 medium 이다(Text Field 의 '1280 이상' 규칙의 예외). ← 다음 6 에서 시작해 오른쪽 자리 앞 8 까지 늘어나고, 화면 이름 대신 칸이 서므로 보이지 않는 h1 \"검색\" 을 TopNavigationSearch 가 둔다(SEED — Standard 는 Title 영역을 Slot 으로). 검색칸 아래 거르는 줄(전체 · 지출 · 수입 칩 — 줄 40)은 바 아래 스크롤 상자 맨 위의 Scroll Auto Hide 다 — 목록을 내리면 숨고, 올려서 반 넘게 나오면 다 드러난다(2026-10-16 사용자 결정 Q-017-5 C). 웹의 거래 검색 화면도 같은 화면이다(Q-017-3a C). 미리보기는 바만 레시피 그대로이고 목록은 틀이다.",
    jsx: `import { Bell, Search } from "lucide-react"
import { TopNavigation, TopNavigationActions, TopNavigationIconButton, TopNavigationTitle } from "@/components/ui/top-navigation"

<TopNavigation type="root">
  <TopNavigationTitle>홈</TopNavigationTitle>
  <TopNavigationActions>
    <TopNavigationIconButton aria-label="검색" onClick={openSearch}><Search /></TopNavigationIconButton>
    {/* 점은 이름에도 넣는다 — 소리로 알 수 있게 */}
    <TopNavigationIconButton notification={hasUnread} aria-label={hasUnread ? "알림, 새 알림 있음" : "알림"} onClick={openNotifications}>
      <Bell />
    </TopNavigationIconButton>
  </TopNavigationActions>
</TopNavigation>`,
    render: () =>
      phone(
        topNavigation(
          "standard",
          `${iconButton({ icon: "chevronLeft", name: "뒤로", slot: "top-navigation-back-button" })}${search("standard", searchInput({ value: "지어낸마트" }))}${actions(iconButton({ icon: "sliders", name: "고급 필터", extra: ['aria-haspopup="dialog"'] }))}`,
        ),
        [["지어낸마트 장보기", "식비 · 10월 3일", "−42,300원"], ["지어낸마트 환불", "식비 · 10월 5일", "+12,000원"], ["지어낸마트 정기 배송", "생활 · 10월 9일", "−18,900원"]],
        220,
      ),
  },

  {
    title: "데스크톱 머리 — Desk",
    description:
      "768 이상의 Desk 웹은 사이드바 오른쪽 · 본문 위에 type=\"desktop\" 머리를 둔다 — 높이 56 · 선 없음, 왼쪽은 본문 여백 32 에서 시작하는 검색칸(TopNavigationSearch — 폭 360, 거래 검색 화면의 입구)이고 맨 끝 아이콘 버튼의 상자는 화면 끝에서 6 이다(폰과 같은 규칙). 오른쪽은 주 버튼 하나(TopNavigationPrimaryButton — Button brandSolid small 36 그대로 + 첫 아이콘 버튼과 8)와 아이콘 버튼 둘(알림 · 설정)이다 — 금액 가리기 눈은 머리에 두지 않는다(2026-10-16 사용자 결정 Q-017-3c = Q-018-3 B, 순자산 카드의 눈이 맡는다). 벨은 1280 이상 벨 아래 Popover · 768 ~ 1279 Bottom Sheet 로 알림 목록을 연다(Q-017-3b B). 머리에는 제목을 두지 않는다 — 화면 제목은 본문 맨 위 ScreenTitle(h1 · text-screen-title 26/35 · 700, 머리 아래 spacing-nav-to-title 20)이고, description · actions 를 주면 한 줄 제목 줄이다 — 제목 · 설명(t3 · fg-neutral-subtle) 왼쪽, 동작 버튼(Button small · 사이 8) 오른쪽이고 버튼은 제목 덩어리 아래 끝에 맞춘다(Q-018-2 A). 머리는 header 라 main 밖에 둔다. HR 은 데스크톱 머리를 두지 않는다. 미리보기는 사이드바를 뺀 머리 · 본문이다.",
    jsx: `import { Bell, Download, Filter, Plus, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScreenTitle, TopNavigation, TopNavigationActions, TopNavigationIconButton, TopNavigationPrimaryButton, TopNavigationSearch } from "@/components/ui/top-navigation"

<TopNavigation type="desktop">
  {/* 왼쪽 — 거래 검색의 입구(폭 360). Enter 로 거래 검색 화면에 간다 */}
  <TopNavigationSearch>
    <Input size="medium" prefixIcon={<Search />} clearable aria-label="거래 검색" placeholder="거래 검색" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && openSearch(query)} />
  </TopNavigationSearch>
  <TopNavigationActions>
    <TopNavigationPrimaryButton onClick={openAddTransaction}><Plus />내역 추가</TopNavigationPrimaryButton>
    {/* 벨 — 1280 이상 Popover · 768 ~ 1279 Bottom Sheet 의 알림 목록(popover.md 의 코드). 금액 가리기 눈은 머리에 두지 않는다 */}
    <TopNavigationIconButton notification={hasUnread} aria-label={hasUnread ? "알림, 새 알림 있음" : "알림"} aria-haspopup="dialog" aria-expanded={notificationsOpen} onClick={toggleNotifications}><Bell /></TopNavigationIconButton>
    <TopNavigationIconButton aria-label="설정" onClick={openSettings}><Settings /></TopNavigationIconButton>
  </TopNavigationActions>
</TopNavigation>
<main id="main">
  {/* 제목 줄 — 제목 · 설명 왼쪽, 그 화면의 동작 버튼(small) 오른쪽 */}
  <ScreenTitle
    description="모든 거래 내역"
    actions={
      <>
        <Button variant="neutralOutline" size="small" onClick={openFilters}><Filter />필터 · 3</Button>
        <Button variant="neutralOutline" size="small" onClick={exportLedger}><Download />내보내기</Button>
      </>
    }
  >
    가계부
  </ScreenTitle>
  …
</main>`,
    render: () =>
      `<div style="max-width:100%; overflow-x:auto;"><div style="${DESK} min-width:720px;">${topNavigation(
        "desktop",
        `${search("desktop", searchInput())}${actions(`${primaryButton("내역 추가")}${iconButton({ icon: "bell", name: "알림, 새 알림 있음", notification: true, extra: ['aria-haspopup="dialog"', 'aria-expanded="false"'] })}${iconButton({ icon: "settings", name: "설정" })}`)}`,
      )}<div style="padding:0 var(--layout-margin);">${screenTitleRow("가계부", "모든 거래 내역", `${smallButton("filter", "필터 · 3")}${smallButton("download", "내보내기")}`)}<div style="${CARD}">${rows(LEDGER.slice(0, 3))}</div></div></div></div>`,
  },

  {
    title: "HR 폰 — ☰ 로 주 메뉴",
    description:
      "HR 웹 768 미만은 하단 탭 바가 없다 — 모든 화면이 standard 이고 왼쪽에 ☰(TopNavigationMenuButton — 이름 \"주 메뉴\" · aria-haspopup=\"dialog\")를 둔다. aria-expanded · aria-controls 는 부르는 쪽이 준다. 누르면 왼쪽 Side Panel 이 열려 Side Navigation 의 항목을 보인다 — 지금 화면의 묶음이 펼쳐진 채 열리고, 항목을 누르면 이동하고 닫힌다(side-panel.md 의 코드). 사이드바 항목이 아닌 상세 화면은 ☰ 대신 ← 다. 오른쪽 자리가 비면 그리지 않는다.",
    jsx: `import { TopNavigation, TopNavigationMenuButton, TopNavigationTitle } from "@/components/ui/top-navigation"

<TopNavigation>
  <TopNavigationMenuButton aria-expanded={menuOpen} aria-controls="main-menu" onClick={() => setMenuOpen(true)} />
  <TopNavigationTitle>휴가 현황</TopNavigationTitle>
</TopNavigation>
{/* 주 메뉴 — Side Panel(왼쪽)에 Side Navigation 의 항목. side-panel.md 의 코드 */}`,
    render: () =>
      phone(
        topNavigation(
          "standard",
          `${iconButton({ icon: "menu", name: "주 메뉴", slot: "top-navigation-menu-button", extra: ['aria-haspopup="dialog"', 'aria-expanded="false"', 'aria-controls="main-menu"'] })}${title("standard", "휴가 현황")}`,
        ),
        LEAVE,
        220,
      ),
  },

  {
    title: "✕ — 모달 · 독립 흐름을 닫는다",
    description:
      "✕(TopNavigationCloseButton — 이름 \"닫기\")는 모달 · 독립 흐름(여러 단계를 거치는 가져오기 · 처음 쓰기)을 닫을 때만 쓴다 — 흐름을 끝내고 처음 자리로 가며, 입력한 값이 사라질 수 있다. 일반 화면에는 ← 를 둔다. dirty 면 닫기 전에 \"작성한 내용이 사라져요\" 를 묻고 [나가기] 를 골랐을 때만 onClick 을 부른다(Field 의 규칙). 시트 · 대화상자의 닫기는 그 부품의 닫기 버튼이다.",
    jsx: `import { TopNavigation, TopNavigationCloseButton, TopNavigationTitle } from "@/components/ui/top-navigation"

{/* 입력한 값이 있으면 먼저 묻는다 — "작성한 내용이 사라져요" */}
<TopNavigation>
  <TopNavigationCloseButton dirty={isDirty} onClick={() => navigate("/desk/ledger", { replace: true })} />
  <TopNavigationTitle>거래 가져오기</TopNavigationTitle>
</TopNavigation>`,
    render: () =>
      phone(
        topNavigation("standard", `${iconButton({ icon: "x", name: "닫기", slot: "top-navigation-close-button" })}${title("standard", "거래 가져오기")}`),
        [["1. 파일 고르기", "엑셀 · CSV", ""], ["2. 칸 맞추기", "날짜 · 금액 · 내용", ""], ["3. 확인", "가져올 1,204건", ""]],
        220,
      ),
  },

  {
    title: "오른쪽 — 셋까지 · 넘치면 ⋯ · 긴 제목",
    description:
      "오른쪽 아이콘 버튼은 2개를 권장하고 3개까지 둔다(SEED) — 더 있으면 자주 쓰는 것만 남기고 나머지를 ⋯ 하나에 모은다(이름 \"{화면 이름} 더보기\" — 1280 이상 Menu, 미만 Menu Sheet). 제목은 한 줄이다 — 길면 말줄임(…)하고 오른쪽 자리 앞 8 을 비운다(TopNavigationActions 의 왼쪽 8). 글자 크기 설정은 1.2배까지만 따른다 — 더 커져도 바 높이 56 을 넘지 않는다.",
    jsx: `import { Ellipsis, Search, Share2 } from "lucide-react"

<TopNavigation>
  <TopNavigationBackButton fallbackHref="/desk/more" />
  <TopNavigationTitle>카드 혜택</TopNavigationTitle>
  <TopNavigationActions>
    <TopNavigationIconButton aria-label="검색" onClick={openSearch}><Search /></TopNavigationIconButton>
    <TopNavigationIconButton aria-label="공유" onClick={share}><Share2 /></TopNavigationIconButton>
    {/* 나머지는 ⋯ 하나에 — 1280 미만은 Menu Sheet */}
    <TopNavigationIconButton aria-label="카드 혜택 더보기" onClick={openMore}><Ellipsis /></TopNavigationIconButton>
  </TopNavigationActions>
</TopNavigation>`,
    render: () =>
      grid([
        labeled(
          phone(
            topNavigation("standard", `${iconButton({ icon: "chevronLeft", name: "뒤로", slot: "top-navigation-back-button" })}${title("standard", "카드 혜택")}${actions(`${iconButton({ icon: "search", name: "검색" })}${iconButton({ icon: "share", name: "공유" })}${iconButton({ icon: "ellipsis", name: "카드 혜택 더보기" })}`)}`),
            [["지어낸카드 플러스", "할인 · 연회비 1만원", ""], ["지어낸카드 포인트", "포인트 · 연회비 없음", ""], ["지어낸카드 캐시백", "캐시백 · 연회비 2만원", ""]],
            220,
          ),
          "셋까지 — 검색 · 공유 · ⋯",
        ),
        labeled(
          phone(
            topNavigation("standard", `${iconButton({ icon: "chevronLeft", name: "뒤로", slot: "top-navigation-back-button" })}${title("standard", "현대카드 M Edition3 카드 혜택 자세히 보기")}${actions(`${iconButton({ icon: "share", name: "공유" })}${iconButton({ icon: "ellipsis", name: "카드 혜택 더보기" })}`)}`),
            [["전월 실적", "", "30만원 이상"], ["연회비", "", "2만원"]],
            220,
          ),
          "긴 제목 — 말줄임 · 오른쪽 자리 앞 8",
        ),
      ]),
  },
];
