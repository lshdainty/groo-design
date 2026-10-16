// 기초 페이지 공용 조각 — SEED 문서처럼 회색 판 위에 그림을 두고 아래에 설명을 단다.
import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { color, sectionTable, sectionText } from '@/lib/design-tokens';

export function Figure({ caption, children, tight = false }: { caption?: ReactNode; children: ReactNode; tight?: boolean }) {
  return (
    <figure className="not-prose my-6">
      <div className={`overflow-x-auto rounded-2xl bg-[#E9E9EC] dark:bg-fd-muted ${tight ? 'p-4 sm:p-6' : 'p-5 sm:p-8'}`}>
        <div className="mx-auto flex w-max min-w-full justify-center">{children}</div>
      </div>
      {caption && <figcaption className="mt-3 text-center text-sm text-fd-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

export function Chip({ hex, size = 16 }: { hex: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block shrink-0 rounded-full border border-black/10 dark:border-white/20"
      style={{ width: size, height: size, background: hex }}
    />
  );
}

export function Swatch({ hex }: { hex?: string }) {
  if (!hex) return <span className="text-fd-muted-foreground">—</span>;
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <Chip hex={hex} />
      <code className="text-[13px]">{hex.toUpperCase()}</code>
    </span>
  );
}

export function Token({ children }: { children: ReactNode }) {
  return <code className="whitespace-nowrap rounded bg-fd-secondary px-1.5 py-0.5 text-[13px] text-fd-foreground">{children}</code>;
}

export function Table({ head, children, minWidth }: { head: ReactNode[]; children: ReactNode; minWidth?: number }) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-fd-border">
      <table className="w-full border-collapse text-sm" style={minWidth ? { minWidth } : undefined}>
        <thead>
          <tr className="bg-fd-secondary/60">
            {head.map((h, i) => (
              <th key={i} className="whitespace-nowrap border-b border-fd-border px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_td]:border-b [&_td]:border-fd-border [&_td]:px-4 [&_td]:py-2.5 [&_tr:last-child_td]:border-b-0">{children}</tbody>
      </table>
    </div>
  );
}

// 탭 — SEED Color 의 Overview · Roles · Palette 처럼 한 묶음의 페이지를 오간다
export function SectionTabs({ items, active }: { items: { label: string; href: string }[]; active: string }) {
  return (
    <nav className="not-prose mb-8 flex gap-6 border-b border-fd-border" aria-label="이 묶음의 페이지">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          aria-current={it.label === active ? 'page' : undefined}
          className={`-mb-px border-b-2 pb-2.5 text-[15px] font-medium transition-colors ${
            it.label === active ? 'border-fd-foreground text-fd-foreground' : 'border-transparent text-fd-muted-foreground hover:text-fd-foreground'
          }`}
        >
          {it.label}
        </Link>
      ))}
    </nav>
  );
}

export const COLOR_TABS = [
  { label: 'Overview', href: '/docs/foundations/color' },
  { label: 'Roles', href: '/docs/foundations/color/roles' },
  { label: 'Palette', href: '/docs/foundations/color/palette' },
];

export const FEEDBACK_TABS = [
  { label: 'Overview', href: '/docs/foundations/feedback' },
  { label: 'Color', href: '/docs/foundations/feedback/color' },
  { label: 'Scale', href: '/docs/foundations/feedback/scale' },
];

// 그림 판 — Figure 와 같은 모양이지만 안쪽이 화면 폭을 따라 줄어든다(카드 격자 · 재생 판)
export function Panel({ caption, children }: { caption?: ReactNode; children: ReactNode }) {
  return (
    <figure className="not-prose my-6">
      <div className="rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6">{children}</div>
      {caption && <figcaption className="mt-3 text-center text-sm text-fd-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

// 이렇게 · 이렇게 하지 않는다 — SEED 의 Do · Don't 처럼 그림 아래 색 띠와 한 줄
export function Verdict({ ok, children, note }: { ok: boolean; children: ReactNode; note: string }) {
  const tone = color(ok ? 'fg-positive' : 'fg-critical');
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex flex-1 items-center justify-center rounded-t-xl bg-white p-5">{children}</div>
      <div className="h-1" style={{ background: tone }} />
      <div className="pt-2 text-[13px] leading-5">
        <b style={{ color: tone }}>{ok ? '이렇게' : '이렇게 하지 않는다'}</b>
        <span className="text-fd-muted-foreground"> — {note}</span>
      </div>
    </div>
  );
}

// 인라인 마크다운(`code` · **굵게**) 만 — DESIGN.md 표 칸을 그대로 옮겨 그릴 때
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('`') ? (
          <Token key={i}>{p.slice(1, -1)}</Token>
        ) : (
          p.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((q, j) => (q.startsWith('**') ? <strong key={`${i}-${j}`}>{q.slice(2, -2)}</strong> : <span key={`${i}-${j}`}>{q}</span>))
        ),
      )}
    </>
  );
}

// DESIGN.md 절의 표를 그대로 그린다. 첫 칸만 채워진 줄(**Form / Action** 같은)은 묶음 머리로.
export function SourceTable({ heading, n = 0, minWidth }: { heading: string; n?: number; minWidth?: number }) {
  const { head, rows } = sectionTable(heading, n);
  return (
    <Table head={head.map((h, i) => <Inline key={i} text={h} />)} minWidth={minWidth}>
      {rows.map((r, i) =>
        r.slice(1).every((c) => c === '') ? (
          <tr key={i}>
            <td colSpan={head.length} className="bg-fd-secondary/40 font-bold">
              <Inline text={r[0]} />
            </td>
          </tr>
        ) : (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j}>
                <Inline text={c} />
              </td>
            ))}
          </tr>
        ),
      )}
    </Table>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <div className="not-prose my-6 rounded-xl border border-fd-border bg-fd-card px-5 py-4 text-sm leading-6 text-fd-muted-foreground">{children}</div>;
}

// 그림 안 치수 표시(디자인 도구의 간격 표시처럼 분홍 띠 + 숫자)
export const MARK = 'rgba(236, 72, 153, 0.22)';
export const MARK_LINE = '#DB2777';
export function Measure({ style, label, vertical = false }: { style: CSSProperties; label: string; vertical?: boolean }) {
  return (
    <div className="absolute flex items-center justify-center" style={{ background: MARK, ...style }}>
      {label && (
        <span
          className="rounded px-1 text-[10px] font-bold leading-4 text-white"
          style={{ background: MARK_LINE, writingMode: vertical ? 'vertical-rl' : undefined }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// DESIGN.md 절의 목록(- …) 줄을 그대로 — 표가 아닌 규칙 목록의 수치를 옮겨 적지 않으려고. match 가 있으면 그 글자가 든 줄만
export function SourceList({ heading, match }: { heading: string; match?: string }) {
  const items = sectionText(heading)
    .split('\n')
    .filter((l) => /^- /.test(l))
    .map((l) => l.slice(2))
    .filter((l) => !match || l.includes(match));
  if (!items.length) throw new Error(`"${heading}" 절에 목록 줄이 없다`);
  return (
    <ul className="my-4 flex list-disc flex-col gap-1.5 pl-5 text-[15px] leading-7">
      {items.map((t, i) => (
        <li key={i}><Inline text={t} /></li>
      ))}
    </ul>
  );
}
