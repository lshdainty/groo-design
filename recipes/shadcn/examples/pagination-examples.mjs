/*
 * shadcn Pagination 예제 — docs site components/pagination.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(데스크톱 목록 — 쪽은 주소에 · 폰 목록 — 끝없이 불러오기)은 차례 · 제목 · 코드가
 * specs/components/pagination.md 의 "코드" 절과 같고, 뒤의 둘(칸 수 9 · 7 · 막힘)은 md 의 Properties 를 코드로 더 보인다.
 * 옛 Pagination(shadcn — 지금 쪽 테두리 · 칸 사이 4 · 이전 · 다음 글자 · 더 보기)을 대신한다 — 구조는 SEED Pagination 이다.
 *
 * CELL · CELL_ENABLED · CELL_OTHER · CELL_CURRENT · CELL_DISABLED · CELL_DISABLED_CURRENT · LABEL 은 recipes/shadcn/components/ui/pagination.tsx 의
 * 상수와, NAV · ROW · ELLIPSIS_CELL · EMPTY_CELL · ARROW_ICON · STATUS · END_* 는 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 —
 * 두 파일을 함께 고친다. paginationItems(· range · ELLIPSIS · middleItems)는 그 파일의 함수를 형 표기만 떼고 옮긴 것이다(같은 입력에 같은 칸).
 * 받는 중의 원 PC_* 는 progress-circle.tsx(progress-circle-examples.mjs)의 것, 다시 시도 BUTTON_* 는 button.tsx 의 cva 와 같다 — 이 파일이 쓰는
 * 변형 · 크기(neutralWeak · small)와 그에 걸리는 compound 만 옮겼다.
 * 규칙은 specs/components/pagination.md, 수치 원본은 specs/components/pagination.yaml(넘김 줄) · infinite-list.yaml(폰의 목록 끝 자리).
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 넘김 줄 <nav aria-label data-slot="pagination" data-slots> > 줄 <div data-slot="pagination-row"> > 칸
 * (쪽 번호 <a|button data-slot="pagination-item" data-page> · 이전 · 다음 <… data-slot="pagination-previous|next"> · 생략 <span data-slot="pagination-ellipsis"> ·
 * 빈 칸 <span data-slot="pagination-empty">) + 숨은 상태 글 <span role="status" data-slot="pagination-status">. 목록 끝 자리
 * <div data-slot="infinite-list-end" data-status> > (원) · 상태 글 <div role="status" data-slot="infinite-list-end-message"> · (다시 시도).
 * 레시피가 cn() 으로 합치는 칸 클래스는 merge() 로 똑같이 합친다 — 지금 쪽의 bg-bg-neutral-inverted · text-fg-neutral-inverted 가 CELL 의
 * bg-transparent · CELL_ENABLED 의 text-fg-neutral 을 지운다. 칸 수는 레시피가 창 폭(480)으로 고른다 — 미리보기는 9 · 7 을 정해 그렸다.
 * 미리보기의 링크 주소는 # 이다 — 눌러도 문서를 떠나지 않게(레시피는 getHref 가 돌려준 주소 — "?page=3").
 * 목록 끝의 <p> 에 적은 style 은 사이트의 `.content p { margin: 12px 0; color }` 를 누르는 미리보기용 덧칠이다(P_FIX — 클래스와 같은 값).
 * 레시피의 스크립트(넘기기 · 목록 맨 위로 · "N페이지, 전체 M페이지" 알림 · 끝 쪽에서 초점 옮기기 · 창 폭으로 칸 수 고르기 · 목록 끝 300 에서
 * 다음 쪽 받기 · 1초 기다린 뒤 원 보이기)는 정적 HTML 에 없다 — 받는 중의 원은 1초가 지난 모습으로 그렸다.
 * 목록 줄 · 카드 · 폰 틀은 미리보기 그림(레시피가 아니다)이다. 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── pagination.tsx 의 상수와 같은 값 ─────────────────────────────────────

// 칸 — 40 × 40 · 모서리 8, 누르는 영역은 위아래만 44(::before 2 씩). 키보드 포커스에만 바깥 2px 링 — 이웃 칸 위로 올린다
const CELL = [
  "relative flex size-10 shrink-0 items-center justify-center rounded-r2 border-0 bg-transparent p-0 font-sans no-underline",
  "before:absolute before:inset-x-0 before:inset-y-[-2px] before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "focus-visible:z-[1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
// 누를 수 있는 칸 — 호버(마우스 기기) · 누름 바탕 + 2px 거리 축소(40 → 0.95)
const CELL_ENABLED = "cursor-pointer text-fg-neutral active:[scale:calc(1-2/40)] motion-reduce:active:[scale:1]";
const CELL_OTHER = "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed";
const CELL_CURRENT = "bg-bg-neutral-inverted text-fg-neutral-inverted hover:bg-bg-neutral-inverted-pressed active:bg-bg-neutral-inverted-pressed";
// 막힌 칸 — 전용 색, 바탕 · 축소 없음(지금 쪽은 bg-disabled)
const CELL_DISABLED = "cursor-not-allowed text-fg-disabled";
const CELL_DISABLED_CURRENT = "bg-bg-disabled";
// 번호 — t4 · 700 · 숫자 폭 고정, 칸을 넘으면 말줄임
const LABEL = "block min-w-0 max-w-full truncate text-t4 font-bold tabular-nums";

// ── pagination.tsx 의 JSX 에 적힌 클래스 ─────────────────────────────────

// 넘김 줄 — 목록 끝 → 줄 24, 가운데. 칸은 사이 없이 잇는다
const NAV = "mt-x6 flex justify-center";
const ROW = "flex items-center";
// 생략 — 40 상자 + 점 셋 16 · 빈 칸(끝 쪽의 화살표 자리) — 보조 기술에 숨긴다
const ELLIPSIS_CELL = "flex size-10 shrink-0 items-center justify-center text-fg-neutral [&>svg]:size-4";
const EMPTY_CELL = "size-10 shrink-0";
// 화살표 아이콘 16
const ARROW_ICON = "size-4";
// 숨은 상태 글 — 쪽이 바뀌면 "N페이지, 전체 M페이지"
const STATUS = "sr-only";
// 목록 끝 자리 — 위아래 24, 가운데. 못 불러옴 t4 · fg-neutral-muted + 12 아래 다시 시도 · 끝 t4 · fg-neutral-subtle
const END_ROOT = "flex flex-col items-center justify-center py-x6 font-sans";
const END_MESSAGE = "flex flex-col items-center text-center break-keep [overflow-wrap:break-word]";
const END_ERROR = "m-0 text-t4 font-normal text-fg-neutral-muted";
const END_END = "m-0 text-t4 font-normal text-fg-neutral-subtle";
const END_RETRY = "mt-x3";

// ── pagination.tsx 의 칸 배열 — 형 표기만 뗐다 ───────────────────────────

const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => ({ type: "page", page: start + i }));

const ELLIPSIS = { type: "ellipsis" };

// 번호 · 생략 칸(화살표 둘을 뺀 칸) — SEED usePagination 의 createItems · createCompactItems 와 같은 식
function middleItems(page, total, slots) {
  const available = slots - 2;
  if (total <= available) return range(1, total);
  if (available === 5) {
    if (page <= 3) return [...range(1, 4), ELLIPSIS];
    if (page >= total - 2) return [ELLIPSIS, ...range(total - 3, total)];
    return [ELLIPSIS, ...range(page - 1, page + 1), ELLIPSIS];
  }
  const siblings = Math.floor((available - 5) / 2); // 9칸이면 1
  const edge = available - 2; // 앞 · 뒤 구간의 번호 수 — 9칸이면 5
  const threshold = edge - siblings; // 9칸이면 4
  if (page <= threshold) return [...range(1, edge), ELLIPSIS, { type: "page", page: total }];
  if (page >= total - threshold + 1) return [{ type: "page", page: 1 }, ELLIPSIS, ...range(total - edge + 1, total)];
  return [{ type: "page", page: 1 }, ELLIPSIS, ...range(page - siblings, page + siblings), ELLIPSIS, { type: "page", page: total }];
}

// 칸 배열 — 앞뒤 화살표(끝 쪽이면 빈 칸) + 번호 · 생략. 1쪽 이하면 빈 배열(넘김 줄을 그리지 않는다)
function paginationItems(page, totalPages, slots = 9) {
  const total = Number.isFinite(totalPages) ? Math.floor(totalPages) : 0;
  if (total <= 1) return [];
  const p = Math.min(Math.max(Number.isFinite(page) ? Math.floor(page) : 1, 1), total);
  const n = slots === 7 ? 7 : 9;
  return [
    p > 1 ? { type: "previous", page: p - 1 } : { type: "empty" },
    ...middleItems(p, total, n),
    p < total ? { type: "next", page: p + 1 } : { type: "empty" },
  ];
}

const formatNumber = (n) => n.toLocaleString("ko-KR");

// ── progress-circle.tsx 의 상수와 같은 값 — 받는 중의 원 24 ────────────────

const PC_SIZE = { "24": "[--pc-size:24px] [--pc-thickness:3px]" };
const PC_TONE = {
  neutral: "[--pc-track:var(--color-stroke-neutral-subtle)] [--pc-range:var(--color-stroke-neutral-solid)]",
};
const PC_ROOT = "inline-block shrink-0 overflow-visible align-middle";
const PC_SPIN = "animate-[groo-progress-circle-rotate_1200ms_cubic-bezier(0.35,0.25,0.65,0.75)_infinite] motion-reduce:animate-none";
const PC_CIRCLE =
  "fill-none [cx:calc(var(--pc-size)/2)] [cy:calc(var(--pc-size)/2)] [r:calc(var(--pc-size)/2_-_var(--pc-thickness)/2)] [stroke-width:var(--pc-thickness)]";
const PC_TRACK = `${PC_CIRCLE} [stroke:var(--pc-track)]`;
const PC_RANGE = `${PC_CIRCLE} [stroke:var(--pc-range)] [stroke-linecap:round] [transform-box:fill-box] [transform-origin:center] [transform:rotate(-90deg)]`;
const PC_RANGE_INDETERMINATE = [
  "animate-[groo-progress-circle-head_1200ms_cubic-bezier(0.35,0,0.65,1)_infinite,groo-progress-circle-tail_1200ms_cubic-bezier(0.35,0,0.65,0.6)_infinite]",
  "motion-reduce:animate-none motion-reduce:[stroke-dasharray:75_200]",
].join(" ");
const PC_KEYFRAMES = [
  "@keyframes groo-progress-circle-rotate { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }",
  "@keyframes groo-progress-circle-head { 0% { stroke-dasharray: 0 200 } 75%, 100% { stroke-dasharray: 100 200 } }",
  "@keyframes groo-progress-circle-tail { 0%, 33.33% { stroke-dashoffset: 0 } 100% { stroke-dashoffset: -100 } }",
].join("\n");

// ── button.tsx 의 cva 와 같은 값 — 다시 시도(neutralWeak · small · 글) ─────

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
    small: "h-9 rounded-r2 [--press-basis:36] [--progress-size:14px]",
  },
  layout: { withText: "" },
  ghostColor: { neutral: "" },
};
const BUTTON_COMPOUND = [{ size: "small", layout: "withText", className: "px-x3_5 py-x2 gap-x1 text-t4 [&_svg]:size-3.5" }];
const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다. className 은 끝에
function cvaOf(base, { variants = {}, compoundVariants = [], defaultVariants = {} } = {}) {
  return ({ className, ...props } = {}) => {
    const p = { ...defaultVariants };
    for (const [k, v] of Object.entries(props)) if (v !== undefined) p[k] = v;
    const parts = [base];
    for (const [axis, map] of Object.entries(variants)) parts.push(map[p[axis]]);
    for (const { class: cls, className: compound, ...when } of compoundVariants) {
      if (Object.entries(when).every(([k, v]) => p[k] === v)) parts.push(cls, compound);
    }
    parts.push(className);
    return parts.filter(Boolean).join(" ");
  };
}
const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });

// ── cn() 풀이 ───────────────────────────────────────────────────────────

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다 — 이 파일이 합치는 클래스에 나오는 무리(배경 · 글자색)만 안다.
// 변형(hover: · active:)이 붙은 클래스는 같은 변형끼리만 겹친다 — 대괄호 안의 ":" 는 가르지 않는다
const GROUPS = [
  [/^bg-/, "bg"],
  [/^text-(?:fg-|static-)/, "color"],
];
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

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 와 같은 모양(24 격자) — 크기는 놓인 자리가 정한다(화살표 · 점 셋 16)
const svg = (paths, extra = "") =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${paths}</svg>`;
const PATHS = {
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  ellipsis: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
};

// <Pagination> — 칸 수(slots)는 레시피가 창 폭으로 고른다. link 면 칸이 링크(getHref), 아니면 버튼
function pagination({ totalPages, page = 1, slots = 9, link = false, disabled = false, label = "페이지 탐색" }) {
  const items = paginationItems(page, totalPages, slots);
  if (items.length === 0) return "";
  const cells = items
    .map((item) => {
      if (item.type === "ellipsis") return `<span aria-hidden="true" data-slot="pagination-ellipsis" class="${ELLIPSIS_CELL}">${svg(PATHS.ellipsis)}</span>`;
      if (item.type === "empty") return `<span aria-hidden="true" data-slot="pagination-empty" class="${EMPTY_CELL}"></span>`;
      const isArrow = item.type === "previous" || item.type === "next";
      const isCurrent = item.type === "page" && item.page === page;
      const name = item.type === "previous" ? "이전 페이지" : item.type === "next" ? "다음 페이지" : `${formatNumber(item.page)}페이지`;
      const cls = merge(`${CELL} ${disabled ? `${CELL_DISABLED}${isCurrent ? ` ${CELL_DISABLED_CURRENT}` : ""}` : `${CELL_ENABLED} ${isCurrent ? CELL_CURRENT : CELL_OTHER}`}`);
      const common = attrs([
        `aria-label="${name}"`,
        isCurrent && 'aria-current="page"',
        disabled && 'aria-disabled="true"',
        `data-slot="${isArrow ? `pagination-${item.type}` : "pagination-item"}"`,
        `data-page="${item.page}"`,
        isCurrent && 'data-current="true"',
        `class="${cls}"`,
      ]);
      const content = isArrow
        ? svg(item.type === "previous" ? PATHS.chevronLeft : PATHS.chevronRight, ` class="${ARROW_ICON}"`)
        : `<span class="${LABEL}">${formatNumber(item.page)}</span>`;
      return link ? `<a href="#" ${common}>${content}</a>` : `<button type="button" ${common}>${content}</button>`;
    })
    .join("");
  return `<nav aria-label="${esc(label)}" data-slot="pagination" data-slots="${slots}" class="${NAV}"><div data-slot="pagination-row" class="${ROW}">${cells}</div><span role="status" data-slot="pagination-status" class="${STATUS}"></span></nav>`;
}

// 사이트의 `.content p { margin: 12px 0; color: text-primary }` 는 층(@layer) 밖 규칙이라 Tailwind utility 를 늘 이긴다 — 목록 끝의 <p> 에는
// 클래스가 정한 바깥 여백 · 글자색을 style 로 한 번 더 적는다(레시피에는 없는 미리보기용 덧칠)
const P_FIX = {
  error: "margin:0; color:var(--color-fg-neutral-muted);",
  end: "margin:0; color:var(--color-fg-neutral-subtle);",
};

// <ProgressCircle size="24" /> — 받는 중의 원(1초가 지난 모습). 레시피의 data-slot="infinite-list-end-progress" 가 원의 data-slot 을 덮는다
const PC_STYLE = `<style data-href="groo-progress-circle" data-precedence="groo">${PC_KEYFRAMES}</style>`;
const circle24 = () =>
  `<svg ${attrs([
    'role="progressbar"',
    'aria-label="불러오는 중"',
    'data-slot="infinite-list-end-progress"',
    'data-size="24"',
    'data-tone="neutral"',
    'data-mode="indeterminate"',
    `class="${[PC_ROOT, PC_SIZE["24"], PC_TONE.neutral, PC_SPIN].join(" ")}"`,
    'style="width:var(--pc-size); height:var(--pc-size);"',
  ])}><circle data-slot="progress-circle-track" class="${PC_TRACK}"></circle><circle data-slot="progress-circle-range" pathLength="100" class="${PC_RANGE} ${PC_RANGE_INDETERMINATE}"></circle></svg>`;

// <InfiniteListEnd status> — loading(원) · error(글 + 다시 시도) · end(글)
function infiniteListEnd({ status, endText = "모두 봤어요." }) {
  const message =
    status === "error"
      ? `<p class="${END_ERROR}" style="${P_FIX.error}">더 불러오지 못했어요.</p>`
      : status === "end"
        ? `<p class="${END_END}" style="${P_FIX.end}">${esc(endText)}</p>`
        : "";
  const retry =
    status === "error" ? `<button class="${buttonVariants({ variant: "neutralWeak", size: "small", className: END_RETRY })}" data-slot="infinite-list-end-retry">다시 시도</button>` : "";
  return `<div data-slot="infinite-list-end" data-status="${status}" class="${END_ROOT}">${status === "loading" ? circle24() : ""}<div role="status" data-slot="infinite-list-end-message" class="${END_MESSAGE}">${message}</div>${retry}</div>`;
}

// 목록 · 카드 · 폰 틀 — 미리보기 그림(레시피가 아니다)
const CARDS = [
  ["현대카드 M", "포인트 적립 · 연회비 3만원"],
  ["신한카드 Deep Dream", "모든 가맹점 0.7% 적립"],
  ["KB국민 My WE:SH", "통신 · 배달 10% 할인"],
  ["삼성카드 taptap O", "커피 · 대중교통 할인"],
  ["우리카드 카드의정석", "온라인 쇼핑 5% 할인"],
  ["하나카드 원더카드", "해외 결제 수수료 면제"],
];
const SECTION =
  "padding:var(--spacing-x5) var(--spacing-x6) var(--spacing-x6); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-default); font-family:var(--font-sans);";
const SECTION_TITLE = "margin-bottom:var(--spacing-x3); font-size:var(--text-t6); line-height:var(--text-t6--line-height); font-weight:700; color:var(--color-fg-neutral);";
const CARD_GRID = "display:grid; grid-template-columns:repeat(auto-fill, minmax(160px, 1fr)); gap:var(--spacing-x3);";
const CARD =
  "padding:var(--spacing-x3) var(--spacing-x4); border-radius:var(--radius-r3); background:var(--color-bg-layer-basement); font-size:var(--text-t4); line-height:var(--text-t4--line-height); color:var(--color-fg-neutral);";
const CARD_DETAIL = "display:block; margin-top:var(--spacing-x1); font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle);";
const cardList = () =>
  `<section aria-label="카드 혜택" style="${SECTION}"><div style="${SECTION_TITLE}">카드 혜택</div><div style="${CARD_GRID}">${CARDS.map(([t, d]) => `<div style="${CARD}"><b>${esc(t)}</b><span style="${CARD_DETAIL}">${esc(d)}</span></div>`).join("")}</div>${pagination({ totalPages: 12, page: 5, link: true, label: "카드 혜택 페이지 탐색" })}</section>`;
const PHONE =
  "position:relative; display:flex; flex-direction:column; width:100%; max-width:360px; height:300px; overflow:hidden; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-default); font-family:var(--font-sans);";
const ROW_TEXT =
  "display:flex; justify-content:space-between; gap:var(--spacing-x3); padding:var(--spacing-x3) var(--spacing-global-gutter); font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const ROW_DETAIL = "display:block; font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle);";
// 폰 목록 — 끝까지 스크롤한 모습(목록 끝 자리가 보이게 아래로 붙인다)
const phoneList = (end) =>
  `<div style="${PHONE}"><div style="display:flex; flex:1 1 auto; flex-direction:column; justify-content:flex-end; min-height:0; overflow:hidden;"><ul style="margin:0; padding:0; list-style:none;">${CARDS.slice(0, 4)
    .map(([t, d]) => `<li style="${ROW_TEXT}"><span>${esc(t)}<span style="${ROW_DETAIL}">${esc(d)}</span></span></li>`)
    .join("")}</ul>${end}</div></div>`;
const SURFACE =
  "padding:var(--spacing-x2) var(--spacing-x6) var(--spacing-x6); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-default); font-family:var(--font-sans);";
const CAPTION = "display:block; margin-top:var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;
const grid = (items, min = 260) =>
  `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, ${min}px), 1fr)); gap:var(--spacing-x6) var(--spacing-x4); align-items:start;">${items.join("")}</div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const paginationExamples = [
  {
    title: "데스크톱 목록 — 쪽은 주소에",
    description:
      "데스크톱(768 이상)의 긴 목록 아래 가운데에 둔다(목록 끝 → 줄 24). 이전 · 쪽 번호 · 생략 · 다음 칸이 모두 40 × 40 이고 사이 없이 잇는다 — 480 이상이면 9칸(360), 미만이면 7칸(280)이다. 지금 쪽은 짙은 채움(bg-neutral-inverted + fg-neutral-inverted — 다크는 밝은 반전)이고 브랜드 색이 아니다. 번호는 t4 14/19 · 700 · 숫자 폭 고정 · 세 자리마다 쉼표, 화살표는 아이콘만 16 · 모서리 8. 웹 화면의 목록은 쪽을 주소에 둔다(getHref — \"?page=3\") — 칸이 링크라 새 탭에서 열고 주소를 나눌 수 있고, 쪽마다 방문 기록이 쌓여 뒤로 가기가 앞 쪽으로 돌아온다. 쪽을 넘기면 목록(scrollTarget)의 위 끝이 보이게 스크롤하고 \"6페이지, 전체 12페이지\" 를 한 번 알린다. 줄 이름은 \"페이지 탐색\"(목록이 둘 이상이면 \"카드 혜택 페이지 탐색\"), 칸은 \"N페이지\" · \"이전 페이지\" · \"다음 페이지\" 다. 1쪽 이하면 줄을 그리지 않는다.",
    jsx: `import { useSearchParams } from "react-router-dom"
import { Pagination } from "@/components/ui/pagination"

const [params] = useSearchParams()
const page = Number(params.get("page") ?? 1)

<section ref={listRef} aria-labelledby="card-list-title">…</section>
{/* 칸은 링크 — 쪽마다 방문 기록이 쌓여 뒤로 가기가 앞 쪽으로 온다 */}
<Pagination totalPages={totalPages} page={page} getHref={(p) => \`?page=\${p}\`} scrollTarget={listRef} aria-label="카드 혜택 페이지 탐색" />`,
    render: () => cardList(),
  },

  {
    title: "폰 목록 — 끝없이 불러오기",
    description:
      "768 미만의 긴 목록은 쪽을 나누지 않는다 — 목록 끝이 화면 아래에서 300 안으로 오면 onReachEnd 로 다음 쪽을 받아 아래에 잇는다. 목록 바로 다음의 InfiniteListEnd 한 자리(위아래 24 · 가운데)가 지금 상태를 보인다 — 받는 중은 Progress Circle 24 · neutral(1초가 지나야 보인다 — 그 전에는 보이지 않게 그려 높이만 지킨다), 못 불러옴은 \"더 불러오지 못했어요.\"(t4 · fg-neutral-muted) + 12 아래 Button neutralWeak small \"다시 시도\"(이미 받은 줄은 그대로), 끝은 endText(t4 · fg-neutral-subtle — 목록마다 \"카드를 모두 봤어요.\" 처럼)다. 못 불러옴 · 끝 글은 상태 글(role=\"status\")로 한 번 읽힌다. \"더 보기\" 버튼은 두지 않고, 한 쪽으로 끝나는 짧은 목록에는 끝 글을 두지 않는다. 첫 쪽을 못 불러오면 목록 자리가 Result Section 의 실패다.",
    jsx: `import { InfiniteListEnd } from "@/components/ui/pagination"

<ul>{cards.map((c) => <CardRow key={c.id} card={c} />)}</ul>
<InfiniteListEnd
  status={isError ? "error" : hasNextPage ? "loading" : "end"}
  onReachEnd={fetchNextPage}
  onRetry={fetchNextPage}
  endText="카드를 모두 봤어요."
/>`,
    render: () =>
      `${PC_STYLE}${grid([
        labeled(phoneList(infiniteListEnd({ status: "loading" })), "받는 중 — 원 24(1초 뒤)"),
        labeled(phoneList(infiniteListEnd({ status: "error" })), "못 불러옴 — 다시 시도"),
        labeled(phoneList(infiniteListEnd({ status: "end", endText: "카드를 모두 봤어요." })), "끝 — endText"),
      ], 220)}`,
  },

  {
    title: "칸 수 — 9 · 7, 앞쪽 · 가운데 · 뒤쪽",
    description:
      "칸 수는 화면 폭으로 고정이다(breakpoint-sm 480) — 480 이상 9칸 · 미만 7칸(화살표 둘 포함). 쪽이 바뀌어도 줄의 폭과 칸 자리는 그대로이고 생략(…)만 옮겨 간다. 9칸은 앞쪽(지금 ≤ 4) ‹ 1 2 3 4 5 … N › · 가운데 ‹ 1 … p−1 p p+1 … N › · 뒤쪽(지금 ≥ N−3) ‹ 1 … N−4 ~ N ›, 7칸은 가운데 구간에 첫 · 마지막 번호가 없다(SEED). 첫 쪽의 이전 · 마지막 쪽의 다음 자리는 40 빈 칸이다(보조 기술에 숨긴다) — 키보드로 끝 쪽에 닿아 누르던 화살표가 빈 칸이 되면 초점을 지금 쪽 번호로 옮긴다. 전체 쪽이 칸 수보다 적으면 모든 번호를 보인다. 주소가 없는 자리(대화상자 · 시트 안 목록)는 칸이 버튼이다. 누르는 영역은 위아래만 44(보이지 않는 여백 2 씩)이고 옆은 칸 폭 40 이다.",
    jsx: `import { Pagination, paginationItems } from "@/components/ui/pagination"

{/* 칸 수는 창 폭으로 — 480 이상 9칸 · 미만 7칸. 주소가 없는 자리(대화상자 · 시트 안 목록)는 칸이 버튼 */}
<Pagination totalPages={12} page={page} onPageChange={setPage} />

paginationItems(1, 12, 9) // 빈 칸 · 1 2 3 4 5 … 12 · 다음
paginationItems(6, 12, 7) // 이전 · … 5 6 7 … · 다음`,
    render: () =>
      `<div style="${SURFACE}">${grid(
        [
          labeled(pagination({ totalPages: 12, page: 1 }), "9칸 · 1 / 12 — 앞쪽, 이전 자리는 빈 칸"),
          labeled(pagination({ totalPages: 12, page: 6 }), "9칸 · 6 / 12 — 가운데"),
          labeled(pagination({ totalPages: 12, page: 12 }), "9칸 · 12 / 12 — 뒤쪽, 다음 자리는 빈 칸"),
          labeled(pagination({ totalPages: 12, page: 1, slots: 7 }), "7칸 · 1 / 12"),
          labeled(pagination({ totalPages: 12, page: 6, slots: 7 }), "7칸 · 6 / 12 — 첫 · 마지막 번호 없음"),
          labeled(pagination({ totalPages: 5, page: 2, slots: 7 }), "7칸 · 2 / 5 — 모든 번호"),
          labeled(pagination({ totalPages: 1280, page: 1000 }), "9칸 · 1,000 / 1,280 — 세 자리마다 쉼표, 칸을 넘으면 말줄임(이름에는 다)"),
        ],
        380,
      )}</div>`,
  },

  {
    title: "막힘 — 목록을 다시 받는 동안",
    description:
      "목록을 다시 받는 동안(disabled) 넘기지 않는다 — 두 번 넘기지 않게. 칸은 aria-disabled 로 남겨 초점이 그 자리를 잃지 않고, 번호 · 화살표는 fg-disabled · 지금 쪽은 bg-disabled 이며 바탕 · 축소가 없다. 흐리게(opacity) 하지 않는다. 넘기는 동안 목록은 Skeleton 의 \"다른 내용을 받을 때\" 를 따른다 — 바뀔 줄만 기다리고 옛 쪽의 줄을 남기지 않는다.",
    jsx: `<Pagination totalPages={totalPages} page={page} onPageChange={setPage} disabled={isFetching} />`,
    render: () => `<div style="${SURFACE}">${pagination({ totalPages: 12, page: 5, disabled: true })}</div>`,
  },
];
