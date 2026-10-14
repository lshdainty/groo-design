/*
 * shadcn Logo Tile 예제 — docs site components/logo-tile.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 넷(자산 줄 · 카드 자산 · 상세 머리 · 회사 로고)은 차례 · 제목 · 코드가
 * specs/components/logo-tile.md 의 "코드" 절과 같고, 뒤의 둘(크기 · 면과 찾기)은 md 의 Properties 를 코드로 더 보인다.
 *
 * ROOT · SIZES · HUE_BG · INSTITUTION_TEXT · INITIAL · LINE_HEIGHT_1 · PLATE · PLATE_BG · LOGO_IMAGE 는 recipes/shadcn/components/ui/logo-tile.tsx 의
 * 상수와, CARD_FRAME_WIDTH · PLATE_HIDDEN · NAME_TEXT 는 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다.
 * 카드 그림 판의 FRAME_* · IMAGE_* 는 image-frame.tsx, RATIO_* 는 aspect-ratio.tsx, 자산 줄의 LIST_* 는 list.tsx(list-examples.mjs)의 것과 같다.
 * avatarInitial · avatarHue 는 avatar.tsx, institutionColor 는 lib/institution-colors.ts, imageFrameRadius 는 image-frame.tsx 의 규칙 함수와 같은 답을 낸다.
 * 기관 색 표는 recipes/shadcn/lib/institution-colors.ts 의 INSTITUTION_COLORS(institution-colors.yaml 에서 만든 표)를 그대로 읽는다.
 * 규칙은 specs/components/logo-tile.md, 수치 원본은 specs/components/logo-tile.yaml · institution-colors.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 타일 <span data-slot="logo-tile" data-face data-image data-status> > 첫 글자 <span data-slot="logo-tile-initial">
 * (면의 색 — 기관 색이면 style 의 background-color) · 그림 판 <span data-slot="logo-tile-plate"> > 카드 그림 틀 <span data-slot="logo-tile-card"> > <img> 또는 로고 <img>.
 * 그림이 다 오면 첫 글자를 걷고 판이 보인다 — 오기 전에는 판을 그려 두되 보이지 않게(invisible) 둔다. 실패하면 판을 걷고 첫 글자 그대로다.
 * 레시피의 스크립트(그림 상태 · 세로 그림의 방향)는 정적 HTML 에 없다 — 그림은 그 순간(data-status)을 멈춘 것이고, 세로 카드 그림은 다 받은 모습으로 그렸다.
 * logo-tile.tsx 는 cn() 으로 합치지만 지워지는 클래스가 없다(줄 높이 leading-none 을 글자 크기 뒤에 붙여 둔 까닭이다) — 그래서 그대로 잇는다.
 * 그림 · 로고는 손으로 칠한 대역(SVG — 가상의 회사)이다 — 실제 카드 그림 · 기관 로고가 아니다.
 */

import { readFileSync } from "node:fs";

// ── logo-tile.tsx 의 상수와 같은 값 ──────────────────────────────────────

// 크기 — 타일 · 모서리(× 0.3) · 첫 글자(40%) · 카드 그림 폭(크기 − 8)
const SIZES = {
  32: { box: "size-[32px] rounded-r2_5", initial: "text-[13px]", card: 24 },
  40: { box: "size-[40px] rounded-r3", initial: "text-[16px]", card: 32 },
  48: { box: "size-[48px] rounded-r3_5", initial: "text-[19px]", card: 40 },
};

// 이름 색 — Avatar 와 같은 차트 10색(avatarHue)
const HUE_BG = {
  blue: "bg-chart-blue",
  green: "bg-chart-green",
  orange: "bg-chart-orange",
  violet: "bg-chart-violet",
  pink: "bg-chart-pink",
  indigo: "bg-chart-indigo",
  red: "bg-chart-red",
  yellow: "bg-chart-yellow",
  brown: "bg-chart-brown",
  gray: "bg-chart-gray",
};

// 기관 색 면의 글자색 — 표의 text
const INSTITUTION_TEXT = {
  white: "text-static-white",
  dark: "text-fg-neutral dark:text-fg-neutral-inverted",
};

// 타일 — 판 · 그림을 모서리로 자른다. ::after 가 안쪽 1px 투명 윤곽(면 · 판 · 그림 위)
const ROOT = [
  "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden align-middle",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-overlay)] after:content-['']",
].join(" ");

// 면 + 첫 글자 — 700 · 줄 높이 1(px)
const INITIAL = "absolute inset-0 flex items-center justify-center font-sans font-bold uppercase";
const LINE_HEIGHT_1 = "leading-none";

// 판 — 그림은 판 안쪽 4. 카드는 옅은 판, 로고는 흰 판(두 모드 같다)
const PLATE = "absolute inset-0 flex items-center justify-center p-x1";
const PLATE_BG = {
  card: "bg-bg-neutral-weak",
  logo: "bg-static-white",
};
const LOGO_IMAGE = "block size-full object-contain";

// ── logo-tile.tsx 의 JSX 에 적힌 클래스 ──────────────────────────────────

// 카드 그림 틀 — 줄지 않는다
const CARD_FRAME_WIDTH = "shrink-0";
// 그림이 다 오기 전의 판 — 그려 두되 보이지 않게(받기는 한다)
const PLATE_HIDDEN = "invisible";
// 이름 색 면의 글자 — 라이트 흰 · 다크 짙은 글자
const NAME_TEXT = "text-fg-neutral-inverted";

// ── image-frame.tsx · aspect-ratio.tsx 의 cva 와 같은 값 — 카드 그림 판의 틀 ──

const FRAME_BASE = [
  "relative isolate block max-w-full overflow-hidden [container-name:image-frame] [container-type:size]",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-overlay)] after:content-['']",
].join(" ");
const FRAME_VARIANTS = { radius: { "4": "rounded-r1", "6": "rounded-r1_5" } };
const FRAME_DEFAULTS = { radius: "8" };
const IMAGE_BASE = "absolute block";
const IMAGE_VARIANTS = {
  rotate: {
    false: "inset-0 size-full",
    true: "left-1/2 top-1/2 h-[158.6%] w-[calc(100%/1.586)] -translate-x-1/2 -translate-y-1/2 rotate-90",
  },
  fit: { cover: "object-cover" },
};
const IMAGE_DEFAULTS = { rotate: false, fit: "cover" };
const RATIO_VARIANTS = { ratio: { card: "aspect-[1.586]" } };
const RATIO_DEFAULTS = { ratio: "4:3" };

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
const LIST_BODY_BASE = "flex min-w-0 flex-1 flex-col items-start gap-x0_5 pr-x2_5 text-left";
const LIST_TITLE_BASE = "font-sans text-t5 font-normal text-fg-neutral";
const LIST_TITLE_VARIANTS = { disabled: { true: "text-fg-disabled", false: "" } };
const LIST_TITLE_DEFAULTS = { disabled: false };
const LIST_HIGHLIGHT_MUTED =
  "[@media(hover:hover)]:group-has-[[data-list-action]:not([data-disabled]):hover]/list-item:text-fg-neutral-muted group-has-[[data-list-action]:not([data-disabled]):active]/list-item:text-fg-neutral-muted";
const LIST_DETAIL_BASE = "font-sans text-t3 text-fg-neutral-subtle";
const LIST_DETAIL_VARIANTS = {
  disabled: { true: "text-fg-disabled", false: "" },
  highlighted: { true: LIST_HIGHLIGHT_MUTED, false: "" },
};
const LIST_DETAIL_DEFAULTS = { disabled: false, highlighted: false };
const LIST_SUFFIX_BASE =
  "flex shrink-0 items-center gap-x1 font-sans text-t5 text-fg-neutral-subtle [&>svg]:size-[18px] [&_a]:relative [&_a]:z-[1] [&_button]:relative [&_button]:z-[1]";
const LIST_SUFFIX_VARIANTS = {
  disabled: { true: "text-fg-disabled", false: "" },
  highlighted: { true: LIST_HIGHLIGHT_MUTED, false: "" },
};
const LIST_SUFFIX_COMPOUND = [{ disabled: false, highlighted: true, class: "[&>svg]:text-fg-neutral-subtle" }];
const LIST_SUFFIX_DEFAULTS = { disabled: false, highlighted: false };
const LIST_ACTION_BASE = [
  "cursor-pointer appearance-none border-0 bg-transparent p-0 font-[inherit] text-[inherit] no-underline outline-none",
  "after:absolute after:inset-0 after:content-['']",
  "focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-stroke-focus-ring",
  "data-[disabled]:cursor-not-allowed",
].join(" ");

// ── 기관 색 표 — lib/institution-colors.ts 의 INSTITUTION_COLORS 를 그대로 읽는다 ─────
// 정적 미리보기는 TS 를 불러오지 못해 표의 글자(institution-colors.yaml 에서 만든 배열)를 풀어 쓴다
const INSTITUTION_COLORS = new Function(
  `return ${/export const INSTITUTION_COLORS[^=]*=\s*(\[[\s\S]*?\n\]);/.exec(readFileSync(new URL("../lib/institution-colors.ts", import.meta.url), "utf8"))[1]};`,
)();

// ── 레시피의 규칙 함수와 같은 답 ─────────────────────────────────────────

// 공백을 모두 뺀다 — 찾는 이름과 표의 name · aliases 모두(lib/institution-colors.ts)
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

const AVATAR_HUES = ["blue", "green", "orange", "violet", "pink", "indigo", "red", "yellow", "brown", "gray"];
const displayName = (name) => String(name).trim();
const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });

/** 이니셜 — 표시 이름의 첫 글자 하나(사용자가 보는 글자 단위), 로마자는 대문자. 이름이 비면 "" (avatar.tsx) */
function avatarInitial(name) {
  const shown = displayName(name);
  if (shown === "") return "";
  return (graphemes.segment(shown)[Symbol.iterator]().next().value?.segment ?? "").toUpperCase();
}

/** 이름 색 — 표시 이름의 유니코드 코드 포인트 합 % 10 → 차트 10색(v110 순서). 이름이 비면 gray (avatar.tsx) */
function avatarHue(name) {
  const shown = displayName(name);
  if (shown === "") return "gray";
  let sum = 0;
  for (const ch of shown) sum += ch.codePointAt(0) ?? 0;
  return AVATAR_HUES[sum % 10] ?? "gray";
}

/** 폭 → 모서리(SEED) — 24 이하 "4" · 48 이하 "6" · 그 위 "8". 폭을 모르면(부모 폭을 채운다) "8" (image-frame.tsx) */
function imageFrameRadius(width) {
  if (width == null || Number.isNaN(width)) return "8";
  return width <= 24 ? "4" : width <= 48 ? "6" : "8";
}

// ── cva 풀이 ──────────────────────────────────────────────────────────────

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
const imageFrameImageVariants = cvaOf(IMAGE_BASE, { variants: IMAGE_VARIANTS, defaultVariants: IMAGE_DEFAULTS });
const aspectRatioVariants = cvaOf("", { variants: RATIO_VARIANTS, defaultVariants: RATIO_DEFAULTS });
const listVariants = cvaOf(LIST_BASE);
const listItemVariants = cvaOf(LIST_ITEM_BASE, { variants: LIST_ITEM_VARIANTS, defaultVariants: LIST_ITEM_DEFAULTS });
const listContentVariants = cvaOf(LIST_CONTENT_BASE, { variants: LIST_CONTENT_VARIANTS, defaultVariants: LIST_CONTENT_DEFAULTS });
const listPrefixVariants = cvaOf(LIST_PREFIX_BASE, { variants: LIST_PREFIX_VARIANTS, defaultVariants: LIST_PREFIX_DEFAULTS });
const listBodyVariants = cvaOf(LIST_BODY_BASE);
const listTitleVariants = cvaOf(LIST_TITLE_BASE, { variants: LIST_TITLE_VARIANTS, defaultVariants: LIST_TITLE_DEFAULTS });
const listDetailVariants = cvaOf(LIST_DETAIL_BASE, { variants: LIST_DETAIL_VARIANTS, defaultVariants: LIST_DETAIL_DEFAULTS });
const listSuffixVariants = cvaOf(LIST_SUFFIX_BASE, { variants: LIST_SUFFIX_VARIANTS, compoundVariants: LIST_SUFFIX_COMPOUND, defaultVariants: LIST_SUFFIX_DEFAULTS });
const listActionVariants = cvaOf(LIST_ACTION_BASE);

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// 그림 재료 — 손으로 칠한 대역(SVG). 세로 카드 그림(540 × 856) · 가로 카드 그림(856 × 540) · 가상의 회사 로고(흰 바탕에 맞춘 검은 마크)
const uri = (w, h, body) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`)}`;
const ART = {
  cardSelect: uri(540, 856, `<defs><linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e52d27"/><stop offset="1" stop-color="#7b1fa2"/></linearGradient></defs><rect width="540" height="856" fill="url(#c)"/><rect x="76" y="72" width="150" height="104" rx="14" fill="#d9b44a"/><text transform="translate(300 470) rotate(-90)" text-anchor="middle" font-family="sans-serif" font-size="76" font-weight="800" letter-spacing="5" fill="#ffffff">SELECT ALL</text>`),
  cardEdition: uri(856, 540, `<defs><linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c1c1c"/><stop offset="1" stop-color="#5a5a5a"/></linearGradient></defs><rect width="856" height="540" fill="url(#c)"/><rect x="72" y="150" width="120" height="92" rx="14" fill="#d9b44a"/><text x="790" y="470" text-anchor="end" font-family="sans-serif" font-size="64" font-weight="800" letter-spacing="3" fill="#ffffff">M EDITION</text>`),
  logoHanbit: uri(360, 120, `<circle cx="60" cy="60" r="38" fill="none" stroke="#111111" stroke-width="10"/><path d="M60 36c14 8 18 28 0 46-18-18-14-38 0-46Z" fill="#1e7d4c"/><text x="118" y="78" font-family="sans-serif" font-size="46" font-weight="800" letter-spacing="2" fill="#111111">HANBIT</text>`),
  logoDaon: uri(360, 120, `<path d="M60 20 95 40v40L60 100 25 80V40Z" fill="none" stroke="#111111" stroke-width="10"/><circle cx="60" cy="60" r="12" fill="#111111"/><text x="118" y="78" font-family="sans-serif" font-size="46" font-weight="800" letter-spacing="2" fill="#111111">DAON</text>`),
};

// <LogoTile> — logo-tile.tsx 그대로. status 는 그림의 그 순간(loading · loaded · error — 그림이 없으면 none), portrait 는 다 받은 카드 그림이 세로인지
function logoTile({ name, face = "institution", size = 40, src, imageType = "logo", decorative = true, status, portrait = false, className = "" }) {
  const shown = name.trim();
  const institution = face === "institution" ? institutionColor(shown) : null;
  const image = src != null && src !== "" ? src : undefined;
  const state = image ? (status ?? "loaded") : "none";
  const covered = image != null && state === "loaded";
  const hidden = decorative || shown === "";
  const box = SIZES[size];
  const root = attrs([
    'data-slot="logo-tile"',
    `data-face="${institution ? "institution" : "name"}"`,
    `data-image="${image ? imageType : "none"}"`,
    `data-status="${state}"`,
    !hidden && 'role="img"',
    !hidden && `aria-label="${esc(shown)}"`,
    hidden && 'aria-hidden="true"',
    `class="${[ROOT, box.box, className].filter(Boolean).join(" ")}"`,
  ]);
  const initial = covered
    ? ""
    : `<span ${attrs([
        'aria-hidden="true"',
        'data-slot="logo-tile-initial"',
        `class="${[INITIAL, institution ? INSTITUTION_TEXT[institution.text] : `${HUE_BG[avatarHue(shown)]} ${NAME_TEXT}`, box.initial, LINE_HEIGHT_1].join(" ")}"`,
        institution && `style="background-color:${institution.color}"`,
      ])}>${esc(avatarInitial(shown))}</span>`;
  let plate = "";
  if (image && state !== "error") {
    const picture =
      imageType === "card"
        ? `<span data-slot="logo-tile-card" class="${imageFrameVariants({ radius: imageFrameRadius(box.card) })} ${aspectRatioVariants({ ratio: "card" })} ${CARD_FRAME_WIDTH}" style="width:${box.card}px"><img data-slot="logo-tile-image" src="${image}" alt="" class="${imageFrameImageVariants({ rotate: covered && portrait })}"></span>`
        : `<img data-slot="logo-tile-image" src="${image}" alt="" class="${LOGO_IMAGE}">`;
    plate = `<span data-slot="logo-tile-plate" class="${[PLATE, PLATE_BG[imageType], !covered && PLATE_HIDDEN].filter(Boolean).join(" ")}">${picture}</span>`;
  }
  return `<span ${root}>${initial}${plate}</span>`;
}

// <ListButtonItem> — 줄 전체가 버튼(앞 · 제목 · 설명 · 뒤)
function listButtonItem({ title, detail, prefix, suffix }) {
  const body = `<span class="${listTitleVariants()}">${esc(title)}</span>${detail ? `<span class="${listDetailVariants()}">${esc(detail)}</span>` : ""}`;
  return `<li class="${listItemVariants()}"><div class="${listContentVariants()}"><span class="${listPrefixVariants()}">${prefix}</span><button type="button" data-list-action="" class="${listActionVariants()} ${listBodyVariants()}">${body}</button>${suffix ? `<span class="${listSuffixVariants()}">${suffix}</span>` : ""}</div></li>`;
}

// 흰 표면 · 폰 화면 · 줄 · 이름표 — 미리보기 틀(레시피가 아니다)
const SURFACE =
  "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5); color:var(--color-fg-neutral); font-family:var(--font-sans);";
const surface = (html, extra = "") => `<div style="${SURFACE}${extra}">${html}</div>`;
const SCREEN =
  "max-width:360px; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) 0; color:var(--color-fg-neutral); font-family:var(--font-sans);";
const screen = (html) => `<div style="${SCREEN}">${html}</div>`;
const row = (items, gap = "var(--spacing-x5) var(--spacing-x4)") => `<div style="display:flex; flex-wrap:wrap; align-items:flex-start; gap:${gap};">${items.join("")}</div>`;
const CAPTION =
  "font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const labeled = (html, caption, width = 132) =>
  `<div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--spacing-x2); width:${width}px; max-width:100%; min-width:0;">${html}<span style="${CAPTION}">${caption}</span></div>`;
const SCREEN_TITLE = `<div style="margin:0; padding:0 var(--spacing-global-gutter) var(--spacing-x2); font-family:var(--font-sans); font-size:var(--text-t7); line-height:var(--text-t7--line-height); font-weight:700; color:var(--color-fg-neutral);">`;
const AMOUNT = "font-weight:700; color:var(--color-fg-neutral); font-variant-numeric:tabular-nums;";

// ── 화면 예시의 값 ────────────────────────────────────────────────────────

// 자산 — 기관이 있으면 기관 이름으로 표를 찾고, 없으면 자산 이름(face="name")
const ASSETS = [
  { assetName: "신한 주거래", institution: "신한", typeLabel: "입출금", balance: "1,284,000원" },
  { assetName: "KB 청년 적금", institution: "KB국민", typeLabel: "적금", balance: "3,600,000원" },
  { assetName: "키움 주식 계좌", institution: "키움증권", typeLabel: "증권", balance: "7,412,500원" },
  { assetName: "업비트", institution: "업비트", typeLabel: "코인", balance: "523,180원" },
  { assetName: "비상금", institution: null, typeLabel: "현금", balance: "300,000원" },
];
// 찾기 — logo-tile.md 의 예시 이름(같은 답을 앱도 시험한다)
const LOOKUPS = [
  { name: "신한" },
  { name: "NH농협카드 올원" },
  { name: "IBK기업은행" },
  { name: "비상금", face: "name" },
  { name: "우리 아이 적금", face: "name" },
];

// ── 예제 ──────────────────────────────────────────────────────────────────

export const logoTileExamples = [
  {
    title: "자산 줄 — 40",
    description:
      "자산 줄의 앞은 Logo Tile 40(모서리 12 · 첫 글자 16 · 700)이다 — List 의 타일과 같은 크기 · 모서리다. 이름은 기관이 있으면 기관 이름(신한 · KB국민 · 키움증권 · 업비트)이라 기관 색 표에서 그 색 면 + 표의 글자색을 찾고(KB국민은 노랑이라 짙은 글자, 키움증권은 표가 명도를 고친 #ED022F), 기관이 없는 자산(비상금)은 자산 이름이고 표를 보지 않아(face=\"name\") Avatar 와 같은 이름 색(차트 10색) + fg-neutral-inverted 다. 첫 글자는 이름의 첫 글자 하나(로마자 대문자). 옆에 이름이 있어 타일은 장식이다(decorative 기본 — 첫 글자를 읽지 않는다). 투명 윤곽(stroke-neutral-overlay)이 노랑 · 짙은 남색 타일의 둘레를 잡는다.",
    jsx: `import { ListButtonItem } from "@/components/ui/list"
import { LogoTile } from "@/components/ui/logo-tile"

{/* 이름은 기관 이름, 없으면 자산 이름(그때는 표를 보지 않는다) — 옆에 이름이 있어 타일은 장식(decorative 기본) */}
<ListButtonItem
  prefix={<LogoTile name={asset.institution ?? asset.assetName} face={asset.institution ? "institution" : "name"} />}
  title={asset.assetName}
  detail={[asset.institution, asset.typeLabel].filter(Boolean).join(" · ")}
  suffix={formatWon(asset.balance)}
  onClick={() => openAsset(asset.id)}
/>`,
    render: () =>
      screen(
        `${SCREEN_TITLE}자산</div><ul class="${listVariants()}">${ASSETS.map((asset) =>
          listButtonItem({
            prefix: logoTile({ name: asset.institution ?? asset.assetName, face: asset.institution ? "institution" : "name" }),
            title: asset.assetName,
            detail: [asset.institution, asset.typeLabel].filter(Boolean).join(" · "),
            suffix: `<span style="${AMOUNT}">${esc(asset.balance)}</span>`,
          }),
        ).join("")}</ul>`,
      ),
  },

  {
    title: "카드 자산 — 카드 그림",
    description:
      "그림이 있는 물건(카드)은 첫 글자 타일을 먼저 그리고 그림이 다 오면 판과 그림이 덮는다 — 전환 없이 바로(Avatar 와 같다), 스켈레톤을 따로 두지 않는다(줄의 이름 · 금액은 이미 와 있다). 못 불러오면 첫 글자 그대로라 깨진 그림 · 빈 칸이 보이지 않는다. 카드 그림은 옅은 판(bg-neutral-weak · 안쪽 4) 위에 카드 비율(1.586)의 Image Frame(40 → 32 × 20 · 모서리 6 · 투명 윤곽)으로 카드 전체를 보이고, 세로 그림은 시계 방향 90° 돌려 채운다 — 정사각에 잘라 넣으면 카드의 63% 만 보인다. 그림의 alt 는 늘 \"\" 다.",
    jsx: `<LogoTile name={asset.cardCatalog.companyName} src={asset.cardCatalog.imgUrl} imageType="card" />`,
    render: () =>
      surface(
        row([
          labeled(logoTile({ name: "삼성카드", src: ART.cardSelect, imageType: "card", status: "loading" }), 'data-status="loading" — 첫 글자 먼저'),
          labeled(logoTile({ name: "삼성카드", src: ART.cardSelect, imageType: "card", portrait: true }), 'data-status="loaded" — 덮는다 · 세로는 돌림'),
          labeled(logoTile({ name: "삼성카드", src: ART.cardSelect, imageType: "card", status: "error" }), 'data-status="error" — 첫 글자 그대로'),
          labeled(logoTile({ name: "현대카드", src: ART.cardEdition, imageType: "card" }), "가로 그림 — 그대로"),
        ]),
      ),
  },

  {
    title: "상세 머리 — 48",
    description:
      "자산 상세 머리는 Logo Tile 48(모서리 14 · 첫 글자 19)이다 — 이 밖의 크기(36 · 52)를 만들지 않는다. 이름 · 면 규칙은 줄과 같다. 머리의 제목이 자산 이름을 말하므로 타일은 장식이다.",
    jsx: `<LogoTile size={48} name={asset.institution ?? asset.assetName} face={asset.institution ? "institution" : "name"} />`,
    render: () =>
      surface(
        `<div style="display:flex; align-items:center; gap:var(--spacing-x3);">${logoTile({ size: 48, name: "신한" })}<div style="display:flex; flex-direction:column; gap:var(--spacing-x0_5);"><span style="font-size:var(--text-t7); line-height:var(--text-t7--line-height); font-weight:700; color:var(--color-fg-neutral);">신한 주거래</span><span style="font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle);">신한 · 입출금</span></div></div>`,
        " max-width:360px;",
      ),
  },

  {
    title: "회사 로고 — 32 · 흰 판",
    description:
      "HR 회사별 인원의 회사 로고는 Logo Tile 32(모서리 10 · 첫 글자 13)다. 로고 그림은 흰 판(static-white — 두 모드 같다 · 안쪽 4) 위에 잘리지 않게(contain) 둔다 — 다크에서도 로고의 검은 부분이 사라지지 않는다. 회사는 기관이 아니라 face=\"name\" 이다 — 로고가 없거나 못 불러오면 회사 이름의 첫 글자 · 이름 색이다(깨진 그림 아이콘 + \"새회사 logo\" 글이 칸을 넘치지 않는다). 바로 옆 제목이 회사 이름이라 타일은 장식이다(\"{회사} logo\" 를 두 번 읽지 않는다).",
    jsx: `{/* 회사는 기관이 아니다 — 표를 보지 않고, 로고 그림이 없거나 못 불러오면 회사 이름의 첫 글자 · 이름 색 */}
<span className="flex items-center gap-x2">
  <LogoTile size={32} name={company.name} face="name" src={company.logoUrl} imageType="logo" />
  <h3>{company.name}</h3>
</span>`,
    render: () =>
      surface(
        `<div style="display:flex; flex-direction:column; gap:var(--spacing-x4);">${[
          ["한빛상사", ART.logoHanbit, undefined],
          ["다온테크", ART.logoDaon, "error"],
          ["새회사", null, undefined],
        ]
          .map(
            ([name, src, status]) =>
              `<span class="flex items-center gap-x2">${logoTile({ size: 32, name, face: "name", src, imageType: "logo", status })}<h3 style="margin:0; font-size:var(--text-t5); line-height:var(--text-t5--line-height); font-weight:700; color:var(--color-fg-neutral);">${esc(name)}</h3></span>`,
          )
          .join("")}</div>`,
        " max-width:360px;",
      ),
  },

  {
    title: "크기 — 32 · 40 · 48",
    description:
      "크기는 List 의 타일과 같은 셋이다 — 40(기본 · 목록 줄) · 48(상세 머리) · 32(좁은 줄 · 카드 옆 회사 표시). 모서리는 크기 × 0.3(10 · 12 · 14 — radius-r2_5 · r3 · r3_5), 첫 글자는 크기의 40%(13 · 16 · 19)이고 글자 크기 설정을 따르지 않는 px 다(타일 안에서 넘치지 않게). 카드 그림의 폭은 크기 − 8(24 · 32 · 40)이고 모서리는 그 폭으로 4 · 6 · 6 이다.",
    jsx: `<LogoTile size={32} name="신한" />
<LogoTile name="신한" />          {/* 40 — 기본 */}
<LogoTile size={48} name="신한" />`,
    render: () =>
      surface(
        row(
          [32, 40, 48].map((s) => labeled(logoTile({ size: s, name: "신한" }), `${s} · 모서리 ${{ 32: 10, 40: 12, 48: 14 }[s]} · 글자 ${{ 32: 13, 40: 16, 48: 19 }[s]}`, 120)),
        ),
      ),
  },

  {
    title: "면과 찾기 — 기관 색 · 이름 색",
    description:
      "face=\"institution\"(기본)은 기관 색 표에서 찾는다 — 공백을 빼고 같은 이름 · 별칭이면 그 기관(\"신한\"), 아니면 이름에 든 가장 긴 이름(\"NH농협카드 올원\" → NH농협카드 · \"IBK기업은행\" → IBK기업), 없으면 이름 색이다. 글자는 표의 text — 흰 글자가 4.5:1 에 못 미치면 짙은 글자(라이트 fg-neutral · 다크 fg-neutral-inverted)라 78곳 모두 4.52 이상이다. 기관 색은 모드를 따르지 않는다. 사용자가 지은 자산 이름 · HR 회사 이름은 face=\"name\" 이다 — 표를 보지 않아 \"우리 아이 적금\" 이 우리은행 색이 되지 않는다. 혼자인 타일(decorative={false})은 role=\"img\" + 이름 하나다.",
    jsx: `<LogoTile name="신한" />                              {/* 신한 #0046FF · 흰 글자 */}
<LogoTile name="NH농협카드 올원" />                   {/* 든 가장 긴 이름 — NH농협카드 · 짙은 글자 */}
<LogoTile name="IBK기업은행" />                       {/* IBK기업 */}
<LogoTile name="비상금" face="name" />               {/* 이름 색 indigo */}
<LogoTile name="우리 아이 적금" face="name" decorative={false} />`,
    render: () =>
      surface(
        row(
          LOOKUPS.map(({ name, face }, i) => {
            const found = face === "name" ? null : institutionColor(name);
            const caption = found ? `→ ${found.name} ${found.color} · ${found.text}` : `→ 이름 색 ${avatarHue(name)}`;
            return labeled(logoTile({ name, face, decorative: i !== LOOKUPS.length - 1 }), `"${esc(name)}" ${caption}`, 132);
          }),
        ),
      ),
  },
];
