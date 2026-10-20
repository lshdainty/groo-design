/*
 * shadcn Footer 예제 — docs site components/footer.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 첫째(groo-home — 7B 짜임)는 제목 · 코드가 specs/components/footer.md 의 "코드" 절과 같고,
 * 둘째(값이 생기면 — 자리표시)는 md 의 "값이 없는 블록은 비워 둔다" 를 코드로 더 보인다 — 값을 지어내지 않고 자리표시 글만 쓴다.
 * 짜임은 당근 SEED Footer(seed-design.io/components/footer — 디자인 문서 "조합 예시" · registry block footer-01 ~ 04, Apache-2.0)를 따른다 — 정해진 한
 * 덩어리가 아니라 블록(브랜드 · 사이트맵 | 선 | 정책 링크 · 안내 글 · 저작권)을 골라 조립한다(2026-10-15 사용자 결정 7B · 8A · 9A). 1280 미만 좌우 24 · 위 선 ·
 * "© 해 그루" 는 groo 가 정했다. groo 에 처음 두는 예제다.
 *
 * ROOT · ROOT_TOP_LINE · FRAME · NAV · BRAND · BRAND_NAME · BRAND_INTRO · SITEMAP · COLUMN · COLUMN_TITLE · COLUMN_LINKS · DIVIDER · INFO · LINKS · TEXT ·
 * BOTTOM · COPYRIGHT · SOCIAL · LINK · LINK_SIZE 는 recipes/shadcn/components/ui/footer.tsx 의 상수와, COLUMN_ITEM("flex")은 그 파일의 JSX 에 적힌 클래스와
 * 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 소셜 버튼의 BUTTON_* 는 button.tsx 의 값(ghost · large · 아이콘만 — menu-examples.mjs 와 같은 꼴)이다.
 * footer.tsx 는 cn() 으로 합치지만 지워지는 클래스가 없다 — 그래서 그대로 잇는다. 규칙은 specs/components/footer.md, 수치 원본은 footer.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — <footer data-slot="footer"> > 틀 <div data-slot="footer-frame"> > 탐색 영역 <div data-slot="footer-nav">(브랜드 ·
 * <nav aria-label="사이트 지도"> > 열 — 제목 <span id> + 링크 목록 <ul aria-labelledby> > <li class="flex"> > <a data-slot="footer-link" data-size>) · 선 · 안내 영역
 * <div data-slot="footer-info">(정책 링크 줄 · 안내 글 · 저작권 줄). 새 탭 링크는 target="_blank" · rel="noopener" · 뒤 ↗(aria-hidden) · 보이지 않는 "(새 탭)".
 * 열 제목의 id 는 레시피가 useId 로 만든다(미리보기는 읽을 수 있는 이름으로 미리 이었다). 저작권의 해는 그리는 때(빌드)의 해다. 링크는 실제 서비스 주소다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── footer.tsx 의 상수와 같은 값 ──────────────────────────────────────────

// 바닥 — 화면 폭 전체(위 선). 틀은 안쪽 div
const ROOT = "w-full bg-transparent font-sans";
const ROOT_TOP_LINE = "border-t border-solid border-stroke-neutral-subtle";
const FRAME = "mx-auto flex w-full max-w-(--layout-max-content) flex-col gap-x10 px-global-gutter py-x10 lg:px-x8";

const NAV = "flex flex-wrap items-start gap-x8";
const BRAND = "flex min-w-[120px] flex-[1_1_240px] flex-col items-start gap-x2";
const BRAND_NAME = "m-0 text-t7 font-bold text-fg-neutral";
const BRAND_INTRO = "m-0 max-w-[340px] text-t3 font-normal text-fg-neutral-subtle";
const SITEMAP = "flex flex-wrap items-start gap-x8";
const COLUMN = "flex min-w-[100px] flex-col items-start gap-x4";
const COLUMN_TITLE = "text-t3 font-medium text-fg-neutral-muted";
const COLUMN_LINKS = "m-0 flex list-none flex-col items-start gap-x4 p-0";
const DIVIDER = "h-px w-full shrink-0 bg-stroke-neutral-subtle";
const INFO = "flex flex-col items-start gap-x4";
const LINKS = "flex flex-wrap items-center gap-x-x6 gap-y-x2";
const TEXT = "m-0 text-t3 font-normal text-fg-neutral-subtle";
const BOTTOM = "flex w-full flex-col flex-wrap items-start justify-between gap-x4 lg:flex-row lg:items-center";
const COPYRIGHT = "m-0 text-t4 font-medium text-fg-neutral-muted";
const SOCIAL = "flex items-center gap-x6 [&>*]:-mx-x3";

// 링크 — 글 + 뒤 ↗(새 탭만). 밑줄 없이 색으로 올림 · 누름
const LINK = [
  "inline-flex cursor-pointer items-center gap-x1 rounded-r1 no-underline",
  "[transition:color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "[&>svg]:shrink-0",
].join(" ");
const LINK_SIZE = {
  large: "text-t5 font-medium text-fg-neutral hover:text-fg-neutral-subtle active:text-fg-neutral-subtle [&>svg]:size-[14px]",
  medium: "text-t4 font-medium text-fg-neutral-muted hover:text-fg-neutral active:text-fg-neutral [&>svg]:size-3",
};

// ── footer.tsx 의 JSX 에 적힌 클래스 ─────────────────────────────────────

// 열의 링크 하나를 감싸는 <li>
const COLUMN_ITEM = "flex";

// ── button.tsx 의 값 — 소셜 버튼(ghost · large · 아이콘만) ────────────────

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
    ghost:
      "bg-transparent text-fg-neutral hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed aria-busy:bg-bg-layer-default-pressed disabled:bg-transparent [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
  },
  size: { large: "h-12 rounded-r3 [--press-basis:48] [--progress-size:18px]" },
  layout: { withText: "", iconOnly: "" },
  ghostColor: { neutral: "" },
};
const BUTTON_COMPOUND = [{ size: "large", layout: "iconOnly", className: "w-12 p-x3 [&_svg]:size-[22px]" }];
const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

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
// cn()(twMerge) — ghost 버튼의 disabled:bg-transparent 가 바탕의 disabled:bg-bg-disabled 를 지운다(이 파일이 합치는 무리는 바탕뿐)
function merge(classList) {
  const seen = new Set();
  const kept = [];
  for (const cls of classList.split(/\s+/).filter(Boolean).reverse()) {
    const at = cls.lastIndexOf(":");
    const utility = cls.slice(at + 1);
    if (/^bg-/.test(utility) && !cls.includes("[")) {
      const key = `${cls.slice(0, at + 1)}|bg`;
      if (seen.has(key)) continue;
      seen.add(key);
    }
    kept.push(cls);
  }
  return kept.reverse().join(" ");
}
const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const svg = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const PATHS = {
  arrowUpRight: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  atSign: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',
};
// 사이트의 `.content p { margin: 12px 0; color: text-primary }` 는 층(@layer) 밖 규칙이라 Tailwind utility 를 늘 이긴다 —
// <p> 에는 클래스가 정한 바깥 여백 · 글자색을 style 로 한 번 더 적는다(레시피에는 없는 미리보기용 덧칠)
const P_FIX = {
  brandName: "margin:0; color:var(--color-fg-neutral);",
  subtle: "margin:0; color:var(--color-fg-neutral-subtle);",
  muted: "margin:0; color:var(--color-fg-neutral-muted);",
};
// 저작권의 해 — 그리는 때(빌드)의 해(FooterCopyright 의 기본)
const YEAR = new Date().getFullYear();

// <FooterLink> — size 는 놓인 자리(열 안 large · 그 밖 medium), external 이면 새 탭 + ↗ + "(새 탭)"
const link = ([label, href], { size = "medium", external = false } = {}) =>
  `<a data-slot="footer-link" data-size="${size}" class="${LINK} ${LINK_SIZE[size]}"${external ? ' target="_blank" rel="noopener"' : ""} href="${esc(href)}">${esc(label)}${
    external ? `${svg(PATHS.arrowUpRight).replace("<svg ", '<svg data-slot="footer-link-icon" ')}<span class="sr-only"> (새 탭)</span>` : ""
  }</a>`;
const column = (id, title, links) =>
  `<div data-slot="footer-column" class="${COLUMN}"><span id="${id}" data-slot="footer-column-title" class="${COLUMN_TITLE}">${esc(title)}</span><ul aria-labelledby="${id}" data-slot="footer-column-links" class="${COLUMN_LINKS}">${links
    .map((l) => `<li class="${COLUMN_ITEM}">${link(l, { size: "large" })}</li>`)
    .join("")}</ul></div>`;
// groo-home 바닥(7B) — footer.md 코드 절 그대로
function footer({ id = "ft", extra = "", social = "" } = {}) {
  return `<footer data-slot="footer" class="${ROOT} ${ROOT_TOP_LINE}"><div data-slot="footer-frame" class="${FRAME}"><div data-slot="footer-nav" class="${NAV}"><div data-slot="footer-brand" class="${BRAND}"><p data-slot="footer-brand-name" class="${BRAND_NAME}" style="${P_FIX.brandName}">그루</p><p data-slot="footer-brand-description" class="${BRAND_INTRO}" style="${P_FIX.subtle}">${esc(
    "People + Forest. 사람(People)이 모여 숲(Forest)처럼 자라나는 조직 생태계를 설계합니다.",
  )}</p></div><nav data-slot="footer-sitemap" aria-label="사이트 지도" class="${SITEMAP}">${column(`${id}-service`, "서비스", [
    ["HR", "https://hr.porest.cloud"],
    ["Desk", "https://desk.porest.cloud"],
    ["Desk 설명서", "https://desk.porest.cloud/guide/"],
  ])}${column(`${id}-account`, "계정", [
    ["로그인", "https://sso.porest.cloud"],
    ["회원가입", "https://sso.porest.cloud"],
  ])}</nav></div><div aria-hidden="true" data-slot="footer-divider" class="${DIVIDER}"></div><div data-slot="footer-info" class="${INFO}"><div data-slot="footer-links" class="${LINKS}">${link(["개인정보 처리방침", "https://sso.porest.cloud/privacy"], { external: true })}</div><p data-slot="footer-text" class="${TEXT}" style="${P_FIX.subtle}">${esc(
    "화면의 숫자와 이름은 소개용 예시입니다. 사진: Unsplash.",
  )}</p>${extra}<div data-slot="footer-bottom" class="${BOTTOM}"><p data-slot="footer-copyright" class="${COPYRIGHT}" style="${P_FIX.muted}">© ${YEAR} 그루</p>${social}</div></div></div></footer>`;
}
const PAGE =
  "overflow:hidden; border-radius:var(--radius-r4); background:var(--color-bg-layer-default); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle); color:var(--color-fg-neutral);";
// 바닥 위 페이지 본문 자리(화면의 내용)
const PAGE_BODY = `<div aria-hidden="true" style="display:flex; flex-direction:column; gap:var(--spacing-x2); padding:var(--spacing-x8) var(--spacing-global-gutter);">${[100, 72, 48]
  .map((w) => `<span style="display:block; width:${w}%; height:12px; border-radius:var(--radius-full); background:var(--color-bg-neutral-weak);"></span>`)
  .join("")}</div>`;
const page = (html) => `<div style="${PAGE}">${PAGE_BODY}${html}</div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const footerExamples = [
  {
    title: "groo-home — 7B 짜임",
    description:
      "SEED footer-04 를 줄인 groo-home 의 바닥이다(7B) — 탐색 영역(브랜드 \"그루\" 20 / 27 · 700 + 소개 13 / 18 | 사이트맵 <nav aria-label=\"사이트 지도\"> 의 서비스 · 계정 열 — 제목 13 / 18 · 500 fg-neutral-muted · 링크 large 16 / 22 · 500 fg-neutral, 사이 16) · 선(1px stroke-neutral-subtle) · 안내 영역(개인정보 처리방침 ↗ · 안내 글 · © 해 그루). 틀은 최대 1040 · 위아래 40 · 좌우 24(1280 이상 32) · 영역 사이 40 이고 바닥 위에 화면 폭 1px 선을 긋는다. 폭이 줄면 사이트맵이 브랜드 아래로, 열이 줄을 바꾼다(열 최소 100). 처리방침만 새 탭(↗ + 보이지 않는 \"(새 탭)\")이고 같은 탭으로 가는 서비스 링크에는 ↗ 가 없다. 링크에는 밑줄이 없다 — 올림 · 누름은 색으로 알린다(사이트맵 링크는 옅게, 정책 링크는 짙게). groo-home 자체는 빌드 없는 정적 페이지라 같은 짜임을 HTML 로 옮기고 색 · 글꼴은 홈 것을 쓴다(8A).",
    jsx: `import {
  Footer,
  FooterBottom,
  FooterBrand,
  FooterColumn,
  FooterCopyright,
  FooterDivider,
  FooterInfo,
  FooterLink,
  FooterLinks,
  FooterNav,
  FooterSitemap,
  FooterText,
} from "@/components/ui/footer"

<Footer>
  <FooterNav>
    <FooterBrand
      name="그루"
      description="People + Forest. 사람(People)이 모여 숲(Forest)처럼 자라나는 조직 생태계를 설계합니다."
    />
    <FooterSitemap>
      <FooterColumn title="서비스">
        <FooterLink href="https://hr.porest.cloud">HR</FooterLink>
        <FooterLink href="https://desk.porest.cloud">Desk</FooterLink>
        <FooterLink href="https://desk.porest.cloud/guide/">Desk 설명서</FooterLink>
      </FooterColumn>
      <FooterColumn title="계정">
        <FooterLink href="https://sso.porest.cloud">로그인</FooterLink>
        <FooterLink href="https://sso.porest.cloud">회원가입</FooterLink>
      </FooterColumn>
    </FooterSitemap>
  </FooterNav>
  <FooterDivider />
  <FooterInfo>
    <FooterLinks>
      {/* 읽고 돌아오는 문서 — 새 탭 + ↗ */}
      <FooterLink href="https://sso.porest.cloud/privacy" external>
        개인정보 처리방침
      </FooterLink>
    </FooterLinks>
    <FooterText>화면의 숫자와 이름은 소개용 예시입니다. 사진: Unsplash.</FooterText>
    {/* 사업자 정보 · 연락처 · 소셜은 값이 생기면 이 자리에 — 지어내지 않는다 */}
    <FooterBottom>
      <FooterCopyright owner="그루" />
    </FooterBottom>
  </FooterInfo>
</Footer>`,
    render: () => page(footer({ id: "ft-home" })),
  },

  {
    title: "값이 생기면 — 사업자 정보 · 연락처 · 소셜(자리표시)",
    description:
      "사업자 정보 · 연락처 · 소셜 링크는 블록만 있다 — groo 의 상호 · 사업자 등록번호 · 주소 · 전화 · 문의 메일 · 공개 소셜 채널은 아직 어느 레포에도 없어 값을 지어내 넣지 않는다. 값이 생기면 안내 글 아래에 사업자 정보 → 연락처를 FooterText 로(항목은 \" | \" 로 잇고 묶음이 바뀌면 <br />), 소셜은 저작권 줄 끝의 FooterSocial 로 둔다 — Button ghost · large · 아이콘만 + 이름(사이 24 · 바깥 여백만큼 끝을 맞춘다), 1280 미만은 저작권 아래. 아래 글은 무엇이 들어갈 자리인지만 쓴 자리표시다.",
    jsx: `import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

{/* 안내 글 아래 — 값이 생기면 */}
<FooterText>
  (상호) | 대표 (이름) | 사업자 등록번호 000-00-00000
  <br />
  (주소)
</FooterText>
<FooterText>(전화) | (문의 메일)</FooterText>
<FooterBottom>
  <FooterCopyright owner="그루" />
  <FooterSocial>
    <Button variant="ghost" size="large" layout="iconOnly" aria-label="(소셜 채널 이름)">
      <Globe />
    </Button>
  </FooterSocial>
</FooterBottom>`,
    render: () => {
      const text = (html) => `<p data-slot="footer-text" class="${TEXT}" style="${P_FIX.subtle}">${html}</p>`;
      const button = (name, icon) => `<button type="button" aria-label="${esc(name)}" class="${merge(`${buttonVariants({ variant: "ghost", size: "large", layout: "iconOnly" })}`)}">${svg(icon)}</button>`;
      return page(
        footer({
          id: "ft-placeholder",
          extra: `${text(`${esc("(상호) | 대표 (이름) | 사업자 등록번호 000-00-00000")}<br>${esc("(주소)")}`)}${text(esc("(전화) | (문의 메일)"))}`,
          social: `<div data-slot="footer-social" class="${SOCIAL}">${button("(소셜 채널 이름)", PATHS.globe)}${button("(소셜 채널 이름 2)", PATHS.atSign)}</div>`,
        }),
      );
    },
  },
];
