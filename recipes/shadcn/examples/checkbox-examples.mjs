/*
 * shadcn Checkbox 예제 — docs site components/checkbox.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }.
 *
 * CHECKMARK_* · ROW_* · LABEL_* 와 INDICATOR · INDICATOR_HIDDEN · CHECK_ICON · MINUS_ICON · GROUP 은
 * recipes/shadcn/components/ui/checkbox.tsx 의 cva 정의 · 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다.
 * FIELD_* 는 field.tsx 의 클래스(field-examples.mjs 와 같다) — 오류 예가 묶음을 Field 로 감싼다.
 * 규칙은 specs/components/checkbox.md, 수치 원본은 specs/components/checkbox.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 칸은 Radix Checkbox 가 그리는 모양 그대로 <button role="checkbox" data-state> 로 그린다 — 체크 여부는 data-state,
 * 비활성은 disabled 라서 cva 의 data-[state=…]: · disabled: 클래스가 그대로 먹는다.
 * 아이콘은 JSX 에서 lucide-react 의 Check · Minus 이고, render 에서는 inline SVG 로 그린다.
 */

// ── checkbox.tsx 의 cva 와 같은 값 ─────────────────────────────────────────

// Checkmark — 칸(checkmarkVariants)
const CHECKMARK_BASE = [
  "peer group/checkmark relative inline-grid shrink-0 cursor-pointer place-items-center rounded-r1",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "active:[scale:calc(1-2/var(--press-basis))] group-active/checkbox:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1] motion-reduce:group-active/checkbox:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed disabled:[scale:1]",
  "[&_svg]:pointer-events-none",
].join(" ");

const CHECKMARK_VARIANTS = {
  size: {
    medium: "size-5 [--press-basis:24]",
    large: "size-6 [--press-basis:24]",
  },
  shape: {
    // 선택 안 됨: 테두리 칸. 선택 · 일부 선택: 테두리 없이 채움(톤 조합에서)
    square:
      "border border-stroke-neutral-solid bg-transparent hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed group-hover/checkbox:bg-bg-layer-default-pressed group-active/checkbox:bg-bg-layer-default-pressed data-[state=checked]:border-0 data-[state=indeterminate]:border-0 disabled:border-stroke-neutral-weak disabled:bg-bg-disabled data-[state=checked]:disabled:bg-bg-disabled data-[state=checked]:disabled:text-fg-disabled data-[state=indeterminate]:disabled:bg-bg-disabled data-[state=indeterminate]:disabled:text-fg-disabled",
    // 칸 없이 체크만 — 선택 안 됨도 옅은 체크(fg-placeholder)
    ghost:
      "border-0 bg-transparent text-fg-placeholder hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed group-hover/checkbox:bg-bg-layer-default-pressed group-active/checkbox:bg-bg-layer-default-pressed disabled:bg-transparent disabled:text-fg-disabled data-[state=checked]:disabled:bg-transparent data-[state=checked]:disabled:text-fg-disabled data-[state=indeterminate]:disabled:bg-transparent data-[state=indeterminate]:disabled:text-fg-disabled",
  },
  tone: {
    neutral: "",
    brand: "",
  },
};

const CHECKMARK_COMPOUND = [
  // 크기 × 모양 — 아이콘(Ghost 는 칸이 없어 크다)
  { size: "medium", shape: "square", className: "[&_svg]:size-3" },
  { size: "large", shape: "square", className: "[&_svg]:size-3.5" },
  { size: "medium", shape: "ghost", className: "[&_svg]:size-3.5" },
  { size: "large", shape: "ghost", className: "[&_svg]:size-[18px]" },
  // Square × 톤 — 선택 · 일부 선택의 채움, 누름 · 호버는 -pressed
  {
    shape: "square",
    tone: "neutral",
    className:
      "data-[state=checked]:bg-bg-neutral-inverted data-[state=checked]:text-fg-neutral-inverted data-[state=indeterminate]:bg-bg-neutral-inverted data-[state=indeterminate]:text-fg-neutral-inverted data-[state=checked]:hover:bg-bg-neutral-inverted-pressed data-[state=checked]:active:bg-bg-neutral-inverted-pressed data-[state=checked]:group-hover/checkbox:bg-bg-neutral-inverted-pressed data-[state=checked]:group-active/checkbox:bg-bg-neutral-inverted-pressed data-[state=indeterminate]:hover:bg-bg-neutral-inverted-pressed data-[state=indeterminate]:active:bg-bg-neutral-inverted-pressed data-[state=indeterminate]:group-hover/checkbox:bg-bg-neutral-inverted-pressed data-[state=indeterminate]:group-active/checkbox:bg-bg-neutral-inverted-pressed",
  },
  {
    shape: "square",
    tone: "brand",
    className:
      "data-[state=checked]:bg-bg-brand-solid data-[state=checked]:text-static-white data-[state=indeterminate]:bg-bg-brand-solid data-[state=indeterminate]:text-static-white data-[state=checked]:hover:bg-bg-brand-solid-pressed data-[state=checked]:active:bg-bg-brand-solid-pressed data-[state=checked]:group-hover/checkbox:bg-bg-brand-solid-pressed data-[state=checked]:group-active/checkbox:bg-bg-brand-solid-pressed data-[state=indeterminate]:hover:bg-bg-brand-solid-pressed data-[state=indeterminate]:active:bg-bg-brand-solid-pressed data-[state=indeterminate]:group-hover/checkbox:bg-bg-brand-solid-pressed data-[state=indeterminate]:group-active/checkbox:bg-bg-brand-solid-pressed",
  },
  // Ghost × 톤 — 선택 · 일부 선택의 글자색, 누름 · 호버 바탕
  {
    shape: "ghost",
    tone: "neutral",
    className:
      "data-[state=checked]:text-fg-neutral data-[state=indeterminate]:text-fg-neutral data-[state=checked]:hover:bg-bg-neutral-weak data-[state=checked]:active:bg-bg-neutral-weak data-[state=checked]:group-hover/checkbox:bg-bg-neutral-weak data-[state=checked]:group-active/checkbox:bg-bg-neutral-weak data-[state=indeterminate]:hover:bg-bg-neutral-weak data-[state=indeterminate]:active:bg-bg-neutral-weak data-[state=indeterminate]:group-hover/checkbox:bg-bg-neutral-weak data-[state=indeterminate]:group-active/checkbox:bg-bg-neutral-weak",
  },
  {
    shape: "ghost",
    tone: "brand",
    className:
      "data-[state=checked]:text-fg-brand data-[state=indeterminate]:text-fg-brand data-[state=checked]:hover:bg-bg-brand-weak-pressed data-[state=checked]:active:bg-bg-brand-weak-pressed data-[state=checked]:group-hover/checkbox:bg-bg-brand-weak-pressed data-[state=checked]:group-active/checkbox:bg-bg-brand-weak-pressed data-[state=indeterminate]:hover:bg-bg-brand-weak-pressed data-[state=indeterminate]:active:bg-bg-brand-weak-pressed data-[state=indeterminate]:group-hover/checkbox:bg-bg-brand-weak-pressed data-[state=indeterminate]:group-active/checkbox:bg-bg-brand-weak-pressed",
  },
];

const CHECKMARK_DEFAULTS = {
  size: "medium",
  shape: "square",
  tone: "neutral",
};

// 칸 안의 표시(Radix Indicator, forceMount) — Square 는 선택 안 됨에 숨기고, Ghost 는 늘 보인다
const INDICATOR = "grid place-items-center";
const INDICATOR_HIDDEN = "data-[state=unchecked]:invisible";
// 체크 · 가로줄 — 일부 선택이면 체크를 숨기고 가로줄을 보인다
const CHECK_ICON = "group-data-[state=indeterminate]/checkmark:hidden";
const MINUS_ICON = "hidden group-data-[state=indeterminate]/checkmark:block";

// Checkbox — 한 줄(checkboxVariants). 누르는 영역은 ::before 로 44 까지
const ROW_BASE = [
  "group/checkbox relative inline-flex cursor-pointer select-none items-center gap-x2 self-start",
  "before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "has-[:disabled]:cursor-not-allowed",
].join(" ");

const ROW_VARIANTS = {
  size: {
    medium: "min-h-8",
    large: "min-h-9",
  },
};

const ROW_DEFAULTS = { size: "medium" };

// Checkbox 의 라벨(checkboxLabelVariants)
const LABEL_BASE = "font-sans text-fg-neutral peer-disabled:text-fg-disabled";

const LABEL_VARIANTS = {
  size: {
    medium: "text-t4",
    large: "text-t5",
  },
  weight: {
    regular: "font-normal",
    bold: "font-bold",
  },
};

const LABEL_DEFAULTS = { size: "medium", weight: "regular" };

// CheckboxGroup — 묶음, 세로로 쌓고 줄 사이 12
const GROUP = "flex flex-col gap-x3";

// ── cva 풀이 ──────────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순) → className. 그다음 cn() 처럼 합친다.
function cvaOf(base, { variants, compoundVariants = [], defaultVariants = {} }) {
  return (props = {}, className = "") => {
    const p = { ...defaultVariants };
    for (const [k, v] of Object.entries(props)) if (v !== undefined) p[k] = v;
    const parts = [base];
    for (const [axis, map] of Object.entries(variants)) if (p[axis] !== undefined) parts.push(map[p[axis]]);
    for (const { className: cls, ...when } of compoundVariants) {
      const hit = Object.entries(when).every(([k, v]) => (Array.isArray(v) ? v.includes(p[k]) : p[k] === v));
      if (hit) parts.push(cls);
    }
    parts.push(className);
    return merge(parts.filter(Boolean).join(" "));
  };
}

const checkmarkVariants = cvaOf(CHECKMARK_BASE, {
  variants: CHECKMARK_VARIANTS,
  compoundVariants: CHECKMARK_COMPOUND,
  defaultVariants: CHECKMARK_DEFAULTS,
});
const checkboxVariants = cvaOf(ROW_BASE, { variants: ROW_VARIANTS, defaultVariants: ROW_DEFAULTS });
const checkboxLabelVariants = cvaOf(LABEL_BASE, { variants: LABEL_VARIANTS, defaultVariants: LABEL_DEFAULTS });

// "data-[state=checked]:hover:bg-x" → ["data-[state=checked]", "hover", "bg-x"] — 괄호 안의 ":" 는 가르지 않는다.
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

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다. checkbox.tsx 의 cva 끼리는 겹치지 않는다 —
// 같은 속성은 data-[state=…]: · disabled: 같은 접두어가 갈라 둔다. 그래서 이 합치기는 예제가 className 으로 덮을 때만 일한다.
// 겹칠 수 있는 무리만 본다 — 배경 · 글자색 · 글자 크기 · 굵기 · 테두리 색 · 테두리 두께 · 모서리 · 크기 · 최소 높이 · 간격 ·
// 임의 속성([prop:…]). text-t* 는 글자 크기라 글자색과 겹치지 않고, gap-x2 는 토큰 간격이라 gap-x-2(가로 간격)와 다르다
// (recipes/shadcn/lib/utils.ts 가 twMerge 에 알린 것과 같다).
const GROUPS = [
  [/^bg-/, "bg"],
  [/^text-(?:fg-|static-)/, "color"],
  [/^text-t\d+$/, "font-size"],
  [/^font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/, "font-weight"],
  [/^border-stroke-/, "border-color"],
  [/^border(?:-\d+)?$/, "border-width"],
  [/^rounded-(?:none|full|r\d+)$/, "rounded"],
  [/^size-/, "size"],
  [/^min-h-/, "min-h"],
  [/^gap-(?![xy]-)/, "gap"],
];

function conflictKey(cls) {
  const segs = splitVariants(cls);
  const utility = segs.pop();
  const prop = /^\[([\w-]+):/.exec(utility);
  const group = prop ? `[${prop[1]}]` : GROUPS.find(([re]) => re.test(utility))?.[1];
  return group ? `${segs.join(":")}|${group}` : null;
}

function merge(classList) {
  const seen = new Set();
  const kept = [];
  for (const cls of classList.split(/\s+/).filter(Boolean).reverse()) {
    const key = conflictKey(cls);
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);
    kept.push(cls);
  }
  return kept.reverse().join(" ");
}

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

// lucide Check · Minus — checkbox.tsx 처럼 선 3. 크기는 칸의 [&_svg]:size-* 가 정한다(24 는 lucide 기본값).
// 둘 다 넣어 두고 칸의 data-state 로 하나만 보인다.
const svg = (cls, body) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="${cls}">${body}</svg>`;
const ICONS =
  svg(CHECK_ICON, '<polyline points="20 6 9 17 4 12"/>') + svg(MINUS_ICON, '<line x1="5" y1="12" x2="19" y2="12"/>');

const attrs = (list) => list.filter(Boolean).join(" ");

// <Checkmark> 한 개 — Radix Checkbox.Root · Indicator 가 그리는 모양. state = "unchecked" · "checked" · "indeterminate".
// Indicator 는 forceMount 라 늘 들어 있다 — Square 는 선택 안 됨에 숨기고(invisible), Ghost 는 옅은 체크로 보인다.
function checkmark({ size, shape, tone, state = "unchecked", disabled = false, invalid = false, ariaLabel = "", className = "" } = {}) {
  const radix = attrs([`data-state="${state}"`, disabled && 'data-disabled=""']);
  const root = attrs([
    'type="button"',
    'role="checkbox"',
    `aria-checked="${state === "indeterminate" ? "mixed" : state === "checked"}"`,
    radix,
    disabled && "disabled",
    // 묶음(Field)의 오류는 칸마다 — role="group" 은 aria-invalid 를 받지 않는다(checkbox.tsx 의 CheckboxGroupContext)
    invalid && 'aria-invalid="true"',
    ariaLabel && `aria-label="${ariaLabel}"`,
    `class="${checkmarkVariants({ size, shape, tone }, className)}"`,
  ]);
  const indicator = merge([INDICATOR, shape !== "ghost" && INDICATOR_HIDDEN].filter(Boolean).join(" "));
  return `<button ${root}><span ${radix} class="${indicator}" style="pointer-events:none;">${ICONS}</span></button>`;
}

// <Checkbox> 한 줄 — <label> 이 칸과 라벨을 감싸, 라벨을 눌러도 칸이 반응한다(group/checkbox).
function checkbox({ label, size, shape, tone, weight, state, disabled, invalid, className = "", labelClassName = "" } = {}) {
  const box = checkmark({ size, shape, tone, state, disabled, invalid });
  const text = `<span class="${checkboxLabelVariants({ size, weight }, labelClassName)}">${label}</span>`;
  return `<label class="${checkboxVariants({ size }, className)}">${box}${text}</label>`;
}

// <CheckboxGroup> — 이름은 aria-label 또는 aria-labelledby, 오류 글은 aria-describedby
function group(rows, { ariaLabel = "", labelledBy = "", describedBy = "", className = "" } = {}) {
  const root = attrs([
    'role="group"',
    ariaLabel && `aria-label="${ariaLabel}"`,
    labelledBy && `aria-labelledby="${labelledBy}"`,
    describedBy && `aria-describedby="${describedBy}"`,
    `class="${merge(`${GROUP} ${className}`)}"`,
  ]);
  return `<div ${root}>${rows.join("")}</div>`;
}

// Desk 데이터 내보내기 — 부모(전체)는 자식을 따라 선택 · 일부 선택 · 선택 안 됨이 된다
const EXPORT_ITEMS = ["거래 내역", "예산", "메모", "할 일"];

function exportGroup({ picked = [], tone, labelledBy = "", describedBy = "", invalid = false } = {}) {
  const parent = picked.length === EXPORT_ITEMS.length ? "checked" : picked.length ? "indeterminate" : "unchecked";
  return group(
    [
      checkbox({ tone, weight: "bold", state: parent, label: "전체", invalid }),
      ...EXPORT_ITEMS.map((label, i) => checkbox({ tone, state: picked.includes(i) ? "checked" : "unchecked", label, invalid })),
    ],
    labelledBy ? { labelledBy, describedBy } : { ariaLabel: "내보낼 데이터", describedBy },
  );
}

// 칸은 보통 기본 레이어(흰 면) 위에 놓인다. 사이트 미리보기 칸의 바탕(bg-page = bg-layer-basement)은
// 비활성 칸의 채움(bg-disabled, gray-200)과 같은 색이라, 그 위에 바로 그리면 비활성 칸이 보이지 않는다.
const SURFACE =
  "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-x6);";
const surface = (html) => `<div style="${SURFACE}">${html}</div>`;

// 아래 끝을 맞춘다 — 크기가 다른 줄(32 · 36)을 나란히 둬도 이름표가 한 줄에 선다
const GALLERY = "display:flex; flex-wrap:wrap; align-items:flex-end; gap:var(--spacing-x5) var(--spacing-x8);";
const CAPTION =
  "font-size:var(--text-t2); line-height:var(--text-t2--line-height); font-weight:400; color:var(--color-fg-neutral-subtle);";
// 크기 · 모양 · 상태 이름처럼 코드로 쓰는 이름표
const CODE = `${CAPTION} font-family:ui-monospace, SFMono-Regular, Menlo, monospace;`;
// ── field.tsx 의 클래스(field-examples.mjs 와 같다) — 오류 예의 Field ─────────────
const FIELD_ROOT = "flex w-full min-w-0 flex-col gap-x2";
const FIELD_HEADER = "flex flex-wrap items-center justify-between gap-x2_5 px-x0_5 [&>:first-child:not(:last-child)]:min-w-[50%] [&>:first-child:not(:last-child)]:flex-1";
const FIELD_LABEL = "min-w-0 font-sans text-t5 text-fg-neutral";
const FIELD_LABEL_WEIGHT = { medium: "font-medium", bold: "font-bold" };
const FIELD_FOOTER = "flex items-start gap-x2 px-x0_5 font-sans";
const FIELD_ERROR = "m-0 flex min-w-0 text-t4 text-fg-critical";
const FIELD_ERROR_ICON = "mr-x1_5 mt-[calc((var(--text-t4--line-height)_-_1rem)/2)] size-4 shrink-0";
const FIELD_TEXT = "min-w-0";
// 사이트의 `.content p { margin: 12px 0; color: text-primary }` 는 층 밖 규칙이라 utility 를 이긴다 — 꼬리의 <p> 에 한 번 더 적는다(field-examples.mjs 와 같다)
const P_FIX_ERROR = "margin:0; color:var(--color-fg-critical);";
const CIRCLE_ALERT =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' +
  FIELD_ERROR_ICON +
  '" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>';

// 묶음 위 제목
const TITLE =
  "font-size:var(--text-t3); line-height:var(--text-t3--line-height); font-weight:700; color:var(--color-fg-neutral-muted);";

// 아래 이름표
function labeled(html, caption, style = CODE) {
  return `<div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--spacing-x2);">${html}<span style="${style}">${caption}</span></div>`;
}

const CHECKED_KO = { unchecked: "선택 안 됨", checked: "선택", indeterminate: "일부 선택" };

// ── 예제 ──────────────────────────────────────────────────────────────────

export const checkboxExamples = [
  {
    title: "기본",
    description:
      "칸과 라벨을 한 줄로 묶은 Checkbox 다 — medium · square · neutral 이 기본이다. 라벨을 눌러도 칸이 반응하고(호버 · 누름 색도 함께), 누르는 영역은 보이는 줄(32)보다 넓게 ::before 로 가로 · 세로 44 까지 넓힌다.",
    jsx: `import { Checkbox } from "@/components/ui/checkbox"

<Checkbox label="단종된 카드도 보기" />`,
    render: () => surface(checkbox({ label: "단종된 카드도 보기" })),
  },

  {
    title: "크기 두 가지",
    description:
      "크기는 칸 · 라벨 · 줄 높이를 함께 정한다. medium(칸 20 · 라벨 14 · 줄 32)이 기본이고 화면 안의 목록 · 설정에 쓴다. large(칸 24 · 라벨 16 · 줄 36)는 한 화면의 중심 선택, 모바일에서 홀로 서는 선택에 쓴다. 아이콘은 square 12 · 14 이고, 칸이 없는 ghost 는 14 · 18 로 크다. 누르는 영역은 두 크기 모두 44 까지 넓힌다.",
    jsx: `<Checkbox size="medium" defaultChecked label="이 카드 기억하기" />
<Checkbox size="large" defaultChecked label="이 카드 기억하기" />

// ghost 는 칸이 없어 아이콘이 크다
<Checkbox size="medium" shape="ghost" defaultChecked label="이 카드 기억하기" />
<Checkbox size="large" shape="ghost" defaultChecked label="이 카드 기억하기" />`,
    render: () => {
      const cell = (size, shape) => checkbox({ size, shape, state: "checked", label: "이 카드 기억하기" });
      return surface(`<div style="overflow-x:auto;">
  <div style="display:grid; grid-template-columns:repeat(3, max-content); align-items:center; gap:var(--spacing-x3) var(--spacing-x8);">
    <span></span><span style="${CODE}">medium · 20</span><span style="${CODE}">large · 24</span>
    <span style="${CODE}">square</span>${cell("medium", "square")}${cell("large", "square")}
    <span style="${CODE}">ghost</span>${cell("medium", "ghost")}${cell("large", "ghost")}
  </div>
</div>`);
    },
  },

  {
    title: "굵기",
    description:
      "라벨 굵기다. regular(400)가 기본이고, 강조하거나 묶음의 부모처럼 한 단계 위에 설 때 bold(700)를 쓴다. 굵기는 크기와 따로 고른다.",
    jsx: `<Checkbox defaultChecked label="데이터 내보내기" />
<Checkbox weight="bold" defaultChecked label="데이터 내보내기" />
<Checkbox size="large" weight="bold" defaultChecked label="데이터 내보내기" />`,
    render: () =>
      surface(`<div style="${GALLERY}">
  ${labeled(checkbox({ state: "checked", label: "데이터 내보내기" }), "regular")}
  ${labeled(checkbox({ weight: "bold", state: "checked", label: "데이터 내보내기" }), "bold")}
  ${labeled(checkbox({ size: "large", weight: "bold", state: "checked", label: "데이터 내보내기" }), "large · bold")}
</div>`),
  },

  {
    title: "톤 — neutral · brand",
    description:
      "선택했을 때의 색이다. neutral(짙은 회색)이 기본이고, brand 는 서비스 핵심 흐름에서만 쓴다 — 체크가 많은 화면에 브랜드 색을 깔면 브랜드 색 버튼이 설 자리가 없어진다. 선택 · 일부 선택을 같은 색으로 채우고, 선택 안 된 칸은 톤과 상관없다. brand 는 페이지 위의 브랜드 전환(Desk · HR)을 따른다 — Default 에서는 회색 단계다.",
    jsx: `// 기본 — 짙은 회색(bg-neutral-inverted)
<Checkbox defaultChecked label="거래 내역" />

// 서비스 핵심 흐름에서만 — 브랜드 색(bg-brand-solid)
<Checkbox tone="brand" defaultChecked label="거래 내역" />`,
    render: () =>
      surface(`<div style="${GALLERY}">
  ${labeled(exportGroup({ picked: [0, 1] }), "neutral — 기본")}
  ${labeled(exportGroup({ picked: [0, 1], tone: "brand" }), "brand — 핵심 흐름에서만")}
</div>`),
  },

  {
    title: "모양 — square · ghost",
    description:
      "square 는 칸 + 체크다 — 여러 개를 고르는 목록, 사용자가 알고 골라야 하는 선택에 쓴다(기본). ghost 는 칸 없이 체크만 두고, 선택 안 됨도 옅은 체크(fg-placeholder)로 보인다 — 필수가 아니고 셋 이하일 때만 쓴다. 할 일 완료의 동그라미 체크는 Checkbox 의 모양이 아니다.",
    jsx: `// square — 칸 + 체크(기본)
<Checkbox defaultChecked label="식비" />
<Checkbox label="교통" />

// ghost — 칸 없이 체크만. 선택 안 됨도 옅은 체크로 보인다
<Checkbox shape="ghost" defaultChecked label="식비" />
<Checkbox shape="ghost" label="교통" />`,
    render: () => {
      const col = (shape) =>
        group(
          [
            checkbox({ shape, state: "checked", label: "식비" }),
            checkbox({ shape, label: "교통" }),
            checkbox({ shape, state: "checked", label: "쇼핑" }),
          ],
          { ariaLabel: `카테고리(${shape})` },
        );
      return surface(`<div style="${GALLERY}">
  ${labeled(col("square"), "square — 칸 + 체크")}
  ${labeled(col("ghost"), "ghost — 칸 없이 체크만")}
</div>`);
    },
  },

  {
    title: "상태 매트릭스",
    description:
      "체크 여부(unchecked · checked · indeterminate) × enabled · disabled. 선택 · 일부 선택은 테두리 없이 톤 색으로 채우고(ghost 는 체크 색만 바뀐다), 일부 선택은 가로줄이다(aria-checked=\"mixed\"). disabled 는 전용 색(bg-disabled · fg-disabled)이고 라벨도 fg-disabled 가 된다 — 불투명도로 흐리게 하지 않는다. 호버 · 누름 · 포커스는 cva 의 가상 클래스가 맡는다 — 호버는 누름 색과 같고, 누르면 칸만 세로 2px 줄어든다.",
    jsx: `// 체크 여부는 checked(true · false · "indeterminate"), 비활성은 disabled — 모양은 cva 가 data-state 와 :disabled 로 바꾼다
<Checkbox label="이 카드 기억하기" />
<Checkbox defaultChecked label="이 카드 기억하기" />
<Checkbox checked="indeterminate" label="이 카드 기억하기" />
<Checkbox disabled label="이 카드 기억하기" />
<Checkbox disabled defaultChecked label="이 카드 기억하기" />

// 상태는 가상 클래스가 맡는다 — 따로 선언하지 않는다
// :hover          누름 색과 같다, 축소 없음
// :active         누름 색 + 칸만 세로 2px 축소(scale = 1 − 2 ÷ 24), 라벨은 줄지 않는다
// :focus-visible  outline 2px stroke-focus-ring · offset 2px
// :disabled       bg-disabled · fg-disabled, 라벨도 fg-disabled — 흐리게 하지 않는다`,
    render: () => {
      const combos = [
        ["square · neutral", { shape: "square", tone: "neutral" }],
        ["square · brand", { shape: "square", tone: "brand" }],
        ["ghost · neutral", { shape: "ghost", tone: "neutral" }],
      ];
      const checkedValues = ["unchecked", "checked", "indeterminate"];
      const states = ["enabled", "disabled"];
      const th = `style="padding:var(--spacing-x1) var(--spacing-x2); text-align:center; ${CODE}"`;
      const rowTh = `style="padding:var(--spacing-x2) var(--spacing-x4) var(--spacing-x2) 0; text-align:left; white-space:nowrap; ${CODE}"`;
      const td = `style="padding:var(--spacing-x2); text-align:center;"`;
      const cell = (name, combo, checked, st) =>
        checkmark({
          ...combo,
          state: checked,
          disabled: st === "disabled",
          ariaLabel: `${name} ${CHECKED_KO[checked]}${st === "disabled" ? " 비활성" : ""}`,
        });
      const rows = combos
        .map(
          ([name, combo]) =>
            `<tr><th scope="row" ${rowTh}>${name}</th>${checkedValues
              .flatMap((ch) => states.map((st) => `<td ${td}>${cell(name, combo, ch, st)}</td>`))
              .join("")}</tr>`,
        )
        .join("\n      ");
      return surface(`<div style="overflow-x:auto;">
  <table style="border-collapse:collapse;">
    <thead>
      <tr><th ${th}></th>${checkedValues.map((ch) => `<th scope="colgroup" colspan="2" ${th}>${ch}</th>`).join("")}</tr>
      <tr><th ${th}></th>${checkedValues.map(() => states.map((st) => `<th scope="col" ${th}>${st}</th>`).join("")).join("")}</tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</div>
<div style="${GALLERY} margin-top:var(--spacing-x4); padding-top:var(--spacing-x4); border-top:1px solid var(--color-stroke-neutral-weak);">
  ${labeled(checkbox({ label: "이 카드 기억하기" }), "enabled")}
  ${labeled(checkbox({ disabled: true, label: "이 카드 기억하기" }), "disabled")}
  ${labeled(checkbox({ state: "checked", disabled: true, label: "이 카드 기억하기" }), "disabled · checked")}
</div>`);
    },
  },

  {
    title: "묶음 · 일부 선택",
    description:
      "여러 항목은 CheckboxGroup 으로 세로로 쌓는다(줄 사이 12 — 줄마다 누르는 영역 44 를 온전히 받는다). 모두를 한 번에 고를 일이 있으면 부모를 맨 위에 bold 로 둔다 — 자식을 일부만 고르면 부모는 일부 선택(가로줄 · aria-checked=\"mixed\")이 되고, 부모를 누르면 자식이 모두 선택된다. 모두 선택된 부모를 누르면 모두 풀린다. 묶음의 이름은 aria-label(보이는 제목이 있으면 aria-labelledby)로 단다.",
    jsx: `import { useState } from "react"
import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox"

const ITEMS = [
  { id: "tx", label: "거래 내역" },
  { id: "budget", label: "예산" },
  { id: "memo", label: "메모" },
  { id: "todo", label: "할 일" },
]
const [picked, setPicked] = useState<string[]>(["tx", "budget"])
const parent = picked.length === ITEMS.length ? true : picked.length ? "indeterminate" : false

<CheckboxGroup aria-label="내보낼 데이터">
  <Checkbox weight="bold" label="전체" checked={parent}
    onCheckedChange={(v) => setPicked(v === true ? ITEMS.map((it) => it.id) : [])} />
  {ITEMS.map((it) => (
    <Checkbox key={it.id} label={it.label} checked={picked.includes(it.id)}
      onCheckedChange={(v) => setPicked((p) => (v === true ? [...p, it.id] : p.filter((x) => x !== it.id)))} />
  ))}
</CheckboxGroup>`,
    render: () => surface(exportGroup({ picked: [0, 1] })),
  },

  {
    title: "칸만 — 목록 행",
    description:
      "목록 행 · 표 머리에는 칸(Checkmark)만 넣는다. 보이는 라벨이 없으니 무엇을 고르는지 aria-label 을 반드시 단다. 행 전체를 <label> 로 감싸 행 어디를 눌러도 선택되게 한다 — 누르는 영역은 칸이 아니라 행이 맡는다. 행에 group/checkbox 를 달면 행을 누르거나 올려도 칸이 누름 색 · 축소로 반응한다.",
    jsx: `import { Checkmark } from "@/components/ui/checkbox"

<label className="group/checkbox flex cursor-pointer items-center gap-x3 px-x6 py-x3">
  <Checkmark checked={selected} onCheckedChange={setSelected} aria-label="9월 25일 월급 선택" />
  <span className="flex-1">월급</span>
  <span>+3,200,000원</span>
</label>`,
    render: () => {
      const list =
        "max-width:360px; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); overflow:hidden;";
      const text = "font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
      const rows = [
        ["월급", "+3,200,000원", "checked"],
        ["점심 식사", "-12,000원", "unchecked"],
        ["버스", "-1,500원", "checked"],
      ];
      const row = ([name, amount, state], i) =>
        `<label class="group/checkbox" style="display:flex; align-items:center; gap:var(--spacing-x3); padding:var(--spacing-x3) var(--spacing-x6); cursor:pointer;${i ? " border-top:1px solid var(--color-stroke-neutral-weak);" : ""}">${checkmark({ state, ariaLabel: `9월 25일 ${name} 선택` })}<span style="flex:1; ${text}">${name}</span><span style="${text} font-weight:700; font-variant-numeric:tabular-nums;">${amount}</span></label>`;
      return `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2);">
  <span style="${CAPTION}">9월 25일 거래 · 행 전체가 누르는 영역</span>
  <div style="${list}">${rows.map(row).join("")}</div>
</div>`;
    },
  },

  {
    title: "오류는 묶음 아래 글",
    description:
      "묶음을 Field 로 감싼다 — Field 의 라벨이 묶음의 이름(aria-labelledby), 오류 글이 묶음의 설명(aria-describedby)이 되고, 오류는 칸마다 aria-invalid 로 걸린다(묶음 role=\"group\" 은 aria-invalid · aria-required 를 받지 않는다). 오류가 나도 칸 모양은 바꾸지 않는다 — 칸마다 빨간 테두리를 두르지 않고, 묶음 아래에 무엇을 해야 하는지 글(fg-critical · 아이콘)로 알린다. 검사는 제출할 때 · 묶음을 떠날 때 하고, 누르는 동안에는 띄우지 않는다. 오늘 제품의 체크 오류는 모두 묶음 단위(하나 이상 고르기)다.",
    jsx: `// ITEMS · picked · parent 는 위 "묶음 · 일부 선택" 과 같다. 제출할 때 검사한다 — 누르는 동안에는 띄우지 않는다
const error = submitted && picked.length === 0

<Field label="내보낼 데이터" invalid={error} errorMessage="내보낼 데이터를 하나 이상 골라 주세요.">
  <CheckboxGroup>
    <Checkbox weight="bold" label="전체" checked={parent} onCheckedChange={toggleAll} />
    {ITEMS.map((it) => (
      <Checkbox key={it.id} label={it.label} checked={picked.includes(it.id)}
        onCheckedChange={(v) => toggle(it.id, v)} />
    ))}
  </CheckboxGroup>
</Field>`,
    render: () => {
      // Field(field.tsx) — 묶음이면 라벨은 <span id> 이고 묶음이 aria-labelledby 로 가리킨다. 오류 글은 aria-hidden(화면 밖 알림 자리가 읽는다)
      const id = "checkbox-ex-export";
      const error = "내보낼 데이터를 하나 이상 골라 주세요.";
      const header = `<div data-slot="field-header" class="${FIELD_HEADER}"><span id="${id}-label" class="${FIELD_LABEL} ${FIELD_LABEL_WEIGHT.medium}">내보낼 데이터</span></div>`;
      const footer = `<div data-slot="field-footer" class="${FIELD_FOOTER}"><p id="${id}-error" aria-hidden="true" class="${FIELD_ERROR}" style="${P_FIX_ERROR}">${CIRCLE_ALERT}<span class="${FIELD_TEXT}">${error}</span></p></div>`;
      return surface(
        `<div data-slot="field" data-invalid="true" class="${FIELD_ROOT}">${header}${exportGroup({ labelledBy: `${id}-label`, describedBy: `${id}-error`, invalid: true })}${footer}<span class="sr-only" aria-live="polite">${error}</span></div>`,
      );
    },
  },
];
