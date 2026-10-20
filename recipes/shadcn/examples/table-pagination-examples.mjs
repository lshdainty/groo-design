/*
 * shadcn Table Pagination 예제 — docs site components/table-pagination.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 하나(HR 사용자 표)는 차례 · 제목 · 코드가 specs/components/table-pagination.md 의
 * "코드" 절과 같고, 뒤의 셋(전체 수를 모를 때 · 끝과 한 범위 · 좁은 화면)은 md 의 Properties · Guidelines 를 코드로 더 보인다.
 * groo 에 처음 두는 컴포넌트다 — 구조는 SEED Table Pagination 이다.
 *
 * ARROW · ARROW_ENABLED · ARROW_DISABLED · TEXT · SELECT_BOX · MAX_RANGE_OPTIONS 는 recipes/shadcn/components/ui/table-pagination.tsx 의 상수와,
 * ROOT · PAGE_SIZE · RIGHT · RANGE · ARROWS · STATUS 는 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다.
 * clampPage · rangeOf · knownRange · rangePages 는 그 파일의 함수를 형 표기만 떼고 옮긴 것이다(같은 입력에 같은 답).
 * 고르기 둘은 Select medium 의 트리거다 — TRIGGER_CONTENT · TRIGGER_CONTENT_PRESS · CHEVRON_CLOSED 는 select.tsx 의 상수, TRIGGER_BASE · VALUE_BASE ·
 * CHEVRON_BASE · ICON_COLOR · VALUE_COLOR 는 그 파일의 JSX 클래스, 트리거의 상자 IB_SIZE_* · IB_SURFACE_* 는 input-button.tsx 의 cva 와 같다
 * (select-examples.mjs 의 것과 같은 사본 — 이 파일이 쓰는 medium 만 옮겼다).
 * 규칙은 specs/components/table-pagination.md, 수치 원본은 specs/components/table-pagination.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 줄 <div role="group" aria-label="표 페이지 탐색" data-slot="table-pagination"> > 왼쪽 묶음
 * <div data-slot="table-pagination-page-size">(줄 수 고르기 · "씩 보기") · 오른쪽 묶음(범위 <div data-slot="table-pagination-range">(범위 고르기 ·
 * "/ 총 N개") 또는 범위 글 · 화살표 둘 <button data-slot="table-pagination-previous|next">) · 숨은 상태 글 <span role="status">.
 * 고르기의 트리거는 select.tsx 그대로(<button role="combobox" data-slot="select-trigger" data-size="medium">)이고, 레시피가 cn() 으로 합치는
 * 트리거 클래스는 merge() 로 똑같이 합친다 — 막힌 트리거의 bg-bg-disabled 가 bg-transparent 를 지운다. 목록(Popover)은 열리지 않는다.
 * 레시피의 스크립트(고르기 · 넘기기 · 줄이 줄면 마지막 범위로 · 표 맨 위로 · "11-20, 총 21개" 알림)는 정적 HTML 에 없다.
 * 표 · 이름 줄은 미리보기 그림이다 — 사이트의 `.content table · th · td` 규칙을 누르려고 style 을 적었다. 아이콘은 lucide-react 와 같은 모양의
 * inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── table-pagination.tsx 의 상수와 같은 값 ──────────────────────────────

const MAX_RANGE_OPTIONS = 200;

// 화살표 — Pagination 의 칸(40 · 모서리 8 · 누르는 영역은 위아래만 44)
const ARROW = [
  "relative flex size-10 shrink-0 items-center justify-center rounded-r2 border-0 bg-transparent p-0 [&>svg]:size-4",
  "before:absolute before:inset-x-0 before:inset-y-[-2px] before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "focus-visible:z-[1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
const ARROW_ENABLED =
  "cursor-pointer text-fg-neutral hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/40)] motion-reduce:active:[scale:1]";
const ARROW_DISABLED = "cursor-not-allowed text-fg-disabled";
// 글 — t4 · 400 · fg-neutral, 숫자 폭 고정
const TEXT = "whitespace-nowrap text-t4 font-normal text-fg-neutral tabular-nums";
// 고르기 자리 — 최소 폭 96, 글만큼 넓어진다
const SELECT_BOX = "w-max min-w-[96px] shrink-0";

// ── table-pagination.tsx 의 JSX 에 적힌 클래스 ──────────────────────────

// 줄 — 한 줄 40 · 줄바꿈 없음 · 양 끝 정렬, 묶음 사이 16, 표 아래 12(spacing-component-default) · 내용 폭보다 줄지 않는다
const ROOT = "mt-component-default flex h-10 w-full min-w-max flex-nowrap items-center justify-between gap-x4 font-sans";
// 왼쪽 묶음(줄 수 고르기 ↔ 글 8) · 오른쪽 묶음(범위 ↔ 화살표 16) · 범위 묶음(고르기 ↔ 글 8) · 화살표 둘(붙는다)
const PAGE_SIZE = "flex shrink-0 items-center gap-x2";
const RIGHT = "flex shrink-0 items-center gap-x4";
const RANGE = "flex shrink-0 items-center gap-x2";
const ARROWS = "flex shrink-0 items-center";
const STATUS = "sr-only";

// ── table-pagination.tsx 의 범위 계산 — 형 표기만 뗐다 ──────────────────

const formatNumber = (n) => n.toLocaleString("ko-KR");
const formatRange = (start, end) => `${formatNumber(start)}-${formatNumber(end)}`;

function clampPage(page, totalPages) {
  if (totalPages === 0) return 1;
  return totalPages === undefined ? Math.max(page, 1) : Math.min(Math.max(page, 1), totalPages);
}

function rangeOf(page, pageSize, itemCount) {
  if (itemCount <= 0) return { start: 0, end: 0 };
  const start = (page - 1) * pageSize + 1;
  return { start, end: start + itemCount - 1 };
}

const knownRange = (page, pageSize, totalItems) =>
  totalItems === 0 ? { start: 0, end: 0 } : rangeOf(page, pageSize, Math.min(pageSize, totalItems - (page - 1) * pageSize));

// 범위 목록의 쪽 — 200개까지 모두, 넘으면 첫 · 마지막 + 지금을 가운데에 둔 198(SEED createAutoPageOptions)
function rangePages(page, totalPages) {
  if (totalPages <= MAX_RANGE_OPTIONS) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const windowSize = MAX_RANGE_OPTIONS - 2;
  const start = Math.min(Math.max(page - Math.floor((windowSize - 1) / 2), 2), totalPages - windowSize);
  return [1, ...Array.from({ length: windowSize }, (_, i) => start + i), totalPages];
}

// ── select.tsx 의 상수 · JSX 클래스와 같은 값 — 고르기의 트리거(medium) ──────

const TRIGGER_CONTENT =
  "relative flex min-w-0 flex-1 items-center gap-[inherit] [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const TRIGGER_CONTENT_PRESS =
  "group-active/select-trigger:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/select-trigger:[scale:1]";
const CHEVRON_CLOSED = "rotate-0 [transition:rotate_var(--motion-duration-d2)_var(--motion-ease-easing)]";
const TRIGGER_BASE = "group/select-trigger relative flex w-full min-w-0 items-center text-left";
const VALUE_BASE = "relative min-w-0 flex-1 truncate";
const CHEVRON_BASE = "size-[var(--input-button-icon)] shrink-0";
const ICON_COLOR = { enabled: "text-fg-neutral-muted", disabled: "text-fg-disabled" };
const VALUE_COLOR = { value: "text-fg-neutral", disabled: "text-fg-disabled" };

// ── input-button.tsx 의 cva 와 같은 값 — 트리거의 상자(medium) ─────────────

const IB_SIZE_BASE = "font-sans";
const IB_SIZE_VARIANTS = {
  size: {
    medium: "min-h-10 gap-x2 rounded-r2 px-x3_5 text-t4 [--input-button-icon:16px] [--input-button-clear:18px]",
  },
};
const IB_SIZE_DEFAULTS = { size: "responsive" };

const IB_SURFACE_BASE = [
  "bg-transparent shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)]",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-2 after:border-solid after:border-transparent after:content-['']",
  "after:[transition:border-color_var(--motion-duration-d2)_var(--motion-ease-easing)]",
].join(" ");
const IB_SURFACE_VARIANTS = {
  state: {
    enabled: "cursor-pointer active:bg-bg-layer-default-pressed",
    disabled: "cursor-not-allowed bg-bg-disabled",
  },
  hover: { self: "" },
  invalid: { true: "after:border-stroke-critical-solid", false: "" },
};
const IB_SURFACE_COMPOUND = [{ state: "enabled", hover: "self", className: "hover:bg-bg-layer-default-pressed" }];
const IB_SURFACE_DEFAULTS = { state: "enabled", hover: "self", invalid: false };

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 참 · 거짓 축은 "true" · "false" 글자 키로 찾는다
const variantKey = (v) => (typeof v === "boolean" ? String(v) : v);
function cvaOf(base, { variants = {}, compoundVariants = [], defaultVariants = {} } = {}) {
  return (props = {}) => {
    const p = { ...defaultVariants };
    for (const [k, v] of Object.entries(props)) if (v !== undefined) p[k] = v;
    const parts = [base];
    for (const [axis, map] of Object.entries(variants)) parts.push(map[variantKey(p[axis])]);
    for (const { class: cls, className, ...when } of compoundVariants) {
      if (Object.entries(when).every(([k, v]) => p[k] === v)) parts.push(cls, className);
    }
    return parts.filter(Boolean).join(" ");
  };
}
const inputButtonVariants = cvaOf(IB_SIZE_BASE, { variants: IB_SIZE_VARIANTS, defaultVariants: IB_SIZE_DEFAULTS });
const inputButtonSurfaceVariants = cvaOf(IB_SURFACE_BASE, { variants: IB_SURFACE_VARIANTS, compoundVariants: IB_SURFACE_COMPOUND, defaultVariants: IB_SURFACE_DEFAULTS });

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다 — 이 파일이 합치는 클래스에 나오는 무리(배경 · 커서)만 안다
const GROUPS = [
  [/^bg-/, "bg"],
  [/^cursor-/, "cursor"],
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

// lucide-react 와 같은 모양(24 격자) — 크기는 놓인 자리가 정한다(화살표 16 · 셰브론 16)
const svg = (paths, extra = "") =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${paths}</svg>`;
const PATHS = {
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
};

// <Select size="medium"> 의 트리거(닫힌 모습) — 값은 고른 선택지의 글
function selectTrigger({ name, text, disabled = false }) {
  const cls = merge(`${TRIGGER_BASE} ${inputButtonVariants({ size: "medium" })} ${inputButtonSurfaceVariants({ state: disabled ? "disabled" : "enabled", hover: "self" })}`);
  const iconColor = disabled ? ICON_COLOR.disabled : ICON_COLOR.enabled;
  const valueColor = disabled ? VALUE_COLOR.disabled : VALUE_COLOR.value;
  const button = attrs([
    'type="button"',
    'aria-haspopup="listbox"',
    'aria-expanded="false"',
    'role="combobox"',
    `aria-label="${esc(name)}"`,
    disabled && "disabled",
    'data-slot="select-trigger"',
    'data-size="medium"',
    `class="${cls}"`,
  ]);
  return `<div class="${SELECT_BOX}"><button ${button}><span data-slot="select-trigger-content" class="${disabled ? TRIGGER_CONTENT : `${TRIGGER_CONTENT} ${TRIGGER_CONTENT_PRESS}`}"><span data-slot="select-value" class="${VALUE_BASE} ${valueColor}">${esc(text)}</span>${svg(PATHS.chevronDown, ` data-slot="select-chevron" class="${CHEVRON_BASE} ${iconColor} ${CHEVRON_CLOSED}"`)}</span></button></div>`;
}

// <TablePagination> — totalItems 를 알면 범위 고르기 + "/ 총 N개", 모르면 범위 글(hasPreviousPage · hasNextPage · currentPageItemCount)
function tablePagination({ totalItems, hasPreviousPage = false, hasNextPage = false, currentPageItemCount, page: rawPage = 1, pageSize = 10, disabled = false }) {
  const known = totalItems !== undefined;
  const total = known ? Math.max(Math.floor(totalItems), 0) : undefined;
  const totalPages = total === undefined ? undefined : Math.ceil(total / pageSize);
  const page = clampPage(rawPage, totalPages);
  let range;
  let hasPrevious;
  let hasNext;
  if (total !== undefined) {
    range = knownRange(page, pageSize, total);
    hasPrevious = total > 0 && page > 1;
    hasNext = total > 0 && page < totalPages;
  } else {
    range = rangeOf(page, pageSize, Math.min(currentPageItemCount ?? pageSize, pageSize));
    hasPrevious = page > 1 && hasPreviousPage;
    hasNext = hasNextPage;
  }
  const rangeOptions = total === undefined ? [] : rangePages(page, totalPages).filter((p) => p <= totalPages);
  const rangeDisabled = disabled || rangeOptions.length <= 1;
  const arrow = (which) => {
    const blocked = disabled || (which === "previous" ? !hasPrevious : !hasNext);
    return `<button ${attrs([
      'type="button"',
      `aria-label="${which === "previous" ? "이전 페이지" : "다음 페이지"}"`,
      blocked && 'aria-disabled="true"',
      `data-slot="table-pagination-${which}"`,
      `class="${ARROW} ${blocked ? ARROW_DISABLED : ARROW_ENABLED}"`,
    ])}>${svg(which === "previous" ? PATHS.chevronLeft : PATHS.chevronRight)}</button>`;
  };
  const rangePart =
    total !== undefined
      ? `<div data-slot="table-pagination-range" class="${RANGE}">${selectTrigger({ name: "표시 범위", text: formatRange(range.start, range.end), disabled: rangeDisabled })}<span data-slot="table-pagination-total" class="${TEXT}">/ 총 ${formatNumber(total)}개</span></div>`
      : `<span data-slot="table-pagination-range" class="${TEXT}">${formatRange(range.start, range.end)}</span>`;
  return `<div ${attrs([
    'role="group"',
    'aria-label="표 페이지 탐색"',
    disabled && 'aria-disabled="true"',
    'data-slot="table-pagination"',
    `class="${ROOT}"`,
  ])}><div data-slot="table-pagination-page-size" class="${PAGE_SIZE}">${selectTrigger({ name: "페이지당 표시 개수", text: `${formatNumber(pageSize)}개`, disabled })}<span class="${TEXT}">씩 보기</span></div><div class="${RIGHT}">${rangePart}<div class="${ARROWS}">${arrow("previous")}${arrow("next")}</div></div><span role="status" data-slot="table-pagination-status" class="${STATUS}"></span></div>`;
}

// 표 — 미리보기 그림(레시피의 Table 이 아니다). 사이트의 `.content table · th · td` 규칙을 style 로 누른다
const USERS = [
  ["김민수", "인사팀", "매니저", "2019-03-04"],
  ["이서연", "인사팀", "사원", "2023-07-10"],
  ["박지훈", "개발팀", "선임", "2020-11-02"],
  ["최유진", "개발팀", "책임", "2017-05-15"],
  ["정다은", "디자인팀", "선임", "2021-01-18"],
  ["한지민", "재무팀", "사원", "2024-02-01"],
  ["오세훈", "영업팀", "매니저", "2018-09-03"],
  ["윤하늘", "개발팀", "사원", "2024-08-19"],
  ["장서윤", "영업팀", "선임", "2022-04-11"],
  ["강도윤", "재무팀", "책임", "2016-12-05"],
];
const TABLE = "width:100%; min-width:480px; margin:0; border-collapse:collapse; font-family:var(--font-sans); font-size:var(--text-t4); line-height:var(--text-t4--line-height);";
const TH = "padding:var(--spacing-x2_5) var(--spacing-x3); border-bottom:1px solid var(--color-stroke-neutral-subtle); background:transparent; text-align:start; font-weight:500; color:var(--color-fg-neutral-subtle);";
const TD = "padding:var(--spacing-x2_5) var(--spacing-x3); border-bottom:1px solid var(--color-stroke-neutral-subtle); text-align:start; color:var(--color-fg-neutral);";
const table = (rows) =>
  `<table style="${TABLE}"><thead style="background:transparent;"><tr>${["이름", "부서", "직급", "입사일"].map((h) => `<th style="${TH}">${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td style="${TD}">${esc(c)}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const SURFACE =
  "padding:var(--spacing-x4) var(--spacing-x6) var(--spacing-x5); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-default); font-family:var(--font-sans);";
// 표 상자 — 표와 넘김 줄이 같은 가로 스크롤 상자 안에 있다
const scrollBox = (inner) => `<div class="overflow-x-auto">${inner}</div>`;
const surface = (inner, maxWidth = "") => `<div style="${SURFACE}${maxWidth ? ` max-width:${maxWidth};` : ""}">${inner}</div>`;
const CAPTION = "display:block; margin-top:var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;
const stack = (items) => `<div style="display:flex; flex-direction:column; gap:var(--spacing-x6);">${items.join("")}</div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const tablePaginationExamples = [
  {
    title: "HR 사용자 표",
    description:
      "데이터 표 아래 12(spacing-component-default)에 한 줄 40 으로 둔다 — 왼쪽 줄 수 고르기(\"10개\" · 25 · 50) + \"씩 보기\", 오른쪽 범위 고르기(\"11-20\") + \"/ 총 21개\" + 이전 · 다음. 줄바꿈 없이 양 끝 정렬이고 묶음 사이 16 · 고르기 ↔ 글 8 이다. 고르기 둘은 Select medium(트리거 40 · 최소 폭 96)이다 — 화면 폭과 상관없이 medium 이다(Select 의 \"1280 미만 large 52\" 의 예외 — 줄 한 높이를 지키려고). 이전 · 다음은 Pagination 의 화살표 칸(40 × 40 · 아이콘 16)이다. 글은 t4 14/19 · 400, 수는 세 자리마다 쉼표. 줄 수를 바꾸면 첫 범위로 돌아가고, 줄이 줄어 지금 범위가 없어지면 마지막 범위로 옮긴다. 넘기면 표(scrollTarget)의 위 끝이 보이게 스크롤하고 \"11-20, 총 21개\" 를 한 번 알린다 — 초점은 누른 칸에 그대로다. 표가 아닌 목록의 넘김은 Pagination 이다.",
    jsx: `import { TablePagination } from "@/components/ui/table-pagination"

<div className="overflow-x-auto">
  <Table ref={tableRef}>…</Table>
  <TablePagination
    totalItems={users.length}
    value={{ page, pageSize }}
    onValueChange={(v) => { setPage(v.page); setPageSize(v.pageSize) }}
    scrollTarget={tableRef}
  />
</div>`,
    render: () => surface(scrollBox(`${table(USERS)}${tablePagination({ totalItems: 21, page: 2 })}`)),
  },

  {
    title: "전체 수를 모를 때 — 범위는 글로만",
    description:
      "서버가 전체 수를 알려 주지 않으면 totalItems 대신 hasPreviousPage · hasNextPage(앞 · 뒤 범위가 있는지)와 currentPageItemCount(지금 범위에 실제로 든 줄 수 — 없으면 줄 수)를 준다. 범위는 고르기 없이 글(\"11-20\")로만 보이고 \"/ 총 N개\" 가 없다. 알림도 \"11-20\" 만 읽는다. 다음 범위가 없으면 다음 화살표가 막힌다.",
    jsx: `<TablePagination
  hasPreviousPage={page > 1}
  hasNextPage={data.hasNext}
  currentPageItemCount={data.items.length}
  value={{ page, pageSize }}
  onValueChange={(v) => { setPage(v.page); setPageSize(v.pageSize) }}
/>`,
    render: () =>
      stack([
        labeled(surface(tablePagination({ hasPreviousPage: true, hasNextPage: true, page: 2 })), "2번째 범위 — 앞 · 뒤 있음"),
        labeled(surface(tablePagination({ hasPreviousPage: true, hasNextPage: false, currentPageItemCount: 4, page: 3 })), "마지막 범위 — 4줄, 다음 막힘"),
      ]),
  },

  {
    title: "끝 · 한 범위 · 빈 표",
    description:
      "이전 · 다음은 끝에서 숨기지 않고 막는다 — aria-disabled 라 초점이 그 자리에 남는다(SEED 는 disabled 라 초점이 떨어진다). 막힌 화살표는 fg-disabled 이고 바탕 · 축소가 없다. 범위가 하나뿐이면(한 범위 · 빈 표 \"0-0\") 범위 고르기를 막는다 — 막힌 트리거는 bg-disabled 바탕 · fg-disabled 글이다. 범위 목록은 200개까지 모두, 넘으면 첫 · 마지막 · 지금 둘레(가운데 198)만 두고, 열린 목록의 최대 높이는 240 이다(Select 기본 480 대신 — SEED).",
    jsx: `{/* 첫 범위 — 이전 막힘 */}
<TablePagination totalItems={237} value={{ page: 1, pageSize: 10 }} onValueChange={onChange} />
{/* 한 범위 — 범위 고르기 · 화살표 막힘 */}
<TablePagination totalItems={8} value={{ page: 1, pageSize: 10 }} onValueChange={onChange} />
{/* 빈 표 — "0-0" */}
<TablePagination totalItems={0} value={{ page: 1, pageSize: 10 }} onValueChange={onChange} />`,
    render: () =>
      stack([
        labeled(surface(tablePagination({ totalItems: 237, page: 1 })), "첫 범위 1-10 / 총 237개 — 이전 막힘"),
        labeled(surface(tablePagination({ totalItems: 8, page: 1 })), "한 범위 1-8 — 범위 고르기 · 화살표 막힘"),
        labeled(surface(tablePagination({ totalItems: 0, page: 1 })), "빈 표 0-0"),
      ]),
  },

  {
    title: "좁은 화면 — 표와 같은 가로 스크롤",
    description:
      "좁은 화면에서는 넘김 줄을 표와 같은 가로 스크롤 상자 안에 둔다 — 줄은 내용 폭보다 줄지 않고(min-w-max) 줄바꿈하지 않는다. 표를 옆으로 밀면 넘김 줄도 함께 밀린다. 미리보기는 360 폭이다 — 옆으로 밀어 오른쪽 묶음을 본다.",
    jsx: `<div className="overflow-x-auto">
  <Table>…</Table>
  <TablePagination totalItems={users.length} value={{ page, pageSize }} onValueChange={onChange} />
</div>`,
    render: () => surface(scrollBox(`${table(USERS.slice(0, 3))}${tablePagination({ totalItems: 21, page: 1 })}`), "360px"),
  },
];
