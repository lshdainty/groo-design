/*
 * shadcn Toggle 예제 — docs site components/toggle.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 넷(관심 등록 · App Key 보기 · 메모 고정 · 순자산 카드의 눈)은 차례 · 제목 · 코드가
 * specs/components/toggle.md 의 "코드" 절과 같다. 켜고 끄는 아이콘 단추 하나다(2026-10-09) — 옛 글 토글(default · outline 28 · 32 · 40,
 * 굵게 · 기울임 툴바)과 Toggle Group 은 걷었다. 거르기 · 고르기는 Chip · Segmented Control, 누르는 순간 적용되는 설정은 Switch 다.
 * SEED 에는 이 단추의 디자인 문서가 없다 — 글이 있는 알약 Toggle Button 은 코드에만 있고, 켬 · 끔 아이콘은 SEED Iconography 의 규칙과
 * 하트 단추(Reaction Button)를 따랐다.
 *
 * TOGGLE_* 는 recipes/shadcn/components/ui/toggle.tsx 의 cva(toggleVariants)와, ICON 은 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야
 * 한다 — 두 파일을 함께 고친다. 순자산 카드 · 메모 카드의 면은 card.tsx 의 값을 옮겨 썼다 — CARD_* 는 card-examples.mjs 의 것과 같다.
 * 규칙은 specs/components/toggle.md, 수치 원본은 specs/components/toggle.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — <button type="button" data-slot="toggle" data-tone aria-label aria-pressed> 안에 지금 상태의 아이콘 하나를
 * <span aria-hidden data-slot="toggle-icon"> 으로 담는다(켬이면 pressedIcon, 없으면 icon). 아이콘의 크기(20) · 선 굵기(끔 2 · 켬 2.5) · 색은
 * 단추가 건다(aria-pressed). 레시피의 스크립트(누르면 켬 ↔ 끔 · onPressedChange)는 정적 HTML 에 없다 — 누르면 바탕은 레시피 그대로 바뀌지만
 * 켬 · 끔은 그대로다. 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── toggle.tsx 의 cva 와 같은 값 ─────────────────────────────────────────

const TOGGLE_BASE = [
  "relative inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-r2 border-0 bg-transparent p-0",
  // 누르는 영역 44 — 보이는 40 둘레로 2 씩
  "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  // 아이콘 20 · 끔 선 2 · 켬 선 2.5(막혀도 그대로)
  "[&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:[stroke-width:2] aria-pressed:[&_svg]:[stroke-width:2.5]",
  // 바탕은 color-transition, 축소는 pressed-scale
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "[--press-basis:40] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  // 키보드 포커스 링 2px · 띄움 2px — 색은 톤마다(채움 위는 흰색)
  "focus-visible:outline-2 focus-visible:outline-offset-2",
  "disabled:cursor-not-allowed disabled:bg-transparent disabled:text-fg-disabled disabled:[scale:1]",
].join(" ");
const TOGGLE_VARIANTS = {
  tone: {
    // 끔 흐린 색 · 켬 진한 색(막히면 켬도 fg-disabled — enabled 에만 건다), 호버 · 누름은 같은 바탕, 링 stroke-focus-ring
    default:
      "text-fg-neutral-muted enabled:aria-pressed:text-fg-neutral hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed focus-visible:outline-stroke-focus-ring",
    // 브랜드 채움 위 — 켬 · 끔 모두 흰 아이콘, 바탕은 칠하지 않는다(축소만). 링도 흰색 — stroke-focus-ring 은 채움에 묻힌다
    inverted: "text-static-white focus-visible:outline-static-white",
  },
};
const TOGGLE_DEFAULTS = { tone: "default" };

// ── toggle.tsx 의 JSX 에 적힌 클래스 ────────────────────────────────────

const ICON = "pointer-events-none flex";

// ── card.tsx 의 값 — 순자산 카드(hero) · 메모 카드(default · content) ─────────

const CARD_ROOT = "relative isolate block overflow-hidden rounded-r4 text-start font-sans text-fg-neutral no-underline";
const CARD_VARIANT = {
  default: "border border-solid border-stroke-neutral-weak bg-bg-layer-default",
  // 그라디언트 끝은 모드마다 다른 단계 — 다크에서 brand-900 은 밝은 #7AA9F6 이라 쓰지 않는다
  hero: [
    "border-0 text-static-white",
    "bg-[linear-gradient(135deg,var(--color-bg-brand-solid),var(--color-brand-900))]",
    "dark:bg-[linear-gradient(135deg,var(--color-bg-brand-solid),var(--color-brand-300-dark))]",
  ].join(" "),
};
const CARD_BODY = { content: "p-x6" };
const CARD_HERO_GLOW = "pointer-events-none absolute -right-[40px] -top-[80px] -z-10 size-[240px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-static-white)_22%,transparent),transparent_70%)]";
const CARD_HERO_PADDING = "p-x6";
const CARD_HERO_LABEL = "font-sans text-t3 font-medium text-static-white";
const CARD_HERO_AMOUNT = "mt-x1_5 font-sans text-t12 font-bold tabular-nums text-static-white";

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다
const variantKey = (v) => (typeof v === "boolean" ? String(v) : v);
function cvaOf(base, { variants = {}, compoundVariants = [], defaultVariants = {} } = {}) {
  return (props = {}) => {
    const p = { ...defaultVariants };
    for (const [k, v] of Object.entries(props)) if (v !== undefined) p[k] = v;
    const parts = [base];
    for (const [axis, map] of Object.entries(variants)) parts.push(map[variantKey(p[axis])]);
    for (const { class: cls, className, ...when } of compoundVariants) {
      const hit = Object.entries(when).every(([k, v]) => (Array.isArray(v) ? v.includes(p[k]) : p[k] === v));
      if (hit) parts.push(cls, className);
    }
    return parts.filter(Boolean).join(" ");
  };
}

// "has-[[data-x]:hover]:before:bg-x" → ["has-[…]", "before", "bg-x"] — 괄호 안의 ":" 는 가르지 않는다
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

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다. 이 파일이 합치는 클래스에 나오는 무리만 안다 — 바탕 · 글자색 · 여백(면) ·
// 바깥 여백(면) · 임의 속성([prop:…])(recipes/shadcn/lib/utils.ts)
const GROUPS = [
  [/^bg-/, "bg"],
  [/^text-(?:fg-|static-)/, "color"],
];
const SIDES = { p: "trbl", px: "lr", py: "tb", pt: "t", pr: "r", pb: "b", pl: "l", m: "trbl", mx: "lr", my: "tb", mt: "t", mr: "r", mb: "b", ml: "l" };
function merge(classList) {
  const seen = new Set();
  const boxes = new Map();
  const kept = [];
  for (const cls of classList.split(/\s+/).filter(Boolean).reverse()) {
    const segs = splitVariants(cls);
    const utility = segs.pop().replace(/^-/, "");
    const side = /^([pm][xytrbl]?)-/.exec(utility);
    if (side && SIDES[side[1]]) {
      const key = `${segs.join(":")}|${side[1][0]}`;
      const covered = boxes.get(key) ?? new Set();
      const sides = [...SIDES[side[1]]];
      if (sides.every((s) => covered.has(s))) continue;
      for (const s of sides) covered.add(s);
      boxes.set(key, covered);
    }
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

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 와 같은 모양(24 격자) — 크기 · 굵기는 단추의 [&_svg]:size-5 · stroke-width 가 정한다
const svg = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
const PATHS = {
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  pin: '<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
  eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
};

const toggleVariants = cvaOf(TOGGLE_BASE, { variants: TOGGLE_VARIANTS, defaultVariants: TOGGLE_DEFAULTS });

// <Toggle aria-label pressed icon pressedIcon tone className> — 켬이면 pressedIcon(없으면 icon) 하나를 그린다
function toggle({ name, pressed = false, icon, pressedIcon = "", tone = "default", disabled = false, className = "" }) {
  const shown = pressed && pressedIcon ? pressedIcon : icon;
  return `<button ${attrs([
    'type="button"',
    'data-slot="toggle"',
    `data-tone="${tone}"`,
    `class="${merge(`${toggleVariants({ tone })} ${className}`)}"`,
    disabled && "disabled",
    `aria-label="${esc(name)}"`,
    `aria-pressed="${pressed ? "true" : "false"}"`,
  ])}><span aria-hidden="true" data-slot="toggle-icon" class="${ICON}">${svg(PATHS[shown])}</span></button>`;
}

// 견본 줄 — 단추 + 아래 글(무엇 · 보조 기술이 읽는 말)
const CAPTION = "display:block; margin-top:var(--spacing-x1); font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";
const item = (html, caption) => `<div style="display:flex; flex-direction:column; align-items:flex-start; min-width:0;">${html}<span style="${CAPTION}">${esc(caption)}</span></div>`;
const row = (items) => `<div style="display:flex; flex-wrap:wrap; gap:var(--spacing-x6); align-items:flex-start; font-family:var(--font-sans);">${items.join("")}</div>`;
// 흰 표면 — 단추는 카드 · 시트 위에 놓인다
const surface = (html) => `<div style="padding:var(--spacing-x5) var(--spacing-x6); border-radius:var(--radius-r4); background:var(--color-bg-layer-default); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle);">${html}</div>`;
// 바닥 — 카드는 회색 바닥(bg-layer-basement) 위에만 둔다
const floor = (html) => `<div style="padding:var(--spacing-x6); border-radius:var(--radius-r4); background:var(--color-bg-layer-basement); font-family:var(--font-sans); max-width:408px;">${html}</div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const toggleExamples = [
  {
    title: "관심 등록 — 모으기 단추",
    description:
      "단추 하나가 한 상태를 켜고 끈다 — <button aria-pressed>. 이름은 \"관심 등록\" 으로 고정하고 켬은 aria-pressed 가 알린다(\"관심 등록, 눌림\" — \"관심 해제\" 로 바꾸지 않는다). 모으기 단추(관심 · 고정)는 끔에도 사선을 두지 않는다 — 같은 star 아이콘이 끔은 흐린 색 fg-neutral-muted + 선 2, 켬은 진한 색 fg-neutral + 선 2.5 로만 갈린다(채우지 않는다). 바탕은 켬 · 끔 모두 투명하다 — 호버 · 누름에만 bg-layer-default-pressed 이고, 누르면 단추 전체가 2px 거리만큼 준다. 보이는 40 · 누르는 44 · 아이콘 20 · 모서리 8. pressedIcon 이 없으면 icon 을 그대로 쓴다.",
    jsx: `import { Star } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

<Toggle aria-label="관심 등록" pressed={watched} onPressedChange={setWatched} icon={<Star />} />`,
    render: () =>
      surface(
        row([
          item(toggle({ name: "관심 등록", icon: "star" }), "끔 — \"관심 등록\""),
          item(toggle({ name: "관심 등록", pressed: true, icon: "star" }), "켬 — \"관심 등록, 눌림\""),
          item(toggle({ name: "관심 등록", icon: "star", disabled: true }), "막힘 — fg-disabled"),
        ]),
      ),
  },

  {
    title: "App Key 보기 — 기능 단추",
    description:
      "아이콘은 누르면 할 일이 아니라 지금 상태를 그린다. 기능 단추(눈 · 종)는 lucide 의 -off 짝을 쓴다 — App Key 보기는 키가 가려져 있으면 끔 · eye-off, 보이면 켬 · eye 다(icon={<EyeOff />} pressedIcon={<Eye />}). 상단 바 안에 둘 때는 Top Navigation 의 아이콘 버튼(aria-pressed — 상자 44 · 아이콘 24)을 쓰고 끔도 fg-neutral 이다. 금액 가리기 눈은 Toggle 이 아니다 — 설정으로 가는 버튼이다(마지막 예제).",
    jsx: `mport { Eye, EyeOff } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

<Toggle aria-label="App Key 보기" pressed={shown} onPressedChange={setShown} icon={<EyeOff />} pressedIcon={<Eye />} />`,
    render: () =>
      surface(
        row([
          item(toggle({ name: "App Key 보기", icon: "eyeOff", pressedIcon: "eye" }), "키 가림 — 끔 · eye-off"),
          item(toggle({ name: "App Key 보기", pressed: true, icon: "eyeOff", pressedIcon: "eye" }), "키 보임 — 켬 · eye"),
        ]),
      ),
  },

  {
    title: "메모 고정 — 바로 바꾸고 보낸다",
    description:
      "누르면 아이콘이 바로 바뀌고 요청은 뒤에서 나간다 — onPressedChange 는 요청을 기다리지 않고, 응답을 기다리며 단추를 막지 않는다(막으면 키보드 초점이 본문으로 빠진다). 실패하면 부르는 쪽이 되돌리고 Snackbar critical 로 알린다 — \"고정하지 못했어요. 다시 시도해주세요.\" + \"다시 시도\"(액션이 있어 6초). 단추는 이미 옛 모습으로 돌아가 있어 카드에 오류 줄을 붙이지 않는다. 같은 줄에 단추가 여럿이면 이름 앞에 줄 이름을 붙인다(\"장보기 목록 고정\"). 카드 제목 줄 오른쪽에 둘 때는 상자 40 이 줄 높이를 밀지 않게 위 · 오른쪽 8 을 당긴다(Card 의 고정 단추).",
    jsx: `import { Pin } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

<Toggle
  aria-label={\`\${memo.title} 고정\`}
  pressed={memo.pinned}
  onPressedChange={(pinned) => setPinned(memo.id, pinned)} // 화면을 바로 바꾸고 보낸다 — 실패하면 되돌리고 스낵바
  icon={<Pin />}
/>`,
    render: () =>
      floor(
        `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2);">${[
          ["장보기 목록", "우유 · 계란 · 두부 · 대파", true],
          ["이번 달 고정비", "월세 · 통신 · 보험", false],
        ]
          .map(
            ([title, body, pinned]) =>
              `<div data-slot="card" data-variant="default" data-body="content" data-press="none" class="${merge(`${CARD_ROOT} ${CARD_VARIANT.default} ${CARD_BODY.content}`)}"><div style="display:flex; align-items:flex-start; justify-content:space-between; gap:var(--spacing-x2);"><span style="font-size:var(--text-t5); line-height:var(--text-t5--line-height); font-weight:700;">${esc(title)}</span>${toggle({ name: `${title} 고정`, pressed: pinned, icon: "pin", className: "-mr-x2 -mt-x2 shrink-0" })}</div><p style="margin:var(--spacing-x1) 0 0; font-size:var(--text-t3); line-height:var(--text-t3--line-height); color:var(--color-fg-neutral-subtle);">${esc(body)}</p></div>`,
          )
          .join("")}</div>`,
      ),
  },

  {
    title: "순자산 카드의 눈 — Toggle 이 아니다",
    description:
      "홈 · 자산 순자산 카드의 금액 가리기 눈은 켜고 끄지 않는다 — 누르면 금액 가리기 설정의 그 화면 묶음으로 간다(가리기는 화면 · 카드 단위, 2026-08-06). 그래서 Toggle 을 쓰지 않고 aria-pressed 없는 <button aria-label=\"금액 가리기 설정\"> 에 toggleVariants({ tone: \"inverted\" }) 의 상자만 빌린다 — 보이는 40 · 누르는 44 · 아이콘 20, 브랜드 채움 위라 흰 아이콘만(원 · 바탕 없음 — 21A)이고 누르면 축소만 한다. 아이콘은 이 카드가 가려졌는지를 그린다(가렸으면 eye-off — 7A). aria-pressed 가 없어 선은 2 그대로다. 낭독은 \"금액 가리기 설정, 버튼\" 이다(2026-10-16 Q-017-2b A · Q-017-3c = Q-018-3 B).",
    jsx: `mport { Eye, EyeOff } from "lucide-react"
import { toggleVariants } from "@/components/ui/toggle"

{/* 켜고 끄지 않는다 — 금액 가리기 설정의 이 화면 묶음으로 간다. aria-pressed 없음, 아이콘은 이 카드가 가려졌는지 */}
<button type="button" aria-label="금액 가리기 설정" className={toggleVariants({ tone: "inverted" })} onClick={() => openHideAmountsSettings("home")}>
  {hidden ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
</button>`,
    render: () =>
      floor(
        `<div style="display:flex; flex-direction:column; gap:var(--spacing-x2);">${[false, true]
          .map(
            (hidden) =>
              `<div data-slot="card" data-variant="hero" data-body="content" data-press="none" class="${merge(`${CARD_ROOT} ${CARD_VARIANT.hero} ${CARD_HERO_PADDING}`)}"><span aria-hidden="true" data-slot="card-hero-glow" class="${CARD_HERO_GLOW}"></span><div style="display:flex; align-items:center; justify-content:space-between; gap:var(--spacing-x2);"><div data-slot="card-hero-label" class="${CARD_HERO_LABEL}">순자산</div><button type="button" aria-label="금액 가리기 설정" class="${merge(`${toggleVariants({ tone: "inverted" })} -my-[11px] -mr-x2`)}">${svg(PATHS[hidden ? "eyeOff" : "eye"]).replace("<svg ", '<svg aria-hidden="true" ')}</button></div><div data-slot="card-hero-amount" class="${CARD_HERO_AMOUNT}">${hidden ? "••••••원" : "42,898,100원"}</div></div>`,
          )
          .join("")}</div>`,
      ),
  },
];
