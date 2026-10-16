/*
 * shadcn Input OTP 예제 — docs site components/input-otp.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 하나(본인 확인 — 메일로 코드 받기)는 차례 · 제목 · 코드가 specs/components/input-otp.md 의
 * "코드" 절과 같고, 뒤의 둘(숫자만 받는다 · 상태)은 md 의 Properties 를 코드로 더 보인다. 인증 코드 칸은 Input 한 칸이다(2026-10-09) —
 * SEED Text Input 의 "Input을 나누지 말고 … 한 번에 입력" 을 따랐다(SEED 에는 OTP 부품이 없다). 옛 예제(칸 6 × 40 · 3-3 구분 ·
 * input-otp 라이브러리의 InputOTPGroup · InputOTPSlot)를 대신한다.
 *
 * ROOT_* · VALUE_* 는 recipes/shadcn/components/ui/input.tsx(Input — 코드 칸이 그 위에 짜인다)의 cva 정의 · 클래스와, BUTTON_* 는 button.tsx 의
 * cva 와, OTP_VALUE 는 input-otp.tsx 의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. ROOT_* · VALUE_* 는
 * input-examples.mjs 의 것과, BUTTON_* 는 button-examples.mjs 의 것과 같다 — 이 파일이 쓰는 변형 · 크기와 그에 걸리는 compound 만 옮겼다.
 * 둘레의 FIELD_* · field() 는 field.tsx 의 것이다 — input-examples.mjs 의 것과 같다.
 * 규칙은 specs/components/input-otp.md, 수치 원본은 specs/components/input-otp.yaml(칸의 값은 input.yaml · 라벨 · 설명 · 오류는 field.yaml).
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — Field <div data-slot="field"> > 머리(<label for>) · 상자 <div data-slot="text-input">(고정폭 숫자 tabular-nums) >
 * <input data-slot="text-input-value" data-input-otp inputmode="numeric" autocomplete="one-time-code"> · 꼬리(설명 또는 오류). 다시 받기는
 * Field 밖 그 아래의 Button(<button data-slot="input-otp-resend">)이다. maxlength 는 없다 — 붙인 글의 숫자를 잃지 않게.
 * 레시피의 스크립트(숫자만 뽑기 · 앞 6자리 · 붙여넣기 · 남은 초 세기 · 보낸 뒤 초점 옮기기)는 정적 HTML 에 없다 — 칸에 쓸 수는 있지만
 * 숫자만 남지 않고, 다시 받기의 남은 초는 그 순간에 멈춰 있다. id 는 레시피의 useId 자리다 — 예제마다 앞말을 달리한다.
 */

// ── input.tsx 의 cva 와 같은 값 — 상자형(outline) 한 칸 ───────────────────

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
  },
  size: {
    large: "",
    medium: "",
    responsive: "",
  },
};

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
];

const ROOT_DEFAULTS = { variant: "outline", size: "responsive" };

// 입력(<input>) — 상자 높이를 채운다. 레시피는 cn(이것, 값 색, className)
const VALUE_BASE = [
  "min-w-0 flex-1 self-stretch border-0 bg-transparent p-0 caret-fg-neutral outline-none [font:inherit]",
  "first:pl-[var(--text-input-px)] last:pr-[var(--text-input-px)] disabled:cursor-not-allowed",
  // 브라우저 자동 완성의 바탕색을 지운다 — 글자색은 칸 그대로(SEED)
  "[&:-webkit-autofill]:bg-clip-text [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-fg-neutral)] [&:-webkit-autofill]:[transition:background-color_9999s_9999s]",
].join(" ");

const VALUE_COLOR = {
  enabled: "text-fg-neutral placeholder:text-fg-placeholder",
  disabled: "text-fg-disabled placeholder:text-fg-disabled",
};

// ── input-otp.tsx 의 JSX 에 적힌 클래스 — 코드 칸의 숫자는 고정폭(고정폭 글꼴 · 글자 사이 띄움 · 가운데 맞춤은 두지 않는다).
//    상자(rootClassName)에 건다 — 입력은 상자의 글꼴을 통째로 이어받는다(Input 의 [font:inherit]) ──

const OTP_VALUE = "tabular-nums";
// 막혀도 자리 글은 fg-placeholder 그대로 — 입력의 className 으로 Input 의 막힘 색을 덮는다(input-otp.yaml disabled › placeholder)
const OTP_PLACEHOLDER = "placeholder:text-fg-placeholder";

// ── button.tsx 의 cva 와 같은 값 — 다시 받기(neutralWeak · medium) · 확인(neutralSolid · large) ─────────

const BUTTON_BASE = "relative inline-flex items-center justify-center whitespace-nowrap font-sans font-bold before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring disabled:cursor-not-allowed disabled:[scale:1] disabled:bg-bg-disabled disabled:text-fg-disabled aria-busy:cursor-progress aria-busy:text-transparent aria-busy:[&>svg:not([data-slot=progress-circle])]:invisible aria-busy:active:[scale:1] [--progress-thickness:2px] [&_svg]:pointer-events-none [&_svg]:shrink-0";
const BUTTON_VARIANTS = {
  variant: {
    neutralSolid: "bg-bg-neutral-inverted text-fg-neutral-inverted hover:bg-bg-neutral-inverted-pressed active:bg-bg-neutral-inverted-pressed aria-busy:bg-bg-neutral-inverted-pressed [--progress-track:color-mix(in_srgb,var(--color-fg-neutral-inverted)_30%,transparent)] [--progress-range:var(--color-fg-neutral-inverted)]",
    neutralWeak: "bg-bg-neutral-weak text-fg-neutral hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed aria-busy:bg-bg-neutral-weak-pressed [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
  },
  size: {
    medium: "h-10 rounded-r2 [--press-basis:40] [--progress-size:16px]",
    large: "h-12 rounded-r3 [--press-basis:48] [--progress-size:18px]",
  },
  layout: { withText: "" },
  ghostColor: { neutral: "" },
};
const BUTTON_COMPOUND = [
  { size: "medium", layout: "withText", className: "px-x4 py-x2_5 gap-x1_5 text-t4 [&_svg]:size-4" },
  { size: "large", layout: "withText", className: "px-x5 py-x3 gap-x2 text-t6 [&_svg]:size-[22px]" },
];
const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// ── field.tsx 의 클래스 — 칸을 감싸는 둘레 ─────────────────────────────

const FIELD_ROOT = "flex w-full min-w-0 flex-col gap-x2";
const FIELD_HEADER = "flex items-center justify-between gap-x2_5 px-x0_5";
const FIELD_LABEL = "min-w-0 font-sans text-t5 text-fg-neutral";
const FIELD_LABEL_WEIGHT = { medium: "font-medium", bold: "font-bold" };
const FIELD_FOOTER = "flex items-start gap-x2 px-x0_5 font-sans";
const FIELD_ERROR = "m-0 flex min-w-0 text-t4 text-fg-critical";
const FIELD_ERROR_ICON = "mr-x1_5 mt-[calc((var(--text-t4--line-height)_-_1rem)/2)] size-4 shrink-0";
const FIELD_DESCRIPTION = "m-0 flex min-w-0 text-t4 text-fg-neutral-subtle";
const FIELD_TEXT = "min-w-0";

// 사이트의 `.content p { margin: 12px 0; color: text-primary }` 는 층(@layer) 밖 규칙이라 Tailwind utility 를 늘 이긴다 —
// 꼬리의 <p> 에는 클래스가 정한 바깥 여백 · 글자색을 style 로 한 번 더 적는다(레시피에는 없는 미리보기용 덧칠)
const P_FIX = {
  error: "margin:0; color:var(--color-fg-critical);",
  description: "margin:0; color:var(--color-fg-neutral-subtle);",
};

// ── cva · cn 풀이 · 미리보기 조각 ─────────────────────────────────────────

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
const textInputVariants = cvaOf(ROOT_BASE, { variants: ROOT_VARIANTS, compoundVariants: ROOT_COMPOUND, defaultVariants: ROOT_DEFAULTS });
const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });

// 정적 미리보기는 포커스를 쥘 수 없다 — 포커스한 모습은 레시피의 포커스 클래스에서 :has(input:focus) 만 뗀 사본을 덧붙여 그린다(input-examples.mjs 와 같다)
const FOCUS = ":has(input:focus)";
const forceFocus = (classList) =>
  classList
    .split(" ")
    .filter((c) => c.includes(FOCUS))
    .map((c) => c.replace(FOCUS, ""))
    .join(" ");

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const CIRCLE_ALERT = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${FIELD_ERROR_ICON}" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`;

const DESCRIPTION = "10분 안에 입력해주세요 · 5번 틀리면 다시 받아요.";
const WRONG = "코드가 맞지 않거나 시간이 지났어요. 확인하거나 다시 받아주세요.";

// <Field label="인증 코드" description invalid errorMessage><InputOTP /></Field> — 오류가 있으면 오류 글이 설명 자리를 대신한다(Field)
function otpField({ id, size = "responsive", value = "", invalid = false, error = WRONG, disabled = false, focused = false }) {
  const controlId = id;
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const showError = invalid && !!error;
  const describedBy = showError ? errorId : descriptionId;
  // 고정폭 숫자는 상자에 건다(레시피의 rootClassName="tabular-nums") — 입력은 상자의 글꼴을 통째로 이어받는다(Input 의 [font:inherit])
  let rootClass = `${textInputVariants({ size })} ${OTP_VALUE}`;
  if (focused) rootClass = `${rootClass} ${forceFocus(rootClass)}`;
  const root = attrs([
    'data-slot="text-input"',
    'data-variant="outline"',
    `data-size="${size}"`,
    showError && 'data-invalid="true"',
    disabled && 'data-disabled="true"',
    `class="${rootClass}"`,
  ]);
  const input = attrs([
    'type="text"',
    'data-slot="text-input-value"',
    `class="${VALUE_BASE} ${disabled ? VALUE_COLOR.disabled.replace("placeholder:text-fg-disabled", OTP_PLACEHOLDER) : VALUE_COLOR.enabled}"`,
    'inputmode="numeric"',
    'autocomplete="one-time-code"',
    'spellcheck="false"',
    'placeholder="6자리 숫자"',
    'data-input-otp=""',
    value !== "" && `value="${esc(value)}"`,
    `id="${controlId}"`,
    disabled && "disabled",
    showError && 'aria-invalid="true"',
    `aria-describedby="${describedBy}"`,
  ]);
  const footer = showError
    ? `<p id="${errorId}" aria-hidden="true" class="${FIELD_ERROR}" style="${P_FIX.error}">${CIRCLE_ALERT}<span class="${FIELD_TEXT}">${esc(error)}</span></p>`
    : `<p id="${descriptionId}" class="${FIELD_DESCRIPTION}" style="${P_FIX.description}"><span class="${FIELD_TEXT}">${esc(DESCRIPTION)}</span></p>`;
  return `<div ${attrs(['data-slot="field"', showError && 'data-invalid="true"', disabled && 'data-disabled="true"', `class="${FIELD_ROOT}"`])}><div data-slot="field-header" class="${FIELD_HEADER}"><label id="${labelId}" for="${controlId}" class="${FIELD_LABEL} ${FIELD_LABEL_WEIGHT.medium}">인증 코드</label></div><div ${root}><input ${input}></div><div data-slot="field-footer" class="${FIELD_FOOTER}">${footer}</div><span class="sr-only" aria-live="polite">${showError ? esc(error) : ""}</span></div>`;
}

// <InputOTPResend className="mt-x3" sentAt> — null 이면 "코드 받기", 보낸 뒤 60초 안이면 "다시 받기(n초)" + 막힘, 지나면 "다시 받기"
function resend({ remaining = null }) {
  const label = remaining == null ? "코드 받기" : remaining > 0 ? `다시 받기(${remaining}초)` : "다시 받기";
  return `<button ${attrs([
    // className 은 cva 끝에 붙는다(cn — 겹치는 속성이 없어 이어 붙인 것과 같다)
    `class="${buttonVariants({ variant: "neutralWeak", size: "medium" })} ${OTP_VALUE} mt-x3"`,
    remaining > 0 && "disabled",
    'type="button"',
    'data-slot="input-otp-resend"',
  ])}>${label}</button>`;
}
// <Button size="large">확인</Button> — 켜 두고 누를 때 알린다(6자리가 안 되면 오류)
const confirm = `<button class="${buttonVariants({ size: "large" })}">확인</button>`;

// 화면 — 칸은 기본 레이어(흰 면) 위에 놓인다(사이트 미리보기 칸의 바탕은 막힌 칸의 bg-disabled 와 같은 색이라)
const SURFACE = "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-x6); max-width:390px; box-sizing:border-box; font-family:var(--font-sans);";
const CAPTION = "display:block; margin:0 0 var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); font-weight:700; color:var(--color-fg-neutral-subtle);";
const screen = (inner, caption = "") => `<div style="${SURFACE}">${caption ? `<span style="${CAPTION}">${esc(caption)}</span>` : ""}<div style="display:flex; flex-direction:column; align-items:flex-start;">${inner}</div></div>`;
const stack = (items) => `<div style="display:flex; flex-wrap:wrap; gap:var(--spacing-x6); align-items:flex-start;">${items.map((it) => `<div style="flex:1 1 320px; max-width:390px;">${it}</div>`).join("")}</div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const inputOtpExamples = [
  {
    title: "본인 확인 — 메일로 코드 받기",
    description:
      "메일 · 문자로 받은 일회용 인증 코드(지금은 숫자 6자리)를 Input 상자형 한 칸으로 받는다 — 칸을 자릿수만큼 나누지 않는다. 크기 · 상자 · 포커스 · 오류 · 막힘은 Input 그대로(large 52 · medium 40 · 웹 기본 반응형)이고, 숫자는 고정폭 숫자로 다른 칸처럼 왼쪽에 쓴다. 치기 · 붙여넣기 · 자동 채우기 모두 글에서 숫자만 뽑아 앞 6자리를 쓴다(\"인증 코드: 123456\" → 123456) — maxLength 를 걸지 않는다. inputMode=\"numeric\" · autoComplete=\"one-time-code\" · placeholder \"6자리 숫자\" 는 칸이 스스로 건다. 설명 줄은 늘 \"10분 안에 입력해주세요 · 5번 틀리면 다시 받아요.\" 이고, 틀리면 Field 의 오류 글이 이 줄을 대신하며 칸을 고치기 시작하면 돌아온다. 다시 받기는 칸 꼬리 아래 12 의 Button neutralWeak medium — 보내기 전 \"코드 받기\", 보낸 뒤 60초 동안 \"다시 받기(52초)\" 로 막히고(남은 초는 단추가 센다), 누르면 초점을 칸으로 옮긴다. 6자리를 채워도 저절로 보내지 않는다 — 확인을 누른다.",
    jsx: `import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { InputOTP, InputOTPResend } from "@/components/ui/input-otp"

const [code, setCode] = useState("")
const [sentAt, setSentAt] = useState<number | null>(null)
const [error, setError] = useState<string | null>(null)

<Field label="인증 코드" description="10분 안에 입력해주세요 · 5번 틀리면 다시 받아요." invalid={error !== null} errorMessage={error}>
  <InputOTP
    id="withdraw-code"
    value={code}
    onValueChange={(value) => {
      setCode(value)
      setError(null) // 고치기 시작하면 설명 줄로 돌아온다
    }}
  />
</Field>
<InputOTPResend className="mt-x3" sentAt={sentAt} codeInputId="withdraw-code" onResend={() => sendCode().then(() => setSentAt(Date.now()))} />
<Button size="large" onClick={confirm}>확인</Button>`,
    render: () =>
      stack([
        screen(`${otpField({ id: "otp-ex-1a" })}${resend({ remaining: null })}<div style="margin-top:var(--spacing-x6);">${confirm}</div>`, "처음 — 코드 받기"),
        screen(`${otpField({ id: "otp-ex-1b", value: "1234" })}${resend({ remaining: 52 })}<div style="margin-top:var(--spacing-x6);">${confirm}</div>`, "보낸 뒤 — 다시 받기(52초) 막힘"),
        screen(`${otpField({ id: "otp-ex-1c", value: "123465", invalid: true })}${resend({ remaining: 0 })}<div style="margin-top:var(--spacing-x6);">${confirm}</div>`, "틀림 — 오류 글이 설명 줄을 대신"),
      ]),
  },

  {
    title: "크기 — large · medium",
    description:
      "코드 칸은 Input 의 크기를 그대로 쓴다 — large 52(폰 · 앱 · 1280 미만 웹, 글 16 / 22) · medium 40(1280 이상 데스크톱 웹, 글 14 / 19), 웹의 기본은 responsive(1280 에서 바뀐다). 다시 받기 단추는 칸 크기와 상관없이 Button medium 40 이고 칸 아래에 둔다 — 칸 옆에 두지 않는다(칸 52 · 40 과 단추 높이가 맞지 않는다).",
    jsx: `<InputOTP size="large" />
<InputOTP size="medium" />`,
    render: () =>
      stack([
        screen(otpField({ id: "otp-ex-2a", size: "large", value: "123456" }), "large 52"),
        screen(otpField({ id: "otp-ex-2b", size: "medium", value: "123456" }), "medium 40"),
      ]),
  },

  {
    title: "상태 — 포커스 · 오류 · 막힘",
    description:
      "상태는 Input 그대로다 — 포커스는 안쪽 2px stroke-neutral-contrast(마우스 · 터치로 눌러도), 오류는 안쪽 2px stroke-critical-solid 에 Field 의 오류 글(14 · fg-critical + 아이콘 16)이 설명 줄을 대신한다. 오류 글은 서버가 보낸 글이 아니라 화면 글이다 — 무엇이 안 됐는지와 할 일. 6자리가 안 되면 확인을 누를 때 \"인증 코드 6자리를 입력해주세요.\" 다. 막힘은 bg-disabled · fg-disabled — 흐리게 하지 않는다.",
    jsx: `<Field label="인증 코드" description="10분 안에 입력해주세요 · 5번 틀리면 다시 받아요." invalid errorMessage="인증 코드 6자리를 입력해주세요.">
  <InputOTP value="123" onValueChange={setCode} />
</Field>`,
    render: () =>
      stack([
        screen(otpField({ id: "otp-ex-3a", value: "123", focused: true }), "포커스"),
        screen(otpField({ id: "otp-ex-3b", value: "123", invalid: true, error: "인증 코드 6자리를 입력해주세요." }), "오류 — 6자리가 안 됨"),
        screen(otpField({ id: "otp-ex-3c", value: "123456", disabled: true }), "막힘"),
      ]),
  },
];
