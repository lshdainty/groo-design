#!/usr/bin/env node
// Flutter(Dart) 토큰 빌드 — 앱이 DESIGN*.md 를 손으로 옮기지 않게 한다(2026-10-06 사용자 결정 3A).
//
// 사용법:
//   node scripts/build-dart-tokens.mjs --source DESIGN.desk.md > exports/tokens.desk.dart
//
// 새 이름(SEED 구조)만 담는다. 옛 이름은 새 이름의 별칭이라 뺐다 — 색의 옛 이름(primary · text-secondary ·
// success · chart-red-light …, 팔레트가 아닌 이름을 가리키는 색), 간격 · 모서리의 xs ~ 3xl, 글자의 v82 15단계,
// 그림자 sm ~ xl, 모션 fast · base · slow · slower · ease-out. 앱의 옛 클래스(PSpace · PRadius · PTypo …)와
// 이름이 겹치지 않게 클래스 이름을 새로 둔다 — 앱 PSpace.x4 는 4px, SEED x4 는 16px 이다.
//
// 출력
//   PSpacing    간격 x0_5 ~ x16 + 역할 간격(globalGutter …)       double(px)
//   PRounded    모서리 r0_5 ~ r6 + full                           double(px)
//   PTypography 글자 t1 ~ t14 + screenTitle · articleBody · articleNote   TextStyle
//   PDuration   지속 시간 d1 ~ d6 + 역할(colorTransition …)         Duration
//   PEasing     이징(easing · enter · exit …)                       Curve
//   PTouch      누르는 영역(min 44 …)                               double(px)
//   PColors     색 — 역할 · 팔레트 · 차트 + overlayDim, 라이트 · 다크   ThemeExtension
//   PShadows    그림자 s1 ~ s4, 라이트 · 다크                       ThemeExtension
//   PGradients  그라디언트(fadeMask · shimmerNeutral), 라이트 · 다크    ThemeExtension
//
// 앱 쪽은 받은 파일을 그대로 두고(dart format 만) 손으로 고치지 않는다.

import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { argv, stdout, exit } from "node:process";

import {
  parseArgs,
  parseColorTable,
  resolveColorHex,
  colorAliases,
  parseTypography,
  parseSimpleScale,
  parseShadows,
  parseGradients,
  parseMotion,
  parseOverlay,
  parseTouchTargets,
} from "./lib/design-md.mjs";

const args = parseArgs(argv.slice(2));
const source = args.source;
if (!source) {
  console.error("usage: build-dart-tokens.mjs --source <DESIGN*.md>");
  exit(2);
}

const content = readFileSync(source, "utf8");
const lines = content.split("\n");
const sha = createHash("sha256").update(content).digest("hex").slice(0, 12);

// kebab · 밑줄 → lowerCamel. 숫자 사이 밑줄(x0_5 · r1_5)은 SEED 이름 그대로 둔다.
const camel = (name) => name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const px = (v, what) => {
  const m = /^(-?\d+(?:\.\d+)?)px$/.exec(String(v).trim());
  if (!m) throw new Error(`${what}: px 값이 아니다 — "${v}"`);
  return Number(m[1]);
};
const num = (n) => (Number.isInteger(n) ? String(n) : String(Number(n.toFixed(4))));

// #RRGGBB · #RRGGBBAA · rgba(r, g, b, a) → 0xAARRGGBB
function dartColor(css, what) {
  const v = String(css).trim();
  let m = /^#([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/.exec(v);
  if (m) return `Color(0x${(m[2] ?? "ff").toUpperCase()}${m[1].toUpperCase()})`;
  m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(v);
  if (m) {
    const a = m[4] === undefined ? 255 : Math.round(Number(m[4]) * 255);
    const hex = [a, m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, "0")).join("");
    return `Color(0x${hex.toUpperCase()})`;
  }
  throw new Error(`${what}: 색으로 읽을 수 없다 — "${v}"`);
}

// CSS box-shadow → BoxShadow 목록. inset 은 Flutter 에 없어 BlurStyle.inner 로 옮긴다(앱 shadow.dart 와 같은 방법).
function dartShadows(css, what) {
  const parts = [];
  let depth = 0;
  let cur = "";
  for (const ch of css) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) { parts.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts.map((p) => {
    const inset = /^inset\s+/.test(p);
    const body = p.replace(/^inset\s+/, "");
    const color = /(rgba?\([^)]*\)|#[0-9a-fA-F]{6,8})\s*$/.exec(body);
    if (!color) throw new Error(`${what}: 그림자 색이 없다 — "${p}"`);
    const lengths = body.slice(0, color.index).trim().split(/\s+/).map((l) => (l === "0" ? 0 : px(l, what)));
    const [x = 0, y = 0, blur = 0, spread = 0] = lengths;
    const fields = [`color: ${dartColor(color[1], what)}`, `offset: Offset(${num(x)}, ${num(y)})`];
    if (blur) fields.push(`blurRadius: ${num(blur)}`);
    if (spread) fields.push(`spreadRadius: ${num(spread)}`);
    if (inset) fields.push("blurStyle: BlurStyle.inner");
    return `BoxShadow(${fields.join(", ")})`;
  });
}

// CSS linear-gradient → LinearGradient. 방향은 축 방향(to top · right · bottom · left, 0 · 90 · 180 · 270deg)만 —
// 방향이 없으면 CSS 처럼 위 → 아래다(마스크 토큰은 방향 없이 적고 쓰는 자리에서 붙인다 — DESIGN.md v104).
const GRADIENT_DIRECTION = {
  "to top": ["Alignment.bottomCenter", "Alignment.topCenter"],
  "0deg": ["Alignment.bottomCenter", "Alignment.topCenter"],
  "to right": ["Alignment.centerLeft", "Alignment.centerRight"],
  "90deg": ["Alignment.centerLeft", "Alignment.centerRight"],
  "to bottom": ["Alignment.topCenter", "Alignment.bottomCenter"],
  "180deg": ["Alignment.topCenter", "Alignment.bottomCenter"],
  "to left": ["Alignment.centerRight", "Alignment.centerLeft"],
  "270deg": ["Alignment.centerRight", "Alignment.centerLeft"],
};
function dartGradient(css, what) {
  const m = /^linear-gradient\((.*)\)$/.exec(String(css).trim());
  if (!m) throw new Error(`${what}: linear-gradient 가 아니다 — "${css}"`);
  const parts = m[1].split(",").map((p) => p.trim());
  let [begin, end] = GRADIENT_DIRECTION["to bottom"];
  if (!parts[0].startsWith("#") && !parts[0].startsWith("rgb")) {
    const dir = GRADIENT_DIRECTION[parts.shift()];
    if (!dir) throw new Error(`${what}: 축 방향이 아니다 — "${css}"`);
    [begin, end] = dir;
  }
  const colors = [];
  const stops = [];
  for (const part of parts) {
    const stop = /^(#[0-9a-fA-F]{6,8})\s+(-?\d+(?:\.\d+)?)%$/.exec(part);
    if (!stop) throw new Error(`${what}: "색 비율%" 가 아니다 — "${part}"`);
    colors.push(dartColor(stop[1], what));
    stops.push(num(Number(stop[2]) / 100));
  }
  return `LinearGradient(begin: ${begin}, end: ${end}, colors: [${colors.join(", ")}], stops: [${stops.join(", ")}])`;
}

const FONT_WEIGHT = { 100: "w100", 200: "w200", 300: "w300", 400: "w400", 500: "w500", 600: "w600", 700: "w700", 800: "w800", 900: "w900" };

// ── 읽기 ──────────────────────────────────────────────────────────
const colorTable = parseColorTable(lines);
const aliases = colorAliases(colorTable);
const typography = parseTypography(lines);
const rounded = parseSimpleScale(lines, "rounded");
const spacing = parseSimpleScale(lines, "spacing");
const shadows = parseShadows(content);
const gradients = parseGradients(content);
const motion = parseMotion(content);
const overlays = parseOverlay(content);
const touch = parseTouchTargets(content);

// 옛 이름 — DESIGN.md 가 별칭으로 남겨 둔 것(v98 · v99 · v100 · v104). 새 이름만 내보낸다.
const OLD_SCALE = /^(xs|sm|md|lg|xl|\dxl)$/;
const NEW_TYPE = /^(t\d+|screen-title|article-body|article-note)$/;
const OLD_MOTION = new Set(["motion-duration-fast", "motion-duration-base", "motion-duration-slow", "motion-duration-slower", "motion-ease-out"]);
const NEW_SHADOW = /^shadow-s\d+$/;

let out = "";
const w = (s = "") => { out += s + "\n"; };

w(`// GENERATED — groo-design scripts/build-dart-tokens.mjs 가 ${source} 에서 만든다. 손으로 고치지 않는다.`);
w(`// 바꾸려면 groo-design 의 ${source} 를 고치고 다시 만든다.`);
w(`// source: ${source} · sha256 ${sha}`);
w("//");
w("// 새 이름(SEED 구조)만 담는다 — 옛 이름(primary · text-secondary · xs ~ 3xl · shadow-sm …)은 새 이름의 별칭이라 뺐다.");
w("// 글자는 웹(CSS)처럼 줄 높이의 남는 간격을 위아래에 똑같이 나눈다(leadingDistribution: even) — 스펙의 줄 높이가 CSS 값이다.");
w("// ignore_for_file: constant_identifier_names");
w();
w("import 'package:flutter/material.dart';");
w();
w(`/// 원본 — 제품이 이 파일이 어느 DESIGN 에서 왔는지 볼 수 있게.`);
w("abstract final class PDesignSource {");
w(`  static const String file = '${source}';`);
w(`  static const String sha256 = '${sha}';`);
w("}");
w();

// 간격
w("/// 간격(px) — SEED 눈금 x0_5 ~ x16 + 역할 간격(DESIGN.md v98 · v101). 옛 xs ~ 3xl 은 뺐다.");
w("abstract final class PSpacing {");
for (const [name, val] of Object.entries(spacing)) {
  if (OLD_SCALE.test(name)) continue;
  w(`  /// spacing-${name}`);
  w(`  static const double ${camel(name)} = ${num(px(val, `spacing-${name}`))};`);
}
w("}");
w();

// 모서리
w("/// 모서리(px) — SEED 눈금 r0_5 ~ r6 + full(DESIGN.md v99). 옛 xs ~ 2xl 은 뺐다.");
w("abstract final class PRounded {");
for (const [name, val] of Object.entries(rounded)) {
  if (OLD_SCALE.test(name)) continue;
  const v = name === "full" || /^9999/.test(val) ? 9999 : px(val, `rounded-${name}`);
  w(`  /// radius-${name}`);
  w(`  static const double ${camel(name)} = ${num(v)};`);
}
w("}");
w();

// 글자
const families = new Set(Object.values(typography).map((t) => t.fontFamily).filter(Boolean));
const firstFamily = (stack) => String(stack).split(",")[0].trim().replace(/^["']|["']$/g, "");
const family = families.size ? firstFamily([...families][0]) : "Pretendard";
w("/// 글자 — SEED t1 ~ t14 + 역할 스타일(DESIGN.md v100). 옛 15단계(v82)는 뺐다.");
w("/// 굵기를 컴포넌트가 따로 정하면(버튼 700 …) copyWith 로 덮는다. 색은 쓰는 쪽이 정한다.");
w("abstract final class PTypography {");
w(`  static const String fontFamily = '${family}';`);
for (const [name, t] of Object.entries(typography)) {
  if (!NEW_TYPE.test(name)) continue;
  const size = px(t.fontSize, `typography-${name}.fontSize`);
  const fields = ["fontFamily: fontFamily", `fontSize: ${num(size)}`];
  if (t.lineHeight) fields.push(`height: ${num(px(t.lineHeight, `typography-${name}.lineHeight`))} / ${num(size)}`);
  if (t.fontWeight) {
    const fw = FONT_WEIGHT[Number(t.fontWeight)];
    if (!fw) throw new Error(`typography-${name}: 굵기 ${t.fontWeight}`);
    fields.push(`fontWeight: FontWeight.${fw}`);
  }
  // 자간 — 비워 두면 Material 3 기본 자간이 번진다(앱 typography.dart 의 2026-09-22 기록). 없으면 0 을 적는다.
  let ls = 0;
  if (t.letterSpacing) {
    const v = String(t.letterSpacing).trim();
    ls = /em$/.test(v) ? parseFloat(v) * size : px(v, `typography-${name}.letterSpacing`);
  }
  fields.push(`letterSpacing: ${num(ls)}`);
  fields.push("leadingDistribution: TextLeadingDistribution.even");
  const lh = t.lineHeight ? `/${px(t.lineHeight, name)}` : "";
  w(`  /// ${name} — ${num(size)}${lh} · ${t.fontWeight ?? "-"}`);
  w(`  static const TextStyle ${camel(name)} = TextStyle(${fields.join(", ")});`);
}
w("}");
w();

// 모션
w("/// 지속 시간 — SEED d1 ~ d6 + 역할(DESIGN.md v104). 옛 fast · base · slow · slower 는 뺐다.");
w("abstract final class PDuration {");
for (const [name, val] of Object.entries(motion)) {
  if (!name.startsWith("motion-duration-") || OLD_MOTION.has(name)) continue;
  const m = /^(\d+(?:\.\d+)?)ms$/.exec(val.trim());
  if (!m) throw new Error(`${name}: ms 값이 아니다 — "${val}"`);
  w(`  /// ${name} — ${val}`);
  w(`  static const Duration ${camel(name.replace("motion-duration-", ""))} = Duration(milliseconds: ${Math.round(Number(m[1]))});`);
}
w("}");
w();
w("/// 이징 — SEED(DESIGN.md v104). 옛 ease-out 은 뺐다.");
w("abstract final class PEasing {");
for (const [name, val] of Object.entries(motion)) {
  if (!name.startsWith("motion-ease-") || OLD_MOTION.has(name)) continue;
  const id = camel(name.replace("motion-ease-", ""));
  const v = val.trim();
  w(`  /// ${name} — ${v}`);
  if (v === "linear") { w(`  static const Curve ${id} = Curves.linear;`); continue; }
  const m = /^cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)$/.exec(v);
  if (!m) throw new Error(`${name}: cubic-bezier 가 아니다 — "${v}"`);
  w(`  static const Curve ${id} = Cubic(${m.slice(1, 5).map((n) => num(Number(n))).join(", ")});`);
}
w("}");
w();

// 누르는 영역
w("/// 누르는 영역(px) — WCAG 2.5.5(DESIGN.md v59).");
w("abstract final class PTouch {");
for (const [name, val] of Object.entries(touch)) {
  w(`  /// ${name}`);
  w(`  static const double ${camel(name.replace("touch-", ""))} = ${num(px(val, name))};`);
}
w("}");
w();

// 색 — ThemeExtension
const colorFields = [];
for (const name of colorTable.keys()) {
  if (name.endsWith("-dark") || aliases.has(name)) continue;
  const light = resolveColorHex(colorTable, name);
  const dark = colorTable.has(`${name}-dark`) ? resolveColorHex(colorTable, `${name}-dark`) : light;
  colorFields.push({ id: camel(name), doc: name, light: dartColor(light, name), dark: dartColor(dark, name) });
}
const dimLight = overlays["overlay-dim-light"];
const dimDark = overlays["overlay-dim-dark"];
if (dimLight && dimDark) {
  colorFields.push({ id: "overlayDim", doc: "overlay-dim-light · overlay-dim-dark — 모달 · 시트 뒤 딤", light: dartColor(dimLight, "overlay-dim-light"), dark: dartColor(dimDark, "overlay-dim-dark") });
}

function extension(cls, fields, type, lerpOf, doc) {
  for (const d of doc) w(`/// ${d}`);
  w("@immutable");
  w(`class ${cls} extends ThemeExtension<${cls}> {`);
  w(`  const ${cls}({`);
  for (const f of fields) w(`    required this.${f.id},`);
  w("  });");
  w();
  for (const f of fields) {
    w(`  /// ${f.doc}`);
    w(`  final ${type} ${f.id};`);
  }
  w();
  for (const mode of ["light", "dark"]) {
    w(`  static const ${cls} ${mode} = ${cls}(`);
    for (const f of fields) w(`    ${f.id}: ${f[mode]},`);
    w("  );");
    w();
  }
  w("  @override");
  w(`  ${cls} copyWith({`);
  for (const f of fields) w(`    ${type}? ${f.id},`);
  w("  }) {");
  w(`    return ${cls}(`);
  for (const f of fields) w(`      ${f.id}: ${f.id} ?? this.${f.id},`);
  w("    );");
  w("  }");
  w();
  w("  @override");
  w(`  ${cls} lerp(ThemeExtension<${cls}>? other, double t) {`);
  w(`    if (other is! ${cls}) return this;`);
  w(`    return ${cls}(`);
  for (const f of fields) w(`      ${f.id}: ${lerpOf(f.id)},`);
  w("    );");
  w("  }");
  w("}");
  w();
}

extension(
  "PColors",
  colorFields,
  "Color",
  (id) => `Color.lerp(${id}, other.${id}, t)!`,
  [
    "색 — 역할(fg · bg · stroke) · 팔레트 · 차트 + 딤, 라이트 · 다크(DESIGN.md v102 · v108 · v110 · v111).",
    "화면 · 컴포넌트는 역할 이름만 부른다. 팔레트는 스펙이 단계를 직접 적은 자리와 차트에서만.",
    "`context.colors.fgNeutral`",
  ],
);

const shadowFields = Object.entries(shadows)
  .filter(([name]) => NEW_SHADOW.test(name))
  .map(([name, light]) => {
    const dark = shadows[`${name}-dark`] ?? light;
    const list = (css) => `[${dartShadows(css, name).join(", ")}]`;
    return { id: camel(name.replace("shadow-", "")), doc: name, light: list(light), dark: list(dark) };
  });
extension(
  "PShadows",
  shadowFields,
  "List<BoxShadow>",
  (id) => `BoxShadow.lerpList(${id}, other.${id}, t) ?? ${id}`,
  ["그림자 s1 ~ s4, 라이트 · 다크(DESIGN.md v104 고도). 다크의 inset 하이라이트는 BlurStyle.inner 로 옮겼다.", "`context.shadows.s3`"],
);

const gradientFields = Object.entries(gradients)
  .filter(([name]) => !name.endsWith("-dark"))
  .map(([name, light]) => {
    const dark = gradients[`${name}-dark`] ?? light;
    return { id: camel(name.replace("gradient-", "")), doc: name, light: dartGradient(light, name), dark: dartGradient(dark, name) };
  });
extension(
  "PGradients",
  gradientFields,
  "LinearGradient",
  (id) => `LinearGradient.lerp(${id}, other.${id}, t)!`,
  [
    "그라디언트 — 가림 마스크 · 스켈레톤 반짝임, 라이트 · 다크(DESIGN.md v104).",
    "마스크(fadeMask)는 위 → 아래로 적었다 — 쓰는 자리에서 begin · end 만 바꿔 방향을 붙인다(색 · 비율은 그대로).",
    "`context.gradients.shimmerNeutral`",
  ],
);

w("/// 컨텍스트에서 꺼내는 짧은 이름.");
w("extension PDesignTokensContext on BuildContext {");
w("  PColors get colors => Theme.of(this).extension<PColors>()!;");
w("  PShadows get shadows => Theme.of(this).extension<PShadows>()!;");
w("  PGradients get gradients => Theme.of(this).extension<PGradients>()!;");
w("}");

stdout.write(out);
