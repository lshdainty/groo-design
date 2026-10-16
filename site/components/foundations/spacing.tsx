// Spacing 페이지 — 값은 DESIGN.md spacing 블록에서만 온다
import { color, px, spacingScale } from '@/lib/design-tokens';
import type { ReactNode } from 'react';
import { Figure, MARK_LINE, Measure, Table, Token } from './ui';

const ROLE_TEXT: Record<string, { axis: string; use: string }> = {
  'global-gutter': { axis: '수평', use: '화면 가장자리와 콘텐츠 사이. 모든 화면에서 같게 둔다' },
  'between-chips': { axis: '수평', use: '나란히 놓인 칩 사이' },
  'component-default': { axis: '수직', use: '따로 정한 간격이 없는 컴포넌트 사이' },
  'between-text': { axis: '수직', use: '제목과 설명처럼 붙어 있는 글 요소 사이' },
  'nav-to-title': { axis: '수직', use: '상단 내비게이션과 화면 제목 사이' },
  'screen-bottom': { axis: '수직', use: '화면 맨 아래 여백. 마지막 콘텐츠가 탭바 · 홈 표시줄에 붙지 않게' },
};

function role(name: string) {
  const r = spacingScale().roles.find((x) => x.name === name);
  if (!r) throw new Error(`spacing.${name} 이 DESIGN.md 에 없다`);
  return px(r.value);
}

// 역할 간격 — SEED 처럼 역할 하나씩 작은 화면에 그린다(분홍 띠가 그 간격)
function Mini({ title, value, children }: { title: string; value: number; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-[170px] w-[240px] overflow-hidden rounded-2xl border border-black/10" style={{ background: color('bg-layer-basement'), color: color('fg-neutral') }}>
        {children}
      </div>
      <div className="flex items-baseline gap-2">
        <code className="text-[13px] text-fd-foreground">{title}</code>
        <span className="text-[12px] tabular-nums text-fd-muted-foreground">{value}px</span>
      </div>
    </div>
  );
}

export function SpacingRolesFigure() {
  const g = role('global-gutter'), nav = role('nav-to-title'), comp = role('component-default');
  const chips = role('between-chips'), text = role('between-text'), bottom = role('screen-bottom');
  const surf = color('bg-layer-default'), line = color('stroke-neutral-weak'), weak = color('bg-neutral-weak');
  const muted = color('fg-neutral-muted'), subtle = color('fg-neutral-subtle');
  const cardBox = (top: number, h = 40, left = 16, right = 16) => (
    <div className="absolute rounded-lg" style={{ left, right, top, height: h, background: surf, border: `1px solid ${line}` }} />
  );
  const navBar = <div className="absolute inset-x-0 top-0 flex h-9 items-center justify-center text-[12px] font-bold" style={{ background: surf, borderBottom: `1px solid ${line}` }}>가계부</div>;
  return (
    <Figure caption="역할 간격 여섯 — 분홍 띠가 그 간격입니다">
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        <Mini title="global-gutter" value={g}>
          {navBar}
          <div className="absolute text-[15px] font-bold" style={{ left: g, top: 48 }}>9월 지출</div>
          {cardBox(78, 36, g, g)}
          {cardBox(122, 36, g, g)}
          <Measure style={{ left: 0, width: g, top: 36, bottom: 0 }} label={`${g}`} />
          <Measure style={{ right: 0, width: g, top: 36, bottom: 0 }} label={`${g}`} />
        </Mini>
        <Mini title="nav-to-title" value={nav}>
          {navBar}
          <Measure style={{ left: 16, right: 16, top: 36, height: nav }} label={`${nav}`} />
          <div className="absolute text-[18px] font-bold leading-[24px]" style={{ left: 16, top: 36 + nav }}>9월 지출</div>
          <div className="absolute text-[12px]" style={{ left: 16, top: 36 + nav + 30, color: muted }}>지난달보다 12% 적게 썼어요</div>
        </Mini>
        <Mini title="component-default" value={comp}>
          {cardBox(30)}
          <Measure style={{ left: 16, right: 16, top: 70, height: comp }} label={`${comp}`} />
          {cardBox(70 + comp)}
        </Mini>
        <Mini title="between-chips" value={chips}>
          {['식비', '교통', '쇼핑'].map((c, i) => (
            <div key={c} className="absolute rounded-full text-center text-[12px] font-medium leading-[28px]" style={{ left: 16 + i * (56 + chips), top: 70, width: 56, height: 28, background: weak }}>{c}</div>
          ))}
          <Measure style={{ left: 16 + 56, width: chips, top: 64, height: 40 }} label="" />
          <Measure style={{ left: 16 + 56 * 2 + chips, width: chips, top: 64, height: 40 }} label="" />
          <span className="absolute rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ left: 16 + 56 - 2, top: 108, background: MARK_LINE }}>{chips}</span>
        </Mini>
        <Mini title="between-text" value={text}>
          <div className="absolute text-[16px] font-bold leading-[22px]" style={{ left: 16, top: 56 }}>점심 · 김밥천국</div>
          <Measure style={{ left: 16, width: 180, top: 56 + 22, height: text }} label="" />
          <div className="absolute text-[13px] leading-[18px]" style={{ left: 16, top: 56 + 22 + text, color: subtle }}>식비 · 카드 · 오늘 12:40</div>
          <span className="absolute rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ left: 200, top: 56 + 22 - 5, background: MARK_LINE }}>{text}</span>
        </Mini>
        <Mini title="screen-bottom" value={bottom}>
          {cardBox(170 - bottom - 40 - comp - 40)}
          {cardBox(170 - bottom - 40)}
          <Measure style={{ left: 0, right: 0, bottom: 0, height: bottom }} label={`${bottom}`} />
        </Mini>
      </div>
    </Figure>
  );
}

export function SpacingRoleTable() {
  const { roles, byValue } = spacingScale();
  return (
    <Table head={['토큰', '값', '방향', '쓰는 곳']}>
      {roles.map((r) => (
        <tr key={r.name}>
          <td><Token>spacing-{r.name}</Token></td>
          <td className="whitespace-nowrap">
            {r.value} <span className="text-fd-muted-foreground">· {byValue(r.value) ? <Token>spacing-{byValue(r.value)}</Token> : '—'}</span>
          </td>
          <td className="whitespace-nowrap">{ROLE_TEXT[r.name]?.axis ?? '—'}</td>
          <td>{ROLE_TEXT[r.name]?.use ?? '—'}</td>
        </tr>
      ))}
    </Table>
  );
}

// 눈금 — 막대 길이가 실제 px 이다
export function SpacingScaleFigure() {
  const { scale } = spacingScale();
  return (
    <Figure caption="간격 눈금 — 막대 길이가 실제 크기입니다" tight>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: 'auto auto 64px' }}>
        {scale.map((s) => (
          <div key={s.name} className="contents text-[13px]">
            <code className="pr-3 text-fd-foreground">{s.name}</code>
            <span className="pr-3 text-right tabular-nums text-fd-muted-foreground">{s.value}</span>
            <span className="self-center">
              <span className="block h-3 rounded-sm" style={{ width: px(s.value), background: 'var(--color-fd-primary)' }} />
            </span>
          </div>
        ))}
      </div>
    </Figure>
  );
}

export function SpacingTokenTable() {
  const { scale, alias } = spacingScale();
  const aliasOf = (v: string) => alias.filter((a) => a.value === v).map((a) => a.name);
  return (
    <Table head={['토큰', '값', '옛 이름(별칭)']}>
      {scale.map((s) => (
        <tr key={s.name}>
          <td><Token>spacing-{s.name}</Token></td>
          <td className="tabular-nums">{s.value}</td>
          <td>{aliasOf(s.value).length ? aliasOf(s.value).map((a) => <Token key={a}>spacing-{a}</Token>) : <span className="text-fd-muted-foreground">—</span>}</td>
        </tr>
      ))}
    </Table>
  );
}
