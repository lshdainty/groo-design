// 원본(DESIGN*.md · specs/**/*.md)을 사이트 페이지(.md)로 옮긴다.
//
// 원본은 건드리지 않는다. 여기서 만든 .md 는 빌드 산출물이라 git 에 올리지 않는다
// (site/.gitignore). 손으로 쓴 페이지(.mdx)가 같은 자리에 있으면 그쪽이 이기고
// 생성은 건너뛴다 — 원본을 사이트용으로 새로 쓴 페이지가 생기면 그 파일만 두면 된다.

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { fillSpecTables, loadTokens } from './spec-tables.mjs';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = join(SITE, '..');
const DOCS = join(SITE, 'content/docs');
// GitHub 의 원본 파일 주소 — site/lib/shared.ts 의 gitConfig 와 같은 레포 · 브랜치다
const REPO_BLOB = 'https://github.com/lshdainty/groo-design/blob/main';

// DESIGN.md 의 `## ` 절 → 기초 페이지. 절 이름이 바뀌면 여기서 멈춘다(조용히 빠지지 않게).
// Color · Gradient · Typography · Spacing · Radius · Layout · Elevation · Motion · Feedback 은 SEED 문서 모양으로
// 손으로 쓴 .mdx 다(content/docs/foundations). 그 페이지의 숫자는 components/foundations 가 빌드 때 DESIGN.md 에서
// 읽는다 — 여기서는 만들지 않는다. Elevation · Motion 은 아래 목록에 남겨 절 이름이 바뀌면 멈추게 한다(.mdx 가 이긴다).
const FOUNDATION_SECTIONS = [
  { heading: 'Overview', slug: 'overview', title: 'Overview', description: '공유 baseline 과 브랜드 파일의 관계' },
  { heading: 'Elevation & Depth', slug: 'elevation', title: 'Elevation & Depth', description: '그림자와 오버레이 딤' },
  { heading: 'Motion', slug: 'motion', title: 'Motion', description: '지속 시간·이징·반복·키프레임' },
  { heading: 'State', slug: 'state', title: 'State', description: '상호작용 상태와 옵션 상태' },
  { heading: 'Iconography', slug: 'iconography', title: 'Iconography', description: '아이콘 세트 · 크기 · 굵기 · 아이콘 버튼' },
  { heading: 'Inclusive Design', slug: 'inclusive-design', title: 'Inclusive Design', description: '모든 사용자가 쓸 수 있게' },
  { heading: 'International Design', slug: 'international-design', title: 'International Design', description: '날짜 · 시각 · 숫자 · 기호의 로케일 표기' },
  { heading: 'Voice and Tone', slug: 'voice-and-tone', title: 'Voice and Tone', description: 'groo 가 말하는 방법' },
  { heading: 'Writing', slug: 'writing', title: 'Writing', description: 'groo 가 글을 쓰는 방법' },
];

// `##` 절 안의 `###` 하나를 따로 한 페이지로 — Layout 절에 있던 것 가운데 새 Layout 페이지가 다루지 않는 것
const FOUNDATION_SUBSECTIONS = [
  { parent: 'Layout', startsWith: 'Touch targets', slug: 'touch-targets', title: '터치 영역', description: '누를 수 있는 요소의 최소 크기' },
  { parent: 'Layout', startsWith: 'RTL support', slug: 'rtl', title: 'RTL', description: '오른쪽에서 왼쪽으로 쓰는 언어 대응' },
  { parent: 'Layout', startsWith: 'Safe Area', slug: 'safe-area', title: 'Safe Area', description: '안전 영역 — 상태 표시줄 · 홈 표시줄 · 노치에 가릴 수 있는 화면 가장자리' },
];

// 스펙 폴더 밖에 있는 기초 스펙. 컴포넌트 스펙이 `../z-index.md` 로 링크한다.
const FOUNDATION_SPECS = [{ file: 'specs/z-index.md', slug: 'z-index' }];

const generated = [];

function read(rel) {
  return readFileSync(join(REPO, rel), 'utf8');
}

// 첫 `---` … `---` 블록을 YAML 로, 나머지를 본문으로 나눈다.
function splitFrontMatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('front matter 없음');
  return { data: parseYaml(match[1]), body: match[2] };
}

// 줄마다 코드 펜스 안인지 알려 준다. 펜스 안의 `#` 은 제목이 아니다.
// 닫는 펜스는 여는 것과 같은 글자로 같거나 길게, 뒤에 아무것도 없어야 한다(CommonMark).
function* linesWithFence(text) {
  let fence = null;
  for (const line of text.split('\n')) {
    const m = line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);
    if (m && !fence) {
      fence = m[1];
      yield [line, true];
    } else if (m && m[1][0] === fence[0] && m[1].length >= fence.length && m[2].trim() === '') {
      fence = null;
      yield [line, true];
    } else {
      yield [line, fence !== null];
    }
  }
}

// `## 제목` 단위로 자른다.
function splitSections(body) {
  const sections = [];
  for (const [line, inFence] of linesWithFence(body)) {
    const h2 = !inFence && line.match(/^## (.+)$/);
    if (h2) sections.push({ heading: h2[1].trim(), lines: [] });
    else sections.at(-1)?.lines.push(line);
  }
  return sections.map((s) => ({ heading: s.heading, content: s.lines.join('\n').trim() }));
}

// 페이지 제목이 h1 이므로 절 안의 제목을 한 단계씩 올린다(### → ##).
function promoteHeadings(content) {
  return [...linesWithFence(content)]
    .map(([line, inFence]) => (inFence ? line : line.replace(/^#(#{2,6}) /, '$1 ')))
    .join('\n');
}

// 스펙의 Anatomy 범례는 머리 줄 없이 `| ⓐ 부위 | 설명 |` 행만 쓰는 게 관례다(53개 전부).
// GFM 은 구분 줄(`| --- |`)이 없으면 표로 보지 않으므로 머리 줄을 채운다.
const TABLE_DELIMITER = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/;

function addMissingTableHeaders(body) {
  const lines = [...linesWithFence(body)];
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const [line, inFence] = lines[i];
    const startsTable = !inFence && line.trimStart().startsWith('|') && !out.at(-1)?.trimStart().startsWith('|');
    if (startsTable && !TABLE_DELIMITER.test(lines[i + 1]?.[0] ?? '')) {
      out.push('| 부위 | 설명 |', '| --- | --- |');
    }
    out.push(line);
  }
  return out.join('\n');
}

// 설명 칸은 글자로만 나온다 — 마크다운 기호를 벗긴다.
function plain(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

// `# 제목` 과 바로 아래 `> 요약` 을 떼어 frontmatter 로 올린다.
function splitSpec(text) {
  const lines = text.split('\n');
  const h1 = lines.findIndex((l) => /^# /.test(l));
  if (h1 === -1) throw new Error('# 제목 없음');
  const title = lines[h1].replace(/^# /, '').trim();
  let i = h1 + 1;
  while (i < lines.length && lines[i].trim() === '') i++;
  const quote = [];
  while (i < lines.length && /^>/.test(lines[i])) quote.push(lines[i++].replace(/^>\s?/, ''));
  return { title, description: plain(quote.join(' ')), body: lines.slice(i).join('\n').trim() };
}

// 여기서 만든 .mdx 의 표시 — 손으로 쓴 .mdx 와 가른다(정리 · 건너뛰기)
const GEN_MARK = '{/* gen-content 가 만든 페이지';
const isGeneratedMdx = (p) => existsSync(p) && readFileSync(p, 'utf8').includes(GEN_MARK);

// 원본의 md 사이 링크(`[Field](field.md)` · `[…](specs/components/list.md)` · `../z-index.md`)를 사이트 주소로 바꾼다 —
// 그대로 두면 브라우저가 `/docs/components/field.md` 를 찾아 404 다. 사이트에 없는 스펙은 GitHub 원본으로 보낸다.
function siteLinks(body) {
  const component = (name, frag = '') =>
    existsSync(join(REPO, 'specs/components', `${name}.md`)) ? `](/docs/components/${name}${frag})` : `](${REPO_BLOB}/specs/components/${name}.md${frag})`;
  return body
    .replace(/\]\((?:\.\.\/|specs\/)z-index\.md(#[^)\s]*)?\)/g, (_, frag = '') => `](/docs/foundations/z-index${frag})`)
    .replace(/\]\((?:\.\/)?(?:specs\/components\/|components\/)?([a-z0-9-]+)\.md(#[^)\s]*)?\)/g, (_, name, frag) => component(name, frag));
}

function write(relPath, { title, description, source }, body) {
  body = siteLinks(body);
  const out = join(DOCS, relPath);
  const handMdx = out.replace(/\.mdx?$/, '.mdx');
  if (existsSync(handMdx) && !isGeneratedMdx(handMdx)) return; // 손으로 쓴 페이지가 이긴다
  mkdirSync(dirname(out), { recursive: true });
  const fm = stringifyYaml({ title, description, source }, { lineWidth: 0 }).trim();
  const note = relPath.endsWith('.mdx')
    ? `${GEN_MARK} — ${source} 에서 생성. 이 파일을 고치지 말고 원본을 고친다 */}`
    : `<!-- ${source} 에서 생성 — 이 파일을 고치지 말고 원본을 고친다 -->`;
  writeFileSync(out, `---\n${fm}\n---\n\n${note}\n\n${body}\n`);
  generated.push(relPath);
}

// 지난번에 만든 .md · .mdx 를 지운다. 손으로 쓴 .mdx · meta.json 은 남긴다.
function clean(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) clean(p);
    else if (entry.name.endsWith('.md') || (entry.name.endsWith('.mdx') && isGeneratedMdx(p))) rmSync(p);
  }
}

// ── 컴포넌트 그림 자리 ────────────────────────────────────────────
// 스펙 md 의 `[그림: 캡션](../../site/components/specs/<이름>.tsx#<id>)` 한 줄은 사이트에서 그 그림(렌더링된
// 컴포넌트 · 화면 예시 · Do/Don't)이 된다. GitHub 에서는 그림을 그리는 코드로 가는 링크로 보인다.
// 그림 자리가 있는 스펙은 .mdx 로 만든다 — 본문의 { } < 는 코드 밖에서만 글자로 바꾼다(MDX 가 JSX 로 읽지 않게).
export const FIGURE = /^\[그림: ([^\]]+)\]\(\.\.\/\.\.\/site\/components\/specs\/([a-z0-9-]+)\.tsx#([a-zA-Z0-9-]+)\)\s*$/;

function mdxText(line) {
  return line
    .split(/(`[^`]*`)/)
    .map((seg) => (/^`[^`]*`$/.test(seg) ? seg : seg.replace(/[{}<]/g, (c) => ({ '{': '\\{', '}': '\\}', '<': '&lt;' })[c])))
    .join('');
}

function toMdx(body, source) {
  let fence = null;
  return body
    .split('\n')
    .map((line, i) => {
      const f = /^\s*(```+|~~~+)/.exec(line);
      if (fence) {
        if (f && f[1][0] === fence[0] && f[1].length >= fence.length) fence = null;
        return line;
      }
      if (f) {
        fence = f[1];
        return line;
      }
      const m = line.match(FIGURE);
      if (m) return `<SpecFigure name=${JSON.stringify(m[2])} id=${JSON.stringify(m[3])} caption={${JSON.stringify(m[1])}} />`;
      if (/^(import|export)\s/.test(line)) throw new Error(`${source}:${i + 1} 줄이 import · export 로 시작한다 — MDX 가 코드로 읽는다`);
      return mdxText(line);
    })
    .join('\n');
}

// ── 토큰 레퍼런스 ──────────────────────────────────────────────

// v108 — 역할 색 · 옛 이름은 `{colors.x}` 참조다. 값은 끝까지 따라가 hex 로, 단계는 팔레트 이름으로 보인다
const PALETTE_NAME = /^(gray|red|green|orange|blue|yellow|indigo|violet|pink|brown|brand)-(00|\d+)$/;
function colorKit(colors = {}) {
  const ref = (name) => /^\{colors\.([a-z0-9-]+)\}$/.exec(String(colors[name] ?? ''))?.[1];
  const follow = (name) => {
    let n = name;
    for (let i = 0; ref(n); i++) {
      if (i > 8) throw new Error(`색 참조가 돌고 돈다: ${name}`);
      n = ref(n);
    }
    return n;
  };
  return {
    names: Object.keys(colors),
    has: (name) => name in colors,
    ref,
    value: (name) => (name in colors ? colors[follow(name)] : undefined),
    step: (name) => (name in colors && ref(name) ? follow(name).replace(/-dark$/, '') : undefined),
  };
}
const kind = (name) => {
  const base = name.replace(/-dark$/, '');
  if (PALETTE_NAME.test(base)) return 'palette';
  if (/^chart-[a-z]+-light$/.test(name)) return 'old'; // v110 — 다크 짝의 옛 이름
  if (/^chart-/.test(name)) return 'chart';
  if (/^(fg|bg|stroke|static)-/.test(name) && base !== 'bg-page') return 'role';
  return 'old';
};

function table(head, rows) {
  const line = (cells) => `| ${cells.join(' | ')} |`;
  return [line(head), line(head.map(() => '---')), ...rows.map(line)].join('\n');
}

const code = (v) => (v === undefined || v === null || v === '' ? '—' : `\`${v}\``);

// 표(prose) 토큰 — `| \`이름\` | \`값\` | 비고 |` 줄. 내보내기(build-tailwind-v4)처럼 뒤에 나온 정의가 이긴다
const PROSE_GROUPS = [
  ['breakpoint-', '중단점'], ['layout-', '레이아웃'], ['touch-', '터치 영역'], ['z-', 'z-index'], ['shadow-', '그림자'],
  ['overlay-', '딤'], ['motion-duration-', '모션 — 지속 시간'], ['motion-ease-', '모션 — 이징'], ['gradient-', '그라디언트'],
];
function proseTokenRows(text) {
  const rows = new Map();
  for (const m of text.matchAll(/^\|\s*`((?:breakpoint|layout|touch|z|shadow|overlay|motion-duration|motion-ease|gradient)-[a-z0-9_-]+)`\s*\|\s*`([^`]+)`\s*\|\s*([^|\n]*)\|/gm)) {
    rows.set(m[1], { value: m[2], note: m[3].trim() });
  }
  return rows;
}

function tokenReference() {
  const shared = splitFrontMatter(read('DESIGN.md')).data;
  const hr = splitFrontMatter(read('DESIGN.hr.md')).data;
  const desk = splitFrontMatter(read('DESIGN.desk.md')).data;

  const S = colorKit(shared.colors);
  const H = colorKit(hr.colors);
  const D = colorKit(desk.colors);
  const brandOnly = [...new Set([...H.names, ...D.names])].filter((n) => !S.has(n));
  const light = (names) => names.filter((n) => !n.endsWith('-dark'));
  const pick = (names, k) => light(names.filter((n) => kind(n) === k));
  const step = (kit, name) => (kit.step(name) ? code(kit.step(name)) : '—');
  const pair = (kit, name) => `${step(kit, name)} / ${step(kit, `${name}-dark`)}`;
  // static-white 처럼 다크 짝이 없는 색은 두 모드가 같다
  const dark = (kit, name) => kit.value(`${name}-dark`) ?? kit.value(name);

  const typography = Object.entries(shared.typography ?? {}).map(([name, t]) => [
    code(name),
    code(t.fontSize),
    code(t.fontWeight),
    code(t.lineHeight),
    code(t.letterSpacing),
  ]);
  const families = [...new Set(Object.values(shared.typography ?? {}).map((t) => t.fontFamily))];
  const prose = proseTokenRows(read('DESIGN.md'));
  const colorCount = S.names.length + brandOnly.length;
  const allCount = colorCount + typography.length + Object.keys(shared.rounded ?? {}).length + Object.keys(shared.spacing ?? {}).length + prose.size;

  return [
    '토큰 값은 `DESIGN.md`(공유)와 `DESIGN.hr.md` · `DESIGN.desk.md`(브랜드)가 원본이다. 이 목록은 빌드할 때 그 파일에서 그대로 뽑는다 — 색 · 글자 · 모서리 · 간격은 YAML 머리말에서, 그림자 · 모션 · 중단점 · 레이아웃 · 터치 영역 · z-index · 딤 · 그라디언트는 본문의 표에서.',
    '',
    `모두 ${allCount} 개다 — 색이 ${colorCount} 개(라이트 · 다크를 따로 센다)다. 토큰의 층과 모드는 [Overview](/docs/foundations/design-token) 에 있다.`,
    '',
    '## 팔레트',
    '',
    '가족마다 차례 번호가 붙은 색이다. 단계마다 라이트 · 다크 값이 따로 있고, 다크는 차례가 뒤집혀 작은 번호가 어둡다. 화면은 팔레트를 직접 쓰지 않고 역할 색으로 부른다.',
    '',
    table(['토큰', '라이트', '다크'], pick(S.names, 'palette').map((n) => [code(n), code(S.value(n)), code(S.value(`${n}-dark`))])),
    '',
    '### 브랜드 팔레트',
    '',
    '브랜드 파일에서만 정의한다. 파일 안에서는 접미사 없이 `brand-100` ~ `brand-1000` 이다.',
    '',
    table(
      ['토큰', 'HR 라이트', 'HR 다크', 'Desk 라이트', 'Desk 다크'],
      pick(brandOnly, 'palette').map((n) => [code(n), code(H.value(n)), code(H.value(`${n}-dark`)), code(D.value(n)), code(D.value(`${n}-dark`))]),
    ),
    '',
    '## 역할 색',
    '',
    '화면이 부르는 이름이다. 모드마다 팔레트의 한 단계를 가리킨다 — 단계 칸은 `라이트 / 다크` 다.',
    '',
    table(
      ['토큰', '단계', '라이트', '다크'],
      pick(S.names, 'role').map((n) => [code(n), pair(S, n), code(S.value(n)), code(dark(S, n))]),
    ),
    '',
    '### 브랜드 역할 색',
    '',
    table(
      ['토큰', 'HR 단계', 'HR 라이트 · 다크', 'Desk 단계', 'Desk 라이트 · 다크'],
      pick(brandOnly, 'role').map((n) => [
        code(n),
        pair(H, n),
        `${code(H.value(n))} · ${code(dark(H, n))}`,
        pair(D, n),
        `${code(D.value(n))} · ${code(dark(D, n))}`,
      ]),
    ),
    '',
    '## 옛 이름',
    '',
    '역할 색 이전의 이름이다. 컴포넌트 스펙이 아직 쓰고 있어 같은 값의 역할 색을 가리키는 별칭으로 남겼다 — 스펙을 모두 옮기면 지운다.',
    '',
    table(
      ['토큰', '가리키는 이름', '값'],
      [
        ...S.names.filter((n) => kind(n) === 'old').map((n) => [code(n), code(S.ref(n)), code(S.value(n))]),
        ...brandOnly.filter((n) => kind(n) === 'old').map((n) => [code(n), code(H.ref(n) ?? D.ref(n)), `HR ${code(H.value(n))} · Desk ${code(D.value(n))}`]),
      ],
    ),
    '',
    '## 차트',
    '',
    '데이터 시각화 · 카테고리 색의 10색이다. 팔레트 단계를 가리킨다 — 라이트 700, 다크 800-dark(v110). 다크 짝의 옛 이름 `chart-*-light` 는 옛 이름 표에 있다.',
    '',
    table(
      ['토큰', '단계', '라이트', '다크'],
      S.names.filter((n) => /^chart-[a-z]+$/.test(n)).map((n) => [code(n), pair(S, n), code(S.value(n)), code(S.value(`${n}-dark`))]),
    ),
    '',
    '### 차트 옅은 바탕',
    '',
    '카테고리 색을 옅게 깐 면과 그 위 글자다(v111) — `-weak` 는 작은 면(타일 · 칩), `-subtle` 은 넓은 면(메모 카드), `-contrast` 는 그 위 글자. 아이콘은 차트 색 그대로다.',
    '',
    table(
      ['토큰', '단계', '라이트', '다크'],
      S.names.filter((n) => /^chart-[a-z]+-(weak|subtle|contrast)$/.test(n)).map((n) => [code(n), pair(S, n), code(S.value(n)), code(S.value(`${n}-dark`))]),
    ),
    '',
    '## 타이포그래피',
    '',
    `글꼴은 모두 ${families.map(code).join(', ')} 입니다.`,
    '',
    table(['토큰', '크기', '굵기', '줄 높이', '자간'], typography),
    '',
    '## 라운드',
    '',
    table(['토큰', '값'], Object.entries(shared.rounded ?? {}).map(([k, v]) => [code(k), code(v)])),
    '',
    '## 간격',
    '',
    table(['토큰', '값'], Object.entries(shared.spacing ?? {}).map(([k, v]) => [code(k), code(v)])),
    ...PROSE_GROUPS.flatMap(([prefix, title]) => {
      const rows = [...prose].filter(([name]) => name.startsWith(prefix) && !PROSE_GROUPS.some(([p]) => p !== prefix && p.startsWith(prefix) && name.startsWith(p)));
      return ['', `## ${title}`, '', table(['토큰', '값', '비고'], rows.map(([name, r]) => [code(name), code(r.value), r.note.replace(/\|/g, '\\|')]))];
    }),
  ].join('\n');
}

// ── 실행 ────────────────────────────────────────────────────────

clean(join(DOCS, 'foundations'));
clean(join(DOCS, 'components'));

const design = splitFrontMatter(read('DESIGN.md'));
const sections = new Map(splitSections(design.body).map((s) => [s.heading, s.content]));
for (const f of FOUNDATION_SECTIONS) {
  const content = sections.get(f.heading);
  if (content === undefined) throw new Error(`DESIGN.md 에 "## ${f.heading}" 절이 없다 — FOUNDATION_SECTIONS 를 고쳐라`);
  write(`foundations/${f.slug}.md`, { ...f, source: 'DESIGN.md' }, promoteHeadings(content));
}

for (const f of FOUNDATION_SUBSECTIONS) {
  const parent = sections.get(f.parent);
  if (parent === undefined) throw new Error(`DESIGN.md 에 "## ${f.parent}" 절이 없다`);
  const lines = [...linesWithFence(parent)];
  const start = lines.findIndex(([l, inFence]) => !inFence && l.startsWith(`### ${f.startsWith}`));
  if (start === -1) throw new Error(`DESIGN.md "## ${f.parent}" 에 "### ${f.startsWith}" 가 없다 — FOUNDATION_SUBSECTIONS 를 고쳐라`);
  let end = lines.findIndex(([l, inFence], i) => i > start && !inFence && /^#{2,3} /.test(l));
  if (end === -1) end = lines.length;
  // ### 는 페이지 제목이 되므로 떼고, 그 아래 #### → ## 로 두 단계 올린다
  const body = lines.slice(start + 1, end).map(([l, inFence]) => (inFence ? l : l.replace(/^##(#{2,4}) /, '$1 '))).join('\n').trim();
  write(`foundations/${f.slug}.md`, { title: f.title, description: f.description, source: 'DESIGN.md' }, body);
}

const guides = sections.get('Components');
if (guides === undefined) throw new Error('DESIGN.md 에 "## Components" 절이 없다');
write(
  'components/guides.md',
  { title: '공통 가이드', description: '공유 토큰만 쓰는 컴포넌트 규칙 — DESIGN.md 의 Components 절', source: 'DESIGN.md' },
  promoteHeadings(guides),
);

write(
  'foundations/design-token/reference.md',
  { title: 'Reference', description: '공유 · 브랜드 토큰 전체 목록 — 머리말 토큰과 표 토큰', source: 'DESIGN.md' },
  tokenReference(),
);

// specs/z-index.md 의 층 표 — 토큰 칸(`z-floating` …)의 DESIGN.md 값(v116)이 z-index 칸의 숫자와 같고, DESIGN.md 의 z- 토큰이 빠짐없이 있는지.
// 층 표는 사람이 읽는 사본이라 값이 바뀌면 여기서 멈춘다(v65 토큰이 층 표와 다른 값으로 남아 있던 일이 있었다).
function checkZLayers(text) {
  const tokens = new Map([...proseTokenRows(read('DESIGN.md'))].filter(([n]) => n.startsWith('z-')).map(([n, { value }]) => [n, value]));
  const seen = new Set();
  for (const row of text.split('\n').filter((l) => l.startsWith('| **L'))) {
    // | Layer | 토큰 | z-index | 컴포넌트 | 의미 |
    const [layer = '', tokenCell = '', zCell = ''] = row.split('|').slice(1).map((c) => c.trim());
    const names = [...tokenCell.matchAll(/`(z-[a-z0-9-]+)`/g)].map((m) => m[1]);
    const values = [...zCell.matchAll(/`(-?\d+|auto)`/g)].map((m) => m[1]);
    if (!names.length || names.length !== values.length) throw new Error(`specs/z-index.md ${layer} — 토큰(${names.join(', ')})과 값(${values.join(', ')})이 짝이 안 맞는다`);
    names.forEach((n, i) => {
      if (!tokens.has(n)) throw new Error(`specs/z-index.md ${layer} 의 ${n} 이 DESIGN.md 의 z-index 표에 없다`);
      if (tokens.get(n) !== values[i]) throw new Error(`specs/z-index.md ${layer} 의 ${n} ${values[i]} 가 DESIGN.md 값 ${tokens.get(n)} 과 다르다`);
      seen.add(n);
    });
  }
  const missing = [...tokens.keys()].filter((n) => !seen.has(n));
  if (missing.length) throw new Error(`DESIGN.md 의 z-index 토큰 ${missing.join(', ')} 이 specs/z-index.md 층 표에 없다`);
}

for (const { file, slug } of FOUNDATION_SPECS) {
  const text = read(file);
  if (slug === 'z-index') checkZLayers(text);
  const spec = splitSpec(text);
  write(`foundations/${slug}.md`, { ...spec, source: file }, spec.body);
}

const specDir = join(REPO, 'specs/components');
const tokens = loadTokens(REPO);
for (const name of readdirSync(specDir).filter((n) => n.endsWith('.md')).sort()) {
  const source = `specs/components/${name}`;
  const spec = splitSpec(read(source));
  // 수치 표 자리(`[표: …](<이름>.yaml#…)`)는 YAML 로 그린 표로 바꾼다.
  const withTables = fillSpecTables(addMissingTableHeaders(spec.body), { specDir, tokens, source });
  // 스펙 옆 YAML 로 가는 링크(`[button.yaml](button.yaml)`)는 사이트에 그 페이지가 없다 — GitHub 의 원본 파일로 보낸다.
  const body = withTables.replace(/\]\(([a-z0-9-]+\.yaml)\)/g, `](${REPO_BLOB}/specs/components/$1)`);
  // 그림 자리가 있으면 .mdx — 그림은 site/components/specs/<이름>.tsx 가 그린다
  if (body.split('\n').some((l) => FIGURE.test(l))) write(`components/${name.replace(/\.md$/, '.mdx')}`, { ...spec, source }, toMdx(body, source));
  else write(`components/${name}`, { ...spec, source }, body);
}

console.log(`gen-content: ${generated.length} pages`);
