/*
 * shadcn Divider 예제 — docs site components/divider.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(묶음 사이 · 같은 묶음 안 · 세로)은 차례 · 제목 · 코드가 specs/components/divider.md 의
 * "코드" 절과 같고, 뒤의 둘(세 가지 나누기 · 장식과 의미 있는 구분선)은 md 의 Guidelines · Accessibility 를 코드로 더 보인다.
 * 옛 Separator 예제(separator-examples.mjs — border-default 1px)를 대신한다 — 이름도 SEED 대로 Divider 다.
 *
 * DIVIDER_BASE · DIVIDER_VARIANTS · DIVIDER_COMPOUND · DIVIDER_DEFAULTS 는 recipes/shadcn/components/ui/divider.tsx 의 cva(dividerVariants)와
 * 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 규칙은 specs/components/divider.md, 수치 원본은 specs/components/divider.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — <div data-slot="divider" data-orientation> 하나이고, 장식(기본)이면 aria-hidden, decorative={false} 면
 * role="separator" + aria-orientation 이다. divider.tsx 는 cva 결과를 cn() 에 넣지만 지워지는 클래스가 없다 — 그래서 그대로 잇는다.
 * 사이트의 `.content p { margin: 12px 0; color: text-primary }` 는 층(@layer) 밖 규칙이라 Tailwind utility 를 늘 이긴다 — 코드의 <p> 에는
 * preflight 가 정한 바깥 여백 0 과 둘레 글자색을 style 로 한 번 더 적는다(레시피에는 없는 미리보기용 덧칠 — P_FIX).
 */

// ── divider.tsx 의 cva 와 같은 값 ────────────────────────────────────────

// 선 — 1px stroke-neutral-subtle 하나, 바깥 여백 없음
const DIVIDER_BASE = "shrink-0 bg-stroke-neutral-subtle";

// 방향 — 가로(높이 1 · 부모 폭) · 세로(폭 1 · 부모 높이 — flex 안에서 늘어난다). 들임 — 축이 아니라 compound 가 칠한다
const DIVIDER_VARIANTS = {
  orientation: {
    horizontal: "h-px",
    vertical: "w-px self-stretch",
  },
  inset: {
    false: "",
    true: "",
  },
};

// 방향 × 들임 — 가로 끝까지는 폭 전체, 가로 들임은 양끝 16(폭 = 부모 − 32), 세로 들임은 위아래 16
const DIVIDER_COMPOUND = [
  { orientation: "horizontal", inset: false, className: "w-full" },
  { orientation: "horizontal", inset: true, className: "mx-x4 w-[calc(100%-2*var(--spacing-x4))]" },
  { orientation: "vertical", inset: true, className: "my-x4" },
];

const DIVIDER_DEFAULTS = { orientation: "horizontal", inset: false };

// ── cva 풀이 ──────────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다.
// 참 · 거짓 축(inset)은 cva 처럼 "true" · "false" 글자 키로 찾고, compound 는 값 그대로 견준다
const variantKey = (v) => (typeof v === "boolean" ? String(v) : v);

function cvaOf(base, { variants = {}, compoundVariants = [], defaultVariants = {} } = {}) {
  return (props = {}) => {
    const p = { ...defaultVariants };
    for (const [k, v] of Object.entries(props)) if (v !== undefined) p[k] = v;
    const parts = [base];
    for (const [axis, map] of Object.entries(variants)) parts.push(map[variantKey(p[axis])]);
    for (const { class: cls, className, ...when } of compoundVariants) {
      if (Object.entries(when).every(([k, v]) => p[k] === v)) parts.push(cls, className);
    }
    return parts.filter(Boolean).join(" ");
  };
}

const dividerVariants = cvaOf(DIVIDER_BASE, { variants: DIVIDER_VARIANTS, compoundVariants: DIVIDER_COMPOUND, defaultVariants: DIVIDER_DEFAULTS });

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// <Divider> — divider.tsx 그대로. 장식(기본)은 aria-hidden, decorative={false} 면 role="separator" + aria-orientation
function divider({ orientation = "horizontal", inset = false, decorative = true } = {}) {
  const attrs = [
    'data-slot="divider"',
    `data-orientation="${orientation}"`,
    decorative && 'aria-hidden="true"',
    !decorative && 'role="separator"',
    !decorative && `aria-orientation="${orientation}"`,
    `class="${dividerVariants({ orientation, inset })}"`,
  ].filter(Boolean).join(" ");
  return `<div ${attrs}></div>`;
}

// 코드의 <p> — 사이트 .content p 의 여백 · 글자색을 style 로 되돌린다(미리보기용 덧칠)
const P_FIX = "margin:0; color:inherit;";

// 폰 화면 · 흰 표면 · 이름표 — 미리보기 틀(레시피가 아니다)
const SCREEN =
  "max-width:360px; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x3) var(--spacing-global-gutter); color:var(--color-fg-neutral); font-family:var(--font-sans); font-size:var(--text-t5); line-height:var(--text-t5--line-height);";
const screen = (html, extra = "") => `<div style="${SCREEN}${extra}">${html}</div>`;
const SURFACE =
  "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-x6); color:var(--color-fg-neutral); font-family:var(--font-sans);";
const CAPTION = "font-size:var(--text-t2); line-height:var(--text-t2--line-height); font-weight:400; color:var(--color-fg-neutral-subtle);";
const CODE = `${CAPTION} font-family:ui-monospace, SFMono-Regular, Menlo, monospace;`;
const labeled = (html, caption, style = CODE) =>
  `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2); min-width:0;">${html}<span style="${style}">${caption}</span></div>`;
const grid = (items, min = 200) =>
  `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(${min}px, 1fr)); gap:var(--spacing-x5) var(--spacing-x4); align-items:start;">${items.join("")}</div>`;
const MUTED = "color:var(--color-fg-neutral-subtle);";
const SECTION_TITLE = "font-size:var(--text-t4); line-height:var(--text-t4--line-height); font-weight:700;";

// ── 예제 ──────────────────────────────────────────────────────────────────

export const dividerExamples = [
  {
    title: "묶음 사이 · 같은 묶음 안",
    description:
      "내용 사이를 나누는 1px 선이다 — 색은 하나(stroke-neutral-subtle — 흰 바탕 1.15 · 다크 1.30, SEED 기본 선과 같은 진하기)이고 굵은 선 · 짙은 선 · 점선을 두지 않는다. 같은 묶음 안(상세의 키-값 줄 묶음)은 들인 선(inset — 양끝 16, 폭은 부모 − 32), 묶음 사이 · 액션 영역 위는 끝까지 선이다. 선은 바깥 여백이 없다 — 위아래 · 좌우 간격은 쓰는 자리가 정하고 들임만 Divider 가 갖는다. 기본은 장식이라 보조 기술에 숨긴다(aria-hidden) — 묶음은 제목 · 목록 · section 이 알린다. 선은 내용 사이에만 두고 화면 · 묶음의 마지막 아래에는 두지 않는다.",
    jsx: `import { Divider } from "@/components/ui/divider"

<div>
  <p className="flex justify-between py-x3">결제 수단<span>생활비 카드</span></p>
  <Divider inset />
  <p className="flex justify-between py-x3">할부<span>3개월</span></p>
</div>
<Divider />
<section aria-labelledby="memo-title">…</section>`,
    render: () =>
      screen(
        `<div><p class="flex justify-between py-x3" style="${P_FIX}">결제 수단<span>생활비 카드</span></p>${divider({ inset: true })}<p class="flex justify-between py-x3" style="${P_FIX}">할부<span>3개월</span></p></div>${divider()}<section aria-labelledby="divider-ex-memo-title" style="padding:var(--spacing-x3) 0;"><div id="divider-ex-memo-title" style="${SECTION_TITLE}">메모</div><div style="${MUTED}">회의 전 커피 — 팀 4명</div></section>`,
      ),
  },

  {
    title: "세로 — 칸 사이",
    description:
      "orientation=\"vertical\" 은 가로로 놓인 칸 사이(통계 세 칸 · 버튼 묶음)다 — 폭 1 이고 높이는 부모가 정한다(flex 안에서 늘어난다 — self-stretch). 부모(flex)에 높이가 없으면 선이 0 이 된다. inset 이면 위아래 16 을 들인다. 미리보기는 코드 그대로라 칸이 두 줄 글(44) 높이이고 선은 그 안에서 위아래 16 을 뺀 12 다 — 실제 통계 칸은 위아래 여백을 둬 선이 길어진다.",
    jsx: `<div className="flex items-stretch">
  <p className="flex-1 py-x4 text-center">수입<br />{formatWon(income)}</p>
  <Divider orientation="vertical" inset />
  <p className="flex-1 py-x4 text-center">지출<br />{formatWon(expense)}</p>
  <Divider orientation="vertical" inset />
  <p className="flex-1 py-x4 text-center">남은 돈<br />{formatWon(rest)}</p>
</div>`,
    render: () =>
      screen(
        `<div class="flex items-stretch">${[
          ["수입", "3,200,000원"],
          ["지출", "1,284,500원"],
          ["남은 돈", "1,915,500원"],
        ]
          .map(([k, v], i) => `${i ? divider({ orientation: "vertical", inset: true }) : ""}<p class="flex-1 py-x4 text-center" style="${P_FIX}">${esc(k)}<br />${esc(v)}</p>`)
          .join("")}</div>`,
        " padding-inline:var(--spacing-x2);",
      ),
  },

  {
    title: "세 가지 나누기 — 들인 선 · 끝까지 선 · 8 간격",
    description:
      "나누는 세기는 셋이다. 약함 — 같은 묶음 안은 들인 선(inset). 중간 — 묶음 사이 · 액션 영역(바닥 버튼) 위 · 스크롤되는 본문 위 머리는 끝까지 선. 강함 — 크게 다른 내용 사이는 선이 아니라 8 간격이다: 회색 바탕(bg-layer-basement) 위에 흰 층(bg-layer-default) 묶음을 8 띄워 놓는다(\"8px 구분선\" 은 없다 — 두꺼운 회색 막대를 그리지 않는다). 선을 두기 전에 여백 · 제목 · 바탕 층으로 갈리는지 먼저 본다 — 반복되는 목록 줄 사이는 Divider 가 아니라 List 의 줄 사이 선(필요할 때만)이다.",
    jsx: `<div className="flex flex-col gap-x2 bg-bg-layer-basement">
  <section className="bg-bg-layer-default">
    <p className="py-x3">결제 수단 · 생활비 카드</p>
    <Divider inset />
    <p className="py-x3">할부 · 일시불</p>
    <Divider />
    <p className="py-x3">메모</p>
  </section>
  <section className="bg-bg-layer-default">
    <p className="py-x3">이번 달 통계</p>
  </section>
</div>`,
    render: () =>
      `<div class="flex flex-col gap-x2 bg-bg-layer-basement" style="max-width:360px; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); overflow:hidden; color:var(--color-fg-neutral); font-family:var(--font-sans); font-size:var(--text-t5); line-height:var(--text-t5--line-height);">${[
        `<section class="bg-bg-layer-default" style="padding:0 var(--spacing-global-gutter);"><p class="py-x3" style="${P_FIX}">결제 수단 · 생활비 카드</p>${divider({ inset: true })}<p class="py-x3" style="${P_FIX}">할부 · 일시불</p>${divider()}<p class="py-x3" style="${P_FIX}">메모</p></section>`,
        `<section class="bg-bg-layer-default" style="padding:0 var(--spacing-global-gutter);"><p class="py-x3" style="${P_FIX}">이번 달 통계</p></section>`,
      ].join("")}</div>`,
  },

  {
    title: "장식 · 의미 있는 구분선",
    description:
      "선은 눈으로 묶음을 가르는 장식이라 기본은 보조 기술에 숨긴다(<div aria-hidden>) — SEED 는 <hr>(\"구분선\" 으로 읽힌다)이 기본이지만 groo 는 장식이 기본이다. 문서의 장처럼 보조 기술도 \"구분선\" 을 알아야 하는 자리만 decorative={false} 로 role=\"separator\" 를 둔다 — 세로선이면 aria-orientation=\"vertical\" 이다. 두 선은 모습이 같다. <hr> 로 그리지 않는다.",
    jsx: `<Divider />                                       {/* 장식 — aria-hidden */}
<Divider decorative={false} />                    {/* role="separator" */}
<Divider orientation="vertical" decorative={false} /> {/* aria-orientation="vertical" */}`,
    render: () =>
      `<div style="${SURFACE}">${grid([
        labeled(`<div style="padding:var(--spacing-x3) 0;">${divider()}</div>`, "aria-hidden=\"true\""),
        labeled(`<div style="padding:var(--spacing-x3) 0;">${divider({ decorative: false })}</div>`, "role=\"separator\""),
        labeled(`<div class="flex" style="height:48px; padding:0 var(--spacing-x6);">${divider({ orientation: "vertical", decorative: false })}</div>`, "aria-orientation=\"vertical\""),
      ])}</div>`,
  },
];
