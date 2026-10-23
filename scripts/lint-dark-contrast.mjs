#!/usr/bin/env node
// Dark mode contrast lint (P3-A — v66 follow-up).
//
// spec @google/design.md lint는 light pair contrast만 검증. dark pair는
// 자동 검증되지 않아 토큰 변경 시 회귀 위험 — 본 스크립트가 보완.
//
// 검증 페어:
//   본문 4.5:1 (WCAG 1.4.3)
//     - text-primary-dark / text-secondary-dark × {bg-page-dark, surface-default-dark, surface-input-dark}
//     - text-tertiary-dark — 정보 위계상 미달 가능 (1.4.3 incidental, warning만)
//     - primary-light × dark 표면 (어두운 표면 위 brand 비채움)
//     - {success/error/warning/info}-light × dark 표면
//   UI 3:1 (WCAG 1.4.11)
//     - border-focus-light × dark 표면
//     - chart-*-dark(v110 — 옛 이름 -light) × dark 표면
//
// text-disabled-dark는 1.4.3 incidental 예외 — 검증 제외.
// text-on-accent는 채움 위 텍스트(primary fill 등) — light pair lint가 이미 검증.
//
// 사용법:
//   node scripts/lint-dark-contrast.mjs              # 모든 brand 파일
//   node scripts/lint-dark-contrast.mjs --strict     # 본문 미달 시 exit 1

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { argv, exit } from "node:process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TARGETS = ["DESIGN.md", "DESIGN.hr.md", "DESIGN.desk.md"];
const STRICT = argv.includes("--strict");

function parseColors(content) {
  const lines = content.split("\n");
  let inColors = false;
  const out = {};
  for (const line of lines) {
    if (/^colors:\s*$/.test(line)) { inColors = true; continue; }
    if (inColors && /^[a-zA-Z][a-zA-Z0-9_-]*:\s*$/.test(line)) break;
    if (inColors && /^---\s*$/.test(line)) break;
    if (!inColors) continue;
    const m = /^\s+([a-z0-9-]+):\s*"(#[0-9A-Fa-f]+)"/.exec(line);
    if (m) { out[m[1]] = m[2].toLowerCase(); continue; }
    const r = /^\s+([a-z0-9-]+):\s*"\{colors\.([a-z0-9-]+)\}"/.exec(line);
    if (r) out[r[1]] = { ref: r[2] };
  }
  // v108 — 참조 사슬(역할 → 팔레트)을 hex 로 푼다
  const resolveRef = (v, seen = 0) => (typeof v === "string" ? v : seen > 8 ? undefined : resolveRef(out[v.ref], seen + 1));
  for (const k of Object.keys(out)) out[k] = resolveRef(out[k]);
  return out;
}

function srgbToLinear(c) {
  c = c / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

const DARK_SURFACES = ["bg-page-dark", "surface-default-dark", "surface-input-dark"];
const BODY_TEXTS = ["text-primary-dark", "text-secondary-dark"];
const TERTIARY_TEXTS = ["text-tertiary-dark"]; // 1.4.3 incidental — warning only
const BRAND_LIGHT = ["primary-light"]; // brand-specific (HR/Desk)
const SEMANTIC_LIGHT = ["success-light", "error-light", "warning-light", "info-light"];
const UI_ELEMENTS_3 = ["border-focus-light", "stroke-focus-ring-dark"]; // border-focus-light 는 brand 파일만, stroke-focus-ring-dark 는 세 파일(그룹은 짙은 회색 — 2026-10-23)
const CHART_LIGHT = [
  "chart-red-dark", "chart-orange-dark", "chart-yellow-dark", "chart-green-dark",
  "chart-blue-dark", "chart-indigo-dark", "chart-violet-dark", "chart-pink-dark",
  "chart-brown-dark", "chart-gray-dark",
];

const RULES = [
  { texts: BODY_TEXTS, surfaces: DARK_SURFACES, threshold: 4.5, severity: "error", label: "본문 4.5:1" },
  { texts: TERTIARY_TEXTS, surfaces: DARK_SURFACES, threshold: 4.5, severity: "warning", label: "tertiary 4.5:1 (1.4.3 incidental 가능)" },
  { texts: BRAND_LIGHT, surfaces: DARK_SURFACES, threshold: 4.5, severity: "error", label: "brand text 4.5:1" },
  { texts: SEMANTIC_LIGHT, surfaces: DARK_SURFACES, threshold: 4.5, severity: "error", label: "semantic-light 4.5:1" },
  { texts: UI_ELEMENTS_3, surfaces: DARK_SURFACES, threshold: 3.0, severity: "error", label: "UI element 3:1" },
  { texts: CHART_LIGHT, surfaces: DARK_SURFACES, threshold: 3.0, severity: "warning", label: "chart UI 3:1" },
];

let totalErrors = 0;
let totalWarnings = 0;

for (const target of TARGETS) {
  const content = readFileSync(resolve(ROOT, target), "utf8");
  const colors = parseColors(content);

  console.log(`\n[${target}]`);
  let fileErrors = 0;
  let fileWarnings = 0;
  let fileChecked = 0;

  for (const rule of RULES) {
    for (const textName of rule.texts) {
      const textHex = colors[textName];
      if (!textHex) continue; // brand 파일에만 있는 토큰은 DESIGN.md(shared)에서 skip
      for (const surfaceName of rule.surfaces) {
        const surfaceHex = colors[surfaceName];
        if (!surfaceHex) continue;
        const ratio = contrastRatio(textHex, surfaceHex);
        const pass = ratio >= rule.threshold;
        fileChecked++;
        if (!pass) {
          const tag = rule.severity === "error" ? "✗ ERROR" : "⚠ WARN";
          console.log(`  ${tag}  ${textName} (${textHex}) × ${surfaceName} (${surfaceHex}): ${ratio.toFixed(2)}:1 < ${rule.threshold} (${rule.label})`);
          if (rule.severity === "error") fileErrors++;
          else fileWarnings++;
        }
      }
    }
  }

  if (fileErrors === 0 && fileWarnings === 0) {
    console.log(`  ✓ 검사 ${fileChecked}건 모두 통과 (본문 4.5:1 / UI 3:1)`);
  } else {
    console.log(`  검사 ${fileChecked}건 — errors ${fileErrors}, warnings ${fileWarnings}`);
  }

  totalErrors += fileErrors;
  totalWarnings += fileWarnings;
}

console.log(`\n총: errors ${totalErrors}, warnings ${totalWarnings}`);
if (totalErrors > 0 && STRICT) exit(1);
if (totalErrors === 0 && totalWarnings === 0) console.log("완료. 이슈 없음.");
