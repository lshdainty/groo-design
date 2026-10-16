'use client';
// 스펙대로 그린 Table — TableLook(table.yaml 을 푼 값)만 받아 그린다. 진짜 <table> · <caption> · <th scope> · aria-sort 로 짠다.
// live 면 머리를 눌러 정렬하고(두 단계 — 내림 ↔ 오름), 체크로 고르고(일괄 작업 바), ⋮ 로 메뉴를 연다. state 를 주면 그 상태로 멈춘 그림이다.
// 줄 높이는 칸 안 상자의 최소 높이로 맞춘다 — 머리 41(10 + 20 + 10 + 선 1) · 줄 45(12 + 20 + 12 + 선 1) · 썸네일 줄 72.
// 인라인 스타일은 단축 속성(padding)과 개별 속성을 섞지 않는다(PR #154).
import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { ButtonView } from './button-view';
import { CheckboxView } from './checkbox-view';
import { nextSort, type SortDir, type TableLook, type TableRowKind, type TableState, type ViewMode } from './data-shared';
import { srOnly, unsigned } from './data-card-view';
import { AvatarView, BadgeView } from './display-view';
import { dcv } from './display-shared';
import { ResultSectionView } from './feedback-view';
import type { FbIcon } from './feedback-shared';
import { LogoTileView, type LogoPaint } from './image-view';
import { SkeletonView } from './loading-view';
import { KebabTrigger, ResponsiveMenu } from './menu-demos';
import type { MenuGroup, MenuKit } from './menu-shared';
import type { OvKit } from './overlay-shared';

// ── 데이터 ─────────────────────────────────────────────────
export type TBadge = { label: string; tone: 'positive' | 'warning' | 'neutral' | 'critical' | 'informative' };
// 칸 하나 — 글 · 둘째 줄 · 상태 배지 · 앞 그림(사람 · 기관) · 증감(▲ · ▼ + 값)
export type TCell = {
  text?: string;
  detail?: string;
  badge?: TBadge;
  avatar?: string;
  logo?: { name: string; paint: LogoPaint };
  delta?: { dir: 'up' | 'down' | 'flat'; value: string };
  sortValue?: number | string;
  // 그림 — 칸에 직접 그린 것(나쁜 예의 아이콘 묶음처럼)
  node?: ReactNode;
};
export type TCol = {
  key: string;
  label: string;
  align?: 'start' | 'end';
  sortable?: boolean;
  // 그 열을 처음 누를 때의 방향 — 기본은 숫자(end) 내림 · 글 오름. 날짜 열은 descending
  first?: SortDir;
  width?: number | string;
};
export type TRow = { id: string; name: string; cells: Record<string, TCell | string> };
export type TSort = { key: string; dir: SortDir } | null;
export type TablePart = 'root' | 'headerRow' | 'headerCell' | 'sortIcon' | 'row' | 'cell' | 'detail' | 'badge' | 'more' | 'checkbox' | 'bulk' | 'caption';
export type TableMarks = Partial<Record<TablePart, CSSProperties>>;
export type TablePins = Partial<Record<TablePart, ReactNode>>;

const cellOf = (c: TCell | string | undefined): TCell => (typeof c === 'string' ? { text: c } : (c ?? {}));
const firstDir = (col: TCol): SortDir => col.first ?? (col.align === 'end' ? 'descending' : 'ascending');

// ── 정렬 표시 ↑↓ — 두 화살표를 따로 칠한다(지금 방향만 짙게) ──
export function SortIcon({ look, mode = 'auto', dir, style }: { look: TableLook; mode?: ViewMode; dir: SortDir | 'none'; style?: CSSProperties }) {
  const s = look.sort;
  const up = dcv(dir === 'ascending' ? s.strong : s.muted, mode);
  const down = dcv(dir === 'descending' ? s.strong : s.muted, mode);
  return (
    <svg aria-hidden width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
      <path d="m3 8 4-4 4 4" stroke={up} />
      <path d="M7 4v16" stroke={up} />
      <path d="m21 16-4 4-4-4" stroke={down} />
      <path d="M17 20V4" stroke={down} />
    </svg>
  );
}

// ── 일괄 작업 바 ───────────────────────────────────────────
// 바 안 동작은 모두 ghost neutral — 지우기의 빨강은 누른 뒤의 확인창에서(table.yaml bulkBar.actions, 2026-10-17 01T-033 A)
export type BulkAction = { label: string; onClick?: () => void };
export function TableBulkBarView({ look, mode = 'auto', count, actions, onClear, live = false, marks, pins }: { look: TableLook; mode?: ViewMode; count: number; actions: BulkAction[]; onClear?: () => void; live?: boolean; marks?: TableMarks; pins?: TablePins }) {
  const b = look.bulk;
  if (count <= 0) return null;
  return (
    <div
      role="region"
      aria-label="선택한 항목"
      style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: b.gap, minHeight: b.minH, boxSizing: 'border-box', paddingLeft: b.padL, paddingRight: b.padR, borderRadius: b.radius, background: dcv(b.bg, mode), marginBottom: b.marginBottom, ...marks?.bulk }}
    >
      {pins?.bulk}
      {/* 고른 수는 표가 늘 두는 숨긴 status 가 알린다 — 바가 나타나는 첫 선택도 읽힌다(table.md WCAG 4.1.3) */}
      <span style={{ fontFamily: b.text.fontFamily, fontSize: b.text.fontSize, lineHeight: b.text.lineHeight, fontWeight: b.text.fontWeight, color: dcv(b.fg, mode), whiteSpace: 'nowrap' }}>
        {count}개 선택됨
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: b.gap }}>
        {actions.map((a) => (
          <ButtonView key={a.label} look={b.action} mode={mode} label={a.label} state={live ? 'live' : 'enabled'} onClick={a.onClick} />
        ))}
        <ButtonView look={b.clear} mode={mode} icon="x" ariaLabel="선택 해제" state={live ? 'live' : 'enabled'} onClick={onClear} />
      </span>
    </div>
  );
}

// ── 칸 안 ──────────────────────────────────────────────────
function CellContent({ look, mode, cell, zone }: { look: TableLook; mode: ViewMode; cell: TCell; zone?: { detail?: CSSProperties; badge?: CSSProperties; pinBadge?: ReactNode; pinDetail?: ReactNode } }) {
  const d = look.detail;
  if (cell.node) return <>{cell.node}</>;
  if (cell.badge)
    return (
      <span style={{ position: 'relative', display: 'inline-flex', ...zone?.badge }}>
        {zone?.pinBadge}
        <BadgeView look={look.badge} mode={mode} variant="weak" tone={cell.badge.tone} size="medium">
          {cell.badge.label}
        </BadgeView>
      </span>
    );
  if (cell.delta)
    return (
      <span style={{ color: dcv(look.delta[cell.delta.dir], mode), fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
        <span aria-hidden>{cell.delta.dir === 'flat' ? unsigned(cell.delta.value) : `${cell.delta.dir === 'up' ? '▲' : '▼'} ${unsigned(cell.delta.value)}`}</span>
        <span style={srOnly}>{cell.delta.dir === 'flat' ? `${unsigned(cell.delta.value)} 그대로` : `${unsigned(cell.delta.value)} ${cell.delta.dir === 'up' ? '올랐어요' : '내렸어요'}`}</span>
      </span>
    );
  const media = cell.avatar ? (
    <AvatarView look={look.avatar} mode={mode} size={look.thumb.avatar} name={cell.avatar} />
  ) : cell.logo ? (
    <LogoTileView look={look.logo} frame={look.frame} mode={mode} size={look.thumb.logo} name={cell.logo.name} paint={cell.logo.paint} />
  ) : null;
  const text = (
    <span style={{ display: 'flex', minWidth: 0, flexDirection: 'column', gap: d.gap }}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cell.text}</span>
      {cell.detail && (
        <span style={{ position: 'relative', fontFamily: d.type.fontFamily, fontSize: d.type.fontSize, lineHeight: d.type.lineHeight, fontWeight: d.type.fontWeight, color: dcv(d.fg, mode), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...zone?.detail }}>
          {zone?.pinDetail}
          {cell.detail}
        </span>
      )}
    </span>
  );
  if (!media) return text;
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: look.thumb.gap, minWidth: 0 }}>
      {media}
      {text}
    </span>
  );
}

// ── 표 ─────────────────────────────────────────────────────
export type TableViewProps = {
  look: TableLook;
  mode?: ViewMode;
  caption: string;
  columns: TCol[];
  rows: TRow[];
  rowKind?: TableRowKind;
  // 정렬 — 밖에서 쥐거나(sort) 표가 스스로 쥔다(defaultSort)
  sort?: TSort;
  defaultSort?: TSort;
  onSortChange?: (s: TSort) => void;
  // 고르기 — 첫 열 체크. selected 를 주면 그대로, 아니면 표가 스스로 쥔다
  selectable?: boolean;
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  bulkActions?: BulkAction[];
  // 줄 끝 ⋮ — live 면 1280 이상 Menu · 미만 Menu Sheet
  more?: boolean;
  menu?: { kit: MenuKit; ov: OvKit; groups: MenuGroup[] };
  onMenuAction?: (row: TRow, value: string) => void;
  // 줄을 누르면 상세(누르는 줄 — 호버 · 누름 바탕)
  pressable?: boolean;
  onRowClick?: (row: TRow) => void;
  live?: boolean;
  // 멈춘 그림 — 줄마다 상태 · 정렬 버튼 상태
  rowStates?: Record<string, TableState>;
  headStates?: Record<string, TableState>;
  // 상자 안에서 스크롤 — 머리를 맨 위에 붙인다
  stickyHeader?: boolean;
  maxHeight?: number;
  scrollTop?: number;
  // 불러오는 동안 · 비었음 · 실패(본문 자리)
  status?: { kind: 'loading'; rows?: number } | { kind: 'empty' | 'failure'; title: string; description?: string; action?: string; onAction?: () => void; icon?: FbIcon };
  minWidth?: number;
  // 열 폭을 그대로(table-layout fixed) — 그림에서 칸 자리를 셈해 치수를 둘 때
  fixed?: boolean;
  marks?: TableMarks;
  pins?: TablePins;
  // 나쁜 예 — 머리 모양 · 줄무늬 · 세로 선 · 숫자 왼쪽
  bad?: { head?: 'grey' | 'upper'; stripes?: boolean; vlines?: boolean; numbersStart?: boolean; tint?: boolean; mono?: boolean; noLastLine?: boolean };
  style?: CSSProperties;
};

export function TableView({
  look,
  mode = 'auto',
  caption,
  columns,
  rows,
  rowKind = 'text',
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  selectable = false,
  selected: selectedProp,
  defaultSelected = [],
  onSelectedChange,
  bulkActions,
  more = false,
  menu,
  onMenuAction,
  pressable = false,
  onRowClick,
  live = false,
  rowStates,
  headStates,
  stickyHeader = false,
  maxHeight,
  status,
  scrollTop,
  minWidth,
  fixed = false,
  marks,
  pins,
  bad,
  style,
}: TableViewProps) {
  const [ownSort, setOwnSort] = useState<TSort>(defaultSort);
  const sort = sortProp === undefined ? ownSort : sortProp;
  const [ownSel, setOwnSel] = useState<string[]>(defaultSelected);
  const selected = selectedProp ?? ownSel;
  const [hover, setHover] = useState<string | null>(null);
  const [press, setPress] = useState<string | null>(null);
  const [headHover, setHeadHover] = useState<string | null>(null);
  const [headPress, setHeadPress] = useState<string | null>(null);
  const [ring, setRing] = useState<string | null>(null);
  const [said, setSaid] = useState('');
  const boxRef = useRef<HTMLDivElement>(null);
  // 멈춘 그림 — 상자를 조금 내려 둔다(머리 고정)
  useEffect(() => {
    if (scrollTop !== undefined && boxRef.current) boxRef.current.scrollTop = scrollTop;
  }, [scrollTop]);
  const h = look.head;
  const c = look.cell;
  const edge = look.edge;
  const lineW = look.row.lineW;
  const rowMin = look.row.minH[rowKind];

  const setSel = (ids: string[]) => {
    if (selectedProp === undefined) setOwnSel(ids);
    onSelectedChange?.(ids);
  };
  const setSort = (s: TSort) => {
    if (sortProp === undefined) setOwnSort(s);
    onSortChange?.(s);
  };

  const shown = useMemo(() => {
    if (!sort) return rows;
    const k = sort.key;
    const val = (r: TRow) => {
      const cell = cellOf(r.cells[k]);
      return cell.sortValue ?? cell.text ?? '';
    };
    const out = [...rows].sort((a, b) => {
      const x = val(a);
      const y = val(b);
      const d = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'ko');
      return sort.dir === 'ascending' ? d : -d;
    });
    return out;
  }, [rows, sort]);

  const all = shown.length > 0 && shown.every((r) => selected.includes(r.id));
  const some = !all && shown.some((r) => selected.includes(r.id));
  const nCols = columns.length + (selectable ? 1 : 0) + (more ? 1 : 0);
  // 칸 좌우 — 첫 칸 앞 · 끝 칸 뒤는 카드 여백(edge), 나머지는 16
  const firstIsCheck = selectable;
  const padL = (i: number) => (i === 0 && !firstIsCheck ? edge : c.padX);
  const padR = (i: number) => (i === columns.length - 1 && !more ? edge : c.padX);
  const line = dcv(look.row.line, mode);
  // 체크 누르는 영역 44 — 가로는 체크(24) 둘레로, 세로는 칸 글 높이 안에 겹쳐 둔다(줄 높이를 늘리지 않는다)
  const hitStyle = (lh: number): CSSProperties => ({ width: look.check.touch, height: look.check.touch, justifyContent: 'center', marginTop: -(look.check.touch - lh) / 2, marginBottom: -(look.check.touch - lh) / 2, marginLeft: -(look.check.touch - look.check.size) / 2, marginRight: -(look.check.touch - look.check.size) / 2 });
  const lineFor = (last: boolean) => (bad?.noLastLine && last ? 'none' : `${lineW}px solid ${line}`);
  const vline = bad?.vlines ? `${lineW}px solid ${line}` : undefined;

  const headCell = (col: TCol, i: number) => {
    const sortable = !!col.sortable;
    const dir = sort?.key === col.key ? sort.dir : 'none';
    const end = col.align === 'end' && !bad?.numbersStart;
    const hs = headStates?.[col.key];
    const hov = hs === 'hovered' || headHover === col.key;
    const prs = hs === 'pressed' || headPress === col.key;
    const foc = hs === 'focused' || ring === `h:${col.key}`;
    const grey = bad?.head;
    const txt: CSSProperties = grey
      ? { fontSize: 12, lineHeight: '20px', fontWeight: 700, color: `var(--p-fg-neutral-subtle)`, textTransform: grey === 'upper' ? 'uppercase' : undefined, letterSpacing: grey === 'upper' ? '0.04em' : undefined }
      : { fontFamily: h.type.fontFamily, fontSize: h.type.fontSize, lineHeight: h.type.lineHeight, fontWeight: h.type.fontWeight, color: dcv(h.fg, mode) };
    const inner: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: end ? 'flex-end' : 'flex-start', gap: look.sort.gap, minHeight: parseFloat(h.type.lineHeight), boxSizing: 'border-box', paddingTop: h.padY, paddingBottom: h.padY, paddingLeft: padL(i), paddingRight: padR(i), ...txt };
    const thStyle: CSSProperties = {
      position: stickyHeader ? 'sticky' : 'relative',
      top: stickyHeader ? 0 : undefined,
      zIndex: stickyHeader ? h.z : undefined,
      background: stickyHeader ? dcv(h.stickyBg, mode) : grey ? `var(--p-bg-layer-basement)` : 'transparent',
      borderBottom: `${h.lineW}px solid ${dcv(h.line, mode)}`,
      borderRight: vline,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      textAlign: end ? 'right' : 'left',
      width: col.width,
      verticalAlign: 'middle',
      ...(i === 0 ? marks?.headerCell : undefined),
    };
    return (
      <th key={col.key} scope="col" aria-sort={dir !== 'none' ? dir : undefined} style={thStyle}>
        {i === 0 && pins?.headerCell}
        {sortable ? (
          <button
            type="button"
            tabIndex={live ? 0 : -1}
            onClick={
              live
                ? () => {
                    const next = nextSort(dir, firstDir(col));
                    setSort({ key: col.key, dir: next });
                    setSaid(`${col.label} ${next === 'ascending' ? '오름차순' : '내림차순'}으로 정렬했어요.`);
                  }
                : undefined
            }
            onPointerEnter={live ? (e) => e.pointerType === 'mouse' && setHeadHover(col.key) : undefined}
            onPointerLeave={live ? () => (setHeadHover(null), setHeadPress(null)) : undefined}
            onPointerDown={live ? () => setHeadPress(col.key) : undefined}
            onPointerUp={live ? () => setHeadPress(null) : undefined}
            onFocus={live ? (e) => e.currentTarget.matches(':focus-visible') && setRing(`h:${col.key}`) : undefined}
            onBlur={live ? () => setRing(null) : undefined}
            style={{
              position: 'relative',
              ...inner,
              width: '100%',
              margin: 0,
              borderWidth: 0,
              background: hov || prs ? dcv(look.sort.bg, mode) : 'transparent',
              cursor: live ? 'pointer' : 'default',
              outline: foc ? `${look.ring.width}px solid ${dcv(look.ring.color, mode)}` : 'none',
              outlineOffset: look.ring.offset,
              transition: `background-color ${look.row.motion.duration} ${look.row.motion.easing}`,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {/* 누르는 영역 — 칸 폭 × 41 을 위아래로 44 까지 */}
            <span aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: -(look.sort.touchH - h.minH + h.lineW) / 2, bottom: -(look.sort.touchH - h.minH + h.lineW) / 2 }} />
            {end && <SortIcon look={look} mode={mode} dir={dir} style={{ order: 2, ...(i === columns.findIndex((x) => x.sortable) ? marks?.sortIcon : undefined) }} />}
            <span style={{ order: end ? 1 : 0, whiteSpace: 'nowrap' }}>{col.label}</span>
            {!end && <SortIcon look={look} mode={mode} dir={dir} style={i === columns.findIndex((x) => x.sortable) ? marks?.sortIcon : undefined} />}
            {i === columns.findIndex((x) => x.sortable) && pins?.sortIcon}
          </button>
        ) : (
          <div style={{ ...inner, whiteSpace: 'nowrap' }}>{col.label}</div>
        )}
      </th>
    );
  };

  const toggleRow = (id: string) => setSel(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  const toggleAll = () => setSel(all ? selected.filter((x) => !shown.some((r) => r.id === x)) : [...new Set([...selected, ...shown.map((r) => r.id)])]);

  const body = () => {
    if (status?.kind === 'loading') {
      return Array.from({ length: status.rows ?? 5 }, (_, ri) => (
        <tr key={`sk${ri}`} aria-hidden>
          {selectable && <td style={{ borderBottom: lineFor(false), paddingTop: c.padY, paddingBottom: c.padY, paddingLeft: edge, paddingRight: c.padX }} />}
          {columns.map((col, i) => (
            <td key={col.key} style={{ borderBottom: lineFor(false), paddingTop: c.padY, paddingBottom: c.padY, paddingLeft: padL(i), paddingRight: padR(i) }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: col.align === 'end' ? 'flex-end' : 'flex-start', minHeight: rowMin - c.padY * 2 - lineW }}>
                <SkeletonView look={look.sk} mode={mode} text="t4" width={col.align === 'end' ? '55%' : i === 0 ? '70%' : '50%'} />
              </div>
            </td>
          ))}
          {more && <td style={{ borderBottom: lineFor(false) }} />}
        </tr>
      ));
    }
    if (status) {
      return (
        <tr>
          {/* 본문 자리 한 칸 — 표가 카드 안이라 결과 자리의 좌우는 0, 칸의 24(첫 칸 앞 · 끝 칸 뒤와 같다)만 둔다(table.md TableStatusRow) */}
          <td colSpan={nCols} style={{ borderBottom: lineFor(true), paddingTop: 0, paddingBottom: 0, paddingLeft: edge, paddingRight: edge }}>
            <ResultSectionView look={look.result} mode={mode} kind={status.kind} size="medium" inCard icon={status.icon} title={status.title} description={status.description} primary={status.kind === 'failure' && status.action ? { label: status.action, onClick: status.onAction } : undefined} secondary={status.kind === 'empty' && status.action ? { label: status.action, onClick: status.onAction } : undefined} live={live} />
          </td>
        </tr>
      );
    }
    return shown.map((row, ri) => {
      const last = ri === shown.length - 1;
      const st = rowStates?.[row.id];
      const hov = pressable && (st === 'hovered' || (live && hover === row.id));
      const prs = pressable && (st === 'pressed' || (live && press === row.id));
      const foc = st === 'focused' || ring === `r:${row.id}`;
      const on = selected.includes(row.id);
      const stripe = bad?.stripes && ri % 2 === 1;
      const bg = hov || prs ? dcv(look.row.hoverBg, mode) : bad?.tint && on ? `var(--p-bg-brand-weak)` : stripe ? `var(--p-bg-layer-basement)` : 'transparent';
      const td = (i: number, extra?: CSSProperties): CSSProperties => ({ borderBottom: lineFor(last), borderRight: vline, paddingTop: c.padY, paddingBottom: c.padY, paddingLeft: padL(i), paddingRight: padR(i), verticalAlign: 'middle', ...extra });
      const box = (end: boolean, extra?: CSSProperties): CSSProperties => ({ display: 'flex', alignItems: 'center', justifyContent: end ? 'flex-end' : 'flex-start', minHeight: rowMin - c.padY * 2 - lineW, minWidth: 0, ...extra });
      return (
        <tr
          key={row.id}
          onClick={live && pressable ? () => onRowClick?.(row) : undefined}
          onPointerEnter={live && pressable ? (e) => e.pointerType === 'mouse' && setHover(row.id) : undefined}
          onPointerLeave={live && pressable ? () => (setHover(null), setPress(null)) : undefined}
          onPointerDown={live && pressable ? () => setPress(row.id) : undefined}
          onPointerUp={live && pressable ? () => setPress(null) : undefined}
          style={{ background: bg, cursor: pressable ? 'pointer' : undefined, transition: `background-color ${look.row.motion.duration} ${look.row.motion.easing}`, ...(ri === 0 ? marks?.row : undefined) }}
        >
          {selectable && (
            <td style={td(-1, { paddingLeft: edge, paddingRight: c.padX, width: look.check.size, ...(ri === 0 ? marks?.checkbox : undefined) })} onClick={(e) => e.stopPropagation()}>
              <div style={{ ...box(false), position: 'relative' }}>
                {ri === 0 && pins?.checkbox}
                <CheckboxView look={look.check.look} mode={mode} checked={on ? 'checked' : 'unchecked'} onChange={() => toggleRow(row.id)} state={live ? 'live' : 'enabled'} ariaLabel={`${row.name} 선택`} style={hitStyle(parseFloat(c.type.lineHeight))} />
              </div>
            </td>
          )}
          {columns.map((col, i) => {
            const cell = cellOf(row.cells[col.key]);
            const end = col.align === 'end' && !bad?.numbersStart;
            const content = <CellContent look={look} mode={mode} cell={cell} zone={ri === 0 ? { detail: marks?.detail, badge: marks?.badge, pinBadge: pins?.badge, pinDetail: pins?.detail } : undefined} />;
            const txt: CSSProperties = { fontFamily: c.type.fontFamily, fontSize: c.type.fontSize, lineHeight: c.type.lineHeight, fontWeight: c.type.fontWeight, color: dcv(c.fg, mode), fontVariantNumeric: col.align === 'end' ? 'tabular-nums' : undefined };
            if (bad?.mono && col.align === 'end') txt.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, monospace';
            if (i === 0)
              return (
                <th key={col.key} scope="row" style={{ ...td(0), textAlign: 'left', fontWeight: 'inherit', ...(ri === 0 ? marks?.cell : undefined) }}>
                  {ri === 0 && pins?.cell}
                  <div style={{ ...box(false), ...txt }}>
                    {live && pressable ? (
                      <a
                        href={`#${row.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onRowClick?.(row);
                        }}
                        onFocus={(e) => e.currentTarget.matches(':focus-visible') && setRing(`r:${row.id}`)}
                        onBlur={() => setRing(null)}
                        style={{ color: 'inherit', textDecoration: 'none', outline: foc ? `${look.ring.width}px solid ${dcv(look.ring.color, mode)}` : 'none', outlineOffset: look.ring.offset, borderRadius: 2, minWidth: 0 }}
                      >
                        {content}
                      </a>
                    ) : (
                      <span style={{ outline: foc ? `${look.ring.width}px solid ${dcv(look.ring.color, mode)}` : 'none', outlineOffset: 2, borderRadius: 2, minWidth: 0 }}>{content}</span>
                    )}
                  </div>
                </th>
              );
            return (
              <td key={col.key} style={td(i, { textAlign: end ? 'right' : 'left' })}>
                <div style={{ ...box(end), ...txt }}>{content}</div>
              </td>
            );
          })}
          {more && (
            <td style={td(-2, { paddingLeft: c.padX, paddingRight: edge, width: look.more.size, ...(ri === 0 ? marks?.more : undefined) })} onClick={(e) => e.stopPropagation()}>
              <div style={{ ...box(true), position: 'relative' }}>
                {ri === 0 && pins?.more}
                <span style={{ display: 'flex', marginTop: -(look.more.size - parseFloat(c.type.lineHeight)) / 2, marginBottom: -(look.more.size - parseFloat(c.type.lineHeight)) / 2 }}>
                  {live && menu ? (
                    <ResponsiveMenu kit={menu.kit} ov={menu.ov} mode={mode} groups={menu.groups} title={row.name} label={`${row.name} 더보기`} onAction={(v) => onMenuAction?.(row, v)} trigger={(r) => <KebabTrigger look={look.more.look} mode={mode} label={`${row.name} 더보기`} render={r} />} />
                  ) : (
                    <ButtonView look={look.more.look} mode={mode} icon="more-vertical" ariaLabel={`${row.name} 더보기`} state={live ? 'live' : 'enabled'} />
                  )}
                </span>
              </div>
            </td>
          )}
        </tr>
      );
    });
  };

  // 열 폭 그대로 — 선택 칸(앞 24 + 24 + 뒤 16) · ⋮ 열(80)을 더한 합
  const fixedW = fixed ? columns.reduce((sum, col) => sum + (typeof col.width === 'number' ? col.width : 0), 0) + (selectable ? look.check.colW : 0) + (more ? look.more.colW : 0) : undefined;
  const table = (
    <table style={{ width: fixedW ?? '100%', minWidth, borderCollapse: 'separate', borderSpacing: 0, tableLayout: fixed ? 'fixed' : 'auto' }}>
      <caption style={srOnly}>{caption}</caption>
      <thead>
        <tr style={marks?.headerRow}>
          {selectable && (
            <th scope="col" style={{ position: stickyHeader ? 'sticky' : 'relative', top: stickyHeader ? 0 : undefined, zIndex: stickyHeader ? h.z : undefined, background: stickyHeader ? dcv(h.stickyBg, mode) : 'transparent', borderBottom: `${h.lineW}px solid ${dcv(h.line, mode)}`, paddingTop: h.padY, paddingBottom: h.padY, paddingLeft: edge, paddingRight: c.padX, width: look.check.size, verticalAlign: 'middle' }}>
              <div style={{ display: 'flex', alignItems: 'center', minHeight: parseFloat(h.type.lineHeight) }}>
                <CheckboxView look={look.check.look} mode={mode} checked={all ? 'checked' : some ? 'indeterminate' : 'unchecked'} onChange={toggleAll} state={live ? 'live' : 'enabled'} ariaLabel="모두 선택" style={hitStyle(parseFloat(h.type.lineHeight))} />
              </div>
            </th>
          )}
          {columns.map(headCell)}
          {more && (
            <th scope="col" style={{ position: stickyHeader ? 'sticky' : 'relative', top: stickyHeader ? 0 : undefined, zIndex: stickyHeader ? h.z : undefined, background: stickyHeader ? dcv(h.stickyBg, mode) : 'transparent', borderBottom: `${h.lineW}px solid ${dcv(h.line, mode)}`, width: look.more.colW, minWidth: look.more.colW, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }}>
              <span style={srOnly}>동작</span>
            </th>
          )}
        </tr>
      </thead>
      <tbody>{body()}</tbody>
    </table>
  );

  const count = selected.filter((id) => rows.some((r) => r.id === id)).length;
  return (
    <div data-mode={mode} style={{ position: 'relative', width: '100%', fontFamily: c.type.fontFamily, ...style }}>
      {selectable && bulkActions && (
        <div style={{ paddingLeft: edge, paddingRight: edge }}>
          <TableBulkBarView look={look} mode={mode} count={count} actions={bulkActions} live={live} onClear={() => setSel(selected.filter((x) => !rows.some((r) => r.id === x)))} marks={marks} pins={pins} />
        </div>
      )}
      <div ref={boxRef} style={{ position: 'relative', overflowX: 'auto', overflowY: maxHeight ? 'auto' : undefined, maxHeight, ...marks?.root }}>
        {pins?.root}
        {table}
      </div>
      {live && (
        <span role="status" style={srOnly}>
          {said}
        </span>
      )}
      {live && selectable && (
        <span role="status" style={srOnly}>
          {count > 0 ? `${count}개 선택됨` : ''}
        </span>
      )}
    </div>
  );
}

// 머리 칸의 글 · 줄 높이만 — 표 밖 그림(정렬 머리 하나)에서
export function SortHeadView({ look, mode = 'auto', label, dir, align = 'start', state, width }: { look: TableLook; mode?: ViewMode; label: string; dir: SortDir | 'none'; align?: 'start' | 'end'; state?: TableState; width?: number }) {
  const h = look.head;
  const tinted = state === 'hovered' || state === 'pressed';
  const end = align === 'end';
  return (
    <div style={{ display: 'inline-flex', width, boxSizing: 'border-box', borderBottom: `${h.lineW}px solid ${dcv(h.line, mode)}` }}>
      <span
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: end ? 'flex-end' : 'flex-start',
          gap: look.sort.gap,
          boxSizing: 'border-box',
          minHeight: h.minH - h.lineW,
          paddingTop: h.padY,
          paddingBottom: h.padY,
          paddingLeft: h.padX,
          paddingRight: h.padX,
          background: tinted ? dcv(look.sort.bg, mode) : 'transparent',
          outline: state === 'focused' ? `${look.ring.width}px solid ${dcv(look.ring.color, mode)}` : 'none',
          outlineOffset: look.ring.offset,
          fontFamily: h.type.fontFamily,
          fontSize: h.type.fontSize,
          lineHeight: h.type.lineHeight,
          fontWeight: h.type.fontWeight,
          color: dcv(h.fg, mode),
          whiteSpace: 'nowrap',
        }}
      >
        {end && <SortIcon look={look} mode={mode} dir={dir} style={{ order: 2 }} />}
        <span style={{ order: end ? 1 : 0 }}>{label}</span>
        {!end && <SortIcon look={look} mode={mode} dir={dir} />}
      </span>
    </div>
  );
}

export { Fragment as TableFragment };
