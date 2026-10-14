/*
 * shadcn Side Navigation 예제 — docs site components/side-navigation.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(Desk — 묶음 둘 · 768 ~ 1279 접힌 사이드바)은 차례 · 제목 · 코드가
 * specs/components/side-navigation.md 의 "코드" 절과 같고, 뒤의 둘(하위가 지금이면 부모가 펼쳐진 채 · 긴 이름과 막힌 항목)은 md 의 Properties 를
 * 코드로 더 보인다. 옛 Sidebar(shadcn — 256 · 48 · 항목 32 · 모바일 Sheet)를 대신한다.
 *
 * ROOT · HEADER · LOGO · TRIGGER · CONTENT · GROUP_LABEL · GROUP_DIVIDER · ITEM · ITEM_COLLAPSED · ITEM_HOVER · ITEM_CURRENT · ITEM_DISABLED ·
 * ITEM_CONTENT · ITEM_CONTENT_PRESS · ITEM_ICON · ITEM_LABEL · CHEVRON · SUB_LIST · SUB_LIST_OPEN · SUB_LIST_CLOSED · FLYOUT · FLYOUT_LABEL · SUB_ITEM ·
 * FLYOUT_ITEM · FLYOUT_PILL · FLYOUT_PILL_OTHER · FLYOUT_PILL_CURRENT · FLYOUT_ITEM_CONTENT · FLYOUT_ITEM_CONTENT_PRESS · FOG_DEPTH 는
 * recipes/shadcn/components/ui/side-navigation.tsx 의 상수와, WIDTH · TRIGGER_SIDE · GROUP · LIST · SUB_UL · LEAF_LI · PARENT_LI · FOOTER 는 그 파일의
 * JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. tone() 은 레시피의 색 고르기와 같은 답을 낸다.
 * 이름 말풍선 BUBBLE · BUBBLE_TITLE · ARROW_* 는 help-bubble.tsx(tooltip-examples.mjs)의 것과 같다.
 * 아래 끝 흐림은 레시피의 useBottomFog 와 같은 셈이다 — 레시피는 그릴 때 토큰 --gradient-fade-mask(방향 없이 위 → 아래)를 읽어 아래에서 위로
 * 붙이고 내용 상자의 style(mask-image · -size · -position · -repeat 와 -webkit- 짝)로 넣는다. 정적 HTML 은 같은 일을 빌드 때 DESIGN.md 의 토큰 값으로 했다.
 * 규칙은 specs/components/side-navigation.md, 수치 원본은 specs/components/side-navigation.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 사이드바 <nav aria-label="주 메뉴" data-slot="side-navigation" (data-collapsed)> > 머리
 * <div data-slot="side-navigation-header">(로고 · 접기 버튼 <button data-slot="side-navigation-trigger">) · 내용 <div data-slot="side-navigation-content"> >
 * 묶음 <div data-slot="side-navigation-group">(이름 · <ul aria-labelledby>) > 항목 <a data-slot="side-navigation-item"> · 부모 <button data-parent>
 * + 하위 목록 <div data-slot="side-navigation-sub-list">. 바닥은 비면 그리지 않는다.
 * 레시피가 cn() 으로 합치는 항목 클래스는 merge() 로 똑같이 합친다 — 같은 속성을 다시 쓴 클래스는 뒤의 것만 남는다.
 * 미리보기의 링크 주소는 # 이다 — 눌러도 문서를 떠나지 않게(레시피는 href 그대로 — "/desk/ledger").
 * 레시피의 높이 h-dvh(화면 높이)는 미리보기 틀의 높이로 style 에 한 번 더 적었다(미리보기용 덧칠). 레시피는 펼침 메뉴를 사이드바 안에 그려
 * Radix Popover 가 화면(fixed)에 띄우고 말풍선은 body 에 띄운다 — 미리보기는 둘을 틀 안의 absolute 로 옮겨 그렸다(그 순간을 멈춘 그림).
 * 레시피의 스크립트(창 폭으로 접고 펴기 · 손으로 접은 기억 · 마우스 200ms · 100ms · 키보드 · 누르는 순간 --press-basis 재기 · 머리 아래 선)는
 * 정적 HTML 에 없다. 본문 · 서비스 마크는 미리보기 그림이다. 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

import { readFileSync } from "node:fs";

// ── side-navigation.tsx 의 상수와 같은 값 ────────────────────────────────

// 사이드바 — 흰 면 + 오른쪽 안쪽 1px 선, 높이 전체 · 왼쪽에 붙는다. 폭 240 ↔ 56 200ms easing
const ROOT = [
  "sticky top-0 flex h-dvh shrink-0 flex-col overflow-hidden bg-bg-layer-default font-sans text-fg-neutral",
  "shadow-[inset_-1px_0_0_0_var(--color-stroke-neutral-subtle)]",
  "[transition:width_var(--motion-duration-d4)_var(--motion-ease-easing)] motion-reduce:transition-none",
].join(" ");

// 머리 — 높이 64 · 안쪽 8. 내용이 위 끝에서 떨어지면 안쪽 아래 1px 선(150ms)
const HEADER = [
  "relative flex min-h-[64px] shrink-0 items-center p-x2",
  "[transition:box-shadow_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[&:has(~[data-slot=side-navigation-content][data-scrolled])]:shadow-[inset_0_-1px_0_0_var(--color-stroke-neutral-subtle)]",
].join(" ");
// 로고 — 마크 24 + 이름 t5 · 700, 화면 끝에서 16. 접기 버튼 자리(40 + 12)를 비운다
const LOGO = "ml-x2 mr-[52px] flex min-w-0 items-center gap-x2 overflow-hidden whitespace-nowrap text-t5 font-bold text-fg-neutral [&>img]:size-6 [&>img]:shrink-0 [&>svg]:size-6 [&>svg]:shrink-0";
// 접기 버튼 — 40 · 아이콘 18 · 모서리 8 · 누르는 영역 44, 위 12 · 오른쪽 12(접히면 8)
const TRIGGER = [
  "absolute top-x3 flex size-10 cursor-pointer items-center justify-center rounded-r2 border-0 bg-transparent p-0 text-fg-neutral-subtle [&>svg]:size-[18px]",
  "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/40)] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

// 아래 끝 흐림 깊이 — 내용 상자의 아래 24
const FOG_DEPTH = "24px";

// 내용 — 위 8 · 좌우 8 · 아래 24(흐림 깊이), 묶음 사이 8(접히면 0 — 선으로 가른다)
const CONTENT = "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-x2 pb-[24px] pt-x2 scroll-pb-[24px] scroll-pt-x2";

// 묶음 이름 — t4 · 700 · fg-neutral-muted · 안쪽 6(글은 화면 끝에서 14), 길면 단어 단위로 줄을 바꾼다
const GROUP_LABEL = "p-x1_5 text-t4 font-bold text-fg-neutral-muted break-keep [overflow-wrap:break-word]";
// 접혔을 때 묶음 사이 1px 선 — 위아래 8 · 좌우 8(선 폭 24, 아이콘 칸 가운데). 첫 묶음 위에는 없다
const GROUP_DIVIDER =
  "[[data-slot=side-navigation-group]+&]:before:mx-x2 [[data-slot=side-navigation-group]+&]:before:my-x2 [[data-slot=side-navigation-group]+&]:before:block [[data-slot=side-navigation-group]+&]:before:h-px [[data-slot=side-navigation-group]+&]:before:bg-stroke-neutral-subtle [[data-slot=side-navigation-group]+&]:before:content-['']";

// 항목 — 최소 44 · 좌우 8 · 모서리 10, 키보드 포커스에 안쪽 2px 링. 바탕은 지금 항목 · 호버 · 누름에만
const ITEM = [
  "group/side-navigation-item relative flex min-h-11 w-full items-center rounded-r2_5 border-0 bg-transparent px-x2 text-left font-sans no-underline",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),padding_var(--motion-duration-d4)_var(--motion-ease-easing)]",
  "motion-reduce:[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
// 접힘 — 40(56 − 좌우 8) · 좌우 10, 아이콘이 화면 끝에서 18
const ITEM_COLLAPSED = "w-10 px-x2_5";
const ITEM_HOVER = "cursor-pointer hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed";
// 지금 항목 — 한 단계 짙은 옅은 회색, 마우스를 올리거나 눌러도 그대로
const ITEM_CURRENT = "cursor-pointer bg-bg-neutral-weak-pressed";
const ITEM_DISABLED = "cursor-not-allowed";
// 콘텐츠 층 — 아이콘 ↔ 이름 12. 누르는 동안만 2px 거리 축소(바탕은 그대로)
const ITEM_CONTENT = "relative flex min-w-0 flex-1 items-center gap-x3 [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const ITEM_CONTENT_PRESS = "group-active/side-navigation-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/side-navigation-item:[scale:1]";
const ITEM_ICON = "flex shrink-0 [&>svg]:size-5";
// 이름 — t4 · 500 · 위아래 6, 단어 단위로 줄을 바꾼다(말줄임 없음)
const ITEM_LABEL = "min-w-0 flex-1 py-x1_5 text-t4 font-medium break-keep [overflow-wrap:break-word]";

// 꺾쇠 — 16 · fg-neutral-subtle, 펼치면 위로(300ms — 하위 펼침과 같은 시간, 모션 줄이기면 바로)
const CHEVRON = "size-4 shrink-0 text-fg-neutral-subtle [transition:rotate_var(--motion-duration-d6)_var(--motion-ease-easing)] motion-reduce:transition-none";

// 하위 목록 — 높이 · 투명도로 펼친다(300ms — Accordion 과 같다). 접히면 다 접힌 뒤 보이지 않게.
// 모션 줄이기면 높이는 바로 바꾸고 투명도만 150ms — 접을 때는 다 흐려진 뒤 높이를 접는다
const SUB_LIST = "grid";
const SUB_LIST_OPEN = [
  "visible grid-rows-[1fr] opacity-100",
  "[transition:grid-template-rows_var(--motion-duration-d6)_var(--motion-ease-easing),opacity_var(--motion-duration-d6)_var(--motion-ease-easing),visibility_0s]",
  "motion-reduce:[transition:opacity_var(--motion-duration-d3)_var(--motion-ease-easing),visibility_0s]",
].join(" ");
const SUB_LIST_CLOSED = [
  "invisible grid-rows-[0fr] opacity-0",
  "[transition:grid-template-rows_var(--motion-duration-d6)_var(--motion-ease-easing),opacity_var(--motion-duration-d6)_var(--motion-ease-easing),visibility_0s_linear_var(--motion-duration-d6)]",
  "motion-reduce:[transition:grid-template-rows_0s_linear_var(--motion-duration-d3),opacity_var(--motion-duration-d3)_var(--motion-ease-easing),visibility_0s_linear_var(--motion-duration-d3)]",
].join(" ");

// 펼침 메뉴 — Menu 표면(폭 200 · 모서리 20 · 떠 있는 바탕 + s3 · 위아래 8 · z-floating). 150ms enter · 100ms exit 로 0.95 ↔ 1 · 투명도
const FLYOUT = [
  "z-(--z-floating) w-[200px] overflow-hidden rounded-r5 bg-bg-layer-floating py-x2 font-sans text-fg-neutral shadow-[var(--shadow-s3)] outline-none",
  "origin-[var(--radix-popover-content-transform-origin)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:[--tw-animation-duration:var(--motion-duration-d3)] data-[state=open]:ease-[var(--motion-ease-enter)] motion-safe:data-[state=open]:zoom-in-95",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:[--tw-animation-duration:var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)] motion-safe:data-[state=closed]:zoom-out-95",
].join(" ");
// 펼침 메뉴의 묶음 이름 — 부모 이름. t3 · 400 · fg-neutral-subtle · 위아래 8 · 좌우 16
const FLYOUT_LABEL = "px-x4 py-x2 text-t3 font-normal text-fg-neutral-subtle break-keep [overflow-wrap:break-word]";

// 부모 아래 목록 — 최소 44 · 이름이 부모 이름과 같은 자리(8 + 아이콘 20 + 12 = 40)
const SUB_ITEM = "pl-[40px] pr-x2";
// 펼침 메뉴의 줄 — 최소 44 · 좌우 16 · t4 · 400 · fg-neutral. 키보드 포커스는 알약 자리(좌우 8 · 모서리 12)의 안쪽 링
const FLYOUT_ITEM = [
  "group/side-navigation-flyout-item relative flex min-h-11 items-center px-x4 font-sans text-t4 font-normal no-underline outline-none scroll-my-x2",
  "after:pointer-events-none after:absolute after:inset-y-0 after:inset-x-x2 after:rounded-r3 after:content-['']",
  "focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-stroke-focus-ring",
].join(" ");
// 알약 — 마우스를 올리거나 누르면 좌우 8 들어오며 칠해진다. 지금 화면 줄은 늘 bg-neutral-weak-pressed
const FLYOUT_PILL =
  "pointer-events-none absolute inset-y-0 rounded-r3 [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),inset_var(--motion-duration-color-transition)_var(--motion-ease-easing)]";
const FLYOUT_PILL_OTHER =
  "inset-x-0 bg-transparent group-hover/side-navigation-flyout-item:inset-x-x2 group-hover/side-navigation-flyout-item:bg-bg-layer-floating-pressed group-active/side-navigation-flyout-item:inset-x-x2 group-active/side-navigation-flyout-item:bg-bg-layer-floating-pressed";
const FLYOUT_PILL_CURRENT = "inset-x-x2 bg-bg-neutral-weak-pressed";
const FLYOUT_ITEM_CONTENT =
  "relative min-w-0 flex-1 break-keep [overflow-wrap:break-word] [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const FLYOUT_ITEM_CONTENT_PRESS =
  "group-active/side-navigation-flyout-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/side-navigation-flyout-item:[scale:1]";

// 아이콘 · 이름의 색 — 막힘 fg-disabled · 지금 fg-neutral · 다른 항목 아이콘 fg-neutral-subtle + 이름 fg-neutral-muted
function tone(current, disabled) {
  return disabled
    ? { icon: "text-fg-disabled", label: "text-fg-disabled" }
    : current
      ? { icon: "text-fg-neutral", label: "text-fg-neutral" }
      : { icon: "text-fg-neutral-subtle", label: "text-fg-neutral-muted" };
}

// ── side-navigation.tsx 의 JSX 에 적힌 클래스 ─────────────────────────────

// 폭 — 펼침 240 · 접힘 56
const WIDTH = { expanded: "w-[var(--layout-sidebar)]", collapsed: "w-[var(--layout-sidebar-collapsed)]" };
// 접기 버튼의 오른쪽 — 펼침 12 · 접힘 8(56 의 가운데)
const TRIGGER_SIDE = { expanded: "right-x3", collapsed: "right-x2" };
// 묶음 · 목록 · 하위 목록의 ul · 항목 li · 바닥
const GROUP = "flex flex-col";
const LIST = "m-0 flex list-none flex-col p-0";
const SUB_UL = "m-0 flex min-h-0 list-none flex-col overflow-hidden p-0";
const LEAF_LI = "flex";
const PARENT_LI = "flex flex-col";
const FOOTER = "shrink-0 p-x2";

// ── help-bubble.tsx 의 상수와 같은 값 — 접혔을 때의 이름 말풍선(Tooltip) ──────

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
const BUBBLE_TITLE = "m-0 block whitespace-pre-line text-t3 font-bold";
const ARROW_PATH = "M0,0 H12 L8,6 Q6,8 4,6 Z";
const ARROW = "block fill-bg-neutral-inverted";

// ── side-navigation.tsx 의 셈(useBottomFog) — 아래 끝 24 흐림 ───────────────

// 토큰 값 — 레시피는 그릴 때 getComputedStyle 로 읽는다. 정적 HTML 은 DESIGN.md 의 v104 표에서 읽는다
const FADE_MASK = /`gradient-fade-mask` \| `(linear-gradient\([^`]+\))`/.exec(readFileSync(new URL("../../../DESIGN.md", import.meta.url), "utf8"))[1];

// useBottomFog 가 내용 상자의 style 에 넣는 값 — 꽉 찬 층 위에 토큰을 아래에서 위로(to top) 붙인다, mask-* 와 -webkit-mask-* 를 같이
function fogStyle() {
  const mask = {
    image: `linear-gradient(#000, #000), ${FADE_MASK.replace(/^linear-gradient\(/, "linear-gradient(to top, ")}`,
    size: `100% calc(100% - ${FOG_DEPTH}), 100% ${FOG_DEPTH}`,
    position: "0 0, 0 100%",
    repeat: "no-repeat",
  };
  return ["image", "size", "position", "repeat"].map((p) => `mask-${p}: ${mask[p]}; -webkit-mask-${p}: ${mask[p]};`).join(" ");
}

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다 — 이 파일이 합치는 클래스에 나오는 무리(배경 · 폭 · 좌우 여백)만 안다.
// 지금 항목의 bg-bg-neutral-weak-pressed 가 ITEM 의 bg-transparent 를, 접힌 항목의 w-10 · px-x2_5 가 w-full · px-x2 를 지운다
// (둘 다 남기면 Tailwind 는 같은 속성의 클래스를 이름 차례로 늘어놓아 bg-transparent 가 이긴다). 변형이 붙은 클래스는 같은 변형끼리만 겹친다
const GROUPS = [
  [/^bg-/, "bg"],
  [/^w-/, "w"],
  [/^px-/, "px"],
];
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

// lucide-react 와 같은 모양(24 격자) — 크기는 놓인 자리가 정한다(항목 20 · 꺾쇠 16 · 접기 버튼 18)
const svg = (paths, extra = "") =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${paths}</svg>`;
const PATHS = {
  layoutGrid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  trendingUp: '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
  clipboardList: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
  calendarDays: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  panelLeft: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
};
// 서비스 마크 + 이름(<ServiceLogo> — 미리보기 그림: 브랜드 색 둥근 네모)
const serviceLogo = (name) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="7" fill="var(--color-bg-brand-solid, var(--color-bg-neutral-inverted))"/></svg>${esc(name)}`;

// 묶음 · 항목 — Desk(side-navigation.md 의 코드) · HR(휴가 현황)
const DESK_GROUPS = [
  { label: "워크스페이스", items: [
    { icon: "layoutGrid", label: "홈" },
    { icon: "wallet", label: "자산" },
    { icon: "trendingUp", label: "증권", sub: [{ label: "나무증권" }, { label: "토스증권" }] },
    { icon: "clipboardList", label: "가계부" },
  ] },
  { label: "기록", items: [{ icon: "calendarDays", label: "캘린더" }] },
];
const HR_GROUPS = [
  { label: "근무", items: [
    { icon: "layoutGrid", label: "홈" },
    { icon: "calendarDays", label: "캘린더" },
    { icon: "plane", label: "휴가", sub: [{ label: "휴가 현황" }, { label: "휴가 신청" }] },
    { icon: "briefcase", label: "업무" },
  ] },
  { label: "관리", items: [{ icon: "users", label: "사용자" }] },
];

// 항목 하나 — 하위가 없으면 링크, 있으면 부모(버튼 + 하위 목록). current 는 지금 화면(이름), collapsed 는 접힌 사이드바(이름 · 꺾쇠 · 하위를 숨긴다)
function item({ it, uid, current, collapsed, flyout = "" }) {
  const hidden = collapsed;
  if (!it.sub) {
    const isCurrent = it.label === current;
    const disabled = !!it.disabled;
    const c = tone(isCurrent, disabled);
    const link = `<a ${attrs([
      !disabled && 'href="#"',
      disabled && 'role="link"',
      disabled && 'aria-disabled="true"',
      isCurrent && 'aria-current="page"',
      'data-slot="side-navigation-item"',
      isCurrent && 'data-current="true"',
      disabled && 'data-disabled="true"',
      `class="${merge(`${ITEM}${collapsed ? ` ${ITEM_COLLAPSED}` : ""} ${disabled ? ITEM_DISABLED : isCurrent ? ITEM_CURRENT : ITEM_HOVER}`)}"`,
      'data-state="closed"',
    ])}><span data-slot="side-navigation-item-content" class="${ITEM_CONTENT}${disabled ? "" : ` ${ITEM_CONTENT_PRESS}`}"><span aria-hidden="true" data-slot="side-navigation-item-icon" class="${ITEM_ICON} ${c.icon}">${svg(PATHS[it.icon])}</span><span data-slot="side-navigation-item-label" class="${hidden ? "sr-only" : `${ITEM_LABEL} ${c.label}`}">${esc(it.label)}</span></span></a>`;
    return `<li class="${LEAF_LI}">${link}</li>`;
  }
  const hasCurrentChild = it.sub.some((s) => s.label === current);
  const open = !collapsed && hasCurrentChild;
  const isCurrent = collapsed && hasCurrentChild;
  const c = tone(isCurrent, false);
  const buttonId = `${uid}button`;
  const listId = `${uid}list`;
  const flyoutOpen = collapsed && flyout === it.label;
  const inner = `<span data-slot="side-navigation-item-content" class="${ITEM_CONTENT} ${ITEM_CONTENT_PRESS}"><span aria-hidden="true" data-slot="side-navigation-item-icon" class="${ITEM_ICON} ${c.icon}">${svg(PATHS[it.icon])}</span><span data-slot="side-navigation-item-label" class="${hidden ? "sr-only" : `${ITEM_LABEL} ${c.label}`}">${esc(it.label)}</span>${collapsed ? "" : svg(PATHS.chevronDown, ` data-slot="side-navigation-chevron" class="${CHEVRON}${open ? " rotate-180" : ""}"`)}</span>`;
  const itemClass = merge(`${ITEM}${collapsed ? ` ${ITEM_COLLAPSED}` : ""} ${isCurrent ? ITEM_CURRENT : ITEM_HOVER}`);
  if (collapsed) {
    return `<li class="${LEAF_LI}"><button ${attrs([
      'type="button"',
      `id="${buttonId}"`,
      `aria-expanded="${flyoutOpen}"`,
      flyoutOpen && `aria-controls="${buttonId}flyout"`,
      'data-slot="side-navigation-item"',
      'data-parent=""',
      isCurrent && 'data-current="true"',
      `data-state="${flyoutOpen ? "open" : "closed"}"`,
      `class="${itemClass}"`,
    ])}>${inner}</button></li>`;
  }
  const subs = it.sub
    .map((s) => {
      const sc = s.label === current;
      return `<li class="${LEAF_LI}"><a href="#"${sc ? ' aria-current="page" data-current="true"' : ""} data-slot="side-navigation-sub-item" class="${merge(`${ITEM} ${SUB_ITEM} ${sc ? ITEM_CURRENT : ITEM_HOVER}`)}"><span class="${ITEM_CONTENT} ${ITEM_CONTENT_PRESS}"><span class="${ITEM_LABEL} ${tone(sc, false).label}">${esc(s.label)}</span></span></a></li>`;
    })
    .join("");
  return `<li class="${PARENT_LI}"><button type="button" id="${buttonId}" aria-expanded="${open}" aria-controls="${listId}" data-slot="side-navigation-item" data-parent="" data-state="${open ? "open" : "closed"}" class="${itemClass}">${inner}</button><div data-slot="side-navigation-sub-list" data-state="${open ? "open" : "closed"}" class="${SUB_LIST} ${open ? SUB_LIST_OPEN : SUB_LIST_CLOSED}"><ul id="${listId}" aria-labelledby="${buttonId}" class="${SUB_UL}">${subs}</ul></div></li>`;
}

// <SideNavigation> > <SideNavigationHeader logo> · <SideNavigationContent> > <SideNavigationGroup> > <SideNavigationItem> …
// height 는 미리보기 틀의 높이(레시피의 h-dvh 자리), flyout 은 펼침 메뉴가 열린 부모의 이름
function sideNavigation({ uid, groups, current, collapsed = false, logo = "Porest Desk", height = 520, flyout = "" }) {
  const navId = `side-navigation${uid}`;
  const body = groups
    .map((g, gi) => {
      const labelId = `${uid}g${gi}`;
      const lis = g.items.map((it, ii) => item({ it, uid: `${uid}i${gi}${ii}`, current, collapsed, flyout })).join("");
      return `<div data-slot="side-navigation-group" class="${GROUP}${collapsed ? ` ${GROUP_DIVIDER}` : ""}"><div id="${labelId}" data-slot="side-navigation-group-label" class="${collapsed ? "sr-only" : GROUP_LABEL}">${esc(g.label)}</div><ul aria-labelledby="${labelId}" class="${LIST}">${lis}</ul></div>`;
    })
    .join("");
  const header = `<div data-slot="side-navigation-header" class="${HEADER}"><div data-slot="side-navigation-logo" class="${LOGO}${collapsed ? " hidden" : ""}">${serviceLogo(logo)}</div><button type="button" aria-label="사이드바" aria-expanded="${!collapsed}" aria-controls="${navId}" data-slot="side-navigation-trigger" class="${TRIGGER} ${collapsed ? TRIGGER_SIDE.collapsed : TRIGGER_SIDE.expanded}">${svg(PATHS.panelLeft)}</button></div>`;
  return `<nav ${attrs([
    `id="${navId}"`,
    'aria-label="주 메뉴"',
    'data-slot="side-navigation"',
    collapsed && 'data-collapsed="true"',
    `class="${ROOT} ${collapsed ? WIDTH.collapsed : WIDTH.expanded}"`,
    `style="height:${height}px;"`,
  ])}>${header}<div data-slot="side-navigation-content" class="${CONTENT} ${collapsed ? "gap-0" : "gap-x2"}" style="${fogStyle()}">${body}</div></nav>`;
}

// 펼침 메뉴(접힌 부모 옆 8 · 위 끝 맞춤) — 레시피는 사이드바 안에 그려 화면(fixed)에 띄운다. 미리보기는 틀 안 absolute(top 은 부모의 자리)
function flyoutMenu({ uid, parent, items, current, top }) {
  const rows = items
    .map((s) => {
      const sc = s.label === current;
      return `<li class="${PARENT_LI}"><a href="#"${sc ? ' aria-current="page" data-current="true"' : ""} data-slot="side-navigation-flyout-item" class="${FLYOUT_ITEM} cursor-pointer text-fg-neutral"><span aria-hidden="true" class="${FLYOUT_PILL} ${sc ? FLYOUT_PILL_CURRENT : FLYOUT_PILL_OTHER}"></span><span class="${FLYOUT_ITEM_CONTENT} ${FLYOUT_ITEM_CONTENT_PRESS}">${esc(s.label)}</span></a></li>`;
    })
    .join("");
  return `<div data-radix-popper-content-wrapper="" style="position:absolute; left:56px; top:${top}px; min-width:max-content;"><div id="${uid}flyout" role="group" aria-labelledby="${uid}" data-slot="side-navigation-flyout" data-state="open" data-side="right" data-align="start" class="${FLYOUT}"><div aria-hidden="true" data-slot="side-navigation-flyout-label" class="${FLYOUT_LABEL}">${esc(parent)}</div><ul class="${LIST}">${rows}</ul></div></div>`;
}
// 이름 말풍선(<TooltipContent side="right">) — 항목 오른쪽 12(화살표 8 + 4) · 세로 가운데. 미리보기는 틀 안 absolute
const tooltip = ({ text, top }) =>
  `<div data-radix-popper-content-wrapper="" style="position:absolute; left:60px; top:${top}px; transform:translateY(-50%); min-width:max-content; z-index:var(--z-tooltip);"><div data-side="right" data-align="center" data-state="delayed-open" data-slot="tooltip-content" class="${BUBBLE} ${BUBBLE_TITLE}">${esc(text)}<span style="position:absolute; top:calc(50% - 4px); left:0px; transform:translateX(-100%) rotate(90deg); transform-origin:100% 50%;"><svg aria-hidden="true" width="12" height="8" viewBox="0 0 12 8" preserveAspectRatio="none" data-slot="tooltip-arrow" class="${ARROW}"><path d="${ARROW_PATH}"/></svg></span></div></div>`;

// 미리보기 틀 — 데스크톱 화면의 왼쪽(사이드바 + 본문 조각). isolation 이 z-index 를 가둔다
const FRAME = (height) =>
  `position:relative; isolation:isolate; display:flex; width:100%; max-width:640px; height:${height}px; overflow:hidden; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-basement); font-family:var(--font-sans);`;
const MAIN = "flex:1 1 auto; min-width:0; padding:var(--spacing-x5) var(--spacing-x6);";
const MAIN_TITLE = "margin:0 0 var(--spacing-x4); font-size:var(--text-screen-title); line-height:var(--text-screen-title--line-height); font-weight:700; color:var(--color-fg-neutral);";
const MAIN_CARD = "height:120px; border-radius:var(--radius-r4); background:var(--color-bg-layer-default);";
const main = (title) => `<div style="${MAIN}"><h2 style="${MAIN_TITLE}">${esc(title)}</h2><div style="${MAIN_CARD}"></div></div>`;
const frame = (inner, height = 520) => `<div style="${FRAME(height)}">${inner}</div>`;
const CAPTION = "display:block; margin-top:var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;
const grid = (items) =>
  `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap:var(--spacing-x6) var(--spacing-x4); align-items:start;">${items.join("")}</div>`;
// 접힌 항목의 위 끝 — 머리 64 + 내용 위 8 + 항목 44 × 차례(첫 묶음 안)
const itemTop = (index) => 64 + 8 + 44 * index;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const sideNavigationExamples = [
  {
    title: "Desk — 묶음 둘 · 하위가 있는 증권",
    description:
      "데스크톱(768 이상)의 주 메뉴(<nav aria-label=\"주 메뉴\">)다 — 화면 왼쪽 높이 전체의 흰 면(bg-layer-default) + 오른쪽 안쪽 1px stroke-neutral-subtle 이고 본문과 따로 스크롤된다. 1280 이상은 펼침 240, 768 ~ 1279 는 아이콘만 56 으로 저절로 접힌다(처음 열 때도 창 폭을 본다) — 손으로 접고 펼 수 있고 1280 이상에서 손으로 정한 것은 localStorage(porest:side-navigation-collapsed)에 기억한다. 768 미만에서는 그리지 않는다. 머리는 64 · 안쪽 8 — 서비스 마크 24 + 이름 16/22 · 700(누르지 않는다)과 접기 버튼(40 · 아이콘 18 · 누르는 영역 44 · 이름 \"사이드바\" + aria-expanded)이다. 묶음 이름은 14/19 · 700 · fg-neutral-muted(목록의 aria-labelledby), 항목은 최소 44 · 좌우 8 · 모서리 10 · 아이콘 20 · 이름 14/19 · 500 이다. 지금 화면의 항목(가계부)은 한 단계 짙은 옅은 회색 bg-neutral-weak-pressed + 짙은 아이콘 · 이름 fg-neutral 이고 굵기는 그대로다(aria-current=\"page\"). 하위가 있는 항목(증권)은 펼치기만 하는 버튼이다(aria-expanded · 꺾쇠 16). 내용 아래 끝 24 는 늘 흐리다.",
    jsx: `import { CalendarDays, ClipboardList, LayoutGrid, Wallet, TrendingUp } from "lucide-react"
import {
  SideNavigation, SideNavigationContent, SideNavigationFooter, SideNavigationGroup,
  SideNavigationHeader, SideNavigationItem, SideNavigationSubItem,
} from "@/components/ui/side-navigation"

<SideNavigation>
  <SideNavigationHeader logo={<ServiceLogo name="Porest Desk" />} />
  <SideNavigationContent>
    <SideNavigationGroup label="워크스페이스">
      <SideNavigationItem href="/desk" icon={<LayoutGrid />} label="홈" current={path === "/desk"} />
      <SideNavigationItem href="/desk/assets" icon={<Wallet />} label="자산" current={path === "/desk/assets"} />
      {/* 부모 — 펼치기만 한다. 하위가 지금이면 저절로 펼쳐진다 */}
      <SideNavigationItem icon={<TrendingUp />} label="증권">
        <SideNavigationSubItem href="/desk/stocks/namu" label="나무증권" current={broker === "namu"} />
        <SideNavigationSubItem href="/desk/stocks/toss" label="토스증권" current={broker === "toss"} />
      </SideNavigationItem>
      <SideNavigationItem href="/desk/ledger" icon={<ClipboardList />} label="가계부" current={path === "/desk/ledger"} />
    </SideNavigationGroup>
    <SideNavigationGroup label="기록">
      <SideNavigationItem href="/desk/calendar" icon={<CalendarDays />} label="캘린더" current={path === "/desk/calendar"} />
    </SideNavigationGroup>
  </SideNavigationContent>
  <SideNavigationFooter>{/* 계정 — 앱 적용 때 */}</SideNavigationFooter>
</SideNavigation>`,
    render: () => frame(`${sideNavigation({ uid: ":desk:", groups: DESK_GROUPS, current: "가계부", height: 420 })}${main("가계부")}`, 420),
  },

  {
    title: "768 ~ 1279 — 접힌 사이드바",
    description:
      "768 ~ 1279 에서는 같은 코드가 폭으로 저절로 접힌다(56 — 아이콘만). 접히면 로고 · 이름 · 묶음 이름 · 꺾쇠 · 하위가 보이지 않게만 남고(이름은 보조 기술이 읽는다) 묶음 사이에 1px 선(폭 24)이 생긴다 — 항목은 40 · 좌우 10 이라 아이콘이 56 의 가운데에 선다. 하위가 지금인 부모(증권 — 나무증권이 지금 화면)가 지금 항목이다. 하위가 없는 항목에 마우스를 올리면 200ms 뒤 · 키보드 초점이면 바로 오른쪽에 이름 말풍선(Tooltip — 이름과 같은 글이라 aria-describedby 로 잇지 않는다)이 뜬다(왼쪽 그림 — 자산). 부모는 아이콘 옆 8 · 위 끝 맞춤에 펼침 메뉴가 열린다 — Menu 와 같은 표면(폭 200 · 모서리 20 · s3 · 위아래 8) · 맨 위 부모 이름 · 줄 44 · 지금 화면 줄은 지금 항목과 같은 바탕이다(오른쪽 그림 — 증권). 1280 미만이어도 Menu Sheet 로 바꾸지 않는다 — Menu 의 1280 규칙의 예외다. 마우스는 200ms 뒤 열고 100ms 뒤 닫으며, 누르거나 Enter · Space 로도 연다(키보드면 첫 줄로 초점). Esc 는 닫고 초점을 부모로 돌린다.",
    jsx: `{/* 폭으로 저절로 접힌다 — 같은 코드. 손으로 정하려면 collapsed · onCollapsedChange */}
<SideNavigation>…</SideNavigation>`,
    render: () =>
      grid([
        labeled(frame(`${sideNavigation({ uid: ":tip:", groups: DESK_GROUPS, current: "가계부", collapsed: true, height: 380 })}${main("가계부")}${tooltip({ text: "자산", top: itemTop(1) + 22 })}`, 380), "하위 없는 항목 — 이름 말풍선(자산)"),
        labeled(
          frame(
            `${sideNavigation({ uid: ":fly:", groups: DESK_GROUPS, current: "나무증권", collapsed: true, height: 380, flyout: "증권" })}${main("나무증권")}${flyoutMenu({ uid: ":fly:i02button", parent: "증권", items: DESK_GROUPS[0].items[2].sub, current: "나무증권", top: itemTop(2) })}`,
            380,
          ),
          "부모 — 옆 펼침 메뉴(증권 · 지금 화면 나무증권)",
        ),
      ]),
  },

  {
    title: "하위가 지금이면 부모가 펼쳐진 채 — HR",
    description:
      "하위 항목은 아이콘 없이 이름만이고 부모 이름과 같은 자리(40)에서 시작한다. 하위 하나가 지금 화면이면(휴가 현황) 부모(휴가)는 사용자가 손대지 않아도 펼쳐진 채이고 꺾쇠가 위를 가리킨다 — 하위 항목이 지금 항목이다. 부모를 누르면 하위 목록을 펼치고 접기만 하고(높이 · 투명도 300ms — Accordion 과 같다, 모션 줄이기면 150ms 서서히) 어떤 화면으로도 가지 않는다 — 부모에 따로 갈 화면이 필요하면 하위 첫 줄에 둔다(\"전체 보기\"). 빵부스러기 없이 사이드바의 지금 항목과 본문 제목이 위치를 알린다(HR 은 데스크톱 머리가 없다). 묶음 이름은 성격이 다른 항목을 나눌 때만 짧은 명사로 둔다 — 회사 이름처럼 바뀌는 말을 묶음 이름으로 두지 않는다.",
    jsx: `<SideNavigationGroup label="근무">
  <SideNavigationItem href="/calendar" icon={<CalendarDays />} label="캘린더" current={path === "/calendar"} />
  {/* 하위가 지금이면 저절로 펼친다 — defaultOpen 을 주지 않아도 */}
  <SideNavigationItem icon={<Plane />} label="휴가">
    <SideNavigationSubItem href="/vacation/history" label="휴가 현황" current={path === "/vacation/history"} />
    <SideNavigationSubItem href="/vacation/application" label="휴가 신청" current={path === "/vacation/application"} />
  </SideNavigationItem>
</SideNavigationGroup>`,
    render: () => frame(`${sideNavigation({ uid: ":hr:", groups: HR_GROUPS, current: "휴가 현황", logo: "Porest HR", height: 520 })}${main("휴가 현황")}`, 520),
  },

  {
    title: "긴 이름 · 막힌 항목",
    description:
      "이름이 길면 말줄임하지 않고 단어 단위로 줄을 바꾼다(SEED 문서 — 항목이 그만큼 늘어난다). 그래도 이름은 짧게 쓴다(\"상품 정보 관리\" 대신 \"상품 관리\"). 이름은 화면 제목과 같게 둔다 — 사이드바 \"통계 · 분석\" 과 화면 제목 \"통계\" 처럼 갈리지 않게. 막힌 항목(disabled)은 아이콘 · 이름이 fg-disabled 이고 바탕 · 축소가 없으며 누르지 못한다 — 링크 주소를 지우고 aria-disabled 로 남긴다(초점이 그 자리를 잃지 않게).",
    jsx: `<SideNavigationItem href="/work/report" icon={<Briefcase />} label="연말정산 · 의료비 서류 제출 확인" current={path === "/work/report"} />
<SideNavigationItem href="/admin/users" icon={<Users />} label="사용자" disabled={!isAdmin} />`,
    render: () =>
      frame(
        `${sideNavigation({
          uid: ":long:",
          groups: [{ label: "근무", items: [{ icon: "layoutGrid", label: "홈" }, { icon: "briefcase", label: "연말정산 · 의료비 서류 제출 확인" }, { icon: "users", label: "사용자", disabled: true }] }],
          current: "홈",
          logo: "Porest HR",
          height: 300,
        })}${main("홈")}`,
        300,
      ),
  },
];
