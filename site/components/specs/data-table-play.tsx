'use client';
// Table 의 플레이그라운드와 코드 미리보기 — 고르면 스펙대로 그린 표와 그 코드가 바뀐다(머리를 눌러 정렬 · 체크로 고르기 · ⋮ 메뉴 · 폰 폭은 List 줄).
// 값은 table.yaml 을 푼 TableLook 만 쓴다(data-look). 코드는 table.md 의 "코드" 절과 같은 레시피 API 다.
import { useMemo, useState, type ReactNode } from 'react';
import { REPORTS, HR_USERS, days, hours, type HrUser } from './data-data';
import { CardHeaderView, CardSurface } from './data-card-view';
import { type CardLook, type TableLook, type ViewMode } from './data-shared';
import { TableView, type TCol, type TRow, type TSort } from './data-table-view';
import { dcv } from './display-shared';
import type { RowSpec } from './list-shared';
import { ListView } from './list-view';
import type { MenuGroup, MenuKit } from './menu-shared';
import { NavPlayFrame } from './nav-playground';
import type { OvKit } from './overlay-shared';
import { MODES, Seg } from './select-playground';

const FONT = "'Pretendard Variable', Pretendard, sans-serif";
function Said({ text }: { text: string }) {
  return (
    <span role="status" className="inline-flex min-h-[26px] items-center gap-1.5 rounded-md border border-fd-border bg-fd-card px-2 py-1 text-[12px] leading-4 text-fd-foreground">
      <span className="text-[10px] font-bold text-fd-muted-foreground">읽는 글</span>
      {text || '—'}
    </span>
  );
}
export const userCols = (rich: boolean): TCol[] => [
  { key: 'name', label: '이름', sortable: true },
  { key: 'dept', label: '부서' },
  { key: 'days', label: '남은 휴가', align: 'end', sortable: true },
  { key: 'status', label: '상태' },
];
export const userRowOf = (u: HrUser, rich: boolean): TRow => ({
  id: u.id,
  name: u.name,
  cells: {
    name: rich ? { text: u.name, detail: u.email, avatar: u.name, sortValue: u.name } : { text: u.name, sortValue: u.name },
    dept: rich ? { text: u.dept, detail: u.title } : u.dept,
    days: { text: days(u.days), sortValue: u.days },
    status: { badge: { label: u.status, tone: u.tone } },
  },
});
// 768 미만 — 같은 줄을 List 로(제목 이름 · 설명 "부서 · 상태" · 오른쪽 남은 휴가)
export function userListRows(look: TableLook, users: HrUser[], mode: ViewMode, selectable = false, selected: string[] = []): RowSpec[] {
  const v = look.narrowValue;
  return users.map((u) => ({
    kind: selectable ? 'check' : 'button',
    title: u.name,
    detail: `${u.dept} · ${u.status}`,
    checked: selected.includes(u.id),
    suffixNode: <span style={{ fontFamily: v.fontFamily, fontSize: v.fontSize, lineHeight: v.lineHeight, fontWeight: v.fontWeight, color: dcv(look.cell.fg, mode), fontVariantNumeric: 'tabular-nums' }}>{days(u.days)}</span>,
  }));
}
export const USER_MENU: MenuGroup[] = [{ items: [{ value: 'edit', label: '수정', icon: 'pencil' }] }, { items: [{ value: 'delete', label: '삭제', icon: 'trash', tone: 'critical' }] }];

// 판 — 카드 면(표는 카드 안에 가장자리까지 — card.yaml 의 목록 카드와 같은 머리 · 아래 여백)
function CardBox({ card, mode, title, children, width }: { card: CardLook; mode: ViewMode; title: string; children: ReactNode; width?: number | string }) {
  return (
    <CardSurface look={card} mode={mode} body="list" width={width}>
      <CardHeaderView look={card} mode={mode} title={title} body="list" />
      {children}
    </CardSurface>
  );
}

export function TablePlayground({ look, card, menu }: { look: TableLook; card: CardLook; menu: { kit: MenuKit; ov: OvKit } }) {
  const [rich, setRich] = useState(false);
  const [sort, setSort] = useState<TSort>({ key: 'days', dir: 'descending' });
  const [select, setSelect] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [width, setWidth] = useState<'wide' | 'narrow'>('wide');
  const [sticky, setSticky] = useState(false);
  const [mode, setMode] = useState<ViewMode>('auto');
  const [said, setSaid] = useState('');
  const users = HR_USERS.slice(0, sticky ? 12 : 6);
  const rows = users.map((u) => userRowOf(u, rich));
  const code = useMemo(() => {
    if (width === 'narrow')
      return [
        'import { List, ListButtonItem } from "@/components/ui/list"',
        'import { useTableLayout } from "@/components/ui/table"',
        '',
        'const layout = useTableLayout() // 768 미만 "list"',
        '',
        '<List aria-label="사용자">',
        '  {users.map((u) => (',
        '    <ListButtonItem key={u.id} title={u.name} detail={[u.department, u.statusLabel].join(" · ")}',
        '      suffix={<span className="tabular-nums">{formatDays(u.remainingDays)}</span>} onClick={() => openUser(u.id)} />',
        '  ))}',
        '</List>',
      ].join('\n');
    const head = (k: string, label: string, end = false) => `      <TableHead${end ? ' align="end"' : ''} sort={sortBy === "${k}" ? dir : "none"} onSortChange={(d) => sort("${k}", d)}>${label}</TableHead>`;
    return [
      'import { Table, TableBody, TableCell, TableHead, TableHeader, TableMoreCell, TableMoreHead, TableRow, TableRowHeader } from "@/components/ui/table"',
      '',
      ...(select ? ['<TableBulkBar count={selected.size} onClear={clearSelection}>…</TableBulkBar>'] : []),
      `<Table caption="사용자"${rich ? ' rowHeight="rich"' : ''}${sticky ? ' stickyHeader className="max-h-[320px]"' : ''}>`,
      '  <TableHeader>',
      '    <TableRow>',
      ...(select ? ['      <TableSelectHead checked={allChecked ? true : someChecked ? "indeterminate" : false} onCheckedChange={toggleAll} />'] : []),
      head('name', '이름'),
      '      <TableHead>부서</TableHead>',
      head('days', '남은 휴가', true),
      '      <TableHead>상태</TableHead>',
      '      <TableMoreHead />',
      '    </TableRow>',
      '  </TableHeader>',
      '  <TableBody>…</TableBody>',
      '</Table>',
    ].join('\n');
  }, [width, rich, select, sticky]);
  const surface = dcv(card.floor, mode);
  return (
    <NavPlayFrame
      surface={surface}
      wide={width === 'wide'}
      stage={
        <div className="flex flex-col items-center gap-4" style={{ fontFamily: FONT }}>
          {width === 'wide' ? (
            <div className="w-full overflow-x-auto">
              <CardBox card={card} mode={mode} title="사용자 12명">
                <TableView
                  look={look}
                  mode={mode}
                  caption="사용자"
                  columns={userCols(rich)}
                  rows={rows}
                  rowKind={rich ? 'rich' : 'text'}
                  sort={sort}
                  onSortChange={setSort}
                  selectable={select}
                  selected={selected}
                  onSelectedChange={(ids) => (setSelected(ids), setSaid(ids.length ? `${ids.length}개 선택됨` : '고른 것을 모두 풀었어요.'))}
                  bulkActions={[{ label: '내보내기', onClick: () => setSaid('내보내기') }, { label: '삭제', tone: 'critical', onClick: () => setSaid('삭제 — 확인 창을 연다') }]}
                  more
                  menu={{ ...menu, groups: USER_MENU }}
                  onMenuAction={(r, v) => setSaid(`${r.name} ${v === 'edit' ? '수정' : '삭제'}`)}
                  pressable
                  onRowClick={(r) => setSaid(`${r.name} 상세를 열어요.`)}
                  live
                  stickyHeader={sticky}
                  maxHeight={sticky ? look.head.minH + look.row.minH[rich ? 'rich' : 'text'] * 5 : undefined}
                  minWidth={560}
                />
              </CardBox>
            </div>
          ) : (
            // 768 미만 — 같은 줄을 머리 없는 목록 카드에(위아래 12 — 줄의 12 와 합쳐 보이는 24, card.md)
            <div style={{ width: '100%', maxWidth: 360 }}>
              <CardSurface look={card} mode={mode} body="list" style={{ paddingTop: card.list.padBottom }}>
                <ListView look={look.list} rows={userListRows(look, users, mode, select, selected)} mode={mode} live bgRadius={card.list.itemRadius} ariaLabel="사용자" />
              </CardSurface>
            </div>
          )}
          <Said text={said} />
        </div>
      }
      note={`머리를 누를 때마다 내림 ↔ 오름(두 단계 — 숫자 열은 처음 내림, 글 열은 오름). 고른 줄은 바탕 없이 체크로만, 고른 줄이 있으면 일괄 작업 바. ${look.breakpoint} 미만은 같은 줄을 List 로.`}
      controls={
        <>
          <Seg label="줄 종류" value={rich ? 'rich' : 'text'} options={[['text', `한 줄 ${look.row.minH.text}`], ['rich', `썸네일 · 두 줄 ${look.row.minH.rich}`]]} onChange={(v) => setRich(v === 'rich')} />
          <Seg label="정렬" value={sort ? `${sort.key}:${sort.dir}` : 'none'} options={[['name:ascending', '이름 ↑'], ['name:descending', '이름 ↓'], ['days:descending', '남은 휴가 ↓'], ['days:ascending', '남은 휴가 ↑']]} onChange={(v) => { const [k, d] = v.split(':'); setSort({ key: k, dir: d as 'ascending' | 'descending' }); }} />
          <Seg label="고르기" value={select ? 'on' : 'off'} options={[['off', '없음'], ['on', '첫 열 체크 · 일괄 작업 바']]} onChange={(v) => (setSelect(v === 'on'), setSelected([]))} />
          <Seg label="머리 고정" value={sticky ? 'on' : 'off'} options={[['off', '없음'], ['on', '상자 안 스크롤(12줄)']]} onChange={(v) => setSticky(v === 'on')} />
          <Seg label="폭" value={width} options={[['wide', `${look.breakpoint} 이상 — 표`], ['narrow', `${look.breakpoint} 미만 — List 줄`]]} onChange={(v) => setWidth(v as 'wide' | 'narrow')} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
        </>
      }
      code={code}
    />
  );
}

// ── 코드 미리보기 — table.md 의 코드 그대로 ─────────────────
export function ExBasicDemo({ look, card, menu }: { look: TableLook; card: CardLook; menu: { kit: MenuKit; ov: OvKit } }) {
  const [said, setSaid] = useState('');
  const [sort, setSort] = useState<TSort>({ key: 'days', dir: 'descending' });
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full overflow-x-auto">
        <CardBox card={card} mode="auto" title="사용자">
          <TableView look={look} caption="사용자" columns={userCols(false)} rows={HR_USERS.slice(0, 5).map((u) => userRowOf(u, false))} sort={sort} onSortChange={setSort} more menu={{ ...menu, groups: USER_MENU }} onMenuAction={(r, v) => setSaid(`${r.name} ${v === 'edit' ? '수정' : '삭제'}`)} pressable onRowClick={(r) => setSaid(`${r.name} 상세를 열어요.`)} live minWidth={560} />
        </CardBox>
      </div>
      <Said text={said} />
    </div>
  );
}
export function ExSelectDemo({ look, card }: { look: TableLook; card: CardLook }) {
  const [said, setSaid] = useState('');
  const cols: TCol[] = [
    { key: 'title', label: '제목' },
    { key: 'author', label: '작성자' },
    { key: 'date', label: '제출일', sortable: true, first: 'descending' },
    { key: 'hours', label: '시간', align: 'end' },
    { key: 'status', label: '상태' },
  ];
  const rows: TRow[] = REPORTS.map((r) => ({ id: r.id, name: r.title, cells: { title: r.title, author: r.author, date: { text: r.date, sortValue: r.date }, hours: { text: hours(r.hours), sortValue: r.hours }, status: { badge: { label: r.status, tone: r.tone } } } }));
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full overflow-x-auto">
        <CardBox card={card} mode="auto" title="업무 보고">
          <TableView look={look} caption="업무 보고" columns={cols} rows={rows} defaultSort={{ key: 'date', dir: 'descending' }} selectable defaultSelected={['r1', 'r3']} onSelectedChange={(ids) => setSaid(ids.length ? `${ids.length}개 선택됨` : '고른 것을 모두 풀었어요.')} bulkActions={[{ label: '내보내기', onClick: () => setSaid('내보내기') }, { label: '삭제', tone: 'critical', onClick: () => setSaid('삭제 — 확인 창을 연다') }]} live minWidth={600} />
        </CardBox>
      </div>
      <Said text={said} />
    </div>
  );
}
export function ExNarrowDemo({ look, card }: { look: TableLook; card: CardLook }) {
  const [said, setSaid] = useState('');
  return (
    <div className="flex flex-col items-center gap-3">
      {/* 머리 없는 목록 카드 — 카드 면(1px stroke-neutral-weak · 모서리 16) · 위아래 12(줄의 12 와 합쳐 보이는 24, card.md) */}
      <div style={{ width: '100%', maxWidth: 360 }} onClick={(e) => { const t = (e.target as HTMLElement).closest('[role="button"]'); if (t) setSaid(`${t.textContent?.split('개발팀')[0] ?? ''} 상세를 열어요.`); }}>
        <CardSurface look={card} body="list" style={{ paddingTop: card.list.padBottom }}>
          <ListView look={look.list} rows={userListRows(look, HR_USERS.slice(0, 5), 'auto')} live bgRadius={card.list.itemRadius} ariaLabel="사용자" />
        </CardSurface>
      </div>
      <Said text={said} />
    </div>
  );
}
export function ExStatusDemo({ look, card }: { look: TableLook; card: CardLook }) {
  const [kind, setKind] = useState<'loading' | 'empty' | 'failure'>('loading');
  const [said, setSaid] = useState('');
  const status = kind === 'loading' ? { kind: 'loading' as const, rows: 5 } : kind === 'empty' ? { kind: 'empty' as const, icon: 'search-x' as const, title: '조건에 맞는 사용자가 없어요', action: '필터 초기화', onAction: () => setSaid('필터를 초기화했어요.') } : { kind: 'failure' as const, title: '사용자를 불러오지 못했어요', description: '잠시 뒤 다시 시도해주세요.', action: '다시 시도', onAction: () => (setKind('loading'), setSaid('다시 불러오는 중이에요.')) };
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-1">
        {(['loading', 'empty', 'failure'] as const).map((k) => (
          <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={`rounded-md border px-2.5 py-1 text-[12px] ${kind === k ? 'border-fd-foreground bg-fd-foreground text-fd-background' : 'border-fd-border bg-fd-background text-fd-foreground'}`}>
            {k === 'loading' ? '불러오는 동안' : k === 'empty' ? '비었음' : '실패'}
          </button>
        ))}
      </div>
      <div className="w-full overflow-x-auto">
        <CardBox card={card} mode="auto" title="사용자">
          <TableView look={look} caption="사용자" columns={userCols(false)} rows={[]} status={status} live minWidth={560} />
        </CardBox>
      </div>
      <Said text={said} />
    </div>
  );
}
