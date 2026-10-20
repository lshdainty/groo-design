#!/usr/bin/env node
// Groo Design — multi-page static documentation site
//
// 출력: exports/site/
//   index.html                      Landing (브랜드 정체성 + 핵심 가치)
//   tokens/{colors,typography,spacing,radius,shadows,motion,breakpoints,z-index}.html
//   assets/site.css                 사이트 전용 layout CSS
//   assets/tokens.css               3-brand 통합 (`:root` + `[data-brand="hr|desk"]`)
//   assets/site.js                  brand toggle / theme toggle / mobile nav
//
// 외부 의존성 0 — vanilla Node + 기존 build-tailwind-v4 산출물 재사용.
// Phase 1 — 사이트 골격 + Landing + Token 페이지.
// Phase 2 (미래) — 컴포넌트 페이지. Phase 3 — 조합 layout.

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// preview.html의 데모 render 함수 + CSS 재사용 — single source of truth
// shadcn recipe examples — Preview + Code 토글로 컴포넌트 페이지에 노출
import { buttonExamples } from "../recipes/shadcn/examples/button-examples.mjs";
import { inputExamples } from "../recipes/shadcn/examples/input-examples.mjs";
import { textareaExamples } from "../recipes/shadcn/examples/textarea-examples.mjs";
import { fieldExamples } from "../recipes/shadcn/examples/field-examples.mjs";
import { inputButtonExamples } from "../recipes/shadcn/examples/input-button-examples.mjs";
import { checkboxExamples } from "../recipes/shadcn/examples/checkbox-examples.mjs";
import { radioGroupExamples } from "../recipes/shadcn/examples/radio-group-examples.mjs";
import { selectBoxExamples } from "../recipes/shadcn/examples/select-box-examples.mjs";
import { switchExamples } from "../recipes/shadcn/examples/switch-examples.mjs";
import { chipExamples } from "../recipes/shadcn/examples/chip-examples.mjs";
import { floatingActionButtonExamples } from "../recipes/shadcn/examples/floating-action-button-examples.mjs";
import { badgeExamples } from "../recipes/shadcn/examples/badge-examples.mjs";
import { notificationBadgeExamples } from "../recipes/shadcn/examples/notification-badge-examples.mjs";
import { tagGroupExamples } from "../recipes/shadcn/examples/tag-group-examples.mjs";
import { avatarExamples } from "../recipes/shadcn/examples/avatar-examples.mjs";
import { cardExamples } from "../recipes/shadcn/examples/card-examples.mjs";
import { listExamples } from "../recipes/shadcn/examples/list-examples.mjs";
import { dividerExamples } from "../recipes/shadcn/examples/divider-examples.mjs";
import { skeletonExamples } from "../recipes/shadcn/examples/skeleton-examples.mjs";
import { aspectRatioExamples } from "../recipes/shadcn/examples/aspect-ratio-examples.mjs";
import { imageFrameExamples } from "../recipes/shadcn/examples/image-frame-examples.mjs";
import { logoTileExamples } from "../recipes/shadcn/examples/logo-tile-examples.mjs";
import { progressExamples } from "../recipes/shadcn/examples/progress-examples.mjs";
import { progressCircleExamples } from "../recipes/shadcn/examples/progress-circle-examples.mjs";
import { scrollFogExamples } from "../recipes/shadcn/examples/scroll-fog-examples.mjs";
import { contentPlaceholderExamples } from "../recipes/shadcn/examples/content-placeholder-examples.mjs";
import { scrollAreaExamples } from "../recipes/shadcn/examples/scroll-area-examples.mjs";
import { scrollAutoHideExamples } from "../recipes/shadcn/examples/scroll-auto-hide-examples.mjs";
import { typographyExamples } from "../recipes/shadcn/examples/typography-examples.mjs";
import { resizableExamples } from "../recipes/shadcn/examples/resizable-examples.mjs";
import { calloutExamples } from "../recipes/shadcn/examples/callout-examples.mjs";
import { pageBannerExamples } from "../recipes/shadcn/examples/page-banner-examples.mjs";
import { resultSectionExamples } from "../recipes/shadcn/examples/result-section-examples.mjs";
import { tooltipExamples } from "../recipes/shadcn/examples/tooltip-examples.mjs";
import { helpBubbleExamples } from "../recipes/shadcn/examples/help-bubble-examples.mjs";
import { dialogExamples } from "../recipes/shadcn/examples/dialog-examples.mjs";
import { alertDialogExamples } from "../recipes/shadcn/examples/alert-dialog-examples.mjs";
import { popoverExamples } from "../recipes/shadcn/examples/popover-examples.mjs";
import { sidePanelExamples } from "../recipes/shadcn/examples/side-panel-examples.mjs";
import { bottomSheetExamples } from "../recipes/shadcn/examples/bottom-sheet-examples.mjs";
import { snackbarExamples } from "../recipes/shadcn/examples/snackbar-examples.mjs";
import { menuSheetExamples } from "../recipes/shadcn/examples/menu-sheet-examples.mjs";
import { swipeActionsExamples } from "../recipes/shadcn/examples/swipe-actions-examples.mjs";
// Phase 4 Navigation
import { tabsExamples } from "../recipes/shadcn/examples/tabs-examples.mjs";
import { segmentedControlExamples } from "../recipes/shadcn/examples/segmented-control-examples.mjs";
import { paginationExamples } from "../recipes/shadcn/examples/pagination-examples.mjs";
import { tablePaginationExamples } from "../recipes/shadcn/examples/table-pagination-examples.mjs";
import { menuExamples } from "../recipes/shadcn/examples/menu-examples.mjs";
import { topNavigationExamples } from "../recipes/shadcn/examples/top-navigation-examples.mjs";
import { bottomNavigationExamples } from "../recipes/shadcn/examples/bottom-navigation-examples.mjs";
import { sideNavigationExamples } from "../recipes/shadcn/examples/side-navigation-examples.mjs";
// Phase 5 Disclosure
import { accordionExamples } from "../recipes/shadcn/examples/accordion-examples.mjs";
import { collapsibleExamples } from "../recipes/shadcn/examples/collapsible-examples.mjs";
import { treeViewExamples } from "../recipes/shadcn/examples/tree-view-examples.mjs";
// Phase 1 Form remaining
import { toggleExamples } from "../recipes/shadcn/examples/toggle-examples.mjs";
import { sliderExamples } from "../recipes/shadcn/examples/slider-examples.mjs";
import { selectExamples } from "../recipes/shadcn/examples/select-examples.mjs";
import { inputOtpExamples } from "../recipes/shadcn/examples/input-otp-examples.mjs";
import { datePickerExamples } from "../recipes/shadcn/examples/date-picker-examples.mjs";
import { timePickerExamples } from "../recipes/shadcn/examples/time-picker-examples.mjs";
import { wheelPickerExamples } from "../recipes/shadcn/examples/wheel-picker-examples.mjs";
// Phase 6 Data
import { tableExamples } from "../recipes/shadcn/examples/table-examples.mjs";
import { chartExamples } from "../recipes/shadcn/examples/chart-examples.mjs";
// Groo 도메인 spec (shadcn 외) — 2026-05-15 추가
import { colorSwatchExamples } from "../recipes/shadcn/examples/color-swatch-examples.mjs";
import { iconPickerExamples } from "../recipes/shadcn/examples/icon-picker-examples.mjs";
import { searchableListExamples } from "../recipes/shadcn/examples/searchable-list-examples.mjs";
// 마무리(2026-10-15) — SEED Quantity Picker · Attachment Input · Footer
import { quantityPickerExamples } from "../recipes/shadcn/examples/quantity-picker-examples.mjs";
import { attachmentInputExamples } from "../recipes/shadcn/examples/attachment-input-examples.mjs";
import { footerExamples } from "../recipes/shadcn/examples/footer-examples.mjs";

import {
  brandProfile,
  pageCss as previewPageCss,
  parseTokensFromCss,
  renderButtonGallery,
  renderListingDetail,
  renderEmptyState,
  renderSnackbars,
  renderSkeleton,
  renderForm,
  renderBatchV67,
  renderShadcnNav,
  renderShadcnDisclose,
  renderShadcnExtras,
  renderBatchV73V78,
  renderFinishGallery,
  renderVignettes,
} from "./build-preview-html.mjs";

const SHADCN_EXAMPLES = {
  // Form (Phase 1)
  button: buttonExamples,
  input: inputExamples,
  textarea: textareaExamples,
  field: fieldExamples,
  "input-button": inputButtonExamples,
  checkbox: checkboxExamples,
  "radio-group": radioGroupExamples,
  "select-box": selectBoxExamples,
  switch: switchExamples,
  chip: chipExamples,
  "floating-action-button": floatingActionButtonExamples,
  "quantity-picker": quantityPickerExamples,
  "attachment-input": attachmentInputExamples,
  // Display (Phase 2)
  badge: badgeExamples,
  "notification-badge": notificationBadgeExamples,
  "tag-group": tagGroupExamples,
  avatar: avatarExamples,
  card: cardExamples,
  list: listExamples,
  divider: dividerExamples,
  skeleton: skeletonExamples,
  "aspect-ratio": aspectRatioExamples,
  "image-frame": imageFrameExamples,
  "logo-tile": logoTileExamples,
  progress: progressExamples,
  "progress-circle": progressCircleExamples,
  "scroll-area": scrollAreaExamples,
  "scroll-auto-hide": scrollAutoHideExamples,
  "scroll-fog": scrollFogExamples,
  "content-placeholder": contentPlaceholderExamples,
  typography: typographyExamples,
  resizable: resizableExamples,
  callout: calloutExamples,
  "page-banner": pageBannerExamples,
  "result-section": resultSectionExamples,
  // Overlay (Phase 3)
  tooltip: tooltipExamples,
  "help-bubble": helpBubbleExamples,
  dialog: dialogExamples,
  "alert-dialog": alertDialogExamples,
  popover: popoverExamples,
  "side-panel": sidePanelExamples,
  "bottom-sheet": bottomSheetExamples,
  snackbar: snackbarExamples,
  "menu-sheet": menuSheetExamples,
  "swipe-actions": swipeActionsExamples,
  // Phase 4 Navigation
  tabs: tabsExamples,
  "segmented-control": segmentedControlExamples,
  pagination: paginationExamples,
  "table-pagination": tablePaginationExamples,
  menu: menuExamples,
  "top-navigation": topNavigationExamples,
  "bottom-navigation": bottomNavigationExamples,
  "side-navigation": sideNavigationExamples,
  footer: footerExamples,
  // Phase 5 Disclosure
  accordion: accordionExamples,
  collapsible: collapsibleExamples,
  "tree-view": treeViewExamples,
  // Phase 1 Form remaining
  toggle: toggleExamples,
  slider: sliderExamples,
  select: selectExamples,
  "input-otp": inputOtpExamples,
  "date-picker": datePickerExamples,
  "time-picker": timePickerExamples,
  "wheel-picker": wheelPickerExamples,
  // Phase 6 Data
  table: tableExamples,
  chart: chartExamples,
  // Groo 도메인 spec (shadcn 카탈로그 외) — 2026-05-15
  "color-swatch": colorSwatchExamples,
  "icon-picker": iconPickerExamples,
  "searchable-list": searchableListExamples,
};

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "exports/site");

function escape(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// 간단 Markdown → HTML 변환기 — specs/components/*.md 렌더 전용 (외부 의존성 0).
// 처리: heading(#~####) / blockquote(>) / ul(- item) / fenced code(```) / table(|) / paragraph + inline (**bold** / `code` / [text](url)).
function mdToHtml(md) {
  const lines = md.split("\n");
  const out = [];
  let i = 0;

  function inline(s) {
    // escape 먼저 → 그 다음 inline 마크업을 HTML로 (escape 후라 안전한 패턴만 추가)
    let t = escape(s);
    // inline code `..`
    t = t.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
    // bold **..**
    t = t.replace(/\*\*([^*]+)\*\*/g, (_, c) => `<strong>${c}</strong>`);
    // link [text](url)
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => `<a href="${url}">${text}</a>`);
    return t;
  }

  while (i < lines.length) {
    const line = lines[i];

    // fenced code block
    if (/^```/.test(line)) {
      const lang = line.slice(3).trim();
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      out.push(`<pre><code${lang ? ` class="lang-${escape(lang)}"` : ""}>${escape(buf.join("\n"))}</code></pre>`);
      continue;
    }

    // heading
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const lvl = h[1].length;
      out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`);
      i++;
      continue;
    }

    // blockquote (연속된 > 줄을 한 블록으로)
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      out.push(`<blockquote>${inline(buf.join(" "))}</blockquote>`);
      continue;
    }

    // table — 헤더 + separator + 0..N data row
    if (/^\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const splitRow = (l) => l.replace(/^\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
      const header = splitRow(line);
      i += 2; // skip header + separator
      const rows = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      const thead = `<thead><tr>${header.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead>`;
      const tbody = `<tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody>`;
      out.push(`<table class="spec-table">${thead}${tbody}</table>`);
      continue;
    }

    // ul (연속된 - item 또는 * item)
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      out.push(`<ul>${items.map((it) => `<li>${inline(it)}</li>`).join("")}</ul>`);
      continue;
    }

    // 빈 줄
    if (line.trim() === "") {
      i++;
      continue;
    }

    // paragraph (다음 빈 줄까지)
    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,4}\s|>\s|```|[-*]\s|\|)/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    out.push(`<p>${inline(buf.join(" "))}</p>`);
  }

  return out.join("\n");
}

// kebab-case slug → PascalCase 컴포넌트 이름. "button" → "Button", "input-textarea" → "InputTextarea".
function capitalize(slug) {
  return String(slug)
    .split("-")
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

// ============================================================
// 1. tokens 통합 — 3 브랜드 단일 CSS
// ============================================================

// 토큰 빌드 결과를 두 형태로 분리:
//   - rootCss: 외부 <link> stylesheet — 브라우저가 즉시 적용 (FOUC 방지, layout 색상)
//   - tailwindBlock: 인라인 <style type="text/tailwindcss"> — Tailwind v4 CDN이 @theme 읽어 utility 생성
function buildTokens() {
  const def = readFileSync(resolve(ROOT, "exports/tokens.css"), "utf8");
  const hr = readFileSync(resolve(ROOT, "exports/tokens.hr.css"), "utf8");
  const desk = readFileSync(resolve(ROOT, "exports/tokens.desk.css"), "utf8");

  // Default에 brand fallback 4 토큰 + shadcn Tailwind v4 utility alias 추가.
  // @theme 안에 정의해야 Tailwind v4 CDN이 utility(`ring-ring`, `bg-secondary`,
  // `text-muted-foreground` 등)를 자동 생성함. 외부 tokens.css의 :root에만 두면
  // CSS variable로만 작동하고 utility는 미생성 — 컴포넌트 className이 무용지물됨.
  const shadcnAliases = [
    "  /* shadcn Tailwind v4 utility alias — bg-secondary, ring-ring, text-muted-foreground 등 자동 생성 */",
    "  --color-primary-foreground: var(--color-text-on-accent);",
    "  --color-secondary: var(--color-surface-input);",
    "  --color-secondary-foreground: var(--color-text-primary);",
    "  --color-muted: var(--color-surface-input);",
    "  --color-muted-foreground: var(--color-text-secondary);",
    "  --color-accent: var(--color-surface-input);",
    "  --color-accent-foreground: var(--color-text-primary);",
    "  --color-destructive: var(--color-error);",
    "  --color-destructive-foreground: var(--color-text-on-accent);",
    "  --color-border: var(--color-border-default);",
    "  --color-input: var(--color-border-default);",
    "  --color-ring: var(--color-border-focus);",
    "  --color-card: var(--color-surface-default);",
    "  --color-card-foreground: var(--color-text-primary);",
    "  --color-popover: var(--color-surface-default);",
    "  --color-popover-foreground: var(--color-text-primary);",
    "  --color-background: var(--color-bg-page);",
    "  --color-foreground: var(--color-text-primary);",
  ].join("\n");

  // 브랜드 파일에만 있는 색 — v102 브랜드 역할(bg-brand-solid · fg-brand · stroke-focus-ring …) ·
  // v108 브랜드 팔레트(brand-100 ~ 1000). 옛 이름(primary · border-focus …)도 v108 부터 이 역할을 가리킨다.
  // Default 는 브랜드 팔레트를 회색 단계로 채워 중립으로 두고 역할 정의는 Desk 것을 빌린다 —
  // @theme 안에 있어야 Tailwind 가 bg-bg-brand-solid 같은 utility 를 만든다(Button 예제).
  const colorDefs = (cssText) =>
    new Map([...cssText.matchAll(/^\s*--(color-[a-z0-9-]+):\s*([^;]+);/gm)].map((m) => [m[1], m[2].trim()]));
  const sharedDefs = colorDefs(def);
  const brandOnly = [...colorDefs(desk)].filter(([n]) => !sharedDefs.has(n));
  const OLD_BRAND = /^color-(primary|primary-light|border-focus|border-focus-light)$/;
  const neutralBrand = brandOnly
    .filter(([n]) => !OLD_BRAND.test(n))
    .map(([n, v]) => {
      const step = /^color-brand-(\d+)(-dark)?$/.exec(n);
      return `  --${n}: ${step ? `var(--color-gray-${step[1]}${step[2] || ""})` : v};`;
    })
    .join("\n");

  const defaultWithFallback = def.replace(
    /@theme\s*\{/,
    "@theme {\n  /* Brand fallback — Default = neutral, no specific accent */\n  --color-primary: #1a1f2e;\n  --color-primary-light: #4a5568;\n  --color-border-focus: #1a1f2e;\n  --color-border-focus-light: #4a5568;\n" + neutralBrand + "\n" + shadcnAliases + "\n",
  );

  // @theme 내용 추출 → :root 미러 (브라우저가 즉시 적용)
  const themeMatch = /@theme\s*\{([\s\S]*?)\n\}/.exec(defaultWithFallback);
  const themeContent = themeMatch ? themeMatch[1] : "";
  const rootBlock = `:root, [data-brand="default"] {${themeContent}\n}`;

  // Keyframes — preview tokens*.css의 Animation library 추출 (모든 브랜드 공통)
  const keyframesMatch = def.match(/(\/\* Keyframes[\s\S]*?)$/);
  const keyframes = keyframesMatch ? keyframesMatch[1].trim() : "";

  // brand override (@theme 외부, CSS variable만 재정의) — 브랜드 파일에만 있는 색을 모두 덮는다.
  // 옛 이름 넷만 덮던 때는 v108 부터 그 이름이 가리키는 역할(fg-brand …)이 없어 브랜드를 바꾸면 색이 빠졌다.
  const brandOverride = (cssText, attr) => {
    const own = colorDefs(cssText);
    const tokens = [...own].filter(([n]) => !sharedDefs.has(n)).map(([n, v]) => `  --${n}: ${v};`);
    return `[data-brand="${attr}"] {\n${tokens.join("\n")}\n}`;
  };

  const darkBlock = [
    "[data-theme=\"dark\"] {",
    "  --color-bg-page: var(--color-bg-page-dark);",
    "  --color-surface-default: var(--color-surface-default-dark);",
    "  --color-surface-input: var(--color-surface-input-dark);",
    "  --color-text-primary: var(--color-text-primary-dark);",
    "  --color-text-secondary: var(--color-text-secondary-dark);",
    "  --color-text-tertiary: var(--color-text-tertiary-dark);",
    "  --color-text-disabled: var(--color-text-disabled-dark);",
    "  --color-border-default: var(--color-border-default-dark);",
    "  --color-border-strong: var(--color-border-strong-dark);",
    "  /* focus ring: 다크 표면 위에서 시인성 확보 — primary-light(=border-focus-light)로 swap */",
    "  --color-border-focus: var(--color-border-focus-light);",
    "  --shadow-sm: var(--shadow-sm-dark);",
    "  --shadow-md: var(--shadow-md-dark);",
    "  --shadow-lg: var(--shadow-lg-dark);",
    "  --shadow-xl: var(--shadow-xl-dark);",
    "  /* v105 고도 그림자(s1 ~ s4)도 다크 짝으로 — Select 목록(s3)이 다크에서 라이트 그림자로 남았다 */",
    "  --shadow-s1: var(--shadow-s1-dark);",
    "  --shadow-s2: var(--shadow-s2-dark);",
    "  --shadow-s3: var(--shadow-s3-dark);",
    "  --shadow-s4: var(--shadow-s4-dark);",
    "  /* v102 역할 색(bg · fg · stroke)도 다크 짝으로 — 위 옛 이름만 바꾸던 때는 역할을 쓰는 예제(Button)가 다크에서 라이트 값을 썼다 */",
    "  /* 카테고리 색(chart-* · -weak · -subtle · -contrast, v110 · v111)도 — List 의 타일이 다크에서 라이트 옅은 바탕으로 남았다 */",
    ...[...new Set([...sharedDefs.keys(), ...brandOnly.map(([n]) => n)])]
      .filter((n) => /^color-(bg|fg|stroke|chart)-/.test(n) && !n.endsWith("-dark") && (sharedDefs.has(`${n}-dark`) || brandOnly.some(([b]) => b === `${n}-dark`)))
      .map((n) => `  --${n}: var(--${n}-dark);`),
    "}",
  ].join("\n");

  // shadcn alias bridge — recipes/shadcn/styles/groo-shadcn-bridge.css 그대로 합침
  // (`--ring`, `--color-ring`, `--color-primary-foreground` 등 — shadcn 컴포넌트가
  // 기대하는 변수명을 Groo 토큰으로 alias)
  const bridgePath = resolve(ROOT, "recipes/shadcn/styles/groo-shadcn-bridge.css");
  const bridgeCss = existsSync(bridgePath) ? readFileSync(bridgePath, "utf8") : "";

  // === rootCss: 외부 stylesheet ===
  const rootCss = [
    "/* Generated by scripts/build-site.mjs — :root fallback (FOUC 방지) */",
    "/* Tailwind v4 CDN이 처리하기 전에도 브라우저가 즉시 CSS variable 적용 */",
    "",
    rootBlock,
    "",
    brandOverride(hr, "hr"),
    "",
    brandOverride(desk, "desk"),
    "",
    darkBlock,
    "",
    keyframes,
    "",
    bridgeCss,
  ].join("\n");

  // === tailwindBlock: 인라인 <style type="text/tailwindcss"> ===
  // Tailwind v4 CDN이 @theme 블록을 읽어 utility class(.bg-primary 등) 생성.
  // brand override / dark mode block도 같이 포함 — Tailwind가 인라인 style 안에서 모두 인식.
  const tailwindBlock = [
    defaultWithFallback,  // @theme {} 블록 그대로
    "",
    // 레시피의 dark: 변형이 OS 설정이 아니라 사이트 테마(data-theme)를 따르게 한다 — 딤 0.50 · 0.65 같은 값
    "@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));",
    "",
    brandOverride(hr, "hr"),
    "",
    brandOverride(desk, "desk"),
    "",
    darkBlock,
    "",
    bridgeCss,
  ].join("\n");

  return { rootCss, tailwindBlock };
}


// ============================================================
// 2. 사이트 layout CSS (sidebar / topbar / content)
// ============================================================

function siteCss() {
  return `
:root { color-scheme: light dark; }
* { box-sizing: border-box; }
html { scroll-behavior: smooth; word-break: keep-all; overflow-wrap: break-word; } /* 한국어 줄바꿈 — 단어 단위(DESIGN.md v114) */
body {
  font-family: var(--font-sans);
  margin: 0;
  background: var(--color-bg-page);
  color: var(--color-text-primary);
  font-size: var(--text-body-md);
  line-height: var(--text-body--line-height);
  letter-spacing: var(--text-body--letter-spacing);
  /* macOS subpixel antialiasing 끄고 grayscale로 — preview-html과 시각 통일(얇은 Toss 톤).
     기본 subpixel은 한글 같은 두께 글꼴을 더 굵게 보이게 함. */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* === 전역 스크롤바 — Scroll Area(2026-10-10, specs/components/scroll-area.yaml) ===
   recipes/shadcn/styles/groo-shadcn-bridge.css 와 같은 계약이다 — 세로 · 가로 6px 알약 · 막대 stroke-neutral-solid · 바탕 · 모서리 투명.
   크로미움 · 사파리는 webkit 규칙, Firefox 만 표준 두 줄(scrollbar-width thin · scrollbar-color)을 @supports not selector(::-webkit-scrollbar) 안에 둔다 —
   크로미움은 scrollbar-width · scrollbar-color 가 걸린 요소에서 ::-webkit-scrollbar 를 버려 6px 이 10px(thin) · 15px(color 만)로 바뀐다.
   .scrollbar-hide 는 가로 줄(칩 · 탭 · 가로 카드)에만 — 세로 스크롤바는 숨기지 않는다 */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--color-stroke-neutral-solid); border-radius: var(--radius-full); }
::-webkit-scrollbar-corner { background: transparent; }
@supports not selector(::-webkit-scrollbar) {
  * { scrollbar-width: thin; scrollbar-color: var(--color-stroke-neutral-solid) transparent; }
}
.scrollbar-hide { scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }

/* === Layout === */
.app { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
.sidebar {
  border-inline-end: 1px solid var(--color-border-default);
  background: var(--color-surface-default);
  padding: 24px 16px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
.main { min-width: 0; }
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-bottom: 1px solid var(--color-border-default);
  background: var(--color-surface-default);
  position: sticky; top: 0; z-index: 100;
}
.content {
  padding: 48px 56px 96px;
  max-width: 920px;
}

/* === Sidebar === */
.brand-row { display: flex; align-items: center; gap: 8px; padding: 4px 8px 24px; }
.brand-row strong { font-size: var(--text-title-md); font-weight: 700; color: var(--color-primary); letter-spacing: -0.01em; }
.brand-row .brand-tag { font-size: var(--text-label-sm); padding: 2px 8px; border-radius: var(--radius-sm); background: var(--color-surface-input); color: var(--color-text-tertiary); font-weight: 600; }

.nav-section { margin-bottom: 24px; }
.nav-eyebrow {
  font-size: var(--text-label-sm);
  font-weight: 700;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0 12px;
  margin-bottom: 8px;
}
.nav-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.nav-list a {
  display: block;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--text-label-md);
  transition: all var(--motion-duration-fast) var(--motion-ease-out);
}
.nav-list a:hover { background: var(--color-surface-input); color: var(--color-text-primary); }
.nav-list a[aria-current="page"] {
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
  font-weight: 600;
}
.nav-list a.disabled { color: var(--color-text-disabled); cursor: not-allowed; pointer-events: none; }
.nav-list a .badge-soon { font-size: 10px; padding: 1px 6px; background: var(--color-surface-input); border-radius: var(--radius-full); margin-inline-start: 6px; color: var(--color-text-tertiary); font-weight: 500; }

/* === Topbar controls === */
.crumbs { font-size: var(--text-caption); color: var(--color-text-tertiary); display: flex; align-items: center; gap: 6px; }
.crumbs a { color: var(--color-text-secondary); text-decoration: none; }
.crumbs a:hover { color: var(--color-text-primary); }
.crumbs span { color: var(--color-text-tertiary); }

.controls { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.brand-switch { display: inline-flex; padding: 3px; background: var(--color-surface-input); border-radius: var(--radius-full); gap: 2px; flex-shrink: 0; }
.sidebar .brand-switch { display: none; margin: 0 4px 16px; }
.brand-switch button {
  border: 0; background: transparent;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-label-sm); font-weight: 600;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all var(--motion-duration-fast) var(--motion-ease-out);
  white-space: nowrap;
}
.brand-switch button[aria-pressed="true"] {
  background: var(--color-surface-default);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}
.theme-toggle {
  border: 1px solid var(--color-border-default);
  background: var(--color-surface-default);
  border-radius: var(--radius-full);
  padding: 4px 10px;
  cursor: pointer;
  font-size: var(--text-label-sm); font-weight: 500;
  color: var(--color-text-secondary);
  display: inline-flex; align-items: center; gap: 6px;
  flex-shrink: 0;
  white-space: nowrap;
}
.theme-toggle:hover { color: var(--color-text-primary); }
.theme-toggle-label { display: inline; }

/* === Content typography === */
.content h1 {
  font-size: var(--text-display-md);
  font-weight: 700;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
  line-height: 1.1;
}
.content .lede {
  font-size: var(--text-body-lg);
  color: var(--color-text-secondary);
  margin: 0 0 40px;
  line-height: 1.6;
}
/* 직접 자식 selector로 격리 — spec-section 안의 h2, example-preview 안의
   DialogTitle(h2)에 무차별 적용되어 양쪽 라인 충돌이 생겼던 문제 fix. */
.content > h2 {
  font-size: var(--text-display-sm);
  font-weight: 700;
  margin: 56px 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border-default);
  letter-spacing: -0.01em;
}
.content h3 { font-size: var(--text-title-md); font-weight: 600; margin: 32px 0 12px; }
.content h4 { font-size: var(--text-title-sm); font-weight: 600; margin: 24px 0 8px; color: var(--color-text-secondary); }
.content p { margin: 12px 0; color: var(--color-text-primary); }
.content code {
  background: var(--color-surface-input);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 0.9em;
}
.content pre {
  margin: 16px 0;
  padding: 16px 20px;
  border-radius: var(--radius-md);
  overflow-x: auto;
  background: var(--color-surface-default);
  border: 1px solid var(--color-border-default);
  font-size: 13px;
  line-height: 1.6;
}
.content pre code { background: transparent; padding: 0; font-size: inherit; }
/* 문서의 표만 — 예제 미리보기 안의 표(Table 레시피의 DOM)는 제 클래스로 그린다(2026-10-08 — 이 규칙이 층 없는 CSS 라 Tailwind 를 덮었다) */
.content table:not(.example-preview *) { width: 100%; border-collapse: collapse; font-size: var(--text-caption); margin: 16px 0; }
.content thead:not(.example-preview *) { background: var(--color-surface-input); }
.content :is(th, td):not(.example-preview *) { padding: 10px 12px; text-align: start; border-bottom: 1px solid var(--color-border-default); }
.content th:not(.example-preview *) { font-weight: 600; color: var(--color-text-secondary); }

/* === Hero (landing) === */
.hero {
  padding: 80px 0 48px;
  border-bottom: 1px solid var(--color-border-default);
  margin-bottom: 64px;
}
.hero-eyebrow {
  display: inline-block;
  font-size: var(--text-label-sm);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 12px;
}
.hero h1 {
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin: 0 0 20px;
}
.hero p {
  font-size: var(--text-body-lg);
  line-height: 1.6;
  max-width: 640px;
  color: var(--color-text-secondary);
  margin: 0 0 32px;
}
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }

.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-size: var(--text-body-md); font-weight: 600;
  cursor: pointer; border: 0;
  font-family: inherit;
  text-decoration: none;
  transition: all var(--motion-duration-fast) var(--motion-ease-out);
}
.btn--primary { background: var(--color-primary); color: var(--color-text-on-accent); }
.btn--primary:hover { box-shadow: var(--shadow-md); }
.btn--outline { background: transparent; color: var(--color-primary); border: 1px solid var(--color-primary); }
.btn--outline:hover { background: color-mix(in srgb, var(--color-primary) 6%, transparent); }
.btn--ghost { background: transparent; color: var(--color-text-primary); }
.btn--ghost:hover { background: var(--color-surface-input); }

/* === Brand identity cards === */
.identity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin: 32px 0;
}
.identity-card {
  background: var(--color-surface-default);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex; flex-direction: column; gap: 12px;
}
.identity-tag {
  display: inline-block;
  font-size: var(--text-label-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-tertiary);
}
.identity-card h3 { margin: 0; font-size: var(--text-title-sm); }
.identity-card p { margin: 0; color: var(--color-text-secondary); font-size: var(--text-label-md); line-height: 1.6; }
.identity-swatch {
  width: 56px; height: 56px;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 18px;
  box-shadow: var(--shadow-sm);
}

/* === Token page utilities === */
.swatch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; margin: 16px 0 32px; }
.swatch {
  background: var(--color-surface-default);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.swatch-color { height: 80px; }
.swatch-meta { padding: 12px; display: flex; flex-direction: column; gap: 2px; }
.swatch-name { font-size: var(--text-label-md); font-weight: 600; font-family: ui-monospace, monospace; }
.swatch-hex { font-size: var(--text-label-sm); color: var(--color-text-tertiary); font-family: ui-monospace, monospace; }

.spec-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 16px 0;
}
.spec-card {
  background: var(--color-surface-default);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: 20px;
}
.spec-card h4 { margin: 0 0 12px; font-size: var(--text-label-md); color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; font-family: ui-monospace, monospace; }

.type-row {
  display: grid; grid-template-columns: 200px 1fr; gap: 24px;
  align-items: baseline;
  padding: 20px 0;
  border-bottom: 1px solid var(--color-border-default);
}
.type-row:last-child { border-bottom: 0; }
.type-row .meta { font-size: var(--text-label-sm); color: var(--color-text-tertiary); font-family: ui-monospace, monospace; line-height: 1.6; }
.type-row .meta strong { color: var(--color-text-primary); display: block; margin-bottom: 4px; }
.type-row .sample { color: var(--color-text-primary); }

.spacing-row {
  display: grid; grid-template-columns: 80px 100px 1fr; gap: 16px;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border-default);
}
.spacing-row:last-child { border-bottom: 0; }
.spacing-name { font-family: ui-monospace, monospace; font-size: var(--text-label-md); font-weight: 600; }
.spacing-value { font-size: var(--text-caption); color: var(--color-text-tertiary); font-family: ui-monospace, monospace; }
.spacing-bar { height: 24px; background: color-mix(in srgb, var(--color-primary) 30%, transparent); border-radius: var(--radius-sm); }

.radius-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; margin: 16px 0; }
.radius-card { background: var(--color-surface-default); padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 12px; border: 1px solid var(--color-border-default); border-radius: var(--radius-md); }
.radius-shape { width: 80px; height: 80px; background: var(--color-primary); }

.shadow-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; margin: 24px 0; padding: 32px; background: var(--color-bg-page); border-radius: var(--radius-md); }
.shadow-card { background: var(--color-surface-default); border-radius: var(--radius-md); padding: 24px; text-align: center; }

.motion-card { background: var(--color-surface-default); border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: 20px; display: flex; flex-direction: column; gap: 12px; align-items: center; }
.motion-name { font-family: ui-monospace, monospace; font-size: var(--text-label-md); font-weight: 600; }
.motion-value { font-size: var(--text-label-sm); color: var(--color-text-tertiary); font-family: ui-monospace, monospace; }
.motion-demo { width: 56px; height: 56px; border-radius: var(--radius-md); background: var(--color-primary); }

@keyframes site-fade-in { from { opacity: 0 } to { opacity: 1 } }
@keyframes site-spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }

.bp-row { display: grid; grid-template-columns: 120px 100px 1fr; gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--color-border-default); align-items: center; }
.bp-row:last-child { border-bottom: 0; }
.bp-name { font-family: ui-monospace, monospace; font-weight: 600; }
.bp-value { color: var(--color-text-tertiary); font-family: ui-monospace, monospace; font-size: var(--text-caption); }
.bp-note { color: var(--color-text-secondary); font-size: var(--text-label-md); }

.zindex-stack { position: relative; isolation: isolate; height: 280px; background: var(--color-bg-page); border-radius: var(--radius-md); padding: 16px; overflow: hidden; }
.zindex-card {
  position: absolute;
  background: var(--color-surface-default);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  box-shadow: var(--shadow-md);
  font-size: var(--text-caption);
  font-family: ui-monospace, monospace;
  font-weight: 600;
}

/* === Component pages === */
.component-meta { display: flex; gap: 16px; margin: 16px 0 32px; padding-bottom: 16px; border-bottom: 1px solid var(--color-border-default); flex-wrap: wrap; }
.component-meta a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  text-decoration: none;
  background: var(--color-surface-default);
  transition: all var(--motion-duration-fast) var(--motion-ease-out);
}
.component-meta a:hover { color: var(--color-primary); border-color: var(--color-primary); }
.component-meta a.tag {
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
  border-color: transparent;
  color: var(--color-primary);
  font-weight: 600;
  pointer-events: none;
}

.example-block {
  margin: 16px 0 32px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-surface-default);
}
.example-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: var(--color-surface-input);
  border-bottom: 1px solid var(--color-border-default);
}
.example-tabs { display: inline-flex; gap: 0; }
.example-tab {
  font-size: var(--text-label-sm);
  font-weight: 600;
  padding: 4px 12px;
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.example-tab[aria-selected="true"] { background: var(--color-surface-default); color: var(--color-primary); box-shadow: var(--shadow-sm); }
.example-copy {
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: var(--text-label-sm);
  color: var(--color-text-secondary);
  font-family: inherit;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
}
.example-copy:hover { color: var(--color-text-primary); background: var(--color-surface-default); }
.example-copy.copied { color: var(--color-success); }
.example-block pre { margin: 0; padding: 16px 20px; background: transparent; border: 0; border-radius: 0; }
.example-block pre code { background: transparent; padding: 0; }
.example-label { font-size: var(--text-label-sm); color: var(--color-text-tertiary); padding: 6px 16px 12px; font-style: italic; }
/* font-family 명시 — Tailwind v4 browser CDN의 preflight가 body font-family를
   override할 수 있어, preview wrapper에서 Pretendard을 강제로 다시 인용. */
.example-preview { padding: 32px 24px; background: var(--color-bg-page); min-height: 120px; display: flex; align-items: center; justify-content: center; font-family: var(--font-sans); }
.example-preview > .preview-frame { width: 100%; max-width: 600px; }
.example-code { background: var(--color-surface-default); }

.callout {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-inline-start: 3px solid var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 6%, transparent);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  margin: 16px 0;
  font-size: var(--text-label-md);
}
.callout strong { color: var(--color-primary); }

/* === Mobile === */
.mobile-toggle { display: none; }
.mobile-overlay { display: none; }
@media (max-width: 880px) {
  .app { grid-template-columns: 1fr; }
  .sidebar { position: fixed; inset: 0 30% 0 0; z-index: 200; transform: translateX(-100%); transition: transform var(--motion-duration-base) var(--motion-ease-out); box-shadow: var(--shadow-xl); }
  .sidebar[data-open="true"] { transform: translateX(0); }
  .topbar { padding: 12px 16px; gap: 8px; }
  .content { padding: 32px 16px 64px; }
  .mobile-toggle { display: inline-flex; }
  .mobile-overlay[data-open] { display: block; position: fixed; inset: 0; background: var(--overlay-dim-light); z-index: 150; }
  /* 좁은 viewport — crumbs 줄임, theme 라벨 숨김, brand-switch 컴팩트 */
  .crumbs { min-width: 0; overflow: hidden; }
  .crumbs > a:not(:last-child), .crumbs > span:not(:last-child) { display: none; }
  .theme-toggle-label { display: none; }
  .theme-toggle { padding: 4px 8px; }
  .brand-switch button { padding: 4px 8px; }
}
@media (max-width: 600px) {
  /* 더 좁아지면 topbar brand-switch 숨김 — sidebar 안에서 표시 */
  .topbar .brand-switch { display: none; }
  .sidebar .brand-switch { display: inline-flex; align-self: flex-start; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* === Spec section (M3 톤 detailed spec, specs/components/*.md 렌더) === */
.spec-section {
  margin: 32px 0 48px;
  padding: 24px;
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  background: var(--color-surface-default);
}
.spec-section > h1:first-child {
  margin-top: 0;
  font-size: var(--text-display-sm);
  line-height: var(--text-display-sm--line-height);
  font-weight: 700;
  color: var(--color-text-primary);
}
.spec-section h2 {
  margin: 32px 0 12px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-default);
  font-size: var(--text-title-lg);
  line-height: var(--text-title-lg--line-height);
  font-weight: 600;
  color: var(--color-text-primary);
}
.spec-section h3 {
  margin: 20px 0 8px;
  font-size: var(--text-title-md);
  line-height: var(--text-title-md--line-height);
  font-weight: 600;
  color: var(--color-text-primary);
}
.spec-section h4 {
  margin: 16px 0 6px;
  font-size: var(--text-title-sm);
  line-height: var(--text-title-sm--line-height);
  font-weight: 600;
  color: var(--color-text-primary);
}
.spec-section p {
  margin: 0 0 12px;
  font-size: var(--text-body-md);
  line-height: var(--text-body-md--line-height);
  color: var(--color-text-primary);
}
.spec-section ul {
  margin: 0 0 12px;
  padding-left: 20px;
}
.spec-section li {
  margin: 4px 0;
  font-size: var(--text-body-md);
  line-height: var(--text-body-md--line-height);
  color: var(--color-text-primary);
}
.spec-section blockquote {
  margin: 0 0 16px;
  padding: 12px 16px;
  border-left: 3px solid var(--color-border-focus);
  background: color-mix(in srgb, var(--color-border-focus) 6%, transparent);
  border-radius: 0 4px 4px 0;
  font-size: var(--text-body-md);
  line-height: var(--text-body-md--line-height);
  color: var(--color-text-primary);
}
.spec-section code {
  padding: 1px 6px;
  background: var(--color-surface-input);
  border-radius: 3px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.9em;
  color: var(--color-text-primary);
}
.spec-section pre {
  margin: 12px 0 16px;
  padding: 16px;
  background: var(--color-surface-input);
  border-radius: 8px;
  overflow-x: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: var(--text-body-sm);
  line-height: 1.6;
  color: var(--color-text-primary);
}
.spec-section pre code {
  padding: 0;
  background: transparent;
  border-radius: 0;
}
.spec-section table.spec-table {
  width: 100%;
  margin: 8px 0 16px;
  border-collapse: collapse;
  font-size: var(--text-body-sm);
  line-height: 1.5;
}
.spec-section table.spec-table thead {
  background: var(--color-surface-input);
}
.spec-section table.spec-table th {
  padding: 10px 12px;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border-default);
}
.spec-section table.spec-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--color-border-default);
  color: var(--color-text-primary);
  vertical-align: top;
}
.spec-section table.spec-table tbody tr:last-child td {
  border-bottom: 0;
}
.spec-section a {
  color: var(--color-primary);
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--color-primary) 40%, transparent);
  text-underline-offset: 2px;
}
.spec-section a:hover {
  text-decoration-color: var(--color-primary);
}
.tag-spec {
  background: color-mix(in srgb, var(--color-border-focus) 12%, transparent);
  color: var(--color-primary);
  border: 1px solid color-mix(in srgb, var(--color-border-focus) 30%, transparent);
}
`;
}

// ============================================================
// 3. 사이트 JS — brand toggle / theme toggle / mobile nav
// ============================================================

function siteJs() {
  return `
(function() {
  // Theme toggle
  function applyTheme(t) { document.documentElement.setAttribute("data-theme", t); }
  function getTheme() {
    try { return localStorage.getItem("groo-theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); }
    catch(e) { return "light"; }
  }
  applyTheme(getTheme());
  document.addEventListener("click", function(e) {
    var btn = e.target.closest(".theme-toggle");
    if (!btn) return;
    var c = document.documentElement.getAttribute("data-theme");
    var n = c === "dark" ? "light" : "dark";
    applyTheme(n);
    try { localStorage.setItem("groo-theme", n); } catch(e) {}
  });

  // Brand toggle
  function applyBrand(b) {
    document.documentElement.setAttribute("data-brand", b);
    document.querySelectorAll(".brand-switch button").forEach(function(btn) {
      btn.setAttribute("aria-pressed", btn.dataset.brand === b ? "true" : "false");
    });
    document.querySelectorAll(".brand-tag").forEach(function(tag) {
      tag.textContent = b === "hr" ? "HR" : b === "desk" ? "Desk" : "Default";
    });
  }
  function getBrand() {
    try { return localStorage.getItem("groo-brand") || "default"; }
    catch(e) { return "default"; }
  }
  applyBrand(getBrand());
  document.addEventListener("click", function(e) {
    var btn = e.target.closest(".brand-switch button");
    if (!btn) return;
    var b = btn.dataset.brand;
    if (!b) return;
    applyBrand(b);
    try { localStorage.setItem("groo-brand", b); } catch(e) {}
  });

  // Mobile sidebar
  function syncOverlay(open) {
    var ov = document.querySelector(".mobile-overlay");
    if (!ov) return;
    if (open) ov.setAttribute("data-open", "");
    else ov.removeAttribute("data-open");
  }
  document.addEventListener("click", function(e) {
    var t = e.target.closest(".mobile-toggle");
    var ov = e.target.closest(".mobile-overlay");
    var sb = document.querySelector(".sidebar");
    if (!sb) return;
    if (t) {
      var open = sb.getAttribute("data-open") === "true";
      var next = open ? "false" : "true";
      sb.setAttribute("data-open", next);
      syncOverlay(next === "true");
    } else if (ov) {
      sb.setAttribute("data-open", "false");
      syncOverlay(false);
    }
  });

  // Code copy
  document.addEventListener("click", function(e) {
    var btn = e.target.closest(".example-copy");
    if (!btn) return;
    var pre = btn.closest(".example-block").querySelector("pre code");
    if (!pre) return;
    var text = pre.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        btn.textContent = "Copied!";
        btn.classList.add("copied");
        setTimeout(function() { btn.textContent = "Copy"; btn.classList.remove("copied"); }, 1600);
      });
    }
  });

  // Example Preview / Code 탭 toggle
  document.addEventListener("click", function(e) {
    var tab = e.target.closest(".example-tab");
    if (!tab) return;
    var which = tab.dataset.tab;
    var block = tab.closest(".example-block");
    if (!block) return;
    block.querySelectorAll(".example-tab").forEach(function(t) {
      t.setAttribute("aria-selected", t.dataset.tab === which ? "true" : "false");
    });
    block.querySelectorAll("[data-pane]").forEach(function(p) {
      p.hidden = p.dataset.pane !== which;
    });
  });
})();
`;
}

// ============================================================
// 4. 공통 layout 래퍼
// ============================================================

// NAV는 빌드 시 컴포넌트로부터 동적 구성. buildNav()에서 호출.
let NAV = null;

function buildNav(components) {
  // Components 카테고리별 그룹화
  const byCategory = {};
  for (const c of components) {
    const cat = COMPONENT_CATEGORIES[c.slug];
    if (!cat) continue;
    byCategory[cat.category] = byCategory[cat.category] || [];
    byCategory[cat.category].push({ ...c, sort: cat.sort });
  }
  for (const k of Object.keys(byCategory)) {
    byCategory[k].sort((a, b) => a.sort - b.sort);
  }

  const nav = {
    "Getting Started": [
      { label: "Introduction", href: "/index.html" },
      { label: "Brand identity", href: "/index.html#brand-identity" },
      { label: "Quick start", href: "/index.html#quick-start" },
    ],
    "Tokens": [
      { label: "Colors", href: "/tokens/colors.html" },
      { label: "Typography", href: "/tokens/typography.html" },
      { label: "Spacing", href: "/tokens/spacing.html" },
      { label: "Radius", href: "/tokens/radius.html" },
      { label: "Shadows", href: "/tokens/shadows.html" },
      { label: "Motion", href: "/tokens/motion.html" },
      { label: "Breakpoints", href: "/tokens/breakpoints.html" },
      { label: "Z-index", href: "/tokens/z-index.html" },
    ],
  };

  // Components 카테고리를 sub-section으로
  for (const cat of CATEGORY_ORDER) {
    if (!byCategory[cat]) continue;
    nav[`Components — ${cat}`] = byCategory[cat].map(c => ({
      label: c.name,
      href: `/components/${c.slug}.html`,
    }));
  }

  nav["Examples"] = [{ label: "Coming soon (Phase 3)", soon: true }];

  return nav;
}

function renderSidebar(currentPath) {
  // 디렉토리 깊이 따라 상대 경로 prefix 계산
  const segments = currentPath.split("/").filter(Boolean).slice(0, -1).length;
  const prefix = segments === 0 ? "." : "..".repeat(segments - 1) + "..";

  function abs(href) {
    if (!href) return "#";
    return prefix + href;
  }

  let out = '<aside class="sidebar" aria-label="문서 네비게이션">';
  out += `<div class="brand-row"><strong>Groo</strong><span class="brand-tag">Default</span></div>`;
  // 좁은 viewport에서 topbar의 brand-switch가 숨겨졌을 때 sidebar 안에서 사용 가능
  out += `<div class="brand-switch" role="group" aria-label="브랜드 전환 (사이드바)">
    <button data-brand="default" aria-pressed="true" type="button">Default</button>
    <button data-brand="hr" aria-pressed="false" type="button">HR</button>
    <button data-brand="desk" aria-pressed="false" type="button">Desk</button>
  </div>`;
  for (const [section, items] of Object.entries(NAV)) {
    out += `<div class="nav-section"><div class="nav-eyebrow">${escape(section)}</div><ul class="nav-list">`;
    for (const it of items) {
      const href = it.href ? abs(it.href) : "#";
      const active = it.href && currentPath === it.href ? ' aria-current="page"' : "";
      const cls = it.soon ? "disabled" : "";
      const badge = it.soon ? '<span class="badge-soon">soon</span>' : "";
      out += `<li><a href="${escape(href)}" class="${cls}"${active}>${escape(it.label)}${badge}</a></li>`;
    }
    out += "</ul></div>";
  }
  out += "</aside>";
  return out;
}

function renderTopbar(currentPath, breadcrumb) {
  const segments = currentPath.split("/").filter(Boolean).slice(0, -1).length;
  const prefix = segments === 0 ? "." : "..".repeat(segments - 1) + "..";
  const home = prefix + "/index.html";

  let crumbs = `<a href="${escape(home)}">Groo</a>`;
  for (const c of breadcrumb) {
    crumbs += `<span>/</span>`;
    if (c.href) crumbs += `<a href="${escape(prefix + c.href)}">${escape(c.label)}</a>`;
    else crumbs += `<span>${escape(c.label)}</span>`;
  }

  return `
  <header class="topbar">
    <div class="crumbs">
      <button class="theme-toggle mobile-toggle" type="button" aria-label="메뉴 열기">☰</button>
      ${crumbs}
    </div>
    <div class="controls">
      <div class="brand-switch" role="group" aria-label="브랜드 전환">
        <button data-brand="default" aria-pressed="true" type="button">Default</button>
        <button data-brand="hr" aria-pressed="false" type="button">HR</button>
        <button data-brand="desk" aria-pressed="false" type="button">Desk</button>
      </div>
      <button class="theme-toggle" type="button" aria-label="테마 전환">🌓<span class="theme-toggle-label"> Theme</span></button>
    </div>
  </header>`;
}

// 모든 페이지 공유 — build 시점에 한 번 계산되고 page() 안에서 참조
let TAILWIND_BLOCK = "";

function page({ title, currentPath, breadcrumb, body }) {
  const segments = currentPath.split("/").filter(Boolean).slice(0, -1).length;
  const prefix = segments === 0 ? "." : "..".repeat(segments - 1) + "..";
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)} — Groo Design</title>
  <link rel="stylesheet" href="${prefix}/assets/tokens.css">
  <link rel="stylesheet" href="${prefix}/assets/site.css">
  <!-- Tailwind v4 browser CDN — @theme 토큰 읽어 utility class 런타임 컴파일 -->
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <!-- Tailwind 처리 대상 — @theme + brand override + dark mode. 인라인이라 CDN이 정확히 읽음 -->
  <style type="text/tailwindcss">
${TAILWIND_BLOCK}
  </style>
</head>
<body>
  <div class="app">
    ${renderSidebar(currentPath)}
    <div class="main">
      ${renderTopbar(currentPath, breadcrumb)}
      <main class="content">
${body}
      </main>
    </div>
  </div>
  <div class="mobile-overlay" hidden></div>
  <script src="${prefix}/assets/site.js" defer></script>
</body>
</html>
`;
}

// ============================================================
// 5. Landing 페이지
// ============================================================

function pageLanding() {
  const body = `
<section class="hero" id="hero">
  <span class="hero-eyebrow">Groo Design System</span>
  <h1>사람과 일상이<br>숲처럼 자라나는 시스템</h1>
  <p>HR과 Desk, 두 서비스를 위한 단일 디자인 시스템. 한국어 우선, 전 연령 접근성, Toss 톤의 절제와 신뢰감을 레퍼런스로 삼아 토큰부터 컴포넌트까지 일관된 톤을 정의합니다.</p>
  <div class="hero-actions">
    <a class="btn btn--primary" href="./tokens/colors.html">토큰 둘러보기</a>
    <a class="btn btn--outline" href="https://github.com/lshdainty/groo-design">GitHub</a>
  </div>
</section>

<section id="brand-identity">
  <h2>두 브랜드</h2>
  <p class="lede">같은 baseline, 다른 톤. 한 시스템 안에서 두 서비스의 정체성을 분리합니다.</p>

  <div class="identity-grid">
    <div class="identity-card">
      <span class="identity-swatch" style="background: #357B5F;">HR</span>
      <span class="identity-tag">B2B · 조직 HR</span>
      <h3>그루 이음</h3>
      <p>인사·결재·평가의 절제된 데이터 밀도. 격식체 톤, 데스크탑 중심, forest green primary. 결재 큐의 명확한 위계와 직원 detail의 깊이.</p>
      <code>--color-primary: #357B5F</code>
    </div>
    <div class="identity-card">
      <span class="identity-swatch" style="background: #0147AD;">D</span>
      <span class="identity-tag">B2C · 메모/할일/가계부</span>
      <h3>그루 담다</h3>
      <p>일상 메모와 할일의 친근한 모바일 톤. 친근체 부분 적용, bottom sheet · pull-to-refresh, cobalt blue primary. 매일의 기록을 단정하게.</p>
      <code>--color-primary: #0147AD</code>
    </div>
    <div class="identity-card">
      <span class="identity-swatch" style="background: #1A1F2E;">P</span>
      <span class="identity-tag">Baseline · 공유</span>
      <h3>Groo Default</h3>
      <p>두 브랜드 공통 토대. neutral 색상·타이포그래피·spacing·radius. brand-agnostic 컴포넌트의 reference. 새로운 brand 추가 시 진입점.</p>
      <code>baseline · 47 colors</code>
    </div>
  </div>
</section>

<section id="quick-start">
  <h2>Quick start</h2>
  <p class="lede">npm 설치 후 verify로 sync · lint · contrast 일괄 검증, build:preview / build:examples로 시각 카탈로그 + 사용 예제 페이지 생성.</p>
  <pre><code>npm install
npm run verify
npm run export:tailwind:all
npm run build:site</code></pre>

  <h3>핵심 가치</h3>
  <ul>
    <li><strong>한국어 우선</strong> — Pretendard 베이스, 본문 15/1.6 한국어 가독성 최적화</li>
    <li><strong>접근성</strong> — WCAG 1.4.3 (4.5:1) / 1.4.11 (3:1) / 2.5.5 (44×44 touch) 자동 검증</li>
    <li><strong>듀얼 브랜드</strong> — neutral baseline 공유 + brand 4 토큰만 fork (primary / primary-light / border-focus / border-focus-light)</li>
    <li><strong>외부 의존성 0</strong> — vanilla Node 도구, design.md spec 직접 파싱, Tailwind v4 native</li>
    <li><strong>다크 모드</strong> — light/dark pair 자동 검증 165 페어 (3 brand)</li>
  </ul>
</section>

<section id="numbers">
  <h2>현재 시스템</h2>
  <div class="spec-grid">
    <div class="spec-card">
      <h4>Tokens</h4>
      <p style="font-size: var(--text-title-md); font-weight: 700; color: var(--color-primary); margin: 0;">180+</p>
      <p style="margin: 4px 0 0; font-size: var(--text-caption); color: var(--color-text-tertiary);">colors · typography · spacing · radius · shadow · motion · breakpoint · touch · z-index · keyframes</p>
    </div>
    <div class="spec-card">
      <h4>Components</h4>
      <p style="font-size: var(--text-title-md); font-weight: 700; color: var(--color-primary); margin: 0;">80+</p>
      <p style="margin: 4px 0 0; font-size: var(--text-caption); color: var(--color-text-tertiary);">shadcn/ui ~100% coverage + Banner/Tag/Popover/File Upload/Treeview 누락 보강</p>
    </div>
    <div class="spec-card">
      <h4>Milestones</h4>
      <p style="font-size: var(--text-title-md); font-weight: 700; color: var(--color-primary); margin: 0;">v82</p>
      <p style="margin: 4px 0 0; font-size: var(--text-caption); color: var(--color-text-tertiary);">v1 → v82 누적 milestone, DESIGN.history/ milestone 백업 1:1</p>
    </div>
  </div>
</section>
`;
  return page({
    title: "Groo Design",
    currentPath: "/index.html",
    breadcrumb: [],
    body,
  });
}

// ============================================================
// 6. Token 페이지들
// ============================================================

function parseColorsBlock(md) {
  // YAML frontmatter colors block 추출
  const lines = md.split("\n");
  let start = -1, end = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (/^colors:\s*$/.test(lines[i])) { start = i; break; }
  }
  if (start === -1) return [];
  for (let i = start + 1; i < lines.length; i++) {
    if (/^---\s*$/.test(lines[i])) { end = i; break; }
    if (/^[a-z][a-zA-Z0-9_-]*:\s*$/.test(lines[i])) { end = i; break; }
  }
  const colors = [];
  let group = "general";
  for (let i = start + 1; i < end; i++) {
    const line = lines[i];
    const groupMatch = /^\s*#\s*===\s*(.+?)\s*===/.exec(line);
    if (groupMatch) { group = groupMatch[1]; continue; }
    const m = /^\s+([a-z][a-z0-9-]+):\s*"(#[0-9A-Fa-f]{6,8})"/.exec(line);
    if (m) colors.push({ name: m[1], hex: m[2], group });
  }
  return colors;
}

function pageColors() {
  const designMd = readFileSync(resolve(ROOT, "DESIGN.md"), "utf8");
  const colors = parseColorsBlock(designMd);

  // 그룹별 정렬
  const groupOrder = ["page", "surface", "text", "border", "semantic", "chart", "general"];
  const grouped = {};
  for (const c of colors) {
    let key = "general";
    if (c.name.startsWith("bg-")) key = "page";
    else if (c.name.startsWith("surface-")) key = "surface";
    else if (c.name.startsWith("text-")) key = "text";
    else if (c.name.startsWith("border-")) key = "border";
    else if (/^(success|error|warning|info)/.test(c.name)) key = "semantic";
    else if (c.name.startsWith("chart-")) key = "chart";
    grouped[key] = grouped[key] || [];
    grouped[key].push(c);
  }

  const groupTitles = {
    page: "Page background",
    surface: "Surface (default / input)",
    text: "Text (primary / secondary / tertiary / disabled / on-accent)",
    border: "Border (default / strong / focus)",
    semantic: "Semantic (success / error / warning / info)",
    chart: "Chart palette (10 categorical, light / dark variants)",
    general: "Other",
  };

  let groupsHtml = "";
  for (const k of groupOrder) {
    if (!grouped[k]) continue;
    groupsHtml += `<h3>${escape(groupTitles[k])}</h3>`;
    groupsHtml += `<div class="swatch-grid">`;
    for (const c of grouped[k]) {
      const isDark = c.name.endsWith("-dark");
      const isLight = c.name.endsWith("-light");
      const textColor = isDark || /^#[0-7][0-9a-f]{5}$/i.test(c.hex) ? "#fff" : "#000";
      groupsHtml += `<div class="swatch"><div class="swatch-color" style="background: ${c.hex}; color: ${textColor}; display: flex; align-items: center; justify-content: center; font-family: ui-monospace, monospace; font-size: 11px;">${escape(c.hex.toUpperCase())}</div><div class="swatch-meta"><span class="swatch-name">${escape(c.name)}</span></div></div>`;
    }
    groupsHtml += `</div>`;
  }

  const body = `
<h1>Colors</h1>
<p class="lede">Groo는 neutral baseline 47색 + brand 4색(primary / primary-light / border-focus / border-focus-light)으로 구성됩니다. 한국어 본문 4.5:1 대비비, UI 3:1을 모든 색 페어에 자동 검증합니다.</p>

<h2>브랜드 primary</h2>
<p>상단 토글로 Default / HR / Desk 전환하면 primary 색이 바뀌는 걸 확인할 수 있습니다. 4 토큰만 분기, 나머지는 모두 baseline 공유.</p>
<div class="swatch-grid">
  <div class="swatch"><div class="swatch-color" style="background: var(--color-primary); color: var(--color-text-on-accent); display: flex; align-items: center; justify-content: center; font-family: ui-monospace, monospace; font-size: 11px;">primary</div><div class="swatch-meta"><span class="swatch-name">--color-primary</span><span class="swatch-hex">brand-specific</span></div></div>
  <div class="swatch"><div class="swatch-color" style="background: var(--color-primary-light); color: var(--color-text-on-accent); display: flex; align-items: center; justify-content: center; font-family: ui-monospace, monospace; font-size: 11px;">primary-light</div><div class="swatch-meta"><span class="swatch-name">--color-primary-light</span><span class="swatch-hex">dark surface variant</span></div></div>
  <div class="swatch"><div class="swatch-color" style="background: var(--color-border-focus); color: var(--color-text-on-accent); display: flex; align-items: center; justify-content: center; font-family: ui-monospace, monospace; font-size: 11px;">border-focus</div><div class="swatch-meta"><span class="swatch-name">--color-border-focus</span><span class="swatch-hex">2px focus ring</span></div></div>
  <div class="swatch"><div class="swatch-color" style="background: var(--color-border-focus-light); color: var(--color-text-on-accent); display: flex; align-items: center; justify-content: center; font-family: ui-monospace, monospace; font-size: 11px;">border-focus-light</div><div class="swatch-meta"><span class="swatch-name">--color-border-focus-light</span><span class="swatch-hex">dark focus ring</span></div></div>
</div>

<h2>Baseline 47 colors</h2>
${groupsHtml}

<h2>WCAG 검증</h2>
<ul>
  <li><strong>1.4.3 Contrast (Minimum)</strong> — 본문 텍스트 4.5:1 (lint:all로 자동 검증)</li>
  <li><strong>1.4.11 Non-text Contrast</strong> — UI 컴포넌트 / focus indicator 3:1</li>
  <li><strong>1.4.3 Incidental</strong> — disabled / decorative 텍스트 예외 적용</li>
  <li>Dark mode: <code>npm run lint:dark:strict</code>로 165 페어 자동 검증 (3 brand)</li>
</ul>
`;
  return page({
    title: "Colors",
    currentPath: "/tokens/colors.html",
    breadcrumb: [{ label: "Tokens" }, { label: "Colors" }],
    body,
  });
}

function pageTypography() {
  // DESIGN.md typography 블록 파싱
  const md = readFileSync(resolve(ROOT, "DESIGN.md"), "utf8");
  const lines = md.split("\n");
  const types = [];
  let start = -1, end = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (/^typography:\s*$/.test(lines[i])) { start = i; break; }
  }
  if (start !== -1) {
    for (let i = start + 1; i < lines.length; i++) {
      if (/^---\s*$/.test(lines[i])) { end = i; break; }
      if (/^[a-z][a-zA-Z0-9_-]*:\s*$/.test(lines[i]) && !/^\s/.test(lines[i])) { end = i; break; }
    }
    let current = null;
    for (let i = start + 1; i < end; i++) {
      const line = lines[i];
      const nm = /^\s\s([a-z][a-z0-9-]+):\s*$/.exec(line);
      if (nm) {
        if (current) types.push(current);
        current = { name: nm[1] };
        continue;
      }
      const fm = /^\s\s\s\sfontSize:\s*"?(\d+px)"?/.exec(line);
      if (fm && current) current.fontSize = fm[1];
      const lh = /^\s\s\s\slineHeight:\s*"?([\d.]+)"?/.exec(line);
      if (lh && current) current.lineHeight = lh[1];
      const fw = /^\s\s\s\sfontWeight:\s*(\d+)/.exec(line);
      if (fw && current) current.fontWeight = fw[1];
      const ls = /^\s\s\s\sletterSpacing:\s*"?(-?[\d.]+(?:em|px)?)"?/.exec(line);
      if (ls && current) current.letterSpacing = ls[1];
    }
    if (current) types.push(current);
  }

  let rows = "";
  for (const t of types) {
    rows += `<div class="type-row">
      <div class="meta">
        <strong>${escape(t.name)}</strong>
        ${t.fontSize ? `${escape(t.fontSize)} / ` : ""}${t.lineHeight ? `${escape(t.lineHeight)} / ` : ""}${t.fontWeight ? escape(t.fontWeight) : ""}
        ${t.letterSpacing ? `<br>letter-spacing: ${escape(t.letterSpacing)}` : ""}
      </div>
      <div class="sample" style="font: var(--text-${t.name}--font-weight, 400) var(--text-${t.name}) / var(--text-${t.name}--line-height) var(--font-sans); letter-spacing: var(--text-${t.name}--letter-spacing, 0);">사람과 일상이 숲처럼 자라나는 디자인</div>
    </div>`;
  }

  const body = `
<h1>Typography</h1>
<p class="lede">Pretendard 한국어 우선, Inter 영문 fallback. 본문 15/1.6은 한국어 가독성 최적값 (Toss 베이스). 21종 스케일 — 한국어 + Airbnb 톤(display / title / nav-link / badge / uppercase-tag).</p>

<h2>Font family</h2>
<pre><code>--font-sans: "Pretendard", "Inter", system-ui, sans-serif;</code></pre>

<h2>Scale (${types.length}종)</h2>
${rows}

<h2>가이드</h2>
<ul>
  <li><strong>본문(body)</strong> — 한국어 15/1.6, 영문 16/1.5(body-md). letter-spacing 한국어 0, 영문 -0.01em</li>
  <li><strong>제목 위계</strong> — display-xl (Hero) / heading-xl (페이지 제목) / heading-lg (섹션) / heading-md (카드) / heading-sm (서브)</li>
  <li><strong>UI</strong> — caption-md (label) / caption (helper) / caption-sm (badge·메타) / button-md (버튼) / nav-link (사이드바 / 탭)</li>
  <li><strong>의미 기반</strong> — 크기·무게 직접 지정 금지. 토큰 이름으로만 사용</li>
</ul>
`;
  return page({
    title: "Typography",
    currentPath: "/tokens/typography.html",
    breadcrumb: [{ label: "Tokens" }, { label: "Typography" }],
    body,
  });
}

function pageSpacing() {
  const sizes = [
    { name: "xs", value: "4px" },
    { name: "sm", value: "8px" },
    { name: "md", value: "12px" },
    { name: "lg", value: "16px" },
    { name: "xl", value: "24px" },
    { name: "2xl", value: "32px" },
    { name: "3xl", value: "48px" },
  ];
  let rows = "";
  for (const s of sizes) {
    rows += `<div class="spacing-row">
      <div class="spacing-name">${escape(s.name)}</div>
      <div class="spacing-value">${escape(s.value)}</div>
      <div class="spacing-bar" style="width: ${s.value};"></div>
    </div>`;
  }
  const body = `
<h1>Spacing</h1>
<p class="lede">4px 베이스 7단계. 컴포넌트 padding / margin / gap을 일관되게 분배하기 위한 grid step. v62 Form layout(label↔control 4px / form-group 16px / section 24px) 기반.</p>

${rows}

<h2>사용 패턴</h2>
<ul>
  <li><code>xs</code> (4px) — icon ↔ text, label ↔ control, control ↔ helper</li>
  <li><code>sm</code> (8px) — chip 간격, badge padding, 작은 그룹</li>
  <li><code>md</code> (12px) — 카드 내부 그룹, list row gap</li>
  <li><code>lg</code> (16px) — form-group 간격, 카드 padding default</li>
  <li><code>xl</code> (24px) — section ↔ section, horizontal form label width gap</li>
  <li><code>2xl</code> (32px) — 페이지 본문 padding (데스크탑)</li>
  <li><code>3xl</code> (48px) — Hero 위/아래 여백, 페이지 단락</li>
</ul>
`;
  return page({
    title: "Spacing",
    currentPath: "/tokens/spacing.html",
    breadcrumb: [{ label: "Tokens" }, { label: "Spacing" }],
    body,
  });
}

function pageRadius() {
  const sizes = [
    { name: "xs", value: "2px" },
    { name: "sm", value: "4px" },
    { name: "md", value: "8px" },
    { name: "lg", value: "12px" },
    { name: "xl", value: "16px" },
    { name: "2xl", value: "20px" },
    { name: "full", value: "9999px" },
  ];
  let cards = "";
  for (const r of sizes) {
    cards += `<div class="radius-card">
      <div class="radius-shape" style="border-radius: ${r.value};"></div>
      <div class="spacing-name">${escape(r.name)}</div>
      <div class="spacing-value">${escape(r.value)}</div>
    </div>`;
  }
  const body = `
<h1>Radius</h1>
<p class="lede">spacing(4px 베이스)와 정렬된 7단계. xs(2px)부터 2xl(20px), full(알약·원형). 카드는 lg(12px), 버튼·input은 md(8px), 칩·badge는 sm(4px) 또는 full.</p>

<div class="radius-grid">${cards}</div>

<h2>사용 가이드</h2>
<ul>
  <li><code>xs</code> (2px) — 작은 tag, code highlight, sub-divider</li>
  <li><code>sm</code> (4px) — chip / badge default, 작은 input border</li>
  <li><code>md</code> (8px) — Button default, Input/Textarea default</li>
  <li><code>lg</code> (12px) — Card default, modal medium</li>
  <li><code>xl</code> (16px) — 큰 카드, modal large, sheet</li>
  <li><code>2xl</code> (20px) — Hero card, 강조 surface</li>
  <li><code>full</code> (9999px) — 알약 버튼, 아바타, 원형 icon button, chip pill</li>
</ul>
`;
  return page({
    title: "Radius",
    currentPath: "/tokens/radius.html",
    breadcrumb: [{ label: "Tokens" }, { label: "Radius" }],
    body,
  });
}

function pageShadows() {
  const shadows = [
    { name: "shadow-sm", desc: "subtle (border 대체)", use: "card hover, dropdown 미세 lift" },
    { name: "shadow-md", desc: "noticeable", use: "modal, dropdown panel, popover" },
    { name: "shadow-lg", desc: "prominent", use: "large modal, sheet" },
    { name: "shadow-xl", desc: "dramatic", use: "Hero overlay, floating action" },
  ];
  let cards = "";
  for (const s of shadows) {
    cards += `<div class="shadow-card" style="box-shadow: var(--${s.name});">
      <div style="font-family: ui-monospace, monospace; font-weight: 600;">${escape(s.name)}</div>
      <div style="font-size: var(--text-caption); color: var(--color-text-tertiary); margin-top: 4px;">${escape(s.desc)}</div>
      <div style="font-size: var(--text-label-sm); color: var(--color-text-secondary); margin-top: 8px;">${escape(s.use)}</div>
    </div>`;
  }
  const body = `
<h1>Shadows</h1>
<p class="lede">4단계 layered shadow (Material 3 / Big Sur 패턴). Tonal Layers(표면 휘도 차)가 1차 elevation 수단, shadow는 2차 보조. dark mode pair는 opacity 2~4배 강화 + inset white top highlight.</p>

<h2>Light surface</h2>
<div class="shadow-grid">${cards}</div>

<h2>토큰</h2>
<table>
<thead><tr><th>Token</th><th>레시피</th><th>주 사용</th></tr></thead>
<tbody>
<tr><td><code>shadow-sm</code></td><td>2-layer 미세 (1px + 4px blur)</td><td>card / dropdown 미세 lift</td></tr>
<tr><td><code>shadow-md</code></td><td>2-layer (4px + 8px blur)</td><td>modal / popover panel</td></tr>
<tr><td><code>shadow-lg</code></td><td>2-layer (12px + 24px blur)</td><td>large modal / sheet</td></tr>
<tr><td><code>shadow-xl</code></td><td>2-layer (24px + 48px blur)</td><td>Hero overlay / floating</td></tr>
</tbody>
</table>

<p>Dark mode 페어: <code>shadow-sm-dark</code> / <code>shadow-md-dark</code> / <code>shadow-lg-dark</code> / <code>shadow-xl-dark</code>. 표면 색이 어둡기 때문에 black opacity 2~4배 강화 + 1px 흰색 inset top highlight (광원 시뮬레이션).</p>

<p>spec(@google/design.md)이 shadow 토큰 타입을 정형화하지 않아 prose-token 패턴 — <code>scripts/build-tailwind-v4.mjs</code>의 <code>parseShadows</code>가 prose 표에서 직접 추출.</p>
`;
  return page({
    title: "Shadows",
    currentPath: "/tokens/shadows.html",
    breadcrumb: [{ label: "Tokens" }, { label: "Shadows" }],
    body,
  });
}

function pageMotion() {
  const durations = [
    { name: "motion-duration-fast", value: "150ms", use: "hover/focus 작은 전환" },
    { name: "motion-duration-base", value: "200ms", use: "drawer / dropdown default" },
    { name: "motion-duration-slow", value: "300ms", use: "modal / page transition" },
    { name: "motion-duration-slower", value: "500ms", use: "Hero / large layout shift" },
    { name: "motion-duration-loop", value: "1500ms", use: "skeleton / spinner / pulse" },
  ];
  const eases = [
    { name: "motion-ease-out", value: "cubic-bezier(0.16, 1, 0.3, 1)", use: "default — Toss · Material 공통" },
    { name: "motion-ease-linear", value: "linear", use: "loop 일정 속도" },
  ];

  let dRows = "";
  for (const d of durations) {
    dRows += `<div class="motion-card">
      <div class="motion-demo" style="animation: site-fade-in ${d.value} var(--motion-ease-out) infinite alternate;"></div>
      <div class="motion-name">${escape(d.name)}</div>
      <div class="motion-value">${escape(d.value)}</div>
      <div style="font-size: var(--text-label-sm); color: var(--color-text-secondary); text-align: center;">${escape(d.use)}</div>
    </div>`;
  }
  let eRows = "";
  for (const e of eases) {
    eRows += `<div class="motion-card">
      <div class="motion-demo" style="animation: site-spin var(--motion-duration-loop) ${e.value === 'linear' ? 'linear' : `var(--motion-ease-out)`} infinite;"></div>
      <div class="motion-name">${escape(e.name)}</div>
      <div class="motion-value" style="word-break: break-all; text-align: center;">${escape(e.value)}</div>
      <div style="font-size: var(--text-label-sm); color: var(--color-text-secondary); text-align: center;">${escape(e.use)}</div>
    </div>`;
  }

  const body = `
<h1>Motion</h1>
<p class="lede">5 duration + 2 easing + 14 keyframes. v32 단발 전환(hover/modal entrance) + v63 반복(skeleton/spinner) + v74 keyframe library(fade/slide/scale/bounce/shake/spin/pulse/shimmer/ping). brand-neutral.</p>

<h2>Duration (5종)</h2>
<div class="spec-grid">${dRows}</div>

<h2>Easing (2종)</h2>
<div class="spec-grid">${eRows}</div>

<h2>Keyframes (14종, v74)</h2>
<p>모두 baseline 정의(brand-neutral). <code>exports/tokens.css</code>에 자동 포함.</p>
<table>
<thead><tr><th>이름</th><th>구분</th><th>주 사용</th></tr></thead>
<tbody>
<tr><td><code>fade-in</code> / <code>fade-out</code></td><td>단발</td><td>dropdown / popover 등장 / 사라짐</td></tr>
<tr><td><code>slide-in-{up,down,left,right}</code></td><td>단발</td><td>drawer / sheet / toast 방향별 등장</td></tr>
<tr><td><code>scale-in</code> / <code>scale-out</code></td><td>단발</td><td>modal / dialog (scale 0.96 → 1)</td></tr>
<tr><td><code>bounce-in</code></td><td>단발</td><td>celebration · success indicator (over-shoot)</td></tr>
<tr><td><code>shake</code></td><td>단발</td><td>form validation error 강조</td></tr>
<tr><td><code>spin</code></td><td>loop</td><td>spinner · refresh icon</td></tr>
<tr><td><code>pulse</code></td><td>loop</td><td>dot indicator · attention</td></tr>
<tr><td><code>shimmer</code></td><td>loop</td><td>skeleton (linear-gradient translateX)</td></tr>
<tr><td><code>ping</code></td><td>loop</td><td>notification dot · alert</td></tr>
</tbody>
</table>

<h2>WCAG · prefers-reduced-motion</h2>
<pre><code>@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}</code></pre>
<p>2.3.3 Animation from Interactions: 200ms 초과 단발 + 모든 loop는 reduce 시 비활성. 컴포넌트 spec에서 일괄 적용.</p>
`;
  return page({
    title: "Motion",
    currentPath: "/tokens/motion.html",
    breadcrumb: [{ label: "Tokens" }, { label: "Motion" }],
    body,
  });
}

function pageBreakpoints() {
  const bps = [
    { name: "breakpoint-sm", value: "640px", note: "모바일 ↔ 큰 모바일 / 작은 태블릿 (Tailwind sm = 640)" },
    { name: "breakpoint-md", value: "736px", note: "태블릿 portrait — Apple Store reference. Tailwind md(768)와 다름" },
    { name: "breakpoint-lg", value: "834px", note: "태블릿 landscape (Apple iPad)" },
    { name: "breakpoint-xl", value: "1069px", note: "데스크탑 medium (Apple Store 메인 grid)" },
    { name: "breakpoint-2xl", value: "1441px", note: "데스크탑 large — Hero 8-column max grid" },
  ];
  let rows = "";
  for (const b of bps) {
    rows += `<div class="bp-row">
      <div class="bp-name">${escape(b.name)}</div>
      <div class="bp-value">${escape(b.value)}</div>
      <div class="bp-note">${escape(b.note)}</div>
    </div>`;
  }
  const body = `
<h1>Breakpoints</h1>
<p class="lede">5단계 viewport 분기. Apple Store 톤(640 / 736 / 834 / 1069 / 1441) — Tailwind v4 기본과 일부 다름. <code>--breakpoint-*</code> namespace는 Tailwind v4 표준.</p>

<h2>토큰</h2>
${rows}

<h2>적용 패턴</h2>
<ul>
  <li><strong>모바일 우선</strong> (Desk B2C) — base는 모바일, <code>@media (min-width: var(--breakpoint-md))</code>로 데스크탑 분기</li>
  <li><strong>데스크탑 우선</strong> (HR B2B) — base 데스크탑, <code>@media (max-width: var(--breakpoint-md))</code>로 모바일 적응</li>
  <li>Form layout: stacked → horizontal 전환 = <code>breakpoint-md</code> 기준</li>
  <li>Hero typography: 4단계 scale (display-xl ↔ heading-md) 분기</li>
</ul>
`;
  return page({
    title: "Breakpoints",
    currentPath: "/tokens/breakpoints.html",
    breadcrumb: [{ label: "Tokens" }, { label: "Breakpoints" }],
    body,
  });
}

function pageZIndex() {
  // v116 — 층 이름 토큰. 값은 DESIGN.md 의 "Z-index" 표에서 읽는다(여기에 옮겨 적으면 v65 값처럼 낡는다).
  const md = readFileSync(resolve(ROOT, "DESIGN.md"), "utf8");
  const layers = [...md.matchAll(/^\|\s*`(z-[a-z0-9-]+)`\s*\|\s*`([^`]+)`\s*\|\s*([^|\n]*)\|/gm)].map((m) => ({
    name: m[1],
    value: m[2].trim(),
    label: m[3].trim(),
  }));
  if (layers.length === 0) throw new Error('DESIGN.md 에서 z-index 토큰 표(| `z-…` | `값` | … |)를 찾지 못했다');
  let rows = "";
  for (let i = 0; i < layers.length; i++) {
    const l = layers[i];
    // 이름 칸 — z-modal-content · z-alert-content 가 기본 120px 를 넘는다
    rows += `<div class="bp-row" style="--row-i: ${i}; grid-template-columns: 168px 56px 1fr;">
      <div class="bp-name">${escape(l.name)}</div>
      <div class="bp-value">${escape(l.value)}</div>
      <div class="bp-note">${escape(l.label)}</div>
    </div>`;
  }

  let stackCards = "";
  layers.forEach((l, i) => {
    const top = 16 + i * 22;
    const left = 16 + i * 26;
    stackCards += `<div class="zindex-card" style="top: ${top}px; left: ${left}px; z-index: var(--${escape(l.name)});">${escape(l.name)} — ${escape(l.value)}</div>`;
  });
  const order = layers.filter((l) => l.value !== "auto").reverse().map((l) => `${escape(l.name)} (${escape(l.value)})`).join(" &gt; ");

  const body = `
<h1>Z-index</h1>
<p class="lede">${layers.length} 단계 층(v116). 이름은 층을 부르고, 값은 <code>specs/z-index.md</code> 의 층 표(L0 ~ L9) 그대로다 — 원본은 DESIGN.md 의 Z-index 표다.</p>

<h2>Layer stack</h2>
<div class="zindex-stack">${stackCards}</div>

<h2>토큰</h2>
${rows}

<h2>쌓이는 차례</h2>
<pre><code>${order}</code></pre>

<p>트리거에 붙어 뜨는 팝오버 · 목록 · 메뉴(<code>z-floating</code>)는 모달(<code>z-modal</code> · <code>z-modal-content</code>) 안에서 열어도 그 위에 뜬다. 확인창(<code>z-alert</code>)은 메뉴 위, 스낵바(<code>z-snackbar</code>)는 모든 표면 위다. <code>z-base</code> 는 <code>auto</code> — 쌓임 맥락을 만들지 않는다.</p>

<p>Tailwind v4: <code>z-(--z-floating)</code>. 숫자 클래스(<code>z-[200]</code> · <code>z-50</code>)로 층을 적지 않는다.</p>

<p>Component island 격리: 부모에 <code>isolation: isolate</code> — 미리보기 · 문서 그림처럼 틀 안에 가둘 때 안의 z-index 가 틀 밖의 층과 겨루지 않는다.</p>
`;
  return page({
    title: "Z-index",
    currentPath: "/tokens/z-index.html",
    breadcrumb: [{ label: "Tokens" }, { label: "Z-index" }],
    body,
  });
}

// ============================================================
// 7. EXAMPLES.md 파서 + 컴포넌트 페이지
// ============================================================

function slugify(s) {
  return s.toLowerCase()
    .replace(/[\/&]/g, "-")
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// EXAMPLES.md → 섹션 배열. 각 섹션 = { name, slug, paragraphs, examples: [{ lang, code }] }
function parseExamplesMd() {
  const md = readFileSync(resolve(ROOT, "EXAMPLES.md"), "utf8");
  const lines = md.split("\n");
  const sections = [];
  let current = null;
  let inCode = false;
  let codeBuf = [];
  let codeLang = "";
  let proseBuf = [];

  function flushProse() {
    if (current && proseBuf.length > 0) {
      const text = proseBuf.join("\n").trim();
      if (text) {
        // 코드 직후 prose는 example label로, 그 외는 paragraph로
        if (current.examples.length > 0 && !current.examples[current.examples.length - 1].label && proseBuf.length <= 3) {
          current.examples[current.examples.length - 1].label = text;
        } else {
          current.paragraphs.push(text);
        }
      }
      proseBuf = [];
    }
  }

  for (const line of lines) {
    // h2 = section
    const h = /^##\s+(.+)$/.exec(line);
    if (h && !inCode) {
      flushProse();
      const name = h[1].trim();
      // Skip 목차 / 다음 참조 / 토큰 alias 안내 등 meta 섹션
      if (/^(목차|다음 참조|토큰 alias 안내)/.test(name)) {
        current = null;
        continue;
      }
      current = { name, slug: slugify(name), paragraphs: [], examples: [] };
      sections.push(current);
      continue;
    }
    if (line.startsWith("```")) {
      if (!inCode) {
        flushProse();
        inCode = true;
        codeLang = line.slice(3).trim() || "html";
        codeBuf = [];
      } else {
        if (current) {
          current.examples.push({ lang: codeLang, code: codeBuf.join("\n"), label: null });
        }
        inCode = false;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }
    if (line.startsWith("---") && line.replace(/-/g, "").trim() === "") continue;
    if (current) proseBuf.push(line);
  }
  flushProse();
  return sections;
}

// 카테고리 매핑 (slug → { category, sortKey })
// shadcn/ui 공식 컴포넌트 카탈로그 (49개) — https://ui.shadcn.com/docs/components
// 각 항목: slug, name, category, description.
// 페이지 1대1 매핑: 묶지 않음 (input-textarea 같은 묶음 폐기).
const SHADCN_CATALOG = [
  // Form (22) — Quantity Picker · Attachment Input 은 2026-10-15 더했다(마무리 — SEED). Combobox 는 2026-10-15 걷었다(검색해 고르는 긴 목록은 Input Button + Searchable List). Toggle Group 은 2026-10-09 걷었다(하나 고르기 2 ~ 4칸은 Segmented Control · 여럿 · 짧은 폼 값은 Chip · 5개 이상은 Select).
  // Color Swatch · Icon Picker 는 Field 의 입력이라 Domain 에서 옮겼다(2026-10-09 — field.md Input)
  { slug: "attachment-input", name: "Attachment Input", category: "Form", description: "사진 · 파일을 골라 붙이는 칸 — 거래 영수증처럼 여럿을 붙이는 자리는 첨부 타일 80 + 한 줄(사진 80 썸네일 · 파일 160 × 80 카드 · × 20 누르는 44 · 올리는 중 원 24 · 실패 다시 시도 · 대표 띠 · 끌기 · 키보드 · 항목 메뉴로 순서 바꾸기), CSV · Excel 가져오기처럼 하나를 골라 넘기는 자리는 1280 이상 드롭존(120 · 1px 실선 · 파일 선택)이고 거절은 칸 아래 오류 글이다 (SEED Attachment Input 구조)." },
  { slug: "button", name: "Button", category: "Form", description: "액션을 실행하는 버튼. 변형 7 × 크기 4 × 배치 2(SEED Action Button 구조)." },
  { slug: "checkbox", name: "Checkbox", category: "Form", description: "여러 선택 가능한 박스." },
  { slug: "chip", name: "Chip", category: "Form", description: "2 ~ 4개 짧은 폼 값 고르기 · 누르면 값을 채우는 제안 · 목록 위 필터 바 · 지우기로 빼는 넣은 값을 맡는 작은 알약 (SEED Chip 구조)." },
  { slug: "color-swatch", name: "Color Swatch", category: "Form", description: "카테고리 · 태그 · 저축 목표 · 캘린더에 붙일 색을 차트 10색으로 칠한 원 칸 40 을 5 × 2 로 늘어놓고 하나 고르는 묶음 — 고른 칸은 2 띄운 2px 짙은 고리 + 체크이고, 고칠 때는 격자 앞에 지금 색 칸을 둔다 (SEED 에 색 고르기 부품이 없어 groo 가 정했다 — 고른 고리는 Select Box 의 짙은 테두리)." },
  { slug: "date-picker", name: "Date Picker", category: "Form", description: "날짜 · 기간 · 여러 날을 고르는 달력 — 날짜 칸(Input Button)을 누르면 1280 미만 시트 · 이상 팝오버로 열리고 \"완료\" 로 넣는다. 머리 · 요일 줄 · 날짜 칸 48 · 기간 띠, 한 달 · 두 달 · 이어지는 달 (SEED Date Picker 구조)." },
  { slug: "floating-action-button", name: "Floating Action Button", category: "Form", description: "화면 위에 떠 있는 그 화면의 주 동작 하나 — 오른쪽 아래(화면 끝 · 아래 끝에서 20)의 브랜드 원 56 에 흰 아이콘 24 이고, 폰의 탭 바가 없는 화면(할 일 · 더치페이)에만 둔다 (SEED Floating Action Button 구조)." },
  { slug: "field", name: "Field", category: "Form", description: "칸 이름 · 필수 표시 · 설명 · 오류 · 글자 수를 입력 하나에 붙이는 둘레 (SEED Field 구조)." },
  { slug: "icon-picker", name: "Icon Picker", category: "Form", description: "카테고리 · 저축 목표에 붙일 아이콘을 고르는 칸 — Input Button 이 고른 세트(148개 · 13 묶음)의 칸 48 격자를 1280 미만 시트 · 이상 팝오버로 열고 한국어 이름 · 찾는 말로 찾는다 (SEED 에 아이콘 고르기 부품이 없어 groo 가 정했다 — 트리거는 SEED Input Button, 칸은 SEED Iconography 의 아이콘 24 · 누르는 자리 44 이상 권장)." },
  { slug: "input", name: "Input", category: "Form", description: "한 줄 글 · 숫자를 직접 치는 입력칸. 상자 · 밑줄 × large · medium · 반응형, 앞 · 뒤 붙이개 · 지우기 (SEED Text Input 구조)." },
  { slug: "input-button", name: "Input Button", category: "Form", description: "입력칸 모양의 버튼. 누르면 달력 · 시각 · 아이콘 격자 · 긴 목록을 1280 미만 시트 · 이상 팝오버로 열고 고른 값이 칸에 들어간다 (SEED Input Button 구조)." },
  { slug: "input-otp", name: "Input OTP", category: "Form", description: "메일 · 문자로 받은 일회용 인증 코드(숫자 6자리)를 넣는 Input 한 칸 — 칸을 자릿수만큼 나누지 않고 붙여 넣으면 숫자만 남기며, 칸 아래 다시 받기 단추가 남은 초를 보이고 설명 줄이 유효 시간 · 틀릴 수 있는 횟수를 늘 알린다 (SEED 에 없는 부품 — 형식이 정해진 값은 칸을 나누지 말라는 SEED Text Input 규칙을 따라 groo 가 정했다)." },
  { slug: "quantity-picker", name: "Quantity Picker", category: "Form", description: "작은 정수를 한 단계씩 늘리고 줄이는 컨트롤 — 테두리 상자 안 줄이기 · 값 · 늘리기, 세 크기 36 · 40 · 52(웹 기본 1280 미만 52 · 이상 40 — 옆 칸과 같은 높이 · 누르는 자리 44), 값 칸은 보기만, 끝의 버튼은 초점이 남는 막힘, 최소에서 지우기 · 서버를 기다리는 로딩 (SEED Quantity Picker 구조)." },
  { slug: "radio-group", name: "Radio Group", category: "Form", description: "여러 옵션 중 하나만 선택." },
  { slug: "select-box", name: "Select Box", category: "Form", description: "제목 · 설명이 붙은 선택지를 상자로 비교해 하나 · 여럿을 고른다 (SEED Select Box 구조)." },
  { slug: "select", name: "Select", category: "Form", description: "짧은 선택지 5개 이상에서 폼 값을 고르는 칸. 칸 아래 목록 · 묶음 · 하나 · 여럿 고르기 × large · medium · 반응형 (SEED Select 구조)." },
  { slug: "slider", name: "Slider", category: "Form", description: "정해진 범위에서 값을 끌어 고르는 컨트롤 — 예산 알림 임계값처럼 범위 안의 자리가 중요한 값과 별점처럼 2 ~ 5단계 가운데 하나를 고르고, 지금 값은 Field 머리 오른쪽 · 끄는 동안 손잡이 위 말풍선이며 손을 뗄 때 한 번 저장한다 (SEED Slider 구조 — 무채색 그대로)." },
  { slug: "switch", name: "Switch", category: "Form", description: "on/off 토글." },
  { slug: "textarea", name: "Textarea", category: "Form", description: "여러 줄 글을 받는 입력칸. 3줄에서 쓴 만큼 자라고 최대 · 고정 높이를 정할 수 있다 (SEED Textarea 구조)." },
  { slug: "time-picker", name: "Time Picker", category: "Form", description: "시각을 고르는 12시간 휠 — 오전·오후 · 시 · 분. 시각 칸을 누르면 1280 미만 시트 · 이상 팝오버로 열리고 \"완료\" 로 넣는다 (SEED Time Picker 구조)." },
  { slug: "toggle", name: "Toggle", category: "Form", description: "단추 하나가 한 상태를 켜고 끄는 아이콘 단추(보이는 40 · 누르는 44) — 관심 등록 · 메모 고정 · 금액 가리기 · 비밀값 보기에 쓰고, 이름은 그대로 둔 채 켬은 aria-pressed 와 아이콘의 모양 · 굵기 · 색으로만 가른다 (SEED 에 디자인 문서가 없어 SEED Iconography 의 켜고 끄기 규칙 · 하트 단추를 바탕으로 groo 가 정했다)." },
  { slug: "wheel-picker", name: "Wheel Picker", category: "Form", description: "순서가 있는 값을 세로로 굴려 고르는 휠 — 칼럼 · 항목 · 가운데 선택 띠 · 위아래 안개. Time Picker 의 바탕이고, 달력의 연 · 월 휠 · 달만 고르는 자리에 쓴다 (SEED Wheel Picker 구조)." },

  // Display (22) — Scroll Auto Hide 는 2026-10-10 더했다(SEED Breeze — 스크롤하면 숨는 원장 머리)
  { slug: "aspect-ratio", name: "Aspect Ratio", category: "Display", description: "폭이 정해지면 비율로 높이가 정해지는 상자 하나 — 동영상 · 지도 · 바깥 페이지처럼 그림이 아닌 자리에 쓰고, 비율은 여덟(기본 4:3 · 카드 1.586)이며 모서리 · 바탕 없이 자식 하나가 채운다 (SEED Aspect Ratio 구조)." },
  { slug: "avatar", name: "Avatar", category: "Display", description: "사람 한 명을 보이는 원 — 사진이 있으면 사진, 없으면 이니셜 + 이름 색이고, 여러 사람은 지름 1/4 을 겹친 묶음(Avatar Stack — 앞 4명 + \"+N\")이다 (SEED Avatar 구조)." },
  { slug: "badge", name: "Badge", category: "Display", description: "대상의 상태 · 분류를 한두 낱말로 보이는 누르지 않는 작은 라벨(예정 · 연체 · 승인). weak · outline · solid × 톤 6 × medium 20 · large 24 (SEED Badge 구조)." },
  { slug: "callout", name: "Callout", category: "Display", description: "화면 안, 그 기능 · 내용 가까이에 늘 보이는 안내 상자 — 팁 · 제약 · 주의와 그 자리에서 난 오류(저장 실패)를 알린다 (SEED Callout 구조)." },
  { slug: "card", name: "Card", category: "Display", description: "회색 바닥 위에 놓는 흰 면 하나로 한 가지 내용을 묶는 카드 — 1px 테두리 · 모서리 16 · 여백 24 · 그림자 없음, 목록 카드 · 지표 · 순자산 · 누르는 카드 · 증감 표기 (SEED Elevation · Feedback 기준)." },
  { slug: "content-placeholder", name: "Content Placeholder", category: "Display", description: "이미지가 없거나 불러오지 못한 자리를 옅은 면과 무엇이 없는지 말하는 선 아이콘으로 채운다 — 그림은 틀 높이의 50%(16 ~ 160), 모서리는 틀이 정한다 (SEED Content Placeholder 구조)." },
  { slug: "divider", name: "Divider", category: "Display", description: "내용 사이를 나누는 1px 선 — 같은 묶음 안은 들인 선, 묶음 사이는 끝까지 선이고, 크게 다른 내용 사이는 선이 아니라 8 간격이다 (SEED Divider 구조)." },
  { slug: "image-frame", name: "Image Frame", category: "Display", description: "그림 한 장을 보이는 틀 — 비율 상자에 그림을 꽉 채우고 안쪽 1px 투명 윤곽을 늘 그리며, 모서리는 폭으로(4 · 6 · 8) 고르고, 불러오는 동안은 Skeleton · 없거나 실패하면 Content Placeholder, 그림 위에는 배지 · 장수 글을 둘까지 얹는다 — 카드 그림은 세로 그림을 돌리고 그림이 없으면 카드사 색 면이다 (SEED Image Frame 구조)." },
  { slug: "list", name: "List", category: "Display", description: "설정 · 메뉴 · 선택 · 내용 줄을 세로로 잇는 목록 (SEED List 구조)." },
  { slug: "logo-tile", name: "Logo Tile", category: "Display", description: "은행 · 증권 · 카드 · 코인 · 금 같은 물건과 회사를 보이는 각진 타일 — 기관 색(표에 없으면 이름 색) 면에 이름의 첫 글자를 먼저 그리고 그림이 오면 덮는다, 32 · 40 · 48 · 모서리 크기 × 0.3 (SEED 에 물건 타일이 없어 groo 가 정한 부품 — 윤곽은 SEED Image Frame)." },
  { slug: "notification-badge", name: "Notification Badge", category: "Display", description: "안 읽은 알림 · 확인하지 않은 새 것이 있다는 신호 — 점(있음)과 숫자(몇 개 · 99+)를 아이콘 버튼 · 탭 글에 붙이고, 보면 사라진다 (SEED Notification Badge 구조)." },
  { slug: "page-banner", name: "Page Banner", category: "Display", description: "페이지 머리 바로 아래 화면 폭 전체로 놓여 그 페이지 전체의 상태(연결 끊김 · 만료 예정 · 새 버전)를 알리는 띠 — 한 화면에 하나 (SEED Page Banner 구조)." },
  { slug: "progress", name: "Progress", category: "Display", description: "\"얼마나 찼나\" 를 보이는 높이 8 미터 막대 — 예산 · 카드 한도처럼 쓸수록 차는 것과 저축 목표 · 카드 실적처럼 모을수록 차는 것, 넘친 한도만 위험 색 (SEED 에 선형 막대가 없어 groo 가 정한 부품 — 진행은 Progress Circle)." },
  { slug: "progress-circle", name: "Progress Circle", category: "Display", description: "작업이 진행 중임을 알리는 원 — 값을 모르면 호가 늘었다 줄며 돌고 값을 알면 12시부터 채운다, 크기 24 · 40 · 버튼 안, 톤 neutral · brand · staticWhite · inherit (SEED Progress Circle 구조)." },
  { slug: "resizable", name: "Resizable", category: "Display", description: "화면 안의 크기를 손으로 바꾸는 손잡이 — 768 이상 HR 관리 화면의 목록 | 상세(선 1px + 손잡이 표시 · 누르는 폭 16 · 목록 20 ~ 40% · ← → 5% · 한 번 누르면 25 ↔ 40 · 화면마다 폭 기억)와 대시보드 위젯 크기(모서리 손잡이 · ⋮ \"크기\") (SEED 에 Resizable 이 없어 groo 가 정했다 — 키보드는 APG Window Splitter)." },
  { slug: "result-section", name: "Result Section", category: "Display", description: "화면이나 그 영역 가운데에 놓는 결과 — 비어 있음 · 불러오기 실패 · 완료 · 찾을 수 없는 페이지 · 화면 오류를 한 틀로 그린다 (SEED Result Section 구조)." },
  { slug: "scroll-area", name: "Scroll Area", category: "Display", description: "스크롤되는 자리의 규칙 — 스크롤은 브라우저 기본이고 스크롤바는 전역 한 벌(6px 알약 · 막대 stroke-neutral-solid · Firefox 두 줄은 @supports 안)이며, 초점 가는 것이 없는 상자는 region · 이름 · tabindex 0, 시트 · 대화상자 안 상자는 contain 이다 (SEED 에 스크롤바 규칙이 없어 groo 가 정했다 — 끝 흐림은 SEED Scroll Fog)." },
  { slug: "scroll-auto-hide", name: "Scroll Auto Hide", category: "Display", description: "스크롤 상자 맨 위의 영역이 아래로 스크롤하면 그 거리만큼 숨고 위로 스크롤하면 같은 거리만큼 드러난다 — 폰 가계부 · 할 일 원장 머리, 멈추면 50% 를 기준으로 200ms 스냅 · translate3d 로만 옮김 · 모션 줄이기면 끔 · 숨은 머리에 초점이 오면 드러냄 (SEED Breeze Scroll Auto Hide 구조)." },
  { slug: "scroll-fog", name: "Scroll Fog", category: "Display", description: "스크롤되는 영역의 끝을 투명도 마스크로 늘 흐려 뒤에 더 있다는 것을 알린다 — 칩 줄 좌우 20 · 시트 · 대화상자 본문 위 20 · 아래 80 · 바닥 고정 버튼이 있는 화면 (SEED Scroll Fog 구조)." },
  { slug: "skeleton", name: "Skeleton", category: "Display", description: "불러오는 동안 데이터 자리만 미리 그리는 회색 면과 1.5초 띠 — 모서리 넷 · 글줄 높이, 1초 뒤에 보이고 5초 · 10초에 바뀌는 시간표(LoadingRegion) (SEED Skeleton 구조)." },
  { slug: "tag-group", name: "Tag Group", category: "Display", description: "여러 메타 정보(카테고리 이름 · 자산 · 시각 · 거리 · 개수 · 금액)를 \" · \" 로 이어 한 줄로 보이는 글줄 — 읽기만 하고, 넘치면 낱말 단위로 줄을 바꾸거나 한 줄에서 말줄임한다 (SEED Tag Group 구조)." },
  { slug: "typography", name: "Typography", category: "Display", description: "텍스트 위계 (h1~h4, p, blockquote, code)." },

  // Overlay (9)
  { slug: "alert-dialog", name: "Alert Dialog", category: "Overlay", description: "되돌릴 수 없는 일을 하기 전에 묻거나 꼭 알아야 할 일을 알리는 화면 정중앙의 확인창 (SEED Alert Dialog 구조)." },
  { slug: "bottom-sheet", name: "Bottom Sheet", category: "Overlay", description: "1280 미만에서 폼 · 상세 · 고르기를 띄우는 화면 아래의 모달 시트 (SEED Bottom Sheet 구조)." },
  { slug: "dialog", name: "Dialog", category: "Overlay", description: "1280 이상에서 입력 폼 · 상세를 화면 정중앙에 띄우고 1280 미만에서는 Bottom Sheet 로 바뀌는 대화상자 (SEED Dialog 구조)." },
  { slug: "help-bubble", name: "Help Bubble", category: "Overlay", description: "트리거를 누르면 옆에 뜨는 짙은 도움말 말풍선 — 화면에 늘 두기에는 길고 몰라도 일은 할 수 있는 설명(규정 · 계산 방법 · 기능 안내)을 손가락으로도 연다 (SEED Help Bubble 구조)." },
  { slug: "menu-sheet", name: "Menu Sheet", category: "Overlay", description: "1280 미만에서 Menu 대신 같은 줄 · 같은 순서로 화면 아래에서 올라오는 동작 목록 (SEED Swipeable Menu Sheet 구조)." },
  { slug: "popover", name: "Popover", category: "Overlay", description: "1280 이상에서 트리거에 붙어 부가 정보 · 고르는 패널을 띄우는 비모달 표면 (SEED Popover 구조)." },
  { slug: "side-panel", name: "Side Panel", category: "Overlay", description: "화면 옆에서 미끄러져 나오는 모달 패널 — 높이 전체 · 모서리 · 그림자 없이 딤과 면 색으로 뜨고, 왼쪽은 HR 폰의 주 메뉴 서랍(화면 폭의 80%) · 오른쪽은 1280 이상의 보조 작업(480 · 720 · 960)이다 (SEED Side Panel 구조)." },
  { slug: "snackbar", name: "Snackbar", category: "Overlay", description: "화면 아래에 잠깐 떴다 사라지는 띠(토스트) — 방금 한 일의 결과 · 뒤에서 끝난 일 · 다시 하면 되는 가벼운 실패를 한 번에 하나 알린다 (SEED Snackbar 구조)." },
  { slug: "tooltip", name: "Tooltip", category: "Overlay", description: "마우스를 올리거나 키보드 초점이 오면 트리거 옆에 뜨는 짧은 설명 — 아이콘 버튼 · 줄인 글이 무엇인지 보여 주는 Help Bubble 모양의 보조 (SEED Help Bubble Tooltip 구조)." },

  // Navigation (9) — Footer 는 2026-10-15 더했다(마무리 — SEED 조합 예시). Command(⌘K 팔레트 · cmdk)는 2026-10-15 걷었다(세 제품 모두 쓰는 곳이 없다)
  { slug: "bottom-navigation", name: "Bottom Navigation", category: "Navigation", description: "폰 화면 아래에 떠 있는 탭 바 — 홈 · 가계부 · + · 캘린더 · 전체 다섯 칸이 어느 화면에서나 같은 알약(펼침 66 · 줄어듦 48)이고, 가운데 + 는 탭이 아니라 그 화면의 추가다 (SEED Bottom Navigation 구조 — 떠 있는 알약은 groo)." },
  { slug: "footer", name: "Footer", category: "Navigation", description: "사이트 맨 아래의 바닥 — 브랜드 · 사이트맵(서비스 · 계정) | 선 | 개인정보 처리방침 ↗ · 안내 글 · © 해 그루 를 블록으로 골라 조립하고(groo-home), 틀 1040 · 위아래 40 · 좌우 32(1280 미만 24) · 링크는 밑줄 없이 색으로 · 새 탭만 ↗ · 값이 없는 사업자 정보 · 연락처 · 소셜은 비워 둔다 (SEED Footer 조합 예시 구조)." },
  { slug: "menu", name: "Menu", category: "Navigation", description: "트리거에 붙어 열리는 동작 목록 — 줄을 누르면 바로 실행하고 닫히며, 1280 미만에서는 같은 목록이 Menu Sheet 로 뜬다 (SEED Menu 구조)." },
  { slug: "pagination", name: "Pagination", category: "Navigation", description: "데스크톱 긴 목록 아래 가운데의 쪽 넘김 줄 — 칸 40 을 사이 없이 잇고(480 이상 9칸 · 미만 7칸) 지금 쪽은 짙게 채우며, 폰의 긴 목록은 쪽을 나누지 않고 끝없이 불러온다 (SEED Pagination 구조)." },
  { slug: "segmented-control", name: "Segmented Control", category: "Navigation", description: "같은 내용을 2 ~ 4가지로 바로 거르거나 · 정렬하거나 · 다르게 보는 컨트롤 — 그 내용 바로 위에 하나 두고, 칸이 트랙 폭을 똑같이 나눈다 (SEED Segmented Control 구조)." },
  { slug: "side-navigation", name: "Side Navigation", category: "Navigation", description: "데스크톱(768 이상)의 주 메뉴 — 화면 왼쪽 사이드바에 최상위 화면을 묶어 두고, 1280 이상은 펼침 240 · 768 ~ 1279 는 아이콘만 56 으로 저절로 접히며 접히면 이름 말풍선 · 옆 펼침 메뉴를 띄운다 (SEED Side Navigation 구조)." },
  { slug: "table-pagination", name: "Table Pagination", category: "Navigation", description: "데이터 표 아래의 쪽 넘김 한 줄 — 줄 수(\"10개 씩 보기\")와 지금 범위(\"11-20 / 총 237개\")를 Select medium 으로 고르고 이전 · 다음으로 넘긴다 (SEED Table Pagination 구조)." },
  { slug: "tabs", name: "Tabs", category: "Navigation", description: "다른 구역으로 옮기는 탭. 화면 · 구역 맨 위의 1차 탭은 Line(Fill · Hug × small · medium — 고르면 2px 막대가 미끄러진다), 그 안의 2차 탭은 Chip Tabs (SEED Tabs 구조)." },
  { slug: "top-navigation", name: "Top Navigation", category: "Navigation", description: "화면 맨 위의 바 — 지금 화면의 이름과 이동(뒤로 · 닫기 · 주 메뉴) · 동작 두셋을 두고, 탭 첫 화면은 큰 제목(Root) · 그 아래 화면은 ← + 제목(Standard) · 768 이상 Desk 는 제목 없는 데스크톱 머리이며 높이 56 · 선 없이 맨 위에 붙는다 (SEED Top Navigation 구조)." },

  // Disclosure (3) — Tree View 는 2026-10-10 더했다(HR 부서 나무 — APG Treeview)
  { slug: "accordion", name: "Accordion", category: "Disclosure", description: "관련 상세를 세로로 묶어 두고 항목마다 머리를 눌러 펼치는 목록 — inline(연속 목록 + 들인 선) · separated(항목마다 카드 면), 제목 16 · 설명 13 · 꺾쇠 20 · 54 · 74, 여럿을 함께 열고 \"모두 펼치기\" 를 두며 상세가 없는 항목은 그냥 줄이다 (SEED Accordion 구조)." },
  { slug: "collapsible", name: "Collapsible", category: "Disclosure", description: "내용 하나를 접고 펴는 자리 — 거래 상세의 분할 내역 · 빠르게 맞추기 · 상세 검색 조건, 트리거는 Accordion 항목 하나의 모양(줄 전체 · 고정 이름 + aria-expanded)이고 흰 면 · 카드 · 경고 상자에 놓인다 (SEED 에 Collapsible 이 없어 SEED Accordion 가이드의 한 줄대로 항목 하나의 모양을 쓴다)." },
  { slug: "tree-view", name: "Tree View", category: "Disclosure", description: "여러 단계로 된 항목 가운데 하나를 고르는 나무 — HR 부서 나무, 줄 44 · 단계마다 20 들임 · 줄 전체가 누르는 자리(부모는 고르면서 펴고 접는다) · Tab 하나 + 화살표 · 노드 동작은 나무 밖 ⋮ 하나 · 긴 이름은 줄바꿈 (SEED 에 나무가 없어 APG Treeview 를 따랐다 — 줄 전체를 누르는 자리는 SEED Accordion 트리거 규칙)." },

  // Data (4) — 데이터 표시(2026-10-08). 옛 Data Table 은 걷었다 — 정렬 · 고르기 · 일괄 작업은 Table 의 부품이다. Card 는 Display 에 있다
  { slug: "chart", name: "Chart", category: "Data", description: "숫자의 흐름 · 비율 · 세기를 그리는 차트 — 이중 축 추이 · 위 지표 타일 · \"■ 라벨 값\" 툴팁 · 목록 범례 도넛 · 칸 112 이상만 원까지 쓰는 열지도, recharts 베이스 (SEED 대시보드 그림 기준)." },
  { slug: "searchable-list", name: "Searchable List", category: "Data", description: "위 밑줄 검색칸에 치는 대로 걸러지는 긴 목록에서 하나를 고르는 묶음 — 분류 머리 · List 줄 + 오른쪽 라디오 · 콤보박스 키보드 · 0건 · 실패 · 불러오는 줄 (SEED Text Input 밑줄형 · List · Radiomark · Result Section 기준)." },
  { slug: "swipe-actions", name: "Swipe Actions", category: "Data", description: "폰 목록 줄을 왼쪽으로 밀면 동작 칸(원형 배지 36 + 라벨)이 드러나는 지름길 — 같은 동작은 늘 줄 끝 ⋮ → Menu Sheet 로도 연다 (SEED 에는 줄 밀기가 없어 대체 방법을 두라는 SEED Inclusive Design 기준)." },
  { slug: "table", name: "Table", category: "Data", description: "줄과 열로 된 데이터를 견주어 읽는 표 — 머리 41 · 줄 45(두 줄 칸이면 72) · 마지막 줄까지 줄 선 · 숫자 오른쪽 · 정렬 ↑↓ 늘 · 끝 ⋮ · 고른 줄은 체크로만, 768 미만은 List 줄 (SEED 문서 사이트 표 구조)." },
];

const COMPONENT_CATEGORIES = Object.fromEntries(
  SHADCN_CATALOG.map((c, i) => [c.slug, { category: c.category, sort: i }])
);

const CATEGORY_ORDER = ["Form", "Display", "Overlay", "Navigation", "Disclosure", "Data"];

// 컴포넌트 slug → preview.html render 함수 매핑
// 각 함수는 brand 객체 받아 <section> HTML 반환 (custom CSS 사용 — pageCss로 스타일링)
function getDemoFunctions(slug) {
  switch (slug) {
    case "button": return [renderButtonGallery];
    case "card": return [renderListingDetail];
    case "input-textarea": return [renderForm];
    case "form-layout-validation": return [renderForm, renderBatchV73V78];
    case "drawer-sheet": return [renderBatchV67];
    case "toast-sonner": return [renderSnackbars, renderShadcnExtras];
    case "skeleton-spinner-progress": return [renderSkeleton, renderBatchV67];
    case "empty-state": return [renderEmptyState];
    case "tabs": return [renderVignettes];
    case "breadcrumb-sidebar": return [renderShadcnNav];
    case "pagination-stepper": return [renderBatchV67];
    case "accordion-collapsible": return [renderShadcnDisclose];
    case "tooltip-popover-hover-card": return [renderShadcnDisclose, renderBatchV73V78];
    case "dropdown-context-menu": return [renderShadcnDisclose];
    case "treeview": return [renderBatchV73V78];
    // 옛 file-upload(v73 File Upload 칸)는 걷었다(2026-10-15) — 첨부 칸은 03v 의 Attachment Input 이다
    case "attachment-input": return [renderFinishGallery];
    case "banner": return [renderBatchV73V78];
    case "badge-tag-chip": return [renderBatchV73V78];
    case "avatar": return [renderListingDetail];
    case "animation-patterns": return [renderBatchV73V78];
    default: return [];
  }
}

function pageComponent(component, brand) {
  const cat = COMPONENT_CATEGORIES[component.slug] || { category: "Other" };
  const recipePath = resolve(ROOT, `recipes/shadcn/components/ui/${component.slug}.tsx`);
  const hasRecipe = existsSync(recipePath);
  const specPath = resolve(ROOT, `specs/components/${component.slug}.md`);
  const hasSpec = existsSync(specPath);

  let body = `
<h1>${escape(component.name)}</h1>
${component.description ? `<p class="lede">${escape(component.description)}</p>` : ""}

<div class="component-meta">
  <a class="tag">${escape(cat.category)}</a>
  ${hasSpec ? `<a class="tag tag-spec">M3 톤 detailed spec</a>` : ""}
  <a href="https://ui.shadcn.com/docs/components/${escape(component.slug)}" target="_blank" rel="noopener">shadcn/ui ↗</a>
  <a href="https://github.com/lshdainty/groo-design/blob/main/recipes/shadcn/components/ui/${escape(component.slug)}.tsx" target="_blank" rel="noopener">소스 ↗</a>
  ${hasSpec ? `<a href="https://github.com/lshdainty/groo-design/blob/main/specs/components/${escape(component.slug)}.md" target="_blank" rel="noopener">spec ↗</a>` : ""}
</div>
`;

  // === Spec (M3 톤 detailed spec, 있을 때만 — 코드 위에 둠) ===
  if (hasSpec) {
    const specMd = readFileSync(specPath, "utf8");
    body += `<section class="spec-section">\n${mdToHtml(specMd)}\n</section>\n`;
  }

  const hasExamples = !!(SHADCN_EXAMPLES[component.slug] && SHADCN_EXAMPLES[component.slug].length);

  if (!hasRecipe && !hasExamples) {
    body += `
<div class="callout">
  <div>
    <strong>곧 작성 예정</strong> · 이 컴포넌트는 Phase 진행 중. shadcn 표준 구조(cva + Radix primitives) + Groo 토큰으로 작성됩니다.
  </div>
</div>
`;
    return page({
      title: component.name,
      currentPath: `/components/${component.slug}.html`,
      breadcrumb: [
        { label: "Components" },
        { label: cat.category },
        { label: component.name },
      ],
      body,
    });
  }

  // === 설치 ===
  body += `<h2>설치</h2>\n`;
  body += `<pre><code class="lang-bash">npm install clsx tailwind-merge class-variance-authority @radix-ui/react-slot</code></pre>\n`;

  // === 컴포넌트 코드 (있을 때만) ===
  if (hasRecipe) {
    const recipeCode = readFileSync(recipePath, "utf8");
    body += `<h2>components/ui/${escape(component.slug)}.tsx</h2>\n`;
    body += `<pre><code class="lang-tsx">${escape(recipeCode)}</code></pre>\n`;
  } else {
    body += `<h2>조립 컴포넌트</h2>\n`;
    body += `<p style="font-size: var(--text-label-md); color: var(--color-text-secondary); margin: 0 0 16px;">${escape(component.name)}는 별도 파일이 아닌 다른 primitive를 조립해 사용합니다. 아래 예제 코드를 참고하세요.</p>\n`;
  }

  // === 예제 (Preview + Code 토글) ===
  const examples = SHADCN_EXAMPLES[component.slug];
  if (examples && examples.length > 0) {
    body += `<h2>예제</h2>\n`;
    body += `<p class="lede" style="font-size: var(--text-label-md); margin-bottom: 16px;">Preview는 우리 토큰 적용된 실제 동작. Code는 React 프로젝트로 그대로 복사.</p>\n`;
    for (const ex of examples) {
      body += `<h3 style="margin-top: 32px;">${escape(ex.title)}</h3>\n`;
      if (ex.description) {
        body += `<p style="font-size: var(--text-label-md); color: var(--color-text-secondary); margin: 0 0 12px;">${escape(ex.description)}</p>\n`;
      }
      body += `<div class="example-block" data-example>
  <div class="example-head">
    <div class="example-tabs">
      <button class="example-tab" data-tab="preview" aria-selected="true" type="button">Preview</button>
      <button class="example-tab" data-tab="code" aria-selected="false" type="button">Code</button>
    </div>
    <button class="example-copy" type="button">Copy</button>
  </div>
  <div class="example-preview" data-pane="preview">
    <div class="preview-frame">${ex.render()}</div>
  </div>
  <div class="example-code" data-pane="code" hidden>
    <pre><code class="lang-tsx">${escape(ex.jsx)}</code></pre>
  </div>
</div>
`;
    }
  }

  // === bridge & utils (모든 shadcn 페이지 공통 — 한 번만 보여주는 details) ===
  body += `<h2>bridge & utils</h2>\n`;
  body += `<p style="font-size: var(--text-label-md); color: var(--color-text-secondary);">아래 두 파일은 프로젝트당 한 번만 추가 — 모든 shadcn 컴포넌트가 공유.</p>\n`;
  const bridgePath = resolve(ROOT, "recipes/shadcn/styles/groo-shadcn-bridge.css");
  const utilsPath = resolve(ROOT, "recipes/shadcn/lib/utils.ts");
  if (existsSync(bridgePath)) {
    const bridgeCode = readFileSync(bridgePath, "utf8");
    body += `<details><summary><code>styles/groo-shadcn-bridge.css</code> — Groo 토큰 → shadcn variables alias</summary><pre><code class="lang-css">${escape(bridgeCode)}</code></pre></details>\n`;
  }
  if (existsSync(utilsPath)) {
    const utilsCode = readFileSync(utilsPath, "utf8");
    body += `<details><summary><code>lib/utils.ts</code> — cn() helper</summary><pre><code class="lang-ts">${escape(utilsCode)}</code></pre></details>\n`;
  }

  body += `
<div class="callout">
  <div>
    <strong>참고</strong> · shadcn 공식 문서 <a href="https://ui.shadcn.com/docs/components/${escape(component.slug)}" target="_blank" rel="noopener">ui.shadcn.com/docs/components/${escape(component.slug)}</a> · 디자인 토큰 사양 <a href="https://github.com/lshdainty/groo-design/blob/main/DESIGN.md" target="_blank" rel="noopener">DESIGN.md</a>.
  </div>
</div>
`;

  return page({
    title: component.name,
    currentPath: `/components/${component.slug}.html`,
    breadcrumb: [
      { label: "Components" },
      { label: cat.category },
      { label: component.name },
    ],
    body,
  });
}

// ============================================================
// 8. Build
// ============================================================

function ensureDir(p) { mkdirSync(p, { recursive: true }); }

ensureDir(OUT);
ensureDir(resolve(OUT, "tokens"));
// 옛 슬러그 페이지(input-textarea.html 등) 잔존 방지 — 매 빌드마다 components/ 비움
const componentsDir = resolve(OUT, "components");
if (existsSync(componentsDir)) rmSync(componentsDir, { recursive: true, force: true });
ensureDir(componentsDir);
ensureDir(resolve(OUT, "assets"));

// shadcn 카탈로그가 페이지 1대1. paragraphs/examples는 빈 배열 (옛 EXAMPLES.md
// 매핑 폐기 — 각 페이지는 recipe + examples mjs 기반).
const components = SHADCN_CATALOG.map(c => ({
  slug: c.slug,
  name: c.name,
  description: c.description,
  paragraphs: [c.description],
  examples: [],
}));
NAV = buildNav(components);

const tokens = buildTokens();
TAILWIND_BLOCK = tokens.tailwindBlock;
writeFileSync(resolve(OUT, "assets/tokens.css"), tokens.rootCss);
// site.css = 사이트 layout + preview.html demo CSS (preview의 sc-card / btn-* / son-toast 등)
// 단, preview의 site-level 셀렉터(body, .theme-toggle, .app 등)는 제거 — site CSS와 충돌
function sanitizePreviewCss(css) {
  // 충돌 셀렉터 패턴 — selectorPart trim + comment 제거 후 매칭
  // 셀렉터 끝(또는 다음 문자가 word-extension이 아닌)을 검사 — 더 길게 이어진 이름과 구분
  const conflictPatterns = [
    /^body(?![-a-zA-Z0-9_])/,
    /^\.theme-toggle(?![-a-zA-Z0-9_])/,
    /^\.theme-toggle-icon(?![-a-zA-Z0-9_])/,
    /^\.theme-toggle-(?:dark|light)-(?:text|icon)(?![-a-zA-Z0-9_])/,
    /^\[data-theme="(?:light|dark)"\]\s+body(?![-a-zA-Z0-9_])/,
    /^\[data-theme="(?:light|dark)"\]\s+\.theme-toggle(?![-a-zA-Z0-9_])/,
    /^main(?![-a-zA-Z0-9_])/,
    /^html(?![-a-zA-Z0-9_])/,
  ];
  function cleanSelector(s) {
    // 리딩 whitespace + CSS 주석 제거
    return s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s+/, "").replace(/\s+$/, "");
  }
  // CSS rule 블록 단위로 split + filter (간단한 brace 기반 파서)
  const out = [];
  let i = 0;
  while (i < css.length) {
    // selector 부분 (block 시작 전까지)
    let j = i;
    let depth = 0;
    while (j < css.length) {
      if (css[j] === "{") { depth = 1; break; }
      j++;
    }
    if (depth === 0) { out.push(css.slice(i)); break; }
    // selector 추출
    const selectorPart = css.slice(i, j);
    // body 매칭 (rule 단위) — block 끝까지 찾기
    let k = j + 1;
    let braceDepth = 1;
    while (k < css.length && braceDepth > 0) {
      if (css[k] === "{") braceDepth++;
      else if (css[k] === "}") braceDepth--;
      k++;
    }
    const ruleBlock = css.slice(i, k);
    const cleanedSelector = cleanSelector(selectorPart);
    // @media / @keyframes 등 at-rule은 그대로 통과 (내부 rule도 함께)
    if (cleanedSelector.startsWith("@")) {
      out.push(ruleBlock);
    } else {
      // 충돌 selector 검사 (cleaned 기준)
      const conflicts = conflictPatterns.some(re => re.test(cleanedSelector));
      if (!conflicts) out.push(ruleBlock);
      else out.push(`/* SKIPPED conflicting: ${cleanedSelector.slice(0, 60)}... */\n`);
    }
    i = k;
  }
  return out.join("");
}
const combinedSiteCss = siteCss() + "\n\n/* === preview.html demo CSS (sanitized) === */\n" + sanitizePreviewCss(previewPageCss());
writeFileSync(resolve(OUT, "assets/site.css"), combinedSiteCss);
writeFileSync(resolve(OUT, "assets/site.js"), siteJs());

// brand 객체 — preview.html demo 함수에 전달. brand.key === "default" / "hr" / "desk".
// 사이트는 한 번에 한 brand만 빌드 안 함 — Default brand로 정적 렌더, JS toggle로 색상 전환.
const tokensCss = readFileSync(resolve(ROOT, "exports/tokens.css"), "utf8");
const parsedTokens = parseTokensFromCss(tokensCss);
const brand = brandProfile("Default", parsedTokens);

writeFileSync(resolve(OUT, "index.html"), pageLanding());
writeFileSync(resolve(OUT, "tokens/colors.html"), pageColors());
writeFileSync(resolve(OUT, "tokens/typography.html"), pageTypography());
writeFileSync(resolve(OUT, "tokens/spacing.html"), pageSpacing());
writeFileSync(resolve(OUT, "tokens/radius.html"), pageRadius());
writeFileSync(resolve(OUT, "tokens/shadows.html"), pageShadows());
writeFileSync(resolve(OUT, "tokens/motion.html"), pageMotion());
writeFileSync(resolve(OUT, "tokens/breakpoints.html"), pageBreakpoints());
writeFileSync(resolve(OUT, "tokens/z-index.html"), pageZIndex());

for (const c of components) {
  writeFileSync(resolve(OUT, `components/${c.slug}.html`), pageComponent(c, brand));
}

console.log("✓ exports/site/");
console.log("  index.html");
console.log("  tokens/{colors,typography,spacing,radius,shadows,motion,breakpoints,z-index}.html (8 페이지)");
const filledCount = SHADCN_CATALOG.filter(c => {
  const hasRecipe = existsSync(resolve(ROOT, `recipes/shadcn/components/ui/${c.slug}.tsx`));
  const hasExamples = !!(SHADCN_EXAMPLES[c.slug] && SHADCN_EXAMPLES[c.slug].length);
  return hasRecipe || hasExamples;
}).length;
const placeholderSuffix = filledCount === components.length ? "" : ", 나머지 placeholder";
console.log(`  components/*.html (${components.length} 페이지 shadcn 카탈로그 — ${filledCount}/${components.length} 작성 완료${placeholderSuffix})`);
console.log("  assets/{tokens,site}.css + site.js");
