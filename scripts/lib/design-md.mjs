// DESIGN*.md 읽기 — 내보내기 스크립트(build-tailwind-v4 · build-dart-tokens · build-spec-json)가 함께 쓴다.
//
// 머리말(YAML front matter)의 colors · typography · rounded · spacing 블록과 본문의 prose 토큰 표
// (`| \`이름\` | \`값\` | 설명 |`)를 의존성 없이 정규식으로 읽는다. 한 곳에 두어 내보내기마다 읽는 법이
// 갈라지지 않게 한다 — 웹(CSS)과 앱(Dart)이 같은 값을 받아야 한다.

export function findBlockLines(lines, key) {
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

// 색 — CSS 용. 참조("{colors.gray-00}")는 var(--color-gray-00) 로 둔다(v108).
export function parseColors(lines) {
  const out = {};
  for (const [name, entry] of parseColorTable(lines)) {
    out[name] = entry.hex ?? `var(--color-${entry.ref})`;
  }
  return out;
}

// 색 — 이름 → { hex } | { ref } (나온 차례대로).
export function parseColorTable(lines) {
  const { start, end } = findBlockLines(lines, "colors");
  const out = new Map();
  for (let i = start + 1; i < end; i++) {
    const m = /^\s+([a-z0-9-]+):\s*"(#[0-9A-Fa-f]+)"/.exec(lines[i]);
    if (m) { out.set(m[1], { hex: m[2].toLowerCase() }); continue; }
    // 역할 색은 팔레트를 가리키는 참조("{colors.gray-00}")
    const r = /^\s+([a-z0-9-]+):\s*"\{colors\.([a-z0-9-]+)\}"/.exec(lines[i]);
    if (r) out.set(r[1], { ref: r[2] });
  }
  return out;
}

// 참조를 따라가 hex 를 얻는다. 없는 색 · 도는 참조면 멈춘다.
export function resolveColorHex(table, name, depth = 0) {
  const entry = table.get(name);
  if (!entry) throw new Error(`색 ${name} 이 없다`);
  if (entry.hex) return entry.hex;
  if (depth > 8) throw new Error(`색 ${name} 의 참조가 돌고 돈다`);
  return resolveColorHex(table, entry.ref, depth + 1);
}

// 팔레트 단계(gray-500 · brand-600-dark …). 역할 색은 이것만 가리킨다.
export const PALETTE_STEP = /^(gray|red|green|orange|blue|yellow|indigo|violet|pink|brown|brand)-\d+(-dark)?$/;

// 형식 키 — 팔레트가 아닌 이름(역할)을 가리키는 색. 브랜드 파일의 `primary`(design.md 형식이 요구하는 대표 색)뿐이다.
// 내보내기는 이 이름을 싣지 않는다.
export function colorAliases(table) {
  const out = new Set();
  for (const [name, entry] of table) {
    if (entry.ref && !PALETTE_STEP.test(entry.ref)) out.add(name);
  }
  return out;
}

export function parseTypography(lines) {
  const { start, end } = findBlockLines(lines, "typography");
  const out = {};
  let current = null;
  for (let i = start + 1; i < end; i++) {
    const line = lines[i];
    const named = /^\s{2}([a-z][a-z0-9-]*):\s*$/.exec(line);
    if (named) { current = named[1]; out[current] = {}; continue; }
    const prop = /^\s{4}([a-zA-Z]+):\s*(.+?)\s*$/.exec(line);
    if (prop && current) {
      let val = prop[2].replace(/^"|"$/g, "").replace(/^'|'$/g, "");
      out[current][prop[1]] = val;
    }
  }
  return out;
}

export function parseSimpleScale(lines, key) {
  const { start, end } = findBlockLines(lines, key);
  const out = {};
  for (let i = start + 1; i < end; i++) {
    const m = /^\s+([a-z0-9_-]+):\s*"?([^"#\n]+?)"?\s*(?:#.*)?$/.exec(lines[i]);
    if (m && !m[1].startsWith("#")) out[m[1]] = m[2].trim();
  }
  return out;
}

// prose 토큰 표 — `| \`<prefix>…\` | \`값\` | 설명 |`
function proseTable(md, prefix) {
  const re = new RegExp("^\\|\\s*`(" + prefix + "[a-z0-9-]+)`\\s*\\|\\s*`([^`]+)`\\s*\\|", "gm");
  const out = {};
  let m;
  while ((m = re.exec(md)) !== null) out[m[1]] = m[2];
  return out;
}

export function parseShadows(md) {
  return proseTable(md, "shadow-");
}

export function parseMotion(md) {
  // motion-duration-* and motion-ease-* prose tokens
  return proseTable(md, "motion-(?:duration|ease)-");
}

export function parseOverlay(md) {
  // overlay-dim-* prose tokens (rgba(...) alpha values)
  return proseTable(md, "overlay-");
}

export function parseBreakpoints(md) {
  // breakpoint-* prose tokens (px values, Tailwind v4 default 호환)
  return proseTable(md, "breakpoint-");
}

export function parseLayout(md) {
  // layout-* prose tokens (v101 SEED 레이아웃 — 콘텐츠 폭 · 여백 · 사이드바)
  return proseTable(md, "layout-");
}

export function parseGradients(md) {
  // gradient-* prose tokens (v104 SEED 그라디언트 — 투명도 있는 색이라 머리말이 아니라 표에 둔다)
  return proseTable(md, "gradient-");
}

export function parseTouchTargets(md) {
  // touch-* prose tokens (WCAG 2.5.5 AAA + Apple Store reference)
  return proseTable(md, "touch-");
}

export function parseZIndex(md) {
  // z-* prose tokens (v116 — 층 이름: z-base · z-sticky · z-modal · z-modal-content · z-floating · z-tooltip ·
  // z-alert · z-alert-content · z-snackbar · z-dev). 값은 정수 또는 `auto`(L0 — 쌓임 맥락을 만들지 않는다)만 받는다.
  // 같은 이름이 다른 값으로 두 번 나오면 멈춘다 — 뒤의 표가 조용히 이기면 층 순서가 어긋나도 모른다.
  const re = /^\|\s*`(z-[a-z0-9-]+)`\s*\|\s*`([^`]+)`\s*\|/gm;
  const out = {};
  let m;
  while ((m = re.exec(md)) !== null) {
    const [, name, raw] = m;
    const val = raw.trim();
    if (!/^(auto|-?\d+)$/.test(val)) throw new Error(`z-index 토큰 ${name} 의 값 "${val}" — 정수나 auto 만 받는다`);
    if (name in out && out[name] !== val) throw new Error(`z-index 토큰 ${name} 이 두 값(${out[name]} · ${val})으로 정의됐다`);
    out[name] = val;
  }
  return out;
}

export function parseKeyframes(md) {
  // v74 Animation library — "#### CSS keyframes 정의" 아래 ```css ... ``` 블록 추출
  // CSS @keyframes는 @theme 밖에 root level로 출력
  const sectionRe = /####\s+CSS keyframes 정의[\s\S]*?```css\n([\s\S]*?)```/;
  const m = sectionRe.exec(md);
  if (!m) return [];
  const block = m[1];
  // brace 매칭 — @keyframes name { ... } (중첩 1 level 처리)
  const out = [];
  const startRe = /@keyframes\s+([a-z][a-z0-9-]*)\s*\{/g;
  let sm;
  while ((sm = startRe.exec(block)) !== null) {
    const name = sm[1];
    let depth = 1;
    let i = sm.index + sm[0].length;
    while (i < block.length && depth > 0) {
      const c = block[i];
      if (c === "{") depth++;
      else if (c === "}") depth--;
      i++;
    }
    if (depth === 0) {
      const css = block.slice(sm.index, i);
      out.push({ name, css });
    }
  }
  return out;
}

export function parseArgs(arr) {
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
