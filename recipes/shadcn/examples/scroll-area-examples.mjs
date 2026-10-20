/*
 * shadcn Scroll Area 예제 — docs site components/scroll-area.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 셋(전역 스크롤바 · 초점 가는 것이 없는 상자 — HR 달력 일 보기 · 대화상자 안 상자 — 휴가 정책)은
 * 차례 · 제목 · 코드가 specs/components/scroll-area.md 의 "코드" 절과 같고(전역 스크롤바는 CSS), 마지막(가로 상자 · 가로 줄)은 md 의 놓인 자리를 코드로 더 보인다.
 * SEED 에는 Scroll Area · 스크롤바 규칙이 없다(끝 흐림 Scroll Fog 만) — 기본 스크롤 + 전역 한 벌(6px 알약 · thumb stroke-neutral-solid · track 투명)은
 * groo 가 정했다(2026-10-10 사용자 결정 14A). 옛 예제(Radix ScrollArea · 겹쳐 뜨는 막대 · 인라인 style)를 대신한다.
 *
 * ROOT · ORIENTATION · CONTAIN · FOCUS 는 recipes/shadcn/components/ui/scroll-area.tsx 의 cn() 이 잇는 글 · 상수와 글자 하나까지 같아야 한다 —
 * 두 파일을 함께 고친다. 스크롤바 모양은 컴포넌트가 아니라 recipes/shadcn/styles/groo-shadcn-bridge.css 의 전역 한 벌이다 — 사이트는 그 CSS 를
 * 함께 싣으므로 아래 상자들의 막대가 곧 그 모양이다(맥 · 폰의 겹침 스크롤바는 OS 설정대로 넘칠 때만 보인다).
 * 규칙은 specs/components/scroll-area.md, 수치 원본은 specs/components/scroll-area.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다. 상자는 실제로 스크롤된다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — <div role="region"? tabindex="0"? aria-label? data-slot="scroll-area" data-orientation>. 이름(label)을 주면
 * region · tabindex 0 · aria-label 이 함께 붙는다. 일정 · 정책 글 · 대화상자 · 가로 카드는 화면의 내용(미리보기 그림)이다.
 */

// ── scroll-area.tsx 의 값 ────────────────────────────────────────────────

// 넘치는 방향만 스크롤 — 한쪽이 auto 면 다른 쪽 visible 은 auto 가 되므로 막는다
const ORIENTATION = {
  vertical: "overflow-x-hidden overflow-y-auto",
  horizontal: "overflow-x-auto overflow-y-hidden",
  both: "overflow-auto",
};
const ROOT = "relative min-h-0 min-w-0";
const CONTAIN = "overscroll-contain";
// 키보드 포커스 링 — 상자 안쪽 2px
const FOCUS = "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring";

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// <ScrollArea orientation label contain className> — 이름을 주면 region + tabindex 0
function scrollArea({ orientation = "vertical", label, contain = false, className = "", html }) {
  const named = label != null;
  return `<div ${attrs([
    named && 'role="region"',
    named && 'tabindex="0"',
    named && `aria-label="${esc(label)}"`,
    'data-slot="scroll-area"',
    `data-orientation="${orientation}"`,
    `class="${[ROOT, ORIENTATION[orientation], contain && CONTAIN, FOCUS, className].filter(Boolean).join(" ")}"`,
  ])}>${html}</div>`;
}

// HR 달력 일 보기(화면의 내용) — 한 시간 48 · 시각 13 · 일정 칸. 안에 초점 가는 것이 없다
const HOURS = Array.from({ length: 24 }, (_, h) => h);
const EVENTS = { 9: "주간 회의 · 9시 ~ 10시", 11: "클라우드 인프라 점검", 14: "면접 — 데이터 플랫폼팀", 16: "1:1 김하늘" };
const hourLabel = (h) => (h === 0 ? "오전 12시" : h < 12 ? `오전 ${h}시` : h === 12 ? "오후 12시" : `오후 ${h - 12}시`);
const dayTimeline = () =>
  HOURS.map(
    (h) =>
      `<div style="display:flex; gap:var(--spacing-x3); min-height:48px; padding:0 var(--spacing-x4); border-top:1px solid var(--color-stroke-neutral-subtle);"><span style="width:56px; flex-shrink:0; padding-top:var(--spacing-x1); font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle);">${hourLabel(h)}</span>${
        EVENTS[h]
          ? `<span style="flex:1; min-width:0; margin:var(--spacing-x1) 0; padding:var(--spacing-x1_5) var(--spacing-x2); border-radius:var(--radius-r1_5); background:var(--color-bg-informative-weak); font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-informative-contrast);">${esc(EVENTS[h])}</span>`
          : ""
      }</div>`,
  ).join("");

const POLICY = [
  "제1조(연차) 1년간 80% 이상 출근한 직원에게 15일의 유급 휴가를 준다. 입사 1년 미만은 한 달 개근마다 1일씩 생긴다.",
  "제2조(사용) 연차는 1시간 단위로 나눠 쓸 수 있다. 쓰려는 날 3일 전까지 신청하고 팀장이 승인한다.",
  "제3조(이월) 그해 안에 쓰지 못한 연차는 다음 해로 넘어가지 않는다. 회사가 사용을 권했는데도 쓰지 않은 연차는 보상하지 않는다.",
  "제4조(경조 휴가) 본인 결혼 5일, 자녀 결혼 1일, 배우자 출산 10일, 부모 · 배우자 부모 사망 5일을 준다.",
  "제5조(병가) 업무 밖의 질병 · 부상으로 일할 수 없을 때 연 60일 안에서 무급 병가를 쓸 수 있다. 3일을 넘으면 진단서를 낸다.",
  "제6조(공가) 예비군 · 민방위 훈련, 건강검진은 그날 유급 공가다. 신청할 때 통지서를 함께 올린다.",
].map((p) => `<p style="margin:0 0 var(--spacing-x3); font-size:var(--text-t4); line-height:1.6; color:var(--color-fg-neutral-muted);">${esc(p)}</p>`).join("");

// 놓인 면 — 흰 면(bg-layer-default) · 바닥(bg-layer-basement) · 떠 있는 표면(bg-layer-floating)
const SURFACE = {
  default: "var(--color-bg-layer-default)",
  basement: "var(--color-bg-layer-basement)",
  floating: "var(--color-bg-layer-floating)",
};
const box = (surface, html) =>
  `<div style="width:100%; max-width:240px; border-radius:var(--radius-r4); background:${SURFACE[surface]}; box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle); overflow:hidden; font-family:var(--font-sans); color:var(--color-fg-neutral);">${html}</div>`;
const lines = (n) =>
  Array.from({ length: n }, (_, i) => `<div style="padding:var(--spacing-x2) var(--spacing-x4); font-size:var(--text-t4); line-height:var(--text-t4--line-height);">${esc(["식비", "교통", "쇼핑", "카페", "구독", "의료", "여행", "주거", "통신", "교육", "경조사", "반려동물"][i % 12])}</div>`).join("");
const CAPTION = "display:block; margin-top:var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="flex:1 1 200px; min-width:0; max-width:240px;">${html}<span style="${CAPTION}">${esc(caption)}</span></div>`;
const row = (items) => `<div style="display:flex; flex-wrap:wrap; gap:var(--spacing-x5); align-items:flex-start;">${items.join("")}</div>`;

// 대화상자(화면의 내용) — 떠 있는 표면 480 · 모서리 20 · 머리 · 본문 · 바닥
const dialogFrame = (title, body, footer) =>
  `<div style="width:100%; max-width:480px; border-radius:var(--radius-r5); background:var(--color-bg-layer-floating); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle); font-family:var(--font-sans); color:var(--color-fg-neutral);"><div style="padding:var(--spacing-x6) var(--spacing-x6) var(--spacing-x4); font-size:22px; line-height:30px; font-weight:700;">${esc(title)}</div><div style="padding:0 var(--spacing-x6);">${body}</div><div style="display:flex; justify-content:flex-end; gap:var(--spacing-x2); padding:var(--spacing-x4) var(--spacing-x6) var(--spacing-x6);">${footer}</div></div>`;
const fakeButton = (label, solid) =>
  `<span aria-hidden="true" style="display:inline-flex; align-items:center; height:36px; padding:0 var(--spacing-x3_5); border-radius:var(--radius-r2); background:${solid ? "var(--color-bg-neutral-inverted)" : "var(--color-bg-neutral-weak)"}; font-size:var(--text-t4); font-weight:700; color:${solid ? "var(--color-fg-neutral-inverted)" : "var(--color-fg-neutral)"};">${esc(label)}</span>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const scrollAreaExamples = [
  {
    title: "전역 스크롤바",
    description:
      "스크롤은 브라우저 기본이다 — 휠 · 키보드 · 끌기 · 관성을 가로채지 않는다. 모양만 전역으로 한 벌 둔다 — 세로 · 가로 6px, 막대는 알약 stroke-neutral-solid(흰 면 4.18 · 바닥 3.87 · 떠 있는 표면 4.18, 다크 4.13 · 4.68 · 3.58 — 모두 3 이상), 바탕(track) · 모서리(corner)는 투명이고 올리거나 끌어도 모양이 바뀌지 않는다. Firefox 는 ::-webkit-scrollbar 를 모르므로 scrollbar-width: thin + scrollbar-color 로 같은 색을 거는데, 이 두 줄은 반드시 @supports not selector(::-webkit-scrollbar) 안에 둔다 — 크로미움은 두 속성이 걸린 요소에서 webkit 규칙을 버려 6px 이 10px(thin) · 15px(color 만)로 바뀐다. 세로 스크롤바는 숨기지 않는다 — .scrollbar-hide 는 가로 줄(칩 · 탭 · 가로 카드)에만 쓴다. 아래 상자들은 넘쳐서 실제로 스크롤된다.",
    jsx: `/* 전역 스크롤바 — Scroll Area(2026-10-10). 크로미움 · 사파리는 webkit, Firefox 만 표준 두 줄 */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--color-stroke-neutral-solid); border-radius: var(--radius-full); }
::-webkit-scrollbar-corner { background: transparent; }

/* 크로미움은 scrollbar-width · scrollbar-color 가 걸리면 webkit 규칙을 버린다 — 반드시 이 안에 */
@supports not selector(::-webkit-scrollbar) {
  * { scrollbar-width: thin; scrollbar-color: var(--color-stroke-neutral-solid) transparent; }
}

/* 가로 줄만 — 세로 스크롤바에는 쓰지 않는다 */
.scrollbar-hide { scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }`,
    render: () =>
      row([
        labeled(box("default", scrollArea({ label: "카테고리", className: "h-[200px]", html: lines(12) })), "흰 면 — 막대 4.18"),
        labeled(box("basement", scrollArea({ label: "카테고리", className: "h-[200px]", html: lines(12) })), "바닥 — 막대 3.87"),
        labeled(box("floating", scrollArea({ label: "카테고리", contain: true, className: "h-[200px]", html: lines(12) })), "떠 있는 표면 — 막대 4.18 · contain"),
      ]),
  },

  {
    title: "초점 가는 것이 없는 상자 — HR 달력 일 보기",
    description:
      "안에 버튼 · 링크 · 칸이 없는 스크롤 상자(글 · 표 · 일정 칸)는 키보드로 닿을 길이 없다 — label 을 주면 상자 자신이 초점을 받고(tabindex 0) role=\"region\" 과 이름(\"10월 9일 일정\")이 함께 붙는다. 역할 없는 div 에는 aria-label 을 쓸 수 없어(ARIA 1.2) region 을 함께 둔다. Tab 으로 상자에 초점을 두고 ↑ ↓ · PageUp · PageDown · Home · End 로 스크롤한다 — 키보드 포커스 링은 상자 안쪽 2px 다(바깥 링은 카드 · 시트에 잘린다). 크로미움은 이름 없는 스크롤 상자도 Tab 정지점으로 만든다 — 이름을 달아 무엇의 상자인지 알린다. 안에 초점 가는 것이 있으면 label 을 주지 않는다(그것에 초점이 가면 브라우저가 스크롤한다).",
    jsx: `import { ScrollArea } from "@/components/ui/scroll-area"

{/* 안에 초점 가는 것이 없다 — 이름을 주면 region + tabindex 0 */}
<ScrollArea label="10월 9일 일정" className="h-[380px]">
  {dayTimeline}
</ScrollArea>`,
    render: () =>
      `<div style="max-width:360px; border-radius:var(--radius-r4); background:var(--color-bg-layer-default); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle); font-family:var(--font-sans); color:var(--color-fg-neutral);"><div style="padding:var(--spacing-x4) var(--spacing-x4) var(--spacing-x2); font-size:var(--text-t5); line-height:var(--text-t5--line-height); font-weight:700;">10월 9일 (금)</div>${scrollArea({
        label: "10월 9일 일정",
        className: "h-[380px]",
        html: dayTimeline(),
      })}</div>`,
  },

  {
    title: "대화상자 안 상자 — 휴가 정책",
    description:
      "시트 · 대화상자 · 팝오버 · 옆 패널 안의 상자는 contain 이다(overscroll-behavior: contain) — 끝에 닿아도 대화상자 본문 · 뒤 화면이 따라 스크롤되지 않는다. 시트 · 대화상자 · 팝오버 · 옆 패널의 본문(DialogBody · BottomSheetBody · PopoverBody · SidePanelBody)은 레시피가 스스로 contain 이다. 높이를 정한 상자는 꼭 필요할 때만 둔다(긴 약관 · 정책) — 끝을 흐려 더 있다는 것을 알리려면 Scroll Fog 의 ScrollFog 가 곧 스크롤 상자다. 그림의 정책 상자는 넘쳐서 실제로 스크롤된다.",
    jsx: `import { ScrollArea } from "@/components/ui/scroll-area"

{/* 대화상자 안 — 끝에 닿아도 본문이 따라 움직이지 않게 contain */}
<ScrollArea label="휴가 정책" contain className="max-h-[300px]">
  <p>{vacationPolicy}</p>
</ScrollArea>`,
    render: () =>
      dialogFrame(
        "휴가 신청",
        `<div style="margin-bottom:var(--spacing-x2); font-size:var(--text-t4); line-height:var(--text-t4--line-height); font-weight:500;">휴가 정책</div><div style="border-radius:var(--radius-r3); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-weak); overflow:hidden;">${scrollArea({
          label: "휴가 정책",
          contain: true,
          className: "max-h-[300px] px-x4 pt-x3",
          html: POLICY,
        })}</div>`,
        `${fakeButton("취소", false)}${fakeButton("신청", true)}`,
      ),
  },

  {
    title: "가로 상자 · 가로 줄",
    description:
      "넘치는 방향만 스크롤한다 — orientation=\"horizontal\" 은 overflow-x auto · overflow-y hidden 이고 막대는 아래 6px 이다(both 는 두 방향 · 모서리는 투명). 칩 줄 · 탭 · 가로 카드 줄처럼 화면 끝까지 내는 가로 줄은 스크롤바를 숨기고(.scrollbar-hide) 끝을 Scroll Fog row 흐림이 알린다 — 세로 스크롤바는 숨기지 않는다. 가로 상자 안의 카드가 초점을 받지 않으면 상자에 이름을 단다.",
    jsx: `{/* 가로로 넘치는 표 — 막대는 아래 6px */}
<ScrollArea orientation="horizontal" label="월별 지출">
  <table className="min-w-[720px]">{monthlyRows}</table>
</ScrollArea>

{/* 가로 줄은 스크롤바 없이 끝을 흐린다 — 칩 줄은 ChipGroup layout="scroll" 이 맡는다 */}
<ChipGroup layout="scroll" aria-label="필터">…</ChipGroup>`,
    render: () =>
      `<div style="max-width:360px; padding:var(--spacing-x4) 0; border-radius:var(--radius-r4); background:var(--color-bg-layer-default); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle); font-family:var(--font-sans); color:var(--color-fg-neutral);">${scrollArea({
        orientation: "horizontal",
        label: "월별 지출",
        html: `<div style="display:flex; gap:var(--spacing-x3); width:max-content; padding:0 var(--spacing-x4) var(--spacing-x3);">${["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월"]
          .map((m, i) => `<span style="display:flex; flex-direction:column; gap:var(--spacing-x1); width:96px; padding:var(--spacing-x3); border-radius:var(--radius-r3); background:var(--color-bg-layer-basement);"><span style="font-size:var(--text-t3); color:var(--color-fg-neutral-subtle);">${m}</span><b style="font-size:var(--text-t4); font-variant-numeric:tabular-nums;">${(1180000 + i * 37100).toLocaleString("ko-KR")}원</b></span>`)
          .join("")}</div>`,
      })}</div>`,
  },
];
