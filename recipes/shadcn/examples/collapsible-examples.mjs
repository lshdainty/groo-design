/*
 * shadcn Collapsible 예제 — docs site components/collapsible.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 셋(거래 상세 — 분할 내역 · 분할 — 빠르게 맞추기(경고 상자 안) · HR 업무 보고 — 상세 검색 조건(카드))은
 * 차례 · 제목 · 코드가 specs/components/collapsible.md 의 "코드" 절과 같고, 마지막(접힌 모습 · 막힘)은 md 의 State 를 코드로 더 보인다.
 * SEED 에는 Collapsible 이 없다 — Accordion 가이드의 한 줄("단일 콘텐츠를 접고 펼치는 용도는 해당 아이템에 Collapsible 동작을 활용", Apache-2.0)대로
 * 트리거는 Accordion 항목 하나의 모양이다(2026-10-10 사용자 결정 9A). 옛 예제("스타일 0 · 동작만" · Button 으로 감싼 트리거 · "더 보기")를 대신한다.
 *
 * ROOT 는 recipes/shadcn/components/ui/collapsible.tsx 의 상수와, TRIGGER_* · CONTENT_* · TITLE_* · DESCRIPTION_* · CHEVRON_* 는 그 파일이 부르는
 * accordion.tsx 의 짜임 함수가 cn() 으로 잇는 글(accordion-examples.mjs 의 것)과, BODY · PANEL_* 는 collapsible.tsx 의 JSX · panelPadding 에 적힌 클래스와
 * 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 규칙은 specs/components/collapsible.md, 수치 원본은 specs/components/collapsible.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — <div data-slot="collapsible" data-state data-surface> > 머리말 <h3 data-slot="collapsible-heading"> >
 * 트리거 <button aria-expanded aria-controls data-slot="collapsible-trigger"> > 콘텐츠 층 <span data-slot="collapsible-trigger-content">(본문(이름 · 설명) · 꺾쇠) +
 * 펼친 내용 <div data-slot="collapsible-content" hidden?> > <div data-slot="collapsible-content-inner" data-layout>. 경고 상자(box)는 화면이 그린다.
 * 트리거 · 내용의 id 는 레시피가 useId 로 만든다 — 미리보기는 읽을 수 있는 이름으로 미리 이었다. 레시피의 스크립트(펼치고 접기 · 높이 300ms ·
 * 누르는 순간 --press-basis 재기)는 정적 HTML 에 없다 — 그림은 그 순간을 멈춘 것이다. 분할 줄 · 경고 글 · 빠르게 맞추기의 고를 것 · 검색 조건 칸은
 * 화면의 내용(미리보기 그림)이다. 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── collapsible.tsx 의 상수와 같은 값 ───────────────────────────────────

// 놓인 면 — card 는 Card 면(바닥 위 흰 면 + 1px · 모서리 16, 누름 바탕 · 펼친 내용을 모서리에서 자른다), warning 은 트리거 위 1px 선(상자 폭 끝까지)
const ROOT = {
  default: "relative",
  card: "relative overflow-hidden rounded-r4 border border-solid border-stroke-neutral-weak bg-bg-layer-default",
  warning: "relative border-0 border-t border-solid border-stroke-warning-weak",
};

// ── accordion.tsx 의 짜임 함수가 잇는 글(Collapsible 트리거가 그대로 쓴다) ──

const TRIGGER_BASE = "group/accordion-trigger relative flex min-h-[54px] w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-left font-sans";
const TRIGGER_PRESSED = {
  layer: "[--trigger-pressed:var(--color-bg-layer-default-pressed)]",
  warning: "[--trigger-pressed:var(--color-bg-warning-weak-pressed)]",
};
const TRIGGER_STATE = [
  "before:pointer-events-none before:absolute before:inset-y-0 before:inset-x-0 before:rounded-none before:bg-transparent before:content-['']",
  "before:[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),inset_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-radius_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[@media(hover:hover)]:enabled:hover:before:inset-x-x1_5 [@media(hover:hover)]:enabled:hover:before:rounded-r2_5 [@media(hover:hover)]:enabled:hover:before:bg-(--trigger-pressed)",
  "enabled:active:before:inset-x-x1_5 enabled:active:before:rounded-r2_5 enabled:active:before:bg-(--trigger-pressed)",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed",
].join(" ");
// 링의 모서리 — 흰 면은 각진 링, 카드는 14(16 − 2), 경고 상자는 10(12 − 2)
const TRIGGER_RING = { square: "rounded-none", r3_5: "rounded-r3_5", r2_5: "rounded-r2_5" };
const CONTENT_BASE = "relative flex w-full min-w-0 items-center gap-x3 py-x4";
const CONTENT_PADX = { gutter: "px-global-gutter", x4: "px-x4" };
const CONTENT_TRANSITION = "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const CONTENT_PRESS = "group-active/accordion-trigger:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/accordion-trigger:[scale:1]";
const TITLE_BASE = "font-sans text-t5 font-medium break-keep [overflow-wrap:break-word]";
const TITLE_COLOR = { enabled: "text-fg-neutral", disabled: "text-fg-disabled" };
const DESCRIPTION_BASE = "font-sans text-t3 font-medium break-keep [overflow-wrap:break-word]";
const DESCRIPTION_COLOR = { enabled: "text-fg-neutral-subtle", disabled: "text-fg-disabled" };
const CHEVRON_BASE = "size-5 shrink-0 [transition:rotate_var(--motion-duration-d6)_var(--motion-ease-easing)] motion-reduce:transition-none";
const CHEVRON_OPEN = "rotate-180";
const CHEVRON_COLOR = { enabled: "text-fg-neutral-subtle", disabled: "text-fg-disabled" };

// ── collapsible.tsx 의 JSX · panelPadding 에 적힌 클래스 ────────────────

const HEADING = "m-0 flex";
const BODY = "flex min-w-0 flex-1 flex-col items-start gap-x0_5";
// 펼친 내용의 여백 — 위 0 · 좌우는 트리거와 같다(흰 면 · 카드 24, 경고 상자 16). 아래는 글 16 · 줄 목록 8 · 카드 24
const PANEL_TOP = "pt-0";
const PANEL_X = { gutter: "px-global-gutter", x4: "px-x4" };
const PANEL_BOTTOM = { text: "pb-x4", rows: "pb-x2", card: "pb-x6" };

// ── 짜임 — 레시피처럼 차례대로 잇는다 ─────────────────────────────────

const tone = (disabled) => (disabled ? "disabled" : "enabled");
const triggerClass = (surface) =>
  [TRIGGER_BASE, TRIGGER_PRESSED[surface === "warning" ? "warning" : "layer"], TRIGGER_STATE, TRIGGER_RING[surface === "card" ? "r3_5" : surface === "warning" ? "r2_5" : "square"]].join(" ");
const contentClass = (surface, disabled) => [CONTENT_BASE, CONTENT_PADX[surface === "warning" ? "x4" : "gutter"], CONTENT_TRANSITION, !disabled && CONTENT_PRESS].filter(Boolean).join(" ");
const panelClass = (surface, layout) =>
  [PANEL_TOP, PANEL_X[surface === "warning" ? "x4" : "gutter"], PANEL_BOTTOM[surface === "card" ? "card" : layout === "rows" ? "rows" : "text"]].join(" ");

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const svg = (paths, cls = "") =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ""} aria-hidden="true">${paths}</svg>`;
const CHEVRON_DOWN = '<path d="m6 9 6 6 6-6"/>';

// 돈은 원까지, 빼기는 U+2212
const won = (n) => `${n < 0 ? "−" : ""}${Math.abs(n).toLocaleString("ko-KR")}원`;

// 1억 넘는 거래를 6건으로 나눈 내역 — 지어낸 거래다
const SPLITS = [
  { title: "전세 보증금 잔금(계약금 · 중도금 제외)", category: "주거 · 월세", amount: 100000000, hue: "indigo" },
  { title: "관리비", category: "주거 · 관리비", amount: 12000000, hue: "indigo" },
  { title: "휴대폰 · 인터넷 · TV", category: "통신", amount: 456789, hue: "indigo" },
  { title: "배달 · 포장 · 테이크아웃 주문", category: "식비", amount: 1000000, hue: "orange" },
  { title: "택시", category: "교통", amount: 5000000, hue: "blue" },
  { title: "사료 · 간식", category: "반려동물", amount: 5000000, hue: "green" },
];
const SPLIT_TOTAL = SPLITS.reduce((s, x) => s + x.amount, 0);
const SHORTFALL = 3456789;
const QUICK_FIXES = ["첫 내역에 모자란 금액 더하기", "모자란 금액을 새 내역으로", "남은 금액을 내역마다 똑같이 나누기"];
const FILTER_FIELDS = [
  ["기간", "2026. 10. 1. ~ 2026. 10. 31."],
  ["작성자", "김민수 · 이서연"],
  ["프로젝트", "전체"],
  ["상태", "전체"],
];

// <Collapsible open surface disabled> + <CollapsibleTrigger title description> + <CollapsibleContent layout> — 펼침이 아니면 내용은 hidden
function collapsible({ uid, surface = "default", title, description, layout = "text", open = false, disabled = false, contentHtml }) {
  const state = open ? "open" : "closed";
  const triggerId = `${uid}-trigger`;
  const contentId = `${uid}-content`;
  const button = attrs([
    'type="button"',
    `id="${triggerId}"`,
    `aria-expanded="${open}"`,
    `aria-controls="${contentId}"`,
    disabled && "disabled",
    'data-slot="collapsible-trigger"',
    `data-state="${state}"`,
    `class="${triggerClass(surface)}"`,
  ]);
  const text = `<span data-slot="collapsible-trigger-body" class="${BODY}"><span data-slot="collapsible-title" class="${TITLE_BASE} ${TITLE_COLOR[tone(disabled)]}">${esc(title)}</span>${
    description ? `<span data-slot="collapsible-description" class="${DESCRIPTION_BASE} ${DESCRIPTION_COLOR[tone(disabled)]}">${esc(description)}</span>` : ""
  }</span>`;
  const chevron = svg(CHEVRON_DOWN, [CHEVRON_BASE, open && CHEVRON_OPEN, CHEVRON_COLOR[tone(disabled)]].filter(Boolean).join(" "));
  const trigger = `<h3 data-slot="collapsible-heading" class="${HEADING}"><button ${button}><span data-slot="collapsible-trigger-content" class="${contentClass(surface, disabled)}">${text}${chevron}</span></button></h3>`;
  const panel = `<div id="${contentId}" data-slot="collapsible-content" data-state="${state}"${open ? "" : ' hidden=""'}><div data-slot="collapsible-content-inner" data-layout="${layout}" class="${panelClass(surface, layout)}">${contentHtml}</div></div>`;
  return `<div ${attrs(['data-slot="collapsible"', `data-state="${state}"`, `data-surface="${surface}"`, disabled && 'data-disabled=""', `class="${ROOT[surface]}"`])}>${trigger}${panel}</div>`;
}

// 분할 줄(화면의 내용) — 카테고리 색 점 8 · 이름 15 / 21 · 500 + 카테고리 13 · 금액 15 / 21 · 600, 줄마다 위아래 12(좌우 0 — 패널이 들인다)
const SPLIT_ROW = "display:flex; align-items:flex-start; gap:var(--spacing-x3); padding:var(--spacing-x3) 0;";
const splitRows = () =>
  SPLITS.map(
    (s) =>
      `<div style="${SPLIT_ROW}"><span aria-hidden="true" style="width:8px; height:8px; margin-top:7px; flex-shrink:0; border-radius:var(--radius-full); background:var(--color-chart-${s.hue});"></span><span style="display:flex; flex:1; min-width:0; flex-direction:column;"><span style="font-size:15px; line-height:21px; font-weight:500; color:var(--color-fg-neutral);">${esc(s.title)}</span><span style="font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle);">${esc(s.category)}</span></span><span style="font-size:15px; line-height:21px; font-weight:600; color:var(--color-fg-neutral); font-variant-numeric:tabular-nums; white-space:nowrap;">${won(-s.amount)}</span></div>`,
  ).join("");

// 경고 글(화면의 내용) — 상자 위 14 · 좌우 16 · 아래 12
const shortfallMessage = () =>
  `<div style="display:flex; flex-direction:column; gap:var(--spacing-x0_5);"><span style="font-size:15px; line-height:21px; font-weight:600; color:var(--color-fg-neutral);">분할 합계가 ${won(SHORTFALL)} 모자라요.</span><span style="font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle); font-variant-numeric:tabular-nums;">거래 ${won(SPLIT_TOTAL)} · 분할 합계 ${won(SPLIT_TOTAL - SHORTFALL)}</span></div>`;
// 빠르게 맞추기의 고를 것(화면의 내용) — 흰 면 줄 40 · 사이 8
const quickFixes = () =>
  `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2);">${QUICK_FIXES.map((t) => `<button type="button" style="display:flex; align-items:center; min-height:40px; padding:0 var(--spacing-x3); border:0; border-radius:var(--radius-r2_5); background:var(--color-bg-layer-default); font-family:var(--font-sans); font-size:var(--text-t4); line-height:var(--text-t4--line-height); font-weight:500; color:var(--color-fg-neutral); text-align:left; cursor:pointer;">${esc(t)}</button>`).join("")}</div>`;
// 상세 검색 조건 칸(화면의 내용) — 라벨 14 · 500 + 값 상자 40, 넷을 나란히(좁으면 둘씩)
const filterFields = () =>
  `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 180px), 1fr)); gap:var(--spacing-x4);">${FILTER_FIELDS.map(
    ([k, v]) =>
      `<label style="display:flex; flex-direction:column; gap:var(--spacing-x2); min-width:0;"><span style="font-size:var(--text-t4); line-height:var(--text-t4--line-height); font-weight:500; color:var(--color-fg-neutral);">${esc(k)}</span><input readonly value="${esc(v)}" style="box-sizing:border-box; height:40px; min-width:0; padding:0 var(--spacing-x3); border:1px solid var(--color-stroke-neutral-weak); border-radius:var(--radius-r2); background:var(--color-bg-layer-default); font-family:var(--font-sans); font-size:var(--text-t4); color:var(--color-fg-neutral);"></label>`,
  ).join("")}</div>`;

// 미리보기 틀 — 흰 면(대화상자 본문 자리) · 바닥(bg-layer-basement). 레시피의 대화상자 · 화면이 아니라 그 자리만 그린 그림이다
const surface = (html, maxWidth = "390px") =>
  `<div style="max-width:${maxWidth}; padding:var(--spacing-x2) 0; border-radius:var(--radius-r4); background:var(--color-bg-layer-default); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle); color:var(--color-fg-neutral); font-family:var(--font-sans);">${html}</div>`;
const floor = (html, maxWidth = "760px") =>
  `<div style="max-width:${maxWidth}; padding:var(--spacing-x6); border-radius:var(--radius-r4); background:var(--color-bg-layer-basement); color:var(--color-fg-neutral); font-family:var(--font-sans);">${html}</div>`;
// 경고 상자 — md 코드의 box(화면이 그린다): 바탕 bg-warning-weak · 1px stroke-warning-weak · 모서리 12 · 경고 글 위 14 · 좌우 16 · 아래 12
const WARNING_BOX = "overflow-hidden rounded-r3 border border-stroke-warning-weak bg-bg-warning-weak";
const WARNING_TEXT = "px-x4 pb-x3 pt-x3_5";

// ── 예제 ──────────────────────────────────────────────────────────────────

export const collapsibleExamples = [
  {
    title: "거래 상세 — 분할 내역",
    description:
      "내용 하나를 접고 펴는 자리의 트리거는 Accordion 항목 하나의 모양이다 — 줄 전체가 누르는 자리(머리말 안의 단추), 이름 16 / 22 · 500 · fg-neutral, 설명 13 / 18 · 500 · fg-neutral-subtle(이름 아래 2), 꺾쇠 20, 위아래 16 · 좌우 24 이고 이름만이면 54, 설명이 있으면 74 다. 이름은 무엇을 여닫는지 고정한다(\"내역 분할 6개\") — 접혀 있어도 알아야 할 합계는 설명으로 두고(\"합계 −123,456,789원\" — 원까지 · 빼기는 U+2212), 펼침은 aria-expanded 가 알린다. 줄 목록(layout=\"rows\")이면 펼친 내용 아래는 8 — 줄마다 위아래 12 를 가져 마지막 줄의 글 아래로 20 이 된다. 펼친 뒤 초점은 트리거에 그대로고 화면을 저절로 스크롤하지 않는다. 지금의 머리 + 오른쪽 글 단추(128.9 × 18 · aria-expanded 없음)를 대신한다.",
    jsx: `import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

<Collapsible defaultOpen>
  <CollapsibleTrigger title={\`내역 분할 \${splits.length}개\`} description={\`합계 \${formatWon(total)}\`} />
  <CollapsibleContent layout="rows">{splits.map(renderSplitRow)}</CollapsibleContent>
</Collapsible>`,
    render: () =>
      surface(
        collapsible({ uid: "cls-ex-split", title: `내역 분할 ${SPLITS.length}개`, description: `합계 ${won(-SPLIT_TOTAL)}`, layout: "rows", open: true, contentHtml: splitRows() }),
      ),
  },

  {
    title: "분할 — 빠르게 맞추기(경고 상자 안)",
    description:
      "경고 상자 안의 맨 아래 줄은 surface=\"warning\" 이다 — 상자(bg-warning-weak · 1px stroke-warning-weak · 모서리 12 · 경고 글 위 14 · 좌우 16 · 아래 12)는 화면이 그리고, 트리거 · 펼친 내용은 상자의 안쪽 여백에 맞춰 좌우 16, 위에 1px stroke-warning-weak 선이 상자 폭 끝까지 간다. 누르거나 올리면 바탕은 경고 바탕의 누름 짝 bg-warning-weak-pressed 다(꺾쇠 4.37 · 이름 13.04). 상자의 overflow: hidden 이 아래 줄의 누름 바탕을 모서리에서 자르고, 키보드 포커스 링은 안쪽 2px · 모서리 10(12 − 2)이다. 지금의 \"✦ 빠르게 맞추기 ⌄\"(103 × 16.5 · 11 / 700 브랜드)를 대신한다.",
    jsx: `import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

{/* 경고 상자(box)는 화면이 그린다 — 경고 글 아래 맨 끝 줄이 Collapsible(좌우 16 · 위 선 · 누름은 경고 바탕의 누름 색) */}
<div className="overflow-hidden rounded-r3 border border-stroke-warning-weak bg-bg-warning-weak">
  <div className="px-x4 pb-x3 pt-x3_5">{shortfallMessage}</div>
  <Collapsible surface="warning">
    <CollapsibleTrigger title="빠르게 맞추기" />
    <CollapsibleContent>{quickFixes}</CollapsibleContent>
  </Collapsible>
</div>`,
    render: () =>
      `<div style="max-width:390px; padding:var(--spacing-x4) var(--spacing-global-gutter); border-radius:var(--radius-r4); background:var(--color-bg-layer-default); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle); font-family:var(--font-sans);"><div class="${WARNING_BOX}"><div class="${WARNING_TEXT}">${shortfallMessage()}</div>${collapsible({
        uid: "cls-ex-quick",
        surface: "warning",
        title: "빠르게 맞추기",
        open: true,
        contentHtml: quickFixes(),
      })}</div></div>`,
  },

  {
    title: "HR 업무 보고 — 상세 검색 조건(카드)",
    description:
      "surface=\"card\" 는 Collapsible 자체가 Card 면(바닥 위 bg-layer-default · 1px stroke-neutral-weak · 모서리 16)이고 트리거가 그 머리다 — 툴바의 \"필터 2\" 단추가 아니라 조건 카드의 머리가 된다. 펼친 내용은 카드 안 여백 24 로 끝난다(좌우 24 · 아래 24). 적용한 필터 수는 이름에 붙이지 않고 설명으로 둔다(\"상세 검색 조건\" · \"2개 필터 적용 중\" — \"필터2\" 처럼 읽히지 않는다), 적용한 것이 없으면 설명을 뺀다. 누름 바탕은 카드 모서리 16 과 동심인 10, 키보드 포커스 링은 카드 모서리를 따라 14 다.",
    jsx: `import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

<Collapsible surface="card" open={filtersOpen} onOpenChange={setFiltersOpen}>
  <CollapsibleTrigger
    title="상세 검색 조건"
    description={appliedCount > 0 ? \`\${appliedCount}개 필터 적용 중\` : undefined}
  />
  <CollapsibleContent>{filterFields}</CollapsibleContent>
</Collapsible>`,
    render: () =>
      floor(collapsible({ uid: "cls-ex-filter", surface: "card", title: "상세 검색 조건", description: "2개 필터 적용 중", open: true, contentHtml: filterFields() })),
  },

  {
    title: "접힌 모습 · 막힘",
    description:
      "접혀 있으면 펼친 내용을 그리지 않는다(hidden — 보조 기술도 읽지 않는다) — 이름 · 설명은 그대로라 접혀 있어도 합계 · 필터 수가 보인다. 꺾쇠는 접혀 있으면 아래, 펼치면 위(180°)이고 펼침 · 꺾쇠는 Accordion 과 같은 300ms motion-ease-easing, 모션 줄이기면 높이 움직임 없이 150ms 서서히 · 꺾쇠는 바로다. 막힘(disabled)은 이름 · 설명 · 꺾쇠가 모두 fg-disabled 이고 흐리게 하지 않는다 — 누르기 · 키보드가 막히고, 펼친 채 막히면 내용은 그대로 보인다.",
    jsx: `<Collapsible>
  <CollapsibleTrigger title="내역 분할 6개" description="합계 −123,456,789원" />
  <CollapsibleContent layout="rows">{splits.map(renderSplitRow)}</CollapsibleContent>
</Collapsible>
{/* 이미 정산한 거래 — 분할 내역을 바꿀 수 없어 막는다 */}
<Collapsible disabled>
  <CollapsibleTrigger title="내역 분할 6개" description="정산 완료 · 합계 −123,456,789원" />
  <CollapsibleContent layout="rows">{splits.map(renderSplitRow)}</CollapsibleContent>
</Collapsible>`,
    render: () =>
      surface(
        `${collapsible({ uid: "cls-ex-closed", title: `내역 분할 ${SPLITS.length}개`, description: `합계 ${won(-SPLIT_TOTAL)}`, layout: "rows", contentHtml: splitRows() })}${collapsible({
          uid: "cls-ex-disabled",
          title: `내역 분할 ${SPLITS.length}개`,
          description: `정산 완료 · 합계 ${won(-SPLIT_TOTAL)}`,
          layout: "rows",
          disabled: true,
          contentHtml: splitRows(),
        })}`,
      ),
  },
];
