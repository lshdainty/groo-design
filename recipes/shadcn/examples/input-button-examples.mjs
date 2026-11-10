/*
 * shadcn Input Button 예제 — docs site components/input-button.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 넷(날짜 · 목록 · 검색 시트 · 지우기 · 상태)은 차례 · 제목 · 코드가
 * specs/components/input-button.md 의 "코드" 절과 같고, 뒤의 넷(크기 · 상태 매트릭스 · 앞 · 뒤 붙이개 · 지우기 버튼)은 md 의
 * Properties 를 코드로 더 보인다.
 *
 * IB_SIZE_* · IB_SURFACE_* 는 recipes/shadcn/components/ui/input-button.tsx 의 cva(inputButtonVariants · inputButtonSurfaceVariants)와,
 * CONTENT · CONTENT_PRESS · CLEAR 는 그 파일의 상수와, ROOT_BASE · BUTTON_BASE · ICON · AFFIX · VALUE_BASE · *_COLOR 는 그 파일의 JSX 에
 * 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. IB_SIZE_* · IB_SURFACE_* 는 select-examples.mjs 의 것과도 같다
 * (Select 의 트리거가 같은 상자를 쓴다 — input-button.tsx 를 고치면 셋을 함께).
 * 둘레의 FIELD_* · field() 는 field.tsx 의 것이다 — input-examples.mjs 의 것과 같다.
 * 규칙은 specs/components/input-button.md, 수치 원본은 specs/components/input-button.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 상자 <div data-slot="input-button"> > 배경 층 버튼 <button data-slot="input-button-trigger">(테두리 ·
 * 바탕 · 포커스 링 · 오류 2px, 상자를 덮어 어디를 눌러도 눌린다) + 콘텐츠 층 <span data-slot="input-button-content">(앞 아이콘 · 앞 글자 ·
 * 값 · 지우기 버튼 · 뒤 글자 · 뒤 아이콘 — 누름을 지나 보내고 지우기만 따로 눌린다).
 * 상태는 상자의 data-invalid · data-disabled · data-readonly 와 버튼의 disabled · aria-disabled(읽기 전용) · aria-invalid 로 그린다.
 * 레시피가 cn() 으로 합치는 자리는 merge() 로 똑같이 합친다 — 같은 속성을 다시 쓴 클래스는 뒤의 것만 남는다.
 * 이름은 Field 의 라벨 + 값(aria-labelledby), 붙이개 글은 설명(aria-describedby)이다. id 는 레시피의 useId 자리다 — 예제마다 앞말을 달리한다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 * 여는 자리는 Bottom Sheet · Popover 레시피(bottom-sheet.tsx · popover.tsx)가 그리고, 그 안의 달력은 Date Picker 레시피(date-picker.tsx) ·
 * 검색 시트의 내용은 Searchable List 레시피(searchable-list.tsx — 밑줄형 검색칸 · List 줄 + 오른쪽 라디오, 2026-10-08)다 —
 * 그 모습은 그 페이지들의 예제에 있어 미리보기는 칸만 그린다.
 * 레시피의 스크립트(누르는 순간 --press-basis 재기 · 지우기 · 읽기 전용에서 누르기 삼키기)는 정적 HTML 에 없다 — 칸에 마우스를 올리거나
 * 누르면 바탕은 레시피 그대로 바뀌지만 콘텐츠는 줄지 않고, 지우기를 눌러도 값이 그대로다.
 */

// ── input-button.tsx 의 cva 와 같은 값 ───────────────────────────────────

// 상자의 크기(inputButtonVariants) — 높이 · 모서리 · 좌우 여백 · 사이 · 글자, --input-button-icon(앞 · 뒤 아이콘) · --input-button-clear(지우기)
const IB_SIZE_BASE = "font-sans";

const IB_SIZE_VARIANTS = {
  size: {
    large: "min-h-13 gap-x2_5 rounded-r3 px-x4 text-t5 [--input-button-icon:20px] [--input-button-clear:22px]",
    medium: "min-h-10 gap-x2 rounded-r2 px-x3_5 text-t4 [--input-button-icon:16px] [--input-button-clear:18px]",
    responsive: [
      "min-h-13 gap-x2_5 rounded-r3 px-x4 text-t5 [--input-button-icon:20px] [--input-button-clear:22px]",
      "lg:min-h-10 lg:gap-x2 lg:rounded-r2 lg:px-x3_5 lg:text-t4 lg:[--input-button-icon:16px] lg:[--input-button-clear:18px]",
    ].join(" "),
  },
};

const IB_SIZE_DEFAULTS = { size: "responsive" };

// 상자의 겉모습(inputButtonSurfaceVariants) — 버튼에 단다. 테두리는 안쪽 1px(inset shadow), 오류 2px 는 ::after 로 덧그린다
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
    readonly: "cursor-default bg-bg-disabled",
  },
  hover: { self: "", group: "" },
  invalid: { true: "after:border-stroke-critical-solid", false: "" },
};

const IB_SURFACE_COMPOUND = [
  { state: "enabled", hover: "self", className: "hover:bg-bg-layer-default-pressed" },
  { state: "enabled", hover: "group", className: "group-hover/input-button:bg-bg-layer-default-pressed" },
];

const IB_SURFACE_DEFAULTS = { state: "enabled", hover: "self", invalid: false };

// ── input-button.tsx 의 상수 · JSX 에 적힌 클래스 ─────────────────────────

// 상자(div) — cn(ROOT_BASE, inputButtonVariants({ size }), rootClassName)
const ROOT_BASE = "group/input-button relative isolate flex w-full min-w-0 items-center";
// 배경 층 버튼 — cn(BUTTON_BASE, inputButtonSurfaceVariants({ state, hover: "group", invalid }), className)
const BUTTON_BASE = "peer/input-button absolute inset-0 m-0 appearance-none rounded-[inherit] border-0 p-0";

// 콘텐츠 층 — 누름을 지나 보내고, 버튼(peer)을 누르는 동안만 준다. 레시피는 cn(CONTENT, 누를 수 있으면 CONTENT_PRESS)
const CONTENT =
  "relative flex min-w-0 flex-1 select-none items-center gap-[inherit] pointer-events-none [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const CONTENT_PRESS = "peer-active/input-button:[scale:calc(1-2/var(--press-basis))] motion-reduce:peer-active/input-button:[scale:1]";

// 지우기 — 콘텐츠 층 위에서 따로 눌린다. 보이는 22 · 18, 누르는 영역은 ::before 로 24. 누르면 자기만 준다(기준 24)
const CLEAR = [
  "pointer-events-auto relative flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-fg-neutral-subtle",
  "[&>svg]:size-[var(--input-button-clear)]",
  "before:absolute before:left-1/2 before:top-1/2 before:size-6 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[--press-basis:24] [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
].join(" ");

// 앞 · 뒤 아이콘 — cn(ICON, 아이콘 색) · 앞 · 뒤 글자 — cn(AFFIX, 붙이개 색) · 값 — cn(VALUE_BASE, 값 색)
const ICON = "flex shrink-0 [&>svg]:size-[var(--input-button-icon)]";
const AFFIX = "shrink-0";
const VALUE_BASE = "min-w-0 flex-1 truncate text-left";
const ICON_COLOR = { enabled: "text-fg-neutral-muted", disabled: "text-fg-disabled" };
const AFFIX_COLOR = { enabled: "text-fg-neutral-subtle", disabled: "text-fg-disabled" };
const VALUE_COLOR = { value: "text-fg-neutral", placeholder: "text-fg-placeholder", disabled: "text-fg-disabled" };

// ── field.tsx 의 클래스 — 칸을 감싸는 둘레 ─────────────────────────────

const FIELD_ROOT = "flex w-full min-w-0 flex-col gap-x2";
const FIELD_HEADER = "flex flex-wrap items-center justify-between gap-x2_5 px-x0_5 [&>:first-child:not(:last-child)]:min-w-[50%] [&>:first-child:not(:last-child)]:flex-1";
// 라벨 — cn("min-w-0 font-sans text-t5 text-fg-neutral", 굵기)
const FIELD_LABEL = "min-w-0 font-sans text-t5 text-fg-neutral";
const FIELD_LABEL_WEIGHT = { medium: "font-medium", bold: "font-bold" };
const FIELD_REQUIRED = "ml-[0.125rem] mt-[0.25rem] inline-block size-[0.375rem] rounded-full bg-fg-critical align-top";
const FIELD_INDICATOR = "pl-[0.25rem] align-bottom text-t4 font-normal leading-[var(--text-t5--line-height)] text-fg-neutral-subtle";
const FIELD_ACTION = "-my-[5px] ml-auto flex shrink-0 items-center";
const FIELD_FOOTER = "flex items-start gap-x2 px-x0_5 font-sans";
const FIELD_ERROR = "m-0 flex min-w-0 text-t4 text-fg-critical";
const FIELD_ERROR_ICON = "mr-x1_5 mt-[calc((var(--text-t4--line-height)_-_1rem)/2)] size-4 shrink-0";
const FIELD_DESCRIPTION = "m-0 flex min-w-0 text-t4 text-fg-neutral-subtle";
const FIELD_DESCRIPTION_ICON = "mr-x1_5 mt-[calc((var(--text-t4--line-height)_-_1rem)/2)] flex shrink-0 [&>svg]:size-4";
const FIELD_TEXT = "min-w-0";
const FIELD_COUNT = "m-0 ml-auto shrink-0 text-t4 tabular-nums";

// 사이트의 `.content p { margin: 12px 0; color: text-primary }` 는 층(@layer) 밖 규칙이라 Tailwind utility(@layer utilities)를
// 늘 이긴다 — 꼬리의 <p> 에는 클래스가 정한 바깥 여백 · 글자색을 style 로 한 번 더 적는다(레시피에는 없는 미리보기용 덧칠)
const P_FIX = {
  error: "margin:0; color:var(--color-fg-critical);",
  description: "margin:0; color:var(--color-fg-neutral-subtle);",
  count: "margin:0 0 0 auto;",
};

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다.
// 참 · 거짓 축(invalid)은 cva 처럼 "true" · "false" 글자 키로 찾고, compound 는 값 그대로 견준다
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

const inputButtonVariants = cvaOf(IB_SIZE_BASE, { variants: IB_SIZE_VARIANTS, defaultVariants: IB_SIZE_DEFAULTS });
const inputButtonSurfaceVariants = cvaOf(IB_SURFACE_BASE, {
  variants: IB_SURFACE_VARIANTS,
  compoundVariants: IB_SURFACE_COMPOUND,
  defaultVariants: IB_SURFACE_DEFAULTS,
});

// "peer-active/input-button:[scale:1]" → ["peer-active/input-button", "[scale:1]"] — 괄호 안의 ":" 는 가르지 않는다
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
// 배경 · 글자색 · 테두리 색 · 임의 속성([prop:…]). 그래서 막힌 · 읽기 전용 버튼의 bg-bg-disabled 가 bg-transparent 를,
// 오류의 after:border-stroke-critical-solid 가 after:border-transparent 를 지운다
const GROUPS = [
  [/^bg-/, "bg"],
  [/^text-(?:fg-|static-)/, "color"],
  [/^border-(?:transparent|stroke-)/, "border-color"],
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

// 정적 미리보기에서 누름 · 포커스를 보이려고 — 그 상태의 클래스(active: · peer-active/… · focus-visible:)에서 접두어만 뗀 사본을
// 뒤에 붙인다(merge 가 겹치는 기본값을 지운다). 값은 레시피 그대로라 input-button.tsx 가 바뀌면 같이 따라간다
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

const pressed = (classList, state) => merge(`${classList} ${forceState(classList, state)}`);

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const join = (...ids) => ids.filter(Boolean).join(" ") || undefined;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// 글자 수 — field.tsx 처럼 자소(grapheme) 단위로 센다
const segmenter = new Intl.Segmenter("ko", { granularity: "grapheme" });
const countGraphemes = (value) => Array.from(segmenter.segment(value)).length;

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기는 감싼 자리의 [&>svg]:size-* 나 class 가 정한다
const svg = (paths, { strokeWidth = 2, cls = "" } = {}) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ""} aria-hidden="true">${paths}</svg>`;

const PATHS = {
  circleAlert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  circleX: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
};

const ICONS = {
  calendarDays: svg(
    '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/>',
  ),
  clock: svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
  chevronDown: svg('<path d="m6 9 6 6 6-6"/>'),
  utensils: svg('<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>'),
};

// <Field> — field.tsx 그대로(input-examples.mjs 의 것과 같다). id 는 레시피의 useId 자리, value 는 입력의 값(글자 수)이다.
// control(f) 는 칸의 HTML 을 돌려준다 — f 는 Field 의 문맥(useFieldControl 이 읽는 값). group 이면 라벨이 <label for> 대신 <span id> 가 된다.
function field({
  id,
  label,
  labelWeight = "medium",
  required = false,
  showRequiredIndicator = false,
  indicator,
  headerAction,
  description,
  descriptionIcon,
  errorMessage,
  invalid = false,
  disabled = false,
  readOnly = false,
  maxGraphemeCount,
  value = "",
  group = false,
  control,
}) {
  const controlId = `${id}-control`;
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const countId = `${id}-count`;
  const showError = invalid && errorMessage != null && errorMessage !== "";
  const showDescription = !showError && description != null && description !== "";
  const showCount = maxGraphemeCount != null;
  const describedBy = join(showError && errorId, showDescription && descriptionId, showCount && countId);
  const count = countGraphemes(value);

  const labelClass = `${FIELD_LABEL} ${FIELD_LABEL_WEIGHT[labelWeight]}`;
  const labelContent = [
    label != null ? esc(label) : "",
    showRequiredIndicator ? `<span aria-hidden="true" class="${FIELD_REQUIRED}"></span>` : "",
    !showRequiredIndicator && indicator != null ? `<span class="${FIELD_INDICATOR}">${esc(indicator)}</span>` : "",
  ].join("");
  const labelHtml =
    label == null
      ? ""
      : group
        ? `<span id="${labelId}" class="${labelClass}">${labelContent}</span>`
        : `<label id="${labelId}" for="${controlId}" class="${labelClass}">${labelContent}</label>`;
  const actionHtml = headerAction != null ? `<div data-slot="field-header-action" class="${FIELD_ACTION}">${headerAction}</div>` : "";
  const header = label != null || headerAction != null ? `<div data-slot="field-header" class="${FIELD_HEADER}">${labelHtml}${actionHtml}</div>` : "";

  const errorHtml = showError
    ? `<p id="${errorId}" aria-hidden="true" class="${FIELD_ERROR}" style="${P_FIX.error}">${svg(PATHS.circleAlert, { cls: FIELD_ERROR_ICON })}<span class="${FIELD_TEXT}">${esc(errorMessage)}</span></p>`
    : "";
  const descriptionHtml = showDescription
    ? `<p id="${descriptionId}" class="${FIELD_DESCRIPTION}" style="${P_FIX.description}">${
        descriptionIcon != null ? `<span aria-hidden="true" class="${FIELD_DESCRIPTION_ICON}">${descriptionIcon}</span>` : ""
      }<span class="${FIELD_TEXT}">${esc(description)}</span></p>`
    : "";
  const countColor = invalid ? "text-fg-critical" : count === 0 ? "text-fg-neutral-subtle" : "text-fg-neutral";
  const maxColor = invalid ? "text-fg-critical" : "text-fg-neutral-subtle";
  const countHtml = showCount
    ? `<p id="${countId}" class="${FIELD_COUNT}" style="${P_FIX.count}"><span class="${countColor}">${count}</span><span class="${maxColor}">/${maxGraphemeCount}</span></p>`
    : "";
  const footer =
    showError || showDescription || showCount ? `<div data-slot="field-footer" class="${FIELD_FOOTER}">${errorHtml}${descriptionHtml}${countHtml}</div>` : "";

  const f = { controlId, labelId, describedBy, invalid, required: required || showRequiredIndicator, disabled, readOnly, value };
  const root = attrs(['data-slot="field"', invalid && 'data-invalid="true"', disabled && 'data-disabled="true"', `class="${FIELD_ROOT}"`]);
  // 오류 글이 바뀌면 화면 밖 polite 자리가 한 번 읽는다 — 보이는 오류 글은 aria-hidden(설명으로는 그대로 읽힌다)
  return `<div ${root}>${header}${control(f)}${footer}<span class="sr-only" aria-live="polite">${showError ? esc(errorMessage) : ""}</span></div>`;
}

// useFieldControl — 칸이 Field 안에 있으면 Field 의 id · 막힘 · 오류 · 필수 · 설명을 받는다. 칸에 직접 준 값이 이긴다
function fieldControl(props, f) {
  if (!f) return props;
  return {
    id: props.id ?? f.controlId,
    disabled: props.disabled ?? (f.disabled || undefined),
    readOnly: props.readOnly ?? (f.readOnly || undefined),
    "aria-invalid": props["aria-invalid"] ?? (f.invalid || undefined),
    "aria-required": props["aria-required"] ?? (f.required || undefined),
    "aria-describedby": join(f.describedBy, props["aria-describedby"]),
  };
}

// <InputButton> — input-button.tsx 그대로. f 는 Field 의 문맥(없으면 Field 밖의 칸 — 이름은 ariaLabel), uid 는 레시피의 useId 자리
// (값 · 붙이개 · 버튼 id 의 앞말). clearable = onClear 를 준 칸. popup = 코드가 넘긴 aria-haspopup="dialog" · aria-expanded.
// force = "pressed" · "focused" — 미리보기용 강제 상태. pressBasis 는 레시피가 누르는 순간 상자를 재서 다는 --press-basis
function inputButton({
  f,
  uid,
  id,
  size = "responsive",
  value,
  placeholder,
  prefix,
  prefixIcon,
  suffix,
  suffixIcon,
  clearable = false,
  popup = false,
  ariaLabel,
  disabled,
  readOnly,
  invalid,
  force,
  pressBasis,
}) {
  const control = fieldControl({ id, disabled, readOnly, "aria-invalid": invalid }, f);
  const buttonId = control.id ?? `${uid}-button`;
  const valueId = `${uid}-value`;
  const prefixId = prefix != null ? `${uid}-prefix` : undefined;
  const suffixId = suffix != null ? `${uid}-suffix` : undefined;
  const isDisabled = !!control.disabled;
  const isReadOnly = !!control.readOnly;
  const isInvalid = control["aria-invalid"] === true || control["aria-invalid"] === "true";
  const interactive = !isDisabled && !isReadOnly;
  const hasValue = value != null && value !== false && value !== "";
  const showClear = clearable && hasValue && interactive;
  const iconColor = isDisabled ? ICON_COLOR.disabled : ICON_COLOR.enabled;
  const affixColor = isDisabled ? AFFIX_COLOR.disabled : AFFIX_COLOR.enabled;
  const valueColor = isDisabled ? VALUE_COLOR.disabled : hasValue ? VALUE_COLOR.value : VALUE_COLOR.placeholder;
  // 이름 — 라벨(aria-label 을 주면 그 글) 다음에 값이 이어 읽힌다. 자기 id 를 가리키면 aria-label 이 그 자리에 읽힌다
  const labelledBy = join(ariaLabel ? buttonId : f?.labelId, valueId);

  const state = isDisabled ? "disabled" : isReadOnly ? "readonly" : "enabled";
  let buttonClass = merge(`${BUTTON_BASE} ${inputButtonSurfaceVariants({ state, hover: "group", invalid: isInvalid })}`);
  let contentClass = merge(interactive ? `${CONTENT} ${CONTENT_PRESS}` : CONTENT);
  if (force === "pressed") {
    buttonClass = pressed(buttonClass, "active");
    contentClass = pressed(contentClass, "peer-active/input-button");
  }
  if (force === "focused") buttonClass = pressed(buttonClass, "focus-visible");

  const root = attrs([
    'data-slot="input-button"',
    `data-size="${size}"`,
    isInvalid && 'data-invalid="true"',
    isDisabled && 'data-disabled="true"',
    isReadOnly && 'data-readonly="true"',
    `class="${merge(`${ROOT_BASE} ${inputButtonVariants({ size })}`)}"`,
    pressBasis != null && `style="--press-basis:${pressBasis}"`,
  ]);
  // 속성 차례는 레시피의 JSX 차례다 — type · data-slot · class → 코드가 넘긴 것(aria-haspopup · aria-expanded · aria-label) → id …
  const button = attrs([
    'type="button"',
    'data-slot="input-button-trigger"',
    `class="${buttonClass}"`,
    popup && 'aria-haspopup="dialog"',
    popup && 'aria-expanded="false"',
    ariaLabel && `aria-label="${esc(ariaLabel)}"`,
    `id="${buttonId}"`,
    isDisabled && "disabled",
    isReadOnly && 'aria-disabled="true"',
    isInvalid && 'aria-invalid="true"',
    `aria-labelledby="${labelledBy}"`,
    join(prefixId, suffixId, control["aria-describedby"]) && `aria-describedby="${join(prefixId, suffixId, control["aria-describedby"])}"`,
  ]);
  const parts = [
    prefixIcon != null
      ? `<span aria-hidden="true" data-slot="input-button-prefix-icon" class="${merge(`${ICON} ${iconColor}`)}">${prefixIcon}</span>`
      : "",
    prefix != null
      ? `<span id="${prefixId}" aria-hidden="true" data-slot="input-button-prefix" class="${merge(`${AFFIX} ${affixColor}`)}">${esc(prefix)}</span>`
      : "",
    `<span id="${valueId}" aria-hidden="true" data-slot="input-button-value"${hasValue ? "" : ' data-placeholder=""'} class="${merge(`${VALUE_BASE} ${valueColor}`)}">${esc(hasValue ? value : (placeholder ?? ""))}</span>`,
    showClear
      ? `<button type="button" aria-label="지우기" tabindex="-1" data-slot="input-button-clear" class="${CLEAR}">${svg(PATHS.circleX)}</button>`
      : "",
    suffix != null
      ? `<span id="${suffixId}" aria-hidden="true" data-slot="input-button-suffix" class="${merge(`${AFFIX} ${affixColor}`)}">${esc(suffix)}</span>`
      : "",
    suffixIcon != null
      ? `<span aria-hidden="true" data-slot="input-button-suffix-icon" class="${merge(`${ICON} ${iconColor}`)}">${suffixIcon}</span>`
      : "",
  ];
  return `<div ${root}><button ${button}></button><span data-slot="input-button-content" class="${contentClass}">${parts.join("")}</span></div>`;
}

// 칸은 보통 기본 레이어(흰 면) 위에 놓인다. 사이트 미리보기 칸의 바탕(bg-page = bg-layer-basement)은 비활성 · 읽기 전용의 바탕(bg-disabled)과
// 같은 색이라, 그 위에 바로 그리면 막힌 칸이 보이지 않는다
const SURFACE =
  "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-x6);";
const surface = (html) => `<div style="${SURFACE}">${html}</div>`;
// 칸 하나는 폭을 줄여 그린다 — 넓은 미리보기 칸에 늘어지지 않게
const narrow = (html) => `<div style="max-width:400px;">${html}</div>`;
// 폼 — Field 사이 24(field.yaml form)
const stack = (items) => `<div style="display:flex; flex-direction:column; gap:var(--spacing-x6);">${items.join("")}</div>`;
// 나란히 — 칸 사이 16 · 줄 사이 24, 좁으면 한 줄에 하나
const grid = (items, min = 220) =>
  `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(${min}px, 1fr)); gap:var(--spacing-x6) var(--spacing-x4); align-items:start;">${items.join("")}</div>`;
const CAPTION =
  "font-size:var(--text-t2); line-height:var(--text-t2--line-height); font-weight:400; color:var(--color-fg-neutral-subtle);";
// 크기 · 상태 이름처럼 코드로 쓰는 이름표
const CODE = `${CAPTION} font-family:ui-monospace, SFMono-Regular, Menlo, monospace;`;
// 아래 이름표
const labeled = (html, caption, style = CODE) =>
  `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2); min-width:0;">${html}<span style="${style}">${caption}</span></div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const inputButtonExamples = [
  {
    title: "날짜 — \"완료\" 로 넣는다",
    description:
      "레시피(InputButton · useInputButtonSurface)를 Field 안에 둔다. 값은 쓰는 쪽이 가진다 — 칸은 값을 보이고 누르면 onClick 을 부를 뿐이다. 여는 자리는 useInputButtonSurface() 가 창 폭으로 정한다 — 1280 미만은 \"sheet\"(아래에서 올라오는 시트, 위에 제목), 이상은 \"popover\"(칸 아래 8 · 왼쪽 맞춤 팝오버). 칸 크기가 바뀌는 폭과 같다. 달력은 고르는 동안 칸의 값을 바꾸지 않는다 — 시트 · 팝오버 안의 draft 에만 있다가 \"완료\" 를 누를 때 들어가고, 바깥을 누르거나 Esc 로 닫으면 버린다. 열 때는 칸의 값에서 시작한다. 이름은 라벨 + 고른 값(aria-labelledby — \"날짜 10월 12일 (월)\")이다. 시트는 제목(고를 값의 종류 \"날짜 선택\") + 위 닫기 버튼 · 바닥 \"완료\"(large 48)이고, 팝오버는 머리 없이 같은 말(\"날짜 선택\")을 aria-label 로 달고 바닥 \"완료\"(small 36)다 — 그 모습은 bottom-sheet · popover 페이지에 있다. 달력은 DatePicker(selection=\"single\" · autoFocus — 열면 고른 날, 없으면 오늘로 초점)이고 하루를 고르기 전에는 \"완료\" 가 막힌다(disabled={!draft}) — 달력의 모습은 date-picker 페이지에 있어 미리보기는 칸만 그렸다.",
    jsx: `import { CalendarDays } from "lucide-react"
import { BottomSheet, BottomSheetBody, BottomSheetContent, BottomSheetFooter } from "@/components/ui/bottom-sheet"
import { Button } from "@/components/ui/button"
import { DatePicker, formatDateValue } from "@/components/ui/date-picker"
import { Field } from "@/components/ui/field"
import { InputButton, useInputButtonSurface } from "@/components/ui/input-button"
import { Popover, PopoverBody, PopoverContent, PopoverFooter, PopoverTrigger } from "@/components/ui/popover"

const surface = useInputButtonSurface()
const [open, setOpen] = React.useState(false)
const [draft, setDraft] = React.useState(date)

const trigger = (
  <InputButton
    placeholder="날짜 선택"
    value={date ? formatDateValue(date) : undefined}
    suffixIcon={<CalendarDays />}
    aria-haspopup="dialog"
    aria-expanded={open}
    onClick={() => {
      setDraft(date) // 열 때 칸의 값에서 시작한다
      setOpen(true)
    }}
  />
)
const calendar = <DatePicker selection="single" value={draft} onValueChange={setDraft} autoFocus />
// 바닥 버튼은 크기를 주지 않는다 — 시트 바닥은 large 48, 팝오버 바닥은 small 36 을 넣는다
const done = <Button disabled={!draft} onClick={() => { setDate(draft); setOpen(false) }}>완료</Button>

<Field label="날짜">
  {surface === "sheet" ? (
    <BottomSheet open={open} onOpenChange={setOpen}>
      {trigger}
      <BottomSheetContent title="날짜 선택">
        <BottomSheetBody>{calendar}</BottomSheetBody>
        <BottomSheetFooter>{done}</BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  ) : (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      {/* 고르는 패널은 머리 없이 — 이름은 aria-label */}
      <PopoverContent aria-label="날짜 선택" align="start">
        <PopoverBody>{calendar}</PopoverBody>
        <PopoverFooter>{done}</PopoverFooter>
      </PopoverContent>
    </Popover>
  )}
</Field>`,
    render: () =>
      surface(
        narrow(
          field({
            id: "input-button-ex-date",
            label: "날짜",
            control: (f) =>
              inputButton({ f, uid: "input-button-ex-date", placeholder: "날짜 선택", value: "10월 12일 (월)", suffixIcon: ICONS.calendarDays, popup: true }),
          }),
        ),
      ),
  },

  {
    title: "목록 — 누르면 바로",
    description:
      "시트 · 팝오버의 목록(카테고리 격자 · 하나 고르는 목록)은 누르는 순간 고르고 닫힌다 — \"완료\" 를 두지 않는다(여럿 고르는 목록만 \"완료\" 로 넣는다). 고른 것은 체크 · 라디오로 보이고, 열면 고른 것이 보이게 스크롤된다. 값은 고른 자리의 표기 그대로 쓴다(\"식비 · 점심\"). 고른 카테고리의 아이콘은 앞 아이콘(20 · 16 · fg-neutral-muted)으로, 무엇이 열리는지는 뒤 아이콘(chevron-down)으로 알린다.",
    jsx: `<Field label="카테고리">
  <InputButton
    placeholder="카테고리 선택"
    value={category?.name}
    prefixIcon={category ? <CategoryIcon category={category} /> : undefined}
    suffixIcon={<ChevronDown />}
    aria-haspopup="dialog"
    aria-expanded={open}
    onClick={() => setOpen(true)}
  />
</Field>
{/* 시트의 격자에서 누르면 setCategory(c) · setOpen(false) */}`,
    render: () =>
      surface(
        narrow(
          field({
            id: "input-button-ex-list",
            label: "카테고리",
            control: (f) =>
              inputButton({
                f,
                uid: "input-button-ex-list",
                placeholder: "카테고리 선택",
                value: "식비 · 점심",
                prefixIcon: ICONS.utensils,
                suffixIcon: ICONS.chevronDown,
                popup: true,
              }),
          }),
        ),
      ),
  },

  {
    title: "검색 시트 · 지우기",
    description:
      "스크롤로 찾기 어려운 목록(결재자 · 사람 · 종목 · 카드사)은 시트 · 팝오버 위에 검색칸, 아래에 목록을 둔다 — Searchable List 다. 검색칸은 Input 의 밑줄형이다(시트에 입력이 하나뿐인 목록 위 검색 — 사용자 결정 2026-10-08 17A, 상자형 52 는 두지 않는다): 아래 1px stroke-neutral-weak · 치는 동안 2px stroke-neutral-contrast · 앞 돋보기, large 40 · 데스크톱 medium 34. 결과는 List 줄 + 오른쪽 라디오, 키보드는 콤보박스(초점은 검색칸 · ↓ ↑ 강조 · Enter 고름)다 — 모양 · 쓰임은 Searchable List 페이지에 있다. 열면 검색칸에 포커스가 가고, 치는 대로 목록이 걸러지고, 고르면 닫힌다. 칸에 바로 치는 Combobox 는 두지 않는다. 선택 사항인 칸이면 onClear 를 준다 — 값이 있을 때만 값 바로 뒤 · 뒤 아이콘 앞에 지우기(circle-x · 22 · 18 · fg-neutral-subtle)가 서고, 누르면 값만 비우고 아무것도 열지 않는다. 지우기는 상자 위에서 따로 눌리는 버튼이다(이름 \"지우기\" · Tab 순서에 없다).",
    jsx: `<Field label="참조자" indicator="선택">
  <InputButton
    placeholder="참조자 선택"
    value={cc?.name}
    suffixIcon={<ChevronDown />}
    onClear={() => setCc(undefined)} // 값이 있을 때만 지우기 버튼
    aria-haspopup="dialog"
    aria-expanded={open}
    onClick={() => setOpen(true)}
  />
</Field>
{/* 시트 · 팝오버: Searchable List — 위에 밑줄형 검색칸(<SearchableListInput> = Input variant="underline" · 앞 돋보기), 아래 걸러진 목록 */}`,
    render: () =>
      surface(
        narrow(
          field({
            id: "input-button-ex-search",
            label: "참조자",
            indicator: "선택",
            control: (f) =>
              inputButton({
                f,
                uid: "input-button-ex-search",
                placeholder: "참조자 선택",
                value: "김포레",
                suffixIcon: ICONS.chevronDown,
                clearable: true,
                popup: true,
              }),
          }),
        ),
      ),
  },

  {
    title: "상태",
    description:
      "상태는 Field 에 주면 칸이 받는다. 오류(invalid)는 안쪽 2px stroke-critical-solid(눌러도 그대로)와 칸 아래 오류 글로 알린다. 비활성(disabled)은 바탕 bg-disabled · 글자 · 아이콘 fg-disabled 이고 누르지 못한다. 읽기 전용(readOnly)은 바탕 bg-disabled 에 값은 진한 글자 그대로다 — 포커스는 되고(aria-disabled) 눌러도 · Enter · Space 로도 열리지 않는다. 흐리게(불투명도) 그리지 않는다.",
    jsx: `<Field label="날짜" invalid errorMessage="날짜를 골라주세요.">
  <InputButton placeholder="날짜 선택" suffixIcon={<CalendarDays />} onClick={openPicker} />
</Field>
<Field label="날짜" disabled>
  <InputButton value="10월 1일 (목)" suffixIcon={<CalendarDays />} />
</Field>
<Field label="입사일" readOnly>
  <InputButton value="2024년 3월 4일 (월)" suffixIcon={<CalendarDays />} />
</Field>`,
    render: () =>
      surface(
        narrow(
          stack([
            field({
              id: "input-button-ex-state-invalid",
              label: "날짜",
              invalid: true,
              errorMessage: "날짜를 골라주세요.",
              control: (f) =>
                inputButton({ f, uid: "input-button-ex-state-invalid", placeholder: "날짜 선택", suffixIcon: ICONS.calendarDays }),
            }),
            field({
              id: "input-button-ex-state-disabled",
              label: "날짜",
              disabled: true,
              control: (f) => inputButton({ f, uid: "input-button-ex-state-disabled", value: "10월 1일 (목)", suffixIcon: ICONS.calendarDays }),
            }),
            field({
              id: "input-button-ex-state-readonly",
              label: "입사일",
              readOnly: true,
              control: (f) => inputButton({ f, uid: "input-button-ex-state-readonly", value: "2024년 3월 4일 (월)", suffixIcon: ICONS.calendarDays }),
            }),
          ]),
        ),
      ),
  },

  {
    title: "크기 — large · medium · responsive",
    description:
      "large(52)는 폰 · 앱에서, medium(40)은 1280 이상 데스크톱 웹(마우스)에서만 쓴다. 웹의 기본은 responsive 다 — 1280 미만은 large, 이상은 medium(SEED lg). 크기가 높이와 함께 모서리(12 · 8) · 좌우 여백(16 · 14) · 사이(10 · 8) · 글자(16 · 14) · 아이콘(20 · 16) · 지우기(22 · 18)를 정한다 — Input 의 상자형과 같은 값이라 한 폼에 섞여도 줄이 맞는다. 앱은 늘 large 이고, 한 폼 안에서 크기를 섞지 않는다. 창 폭을 1280 앞뒤로 바꾸면 responsive 칸이 바뀐다.",
    jsx: `<InputButton size="large" aria-label="날짜" value="10월 1일 (목)" suffixIcon={<CalendarDays />} onClick={openPicker} />
<InputButton size="medium" aria-label="날짜" value="10월 1일 (목)" suffixIcon={<CalendarDays />} onClick={openPicker} />
<InputButton aria-label="날짜" value="10월 1일 (목)" suffixIcon={<CalendarDays />} onClick={openPicker} />  {/* responsive — 기본 */}`,
    render: () =>
      surface(
        grid(
          [
            ["large", "large · 52"],
            ["medium", "medium · 40"],
            ["responsive", "responsive — 기본"],
          ].map(([size, caption]) =>
            labeled(
              inputButton({ uid: `input-button-ex-size-${size}`, size, ariaLabel: "날짜", value: "10월 1일 (목)", suffixIcon: ICONS.calendarDays }),
              caption,
            ),
          ),
          150,
        ),
      ),
  },

  {
    title: "상태 매트릭스",
    description:
      "버튼이라 누름 · 포커스가 Input 과 다르다. pressed 는 바탕 bg-layer-default-pressed 에 값 · 붙이개만 2px 거리로 준다 — 테두리 · 바탕은 그대로이고, 마우스 호버는 같은 바탕에 축소가 없다. focused 는 키보드 포커스에만 바깥 링 2px · 띄움 2px stroke-focus-ring 이다 — 입력 중을 알리는 Input 의 안쪽 2px 와 다르다. invalid 는 안쪽 2px stroke-critical-solid(눌러도 그대로), disabled 는 바탕 bg-disabled · 글자 · 아이콘 fg-disabled, readonly 는 바탕 bg-disabled 에 값은 진한 글자다. 정적 미리보기라 pressed · focused 는 active: · peer-active: · focus-visible: 클래스에서 접두어만 뗀 사본을 덧붙여 그렸다 — 축소 기준(--press-basis)은 레시피가 누르는 순간 max(높이, 폭 ÷ 4, 24) 로 재고, 여기서는 높이 52 로 적었다.",
    jsx: `// 누름 · 포커스는 고르는 prop 이 없다 — 누르는 동안 · 키보드 포커스에 그렇게 그린다
<InputButton size="large" aria-label="날짜" value="10월 12일 (월)" suffixIcon={<CalendarDays />} onClick={openPicker} />                // enabled · pressed · focused
<InputButton size="large" aria-label="날짜" placeholder="날짜 선택" suffixIcon={<CalendarDays />} aria-invalid onClick={openPicker} /> // invalid — Field 안이면 Field 의 invalid
<InputButton size="large" aria-label="날짜" value="10월 12일 (월)" suffixIcon={<CalendarDays />} disabled />                            // disabled
<InputButton size="large" aria-label="날짜" value="10월 12일 (월)" suffixIcon={<CalendarDays />} readOnly />                            // readonly — 포커스는 되고 열리지 않는다`,
    render: () => {
      const states = [
        { name: "enabled" },
        { name: "pressed", force: "pressed", pressBasis: 52 },
        { name: "focused", force: "focused" },
        { name: "invalid", invalid: true, value: undefined },
        { name: "disabled", disabled: true },
        { name: "readonly", readOnly: true },
      ];
      return surface(
        grid(
          states.map(({ name, ...state }) =>
            labeled(
              inputButton({
                uid: `input-button-ex-matrix-${name}`,
                size: "large",
                ariaLabel: "날짜",
                placeholder: "날짜 선택",
                value: "10월 12일 (월)",
                suffixIcon: ICONS.calendarDays,
                ...state,
              }),
              name,
            ),
          ),
          160,
        ),
      );
    },
  },

  {
    title: "앞 · 뒤 붙이개",
    description:
      "칸 안 앞 · 뒤에 글자(prefix · suffix — 값과 같은 크기의 fg-neutral-subtle)나 아이콘(prefixIcon · suffixIcon — 20 · 16 · fg-neutral-muted)을 둔다. 뒤 아이콘은 누르면 무엇이 열리는지 알린다 — 달력(calendar) · 시계(clock) · 목록이나 격자(chevron-down). 한 폼 안에서 같은 것을 여는 칸은 같은 아이콘을 쓴다. 값의 종류나 고른 값에 딸린 아이콘(고른 카테고리)은 앞 아이콘이다. 붙이개 글자는 칸의 설명(aria-describedby)으로 읽히고, 아이콘만으로 뜻을 알리지 않는다 — 라벨이 함께 알린다. 상자 어디를 눌러도(붙이개 · 여백 포함) 같은 버튼이다.",
    jsx: `import { CalendarDays, ChevronDown, Clock, Utensils } from "lucide-react"

<Field label="날짜">
  <InputButton value="10월 12일 (월)" suffixIcon={<CalendarDays />} onClick={openDate} />
</Field>
<Field label="시각">
  <InputButton value="오후 12:30" suffixIcon={<Clock />} onClick={openTime} />
</Field>
<Field label="결재자">
  <InputButton value="김포레" suffixIcon={<ChevronDown />} onClick={openPeople} />
</Field>
<Field label="카테고리">
  <InputButton value="식비 · 점심" prefixIcon={<Utensils />} suffixIcon={<ChevronDown />} onClick={openCategory} />
</Field>
<Field label="적금 기간">
  <InputButton prefix="총" value="12" suffix="개월" suffixIcon={<ChevronDown />} onClick={openTerm} />
</Field>`,
    render: () => {
      const cells = [
        ["date", "날짜", { value: "10월 12일 (월)", suffixIcon: ICONS.calendarDays }, "suffixIcon — calendar(달력)"],
        ["time", "시각", { value: "오후 12:30", suffixIcon: ICONS.clock }, "suffixIcon — clock(시각 휠)"],
        ["people", "결재자", { value: "김포레", suffixIcon: ICONS.chevronDown }, "suffixIcon — chevron-down(목록 · 격자)"],
        ["category", "카테고리", { value: "식비 · 점심", prefixIcon: ICONS.utensils, suffixIcon: ICONS.chevronDown }, "prefixIcon — 고른 카테고리의 아이콘"],
        ["term", "적금 기간", { prefix: "총", value: "12", suffix: "개월", suffixIcon: ICONS.chevronDown }, "prefix · suffix — 단위 글자"],
      ];
      return surface(
        grid(
          cells.map(([key, label, props, caption]) =>
            labeled(
              field({ id: `input-button-ex-affix-${key}`, label, control: (f) => inputButton({ f, uid: `input-button-ex-affix-${key}`, ...props }) }),
              caption,
              CAPTION,
            ),
          ),
        ),
      );
    },
  },

  {
    title: "지우기 버튼",
    description:
      "onClear 를 주면 값이 있고 막히지 않았을 때만 지우기 버튼이 선다 — 비었거나 막혔거나 읽기 전용이면 없다. 누르면 onClear 만 부르고(열지 않는다) 칸에 포커스를 둔다. 누름도 지우기 버튼만 준다(상자는 눌리지 않는다). 보이는 크기는 22 · 18 이고 누르는 영역은 ::before 로 24 다. 선택 사항인 칸에만 둔다 — 필수 칸에는 두지 않는다. 정적 미리보기에는 지우는 스크립트가 없어 눌러도 값이 그대로다.",
    jsx: `import { ChevronDown } from "lucide-react"

const [cc, setCc] = useState<Person>()

<Field label="참조자" indicator="선택">
  <InputButton
    placeholder="참조자 선택"
    value={cc?.name}
    suffixIcon={<ChevronDown />}
    onClear={() => setCc(undefined)}
    onClick={() => setOpen(true)}
  />
</Field>`,
    render: () => {
      const cells = [
        ["empty", {}, "비었을 때 — 지우기 없음"],
        ["value", { value: "김포레" }, "값이 있을 때 — 값 바로 뒤 · 뒤 아이콘 앞"],
        ["disabled", { value: "김포레", disabled: true }, "막혔을 때 — 보이지 않는다"],
      ];
      return surface(
        grid(
          cells.map(([key, props, caption]) =>
            labeled(
              field({
                id: `input-button-ex-clear-${key}`,
                label: "참조자",
                indicator: "선택",
                control: (f) =>
                  inputButton({ f, uid: `input-button-ex-clear-${key}`, placeholder: "참조자 선택", suffixIcon: ICONS.chevronDown, clearable: true, ...props }),
              }),
              caption,
              CAPTION,
            ),
          ),
          200,
        ),
      );
    },
  },
];
