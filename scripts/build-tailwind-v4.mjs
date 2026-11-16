#!/usr/bin/env node
// Tailwind v4 @theme CSS 빌드 (P1-B)
//
// design.md spec의 typography는 lineHeight를 export에서 누락하고,
// shadow는 prose-token이라 export에서 빠집니다. 이 빌드 스크립트는
// DESIGN*.md를 직접 파싱하여 모든 토큰(color/typography/rounded/spacing
// + prose shadow)을 v4 @theme CSS로 출력합니다.
//
// 사용법:
//   node scripts/build-tailwind-v4.mjs --source DESIGN.md > exports/tokens.css
//   node scripts/build-tailwind-v4.mjs --source DESIGN.hr.md > exports/tokens.hr.css
//
// v4 namespace 매핑:
//   colors      → --color-{name}
//   typography  → --text-{name} + --text-{name}--line-height + --text-{name}--font-weight
//   rounded     → --radius-{name}
//   spacing     → --spacing-{name}
//   prose shadow→ --shadow-{name without "shadow-" prefix}

import { readFileSync } from "node:fs";
import { argv, stdout, exit } from "node:process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import {
  parseArgs,
  parseColors,
  parseColorTable,
  resolveColorHex,
  parseTypography,
  parseSimpleScale,
  parseShadows,
  parseMotion,
  parseOverlay,
  parseBreakpoints,
  parseLayout,
  parseGradients,
  parseTouchTargets,
  parseZIndex,
  parseKeyframes,
} from "./lib/design-md.mjs";

const args = parseArgs(argv.slice(2));
const source = args.source;
if (!source) {
  console.error("usage: build-tailwind-v4.mjs --source <DESIGN*.md>");
  exit(2);
}

const content = readFileSync(source, "utf8");
const lines = content.split("\n");

const colors = parseColors(lines);
const typography = parseTypography(lines);
const rounded = parseSimpleScale(lines, "rounded");
const spacing = parseSimpleScale(lines, "spacing");
const shadows = parseShadows(content);
const motion = parseMotion(content);
const overlays = parseOverlay(content);
const breakpoints = parseBreakpoints(content);
const layout = parseLayout(content);
const gradients = parseGradients(content);
const touchTargets = parseTouchTargets(content);

// 그림자(shadow-s1 ~ s4)는 값 대신 var(--groo-shadow-sN) 으로 적고, 값은 @theme 밖 :root 의 --groo-shadow-sN 에 둡니다.
// Tailwind v4 는 그림자 값을 클래스(.shadow-s3) 안에 박아 넣으므로, 이렇게 해야 다크 블록이 값을 바꿀 때 클래스도 따라갑니다.
// -dark 짝(--shadow-s3-dark)은 값 그대로 둡니다.
const SHADOW_HOLD = /^shadow-s\d+$/;
const holdOf = (name) => (SHADOW_HOLD.test(name) && `${name}-dark` in shadows ? `groo-${name}` : null);
const zIndex = parseZIndex(content);
// keyframes는 baseline shared — DESIGN.md에서만 정의(brand-neutral). brand 파일 빌드 시도 fallback.
let keyframes = parseKeyframes(content);
if (keyframes.length === 0 && source !== "DESIGN.md") {
  const baseline = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "..", "DESIGN.md"), "utf8");
  keyframes = parseKeyframes(baseline);
}

let out = "";
out += `/* Generated from ${source} by scripts/build-tailwind-v4.mjs — do not edit. */\n`;
out += `/* Tailwind v4 @theme CSS (CSS-first config). */\n\n`;
out += "@theme {\n";

out += "  /* Font family — Korean-first Pretendard, Inter fallback */\n";
out += `  --font-sans: "Pretendard", "Inter", system-ui, sans-serif;\n`;
// Tailwind v4 preflight의 body font-family는 --default-font-family를 읽음.
// 명시 안 하면 system stack fallback → site.css의 body { font-family: var(--font-sans); }을 override해 Pretendard 미적용.
out += `  --default-font-family: var(--font-sans);\n\n`;

// 브랜드 파일의 `primary` 는 design.md 형식이 요구하는 대표 색 키입니다 — 제품이 부를 이름이 아니므로 내보내지 않습니다.
const FORMAT_KEYS = new Set(["primary"]);
out += "  /* Colors */\n";
for (const [name, hex] of Object.entries(colors)) {
  if (FORMAT_KEYS.has(name)) continue;
  out += `  --color-${name}: ${hex};\n`;
}
out += "\n";

// v104 — 글자는 rem(÷16)으로 내보내 사용자의 글자 크기 설정을 따르고, 커지면 깨지는 자리용으로
// 같은 값을 px 그대로 `-static` 에 둔다(SEED 의 font-size · font-size-static 두 벌과 같다).
const toRem = (v) => {
  const m = /^(\d+(?:\.\d+)?)px$/.exec(String(v).trim());
  return m ? `${Number((Number(m[1]) / 16).toFixed(4))}rem` : v;
};
out += "  /* Typography — rem (글자 크기 설정을 따름) + -static px (고정). font-size · line-height · font-weight · letter-spacing */\n";
for (const [name, props] of Object.entries(typography)) {
  if (props.fontSize) out += `  --text-${name}: ${toRem(props.fontSize)};\n`;
  if (props.lineHeight) out += `  --text-${name}--line-height: ${toRem(props.lineHeight)};\n`;
  if (props.fontWeight) out += `  --text-${name}--font-weight: ${props.fontWeight};\n`;
  if (props.letterSpacing) out += `  --text-${name}--letter-spacing: ${props.letterSpacing};\n`;
}
for (const [name, props] of Object.entries(typography)) {
  if (props.fontSize) out += `  --text-${name}-static: ${props.fontSize};\n`;
  if (props.lineHeight) out += `  --text-${name}-static--line-height: ${props.lineHeight};\n`;
  if (props.fontWeight) out += `  --text-${name}-static--font-weight: ${props.fontWeight};\n`;
  if (props.letterSpacing) out += `  --text-${name}-static--letter-spacing: ${props.letterSpacing};\n`;
}
out += "\n";

out += "  /* Radius */\n";
for (const [name, val] of Object.entries(rounded)) {
  out += `  --radius-${name}: ${val};\n`;
}
out += "\n";

out += "  /* Spacing */\n";
for (const [name, val] of Object.entries(spacing)) {
  out += `  --spacing-${name}: ${val};\n`;
}
out += "\n";

out += "  /* Shadow (from prose-token table — DESIGN*.md '## Elevation & Depth') */\n";
for (const [name, val] of Object.entries(shadows)) {
  const hold = holdOf(name);
  out += `  --${name}: ${hold ? `var(--${hold})` : val};\n`;
}
out += "\n";

out += "  /* Motion (from prose-token table — DESIGN*.md '## Motion') */\n";
for (const [name, val] of Object.entries(motion)) {
  out += `  --${name}: ${val};\n`;
}
out += "\n";

out += "  /* Overlay dim (from prose-token table — alpha 채널 rgba) */\n";
for (const [name, val] of Object.entries(overlays)) {
  // overlay-dim-light → --overlay-dim-light
  out += `  --${name}: ${val};\n`;
}
out += "\n";

out += "  /* Breakpoints (from prose-token table — v101 SEED) */\n";
// Tailwind 기본 중단점을 먼저 지운다 — 안 지우면 표에 없는 기본 2xl(1536px)이 살아남는다.
out += "  --breakpoint-*: initial;\n";
for (const [name, val] of Object.entries(breakpoints)) {
  // breakpoint-sm → --breakpoint-sm
  out += `  --${name}: ${val};\n`;
}
out += "\n";

out += "  /* Layout (from prose-token table — v101 SEED: 콘텐츠 폭 · 여백 · 사이드바) */\n";
for (const [name, val] of Object.entries(layout)) {
  // layout-max-low → --layout-max-low
  out += `  --${name}: ${val};\n`;
}
out += "\n";

out += "  /* Gradient (from prose-token table — v104 SEED: fade-mask · shimmer-neutral) */\n";
for (const [name, val] of Object.entries(gradients)) {
  out += `  --${name}: ${val};\n`;
}
out += "\n";

out += "  /* Touch targets (from prose-token table — WCAG 2.5.5 AAA) */\n";
for (const [name, val] of Object.entries(touchTargets)) {
  // touch-min → --touch-min
  out += `  --${name}: ${val};\n`;
}
out += "\n";

out += "  /* Z-index (from prose-token table — v116 층 이름, specs/z-index.md L0 ~ L9). Tailwind: z-(--z-modal) */\n";
for (const [name, val] of Object.entries(zIndex)) {
  // z-modal → --z-modal, z-modal-content → --z-modal-content
  out += `  --${name}: ${val};\n`;
}
out += "}\n";

// 그림자 값 — @theme 의 --shadow-s1 ~ s4 가 가리키는 자리(위 SHADOW_HOLD). 다크 블록이 이 값을 바꾼다
const holds = Object.keys(shadows).filter((n) => holdOf(n));
if (holds.length > 0) {
  out += "\n/* Shadow values — --shadow-s1 ~ s4 가 var() 로 가리킨다(Tailwind 클래스도 다크를 따라가게). 다크는 아래 다크 블록 */\n:root {\n";
  for (const n of holds) out += `  --${holdOf(n)}: ${shadows[n]};\n`;
  out += "}\n";
}

// 다크 — 다크 값(-dark)이 따로 있는 토큰을 그 값으로 바꾼다(색 · 그림자 · 그라디언트). 쓰는 쪽은 <html> 에
// data-theme="dark" 나 class="dark" 를 단다. 팔레트도 SEED 처럼 모드마다 다르므로(v108) 함께 바꾼다.
// 값은 hex 로 풀어 적는다 — var() 사슬로 적으면 반대 모드 팔레트를 일부러 가리키는 반전 역할 색
// (fg-brand-inverted-dark → brand-600 …, v115)이 팔레트를 바꿀 때 한 번 더 뒤집힌다.
const colorTable = parseColorTable(lines);
const darkDecls = [];
for (const name of colorTable.keys()) {
  if (FORMAT_KEYS.has(name) || name.endsWith("-dark") || !colorTable.has(`${name}-dark`)) continue;
  darkDecls.push(`  --color-${name}: ${resolveColorHex(colorTable, `${name}-dark`)};`);
}
for (const table of [shadows, gradients]) {
  for (const [name] of Object.entries(table)) {
    if (name.endsWith("-dark") || !(`${name}-dark` in table)) continue;
    // 새 그림자 이름은 값을 든 --groo-shadow-sN 을 바꾼다
    const target = table === shadows && holdOf(name) ? holdOf(name) : name;
    darkDecls.push(`  --${target}: ${table[`${name}-dark`]};`);
  }
}
if (darkDecls.length > 0) {
  out += "\n/* Dark — 다크 값이 따로 있는 토큰(색 · 그림자 · 그라디언트)을 다크 값으로. <html data-theme=\"dark\"> 또는 <html class=\"dark\"> */\n";
  out += '[data-theme="dark"],\n.dark {\n';
  out += darkDecls.join("\n") + "\n";
  out += "}\n";
}

if (keyframes.length > 0) {
  out += "\n/* Keyframes (from v74 Animation library — DESIGN.md '## Motion → Animation library') */\n";
  for (const kf of keyframes) {
    out += `${kf.css}\n`;
  }
}

stdout.write(out);
