/*
 * shadcn Field 예제 — docs site components/field.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 코드와 글은 specs/components/field.md 의 "코드" 절과 같고(라벨 · 설명 · 글자 수 ·
 * 필수 · 선택 · 오류 · 보조 액션 · 묶음 · react-hook-form), 라벨 굵기 · 글자 수 색은 md 의 Properties 를 코드로 더 보인다.
 * 옛 Label · Form 예제(label-examples · form-examples)는 여기로 합쳤다 — 라벨 · 필수 표시는 Field 의 머리, react-hook-form 은 FormField.
 *
 * FIELD_* 와 field() 는 recipes/shadcn/components/ui/field.tsx 의 클래스 · 짜임과 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다
 * (input-examples.mjs · textarea-examples.mjs 의 것과도 같다). 감싼 칸 · 버튼 · 묶음은 그 레시피의 값을 옮겨 썼다 —
 * INPUT_* 는 input.tsx(input-examples.mjs), TEXTAREA_* 는 textarea.tsx(textarea-examples.mjs), BUTTON_* 는 button.tsx(button-examples.mjs),
 * SB_* · RADIOMARK_* · DOT_* 는 select-box.tsx · radio-group.tsx(select-box-examples.mjs)의 것과 같다.
 * 규칙은 specs/components/field.md, 수치 원본은 specs/components/field.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — <div data-slot="field"> > 머리 <div data-slot="field-header">(라벨 · 필수 점 또는 "선택" ·
 * 보조 액션) · 칸 · 꼬리 <div data-slot="field-footer">(설명 또는 오류 · 글자 수) · 화면 밖 알림 자리 <span aria-live="polite">.
 * 칸이면 라벨은 <label for>, 묶음이면 <span id> 이고 묶음이 aria-labelledby 로 가리킨다. 설명 · 오류 · 글자 수는 칸의 aria-describedby 다.
 * id 는 레시피의 useId 자리다 — 예제마다 앞말을 달리해 한 페이지에서 겹치지 않게 한다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다). Radix 가 실행 중에 붙이는 것
 * (라디오의 tabindex · data-radix-collection-item, 묶음의 tabindex · dir · aria-required · style)은 그리지 않는다.
 * 레시피의 스크립트(글자 수 세기 · 최대에서 자르기 · 상자를 눌러 포커스 · 검증 · 제출)는 정적 HTML 에 없다.
 */

// ── field.tsx 의 클래스 ───────────────────────────────────────────────────

const FIELD_ROOT = "flex w-full min-w-0 flex-col gap-x2";
const FIELD_HEADER = "flex items-center justify-between gap-x2_5 px-x0_5";
// 라벨 — cn("min-w-0 font-sans text-t5 text-fg-neutral", 굵기)
const FIELD_LABEL = "min-w-0 font-sans text-t5 text-fg-neutral";
const FIELD_LABEL_WEIGHT = { medium: "font-medium", bold: "font-bold" };
// 필수 점 6 · "선택" 14 — rem 이라 글자 크기 설정을 따라 커진다
const FIELD_REQUIRED = "ml-[0.125rem] mt-[0.25rem] inline-block size-[0.375rem] rounded-full bg-fg-critical align-top";
const FIELD_INDICATOR = "pl-[0.25rem] align-bottom text-t4 font-normal leading-[var(--text-t5--line-height)] text-fg-neutral-subtle";
// 보조 액션 — 버튼(32)이 머리 높이(22)를 바꾸지 않게 위아래로 5 씩 넘친다
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

// ── input.tsx 의 cva 와 같은 값 — 한 줄 칸(<Input>) ─────────────────────

const INPUT_ROOT_BASE = [
  "relative flex w-full min-w-0 items-center overflow-hidden bg-transparent font-sans",
  "cursor-text data-[disabled]:cursor-not-allowed",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-solid after:border-transparent after:content-['']",
  "after:[transition:border-color_var(--motion-duration-d2)_var(--motion-ease-easing)]",
  "[&:has(input:focus):not([data-invalid]):not([data-readonly])]:after:border-stroke-neutral-contrast",
  "data-[invalid]:after:border-stroke-critical-solid",
].join(" ");

const INPUT_ROOT_VARIANTS = {
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

const INPUT_ROOT_COMPOUND = [
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

const INPUT_ROOT_DEFAULTS = { variant: "outline", size: "responsive" };

const INPUT_AFFIX_EDGE = "first:ml-[var(--text-input-px)] last:mr-[var(--text-input-px)]";
const INPUT_AFFIX_TEXT = "shrink-0";
const INPUT_AFFIX_ICON = "flex shrink-0 [&>svg]:size-[var(--text-input-icon)]";
const INPUT_AFFIX_COLOR = { enabled: "text-fg-neutral-subtle", disabled: "text-fg-disabled" };
const INPUT_ICON_COLOR = { enabled: "text-fg-neutral-muted", disabled: "text-fg-disabled" };

const INPUT_VALUE_BASE = [
  "min-w-0 flex-1 self-stretch border-0 bg-transparent p-0 outline-none [font:inherit]",
  "first:pl-[var(--text-input-px)] last:pr-[var(--text-input-px)] disabled:cursor-not-allowed",
  "[&:-webkit-autofill]:bg-clip-text [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-fg-neutral)] [&:-webkit-autofill]:[transition:background-color_9999s_9999s]",
].join(" ");

const INPUT_VALUE_COLOR = {
  enabled: "text-fg-neutral placeholder:text-fg-placeholder",
  disabled: "text-fg-disabled placeholder:text-fg-disabled",
  underlineReadOnly: "text-fg-neutral-muted placeholder:text-fg-neutral-muted",
};

const INPUT_CLEAR = [
  "flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-fg-neutral-subtle",
  "[&>svg]:size-[var(--text-input-clear)]",
].join(" ");

// ── textarea.tsx 의 cva 와 같은 값 — 여러 줄 칸(<Textarea>) ─────────────

const TEXTAREA_ROOT_BASE = [
  "relative flex w-full min-w-0 overflow-hidden bg-transparent font-sans shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)]",
  "cursor-text data-[disabled]:cursor-not-allowed data-[disabled]:bg-bg-disabled data-[readonly]:bg-bg-disabled",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-2 after:border-solid after:border-transparent after:content-['']",
  "after:[transition:border-color_var(--motion-duration-d2)_var(--motion-ease-easing)]",
  "[&:has(textarea:focus):not([data-invalid]):not([data-readonly])]:after:border-stroke-neutral-contrast",
  "data-[invalid]:after:border-stroke-critical-solid",
].join(" ");

const TEXTAREA_ROOT_VARIANTS = {
  size: {
    large: "rounded-r3 text-t5 [--textarea-px:var(--spacing-x4)] [--textarea-py:var(--spacing-x3_5)]",
    medium: "rounded-r2 text-t4 [--textarea-px:var(--spacing-x3_5)] [--textarea-py:var(--spacing-x3)]",
    responsive: [
      "rounded-r3 text-t5 [--textarea-px:var(--spacing-x4)] [--textarea-py:var(--spacing-x3_5)]",
      "lg:rounded-r2 lg:text-t4 lg:[--textarea-px:var(--spacing-x3_5)] lg:[--textarea-py:var(--spacing-x3)]",
    ].join(" "),
  },
};

const TEXTAREA_ROOT_DEFAULTS = { size: "responsive" };

const TEXTAREA_VALUE_BASE =
  "block w-full resize-none border-0 bg-transparent px-[var(--textarea-px)] py-[var(--textarea-py)] outline-none [font:inherit] disabled:cursor-not-allowed";

const TEXTAREA_VALUE_VARIANTS = {
  size: { large: "", medium: "", responsive: "" },
  autoSize: { true: "overflow-y-hidden", false: "overflow-y-auto" },
};

const TEXTAREA_VALUE_COMPOUND = [
  { autoSize: true, size: "large", className: "min-h-[5.875rem]" },
  { autoSize: true, size: "medium", className: "min-h-[5.125rem]" },
  { autoSize: true, size: "responsive", className: "min-h-[5.875rem] lg:min-h-[5.125rem]" },
  { autoSize: false, size: "large", className: "min-h-[4.5rem]" },
  { autoSize: false, size: "medium", className: "min-h-[3.875rem]" },
  { autoSize: false, size: "responsive", className: "min-h-[4.5rem] lg:min-h-[3.875rem]" },
];

const TEXTAREA_VALUE_DEFAULTS = { size: "responsive", autoSize: true };

const TEXTAREA_VALUE_COLOR = {
  enabled: "text-fg-neutral placeholder:text-fg-placeholder",
  disabled: "text-fg-disabled placeholder:text-fg-disabled",
};

// ── button.tsx 의 cva 와 같은 값 — 머리의 보조 액션 · 신청 버튼 ───────────
// 이 파일이 쓰는 변형(ghost · brandSolid) · 크기(xsmall · medium)와 그에 걸리는 compound 만 옮겼다

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
    ghost:
      "bg-transparent text-fg-neutral hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed aria-busy:bg-bg-layer-default-pressed disabled:bg-transparent [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
  },
  size: {
    xsmall: "h-8 rounded-full [--press-basis:32] [--progress-size:14px]",
    medium: "h-10 rounded-r2 [--press-basis:40] [--progress-size:16px]",
  },
  layout: { withText: "", iconOnly: "" },
  ghostColor: { neutral: "", neutralSubtle: "", brand: "", critical: "" },
  flush: { left: "", right: "" },
};

const BUTTON_COMPOUND = [
  { size: "xsmall", layout: "withText", className: "px-x3_5 py-x1_5 gap-x1 text-t3 [&_svg]:size-3.5" },
  { size: "medium", layout: "withText", className: "px-x4 py-x2_5 gap-x1_5 text-t4 [&_svg]:size-4" },
  { flush: "left", className: "pl-0" },
  { flush: "right", className: "pr-0" },
  { variant: "ghost", ghostColor: "neutralSubtle", className: "text-fg-neutral-subtle" },
  {
    variant: "ghost",
    flush: ["left", "right"],
    className:
      "text-fg-neutral-subtle hover:bg-transparent hover:text-fg-neutral active:bg-transparent active:text-fg-neutral focus-visible:text-fg-neutral",
  },
];

const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// ── select-box.tsx · radio-group.tsx 의 cva 와 같은 값 — 하나 고르기 묶음(1열 · 가로형 · 라디오) ──

const SB_GROUP_BASE = "grid w-full gap-x-x3 gap-y-component-default";
const SB_GROUP_VARIANTS = {
  columns: {
    1: "grid-cols-1",
    2: "auto-rows-fr grid-cols-2",
    3: "auto-rows-fr grid-cols-3",
  },
};
const SB_GROUP_DEFAULTS = { columns: 1 };

const SB_BOX_BASE = [
  "group/select-box relative flex h-full flex-col rounded-r3 bg-transparent shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)]",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-2 after:border-solid after:border-transparent after:content-[''] after:[transition:border-color_var(--motion-duration-d2)_var(--motion-ease-easing)]",
  "has-[[data-select-box-control][data-state=checked]:not([data-disabled])]:after:border-stroke-neutral-contrast",
  "has-[[data-select-box-control][data-state=checked][data-disabled]]:after:border-stroke-neutral-weak",
  "[@media(hover:hover)]:has-[[data-select-box-action]:not([data-disabled]):hover]:bg-bg-layer-default-pressed has-[[data-select-box-action]:not([data-disabled]):active]:bg-bg-layer-default-pressed",
  "has-[[data-select-box-control]:focus-visible]:outline-2 has-[[data-select-box-control]:focus-visible]:outline-offset-2 has-[[data-select-box-control]:focus-visible]:outline-stroke-focus-ring",
].join(" ");

const SB_TRIGGER_BASE = [
  "relative flex w-full grow cursor-pointer select-none justify-between gap-x1_5",
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "group-has-[[data-select-box-action]:not([data-disabled]):active]/select-box:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-has-[[data-select-box-action]:not([data-disabled]):active]/select-box:[scale:1]",
  "data-[disabled]:cursor-not-allowed",
].join(" ");
const SB_TRIGGER_VARIANTS = {
  layout: {
    horizontal: "items-center py-x4 pl-x5 pr-x4",
    vertical: "items-start px-x4 py-x5",
  },
};
const SB_TRIGGER_DEFAULTS = { layout: "horizontal" };

const SB_CONTENT_BASE = "flex min-w-0 flex-1";
const SB_CONTENT_VARIANTS = {
  layout: {
    horizontal: "flex-row items-center gap-x3",
    vertical: "flex-col gap-x2_5",
  },
};
const SB_CONTENT_DEFAULTS = { layout: "horizontal" };

const SB_BODY_BASE = "mr-auto flex min-w-0 flex-col items-start gap-x0_5 pr-x1 text-left";
const SB_LABEL_BASE = "flex items-center gap-x1 font-sans text-t5 font-medium text-fg-neutral";
const SB_LABEL_VARIANTS = { disabled: { true: "text-fg-disabled", false: "" } };
const SB_DESCRIPTION_BASE = "font-sans text-t3 text-fg-neutral-muted";
const SB_DESCRIPTION_VARIANTS = { disabled: { true: "text-fg-disabled", false: "" } };
const SB_DISABLED_DEFAULTS = { disabled: false };

// 컨트롤은 따로 줄지 않고 자기 포커스 링도 끈다 — 누르는 자리가 함께 주고, 링은 상자가 그린다(SEED)
const SB_MARK_IN_BOX = "active:[scale:1] focus-visible:outline-none";

const RADIOMARK_BASE = [
  "peer relative inline-grid shrink-0 cursor-pointer place-items-center rounded-full",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "active:[scale:calc(1-2/var(--press-basis))] group-active/radio:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1] motion-reduce:group-active/radio:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed disabled:[scale:1]",
  "border border-stroke-neutral-solid bg-transparent hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed group-hover/radio:bg-bg-layer-default-pressed group-active/radio:bg-bg-layer-default-pressed",
  "disabled:border-stroke-neutral-weak disabled:bg-bg-disabled",
  "data-[state=checked]:border-0 data-[state=checked]:disabled:bg-bg-disabled",
].join(" ");

const RADIOMARK_VARIANTS = {
  size: {
    medium: "size-5 [--press-basis:24]",
    large: "size-6 [--press-basis:24]",
  },
  tone: {
    neutral:
      "data-[state=checked]:bg-bg-neutral-inverted data-[state=checked]:hover:bg-bg-neutral-inverted-pressed data-[state=checked]:active:bg-bg-neutral-inverted-pressed data-[state=checked]:group-hover/radio:bg-bg-neutral-inverted-pressed data-[state=checked]:group-active/radio:bg-bg-neutral-inverted-pressed",
    brand:
      "data-[state=checked]:bg-bg-brand-solid data-[state=checked]:hover:bg-bg-brand-solid-pressed data-[state=checked]:active:bg-bg-brand-solid-pressed data-[state=checked]:group-hover/radio:bg-bg-brand-solid-pressed data-[state=checked]:group-active/radio:bg-bg-brand-solid-pressed",
  },
};
const RADIOMARK_DEFAULTS = { size: "medium", tone: "neutral" };

const DOT_BASE =
  "pointer-events-none block rounded-full bg-transparent [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)] data-[disabled]:data-[state=checked]:bg-fg-disabled";
const DOT_VARIANTS = {
  size: {
    medium: "size-2",
    large: "size-2.5",
  },
  tone: {
    neutral: "data-[state=checked]:bg-fg-neutral-inverted",
    brand: "data-[state=checked]:bg-static-white",
  },
};
const DOT_DEFAULTS = { size: "medium", tone: "neutral" };

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다.
// 참 · 거짓 축(autoSize · disabled)은 cva 처럼 "true" · "false" 글자 키로 찾고, compound 는 값 그대로 견준다
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

const textInputVariants = cvaOf(INPUT_ROOT_BASE, {
  variants: INPUT_ROOT_VARIANTS,
  compoundVariants: INPUT_ROOT_COMPOUND,
  defaultVariants: INPUT_ROOT_DEFAULTS,
});
const textareaVariants = cvaOf(TEXTAREA_ROOT_BASE, { variants: TEXTAREA_ROOT_VARIANTS, defaultVariants: TEXTAREA_ROOT_DEFAULTS });
const textareaValueVariants = cvaOf(TEXTAREA_VALUE_BASE, {
  variants: TEXTAREA_VALUE_VARIANTS,
  compoundVariants: TEXTAREA_VALUE_COMPOUND,
  defaultVariants: TEXTAREA_VALUE_DEFAULTS,
});
const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });
const selectBoxGroupVariants = cvaOf(SB_GROUP_BASE, { variants: SB_GROUP_VARIANTS, defaultVariants: SB_GROUP_DEFAULTS });
const selectBoxVariants = cvaOf(SB_BOX_BASE);
const selectBoxTriggerVariants = cvaOf(SB_TRIGGER_BASE, { variants: SB_TRIGGER_VARIANTS, defaultVariants: SB_TRIGGER_DEFAULTS });
const selectBoxContentVariants = cvaOf(SB_CONTENT_BASE, { variants: SB_CONTENT_VARIANTS, defaultVariants: SB_CONTENT_DEFAULTS });
const selectBoxBodyVariants = cvaOf(SB_BODY_BASE);
const selectBoxLabelVariants = cvaOf(SB_LABEL_BASE, { variants: SB_LABEL_VARIANTS, defaultVariants: SB_DISABLED_DEFAULTS });
const selectBoxDescriptionVariants = cvaOf(SB_DESCRIPTION_BASE, { variants: SB_DESCRIPTION_VARIANTS, defaultVariants: SB_DISABLED_DEFAULTS });
const radiomarkVariants = cvaOf(RADIOMARK_BASE, { variants: RADIOMARK_VARIANTS, defaultVariants: RADIOMARK_DEFAULTS });
const radiomarkDotVariants = cvaOf(DOT_BASE, { variants: DOT_VARIANTS, defaultVariants: DOT_DEFAULTS });

// "has-[[data-select-box-control]:focus-visible]:outline-2" → ["has-[…]", "outline-2"] — 괄호 안의 ":" 는 가르지 않는다
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

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다. 이 파일이 합치는 클래스(버튼 · 라디오)에 나오는 무리만 안다 —
// 배경 · 글자색 · 글자 크기 · 모서리 · 폭 · 높이 · 임의 속성([prop:…]). text-t* 는 글자 크기라 글자색과 겹치지 않는다(recipes/shadcn/lib/utils.ts).
// 그래서 flush ghost 의 text-fg-neutral-subtle · hover:bg-transparent 가 ghost 의 글자색 · 누름 바탕을, 라디오의 active:[scale:1] 이
// active:[scale:calc(…)] 를 지운다. 여백은 보지 않는다 — flush 의 pr-0 은 compound 순서로도, Tailwind 가 찍는 순서로도 px-* 뒤라 이긴다.
// 칸(Input · Textarea)의 클래스에는 겹치는 자리가 없어 합치지 않는다
const GROUPS = [
  [/^bg-/, "bg"],
  [/^text-(?:fg-|static-|transparent$)/, "color"],
  [/^text-t\d+$/, "font-size"],
  [/^rounded-(?:none|full|r\d+)$/, "rounded"],
  [/^w-/, "w"],
  [/^h-/, "h"],
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

// 정적 미리보기는 포커스를 쥘 수 없다 — 포커스한 모습은 레시피의 포커스 클래스에서 :has(input:focus) · :has(textarea:focus) 만 뗀
// 사본을 덧붙여 그린다. 오류 · 읽기 전용을 거르는 :not() 은 남겨 레시피와 같은 칸에서만 짙은 테두리가 선다(오류는 포커스해도 빨간 그대로)
const forceFocus = (classList, selector) =>
  classList
    .split(" ")
    .filter((cls) => cls.includes(selector))
    .map((cls) => cls.replace(selector, ""))
    .join(" ");

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const join = (...ids) => ids.filter(Boolean).join(" ") || undefined;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// 글자 수 — field.tsx 처럼 자소(grapheme) 단위로 센다
const segmenter = new Intl.Segmenter("ko", { granularity: "grapheme" });
const countGraphemes = (value) => Array.from(segmenter.segment(value)).length;

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기는 감싼 자리의 [&>svg]:size-* 나 class 가 정한다
const icon = (paths, cls = "") =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ""} aria-hidden="true">${paths}</svg>`;
const CIRCLE_ALERT = '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>';
const CIRCLE_X = icon('<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>');

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

// <Input> — input.tsx 그대로(input-examples.mjs 의 textInput 과 같다). f 는 Field 의 문맥(없으면 이름은 ariaLabel 로).
// id 는 붙이개 id 의 앞말(레시피의 useId 자리). focused 는 미리보기용 — 포커스한 모습
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
  const affixColor = isDisabled ? INPUT_AFFIX_COLOR.disabled : INPUT_AFFIX_COLOR.enabled;
  const iconColor = isDisabled ? INPUT_ICON_COLOR.disabled : INPUT_ICON_COLOR.enabled;
  const valueColor = isDisabled
    ? INPUT_VALUE_COLOR.disabled
    : variant === "underline" && isReadOnly
      ? INPUT_VALUE_COLOR.underlineReadOnly
      : INPUT_VALUE_COLOR.enabled;

  let rootClass = textInputVariants({ variant, size });
  if (focused) rootClass = `${rootClass} ${forceFocus(rootClass, ":has(input:focus)")}`;
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
    `class="${INPUT_VALUE_BASE} ${valueColor}"`,
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
      ? `<span data-slot="text-input-prefix-icon" aria-hidden="true" class="${INPUT_AFFIX_ICON} ${INPUT_AFFIX_EDGE} ${iconColor}">${prefixIcon}</span>`
      : "",
    prefix != null
      ? `<span id="${prefixId}" data-slot="text-input-prefix" class="${INPUT_AFFIX_TEXT} ${INPUT_AFFIX_EDGE} ${affixColor}">${esc(prefix)}</span>`
      : "",
    `<input ${input}>`,
    suffix != null
      ? `<span id="${suffixId}" data-slot="text-input-suffix" class="${INPUT_AFFIX_TEXT} ${INPUT_AFFIX_EDGE} ${affixColor}">${esc(suffix)}</span>`
      : "",
    suffixIcon != null
      ? `<span data-slot="text-input-suffix-icon" aria-hidden="true" class="${INPUT_AFFIX_ICON} ${INPUT_AFFIX_EDGE} ${iconColor}">${suffixIcon}</span>`
      : "",
    showClear
      ? `<button type="button" aria-label="지우기" tabindex="-1" data-slot="text-input-clear" class="${INPUT_CLEAR} ${INPUT_AFFIX_EDGE}">${CIRCLE_X}</button>`
      : "",
  ];
  return `<div ${root}>${parts.join("")}</div>`;
}

// <Textarea> — textarea.tsx 그대로(textarea-examples.mjs 의 textarea 와 같다). className 은 입력에 간다(max-h-* · h-*).
// 자동 높이는 레시피의 스크립트(fit) 대신 CSS field-sizing: content 로 자란다(style — 레시피에는 없다)
function textarea({
  size = "responsive",
  autoSize = true,
  rows,
  placeholder,
  value,
  className = "",
  ariaLabel,
  invalid,
  disabled,
  readOnly,
  focused = false,
  scrolls = false,
  f,
} = {}) {
  const val = value ?? f?.value ?? "";
  const control = fieldControl({ disabled, readOnly, "aria-invalid": invalid }, f);
  const isDisabled = !!control.disabled;
  const isReadOnly = !!control.readOnly;
  const isInvalid = control["aria-invalid"] === true || control["aria-invalid"] === "true";

  let rootClass = textareaVariants({ size });
  if (focused) rootClass = `${rootClass} ${forceFocus(rootClass, ":has(textarea:focus)")}`;
  const root = attrs([
    'data-slot="textarea"',
    `data-size="${size}"`,
    isInvalid && 'data-invalid="true"',
    isDisabled && 'data-disabled="true"',
    isReadOnly && 'data-readonly="true"',
    `class="${rootClass}"`,
  ]);

  const valueClass = [textareaValueVariants({ size, autoSize }), isDisabled ? TEXTAREA_VALUE_COLOR.disabled : TEXTAREA_VALUE_COLOR.enabled, className]
    .filter(Boolean)
    .join(" ");
  const style = autoSize ? `field-sizing:content;${scrolls ? " overflow-y:auto;" : ""}` : "";
  const area = attrs([
    `rows="${rows ?? (autoSize ? 3 : 2)}"`,
    'data-slot="textarea-value"',
    `class="${valueClass}"`,
    placeholder && `placeholder="${esc(placeholder)}"`,
    ariaLabel && `aria-label="${esc(ariaLabel)}"`,
    control.id && `id="${control.id}"`,
    isDisabled && "disabled",
    isReadOnly && "readonly",
    isInvalid && 'aria-invalid="true"',
    control["aria-required"] && 'aria-required="true"',
    control["aria-describedby"] && `aria-describedby="${control["aria-describedby"]}"`,
    style && `style="${style}"`,
  ]);
  return `<div ${root}><textarea ${area}>${esc(val)}</textarea></div>`;
}

// <Button> — button.tsx 그대로. cn(buttonVariants({ …, className })) 이라 className 을 cva 뒤에 붙여 합친다
function button({ variant, size, ghostColor, flush, className = "", type, children }) {
  const cls = merge(`${buttonVariants({ variant, size, layout: "withText", ghostColor, flush })} ${className}`);
  return `<button ${attrs([`class="${cls}"`, type && `type="${type}"`])}>${children}</button>`;
}

// <Radiomark> — Radix RadioGroup.Item · Indicator(forceMount)가 그리는 모양. 상자 안이라 레시피는 cn(MARK_IN_BOX) 를 덧붙이고
// 표식(data-select-box-control · data-select-box-action)을 단다
function radiomark({ id, value, checked }) {
  const state = `data-state="${checked ? "checked" : "unchecked"}"`;
  const root = attrs([
    'type="button"',
    'role="radio"',
    `aria-checked="${checked}"`,
    state,
    `value="${value}"`,
    `class="${merge(`${radiomarkVariants({ size: "medium", tone: "neutral" })} ${merge(SB_MARK_IN_BOX)}`)}"`,
    `id="${id}"`,
    'data-select-box-control=""',
    'data-select-box-action=""',
  ]);
  return `<button ${root}><span ${state} class="${radiomarkDotVariants({ size: "medium", tone: "neutral" })}"></span></button>`;
}

// <RadioSelectBoxGroup> + <RadioSelectBox> — 1열 가로형 · 라디오. Field 안이면 묶음이 라벨을 aria-labelledby, 설명 · 오류를
// aria-describedby 로 받는다(useFieldGroup). 상자 = div(테두리 · 바탕) > label(누르는 자리: 본문 + 라디오)
function radioSelectBoxGroup(items, { value, f } = {}) {
  const boxes = items.map(({ id, value: own, label, description }) => {
    const trigger = attrs([`for="${id}"`, 'data-select-box-action=""', `class="${selectBoxTriggerVariants({ layout: "horizontal" })}"`]);
    const text = description ? `<span class="${merge(selectBoxDescriptionVariants({ disabled: false }))}">${esc(description)}</span>` : "";
    const body = `<span class="${selectBoxBodyVariants()}"><span class="${merge(selectBoxLabelVariants({ disabled: false }))}">${esc(label)}</span>${text}</span>`;
    const content = `<span class="${selectBoxContentVariants({ layout: "horizontal" })}">${body}</span>`;
    return `<div class="${merge(selectBoxVariants())}"><label ${trigger}>${content}${radiomark({ id, value: own, checked: own === value })}</label></div>`;
  });
  const root = attrs([
    'role="radiogroup"',
    `class="${merge(selectBoxGroupVariants({ columns: 1 }))}"`,
    f && `aria-labelledby="${f.labelId}"`,
    f?.describedBy && `aria-describedby="${f.describedBy}"`,
  ]);
  return `<div ${root}>${boxes.join("")}</div>`;
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
// 속성 이름처럼 코드로 쓰는 이름표
const CODE = `${CAPTION} font-family:ui-monospace, SFMono-Regular, Menlo, monospace;`;
// 아래 이름표 · 위 이름표
const labeled = (html, caption, style = CAPTION) =>
  `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2); min-width:0;">${html}<span style="${style}">${caption}</span></div>`;
const titled = (caption, html, style = CAPTION) =>
  `<div style="display:flex; flex-direction:column; gap:var(--spacing-x4); min-width:0;"><span style="${style}">${caption}</span>${html}</div>`;

// 반복 거래의 종료 — select-box-examples.mjs 의 선택지와 같다
const END = [
  { value: "none", label: "무기한", description: "중지할 때까지 계속 반복" },
  { value: "count", label: "횟수 지정", description: "정한 횟수만큼 반복" },
];

// ── 예제 ──────────────────────────────────────────────────────────────────

export const fieldExamples = [
  {
    title: "라벨 · 설명 · 글자 수",
    description:
      "Field 는 칸 하나를 감싸는 둘레다 — 머리(라벨) · 칸 · 꼬리(설명 · 글자 수)를 8 간격으로 쌓는다. 라벨은 16 · 500 fg-neutral 의 <label for> 라 누르면 칸으로 간다. 설명은 14 · fg-neutral-subtle 이고, 글자 수는 maxGraphemeCount 를 준 칸에만 꼬리 오른쪽에 \"쓴 수/최대\"(숫자 폭 고정)로 선다. 설명 · 글자 수는 칸의 aria-describedby 로 이어진다. 머리 · 꼬리는 좌우로 2 들어와 칸의 둥근 모서리와 글자 줄이 맞는다. 라벨 · 설명은 칸 크기(large · medium)와 관계없이 같다.",
    jsx: `import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

<Field label="카테고리 이름" description="목록과 통계에 이 이름으로 보여요." maxGraphemeCount={12}>
  <Input placeholder="예: 반려동물, 부수입" defaultValue="반려동물" />
</Field>`,
    render: () =>
      surface(
        narrow(
          field({
            id: "field-ex-basic",
            label: "카테고리 이름",
            description: "목록과 통계에 이 이름으로 보여요.",
            maxGraphemeCount: 12,
            value: "반려동물",
            control: (f) => textInput({ f, placeholder: "예: 반려동물, 부수입" }),
          }),
        ),
      ),
  },

  {
    title: "필수 · 선택 — 2/3 규칙",
    description:
      "한 화면 칸의 2/3 이상이 필수면 선택 칸에만 \"선택\"(indicator)을 붙이고, 그보다 적으면 필수 칸에만 빨간 점(showRequiredIndicator, 6 · fg-critical)을 붙인다 — 한 폼 안에서 둘을 섞지 않는다. 칸이 하나뿐이면 아무것도 붙이지 않는다. 필수는 required 로 칸의 aria-required 를 켠다(점을 켜면 함께 켜진다). 점은 화면 읽기 프로그램에 숨기고, required 속성은 쓰지 않는다 — 브라우저 기본 말풍선이 오류 글 대신 뜨지 않게.",
    jsx: `// 셋 중 하나가 필수(2/3 미만) — 필수 칸에만 점
<Field label="이름" showRequiredIndicator>
  <Input />
</Field>
<Field label="휴대폰 번호">
  <Input inputMode="tel" />
</Field>
<Field label="이메일">
  <Input type="email" />
</Field>

// 셋 중 둘이 필수(2/3 이상) — 선택 칸에만 "선택"(필수 칸은 required 로 aria-required 만)
<Field label="이름" required>
  <Input />
</Field>
<Field label="이메일" required>
  <Input type="email" />
</Field>
<Field label="휴대폰 번호" indicator="선택">
  <Input inputMode="tel" />
</Field>`,
    render: () =>
      surface(
        grid([
          titled(
            "셋 중 하나가 필수 — 필수 칸에만 점",
            stack([
              field({ id: "field-ex-dot-name", label: "이름", showRequiredIndicator: true, control: (f) => textInput({ f }) }),
              field({ id: "field-ex-dot-phone", label: "휴대폰 번호", control: (f) => textInput({ f, inputMode: "tel" }) }),
              field({ id: "field-ex-dot-email", label: "이메일", control: (f) => textInput({ f, type: "email" }) }),
            ]),
          ),
          titled(
            "셋 중 둘이 필수 — 선택 칸에만 \"선택\"",
            stack([
              field({ id: "field-ex-optional-name", label: "이름", required: true, control: (f) => textInput({ f }) }),
              field({ id: "field-ex-optional-email", label: "이메일", required: true, control: (f) => textInput({ f, type: "email" }) }),
              field({
                id: "field-ex-optional-phone",
                label: "휴대폰 번호",
                indicator: "선택",
                control: (f) => textInput({ f, inputMode: "tel" }),
              }),
            ]),
          ),
        ]),
      ),
  },

  {
    title: "라벨 굵기 — medium · bold",
    description:
      "라벨은 500(medium)이 기본이다. 칸 이름이 그 구역의 제목 노릇을 할 때 — 칸 하나를 크게 받는 단계 화면 — 700(bold)으로 올린다. 한 폼 안에서 섞지 않는다. 단계 화면의 칸은 화면에 입력이 하나뿐이라 밑줄형(underline)이다.",
    jsx: `<Field label="카테고리 이름">
  <Input placeholder="예: 반려동물, 부수입" />
</Field>

// 칸 하나를 크게 받는 단계 화면 — 라벨이 그 화면의 제목이다
<Field label="얼마를 썼나요?" labelWeight="bold">
  <Input variant="underline" size="large" inputMode="numeric" value={formatted} onChange={onAmountChange} suffix="원" />
</Field>`,
    render: () =>
      surface(
        grid([
          labeled(
            field({
              id: "field-ex-weight-medium",
              label: "카테고리 이름",
              control: (f) => textInput({ f, placeholder: "예: 반려동물, 부수입" }),
            }),
            "medium 500 — 기본",
            CODE,
          ),
          labeled(
            field({
              id: "field-ex-weight-bold",
              label: "얼마를 썼나요?",
              labelWeight: "bold",
              value: "12,000",
              control: (f) => textInput({ f, variant: "underline", size: "large", inputMode: "numeric", suffix: "원" }),
            }),
            "bold 700 — 단계 화면",
            CODE,
          ),
        ]),
      ),
  },

  {
    title: "보조 액션",
    description:
      "머리 오른쪽에는 칸을 채우는 데 돕는 작은 텍스트 버튼 하나를 둘 수 있다(예시 보기 · 전체 선택) — Button ghost · neutralSubtle · xsmall · flush=\"right\". 버튼(32)은 머리 높이(22)를 바꾸지 않게 위아래로 5 씩 넘치고, 오른쪽 여백이 없어 글자 끝이 칸의 오른쪽 끝에 맞는다. 바탕 없이 글자색으로만 반응하고, 누르는 영역은 버튼 그대로 44 까지 넓다. 폼 안에서는 type=\"button\" 을 준다 — 눌러도 제출되지 않게.",
    jsx: `import { Button } from "@/components/ui/button"

<Field
  label="카테고리 이름"
  headerAction={
    <Button type="button" variant="ghost" ghostColor="neutralSubtle" size="xsmall" flush="right" onClick={openExamples}>
      예시 보기
    </Button>
  }
>
  <Input placeholder="예: 반려동물, 부수입" />
</Field>`,
    render: () =>
      surface(
        narrow(
          field({
            id: "field-ex-action",
            label: "카테고리 이름",
            headerAction: button({ variant: "ghost", ghostColor: "neutralSubtle", size: "xsmall", flush: "right", type: "button", children: "예시 보기" }),
            control: (f) => textInput({ f, placeholder: "예: 반려동물, 부수입" }),
          }),
        ),
      ),
  },

  {
    title: "오류 — 설명 자리를 대신한다",
    description:
      "invalid 와 errorMessage 를 주면 오류 글(14 · fg-critical)이 설명 자리를 대신한다 — 둘을 함께 보이지 않는다. 오류 글 앞에는 늘 circle-alert(16)가 붙어 색만으로 알리지 않고, 글자 수도 둘 다 fg-critical 이 된다. 칸의 테두리는 칸이 바꾼다(안쪽 2px stroke-critical-solid — 포커스해도 그대로). 라벨과 입력한 글자는 그대로다. 오류 글은 칸의 aria-describedby 로 이어지고, 바뀔 때 화면 밖 polite 알림 자리가 한 번 읽는다. 글은 무엇을 하면 되는지 짧게 쓴다 — \"잘못된 입력입니다\" 처럼 이유만 말하지 않는다.",
    jsx: `// 오류가 없을 때 — 설명
<Field label="아이디" description="영문 · 숫자 20자까지" maxGraphemeCount={20}>
  <Input defaultValue="groo" />
</Field>

// 오류 — 오류 글이 설명 자리를 대신한다
<Field label="아이디" description="영문 · 숫자 20자까지" maxGraphemeCount={20} invalid errorMessage="이미 쓰고 있는 아이디예요.">
  <Input defaultValue="groo" />
</Field>`,
    render: () =>
      surface(
        grid([
          labeled(
            field({
              id: "field-ex-error-before",
              label: "아이디",
              description: "영문 · 숫자 20자까지",
              maxGraphemeCount: 20,
              value: "groo",
              control: (f) => textInput({ f }),
            }),
            "오류가 없을 때 — 설명",
          ),
          labeled(
            field({
              id: "field-ex-error-after",
              label: "아이디",
              description: "영문 · 숫자 20자까지",
              maxGraphemeCount: 20,
              invalid: true,
              errorMessage: "이미 쓰고 있는 아이디예요.",
              value: "groo",
              control: (f) => textInput({ f }),
            }),
            "오류 — 설명 자리를 대신한다",
          ),
        ]),
      ),
  },

  {
    title: "글자 수",
    description:
      "최대 길이가 있는 칸에만 maxGraphemeCount 를 준다. 쓴 수는 비었을 때 최대와 같은 fg-neutral-subtle, 쓰기 시작하면 fg-neutral 이고, 오류면 쓴 수와 최대가 둘 다 fg-critical 이다. 자소 단위로 세므로 국기 이모지도 한 글자이고, 칸은 최대에서 더 받지 않는다 — 한글을 조합하는 동안에는 자르지 않고 조합이 끝나면 자른다. 정적 미리보기에는 세는 스크립트가 없어 칸에 써도 숫자가 그대로다.",
    jsx: `<Field label="카테고리 이름" maxGraphemeCount={12}>
  <Input placeholder="예: 반려동물, 부수입" />
</Field>

// 오류면 쓴 수 · 최대가 둘 다 fg-critical
<Field label="카테고리 이름" maxGraphemeCount={12} invalid errorMessage="카테고리 이름을 입력해주세요.">
  <Input placeholder="예: 반려동물, 부수입" />
</Field>`,
    render: () =>
      surface(
        grid(
          [
            labeled(
              field({
                id: "field-ex-count-empty",
                label: "카테고리 이름",
                maxGraphemeCount: 12,
                control: (f) => textInput({ f, placeholder: "예: 반려동물, 부수입" }),
              }),
              "비었을 때",
            ),
            labeled(
              field({
                id: "field-ex-count-filled",
                label: "카테고리 이름",
                maxGraphemeCount: 12,
                value: "반려동물",
                control: (f) => textInput({ f, placeholder: "예: 반려동물, 부수입" }),
              }),
              "썼을 때",
            ),
            labeled(
              field({
                id: "field-ex-count-invalid",
                label: "카테고리 이름",
                maxGraphemeCount: 12,
                invalid: true,
                errorMessage: "카테고리 이름을 입력해주세요.",
                control: (f) => textInput({ f, placeholder: "예: 반려동물, 부수입" }),
              }),
              "오류",
            ),
          ],
          180,
        ),
      ),
  },

  {
    title: "묶음 — Select Box",
    description:
      "Field 는 묶음(Checkbox · Radio · Select Box)도 감싼다. 묶음 안에서는 라벨이 <label> 대신 <span> 이 되고, 묶음(radiogroup · fieldset)이 aria-labelledby 로 그 라벨을 이름으로, aria-describedby 로 설명 · 오류를 받는다 — 묶음에 aria-label 을 따로 달지 않는다. 오류는 상자를 바꾸지 않고 묶음 아래 꼬리에 글로 알린다. 미리보기는 아무것도 고르지 않고 저장을 누른 모습이다.",
    jsx: `import { RadioSelectBox, RadioSelectBoxGroup } from "@/components/ui/select-box"

<Field label="종료" invalid errorMessage="종료를 골라주세요.">
  <RadioSelectBoxGroup value={end} onValueChange={setEnd}>
    <RadioSelectBox value="none" label="무기한" description="중지할 때까지 계속 반복" />
    <RadioSelectBox value="count" label="횟수 지정" description="정한 횟수만큼 반복" />
  </RadioSelectBoxGroup>
</Field>`,
    render: () =>
      surface(
        narrow(
          field({
            id: "field-ex-group",
            label: "종료",
            invalid: true,
            errorMessage: "종료를 골라주세요.",
            group: true,
            control: (f) => radioSelectBoxGroup(END.map((it) => ({ ...it, id: `field-ex-group-${it.value}` })), { f }),
          }),
        ),
      ),
  },

  {
    title: "react-hook-form",
    description:
      "Form(FormProvider) 안의 FormField 는 Controller 와 Field 를 한 번에 그린다 — 라벨 · 설명 · 필수 · 글자 수는 Field 의 속성 그대로 주고, render 는 칸 하나를 돌려준다(field 를 펼쳐 준다). 칸의 오류(fieldState.error)는 Field 의 invalid · errorMessage 로 넘어간다. 검증은 제출 때 칸마다 한다(useForm 기본 mode \"onSubmit\") — 신청 버튼은 켜 두고, 누르면 비거나 틀린 칸마다 오류를 보이고 첫 오류 칸으로 포커스를 옮긴다(shouldFocusError 기본). 잘못 넣으면 위험한 칸(보안 · 금융)만 칸을 떠날 때 바로 검증한다. 미리보기는 빈 채로 신청을 누른 뒤의 모습이다 — 첫 오류 칸(제목)에 포커스가 있지만 오류 테두리는 포커스해도 그대로다. 정적 페이지라 <form> 대신 <div> 로 그려 눌러도 제출되지 않는다.",
    jsx: `import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const form = useForm({ defaultValues: { title: "", reason: "" } })

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-x6">
    {/* 둘 다 필수 — required 로 aria-required 만(2/3 이상이 필수라 점을 붙이지 않는다) */}
    <FormField
      control={form.control}
      name="title"
      label="제목"
      required
      rules={{ required: "제목을 입력해주세요." }}
      render={({ field }) => <Input placeholder="예: 개인 사유" {...field} />}
    />
    <FormField
      control={form.control}
      name="reason"
      label="휴가 사유"
      required
      maxGraphemeCount={1000}
      rules={{ required: "휴가 사유를 입력해주세요." }}
      render={({ field }) => <Textarea placeholder="예: 가족 행사 참석" {...field} />}
    />
    {/* 신청 버튼은 끄지 않는다 — 누르면 칸마다 오류를 보이고 첫 오류 칸으로 포커스가 간다 */}
    <Button type="submit" variant="brandSolid" className="w-full">
      신청
    </Button>
  </form>
</Form>`,
    render: () =>
      surface(
        narrow(
          `<div class="flex flex-col gap-x6">${[
            field({
              id: "field-ex-form-title",
              label: "제목",
              required: true,
              invalid: true,
              errorMessage: "제목을 입력해주세요.",
              control: (f) => textInput({ f, placeholder: "예: 개인 사유", focused: true }),
            }),
            field({
              id: "field-ex-form-reason",
              label: "휴가 사유",
              required: true,
              maxGraphemeCount: 1000,
              invalid: true,
              errorMessage: "휴가 사유를 입력해주세요.",
              control: (f) => textarea({ f, placeholder: "예: 가족 행사 참석" }),
            }),
            button({ variant: "brandSolid", size: "medium", className: "w-full", type: "submit", children: "신청" }),
          ].join("")}</div>`,
        ),
      ),
  },
];
