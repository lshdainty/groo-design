/*
 * shadcn Tree View 예제 — docs site components/tree-view.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(부서 나무 — 패널 머리의 ⋮ 하나 · 늘 펼친 나무 — 부서 사용자)은 차례 · 제목 · 코드가
 * specs/components/tree-view.md 의 "코드" 절과 같고, 마지막(부모 줄을 누르면 — 고르면서 접힌다)은 md 의 "누르기 — 줄 전체" 를 코드로 더 보인다.
 * SEED 에는 나무가 없다 — 키보드 · 역할은 WAI-ARIA APG Treeview(2026-10-10 사용자 결정 8A), 누르는 자리는 줄 전체다(16D — SEED Accordion
 * "터치 영역은 Chevron 아이콘뿐만 아니라 Trigger 전체" 를 나무 줄에 옮겼다, Apache-2.0). 줄의 값은 Side Navigation 항목 · List 누름이다.
 * groo 에 처음 두는 예제다 — DESIGN.md 의 옛 Treeview 절(v73)을 대신한다.
 *
 * ROW · ROW_IDLE · ROW_SELECTED · CONTENT · CHEVRON_CELL · CHEVRON · ICON · LABEL 은 recipes/shadcn/components/ui/tree-view.tsx 의 상수와, TREE · ITEM ·
 * ROW_GROUP · GROUP · CHEVRON_OPEN 은 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 패널 머리의 ⋮ 는
 * button.tsx 의 값을 옮겨 썼다 — BUTTON_* 는 menu-examples.mjs 의 것과 같다(ghost · medium · 아이콘만). 규칙은 specs/components/tree-view.md,
 * 수치 원본은 specs/components/tree-view.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 나무 <ul role="tree" data-slot="tree-view"> > 항목 <li role="treeitem" tabindex aria-level aria-setsize
 * aria-posinset aria-expanded? aria-selected aria-labelledby data-slot="tree-view-item" data-id> > 줄 <div data-slot="tree-view-row" data-selected?
 * style="padding-left"> > 콘텐츠 층 <span data-slot="tree-view-row-content">(꺾쇠 칸 · 아이콘 · 이름) + 하위 묶음 <ul role="group" data-slot="tree-view-group"
 * hidden?>. 꺾쇠는 표시만이다(따로 누르는 자리가 없다). Tab 정지점(tabindex 0)은 고른 항목 하나다. 이름의 id 는 레시피가 useId 로 만든다 —
 * 미리보기는 읽을 수 있는 이름으로 미리 이었다. 레시피의 스크립트(줄 누르기 · Enter · Space 로 고르기 + 부모 펴고 접기 · ↑ ↓ → ← Home End ·
 * 높이 300ms · 누르는 순간 --press-basis 재기)는 정적 HTML 에 없다 — 줄에 마우스를 올리면 바탕은 레시피 그대로 바뀌지만 고름 · 펼침은 그대로다.
 * 부서 이름은 지어낸 것이다. 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── tree-view.tsx 의 상수와 같은 값 ─────────────────────────────────────

// 줄 — 44 · 위아래 12 · 오른쪽 8 · 모서리 10(왼쪽은 단계마다 style). 호버(웹) · 누름은 bg-layer-default-pressed, 고른 항목은 bg-neutral-weak-pressed 그대로
const ROW = [
  "relative flex min-h-11 cursor-pointer rounded-r2_5 py-x3 pr-x2",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
].join(" ");
const ROW_IDLE = "[@media(hover:hover)]:hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed";
const ROW_SELECTED = "bg-bg-neutral-weak-pressed";
// 콘텐츠 층 — 꺾쇠 · 아이콘 · 이름 사이 6, 첫 줄에 맞춘다. 누르는 동안 이 층만 2px 거리 축소(모션 줄이기면 하지 않는다)
const CONTENT = [
  "relative flex min-w-0 flex-1 items-start gap-x1_5",
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "motion-safe:group-active/tree-row:[scale:calc(1-2/var(--press-basis))]",
].join(" ");
// 꺾쇠 칸 20 × 19 · 아이콘 16 — 표시만(누르는 자리는 줄 전체)
const CHEVRON_CELL = "flex h-[19px] w-5 shrink-0 items-center justify-center text-fg-neutral-subtle";
const CHEVRON = "size-4 shrink-0 [transition:rotate_var(--motion-duration-d6)_var(--motion-ease-easing)] motion-reduce:transition-none";
const ICON = "flex h-[19px] shrink-0 items-center text-fg-neutral-subtle [&>svg]:size-4 [&>svg]:shrink-0";
// 이름 — t4 14 / 19 · 400 · fg-neutral, 줄을 바꾼다(단어 단위)
const LABEL = "min-w-0 flex-1 font-sans text-t4 font-normal text-fg-neutral break-keep [overflow-wrap:break-word]";

// ── tree-view.tsx 의 JSX 에 적힌 클래스 ────────────────────────────────

const TREE = "m-0 list-none px-x2 pb-x4 pt-0";
const ITEM =
  "m-0 list-none p-0 outline-none [&:focus-visible>[data-slot=tree-view-row]]:outline-2 [&:focus-visible>[data-slot=tree-view-row]]:-outline-offset-2 [&:focus-visible>[data-slot=tree-view-row]]:outline-stroke-focus-ring";
const ROW_GROUP = "group/tree-row";
const GROUP = "m-0 list-none p-0";
const CHEVRON_OPEN = "rotate-90";

// ── button.tsx 의 값 — 패널 머리의 ⋮(ghost · medium · 아이콘만 — menu-examples.mjs 와 같다) ──

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
    ghost:
      "bg-transparent text-fg-neutral hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed aria-busy:bg-bg-layer-default-pressed disabled:bg-transparent [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
  },
  size: { medium: "h-10 rounded-r2 [--press-basis:40] [--progress-size:16px]" },
  layout: { withText: "", iconOnly: "" },
  ghostColor: { neutral: "" },
};
const BUTTON_COMPOUND = [{ size: "medium", layout: "iconOnly", className: "w-10 p-x2_5 [&_svg]:size-[18px]" }];
const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

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
const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });

// cn()(twMerge) — ghost 버튼의 disabled:bg-transparent 가 바탕의 disabled:bg-bg-disabled 를 지운다(이 파일이 합치는 무리는 바탕뿐)
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
function merge(classList) {
  const seen = new Set();
  const kept = [];
  for (const cls of classList.split(/\s+/).filter(Boolean).reverse()) {
    const segs = splitVariants(cls);
    const utility = segs.pop();
    if (/^bg-/.test(utility)) {
      const key = `${segs.join(":")}|bg`;
      if (seen.has(key)) continue;
      seen.add(key);
    }
    kept.push(cls);
  }
  return kept.reverse().join(" ");
}

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const svg = (paths, cls = "") =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ""} aria-hidden="true">${paths}</svg>`;
const PATHS = {
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  building2:
    '<path d="M10 12h4"/><path d="M10 8h4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>',
  ellipsisVertical: '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
};

// 부서 스물(부모 3 · 잎 17) — 가장 긴 뿌리 이름은 248 패널에서 줄을 바꾼다. 지어낸 조직이다
const DEPARTMENTS = [
  {
    id: "root",
    label: "포레스트 디지털혁신본부 클라우드 플랫폼 운영 그룹",
    children: [
      { id: "infra", label: "클라우드 인프라팀", children: [{ id: "k8s", label: "쿠버네티스 운영 파트" }, { id: "net", label: "네트워크 · 보안 파트(야간 당직 포함)" }] },
      { id: "data", label: "데이터 플랫폼팀", children: [{ id: "eng", label: "데이터 엔지니어링 파트" }, { id: "ana", label: "분석 파트" }] },
      { id: "ops", label: "경영지원팀" },
      ...Array.from({ length: 12 }, (_, i) => ({ id: `p${i + 1}`, label: `프로젝트 ${i + 1}팀` })),
    ],
  },
];
const PARENT_IDS = ["root", "infra", "data"];

// <TreeView nodes icon selectedId expandedIds collapsible> — 보이는 항목 가운데 Tab 정지점은 고른 항목(없으면 첫 항목)
function tree({ uid, nodes, selectedId = null, expandedIds = PARENT_IDS, collapsible = true, name }) {
  const expanded = new Set(expandedIds);
  const visible = (id, list = nodes, shown = true) => {
    for (const n of list) {
      if (n.id === id) return shown;
      const kids = n.children ?? [];
      if (kids.length && visible(id, kids, shown && (!collapsible || expanded.has(n.id)))) return true;
    }
    return false;
  };
  const tabStop = selectedId != null && visible(selectedId) ? selectedId : nodes[0].id;
  const item = (node, level, posinset, setsize) => {
    const kids = node.children ?? [];
    const parent = kids.length > 0;
    const open = !collapsible || expanded.has(node.id);
    const selected = selectedId === node.id;
    const labelId = `${uid}-${node.id}-label`;
    const groupId = `${uid}-${node.id}-group`;
    const li = attrs([
      'role="treeitem"',
      `tabindex="${tabStop === node.id ? 0 : -1}"`,
      `aria-level="${level}"`,
      `aria-setsize="${setsize}"`,
      `aria-posinset="${posinset}"`,
      collapsible && parent && `aria-expanded="${open}"`,
      `aria-selected="${selected}"`,
      `aria-labelledby="${labelId}"`,
      'data-slot="tree-view-item"',
      `data-id="${node.id}"`,
      `class="${ITEM}"`,
    ]);
    const chevron = collapsible
      ? `<span aria-hidden="true" data-slot="tree-view-chevron" class="${CHEVRON_CELL}">${parent ? svg(PATHS.chevronRight, [CHEVRON, open && CHEVRON_OPEN].filter(Boolean).join(" ")) : ""}</span>`
      : "";
    const row = `<div ${attrs([
      'data-slot="tree-view-row"',
      selected && 'data-selected=""',
      `class="${[ROW_GROUP, ROW, selected ? ROW_SELECTED : ROW_IDLE].join(" ")}"`,
      `style="padding-left:calc(var(--spacing-x2) + ${level - 1} * var(--spacing-x5))"`,
    ])}><span data-slot="tree-view-row-content" class="${CONTENT}">${chevron}<span aria-hidden="true" data-slot="tree-view-icon" class="${ICON}">${svg(PATHS.building2)}</span><span id="${labelId}" data-slot="tree-view-label" class="${LABEL}">${esc(node.label)}</span></span></div>`;
    const group = parent
      ? `<ul id="${groupId}" role="group" data-slot="tree-view-group" data-state="${open ? "open" : "closed"}"${open ? "" : ' hidden=""'} class="${GROUP}">${kids.map((k, i) => item(k, level + 1, i + 1, kids.length)).join("")}</ul>`
      : "";
    return `<li ${li}>${row}${group}</li>`;
  };
  return `<ul ${attrs([
    'role="tree"',
    'data-slot="tree-view"',
    !collapsible && 'data-collapsible="false"',
    `class="${TREE}"`,
    name,
  ])}>${nodes.map((n, i) => item(n, 1, i + 1, nodes.length)).join("")}</ul>`;
}

// <Button variant="ghost" layout="iconOnly"> ⋮ — ResponsiveMenuTrigger asChild(1280 이상 MenuTrigger)가 Radix 의 속성과 data-slot 을 얹는다(닫힌 채)
const moreButton = ({ id, name }) =>
  `<button ${attrs([
    'type="button"',
    `id="${id}"`,
    'aria-haspopup="menu"',
    'aria-expanded="false"',
    'data-state="closed"',
    'data-slot="menu-trigger"',
    `class="${merge(buttonVariants({ variant: "ghost", layout: "iconOnly" }))}"`,
    `aria-label="${esc(name)}"`,
  ])}>${svg(PATHS.ellipsisVertical)}</button>`;

// 부서 패널(화면의 내용) — HR 관리 > 회사의 왼쪽 248(1280 에서 본문 992 의 25% — resizable.yaml). 패널 머리는 위 12 · 오른쪽 8 · 아래 8 · 왼쪽 16, 제목 18 / 24 · 700(tree-view.yaml header · title)
const panel = (html, height = 0) =>
  `<div style="width:248px; max-width:100%;${height ? ` height:${height}px; overflow-y:auto;` : ""} border-radius:var(--radius-r4); background:var(--color-bg-layer-default); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle); font-family:var(--font-sans); color:var(--color-fg-neutral);">${html}</div>`;
const panelHead = (titleId, right = "") =>
  `<div class="flex items-center justify-between" style="padding:var(--spacing-x3) var(--spacing-x2) var(--spacing-x2) var(--spacing-x4); gap:var(--spacing-x2);"><h2 id="${titleId}" style="margin:0; font-size:var(--text-t5); line-height:var(--text-t5--line-height); font-weight:700;">부서</h2>${right}</div>`;
const CAPTION = "display:block; margin-top:var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="min-width:0;">${html}<span style="${CAPTION}">${esc(caption)}</span></div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const treeViewExamples = [
  {
    title: "부서 나무 — 패널 머리의 ⋮ 하나",
    description:
      "여러 단계로 된 항목 가운데 하나를 고르는 나무다 — HR 관리 > 회사의 부서 패널(248 — 본문 992 의 25%)이고, 고른 부서의 조직도가 옆에 보인다. 줄은 Side Navigation 항목과 같다 — 높이 44 · 위아래 12 · 좌우 8 · 모서리 10, 이름 14 / 19 · 400 · fg-neutral, 나무는 패널 가장자리에서 8 들어온다. 단계마다 20 을 들이고(줄 왼쪽 = 8 + (단계 − 1) × 20), 꺾쇠 칸 20(chevron-right 16 · fg-neutral-subtle — 펼치면 아래로 90°) · 아이콘 16 · 이름 사이 6 이다. 하위가 없는 잎은 꺾쇠 칸을 같은 폭으로 비운다. 가장 긴 뿌리 이름도 말줄임 없이 줄을 바꿔 다 보인다. 고른 항목은 Side Navigation 의 지금 항목과 같은 바탕 bg-neutral-weak-pressed 이고, 나무 전체가 Tab 정지점 하나(고른 항목)다. 노드마다 단추를 두지 않는다 — 추가 · 수정 · 삭제는 패널 머리의 ⋮ 하나(Button ghost · iconOnly · medium — 이름 \"경영지원팀 더보기\", 고른 부서가 바뀌면 이름도 바뀐다)가 고른 항목에 건다. 그림은 모두 펼친 채 연 나무에서 경영지원팀을 고른 모습이다.",
    jsx: `import { Building2, EllipsisVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ResponsiveMenu,
  ResponsiveMenuContent,
  ResponsiveMenuGroup,
  ResponsiveMenuItem,
  ResponsiveMenuTrigger,
} from "@/components/ui/menu"
import { TreeView } from "@/components/ui/tree-view"

<div className="flex items-center justify-between">
  <h2 id="department-title">부서</h2>
  {/* 노드마다 단추를 두지 않는다 — 고른 부서에 거는 ⋮ 하나 */}
  <ResponsiveMenu>
    <ResponsiveMenuTrigger asChild>
      <Button variant="ghost" layout="iconOnly" aria-label={\`\${selected.label} 더보기\`}>
        <EllipsisVertical />
      </Button>
    </ResponsiveMenuTrigger>
    <ResponsiveMenuContent title={selected.label}>
      <ResponsiveMenuGroup>
        <ResponsiveMenuItem label="하위 부서 추가" onSelect={addChild} />
        <ResponsiveMenuItem label="수정" onSelect={edit} />
      </ResponsiveMenuGroup>
      <ResponsiveMenuGroup>
        <ResponsiveMenuItem label="삭제" tone="critical" onSelect={askDelete} />
      </ResponsiveMenuGroup>
    </ResponsiveMenuContent>
  </ResponsiveMenu>
</div>
<TreeView
  aria-labelledby="department-title"
  nodes={departments}
  icon={<Building2 />}
  selectedId={selected.id}
  onSelectedChange={setSelectedId}
  defaultExpandedIds={parentIds}
/>`,
    render: () =>
      panel(
        `${panelHead("tree-ex-department-title", moreButton({ id: "tree-ex-department-more", name: "경영지원팀 더보기" }))}${tree({
          uid: "tree-ex-department",
          nodes: DEPARTMENTS,
          selectedId: "ops",
          name: 'aria-labelledby="tree-ex-department-title"',
        })}`,
        560,
      ),
  },

  {
    title: "늘 펼친 나무 — 부서 사용자",
    description:
      "접지 않는 화면(부서 사용자 — 부서를 고르고 사용자를 옮기는 자리)은 collapsible={false} 다 — 꺾쇠를 그리지 않고 꺾쇠 칸도 빼며 aria-expanded 를 두지 않는다. 들임만으로 단계를 보인다. 줄을 누르면(Enter · Space 도) 고르기만 하고 접히지 않는다 — → 는 첫 하위로, ← 는 부모로 옮기기만 한다. 접히지 않는데 꺾쇠 · \"펼쳐짐\" 이 남으면 누를 수 있는 것처럼 보인다(지금 HR 의 부서 사용자 화면). 줄 · 들임 · 고른 바탕은 접고 펴는 나무와 같다.",
    jsx: `import { Building2 } from "lucide-react"
import { TreeView } from "@/components/ui/tree-view"

{/* 접지 않는다 — 꺾쇠 · aria-expanded 없이 들임만 */}
<TreeView aria-label="부서" nodes={departments} icon={<Building2 />} collapsible={false} selectedId={selectedId} onSelectedChange={setSelectedId} />`,
    render: () => panel(`<div style="height:var(--spacing-x2);"></div>${tree({ uid: "tree-ex-fixed", nodes: DEPARTMENTS, selectedId: "infra", collapsible: false, name: 'aria-label="부서"' })}`, 480),
  },

  {
    title: "부모 줄을 누르면 — 고르면서 접힌다",
    description:
      "누르는 자리는 줄 전체(줄 폭 × 44 이상)다 — 꺾쇠만 누르는 작은 자리(31 × 44)를 두지 않는다(사용자 결정 16D). 잎을 누르면 고른다. 부모 줄을 누르면 그 항목을 고르면서 접힌 하위는 펴고, 펼친 하위는 접는다 — 꺾쇠를 눌러도 같다(표시만이다). Enter · Space 는 누르기와 같고, → ← 는 고르지 않고 펴고 접기만 한다. 그림은 펼쳐 있던 클라우드 인프라팀을 누른 뒤다 — 골라지며 하위 둘이 접혔고(aria-expanded=\"false\" · 꺾쇠 오른쪽), 한 번 더 누르거나 → 로 다시 편다. 하위 묶음은 높이 300ms motion-ease-easing 으로 접히고(Accordion 과 같다) 모션 줄이기면 150ms 서서히 · 꺾쇠는 바로다.",
    jsx: `{/* 줄을 누르면 onSelectedChange · onExpandedChange 가 함께 불린다(부모) — 꺾쇠에 따로 이벤트가 없다 */}
<TreeView
  aria-labelledby="department-title"
  nodes={departments}
  icon={<Building2 />}
  selectedId={selectedId}
  onSelectedChange={setSelectedId}
  expandedIds={expandedIds}
  onExpandedChange={setExpandedIds}
/>`,
    render: () =>
      labeled(
        panel(`${panelHead("tree-ex-press-title", moreButton({ id: "tree-ex-press-more", name: "클라우드 인프라팀 더보기" }))}${tree({
          uid: "tree-ex-press",
          nodes: DEPARTMENTS,
          selectedId: "infra",
          expandedIds: ["root", "data"],
          name: 'aria-labelledby="tree-ex-press-title"',
        })}`, 420),
        "클라우드 인프라팀을 누름 — 고르며 접힘(aria-selected · aria-expanded=false)",
      ),
  },
];
