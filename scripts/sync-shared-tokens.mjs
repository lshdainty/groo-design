#!/usr/bin/env node
// 공유 토큰 sync 자동화 (P1-A + P1-E)
//
// DESIGN.md를 source of truth로 삼아 DESIGN.hr.md / DESIGN.desk.md를 갱신.
//
// sync 범위:
//   1. typography / rounded / spacing 블록 (100% 공유, 통째 교체)
//   2. colors SHARED 영역 (P1-E v50 마커 도입 후 자동 sync) —
//      `# @sync:shared-start (colors-N)` ... `# @sync:shared-end (colors-N)`
//      brand 영역(`# @sync:brand-start (colors-N)` ... `brand-end`)은 보존.
//      현재 영역: colors-1 (Neutral), colors-2 (Semantic + Chart), colors-3 (v102 SEED 역할 색).
//
// drift detection (sync 후 잔여 검출):
//   colors의 마커 외부 영역 또는 mismatch — 일반적으로 0건이어야 함
//
// 사용법:
//   node scripts/sync-shared-tokens.mjs           # sync 수행 + drift 보고
//   node scripts/sync-shared-tokens.mjs --check   # dry-run, drift/sync 필요시 exit 1

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = resolve(ROOT, "DESIGN.md");
const TARGETS = [resolve(ROOT, "DESIGN.hr.md"), resolve(ROOT, "DESIGN.desk.md")];

const FULL_SYNC_BLOCKS = ["typography", "rounded", "spacing"];

// 자동 검출되는 마커 영역. 향후 components 추가 시 이 list 확장.
// colors-0 = v108 팔레트(SEED 식 모드별)
const MARKER_REGIONS = ["colors-0", "colors-1", "colors-2", "colors-3"];

const SHARED_COLORS = new Set([
  "chart-red", "chart-orange", "chart-yellow", "chart-green", "chart-blue",
  "chart-indigo", "chart-violet", "chart-pink", "chart-brown", "chart-gray",
  // 차트 다크 짝
  "chart-red-dark", "chart-orange-dark", "chart-yellow-dark", "chart-green-dark", "chart-blue-dark",
  "chart-indigo-dark", "chart-violet-dark", "chart-pink-dark", "chart-brown-dark", "chart-gray-dark",
  // v111 — 카테고리 옅은 바탕 · 그 위 글자
  "chart-red-weak", "chart-red-weak-dark", "chart-red-subtle", "chart-red-subtle-dark", "chart-red-contrast", "chart-red-contrast-dark",
  "chart-orange-weak", "chart-orange-weak-dark", "chart-orange-subtle", "chart-orange-subtle-dark", "chart-orange-contrast", "chart-orange-contrast-dark",
  "chart-yellow-weak", "chart-yellow-weak-dark", "chart-yellow-subtle", "chart-yellow-subtle-dark", "chart-yellow-contrast", "chart-yellow-contrast-dark",
  "chart-green-weak", "chart-green-weak-dark", "chart-green-subtle", "chart-green-subtle-dark", "chart-green-contrast", "chart-green-contrast-dark",
  "chart-blue-weak", "chart-blue-weak-dark", "chart-blue-subtle", "chart-blue-subtle-dark", "chart-blue-contrast", "chart-blue-contrast-dark",
  "chart-indigo-weak", "chart-indigo-weak-dark", "chart-indigo-subtle", "chart-indigo-subtle-dark", "chart-indigo-contrast", "chart-indigo-contrast-dark",
  "chart-violet-weak", "chart-violet-weak-dark", "chart-violet-subtle", "chart-violet-subtle-dark", "chart-violet-contrast", "chart-violet-contrast-dark",
  "chart-pink-weak", "chart-pink-weak-dark", "chart-pink-subtle", "chart-pink-subtle-dark", "chart-pink-contrast", "chart-pink-contrast-dark",
  "chart-brown-weak", "chart-brown-weak-dark", "chart-brown-subtle", "chart-brown-subtle-dark", "chart-brown-contrast", "chart-brown-contrast-dark",
  "chart-gray-weak", "chart-gray-weak-dark", "chart-gray-subtle", "chart-gray-subtle-dark", "chart-gray-contrast", "chart-gray-contrast-dark",
  // v102 — SEED 역할 색 (colors-3)
  "fg-neutral", "fg-neutral-dark", "fg-neutral-muted", "fg-neutral-muted-dark", "fg-neutral-subtle",
  "fg-neutral-subtle-dark", "fg-neutral-inverted", "fg-neutral-inverted-dark", "fg-placeholder",
  "fg-placeholder-dark", "fg-disabled", "fg-disabled-dark", "static-white", "fg-critical",
  "fg-critical-dark", "fg-positive", "fg-positive-dark", "fg-warning", "fg-warning-dark", "fg-informative",
  "fg-informative-dark", "fg-critical-contrast", "fg-critical-contrast-dark", "fg-positive-contrast",
  "fg-positive-contrast-dark", "fg-warning-contrast", "fg-warning-contrast-dark", "fg-informative-contrast",
  "fg-informative-contrast-dark", "bg-layer-basement", "bg-layer-basement-dark", "bg-layer-default",
  "bg-layer-default-dark", "bg-layer-default-pressed", "bg-layer-default-pressed-dark", "bg-layer-floating",
  "bg-layer-floating-dark", "bg-layer-floating-pressed", "bg-layer-floating-pressed-dark", "bg-neutral-weak",
  "bg-neutral-weak-dark", "bg-neutral-weak-pressed", "bg-neutral-weak-pressed-dark", "bg-neutral-inverted", "bg-neutral-inverted-pressed", "bg-neutral-inverted-pressed-dark",
  "bg-neutral-inverted-dark", "bg-disabled", "bg-disabled-dark", "bg-critical-solid",
  "bg-critical-solid-dark", "bg-critical-solid-pressed", "bg-critical-solid-pressed-dark",
  "bg-critical-weak", "bg-critical-weak-dark", "bg-critical-weak-pressed", "bg-critical-weak-pressed-dark",
  "bg-positive-solid", "bg-positive-solid-dark", "bg-positive-solid-pressed",
  "bg-positive-solid-pressed-dark", "bg-positive-weak", "bg-positive-weak-dark", "bg-positive-weak-pressed",
  "bg-positive-weak-pressed-dark", "bg-warning-solid", "bg-warning-solid-dark", "bg-warning-solid-pressed",
  "bg-warning-solid-pressed-dark", "bg-warning-weak", "bg-warning-weak-dark", "bg-warning-weak-pressed",
  "bg-warning-weak-pressed-dark", "bg-informative-solid", "bg-informative-solid-dark",
  "bg-informative-solid-pressed", "bg-informative-solid-pressed-dark", "bg-informative-weak",
  "bg-informative-weak-dark", "bg-informative-weak-pressed", "bg-informative-weak-pressed-dark",
  "stroke-neutral-subtle", "stroke-neutral-subtle-dark", "stroke-neutral-weak", "stroke-neutral-weak-dark",
  "stroke-neutral-solid", "stroke-neutral-solid-dark", "stroke-critical-solid", "stroke-critical-solid-dark",
  "stroke-positive-solid", "stroke-positive-solid-dark", "stroke-warning-solid", "stroke-warning-solid-dark",
  "stroke-informative-solid", "stroke-informative-solid-dark",
]);

// v108 — 공유 팔레트(colors-0). 회색은 00 · 100 ~ 1000, 의미 색 가족은 100 ~ 1000, 단계마다 -dark
// v110 — 차트용 가족 다섯(yellow · indigo · violet · pink · brown)
for (const fam of ["gray", "red", "green", "orange", "blue", "yellow", "indigo", "violet", "pink", "brown"]) {
  const steps = fam === "gray" ? ["00", 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000] : [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  for (const s of steps) { SHARED_COLORS.add(`${fam}-${s}`); SHARED_COLORS.add(`${fam}-${s}-dark`); }
}

function findBlockLines(lines, key) {
  const startRe = new RegExp(`^${key}:\\s*$`);
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (startRe.test(lines[i])) { start = i; break; }
  }
  if (start === -1) throw new Error(`Block "${key}:" not found`);
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^---\s*$/.test(line)) { end = i; break; }
    if (/^[a-zA-Z][a-zA-Z0-9_-]*:\s*$/.test(line)) { end = i; break; }
  }
  return { start, end };
}

function findMarkerRegion(lines, type, name) {
  // type: "shared" or "brand"
  // name: e.g. "colors-1"
  const startRe = new RegExp(`^\\s*#\\s*@sync:${type}-start\\s*\\(${name.replace(/-/g, "\\-")}\\)\\s*$`);
  const endRe = new RegExp(`^\\s*#\\s*@sync:${type}-end\\s*\\(${name.replace(/-/g, "\\-")}\\)\\s*$`);
  let start = -1, end = -1;
  for (let i = 0; i < lines.length; i++) {
    if (start === -1 && startRe.test(lines[i])) { start = i; continue; }
    if (start !== -1 && endRe.test(lines[i])) { end = i; break; }
  }
  if (start === -1 || end === -1) return null;
  return { start, end }; // start = marker line index (포함), end = end marker line index (포함)
}

function extractColors(content) {
  const out = {};
  const lines = content.split("\n");
  const { start, end } = findBlockLines(lines, "colors");
  for (let i = start + 1; i < end; i++) {
    // 값은 hex 또는 참조("{colors.gray-00}") — 문자열 그대로 견준다(세 파일이 같은 참조를 써야 한다)
    const m = /^\s+([a-z0-9-]+):\s*"([^"]+)"/.exec(lines[i]);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

function syncBlock(sourceContent, targetContent, blockKey) {
  const sourceLines = sourceContent.split("\n");
  const sourceBlock = findBlockLines(sourceLines, blockKey);
  const sourceSlice = sourceLines.slice(sourceBlock.start, sourceBlock.end);

  const targetLines = targetContent.split("\n");
  const targetBlock = findBlockLines(targetLines, blockKey);

  return [
    ...targetLines.slice(0, targetBlock.start),
    ...sourceSlice,
    ...targetLines.slice(targetBlock.end),
  ].join("\n");
}

function syncMarkerRegion(sourceContent, targetContent, regionName) {
  const sourceLines = sourceContent.split("\n");
  const targetLines = targetContent.split("\n");

  const srcRegion = findMarkerRegion(sourceLines, "shared", regionName);
  if (!srcRegion) {
    throw new Error(`source에 @sync:shared-* (${regionName}) 마커 없음 — 마커 도입 필요`);
  }
  const tgtRegion = findMarkerRegion(targetLines, "shared", regionName);
  if (!tgtRegion) {
    throw new Error(`target에 @sync:shared-* (${regionName}) 마커 없음 — 마커 도입 필요`);
  }

  // start/end 마커 라인 자체는 양쪽 모두 동일하므로 사이 콘텐츠만 교체
  const srcInner = sourceLines.slice(srcRegion.start + 1, srcRegion.end);
  return [
    ...targetLines.slice(0, tgtRegion.start + 1),
    ...srcInner,
    ...targetLines.slice(tgtRegion.end),
  ].join("\n");
}

function detectColorDrift(sourceColors, targetColors) {
  const drifts = [];
  for (const key of SHARED_COLORS) {
    const inSource = key in sourceColors;
    const inTarget = key in targetColors;
    if (!inSource && !inTarget) continue;
    if (!inSource) {
      drifts.push({ type: "missing-in-source", token: key, target: targetColors[key] });
    } else if (!inTarget) {
      drifts.push({ type: "missing-in-target", token: key, source: sourceColors[key] });
    } else if (sourceColors[key] !== targetColors[key]) {
      drifts.push({ type: "value-mismatch", token: key, source: sourceColors[key], target: targetColors[key] });
    }
  }
  return drifts;
}

function relpath(p) {
  return p.startsWith(ROOT + "/") ? p.slice(ROOT.length + 1) : p;
}

const checkMode = process.argv.includes("--check");
const sourceContent = readFileSync(SOURCE, "utf8");
const sourceColors = extractColors(sourceContent);

let blockChanges = 0;
let regionChanges = 0;
let driftCount = 0;

console.log(`source: ${relpath(SOURCE)}`);
console.log(`mode:   ${checkMode ? "check (dry-run)" : "sync"}`);
console.log("");

for (const target of TARGETS) {
  const original = readFileSync(target, "utf8");
  let updated = original;

  // 1. typography / rounded / spacing 통째 sync
  for (const block of FULL_SYNC_BLOCKS) {
    updated = syncBlock(sourceContent, updated, block);
  }

  // 2. colors 마커 영역 sync (P1-E)
  for (const region of MARKER_REGIONS) {
    updated = syncMarkerRegion(sourceContent, updated, region);
  }

  // 3. drift detection (마커 영역 내 sync 이후에도 남은 mismatch — 일반적으로 0)
  const targetColors = extractColors(updated);
  const drifts = detectColorDrift(sourceColors, targetColors);

  console.log(`[${relpath(target)}]`);

  if (updated !== original) {
    // 어떤 종류 변경인지 분리 보고하기 위해 다시 한 번 비교
    const fullSyncOnly = (() => {
      let onlyFull = original;
      for (const block of FULL_SYNC_BLOCKS) onlyFull = syncBlock(sourceContent, onlyFull, block);
      return onlyFull;
    })();
    const blockDiff = fullSyncOnly !== original;
    const regionDiff = updated !== fullSyncOnly;

    if (blockDiff) blockChanges++;
    if (regionDiff) regionChanges++;

    if (checkMode) {
      if (blockDiff) console.log(`  block sync 필요 (${FULL_SYNC_BLOCKS.join(" / ")} 일부 불일치)`);
      if (regionDiff) console.log(`  region sync 필요 (${MARKER_REGIONS.join(" / ")} 영역 일부 불일치)`);
    } else {
      writeFileSync(target, updated, "utf8");
      if (blockDiff) console.log(`  block sync 적용 (${FULL_SYNC_BLOCKS.join(" / ")})`);
      if (regionDiff) console.log(`  region sync 적용 (${MARKER_REGIONS.join(" / ")})`);
    }
  } else {
    console.log(`  block ${FULL_SYNC_BLOCKS.join(" / ")} + region ${MARKER_REGIONS.join(" / ")} 동기 상태 ✓`);
  }

  if (drifts.length === 0) {
    console.log(`  공유 colors ${SHARED_COLORS.size}개 일치 ✓`);
  } else {
    driftCount += drifts.length;
    console.log(`  공유 colors drift ${drifts.length}건 (마커 외부 영역 또는 sync 후 잔여):`);
    for (const d of drifts) {
      if (d.type === "value-mismatch") {
        console.log(`    - ${d.token}: source=${d.source}  target=${d.target}`);
      } else if (d.type === "missing-in-target") {
        console.log(`    - ${d.token}: target에 없음 (source=${d.source})`);
      } else {
        console.log(`    - ${d.token}: source에 없음 (target=${d.target})`);
      }
    }
  }
  console.log("");
}

if (checkMode) {
  if (blockChanges > 0 || regionChanges > 0 || driftCount > 0) {
    console.error(`검사 실패: block ${blockChanges}건, region ${regionChanges}건, drift ${driftCount}건. \`npm run sync\`로 자동 동기.`);
    process.exit(1);
  }
  console.log("검사 통과 — 공유 토큰 동기 상태.");
} else {
  const totalChanges = blockChanges + regionChanges;
  if (totalChanges > 0) {
    console.log(`완료: ${totalChanges}개 동기 적용. \`npm run lint:all\`로 검증하세요.`);
  } else {
    console.log("완료: 변경 사항 없음.");
  }
  if (driftCount > 0) {
    console.log(`주의: 마커 외부 colors drift ${driftCount}건 — 수동 정리 필요 (마커 영역 확장 후보).`);
  }
}
