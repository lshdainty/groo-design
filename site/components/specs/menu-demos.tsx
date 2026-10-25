'use client';
// Menu · Menu Sheet 페이지의 실제로 여닫는 미리보기 — 코드 절(들어간 화면 머리 ⋮ · 데스크톱 표 줄 ⋮ · 목록 머리 더보기 · 글만)과 플레이그라운드.
// 목록 줄에는 ⋮ 를 두지 않는다 — 줄을 누르면 들어간 화면의 머리 ⋮ 에서 동작을 고른다(menu.md "줄의 동작", 2026-10-25).
// 메뉴 · 시트는 menu.yaml · menu-sheet.yaml(menu-view), 버튼은 button.yaml(button-view), 확인창은 alert-dialog.yaml(overlay-view · overlay-live)이다.
// 머리 ⋮ 는 ResponsiveMenu 처럼 1280 이상 Menu · 미만 Menu Sheet 를 연다. 고른 줄은 메뉴가 닫힌 뒤 실행한다(확인창은 그때 연다).
import { useId, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import type { ButtonLook } from './button-look';
import { ButtonView } from './button-view';
import { MEMOS, PEOPLE } from './menu-data';
import { mcv, type MTone, type MenuGroup, type MenuItem, type MenuKit, type MenuSheetLayout, type ViewMode } from './menu-shared';
import { MenuControl, MenuSheetControl, type TriggerRender } from './menu-view';
import { ModalLayer, useMinWidth } from './overlay-live';
import type { OvKit } from './overlay-shared';
import { AlertSurface } from './overlay-view';
import { BRANDS, MODES, Seg } from './select-playground';

type Brand = 'desk' | 'hr';
const FONT = "'Pretendard Variable', Pretendard, sans-serif";
const tone = (kit: MenuKit, name: MTone, mode: ViewMode) => mcv(kit.tone[name], mode);

// ── 판 ─────────────────────────────────────────────────
export function DemoFrame({ kit, children, w = 440, mode = 'auto', note }: { kit: MenuKit; children: ReactNode; w?: number; mode?: ViewMode; note?: ReactNode }) {
  return (
    <figure className="not-prose my-6">
      <div className="rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6">
        {/* 카드 — card.yaml 의 면(흰 면 + 1px 테두리 · 모서리 16 · 여백 24) */}
        <div className="mx-auto w-full" style={{ maxWidth: w, background: tone(kit, 'bg-layer-default', mode), borderRadius: kit.card.radius, borderWidth: kit.card.borderW, borderStyle: 'solid', borderColor: tone(kit, 'stroke-neutral-weak', mode), paddingTop: kit.card.pad, paddingRight: kit.card.pad, paddingBottom: kit.card.pad, paddingLeft: kit.card.pad, boxSizing: 'border-box', fontFamily: FONT }}>
          {children}
        </div>
      </div>
      {note && <figcaption className="mt-3 text-center text-sm text-fd-muted-foreground">{note}</figcaption>}
    </figure>
  );
}
// 고른 동작을 알려 주는 한 줄(보조 기술에도 읽힌다)
function Status({ kit, mode, children }: { kit: MenuKit; mode: ViewMode; children: ReactNode }) {
  return (
    <p role="status" aria-live="polite" style={{ margin: '12px 0 0', minHeight: 18, fontSize: 13, lineHeight: '18px', color: tone(kit, 'fg-neutral-subtle', mode) }}>
      {children}
    </p>
  );
}
function RowText({ kit, mode, title, sub, badge }: { kit: MenuKit; mode: ViewMode; title: string; sub: string; badge?: ReactNode }) {
  return (
    <span style={{ display: 'flex', flex: '1 1 0%', minWidth: 0, flexDirection: 'column', gap: 2 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, lineHeight: '20px', fontWeight: 500, color: tone(kit, 'fg-neutral', mode) }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
        {badge}
      </span>
      <span style={{ fontSize: 13, lineHeight: '18px', color: tone(kit, 'fg-neutral-subtle', mode) }}>{sub}</span>
    </span>
  );
}
const rowLine = (kit: MenuKit, mode: ViewMode, last: boolean): CSSProperties => ({ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: last ? 'none' : `1px solid ${tone(kit, 'stroke-neutral-subtle', mode)}` });

// ⋮ 트리거 — Button ghost · iconOnly(이름 "{줄 이름} 더보기")
export function KebabTrigger({ look, mode, label, render }: { look: ButtonLook; mode: ViewMode; label: string; render: Parameters<TriggerRender>[0] }) {
  return <ButtonView look={look} mode={mode} icon="more-vertical" ariaLabel={label} buttonRef={render.ref as (el: HTMLButtonElement | null) => void} rootProps={render.props} />;
}

// ResponsiveMenu — 1280 이상 Menu, 미만 Menu Sheet(같은 줄 · 같은 순서 · 같은 막힘)
export function ResponsiveMenu({ kit, ov, mode, groups, title, label, onAction, trigger, force }: { kit: MenuKit; ov: OvKit; mode: ViewMode; groups: MenuGroup[]; title?: string; label: string; onAction: (v: string) => void; trigger: TriggerRender; force?: 'menu' | 'sheet' }) {
  const wide = useMinWidth(kit.menu.breakpoint);
  const asMenu = force ? force === 'menu' : wide;
  if (asMenu) return <MenuControl look={kit.menu} mode={mode} groups={groups} onAction={onAction} trigger={trigger} />;
  return <MenuSheetControl look={kit.sheet} ov={ov.ov} mode={mode} title={title} groups={groups} label={label} onAction={onAction} trigger={trigger} />;
}

// 되돌릴 수 없는 확인 — 메뉴가 닫힌 뒤 연다(alert-dialog.yaml)
function ConfirmDelete({ ov, mode, open, title, description, onCancel, onConfirm }: { ov: OvKit; mode: ViewMode; open: boolean; title: string; description: string; onCancel: () => void; onConfirm: () => void }) {
  const id = useId();
  const wide = useMinWidth(ov.ov.breakpoint);
  const b = wide ? ov.alert.above : ov.alert.below;
  return (
    <ModalLayer open={open} kind="alert" look={ov.ov} mode={mode} outside="ignore" onRequestClose={onCancel} labelledBy={`${id}t`} describedBy={`${id}d`}>
      {({ ref, rootProps, style }) => (
        <AlertSurface ref={ref} rootProps={rootProps} style={style} look={ov.ov.alert} mode={mode} title={title} description={description} titleId={`${id}t`} descId={`${id}d`} cancel={{ label: '취소', look: b.weak, onClick: onCancel }} confirm={{ label: '삭제', look: b.critical, onClick: onConfirm }} />
      )}
    </ModalLayer>
  );
}

// ── Menu 코드 — 메모 화면 머리의 ⋮(목록 줄을 눌러 들어간 화면 · 1280 에서 Menu Sheet 로) ────────
const MEMO_TEXT = ['다음 분기 목표를 정리했다.', '· 신규 기능 두 가지 출시', '· 응답 속도 20% 줄이기'];
export function MemoHeaderMenuDemo({ kit, ov, kebab, mode = 'auto' }: { kit: MenuKit; ov: OvKit; kebab: ButtonLook; mode?: ViewMode }) {
  const memo = MEMOS[0];
  const [pinned, setPinned] = useState(false);
  const [gone, setGone] = useState(false);
  const [status, setStatus] = useState('');
  const [asking, setAsking] = useState(false);
  const groups: MenuGroup[] = [
    {
      items: [
        { value: 'pin', label: pinned ? '고정 풀기' : '고정', icon: 'pin' },
        { value: 'edit', label: '수정', icon: 'pencil' },
        { value: 'duplicate', label: '복사해 새로 쓰기', icon: 'copy' },
      ],
    },
    { items: [{ value: 'delete', label: '삭제', icon: 'trash', tone: 'critical' }] },
  ];
  const act = (v: string) => {
    if (v === 'pin') {
      setPinned(!pinned);
      setStatus(pinned ? `‘${memo.title}’ 메모의 고정을 풀었어요.` : `‘${memo.title}’ 메모를 목록 맨 위에 고정했어요.`);
    } else if (v === 'edit') setStatus(`‘${memo.title}’ 메모의 수정 화면을 열어요.`);
    else if (v === 'duplicate') setStatus(`‘${memo.title} (사본)’ 메모를 만들었어요.`);
    else if (v === 'delete') setAsking(true);
  };
  const label = `${memo.title} 더보기`;
  return (
    <DemoFrame kit={kit} mode={mode}>
      {gone ? (
        <p style={{ margin: 0, fontSize: 14, lineHeight: '20px', color: tone(kit, 'fg-neutral-subtle', mode) }}>
          메모를 지우고 목록으로 돌아갔어요.{' '}
          <button type="button" onClick={() => (setGone(false), setPinned(false), setStatus(''))} style={{ padding: 0, border: 0, background: 'none', font: 'inherit', fontWeight: 700, color: tone(kit, 'fg-neutral', mode), textDecoration: 'underline', cursor: 'pointer' }}>
            다시 열기
          </button>
        </p>
      ) : (
        <>
          {/* 들어간 화면의 머리 — 제목 + 오른쪽 ⋮ 하나(동작이 여럿일 때). 목록 줄에는 ⋮ 를 두지 않는다 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: kit.card.head.contentBottom }}>
            <span style={{ display: 'flex', flex: '1 1 0%', minWidth: 0, alignItems: 'center', gap: 6, fontFamily: kit.card.title.fontFamily, fontSize: kit.card.title.fontSize, lineHeight: kit.card.title.lineHeight, fontWeight: kit.card.title.fontWeight, color: tone(kit, 'fg-neutral', mode) }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{memo.title}</span>
              {pinned && <span style={{ fontSize: 12, lineHeight: '16px', fontWeight: 700, color: tone(kit, 'fg-brand', mode) }}>고정됨</span>}
            </span>
            <ResponsiveMenu kit={kit} ov={ov} mode={mode} groups={groups} title={memo.title} label={label} onAction={act} trigger={(r) => <KebabTrigger look={kebab} mode={mode} label={label} render={r} />} />
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 13, lineHeight: '18px', color: tone(kit, 'fg-neutral-subtle', mode) }}>{memo.sub}</p>
          {MEMO_TEXT.map((t) => (
            <p key={t} style={{ margin: 0, fontSize: 15, lineHeight: '24px', color: tone(kit, 'fg-neutral', mode) }}>
              {t}
            </p>
          ))}
        </>
      )}
      <Status kit={kit} mode={mode}>
        {status}
      </Status>
      <ConfirmDelete
        ov={ov}
        mode={mode}
        open={asking}
        title="메모를 삭제할까요?"
        description={`‘${memo.title}’ 메모를 지우면 되돌릴 수 없어요.`}
        onCancel={() => setAsking(false)}
        onConfirm={() => {
          setAsking(false);
          setGone(true);
          setStatus(`‘${memo.title}’ 메모를 삭제했어요.`);
        }}
      />
    </DemoFrame>
  );
}

// ── Menu 코드 — HR 직원 표의 ⋮(늘 1280 이상인 자리라 Menu) ──────
export function PeopleMenuDemo({ kit, ov, kebab, mode = 'auto' }: { kit: MenuKit; ov: OvKit; kebab: ButtonLook; mode?: ViewMode }) {
  const [people, setPeople] = useState(PEOPLE.map((p, i) => ({ ...p, hasLeave: i !== PEOPLE.length - 1 })));
  const [status, setStatus] = useState('');
  const [asking, setAsking] = useState<string | null>(null);
  const groups = (hasLeave: boolean): MenuGroup[] => [
    { items: [{ value: 'edit', label: '수정' }, { value: 'reset', label: '비밀번호 초기화', description: '새 비밀번호를 메일로 보내요.' }, { value: 'export', label: '휴가 내역 내보내기', disabled: !hasLeave }] },
    { items: [{ value: 'delete', label: '삭제', tone: 'critical' }] },
  ];
  const act = (name: string) => (v: string) => {
    if (v === 'edit') setStatus(`${name} 님의 정보 수정 화면을 열어요.`);
    else if (v === 'reset') setStatus(`${name} 님에게 새 비밀번호를 메일로 보냈어요.`);
    else if (v === 'export') setStatus(`${name} 님의 휴가 내역을 내려받았어요.`);
    else if (v === 'delete') setAsking(name);
  };
  return (
    <DemoFrame kit={kit} mode={mode} w={520}>
      <div style={{ fontFamily: kit.card.title.fontFamily, fontSize: kit.card.title.fontSize, lineHeight: kit.card.title.lineHeight, fontWeight: kit.card.title.fontWeight, color: tone(kit, 'fg-neutral', mode), paddingBottom: kit.card.head.contentBottom }}>직원</div>
      {people.map((p, i) => (
        <div key={p.name} style={rowLine(kit, mode, i === people.length - 1)}>
          <RowText kit={kit} mode={mode} title={p.name} sub={`${p.team} · ${p.role} · ${p.joined} 입사`} />
          <MenuControl look={kit.menu} mode={mode} groups={groups(p.hasLeave)} onAction={act(p.name)} trigger={(r) => <KebabTrigger look={kebab} mode={mode} label={`${p.name} 더보기`} render={r} />} />
        </div>
      ))}
      <Status kit={kit} mode={mode}>
        {status || '이도윤 님은 휴가 내역이 없어 "휴가 내역 내보내기" 가 막혀 있어요.'}
      </Status>
      <ConfirmDelete
        ov={ov}
        mode={mode}
        open={!!asking}
        title="직원을 삭제할까요?"
        description={asking ? `${asking} 님의 계정과 휴가 기록이 함께 지워져요.` : ''}
        onCancel={() => setAsking(null)}
        onConfirm={() => {
          if (asking) {
            setPeople((all) => all.filter((x) => x.name !== asking));
            setStatus(`${asking} 님을 삭제했어요.`);
          }
          setAsking(null);
        }}
      />
    </DemoFrame>
  );
}

// ── Menu Sheet 코드 — 메모 화면 머리 더보기(늘 시트) ──────────
export function HeaderSheetDemo({ kit, ov, kebab, groups, mode = 'auto' }: { kit: MenuKit; ov: OvKit; kebab: ButtonLook; groups: MenuGroup[]; mode?: ViewMode }) {
  const [status, setStatus] = useState('');
  const names = Object.fromEntries(groups.flatMap((g) => g.items).map((i) => [i.value, i.label]));
  return (
    <DemoFrame kit={kit} mode={mode} w={400}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: 17, lineHeight: '24px', fontWeight: 700, color: tone(kit, 'fg-neutral', mode) }}>메모</span>
        <MenuSheetControl look={kit.sheet} ov={ov.ov} mode={mode} title="메모" groups={groups} label="메모 더보기" onAction={(v) => setStatus(`고른 동작: ${names[v]} — 시트가 닫힌 뒤 실행했어요.`)} trigger={(r) => <KebabTrigger look={kebab} mode={mode} label="메모 더보기" render={r} />} />
      </div>
      {MEMOS.map((m, i) => (
        <div key={m.title} style={rowLine(kit, mode, i === MEMOS.length - 1)}>
          <RowText kit={kit} mode={mode} title={m.title} sub={m.sub} />
        </div>
      ))}
      <Status kit={kit} mode={mode}>
        {status}
      </Status>
    </DemoFrame>
  );
}

// ── Menu Sheet 코드 — 글만(가운데 정렬) · 사진 ─────────────────
export function PhotoSheetDemo({ kit, ov, button, groups, mode = 'auto' }: { kit: MenuKit; ov: OvKit; button: ButtonLook; groups: MenuGroup[]; mode?: ViewMode }) {
  const [hasPhoto, setHasPhoto] = useState(true);
  const [status, setStatus] = useState('');
  const [asking, setAsking] = useState(false);
  const shown: MenuGroup[] = hasPhoto ? groups : groups.slice(0, 1);
  return (
    <DemoFrame kit={kit} mode={mode} w={360}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <span
          aria-label={hasPhoto ? '프로필 사진' : '프로필 사진 없음'}
          role="img"
          style={{
            display: 'grid',
            placeItems: 'center',
            width: 72,
            height: 72,
            borderRadius: 9999,
            background: hasPhoto ? `linear-gradient(135deg, ${tone(kit, 'chart-green-weak', mode)}, ${tone(kit, 'chart-blue-weak', mode)})` : tone(kit, 'bg-neutral-weak', mode),
            color: tone(kit, hasPhoto ? 'chart-blue-contrast' : 'fg-neutral-subtle', mode),
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          {hasPhoto ? '' : '김'}
        </span>
        <MenuSheetControl
          look={kit.sheet}
          ov={ov.ov}
          mode={mode}
          title="사진"
          layout="textOnly"
          groups={shown}
          label="사진 바꾸기"
          onAction={(v) => {
            if (v === 'remove') setAsking(true);
            else setStatus(v === 'album' ? '앨범을 열어요.' : '카메라를 열어요.');
          }}
          trigger={(r) => <ButtonView look={button} mode={mode} label="사진 바꾸기" buttonRef={r.ref as (el: HTMLButtonElement | null) => void} rootProps={r.props} />}
        />
      </div>
      <Status kit={kit} mode={mode}>
        {status}
      </Status>
      <ConfirmDelete
        ov={ov}
        mode={mode}
        open={asking}
        title="사진을 지울까요?"
        description="지운 사진은 되돌릴 수 없어요."
        onCancel={() => setAsking(false)}
        onConfirm={() => {
          setHasPhoto(false);
          setAsking(false);
          setStatus('사진을 지웠어요.');
        }}
      />
    </DemoFrame>
  );
}

// ── 플레이그라운드 공통 ───────────────────────────────────
function PlayFrame({ stage, controls, code, surface }: { stage: ReactNode; controls: ReactNode; code: string; surface: string }) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-fd-border">
      <div className="flex items-center justify-center px-4 py-8" style={{ background: surface }}>
        {stage}
      </div>
      <div className="grid gap-4 border-t border-fd-border bg-fd-card p-5 sm:grid-cols-2">{controls}</div>
      <pre className="overflow-x-auto border-t border-fd-border bg-fd-secondary/50 px-5 py-4 text-[13px] leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}
const YES_NO = [
  ['yes', '있음'],
  ['no', '없음'],
] as const;
const LUCIDE: Record<string, string> = { pin: 'Pin', pencil: 'Pencil', copy: 'Copy', trash: 'Trash2', undo: 'Undo2', users: 'Users' };
const attr = (on: boolean, s: string) => (on ? ` ${s}` : '');

// ── Menu 플레이그라운드 — Desk 거래 상세 머리의 ⋮(목록 줄을 눌러 들어간 화면) ───────────────────
export function MenuPlayground({ kits, ovs, kebabs }: { kits: Record<Brand, MenuKit>; ovs: Record<Brand, OvKit>; kebabs: Record<Brand, ButtonLook> }) {
  const [brand, setBrand] = useState<Brand>('desk');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [icon, setIcon] = useState<'yes' | 'no'>('yes');
  const [desc, setDesc] = useState<'yes' | 'no'>('yes');
  const [label, setLabel] = useState<'yes' | 'no'>('yes');
  const [crit, setCrit] = useState<'yes' | 'no'>('yes');
  const [dis, setDis] = useState<'yes' | 'no'>('no');
  const [status, setStatus] = useState('');
  const [asking, setAsking] = useState(false);
  const kit = kits[brand];
  const groups = useMemo<MenuGroup[]>(() => {
    const i = (it: MenuItem): MenuItem => (icon === 'yes' ? it : { ...it, icon: undefined });
    const g: MenuGroup[] = [
      { items: [i({ value: 'edit', label: '수정', icon: 'pencil' }), i({ value: 'duplicate', label: '복사해 새로 쓰기', icon: 'copy' })] },
      {
        label: label === 'yes' ? '정산' : undefined,
        items: [i({ value: 'refund', label: '환불 기록', icon: 'undo', description: desc === 'yes' ? '돌려받은 돈을 붙여요.' : undefined, disabled: dis === 'yes' }), i({ value: 'split', label: '나눠 내기', icon: 'users' })],
      },
    ];
    if (crit === 'yes') g.push({ items: [i({ value: 'delete', label: '삭제', icon: 'trash', tone: 'critical' })] });
    return g;
  }, [icon, desc, label, crit, dis]);
  const names: Record<string, string> = { edit: '수정', duplicate: '복사해 새로 쓰기', refund: '환불 기록', split: '나눠 내기', delete: '삭제' };
  const item = (it: MenuItem, fn: string) =>
    `      <MenuItem${it.icon ? ` icon={<${LUCIDE[it.icon]} />}` : ''} label="${it.label}"${it.description ? ` description="${it.description}"` : ''}${attr(!!it.disabled, 'disabled')}${it.tone === 'critical' ? ' tone="critical"' : ''} onSelect={${fn}} />`;
  const fns: Record<string, string> = { edit: 'edit', duplicate: 'duplicate', refund: 'recordRefund', split: 'splitBill', delete: 'askDelete' };
  const code = [
    `import { Menu, MenuContent, MenuGroup,${label === 'yes' ? ' MenuGroupLabel,' : ''} MenuItem, MenuTrigger } from "@/components/ui/menu"`,
    '',
    '<Menu>',
    '  <MenuTrigger asChild>',
    '    <Button variant="ghost" layout="iconOnly" aria-label="점심 식사 더보기">',
    '      <EllipsisVertical />',
    '    </Button>',
    '  </MenuTrigger>',
    '  <MenuContent>',
    ...groups.flatMap((g) => ['    <MenuGroup>', ...(g.label ? [`      <MenuGroupLabel>${g.label}</MenuGroupLabel>`] : []), ...g.items.map((it) => item(it, fns[it.value])), '    </MenuGroup>']),
    '  </MenuContent>',
    '</Menu>',
  ].join('\n');
  return (
    <PlayFrame
      surface={tone(kit, 'bg-layer-basement', mode)}
      stage={
        <div className="w-full max-w-[400px]" data-brand={brand}>
          {/* 카드 — card.yaml 의 면(1px 테두리 · 모서리 16 · 여백 24). 거래 상세의 머리 — 제목 + 오른쪽 ⋮ 하나(목록 줄에는 ⋮ 를 두지 않는다) */}
          <div style={{ boxSizing: 'border-box', borderRadius: kit.card.radius, borderWidth: kit.card.borderW, borderStyle: 'solid', borderColor: tone(kit, 'stroke-neutral-weak', mode), padding: kit.card.pad, background: tone(kit, 'bg-layer-default', mode), fontFamily: FONT }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span aria-hidden style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 9999, background: tone(kit, 'chart-orange-weak', mode), color: tone(kit, 'chart-orange-contrast', mode), fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                점
              </span>
              <RowText kit={kit} mode={mode} title="점심 식사" sub="식비 · 현대카드 M · −12,000원" />
              <MenuControl
                look={kit.menu}
                mode={mode}
                groups={groups}
                onAction={(v) => (v === 'delete' ? setAsking(true) : setStatus(`고른 동작: ${names[v]} — 메뉴가 닫힌 뒤 실행했어요.`))}
                trigger={(r) => <KebabTrigger look={kebabs[brand]} mode={mode} label="점심 식사 더보기" render={r} />}
              />
            </div>
          </div>
          <Status kit={kit} mode={mode}>
            {status || '⋮ 를 누르거나, Tab 으로 옮긴 뒤 ↓ 로 열어 보세요.'}
          </Status>
          <ConfirmDelete ov={ovs[brand]} mode={mode} open={asking} title="거래를 삭제할까요?" description="삭제한 거래는 되돌릴 수 없어요." onCancel={() => setAsking(false)} onConfirm={() => (setAsking(false), setStatus('거래를 삭제했어요.'))} />
        </div>
      }
      controls={
        <>
          <Seg label="아이콘" value={icon} options={YES_NO} onChange={setIcon} />
          <Seg label="설명(환불 기록)" value={desc} options={YES_NO} onChange={setDesc} />
          <Seg label="묶음 이름" value={label} options={YES_NO} onChange={setLabel} />
          <Seg label="위험한 동작(삭제)" value={crit} options={YES_NO} onChange={setCrit} />
          <Seg label="막힌 줄(환불 기록)" value={dis} options={YES_NO} onChange={setDis} />
          <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
        </>
      }
      code={code}
    />
  );
}

// ── Menu Sheet 플레이그라운드 — 폰의 메모 화면 머리 ⋮(목록 줄을 눌러 들어간 화면) ────────────────
export function MenuSheetPlayground({ kits, ovs, kebabs }: { kits: Record<Brand, MenuKit>; ovs: Record<Brand, OvKit>; kebabs: Record<Brand, ButtonLook> }) {
  const [brand, setBrand] = useState<Brand>('desk');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [layout, setLayout] = useState<MenuSheetLayout>('textWithIcon');
  const [head, setHead] = useState<'title' | 'both' | 'none'>('title');
  const [count, setCount] = useState<'two' | 'one'>('two');
  const [desc, setDesc] = useState<'yes' | 'no'>('no');
  const [crit, setCrit] = useState<'yes' | 'no'>('yes');
  const [dis, setDis] = useState<'yes' | 'no'>('no');
  const [status, setStatus] = useState('');
  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  const kit = kits[brand];
  const iconOn = layout === 'textWithIcon';
  const groups = useMemo<MenuGroup[]>(() => {
    const i = (it: MenuItem): MenuItem => ({ ...it, icon: iconOn ? it.icon : undefined, description: iconOn ? it.description : undefined });
    const main = [
      i({ value: 'pin', label: '고정', icon: 'pin', disabled: dis === 'yes' }),
      i({ value: 'edit', label: '수정', icon: 'pencil' }),
      i({ value: 'duplicate', label: '복사해 새로 쓰기', icon: 'copy', description: desc === 'yes' ? '제목 뒤에 (사본)을 붙여 새 메모로 만들어요.' : undefined }),
    ];
    const del = crit === 'yes' ? [i({ value: 'delete', label: '삭제', icon: 'trash', tone: 'critical' })] : [];
    if (count === 'one' || !del.length) return [{ items: [...main, ...del] }];
    return [{ items: main }, { items: del }];
  }, [iconOn, desc, crit, dis, count]);
  const names: Record<string, string> = { pin: '고정', edit: '수정', duplicate: '복사해 새로 쓰기', delete: '삭제' };
  const title = head === 'none' ? undefined : '주간 회의 메모';
  const description = head === 'both' ? '10월 2일에 쓴 메모예요.' : undefined;
  const fns: Record<string, string> = { pin: 'pin', edit: 'edit', duplicate: 'duplicate', delete: 'askDelete' };
  const code = [
    'import {',
    '  MenuSheet, MenuSheetContent, MenuSheetGroup, MenuSheetItem, MenuSheetTrigger,',
    '} from "@/components/ui/menu-sheet"',
    '',
    '<MenuSheet>',
    '  <MenuSheetTrigger asChild>',
    '    <Button variant="ghost" layout="iconOnly" aria-label="주간 회의 메모 더보기">',
    '      <EllipsisVertical />',
    '    </Button>',
    '  </MenuSheetTrigger>',
    `  <MenuSheetContent${title ? ` title="${title}"` : ' aria-label="주간 회의 메모 더보기"'}${description ? ` description="${description}"` : ''}${layout === 'textOnly' ? ' layout="textOnly"' : ''}>`,
    ...groups.flatMap((g) => [
      '    <MenuSheetGroup>',
      ...g.items.map(
        (it) =>
          `      <MenuSheetItem${it.icon ? ` icon={<${LUCIDE[it.icon]} />}` : ''} label="${it.label}"${it.description ? ` description="${it.description}"` : ''}${attr(!!it.disabled, 'disabled')}${it.tone === 'critical' ? ' tone="critical"' : ''} onSelect={${fns[it.value]}} />`,
      ),
      '    </MenuSheetGroup>',
    ]),
    '  </MenuSheetContent>',
    '</MenuSheet>',
  ].join('\n');
  return (
    <PlayFrame
      surface="transparent"
      stage={
        <div className="w-full max-w-[360px]">
          <div
            ref={setStage}
            data-brand={brand}
            className="relative w-full overflow-hidden"
            style={{ isolation: 'isolate', height: 520, borderRadius: 28, border: '6px solid var(--p-frame)', background: tone(kit, 'bg-layer-default', mode), fontFamily: FONT }}
          >
            {/* 메모 목록 줄을 눌러 들어간 메모 화면 — 머리 오른쪽 ⋮ 하나가 시트를 연다(목록 줄에는 ⋮ 를 두지 않는다) */}
            <div style={{ padding: '20px 24px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: kit.card.head.contentBottom }}>
                <span style={{ flex: '1 1 0%', minWidth: 0, fontFamily: kit.card.title.fontFamily, fontSize: kit.card.title.fontSize, lineHeight: kit.card.title.lineHeight, fontWeight: kit.card.title.fontWeight, color: tone(kit, 'fg-neutral', mode), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{MEMOS[0].title}</span>
                <MenuSheetControl
                  look={kit.sheet}
                  ov={ovs[brand].ov}
                  mode={mode}
                  title={title}
                  description={description}
                  layout={layout}
                  groups={groups}
                  label="주간 회의 메모 더보기"
                  container={stage}
                  onAction={(v) => setStatus(`고른 동작: ${names[v]} — 시트가 닫힌 뒤 실행했어요.`)}
                  trigger={(r) => <KebabTrigger look={kebabs[brand]} mode={mode} label="주간 회의 메모 더보기" render={r} />}
                />
              </div>
              <p style={{ margin: '0 0 8px', fontSize: 13, lineHeight: '18px', color: tone(kit, 'fg-neutral-subtle', mode) }}>{MEMOS[0].sub}</p>
              {MEMO_TEXT.map((t) => (
                <p key={t} style={{ margin: 0, fontSize: 15, lineHeight: '24px', color: tone(kit, 'fg-neutral', mode) }}>
                  {t}
                </p>
              ))}
              <Status kit={kit} mode={mode}>
                {status || '머리의 ⋮ 를 눌러 열고, 줄을 누르거나 아래로 끌어 닫아 보세요.'}
              </Status>
            </div>
          </div>
        </div>
      }
      controls={
        <>
          <Seg
            label="정렬"
            value={layout}
            options={[
              ['textWithIcon', '아이콘 + 글'],
              ['textOnly', '글만'],
            ]}
            onChange={setLayout}
          />
          <Seg
            label="머리"
            value={head}
            options={[
              ['title', '제목'],
              ['both', '제목 + 설명'],
              ['none', '없음'],
            ]}
            onChange={setHead}
          />
          <Seg
            label="묶음"
            value={count}
            options={[
              ['two', '둘(위험한 동작 따로)'],
              ['one', '하나'],
            ]}
            onChange={setCount}
          />
          <Seg label="줄 설명(아이콘 + 글만)" value={desc} options={YES_NO} onChange={setDesc} />
          <Seg label="위험한 동작(삭제)" value={crit} options={YES_NO} onChange={setCrit} />
          <Seg label="막힌 줄(고정)" value={dis} options={YES_NO} onChange={setDis} />
          <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
        </>
      }
      code={code}
    />
  );
}
