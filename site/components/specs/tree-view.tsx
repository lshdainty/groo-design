// Tree View 페이지의 그림 — specs/components/tree-view.md 의 `[그림: …](../../site/components/specs/tree-view.tsx#<id>)` 자리.
// 나무 · 줄 · 꺾쇠 · 고름 · 패널 머리는 tree-view.yaml 을 푼 값(treeLook — collapse-tree)으로, ⋮ 는 Button ghost · iconOnly(button.yaml),
// 메뉴는 menu.yaml(menu-view), 손잡이는 resizable.yaml, 사이드바는 side-navigation.yaml(nav-view)로 그린다. 부서 이름은 지어낸 것이다(collapse-data).
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK_LINE } from '../foundations/ui';
import { ButtonView } from './button-view';
import { BODY_W, CATEGORIES, DEPTS, DEPT_ROOT, deptFind, deptParents, type DeptNode } from './collapse-data';
import { deptPanelW, listNestLook, splitLook, treeLook } from './collapse-look';
import { TreeViewLive } from './collapse-tree';
import { icv, type TreeState } from './collapse-shared';
import { listLook } from './list-look';
import { NestedListView } from './list-nest-view';
import { iconBtn, mk } from './menu-screens';
import { MenuPanel } from './menu-view';
import { overlayKit } from './overlay-screens';
import { Verdict, rc, type Mode } from './kit';
import { Band, Cap, CodePreview, Side, pinAt } from './nav-screens';
import { Legend } from './collapse-screens';
import { CropAfter, RowNote, ScaledAuto } from './collapse-measure';
import { ExDepartmentDemo, ExFixedDemo, TreeKeyboardDemo, TreePlayground } from './tree-play';

type Fig = (p: { caption?: string }) => ReactNode;
const MODES = ['light', 'dark'] as const;
const modeKo = (m: 'light' | 'dark') => (m === 'dark' ? '다크' : '라이트');
const T = () => treeLook('hr');
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full flex-col gap-4">{children}</div>;
const Wide = ({ children }: { children: ReactNode }) => <div className="max-w-full overflow-x-auto">{children}</div>;
// 부서 패널 폭 — 1280 본문 × 목록 기본 폭(248, collapse-look deptPanelW)
const PW = () => deptPanelW();
const ACTIONS = [{ items: [{ value: 'add', label: '하위 부서 추가' }, { value: 'edit', label: '수정' }] }, { items: [{ value: 'delete', label: '삭제', tone: 'critical' as const }] }];

// 부서 패널(멈춘 그림) — 머리(나무의 이름 + 고른 항목의 ⋮) + 나무
export function DeptPanelStatic({ mode = 'auto', w, h, selected = 'ops', expanded, states, hit, ellipsis, decor, nodes = DEPTS, fixed, more = true, style, menu }: { mode?: Mode; w?: number | string; h?: number | string; selected?: string | null; expanded?: string[]; states?: Record<string, TreeState>; hit?: 'row' | 'chevron'; ellipsis?: boolean; decor?: Record<string, ReactNode>; nodes?: DeptNode[]; fixed?: boolean; more?: boolean; style?: CSSProperties; menu?: ReactNode }) {
  const l = T();
  const hd = l.header;
  const sel = selected ? deptFind(selected, nodes) : undefined;
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: w ?? PW(), height: h, background: icv(l.surface, mode), border: `1px solid ${icv(l.border, mode)}`, borderRadius: 12, overflow: menu ? 'visible' : 'hidden', flexShrink: 0, ...style }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: hd.gap, paddingTop: hd.padTop, paddingRight: hd.padRight, paddingBottom: hd.padBottom, paddingLeft: hd.padLeft, flexShrink: 0 }}>
        <span style={{ fontFamily: l.title.fontFamily, fontSize: l.title.fontSize, lineHeight: l.title.lineHeight, fontWeight: l.title.fontWeight, color: icv(l.title.fg, mode) }}>부서</span>
        {more && <ButtonView look={iconBtn('hr')} mode={mode} icon="more-vertical" ariaLabel={`${sel?.label ?? ''} 더보기`} state="enabled" />}
        {menu}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <TreeViewLive look={l} mode={mode} nodes={nodes} ariaLabel="부서" selected={selected} expanded={expanded ?? deptParents(nodes)} states={states} hit={hit} ellipsis={ellipsis} decor={decor} fixed={fixed} />
      </div>
    </div>
  );
}

// 조직도(고른 부서) — 오른쪽 상세 패널
export function OrgChart({ mode = 'auto', dept = '경영지원팀' }: { mode?: Mode; dept?: string }) {
  const box = (name: string, role: string, lead = false) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, border: `1px solid ${rc('stroke-neutral-weak', mode, 'hr')}`, background: rc('bg-layer-default', mode, 'hr'), minWidth: 160 }}>
      <span style={{ width: 32, height: 32, borderRadius: 9999, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700, background: rc(lead ? 'chart-green-weak' : 'chart-blue-weak', mode, 'hr'), color: rc(lead ? 'chart-green-contrast' : 'chart-blue-contrast', mode, 'hr') }}>{name.slice(0, 1)}</span>
      <span style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: rc('fg-neutral', mode, 'hr') }}>{name}</span>
        <span style={{ fontSize: 12, color: rc('fg-neutral-subtle', mode, 'hr') }}>{role}</span>
      </span>
    </div>
  );
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: rc('fg-neutral', mode, 'hr') }}>{dept} · 4명</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {box('김민수', '팀장', true)}
        <div style={{ display: 'flex', gap: 16 }}>
          {box('이서연', '인사 담당')}
          {box('박지훈', '재무 담당')}
          {box('최유진', '총무 담당')}
        </div>
      </div>
    </div>
  );
}
// 나눈 자리의 손잡이(멈춘 그림) — resizable.yaml 의 선 · 손잡이 표시
function HandleStatic({ mode = 'auto', focused = false }: { mode?: Mode; focused?: boolean }) {
  const s = splitLook();
  return (
    <div aria-hidden style={{ position: 'relative', width: s.handle.width, flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', ...(focused ? { outline: `${s.ring.width}px solid ${icv(s.ring.color, mode)}`, outlineOffset: s.ring.offset, borderRadius: s.ring.radius } : {}) }}>
      <span style={{ position: 'absolute', top: 0, bottom: 0, left: (s.handle.width - s.line.width) / 2, width: s.line.width, background: icv(focused ? s.line.activeColor : s.line.color, mode) }} />
      <span style={{ position: 'relative', width: s.grip.w, height: s.grip.h, borderRadius: s.grip.radius, background: icv(s.grip.color, mode) }} />
    </div>
  );
}
// HR 관리 > 회사 — 1280 의 본문(BODY_W — Resizable 그림과 같다): 부서 나무(목록 기본 폭) | 손잡이 | 조직도
// cropW 를 주면 왼쪽부터 그 폭만 보인다(실제 크기로 — 나무 · 손잡이 · 조직도 앞부분)
export function CompanyScreen({ mode = 'auto', s = 1, focusHandle = false, cropW, H = 560 }: { mode?: Mode; s?: number; focusHandle?: boolean; cropW?: number; H?: number }) {
  const W = BODY_W;
  const sp = splitLook();
  const left = Math.round((W * sp.panel.def) / 100);
  const vw = cropW ?? W;
  return (
    <div style={{ width: vw * s, height: (H + 32) * s, flexShrink: 0, overflow: 'hidden', borderRadius: 16 }}>
      <div style={{ width: W, height: H + 32, transform: s === 1 ? undefined : `scale(${s})`, transformOrigin: 'top left', background: rc('bg-layer-basement', mode, 'hr') }}>
        <div style={{ height: 32, display: 'flex', alignItems: 'center', paddingLeft: 16, fontSize: 13, color: rc('fg-neutral-subtle', mode, 'hr') }}>HR 관리 › 회사</div>
        <div style={{ display: 'flex', height: H, background: rc('bg-layer-default', mode, 'hr') }}>
          <DeptPanelStatic mode={mode} w={left} h={H} style={{ border: 0, borderRadius: 0 }} />
          <HandleStatic mode={mode} focused={focusHandle} />
          <OrgChart mode={mode} />
        </div>
      </div>
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {MODES.map((mode) => (
        <CompanyScreen key={mode} mode={mode} cropW={600} />
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <TreePlayground looks={T()} kit={mk('hr')} ov={overlayKit('hr')} kebab={iconBtn('hr')} panelW={PW()} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const l = T();
  const padL = (lv: number) => l.row.padL + (lv - 1) * l.row.indent;
  // 핀 — 데이터 플랫폼팀(2단계 부모) 줄에. 위 줄(분석 파트 — 3단계 잎)의 꺾쇠 칸이 비어 있어 그 자리에 둔다
  const decor: Record<string, ReactNode> = {
    data: (
      <>
        {pinAt('ⓑ', { left: 2, top: 12 })}
        {pinAt('ⓒ', { left: padL(2) + l.chevron.w / 2 - 10, top: -10 })}
        {pinAt('ⓓ', { left: padL(2) + l.chevron.w + l.content.gap + l.icon.size / 2 - 10, top: -10 })}
        {pinAt('ⓔ', { left: padL(2) + l.chevron.w + l.content.gap * 2 + l.icon.size + 108, top: 12 })}
      </>
    ),
    k8s: pinAt('ⓕ', { left: padL(3) - 26, top: 12 }),
  };
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <Wide>
          <div style={{ position: 'relative', padding: '12px 28px 8px' }}>
            <DeptPanelStatic h={420} decor={decor} menu={pinAt('ⓖ', { right: -2, top: -2 })} />
            {pinAt('ⓐ', { left: 18, top: 60 })}
          </div>
        </Wide>
        <Legend
          items={[
            ['ⓐ', `Tree — role=tree · 이름(패널 제목) · Tab 정지점 하나 · 패널 가장자리 ${l.root.padX}`],
            ['ⓑ', `Item — treeitem · 줄 ${l.row.minH} 이상 · 모서리 ${l.row.radius} · 누르는 자리는 ${l.row.touch}`],
            ['ⓒ', `Chevron — 칸 ${l.chevron.w} · 아이콘 ${l.chevron.icon} · 펼치면 ${l.chevron.openRotate}° · 표시만(따로 누르는 자리가 없다)`],
            ['ⓓ', `Icon — ${l.icon.size}(building-2) · 장식`],
            ['ⓔ', `Label — ${parseFloat(l.label.fontSize)} / ${parseFloat(l.label.lineHeight)} · ${l.label.fontWeight} · 줄을 바꾼다`],
            ['ⓕ', `Group — role=group · 단계마다 ${l.row.indent} 들임`],
            ['ⓖ', `More Button — 나무 밖 ⋮ 하나 · 보이는 ${l.more.size} · 누르는 ${l.more.touch}`],
          ]}
        />
      </div>
    </Panel>
  );
};

// ── 줄 ────────────────────────────────────────────────────
// 나무 줄 셋(1 · 2 · 3단계)을 실제 폭의 부서 패널에 두고, 치수 띠 · 줄 높이 괄호는 줄 안(decor)에 YAML 값으로 둔다.
// 줄 높이와 이름 줄 수는 패널 폭에 따라 바뀌므로 브라우저에서 잰다(RowNote)
const Row: Fig = ({ caption }) => {
  const l = T();
  const W = PW();
  const lh = parseFloat(l.label.lineHeight);
  const padL = (lv: number) => l.row.padL + (lv - 1) * l.row.indent;
  const nodes: DeptNode[] = [{ id: 'root', label: DEPT_ROOT, children: [{ id: 'infra', label: '클라우드 인프라팀', children: [{ id: 'k8s', label: '쿠버네티스 운영 파트' }] }] }];
  // 줄 안의 자리 — 줄은 나무 여백(root.paddingX) 안쪽에서 시작한다
  const right = W - l.root.padX * 2;
  const mark = (lv: number): ReactNode => (
    <span aria-hidden className="pointer-events-none">
      <Band style={{ left: 0, width: padL(lv), top: l.row.padY, height: lh }} label={lv === 1 ? String(padL(lv)) : undefined} tag="above" />
      <Band style={{ left: padL(lv), width: l.chevron.w, top: l.row.padY + lh + 2, height: 3 }} label={lv === 1 ? String(l.chevron.w) : undefined} tag="below" />
      <Band style={{ left: padL(lv) + l.chevron.w + l.content.gap, width: l.icon.size, top: l.row.padY + lh + 2, height: 3 }} label={lv === 1 ? String(l.icon.size) : undefined} tag="below" />
      <span style={{ position: 'absolute', left: right + l.root.padX + 8, top: 1, bottom: 1, width: 6, borderTop: `1px solid ${MARK_LINE}`, borderBottom: `1px solid ${MARK_LINE}`, borderRight: `1px solid ${MARK_LINE}` }} />
      <RowNote
        lineHeight={lh}
        template={lv === 1 ? `{h} — 이름 {n}줄 · 왼쪽 ${padL(lv)}` : `{h} · 왼쪽 ${padL(lv)} = ${l.row.padL} + ${lv - 1} × ${l.row.indent}`}
        style={{ position: 'absolute', left: right + l.root.padX + 20, top: '50%', transform: 'translateY(-50%)', whiteSpace: 'nowrap', fontSize: 11, lineHeight: '16px', fontWeight: 600, color: MARK_LINE }}
      />
    </span>
  );
  const TOP = 28;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <Wide>
          <ScaledAuto w={W + 190} s={1.25}>
            <div style={{ position: 'relative', paddingTop: TOP, paddingRight: 190 }}>
              <div style={{ width: W, background: 'var(--p-bg-layer-default)', borderRadius: 12 }}>
                <TreeViewLive look={l} nodes={nodes} ariaLabel="부서" selected={null} expanded={['root', 'infra']} decor={{ root: mark(1), infra: mark(2), k8s: mark(3) }} style={{ paddingBottom: 0 }} />
              </div>
            </div>
          </ScaledAuto>
        </Wide>
        <Cap w={640}>
          줄 {l.row.minH} 이상(위아래 {l.row.padY} + 이름 첫 줄 {lh}) · 줄 왼쪽 {l.row.padL} + (단계 − 1) × {l.row.indent} · 꺾쇠 칸 {l.chevron.w} × {l.chevron.h} · 아이콘 {l.icon.size} · 사이 {l.content.gap} · 오른쪽 {l.row.padR} · 이름 {parseFloat(l.label.fontSize)} / {lh} · {l.label.fontWeight} — 가장 긴 뿌리 이름은 {W} 패널(본문 {BODY_W} × 목록 기본 폭)에서 줄을 바꾸고 꺾쇠 · 아이콘은 첫 줄에 맞춘다(1.25배로 그렸다)
        </Cap>
      </div>
    </Panel>
  );
};

// ── 꺾쇠 · 펼침 ───────────────────────────────────────────
const Expand: Fig = ({ caption }) => {
  const l = T();
  const parent = (open: boolean): DeptNode[] => [{ id: open ? 'data-o' : 'data-c', label: '데이터 플랫폼팀', children: [{ id: open ? 'eng-o' : 'eng-c', label: '데이터 엔지니어링 파트' }, { id: open ? 'ana-o' : 'ana-c', label: '분석 파트' }] }];
  const cols: [string, DeptNode[], string[], string][] = [
    ['접힘', parent(false), [], `꺾쇠 오른쪽 · aria-expanded=false — 누르면 ${l.press.collapsed}`],
    ['펼침', parent(true), ['data-o'], `꺾쇠 아래(${l.chevron.openRotate}°) · 하위 묶음 — 누르면 ${l.press.expanded}`],
    ['하위 없음', [{ id: 'ops', label: '경영지원팀' }], [], `꺾쇠 칸 ${l.chevron.w} 을 비운다(이름이 같은 자리) — 누르면 ${l.press.leaf}`],
  ];
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-start justify-center gap-4">
          {cols.map(([t, nodes, exp, cap]) => (
            <div key={t} className="flex flex-col items-center gap-2">
              <div style={{ width: 240, background: 'var(--p-bg-layer-default)', borderRadius: 12, paddingTop: 8 }}>
                <TreeViewLive look={l} nodes={nodes} ariaLabel={t} selected={null} expanded={exp} hit="row" />
              </div>
              <Cap strong={t} w={240}>{cap}</Cap>
            </div>
          ))}
        </div>
        <Cap w={640}>
          누르는 자리는 {l.row.touch}(점선 — 줄 폭 × {l.row.minH} 이상)다. 꺾쇠 칸 {l.chevron.w} 은 표시만이라 꺾쇠를 눌러도 줄을 누른 것과 같다 — 부모는 고르면서 펴고 접는다. → ← 는 고르지 않고 펴고 접기만. 펼침 · 회전 {l.motion.group.duration} · 모션 줄이기면 {l.motion.reduced.duration} 서서히
        </Cap>
      </div>
    </Panel>
  );
};

// ── 고름 ──────────────────────────────────────────────────
const Selected: Fig = ({ caption }) => {
  const states: Record<string, TreeState> = { infra: 'hovered', data: 'pressed', p1: 'focused' };
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-4">
        {MODES.map((mode) => (
          <div key={mode} className="flex flex-col items-center gap-2">
            <CropAfter selector='[data-tree-item="p1"] > div' style={{ border: `1px solid ${rc('stroke-neutral-weak', mode, 'hr')}`, borderRadius: 12 }}>
              <DeptPanelStatic mode={mode} states={states} style={{ border: 0, borderRadius: 0 }} />
            </CropAfter>
            <Cap strong={modeKo(mode)}>클라우드 인프라팀 호버 · 데이터 플랫폼팀 누름 · 경영지원팀 고름 · 프로젝트 1팀 키보드 포커스</Cap>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <Cap w={640}>고른 항목은 Side Navigation 지금 항목과 같은 bg-neutral-weak-pressed — 올리거나 눌러도 바탕 그대로(더 짙은 불투명 역할이 없다). 호버 · 누름은 bg-layer-default-pressed, 누르면 꺾쇠 · 아이콘 · 이름만 2px 거리 축소, 포커스는 줄 안쪽 링 2px · 모서리 {T().ring.radius}</Cap>
      </div>
    </Panel>
  );
};

// ── 노드 동작 — ⋮ 하나 ────────────────────────────────────
const Actions: Fig = ({ caption }) => {
  const l = T();
  const menu = mk('hr').menu;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <Wide>
          <div style={{ padding: '8px 8px 8px 8px' }}>
            {/* 메뉴는 ⋮ 의 끝에 맞춰 아래로(menu.yaml content.align) — 나무 위에 뜬다 */}
            <DeptPanelStatic h={420} menu={<div style={{ position: 'absolute', top: l.header.padTop + l.more.size + 4, right: l.header.padRight, zIndex: 5 }}><MenuPanel look={menu} groups={ACTIONS} /></div>} />
          </div>
        </Wide>
        <Cap w={640}>
          ⋮ 는 Button ghost · iconOnly · medium(보이는 {l.more.size} · 누르는 {l.more.touch} · 아이콘 {l.more.icon}) — 이름 "경영지원팀 더보기"(고른 부서가 바뀌면 이름도). 1280 이상 Menu · 미만 Menu Sheet. 패널 머리는 제목 {parseFloat(l.title.fontSize)} / {parseFloat(l.title.lineHeight)} · {l.title.fontWeight}(왼쪽 {l.header.padLeft} — 나무 줄의 글과 같은 자리)
        </Cap>
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
const WhenGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex w-full flex-col gap-4">
      <Verdict ok note="여러 단계에서 하나를 골라 옆에 그 내용을 본다 — 부서는 Tree View">
        <DeptPanelStatic h={300} />
      </Verdict>
      <Verdict ok note="부모 · 하위 두 단계에서 줄은 편집, 하위만 접는다 — 카테고리는 List 하위 줄">
        <div style={{ width: 312, flexShrink: 0, background: 'var(--p-bg-layer-default)' }}>
          <NestedListView list={listLook()} nest={listNestLook()} categories={CATEGORIES.slice(0, 2)} open={['food']} width={312} childLimit={2} />
        </div>
      </Verdict>
      <Verdict ok note="화면을 옮기는 주 메뉴 — HR 사이드바는 Side Navigation(같은 옛 부품을 쓰던 자리)">
        <div style={{ height: 300, overflow: 'hidden', borderRadius: 12, flexShrink: 0 }}>
          <Side brand="hr" current="company" height={300} />
        </div>
      </Verdict>
    </div>
  </Panel>
);

// 부모 줄은 고르면서 펴고 접는다(16D) — 펼친 클라우드 인프라팀을 누르면 골라지며 접히고, 한 번 더 누르면 고른 채 펴진다.
// → 는 고르지 않고 펴기만 한다. 꺾쇠만 누르는 자리(고르지 않은 16A)는 나쁜 예로만 그린다. 경영지원팀이 보이게 데이터 플랫폼팀은 접어 둔다
const PressGuide: Fig = ({ caption }) => {
  const l = T();
  // 패널은 경영지원팀 아래에서 끊는다 — 패널 폭에서 이름이 몇 줄로 바뀌든 재서 정한다
  const Panel_ = ({ children }: { children: ReactNode }) => (
    <CropAfter selector='[data-tree-item="ops"] > div' style={{ border: '1px solid var(--p-stroke-neutral-weak)', borderRadius: 12 }}>
      {children}
    </CropAfter>
  );
  const flat = { border: 0, borderRadius: 0 };
  const open = ['root', 'infra'];
  const shut = ['root'];
  const step = (title: string, cap: string, panel: ReactNode) => (
    <div className="flex flex-col items-center gap-2">
      {panel}
      <Cap strong={title} w={PW()}>
        {cap}
      </Cap>
    </div>
  );
  const rejW = l.row.padL + l.chevron.w + l.content.gap / 2;
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-col gap-4">
        <Verdict ok note={`부모 줄 전체가 누르는 자리 — 펼친 부모는 ${l.press.expanded}, 접힌 부모는 ${l.press.collapsed}(Enter · Space 도 같다). 꺾쇠를 눌러도 줄을 누른 것과 같다`}>
          <div className="flex flex-wrap items-start justify-center gap-4">
            {step('① 펼친 클라우드 인프라팀을 누른다', `경영지원팀을 고른 채 — 누르면 ${l.press.expanded}`, <Panel_><DeptPanelStatic style={flat} selected="ops" expanded={open} states={{ infra: 'pressed' }} /></Panel_>)}
            {step('② 골라지며 접혔다', `한 번 더 누르면 ${l.press.collapsed}`, <Panel_><DeptPanelStatic style={flat} selected="infra" expanded={shut} /></Panel_>)}
            {step('③ 고른 채 펴졌다', '하위를 편 채 부모를 고르려면 한 번 더 누르거나 → 로 편다', <Panel_><DeptPanelStatic style={flat} selected="infra" expanded={open} /></Panel_>)}
          </div>
        </Verdict>
        <Verdict ok note="→ ← 는 고르지 않고 펴고 접기만 한다 — 고른 경영지원팀이 그대로다">
          <div className="flex flex-wrap items-start justify-center gap-4">
            {step('접힌 클라우드 인프라팀에 초점 — →', '키보드 포커스(링) · 경영지원팀 고름', <Panel_><DeptPanelStatic style={flat} selected="ops" expanded={shut} states={{ infra: 'focused' }} /></Panel_>)}
            {step('펴졌다 — 고름은 그대로', '초점은 클라우드 인프라팀 · 고른 것은 경영지원팀', <Panel_><DeptPanelStatic style={flat} selected="ops" expanded={open} states={{ infra: 'focused' }} /></Panel_>)}
          </div>
        </Verdict>
        <Verdict ok={false} note={`꺾쇠만 누르는 작은 자리(빨간 점선 ${rejW} × ${l.row.minH}) — 맞히기 어렵고, 꺾쇠와 줄이 다른 일을 해 같은 줄을 눌러도 결과가 갈린다`}>
          <Panel_><DeptPanelStatic style={flat} selected="ops" expanded={open} hit="chevron" /></Panel_>
        </Verdict>
      </div>
    </Panel>
  );
};

const KeyboardGuide: Fig = () => <TreeKeyboardDemo look={T()} kit={mk('hr')} ov={overlayKit('hr')} kebab={iconBtn('hr')} panelW={PW()} />;

const WrapGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note={`가장 긴 뿌리 이름도 ${PW()} 패널에서 줄을 바꿔 다 읽힌다 — 앞부분이 같은 부서를 말줄임이 가리지 않는다`}>
        <DeptPanelStatic h={260} selected={null} />
      </Verdict>
      <Verdict ok={false} note="지금 HR — 한 줄 말줄임 · title 도 없다. 앞부분이 같은 부서가 구별되지 않는다">
        <DeptPanelStatic h={260} selected={null} ellipsis />
      </Verdict>
    </Pair>
  </Panel>
);

// ── 코드 미리보기(실제로 누를 수 있다) — tree-view.md 의 코드 그대로 ──
const ExDepartment: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={PW()} pad={24} bg="bg-layer-basement" brand="hr">
    <ExDepartmentDemo look={T()} kit={mk('hr')} ov={overlayKit('hr')} kebab={iconBtn('hr')} panelW={PW()} />
  </CodePreview>
);
const ExFixed: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={PW()} pad={24} bg="bg-layer-basement" brand="hr">
    <ExFixedDemo look={T()} panelW={PW()} />
  </CodePreview>
);

export const treeViewFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  row: Row,
  expand: Expand,
  selected: Selected,
  actions: Actions,
  'when-guide': WhenGuide,
  'press-guide': PressGuide,
  'keyboard-guide': KeyboardGuide,
  'wrap-guide': WrapGuide,
  'ex-department': ExDepartment,
  'ex-fixed': ExFixed,
};
