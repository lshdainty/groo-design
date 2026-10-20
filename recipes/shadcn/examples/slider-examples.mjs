/*
 * shadcn Slider 예제 — docs site components/slider.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 셋(설정 — 예산 알림 임계값 · 2 ~ 5단계 — 별점 · 범위)은 차례 · 제목 · 코드가
 * specs/components/slider.md 의 "코드" 절과 같다. 구조는 SEED Slider(트랙 · 채움 · 손잡이 · 눈금 · 표식 · 말풍선) — 모양은 SEED 의 무채색
 * 그대로이고, 손잡이 줄 44 · 머리 값 · 손을 뗄 때 저장 · APG 키보드는 groo 가 정했다(2026-10-09). 옛 예제(브랜드 채움 · 흰 손잡이 16 +
 * 2px 브랜드 테두리 + 그림자 · Label 옆 "68%" 를 손으로 조립)를 대신한다.
 *
 * ROOT · CONTROL · TRACK · FILL · THUMB* · INDICATOR* · MARKER* · SLIDER_VALUE 는 recipes/shadcn/components/ui/slider.tsx 의 JSX 에 적힌
 * 클래스와, INSET · ARROW_PATH · tickMask 는 그 파일의 상수 · 함수와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다.
 * 둘레의 FIELD_* 는 field.tsx 의 것이다 — field-examples.mjs 의 것과 같다.
 * 규칙은 specs/components/slider.md, 수치 원본은 specs/components/slider.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — <div data-slot="slider" data-ticks> > 손잡이 줄 <div data-slot="slider-control">(44) > 트랙
 * <div data-slot="slider-track">(채움 <div data-slot="slider-fill"> — 2 ~ 5 구간이면 트랙을 마스크로 끊어 틈 4) · 손잡이 자리
 * <span data-slot="slider-thumb-anchor">(손잡이 <span role="slider"> · 말풍선 <span data-slot="slider-value-indicator">) · 표식
 * <div data-slot="slider-markers">. 머리 값 <span data-slot="slider-value"> 은 Field 머리의 보조 액션 자리(field-header-action)다.
 * 레시피의 스크립트(끌기 · 누르기 · 키보드 · 키보드로 왔는지 가리기 · 말풍선 상자를 트랙 안으로 밀기 · 저장)는 정적 HTML 에 없다 — 손잡이를
 * 눌러도 값은 그대로이고, Tab 으로 와도 링이 뜨지 않는다(링은 레시피가 키보드 초점에만 다는 data-focus-visible 에 걸린다). 말풍선 · 링은
 * "끄는 동안" · "키보드 포커스" 그림에만 그 순간을 멈춰 그렸다(상자 자리는 미리 재 두었다). Field 의 라벨이 손잡이의 이름(aria-labelledby)이다.
 * id 는 레시피의 useId 자리다 — 예제마다 앞말을 달리해 한 페이지에서 겹치지 않게 한다.
 */

// ── slider.tsx 의 상수 · 함수와 같은 값 ──────────────────────────────────

// 손잡이 반지름 — 손잡이 가운데가 트랙 양 끝에서 이만큼 들어온 자리까지만 간다
const INSET = 10;
// 말풍선 화살표 — 8 × 6, 아래를 가리키고 끝을 둥글린다(SEED 모서리 2)
const ARROW_PATH = "M0 0H8L4.67 5A0.8 0.8 0 0 1 3.33 5Z";
// 단계 자리 — 진행 비율(0 ~ 1) 계산의 길이 식. CSS 의 % 는 손잡이 줄(= 트랙) 폭이다
const at = (p) => `calc(${INSET}px + (100% - ${INSET * 2}px) * ${p})`;

// 눈금 — 양 끝을 뺀 단계 자리마다 폭 4 의 틈. 트랙(채움 포함)을 마스크로 끊어 놓인 표면이 비치게 한다
function tickMask(intervals) {
  const stops = [];
  let from = "0px";
  for (let k = 1; k < intervals; k++) {
    const x = `${INSET}px + (100% - ${INSET * 2}px) * ${k} / ${intervals}`;
    stops.push(`#000 ${from} calc(${x} - 2px)`, `transparent calc(${x} - 2px) calc(${x} + 2px)`);
    from = `calc(${x} + 2px)`;
  }
  stops.push(`#000 ${from} 100%`);
  return `linear-gradient(to right, ${stops.join(", ")})`;
}

// ── slider.tsx 의 JSX 에 적힌 클래스 ────────────────────────────────────

// 위 24 — 말풍선 자리(Field 머리 ↔ 손잡이 줄 32). 누르는 자리는 손잡이 줄 44 그대로
const ROOT = "relative flex w-full min-w-0 select-none flex-col gap-x0_5 pt-x6 font-sans";
const CONTROL = "relative h-11 w-full touch-none";
const CONTROL_CURSOR = { disabled: "cursor-not-allowed", dragging: "cursor-grabbing", idle: "cursor-pointer" };
const TRACK = "absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full";
const TRACK_COLOR = { disabled: "bg-bg-disabled", enabled: "bg-stroke-neutral-weak" };
const FILL = "absolute inset-y-0";
const FILL_COLOR = { disabled: "bg-fg-disabled", enabled: "bg-fg-neutral" };
const FILL_JUMP = "[transition:inset-inline-start_var(--motion-duration-d3)_var(--motion-ease-easing),width_var(--motion-duration-d3)_var(--motion-ease-easing)] motion-reduce:transition-none";
const THUMB_ANCHOR = "absolute inset-y-0 w-0";
const THUMB_ANCHOR_TOP = "z-[1]";
const THUMB_ANCHOR_JUMP = "[transition:inset-inline-start_var(--motion-duration-d3)_var(--motion-ease-easing)] motion-reduce:transition-none";
const THUMB = "absolute left-0 top-1/2 block size-5 -translate-x-1/2 -translate-y-1/2 rounded-full";
const THUMB_STATE = {
  disabled: "cursor-not-allowed bg-fg-disabled",
  dragging: "cursor-grabbing bg-bg-neutral-inverted",
  idle: "cursor-grab bg-bg-neutral-inverted",
};
const THUMB_MOTION = "[transition:scale_var(--motion-duration-d3)_var(--motion-ease-easing)] motion-reduce:transition-none data-[pressed]:[scale:1.2]";
// 키보드 포커스에만 링 — :focus-visible 이 아니라 키보드로 왔을 때(레시피의 trackInput 이 data-focus-visible 을 단다)
const THUMB_FOCUS = "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-solid data-[focus-visible]:outline-stroke-focus-ring";
const INDICATOR = "pointer-events-none absolute left-0 top-0 size-0";
const INDICATOR_STATE = {
  open: "opacity-100 [scale:1] [translate:0_0] [transition:opacity_var(--motion-duration-d4)_var(--motion-ease-enter),translate_var(--motion-duration-d4)_var(--motion-ease-enter),scale_var(--motion-duration-d4)_var(--motion-ease-enter)]",
  closed: "opacity-0 [scale:0.9] [translate:0_5px] [transition:opacity_var(--motion-duration-d4)_var(--motion-ease-easing),translate_var(--motion-duration-d4)_var(--motion-ease-easing),scale_0s_linear_var(--motion-duration-d4)]",
};
const INDICATOR_REDUCE = "motion-reduce:[scale:1] motion-reduce:[translate:0_0] motion-reduce:[transition-property:opacity]";
const INDICATOR_BOX = "absolute bottom-0 left-0 block min-w-6 whitespace-nowrap rounded-r1_5 bg-bg-neutral-inverted px-x2 py-x1 text-center text-t3 font-medium tabular-nums text-fg-neutral-inverted";
const INDICATOR_ARROW = "absolute left-0 top-0 block -translate-x-1/2 fill-bg-neutral-inverted";
const MARKERS = "relative h-[var(--text-t3--line-height)] text-t3";
const MARKERS_COLOR = { disabled: "text-fg-disabled", enabled: "text-fg-neutral-muted" };
const MARKER = "absolute top-0 whitespace-nowrap";
const MARKER_MIDDLE = "-translate-x-1/2 rtl:translate-x-1/2";
// 머리 값(SliderValue) — Field 머리 오른쪽, 16 / 22 · 700 · 고정폭 숫자
const SLIDER_VALUE = "whitespace-nowrap font-sans text-t5 font-bold tabular-nums";
const SLIDER_VALUE_COLOR = { disabled: "text-fg-disabled", enabled: "text-fg-neutral" };

// ── field.tsx 의 클래스 ───────────────────────────────────────────────────

const FIELD_ROOT = "flex w-full min-w-0 flex-col gap-x2";
const FIELD_HEADER = "flex items-center justify-between gap-x2_5 px-x0_5";
const FIELD_LABEL = "min-w-0 font-sans text-t5 text-fg-neutral";
const FIELD_LABEL_WEIGHT = { medium: "font-medium", bold: "font-bold" };
const FIELD_ACTION = "-my-[5px] ml-auto flex shrink-0 items-center";
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

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cls = (...list) => list.filter(Boolean).join(" ");
const CIRCLE_ALERT = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="' + FIELD_ERROR_ICON + '"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>';

// <Slider> · <RangeSlider> — 레시피가 그리는 DOM. pressed 는 그 순간을 멈춘 끌기(손잡이 24 · 말풍선 · data-dragging) — shift 는 말풍선 상자를 민 거리(px)
//   ids  { label, describedby, auto } — Field 의 라벨 id(손잡이 이름) · 설명 · 오류 id · 레시피의 useId 자리(범위 손잡이 이름 글)
function slider({ min = 0, max = 100, step = 1, values, format = (v) => String(v), disabled = false, invalid = false, pressed = -1, focused = -1, shift = 0, ids = {}, thumbLabels = ["최소", "최대"] }) {
  const span = max - min;
  const intervals = span / step;
  const discrete = Number.isInteger(Math.round(intervals * 1e9) / 1e9) && intervals >= 2 && intervals <= 5;
  const stepCount = Math.round(intervals);
  const ratio = (v) => (span > 0 ? (Math.min(max, Math.max(min, v)) - min) / span : 0);
  const range = values.length > 1;
  const dragging = pressed >= 0;
  const p0 = ratio(values[0]);
  const p1 = range ? ratio(values[1]) : p0;
  const fillStyle = range ? `inset-inline-start: ${at(p0)}; width: calc((100% - ${INSET * 2}px) * ${p1 - p0})` : `inset-inline-start: 0; width: ${at(p0)}`;
  const mask = discrete ? tickMask(stepCount) : "";
  const top = values.length - 1;
  const thumbs = values
    .map((v, i) => {
      const thumbName = range ? thumbLabels[i] : null;
      const name = thumbName == null ? `aria-labelledby="${ids.label}"` : `aria-labelledby="${ids.label} ${ids.auto}thumb${i}"`;
      const shown = !disabled && (pressed === i || focused === i);
      const thumb = `<span ${attrs([
        'role="slider"',
        'data-slot="slider-thumb"',
        `data-index="${i}"`,
        pressed === i && 'data-pressed="true"',
        !disabled && focused === i && 'data-focus-visible="true"',
        !disabled && 'tabindex="0"',
        'aria-orientation="horizontal"',
        `aria-valuemin="${min}"`,
        `aria-valuemax="${max}"`,
        `aria-valuenow="${v}"`,
        `aria-valuetext="${esc(format(v))}"`,
        disabled && 'aria-disabled="true"',
        invalid && 'aria-invalid="true"',
        ids.describedby && `aria-describedby="${ids.describedby}"`,
        name,
        `class="${cls(THUMB, disabled ? THUMB_STATE.disabled : pressed === i ? THUMB_STATE.dragging : THUMB_STATE.idle, THUMB_MOTION, THUMB_FOCUS)}"`,
      ])}></span>`;
      const hiddenName = thumbName != null ? `<span id="${ids.auto}thumb${i}" hidden>${esc(thumbName)}</span>` : "";
      const indicator = `<span aria-hidden="true" data-slot="slider-value-indicator" data-state="${shown ? "open" : "closed"}" class="${cls(INDICATOR, shown ? INDICATOR_STATE.open : INDICATOR_STATE.closed, INDICATOR_REDUCE)}"><span data-slot="slider-value-indicator-box" class="${INDICATOR_BOX}" style="translate: calc(-50% + ${shown ? shift : 0}px) 0">${esc(format(v))}</span><svg data-slot="slider-value-indicator-arrow" width="8" height="6" viewBox="0 0 8 6" class="${INDICATOR_ARROW}"><path d="${ARROW_PATH}"/></svg></span>`;
      return `<span data-slot="slider-thumb-anchor" class="${cls(THUMB_ANCHOR, top === i && THUMB_ANCHOR_TOP, !dragging && THUMB_ANCHOR_JUMP)}" style="inset-inline-start: ${at(ratio(v))}">${thumb}${hiddenName}${indicator}</span>`;
    })
    .join("");
  const markers = discrete ? Array.from({ length: stepCount + 1 }, (_, k) => min + k * step) : [min, max];
  const markerHtml = markers
    .map((m, k) => {
      const last = k === markers.length - 1;
      const style = k === 0 ? "inset-inline-start: 0" : last ? "inset-inline-end: 0" : `inset-inline-start: ${at(k / stepCount)}`;
      return `<span data-slot="slider-marker" class="${cls(MARKER, k > 0 && !last && MARKER_MIDDLE)}" style="${style}">${esc(format(m))}</span>`;
    })
    .join("");
  return `<div ${attrs([
    'data-slot="slider"',
    disabled && 'data-disabled="true"',
    dragging && 'data-dragging="true"',
    `data-ticks="${discrete ? "discrete" : "none"}"`,
    `class="${ROOT}"`,
  ])}><div data-slot="slider-control" class="${cls(CONTROL, disabled ? CONTROL_CURSOR.disabled : dragging ? CONTROL_CURSOR.dragging : CONTROL_CURSOR.idle)}"><div data-slot="slider-track" class="${cls(TRACK, disabled ? TRACK_COLOR.disabled : TRACK_COLOR.enabled)}"${mask ? ` style="mask-image: ${mask}; -webkit-mask-image: ${mask}"` : ""}><div data-slot="slider-fill" class="${cls(FILL, disabled ? FILL_COLOR.disabled : FILL_COLOR.enabled, !dragging && FILL_JUMP)}" style="${fillStyle}"></div></div>${thumbs}</div><div aria-hidden="true" data-slot="slider-markers" class="${cls(MARKERS, disabled ? MARKERS_COLOR.disabled : MARKERS_COLOR.enabled)}">${markerHtml}</div></div>`;
}

// <Field label headerAction={<SliderValue>} description invalid errorMessage> — 슬라이더는 묶음이라 라벨이 <span id> 다(useFieldGroup)
function field({ id, label, value, description = "", invalid = false, error = "", disabled = false, control }) {
  const ids = { label: `${id}label`, description: `${id}description`, error: `${id}error` };
  const showError = invalid && error;
  const describedby = showError ? ids.error : description ? ids.description : "";
  const head = `<div data-slot="field-header" class="${FIELD_HEADER}"><span id="${ids.label}" class="${cls(FIELD_LABEL, FIELD_LABEL_WEIGHT.medium)}">${esc(label)}</span><div data-slot="field-header-action" class="${FIELD_ACTION}"><span aria-hidden="true" data-slot="slider-value"${disabled ? ' data-disabled="true"' : ""} class="${cls(SLIDER_VALUE, disabled ? SLIDER_VALUE_COLOR.disabled : SLIDER_VALUE_COLOR.enabled)}">${esc(value)}</span></div></div>`;
  const footer = showError
    ? `<div data-slot="field-footer" class="${FIELD_FOOTER}"><p id="${ids.error}" aria-hidden="true" class="${FIELD_ERROR}" style="${P_FIX.error}">${CIRCLE_ALERT}<span class="${FIELD_TEXT}">${esc(error)}</span></p></div>`
    : description
      ? `<div data-slot="field-footer" class="${FIELD_FOOTER}"><p id="${ids.description}" class="${FIELD_DESCRIPTION}" style="${P_FIX.description}"><span class="${FIELD_TEXT}">${esc(description)}</span></p></div>`
      : "";
  return `<div ${attrs(['data-slot="field"', invalid && 'data-invalid="true"', disabled && 'data-disabled="true"', `class="${FIELD_ROOT}"`])}>${head}${control({ label: ids.label, describedby, auto: `${id}slider-` })}${footer}<span class="sr-only" aria-live="polite">${showError ? esc(error) : ""}</span></div>`;
}

const pct = (v) => `${v}%`;
const pts = (v) => `${v}점`;
// 견본 틀 — 흰 표면 위(설정 화면 · 폼), 폰 폭(390 − 좌우 24 = 342)
const CAPTION = "display:block; margin:0 0 var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); font-weight:700; color:var(--color-fg-neutral-subtle);";
const frame = (items) =>
  `<div style="display:flex; flex-direction:column; gap:var(--spacing-x8); max-width:390px; box-sizing:border-box; padding:var(--spacing-x6); border-radius:var(--radius-r4); background:var(--color-bg-layer-default); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle);">${items
    .map(([caption, html]) => `<div><span style="${CAPTION}">${esc(caption)}</span>${html}</div>`)
    .join("")}</div>`;
const threshold = (id, value, opts = {}) =>
  field({
    id,
    label: "예산 알림 임계값",
    value: pct(value),
    description: "예산 사용률이 이 값을 넘으면 알려줘요.",
    error: "저장하지 못했어요. 값을 되돌렸어요 — 다시 해주세요.",
    ...opts,
    control: (ids) => slider({ min: 50, max: 100, step: 5, values: [value], format: pct, pressed: opts.pressed ?? -1, focused: opts.focused ?? -1, invalid: !!opts.invalid, ids }),
  });

// ── 예제 ──────────────────────────────────────────────────────────────────

export const sliderExamples = [
  {
    title: "설정 — 예산 알림 임계값",
    description:
      "정해진 범위에서 값을 끌어 고르는 컨트롤이다 — 모양은 SEED 의 무채색: 트랙 4 stroke-neutral-weak · 채움 fg-neutral · 손잡이 원 20 bg-neutral-inverted(테두리 · 그림자 없음, 끄는 동안 24), 손잡이 줄 44 전체가 누르는 자리다. 지금 값은 Field 머리 오른쪽(SliderValue — 16 / 22 · 700 · 고정폭 숫자)에 늘 두고, 끄는 동안 · 마우스를 올렸을 때 · 키보드 포커스일 때 손잡이 위 12 에 말풍선(13 / 18 · 500)이 뜨며(손잡이 줄 위 24 가 그 자리라 Field 머리를 덮지 않는다 — 머리 ↔ 손잡이 줄 32), 아래 2 에 양 끝 표식(13 / 18 · fg-neutral-muted)이 있다 — 셋 다 formatValue 의 글이고 보조 기술에는 손잡이의 aria-valuetext(\"80%\")만 읽힌다. 누르는 순간 적용되는 설정은 끄는 동안 화면만 따라가고 손을 뗄 때 한 번 저장한다(onValueCommit — 키보드는 키마다 한 번). 요청 중에도 막지 않고, 실패하면 값을 되돌리고 Field 꼬리에 알린다(오류 글이 설명을 대신한다).",
    jsx: `import { useState } from "react"
import { Field } from "@/components/ui/field"
import { Slider, SliderValue } from "@/components/ui/slider"

const [threshold, setThreshold] = useState(80) // 화면 값 — 끄는 동안 바로 따라간다
const [saved, setSaved] = useState(80) // 마지막으로 저장된 값
const [failed, setFailed] = useState(false)

// 손을 뗄 때 한 번 — 요청 중에도 막지 않는다. 실패하면 되돌리고 그 자리에 오류
const commit = (value: number) => {
  setFailed(false)
  updatePreferences({ budgetAlertThreshold: value }).then(
    () => setSaved(value),
    () => {
      setThreshold(saved)
      setFailed(true)
    },
  )
}

<Field
  label="예산 알림 임계값"
  headerAction={<SliderValue>{threshold}%</SliderValue>}
  description="예산 사용률이 이 값을 넘으면 알려줘요."
  invalid={failed}
  errorMessage="저장하지 못했어요. 값을 되돌렸어요 — 다시 해주세요."
>
  <Slider min={50} max={100} step={5} value={threshold} onValueChange={setThreshold} onValueCommit={commit} formatValue={(v) => \`\${v}%\`} />
</Field>`,
    render: () =>
      frame([
        ["가만히 — 머리 값 80%", threshold("sld-ex-1a-", 80)],
        ["끄는 동안 — 손잡이 24 + 말풍선", threshold("sld-ex-1b-", 65, { pressed: 0 })],
        ["키보드 포커스 — 링 2 · 띄움 2 + 말풍선", threshold("sld-ex-1d-", 85, { focused: 0 })],
        ["저장 실패 — 되돌리고 그 자리에 오류", threshold("sld-ex-1c-", 80, { invalid: true })],
      ]),
  },

  {
    title: "2 ~ 5단계 — 별점",
    description:
      "구간((max − min) ÷ step)이 2 ~ 5개면 레시피가 스스로 눈금을 그린다 — 양 끝을 뺀 단계 자리마다 트랙 · 채움을 끊는 틈 4(마스크라 놓인 표면이 비친다 — 시트 · 팝오버 위에서도 그대로)와 단계마다 표식(끝 둘은 끝에 맞추고 가운데는 단계 자리 가운데). 별점 1 ~ 5 는 구간 4 · 틈 3 · 표식 5 이고 손잡이는 단계 자리에만 선다. 6개 이상이면 눈금 없이 양 끝 표식만 둔다. 폼 안의 슬라이더는 폼의 값이라 손을 떼도 보내지 않는다(onValueCommit 없음) — 폼의 저장 버튼이 반영한다.",
    jsx: `import { Field } from "@/components/ui/field"
import { Slider, SliderValue } from "@/components/ui/slider"

<Field label="만족도" headerAction={<SliderValue>{score}점</SliderValue>}>
  {/* 폼의 값 — 손을 떼도 보내지 않는다(onValueCommit 없음). 폼의 저장 버튼이 반영한다 */}
  <Slider min={1} max={5} value={score} onValueChange={setScore} formatValue={(v) => \`\${v}점\`} />
</Field>`,
    render: () =>
      frame([
        ["만족도 4점 — 구간 4 · 틈 3 · 표식 5", field({ id: "sld-ex-2a-", label: "만족도", value: pts(4), control: (ids) => slider({ min: 1, max: 5, step: 1, values: [4], format: pts, ids }) })],
        ["끄는 동안 — 단계 자리에만 선다", field({ id: "sld-ex-2b-", label: "만족도", value: pts(3), control: (ids) => slider({ min: 1, max: 5, step: 1, values: [3], format: pts, pressed: 0, ids }) })],
      ]),
  },

  {
    title: "범위",
    description:
      "값 둘(RangeSlider)은 두 손잡이 사이를 채우고 서로를 넘지 않는다 — value · onValueChange · onValueCommit 이 [최소, 최대] 다. 손잡이마다 이름이 다르다 — \"{라벨} 최소\" · \"{라벨} 최대\"(thumbLabels 로 \"시작\" · \"끝\" 처럼 바꿀 수 있다). 트랙을 누르면 가장 가까운 손잡이가 그 자리로 건너뛰고, 키보드의 Home · End 는 다른 손잡이 값까지다. 머리 값은 \"30% ~ 70%\" 다. 지금 제품에 범위 슬라이더는 없다.",
    jsx: `import { Field } from "@/components/ui/field"
import { RangeSlider, SliderValue } from "@/components/ui/slider"

<Field label="예산 사용률" headerAction={<SliderValue>{usage[0]}% ~ {usage[1]}%</SliderValue>}>
  {/* 손잡이 이름 — "예산 사용률 최소" · "예산 사용률 최대" */}
  <RangeSlider min={0} max={100} step={10} value={usage} onValueChange={setUsage} formatValue={(v) => \`\${v}%\`} />
</Field>`,
    render: () =>
      frame([
        ["예산 사용률 30% ~ 70%", field({ id: "sld-ex-3a-", label: "예산 사용률", value: "30% ~ 70%", control: (ids) => slider({ min: 0, max: 100, step: 10, values: [30, 70], format: pct, ids }) })],
        ["최대 손잡이를 끄는 동안 — 움직이는 손잡이 위에만 말풍선", field({ id: "sld-ex-3b-", label: "예산 사용률", value: "30% ~ 80%", control: (ids) => slider({ min: 0, max: 100, step: 10, values: [30, 80], format: pct, pressed: 1, ids }) })],
      ]),
  },
];
