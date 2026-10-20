// Typography 페이지 — 값은 DESIGN.md typography 블록에서만 온다
import type { CSSProperties } from 'react';
import { color, design, sectionCode, sectionTable, sectionText, typeScale } from '@/lib/design-tokens';
import { Figure, Inline, MARK, MARK_LINE, Table, Token } from './ui';

// "쓰는 곳" · "배수" 는 DESIGN.md v100 표에서 읽는다
function v100Rows() {
  const { rows } = sectionTable('v100 — SEED 타입 스케일');
  return new Map(rows.map((r) => [r[0].replace(/`/g, '').replace(/^text-/, ''), { ratio: r[3], use: r[4] }]));
}

export function TypePreviewFigure() {
  const { semantic } = typeScale();
  const title = semantic.find((s) => s.name === 'screen-title')!;
  const body = semantic.find((s) => s.name === 'article-body')!;
  const note = semantic.find((s) => s.name === 'article-note')!;
  const fg = color('fg-neutral'), muted = color('fg-neutral-muted'), subtle = color('fg-neutral-subtle');
  return (
    <Figure caption="screen-title · article-body · article-note 로 쓴 화면">
      {/* 카드 — 그림자 없이 1px stroke-neutral-weak(card.md) */}
      <div className="w-[340px] rounded-2xl bg-white p-6" style={{ color: fg, border: `1px solid ${color('stroke-neutral-weak')}` }}>
        <div style={{ fontSize: title.fontSize, lineHeight: title.lineHeight, fontWeight: title.fontWeight }}>이번 달 돈 흐름</div>
        <div className="mt-1.5" style={{ fontSize: note.fontSize, lineHeight: note.lineHeight, color: subtle }}>9월 1일 – 9월 29일</div>
        <p className="mt-4" style={{ fontSize: body.fontSize, lineHeight: body.lineHeight, color: muted }}>
          고정 지출이 지난달과 같고, 식비가 조금 줄었어요. 남은 예산은 이번 주말까지 넉넉해요.
        </p>
      </div>
    </Figure>
  );
}

export function TypeScaleTable() {
  const { scale } = typeScale();
  const info = v100Rows();
  return (
    <Table head={['토큰', '크기', '줄 높이', '배수', '견본', '쓰는 곳']} minWidth={760}>
      {scale.map((t) => (
        <tr key={t.name}>
          <td><Token>text-{t.name}</Token></td>
          <td className="tabular-nums">{t.fontSize}</td>
          <td className="tabular-nums">{t.lineHeight}</td>
          <td className="tabular-nums text-fd-muted-foreground">{info.get(t.name)?.ratio ?? '—'}</td>
          <td className="max-w-[360px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: t.fontSize, lineHeight: t.lineHeight }}>
            가나다 Groo 123
          </td>
          <td className="whitespace-nowrap text-fd-muted-foreground"><Inline text={info.get(t.name)?.use ?? '—'} /></td>
        </tr>
      ))}
    </Table>
  );
}

export function WeightFigure() {
  const t5 = typeScale().scale.find((t) => t.name === 't5')!;
  return (
    <Figure caption="굵기 셋 — 토큰은 400 이고, 강조는 font-medium · font-bold 로 준다">
      <div className="flex flex-wrap items-end gap-10 text-fd-foreground">
        {[
          [400, 'Regular'],
          [500, 'Medium'],
          [700, 'Bold'],
        ].map(([w, n]) => (
          <div key={w} className="flex flex-col items-center gap-2">
            <span style={{ fontSize: 32, lineHeight: '42px', fontWeight: w as number }}>가Aa</span>
            <code className="text-[13px]">{w}</code>
            <span className="text-[12px] text-fd-muted-foreground">{n} · t5 는 {t5.fontSize}</span>
          </div>
        ))}
      </div>
    </Figure>
  );
}

export function SemanticStyleTable() {
  const { semantic } = typeScale();
  const USE_S: Record<string, string> = { 'screen-title': '화면 제목', 'article-body': '긴 글 본문', 'article-note': '긴 글 보조 · 날짜 · 출처' };
  return (
    <Table head={['토큰', '크기 / 굵기 / 줄 높이', '견본', '쓰는 곳']} minWidth={680}>
      {semantic.map((t) => (
        <tr key={t.name}>
          <td><Token>text-{t.name}</Token></td>
          <td className="whitespace-nowrap tabular-nums">{t.fontSize} / {t.fontWeight} / {t.lineHeight}</td>
          <td style={{ fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: t.fontWeight }} className="whitespace-nowrap">돈 흐름 한눈에</td>
          <td className="whitespace-nowrap text-fd-muted-foreground">{USE_S[t.name]}</td>
        </tr>
      ))}
    </Table>
  );
}

// DESIGN.md v100 "옛 이름 → 가까운 새 이름" 줄을 그대로 표로
export function LegacyTypeTable() {
  const line = design().body.split('\n').find((l) => l.includes('**옛 이름 → 가까운 새 이름**'));
  if (!line) throw new Error('DESIGN.md v100 에 "옛 이름 → 가까운 새 이름" 줄이 없다');
  const rest = line.replace(/^.*?\*\*옛 이름 → 가까운 새 이름\*\*(\([^)]*\))?:?\s*/, '');
  const [body, ...tail] = rest.split(/\.\s/);
  // 새 이름 칸에도 ' · ' 가 들어가므로(자리마다 t4 · t5 …) 다음 '옛 이름 →' 앞에서만 끊는다
  const pairs = [...body.matchAll(/([a-z]+(?:-[a-z]+)?) → (.+?)(?= · [a-z]+(?:-[a-z]+)? → |$)/g)].map((m) => [m[1], m[2]]);
  const remark = tail.join('. ').replace(/\.\s*$/, '');
  const { legacy } = typeScale();
  const legacyOf = (n: string) => legacy.find((l) => l.name === n);
  return (
    <>
    <Table head={['옛 이름', '크기 / 굵기 / 줄 높이', '옮길 새 이름']} minWidth={560}>
      {pairs.map(([o, n]) => {
        const l = legacyOf(o);
        return (
          <tr key={o}>
            <td><Token>text-{o}</Token></td>
            <td className="whitespace-nowrap tabular-nums text-fd-muted-foreground">{l ? `${l.fontSize} / ${l.fontWeight} / ${l.lineHeight}` : '—'}</td>
            <td>{n}</td>
          </tr>
        );
      })}
    </Table>
    {remark && <p className="text-sm text-fd-muted-foreground">{remark}.</p>}
    </>
  );
}

// 단위 — 웹은 rem(÷16)과 -static(px) 두 벌. 내보내기(build-tailwind-v4)와 같은 계산
const REM_BASE = 16; // 브라우저 기본 글자 크기
const rem = (v: string) => `${Number((parseFloat(v) / REM_BASE).toFixed(4))}rem`;
export function UnitTable() {
  const { scale } = typeScale();
  return (
    <Table head={['토큰', '웹 (rem)', '고정 (-static)', '줄 높이 (rem / px)']} minWidth={620}>
      {scale.map((t) => (
        <tr key={t.name}>
          <td><Token>text-{t.name}</Token> <span className="text-fd-muted-foreground">·</span> <Token>text-{t.name}-static</Token></td>
          <td className="tabular-nums">{rem(t.fontSize)}</td>
          <td className="tabular-nums">{t.fontSize}</td>
          <td className="tabular-nums text-fd-muted-foreground">{t.lineHeight ? `${rem(t.lineHeight)} / ${t.lineHeight}` : '—'}</td>
        </tr>
      ))}
    </Table>
  );
}

// ── 줄바꿈(v114) ─────────────────────────────────────────
// DESIGN.md "v114 — 줄바꿈" 의 CSS 를 그대로 걸어, 지금의 글자 단위(브라우저 기본값)와 나란히 그린다
const LINE_BREAK = 'v114 — 줄바꿈';
function lineBreakCss(): CSSProperties {
  const decl = Object.fromEntries([...sectionCode(LINE_BREAK).matchAll(/([a-z-]+):\s*([a-z-]+);/g)].map((m) => [m[1], m[2]]));
  if (!decl['word-break'] || !decl['overflow-wrap']) throw new Error(`DESIGN.md "${LINE_BREAK}" 의 CSS 에서 word-break · overflow-wrap 을 읽지 못했다`);
  return { wordBreak: decl['word-break'] as CSSProperties['wordBreak'], overflowWrap: decl['overflow-wrap'] as CSSProperties['overflowWrap'] };
}
// 사이트는 v114 규칙을 전체에 건다 — 지금 모습은 기본값으로 되돌려 그린다
const BROWSER_DEFAULT: CSSProperties = { wordBreak: 'normal', overflowWrap: 'normal' };

// 컴포넌트 자리의 실제 글 · 폭(폰 360 기준) — mark 는 글자 단위에서 갈리는 낱말
const BREAK_SAMPLES: { where: string; size: string; weight?: number; width: number; text: string; mark?: string }[] = [
  { where: 'Select Box 설명 · 1열', size: 't3', width: 246, text: 'OT, 경조 휴가 등 휴가를 신청할 수 있는 권한입니다.', mark: '권한입니다.' },
  { where: 'Select Box 설명 · 2열', size: 't3', width: 88, text: '중지할 때까지 계속 반복', mark: '계속' },
  { where: 'Select Box 제목 · 3열', size: 't5', weight: 500, width: 64, text: '최근 3개월', mark: '3개월' },
  { where: 'List 설명', size: 't3', width: 250, text: '내보낸 파일에서 계좌번호 · 카드번호의 가운데 자리를 별표로 바꿔요. 받는 사람이 번호 전체를 보지 못해요', mark: '자리를' },
  { where: 'Checkbox 라벨 · 시트', size: 't4', width: 200, text: '알림을 받을 때 결제 예정 금액도 함께 보여 주기', mark: '함께' },
  { where: '이메일 · 2열', size: 't3', width: 88, text: 'groo.desk@example.com' },
];

function BreakSample({ s, rule }: { s: (typeof BREAK_SAMPLES)[number]; rule: CSSProperties }) {
  const t = typeScale().scale.find((x) => x.name === s.size);
  if (!t) throw new Error(`글자 토큰 ${s.size} 이 없다`);
  const [before, after] = s.mark ? s.text.split(s.mark) : [s.text, ''];
  return (
    <div className="rounded-xl bg-white p-3">
      <div style={{ width: s.width, outline: `1px dashed ${MARK_LINE}`, fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: s.weight ?? 400, color: color(s.weight ? 'fg-neutral' : 'fg-neutral-muted'), ...rule }}>
        {before}
        {s.mark && <mark style={{ background: MARK, color: 'inherit', borderRadius: 3 }}>{s.mark}</mark>}
        {after}
      </div>
    </div>
  );
}

export function LineBreakFigure() {
  const rule = lineBreakCss();
  return (
    // Figure 는 내용 폭(w-max)으로 가로 스크롤한다 — 여기서는 좁은 화면에서 두 칸이 아래로 내려오게 판을 따로 둔다
    <figure className="not-prose my-6">
      <div className="flex flex-col gap-5 rounded-2xl bg-[#E9E9EC] p-5 text-fd-foreground dark:bg-fd-muted sm:p-8">
        {BREAK_SAMPLES.map((s) => (
          <div key={s.where} className="flex flex-col gap-1.5">
            <span className="text-[12px] font-bold">{s.where}</span>
            <div className="flex flex-wrap items-start gap-3">
              {(
                [
                  ['지금 — 글자 단위', BROWSER_DEFAULT],
                  ['단어 단위', rule],
                ] as const
              ).map(([label, css]) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-[11px] text-fd-muted-foreground">{label}</span>
                  <BreakSample s={s} rule={css} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-center text-sm text-fd-muted-foreground">지금(글자 단위)과 v114(단어 단위) — 점선이 글이 쓸 수 있는 폭, 분홍이 글자 단위에서 갈리는 낱말</figcaption>
    </figure>
  );
}

// DESIGN.md v114 의 플랫폼 표를 그대로
export function LineBreakTable() {
  const { head, rows } = sectionTable(LINE_BREAK);
  return (
    <Table head={head} minWidth={640}>
      {rows.map((r) => (
        <tr key={r[0]}>
          {r.map((c, i) => (
            <td key={i} className={i === 0 ? 'whitespace-nowrap font-medium' : undefined}>
              <Inline text={c} />
            </td>
          ))}
        </tr>
      ))}
    </Table>
  );
}

// ── 글자 역할(2026-10-16) ─────────────────────────────────
// DESIGN.desk.md "글자 역할" 표를 그대로 — 값 칸의 " / " 로 나뉜 자리마다 견본을 그 크기 · 굵기 · 색으로 그린다(라이트 · 다크).
// Desk 표를 읽는다 — 공유 DESIGN.md 는 수입 금액 색(fg-brand)을 브랜드 파일로 미룬다
const ROLES = '글자 역할 (2026-10-16)';
// 역할마다 견본 글 — 값이 아니라 그림의 글이다(실제 자리의 말투)
const ROLE_SAMPLE: Record<string, string> = {
  R1: '가계부', R2: '이번 달 모든 거래 내역이에요', R3: '카테고리 고르기', R4: '최근 거래', R5: '자주 쓰는 계좌', R6: '점심 식사',
  R7: '고른 거래 12건을 옮겨요', R8: '지운 거래는 되돌릴 수 없어요', R9: '식비 · 다온은행 · 12:30', R10: '1,200만', R11: '전월 실적 30만 원 이상이면 혜택을 받아요',
  R12: '1,234,567원', R13: '1,482,300원', R14: '▲ 12%', R15: '저장', R16: '전체 보기', R17: '자세히 보기', R18: '금액', R19: '금액을 입력해 주세요',
};
type RoleSpec = { label: string; size: string; weight: number; color: string };
function roleSpecs(cell: string): RoleSpec[] {
  const { scale, semantic } = typeScale();
  const out: RoleSpec[] = [];
  let weight = 400, fg = 'fg-neutral', size = '';
  for (const raw of cell.split(' / ')) {
    const part = raw.trim();
    const sem = /`text-(screen-title|article-body|article-note)`/.exec(part)?.[1];
    const t = /\b(t\d+)(?:-static)?\b/.exec(part)?.[1];
    // 크기가 없는 자리("막힘 `fg-disabled`")는 앞 자리의 크기를 잇는다
    const token = sem ? semantic.find((s) => s.name === sem) : t ? scale.find((s) => s.name === t) : size ? (scale.find((s) => s.name === size) ?? semantic.find((s) => s.name === size)) : undefined;
    if (!token) continue;
    size = token.name;
    const w = /·\s*(400|500|700)\b/.exec(part)?.[1];
    weight = w ? Number(w) : sem ? Number(token.fontWeight ?? 400) : weight;
    fg = /`((?:fg|static)-[a-z-]+)`/.exec(part)?.[1] ?? fg;
    const at = part.search(/`text-|\bt\d+|`fg-|`static-/);
    // 이름표 — 값 앞의 글("데스크톱"), 없으면 크기 바로 뒤 괄호("t8(시트 · 대화상자)")
    const label = (at > 0 ? part.slice(0, at) : /^`?[\w-]+`?\(([^)]*)\)/.exec(part)?.[1] ?? '')
      .replace(/[(（].*$/, '')
      .replace(/\s*\d{3}$/, '')
      .trim();
    out.push({ label, size: token.name, weight, color: fg });
  }
  if (!out.length) throw new Error(`DESIGN.md "${ROLES}" 의 값 칸에서 글자 토큰을 읽지 못했다: ${cell}`);
  return out;
}
// 역할 한 줄의 견본 — 라이트 · 다크 면 위에 자리마다 실제 크기 · 굵기 · 색으로
function RoleSpecimens({ no, cell }: { no: string; cell: string }) {
  const { scale, semantic } = typeScale();
  const tok = (n: string) => scale.find((s) => s.name === n) ?? semantic.find((s) => s.name === n)!;
  const dark = (n: string) => (n === 'static-white' ? color('static-white') : color(`${n}-dark`, 'desk'));
  const surface = { light: color('bg-layer-default', 'desk'), dark: color('bg-layer-default-dark', 'desk') };
  const specs = roleSpecs(cell);
  const brandFill = specs.some((s) => s.color === 'static-white');
  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row">
        {(['light', 'dark'] as const).map((m) => (
          <div key={m} className="flex min-w-0 flex-1 flex-col gap-2 overflow-hidden rounded-lg p-3" style={{ background: surface[m], boxShadow: 'inset 0 0 0 1px rgba(128,128,128,0.2)' }}>
            {specs.map((s, i) => {
              const t = tok(s.size);
              const fg = m === 'light' ? color(s.color, 'desk') : dark(s.color);
              const onFill = s.color === 'static-white';
              return (
                <div key={i} className="flex min-w-0 flex-col">
                  {s.label && no !== 'R14' && <span className="text-[11px] leading-[14px]" style={{ color: m === 'light' ? color('fg-neutral-subtle', 'desk') : dark('fg-neutral-subtle') }}>{s.label}</span>}
                  <span
                    className={no === 'R11' || no === 'R2' ? 'max-w-[240px]' : 'whitespace-nowrap'}
                    style={{ fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: s.weight, color: fg, fontVariantNumeric: no === 'R12' || no === 'R13' || no === 'R14' ? 'tabular-nums' : undefined, textDecoration: no === 'R17' && i === 0 ? 'underline' : undefined, ...(onFill ? { background: color('bg-brand-solid', 'desk'), borderRadius: 8, padding: '0 6px', alignSelf: 'flex-start' } : {}) }}
                  >
                    {no === 'R14' ? (s.label.includes('▼') ? '▼ 3%' : s.label.includes('그대로') ? '변화 없음' : '▲ 12%') : (ROLE_SAMPLE[no] ?? '가나다')}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {brandFill && <span className="mt-1 block text-[12px] text-fd-muted-foreground">흰 글자는 브랜드 채움 위에 그렸다</span>}
    </>
  );
}

// 역할마다 한 덩어리 — 값 · 견본(라이트 · 다크, 폰에서는 위아래) · 쓰는 자리 · 출처. 표로 두면 본문 폭(약 700)에서 견본이 가로 스크롤 뒤에 숨는다
export function RoleTable() {
  const { head, rows } = sectionTable(ROLES, 0, 'desk');
  return (
    <div className="not-prose my-6 flex flex-col gap-3">
      {rows.map((r) => {
        const no = r[0].split(' ')[0];
        return (
          <section key={no} className="flex flex-col gap-2 rounded-xl border border-fd-border p-4 text-sm">
            <h4 className="m-0 text-[15px] font-bold">{r[0]}</h4>
            <div><Inline text={r[1]} /></div>
            <RoleSpecimens no={no} cell={r[1]} />
            <div><span className="text-fd-muted-foreground">{head[2]} — </span><Inline text={r[2]} /></div>
            <div className="text-fd-muted-foreground">{head[3]} — <Inline text={r[3]} /></div>
          </section>
        );
      })}
    </div>
  );
}

// "글자 역할" 절의 규칙 줄(표 아래 목록)을 그대로 — 굵은 머리 글자가 있는 줄만
export function RoleRules() {
  const lines = sectionText(ROLES, 'desk').split('\n').filter((l) => /^- \*\*/.test(l));
  if (!lines.length) throw new Error(`DESIGN.desk.md "${ROLES}" 에 규칙 줄이 없다`);
  return (
    <ul>
      {lines.map((l, i) => (
        <li key={i}><Inline text={l.replace(/^- /, '')} /></li>
      ))}
    </ul>
  );
}
