/*
 * shadcn Avatar 예제 — docs site components/avatar.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 넷(이름 옆 · 혼자 · 묶음 · 사진 바꾸기)은 차례 · 제목 · 코드가 specs/components/avatar.md 의
 * "코드" 절과 같고, 뒤의 셋(크기 10단계 · 이니셜과 이름 색 · 묶음 크기와 놓인 바탕)은 md 의 Properties 를 코드로 더 보인다.
 * 사진 바꾸기(2026-10-15 마무리 6A)의 UPLOAD 는 avatar.tsx 의 상수, 올리는 중 원의 PC_* 는 progress-circle.tsx, "사진 바꾸기" · "사진 지우기" 의 BUTTON_* 는
 * button.tsx(neutralWeak · ghost · small), 둘레의 FIELD_* 는 field.tsx 의 값이다.
 * 옛 예제(32 · 40 · 48 · 64 · 회색 · 브랜드 채움 이니셜 · 8 겹침 + 2px 링)를 대신한다.
 *
 * ROOT · INITIAL · LINE_HEIGHT_1 · HUE_BG · IMAGE · SIZES · STACK_RING · STACK_SIZES · STACK · STACK_SURFACE · OVERFLOW 는
 * recipes/shadcn/components/ui/avatar.tsx 의 상수와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. avatarInitial · avatarHue 는 그 파일의
 * 규칙 함수와 같은 답을 낸다(김민수 → blue "김" · 이서연 → brown "이" · Kim Minsu → indigo "K").
 * 규칙은 specs/components/avatar.md, 수치 원본은 specs/components/avatar.yaml · avatar-stack.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 아바타 <span data-slot="avatar" data-status> > 이니셜 <span aria-hidden data-slot="avatar-initial"> 또는
 * 사진 <img data-slot="avatar-image" alt="">, 묶음 <span data-slot="avatar-stack"> > 아바타 … + "+N" <span aria-hidden data-slot="avatar-stack-overflow">.
 * 사진은 다 불러온 모습(data-status="loaded" — 이니셜을 걷었다)으로 그렸다. 레시피의 사진 상태(불러오는 동안 · 실패하면 이니셜)는 정적 HTML 에 없다.
 * 사진은 실제 사람이 아니라 사람 사진처럼 칠한 그림(SVG)이다. avatar.tsx 는 cn() 으로 합치지만 지워지는 클래스가 없다 — 줄 높이(leading-none)를
 * 글자 크기 뒤에 붙여 둔 까닭이다. 그래서 그대로 잇는다. 아바타는 누르지 않아 스크립트가 없다.
 */

// ── avatar.tsx 의 상수와 같은 값 ─────────────────────────────────────────

// 원 — 사진 · 이니셜을 원으로 자른다. ::after 가 1px 안쪽 투명 테두리 stroke-neutral-overlay(v118 — 사진 · 이니셜 위)
const ROOT = [
  "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full align-middle",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-overlay)] after:content-['']",
].join(" ");

// 이니셜 — 이름 색 바탕 · fg-neutral-inverted · 700 · 줄 높이 1(px — 글자 크기 설정을 따르지 않는다). cn(INITIAL, HUE_BG[색], SIZES[크기].initial, LINE_HEIGHT_1)
const INITIAL = "flex size-full items-center justify-center font-sans font-bold uppercase text-fg-neutral-inverted";
const LINE_HEIGHT_1 = "leading-none";
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

const IMAGE = "absolute inset-0 size-full object-cover";

// 올리는 중 — 원 위 딤(라이트 0.50 · 다크 0.65) 가운데 값 있는 원 24(staticWhite). 1px 테두리(::after)는 이 위에 그려진다
const UPLOAD = "absolute inset-0 flex items-center justify-center rounded-full bg-[var(--overlay-dim-light)] dark:bg-[var(--overlay-dim-dark)]";

// 크기 — 지름 · 이니셜 글자(지름의 40%, 가장 작아도 10)
const SIZES = {
  20: { box: "size-[20px]", initial: "text-[10px]" },
  24: { box: "size-[24px]", initial: "text-[10px]" },
  36: { box: "size-[36px]", initial: "text-[14px]" },
  42: { box: "size-[42px]", initial: "text-[17px]" },
  48: { box: "size-[48px]", initial: "text-[19px]" },
  56: { box: "size-[56px]", initial: "text-[22px]" },
  64: { box: "size-[64px]", initial: "text-[26px]" },
  80: { box: "size-[80px]", initial: "text-[32px]" },
  96: { box: "size-[96px]", initial: "text-[38px]" },
  108: { box: "size-[108px]", initial: "text-[43px]" },
};

// 묶음 안 — 놓인 바탕색 링(바깥 box-shadow, 두께 · 색은 묶음이 정한다)
const STACK_RING = "shadow-[0_0_0_var(--avatar-stack-ring-width)_var(--avatar-stack-ring-color)]";

// 묶음 — 겹침(다음 아바타의 왼쪽 바깥 여백, 지름의 약 1/4) · 링 두께 · "+N" 크기 · 글자(지름의 36%, 가장 작아도 10)
const STACK_SIZES = {
  20: { root: "[--avatar-stack-ring-width:1px] [&>*+*]:-ml-[5px]", overflow: "size-[20px] text-[10px]" },
  24: { root: "[--avatar-stack-ring-width:1px] [&>*+*]:-ml-[6px]", overflow: "size-[24px] text-[10px]" },
  36: { root: "[--avatar-stack-ring-width:2px] [&>*+*]:-ml-[8px]", overflow: "size-[36px] text-[13px]" },
  42: { root: "[--avatar-stack-ring-width:2px] [&>*+*]:-ml-[10px]", overflow: "size-[42px] text-[15px]" },
  48: { root: "[--avatar-stack-ring-width:2px] [&>*+*]:-ml-[12px]", overflow: "size-[48px] text-[17px]" },
  56: { root: "[--avatar-stack-ring-width:3px] [&>*+*]:-ml-[13px]", overflow: "size-[56px] text-[20px]" },
  64: { root: "[--avatar-stack-ring-width:3px] [&>*+*]:-ml-[16px]", overflow: "size-[64px] text-[23px]" },
  80: { root: "[--avatar-stack-ring-width:4px] [&>*+*]:-ml-[20px]", overflow: "size-[80px] text-[29px]" },
  96: { root: "[--avatar-stack-ring-width:5px] [&>*+*]:-ml-[24px]", overflow: "size-[96px] text-[35px]" },
  108: { root: "[--avatar-stack-ring-width:5px] [&>*+*]:-ml-[27px]", overflow: "size-[108px] text-[39px]" },
};

const STACK = "inline-flex shrink-0 items-center align-middle";
const STACK_SURFACE = {
  default: "[--avatar-stack-ring-color:var(--color-bg-layer-default)]",
  floating: "[--avatar-stack-ring-color:var(--color-bg-layer-floating)]",
};

// "+N" 원 — 아바타와 같은 크기 · 같은 링, 옅은 면 + 숫자. cn(OVERFLOW, STACK_SIZES[크기].overflow, LINE_HEIGHT_1)
const OVERFLOW = [
  "relative inline-flex shrink-0 select-none items-center justify-center rounded-full bg-bg-neutral-weak font-sans font-bold text-fg-neutral-muted",
  STACK_RING,
].join(" ");

// ── avatar.tsx 의 규칙 함수와 같은 답 ─────────────────────────────────────

const AVATAR_HUES = ["blue", "green", "orange", "violet", "pink", "indigo", "red", "yellow", "brown", "gray"];
const displayName = (name) => String(name).trim();
const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });

/** 이니셜 — 표시 이름의 첫 글자 하나(사용자가 보는 글자 단위), 로마자는 대문자. 이름이 비면 "" */
function avatarInitial(name) {
  const shown = displayName(name);
  if (shown === "") return "";
  return (graphemes.segment(shown)[Symbol.iterator]().next().value?.segment ?? "").toUpperCase();
}

/** 이름 색 — 표시 이름의 유니코드 코드 포인트 합 % 10 → 차트 10색(v110 순서). 이름이 비면 gray */
function avatarHue(name) {
  const shown = displayName(name);
  if (shown === "") return "gray";
  let sum = 0;
  for (const ch of shown) sum += ch.codePointAt(0) ?? 0;
  return AVATAR_HUES[sum % 10] ?? "gray";
}
const codePointSum = (name) => [...displayName(name)].reduce((a, ch) => a + ch.codePointAt(0), 0);

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// 사진 자리 — 사람 사진처럼 칠한 그림(실제 사람 · 사진이 아니다)
function photo(n = 0) {
  const sets = [["#b9c9d9", "#7d8fa3", "#3d342e"], ["#e3c9b0", "#c19a7a", "#2b2320"], ["#cfd8c8", "#94a38b", "#4a3a2c"]];
  const [a, b, hair] = sets[n % sets.length];
  const art = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="96" height="96" fill="url(#g)"/><circle cx="48" cy="40" r="18" fill="#f1d5bd"/><path d="M29 37c0-13 9-20 19-20s19 7 19 20c-4-4-10-6-19-6s-15 2-19 6Z" fill="${hair}"/><path d="M12 96c0-21 16-35 36-35s36 14 36 35Z" fill="#f4f4f4"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(art)}`;
}

// <Avatar> — avatar.tsx 그대로. 사진은 다 불러온 모습(이니셜 없음). decorative 면 aria-hidden, 아니면 role="img" + 이름.
// stack 은 묶음의 문맥(크기를 따르고 링을 두르고 따로 읽지 않는다)
function avatar({ name, src, size = 48, decorative = true }, stack = null) {
  const s = stack?.size ?? size;
  const shown = displayName(name);
  const hidden = decorative || stack != null;
  const root = [
    'data-slot="avatar"',
    `data-status="${src ? "loaded" : "none"}"`,
    !hidden && 'role="img"',
    !hidden && `aria-label="${esc(shown)}"`,
    hidden && 'aria-hidden="true"',
    `class="${[ROOT, SIZES[s].box, stack && STACK_RING].filter(Boolean).join(" ")}"`,
  ].filter(Boolean).join(" ");
  const inner = src
    ? `<img data-slot="avatar-image" src="${src}" alt="" class="${IMAGE}">`
    : `<span aria-hidden="true" data-slot="avatar-initial" class="${INITIAL} ${HUE_BG[avatarHue(shown)]} ${SIZES[s].initial} ${LINE_HEIGHT_1}">${esc(avatarInitial(shown))}</span>`;
  return `<span ${root}>${inner}</span>`;
}

// <AvatarStack> — avatar.tsx 그대로. 앞 max 명 + "+N"(99 를 넘으면 "+99"). ariaLabel 이 있으면 그림 하나(role="img"), 없으면 aria-hidden
function avatarStack({ size = 24, max = 4, surface = "default", ariaLabel, people }) {
  const limit = Math.max(1, Math.floor(max));
  const shown = people.slice(0, limit);
  const rest = people.length - shown.length;
  const root = [
    'data-slot="avatar-stack"',
    ariaLabel ? 'role="img"' : 'aria-hidden="true"',
    `class="${STACK} ${STACK_SIZES[size].root} ${STACK_SURFACE[surface]}"`,
    ariaLabel && `aria-label="${esc(ariaLabel)}"`,
  ].filter(Boolean).join(" ");
  const more = rest > 0 ? `<span aria-hidden="true" data-slot="avatar-stack-overflow" class="${OVERFLOW} ${STACK_SIZES[size].overflow} ${LINE_HEIGHT_1}">+${Math.min(rest, 99)}</span>` : "";
  return `<span ${root}>${shown.map((p) => avatar(p, { size })).join("")}${more}</span>`;
}

// 흰 표면 · 폰 화면 · 이름표 — 미리보기 틀(레시피가 아니다)
const SURFACE =
  "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-x6); color:var(--color-fg-neutral); font-family:var(--font-sans);";
const surface = (html, extra = "") => `<div style="${SURFACE}${extra}">${html}</div>`;
const SCREEN =
  "max-width:360px; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x3) var(--spacing-global-gutter); color:var(--color-fg-neutral); font-family:var(--font-sans);";
const screen = (html) => `<div style="${SCREEN}">${html}</div>`;
const stack = (items, gap = "var(--spacing-x4)") => `<div style="display:flex; flex-direction:column; gap:${gap};">${items.join("")}</div>`;
const row = (items, gap = "var(--spacing-x4)", align = "flex-end") => `<div style="display:flex; flex-wrap:wrap; align-items:${align}; gap:${gap};">${items.join("")}</div>`;
const CAPTION = "font-size:var(--text-t2); line-height:var(--text-t2--line-height); font-weight:400; color:var(--color-fg-neutral-subtle);";
const CODE = `${CAPTION} font-family:ui-monospace, SFMono-Regular, Menlo, monospace;`;
const labeled = (html, caption, style = CODE, align = "center") =>
  `<div style="display:flex; flex-direction:column; align-items:${align}; gap:var(--spacing-x1_5); min-width:0; text-align:${align === "center" ? "center" : "left"};">${html}<span style="${style}">${caption}</span></div>`;
const NAME = "font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const SUB = "font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle);";

// ── 사진 바꾸기 자리의 둘레 — progress-circle.tsx · button.tsx · field.tsx 의 값 ───────────────

// 올리는 중 원 — <ProgressCircle size="24" tone="staticWhite" value aria-label="프로필 사진 올리는 중" />
const PC_SIZE = { 24: "[--pc-size:24px] [--pc-thickness:3px]" };
const PC_TONE = { staticWhite: "[--pc-track:color-mix(in_srgb,var(--color-static-white)_30%,transparent)] [--pc-range:var(--color-static-white)]" };
const PC_ROOT = "inline-block shrink-0 overflow-visible align-middle";
const PC_CIRCLE =
  "fill-none [cx:calc(var(--pc-size)/2)] [cy:calc(var(--pc-size)/2)] [r:calc(var(--pc-size)/2_-_var(--pc-thickness)/2)] [stroke-width:var(--pc-thickness)]";
const PC_TRACK = `${PC_CIRCLE} [stroke:var(--pc-track)]`;
const PC_RANGE = `${PC_CIRCLE} [stroke:var(--pc-range)] [stroke-linecap:round] [transform-box:fill-box] [transform-origin:center] [transform:rotate(-90deg)]`;
const PC_RANGE_DETERMINATE =
  "[stroke-dasharray:100_200] [transition:stroke-dashoffset_var(--motion-duration-d6)_var(--motion-ease-enter)] motion-reduce:transition-none";

// "사진 바꾸기"(neutralWeak · small) · "사진 지우기"(ghost · small)
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
  size: { small: "h-9 rounded-r2 [--press-basis:36] [--progress-size:14px]" },
  layout: { withText: "", iconOnly: "" },
  ghostColor: { neutral: "" },
};
const BUTTON_COMPOUND = [{ size: "small", layout: "withText", className: "px-x3_5 py-x2 gap-x1 text-t4 [&_svg]:size-3.5" }];
const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };
function buttonClass(variant) {
  const p = { ...BUTTON_DEFAULTS, variant, size: "small" };
  const parts = [BUTTON_BASE, BUTTON_VARIANTS.variant[p.variant], BUTTON_VARIANTS.size[p.size], BUTTON_VARIANTS.layout[p.layout], BUTTON_VARIANTS.ghostColor[p.ghostColor]];
  for (const { className, ...when } of BUTTON_COMPOUND) if (Object.entries(when).every(([k, v]) => p[k] === v)) parts.push(className);
  // cn()(twMerge) — ghost 의 disabled:bg-transparent 가 바탕의 disabled:bg-bg-disabled 를 지운다
  const cls = parts.filter(Boolean).join(" ");
  return variant === "ghost" ? cls.replace("disabled:bg-bg-disabled ", "") : cls;
}

// <Field> — 라벨 없이 오류만(사진 바꾸기 자리). 오류가 있으면 꼬리에 오류 글
const FIELD_ROOT = "flex w-full min-w-0 flex-col gap-x2";
const FIELD_FOOTER = "flex items-start gap-x2 px-x0_5 font-sans";
const FIELD_ERROR = "m-0 flex min-w-0 text-t4 text-fg-critical";
const FIELD_ERROR_ICON = "mr-x1_5 mt-[calc((var(--text-t4--line-height)_-_1rem)/2)] size-4 shrink-0";
const FIELD_TEXT = "min-w-0";
const CIRCLE_ALERT = '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>';

// <Avatar size={108} decorative={false} uploadProgress> — 올리는 중이면 role="group"(안의 원이 읽힌다) + 딤 + 값 있는 원 24
function editAvatar({ name, src, uploadProgress }) {
  const uploading = typeof uploadProgress === "number";
  const percent = uploading ? Math.round(Math.min(Math.max(uploadProgress, 0), 1) * 100) : 0;
  const shown = displayName(name);
  const inner = src
    ? `<img data-slot="avatar-image" src="${src}" alt="" class="${IMAGE}">`
    : `<span aria-hidden="true" data-slot="avatar-initial" class="${INITIAL} ${HUE_BG[avatarHue(shown)]} ${SIZES[108].initial} ${LINE_HEIGHT_1}">${esc(avatarInitial(shown))}</span>`;
  const upload = uploading
    ? `<span data-slot="avatar-upload" class="${UPLOAD}"><svg role="progressbar" aria-label="프로필 사진 올리는 중" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}" aria-valuetext="${percent}%" data-slot="progress-circle" data-size="24" data-tone="staticWhite" data-mode="determinate" class="${PC_ROOT} ${PC_SIZE[24]} ${PC_TONE.staticWhite}" style="width:var(--pc-size); height:var(--pc-size);"><circle data-slot="progress-circle-track" class="${PC_TRACK}"></circle><circle data-slot="progress-circle-range" pathLength="100" class="${PC_RANGE} ${PC_RANGE_DETERMINATE}" style="stroke-dashoffset:${100 - percent};${percent > 0 ? "" : " opacity:0;"}"></circle></svg></span>`
    : "";
  return `<span data-slot="avatar" data-status="${src ? "loaded" : "none"}"${uploading ? ' data-uploading="true"' : ""} role="${uploading ? "group" : "img"}" aria-label="${esc(shown)}" class="${ROOT} ${SIZES[108].box}">${inner}${upload}</span>`;
}
// 사진 바꾸기 자리 — 코드 예의 짜임(Field > div.flex.flex-col.items-center.gap-x4 > Avatar · 버튼 줄 · 숨은 고르기 창)
function photoField({ src, uploadProgress, error }) {
  const busy = typeof uploadProgress === "number";
  const footer = error
    ? `<div data-slot="field-footer" class="${FIELD_FOOTER}"><p aria-hidden="true" class="${FIELD_ERROR}" style="margin:0; color:var(--color-fg-critical);"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${FIELD_ERROR_ICON}" aria-hidden="true">${CIRCLE_ALERT}</svg><span class="${FIELD_TEXT}">${esc(error)}</span></p></div>`
    : "";
  return `<div data-slot="field"${error ? ' data-invalid="true"' : ""} class="${FIELD_ROOT}"><div class="flex flex-col items-center gap-x4">${editAvatar({ name: "한지우", src, uploadProgress })}<div class="flex flex-wrap justify-center gap-x2"><button${busy ? " disabled" : ""} class="${buttonClass("neutralWeak")}">사진 바꾸기</button>${
    src ? `<button${busy ? " disabled" : ""} class="${buttonClass("ghost")}">사진 지우기</button>` : ""
  }</div><input type="file" accept="image/*" hidden=""></div>${footer}<span class="sr-only" aria-live="polite">${error ? esc(error) : ""}</span></div>`;
}

// ── 화면 예시의 값 ────────────────────────────────────────────────────────

// 제주 여행 더치페이 참가자 — 6명(앞 4명 + "+2")
const PEOPLE = ["김민수", "이서연", "박지훈", "최유진", "정하늘", "한지우"].map((name, i) => ({ id: `p${i}`, name }));
// 이름 색 열 가지 — 나머지 0 ~ 9 가 하나씩 나오는 이름
const HUE_NAMES = ["김민수", "박지훈", "한지우", "강도윤", "윤재현", "Kim Minsu", "권나래", "정하늘", "이서연", "유승우"];

// ── 예제 ──────────────────────────────────────────────────────────────────

export const avatarExamples = [
  {
    title: "이름 옆 — 장식",
    description:
      "사람 한 명을 보이는 원이다 — 사진(src)이 있으면 사진, 없으면 이름의 첫 글자(이니셜) + 이름 색이다. 아바타 옆에는 대개 이름이 있어 아바타는 장식이다(decorative 기본 true — aria-hidden) — 보조 기술은 이름을 한 번만 읽는다(\"김 김민수\" 가 아니다). 한 줄 목록은 36, 이름 + 설명 두 줄이면 42 — 같은 자리는 어느 화면에서나 같은 크기다. 모든 크기에 1px 안쪽 투명 테두리(stroke-neutral-overlay — 검정 4.7% · 다크 흰 5%, Image Frame · Logo Tile 의 윤곽과 같은 색)를 겹쳐 흰 사진이 흰 바탕에 묻히지 않고, 어두운 사진 · 이니셜 원 둘레에는 테가 생기지 않는다. 상태(안 낸 사람)는 아바타를 흐리게 하지 않고 이름 옆 글 · Badge 로 알린다.",
    jsx: `import { Avatar } from "@/components/ui/avatar"

<span className="flex items-center gap-x3">
  <Avatar size={36} name={p.name} src={p.photoUrl} />
  <span>{p.name}</span>
</span>`,
    render: () =>
      screen(
        stack(
          [
            { name: "김민수" },
            { name: "이서연" },
            { name: "윤재현", src: photo(0) },
          ].map((p) => `<span class="flex items-center gap-x3">${avatar({ size: 36, name: p.name, src: p.src })}<span style="${NAME}">${esc(p.name)}</span></span>`),
          "var(--spacing-x3)",
        ),
      ),
  },

  {
    title: "혼자 — 이름을 읽는다",
    description:
      "이름 없이 아바타만 있으면(접힌 사이드바 · 큰 프로필 사진) decorative={false} 로 아바타가 이름을 가진다 — role=\"img\" + aria-label={이름}. 사진을 못 불러와 이니셜이 보여도 같은 이름이다. 사진의 alt 는 늘 \"\" 다(이름은 아바타가 읽는다). 크기는 자리마다 대표 크기 — 사이드바 사용자 36, HR 내 정보 · 직원 정보의 큰 사진 96. 누르는 자리(프로필 열기)는 감싼 버튼 · 링크가 누름 · 포커스를 가진다.",
    jsx: `<Avatar size={36} name={me.name} decorative={false} />
<Avatar size={96} name={user.name} src={user.profileUrl} decorative={false} />`,
    render: () =>
      surface(
        row([
          labeled(avatar({ size: 36, name: "김민수", decorative: false }), "role=\"img\" · \"김민수\""),
          labeled(avatar({ size: 96, name: "서다은", src: photo(1), decorative: false }), "role=\"img\" · \"서다은\""),
        ], "var(--spacing-x8)"),
      ),
  },

  {
    title: "묶음 — 앞 4명 + \"+N\"",
    description:
      "여러 사람은 AvatarStack 으로 겹쳐 묶는다 — 다음 아바타가 지름의 약 1/4(24 이면 6) 왼쪽으로 겹치고, 놓인 바탕색 링(24 이면 1 — 바깥 box-shadow 라 크기가 그대로다)으로 앞 아바타를 끊으며, 뒤에 오는 아바타가 위에 그려진다. 5명 이상이면 앞 4명 + 끝에 \"+N\" 원(같은 크기 · 같은 링 · bg-neutral-weak + fg-neutral-muted 700)이다 — N = 전체 − 4, 99 를 넘으면 \"+99\". 크기는 묶음이 정하고 안의 아바타가 모두 따른다(기본 24 — 줄 안 묶음). 묶음 옆에 전체 수를 글로 두면 묶음은 장식(aria-hidden)이다. 묶음만 있으면 aria-label 을 준다 — \"참여자 6명: 김민수, 이서연, 박지훈, 최유진 외 2명\".",
    jsx: `import { Avatar, AvatarStack } from "@/components/ui/avatar"

<span className="flex items-center gap-x2">
  <AvatarStack size={24}>
    {people.map((p) => <Avatar key={p.id} name={p.name} src={p.photoUrl} />)}
  </AvatarStack>
  <span>{people.length}명 · {formatWon(total)}</span>
</span>`,
    render: () =>
      screen(
        stack(
          [
            `<span style="${NAME}">제주 여행</span>`,
            `<span class="flex items-center gap-x2">${avatarStack({ size: 24, people: PEOPLE })}<span style="${SUB}">6명 · 412,000원</span></span>`,
          ],
          "var(--spacing-x1)",
        ),
      ),
  },

  {
    title: "사진 바꾸기 — HR 직원 정보 수정",
    description:
      "프로필 사진 한 장을 바꾸는 자리(HR 사용자 수정 — 108)는 아바타 아래 16 에 버튼 둘을 늘 보인다 — \"사진 바꾸기\"(Button neutralWeak small) · \"사진 지우기\"(ghost small, 사진이 있을 때만 — 지우면 이니셜), 사이 8 · 가운데. 마우스를 올려야 나타나는 덮개는 두지 않는다(2026-10-15 사용자 결정 6A — 키보드 · 터치 · 화면 읽기로 닿지 않는다). uploadProgress(0 ~ 1)를 주면 올리는 중 — 원 위 딤(라이트 50% · 다크 65%) 가운데 값 있는 원 24(staticWhite · 이름 \"프로필 사진 올리는 중\" · 값 글 \"40%\")이고 그동안 아바타는 role=\"group\" + 이름이라 안의 원이 읽힌다. 두 버튼을 막는 것 · 실패를 Field 오류 글로 알리는 것은 쓰는 쪽이 한다 — 성공은 따로 알리지 않는다(사진이 바뀐 것이 보인다). 미리보기는 사진 있음 · 올리는 중 40% · 실패 · 사진 없음이다.",
    jsx: `import { useRef, useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"

const MAX_SIZE = 5 * 1024 * 1024
const user = { name: "한지우", profileUrl: "/profiles/jiwoo.webp" }
// POST /users/profiles — 진행을 알려 주고 새 사진 주소를 돌려준다
const uploadProfile = (file: File, onProgress: (ratio: number) => void) => {
  onProgress(1)
  return Promise.resolve(URL.createObjectURL(file))
}

const fileRef = useRef<HTMLInputElement>(null)
const [photoUrl, setPhotoUrl] = useState<string | undefined>(user.profileUrl)
const [progress, setProgress] = useState<number | undefined>(undefined)
const [error, setError] = useState<string | null>(null)

const pick = (file: File | undefined) => {
  if (!file) return
  if (!file.type.startsWith("image/")) return setError("사진 파일만 올릴 수 있어요.")
  if (file.size > MAX_SIZE) return setError("5MB 넘는 사진은 올릴 수 없어요.")
  setError(null)
  setProgress(0)
  uploadProfile(file, setProgress)
    .then(setPhotoUrl, () => setError("사진을 올리지 못했어요. 다시 해주세요."))
    .finally(() => setProgress(undefined))
}

{/* 버튼은 늘 보인다 — 마우스를 올려야 나타나는 덮개를 두지 않는다 */}
<Field invalid={error !== null} errorMessage={error}>
  <div className="flex flex-col items-center gap-x4">
    <Avatar size={108} name={user.name} src={photoUrl} decorative={false} uploadProgress={progress} />
    <div className="flex flex-wrap justify-center gap-x2">
      <Button variant="neutralWeak" size="small" disabled={progress !== undefined} onClick={() => fileRef.current?.click()}>
        사진 바꾸기
      </Button>
      {photoUrl && (
        <Button variant="ghost" size="small" disabled={progress !== undefined} onClick={() => setPhotoUrl(undefined)}>
          사진 지우기
        </Button>
      )}
    </div>
    <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
  </div>
</Field>`,
    render: () =>
      surface(
        row(
          [
            labeled(photoField({ src: photo(1) }), "사진 있음"),
            labeled(photoField({ src: photo(1), uploadProgress: 0.4 }), "올리는 중 40% — 버튼 막힘"),
            labeled(photoField({ src: photo(1), error: "5MB 넘는 사진은 올릴 수 없어요." }), "실패 — Field 오류 글"),
            labeled(photoField({}), "사진 없음 — 이니셜"),
          ],
          "var(--spacing-x8)",
          "flex-start",
        ),
      ),
  },

  {
    title: "크기 10단계",
    description:
      "크기는 SEED 의 10단계다 — 20 · 24 · 36 · 42 · 48(기본) · 56 · 64 · 80 · 96 · 108. 자리마다 대표 크기를 쓰고 이 밖의 크기를 만들지 않는다 — 글 한 줄 안 20 · 줄 안 묶음 24 · 한 줄 목록 36 · 두 줄 목록 42 · Desk 계정 머리 80 · HR 큰 사진 96 · 사진 수정 108. 이니셜은 지름의 40%(가장 작아도 10) · 700 · 줄 높이 1 이고 글자 크기 설정을 따르지 않는 px 다(원 안에서 넘치지 않게).",
    jsx: `<Avatar size={20} name="김민수" />
<Avatar size={24} name="김민수" />
<Avatar size={36} name="김민수" />
<Avatar size={42} name="김민수" />
<Avatar name="김민수" />            {/* 48 — 기본 */}
<Avatar size={56} name="김민수" />
<Avatar size={64} name="김민수" />
<Avatar size={80} name="김민수" />
<Avatar size={96} name="김민수" />
<Avatar size={108} name="김민수" />`,
    render: () =>
      surface(
        `<div style="overflow-x:auto;">${row(
          [20, 24, 36, 42, 48, 56, 64, 80, 96, 108].map((size) => labeled(avatar({ size, name: "김민수" }), `${size}`)),
          "var(--spacing-x3) var(--spacing-x4)",
        )}</div>`,
      ),
  },

  {
    title: "이니셜과 이름 색 — 웹 · 앱이 같은 규칙",
    description:
      "같은 사람은 웹 · 앱 · 어느 화면에서나 같은 글자 · 같은 색이다. 표시 이름은 서버가 준 이름에서 앞뒤 공백만 뺀 글이다. 이니셜은 그 첫 글자 하나(Intl.Segmenter — 사용자가 보는 글자 단위)이고 로마자는 대문자다(\"Kim Minsu\" → \"K\", 두 글자 \"Ki\" 가 아니다). 이름 색은 유니코드 코드 포인트(UTF-16 단위가 아니다)를 모두 더해 10 으로 나눈 나머지로 차트 10색을 고른다 — 0 blue · 1 green · 2 orange · 3 violet · 4 pink · 5 indigo · 6 red · 7 yellow · 8 brown · 9 gray(v110 순서). 김민수 142420 → 0 blue · 이서연 151168 → 8 brown · Kim Minsu 845 → 5 indigo. 글자는 fg-neutral-inverted(라이트 흰 · 다크 짙은 글자 — 4.55 ~ 7.70:1)이고 색은 뜻이 없다(장식). 이름이 비면 회색 원에 글자를 넣지 않는다. 앱은 같은 규칙을 Dart 로 두고 이 예시 이름으로 같은 답이 나오는지 시험한다.",
    jsx: `import { avatarHue, avatarInitial } from "@/components/ui/avatar"

avatarInitial("김민수")    // "김"
avatarHue("김민수")        // "blue"   — 142420 % 10 = 0
avatarHue("이서연")        // "brown"  — 151168 % 10 = 8
avatarInitial("Kim Minsu") // "K"
avatarHue("Kim Minsu")     // "indigo" — 845 % 10 = 5`,
    render: () =>
      surface(
        `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(88px, 1fr)); gap:var(--spacing-x4) var(--spacing-x3);">${HUE_NAMES.map((name) =>
          labeled(avatar({ size: 42, name }), `${esc(name)}<br>${codePointSum(name)} → ${avatarHue(name)}`),
        ).join("")}${labeled(avatar({ size: 42, name: "" }), "\"\" → gray · 글자 없음")}</div>`,
      ),
  },

  {
    title: "묶음 크기 · 놓인 바탕",
    description:
      "겹침 · 링 · \"+N\" 글자는 크기마다 정해져 있다 — 20 · 24 는 겹침 5 · 6 · 링 1, 36 · 42 · 48 은 8 · 10 · 12 · 링 2, 56 · 64 는 13 · 16 · 링 3, 80 은 20 · 링 4, 96 · 108 은 24 · 27 · 링 5. 4명 이하면 모두 보이고 \"+N\" 이 없다(max — 기본 4). 링은 놓인 바탕과 같은 색이다 — surface=\"default\"(기본 · bg-layer-default), 시트 · 대화상자 · 팝오버 안이면 surface=\"floating\"(bg-layer-floating — 다크에서 두 바탕이 다르다).",
    jsx: `<AvatarStack size={36}>{four}</AvatarStack>                   {/* 4명 — "+N" 없음 */}
<AvatarStack size={48}>{six}</AvatarStack>                    {/* 앞 4명 + "+2" */}
<AvatarStack size={36} surface="floating">{six}</AvatarStack> {/* 시트 안 */}`,
    render: () =>
      stack([
        surface(
          row(
            [
              labeled(avatarStack({ size: 36, people: PEOPLE.slice(0, 4) }), "36 · 4명", CODE, "flex-start"),
              labeled(avatarStack({ size: 48, people: PEOPLE }), "48 · 앞 4명 + \"+2\"", CODE, "flex-start"),
            ],
            "var(--spacing-x6)",
          ),
        ),
        `<div style="${SURFACE} background:var(--color-bg-layer-floating);">${labeled(avatarStack({ size: 36, surface: "floating", people: PEOPLE }), "surface=\"floating\" — 링 bg-layer-floating", CODE, "flex-start")}</div>`,
      ]),
  },
];
