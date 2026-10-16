'use client';
// Help Bubble · Tooltip 페이지의 실제로 여닫는 미리보기 — 코드 절(규정 안내 · 거래 검색 안내 · 아이콘 버튼 · 막힌 버튼)과 플레이그라운드.
// 말풍선은 help-bubble.yaml(menu-view 의 BubbleView · HelpBubbleControl · TooltipControl), 버튼은 button.yaml(button-view)이다.
import { useState, type ReactNode } from 'react';
import type { ButtonLook } from './button-look';
import { ButtonView, type IconName } from './button-view';
import { COPY_REASON, LEAVE_RULE, SEARCH_TIP } from './menu-data';
import { mcv, type BubbleSide, type MTone, type MenuKit, type ViewMode } from './menu-shared';
import { HelpBubbleControl, TooltipControl, TooltipGroup, type TriggerRender } from './menu-view';
import { BRANDS, MODES, Seg } from './select-playground';
import { DemoFrame } from './menu-demos';
import { ncv, type NavIcon, type TopNavLook } from './nav-shared';
import { TopIconButton, TopNavBar } from './nav-view';

type Brand = 'desk' | 'hr';
const FONT = "'Pretendard Variable', Pretendard, sans-serif";
const tone = (kit: MenuKit, name: MTone, mode: ViewMode) => mcv(kit.tone[name], mode);
// Desk 웹 데스크톱 머리의 아이콘 버튼 — 알림 · 설정(2026-10-16 금액 가리기 눈은 뺐다 — Q-017-3c = Q-018-3 B)
type HeadBtn = { key: string; icon: NavIcon; label: string };
const HEAD_BUTTONS: HeadBtn[] = [
  { key: 'bell', icon: 'bell', label: '알림' },
  { key: 'settings', icon: 'settings', label: '설정' },
];
// 긴 툴팁(플레이그라운드) — 한 줄을 넘는 글은 최대 폭에서 줄을 바꾼다. 두 줄을 넘으면 Help Bubble 이다
const LONG_SETTINGS_TIP = '알림 · 금액 가리기 · 테마 · 연결한 계정을 바꾸는 설정으로 가요.';

// 트리거 — Button ghost · iconOnly(이름은 aria-label)
function IconTrigger({ look, mode, icon, label, render }: { look: ButtonLook; mode: ViewMode; icon: IconName; label: string; render: Parameters<TriggerRender>[0] }) {
  return <ButtonView look={look} mode={mode} icon={icon} ariaLabel={label} buttonRef={render.ref} rootProps={render.props} />;
}
function Status({ kit, mode, children }: { kit: MenuKit; mode: ViewMode; children: ReactNode }) {
  return (
    <p role="status" aria-live="polite" style={{ margin: '12px 0 0', minHeight: 18, fontSize: 13, lineHeight: '18px', color: tone(kit, 'fg-neutral-subtle', mode) }}>
      {children}
    </p>
  );
}

// ── Help Bubble 코드 — ⓘ 를 눌러 여는 규정 안내(HR) ──────────
export function LeaveRuleDemo({ kit, info, mode = 'auto' }: { kit: MenuKit; info: ButtonLook; mode?: ViewMode }) {
  return (
    <DemoFrame kit={kit} mode={mode} w={420}>
      <div style={{ paddingTop: 72 }}>
        <span style={{ fontSize: 13, lineHeight: '18px', color: tone(kit, 'fg-neutral-subtle', mode) }}>남은 연차</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <span style={{ fontSize: 22, lineHeight: '30px', fontWeight: 700, color: tone(kit, 'fg-neutral', mode) }}>11일</span>
          <HelpBubbleControl look={kit.bubble} mode={mode} title={LEAVE_RULE.title} description={LEAVE_RULE.description} trigger={(r) => <IconTrigger look={info} mode={mode} icon="info" label="연차 사용 규정 안내" render={r} />} />
        </div>
      </div>
    </DemoFrame>
  );
}

// ── Help Bubble 코드 — 처음부터 열어 두는 안내(닫기 버튼) ───────
const AMOUNTS: [string, string][] = [
  ['국민 주계좌', '1,250,000원'],
  ['현대카드 M', '−352,400원'],
  ['토스뱅크 통장', '820,000원'],
];
export function HideTipDemo({ kit, top, mode = 'auto' }: { kit: MenuKit; top: TopNavLook; mode?: ViewMode }) {
  const [pressed, setPressed] = useState('');
  const [seen, setSeen] = useState(false);
  const [round, setRound] = useState(0);
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  return (
    <DemoFrame kit={kit} mode={mode} w={400}>
      {/* 처음부터 열린 안내 — 화면이 자리를 잡는 동안에도 트리거를 따라가게 이 판 안에 띄운다 */}
      <div ref={setBox} style={{ position: 'relative' }}>
        {/* 상단 바(탭 첫 화면 — 큰 제목) 오른쪽의 검색(오른쪽 끝은 알림). Anchor 는 자리만 잡는다 — 누르면 원래 동작(help-bubble.md 코드) */}
        <TopNavBar
          look={top}
          mode={mode}
          type="root"
          title="홈"
          // 카드 위 끝 · 양 끝까지 — 화면의 상단 바처럼
          width={`calc(100% + ${kit.card.pad * 2}px)`}
          style={{ marginTop: -kit.card.pad, marginLeft: -kit.card.pad, marginRight: -kit.card.pad }}
          trailing={
            <>
            <HelpBubbleControl
              key={round}
              look={kit.bubble}
              mode={mode}
              title={SEARCH_TIP.title}
              description={SEARCH_TIP.description}
              closeButton
              side="bottom"
              defaultOpen={!seen}
              outsideCloses={false}
              anchorOnly
              container={box}
              onOpenChange={(o) => !o && setSeen(true)}
              trigger={(r) => <TopIconButton look={top} mode={mode} live icon="search" label="검색" onClick={() => setPressed('검색 — 거래 검색 화면으로')} buttonRef={r.ref} rootProps={r.props} />}
            />
            <TopIconButton look={top} mode={mode} live icon="bell" label="알림" onClick={() => setPressed('알림 — 알림 화면으로')} />
            </>
          }
        />
        <div style={{ paddingTop: 96 }}>
          {AMOUNTS.map(([name, amount], i) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: i === AMOUNTS.length - 1 ? 'none' : `1px solid ${tone(kit, 'stroke-neutral-subtle', mode)}` }}>
              <span style={{ fontSize: 15, lineHeight: '20px', color: tone(kit, 'fg-neutral', mode) }}>{name}</span>
              <span style={{ fontSize: 15, lineHeight: '20px', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: tone(kit, 'fg-neutral', mode) }}>{amount}</span>
            </div>
          ))}
        </div>
      </div>
      <Status kit={kit} mode={mode}>
        {seen ? (
          <>
            안내를 닫았어요 — 다시 열지 않아요.{' '}
            <button
              type="button"
              onClick={() => {
                setSeen(false);
                setRound((n) => n + 1);
              }}
              style={{ margin: 0, padding: 0, border: 0, background: 'transparent', font: 'inherit', color: tone(kit, 'fg-brand', mode), textDecoration: 'underline', cursor: 'pointer' }}
            >
              처음 상태로
            </button>
          </>
        ) : (
          pressed || '닫기 버튼으로만 닫혀요 — 바깥을 눌러도 남아 있어요.'
        )}
      </Status>
    </DemoFrame>
  );
}

// ── Tooltip 코드 — 아이콘 버튼의 이름(Desk 웹 데스크톱 머리 — 내역 추가 · 알림 · 설정) ─────
// 머리의 아이콘 버튼마다 툴팁 — 이름(aria-label)과 같은 글(tooltip.md 코드)
function HeaderTips({ kit, top, mode, onTap, tips, side = 'bottom', container, width }: { kit: MenuKit; top: TopNavLook; mode: ViewMode; onTap?: (label: string) => void; tips?: Partial<Record<string, string>>; side?: BubbleSide; container?: HTMLElement | null; width?: string | number }) {
  return (
    <TopNavBar
      look={top}
      mode={mode}
      type="desktop"
      live
      width={width}
      primary={{ label: '내역 추가', icon: 'plus' }}
      onPrimary={() => onTap?.('내역 추가')}
      trailing={
        <TooltipGroup>
          <span style={{ display: 'flex' }}>
            {HEAD_BUTTONS.map((b) => (
              <TooltipControl
                key={`${b.key}${side}${tips?.[b.key] ?? ''}`}
                look={kit.bubble}
                mode={mode}
                text={tips?.[b.key] ?? b.label}
                side={side}
                container={container}
                trigger={(r) => <TopIconButton look={top} mode={mode} live icon={b.icon} label={b.label} onClick={() => onTap?.(b.label)} buttonRef={r.ref} rootProps={r.props} />}
              />
            ))}
          </span>
        </TooltipGroup>
      }
    />
  );
}
export function ToolbarTooltipDemo({ kit, top, mode = 'auto' }: { kit: MenuKit; top: TopNavLook; mode?: ViewMode }) {
  const [status, setStatus] = useState('');
  const st = top.desktop.screenTitle;
  return (
    <DemoFrame kit={kit} mode={mode} w={460}>
      {/* 카드 위 끝 · 양 끝까지 — 데스크톱 머리처럼 */}
      <div style={{ marginTop: -kit.card.pad, marginLeft: -kit.card.pad, marginRight: -kit.card.pad, background: ncv(top.bg, mode) }}>
        <HeaderTips
          kit={kit}
          top={top}
          mode={mode}
          onTap={(label) => setStatus(`${label} — 누름`)}
        />
      </div>
      <div style={{ paddingTop: top.desktop.navToTitle, fontFamily: st.fontFamily, fontSize: st.fontSize, lineHeight: st.lineHeight, fontWeight: st.fontWeight, color: tone(kit, 'fg-neutral', mode) }}>가계부</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, fontSize: 15, lineHeight: '20px', color: tone(kit, 'fg-neutral', mode) }}>
        <span>이번 달 지출</span>
        <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>1,240,000원</span>
      </div>
      <Status kit={kit} mode={mode}>
        {status || '마우스를 올리면 잠시 뒤, Tab 으로 옮기면 바로 이름이 떠요. 손가락으로 누르면 뜨지 않아요.'}
      </Status>
    </DemoFrame>
  );
}

// ── Tooltip 코드 — 막힌 버튼의 이유는 가까운 글로 ───────────────
export function DisabledReasonDemo({ kit, weak, mode = 'auto' }: { kit: MenuKit; weak: ButtonLook; mode?: ViewMode }) {
  const [has, setHas] = useState<'no' | 'yes'>('no');
  const [status, setStatus] = useState('');
  return (
    <DemoFrame kit={kit} mode={mode} w={400}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
        <ButtonView look={weak} mode={mode} label="지난달 예산 복사" state={has === 'yes' ? 'live' : 'disabled'} rootProps={has === 'no' ? { 'aria-describedby': 'copy-reason' } : undefined} onClick={() => setStatus('지난달 예산을 복사했어요.')} />
        {has === 'no' && (
          <p id="copy-reason" style={{ margin: 0, fontSize: 13, lineHeight: '18px', color: tone(kit, 'fg-neutral-subtle', mode) }}>
            {COPY_REASON}
          </p>
        )}
      </div>
      <div className="mt-4">
        <Seg
          label="지난달 예산"
          value={has}
          options={[
            ['no', '없음'],
            ['yes', '있음'],
          ]}
          onChange={(v) => (setHas(v), setStatus(''))}
        />
      </div>
      <Status kit={kit} mode={mode}>
        {status}
      </Status>
    </DemoFrame>
  );
}

// ── 플레이그라운드 공통 ───────────────────────────────────
function PlayFrame({ stage, controls, code }: { stage: ReactNode; controls: ReactNode; code: string }) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-fd-border">
      <div className="flex items-center justify-center bg-[#E9E9EC] px-4 py-8 dark:bg-fd-muted">{stage}</div>
      <div className="grid gap-4 border-t border-fd-border bg-fd-card p-5 sm:grid-cols-2">{controls}</div>
      <pre className="overflow-x-auto border-t border-fd-border bg-fd-secondary/50 px-5 py-4 text-[13px] leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}
const SIDES = [
  ['top', '위(기본)'],
  ['bottom', '아래'],
  ['left', '왼쪽'],
  ['right', '오른쪽'],
] as const;
const YES_NO = [
  ['yes', '있음'],
  ['no', '없음'],
] as const;

// ── Help Bubble 플레이그라운드 ─────────────────────────────
export function HelpBubblePlayground({ kits, infos }: { kits: Record<Brand, MenuKit>; infos: Record<Brand, ButtonLook> }) {
  const [brand, setBrand] = useState<Brand>('hr');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [desc, setDesc] = useState<'yes' | 'no'>('yes');
  const [close, setClose] = useState<'yes' | 'no'>('no');
  const [side, setSide] = useState<BubbleSide>('top');
  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  const kit = kits[brand];
  const code = [
    'import { HelpBubble, HelpBubbleContent, HelpBubbleTrigger } from "@/components/ui/help-bubble"',
    '',
    '<HelpBubble>',
    '  <HelpBubbleTrigger asChild>',
    '    <Button variant="ghost" ghostColor="neutralSubtle" layout="iconOnly" aria-label="연차 사용 규정 안내">',
    '      <Info />',
    '    </Button>',
    '  </HelpBubbleTrigger>',
    '  <HelpBubbleContent',
    `    title="${LEAVE_RULE.title}"`,
    ...(desc === 'yes' ? [`    description="${LEAVE_RULE.description}"`] : []),
    ...(close === 'yes' ? ['    showCloseButton'] : []),
    ...(side !== 'top' ? [`    side="${side}"`] : []),
    '  />',
    '</HelpBubble>',
  ].join('\n');
  return (
    <PlayFrame
      stage={
        <div
          ref={setStage}
          data-brand={brand}
          className="relative w-full max-w-[560px] overflow-hidden rounded-xl"
          style={{ isolation: 'isolate', height: 320, background: tone(kit, 'bg-layer-default', mode), fontFamily: FONT }}
        >
          {/* 옆으로 열 때는 그쪽에 자리가 남게 트리거를 반대편으로 둔다(모자라면 뒤집힌다) */}
          <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', gap: 2, ...(side === 'right' ? { left: 24, top: '50%', transform: 'translateY(-50%)' } : side === 'left' ? { right: 24, top: '50%', transform: 'translateY(-50%)' } : { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }) }}>
            <span style={{ fontSize: 15, lineHeight: '20px', fontWeight: 600, color: tone(kit, 'fg-neutral', mode) }}>남은 연차 11일</span>
            <HelpBubbleControl
              key={`${desc}${close}${side}${brand}`}
              look={kit.bubble}
              mode={mode}
              title={LEAVE_RULE.title}
              description={desc === 'yes' ? LEAVE_RULE.description : undefined}
              closeButton={close === 'yes'}
              side={side}
              container={stage}
              trigger={(r) => <IconTrigger look={infos[brand]} mode={mode} icon="info" label="연차 사용 규정 안내" render={r} />}
            />
          </div>
        </div>
      }
      controls={
        <>
          <Seg label="설명" value={desc} options={YES_NO} onChange={setDesc} />
          <Seg label="닫기 버튼" value={close} options={YES_NO} onChange={setClose} />
          <Seg label="위치" value={side} options={SIDES} onChange={setSide} />
          <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
        </>
      }
      code={code}
    />
  );
}

// ── Tooltip 플레이그라운드 ────────────────────────────────
export function TooltipPlayground({ kits, tops }: { kits: Record<Brand, MenuKit>; tops: Record<Brand, TopNavLook> }) {
  const [brand, setBrand] = useState<Brand>('desk');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [len, setLen] = useState<'short' | 'long'>('short');
  const [side, setSide] = useState<BubbleSide>('top');
  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  const kit = kits[brand];
  const top = tops[brand];
  const code = [
    'import { Settings } from "lucide-react"',
    'import { TopNavigationIconButton } from "@/components/ui/top-navigation"',
    'import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"',
    '',
    '{/* 화면에 한 번 — 이어서 여는 툴팁은 기다리지 않는다 */}',
    '<TooltipProvider>',
    '  <Tooltip>',
    '    <TooltipTrigger asChild>',
    '      <TopNavigationIconButton aria-label="설정" onClick={openSettings}><Settings /></TopNavigationIconButton>',
    '    </TooltipTrigger>',
    `    <TooltipContent${side !== 'top' ? ` side="${side}"` : ''}>${len === 'long' ? LONG_SETTINGS_TIP : '설정'}</TooltipContent>`,
    '  </Tooltip>',
    '</TooltipProvider>',
  ].join('\n');
  // 머리를 판 가운데 · 툴팁 쪽의 반대편에 둔다 — 고른 위치로 열릴 자리를 남긴다
  const place = side === 'right' ? { left: 24, top: '50%', transform: 'translateY(-50%)' } : side === 'left' ? { right: 24, top: '50%', transform: 'translateY(-50%)' } : side === 'top' ? { left: '50%', bottom: 24, transform: 'translateX(-50%)' } : { left: '50%', top: 24, transform: 'translateX(-50%)' };
  return (
    <PlayFrame
      stage={
        <div ref={setStage} data-brand={brand} className="relative w-full max-w-[560px] overflow-hidden rounded-xl" style={{ isolation: 'isolate', height: 260, background: tone(kit, 'bg-layer-basement', mode), fontFamily: FONT }}>
          <div style={{ position: 'absolute', borderRadius: 12, background: ncv(top.bg, mode), ...place }}>
            <HeaderTips kit={kit} top={top} mode={mode} tips={{ settings: len === 'long' ? LONG_SETTINGS_TIP : '설정' }} side={side} container={stage} width="max-content" />
          </div>
        </div>
      }
      controls={
        <>
          <Seg
            label="글(설정)"
            value={len}
            options={[
              ['short', '짧게(이름)'],
              ['long', '길게 — 두 줄'],
            ]}
            onChange={setLen}
          />
          <Seg label="위치" value={side} options={SIDES} onChange={setSide} />
          <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
        </>
      }
      code={code}
    />
  );
}
