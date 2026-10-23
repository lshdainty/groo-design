#!/usr/bin/env node
// 앱 · 테스트용 내보내기 검증 — Dart 토큰(exports/tokens.<브랜드>.dart) · 스펙 값 JSON(exports/spec/<브랜드>/ · 그룹은 exports/spec/group/).
// Flutter 없이 돌린다(CI 에 Flutter 가 없다). 컴파일은 앱 레포의 flutter analyze 가 본다 — 여기서는
// 무엇이 빠지거나 옛 이름이 섞이거나 값이 덜 풀린 채 나가는지만 막는다.
//
// 사용법:
//   npm run export:dart:all && npm run export:spec && node scripts/test-app-exports.mjs

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { exit } from "node:process";

import { parseColorTable, colorAliases } from "./lib/design-md.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BRANDS = [
  { brand: "desk", source: "DESIGN.desk.md" },
  { brand: "hr", source: "DESIGN.hr.md" },
];

let errors = 0;
const fail = (msg) => { console.error(`  ❌ ${msg}`); errors++; };
const ok = (msg) => console.log(`  ✓ ${msg}`);

// ── Dart ──────────────────────────────────────────────────────────
function checkDart({ brand, source }) {
  const file = `exports/tokens.${brand}.dart`;
  console.log(`\n[${file}]`);
  const path = resolve(ROOT, file);
  if (!existsSync(path)) return fail("파일 없음 — npm run export:dart:all 먼저");
  const dart = readFileSync(path, "utf8");

  for (const cls of ["PSpacing", "PRounded", "PTypography", "PDuration", "PEasing", "PTouch"]) {
    if (!new RegExp(`abstract final class ${cls} \\{`).test(dart)) fail(`${cls} 없음`);
  }
  for (const cls of ["PColors", "PShadows", "PGradients"]) {
    if (!new RegExp(`class ${cls} extends ThemeExtension<${cls}>`).test(dart)) fail(`${cls} 없음`);
  }
  // 그라디언트 — 반짝임은 모드마다(다크 흰 10%), 마스크는 위 → 아래 16단계
  const shimmer = /shimmerNeutral: LinearGradient\(begin: Alignment\.centerLeft, end: Alignment\.centerRight, colors: \[Color\(0x00FFFFFF\), Color\(0x1AFFFFFF\)/;
  if (!shimmer.test(dart)) fail("PGradients.shimmerNeutral(다크 흰 10%) 없음");
  const mask = /fadeMask: LinearGradient\(begin: Alignment\.topCenter, end: Alignment\.bottomCenter, colors: \[((?:Color\(0x[0-9A-F]{8}\)(?:, )?){16})\]/;
  if (!mask.test(dart)) fail("PGradients.fadeMask(위 → 아래 16단계) 없음");

  // 색 — 별칭(옛 이름) · -dark 를 뺀 이름이 모두 필드가 되고, 딤이 하나 더 있다
  const table = parseColorTable(readFileSync(resolve(ROOT, source), "utf8").split("\n"));
  const aliases = colorAliases(table);
  const want = [...table.keys()].filter((n) => !n.endsWith("-dark") && !aliases.has(n)).length + 1;
  const colors = /class PColors[\s\S]*?const PColors\(\{([\s\S]*?)\}\);/.exec(dart);
  const got = colors ? (colors[1].match(/required this\./g) || []).length : 0;
  if (got !== want) fail(`PColors 필드 ${got} (expected ${want})`);
  else ok(`PColors 필드 ${got} — 옛 이름 ${aliases.size} 개는 뺐다`);
  for (const old of ["primary", "textSecondary", "surfaceInput", "success", "chartRedLight"]) {
    if (new RegExp(`final Color ${old};`).test(dart)) fail(`옛 이름 ${old} 이 PColors 에 남았다`);
  }

  // 스케일 — SEED 이름의 값, 옛 이름 없음
  const expect = [
    [/static const double x4 = 16;/, "PSpacing.x4 = 16"],
    [/static const double x1_5 = 6;/, "PSpacing.x1_5 = 6"],
    [/static const double r2 = 8;/, "PRounded.r2 = 8"],
    [/static const Duration d3 = Duration\(milliseconds: 150\);/, "PDuration.d3 = 150ms"],
    [/static const Curve easing = Cubic\(0\.35, 0, 0\.35, 1\);/, "PEasing.easing"],
    [/static const TextStyle t4 = TextStyle\([^)]*fontSize: 14, height: 19 \/ 14/, "PTypography.t4 = 14/19"],
  ];
  for (const [re, label] of expect) if (!re.test(dart)) fail(`${label} 없음`);
  for (const old of [/static const double xs = /, /static const double lg = /, /static const TextStyle displayXl /, /static const Duration fast /]) {
    if (old.test(dart)) fail(`옛 이름이 남았다: ${old}`);
  }
  if (/undefined|NaN|null\)/.test(dart)) fail("undefined · NaN 이 있다");
  if (errors === 0) ok("스케일 · 이징 · 글자 · 그림자 이름과 값");
}

// ── 스펙 값 JSON ───────────────────────────────────────────────────
// 쓰는 쪽이 할 일 그대로 — 조합에 맞는 규칙을 고르고, 기본 상태 → 그 상태 차례로 겹친다(site/lib/component-spec.ts 와 같다).
function resolveState(spec, combo, state) {
  const full = { ...spec.defaults, ...combo };
  const base = spec.states[0];
  const rules = spec.rules.filter((r) => Object.entries(r.when).every(([k, v]) => full[k] === v));
  const out = {};
  for (const s of state === base ? [base] : [base, state]) {
    for (const r of rules) for (const [slot, props] of Object.entries(r[s] ?? {})) for (const [p, v] of Object.entries(props)) out[`${slot}.${p}`] = v;
  }
  return out;
}

function walk(v, path, visit) {
  if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`, visit));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`, visit);
  else visit(v, path);
}

function checkSpec({ brand }) {
  const dir = `exports/spec/${brand}`;
  console.log(`\n[${dir}]`);
  const abs = resolve(ROOT, dir);
  if (!existsSync(abs)) return fail("폴더 없음 — npm run export:spec 먼저");
  const yamls = readdirSync(join(ROOT, "specs/components")).filter((f) => f.endsWith(".yaml"));
  let unresolved = 0;
  for (const y of yamls) {
    const file = join(abs, y.replace(/\.yaml$/, ".json"));
    if (!existsSync(file)) { fail(`${y} 의 JSON 없음`); continue; }
    const spec = JSON.parse(readFileSync(file, "utf8"));
    walk(spec.rules ?? [], y, (v, path) => {
      if (typeof v === "string" && v.trim().startsWith("$")) { if (unresolved++ < 5) fail(`덜 풀린 토큰 ${path}: ${v}`); }
    });
  }
  if (unresolved === 0) ok(`${yamls.length} 개 — 덜 풀린 토큰 0`);

  // 값 하나를 끝까지 — Button neutralSolid · medium · withText (사용자에게 보인 비교 페이지와 같은 값)
  const button = JSON.parse(readFileSync(join(abs, "button.json"), "utf8"));
  const enabled = resolveState(button, { variant: "neutralSolid", size: "medium", layout: "withText" }, "enabled");
  const pressed = resolveState(button, { variant: "neutralSolid", size: "medium", layout: "withText" }, "pressed");
  const checks = [
    [enabled["root.height"], 40],
    [enabled["root.radius"], 8],
    [enabled["root.paddingX"], 16],
    [JSON.stringify(enabled["root.background"]), JSON.stringify({ light: "#1A1F2E", dark: "#F5F6FA" })],
    [JSON.stringify(pressed["root.background"]), JSON.stringify({ light: "#535866", dark: "#B7BDCC" })],
  ];
  if (checks.every(([a, b]) => a === b)) ok("Button neutralSolid · medium — 높이 40 · 모서리 8 · 바탕 #1A1F2E / #F5F6FA · 누름 #535866");
  else fail(`Button neutralSolid · medium 값이 다르다: ${JSON.stringify(checks)}`);
}

for (const b of BRANDS) {
  checkDart(b);
  checkSpec(b);
}

// 그룹 파일(DESIGN.md) — 그루 계정 · 홈 · 그룹 문서가 받는다. Dart 는 없다(앱 짝 없음).
// 포커스 링은 짙은 회색, brand 칸은 싣지 않고 skipped 에만 있다(2026-10-23 I-18 Q1-A)
checkSpec({ brand: "group" });
{
  const abs = resolve(ROOT, "exports/spec/group");
  if (existsSync(abs)) {
    const accordion = JSON.parse(readFileSync(join(abs, "accordion.json"), "utf8"));
    const ring = JSON.stringify(accordion.rules[0]?.focused?.focusRing?.color);
    if (ring === JSON.stringify({ light: "#1A1F2E", dark: "#F5F6FA" })) ok("포커스 링 — 짙은 회색 #1A1F2E / #F5F6FA");
    else fail(`그룹 포커스 링 값이 다르다: ${ring}`);
    let skipped = 0;
    for (const f of readdirSync(abs).filter((x) => x.endsWith(".json") && x !== "index.json")) {
      for (const s of JSON.parse(readFileSync(join(abs, f), "utf8")).skipped ?? []) {
        skipped++;
        if (!/^(fg-brand|bg-brand|stroke-brand|brand-\d)/.test(s.token)) fail(`${f} — brand 아닌 칸을 건너뛰었다: ${s.token}`);
      }
    }
    ok(`건너뛴 칸 ${skipped} 개 — 모두 brand`);
  }
}

console.log("");
if (errors > 0) {
  console.error(`검증 실패: ${errors}건.`);
  exit(1);
}
console.log("검증 통과 — Dart 토큰 · 스펙 값 JSON.");
