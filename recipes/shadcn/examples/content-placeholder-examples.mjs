/*
 * shadcn Content Placeholder 예제 — docs site components/content-placeholder.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 첫째(카드 그림 — 불러오지 못하면)는 제목 · 코드가 specs/components/content-placeholder.md 의
 * "코드" 절과 같고, 뒤의 셋(크기 · 그림 · 불러오는 동안은 Skeleton)은 md 의 Properties · Guidelines 를 코드로 더 보인다.
 *
 * ROOT · GLYPH 는 recipes/shadcn/components/ui/content-placeholder.tsx 의 상수와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다.
 * 그림 틀은 Image Frame 이 이 그림을 제 대체 그림으로 그린다(2026-10-04) — FRAME_* · IMAGE_* 와 FIXED_WIDTH · LOADING_SKELETON · FALLBACK 은
 * image-frame.tsx 의 cva · 상수 · JSX 클래스(image-frame-examples.mjs 의 것), RATIO_* 는 aspect-ratio.tsx 의 것, 불러오는 동안의 스켈레톤 SK_* 는
 * skeleton.tsx 의 ROOT · RADIUS · SHIMMER(skeleton-examples.mjs 의 것)와 같다 — 이 파일이 쓰는 모서리 · 비율만 옮겼다. imageFrameRadius 는 레시피의 규칙 함수와 같은 답을 낸다.
 * 규칙은 specs/components/content-placeholder.md, 수치 원본은 specs/components/content-placeholder.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 자리 <div data-slot="content-placeholder">(대체 글이 있으면 role="img" + aria-label, 없으면 aria-hidden) >
 * 그림 <span aria-hidden data-slot="content-placeholder-glyph"> > lucide 아이콘. 그림의 크기는 자리를 크기 컨테이너로 두고(container-type: size)
 * min(clamp(16px, 50cqh, 160px), 100cqw) 로 잰다 — 틀 높이의 50%, 16 ~ 160, 틀 폭이 좁으면 폭. 담는 틀(크기 · 비율 · 모서리)은 부르는 쪽의 것이다 —
 * 그림 틀은 Image Frame 이고(<div data-slot="image-frame"> > <div data-slot="image-frame-fallback" role="img"> > 이 자리 — 이름은 바깥 자리가 가진다),
 * 크기 견본의 틀은 Image Frame 의 모서리(폭 48 이하 6 · 그 위 8)로 둘렀다. 레시피가 cn() 으로 합치는 자리는 merge() 로 똑같이 합친다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다 — 선 굵기 1.5 는 GLYPH 의 [&>svg]:[stroke-width:1.5]).
 * 불러온 카드 그림은 손으로 칠한 대역(SVG)이다 — 실제 카드 그림이 아니다.
 */

// ── content-placeholder.tsx 의 상수와 같은 값 ───────────────────────────────

// 자리 — 틀을 채우는 크기 컨테이너, 가운데 그림
const ROOT = "flex size-full items-center justify-center overflow-hidden bg-bg-neutral-weak [container-type:size]";

// 그림 — 틀 높이의 50%(16 ~ 160), 틀 폭이 좁으면 폭. 선 굵기 1.5
const GLYPH =
  "flex size-[min(clamp(16px,50cqh,160px),100cqw)] shrink-0 items-center justify-center text-stroke-neutral-weak [&>svg]:size-full [&>svg]:[stroke-width:1.5]";

// ── image-frame.tsx 의 cva · 상수와 같은 값 — 그림 틀(카드 그림 · 폭 112) ─────────

const FRAME_BASE = [
  "relative isolate block max-w-full overflow-hidden [container-name:image-frame] [container-type:size]",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-overlay)] after:content-['']",
].join(" ");
const FRAME_VARIANTS = { radius: { "8": "rounded-r2" } };
const FRAME_DEFAULTS = { radius: "8" };
const IMAGE_BASE = "absolute block";
const IMAGE_VARIANTS = {
  rotate: { false: "inset-0 size-full" },
  fit: { cover: "object-cover" },
};
const IMAGE_DEFAULTS = { rotate: false, fit: "cover" };
const IMAGE_LOADING = "opacity-0";

// image-frame.tsx 의 JSX 에 적힌 클래스 — 고정 폭 · 불러오는 동안의 스켈레톤 · 대체 그림 자리
const FIXED_WIDTH = "shrink-0";
const LOADING_SKELETON = "absolute inset-0 size-full";
const FALLBACK = "absolute inset-0 flex";

// aspect-ratio.tsx 의 cva — 카드 비율
const RATIO_VARIANTS = { ratio: { card: "aspect-[1.586]" } };
const RATIO_DEFAULTS = { ratio: "4:3" };

// ── skeleton.tsx 의 상수와 같은 값 — 불러오는 동안 ─────────────────────────

const SK_ROOT = "relative block overflow-hidden bg-bg-neutral-weak";
const SK_RADIUS = { "0": "rounded-none", "6": "rounded-r1_5", "8": "rounded-r2", "16": "rounded-r4", full: "rounded-full" };
const SK_SHIMMER = [
  "pointer-events-none absolute inset-0 [transform:translateX(-100%)]",
  "bg-[image:var(--gradient-shimmer-neutral)] dark:bg-[image:var(--gradient-shimmer-neutral-dark)]",
  "animate-[shimmer_var(--motion-duration-loop)_var(--motion-ease-easing)_infinite]",
  "motion-reduce:animate-none motion-reduce:opacity-0",
].join(" ");

// ── 레시피의 규칙 함수와 같은 답 ─────────────────────────────────────────

/** 폭 → 모서리(SEED) — 24 이하 "4" · 48 이하 "6" · 그 위 "8". 폭을 모르면(부모 폭을 채운다) "8" (image-frame.tsx) */
function imageFrameRadius(width) {
  if (width == null || Number.isNaN(width)) return "8";
  return width <= 24 ? "4" : width <= 48 ? "6" : "8";
}

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

const variantKey = (v) => (typeof v === "boolean" ? String(v) : v);

// cva 와 같은 순서로 붙인다 — base → 축(선언 순). 고르지 않은 축은 기본값을 쓴다
function cvaOf(base, { variants = {}, defaultVariants = {} } = {}) {
  return (props = {}) => {
    const p = { ...defaultVariants };
    for (const [k, v] of Object.entries(props)) if (v !== undefined) p[k] = v;
    return [base, ...Object.entries(variants).map(([axis, map]) => map[variantKey(p[axis])])].filter(Boolean).join(" ");
  };
}

const imageFrameVariants = cvaOf(FRAME_BASE, { variants: FRAME_VARIANTS, defaultVariants: FRAME_DEFAULTS });
const imageFrameImageVariants = cvaOf(IMAGE_BASE, { variants: IMAGE_VARIANTS, defaultVariants: IMAGE_DEFAULTS });
const aspectRatioVariants = cvaOf("", { variants: RATIO_VARIANTS, defaultVariants: RATIO_DEFAULTS });

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다 — 이 파일이 합치는 무리(자리 잡기)만 안다.
// 스켈레톤(relative)에 틀을 채우는 absolute 를 덧붙이는 자리에서 relative 가 지워진다
const POSITION = /^(static|fixed|absolute|relative|sticky)$/;
const merge = (classList) => {
  const parts = classList.split(/\s+/).filter(Boolean);
  const last = parts.findLastIndex((cls) => POSITION.test(cls));
  return parts.filter((cls, i) => !POSITION.test(cls) || i === last).join(" ");
};

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 의 아이콘과 같은 모양(24 격자)
const svg = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const ICONS = {
  image: svg('<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>'),
  creditCard: svg('<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>'),
  receipt: svg(
    '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
  ),
  fileText: svg(
    '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  ),
};

// 불러온 카드 그림 — 손으로 칠한 대역(856 × 540 SVG)
const CARD_ART = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="856" height="540" viewBox="0 0 856 540"><defs><linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c1c1c"/><stop offset="1" stop-color="#5a5a5a"/></linearGradient></defs><rect width="856" height="540" fill="url(#c)"/><rect x="72" y="150" width="120" height="92" rx="14" fill="#d9b44a"/><text x="790" y="470" text-anchor="end" font-family="sans-serif" font-size="64" font-weight="800" letter-spacing="3" fill="#ffffff">BLACK</text></svg>',
)}`;

// <ContentPlaceholder> — icon(기본 image) · label(대체 글 — 주면 role="img" + 이름, 안 주면 보조 기술에 숨긴다)
function contentPlaceholder({ icon = "image", label } = {}) {
  const named = label != null && label.trim() !== "";
  const name = named ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"';
  return `<div data-slot="content-placeholder" class="${ROOT}" ${name}><span aria-hidden="true" data-slot="content-placeholder-glyph" class="${GLYPH}">${ICONS[icon]}</span></div>`;
}

// <Skeleton> — radius · className(크기 · 자리). cn() 처럼 합친다
const skeleton = ({ radius = "8", className = "" } = {}) =>
  `<span data-slot="skeleton" data-radius="${radius}" class="${merge([SK_ROOT, SK_RADIUS[radius], className].filter(Boolean).join(" "))}" aria-hidden="true"><span data-slot="skeleton-shimmer" class="${SK_SHIMMER}"></span></span>`;

// <ImageFrame ratio="card" width alt fallbackIcon> — image-frame.tsx 그대로(이 파일이 쓰는 카드 비율 · 고정 폭만). state 는 그 순간(loading · loaded · error)
function cardFrame({ width = 112, src, alt, icon = "creditCard", state = "loaded" }) {
  const status = src ? state : "error";
  const radius = imageFrameRadius(width);
  const named = alt.trim() !== "";
  const image =
    src && status !== "error"
      ? `<img data-slot="image-frame-image" loading="lazy" alt="${esc(alt)}" src="${src}" class="${imageFrameImageVariants({})}${status === "loading" ? ` ${IMAGE_LOADING}` : ""}">`
      : "";
  const fallback =
    status === "error"
      ? `<div data-slot="image-frame-fallback" class="${FALLBACK}" ${named ? `role="img" aria-label="${esc(alt)}"` : 'aria-hidden="true"'}>${contentPlaceholder({ icon })}</div>`
      : "";
  return `<div data-slot="image-frame" data-state="${status === "error" ? "fallback" : status}" data-ratio="card" data-radius="${radius}" data-fit="cover" class="${imageFrameVariants({ radius })} ${aspectRatioVariants({ ratio: "card" })} ${FIXED_WIDTH}" style="width:${width}px">${status === "loading" ? skeleton({ radius: "0", className: LOADING_SKELETON }) : ""}${image}${fallback}</div>`;
}

// 담는 틀 — 크기 · 비율 · 모서리는 부르는 쪽의 것(코드의 <div className="… overflow-hidden …">)
const frame = (cls, html) => `<div class="${cls}">${html}</div>`;

const ROW = "display:flex; flex-wrap:wrap; gap:var(--spacing-x4) var(--spacing-x5); align-items:flex-end;";
const CAPTION =
  "font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption) =>
  `<div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--spacing-x2); min-width:0; max-width:100%;">${html}<span style="${CAPTION}">${caption}</span></div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const contentPlaceholderExamples = [
  {
    title: "카드 그림 — 불러오지 못하면",
    description:
      "이미지가 없거나 불러오지 못하면 그 자리를 옅은 면(bg-neutral-weak — 스켈레톤 면과 같은 색) + 가운데 그림으로 채운다 — 브라우저의 깨진 이미지 아이콘 · 대체 글 · 투명한 빈 칸 · 외부 주소의 기본 그림을 보이지 않는다. 그림 틀은 Image Frame 이 이 그림을 제 대체 그림으로 그린다 — 비율 · 모서리(폭 112 → 8) · 투명 윤곽은 Image Frame 이 정하고(이 그림은 제 모서리 · 테두리 · 그림자가 없다), 아이콘은 fallbackIcon(카드 그림 CreditCard — stroke-neutral-weak, 면 위 1.14:1 · 장식)이다. 대체 글은 그림의 alt 를 이어받는다 — 바깥 자리가 role=\"img\" + 이름을 가진다. 카드 그림은 보통 CardArt 로 그린다(아는 카드사는 카드 면, 모르는 카드사만 이 그림).",
    jsx: `import { CreditCard } from "lucide-react"
import { ImageFrame } from "@/components/ui/image-frame"

{/* 틀 — 비율 · 모서리(폭 112 → 8)는 Image Frame 이 정하고, 없거나 못 불러오면 이 그림을 그린다. 대체 글은 alt 를 이어받는다 */}
<ImageFrame ratio="card" width={112} src={card.imageUrl} alt={\`\${card.name} 카드 그림\`} fallbackIcon={<CreditCard />} />`,
    render: () =>
      `<div style="${ROW}">${labeled(cardFrame({ src: CARD_ART, alt: "현대카드 신용카드 그림", state: "error" }), "실패 — 대체 그림 · 그림 35")}${labeled(
        cardFrame({ src: null, alt: "현대카드 신용카드 그림" }),
        "src 없음 — 처음부터 대체 그림",
      )}${labeled(cardFrame({ src: CARD_ART, alt: "현대카드 신용카드 그림" }), "불러옴")}</div>`,
  },

  {
    title: "크기 — 그림은 틀 높이의 50%",
    description:
      "그림은 틀 높이의 50% 정사각으로 가운데에 둔다 — 16 보다 작아지지 않고 160 보다 커지지 않으며, 틀 폭이 그보다 좁으면 폭에 맞춘다. 40 썸네일이면 20, 120 틀이면 60, 화면 폭 4:3 사진(360 × 270)이면 135, 그보다 크면 160 이다. 좁고 긴 틀(40 × 120)은 폭 40 이다. 선 굵기는 24 격자 기준 1.5 라 그림이 커지면 같은 비율로 굵어진다. 틀의 모서리는 Image Frame 의 폭 규칙이다(48 이하 6 · 그 위 8 · 화면 폭 0).",
    jsx: `<div className="size-10 overflow-hidden rounded-r1_5"><ContentPlaceholder icon={<Receipt />} /></div>         {/* 20 */}
<div className="size-30 overflow-hidden rounded-r2"><ContentPlaceholder /></div>                          {/* 60 */}
<div className="h-30 w-10 overflow-hidden rounded-r1_5"><ContentPlaceholder /></div>                      {/* 폭 40 */}
<div className="aspect-[4/3] w-full max-w-[360px] overflow-hidden"><ContentPlaceholder label="가게 사진" /></div>  {/* 135 */}`,
    render: () =>
      `<div style="${ROW}">${[
        ["size-10 overflow-hidden rounded-r1_5", contentPlaceholder({ icon: "receipt" }), "40 → 20"],
        ["size-30 overflow-hidden rounded-r2", contentPlaceholder(), "120 → 60"],
        ["h-30 w-10 overflow-hidden rounded-r1_5", contentPlaceholder(), "40 × 120 → 40"],
      ]
        .map(([cls, html, caption]) => labeled(frame(cls, html), caption))
        .join("")}${labeled(frame("aspect-[4/3] w-[360px] max-w-full overflow-hidden", contentPlaceholder({ label: "가게 사진" })), "360 × 270 → 135")}</div>`,
  },

  {
    title: "그림 — 무엇이 없는지",
    description:
      "기본은 lucide image 다. 자리가 무엇인지 아이콘으로 말할 수 있으면 그 아이콘을 쓴다 — 카드 그림 credit-card, 영수증 사진 receipt, 문서 file-text. 당근 서비스별 그림(SEED 의 12가지)은 쓰지 않는다. 사람의 사진이 없으면 Avatar 의 이니셜, 자산 · 카드 로고의 글자 모노그램은 Logo Tile 의 첫 글자, 아는 카드사의 그림 없는 카드는 카드 면이다 — 이 그림이 아니다.",
    jsx: `import { CreditCard, FileText, Receipt } from "lucide-react"

<ContentPlaceholder />                        {/* 기본 — ImageIcon */}
<ContentPlaceholder icon={<CreditCard />} />
<ContentPlaceholder icon={<Receipt />} />
<ContentPlaceholder icon={<FileText />} />`,
    render: () =>
      `<div style="${ROW}">${[
        ["image", "image — 기본"],
        ["creditCard", "credit-card"],
        ["receipt", "receipt"],
        ["fileText", "file-text"],
      ]
        .map(([icon, caption]) => labeled(frame("size-24 overflow-hidden rounded-r2", contentPlaceholder({ icon })), caption))
        .join("")}</div>`,
  },

  {
    title: "불러오는 동안은 Skeleton",
    description:
      "이미지를 불러오는 동안은 이 그림이 아니라 같은 모서리 · 같은 크기의 Skeleton 이다 — 불러오는 중과 없음이 같은 그림이면 기다려야 하는지 알 수 없다(SEED React Image Frame 은 불러오는 동안에도 이 그림을 보인다 — 따르지 않는다). Image Frame 이 둘을 가른다 — 받는 동안 스켈레톤(모서리는 틀이 자른다), 다 받았는데 없거나 · 못 불러오거나 · 10초가 지나도 안 오면 이 그림이다. 틀 밖에서 그림 자리를 그릴 때(줄이 통째로 기다릴 때)는 Skeleton 의 radius 를 그 폭의 모서리(imageFrameRadius(폭))로 준다.",
    jsx: `{/* 받는 동안 스켈레톤 · 실패하면 대체 그림 — Image Frame 이 가른다 */}
<ImageFrame ratio="card" width={112} src={card.imageUrl} alt="현대카드 신용카드 그림" fallbackIcon={<CreditCard />} />

{/* 틀 밖의 그림 자리 — 다 받은 그림과 같은 모서리(40 → "6") */}
<Skeleton radius={imageFrameRadius(40)} className="size-10" />`,
    render: () =>
      `<div style="${ROW}">${labeled(cardFrame({ src: CARD_ART, alt: "현대카드 신용카드 그림", state: "loading" }), "loading — Skeleton")}${labeled(
        cardFrame({ src: CARD_ART, alt: "현대카드 신용카드 그림", state: "error" }),
        "failed — 대체 그림",
      )}${labeled(cardFrame({ src: CARD_ART, alt: "현대카드 신용카드 그림" }), "loaded")}${labeled(skeleton({ radius: imageFrameRadius(40), className: "size-10" }), `Skeleton "${imageFrameRadius(40)}" — 40`)}</div>`,
  },
];
