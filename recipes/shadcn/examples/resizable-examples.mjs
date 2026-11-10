/*
 * shadcn Resizable 예제 — docs site components/resizable.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 하나(HR 관리 — 부서 나무 | 조직도)는 차례 · 제목 · 코드가
 * specs/components/resizable.md 의 "코드" 절과 같고, 뒤의 하나(목록 폭 20 · 40 · 끄는 동안)는 md 의 Properties 를 코드로 더 보인다.
 * SEED 에는 Resizable 이 없다(모바일 앱 중심) — 손잡이 · 범위 · 키보드 · 기억은 groo 가 정했고(2026-10-10 사용자 결정 12B),
 * 키보드는 WAI-ARIA APG Window Splitter 다. 옛 예제(가로 · 세로 · 손잡이 상자 12 × 16 · 인라인 style)를 대신한다.
 * 대시보드 위젯 크기 예제 둘은 걷었다(2026-11-10 사용자 결정 11A — 제품은 2026-10-23 HB1 C).
 *
 * LINE · SEPARATOR · GRIP 은 recipes/shadcn/components/ui/resizable.tsx 의 상수와, GROUP · PANEL_LIST · PANEL_FILL 은
 * 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다.
 * 규칙은 specs/components/resizable.md, 수치 원본은 specs/components/resizable.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 나눈 자리 <div data-slot="resizable-panel-group"> > 목록 패널 <div data-slot="resizable-panel" data-panel="list"
 * style="flex-basis"> · 손잡이 <div data-slot="resizable-handle">(선) > <div role="separator" data-slot="resizable-separator">(누르는 폭 16) >
 * <span data-slot="resizable-grip">(손잡이 표시) · 남는 폭 패널 <div data-panel="fill">.
 * 레시피의 스크립트(끌기 · 한 번 누르기 25 ↔ 40 · ← → 5% · Home · End · Enter · 화면마다 폭 기억)는 정적 HTML 에 없다 —
 * 손잡이에 마우스를 올리면 선이 짙어지는 것은 레시피 그대로지만 폭은 그대로다. 부서 나무 · 조직도는 화면의 내용(미리보기 그림)이다.
 */

// ── resizable.tsx 의 상수와 같은 값 ─────────────────────────────────────

// 선 1px — 올리거나(마우스) 키보드 초점 · 누르는 동안 손잡이 표시와 같은 색
const LINE = [
  "group/resizable-handle relative z-[1] w-px shrink-0 self-stretch bg-stroke-neutral-weak",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[@media(hover:hover)]:hover:bg-stroke-neutral-solid has-[:focus-visible]:bg-stroke-neutral-solid data-[active]:bg-stroke-neutral-solid",
].join(" ");
// 누르는 폭 16 — 선 가운데로 양쪽 8. 키보드 포커스에만 둘레 링 2px · 모서리 4
const SEPARATOR = [
  "absolute inset-y-0 left-1/2 w-4 -translate-x-1/2 cursor-col-resize touch-none rounded-r1",
  "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-stroke-focus-ring",
].join(" ");
// 손잡이 표시 4 × 24 — 선 가운데(패널 높이의 가운데)
const GRIP = "pointer-events-none absolute left-1/2 top-1/2 h-6 w-1 -translate-x-1/2 -translate-y-1/2 rounded-r0_5 bg-stroke-neutral-solid";

// ── resizable.tsx 의 JSX 에 적힌 클래스 ────────────────────────────────

const GROUP = "flex h-full w-full";
const PANEL_LIST = "min-w-0 shrink-0 grow-0 overflow-hidden";
const PANEL_FILL = "min-w-0 flex-1 overflow-hidden";
// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// <ResizablePanelGroup> + <ResizablePanel id defaultSize minSize maxSize> + <ResizableHandle label toggleSize> + <ResizablePanel>. size 는 지금 목록 폭(%).
// active 는 끄는 동안(data-active — 선이 짙다)을 멈춘 그림
function split({ listId, size = 25, min = 20, max = 40, label = "목록 너비", active = false, left, right, className = "" }) {
  const separator = attrs([
    'role="separator"',
    'tabindex="0"',
    `aria-label="${esc(label)}"`,
    'aria-orientation="vertical"',
    `aria-valuenow="${Math.round(size)}"`,
    `aria-valuemin="${min}"`,
    `aria-valuemax="${max}"`,
    `aria-valuetext="${Math.round(size)}%"`,
    `aria-controls="${listId}"`,
    'data-slot="resizable-separator"',
    `class="${SEPARATOR}"`,
  ]);
  const handle = `<div ${attrs(['data-slot="resizable-handle"', active && 'data-active=""', `class="${LINE}"`])}><div ${separator}><span aria-hidden="true" data-slot="resizable-grip" class="${GRIP}"></span></div></div>`;
  return `<div data-slot="resizable-panel-group" class="${[GROUP, className].filter(Boolean).join(" ")}"><div id="${listId}" data-slot="resizable-panel" data-panel="list" class="${PANEL_LIST}" style="flex-basis:${size}%">${left}</div>${handle}<div data-slot="resizable-panel" data-panel="fill" class="${PANEL_FILL}">${right}</div></div>`;
}

// 화면의 내용(미리보기 그림) — 부서 나무(이름만) · 조직도 자리
const TEXT = "font-family:var(--font-sans); color:var(--color-fg-neutral);";
const DEPTS = ["가람누리 디지털혁신본부 클라우드 플랫폼 운영 그룹", "클라우드 인프라팀", "데이터 플랫폼팀", "경영지원팀", "프로젝트 1팀", "프로젝트 2팀"];
const treePane = () =>
  `<div style="${TEXT} padding:var(--spacing-x3) var(--spacing-x2);"><div style="padding:0 var(--spacing-x2) var(--spacing-x2); font-size:var(--text-t6); line-height:var(--text-t6--line-height); font-weight:700;">부서</div>${DEPTS.map(
    (d, i) =>
      `<div style="padding:var(--spacing-x3) var(--spacing-x2) var(--spacing-x3) calc(var(--spacing-x2) + ${i === 0 ? 0 : 20}px); border-radius:var(--radius-r2_5); font-size:var(--text-t4); line-height:var(--text-t4--line-height);${d === "경영지원팀" ? " background:var(--color-bg-neutral-weak-pressed);" : ""}">${esc(d)}</div>`,
  ).join("")}</div>`;
const chartPane = () =>
  `<div style="${TEXT} display:flex; flex-direction:column; gap:var(--spacing-x3); height:100%; padding:var(--spacing-x4) var(--spacing-x6);"><div style="font-size:var(--text-t6); line-height:var(--text-t6--line-height); font-weight:700;">경영지원팀 · 조직도</div><div style="display:flex; flex-wrap:wrap; gap:var(--spacing-x3);">${["팀장 김하늘", "이도윤", "박서연", "최민준"]
    .map((p) => `<span style="padding:var(--spacing-x2) var(--spacing-x3); border-radius:var(--radius-r2); background:var(--color-bg-layer-basement); font-size:var(--text-t4); line-height:var(--text-t4--line-height);">${esc(p)}</span>`)
    .join("")}</div></div>`;
// 데스크톱 화면 틀 — 768 이상(그림은 760 폭 · 높이 360). 좁으면 가로로 민다
const desk = (html, height = 360) =>
  `<div style="overflow-x:auto;"><div style="width:760px; height:${height}px; overflow:hidden; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-default);">${html}</div></div>`;
const CAPTION = "display:block; margin-top:var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="min-width:0;">${html}<span style="${CAPTION}">${esc(caption)}</span></div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const resizableExamples = [
  {
    title: "HR 관리 — 부서 나무 | 조직도",
    description:
      "HR 관리 > 역할 · 사용자 · 회사 · 부서 사용자는 목록 | 상세로 나뉘고, 그 사이 손잡이로 목록 폭을 바꾼다 — 768 이상에서만이다(768 미만은 목록 → 상세 · 탭). 목록은 기본 25%(1280 에서 본문 992 의 248)이고 20 ~ 40% 사이에서만 바뀐다 — 오른쪽 상세는 60% 아래로 줄지 않는다. 선은 1px stroke-neutral-weak(경계일 뿐), 가운데 손잡이 표시 4 × 24 stroke-neutral-solid(4.18 — 3 이상)가 끌 수 있는 자리를 알린다. 누르는 폭은 선 가운데로 양쪽 8 — 16 이고(768 이상 마우스 경계), 마우스를 올리거나 키보드 초점 · 끄는 동안 선 전체가 손잡이 표시와 같은 색으로 짙어진다. 손잡이는 role=\"separator\" · 이름 \"목록 너비\" · aria-valuenow 25 · min 20 · max 40 · aria-controls(목록 패널)이고, 끌지 않고 한 번 누르면(3px 안) 25 ↔ 40, ← → 5% · Home 20 · End 40 · Enter 25 ↔ 40 이다. 끌거나 바꾼 폭은 화면마다 브라우저에 기억한다(storageKey).",
    jsx: `import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

{/* 768 이상만 — 목록 20 ~ 40%(오른쪽은 60% 아래로 줄지 않는다), 화면마다 폭을 기억 */}
<ResizablePanelGroup storageKey="hr-admin-company">
  <ResizablePanel id="company-tree" defaultSize={25} minSize={20} maxSize={40}>
    {departmentTree}
  </ResizablePanel>
  <ResizableHandle label="목록 너비" toggleSize={40} />
  <ResizablePanel>{orgChart}</ResizablePanel>
</ResizablePanelGroup>`,
    render: () => desk(split({ listId: "rsz-ex-company-tree", size: 25, left: treePane(), right: chartPane() })),
  },

  {
    title: "목록 폭 — 20 · 25 · 40 · 끄는 동안",
    description:
      "목록 폭은 기본 25 에서 20(최소)과 40(최대) 사이로만 바뀐다 — 오른쪽 상세가 60% 아래로 줄지 않아 조직도 · 사용자 칸이 0폭이 되지 않는다(지금 회사 · 부서 사용자는 End 한 번에 0폭). ← → 는 5% 씩이고 끝에서 멈춘다(라이브러리 기본 10% 가 아니다). 끄는 동안(data-active)에는 선이 짙고, 화면 전체가 col-resize 커서이며 글을 고르지 않는다 — 폭은 포인터를 1:1 로 따라가고 놓으면 그 폭을 기억한다. 폭이 바뀌는 모션은 없다(키보드 · 누르기는 바로).",
    jsx: `{/* minSize · maxSize — 목록 20 ~ 40%(기본값과 같다) */}
<ResizablePanelGroup storageKey="hr-admin-role">
  <ResizablePanel id="role-list" defaultSize={25} minSize={20} maxSize={40}>{roleList}</ResizablePanel>
  <ResizableHandle label="목록 너비" />
  <ResizablePanel>{roleDetail}</ResizablePanel>
</ResizablePanelGroup>`,
    render: () =>
      `<div style="display:flex; flex-direction:column; gap:var(--spacing-x5);">${[
        [20, false, "최소 20% — ← · Home 으로 더 줄지 않는다"],
        [40, false, "최대 40% — 오른쪽 60% 를 남긴다(→ · End)"],
        [32, true, "끄는 동안 — data-active · 선이 짙다 · 1:1"],
      ]
        .map(([size, active, cap], i) => labeled(desk(split({ listId: `rsz-ex-range-${i}`, size, active, left: treePane(), right: chartPane() }), 260), cap))
        .join("")}</div>`,
  },
];
