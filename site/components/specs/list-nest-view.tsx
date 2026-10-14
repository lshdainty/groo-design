'use client';
// 스펙대로 그린 List 하위 줄(list.yaml nest · expanded) — 부모 줄 앞 꺾쇠 단추(누르는 44 · 고정 이름 + aria-expanded)가 하위 줄만 접고,
// 줄 자체는 편집을 여는 단추다(오른쪽 화살표 없음). 하위 줄은 부모의 제목 자리에서 시작하고, 하위가 없는 부모 줄은 꺾쇠 자리를 비운다.
// 줄의 글 · 타일 · 누름 바탕 · 링은 list.yaml 의 줄 값(ListLook), 꺾쇠 단추 · 들임 · 펼침은 NestLook 이다.
// live 면 실제로 단추를 눌러 펼치고 접고(높이 300ms · 모션 줄이기면 150ms 서서히), 줄은 호버 · 누름 · 키보드 포커스에 반응한다.
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Bus, ChevronRight, Coins, Gift, House, PawPrint, ShoppingBag, Stethoscope, Tag, Ticket, Utensils, Wallet, type LucideIcon } from 'lucide-react';
import type { CatIcon, Category } from './collapse-data';
import { icv, pressRatio, type NestLook } from './collapse-shared';
import { useReducedMotion } from './data-card-view';
import type { ListFace, ListLook } from './list-shared';

type ViewMode = 'light' | 'dark' | 'auto';
const CAT_ICONS: Record<CatIcon, LucideIcon> = { utensils: Utensils, house: House, bus: Bus, paw: PawPrint, 'shopping-bag': ShoppingBag, ticket: Ticket, stethoscope: Stethoscope, gift: Gift, tag: Tag, wallet: Wallet, coins: Coins };
const pick = (m: ViewMode) => (m === 'dark' ? 'dark' : 'light');
// 사이트 모드를 따르면 라이트 · 다크 값을 둘 다 싣고 .plst 가 고른다 — 여기서는 모드를 정한 값만 쓰고, auto 는 --p-<토큰>
const col = (l: { light: string; dark: string }, mode: ViewMode, name?: string) => (mode === 'auto' && name ? `var(--p-${name})` : l[pick(mode)]);

export type NestState = 'enabled' | 'hovered' | 'pressed' | 'focused';
type RowKind = 'parent' | 'child';

function Tile({ list, hue, icon, mode }: { list: ListLook; hue: string; icon: CatIcon; mode: ViewMode }) {
  const f = list.faces.none.light.enabled;
  const t = list.tiles[hue];
  const I = CAT_ICONS[icon];
  return (
    <span aria-hidden style={{ display: 'inline-grid', placeItems: 'center', flexShrink: 0, width: f.tile.size, height: f.tile.size, borderRadius: f.tile.radius, background: col(t.bg, mode, `chart-${hue}-weak`), color: col(t.fg, mode, `chart-${hue}`) }}>
      <I size={f.tile.iconSize} strokeWidth={2} />
    </span>
  );
}

// 줄(편집을 여는 단추) — 바탕 층은 li 의 폭 그대로(좌우 들임), 콘텐츠 층만 준다
function RowButton({ list, mode, title, detail, tile, padLeft, live, state, reduce, onClick, lead, width = 360 }: { list: ListLook; mode: ViewMode; title: string; detail: string; tile: ReactNode; padLeft: number; live: boolean; state?: NestState; reduce: boolean; onClick?: () => void; lead?: ReactNode; width?: number }) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [ring, setRing] = useState(false);
  const st: NestState = state ?? (press ? 'pressed' : hover ? 'hovered' : 'enabled');
  const fl = list.faces.none.light[st === 'focused' ? 'enabled' : st];
  const fd = list.faces.none.dark[st === 'focused' ? 'enabled' : st];
  const f: ListFace = fl;
  const tinted = st === 'hovered' || st === 'pressed';
  const focused = st === 'focused' || (live && ring);
  const h = f.pad.y * 2 + Math.max(f.tile.size, parseFloat(f.title.lineHeight ?? '22') + f.body.gap + parseFloat(f.detail.lineHeight ?? '18'));
  const ratio = st === 'pressed' && !reduce ? pressRatio(list.press, width - padLeft, h) : 1;
  const bg = mode === 'auto' ? (tinted ? 'var(--p-bg-layer-default-pressed)' : 'transparent') : tinted ? (mode === 'dark' ? fd : fl).bg.color : 'transparent';
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {/* 바탕 층 — 줄 폭 그대로, 누르면 좌우 들어오고 둥글어진다 */}
      <span aria-hidden style={{ position: 'absolute', top: 0, bottom: 0, left: f.bg.insetX, right: f.bg.insetX, borderRadius: f.bg.radius, background: bg, transitionProperty: 'background-color, left, right, border-radius', transitionDuration: f.motion.bg.duration, transitionTimingFunction: f.motion.bg.easing, pointerEvents: 'none' }} />
      <span style={{ position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 0, paddingLeft: padLeft === 0 ? 0 : undefined }}>{lead}</span>
      <button
        type="button"
        tabIndex={live ? undefined : -1}
        onClick={live ? onClick : undefined}
        onPointerEnter={live && !state ? (e) => e.pointerType === 'mouse' && setHover(true) : undefined}
        onPointerLeave={live && !state ? () => (setHover(false), setPress(false)) : undefined}
        onPointerDown={live && !state ? () => setPress(true) : undefined}
        onPointerUp={live && !state ? () => setPress(false) : undefined}
        onKeyDown={live && !state ? (e) => (e.key === 'Enter' || e.key === ' ') && !e.repeat && setPress(true) : undefined}
        onKeyUp={live && !state ? () => setPress(false) : undefined}
        onFocus={live ? (e) => setRing(e.currentTarget.matches(':focus-visible')) : undefined}
        onBlur={live ? () => (setRing(false), setPress(false)) : undefined}
        style={{
          position: 'relative',
          display: 'flex',
          flex: 1,
          minWidth: 0,
          alignItems: 'center',
          paddingTop: f.pad.y,
          paddingBottom: f.pad.y,
          paddingLeft: lead ? 0 : padLeft,
          paddingRight: f.pad.x,
          margin: 0,
          borderWidth: 0,
          background: 'transparent',
          font: 'inherit',
          textAlign: 'left',
          cursor: live ? f.cursor : 'default',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
          transform: ratio !== 1 ? `scale(${ratio})` : undefined,
          transitionProperty: 'transform',
          transitionDuration: f.motion.content.duration,
          transitionTimingFunction: f.motion.content.easing,
        }}
      >
        <span style={{ display: 'flex', flexShrink: 0, paddingRight: f.prefix.padRight }}>{tile}</span>
        <span style={{ display: 'flex', flex: 1, minWidth: 0, flexDirection: 'column', gap: f.body.gap }}>
          <span style={{ fontFamily: f.title.fontFamily, fontSize: f.title.fontSize, lineHeight: f.title.lineHeight, fontWeight: f.title.fontWeight, color: mode === 'auto' ? 'var(--p-fg-neutral)' : (mode === 'dark' ? fd : fl).title.color }}>{title}</span>
          <span style={{ fontFamily: f.detail.fontFamily, fontSize: f.detail.fontSize, lineHeight: f.detail.lineHeight, fontWeight: f.detail.fontWeight, color: mode === 'auto' ? 'var(--p-fg-neutral-subtle)' : (mode === 'dark' ? fd : fl).detail.color }}>{detail}</span>
        </span>
        {focused && <span aria-hidden style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, outline: `${f.ring.width}px solid ${mode === 'auto' ? 'var(--p-stroke-focus-ring)' : (mode === 'dark' ? fd : fl).ring.color}`, outlineOffset: f.ring.offset, pointerEvents: 'none' }} />}
      </button>
    </div>
  );
}

// 줄 앞 꺾쇠 단추 — 보이는 상자 = 누르는 영역 44, 이름은 고정 "{카테고리} 하위 카테고리" + aria-expanded
function ExpandButton({ nest, mode, open, label, controls, live, state, reduce, onClick, showHit }: { nest: NestLook; mode: ViewMode; open: boolean; label: string; controls: string; live: boolean; state?: NestState; reduce: boolean; onClick?: () => void; showHit?: boolean }) {
  const b = nest.button;
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [ring, setRing] = useState(false);
  const st: NestState = state ?? (press ? 'pressed' : hover ? 'hovered' : 'enabled');
  const tinted = st === 'hovered' || st === 'pressed';
  const focused = st === 'focused' || (live && ring);
  const ratio = st === 'pressed' && !reduce ? pressRatio(b.press, b.size, b.size) : 1;
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={open}
      aria-controls={controls}
      tabIndex={live ? undefined : -1}
      onClick={live ? onClick : undefined}
      onPointerEnter={live && !state ? (e) => e.pointerType === 'mouse' && setHover(true) : undefined}
      onPointerLeave={live && !state ? () => (setHover(false), setPress(false)) : undefined}
      onPointerDown={live && !state ? () => setPress(true) : undefined}
      onPointerUp={live && !state ? () => setPress(false) : undefined}
      onKeyDown={live && !state ? (e) => (e.key === 'Enter' || e.key === ' ') && !e.repeat && setPress(true) : undefined}
      onKeyUp={live && !state ? () => setPress(false) : undefined}
      onFocus={live ? (e) => setRing(e.currentTarget.matches(':focus-visible')) : undefined}
      onBlur={live ? () => (setRing(false), setPress(false)) : undefined}
      style={{
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        width: b.size,
        height: b.size,
        marginRight: b.marginRight,
        padding: 0,
        borderWidth: 0,
        borderRadius: b.radius,
        // 그림 표시(누르는 영역)면 분홍 — 단축 속성 background 하나로(개별 속성과 섞지 않는다, PR #154)
        background: showHit ? 'rgba(236, 72, 153, 0.18)' : tinted ? icv(b.hoverBg, mode) : 'transparent',
        color: icv(b.color, mode),
        cursor: live ? 'pointer' : 'default',
        outline: focused ? `${b.ring.width}px solid ${icv(b.ring.color, mode)}` : 'none',
        outlineOffset: b.ring.offset,
        transform: ratio !== 1 ? `scale(${ratio})` : undefined,
        transitionProperty: 'background-color, transform',
        transitionDuration: `${b.press.motion.duration}, ${b.press.motion.duration}`,
        transitionTimingFunction: `${b.press.motion.easing}, ${b.press.motion.easing}`,
        WebkitTapHighlightColor: 'transparent',
        ...(showHit ? { boxShadow: 'inset 0 0 0 1px #DB2777' } : {}),
      }}
    >
      <ChevronRight aria-hidden size={b.icon} strokeWidth={2} style={{ transform: `rotate(${open ? b.openRotate : 0}deg)`, transitionProperty: 'transform', transitionDuration: reduce ? '0ms' : nest.motion.chevron.duration, transitionTimingFunction: nest.motion.chevron.easing }} />
    </button>
  );
}

// 하위 줄 묶음 — 높이로 펼치고 접힌다(접히면 그리지 않는다)
function SubList({ nest, open, live, reduce, id, children }: { nest: NestLook; open: boolean; live: boolean; reduce: boolean; id: string; children: ReactNode }) {
  const [inDom, setInDom] = useState(open);
  const [full, setFull] = useState(open);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!live) {
      setInDom(open);
      setFull(open);
      return;
    }
    if (open) {
      setInDom(true);
      let r2 = 0;
      const r1 = requestAnimationFrame(() => (r2 = requestAnimationFrame(() => setFull(true))));
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }
    setFull(false);
    const t = window.setTimeout(() => setInDom(false), parseFloat(reduce ? nest.motion.reduced.duration : nest.motion.sub.duration));
    return () => window.clearTimeout(t);
  }, [open, live, reduce, nest.motion.reduced.duration, nest.motion.sub.duration]);
  const m = reduce ? nest.motion.reduced : nest.motion.sub;
  return (
    <div
      hidden={!inDom}
      style={{ display: inDom ? 'grid' : 'none', gridTemplateRows: reduce || full ? '1fr' : '0fr', opacity: reduce ? (full ? 1 : 0) : 1, transitionProperty: reduce ? 'opacity' : 'grid-template-rows', transitionDuration: m.duration, transitionTimingFunction: m.easing }}
    >
      <ul id={id} style={{ minHeight: 0, overflow: 'hidden', margin: 0, padding: 0, listStyle: 'none' }}>
        {children}
      </ul>
    </div>
  );
}

export type NestedListViewProps = {
  list: ListLook;
  nest: NestLook;
  mode?: ViewMode;
  categories: Category[];
  open?: string[];
  onOpenChange?: (ids: string[]) => void;
  live?: boolean;
  width?: number;
  // 하위 줄을 앞에서 몇 개까지(그림 자리)
  childLimit?: number;
  // 멈춘 그림 — '<id>:button' · '<id>' · '<id>/<하위 차례>' 의 상태
  states?: Record<string, NestState>;
  // 늘 펼쳐 두는 화면(편집 모드) — 꺾쇠 자리를 비운다
  fixed?: boolean;
  reduce?: boolean;
  ariaLabel?: string;
  showHit?: boolean;
  onEdit?: (name: string) => void;
  style?: CSSProperties;
};

export function NestedListView({ list, nest, mode = 'auto', categories, open: openProp, onOpenChange, live = false, width = 360, childLimit, states, fixed = false, reduce: reduceProp, ariaLabel = '지출 카테고리', showHit, onEdit, style }: NestedListViewProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const sysReduce = useReducedMotion();
  const reduce = reduceProp ?? sysReduce;
  const [own, setOwn] = useState<string[]>(categories.filter((c) => c.children.length).map((c) => c.id));
  const open = openProp ?? own;
  const setOpen = (ids: string[]) => {
    setOwn(ids);
    onOpenChange?.(ids);
  };
  const slot = nest.button.size + nest.button.marginRight;
  return (
    <ul aria-label={ariaLabel} style={{ width, margin: 0, padding: 0, listStyle: 'none', boxSizing: 'border-box', ...style }}>
      {categories.map((c) => {
        const kids = childLimit !== undefined ? c.children.slice(0, childLimit) : c.children;
        const has = c.children.length > 0;
        const isOpen = fixed || (has && open.includes(c.id));
        const sub = `nest-${uid}-${c.id}`;
        const lead = (
          <span style={{ display: 'flex', paddingLeft: nest.parentPadL }}>
            {has && !fixed ? (
              <ExpandButton nest={nest} mode={mode} open={isOpen} label={`${c.name} 하위 카테고리`} controls={sub} live={live} state={states?.[`${c.id}:button`]} reduce={reduce} onClick={() => setOpen(isOpen ? open.filter((x) => x !== c.id) : [...open, c.id])} showHit={showHit} />
            ) : (
              <span aria-hidden style={{ width: slot, flexShrink: 0 }} />
            )}
          </span>
        );
        return (
          <li key={c.id} data-nest-parent={c.id} style={{ position: 'relative' }}>
            <RowButton list={list} mode={mode} title={c.name} detail={`${c.kind} · ${has ? `하위 ${c.children.length}개` : '하위 없음'}`} tile={<Tile list={list} hue={c.hue} icon={c.icon} mode={mode} />} padLeft={nest.parentPadL} lead={lead} live={live} state={states?.[c.id]} reduce={reduce} width={width} onClick={() => onEdit?.(c.name)} />
            {has && (
              <SubList nest={nest} open={isOpen} live={live} reduce={reduce} id={sub}>
                {kids.map((k, i) => (
                  <li key={k} data-nest-child={`${c.id}/${i}`}>
                    <RowButton list={list} mode={mode} title={k} detail={c.kind} tile={<Tile list={list} hue={c.hue} icon={c.icon} mode={mode} />} padLeft={nest.childPadL} live={live} state={states?.[`${c.id}/${i}`]} reduce={reduce} width={width} onClick={() => onEdit?.(k)} />
                  </li>
                ))}
              </SubList>
            )}
          </li>
        );
      })}
    </ul>
  );
}
