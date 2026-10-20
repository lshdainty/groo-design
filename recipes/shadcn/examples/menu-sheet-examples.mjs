/*
 * shadcn Menu Sheet 예제 — docs site components/menu-sheet.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(머리 더보기 · 글만)은 차례 · 제목 · 코드가 specs/components/menu-sheet.md 의
 * "코드" 절과 같고, 뒤의 둘(줄의 ⋮ · 상태)은 md 의 Guidelines · Properties 를 코드로 더 보인다(줄의 ⋮ 코드는 menu.md 의 것과 같다).
 *
 * SURFACE · LIST · CLOSE · ITEM · ITEM_ENABLED · ITEM_CONTENT · ITEM_CONTENT_PRESS · TONE 은 recipes/shadcn/components/ui/menu-sheet.tsx 의 상수와,
 * HEADER · TITLE · DESCRIPTION · GROUP · ITEM_ICON · ITEM_BODY · ITEM_LABEL · ITEM_DESCRIPTION 은 그 파일의 JSX 에 적힌 클래스와 글자 하나까지
 * 같아야 한다 — 두 파일을 함께 고친다. 시트의 바탕 OVERLAY · CONTENT · HANDLE 은 menu-sheet.tsx 가 쓰는 bottom-sheet.tsx(BottomSheetSurface)의
 * 상수와 같다 — bottom-sheet-examples.mjs 의 것과도 같다(bottom-sheet.tsx 를 고치면 셋을 함께).
 * 규칙은 specs/components/menu-sheet.md, 수치 원본은 specs/components/menu-sheet.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 딤 <div data-slot="bottom-sheet-overlay"> 와 시트 <div role="dialog" data-slot="menu-sheet-content">
 * > 손잡이 <div data-slot="bottom-sheet-handle">(늘) · 머리 <div data-slot="menu-sheet-header">(제목 <h2> · 설명 <p>) · 목록
 * <div data-slot="menu-sheet-list"> > 묶음 <div data-slot="menu-sheet-group"> > 줄 <button data-slot="menu-sheet-item"> > 콘텐츠
 * <span data-slot="menu-sheet-item-content">(아이콘 · 이름 · 설명) · 보조 기술용 닫기 <button data-slot="menu-sheet-close">(키보드 초점이 오면 보인다).
 * 레시피는 시트의 클래스를 cn(바탕 CONTENT, SURFACE) 로 합친다 — merge() 로 똑같이 합친다(위 모서리 r6 → r5, 아래 여백 → 16 + 안전 영역).
 * vaul · Radix 가 실행 중에 붙이는 것 중 열림(data-state="open")과 vaul 의 표식(data-vaul-drawer · data-vaul-overlay · data-vaul-snap-points —
 * 클래스가 읽는다) · 이름 잇기(id · aria-labelledby · aria-describedby) · tabindex="-1" 을 그린다. 시트는 화면(fixed)에 뜬다 — 미리보기 틀(STAGE)에
 * transform 을 줘 fixed 의 기준을 틀로 바꾸고, isolation 으로 z-index(딤 z-modal 100 · 시트 z-modal-content 101)를 틀 안에 가둔다. 높이 상한 max-h-[90dvh] 는 창 높이를
 * 따르므로 미리보기는 틀 높이의 90% 를 style 로 한 번 더 적는다(SHEET_FIT — 미리보기용 덧칠). 틀 안의 뒤 화면(메모 · 프로필 줄)은 미리보기 그림이다.
 * 사이트의 `.content p { margin: 12px 0; color: text-primary }` 는 층(@layer) 밖 규칙이라 Tailwind utility 를 늘 이긴다 — 머리 설명 <p> 에는
 * 클래스가 정한 바깥 여백 · 글자색을 style 로 한 번 더 적는다(P_FIX). 모션 클래스는 vaul 의 키프레임을 읽는데 사이트에는 vaul 의 CSS 가 없다 —
 * 열린 순간을 멈춘 그림이다. 레시피의 스크립트(끌기 · 바깥 누르기 · Esc · 뒤로 가기 · 초점 가두기 · 누르는 순간 --press-basis 재기 · 닫힌 뒤 onSelect)는
 * 정적 HTML 에 없다 — 줄에 마우스를 올리거나 누르면 바탕 · 글자색 · 축소는 레시피 그대로 바뀌지만 시트는 열린 채 그대로다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── menu-sheet.tsx 의 상수와 같은 값 ───────────────────────────────────────

// 시트 — Bottom Sheet 의 바탕 위에 모서리 20 · 위 24(손잡이 자리) · 좌우 화면 여백 · 아래 16 + 안전 영역
const SURFACE = "rounded-t-r5 px-global-gutter pt-x6 pb-[calc(var(--spacing-x4)+env(safe-area-inset-bottom))]";

// 목록 — 묶음 사이 10. 화면의 90% 를 넘으면 목록만 스크롤한다(머리는 그대로)
const LIST = "flex min-h-0 flex-col gap-x2_5 overflow-y-auto";

// 보조 기술용 닫기 — 평소에는 화면에서 숨기고(읽기 프로그램은 읽는다), 키보드 초점이 오면 폭 전체 버튼으로 보인다
const CLOSE = [
  "absolute -m-px size-px shrink-0 overflow-hidden whitespace-nowrap border-0 p-0 [clip-path:inset(50%)]",
  "cursor-pointer bg-bg-neutral-weak font-sans text-t5 font-medium text-fg-neutral",
  "focus-visible:relative focus-visible:m-0 focus-visible:mt-x2_5 focus-visible:flex focus-visible:h-auto focus-visible:min-h-13 focus-visible:w-full",
  "focus-visible:items-center focus-visible:justify-center focus-visible:overflow-visible focus-visible:whitespace-normal focus-visible:[clip-path:none]",
  "focus-visible:rounded-r3 focus-visible:px-x5",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)] hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed",
].join(" ");

// 줄 — 최소 52 · 위아래 14 · 좌우 16. 줄 사이 선은 안쪽 아래 1px(묶음의 마지막 줄에는 없다). 호버 · 누름 바탕은 막히지 않은 줄만
const ITEM = [
  "group/menu-sheet-item relative flex min-h-13 w-full shrink-0 cursor-pointer select-none items-center border-0 bg-transparent px-x4 py-x3_5 font-sans",
  "not-last:shadow-[inset_0_-1px_0_0_var(--color-stroke-neutral-weak)]",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed",
].join(" ");
const ITEM_ENABLED = "hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed";

// 콘텐츠 층 — 아이콘 22 ↔ 글 14. 누르는 동안만 준다(바탕은 그대로)
const ITEM_CONTENT =
  "relative flex min-w-0 flex-1 items-center gap-x3_5 [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const ITEM_CONTENT_PRESS =
  "group-active/menu-sheet-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/menu-sheet-item:[scale:1]";

// 글자색 — 쉴 때 · 호버 · 누름(누름 바탕 위 4.5:1). 막힌 줄은 전용 색 하나
const TONE = {
  neutral: {
    fg: "text-fg-neutral",
    description: "text-fg-neutral-subtle group-hover/menu-sheet-item:text-fg-neutral-muted group-active/menu-sheet-item:text-fg-neutral-muted",
  },
  critical: {
    fg: "text-fg-critical group-hover/menu-sheet-item:text-fg-critical-contrast group-active/menu-sheet-item:text-fg-critical-contrast",
    description: "text-fg-neutral-subtle group-hover/menu-sheet-item:text-fg-neutral-muted group-active/menu-sheet-item:text-fg-neutral-muted",
  },
};

// ── menu-sheet.tsx 의 JSX 에 적힌 클래스 ───────────────────────────────────

// 머리 — 가운데 · 제목 ↔ 설명 4 · 아래 16. 제목 t6 18 / 24 · 700, 설명 t4 · fg-neutral-muted
const HEADER = "flex shrink-0 flex-col gap-x1 pb-x4 text-center";
const TITLE = "m-0 text-t6 font-bold text-fg-neutral";
const DESCRIPTION = "m-0 text-t4 font-normal text-fg-neutral-muted";
// 묶음 — 옅은 회색 상자 · 모서리 16. 레시피는 cn(GROUP, className)
const GROUP = "flex shrink-0 flex-col overflow-hidden rounded-r4 bg-bg-neutral-weak";
// 줄의 조각 — 아이콘 22 · 글(이름 t5 · 설명 t3 500, 사이 2). 글 칸은 textOnly 면 가운데, 아니면 왼쪽. 레시피는 cn(조각, 글자색)
const ITEM_ICON = "flex shrink-0 [&>svg]:size-[22px]";
const ITEM_BODY = {
  base: "flex min-w-0 flex-col gap-x0_5 break-keep [overflow-wrap:break-word]",
  textOnly: "items-center text-center",
  textWithIcon: "flex-1 items-start text-left",
};
const ITEM_LABEL = "text-t5 font-normal";
const ITEM_DESCRIPTION = "text-t3 font-medium";

// ── bottom-sheet.tsx 의 상수와 같은 값 — 딤 · 시트의 바탕 · 손잡이 ─────────────

// 딤 — 300ms enter 로 나타나고 200ms exit 로 사라진다(모션 줄이기면 150ms). 끄는 동안은 손가락을 바로 따른다
const OVERLAY = [
  "fixed inset-0 z-(--z-modal) bg-[var(--overlay-dim-light)] dark:bg-[var(--overlay-dim-dark)]",
  "[animation-duration:var(--sheet-anim-duration)]! [animation-timing-function:var(--sheet-anim-ease)]!",
  "data-[state=open]:[--sheet-anim-duration:var(--motion-duration-d6)] data-[state=open]:[--sheet-anim-ease:var(--motion-ease-enter)]",
  "data-[state=closed]:[--sheet-anim-duration:var(--motion-duration-d4)] data-[state=closed]:[--sheet-anim-ease:var(--motion-ease-exit)]",
  "motion-reduce:data-[state]:data-[vaul-overlay]:[--sheet-anim-duration:var(--motion-duration-d3)]",
  "[&:not(:has(+.vaul-dragging))]:[transition:opacity_var(--motion-duration-d4)_var(--motion-ease-exit)]!",
].join(" ");

// 시트의 바탕 — 최대 480 가운데, 위 모서리 r6, 내용만큼(최대 90%), 바닥 아래 안전 영역. Menu Sheet 는 SURFACE 로 모서리 · 여백을 덮는다
const CONTENT = [
  "fixed inset-x-0 bottom-0 z-(--z-modal-content) mx-auto flex max-h-[90dvh] w-full max-w-[480px] flex-col",
  "rounded-t-r6 bg-bg-layer-floating pb-[env(safe-area-inset-bottom)] font-sans text-fg-neutral outline-none",
  // 열림 300ms enter-expressive · 닫힘 200ms exit(vaul 의 slideFromBottom · slideToBottom 그대로, 시간 · 곡선만)
  "[animation-duration:var(--sheet-anim-duration)]! [animation-timing-function:var(--sheet-anim-ease)]!",
  "data-[state=open]:[--sheet-anim-duration:var(--motion-duration-d6)] data-[state=open]:[--sheet-anim-ease:var(--motion-ease-enter-expressive)]",
  "data-[state=closed]:[--sheet-anim-duration:var(--motion-duration-d4)] data-[state=closed]:[--sheet-anim-ease:var(--motion-ease-exit)]",
  // 끌다 놓아 제자리로 200ms exit · 스냅 높이 사이 300ms enter-expressive. 끄는 동안은 손가락을 바로 따른다
  "[&:not(.vaul-dragging)]:[transition:transform_var(--sheet-move-duration)_var(--sheet-move-ease)]!",
  "[--sheet-move-duration:var(--motion-duration-d4)] [--sheet-move-ease:var(--motion-ease-exit)]",
  "data-[vaul-snap-points=true]:[--sheet-move-duration:var(--motion-duration-d6)] data-[vaul-snap-points=true]:[--sheet-move-ease:var(--motion-ease-enter-expressive)]",
  // 모션 줄이기 — 미끄러지지 않고 150ms 서서히 나타나고 사라진다. 제자리 · 스냅 이동은 바로
  "motion-reduce:data-[state=open]:[animation-name:fadeIn]! motion-reduce:data-[state=closed]:[animation-name:fadeOut]!",
  "motion-reduce:data-[state]:data-[vaul-drawer]:[--sheet-anim-duration:var(--motion-duration-d3)]",
  "motion-reduce:data-[vaul-drawer]:data-[vaul-snap-points]:[--sheet-move-duration:0s]",
].join(" ");

// 손잡이 — 36 × 4 · 위 6 가운데, 누르는 영역 44. Menu Sheet 는 늘 단다(handle="always" — 누르면 닫는다)
const HANDLE = [
  "absolute left-1/2 top-x1_5 h-1 w-9 -translate-x-1/2 cursor-pointer rounded-full bg-stroke-neutral-weak",
  "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
].join(" ");

// ── cn 풀이 ───────────────────────────────────────────────────────────────

// "group-hover/menu-sheet-item:text-fg-neutral-muted" → ["group-hover/menu-sheet-item", "text-fg-neutral-muted"] — 괄호 안의 ":" 는 가르지 않는다
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

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다. 이 파일이 합치는 클래스에 나오는 무리만 안다 — 배경 · 글자색(text-fg-* ·
// text-t* 는 글자 크기라 겹치지 않는다 — recipes/shadcn/lib/utils.ts) · 위 모서리 · 아래 여백 · 임의 속성([prop:…]). 그래서 시트의 SURFACE 가 바탕의
// rounded-t-r6 · pb-[env(…)] 를, 강제 상태의 누름 바탕 · 글자색이 쉴 때의 것을 지운다.
// 닫기의 강제 포커스는 레시피의 cn() 이 아니라 CSS 차례(focus-visible: 가 뒤에 와서 이긴다)를 흉내 낸다 — 자리 · 바깥 여백 · 넘침 · 줄바꿈 ·
// 크기(w · h 가 size 를 덮는다) 무리를 더 안다(VISIBLE_GROUPS)
const GROUPS = [
  [/^bg-/, "bg"],
  [/^text-(fg|static)-/, "text-color"],
  [/^rounded-t-/, "rounded-t"],
  [/^pb-/, "pb"],
];
const VISIBLE_GROUPS = [
  ...GROUPS,
  [/^(absolute|relative|fixed|sticky|static)$/, "position"],
  [/^-?m-/, "m"],
  [/^overflow-/, "overflow"],
  [/^whitespace-/, "whitespace"],
];

function merge(classList, groups = GROUPS) {
  const seen = new Set();
  const kept = [];
  for (const cls of classList.split(/\s+/).filter(Boolean).reverse()) {
    const segs = splitVariants(cls);
    const utility = segs.pop();
    const prefix = segs.join(":");
    const prop = /^\[([\w-]+):/.exec(utility);
    const group = prop ? `[${prop[1]}]` : groups.find(([re]) => re.test(utility))?.[1];
    if (groups === VISIBLE_GROUPS && /^size-/.test(utility) && (seen.has(`${prefix}|w`) || seen.has(`${prefix}|h`))) continue;
    if (groups === VISIBLE_GROUPS && /^w-/.test(utility)) seen.add(`${prefix}|w`);
    if (groups === VISIBLE_GROUPS && /^h-/.test(utility)) seen.add(`${prefix}|h`);
    if (group) {
      const key = `${prefix}|${group}`;
      if (seen.has(key)) continue;
      seen.add(key);
    }
    kept.push(cls);
  }
  return kept.reverse().join(" ");
}

// 정적 미리보기에서 호버 · 누름 · 키보드 포커스를 보이려고 — 그 상태의 클래스에서 접두어만 뗀 사본을 뒤에 붙인다(merge 가 겹치는 기본값을 지운다).
// 값은 레시피 그대로라 menu-sheet.tsx 가 바뀌면 같이 따라간다
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

const forced = (classList, states, groups) => merge([classList, ...states.map((s) => forceState(classList, s))].join(" "), groups);
// 줄의 강제 상태 — 호버(웹) · 누름 · 키보드 포커스. 줄 · 글자색은 줄(hover · active)과 묶음 이름(group-hover · group-active)을 함께 뗀다
const FORCE = {
  hovered: ["hover", "group-hover/menu-sheet-item"],
  pressed: ["active", "group-active/menu-sheet-item"],
  focused: ["focus-visible"],
};

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기는 감싼 자리의 [&>svg]:size-* 가 정한다
const svg = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const ICONS = {
  folderInput: svg(
    '<path d="M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"/><path d="M2 13h10"/><path d="m9 16 3-3-3-3"/>',
  ),
  folderOutput: svg(
    '<path d="M2 7.5V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-1.5"/><path d="M2 13h10"/><path d="m5 10-3 3 3 3"/>',
  ),
  arrowDownUp: svg('<path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/>'),
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
  archive: svg('<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>'),
};

// 미리보기 틀 — 레시피의 딤 · 시트는 화면(fixed)에 뜬다. transform 이 fixed 의 기준을 틀로 바꾸고 isolation 이 z-index 를 틀 안에 가둔다.
// 폭은 휴대폰(360)이다 — 메뉴 시트는 1280 미만에서 쓴다
const STAGE = (height) =>
  `position:relative; isolation:isolate; transform:translateZ(0); overflow:hidden; width:100%; max-width:360px; height:${height}px; margin:0 auto; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-default);`;
// 높이 상한(90dvh)을 틀 높이로 — 레시피에는 없는 미리보기용 덧칠
const SHEET_FIT = (height) => `max-height:${Math.round(height * 0.9)}px;`;
// 사이트의 `.content p` 를 덮는 미리보기용 덧칠 — 머리 설명의 바깥 여백 0 · 글자색
const P_FIX = { description: "margin:0; color:var(--color-fg-neutral-muted);" };
// 뒤 화면 — 제목 + 줄(미리보기 그림). 시트가 열린 동안 보조 기술에는 숨는다
const PAGE_ROW =
  "display:flex; justify-content:space-between; gap:var(--spacing-x3); padding:var(--spacing-x3) 0; font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const page = (title, rows) =>
  `<div aria-hidden="true" style="padding:var(--spacing-x6); font-family:var(--font-sans);"><div style="margin-bottom:var(--spacing-x2); font-size:var(--text-t7); line-height:var(--text-t7--line-height); font-weight:700; color:var(--color-fg-neutral);">${title}</div>${rows
    .map(([a, b]) => `<div style="${PAGE_ROW}"><span>${a}</span><span style="color:var(--color-fg-neutral-subtle);">${b}</span></div>`)
    .join("")}</div>`;
const MEMO_PAGE = page("메모", [
  ["주간 회의 메모", "⋮"],
  ["장보기 목록", "⋮"],
  ["여행 준비", "⋮"],
  ["읽을 책", "⋮"],
]);
const CAPTION =
  "font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";

// <MenuSheetItem> — 아이콘 · 이름 · 설명 · tone · disabled. force = "hovered" · "pressed" · "focused" 는 미리보기용 강제 상태.
// pressBasis 는 레시피가 누르는 순간 재는 기준 길이(줄 폭 ÷ 4 — 폰 시트 312 면 78)다
function menuSheetItem({ label, description, icon, tone = "neutral", disabled = false, force, pressBasis = 78 }, layout) {
  const textOnly = layout === "textOnly";
  const colors = TONE[tone];
  const states = (force && FORCE[force]) || [];
  const color = (cls) => (states.length ? forced(cls, states) : cls);
  const fg = disabled ? "text-fg-disabled" : color(colors.fg);
  const descriptionColor = disabled ? "text-fg-disabled" : color(colors.description);
  const base = merge([ITEM, !disabled && ITEM_ENABLED].filter(Boolean).join(" "));
  const cls = states.length ? forced(base, states) : base;
  const contentBase = merge([ITEM_CONTENT, textOnly && "justify-center", !disabled && ITEM_CONTENT_PRESS].filter(Boolean).join(" "));
  const content = states.length ? forced(contentBase, states) : contentBase;
  const button = attrs([
    'type="button"',
    disabled && "disabled",
    'data-slot="menu-sheet-item"',
    `data-tone="${tone}"`,
    `class="${cls}"`,
    force === "pressed" && `style="--press-basis:${pressBasis}"`,
  ]);
  const iconHtml = !textOnly && icon != null ? `<span aria-hidden="true" data-slot="menu-sheet-item-icon" class="${merge(`${ITEM_ICON} ${fg}`)}">${icon}</span>` : "";
  const descriptionHtml =
    !textOnly && description != null
      ? `<span data-slot="menu-sheet-item-description" class="${merge(`${ITEM_DESCRIPTION} ${descriptionColor}`)}">${esc(description)}</span>`
      : "";
  const body = `${ITEM_BODY.base} ${textOnly ? ITEM_BODY.textOnly : ITEM_BODY.textWithIcon}`;
  return `<button ${button}><span data-slot="menu-sheet-item-content" class="${content}">${iconHtml}<span class="${body}"><span data-slot="menu-sheet-item-label" class="${merge(`${ITEM_LABEL} ${fg}`)}">${esc(label)}</span>${descriptionHtml}</span></span></button>`;
}

// <MenuSheetGroup>
const menuSheetGroup = (items, layout) => `<div data-slot="menu-sheet-group" class="${GROUP}">${items.map((item) => menuSheetItem(item, layout)).join("")}</div>`;

// 보조 기술용 닫기 — focused 면 키보드 초점이 온 모습(focus-visible: 를 뗀 사본이 숨김 클래스를 덮는다)
const closeButton = (focused = false) =>
  `<button type="button" data-slot="menu-sheet-close" class="${focused ? forced(CLOSE, ["focus-visible"], VISIBLE_GROUPS) : CLOSE}">닫기</button>`;

// <MenuSheet open> + <MenuSheetContent>. uid 는 Radix 가 만드는 id 의 앞말(예제마다 달리한다). groups = [[줄 …], …]
function menuSheet({ uid, title, description, layout = "textWithIcon", groups, closeFocused = false, height = 560, pageHtml = MEMO_PAGE }) {
  const titleId = `${uid}-title`;
  const descriptionId = `${uid}-description`;
  const content = attrs([
    'role="dialog"',
    `id="${uid}"`,
    description != null && `aria-describedby="${descriptionId}"`,
    `aria-labelledby="${titleId}"`,
    'data-state="open"',
    'tabindex="-1"',
    'data-vaul-drawer=""',
    'data-vaul-drawer-direction="bottom"',
    'data-vaul-snap-points="false"',
    'data-slot="menu-sheet-content"',
    `data-layout="${layout}"`,
    'aria-modal="true"',
    `class="${merge(`${CONTENT} ${SURFACE}`)}"`,
    `style="${SHEET_FIT(height)}"`,
  ]);
  const header = `<div data-slot="menu-sheet-header" class="${HEADER}"><h2 id="${titleId}" data-slot="menu-sheet-title" class="${TITLE}">${esc(title)}</h2>${
    description != null ? `<p id="${descriptionId}" data-slot="menu-sheet-description" class="${DESCRIPTION}" style="${P_FIX.description}">${esc(description)}</p>` : ""
  }</div>`;
  const list = `<div data-slot="menu-sheet-list" class="${LIST}">${groups.map((items) => menuSheetGroup(items, layout)).join("")}</div>`;
  const overlay = `<div data-vaul-overlay="" data-vaul-snap-points="false" data-state="open" data-slot="bottom-sheet-overlay" class="${OVERLAY}"></div>`;
  return `<div style="${STAGE(height)}">${pageHtml}${overlay}<div ${content}><div aria-hidden="true" data-slot="bottom-sheet-handle" class="${HANDLE}"></div>${header}${list}${closeButton(closeFocused)}</div></div>`;
}

// ── 예제 ──────────────────────────────────────────────────────────────────

export const menuSheetExamples = [
  {
    title: "머리 더보기 — 늘 시트",
    description:
      "폰 전용 화면의 머리 더보기처럼 늘 시트인 자리는 MenuSheet 를 바로 쓴다(줄의 동작은 ResponsiveMenu — 아래 예제). 시트는 최대 480 · 위 두 모서리 20 · 위 24(손잡이 자리) · 좌우 화면 여백 24 · 아래 16 + 안전 영역이고, 그림자 없이 딤(0.50 · 다크 0.65) 위에 뜬다. 손잡이(36 × 4)는 늘 있고 위 닫기 버튼은 없다 — 딤 · 끌어내리기 · Esc · 뒤로 가기로 닫는다. 머리는 가운데 — 제목 18/24 · 700(무엇의 동작인지). 묶음은 옅은 회색 상자(bg-neutral-weak · 모서리 16)이고, 줄은 최소 52 · 위아래 14 · 좌우 16 · 아이콘 22 ↔ 이름 16/22 사이 14 다. 줄 사이에 1px stroke-neutral-weak 선을 긋고 묶음의 마지막 줄 아래는 없다. 줄을 누르면 시트를 닫고, 초점이 트리거로 돌아온 뒤 onSelect 를 부른다.",
    jsx: `import { MenuSheet, MenuSheetContent, MenuSheetGroup, MenuSheetItem, MenuSheetTrigger } from "@/components/ui/menu-sheet"

<MenuSheet>
  <MenuSheetTrigger asChild>
    <Button variant="ghost" layout="iconOnly" aria-label="메모 더보기">
      <EllipsisVertical />
    </Button>
  </MenuSheetTrigger>
  <MenuSheetContent title="메모">
    <MenuSheetGroup>
      <MenuSheetItem icon={<FolderInput />} label="가져오기" onSelect={importMemos} />
      <MenuSheetItem icon={<FolderOutput />} label="내보내기" onSelect={exportMemos} />
      <MenuSheetItem icon={<ArrowDownUp />} label="정렬 바꾸기" onSelect={openSort} />
    </MenuSheetGroup>
  </MenuSheetContent>
</MenuSheet>`,
    render: () =>
      menuSheet({
        uid: "menu-sheet-ex-header",
        title: "메모",
        groups: [
          [
            { icon: ICONS.folderInput, label: "가져오기" },
            { icon: ICONS.folderOutput, label: "내보내기" },
            { icon: ICONS.arrowDownUp, label: "정렬 바꾸기" },
          ],
        ],
      }),
  },

  {
    title: "글만 — 가운데 정렬",
    description:
      "아이콘 없이 글만 쓰면(layout=\"textOnly\") 이름을 가운데에 두고 줄 설명을 두지 않는다 — 한 시트에서 아이콘 줄과 섞지 않는다. 묶음은 줄이 3개 이상일 때부터, 최대 3묶음이고 한 묶음에는 2개 이상이다(위험한 동작 묶음은 하나여도 된다). 되돌릴 수 없는 동작은 맨 아래 묶음에 critical(이름만 fg-critical)로 두고, 확인은 시트가 닫힌 뒤 Alert Dialog 로 받는다.",
    jsx: `<MenuSheetContent title="사진" layout="textOnly">
  <MenuSheetGroup>
    <MenuSheetItem label="앨범에서 고르기" onSelect={pickFromAlbum} />
    <MenuSheetItem label="사진 찍기" onSelect={takePhoto} />
  </MenuSheetGroup>
  <MenuSheetGroup>
    <MenuSheetItem label="사진 지우기" tone="critical" onSelect={askRemovePhoto} />
  </MenuSheetGroup>
</MenuSheetContent>`,
    render: () =>
      menuSheet({
        uid: "menu-sheet-ex-text-only",
        title: "사진",
        layout: "textOnly",
        height: 520,
        pageHtml: page("프로필", [
          ["이름", "김지원"],
          ["이메일", "groo@example.com"],
          ["가입일", "2026년 3월 2일"],
        ]),
        groups: [[{ label: "앨범에서 고르기" }, { label: "사진 찍기" }], [{ label: "사진 지우기", tone: "critical" }]],
      }),
  },

  {
    title: "줄의 ⋮ — 1280 미만은 이 시트",
    description:
      "줄의 동작은 menu.tsx 의 ResponsiveMenu 로 짠다 — 1280 이상은 Menu, 미만은 같은 줄 · 같은 순서 · 같은 막힘의 이 시트다. title 은 시트의 제목(무엇의 동작인지 — 줄 이름)이 되고, 메뉴에만 쓰이는 suffixIcon 은 시트에서 그리지 않는다. 폰의 스와이프는 같은 동작의 지름길로 남기고, ⋮ 는 키보드 · 스크린리더 · 미는 법을 모르는 사람이 가는 길이다 — 트레이와 같은 동작 · 같은 이름 · 같은 확인창이다. 트리거는 aria-haspopup=\"dialog\" · aria-expanded 다.",
    jsx: `import {
  ResponsiveMenu, ResponsiveMenuContent, ResponsiveMenuGroup, ResponsiveMenuItem, ResponsiveMenuTrigger,
} from "@/components/ui/menu"

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
      menuSheet({
        uid: "menu-sheet-ex-row",
        title: "주간 회의 메모",
        groups: [
          [
            { icon: ICONS.pin, label: "고정" },
            { icon: ICONS.pencil, label: "수정" },
            { icon: ICONS.copy, label: "복사해 새로 쓰기" },
          ],
          [{ icon: ICONS.trash2, label: "삭제", tone: "critical" }],
        ],
      }),
  },

  {
    title: "상태 — 호버 · 누름 · 키보드 · 막힌 줄 · 보조 기술용 닫기",
    description:
      "마우스를 올리거나 누르면 줄 바탕이 bg-neutral-weak-pressed 로 칠해지고, 누르면 아이콘 · 글만 2px 거리로 준다(바탕은 그대로 — 기준 max(높이, 폭 ÷ 4, 24) 를 누르는 순간 잰다). 칠한 동안 설명은 fg-neutral-muted, 위험한 줄의 이름 · 아이콘은 fg-critical-contrast 로 짙어진다 — 누름 바탕 위에서도 4.5:1 이다. 키보드 포커스는 줄 안쪽 2px 링(stroke-focus-ring)이고 묶음 상자가 넘친 링을 자른다. 막힌 줄은 아이콘 · 이름 · 설명이 fg-disabled 이고 눌러도 실행하지 않는다(<button disabled> — Tab 이 서지 않는다). 보조 기술용 닫기는 목록 뒤에 있고 평소에는 보이지 않다가 키보드 초점이 오면 위 10 · 최소 52 · 좌우 20 · 모서리 12 · bg-neutral-weak 의 폭 전체 버튼으로 보인다(링은 바깥 2px). 정적 미리보기라 상태는 hover: · active: · group-hover/menu-sheet-item: · group-active/menu-sheet-item: · focus-visible: 클래스에서 접두어만 뗀 사본을 덧붙여 그렸다.",
    jsx: `// 상태는 고르는 prop 이 없다 — 올리면 · 누르면 줄 바탕과 글자색이 바뀌고, 키보드 포커스는 줄 안쪽 링이다
<MenuSheetItem icon={<Archive />} label="보관" description="목록에서 숨기고 보관함으로 옮겨요." onSelect={archive} />
<MenuSheetItem icon={<Trash2 />} label="삭제" tone="critical" onSelect={askDelete} />
<MenuSheetItem icon={<Copy />} label="복사해 새로 쓰기" disabled onSelect={duplicate} />
// 보조 기술용 닫기는 MenuSheetContent 가 목록 뒤에 그린다`,
    render: () => {
      const surface = (html, caption) =>
        `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2); min-width:0;"><div style="padding:var(--spacing-x2); border-radius:var(--radius-r3); background:var(--color-bg-layer-floating); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle);">${html}</div><span style="${CAPTION}">${caption}</span></div>`;
      const archive = { icon: ICONS.archive, label: "보관", description: "목록에서 숨기고 보관함으로 옮겨요." };
      const remove = { icon: ICONS.trash2, label: "삭제", tone: "critical" };
      // 한 칸에 한 줄만 그 상태로 — 마우스 · 키보드는 한 번에 한 줄에만 있다
      const cell = (rows, caption) => surface(menuSheetGroup(rows), caption);
      return `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 240px), 1fr)); gap:var(--spacing-x6) var(--spacing-x4); align-items:start;">${[
        cell([archive, remove], "enabled"),
        cell([{ ...archive, force: "hovered" }, remove], "hovered — 설명 fg-neutral-muted"),
        cell([archive, { ...remove, force: "hovered" }], "hovered — 위험 fg-critical-contrast"),
        cell([{ ...archive, force: "pressed" }, remove], "pressed — 바탕 + 2px 축소"),
        cell([{ ...archive, force: "focused" }, remove], "focused — 줄 안쪽 링"),
        surface(menuSheetGroup([{ ...archive }, { icon: ICONS.copy, label: "복사해 새로 쓰기", disabled: true }]), "disabled"),
        surface(`${menuSheetGroup([{ icon: ICONS.pin, label: "고정" }])}${closeButton(true)}`, "보조 기술용 닫기 — 키보드 초점"),
      ].join("")}</div>`;
    },
  },
];
