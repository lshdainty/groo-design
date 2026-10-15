/*
 * shadcn Image Frame 예제 — docs site components/image-frame.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 다섯(목록 줄 · 격자 · 상세 · 규정 그림 · 여러 장)은 차례 · 제목 · 코드가
 * specs/components/image-frame.md 의 "코드" 절과 같고, 뒤의 다섯(비율 · 모서리 · 상태 · 카드 면 · 그림 위 요소)은 md 의 Properties 를 코드로 더 보인다.
 *
 * FRAME_* · IMAGE_* · FLOATER_* · INDICATOR_BASE · CARD_FACE_* 는 recipes/shadcn/components/ui/image-frame.tsx 의 cva · 상수와,
 * FIXED_WIDTH · FILL_WIDTH · LOADING_SKELETON · FALLBACK · SR_ONLY 는 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다.
 * 둘레의 부품은 그 레시피의 값을 옮겨 썼다 — RATIO_* 는 aspect-ratio.tsx, SK_* 는 skeleton.tsx, CPH_* 는 content-placeholder.tsx,
 * BADGE_* 는 badge.tsx(badge-examples.mjs), LIST_* 는 list.tsx(list-examples.mjs), FOG_* 는 scroll-fog.tsx(scroll-fog-examples.mjs)의 것과 같다 —
 * 이 파일이 쓰는 변형 · 크기만 옮겼다. imageFrameRadius · institutionColor · avatarInitial 은 레시피의 규칙 함수와 같은 답을 낸다.
 * 기관 색 표는 recipes/shadcn/lib/institution-colors.ts 의 INSTITUTION_COLORS(institution-colors.yaml 에서 만든 표)를 그대로 읽는다.
 * 규칙은 specs/components/image-frame.md, 수치 원본은 specs/components/image-frame.yaml · card-art.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 틀 <div data-slot="image-frame" data-state data-ratio data-radius data-fit (data-rotated)> >
 * 불러오는 동안 스켈레톤 <span data-slot="skeleton"> · 그림 <img data-slot="image-frame-image"> · 없음 · 실패면 <div data-slot="image-frame-fallback">
 * (대체 그림 또는 카드 면 <div data-slot="card-art-face">) · 그림 위 자리 <div data-slot="image-frame-floater">. 카드 그림은 data-slot="card-art" 다.
 * 레시피의 스크립트(다 받으면 원래 크기로 방향을 정하기 · 10초 · 투명도로 나타나기)는 정적 HTML 에 없다 — 그림은 그 순간을 멈춘 것이고,
 * 세로 카드 그림은 다 받은 모습(data-rotated — 그림의 원래 크기를 아는 대역)으로 그렸다. 레시피가 cn() 으로 합치는 자리는 merge() 로 똑같이 합친다.
 * 그림은 손으로 칠한 대역(SVG)이다 — 실제 사진 · 카드 그림이 아니다. 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

import { readFileSync } from "node:fs";

// ── image-frame.tsx 의 cva · 상수와 같은 값 ──────────────────────────────

// 틀(imageFrameVariants) — 비율 상자 · 모서리로 자르기 · 층 따로 쌓기 · 크기 컨테이너. ::after 가 안쪽 1px 투명 윤곽(그림 · 스켈레톤 · 대체 그림 위)
const FRAME_BASE = [
  "relative isolate block max-w-full overflow-hidden [container-name:image-frame] [container-type:size]",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-overlay)] after:content-['']",
].join(" ");

// 모서리 — 폭으로(24 이하 4 · 48 이하 6 · 그 위 8 · 화면 폭 0)
const FRAME_VARIANTS = {
  radius: {
    "0": "rounded-none",
    "4": "rounded-r1",
    "6": "rounded-r1_5",
    "8": "rounded-r2",
  },
};

const FRAME_DEFAULTS = { radius: "8" };

// 그림(imageFrameImageVariants) — 틀을 채운다. rotate 는 카드 비율의 세로 그림 — 그림 상자를 틀의 높이 × 폭으로 잡아 시계 방향 90°
const IMAGE_BASE = "absolute block";

const IMAGE_VARIANTS = {
  rotate: {
    false: "inset-0 size-full",
    true: "left-1/2 top-1/2 h-[158.6%] w-[calc(100%/1.586)] -translate-x-1/2 -translate-y-1/2 rotate-90",
  },
  fit: {
    cover: "object-cover",
    contain: "bg-static-white object-contain",
  },
};

const IMAGE_DEFAULTS = { rotate: false, fit: "cover" };

// 받는 동안은 보이지 않게 · 다 받으면 투명도로(150ms, 모션 줄이기면 바로)
const IMAGE_LOADING = "opacity-0";
const IMAGE_REVEAL = "animate-[fade-in_var(--motion-duration-d3)_var(--motion-ease-enter)] motion-reduce:animate-none";

// 그림 위 자리(imageFrameFloaterVariants) — 네 모서리, 틀 가장자리에서 6. 틀의 짧은 변이 80 이상일 때만 보인다. 누르지 않는다
const FLOATER_BASE = "pointer-events-none absolute hidden [@container_image-frame_(min-width:80px)_and_(min-height:80px)]:flex";

const FLOATER_VARIANTS = {
  placement: {
    "top-start": "start-x1_5 top-x1_5",
    "top-end": "end-x1_5 top-x1_5",
    "bottom-start": "bottom-x1_5 start-x1_5",
    "bottom-end": "bottom-x1_5 end-x1_5",
  },
};

// 장수 글(imageFrameIndicatorVariants) — 알약 · 검정 65%(두 모드 같다) · 흰 11/15 500 · 좌우 6 · 위아래 2 · 높이 19
const INDICATOR_BASE =
  "inline-flex min-h-[19px] items-center whitespace-nowrap rounded-full bg-[var(--overlay-dim-dark)] px-x1_5 py-x0_5 font-sans text-t1 font-medium text-static-white";

// 카드 면 — 기관 색 한 색 + 표의 글자색. 크기는 틀의 폭으로(96 미만 첫 글자 · 96 ~ 239 medium · 240 이상 large)
const CARD_FACE_TEXT = {
  white: "text-static-white",
  dark: "text-fg-neutral dark:text-fg-neutral-inverted",
};
const CARD_FACE = "relative size-full overflow-hidden font-sans";
// small — 회사 첫 글자 가운데, 면 높이의 40%(가장 작아도 10 · 정수로) · 700 · 줄 높이 1 · 로마자 대문자. cn() 의 세 조각 — 지워지는 클래스가 없다
const CARD_FACE_INITIAL = [
  "absolute inset-0 flex items-center justify-center font-bold uppercase @min-[96px]/image-frame:hidden",
  "text-[length:max(10px,round(40cqh,1px))]",
  "leading-none",
].join(" ");
// medium · large — 왼쪽 아래 회사 · 카드 이름
const CARD_FACE_LABEL =
  "absolute inset-x-0 bottom-0 hidden flex-col px-x2_5 pb-x2 @min-[96px]/image-frame:flex @min-[240px]/image-frame:px-x4 @min-[240px]/image-frame:pb-x3_5";
const CARD_FACE_ISSUER = "truncate text-t2 font-medium @min-[240px]/image-frame:text-t3";
const CARD_FACE_NAME = "line-clamp-1 break-keep text-t4 font-bold [overflow-wrap:break-word] @min-[240px]/image-frame:line-clamp-2 @min-[240px]/image-frame:text-t5";

// ── image-frame.tsx 의 JSX 에 적힌 클래스 ─────────────────────────────────

// 틀의 폭 — 고정 폭(width)이면 줄지 않게, 아니면 부모 폭을 채운다
const FIXED_WIDTH = "shrink-0";
const FILL_WIDTH = "w-full";
// 불러오는 동안의 스켈레톤 — 틀을 채운다(<Skeleton radius="0" className=…> — 모서리는 틀이 자른다)
const LOADING_SKELETON = "absolute inset-0 size-full";
// 대체 그림 자리 — 틀을 채운다(이름은 alt 를 이어받는다)
const FALLBACK = "absolute inset-0 flex";
// Indicator 의 읽는 글
const SR_ONLY = "sr-only";

// ── aspect-ratio.tsx 의 cva 와 같은 값 — 비율 여덟 ─────────────────────────

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

// ── skeleton.tsx 의 상수와 같은 값 — 불러오는 동안 ─────────────────────────

const SK_ROOT = "relative block overflow-hidden bg-bg-neutral-weak";
const SK_RADIUS = { "0": "rounded-none", "4": "rounded-r1", "6": "rounded-r1_5", "8": "rounded-r2" };
const SK_SHIMMER = [
  "pointer-events-none absolute inset-0 [transform:translateX(-100%)]",
  "bg-[image:var(--gradient-shimmer-neutral)] dark:bg-[image:var(--gradient-shimmer-neutral-dark)]",
  "animate-[shimmer_var(--motion-duration-loop)_var(--motion-ease-easing)_infinite]",
  "motion-reduce:animate-none motion-reduce:opacity-0",
].join(" ");

// ── content-placeholder.tsx 의 상수와 같은 값 — 없음 · 실패 ─────────────────

const CPH_ROOT = "flex size-full items-center justify-center overflow-hidden bg-bg-neutral-weak [container-type:size]";
const CPH_GLYPH =
  "flex size-[min(clamp(16px,50cqh,160px),100cqw)] shrink-0 items-center justify-center text-stroke-neutral-weak [&>svg]:size-full [&>svg]:[stroke-width:1.5]";

// ── badge.tsx 의 cva 와 같은 값 — 그림 위 배지(solid) · 줄의 배지(weak), neutral · medium ──

const BADGE_BASE = "inline-flex min-w-0 cursor-default items-center gap-x0_5 overflow-hidden whitespace-nowrap font-sans";
const BADGE_VARIANTS = {
  variant: { weak: "font-medium", solid: "font-bold" },
  tone: { neutral: "" },
  size: { medium: "min-h-x5 rounded-r1 px-x1_5 py-x0_5 text-t1" },
};
const BADGE_COMPOUND = [
  { variant: "weak", tone: "neutral", className: "bg-bg-neutral-weak text-fg-neutral-muted" },
  { variant: "solid", tone: "neutral", className: "bg-bg-neutral-inverted text-fg-neutral-inverted" },
];
const BADGE_DEFAULTS = { variant: "weak", tone: "neutral", size: "medium" };
const BADGE_LABEL = "min-w-0 truncate";

// ── list.tsx 의 cva 와 같은 값 — 누르는 줄(ListButtonItem) ──────────────────

const LIST_BASE = "flex w-full flex-col";
const LIST_ITEM_BASE = [
  "group/list-item relative flex w-full",
  "before:pointer-events-none before:absolute before:inset-y-0 before:inset-x-0 before:rounded-none before:bg-transparent before:content-['']",
  "before:[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),inset_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-radius_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:inset-x-x1_5 [@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:rounded-[var(--list-item-radius,var(--radius-r2_5))] [@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:bg-bg-layer-default-pressed",
  "has-[[data-list-action]:not([data-disabled]):active]:before:inset-x-x1_5 has-[[data-list-action]:not([data-disabled]):active]:before:rounded-[var(--list-item-radius,var(--radius-r2_5))] has-[[data-list-action]:not([data-disabled]):active]:before:bg-bg-layer-default-pressed",
].join(" ");
const LIST_ITEM_VARIANTS = {
  highlight: {
    none: "",
    highlighted:
      "before:bg-bg-brand-weak [@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:bg-bg-brand-weak-pressed has-[[data-list-action]:not([data-disabled]):active]:before:bg-bg-brand-weak-pressed",
  },
};
const LIST_ITEM_DEFAULTS = { highlight: "none" };
const LIST_CONTENT_BASE = [
  "relative flex w-full py-x3",
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "group-has-[[data-list-action]:not([data-disabled]):active]/list-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-has-[[data-list-action]:not([data-disabled]):active]/list-item:[scale:1]",
].join(" ");
const LIST_CONTENT_VARIANTS = { align: { center: "items-center", top: "items-start" }, nest: { none: "px-global-gutter", parent: "pl-x1 pr-global-gutter", child: "pl-[104px] pr-global-gutter" } };
const LIST_CONTENT_DEFAULTS = { align: "center", nest: "none" };
const LIST_PREFIX_BASE = "flex shrink-0 items-center pr-x3 text-fg-neutral [&>svg]:size-[22px]";
const LIST_PREFIX_VARIANTS = {
  disabled: { true: "text-fg-disabled [&_[data-list-tile]]:bg-bg-disabled [&_[data-list-tile]]:text-fg-disabled", false: "" },
};
const LIST_PREFIX_DEFAULTS = { disabled: false };
const LIST_BODY_BASE = "flex min-w-[calc(1em+var(--spacing-x2_5))] flex-1 flex-col items-start gap-x0_5 pr-x2_5 text-left";
const LIST_TITLE_BASE = "font-sans text-t5 font-normal text-fg-neutral [overflow-wrap:anywhere]";
const LIST_TITLE_VARIANTS = { disabled: { true: "text-fg-disabled", false: "" } };
const LIST_TITLE_DEFAULTS = { disabled: false };
const LIST_HIGHLIGHT_MUTED =
  "[@media(hover:hover)]:group-has-[[data-list-action]:not([data-disabled]):hover]/list-item:text-fg-neutral-muted group-has-[[data-list-action]:not([data-disabled]):active]/list-item:text-fg-neutral-muted";
const LIST_DETAIL_BASE = "font-sans text-t3 text-fg-neutral-subtle [overflow-wrap:anywhere]";
const LIST_DETAIL_VARIANTS = {
  disabled: { true: "text-fg-disabled", false: "" },
  highlighted: { true: LIST_HIGHLIGHT_MUTED, false: "" },
};
const LIST_DETAIL_DEFAULTS = { disabled: false, highlighted: false };
const LIST_ACTION_BASE = [
  "cursor-pointer appearance-none border-0 bg-transparent p-0 font-[inherit] text-[inherit] no-underline outline-none",
  "after:absolute after:inset-0 after:content-['']",
  "focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-stroke-focus-ring",
  "data-[disabled]:cursor-not-allowed",
].join(" ");

// ── scroll-fog.tsx 의 상수와 같은 값 — 가로 줄(row) ───────────────────────

const FOG_DEPTH = { row: { start: "20px", end: "20px" } };
const FOG_SOLID = "linear-gradient(#000, #000)";
const FOG_COMPOSITE = { "mask-composite": "intersect", "-webkit-mask-composite": "source-in" };
const FOG_ROOT = { row: "overflow-x-auto overflow-y-hidden scroll-px-global-gutter [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" };
const FOG_CONTENT = { row: "w-max min-w-full px-global-gutter" };

// 토큰 값 — 레시피는 그릴 때 getComputedStyle 로 읽는다. 정적 HTML 은 DESIGN.md 의 v104 표에서 읽는다
const FADE_MASK = /`gradient-fade-mask` \| `(linear-gradient\([^`]+\))`/.exec(readFileSync(new URL("../../../DESIGN.md", import.meta.url), "utf8"))[1];

// 방향 없이 적힌(위 → 아래) 그라디언트 토큰에 방향을 붙인다
const withDirection = (token, direction) => token.replace(/^linear-gradient\(/, `linear-gradient(${direction}, `);

// 가로 축의 마스크 — 흐린 쪽마다 상자 전체 크기의 층 하나(단계는 그 쪽 깊이의 몫), 두 층을 곱한다(scroll-fog.tsx 의 fogMask 가로 갈래)
function fogMask(token, start, end) {
  const layers = [start, end].map((depth, i) =>
    parseFloat(depth) > 0 ? withDirection(token.replace(/(\d+(?:\.\d+)?)%/g, (_m, p) => `calc(${depth} * ${Number(p) / 100})`), i === 0 ? "to right" : "to left") : FOG_SOLID,
  );
  return { image: layers.join(", "), size: "100% 100%, 100% 100%", position: "0 0, 0 0" };
}

// useScrollFog 가 상자의 style 에 넣는 값 — mask-* 와 -webkit-mask-* 를 같이, 그리고 FOG_COMPOSITE
function fogStyle(use) {
  const { start, end } = FOG_DEPTH[use];
  const mask = { ...fogMask(FADE_MASK, start, end), repeat: "no-repeat" };
  return [
    ...["image", "size", "position", "repeat"].map((p) => `mask-${p}:${mask[p]}; -webkit-mask-${p}:${mask[p]};`),
    ...Object.entries(FOG_COMPOSITE).map(([p, v]) => `${p}:${v};`),
  ].join(" ");
}

// ── 기관 색 표 — lib/institution-colors.ts 의 INSTITUTION_COLORS 를 그대로 읽는다 ─────
// 정적 미리보기는 TS 를 불러오지 못해 표의 글자(institution-colors.yaml 에서 만든 배열)를 풀어 쓴다
const INSTITUTION_COLORS = new Function(
  `return ${/export const INSTITUTION_COLORS[^=]*=\s*(\[[\s\S]*?\n\]);/.exec(readFileSync(new URL("../lib/institution-colors.ts", import.meta.url), "utf8"))[1]};`,
)();

// ── 레시피의 규칙 함수와 같은 답 ─────────────────────────────────────────

/** 폭 → 모서리(SEED) — 24 이하 "4" · 48 이하 "6" · 그 위 "8". 폭을 모르면(부모 폭을 채운다) "8" */
function imageFrameRadius(width) {
  if (width == null || Number.isNaN(width)) return "8";
  return width <= 24 ? "4" : width <= 48 ? "6" : "8";
}

// 공백을 모두 뺀다 — 찾는 이름과 표의 name · aliases 모두
const squash = (value) => value.replace(/\s+/g, "");
const KEYS = INSTITUTION_COLORS.map((entry) => ({ entry, keys: [entry.name, ...entry.aliases].map(squash).filter((key) => key !== "") }));

/** 기관 이름 → 기관 색 표의 한 줄(color · text …). 같은 이름 · 별칭, 아니면 든 가장 긴 이름, 없으면 null */
function institutionColor(name) {
  const query = squash(name ?? "");
  if (query === "") return null;
  for (const { entry, keys } of KEYS) if (keys.includes(query)) return entry;
  let found = null;
  let longest = 0;
  for (const { entry, keys } of KEYS) {
    for (const key of keys) {
      if (key.length > longest && query.includes(key)) {
        found = entry;
        longest = key.length;
      }
    }
  }
  return found;
}

const displayName = (name) => String(name).trim();
const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });

/** 이니셜 — 표시 이름의 첫 글자 하나(사용자가 보는 글자 단위), 로마자는 대문자. 이름이 비면 "" (avatar.tsx) */
function avatarInitial(name) {
  const shown = displayName(name);
  if (shown === "") return "";
  return (graphemes.segment(shown)[Symbol.iterator]().next().value?.segment ?? "").toUpperCase();
}

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

const variantKey = (v) => (typeof v === "boolean" ? String(v) : v);

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다
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

const imageFrameVariants = cvaOf(FRAME_BASE, { variants: FRAME_VARIANTS, defaultVariants: FRAME_DEFAULTS });
const aspectRatioVariants = cvaOf("", { variants: RATIO_VARIANTS, defaultVariants: RATIO_DEFAULTS });
const imageFrameImageVariants = cvaOf(IMAGE_BASE, { variants: IMAGE_VARIANTS, defaultVariants: IMAGE_DEFAULTS });
const imageFrameFloaterVariants = cvaOf(FLOATER_BASE, { variants: FLOATER_VARIANTS });
const badgeVariants = cvaOf(BADGE_BASE, { variants: BADGE_VARIANTS, compoundVariants: BADGE_COMPOUND, defaultVariants: BADGE_DEFAULTS });
const listVariants = cvaOf(LIST_BASE);
const listItemVariants = cvaOf(LIST_ITEM_BASE, { variants: LIST_ITEM_VARIANTS, defaultVariants: LIST_ITEM_DEFAULTS });
const listContentVariants = cvaOf(LIST_CONTENT_BASE, { variants: LIST_CONTENT_VARIANTS, defaultVariants: LIST_CONTENT_DEFAULTS });
const listPrefixVariants = cvaOf(LIST_PREFIX_BASE, { variants: LIST_PREFIX_VARIANTS, defaultVariants: LIST_PREFIX_DEFAULTS });
const listBodyVariants = cvaOf(LIST_BODY_BASE);
const listTitleVariants = cvaOf(LIST_TITLE_BASE, { variants: LIST_TITLE_VARIANTS, defaultVariants: LIST_TITLE_DEFAULTS });
const listDetailVariants = cvaOf(LIST_DETAIL_BASE, { variants: LIST_DETAIL_VARIANTS, defaultVariants: LIST_DETAIL_DEFAULTS });
const listActionVariants = cvaOf(LIST_ACTION_BASE);

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다 — 이 파일이 합치는 무리만 안다(자리 잡기 · 애니메이션 · 불투명도).
// 스켈레톤(relative)에 틀을 채우는 absolute 를 덧붙이는 자리에서 relative 가 지워진다
const GROUPS = [
  [/^(static|fixed|absolute|relative|sticky)$/, "position"],
  [/^animate-/, "animate"],
  [/^opacity-/, "opacity"],
];
function merge(classList) {
  const seen = new Set();
  const kept = [];
  for (const cls of classList.split(/\s+/).filter(Boolean).reverse()) {
    const cut = cls.lastIndexOf(":", cls.endsWith("]") ? cls.lastIndexOf("[") : cls.length);
    const prefix = cut > 0 && !cls.startsWith("[") ? cls.slice(0, cut) : "";
    const utility = prefix ? cls.slice(cut + 1) : cls;
    const group = GROUPS.find(([re]) => re.test(utility))?.[1];
    if (group) {
      const key = `${prefix}|${group}`;
      if (seen.has(key)) continue;
      seen.add(key);
    }
    kept.push(cls);
  }
  return kept.reverse().join(" ");
}

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 의 아이콘과 같은 모양(24 격자) — 대체 그림 image · credit-card
const svg = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const ICONS = {
  image: svg('<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>'),
  creditCard: svg('<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>'),
};

// 그림 재료 — 손으로 칠한 대역(실제 사진 · 카드 그림이 아니다). 원래 크기(width · height)를 가진 SVG 다
const uri = (w, h, body) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`)}`;
const scene = ([sky1, sky2, sun, hill1, hill2]) =>
  uri(800, 600, `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky1}"/><stop offset="1" stop-color="${sky2}"/></linearGradient></defs><rect width="800" height="600" fill="url(#s)"/><circle cx="544" cy="192" r="54" fill="${sun}"/><path d="M0 420C144 348 272 360 400 408S656 336 800 372V600H0Z" fill="${hill1}"/><path d="M0 504C200 444 440 480 576 516S736 480 800 492V600H0Z" fill="${hill2}"/>`);
const cardH = (c1, c2, name, ink = "#ffffff") =>
  uri(856, 540, `<defs><linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="856" height="540" fill="url(#c)"/><rect x="72" y="150" width="120" height="92" rx="14" fill="#d9b44a"/><text x="790" y="470" text-anchor="end" font-family="sans-serif" font-size="64" font-weight="800" letter-spacing="3" fill="${ink}">${name}</text>`);
const cardV = (c1, c2, name) =>
  uri(540, 856, `<defs><linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="540" height="856" fill="url(#c)"/><rect x="76" y="72" width="150" height="104" rx="14" fill="#d9b44a"/><text transform="translate(300 470) rotate(-90)" text-anchor="middle" font-family="sans-serif" font-size="76" font-weight="800" letter-spacing="5" fill="#ffffff">${name}</text>`);
const ART = {
  dawn: scene(["#f6c9a8", "#f7e6d3", "#fff3c4", "#c7a38a", "#8f6f5c"]),
  forest: scene(["#cfe7f2", "#eef6f1", "#ffffff", "#6fa77f", "#3f7552"]),
  sea: scene(["#9fc7ec", "#dcecf8", "#ffffff", "#4f86b8", "#245b8a"]),
  dusk: scene(["#5b4a8a", "#e7a3a1", "#ffe0b0", "#6a4f74", "#3a2d4a"]),
  night: scene(["#1b2036", "#3a3550", "#f5e6a8", "#262a43", "#12162a"]),
  cardEdition: cardH("#1c1c1c", "#5a5a5a", "M EDITION"),
  cardSelect: cardV("#e52d27", "#7b1fa2", "SELECT ALL"),
  cardTravel: cardV("#0f2f5c", "#2f7fb8", "TRAVEL"),
  rule: uri(800, 800, `<rect width="800" height="800" fill="#e7f3ec"/><rect x="200" y="230" width="400" height="360" rx="36" fill="#ffffff"/><rect x="200" y="230" width="400" height="96" rx="36" fill="#2f8a5d"/><rect x="200" y="290" width="400" height="36" fill="#2f8a5d"/><rect x="410" y="430" width="60" height="44" rx="10" fill="#2f8a5d"/>`),
  ruleAttire: uri(800, 800, `<rect width="800" height="800" fill="#eef1f8"/><path d="M300 220h200l120 90-50 90-50-30v240H280V370l-50 30-50-90Z" fill="#ffffff" stroke="#5b6b8c" stroke-width="14" stroke-linejoin="round"/>`),
};
const ALBUM = ["dawn", "forest", "sea", "dusk", "night"];

// <Skeleton radius="0" className="absolute inset-0 size-full" /> — 불러오는 동안 틀을 채운다(cn — relative 가 지워진다)
const loadingSkeleton = () =>
  `<span data-slot="skeleton" data-radius="0" class="${merge(`${SK_ROOT} ${SK_RADIUS["0"]} ${LOADING_SKELETON}`)}" aria-hidden="true"><span data-slot="skeleton-shimmer" class="${SK_SHIMMER}"></span></span>`;

// <ContentPlaceholder icon> — 이름은 바깥 자리(image-frame-fallback)가 가진다
const contentPlaceholder = (icon = "image") =>
  `<div data-slot="content-placeholder" class="${CPH_ROOT}" aria-hidden="true"><span aria-hidden="true" data-slot="content-placeholder-glyph" class="${CPH_GLYPH}">${ICONS[icon]}</span></div>`;

// <ImageFrame> — image-frame.tsx 그대로. state 는 그 순간(loading · loaded · error), portrait 는 다 받은 그림이 세로인지(카드 그림을 돌린다),
// reveal 은 받는 중에서 막 바뀐 순간(투명도로 나타남). slot · extra 는 CardArt 가 덧붙이는 속성, children 은 그림 위 자리
function imageFrame({ src, alt = "", ratio = "4:3", width, bleed = false, fit = "cover", loading = "lazy", state = "loaded", portrait = false, reveal = false, fallbackIcon = "image", fallback, slot = "image-frame", extra = [], className = "", children = "" }) {
  const status = src ? state : "error";
  const radius = bleed ? "0" : imageFrameRadius(width);
  const rotate = ratio === "card" && status === "loaded" && portrait;
  const named = alt.trim() !== "";
  const root = attrs([
    `data-slot="${slot}"`,
    `data-state="${status === "error" ? "fallback" : status}"`,
    `data-ratio="${ratio}"`,
    `data-radius="${radius}"`,
    `data-fit="${fit}"`,
    rotate && 'data-rotated="true"',
    ...extra,
    `class="${merge(`${imageFrameVariants({ radius })} ${aspectRatioVariants({ ratio })} ${width != null ? FIXED_WIDTH : FILL_WIDTH} ${className}`)}"`,
    width != null && `style="width:${width}px"`,
  ]);
  const image = src && status !== "error"
    ? `<img data-slot="image-frame-image" loading="${loading}" alt="${esc(alt)}" src="${src}" class="${merge(`${imageFrameImageVariants({ rotate, fit })} ${status === "loading" ? IMAGE_LOADING : ""} ${status === "loaded" && reveal ? IMAGE_REVEAL : ""}`)}">`
    : "";
  const failed = status === "error"
    ? `<div data-slot="image-frame-fallback" class="${FALLBACK}" ${named ? `role="img" aria-label="${esc(alt)}"` : 'aria-hidden="true"'}>${fallback ?? contentPlaceholder(fallbackIcon)}</div>`
    : "";
  return `<div ${root}>${status === "loading" && src ? loadingSkeleton() : ""}${image}${failed}${children}</div>`;
}

// <ImageFrameFloater placement> · <ImageFrameIndicator label> · <Badge variant="solid">
const floater = (placement, html) =>
  `<div data-slot="image-frame-floater" data-placement="${placement}" class="${imageFrameFloaterVariants({ placement })}">${html}</div>`;
const indicator = (text, label) =>
  `<span data-slot="image-frame-indicator" class="${INDICATOR_BASE}"><span aria-hidden="true">${esc(text)}</span><span class="${SR_ONLY}">${esc(label)}</span></span>`;
const badge = (text, variant = "solid") =>
  `<span data-slot="badge" class="${badgeVariants({ variant })}"><span data-slot="badge-label" class="${BADGE_LABEL}">${esc(text)}</span></span>`;

// 카드 면(CardFace) — 기관 색 한 색 + 표의 글자색, 첫 글자(small) · 회사 · 카드 이름(medium · large)
function cardFace({ issuer, name, institution }) {
  const nameHtml = name.trim() !== "" ? `<span data-slot="card-art-name" class="${CARD_FACE_NAME}">${esc(name.trim())}</span>` : "";
  return `<div data-slot="card-art-face" data-text="${institution.text}" class="${CARD_FACE} ${CARD_FACE_TEXT[institution.text]}" style="background-color:${institution.color}"><span data-slot="card-art-initial" class="${CARD_FACE_INITIAL}">${esc(avatarInitial(issuer))}</span><span data-slot="card-art-label" class="${CARD_FACE_LABEL}"><span data-slot="card-art-issuer" class="${CARD_FACE_ISSUER}">${esc(issuer.trim())}</span>${nameHtml}</span></div>`;
}

// <CardArt> — ratio card 의 Image Frame. 그림이 없거나 실패하면 아는 카드사는 카드 면, 모르는 카드사는 대체 그림(credit-card)
function cardArt({ issuer, name, src, width, decorative = true, loading, state, portrait, children }) {
  const institution = institutionColor(issuer);
  const label = [issuer.trim(), name.trim()].filter((part) => part !== "").join(" ");
  return imageFrame({
    src,
    alt: decorative ? "" : label,
    ratio: "card",
    width,
    loading,
    state,
    portrait,
    fallbackIcon: "creditCard",
    fallback: institution ? cardFace({ issuer, name, institution }) : undefined,
    slot: "card-art",
    extra: [`data-issuer="${institution ? "known" : "unknown"}"`],
    children,
  });
}

// <ListButtonItem> — 줄 전체가 버튼(앞 · 제목 · 설명)
function listButtonItem({ title, detail, prefix }) {
  const body = `<span class="${listTitleVariants()}">${esc(title)}</span>${detail ? `<span class="${listDetailVariants()}">${esc(detail)}</span>` : ""}`;
  return `<li class="${listItemVariants()}"><div class="${listContentVariants()}"><span class="${listPrefixVariants()}">${prefix}</span><button type="button" data-list-action="" class="${listActionVariants()} ${listBodyVariants()}">${body}</button></div></li>`;
}

// <ScrollFog use="row"> — 스크롤 상자 + 안쪽 감싸개(scroll-fog.tsx)
const scrollFogRow = (html, extra = []) =>
  `<div ${attrs(['data-slot="scroll-fog"', 'data-use="row"', `class="group/scroll-fog relative ${FOG_ROOT.row}"`, ...extra, 'data-fog-axis="x"', `style="${fogStyle("row")}"`])}><div data-slot="scroll-fog-content" class="${FOG_CONTENT.row}">${html}</div></div>`;

// 흰 표면 · 폰 화면 · 줄 · 이름표 — 미리보기 틀(레시피가 아니다)
const SURFACE =
  "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5); color:var(--color-fg-neutral); font-family:var(--font-sans);";
const surface = (html, extra = "") => `<div style="${SURFACE}${extra}">${html}</div>`;
const SCREEN =
  "max-width:360px; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) 0; color:var(--color-fg-neutral); font-family:var(--font-sans);";
const screen = (html, extra = "") => `<div style="${SCREEN}${extra}">${html}</div>`;
const row = (items, gap = "var(--spacing-x4)", align = "flex-start") => `<div style="display:flex; flex-wrap:wrap; align-items:${align}; gap:${gap};">${items.join("")}</div>`;
const CAPTION =
  "font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption, width) =>
  `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2); min-width:0;${width ? ` width:${width}px; max-width:100%;` : ""}">${html}<span style="${CAPTION}">${caption}</span></div>`;
const TITLE = "margin:0; font-family:var(--font-sans); color:var(--color-fg-neutral);";
const SCREEN_TITLE = `<div style="${TITLE} padding:0 var(--spacing-global-gutter) var(--spacing-x2); font-size:var(--text-t7); line-height:var(--text-t7--line-height); font-weight:700;">`;

// ── 화면 예시의 값 ────────────────────────────────────────────────────────

// 카드 혜택 — 그림(세로 · 가로) · 그림 없음(아는 카드사 · 모르는 카드사)
const CARDS = [
  { issuer: "삼성카드", name: "iD SELECT ALL", typeLabel: "신용", src: ART.cardSelect, portrait: true },
  { issuer: "현대카드", name: "M EDITION", typeLabel: "신용", src: ART.cardEdition, portrait: false, discontinued: true },
  { issuer: "NH농협카드", name: "올원 Pay", typeLabel: "체크" },
  { issuer: "BC카드", name: "바로 카드", typeLabel: "신용" },
];
const RATIOS = [
  ["1:1", "정사각"],
  ["2:1", "넓은 띠"],
  ["16:9", "동영상"],
  ["4:3", "사진 — 기본"],
  ["6:7", "조금 세로"],
  ["4:5", "세로 · 여러 장"],
  ["2:3", "긴 세로"],
  ["card", "카드 1.586"],
];
const HEIGHT = { "1:1": 1, "2:1": 2, "16:9": 16 / 9, "4:3": 4 / 3, "6:7": 6 / 7, "4:5": 4 / 5, "2:3": 2 / 3, card: 1.586 };
const fmt = (n) => String(Math.round(n * 10) / 10);

// ── 예제 ──────────────────────────────────────────────────────────────────

export const imageFrameExamples = [
  {
    title: "목록 줄 — 카드 그림 56",
    description:
      "카드 혜택 목록의 앞은 카드 그림 56 이다 — 비율 card(1.586)라 높이 35.3, 폭 49 이상이라 모서리 8. 세로 카드 그림(원래 폭 < 높이)은 다 받은 뒤 시계 방향 90° 돌려 가로 틀을 채운다(삼성카드 — 카드 전체가 거의 그대로 든다). 그림이 없으면 카드사로 가른다 — 기관 색 표에 있는 카드사(NH농협카드)는 카드 면이고 폭 96 미만이라 회사 첫 글자만 가운데(면 높이의 40% · 14), 표에 없는 카드사(BC카드)는 대체 그림(credit-card)이다. 옆에 이름이 있어 그림은 장식이다(decorative 기본 — alt=\"\" · 면도 숨긴다). 그림 위 배지 · 장수는 짧은 변이 80 보다 작은 이 틀에는 얹지 않는다.",
    jsx: `import { CardArt } from "@/components/ui/image-frame"
import { ListButtonItem } from "@/components/ui/list"

{/* 옆에 이름이 있다 — 그림은 장식(decorative 기본) */}
<ListButtonItem
  prefix={<CardArt width={56} src={card.imgUrl} issuer={card.companyName} name={card.name} />}
  title={card.name}
  detail={\`\${card.typeLabel} · \${card.companyName}\`}
  onClick={() => openCard(card.id)}
/>`,
    render: () =>
      screen(
        `${SCREEN_TITLE}카드 혜택</div><ul class="${listVariants()}">${CARDS.map((card) =>
          listButtonItem({
            prefix: cardArt({ width: 56, src: card.src, issuer: card.issuer, name: card.name, portrait: card.portrait }),
            title: card.name,
            detail: `${card.typeLabel} · ${card.issuer}`,
          }),
        ).join("")}</ul>`,
      ),
  },

  {
    title: "격자 — 단종 배지",
    description:
      "혜택 격자의 카드 그림은 칸의 폭을 채운다(width 없음 — 모서리 8). 카드 면의 크기도 그 폭으로 고른다 — 96 ~ 239 는 회사 t2 · 카드 이름 t4 한 줄(좌우 10 · 아래 8), 240 이상은 회사 t3 · 이름 t5 두 줄까지(좌우 16 · 아래 14). 단종 카드는 흐리지 않고 그림 위 시작에 배지(Badge solid — 그림 위는 늘 solid)를 얹는다 — 틀 가장자리에서 6, 틀의 짧은 변이 80 이상일 때만 보인다. 카드 이름은 그림 아래 글이라 그림은 장식이다.",
    jsx: `import { Badge } from "@/components/ui/badge"
import { CardArt, ImageFrameFloater } from "@/components/ui/image-frame"

<CardArt src={card.imgUrl} issuer={card.companyName} name={card.name}>
  {card.discontinued && (
    <ImageFrameFloater placement="top-start">
      <Badge variant="solid">단종</Badge>
    </ImageFrameFloater>
  )}
</CardArt>
<p className="text-t4 font-bold">{card.name}</p>`,
    render: () =>
      surface(
        `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 200px), 1fr)); gap:var(--spacing-x6) var(--spacing-x4);">${CARDS.slice(0, 3)
          .map(
            (card) =>
              `<div style="display:flex; flex-direction:column; gap:var(--spacing-x3); min-width:0;">${cardArt({
                src: card.src,
                issuer: card.issuer,
                name: card.name,
                portrait: card.portrait,
                children: card.discontinued ? floater("top-start", badge("단종")) : "",
              })}<p class="text-t4 font-bold" style="${TITLE}">${esc(card.name)}</p></div>`,
          )
          .join("")}</div>`,
      ),
  },

  {
    title: "상세 — 그림과 카드 이름 글",
    description:
      "상세 머리의 카드 그림은 폰 폭에서 좌우 24 를 뺀 312 다 — 1.586 그대로(최대 높이를 걸어 비율을 바꾸지 않는다)이고 데스크톱 대화상자에서도 같은 312 를 가운데에 둔다. 첫 화면의 큰 그림이라 바로 받는다(loading=\"eager\" — 나머지는 lazy 가 기본). 그림이 떠도 카드 이름을 그림 아래 글(제목 t7 · 700)로 둔다 — 그림 속 글 · alt 에만 이름을 두지 않는다.",
    jsx: `<div className="flex flex-col gap-x3">
  <CardArt width={312} src={card.imgUrl} issuer={card.companyName} name={card.name} loading="eager" />
  <div>
    <h2 className="text-t7 font-bold">{card.name}</h2>
    <p className="text-t4 text-fg-neutral-subtle">{card.companyName}</p>
  </div>
</div>`,
    render: () =>
      surface(
        `${cardArt({ width: 312, src: ART.cardSelect, issuer: "삼성카드", name: "iD SELECT ALL", portrait: true, loading: "eager" })}<h2 class="text-t7 font-bold" style="${TITLE} margin-top:var(--spacing-x4);">iD SELECT ALL</h2><p class="text-t4 text-fg-neutral-subtle" style="margin:var(--spacing-x1) 0 0; font-family:var(--font-sans);">삼성카드</p>`,
        " max-width:360px;",
      ),
  },

  {
    title: "규정 그림 — 1:1 · 장식",
    description:
      "HR 규정 카드의 그림은 1:1 Image Frame 이다 — 칸의 폭을 채우고(모서리 8) 그림을 잘리지 않을 만큼 꽉 채운다(cover). 화면에 들어올 때 받는다(lazy 기본 — 16장을 한 번에 받지 않는다). 제목 · 설명이 내용을 말하므로 그림은 장식이다(alt=\"\" — 파일 이름 \"rule_1_1\" 을 이름으로 두지 않는다). 마우스를 올려도 카드를 키우지 않는다.",
    jsx: `import { ImageFrame } from "@/components/ui/image-frame"

{/* 제목 · 설명이 내용을 말한다 — 그림은 장식. 늦게 받는다(lazy 기본) */}
<ImageFrame ratio="1:1" src="/rule_1_1.png" alt="" />
<h3>{t("rule.vacation.daysTitle")}</h3>`,
    render: () =>
      surface(
        `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 160px), 1fr)); gap:var(--spacing-x6) var(--spacing-x4);">${[
          [ART.rule, "연차 · 휴가", "입사 1년 뒤 15일"],
          [ART.ruleAttire, "복장", "평일은 자유"],
        ]
          .map(([src, title, sub]) => `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2); min-width:0;">${imageFrame({ ratio: "1:1", src, alt: "" })}<h3 style="${TITLE} margin-top:var(--spacing-x1); font-size:var(--text-t4); line-height:var(--text-t4--line-height); font-weight:700;">${title}</h3><p style="margin:0; font-family:var(--font-sans); font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle);">${sub}</p></div>`)
          .join("")}</div>`,
      ),
  },

  {
    title: "여러 장 — 가로 줄 · 장수",
    description:
      "그림 여러 장은 Scroll Fog row 가로 줄에 틀을 사이 8 로 잇는다 — 다음 장이 20 이상 보이게 폭을 잡아 넘길 수 있음을 알린다(아래 390 화면에서 셋째 장이 30 보인다 — 그 끝 20 은 흐림). 줄의 양 끝은 늘 흐리고(좌우 20) 안쪽 여백은 화면 여백 24 다. 안에 초점 가는 것이 없으면 줄이 키보드로 스크롤되게 tabIndex · 이름을 단다. 한 장씩 크게 볼 때는 화면 폭(bleed — 모서리 0) 그림의 오른쪽 아래 Indicator \"1 / 12\" — 알약 · 검정 65%(두 모드 같다) · 흰 11/15 500 · 높이 19 이고, 보이는 글은 숨기고 label(\"사진 12장 중 1번째\")을 읽는다. 화살표 · 점 · 자동 넘김은 두지 않는다.",
    jsx: `import { ImageFrame, ImageFrameFloater, ImageFrameIndicator } from "@/components/ui/image-frame"
import { ScrollFog } from "@/components/ui/scroll-fog"

{/* 안에 초점 가는 것이 없으면 줄이 키보드로 스크롤되게 tabIndex · 이름(Scroll Fog) */}
<ScrollFog use="row" tabIndex={0} aria-label="사진">
  <div className="flex gap-x2">
    {photos.map((p) => <ImageFrame key={p.id} ratio="4:5" width={144} src={p.url} alt={p.description} />)}
  </div>
</ScrollFog>

<ImageFrame bleed ratio="1:1" src={photos[i].url} alt={photos[i].description}>
  <ImageFrameFloater placement="bottom-end">
    <ImageFrameIndicator label={\`사진 \${photos.length}장 중 \${i + 1}번째\`}>{\`\${i + 1} / \${photos.length}\`}</ImageFrameIndicator>
  </ImageFrameFloater>
</ImageFrame>`,
    render: () =>
      `<div style="display:flex; flex-direction:column; gap:var(--spacing-x4); max-width:390px;">${screen(
        scrollFogRow(
          `<div class="flex gap-x2">${Array.from({ length: 12 }, (_, i) => imageFrame({ ratio: "4:5", width: 160, src: ART[ALBUM[i % ALBUM.length]], alt: `사진 ${i + 1}` })).join("")}</div>`,
          ['tabindex="0"', 'aria-label="사진"'],
        ),
        " max-width:390px;",
      )}${screen(imageFrame({ bleed: true, ratio: "1:1", src: ART.dusk, alt: "저녁 하늘", children: floater("bottom-end", indicator("1 / 12", "사진 12장 중 1번째")) }), " max-width:390px; padding:0; overflow:hidden;")}</div>`,
  },

  {
    title: "비율 — 여덟 가지",
    description:
      "비율은 여덟 가지다 — SEED 의 일곱(1:1 · 2:1 · 16:9 · 4:3 · 6:7 · 4:5 · 2:3)과 카드 1.586(ISO 카드 85.6 × 53.98 — porest). 기본은 4:3 이다. 틀은 그림이 오기 전에 비율로 자리를 잡아(높이 = 폭 ÷ 비율) 그림이 와도 줄이 밀리지 않는다. 비율 클래스는 Aspect Ratio 의 것(aspectRatioVariants)을 그대로 쓴다. 그림은 가운데를 남겨 자른다(cover). 이 밖의 비율(3:4 · 21:9)은 만들지 않는다.",
    jsx: `<ImageFrame ratio="1:1" width={120} src={photo.url} alt="" />
<ImageFrame ratio="2:1" width={120} src={photo.url} alt="" />
<ImageFrame ratio="16:9" width={120} src={photo.url} alt="" />
<ImageFrame width={120} src={photo.url} alt="" />              {/* 4:3 — 기본 */}
<ImageFrame ratio="6:7" width={120} src={photo.url} alt="" />
<ImageFrame ratio="4:5" width={120} src={photo.url} alt="" />
<ImageFrame ratio="2:3" width={120} src={photo.url} alt="" />
<ImageFrame ratio="card" width={120} src={card.imgUrl} alt="" />`,
    render: () =>
      surface(
        row(
          RATIOS.map(([ratio, ko]) =>
            labeled(imageFrame({ ratio, width: 120, src: ratio === "card" ? ART.cardEdition : ART.forest }), `${ratio} — ${ko}<br>120 × ${fmt(120 / HEIGHT[ratio])}`, 120),
          ),
        ),
      ),
  },

  {
    title: "모서리 — 폭으로",
    description:
      "모서리는 틀의 폭으로 고른다(SEED — 24 까지 r1, 48 까지 r1.5, 그 이상 r2) — 24 이하 4 · 48 이하 6 · 그 위 8 · 화면 폭(bleed) 0. 작은 그림일수록 모서리를 줄인다 — 24 그림에 8 을 주면 알약처럼 보인다. width 가 없으면 부모 폭을 채우고 8 이다. 틀 밖에서 같은 모서리가 필요하면(줄이 통째로 기다릴 때의 그림 자리 스켈레톤) imageFrameRadius(폭) 으로 Skeleton 의 radius 를 고른다 — 손으로 고르지 않는다.",
    jsx: `import { Skeleton } from "@/components/ui/skeleton"
import { CardArt, imageFrameRadius } from "@/components/ui/image-frame"

<CardArt width={24} src={card.imgUrl} issuer={card.companyName} name={card.name} />   {/* 4 */}
<CardArt width={40} src={card.imgUrl} issuer={card.companyName} name={card.name} />   {/* 6 */}
<CardArt width={56} src={card.imgUrl} issuer={card.companyName} name={card.name} />   {/* 8 */}

{/* 틀 밖의 그림 자리 — 다 받은 그림과 같은 모서리 */}
<Skeleton radius={imageFrameRadius(40)} className="aspect-[1.586] w-10" />          {/* "6" */}`,
    render: () =>
      surface(
        row(
          [
            ...[24, 40, 48, 56, 150].map((w) => labeled(cardArt({ width: w, src: ART.cardEdition, issuer: "현대카드", name: "M EDITION" }), `${w} → ${imageFrameRadius(w)}`, Math.max(w, 64))),
            labeled(
              `<span data-slot="skeleton" data-radius="${imageFrameRadius(40)}" class="${SK_ROOT} ${SK_RADIUS[imageFrameRadius(40)]} aspect-[1.586] w-10" aria-hidden="true"><span data-slot="skeleton-shimmer" class="${SK_SHIMMER}"></span></span>`,
              `Skeleton "${imageFrameRadius(40)}"`,
              64,
            ),
          ],
          "var(--spacing-x5) var(--spacing-x4)",
          "flex-end",
        ),
      ),
  },

  {
    title: "상태 — 불러오는 중 · 다 받음 · 없음 · 실패",
    description:
      "불러오는 동안은 같은 모서리의 Skeleton(면 bg-neutral-weak + 반짝임)이 틀을 채우고 그림은 보이지 않게(투명도 0) 둔다 — 빈 칸이 없다. 다 받으면 스켈레톤을 걷고 그림이 150ms(motion-duration-d3 · motion-ease-enter)로 나타난다(모션 줄이기면 바로). 그림이 없거나 · 못 불러오거나 · 10초(틀이 화면에 들어온 때부터)가 지나도 안 오면 대체 그림(Content Placeholder — 틀 높이의 50% 아이콘)이고, 그 뒤에 그림이 와도 다시 바꾸지 않는다. 대체 그림은 alt 를 이름으로 이어받는다(role=\"img\" — 실패해도 이름이 남는다). 깨진 그림 아이콘 · alt 글이 보이지 않는다. 윤곽은 스켈레톤 · 대체 그림 위에도 늘이다.",
    jsx: `{/* 받는 동안 — 스켈레톤(틀이 모서리를 자른다) */}
<ImageFrame width={150} src={photo.url} alt="바다 사진" />

{/* 그림이 없다 · 장식 — 대체 그림을 숨긴다 */}
<ImageFrame width={150} src={null} alt="" />

{/* 못 불러옴 · 10초 — 대체 그림이 "바다 사진" 을 이름으로 이어받는다 */}
<ImageFrame width={150} src={brokenUrl} alt="바다 사진" />`,
    render: () =>
      surface(
        row([
          labeled(imageFrame({ width: 150, src: ART.sea, alt: "바다 사진", state: "loading" }), 'data-state="loading"', 150),
          labeled(imageFrame({ width: 150, src: ART.sea, alt: "바다 사진", reveal: true }), 'data-state="loaded"', 150),
          labeled(imageFrame({ width: 150, src: null, alt: "" }), "src 없음 · alt=\"\"", 150),
          labeled(imageFrame({ width: 150, src: ART.sea, alt: "바다 사진", state: "error" }), 'fallback · role="img"', 150),
        ]),
      ),
  },

  {
    title: "카드 면 — 아는 카드사 · 모르는 카드사",
    description:
      "그림이 없거나 못 불러온 카드는 카드사로 가른다. 기관 색 표(institution-colors.yaml — 78곳)에 있는 카드사는 카드 면 — 기관 색 한 색(광택 띠 · 그라디언트 없음, 모드를 따르지 않는다) 위에 표의 글자색이다: 흰 글자가 4.5:1 에 못 미치는 색은 짙은 글자(라이트 fg-neutral · 다크 fg-neutral-inverted — NH농협카드 5.14 · 4.54, KB국민카드)이고 롯데카드는 표가 명도를 고친 #EA1721(흰 글자 4.52)이다. 폭 96 미만은 회사 첫 글자만(로마자 대문자 — \"KB국민카드\" → \"K\"), 그 위는 왼쪽 아래 회사(한 줄 말줄임) · 카드 이름(medium 한 줄 · large 두 줄까지 — 넘치면 말줄임). 표에 없는 카드사(BC카드)는 대체 그림(credit-card)이다 — 브랜드 파랑 · 회색 면으로 회사 색인 척하지 않는다. decorative={false} 면 \"카드사 카드 이름\" 을 읽는다.",
    jsx: `<CardArt width={56} src={null} issuer="KB국민카드" name="톡톡 With" />          {/* "K" — 짙은 글자 */}
<CardArt width={150} src={null} issuer="NH농협카드" name="올원 Pay" />          {/* 회사 · 카드 이름 */}
<CardArt width={150} src={null} issuer="롯데카드" name="LOCA 365" decorative={false} />
<CardArt width={150} src={null} issuer="BC카드" name="바로 카드" />             {/* 표에 없다 — 대체 그림 */}
<CardArt width={282} src={null} issuer="하나카드" name="트래블로그 체크" />      {/* large */}`,
    render: () =>
      surface(
        `${row([
          labeled(cardArt({ width: 56, src: null, issuer: "KB국민카드", name: "톡톡 With" }), "56 — small", 64),
          labeled(cardArt({ width: 150, src: null, issuer: "NH농협카드", name: "올원 Pay" }), "150 — medium · 짙은 글자", 150),
          labeled(cardArt({ width: 150, src: null, issuer: "롯데카드", name: "LOCA 365", decorative: false }), "decorative={false}", 150),
          labeled(cardArt({ width: 150, src: null, issuer: "BC카드", name: "바로 카드" }), "표에 없음 — credit-card", 150),
        ])}<div style="height:var(--spacing-x5);"></div>${labeled(cardArt({ width: 282, src: null, issuer: "하나카드", name: "트래블로그 체크" }), "282 — large", 282)}`,
      ),
  },

  {
    title: "그림 위 요소 — 배지 · Indicator 둘까지",
    description:
      "그림 위에는 네 모서리(top-start · top-end · bottom-start · bottom-end)에 하나씩, 틀 하나에 둘까지 얹는다 — 틀 가장자리에서 6(spacing-x1_5). 상태 · 분류는 배지(Badge variant=\"solid\"), 보기 전에 알면 좋은 장수 · 길이는 ImageFrameIndicator 다 — 바꿔 쓰지 않는다. 셋째 요소 · 같은 자리의 둘째는 그리지 않는다(개발 중에 알린다). 틀의 짧은 변이 80 보다 작으면(목록 56 · 썸네일 40) 그리지 않는다 — 배지 · 장수는 줄의 글로 둔다. 그림 위 요소는 누르지 않는다(pointer-events none). 관심(하트) 버튼 · 점 지시자는 두지 않는다.",
    jsx: `<ImageFrame width={160} src={photo.url} alt="">
  <ImageFrameFloater placement="top-start">
    <Badge variant="solid">대표</Badge>
  </ImageFrameFloater>
  <ImageFrameFloater placement="bottom-end">
    <ImageFrameIndicator label="사진 9장 더 있음">+9</ImageFrameIndicator>
  </ImageFrameFloater>
</ImageFrame>`,
    render: () =>
      surface(
        row([
          labeled(imageFrame({ width: 160, src: ART.forest, alt: "", children: `${floater("top-start", badge("대표"))}${floater("bottom-end", indicator("+9", "사진 9장 더 있음"))}` }), "배지 · Indicator", 160),
          labeled(cardArt({ width: 160, src: ART.cardSelect, issuer: "삼성카드", name: "iD SELECT ALL", portrait: true, children: floater("top-start", badge("단종")) }), "카드 그림 · 단종", 160),
          labeled(cardArt({ width: 56, src: ART.cardEdition, issuer: "현대카드", name: "M EDITION", children: floater("top-start", badge("단종")) }), "56 — 그리지 않는다", 64),
        ]),
      ),
  },
];
