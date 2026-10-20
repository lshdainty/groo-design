/*
 * shadcn Select Box 예제 — docs site components/select-box.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 여섯은 차례 · 제목 · 코드가 specs/components/select-box.md 의 "코드" 절과 같고,
 * 뒤의 둘(2열 · 앞 · 펼침 보이기)은 md 에 없는 쓰임을 더 보인다. 여섯째(여럿 고르고 저장 — HR 역할, 2026-10-15 마무리 10A)의 칸 둘레 FIELD_* 는
 * field.tsx 의 클래스, "저장" 의 BUTTON_* 는 button.tsx 의 값(neutralSolid · medium)이다.
 *
 * GROUP_* · CHECK_GROUP · BOX_BASE · TRIGGER_* · CONTENT_* · PREFIX_* · BODY_BASE · LABEL_* · DESCRIPTION_* · FOOTER_BASE · FOOTER_OPEN ·
 * FOOTER_CLIP · FOOTER_INNER · MARK_IN_BOX · GHOST_NO_BG · HIDDEN_CONTROL 은 recipes/shadcn/components/ui/select-box.tsx 의 cva 정의 · 상수 ·
 * 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 상자에 끼우는 컨트롤의 RADIOMARK_* · DOT_* · CHECKMARK_* · INDICATOR* ·
 * CHECK_ICON · MINUS_ICON 은 radio-group.tsx · checkbox.tsx 의 것(그 예제 파일의 것)과, 펼침 안 입력칸의 INPUT_ROOT · INPUT_VALUE 는
 * input.tsx 의 것(기본값 outline · responsive — input-examples.mjs 의 것)과 같다.
 * 규칙은 specs/components/select-box.md, 수치 원본은 specs/components/select-box.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 묶음(RadioSelectBoxGroup 의 role="radiogroup" · CheckSelectBoxGroup 의 <fieldset>) > 상자 <div> >
 * 누르는 자리 <label for data-select-box-action> > 콘텐츠(앞 · 본문) + 컨트롤, 상자 끝에 펼침 <div data-select-box-footer>.
 * 컨트롤에는 data-select-box-control · data-select-box-action 이 붙고, 막히면 누르는 자리 · 컨트롤에 data-disabled 가 붙는다.
 * 상자의 바탕 · 고른 테두리 · 포커스 링 · 펼침은 이 표식과 컨트롤의 data-state 를 :has() 로 읽는다.
 * 레시피가 cn() 으로 합치는 자리는 merge() 로 똑같이 합친다 — 같은 속성을 다시 쓴 클래스는 뒤의 것만 남는다.
 * 라디오 · 체크는 Radix 가 그리는 모양 그대로 <button role data-state> 다 — 바꾸는 동작은 React 에서 Radix 가 맡는다.
 * Radix 가 실행 중에 붙이는 것(라디오의 tabindex · data-radix-collection-item, 묶음의 tabindex · dir · aria-required · style 의
 * outline:none, 체크의 기본 value="on")과 lucide 의 class · xmlns 는 그리지 않는다 — 아이콘은 lucide-react 와 같은 모양의 inline SVG 다.
 * 누르는 자리(label)는 누르는 순간(포인터 · 키) 레시피의 스크립트(pressHandlers)가 자기를 재서 --press-basis 를 달고, 마우스 · 펜이면
 * 누른 요소에 포인터를 잡아 둔다. 정적 HTML 에는 그 스크립트가 없어 미리보기를 눌러도 바탕만 바뀌고 누르는 자리는 줄지 않는다.
 */

// ── select-box.tsx 의 cva 와 같은 값 ───────────────────────────────────────

// 묶음(selectBoxGroupVariants) — 1 ~ 3열 격자. 2열 이상은 상자 높이를 가장 긴 상자에 맞춘다
const GROUP_BASE = "grid w-full gap-x-x3 gap-y-component-default";

// 열 수는 숫자다(1 · 2 · 3) — 레시피처럼 숫자 꼴 키로 둔다
const GROUP_VARIANTS = {
  columns: {
    1: "grid-cols-1",
    2: "auto-rows-fr grid-cols-2",
    3: "auto-rows-fr grid-cols-3",
  },
};

const GROUP_DEFAULTS = { columns: 1 };

// 여럿 고르기 묶음(CheckSelectBoxGroup) — fieldset 의 기본 바깥 · 안쪽 여백 · 테두리 · 최소 폭을 걷는다(묶음 클래스 뒤에 붙인다)
const CHECK_GROUP = "m-0 min-w-0 border-0 p-0";

// 상자(selectBoxVariants) — 테두리 1px(안쪽) · 모서리 12. 고른 테두리 2px 는 ::after. 상태는 안쪽의 누르는 자리 · 컨트롤에서 읽는다
const BOX_BASE = [
  "group/select-box relative flex h-full flex-col rounded-r3 bg-transparent shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)]",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-2 after:border-solid after:border-transparent after:content-[''] after:[transition:border-color_var(--motion-duration-d2)_var(--motion-ease-easing)]",
  "has-[[data-select-box-control][data-state=checked]:not([data-disabled])]:after:border-stroke-neutral-contrast",
  "has-[[data-select-box-control][data-state=checked][data-disabled]]:after:border-stroke-neutral-weak",
  "[@media(hover:hover)]:has-[[data-select-box-action]:not([data-disabled]):hover]:bg-bg-layer-default-pressed has-[[data-select-box-action]:not([data-disabled]):active]:bg-bg-layer-default-pressed",
  "has-[[data-select-box-control]:focus-visible]:outline-2 has-[[data-select-box-control]:focus-visible]:outline-offset-2 has-[[data-select-box-control]:focus-visible]:outline-stroke-focus-ring",
].join(" ");

// 누르는 자리(selectBoxTriggerVariants) — 콘텐츠 + 컨트롤. 누르면 이 자리만 주고, 상자가 늘면 남는 자리까지 채운다(grow)
const TRIGGER_BASE = [
  "relative flex w-full grow cursor-pointer select-none justify-between gap-x1_5",
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "group-has-[[data-select-box-action]:not([data-disabled]):active]/select-box:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-has-[[data-select-box-action]:not([data-disabled]):active]/select-box:[scale:1]",
  "data-[disabled]:cursor-not-allowed",
].join(" ");

const TRIGGER_VARIANTS = {
  layout: {
    horizontal: "items-center py-x4 pl-x5 pr-x4",
    vertical: "items-start px-x4 py-x5",
  },
};

const TRIGGER_DEFAULTS = { layout: "horizontal" };

// 콘텐츠(selectBoxContentVariants) — 앞 · 본문. 가로형은 한 줄, 세로형은 앞이 위
const CONTENT_BASE = "flex min-w-0 flex-1";

const CONTENT_VARIANTS = {
  layout: {
    horizontal: "flex-row items-center gap-x3",
    vertical: "flex-col gap-x2_5",
  },
};

const CONTENT_DEFAULTS = { layout: "horizontal" };

// 앞(selectBoxPrefixVariants) — 아이콘 22. 막히면 비활성 색
const PREFIX_BASE = "flex shrink-0 text-fg-neutral [&>svg]:size-[22px]";
const PREFIX_VARIANTS = { disabled: { true: "text-fg-disabled", false: "" } };
const PREFIX_DEFAULTS = { disabled: false };

// 본문(selectBoxBodyVariants) — 제목 + 설명
const BODY_BASE = "mr-auto flex min-w-0 flex-col items-start gap-x0_5 pr-x1 text-left";

// 제목(selectBoxLabelVariants) — 16 · 500
const LABEL_BASE = "flex items-center gap-x1 font-sans text-t5 font-medium text-fg-neutral";
const LABEL_VARIANTS = { disabled: { true: "text-fg-disabled", false: "" } };
const LABEL_DEFAULTS = { disabled: false };

// 설명(selectBoxDescriptionVariants) — 13 · fg-neutral-muted
const DESCRIPTION_BASE = "font-sans text-t3 text-fg-neutral-muted";
const DESCRIPTION_VARIANTS = { disabled: { true: "text-fg-disabled", false: "" } };
const DESCRIPTION_DEFAULTS = { disabled: false };

// 펼침 — 고른 상자 아래로 열린다. 높이는 grid-template-rows 0fr → 1fr, 닫히면 보이지 않는다(visibility — Tab 도 안 닿는다).
// 레시피의 footerClasses 는 FOOTER_BASE 와 FOOTER_OPEN[보일 때] 를 cn() 없이 잇는다
const FOOTER_BASE = [
  "grid invisible opacity-0 [grid-template-rows:0fr]",
  "[transition:grid-template-rows_var(--motion-duration-d6)_var(--motion-ease-easing),opacity_400ms_var(--motion-ease-easing),visibility_0s_linear_400ms]",
  "motion-reduce:[transition:opacity_150ms_linear,visibility_0s_linear_150ms]",
].join(" ");

const FOOTER_OPEN = {
  "when-selected": [
    "group-has-[[data-select-box-control][data-state=checked]]/select-box:visible group-has-[[data-select-box-control][data-state=checked]]/select-box:opacity-100 group-has-[[data-select-box-control][data-state=checked]]/select-box:[grid-template-rows:1fr]",
    "group-has-[[data-select-box-control][data-state=checked]]/select-box:[transition:grid-template-rows_400ms_var(--motion-ease-easing),opacity_var(--motion-duration-d6)_var(--motion-ease-easing),visibility_0s]",
    "motion-reduce:group-has-[[data-select-box-control][data-state=checked]]/select-box:[transition:opacity_150ms_linear,visibility_0s]",
  ].join(" "),
  "when-not-selected": [
    "group-has-[[data-select-box-control][data-state=unchecked]]/select-box:visible group-has-[[data-select-box-control][data-state=unchecked]]/select-box:opacity-100 group-has-[[data-select-box-control][data-state=unchecked]]/select-box:[grid-template-rows:1fr]",
    "group-has-[[data-select-box-control][data-state=unchecked]]/select-box:[transition:grid-template-rows_400ms_var(--motion-ease-easing),opacity_var(--motion-duration-d6)_var(--motion-ease-easing),visibility_0s]",
    "motion-reduce:group-has-[[data-select-box-control][data-state=unchecked]]/select-box:[transition:opacity_150ms_linear,visibility_0s]",
  ].join(" "),
};

// 펼침 안 — 접히는 칸(overflow 를 자른다) · 안쪽 여백(selectBoxFooterInnerVariants, 좌우 20 · 아래 16). "늘" 이면 안쪽 여백만 그린다
const FOOTER_CLIP = "min-h-0 overflow-hidden";
const FOOTER_INNER = "px-x5 pb-x4";

// 컨트롤은 따로 줄지 않고 자기 포커스 링도 끈다 — 누르는 자리가 함께 주고, 링은 상자가 그린다(SEED).
// 체크(Ghost)는 상자가 누름 · 호버를 맡으므로 자기 바탕을 끈다
const MARK_IN_BOX = "active:[scale:1] focus-visible:outline-none";
const GHOST_NO_BG =
  "hover:bg-transparent active:bg-transparent data-[state=checked]:hover:bg-transparent data-[state=checked]:active:bg-transparent";

// 컨트롤 '없음' — 라디오 · 체크는 화면 밖에 둔다(키보드 · 화면 읽기 프로그램이 그대로 쓴다)
const HIDDEN_CONTROL = "sr-only";

// ── radio-group.tsx · checkbox.tsx 의 cva 와 같은 값 ──────────────────────

// Radiomark — 동그라미(radiomarkVariants)
const RADIOMARK_BASE = [
  "peer relative inline-grid shrink-0 cursor-pointer place-items-center rounded-full",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "active:[scale:calc(1-2/var(--press-basis))] group-active/radio:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1] motion-reduce:group-active/radio:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed disabled:[scale:1]",
  // 선택 안 됨 — 테두리 원. 호버 · 누름은 누름 바탕
  "border border-stroke-neutral-solid bg-transparent hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed group-hover/radio:bg-bg-layer-default-pressed group-active/radio:bg-bg-layer-default-pressed",
  "disabled:border-stroke-neutral-weak disabled:bg-bg-disabled",
  // 선택 — 테두리 없이 채운 원(톤에서). 비활성은 채움 그대로 색만
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

const RADIOMARK_DEFAULTS = {
  size: "medium",
  tone: "neutral",
};

// 가운데 점(radiomarkDotVariants)
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

const DOT_DEFAULTS = {
  size: "medium",
  tone: "neutral",
};

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

// ── input.tsx 의 클래스 — 펼침 안의 입력칸(<Input>, 기본값 outline · responsive) ──

// 상자(textInputVariants) — 공통 + outline + outline × responsive 조합. 테두리는 안쪽 1px, 포커스 · 오류의 2px 는 ::after
const INPUT_ROOT = [
  "relative flex w-full min-w-0 items-center overflow-hidden bg-transparent font-sans",
  "cursor-text data-[disabled]:cursor-not-allowed",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-solid after:border-transparent after:content-['']",
  "after:[transition:border-color_var(--motion-duration-d2)_var(--motion-ease-easing)]",
  "[&:has(input:focus):not([data-invalid]):not([data-readonly])]:after:border-stroke-neutral-contrast",
  "data-[invalid]:after:border-stroke-critical-solid",
  // outline
  "shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] after:border-2 data-[disabled]:bg-bg-disabled data-[readonly]:bg-bg-disabled",
  // outline × responsive — 1280 미만 large(52) · 이상 medium(40)
  "min-h-13 gap-x2_5 rounded-r3 text-t5 [--text-input-px:var(--spacing-x4)] [--text-input-icon:20px] [--text-input-clear:22px]",
  "lg:min-h-10 lg:gap-x2 lg:rounded-r2 lg:text-t4 lg:[--text-input-px:var(--spacing-x3_5)] lg:[--text-input-icon:16px] lg:[--text-input-clear:18px]",
].join(" ");

// 입력(<input>) — 상자 높이를 채우고, 맨 앞 · 맨 뒤면 상자의 좌우 여백까지 차지한다. 끝은 값 · placeholder 색(막히지 않은 칸)
const INPUT_VALUE = [
  "min-w-0 flex-1 self-stretch border-0 bg-transparent p-0 outline-none [font:inherit]",
  "first:pl-[var(--text-input-px)] last:pr-[var(--text-input-px)] disabled:cursor-not-allowed",
  "[&:-webkit-autofill]:bg-clip-text [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-fg-neutral)] [&:-webkit-autofill]:[transition:background-color_9999s_9999s]",
  "text-fg-neutral placeholder:text-fg-placeholder",
].join(" ");

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다.
// 참 · 거짓 축(disabled)은 cva 처럼 "true" · "false" 글자 키로 찾고, compound 는 값 그대로 견준다.
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

const selectBoxGroupVariants = cvaOf(GROUP_BASE, { variants: GROUP_VARIANTS, defaultVariants: GROUP_DEFAULTS });
const selectBoxVariants = cvaOf(BOX_BASE);
const selectBoxTriggerVariants = cvaOf(TRIGGER_BASE, { variants: TRIGGER_VARIANTS, defaultVariants: TRIGGER_DEFAULTS });
const selectBoxContentVariants = cvaOf(CONTENT_BASE, { variants: CONTENT_VARIANTS, defaultVariants: CONTENT_DEFAULTS });
const selectBoxPrefixVariants = cvaOf(PREFIX_BASE, { variants: PREFIX_VARIANTS, defaultVariants: PREFIX_DEFAULTS });
const selectBoxBodyVariants = cvaOf(BODY_BASE);
const selectBoxLabelVariants = cvaOf(LABEL_BASE, { variants: LABEL_VARIANTS, defaultVariants: LABEL_DEFAULTS });
const selectBoxDescriptionVariants = cvaOf(DESCRIPTION_BASE, {
  variants: DESCRIPTION_VARIANTS,
  defaultVariants: DESCRIPTION_DEFAULTS,
});
const selectBoxFooterInnerVariants = cvaOf(FOOTER_INNER);
const radiomarkVariants = cvaOf(RADIOMARK_BASE, { variants: RADIOMARK_VARIANTS, defaultVariants: RADIOMARK_DEFAULTS });
const radiomarkDotVariants = cvaOf(DOT_BASE, { variants: DOT_VARIANTS, defaultVariants: DOT_DEFAULTS });
const checkmarkVariants = cvaOf(CHECKMARK_BASE, {
  variants: CHECKMARK_VARIANTS,
  compoundVariants: CHECKMARK_COMPOUND,
  defaultVariants: CHECKMARK_DEFAULTS,
});

// "has-[[data-select-box-control]:focus-visible]:outline-2" → ["has-[…]", "outline-2"] — 괄호 안의 ":" 는 가르지 않는다.
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
// 배경 · 글자색 · 글자 크기 · 임의 속성([prop:…]). text-t* 는 글자 크기라 글자색과 겹치지 않는다(recipes/shadcn/lib/utils.ts).
// 그래서 막힌 상자의 text-fg-disabled 가 기본 글자색을, 컨트롤의 active:[scale:1] 이 active:[scale:calc(…)] 를,
// 체크의 hover:bg-transparent 들이 Ghost 의 누름 · 호버 바탕을 지운다. focus-visible:outline-none 은 outline-2 와 무리가 달라
// 둘 다 남는다(outline-none 의 --tw-outline-style: none 이 링을 끈다).
const GROUPS = [
  [/^bg-/, "bg"],
  [/^text-(?:fg-|static-)/, "color"],
  [/^text-t\d+$/, "font-size"],
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

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기는 앞의 [&>svg]:size-[22px] · 체크의 [&_svg]:size-3.5 가 정한다(24 는 lucide 기본값)
const svg = (paths, { strokeWidth = 2, cls = "" } = {}) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ""} aria-hidden="true">${paths}</svg>`;

const ICONS = {
  fileText: svg(
    '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  ),
  sheet: svg(
    '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="3" x2="21" y1="15" y2="15"/><line x1="9" x2="9" y1="9" y2="21"/><line x1="15" x2="15" y1="9" y2="21"/>',
  ),
  braces: svg(
    '<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>',
  ),
  sun: svg(
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  ),
  moon: svg(
    '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',
  ),
};

// 칸 안의 체크 · 가로줄 — checkbox.tsx 처럼 선 3. 둘 다 넣어 두고 칸의 data-state 로 하나만 보인다
const CHECK_ICONS =
  svg('<path d="M20 6 9 17l-5-5"/>', { strokeWidth: 3, cls: CHECK_ICON }) +
  svg('<path d="M5 12h14"/>', { strokeWidth: 3, cls: MINUS_ICON });

const state = (checked) => (checked ? "checked" : "unchecked");

// 컨트롤 — 레시피는 Radiomark 를 medium · neutral, Checkmark 를 medium · ghost · neutral 로 부르고 cn(MARK_IN_BOX(, GHOST_NO_BG)) 를 덧붙인다.
// 표식(data-select-box-control · data-select-box-action)은 Radix 가 그리는 속성 뒤에 온다
const MARK = ['data-select-box-control=""', 'data-select-box-action=""'];

// <Radiomark> — Radix RadioGroup.Item · Indicator(forceMount)가 그리는 모양. value 는 코드가 넘긴 값이다
function radiomark({ id, value, checked, disabled }) {
  const radix = attrs([`data-state="${state(checked)}"`, disabled && 'data-disabled=""']);
  const root = attrs([
    'type="button"',
    'role="radio"',
    `aria-checked="${checked}"`,
    radix,
    disabled && "disabled",
    `value="${value}"`,
    `class="${merge(`${radiomarkVariants({ size: "medium", tone: "neutral" })} ${merge(MARK_IN_BOX)}`)}"`,
    `id="${id}"`,
    ...MARK,
  ]);
  return `<button ${root}><span ${radix} class="${radiomarkDotVariants({ size: "medium", tone: "neutral" })}"></span></button>`;
}

// <Checkmark shape="ghost"> — Radix Checkbox.Root · Indicator(forceMount)가 그리는 모양. Ghost 라 선택 안 됨에도 옅은 체크가 보인다.
// state = "unchecked" · "checked" · "indeterminate"
function checkmark({ id, checkState, disabled }) {
  const radix = attrs([`data-state="${checkState}"`, disabled && 'data-disabled=""']);
  const root = attrs([
    'type="button"',
    'role="checkbox"',
    `aria-checked="${checkState === "indeterminate" ? "mixed" : checkState === "checked"}"`,
    radix,
    disabled && "disabled",
    `class="${merge(`${checkmarkVariants({ size: "medium", shape: "ghost", tone: "neutral" })} ${merge(`${MARK_IN_BOX} ${GHOST_NO_BG}`)}`)}"`,
    `id="${id}"`,
    ...MARK,
  ]);
  return `<button ${root}><span ${radix} class="${merge(INDICATOR)}" style="pointer-events:none;">${CHECK_ICONS}</span></button>`;
}

// control="none" — 맨 Radix RadioGroup.Item · Checkbox.Root(안이 빈 버튼)를 화면 밖에. 레시피가 className 을 표식 뒤에 넘겨 class 가 맨 끝이다
function hiddenControl({ id, role, value, checkState, disabled }) {
  const root = attrs([
    'type="button"',
    `role="${role}"`,
    `aria-checked="${checkState === "indeterminate" ? "mixed" : checkState === "checked"}"`,
    `data-state="${checkState}"`,
    disabled && 'data-disabled=""',
    disabled && "disabled",
    role === "radio" && `value="${value}"`,
    `id="${id}"`,
    ...MARK,
    `class="${merge(HIDDEN_CONTROL)}"`,
  ]);
  return `<button ${root}></button>`;
}

// 펼침(레시피의 footer) — 고르면(기본) · 고르지 않으면 열리는 접는 틀, "늘" 이면 안쪽 여백만
function footerOf(html, footerVisibility) {
  const inner = `<div class="${selectBoxFooterInnerVariants()}">${html}</div>`;
  if (footerVisibility === "always") return inner;
  return `<div data-select-box-footer="" class="${FOOTER_BASE} ${FOOTER_OPEN[footerVisibility]}"><div class="${FOOTER_CLIP}">${inner}</div></div>`;
}

// 상자 하나(레시피의 Box) — div(테두리 · 바탕) > label(누르는 자리: 콘텐츠 + 컨트롤) + 펼침. 앞 · 설명 · 펼침은 없으면 그리지 않는다
function box({
  htmlFor,
  control,
  layout,
  disabled,
  label,
  description,
  prefix,
  footer,
  footerVisibility = "when-selected",
}) {
  const trigger = attrs([
    `for="${htmlFor}"`,
    'data-select-box-action=""',
    disabled && 'data-disabled=""',
    `class="${selectBoxTriggerVariants({ layout })}"`,
  ]);
  const head = prefix ? `<span class="${merge(selectBoxPrefixVariants({ disabled }))}">${prefix}</span>` : "";
  const text = description
    ? `<span class="${merge(selectBoxDescriptionVariants({ disabled }))}">${description}</span>`
    : "";
  const body = `<span class="${selectBoxBodyVariants()}"><span class="${merge(selectBoxLabelVariants({ disabled }))}">${label}</span>${text}</span>`;
  const content = `<span class="${selectBoxContentVariants({ layout })}">${head}${body}</span>`;
  return `<div class="${merge(selectBoxVariants())}"><label ${trigger}>${content}${control}</label>${footer ? footerOf(footer, footerVisibility) : ""}</div>`;
}

// 배치는 묶음의 열 수에서 온다 — 1열 가로형, 2 ~ 3열 세로형(레시피의 useLayout). 상자의 layout 이 있으면 그것
const layoutOf = (columns, layout) => layout ?? (columns > 1 ? "vertical" : "horizontal");

// <RadioSelectBoxGroup> — Radix RadioGroup.Root 가 role="radiogroup" 을 단다. 고른 값(value)과 같은 상자 하나만 고른 상태다.
// 상자는 { id, value, label, … } — control 은 "radio"(기본) · "none"
function radioSelectBoxGroup(items, { value, columns = 1, ariaLabel } = {}) {
  const boxes = items.map(({ id, value: own, control = "radio", disabled = false, layout, ...it }) => {
    const checked = own === value;
    const mark =
      control === "radio"
        ? radiomark({ id, value: own, checked, disabled })
        : hiddenControl({ id, role: "radio", value: own, checkState: state(checked), disabled });
    return box({ ...it, disabled, htmlFor: id, control: mark, layout: layoutOf(columns, layout) });
  });
  return `<div ${attrs(['role="radiogroup"', `class="${merge(selectBoxGroupVariants({ columns }))}"`, ariaLabel && `aria-label="${ariaLabel}"`])}>${boxes.join("")}</div>`;
}

// <CheckSelectBoxGroup> — 여럿 고르기 묶음. <fieldset>(role=group)이고 이름은 aria-label.
// 상자는 { id, checkState, label, … } — control 은 "check"(기본) · "none"
function checkSelectBoxGroup(items, { columns = 1, ariaLabel } = {}) {
  const boxes = items.map(({ id, checkState = "unchecked", control = "check", disabled = false, layout, ...it }) => {
    const mark =
      control === "check"
        ? checkmark({ id, checkState, disabled })
        : hiddenControl({ id, role: "checkbox", checkState, disabled });
    return box({ ...it, disabled, htmlFor: id, control: mark, layout: layoutOf(columns, layout) });
  });
  return `<fieldset ${attrs([`class="${merge(`${selectBoxGroupVariants({ columns })} ${CHECK_GROUP}`)}"`, ariaLabel && `aria-label="${ariaLabel}"`])}>${boxes.join("")}</fieldset>`;
}

// <Input> — input.tsx 그대로. 상자 <div data-slot="text-input"> 안에 <input data-slot="text-input-value"> 하나(붙이개 · 지우기 없음).
// type 은 레시피의 기본값 "text" 를 그리고, defaultValue 는 value 속성이 된다
const input = ({ ariaLabel, value }) =>
  `<div data-slot="text-input" data-variant="outline" data-size="responsive" class="${merge(INPUT_ROOT)}"><input type="text" data-slot="text-input-value" class="${merge(INPUT_VALUE)}" aria-label="${ariaLabel}" value="${value}"></div>`;

// 펼침 안의 안내 글 — 예제 코드의 <div className="text-t3 text-fg-neutral-muted">
const NOTE = "text-t3 text-fg-neutral-muted";
const note = (text) => `<div class="${NOTE}">${text}</div>`;

// 상자는 화면의 기본 면(bg-layer-default) 위에 놓인다 — 폭 360 의 휴대폰 화면처럼 좌우 24(global-gutter)를 두고 그린다.
// 사이트 미리보기 칸의 바탕(bg-page)은 누름 바탕(bg-layer-default-pressed)과 거의 같은 색이라 그 위에 바로 그리면 호버 · 누름이 보이지 않는다.
// 포커스 링은 상자 바깥 2px 에 서므로 좌우 여백 안에 들어온다
const SCREEN =
  "max-width:360px; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-global-gutter);";
const screen = (html) => `<div style="${SCREEN}">${html}</div>`;

// 반복 거래의 종료 — 하나 고르기 · 펼침 예제가 같이 쓴다. id 는 예제마다 앞말을 달리해 한 페이지에서 겹치지 않게 한다
const END = [
  { value: "none", label: "무기한", description: "중지할 때까지 계속 반복" },
  { value: "count", label: "횟수 지정", description: "정한 횟수만큼 반복" },
  { value: "date", label: "종료일 지정", description: "정한 날까지 반복" },
];
const ends = (prefix, extra = {}) => END.map((it) => ({ ...it, ...extra[it.value], id: `${prefix}-${it.value}` }));

// ── 여럿 고르고 저장(HR 역할)의 둘레 — field.tsx 의 클래스 · button.tsx 의 값(neutralSolid · medium — "저장") ───────────

// <Field> — 묶음이라 라벨은 <span id>(field.tsx — 묶음의 aria-labelledby 가 가리킨다). icon-picker-examples.mjs 의 것과 같다
const FIELD_ROOT = "flex w-full min-w-0 flex-col gap-x2";
const FIELD_HEADER = "flex items-center justify-between gap-x2_5 px-x0_5";
const FIELD_LABEL = "min-w-0 font-sans text-t5 text-fg-neutral";
const FIELD_LABEL_WEIGHT = { medium: "font-medium", bold: "font-bold" };
const FIELD_FOOTER = "flex items-start gap-x2 px-x0_5 font-sans";
const FIELD_DESCRIPTION = "m-0 flex min-w-0 text-t4 text-fg-neutral-subtle";
const FIELD_TEXT = "min-w-0";
// 사이트의 `.content p { margin: 12px 0; color: text-primary }` 를 덮는 미리보기용 덧칠(레시피에는 없다)
const P_FIX_DESCRIPTION = "margin:0; color:var(--color-fg-neutral-subtle);";

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
    neutralSolid:
      "bg-bg-neutral-inverted text-fg-neutral-inverted hover:bg-bg-neutral-inverted-pressed active:bg-bg-neutral-inverted-pressed aria-busy:bg-bg-neutral-inverted-pressed [--progress-track:color-mix(in_srgb,var(--color-fg-neutral-inverted)_30%,transparent)] [--progress-range:var(--color-fg-neutral-inverted)]",
  },
  size: { medium: "h-10 rounded-r2 [--press-basis:40] [--progress-size:16px]" },
  layout: { withText: "", iconOnly: "" },
  ghostColor: { neutral: "" },
};
const BUTTON_COMPOUND = [{ size: "medium", layout: "withText", className: "px-x4 py-x2_5 gap-x1_5 text-t4 [&_svg]:size-4" }];
const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };
const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });

// HR 역할 — groo-sql 기본 넷(설명 원문 그대로) + 관리자가 더한 넷(그림용 — 비교 페이지 마무리 10 이 그린 것). 저장된 역할은 일반 사용자 · 승인권자
const ROLES = [
  { code: "ADMIN", name: "관리자", description: "관리자 권한으로 시스템 운영에 필요한 전체 권한이 부여되어 있습니다." },
  { code: "USER", name: "일반 사용자", description: "일반 사용자 권한으로 시스템 관리에 필요한 권한을 제외한 일반적인 읽기, 쓰기 권한이 부여되어 있습니다." },
  { code: "APPROVER", name: "승인권자", description: "휴가 신청 항목에 대해 승인/반려를 할 수 있는 권한이 부여되어 있습니다." },
  { code: "WORKCODE_M", name: "업무 코드 관리자", description: "업무 이력에 사용되는 코드를 관리하는 권한이 부여되어 있습니다." },
  { code: "ATTEND_M", name: "근태 담당자", description: "출퇴근 기록과 근무 시간을 확인하고 바로잡을 수 있는 권한이 부여되어 있습니다." },
  { code: "EVAL_M", name: "평가 담당자", description: "평가 일정을 열고 닫으며 평가 결과를 모아 볼 수 있는 권한이 부여되어 있습니다." },
  { code: "PAY_VIEW", name: "급여 조회", description: "구성원의 급여 명세를 읽기 전용으로 볼 수 있는 권한이 부여되어 있습니다." },
  { code: "EDU_M", name: "교육 관리자", description: "교육 과정을 만들고 수강 현황을 관리하는 권한이 부여되어 있습니다." },
];
const ROLES_SAVED = ["USER", "APPROVER"];

// <Field label="역할" description> > <CheckSelectBoxGroup>(이름 = 라벨 · 설명 = 설명) + 아래 줄(옆 글 · "저장" — 바뀐 것이 없으면 막힘)
function rolesForm(prefix, picked = ROLES_SAVED) {
  const labelId = `${prefix}-label`;
  const descriptionId = `${prefix}-description`;
  const group = checkSelectBoxGroup(ROLES.map((r) => ({ id: `${prefix}-${r.code}`, label: r.name, description: r.description, checkState: state(picked.includes(r.code)) })))
    .replace("<fieldset ", `<fieldset aria-labelledby="${labelId}" aria-describedby="${descriptionId}" `);
  const added = picked.filter((c) => !ROLES_SAVED.includes(c)).length;
  const removed = ROLES_SAVED.filter((c) => !picked.includes(c)).length;
  const changed = added + removed > 0;
  const fieldHtml = `<div data-slot="field" class="${FIELD_ROOT}"><div data-slot="field-header" class="${FIELD_HEADER}"><span id="${labelId}" class="${FIELD_LABEL} ${FIELD_LABEL_WEIGHT.medium}">역할</span></div>${group}<div data-slot="field-footer" class="${FIELD_FOOTER}"><p id="${descriptionId}" class="${FIELD_DESCRIPTION}" style="${P_FIX_DESCRIPTION}"><span class="${FIELD_TEXT}">여럿 고를 수 있어요. 저장을 눌러야 바뀌어요.</span></p></div><span class="sr-only" aria-live="polite"></span></div>`;
  const bar = `<div class="flex items-center justify-end gap-x3"><span class="text-t4 text-fg-neutral-subtle">${changed ? `더함 ${added} · 뺌 ${removed} — 아직 저장 안 됨` : "바뀐 것 없음"}</span><button${changed ? "" : " disabled"} class="${buttonVariants()}">저장</button></div>`;
  return `<div style="display:flex; flex-direction:column; gap:var(--spacing-x6);">${fieldHtml}${bar}</div>`;
}

// ── 예제 ──────────────────────────────────────────────────────────────────

export const selectBoxExamples = [
  {
    title: "하나 고르기",
    description:
      "하나를 고르는 묶음(RadioSelectBoxGroup)은 radiogroup 이고 aria-label 로 이름을 단다. 1열이면 가로형이다 — 제목 16 · 500, 설명 13 · fg-neutral-muted, 오른쪽 라디오 20. 상자 전체가 누르는 영역이고, 고른 상자는 테두리가 2px stroke-neutral-contrast 가 될 뿐 바탕은 그대로다.",
    jsx: `import { RadioSelectBox, RadioSelectBoxGroup } from "@/components/ui/select-box"

<RadioSelectBoxGroup value={end} onValueChange={setEnd} aria-label="종료">
  <RadioSelectBox value="none" label="무기한" description="중지할 때까지 계속 반복" />
  <RadioSelectBox value="count" label="횟수 지정" description="정한 횟수만큼 반복" />
  <RadioSelectBox value="date" label="종료일 지정" description="정한 날까지 반복" />
</RadioSelectBoxGroup>`,
    render: () => screen(radioSelectBoxGroup(ends("select-box-ex-end"), { value: "none", ariaLabel: "종료" })),
  },

  {
    title: "펼침",
    description:
      "고를 때만 필요한 칸은 그 상자의 펼침(footer)에 둔다 — 고르면 상자 아래로 열리고(안쪽 여백 좌우 20 · 아래 16), 고르지 않은 상자의 펼침은 닫혀 보이지 않고 Tab 도 닿지 않는다. 펼침은 누르는 영역이 아니다. 미리보기는 위 묶음에서 횟수 지정을 고른 모습이다.",
    jsx: `import { Input } from "@/components/ui/input"

<RadioSelectBox
  value="count"
  label="횟수 지정"
  description="정한 횟수만큼 반복"
  footer={<Input aria-label="반복 횟수" defaultValue={12} />}
/>`,
    render: () =>
      screen(
        radioSelectBoxGroup(
          ends("select-box-ex-footer", { count: { footer: input({ ariaLabel: "반복 횟수", value: 12 }) } }),
          { value: "count", ariaLabel: "종료" },
        ),
      ),
  },

  {
    title: "여럿 고르기",
    description:
      "여럿을 고르는 묶음(CheckSelectBoxGroup)은 <fieldset> 이고 aria-label 로 이름을 단다. 오른쪽은 칸 없는 체크(Checkbox Ghost — 체크 14)라 고르지 않은 상자에도 옅은 체크가 보이고, 고르면 짙은 체크와 2px 테두리가 된다. 상자가 누름 · 호버를 맡아 체크는 자기 바탕을 깔지 않는다.",
    jsx: `import { CheckSelectBox, CheckSelectBoxGroup } from "@/components/ui/select-box"

<CheckSelectBoxGroup aria-label="휴가 권한">
  <CheckSelectBox label="휴가 조회" description="본인 휴가 내역을 조회할 수 있는 권한입니다." defaultChecked />
  <CheckSelectBox label="휴가 신청" description="OT, 경조 휴가 등 휴가를 신청할 수 있는 권한입니다." />
</CheckSelectBoxGroup>`,
    render: () =>
      screen(
        checkSelectBoxGroup(
          [
            {
              id: "select-box-ex-leave-view",
              label: "휴가 조회",
              description: "본인 휴가 내역을 조회할 수 있는 권한입니다.",
              checkState: "checked",
            },
            {
              id: "select-box-ex-leave-request",
              label: "휴가 신청",
              description: "OT, 경조 휴가 등 휴가를 신청할 수 있는 권한입니다.",
            },
          ],
          { ariaLabel: "휴가 권한" },
        ),
      ),
  },

  {
    title: "여러 열 · 앞 · 컨트롤 없음",
    description:
      "2 ~ 3열이면 세로형이다 — 앞 아이콘(22)이 위에 서고, 상자 높이는 가장 긴 상자에 맞춘다. 3열은 좁으니 제목과 짧은 설명만 두고 컨트롤은 없음으로 한다 — 고른 것은 테두리가 알리고, 라디오는 화면 밖(sr-only)에 남아 키보드 · 화면 읽기 프로그램이 그대로 쓴다.",
    jsx: `import { Braces, FileText, Sheet } from "lucide-react"
import { RadioSelectBox, RadioSelectBoxGroup } from "@/components/ui/select-box"

<RadioSelectBoxGroup columns={3} defaultValue="csv" aria-label="파일 형식">
  <RadioSelectBox value="csv" control="none" prefix={<FileText />} label="CSV" description="구글시트" />
  <RadioSelectBox value="xlsx" control="none" prefix={<Sheet />} label="Excel" description="엑셀" />
  <RadioSelectBox value="json" control="none" prefix={<Braces />} label="JSON" description="백업용" />
</RadioSelectBoxGroup>`,
    render: () =>
      screen(
        radioSelectBoxGroup(
          [
            { value: "csv", prefix: ICONS.fileText, label: "CSV", description: "구글시트" },
            { value: "xlsx", prefix: ICONS.sheet, label: "Excel", description: "엑셀" },
            { value: "json", prefix: ICONS.braces, label: "JSON", description: "백업용" },
          ].map((it) => ({ ...it, id: `select-box-ex-format-${it.value}`, control: "none" })),
          { value: "csv", columns: 3, ariaLabel: "파일 형식" },
        ),
      ),
  },

  {
    title: "비활성",
    description:
      "막힌 상자는 제목 · 설명 · 앞 아이콘이 fg-disabled 가 되고 누르기 · Tab 에서 빠진다 — 불투명도로 흐리게 하지 않는다. 테두리는 1px 옅은 선이고, 고른 채 막히면 2px 옅은 선이다.",
    jsx: `<RadioSelectBoxGroup defaultValue="fixed" aria-label="가변 부여 여부">
  <RadioSelectBox value="fixed" label="고정 시간" description="정책에 등록된 부여 시간을 사용합니다." disabled />
  <RadioSelectBox value="flex" label="가변 시간" description="사용자 또는 관리자가 입력한 시간 값으로 부여합니다." disabled />
</RadioSelectBoxGroup>`,
    render: () =>
      screen(
        radioSelectBoxGroup(
          [
            {
              id: "select-box-ex-grant-fixed",
              value: "fixed",
              label: "고정 시간",
              description: "정책에 등록된 부여 시간을 사용합니다.",
              disabled: true,
            },
            {
              id: "select-box-ex-grant-flex",
              value: "flex",
              label: "가변 시간",
              description: "사용자 또는 관리자가 입력한 시간 값으로 부여합니다.",
              disabled: true,
            },
          ],
          { value: "fixed", ariaLabel: "가변 부여 여부" },
        ),
      ),
  },

  {
    title: "여럿 고르고 저장 — HR 역할",
    description:
      "권한을 주는 여럿 고르기도 고르기만 한다 — HR 관리 > 역할 및 권한 > 사용자의 역할은 칸 없는 체크 상자(이름 + 역할 설명)를 고르고 아래 \"저장\" 한 번으로 반영한다(2026-10-15 사용자 결정 10A). Field 안에 두면 Field 의 라벨이 묶음(fieldset)의 이름, 설명이 묶음의 설명이 된다. 바뀐 것이 없으면 \"저장\" 은 막혀 있고, 고르면 옆 글이 \"더함 1 · 뺌 0 — 아직 저장 안 됨\" 이 된다 — 누를 때마다 저장하지 않는다(실수 한 번에 권한이 바뀌고, 빨리 두 번 누르면 앞 변경을 모르는 목록을 보낼 수 있다). 폰 · 데스크톱이 같은 모양이고 역할이 늘어도 상자를 쌓는다 — 검색 시트 · 팝오버 + 완료 두 벌(cmdk)은 걷는다. 코드는 기본 셋으로 줄였고, 미리보기는 기본 넷 + 관리자가 더한 넷(여덟)을 저장한 그대로(일반 사용자 · 승인권자) 그렸다 — 스크립트 없이 그려 눌러도 고르지 않는다.",
    jsx: `import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { CheckSelectBox, CheckSelectBoxGroup } from "@/components/ui/select-box"

const roles = [
  { code: "ADMIN", name: "관리자", description: "관리자 권한으로 시스템 운영에 필요한 전체 권한이 부여되어 있습니다." },
  { code: "USER", name: "일반 사용자", description: "일반 사용자 권한으로 시스템 관리에 필요한 권한을 제외한 일반적인 읽기, 쓰기 권한이 부여되어 있습니다." },
  { code: "APPROVER", name: "승인권자", description: "휴가 신청 항목에 대해 승인/반려를 할 수 있는 권한이 부여되어 있습니다." },
]
const saveUserRoles = (codes: string[]) => Promise.resolve(codes) // 사용자 역할 저장 요청 — 성공하면 토스트 "역할을 저장했어요"

const [saved, setSaved] = useState<string[]>(["USER", "APPROVER"])
const [picked, setPicked] = useState<string[]>(saved)
const added = picked.filter((c) => !saved.includes(c)).length
const removed = saved.filter((c) => !picked.includes(c)).length
const toggle = (code: string, on: boolean) =>
  setPicked((list) => (on ? [...list, code] : list.filter((c) => c !== code)))

<Field label="역할" description="여럿 고를 수 있어요. 저장을 눌러야 바뀌어요.">
  <CheckSelectBoxGroup>
    {roles.map((r) => (
      <CheckSelectBox
        key={r.code}
        label={r.name}
        description={r.description}
        checked={picked.includes(r.code)}
        onCheckedChange={(on) => toggle(r.code, on)}
      />
    ))}
  </CheckSelectBoxGroup>
</Field>
<div className="flex items-center justify-end gap-x3">
  <span className="text-t4 text-fg-neutral-subtle">
    {added + removed > 0 ? \`더함 \${added} · 뺌 \${removed} — 아직 저장 안 됨\` : "바뀐 것 없음"}
  </span>
  {/* 바뀐 것이 없으면 막는다 — 저장은 한 번, 누를 때마다 저장하지 않는다 */}
  <Button disabled={added + removed === 0} onClick={() => saveUserRoles(picked).then(() => setSaved(picked))}>
    저장
  </Button>
</div>`,
    render: () => screen(rolesForm("sb-roles")),
  },

  {
    title: "2열 · 앞",
    description:
      "2열도 세로형이다 — 앞 아이콘이 위에, 라디오는 위 오른쪽에 선다. 설명 길이가 달라도 상자 높이는 같고, 누르는 자리가 남는 아래쪽까지 채워 짧은 상자의 빈 자리도 눌린다.",
    jsx: `import { Moon, Sun } from "lucide-react"
import { RadioSelectBox, RadioSelectBoxGroup } from "@/components/ui/select-box"

<RadioSelectBoxGroup columns={2} defaultValue="solar" aria-label="날짜 기준">
  <RadioSelectBox value="solar" prefix={<Sun />} label="양력" description="매년 같은 날짜" />
  <RadioSelectBox value="lunar" prefix={<Moon />} label="음력" description="매년 음력으로 계산" />
</RadioSelectBoxGroup>`,
    render: () =>
      screen(
        radioSelectBoxGroup(
          [
            {
              id: "select-box-ex-date-solar",
              value: "solar",
              prefix: ICONS.sun,
              label: "양력",
              description: "매년 같은 날짜",
            },
            {
              id: "select-box-ex-date-lunar",
              value: "lunar",
              prefix: ICONS.moon,
              label: "음력",
              description: "매년 음력으로 계산",
            },
          ],
          { value: "solar", columns: 2, ariaLabel: "날짜 기준" },
        ),
      ),
  },

  {
    title: "펼침 보이기",
    description:
      'footerVisibility 로 펼침을 보일 때를 고른다 — 고르면(기본 "when-selected") · 고르지 않으면("when-not-selected") · 늘("always"). 늘 보이는 펼침은 접는 틀 없이 안쪽 여백만 둔다. 미리보기는 첫 상자만 고른 모습이라 세 펼침이 모두 보인다.',
    jsx: `import { CheckSelectBox, CheckSelectBoxGroup } from "@/components/ui/select-box"

<CheckSelectBoxGroup aria-label="펼침 보이기">
  <CheckSelectBox
    label="고르면 보인다"
    description="when-selected · 기본"
    defaultChecked
    footer={<div className="text-t3 text-fg-neutral-muted">고른 상자 아래로 열리는 안내</div>}
  />
  <CheckSelectBox
    label="고르지 않으면 보인다"
    description="when-not-selected"
    footerVisibility="when-not-selected"
    footer={<div className="text-t3 text-fg-neutral-muted">고르면 닫히는 안내</div>}
  />
  <CheckSelectBox
    label="늘 보인다"
    description="always"
    footerVisibility="always"
    footer={<div className="text-t3 text-fg-neutral-muted">고르든 말든 보이는 안내</div>}
  />
</CheckSelectBoxGroup>`,
    render: () =>
      screen(
        checkSelectBoxGroup(
          [
            {
              id: "select-box-ex-visibility-selected",
              label: "고르면 보인다",
              description: "when-selected · 기본",
              checkState: "checked",
              footer: note("고른 상자 아래로 열리는 안내"),
            },
            {
              id: "select-box-ex-visibility-not-selected",
              label: "고르지 않으면 보인다",
              description: "when-not-selected",
              footerVisibility: "when-not-selected",
              footer: note("고르면 닫히는 안내"),
            },
            {
              id: "select-box-ex-visibility-always",
              label: "늘 보인다",
              description: "always",
              footerVisibility: "always",
              footer: note("고르든 말든 보이는 안내"),
            },
          ],
          { ariaLabel: "펼침 보이기" },
        ),
      ),
  },
];
