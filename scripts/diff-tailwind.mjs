#!/usr/bin/env node
// Tailwind v4 내보내기 비교 — 기준 커밋(기본 origin/main)의 원본과 지금 원본을 각각 @theme CSS 로
// 빌드한 뒤 unified diff 로 보여 줍니다.
//
// 사용법:
//   node scripts/diff-tailwind.mjs                          # origin/main 의 DESIGN.md 와 비교
//   node scripts/diff-tailwind.mjs --source DESIGN.hr.md    # 브랜드 파일 비교
//   node scripts/diff-tailwind.mjs --base <커밋>             # 다른 기준 커밋

import { execSync, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
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

// 기준 커밋의 원본을 임시 파일로 꺼낸다
function sourceAt(base, source) {
  const text = execSync(`git show ${base}:${source}`, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const file = resolve(mkdtempSync(resolve(tmpdir(), "groo-base-")), basename(source));
  writeFileSync(file, text, "utf8");
  return file;
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
const prev = args.prev || sourceAt(args.base || "origin/main", args.source || "DESIGN.md");

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
