/*
 * shadcn Radio Group 예제 — docs site components/radio-group.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 차례 · 제목 · 코드는 specs/components/radio-group.md 의 "코드" 절을 따른다.
 *
 * RADIOMARK_* · DOT_* · ROW_* · LABEL_* 와 GROUP 은
 * recipes/shadcn/components/ui/radio-group.tsx 의 cva 정의 · 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다.
 * FIELD_* 는 field.tsx 의 클래스(field-examples.mjs 와 같다) — 오류 예가 묶음을 Field 로 감싼다.
 * 규칙은 specs/components/radio-group.md, 수치 원본은 specs/components/radio-group.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 동그라미는 Radix RadioGroup.Item 이 그리는 모양 그대로 <button role="radio" data-state> 로 그린다 — 선택 여부는 data-state,
 * 비활성은 disabled 라서 cva 의 data-[state=…]: · disabled: 클래스가 그대로 먹는다.
 * 가운데 점은 Radix Indicator(forceMount)가 그리는 <span data-state> 다 — 막히면 data-disabled 가 붙는다.
 * 눌러서 선택을 옮기는 동작은 React 에서 Radix 가 맡는다 — 미리보기는 고른 뒤의 한 순간이다.
 */

// ── radio-group.tsx 의 cva 와 같은 값 ──────────────────────────────────────

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

// 가운데 점(radiomarkDotVariants) — 선택 안 됨에는 투명, 선택이면 톤 색, 막히면 fg-disabled
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

// Radio — 한 줄(radioVariants). 누르는 영역은 ::before 로 44 까지
const ROW_BASE = [
  "group/radio relative inline-flex cursor-pointer select-none items-center gap-x2 self-start",
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

// Radio 의 라벨(radioLabelVariants)
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

// RadioGroup — 묶음, 세로로 쌓고 줄 사이 12
const GROUP = "flex flex-col gap-x3";

// ── cva 풀이 ──────────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순). 고르지 않은 축은 기본값을 쓴다.
// radio-group.tsx 는 이 결과를 cn() 에 한 번 더 넣지만(점은 넣지 않는다) 지워지는 클래스가 없다 —
// 같은 속성을 다시 쓰는 클래스는 data-[state=…]: · disabled: · hover: 같은 접두어가 갈라 둔다.
function cvaOf(base, { variants, defaultVariants = {} }) {
  return (props = {}) =>
    [base, ...Object.entries(variants).map(([axis, map]) => map[props[axis] ?? defaultVariants[axis]])]
      .filter(Boolean)
      .join(" ");
}

const radiomarkVariants = cvaOf(RADIOMARK_BASE, { variants: RADIOMARK_VARIANTS, defaultVariants: RADIOMARK_DEFAULTS });
const radiomarkDotVariants = cvaOf(DOT_BASE, { variants: DOT_VARIANTS, defaultVariants: DOT_DEFAULTS });
const radioVariants = cvaOf(ROW_BASE, { variants: ROW_VARIANTS, defaultVariants: ROW_DEFAULTS });
const radioLabelVariants = cvaOf(LABEL_BASE, { variants: LABEL_VARIANTS, defaultVariants: LABEL_DEFAULTS });

// ── field.tsx 의 클래스(field-examples.mjs 와 같다) — 오류 예의 Field ─────────────

const FIELD_ROOT = "flex w-full min-w-0 flex-col gap-x2";
const FIELD_HEADER = "flex items-center justify-between gap-x2_5 px-x0_5";
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

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");

// <Radiomark> 한 개 — Radix RadioGroup.Item · Indicator 가 그리는 모양.
// 점(Indicator)은 forceMount 라 선택 안 됨에도 들어 있다 — 투명하다가 선택이면 색이 든다.
function radiomark({ size, tone, checked = false, disabled = false } = {}) {
  const radix = attrs([`data-state="${checked ? "checked" : "unchecked"}"`, disabled && 'data-disabled=""']);
  const root = attrs([
    'type="button"',
    'role="radio"',
    `aria-checked="${checked}"`,
    radix,
    disabled && "disabled",
    `class="${radiomarkVariants({ size, tone })}"`,
  ]);
  return `<button ${root}><span ${radix} class="${radiomarkDotVariants({ size, tone })}"></span></button>`;
}

// <Radio> 한 줄 — <label> 이 동그라미와 라벨을 감싸, 라벨을 눌러도 동그라미가 반응한다(group/radio).
function radio({ label, size, tone, weight, checked, disabled } = {}) {
  const text = `<span class="${radioLabelVariants({ size, weight })}">${label}</span>`;
  return `<label class="${radioVariants({ size })}">${radiomark({ size, tone, checked, disabled })}${text}</label>`;
}

// <RadioGroup> — Radix 가 role="radiogroup" 을 단다. 고른 값(value)과 같은 선택지 하나만 선택이고,
// 묶음을 막으면(disabled) 모든 선택지가 막힌다. 이름은 aria-label 또는 aria-labelledby, 오류 글은 aria-describedby.
// 선택지는 { value, label, … } 다 — 줄은 <Radio>(radio)로 그리고, 동그라미만 쓰는 자리는 따로 짠 줄을 row 로 넘긴다.
function radioGroup(
  options,
  { value, disabled = false, row = radio, ariaLabel = "", labelledBy = "", describedBy = "", invalid = false } = {},
) {
  // 막힌 묶음은 aria-disabled 도 단다(레시피 RadioGroup — Field 의 막힘과 같다)
  const root = attrs([
    'role="radiogroup"',
    ariaLabel && `aria-label="${ariaLabel}"`,
    labelledBy && `aria-labelledby="${labelledBy}"`,
    describedBy && `aria-describedby="${describedBy}"`,
    invalid && 'aria-invalid="true"',
    disabled && 'aria-disabled="true" data-disabled=""',
    `class="${GROUP}"`,
  ]);
  const rows = options.map(({ value: own, ...option }) =>
    row({ ...option, checked: own === value, disabled: disabled || option.disabled }),
  );
  return `<div ${root}>${rows.join("")}</div>`;
}

// 캘린더 일정의 반복 선택지 — 오늘 제품에는 라벨만 있는 Radio 가 없어 이 선택지를 빌렸다(radio-group.md Guidelines)
const REPEAT = { none: "반복 없음", daily: "매일", weekly: "매주", monthly: "매월", yearly: "매년" };
const repeat = (values, props = {}) => values.map((value) => ({ value, label: REPEAT[value], ...props }));

// 동그라미는 보통 기본 레이어(흰 면) 위에 놓인다. 사이트 미리보기 칸의 바탕(bg-page = bg-layer-basement)은
// 비활성 동그라미의 채움(bg-disabled, gray-200)과 같은 색이라, 그 위에 바로 그리면 비활성 동그라미가 보이지 않는다.
const SURFACE =
  "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-x6);";
const surface = (html) => `<div style="${SURFACE}">${html}</div>`;

// 아래 끝을 맞춘다 — 높이가 다른 묶음을 나란히 둬도 이름표가 한 줄에 선다
const GALLERY = "display:flex; flex-wrap:wrap; align-items:flex-end; gap:var(--spacing-x5) var(--spacing-x8);";
const CAPTION =
  "font-size:var(--text-t2); line-height:var(--text-t2--line-height); font-weight:400; color:var(--color-fg-neutral-subtle);";
// 톤 · 속성 이름처럼 코드로 쓰는 이름표
const CODE = `${CAPTION} font-family:ui-monospace, SFMono-Regular, Menlo, monospace;`;
// 묶음 위 제목
const TITLE =
  "font-size:var(--text-t3); line-height:var(--text-t3--line-height); font-weight:700; color:var(--color-fg-neutral-muted);";

// 아래 이름표
function labeled(html, caption, style = CODE) {
  return `<div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--spacing-x2);">${html}<span style="${style}">${caption}</span></div>`;
}

// 제목 + 묶음(+ 아래 글) — 묶음은 aria-labelledby 로 이 제목을 가리킨다
function field(titleId, body) {
  return `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2);"><span id="${titleId}" style="${TITLE}">반복</span>${body}</div>`;
}

// ── 예제 ──────────────────────────────────────────────────────────────────

export const radioGroupExamples = [
  {
    title: "기본",
    description:
      "동그라미와 라벨을 한 줄로 묶은 Radio 를 RadioGroup 안에 세로로 쌓는다(줄 사이 12) — medium · neutral · regular 가 기본이다. 하나를 고르면 앞에 고른 것은 풀린다. 라벨을 눌러도 동그라미가 반응하고(호버 · 누름 색도 함께), 누르는 영역은 보이는 줄(32)보다 넓게 ::before 로 가로 · 세로 44 까지 넓힌다. 처음부터 하나를 골라 둘 수 있으면 골라 둔다(defaultValue). 묶음의 이름은 aria-label(보이는 제목이 있으면 aria-labelledby)로 단다. 예제의 선택지는 캘린더 일정의 반복 선택지를 빌린 것이다 — 오늘 제품에 라벨만 있는 Radio 는 없다.",
    jsx: `import { Radio, RadioGroup } from "@/components/ui/radio-group"

<RadioGroup defaultValue="none" aria-label="반복">
  <Radio value="none" label="반복 없음" />
  <Radio value="daily" label="매일" />
  <Radio value="weekly" label="매주" />
</RadioGroup>`,
    render: () => surface(radioGroup(repeat(["none", "daily", "weekly"]), { value: "none", ariaLabel: "반복" })),
  },

  {
    title: "크기 · 굵기",
    description:
      "크기는 동그라미 · 점 · 라벨 · 줄 높이를 함께 정한다. medium(동그라미 20 · 점 8 · 라벨 14 · 줄 32)이 기본이고 화면 안의 폼 · 설정에 쓴다. large(동그라미 24 · 점 10 · 라벨 16 · 줄 36)는 한 화면의 중심 선택, 모바일에서 홀로 서는 선택에 쓴다. 굵기는 라벨 굵기다 — regular(400)가 기본이고 강조할 때 bold(700)를 쓴다. 굵기는 크기와 따로 고른다. 누르는 영역은 두 크기 모두 44 까지 넓힌다.",
    jsx: `<RadioGroup defaultValue="medium" aria-label="크기">
  <Radio value="medium" size="medium" label="medium" />
  <Radio value="large" size="large" label="large" />
  <Radio value="bold" size="large" weight="bold" label="large · bold" />
</RadioGroup>`,
    render: () =>
      surface(
        radioGroup(
          [
            { value: "medium", size: "medium", label: "medium" },
            { value: "large", size: "large", label: "large" },
            { value: "bold", size: "large", weight: "bold", label: "large · bold" },
          ],
          { value: "medium", ariaLabel: "크기" },
        ),
      ),
  },

  {
    title: "톤",
    description:
      "선택했을 때의 색이다. neutral(짙은 회색)이 기본이고, brand 는 서비스 핵심 흐름에서만 쓴다 — 선택 컨트롤마다 브랜드 색을 깔면 브랜드 색 버튼이 설 자리가 없어진다. 선택하면 테두리 없이 원을 채우고 가운데에 채움과 대비되는 점이 선다(neutral 은 fg-neutral-inverted, brand 는 흰색). 선택 안 된 동그라미는 톤과 상관없다. 한 묶음 안에서 톤을 섞지 않는다. brand 는 페이지 위의 브랜드 전환(Desk · HR)을 따른다 — Default 에서는 회색 단계다.",
    jsx: `<RadioGroup defaultValue="monthly" aria-label="반복">
  <Radio value="monthly" label="매월" />
  <Radio value="yearly" label="매년" />
</RadioGroup>

<RadioGroup defaultValue="monthly" aria-label="반복">
  <Radio value="monthly" tone="brand" label="매월" />
  <Radio value="yearly" tone="brand" label="매년" />
</RadioGroup>`,
    render: () => {
      const col = (tone) =>
        radioGroup(repeat(["monthly", "yearly"], { tone }), { value: "monthly", ariaLabel: `반복 — ${tone}` });
      return surface(`<div style="${GALLERY}">
  ${labeled(col("neutral"), "neutral — 기본")}
  ${labeled(col("brand"), "brand — 핵심 흐름에서만")}
</div>`);
    },
  },

  {
    title: "값 다루기 · 비활성",
    description:
      "값은 묶음이 쥔다 — value · onValueChange 로 다루고(처음 값만 주려면 defaultValue), Radio 는 value 로 자기 값을 알린다. 선택지에 disabled 를 주면 그 선택지만 막히고, 묶음에 주면 모든 선택지가 막힌다 — 골라 둔 채로도 막을 수 있다. 비활성은 전용 색이다 — 선택 안 됨은 bg-disabled 채움 + stroke-neutral-weak 테두리, 선택은 채운 원 그대로 bg-disabled + fg-disabled 점이고, 라벨도 fg-disabled 가 된다. 불투명도로 흐리게 하지 않는다.",
    jsx: `const [repeat, setRepeat] = useState("monthly")

<RadioGroup value={repeat} onValueChange={setRepeat} aria-labelledby="repeat-title">
  <Radio value="none" label="반복 없음" />
  <Radio value="monthly" label="매월" />
  <Radio value="yearly" label="매년" disabled />
</RadioGroup>

// 묶음에 disabled 를 주면 모든 선택지가 막힌다 — 고른 선택지는 채운 원 그대로 색만 바뀐다
<RadioGroup value={repeat} onValueChange={setRepeat} aria-labelledby="repeat-title" disabled>
  <Radio value="none" label="반복 없음" />
  <Radio value="monthly" label="매월" />
  <Radio value="yearly" label="매년" />
</RadioGroup>`,
    render: () => {
      const one = radioGroup([...repeat(["none", "monthly"]), ...repeat(["yearly"], { disabled: true })], {
        value: "monthly",
        labelledBy: "radio-ex-value-title",
      });
      const all = radioGroup(repeat(["none", "monthly", "yearly"]), {
        value: "monthly",
        disabled: true,
        labelledBy: "radio-ex-disabled-title",
      });
      return surface(`<div style="${GALLERY}">
  ${labeled(field("radio-ex-value-title", one), "Radio disabled — 선택지 하나")}
  ${labeled(field("radio-ex-disabled-title", all), "RadioGroup disabled — 묶음 전체")}
</div>`);
    },
  },

  {
    title: "오류",
    description:
      "묶음을 Field 로 감싼다 — Field 의 라벨이 묶음의 이름(aria-labelledby), 오류 글이 묶음의 설명(aria-describedby)이 되고 묶음(radiogroup)에 aria-invalid 가 걸린다(필수면 aria-required). 오류가 나도 동그라미 모양은 바꾸지 않는다 — 동그라미마다 빨간 테두리를 두르지 않고, 묶음 아래에 무엇을 해야 하는지 글(fg-critical · 아이콘)로 알린다. 처음부터 하나를 골라 두면 오류가 날 일이 없다 — 골라 둘 수 없는 선택(사용자가 꼭 스스로 골라야 하는)에만 쓴다. 검사는 제출할 때 한다 — 누르는 동안에는 띄우지 않는다.",
    jsx: `<Field label="반복" invalid errorMessage="반복을 골라 주세요.">
  <RadioGroup>
    <Radio value="none" label="반복 없음" />
    <Radio value="monthly" label="매월" />
  </RadioGroup>
</Field>`,
    render: () => {
      // Field(field.tsx) — 묶음이면 라벨은 <span id> 이고 묶음이 aria-labelledby 로 가리킨다. 오류 글은 aria-hidden(화면 밖 알림 자리가 읽는다)
      const id = "radio-ex-error";
      const error = "반복을 골라 주세요.";
      const header = `<div data-slot="field-header" class="${FIELD_HEADER}"><span id="${id}-label" class="${FIELD_LABEL} ${FIELD_LABEL_WEIGHT.medium}">반복</span></div>`;
      const group = radioGroup(repeat(["none", "monthly"]), { labelledBy: `${id}-label`, describedBy: `${id}-error`, invalid: true });
      const footer = `<div data-slot="field-footer" class="${FIELD_FOOTER}"><p id="${id}-error" aria-hidden="true" class="${FIELD_ERROR}" style="${P_FIX_ERROR}">${CIRCLE_ALERT}<span class="${FIELD_TEXT}">${error}</span></p></div>`;
      return surface(
        `<div data-slot="field" data-invalid="true" class="${FIELD_ROOT}">${header}${group}${footer}<span class="sr-only" aria-live="polite">${error}</span></div>`,
      );
    },
  },

  {
    title: "동그라미만",
    description:
      "라벨을 따로 짜는 자리에는 동그라미(Radiomark)만 넣는다 — Radiomark 도 RadioGroup 안에서만 쓴다. 줄을 <label> 로 감싸 줄 어디를 눌러도 고르게 한다 — 누르는 영역은 동그라미가 아니라 줄이 맡고, 동그라미의 이름도 그 <label> 의 글자에서 온다(감싸지 않으면 aria-label 을 반드시 단다). 줄에 group/radio 를 달면 줄을 누르거나 올려도 동그라미가 누름 색 · 축소로 반응한다. 미리보기는 같은 줄을 선택지마다 하나씩 둔 모습이다.",
    jsx: `import { Radiomark, RadioGroup } from "@/components/ui/radio-group"

<RadioGroup defaultValue="none" aria-label="반복">
  <label className="group/radio flex cursor-pointer items-center gap-x3 px-x6 py-x3">
    <span className="flex-1">반복 없음</span>
    <Radiomark value="none" />
  </label>
</RadioGroup>`,
    render: () => {
      const list =
        "max-width:360px; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4);";
      const text =
        "flex:1; font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
      // 코드의 줄(flex cursor-pointer items-center gap-x3 px-x6 py-x3)을 같은 값의 인라인 스타일로 그린다 — 클래스는 group/radio 만 남긴다
      const row = ({ label, checked, disabled }) =>
        `<label class="group/radio" style="display:flex; cursor:pointer; align-items:center; gap:var(--spacing-x3); padding:var(--spacing-x3) var(--spacing-x6);"><span style="${text}">${label}</span>${radiomark({ checked, disabled })}</label>`;
      return `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2);">
  <span style="${CAPTION}">줄 전체가 누르는 영역</span>
  <div style="${list}">${radioGroup(repeat(["none", "daily", "weekly", "monthly"]), { value: "none", ariaLabel: "반복", row })}</div>
</div>`;
    },
  },
];
