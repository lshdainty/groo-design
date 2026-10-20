#!/usr/bin/env node
// Tailwind v4 export 검증 (P1-F smoke test)
//
// exports/tokens*.css가 valid Tailwind v4 @theme CSS인지 가벼운 검증.
// 실제 Tailwind 컴파일 없이 namespace 출력 + 토큰 카운트 + CSS 구조 확인.
// devDependency 추가 0 — native Node ESM, regex 기반.
//
// 사용법:
//   npm run export:tailwind:all && node scripts/test-tailwind-export.mjs

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { exit } from "node:process";

import { parseColorTable, resolveColorHex, parseShadows, parseGradients } from "./lib/design-md.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const TARGETS = [
  { file: "exports/tokens.css", source: "DESIGN.md", isShared: true },
  { file: "exports/tokens.hr.css", source: "DESIGN.hr.md", isShared: false },
  { file: "exports/tokens.desk.css", source: "DESIGN.desk.md", isShared: false },
];

const NAMESPACE_PATTERNS = [
  { name: "color", regex: /^\s+--color-[a-z0-9-]+:/gm, minCount: 40 },
  { name: "font-sans", regex: /^\s+--font-sans:/gm, minCount: 1 },
  { name: "text (font-size, rem)", regex: /^\s+--text-[a-z0-9-]+:\s*[\d.]+rem;/gm, minCount: 7 },
  { name: "text static (px)", regex: /^\s+--text-[a-z0-9-]+-static:\s*\d+px;/gm, minCount: 7 },
  { name: "text--line-height modifier", regex: /^\s+--text-[a-z0-9-]+--line-height:/gm, minCount: 7 },
  { name: "text--font-weight modifier", regex: /^\s+--text-[a-z0-9-]+--font-weight:/gm, minCount: 7 },
  { name: "radius", regex: /^\s+--radius-[a-z0-9_]+:/gm, minCount: 7 },
  { name: "spacing", regex: /^\s+--spacing-[a-z0-9_-]+:/gm, minCount: 7 },
  { name: "shadow", regex: /^\s+--shadow-[a-z0-9-]+:/gm, minCount: 16 },
  { name: "motion-duration", regex: /^\s+--motion-duration-[a-z0-9-]+:/gm, minCount: 13 },
  { name: "motion-ease", regex: /^\s+--motion-ease-[a-z0-9-]+:/gm, minCount: 8 },
  { name: "gradient", regex: /^\s+--gradient-[a-z0-9-]+:/gm, minCount: 3 },
  { name: "overlay-dim", regex: /^\s+--overlay-dim-[a-z]+:/gm, minCount: 2 },
  { name: "breakpoint", regex: /^\s+--breakpoint-[a-z0-9]+:/gm, minCount: 4 },
  { name: "breakpoint reset", regex: /^\s+--breakpoint-\*:\s*initial;/gm, minCount: 1 },
  { name: "layout", regex: /^\s+--layout-[a-z0-9-]+:/gm, minCount: 6 },
  { name: "touch", regex: /^\s+--touch-[a-z0-9-]+:/gm, minCount: 3 },
  { name: "z-index", regex: /^\s+--z-[a-z-]+:/gm, minCount: 10 },
  { name: "@keyframes", regex: /^@keyframes\s+[a-z][a-z0-9-]*\s*\{/gm, minCount: 14 },
];

const BRAND_COLORS = ["primary", "primary-light", "border-focus", "border-focus-light"];

// v116 z-index — 층 이름 열 개(specs/z-index.md L0 ~ L9). 값은 DESIGN*.md 표가 원본이라 여기 적지 않고,
// 이름이 빠짐없이 나오는지 · z-base 가 auto 인지 · 나머지가 층 차례대로 커지는지 · 세 파일이 같은지만 본다.
const Z_LAYERS = [
  "z-base", "z-sticky", "z-modal", "z-modal-content", "z-floating", "z-tooltip",
  "z-alert", "z-alert-content", "z-snackbar", "z-dev",
];
const Z_REMOVED = ["z-dropdown", "z-drawer", "z-toast"]; // v65 — v116 에서 걷었다
let zShared = null;

function checkZIndex(css, target) {
  let errors = 0;
  const vars = new Map([...css.matchAll(/^\s+--(z-[a-z-]+):\s*([^;]+);/gm)].map((m) => [m[1], m[2].trim()]));
  const names = [...vars.keys()];
  if (names.join(",") !== Z_LAYERS.join(",")) {
    console.error(`  ❌ z-index 이름 · 차례: ${names.join(", ")} (expected ${Z_LAYERS.join(", ")})`);
    errors++;
  }
  for (const old of Z_REMOVED) {
    if (vars.has(old)) { console.error(`  ❌ 걷은 z-index 토큰 --${old} 가 남았다`); errors++; }
  }
  if (vars.get("z-base") !== "auto") { console.error(`  ❌ --z-base: ${vars.get("z-base")} (expected auto)`); errors++; }
  const nums = Z_LAYERS.slice(1).map((n) => Number(vars.get(n)));
  if (nums.some((v) => !Number.isInteger(v))) { console.error(`  ❌ z-index 값이 정수가 아니다: ${nums.join(", ")}`); errors++; }
  else if (nums.some((v, i) => i > 0 && v <= nums[i - 1])) { console.error(`  ❌ z-index 가 층 차례대로 커지지 않는다: ${nums.join(" < ")}`); errors++; }
  const sig = [...vars].map(([n, v]) => `${n}=${v}`).join(" ");
  if (target.isShared) zShared = sig;
  else if (zShared !== null && sig !== zShared) { console.error(`  ❌ z-index 가 공유 파일과 다르다: ${sig}`); errors++; }
  if (errors === 0) console.log(`  ✓ z-index 층: ${[...vars].map(([n, v]) => `${n} ${v}`).join(" · ")}`);
  return errors;
}

// 옛 그림자 이름 → 새 이름. @theme 에서 값이 아니라 var(--shadow-sN) 이어야 Tailwind 클래스(.shadow-lg)가 다크 값을 따라간다
const SHADOW_ALIAS = { "shadow-sm": "shadow-s1", "shadow-md": "shadow-s2", "shadow-lg": "shadow-s3", "shadow-xl": "shadow-s4" };
function checkShadowAliases(css) {
  let errors = 0;
  const theme = /@theme \{([\s\S]*?)\n\}/.exec(css)?.[1] ?? "";
  for (const [old, neu] of Object.entries(SHADOW_ALIAS)) {
    for (const [o, n] of [[old, neu], [`${old}-dark`, `${neu}-dark`]]) {
      const m = new RegExp(`^\\s+--${o}:\\s*([^;]+);`, "m").exec(theme);
      if (!m) { console.error(`  ❌ @theme 에 --${o} 없음`); errors++; }
      else if (m[1].trim() !== `var(--${n})`) { console.error(`  ❌ --${o}: ${m[1].trim()} (expected var(--${n}))`); errors++; }
    }
  }
  // 새 이름 — @theme 의 --shadow-sN 은 var(--groo-shadow-sN), 값(라이트)은 @theme 밖 :root 에(2026-10-17 — 01-003 A 를 새 이름에도)
  const md = readFileSync(resolve(ROOT, "DESIGN.md"), "utf8");
  const sh = parseShadows(md);
  const hold = /\n:root \{\n([\s\S]*?)\n\}/.exec(css)?.[1] ?? "";
  for (const n of [1, 2, 3, 4]) {
    const m = new RegExp(`^\\s+--shadow-s${n}:\\s*([^;]+);`, "m").exec(theme);
    if (!m || m[1].trim() !== `var(--groo-shadow-s${n})`) { console.error(`  ❌ --shadow-s${n}: ${m?.[1]} (expected var(--groo-shadow-s${n}))`); errors++; }
    const v = new RegExp(`^\\s+--groo-shadow-s${n}:\\s*([^;]+);`, "m").exec(hold);
    if (!v || v[1].trim() !== sh[`shadow-s${n}`]) { console.error(`  ❌ :root --groo-shadow-s${n}: ${v?.[1]} (expected ${sh[`shadow-s${n}`]})`); errors++; }
  }
  if (errors === 0) console.log(`  ✓ 그림자 — 옛 이름 → var(--shadow-s1 ~ s4) → var(--groo-shadow-s1 ~ s4), 다크 블록이 값을 바꾼다`);
  return errors;
}

function checkDarkBlock(css, target) {
  let errors = 0;
  const m = /\[data-theme="dark"\],\n\.dark \{\n([\s\S]*?)\n\}/.exec(css);
  if (!m) { console.error("  ❌ 다크 블록([data-theme=\"dark\"], .dark) 없음"); return 1; }
  const decls = new Map([...m[1].matchAll(/^\s+--([a-z0-9-]+):\s*([^;]+);/gm)].map((d) => [d[1], d[2].trim()]));
  const md = readFileSync(resolve(ROOT, target.source), "utf8");
  const table = parseColorTable(md.split("\n"));
  const expected = new Map();
  for (const name of table.keys()) {
    if (name.endsWith("-dark") || !table.has(`${name}-dark`)) continue;
    expected.set(`color-${name}`, resolveColorHex(table, `${name}-dark`));
  }
  // 옛 그림자 이름(shadow-sm ~ xl)은 @theme 에서 var(--shadow-s1 ~ s4) 라 다크 블록에 따로 두지 않는다(01-003 A — 아래 checkShadowAliases)
  for (const t of [parseShadows(md), parseGradients(md)]) {
    for (const [name, val] of Object.entries(t)) {
      if (name.endsWith("-dark") || !t[`${name}-dark`] || name in SHADOW_ALIAS) continue;
      // 새 그림자 이름(shadow-s1 ~ s4)은 값을 든 --groo-shadow-sN 을 바꾼다(아래 checkShadowAliases)
      expected.set(/^shadow-s\d+$/.test(name) ? `groo-${name}` : name, t[`${name}-dark`]);
    }
  }
  for (const [name, val] of expected) {
    if (!decls.has(name)) { console.error(`  ❌ 다크 블록에 --${name} 없음`); errors++; }
    else if (decls.get(name).toLowerCase() !== val.toLowerCase()) { console.error(`  ❌ 다크 --${name}: ${decls.get(name)} (expected ${val})`); errors++; }
  }
  for (const [name, val] of decls) {
    if (!expected.has(name)) { console.error(`  ❌ 다크 블록의 --${name} 는 다크 짝이 없는 토큰`); errors++; }
    if (/var\(/.test(val)) { console.error(`  ❌ 다크 --${name} 이 var() 사슬이다: ${val}`); errors++; }
  }
  if (errors === 0) console.log(`  ✓ 다크 블록: ${decls.size} 토큰(색 · 그림자 · 그라디언트, 값 풀어 둠)`);
  return errors;
}

let totalErrors = 0;

for (const target of TARGETS) {
  const filePath = resolve(ROOT, target.file);
  console.log(`\n[${target.file}]`);

  if (!existsSync(filePath)) {
    console.error(`  ❌ 파일 없음 — npm run export:tailwind:all 먼저 실행`);
    totalErrors++;
    continue;
  }

  const css = readFileSync(filePath, "utf8");

  // 1. @theme block 존재 확인
  if (!/@theme\s*\{/.test(css)) {
    console.error(`  ❌ @theme { ... } 블록 없음`);
    totalErrors++;
    continue;
  }
  console.log(`  ✓ @theme block`);

  // 2. namespace별 minCount 검증
  let nsFail = 0;
  for (const ns of NAMESPACE_PATTERNS) {
    const matches = css.match(ns.regex) || [];
    if (matches.length < ns.minCount) {
      console.error(`  ❌ ${ns.name}: ${matches.length} (expected ≥ ${ns.minCount})`);
      nsFail++;
    } else {
      console.log(`  ✓ ${ns.name}: ${matches.length}`);
    }
  }
  totalErrors += nsFail;

  // 2-1. z-index 층(v116)
  totalErrors += checkZIndex(css, target);

  // 3. brand-specific 토큰 검증 (HR/Desk only)
  if (!target.isShared) {
    for (const bk of BRAND_COLORS) {
      const re = new RegExp(`--color-${bk}:`, "m");
      if (!re.test(css)) {
        console.error(`  ❌ brand 토큰 --color-${bk} 누락`);
        totalErrors++;
      }
    }
    if (BRAND_COLORS.every(bk => new RegExp(`--color-${bk}:`).test(css))) {
      console.log(`  ✓ brand 토큰 (primary, primary-light, border-focus, border-focus-light)`);
    }
  }

  // 4. CSS 구조 valid (괄호 균형)
  const openBraces = (css.match(/\{/g) || []).length;
  const closeBraces = (css.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    console.error(`  ❌ CSS 괄호 불균형: { ${openBraces} vs } ${closeBraces}`);
    totalErrors++;
  } else {
    console.log(`  ✓ CSS 괄호 균형 ({ ${openBraces} = } ${closeBraces})`);
  }

  // 4-1. 다크 블록(2026-10-06) — 다크 값(-dark)이 따로 있는 색 · 그림자 · 그라디언트를 빠짐없이 덮고,
  //      값은 DESIGN 에서 풀어 둔 값이다(var() 사슬이면 반전 역할 색 fg-*-inverted 가 한 번 더 뒤집힌다).
  totalErrors += checkDarkBlock(css, target);
  totalErrors += checkShadowAliases(css);

  // 5. 정의되지 않은 placeholder 검출 (예: undefined, null, NaN)
  const placeholders = css.match(/:\s*(undefined|null|NaN);/g);
  if (placeholders) {
    console.error(`  ❌ undefined/null/NaN 값 발견: ${placeholders.join(", ")}`);
    totalErrors++;
  }
}

console.log("");
if (totalErrors > 0) {
  console.error(`\n검증 실패: ${totalErrors}건. exports를 다시 빌드하거나 build-tailwind-v4.mjs를 점검하세요.`);
  exit(1);
}
console.log(`검증 통과 — Tailwind v4 @theme CSS 모든 namespace 정상 출력.`);
