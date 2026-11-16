// 기초 페이지가 쓰는 토큰 값 — 빌드 때 레포 루트의 DESIGN*.md 를 직접 읽는다.
// 페이지(.mdx)에 숫자를 손으로 적지 않는다: 값이 두 군데 생기면 한쪽이 낡는다.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

const REPO = join(process.cwd(), '..');
export type Brand = 'shared' | 'hr' | 'desk';
const FILE: Record<Brand, string> = { shared: 'DESIGN.md', hr: 'DESIGN.hr.md', desk: 'DESIGN.desk.md' };

type TypeStyle = { fontFamily?: string; fontSize: string; fontWeight?: number | string; lineHeight?: string; letterSpacing?: string };
type Front = {
  colors: Record<string, string>;
  // 참조("{colors.gray-00}")로 적힌 색이 가리키는 이름. colors 에는 풀어 둔 hex 가 들어 있다
  colorRefs: Record<string, string>;
  typography: Record<string, TypeStyle>;
  rounded: Record<string, string>;
  spacing: Record<string, string>;
};

const cache = new Map<Brand, { front: Front; body: string; text: string }>();

export function design(brand: Brand = 'shared') {
  const hit = cache.get(brand);
  if (hit) return hit;
  const text = readFileSync(join(REPO, FILE[brand]), 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${FILE[brand]} 에 front matter 가 없다`);
  const front = parseYaml(m[1]) as Front;
  // 역할 → 팔레트 사슬을 hex 로 푼다. 가리키는 이름은 colorRefs 에 남긴다
  const raw = front.colors;
  const refOf = (v: unknown) => /^\{colors\.([a-z0-9-]+)\}$/.exec(String(v))?.[1];
  const resolve = (n: string, depth = 0): string => {
    const r = refOf(raw[n]);
    if (!r) return raw[n];
    if (!(r in raw)) throw new Error(`${FILE[brand]} 의 색 ${n} 이 없는 색 ${r} 을 가리킨다`);
    if (depth > 8) throw new Error(`${FILE[brand]} 의 색 ${n} 참조가 돌고 돈다`);
    return resolve(r, depth + 1);
  };
  front.colorRefs = Object.fromEntries(Object.entries(raw).flatMap(([k, v]) => (refOf(v) ? [[k, refOf(v)!]] : [])));
  front.colors = Object.fromEntries(Object.keys(raw).map((k) => [k, resolve(k)]));
  const out = { front, body: m[2], text };
  cache.set(brand, out);
  return out;
}

// `| \`name\` | \`value\` | 설명 |` 꼴의 prose 토큰 표(중단점 · 레이아웃 …)
export function proseTokens(prefix: string, brand: Brand = 'shared') {
  const re = new RegExp('^\\|\\s*`(' + prefix + '[a-z0-9-]+)`\\s*\\|\\s*`([^`]+)`\\s*\\|\\s*([^|\\n]*)\\|', 'gm');
  const out: { name: string; value: string; note: string }[] = [];
  for (const m of design(brand).text.matchAll(re)) out.push({ name: m[1], value: m[2], note: m[3].trim() });
  return out;
}

export const px = (v: string) => Number(String(v).replace('px', ''));

// 옛 이름 별칭(spacing xs ~ 3xl · rounded xs ~ 2xl · 옛 15단계 글자)은 머리말에 남아 있지만 사이트에 싣지 않는다
export const LEGACY_SPACING = /^(xs|sm|md|lg|xl|2xl|3xl)$/;
export function spacingScale() {
  const all = design().front.spacing;
  const scale = Object.entries(all).filter(([k]) => /^x\d/.test(k)).map(([k, v]) => ({ name: k, value: v }));
  const roles = Object.entries(all).filter(([k]) => !/^x\d/.test(k) && !LEGACY_SPACING.test(k)).map(([k, v]) => ({ name: k, value: v }));
  const byValue = (v: string) => scale.find((s) => s.value === v)?.name;
  return { scale, roles, byValue };
}

export function radiusScale() {
  const all = design().front.rounded;
  const scale = Object.entries(all).filter(([k]) => /^r\d|^full$/.test(k)).map(([k, v]) => ({ name: k, value: v }));
  return { scale };
}

export const TYPE_ROLE_STYLES = ['screen-title', 'article-body', 'article-note'];
export function typeScale() {
  const all = design().front.typography;
  const scale = Object.entries(all).filter(([k]) => /^t\d+$/.test(k)).map(([k, v]) => ({ name: k, ...v }));
  const semantic = Object.entries(all).filter(([k]) => TYPE_ROLE_STYLES.includes(k)).map(([k, v]) => ({ name: k, ...v }));
  return { scale, semantic };
}

// 역할 색 — 라이트 값과 `-dark` 짝을 한 줄로
export type RoleColor = { name: string; light: string; dark?: string };
const PALETTE_STEP = /^(gray|red|green|orange|blue|yellow|indigo|violet|pink|brown|brand)-(00|\d+)(-dark)?$/;
export function roleColors(brand: Brand = 'shared') {
  const { colors: c, colorRefs } = design(brand).front;
  const rows: RoleColor[] = [];
  for (const [name, light] of Object.entries(c)) {
    if (!/^(fg|bg|stroke|static)-/.test(name) || name.endsWith('-dark')) continue;
    // 역할을 가리키는 형식 키(primary)는 역할이 아니다
    if (colorRefs[name] && !PALETTE_STEP.test(colorRefs[name])) continue;
    rows.push({ name, light, dark: c[`${name}-dark`] });
  }
  return rows;
}
// 색을 고르지 않은 항목이 받는 차트 색 순서
export const CHART_ORDER = ['blue', 'green', 'orange', 'violet', 'pink', 'indigo', 'red', 'yellow', 'brown', 'gray'];
export const BRAND_ROLES = ['fg-brand', 'fg-brand-contrast', 'fg-brand-inverted', 'bg-brand-solid', 'bg-brand-solid-pressed', 'bg-brand-weak', 'bg-brand-weak-pressed', 'stroke-focus-ring', 'stroke-brand-solid', 'stroke-brand-weak'];

// 역할이 가리키는 팔레트 단계("gray-200") — 별칭이면 역할을 거쳐 끝까지
export function colorStep(name: string, brand: Brand = 'desk') {
  const refs = { ...design('shared').front.colorRefs, ...design(brand).front.colorRefs };
  let n = name, k = 0;
  while (refs[n] && k++ < 8) n = refs[n];
  return n === name ? undefined : n;
}

// 팔레트 — 가족마다 단계(00 · 100 ~ 1000)의 라이트 · 다크
export type PaletteStep = { step: string; light: string; dark: string };
export function palette(family: string, brand: Brand = 'shared') {
  const c = design(brand).front.colors;
  const re = new RegExp(`^${family}-(00|\\d+)$`);
  const steps = Object.keys(c).filter((k) => re.test(k)).map((k) => ({ step: k.slice(family.length + 1), light: c[k], dark: c[`${k}-dark`] }));
  if (!steps.length) throw new Error(`팔레트 ${family} 가 ${FILE[brand]} 에 없다`);
  return steps.sort((a, b) => Number(a.step) - Number(b.step));
}

export function color(name: string, brand: Brand = 'desk') {
  const v = design(brand).front.colors[name] ?? design('shared').front.colors[name];
  if (!v) throw new Error(`색 토큰 ${name} 이 ${FILE[brand]} 에 없다`);
  return v;
}

// DESIGN.md 의 제목(## ~ #####) 절 안의 표들 — 그대로 그려 보여 줄 때(숫자를 옮겨 적지 않으려고).
// 절은 같거나 높은 단계의 다음 제목에서 끝난다.
export function sectionTables(headingStartsWith: string, brand: Brand = 'shared') {
  const lines = design(brand).body.split('\n');
  const start = lines.findIndex((l) => /^#{2,5} /.test(l) && l.replace(/^#{2,5} /, '').startsWith(headingStartsWith));
  if (start === -1) throw new Error(`DESIGN.md 에 "${headingStartsWith}" 제목이 없다`);
  const level = lines[start].match(/^#+/)![0].length;
  const tables: { head: string[]; rows: string[][] }[] = [];
  let cur: string[][] | null = null;
  for (let i = start + 1; i < lines.length; i++) {
    const h = lines[i].match(/^(#{2,6}) /);
    if (h && h[1].length <= level) break;
    if (lines[i].startsWith('|')) {
      const cells = lines[i].replace(/^\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());
      if (cells.every((c) => /^:?-{3,}:?$/.test(c))) continue;
      (cur ??= []).push(cells);
    } else if (cur) {
      tables.push({ head: cur[0], rows: cur.slice(1) });
      cur = null;
    }
  }
  if (cur) tables.push({ head: cur[0], rows: cur.slice(1) });
  return tables;
}
export function sectionTable(headingStartsWith: string, n = 0, brand: Brand = 'shared') {
  const t = sectionTables(headingStartsWith, brand)[n];
  if (!t) throw new Error(`"${headingStartsWith}" 절에 ${n + 1}번째 표가 없다`);
  return t;
}

// 절 안의 첫 코드 블록 — 공식 · 키프레임 CSS 를 옮겨 적지 않으려고
export function sectionCode(headingStartsWith: string, brand: Brand = 'shared') {
  const lines = design(brand).body.split('\n');
  const start = lines.findIndex((l) => /^#{2,5} /.test(l) && l.replace(/^#{2,5} /, '').startsWith(headingStartsWith));
  if (start === -1) throw new Error(`DESIGN.md 에 "${headingStartsWith}" 제목이 없다`);
  const level = lines[start].match(/^#+/)![0].length;
  let body: string[] | null = null;
  for (let i = start + 1; i < lines.length; i++) {
    if (body === null && /^(#{2,6}) /.test(lines[i]) && lines[i].match(/^#+/)![0].length <= level) break;
    if (/^\s*```/.test(lines[i])) {
      if (body) return body.join('\n');
      body = [];
    } else if (body) body.push(lines[i]);
  }
  throw new Error(`"${headingStartsWith}" 절에 코드 블록이 없다`);
}

// 절 본문(제목 아래부터 같거나 높은 단계의 다음 제목 전까지) — 문장 속 수치를 읽을 때
export function sectionText(headingStartsWith: string, brand: Brand = 'shared') {
  const lines = design(brand).body.split('\n');
  const start = lines.findIndex((l) => /^#{2,5} /.test(l) && l.replace(/^#{2,5} /, '').startsWith(headingStartsWith));
  if (start === -1) throw new Error(`DESIGN.md 에 "${headingStartsWith}" 제목이 없다`);
  const level = lines[start].match(/^#+/)![0].length;
  const out: string[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    const h = lines[i].match(/^(#{2,6}) /);
    if (h && h[1].length <= level) break;
    out.push(lines[i]);
  }
  return out.join('\n');
}
// 절 본문에서 정규식의 첫 숫자 묶음 — 없으면 빌드를 멈춘다(문장이 바뀌면 그림도 같이 고치게)
export function sectionNumber(headingStartsWith: string, re: RegExp) {
  const m = sectionText(headingStartsWith).match(re);
  if (!m) throw new Error(`"${headingStartsWith}" 절에서 ${re} 를 찾지 못했다`);
  return Number(m[1]);
}

// 표 토큰 하나 — 내보내기(build-tailwind-v4)처럼 뒤에 나온 정의가 이긴다
export function proseValue(name: string, brand: Brand = 'shared') {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const all = [...design(brand).text.matchAll(new RegExp('^\\|\\s*`' + esc + '`\\s*\\|\\s*`([^`]+)`', 'gm'))];
  if (!all.length) throw new Error(`prose 토큰 ${name} 이 ${FILE[brand]} 에 없다`);
  return all[all.length - 1][1];
}
export const ms = (v: string) => parseFloat(v);

// 이름이 같은 정의가 여러 번 나오면 뒤의 것 하나만
export function proseTokenSet(prefix: string, keep: RegExp) {
  const out = new Map<string, { name: string; value: string; note: string }>();
  for (const t of proseTokens(prefix)) if (keep.test(t.name)) out.set(t.name, { ...t, value: proseValue(t.name) });
  return [...out.values()];
}

// 눌림 축소 상수(DESIGN.md "눌림 피드백" 표) — 기준 길이 = max(높이, 폭 ÷ n, 최소)
export function pressScale() {
  const { rows } = sectionTable('눌림 피드백');
  const cell = (k: string) => {
    const r = rows.find((x) => x[0] === k);
    if (!r) throw new Error(`"눌림 피드백" 표에 ${k} 줄이 없다`);
    return r[1];
  };
  const distance = parseFloat(cell('축소량'));
  const widthDivisor = Number(cell('폭 보정').match(/÷\s*(\d+)/)?.[1]);
  const minBasis = parseFloat(cell('최소 기준 길이'));
  if (![distance, widthDivisor, minBasis].every(Number.isFinite)) throw new Error('"눌림 피드백" 표의 값을 읽지 못했다');
  const basis = (w: number, h: number) => Math.max(h, w / widthDivisor, minBasis);
  const ratio = (w: number, h: number) => (basis(w, h) - distance) / basis(w, h);
  return { distance, widthDivisor, minBasis, basis, ratio };
}

// 모션 줄이기 모드 표 — 큰 전환의 기준(200ms 초과)과 바꿔 쓰는 시간(150ms)
export function reducedMotion() {
  const { rows } = sectionTable('모션 줄이기 모드');
  const macro = rows.find((r) => r[0].startsWith('매크로 모션'));
  const over = Number(macro?.[0].match(/(\d+)ms/)?.[1]);
  const fade = Number(macro?.[2].match(/(\d+)ms/)?.[1]);
  if (!Number.isFinite(over) || !Number.isFinite(fade)) throw new Error('"모션 줄이기 모드" 표의 매크로 모션 줄을 읽지 못했다');
  return { over, fade };
}

// 컴포넌트 YAML 의 크기 규칙(when: { size }) — 그림 속 예시를 실제 컴포넌트 크기로 그리려고.
// layout 을 주면 크기 × 배치 규칙(when: { size, layout })의 값이 겹쳐 쓴다(버튼의 iconOnly 폭)
export function specSize(component: string, size: string, state = 'enabled', layout?: string) {
  const doc = parseYaml(readFileSync(join(REPO, 'specs/components', `${component}.yaml`), 'utf8')) as {
    rules: { when?: Record<string, string>; [state: string]: unknown }[];
  };
  const rootOf = (when: Record<string, string>) => {
    const keys = Object.keys(when);
    const rule = doc.rules.find((r) => r.when && Object.keys(r.when).length === keys.length && keys.every((k) => r.when?.[k] === when[k]));
    return (rule?.[state] as { root?: Record<string, unknown> } | undefined)?.root;
  };
  const base = rootOf({ size });
  if (!base) throw new Error(`${component}.yaml 에 size ${size} 규칙이 없다`);
  const extra = layout ? rootOf({ size, layout }) : undefined;
  if (layout && !extra) throw new Error(`${component}.yaml 에 size ${size} × layout ${layout} 규칙이 없다`);
  const root = { ...base, ...extra };
  // 값은 '40px' 또는 { value: '48px', note } — note 는 표의 비고라 버린다
  const num = (v: unknown): number | undefined => {
    if (v && typeof v === 'object' && 'value' in v) return num((v as { value: unknown }).value);
    return typeof v === 'string' && /^\d+(\.\d+)?px$/.test(v) ? parseFloat(v) : undefined;
  };
  const h = num(root.height) ?? num(root.size);
  const w = num(root.width) ?? num(root.size);
  if (h === undefined) throw new Error(`${component}.yaml size ${size} 에 높이가 없다`);
  return { width: w, height: h };
}

// 컴포넌트 YAML 의 한 규칙(when 이 정확히 같은)에서 한 부위의 크기 — 예: checkbox 의 칸(checkmark)
export function specPartSize(component: string, when: Record<string, string>, slot: string, state = 'enabled') {
  const doc = parseYaml(readFileSync(join(REPO, 'specs/components', `${component}.yaml`), 'utf8')) as {
    rules: { when?: Record<string, string>; [state: string]: unknown }[];
  };
  const keys = Object.keys(when);
  const rule = doc.rules.find((r) => r.when && Object.keys(r.when).length === keys.length && keys.every((k) => r.when?.[k] === when[k]));
  const part = (rule?.[state] as Record<string, Record<string, unknown>> | undefined)?.[slot];
  if (!part) throw new Error(`${component}.yaml 에 ${JSON.stringify(when)} 의 ${state}.${slot} 이 없다`);
  const num = (v: unknown): number | undefined => {
    if (v && typeof v === 'object' && 'value' in v) return num((v as { value: unknown }).value);
    return typeof v === 'string' && /^\d+(\.\d+)?px$/.test(v) ? parseFloat(v) : undefined;
  };
  const h = num(part.height) ?? num(part.size);
  const w = num(part.width) ?? num(part.size);
  if (h === undefined) throw new Error(`${component}.yaml ${JSON.stringify(when)} 의 ${slot} 에 크기가 없다`);
  return { width: w, height: h };
}

// 컴포넌트 YAML 의 기본값(defaults) — 예: switch 의 기본 크기
export function specDefault(component: string, axis: string) {
  const doc = parseYaml(readFileSync(join(REPO, 'specs/components', `${component}.yaml`), 'utf8')) as { defaults?: Record<string, unknown> };
  const v = doc.defaults?.[axis];
  if (v === undefined) throw new Error(`${component}.yaml 의 defaults 에 ${axis} 가 없다`);
  return String(v);
}

// 컴포넌트 YAML 의 공통 규칙(when: {})에서 한 조각(예: checkbox 의 root)
export function specSlot(component: string, slot: string, state = 'enabled') {
  const doc = parseYaml(readFileSync(join(REPO, 'specs/components', `${component}.yaml`), 'utf8')) as {
    rules: { when?: Record<string, string>; [state: string]: unknown }[];
  };
  const rule = doc.rules.find((r) => !r.when || Object.keys(r.when).length === 0);
  const v = (rule?.[state] as Record<string, Record<string, unknown>> | undefined)?.[slot];
  if (!v) throw new Error(`${component}.yaml 공통 규칙에 ${state}.${slot} 이 없다`);
  return v;
}

// WCAG 2 대비 — 페이지의 견본 옆 숫자
function lum(hex: string) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: string, b: string) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
