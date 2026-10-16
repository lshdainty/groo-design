/*
 * shadcn Segmented Control 예제 — docs site components/segmented-control.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 맨 앞(보기 — 할 일)은 제목 · 코드가 specs/components/segmented-control.md 의 "코드" 절과 같고,
 * 뒤의 넷(칸 수 · 상태 · 알림 점과 막힘 · 긴 글)은 md 의 Properties · Guidelines 를 코드로 더 보인다.
 *
 * TRACK · ITEM 은 recipes/shadcn/components/ui/segmented-control.tsx 의 cva(segmentedControlVariants · segmentedControlItemVariants)와,
 * INDICATOR · LABEL · NOTIFICATION 은 그 파일의 상수(SEGMENTED_INDICATOR · SEGMENTED_LABEL · SEGMENTED_NOTIFICATION)와, SR_ONLY 는 그 파일의
 * JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다.
 * 규칙은 specs/components/segmented-control.md, 수치 원본은 specs/components/segmented-control.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 트랙 <div role="radiogroup" data-slot="segmented-control">(Radix RadioGroup.Root) > 고른 알약
 * <span data-slot="segmented-control-indicator">(첫 자식 — 칸이 그 위에 그려진다) + 칸 <button role="radio" data-slot="segmented-control-item">
 * (Radix RadioGroup.Item) > 글 <span data-slot="segmented-control-label">(+ 알림 점 <span data-slot="segmented-control-notification">) + 화면 밖 "새 소식".
 * 고른 알약의 자리는 레시피가 그린 칸을 세어 알약의 style 에 --segmented-count · --segmented-index 로 넣는다 — 미리보기도 같은 두 변수를 style 에 적는다.
 * Radix 가 붙이는 것 중 칸의 aria-checked · data-state · data-disabled · disabled · value 와 트랙의 data-disabled 를 그리고, 트랙의 tabindex · dir ·
 * style 은 그리지 않는다(chip-examples.mjs 의 라디오 묶음과 같다). 칸의 tabindex 는 레시피가 정한다 — 고른 칸만 0, 나머지는 −1 이다(Radix 의 로빙 위치는
 * 마지막으로 포커스한 칸이라 값이 밖에서 바뀌면 옛 칸에 남는다).
 * 레시피의 스크립트(화살표로 옮기며 고르기 · 알약 미끄러짐 · 누르는 순간 --press-basis 재기)는 정적 HTML 에 없다 — 칸에 마우스를 올리거나 누르면
 * 바탕 · 글 축소는 레시피 그대로 바뀌지만 고른 칸은 그대로다.
 */

// ── segmented-control.tsx 의 cva · 상수와 같은 값 ─────────────────────────

// 트랙(segmentedControlVariants) — 놓인 자리 폭을 채우는 알약. 칸이 칸 수로 똑같이 나눈다(최소 폭 없음) · 모든 칸이 가장 높은 칸에 맞춘다
const TRACK = "relative grid w-full grid-flow-col auto-cols-fr rounded-full bg-bg-neutral-weak-alpha p-x1 font-sans";

// 고른 알약(SEGMENTED_INDICATOR) — 칸 뒤. 폭 (트랙 − 8) ÷ 칸 수, 고른 칸 번호만큼 옮긴다(200ms)
const INDICATOR = [
  "pointer-events-none absolute inset-y-x1 left-x1 rounded-full bg-bg-layer-default shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-contrast)]",
  "w-[calc((100%_-_2_*_var(--spacing-x1))_/_var(--segmented-count,1))] [transform:translateX(calc(var(--segmented-index,0)_*_100%))]",
  "[transition:transform_var(--motion-duration-d4)_var(--motion-ease-easing)]",
].join(" ");

// 칸(segmentedControlItemVariants) — 바탕 · 글자 · 테두리는 color-transition. 호버는 마우스 있는 기기에서만(누름과 같은 바탕, 축소 없음).
// 막힌 칸은 호버 · 누름이 없다(enabled 에서만 칠한다)
const ITEM = [
  "group/segmented-item relative flex min-h-[34px] min-w-0 cursor-pointer select-none items-center justify-center rounded-full px-x3 py-x1_5 font-sans text-t5-static font-bold text-fg-neutral-subtle dark:text-fg-neutral-muted [--press-basis:34]",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),color_var(--motion-duration-color-transition)_var(--motion-ease-easing),box-shadow_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "data-[state=unchecked]:enabled:hover:bg-bg-neutral-weak-pressed data-[state=unchecked]:enabled:hover:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] data-[state=unchecked]:enabled:hover:text-fg-neutral-muted",
  "data-[state=unchecked]:enabled:active:bg-bg-neutral-weak-pressed data-[state=unchecked]:enabled:active:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] data-[state=unchecked]:enabled:active:text-fg-neutral-muted",
  "enabled:data-[state=checked]:text-fg-neutral",
  "data-[state=checked]:enabled:hover:bg-bg-layer-default-pressed data-[state=checked]:enabled:hover:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-contrast)]",
  "data-[state=checked]:enabled:active:bg-bg-layer-default-pressed data-[state=checked]:enabled:active:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-contrast)]",
  "disabled:cursor-not-allowed disabled:text-fg-disabled",
  "data-[state=checked]:disabled:bg-bg-disabled data-[state=checked]:disabled:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-solid)]",
].join(" ");

// 글(SEGMENTED_LABEL) — 가운데 · 단어 단위 줄바꿈(v114). 누르는 동안 글만 준다(칸이 잰 --press-basis). 막힌 칸은 줄지 않는다
const LABEL = [
  "relative min-w-0 text-center break-keep [overflow-wrap:break-word]",
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "group-active/segmented-item:[scale:calc(1-2/var(--press-basis))] group-disabled/segmented-item:[scale:1] motion-reduce:group-active/segmented-item:[scale:1]",
].join(" ");

// 알림 점(SEGMENTED_NOTIFICATION) — 브랜드 글자색, 글 끝에서 2 · 글 위쪽. 띄워 두므로 칸 폭이 바뀌지 않는다. 고른 칸에는 그리지 않는다
const NOTIFICATION = "pointer-events-none absolute left-[calc(100%_+_2px)] top-0 size-1.5 rounded-full bg-fg-brand";

// ── segmented-control.tsx 의 JSX 에 적힌 클래스 ───────────────────────────

const SR_ONLY = "sr-only";

// ── cn 풀이 ───────────────────────────────────────────────────────────────

// "data-[state=unchecked]:enabled:hover:bg-x" → ["data-[state=unchecked]", "enabled", "hover", "bg-x"] — 괄호 안의 ":" 는 가르지 않는다
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

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다 — 이 파일이 덧붙이는 강제 상태에 나오는 무리(바탕 · 임의 속성)만 안다
const GROUPS = [[/^bg-/, "bg"]];

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

// 정적 미리보기에서 호버 · 누름 · 포커스를 보이려고 — 그 상태의 클래스(hover: · active: · focus-visible: · group-active/segmented-item:)에서
// 접두어만 뗀 사본을 뒤에 붙인다. 값은 레시피 그대로라 segmented-control.tsx 가 바뀌면 같이 따라간다
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

const forced = (classList, state) => merge(`${classList} ${forceState(classList, state)}`);
// 칸의 강제 상태 — 호버(웹) · 누름(칸은 바탕, 글은 축소) · 키보드 포커스
const ITEM_FORCE = { hovered: "hover", pressed: "active", focused: "focus-visible" };
const itemClass = (force) => (force && ITEM_FORCE[force] ? forced(ITEM, ITEM_FORCE[force]) : ITEM);
const labelClass = (force) => (force === "pressed" ? forced(LABEL, "group-active/segmented-item") : LABEL);

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// <SegmentedControlItem> — segmented-control.tsx 그대로(Radix RadioGroup.Item · 고른 칸만 tabindex 0 · 알림 점은 안 고른 칸에만).
// force = "hovered" · "pressed" · "focused" — 미리보기용 강제 상태
function item({ value, label, checked = false, disabled = false, notification = false, force }) {
  const root = attrs([
    'type="button"',
    'role="radio"',
    `aria-checked="${checked}"`,
    `data-state="${checked ? "checked" : "unchecked"}"`,
    disabled && 'data-disabled=""',
    disabled && "disabled",
    `value="${esc(value)}"`,
    'data-slot="segmented-control-item"',
    notification && 'data-notification=""',
    `class="${itemClass(force)}"`,
    `tabindex="${checked ? 0 : -1}"`,
  ]);
  const dot = notification && !checked ? `<span aria-hidden="true" data-slot="segmented-control-notification" class="${NOTIFICATION}"></span>` : "";
  const sr = notification && !checked ? `<span class="${SR_ONLY}">새 소식</span>` : "";
  return `<button ${root}><span data-slot="segmented-control-label" class="${labelClass(force)}">${esc(label)}${dot}</span>${sr}</button>`;
}

// <SegmentedControl> — Radix RadioGroup.Root(role="radiogroup"). 고른 값(value)과 같은 칸 하나만 고른 상태이고, 트랙을 막으면(disabled) 모든 칸이 막힌다.
// 고른 알약은 첫 자식 — 칸 수 · 고른 칸 번호를 style 에 넣는다(레시피의 레이아웃 효과와 같은 값). items = [{ value, label, disabled?, notification? }],
// force = { [value]: "hovered" | "pressed" | "focused" }
function segmented({ ariaLabel, items, value, disabled = false, force = {} }) {
  const index = items.findIndex((it) => it.value === value);
  const root = attrs([
    'role="radiogroup"',
    disabled && 'data-disabled=""',
    'data-slot="segmented-control"',
    `class="${TRACK}"`,
    ariaLabel && `aria-label="${esc(ariaLabel)}"`,
  ]);
  const pill = `<span aria-hidden="true" data-slot="segmented-control-indicator" class="${INDICATOR}"${index < 0 ? " hidden" : ""} style="--segmented-count: ${Math.max(items.length, 1)}; --segmented-index: ${Math.max(index, 0)};"></span>`;
  const cells = items.map((it) =>
    item({ ...it, checked: it.value === value, disabled: disabled || !!it.disabled, force: force[it.value] }),
  );
  return `<div ${root}>${pill}${cells.join("")}</div>`;
}

// 화면 틀 — 폰은 안쪽 360, 트랙은 화면 여백 24 안. 트랙은 투명한 bg-neutral-weak-alpha(v120)라 회색 바닥 위에서도 보이지만,
// 미리보기는 시트 · 흰 띠 안의 모습으로 흰 바탕 위에 둔다
const PHONE =
  "box-sizing:content-box; max-width:360px; overflow:hidden; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4);";
const phone = (html) => `<div style="${PHONE}">${html}</div>`;
const PAD = "padding:var(--spacing-x4) var(--spacing-global-gutter);";
const pad = (html) => `<div style="${PAD}">${html}</div>`;
const TITLE =
  "padding:var(--spacing-x6) var(--spacing-global-gutter) 0; font-family:var(--font-sans); font-size:var(--text-t7); line-height:var(--text-t7--line-height); font-weight:700; color:var(--color-fg-neutral);";
const title = (text) => `<div style="${TITLE}">${esc(text)}</div>`;
// 목록 줄(제목 · 설명) — 레시피 밖의 화면 내용이라 클래스 없이 그린다
const ROW = "display:flex; flex-direction:column; gap:var(--spacing-x0_5); padding:var(--spacing-x3) var(--spacing-global-gutter);";
const ROW_TITLE = "font-family:var(--font-sans); font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const ROW_DETAIL = "font-family:var(--font-sans); font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle);";
const row = (name, detail) => `<div style="${ROW}"><span style="${ROW_TITLE}">${esc(name)}</span><span style="${ROW_DETAIL}">${esc(detail)}</span></div>`;
const CAPTION =
  "font-size:var(--text-t2); line-height:var(--text-t2--line-height); font-weight:400; color:var(--color-fg-neutral-subtle);";
const CODE = `${CAPTION} font-family:ui-monospace, SFMono-Regular, Menlo, monospace;`;
const code = (text) => `<span style="${CODE}">${text}</span>`;
// 이름표 + 그림
const labeled = (caption, html, style = CAPTION) =>
  `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2); min-width:0;"><span style="${style}">${caption}</span>${html}</div>`;
const stack = (items, gap = "var(--spacing-x5)") => `<div style="display:flex; flex-direction:column; gap:${gap};">${items.join("")}</div>`;
// 견주는 표 — 맨 위에 칸 이름, 줄마다 이름표를 칸들 위 한 줄에 둔다(상태 다섯은 줄로, 안 고름 · 고름 두 칸이 미리보기 폭 600 안에 들어가게).
// 좁으면 가로로 스크롤한다 — 안쪽 6 은 포커스 링이 잘리지 않게. 칸마다 트랙 폭을 정해(176) 줄마다 같은 자리에 둔다
const matrix = (columns, table) =>
  `<div style="overflow-x:auto; padding:var(--spacing-x1_5);"><div style="display:grid; grid-template-columns:repeat(${columns.length}, 176px); gap:var(--spacing-x2) var(--spacing-x4); align-items:center;">${[
    ...columns.map(code),
    ...table.flatMap(([name, cells]) => [`<div style="grid-column:1 / -1; padding-top:var(--spacing-x3);">${code(name)}</div>`, ...cells]),
  ].join("")}</div></div>`;
const SURFACE =
  "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-x6);";
const surface = (html) => `<div style="${SURFACE}">${html}</div>`;

// ── 화면 예시의 값 ────────────────────────────────────────────────────────

// 할 일 보기 — 같은 할 일을 오늘 · 이번 주 · 전체 · 완료로 거른다. 2026년 10월 1일(목)이 오늘이다
const TODO_VIEWS = [
  { value: "today", label: "오늘" },
  { value: "week", label: "이번 주" },
  { value: "all", label: "전체" },
  { value: "done", label: "완료" },
];
const TODAY = [row("디자인 시스템 리뷰", "오늘 오후 2:00"), row("10월 예산 정하기", "오늘")];

// 폰 콘텐츠 폭 312(360 − 좌우 24)에서 2 · 3 · 4개
const COUNTS = [
  { note: "2개 — 칸 152 · 통계 보기", ariaLabel: "통계 보기", items: [{ value: "expense", label: "지출" }, { value: "income", label: "수입" }] },
  { note: "3개 — 칸 101.3 · 거래 거르기", ariaLabel: "거래 거르기", items: [{ value: "all", label: "전체" }, { value: "expense", label: "지출" }, { value: "income", label: "수입" }] },
  { note: "4개 — 칸 76 · 할 일 보기", ariaLabel: "할 일 보기", items: TODO_VIEWS },
];

// 상태 표 — 줄은 enabled · hovered · pressed · focused · disabled, 칸은 안 고름(둘째 칸을 골랐다) · 고름. 첫 칸(지출)이 그 상태다
const STATES = ["enabled", "hovered", "pressed", "focused", "disabled"];
const PAIR = [{ value: "expense", label: "지출" }, { value: "income", label: "수입" }];

// ── 예제 ──────────────────────────────────────────────────────────────────

export const segmentedControlExamples = [
  {
    title: "보기 — 할 일",
    description:
      "같은 내용을 2 ~ 4가지로 바로 거르거나 · 정렬하거나 · 다르게 보는 자리다 — 할 일 목록을 오늘 · 이번 주 · 전체 · 완료로 거른다. 그 내용 바로 위에, 한 화면에 하나만 둔다. 다른 구역 · 페이지로 옮기면 Tabs, 저장할 폼 값은 Chip · Select 다. 트랙(투명한 bg-neutral-weak-alpha · 안쪽 4 — 회색 바닥 위에서도 보인다)이 놓인 자리 폭을 채우고 칸이 그 폭을 칸 수로 똑같이 나눈다 — 칸 34 · 글 16 · 700 이고, 고른 칸은 흰 알약(bg-layer-default + 안쪽 짙은 1px stroke-neutral-contrast) 위 fg-neutral 이다. 라디오 묶음이라 ← → ↑ ↓ 로 옮기면 바로 고르고(끝에서 처음으로 돈다) Tab 은 고른 칸 하나에만 선다. 늘 하나가 골라져 있어야 하므로 value(또는 defaultValue)를 주고, 이름은 aria-label 로 단다 — 둘 중 하나가 없으면 레시피가 개발 중에 경고한다.",
    jsx: `import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control"

<SegmentedControl aria-label="할 일 보기" value={view} onValueChange={setView}>
  <SegmentedControlItem value="today">오늘</SegmentedControlItem>
  <SegmentedControlItem value="week">이번 주</SegmentedControlItem>
  <SegmentedControlItem value="all">전체</SegmentedControlItem>
  <SegmentedControlItem value="done">완료</SegmentedControlItem>
</SegmentedControl>`,
    render: () =>
      phone(`${title("할 일")}${pad(segmented({ ariaLabel: "할 일 보기", items: TODO_VIEWS, value: "today" }))}<div style="padding-bottom:var(--spacing-x2);">${TODAY.join("")}</div>`),
  },

  {
    title: "칸 수 — 2 · 3 · 4",
    description:
      "크기 · 변형이 하나다 — 트랙 안쪽 4 + 칸 34 = 42, 칸 위아래 6 · 좌우 12. 칸은 트랙 폭을 칸 수로 똑같이 나누고 최소 폭이 없어, 폰 콘텐츠 폭 312(360 − 좌우 24)에서도 4개가 들어간다(칸 76). 고른 알약은 트랙에 하나 — 폭 (트랙 − 8) ÷ 칸 수이고, 다른 칸을 고르면 그 칸 번호만큼 200ms 로 미끄러진다. 넓은 화면에서는 트랙이 놓인 자리를 채우므로 놓는 자리를 좁혀 둔다. 칸은 2 ~ 4개다 — 5개 이상이면 Chip 의 하나 고르기 줄 · Select 로 두고, 레시피는 칸이 2 ~ 4개가 아니면 개발 중에 경고한다.",
    jsx: `<SegmentedControl aria-label="통계 보기" value={kind} onValueChange={setKind}>
  <SegmentedControlItem value="expense">지출</SegmentedControlItem>
  <SegmentedControlItem value="income">수입</SegmentedControlItem>
</SegmentedControl>

<SegmentedControl aria-label="거래 거르기" value={type} onValueChange={setType}>
  <SegmentedControlItem value="all">전체</SegmentedControlItem>
  <SegmentedControlItem value="expense">지출</SegmentedControlItem>
  <SegmentedControlItem value="income">수입</SegmentedControlItem>
</SegmentedControl>`,
    render: () =>
      phone(pad(stack(COUNTS.map((c) => labeled(c.note, segmented({ ariaLabel: c.ariaLabel, items: c.items, value: c.items[0].value })))))),
  },

  {
    title: "상태",
    description:
      "상태는 enabled · hovered · pressed · focused · disabled 다. 호버(웹 — 마우스 있는 기기에서만)는 누름과 같은 바탕이고 축소가 없다. 안 고른 칸은 bg-neutral-weak-pressed + 안쪽 1px stroke-neutral-weak 에 글이 fg-neutral-muted 로 한 단계 짙어지고(fg-neutral-subtle 이면 다크 3.91:1), 고른 칸은 bg-layer-default-pressed 를 칸에 칠해 알약을 덮는다 — 짙은 1px 는 그대로다. 누르면 그 바탕에 칸은 그대로 두고 안의 글만 2px 거리로 준다 — 배율 (기준 − 2) ÷ 기준, 기준은 칸의 max(높이, 폭 ÷ 4, 24) 이고 모션 줄이기면 줄지 않는다. 포커스는 키보드에만 칸 바깥 링 2px · 띄움 2px stroke-focus-ring(알약을 따라 둥글다)이다. 막힌 칸은 글 fg-disabled · not-allowed 이고 흐리게 하지 않는다 — 고른 채 막히면 칸에 bg-disabled + 짙은 1px stroke-neutral-solid 를 칠해 무엇을 골랐는지 남긴다. 정적 미리보기라 hovered · pressed · focused 는 hover: · active: · focus-visible: · group-active/segmented-item: 클래스에서 접두어만 뗀 사본을 덧붙여 그렸다 — 축소 기준(--press-basis)은 레시피가 누르는 순간 재고, 여기서는 기본값(높이 34)이다. 첫 칸(지출)이 그 상태다.",
    jsx: `// 호버 · 누름 · 포커스는 고르는 prop 이 없다 — 마우스를 올린 동안 · 누르는 동안 · 키보드 포커스에 그렇게 그린다
<SegmentedControl aria-label="통계 보기" value="expense">
  <SegmentedControlItem value="expense">지출</SegmentedControlItem>
  <SegmentedControlItem value="income">수입</SegmentedControlItem>
</SegmentedControl>

// 칸 하나 또는 트랙 전체를 막는다 — 고른 채 막히면 회색 바탕 + 짙은 1px 가 남는다
<SegmentedControlItem value="expense" disabled>지출</SegmentedControlItem>
<SegmentedControl aria-label="통계 보기" value="expense" disabled>…</SegmentedControl>`,
    render: () =>
      surface(
        matrix(
          ["unchecked — 둘째 칸을 골랐다", "checked"],
          STATES.map((state) => [
            state,
            ["income", "expense"].map((value) =>
              segmented({
                ariaLabel: `${value === "expense" ? "checked" : "unchecked"} — ${state}`,
                value,
                items: PAIR.map((it) => ({ ...it, disabled: state === "disabled" && it.value === "expense" })),
                force: { expense: state === "disabled" || state === "enabled" ? undefined : state },
              }),
            ),
          ]),
        ),
      ),
  },

  {
    title: "알림 점 · 막힘",
    description:
      "새 소식이 있는 칸에만 notification 을 준다 — 글 끝에서 2 · 글 위쪽에 6 · fg-brand(브랜드 글자색) 점을 띄우고(칸 폭은 그대로) 보조 기술에는 \"새 소식\" 을 덧붙인다. 고른 칸에는 그리지 않고(레시피가 뺀다), 내용을 보면 notification 을 끈다. 칸 하나(SegmentedControlItem disabled) 또는 트랙 전체(SegmentedControl disabled)를 막을 수 있다 — 막힌 칸은 누를 수 없고 화살표 이동에서 건너뛴다. 늘 하나가 골라져 있어 트랙을 막아도 고른 칸이 보인다(bg-disabled + 1px stroke-neutral-solid).",
    jsx: `<SegmentedControl aria-label="더치페이 보기" value={side} onValueChange={setSide}>
  <SegmentedControlItem value="receive" notification={hasNewRequest}>받을 돈</SegmentedControlItem>
  <SegmentedControlItem value="send">보낼 돈</SegmentedControlItem>
</SegmentedControl>

<SegmentedControl aria-label="할 일 보기" value={view} onValueChange={setView}>
  <SegmentedControlItem value="today">오늘</SegmentedControlItem>
  <SegmentedControlItem value="week">이번 주</SegmentedControlItem>
  <SegmentedControlItem value="all">전체</SegmentedControlItem>
  <SegmentedControlItem value="done" disabled>완료</SegmentedControlItem>
</SegmentedControl>

<SegmentedControl aria-label="할 일 보기" value="today" disabled>…</SegmentedControl>`,
    render: () =>
      phone(
        pad(
          stack([
            labeled("알림 점 — 받을 돈에 새 요청", segmented({ ariaLabel: "더치페이 보기", value: "send", items: [{ value: "receive", label: "받을 돈", notification: true }, { value: "send", label: "보낼 돈" }] })),
            labeled("칸 하나 막힘 — 완료", segmented({ ariaLabel: "할 일 보기", value: "today", items: TODO_VIEWS.map((v) => ({ ...v, disabled: v.value === "done" })) })),
            labeled("트랙 전체 막힘 — 고른 칸은 bg-disabled + 1px stroke-neutral-solid", segmented({ ariaLabel: "할 일 보기", value: "today", items: TODO_VIEWS, disabled: true })),
          ]),
        ),
      ),
  },

  {
    title: "긴 글 — 줄바꿈",
    description:
      "글은 짧게 쓴다(\"이름순\" · \"최근 사용\"). 칸에 비해 글이 길면 단어 단위로 줄을 바꾸고(v114 — keep-all + break-word) 모든 칸이 가장 높은 칸에 맞춰 높아진다 — 트랙 폭을 칸 수로 나누므로 말줄임은 하지 않는다. 미리보기처럼 두 줄이 되면 다른 컴포넌트(Chip 의 하나 고르기 · Select)를 쓴다. 영어처럼 글이 길어지는 언어도 같다 — 번역한 글로 칸 폭을 확인한다.",
    jsx: `// 피한다 — 글이 길어 두 줄이 되면 모든 칸이 높아진다
<SegmentedControl aria-label="프리셋 정렬" value={sort} onValueChange={setSort}>
  <SegmentedControlItem value="most">많이 쓴 순</SegmentedControlItem>
  <SegmentedControlItem value="recent">최근에 사용한 순</SegmentedControlItem>
  <SegmentedControlItem value="name">이름 가나다순</SegmentedControlItem>
</SegmentedControl>

// 짧게
<SegmentedControl aria-label="프리셋 정렬" value={sort} onValueChange={setSort}>
  <SegmentedControlItem value="most">많이 쓴 순</SegmentedControlItem>
  <SegmentedControlItem value="recent">최근 사용</SegmentedControlItem>
  <SegmentedControlItem value="name">이름순</SegmentedControlItem>
</SegmentedControl>`,
    render: () =>
      phone(
        pad(
          stack([
            labeled("길다 — 두 줄, 모든 칸이 높아진다", segmented({ ariaLabel: "프리셋 정렬", value: "most", items: [{ value: "most", label: "많이 쓴 순" }, { value: "recent", label: "최근에 사용한 순" }, { value: "name", label: "이름 가나다순" }] })),
            labeled("짧다 — 한 줄", segmented({ ariaLabel: "프리셋 정렬", value: "most", items: [{ value: "most", label: "많이 쓴 순" }, { value: "recent", label: "최근 사용" }, { value: "name", label: "이름순" }] })),
          ]),
        ),
      ),
  },
];
