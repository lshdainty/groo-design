/*
 * Groo Icon Picker 예제 — docs site components/icon-picker.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 둘(카테고리 — 아이콘 · 이름 찾기 · 세트 밖 아이콘)은 차례 · 제목 · 코드가
 * specs/components/icon-picker.md 의 "코드" 절과 같다. 트리거는 Input Button, 여는 자리는 1280 미만 Bottom Sheet · 이상 Popover 이고, 고를 수 있는 것은
 * 고른 세트(category-icons.yaml — 148개 · 13 묶음)뿐이다(2026-10-09). SEED 에는 아이콘 고르기 부품이 없다 — 세트를 두는 것은 SEED Iconography 의
 * "현재 제작된 범위 내에서" 를 따랐고, 칸 48 · 고른 칸 안쪽 2px · 2차원 화살표 · 한국어 찾기는 groo 가 정했다. 옛 예제(40 정사각 트리거 ·
 * 팝오버 320 · 8열 × 32 · lucide 전체 · 영어 이름 · "없음")를 대신한다.
 *
 * CELL · GRID · GRID_COLUMNS · GROUP_HEADER · ANNOUNCE_DELAY 는 recipes/shadcn/components/ui/icon-picker.tsx 의 상수와, SEARCH_POPOVER · BODY_POPOVER ·
 * RESULTS_TOP 은 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 본문의 끝 흐림(scrollFog — 늘 켜진 위 20 · 아래 80)은
 * 레시피(useScrollFog)가 그릴 때 토큰 --gradient-fade-mask 에 방향을 붙여 style(mask-*) · data-fog-axis 로 넣는다 — 정적 HTML 은 같은 일을 빌드 때
 * DESIGN.md 의 토큰 값으로 해 style 에 적었다(SOLID · fogStyle 은 popover-examples.mjs 의 것과 같다). 트리거의 IB_* · ROOT_BASE · BUTTON_BASE · CONTENT* · ICON · VALUE_* 는
 * input-button.tsx 의 값이다 — input-button-examples.mjs 의 것과 같다(그 파일의 조각 · field() · inputButton() 을 그대로 옮겼다).
 * 찾기 칸의 INPUT_* 는 input.tsx(밑줄형)의 값이다 — searchable-list-examples.mjs 의 것과 같다. 세트는 이 미리보기가 그리는 줄만
 * category-icons.yaml 에서 옮겼다(아이콘은 lucide-react 1.28.0 과 같은 모양의 inline SVG — lucide 의 class · xmlns 는 그리지 않는다).
 * 규칙은 specs/components/icon-picker.md, 수치 원본은 specs/components/icon-picker.yaml · category-icons.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 트리거 Input Button <div data-slot="input-button"> > <button data-slot="input-button-trigger" data-icon-picker
 * data-icon aria-haspopup="dialog"> · 콘텐츠(지금 아이콘 · 이름 · 아래 화살표). 열린 팝오버는 그 아래에 그 순간을 멈춰 그렸다 — 찾기 칸
 * <div data-slot="icon-picker-search">(Input 밑줄형 medium) · 본문 <div data-slot="icon-picker-body"> > 격자 <div role="listbox" data-slot="icon-picker-grid"> > 묶음 <div role="group"> >
 * 머리 · 칸 <div role="option" data-slot="icon-picker-cell" aria-selected>. 칸의 툴팁(Tooltip)과 팝오버의 겉(popover.tsx)은 그리지 않았다.
 * 레시피의 스크립트(열고 닫기 · 찾기 · 2차원 화살표 · 결과 수 알림 · 고른 칸으로 스크롤)는 정적 HTML 에 없다.
 */

import { readFileSync } from "node:fs";

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

// ── input.tsx 의 cva 와 같은 값 — 찾기 칸(밑줄형 · medium — 팝오버) ─────────────

const INPUT_BASE = "relative flex w-full min-w-0 items-center overflow-hidden bg-transparent font-sans cursor-text data-[disabled]:cursor-not-allowed after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-solid after:border-transparent after:content-[''] after:[transition:border-color_var(--motion-duration-d2)_var(--motion-ease-easing)] [&:has(input:focus):not([data-invalid]):not([data-readonly])]:after:border-stroke-neutral-contrast data-[invalid]:after:border-stroke-critical-solid";
const INPUT_VARIANTS = {
  variant: { underline: "rounded-none shadow-[inset_0_-1px_0_0_var(--color-stroke-neutral-weak)] after:border-b-2" },
  size: { large: "", medium: "", responsive: "" },
};
const INPUT_COMPOUND = [
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
];
const INPUT_DEFAULTS = { variant: "outline", size: "responsive" };
const AFFIX_EDGE = "first:ml-[var(--text-input-px)] last:mr-[var(--text-input-px)]";
const INPUT_ICON = "flex shrink-0 [&>svg]:size-[var(--text-input-icon)]";
const INPUT_ICON_COLOR = "text-fg-neutral-muted";
const INPUT_VALUE = ["min-w-0 flex-1 self-stretch border-0 bg-transparent p-0 caret-fg-neutral outline-none [font:inherit]", "first:pl-[var(--text-input-px)] last:pr-[var(--text-input-px)] disabled:cursor-not-allowed", "[&:-webkit-autofill]:bg-clip-text [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-fg-neutral)] [&:-webkit-autofill]:[transition:background-color_9999s_9999s]"];
const INPUT_VALUE_COLOR = "text-fg-neutral placeholder:text-fg-placeholder";

// ── icon-picker.tsx 의 상수와 같은 값 ─────────────────────────────────────

// 칸 — 48 · 모서리 12 · 아이콘 24. 고른 칸은 안쪽 2px(::after) + 선 2.5. 호버 · 누름 바탕 + 2px 거리 축소, 키보드 포커스에만 바깥 링
const CELL = [
  "relative flex size-12 shrink-0 cursor-pointer select-none items-center justify-center rounded-r3 bg-transparent text-fg-neutral scroll-m-1",
  "[&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0 [&_svg]:[stroke-width:2] aria-selected:[&_svg]:[stroke-width:2.5]",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-2 after:border-solid after:border-transparent after:content-['']",
  "aria-selected:after:border-stroke-neutral-contrast",
  "hover:bg-bg-layer-floating-pressed active:bg-bg-layer-floating-pressed",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "[--press-basis:48] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

// 격자 — 칸 48 · 사이 최소 4(남는 폭은 칸 사이에 고르게) · 줄 사이 4. 시트 6열 · 팝오버 7열(icon-picker.yaml surface).
// 시트 본문이 308(48 × 6 + 4 × 5)보다 좁은 폰은 들어가는 만큼만 둔다 — 본문(@container)의 폭으로 가른다
const GRID = "grid justify-between gap-x-x1 gap-y-x1";
const GRID_COLUMNS = {
  sheet: "grid-cols-[repeat(auto-fill,48px)] @min-[308px]:grid-cols-[repeat(6,48px)]",
  popover: "grid-cols-[repeat(7,48px)]",
};

// 묶음 머리 — List Header mediumWeak(14 · 500 · fg-neutral-subtle), 위 12 · 아래 8
const GROUP_HEADER = "pb-x2 pt-x3 font-sans text-t4 font-medium text-fg-neutral-subtle";

// 결과 수를 알리기까지 — 치기를 멈춘 뒤 한 번(글자마다 읽지 않게)
const ANNOUNCE_DELAY = 500;

// ── icon-picker.tsx 의 JSX 에 적힌 클래스 ───────────────────────────────

// 찾기 칸 자리 — 팝오버(위 24 · 좌우 24). 아래는 비운다 — 본문의 흐림 여백 20 + 묶음 머리 위 12(찾는 동안은 격자 위 12)가 찾기 칸과의 사이 32 다
const SEARCH_POPOVER = "shrink-0 px-x6 pt-x6";
// 본문 — PopoverBody 와 같은 자리 · 같은 끝 흐림(위 20 · 아래 80 + 본문 안 여백 · 스크롤 여유 그만큼, 좌우 24). 넘쳐도 본문에 Tab 을 세우지 않는다
// (칸이 초점을 받는다). 찾기 칸 ↔ 첫 묶음 머리 글 · 찾는 동안 격자 32(흐림 여백 20 + 위 12)
const BODY_POPOVER = "min-h-0 flex-1 overflow-y-auto px-x6 pb-[80px] pt-[20px] scroll-pb-[80px] scroll-pt-[20px]";
// 찾는 동안은 묶음 머리가 없다 — 격자 위 12(searchGap, 묶음 머리 위 여백과 같다)
const RESULTS_TOP = "pt-x3";

// ── 끝 흐림 — scroll-fog.tsx 의 useScrollFog 와 같은 셈(overlayBody · 세로) ─────────

// 토큰 값 — 레시피는 그릴 때 getComputedStyle 로 읽는다. 정적 HTML 은 DESIGN.md 의 v104 표에서 읽는다
const FADE_MASK = /`gradient-fade-mask` \| `(linear-gradient\([^`]+\))`/.exec(readFileSync(new URL("../../../DESIGN.md", import.meta.url), "utf8"))[1];
const SOLID = "linear-gradient(#000, #000)";
const withDirection = (token, direction) => token.replace(/^linear-gradient\(/, `linear-gradient(${direction}, `);
// 겹친 층을 곱한다 — scroll-fog.tsx 의 COMPOSITE 와 같은 값(-webkit- 쪽은 옛 이름 source-in)
const COMPOSITE = { "mask-composite": "intersect", "-webkit-mask-composite": "source-in" };
// 위 20 · 아래 80 — 흐린 쪽마다 상자 전체 크기의 층 하나(단계는 그 쪽 깊이의 몫 — 깊이 안에서 불투명에 닿는다), 두 층을 곱한다.
// 상자의 style 에 mask-* 와 -webkit-mask-* 를 같이 넣는다
function fogStyle(start = "20px", end = "80px") {
  const layer = (depth, direction) =>
    parseFloat(depth) > 0 ? withDirection(FADE_MASK.replace(/(\d+(?:\.\d+)?)%/g, (_m, p) => `calc(${depth} * ${Number(p) / 100})`), direction) : SOLID;
  const mask = {
    image: `${layer(start, "to bottom")}, ${layer(end, "to top")}`,
    size: "100% 100%, 100% 100%",
    position: "0 0, 0 0",
    repeat: "no-repeat",
  };
  return [
    ...["image", "size", "position", "repeat"].map((p) => `mask-${p}:${mask[p]}; -webkit-mask-${p}:${mask[p]};`),
    ...Object.entries(COMPOSITE).map(([p, v]) => `${p}:${v};`),
  ].join(" ");
}

// ── 세트 — specs/components/category-icons.yaml(→ lib/category-icons.ts)에서 이 미리보기가 그리는 줄만 옮겼다 ──

const SET = [
  ["utensils", "식비", "식사", '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>'],
  ["utensils-crossed", "식비", "외식", '<path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2.1 21.8 6.4-6.3"/><path d="m19 5-7 7"/>'],
  ["chef-hat", "식비", "요리", '<path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"/><path d="M6 17h12"/>'],
  ["soup", "식비", "국 · 찌개", '<path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M7 21h10"/><path d="M19.5 12 22 6"/><path d="M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62"/><path d="M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62"/><path d="M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62"/>'],
  ["salad", "식비", "샐러드", '<path d="M7 21h10"/><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1"/><path d="m13 12 4-4"/><path d="M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2"/>'],
  ["sandwich", "식비", "샌드위치", '<path d="m2.37 11.223 8.372-6.777a2 2 0 0 1 2.516 0l8.371 6.777"/><path d="M21 15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5.25"/><path d="M3 15a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9"/><path d="m6.67 15 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2"/><rect width="20" height="4" x="2" y="11" rx="1"/>'],
  ["pizza", "식비", "피자", '<path d="m12 14-1 1"/><path d="m13.75 18.25-1.25 1.42"/><path d="M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12"/><path d="M18.8 9.3a1 1 0 0 0 2.1 7.7"/><path d="M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z"/>'],
  ["coffee", "카페", "커피", '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>'],
  ["cup-soda", "카페", "음료", '<path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/><path d="m12 8 1-6h2"/>'],
  ["glass-water", "카페", "물", '<path d="M5.116 4.104A1 1 0 0 1 6.11 3h11.78a1 1 0 0 1 .994 1.105L17.19 20.21A2 2 0 0 1 15.2 22H8.8a2 2 0 0 1-2-1.79z"/><path d="M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0"/>'],
  ["beer", "카페", "맥주", '<path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M9 12v6"/><path d="M13 12v6"/><path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z"/><path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/>'],
  ["wine", "카페", "와인", '<path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/>'],
  ["martini", "카페", "칵테일", '<path d="M12 12 4.207 4.207A.707.707 0 0 1 4.707 3h14.586a.707.707 0 0 1 .5 1.207z"/><path d="M12 12v10"/><path d="M7 22h10"/>'],
  ["bean", "카페", "원두", '<path d="M10.165 6.598C9.954 7.478 9.64 8.36 9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22c7.732 0 14-6.268 14-14a6 6 0 0 0-11.835-1.402Z"/><path d="M5.341 10.62a4 4 0 1 0 5.279-5.28"/>'],
  ["house", "주거", "집", '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'],
  ["tag", "기타", "태그", '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>'],
].map(([id, group, name, paths]) => ({ id, group, name, paths }));
const findIcon = (id) => SET.find((it) => it.id === id || (id === "home" && it.id === "house")) ?? null;
// 세트 밖 저장 값의 그림(lucide-react/dynamic — DynamicIcon)
const OUTSIDE = { "a-arrow-down": '<path d="m14 12 4 4 4-4"/><path d="M18 16V7"/><path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16"/><path d="M3.304 13h6.392"/>' };

// ── 미리보기 조각(아이콘 고르기) ─────────────────────────────────────────

const textInputVariants = cvaOf(INPUT_BASE, { variants: INPUT_VARIANTS, compoundVariants: INPUT_COMPOUND, defaultVariants: INPUT_DEFAULTS });
const SEARCH = '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>';
const CHEVRON = svg('<path d="m6 9 6 6 6-6"/>');

// <IconPicker value> 의 트리거 — Input Button(앞 아이콘 = 지금 아이콘 · 값 = 그 이름 · 뒤 chevron-down). 세트 밖이면 그 아이콘 + "지금 아이콘",
// 빈 값이면 태그 + "태그". 팝오버 트리거라 aria-haspopup="dialog" · aria-expanded, 레시피가 넘긴 data-icon-picker · data-icon 을 단다
function iconTrigger({ uid, value, size = "responsive", f }) {
  const entry = value ? findIcon(value) : null;
  const shownId = entry ? entry.id : value ? value : "tag";
  const shownName = entry ? entry.name : value ? "지금 아이콘" : "태그";
  const glyph = svg(entry ? entry.paths : value ? OUTSIDE[value] : findIcon("tag").paths);
  return inputButton({ f, uid, size, value: shownName, prefixIcon: glyph, suffixIcon: CHEVRON, popup: true }).replace(
    'data-slot="input-button-trigger"',
    `data-slot="input-button-trigger" data-icon-picker="" data-icon="${shownId}"`,
  );
}

// 칸 — role="option" · 이름은 한국어 이름(마우스는 같은 글의 툴팁 — Tooltip 은 정적 미리보기에 없다). Tab 은 고른 칸 하나
const cell = (it, selectedId) =>
  `<div role="option" aria-selected="${it.id === selectedId}" aria-label="${esc(it.name)}" tabindex="${it.id === selectedId ? 0 : -1}" data-slot="icon-picker-cell" data-icon="${it.id}" class="${CELL}">${svg(it.paths)}</div>`;

// 팝오버 안 — 찾기 칸(밑줄형 medium) + 격자(listbox — 묶음 머리 · 칸). query 를 주면 결과를 머리 없이
function panel({ uid, selectedId = "coffee", query = "", groups = ["식비", "카페"] }) {
  const hits = query ? SET.filter((it) => [it.name, it.id].some((t) => t.replace(/\s+/g, "").includes(query.replace(/\s+/g, ""))) || (query === "월세" && it.id === "house") || (query === "커피" && it.id === "bean")) : null;
  const input = attrs([
    'type="text"',
    'data-slot="text-input-value"',
    `class="${merge(`${INPUT_VALUE.join(" ")} ${INPUT_VALUE_COLOR}`)}"`,
    query && `value="${esc(query)}"`,
    'placeholder="아이콘 이름 검색"',
    'aria-label="아이콘 검색"',
    'autocomplete="off"',
    'spellcheck="false"',
  ]);
  const search = `<div data-slot="icon-picker-search" class="${SEARCH_POPOVER}"><div data-slot="text-input" data-variant="underline" data-size="medium" class="${textInputVariants({ variant: "underline", size: "medium" })}"><span data-slot="text-input-prefix-icon" aria-hidden="true" class="${merge(`${INPUT_ICON} ${AFFIX_EDGE} ${INPUT_ICON_COLOR}`)}">${svg(SEARCH)}</span><input ${input}></div></div>`;
  const body = hits
    ? `<div role="none" class="${GRID} ${GRID_COLUMNS.popover} ${RESULTS_TOP}">${hits.map((it) => cell(it, selectedId)).join("")}</div>`
    : groups
        .map(
          (g) =>
            `<div role="group" aria-labelledby="${uid}-${g}" data-slot="icon-picker-group"><div id="${uid}-${g}" role="presentation" data-slot="icon-picker-group-header" class="${GROUP_HEADER}">${esc(g)}</div><div role="none" class="${GRID} ${GRID_COLUMNS.popover}">${SET.filter((it) => it.group === g).map((it) => cell(it, selectedId)).join("")}</div></div>`,
        )
        .join("");
  const count = hits ? `검색 결과 ${hits.length}개` : "";
  return `<div role="dialog" aria-label="아이콘" data-slot="popover-content" data-icon-picker="popover" style="${POPOVER}">${search}<div data-slot="icon-picker-body" data-scroll-fog="overlayBody" class="${BODY_POPOVER}" data-fog-axis="y" style="${fogStyle()}"><div role="listbox" aria-label="아이콘" data-slot="icon-picker-grid">${body}</div><span class="sr-only" aria-live="polite" aria-atomic="true" data-slot="icon-picker-count">${count}</span></div></div>`;
}

// 팝오버 표면 — popover.tsx 의 겉모습(떠 있는 표면 · 모서리 20 · 그림자 s3)을 미리보기 틀로 흉내 낸다. 폭 408 = 칸 48 × 7 + 사이 4 × 6 + 좌우 24 × 2
const POPOVER =
  "width:408px; max-width:100%; box-sizing:border-box; border-radius:var(--radius-r5); background:var(--color-bg-layer-floating); box-shadow:var(--shadow-s3); color:var(--color-fg-neutral);";

// ── 예제 ──────────────────────────────────────────────────────────────────

export const iconPickerExamples = [
  {
    title: "카테고리 — 아이콘",
    description:
      "카테고리 · 저축 목표에 붙일 아이콘을 고르는 칸이다. 트리거는 Input Button — 라벨 \"아이콘\"(Field), 앞에 지금 아이콘(large 20 · medium 16), 값에 그 아이콘의 한국어 이름(\"커피\"), 뒤에 아래 화살표이고 이름은 \"아이콘, 커피\" 로 읽힌다. 누르면 1280 미만은 Bottom Sheet(제목 \"아이콘\"), 이상은 Popover(머리 없이 · 이름 \"아이콘\" · 폭 408)로 고른 세트(category-icons.yaml — 148개 · 13 묶음)의 격자를 연다 — lucide 전체를 열지 않는다. 위에 찾기 칸(Input 밑줄형 — 시트 large 40 · 팝오버 medium 34 · \"아이콘 이름 검색\"), 묶음마다 머리(14 · 500 · fg-neutral-subtle · 위 12 · 아래 8), 칸은 48 · 모서리 12 · 아이콘 24(선 2)를 들어가는 만큼 둔다(사이 최소 4 — 폰 시트 6열 · 팝오버 7열 · 줄 사이 4). 지금 값의 칸은 안쪽 2px 짙은 테두리(stroke-neutral-contrast) + 선 2.5 이고 바탕은 칠하지 않는다. 고르면 바로 닫히고 초점은 트리거로 간다. 격자에 Tab 은 하나 — 화살표로 옮긴다(← → 차례 · ↑ ↓ 보이는 위아래 줄 · Home · End 그 줄 · Enter · Space 고르기). \"없음\" 칸은 두지 않는다 — 새 카테고리는 태그로 시작한다.",
    jsx: `import { useState } from "react"
import { Field } from "@/components/ui/field"
import { IconPicker } from "@/components/ui/icon-picker"
import { DEFAULT_CATEGORY_ICON } from "@/lib/category-icons"

const [icon, setIcon] = useState<string>(category?.icon || DEFAULT_CATEGORY_ICON) // 새 카테고리는 태그로 시작

<Field label="아이콘">
  <IconPicker value={icon} onValueChange={setIcon} />
</Field>`,
    render: () =>
      `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2); max-width:408px;">${surface(
        field({ id: "ipk-ex-1", label: "아이콘", control: (f) => iconTrigger({ uid: "ipk-ex-1-trigger", value: "coffee", f }) }),
      )}${panel({ uid: "ipk-ex-1-grid" })}</div>`,
  },

  {
    title: "이름 찾기 · 세트 밖 아이콘",
    description:
      "세트는 lib/category-icons.ts 다 — category-icons.yaml 에서 만든 표(CATEGORY_ICONS · CATEGORY_ICON_GROUPS · DEFAULT_CATEGORY_ICON)와 찾기 함수. findCategoryIcon 은 저장 값(lucide 이름)을 세트의 한 줄로 바꾼다 — lucideAliases 로 옛 이름(서버 시드의 home → 집)도 찾고, 세트 밖이면 null 이라 트리거는 그 아이콘 + \"지금 아이콘\" 이다(지우지도 바꾸지도 않는다). searchCategoryIcons 는 찾는 말과 이름 · 찾는 말 · id 를 소문자로 바꾸고 공백을 뺀 뒤 부분 일치로 세트 차례 그대로 거른다(\"커피\" → 커피 · 원두, \"월세\" → 집). 결과는 묶음 머리 없이 늘어놓고, 개수는 치기를 멈춘 뒤 화면 밖으로 한 번 알린다(\"검색 결과 1개\"). 0건이면 격자 자리에 Result Section medium \"'{검색어}'에 대한 아이콘이 없어요\" 다.",
    jsx: `import { findCategoryIcon, searchCategoryIcons } from "@/lib/category-icons"

findCategoryIcon("coffee")?.name // "커피"
findCategoryIcon("home")?.id // "house" — 서버 시드의 옛 이름
findCategoryIcon("a-arrow-down") // null — 세트 밖, 트리거는 "지금 아이콘"
searchCategoryIcons("월세").map((it) => it.name) // ["집"]`,
    render: () =>
      `<div style="display:flex; flex-direction:column; gap:var(--spacing-x4); max-width:408px;">${surface(
        stack([
          labeled(field({ id: "ipk-ex-2a", label: "아이콘", control: (f) => iconTrigger({ uid: "ipk-ex-2a-trigger", value: "coffee", f }) }), 'value="coffee" — 커피'),
          labeled(field({ id: "ipk-ex-2b", label: "아이콘", control: (f) => iconTrigger({ uid: "ipk-ex-2b-trigger", value: "home", f }) }), 'value="home" — 집(lucideAliases)'),
          labeled(field({ id: "ipk-ex-2c", label: "아이콘", control: (f) => iconTrigger({ uid: "ipk-ex-2c-trigger", value: "a-arrow-down", f }) }), 'value="a-arrow-down" — 세트 밖, 지금 아이콘'),
          labeled(field({ id: "ipk-ex-2d", label: "아이콘", control: (f) => iconTrigger({ uid: "ipk-ex-2d-trigger", value: "", f }) }), 'value="" — 태그'),
        ]),
      )}${panel({ uid: "ipk-ex-2-grid", selectedId: "house", query: "월세" })}</div>`,
  },
];
