#!/usr/bin/env node
// Prose 토큰 reference 정합성 검사 (P2-F)
//
// DESIGN*.md의 prose에서 백틱(``)으로 감싼 토큰 이름을 추출해,
// 같은 파일의 frontmatter YAML(colors/components) 또는 prose-token 표
// (shadow/motion/overlay)에 정의된 토큰과 비교. 정의되지 않은 reference는
// typo 또는 outdated를 의심.
//
// 추가로 타이포/radius/spacing 주석(`t5` (16/400) · `radius-r4` (16px)
// 형태)의 px 가 frontmatter typography·rounded·spacing 블록의 값과 맞는지 검사한다. 토큰 값이 바뀌어도 본문 괄호는 안 따라와
// 사본이 낡기 때문이다.
// weight 는 검사하지 않는다 — "weight 강조는 인라인 modifier" 가 규약이라
// 버튼(font-medium 500)처럼 토큰 weight 와 다른 게 정상이다.
// radius-full 도 검사하지 않는다 — `radius-full` (40px 원형) 처럼 괄호가 radius 가
// 아니라 요소 지름을 가리키는 표기가 정상이다.
//
// 사용법:
//   node scripts/lint-prose.mjs              # 모든 파일 검사
//   node scripts/lint-prose.mjs --strict     # 발견 시 exit 1 (CI 친화)

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { argv, exit } from "node:process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TARGETS = ["DESIGN.md", "DESIGN.hr.md", "DESIGN.desk.md"];

const TOKEN_PREFIXES = [
  "bg-", "surface-", "text-", "border-", "primary", "success", "error",
  "warning", "info", "chart-", "badge-", "button-", "card-", "input-",
  "placeholder-", "alert-text-", "caption-", "caption-tertiary-",
  "page-text-", "focus-ring-", "divider-", "outline-", "outline-strong-",
  "disabled-label-", "shadow-", "motion-duration-", "motion-ease-",
  "overlay-dim-", "radius-", "spacing-", "breakpoint-", "layout-", "fg-", "stroke-", "static-", "gradient-",
  "z-", // v116 z-index 층 이름 — 걷은 v65 이름(z-drawer · z-toast …)이 본문에 남으면 잡는다
];

// 토큰처럼 보이지만 실제로는 CSS 속성/HTML/일반 단어인 단어들 — 보고에서 제외
const NOISE = new Set([
  "border-radius", "border-bottom", "border-top", "border-left", "border-right",
  "background-color", "text-decoration", "text-align", "font-size", "font-weight",
  "line-height", "letter-spacing", "box-shadow", "outline-offset",
  "primary", "secondary", "tertiary", // generic words (positional)
  "border", "input", "text", "outline", // CSS properties / HTML elements (단독)
  "outline-strong", "shadow-sm", "shadow-md", "shadow-lg", "shadow-xl", // 토큰 prefix 그룹 명 (실제 토큰은 -light/-dark suffix)
  "overlay-dim", // overlay-dim-light/dark 그룹 prefix (실제 토큰은 -light/-dark suffix)
  "alert-text", "badge", "button", "card", "chart", // 컴포넌트 그룹 명 (실제 토큰은 -success 등 suffix). v83 radius mapping에서 prose에 등장.
  "focus-ring-enhanced", "divider-dashed", "caption-strong", // 미정 / 향후 후보 prose mention
  // DESIGN.md(brand-neutral)에서 brand 위임 안내용으로 reference하는 brand 토큰 — 의도된 패턴
  "stroke-focus-ring", // v106 State 절 — 포커스 링 색은 브랜드 역할(v102)
  "fg-brand-inverted", // v115 알림 메시지 절 — 스낵바 액션 색은 브랜드 역할(반전 짝)
  "border-vs-surface", // 비교 표현 ("border vs surface")
  // CSS logical properties (v76 RTL doc) — physical/logical property 표기, 토큰 아님
  "margin-left", "margin-right", "margin-inline-start", "margin-inline-end",
  "padding-left", "padding-right", "padding-inline-start", "padding-inline-end",
  "border-left", "border-right", "border-inline-start", "border-inline-end",
  "border-top-left-radius", "border-top-right-radius",
  "border-bottom-left-radius", "border-bottom-right-radius",
  "border-start-start-radius", "border-start-end-radius",
  "border-end-start-radius", "border-end-end-radius",
  "inset-inline-start", "inset-inline-end",
  "padding-block-start", "padding-block-end",
  "text-start", "text-end",
  "inline-size", "block-size", "max-inline-size",
  "z-index", // CSS 속성 이름 — z- 토큰 아님
]);

function looksLikeToken(s) {
  if (NOISE.has(s)) return false;
  if (!/^[a-z][a-z0-9_-]*$/.test(s)) return false;
  if (/^z-\d+$/.test(s)) return false; // Tailwind 숫자 z 클래스(z-50 · z-10) — 토큰이 아니다
  return TOKEN_PREFIXES.some(p => s === p.replace(/-$/, "") || s.startsWith(p));
}

function findBlockLines(lines, key) {
  const startRe = new RegExp(`^${key}:\\s*$`);
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (startRe.test(lines[i])) { start = i; break; }
  }
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^---\s*$/.test(line)) { end = i; break; }
    if (/^[a-zA-Z][a-zA-Z0-9_-]*:\s*$/.test(line)) { end = i; break; }
  }
  return { start, end };
}

function extractDefinedTokens(content) {
  const lines = content.split("\n");
  const defined = new Set();

  // colors block
  const colors = findBlockLines(lines, "colors");
  if (colors) {
    for (let i = colors.start + 1; i < colors.end; i++) {
      const m = /^\s+([a-z][a-z0-9-]+):\s*"(#|\{colors\.)/.exec(lines[i]);
      if (m) defined.add(m[1]);
    }
  }

  // components block (top-level keys only)
  const components = findBlockLines(lines, "components");
  if (components) {
    for (let i = components.start + 1; i < components.end; i++) {
      const m = /^\s\s([a-z][a-z0-9-]+):\s*$/.exec(lines[i]);
      if (m) defined.add(m[1]);
    }
  }

  // prose tokens (shadow / motion / overlay / breakpoint / layout / gradient / z-index tables)
  const proseRe = /^\|\s*`((?:shadow|motion-(?:duration|ease)|overlay|breakpoint|layout|gradient|z)-[a-z0-9-]+)`\s*\|/gm;
  let m;
  while ((m = proseRe.exec(content)) !== null) defined.add(m[1]);

  // typography / rounded / spacing keys + v4 prefix 매핑
  // (prose에서 `radius-md` 같은 v4 prefix로 reference하는 것까지 정의된 토큰으로 인정)
  const prefixMap = { typography: "text-", rounded: "radius-", spacing: "spacing-" };
  for (const key of ["typography", "rounded", "spacing"]) {
    const block = findBlockLines(lines, key);
    if (!block) continue;
    for (let i = block.start + 1; i < block.end; i++) {
      const m = /^\s\s([a-z0-9][a-z0-9_-]*):/.exec(lines[i]);
      if (m) {
        defined.add(m[1]);
        defined.add(prefixMap[key] + m[1]);
      }
    }
  }
  defined.add("font-sans");

  return defined;
}

function findFrontmatterEnd(content) {
  const lines = content.split("\n");
  if (lines[0] !== "---") return 0;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "---") return i;
  }
  return lines.length;
}

// === prose 줄 (줄 번호 보존) ===
// 코드블록을 통째로 지우면 그만큼 줄 번호가 밀려 보고가 엉뚱한 줄을 가리킨다.
// 줄 수는 유지한 채 코드블록 안만 빈 줄로 만든다.
function proseLines(content) {
  const fmEnd = findFrontmatterEnd(content);
  const all = content.split("\n");
  const out = [];
  let inCode = false;
  for (let i = fmEnd + 1; i < all.length; i++) {
    const raw = all[i];
    if (/^\s*```/.test(raw)) { inCode = !inCode; out.push({ text: "", no: i + 1 }); continue; }
    out.push({ text: inCode ? "" : raw, no: i + 1 });
  }
  return out;
}

function extractProseReferences(content) {
  const inlineRe = /`([^`\n]+)`/g;
  const out = new Map(); // token → 첫 등장 line
  for (const { text, no } of proseLines(content)) {
    let m;
    inlineRe.lastIndex = 0;
    while ((m = inlineRe.exec(text)) !== null) {
      const inner = m[1].trim();
      // multi-word, css value 등은 skip — 단순 단일 토큰명만
      if (/[\s,(){}]/.test(inner)) continue;
      if (looksLikeToken(inner)) {
        if (!out.has(inner)) out.set(inner, no);
      }
    }
  }
  return out;
}

// === yaml hex 추출 (colors block) ===
function extractDefinedHex(content) {
  const lines = content.split("\n");
  const out = new Map(); // token → hex (lowercase)
  const refs = new Map(); // token → 가리키는 토큰
  const colors = findBlockLines(lines, "colors");
  if (!colors) return out;
  for (let i = colors.start + 1; i < colors.end; i++) {
    const m = /^\s+([a-z][a-z0-9-]+):\s*"(#[0-9A-Fa-f]{6,8})"/.exec(lines[i]);
    if (m) { out.set(m[1], m[2].toLowerCase()); continue; }
    const r = /^\s+([a-z][a-z0-9-]+):\s*"\{colors\.([a-z0-9-]+)\}"/.exec(lines[i]);
    if (r) refs.set(r[1], r[2]);
  }
  // v108 — 역할 · 옛 이름은 팔레트를 가리키는 참조 — 사슬을 풀어 hex 로
  const resolveRef = (name, depth = 0) => (out.has(name) ? out.get(name) : depth > 8 || !refs.has(name) ? undefined : resolveRef(refs.get(name), depth + 1));
  for (const k of refs.keys()) { const v = resolveRef(k); if (v) out.set(k, v); }
  return out;
}

// === rounded / spacing 정의 추출 ===
// prose 는 `radius-xl` · `spacing-lg` 로 쓰는데 yaml 키는 xl · lg 라 접두사를 붙여 담는다.
function extractScale(content, blockKey, prefix) {
  const lines = content.split("\n");
  const out = new Map();
  const block = findBlockLines(lines, blockKey);
  if (!block) return out;
  for (let i = block.start + 1; i < block.end; i++) {
    const m = /^\s+([a-z0-9][a-z0-9_-]*):\s*"?(\d+(?:\.\d+)?)px/.exec(lines[i]);
    if (m) out.set(`${prefix}-${m[1]}`, Number(m[2]));
  }
  return out;
}

// === typography 정의(fontSize) 추출 ===
function extractTypographySizes(content) {
  const lines = content.split("\n");
  const out = new Map(); // token → px(Number)
  const block = findBlockLines(lines, "typography");
  if (!block) return out;
  let cur = null;
  for (let i = block.start + 1; i < block.end; i++) {
    const key = /^\s{2}([a-z][a-z0-9-]*):\s*$/.exec(lines[i]);
    if (key) { cur = key[1]; continue; }
    const fs = /^\s+fontSize:\s*(\d+(?:\.\d+)?)px/.exec(lines[i]);
    if (fs && cur) out.set(cur, Number(fs[1]));
  }
  return out;
}

// === 타이포 주석 추출 ===
// `t5` (16/400) · `t2` (12px) · `t5` (16/400/22) 형태에서
// 토큰명과 괄호 첫 숫자(px)를 뽑는다.
// radius-full 은 괄호가 지름을 가리키는 표기가 정상이라 검사 대상에서 뺀다.
const ANNOT_SKIP = new Set(["radius-full"]);

function extractTypoAnnotations(content, sizes) {
  const re = /`([a-z][a-z0-9-]*)`\s*\((\d+(?:\.\d+)?)(?:px)?(?=[\s/)])/g;
  const out = [];
  for (const { text, no } of proseLines(content)) {
    if (!text || isHistoryLine(text)) continue;
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(text)) !== null) {
      const [, token, px] = m;
      if (ANNOT_SKIP.has(token) || !sizes.has(token)) continue;
      out.push({
        token,
        px: Number(px),
        expected: sizes.get(token),
        line: no,
        snippet: text.trim().slice(0, 110),
      });
    }
  }
  return out;
}

// === history context heuristic ===
// line이 변천 history (의도된 outdated hex)면 true 반환 → mismatch 검사 skip
function isHistoryLine(line, opts = {}) {
  // arrow "→" 패턴 — 변천 매트릭스
  if (line.includes("→")) return true;
  // milestone reference (v10, v51 등) — 변천 시점 명시
  if (/v\d{1,3}\s*(?:추가|시점|이전|이후|hex)/.test(line)) return true;
  // "이전" / "현재" 키워드 — 변천 표 헤더
  if (/(?:^|[\s|])(?:이전|이후|현재|history|previous|deprecated)(?:[\s|]|$)/.test(line)) return true;
  // 표 row 검사 시 — 한 line에 hex가 2개 이상이면 migration 표 가능성
  // (`| token | old-hex | new-hex |` 패턴). spec 표(parenthetical)는 별도 처리.
  if (opts.fromTableRow) {
    const hexMatches = line.match(/#[0-9A-Fa-f]{6,8}/g);
    if (hexMatches && hexMatches.length >= 2) return true;
  }
  return false;
}

// === prose 안 토큰명 + hex 페어 추출 ===
// 보수적 heuristic — 표 row 패턴(`| `token` | `#hex` ... |`)만 페어로 인정.
// 자유 prose 안 hex 인용은 false positive(한 line 여러 hex, 다른 토큰의 contrast 페어 표 등)
// 너무 많아 검사 제외. 토큰값 변경 시 정정 우선순위 높은 표는 milestone history 표 + spec 표.
function extractProseHexCitations(content) {
  const fmEnd = findFrontmatterEnd(content);
  const proseLines = content.split("\n").slice(fmEnd + 1);
  let inCodeBlock = false;
  const cites = []; // { token, hex, line, originalLine }
  // (A) 표 row: 첫 cell = `token` (괄호 옵션), 둘째 cell 시작에 `#hex`
  const tableRowRe = /^\|\s*`([a-z][a-z0-9-]+)`(?:\s*\([^)]*\))?\s*\|\s*`(#[0-9A-Fa-f]{6,8})`/;
  // (B) 괄호 안 hex 패턴: `token` (`#hex`) — spec 표 cell 안 inline reference
  // 같은 토큰이 여러 번 등장 가능 — 모두 수집
  const inlineParenRe = /`([a-z][a-z0-9-]+)`\s*\(\s*`(#[0-9A-Fa-f]{6,8})`\s*\)/g;
  for (let i = 0; i < proseLines.length; i++) {
    const line = proseLines[i];
    if (line.trim().startsWith("```")) { inCodeBlock = !inCodeBlock; continue; }
    if (inCodeBlock) continue;
    // (A) 표 row 패턴 — migration 표(2 hex column) 자동 skip
    if (!isHistoryLine(line, { fromTableRow: true })) {
      const tableMatch = tableRowRe.exec(line);
      if (tableMatch && looksLikeToken(tableMatch[1])) {
        cites.push({
          token: tableMatch[1],
          hex: tableMatch[2].toLowerCase(),
          line: fmEnd + 1 + i + 1,
          originalLine: line,
        });
      }
    }
    // (B) 괄호 inline 페어 — spec 표 cell 안 reference, history skip 더 보수적
    if (!isHistoryLine(line)) {
      inlineParenRe.lastIndex = 0;
      let pm;
      while ((pm = inlineParenRe.exec(line)) !== null) {
        if (looksLikeToken(pm[1])) {
          cites.push({
            token: pm[1],
            hex: pm[2].toLowerCase(),
            line: fmEnd + 1 + i + 1,
            originalLine: line,
          });
        }
      }
    }
  }
  return cites;
}

const strict = argv.includes("--strict");
let totalUndefined = 0;
let totalMismatch = 0;
let totalTypoPx = 0;

for (const target of TARGETS) {
  const filePath = resolve(ROOT, target);
  console.log(`\n[${target}]`);
  const content = readFileSync(filePath, "utf8");
  const defined = extractDefinedTokens(content);
  const definedHex = extractDefinedHex(content);
  const refs = extractProseReferences(content);
  const cites = extractProseHexCitations(content);
  const scale = new Map([
    ...extractTypographySizes(content),
    ...extractScale(content, "rounded", "radius"),
    ...extractScale(content, "spacing", "spacing"),
  ]);
  const annots = extractTypoAnnotations(content, scale);

  console.log(`  정의 토큰 ${defined.size} (hex 페어 ${definedHex.size}), prose reference ${refs.size}, hex 인용 ${cites.length}`);

  // 1) Dangling reference
  const undef = [];
  for (const [ref, line] of refs) {
    if (!defined.has(ref)) undef.push({ ref, line });
  }
  if (undef.length === 0) {
    console.log(`  ✓ 모든 prose token reference 정의됨`);
  } else {
    console.log(`  ⚠ 정의되지 않은 reference ${undef.length}건:`);
    for (const { ref, line } of undef.slice(0, 30)) {
      console.log(`    - ${target}:${line}  \`${ref}\``);
    }
    if (undef.length > 30) console.log(`    ... (${undef.length - 30}건 추가)`);
    totalUndefined += undef.length;
  }

  // 2) Hex mismatch (yaml vs prose)
  const mismatches = [];
  for (const { token, hex, line, originalLine } of cites) {
    const yamlHex = definedHex.get(token);
    if (!yamlHex) continue; // yaml에 없는 토큰은 dangling reference로 이미 보고됨
    if (yamlHex !== hex) {
      mismatches.push({ token, yamlHex, proseHex: hex, line, snippet: originalLine.trim().slice(0, 100) });
    }
  }
  if (mismatches.length === 0) {
    console.log(`  ✓ yaml/prose hex 일관성 통과`);
  } else {
    console.log(`  ⚠ hex mismatch ${mismatches.length}건 (history line은 자동 skip — heuristic 한계):`);
    for (const m of mismatches.slice(0, 20)) {
      console.log(`    - ${target}:${m.line}  \`${m.token}\` yaml=${m.yamlHex} ↔ prose=${m.proseHex}`);
      console.log(`         | ${m.snippet}`);
    }
    if (mismatches.length > 20) console.log(`    ... (${mismatches.length - 20}건 추가)`);
    totalMismatch += mismatches.length;
  }

  // 3) 토큰 주석 px mismatch (`t5` (16/400) ↔ typography.fontSize)
  const badPx = annots.filter(a => a.px !== a.expected);
  if (badPx.length === 0) {
    console.log(`  ✓ 토큰 주석 px 일관성 통과 (검사 ${annots.length}건)`);
  } else {
    console.log(`  ⚠ 토큰 주석 px mismatch ${badPx.length}건:`);
    for (const a of badPx.slice(0, 30)) {
      console.log(`    - ${target}:${a.line}  \`${a.token}\` 주석=${a.px}px ↔ 정의=${a.expected}px`);
      console.log(`         | ${a.snippet}`);
    }
    if (badPx.length > 30) console.log(`    ... (${badPx.length - 30}건 추가)`);
    totalTypoPx += badPx.length;
  }
}

console.log("");
const totalIssues = totalUndefined + totalMismatch + totalTypoPx;
if (strict && totalIssues > 0) {
  console.error(`strict 모드 — 총 ${totalIssues}건 발견 (dangling ${totalUndefined} + hex mismatch ${totalMismatch} + 토큰 px ${totalTypoPx}). exit 1`);
  exit(1);
}
if (totalIssues === 0) {
  console.log("완료. 이슈 없음.");
} else {
  console.log(`완료. dangling ${totalUndefined} + hex mismatch ${totalMismatch} + 토큰 px ${totalTypoPx}건 점검 권장 (false positive 가능 — heuristic).`);
}
