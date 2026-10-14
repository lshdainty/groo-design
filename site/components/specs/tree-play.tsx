'use client';
// Tree View 플레이그라운드 · 키보드 재생 · 코드 미리보기 — 스펙대로 그린 부서 나무(collapse-tree)를 직접 누르고 키보드로 움직인다.
// 옆 글이 초점 · 읽기(이름 · 단계 · 위치 · 펼침 · 고름) · 고른 부서 · Tab 정지점 수를 따라간다. 줄 전체가 누르는 자리다(16D — 부모는
// 고르면서 펴고 접는다). 코드는 tree-view.md 의 "코드" 절과 같은 API.
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { DEPTS, deptFind, deptParents } from './collapse-data';
import { icv, type TreeLook, type ViewMode } from './collapse-shared';
import { TreeViewLive, flatten, treeReadout } from './collapse-tree';
import type { ButtonLook } from './button-look';
import { KebabTrigger, ResponsiveMenu } from './menu-demos';
import type { MenuKit } from './menu-shared';
import type { OvKit } from './overlay-shared';
import { MODES, Seg } from './select-playground';

const ALL = flatten(DEPTS);
// 키보드 재생 — 뿌리를 고르고 클라우드 인프라팀만 접은 채 시작한다: Tab(고른 뿌리) · ↓ · →(펴기) · ↓ · Enter(잎 — 고름) ·
// ←(부모로) · Enter(부모 — 고르며 접힘) · End · Home
const KEYS = ['Tab', 'ArrowDown', 'ArrowRight', 'ArrowDown', 'Enter', 'ArrowLeft', 'Enter', 'End', 'Home'];
const START_SELECTED = 'root';
const START_EXPANDED = deptParents().filter((id) => id !== 'infra');
const KEY_KO: Record<string, string> = { Tab: 'Tab', ArrowDown: '↓', ArrowUp: '↑', ArrowRight: '→', ArrowLeft: '←', Enter: 'Enter', ' ': 'Space', Home: 'Home', End: 'End' };
const ACTIONS = (label: string) => [
  { items: [{ value: 'add', label: '하위 부서 추가' }, { value: 'edit', label: '수정' }] },
  { items: [{ value: 'delete', label: '삭제', tone: 'critical' as const }] },
];

// 부서 패널 — 머리(부서 + ⋮) + 나무. 머리 제목은 나무의 이름(aria-labelledby)
// width — 부서 패널 폭(서버가 본문 × 목록 기본 폭으로 계산해 넘긴다 — collapse-look deptPanelW)
export function DeptPanel({ look, kit, ov, kebab, width, mode = 'auto', fixed = false, reduce, selected, onSelect, keyRef, onFocusItem, height, onAction, defaultExpanded, children }: { look: TreeLook; kit: MenuKit; ov: OvKit; kebab: ButtonLook; width: number; mode?: ViewMode; fixed?: boolean; reduce?: boolean; selected: string; onSelect: (id: string) => void; keyRef?: (fn: (k: string) => void) => void; onFocusItem?: (id: string | null) => void; height?: number; onAction?: (v: string) => void; defaultExpanded?: string[]; children?: ReactNode }) {
  const title = `dept-title-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const sel = deptFind(selected);
  const h = look.header;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width, height, background: icv(look.surface, mode), border: `1px solid ${icv(look.border, mode)}`, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: h.gap, paddingTop: h.padTop, paddingRight: h.padRight, paddingBottom: h.padBottom, paddingLeft: h.padLeft, flexShrink: 0 }}>
        <h2 id={title} style={{ margin: 0, fontFamily: look.title.fontFamily, fontSize: look.title.fontSize, lineHeight: look.title.lineHeight, fontWeight: look.title.fontWeight, color: icv(look.title.fg, mode) }}>
          부서
        </h2>
        <ResponsiveMenu kit={kit} ov={ov} mode={mode} groups={ACTIONS(sel?.label ?? '')} title={sel?.label} label={`${sel?.label} 더보기`} onAction={(v) => onAction?.(v)} trigger={(r) => <KebabTrigger look={kebab} mode={mode} label={`${sel?.label} 더보기`} render={r} />} />
      </div>
      <div className="psa" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <TreeViewLive look={look} mode={mode} nodes={DEPTS} ariaLabelledby={title} selected={selected} onSelect={onSelect} fixed={fixed} live reduce={reduce} keyRef={keyRef} onFocusItem={onFocusItem} defaultExpanded={defaultExpanded} />
      </div>
      {children}
    </div>
  );
}

// 옆 글 — 초점 · 읽기 · 고름 · Tab 정지점
function Side({ focus, last, selected, expanded, fixed, tabStops, log }: { focus: string | null; last: string | null; selected: string; expanded: Set<string>; fixed: boolean; tabStops: number; log: string[] }) {
  const f = ALL.find((x) => x.node.id === focus);
  const l = ALL.find((x) => x.node.id === last);
  // 초점이 나무를 떠나면 글은 바뀌어도 높이는 마지막 초점의 글만큼 둔다 — 줄면 아래 단추가 누르는 사이에 밀려 클릭이 사라진다
  const steady = (shown: ReactNode, reserve: ReactNode) => (
    <span className="grid">
      <span style={{ gridArea: '1 / 1' }}>{shown}</span>
      <span aria-hidden style={{ gridArea: '1 / 1', visibility: 'hidden' }}>
        {reserve}
      </span>
    </span>
  );
  const row = (k: string, v: ReactNode) => (
    <div className="flex gap-2 text-[12.5px] leading-[18px]">
      <b className="w-[64px] shrink-0 text-fd-foreground">{k}</b>
      <span className="min-w-0 text-fd-muted-foreground">{v}</span>
    </div>
  );
  return (
    <div className="flex min-w-[220px] flex-1 flex-col gap-2">
      {row('초점', steady(f ? f.node.label : '나무 밖', l?.node.label ?? ''))}
      {row('읽기', steady(f ? treeReadout(f, expanded, selected, fixed) : '—', l ? treeReadout(l, expanded, selected, fixed) : ''))}
      {row('고름', deptFind(selected)?.label ?? '—')}
      {row('Tab 정지점', `나무 ${tabStops} · 머리 ⋮ 1 — 부서 ${ALL.length}개를 화살표로 다닌다`)}
      {log.length > 0 && row('키', <span className="font-mono">{log.join(' · ')}</span>)}
    </div>
  );
}

// 나무 안의 Tab 정지점(tabindex 0) 수 — 그린 DOM 에서 센다
function useTabStops(rootRef: { current: HTMLDivElement | null }) {
  const [n, setN] = useState(1);
  useEffect(() => {
    const t = rootRef.current?.querySelector('[role="tree"]');
    const v = t ? t.querySelectorAll('[tabindex="0"]').length : 1;
    if (v !== n) setN(v);
  });
  return n;
}

export function TreePlayground({ looks, kit, ov, kebab, panelW }: { looks: TreeLook; kit: MenuKit; ov: OvKit; kebab: ButtonLook; panelW: number }) {
  const [fixed, setFixed] = useState<'foldable' | 'fixed'>('foldable');
  const [motion, setMotion] = useState<'system' | 'reduce'>('system');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [selected, setSelected] = useState('ops');
  const [focus, setFocus] = useState<string | null>(null);
  const [last, setLast] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  // 재생할 때마다 나무를 시작 상태로 다시 세운다(key)
  const [run, setRun] = useState(0);
  const [expandedView, setExpandedView] = useState<Set<string>>(new Set(deptParents()));
  const press = useRef<(k: string) => void>(() => {});
  const box = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const tabStops = useTabStops(box);
  useEffect(() => () => window.clearInterval(timer.current), []);
  // 나무가 쥔 펼침을 옆 글이 읽게 — DOM 의 aria-expanded 로
  useEffect(() => {
    const t = box.current?.querySelector('[role="tree"]');
    if (!t) return;
    const ids = [...t.querySelectorAll('[aria-expanded="true"]')].map((el) => el.getAttribute('data-tree-item') ?? '');
    setExpandedView(new Set(ids));
  });
  const play = () => {
    window.clearInterval(timer.current);
    setLog([]);
    setSelected(START_SELECTED);
    setFocus(null);
    setRun((r) => r + 1);
    let i = 0;
    timer.current = window.setInterval(() => {
      const k = KEYS[i++];
      if (!k) return window.clearInterval(timer.current);
      press.current(k);
      setLog((l) => [...l, KEY_KO[k]]);
    }, 800);
  };
  const code =
    fixed === 'fixed'
      ? `import { Building2 } from "lucide-react"\nimport { TreeView } from "@/components/ui/tree-view"\n\n{/* 접지 않는다 — 꺾쇠 · aria-expanded 없이 들임만 */}\n<TreeView aria-label="부서" nodes={departments} icon={<Building2 />} collapsible={false} selectedId={selectedId} onSelectedChange={setSelectedId} />`
      : `<TreeView\n  aria-labelledby="department-title"\n  nodes={departments}\n  icon={<Building2 />}\n  selectedId={selectedId} // "${selected}"\n  onSelectedChange={setSelectedId}\n  defaultExpandedIds={parentIds}\n/>${motion === 'reduce' ? `\n// 모션 줄이기는 기기 설정을 따른다 — 하위 묶음은 ${looks.motion.reduced.duration} 서서히 · 꺾쇠는 바로` : ''}`;
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-fd-border">
      <div ref={box} className="flex flex-wrap items-start justify-center gap-6 px-4 py-8" style={{ background: icv(looks.basement, mode) }}>
        <DeptPanel key={`${fixed}-${run}`} look={looks} kit={kit} ov={ov} kebab={kebab} width={panelW} mode={mode} fixed={fixed === 'fixed'} reduce={motion === 'reduce' ? true : undefined} selected={selected} onSelect={setSelected} keyRef={(fn) => (press.current = fn)} onFocusItem={(id) => (setFocus(id), id && setLast(id))} defaultExpanded={run > 0 ? START_EXPANDED : undefined} height={520} />
        <div className="flex w-full max-w-[300px] flex-col gap-3">
          <button type="button" onClick={play} className="self-start rounded-md border border-fd-border bg-fd-background px-3 py-1.5 text-[13px] font-medium text-fd-foreground hover:bg-fd-accent">
            ▶ 키보드 재생
          </button>
          <Side focus={focus} last={last} selected={selected} expanded={expandedView} fixed={fixed === 'fixed'} tabStops={tabStops} log={log} />
          <p className="m-0 text-[12px] leading-[18px] text-fd-muted-foreground">
            {fixed === 'fixed'
              ? `늘 펼친 나무 — 줄을 누르면(Enter · Space 도) ${looks.press.fixed}. 접히지 않고, → 는 첫 하위로 · ← 는 부모로 옮기기만 한다.`
              : `누르는 자리는 줄 전체(${looks.row.touch})다 — 접힌 부모는 ${looks.press.collapsed}, 펼친 부모는 ${looks.press.expanded}, 잎은 ${looks.press.leaf}(Enter · Space 도 같다). 꺾쇠는 표시만이고, → ← 는 고르지 않고 펴고 접기만 한다.`}
            {' '}재생은 뿌리를 고르고 클라우드 인프라팀만 접은 채 시작한다.
          </p>
        </div>
      </div>
      <div className="grid gap-4 border-t border-fd-border bg-fd-card p-5 sm:grid-cols-2">
        <Seg label="나무" value={fixed} options={[['foldable', '접고 펴는 나무(기본)'], ['fixed', '늘 펼친 나무 — collapsible={false}']]} onChange={(v) => (setFixed(v), setFocus(null), setLast(null), setLog([]))} />
        <Seg label="모션" value={motion} options={[['system', '기기 설정 따라'], ['reduce', `모션 줄이기 — ${looks.motion.reduced.duration} 서서히`]]} onChange={setMotion} />
        <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
      </div>
      <pre className="overflow-x-auto border-t border-fd-border bg-fd-secondary/50 px-5 py-4 text-[13px] leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// 키보드 재생 — 차례로 누르며 초점 · 읽기 · 고름을 보인다(가이드)
export function TreeKeyboardDemo({ look, kit, ov, kebab, panelW }: { look: TreeLook; kit: MenuKit; ov: OvKit; kebab: ButtonLook; panelW: number }) {
  const [selected, setSelected] = useState(START_SELECTED);
  const [focus, setFocus] = useState<string | null>(null);
  const [step, setStep] = useState(-1);
  const [run, setRun] = useState(0);
  const [expandedView, setExpandedView] = useState<Set<string>>(new Set(START_EXPANDED));
  const press = useRef<(k: string) => void>(() => {});
  const box = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearInterval(timer.current), []);
  useEffect(() => {
    const t = box.current?.querySelector('[role="tree"]');
    if (!t) return;
    setExpandedView(new Set([...t.querySelectorAll('[aria-expanded="true"]')].map((el) => el.getAttribute('data-tree-item') ?? '')));
  });
  const play = () => {
    window.clearInterval(timer.current);
    let i = 0;
    setStep(-1);
    setSelected(START_SELECTED);
    setFocus(null);
    setRun((r) => r + 1);
    timer.current = window.setInterval(() => {
      if (i >= KEYS.length) return window.clearInterval(timer.current);
      press.current(KEYS[i]);
      setStep(i++);
    }, 900);
  };
  const f = ALL.find((x) => x.node.id === focus);
  // 키마다 하는 일 — Enter 의 둘은 tree-view.yaml row.press(잎 · 펼친 부모)
  const notes = ['', '', '펴기', '', `잎 — ${look.press.leaf}`, '부모로', `부모 — ${look.press.expanded}`, '', ''];
  const folded = deptParents().filter((id) => !expandedView.has(id)).map((id) => deptFind(id)?.label ?? id);
  return (
    <figure className="not-prose my-6">
      <div ref={box} className="flex flex-wrap items-start justify-center gap-6 rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6">
        <DeptPanel key={run} look={look} kit={kit} ov={ov} kebab={kebab} width={panelW} selected={selected} onSelect={setSelected} keyRef={(fn) => (press.current = fn)} onFocusItem={(id) => id && setFocus(id)} defaultExpanded={START_EXPANDED} height={460} />
        <div className="flex w-full max-w-[300px] flex-col gap-3">
          <button type="button" onClick={play} className="self-start rounded-md border border-fd-border bg-fd-background px-3 py-1.5 text-[13px] font-medium text-fd-foreground hover:bg-fd-accent">
            ▶ 키보드 재생
          </button>
          <ol className="m-0 flex list-none flex-wrap gap-1 p-0">
            {KEYS.map((k, i) => (
              <li key={i} className="rounded-md border px-2 py-0.5 text-[12px]" style={{ borderColor: i === step ? '#DB2777' : 'var(--color-fd-border)', color: i === step ? '#DB2777' : undefined, fontWeight: i === step ? 700 : 400 }}>
                <span className="font-mono">{KEY_KO[k]}</span>
                {notes[i] && <span className="text-[11px]">({notes[i]})</span>}
              </li>
            ))}
          </ol>
          <div className="text-[12.5px] leading-[18px] text-fd-muted-foreground">
            <b className="text-fd-foreground">읽기</b> {f ? treeReadout(f, expandedView, selected, false) : '—'}
          </div>
          <div className="text-[12.5px] leading-[18px] text-fd-muted-foreground">
            <b className="text-fd-foreground">고름</b> {deptFind(selected)?.label}
          </div>
          <div className="text-[12.5px] leading-[18px] text-fd-muted-foreground">
            <b className="text-fd-foreground">펼침</b> {folded.length ? `${folded.join(' · ')} 접힘 — 나머지 펼침` : '모두 펼침'}
          </div>
        </div>
      </div>
    </figure>
  );
}

// 코드 미리보기 — tree-view.md 의 코드 그대로
export function ExDepartmentDemo({ look, kit, ov, kebab, panelW }: { look: TreeLook; kit: MenuKit; ov: OvKit; kebab: ButtonLook; panelW: number }) {
  const [selected, setSelected] = useState('ops');
  return <DeptPanel look={look} kit={kit} ov={ov} kebab={kebab} width={panelW} selected={selected} onSelect={setSelected} height={560} />;
}
export function ExFixedDemo({ look, panelW }: { look: TreeLook; panelW: number }) {
  const [selected, setSelected] = useState('ops');
  return (
    <div className="psa" style={{ width: panelW, height: 480, overflowY: 'auto', background: 'var(--p-bg-layer-default)', borderRadius: 12, border: '1px solid var(--p-stroke-neutral-weak)' }}>
      <TreeViewLive look={look} nodes={DEPTS} ariaLabel="부서" fixed selected={selected} onSelect={setSelected} live style={{ paddingTop: 8 }} />
    </div>
  );
}
