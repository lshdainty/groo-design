'use client';
// 스펙대로 그린 Tree View — TreeLook(tree-view.yaml 을 푼 값)만 받아 그린다. WAI-ARIA APG Treeview 를 따른다:
// 나무 전체가 Tab 정지점 하나(roving tabindex) · ↑ ↓ 보이는 항목 사이 · → ← 펴고 접으며 하위 · 부모로(고르지 않는다) · Home · End.
// 누르는 자리는 줄 전체다(사용자 결정 16D) — 잎은 고르고, 부모 줄은 고르면서 펴고 접는다(펼친 부모를 고르면 하위가 접힌다).
// Enter · Space 는 누르기와 같다. 꺾쇠는 표시만이다(누르면 줄을 누른 것과 같다). 늘 펼친 나무(fixed)는 누르면 고르기만 한다.
// live 가 아니면 멈춘 그림이다(초점을 받지 않는다) — 줄마다 states 로 호버 · 누름 · 포커스를 그린다.
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { Building2, ChevronRight } from 'lucide-react';
import type { DeptNode } from './collapse-data';
import { icv, pressRatio, type TreeLook, type TreeState, type ViewMode } from './collapse-shared';
import { useReducedMotion } from './data-card-view';

type Flat = { node: DeptNode; level: number; pos: number; size: number; parent: string | null };
// 모든 항목(단계 · 위치 · 부모)
export function flatten(nodes: DeptNode[], level = 1, parent: string | null = null): Flat[] {
  return nodes.flatMap((n, i) => [{ node: n, level, pos: i + 1, size: nodes.length, parent }, ...flatten(n.children ?? [], level + 1, n.id)]);
}
// 보이는 항목 — 접힌 부모의 하위는 빠진다
export function visibleOf(nodes: DeptNode[], expanded: Set<string>, fixed: boolean, level = 1, parent: string | null = null): Flat[] {
  return nodes.flatMap((n, i) => {
    const me = { node: n, level, pos: i + 1, size: nodes.length, parent };
    const open = fixed || expanded.has(n.id);
    return [me, ...(n.children?.length && open ? visibleOf(n.children, expanded, fixed, level + 1, n.id) : [])];
  });
}
// 화면 읽기 — "경영지원팀, 트리 항목, 2단계, 3 / 15, 선택됨"
export function treeReadout(f: Flat | undefined, expanded: Set<string>, selected: string | null, fixed: boolean) {
  if (!f) return '—';
  const has = !!f.node.children?.length;
  return [f.node.label, '트리 항목', `${f.level}단계`, `${f.pos} / ${f.size}`, has && !fixed ? (expanded.has(f.node.id) ? '펼쳐짐' : '접힘') : '', f.node.id === selected ? '선택됨' : ''].filter(Boolean).join(', ');
}

// 하위 묶음 — 높이로 펼치고 접힌다(접히면 그리지 않는다). 모션 줄이기면 서서히
function Group({ look, open, live, reduce, children }: { look: TreeLook; open: boolean; live: boolean; reduce: boolean; children: ReactNode }) {
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
    const t = window.setTimeout(() => setInDom(false), parseFloat(reduce ? look.motion.reduced.duration : look.motion.group.duration));
    return () => window.clearTimeout(t);
  }, [open, live, reduce, look.motion.group.duration, look.motion.reduced.duration]);
  const m = reduce ? look.motion.reduced : look.motion.group;
  return (
    <div hidden={!inDom} style={{ display: inDom ? 'grid' : 'none', gridTemplateRows: reduce || full ? '1fr' : '0fr', opacity: reduce ? (full ? 1 : 0) : 1, transitionProperty: reduce ? 'opacity' : 'grid-template-rows', transitionDuration: m.duration, transitionTimingFunction: m.easing }}>
      <ul role="group" style={{ minHeight: 0, overflow: 'hidden', margin: 0, padding: 0, listStyle: 'none' }}>
        {children}
      </ul>
    </div>
  );
}

export type TreeViewProps = {
  look: TreeLook;
  mode?: ViewMode;
  nodes: DeptNode[];
  ariaLabel?: string;
  ariaLabelledby?: string;
  selected?: string | null;
  onSelect?: (id: string) => void;
  expanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  // 늘 펼친 나무 — 꺾쇠 · 꺾쇠 칸 · aria-expanded 없음
  fixed?: boolean;
  live?: boolean;
  reduce?: boolean;
  // 멈춘 그림 — 줄마다 상태
  states?: Record<string, TreeState>;
  // 초점이 간 항목(화면 읽기)
  onFocusItem?: (id: string | null) => void;
  // 그림 표시 — 누르는 자리: row 는 줄 전체(스펙), chevron 은 꺾쇠만 누르는 자리(고르지 않은 16A — 나쁜 예에만)
  hit?: 'row' | 'chevron';
  marks?: { row?: CSSProperties; chevron?: CSSProperties; icon?: CSSProperties; label?: CSSProperties };
  decor?: Record<string, ReactNode>;
  // 이름 말줄임(나쁜 예)
  ellipsis?: boolean;
  // 처음 펼친 부모(펼침을 나무가 쥘 때) — 없으면 모든 부모
  defaultExpanded?: string[];
  // 키보드 재생 — 밖에서 누른 키를 나무에 넘긴다
  keyRef?: (fn: (key: string) => void) => void;
  style?: CSSProperties;
};

export function TreeViewLive({ look, mode = 'auto', nodes, ariaLabel, ariaLabelledby, selected: selProp, onSelect, expanded: expProp, onExpandedChange, fixed = false, live = false, reduce: reduceProp, states, onFocusItem, hit, marks, decor, ellipsis = false, defaultExpanded, keyRef, style }: TreeViewProps) {
  const sysReduce = useReducedMotion();
  const reduce = reduceProp ?? sysReduce;
  const all = useMemo(() => flatten(nodes), [nodes]);
  const [ownSel, setOwnSel] = useState<string | null>(selProp ?? null);
  const selected = selProp !== undefined ? selProp : ownSel;
  const [ownExp, setOwnExp] = useState<string[]>(expProp ?? defaultExpanded ?? all.filter((f) => f.node.children?.length).map((f) => f.node.id));
  const expanded = new Set(expProp ?? ownExp);
  const setExpanded = (ids: string[]) => {
    setOwnExp(ids);
    onExpandedChange?.(ids);
  };
  const select = (id: string) => {
    setOwnSel(id);
    onSelect?.(id);
  };
  // 누르기 · Enter · Space — 잎 · 늘 펼친 나무는 고르기만(row.press 고른다), 부모는 고르면서 접힌 하위는 펴고(고르며 편다)
  // 펼친 하위는 접는다(고르며 접는다)
  const press = (f: Flat) => {
    const id = f.node.id;
    select(id);
    if (f.node.children?.length && !fixed) setExpanded(expanded.has(id) ? [...expanded].filter((x) => x !== id) : [...expanded, id]);
  };
  const visible = visibleOf(nodes, expanded, fixed);
  // 초점 — 고른 항목(없으면 첫 항목). 고른 항목이 접힌 부모 안으로 숨으면 보이는 첫 조상
  const [focusId, setFocusId] = useState<string | null>(null);
  const [kbd, setKbd] = useState(false);
  const refs = useRef(new Map<string, HTMLLIElement>());
  const rootRef = useRef<HTMLUListElement>(null);
  const isVisible = (id: string | null) => !!id && visible.some((f) => f.node.id === id);
  const ancestorVisible = (id: string | null): string | null => {
    let cur = id;
    while (cur && !isVisible(cur)) cur = all.find((f) => f.node.id === cur)?.parent ?? null;
    return cur;
  };
  const tabTarget = (isVisible(focusId) ? focusId : null) ?? ancestorVisible(selected) ?? visible[0]?.node.id ?? null;
  const focusItem = (id: string) => {
    setFocusId(id);
    refs.current.get(id)?.focus();
  };
  const onKey = (key: string, preventDefault?: () => void) => {
    const cur = tabTarget;
    if (!cur) return;
    const i = visible.findIndex((f) => f.node.id === cur);
    const f = visible[i];
    const has = !!f.node.children?.length;
    const open = fixed || expanded.has(f.node.id);
    const go = (id: string | undefined) => id && focusItem(id);
    switch (key) {
      case 'ArrowDown':
        preventDefault?.();
        go(visible[Math.min(i + 1, visible.length - 1)]?.node.id);
        break;
      case 'ArrowUp':
        preventDefault?.();
        go(visible[Math.max(i - 1, 0)]?.node.id);
        break;
      case 'ArrowRight':
        preventDefault?.();
        if (!has) break;
        if (!open) setExpanded([...expanded, f.node.id]);
        else go(f.node.children?.[0]?.id);
        break;
      case 'ArrowLeft':
        preventDefault?.();
        if (has && open && !fixed) setExpanded([...expanded].filter((x) => x !== f.node.id));
        else if (f.parent) go(f.parent);
        break;
      case 'Home':
        preventDefault?.();
        go(visible[0]?.node.id);
        break;
      case 'End':
        preventDefault?.();
        go(visible[visible.length - 1]?.node.id);
        break;
      case 'Enter':
      case ' ':
        preventDefault?.();
        press(f);
        break;
    }
  };
  useEffect(() => {
    keyRef?.((key: string) => {
      setKbd(true);
      if (key === 'Tab') {
        const id = tabTarget;
        if (id) focusItem(id);
        return;
      }
      onKey(key);
    });
  });
  const g = (c: Parameters<typeof icv>[0]) => icv(c, mode);
  const item = (f: Flat): ReactNode => {
    const n = f.node;
    const has = !!n.children?.length;
    const open = fixed || expanded.has(n.id);
    const sel = n.id === selected;
    const frozen = states?.[n.id];
    return (
      <TreeItem
        key={n.id}
        look={look}
        mode={mode}
        flat={f}
        has={has}
        open={open}
        sel={sel}
        fixed={fixed}
        live={live}
        reduce={reduce}
        frozen={frozen}
        tabbable={live && tabTarget === n.id}
        ringOn={live && kbd && focusId === n.id}
        hit={hit}
        marks={marks}
        decor={decor?.[n.id]}
        ellipsis={ellipsis}
        register={(el) => {
          if (el) refs.current.set(n.id, el);
          else refs.current.delete(n.id);
        }}
        onPress={() => {
          press(f);
          setFocusId(n.id);
          setKbd(false);
        }}
        onFocus={(byKey) => {
          setFocusId(n.id);
          if (byKey) setKbd(true);
          onFocusItem?.(n.id);
        }}
      >
        {has && (
          <Group look={look} open={open} live={live} reduce={reduce}>
            {(n.children ?? []).map((c, i) => item({ node: c, level: f.level + 1, pos: i + 1, size: n.children!.length, parent: n.id }))}
          </Group>
        )}
      </TreeItem>
    );
  };
  return (
    <ul
      ref={rootRef}
      role="tree"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      onKeyDown={
        live
          ? (e: KeyboardEvent<HTMLUListElement>) => {
              setKbd(true);
              onKey(e.key, () => e.preventDefault());
            }
          : undefined
      }
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onFocusItem?.(null);
      }}
      style={{ margin: 0, paddingTop: 0, paddingBottom: look.root.padBottom, paddingLeft: look.root.padX, paddingRight: look.root.padX, listStyle: 'none', fontFamily: look.label.fontFamily, color: g(look.label.fg), ...style }}
    >
      {nodes.map((n, i) => item({ node: n, level: 1, pos: i + 1, size: nodes.length, parent: null }))}
    </ul>
  );
}

function TreeItem({
  look,
  mode,
  flat,
  has,
  open,
  sel,
  fixed,
  live,
  reduce,
  frozen,
  tabbable,
  ringOn,
  hit,
  marks,
  decor,
  ellipsis,
  register,
  onPress,
  onFocus,
  children,
}: {
  look: TreeLook;
  mode: ViewMode;
  flat: Flat;
  has: boolean;
  open: boolean;
  sel: boolean;
  fixed: boolean;
  live: boolean;
  reduce: boolean;
  frozen?: TreeState;
  tabbable: boolean;
  ringOn: boolean;
  hit?: 'row' | 'chevron';
  marks?: TreeViewProps['marks'];
  decor?: ReactNode;
  ellipsis: boolean;
  register: (el: HTMLLIElement | null) => void;
  onPress: () => void;
  onFocus: (byKey: boolean) => void;
  children?: ReactNode;
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [w, setW] = useState(280);
  const rowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (rowRef.current) setW(rowRef.current.offsetWidth);
  }, []);
  const st: TreeState = frozen ?? (press ? 'pressed' : hover ? 'hovered' : 'enabled');
  const focused = st === 'focused' || ringOn;
  const tinted = st === 'hovered' || st === 'pressed';
  const g = (c: Parameters<typeof icv>[0]) => icv(c, mode);
  const bg = sel ? g(look.row.selectedBg) : tinted ? g(st === 'pressed' ? look.row.pressBg : look.row.hoverBg) : 'transparent';
  const padL = look.row.padL + (flat.level - 1) * look.row.indent;
  const ratio = st === 'pressed' && !reduce ? pressRatio(look.content.press, w, look.row.minH) : 1;
  const chevW = fixed ? 0 : look.chevron.w;
  // 고르지 않은 16A 의 꺾쇠만 누르는 자리 — 줄 왼쪽 여백 + 꺾쇠 칸 + 사이의 반 × 줄 높이(나쁜 예 그림에만)
  const rejW = look.row.padL + look.chevron.w + look.content.gap / 2;
  const rejLeft = padL - look.row.padL;
  return (
    <li
      ref={register}
      role="treeitem"
      aria-level={flat.level}
      aria-setsize={flat.size}
      aria-posinset={flat.pos}
      aria-expanded={has && !fixed ? open : undefined}
      aria-selected={sel}
      tabIndex={live ? (tabbable ? 0 : -1) : undefined}
      data-tree-item={flat.node.id}
      onFocus={
        live
          ? (e) => {
              if (e.target !== e.currentTarget) return;
              onFocus(e.currentTarget.matches(':focus-visible'));
            }
          : undefined
      }
      style={{ outline: 'none', listStyle: 'none' }}
    >
      <div
        ref={rowRef}
        onClick={live ? onPress : undefined}
        onPointerEnter={live ? (e) => e.pointerType === 'mouse' && setHover(true) : undefined}
        onPointerLeave={live ? () => (setHover(false), setPress(false)) : undefined}
        onPointerDown={live ? () => setPress(true) : undefined}
        onPointerUp={live ? () => setPress(false) : undefined}
        onPointerCancel={live ? () => setPress(false) : undefined}
        style={{
          position: 'relative',
          boxSizing: 'border-box',
          minHeight: look.row.minH,
          borderRadius: look.row.radius,
          background: bg,
          cursor: live ? look.row.cursor : 'default',
          transitionProperty: 'background-color',
          transitionDuration: look.row.motion.duration,
          transitionTimingFunction: look.row.motion.easing,
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          ...marks?.row,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: look.content.gap,
            paddingTop: look.row.padY,
            paddingBottom: look.row.padY,
            paddingLeft: padL,
            paddingRight: look.row.padR,
            transform: ratio !== 1 ? `scale(${ratio})` : undefined,
            transitionProperty: 'transform',
            transitionDuration: look.content.press.motion.duration,
            transitionTimingFunction: look.content.press.motion.easing,
          }}
        >
          {!fixed && (
            <span aria-hidden style={{ display: 'grid', placeItems: 'center', flexShrink: 0, width: chevW, height: look.chevron.h, color: g(look.chevron.color), ...marks?.chevron }}>
              {has && <ChevronRight size={look.chevron.icon} strokeWidth={2} style={{ transform: `rotate(${open ? look.chevron.openRotate : 0}deg)`, transitionProperty: 'transform', transitionDuration: reduce ? '0ms' : look.chevron.motion.duration, transitionTimingFunction: look.chevron.motion.easing }} />}
            </span>
          )}
          <span aria-hidden style={{ display: 'grid', placeItems: 'center', flexShrink: 0, height: look.icon.h, color: g(look.icon.color), ...marks?.icon }}>
            <Building2 size={look.icon.size} strokeWidth={2} />
          </span>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: look.label.fontSize,
              lineHeight: look.label.lineHeight,
              fontWeight: look.label.fontWeight,
              color: g(look.label.fg),
              ...(ellipsis ? { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } : {}),
              ...marks?.label,
            }}
          >
            {flat.node.label}
          </span>
        </div>
        {/* 누르는 자리 표시 — 줄 전체(점선), 나쁜 예는 꺾쇠만 누르는 자리(빨강). 표시일 뿐 누름을 받지 않는다 */}
        {hit === 'row' && <span aria-hidden data-tree-hit="row" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: look.row.radius, background: 'rgba(236, 72, 153, 0.10)', outline: '1px dashed #DB2777', outlineOffset: -1, pointerEvents: 'none' }} />}
        {hit === 'chevron' && has && !fixed && <span aria-hidden data-tree-hit="chevron" style={{ position: 'absolute', top: 0, bottom: 0, left: rejLeft, width: rejW, background: 'rgba(220, 38, 38, 0.16)', outline: '1px dashed #DC2626', outlineOffset: -1, pointerEvents: 'none' }} />}
        {focused && <span aria-hidden style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: look.ring.radius, outline: `${look.ring.width}px solid ${g(look.ring.color)}`, outlineOffset: look.ring.offset, pointerEvents: 'none' }} />}
        {decor}
      </div>
      {children}
    </li>
  );
}
