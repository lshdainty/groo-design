/*
 * shadcn Textarea 예제 — docs site components/textarea.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 기본 · 최대 높이 · 고정 높이의 코드와 글은 specs/components/textarea.md 의 "코드" 절과 같고,
 * 크기 · 상태는 md 의 Properties 를 코드로 더 보인다.
 *
 * ROOT_* · VALUE_* 는 recipes/shadcn/components/ui/textarea.tsx 의 cva 정의 · 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다.
 * 같은 값을 field-examples.mjs 도 옮겨 쓴다(textarea.tsx 를 고치면 둘을 함께).
 * 둘레의 FIELD_* · field() 는 field.tsx 의 것이다 — field-examples.mjs · input-examples.mjs 의 것과 같다.
 * 규칙은 specs/components/textarea.md, 수치 원본은 specs/components/textarea.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — Field <div data-slot="field"> > 머리(<label for>) · 상자 · 꼬리(<p>),
 * 상자 <div data-slot="textarea"> > <textarea data-slot="textarea-value">. 상태는 상자의 data-invalid · data-disabled · data-readonly 와
 * 입력의 aria-invalid · disabled · readonly 로 그린다. id 는 레시피의 useId 자리다 — 예제마다 앞말을 달리한다.
 * 자동 높이는 레시피의 스크립트(fit)가 높이를 재서 style 에 적는다. 정적 HTML 에는 그 스크립트가 없어 CSS field-sizing: content 로
 * 같은 일을 시킨다(style — 레시피에는 없다) — 지원하지 않는 브라우저에서는 3줄 높이에 머문다. 글자 수 세기 · 최대에서 자르기도 없다.
 */

// ── textarea.tsx 의 cva 와 같은 값 ──────────────────────────────────────

// 상자(textareaVariants) — Input 의 outline 과 같다. 테두리는 안쪽 1px, 포커스 · 오류의 2px 는 ::after 로 덧그린다
const ROOT_BASE = [
  "relative flex w-full min-w-0 overflow-hidden bg-transparent font-sans shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)]",
  "cursor-text data-[disabled]:cursor-not-allowed data-[disabled]:bg-bg-disabled data-[readonly]:bg-bg-disabled",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-2 after:border-solid after:border-transparent after:content-['']",
  "after:[transition:border-color_var(--motion-duration-d2)_var(--motion-ease-easing)]",
  "[&:has(textarea:focus):not([data-invalid]):not([data-readonly])]:after:border-stroke-neutral-contrast",
  "data-[invalid]:after:border-stroke-critical-solid",
].join(" ");

const ROOT_VARIANTS = {
  size: {
    large: "rounded-r3 text-t5 [--textarea-px:var(--spacing-x4)] [--textarea-py:var(--spacing-x3_5)]",
    medium: "rounded-r2 text-t4 [--textarea-px:var(--spacing-x3_5)] [--textarea-py:var(--spacing-x3)]",
    responsive: [
      "rounded-r3 text-t5 [--textarea-px:var(--spacing-x4)] [--textarea-py:var(--spacing-x3_5)]",
      "lg:rounded-r2 lg:text-t4 lg:[--textarea-px:var(--spacing-x3_5)] lg:[--textarea-py:var(--spacing-x3)]",
    ].join(" "),
  },
};

const ROOT_DEFAULTS = { size: "responsive" };

// 입력(textareaValueVariants) — 여백 · 높이는 입력이 가진다. 최소 높이는 자동 높이 3줄, 고정 높이 2줄
const VALUE_BASE =
  "block w-full resize-none border-0 bg-transparent px-[var(--textarea-px)] py-[var(--textarea-py)] caret-fg-neutral outline-none [font:inherit] disabled:cursor-not-allowed";

const VALUE_VARIANTS = {
  size: { large: "", medium: "", responsive: "" },
  autoSize: { true: "overflow-y-hidden", false: "overflow-y-auto" },
};

const VALUE_COMPOUND = [
  { autoSize: true, size: "large", className: "min-h-[5.875rem]" },
  { autoSize: true, size: "medium", className: "min-h-[5.125rem]" },
  { autoSize: true, size: "responsive", className: "min-h-[5.875rem] lg:min-h-[5.125rem]" },
  { autoSize: false, size: "large", className: "min-h-[4.5rem]" },
  { autoSize: false, size: "medium", className: "min-h-[3.875rem]" },
  { autoSize: false, size: "responsive", className: "min-h-[4.5rem] lg:min-h-[3.875rem]" },
];

const VALUE_DEFAULTS = { size: "responsive", autoSize: true };

// 값 · placeholder 색 — 레시피는 cn(textareaValueVariants, 색, className)
const VALUE_COLOR = {
  enabled: "text-fg-neutral placeholder:text-fg-placeholder",
  disabled: "text-fg-disabled placeholder:text-fg-disabled",
};

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

// ── cva 풀이 · 미리보기 조각 ───────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다.
// 참 · 거짓 축(autoSize)은 cva 처럼 "true" · "false" 글자 키로 찾고, compound 는 값 그대로 견준다.
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

const textareaVariants = cvaOf(ROOT_BASE, { variants: ROOT_VARIANTS, defaultVariants: ROOT_DEFAULTS });
const textareaValueVariants = cvaOf(VALUE_BASE, {
  variants: VALUE_VARIANTS,
  compoundVariants: VALUE_COMPOUND,
  defaultVariants: VALUE_DEFAULTS,
});

// 정적 미리보기는 포커스를 쥘 수 없다 — 포커스한 모습은 레시피의 포커스 클래스에서 :has(textarea:focus) 만 뗀 사본을 덧붙여 그린다.
// 오류 · 읽기 전용을 거르는 :not() 은 남겨 레시피와 같은 칸에서만 짙은 테두리가 선다(오류는 포커스해도 빨간 2px 그대로)
const FOCUS = ":has(textarea:focus)";
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

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기는 class 가 정한다
const icon = (paths, cls = "") =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ""} aria-hidden="true">${paths}</svg>`;
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

// <Textarea> — textarea.tsx 그대로. f 는 Field 의 문맥(없으면 Field 밖의 칸 — 이름은 ariaLabel 로). className 은 입력에 간다(max-h-* · h-*).
// focused 는 미리보기용 — 포커스한 모습(forceFocus). scrolls 는 최대 높이를 넘는 예제 — fit() 처럼 스크롤을 켠다
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
  if (focused) rootClass = `${rootClass} ${forceFocus(rootClass)}`;
  const root = attrs([
    'data-slot="textarea"',
    `data-size="${size}"`,
    isInvalid && 'data-invalid="true"',
    isDisabled && 'data-disabled="true"',
    isReadOnly && 'data-readonly="true"',
    `class="${rootClass}"`,
  ]);

  const valueClass = [textareaValueVariants({ size, autoSize }), isDisabled ? VALUE_COLOR.disabled : VALUE_COLOR.enabled, className]
    .filter(Boolean)
    .join(" ");
  // 자동 높이 — 레시피의 fit() 은 높이를 재서 style 에 적고, 최대 높이를 넘으면 overflow-y 를 auto 로 바꾼다
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

// 칸은 보통 기본 레이어(흰 면) 위에 놓인다. 사이트 미리보기 칸의 바탕(bg-page = bg-layer-basement)은
// 비활성 · 읽기 전용의 바탕(bg-disabled)과 같은 색(gray-200)이라, 그 위에 바로 그리면 막힌 칸이 보이지 않는다
const SURFACE =
  "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-x6);";
const surface = (html) => `<div style="${SURFACE}">${html}</div>`;
// 칸 하나는 폭을 줄여 그린다 — 넓은 미리보기 칸에 늘어지지 않게
const narrow = (html) => `<div style="max-width:400px;">${html}</div>`;
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

// 예제 글 — HR 휴가 신청의 사유 · 공지, Desk 메모
const REASON = "가족 행사 참석으로 제주에 다녀옵니다.\n급한 결재는 김지원 님께 맡겨 두었어요.\n출발 전날까지 하던 일을 정리해 두겠습니다.";
const NOTICE = [
  "10월 사내 행사 안내",
  "",
  "10월 24일(금) 오후 3시부터 사내 체육대회가 열립니다. 이날 오후는 행사 참여로 근무를 대신합니다.",
  "",
  "- 장소: 본사 앞 운동장(비가 오면 지하 강당)",
  "- 준비물: 편한 옷 · 운동화",
  "- 팀별 응원 도구는 총무팀이 나눠 드립니다",
  "- 끝난 뒤 저녁은 팀별로 먹습니다",
  "",
  "참석이 어려우면 10월 17일까지 팀장에게 알려 주세요. 행사 사진은 끝난 뒤 사내 게시판에 올립니다.",
].join("\n");
const MEMO = [
  "3월 관리비 정리",
  "- 전기 42,300원 · 수도 18,900원 · 가스 31,200원",
  "- 공용 관리비 76,000원(지난달보다 4,000원 올랐다)",
  "- 자동이체는 25일 — 통장 잔액을 24일까지 맞춰 둔다",
  "",
  "4월에 할 것",
  "- 관리사무소에 장기수선충당금 영수증 받기",
  "- 인터넷 약정 끝나는 날 확인(4월 18일)",
  "- 보험료 연납 할인 되는지 묻기",
  "- 가스 점검 날짜 잡기",
  "- 정수기 필터 바꾸기",
  "- 자동차세 연납 신청",
].join("\n");

// ── 예제 ──────────────────────────────────────────────────────────────────

export const textareaExamples = [
  {
    title: "기본",
    description:
      "여러 줄 칸도 Field 로 감싼다. 상자 · 테두리 · 상태는 Input 의 상자형과 같고, 3줄(large 94 · medium 82)에서 시작해 쓴 만큼 자란다(autoSize 기본) — 손잡이로 크기를 바꾸지 않는다. 최대 길이가 있으면 Field 에 maxGraphemeCount 를 줘 꼬리 오른쪽에 \"쓴 수/최대\" 를 보인다 — 자소 단위로 세고(국기 이모지도 한 글자) 입력은 최대에서 멈춘다. 쓴 수는 비었을 때 최대와 같은 fg-neutral-subtle, 쓰기 시작하면 fg-neutral 이다. 정적 미리보기는 높이를 재는 스크립트 대신 CSS field-sizing: content 로 자란다 — 칸에 써 보면 자라지만 글자 수는 따라 바뀌지 않는다.",
    jsx: `import { Field } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

<Field label="휴가 사유" maxGraphemeCount={1000}>
  <Textarea placeholder="예: 가족 행사 참석" />
</Field>`,
    render: () =>
      surface(
        grid([
          labeled(
            field({
              id: "textarea-ex-basic-empty",
              label: "휴가 사유",
              maxGraphemeCount: 1000,
              control: (f) => textarea({ f, placeholder: "예: 가족 행사 참석" }),
            }),
            "비었을 때 — 3줄",
            CAPTION,
          ),
          labeled(
            field({
              id: "textarea-ex-basic-filled",
              label: "휴가 사유",
              maxGraphemeCount: 1000,
              value: REASON,
              control: (f) => textarea({ f, placeholder: "예: 가족 행사 참석" }),
            }),
            "쓴 만큼 자란다",
            CAPTION,
          ),
        ]),
      ),
  },

  {
    title: "크기 — large · medium · responsive",
    description:
      "Input 과 같다 — large(글자 16 · 모서리 12 · 여백 위아래 14 · 좌우 16, 3줄 94)는 폰 · 앱에서, medium(14 · 8 · 12 · 14, 3줄 82)은 1280 이상 데스크톱 웹에서만 쓴다. 웹의 기본은 responsive(1280 미만 large · 이상 medium), 앱은 늘 large 다. 모양은 상자 하나다 — 밑줄형은 없다.",
    jsx: `<Textarea size="large" aria-label="메모" placeholder="예: 3월 관리비 정리" />
<Textarea size="medium" aria-label="메모" placeholder="예: 3월 관리비 정리" />
<Textarea aria-label="메모" placeholder="예: 3월 관리비 정리" />  {/* responsive — 기본 */}`,
    render: () =>
      surface(
        grid(
          [
            ["large", "large · 94"],
            ["medium", "medium · 82"],
            ["responsive", "responsive — 기본"],
          ].map(([size, caption]) => labeled(textarea({ size, ariaLabel: "메모", placeholder: "예: 3월 관리비 정리" }), caption)),
          150,
        ),
      ),
  },

  {
    title: "상태",
    description:
      "Input 의 상자형과 같다 — 포커스는 안쪽 2px stroke-neutral-contrast(마우스 · 터치로 눌러도), 오류는 안쪽 2px stroke-critical-solid(포커스해도 그대로), 비활성 · 읽기 전용은 바탕 bg-disabled(흐리게 하지 않는다)이고 비활성 글자는 fg-disabled 다. 읽기 전용은 포커스 테두리가 없다. 정적 미리보기라 focused 칸은 레시피의 포커스 클래스에서 :has(textarea:focus) 만 뗀 사본을 덧붙여 그렸다 — :not() 이 오류 · 읽기 전용을 거르므로 invalid + focused 는 빨간 그대로다.",
    jsx: `// 상태는 Field 에 주면 칸이 받는다(Field 밖이면 칸에 직접 준다)
<Textarea aria-label="휴가 사유" defaultValue="가족 행사 참석" />               // enabled
<Textarea aria-label="휴가 사유" defaultValue="가족 행사 참석" autoFocus />     // focused
<Textarea aria-label="휴가 사유" defaultValue="가족 행사 참석" aria-invalid />  // invalid — 포커스해도 그대로
<Textarea aria-label="휴가 사유" defaultValue="가족 행사 참석" disabled />      // disabled
<Textarea aria-label="휴가 사유" defaultValue="가족 행사 참석" readOnly />      // readonly`,
    render: () =>
      surface(
        grid(
          [
            ["enabled", {}],
            ["focused", { focused: true }],
            ["invalid", { invalid: true }],
            ["invalid + focused", { invalid: true, focused: true }],
            ["disabled", { disabled: true }],
            ["readonly", { readOnly: true }],
          ].map(([caption, state]) => labeled(textarea({ ...state, ariaLabel: "휴가 사유", value: "가족 행사 참석" }), caption)),
          180,
        ),
      ),
  },

  {
    title: "고정 높이",
    description:
      "autoSize={false} 면 자라지 않는다 — 높이를 자리마다 정하고(h-* · rows) 넘치는 글은 칸 안에서 스크롤한다. 높이는 반드시 정하고, 2줄(large 72 · medium 62)보다 낮게 두지 않는다. 높이 클래스는 className(입력)에 준다 — 상자에는 rootClassName. 미리보기는 h-60(240) 칸에 긴 공지를 넣은 모습이다.",
    jsx: `<Field label="공지 본문">
  <Textarea autoSize={false} className="h-60" />
</Field>`,
    render: () =>
      surface(
        narrow(
          field({
            id: "textarea-ex-fixed",
            label: "공지 본문",
            value: NOTICE,
            control: (f) => textarea({ f, autoSize: false, className: "h-60" }),
          }),
        ),
      ),
  },

  {
    title: "최대 높이",
    description:
      "자동 높이에 최대 높이를 주면(className=\"max-h-60\" — 240) 그 높이까지 자라고, 그 뒤로는 칸 안에서 스크롤한다. 시트 · 대화상자처럼 높이가 정해진 곳에서는 최대 높이를 정한다 — 끝없이 자라면 저장 버튼이 화면 밖으로 밀린다. 레시피의 fit() 은 최대를 넘으면 스크롤을 켠다 — 미리보기는 그 모습이다.",
    jsx: `<Field label="메모">
  <Textarea className="max-h-60" />
</Field>`,
    render: () =>
      surface(
        narrow(
          field({
            id: "textarea-ex-max",
            label: "메모",
            value: MEMO,
            control: (f) => textarea({ f, className: "max-h-60", scrolls: true }),
          }),
        ),
      ),
  },
];
