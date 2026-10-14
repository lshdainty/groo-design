/*
 * shadcn Scroll Auto Hide 예제 — docs site components/scroll-auto-hide.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 첫째(가계부 원장 머리)는 제목 · 코드가 specs/components/scroll-auto-hide.md 의 "코드" 절과 같고,
 * 둘째(필터를 건 원장 — 칩 줄도 같은 머리)는 md 의 Guidelines(어디에 쓰나)를 코드로 더 보인다.
 * 구조는 당근 SEED Breeze Scroll Auto Hide(seed-design.io/breeze/components/scroll-auto-hide — Apache-2.0)를 그대로 따른다 — 스크롤 거리를 1:1 로
 * 따라 숨고 드러나며, 멈추면 50% 를 기준으로 200ms(motion-duration-d4 · motion-ease-enter)에 스냅하고, 높이를 바꾸지 않고 translate3d 로만 옮긴다
 * (2026-10-10 사용자 결정 15A). porest 에 처음 두는 예제다.
 *
 * ROOT 는 recipes/shadcn/components/ui/scroll-auto-hide.tsx 의 cn() 이 잇는 글과, SNAP_TRANSITION · SNAP_THRESHOLD_RATIO · SCROLL_SETTLE_DELAY_MS 는
 * 그 파일의 상수와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 바탕 · z-index(HOST — bg-bg-layer-default · z-[2])는 쓰는 쪽의 className 이다
 * (md 코드). 규칙은 specs/components/scroll-auto-hide.md, 수치 원본은 specs/components/scroll-auto-hide.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다. 스크롤 상자는 실제로 스크롤된다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 스크롤 상자(쓰는 쪽) > <div data-slot="scroll-auto-hide" data-scroll-auto-hide class="sticky top-0 …">.
 * 레시피의 스크립트(스크롤 거리 1:1 따라가기 · scrollend 에 50% 스냅 · 모션 줄이기면 끔 · 숨은 머리에 초점이 오면 드러냄 · ScrollTimeline)는
 * 정적 HTML 에 없다 — 미리보기에서는 머리가 sticky 로 맨 위에 붙어 있기만 하고 숨지 않는다(모션 줄이기의 모습과 같다). 숨는 움직임은 사이트의
 * 스펙 페이지 그림 · 플레이그라운드에서 본다. 상단 바 · 탭 · 원장 머리 · 거래 줄은 화면의 내용(미리보기 그림)이고 거래는 지어낸 것이다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── scroll-auto-hide.tsx 의 값 ──────────────────────────────────────────

// 숨는 영역 — 스크롤 상자 맨 위에 붙는다. 다른 transform 은 자식에(루트의 transform 은 숨기는 데 쓴다)
const ROOT = "sticky top-0";
const SNAP_THRESHOLD_RATIO = 0.5;
const SCROLL_SETTLE_DELAY_MS = 120;
// 스냅 — 200ms(motion-duration-d4) · cubic-bezier(0, 0, 0.15, 1)(motion-ease-enter)
const SNAP_TRANSITION = "transform var(--motion-duration-d4) var(--motion-ease-enter)";

// ── 쓰는 쪽(md 코드)의 className ─────────────────────────────────────────

// 바탕 · 겹침 — 원장 머리는 목록과 같은 흰 면, z 2(스크롤 상자 안의 겹침 값 — List 줄 뒤 붙이개의 단추 · 링크 z 1 위)
const HOST = "z-[2] bg-bg-layer-default";
// 스크롤 상자 — 상단 바 · 탭 아래부터
const SCROLLER = "min-h-0 flex-1 overflow-y-auto";

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const svg = (paths) =>
  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const PATHS = {
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  search: '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
};
const won = (n) => `${n < 0 ? "−" : ""}${Math.abs(n).toLocaleString("ko-KR")}원`;

// <ScrollAutoHide scrollContainerRef className> — 레시피가 그리는 루트(스크립트 없이)
const scrollAutoHide = (html) => `<div data-slot="scroll-auto-hide" data-scroll-auto-hide="" class="${ROOT} ${HOST}">${html}</div>`;

// 원장 머리(화면의 내용) — 월 이동 · 총액 · 소비 요약 · 월 달력(이름 고정 + aria-expanded — 하나만 펼친다) · 주 달력
const TEXT = "font-family:var(--font-sans); color:var(--color-fg-neutral);";
const iconButton = (name, icon) =>
  `<button type="button" aria-label="${esc(name)}" style="display:grid; place-items:center; width:44px; height:44px; padding:0; border:0; border-radius:var(--radius-r2_5); background:transparent; color:var(--color-fg-neutral); cursor:pointer;">${svg(PATHS[icon])}</button>`;
const pillButton = (label, expanded) =>
  `<button type="button" aria-expanded="${expanded}" style="display:inline-flex; align-items:center; gap:var(--spacing-x1); height:36px; padding:0 var(--spacing-x3); border:0; border-radius:var(--radius-full); background:var(--color-bg-neutral-weak); font-family:var(--font-sans); font-size:var(--text-t4); font-weight:500; color:var(--color-fg-neutral); cursor:pointer;">${esc(label)}${svg(PATHS.chevronDown)}</button>`;
const WEEK = [["일", 4], ["월", 5], ["화", 6], ["수", 7], ["목", 8], ["금", 9], ["토", 10]];
const weekStrip = () =>
  `<div style="display:grid; grid-template-columns:repeat(7, minmax(0, 1fr)); padding:var(--spacing-x2) var(--spacing-x4) var(--spacing-x3);">${WEEK.map(
    ([d, n]) =>
      `<span style="display:flex; flex-direction:column; align-items:center; gap:var(--spacing-x1); font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle);">${d}<b style="display:grid; place-items:center; width:32px; height:32px; border-radius:var(--radius-full); font-size:var(--text-t4); ${n === 8 ? "background:var(--color-bg-neutral-inverted); color:var(--color-fg-neutral-inverted);" : "color:var(--color-fg-neutral);"}">${n}</b></span>`,
  ).join("")}</div>`;
const ledgerHeader = ({ chips = false } = {}) =>
  `<div style="${TEXT}"><div style="display:flex; align-items:center; justify-content:space-between; padding:var(--spacing-x2) var(--spacing-x2) 0;">${iconButton("이전 달", "chevronLeft")}<span style="font-size:var(--text-t6); line-height:var(--text-t6--line-height); font-weight:700;">2026년 10월</span>${iconButton("다음 달", "chevronRight")}</div><div style="padding:var(--spacing-x1) var(--spacing-global-gutter) var(--spacing-x3);"><div style="font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle);">10월 지출</div><div style="font-size:var(--text-t9); line-height:var(--text-t9--line-height); font-weight:700; font-variant-numeric:tabular-nums;">${won(-125870220)}</div></div><div style="display:flex; gap:var(--spacing-x2); padding:0 var(--spacing-global-gutter);">${pillButton("소비 요약", false)}${pillButton("월 달력", false)}</div>${
    chips
      ? `<div role="group" aria-label="필터" style="display:flex; gap:var(--spacing-x2); padding:var(--spacing-x3) var(--spacing-global-gutter) 0; overflow-x:auto;" class="scrollbar-hide">${["식비", "현대카드 M", "1만 원 이상"].map((c) => `<span style="flex-shrink:0; padding:var(--spacing-x1_5) var(--spacing-x3); border-radius:var(--radius-full); background:var(--color-bg-neutral-inverted); font-size:var(--text-t4); font-weight:500; color:var(--color-fg-neutral-inverted);">${esc(c)}</span>`).join("")}</div>`
      : ""
  }${weekStrip()}</div>`;

// 거래 40줄(화면의 내용) — 10월 8일부터 하루 4줄, 첫 줄은 1억 넘는 이체
const POOL = [
  ["김밥천국 강남점", "식비 · 삼성카드 taptap O", 9500],
  ["파리바게뜨", "카페 · 간식 · 토스 체크카드", 4800],
  ["티머니", "교통 · 토스 체크카드", 1450],
  ["무신사", "쇼핑 · 삼성카드 taptap O", 58900],
  ["스타벅스 역삼점", "카페 · 간식 · 현대카드 M", 6300],
  ["GS25 역삼점", "식비 · 토스 체크카드", 3200],
  ["쿠팡", "쇼핑 · 현대카드 M", 27400],
  ["배달의민족", "식비 · 삼성카드 taptap O", 23900],
];
const DAYS = ["10월 8일 (목) · 오늘", "10월 7일 (수)", "10월 6일 (화)", "10월 5일 (월)", "10월 4일 (일)", "10월 3일 (토)", "10월 2일 (금)", "10월 1일 (목)", "9월 30일 (수)", "9월 29일 (화)"];
const transactionList = () =>
  DAYS.map((label, d) => {
    const rows = Array.from({ length: 4 }, (_, j) => {
      if (d === 0 && j === 0) return ["(주)한빛공인중개사사무소 · 한빛이사 · 깨끗한청소", "주거 · 계좌이체", -123456789];
      const [t, s, a] = POOL[(d * 4 + j) % POOL.length];
      return [t, s, -(a + ((d * 4 + j) % 5) * 100)];
    });
    return `<div style="${TEXT}"><div style="padding:var(--spacing-x4) var(--spacing-global-gutter) var(--spacing-x1); font-size:var(--text-t3); line-height:var(--text-t3--line-height); font-weight:500; color:var(--color-fg-neutral-subtle);">${esc(label)}</div>${rows
      .map(
        ([t, s, a]) =>
          `<div style="display:flex; align-items:center; gap:var(--spacing-x3); padding:var(--spacing-x3) var(--spacing-global-gutter);"><span style="display:flex; flex:1; min-width:0; flex-direction:column; gap:var(--spacing-x0_5);"><span style="font-size:var(--text-t5); line-height:var(--text-t5--line-height);">${esc(t)}</span><span style="font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle);">${esc(s)}</span></span><span style="font-size:var(--text-t5); font-weight:700; font-variant-numeric:tabular-nums; white-space:nowrap;">${won(a)}</span></div>`,
      )
      .join("")}</div>`;
  }).join("");

// 폰 화면 틀(미리보기 그림) — 390 × 640. 상단 바 56 · Line Tabs 는 숨지 않고, 그 아래가 스크롤 상자다
const phone = ({ chips = false } = {}) =>
  `<div style="display:flex; flex-direction:column; width:100%; max-width:390px; height:640px; overflow:hidden; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-default); ${TEXT}"><div style="display:flex; align-items:center; justify-content:space-between; height:56px; flex-shrink:0; padding:0 var(--spacing-x2) 0 var(--spacing-global-gutter);"><span style="font-size:var(--text-t7); line-height:var(--text-t7--line-height); font-weight:700;">가계부</span>${iconButton("검색", "search")}</div><div role="tablist" aria-label="가계부" style="display:flex; flex-shrink:0; box-shadow:inset 0 -1px 0 var(--color-stroke-neutral-subtle);">${["내역", "예산", "자산"]
    .map((t, i) => `<span role="tab" aria-selected="${i === 0}" style="flex:1; padding:var(--spacing-x2_5) 0; text-align:center; font-size:var(--text-t5); font-weight:${i === 0 ? 700 : 500}; color:var(--color-fg-${i === 0 ? "neutral" : "neutral-subtle"});${i === 0 ? " box-shadow:inset 0 -2px 0 var(--color-fg-neutral);" : ""}">${t}</span>`)
    .join("")}</div><div class="${SCROLLER}">${scrollAutoHide(ledgerHeader({ chips }))}${transactionList()}</div></div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const scrollAutoHideExamples = [
  {
    title: "가계부 원장 머리",
    description:
      `폰 가계부 · 할 일 원장의 머리(월 이동 · 총액 · 소비 요약 · 주 달력)는 아래로 스크롤하면 그 거리만큼 위로 숨고, 위로 스크롤하면 같은 거리만큼 드러난다 — 목록을 넓게 보는 자리다. 스크롤이 끝나면 영역 높이의 ${SNAP_THRESHOLD_RATIO * 100}% 를 기준으로 다 숨거나 다 드러난다 — 200ms motion-ease-enter(SEED 의 200ms · cubic-bezier(0, 0, 0.15, 1) 과 같은 값, scrollend 가 없는 브라우저는 마지막 스크롤 ${SCROLL_SETTLE_DELAY_MS}ms 뒤). 높이를 바꾸지 않고 translate3d 로만 옮긴다 — 목록이 접히는 만큼 당겨지지 않는다(지금의 72px 를 지나면 max-height 로 접는 동작을 대신한다). 숨는 영역은 스크롤 상자 맨 위에 둔다(sticky · top 0 은 부품이 건다) — 상단 바 · Line Tabs 는 그 위에서 숨지 않는다. 바탕 · z-index 는 쓰는 쪽이 정한다 — 원장 머리는 목록과 같은 흰 면 · z 2(바탕이 없으면 숨는 동안 아래 줄이 비친다). 모션 줄이기면 자동 숨김을 끄고(늘 보인다), 숨은 머리 안으로 키보드 초점이 오면 바로 다 드러낸다(\"소비 요약\" 에 Tab). 미리보기는 스크립트 없이 그려 머리가 맨 위에 붙어 있기만 한다.`,
    jsx: `import { useRef } from "react"
import { ScrollAutoHide } from "@/components/ui/scroll-auto-hide"

const scrollRef = useRef<HTMLDivElement>(null)

{/* 상단 바 · 탭 아래부터가 스크롤 상자 — 숨는 머리는 그 안 맨 위 */}
<div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
  <ScrollAutoHide scrollContainerRef={scrollRef} className="z-[2] bg-bg-layer-default">
    {ledgerHeader}
  </ScrollAutoHide>
  {transactionList}
</div>`,
    render: () => phone(),
  },

  {
    title: "필터를 건 원장 — 칩 줄도 같은 머리",
    description:
      "필터를 걸면 같은 자리에 나오는 필터 칩 줄도 원장 머리의 한 덩어리로 함께 숨는다 — 머리 안의 소비 요약 · 월 달력은 하나만 펼친다(Collapsible — 사용자 결정 11A, 이름은 \"소비 요약\" · \"월 달력\" 고정 + aria-expanded). 펼친 월 달력 · 소비 요약 카드까지 같은 머리라 숨는 높이는 그때의 머리 높이다(ResizeObserver 가 다시 잰다). 숨겨도 aria-hidden · inert 를 걸지 않는다 — 초점이 오면 드러나므로 읽는 차례 · DOM 은 그대로다. 시트 · 대화상자의 머리와 상단 바는 숨기지 않고, 하단 탭 바는 제 규칙으로 줄어든다(Bottom Navigation).",
    jsx: `{/* 필터 칩 줄은 머리 안 — 머리와 함께 숨고 드러난다 */}
<ScrollAutoHide scrollContainerRef={scrollRef} className="z-[2] bg-bg-layer-default">
  <LedgerMonthNav />
  <LedgerTotal />
  {filters.length > 0 && <ChipGroup layout="scroll" aria-label="필터">{filters.map(renderFilterChip)}</ChipGroup>}
  <WeekStrip />
</ScrollAutoHide>`,
    render: () => phone({ chips: true }),
  },
];

