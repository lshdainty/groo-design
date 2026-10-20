/*
 * shadcn Input 예제 — docs site components/input.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 기본 · 붙이개 · 밑줄 · 상태의 코드와 글은 specs/components/input.md 의 "코드" 절과 같고,
 * 나머지(크기 · 상태 매트릭스 · 지우기 · 금액)는 md 의 Properties · Guidelines 를 코드로 더 보인다.
 *
 * ROOT_* · AFFIX_EDGE · AFFIX_* · VALUE_* · CLEAR 는 recipes/shadcn/components/ui/input.tsx 의 cva 정의 · 클래스와 글자 하나까지 같아야 한다 —
 * 두 파일을 함께 고친다. 같은 값을 field-examples.mjs · select-box-examples.mjs 도 옮겨 쓴다(input.tsx 를 고치면 셋을 함께).
 * 둘레의 FIELD_* · field() 는 field.tsx 의 것이다 — field-examples.mjs · textarea-examples.mjs 의 것과 같다.
 * 규칙은 specs/components/input.md, 수치 원본은 specs/components/input.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — Field <div data-slot="field"> > 머리(<label for>) · 상자 · 꼬리(<p>),
 * 상자 <div data-slot="text-input"> > (앞 아이콘 · 앞 글자) + <input data-slot="text-input-value"> + (뒤 글자 · 뒤 아이콘 · 지우기 버튼).
 * 상태는 상자의 data-invalid · data-disabled · data-readonly 와 입력의 aria-invalid · disabled · readonly 로 그린다.
 * id 는 레시피의 useId 자리다 — 예제마다 앞말을 달리해 한 페이지에서 겹치지 않게 한다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 * 레시피의 스크립트(상자를 눌러 입력으로 포커스 · 지우기 · 글자 수 세기 · 최대에서 자르기)는 정적 HTML 에 없다 —
 * 칸에 쓸 수는 있지만 지우기 버튼 · 글자 수는 따라 움직이지 않는다. 칸을 눌러 포커스하면 테두리는 레시피 그대로 바뀐다.
 */

// ── input.tsx 의 cva 와 같은 값 ─────────────────────────────────────────

// 상자(textInputVariants) — 테두리는 안쪽 1px(inset shadow), 포커스 · 오류의 2px 는 ::after 로 안쪽에 덧그린다
const ROOT_BASE = [
  "relative flex w-full min-w-0 items-center overflow-hidden bg-transparent font-sans",
  "cursor-text data-[disabled]:cursor-not-allowed",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-solid after:border-transparent after:content-['']",
  "after:[transition:border-color_var(--motion-duration-d2)_var(--motion-ease-easing)]",
  "[&:has(input:focus):not([data-invalid]):not([data-readonly])]:after:border-stroke-neutral-contrast",
  "data-[invalid]:after:border-stroke-critical-solid",
].join(" ");

const ROOT_VARIANTS = {
  variant: {
    outline: "shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] after:border-2 data-[disabled]:bg-bg-disabled data-[readonly]:bg-bg-disabled",
    underline: "rounded-none shadow-[inset_0_-1px_0_0_var(--color-stroke-neutral-weak)] after:border-b-2",
  },
  size: {
    large: "",
    medium: "",
    responsive: "",
  },
};

// 크기마다 --text-input-px(좌우 여백 — 맨 앞 · 맨 뒤 요소가 가진다) · --text-input-icon(앞 · 뒤 아이콘) · --text-input-clear(지우기)
const ROOT_COMPOUND = [
  {
    variant: "outline",
    size: "large",
    className: "min-h-13 gap-x2_5 rounded-r3 text-t5 [--text-input-px:var(--spacing-x4)] [--text-input-icon:20px] [--text-input-clear:22px]",
  },
  {
    variant: "outline",
    size: "medium",
    className: "min-h-10 gap-x2 rounded-r2 text-t4 [--text-input-px:var(--spacing-x3_5)] [--text-input-icon:16px] [--text-input-clear:18px]",
  },
  {
    variant: "outline",
    size: "responsive",
    className: [
      "min-h-13 gap-x2_5 rounded-r3 text-t5 [--text-input-px:var(--spacing-x4)] [--text-input-icon:20px] [--text-input-clear:22px]",
      "lg:min-h-10 lg:gap-x2 lg:rounded-r2 lg:text-t4 lg:[--text-input-px:var(--spacing-x3_5)] lg:[--text-input-icon:16px] lg:[--text-input-clear:18px]",
    ].join(" "),
  },
  {
    variant: "underline",
    size: "large",
    className: "min-h-10 gap-x2_5 py-x2 text-t6 [--text-input-px:0px] [--text-input-icon:24px] [--text-input-clear:22px]",
  },
  {
    variant: "underline",
    size: "medium",
    className: "min-h-[2.125rem] gap-x2 py-x1_5 text-t5 [--text-input-px:0px] [--text-input-icon:20px] [--text-input-clear:18px]",
  },
  {
    variant: "underline",
    size: "responsive",
    className: [
      "min-h-10 gap-x2_5 py-x2 text-t6 [--text-input-px:0px] [--text-input-icon:24px] [--text-input-clear:22px]",
      "lg:min-h-[2.125rem] lg:gap-x2 lg:py-x1_5 lg:text-t5 lg:[--text-input-icon:20px] lg:[--text-input-clear:18px]",
    ].join(" "),
  },
];

const ROOT_DEFAULTS = { variant: "outline", size: "responsive" };

// 붙이개 · 지우기 — 맨 앞 · 맨 뒤면 상자의 좌우 여백을 바깥 여백으로 가진다
const AFFIX_EDGE = "first:ml-[var(--text-input-px)] last:mr-[var(--text-input-px)]";

// 앞 · 뒤 글자(prefix · suffix) · 아이콘(prefixIcon · suffixIcon) — 레시피는 cn(이것, AFFIX_EDGE, 색)
const AFFIX_TEXT = "shrink-0";
const AFFIX_ICON = "flex shrink-0 [&>svg]:size-[var(--text-input-icon)]";
const AFFIX_COLOR = { enabled: "text-fg-neutral-subtle", disabled: "text-fg-disabled" };
const ICON_COLOR = { enabled: "text-fg-neutral-muted", disabled: "text-fg-disabled" };

// 입력(<input>) — 상자 높이를 채운다. 맨 앞 · 맨 뒤면 상자의 좌우 여백까지 차지한다. 레시피는 cn(이것, 값 색, className)
const VALUE_BASE = [
  "min-w-0 flex-1 self-stretch border-0 bg-transparent p-0 caret-fg-neutral outline-none [font:inherit]",
  "first:pl-[var(--text-input-px)] last:pr-[var(--text-input-px)] disabled:cursor-not-allowed",
  // 브라우저 자동 완성의 바탕색을 지운다 — 글자색은 칸 그대로(SEED)
  "[&:-webkit-autofill]:bg-clip-text [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-fg-neutral)] [&:-webkit-autofill]:[transition:background-color_9999s_9999s]",
].join(" ");

// 값 · placeholder 색 — 비활성, 밑줄형의 읽기 전용(바탕이 없어 글자로 가른다), 그 밖
const VALUE_COLOR = {
  enabled: "text-fg-neutral placeholder:text-fg-placeholder",
  disabled: "text-fg-disabled placeholder:text-fg-disabled",
  underlineReadOnly: "text-fg-neutral-muted placeholder:text-fg-neutral-muted",
};

// 지우기 — 값이 있고 막히지 않았을 때만. 누르는 영역은 원 둘레로 44(::before — 상자가 자른다). 레시피는 cn(앞 세 줄, AFFIX_EDGE)
const CLEAR = [
  "relative flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-fg-neutral-subtle",
  "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[&>svg]:size-[var(--text-input-clear)]",
].join(" ");

// ── field.tsx 의 클래스 — 칸을 감싸는 둘레 ─────────────────────────────

const FIELD_ROOT = "flex w-full min-w-0 flex-col gap-x2";
const FIELD_HEADER = "flex items-center justify-between gap-x2_5 px-x0_5";
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

// ── cva 풀이 · 미리보기 조각 ───────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다.
// 이 파일이 합치는 클래스에는 같은 속성을 다시 쓰는 자리가 없어 cn()(twMerge)은 이어 붙인 것과 같다
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

const textInputVariants = cvaOf(ROOT_BASE, {
  variants: ROOT_VARIANTS,
  compoundVariants: ROOT_COMPOUND,
  defaultVariants: ROOT_DEFAULTS,
});

// 정적 미리보기는 포커스를 쥘 수 없다 — 포커스한 모습은 레시피의 포커스 클래스에서 :has(input:focus) 만 뗀 사본을 덧붙여 그린다.
// 오류 · 읽기 전용을 거르는 :not() 은 남겨 레시피와 같은 칸에서만 짙은 테두리가 선다(오류는 포커스해도 빨간 2px 그대로).
// 사본의 선택자는 :not() 둘만큼 더 구체적이라 기본의 after:border-transparent 를 이긴다
const FOCUS = ":has(input:focus)";
const forceFocus = (classList) =>
  classList
    .split(" ")
    .filter((cls) => cls.includes(FOCUS))
    .map((cls) => cls.replace(FOCUS, ""))
    .join(" ");

const attrs = (list) => list.filter(Boolean).join(" ");
const join = (...ids) => ids.filter(Boolean).join(" ") || undefined;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// 글자 수 — field.tsx 처럼 자소(grapheme) 단위로 센다
const segmenter = new Intl.Segmenter("ko", { granularity: "grapheme" });
const countGraphemes = (value) => Array.from(segmenter.segment(value)).length;

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기는 감싼 자리의 [&>svg]:size-* 나 class 가 정한다
const icon = (paths, cls = "") =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ""} aria-hidden="true">${paths}</svg>`;

const ICONS = {
  search: icon('<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>'),
  circleX: icon('<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>'),
};
const CIRCLE_ALERT = '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>';

// <Field> — field.tsx 그대로. id 는 레시피의 useId 자리, value 는 입력의 값이다 — 레시피에서는 입력이 Field 에 글자 수를 알리고
// (useTextControl), 여기서는 Field 가 값을 세어 control 에 넘긴다. control(f) 는 칸의 HTML 을 돌려준다 — f 는 Field 의 문맥
// (useFieldControl · useFieldGroup 이 읽는 값). group 이면 묶음이라 라벨이 <label for> 대신 <span id> 가 된다.
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
    ? `<p id="${errorId}" aria-hidden="true" class="${FIELD_ERROR}" style="${P_FIX.error}">${icon(CIRCLE_ALERT, FIELD_ERROR_ICON)}<span class="${FIELD_TEXT}">${esc(errorMessage)}</span></p>`
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

// <Input> — input.tsx 그대로. f 는 Field 의 문맥(없으면 Field 밖의 칸 — 이름은 ariaLabel 로).
// id 는 붙이개 id 의 앞말(레시피의 useId 자리). focused 는 미리보기용 — 포커스한 모습(forceFocus)
function textInput({
  id,
  variant = "outline",
  size = "responsive",
  prefix,
  prefixIcon,
  suffix,
  suffixIcon,
  clearable = false,
  type = "text",
  inputMode,
  placeholder,
  value,
  ariaLabel,
  invalid,
  disabled,
  readOnly,
  focused = false,
  f,
} = {}) {
  const val = value ?? f?.value ?? "";
  const control = fieldControl({ disabled, readOnly, "aria-invalid": invalid }, f);
  const isDisabled = !!control.disabled;
  const isReadOnly = !!control.readOnly;
  const isInvalid = control["aria-invalid"] === true || control["aria-invalid"] === "true";
  const base = id ?? f?.controlId ?? "text-input";
  const prefixId = prefix != null ? `${base}-prefix` : undefined;
  const suffixId = suffix != null ? `${base}-suffix` : undefined;
  const showClear = clearable && val !== "" && !isDisabled && !isReadOnly;
  const affixColor = isDisabled ? AFFIX_COLOR.disabled : AFFIX_COLOR.enabled;
  const iconColor = isDisabled ? ICON_COLOR.disabled : ICON_COLOR.enabled;
  const valueColor = isDisabled
    ? VALUE_COLOR.disabled
    : variant === "underline" && isReadOnly
      ? VALUE_COLOR.underlineReadOnly
      : VALUE_COLOR.enabled;

  let rootClass = textInputVariants({ variant, size });
  if (focused) rootClass = `${rootClass} ${forceFocus(rootClass)}`;
  const root = attrs([
    'data-slot="text-input"',
    `data-variant="${variant}"`,
    `data-size="${size}"`,
    isInvalid && 'data-invalid="true"',
    isDisabled && 'data-disabled="true"',
    isReadOnly && 'data-readonly="true"',
    `class="${rootClass}"`,
  ]);

  const describedBy = [prefixId, suffixId, control["aria-describedby"]].filter(Boolean).join(" ");
  const input = attrs([
    `type="${type}"`,
    'data-slot="text-input-value"',
    `class="${VALUE_BASE} ${valueColor}"`,
    inputMode && `inputmode="${inputMode}"`,
    placeholder && `placeholder="${esc(placeholder)}"`,
    val !== "" && `value="${esc(val)}"`,
    ariaLabel && `aria-label="${esc(ariaLabel)}"`,
    control.id && `id="${control.id}"`,
    isDisabled && "disabled",
    isReadOnly && "readonly",
    isInvalid && 'aria-invalid="true"',
    control["aria-required"] && 'aria-required="true"',
    describedBy && `aria-describedby="${describedBy}"`,
  ]);

  const parts = [
    prefixIcon != null
      ? `<span data-slot="text-input-prefix-icon" aria-hidden="true" class="${AFFIX_ICON} ${AFFIX_EDGE} ${iconColor}">${prefixIcon}</span>`
      : "",
    prefix != null ? `<span id="${prefixId}" data-slot="text-input-prefix" class="${AFFIX_TEXT} ${AFFIX_EDGE} ${affixColor}">${esc(prefix)}</span>` : "",
    `<input ${input}>`,
    suffix != null ? `<span id="${suffixId}" data-slot="text-input-suffix" class="${AFFIX_TEXT} ${AFFIX_EDGE} ${affixColor}">${esc(suffix)}</span>` : "",
    suffixIcon != null
      ? `<span data-slot="text-input-suffix-icon" aria-hidden="true" class="${AFFIX_ICON} ${AFFIX_EDGE} ${iconColor}">${suffixIcon}</span>`
      : "",
    showClear
      ? `<button type="button" aria-label="지우기" tabindex="-1" data-slot="text-input-clear" class="${CLEAR} ${AFFIX_EDGE}">${ICONS.circleX}</button>`
      : "",
  ];
  return `<div ${root}>${parts.join("")}</div>`;
}

// 칸은 보통 기본 레이어(흰 면) 위에 놓인다. 사이트 미리보기 칸의 바탕(bg-page = bg-layer-basement)은
// 비활성 · 읽기 전용의 바탕(bg-disabled)과 같은 색(gray-200)이라, 그 위에 바로 그리면 막힌 칸이 보이지 않는다
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

export const inputExamples = [
  {
    title: "기본",
    description:
      "칸 하나는 Field 로 감싼다 — 라벨(16 · 500)이 위에, 설명(14 · fg-neutral-subtle)이 아래에 8 간격으로 붙고, 라벨은 <label for> 로 칸과 이어진다. 상자는 바탕 없이 안쪽 1px stroke-neutral-weak 다. 기본 크기가 responsive 라 1280 미만 화면에서는 높이 52 · 모서리 12, 1280 이상에서는 40 · 8 이다. placeholder 는 예시만 쓴다 — 칸 이름 대신 쓰지 않는다.",
    jsx: `import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

<Field label="제목" description="결재 목록에 이 제목으로 보여요.">
  <Input placeholder="예: 개인 사유" />
</Field>`,
    render: () =>
      surface(
        narrow(
          field({
            id: "input-ex-basic",
            label: "제목",
            description: "결재 목록에 이 제목으로 보여요.",
            control: (f) => textInput({ f, placeholder: "예: 개인 사유" }),
          }),
        ),
      ),
  },

  {
    title: "모양 — outline · underline",
    description:
      "상자(outline)가 기본이다. 화면에 입력이 하나뿐이면 밑줄(underline)을 쓴다 — 금액을 먼저 받는 단계 화면, 목록 위 검색, 초대 코드, 잠금 해제. 밑줄형은 아래 1px 선만 두고 모서리 · 좌우 여백이 없으며 글자가 한 단계 크다(large 18 · 높이 40). 단계 화면처럼 칸 이름이 그 화면의 제목이면 라벨을 bold 로 올린다(그 화면에서는 autoFocus 로 바로 쓰게 한다). 한 폼 안에서 두 모양을 섞지 않는다.",
    jsx: `// 폼 안의 칸 — 상자
<Field label="제목">
  <Input placeholder="예: 개인 사유" />
</Field>

// 화면에 입력이 하나뿐일 때 — 금액을 먼저 받는 단계 화면
<Field label="얼마를 썼나요?" labelWeight="bold">
  <Input variant="underline" size="large" inputMode="numeric" value={formatted} onChange={onAmountChange} suffix="원" />
</Field>`,
    render: () =>
      surface(
        grid([
          labeled(
            field({
              id: "input-ex-variant-outline",
              label: "제목",
              control: (f) => textInput({ f, placeholder: "예: 개인 사유" }),
            }),
            "outline — 기본",
          ),
          labeled(
            field({
              id: "input-ex-variant-underline",
              label: "얼마를 썼나요?",
              labelWeight: "bold",
              value: "12,000",
              control: (f) => textInput({ f, variant: "underline", size: "large", inputMode: "numeric", suffix: "원" }),
            }),
            "underline — 화면에 입력 하나",
          ),
        ]),
      ),
  },

  {
    title: "크기 — large · medium · responsive",
    description:
      "large(52 · 밑줄 40)는 폰 · 앱에서, medium(40 · 밑줄 34)은 1280 이상 데스크톱 웹(마우스)에서만 쓴다. 웹의 기본은 responsive 다 — 1280 미만은 large, 이상은 medium(SEED lg). 크기가 높이와 함께 모서리(12 · 8) · 좌우 여백(16 · 14) · 글자(16 · 14, 밑줄 18 · 16) · 아이콘(20 · 16)을 정하고, 라벨 · 설명은 크기와 관계없이 같다. 앱은 늘 large 이고, 한 폼 안에서 크기를 섞지 않는다. 창 폭을 1280 앞뒤로 바꾸면 responsive 칸이 바뀐다.",
    jsx: `<Input size="large" aria-label="제목" defaultValue="가족 여행" />
<Input size="medium" aria-label="제목" defaultValue="가족 여행" />
<Input aria-label="제목" defaultValue="가족 여행" />  {/* responsive — 기본 */}

<Input variant="underline" size="large" aria-label="제목" defaultValue="가족 여행" />
<Input variant="underline" size="medium" aria-label="제목" defaultValue="가족 여행" />
<Input variant="underline" aria-label="제목" defaultValue="가족 여행" />`,
    render: () => {
      const row = (variant, captions) =>
        grid(
          ["large", "medium", "responsive"].map((size, i) =>
            labeled(textInput({ variant, size, ariaLabel: "제목", value: "가족 여행" }), captions[i]),
          ),
          150,
        );
      return surface(
        stack([
          row("outline", ["large · 52", "medium · 40", "responsive — 기본"]),
          row("underline", ["underline · large · 40", "underline · medium · 34", "underline · responsive"]),
        ]),
      );
    },
  },

  {
    title: "상태",
    description:
      "상태는 Field 에 주면 칸이 받는다. 오류(invalid)는 칸의 안쪽 2px stroke-critical-solid 테두리와 꼬리의 오류 글(설명 자리를 대신한다)로 알린다. 비활성(disabled)은 바탕 bg-disabled · 글자 fg-disabled, 읽기 전용(readOnly)은 바탕 bg-disabled 에 값은 진한 글자 그대로다 — 흐리게(불투명도) 그리지 않는다. 라벨은 어느 상태에서도 그대로다.",
    jsx: `<Field label="이름" invalid errorMessage="이름을 입력해주세요.">
  <Input />
</Field>
<Field label="계좌" disabled>
  <Input defaultValue="국민 123-45-6789" />
</Field>
<Field label="아이디" readOnly>
  <Input defaultValue="groo" />
</Field>`,
    render: () =>
      surface(
        narrow(
          stack([
            field({
              id: "input-ex-state-invalid",
              label: "이름",
              invalid: true,
              errorMessage: "이름을 입력해주세요.",
              control: (f) => textInput({ f }),
            }),
            field({
              id: "input-ex-state-disabled",
              label: "계좌",
              disabled: true,
              value: "국민 123-45-6789",
              control: (f) => textInput({ f }),
            }),
            field({
              id: "input-ex-state-readonly",
              label: "아이디",
              readOnly: true,
              value: "groo",
              control: (f) => textInput({ f }),
            }),
          ]),
        ),
      ),
  },

  {
    title: "상태 매트릭스",
    description:
      "모양 × 상태. 포커스는 마우스 · 터치로 눌러도 보인다 — 안쪽에 2px stroke-neutral-contrast 를 덧그려 내용이 밀리지 않고, 색만 100ms 로 나타난다. 오류는 포커스해도 빨간 2px 그대로이고, 읽기 전용은 포커스 테두리가 없다. 밑줄형은 바탕이 없어 비활성은 글자만 fg-disabled, 읽기 전용은 글자가 fg-neutral-muted 다. 정적 미리보기는 포커스를 쥘 수 없어 focused 줄은 레시피의 포커스 클래스에서 :has(input:focus) 만 뗀 사본을 덧붙여 그렸다 — 오류 · 읽기 전용을 거르는 :not() 은 그대로라 invalid + focused 는 빨간 테두리로 남는다. 칸을 직접 눌러도 같은 테두리가 선다.",
    jsx: `// 상태는 상자의 data-* 와 입력의 속성으로 그린다 — 따로 고르는 prop 이 없다(Field 안이면 Field 가 내려 준다)
<Input aria-label="제목" defaultValue="가족 여행" />               // enabled
<Input aria-label="제목" defaultValue="가족 여행" autoFocus />     // focused — 안쪽 2px stroke-neutral-contrast
<Input aria-label="제목" defaultValue="가족 여행" aria-invalid />  // invalid — 안쪽 2px stroke-critical-solid, 포커스해도 그대로
<Input aria-label="제목" defaultValue="가족 여행" disabled />      // disabled — bg-disabled · fg-disabled
<Input aria-label="제목" defaultValue="가족 여행" readOnly />      // readonly — bg-disabled, 값은 진한 글자, 포커스 테두리 없음

// 밑줄형 — 바탕이 없다. 읽기 전용은 글자가 fg-neutral-muted
<Input variant="underline" aria-label="제목" defaultValue="가족 여행" readOnly />`,
    render: () => {
      const states = [
        { name: "enabled" },
        { name: "focused", focused: true },
        { name: "invalid", invalid: true },
        { name: "invalid + focused", invalid: true, focused: true },
        { name: "disabled", disabled: true },
        { name: "readonly", readOnly: true },
      ];
      const head = `<span></span><span style="${CODE}">outline</span><span style="${CODE}">underline</span>`;
      const rows = states
        .map(
          ({ name, ...state }) =>
            `<span style="${CODE}">${name}</span>${textInput({ ...state, ariaLabel: "제목", value: "가족 여행" })}${textInput({ ...state, variant: "underline", ariaLabel: "제목", value: "가족 여행" })}`,
        )
        .join("");
      return surface(
        `<div style="display:grid; grid-template-columns:max-content minmax(0, 1fr) minmax(0, 1fr); align-items:center; gap:var(--spacing-x3) var(--spacing-x4);">${head}${rows}</div>`,
      );
    },
  },

  {
    title: "앞 · 뒤 붙이개",
    description:
      "칸 안 앞 · 뒤에 글자(prefix · suffix)나 아이콘(prefixIcon · suffixIcon)을 둔다. 글자는 칸 글자와 같은 크기의 fg-neutral-subtle, 아이콘은 large 20 · medium 16 의 fg-neutral-muted 다. 단위는 뒤 글자로 둔다 — 라벨에 \"(원)\" 을 붙이거나 칸 밖에 따로 쓰지 않는다. 붙이개 글자는 칸의 aria-describedby 로 이어져 화면 읽기 프로그램도 \"원\" 을 듣는다. 아이콘만으로 뜻을 알리지 않는다 — 라벨이나 이름(aria-label)을 글로 단다. 상자의 붙이개 · 여백을 눌러도 입력으로 포커스가 간다(레시피의 스크립트).",
    jsx: `import { Search } from "lucide-react"

<Field label="홈페이지">
  <Input prefix="https://" placeholder="예: groo.app" />
</Field>

<Field label="금액">
  <Input inputMode="numeric" value={formatted} onChange={onAmountChange} suffix="원" />
</Field>

<Field label="나이" description="오늘 기준 만 나이">
  <Input inputMode="numeric" prefix="만" suffix="세" defaultValue="29" />
</Field>

<Input aria-label="메모 검색" prefixIcon={<Search />} placeholder="메모 검색" clearable />`,
    render: () =>
      surface(
        grid([
          labeled(
            field({
              id: "input-ex-affix-url",
              label: "홈페이지",
              control: (f) => textInput({ f, prefix: "https://", placeholder: "예: groo.app" }),
            }),
            "prefix",
          ),
          labeled(
            field({
              id: "input-ex-affix-amount",
              label: "금액",
              value: "12,000",
              control: (f) => textInput({ f, inputMode: "numeric", suffix: "원" }),
            }),
            "suffix",
          ),
          labeled(
            field({
              id: "input-ex-affix-age",
              label: "나이",
              description: "오늘 기준 만 나이",
              value: "29",
              control: (f) => textInput({ f, inputMode: "numeric", prefix: "만", suffix: "세" }),
            }),
            "prefix + suffix",
          ),
          labeled(
            textInput({ id: "input-ex-affix-search", prefixIcon: ICONS.search, ariaLabel: "메모 검색", placeholder: "메모 검색", clearable: true }),
            "prefixIcon — 이름은 aria-label",
          ),
        ]),
      ),
  },

  {
    title: "지우기 버튼",
    description:
      "clearable 을 주면 값이 있을 때만 끝에 지우기 버튼(circle-x · large 22 · medium 18 · fg-neutral-subtle)이 선다 — 누르는 영역은 원 둘레로 44(상자가 잘라 medium 은 44 × 40), 막혔거나 읽기 전용이면 보이지 않는다. 누르면 값을 비우고(onChange 로 빈 값) 입력에 포커스를 둔다. 이름은 \"지우기\" 이고 Tab 순서에는 넣지 않는다. 검색칸 · 선택 사항인 칸에 둔다 — 필수 칸에는 두지 않는다. 정적 미리보기에는 지우는 스크립트가 없어 눌러도 값이 그대로다.",
    jsx: `import { Search } from "lucide-react"

const [query, setQuery] = useState("")

<Input
  aria-label="메모 검색"
  prefixIcon={<Search />}
  placeholder="메모 검색"
  clearable
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>`,
    render: () =>
      surface(
        grid([
          labeled(
            textInput({ prefixIcon: ICONS.search, ariaLabel: "메모 검색", placeholder: "메모 검색", clearable: true, value: "관리비" }),
            "값이 있을 때 — 지우기 버튼",
            CAPTION,
          ),
          labeled(
            textInput({ prefixIcon: ICONS.search, ariaLabel: "메모 검색", placeholder: "메모 검색", clearable: true }),
            "비었을 때 — 버튼이 없다",
            CAPTION,
          ),
        ]),
      ),
  },

  {
    title: "금액 — 쉼표 · 숫자 키보드",
    description:
      "숫자도 글자로 받는다 — inputMode=\"numeric\"(소수면 \"decimal\")으로 숫자 키보드를 띄우고 type=\"number\" 는 쓰지 않는다(쉼표를 못 넣고, 휠 · 화살표로 값이 바뀐다). 쓰는 동안 천 단위 쉼표를 넣고(\"12,000\") 단위 \"원\" 은 뒤 글자로 둔다. 상태에는 숫자만 두고 화면에 보일 때만 쉼표를 붙인다.",
    jsx: `import { useState } from "react"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const [amount, setAmount] = useState("12000") // 숫자만
const formatted = amount === "" ? "" : Number(amount).toLocaleString("ko-KR")
const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value.replace(/\\D/g, ""))

<Field label="금액" description="100억 원까지 적을 수 있어요.">
  <Input inputMode="numeric" placeholder="0" value={formatted} onChange={onAmountChange} suffix="원" />
</Field>`,
    render: () =>
      surface(
        narrow(
          field({
            id: "input-ex-amount",
            label: "금액",
            description: "100억 원까지 적을 수 있어요.",
            value: "12,000",
            control: (f) => textInput({ f, inputMode: "numeric", placeholder: "0", suffix: "원" }),
          }),
        ),
      ),
  },
];
