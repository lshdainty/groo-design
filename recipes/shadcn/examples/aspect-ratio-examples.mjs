/*
 * shadcn Aspect Ratio 예제 — docs site components/aspect-ratio.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 첫째(동영상 — 16:9)는 제목 · 코드가 specs/components/aspect-ratio.md 의 "코드" 절과 같고,
 * 뒤의 둘(비율 여덟 · 지도 — 그림이 아닌 자리)은 md 의 Properties · Guidelines 를 코드로 더 보인다.
 * 옛 예제(Radix AspectRatio · ratio={16 / 9} 숫자 · 자식 img 에 rounded-md · surface-input 바탕 · 카드 안 그림)를 대신한다 — 그림은 Image Frame 이다.
 *
 * ROOT · RATIO_VARIANTS · RATIO_DEFAULTS 는 recipes/shadcn/components/ui/aspect-ratio.tsx 의 상수 · cva(aspectRatioVariants)와 글자 하나까지 같아야 한다 —
 * 두 파일을 함께 고친다. 규칙은 specs/components/aspect-ratio.md, 수치 원본은 specs/components/aspect-ratio.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 상자 <div data-slot="aspect-ratio" data-ratio> > 자식 하나. 상자는 모서리 · 바탕 · 윤곽이 없고(그림의 점선은
 * 상자 자리를 보이는 미리보기용 덧칠이다), 자식은 absolute · inset 0 으로 상자를 채운다(img · video 는 cover). 역할 · 이름이 없다 — 자식이 말한다.
 * 동영상의 첫 장면 · 지도는 손으로 칠한 대역(SVG)이다 — 정적 미리보기라 동영상 파일을 싣지 않는다(src 없이 poster 만).
 */

// ── aspect-ratio.tsx 의 상수 · cva 와 같은 값 ─────────────────────────────

// 비율(aspectRatioVariants) — 여덟 가지. Image Frame 이 같은 비율을 쓴다
const RATIO_VARIANTS = {
  ratio: {
    "1:1": "aspect-square",
    "2:1": "aspect-[2/1]",
    "16:9": "aspect-[16/9]",
    "4:3": "aspect-[4/3]",
    "6:7": "aspect-[6/7]",
    "4:5": "aspect-[4/5]",
    "2:3": "aspect-[2/3]",
    card: "aspect-[1.586]",
  },
};

const RATIO_DEFAULTS = { ratio: "4:3" };

// 상자 — 부모 폭, 모서리 · 바탕 없음, 넘친 자식은 자른다. 자식은 상자를 채우고 img · video 는 cover
const ROOT = [
  "relative block w-full overflow-hidden",
  "*:absolute *:inset-0 *:size-full [&>img]:object-cover [&>video]:object-cover",
].join(" ");

// ── cva 풀이 ──────────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순). 고르지 않은 축은 기본값을 쓴다
function cvaOf(base, { variants = {}, defaultVariants = {} } = {}) {
  return (props = {}) => {
    const p = { ...defaultVariants };
    for (const [k, v] of Object.entries(props)) if (v !== undefined) p[k] = v;
    return [base, ...Object.entries(variants).map(([axis, map]) => map[p[axis]])].filter(Boolean).join(" ");
  };
}

const aspectRatioVariants = cvaOf("", { variants: RATIO_VARIANTS, defaultVariants: RATIO_DEFAULTS });

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// 그림 재료 — 손으로 칠한 대역(SVG). 동영상 첫 장면 · 지도
const uri = (w, h, body) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`)}`;
const POSTER = uri(1280, 720, `<defs><linearGradient id="v" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1f2a44"/><stop offset="1" stop-color="#3d5a80"/></linearGradient></defs><rect width="1280" height="720" fill="url(#v)"/><rect x="380" y="170" width="520" height="340" rx="28" fill="#ffffff" fill-opacity=".12"/><circle cx="640" cy="340" r="72" fill="#ffffff" fill-opacity=".9"/><path d="M618 300v80l64-40Z" fill="#1f2a44"/>`);
const MAP = uri(600, 600, `<rect width="600" height="600" fill="#eef2ea"/><path d="M0 380 600 300M180 0 260 600M0 140 600 220" stroke="#ffffff" stroke-width="28"/><path d="M0 380 600 300M180 0 260 600M0 140 600 220" stroke="#d6dccf" stroke-width="2"/><rect x="330" y="360" width="150" height="110" rx="10" fill="#cfe3c4"/><circle cx="300" cy="270" r="22" fill="#1e7d4c"/><circle cx="300" cy="270" r="8" fill="#ffffff"/>`);

// <AspectRatio ratio> — aspect-ratio.tsx 그대로. cn(ROOT, aspectRatioVariants({ ratio }), className) — 지워지는 클래스가 없다
const aspectRatio = ({ ratio, className = "", child }) =>
  `<div data-slot="aspect-ratio" data-ratio="${ratio ?? RATIO_DEFAULTS.ratio}" class="${[ROOT, aspectRatioVariants({ ratio }), className].filter(Boolean).join(" ")}">${child}</div>`;

// 흰 표면 · 이름표 · 상자 자리(점선 — 미리보기용 덧칠) — 미리보기 틀(레시피가 아니다)
const SURFACE =
  "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5); color:var(--color-fg-neutral); font-family:var(--font-sans);";
const surface = (html, extra = "") => `<div style="${SURFACE}${extra}">${html}</div>`;
const CAPTION =
  "font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const GUIDE = "outline:1px dashed var(--color-fg-neutral-subtle); outline-offset:0;";
const HATCH = "background:repeating-linear-gradient(135deg, transparent 0 6px, var(--color-bg-neutral-weak) 6px 12px);";

const RATIOS = [
  ["1:1", "정사각", 1],
  ["2:1", "넓은 띠", 2],
  ["16:9", "동영상", 16 / 9],
  ["4:3", "기본", 4 / 3],
  ["6:7", "조금 세로", 6 / 7],
  ["4:5", "세로", 4 / 5],
  ["2:3", "긴 세로", 2 / 3],
  ["card", "카드 1.586", 1.586],
];

// ── 예제 ──────────────────────────────────────────────────────────────────

export const aspectRatioExamples = [
  {
    title: "동영상 — 16:9",
    description:
      "폭이 정해지면 비율로 높이가 정해지는 상자 하나다(SEED Aspect Ratio) — 폭은 부모가 정하고 높이는 폭 ÷ 비율이라 내용이 오기 전에 자리를 잡는다(내용이 와도 줄이 밀리지 않는다). 모서리 0 · 바탕 · 테두리 · 윤곽 · 불러오는 동안 · 대체 그림이 없고 자식 하나가 상자를 채운다 — 동영상은 가운데를 남겨 자른다(cover). 상자는 역할 · 이름이 없다 — 동영상의 aria-label · 자막이 말한다. 사진 · 카드 그림은 이것이 아니라 Image Frame 이다(모서리 · 윤곽 · 스켈레톤 · 대체 그림을 함께 가진다).",
    jsx: `import { AspectRatio } from "@/components/ui/aspect-ratio"

<AspectRatio ratio="16:9">
  <video src={guide.url} controls preload="metadata" className="size-full object-cover" aria-label="자산 연결 안내 동영상" />
</AspectRatio>`,
    render: () =>
      surface(
        aspectRatio({
          ratio: "16:9",
          child: `<video poster="${POSTER}" controls preload="none" class="size-full object-cover" aria-label="자산 연결 안내 동영상"></video>`,
        }),
        " max-width:480px;",
      ),
  },

  {
    title: "비율 — 여덟 가지",
    description:
      "비율은 Image Frame 과 같은 여덟 가지다 — SEED 의 일곱(1:1 · 2:1 · 16:9 · 4:3 · 6:7 · 4:5 · 2:3)과 카드 1.586(ISO 카드 85.6 × 53.98). 기본은 4:3 이다. 이 밖의 비율(옛 3:4 · 21:9 · 숫자)은 받지 않는다 — 비율이 늘면 한 화면의 상자가 제각각이 된다. 한 목록 · 격자 안에서는 한 비율로 맞춘다. 아래 점선은 상자 자리를 보이려고 덧칠했다(상자는 바탕이 없다).",
    jsx: `<AspectRatio ratio="1:1">…</AspectRatio>
<AspectRatio ratio="2:1">…</AspectRatio>
<AspectRatio ratio="16:9">…</AspectRatio>
<AspectRatio>…</AspectRatio>               {/* 4:3 — 기본 */}
<AspectRatio ratio="6:7">…</AspectRatio>
<AspectRatio ratio="4:5">…</AspectRatio>
<AspectRatio ratio="2:3">…</AspectRatio>
<AspectRatio ratio="card">…</AspectRatio>  {/* 1.586 */}`,
    render: () =>
      surface(
        `<div style="display:flex; flex-wrap:wrap; align-items:flex-start; gap:var(--spacing-x5) var(--spacing-x4);">${RATIOS.map(
          ([ratio, ko, r]) =>
            `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2); width:120px;"><div style="${GUIDE}">${aspectRatio({
              ratio: ratio === "4:3" ? undefined : ratio,
              child: `<span aria-hidden="true" style="display:block; ${HATCH}"></span>`,
            })}</div><span style="${CAPTION}">${esc(ratio)} — ${esc(ko)}<br>120 × ${Math.round((120 / r) * 10) / 10}</span></div>`,
        ).join("")}</div>`,
      ),
  },

  {
    title: "지도 — 그림이 아닌 자리",
    description:
      "Aspect Ratio 는 동영상 · 지도 · 바깥 페이지(iframe) · 차트처럼 그림이 아니면서 비율만 지키면 되는 자리에 쓴다 — 지도 · iframe 은 상자 크기 그대로 채운다. 자식이 이름을 가진다(지도의 aria-label · iframe 의 title). 상자에 모서리 · 바탕 · 테두리를 손으로 두르지 않는다 — 둥근 그림 틀이 필요하면 그건 그림이고 Image Frame 이다.",
    jsx: `<AspectRatio ratio="1:1">
  <StoreMap center={store.location} aria-label={\`\${store.name} 위치\`} />
</AspectRatio>`,
    render: () =>
      surface(
        aspectRatio({ ratio: "1:1", child: `<img src="${MAP}" alt="가나김밥 강남점 위치">` }),
        " max-width:280px;",
      ),
  },
];
