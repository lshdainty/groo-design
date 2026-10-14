// 화면 틀 · 이동 묶음(Top Navigation · Bottom Navigation · Side Navigation · Side Panel · Pagination · Table Pagination ·
// Floating Action Button)의 모양 — 서버(nav-look) · 브라우저(nav-*-view · 플레이그라운드)가 함께 쓰는 상수 · 타입 · 규칙 함수.
// 파일 읽기(서버 전용)를 들이지 않는다.
import type { CSSProperties } from 'react';
import type { ButtonLook } from './button-look';
import type { OvClose } from './overlay-shared';
import type { SelectLook } from './select-shared';

export type ViewMode = 'light' | 'dark' | 'auto';
export type Brand = 'desk' | 'hr';

// 색 — name 은 사이트 모드를 따를 때 쓰는 CSS 변수(--p-<name>, HR 에서 값이 다른 브랜드 토큰은 hr-<토큰>), light · dark 는 풀어 둔 값
export type NColor = { name?: string; light: string; dark: string };
export type NType = { fontSize: string; lineHeight: string; fontWeight: number | string; fontFamily: string };
export type NMotion = { duration: string; easing: string };
export type NRing = { width: number; offset: number; color: NColor };
// 누름 축소 — 기준 길이 max(높이, 폭 ÷ n, 최소)에서 2px 거리(v104)
export type NPress = { distance: number; widthDivisor: number; minBasis: number; motion: NMotion };
// 그림자 — 라이트 · 다크 값(사이트 모드를 따르면 --p-shadow-s<n>)
export type NShadow = { name: string; light: string; dark: string };

export const FONT = "'Pretendard Variable', Pretendard, sans-serif";
export const ncv = (c: NColor, mode: ViewMode) => (mode === 'auto' ? (c.name ? `var(--p-${c.name})` : c.light) : mode === 'dark' ? c.dark : c.light);
export const nsv = (s: NShadow, mode: ViewMode) => (mode === 'auto' ? `var(--p-${s.name})` : mode === 'dark' ? s.dark : s.light);
export const toMs = (v: string) => (v.trim().endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000);
export function pressRatio(p: Pick<NPress, 'distance' | 'widthDivisor' | 'minBasis'>, w: number, h: number) {
  const basis = Math.max(h, w / p.widthDivisor, p.minBasis);
  return (basis - p.distance) / basis;
}
export const textOf = (t: NType, color: string): CSSProperties => ({ fontFamily: t.fontFamily, fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: t.fontWeight, color });
// 보조 기술에만 읽히는 글
export const srOnly: CSSProperties = { position: 'absolute', width: 1, height: 1, marginTop: -1, marginRight: -1, marginBottom: -1, marginLeft: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 };

// ── 아이콘 — 그림이 쓰는 lucide 이름(뷰가 컴포넌트로 바꾼다) ─────────
export const NAV_ICONS = [
  'house', 'ledger', 'calendar', 'menu', 'plus', 'bell', 'search', 'settings', 'eye', 'eye-off', 'chevron-left', 'chevron-right', 'chevron-down', 'x', 'more',
  'panel-left', 'grid', 'wallet', 'trend', 'pie', 'target', 'todo', 'users', 'memo', 'card', 'plane', 'briefcase', 'heart', 'shield', 'megaphone', 'pencil',
  'user', 'clock', 'file-text', 'filter', 'download', 'book', 'help',
] as const;
export type NavIcon = (typeof NAV_ICONS)[number];

// ── Top Navigation ──────────────────────────────────────────
export const TOP_TYPES = ['root', 'standard', 'desktop'] as const;
export type TopType = (typeof TOP_TYPES)[number];
export const TOP_LEADING = ['back', 'close', 'menu'] as const;
export type TopLeading = (typeof TOP_LEADING)[number];
export const TOP_STATES = ['enabled', 'hovered', 'pressed', 'focused', 'disabled'] as const;
export type TopState = (typeof TOP_STATES)[number];
export type TopNavLook = {
  height: number;
  padX: number;
  bg: NColor;
  z: number;
  title: { fg: NColor; weight: number; gap: number };
  types: Record<'root' | 'standard', { text: NType; left: number }>;
  desktop: { padLeft: number; padRight: number; primarySize: string; primaryGap: number; screenTitle: NType; navToTitle: number };
  // 선 굵기 — 켜고 끄는 단추(aria-pressed)의 켬만 pressedStroke(v106). 색은 켬 · 끔 모두 fg(사용자 결정 2026-10-09 19B)
  icon: { size: number; radius: number; icon: number; stroke: number; pressedStroke: number; fg: NColor; hoverBg: NColor; pressBg: NColor; disabledFg: NColor };
  text: { height: number; padX: number; radius: number; type: NType; fg: NColor; hoverBg: NColor; pressBg: NColor; disabledFg: NColor };
  dot: { size: number; top: number; right: number; color: NColor };
  ring: NRing;
  press: NPress;
  color: NMotion;
  leading: Record<TopLeading, { icon: NavIcon; label: string }>;
  // 데스크톱 머리의 주 버튼(Button brandSolid small)
  primary: ButtonLook;
};
// 오른쪽 자리 하나 — 아이콘 버튼 · 글 버튼
// pressed 를 주면 켜고 끄는 단추(aria-pressed) — 이름은 고정, 아이콘은 지금 상태를 넘긴다(금액 가리기: 보임 eye · 가림 eye-off)
export type TopAction = { kind?: 'icon'; icon: NavIcon; label: string; notification?: boolean; pressed?: boolean; disabled?: boolean; state?: TopState } | { kind: 'text'; label: string; disabled?: boolean; state?: TopState };

// ── Bottom Navigation ───────────────────────────────────────
export const TAB_SIZES = ['regular', 'compact'] as const;
export type TabSize = (typeof TAB_SIZES)[number];
export type TabBarLook = {
  maxWidth: number;
  radius: number;
  bg: NColor;
  shadow: NShadow;
  border: { color: NColor; width: number };
  columns: number;
  gap: number;
  z: number;
  sizes: Record<TabSize, { h: number; marginX: number; bottomMin: number; bottomMinus: number; padX: number; padY: number; add: number; addIcon: number; labels: boolean }>;
  item: { gap: number };
  icon: { size: number; fg: NColor; stroke: number; selFg: NColor; selStroke: number };
  label: { type: NType; weight: number; fg: NColor; selFg: NColor };
  add: { bg: NColor; pressBg: NColor; iconColor: NColor; iconStroke: number };
  // 본문 아래 여백 — 바의 아래 자리 + 높이 + gap
  inset: { gap: number };
  ring: NRing & { radius: number; addOffset: number };
  press: NPress;
  motion: NMotion;
  // 줄어들기 — 아래로 shrink · 위로 expand · 맨 위 top(bottom-navigation.md 의 Behavior)
  scroll: { shrink: number; expand: number; top: number };
  // 알림 점 — 24 아이콘 상자 기준(notification-badge.yaml 의 icon · small)
  dot: { size: number; top: number; right: number; color: NColor };
};
export type TabItem = { value: string; label: string; icon: NavIcon; href?: string; notification?: boolean };
// 바의 아래 자리 — 안전 영역(safe)이 있으면 그만큼 올린다
export const tabBottom = (look: TabBarLook, size: TabSize, safe: number) => Math.max(look.sizes[size].bottomMin, safe - look.sizes[size].bottomMinus);
// 본문 아래 여백 — 마지막 줄이 바 위 gap 에서 끝난다(펼친 바 기준, 줄어도 그대로)
export const tabInset = (look: TabBarLook, safe: number) => tabBottom(look, 'regular', safe) + look.sizes.regular.h + look.inset.gap;

// ── Side Navigation ─────────────────────────────────────────
export type SideNavLook = {
  width: number;
  collapsedWidth: number;
  bg: NColor;
  border: { color: NColor; width: number };
  motion: NMotion;
  header: { minH: number; pad: number };
  logo: { size: number; gap: number; type: NType; weight: number; fg: NColor; marginLeft: number };
  trigger: { size: number; radius: number; icon: number; fg: NColor; top: number; right: number; rightCollapsed: number; touch: number; hoverBg: NColor; pressBg: NColor };
  content: { padTop: number; padX: number; padBottom: number; gap: number; gapCollapsed: number; scrollTop: number; scrollBottom: number };
  divider: { h: number; color: NColor; motion: NMotion };
  fog: { mask: string; bottom: number };
  group: { type: NType; weight: number; fg: NColor; pad: number };
  groupDivider: { h: number; color: NColor; marginY: number; marginX: number };
  item: { minH: number; padX: number; padXCollapsed: number; widthCollapsed: number; gap: number; radius: number; hoverBg: NColor; pressBg: NColor; currentBg: NColor };
  icon: { size: number; fg: NColor; currentFg: NColor; disabledFg: NColor };
  label: { type: NType; weight: number; fg: NColor; currentFg: NColor; disabledFg: NColor; padY: number };
  chevron: { size: number; fg: NColor; motion: NMotion };
  // 하위 펼침 — 높이 · 꺾쇠(d6 — 2026-10-10 Accordion 과 같게), 모션 줄이기면 높이 움직임 없이 서서히(reduce)
  sub: { minH: number; padLeft: number; motion: NMotion; reduce: NMotion };
  footer: { pad: number };
  flyout: {
    width: number;
    bg: NColor;
    radius: number;
    shadow: NShadow;
    padY: number;
    offset: number;
    openDelay: number;
    closeDelay: number;
    z: number;
    label: { type: NType; weight: number; fg: NColor; padY: number; padX: number };
    item: { minH: number; padX: number; type: NType; weight: number; fg: NColor; insetX: number; radius: number; hoverBg: NColor; currentBg: NColor };
    motion: { open: NMotion; close: NMotion };
  };
  tooltip: { openDelay: number; closeDelay: number };
  ring: NRing & { radius: number };
  press: NPress;
};
export type SideSub = { value: string; label: string; href?: string; disabled?: boolean };
export type SideItem = { value: string; label: string; icon: NavIcon; href?: string; disabled?: boolean; children?: SideSub[] };
export type SideGroup = { label?: string; items: SideItem[] };
// 지금 화면 — 하위가 지금이면 부모는 저절로 펼침, 접혔을 때는 부모가 지금 항목
export const parentOf = (groups: SideGroup[], current: string) => groups.flatMap((g) => g.items).find((i) => i.children?.some((s) => s.value === current));

// 접힌 사이드바에서 항목의 위 끝 — 머리 + 내용 위 여백 + 앞 항목(44) · 묶음 사이 선(1 + 위아래 여백)
export function collapsedTop(look: SideNavLook, groups: SideGroup[], value: string) {
  let y = look.header.minH + look.content.padTop;
  for (let g = 0; g < groups.length; g++) {
    if (g > 0) y += look.groupDivider.h + look.groupDivider.marginY * 2;
    for (const it of groups[g].items) {
      if (it.value === value) return y;
      y += look.item.minH;
    }
  }
  throw new Error(`사이드바에 ${value} 항목이 없다`);
}

// ── Side Panel ──────────────────────────────────────────────
export const PANEL_SIDES = ['left', 'right'] as const;
export type PanelSide = (typeof PANEL_SIDES)[number];
export const PANEL_SIZES = ['small', 'medium', 'large'] as const;
export type PanelSize = (typeof PANEL_SIZES)[number];
export type SidePanelLook = {
  dim: NColor;
  z: { dim: number; surface: number };
  // 화면 폭에 대한 상한(0.8) · 왼쪽 폭(0.8)
  maxRatio: number;
  leftRatio: number;
  widths: Record<PanelSize, number>;
  defaults: { side: PanelSide; size: PanelSize };
  bg: NColor;
  header: { padTop: number; padX: number; padBottom: number; minH: number; gap: number };
  title: NType & { color: NColor };
  description: NType & { color: NColor };
  close: OvClose;
  divider: { h: number; color: NColor; motion: NMotion };
  body: { padX: number; padXLeft: number; padBottom: number };
  footer: { padTop: number; padX: number; padBottom: number; gap: number; justify: string; buttonSize: string };
  fog: { top: number; bottom: number; padTop: number; padBottom: number; mask: string };
  ring: NRing;
  motion: { open: NMotion; dimOpen: NMotion; close: NMotion; dimClose: NMotion; reduce: NMotion };
  // 끌어 닫기 — side-panel.md 의 Behavior(빠르기 px/ms · 폭의 비율)
  drag: { velocity: number; ratio: number };
};

// ── Pagination ──────────────────────────────────────────────
export const PG_STATES = ['enabled', 'hovered', 'pressed', 'focused', 'disabled'] as const;
export type PgState = (typeof PG_STATES)[number];
export type PaginationLook = {
  gap: number;
  marginTop: number;
  // 칸 수 — 480(breakpoint-sm) 이상 regular · 미만 narrow
  slots: { regular: number; narrow: number; breakpoint: number };
  cell: { size: number; radius: number; touchH: number; hoverBg: NColor; pressBg: NColor; currentBg: NColor; currentFg: NColor; currentPressBg: NColor; currentDisabledBg: NColor };
  label: { type: NType; weight: number; fg: NColor; disabledFg: NColor };
  arrow: { icon: number; fg: NColor; disabledFg: NColor };
  ellipsis: { icon: number; fg: NColor };
  ring: NRing;
  press: NPress;
  color: NMotion;
};
export type PgSlot = { type: 'page'; page: number } | { type: 'ellipsis' } | { type: 'previous' } | { type: 'next' } | { type: 'empty'; at: 'previous' | 'next' };
// 칸 배열 — 화살표 둘 + 번호 · 생략(slots − 2). SEED 규칙(pagination.yaml 의 count 비고):
// 9칸 — 앞(p ≤ 4) 1 2 3 4 5 … N · 가운데 1 … p−1 p p+1 … N · 뒤(p ≥ N−3) 1 … N−4 … N
// 7칸 — 앞(p ≤ 3) 1 2 3 4 … · 가운데 … p−1 p p+1 … · 뒤(p ≥ N−2) … N−3 … N(가운데 구간에서는 첫 · 마지막 번호가 없다)
export function paginationItems(page: number, total: number, slots: number): PgSlot[] {
  const n = slots - 2;
  const p = Math.min(Math.max(1, page), Math.max(1, total));
  const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  let mid: (number | '…')[];
  if (total <= n) mid = range(1, total);
  else if (n >= 7) {
    // 9칸 — 첫 · 마지막 번호를 늘 둔다
    const k = n - 2; // 앞 · 뒤 구간의 번호 수(5)
    if (p <= k - 1) mid = [...range(1, k), '…', total];
    else if (p >= total - (k - 2)) mid = [1, '…', ...range(total - k + 1, total)];
    else mid = [1, '…', p - 1, p, p + 1, '…', total];
  } else {
    // 7칸 — 가운데 구간에서는 첫 · 마지막 번호가 없다
    const k = n - 1; // 앞 · 뒤 구간의 번호 수(4)
    if (p <= k - 1) mid = [...range(1, k), '…'];
    else if (p >= total - (k - 2)) mid = ['…', ...range(total - k + 1, total)];
    else mid = ['…', p - 1, p, p + 1, '…'];
  }
  const out: PgSlot[] = [p <= 1 ? { type: 'empty', at: 'previous' } : { type: 'previous' }];
  for (const m of mid) out.push(m === '…' ? { type: 'ellipsis' } : { type: 'page', page: m });
  out.push(p >= total ? { type: 'empty', at: 'next' } : { type: 'next' });
  return out;
}

// ── Table Pagination ────────────────────────────────────────
export type TablePaginationLook = {
  height: number;
  gap: number;
  marginTop: number;
  options: number[];
  pageSize: { minW: number; gap: number };
  suffix: NType & { color: NColor };
  range: { minW: number; maxH: number; gap: number; disabledFg: NColor };
  total: NType & { color: NColor };
  arrow: { size: number; radius: number; icon: number; fg: NColor; disabledFg: NColor; hoverBg: NColor; pressBg: NColor; touchH: number };
  ring: NRing;
  press: NPress;
  color: NMotion;
  select: SelectLook;
};
// 범위 — "11-20" · 빈 표 "0-0"
export function tableRange(page: number, pageSize: number, total?: number) {
  if (total === 0) return { from: 0, to: 0 };
  const from = (page - 1) * pageSize + 1;
  return { from, to: total === undefined ? page * pageSize : Math.min(total, page * pageSize) };
}
export const tablePages = (total: number, pageSize: number) => Math.max(1, Math.ceil(total / pageSize));
export const comma = (n: number) => n.toLocaleString('ko-KR');

// ── 끝없이 불러오기(목록 끝) ─────────────────────────────────
export const LIST_STATUS = ['loading', 'error', 'end'] as const;
export type ListStatus = (typeof LIST_STATUS)[number];
export type InfiniteListLook = {
  padY: number;
  threshold: number;
  showAfter: number;
  circle: number;
  message: NType & { errorFg: NColor; endFg: NColor };
  texts: { error: string; end: string; retry: string };
  retry: { look: ButtonLook; marginTop: number };
};

// ── Floating Action Button ──────────────────────────────────
export const FAB_STATES = ['enabled', 'hovered', 'pressed', 'focused'] as const;
export type FabState = (typeof FAB_STATES)[number];
export type FabLook = {
  size: number;
  radius: number;
  bg: NColor;
  pressBg: NColor;
  shadow: NShadow;
  right: number;
  bottom: number;
  z: number;
  icon: { size: number; color: NColor; stroke: number };
  ring: NRing;
  press: NPress;
  color: NMotion;
};

// ── 그림 속 화면이 쓰는 역할 색(브라우저 그림은 kit 을 들일 수 없다 — 서버에서 풀어 넘긴다) ──
export const NAV_TONES = [
  'fg-neutral',
  'fg-neutral-muted',
  'fg-neutral-subtle',
  'fg-disabled',
  'fg-placeholder',
  'fg-brand',
  'fg-neutral-inverted',
  'bg-layer-default',
  'bg-layer-basement',
  'bg-layer-floating',
  'bg-neutral-weak',
  'bg-brand-solid',
  'bg-brand-weak',
  'bg-neutral-inverted',
  'stroke-neutral-weak',
  'stroke-neutral-subtle',
  'stroke-neutral-solid',
  'static-white',
  'chart-orange-weak',
  'chart-orange-contrast',
  'chart-blue-weak',
  'chart-blue-contrast',
  'chart-green-weak',
  'chart-green-contrast',
  'chart-violet-weak',
  'chart-violet-contrast',
  'chart-brown-weak',
  'chart-brown-contrast',
  'chart-red-weak',
  'chart-red-contrast',
] as const;
export type NavTone = (typeof NAV_TONES)[number];

export type NavKit = {
  brand: Brand;
  top: TopNavLook;
  tab: TabBarLook;
  side: SideNavLook;
  panel: SidePanelLook;
  page: PaginationLook;
  table: TablePaginationLook;
  list: InfiniteListLook;
  fab: FabLook;
  tone: Record<NavTone, NColor>;
  // 화면 여백(spacing-global-gutter) · 데스크톱 본문 여백(layout-margin) · 사이드바 폭
  gutter: number;
  margin: number;
};
