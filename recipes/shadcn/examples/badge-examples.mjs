/*
 * shadcn Badge 예제 — docs site components/badge.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 셋(목록 줄의 상태 · 상세 머리 · 권한)은 차례 · 제목 · 코드가
 * specs/components/badge.md 의 "코드" 절과 같고, 뒤의 셋(변형 × 톤 · 크기 · 놓는 바탕)은 md 의 Properties · Guidelines 를 코드로 더 보인다.
 * 옛 예제(알약 · solid · soft · outline 12변형 · 점 붙인 배지 · 대문자 LOW · HIGH)를 대신한다.
 *
 * BADGE_BASE · BADGE_VARIANTS · BADGE_COMPOUND · BADGE_DEFAULTS 는 recipes/shadcn/components/ui/badge.tsx 의 cva(badgeVariants)와,
 * PREFIX_ICON · PREFIX_ICON_SIZE · LABEL · GROUP_BASE 는 그 파일의 상수 · cva(badgeGroupVariants)와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다.
 * 규칙은 specs/components/badge.md, 수치 원본은 specs/components/badge.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 배지 <span data-slot="badge"> > (앞 아이콘 <span aria-hidden data-slot="badge-prefix-icon">) +
 * 글 <span data-slot="badge-label">, 묶음 <span data-slot="badge-group">. 배지는 누르지 않아 스크립트가 없다.
 * badge.tsx 는 cva 결과를 cn() 에 한 번 더 넣지만 지워지는 클래스가 없다(변형 · 톤 · 크기가 서로 다른 속성을 칠한다) — 그래서 그대로 잇는다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 * 배지는 흰 표면(bg-layer-default) 위에 놓는다 — 사이트 미리보기 칸의 바탕(bg-page = bg-layer-basement)은 중립 weak 의 옅은 바탕(bg-neutral-weak)과
 * 같은 색이라 그 위에 바로 그리면 상자가 사라진다(badge.md "흰 표면 위에서").
 */

// ── badge.tsx 의 cva 와 같은 값 ──────────────────────────────────────────

// 배지(badgeVariants) — 상자 · 앞 아이콘 ↔ 글 2 · 한 줄 · 누르지 않는다(cursor default). 부모가 좁을 때만 글이 말줄임(min-w-0 · overflow-hidden)
const BADGE_BASE = "inline-flex min-w-0 cursor-default items-center gap-x0_5 overflow-hidden whitespace-nowrap font-sans";

// 변형 — 굵기(weak 500 · solid · outline 700). 색은 변형 × 톤 compound 다. 크기 — medium 20(좌우 6 · 위아래 2 · 모서리 4 · t1) · large 24(좌우 8 · 위아래 4 · 모서리 6 · t2)
const BADGE_VARIANTS = {
  variant: {
    weak: "font-medium",
    solid: "font-bold",
    outline: "bg-transparent font-bold",
  },
  tone: {
    neutral: "",
    brand: "",
    informative: "",
    positive: "",
    warning: "",
    critical: "",
  },
  size: {
    medium: "min-h-x5 rounded-r1 px-x1_5 py-x0_5 text-t1",
    large: "min-h-x6 rounded-r1_5 px-x2 py-x1 text-t2",
  },
};

// 변형 × 톤 — weak 옅은 바탕 + 진한 글자 · solid 채움 + 흰 글자(중립은 뒤집힌 면 + 뒤집힌 글자) · outline 안쪽 1px 옅은 선 + 의미 색 글자
const BADGE_COMPOUND = [
  { variant: "weak", tone: "neutral", className: "bg-bg-neutral-weak text-fg-neutral-muted" },
  { variant: "weak", tone: "brand", className: "bg-bg-brand-weak text-fg-brand-contrast" },
  { variant: "weak", tone: "informative", className: "bg-bg-informative-weak text-fg-informative-contrast" },
  { variant: "weak", tone: "positive", className: "bg-bg-positive-weak text-fg-positive-contrast" },
  { variant: "weak", tone: "warning", className: "bg-bg-warning-weak text-fg-warning-contrast" },
  { variant: "weak", tone: "critical", className: "bg-bg-critical-weak text-fg-critical-contrast" },
  { variant: "solid", tone: "neutral", className: "bg-bg-neutral-inverted text-fg-neutral-inverted" },
  { variant: "solid", tone: "brand", className: "bg-bg-brand-solid text-static-white" },
  { variant: "solid", tone: "informative", className: "bg-bg-informative-solid text-static-white" },
  { variant: "solid", tone: "positive", className: "bg-bg-positive-solid text-static-white" },
  { variant: "solid", tone: "warning", className: "bg-bg-warning-solid text-static-white" },
  { variant: "solid", tone: "critical", className: "bg-bg-critical-solid text-static-white" },
  { variant: "outline", tone: "neutral", className: "text-fg-neutral-muted shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)]" },
  { variant: "outline", tone: "brand", className: "text-fg-brand shadow-[inset_0_0_0_1px_var(--color-stroke-brand-weak)]" },
  { variant: "outline", tone: "informative", className: "text-fg-informative shadow-[inset_0_0_0_1px_var(--color-stroke-informative-weak)]" },
  { variant: "outline", tone: "positive", className: "text-fg-positive shadow-[inset_0_0_0_1px_var(--color-stroke-positive-weak)]" },
  { variant: "outline", tone: "warning", className: "text-fg-warning shadow-[inset_0_0_0_1px_var(--color-stroke-warning-weak)]" },
  { variant: "outline", tone: "critical", className: "text-fg-critical shadow-[inset_0_0_0_1px_var(--color-stroke-critical-weak)]" },
];

const BADGE_DEFAULTS = { variant: "weak", tone: "neutral", size: "medium" };

// ── badge.tsx 의 상수와 같은 값 ──────────────────────────────────────────

// 앞 아이콘 — 12 · 14(px 그대로), 글자색. cn(PREFIX_ICON, PREFIX_ICON_SIZE[size])
const PREFIX_ICON = "flex shrink-0 items-center justify-center [&>svg]:shrink-0";
const PREFIX_ICON_SIZE = {
  medium: "[&>svg]:size-x3",
  large: "[&>svg]:size-x3_5",
};

// 글 — 한 줄. 부모가 좁을 때만 말줄임
const LABEL = "min-w-0 truncate";

// 묶음(badgeGroupVariants) — 배지 사이 4, 줄을 바꾸지 않는다
const GROUP_BASE = "inline-flex min-w-0 max-w-full flex-nowrap items-center gap-x1";

// ── cva 풀이 ──────────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다
function cvaOf(base, { variants = {}, compoundVariants = [], defaultVariants = {} } = {}) {
  return (props = {}) => {
    const p = { ...defaultVariants };
    for (const [k, v] of Object.entries(props)) if (v !== undefined) p[k] = v;
    const parts = [base];
    for (const [axis, map] of Object.entries(variants)) parts.push(map[p[axis]]);
    for (const { class: cls, className, ...when } of compoundVariants) {
      if (Object.entries(when).every(([k, v]) => p[k] === v)) parts.push(cls, className);
    }
    return parts.filter(Boolean).join(" ");
  };
}

const badgeVariants = cvaOf(BADGE_BASE, { variants: BADGE_VARIANTS, compoundVariants: BADGE_COMPOUND, defaultVariants: BADGE_DEFAULTS });

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기는 감싼 자리의 [&>svg]:size-* 가 정한다
const svg = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const LUCIDE = {
  pencil: svg('<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>'),
  eye: svg('<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>'),
  clock: svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
};

// <Badge> — badge.tsx 그대로. 앞 아이콘은 aria-hidden 칸에 넣고 크기는 배지가 정한다(12 · 14)
function badge({ text, variant, tone, size, prefixIcon, className }) {
  const s = size ?? "medium";
  const icon = prefixIcon != null ? `<span aria-hidden="true" data-slot="badge-prefix-icon" class="${PREFIX_ICON} ${PREFIX_ICON_SIZE[s]}">${prefixIcon}</span>` : "";
  return `<span data-slot="badge" class="${badgeVariants({ variant, tone, size })}${className ? ` ${className}` : ""}">${icon}<span data-slot="badge-label" class="${LABEL}">${esc(text)}</span></span>`;
}
// <BadgeGroup> — 배지 HTML 목록
const badgeGroup = (children) => `<span data-slot="badge-group" class="${GROUP_BASE}">${children.join("")}</span>`;

// 흰 표면 · 폰 화면 · 줄 · 이름표 — 미리보기 틀(레시피가 아니다)
const SURFACE =
  "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-x6);";
const surface = (html, extra = "") => `<div style="${SURFACE}${extra}">${html}</div>`;
const SCREEN =
  "max-width:360px; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-global-gutter); color:var(--color-fg-neutral); font-family:var(--font-sans);";
const screen = (html) => `<div style="${SCREEN}">${html}</div>`;
const stack = (items, gap = "var(--spacing-x5)") => `<div style="display:flex; flex-direction:column; gap:${gap};">${items.join("")}</div>`;
const row = (items, gap = "var(--spacing-x2)") => `<div style="display:flex; flex-wrap:wrap; align-items:center; gap:${gap};">${items.join("")}</div>`;
const CAPTION = "font-size:var(--text-t2); line-height:var(--text-t2--line-height); font-weight:400; color:var(--color-fg-neutral-subtle);";
const CODE = `${CAPTION} font-family:ui-monospace, SFMono-Regular, Menlo, monospace;`;
const labeled = (html, caption, style = CODE) =>
  `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2); min-width:0;">${html}<span style="${style}">${caption}</span></div>`;
// 줄 글자 — 목록 줄 제목(t5)을 흉내 낸 미리보기 글
const TITLE = "font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";

// ── 화면 예시의 값 ────────────────────────────────────────────────────────

// 변형 × 톤 — [톤, 이름표, 예 글]
const TONES = [
  ["neutral", "neutral — 기본", "예정"],
  ["brand", "brand", "Pro"],
  ["informative", "informative", "읽기 전용"],
  ["positive", "positive", "승인"],
  ["warning", "warning", "만료 임박"],
  ["critical", "critical", "연체"],
];
const VARIANTS = ["weak", "outline", "solid"];

// ── 예제 ──────────────────────────────────────────────────────────────────

export const badgeExamples = [
  {
    title: "목록 줄의 상태 — weak",
    description:
      "배지는 대상의 상태 · 분류를 한두 낱말로 보이는 작은 라벨이다(\"예정\" · \"연체 3\"). 기본은 weak · neutral · medium 20 — 옅은 바탕(bg-neutral-weak) + 진한 글자(fg-neutral-muted) · 500 · 모서리 4 · 11/15 다. 목록처럼 같은 모양이 되풀이되는 자리는 weak 이고, 한 목록 안에서는 한 변형으로 맞추고 뜻은 톤으로 가른다(연체는 critical). 줄 제목 옆에 둘 때는 제목만 말줄임하고 배지는 사이 6(gap-x1_5)으로 붙인다. 배지는 <span> · 역할 없음이라 줄 이름과 이어 읽힌다(\"가나영상 예정\"). 누르지 않는다 — 호버 · 누름 · 포커스가 없다.",
    jsx: `import { Badge } from "@/components/ui/badge"

<span className="flex items-center gap-x1_5">
  <span className="truncate">가나영상</span>
  <Badge className="shrink-0">예정</Badge>
</span>

<Badge tone="critical">연체 3</Badge>`,
    render: () =>
      screen(
        stack([
          labeled(
            `<span class="flex items-center gap-x1_5" style="${TITLE}"><span class="truncate">가나영상</span>${badge({ text: "예정", className: "shrink-0" })}</span>`,
            "줄 제목 + 배지 — 사이 6 · 제목만 말줄임(배지는 shrink-0)",
            CAPTION,
          ),
          labeled(badge({ text: "연체 3", tone: "critical" }), "tone=\"critical\" — 뜻은 톤으로", CAPTION),
        ]),
      ),
  },

  {
    title: "상세 머리 — large · 둘",
    description:
      "상세 머리 · 카드 제목 옆은 large 24(좌우 8 · 위아래 4 · 모서리 6 · 12/16)다. 한 대상에는 배지를 둘까지 두고 BadgeGroup 으로 묶는다 — 사이 4 · 줄바꿈하지 않는다(넘치면 중요한 것만 남긴다). solid 는 한 화면에서 꼭 눈에 띄어야 할 상태 하나(단종)에 쓴다 — 중립 solid 는 짙은 면(bg-neutral-inverted) + 뒤집힌 글자(fg-neutral-inverted)라 다크에서는 밝은 면 + 짙은 글자다. 굵기는 weak 500 · solid 700.",
    jsx: `import { Badge, BadgeGroup } from "@/components/ui/badge"

<BadgeGroup>
  <Badge size="large">신용</Badge>
  <Badge size="large" variant="solid">단종</Badge>
</BadgeGroup>`,
    render: () =>
      screen(
        stack(
          [
            `<span style="font-size:var(--text-t7); line-height:var(--text-t7--line-height); font-weight:700; color:var(--color-fg-neutral);">현대카드 M</span>`,
            badgeGroup([badge({ text: "신용", size: "large" }), badge({ text: "단종", size: "large", variant: "solid" })]),
          ],
          "var(--spacing-x2)",
        ),
      ),
  },

  {
    title: "권한 — outline · 앞 아이콘",
    description:
      "outline 은 상세 · 본문의 중간 강조다 — 투명 + 안쪽 1px 옅은 선(stroke-{톤}-weak — v117, 다크는 팔레트 400) + 의미 색 글자(fg-{톤}) · 700. 테두리는 inset box-shadow 라 상자 크기가 weak · solid 와 같다. 앞 아이콘(prefixIcon — lucide)은 글자색을 따르고 크기는 배지가 정한다(medium 12 · large 14) — 글과 사이 2, 보조 기술에는 숨긴다. 배지 안에 버튼을 넣지 않는다 — 뜻을 더 설명해야 하면 배지 옆에 ⓘ Help Bubble 을 둔다.",
    jsx: `import { Eye, Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"

<Badge variant="outline" tone="positive" prefixIcon={<Pencil />}>편집 가능</Badge>
<Badge variant="outline" tone="informative" prefixIcon={<Eye />}>읽기 전용</Badge>`,
    render: () =>
      surface(
        row([
          badge({ text: "편집 가능", variant: "outline", tone: "positive", prefixIcon: LUCIDE.pencil }),
          badge({ text: "읽기 전용", variant: "outline", tone: "informative", prefixIcon: LUCIDE.eye }),
        ]),
      ),
  },

  {
    title: "변형 3 × 톤 6",
    description:
      "같은 톤이면 weak → outline → solid 순으로 강해진다. weak 는 bg-{톤}-weak + fg-{톤}-contrast, solid 는 bg-{톤}-solid + 흰 글자(static-white), outline 은 stroke-{톤}-weak + fg-{톤} 이다 — 중립만 짝이 다르다(weak bg-neutral-weak + fg-neutral-muted · solid bg-neutral-inverted + fg-neutral-inverted · outline stroke-neutral-weak + fg-neutral-muted). 톤은 뜻이다 — 중립(상태가 따로 없거나 분류) · 안내(권한 제한 · 베타) · 긍정(완료 · 승인 · 연결) · 주의(곧 문제가 될 것) · 위험(거절 · 실패 · 넘침), brand 는 요금제 · 본인 표시처럼 브랜드와 닿는 자리에만 아낀다. 주의 solid 는 주황 + 흰 글자다(SEED 의 노랑 + 검정이 아니다). 글자 대비는 모두 4.5:1 이상이다.",
    jsx: `// 변형 · 톤 — 안 고르면 weak · neutral
<Badge>예정</Badge>
<Badge variant="outline">예정</Badge>
<Badge variant="solid">예정</Badge>

<Badge tone="brand">Pro</Badge>
<Badge tone="informative">읽기 전용</Badge>
<Badge tone="positive">승인</Badge>
<Badge tone="warning">만료 임박</Badge>
<Badge tone="critical">연체</Badge>
// outline · solid 도 같은 톤 여섯이다`,
    render: () =>
      surface(
        `<div style="overflow-x:auto;"><div style="display:grid; grid-template-columns:repeat(4, max-content); gap:var(--spacing-x2_5) var(--spacing-x5); align-items:center;">${[
          `<span></span>`,
          ...VARIANTS.map((v) => `<span style="${CODE}">${v}</span>`),
          ...TONES.flatMap(([tone, name, text]) => [`<span style="${CODE}">${name}</span>`, ...VARIANTS.map((variant) => `<span>${badge({ text, variant, tone })}</span>`)]),
        ].join("")}</div></div>`,
      ),
  },

  {
    title: "크기 — medium 20 · large 24",
    description:
      "medium 20(기본)은 목록 줄 · 표 · 이름 옆, large 24 는 상세 머리 · 카드 제목 옆이다. medium 은 좌우 6 · 위아래 2 · 모서리 4 · 글 t1 11/15 · 앞 아이콘 12, large 는 좌우 8 · 위아래 4 · 모서리 6 · 글 t2 12/16 · 아이콘 14 다. 글은 rem 이라 글자 크기 설정을 따르고, 최소 높이(20 · 24)는 px 그대로 둔 채 상자가 글을 따라 커진다. 최대 폭이 없고 한 줄이다 — 부모가 좁을 때만 글이 말줄임(…)하고 글 전체는 보조 기술이 읽는다(아래 칸은 폭 48).",
    jsx: `import { Clock } from "lucide-react"

<Badge>예정</Badge>
<Badge prefixIcon={<Clock />}>예정</Badge>
<Badge size="large">예정</Badge>
<Badge size="large" prefixIcon={<Clock />}>예정</Badge>

// 부모가 좁을 때만 말줄임 — 최대 폭은 없다
<div className="flex w-12">
  <Badge tone="warning">만료 임박</Badge>
</div>`,
    render: () =>
      surface(
        stack([
          labeled(row([badge({ text: "예정" }), badge({ text: "예정", prefixIcon: LUCIDE.clock })]), "medium · 20 — 기본"),
          labeled(row([badge({ text: "예정", size: "large" }), badge({ text: "예정", size: "large", prefixIcon: LUCIDE.clock })]), "large · 24"),
          labeled(`<div class="flex w-12">${badge({ text: "만료 임박", tone: "warning" })}</div>`, "부모 폭 48 — 글이 말줄임"),
        ]),
      ),
  },

  {
    title: "놓는 바탕 — 흰 표면 위 weak · 회색 바탕 위 outline",
    description:
      "중립 weak 의 옅은 바탕(bg-neutral-weak)은 회색 바탕(bg-layer-basement)과 같은 색이라 거기서는 상자가 사라진다 — 배지는 흰 표면(bg-layer-default) · 시트 위에 둔다. 회색 바탕 위에 둬야 하면 outline 을 쓴다. 한 대상에는 둘까지, 반복되는 줄은 weak, solid 는 한 화면에 하나다.",
    jsx: `// 흰 표면(bg-layer-default) 위 — weak
<div className="bg-bg-layer-default">
  <Badge>기록만</Badge>
</div>

// 회색 바탕(bg-layer-basement) 위 — outline
<div className="bg-bg-layer-basement">
  <Badge variant="outline">기록만</Badge>
</div>`,
    render: () =>
      `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:var(--spacing-x4);">${[
        labeled(surface(badge({ text: "기록만" })), "흰 표면 위 — weak", CAPTION),
        labeled(
          `<div style="${SURFACE} background:var(--color-bg-layer-basement);">${badge({ text: "기록만", variant: "outline" })}</div>`,
          "회색 바탕 위 — outline",
          CAPTION,
        ),
      ].join("")}</div>`,
  },
];
