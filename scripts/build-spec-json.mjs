#!/usr/bin/env node
// 컴포넌트 스펙 값 JSON — specs/components/<이름>.yaml 의 토큰을 한 브랜드의 라이트 · 다크 값으로 푼다
// (2026-10-06 사용자 결정 3A). 제품(웹 · 앱)이 "스펙대로" 를 테스트와 카탈로그로 잴 때 쓴다.
//
// 사용법:
//   node scripts/build-spec-json.mjs --source DESIGN.desk.md --out exports/spec/desk
//
// 한 파일 = 한 YAML. 규칙(rules)은 YAML 그대로 두고 값만 푼다 — 조합 × 상태를 모두 펼치면 버튼 하나가
// 수천 칸이 된다. 한 조합 · 한 상태의 값은 쓰는 쪽이 사이트(site/lib/component-spec.ts)와 같은 방식으로 겹친다:
//   1) defaults 로 빈 축을 채운 조합에 맞는 규칙(when 이 모두 같은 것)만 고른다.
//   2) 기본 상태(states 의 첫째)를 그 규칙들에서 차례로 겹치고, 다른 상태면 그 상태를 그 위에 다시 겹친다.
//      뒤의 규칙이 앞의 같은 값을 덮는다.
//
// 값
//   - 모드에 따라 다르면 { "light": …, "dark": … }, 같으면 값 하나.
//   - px → 숫자(16). 색 → "#RRGGBB"(투명도는 "#RRGGBBAA"). 글자 → { fontSize, lineHeight, fontWeight, fontFamily }.
//   - 지속 시간 · 이징 · 그림자 · 그라디언트 · 딤 → CSS 값 문자열("150ms", "cubic-bezier(…)", "0 8px 24px …").
//   - 그 밖의 글(커서 이름 · "세로 2px 축소" …)은 그대로.
//   - 비고(note)는 값에서 떼어 notes 에 모은다.
//   - 같은 규칙 · 같은 상태 · 같은 부위에 typography 와 lineHeight · fontWeight 가 같이 있으면 따로 적은 값이 이긴다
//     (specs/CLAUDE.md — 2026-10-15 구현 세션 질문 Q-011-2 · Q-012-1 정리). 그 둘을 typography 객체에 접어
//     "14 / 20 · 500" 같은 한 덩어리로 싣는다 — 따로 적은 lineHeight · fontWeight 도 그대로 둔다(그것만 읽는 쪽이 있다).
//     배수 줄 높이(1.3 — 단위 없는 수)는 글자 크기를 곱한 px 로 접는다(12 × 1.3 = 15.6).
//   - 없는 토큰을 가리키면 파일 · 위치와 함께 멈춘다.
//     예외 하나 — 브랜드 색이 없는 그룹 파일(DESIGN.md — "그룹 색 · 로고 칠")에서 brand 역할 · 팔레트(fg-brand* · bg-brand* ·
//     stroke-brand* · brand-N)를 가리키는 칸은 값을 싣지 않고 skipped 에 모은다. 그룹 화면은 brand 변형을 쓰지 않는다
//     (2026-10-23 그루 계정 지시서 I-18 Q1-A). 브랜드 파일에서 brand 역할이 없으면 그대로 멈춘다.

import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { argv, exit } from "node:process";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve } from "node:path";
import { parse as parseYaml } from "yaml";

import {
  parseArgs,
  parseColorTable,
  resolveColorHex,
  parseTypography,
  parseSimpleScale,
  parseShadows,
  parseMotion,
  parseOverlay,
  parseGradients,
  parseLayout,
} from "./lib/design-md.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = parseArgs(argv.slice(2));
if (!args.source || !args.out) {
  console.error("usage: build-spec-json.mjs --source <DESIGN*.md> --out <dir>");
  exit(2);
}

const sourcePath = resolve(ROOT, args.source);
const content = readFileSync(sourcePath, "utf8");
const lines = content.split("\n");
const design = {
  file: relative(ROOT, sourcePath),
  sha256: createHash("sha256").update(content).digest("hex").slice(0, 12),
};

const colorTable = parseColorTable(lines);
const typography = parseTypography(lines);
const rounded = parseSimpleScale(lines, "rounded");
const spacing = parseSimpleScale(lines, "spacing");
const shadows = parseShadows(content);
const motion = parseMotion(content);
const overlays = parseOverlay(content);
const gradients = parseGradients(content);
const layouts = parseLayout(content);

// 그룹 파일 — brand 칸은 건너뛴다(머리 주석)
const groupSource = !colorTable.has("bg-brand-solid");
const BRAND_COLOR = /^(fg-brand|bg-brand|stroke-brand|brand-\d)/;
class BrandSkip extends Error {
  constructor(name) {
    super(`brand ${name}`);
    this.token = name;
  }
}

// 다크 값 — 짝(-dark)이 있으면 그 값, 짝이 없는 옛 이름은 가리키는 이름의 다크 값(CSS 다크 블록과 같은 규칙).
function colorFor(name, mode, where) {
  if (!colorTable.has(name) && groupSource && BRAND_COLOR.test(name)) throw new BrandSkip(name);
  if (!colorTable.has(name)) throw new Error(`${where}: 색 토큰 ${name} 이 없다`);
  if (mode === "light") return resolveColorHex(colorTable, name);
  if (colorTable.has(`${name}-dark`)) return resolveColorHex(colorTable, `${name}-dark`);
  const entry = colorTable.get(name);
  return entry.ref ? colorFor(entry.ref, mode, where) : entry.hex;
}

const hexUpper = (h) => h.toUpperCase();
const alphaHex = (pct) => Math.round((pct / 100) * 255).toString(16).padStart(2, "0").toUpperCase();
const pxNumber = (v) => {
  const m = /^(-?\d+(?:\.\d+)?)px$/.exec(String(v).trim());
  return m ? Number(m[1]) : undefined;
};

function token(raw, mode, where) {
  const v = raw.trim();
  const color = /^\$color-([a-z0-9-]+)(?:\s*\/\s*(\d+)%)?$/.exec(v);
  if (color) {
    const hex = hexUpper(colorFor(color[1], mode, where));
    return color[2] ? hex + alphaHex(Number(color[2])) : hex;
  }
  const m = /^\$(spacing|radius|text|font|motion|shadow|overlay|gradient|layout)-(.+)$/.exec(v);
  if (!m) throw new Error(`${where}: 풀 수 없는 토큰 ${v}`);
  const [, group, key] = m;
  const paired = (table, name) => (mode === "dark" && table[`${name}-dark`] !== undefined ? table[`${name}-dark`] : table[name]);
  switch (group) {
    case "spacing":
      if (spacing[key] === undefined) break;
      return pxNumber(spacing[key]) ?? spacing[key];
    case "radius":
      if (key === "full") return 9999;
      if (rounded[key] === undefined) break;
      return pxNumber(rounded[key]) ?? rounded[key];
    case "text": {
      // `$text-t1-static` — 같은 글자 토큰의 고정 px 판(Tailwind 내보내기가 만든다, DESIGN.md Typography v104). 값은 같고
      // 웹은 rem 대신 px 클래스(text-t1-static), 앱은 TextScaler.noScaling 으로 쓴다
      const t = typography[key.replace(/-static$/, "")];
      if (!t) break;
      const out = { fontSize: pxNumber(t.fontSize), lineHeight: pxNumber(t.lineHeight), fontWeight: Number(t.fontWeight), fontFamily: t.fontFamily };
      if (t.letterSpacing) out.letterSpacing = pxNumber(t.letterSpacing) ?? t.letterSpacing;
      return out;
    }
    case "font":
      if (key === "sans") return typography.t4?.fontFamily ?? "Pretendard, Inter, sans-serif";
      break;
    case "motion":
      if (motion[`motion-${key}`] === undefined) break;
      return motion[`motion-${key}`];
    case "shadow":
      if (shadows[`shadow-${key}`] === undefined) break;
      return paired(shadows, `shadow-${key}`);
    case "overlay":
      if (overlays[`overlay-${key}`] === undefined) break;
      return overlays[`overlay-${key}`];
    case "gradient":
      if (gradients[`gradient-${key}`] === undefined) break;
      return paired(gradients, `gradient-${key}`);
    case "layout":
      // v101 레이아웃 prose 토큰(사이드바 폭 · 본문 여백 …) — Side Navigation · Top Navigation 이 쓴다
      if (layouts[`layout-${key}`] === undefined) break;
      return pxNumber(layouts[`layout-${key}`]) ?? layouts[`layout-${key}`];
  }
  throw new Error(`${where}: 토큰 ${v} 이 ${design.file} 에 없다`);
}

const isBox = (v) => v !== null && typeof v === "object" && !Array.isArray(v) && "value" in v;

// YAML 값 하나를 한 모드의 값으로
function plain(raw, mode, where) {
  if (isBox(raw)) return plain(mode === "dark" && raw.dark !== undefined ? raw.dark : raw.value, mode, where);
  if (Array.isArray(raw)) return raw.map((x, i) => plain(x, mode, `${where}[${i}]`));
  if (typeof raw === "string") {
    if (raw.trim().startsWith("$")) return token(raw, mode, where);
    return pxNumber(raw) ?? raw;
  }
  return raw;
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function value(raw, where) {
  const light = plain(raw, "light", where);
  const dark = plain(raw, "dark", where);
  return same(light, dark) ? light : { light, dark };
}

// typography 에 같은 부위의 lineHeight · fontWeight 를 접는다 — 위 머리 주석
const isType = (v) => v !== null && typeof v === "object" && typeof v.fontSize === "number";
function foldType(slotOut, rawProps) {
  const t = slotOut.typography;
  if (!isType(t)) return;
  const folded = { ...t };
  const lh = slotOut.lineHeight;
  // YAML 에 단위 없는 수로 적었으면 배수, "20px" 처럼 적었으면 px
  const rawLh = isBox(rawProps.lineHeight) ? rawProps.lineHeight.value : rawProps.lineHeight;
  if (typeof lh === "number") folded.lineHeight = typeof rawLh === "number" ? Math.round(t.fontSize * lh * 100) / 100 : lh;
  const fw = slotOut.fontWeight;
  if (typeof fw === "number") folded.fontWeight = fw;
  slotOut.typography = folded;
}

const names = (def) => (Array.isArray(def) ? def.map(String) : Object.keys(def ?? {}));

function convert(file) {
  const rel = `specs/components/${file}`;
  const spec = parseYaml(readFileSync(join(ROOT, rel), "utf8"));
  // 부품 · 축이 없는 데이터 표(institution-colors)는 값이 이미 풀려 있다 — 그대로 싣는다.
  if (!spec.rules) return { name: spec.name, source: rel, design, data: spec };
  const states = names(spec.states);
  const axes = Object.fromEntries(Object.entries(spec.variants ?? {}).map(([axis, def]) => [axis, names(def)]));
  const notes = [];
  const skipped = [];
  const rules = spec.rules.map((rule, ri) => {
    const out = { when: rule.when ?? {} };
    for (const [state, block] of Object.entries(rule)) {
      if (state === "when" || !block) continue;
      if (!states.includes(state)) throw new Error(`${rel} rules[${ri}]: 없는 상태 ${state}`);
      out[state] = {};
      let stateSkipped = false;
      for (const [slot, props] of Object.entries(block)) {
        if (!props) continue;
        out[state][slot] = {};
        let slotSkipped = false;
        for (const [prop, raw] of Object.entries(props)) {
          const where = `${rel} rules[${ri}].${state}.${slot}.${prop}`;
          try {
            out[state][slot][prop] = value(raw, where);
          } catch (e) {
            if (!(e instanceof BrandSkip)) throw e;
            skipped.push({ rule: ri, state, slot, prop, token: e.token });
            slotSkipped = stateSkipped = true;
            continue;
          }
          if (isBox(raw) && raw.note) notes.push({ rule: ri, state, slot, prop, note: raw.note });
        }
        foldType(out[state][slot], props);
        // brand 칸만 있던 부위 · 상태는 통째로 뺀다(빈 부위가 "값 없음" 으로 읽히지 않게)
        if (slotSkipped && Object.keys(out[state][slot]).length === 0) delete out[state][slot];
      }
      if (stateSkipped && Object.keys(out[state]).length === 0) delete out[state];
    }
    return out;
  });
  if (skipped.length) skippedTotal += skipped.length;
  const motionOut = spec.motion
    ? Object.fromEntries(
        Object.entries(spec.motion).map(([label, m]) => [
          label,
          Object.fromEntries(Object.entries(m).map(([k, raw]) => [k, value(raw, `${rel} motion.${label}.${k}`)])),
        ]),
      )
    : undefined;
  return {
    name: spec.name,
    source: rel,
    design,
    slots: spec.slots ?? {},
    axes,
    defaults: spec.defaults ?? {},
    states,
    rules,
    ...(motionOut ? { motion: motionOut } : {}),
    notes,
    ...(skipped.length ? { skipped } : {}),
  };
}
let skippedTotal = 0;

const outDir = resolve(ROOT, args.out);
mkdirSync(outDir, { recursive: true });
const files = readdirSync(join(ROOT, "specs/components")).filter((f) => f.endsWith(".yaml")).sort();
const index = [];
for (const f of files) {
  const json = convert(f);
  const base = f.replace(/\.yaml$/, "");
  writeFileSync(join(outDir, `${base}.json`), JSON.stringify(json, null, 2) + "\n");
  index.push({ file: `${base}.json`, name: json.name, source: json.source });
}
writeFileSync(join(outDir, "index.json"), JSON.stringify({ design, components: index }, null, 2) + "\n");
console.error(`spec json: ${files.length} 개 → ${relative(ROOT, outDir)} (${design.file} · ${design.sha256})`);
if (skippedTotal) console.error(`  그룹 파일 — brand 칸 ${skippedTotal} 개를 건너뛰었다(각 JSON 의 skipped)`);
