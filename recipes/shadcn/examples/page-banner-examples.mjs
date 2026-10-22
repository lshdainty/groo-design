/*
 * shadcn Page Banner 예제 — docs site components/page-banner.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 둘 모두 차례 · 제목 · 코드가 specs/components/page-banner.md 의 "코드" 절과 같다.
 *
 * PAGE_BANNER_BASE · PAGE_BANNER_VARIANTS · PAGE_BANNER_COMPOUND · PAGE_BANNER_DEFAULTS 는 recipes/shadcn/components/ui/page-banner.tsx 의
 * cva(pageBannerVariants)와, TONE_ICON · SCALE · SCALE_PRESS · ICON · CONTENT · BODY · TITLE · SPACE · BUTTON · CHEVRON · CLOSE · RING 은 그 파일의
 * 상수와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 규칙은 specs/components/page-banner.md, 수치 원본은 specs/components/page-banner.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 띠 <div data-slot="page-banner" data-tone data-variant data-interaction> > 안의 내용
 * <div data-slot="page-banner-inner">(전체 누르기면 이 층만 준다) > 앞 아이콘 <span data-slot="page-banner-icon"> · 글과 버튼
 * <div data-slot="page-banner-content"> > 문단 <p data-slot="page-banner-body">(제목 <span data-slot="page-banner-title"> · 띄어쓰기 두 칸
 * <span>(whitespace-pre-wrap) · 본문 <span data-slot="page-banner-description">) · 글 버튼 <button data-slot="page-banner-button">, 그리고 닫기
 * <button data-slot="page-banner-close">. 띠는 페이지 머리 바로 아래 화면 폭이라 미리보기는 폰 화면(360)의 윗부분에 그렸다.
 * 레시피의 스크립트(누르는 순간 --press-basis 재기 · 닫으면 걷고 초점 옮기기)는 정적 HTML 에 없다 — 닫기를 눌러도 띠가 그대로다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── page-banner.tsx 의 cva 와 같은 값 ────────────────────────────────────

// 띠 — 바탕 · 글자는 바탕 × 톤, Actionable 은 그 바탕의 누름 색(호버 · 누름) + 안쪽 링(옅은 바탕은 브랜드 링, 짙은 바탕은 띠 글자색)
const PAGE_BANNER_BASE = "group/page-banner relative flex min-h-10 w-full rounded-none px-global-gutter py-x2_5 text-left font-sans";

const PAGE_BANNER_VARIANTS = {
  tone: { neutral: "", informative: "", positive: "", warning: "", critical: "" },
  variant: { weak: "", solid: "" },
  interaction: {
    display: "",
    dismissible: "",
    actionable: [
      "cursor-pointer [--press-basis:40] [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
      "focus-visible:outline-2 focus-visible:-outline-offset-2",
    ].join(" "),
  },
};

const PAGE_BANNER_COMPOUND = [
  // 옅은 바탕 — Callout 과 같은 짝
  { variant: "weak", tone: "neutral", className: "bg-bg-neutral-weak text-fg-neutral" },
  { variant: "weak", tone: "informative", className: "bg-bg-informative-weak text-fg-informative-contrast" },
  { variant: "weak", tone: "positive", className: "bg-bg-positive-weak text-fg-positive-contrast" },
  { variant: "weak", tone: "warning", className: "bg-bg-warning-weak text-fg-warning-contrast" },
  { variant: "weak", tone: "critical", className: "bg-bg-critical-weak text-fg-critical-contrast" },
  // 짙은 바탕 — 흰 글(neutral 은 반전 짝)
  { variant: "solid", tone: "neutral", className: "bg-bg-neutral-inverted text-fg-neutral-inverted" },
  { variant: "solid", tone: "informative", className: "bg-bg-informative-solid text-static-white" },
  { variant: "solid", tone: "positive", className: "bg-bg-positive-solid text-static-white" },
  { variant: "solid", tone: "warning", className: "bg-bg-warning-solid text-static-white" },
  { variant: "solid", tone: "critical", className: "bg-bg-critical-solid text-static-white" },
  // Actionable — 링 색(옅은 바탕은 브랜드 링, 짙은 바탕은 띠 글자색) · 호버 · 누름 바탕
  { interaction: "actionable", variant: "weak", className: "focus-visible:outline-stroke-focus-ring" },
  { interaction: "actionable", variant: "solid", className: "focus-visible:outline-current" },
  { interaction: "actionable", variant: "weak", tone: "neutral", className: "hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed" },
  { interaction: "actionable", variant: "weak", tone: "informative", className: "hover:bg-bg-informative-weak-pressed active:bg-bg-informative-weak-pressed" },
  { interaction: "actionable", variant: "weak", tone: "positive", className: "hover:bg-bg-positive-weak-pressed active:bg-bg-positive-weak-pressed" },
  { interaction: "actionable", variant: "weak", tone: "warning", className: "hover:bg-bg-warning-weak-pressed active:bg-bg-warning-weak-pressed" },
  { interaction: "actionable", variant: "weak", tone: "critical", className: "hover:bg-bg-critical-weak-pressed active:bg-bg-critical-weak-pressed" },
  { interaction: "actionable", variant: "solid", tone: "neutral", className: "hover:bg-bg-neutral-inverted-pressed active:bg-bg-neutral-inverted-pressed" },
  { interaction: "actionable", variant: "solid", tone: "informative", className: "hover:bg-bg-informative-solid-pressed active:bg-bg-informative-solid-pressed" },
  { interaction: "actionable", variant: "solid", tone: "positive", className: "hover:bg-bg-positive-solid-pressed active:bg-bg-positive-solid-pressed" },
  { interaction: "actionable", variant: "solid", tone: "warning", className: "hover:bg-bg-warning-solid-pressed active:bg-bg-warning-solid-pressed" },
  { interaction: "actionable", variant: "solid", tone: "critical", className: "hover:bg-bg-critical-solid-pressed active:bg-bg-critical-solid-pressed" },
];

const PAGE_BANNER_DEFAULTS = { tone: "neutral", variant: "weak", interaction: "display" };

// ── page-banner.tsx 의 상수 · JSX 에 적힌 클래스 ──────────────────────────

// 톤의 기본 앞 아이콘 — lucide 선 아이콘(v106), Callout 과 같다. 레시피의 TONE_ICON(Info · Info · CircleCheck · TriangleAlert · CircleAlert)
const TONE_ICON = { neutral: "info", informative: "info", positive: "circleCheck", warning: "triangleAlert", critical: "circleAlert" };

// 안의 내용 — 아이콘 · 글 · 화살표 · 닫기. Actionable 을 누르는 동안 이 층만 준다(바탕은 그대로)
const SCALE = "relative flex min-w-0 flex-1 items-start gap-x2 [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const SCALE_PRESS = "group-active/page-banner:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/page-banner:[scale:1]";
const ICON = "mt-x0_5 flex shrink-0 [&>svg]:size-4";
// 글과 버튼 — 한 줄에 양 끝, 안 들어가면 버튼이 다음 줄 시작선으로(줄 사이 6)
const CONTENT = "flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x1_5";
const BODY = "min-w-0 text-t4 font-medium break-keep [overflow-wrap:break-word]";
const TITLE = "font-bold";
const SPACE = "whitespace-pre-wrap";
// 글 버튼 — 사방 11 · 바깥 −11(누르는 높이 40), 바탕 없이 2px 거리 축소. 링 색은 RING
const BUTTON = [
  "relative -m-[11px] shrink-0 cursor-pointer whitespace-nowrap rounded-r1 p-[11px] text-t3 font-bold",
  "[--press-basis:40] [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2",
].join(" ");
const CHEVRON = "size-4 shrink-0 self-center";
// 닫기 — 투명 상자 40 · 모서리 8 · 바깥 −12, 바탕 없이 2px 거리 축소(기준 40). 링 색은 RING
const CLOSE = [
  "relative -m-x3 flex size-10 shrink-0 cursor-pointer items-center justify-center self-center rounded-r2 [&>svg]:size-4",
  "[--press-basis:40] [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2",
].join(" ");
// 버튼 · 닫기의 링 색 — 링은 띠 위에 그려진다: 옅은 바탕은 브랜드 링, 짙은 바탕은 띠 글자색(브랜드 링은 짙은 바탕 위 1.6 ~ 2.4:1)
const RING = {
  weak: "focus-visible:outline-stroke-focus-ring",
  solid: "focus-visible:outline-current",
};

// ── cva 풀이 ──────────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다
function cvaOf(base, { variants = {}, compoundVariants = [], defaultVariants = {} } = {}) {
  return (props = {}) => {
    const p = { ...defaultVariants };
    for (const [k, v] of Object.entries(props)) if (v !== undefined) p[k] = v;
    const parts = [base];
    for (const [axis, map] of Object.entries(variants)) parts.push(map[p[axis]]);
    for (const { class: cls, className, ...when } of compoundVariants) {
      if (Object.entries(when).every(([k, v]) => (Array.isArray(v) ? v.includes(p[k]) : p[k] === v))) parts.push(cls, className);
    }
    return parts.filter(Boolean).join(" ");
  };
}

const pageBannerVariants = cvaOf(PAGE_BANNER_BASE, { variants: PAGE_BANNER_VARIANTS, compoundVariants: PAGE_BANNER_COMPOUND, defaultVariants: PAGE_BANNER_DEFAULTS });

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기는 class 나 감싼 자리의 [&>svg]:size-* 가 정한다
const svg = (paths, extra = "") =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${paths}</svg>`;

const PATHS = {
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  circleCheck: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  triangleAlert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  circleAlert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
};

// 사이트의 `.content p { margin: 12px 0; color: text-primary }` 는 층(@layer) 밖 규칙이라 Tailwind utility 를 늘 이긴다 — 문단 <p> 에는
// 레시피가 정한 바깥 여백(0 — preflight) · 글자색(띠의 글자색을 물려받는다)을 style 로 한 번 더 적는다(레시피에는 없는 미리보기용 덧칠)
const P_FIX = "margin:0; color:inherit;";

// <PageBanner> — page-banner.tsx 그대로(display · dismissible — 띠는 <div>, 안의 내용 · 글과 버튼은 <div>, 문단은 <p>).
// 속성 차례는 레시피의 JSX 차례다 — data-slot · data-tone · data-variant · data-interaction · class → 코드가 넘긴 것
function pageBanner({ tone = "neutral", variant = "weak", interaction = "display", title, button, children }) {
  const icon = `<span aria-hidden="true" data-slot="page-banner-icon" class="${ICON}">${svg(PATHS[TONE_ICON[tone]])}</span>`;
  const titleHtml = title != null ? `<span data-slot="page-banner-title" class="${TITLE}">${esc(title)}</span><span class="${SPACE}">  </span>` : "";
  const bodyHtml = `<p data-slot="page-banner-body" class="${BODY}" style="${P_FIX}">${titleHtml}<span data-slot="page-banner-description">${esc(children)}</span></p>`;
  // 버튼 · 닫기는 cn(BUTTON | CLOSE, RING[variant]) — 지워지는 클래스가 없다
  const buttonHtml =
    interaction === "display" && button ? `<button type="button" data-slot="page-banner-button" class="${BUTTON} ${RING[variant]}">${esc(button)}</button>` : "";
  const close =
    interaction === "dismissible"
      ? `<button type="button" data-slot="page-banner-close" aria-label="닫기" class="${CLOSE} ${RING[variant]}">${svg(PATHS.x)}</button>`
      : "";
  const inner = `<div data-slot="page-banner-inner" class="${SCALE}">${icon}<div data-slot="page-banner-content" class="${CONTENT}">${bodyHtml}${buttonHtml}</div>${close}</div>`;
  const root = attrs([
    'data-slot="page-banner"',
    `data-tone="${tone}"`,
    `data-variant="${variant}"`,
    `data-interaction="${interaction}"`,
    `class="${pageBannerVariants({ tone, variant, interaction })}"`,
  ]);
  return `<div ${root}>${inner}</div>`;
}

// 폰 화면의 윗부분 — 머리 바로 아래 화면 폭 띠, 그 아래 본문 자리(미리보기 틀이다)
const SCREEN =
  "max-width:360px; overflow:hidden; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); font-family:var(--font-sans);";
const HEAD =
  "padding:var(--spacing-x5) var(--spacing-global-gutter) var(--spacing-x3); font-size:var(--text-t7); line-height:var(--text-t7--line-height); font-weight:700; color:var(--color-fg-neutral);";
const ROW =
  "display:flex; justify-content:space-between; gap:var(--spacing-x3); padding:var(--spacing-x2_5) var(--spacing-global-gutter); font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const screen = (title, banner, rows) =>
  `<div style="${SCREEN}"><div style="${HEAD}">${title}</div>${banner}<div style="padding:var(--spacing-x2) 0;">${rows
    .map(([a, b]) => `<div style="${ROW}"><span>${a}</span><span style="font-weight:700;">${b}</span></div>`)
    .join("")}</div></div>`;
const grid = (items) =>
  `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:var(--spacing-x6) var(--spacing-x4); align-items:start;">${items.join("")}</div>`;
const CAPTION = "display:block; margin-top:var(--spacing-x2); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) => `<div style="min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const pageBannerExamples = [
  {
    title: "연결 끊김 — 버튼 하나",
    description:
      "페이지 머리 바로 아래(위에 사진이 있으면 그 아래) 화면 폭 전체에 하나 — 그 페이지 전체의 상태를 알린다. 모서리 0 · 최소 40 · 위아래 10 · 좌우 화면 여백 24(띠 안 글이 페이지 글과 같은 선에서 시작한다). 앞 아이콘 16 은 위 2 를 두어 첫 줄 가운데에 붙고, 제목(700) · 본문(500)은 14 / 19 한 문단이다(사이 띄어쓰기 두 칸). 버튼은 동작 이름 하나 · 13 · 700 글 버튼이고 누르는 높이 40(사방 11 · 바깥 −11 — 띠 높이는 그대로)이다. 본문과 버튼은 한 줄에 양 끝이고, 안 들어가면 버튼이 다음 줄 본문 시작선으로 간다(줄 사이 6) — 미리보기는 폰 폭이라 버튼이 다음 줄에 있다. 옅은 바탕(variant=\"weak\" · 기본)은 Callout 과 같은 짝(bg-*-weak + fg-*-contrast)이다. 연결이 끊겨도 지난 값은 지우지 않는다. 나중에 나타나는 경고 · 위험이면 role=\"alert\" 를 단다.",
    jsx: `import { PageBanner } from "@/components/ui/page-banner"

<PageBanner tone="critical" title="연결 끊김" button={{ label: "다시 연결", onClick: reconnect }}>
  토스증권 키가 만료돼 시세를 받지 못해요.
</PageBanner>`,
    render: () =>
      screen(
        "증권",
        pageBanner({ tone: "critical", title: "연결 끊김", button: "다시 연결", children: "토스증권 키가 만료돼 시세를 받지 못해요." }),
        [["삼성전자 · 12주", "75,400원"], ["카카오 · 5주", "47,100원"]],
      ),
  },

  {
    title: "새 버전 · 닫기",
    description:
      "새 기능 · 새 버전처럼 한 번 보면 되는 안내만 닫을 수 있다(interaction=\"dismissible\") — 닫기는 투명 상자 40 · 모서리 8 · 바깥 −12(띠 높이를 늘리지 않고, 아이콘은 오른쪽 끝에서 24 · 글과 8) · 이름 \"닫기\" 이고, 누르면 바탕 없이 닫기만 준다. 닫으면 바로 걷고 초점은 다음 요소로 간다 — open · onDismiss 로 닫음을 기억해 다시 띄우지 않는다. 경고 · 오류 배너는 닫지 못하고, 닫기와 버튼은 함께 두지 않는다. 짙은 바탕(variant=\"solid\")은 bg-*-solid + 흰 글(static-white — neutral 은 bg-neutral-inverted + fg-neutral-inverted)이고 Pro 만료처럼 그 페이지를 제대로 쓸 수 없게 될 무거운 상태에만 쓴다. 포커스 링은 키보드에만 안쪽 2px(띄움 −2)이다 — 옅은 바탕은 stroke-focus-ring, 짙은 바탕은 띠 글자색(outline-current — 브랜드 링은 짙은 바탕 위에서 보이지 않는다)이고 버튼 · 닫기도 같다. 한 화면에는 배너 하나 — 미리보기는 두 화면을 나란히 그렸다.",
    jsx: `{/* 한 번 보면 되는 안내 — 닫으면 다시 띄우지 않는다 */}
<PageBanner tone="informative" title="새 기능" interaction="dismissible" open={!seen} onDismiss={markSeen}>
  반복 거래를 자동으로 기록할 수 있어요.
</PageBanner>

<PageBanner tone="warning" variant="solid" title="곧 만료" button={{ label: "구독 보기", onClick: openSubscription }}>
  Pro 이용이 10월 31일에 끝나요.
</PageBanner>`,
    render: () =>
      grid([
        labeled(
          screen(
            "가계부",
            pageBanner({ tone: "informative", title: "새 기능", interaction: "dismissible", children: "반복 거래를 자동으로 기록할 수 있어요." }),
            [["김밥천국", "8,000원"], ["버스", "1,500원"]],
          ),
          "dismissible — 한 번 보면 되는 안내",
        ),
        labeled(
          screen(
            "설정",
            pageBanner({ tone: "warning", variant: "solid", title: "곧 만료", button: "구독 보기", children: "Pro 이용이 10월 31일에 끝나요." }),
            [["구독", "Pro"], ["결제 수단", "현대카드 M"]],
          ),
          "solid — 무거운 상태에만 · 흰 글",
        ),
      ]),
  },
];
