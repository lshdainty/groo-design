#!/usr/bin/env node
// Tailwind v4 export diff 가시화 (P2-H)
//
// 기본 `npm run diff`(design.md frontmatter YAML diff) 외에 사용자 시점의
// **결과 CSS diff**를 제공. 이전 백업과 현재 DESIGN.md를 각각 v4 @theme CSS로
// 빌드한 뒤 unified diff 출력.
//
// 사용법:
//   node scripts/diff-tailwind.mjs                              # 가장 최근 milestone 백업과 비교
//   node scripts/diff-tailwind.mjs --prev DESIGN.history/v32-add-motion.md
//   node scripts/diff-tailwind.mjs --source DESIGN.hr.md        # HR/Desk 파일 비교 (자동 백업 안 됨이라 prev 명시 필요)

import { execSync, spawnSync } from "node:child_process";
import { readdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, basename } from "node:path";
import { tmpdir } from "node:os";
import { argv, exit, stdout } from "node:process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(arr) {
  const out = {};
  for (let i = 0; i < arr.length; i++) {
    const a = arr[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = arr[i + 1];
    if (next && !next.startsWith("--")) { out[key] = next; i++; }
    else { out[key] = true; }
  }
  return out;
}

function findLatestMilestoneBackup() {
  const dir = resolve(ROOT, "DESIGN.history");
  const files = readdirSync(dir);
  // v숫자로 시작하는 milestone 백업 (자동 timestamp v20YYYYMMDD-* 제외)
  const milestone = files
    .filter(f => /^v\d+-.*\.md$/.test(f) && !/^v20\d{6}-/.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/^v(\d+)/)[1], 10);
      const nb = parseInt(b.match(/^v(\d+)/)[1], 10);
      return nb - na;
    });
  if (milestone.length === 0) {
    throw new Error("milestone 백업(DESIGN.history/v{N}-{이유}.md) 없음 — npm run snapshot은 timestamp 백업만, milestone은 작업 전 cp로 생성됨");
  }
  return resolve(dir, milestone[0]);
}

function buildCss(sourcePath) {
  const result = spawnSync("node", ["scripts/build-tailwind-v4.mjs", "--source", sourcePath], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`build-tailwind-v4.mjs failed for ${sourcePath}: ${result.stderr}`);
  }
  // 첫 줄(/* Generated from <path> ... */)은 source 경로가 들어가 diff noise — 제거
  return result.stdout.split("\n").slice(1).join("\n");
}

const args = parseArgs(argv.slice(2));
const source = args.source || resolve(ROOT, "DESIGN.md");
const prev = args.prev || findLatestMilestoneBackup();

console.log(`source: ${basename(source)}`);
console.log(`prev:   ${basename(prev)}`);
console.log("");

const tmp = mkdtempSync(resolve(tmpdir(), "groo-diff-"));
const prevCssPath = resolve(tmp, "prev.css");
const currCssPath = resolve(tmp, "curr.css");

try {
  writeFileSync(prevCssPath, buildCss(prev), "utf8");
  writeFileSync(currCssPath, buildCss(source), "utf8");
} catch (e) {
  console.error(`build 실패: ${e.message}`);
  exit(2);
}

// system diff -u
const diffResult = spawnSync("diff", ["-u", prevCssPath, currCssPath], {
  encoding: "utf8",
});

if (diffResult.status === 0) {
  console.log("✓ Tailwind v4 export 결과 차이 없음 (prose-only 변경 또는 토큰 미변경)");
  exit(0);
}

if (diffResult.status === 1) {
  // diff 발견 — 출력 정리
  const diffOut = diffResult.stdout
    .replace(prevCssPath, `prev (${basename(prev)})`)
    .replace(currCssPath, `curr (${basename(source)})`);
  stdout.write(diffOut);
  exit(0);
}

console.error(`diff 명령 실패 (exit ${diffResult.status}): ${diffResult.stderr}`);
exit(2);
