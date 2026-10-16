/*
 * shadcn Result Section 예제 — docs site components/result-section.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 셋 모두 차례 · 제목 · 코드가 specs/components/result-section.md 의 "코드" 절과 같다.
 *
 * RESULT_BASE 는 recipes/shadcn/components/ui/result-section.tsx 의 cva(resultSectionVariants — 축 없음)와, ASSET · KIND_COLOR · SIZES · TITLE ·
 * DESCRIPTION · ACTIONS · SECONDARY 는 그 파일의 상수와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 버튼의 BUTTON_* 는
 * button.tsx 의 cva(buttonVariants)와 같다 — 이 파일이 쓰는 변형(neutralWeak · ghost) · 크기(small · medium)와 그에 걸리는 compound 만
 * 옮겼다(button-examples.mjs 의 것과도 같다 — button.tsx 를 고치면 함께). 규칙은 specs/components/result-section.md, 수치 원본은 result-section.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 묶음 <div role="status" data-slot="result-section" data-kind data-size> > 아이콘
 * <span data-slot="result-section-asset"> · 제목 <h2 data-slot="result-section-title">(as — 기본 h2) · 설명 <p data-slot="result-section-description"> ·
 * 버튼 <div data-slot="result-section-actions"> > Button(첫 버튼 neutralWeak medium 40 · 둘째 글 버튼 = ghost small 36 + 글자 fg-neutral-muted + 위아래 −8). href 를 준 버튼은
 * Button asChild 의 <a> 다 — 미리보기는 옮기지 않게 "#" 로 그렸다(코드는 "/").
 * 레시피는 처음 한 프레임 내용을 감췄다가([&>*]:invisible) 보인다 — status 에 나중에 들어온 내용이어야 보조 기술이 읽는다. 미리보기는 보인 뒤의 모습이다.
 * 나타나는 애니메이션(tw-animate-css)과 다시 시도의 로딩은 정적 HTML 에 없다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── result-section.tsx 의 cva · 상수와 같은 값 ───────────────────────────

// 묶음 — 가운데 · 좌우 48 · 위아래 16(카드 안이면 좌우 0 — 카드의 24 가 가장자리를 가진다, 목록 카드의 바로 아래면 24 — 사용자 결정 23B.
// 목록 카드 바로 아래의 기다리는 영역(LoadingRegion)에 바로 둔 것도 24). 나타날 때 150ms enter 투명도(모션 줄이기면 없음)
const RESULT_BASE = [
  "flex grow flex-col items-center justify-center px-x12 py-x4 text-center font-sans transition-none",
  "[[data-slot=card]_&]:px-0 [[data-slot=card][data-body=list]>&]:px-x6 [[data-slot=card][data-body=list]>[data-slot=loading-region]>&]:px-x6",
  "animate-in fade-in-0 duration-[var(--motion-duration-d3)] ease-[var(--motion-ease-enter)] motion-reduce:animate-none",
].join(" ");

// 아이콘 — 40 · 굵기 1.5 · 아래 16, 색은 결과마다
const ASSET = "mb-x4 flex shrink-0 [&>svg]:size-10 [&>svg]:[stroke-width:1.5]";
const KIND_COLOR = {
  empty: "text-fg-neutral-subtle",
  failure: "text-fg-critical",
  done: "text-fg-positive",
};

// 크기 — 제목 · 설명 글자와 사이, 버튼 위
const SIZES = {
  large: { title: "text-t8", description: "mt-x3 text-t5", actions: "mt-x7" },
  medium: { title: "text-t5", description: "mt-x2 text-t4", actions: "mt-x6" },
};
const TITLE = "font-bold text-fg-neutral break-keep [overflow-wrap:break-word]";
const DESCRIPTION = "font-normal text-fg-neutral-muted break-keep [overflow-wrap:break-word]";
// 버튼 묶음 — 위아래로, 사이 20. 둘째 버튼이 위아래 −8 블리드해 상자 사이는 12 다(SEED 와 같다)
const ACTIONS = "flex flex-col items-center gap-x5";
// 둘째 버튼 — 글 버튼(SEED Text Button = ghost small 36 + 글자 fg-neutral-muted). 위아래 −8(Button small 의 위아래 여백) — 글 자리만 차지한다
const SECONDARY = "-my-x2 text-fg-neutral-muted";

// ── button.tsx 의 cva 와 같은 값 — 첫 버튼(neutralWeak · medium) · 둘째 버튼(ghost · small) ─────────

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
    neutralWeak:
      "bg-bg-neutral-weak text-fg-neutral hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed aria-busy:bg-bg-neutral-weak-pressed [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
    ghost:
      "bg-transparent text-fg-neutral hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed aria-busy:bg-bg-layer-default-pressed disabled:bg-transparent [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
  },
  size: {
    small: "h-9 rounded-r2 [--press-basis:36] [--progress-size:14px]",
    medium: "h-10 rounded-r2 [--press-basis:40] [--progress-size:16px]",
  },
  layout: { withText: "", iconOnly: "" },
  ghostColor: { neutral: "", neutralSubtle: "", brand: "", critical: "" },
  flush: { left: "", right: "" },
};

const BUTTON_COMPOUND = [
  { size: "small", layout: "withText", className: "px-x3_5 py-x2 gap-x1 text-t4 [&_svg]:size-3.5" },
  { size: "medium", layout: "withText", className: "px-x4 py-x2_5 gap-x1_5 text-t4 [&_svg]:size-4" },
];

const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// ── cva 풀이 ──────────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순) → className. 고르지 않은 축은 기본값을 쓴다
function cvaOf(base, { variants = {}, compoundVariants = [], defaultVariants = {} } = {}) {
  return ({ className, ...props } = {}) => {
    const p = { ...defaultVariants };
    for (const [k, v] of Object.entries(props)) if (v !== undefined) p[k] = v;
    const parts = [base];
    for (const [axis, map] of Object.entries(variants)) parts.push(map[p[axis]]);
    for (const { class: cls, className: extra, ...when } of compoundVariants) {
      if (Object.entries(when).every(([k, v]) => (Array.isArray(v) ? v.includes(p[k]) : p[k] === v))) parts.push(cls, extra);
    }
    parts.push(className);
    return parts.filter(Boolean).join(" ");
  };
}

const resultSectionVariants = cvaOf(RESULT_BASE);
const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });

// "[&:is(…)]:hover:bg-x" → ["[&:is(…)]", "hover", "bg-x"] — 괄호 안의 ":" 는 가르지 않는다
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

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다 — field-examples.mjs 의 merge 와 같다(배경 · 글자색 · 글자 크기 · 모서리 ·
// 폭 · 높이 · 임의 속성). Button 은 cn(buttonVariants(…)) 이라 ghost 의 disabled:bg-transparent 가 바탕의 disabled:bg-bg-disabled 를 지운다
const GROUPS = [
  [/^bg-/, "bg"],
  [/^text-(?:fg-|static-|transparent$)/, "color"],
  [/^text-t\d+$/, "font-size"],
  [/^rounded-(?:none|full|r\d+)$/, "rounded"],
  [/^w-/, "w"],
  [/^h-/, "h"],
];

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

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기 · 굵기는 감싼 자리의 [&>svg]:size-10 · [stroke-width:1.5] 가 정한다
const svg = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const PATHS = {
  receiptText: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M14 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/>',
  searchX: '<path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  circleAlert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  circleCheck: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
};

// 사이트의 `.content p { margin: 12px 0; color: text-primary }` 는 층(@layer) 밖 규칙이라 Tailwind utility 를 늘 이긴다 — 설명 <p> 에는
// 클래스가 정한 위 여백(mt-x3 · mt-x2) · 글자색(fg-neutral-muted)을 style 로 한 번 더 적는다(레시피에는 없는 미리보기용 덧칠)
const P_FIX = {
  large: "margin:var(--spacing-x3) 0 0; color:var(--color-fg-neutral-muted);",
  medium: "margin:var(--spacing-x2) 0 0; color:var(--color-fg-neutral-muted);",
};

// <Button> — button.tsx 그대로. cn(buttonVariants({ …, className })) — className 을 cva 뒤에 붙이고 merge 로 합친다.
// href 면 Button asChild 의 <a>(Slot 이 class 를 넘긴다)
function button({ variant, size, className, label, href }) {
  const cls = merge(buttonVariants({ variant, size, className }));
  if (href != null) return `<a href="#" class="${cls}">${esc(label)}</a>`;
  return `<button class="${cls}" type="button">${esc(label)}</button>`;
}

// <ResultSection> — result-section.tsx 그대로(보인 뒤 — [&>*]:invisible 없음). 속성 차례는 레시피의 JSX 차례다
function resultSection({ kind = "empty", size = "large", icon, title, description, primaryAction, secondaryAction }) {
  const s = SIZES[size];
  const shownIcon = icon ?? (kind === "failure" ? "circleAlert" : kind === "done" ? "circleCheck" : null);
  const asset = shownIcon ? `<span aria-hidden="true" data-slot="result-section-asset" class="${ASSET} ${KIND_COLOR[kind]}">${svg(PATHS[shownIcon])}</span>` : "";
  const desc =
    description != null ? `<p data-slot="result-section-description" class="${DESCRIPTION} ${s.description}" style="${P_FIX[size]}">${esc(description)}</p>` : "";
  const actions =
    primaryAction || secondaryAction
      ? `<div data-slot="result-section-actions" class="${ACTIONS} ${s.actions}">${
          primaryAction ? button({ variant: "neutralWeak", size: "medium", ...primaryAction }) : ""
        }${secondaryAction ? button({ variant: "ghost", size: "small", className: SECONDARY, ...secondaryAction }) : ""}</div>`
      : "";
  return `<div role="status" data-slot="result-section" data-kind="${kind}" data-size="${size}" class="${resultSectionVariants()}">${asset}<h2 data-slot="result-section-title" class="${TITLE} ${s.title}">${esc(
    title,
  )}</h2>${desc}${actions}</div>`;
}

// 화면 — 폰(360) · 데스크톱. 결과는 놓인 자리 가운데에 서고 남는 높이를 채운다(부모가 세로 flex). 미리보기 틀이다
const FRAME = "display:flex; flex-direction:column; overflow:hidden; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); font-family:var(--font-sans);";
const PHONE = `${FRAME} max-width:360px; min-height:440px; background:var(--color-bg-layer-default);`;
const DESK = `${FRAME} min-height:320px; background:var(--color-bg-layer-default);`;
const HEAD =
  "padding:var(--spacing-x5) var(--spacing-global-gutter) var(--spacing-x3); font-size:var(--text-t7); line-height:var(--text-t7--line-height); font-weight:700; color:var(--color-fg-neutral);";
const phone = (title, inner, extra = "") => `<div style="${PHONE}${extra}"><div style="${HEAD}">${title}</div>${inner}</div>`;
// 카드 안의 결과(medium) — 회색 바탕 위 카드(card.md — 흰 면 + 1px stroke-neutral-weak · 모서리 16 · 여백 24 · 화면 끝 24 · 머리 제목 16 / 22 · 700).
// 카드 안의 Result Section 은 제 좌우 48 을 두지 않는다 — 카드의 24 가 가장자리를 가진다(사용자 결정 23B). data-slot · data-body 는 레시피 Card 의 자리
const CARD =
  "display:flex; flex-direction:column; margin:0 var(--spacing-global-gutter) var(--spacing-x6); padding:var(--spacing-x6); border:1px solid var(--color-stroke-neutral-weak); border-radius:var(--radius-r4); background:var(--color-bg-layer-default);";
const CARD_TITLE =
  "padding:0 0 var(--spacing-x2); font-size:var(--text-t5); line-height:var(--text-t5--line-height); font-weight:700; color:var(--color-fg-neutral);";
const grid = (items) =>
  `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:var(--spacing-x6) var(--spacing-x4); align-items:start;">${items.join("")}</div>`;
const CAPTION = "display:block; margin-top:var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const resultSectionExamples = [
  {
    title: "비어 있음",
    description:
      "놓인 자리의 가로 · 세로 가운데에 선다(부모가 세로 flex 면 남는 높이를 채운다) — 좌우 48 · 위아래 16, 글은 가운데 정렬. 비어 있음(kind=\"empty\" · 기본)은 무엇이 비었는지 말하는 아이콘을 꼭 준다 — 40 · 굵기 1.5 · fg-neutral-subtle · 아래 16(lucide 선 아이콘). large(기본 — 화면 전체)는 제목 22 / 30 · 700 · fg-neutral(제목 태그 — as, 기본 h2 · 큰 글씨라 마침표 없이) · 설명 16 / 22 · fg-neutral-muted(사이 12 · 무엇을 하면 되는지 · 최대 두 줄) · 버튼 위 28 이다. 첫 버튼은 그 상태를 푸는 동작이고 Button neutralWeak medium 40 이다. 묶음은 role=\"status\" 라 불러오는 중에서 결과로 바뀌면 보조 기술이 읽는다. 불러오기에 실패했을 때는 이 모습이 아니라 failure 다.",
    jsx: `import { ResultSection } from "@/components/ui/result-section"

<ResultSection
  kind="empty"
  icon={<ReceiptText />}
  title="이번 달 거래가 없어요"
  description="거래를 기록하면 여기에 모여요."
  primaryAction={{ label: "거래 추가", onClick: openAddTx }}
/>`,
    render: () =>
      phone(
        "가계부",
        resultSection({ kind: "empty", icon: "receiptText", title: "이번 달 거래가 없어요", description: "거래를 기록하면 여기에 모여요.", primaryAction: { label: "거래 추가" } }),
      ),
  },

  {
    title: "불러오기 실패 — 다시 시도",
    description:
      "불러오기에 실패하면 \"내역이 없어요\" 가 아니라 실패를 보인다 — kind=\"failure\"(circle-alert · fg-critical)에 무엇을 불러오지 못했는지와 \"다시 시도\" 를 둔다. 비어 있다고 믿으면 사람은 기록을 다시 넣거나 떠난다. 다시 불러오는 동안은 그 버튼에 loading 을 건다(primaryAction.loading — Button 의 로딩). 카드 · 섹션 · 시트 안이면 size=\"medium\" — 제목 16 / 22 · 설명 14 / 19(사이 8) · 버튼 위 24. 이미 불러온 내용이 있으면 지우지 않고 다시 불러오기 실패는 Snackbar 로 가볍게 알린다. 서버가 보낸 글 · 예외 · 영어는 설명에 쓰지 않는다.",
    jsx: `{query.isError && !query.data ? (
  <ResultSection
    kind="failure"
    size="medium"
    title="거래를 불러오지 못했어요"
    description="잠시 뒤 다시 시도해 주세요."
    primaryAction={{ label: "다시 시도", onClick: () => query.refetch() }}
  />
) : (
  <TransactionList items={query.data} />
)}`,
    render: () =>
      phone(
        "홈",
        `<div data-slot="card" data-variant="default" data-body="content" data-press="none" style="${CARD}"><div style="${CARD_TITLE}">이번 달 거래</div>${resultSection({
          kind: "failure",
          size: "medium",
          title: "거래를 불러오지 못했어요",
          description: "잠시 뒤 다시 시도해 주세요.",
          primaryAction: { label: "다시 시도" },
        })}</div>`,
        " min-height:0; background:var(--color-bg-layer-basement);",
      ),
  },

  {
    title: "완료 · 찾을 수 없는 페이지",
    description:
      "완료(kind=\"done\" — circle-check · fg-positive)는 다음 동작과 보조 동작 둘까지 둔다 — 둘째 버튼은 글 버튼(SEED Text Button — Button ghost small 36 + 글자 fg-neutral-muted)이고 위아래로 −8 블리드해 글 자리만 차지한다 — 버튼 사이는 20 이라 보이는 상자 사이는 12 다(SEED 와 같다). 버튼에 href 를 주면 링크로 그린다(Button asChild). 없는 주소는 몰래 다른 곳으로 돌리지 않고 \"페이지를 찾을 수 없어요\" + \"홈으로\" 를 large 로 보인다 — 화면이 그리다 멈추면 빈 화면 대신 \"문제가 생겼어요\" + \"다시 시도\" 다. 버튼은 셋 이상 두지 않는다. 설명은 문장이면 해요체 + 마침표, \"건너뛴 줄 3 · 실패 0\" 처럼 요약이면 마침표 없이 쓴다.",
    jsx: `<ResultSection
  kind="done"
  title="1,204건을 가져왔어요"
  description="건너뛴 줄 3 · 실패 0"
  primaryAction={{ label: "가계부로 가기", onClick: goLedger }}
  secondaryAction={{ label: "다른 파일 가져오기", onClick: reset }}
/>

<ResultSection kind="empty" icon={<SearchX />} title="페이지를 찾을 수 없어요" primaryAction={{ label: "홈으로", href: "/" }} />`,
    render: () =>
      grid([
        labeled(
          phone(
            "가져오기",
            resultSection({
              kind: "done",
              title: "1,204건을 가져왔어요",
              description: "건너뛴 줄 3 · 실패 0",
              primaryAction: { label: "가계부로 가기" },
              secondaryAction: { label: "다른 파일 가져오기" },
            }),
          ),
          "done — 다음 동작 · 보조 동작",
        ),
        labeled(
          `<div style="${DESK}">${resultSection({ kind: "empty", icon: "searchX", title: "페이지를 찾을 수 없어요", primaryAction: { label: "홈으로", href: "/" } })}</div>`,
          "404 — 몰래 돌리지 않는다 · 홈으로",
        ),
      ]),
  },
];
