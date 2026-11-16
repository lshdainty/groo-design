#!/usr/bin/env node
// 공식 문서 규칙 검사 — 사이트에 실리는 글에 작업 기록이 들어오지 않게 막습니다(CLAUDE.md "공식 문서 작성 규칙").
// 날짜(2026-10-03 꼴) · 아티팩트 링크 · "사용자 결정" · Migration notes 절 · 백업 경로(.history/)를 찾습니다.
// 코드(``` 블록 · `인라인`) 안은 보지 않습니다.
//
// 아직 다시 쓰지 않은 파일은 scripts/check-docs-pending.txt 에 적어 두고 건너뜁니다. 다시 쓴 파일은 목록에서 지웁니다 —
// 목록에 있는데 이미 깨끗한 파일도 알려 줍니다(목록이 줄어들기만 하도록).
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PENDING_FILE = join(ROOT, "scripts/check-docs-pending.txt");

const RULES = [
  { name: "날짜", re: /\b20\d{2}-\d{2}-\d{2}\b/ },
  { name: "아티팩트 링크", re: /claude\.ai\/(?:code\/)?artifact/ },
  { name: "결정 문구", re: /사용자 결정|사용자가 [^.\n]{0,12}정했/ },
  { name: "이관 절", re: /^#{2,4}\s*Migration notes/i },
  { name: "백업 경로", re: /\.history\// },
];
// 사이트 그림 코드(.tsx)는 데이터에 날짜가 들어가므로 날짜는 보지 않습니다
const TSX_RULES = RULES.filter((r) => r.name !== "날짜");

function walk(dir, ext) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, ext));
    else if (ext.some((x) => e.name.endsWith(x))) out.push(p);
  }
  return out;
}

const files = [
  ...["DESIGN.md", "DESIGN.hr.md", "DESIGN.desk.md", "README.md", "specs/z-index.md"].map((f) => join(ROOT, f)),
  ...walk(join(ROOT, "specs/components"), [".md", ".yaml"]),
  ...walk(join(ROOT, "site/content/docs"), [".mdx"]),
  ...walk(join(ROOT, "site/components/specs"), [".tsx", ".ts"]),
  ...walk(join(ROOT, "site/components/foundations"), [".tsx", ".ts"]),
].filter(existsSync)
  // 빌드가 원본에서 만든 페이지(git 밖)는 원본을 검사하므로 건너뜁니다
  .filter((f) => !/gen-content 가 만든 페이지|에서 생성 — 이 파일을 고치지 말고/.test(readFileSync(f, "utf8").slice(0, 600)));

const pending = new Set(
  existsSync(PENDING_FILE)
    ? readFileSync(PENDING_FILE, "utf8").split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"))
    : [],
);

function findings(file) {
  const rules = file.endsWith(".tsx") || file.endsWith(".ts") ? TSX_RULES : RULES;
  const out = [];
  let fence = false;
  readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    if (fence) return;
    const text = line.replace(/`[^`]*`/g, "");
    for (const r of rules) if (r.re.test(text)) out.push(`${i + 1}: ${r.name} — ${line.trim().slice(0, 90)}`);
  });
  return out;
}

let errors = 0;
let stale = [];
for (const file of files) {
  const rel = relative(ROOT, file);
  const f = findings(file);
  if (pending.has(rel)) {
    if (f.length === 0) stale.push(rel);
    continue;
  }
  if (f.length) {
    errors += f.length;
    console.log(`\n${rel}`);
    for (const l of f.slice(0, 20)) console.log(`  ${l}`);
    if (f.length > 20) console.log(`  … 외 ${f.length - 20}건`);
  }
}
for (const rel of pending) if (!files.some((f) => relative(ROOT, f) === rel)) stale.push(rel);

if (stale.length) {
  console.log(`\n이미 깨끗하거나 없는 파일 — scripts/check-docs-pending.txt 에서 지웁니다:`);
  for (const rel of stale) console.log(`  ${rel}`);
}
console.log(`\n공식 문서 검사: 파일 ${files.length - pending.size} 개 검사 · 다시 쓸 파일 ${pending.size} 개 남음 · 문제 ${errors} 건`);
process.exit(errors || stale.length ? 1 : 0);
