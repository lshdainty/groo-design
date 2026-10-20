/*
 * shadcn Bottom Navigation 예제 — docs site components/bottom-navigation.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(Desk 셸 — 다섯 칸 · 본문 아래 여백)은 차례 · 제목 · 코드가
 * specs/components/bottom-navigation.md 의 "코드" 절과 같고, 뒤의 둘(줄어든 바 · 캘린더의 +)은 md 의 Properties · Guidelines 를 코드로 더 보인다.
 * groo 에 처음 두는 스펙이다 — 떠 있는 알약(2026-10-04 사용자 결정 4B).
 *
 * ROOT · ROOT_REGULAR · ROOT_COMPACT · ITEM · ITEM_CURRENT · ITEM_OTHER · LABEL · ADD · ADD_CIRCLE · BOTTOM_NAVIGATION_INSET 은
 * recipes/shadcn/components/ui/bottom-navigation.tsx 의 상수와, ADD_CIRCLE_SIZE · LABEL_HIDDEN 은 그 파일의 JSX 에 적힌 클래스와 글자 하나까지
 * 같아야 한다 — 두 파일을 함께 고친다. 아이콘을 감싼 NB_TARGET 은 notification-badge.tsx 의 것이다.
 * 규칙은 specs/components/bottom-navigation.md, 수치 원본은 specs/components/bottom-navigation.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 바 <nav aria-label="주 메뉴" data-slot="bottom-navigation" (data-compact)> > 칸 <a data-slot="bottom-navigation-item">
 * (아이콘을 감싼 <span data-slot="notification-badge-target"> · 라벨 <span data-slot="bottom-navigation-label">) · 가운데 +
 * <button data-slot="bottom-navigation-add"> > 원 <span data-slot="bottom-navigation-add-circle">. 바는 화면(fixed)에 뜬다 — 미리보기 틀(STAGE)에
 * transform 을 줘 fixed 의 기준을 틀로 바꾸고 isolation 으로 z-index 를 가둔다. 틀에는 안전 영역이 없어 아래 자리는 14(줄어들면 12)다.
 * 레시피의 스크립트(아래로 20 · 위로 28 · 맨 위 40 에서 줄고 펴기 · 줄어든 바를 누르면 펴기 · 지금 탭 다시 누르기 · 화면 키보드에 숨기 ·
 * 누르는 순간 --press-basis 재기)는 정적 HTML 에 없다 — 줄어든 모습은 compact 로 멈춰 그렸다. 미리보기의 링크 주소는 # 이다 — 눌러도 문서를
 * 떠나지 않게(레시피는 href 그대로 — "/desk/ledger").
 * 화면 몸 · 목록 줄은 미리보기 틀(레시피가 아니다)이다. 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── bottom-navigation.tsx 의 상수와 같은 값 ──────────────────────────────

// 본문 아래 여백 — 바의 아래 자리 + 66 + 24. 바가 줄어도 그대로 둔다
const BOTTOM_NAVIGATION_INSET = "calc(max(14px, env(safe-area-inset-bottom) - 6px) + 90px)";

// 바 — 떠 있는 알약. 최대 480 으로 가운데 · 칸 다섯(사이 2) · 불투명 bg-layer-floating · shadow-s3 + 안쪽 1px · 펼침 ↔ 줄어듦 200ms
const ROOT = [
  "fixed z-(--z-sticky) mx-auto grid max-w-[480px] grid-cols-5 gap-[2px] rounded-full bg-bg-layer-floating font-sans",
  "shadow-[var(--shadow-s3),inset_0_0_0_1px_var(--color-stroke-neutral-subtle)]",
  "[transition:height_var(--motion-duration-d4)_var(--motion-ease-easing),left_var(--motion-duration-d4)_var(--motion-ease-easing),right_var(--motion-duration-d4)_var(--motion-ease-easing),bottom_var(--motion-duration-d4)_var(--motion-ease-easing),padding_var(--motion-duration-d4)_var(--motion-ease-easing)]",
  "motion-reduce:transition-none",
].join(" ");
// 펼침 66 · 화면 끝 14 · 아래 max(14, 안전 영역 − 6) / 줄어듦 48 · 36 · max(12, 안전 영역 − 8)
const ROOT_REGULAR = [
  "h-[66px] px-x2_5 py-x1_5",
  "left-[calc(var(--spacing-x3_5)+env(safe-area-inset-left))] right-[calc(var(--spacing-x3_5)+env(safe-area-inset-right))]",
  "bottom-[max(14px,calc(env(safe-area-inset-bottom)-6px))]",
].join(" ");
const ROOT_COMPACT = [
  "h-[48px] cursor-pointer px-x2 py-0",
  "left-[calc(var(--spacing-x9)+env(safe-area-inset-left))] right-[calc(var(--spacing-x9)+env(safe-area-inset-right))]",
  "bottom-[max(12px,calc(env(safe-area-inset-bottom)-8px))]",
].join(" ");

// 칸 — 아이콘 위 · 라벨 아래(사이 2), 칸 전체가 누르는 자리. 누르면 칸만 2px 거리 축소(색은 그대로), 키보드 포커스에 안쪽 2px 링
const ITEM = [
  "relative flex h-full min-w-0 cursor-pointer flex-col items-center justify-center gap-[2px] rounded-r3 no-underline",
  "[&_svg]:size-6 [&_svg]:shrink-0",
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "active:[scale:calc(1-2/var(--press-basis,54))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
// 지금 탭 — 짙은 글자색 + 선 2.5 / 다른 탭 — fg-neutral-subtle + 선 2
const ITEM_CURRENT = "text-fg-neutral [&_svg]:[stroke-width:2.5]";
const ITEM_OTHER = "text-fg-neutral-subtle [&_svg]:[stroke-width:2]";
// 라벨 — 11 / 15 · 500 고정 크기 · 한 줄
const LABEL = "block max-w-full truncate whitespace-nowrap text-t1-static font-medium";

// 가운데 + — 칸 전체가 누르는 자리, 브랜드 원 44(줄어듦 36) + 흰 + 24(20)
const ADD = "group/bottom-navigation-add relative flex h-full min-w-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none";
const ADD_CIRCLE = [
  "flex shrink-0 items-center justify-center rounded-full bg-bg-brand-solid text-static-white [&_svg]:shrink-0 [&_svg]:[stroke-width:2.5]",
  "[transition:background-color_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale),width_var(--motion-duration-d4)_var(--motion-ease-easing),height_var(--motion-duration-d4)_var(--motion-ease-easing)]",
  "motion-reduce:[transition:background-color_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "group-active/bottom-navigation-add:bg-bg-brand-solid-pressed group-active/bottom-navigation-add:[scale:calc(1-2/var(--add-basis))] motion-reduce:group-active/bottom-navigation-add:[scale:1]",
  "group-focus-visible/bottom-navigation-add:outline-2 group-focus-visible/bottom-navigation-add:outline-offset-2 group-focus-visible/bottom-navigation-add:outline-stroke-focus-ring",
].join(" ");

// ── bottom-navigation.tsx 의 JSX 에 적힌 클래스 ───────────────────────────

// + 의 원 크기 — 펼침 44 · + 24 / 줄어듦 36 · + 20
const ADD_CIRCLE_SIZE = { regular: "size-11 [--add-basis:44] [&_svg]:size-6", compact: "size-9 [--add-basis:36] [&_svg]:size-5" };
// 줄어든 바의 라벨 — 보이지 않게만(칸의 이름으로 남는다)
const LABEL_HIDDEN = "sr-only";

// ── notification-badge.tsx — 아이콘을 감싼 대상 ─────────────────────────────
const NB_TARGET = "relative inline-flex";

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 와 같은 모양(24 격자) — 칸의 아이콘 24 · + 24(줄어들면 20)
const svg = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const ICONS = {
  house: svg('<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  clipboardList: svg('<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>'),
  calendarDays: svg('<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>'),
  menu: svg('<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>'),
  plus: svg('<path d="M5 12h14"/><path d="M12 5v14"/>'),
};
// 다섯 칸 — 홈 · 가계부 · + · 캘린더 · 전체(어느 화면에서나 같다)
const TABS = [
  { key: "home", label: "홈", icon: "house" },
  { key: "ledger", label: "가계부", icon: "clipboardList" },
  { key: "add" },
  { key: "calendar", label: "캘린더", icon: "calendarDays" },
  { key: "more", label: "전체", icon: "menu" },
];

// <BottomNavigation> > <BottomNavigationItem> · <BottomNavigationAddButton> — tab 은 지금 탭, compact 는 줄어든 바
function bottomNavigation({ tab = "home", compact = false } = {}) {
  const cells = TABS.map((t) => {
    if (t.key === "add") {
      const name = tab === "calendar" ? "일정 추가" : "거래 추가";
      return `<button type="button" data-slot="bottom-navigation-add" class="${ADD}" aria-label="${name}"><span aria-hidden="true" data-slot="bottom-navigation-add-circle" class="${ADD_CIRCLE} ${compact ? ADD_CIRCLE_SIZE.compact : ADD_CIRCLE_SIZE.regular}">${ICONS.plus}</span></button>`;
    }
    const current = t.key === tab;
    return `<a href="#"${current ? ' aria-current="page"' : ""} data-slot="bottom-navigation-item"${current ? ' data-current="true"' : ""} class="${ITEM} ${current ? ITEM_CURRENT : ITEM_OTHER}"><span aria-hidden="true" data-slot="notification-badge-target" class="${NB_TARGET}">${ICONS[t.icon]}</span><span data-slot="bottom-navigation-label" class="${compact ? LABEL_HIDDEN : LABEL}">${esc(t.label)}</span></a>`;
  }).join("");
  return `<nav aria-label="주 메뉴" data-slot="bottom-navigation"${compact ? ' data-compact="true"' : ""} class="${ROOT} ${compact ? ROOT_COMPACT : ROOT_REGULAR}">${cells}</nav>`;
}

// 미리보기 틀 — 폰 화면(360 까지). transform 이 fixed 의 기준을 틀로 바꾸고 isolation 이 z-index 를 가둔다. 몸은 스크롤된다
const STAGE = (height) =>
  `position:relative; isolation:isolate; transform:translateZ(0); overflow:hidden; display:flex; flex-direction:column; width:100%; max-width:360px; height:${height}px; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-default); font-family:var(--font-sans);`;
const HEAD =
  "flex-shrink:0; display:flex; align-items:center; height:56px; padding:0 var(--spacing-x4); font-size:var(--text-t8); line-height:var(--text-t8--line-height); font-weight:700; color:var(--color-fg-neutral);";
const ROW_TEXT =
  "display:flex; justify-content:space-between; gap:var(--spacing-x3); padding:var(--spacing-x3) var(--spacing-global-gutter); font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const ROW_DETAIL = "display:block; font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle);";
const LEDGER = [
  ["김밥천국", "식비 · 현대카드 M", "8,000원"],
  ["버스", "교통 · 현대카드 M", "1,500원"],
  ["다이소", "쇼핑 · 현대카드 M", "12,300원"],
  ["월급", "수입 · 국민 주계좌", "3,200,000원"],
  ["스타벅스", "식비 · 국민 주계좌", "6,800원"],
  ["GS25", "식비 · 현대카드 M", "3,200원"],
];
const EVENTS = [
  ["팀 회의", "10월 8일 (목) 10:00", ""],
  ["치과", "10월 9일 (금) 14:30", ""],
  ["관리비 이체", "10월 10일 (토)", "184,000원"],
  ["엄마 생신", "10월 12일 (월)", ""],
];
const rows = (list) =>
  list.map(([t, d, v]) => `<div style="${ROW_TEXT}"><span>${esc(t)}<span style="${ROW_DETAIL}">${esc(d)}</span></span>${v ? `<b>${esc(v)}</b>` : ""}</div>`).join("");
// 화면 — 머리(미리보기 그림) · 스크롤되는 몸(아래 여백 BOTTOM_NAVIGATION_INSET) · 바
const screen = ({ title, list, tab, compact = false, height = 360 }) =>
  `<div style="${STAGE(height)}"><div style="${HEAD}">${esc(title)}</div><main class="overflow-y-auto" style="flex:1 1 auto; min-height:0; padding-bottom:${BOTTOM_NAVIGATION_INSET};">${rows(list)}</main>${bottomNavigation({ tab, compact })}</div>`;
const CAPTION = "display:block; margin-top:var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;
const grid = (items) =>
  `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap:var(--spacing-x6) var(--spacing-x4); align-items:start;">${items.join("")}</div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const bottomNavigationExamples = [
  {
    title: "Desk 셸 — 다섯 칸",
    description:
      "Desk 앱 · Desk 웹 768 미만의 주 메뉴(<nav aria-label=\"주 메뉴\">)다. 칸은 다섯이고 어느 화면에서나 같다 — 홈 · 가계부 · + · 캘린더 · 전체. 화면 아래에 떠 있는 알약(모서리 full)이고, 펼친 바는 높이 66 · 화면 끝에서 좌우 14 · 아래 max(14, 아래 안전 영역 − 6) — 홈 표시줄(34)이 있으면 28 로 바의 아래 여백 6 만 안전 영역에 걸친다. 바탕은 불투명한 bg-layer-floating(흐림 없음) · shadow-s3 + 안쪽 1px stroke-neutral-subtle 이고, 넓은 화면에서는 480 으로 가운데에 선다. 칸은 링크 — 지금 탭은 aria-current=\"page\" 이고 아이콘 · 라벨이 fg-neutral · 선 2.5, 다른 탭은 fg-neutral-subtle · 선 2 다(브랜드 색이 아니다). 라벨은 11/15 · 500 고정 크기(글자 크기 설정을 따르지 않는다). 가운데 + 는 탭이 아니라 그 화면의 추가 — 브랜드 원 44 + 흰 + 24 이고 이름이 화면마다 다르다(\"거래 추가\" · 캘린더 \"일정 추가\"). 스낵바가 바 위 8 에 뜨게 SnackbarAvoidOverlap 으로 감싼다.",
    jsx: `import { CalendarDays, ClipboardList, House, Menu } from "lucide-react"
import { BottomNavigation, BottomNavigationAddButton, BottomNavigationItem } from "@/components/ui/bottom-navigation"
import { SnackbarAvoidOverlap } from "@/components/ui/snackbar"

<SnackbarAvoidOverlap>
  <BottomNavigation>
    {/* 다른 탭에서 누르면 그 탭의 마지막 화면(resumeHref — 셸이 탭마다 기억), 지금 탭을 다시 누르면 첫 화면(href) · 맨 위 */}
    <BottomNavigationItem href="/desk" resumeHref={lastPath.home} icon={<House />} label="홈" current={tab === "home"} />
    <BottomNavigationItem href="/desk/ledger" resumeHref={lastPath.ledger} icon={<ClipboardList />} label="가계부" current={tab === "ledger"} />
    {/* 탭이 아니라 이 화면의 추가 — 이름은 화면마다 */}
    <BottomNavigationAddButton aria-label={tab === "calendar" ? "일정 추가" : "거래 추가"} onClick={openAdd} />
    <BottomNavigationItem href="/desk/calendar" resumeHref={lastPath.calendar} icon={<CalendarDays />} label="캘린더" current={tab === "calendar"} />
    <BottomNavigationItem href="/desk/more" resumeHref={lastPath.more} icon={<Menu />} label="전체" current={tab === "more"} />
  </BottomNavigation>
</SnackbarAvoidOverlap>`,
    render: () => screen({ title: "홈", list: LEDGER, tab: "home" }),
  },

  {
    title: "본문 아래 여백",
    description:
      "바가 본문을 덮으므로 본문 스크롤의 맨 아래에 여백을 둔다 — BOTTOM_NAVIGATION_INSET(바의 아래 자리 + 66 + 24 — 안전 영역이 없으면 14 + 66 + 24 = 104, 홈 표시줄 34 면 118). 끝까지 내리면 마지막 줄이 바 위 24 에서 끝난다. 바가 줄어도 여백은 그대로 둔다(줄 때마다 본문이 밀리지 않게). 탭 바 위 목록에는 끝 흐림(Scroll Fog)을 걸지 않는다. 미리보기 목록을 끝까지 내려 보면 마지막 줄이 바에 덮이지 않는다.",
    jsx: `import { BOTTOM_NAVIGATION_INSET } from "@/components/ui/bottom-navigation"

{/* 마지막 줄이 바 위 24 에서 끝난다 — 바가 줄어도 그대로 */}
<main id="main" className="overflow-y-auto" style={{ paddingBottom: BOTTOM_NAVIGATION_INSET }}>…</main>`,
    render: () => screen({ title: "가계부", list: [...LEDGER, ...LEDGER], tab: "ledger", height: 400 }),
  },

  {
    title: "줄어든 바 — 48 · 이름은 남는다",
    description:
      "아래로 20 이상 스크롤하면 바가 줄어든다(compact) — 높이 48 · 좌우 36 · 아래 max(12, 안전 영역 − 8) · 안쪽 4 · 8 · + 는 원 36 · 아이콘 20. 라벨은 보이지 않게만 숨겨(sr-only) 칸마다 이름이 남는다 — 보조 기술은 줄어든 바에서도 \"홈\" · \"가계부\" 를 읽는다. 위로 28 이상 스크롤하거나 맨 위 40 안으로 오면 펴지고(200ms d4 · 스크롤 방향이 바뀌면 다시 센다), 줄어든 바 어디를 눌러도 펴진다 — 칸을 눌렀으면 그 탭으로도 간다. 라벨은 줄어들기 시작할 때 사라지고 다 펴진 뒤 나타난다. 펼침 칸은 약 61 × 54, 줄어듦 칸은 약 53 × 40(360 폭)이다. 손으로 다룰 때는 compact · onCompactChange 를 준다.",
    jsx: `{/* 손으로 다룰 때 — 주지 않으면 스크롤로 저절로 줄고 편다 */}
<BottomNavigation compact={compact} onCompactChange={setCompact}>…</BottomNavigation>`,
    render: () =>
      grid([
        labeled(screen({ title: "홈", list: LEDGER, tab: "home", height: 300 }), "펼침 66 — 좌우 14 · 아래 14"),
        labeled(screen({ title: "홈", list: LEDGER, tab: "home", compact: true, height: 300 }), "줄어듦 48 — 좌우 36 · 아래 12 · 라벨은 sr-only"),
      ]),
  },

  {
    title: "캘린더 — + 의 이름 \"일정 추가\"",
    description:
      "+ 는 그 화면의 추가 하나다 — 홈 · 가계부 · 전체에서는 거래 추가, 캘린더에서는 일정 추가. 이름이 화면마다 바뀌므로 aria-label 도 같이 바꾼다(앱도 이름을 단다). 누르면 그 추가(시트)를 연다. + 를 라벨 붙은 칸으로 두거나 떠 있는 버튼으로 빼지 않는다 — 탭 바가 있는 화면에는 Floating Action Button 을 두지 않는다. 지금 탭(캘린더)을 다시 누르면 그 탭의 첫 화면 · 맨 위로 간다(같은 주소를 쌓지 않는다 — onReselect 를 주지 않으면 레시피가 맨 위로 스크롤하고 주소를 고쳐 쓴다).",
    jsx: `<BottomNavigationAddButton aria-label={tab === "calendar" ? "일정 추가" : "거래 추가"} onClick={openAdd} />

{/* 지금 탭을 다시 누름 — 라우터를 쓰는 셸은 주소를 고쳐 쓰고 맨 위로 */}
<BottomNavigationItem
  href="/desk/calendar"
  icon={<CalendarDays />}
  label="캘린더"
  current={tab === "calendar"}
  onReselect={({ href, scrollToTop }) => { navigate(href, { replace: true }); scrollToTop() }}
/>`,
    render: () => screen({ title: "캘린더", list: EVENTS, tab: "calendar", height: 320 }),
  },
];
