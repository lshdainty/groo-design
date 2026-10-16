/*
 * Porest Color Swatch 예제 — docs site components/color-swatch.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 셋(새 카테고리 · 고치기 · 자동)은 차례 · 제목 · 코드가 specs/components/color-swatch.md 의
 * "코드" 절과 같고, 뒤의 하나(막힘)는 md 의 State 를 코드로 더 보인다. 색 고르기는 차트 10색을 원 40 칸에 진하게 칠해 5 × 2 로 늘어놓는
 * radiogroup 이다(2026-10-09). SEED 에는 색 고르기 부품이 없어 칸 · 고른 표시 · 키보드 · 새 항목의 첫 색은 porest 가 정했다 — 칸마다 색 이름을
 * 다는 것만 SEED Wheel Picker 예(항목마다 ariaLabel)와 같다. 옛 예제(폭을 나눈 정사각 칸 · 18% 섞은 옅은 칸 · currentColor 테두리 · 마우스 1.05배)를 대신한다.
 *
 * SWATCH · CHECK · SWATCH_BG · CHECK_COLOR · COLOR_SWATCH_ORDER · COLOR_NAMES · ASSIGN_ORDER · COLUMNS · firstUnusedColor 는
 * recipes/shadcn/components/ui/color-swatch.tsx 의 상수 · 함수와, STACK_CONTAINER · DIVIDER 는 그 파일의 상수와, LAYOUT · LAYOUT_STACK ·
 * CURRENT_COLUMN · CURRENT_LABEL · GRID · AUTO 는 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 둘레의 FIELD_* 는 field.tsx 의 것이다 — field-examples.mjs 의 것과 같다.
 * 규칙은 specs/components/color-swatch.md, 수치 원본은 specs/components/color-swatch.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 묶음 <div role="radiogroup" data-slot="color-swatch-group">(이름은 Field 라벨 — aria-labelledby, 지금 색 칸이
 * 있으면 @container) > 짜임 <div data-slot="color-swatch-layout"> > [지금 색 칸 <div data-slot="color-swatch-current-column">(칸 + 아래 글) · 선] ·
 * 격자 <div data-slot="color-swatch-grid"> > 칸 <button role="radio" data-slot="color-swatch" data-color aria-label="빨강" data-state>(고른 칸만 체크
 * <span data-slot="color-swatch-check">). 고른 칸만 tabindex 0 이다. 지금 색 칸이 있으면 놓인 자리가 321 보다 좁을 때(360 폰 본문 312) 지금 색 칸을
 * 격자 위 줄에 두고 선을 가로로 바꾼다 — 사이트 미리보기 칸이 좁으면 그 모습이 보인다. 격자 칸은 Tooltip 의 트리거(data-state)이고 이름 툴팁은
 * 마우스를 올리거나 키보드 초점이 오면 뜬다 — 정적 HTML 에는 그 스크립트가 없어 툴팁은 그리지 않았다.
 * 레시피의 스크립트(누르기 · 2차원 화살표 · 툴팁 · 지금 색 칸 체크 색 고르기)는 정적 HTML 에 없다 — 칸을 눌러도 고른 칸이 옮겨 가지 않는다.
 * 지금 색 칸의 체크는 레시피가 fg-neutral · fg-neutral-inverted 가운데 그 색 위 대비가 큰 쪽을 그 자리에서 재 고른다(같으면 inverted) — 미리보기는
 * 라이트에서 잰 값(#9E9E9E → fg-neutral, 다크면 fg-neutral-inverted)을 그렸다.
 * id 는 레시피의 useId 자리다 — 예제마다 앞말을 달리한다. 체크는 lucide-react 의 Check(선 2.5)와 같은 모양의 inline SVG 다.
 */

// ── color-swatch.tsx 의 상수 · 함수와 같은 값 ──────────────────────────────

/** 색상환 차례 — 격자의 차례(5 × 2) */
const COLOR_SWATCH_ORDER = ["red", "orange", "yellow", "green", "blue", "indigo", "violet", "pink", "brown", "gray"];

/** 색 이름 — 칸의 이름(라디오) */
const COLOR_NAMES = {
  red: "빨강",
  orange: "주황",
  yellow: "노랑",
  green: "초록",
  blue: "파랑",
  indigo: "남색",
  violet: "보라",
  pink: "분홍",
  brown: "갈색",
  gray: "회색",
};

// v110 배정 순서 — chart.tsx 의 CHART_ORDER 와 같다(회색은 "기타" 전용이라 없다)
const ASSIGN_ORDER = ["blue", "green", "orange", "violet", "pink", "indigo", "red", "yellow", "brown"];

/** 같은 목록이 아직 쓰지 않은 첫 색(v110 배정 순서) — 아홉 색을 다 쓰면 파랑, 회색은 주지 않는다 */
function firstUnusedColor(used) {
  const taken = new Set(used);
  return ASSIGN_ORDER.find((color) => !taken.has(color)) ?? "blue";
}

// Tailwind 는 소스의 글자 그대로를 읽으므로 열을 다 적는다
const SWATCH_BG = {
  red: "bg-chart-red",
  orange: "bg-chart-orange",
  yellow: "bg-chart-yellow",
  green: "bg-chart-green",
  blue: "bg-chart-blue",
  indigo: "bg-chart-indigo",
  violet: "bg-chart-violet",
  pink: "bg-chart-pink",
  brown: "bg-chart-brown",
  gray: "bg-chart-gray",
};

const COLUMNS = 5;

// 칸 — 원 40 · 누르는 44. 고른 고리는 바깥 2 띄운 2px outline, 키보드 포커스 링은 그 바깥 6 에 ::after 로(고리와 겹치지 않게)
const SWATCH = [
  "relative block size-[40px] shrink-0 cursor-pointer rounded-full border-0 p-0",
  "before:absolute before:-inset-0.5 before:rounded-full before:content-['']",
  "outline-offset-2 aria-checked:outline-2 aria-checked:outline-solid aria-checked:outline-stroke-neutral-contrast",
  "disabled:aria-checked:outline-stroke-neutral-solid not-aria-checked:focus-visible:outline-none",
  "after:pointer-events-none after:absolute after:-inset-1.5 after:rounded-full after:content-['']",
  "focus-visible:after:outline-2 focus-visible:after:outline-solid focus-visible:after:outline-stroke-focus-ring",
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] [--press-basis:40] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "disabled:cursor-not-allowed disabled:[scale:1]",
].join(" ");

// 체크 16 · 선 2.5 — 고른 칸 가운데
const CHECK = "pointer-events-none absolute inset-0 flex items-center justify-center [&_svg]:size-4";

const CHECK_COLOR = { neutral: "text-fg-neutral", inverted: "text-fg-neutral-inverted" };

// ── color-swatch.tsx 의 JSX 에 적힌 클래스 ──────────────────────────────

// 지금 색 칸이 있으면 묶음이 놓인 자리의 폭으로 가른다 — 321(칸 40 + 16 + 선 1 + 16 + 격자 248, color-swatch.yaml divider.stackBelow)보다
// 좁으면 지금 색 칸 · 선 · 격자를 세로로(@container). 폭을 내용으로 정하는 자리(팝오버)에서는 321 로 잰다(contain-intrinsic)
const STACK_CONTAINER = "@container w-full min-w-0 [contain-intrinsic-inline-size:321px]";
// 선 — 세로로 쌓이면 가로 1px(격자 폭), 옆으로 두면 세로 1px(격자 높이). 사이는 늘 16
const DIVIDER = "h-px shrink-0 self-stretch bg-stroke-neutral-weak @min-[321px]:h-auto @min-[321px]:w-px";
// 짜임 — 지금 색 칸 · 선 · 격자(사이 16). 지금 색 칸이 있으면 좁은 자리에서 세로로
const LAYOUT = "flex w-fit items-start gap-x4";
const LAYOUT_STACK = "flex-col @min-[321px]:flex-row";
const CURRENT_COLUMN = "flex shrink-0 flex-col items-center gap-[6px]";
const CURRENT_LABEL = "whitespace-nowrap font-sans text-t2 text-fg-neutral-subtle";
const GRID = "grid w-[248px] shrink-0 grid-cols-[repeat(5,40px)] gap-x3";
// 자동 — 차트가 쓸 색을 2px 점선 원으로
const AUTO = "border-2 border-dashed border-stroke-neutral-solid";

// ── field.tsx 의 클래스 ───────────────────────────────────────────────────

const FIELD_ROOT = "flex w-full min-w-0 flex-col gap-x2";
const FIELD_HEADER = "flex items-center justify-between gap-x2_5 px-x0_5";
const FIELD_LABEL = "min-w-0 font-sans text-t5 text-fg-neutral";
const FIELD_LABEL_WEIGHT = { medium: "font-medium", bold: "font-bold" };

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cls = (...list) => list.filter(Boolean).join(" ");
// lucide-react 의 Check(strokeWidth 2.5)와 같은 모양 — 크기는 감싼 자리의 [&_svg]:size-4 가 정한다
const CHECK_SVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

// <ColorSwatchGroup value currentColor autoColor disabled> — Field 안이면 라벨이 묶음 이름(aria-labelledby)
//   checkTone  지금 색 칸의 체크(레시피가 그 색 위 대비를 재서 고른다 — 미리보기는 라이트에서 잰 값)
function colorSwatchGroup({ labelId, value = null, currentColor, autoColor, disabled = false, checkTone = "neutral" }) {
  const current = currentColor ? "custom" : autoColor ? "auto" : null;
  const order = current ? ["current", ...COLOR_SWATCH_ORDER] : [...COLOR_SWATCH_ORDER];
  const selectedIndex = value == null ? -1 : order.indexOf(value);
  const tabbable = selectedIndex >= 0 ? selectedIndex : 0;
  const item = (v, i) => {
    const checked = value === v;
    const isCurrent = v === "current";
    const name = isCurrent ? (current === "custom" ? "지금 색" : "자동") : COLOR_NAMES[v];
    const look = isCurrent ? (current === "custom" ? "" : cls(SWATCH_BG[autoColor], AUTO)) : SWATCH_BG[v];
    const checkColor = isCurrent && current === "custom" ? CHECK_COLOR[checkTone] : CHECK_COLOR.inverted;
    return `<button ${attrs([
      'type="button"',
      'role="radio"',
      `aria-checked="${checked}"`,
      `aria-label="${name}"`,
      `tabindex="${i === tabbable ? 0 : -1}"`,
      disabled && "disabled",
      `data-slot="${isCurrent ? "color-swatch-current" : "color-swatch"}"`,
      `data-color="${isCurrent ? (current === "custom" ? currentColor : autoColor) : v}"`,
      `class="${cls(SWATCH, look)}"`,
      isCurrent && current === "custom" && `style="background: ${currentColor}"`,
      // 격자 칸은 Tooltip 의 트리거(asChild) — 이름 툴팁(porest Tooltip · 네이티브 title 없음). 지금 색 칸은 이름이 아래 글이라 툴팁이 없다
      !isCurrent && 'data-state="closed"',
    ])}>${checked ? `<span aria-hidden="true" data-slot="color-swatch-check" class="${cls(CHECK, checkColor)}">${CHECK_SVG}</span>` : ""}</button>`;
  };
  const head = current
    ? `<div data-slot="color-swatch-current-column" class="${CURRENT_COLUMN}">${item("current", 0)}<span aria-hidden="true" data-slot="color-swatch-current-label" class="${CURRENT_LABEL}">${current === "custom" ? "지금 색" : "자동"}</span></div><span aria-hidden="true" data-slot="color-swatch-divider" class="${DIVIDER}"></span>`
    : "";
  const offset = current ? 1 : 0;
  return `<div ${attrs([
    'role="radiogroup"',
    'data-slot="color-swatch-group"',
    disabled && 'data-disabled="true"',
    current && `class="${STACK_CONTAINER}"`,
    disabled && 'aria-disabled="true"',
    `aria-labelledby="${labelId}"`,
  ])}><div data-slot="color-swatch-layout" class="${cls(LAYOUT, current && LAYOUT_STACK)}">${head}<div data-slot="color-swatch-grid" class="${GRID}">${COLOR_SWATCH_ORDER.map((color, k) => item(color, k + offset)).join("")}</div></div></div>`;
}

// <Field label="색상"> — 색 묶음은 묶음이라 라벨이 <span id> 다(useFieldGroup)
const field = ({ id, disabled = false, group }) =>
  `<div ${attrs(['data-slot="field"', disabled && 'data-disabled="true"', `class="${FIELD_ROOT}"`])}><div data-slot="field-header" class="${FIELD_HEADER}"><span id="${id}label" class="${cls(FIELD_LABEL, FIELD_LABEL_WEIGHT.medium)}">색상</span></div>${colorSwatchGroup({ ...group, labelId: `${id}label`, disabled })}<span class="sr-only" aria-live="polite"></span></div>`;

// 대화상자 · 시트 위 — 칸은 놓인 표면 위에 둔다(사이트 미리보기 칸의 바탕 대신 흰 면)
const SURFACE = "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-x6); max-width:390px; box-sizing:border-box; font-family:var(--font-sans);";
const CAPTION = "display:block; margin-top:var(--spacing-x3); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const surface = (html, caption = "") => `<div style="${SURFACE}">${html}${caption ? `<span style="${CAPTION}">${esc(caption)}</span>` : ""}</div>`;

// 서버가 심는 기본 지출 카테고리 여덟 — 이미 여덟 색을 쓴다(식비 빨강 · 카페·간식 주황 · 교통 노랑 · 주거·통신 초록 · 생활 파랑 · 쇼핑 남색 · 건강 분홍 · 문화·여가 보라)
const USED = ["red", "orange", "yellow", "green", "blue", "indigo", "pink", "violet"];

// ── 예제 ──────────────────────────────────────────────────────────────────

export const colorSwatchExamples = [
  {
    title: "새 카테고리 — 쓰지 않은 첫 색",
    description:
      "칸은 v110 차트 10색(라이트 700 · 다크 800-dark)으로 꽉 채운 원 40(누르는 44)이고, 폭과 상관없이 5개씩 두 줄 · 사이 12(묶음 248)다 — 차례는 색상환(빨강 → 주황 → 노랑 → 초록 → 파랑 → 남색 → 보라 → 분홍 → 갈색 → 회색)이라 ↑ ↓ 가 늘 같은 칸으로 간다. 고른 칸은 바깥 2 를 띄운 2px 짙은 고리(stroke-neutral-contrast) + 가운데 체크 16(선 2.5 · fg-neutral-inverted — 라이트 흰 · 다크 짙은 글자)이다. 칸의 이름은 색 이름(\"빨강\"), 묶음의 이름은 Field 라벨(\"색상\")이고, 묶음에 Tab 은 한 번 — 화살표로 옮기며 고른다. 새 항목은 같은 목록이 쓰지 않은 첫 색으로 시작한다(firstUnusedColor — v110 배정 순서, 회색은 주지 않는다) — 기본 지출 카테고리 여덟이 이미 여덟 색을 쓰고 있어 아홉 번째는 갈색이다. 늘 빨강으로 시작하지 않는다.",
    jsx: `import { useState } from "react"
import type { ChartColor } from "@/components/ui/chart"
import { ColorSwatchGroup, firstUnusedColor } from "@/components/ui/color-swatch"
import { Field } from "@/components/ui/field"

// 같은 목록이 쓰지 않은 첫 색으로 시작한다 — 늘 빨강이 아니다
const [color, setColor] = useState<ChartColor | "current">(() => firstUnusedColor(usedColors))

<Field label="색상">
  <ColorSwatchGroup value={color} onValueChange={setColor} />
</Field>`,
    render: () => surface(field({ id: "csw-ex-1-", group: { value: firstUnusedColor(USED) } }), "기본 카테고리 여덟이 쓰는 색을 건너뛰어 갈색으로 시작한다"),
  },

  {
    title: "고치기 — 팔레트 밖 색",
    description:
      "고치는 항목의 색이 팔레트 밖이면(가져오기가 만드는 #9E9E9E) 격자 앞에 \"지금 색\" 칸을 따로 두고 처음에는 그 칸이 골라져 있다 — 세로 선(1px stroke-neutral-weak · 양옆 16)으로 격자와 가르고, 칸 아래 6 에 같은 이름 글(12 · fg-neutral-subtle)을 둔다. 저장된 색을 그대로 칠하고(두 모드 같은 값) 체크는 흰색 · 짙은 글자 가운데 그 색 위 대비가 큰 쪽이다. 고르지 않고 저장하면 값은 \"current\" — 저장 값을 그대로 둔다. 몰래 빨강으로 바꾸지 않는다. 지금 색 칸은 차례의 맨 앞이라 ← 로 회색에서 돌아온다.",
    jsx: `import { ColorSwatchGroup } from "@/components/ui/color-swatch"
import { Field } from "@/components/ui/field"

<Field label="색상">
  {/* 고르지 않고 저장하면 "current" — 저장 값(#9E9E9E)을 그대로 둔다 */}
  <ColorSwatchGroup value={picked} onValueChange={setPicked} currentColor="#9E9E9E" />
</Field>`,
    render: () => surface(field({ id: "csw-ex-2-", group: { value: "current", currentColor: "#9E9E9E", checkTone: "neutral" } }), "가져온 분류 고치기 — 지금 색이 골라져 있다"),
  },

  {
    title: "색 없는 항목 — 자동",
    description:
      "색이 없는 항목은 격자 앞에 \"자동\" 칸을 둔다 — 차트가 그 항목에 줄 색(아직 쓰지 않은 색 — 데이터 결정 9A)을 2px 점선 원(stroke-neutral-solid)으로 보인다. 처음에 골라져 있고, 고르지 않으면 색 없음 그대로 둔다. 격자에서 고르면 그 색으로 저장된다. 색을 꼭 고르게 하지 않는다.",
    jsx: `import { ColorSwatchGroup } from "@/components/ui/color-swatch"
import { Field } from "@/components/ui/field"

<Field label="색상">
  <ColorSwatchGroup value={picked} onValueChange={setPicked} autoColor={chartColorOf(item.id)} />
</Field>`,
    render: () => surface(field({ id: "csw-ex-3-", group: { value: "current", autoColor: "brown" } }), "색 없는 구독 고치기 — 자동(점선 갈색)이 골라져 있다"),
  },

  {
    title: "막힘 — 색은 그대로",
    description:
      "막힘은 색을 그대로 두고 누르기만 막는다(진짜 disabled — Tab 에서 빠진다). 칸의 색이 곧 값이라 흐리게 하지 않고, 고른 칸은 고리를 stroke-neutral-solid 로 남겨 무엇을 골랐는지 보인다. 호버는 모양이 바뀌지 않는다(커서만) — 누르는 동안 칸이 2px 거리만큼 준다.",
    jsx: `<Field label="색상" disabled>
  <ColorSwatchGroup value="green" />
</Field>`,
    render: () => surface(field({ id: "csw-ex-4-", disabled: true, group: { value: "green" } })),
  },
];
