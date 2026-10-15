/*
 * shadcn Quantity Picker 예제 — docs site components/quantity-picker.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 셋(폼 — 승인 필요 횟수 · 표 칸 — 소요시간 · 지우기 · 로딩)은 차례 · 제목 · 코드가
 * specs/components/quantity-picker.md 의 "코드" 절과 같고, 뒤의 둘(세 크기 · 끝 · 오류 · 막힘)은 md 의 Properties 를 코드로 더 보인다.
 * 구조는 당근 SEED Quantity Picker(seed-design.io/components/quantity-picker — rootage quantity-picker · quantity-picker-button, Apache-2.0)를 따른다 —
 * 테두리 상자 안에 줄이기 · 선 · 값 · 선 · 늘리기, 세 크기 36 · 40 · 52, 값 칸은 보기만, 지우기 · 로딩(2026-10-15 사용자 결정 1A · 2A · 3A).
 * 웹의 기본 크기 responsive · 누르는 자리 44 · 끝의 aria-disabled 는 porest 가 정했다. porest 에 처음 두는 예제다.
 *
 * ROOT · ROOT_SIZE · ROOT_LAYOUT · BUTTON · BUTTON_SIZE · DIVIDER · VALUE · VALUE_SIZE · VALUE_PLACEHOLDER · VALUE_TEXT 는
 * recipes/shadcn/components/ui/quantity-picker.tsx 의 상수와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 로딩 원의 PC_* 는 progress-circle.tsx 의
 * 상수(button-examples.mjs 의 것과 같다), 칸 둘레의 FIELD_* 는 field.tsx 의 클래스(icon-picker-examples.mjs 의 것과 같다)다. quantity-picker.tsx 는
 * cn() 으로 합치지만 지워지는 클래스가 없다 — 그래서 그대로 잇는다. 규칙은 specs/components/quantity-picker.md, 수치 원본은 quantity-picker.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 상자 <div role="group" data-slot="quantity-picker" data-size data-layout> > 줄이기 <button data-slot="quantity-picker-decrement"> ·
 * 선 <span aria-hidden data-slot="quantity-picker-divider"> · 값 <span data-slot="quantity-picker-value" aria-live="polite" aria-atomic="true">(숨긴 자리 글 + 지금 값) ·
 * 선 · 늘리기 <button data-slot="quantity-picker-increment"> · 숨은 입력 <input type="hidden" data-slot="quantity-picker-input">(name 을 줄 때만).
 * Field 안이면 Field 의 라벨(<span> — 묶음)이 이름(aria-labelledby), 설명이 묶음의 설명(aria-describedby)이다 — id 는 레시피가 useId 로 만든다(미리보기는 읽을 수 있는
 * 이름으로 미리 이었다). 레시피의 스크립트(− · + 로 값 바꾸기 · 끝에서 aria-disabled · 지우기 · 되풀이 키 버리기)는 정적 HTML 에 없다 — 미리보기를 눌러도 값은 그대로다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── quantity-picker.tsx 의 상수와 같은 값 ─────────────────────────────────

// 상자 — 안쪽 1px 테두리(오류는 2px). 크기마다 높이 · 모서리
const ROOT =
  "relative inline-flex shrink-0 items-center bg-bg-layer-default font-sans shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] data-[invalid]:shadow-[inset_0_0_0_2px_var(--color-stroke-critical-solid)]";
const ROOT_SIZE = {
  small: "h-9 rounded-r2",
  medium: "h-10 rounded-r2",
  large: "h-13 rounded-r3",
  responsive: "h-13 rounded-r3 lg:h-10 lg:rounded-r2",
};
// hug — 내용 폭(Field 같은 세로 Flex 안에서도 늘어나지 않는다) · fill — 부모 Flex 의 남은 폭(세로 Flex 면 칸 폭)
const ROOT_LAYOUT = {
  hug: "w-fit",
  fill: "grow",
};

// 버튼 — 정사각 · 투명. 누르는 자리 44(::before — 보이는 상자보다 작을 때만 넓힌다, 52 는 그대로).
// 끝 · 읽기 전용(aria-disabled) · 막힘(disabled)은 바탕 · 축소 없이 아이콘만 fg-disabled. 로딩(aria-busy)은 누름 바탕 + 원
const BUTTON = [
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center bg-transparent text-fg-neutral",
  "before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "aria-disabled:cursor-not-allowed aria-disabled:text-fg-disabled aria-disabled:hover:bg-transparent aria-disabled:active:bg-transparent aria-disabled:active:[scale:1]",
  "disabled:cursor-not-allowed disabled:text-fg-disabled disabled:hover:bg-transparent disabled:active:bg-transparent disabled:active:[scale:1]",
  "aria-busy:cursor-progress aria-busy:bg-bg-layer-default-pressed aria-busy:hover:bg-bg-layer-default-pressed aria-busy:active:[scale:1]",
  // 로딩 원 — 두께 2 · 트랙 gray-500 · 호 fg-neutral(크기는 size 마다 --progress-size)
  "[--progress-thickness:2px] [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
].join(" ");
const BUTTON_SIZE = {
  small: "size-9 rounded-r2 [--press-basis:36] [--progress-size:16px] [&>svg]:size-4",
  medium: "size-10 rounded-r2 [--press-basis:40] [--progress-size:18px] [&>svg]:size-[18px]",
  large: "size-13 rounded-r3 [--press-basis:52] [--progress-size:22px] [&>svg]:size-[22px]",
  responsive:
    "size-13 rounded-r3 [--press-basis:52] [--progress-size:22px] [&>svg]:size-[22px] lg:size-10 lg:rounded-r2 lg:[--press-basis:40] lg:[--progress-size:18px] lg:[&>svg]:size-[18px]",
};

// 선 — 1px × 16, 장식
const DIVIDER = "h-x4 w-px shrink-0 bg-stroke-neutral-subtle";

// 값 칸 — 보기만(누르기 · 초점 · 치기 없음). 숨긴 자리 글과 지금 값을 한 칸(격자 1 × 1)에 겹쳐 가장 넓은 글의 폭을 잡는다
const VALUE =
  "pointer-events-none grid shrink-0 grow select-none items-center justify-center px-x2 font-medium tabular-nums text-fg-neutral data-[disabled]:text-fg-disabled";
const VALUE_SIZE = {
  small: "text-t5",
  medium: "text-t5",
  large: "text-t6",
  responsive: "text-t6 lg:text-t5",
};
const VALUE_PLACEHOLDER = "invisible col-start-1 row-start-1 whitespace-nowrap text-center";
const VALUE_TEXT = "col-start-1 row-start-1 whitespace-nowrap text-center";

// ── progress-circle.tsx 의 상수와 같은 값 — 버튼 안의 로딩 원(size · tone inherit) ─────────

const PC_SIZE = {
  inherit: "[--pc-size:var(--progress-size,1em)] [--pc-thickness:var(--progress-thickness,2px)]",
};
const PC_TONE = {
  inherit:
    "[--pc-track:var(--progress-track,color-mix(in_srgb,currentColor_30%,transparent))] [--pc-range:var(--progress-range,currentColor)]",
};
const PC_ROOT = "inline-block shrink-0 overflow-visible align-middle";
const PC_SPIN = "animate-[porest-progress-circle-rotate_1200ms_cubic-bezier(0.35,0.25,0.65,0.75)_infinite] motion-reduce:animate-none";
const PC_CIRCLE =
  "fill-none [cx:calc(var(--pc-size)/2)] [cy:calc(var(--pc-size)/2)] [r:calc(var(--pc-size)/2_-_var(--pc-thickness)/2)] [stroke-width:var(--pc-thickness)]";
const PC_TRACK = `${PC_CIRCLE} [stroke:var(--pc-track)]`;
const PC_RANGE = `${PC_CIRCLE} [stroke:var(--pc-range)] [stroke-linecap:round] [transform-box:fill-box] [transform-origin:center] [transform:rotate(-90deg)]`;
const PC_RANGE_INDETERMINATE = [
  "animate-[porest-progress-circle-head_1200ms_cubic-bezier(0.35,0,0.65,1)_infinite,porest-progress-circle-tail_1200ms_cubic-bezier(0.35,0,0.65,0.6)_infinite]",
  "motion-reduce:animate-none motion-reduce:[stroke-dasharray:75_200]",
].join(" ");
const PC_KEYFRAMES = [
  "@keyframes porest-progress-circle-rotate { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }",
  "@keyframes porest-progress-circle-head { 0% { stroke-dasharray: 0 200 } 75%, 100% { stroke-dasharray: 100 200 } }",
  "@keyframes porest-progress-circle-tail { 0%, 33.33% { stroke-dashoffset: 0 } 100% { stroke-dashoffset: -100 } }",
].join("\n");
// 레시피는 키프레임을 <style href precedence>(React 19 — 문서 머리에 한 번)로 싣는다 — 정적 HTML 은 로딩 원이 있는 예제마다 한 번 둔다
const PC_STYLE = `<style data-href="porest-progress-circle" data-precedence="porest">${PC_KEYFRAMES}</style>`;
// quantity-picker.tsx 의 로딩 원 — <ProgressCircle size="inherit" tone="inherit" aria-hidden />. 상자 크기는 레시피처럼 style 로
const PROGRESS_CIRCLE = `<svg role="progressbar" aria-label="불러오는 중" aria-hidden="true" data-slot="progress-circle" data-size="inherit" data-tone="inherit" data-mode="indeterminate" class="${[
  PC_ROOT,
  PC_SIZE.inherit,
  PC_TONE.inherit,
  PC_SPIN,
].join(" ")}" style="width:var(--pc-size); height:var(--pc-size);"><circle data-slot="progress-circle-track" class="${PC_TRACK}"></circle><circle data-slot="progress-circle-range" pathLength="100" class="${PC_RANGE} ${PC_RANGE_INDETERMINATE}"></circle></svg>`;

// ── field.tsx 의 클래스 — 칸을 감싸는 둘레(묶음이라 라벨은 <span>) ──────────────

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

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const svg = (paths, cls = "") =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ""} aria-hidden="true">${paths}</svg>`;
const PATHS = {
  minus: '<path d="M5 12h14"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  trash2: '<path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  circleAlert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
};

// <QuantityPicker> 한 개 — quantity-picker.tsx 그대로. 글은 여기서 escape 한다. naming 은 { labelledby, describedby } 또는 { label }(aria-label)
function quantityPicker({ value, min = 0, max = Number.MAX_SAFE_INTEGER, size = "responsive", layout = "hug", unit = "", name, loading, disabled = false, readOnly = false, invalid = false, removable = false, removeAriaLabel = "", naming = {} }) {
  const text = (v) => `${v}${unit}`;
  const current = text(value);
  const placeholders = [...new Set([text(min), ...(max < Number.MAX_SAFE_INTEGER ? [text(max)] : [])].filter((t) => t !== current))];
  const busy = loading === true ? { decrement: true, increment: true } : { decrement: !!loading?.decrement, increment: !!loading?.increment };
  const atMin = value <= min;
  const atMax = value >= max;
  const isRemove = removable && atMin;
  const blocked = { decrement: readOnly || (atMin && !isRemove), increment: readOnly || atMax };
  const icon = (kind) => (busy[kind] ? PROGRESS_CIRCLE : kind === "increment" ? svg(PATHS.plus) : svg(isRemove ? PATHS.trash2 : PATHS.minus));
  const button = (kind) =>
    `<button ${attrs([
      'type="button"',
      `data-slot="quantity-picker-${kind}"`,
      kind === "decrement" && isRemove && 'data-remove="true"',
      `aria-label="${esc(kind === "increment" ? "늘리기" : isRemove ? removeAriaLabel : "줄이기")}"`,
      !disabled && blocked[kind] && 'aria-disabled="true"',
      busy[kind] && 'aria-busy="true"',
      disabled && "disabled",
      `class="${BUTTON} ${BUTTON_SIZE[size]}"`,
    ])}>${icon(kind)}</button>`;
  const divider = `<span aria-hidden="true" data-slot="quantity-picker-divider" class="${DIVIDER}"></span>`;
  return `<div ${attrs([
    'role="group"',
    'data-slot="quantity-picker"',
    `data-size="${size}"`,
    `data-layout="${layout}"`,
    invalid && 'data-invalid="true"',
    disabled && 'data-disabled="true"',
    readOnly && 'data-readonly="true"',
    disabled && 'aria-disabled="true"',
    `class="${ROOT} ${ROOT_SIZE[size]} ${ROOT_LAYOUT[layout]}"`,
    naming.labelledby && `aria-labelledby="${naming.labelledby}"`,
    !naming.labelledby && naming.label && `aria-label="${esc(naming.label)}"`,
    naming.describedby && `aria-describedby="${naming.describedby}"`,
  ])}>${button("decrement")}${divider}<span data-slot="quantity-picker-value"${disabled ? ' data-disabled="true"' : ""} aria-live="polite" aria-atomic="true" class="${VALUE} ${VALUE_SIZE[size]}">${placeholders
    .map((t) => `<span aria-hidden="true" class="${VALUE_PLACEHOLDER}">${esc(t)}</span>`)
    .join("")}<span class="${VALUE_TEXT}">${esc(current)}</span></span>${divider}${button("increment")}${
    name != null ? `<input type="hidden" data-slot="quantity-picker-input" name="${esc(name)}" value="${value}"${disabled ? " disabled" : ""}>` : ""
  }</div>`;
}

// <Field> 둘레 — 묶음이라 라벨은 <span id> 이고 칸(묶음)이 그 id 를 이름으로, 설명 · 오류를 설명으로 받는다(useFieldGroup)
function field({ id, label, description, errorMessage, invalid = false, control }) {
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const showError = invalid && errorMessage;
  const describedby = showError ? errorId : description ? descriptionId : "";
  const header = label ? `<div data-slot="field-header" class="${FIELD_HEADER}"><span id="${labelId}" class="${FIELD_LABEL} ${FIELD_LABEL_WEIGHT.medium}">${esc(label)}</span></div>` : "";
  const footer = showError
    ? `<div data-slot="field-footer" class="${FIELD_FOOTER}"><p id="${errorId}" aria-hidden="true" class="${FIELD_ERROR}" style="${P_FIX.error}">${svg(PATHS.circleAlert, FIELD_ERROR_ICON)}<span class="${FIELD_TEXT}">${esc(errorMessage)}</span></p></div>`
    : description
      ? `<div data-slot="field-footer" class="${FIELD_FOOTER}"><p id="${descriptionId}" class="${FIELD_DESCRIPTION}" style="${P_FIX.description}"><span class="${FIELD_TEXT}">${esc(description)}</span></p></div>`
      : "";
  return `<div ${attrs(['data-slot="field"', invalid && 'data-invalid="true"', `class="${FIELD_ROOT}"`])}>${header}${control({ labelledby: label ? labelId : "", describedby })}${footer}<span class="sr-only" aria-live="polite">${showError ? esc(errorMessage) : ""}</span></div>`;
}

const SURFACE =
  "padding:var(--spacing-x6) var(--spacing-global-gutter); border-radius:var(--radius-r4); background:var(--color-bg-layer-default); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle); font-family:var(--font-sans); color:var(--color-fg-neutral);";
const surface = (html, extra = "") => `<div style="${SURFACE}${extra}">${html}</div>`;
const stack = (items, gap = "var(--spacing-x6)") => `<div style="display:flex; flex-direction:column; gap:${gap};">${items.join("")}</div>`;
const CAPTION = "font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle); font-family:ui-monospace, SFMono-Regular, Menlo, monospace;";
const labeled = (html, caption) => `<div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--spacing-x2);">${html}<span style="${CAPTION}">${esc(caption)}</span></div>`;
// HR 업무 보고 표(화면의 내용) — 줄 수정 중의 소요시간 칸만 Quantity Picker small
const TABLE = "width:100%; border-collapse:collapse; font-size:var(--text-t4); line-height:var(--text-t4--line-height);";
const TH = "padding:var(--spacing-x2_5) var(--spacing-x4); border-bottom:1px solid var(--color-stroke-neutral-subtle); text-align:left; font-weight:500; color:var(--color-fg-neutral-muted);";
const TD = "padding:var(--spacing-x3) var(--spacing-x4); border-bottom:1px solid var(--color-stroke-neutral-subtle); vertical-align:middle;";
const NUM = "text-align:right; white-space:nowrap; font-variant-numeric:tabular-nums;";
// 장보기 목록 줄(화면의 내용)
const ROW = "display:flex; align-items:center; gap:var(--spacing-x3); min-height:44px; padding:var(--spacing-x2) var(--spacing-x4);";
const ITEM_NAME = "flex:1; min-width:0; font-size:var(--text-t5); line-height:var(--text-t5--line-height);";

// ── 예제 ──────────────────────────────────────────────────────────────────

export const quantityPickerExamples = [
  {
    title: "폼 — 승인 필요 횟수",
    description:
      "작은 정수를 한 단계씩 늘리고 줄이는 자리 — HR 휴가 정책의 승인 필요 횟수(0 ~ 고를 수 있는 승인자 수 3)다. Field 안에 두면 Field 의 라벨이 묶음(role=\"group\")의 이름, 설명이 묶음의 설명이 된다. 단위는 값 칸의 글(getValueText — \"0회\")로 붙이고 라벨에 \"(회)\" 를 쓰지 않는다 — 폼에 내는 값은 단위 없는 정수(숨은 입력 name)다. 크기는 웹 폼의 기본 responsive — 1280 미만 large 52 · 이상 medium 40 으로 옆 Input · Select 와 같은 높이다. 값이 최소 0 이라 줄이기가 막힌 모습(aria-disabled — disabled 가 아니라 초점이 남는다)이다. 값 칸은 보기만 한다(누르지도 치지도 못한다 — 2A). 미리보기는 스크립트 없이 그려 눌러도 값이 그대로다.",
    jsx: `import { useState } from "react"
import { Field } from "@/components/ui/field"
import { QuantityPicker } from "@/components/ui/quantity-picker"

const approverCount = 3 // 고를 수 있는 승인자 수 — 위 끝을 데이터로 건다
const [approvals, setApprovals] = useState(0)

<Field label="승인 필요 횟수" description="0 이면 승인 없이 바로 써요.">
  <QuantityPicker
    min={0}
    max={approverCount}
    value={approvals}
    onValueChange={setApprovals}
    getValueText={(v) => \`\${v}회\`}
    name="approvalCount"
  />
</Field>`,
    render: () =>
      surface(
        field({
          id: "qp-approvals",
          label: "승인 필요 횟수",
          description: "0 이면 승인 없이 바로 써요.",
          control: (n) => quantityPicker({ value: 0, min: 0, max: 3, unit: "회", name: "approvalCount", naming: n }),
        }),
        " max-width:390px;",
      ),
  },

  {
    title: "표 칸 — 소요시간",
    description:
      "표 칸 · 목록 줄 안은 small 36 이다(HR 업무 보고 — 줄 수정 중의 소요시간 0 ~ 24). 옆 칸 이름이 없어 aria-label(\"소요시간\")로 이름을 준다. 값 칸이 가장 긴 값(\"24h\")의 폭을 숨긴 자리 글로 잡아 값이 바뀌어도 칸 폭이 그대로다. 36 버튼의 누르는 자리는 보이지 않는 여백으로 44(둘레 4)이고, 표 칸 위아래 여백 안이라 이웃 줄과 겹치지 않는다.",
    jsx: `import { useState } from "react"
import { QuantityPicker } from "@/components/ui/quantity-picker"

const [hours, setHours] = useState(8)

{/* 표 칸 안 — 옆 칸 이름이 없어 aria-label 로 이름을 준다 */}
<QuantityPicker size="small" min={0} max={24} value={hours} onValueChange={setHours} getValueText={(v) => \`\${v}h\`} aria-label="소요시간" />`,
    render: () =>
      surface(
        `<table style="${TABLE}"><thead><tr><th scope="col" style="${TH}">날짜</th><th scope="col" style="${TH}">업무 내용</th><th scope="col" style="${TH}${NUM}">소요시간</th></tr></thead><tbody>${[
          ["10월 13일 (월)", "클라우드 인프라 정기 점검 — 쿠버네티스 노드 교체 · 인증서 갱신", 8, false],
          ["10월 14일 (화)", "데이터 플랫폼 배치 지연 원인 분석 · 재처리", 6, true],
          ["10월 15일 (수)", "프로젝트 3팀 주간 진행 보고 · 회의록 정리", 2, false],
        ]
          .map(
            ([d, t, h, edit]) =>
              `<tr><td style="${TD}">${esc(d)}</td><td style="${TD}">${esc(t)}</td><td style="${TD}${NUM}">${
                edit ? `<div style="display:flex; justify-content:flex-end;">${quantityPicker({ value: h, min: 0, max: 24, size: "small", unit: "h", naming: { label: "소요시간" } })}</div>` : `${h}h`
              }</td></tr>`,
          )
          .join("")}</tbody></table>`,
        " overflow-x:auto;",
      ),
  },

  {
    title: "지우기 · 로딩",
    description:
      "removable 이면 값이 최소일 때 줄이기 자리가 지우기 버튼(휴지통 trash-2)이 된다 — 값을 더 줄이는 동작이 곧 항목을 지우는 자리다(SEED). 이름도 함께 바뀐다(removeAriaLabel — \"점심 도시락 지우기\", removable 이면 onRemove 와 함께 필수인 타입). 누르면 onRemove 를 부르고 값은 바꾸지 않는다 — 지운 뒤 초점은 쓰는 쪽이 다음 항목으로 옮긴다. 서버에 바로 반영하는 수량은 누른 쪽만 loading({ decrement, increment })을 준다 — 기다리는 버튼에 누름 바탕 + 값 없는 원(트랙 gray-500 · 호 fg-neutral, Button ghost 의 로딩 원과 같은 값)이 서고 그 버튼의 누르기를 버린다(aria-busy). 다른 쪽은 그대로 눌린다. 미리보기 아래 줄은 늘리기가 응답을 기다리는 순간이다.",
    jsx: `import { useState } from "react"
import { QuantityPicker } from "@/components/ui/quantity-picker"

const itemName = "점심 도시락" // 목록 줄의 항목 이름
const [count, setCount] = useState(1)
const [pending, setPending] = useState<"decrement" | "increment" | null>(null)
const save = (next: number) => Promise.resolve(next) // 서버에 바로 반영하는 요청
const removeItem = () => {} // 항목을 지운다 — 지운 뒤 초점은 다음 항목으로

// 누른 쪽만 기다린다 — 다른 쪽 버튼은 그대로 눌린다
const change = (next: number) => {
  setPending(next > count ? "increment" : "decrement")
  save(next).then(
    () => setCount(next),
    () => {},
  ).finally(() => setPending(null))
}

<QuantityPicker
  min={1}
  max={9}
  value={count}
  onValueChange={change}
  getValueText={(v) => \`\${v}개\`}
  loading={{ decrement: pending === "decrement", increment: pending === "increment" }}
  removable
  onRemove={removeItem}
  removeAriaLabel={\`\${itemName} 지우기\`}
  aria-label="수량"
/>`,
    render: () =>
      surface(
        `${PC_STYLE}${stack(
          [
            `<div style="${ROW}"><span style="${ITEM_NAME}">점심 도시락</span>${quantityPicker({ value: 1, min: 1, max: 9, unit: "개", removable: true, removeAriaLabel: "점심 도시락 지우기", naming: { label: "수량" } })}</div>`,
            `<div style="${ROW}"><span style="${ITEM_NAME}">무가당 두유 950ml × 12팩 묶음</span>${quantityPicker({ value: 2, min: 1, max: 9, unit: "개", removable: true, removeAriaLabel: "무가당 두유 950ml × 12팩 묶음 지우기", loading: { increment: true }, naming: { label: "수량" } })}</div>`,
          ],
          "0",
        )}`,
        " max-width:480px; padding:var(--spacing-x2) 0;",
      ),
  },

  {
    title: "세 크기 — small 36 · medium 40 · large 52",
    description:
      "SEED 의 세 크기 그대로다(1A) — small 36 · medium 40 · large 52, 모서리 8 · 8 · 12, 아이콘 16 · 18 · 22, 값 16 / 22 · 16 / 22 · 18 / 24(500). 크기는 옆 입력과 같은 높이로 고른다 — 웹 폼은 responsive(기본), 앱은 늘 large, small 은 표 칸 · 목록 줄 안에만. 36 · 40 버튼은 누르는 자리를 44 로 넓힌다(보이지 않는 여백 4 · 2 — ::before). Button 의 large 48 에 맞추지 않는다(1B 는 고르지 않았다).",
    jsx: `{/* 표 칸 · 목록 줄 안 */}
<QuantityPicker size="small" min={0} max={9} defaultValue={3} getValueText={(v) => \`\${v}회\`} aria-label="승인 필요 횟수" />
{/* 1280 이상 데스크톱 웹 폼 */}
<QuantityPicker size="medium" min={0} max={9} defaultValue={3} getValueText={(v) => \`\${v}회\`} aria-label="승인 필요 횟수" />
{/* 폰 · 앱 폼 */}
<QuantityPicker size="large" min={0} max={9} defaultValue={3} getValueText={(v) => \`\${v}회\`} aria-label="승인 필요 횟수" />`,
    render: () =>
      surface(
        `<div style="display:flex; flex-wrap:wrap; align-items:flex-end; gap:var(--spacing-x6);">${["small", "medium", "large"]
          .map((size) => labeled(quantityPicker({ value: 3, min: 0, max: 9, size, unit: "회", naming: { label: "승인 필요 횟수" } }), `size="${size}" · ${{ small: 36, medium: 40, large: 52 }[size]}`))
          .join("")}</div>`,
      ),
  },

  {
    title: "끝 · 범위 밖 · 막힘",
    description:
      "끝(최소 · 최대)에 닿은 버튼은 aria-disabled 로 막힌 모습(fg-disabled)이 되지만 초점은 남는다 — 키보드로 끝까지 눌러도 초점이 본문으로 빠지지 않는다(SEED headless 와 다른 자리). 범위가 데이터로 바뀌어 지금 값이 밖이 되면(승인자가 2명으로 줄었다) 값을 저절로 고치지 않고 invalid(안쪽 2px stroke-critical-solid)와 Field 오류 글로 알린다. 막힘(disabled)은 두 버튼 disabled · 아이콘 · 값 fg-disabled 이고 흐리게 하지 않는다(v106) — 숨은 입력도 막혀 제출되지 않는다.",
    jsx: `<Field label="승인 필요 횟수" invalid={approvals > approverCount} errorMessage="승인자는 2명이에요. 횟수를 2회 이하로 줄여주세요.">
  <QuantityPicker min={0} max={approverCount} value={approvals} onValueChange={setApprovals} getValueText={(v) => \`\${v}회\`} />
</Field>
<QuantityPicker disabled min={0} max={3} value={1} getValueText={(v) => \`\${v}회\`} aria-label="승인 필요 횟수" />`,
    render: () =>
      surface(
        stack([
          labeled(quantityPicker({ value: 3, min: 0, max: 3, unit: "회", naming: { label: "승인 필요 횟수" } }), "최대 3 — 늘리기 aria-disabled"),
          field({
            id: "qp-invalid",
            label: "승인 필요 횟수",
            invalid: true,
            errorMessage: "승인자는 2명이에요. 횟수를 2회 이하로 줄여주세요.",
            control: (n) => quantityPicker({ value: 3, min: 0, max: 2, unit: "회", invalid: true, naming: n }),
          }),
          labeled(quantityPicker({ value: 1, min: 0, max: 3, unit: "회", disabled: true, naming: { label: "승인 필요 횟수" } }), "disabled — 두 버튼 disabled · 흐리지 않는다"),
        ]),
        " max-width:390px;",
      ),
  },
];
