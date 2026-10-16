'use client';
// 쪽 넘김 · 표 넘김의 플레이그라운드 — 속성을 고르면 스펙대로 그린 줄과 그 코드가 바뀐다(실제로 넘긴다).
// 값은 nav-look 이 YAML 에서 푼 것만 쓴다. 코드는 pagination.md · table-pagination.md 의 "코드" 절과 같은 레시피 API 다.
import { useMemo, useState } from 'react';
import { BENEFITS, HR_USERS } from './nav-data';
import { comma, FONT, ncv, tablePages, tableRange, type NColor, type NavTone, type PaginationLook, type TablePaginationLook, type ViewMode } from './nav-shared';
import { NavPlayFrame } from './nav-playground';
import { PaginationView, TablePaginationView } from './nav-page-view';
import { MODES, Seg } from './select-playground';
import type { CardFace } from './card-face';
import type { TableLook } from './data-shared';
import { TableView, type TCol, type TRow } from './data-table-view';

type Tones = Record<NavTone, NColor>;
const tc = (t: Tones, n: NavTone, mode: ViewMode) => ncv(t[n], mode);
const surfaceOf = (t: Tones, mode: ViewMode) => (mode === 'auto' ? `var(--p-${t['bg-layer-basement'].name})` : t['bg-layer-basement'][mode]);

// 보조 기술이 읽는 글(그림 — 숨은 상태 글을 보이게)
function Said({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-fd-border bg-fd-card px-2 py-1 text-[12px] leading-4 text-fd-foreground">
      <span className="text-[10px] font-bold text-fd-muted-foreground">읽는 글</span>
      {text || '—'}
    </span>
  );
}

// ══ Pagination ═════════════════════════════════════════════
const TOTALS = [1, 5, 8, 12, 30, 120] as const;
export function PaginationPlayground({ look, tones, card }: { look: PaginationLook; tones: Tones; card: CardFace }) {
  const [total, setTotal] = useState<(typeof TOTALS)[number]>(12);
  const [page, setPage] = useState(5);
  const [width, setWidth] = useState<'regular' | 'narrow'>('regular');
  const [links, setLinks] = useState<'links' | 'buttons'>('links');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [said, setSaid] = useState('');
  const slots = look.slots[width];
  const p = Math.min(page, total);
  const rows = BENEFITS.slice(((p - 1) * 3) % BENEFITS.length, ((p - 1) * 3) % BENEFITS.length + 3);
  const code = useMemo(
    () =>
      links === 'links'
        ? [
            'import { useSearchParams } from "react-router-dom"',
            'import { Pagination } from "@/components/ui/pagination"',
            '',
            'const [params] = useSearchParams()',
            'const page = Number(params.get("page") ?? 1)',
            '',
            '<section ref={listRef} aria-labelledby="card-list-title">…</section>',
            '{/* 칸은 링크 — 쪽마다 방문 기록이 쌓여 뒤로 가기가 앞 쪽으로 온다 */}',
            `<Pagination totalPages={${total}} page={page} getHref={(p) => \`?page=\${p}\`} scrollTarget={listRef} aria-label="카드 혜택 페이지 탐색" />`,
          ].join('\n')
        : [
            'import { Pagination } from "@/components/ui/pagination"',
            '',
            '{/* 주소가 없는 자리(대화상자 · 시트 안 목록) — 칸은 버튼 */}',
            `<Pagination totalPages={${total}} page={page} onPageChange={(p) => setPage(p)} scrollTarget={listRef} aria-label="카드 혜택 페이지 탐색" />`,
          ].join('\n'),
    [links, total],
  );
  return (
    <NavPlayFrame
      surface={surfaceOf(tones, mode)}
      wide={width === 'regular'}
      stage={
        <div className="flex flex-col items-center gap-4">
          {/* 카드 — card.yaml 의 면(흰 면 + 1px 테두리 · 모서리 16 · 좌우 24). 머리 없는 목록 카드라 위아래 12 */}
          <div style={{ boxSizing: 'border-box', width: '100%', maxWidth: width === 'regular' ? 520 : 360, borderRadius: card.radius, borderWidth: card.borderW, borderStyle: 'solid', borderColor: tc(tones, 'stroke-neutral-weak', mode), background: tc(tones, 'bg-layer-default', mode), paddingTop: card.listBottom, paddingBottom: card.listBottom, paddingLeft: card.pad, paddingRight: card.pad, fontFamily: FONT }}>
            {rows.map(([n, b]) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', columnGap: 12, minHeight: 56, boxShadow: `inset 0 -1px 0 ${tc(tones, 'stroke-neutral-subtle', mode)}` }}>
                <span aria-hidden style={{ width: 52, height: 33, borderRadius: 4, background: tc(tones, 'bg-neutral-weak', mode), flexShrink: 0 }} />
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 15, fontWeight: 500, color: tc(tones, 'fg-neutral', mode) }}>{n}</span>
                  <span style={{ fontSize: 13, color: tc(tones, 'fg-neutral-subtle', mode) }}>{b}</span>
                </span>
              </div>
            ))}
          </div>
          {total <= 1 ? (
            <span className="text-[12px] text-fd-muted-foreground">1쪽 이하면 넘김 줄을 그리지 않는다</span>
          ) : (
            <PaginationView look={look} mode={mode} page={p} total={total} slots={slots} live links={links === 'links'} ariaLabel="카드 혜택 페이지 탐색" onChange={(n) => { setPage(n); setSaid(`${n}페이지, 전체 ${total}페이지`); }} />
          )}
          <Said text={said} />
        </div>
      }
      note={`칸 자리는 그대로이고 생략(…)만 옮겨 간다 — ${slots}칸(화살표 포함). 첫 · 마지막 쪽에서는 화살표 자리가 빈 칸이고, 키보드로 끝 쪽에 닿으면 초점이 지금 쪽 번호로 옮겨 간다.`}
      controls={
        <>
          <Seg label="전체 쪽 수" value={String(total)} options={TOTALS.map((t) => [String(t), `${t}쪽`] as const)} onChange={(v) => setTotal(Number(v) as (typeof TOTALS)[number])} />
          <Seg label="화면 폭" value={width} options={[['regular', `${look.slots.breakpoint} 이상 — ${look.slots.regular}칸`], ['narrow', `${look.slots.breakpoint} 미만 — ${look.slots.narrow}칸`]]} onChange={setWidth} />
          <Seg label="지금 쪽" value={String(p)} options={[['1', '첫 쪽'], ['4', '4'], ['5', '5'], [String(Math.max(1, total - 2)), `${Math.max(1, total - 2)}`], [String(total), '마지막']].filter((o, i, a) => a.findIndex((x) => x[0] === o[0]) === i) as [string, string][]} onChange={(v) => setPage(Number(v))} />
          <Seg label="칸" value={links} options={[['links', '링크 — 쪽이 주소에'], ['buttons', '버튼 — 주소가 없는 자리']]} onChange={setLinks} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
        </>
      }
      code={code}
    />
  );
}

// ══ Table Pagination ═══════════════════════════════════════
type TotalKind = 'known' | 'unknown' | 'empty';
// 표 — 이름(첫 열) · 부서 · 상태(배지) · 번호(숫자 — 오른쪽). 넘기면 번호가 범위대로 바뀐다
const PG_COLS: TCol[] = [
  { key: 'name', label: '이름' },
  { key: 'dept', label: '부서' },
  { key: 'status', label: '상태' },
  { key: 'n', label: '번호', align: 'end' },
];
const pgRow = (n: number): TRow => {
  const u = HR_USERS[(n - 1) % HR_USERS.length];
  return { id: `u${n}`, name: u[0], cells: { name: u[0], dept: u[1], status: { badge: { label: u[3], tone: u[3] === '휴직' ? 'warning' : 'positive' } }, n: String(n) } };
};
export function TablePaginationPlayground({ look, tones, table, card }: { look: TablePaginationLook; tones: Tones; table: TableLook; card: CardFace }) {
  const [kind, setKind] = useState<TotalKind>('known');
  const [pageSize, setPageSize] = useState(look.options[0]);
  const [page, setPage] = useState(2);
  const [mode, setMode] = useState<ViewMode>('auto');
  const [said, setSaid] = useState('');
  const total = kind === 'known' ? 237 : kind === 'empty' ? 0 : undefined;
  const pages = total === undefined ? 30 : tablePages(total, pageSize);
  const p = total === 0 ? 1 : Math.min(page, pages);
  const { from, to } = tableRange(p, pageSize, total);
  const shown = total === 0 ? [] : Array.from({ length: Math.min(4, to - from + 1) }, (_, i) => from + i);
  const code = useMemo(
    () =>
      total === undefined
        ? [
            'import { TablePagination } from "@/components/ui/table-pagination"',
            '',
            '{/* 전체 수를 모른다 — 범위는 글로만, 다음이 있는지만 안다 */}',
            '<div className="overflow-x-auto">',
            '  <Table ref={tableRef}>…</Table>',
            '  <TablePagination',
            '    hasPreviousPage={page > 1}',
            '    hasNextPage={hasNextPage}',
            '    currentPageItemCount={rows.length}',
            `    value={{ page, pageSize }}`,
            '    onValueChange={(v) => { setPage(v.page); setPageSize(v.pageSize) }}',
            '    scrollTarget={tableRef}',
            '  />',
            '</div>',
          ].join('\n')
        : [
            'import { TablePagination } from "@/components/ui/table-pagination"',
            '',
            '<div className="overflow-x-auto">',
            '  <Table ref={tableRef}>…</Table>',
            '  <TablePagination',
            `    totalItems={users.length}`,
            '    value={{ page, pageSize }}',
            '    onValueChange={(v) => { setPage(v.page); setPageSize(v.pageSize) }}',
            '    scrollTarget={tableRef}',
            '  />',
            '</div>',
          ].join('\n'),
    [total],
  );
  return (
    <NavPlayFrame
      surface={surfaceOf(tones, mode)}
      wide
      stage={
        <div className="flex flex-col gap-3" style={{ fontFamily: FONT }}>
          {/* 표 카드 — card.yaml 면 + 머리(표 이름). 표(table.yaml)와 넘김 줄은 같은 가로 스크롤 상자 안, 줄은 표 아래 12 · 좌우 24 */}
          <div style={{ boxSizing: 'border-box', overflow: 'hidden', borderRadius: card.radius, borderWidth: card.borderW, borderStyle: 'solid', borderColor: tc(tones, 'stroke-neutral-weak', mode), background: tc(tones, 'bg-layer-default', mode), paddingBottom: card.listBottom }}>
            <div style={{ paddingTop: card.head.top, paddingRight: card.head.x, paddingBottom: card.head.bottom, paddingLeft: card.head.x, fontFamily: card.title.fontFamily, fontSize: card.title.fontSize, lineHeight: card.title.lineHeight, fontWeight: card.title.fontWeight, color: tc(tones, 'fg-neutral', mode) }}>사용자</div>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: 520 }}>
                <TableView look={table} mode={mode} caption="사용자" columns={PG_COLS} rows={shown.map(pgRow)} status={shown.length === 0 ? { kind: 'empty', title: '사용자가 없어요' } : undefined} />
                {shown.length > 0 && to - from + 1 > shown.length && <div style={{ height: 28, paddingLeft: table.edge, fontSize: 12, lineHeight: '28px', color: tc(tones, 'fg-neutral-subtle', mode) }}>… {to - from + 1 - shown.length}줄 더(그림에서 줄였다)</div>}
                <div style={{ marginTop: look.marginTop, paddingLeft: table.edge, paddingRight: table.edge }}>
                  <TablePaginationView
                    look={look}
                    mode={mode}
                    total={total}
                    hasNext={p < pages}
                    page={p}
                    pageSize={pageSize}
                    live
                    onChange={(v, reason) => {
                      setPageSize(v.pageSize);
                      setPage(v.page);
                      const r = tableRange(v.page, v.pageSize, total);
                      setSaid(`${r.from}-${r.to}${total !== undefined ? `, 총 ${comma(total)}개` : ''}${reason === 'page-size' ? ' — 첫 범위로' : ''}`);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Said text={said} />
          </div>
        </div>
      }
      note={`줄 수를 바꾸면 첫 범위로 돌아가고, 마지막 범위에서는 다음이 막힌다(막혀도 초점은 남는다). 범위 목록은 최대 ${look.range.maxH} 로 열린다.`}
      controls={
        <>
          <Seg label="전체 수" value={kind} options={[['known', '앎 — 237개'], ['unknown', '모름 — 글만'], ['empty', '0개 — 빈 표']]} onChange={(v) => { setKind(v); setPage(1); }} />
          <Seg label="줄 수" value={String(pageSize)} options={look.options.map((n) => [String(n), `${n}개`] as const)} onChange={(v) => { setPageSize(Number(v)); setPage(1); }} />
          <Seg label="지금 범위" value={String(p)} options={[['1', '첫 범위'], ['2', '둘째'], [String(pages), '마지막']].filter((o, i, a) => a.findIndex((x) => x[0] === o[0]) === i) as [string, string][]} onChange={(v) => setPage(Number(v))} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
        </>
      }
      code={code}
    />
  );
}
