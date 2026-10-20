/*
 * shadcn Floating Action Button 예제 — docs site components/floating-action-button.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 하나(할 일 — 추가)는 차례 · 제목 · 코드가 specs/components/floating-action-button.md 의
 * "코드" 절과 같고, 뒤의 하나(바닥 버튼 위 — offsetBottom)는 md 의 Properties(자리)를 코드로 더 보인다. groo 에 처음 두는 컴포넌트다 —
 * 구조는 SEED Floating Action Button 의 아이콘만 모양(extended=false)이다.
 *
 * ROOT 는 recipes/shadcn/components/ui/floating-action-button.tsx 의 상수와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다.
 * 규칙은 specs/components/floating-action-button.md, 수치 원본은 specs/components/floating-action-button.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — <button type="button" data-slot="floating-action-button" aria-label> > 아이콘 <svg aria-hidden>.
 * offsetBottom 은 레시피처럼 style 의 --fab-offset-bottom 으로 넣는다. 버튼은 화면(fixed)에 뜬다 — 미리보기 틀(STAGE)에 transform 을 줘
 * fixed 의 기준을 틀로 바꾸고 isolation 으로 z-index 를 가둔다. 틀에는 안전 영역이 없다.
 * 레시피의 스크립트는 없다(누르면 그 화면의 주 동작을 여는 것은 쓰는 쪽의 onClick 이다). 화면 머리 · 목록 줄 · 바닥 버튼은 미리보기 그림(레시피가 아니다)이다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── floating-action-button.tsx 의 상수와 같은 값 ─────────────────────────

const ROOT = [
  "fixed z-(--z-sticky) flex size-14 cursor-pointer items-center justify-center rounded-full border-0 p-0",
  // 오른쪽 아래 — 화면 끝 · 아래 끝(또는 바닥 고정 요소 위 끝)에서 20 + 안전 영역
  "right-[calc(20px+env(safe-area-inset-right))] bottom-[calc(20px+env(safe-area-inset-bottom)+var(--fab-offset-bottom,0px))]",
  "bg-bg-brand-solid text-static-white shadow-[var(--shadow-s3)]",
  "[&>svg]:size-6 [&>svg]:shrink-0 [&>svg]:[stroke-width:2.5]",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "hover:bg-bg-brand-solid-pressed active:bg-bg-brand-solid-pressed",
  "active:[scale:calc(1-2/56)] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 와 같은 모양(24 격자) — 버튼이 24 · 선 2.5 로 그린다
const svg = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const PLUS = svg('<path d="M5 12h14"/><path d="M12 5v14"/>');
const CIRCLE = svg('<circle cx="12" cy="12" r="10"/>');

// <FloatingActionButton icon aria-label offsetBottom> — offsetBottom 은 style 의 --fab-offset-bottom
const fab = ({ name, icon = PLUS, offsetBottom = 0 }) =>
  `<button type="button" data-slot="floating-action-button" class="${ROOT}"${offsetBottom ? ` style="--fab-offset-bottom:${offsetBottom}px;"` : ""} aria-label="${esc(name)}">${icon}</button>`;

// 미리보기 틀 — 폰 화면(360 까지). transform 이 fixed 의 기준을 틀로 바꾸고 isolation 이 z-index 를 가둔다. 몸은 스크롤된다
const STAGE =
  "position:relative; isolation:isolate; transform:translateZ(0); overflow:hidden; display:flex; flex-direction:column; width:100%; max-width:360px; height:420px; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-default); font-family:var(--font-sans);";
const HEAD =
  "flex-shrink:0; display:flex; align-items:center; height:56px; padding:0 var(--spacing-x4); font-size:var(--text-t8); line-height:var(--text-t8--line-height); font-weight:700; color:var(--color-fg-neutral);";
const ROW =
  "display:flex; align-items:center; gap:var(--spacing-x3); padding:var(--spacing-x3) var(--spacing-global-gutter); font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const ROW_DETAIL = "display:block; font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle);";
const CHECK = "display:flex; flex-shrink:0; width:22px; height:22px; color:var(--color-fg-neutral-subtle);";
const TODOS = [
  ["관리비 이체", "오늘"],
  ["치과 예약 확인", "10월 9일 (금)"],
  ["엄마 생신 선물", "10월 12일 (월)"],
  ["자동차 보험 갱신", "10월 20일 (화)"],
  ["연말정산 서류", "11월 2일 (월)"],
  ["택배 반품", "11월 4일 (수)"],
  ["가습기 필터 주문", "11월 10일 (화)"],
];
const rows = (list) =>
  list.map(([t, d]) => `<div style="${ROW}"><span style="${CHECK}">${CIRCLE}</span><span>${esc(t)}<span style="${ROW_DETAIL}">${esc(d)}</span></span></div>`).join("");
// 목록의 마지막 줄이 버튼에 가리지 않게 — 버튼 높이 + 위아래 20(56 + 20 + 20). 바닥 버튼이 있으면 그 높이를 더한다
const screen = ({ title, list, bottom = 0, footer = "", button }) =>
  `<div style="${STAGE}"><div style="${HEAD}">${esc(title)}</div><div style="flex:1 1 auto; min-height:0; overflow-y:auto; padding-bottom:${96 + bottom}px;">${rows(list)}</div>${footer}${button}</div>`;
// 바닥 고정 버튼(높이 80 — 위아래 16 + 48) — 미리보기 그림
const FOOTER =
  "position:absolute; right:0; bottom:0; left:0; z-index:1; display:flex; align-items:center; height:80px; padding:var(--spacing-x4) var(--spacing-global-gutter); background:var(--color-bg-layer-default); box-sizing:border-box;";
const FOOTER_BUTTON =
  "display:flex; align-items:center; justify-content:center; width:100%; height:48px; border-radius:var(--radius-r3); background:var(--color-bg-neutral-inverted); color:var(--color-fg-neutral-inverted); font-size:var(--text-t6); line-height:var(--text-t6--line-height); font-weight:700;";
const footer = (label) => `<div style="${FOOTER}"><span style="${FOOTER_BUTTON}">${esc(label)}</span></div>`;
const CAPTION = "display:block; margin-top:var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const floatingActionButtonExamples = [
  {
    title: "할 일 — 추가",
    description:
      "폰(768 미만)의 탭 바가 없는 화면(할 일 · 더치페이)에서 그 화면의 주 동작 하나를 띄운다 — 오른쪽 아래, 화면 끝에서 20 · 아래 끝에서 20(+ 안전 영역 — 여백은 안전 영역 경계부터). 원 56 · 브랜드 채움(bg-brand-solid — Desk 파랑 · HR 초록, 바꾸지 않는다) · 흰 아이콘 24(선 2.5) · shadow-s3(다크는 -dark 짝)이고 글을 붙이지 않는다 — 이름(aria-label)이 곧 버튼의 글이다(\"할 일 추가\"). 스크롤해도 그 자리에 있고 숨거나 접히지 않는다(z-sticky 50). 누르면 bg-brand-solid-pressed + 2px 거리 축소(56 → 0.964), 호버는 같은 색, 키보드 포커스에만 원 바깥 2px 링. 스낵바는 버튼 위 8 에 뜬다 — 버튼을 SnackbarAvoidOverlap 으로 감싼다. 목록 아래에는 버튼 높이만큼 여백(56 + 20 + 20)을 둔다 — 미리보기의 목록을 끝까지 내려 본다. 탭 바가 있는 화면의 추가는 탭 바 가운데 +, 데스크톱의 주 동작은 화면 머리의 Button 이다.",
    jsx: `import { Plus } from "lucide-react"
import { FloatingActionButton } from "@/components/ui/floating-action-button"
import { SnackbarAvoidOverlap } from "@/components/ui/snackbar"

<SnackbarAvoidOverlap>
  <FloatingActionButton icon={<Plus />} aria-label="할 일 추가" onClick={openAddTodo} />
</SnackbarAvoidOverlap>`,
    render: () => screen({ title: "할 일", list: TODOS, button: fab({ name: "할 일 추가" }) }),
  },

  {
    title: "바닥 버튼 위 — offsetBottom",
    description:
      "아래에 고정된 것(바닥 버튼)이 있으면 그 위 끝에서 20 에 선다 — offsetBottom 에 그 높이(안전 영역 위에 놓인 높이, 안전 영역은 빼고)를 준다. 버튼은 화면에 하나만, 그 화면에서 가장 많이 하는 일이고 아이콘만으로 뜻이 통하는 동작에만 쓴다(추가 + 처럼). 글이 붙은 모양(Extended) · 스크롤에 따라 접기 · 메뉴를 여는 떠 있는 버튼은 두지 않는다.",
    jsx: `{/* 바닥 고정 버튼(높이 80 — 안전 영역 위)의 위 끝에서 20 */}
<FloatingActionButton icon={<Plus />} aria-label="더치페이 만들기" offsetBottom={80} onClick={openCreateSplit} />`,
    render: () =>
      labeled(
        screen({
          title: "더치페이",
          list: [["회식 — 강남", "4명 · 정산 중"], ["제주 여행", "3명 · 2건 남음"], ["생일 선물", "5명 · 완료"], ["캠핑", "6명 · 정산 중"]],
          bottom: 80,
          footer: footer("바닥 고정 버튼"),
          button: fab({ name: "더치페이 만들기", offsetBottom: 80 }),
        }),
        "바닥 버튼(80) 위 20",
      ),
  },
];
